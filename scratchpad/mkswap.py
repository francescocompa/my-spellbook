#!/usr/bin/env python3
"""The level-up trade, re-drawn (his note, 2026-09-05).

Writes scratchpad/mockups/swap{0,1,2}.html — self-contained pages with the real stylesheet
inlined, so type, colour and spacing are the app's own wherever the file is opened. Each
carries its own dark/light switch. Nothing is wired.

His note, verbatim:

    "For swap cantrip/spells, we should revise the current system: they should not appear in
     the side rail unless a spell has been swapped inside the builder; the replacing should be
     more intuitive and follow the chip system of the spells, make a mockup"

Two things to choose between, and one that is settled either way:

  SETTLED — the rail. A trade nobody has made is not a decision the chain should carry. Both
  shapes drop the `SWAP A SPELL · to decide` rows from the rail and show a row only once a
  trade EXISTS. On a Warlock 9 that is 16 rail rows removed (two per level from 2 to 9).

  TO CHOOSE — how the trade is offered on the card. `swap1` makes it an optional SLOT, drawn
  in the empty-slot chip the pick sections already use; `swap2` keeps today's row of your
  tradeable spells but rebuilds it in the picks' own chip, with ⇄ where a pick has ✕.

`swap0` is TODAY, drawn from the same data so the three can be read against each other. It is
the baseline, not an option.

EVERY NODE HERE IS THE APP'S OWN (D164 — a mockup that does not use the real node is not a
mockup of what ships). The rail is `.locard.gclv` → `.lotop`/`.lobody` → `.gcsteps` →
`button.gcstep`; the card is `.gcard` → `.ghd`/`.ghsub`/`.gsec`/`.gsecb`; the chips are
`.cartchip` with its `.lv` badge, and `.cartchip.gslot` for a slot standing open. The only
new class in the whole file is `.gtrade`, the ⇄ button in swap2 — and it is styled off `.x`,
the ✕ it sits beside.

The build is the one from his screenshot: a Warlock 8 mid-walk, standing on the level 8
spellcasting step, with a trade already recorded at level 7.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "scratchpad", "mockups")

# ── the build, as the guide derives it ─────────────────────────────────────
# (level, class label, [(section label, value, status)]) — status: done · open · skipped
KNOWN = [("2", "Suggestion"), ("1", "Hex"), ("3", "Astral Flood"), ("2", "Battle Familiar"),
         ("3", "Hypnotic Pattern"), ("2", "Mirror Image"), ("1", "Armor of Agathys")]
CANTRIPS = [("C", "Blade Ward"), ("C", "Minor Illusion"), ("C", "Eldritch Blast")]
TRADED = ("Uncertain Footing", "Distorted Distance", 7)   # out, in, level


def chip(lv, name, action="x", cls=""):
    """The app's own pick chip. `action` is the control on its right: x · trade · none."""
    ctl = ""
    if action == "x":
        ctl = ('<button class="x ico xsm" aria-label="Drop it">'
               '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" '
               'stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>')
    elif action == "trade":
        ctl = ('<button class="x ico xsm gtrade" aria-label="Trade it away" '
               'title="Trade it away"><svg viewBox="0 0 16 16" fill="none" '
               'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" '
               'stroke-linejoin="round"><path d="M3 6h8l-2.5-2.5M13 10H5l2.5 2.5"/>'
               '</svg></button>')
    return (f'<span class="cartchip {cls}"><span class="lv">{lv}</span>'
            f'<span>{name}</span>{ctl}</span>')


def slot_chip(label, tip):
    """A slot standing open, in the pick sections' own dashed chip."""
    return (f'<button class="cartchip gslot" title="{tip}">'
            f'<span class="lv">⇄</span><span>{label}</span></button>')


def sec(label, body, count=None, optional=False):
    tag = ""
    if count is not None:
        tag = f'<span class="gcnt">{count}</span>'
    elif optional:
        tag = '<span class="gcnt">Optional</span>'
    return (f'<div class="gsec"><div class="gsech"><span class="gsecl">{label}</span>'
            f'{tag}</div>{body}</div>')


