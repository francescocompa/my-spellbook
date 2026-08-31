#!/usr/bin/env python3
"""Extract a spell-eligibility digest from a 5etools data mirror (v2).

Captures enough to drive: multiclass slots, per-class prepared budgets with the
static-caster swap distribution, a source selector, reprint de-duplication, and
rich nested spell filters. Emits data.json consumed by the single-page tool.
"""
import json, glob, os, re, sys
from collections import Counter, defaultdict

MIRROR = sys.argv[1] if len(sys.argv) > 1 else \
    "/Users/francescocompagnoni/Documents/D&D/5etool_mirror/5etools-v2.33.3/data"

# ---- helpers ---------------------------------------------------------------
def rich_strip(s):
    if not isinstance(s, str):
        return s
    def repl(m):
        body = m.group(0)[2:-1]
        parts = body.split(" ", 1)
        rest = parts[1] if len(parts) > 1 else ""
        segs = rest.split("|")
        txt = segs[0].strip() if segs and segs[0].strip() else rest
        # a display name may end in a [disambiguator] 5etools' own renderer drops
        bare = re.sub(r"\s*\[[^\]]*\]$", "", txt).strip()
        return bare if bare else txt
    prev = None; out = s
    while prev != out:
        prev = out; out = re.sub(r"\{@[^{}]+\}", repl, out)
    return out

def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def spell_key(name, source):
    return f"{name.lower()}|{source.lower()}"

# A record with no usable name can't be indexed (the app lowercases names at boot) —
# skip it rather than emit a record that bricks buildIndexes(). Keep identical to
# extract.js's validName.
def valid_name(x):
    n = x.get("name")
    return isinstance(n, str) and bool(n.strip())

def reprinted(obj):
    return bool(obj.get("reprintedAs"))

def superseded_by(obj):
    """The FIRST `reprintedAs` entry, normalized to a plain uid string (D127), or None.

    5etools writes the field in TWO shapes: a bare uid ("Aberrant|Sorcerer|XPHB|XPHB")
    and an object {"uid": …, "tag": …} whose tag may name a DIFFERENT entity type — a
    2014 optional feature is reprinted as a 2024 FEAT, a Dragonmark subrace as a feat.
    The tag is deliberately dropped: the app resolves the uid against every same-shaped
    index and treats an unresolvable pointer as UNKNOWN, never as "excluded" (D31).
    **extract.js carries the same function — keep the two identical.**
    """
    ra = obj.get("reprintedAs")
    if not ra: return None
    if not isinstance(ra, list): ra = [ra]
    for e in ra:
        if isinstance(e, str) and e.strip(): return e.strip()
        if isinstance(e, dict):
            u = e.get("uid")
            if isinstance(u, str) and u.strip(): return u.strip()
    return None

# ---- `_copy` resolution (D127) ---------------------------------------------
# 5etools ships every classic (2014) subclass TWICE: once attached to its 2014 class, and
# once as a `_copy` record re-attached to the 2024 class. The copy carries nothing but the
# reference, so an extractor that never resolves it emits a HOLLOW twin — no grants, no
# caster progression, and `reprinted` false because its `reprintedAs` hides inside
# `_copy._preserve` as an INSTRUCTION rather than a value. 73 subclasses lost every spell
# grant they have to that twin.
#
# The rule, matching 5etools' own copy semantics for the shapes actually shipped:
#   • the parent must live in the SAME FILE (all 124 current subclass copies do);
#   • the merge is SHALLOW — the parent's fields first, the copy's own fields overriding;
#   • copy-meta fields (page, srd, reprintedAs, …) are printing-specific and are DROPPED
#     unless `_copy._preserve` names them — that is exactly how `reprintedAs` reaches the
#     twin, and why a naive `{**parent, **child}` would be wrong;
#   • a `_copy` carrying `_mod`/`_templates` is a merge LANGUAGE, not a copy. There are
#     none among subclasses today; the day 5etools adds one the record is emitted
#     UNRESOLVED and counted, rather than silently half-merged.
# Races are deliberately NOT run through this: 15 of their 16 `_copy` records carry `_mod`
# with entry-level replaceArr/appendArr ops and point at parents in other BOOKS — a
# different shape wearing the same field name.
# **extract.js carries the same logic — keep the two identical.**
_COPY_NEEDS_PRESERVE = {"page", "otherSources", "additionalSources", "reprintedAs",
                        "srd", "srd52", "basicRules", "basicRules2024", "freeRules2024",
                        "hasFluff", "hasFluffImages", "hasToken", "isReprinted", "_versions"}
COPY_UNRESOLVED = []       # [(label, why)] — reported in the run summary

def resolve_copies(items, keyfn, label):
    """Resolve same-file `_copy` records in a raw 5etools array; unresolvable ones pass
       through untouched and are recorded in COPY_UNRESOLVED."""
    if not items: return items
    idx = {}
    for x in items:
        if isinstance(x, dict) and not x.get("_copy"): idx[keyfn(x)] = x
    out = []
    for x in items:
        cp = x.get("_copy") if isinstance(x, dict) else None
        if not cp:
            out.append(x); continue
        why = None
        if cp.get("_mod") or cp.get("_templates"): why = "_copy carries _mod"
        parent = idx.get(keyfn(cp))
        if why is None and parent is None: why = "parent not in the same file"
        if why:
            COPY_UNRESOLVED.append((f"{label} {x.get('name')}|{x.get('source')}", why))
            out.append(x); continue
        preserve = cp.get("_preserve") or {}
        merged = {k: v for k, v in parent.items()
                  if k not in _COPY_NEEDS_PRESERVE or preserve.get(k)}
        for k, v in x.items():
            if k != "_copy": merged[k] = v
        out.append(merged)
    return out

def _sub_copy_key(s):
    return (s.get("className"), s.get("classSource"),
            s.get("shortName") or s.get("name"), s.get("source"))

# ---- sources / books -------------------------------------------------------
books = {}
try:
    for b in load(os.path.join(MIRROR, "books.json")).get("book", []):
        if b.get("source"):
            books[b["source"]] = {"name": b.get("name", b["source"]),
                                  "group": b.get("group", "other")}
except FileNotFoundError:
    pass
# also pull adventure/source names if present
def bname(src): return books.get(src, {}).get("name", src)
def bgroup(src): return books.get(src, {}).get("group", "other")

# ---- spells ----------------------------------------------------------------
SCHOOL = {"A": "Abjuration", "C": "Conjuration", "D": "Divination",
          "E": "Enchantment", "V": "Evocation", "I": "Illusion",
          "N": "Necromancy", "T": "Transmutation", "P": "Psionic"}
COND = None

def cast_time(sp):
    t = (sp.get("time") or [{}])[0]
    n = t.get("number", 1); u = t.get("unit", "action")
    if u == "action": return "action", "action"
    if u == "bonus": return "bonus action", "bonus"
    if u == "reaction": return "reaction", "reaction"
    lbl = f"{n} {u}" + ("s" if n != 1 else "")
    return lbl, "long"

def range_str(sp):
    r = sp.get("range") or {}
    typ = r.get("type"); dist = r.get("distance") or {}
    if typ == "point":
        dt = dist.get("type")
        if dt == "self": return "Self", "self"
        if dt == "touch": return "Touch", "touch"
        if dt in ("feet", "miles"):
            return f"{dist.get('amount','')} {dt}", "ranged"
        if dt == "sight": return "Sight", "ranged"
        if dt == "unlimited": return "Unlimited", "ranged"
        return dt or "—", "ranged"
    # 2024 renamed the self-centred shapes; "emanation" is the common one
    if typ in ("radius", "sphere", "cone", "line", "cube", "hemisphere", "cylinder", "emanation"):
        return f"Self ({dist.get('amount','')} ft {typ})", "self"
    if typ == "special": return "Special", "special"
    if typ == "sight": return "Sight", "ranged"
    if typ == "unlimited": return "Unlimited", "ranged"
    return (typ or "—"), "ranged"

def components(sp):
    c = sp.get("components") or {}
    m = c.get("m")
    mat = m.get("text") if isinstance(m, dict) else (m if isinstance(m, str) else None)
    # cost is in copper pieces; consume is True / "optional" when the spell eats the material
    cost = m.get("cost") if isinstance(m, dict) else None
    consume = m.get("consume") if isinstance(m, dict) else None
    return {"v": bool(c.get("v")), "s": bool(c.get("s")), "m": bool(m),
            "mat": rich_strip(mat) if mat else None,
            "cost": cost or None, "consume": (consume if consume else False)}

def duration_text(sp):
    d = (sp.get("duration") or [{}])[0]
    t = d.get("type")
    if t == "instant": return "Instantaneous"
    if t == "permanent": return "Until dispelled" + ("/triggered" if "trigger" in (d.get("ends") or []) else "")
    if t == "special": return "Special"
    if t == "timed":
        dd = d.get("duration") or {}
        return f"{dd.get('amount','')} {dd.get('type','')}" + ("s" if dd.get('amount',0) != 1 else "")
    return "—"

def flatten_entries(entries, strip=None):
    """`strip` swaps the tag-stripper: stat blocks need sb_text, which expands the
       tags that carry their meaning in the tag name ({@h}, {@atkr}, {@actSave})."""
    strip = strip or rich_strip
    out = []
    for e in entries or []:
        if isinstance(e, str): out.append(strip(e))
        elif isinstance(e, dict):
            if e.get("name"): out.append(strip(e["name"]) + ".")
            out += flatten_entries(e.get("entries"), strip)
            for it in e.get("items", []):
                if isinstance(it, str): out.append("• " + strip(it))
                elif isinstance(it, dict): out.append("• " + strip(it.get("name", "")) + " " + " ".join(flatten_entries(it.get("entries") or it.get("entry") and [it["entry"]] or [], strip)))
    return [x for x in out if x]

spells = {}
for f in glob.glob(os.path.join(MIRROR, "spells", "spells-*.json")):
    for sp in load(f).get("spell", []):
        if not valid_name(sp): continue
        src = sp.get("source", "")
        key = spell_key(sp["name"], src)
        dur = (sp.get("duration") or [{}])[0]
        tlabel, tcat = cast_time(sp)
        rlabel, rcat = range_str(sp)
        spells[key] = {
            "name": sp["name"], "source": src, "group": bgroup(src), "book": bname(src),
            "level": sp.get("level", 0),
            "school": SCHOOL.get(sp.get("school", ""), sp.get("school", "")),
            "time": tlabel, "tcat": tcat,
            "range": rlabel, "rcat": rcat,
            "comp": components(sp),
            "ritual": bool((sp.get("meta") or {}).get("ritual")),
            "conc": bool(dur.get("concentration")),
            "dmg": sorted(set(sp.get("damageInflict") or [])),
            "cond": sorted(set(sp.get("conditionInflict") or [])),
            "save": sorted(set(sp.get("savingThrow") or [])),
            "atk": bool(sp.get("spellAttack")),
            "durTxt": duration_text(sp),
            "desc": flatten_entries(sp.get("entries")),
            "higher": flatten_entries(sp.get("entriesHigherLevel")),
            "reprinted": reprinted(sp),
            "supersededBy": superseded_by(sp),
            "page": sp.get("page"),
            # truthy = in SRD 5.2; a STRING is the spell's LICENSED name (5etools carries
            # the SRD rename for the 17 product-identity spells) — _srd_subset applies it
            "srd": (sp.get("srd52") or False),
            "cls": [], "sub": [], "feat": [], "race": [],
            # raw entries, kept only until creature sets are resolved (popped before emit):
            # rich_strip() eats {@creature}/{@filter} on the way into `desc`
            "_raw": json.dumps([sp.get("entries"), sp.get("entriesHigherLevel")], ensure_ascii=False),
        }

