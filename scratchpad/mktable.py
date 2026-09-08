#!/usr/bin/env python3
"""Three surfaces for FILTERING and SORTING the spell table (his "design it with mockups").

Writes scratchpad/mockups/table{1,2,3}.html — SELF-CONTAINED pages with the real stylesheet
inlined, each with its own dark/light switch. Nothing is wired.

What is settled before these, from the interview (2026-09-08):
  · the filter narrows on BOTH sets — the picker axes (D174) AND the axes only the table
    knows (prepared state, who grants it, casting ability, book)
  · a sort orders rows INSIDE the level groups; "No grouping" joins Group by, and that
    is how you get one flat sorted list
  · a name search box, like the eligible list has
  · filter/sort/group all persist globally beside the columns — so a clear-all has to be
    reachable without opening anything
  · print takes a toggle in the print options, default off (not shown here)

1, 2 and 3 varied WHERE THE CONTROLS LIVE and HOW A SORT IS INVOKED:
  1 · a filters row above the table  + sort by clicking a column header
  2 · everything inside the ⋯ menu   + sort from a select in that menu
  3 · a visible toolbar              + sort from a select in the toolbar

He took NONE of them (2026-09-08): "add a simple filter button to the current header.
Filters appear as an additional chipfield above the table. Remove search." Plus: sort by
BOTH a column-header click and a Sort by select, and an active-filter chip is removable on
its own. That is variant 4 — the one to judge; 1–3 are kept as the record of what it beat.

Every spell value below is READ OFF data/data.json, never invented, and every control is
one the app already has at the height D198's scale gives it: `.btn`/`.iconbtn`/`select`/
`input` at 34px, `.cbtn` chips at 22px, `.afchip` in the active-filter line.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scratchpad", "mockups")
DATA = os.path.join(ROOT, "data", "data.json")

# ── the build the mockup shows ────────────────────────────────────────────────
# A Wizard 7 carrying a Staff of Fire. All three variants show the SAME state — filtered to
# "Prepared today" and sorted by School inside the level groups — so the only thing being
# compared is the chrome. The filter is set on purpose: it now survives a reload, so its
# narrowed state is the one that has to stay readable.
SHOWN = [
    # name, mark, who grants it
    ("Fire Bolt",        "on",   "Wizard"),
    ("Mage Hand",        "on",   "Wizard"),
    ("Prestidigitation", "on",   "Wizard"),
    ("Shield",           "on",   "Wizard"),
    ("Magic Missile",    "on",   "Wizard"),
    ("Burning Hands",    "book", "Wizard"),
    ("Misty Step",       "on",   "Wizard"),
    ("Scorching Ray",    "on",   "Wizard"),
    ("Invisibility",     "book", "Wizard"),
    ("Counterspell",     "on",   "Wizard"),
    ("Fireball",         "on",   "Wizard"),
    ("Fly",              "on",   "Wizard"),
    ("Fireball",         "cast", "Staff of Fire"),
    ("Wall of Fire",     "book", "Wizard"),
    ("Polymorph",        "on",   "Wizard"),
]
TOTAL = 47          # what the build actually holds, so the chip can read "15 of 47"
CASTS = {"Staff of Fire": "chg"}

ROMAN = ["Cantrips", "I level", "II level", "III level", "IV level", "V level",
         "VI level", "VII level", "VIII level", "IX level"]
SCHOOL_SHORT = {"Abjuration": "Abj.", "Conjuration": "Conj.", "Divination": "Div.",
                "Enchantment": "Ench.", "Evocation": "Evoc.", "Illusion": "Illus.",
                "Necromancy": "Necro.", "Transmutation": "Trans."}
SAVE_SHORT = {"strength": "str", "dexterity": "dex", "constitution": "con",
              "intelligence": "int", "wisdom": "wis", "charisma": "cha"}
ABIL_SHORT = {"str": "Str", "dex": "Dex", "con": "Con",
              "int": "Int", "wis": "Wis", "cha": "Cha"}

ICO = {
    "check": '<path d="M3 8.6 6.4 12 13 4.6"/>',
    "x": '<path d="M4 4l8 8M12 4l-8 8"/>',
    "filter": '<path d="M2.6 3.5h10.8l-4.2 5v4.3l-2.4 1.2V8.5z"/>',
    "book": '<path d="M3 3.2h4.2A1.8 1.8 0 0 1 9 5v8a1.4 1.4 0 0 0-1.4-1.4H3z"/>'
            '<path d="M13 3.2H8.8A1.8 1.8 0 0 0 7 5v8a1.4 1.4 0 0 1 1.4-1.4H13z"/>',
    "moon": '<path d="M9.4 2.4a5.9 5.9 0 1 0 4.2 8.9A6.6 6.6 0 0 1 9.4 2.4z"/>',
    "grip": '<circle cx="6" cy="4" r="1.3"/><circle cx="10" cy="4" r="1.3"/>'
            '<circle cx="6" cy="8" r="1.3"/><circle cx="10" cy="8" r="1.3"/>'
            '<circle cx="6" cy="12" r="1.3"/><circle cx="10" cy="12" r="1.3"/>',
}
FILLED = {
    "dots": '<circle cx="3.2" cy="8" r="1.4"/><circle cx="8" cy="8" r="1.4"/>'
            '<circle cx="12.8" cy="8" r="1.4"/>',
    "dot": '<circle cx="8" cy="8" r="3.4"/>',
    "spark": '<path d="M8 1.6 9.7 6.3 14.4 8 9.7 9.7 8 14.4 6.3 9.7 1.6 8 6.3 6.3z"/>',
}


def ico(name):
    if name in FILLED:
        return (f'<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">'
                f'{FILLED[name]}</svg>')
    return (f'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            f'{ICO[name]}</svg>')


# ── real spell values ─────────────────────────────────────────────────────────
def load_spells():
    with open(DATA, encoding="utf-8") as f:
        d = json.load(f)
    by_name = {}
    for sp in d["spells"]:
        by_name.setdefault(sp["name"], sp)      # first printing wins; the values agree
    return by_name


def short_dur(d):
    d = str(d or "")
    if d.lower().startswith("instant"):
        return "Instant."
    if d.lower().startswith("until dispelled"):
        return "Until disp."
    for long, short in (("minutes", "m"), ("minute", "m"), ("hours", "h"), ("hour", "h"),
                        ("rounds", "rd"), ("round", "rd"), ("days", "d"), ("day", "d")):
        d = d.replace(long, short)
    return d.replace(" ", "")


def short_time(t):
    return {"action": "A", "bonus action": "BA", "reaction": "RA"}.get(str(t), short_dur(t))


def comp_cell(sp):
    c = sp.get("comp") or {}
    out = [k.upper() for k in ("v", "s", "m") if c.get(k)]
    txt = "/".join(out) or "—"
    if c.get("cost"):
        txt += "*"
    return txt


def save_cell(sp):
    saves = [SAVE_SHORT.get(s, s) for s in (sp.get("save") or [])]
    if saves:
        return " ".join(f'<span class="savechip {a}">{ABIL_SHORT[a]}</span>' for a in saves)
    if sp.get("atk"):
        return '<span class="savechip atk">Atk</span>'
    return "—"


MARKS = {
    "free": ('<td class="pickcell always">' + ico("check") + "</td>"),
    "on": ('<td class="pickcell on">' + ico("dot") + "</td>"),
    "cast": ('<td class="pickcell innate">' + ico("spark") + "</td>"),
    "book": ('<td class="pickcell inbook">' + ico("book") + "</td>"),
}

COLS = ["", "Spell", "Save", "School", "Time", "Range", "Comp.", "Duration", "Conc",
        "Casts", "Source"]


def rows_html(spells, sort_col=None, sort_dir="asc", flat=False):
    """The table body. `sort_col` only marks a header — the row ORDER is written out below
    the way that sort would leave it, so the mockup shows the result, not the promise."""
    picked = []
    for name, mark, src in SHOWN:
        sp = spells.get(name)
        if not sp:
            continue
        picked.append((sp, mark, src))

    def keyf(item):
        sp, mark, src = item
        if sort_col == "School":
            return (sp["school"], sp["name"])
        if sort_col == "Time":
            return (short_time(sp["time"]), sp["name"])
        if sort_col == "Spell":
            return (sp["name"],)
        return (sp["level"], sp["name"])

    if flat:
        picked.sort(key=keyf, reverse=(sort_dir == "desc"))
    else:
        picked.sort(key=lambda i: (i[0]["level"],) + keyf(i))

    span = len(COLS)
    out, last = [], None
    for sp, mark, src in picked:
        if not flat and sp["level"] != last:
            last = sp["level"]
            out.append(f'<tr class="grouphdr lvl"><td colspan="{span}">'
                       f'<span>{ROMAN[sp["level"]]}</span></td></tr>')
        cls = ' class="unprep"' if mark == "book" else ""
        cells = [
            MARKS[mark],
            f'<td class="nm">{sp["name"]}</td>',
            f'<td class="savecell">{save_cell(sp)}</td>',
            f'<td>{SCHOOL_SHORT.get(sp["school"], sp["school"])}</td>',
            f'<td>{short_time(sp["time"])}</td>',
            f'<td>{sp["range"].replace("feet", "ft")}</td>',
            f'<td>{comp_cell(sp)}</td>',
            f'<td>{short_dur(sp["durTxt"])}</td>',
            (f'<td class="concmark">{ico("check")}</td>' if sp.get("conc")
             else '<td class="nil">—</td>'),
            f'<td>{CASTS.get(src, "—") if CASTS.get(src) else "—"}</td>',
            f'<td>{src}</td>',
        ]
        out.append(f"<tr{cls}>" + "".join(cells) + "</tr>")
    return "\n".join(out), len(picked)


def head_html(sortable, sort_col=None, sort_dir="asc"):
    ths = []
    for c in COLS:
        if not c:
            ths.append('<th></th>')
            continue
        if sortable:
            car = ""
            if c == sort_col:
                car = f'<span class="lvlcar{" up" if sort_dir == "asc" else ""}"></span>'
            cls = "nm sortth" + (" sorted" if c == sort_col else "")
            ths.append(f'<th class="{cls}"><button class="sortbtn">{c}{car}</button></th>')
        else:
            ths.append(f'<th class="{"nm" if c == "Spell" else ""}">{c}</th>')
    return "<tr>" + "".join(ths) + "</tr>"


# ── the filter body, shared by all three (the SET is settled; only its host varies) ──
# Sectioned exactly as D174 draws a filter menu: a group is a row that states what it is
# narrowed to and opens on click, one at a time. The table-only axes come FIRST — they are
# the questions you can only ask here — then the spell axes the pickers already offer.
def fgroup(head, value, open_items=None, on=(), abil=False):
    narrowed = "" if value == "all" else " narrowed"
    car = ' up' if open_items else ''
    body = ""
    if open_items:
        btns = "".join(
            f'<button class="cbtn{" on" if i in on else ""}'
            f'{" abt " + i.lower() if abil else ""}">{i}</button>' for i in open_items)
        body = f'<div class="fgbody"><div class="cbrow">{btns}</div></div>'
    return (f'<div class="fgrp"><button class="fghead"><span class="fgh">{head}</span>'
            f'<span class="fgv{narrowed}">{value}</span>'
            f'<span class="lvlcar{car}"></span></button>{body}</div>')


TABLE_AXES = (
    fgroup("Prepared", "Prepared today") +
    fgroup("Granted by", "all") +
    fgroup("Casting ability", "all") +
    fgroup("Book", "all")
)
SPELL_AXES = (
    fgroup("Level", "all") +
    fgroup("School", "all") +
    fgroup("Cast time", "all") +
    fgroup("Duration", "all") +
    fgroup("Components", "all") +
    fgroup("Damage", "all", ["Acid", "Cold", "Fire", "Force", "Lightning", "Necrotic",
                             "Poison", "Psychic", "Radiant", "Thunder"]) +
    fgroup("Save", "all") +
    fgroup("Condition", "all")
)
SWITCHES = (
    '<label class="mopt"><span>Ritual</span><button class="swk swoff"></button></label>'
    '<label class="mopt"><span>Concentration</span><button class="swk swoff"></button></label>'
)
FILTER_BODY = (f'<div class="mopt colhead">This table</div>{TABLE_AXES}'
               f'<div class="sep"></div>'
               f'<div class="mopt colhead">The spell</div>{SPELL_AXES}'
               f'<div class="sep"></div>{SWITCHES}'
               f'<div class="sep"></div>'
               f'<div class="fclearrow"><button class="btn">Clear all filters</button></div>')

GROUP_SELECT_FLAT = ('<select><option>Level only</option><option>Casting ability</option>'
                '<option>Source</option><option selected>No grouping</option></select>')
GROUP_SELECT_LVL = ('<select><option selected>Level only</option>'
                    '<option>Casting ability</option><option>Source</option>'
                    '<option>No grouping</option></select>')
SORT_SELECT = ('<select><option>Level</option><option selected>School</option>'
               '<option>Name</option><option>Cast time</option><option>Duration</option>'
               '<option>Source</option></select>')

COLUMNS_BODY = (
    '<div class="mopt colhead">Columns <button class="btn tiny">Reset</button></div>'
    '<div class="collist">' +
    "".join(f'<div class="colrow"><input type="checkbox" checked>'
            f'<span class="collbl">{c}</span><span class="ico colgrip">{ico("grip")}</span>'
            f'</div>' for c in ["Spell", "Save", "School", "Time", "Range"]) +
    '</div>')

CHIPS = ["Prepared today"]


def actfilt(removable=False):
    if removable:
        chips = "".join(
            f'<span class="afchip">{c}<button class="rm ico xsm">{ico("x")}</button></span>'
            for c in CHIPS)
    else:
        chips = "".join(f'<span class="afchip">{c}</span>' for c in CHIPS)
    return (f'<div class="actfilt"><div class="afchips">{chips}</div>'
            f'<button class="afclear ico">{ico("x")}</button></div>')


def card(heading_extra, body, chip):
    return f"""<div class="card mkcard">
  <h2><span class="ttl">Selected spells</span> <span class="count">{chip}</span>
    <button class="btn prepbtn"><span class="lbl">Prepare daily</span>
      <span class="ico picoi">{ico("moon")}</span></button>
    {heading_extra}
  </h2>
  <div class="body">{body}</div>