# ── the rail ───────────────────────────────────────────────────────────────
def rail(show_open_swaps, traded_rows):
    """`show_open_swaps` draws today's `to decide` rows; `traded_rows` the ones that exist."""
    out = []
    for lv in range(1, 10):
        rows = []
        if lv == 7:
            rows.append(("Spell", "Zone of Amicability", "done"))
            if traded_rows:
                rows.append(("Swap a spell", f"− {TRADED[0]} + {TRADED[1]}", "done"))
            elif show_open_swaps:
                rows.append(("Swap a spell", f"− {TRADED[0]} + {TRADED[1]}", "done"))
            if show_open_swaps:
                rows.append(("Swap a cantrip", "skipped, still open", "skipped"))
            rows.append(("Eldritch Invocations", "Repelling Blast", "done"))
        elif lv == 8:
            rows.append(("Spell", "Hallucinatory Terrain", "done"))
            if show_open_swaps:
                rows.append(("Swap a spell", "to decide", "open"))
                rows.append(("Swap a cantrip", "to decide", "open"))
        cur = " gcopen" if lv in (7, 8) else ""
        body = ""
        if rows:
            items = "".join(
                f'<button class="gcstep {st}"><span class="gck">'
                f'<span class="gcl">{lab}</span><span class="gcv">{val}</span></span>'
                f'<span class="gcs"></span></button>' for lab, val, st in rows)
            body = f'<div class="lobody"><div class="gcsteps">{items}</div></div>'
        out.append(
            f'<div class="locard gclv{cur}"><div class="lotop">'
            f'<span class="lolv">L{lv}</span><b class="locls">Warlock {lv}</b>'
            f'<span class="gcsev"></span><span class="lvlcar{" up" if cur else ""}"></span>'
            f'</div>{body}</div>')
    return '<div class="mkrail">' + "".join(out) + "</div>"


# ── the card, three ways ───────────────────────────────────────────────────
def card_today():
    known = "".join(f'<button class="gtchip"><span class="lv">{lv}</span>'
                    f'<span class="gtn">{n}</span></button>' for lv, n in KNOWN)
    cant = "".join(f'<button class="gtchip"><span class="lv">{lv}</span>'
                   f'<span class="gtn">{n}</span></button>' for lv, n in CANTRIPS)
    body = (
        '<div class="gsecb">' + chip("4", "Hallucinatory Terrain") + '</div>'
        + sec("Swap a spell",
              '<div class="gsecb"><div class="grhint">Warlock trades into level 1–4 here.</div>'
              f'<div class="gtchips">{known}</div></div>', optional=True)
        + sec("Swap a cantrip", f'<div class="gsecb"><div class="gtchips">{cant}</div></div>',
              optional=True))
    return gcard(body)


def card_slot():
    body = (
        '<div class="gsecb">' + chip("4", "Hallucinatory Terrain") + '</div>'
        + sec("Trade", '<div class="gsecb"><div class="gchips">'
              + slot_chip("Trade a spell",
                          "Give up one spell you already know for another, level 1–4")
              + slot_chip("Trade a cantrip", "Give up one cantrip you already know")
              + '</div></div>', optional=True))
    return gcard(body)


def card_chips():
    known = "".join(chip(lv, n, "trade") for lv, n in KNOWN)
    cant = "".join(chip(lv, n, "trade") for lv, n in CANTRIPS)
    body = (
        '<div class="gsecb">' + chip("4", "Hallucinatory Terrain") + '</div>'
        + sec("Trade a spell",
              '<div class="gsecb"><div class="grhint">Warlock trades into level 1–4 here.</div>'
              f'<div class="gchips">{known}</div></div>', optional=True)
        + sec("Trade a cantrip", f'<div class="gsecb"><div class="gchips">{cant}</div></div>',
              optional=True))
    return gcard(body)


def card_done():
    """What a level that HAS traded reads as, in both new shapes: one chip, like a pick."""
    body = ('<div class="gsecb">' + chip("2", "Zone of Amicability") + '</div>'
            + sec("Traded", '<div class="gsecb"><div class="gchips">'
                  + f'<span class="cartchip"><span class="lv">2</span>'
                    f'<span>{TRADED[0]} → {TRADED[1]}</span>'
                    '<button class="x ico xsm" aria-label="Undo the trade">'
                    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" '
                    'stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/>'
                    '</svg></button></span>'
                  + '</div></div>'))
    return gcard(body, lv=7, title="Spellcasting", sub="L7 · Warlock")


def gcard(body, lv=8, title="Spellcasting", sub="L8 · Warlock"):
    return (f'<div class="gcard"><div class="ghd"><b class="ghdt">{title}</b>'
            f'<span class="gcnt">1 of 1 answered</span></div>'
            f'<p class="ghsub">{sub}</p>{body}</div>')


