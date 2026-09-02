#!/usr/bin/env python3
"""Three compositions for the guided builder's stage (L5.4 · D158(f) · B1-05).

Writes scratchpad/mockups/guide{1,2,3}.html — static pages that link the REAL stylesheet, so
what you see is the app's own type, colour and spacing, not an approximation. Nothing here is
wired; these exist to be looked at and chosen between.

The problem, measured live at 1280x900: `#gStage` is 1008 x 852 and holds a 640 x 127 step
card parked top-left. Fill is 12% on this step, 11% to 27% across a walk (V-B refined B1's
9.49%). The card reads as a fragment of a panel that never loaded.

Constraints that bind every variant: D126(a,b,c) the guide is its own full-size page;
D131(c) the explanatory prose was deliberately removed; D131(a) one picker per section.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scratchpad", "mockups")

DOT = ('<span class="ico"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">'
       '<circle cx="8" cy="8" r="3.4"></circle></svg></span>')
TICK = ('<span class="ico"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
        'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<path d="M3 8.6 6.4 12 13 4.6"></path></svg></span>')


def step(label, value, state):
    """One row of the chain rail — the app's own .gcstep markup."""
    ico = TICK if state == "done" else DOT
    return (f'<button class="gcstep {state}"><span class="gck">'
            f'<span class="gcl">{label}</span><span class="gcv">{value}</span></span>'
            f'<span class="gcs">{ico}</span></button>')


def level(lv, name, steps, cls=""):
    body = f'<div class="gcsteps">{"".join(steps)}</div>' if steps else ""
    return (f'<div class="locard gclv {cls}" data-lv="{lv}"><div class="lobody">'
            f'<div class="lotop"><span class="lolv">L{lv}</span><b class="locls">{name}</b>'
            f'<span class="gcsev gcgold">{DOT}</span></div>{body}</div></div>')


CHAIN = "".join([
    level(1, "Wizard 1", [
        step("Class", "Wizard 1", "done"),
        step("Species", "to decide", "open cur"),
        step("Origin feat", "to decide", "open"),
        step("Cantrips", "0 of 3 chosen", "open"),
        step("Spellbook spells", "0 of 6 chosen", "open"),
    ], "gcopen"),
    level(2, "Wizard 2", []),
    level(3, "Wizard 3", [], "here"),
    level(4, "next level", []),
])

HEAD = """<div class="ghead">
  <b class="gh-name">Wizard</b><span class="gh-ver">v1</span>
  <span class="gh-lvl">L3 / 3</span>
  <span class="gh-prog"><span>3 / 10 decided</span><span class="gh-bar"><i style="width:30%"></i></span></span>
  <button class="btn tiny gh-toggle">Chain</button>
  <button class="btn tiny gh-swap">Character view</button>
</div>"""

# the step itself, identical in all three: the app's real card for "Species" at L1
CARD = """<div class="gcard">
  <div class="ghd"><b class="ghdt">Species</b></div>
  <p class="ghsub">L1</p>
  <div class="gsecb"><button class="btn on gbig">Choose a species</button></div>
</div>"""
NAV = """<div class="gnav">
  <button class="btn">← Back</button><button class="btn">Skip</button>
  <button class="btn on">Next →</button>
</div>"""

SHELL = """<!doctype html><html lang="en" data-theme="{theme}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Guide stage · {title}</title>
<link rel="stylesheet" href="../../src/styles.css">
<style>
/* the guide page shell, lifted so the mockup stands alone */
body{{margin:0}}
.gpage{{display:flex;flex-direction:column;height:100vh}}
.gbody{{display:flex;flex:1;min-height:0}}
.mkband{{position:fixed;right:10px;top:10px;z-index:9;font:600 11px/1.4 var(--sans);
  background:var(--panel-2);border:1px solid var(--line);border-radius:8px;padding:6px 10px;color:var(--muted)}}
{css}
</style></head><body>
<div class="gpage">{head}
  <div class="gbody">
    <aside class="gchain asc">{chain}</aside>
    {stage}
  </div>
</div>
<div class="mkband">{title}</div>
</body></html>"""

