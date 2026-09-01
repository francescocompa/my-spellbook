#!/usr/bin/env python3
"""Build the class+subclass merge mockup from the REAL digest, against the REAL stylesheet.
Gitignored output (scratchpad/mockups/). Three variants, one recommendation."""
import json, os, html
D = json.load(open(os.path.join(os.path.dirname(__file__), "..", "data", "data.json")))
CLS = next(c for c in D["classes"] if c["name"] == "Wizard" and c["source"] == "XPHB")
SUB = next(s for s in D["subclasses"] if s["shortName"] == "Evoker" and s["source"] == "XPHB")
e = html.escape
PB = lambda L: 2 + (L - 1) // 4

def blocks(desc):
    out = []
    for b in desc or []:
        if isinstance(b, str):
            out.append(f"<p>{e(b)}</p>")
        else:
            out.append(f'<div class="entsec"><div class="entsecn">{e(b["n"])}</div>'
                       + "".join(f"<p>{e(x)}</p>" for x in b.get("e", [])) + "</div>")
    return "".join(out)

def feat_sec(f, sub=False):
    tag = f'<span class="mksubtag">{e(SUB["shortName"])}</span>' if sub else ""
    return (f'<div class="entsec fold{" mksub" if sub else ""}" data-exp="1">'
            f'<button class="entsech" type="button"><span class="entsecn">{e(f["name"])}</span>'
            f'{tag}<span class="entcaret"></span></button>'
            f'<div class="entsecb">{blocks(f.get("desc"))}</div></div>')

def levels(pairs):
    """pairs: [(level, [(feature, is_sub)…])] -> level-group HTML"""
    out = []
    for L, fs in pairs:
        out.append(f'<div class="entlvl" data-exp="1"><button class="entlvlh" type="button">'
                   f'<span class="entlvlt">Level {L}</span>'
                   f'<span class="entlvln">{len(fs)} feature{"" if len(fs)==1 else "s"}</span>'
                   f'<span class="entcaret"></span></button><div class="entlvlb">'
                   + "".join(feat_sec(f, s) for f, s in fs) + "</div></div>")
    return "".join(out)

def merged_levels():
    by = {}
    for f in CLS["features"]: by.setdefault(f["level"], []).append((f, False))
    for f in SUB["features"]: by.setdefault(f["level"], []).append((f, True))
    return [(L, by[L]) for L in sorted(by)]

def blk(title, body, cls="", shut=False, tools=""):
    return (f'<div class="entblk {cls}" data-exp="{"0" if shut else "1"}">'
            f'<div class="entblkh"><button class="entblkt" type="button">'
            f'<span>{e(title)}</span><span class="entcaret"></span></button>{tools}</div>'
            f'<div class="entblkb">{body}</div></div>')

def core_traits():
    t = CLS["traits"]; ab = lambda a: f'<span class="abchip {a}">{a.capitalize()}</span>'
    rows = [("Primary ability", " ".join(ab(a) for a in t["primary"])),
            ("Hit point die", f'{t["hd"]} per level'),
            ("Saving throws", " ".join(ab(a) for a in t["saves"])),
            ("Skills", "Choose 2: " + ", ".join(x.capitalize() for x in t["skills"]["choices"][0]["from"])),
            ("Weapons", "Simple"),
            ("Spellcasting ability", ab(CLS["ability"]))]
    return '<div class="grid">' + "".join(f"<b>{e(k)}</b><span>{v}</span>" for k, v in rows) + "</div>"

def table(with_sub):
    groups = CLS["table"]
    cls_by, sub_by = {}, {}
    for f in CLS["features"]: cls_by.setdefault(f["level"], []).append(f["name"])
    for f in SUB["features"]: sub_by.setdefault(f["level"], []).append(f["name"])
    span = [len(g["cols"]) for g in groups]
    titles = ('<tr><th colspan="3"></th>'
              + "".join(f'<th colspan="{span[i]}" class="ctgrp">{e(g["title"] or "")}</th>'
                        for i, g in enumerate(groups)) + "</tr>")
    head = ('<tr><th>Level</th><th>PB</th><th class="ctfeat">Features</th>'
            + "".join(f"<th>{e(c)}</th>" for g in groups for c in g["cols"]) + "</tr>")
    rows = []
    for L in range(1, 21):
        cells = ", ".join(cls_by.get(L, [])) or "—"
        if with_sub and sub_by.get(L):
            marked = " · ".join(f'<span class="ctsub">{e(n)}</span>' for n in sub_by[L])
            cells = (cells + " · " if cells != "—" else "") + marked
        else:
            cells = e(cells)
        rows.append(f'<tr><td class="ctlv">{L}</td><td>+{PB(L)}</td><td class="ctfeat">{cells}</td>'
                    + "".join(f'<td>{e((g["rows"][L-1] or ["—"]*len(g["cols"]))[i])}</td>'
                              for g in groups for i in range(len(g["cols"]))) + "</tr>")
    return f'<div class="cttwrap"><table class="cttable">{titles}{head}{"".join(rows)}</table></div>'

