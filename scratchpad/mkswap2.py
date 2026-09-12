#!/usr/bin/env python3
"""The swap step, compressed (his note, 2026-09-12).

    "This screen takes up way too much vertical space, it should be reorganized and
     compressed, make a mockup to fix and ask feedback"

Writes scratchpad/mockups/swapc.html — ONE page, the baseline and four candidates side by
side at the same width, each measuring its own height in the browser and printing it in its
caption. Nothing is wired.

WHAT IS NOT ON THE TABLE. D188 is the model and it stays: the trade is TWO HALVES and
neither binds the other, either can be set first, and a half-made trade is a decision in
progress, never an error. Its own round already rejected the one-slot shape (`swap1`) and
the list-of-your-spells shape (`swap2`). So every candidate here keeps two independently
settable halves — what is being cut is the FRAME each half is wrapped in, not the shape.

WHERE THE HEIGHT GOES, at rest, on his L2 Warlock (nothing set, both trades optional):
each kind is a `.gsec` (border-top + 10px + 7px gap) holding a `.grhint` and then TWO MORE
`.gsec` halves, each with its own uppercase label, its own "not yet" count, its own 7px and
8px gaps — six section frames and four labels to offer two dashed chips. The labels also
say what the chips already say: "GIVING UP · not yet" sits directly above a chip reading
"− Trade one away".

EVERY NODE IS THE APP'S OWN (D164). The only new classes are `.gtrow`/`.gtrl` (an inline
row label, styled off `.gsecl` — same 10.5px uppercase muted) and `.gtopen` (c3's collapsed
opener, styled off `#addClass`/`.menupop .abadd`, D177/D193's dashed full-row add).
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scratchpad", "mockups")

HINT = "Warlock trades into level 1 here."

X = ('<button class="x ico xsm" aria-label="Undo"><svg viewBox="0 0 16 16" fill="none" '
     'stroke="currentColor" stroke-width="1.5" stroke-linecap="round">'
     '<path d="M4 4l8 8M12 4l-8 8"/></svg></button>')


def slot(label, glyph="−"):
    """A half standing open — the app's own dashed slot chip."""
    return (f'<button class="cartchip gslot"><span class="lv">{glyph}</span>'
            f'<span>{label}</span></button>')


def chip(lv, name):
    """A half that is set — the picks' own chip, so clicking opens the spell."""
    return (f'<span class="cartchip"><span class="lv">{lv}</span>'
            f'<span>{name}</span>{X}</span>')


def sec(label, body, tag="Optional"):
    t = f'<span class="gcnt">{tag}</span>' if tag else ""
    return (f'<div class="gsec"><div class="gsech"><span class="gsecl">{label}</span>{t}</div>'
            f'{body}</div>')


def half(label, tag, chipnode):
    """Today's half: a full section frame around one chip."""
    return (f'<div class="gsec"><div class="gsech"><span class="gsecl">{label}</span>'
            f'<span class="gcnt{" full" if tag == "1 of 1" else ""}">{tag}</span></div>'
            f'<div class="gsecb"><div class="gchips">{chipnode}</div></div></div>')


def trow(label, a, b):
    """An inline row: the kind's name, then its two halves on one line."""
    return (f'<div class="gtrow"><span class="gtrl">{label}</span>'
            f'<div class="gchips">{a}{b}</div></div>')


# the two halves, in whichever state
def halves(kind, state):
    out_lbl = "Trade one away"
    in_lbl = "Learn one instead"
    if kind == "cantrip":
        pass
    a = chip("1", "Hex") if state in ("out", "both") else slot(out_lbl)
    b = chip("1", "Bane") if state in ("in", "both") else slot(in_lbl, "+")
    return a, b


# ── the five bodies ────────────────────────────────────────────────────────
def c0(state="idle"):
    """TODAY. Two sections, each holding two more."""
    def block(kind, label, st, hint):
        a, b = halves(kind, st)
        body = '<div class="gsecb">'
        if hint:
            body += f'<div class="grhint">{HINT}</div>'
        body += half("Giving up", "1 of 1" if st in ("out", "both") else "not yet",
                     a if st in ("out", "both") else slot("Trade one away"))
        body += half("Learning instead", "1 of 1" if st in ("in", "both") else "not yet",
                     b if st in ("in", "both") else slot("Learn one instead", "+"))
        body += "</div>"
        return sec(label, body)
    st = "out" if state == "engaged" else "idle"
    return block("spell", "Swap a spell", st, True) + block("cantrip", "Swap a cantrip",
                                                            "idle", False)


def c1(state="idle"):
    """The halves lose their frames and share one line. Two sections stay."""
    def block(kind, label, st, hint):
        a, b = halves(kind, st)
        body = '<div class="gsecb">'
        if hint:
            body += f'<div class="grhint">{HINT}</div>'
        body += f'<div class="gchips">{a}{b}</div></div>'
        return sec(label, body)
    st = "out" if state == "engaged" else "idle"
    return block("spell", "Swap a spell", st, True) + block("cantrip", "Swap a cantrip",
                                                            "idle", False)