</div>"""


MENU_BTN = ('<div class="menu tablemenu"><button class="btn iconbtn ico">'
            + ico("dots") + '</button></div>')


def build(spells):
    variants = []

    # ── 1 · a filters row above the table, sort on the column header ──────────
    body1, n1 = rows_html(spells, sort_col="School")
    flat_body, _ = rows_html(spells, sort_col="School", flat=True)
    v1 = card(
        MENU_BTN,
        f"""<div class="filters">
      <input type="search" placeholder="Filter by name">
      <button class="btn iconbtn ico">{ico("filter")}</button>
      <button class="cbtn lbl-ico"><span class="ico">{ico("check")}</span>Prepared</button>
    </div>
    {actfilt()}
    <div class="tablewrap"><table class="spelltable">
      <thead>{head_html(True, "School")}</thead>
      <tbody>{body1}</tbody></table></div>""",
        f"{n1} of {TOTAL}")
    v1 += f"""
<div class="mkaside">
  <div class="mklbl">the filter button's popover</div>
  <div class="menupop mkpop">{FILTER_BODY}</div>
</div>
<div class="mkaside">
  <div class="mklbl">the ⋯ menu keeps what it has</div>
  <div class="menupop mkpop narrow">
    <label class="mopt">Group by {GROUP_SELECT_LVL}</label>
    <div class="sep"></div>{COLUMNS_BODY}
  </div>