# ── 1 · centred column ─────────────────────────────────────────────────────
# The smallest possible answer: cap the stage's content and centre it, so the space around
# the card reads as composition instead of a missing panel. No new content, no new concepts,
# nothing to keep in step with the model. It does NOT make the page more useful — it stops it
# looking broken. If the void is only an aesthetic problem, this is the whole fix.
V1_CSS = """
.gstage{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 26px 34px}
.gstage>.gcard{width:min(640px,100%)}
.gstage>.gnav{width:min(640px,100%)}
"""
V1_STAGE = f'<div class="gstage">{CARD}{NAV}</div>'

# ── 2 · the level beside the step ──────────────────────────────────────────
# The stage carries what the step needs to be answered well: what this level already holds,
# and what the next one brings. It is STATE, not prose — the thing D131(c) removed was
# explanation, and this adds none. Cost: a second column that has to stay true as the walk
# moves, and a real risk of re-creating the character view inside the guide.
V2_CSS = """
.gstage{display:grid;grid-template-columns:minmax(0,640px) minmax(240px,320px);
  grid-template-rows:auto 1fr;gap:18px 26px;align-content:start;padding:20px 26px 34px}
.gstage>.gcard{grid-column:1;grid-row:1}
.gstage>.gnav{grid-column:1;grid-row:2;align-self:start}
.gside{grid-column:2;grid-row:1/span 2;display:flex;flex-direction:column;gap:10px}
.gside .locard{margin:0}
.gsh{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin:0 0 2px}
.gsrow{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;padding:3px 0}
.gsrow b{font-weight:600}
.gsrow span{color:var(--muted)}
@media (max-width:1100px){.gstage{grid-template-columns:minmax(0,1fr)}.gside{grid-column:1;grid-row:3}}
"""
V2_STAGE = f"""<div class="gstage">{CARD}{NAV}
  <div class="gside">
    <div class="locard"><div class="lobody">
      <p class="gsh">This level holds</p>
      <div class="gsrow"><b>Class</b><span>Wizard 1</span></div>
      <div class="gsrow"><b>Species</b><span>to decide</span></div>
      <div class="gsrow"><b>Origin feat</b><span>to decide</span></div>
      <div class="gsrow"><b>Cantrips</b><span>0 of 3</span></div>
      <div class="gsrow"><b>Spellbook</b><span>0 of 6</span></div>
    </div></div>
    <div class="locard"><div class="lobody">
      <p class="gsh">Level 2 brings</p>
      <div class="gsrow"><b>Spellbook spells</b><span>2 more</span></div>
      <div class="gsrow"><b>Slots</b><span>1st ×3</span></div>
    </div></div>
    <div class="locard"><div class="lobody">
      <p class="gsh">Casting now</p>
      <div class="gsrow"><b>Top spell</b><span>1st</span></div>
      <div class="gsrow"><b>Prepared</b><span>4</span></div>
      <div class="gsrow"><b>Slots</b><span>1st ×2</span></div>
    </div></div>
  </div>
</div>"""

# ── 3 · the card owns the stage ────────────────────────────────────────────
# No second column and no new content: the card simply stops being a 640px island. It fills
# the stage, its sections lay out in two columns when there is room, and the nav pins to the
# bottom edge where a footer belongs. The step's own contents are what fill the space, so a
# rich step (cantrips, spellbook) fills it honestly and a bare step stays bare — which is the
# one thing this variant does not solve.
V3_CSS = """
.gstage{display:flex;flex-direction:column;padding:20px 26px 20px}
.gstage>.gcard{max-width:none;flex:1;display:flex;flex-direction:column}
.gstage>.gcard .gsecb{margin-top:14px}
.gstage>.gnav{max-width:none;margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}
.gfill{flex:1;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;
  align-content:start;margin-top:16px}
.gfillbox{border:1px dashed var(--line);border-radius:var(--radius);padding:12px;color:var(--muted);
  font-size:12px}
"""
V3_STAGE = f"""<div class="gstage">
  <div class="gcard">
    <div class="ghd"><b class="ghdt">Species</b></div>
    <p class="ghsub">L1</p>
    <div class="gsecb"><button class="btn on gbig">Choose a species</button></div>
    <div class="gfill">
      <div class="gfillbox">a step's own sections land here — on Cantrips this is the picked
        list, on Spellbook spells the six rows, on Class the subclass choice</div>
      <div class="gfillbox">a one-section step like this one leaves the grid empty, which is
        the case this variant does not answer</div>
    </div>
  </div>
  {NAV}
</div>"""

