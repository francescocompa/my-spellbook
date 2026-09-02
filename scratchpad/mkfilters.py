#!/usr/bin/env python3
"""Three filter surfaces for the pickers (D172 · his "show me a mockup first").

Writes scratchpad/mockups/filters{1,2,3}.html — static pages linking the REAL stylesheet, so
what you see is the app's own type, colour and spacing. Nothing is wired.

The set is the one he chose in the interview, and every value below is READ OFF data.json,
not invented, so the mockups show the real size of the problem:

    Level 10 · School 8 · Cast time 4 · Duration 4 · Components 4 + 2 switches
    · Damage 13 · Save 6 · Condition 15 · Books (a checklist)

That is ~68 toggles for the spell picker. The current surface is ONE popover
(`.menupop`, min-width 180px) holding at most a category row and two checkboxes — it
cannot hold this, and that is the thing to choose between here.

Every variant uses the app's own controls: `.mopt.colhead` for a noun heading, `.cbrow`
/`.cbtn` for an enumeration, `.swk` for a binary (the Library's switch), `.srcscroll` for
books. Nothing new is invented except the container.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scratchpad", "mockups")

SCHOOL = ["Abjur", "Conj", "Div", "Ench", "Evoc", "Illu", "Necr", "Trans"]
LEVEL = ["C", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
TIME = ["Action", "Bonus", "Reaction", "Minutes+"]
DUR = ["Instant", "Rounds", "Hours+", "Permanent"]
COMP = ["V", "S", "M", "M with cost"]
DMG = ["Acid", "Bludg", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Piercing",
       "Poison", "Psychic", "Radiant", "Slashing", "Thunder"]
SAVE = ["Str", "Dex", "Con", "Int", "Wis", "Cha"]
COND = ["Blinded", "Charmed", "Deafened", "Exhaustion", "Frightened", "Grappled",
        "Incapacitated", "Invisible", "Paralyzed", "Petrified", "Poisoned", "Prone",
        "Restrained", "Stunned", "Unconscious"]

# the agreed spell set, as (heading, items, preselected) — `on` is what a fresh picker shows
SPELL_GROUPS = [
    ("Level", LEVEL, []),
    ("School", SCHOOL, ["Evoc"]),
    ("Cast time", TIME, []),
    ("Duration", DUR, []),
    ("Components", COMP, []),
    ("Damage", DMG, ["Fire"]),
    ("Save", SAVE, []),
    ("Condition", COND, []),
]
SPELL_SWITCHES = [("Ritual", False), ("Concentration", False)]

FEAT_GROUPS = [("Category", ["Origin", "General", "Fighting Style", "Epic Boon"], ["Origin"]),
               ("Ability bonus", SAVE, []),
               ("Prerequisites", ["Eligible", "Not yet", "Can't verify"], ["Eligible"])]
CLASS_GROUPS = [("Main score", SAVE, ["Int"])]


def cbrow(items, on):
    btns = "".join(f'<button class="cbtn{" on" if i in on else ""}">{i}</button>' for i in items)
    return f'<div class="cbrow">{btns}</div>'


def group(head, items, on, badge=""):
    b = f' <span class="badge">{badge}</span>' if badge else ""
    return (f'<div class="mopt colhead">{head}{b}</div>{cbrow(items, on)}')


def switch(label, on):
    return (f'<label class="mopt"><span>{label}</span>'
            f'<button class="swk{"" if on else " swoff"}"></button></label>')


BOOKS = """<div class="mopt colhead">Books <span class="badge">44/44</span></div>
<div class="quick"><button class="btn tiny">All</button><button class="btn tiny">None</button>
<button class="btn tiny">2024 core</button><button class="btn tiny">My sources</button></div>"""

SEARCH = ('<input type="search" placeholder="Filter by name" '
          'style="flex:1;min-width:0" value="">')

ROWS = "".join(
    f'<div class="sp"><div class="nm">{n}</div><div class="meta">'
    f'<span>{lv}</span><span>{sc}</span><span>{t}</span><span>{r}</span></div>'
    f'<div class="take"><button class="tk ico-only">'
    f'<span class="ico"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
    f'stroke-width="1.5"><path d="M8 3v10M3 8h10"></path></svg></span></button></div></div>'
    for n, lv, sc, t, r in [
        ("Burning Hands", "I", "Evocation", "Action", "Self (15 ft cone)"),
        ("Chromatic Orb", "I", "Evocation", "Action", "90 feet"),
        ("Fireball", "III", "Evocation", "Action", "150 feet"),
        ("Scorching Ray", "II", "Evocation", "Action", "120 feet"),
        ("Wall of Fire", "IV", "Evocation", "Action", "120 feet"),
        ("Delayed Blast Fireball", "VII", "Evocation", "Action", "150 feet"),
    ])


# ── 1 · one popover, sectioned ─────────────────────────────────────────────
# The smallest change: the surface we have, with the agreed groups stacked into it as noun
# headings. Shown at its real height so the cost is visible — this is what "just add the
# filters" produces, and the popover becomes a scrolling column taller than the list it
# filters. Kept as the honest baseline, not as a recommendation.
V1_CSS = """
.mkpop{position:static;width:300px;max-height:520px;overflow-y:auto}
.mkwrap{display:flex;gap:18px;align-items:flex-start}
.mklist{flex:1;min-width:0;border:1px solid var(--line);border-radius:10px;padding:6px 10px;background:var(--panel)}
"""
V1 = f"""<div class="mkwrap">
  <div class="menupop mkpop">
    {"".join(group(h, i, o) for h, i, o in SPELL_GROUPS)}
    <div class="sep"></div>
    {"".join(switch(l, o) for l, o in SPELL_SWITCHES)}
    <div class="sep"></div>
    {BOOKS}
  </div>
  <div class="mklist">
    <div class="pickbar">{SEARCH}<span class="gpcount">6 of 936</span></div>
    {ROWS}
  </div>
