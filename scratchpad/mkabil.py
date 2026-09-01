#!/usr/bin/env python3
"""Ability scores — round 2 mockups, against the REAL stylesheet.

Three placements for the section (A/B/C) and two ways to express the ASI slot, plus the
contribution stack that Francesco's "full origin model, open to later injections" answer
implies. Everything here reuses live components: .card/.body/.fieldset/.fld, .stat, .abchip,
.abtile, .picksel/.fldrow/.cnt, .chips, .prepnav.
Regenerate: python3 scratchpad/mkabil.py
"""
import os

ABILS = [("str", "STR"), ("dex", "DEX"), ("con", "CON"),
         ("int", "INT"), ("wis", "WIS"), ("cha", "CHA")]
# a worked Wizard 12 / Fighter 1: base from a standard array, +2/+1 from a background,
# an ASI at 4, a half-feat at 8, a full ASI at 12
SCORES = {"str": (8, [], 8), "dex": (14, [], 14), "con": (13, [("background", 1)], 14),
          "int": (15, [("background", 2), ("ASI · L4", 2), ("Fey Touched · L8", 1),
                       ("ASI · L12", 1)], 20),
          "wis": (12, [("ASI · L12", 1)], 13), "cha": (10, [], 10)}
MOD = lambda v: ("+" if (v - 10) // 2 >= 0 else "−") + str(abs((v - 10) // 2))


def stack_line(parts):
    if not parts:
        return '<span class="abfrom">array</span>'
    return '<span class="abfrom">array · ' + " · ".join(
        f"+{n} {who}" for who, n in parts) + "</span>"


def row_full(k, lab):
    base, parts, final = SCORES[k]
    return (f'<div class="abrow">'
            f'<span class="abchip {k}">{lab}</span>'
            f'<span class="abscore">{final}</span>'
            f'<span class="abmod">{MOD(final)}</span>'
            f'<span class="abstack">{stack_line(parts)}</span></div>')


def tile(k, lab):
    base, parts, final = SCORES[k]
    return (f'<div class="stat abstat"><div class="k"><span class="abchip {k}">{lab}</span></div>'
            f'<div class="v">{final} <small>{MOD(final)}</small></div></div>')


def strip(k, lab):
    base, parts, final = SCORES[k]
    return (f'<span class="abmini {k}"><span class="abchip {k}">{lab}</span>'
            f'<b>{final}</b><small>{MOD(final)}</small></span>')


CARD_A = f"""<div class="card">
  <h2>Character</h2>
  <div class="body">
    <div class="fieldset"><label class="fld">Classes &amp; levels</label>
      <div class="fldrow"><button class="picksel"><span>Wizard</span><span class="pk-caret">⌄</span></button><span class="cnt done">12</span></div>
      <div class="fldrow"><button class="picksel"><span>Fighter</span><span class="pk-caret">⌄</span></button><span class="cnt done">1</span></div>
    </div>
    <div class="fieldset">
      <label class="fld">Ability scores <span class="fldnote">standard array · DC 17</span></label>
      <div class="abgrid">{''.join(tile(k, l) for k, l in ABILS)}</div>
      <button class="picksel ph" style="margin-top:8px"><span class="lbl-ico">edit scores…</span></button>
    </div>
    <div class="fieldset"><label class="fld">Species / lineage</label>
      <button class="picksel"><span>Human</span><span class="pk-caret">⌄</span></button></div>
    <div class="fieldset"><label class="fld">Feats</label>
      <div class="fldrow"><button class="picksel"><span>Magic Initiate</span><span class="pk-caret">⌄</span></button><span class="cnt done">1/1</span></div>
    </div>
  </div>
</div>"""

CARD_B = f"""<div class="card">
  <h2>Ability scores <span class="count">DC 17 · +9</span></h2>
  <div class="body">
    <div class="abrows">{''.join(row_full(k, l) for k, l in ABILS)}</div>
    <div class="prepnav" style="padding:10px 0 0">
      <span class="sub" style="color:var(--muted);font-size:12px">standard array · 2 of 2 ASIs spent</span>
      <span class="prepnav-sp"></span>
      <button class="btn">Edit…</button>
    </div>
  </div>
</div>"""

CARD_C = f"""<div class="card">
  <h2>Character</h2>
  <div class="body">
    <div class="fieldset"><label class="fld">Classes &amp; levels</label>
      <div class="fldrow"><button class="picksel"><span>Wizard</span><span class="pk-caret">⌄</span></button><span class="cnt done">12</span></div>
    </div>
    <div class="fieldset">
      <label class="fld">Ability scores</label>
      <button class="picksel abstrip"><span class="abministrip">{''.join(strip(k, l) for k, l in ABILS)}</span><span class="pk-caret">⌄</span></button>
    </div>
    <div class="fieldset"><label class="fld">Species / lineage</label>
      <button class="picksel"><span>Human</span><span class="pk-caret">⌄</span></button></div>
  </div>
</div>"""

MODAL_C = f"""<div class="modal mkstage"><div class="box narrow">
  <div class="mh"><h2>Ability scores</h2><button class="x">×</button></div>
  <div class="mb">
    <div class="prepnav" style="border:none;padding:0 0 10px">
      <div class="abtiles" style="justify-content:flex-start">
        <button class="abtile on"><span class="abchip">STANDARD ARRAY</span></button>
        <button class="abtile"><span class="abchip">POINT BUY</span></button>
        <button class="abtile"><span class="abchip">ROLL / MANUAL</span></button>
      </div>
    </div>
    <div class="abrows">{''.join(row_full(k, l) for k, l in ABILS)}</div>
    <p class="note" style="margin:10px 0 0">Every number above is a <b>stack</b>: what you
    started with, plus what each source added and the level it arrived at. Adding backgrounds,
    a species bonus or an item later means adding a contributor — nothing here changes.</p>
  </div>
  <div class="prepnav"><button class="btn">Close</button><span class="prepnav-sp"></span>
    <button class="btn on">Done</button></div>
</div></div>"""

# ── the ASI slot, two ways ────────────────────────────────────────────────────
SLOT_1 = """<div class="card"><h2>Level 8 · Feat / ASI</h2><div class="body">
  <div class="fieldset">
    <div class="fldrow"><button class="picksel"><span class="lbl-ico">Fey Touched</span><span class="pk-caret">⌄</span></button><span class="cnt done">1/1</span></div>
    <p class="note" style="margin:8px 0 0">One control. The picker's first two entries are
    <b>+2 to one ability</b> and <b>+1 to two abilities</b>, sitting above the feats — an ASI
    is just what you can take in this slot, and the slot reads as filled either way.</p>
  </div>
  <div class="fieldset"><label class="fld">The picker, opened</label>
    <div class="prepick">
      <div class="prow on"><b>+2 to one ability</b><span class="sub">Ability Score Improvement</span></div>
      <div class="prow"><b>+1 to two abilities</b><span class="sub">Ability Score Improvement</span></div>
      <div class="psep"></div>
      <div class="prow"><b>Fey Touched</b><span class="sub">INT 13+ · +1 INT · 2 spells</span></div>
      <div class="prow"><b>War Caster</b><span class="sub">CON 13+</span></div>
    </div>
  </div>
</div></div>"""

SLOT_2 = """<div class="card"><h2>Level 8 · Feat / ASI</h2><div class="body">
  <div class="fieldset">
    <div class="fldrow"><button class="picksel ph"><span class="lbl-ico">choose a feat…</span><span class="pk-caret">⌄</span></button><span class="cnt need">0/1</span></div>
    <div class="fldrow" style="margin-top:7px">
      <div class="abtiles" style="justify-content:flex-start;flex:1">
        <button class="abtile str"><span class="abchip str">STR</span></button>
        <button class="abtile dex"><span class="abchip dex">DEX</span></button>
        <button class="abtile con"><span class="abchip con">CON</span></button>
        <button class="abtile int on"><span class="abchip int">INT</span></button>
        <button class="abtile wis"><span class="abchip wis">WIS</span></button>
        <button class="abtile cha"><span class="abchip cha">CHA</span></button>
      </div><span class="cnt done">+2</span></div>
    <p class="note" style="margin:8px 0 0">Two controls, one slot: pick a feat <b>or</b> spend
    the ASI on the tiles. Taking one greys the other, and the slot's counter reads from
    whichever answered it.</p>
  </div>
</div></div>"""

PAGE = f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ability scores — round 2</title>
<link rel="stylesheet" href="../../src/styles.css">
<style>
  body{{padding:20px;max-width:1320px;margin:0 auto;background:var(--bg)}}
  .mkhead{{display:flex;align-items:center;gap:14px;margin-bottom:6px}}
  .mkhead h1{{font-size:19px}} .mkhead button{{margin-left:auto}}
  p.mk{{color:var(--muted);font-size:13px;max-width:88ch;margin:0 0 16px}}
  .mkcolh{{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
    color:var(--muted);padding-bottom:4px;margin:18px 0 8px;border-bottom:1px solid var(--line)}}
  .mktrio{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}}
  .mkduo{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}}
  @media (max-width:1100px){{.mktrio,.mkduo{{grid-template-columns:1fr;max-width:620px}}}}
  .modal.mkstage{{position:static;display:block;padding:0;background:none;inset:auto;z-index:auto}}
  .modal.mkstage .box{{margin:0}}
  /* ── the parts that do not exist yet ─────────────────────────────────────── */
  /* A: six tiles, the .stat component already on the Slots card */
  .abgrid{{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}}
  .abstat .k{{margin-bottom:2px}}
  /* B/C: a row per ability — chip, score, modifier, and where it came from */
  .abrows{{display:flex;flex-direction:column;gap:3px}}
  .abrow{{display:grid;grid-template-columns:auto 34px 30px minmax(0,1fr);align-items:center;
    gap:9px;padding:5px 7px;border-radius:8px}}
  .abrow:hover{{background:var(--panel-2)}}
  .abscore{{font-family:var(--font);font-size:19px;font-weight:600;text-align:right}}
  .abmod{{font-size:12.5px;color:var(--muted);text-align:right}}
  .abstack{{min-width:0;font-size:11px;color:var(--muted);overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap}}
  .abfrom{{opacity:.9}}
  /* C: the closed strip */
  .abstrip{{padding:6px 10px}}
  .abministrip{{display:flex;gap:9px;flex:1;min-width:0;flex-wrap:wrap}}
  .abmini{{display:inline-flex;align-items:baseline;gap:3px;font-size:12px}}
  .abmini b{{font-family:var(--font);font-size:13.5px}}
  .abmini small{{color:var(--muted);font-size:10.5px}}
  /* the picker rows in the ASI mock */
  .prepick{{border:1px solid var(--line-strong);border-radius:10px;overflow:hidden}}
  .prow{{display:flex;align-items:baseline;gap:9px;padding:7px 10px;font-size:13px}}
  .prow .sub{{color:var(--muted);font-size:11.5px;margin-left:auto}}
  .prow.on{{background:var(--accent-soft)}}
  .psep{{height:1px;background:var(--line)}}