def head(title, sub, tag=None):
    t = f' <span class="bchip">{e(tag)}</span>' if tag else ""
    return (f'<div class="mh"><h3>{e(title)}{t}</h3><div class="sub">{e(sub)}</div></div>')

# ── A · one spine, the subclass marked ──────────────────────────────────────
A = ('<div class="box entmodal ent-class">'
     + head("Wizard", "Class · Evoker", "XPHB")
     + '<div class="mb">'
     + blk("Core traits", core_traits())
     + blk("Progression", table(True), shut=True)
     + blk("Features", levels(merged_levels()),
           tools='<button class="entfoldall" type="button">Collapse all</button>')
     + "</div></div>")

# ── B · two bands ───────────────────────────────────────────────────────────
B = ('<div class="box entmodal ent-class">'
     + head("Wizard", "Class", "XPHB")
     + '<div class="mb">'
     + blk("Core traits", core_traits())
     + blk("Progression", table(False), shut=True)
     + blk("Features", levels([(L, [(f, False) for f in fs])
                               for L, fs in sorted({f["level"]: [g for g in CLS["features"] if g["level"] == f["level"]]
                                                    for f in CLS["features"]}.items())]))
     + '<div class="mkband">'
     + f'<div class="mkbandh"><span class="mkbandn">{e(SUB["shortName"])}</span>'
       f'<span class="mkbandk">subclass · level {CLS["subclassLevel"]}</span>'
       f'<span class="bchip">{e(SUB["source"])}</span></div>'
     + blk("Features", levels([(L, [(f, False) for f in fs])
                               for L, fs in sorted({f["level"]: [g for g in SUB["features"] if g["level"] == f["level"]]
                                                    for f in SUB["features"]}.items())]))
     + "</div></div></div>")

# ── C · paired rail ─────────────────────────────────────────────────────────
def paired():
    by = {}
    for f in CLS["features"]: by.setdefault(f["level"], [[], []])[0].append(f)
    for f in SUB["features"]: by.setdefault(f["level"], [[], []])[1].append(f)
    out = []
    for L in sorted(by):
        c, s = by[L]
        out.append(f'<div class="entlvl" data-exp="1"><button class="entlvlh" type="button">'
                   f'<span class="entlvlt">Level {L}</span>'
                   f'<span class="entlvln">{len(c)+len(s)} features</span>'
                   f'<span class="entcaret"></span></button><div class="entlvlb mkpair">'
                   f'<div class="mkcol"><div class="mkcolh">Wizard</div>'
                   + ("".join(feat_sec(f) for f in c) or '<p class="entnotext">Nothing at this level.</p>')
                   + '</div><div class="mkcol mksubcol"><div class="mkcolh">'
                   + e(SUB["shortName"]) + '</div>'
                   + ("".join(feat_sec(f) for f in s) or '<p class="entnotext">Nothing at this level.</p>')
                   + "</div></div></div>")
    return "".join(out)

C = ('<div class="box entmodal ent-class">'
     + head("Wizard", "Class · Evoker", "XPHB")
     + '<div class="mb">'
     + blk("Core traits", core_traits())
     + blk("Progression", table(True), shut=True)
     + blk("Features", paired())
     + "</div></div>")

