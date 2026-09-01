#!/usr/bin/env python3
"""Ability scores — round 3 mockups, against the REAL stylesheet.

Francesco's five notes on the shipped v1.5.12 editor:
  1 rolled values must appear in the dropdowns  2 a value already taken stays selectable but
  is MARKED, and a duplicate is flagged rather than prevented  3 nothing starts pre-filled
  4 the score is stated twice — try TILES, two rows of three, instead of six vertical rows
  5 the background bonus deserves something more elegant than three selects.
Three panel layouts (A1–A3), three background treatments (B1–B3), and the duplicate state (C).
Everything reuses live components: .card/.body/.fld/.fldnote, .abchip, .abtile/.abtiles,
.btn, .note, .prepnav. Mockup-only classes are prefixed mk-.
Regenerate: python3 scratchpad/mkabil2.py
"""
import os

# a worked Wizard 12: standard array, background +2 INT / +1 CON, ASI at 4 (+2 INT)
ABILS = [("str", 8, 8, ""), ("dex", 14, 14, ""), ("con", 13, 14, "+1 origin"),
         ("int", 15, 19, "+2 origin · +2 ASI · L4"), ("wis", 12, 12, ""), ("cha", 10, 10, "")]
POOL = [15, 14, 13, 12, 10, 8]
MOD = lambda v: ("+" if (v - 10) // 2 >= 0 else "−") + str(abs((v - 10) // 2))


def sel(base, marks=(), placeholder=False):
    """A closed select showing the pool. `marks` are values already spent elsewhere."""
    label = "—" if placeholder else str(base)
    return (f'<span class="mk-sel{" mk-empty" if placeholder else ""}">{label}'
            f'<span class="pk-caret">⌄</span></span>')


# ── A1 · two rows of three tiles, the base edited in the tile ────────────────
def a1_tile(k, base, total, stack, empty=False):
    return (f'<div class="mk-t1 {k}">'
            f'<div class="mk-t1h"><span class="abchip {k}">{k.upper()}</span>{sel(base, placeholder=empty)}</div>'
            f'<div class="mk-t1v">{"—" if empty else total}<small>{"" if empty else MOD(total)}</small></div>'
            f'<div class="mk-t1s">{stack or ("nothing yet" if empty else "array")}</div></div>')


A1 = ('<div class="mk-g3">'
      + "".join(a1_tile(k, b, t, s) for k, b, t, s in ABILS[:4])
      + a1_tile("wis", 12, 12, "", empty=True)
      + a1_tile(*ABILS[5]) + '</div>')

# ── A2 · one compact row of six ──────────────────────────────────────────────
def a2_tile(k, base, total, stack, empty=False):
    return (f'<div class="mk-t2 {k}" title="{stack}">'
            f'<span class="abchip {k}">{k.upper()}</span>'
            f'<b>{"—" if empty else total}</b>'
            f'<small>{"" if empty else MOD(total)}</small>'
            f'{sel(base, placeholder=empty)}</div>')


A2 = ('<div class="mk-g6">'
      + "".join(a2_tile(k, b, t, s) for k, b, t, s in ABILS[:4])
      + a2_tile("wis", 12, 12, "", empty=True)
      + a2_tile(*ABILS[5]) + '</div>')

# ── A3 · a pool you assign by clicking ───────────────────────────────────────
def a3_tile(k, total, stack, empty=False, armed=False):
    return (f'<div class="mk-t3 {k}{" mk-open" if empty else ""}{" mk-armed" if armed else ""}">'
            f'<span class="abchip {k}">{k.upper()}</span>'
            f'<b>{"" if empty else total}</b>'
            f'<small>{"drop here" if empty else MOD(total)}</small>'
            f'<span class="mk-t3s">{stack or ("" if empty else "array")}</span></div>')


A3 = ('<div class="mk-pool"><span class="mk-plab">still to assign</span>'
      + "".join(f'<button class="mk-pv{" on" if v==12 else ""}">{v}</button>' for v in [12, 10])
      + "".join(f'<button class="mk-pv mk-spent">{v}</button>' for v in [15, 14, 13, 8])
      + '</div><div class="mk-g3">'
      + "".join(a3_tile(k, t, s) for k, b, t, s in ABILS[:4])
      + a3_tile("wis", 0, "", empty=True, armed=True)
      + a3_tile("cha", 10, "") + '</div>')

# ── B · the background bonus ─────────────────────────────────────────────────
B1 = ('<label class="fld">Origin <span class="fldnote">your background — three points, '
      '+2/+1 or +1/+1/+1</span></label>'
      '<div class="abtiles" style="justify-content:flex-start">'
      + "".join(f'<button class="abtile {k}{" on" if k in ("int","con") else ""}">'
                f'<span class="abchip {k}">{k.upper()}'
                + (" +2" if k == "int" else " +1" if k == "con" else "") + '</span></button>'
                for k, _, _, _ in ABILS)
      + '</div><p class="note" style="margin:6px 0 0">+2 INT · +1 CON — one point left</p>')

B2 = ('<label class="fld">Origin <span class="fldnote">your background\'s bonus</span></label>'
      '<div class="mk-b2">'
      '<div class="mk-b2r"><span class="mk-b2a">+2</span>'
      '<div class="abtiles" style="justify-content:flex-start">'
      + "".join(f'<button class="abtile {k}{" on" if k=="int" else ""}"><span class="abchip {k}">{k.upper()}</span></button>'
                for k, _, _, _ in ABILS) + '</div></div>'
      '<div class="mk-b2r"><span class="mk-b2a">+1</span>'
      '<div class="abtiles" style="justify-content:flex-start">'
      + "".join(f'<button class="abtile {k}{" on" if k=="con" else ""}"><span class="abchip {k}">{k.upper()}</span></button>'
                for k, _, _, _ in ABILS) + '</div></div></div>')

B3 = ('<label class="fld">Origin <span class="fldnote">tap a tile to place the bonus</span></label>'
      '<div class="prepnav" style="border:none;padding:0 0 8px;gap:6px">'
      '<button class="btn on">+2</button><button class="btn">+1</button>'
      '<span class="prepnav-sp"></span><span class="note" style="margin:0">1 point left</span></div>'
      '<div class="mk-g3">'
      + "".join(f'<div class="mk-t1 {k}{" mk-badged" if k in ("int","con") else ""}">'
                f'<div class="mk-t1h"><span class="abchip {k}">{k.upper()}</span>'
                + (f'<span class="mk-badge">+2</span>' if k == "int"
                   else f'<span class="mk-badge">+1</span>' if k == "con" else sel(b))
                + f'</div><div class="mk-t1v">{t}<small>{MOD(t)}</small></div>'
                f'<div class="mk-t1s">{s or "array"}</div></div>'
                for k, b, t, s in ABILS[:3])
      + '</div>')

# ── C · a value taken twice is MARKED and FLAGGED, never blocked ─────────────
C = ('<div class="mk-g3">'
     + a1_tile("str", 8, 8, "array")
     + '<div class="mk-t1 dex mk-dupe"><div class="mk-t1h"><span class="abchip dex">DEX</span>'
     + '<span class="mk-sel mk-dupesel">14<span class="pk-caret">⌄</span></span></div>'
     + '<div class="mk-t1v">14<small>+2</small></div><div class="mk-t1s">array</div></div>'
     + '<div class="mk-t1 con mk-dupe"><div class="mk-t1h"><span class="abchip con">CON</span>'
     + '<span class="mk-sel mk-dupesel">14<span class="pk-caret">⌄</span></span></div>'
     + '<div class="mk-t1v">15<small>+2</small></div><div class="mk-t1s">+1 origin</div></div>'
     + '</div>'
     '<p class="note mk-warn">DEX and CON both took <b>14</b> — the standard array has one. '
     'Nothing is stopped; 13 is still unassigned.</p>'
     '<div class="mk-openlist"><div class="mk-olh">the list, opened</div>'
     '<div class="mk-ol"><span>15</span><i>DEX</i></div>'
     '<div class="mk-ol mk-olon"><span>14</span><i>CON</i></div>'
     '<div class="mk-ol"><span>13</span><i>free</i></div>'
     '<div class="mk-ol"><span>12</span><i>WIS</i></div>'
     '<div class="mk-ol"><span>10</span><i>CHA</i></div>'
     '<div class="mk-ol"><span>8</span><i>STR</i></div></div>')

ROLL = ('<div class="prepnav" style="border:none;padding:0 0 8px">'
        '<span class="mk-rolled">16 · 13 · 13 · 12 · 12 · 11</span>'
        '<span class="prepnav-sp"></span><button class="btn">Roll again</button></div>'
        '<div class="mk-openlist"><div class="mk-olh">the list, opened — every roll, duplicates and all</div>'
        '<div class="mk-ol"><span>16</span><i>free</i></div>'
        '<div class="mk-ol"><span>13</span><i>free</i></div>'
        '<div class="mk-ol"><span>13</span><i>INT</i></div>'
        '<div class="mk-ol"><span>12</span><i>free</i></div>'
        '<div class="mk-ol"><span>12</span><i>free</i></div>'
        '<div class="mk-ol"><span>11</span><i>CON</i></div></div>'
        '<p class="note" style="margin:8px 0 0">Today the list de-duplicates, so a pair of 13s '
        'offers one. Every rolled value is its own entry.</p>')


def card(title, body, sub=""):
    return (f'<div class="modal mk-stage"><div class="box narrow">'
            f'<div class="mh"><h2>{title}</h2><button class="x">×</button></div>'
            f'<div class="mb">{sub}{body}</div>'
            f'<div class="prepnav"><button class="btn danger">Clear</button>'
            f'<span class="prepnav-sp"></span><button class="btn on">Done</button></div>'
            f'</div></div>')


METHODS = ('<div class="prepnav" style="border:none;padding:0 0 10px">'
           '<div class="abtiles" style="justify-content:flex-start">'
           '<button class="abtile on"><span class="abchip">STANDARD ARRAY</span></button>'
           '<button class="abtile"><span class="abchip">POINT BUY</span></button>'
           '<button class="abtile"><span class="abchip">TYPED</span></button>'
           '<button class="abtile"><span class="abchip">ROLLED</span></button></div></div>')

PAGE = f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ability scores — round 3</title>
<link rel="stylesheet" href="../../src/styles.css">
<style>
  body{{padding:20px;max-width:1400px;margin:0 auto;background:var(--bg)}}
  .mkhead{{display:flex;align-items:center;gap:14px;margin-bottom:6px}}
  .mkhead h1{{font-size:19px}} .mkhead button{{margin-left:auto}}
  p.mk{{color:var(--muted);font-size:13px;max-width:92ch;margin:0 0 14px}}
  .mkcolh{{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
    color:var(--muted);padding-bottom:4px;margin:20px 0 8px;border-bottom:1px solid var(--line)}}
  .mkrow{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;align-items:start}}
  @media (max-width:1180px){{.mkrow{{grid-template-columns:1fr;max-width:520px}}}}
  .modal.mk-stage{{position:static;display:block;padding:0;background:none;inset:auto;z-index:auto}}
  .modal.mk-stage .box{{margin:0}}
  /* A1 — a tile per ability, two rows of three */
  .mk-g3{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}}
  .mk-t1{{border:1px solid var(--line-strong);border-radius:10px;padding:8px 9px;background:var(--panel-2)}}
  .mk-t1h{{display:flex;align-items:center;gap:6px;justify-content:space-between}}
  .mk-t1v{{font-family:var(--font);font-size:26px;font-weight:600;line-height:1.1;margin-top:4px;
    display:flex;align-items:baseline;gap:5px}}
  .mk-t1v small{{font-size:12px;color:var(--muted);font-family:var(--sans)}}
  .mk-t1s{{font-size:10.5px;color:var(--muted);margin-top:2px;overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap}}
  .mk-sel{{display:inline-flex;align-items:center;gap:3px;font-size:12px;padding:2px 5px;
    border:1px solid var(--line-strong);border-radius:7px;background:var(--bg);cursor:pointer}}
  .mk-sel .pk-caret{{position:relative;width:9px;height:9px;font-size:0}}
  .mk-sel .pk-caret::before{{content:"";position:absolute;left:50%;top:40%;width:4px;height:4px;
    border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);
    transform:translate(-50%,-50%) rotate(45deg)}}
  .mk-empty{{color:var(--muted);border-style:dashed}}
  /* A2 — six across, compact */
  .mk-g6{{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}}
  .mk-t2{{border:1px solid var(--line-strong);border-radius:9px;padding:7px 5px;text-align:center;
    background:var(--panel-2);display:flex;flex-direction:column;align-items:center;gap:2px}}
  .mk-t2 b{{font-family:var(--font);font-size:20px;font-weight:600;line-height:1}}
  .mk-t2 small{{font-size:10.5px;color:var(--muted)}}
  .mk-t2 .mk-sel{{margin-top:2px;font-size:11px;padding:1px 4px}}
  /* A3 — assign from a pool */
  .mk-pool{{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:10px}}
  .mk-plab{{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);
    font-weight:700;margin-right:2px}}
  .mk-pv{{font:inherit;font-family:var(--font);font-size:15px;font-weight:600;width:34px;height:30px;
    border:1px solid var(--line-strong);border-radius:8px;background:var(--panel);color:var(--ink);cursor:pointer}}
  .mk-pv.on{{border-color:var(--accent);background:var(--accent-soft);color:var(--accent)}}
  .mk-pv.mk-spent{{opacity:.35;text-decoration:line-through}}
  .mk-t3{{border:1px solid var(--line-strong);border-radius:10px;padding:8px 9px;background:var(--panel-2);
    display:flex;flex-direction:column;gap:1px;min-height:74px}}
  .mk-t3 b{{font-family:var(--font);font-size:24px;font-weight:600;line-height:1.15}}
  .mk-t3 small{{font-size:11px;color:var(--muted)}}
  .mk-t3s{{font-size:10.5px;color:var(--muted)}}
  .mk-t3.mk-open{{border-style:dashed;background:none}}
  .mk-t3.mk-armed{{border-color:var(--accent);background:var(--accent-soft)}}
  /* B2 — a row per amount */
  .mk-b2{{display:flex;flex-direction:column;gap:7px}}
  .mk-b2r{{display:flex;align-items:center;gap:9px}}
  .mk-b2a{{font-family:var(--font);font-size:15px;font-weight:600;color:var(--muted);width:22px}}
  /* B3 — a badge placed on the tile */
  .mk-badge{{font-size:11px;font-weight:700;color:var(--accent);background:var(--accent-soft);
    border-radius:7px;padding:1px 6px}}
  .mk-badged{{border-color:var(--accent)}}
  /* C — the duplicate state */
  .mk-dupe{{border-color:var(--gold)}}
  .mk-dupesel{{border-color:var(--gold);color:var(--gold)}}
  .mk-warn{{margin:10px 0 0;color:var(--gold)}}
  .mk-openlist{{margin-top:10px;border:1px solid var(--line-strong);border-radius:10px;overflow:hidden}}
  .mk-olh{{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);
    font-weight:700;padding:6px 10px;background:var(--panel-2)}}
  .mk-ol{{display:flex;align-items:baseline;gap:10px;padding:5px 10px;font-size:13px;
    border-top:1px solid var(--line)}}
  .mk-ol span{{font-family:var(--font);font-size:15px;font-weight:600;width:26px}}
  .mk-ol i{{font-style:normal;font-size:11px;color:var(--muted);margin-left:auto}}
  .mk-olon{{background:var(--accent-soft)}}
  .mk-rolled{{font-family:var(--font);font-size:15px;letter-spacing:.02em}}