</div>
<div class="mkaside">
  <div class="mklbl">Group by → No grouping: the same sort, as one run</div>
  <div class="tablewrap mkflat"><table class="spelltable">
    <thead>{head_html(True, "School")}</thead>
    <tbody>{flat_body}</tbody></table></div>
</div>"""
    variants.append(("table1", "1 · a filters row, and the column header sorts", V1_CSS, v1))

    # ── 2 · everything inside the ⋯ menu ──────────────────────────────────────
    body2, n2 = rows_html(spells, sort_col="School")
    v2 = card(
        MENU_BTN,
        f"""{actfilt()}
    <div class="tablewrap"><table class="spelltable">
      <thead>{head_html(False)}</thead>
      <tbody>{body2}</tbody></table></div>""",
        f"{n2} of {TOTAL}")
    v2 += f"""
<div class="mkaside">
  <div class="mklbl">the ⋯ menu, holding all four</div>
  <div class="menupop mkpop">
    <label class="mopt">Group by {GROUP_SELECT_LVL}</label>
    <label class="mopt">Sort by {SORT_SELECT}</label>
    <label class="mopt"><span>Reverse</span><button class="swk swoff"></button></label>
    <div class="sep"></div>
    <div class="mopt colhead">Filters <span class="badge">1</span></div>
    {FILTER_BODY}
    <div class="sep"></div>{COLUMNS_BODY}
  </div>
