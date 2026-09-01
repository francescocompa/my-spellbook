#!/usr/bin/env python3
"""Library redesign, round 3: the list itself — row anatomy + grouping axis.
Settled so far: shape B (one page), footer split '+ Add files', selection bar (checkbox =
SELECT now, so 'enabled' needs its own signal), raw-stash refresh. Gitignored output
(scratchpad/mockups/library3.html). Regenerate: python3 scratchpad/mklib3.py"""
import os

# name, origin(web|file|baked), kinds, enabled, edition-group
BOOKS = [
    ("Player's Handbook (2024)", "baked", "542 spells · 12 classes", True, "2024 core"),
    ("Player's Handbook (2014)", "web", "507 spells · 12 classes", True, "2014 core"),
    ("Xanathar's Guide to Everything", "web", "172 spells · 31 subclasses", True, "Supplements"),
    ("Tasha's Cauldron of Everything", "web", "98 spells · 30 subclasses · 9 feats", True, "Supplements"),
    ("Fizban's Treasury of Dragons", "web", "17 spells · 2 subclasses · 3 feats", False, "Supplements"),
    ("D&D Beyond Drops", "file", "8 spells", True, "Homebrew & UA"),
    ("Shadowmoor", "file", "12 spells · 4 feats", True, "Homebrew & UA"),
]
ORIGIN = {"web": ("web", "from 5etools online"), "file": ("file", "your file"), "baked": ("built-in", "ships with the app")}

def row(b, kind, sel=False):
    n, o, kinds, on, _ = b
    oc, _ = ORIGIN[o]
    cb = f'<input type="checkbox" {"checked" if sel else ""}>'
    off = '' if on else '<span class="mkoff">off</span>'
    sw = f'<span class="mkswk{"" if on else " mkswoff"}"></span>'
    if kind == "origin":
        return (f'<label class="mksrow{" mksel" if sel else ""}">{cb}<span>{n}</span>'
                f'<span class="mkchip mko-{o}">{oc}</span>{off}<small>721</small>{sw}</label>')
    if kind == "kinds":
        return (f'<label class="mksrow{" mksel" if sel else ""}">{cb}<span>{n}</span>{off}'
                f'<small class="mkkinds">{kinds}</small>{sw}</label>')
    return (f'<label class="mksrow mkrow2{" mksel" if sel else ""}">{cb}'
            f'<span class="mkr2main"><span>{n}</span>'
            f'<small class="mkkinds">{kinds}</small></span>'
            f'<span class="mkchip mko-{o}">{oc}</span>{off}{sw}</label>')

def grouped(kind, axis="edition", selected=()):
    if axis == "edition":
        order, key = ["2024 core", "2014 core", "Supplements", "Homebrew & UA"], lambda b: b[4]
    else:
        order, key = ["From 5etools online", "Your files", "Built-in"], \
                     lambda b: {"web": "From 5etools online", "file": "Your files", "baked": "Built-in"}[b[1]]
    out = []
    for g in order:
        brs = [b for b in BOOKS if key(b) == g]
        if not brs: continue
        rs = "".join(row(b, kind, b[0] in selected) for b in brs)
        out.append(f'<div class="srcgroup"><h4>{g}</h4><div class="srclist mkone">{rs}</div></div>')
    return "".join(out)

STATUS = ('<div class="mkstatus"><div class="mkstatln"><b>44 books</b> · 5etools v2.34.1 (latest) · '
          'parser current · ≈2 MB</div><button class="btn on">Update data</button></div>')
SEARCH = ('<div class="prepnav" style="border:none;padding:0 0 8px">'
          '<input type="search" placeholder="search books…" style="flex:1">'
          '<button class="btn">Group ▾</button><button class="btn">Actions</button></div>')
SELBAR = ('<div class="mkselbar"><b>2 selected</b><button class="btn">Clear</button>'
          '<span class="prepnav-sp"></span><label class="mksw">enabled <span class="mkswk"></span></label>'
          '<button class="btn danger">Remove</button></div>')

def modal(body):
    return (f'<div class="modal mkstage"><div class="box"><div class="mh"><h2>Library</h2>'
            f'<button class="x">×</button></div><div class="mb">{body}</div>'
            f'<div class="mh mkfoot"><button class="btn">Close</button><span style="flex:1"></span>'
            f'<span class="mksplit"><button class="btn on">＋ Add files</button>'
            f'<button class="btn on mkcaret">▾</button></span></div></div></div>')

R1 = modal(STATUS + SEARCH + grouped("origin"))
R2 = modal(STATUS + SEARCH + grouped("kinds"))
R3 = modal(STATUS + SEARCH + SELBAR + grouped("full", selected=("Fizban's Treasury of Dragons", "Shadowmoor")))
G2 = modal(STATUS + SEARCH + grouped("origin", axis="origin"))

