#!/usr/bin/env python3
"""Library redesign, FINAL assembly — everything settled in the 2026-09-01 session:
one page (B) · status strip w/ Update data · G1 edition groups · R3 two-line rows
(origin chip, enable switch, off = dimmed, NO badge) · selection bar (checkbox=select) ·
footer '+ Add files ▾' (popover: zip / json / folder / paste — no refresh verbs, raw-stash
killed them) · pending-import tray while staged. Three states mocked.
Regenerate: python3 scratchpad/mklib4.py"""
import os

BOOKS = [
    ("Player's Handbook (2024)", "baked", "542 spells · 12 classes", True, "2024 core"),
    ("Player's Handbook (2014)", "web", "507 spells · 12 classes", True, "2014 core"),
    ("Xanathar's Guide to Everything", "web", "172 spells · 31 subclasses", True, "Supplements"),
    ("Tasha's Cauldron of Everything", "web", "98 spells · 30 subclasses · 9 feats", True, "Supplements"),
    ("Fizban's Treasury of Dragons", "web", "17 spells · 2 subclasses · 3 feats", False, "Supplements"),
    ("D&D Beyond Drops", "file", "8 spells", True, "Homebrew & UA"),
    ("Shadowmoor", "file", "12 spells · 4 feats", True, "Homebrew & UA"),
]
OCHIP = {"web": "web", "file": "file", "baked": "built-in"}

def row(b, sel=False):
    n, o, kinds, on, _ = b
    return (f'<label class="mksrow{" mksel" if sel else ""}{"" if on else " mkdim"}">'
            f'<input type="checkbox" {"checked" if sel else ""}>'
            f'<span class="mkr2main"><span>{n}</span><small class="mkkinds">{kinds}</small></span>'
            f'<span class="mkchip mko-{o}">{OCHIP[o]}</span>'
            f'<span class="mkswk{"" if on else " mkswoff"}"></span></label>')

def grouped(selected=()):
    out = []
    for g in ["2024 core", "2014 core", "Supplements", "Homebrew & UA"]:
        brs = [b for b in BOOKS if b[4] == g]
        rs = "".join(row(b, b[0] in selected) for b in brs)
        out.append(f'<div class="srcgroup"><h4>{g}</h4><div class="srclist mkone">{rs}</div></div>')
    return "".join(out)

def status(stale=False):
    if stale:
        return ('<div class="mkstatus mkstale"><div class="mkstatln"><b>44 books</b> · 5etools '
                '<b>v2.35.0 is out</b> — you have v2.34.1 · ≈2 MB</div>'
                '<button class="btn on">Update data</button></div>')
    return ('<div class="mkstatus"><div class="mkstatln"><b>44 books</b> · 5etools v2.34.1 (latest) · '
            '≈2 MB in this browser</div><button class="btn">Update data</button></div>')

SEARCH = ('<div class="prepnav" style="border:none;padding:0 0 8px">'
          '<input type="search" placeholder="search books…" style="flex:1">'
          '<button class="btn">Actions</button></div>')
ACTIONS = ('<div class="mkpop mkactpop"><button>Enable all</button><button>Disable all</button>'
           '<button>Select all</button><button>Select shown</button></div>')
SELBAR = ('<div class="mkselbar"><b>2 selected</b><button class="btn">Clear</button>'
          '<span class="prepnav-sp"></span><label class="mksw">enabled <span class="mkswk"></span></label>'
          '<button class="btn danger">Remove</button></div>')
TRAY = ('<div class="mkcard mkpend"><div class="mkcardh">Pending import — nothing stored yet</div>'
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">'
        '<span class="stagechip"><span class="stnm">shadowmoor.json</span><span class="k">12 sp</span></span>'
        '<span class="stagechip"><span class="stnm">brew-xyz.json</span><span class="k">4 sp</span></span></div>'
        '<div class="mktraybooks"><label><input type="checkbox" checked><span>Shadowmoor</span><small>12 spells · 4 feats · new</small></label>'
        '<label><input type="checkbox" checked><span>Brew XYZ</span><small>4 spells · new</small></label></div>'
        '<div class="prepnav" style="border:none;padding:8px 0 0"><span class="prepnav-sp"></span>'
        '<button class="btn">Discard</button><button class="btn on">Add 2 books</button></div></div>')

def modal(body, pop=""):
    inner = (f'<div class="modal mkstage"><div class="box"><div class="mh"><h2>Library</h2>'
             f'<button class="x">×</button></div><div class="mb">{body}</div>'
             f'<div class="mh mkfoot"><button class="btn">Close</button><span style="flex:1"></span>'
             f'<span class="mksplit"><button class="btn on">＋ Add files</button>'
             f'<button class="btn on mkcaret">▾</button></span></div></div></div>')
    return f'<div class="mkanch">{inner}{pop}</div>' if pop else inner

POPOVER = ('<div class="mkpop"><button>＋ Upload .zip</button><button>＋ Upload .json files</button>'
           '<button>⌂ Choose a folder…</button><button>✎ Paste JSON…</button></div>')

S1 = modal(status() + SEARCH + grouped())
S2 = modal(status(True) + SEARCH + SELBAR + grouped(selected=("Fizban's Treasury of Dragons", "Shadowmoor")), ACTIONS)
S3 = modal(TRAY + status() + SEARCH + grouped(), POPOVER)