</div>"""
    variants.append(("table2", "2 · everything inside the ⋯ menu", V2_CSS, v2))

    # ── 3 · a visible toolbar ─────────────────────────────────────────────────
    body3, n3 = rows_html(spells, sort_col="School")
    v3 = card(
        MENU_BTN,
        f"""<div class="tbar">
      <input type="search" placeholder="Filter by name">
      <label class="tbl">Group {GROUP_SELECT_LVL}</label>
      <label class="tbl">Sort {SORT_SELECT}</label>
      <button class="btn iconbtn ico">{ico("filter")}</button>
      <button class="btn iconbtn ico">{ico("x")}</button>
    </div>
    {actfilt()}
    <div class="tablewrap"><table class="spelltable">
      <thead>{head_html(False)}</thead>
      <tbody>{body3}</tbody></table></div>""",
        f"{n3} of {TOTAL}")
    v3 += f"""
<div class="mkaside">
  <div class="mklbl">the filter button's popover (the same one)</div>
  <div class="menupop mkpop">{FILTER_BODY}</div>
</div>
<div class="mkaside">
  <div class="mklbl">on a phone the toolbar wraps to two full rows (D196)</div>
  <div class="mkphone">
    <div class="tbar tbarnarrow">
      <input type="search" placeholder="Filter by name">
      <button class="btn iconbtn ico">{ico("filter")}</button>
      <button class="btn iconbtn ico">{ico("x")}</button>
    </div>
    <div class="tbar tbarnarrow">
      <label class="tbl">Group {GROUP_SELECT_LVL}</label>
      <label class="tbl">Sort {SORT_SELECT}</label>
    </div>
  </div>
