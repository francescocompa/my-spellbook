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
        return segs[0].strip() if segs and segs[0].strip() else rest
    prev = None; out = s
    while prev != out:
        prev = out; out = re.sub(r"\{@[^{}]+\}", repl, out)
    return out

def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def spell_key(name, source):
    return f"{name.lower()}|{source.lower()}"

def reprinted(obj):
    return bool(obj.get("reprintedAs"))

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
            "page": sp.get("page"),
            "srd": bool(sp.get("srd52")),
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
    return {
        "name": m["name"], "source": m.get("source", ""), "page": m.get("page"),
        "kind": " ".join(x for x in (size, sb_type(m.get("type"))) if x),
        "align": sb_align(m.get("alignment")),
        "ac": sb_ac(m.get("ac")),
        "hp": str(hp.get("special") or (f"{hp.get('average','')} ({hp.get('formula','')})" if hp.get("average") else "")),
        "speed": sb_speed(m.get("speed")),
        "abilities": {k: m.get(k) for k in ("str", "dex", "con", "int", "wis", "cha") if m.get(k) is not None},
        "saves": {ABILITY_FULL.get(k, k): v for k, v in (m.get("save") or {}).items()},
        "skills": {k.title(): v for k, v in (m.get("skill") or {}).items() if k != "other"},
        "vulnerable": ", ".join(sb_dtypes(m.get("vulnerable"), "vulnerable")),
        "resist": ", ".join(sb_dtypes(m.get("resist"), "resist")),
        "immune": ", ".join(sb_dtypes(m.get("immune"), "immune")),
        "condImmune": ", ".join(sb_dtypes(m.get("conditionImmune"), "conditionImmune")),
        "senses": ", ".join(senses),
        "languages": ", ".join(m.get("languages") or []),
        "pb": m.get("pbNote") or (f"+{m['pb']}" if m.get("pb") else ""),
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
def _cr_of(m):
    cr = m.get("cr")
    c = cr.get("cr") if isinstance(cr, dict) else cr
    return str(c) if c is not None else ""

def _type_of(m):
    t = m.get("type")
    return (t.get("type") if isinstance(t, dict) else t) or ""

def carried_monster(m):
    """The predicate BOTH extractors use to decide what leaves the bestiary."""
    if m.get("summonedBySpell"): return True
    return (_type_of(m) == "beast" and _cr_of(m) == "0"
            and "swarm" not in (m.get("name") or "").lower())

CREATURE_RE = re.compile(r"\{@creature ([^}|]+)(?:\|([^}|]*))?[^}]*\}")
BFILTER_RE = re.compile(r"\{@filter [^|}]*\|bestiary\|([^}]*)\}")

def _mon_key(name, src):
    return f"{name.strip()}|{(src or '').strip().upper()}"

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
        cands = [_mon_key(name, src)] if src else mon_by_name.get(name.strip().lower(), [])
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
referenced = {k for sp in spells.values() for k in sp.get("creatures", [])}
monsters = {k: statblock(mon_pool[k]) for k in sorted(referenced)}

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
    if feature is None and feats is not None:
        feature = resolve_feature(feats, at, s)
    if ref.get("choice"):
        f, c = choose_filter(s)          # pass the whole ref so count survives
        bucket["picks"].append({"kind": kind, "atLevel": at, "recharge": recharge,
                                "count": c, "filter": f, "desc": ref["desc"], "feature": feature})
    else:
        bucket["fixed"].append({"kind": kind, "atLevel": at, "recharge": recharge, "spell": ref, "feature": feature})

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
            "filters": filters, "grants": bool(grants)}

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