# ---- spell -> source access lookup -----------------------------------------
lookup = load(os.path.join(MIRROR, "generated", "gendata-spell-source-lookup.json"))
for src_l, byname in lookup.items():
    for name_l, acc in byname.items():
        sp = spells.get(f"{name_l}|{src_l}")
        if not sp: continue
        for csrc, cmap in (acc.get("class") or {}).items():
            for cls in cmap: sp["cls"].append([cls, csrc])
        for ssrc, clsmap in (acc.get("subclass") or {}).items():
            for cls, bysrc in clsmap.items():
                for scsrc, submap in bysrc.items():
                    for sub, meta in submap.items():
                        nm = meta.get("name", sub) if isinstance(meta, dict) else sub
                        sp["sub"].append([cls, nm, scsrc])
        for fsrc, fmap in (acc.get("feat") or {}).items():
            for ft in fmap: sp["feat"].append([ft, fsrc])
        for rsrc, rmap in (acc.get("race") or {}).items():
            for rc in rmap: sp["race"].append([rc, rsrc])

# ---- summon stat blocks ----------------------------------------------------
# A handful of spells conjure a creature whose stat block the book prints beside
# them. 5etools flags those monsters with `summonedBySpell`, which is a far more
# reliable hook than parsing {@creature} refs out of the spell text: it names the
# spell directly, so no cross-source false positives.
SIZE_NAME = {"T": "Tiny", "S": "Small", "M": "Medium", "L": "Large",
             "H": "Huge", "G": "Gargantuan"}
ALIGN_NAME = {"L": "Lawful", "N": "Neutral", "C": "Chaotic", "G": "Good", "E": "Evil",
              "U": "Unaligned", "A": "Any alignment", "NX": "Neutral", "NY": "Neutral"}
# stat-block-only rich tags. rich_strip() keeps the first segment of a {@tag …},
# which is right for @damage/@condition/@action but wrong for these — they carry
# their meaning in the TAG, not the body, so expand them before stripping.
SB_TAGS = [
    (re.compile(r"\{@atkr ([^}]*)\}"),
     lambda m: _atk_label(m.group(1), " Attack Roll:")),
    (re.compile(r"\{@atk ([^}]*)\}"),
     lambda m: _atk_label(m.group(1), " Attack:")),
    (re.compile(r"\{@actSave (\w+)\}"),
     lambda m: ABILITY_FULL.get(m.group(1).lower(), m.group(1).title()) + " Saving Throw:"),
    (re.compile(r"\{@actSaveFail(?:\|[^}]*)?\}"), lambda m: "Failure:"),
    (re.compile(r"\{@actSaveSuccess(?:\|[^}]*)?\}"), lambda m: "Success:"),
    (re.compile(r"\{@actTrigger\}"), lambda m: "Trigger:"),
    (re.compile(r"\{@actResponse(?:\s[^}]*)?\}"), lambda m: "Response:"),
    (re.compile(r"\{@h\}"), lambda m: "Hit: "),
    (re.compile(r"\{@hit ([+\-]?\d+)\}"), lambda m: ("+" + m.group(1)) if m.group(1)[0].isdigit() else m.group(1)),
]
ABILITY_FULL = {"str": "Strength", "dex": "Dexterity", "con": "Constitution",
                "int": "Intelligence", "wis": "Wisdom", "cha": "Charisma"}
ATK_WORD = {"m": "Melee", "r": "Ranged", "mw": "Melee Weapon", "rw": "Ranged Weapon",
            "ms": "Melee Spell", "rs": "Ranged Spell"}

def _atk_label(body, suffix):
    parts = [ATK_WORD.get(x.strip().lower(), x.strip()) for x in body.split(",") if x.strip()]
    if len(parts) > 1:
        head = [p.rsplit(" ", 1)[0] if " " in p else p for p in parts]
        tail = parts[-1].rsplit(" ", 1)[-1] if " " in parts[-1] else ""
        return " or ".join(head) + ((" " + tail) if tail and tail not in head else "") + suffix
    return (parts[0] if parts else body) + suffix

def sb_text(s):
    """rich_strip for stat-block prose, plus the tags only monsters use."""
    if not isinstance(s, str): return s
    for rx, fn in SB_TAGS: s = rx.sub(fn, s)
    # the summon stat blocks scale off the spell slot they were cast with
    s = s.replace("summonSpellLevel", "the spell's level")
    return re.sub(r"\s{2,}", " ", rich_strip(s)).strip()

def sb_entries(arr):
    """[{name, entries}] -> [{name, text:[…]}], names kept as their own field so the
       app can render them as run-in headings rather than inline prose."""
    out = []
    for e in arr or []:
        if isinstance(e, str):
            out.append({"name": "", "text": [sb_text(e)]}); continue
        if not isinstance(e, dict): continue
        txt = flatten_entries(e.get("entries"), sb_text)
        out.append({"name": sb_text(e.get("name") or ""), "text": [t for t in txt if t]})
    return [o for o in out if o["name"] or o["text"]]

def sb_speed(sp):
    if not isinstance(sp, dict): return str(sp or "")
    parts = []
    for mode in ("walk", "burrow", "climb", "fly", "swim"):
        v = sp.get(mode)
        if v is None: continue
        if isinstance(v, dict):
            n, cond = v.get("number"), v.get("condition") or ""
        else:
            n, cond = v, ""
        lbl = "" if mode == "walk" else mode.title() + " "
        parts.append(f"{lbl}{n} ft.{(' ' + cond) if cond else ''}")
    return ", ".join(parts)

def sb_dtypes(arr, field):
    """immune/resist/vulnerable: a mix of bare strings and {field:[…], note:…} groups."""
    out = []
    for x in arr or []:
        if isinstance(x, str): out.append(x)
        elif isinstance(x, dict):
            inner = ", ".join(sb_dtypes(x.get(field) or [], field))
            note = x.get("note") or ""
            out.append(f"{inner} {note}".strip() if inner else note)
    return [x for x in out if x]

def sb_type(t):
    if isinstance(t, str): return t
    if isinstance(t, dict):
        inner = t.get("type")
        if isinstance(inner, dict) and inner.get("choose"):
            return " or ".join(inner["choose"])
        return sb_type(inner) if inner is not None else ""
    return ""

def sb_align(arr):
    out = []
    for a in arr or []:
        if isinstance(a, str): out.append(ALIGN_NAME.get(a, a))
        elif isinstance(a, dict): out += [ALIGN_NAME.get(x, x) for x in (a.get("alignment") or [])]
    return " ".join(out)

def sb_ac(arr):
    for a in arr or []:
        if isinstance(a, dict): return str(a.get("special") or a.get("ac") or "")
        return str(a)
    return ""

def statblock(m):
    size = " or ".join(SIZE_NAME.get(x, x) for x in (m.get("size") or []))
    hp = m.get("hp") or {}
    sec = [("Traits", m.get("trait")), ("Actions", m.get("action")),
           ("Bonus Actions", m.get("bonus")), ("Reactions", m.get("reaction")),
           ("Legendary Actions", m.get("legendary"))]
    senses = list(m.get("senses") or [])
    if m.get("passive") is not None: senses.append(f"Passive Perception {m['passive']}")
    # every free-text field goes through sb_text — senses/languages/notes carry
    # rich tags too ({@variantrule Darkness|XPHB} in the Imp's darkvision)
    return {
        "name": m["name"], "source": m.get("source", ""), "page": m.get("page"),
        "kind": " ".join(x for x in (size, sb_type(m.get("type"))) if x),
        "align": sb_align(m.get("alignment")),
        "ac": sb_text(sb_ac(m.get("ac"))),
        "hp": sb_text(str(hp.get("special") or (f"{hp.get('average','')} ({hp.get('formula','')})" if hp.get("average") else ""))),
        "speed": sb_text(sb_speed(m.get("speed"))),
        "abilities": {k: m.get(k) for k in ("str", "dex", "con", "int", "wis", "cha") if m.get(k) is not None},
        "saves": {ABILITY_FULL.get(k, k): v for k, v in (m.get("save") or {}).items()},
        "skills": {k.title(): v for k, v in (m.get("skill") or {}).items() if k != "other"},
        "vulnerable": sb_text(", ".join(sb_dtypes(m.get("vulnerable"), "vulnerable"))),
        "resist": sb_text(", ".join(sb_dtypes(m.get("resist"), "resist"))),
        "immune": sb_text(", ".join(sb_dtypes(m.get("immune"), "immune"))),
        "condImmune": sb_text(", ".join(sb_dtypes(m.get("conditionImmune"), "conditionImmune"))),
        "senses": sb_text(", ".join(senses)),
        "languages": sb_text(", ".join(m.get("languages") or [])),
        "pb": sb_text(m.get("pbNote") or (f"+{m['pb']}" if m.get("pb") else "")),
        "cr": str(m.get("cr", "")) if not isinstance(m.get("cr"), dict) else str(m["cr"].get("cr", "")),
        "srd": bool(m.get("srd52")),
        "sections": [{"label": lbl, "items": sb_entries(arr)} for lbl, arr in sec if arr],
    }

# ---- creature SETS -------------------------------------------------------
# Some spells name a whole GROUP of creatures rather than one: Find Familiar lists
# eleven forms and then says "or any beast of Challenge Rating 0". 5etools writes both
# shapes into the spell text — `{@creature Bat|XMM}` for a named form and
# `{@filter …|bestiary|challenge rating=[&0]|type=beast|miscellaneous=!swarm}` for the
# open-ended one. We resolve both into a list of monster keys and ship the union.
#
# SCOPE (D78): the monsters we carry are `summonedBySpell` blocks plus **CR 0 non-swarm
# beasts** — that is exactly Find Familiar's set in both editions (its named forms are all
# CR 0 beasts) and it keeps the digest to ~90 stat blocks. Filters are expanded for XPHB
# spells only; a named ref to a creature outside that set simply doesn't resolve. Widening
# the set later is a change here and in extract.js, and nowhere else.
def _mon_key(name, src):
    return f"{name.strip()}|{(src or '').strip().upper()}"

def _cr_of(m):
    cr = m.get("cr")
    c = cr.get("cr") if isinstance(cr, dict) else cr
    return str(c) if c is not None else ""

def _type_of(m):
    t = m.get("type")
    return (t.get("type") if isinstance(t, dict) else t) or ""

# ...plus every form a FEATURE adds to a familiar spell. Pact of the Chain's Imp is a CR 1
# fiend and Strixhaven's mascots are constructs, so none of them survives the predicate
# below on its own — and the refs live in feature prose, which is parsed a thousand lines
# further down, long after the bestiary has been read and thrown away. So the feature
# files are scanned for those refs FIRST, with a walker of their own (the shared one is
# not defined yet at this point in the file), and the predicate admits what they name.
_FORM_CRE_RE = re.compile(r"\{@creature ([^}|]+)(?:\|([^}|]*))?[^}]*\}")
_FORM_WORD_RE = re.compile(r"\bforms?\b", re.I)
_FORM_SENT_SPLIT = re.compile(r"(?<=[.!?])\s+")

