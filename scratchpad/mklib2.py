#!/usr/bin/env python3
"""Library redesign, round 2: shape B refined, informed by monster-forge's Preset libraries.
Gitignored output (scratchpad/mockups/library2.html). Two open questions, each with two
mocked answers: (1) where acquisition lives, (2) how removal works.
Regenerate: python3 scratchpad/mklib2.py"""
import os

def rows(select=False, storage=False, selected=()):
    BOOKS = [("Player's Handbook (2024)", "542 · baked-in", True, "2024 core"),
             ("Player's Handbook (2014)", "507", True, "2014 core"),
             ("Xanathar's Guide to Everything", "172", True, "Supplements"),
             ("Tasha's Cauldron of Everything", "98", True, "Supplements"),
             ("Fizban's Treasury of Dragons", "17", False, "Supplements"),
             ("D&D Beyond Drops", "8", True, "Homebrew & UA"),
             ("Shadowmoor", "12", True, "Homebrew & UA")]
    groups, out = [], []
    for n, c, on, g in BOOKS:
        if g not in [x[0] for x in groups]: groups.append((g, []))
        dict(groups)[g].append((n, c, on))
    for g, brs in groups:
        rs = []
        for n, c, on in brs:
            if storage:
                x = '<span class="mkro">baked-in</span>' if "baked" in c else '<button class="btn danger mkrm">Remove</button>'
                rs.append(f'<label class="mksrow"><span>{n}</span><small>{c.split(" · ")[0]}</small>{x}</label>')
            elif select:
                sel = n in selected
                off = "" if on else '<span class="mkoff">off</span>'
                rs.append(f'<label class="mksrow{" mksel" if sel else ""}">'
                          f'<input type="checkbox" {"checked" if sel else ""}><span>{n}</span>{off}<small>{c}</small></label>')
            else:
                rs.append(f'<label><input type="checkbox" {"checked" if on else ""}><span>{n}</span><small>{c}</small></label>')
        allcb = "" if storage else '<label class="all"><span>all</span><input type="checkbox" checked></label>'
        out.append(f'<div class="srcgroup"><h4>{g}{allcb}</h4><div class="srclist">{"".join(rs)}</div></div>')
    return "".join(out)

STATUS = ('<div class="mkstatus"><div class="mkstatln"><b>44 books</b> · 5etools v2.34.1 (latest) · '
          'parser current · ≈2 MB in this browser</div>'
          '<button class="btn on">Update data</button></div>')
SEARCH = ('<div class="prepnav" style="border:none;padding:0 0 8px">'
          '<input type="search" placeholder="search books…" style="flex:1">'
          '<button class="btn">Actions</button></div>')
TRAY = ('<div class="mkcard mkpend"><div class="mkcardh">Pending import — nothing stored yet</div>'
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">'
        '<span class="stagechip"><span class="stnm">shadowmoor.json</span><span class="k">12 sp</span></span>'
        '<span class="stagechip"><span class="stnm">brew-xyz.json</span><span class="k">4 sp</span></span></div>'
        '<div class="importplan" style="margin:8px 0 0"><div class="iph"><b>Tick the books to keep</b>'
        '<span class="sub">+2 new</span></div></div>'
        '<div class="prepnav" style="border:none;padding:8px 0 0"><span class="prepnav-sp"></span>'
        '<button class="btn">Discard</button><button class="btn on">Add them</button></div></div>')

def modal(body, foot=""):
    return (f'<div class="modal mkstage"><div class="box"><div class="mh"><h2>Library</h2>'
            f'<button class="x">×</button></div><div class="mb">{body}</div>{foot}</div></div>')

FOOT_SPLIT = ('<div class="mh mkfoot"><button class="btn">Close</button><span class="prepnav-sp" style="flex:1"></span>'
              '<span class="mksplit"><button class="btn on">＋ Add files</button><button class="btn on mkcaret">▾</button></span></div>')
POPOVER = ('<div class="mkpop"><button>＋ Upload .zip</button><button>＋ Upload .json files</button>'
           '<button>⌂ Choose a folder…</button><button>↻ Re-read linked folder</button>'
           '<button>✎ Paste JSON…</button></div>')

A1 = modal(STATUS + SEARCH + rows()
           + '<div class="prepnav" style="border:none;padding:10px 0 0"><button class="btn" style="width:100%">+ Add content — homebrew, UA, your own files…</button></div>')
A2 = ('<div class="mkanch">' + modal(TRAY + STATUS + SEARCH + rows(), FOOT_SPLIT) + POPOVER + '</div>')

SELBAR = ('<div class="mkselbar"><b>2 selected</b><button class="btn">Clear</button>'
          '<span class="prepnav-sp"></span><label class="mksw">enabled <span class="mkswk"></span></label>'
          '<button class="btn danger">Remove</button></div>')
B1 = modal('<div class="mkbanner">Storage — remove books from this browser. Your builds are never touched; '
           'picks from a removed book are flagged, not deleted. <button class="btn on">Done</button></div>'
           + SEARCH + rows(storage=True))
B2 = modal(STATUS + SEARCH + SELBAR + rows(select=True, selected=("Fizban's Treasury of Dragons", "Shadowmoor")))