def resolve_feature(feats, at, s):
    """Name the feature that grants spell/pick `s` at level `at`, or None."""
    if not feats: return None
    gf = [f for f in feats if f["grants"]]
    if not gf: return None
    same = [f for f in gf if f["level"] == at]
    if isinstance(s, dict) and "choose" in s:
        kv = _choose_kv(s["choose"])
        for f in same + gf:
            if kv in f["filters"]: return f["name"]
        if len(same) == 1: return same[0]["name"]
    else:
        sn = (s.split("#")[0].split("|")[0].strip().lower()) if isinstance(s, str) else ""
        for f in same + gf:
            if sn and sn in f["spells"]: return f["name"]
        if len(same) == 1: return same[0]["name"]
    if len(gf) == 1: return gf[0]["name"]
    return None

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
            "reprinted": reprinted(c), "page": c.get("page"),
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
    for sc in d.get("subclass", []):
        if EXCLUDE_CLASS(sc.get("className", "")): continue
        rec = {"name": sc.get("name", ""), "shortName": sc.get("shortName", sc.get("name", "")),
               "source": sc.get("source", ""), "group": bgroup(sc.get("source", "")),
               "book": bname(sc.get("source", "")), "reprinted": reprinted(sc),
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
            rec["spellList"] = ["Wizard", "XPHB"]   # EK / AT use the Wizard list
        subclasses.append(rec)

# Prerequisites, for feats AND optional features. Each entry in `prerequisite` is an
# alternative (OR), so we emit one record per alternative: a display string plus the
# parts the app can actually check. `soft` marks an alternative that also carries a
# condition we don't model (ability scores, proficiencies, backgrounds, campaigns) —
# those can never be proved unmet, only "can't tell".
_SOFT_KEYS = {"ability", "proficiency", "background", "campaign", "other", "otherSummary",
              "item", "feature", "exclusiveFeatCategory", "featCategory"}

def _plain(x):
    """A prerequisite reference -> its bare display name."""
    if isinstance(x, dict):
        return rich_strip(x.get("displayEntry") or x.get("entrySummary") or x.get("entry")
                          or x.get("name") or "")
    return rich_strip(str(x).split("|")[0])

def _prereq_blocks(o):
    out = []
    for p in (o.get("prerequisite") or []):
        b = {"text": "", "level": None, "cls": None, "feats": [], "optfeats": [],
             "races": [], "spells": [], "spellcasting": False, "pact": None,
             "checks": [], "soft": False}
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
        for fc in (p.get("exclusiveFeatCategory") or []): soft.append(f"no other {fc}-category feat")
        if p.get("other"): soft.append(rich_strip(p["other"]))
        osum = p.get("otherSummary")
        if isinstance(osum, dict): soft.append(rich_strip(osum.get("entrySummary") or osum.get("entry") or ""))
        b["checks"] = [x for x in soft if x]
        bits += b["checks"]
        b["soft"] = any(k in _SOFT_KEYS for k in p)
        b["text"] = ", ".join(x for x in bits if x)
        if b["text"]: out.append(b)
    return out

def _prereq_text(o):
    return " or ".join(b["text"] for b in _prereq_blocks(o)) or None

feats = []
EMPTY_GRANTS = {"fixed": [], "picks": [], "expansions": [], "optionGroups": [], "ability": None}
for ft in load(os.path.join(MIRROR, "feats.json")).get("feat", []):
    cat = ft.get("category", "G")
    fs_class = {"FS:R": "Ranger", "FS:P": "Paladin", "FS": "Fighter"}.get(cat)
    has_spells = "additionalSpells" in ft
    feats.append({"name": ft["name"], "source": ft.get("source", ""), "group": bgroup(ft.get("source", "")),
                  "book": bname(ft.get("source", "")), "reprinted": reprinted(ft),
                  "page": ft.get("page"),
                  "category": cat, "fsClass": fs_class,   # fighting-style feats attach to a class
                  "srd": bool(ft.get("srd52")),
                  "hasSpells": has_spells,               # non-spell feats are build-choice-only
                  "optFeatures": opt_progression(ft),    # Eldritch Adept, Metamagic Adept… (D28)
                  "prereq": _prereq_text(ft), "prereqs": _prereq_blocks(ft),
                  "grants": parse_grants(ft.get("additionalSpells")) if has_spells else dict(EMPTY_GRANTS)})

# ---- optional features (invocations, metamagic, pact boons, maneuvers…) ----
# Extracted generically: every featureType, with its prerequisites as display text.
# How many you get is NOT hardcoded — it comes from each class/subclass's
# optionalfeatureProgression (see opt_progression below), so slots are data.
optfeats = []
_optpath = os.path.join(MIRROR, "optionalfeatures.json")
for o in (load(_optpath).get("optionalfeature", []) if os.path.exists(_optpath) else []):
    has_spells = "additionalSpells" in o
    optfeats.append({"name": o["name"], "source": o.get("source", ""),
                     "group": bgroup(o.get("source", "")), "book": bname(o.get("source", "")),
                     "reprinted": reprinted(o), "page": o.get("page"), "srd": bool(o.get("srd52")),
                     "types": o.get("featureType") or [],
                     "prereq": _prereq_text(o), "prereqs": _prereq_blocks(o),
                     "hasSpells": has_spells,
                     "grants": parse_grants(o.get("additionalSpells")) if has_spells else dict(EMPTY_GRANTS)})

# species (ALL, even without spells; split lineages that carry named blocks)
races = []
def emit_species(name, source, blocks, srd=False, page=None, base=None, lineage=None):
    """`base` is the parent species a lineage hangs off — the picker groups on it (D46)."""
    named = [b for b in (blocks or []) if b.get("name")]
    if len(named) > 1:
        for b in named:
            races.append({"name": f"{name} — {b['name']}", "source": source, "group": bgroup(source),
                          "book": bname(source), "reprinted": False, "srd": srd, "page": page,
                          "base": name, "lineage": b["name"], "grants": parse_grants([b])})
    else:
        races.append({"name": name, "source": source, "group": bgroup(source), "book": bname(source),
                      "reprinted": False, "srd": srd, "page": page,
                      "base": base or name, "lineage": (lineage or name) if base else "",
                      "grants": parse_grants(blocks)})

rd = load(os.path.join(MIRROR, "races.json"))
for rc in rd.get("race", []):
    emit_species(rc["name"], rc.get("source", ""), rc.get("additionalSpells"), bool(rc.get("srd52")),
                 rc.get("page"))
    if reprinted(rc) and races: races[-1]["reprinted"] = True
for rc in rd.get("subrace", []) if isinstance(rd.get("subrace"), list) else []:
    base = rc.get("raceName", ""); nm = rc.get("name") or ""
    if not rc.get("additionalSpells"):   # skip spell-less subraces (noise)
        continue
    emit_species(f"{base} ({nm})" if nm else base, rc.get("source", ""), rc.get("additionalSpells"),
                 bool(rc.get("srd52")), rc.get("page"), base=base or None, lineage=nm or None)

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
srd_path = os.path.join(os.path.dirname(__file__), "data", "data-srd.json")
with open(srd_path, "w", encoding="utf-8") as f:
    json.dump(srd, f, ensure_ascii=False, separators=(",", ":"))
print(f"SRD subset: spells={len(srd['spells'])} classes={len(srd['classes'])} "
      f"subclasses={len(srd['subclasses'])} feats={len(srd['feats'])} species={len(srd['races'])}"
      f" → {srd_path} ({os.path.getsize(srd_path)//1024} KB)")

print(f"stat blocks attached to spells: {sb_count}; "
      f"creature sets: {creature_sets} spells over {len(monsters)} monsters")
print(f"spells={len(spells)} classes={len(classes)} (casters="
      f"{sum(1 for c in classes if c['caster'])}) subclasses={len(subclasses)} "
      f"feats={len(feats)} species={len(races)} sources={len(sources)}")
print("wrote", out_path, f"({os.path.getsize(out_path)//1024} KB)")