def _scan_form_refs():
    """Names and keys of creatures a feature offers as a spell's form. Pre-pass."""
    names, keys = set(), set()
    def walk(e, out):
        if isinstance(e, str): out.append(e)
        elif isinstance(e, list):
            for x in e: walk(x, out)
        elif isinstance(e, dict):
            for k in ("entries", "entry", "items", "rows", "row"): walk(e.get(k), out)
    for fn, key in (("optionalfeatures.json", "optionalfeature"), ("feats.json", "feat")):
        path = os.path.join(MIRROR, fn)
        if not os.path.exists(path): continue
        for rec in load(path).get(key, []):
            buf = []; walk(rec.get("entries"), buf)
            for sent in _FORM_SENT_SPLIT.split(" ".join(buf)):
                if not _FORM_WORD_RE.search(sent): continue
                for nm, src in _FORM_CRE_RE.findall(sent):
                    names.add(nm.strip().lower())
                    if src: keys.add(_mon_key(nm, src))
    return names, keys

FORM_REF_NAMES, FORM_REF_KEYS = _scan_form_refs()

def carried_monster(m):
    """The predicate BOTH extractors use to decide what leaves the bestiary."""
    if m.get("summonedBySpell"): return True
    if (m.get("name") or "").strip().lower() in FORM_REF_NAMES: return True
    if _mon_key(m.get("name", ""), m.get("source", "")) in FORM_REF_KEYS: return True
    return (_type_of(m) == "beast" and _cr_of(m) == "0"
            and "swarm" not in (m.get("name") or "").lower())

CREATURE_RE = re.compile(r"\{@creature ([^}|]+)(?:\|([^}|]*))?[^}]*\}")
BFILTER_RE = re.compile(r"\{@filter [^|}]*\|bestiary\|([^}]*)\}")


sb_count = 0
mon_pool = {}          # "Name|SRC" -> raw monster, every candidate we may ship
mon_by_name = {}       # lowercased name -> [keys], for resolving a ref with no source
for f in glob.glob(os.path.join(MIRROR, "bestiary", "bestiary-*.json")):
    if os.path.basename(f).lower().startswith("foundry"): continue
    for m in load(f).get("monster", []):
        ref = m.get("summonedBySpell")
        if ref:
            nm = ref.split("|")[0]
            src = ref.split("|")[1] if "|" in ref else m.get("source", "")
            sp = spells.get(spell_key(nm, src))
            if sp:
                sp["statblock"] = statblock(m)
                sb_count += 1
        if carried_monster(m):
            k = _mon_key(m["name"], m.get("source", ""))
            mon_pool[k] = m
            mon_by_name.setdefault(m["name"].strip().lower(), []).append(k)

def _filter_matches(spec):
    """`challenge rating=[&0]|type=beast|miscellaneous=!swarm` -> matching keys."""
    parts = dict()
    for chunk in spec.split("|"):
        if "=" not in chunk: continue
        k, v = chunk.split("=", 1)
        parts[k.strip().lower()] = v.strip()
    want_type = (parts.get("type") or "").lower()
    cr = parts.get("challenge rating") or ""
    # only the single-value form `[&0]` is expanded: a range would pull in hundreds
    m_cr = re.fullmatch(r"\[&(\d+)\]", cr)
    if not want_type or not m_cr: return []
    want_cr = m_cr.group(1)
    return sorted(k for k, m in mon_pool.items()
                  if _type_of(m) == want_type and _cr_of(m) == want_cr)

def _entry_text(sp):
    return sp.get("_raw", "")

creature_sets = 0
for sp in spells.values():
    txt = _entry_text(sp)
    keys, seen = [], set()
    for name, src in CREATURE_RE.findall(txt):
        # a name-only ref can resolve to several sources; sort so the emission order is
        # canonical rather than an accident of file-read order (parity with extract.js)
        cands = [_mon_key(name, src)] if src else sorted(mon_by_name.get(name.strip().lower(), []))
        for k in cands:
            if k in mon_pool and k not in seen:
                seen.add(k); keys.append(k)
    if sp.get("source") == "XPHB":          # filters expand for 2024 spells only
        for spec in BFILTER_RE.findall(txt):
            for k in _filter_matches(spec):
                if k not in seen:
                    seen.add(k); keys.append(k)
    own = sp.get("statblock")
    if own:                                  # the spell's own block leads, never repeats
        keys = [k for k in keys if k != _mon_key(own["name"], own.get("source", ""))]
    if keys:
        sp["creatures"] = keys
        creature_sets += 1

for sp in spells.values(): sp.pop("_raw", None)

# ---- forms a FEATURE adds to a spell ----------------------------------------
# Pact of the Chain does not change what Find Familiar is; it changes what YOU may
# summon with it. 5etools states that in the feature's prose and nowhere else — the
# bestiary's `summonedBySpell` links a monster to a spell, so it cannot express "this
# feature widens that list", and D50's rule (never parse {@creature} refs off a spell)
# does not reach the case at all. Narrow by construction: a sentence has to name FORMS
# and carry {@creature} refs, and the feature has to reference a spell somewhere. Across
# the whole 2024 corpus that is three records — Pact of the Chain twice and Strixhaven
# Mascot — and it picks up homebrew that follows the same wording for free.
SPELL_REF_RE = re.compile(r"\{@spell ([^}|]+)(?:\|([^}|]*))?[^}]*\}")
FORM_SENT_RE = re.compile(r"\bforms?\b", re.I)
FIXED_FORM_RE = re.compile(r"must be|is always|always takes the form", re.I)

def _form_grants(rec):
    buf = []; _walk_text(rec.get("entries"), buf); txt = " ".join(buf)
    m = SPELL_REF_RE.search(txt)
    if not m:
        return []
    spell_key = _mon_key(m.group(1), m.group(2) or ("XPHB" if rec.get("source", "").startswith("X") else "PHB"))
    out = []
    for sent in _SENT_RE.split(txt):
        if not FORM_SENT_RE.search(sent):
            continue
        keys, seen = [], set()
        for name, src in CREATURE_RE.findall(sent):
            # a ref with no source resolves to every book that prints that creature, and
            # the two extractors read the bestiary in different orders — so the CANDIDATES
            # are sorted while the written order of the names is kept
            cands = [_mon_key(name, src)] if src else sorted(mon_by_name.get(name.strip().lower(), []))
            for k in cands:
                if k in mon_pool and k not in seen:
                    seen.add(k); keys.append(k)
        if keys:
            out.append({"spell": spell_key, "creatures": keys,
                        "mode": "only" if FIXED_FORM_RE.search(sent) else "add"})
    return out

referenced = {k for sp in spells.values() for k in sp.get("creatures", [])}

# ---- classes (casters AND non-casters) -------------------------------------
def slot_table(groups):
    for g in groups or []:
        if "Spell Slots per Spell Level" in (g.get("title") or ""):
            return g.get("rowsSpellProgression") or g.get("rows")
    return None

def subclass_level(c):
    for cf in c.get("classFeatures", []):
        s = cf if isinstance(cf, str) else cf.get("classFeature", "")
        if "Subclass" in s and "Feature" not in s:
            try: return int(s.split("|")[-1])
            except ValueError: pass
    return 3

# ---- additionalSpells parsing ----------------------------------------------
def parse_choose(choose):
    if isinstance(choose, dict): choose = choose.get("choose", choose)
    if not isinstance(choose, str): return {"choice": True, "desc": "a spell", "filter": {}}
    filt = {}
    for part in choose.split("|"):
        if "=" in part:
            k, v = part.split("=", 1); filt[k.strip()] = v.strip()
    schools = "/".join(SCHOOL.get(x.strip().upper(), x)
                       for x in re.split(r"[;,]", filt["school"])) if "school" in filt else ""
    classes = "/".join(x.strip() for x in re.split(r"[;,]", filt["class"])) if "class" in filt else ""
    if filt.get("level") == "0":            # a cantrip pick reads as English, not as a filter
        qual = " ".join(x for x in (schools, classes) if x)
        return {"choice": True, "filter": filt,
                "desc": "a " + (qual + " " if qual else "") + "cantrip"}
    bits = []
    if "level" in filt: bits.append(f"level {filt['level']}")
    if schools: bits.append(schools)
    if classes: bits.append(classes + " list")
    return {"choice": True, "desc": ("choose " + ", ".join(bits)) if bits else "a spell", "filter": filt}

def spell_ref(s):
    if isinstance(s, dict):
        return parse_choose(s["choose"]) if "choose" in s else parse_choose(s)
    s = s.split("#")[0]
    name = s.split("|")[0]
    src = s.split("|")[1].upper() if "|" in s else ""
    return {"choice": False, "name": name.title() if name.islower() else name, "source": src}

RECHARGE = {"will": "at will", "daily": "per long rest", "rest": "per short rest",
            "resource": "per resource"}

def choose_filter(choose):
    """Parse a choose string 'level=1|school=E;D|class=Cleric' into a filter dict
       + a human descriptor. Returns (filter, count)."""
    count = 1
    if isinstance(choose, dict):
        count = choose.get("count", 1)
        choose = choose.get("choose", "")
    filt = {}
    if isinstance(choose, str):
        for part in choose.split("|"):
            if "=" in part:
                k, v = part.split("=", 1); filt[k.strip()] = v.strip()
    return filt, count

def add_spell_entry(bucket, kind, at, recharge, s, feature=None, feats=None):
    """Route one spell reference into fixed (named) or picks (choose)."""
    ref = spell_ref(s)
    note = None
    if feats is not None:
        frec = resolve_feature_rec(feats, at, s)
        if frec:
            if feature is None: feature = frec["name"]
            note = frec.get("note")
    if ref.get("choice"):
        f, c = choose_filter(s)          # pass the whole ref so count survives
        e = {"kind": kind, "atLevel": at, "recharge": recharge,
             "count": c, "filter": f, "desc": ref["desc"], "feature": feature}
        if note: e["note"] = note
        bucket["picks"].append(e)
    else:
        e = {"kind": kind, "atLevel": at, "recharge": recharge, "spell": ref, "feature": feature}
        if note: e["note"] = note
        bucket["fixed"].append(e)

CADENCE_KEYS = set(RECHARGE)   # will/daily/rest/resource -> a cadence map, not a spell list

def emit_cadence(b, at, cadmap, feature=None, feats=None):
    """Route a {cadence: payload} innate-cast map into innate grants.
       Shared by the `innate` block and by prepared/known values that 5etools
       writes as a cadence map (e.g. a feat granting one free daily casting)."""
    for cadence, payload in cadmap.items():
        base = RECHARGE.get(cadence, cadence)
        if cadence == "will" or isinstance(payload, list):
            for s in (payload if isinstance(payload, list) else [payload]):
                add_spell_entry(b, "innate", at, "at will", s, feature, feats)
        elif isinstance(payload, dict):
            for freq, arr in payload.items():
                n = int(re.sub(r"\D", "", str(freq)) or 1)
                label = base if n == 1 else f"{n}× {base}"
                for s in (arr if isinstance(arr, list) else [arr]):
                    add_spell_entry(b, "innate", at, label, s, feature, feats)