VARIANTS = [
    ("guide1", "1 · centred column", V1_CSS, V1_STAGE),
    ("guide2", "2 · the level beside the step", V2_CSS, V2_STAGE),
    ("guide3", "3 · the card owns the stage", V3_CSS, V3_STAGE),
]

# ── 4 and 5 · the picker lives in the stage (Francesco's call, 2026-09-02) ──
# The side panels were rejected as redundant with the chain rail, correctly: the rail already
# lists every step of this level with its value. What is NOT anywhere on screen is the step's
# own WORK — today "Choose a species" opens a 760 x 645 modal over 852px of empty stage.
# These two put that list in the stage instead. Mobile keeps the modal (his call): below the
# guide's own breakpoint the stage is one narrow column and a sheet is the better surface.
SPECIES = [
    ("Aarakocra", "DMG", False, ""), ("Aasimar", "XPHB", True, "Light"),
    ("Aetherborn", "PSK", False, ""), ("Astral Elf", "AAG", True, ""),
    ("Autognome", "AAG", False, ""), ("Aven", "PSA", False, ""),
    ("Bugbear", "XL", False, ""), ("Bugbear", "MPMM", False, ""),
    ("Bullywug", "PSK", False, ""), ("Centaur", "MPMM", False, ""),
    ("Changeling", "MPMM", False, ""), ("Deep Gnome", "MPMM", True, "Disguise Self"),
    ("Dragonborn", "XPHB", False, ""), ("Drow", "XPHB", True, "Dancing Lights"),
    ("Dwarf", "XPHB", False, ""), ("Elf", "XPHB", True, "Prestidigitation"),
    ("Fairy", "MPMM", True, "Druidcraft"), ("Firbolg", "MPMM", True, "Detect Magic"),
    ("Genasi (Air)", "MPMM", True, "Shocking Grasp"), ("Genasi (Earth)", "MPMM", True, "Blade Ward"),
    ("Gith", "MPMM", True, "Mage Hand"), ("Gnome", "XPHB", False, ""),
    ("Goblin", "XPHB", False, ""), ("Goliath", "XPHB", True, "Various"),
    ("Halfling", "XPHB", False, ""), ("Harengon", "MPMM", False, ""),
    ("Hobgoblin", "MPMM", False, ""), ("Human", "XPHB", False, ""),
    ("Kenku", "MPMM", False, ""), ("Kobold", "MPMM", False, ""),
]
STAR = ('<span class="ico fmark"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">'
        '<path d="M8 1.6 9.7 6.3 14.4 8 9.7 9.7 8 14.4 6.3 9.7 1.6 8 6.3 6.3z"></path></svg></span>')
PLUS = ('<span class="ico"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
        'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<path d="M8 3v10M3 8h10"></path></svg></span>')


def entrow(name, book, grants, prev):
    star = STAR if grants else ""
    sub = f'<div class="entprev">{prev}</div>' if prev else ""
    return (f'<div class="entrow"><div class="entmain"><div class="entname">'
            f'<span class="entnm nmlink">{name}</span><span class="bchip">{book}</span>{star}</div>'
            f'{sub}</div><button class="tk ico-only" aria-label="Select">{PLUS}</button></div>')


