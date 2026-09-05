#!/usr/bin/env python3
"""Fold the per-level chip rows together with the spell-number tiles (his note, D181).

Writes scratchpad/mockups/fold.html — the real stylesheet inlined, the same Wizard 4 as
`picks.html` (3 cantrips, 4 free + 36 copied 2nd-level, 0 at 1st with 8 free) in two shapes,
each at rest and with 2nd level opened:

  A · The tile IS the row header — the tile row is gone; each level row starts with the
      tile's numbers (held/free, the max mark, the over/copied colour) and the chips follow.
      Tapping the numbers opens the level pick as the tile did.
  B · The tile opens its row — the tile row stays; a tile is a toggle, and the one you press
      shows its level's chips under the tile row. One level open at a time.
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scratchpad", "mockups")
APP_CSS = open(os.path.join(ROOT, "src", "styles.css"), encoding="utf-8").read()
assert "</style" not in APP_CSS.lower()
data = json.load(open(os.path.join(ROOT, "data", "data.json"), encoding="utf-8"))
xphb = [s for s in data["spells"] if s.get("source") == "XPHB"]
def names(level, n): return sorted({s["name"] for s in xphb if s.get("level") == level})[:n]
CANTRIPS, SECOND = names(0, 3), names(2, 40)

def chip(name, lv):
    return f'<span class="cartchip"><span class="lv">{lv}</span><span>{name}</span><button class="ico xsm" aria-label="Remove">×</button></span>'
def row(items, lv, many):
    return f'<div class="cartchips{" mk-one" if many else ""}">' + "".join(chip(n, lv) for n in items) + "</div>"
def meter(label, n, of):
    pct = 0 if not of else min(100, round(100 * n / of))
    return (f'<div class="meter"><span class="ml">{label}</span><span class="bar"><span class="fill" style="width:{pct}%"></span></span>'
            f'<span class="mn">{n} / {of}</span></div>')
def head():
    return ('<div class="bh"><div class="nm">Wizard <small>· L4</small></div><span class="kind wiz">spellbook</span></div>'
            + meter("Cantrips", 3, 4) + meter("Spellbook", 4, 12) + meter("Prepared", 0, 7)
            + '<div class="note" style="margin:2px 0 0">Fixed growth, no retraining. <b style="color:var(--accent)">+36 copied in</b>.</div>')

LEVELS = [  # label · held · free · max? · copied? · chips · lv mark
    ("Cantrips", "3", "4", False, False, CANTRIPS, "C"),
    ("1st level", "0", "8", False, False, [], "1"),
    ("2nd level", "40", "4", True, True, SECOND, "2"),
]

# ── A · the tile is the row header ───────────────────────────────────────────
def variant_a(open_lv):
    rows = ""
    for i, (label, held, free, top, copied, chips, lv) in enumerate(LEVELS):
        opened = i == open_lv
        cls = "mk-tl" + (" top" if top else "") + (" copied" if copied else "")
        tile = f'<button class="{cls}" title="Tap to edit"><b>{held}<span class="dcap">/{free}</span></b>{"<small>max</small>" if top else ""}</button>'
        tog = (f'<button class="mk-tog{" up" if opened else ""}" aria-expanded="{str(opened).lower()}" aria-label="Show {label}"><span class="lvlcar{" up" if opened else ""}"></span></button>'
               if chips else '<span class="mk-none">none</span>')
        rows += f'<div class="mk-lrow"><span class="mk-ll">{label}</span>{tile}{tog}</div>'
        if opened and chips: rows += row(chips, lv, len(chips) > 12)
    return f'<div class="budget">{head()}<div class="mk-lrows">{rows}</div><button class="btn lbl-ico" style="margin-top:8px;font-size:12px">+ Copy a spell into your book</button></div>'

# ── B · the tile opens its row ───────────────────────────────────────────────
def variant_b(open_lv):
    tiles = ""
    for i, (label, held, free, top, copied, chips, lv) in enumerate(LEVELS):
        opened = i == open_lv
        cls = "dcell mk-dbtn" + (" top" if top else "") + (" copied" if copied else "") + (" open" if opened else "")
        small = ("C" if lv == "C" else lv + ("nd" if lv == "2" else "st")) + (" · max" if top else "")
        tiles += f'<button class="{cls}" aria-expanded="{str(opened).lower()}"><b>{held}<span class="dcap">/{free}</span></b><small>{small}</small></button>'
    body = ""
    if open_lv >= 0:
        label, held, free, top, copied, chips, lv = LEVELS[open_lv]
        inner = row(chips, lv, len(chips) > 12) if chips else '<div class="note">Nothing at this level yet.</div>'
        body = (f'<div class="mk-open"><div class="pgh"><span class="pgl">{label}</span><span class="pgn">{held}{" · " + free + " free" if copied else ""}</span>'
                f'<button class="mk-edit">Edit picks</button></div>{inner}</div>')
    return f'<div class="budget">{head()}<div class="dist mk-dist">{tiles}</div>{body}<button class="btn lbl-ico" style="margin-top:8px;font-size:12px">+ Copy a spell into your book</button></div>'

CSS = """
.mk-grid{display:flex;flex-wrap:wrap;gap:26px 30px;align-items:flex-start}
.mk-col{width:660px}
.mk-col h2{font:600 13px/1.3 var(--sans);margin:0 0 6px}
.mk-col p{font-size:12px;color:var(--muted);margin:0 0 10px;min-height:4em}
.mk-pair{display:flex;gap:14px;align-items:flex-start}
.mk-pair>div{flex:1;min-width:0}
.mk-cap{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-weight:700;margin:0 0 4px}
.card{box-sizing:border-box}
.mk-one{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;width:0;min-width:100%;box-sizing:border-box;
  -webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 34px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 34px),transparent)}