PAGE = f"""<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mockup — class ⊕ subclass, one modal</title>
<!-- The REAL stylesheet, and REAL content out of data.json. Only `.mk*` below is
     mockup-only chrome; every other class is the app's own. -->
<link rel="stylesheet" href="../../src/styles.css">
<style>
  body{{max-width:1240px;margin:0 auto;padding:0 20px 80px;background:var(--bg)}}
  .mkhead{{position:sticky;top:0;z-index:40;background:var(--bg);padding:16px 0 12px;
    border-bottom:1px solid var(--line);margin-bottom:22px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}}
  .mkhead h1{{font-size:18px;margin:0;flex:1 1 auto}}
  .mkhead nav{{display:flex;gap:6px;flex-wrap:wrap}}
  .mkhead nav a,.mkhead button{{font-size:11.5px;color:var(--muted);text-decoration:none;
    border:1px solid var(--line);padding:3px 9px;border-radius:20px;background:none;cursor:pointer}}
  .mkhead nav a:hover,.mkhead button:hover{{color:var(--accent);border-color:var(--accent)}}
  section{{margin:0 0 46px;scroll-margin-top:80px}}
  section>h2.mk{{font-size:15.5px;margin:0 0 4px;display:flex;align-items:center;gap:9px}}
  section>h2.mk .tag{{font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    color:var(--accent);background:var(--accent-soft);padding:2px 8px;border-radius:20px}}
  section>p.mk{{font-size:12.5px;color:var(--muted);margin:0 0 16px;max-width:78ch;line-height:1.55}}
  /* the modal, shown in place rather than over a scrim */
  .mkstage{{position:static;display:block;background:none;padding:0}}
  .mkstage .box{{max-height:none;margin:0 auto}}
  /* A · a subclass feature inside the shared spine */
  .mksub{{border-left:2px solid var(--accent);padding-left:9px;margin-left:-1px}}
  .mksubtag{{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
    color:var(--accent);background:var(--accent-soft);border-radius:6px;padding:0 5px;margin-left:2px}}
  .ctsub{{color:var(--accent)}}
  /* B · the subclass as its own band */
  .mkband{{margin-top:20px;border:1px solid var(--accent);border-radius:12px;
    background:var(--accent-soft);padding:12px 12px 14px}}
  .mkbandh{{display:flex;align-items:center;gap:9px;margin-bottom:10px}}
  .mkbandn{{font-family:var(--font);font-size:16px;font-weight:600;color:var(--accent)}}
  .mkbandk{{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}}
  /* C · paired columns */
  .mkpair{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}
  .mkcol{{min-width:0}}
  .mkcolh{{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
    color:var(--muted);padding-bottom:4px;margin-bottom:5px;border-bottom:1px solid var(--line)}}
  .mksubcol{{background:var(--accent-soft);border-radius:8px;padding:8px}}
  .mksubcol .mkcolh{{color:var(--accent);border-bottom-color:var(--accent)}}
  @media (max-width:720px){{.mkpair{{grid-template-columns:1fr}}}}
</style>
</head>
<body>
<div class="mkhead">
  <h1>Class ⊕ subclass, one modal</h1>
  <nav><a href="#a">A · one spine</a><a href="#b">B · two bands</a><a href="#c">C · paired rail</a></nav>
  <button id="th" type="button">flip theme</button>
</div>

<section id="a">
  <h2 class="mk">A · One spine, the subclass marked <span class="tag">recommended</span></h2>
  <p class="mk">One Features list in level order, class and subclass together, so “what do I get at
  level 6?” is one place. The subclass is told apart by an accent rule and its own tag, never by
  position — and the progression table’s Features column marks its entries the same way.
  Blends hardest; distinct by mark. Costs nothing at 375 and nothing on the fold model.</p>
  <div class="spmodal mkstage">{A}</div>
</section>

<section id="b">
  <h2 class="mk">B · Two bands</h2>
  <p class="mk">The class reads to its end, then the subclass arrives as its own tinted band with its
  own header and book tag. Distinct by container, which is the safest to read and the easiest to
  scan for “what does Evoker add” — but a level-6 question means looking in two places, and it
  repeats the “Features” header.</p>
  <div class="spmodal mkstage">{B}</div>
</section>

<section id="c">
  <h2 class="mk">C · Paired rail</h2>
  <p class="mk">One level spine, two columns inside it: the class on the left, the subclass on the
  right in its own tint. The most explicit about which half is which, and the only one that shows
  a level where the subclass gives nothing. Costs the most width — it collapses to one column
  under 720px, which is where the distinction it is built on disappears.</p>
  <div class="spmodal mkstage">{C}</div>
</section>

<script>
document.getElementById("th").onclick=()=>{{const r=document.documentElement;
  r.setAttribute("data-theme",r.getAttribute("data-theme")==="dark"?"light":"dark");}};
document.querySelectorAll(".entlvlh,.entsech,.entblkt").forEach(b=>{{
  b.onclick=e=>{{e.stopPropagation();
    const w=b.classList.contains("entblkt")?b.closest(".entblk"):b.parentElement;
    w.dataset.exp=w.dataset.exp==="1"?"0":"1";}};}});
document.querySelectorAll(".entfoldall").forEach(b=>{{
  b.onclick=e=>{{e.stopPropagation();const shut=b.dataset.all!=="1";b.dataset.all=shut?"1":"0";
    b.textContent=shut?"Expand all":"Collapse all";
    b.closest(".entblk").querySelectorAll(".entlvl").forEach(w=>w.dataset.exp=shut?"0":"1");}};}});
</script>
</body></html>
"""
out = os.path.join(os.path.dirname(__file__), "mockups", "class-subclass.html")
open(out, "w", encoding="utf-8").write(PAGE)
print("wrote", out, len(PAGE) // 1024, "KB")
