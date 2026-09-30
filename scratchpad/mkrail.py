#!/usr/bin/env python3
"""Rail selection mockup (his note, 2026-10-01): two `.gcstep.cur` rows of one step each
draw their own accent frame and the frames nearly touch. Renders the real rail markup
under the app's stylesheet in three variants, dark and light, single- and multi-section.
Writes scratchpad/mockups/rail1.html."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
WARN = '<span class="gcs"><span class="ico"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.4 14.6 13.4H1.4z"/><path d="M8 6.6v3"/><circle cx="8" cy="11.4" r=".2"/></svg></span></span>'
OK = '<span class="gcs"><span class="ico"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.6 6.4 12 13 4.6"/></svg></span></span>'
def row(l, v, cls, cur):
    return (f'<button class="gcstep {cls}{" cur" if cur else ""}"><span class="gck"><span class="gcl">{l}</span>'
            f'<span class="gcv">{v}</span></span>{OK if cls=="done" else WARN}</button>')
def card(multi):
    rows = [row("Class", "Wizard 3", "done", False),
            row("Wizard subclass", "Diviner", "done", False)]
    if multi:
        rows += [row("A Divination Wizard spell up to level 2", "Augury", "done", True),
                 row("A Divination Wizard spell up to level 2", "skipped, still open", "skipped", True)]
    else:
        rows += [row("Spellbook spells", "1 of 2 chosen", "skipped", True)]
    rows += [row("Cantrips", "0 of 1 chosen", "skipped", False)]
    return ('<div class="locard gclv"><div class="lobody"><div class="lotop"><span class="lolv">L2</span>'
            '<b class="locls">Wizard 2</b><span class="lvlcar"></span></div></div></div>'
            '<div class="locard gclv gcopen"><div class="lobody"><div class="lotop"><span class="lolv">L3</span>'
            '<b class="locls">Wizard 3</b><span class="lvlcar up"></span></div>'
            f'<div class="gcsteps">{"".join(rows)}</div></div></div>'
            '<div class="locard gclv gcnext"><div class="lobody"><div class="lotop"><span class="lolv">L4</span>'
            '<b class="locls">next level</b><span class="lvlcar"></span></div></div></div>')
VARIANTS = [
    ("now", "Today", "Each selected row draws its own accent frame, with 1px between them.", ""),
    ("a", "A · One shared frame",
     "Consecutive selected rows merge into one frame: the inner edges and the gap go, and the "
     "frame's corners sit on the first and last row. A single selection looks exactly like today.",
     """.va .gcsteps{gap:0}
.va .gcstep{margin:0}
.va .gcstep.cur+.gcstep.cur{border-top-color:transparent;border-top-left-radius:0;border-top-right-radius:0}
.va .gcstep.cur:has(+.gcstep.cur){border-bottom-color:transparent;border-bottom-left-radius:0;border-bottom-right-radius:0}
.va .gcstep:not(.cur)+.gcstep{margin-top:1px}"""),
    ("b", "B · Accent bar, no frame",
     "Rows take a tinted ground and a 2px accent bar on the left instead of a frame, so the "
     "level card's accent border is the only box. Two selected rows read as one band.",
     """.vb .gcsteps{gap:0}
.vb .gcstep{border-radius:0 6px 6px 0;border:0;border-left:2px solid transparent;padding-left:7px}
.vb .gcstep.cur{border-left-color:var(--accent);background:var(--accent-soft)}
.vb .gcstep.cur+.gcstep.cur{border-top-right-radius:0}
.vb .gcstep.cur:has(+.gcstep.cur){border-bottom-right-radius:0}"""),
    ("c", "C · Level card goes quiet",
     "The open level keeps its frame but drops the accent to the neutral line; the accent then "
     "belongs only to the rows you are on, merged as in A.",
     """.vc .gclv.gcopen{border-color:var(--line-strong)}
.vc .gcsteps{gap:0}
.vc .gcstep.cur+.gcstep.cur{border-top-color:transparent;border-top-left-radius:0;border-top-right-radius:0}
.vc .gcstep.cur:has(+.gcstep.cur){border-bottom-color:transparent;border-bottom-left-radius:0;border-bottom-right-radius:0}
.vc .gcstep:not(.cur)+.gcstep{margin-top:1px}"""),
]
css = "\n".join(v[3] for v in VARIANTS)
cols = []
for theme in ("dark",):
    for key, title, note, _ in VARIANTS:
        cols.append(f'<section data-theme-box="{theme}"><h3>{title} <small>{theme}</small></h3><p>{note}</p>'
                    f'<div class="grid"><div><h4>two sections selected</h4><div class="rail v{key} gchain asc">{card(True)}</div></div>'
                    f'<div><h4>one section selected</h4><div class="rail v{key} gchain asc">{card(False)}</div></div></div></section>')
html = f"""<!doctype html><html data-theme="dark"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Rail selection</title>
<link rel="stylesheet" href="../../src/styles.css">
<style>
body{{padding:20px;display:block}}
.wrap2{{display:grid;grid-template-columns:repeat(auto-fill,minmax(540px,1fr));gap:22px}}
section{{border:1px solid var(--line);border-radius:12px;padding:14px;background:var(--bg)}}
section h3{{margin:0 0 4px;font-size:15px}} section h3 small{{color:var(--muted);font-weight:400}}
section p{{margin:0 0 10px;color:var(--muted);font-size:12px;max-width:520px}}
h4{{margin:0 0 6px;font-size:10px;text-transform:uppercase;color:var(--muted);letter-spacing:.05em}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:14px}}
.rail{{width:251px;display:flex;flex-direction:column;gap:6px}}
{css}
</style></head><body><h2>Rail selection — three ways to stop two frames touching</h2>
<div class="wrap2" id="dark">{"".join(c for c in cols if 'dark' in c[:40])}</div>
</body></html>"""
out = os.path.join(HERE, "mockups", "rail1.html")
open(out, "w").write(html)
print(out)