ROWS = "".join(entrow(*r) for r in SPECIES)
PICKBAR = ('<div class="pickbar"><input type="search" placeholder="Filter by name">'
           '<span class="gpcount">95 species</span></div>')

# 4 · one column, capped where the modal was — the modal, unwrapped. Familiar and small; it
# uses none of the width it just gained, so the stage is still mostly empty to the right.
V4_CSS = """
.gstage{display:flex;flex-direction:column;padding:20px 26px 20px;overflow:hidden}
.gstep-head{max-width:760px}
.gstep-head h2{font-size:19px;margin:0}
.gstep-head .ghsub{margin:2px 0 0}
.gpickin{max-width:760px;flex:1;min-height:0;display:flex;flex-direction:column;margin-top:12px;
  border:1px solid var(--line);border-radius:var(--radius);background:var(--panel)}
.gpickin .pickbar{padding:10px 12px;border-bottom:1px solid var(--line);margin:0}
.gpickin .entlist{flex:1;min-height:0;overflow-y:auto;padding:4px 6px}
.gnav{max-width:760px;margin-top:14px}
"""
V4_STAGE = f"""<div class="gstage">
  <div class="gstep-head"><h2>Species</h2><p class="ghsub">L1 · 95 species, 12 grant spells</p></div>
  <div class="gpickin">{PICKBAR}<div class="entlist">{ROWS}</div></div>
  {NAV}
</div>"""

# 5 · the list uses the width it gained: the same picker in a responsive column grid, so a
# screenful is ~30 species instead of ~8 and the stage is genuinely full. This is the case FOR
# moving the picker at all — if the answer is 4, the modal was already fine.
V5_CSS = """
.gstage{display:flex;flex-direction:column;padding:20px 26px 20px;overflow:hidden}
.gstep-head h2{font-size:19px;margin:0}
.gstep-head .ghsub{margin:2px 0 0}
.gpickin{flex:1;min-height:0;display:flex;flex-direction:column;margin-top:12px;
  border:1px solid var(--line);border-radius:var(--radius);background:var(--panel)}
.gpickin .pickbar{padding:10px 12px;border-bottom:1px solid var(--line);margin:0}
.gpickin .pickbar input{max-width:340px}
.gpickin .entlist{flex:1;min-height:0;overflow-y:auto;padding:6px;
  display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2px 14px;align-content:start}
.gnav{max-width:none;margin-top:14px}
"""
V5_STAGE = f"""<div class="gstage">
  <div class="gstep-head"><h2>Species</h2><p class="ghsub">L1 · 95 species, 12 grant spells</p></div>
  <div class="gpickin">{PICKBAR}<div class="entlist">{ROWS}</div></div>
  {NAV}
</div>"""

VARIANTS += [
    ("guide4", "4 \u00b7 picker in the stage, one column", V4_CSS, V4_STAGE),
    ("guide5", "5 \u00b7 picker in the stage, using the width", V5_CSS, V5_STAGE),
]