def is_cadence(v):
    return isinstance(v, dict) and bool(v) and all(k in CADENCE_KEYS for k in v)

def ungroup(v):
    """A prepared/known/expanded value has THREE shapes, like `innate` does: a bare
       list, a cadence map, or a class-requirement group map — {"_": [...]} means
       "no requirement". The group form was falling through to spell_ref() as a raw
       dict, which silently discarded its `choose` filter and left 25 grants reading
       "a spell" (High Elf's Wizard cantrip among them). Flatten groups; leave the
       other two shapes for the caller's is_cadence/list handling."""
    if isinstance(v, dict) and not is_cadence(v):
        flat = []
        for inner in v.values():
            flat.extend(inner if isinstance(inner, list) else [inner])
        return flat
    return v

def norm_ability(a):
    if a is None: return None
    if isinstance(a, str): return {"inherit": True} if a == "inherit" else {"fixed": a}
    if isinstance(a, dict) and "choose" in a: return {"choose": a["choose"]}
    return None

def parse_block(block, feats=None):
    """One additionalSpells block -> {fixed, picks, expansions, ability}.
       block['name'] (when present) is the granting feature's name; otherwise each
       grant is matched back to its feature via `feats` (resolve_feature)."""
    ft = block.get("name")
    b = {"fixed": [], "picks": [], "expansions": [], "ability": norm_ability(block.get("ability"))}
    for lvl, arr in (block.get("prepared") or {}).items():
        at = int(re.sub(r"\D", "", str(lvl)) or 0)
        if is_cadence(arr):                                 # free casting on a cadence (feats)
            emit_cadence(b, at, arr, ft, feats)
        else:
            arr = ungroup(arr)
            for s in (arr if isinstance(arr, list) else [arr]):
                if is_cadence(s): emit_cadence(b, at, s, ft, feats)
                else: add_spell_entry(b, "prepared", at, "prepared (free)", s, ft, feats)
    for lvl, arr in (block.get("expanded") or {}).items():
        at = SLOT_LEVEL_KEY.get(str(lvl), int(re.sub(r"\D", "", str(lvl)) or 0))
        if is_cadence(arr):
            emit_cadence(b, at, arr, ft, feats)
            continue
        for s in ungroup(arr):
            if is_cadence(s):
                emit_cadence(b, at, s, ft, feats)
            elif isinstance(s, dict) and "all" in s:        # list expansion (Magical Secrets)
                f, _ = choose_filter({"choose": s["all"]})
                b["expansions"].append({"atLevel": at, "filter": f,
                                        "feature": ft or resolve_feature(feats, at, {"choose": s["all"]})})
            else:
                add_spell_entry(b, "prepared", at, "expanded list", s, ft, feats)
    for lvl, arr in (block.get("known") or {}).items():
        at = int(re.sub(r"\D", "", str(lvl)) or 0)
        if is_cadence(arr):
            emit_cadence(b, at, arr, ft, feats)
            continue
        arr = ungroup(arr)
        arr = arr if isinstance(arr, list) else [arr]
        for s in arr:
            if is_cadence(s): emit_cadence(b, at, s, ft, feats)
            else: add_spell_entry(b, "known", at, "always known", s, ft, feats)
    for lvlkey, cadmap in (block.get("innate") or {}).items():
        at = 0 if str(lvlkey) in ("_", "") else int(re.sub(r"\D", "", str(lvlkey)) or 0)
        # a bare list under the level key is the at-will shorthand for a single cadence
        if isinstance(cadmap, (list, str)):
            for s in (cadmap if isinstance(cadmap, list) else [cadmap]):
                add_spell_entry(b, "innate", at, "at will", s, ft, feats)
            continue
        if not isinstance(cadmap, dict): continue
        emit_cadence(b, at, cadmap, ft, feats)
    return b

# 's6'..'s9' expanded keys = "when you can cast Nth-level spells" (full caster levels)
SLOT_LEVEL_KEY = {"s6": 11, "s7": 13, "s8": 15, "s9": 17}

# ---- feature-name resolution ----------------------------------------------
# additionalSpells blocks rarely carry a `name`, but the granting FEATURE is detailed
# in the subclass/class feature entries (e.g. Abjurer's "Abjuration Savant" holds the
# same @filter; "Spell Breaker" names Counterspell/Dispel Magic). Index those features
# and match each grant back to the feature that describes it, so the UI can label it.
def _walk_text(e, out):
    if isinstance(e, str): out.append(e)
    elif isinstance(e, list):
        for x in e: _walk_text(x, out)
    elif isinstance(e, dict):
        for k in ("entries", "entry", "items", "rows", "row"): _walk_text(e.get(k), out)

def _choose_kv(s):
    if isinstance(s, dict): s = s.get("choose", "")
    kv = {}
    for p in str(s).split("|"):
        if "=" in p: k, v = p.split("=", 1); kv[k.strip()] = v.strip()
    return tuple(sorted(kv.items()))

# A feature often changes HOW you cast the spell it grants — "without expending a spell
# slot", "once per Long Rest", "you automatically succeed on the save". 5etools carries
# none of that structurally (Warlock's Contact Patron has `prepared` and nothing else), so
# we lift the sentences that say it and hang them on the grant as a note (D79).
# Deliberately NARROW: "you always have these spells prepared" and "it doesn't count
# against the number you can prepare" are what "Always prepared" already means in this UI,
# so matching them produced 470 notes of pure boilerplate. Only a change to HOW you cast
# earns a note.
# Deliberately NARROW: the first cut matched "you always have these prepared" and produced
# 470 notes of boilerplate. The component clauses (D85) are the second admitted family —
# a feature that strips V/S/M off a spell it GRANTS says so only in prose.
MOD_RE = re.compile(
    r"without expending|no spell slot|automatically succeed|"
    r"can'?t do so|can'?t (?:cast|use) it (?:this way|in this way)|"
    r"once you cast|twice without|as part of the same|"
    r"requires? no (?:verbal|somatic|material)|"
    r"without (?:providing |using |needing )?(?:any |a )?(?:verbal|somatic|material)|"
    r"without (?:spell )?components|don'?t need to provide",
    re.I)
_SENT_RE = re.compile(r"(?<=[.!?])\s+")
def _mod_note(txt):
    keep = [x.strip() for x in _SENT_RE.split(txt or "") if x.strip() and MOD_RE.search(x)]
    return rich_strip(" ".join(keep)) if keep else None

# A feat, optional feature or species IS its own granting feature: unlike a class, whose
# prose lives in a separate classFeature record and reaches parse_grants() through
# SUBFEAT_INDEX/CLSFEAT_INDEX, these carry `entries` on the record itself. Nothing was
# reading them, so D79's note lift never ran for ANY of them — every invocation's
# "on yourself", "while you're in Dim Light or Darkness", "without expending a spell slot"
# was dropped, and the spell modal showed a bare "at will".
# **Keep identical to extract.js's ownNote/applyOwnNote.**
# BLOCK BY BLOCK, never the record flattened: a species or feat is a list of named traits,
# and one string of all of them is how the Aasimar's "Once you transform, you can't do so
# again" landed on its Light cantrip. A note may only reach a grant its OWN block names.
def _own_note_blocks(rec):
    out = []
    for blk in (rec.get("entries") or []):
        buf = []; _walk_text(blk, buf)
        note = _mod_note(" ".join(buf))
        if not note: continue
        raw = blk if isinstance(blk, str) else json.dumps(blk, ensure_ascii=False)
        spells = set(m.group(1).split("|")[0].strip().lower()
                     for m in re.finditer(r"\{@spell ([^}]+)\}", raw))
        out.append({"spells": spells, "filter": "{@filter" in raw, "note": note})
    return out

def _apply_own_note(grants, blocks):
    """Hang each block's modification note on the grants that block is ABOUT: a named
       spell matches by name, a pick matches the block that carries the same @filter tag.
       Anything unmatched keeps no note — a missing one costs a line of prose, a wrong one
       tells you the wrong rule."""
    if not blocks or not grants: return
    def hang(bucket):
        for e in (bucket.get("fixed") or []):
            nm = str(((e.get("spell") or {}).get("name")) or "").lower()
            if not nm or e.get("note"): continue
            for b in blocks:
                if nm in b["spells"]: e["note"] = b["note"]; break
        for e in (bucket.get("picks") or []):
            if e.get("note"): continue
            for b in blocks:
                if b["filter"]: e["note"] = b["note"]; break
    hang(grants)
    for og in (grants.get("optionGroups") or []):
        for o in (og.get("options") or []): hang(o)

# 5etools marks a repeatable FEAT with a flag, but a repeatable optional feature only with
# a nested entry named "Repeatable" ("You can gain this invocation more than once") — so
# Agonizing Blast, Repelling Blast, Eldritch Spear and Lessons of the First Ones all read
# as take-once. Both shapes answer the same question, so both are read here.
def _repeatable(o):
    if o.get("repeatable"): return True
    def walk(e):
        if isinstance(e, list): return any(walk(x) for x in e)
        if isinstance(e, dict):
            if str(e.get("name") or "").strip().lower().startswith("repeatable"): return True
            return walk(e.get("entries"))
        return False
    return walk(o.get("entries"))

# `featProgression` — a feature that hands you a FEAT SLOT ("you gain one Origin feat of
# your choice"). Same cumulative shape opt_progression() builds, keyed by feat CATEGORY.
# Read on feats / optional features / species ONLY: a class's own ASI, Epic Boon and
# Fighting Style schedule is derived from the level plan in the app (featSlotLevels), and
# reading the class copy here would grant every class its boon twice.
def feat_progression(o):
    out = []
    for p in (o.get("featProgression") or []):
        prog = p.get("progression"); counts = [0] * 20
        if isinstance(prog, list):
            for i in range(20): counts[i] = int(prog[i]) if i < len(prog) and prog[i] else 0
        elif isinstance(prog, dict):
            for k, v in prog.items():          # "*" means "from level 1" -> 1
                lv = int(re.sub(r"\D", "", str(k)) or 1)
                for i in range(lv - 1, 20): counts[i] = max(counts[i], int(v or 0))
        if any(counts):
            out.append({"name": p.get("name") or "Feat", "cats": p.get("category") or [],
                        "counts": counts})
    return out

# A DESIGNATION, not a grant (D135): "Choose one of your known {@filter Warlock cantrips|
# spells|level=0|class=Warlock|damage type=…} that deals damage." The spell is already
# yours — the feature changes what it does. 5etools carries the pool as a real filter tag,
# so this is data like everything else here, not a hand-authored table.
_MARK_RE = re.compile(r"choose one of your (?:known )?\{@filter ([^}]+)\}", re.I)
def parse_marks(o):
    # top-level PROSE only: the nested blocks are the feature's asides ("Repeatable: you
    # can gain this invocation more than once"), and folding those into the note would put
    # them in the spell modal, where they say nothing about the spell
    top = " ".join(x for x in (o.get("entries") or []) if isinstance(x, str))
    sents = [x.strip() for x in _SENT_RE.split(top) if x.strip()]
    out = []
    for i, sent in enumerate(sents):
        m = _MARK_RE.search(sent)
        if not m: continue
        parts = m.group(1).split("|")
        filt = {}
        for part in parts[2:]:                 # [0] display text, [1] the page ("spells")
            if "=" in part:
                k, v = part.split("=", 1); filt[k.strip()] = v.strip()
        if not filt: continue
        # the rest of the feature's prose is what the designation DOES to that spell —
        # it rides as the grant note D79 already renders in the spell modal
        rest = " ".join(sents[i + 1:])
        out.append({"feature": o.get("name"), "filter": filt,
                    "desc": rich_strip(sent), "note": rich_strip(rest) or None})
    return out