</style>
</head>
<body>
<div class="mkhead"><h1>Ability scores — where the section lives, and how a score is built</h1>
  <button id="th" class="btn" type="button">flip theme</button></div>
<p class="mk">Worked example throughout: <b>Wizard 12 / Fighter 1</b>, standard array, a
background giving +2 INT / +1 CON, an ASI at 4 (+2 INT), Fey Touched at 8 (+1 INT), an ASI at
12 (+1 INT / +1 WIS) — so INT 15 → 20, and the spell save DC is 17. Every number is the sum of
CONTRIBUTIONS, each knowing who gave it and at which level; that is what makes a level-8
preview read INT 19 and lets a background, a species bonus or a Manual of Bodily Health be
added later without touching any of this.</p>

<div class="mkcolh">Where the section lives</div>
<div class="mktrio">
  <div><div class="mkcolh" style="margin-top:0;border:none">A · inside the Character card</div>{CARD_A}</div>
  <div><div class="mkcolh" style="margin-top:0;border:none">B · its own card</div>{CARD_B}</div>
  <div><div class="mkcolh" style="margin-top:0;border:none">C · one line, editor behind it</div>{CARD_C}
    <div style="margin-top:14px">{MODAL_C}</div></div>
</div>

<div class="mkcolh">The ASI slot — a feat slot and an ASI are the SAME slot (D114)</div>
<div class="mkduo">
  <div><div class="mkcolh" style="margin-top:0;border:none">1 · the ASI is an entry in the feat picker</div>{SLOT_1}</div>
  <div><div class="mkcolh" style="margin-top:0;border:none">2 · two controls, whichever answers first</div>{SLOT_2}</div>
</div>

<script>
document.getElementById("th").onclick=()=>{{const r=document.documentElement;
  r.setAttribute("data-theme",r.getAttribute("data-theme")==="dark"?"light":"dark");}};
</script>
</body></html>
"""
out = os.path.join(os.path.dirname(__file__), "mockups", "abil.html")
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, "w", encoding="utf-8").write(PAGE)
print("wrote", out, len(PAGE) // 1024, "KB")