</div>"""
    variants.append(("table3", "3 · a visible toolbar over the table", V3_CSS, v3))

    # ── 4 · HIS SHAPE: a filter button in the heading, chips above the table ──
    # The heading grows ONE control. The narrowed state is a chip field above the table —
    # present only when something is set — and each chip drops its own axis. No search box.
    # The sort is both: a click on a column header, and the Sort by select in the ⋯ menu
    # that already holds Group by, so a hidden column can still be sorted by.
    body4, n4 = rows_html(spells, sort_col="School")
    filter_btn = ('<button class="btn iconbtn ico mkfbtn">' + ico("filter")
                  + '<span class="fdot"></span></button>')
    v4 = card(
        filter_btn + MENU_BTN,
        f"""{actfilt(True)}
    <div class="tablewrap"><table class="spelltable">
      <thead>{head_html(True, "School")}</thead>
      <tbody>{body4}</tbody></table></div>""",
        f"{n4} of {TOTAL}")
    v4 += f"""
<div class="mkrow">
  <div class="mkaside">
    <div class="mklbl">the filter button's popover, under the button</div>
    <div class="menupop mkpop">{FILTER_BODY}</div>
  </div>
  <div class="mkaside">
    <div class="mklbl">the ⋯ menu: Group by gains "No grouping", Sort by joins it</div>
    <div class="menupop mkpop narrow">
      <label class="mopt">Group by {GROUP_SELECT_LVL}</label>
      <label class="mopt">Sort by {SORT_SELECT}</label>
      <label class="mopt"><span>Reverse</span><button class="swk swoff"></button></label>
      <div class="sep"></div>{COLUMNS_BODY}
    </div>
  </div>