def _feat_record(f):
    buf = []; _walk_text(f.get("entries"), buf); txt = " ".join(buf); low = txt.lower()
    spells = set(m.group(1).split("|")[0].strip().lower() for m in re.finditer(r"\{@spell ([^}]+)\}", txt))
    filters = set()
    for m in re.finditer(r"\{@filter [^|}]*\|([^}]+)\}", txt):
        kv = {}
        for p in m.group(1).split("|"):
            if "=" in p: k, v = p.split("=", 1); kv[k.strip()] = v.strip()
        if kv: filters.add(tuple(sorted(kv.items())))
    grants = (("spellbook" in low and "add" in low) or "always have" in low or "have the following"
              in low or bool(filters) or bool(spells) or ("spell" in (f.get("name") or "").lower()))
    return {"name": f.get("name"), "level": f.get("level"), "spells": spells,
            "filters": filters, "grants": bool(grants), "note": _mod_note(txt)}

SUBFEAT_INDEX = {}   # (className, subclassShortName, subclassSource) -> [feature records]
CLSFEAT_INDEX = {}   # (className, classSource) -> [feature records]
for _f in glob.glob(os.path.join(MIRROR, "class", "class-*.json")):
    _d = load(_f)
    for _x in _d.get("subclassFeature", []):
        SUBFEAT_INDEX.setdefault((_x.get("className"), _x.get("subclassShortName"),
                                  _x.get("subclassSource")), []).append(_feat_record(_x))
    for _x in _d.get("classFeature", []):
        CLSFEAT_INDEX.setdefault((_x.get("className"), _x.get("classSource")), []).append(_feat_record(_x))

# what a class/subclass actually gives at each level, by NAME — the level-order cards
# name real features ("Arcane Recovery"), not derived spell counts (D63). Subclass
# feature names repeat the subclass, so they are trimmed for display.
# ASI/boon levels the UI derives itself; "<Class> Subclass" / "Subclass Feature" are
# placeholders whose real content lives on the subclass record.
_FEAT_SKIP = re.compile(r"^(ability score improvement|epic boon|subclass feature|"
                        r".+ subclass|.+ subclass feature)$", re.I)
def feature_list(recs, drop_prefix=None):
    out, seen = [], set()
    for f in recs or []:
        nm, lv = f.get("name"), f.get("level")
        if not nm or not lv: continue
        if _FEAT_SKIP.match(nm.strip()): continue
        # a subclass's own name repeated as a feature says nothing the card doesn't show
        if drop_prefix and nm.strip().lower() == drop_prefix.strip().lower(): continue
        if drop_prefix and nm.lower().startswith(drop_prefix.lower()+" "):
            nm = nm[len(drop_prefix):].strip(" :-—")
        k = (lv, nm.lower())
        if k in seen: continue
        seen.add(k); out.append({"level": lv, "name": nm})
    # case-insensitive, to match extract.js's localeCompare (parity is byte-for-byte)
    return sorted(out, key=lambda x: (x["level"], x["name"].lower()))

def resolve_feature_rec(feats, at, s):
    """The feature record that grants spell/pick `s` at level `at`, or None."""
    if not feats: return None
    gf = [f for f in feats if f["grants"]]
    if not gf: return None
    same = [f for f in gf if f["level"] == at]
    if isinstance(s, dict) and "choose" in s:
        kv = _choose_kv(s["choose"])
        for f in same + gf:
            if kv in f["filters"]: return f
        if len(same) == 1: return same[0]
    else:
        sn = (s.split("#")[0].split("|")[0].strip().lower()) if isinstance(s, str) else ""
        for f in same + gf:
            if sn and sn in f["spells"]: return f
        if len(same) == 1: return same[0]
    if len(gf) == 1: return gf[0]
    return None

def resolve_feature(feats, at, s):
    r = resolve_feature_rec(feats, at, s)
    return r["name"] if r else None

def parse_grants(add, feats=None):
    """Whole additionalSpells -> {fixed, picks, expansions, optionGroups}.
       Named sibling blocks become one optionGroup (terrain / MI list / lineage).
       `feats` (granting-feature records) name grants whose block has no name."""
    out = {"fixed": [], "picks": [], "expansions": [], "optionGroups": [], "ability": None}
    named = [blk for blk in (add or []) if blk.get("name")]
    if len(named) > 1:
        out["optionGroups"].append({"options": [
            {"name": blk["name"], **parse_block(blk, feats)} for blk in named]})
        rest = [blk for blk in (add or []) if not blk.get("name")]
    else:
        rest = add or []
    for blk in rest:
        pb = parse_block(blk, feats)
        out["fixed"] += pb["fixed"]; out["picks"] += pb["picks"]; out["expansions"] += pb["expansions"]
        if pb["ability"] and not out["ability"]: out["ability"] = pb["ability"]
    return out

def opt_progression(c):
    """optionalfeatureProgression -> [{name, types, counts[20]}] with cumulative counts."""
    out = []
    for p in (c.get("optionalfeatureProgression") or []):
        prog = p.get("progression"); counts = [0] * 20
        if isinstance(prog, list):
            for i in range(20): counts[i] = int(prog[i]) if i < len(prog) and prog[i] else 0
        elif isinstance(prog, dict):
            for k, v in prog.items():
                lv = int(re.sub(r"\D", "", str(k)) or 1)
                for i in range(lv - 1, 20): counts[i] = max(counts[i], int(v or 0))
        if any(counts):
            out.append({"name": p.get("name") or "Optional features",
                        "types": p.get("featureType") or [], "counts": counts})
    return out

# ---- classes (casters AND non-casters) — built after the grant parsers -----
# Sidekicks (Expert/Spellcaster/Warrior) are DM-run NPC templates, not player
# classes — drop them from the class list and from subclass collection.
EXCLUDE_CLASS = lambda n: n.endswith(" Sidekick")
classes = []
for f in glob.glob(os.path.join(MIRROR, "class", "class-*.json")):
    d = load(f)
    for c in d.get("class", []):
        if not valid_name(c): continue
        if EXCLUDE_CLASS(c["name"]): continue      # sidekicks aren't player classes
        cp = c.get("casterProgression")
        prepared = c.get("preparedSpellsProgression")
        known = c.get("spellsKnownProgression")
        count_type = ("fixed" if prepared else "known" if known else
                      ("formula" if cp else None))
        change = c.get("preparedSpellsChange")   # "level" (static) | "restLong" (daily)
        static = (change == "level") or (bool(known) and not prepared)
        classes.append({
            "name": c["name"], "source": c.get("source", ""),
            "group": bgroup(c.get("source", "")), "book": bname(c.get("source", "")),
            "reprinted": reprinted(c), "supersededBy": superseded_by(c),
            "page": c.get("page"),
            "caster": cp,                       # full|artificer|1/2|1/3|pact|None
            "srd": bool(c.get("srd52")),
            "ability": c.get("spellcastingAbility"),
            "static": bool(static and cp),      # only meaningful for casters
            "countType": count_type,
            "subclassLevel": subclass_level(c),
            "cantrips": c.get("cantripProgression"),
            "prepared": prepared or known,      # the per-level count array
            "spellbook": c.get("spellsKnownProgressionFixed"),  # Wizard-style pool
            "slots": slot_table(c.get("classTableGroups")),
            "grants": parse_grants(c.get("additionalSpells"),   # Bard Magical Secrets
                                    CLSFEAT_INDEX.get((c["name"], c.get("source", "")))),
            "grantsFightingStyle": None,  # filled below for FS-granting classes
            "bonusChoices": [],           # extra-cantrip order features etc.
            "optFeatures": opt_progression(c),   # invocations / metamagic / boons (D28)
            "features": feature_list(CLSFEAT_INDEX.get((c["name"], c.get("source", "")))),
        })

# 2024 order features that grant an extra cantrip (text-only in the source),
# surfaced as an optional pick; and which classes get a Fighting Style.
ORDER_CANTRIP = {
    ("Cleric", "XPHB"): {"count": 1, "filter": {"level": "0", "class": "Cleric"},
                          "label": "Divine Order — Thaumaturge (extra cantrip)", "atLevel": 1, "optional": True},
    ("Druid", "XPHB"):  {"count": 1, "filter": {"level": "0", "class": "Druid"},
                          "label": "Primal Order — Magician (extra cantrip)", "atLevel": 1, "optional": True},
}
FS_CLASS_LEVEL = {"Fighter": 1, "Ranger": 2, "Paladin": 2}  # when a Fighting Style is gained
for c in classes:
    oc = ORDER_CANTRIP.get((c["name"], c["source"]))
    if oc: c["bonusChoices"].append(oc)
    if c["name"] in FS_CLASS_LEVEL and c["source"] == "XPHB":
        c["grantsFightingStyle"] = FS_CLASS_LEVEL[c["name"]]

subclasses = []
for f in glob.glob(os.path.join(MIRROR, "class", "class-*.json")):
    d = load(f)
    for sc in resolve_copies(d.get("subclass", []), _sub_copy_key, "subclass"):
        if not valid_name(sc): continue
        if EXCLUDE_CLASS(sc.get("className", "")): continue
        rec = {"name": sc.get("name", ""), "shortName": sc.get("shortName", sc.get("name", "")),
               "source": sc.get("source", ""), "group": bgroup(sc.get("source", "")),
               "book": bname(sc.get("source", "")), "reprinted": reprinted(sc),
               "supersededBy": superseded_by(sc),
               "page": sc.get("page"), "srd": bool(sc.get("srd52")),
               "className": sc.get("className", ""), "classSource": sc.get("classSource", ""),
               "grants": parse_grants(sc.get("additionalSpells"),
                          SUBFEAT_INDEX.get((sc.get("className", ""),
                                             sc.get("shortName", sc.get("name", "")), sc.get("source", "")))),
               "optFeatures": opt_progression(sc),
               "features": feature_list(
                   SUBFEAT_INDEX.get((sc.get("className", ""),
                                      sc.get("shortName", sc.get("name", "")), sc.get("source", ""))),
                   sc.get("shortName", ""))}
        if sc.get("casterProgression"):
            rec["caster"] = sc["casterProgression"]; rec["ability"] = sc.get("spellcastingAbility")
            rec["cantrips"] = sc.get("cantripProgression")
            rec["prepared"] = sc.get("preparedSpellsProgression") or sc.get("spellsKnownProgression")
            rec["static"] = (sc.get("preparedSpellsChange") == "level")
            rec["spellList"] = None    # derived once every subclass is read, below (D130)
        subclasses.append(rec)

