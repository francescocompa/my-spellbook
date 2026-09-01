#!/usr/bin/env python3
"""Library modal redesign mockups, against the REAL stylesheet.
Gitignored output (scratchpad/mockups/library.html). Three SHAPE variants for the
2026-09-01 design session — verb labels are drafts (topic 3), row anatomy is draft too.
Regenerate: python3 scratchpad/mklib.py"""
import os

# ── shared fixtures ─────────────────────────────────────────────────────────
GROUPS = [
    ("2024 core", [("Player's Handbook (2024)", "542", True)]),
    ("2014 core", [("Player's Handbook (2014)", "507", True), ("Dungeon Master's Guide (2014)", "22", True)]),
    ("Supplements", [("Xanathar's Guide to Everything", "172", True), ("Tasha's Cauldron of Everything", "98", True),
                     ("Fizban's Treasury of Dragons", "17", False), ("The Book of Many Things", "4", True)]),
    ("Homebrew & UA", [("D&D Beyond Drops", "8", True), ("Shadowmoor", "12", True)]),
]

def checklist(compact=False):
    out = []
    for g, rows in (GROUPS[:3] if compact else GROUPS):
        rs = "".join(
            f'<label><input type="checkbox" {"checked" if on else ""}><span>{n}</span><small>{c}</small></label>'
            for n, c, on in rows)
        out.append(f'<div class="srcgroup"><h4>{g}<label class="all"><span>all</span>'
                   f'<input type="checkbox" checked></label></h4><div class="srclist">{rs}</div></div>')
    return "".join(out)

SEARCH_ROW = ('<div class="prepnav" style="border:none;padding:0 0 8px">'
              '<input type="search" placeholder="search books…" style="flex:1">'
              '<button class="btn">Actions</button></div>')

STATUS_STRIP = ('<div class="mkstatus"><div class="mkstatln"><b>44 books</b> · 5etools v2.34.1 (latest) · '
                'all read by parser v1.5.6 · ≈2 MB in this browser</div>'
                '<button class="btn on">Update data</button></div>')

STATUS_STALE = ('<div class="mkstatus mkstale"><div class="mkstatln"><b>44 books</b> · 5etools <b>v2.35.0 is out</b> — '
                'you have v2.34.1 · ≈2 MB in this browser</div>'
                '<button class="btn on">Update data</button></div>')

FETCH_CARD = ('<div class="mkcard mkprimary">'
              '<div class="mkcardh">Get everything from 5etools</div>'
              '<p class="note" style="margin:2px 0 8px">Pulls the current release straight from the public '
              'repository — no download, nothing uploaded. You have v2.34.1, fetched 1 Sep.</p>'
              '<div class="prepnav" style="border:none;padding:0">'
              '<button class="btn on">Fetch the latest</button><span class="prepnav-sp"></span>'
              '<button class="btn">Address…</button></div></div>')

def files_card(expanded):
    head = ('<button class="mkdisc" type="button"><span class="mkdiscn">Add your own files</span>'
            '<span class="sub" style="color:var(--muted)">homebrew, UA, a local 5etools export</span>'
            '<span class="entcaret"></span></button>')
    if not expanded:
        return f'<div class="mkcard">{head}</div>'
    body = ('<div class="importdrop" style="margin-top:8px"><span style="font-size:20px">⤓</span>'
            '<div><b>Drop a .zip, JSON files, or a whole folder</b><br>'
            '<span style="color:var(--muted)"><u>browse files…</u> · <u>choose folder…</u> · <u>paste JSON…</u></span></div></div>'
            '<div class="prepnav" style="border:none;padding:6px 0 0">'
            '<span class="sub" style="color:var(--muted);font-size:12px">5etool_mirror — linked folder</span>'
            '<button class="btn">Re-read folder</button><span class="prepnav-sp"></span>'
            '<button class="btn">Forget folder</button></div>')
    return f'<div class="mkcard">{head}{body}</div>'