# ── 6 · the mobile adaptation of 5 (his call: try one rather than fall back) ──
# The guide already shows EITHER the chain or the stage below its breakpoint, so the stage has
# the whole screen. Three things change from the desktop grid: the list becomes one column
# again (300px minimum never fits twice in 375), the filter bar sticks to the top of the
# scroller so it survives a long list, and the nav pins to the bottom edge — on a 95-row list
# Back/Skip/Next would otherwise be a scroll away at all times. The picked row keeps the same
# mark it has on desktop, since the list stays open there too.
V6_CSS = """
.gbody>.gchain{display:none}                 /* the guide already shows one or the other here */
.gstage{display:flex;flex-direction:column;padding:12px 12px 0;overflow:hidden}
.gstep-head h2{font-size:18px;margin:0}
.gstep-head .ghsub{margin:2px 0 0;font-size:12px}
.gpickin{flex:1;min-height:0;display:flex;flex-direction:column;margin-top:10px;
  border:1px solid var(--line);border-radius:var(--radius);background:var(--panel);overflow:hidden}
.gpickin .entlist{flex:1;min-height:0;overflow-y:auto;padding:4px 6px}
.gpickin .pickbar{position:sticky;top:0;z-index:2;background:var(--panel);
  padding:10px 12px;border-bottom:1px solid var(--line);margin:0}
.gpickin .pickbar input{flex:1}
.entrow{padding:9px 8px}                      /* a 44px touch target, per the mobile pass */
.gnav{position:sticky;bottom:0;max-width:none;margin:0;padding:10px 0 12px;
  background:linear-gradient(to top,var(--bg) 70%,transparent);gap:8px}
.gnav .btn{flex:1;padding:10px 8px}
.entrow .tk{min-width:38px;min-height:38px}
"""
V6_STAGE = f"""<div class="gstage">
  <div class="gstep-head"><h2>Species</h2><p class="ghsub">L1 · 95 species, 12 grant spells</p></div>
  <div class="gpickin">{PICKBAR}<div class="entlist">{ROWS}</div></div>
  {NAV}
</div>"""

VARIANTS += [("guide6", "6 \u00b7 mobile, picker in the stage", V6_CSS, V6_STAGE)]

# ── 7 and 8 · the reviewed version (Francesco, 2026-09-02) ─────────────────
# Three notes on what shipped as v1.5.20:
#   · "the picker should essentially replace the choose buttons, right now they are redundant"
#   · "never set the picker on more than one column"
#   · the guided builder has visual bugs
# So: the card keeps the step's HEADER and its answers so far, and the button that used to open
# the picker is gone — the list IS the control. One column, capped and centred so the space
# around it reads as composition rather than a missing panel (variant 1's lesson, applied to a
# stage that now carries something). Multi-section steps get a chip row (`.gtchips`, the guide's
# own control) instead of one button per section — 8 shows that case.
PICKED_CHIP = ('<span class="gchip">{name}<button class="gx" aria-label="Remove">'
               '<span class="ico"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
               'stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"></path>'
               '</svg></span></button></span>')

V7_CSS = """
.gstage{display:flex;flex-direction:column;align-items:center;padding:18px 26px 18px;overflow:hidden}
.gstep-head{width:min(720px,100%)}
.gstep-head h2{font-size:19px;margin:0}
.gstep-head .ghsub{margin:2px 0 0}
.gpickin{width:min(720px,100%);flex:1;min-height:0;display:flex;flex-direction:column;margin-top:12px;
  border:1px solid var(--line);border-radius:var(--radius);background:var(--panel);overflow:hidden}
.gpickin .pickbar{padding:10px 12px;border-bottom:1px solid var(--line);margin:0}
.gpickin .entlist{flex:1;min-height:0;overflow-y:auto;padding:4px 6px}
.gnav{width:min(720px,100%);margin-top:14px;max-width:none}
"""
V7_STAGE = f"""<div class="gstage">
  <div class="gstep-head"><h2>Species</h2><p class="ghsub">L1 · 95 species, 12 grant spells</p></div>
  <div class="gpickin">{PICKBAR}<div class="entlist">{ROWS}</div></div>
  {NAV}
</div>"""

# 8 · the same, for a step that carries TWO sections. One button per section was the old
# answer; here the sections are a chip row and the list below is whichever chip is on, so
# there is still exactly one picker on screen (D131(a)) and no button that repeats it.
SPELLS = [("Alarm","1st · Abjuration · 1 minute · 30 feet"),("Burning Hands","1st · Evocation · Action · Self (15 ft cone)"),
          ("Charm Person","1st · Enchantment · Action · 30 feet"),("Chromatic Orb","1st · Evocation · Action · 90 feet"),
          ("Color Spray","1st · Illusion · Action · Self (15 ft cone)"),("Comprehend Languages","1st · Divination · Action · Self"),
          ("Detect Magic","1st · Divination · Action · Self (30 ft sphere)"),("Disguise Self","1st · Illusion · Action · Self"),
          ("Expeditious Retreat","1st · Transmutation · Bonus action · Self"),("False Life","1st · Necromancy · Action · Self"),
          ("Feather Fall","1st · Transmutation · Reaction · 60 feet"),("Find Familiar","1st · Conjuration · 1 hour · 10 feet")]
