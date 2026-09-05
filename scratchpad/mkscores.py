#!/usr/bin/env python3
"""Three shapes for the ability-score block (his six notes on N1, 2026-09-05).

Writes scratchpad/mockups/scores.html — one SELF-CONTAINED page, the real stylesheet inlined,
three variants of the same block side by side at the Character card's width, each with the
same data: a Wizard 4 / Paladin 1, Int 15 base, origin +2 Int +1 Cha, the ASI at 4 spent as
+1 Int +1 Cha, one custom +1 Con ("Manual of Bodily Health"). Main abilities read off the
classes' `traits.primary` (Int · Str · Cha), save proficiencies off the FIRST class (Int · Wis).

What every variant shares (the notes that need no choosing): the ⋯ menu in the label line,
the main-ability tint, the save mark, no note beside the label, no line under the block.
What differs is WHERE the origin bonus and the breakdown live — the one call to make.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scratchpad", "mockups")
APP_CSS = open(os.path.join(ROOT, "src", "styles.css"), encoding="utf-8").read()
assert "</style" not in APP_CSS.lower()

AB = ["str", "dex", "con", "int", "wis", "cha"]
SHORT = {"str": "STR", "dex": "DEX", "con": "CON", "int": "INT", "wis": "WIS", "cha": "CHA"}
FULL = {"str": "Strength", "dex": "Dexterity", "con": "Constitution", "int": "Intelligence",
        "wis": "Wisdom", "cha": "Charisma"}
BASE = {"str": 10, "dex": 14, "con": 13, "int": 15, "wis": 12, "cha": 13}
ORIGIN = {"int": 2, "cha": 1}
ASI = {"int": 1, "cha": 1}
CUSTOM = {"con": 1}
MAIN = {"int", "str", "cha"}
SAVES = {"int", "wis"}

def tot(a): return BASE[a] + ORIGIN.get(a, 0) + ASI.get(a, 0) + CUSTOM.get(a, 0)
def mod(v): m = (v - 10) // 2; return ("+" if m >= 0 else "−") + str(abs(m))

def savemark(a):
    if a not in SAVES: return ""
    return ('<span class="absave" title="Saving throw proficiency — from Wizard, your first class" '
            'aria-label="Saving throw proficiency"></span>')

def chip(a):
    return f'<span class="abhead"><span class="abchip {a}">{SHORT[a]}</span>{savemark(a)}</span>'

def menu(open_=True):
    items = [
        ("colhead", "Fill scores"),
        ("mopt", "Standard array <span class=\"mk-r\">15 14 13 12 10 8</span>"),
        ("mopt", "Point buy <span class=\"mk-r\">27 points</span>"),
        ("mopt on", "Type them <span class=\"mk-r\">default</span>"),
        ("mopt", "Roll <span class=\"mk-r\">4d6 drop lowest</span>"),
        ("colhead", "Roll formula"),
        ("mopt", "<input class=\"mk-inp\" value=\"4d6dl1\"> <span class=\"mk-r\">or 3d6 · 2d6+6</span>"),
        ("colhead", "Scores"),
        ("mopt", "Swap two scores"),
        ("mopt", "Copy as text"),
        ("mopt danger", "Clear all scores"),
    ]
    rows = "".join(f'<div class="{c}">{t}</div>' for c, t in items)
    return f'<div class="menupop mk-open">{rows}</div>' if open_ else ""

def label(title, with_menu):
    m = ('<span class="mk-menuwrap"><button class="btn tiny mk-dots" aria-label="Score options">⋯</button>'
         + (menu() if with_menu else "") + '</span>')
    return f'<div class="mk-lbl"><label class="fld">{title}</label>{m}</div>'

# ── A · tiles read the total; the rows under them are where you edit ─────────
def variant_a():
    tiles = "".join(
        f'<div class="abscore mk-a {a}{" main" if a in MAIN else ""}">{chip(a)}'
        f'<span class="mk-big">{tot(a)}</span><span class="abtot">{mod(tot(a))}</span></div>' for a in AB)
    def row(name, vals, kind):
        cells = ""
        for a in AB:
            v = vals.get(a, 0)
            if kind == "base":
                cells += f'<td><input class="mk-cell" value="{v}"></td>'
            elif kind == "origin":
                cells += f'<td><button class="mk-pill{" on "+a if v else ""}">{"+"+str(v) if v else "·"}</button></td>'
            else:
                cells += f'<td class="mk-num">{"+"+str(v) if v else ""}</td>'
        return f'<tr><th>{name}</th>{cells}</tr>'
    rows = (row("Base", BASE, "base") + row("Origin", ORIGIN, "origin")
            + row("ASI · L4", ASI, "ro") + row("Manual of Bodily Health", CUSTOM, "ro"))
    tbl = (f'<table class="mk-tbl"><tbody>{rows}</tbody></table>'
           '<button class="btn tiny mk-add">+ Add a bonus</button>')
    return f'<div class="fieldset">{label("Ability scores", False)}<div class="abscores">{tiles}</div>{tbl}</div>'

# ── B · the tiles as they are, minus the cycler; a disclosure holds the rest ─
def variant_b():
    tiles = "".join(
        f'<div class="abscore mk-b {a}{" main" if a in MAIN else ""}">{chip(a)}'
        f'<input value="{BASE[a]}"><span class="abtot">{tot(a)} ({mod(tot(a))})</span></div>' for a in AB)
    parts = [("Origin", ORIGIN, True), ("Ability Score Improvement · L4", ASI, False),
             ("Manual of Bodily Health", CUSTOM, False)]
    lines = ""
    for name, vals, edit in parts:
        cells = " ".join(f'<span class="abchip {a}">{SHORT[a]}</span> +{v}' for a, v in vals.items())
        ctl = '<button class="btn tiny">Assign</button>' if edit else '<button class="btn tiny mk-ghost">✕</button>'
        lines += f'<div class="mk-line"><span class="mk-who">{name}</span><span class="mk-what">{cells}</span>{ctl}</div>'
    disc = (f'<details class="mk-disc" open><summary>Breakdown <span class="mk-r">origin · 1 feat · 1 bonus</span></summary>'
            f'{lines}<button class="btn tiny mk-add">+ Add a bonus</button></details>')
    return f'<div class="fieldset">{label("Ability scores", False)}<div class="abscores">{tiles}</div>{disc}</div>'

# ── C · one tile carries its parts; tapping it opens the ability's own sheet ─
def variant_c():
    def parts(a):
        ps = []
        if ORIGIN.get(a): ps.append(f'<i class="o">+{ORIGIN[a]}</i>')
        if ASI.get(a): ps.append(f'<i class="f">+{ASI[a]}</i>')
        if CUSTOM.get(a): ps.append(f'<i class="c">+{CUSTOM[a]}</i>')
        return '<span class="mk-parts"><i class="b">' + str(BASE[a]) + '</i>' + "".join(ps) + '</span>'
    tiles = "".join(
        f'<button class="abscore mk-c {a}{" main" if a in MAIN else ""}{" open" if a=="int" else ""}">{chip(a)}'
        f'<span class="mk-big">{tot(a)}</span><span class="abtot">{mod(tot(a))}</span>{parts(a)}</button>' for a in AB)
    sheet = ('<div class="mk-sheet"><div class="mk-sh"><span class="abchip int">INT</span> Intelligence '
             '<span class="mk-r">main · save</span></div>'
             '<div class="mk-line"><span class="mk-who">Base</span><input class="mk-cell" value="15"></div>'
             '<div class="mk-line"><span class="mk-who">Origin</span><span class="mk-what"><button class="mk-pill on int">+2</button> <button class="mk-pill">+1</button></span></div>'
             '<div class="mk-line"><span class="mk-who">Ability Score Improvement · L4</span><span class="mk-what">+1</span></div>'
             '<div class="mk-line"><span class="mk-who">Custom</span><span class="mk-what">—</span><button class="btn tiny mk-add">+ Add</button></div>'
             '<div class="mk-line mk-sum"><span class="mk-who">Total</span><span class="mk-what">18 (+4)</span></div></div>')
    return f'<div class="fieldset">{label("Ability scores", False)}<div class="abscores">{tiles}</div>{sheet}</div>'


# ── D · the tile is the control: clicking it opens THAT ability's popover ─────
def variant_d():
    def tile(a):
        return (f'<span class="mk-dwrap{" open" if a=="int" else ""}">'
                f'<button class="abscore mk-c {a}{" main" if a in MAIN else ""}{" open" if a=="int" else ""}">{chip(a)}'
                f'<span class="mk-big">{tot(a)}</span><span class="abtot">{mod(tot(a))}</span></button>'
                + (popover() if a == "int" else "") + '</span>')
    def popover():
        return ('<div class="menupop mk-pop"><div class="mk-sh"><span class="abchip int">INT</span> Intelligence '
                '<span class="mk-r">main · save</span></div>'
                '<div class="mk-line"><span class="mk-who">Base</span><input class="mk-cell" value="15"></div>'
                '<div class="mk-line"><span class="mk-who">Origin</span><span class="mk-what"><button class="mk-pill on int">+2</button> <button class="mk-pill">+1</button> <button class="mk-pill">·</button></span></div>'
                '<div class="mk-line"><span class="mk-who">Ability Score Improvement · L4</span><span class="mk-what">+1</span></div>'
                '<div class="mk-line"><span class="mk-who"><input class="mk-name" placeholder="Bonus name"></span><span class="mk-what"><input class="mk-cell" value="+0"></span></div>'
                '<div class="mk-line mk-sum"><span class="mk-who">Total</span><span class="mk-what">18 (+4)</span></div></div>')
    tiles = "".join(tile(a) for a in AB)
    return f'<div class="fieldset">{label("Ability scores", False)}<div class="abscores">{tiles}</div></div>'

# ── E · the card only READS; every edit happens in one modal ─────────────────
def variant_e():
    tiles = "".join(
        f'<div class="abscore mk-a {a}{" main" if a in MAIN else ""}">{chip(a)}'
        f'<span class="mk-big">{tot(a)}</span><span class="abtot">{mod(tot(a))}</span></div>' for a in AB)
    card = (f'<div class="fieldset">{label("Ability scores", False)}<div class="abscores">{tiles}</div>'
            '<button class="picksel mk-edit"><span class="lbl-ico">Edit scores</span><span class="pk-caret">⌄</span></button></div>')
    head = "".join(f'<th>{chip(a)}</th>' for a in AB)
    def row(name, vals, kind, cls=""):
        cells = ""
        for a in AB:
            v = vals.get(a, 0)
            if kind == "base": cells += f'<td><input class="mk-cell" value="{v}"></td>'
            elif kind == "origin": cells += f'<td><button class="mk-pill{" on "+a if v else ""}">{"+"+str(v) if v else "·"}</button></td>'
            elif kind == "edit": cells += f'<td><input class="mk-cell" value="{"+"+str(v) if v else ""}"></td>'
            elif kind == "tot": cells += f'<td class="mk-tot">{v} <span class="mk-r">{mod(v)}</span></td>'
            else: cells += f'<td class="mk-num">{"+"+str(v) if v else ""}</td>'
        return f'<tr class="{cls}"><th>{name}</th>{cells}</tr>'
    rows = (row("Base", BASE, "base") + row("Origin", ORIGIN, "origin")
            + row("Ability Score Improvement · L4", ASI, "ro")
            + row("<input class=\"mk-name\" value=\"Manual of Bodily Health\">", CUSTOM, "edit")
            + row("Total", {a: tot(a) for a in AB}, "tot", "mk-sum"))
    modal = ('<div class="mk-modal"><div class="mk-mh"><b>Ability scores</b><span class="mk-r">Wizard 4 / Paladin 1</span><button class="btn tiny mk-ghost">✕</button></div>'
             '<div class="mk-fill"><span class="mk-r">Fill</span><button class="cbtn">Standard array</button><button class="cbtn">Point buy <span class="mk-r">27</span></button><button class="cbtn on">Type</button><button class="cbtn">Roll 4d6dl1</button></div>'
             f'<table class="mk-tbl mk-etbl"><thead><tr><th></th>{head}</tr></thead><tbody>{rows}</tbody></table>'
             '<div class="mk-mf"><button class="btn tiny mk-add">+ Add a bonus</button><span class="mk-r">Swap two · Copy as text · Clear</span><button class="btn">Done</button></div></div>')
    return card, modal

CSS = """
.mk-grid{display:flex;flex-wrap:wrap;gap:26px 30px;align-items:flex-start}
.mk-col{width:340px}.mk-menucol{width:250px}.mk-ecol{flex:1 1 100%;max-width:1000px}
.mk-menucol .menupop.mk-open{position:static;box-shadow:none}
.mk-col h2{font:600 13px/1.3 var(--sans);margin:0 0 6px}
.mk-col p{font-size:12px;color:var(--muted);margin:0 0 10px;min-height:5.5em}
.card{width:340px;box-sizing:border-box}
.mk-lbl{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.mk-lbl .fld{margin:0}
.mk-menuwrap{position:relative}
.mk-dots{padding:0 7px;line-height:1.4;font-size:14px}
.menupop.mk-open{display:flex;top:calc(100% + 4px);min-width:230px}
.menupop .mopt{display:flex;justify-content:space-between;gap:10px;padding:5px 8px;border-radius:6px;font-size:12px}
.menupop .mopt.on{background:var(--accent-soft)}
.menupop .mopt.danger{color:var(--bad)}
.menupop .colhead{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:6px 8px 2px}
.mk-r{color:var(--muted);font-size:11px}
.mk-inp{width:70px;font:inherit;font-size:12px;padding:2px 5px;border:1px solid var(--line-strong);border-radius:6px;background:var(--panel-2);color:inherit}
/* the tile, shared */
.abhead{display:inline-flex;align-items:center;gap:3px}
.absave{width:6px;height:6px;border-radius:50%;border:1.5px solid currentColor;opacity:.75;color:var(--muted)}
.abscore.main{border-color:var(--ab-x);background:color-mix(in srgb,var(--ab-x) 12%,transparent)}
.abscore.main.str{--ab-x:var(--ab-str)}.abscore.main.dex{--ab-x:var(--ab-dex)}.abscore.main.con{--ab-x:var(--ab-con)}
.abscore.main.int{--ab-x:var(--ab-int)}.abscore.main.wis{--ab-x:var(--ab-wis)}.abscore.main.cha{--ab-x:var(--ab-cha)}
.mk-big{font-size:18px;font-weight:600;line-height:1.1}
/* A */
.mk-tbl{width:100%;border-collapse:collapse;margin-top:8px;font-size:11.5px}
.mk-tbl th{text-align:left;font-weight:500;color:var(--muted);padding:3px 4px 3px 0;white-space:nowrap;width:1%}
.mk-tbl td{text-align:center;padding:2px 1px}
.mk-tbl tr+tr td,.mk-tbl tr+tr th{border-top:1px solid var(--line)}
.mk-cell{width:34px;text-align:center;font:inherit;font-size:12px;padding:2px 0;border:1px solid var(--line-strong);border-radius:6px;background:var(--panel);color:inherit}
.mk-pill{font:inherit;font-size:11px;padding:1px 7px;border-radius:9px;border:1px solid var(--line);background:transparent;color:var(--muted);cursor:pointer}
.mk-pill.on{color:inherit;border-color:var(--ab-x);background:color-mix(in srgb,var(--ab-x) 14%,transparent)}
.mk-pill.on.int{--ab-x:var(--ab-int)}.mk-pill.on.cha{--ab-x:var(--ab-cha)}
.mk-num{color:var(--muted)}
.mk-add{margin-top:6px}
/* B */
.mk-disc{margin-top:8px;font-size:12px}
.mk-disc summary{cursor:pointer;color:var(--muted);display:flex;gap:8px;align-items:center}
.mk-line{display:flex;align-items:center;gap:8px;padding:5px 0;border-top:1px solid var(--line)}
.mk-disc .mk-line:first-of-type{margin-top:6px}
.mk-who{flex:1;min-width:0}
.mk-what{display:inline-flex;gap:6px;align-items:center;white-space:nowrap}
.mk-ghost{opacity:.6}
/* C */
.abscore.mk-c{cursor:pointer;font:inherit;color:inherit;text-align:center}
.abscore.mk-c.open{outline:2px solid var(--accent);outline-offset:1px}
.mk-parts{display:inline-flex;gap:2px;font-size:9.5px;line-height:1.2;color:var(--muted)}
.mk-parts i{font-style:normal;padding:0 2px;border-radius:4px}
.mk-parts i.o{color:var(--accent)} .mk-parts i.f{color:var(--good)} .mk-parts i.c{color:var(--gold)}
.mk-sheet{margin-top:8px;padding:8px 10px;border:1px solid var(--line-strong);border-radius:10px;background:var(--panel);font-size:12px}
.mk-sh{display:flex;gap:8px;align-items:center;font-weight:600;margin-bottom:2px}
.mk-sh .mk-r{margin-left:auto;font-weight:400}
.mk-sum{font-weight:600}
.mk-erow{display:flex;gap:16px;align-items:flex-start}
.mk-erow .card{flex:0 0 300px}
.mk-erow .mk-modal{flex:1;min-width:0}
/* D */
.mk-dwrap{position:relative;display:block;min-width:0}
.mk-dwrap .abscore{width:100%;box-sizing:border-box}
.menupop.mk-pop{display:block;left:-100px;right:auto;top:calc(100% + 6px);width:250px;font-size:12px;padding:8px 10px}
.mk-name{font:inherit;font-size:12px;padding:2px 5px;border:1px solid var(--line-strong);border-radius:6px;background:var(--panel-2);color:inherit;width:150px}
/* E */
.mk-edit{margin-top:8px}
.mk-modal{border:1px solid var(--line-strong);border-radius:12px;background:var(--panel);box-shadow:0 12px 34px #0005;padding:12px 14px;font-size:12px}
.mk-mh{display:flex;align-items:center;gap:10px;margin-bottom:8px}.mk-mh .mk-ghost{margin-left:auto}
.mk-fill{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-bottom:8px}
.mk-etbl th{color:inherit}.mk-etbl thead th{text-align:center;padding-bottom:4px}.mk-etbl thead th:first-child{width:auto}
.mk-etbl .mk-tot{font-weight:600}
.mk-mf{display:flex;align-items:center;gap:12px;margin-top:10px}.mk-mf .btn:last-child{margin-left:auto}
"""

SHELL = """<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ability scores · three shapes</title>
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
<h1>Ability scores · three shapes</h1>
<p class="note">Same build in all three: Wizard 4 / Paladin 1 · Int 15 base · origin +2 Int +1 Cha · the level-4 ASI spent +1 Int +1 Cha · a custom +1 Con. Shared by all three: the ⋯ menu in the label line (open in A to show it), main abilities tinted (Int · Str · Cha, from the classes), the save ring on Int and Wis (first class), no note beside the label, nothing under the block. The difference is where the origin bonus and the breakdown live.</p>
<div class="mk-grid">
<div class="mk-col"><h2>A · Tiles read, rows edit</h2><p>The tile is the total. Everything that makes it is a row under the tiles — base typed, origin assigned as pills, feats read-only, a custom bonus a row you add. Always visible: the breakdown is the block. Tallest of the three.</p><div class="card"><div class="body">{a}</div></div></div>
<div class="mk-col"><h2>B · Tiles as now, breakdown folded</h2><p>The base stays typed in the tile, the cycler is gone, the total reads under it. A disclosure under the block opens the parts: origin assigned there, each feat a line, custom bonuses added there. Closest to what shipped.</p><div class="card"><div class="body">{b}</div></div></div>
<div class="mk-col mk-menucol"><h2>The ⋯ menu</h2><p>Right-aligned in the label line, shared by all three. Fill method (typing is the default and the tiles never change shape with it), the roll formula editable, swap, copy, clear. Point buy shows its remaining points beside the label while it is the method.</p>{menu}</div>
<div class="mk-col"><h2>C · One tile, its own sheet</h2><p>The tile shows the total and, small, the parts that made it. Tapping an ability opens that ability's sheet below the row — base, origin, feats, custom — one score at a time. Densest; the six-wide row never grows.</p><div class="card"><div class="body">{c}</div></div></div>
<div class="mk-col"><h2>D · The tile is the control</h2><p>Nothing under the tiles. Clicking an ability opens its own popover, anchored to the tile: base, origin, feats read-only, a bonus you name, the total. One score at a time, the card never grows, and the popover is the app's own menu surface.</p><div class="card"><div class="body">{d}</div></div></div>
<div class="mk-col mk-ecol"><h2>E · The card reads, a modal edits</h2><p>The tiles are read-only on the card with one "Edit scores" button. The modal holds everything at once: the fill method, the six-column table with base, origin, every feat, named bonuses and totals, swap, copy, clear. The card stays the calmest of the five; editing costs a round trip.</p><div class="mk-erow"><div class="card"><div class="body">{e_card}</div></div>{e_modal}</div></div>
</div>
<div class="mkband">scores<button class="btn tiny" id="mktheme">Light</button></div>
<script>
var r=document.documentElement,b=document.getElementById("mktheme");
b.onclick=function(){{var d=r.dataset.theme==="dark";r.dataset.theme=d?"light":"dark";b.textContent=d?"Dark":"Light";}};
</script>
</body></html>"""

os.makedirs(OUT, exist_ok=True)
html = SHELL.format(app_css=APP_CSS, css=CSS, a=variant_a(), b=variant_b(), c=variant_c(), menu=menu(), d=variant_d(), e_card=variant_e()[0], e_modal=variant_e()[1])
with open(os.path.join(OUT, "scores.html"), "w", encoding="utf-8") as f:
    f.write(html)
print("wrote", os.path.join(OUT, "scores.html"))