</style>
</head>
<body>
<div class="mkhead"><h1>Ability scores — the five notes, mocked</h1>
  <button id="th" class="btn" type="button">flip theme</button></div>
<p class="mk">Same worked character throughout: <b>Wizard 12</b>, standard array, a background
giving +2 INT / +1 CON, an ASI at 4. The panel is the real modal at its real width (440px), so
what fits here fits there. <b>Notes 1–3 are behaviour</b> and are shown as states at the bottom;
<b>note 4</b> is the three panel layouts; <b>note 5</b> is the three origin treatments.</p>

<div class="mkcolh">Note 4 · the score is stated twice — tiles instead of rows</div>
<div class="mkrow">
  <div><div class="mkcolh" style="margin-top:0;border:none">A1 · two rows of three, base edited in the tile</div>
    {card("Ability scores", METHODS + A1)}
    <p class="mk" style="margin-top:10px">The big number is the TOTAL; the small control is the
    BASE, and they differ only when something was added. WIS shows the empty state.</p></div>
  <div><div class="mkcolh" style="margin-top:0;border:none">A2 · one row of six, compact</div>
    {card("Ability scores", METHODS + A2)}
    <p class="mk" style="margin-top:10px">Everything on one line, the stack in the tooltip. Fits
    the modal at 440px; at 375 it wraps to two rows of three by itself.</p></div>
  <div><div class="mkcolh" style="margin-top:0;border:none">A3 · assign from a pool, no dropdowns</div>
    {card("Ability scores", METHODS + A3)}
    <p class="mk" style="margin-top:10px">Pick a value, then tap an ability — the way you assign an
    array on paper. Spent values are struck through; tapping an assigned tile puts its value back.
    Point buy and typed keep a stepper and a field.</p></div>