PAGE = f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Library redesign — the list</title>
<link rel="stylesheet" href="../../src/styles.css">
<style>
  body{{padding:20px;max-width:1200px;margin:0 auto}}
  .mkhead{{display:flex;align-items:center;gap:14px;margin-bottom:18px}}
  .mkhead h1{{font-size:19px}} .mkhead button{{margin-left:auto}}
  h2.mk{{font-size:15px;margin:26px 0 4px}} p.mk{{color:var(--muted);font-size:13px;max-width:80ch;margin:0 0 12px}}
  .tag{{background:var(--accent-soft);color:var(--accent);font-size:10px;font-weight:700;
    text-transform:uppercase;letter-spacing:.05em;padding:2px 7px;border-radius:99px;margin-left:6px}}
  .modal.mkstage{{position:static;display:block;padding:0;background:none;inset:auto;z-index:auto}}
  .modal.mkstage .box{{max-width:560px;margin:0}}
  .mkpair{{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}}
  @media (max-width:1150px){{.mkpair{{grid-template-columns:1fr}}}}
  .mkcolh{{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
    color:var(--muted);padding-bottom:4px;margin-bottom:6px;border-bottom:1px solid var(--line)}}
  .mkstatus{{display:flex;align-items:center;gap:10px;padding:9px 11px;margin:0 0 12px;
    border:1px solid var(--line-strong);border-radius:10px;background:var(--panel-2)}}
  .mkstatln{{font-size:12.5px;color:var(--muted)}} .mkstatln b{{color:var(--ink)}}
  .mkstatus .btn{{margin-left:auto;flex:0 0 auto}}
  .mkfoot{{border-top:1px solid var(--line);border-bottom:none;display:flex;gap:8px}}
  .mksplit{{display:inline-flex}} .mksplit .btn:first-child{{border-radius:8px 0 0 8px}}
  .mksplit .mkcaret{{border-radius:0 8px 8px 0;border-left:1px solid var(--bg);padding:6px 8px}}
  .srclist.mkone{{display:block}}
  .mksrow{{display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:7px}}
  .mksrow small{{margin-left:auto;flex:0 0 auto}}
  .mksrow .mkkinds{{color:var(--muted);font-size:11px}}
  .mksel{{background:var(--accent-soft)}}
  .mkrow2 .mkr2main{{display:flex;flex-direction:column;gap:1px;min-width:0}}
  .mkrow2 .mkr2main small{{margin-left:0}}
  .mkrow2 .mkchip,.mkrow2 .mkoff{{margin-left:auto}}
  .mkrow2 .mkchip+ .mkoff{{margin-left:0}}
  .mkchip{{font-size:10px;font-weight:700;letter-spacing:.03em;border-radius:99px;padding:1px 7px;flex:0 0 auto}}
  .mko-web{{background:var(--accent-soft);color:var(--accent)}}
  .mko-file{{background:var(--gold-soft,#6b5a2a33);color:var(--gold)}}
  .mko-baked{{background:var(--panel-2);color:var(--muted);border:1px solid var(--line-strong)}}
  .mkoff{{font-size:10px;font-weight:700;text-transform:uppercase;color:var(--muted);
    border:1px solid var(--line-strong);border-radius:99px;padding:1px 6px;flex:0 0 auto}}
  .mkselbar{{display:flex;align-items:center;gap:8px;padding:7px 10px;margin:0 0 10px;font-size:12.5px;
    border:1px solid var(--accent);border-radius:10px;background:var(--accent-soft)}}
  .mksw{{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)}}
  .mkswk{{width:26px;height:15px;border-radius:99px;background:var(--accent);position:relative;
    display:inline-block;flex:0 0 auto}}
  .mkswk::after{{content:"";position:absolute;right:2px;top:2px;width:11px;height:11px;border-radius:50%;background:var(--bg)}}
  .mkswoff{{background:var(--line-strong)}} .mkswoff::after{{right:auto;left:2px}}
</style>
</head>
<body>
<div class="mkhead"><h1>The list — rows and grouping</h1>
  <button id="th" class="btn" type="button">flip theme</button></div>
<p class="mk">Settled: one page, footer ＋ Add files, selection bar. So a row's checkbox now means
SELECT — "enabled" moves to a per-row switch (right edge), flippable directly or in bulk via the
selection bar. The question is what else a row says, and what the groups are.</p>

<section id="rows">
  <h2 class="mk">Q1 · What does a row say?</h2>
  <div class="mkpair">
    <div><div class="mkcolh">R1 · origin chip — where it came from (web / file / built-in)</div>{R1}</div>
    <div><div class="mkcolh">R2 · kind counts — what is inside it</div>{R2}</div>
  </div>
  <div style="margin-top:14px"><div class="mkcolh">R3 · both, two-line row — with the selection bar live <span class="tag">recommended</span></div>
  <div style="max-width:560px">{R3}</div></div>
  <p class="mk" style="margin-top:8px">R1 answers the maintenance question ("what does Update touch,
  what is mine"), R2 answers the content question ("which book has the feats"). R3 carries both on
  two lines — taller list, but 44 books already scroll either way, and search + groups do the
  finding. The switch on the right edge is the everyday enable toggle in all three.</p>
</section>

<section id="groups">
  <h2 class="mk">Q2 · What are the groups?</h2>
  <div class="mkpair">
    <div><div class="mkcolh">G1 · by edition/category, as today (R1 rows shown)</div>{R1}</div>
    <div><div class="mkcolh">G2 · by origin — online / your files / built-in</div>{G2}</div>
  </div>
  <p class="mk" style="margin-top:8px">G1 keeps the play-relevant order (2024 first). G2 makes the
  three origins into the shelves themselves — strongest possible "organize by type of source", and
  the origin chip becomes redundant (a plain row). A "Group ▾" control could offer both (that is the
  monster-forge pattern), at the cost of one more control in the toolbar.</p>
</section>

<script>
document.getElementById("th").onclick=()=>{{const r=document.documentElement;
  r.setAttribute("data-theme",r.getAttribute("data-theme")==="dark"?"light":"dark");}};
</script>
</body></html>
"""
out = os.path.join(os.path.dirname(__file__), "mockups", "library3.html")
open(out, "w", encoding="utf-8").write(PAGE)
print("wrote", out, len(PAGE) // 1024, "KB")