SPROWS = "".join(f'<div class="sp"><div class="entmain"><div class="entname">'
                 f'<span class="entnm nmlink">{n}</span></div><div class="entprev">{m}</div></div>'
                 f'<button class="tk ico-only" aria-label="Take it">{PLUS}</button></div>' for n, m in SPELLS)
V8_CSS = V7_CSS + """
.gsecs{width:min(720px,100%);margin-top:10px}
.gpicked{width:min(720px,100%);display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.sp{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid var(--hairline)}
.sp .entmain{flex:1;min-width:0}
"""
V8_STAGE = f"""<div class="gstage">
  <div class="gstep-head"><h2>Spellcasting</h2><p class="ghsub">L1 · Wizard</p></div>
  <div class="gsecs gtchips">
    <button class="gtchip on">Cantrips <span class="lv">0 / 3</span></button>
    <button class="gtchip">Spellbook spells <span class="lv">2 / 6</span></button>
  </div>
  <div class="gpicked">{PICKED_CHIP.format(name="Fire Bolt")}{PICKED_CHIP.format(name="Mage Hand")}</div>
  <div class="gpickin">{PICKBAR.replace("95 species","37 spells")}<div class="entlist">{SPROWS}</div></div>
  {NAV}
</div>"""

VARIANTS += [
    ("guide7", "7 \u00b7 reviewed: the list replaces the button, one column", V7_CSS, V7_STAGE),
    ("guide8", "8 \u00b7 reviewed: a two-section step", V8_CSS, V8_STAGE),
]

# ── 9 and 10 · the rework (Francesco, 2026-09-02, second round) ────────────
# What v1.5.21 got wrong, in his words: *"weird background of the header, close button without
# our styling, but also shouldn't be there: there still is the double click first to open the
# picker, then to select. The picker should be the default section there, it needs a rework."*
# Both visual bugs have ONE cause, found by measuring the shipped page: relocating the modal's
# `.box` into the stage takes it out of `.modal`, so `.modal .box` (panel, border, radius,
# shadow), `.modal .mh` (padding, divider) and `.modal .mh .x` (the whole close button) stop
# matching — the box goes transparent, the header paints a panel band onto nothing, and the ×
# falls back to a raw browser button. These mockups do not relocate a dialog: the stage owns a
# PICKER SURFACE with no title bar, no close button and no footer, showing from the moment the
# step opens. The step card above is its title; Back / Skip / Next is its way out.
# 9 adds what the freed width is actually good for (his idea): a preview of whatever is
# selected, the same detail the modal shows, without the click that opens it.
ENTROWS = "".join(entrow(*r) for r in SPECIES[:16])
PREVIEW = """<div class="gprev">
  <div class="gprevh"><h3>Aasimar <span class="bchip">XPHB</span></h3><div class="sub">Species</div></div>
  <div class="gprevb">
    <div class="entsec"><div class="entsecn">Celestial Resistance</div>
      <p>You have Resistance to <span class="cc-dmg">Necrotic</span> damage and
      <span class="cc-dmg">Radiant</span> damage.</p></div>
    <div class="entsec"><div class="entsecn">Darkvision</div>
      <p>You have Darkvision with a range of <span class="cc-range">60 feet</span>.</p></div>
    <div class="entsec"><div class="entsecn">Healing Hands</div>
      <p>As a Magic action, you touch a creature and roll a number of d4s equal to your
      Proficiency. The creature regains a number of Hit Points equal to the total rolled.
      Once you use this trait, you can't use it again until you finish a Long Rest.</p></div>
    <div class="entsec"><div class="entsecn">Light Bearer</div>
      <p>You know the Light cantrip. Charisma is your spellcasting ability for it.</p></div>
  </div>
</div>"""