</div>

<div class="mkcolh">Note 5 · a more elegant origin bonus</div>
<div class="mkrow">
  <div><div class="mkcolh" style="margin-top:0;border:none">B1 · three points, one tile row</div>
    {card("Ability scores", B1)}
    <p class="mk" style="margin-top:10px">The SAME control as an ASI, one point wider: tap to spend,
    tap again for +2, again to take it back. +2/+1 and +1/+1/+1 both fall out of it — no mode to
    choose, and one interaction to learn for both.</p></div>
  <div><div class="mkcolh" style="margin-top:0;border:none">B2 · a row per amount</div>
    {card("Ability scores", B2)}
    <p class="mk" style="margin-top:10px">Explicit: the +2 row and the +1 row, each a tile row.
    Reads instantly, but it is two controls and needs a third row for +1/+1/+1.</p></div>
  <div><div class="mkcolh" style="margin-top:0;border:none">B3 · placed onto the score tiles</div>
    {card("Ability scores", B3)}
    <p class="mk" style="margin-top:10px">Arm +2, tap the ability it goes on; the badge sits where
    the score is, so the bonus is read where it lands. No separate origin block at all.</p></div>
</div>

<div class="mkcolh">Notes 1–3 · what the lists do</div>
<div class="mkrow">
  <div><div class="mkcolh" style="margin-top:0;border:none">C · a value taken twice is marked, and flagged</div>
    {card("Ability scores", C)}
    <p class="mk" style="margin-top:10px">Every pool value stays in the list, each naming who has
    it. Taking one twice is allowed and <b>said out loud</b> — the app's standing rule for a rule
    it can check (D31): named, never blocked.</p></div>
  <div><div class="mkcolh" style="margin-top:0;border:none">Rolled · every roll is its own entry</div>
    {card("Ability scores", ROLL)}</div>
  <div><div class="mkcolh" style="margin-top:0;border:none">Nothing starts pre-filled</div>
    <div class="modal mk-stage"><div class="box narrow"><div class="mh"><h2>Ability scores</h2>
      <button class="x">×</button></div><div class="mb">
      <div class="prepnav" style="border:none;padding:0 0 10px"><div class="abtiles" style="justify-content:flex-start">
      <button class="abtile"><span class="abchip">STANDARD ARRAY</span></button>
      <button class="abtile on"><span class="abchip">POINT BUY</span></button>
      <button class="abtile"><span class="abchip">TYPED</span></button>
      <button class="abtile"><span class="abchip">ROLLED</span></button></div></div>
      <div class="mk-g3">
      {"".join(f'<div class="mk-t1 {k}"><div class="mk-t1h"><span class="abchip {k}">{k.upper()}</span>'
               f'<span class="mk-sel mk-empty">—<span class="pk-caret">⌄</span></span></div>'
               f'<div class="mk-t1v">—</div><div class="mk-t1s">nothing yet</div></div>'
               for k, _, _, _ in ABILS)}
      </div><p class="note" style="margin:10px 0 0">27 points to spend</p>
      </div><div class="prepnav"><button class="btn danger">Clear</button>
      <span class="prepnav-sp"></span><button class="btn on">Done</button></div></div></div>
    <p class="mk" style="margin-top:10px">Point buy opened with six 8s, which reads as an answer
    nobody gave. Empty until you say otherwise, in every method — the budget counts from 0.</p></div>
</div>

<script>
document.getElementById("th").onclick=()=>{{const r=document.documentElement;
  r.setAttribute("data-theme",r.getAttribute("data-theme")==="dark"?"light":"dark");}};
</script>
</body></html>
"""
out = os.path.join(os.path.dirname(__file__), "mockups", "abil2.html")
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, "w", encoding="utf-8").write(PAGE)
print("wrote", out, len(PAGE) // 1024, "KB")