PAGE = f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Library redesign — B refined</title>
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
  .mkstatln{{font-size:12.5px;color:var(--muted);line-height:1.45}} .mkstatln b{{color:var(--ink)}}
  .mkstatus .btn{{margin-left:auto;flex:0 0 auto}}
  .mkcard{{border:1px solid var(--line-strong);border-radius:10px;padding:11px;margin:0 0 12px}}
  .mkpend{{border-color:var(--accent);background:var(--accent-soft)}}
  .mkcardh{{font-weight:700;font-size:13.5px}}
  .mkfoot{{border-top:1px solid var(--line);border-bottom:none;display:flex;gap:8px}}
  .mksplit{{display:inline-flex}} .mksplit .btn:first-child{{border-radius:8px 0 0 8px}}
  .mksplit .mkcaret{{border-radius:0 8px 8px 0;border-left:1px solid var(--bg);padding:6px 8px}}
  .mkanch{{position:relative;display:inline-block;max-width:560px}}
  .mkpop{{position:absolute;right:8px;bottom:52px;background:var(--panel);border:1px solid var(--line-strong);
    border-radius:10px;box-shadow:0 12px 40px #0007;padding:5px;display:flex;flex-direction:column;min-width:220px}}
  .mkpop button{{background:none;border:none;font:inherit;color:var(--ink);text-align:left;
    padding:7px 10px;border-radius:7px;cursor:pointer}} .mkpop button:hover{{background:var(--panel-2)}}
  .mkbanner{{display:flex;align-items:center;gap:10px;padding:9px 11px;margin:0 0 12px;font-size:12.5px;
    border:1px solid var(--accent);border-radius:10px;background:var(--accent-soft);color:var(--ink)}}
  .mkbanner .btn{{margin-left:auto;flex:0 0 auto}}
  .mksrow{{display:flex;align-items:center;gap:8px}}
  .mksrow .mkrm{{margin-left:auto;font-size:11.5px;padding:3px 9px}}
  .mksrow .mkro{{margin-left:auto;font-size:11px;color:var(--muted)}}
  .mksel{{background:var(--accent-soft);border-radius:7px}}
  .mkoff{{font-size:10px;font-weight:700;text-transform:uppercase;color:var(--muted);
    border:1px solid var(--line-strong);border-radius:99px;padding:1px 6px}}
  .mkselbar{{display:flex;align-items:center;gap:8px;padding:7px 10px;margin:0 0 10px;font-size:12.5px;
    border:1px solid var(--accent);border-radius:10px;background:var(--accent-soft)}}
  .mksw{{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)}}
  .mkswk{{width:26px;height:15px;border-radius:99px;background:var(--accent);position:relative;display:inline-block}}
  .mkswk::after{{content:"";position:absolute;right:2px;top:2px;width:11px;height:11px;border-radius:50%;background:var(--bg)}}
</style>
</head>
<body>
<div class="mkhead"><h1>Library, shape B refined — two questions</h1>
  <button id="th" class="btn" type="button">flip theme</button></div>
<p class="mk">monster-forge's "Preset libraries" is ONE modal, no tabs — same family as your B. Its moves:
a <b>Pending import</b> tray that only exists while a zip is staged; acquisition as a footer
<b>split button + popover</b> (no drop zone, no view swap); removal via <b>select rows → an action bar
appears</b> (count · Clear · enable switch · Remove), confirm only on Remove/Discard.</p>

<section id="q1">
  <h2 class="mk">Q1 · Where does "add content" live?</h2>
  <div class="mkpair">
    <div><div class="mkcolh">1a · "+ Add content" swaps the view (your B as mocked before)</div>{A1}</div>
    <div><div class="mkcolh">1b · footer split button + popover, pending tray on top — the monster-forge way <span class="tag">recommended</span></div>{A2}</div>
  </div>
  <p class="mk" style="margin-top:8px">1b never leaves the page: the popover holds every file path
  (zip / JSON / folder / paste), the web fetch stays as the status strip's <b>Update data</b>, and a
  staged import appears as the tray above the list — shown here mid-import. One less navigation idea,
  and the two apps' managers become the same thing to learn. 1a gives the fetch card + drop zone a
  full page to breathe, which is friendlier the day you drag files in.</p>
</section>

<section id="q2">
  <h2 class="mk">Q2 · How does removing a stored book work?</h2>
  <div class="mkpair">
    <div><div class="mkcolh">2a · storage mode (your pick) — Actions → "Manage storage…"</div>{B1}</div>
    <div><div class="mkcolh">2b · selection bar — the monster-forge way</div>{B2}</div>
  </div>
  <p class="mk" style="margin-top:8px">2a keeps day-to-day rows pure checkboxes and makes destruction
  a place you visit and leave. 2b is what monster-forge does — but its checkbox means SELECT, not
  ENABLED, so adopting it would change what a tick in this list has always meant here (enabled), or
  force two checkboxes per row. Shown so you can see the cost; 2a fits this app's rows better.</p>
</section>

<script>
document.getElementById("th").onclick=()=>{{const r=document.documentElement;
  r.setAttribute("data-theme",r.getAttribute("data-theme")==="dark"?"light":"dark");}};
</script>
</body></html>
"""
out = os.path.join(os.path.dirname(__file__), "mockups", "library2.html")
open(out, "w", encoding="utf-8").write(PAGE)
print("wrote", out, len(PAGE) // 1024, "KB")