PAGE = f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Library — final design</title>
<link rel="stylesheet" href="../../src/styles.css">
<style>
  body{{padding:20px;max-width:1240px;margin:0 auto}}
  .mkhead{{display:flex;align-items:center;gap:14px;margin-bottom:18px}}
  .mkhead h1{{font-size:19px}} .mkhead button{{margin-left:auto}}
  p.mk{{color:var(--muted);font-size:13px;max-width:84ch;margin:0 0 12px}}
  .modal.mkstage{{position:static;display:block;padding:0;background:none;inset:auto;z-index:auto}}
  .modal.mkstage .box{{max-width:560px;margin:0}}
  .mktrio{{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;align-items:start}}
  @media (max-width:1500px){{.mktrio{{grid-template-columns:1fr;max-width:600px}}}}
  .mkcolh{{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
    color:var(--muted);padding-bottom:4px;margin:14px 0 6px;border-bottom:1px solid var(--line)}}
  .mkstatus{{display:flex;align-items:center;gap:10px;padding:9px 11px;margin:0 0 12px;
    border:1px solid var(--line-strong);border-radius:10px;background:var(--panel-2)}}
  .mkstatln{{font-size:12.5px;color:var(--muted)}} .mkstatln b{{color:var(--ink)}}
  .mkstatus .btn{{margin-left:auto;flex:0 0 auto}} .mkstale{{border-color:var(--accent)}}
  .mkfoot{{border-top:1px solid var(--line);border-bottom:none;display:flex;gap:8px}}
  .mksplit{{display:inline-flex}} .mksplit .btn:first-child{{border-radius:8px 0 0 8px}}
  .mksplit .mkcaret{{border-radius:0 8px 8px 0;border-left:1px solid var(--bg);padding:6px 8px}}
  .mkanch{{position:relative;display:inline-block;width:100%;max-width:560px}}
  .mkpop{{position:absolute;right:8px;bottom:52px;background:var(--panel);border:1px solid var(--line-strong);
    border-radius:10px;box-shadow:0 12px 40px #0007;padding:5px;display:flex;flex-direction:column;min-width:210px}}
  .mkactpop{{right:64px;top:118px;bottom:auto}}
  .mkpop button{{background:none;border:none;font:inherit;color:var(--ink);text-align:left;
    padding:7px 10px;border-radius:7px;cursor:pointer}} .mkpop button:hover{{background:var(--panel-2)}}
  .mkcard{{border:1px solid var(--line-strong);border-radius:10px;padding:11px;margin:0 0 12px}}
  .mkpend{{border-color:var(--accent);background:var(--accent-soft)}}
  .mkcardh{{font-weight:700;font-size:13.5px}}
  .mktraybooks label{{display:flex;align-items:center;gap:8px;padding:3px 4px;font-size:13px}}
  .mktraybooks small{{margin-left:auto;color:var(--muted)}}
  .srclist.mkone{{display:block}}
  .mksrow{{display:flex;align-items:center;gap:8px;padding:4px 6px;border-radius:7px}}
  .mksrow .mkr2main{{display:flex;flex-direction:column;gap:1px;min-width:0}}
  .mksrow .mkkinds{{color:var(--muted);font-size:11px}}
  .mksrow .mkchip{{margin-left:auto}}
  .mksel{{background:var(--accent-soft)}}
  .mkdim{{opacity:.55}} .mkdim:hover{{opacity:.85}}
  .mkchip{{font-size:10px;font-weight:700;letter-spacing:.03em;border-radius:99px;padding:1px 7px;flex:0 0 auto}}
  .mko-web{{background:var(--accent-soft);color:var(--accent)}}
  .mko-file{{background:var(--gold-soft,#6b5a2a33);color:var(--gold)}}
  .mko-baked{{background:var(--panel-2);color:var(--muted);border:1px solid var(--line-strong)}}
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
<div class="mkhead"><h1>Library — final design, three states</h1>
  <button id="th" class="btn" type="button">flip theme</button></div>
<p class="mk">One page. Status strip (Update data = the web fetch; accent border when a release is out) ·
edition groups · two-line rows: select-checkbox, name + kind counts, origin chip, enable switch —
an off row dims, no badge. Selecting rows raises the bar (Clear · enabled switch · Remove, armed).
Footer: Close · ＋ Add files ▾ (zip / JSON / folder / paste — refresh verbs are GONE: raw-stash +
web refetch re-parse silently on a parser bump). A staged import is the tray above everything.
"Remove imported data" is gone too — select all → Remove covers it.</p>

<div class="mktrio">
  <div><div class="mkcolh">1 · At rest, everything current</div>{S1}</div>
  <div><div class="mkcolh">2 · Update available + 2 rows selected (Actions open)</div>{S2}</div>
  <div><div class="mkcolh">3 · Mid-import: pending tray + Add files popover</div>{S3}</div>
</div>

<script>
document.getElementById("th").onclick=()=>{{const r=document.documentElement;
  r.setAttribute("data-theme",r.getAttribute("data-theme")==="dark"?"light":"dark");}};
</script>
</body></html>
"""
out = os.path.join(os.path.dirname(__file__), "mockups", "library4.html")
open(out, "w", encoding="utf-8").write(PAGE)
print("wrote", out, len(PAGE) // 1024, "KB")