# ---- prose-only grants (D79) ----------------------------------------------
# A few 2024 features grant spells in PROSE and carry no `additionalSpells` at all, so
# there is nothing to parse: Mystic Arcanum ("Choose one level 6 Warlock spell"), the four
# Wizard school Savants, Knowledge Domain's Mind Magic, and the Cleric capstone. They are
# hand-authored here to exactly the shape parse_grants() emits.
# **extract.js carries the same table — keep the two identical.**
def _arcanum(level, spell_level):
    return {"kind": "known", "atLevel": level, "recharge": "per long rest", "count": 1,
            "filter": {"level": str(spell_level), "class": "Warlock"},
            "desc": f"a level {spell_level} Warlock spell",
            "feature": f"Mystic Arcanum (level {spell_level})",
            "note": "You can cast it once without expending a spell slot, and must finish a "
                    "Long Rest before casting it that way again. Whenever you gain a Warlock "
                    "level you can replace it with another Warlock spell of the same level."}

def _savant(school, name):
    return {"kind": "prepared", "atLevel": 3, "recharge": None, "count": 2,
            "filter": {"class": "Wizard", "school": school},
            "desc": f"two {name} spells for your spellbook", "feature": f"{name} Savant",
            "note": "Added to your spellbook for free when you take the subclass — they "
                    "don't count against the book's normal growth."}

PROSE_GRANTS = {
    ("class", "Warlock", "XPHB"): {"picks": [_arcanum(11, 6), _arcanum(13, 7),
                                             _arcanum(15, 8), _arcanum(17, 9)]},
    ("class", "Cleric", "XPHB"): {"fixed": [
        {"kind": "innate", "atLevel": 20, "recharge": "per long rest",
         "spell": {"name": "Wish", "source": "XPHB"},
         "feature": "Greater Divine Intervention",
         "note": "Once you use this feature you can't do so again until you finish 2d4 Long Rests."}]},
    ("subclass", "Abjurer", "XPHB"): {"picks": [_savant("A", "Abjuration")]},
    ("subclass", "Diviner", "XPHB"): {"picks": [_savant("D", "Divination")]},
    ("subclass", "Evoker", "XPHB"): {"picks": [_savant("V", "Evocation")]},
    ("subclass", "Illusionist", "XPHB"): {"picks": [_savant("I", "Illusion")]},
    ("subclass", "Knowledge", "XPHB"): {"picks": [
        {"kind": "prepared", "atLevel": 3, "recharge": None, "count": 1,
         "filter": {"class": "Cleric", "school": "D"},
         "desc": "one Divination spell", "feature": "Mind Magic",
         "note": "Always prepared, and it doesn't count against the number of spells you "
                 "can prepare."}]},
}

def merge_prose_grants(rec, kind, ident):
    extra = PROSE_GRANTS.get((kind, ident, rec.get("source", "")))
    if not extra: return
    g = rec.get("grants")
    if not g:
        g = {"fixed": [], "picks": [], "expansions": [], "optionGroups": [], "ability": None}
        rec["grants"] = g
    for k, v in extra.items():
        g.setdefault(k, [])
        # 5etools may have grown structured data for a hand-authored grant since the table
        # was written (it did, for the school Savants) — a feature already present in the
        # record must not be granted a second time. Keep identical to extract.js.
        have = {x.get("feature") for x in g[k] if isinstance(x, dict) and x.get("feature")}
        g[k] = list(g[k]) + [dict(x) for x in v if x.get("feature") not in have]

# ---- casting-rule modifications (D85) -------------------------------------
# A feature may change HOW you cast spells you ALREADY have — strip a component from a
# whole school, from a class's list, from four named spells. 5etools carries none of that
# structurally, and MOD_RE only ever reaches spells a feature GRANTS. Hand-authored, like
# PROSE_GRANTS, and **keep identical to extract.js's CAST_MODS.**
#   scope  = {cls, schools, spells, giver, maxLevel, optTypes} — all optional, ANDed.
#            `giver` matches the label of whatever granted the spell; `optTypes` matches a
#            spell granted by one of your optional features of that type (Elemental Disciplines).
#   label  = what the chip says. Default is "<feature> — no V / S / M"; a mod with an empty
#            `drop` (a free cast rather than a component change) must supply its own.
#   drop   = which of v/s/m the feature removes.
#   when   = None means it always applies (the app strikes the component through); a string
#            is a condition the app cannot verify, so it annotates instead of striking.
CAST_MODS = {
    ("class", "Psion", "XUA2025Psion"): [
        {"feature": "Psionic Spellcasting", "level": 1, "cls": None, "label": None,
         "scope": {"cls": "Psion"}, "drop": "vm", "exceptCostly": True, "when": None,
         "note": "When you cast a Psion spell, that spell doesn't require a Verbal or Material "
                 "component, even if the spell includes \"V\" or \"M\" in its Components entry, except "
                 "Material components that are consumed by the spell or have a cost specified."},
    ],
    ("class", "Druid", "PHB"): [
        {"feature": "Archdruid", "level": 20, "cls": None, "label": None,
         "scope": {"cls": "Druid"}, "drop": "vsm", "exceptCostly": True, "when": None,
         "note": "You can ignore the verbal and somatic components of your druid spells, as well as "
                 "any material components that lack a cost and aren't consumed by a spell."},
    ],
    ("class", "Cleric", "XPHB"): [
        {"feature": "Divine Intervention", "level": 10, "cls": None, "label": "Divine Intervention \u2014 free, no Material",
         "scope": {"cls": "Cleric", "maxLevel": 5}, "drop": "m", "exceptCostly": False, "when": "when you cast it with Divine Intervention",
         "note": "You cast the spell without expending a spell slot or needing Material components. "
                 "Once you use this feature, you can't do so again until you finish a Long Rest."},
    ],
    ("subclass", "Great Old One", "XPHB"): [
        {"feature": "Psychic Spells", "level": 3, "cls": "Warlock", "label": None,
         "scope": {"cls": "Warlock", "schools": ["Enchantment", "Illusion"]}, "drop": "vs", "exceptCostly": False, "when": None,
         "note": "When you cast a Warlock spell that is an Enchantment or Illusion, you can do so "
                 "without Verbal or Somatic components."},
    ],
    ("subclass", "Illusionist", "XPHB"): [
        {"feature": "Improved Illusions", "level": 3, "cls": "Wizard", "label": None,
         "scope": {"schools": ["Illusion"]}, "drop": "v", "exceptCostly": False, "when": None,
         "note": "You can cast Illusion spells without providing Verbal components."},
    ],
    ("subclass", "Undead", "RHW"): [
        {"feature": "Superior Dread", "level": 14, "cls": "Warlock", "label": None,
         "scope": {"cls": "Warlock", "schools": ["Conjuration", "Necromancy"]}, "drop": "vsm", "exceptCostly": True, "when": "while you are using your Form of Dread",
         "note": "Whenever you cast a Warlock spell from the Conjuration or Necromancy school, you "
                 "cast it without any Verbal, Somatic, or Material components, except Material "
                 "components that are costly or consumed by the spell."},
    ],
    ("subclass", "Aberrant", "XPHB"): [
        {"feature": "Psionic Sorcery", "level": 6, "cls": "Sorcerer", "label": None,
         "scope": {"giver": "Psionic Spells"}, "drop": "vsm", "exceptCostly": True, "when": "when you cast it by spending Sorcery Points instead of a slot",
         "note": "If you cast the spell using Sorcery Points, it requires no Verbal or Somatic "
                 "components, and it requires no Material components unless they are consumed by the "
                 "spell or have a cost specified in it."},
    ],
    ("subclass", "Aberrant Mind", "TCE"): [
        {"feature": "Psionic Sorcery", "level": 6, "cls": "Sorcerer", "label": None,
         "scope": {"giver": "Psionic Spells"}, "drop": "vsm", "exceptCostly": True, "when": "when you cast it by spending sorcery points instead of a slot",
         "note": "If you cast the spell using sorcery points, it requires no verbal or somatic "
                 "components, and it requires no material components, unless they are consumed by the "
                 "spell."},
    ],
    ("subclass", "Shadow", "PHB"): [
        {"feature": "Shadow Arts", "level": 3, "cls": "Monk", "label": None,
         "scope": {"cls": "Monk", "spells": ["Darkness", "Darkvision", "Pass Without Trace", "Silence"]}, "drop": "m", "exceptCostly": False, "when": "when you cast it by spending 2 ki points",
         "note": "You can spend 2 ki points to cast darkness, darkvision, pass without trace, or "
                 "silence, without providing material components."},
    ],
    ("subclass", "Shadow", "XPHB"): [
        {"feature": "Shadow Arts: Darkness", "level": 3, "cls": "Monk", "label": None,
         "scope": {"cls": "Monk", "spells": ["Darkness"]}, "drop": "vsm", "exceptCostly": False, "when": "when you cast it by expending 1 Focus Point",
         "note": "You can expend 1 Focus Point to cast the Darkness spell without spell components."},
    ],
    ("subclass", "Four Elements", "PHB"): [
        {"feature": "Disciple of the Elements", "level": 3, "cls": "Monk", "label": None,
         "scope": {"optTypes": ["ED"]}, "drop": "m", "exceptCostly": False, "when": None,
         "note": "To cast one of your elemental discipline spells you use its casting time and other "
                 "rules, but you don't need to provide material components for it."},
    ],
    ("subclass", "Archfey", "XPHB"): [
        {"feature": "Steps of the Fey", "level": 3, "cls": "Warlock", "label": "Steps of the Fey \u2014 Misty Step free",
         "scope": {"cls": "Warlock", "spells": ["Misty Step"]}, "drop": "", "exceptCostly": False, "when": "a number of times equal to your Charisma modifier per Long Rest",
         "note": "You can cast Misty Step without expending a spell slot a number of times equal to "
                 "your Charisma modifier (minimum of once), and you regain all expended uses when you "
                 "finish a Long Rest. You may also gain one of two extra benefits with each casting."},
        {"feature": "Bewitching Magic", "level": 14, "cls": "Warlock", "label": "Bewitching Magic \u2014 Misty Step free",
         "scope": {"cls": "Warlock", "spells": ["Misty Step"]}, "drop": "", "exceptCostly": False, "when": "as part of casting an Enchantment or Illusion spell with a slot",
         "note": "When you cast an Enchantment or Illusion spell using an action and a spell slot, you "
                 "can cast Misty Step as part of the same action and without expending a spell slot."},
    ],
}

def attach_cast_mods(rec, kind, ident):
    mods = CAST_MODS.get((kind, ident, rec.get("source", "")))
    if not mods: return
    # `cls` guards a shortName two classes could share ("Shadow" is a Monk here)
    out = [dict(m) for m in mods if not m.get("cls") or m["cls"] == rec.get("className")]
    for m in out: m.pop("cls", None)
    if out: rec["castMods"] = out

for _c in classes:
    merge_prose_grants(_c, "class", _c["name"]); attach_cast_mods(_c, "class", _c["name"])
for _s in subclasses:
    _id = _s.get("shortName") or _s["name"]
    merge_prose_grants(_s, "subclass", _id); attach_cast_mods(_s, "subclass", _id)