PENDING = ('<div class="mkghost"><div class="mkghostn">appears only while something is staged</div>'
           '<div class="mkcard mkpend"><div class="mkcardh">Ready to add — nothing stored yet</div>'
           '<div class="importstaged" style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">'
           '<span class="stagechip"><span class="stnm">spells-xphb.json</span><span class="k">334 sp</span></span>'
           '<span class="stagechip"><span class="stnm">shadowmoor.json</span><span class="k">12 sp</span></span>'
           '<span class="stagechip"><span class="stnm">+54 more</span></span></div>'
           '<div class="importplan" style="margin-top:8px"><div class="iph"><b>Tick the books to keep</b>'
           '<span class="sub">46 books · +2 new</span></div>'
           f'{checklist(compact=True)}</div>'
           '<div class="prepnav" style="border:none;padding:8px 0 0"><span class="prepnav-sp"></span>'
           '<button class="btn">Discard</button><button class="btn on">Apply</button></div></div></div>')

DANGER = ('<div class="prepnav" style="border:none;padding:10px 0 0;margin-top:10px;border-top:1px solid var(--line)">'
          '<span class="sub" style="color:var(--muted);font-size:12px">Everything imported, back to the built-in books</span>'
          '<span class="prepnav-sp"></span><button class="btn danger">Remove imported data</button></div>')

def modal(tabs, body, active=0):
    tb = "".join(f'<button class="{"on" if i == active else ""}">{t}</button>' for i, t in enumerate(tabs)) if tabs else ""
    tabbar = f'<div class="libtabs">{tb}</div>' if tabs else ""
    return (f'<div class="modal mkstage"><div class="box"><div class="mh"><h2>Library</h2>'
            f'<button class="x">×</button></div>{tabbar}<div class="mb">{body}</div></div></div>')

# ── A · Books | Add content ────────────────────────────────────────────────
A1 = modal(["Books", "Add content"], STATUS_STRIP + SEARCH_ROW + checklist(), 0)
A2 = modal(["Books", "Add content"], FETCH_CARD + files_card(True) + PENDING + DANGER, 1)

# ── B · one page, no tabs ──────────────────────────────────────────────────
B1 = modal(None, STATUS_STALE + SEARCH_ROW + checklist()
           + '<div class="prepnav" style="border:none;padding:10px 0 0"><button class="btn" style="width:100%">+ Add content — homebrew, UA, your own files…</button></div>')
B2 = modal(None, '<p class="note" style="margin:0 0 8px">‹ Back to your books</p>' + FETCH_CARD + files_card(True) + PENDING + DANGER)

# ── C · current tabs, Manage regrouped ─────────────────────────────────────
C1 = modal(["Sources", "Manage"],
           '<div class="mkcard mkprimary"><div class="mkcardh">Get content</div>'
           '<div class="prepnav" style="border:none;padding:4px 0 0">'
           '<button class="btn on">Fetch 5etools data online</button>'
           '<span class="sub" style="color:var(--muted);font-size:12px">you have v2.34.1</span>'
           '<span class="prepnav-sp"></span><button class="btn">Address…</button></div>'
           + files_card(False).replace('class="mkcard"', 'class="mkinner"') + '</div>'
           + PENDING
           + '<div class="mkcard"><div class="mkcardh">Stored data</div>'
           '<p class="libparser" style="margin:4px 0 8px">all 44 books read by parser v1.5.6 · ≈ 2 MB in this browser</p>'
           '<div class="prepnav" style="border:none;padding:0">'
           '<button class="btn">Refresh imported data</button><span class="prepnav-sp"></span>'
           '<button class="btn danger">Remove imported data</button></div></div>', 1)