</div>
<div class="mkaside">
  <div class="mklbl">nothing filtered: the chip field is not there at all</div>
  {card(filter_btn.replace(' mkfbtn', '') + MENU_BTN,
        f'<div class="tablewrap"><table class="spelltable">'
        f'<thead>{head_html(True)}</thead><tbody>{body4}</tbody></table></div>',
        f"{TOTAL} spells")}
</div>
<div class="mkaside">
  <div class="mklbl">Group by → No grouping: the same sort, as one run</div>
  <div class="tablewrap mkflat"><table class="spelltable">
    <thead>{head_html(True, "School")}</thead>
    <tbody>{flat_body}</tbody></table></div>
</div>"""
    variants.append(("table4", "4 · a filter button in the heading, chips above the table",
                     V4_CSS, v4))
    return variants


# ── per-variant CSS: only the mockup's own scaffolding, never a restyle ───────
COMMON_CSS = """
.mkcard{max-width:1040px}
.mkaside{margin:22px 0 0;max-width:1040px}
.mklbl{font:600 10.5px/1.4 var(--sans);letter-spacing:.06em;text-transform:uppercase;
  color:var(--muted);margin:0 0 6px}
.mkpop{position:static;display:block;width:320px;max-height:none}
.mkpop.narrow{width:240px}
.fclearrow{padding:6px 2px 2px;text-align:right}
/* `.lvlcar` is only ever dressed under `.lvlgroup h3`, `.gclv` and `.scoremenu .mchev`, so
   the chevron `filterMenu` appends to every group head is 0x0 in the live app — a real
   defect this work fixes. Drawn here the way the guide draws it, so the mockup shows the
   surface as it is MEANT to be. */
.fghead .lvlcar,.sortbtn .lvlcar{flex:0 0 auto;position:relative;width:12px;height:12px;font-size:0}
.fghead .lvlcar::before,.sortbtn .lvlcar::before{content:"";position:absolute;left:50%;top:50%;
  width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
  transform:translate(-50%,-50%) translateY(-1px) rotate(45deg)}
.fghead .lvlcar.up::before,.sortbtn .lvlcar.up::before{transform:translate(-50%,-50%) translateY(1px) rotate(-135deg)}
.mkflat{border:1px solid var(--line);border-radius:10px;background:var(--panel)}
"""
V1_CSS = COMMON_CSS + """
/* a sortable header is a BUTTON in the th, so the hit area is the whole cell and the
   caret is the app's drawn one — never a typed ↑/↓ (D57). */
.spelltable th.sortth{padding:0}
.sortbtn{width:100%;display:flex;align-items:center;justify-content:flex-start;gap:5px;
  background:none;border:0;color:inherit;font:inherit;text-align:left;cursor:pointer;
  padding:7px 9px}
.sortbtn:hover{color:var(--ink)}
.spelltable th.sorted .sortbtn{color:var(--gold)}
"""
V2_CSS = COMMON_CSS + """
.mkpop{width:340px}
"""
V3_CSS = COMMON_CSS + """
.tbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 8px}
.tbar input[type=search]{flex:1 1 180px;min-width:0}
.tbl{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--muted)}
.tbl select{min-width:118px}
.mkphone{width:375px;border:1px solid var(--line);border-radius:10px;padding:10px;
  background:var(--panel)}
.tbarnarrow{margin-bottom:8px}
.tbarnarrow:last-child{margin-bottom:0}
.tbarnarrow .tbl{flex:1 1 0;min-width:0}
.tbarnarrow .tbl select{flex:1 1 auto;min-width:0}
"""

V4_CSS = COMMON_CSS + V1_CSS[len(COMMON_CSS):] + """
/* the heading's filter button carries a dot when the table is narrowed, so the state is
   legible even with the chip field scrolled out of view */