# ---- which class list a subclass-provided spellcasting draws from (D130) ---
# A subclass carrying its own `casterProgression` IS the whole of that character's
# spellcasting — its class has no list of its own, so the subclass has to name one.
# 5etools says which, structurally, in the subclass's own `additionalSpells`: one
# `expanded` block per spell-level tier whose filter names the class
# ("level=0|class=Wizard", "level=1|class=Wizard", "level=2|class=Wizard", …). Those are
# already parsed into `grants.expansions`, so the rule reads the parse BOTH extractors
# share rather than the raw JSON — a casting subclass added to the mirror later derives
# its own list, with no table to update and nothing to remember.
#
# Exactly ONE class name may come out. Zero (it casts but never says from what) or several
# (a mix nothing can collapse) means the data does not say: emit `spellList = None` and
# NAME the record, rather than guessing. The app then tells you it can't work the list out
# instead of showing an empty picker with no reason (D31) — the same tripwire shape D127's
# `_mod` check has, and the reason there is no per-subclass name table here.
#
# Sweep, 5etools v2.33.3: `casterProgression` appears on exactly 2 subclasses (Eldritch
# Knight, Arcane Trickster) across 2014 + 2024 = 4 raw records, 6 after `_copy` resolution.
# All 6 derive Wizard; 0 unresolved. Subclasses of CASTING classes that reach another
# list — Arcana Cleric, Divine Soul Sorcerer, Nature Cleric, Lore/Moon Bard — are NOT
# this: they keep their own class's list and the extra access rides `grants.expansions`
# exactly as it always has. Only a subclass that supplies the WHOLE spellcasting is here.
def sub_list_class(rec):
    """The single class name this subclass's expansions open, or None if not exactly one."""
    names = set()
    for e in ((rec.get("grants") or {}).get("expansions") or []):
        for cn in str((e.get("filter") or {}).get("class") or "").split(";"):
            cn = cn.strip()
            if cn: names.add(cn)
    return names.pop() if len(names) == 1 else None

def spell_list_for(rec, printings):
    """[class name, source] for a caster subclass's list, or None when undecidable.
       Source = that class's printing on the subclass's own chassis, else in its own book,
       else the first by code. A class that isn't loaded at all still yields the NAME with
       a null source: the app matches the list by name, and unknown must never narrow the
       pool (D31)."""
    name = sub_list_class(rec)
    if not name: return None
    by_src = printings.get(name.lower())
    if not by_src: return [name, None]
    for want in (rec.get("classSource"), rec.get("source")):
        if want and want in by_src: return [by_src[want], want]
    first = sorted(by_src)[0]
    return [by_src[first], first]

_printings = {}
for _c in classes:
    _printings.setdefault(_c["name"].lower(), {})[_c["source"]] = _c["name"]
_list_census, _list_unresolved = [], []
for _s in subclasses:
    if "spellList" not in _s: continue      # only subclasses that cast on their own
    _s["spellList"] = spell_list_for(_s, _printings)
    _lbl = (f"{_s['className']}|{_s.get('classSource', '')}::"
            f"{_s.get('shortName') or _s['name']}|{_s['source']}")
    if _s["spellList"]:
        _list_census.append(f"{_lbl}={_s['spellList'][0]}|{_s['spellList'][1]}")
    else:
        _list_unresolved.append(_lbl)
_list_census.sort(); _list_unresolved.sort()

# Prerequisites, for feats AND optional features. Each entry in `prerequisite` is an
# alternative (OR), so we emit one record per alternative: a display string plus the
# parts the app can actually check. `soft` marks an alternative that also carries a
# condition we don't model (ability scores, proficiencies, backgrounds, campaigns) —
# those can never be proved unmet, only "can't tell".
_SOFT_KEYS = {"ability", "proficiency", "background", "campaign", "other", "otherSummary",
              "item", "feature", "featCategory"}

# 5etools' own category codes. Anything NOT here is a category a book invented — UA's
# "Wild Talent", a brew's own — and it is carried through under its own name rather than
# being folded into "general", which is what silently misfiled Wild Talents.
FEAT_CAT_FULL = {"O": "Origin", "G": "General", "D": "Dragonmark", "DG": "Dark Gift",
                 "EB": "Epic Boon", "FS": "Fighting Style",
                 "FS:P": "Fighting Style (Paladin)", "FS:R": "Fighting Style (Ranger)",
                 "FS:B": "Fighting Style (Bard)", "FS:M": "Fighting Style (Monk)"}

def feat_cat_name(cat, declared=None):
    """Display name for a feat category: the known code, then a file's own
    `_meta.featCategories`, then the raw value (UA writes the full name straight in)."""
    if not cat: return FEAT_CAT_FULL["G"]
    return FEAT_CAT_FULL.get(cat) or (declared or {}).get(cat) or cat

# "Can't Have Another Wild Talent Feat" — the exclusivity a category carries in prose,
# which 5etools models as `exclusiveFeatCategory` only sometimes.
_EXCL_RE = re.compile(r"(?:no other|can'?t have another)\s+(.+?)(?:\s+feat)?$", re.I)

def _is_self_exclusive(text, own_name):
    m = _EXCL_RE.match((text or "").strip().rstrip("."))
    return bool(m and own_name and m.group(1).strip().lower() == own_name.strip().lower())

def _plain(x):
    """A prerequisite reference -> its bare display name."""
    if isinstance(x, dict):
        return rich_strip(x.get("displayEntry") or x.get("entrySummary") or x.get("entry")
                          or x.get("name") or "")
    return rich_strip(str(x).split("|")[0])

def _prereq_blocks(o, own_cat=None, declared=None):
    out = []
    own_name = feat_cat_name(own_cat, declared) if own_cat else None
    for p in (o.get("prerequisite") or []):
        b = {"text": "", "level": None, "cls": None, "feats": [], "optfeats": [],
             "races": [], "spells": [], "spellFilters": [], "spellcasting": False, "pact": None,
             "checks": [], "soft": False, "exclusiveCat": []}
        bits = []
        lv = p.get("level")
        if isinstance(lv, dict):
            b["cls"] = (lv.get("class") or {}).get("name")
            b["level"] = lv.get("level")
            bits.append(f"{b['cls']} level {b['level']}" if b["cls"] else f"level {b['level']}")
        elif lv is not None:
            b["level"] = lv; bits.append(f"level {lv}")
        for ft in (p.get("feat") or []):
            n = _plain(ft); b["feats"].append(n); bits.append(n)
        for of in (p.get("optionalfeature") or []):
            n = _plain(of); b["optfeats"].append(n); bits.append(n)
        for rc in (p.get("race") or []):
            n = _plain(rc); b["races"].append(n); bits.append(n)
        for sp in (p.get("spell") or []):
            n = _plain(sp); b["spells"].append(n); bits.append(n)
            # "a Warlock Cantrip That Deals Damage" is a FILTER, not a spell name — and the
            # app could only ever say "can't verify" about it (D31). 5etools carries the real
            # `choose` string, so the build can answer it: carry the filter alongside.
            if isinstance(sp, dict) and sp.get("choose"):
                filt = {}
                for part in str(sp["choose"]).split("|"):
                    if "=" in part:
                        k, v = part.split("=", 1); filt[k.strip()] = v.strip()
                if filt: b["spellFilters"].append({"text": n, "filter": filt})
        if p.get("pact"): b["pact"] = p["pact"]; bits.append(f"Pact of the {p['pact']}")
        if p.get("spellcasting") or p.get("spellcasting2020") or p.get("spellcastingFeature"):
            b["spellcasting"] = True; bits.append("spellcasting")
        # the parts we can't model go in `checks`, kept separate so the app can show a
        # per-part verdict (level met / not met) instead of one undifferentiated blob
        soft = []
        for ab in (p.get("ability") or []):
            soft += [f"{k.upper()} {v}+" for k, v in ab.items()]
        for pr in (p.get("proficiency") or []):
            soft += [f"{v} {k} proficiency" for k, v in pr.items()]
        for bg in (p.get("background") or []): soft.append(_plain(bg))
        for fe in (p.get("feature") or []): soft.append(_plain(fe))
        for it in (p.get("item") or []): soft.append(rich_strip(it))
        for cp in (p.get("campaign") or []): soft.append(f"{cp} campaign")
        # "only one feat of this category" IS checkable — the build's own feats say so.
        # It used to land in `checks`, where D31 can only ever call it "maybe".
        excl_bits = []
        for fc in (p.get("exclusiveFeatCategory") or []):
            b["exclusiveCat"].append(fc)
            excl_bits.append(f"no other {feat_cat_name(fc, declared)} feat")
        if p.get("other"): soft.append(rich_strip(p["other"]))
        osum = p.get("otherSummary")
        osum_excl = False
        if isinstance(osum, dict):
            t = rich_strip(osum.get("entrySummary") or osum.get("entry") or "")
            # a category whose exclusivity is stated only in prose (UA's Wild Talents)
            if own_cat and _is_self_exclusive(t, own_name):
                if own_cat not in b["exclusiveCat"]: b["exclusiveCat"].append(own_cat)
                excl_bits.append(t); osum_excl = True
            elif t: soft.append(t)
        b["checks"] = [x for x in soft if x]
        bits += b["checks"] + excl_bits
        b["soft"] = any(k in _SOFT_KEYS and not (k == "otherSummary" and osum_excl) for k in p)
        b["text"] = ", ".join(x for x in bits if x)
        if b["text"]: out.append(b)
    return out

def _prereq_text(o, own_cat=None, declared=None):
    return " or ".join(b["text"] for b in _prereq_blocks(o, own_cat, declared)) or None

feats = []
# a FUNCTION, not a shared literal: `empty_grants()` copies the dict but hands every
# spell-less record the SAME fixed/picks lists, so anything appended to one would appear
# on all of them. Nothing appended before; parse_marks does.
def empty_grants():
    return {"fixed": [], "picks": [], "expansions": [], "optionGroups": [], "ability": None}
_featdata = load(os.path.join(MIRROR, "feats.json"))
_featcats = (_featdata.get("_meta") or {}).get("featCategories") or {}
for ft in _featdata.get("feat", []):
    if not valid_name(ft): continue
    cat = ft.get("category", "G")
    fs_class = {"FS:R": "Ranger", "FS:P": "Paladin", "FS": "Fighter"}.get(cat)
    has_spells = "additionalSpells" in ft
    feats.append({"name": ft["name"], "source": ft.get("source", ""), "group": bgroup(ft.get("source", "")),
                  "book": bname(ft.get("source", "")), "reprinted": reprinted(ft),
                  "supersededBy": superseded_by(ft),
                  "page": ft.get("page"),
                  "category": cat, "fsClass": fs_class,   # fighting-style feats attach to a class
                  "catName": feat_cat_name(cat, _featcats),  # what the picker calls this category
                  "srd": bool(ft.get("srd52")),
                  "hasSpells": has_spells,               # non-spell feats are build-choice-only
                  "optFeatures": opt_progression(ft),    # Eldritch Adept, Metamagic Adept… (D28)
                  "repeatable": _repeatable(ft),         # Magic Initiate, Elemental Adept… (D135)
                  "featSlots": feat_progression(ft),     # a feature that hands you a feat slot (D135)
                  "prereq": _prereq_text(ft, cat, _featcats),
                  "prereqs": _prereq_blocks(ft, cat, _featcats),
                  "grants": parse_grants(ft.get("additionalSpells")) if has_spells else empty_grants()})
    feats[-1]["grants"]["marks"] = parse_marks(ft)
    _apply_own_note(feats[-1]["grants"], _own_note_blocks(ft))
    _fg = _form_grants(ft)
    if _fg:
        feats[-1]["forms"] = _fg
        for _g in _fg: referenced.update(_g["creatures"])