PAGE = f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Library redesign — shape variants</title>
<link rel="stylesheet" href="../../src/styles.css">
<style>
  body{{padding:20px;max-width:1200px;margin:0 auto}}
  .mkhead{{display:flex;align-items:center;gap:14px;margin-bottom:18px}}
  .mkhead h1{{font-size:19px}} .mkhead nav{{display:flex;gap:10px}}
  .mkhead a{{color:var(--accent);font-size:13px}} .mkhead button{{margin-left:auto}}
  h2.mk{{font-size:15px;margin:26px 0 4px}} p.mk{{color:var(--muted);font-size:13px;max-width:76ch;margin:0 0 12px}}
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
  .mkstale{{border-color:var(--accent)}}
  .mkcard{{border:1px solid var(--line-strong);border-radius:10px;padding:11px;margin:0 0 10px}}
  .mkprimary{{border-color:var(--accent);background:var(--accent-soft)}}
  .mkcardh{{font-weight:700;font-size:13.5px;margin-bottom:2px}}
  .mkinner{{margin-top:10px;padding-top:10px;border-top:1px solid var(--line)}}
  .mkdisc{{display:flex;align-items:center;gap:8px;width:100%;background:none;border:none;
    padding:0;font:inherit;color:var(--ink);cursor:pointer;text-align:left}}
  .mkdiscn{{font-weight:700;font-size:13.5px}}
  .mkdisc .entcaret{{margin-left:auto}}
  .mkghost{{border:1px dashed var(--line-strong);border-radius:12px;padding:8px;margin:0 0 10px}}
  .mkghostn{{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin:0 0 6px 3px}}
  .mkpend{{margin:0}}
</style>
</head>
<body>
<div class="mkhead">
  <h1>Library — three shapes</h1>
  <nav><a href="#a">A · Books | Add content</a><a href="#b">B · one page</a><a href="#c">C · tidied Manage</a></nav>
  <button id="th" class="btn" type="button">flip theme</button>
</div>
<p class="mk">Verb labels ("Update data", "Fetch the latest", "Re-read folder"…) are DRAFTS — they are
topic 3. This round is about the shape only: what lives where, what is one list, what hides until needed.</p>

<section id="a">
  <h2 class="mk">A · Two tabs with honest jobs: Books | Add content <span class="tag">recommended</span></h2>
  <p class="mk">ONE books list (today's Sources list) is the home tab, with a status strip on top —
  what you have, how fresh, one Update button. Everything that ACQUIRES content moves to the second
  tab: the online fetch as the primary card, your own files behind one disclosure, and the
  tick-and-apply panel appearing only while something is staged. Kills the double checklist —
  the keep-list exists only mid-import, as confirmation. Onboarding opens straight into Add content.</p>
  <div class="mkpair">
    <div><div class="mkcolh">Books tab (default)</div>{A1}</div>
    <div><div class="mkcolh">Add content tab</div>{A2}</div>
  </div>
</section>

<section id="b">
  <h2 class="mk">B · One page, no tabs</h2>
  <p class="mk">The same status strip and single books list, but no tab bar at all: adding content is
  a full-width "+ Add content" at the foot of the list that swaps the view (like the guide's pages).
  The cleanest mental model — one surface, one list — and the status strip can carry the update nudge
  (shown stale here). Costs a longer scroll with 44 books before the add button, and the back-and-forth
  swap is one more navigation idea this modal never had.</p>
  <div class="mkpair">
    <div><div class="mkcolh">Home</div>{B1}</div>
    <div><div class="mkcolh">after "+ Add content"</div>{B2}</div>
  </div>
</section>

<section id="c">
  <h2 class="mk">C · Keep Sources | Manage, regroup Manage into three cards</h2>
  <p class="mk">The least surgery: Sources stays exactly as is, Manage becomes three titled cards —
  Get content (fetch primary, files behind the disclosure), the staged panel (hidden until something
  lands), Stored data (parser line, storage, Refresh, Remove). Cheapest to build and nothing moves
  tabs — but it keeps TWO checklists with different meanings, which is half of today's confusion.</p>
  <div style="max-width:560px">{C1}</div>
</section>

<script>
document.getElementById("th").onclick=()=>{{const r=document.documentElement;
  r.setAttribute("data-theme",r.getAttribute("data-theme")==="dark"?"light":"dark");}};
</script>
</body></html>
"""
out = os.path.join(os.path.dirname(__file__), "mockups", "library.html")
open(out, "w", encoding="utf-8").write(PAGE)
print("wrote", out, len(PAGE) // 1024, "KB")