.mk-one::-webkit-scrollbar{display:none}
.mk-one .cartchip{flex:0 0 auto;white-space:nowrap}
.lvlcar{flex:0 0 auto;position:relative;width:12px;height:12px;font-size:0;display:inline-block}
.lvlcar::before{content:"";position:absolute;left:50%;top:50%;width:5px;height:5px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:translate(-50%,-50%) translateY(-1px) rotate(45deg)}
.lvlcar.up::before{transform:translate(-50%,-50%) translateY(1px) rotate(-135deg)}
/* A */
.mk-lrows{margin-top:8px;display:flex;flex-direction:column;gap:2px}
.mk-lrow{display:flex;align-items:center;gap:8px;padding:4px 0;border-top:1px solid var(--line)}
.mk-ll{font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);flex:1}
.mk-tl{font:inherit;font-size:11px;padding:2px 7px;border-radius:7px;border:1px solid var(--line-strong);background:var(--panel);color:inherit;cursor:pointer;display:inline-flex;align-items:baseline;gap:5px;min-width:40px;justify-content:center}
.mk-tl b{font-variant-numeric:tabular-nums}.mk-tl .dcap{color:var(--muted);font-size:9px;font-weight:400}
.mk-tl small{font-size:9px;color:var(--muted)}
.mk-tl.top{border-color:var(--accent)}.mk-tl.top small{color:var(--accent)}
.mk-tl.copied{border-color:var(--accent);color:var(--accent)}
.mk-tog{width:22px;height:22px;border:none;background:none;color:var(--muted);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}
.mk-none{font-size:10.5px;color:var(--muted);width:22px;text-align:center;opacity:.6}
.mk-lrow+.cartchips{margin:2px 0 6px}
/* B */
.mk-dist .mk-dbtn{font:inherit;color:inherit;cursor:pointer;position:relative}
.mk-dist .mk-dbtn.open{background:var(--accent-soft);box-shadow:0 2px 0 0 var(--accent)}
.mk-open{margin-top:8px;padding-top:6px;border-top:1px solid var(--line)}
.mk-edit{margin-left:auto;font:inherit;font-size:11px;padding:1px 8px;border-radius:9px;border:1px solid var(--line);background:none;color:var(--muted);cursor:pointer}
"""

SHELL = """<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Level tiles and level rows · two shapes</title>
<style>
{app_css}
</style>
<style>
body{{margin:0;padding:22px 26px 60px;background:var(--bg)}}
h1{{font:600 15px/1.3 var(--sans);margin:0 0 4px}}
p.note{{font-size:12px;color:var(--muted);margin:0 0 18px;max-width:90ch}}
.mkband{{position:fixed;right:10px;top:10px;z-index:9;display:flex;align-items:center;gap:8px;
  font:600 11px/1.4 var(--sans);background:var(--panel-2);border:1px solid var(--line);
  border-radius:8px;padding:6px 10px;color:var(--muted)}}
{css}
</style></head><body>
<h1>Level tiles and level rows · two shapes</h1>
<p class="note">Today the card says "2nd level" twice: once in the number tiles (40/4 · max) and once as the header of the chip row. Both shapes fold the two into one, on the same Wizard 4 (3 cantrips, 0 at 1st with 8 free, 40 at 2nd with 4 free), drawn at rest and with 2nd level open.</p>
<div class="mk-grid">
<div class="mk-col"><h2>A · The tile is the row header</h2><p>The tile row goes. Every level is one row: its name, the tile's numbers (held/free, the max mark, the copied colour — tap them to edit picks as before), and a chevron that shows the chips under it. A level with nothing says so and has no chevron. Every level is always listed, so the shape is the same for a Bard and a Wizard.</p>
<div class="mk-pair"><div><div class="mk-cap">At rest</div><div class="card"><div class="body">{a0}</div></div></div><div><div class="mk-cap">2nd open</div><div class="card"><div class="body">{a1}</div></div></div></div></div>
<div class="mk-col"><h2>B · The tile opens its row</h2><p>The tile row stays exactly as it is, and each tile becomes a toggle: press one and that level's chips appear under the row, one level at a time, with "Edit picks" taking the tile's old tap. The card is meters and tiles at rest; opening a level costs one row.</p>
<div class="mk-pair"><div><div class="mk-cap">At rest</div><div class="card"><div class="body">{b0}</div></div></div><div><div class="mk-cap">2nd open</div><div class="card"><div class="body">{b1}</div></div></div></div></div>
</div>
<div class="mkband">fold<button class="btn tiny" id="mktheme">Light</button></div>
<script>
var r=document.documentElement,b=document.getElementById("mktheme");
b.onclick=function(){{var d=r.dataset.theme==="dark";r.dataset.theme=d?"light":"dark";b.textContent=d?"Dark":"Light";}};
</script>
</body></html>"""

os.makedirs(OUT, exist_ok=True)
html = SHELL.format(app_css=APP_CSS, css=CSS, a0=variant_a(-1), a1=variant_a(2), b0=variant_b(-1), b1=variant_b(2))
with open(os.path.join(OUT, "fold.html"), "w", encoding="utf-8") as f:
    f.write(html)
print("wrote", os.path.join(OUT, "fold.html"))