.mkfbtn{position:relative;color:var(--accent);border-color:var(--accent)}
.mkfbtn .fdot{position:absolute;top:3px;right:3px;width:5px;height:5px;border-radius:50%;
  background:var(--accent)}
.afchip{display:inline-flex;align-items:center;gap:5px}
.mkrow{display:flex;gap:22px;flex-wrap:wrap;align-items:flex-start}
"""

SHELL = """<!doctype html><html lang="en" data-theme="dark"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} — My Spellbook mockup</title>
<style>
{app_css}
</style>
<style>
body{{margin:0;padding:22px 26px 60px;background:var(--bg)}}
h1{{font:600 15px/1.3 var(--sans);margin:0 0 4px}}
p.mknote{{font-size:12px;color:var(--muted);margin:0 0 18px;max-width:74ch}}
.mkband{{position:fixed;right:10px;top:10px;z-index:9;display:flex;align-items:center;gap:8px;
  font:600 11px/1.4 var(--sans);background:var(--panel-2);border:1px solid var(--line);
  border-radius:8px;padding:6px 10px;color:var(--muted)}}
{css}
</style></head><body>
<h1>{title}</h1>
<p class="mknote">{note}</p>
{body}
<div class="mkband">{short}<button class="btn tiny" id="mktheme">Light</button></div>
<script>
var r=document.documentElement,b=document.getElementById("mktheme");
b.onclick=function(){{var d=r.dataset.theme==="dark";r.dataset.theme=d?"light":"dark";
  b.textContent=d?"Dark":"Light";}};
</script>
</body></html>"""

NOTES = {
    "table1": "The lightest chrome. A filters row exactly like the eligible-spells card's — "
              "search, the filter button, one quick toggle — and the active filters named "
              "underneath with a clear-all X. Sorting is a click on the column header, which "
              "means every sortable column is discoverable where you are already looking and "
              "costs no room at all; it also means the sort is invisible until you notice the "
              "caret, and columns you have hidden can't be sorted by.",
    "table2": "No new chrome on the card whatsoever: Group by, Sort by, the filters and the "
              "columns all live in the ⋯ menu that already exists. One place to look, and it "
              "scales as axes are added. The cost is that the menu becomes long, and that "
              "everything you set is behind a button — the active-filter line under the "
              "heading is the only thing keeping the state honest, so it is not optional here.",
    "table3": "Everything visible at once: search, Group, Sort and the filter button in one "
              "row, with clear-all beside them. Nothing is hidden and the sort direction is a "
              "real control rather than a gesture. It costs a row above the table on every "
              "screen — and on a phone it is two full rows before you reach a single spell "
              "(shown below at 375px, restacked rather than squeezed, per D197).",
}
NOTES["table4"] = (
    "His shape. The card heading grows exactly one control \u2014 the filter button, which wears "
    "the accent and a dot while anything is set. What you have set is a chip field above the "
    "table, there only when it is narrowed, and every chip drops its own axis with the "
    "clear-all X at the right. No search box. Sorting is both: the column header clicks, and "
    "the \u22ef menu names the current sort beside Group by \u2014 which gains 'No grouping', the "
    "way to read the whole list as one ordered run.")
SHORT = {"table1": "1 · filters row", "table2": "2 · ⋯ menu", "table3": "3 · toolbar",
         "table4": "4 · his shape"}


def main():
    with open(os.path.join(ROOT, "src", "styles.css"), encoding="utf-8") as f:
        app_css = f.read()
    spells = load_spells()
    os.makedirs(OUT, exist_ok=True)
    names = []
    for name, title, css, body in build(spells):
        html = SHELL.format(app_css=app_css, title=title, css=css, body=body,
                            note=NOTES[name], short=SHORT[name])
        with open(os.path.join(OUT, f"{name}.html"), "w", encoding="utf-8") as f:
            f.write(html)
        names.append(name + ".html")
    print("wrote", ", ".join(names), "to scratchpad/mockups/")


if __name__ == "__main__":
    main()