PAGES = {
    "swap0": dict(
        title="0 · today",
        note="The baseline, drawn from the same build so the three read against each other. "
             "The rail carries a row per trade per level whether or not one was made — on a "
             "Warlock 9 that is sixteen rows saying <i>to decide</i> about a question most "
             "characters never answer. On the card the trade has its own chip (<code>.gtchip"
             "</code>), which is not the chip a pick uses, so the two read as different kinds "
             "of thing when they are both “a spell in this build”.",
        rail=rail(True, False),
        cards=card_today()),
    "swap1": dict(
        title="1 · the trade is a slot",
        note="A trade is an optional SLOT, drawn in the same dashed chip a pick slot standing "
             "open already uses. Nothing lists your spells until you ask: clicking the slot "
             "opens the picker on <b>which one are you giving up</b>, then on its replacements "
             "— the two-step the trade already is, in one surface. Once traded the slot becomes "
             "a filled chip (below), and only then does the rail carry a row. The card stays "
             "the same height whether you trade or not.",
        rail=rail(False, True),
        cards=card_slot() + card_done()),
    "swap2": dict(
        title="2 · the trade is a chip, like every other spell",
        note="Closest to today, and the literal reading of his note. The tradeable spells stay "
             "on the card, but they are the PICKS' chip — same level badge, same shape, same "
             "hover — with ⇄ where a pick carries ✕. One chip language for every spell in the "
             "build, and the action is the only thing that differs. The rail rule is the same "
             "as shape 1: nothing until a trade exists.",
        rail=rail(False, True),
        cards=card_chips() + card_done()),
}

EXTRA_CSS = """
body{margin:0;padding:22px 26px 60px;background:var(--bg)}
h1{font:600 15px/1.3 var(--sans);margin:0 0 4px}
p.note{font-size:12.5px;color:var(--muted);margin:0 0 20px;max-width:78ch;line-height:1.55}
p.note code{font-size:11.5px;background:var(--panel-2);padding:1px 4px;border-radius:4px}
.mkwrap{display:grid;grid-template-columns:300px minmax(0,1fr);gap:22px;align-items:start}
.mkrail{display:flex;flex-direction:column;gap:8px}
.mkband{position:fixed;right:10px;top:10px;z-index:9;display:flex;align-items:center;gap:8px;
  font:600 11px/1.4 var(--sans);background:var(--panel-2);border:1px solid var(--line);
  border-radius:8px;padding:6px 10px;color:var(--muted)}
.mkcards{display:flex;flex-direction:column;gap:16px}
.mkcap{font:600 10.5px/1.4 var(--sans);letter-spacing:.08em;text-transform:uppercase;
  color:var(--muted);margin:26px 0 8px}
/* the ⇄ that replaces ✕ on a tradeable chip — styled off `.x`, which it sits in place of */
.cartchip .gtrade{color:var(--gold)}
.cartchip .gtrade:hover{background:var(--gold-soft)}
"""

SHELL = """<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Trade · {title}</title>
<style>
{app_css}
</style>
<style>{extra}</style></head><body>
<h1>The level-up trade — {title}</h1>
<p class="note">{note}</p>
<div class="mkwrap"><div><div class="mkcap">chain rail</div>{rail}</div>
<div><div class="mkcap">the step you are standing on</div>
<div class="mkcards">{cards}</div></div></div>
<div class="mkband">{title}<button class="btn tiny" id="mktheme">Light</button></div>
<script>
var r=document.documentElement,b=document.getElementById("mktheme");
b.onclick=function(){{var d=r.dataset.theme==="dark";r.dataset.theme=d?"light":"dark";
  b.textContent=d?"Dark":"Light";}};
</script>
</body></html>"""


def main():
    app_css = open(os.path.join(ROOT, "src", "styles.css"), encoding="utf-8").read()
    assert "</style" not in app_css.lower(), "styles.css contains </style"
    os.makedirs(OUT, exist_ok=True)
    for name, p in PAGES.items():
        html = SHELL.format(app_css=app_css, extra=EXTRA_CSS, title=p["title"],
                            note=p["note"], rail=p["rail"], cards=p["cards"])
        path = os.path.join(OUT, name + ".html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"wrote {path} ({os.path.getsize(path)//1024} KB)")


if __name__ == "__main__":
    main()