</div>"""

# ── 2 · a filter panel beside the list ─────────────────────────────────────
# The filters stop being a menu and become a COLUMN of the picker, open or shut. Every
# group is visible at once, nothing scrolls inside anything else, and the list narrows
# rather than being covered. Below the picker's breakpoint the same column is a sheet.
V2_CSS = """
.mkpanel{flex:0 0 258px;border-right:1px solid var(--line);padding-right:14px;
  display:flex;flex-direction:column;gap:2px;max-height:520px;overflow-y:auto}
.mkwrap{display:flex;gap:14px;align-items:flex-start;border:1px solid var(--line);
  border-radius:10px;padding:10px;background:var(--panel)}
.mklist{flex:1;min-width:0}
.mkpanel .mopt{display:flex;align-items:center;justify-content:space-between;gap:8px;
  font-size:12.5px;color:var(--muted);padding:6px 0}
.mkpanel .mopt.colhead{padding-left:0;text-transform:uppercase;font-size:10.5px;letter-spacing:.05em}
.mkpanel .cbrow{margin:0 0 8px}
.mkclear{margin-left:auto;font-size:10px}
"""
V2 = f"""<div class="mkwrap">
  <aside class="mkpanel">
    <div class="mopt colhead">Filters <button class="btn tiny mkclear">Clear</button></div>
    {"".join(group(h, i, o) for h, i, o in SPELL_GROUPS)}
    {"".join(switch(l, o) for l, o in SPELL_SWITCHES)}
    {BOOKS}
  </aside>
  <div class="mklist">
    <div class="pickbar">{SEARCH}<span class="gpcount">6 of 936</span></div>
    {ROWS}
  </div>
</div>"""

# ── 3 · a filter bar, one group at a time ──────────────────────────────────
# The bar names the groups; each opens its own small popover. What is CHOSEN shows as
# removable chips in the bar, so the narrowing is readable without opening anything — the
# thing neither of the other two gives you. Scales to any number of groups because no
# surface ever holds more than one.
V3_CSS = """
.mkwrap{border:1px solid var(--line);border-radius:10px;padding:10px;background:var(--panel)}
.mkbar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 4px}
.mkbar .cbtn.grp{border-style:dashed;color:var(--ink)}
.mkact{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin:6px 0 10px;
  padding-top:8px;border-top:1px solid var(--line)}
.mkact .lbl{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-weight:700}
.mkchip{font-size:11px;padding:2px 6px 2px 9px;border-radius:14px;border:1px solid var(--accent);
  background:var(--accent-soft);color:var(--accent);display:inline-flex;align-items:center;gap:5px}