def c2(state="idle"):
    """One section for both kinds; the kind becomes an inline row label."""
    st = "out" if state == "engaged" else "idle"
    sa, sb = halves("spell", st)
    ca, cb = halves("cantrip", "idle")
    body = (f'<div class="gsecb"><div class="grhint">{HINT} Either half stands alone.</div>'
            + trow("Spell", sa, sb) + trow("Cantrip", ca, cb) + "</div>")
    return sec("Swap", body)


def c3(state="idle"):
    """c2, closed at rest. Once either half of either kind is set it opens and stays open."""
    if state == "idle":
        body = ('<div class="gsecb"><button class="gtopen">'
                '<span class="gtg">⇄</span> Trade a spell or a cantrip</button></div>')
        return sec("Swap", body)
    return c2(state)


def c4(state="idle"):
    """No frame at all: a footer line. Each kind is a text button that opens its two halves."""
    if state == "idle":
        return ('<div class="gfoot"><span class="gfl">Optional</span>'
                '<button class="gflink">Swap a spell</button><span class="gfsep">·</span>'
                '<button class="gflink">Swap a cantrip</button></div>')
    sa, sb = halves("spell", "out")
    ca, cb = halves("cantrip", "idle")
    return ('<div class="gfoot open"><div class="gfhead"><span class="gfl">Optional</span>'
            f'<span class="grhint">{HINT}</span></div>'
            + trow("Spell", sa, sb) + trow("Cantrip", ca, cb) + "</div>")


CANDS = [
    ("c0", "0 · today", "baseline",
     "Six section frames and four uppercase labels, to offer two dashed chips. "
     "<b>GIVING UP · not yet</b> sits directly above a chip that reads "
     "<b>− Trade one away</b> — the label says what the chip says.", c0),
    ("c1", "1 · the halves share a line", "",
     "The two halves keep their own chips but lose their section frames: "
     "<code>.gsec</code> × 4 and the four labels go, the chips carry the wording. "
     "Two sections stay, one per kind, so the Optional tag still reads per kind.", c1),
    ("c2", "2 · one section, a row per kind", "",
     "c1 plus: spell and cantrip are the same question twice, so they share one section "
     "and one hint. The kind becomes an inline row label instead of a section header.", c2),
    ("c3", "3 · closed at rest", "",
     "c2's body behind one dashed full-row opener (the score popover's Add, D177/D193) while "
     "nothing is set — which is the state nearly every level stands in. Setting either "
     "half opens it for good; it never re-closes over your answer.", c3),
    ("c4", "4 · a footer line, no frame", "",
     "The extreme: no section at all. A muted footer line under the card's real content, "
     "each kind a text button that opens its two halves in place. Costs one line at rest.",
     c4),
]


def card(body, tag=""):
    return ('<div class="gcard"><div class="ghd"><b class="ghdt">Spellcasting</b>'
            f'<span class="gcnt">0 of 3 answered</span></div>'
            f'<p class="ghsub">L2 · Warlock{tag}</p>{body}</div>')


def column(cid, title, note, fn, state):
    return (f'<div class="mkcol" data-id="{cid}">'
            f'<div class="mkcap">{title}<span class="mkh" data-for="{cid}-{state}"></span></div>'
            f'<div class="mkcard" id="{cid}-{state}">{card(fn(state))}</div>'
            f'<p class="mknote">{note}</p></div>')


