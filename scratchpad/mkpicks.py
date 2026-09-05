#!/usr/bin/env python3
"""Two shapes for the picked-spell chips on Prepared budget & picks (his note, D178(g)).

Writes scratchpad/mockups/picks.html — one SELF-CONTAINED page, the real stylesheet inlined:
the same Wizard 4 card (3 cantrips, 4 free + 36 copied 2nd-level spells) drawn twice per
option, once at rest and once opened, so the height each one costs is visible side by side.

  1 · Fold per class — the run collapses behind a one-line summary with a disclosure.
  2 · Group by level — the chips sit under folded level headers, the eligible list's pattern.
"""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scratchpad", "mockups")
APP_CSS = open(os.path.join(ROOT, "src", "styles.css"), encoding="utf-8").read()
assert "</style" not in APP_CSS.lower()

data = json.load(open(os.path.join(ROOT, "data", "data.json"), encoding="utf-8"))
wiz = [s for s in data["spells"] if s.get("source") == "XPHB"]
def names(level, n):
    out = sorted({s["name"] for s in wiz if s.get("level") == level})
    return out[:n]
CANTRIPS = names(0, 3) or ["Fire Bolt", "Mage Hand", "Prestidigitation"]
SECOND = names(2, 40)
if len(SECOND) < 40:
    SECOND = (SECOND + [f"Spell {i}" for i in range(40)])[:40]

def chip(name, lv):
    return f'<span class="cartchip"><span class="lv">{lv}</span><span>{name}</span><button class="ico xsm" aria-label="Remove">×</button></span>'

def chips(items, lv):
    return '<div class="cartchips">' + "".join(chip(n, lv) for n in items) + "</div>"

def meter(label, n, of):
    pct = 0 if not of else min(100, round(100 * n / of))
    return (f'<div class="meter"><span class="ml">{label}</span><span class="bar"><span class="fill" style="width:{pct}%"></span></span>'
            f'<span class="mn">{n} / {of}</span></div>')

def head():
    return ('<div class="bh"><div class="nm">Wizard <small>· L4</small></div><span class="kind wiz">spellbook</span></div>'
            + meter("Cantrips", 3, 4) + meter("Spellbook", 4, 12) + meter("Prepared", 0, 7)
            + '<div class="note" style="margin:2px 0 0">Fixed growth, no retraining. <b style="color:var(--accent)">+36 copied in</b>.</div>'
            + '<div class="dist"><div class="dcell top copied"><b>4<span class="dcap">/4</span><i class="dcopy">+36</i></b><small>2nd · max</small></div>'
            + '<div class="dcell"><b>0<span class="dcap">/8</span></b><small>1st</small></div></div>')

# ── 1 · fold per class ────────────────────────────────────────────────────────
def fold(open_):
    summary = (f'<button class="mk-fold{" open" if open_ else ""}" aria-expanded="{str(open_).lower()}">'
               f'<span class="lvlcar{" up" if open_ else ""}"></span><span class="mk-fsum">43 picked</span>'
               f'<span class="mk-fsub">3 cantrips · 4 free · 36 copied</span></button>')
    body = (chips(CANTRIPS, "C") + chips(SECOND, "2")) if open_ else ""
    return f'<div class="budget">{head()}{summary}{body}</div>'

# ── 2 · group by level ────────────────────────────────────────────────────────
def grouped(open_lv):
    def grp(label, items, lv, n, opened):
        h = (f'<button class="mk-lg{" open" if opened else ""}" aria-expanded="{str(opened).lower()}">'
             f'<span class="lvlcar{" up" if opened else ""}"></span><span>{label}</span><span class="mk-lgn">{n}</span></button>')
        return h + (chips(items, lv) if opened else "")
    body = (grp("Cantrips", CANTRIPS, "C", "3", open_lv == 0)
            + grp("1st level", [], "1", "0 · 8 free", False)
            + grp("2nd level", SECOND, "2", "40 · 4 free + 36 copied", open_lv == 2))
    return f'<div class="budget">{head()}<div class="mk-lgs">{body}</div></div>'