PICK_SURFACE_CSS = """
/* the picker as the stage's own surface: no title bar, no close button, no footer */
.gstage{display:flex;flex-direction:column;padding:18px 26px 18px;overflow:hidden}
.gstep-head h2{font-size:19px;margin:0}
.gstep-head .ghsub{margin:2px 0 0}
.gpickin{flex:1;min-height:0;display:flex;flex-direction:column;margin-top:12px;
  border:1px solid var(--line);border-radius:var(--radius);background:var(--panel);overflow:hidden}
.gpickin .pickbar{margin:0;padding:10px 12px;border-bottom:1px solid var(--line)}
.gpickin .entlist{flex:1;min-height:0;overflow-y:auto;padding:2px 8px}
.gnav{margin-top:14px;max-width:none}
"""
V9_CSS = PICK_SURFACE_CSS + """
/* his idea: the third empty band on the right carries the detail you would otherwise have to
   open a modal to read. One column of PICKER, one pane of preview — not two columns of list. */
.gwork{flex:1;min-height:0;display:grid;grid-template-columns:minmax(340px,440px) minmax(0,1fr);
  gap:18px;margin-top:12px}
.gwork>.gpickin{margin-top:0}
.gprev{min-height:0;display:flex;flex-direction:column;overflow:hidden;
  border:1px solid var(--line);border-radius:var(--radius);background:var(--panel)}
.gprevh{padding:12px 14px;border-bottom:1px solid var(--line)}
.gprevh h3{margin:0;font-size:15px}
.gprevh .sub{color:var(--muted);font-size:11.5px;margin-top:2px}
.gprevb{flex:1;min-height:0;overflow-y:auto;padding:12px 14px}
.entsec{margin-bottom:10px}
.entsecn{font-weight:600;font-size:12.5px;margin-bottom:2px}
.entsec p{margin:0 0 6px;font-size:12.5px;line-height:1.5;color:var(--muted)}
"""
V9_STAGE = f"""<div class="gstage">
  <div class="gstep-head"><h2>Species</h2><p class="ghsub">L1 · 127 species, 12 grant spells</p></div>
  <div class="gwork">
    <div class="gpickin">{PICKBAR.replace("95 species","127")}<div class="entlist">{ENTROWS}</div></div>
    {PREVIEW}
  </div>
  {NAV}
</div>"""

# 10 · the same surface without the preview: one column, capped and centred. The fallback if
# the preview is more than the step needs.
V10_CSS = PICK_SURFACE_CSS + """
.gstage{align-items:center}
.gstep-head,.gnav{width:min(720px,100%)}
.gpickin{width:min(720px,100%)}
"""
V10_STAGE = f"""<div class="gstage">
  <div class="gstep-head"><h2>Species</h2><p class="ghsub">L1 · 127 species, 12 grant spells</p></div>
  <div class="gpickin">{PICKBAR.replace("95 species","127")}<div class="entlist">{ROWS}</div></div>
  {NAV}
</div>"""

VARIANTS += [
    ("guide9", "9 \u00b7 rework: picker by default, with a preview pane", V9_CSS, V9_STAGE),
    ("guide10", "10 \u00b7 rework: picker by default, no preview", V10_CSS, V10_STAGE),
]

os.makedirs(OUT, exist_ok=True)
for name, title, css, stage in VARIANTS:
    for theme, suffix in (("dark", ""), ("light", "-light")):
        html = SHELL.format(theme=theme, title=title, css=css, head=HEAD, chain=CHAIN, stage=stage)
        with open(os.path.join(OUT, f"{name}{suffix}.html"), "w", encoding="utf-8") as f:
            f.write(html)
print("wrote", ", ".join(n + "{,-light}.html" for n, _, _, _ in VARIANTS), "to scratchpad/mockups/")