EXTRA_CSS = """
body{margin:0;padding:22px 26px 70px;background:var(--bg)}
h1{font:600 16px/1.3 var(--sans);margin:0 0 6px}
p.lede{font-size:12.5px;color:var(--muted);margin:0 0 8px;max-width:96ch;line-height:1.55}
p.lede b{color:var(--ink)}
p.lede code{font-size:11.5px;background:var(--panel-2);padding:1px 4px;border-radius:4px}
.mkband{position:fixed;right:10px;top:10px;z-index:9;display:flex;align-items:center;gap:8px;
  font:600 11px/1.4 var(--sans);background:var(--panel-2);border:1px solid var(--line);
  border-radius:8px;padding:6px 10px;color:var(--muted)}
.mkrow{display:grid;grid-template-columns:repeat(auto-fit,640px);gap:18px 26px;align-items:start;
  margin:18px 0 0}
.mkcap{font:600 10.5px/1.4 var(--sans);letter-spacing:.06em;text-transform:uppercase;
  color:var(--muted);margin:0 0 7px;display:flex;align-items:baseline;gap:8px}
.mkh{margin-left:auto;font-weight:700;color:var(--accent);letter-spacing:0;font-size:11px}
.mkcol.win .mkh{color:var(--good)}
.mkcol[data-id="c0"] .mkh{color:var(--bad)}
.mkcard{align-self:start}
.mkcard .gcard{max-width:none;width:640px}  /* the card's own max-width, so heights are real */
.mknote{font-size:11.5px;color:var(--muted);line-height:1.5;margin:9px 0 0;max-width:640px}
.mknote b{color:var(--ink);font-weight:600}
.mknote code{font-size:10.5px;background:var(--panel-2);padding:1px 4px;border-radius:4px}
.mksec{font:600 11px/1.4 var(--sans);letter-spacing:.07em;text-transform:uppercase;
  color:var(--ink);margin:34px 0 0;padding-top:16px;border-top:1px solid var(--line)}
.mksub{font-size:12px;color:var(--muted);margin:5px 0 0;max-width:96ch;line-height:1.5}

/* ── the only new nodes in this round ─────────────────────────────────── */
/* an inline row label: the kind's name beside its two halves, not above them.
   Same type as `.gsecl` so it is not a new style, only a new position. */
.gtrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.gtrow .gtrl{flex:0 0 52px;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;
  color:var(--muted)}
/* c3's opener — the score popover's dashed full-row Add (#addClass, D177/D193) */
.gtopen{width:100%;padding:7px 10px;text-align:center;border:1px dashed var(--line-strong);
  border-radius:8px;background:transparent;color:var(--muted);font:inherit;font-size:12px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px}
.gtopen:hover{color:var(--ink);border-color:var(--accent)}
.gtopen .gtg{font-size:12px}
/* c4's footer line — bare, no box (D198's fourth size) */
.gfoot{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-top:9px;
  padding-top:9px;border-top:1px solid var(--line);font-size:11.5px;color:var(--muted)}
.gfoot.open{display:block}
.gfoot .gfhead{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}
.gfoot .gfl{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
.gfoot .gflink{border:none;background:none;padding:0;font:inherit;font-size:11.5px;
  color:var(--accent);cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.gfoot .gflink:hover{color:var(--ink)}
.gfoot .gfsep{color:var(--line-strong)}
.gfoot.open .gtrow{margin-top:7px}
"""

SHELL = """<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>The swap step, compressed</title>
<style>
{app_css}
</style>
<style>{extra}</style></head><body>
<h1>The swap step, compressed</h1>
<p class="lede">His note: <b>“this screen takes up way too much vertical space, it should be
reorganized and compressed.”</b> The step is his L2 Warlock, <b>nothing set and both trades
optional</b> — the state nearly every level stands in. <b>D188 is not on the table:</b> the
trade stays two halves, either can be set first, and a half-made trade is never an error.
What is cut is the frame each half is wrapped in. Heights are measured in the browser and
printed beside each caption.</p>
<div class="mkrow">{idle}</div>
<div class="mksec">…and once a trade is under way</div>
<p class="mksub">The same five with the spell's give-up half set and its replacement still
open — the state that has to keep reading as “a decision in progress”, not an error. A shape
that only wins at rest is not a win.</p>
<div class="mkrow">{engaged}</div>
<div class="mkband">swapc<button class="btn tiny" id="mktheme">Light</button></div>
<script>
var r=document.documentElement,b=document.getElementById("mktheme");
b.onclick=function(){{var d=r.dataset.theme==="dark";r.dataset.theme=d?"light":"dark";
  b.textContent=d?"Dark":"Light";}};
// each card measures itself, so the numbers in the screenshot are the real ones
document.querySelectorAll(".mkh").forEach(function(s){{
  var c=document.getElementById(s.dataset.for); if(!c)return;
  var h=Math.round(c.firstElementChild.getBoundingClientRect().height);
  var base=document.getElementById(s.dataset.for.replace(/^c\\d/,"c0"));
  var bh=base?Math.round(base.firstElementChild.getBoundingClientRect().height):h;
  s.textContent=h+"px"+(h<bh?"  −"+Math.round(100-h/bh*100)+"%":"");
  if(h<bh*0.6)s.closest(".mkcol").classList.add("win");
}});
</script>
</body></html>"""


def main():
    app_css = open(os.path.join(ROOT, "src", "styles.css"), encoding="utf-8").read()
    assert "</style" not in app_css.lower(), "styles.css contains </style"
    os.makedirs(OUT, exist_ok=True)
    idle = "".join(column(cid, t, note, fn, "idle") for cid, t, _s, note, fn in CANDS)
    eng = "".join(column(cid, t, "", fn, "engaged") for cid, t, _s, _n, fn in CANDS)
    html = SHELL.format(app_css=app_css, extra=EXTRA_CSS, idle=idle, engaged=eng)
    path = os.path.join(OUT, "swapc.html")
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"wrote {path} ({os.path.getsize(path)//1024} KB)")


if __name__ == "__main__":
    main()