CSS = """
.mk-grid{display:flex;flex-wrap:wrap;gap:26px 30px;align-items:flex-start}
.mk-col{width:660px}
.mk-col h2{font:600 13px/1.3 var(--sans);margin:0 0 6px}
.mk-col p{font-size:12px;color:var(--muted);margin:0 0 10px;min-height:4em}
.mk-pair{display:flex;gap:14px;align-items:flex-start}
.mk-pair>div{flex:1;min-width:0}
.mk-cap{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-weight:700;margin:0 0 4px}
.card{box-sizing:border-box}
/* 1 · the fold */
.mk-fold{display:flex;align-items:center;gap:8px;width:100%;margin-top:8px;padding:6px 8px;font:inherit;font-size:12px;
  color:inherit;background:var(--panel-2);border:1px solid var(--line);border-radius:8px;cursor:pointer;text-align:left}
.mk-fold .lvlcar{flex:0 0 auto;position:relative;width:12px;height:12px;font-size:0}
.mk-fold .lvlcar::before,.mk-lg .lvlcar::before{content:"";position:absolute;left:50%;top:50%;width:5px;height:5px;border-right:1.5px solid var(--muted);border-bottom:1.5px solid var(--muted);transform:translate(-50%,-50%) translateY(-1px) rotate(45deg)}
.mk-fold .lvlcar.up::before,.mk-lg .lvlcar.up::before{transform:translate(-50%,-50%) translateY(1px) rotate(-135deg)}
.mk-fsum{font-weight:600;white-space:nowrap}
.mk-fsub{color:var(--muted);margin-left:auto;white-space:nowrap}
.mk-fold+.cartchips{margin-top:8px}
/* 2 · level groups */
.mk-lgs{margin-top:8px;display:flex;flex-direction:column;gap:4px}
.mk-lg{display:flex;align-items:center;gap:8px;width:100%;white-space:nowrap;padding:5px 6px;font:inherit;font-size:11.5px;font-weight:600;
  color:var(--muted);background:none;border:none;border-top:1px solid var(--line);cursor:pointer;text-align:left;letter-spacing:.02em;text-transform:uppercase}
.mk-lg .lvlcar{flex:0 0 auto;position:relative;width:12px;height:12px;font-size:0}
.mk-lgn{margin-left:auto;font-weight:500;text-transform:none;letter-spacing:0;white-space:nowrap}
.mk-lg+.cartchips{margin:2px 0 6px}
"""

SHELL = """<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prepared budget &amp; picks · two shapes</title>
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
<h1>Prepared budget &amp; picks · two shapes</h1>
<p class="note">The same Wizard 4 in both: 3 cantrips, 4 free and 36 copied 2nd-level spells, 43 chips today. Each option is drawn at rest and opened, so the height it costs is beside the height it saves. Meters and tiles are unchanged; only the chip run moves.</p>
<div class="mk-grid">
<div class="mk-col"><h2>1 · Fold per class</h2><p>The run collapses behind one line: how many picked, how many free and copied, a chevron. The meters above already tell the story, so at rest the card is meters and tiles only. One click to see what you hold.</p>
<div class="mk-pair"><div><div class="mk-cap">At rest</div><div class="card"><div class="body">{f0}</div></div></div><div><div class="mk-cap">Opened</div><div class="card"><div class="body">{f1}</div></div></div></div></div>
<div class="mk-col"><h2>2 · Group by level</h2><p>The chips sit under level headers that fold, the eligible list's own pattern, each header carrying its count and the free/copied split. A big book is two or three closed rows; opening one shows only that level.</p>
<div class="mk-pair"><div><div class="mk-cap">At rest</div><div class="card"><div class="body">{g0}</div></div></div><div><div class="mk-cap">2nd opened</div><div class="card"><div class="body">{g1}</div></div></div></div></div>
</div>
<div class="mkband">picks<button class="btn tiny" id="mktheme">Light</button></div>
<script>
var r=document.documentElement,b=document.getElementById("mktheme");
b.onclick=function(){{var d=r.dataset.theme==="dark";r.dataset.theme=d?"light":"dark";b.textContent=d?"Dark":"Light";}};
</script>
</body></html>"""

os.makedirs(OUT, exist_ok=True)
html = SHELL.format(app_css=APP_CSS, css=CSS, f0=fold(False), f1=fold(True), g0=grouped(-1), g1=grouped(2))
with open(os.path.join(OUT, "picks.html"), "w", encoding="utf-8") as f:
    f.write(html)
print("wrote", os.path.join(OUT, "picks.html"), len(SECOND), "second-level names")