.mkchip b{font-weight:600}
.mkchip .x{cursor:pointer;opacity:.8;font-size:12px;line-height:1}
.mkopen{position:relative}
.mkopen .menupop{display:block;min-width:230px;top:auto;right:auto;left:0;margin-top:6px;position:absolute}
.mkrow{display:flex;gap:18px;align-items:flex-start}
"""
V3 = f"""<div class="mkwrap">
  <div class="pickbar">{SEARCH}<span class="gpcount">6 of 936</span></div>
  <div class="mkbar">
    <button class="cbtn grp">Level</button>
    <span class="mkopen"><button class="cbtn grp on">School ·1</button>
      <div class="menupop">{group("School", SCHOOL, ["Evoc"])}</div></span>
    <button class="cbtn grp">Cast time</button>
    <button class="cbtn grp">Duration</button>
    <button class="cbtn grp">Components</button>
    <button class="cbtn grp on">Damage ·1</button>
    <button class="cbtn grp">Save</button>
    <button class="cbtn grp">Condition</button>
    <button class="cbtn grp">Books</button>
  </div>
  <div class="mkact"><span class="lbl">Showing</span>
    <span class="mkchip"><b>Evocation</b><span class="x">✕</span></span>
    <span class="mkchip"><b>Fire</b><span class="x">✕</span></span>
    <button class="btn tiny">Clear all</button></div>
  <div style="height:120px"></div>
  {ROWS}
</div>"""

# the same standard on the two smaller pickers, so it can be judged as a system
SMALL = f"""<div style="display:flex;gap:22px;flex-wrap:wrap;margin-top:26px">
  <div><div class="mopt colhead" style="padding-left:0">Feat picker</div>
    <div class="menupop" style="position:static;width:280px">
      {"".join(group(h, i, o) for h, i, o in FEAT_GROUPS)}
      <div class="sep"></div>{switch("Spellcasting", True)}{switch("Repeatable", False)}
      <div class="sep"></div>{BOOKS}</div></div>
  <div><div class="mopt colhead" style="padding-left:0">Class picker</div>
    <div class="menupop" style="position:static;width:280px">
      {"".join(group(h, i, o) for h, i, o in CLASS_GROUPS)}
      <div class="sep"></div>{BOOKS}</div></div>
</div>"""

VARIANTS = [
    ("filters1", "1 · one popover, sectioned", V1_CSS, V1),
    ("filters2", "2 · a filter panel beside the list", V2_CSS, V2),
    ("filters3", "3 · a filter bar, one group at a time", V3_CSS, V3),
]

SHELL = """<!doctype html><html lang="en" data-theme="{theme}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Filters · {title}</title>
<link rel="stylesheet" href="../../src/styles.css">
<style>
body{{margin:0;padding:22px 26px 60px;background:var(--bg)}}
h1{{font:600 15px/1.3 var(--sans);margin:0 0 4px}}
p.note{{font-size:12px;color:var(--muted);margin:0 0 18px;max-width:70ch}}
.mkband{{position:fixed;right:10px;top:10px;z-index:9;font:600 11px/1.4 var(--sans);
  background:var(--panel-2);border:1px solid var(--line);border-radius:8px;padding:6px 10px;color:var(--muted)}}
{css}
</style></head><body>
<h1>{title}</h1>
<p class="note">{note}</p>
{body}
{small}
<div class="mkband">{title}</div>
</body></html>"""

NOTES = {
    "filters1": "The surface we have, with the agreed groups stacked into it. Real heights: the "
                "popover is taller than the list it filters and scrolls inside itself. This is the "
                "baseline, not a recommendation — it is here so the cost of the set you chose is "
                "visible.",
    "filters2": "The filters become a column of the picker rather than a menu over it. Everything "
                "is visible at once and the list narrows instead of being covered. Costs width, "
                "which the stage has and the mobile sheet does not — there the same column is a "
                "sheet you slide up.",
    "filters3": "The bar names the groups and each opens its own small popover, so no surface ever "
                "holds more than one group. What you have chosen shows as removable chips, which "
                "is the only one of the three where the narrowing is readable without opening "
                "anything.",
}

os.makedirs(OUT, exist_ok=True)
for name, title, css, body in VARIANTS:
    for theme, suffix in (("dark", ""), ("light", "-light")):
        html = SHELL.format(theme=theme, title=title, css=css, body=body,
                            small=SMALL, note=NOTES[name])
        with open(os.path.join(OUT, f"{name}{suffix}.html"), "w", encoding="utf-8") as f:
            f.write(html)
print("wrote", ", ".join(n + "{,-light}.html" for n, _, _, _ in VARIANTS), "to scratchpad/mockups/")