# ---- optional features (invocations, metamagic, pact boons, maneuvers…) ----
# Extracted generically: every featureType, with its prerequisites as display text.
# How many you get is NOT hardcoded — it comes from each class/subclass's
# optionalfeatureProgression (see opt_progression below), so slots are data.
optfeats = []
_optpath = os.path.join(MIRROR, "optionalfeatures.json")
for o in (load(_optpath).get("optionalfeature", []) if os.path.exists(_optpath) else []):
    if not valid_name(o): continue
    has_spells = "additionalSpells" in o
    optfeats.append({"name": o["name"], "source": o.get("source", ""),
                     "group": bgroup(o.get("source", "")), "book": bname(o.get("source", "")),
                     "reprinted": reprinted(o), "supersededBy": superseded_by(o),
                     "page": o.get("page"), "srd": bool(o.get("srd52")),
                     "types": o.get("featureType") or [],
                     "repeatable": _repeatable(o),       # "You can gain this invocation more than once"
                     "featSlots": feat_progression(o),   # Lessons of the First Ones → an Origin feat
                     "prereq": _prereq_text(o), "prereqs": _prereq_blocks(o),
                     "hasSpells": has_spells,
                     "grants": parse_grants(o.get("additionalSpells")) if has_spells else empty_grants()})
    optfeats[-1]["grants"]["marks"] = parse_marks(o)
    _apply_own_note(optfeats[-1]["grants"], _own_note_blocks(o))
    _fg = _form_grants(o)
    if _fg:
        optfeats[-1]["forms"] = _fg
        for _g in _fg: referenced.update(_g["creatures"])

# species (ALL, even without spells; split lineages that carry named blocks)
races = []
def emit_species(name, source, blocks, srd=False, page=None, base=None, lineage=None,
                 reprint=False, superseded=None, note=None):
    """`base` is the parent species a lineage hangs off — the picker groups on it (D46).

    A species that splits into lineages emits SEVERAL records, and the reprint stamp
    belongs to EVERY one of them (D127). The old code stamped `races[-1]` after the call,
    so a split species flagged only its last lineage — and the subrace loop never stamped
    at all, which is why the Gith and Half-Elf twins read as originals."""
    if not isinstance(name, str) or not name.strip(): return   # see valid_name
    start = len(races)
    named = [b for b in (blocks or []) if b.get("name")]
    if len(named) > 1:
        for b in named:
            races.append({"name": f"{name} — {b['name']}", "source": source, "group": bgroup(source),
                          "book": bname(source), "srd": srd, "page": page,
                          "base": name, "lineage": b["name"], "grants": parse_grants([b])})
    else:
        races.append({"name": name, "source": source, "group": bgroup(source), "book": bname(source),
                      "srd": srd, "page": page,
                      "base": base or name, "lineage": (lineage or name) if base else "",
                      "grants": parse_grants(blocks)})
    for r in races[start:]:
        r["reprinted"] = bool(reprint); r["supersededBy"] = superseded
        _apply_own_note(r["grants"], note)

rd = load(os.path.join(MIRROR, "races.json"))
for rc in rd.get("race", []):
    if not valid_name(rc): continue
    emit_species(rc["name"], rc.get("source", ""), rc.get("additionalSpells"), bool(rc.get("srd52")),
                 rc.get("page"), reprint=reprinted(rc), superseded=superseded_by(rc),
                 note=_own_note_blocks(rc))
for rc in rd.get("subrace", []) if isinstance(rd.get("subrace"), list) else []:
    base = rc.get("raceName", ""); nm = rc.get("name") or ""
    if not rc.get("additionalSpells"):   # skip spell-less subraces (noise)
        continue
    emit_species(f"{base} ({nm})" if nm else base, rc.get("source", ""), rc.get("additionalSpells"),
                 bool(rc.get("srd52")), rc.get("page"), base=base or None, lineage=nm or None,
                 reprint=reprinted(rc), superseded=superseded_by(rc), note=_own_note_blocks(rc))

# ---- source registry (for the settings selector) ---------------------------
src_counter = defaultdict(lambda: {"spells": 0, "classes": 0, "subclasses": 0, "feats": 0, "species": 0})
for s in spells.values(): src_counter[s["source"]]["spells"] += 1
for c in classes: src_counter[c["source"]]["classes"] += 1
for s in subclasses: src_counter[s["source"]]["subclasses"] += 1
for f_ in feats: src_counter[f_["source"]]["feats"] += 1
for r in races: src_counter[r["source"]]["species"] += 1
sources = {}
for src, cnt in src_counter.items():
    sources[src] = {"name": bname(src), "group": bgroup(src), "counts": cnt}

# ---- multiclass + pact slot tables (2024 = 2014) ---------------------------
FULL_MC = [
    [2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
    [4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
    [4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],
    [4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,0],
    [4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1],
]
PACT = [(1,1),(2,1),(2,2),(2,2),(2,3),(2,3),(2,4),(2,4),(2,5),(2,5),
        (3,5),(3,5),(3,5),(3,5),(3,5),(3,5),(4,5),(4,5),(4,5),(4,5)]

# built here, not when the spells were done: a feature can reference a stat block too,
# and `referenced` only holds those once the feat and optional-feature loops have run
monsters = {k: statblock(mon_pool[k]) for k in sorted(referenced) if k in mon_pool}
digest = {
    "meta": {"mirror": os.path.basename(os.path.dirname(MIRROR)), "spellCount": len(spells)},
    "sources": sources, "spells": list(spells.values()), "classes": classes,
    "subclasses": subclasses, "feats": feats, "races": races, "optfeats": optfeats,
    "monsters": monsters, "fullMc": FULL_MC, "pact": PACT,
}
out_path = os.path.join(os.path.dirname(__file__), "data", "data.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(digest, f, ensure_ascii=False, separators=(",", ":"))

# ---- SRD 5.2 subset (CC-BY-4.0) — embedded in the public build -------------
def _srd_subset():
    # an SRD spell may carry a stat block that is NOT itself SRD — drop those, or the
    # public build would redistribute unlicensed text under the CC-BY footer
    smon = {k: v for k, v in monsters.items() if v.get("srd")}
    ss = []
    for sp in spells.values():
        if not sp.get("srd"): continue
        sb = sp.get("statblock")
        if sb and not sb.get("srd"):
            sp = dict(sp); sp.pop("statblock", None)
        # same gate on the creature SET: a non-SRD stat block may not ride along
        if sp.get("creatures"):
            keep = [k for k in sp["creatures"] if k in smon]
            sp = dict(sp)
            if keep: sp["creatures"] = keep
            else: sp.pop("creatures", None)
        ss.append(sp)
    sc = [c for c in classes if c.get("srd")]
    ssub = [s for s in subclasses if s.get("srd")]
    sf = [f_ for f_ in feats if f_.get("srd")]
    sr = [r for r in races if r.get("srd")]
    so = [o for o in optfeats if o.get("srd")]
    cnt = defaultdict(lambda: {"spells": 0, "classes": 0, "subclasses": 0, "feats": 0, "species": 0})
    for s in ss: cnt[s["source"]]["spells"] += 1
    for c in sc: cnt[c["source"]]["classes"] += 1
    for s in ssub: cnt[s["source"]]["subclasses"] += 1
    for f_ in sf: cnt[f_["source"]]["feats"] += 1
    for r in sr: cnt[r["source"]]["species"] += 1
    for o in so: cnt[o["source"]]["species"] += 0   # optional features share their book's row
    srdsrc = {src: {"name": bname(src), "group": bgroup(src), "counts": c} for src, c in cnt.items()}
    return {"meta": {"srd": True, "spellCount": len(ss)}, "sources": srdsrc,
            "spells": ss, "classes": sc, "subclasses": ssub, "feats": sf, "races": sr,
            "optfeats": so, "monsters": smon, "fullMc": FULL_MC, "pact": PACT}

srd = _srd_subset()
# Product-identity names: SRD 5.2 renames 17 spells (Bigby's Hand → Arcane Hand …) and
# 5etools carries the licensed name as the `srd52` string. The PUBLIC subset must use it
# everywhere at once — the record itself, other spells' prose, and every grant that names
# the spell — so the rename runs over the serialized subset, not field by field. The full
# local digest keeps the real names.
_ren = {sp["name"]: sp["srd"].strip() for sp in spells.values()
        if isinstance(sp.get("srd"), str) and sp["srd"].strip()
        and sp["srd"].strip() != sp["name"]}
if _ren:
    blob = json.dumps(srd, ensure_ascii=False, separators=(",", ":"))
    for old, new in sorted(_ren.items(), key=lambda kv: -len(kv[0])):
        blob = blob.replace(json.dumps(old, ensure_ascii=False)[1:-1],
                            json.dumps(new, ensure_ascii=False)[1:-1])
    srd = json.loads(blob)
    print(f"SRD renames applied: {len(_ren)} product-identity spells")
srd_path = os.path.join(os.path.dirname(__file__), "data", "data-srd.json")
with open(srd_path, "w", encoding="utf-8") as f:
    json.dump(srd, f, ensure_ascii=False, separators=(",", ":"))
print(f"SRD subset: spells={len(srd['spells'])} classes={len(srd['classes'])} "
      f"subclasses={len(srd['subclasses'])} feats={len(srd['feats'])} species={len(srd['races'])}"
      f" → {srd_path} ({os.path.getsize(srd_path)//1024} KB)")

print(f"stat blocks attached to spells: {sb_count}; "
      f"creature sets: {creature_sets} spells over {len(monsters)} monsters")
if COPY_UNRESOLVED:
    # the D127 tripwire: 0 today. A `_copy` that carries `_mod` is a merge language we do
    # NOT speak, and half-merging it silently would be worse than leaving it hollow.
    print(f"UNRESOLVED _copy records: {len(COPY_UNRESOLVED)}")
    for _lbl, _why in COPY_UNRESOLVED[:20]: print(f"  {_lbl} — {_why}")
# the D130 census: how many subclasses supply their own spellcasting, and which class list
# each one derived. A mirror update that adds one, or that stops naming a list, shows here
# (and fails cparity's pinned census) instead of quietly reaching a Wizard default.
print(f"subclass spell lists: {len(_list_census)} derived, "
      f"{len(_list_unresolved)} unresolved — " + "; ".join(_list_census))
for _lbl in _list_unresolved:
    print(f"  UNRESOLVED spell list: {_lbl} casts on its own progression but its data "
          f"names no class list — spellList=null (D130)")
print(f"spells={len(spells)} classes={len(classes)} (casters="
      f"{sum(1 for c in classes if c['caster'])}) subclasses={len(subclasses)} "
      f"feats={len(feats)} species={len(races)} sources={len(sources)}")
print("wrote", out_path, f"({os.path.getsize(out_path)//1024} KB)")
