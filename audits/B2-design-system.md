# B2 — the design system in code

Auditor B2, pillar B (design), static read. Scope: `src/styles.css` (2491 lines, three theme
blocks), `src/index.html` (738 lines), and the render functions in `src/app.js` (10159 lines)
that emit markup. No browser was opened for this report (B1's pillar); every claim below is
grounded in the file and line cited next to it. No L0 dead-CSS sweep existed yet at the time of
this read (`audits/L0-sweeps.md` was absent), so nothing here duplicates it — a few dead-selector
spot-checks turned up incidentally are marked as such, not as a substitute for that sweep.

Grounding read before this report: CLAUDE.md; D157 (charter, read from `main` — this worktree
branched before it landed); D145 (light theme), D146 (empty slots), D147–D152 (detail layouts,
quiet floor, alert plate), D57 (icons), D24b (sub-heading style); every `Rejected:` clause
surfaced by grep in the D145–D152 range; GOTCHAS.md in full (777 lines).

---

## 1. Token inventory

Every custom property lives in three parallel blocks per palette (light `:root`, the
`prefers-color-scheme:dark` media block, and `:root[data-theme=dark]`), plus a fourth restatement
for print (`:root:not([data-print="dark"])` and `:root[data-print="dark"]`, `styles.css:1682–1701`).
The three screen blocks are always kept in lockstep — every token below appears in the same three
places with the same shape; none is defined in only one. Usage counts are literal `var(--x)`
occurrences (`grep -o`), so a token used only through `color-mix(in srgb,var(--x) …)` still counts.

### Core palette (`styles.css:11–37`)

| token | role | dark | light | css uses | app.js uses |
|---|---|---|---|---|---|
| `--bg` | page ground | `#17140f` | `#eee8da` | 20 | 0 |
| `--panel` | card/modal surface | `#211d16` | `#fffdf8` | 42 | 0 |
| `--panel-2` | recessed surface | `#2a251c` | `#f2ecdf` | 57 | 0 |
| `--ink` | primary text | `#ece4d6` | `#241f1a` | 64 | 2 (inline `style=`, see §4) |
| `--muted` | secondary text, quiet floor (D151) | `#a99e8d` | `#635b53` | 230 | 4 |
| `--line` | hairline border | `#3a3225` | `#b2aca1` | 87 | 0 |
| `--line-strong` | control border | `#4c4130` | `#8c8478` | 79 | 0 |
| `--accent` | brand / selected state | `#d9915f` | `#8d4a2a` | 168 | 2 |
| `--accent-soft` | accent wash | `#d9915f1f` | `#8d4a2a1c` | 42 | 0 |
| `--gold` | secondary semantic (cast/limited) | `#d4ad5a` | `#725921` | 40 | 1 |
| `--gold-soft` | gold wash | `#d4ad5a1c` | `#7259211c` | 9 | 0 |
| `--good` | success / free-cast semantic | `#7fbb8c` | `#3b6546` | 42 | 2 |
| `--good-soft` | good wash | `#7fbb8c18` | `#3b65461c` | 12 | 0 |
| `--free` | "trade/swap" semantic | `#a6a1e6` | `#57549c` | 35 | 0 |
| `--free-soft` | free wash | `#a6a1e618` | `#57549c1c` | 10 | 0 |
| `--bad` | error/over-budget semantic | `#f0616e` | `#ad2335` | 59 | 1 |
| `--bad-soft` | bad wash | `#f0616e1c` | `#ad23351c` | 13 | 0 |
| `--radius` | card corner | `12px` (theme-independent) | | 2 | 0 |
| `--shadow` | card elevation | 2-layer (dark) | 3-layer (light, D145b) | 4 | 0 |
| `--font` | display serif stack | theme-independent | | 24 | 0 |
| `--sans` | UI sans stack | theme-independent | | 14 | 0 |

### Ability / highlight palette (`styles.css:1076–1092`, D142(b)/D145)

| token | role | dark | light | css uses |
|---|---|---|---|---|
| `--ab-str`…`--ab-cha` (6) | ability-colour chips (D71 convention) | `#e98a8a`…`#ea82ba` | `#922b21`…`#7e385e` | 5 each |
| `--cc-dice` | inline highlight, dice terms | `#6bb6e6` | `#2b7bb0` | 1 |
| `--cc-dc` | inline highlight, DC/save terms | `#e7c070` | `#a9791f` | 2 |
| `--cc-dmg` | inline highlight, damage terms | `#e06a6a` | `#c0392b` | 1 |
| `--cc-cond` | inline highlight, condition terms | `#b48ce6` | `#7b4fb0` | 1 |
| `--cc-range` | inline highlight, range terms | `#4db6ac` | `#2a8f86` | 1 |

**32 custom properties total.** None has zero uses (so §9's trivial-fix bar — a dead token with
zero uses and no mention anywhere — has no candidate; see §9).

**Flagged:**
- **`--mono` is referenced but never defined (`styles.css:99`)** — `footer.credit .appver` reads
  `font-family:var(--mono,ui-monospace,monospace)`. No theme block sets `--mono` anywhere in the
  file, so the fallback always wins; the `var()` indirection is inert. Not a visible bug (the
  fallback is a reasonable monospace stack) but it reads as an unfinished token — either bind it
  to a real mono stack or drop the indirection and write the fallback stack directly.
- **`--cc-*` and `--ab-*` are not restated in the print blocks** — see §5.
- **The light theme's semantic ink tokens are equal-luminance by construction, not by accident.**
  Computing WCAG relative luminance from the literal hex values: `--muted`, `--accent`, `--gold`,
  `--good`, `--free`, `--bad` all land at L≈0.103–0.108 in light mode (within 0.005 of each
  other) — this is D145(a)'s method working as designed (every ink derived to the same contrast
  floor against every surface), not a near-duplicate defect, and it means these six tokens are
  told apart by hue alone, never by lightness. Dark mode does not repeat this: `--accent`
  (L=0.358) and `--gold` (L=0.446) sit far enough apart that hue and lightness both help. Worth
  recording so a future auditor doesn't mistake the light-mode clustering for a mistake and
  "fix" it by spreading the lightnesses — that would undo D145(a).
- **No near-duplicate token pair exists** in either theme once the deliberate light-mode
  clustering above is accounted for; the closest unintentional pair is dark `--muted` vs
  `--accent` (ΔL=0.010), which is still visually distinct by hue (warm grey vs orange).

---

## 2. Hard-coded values

Counted by literal-value grep across `styles.css` (declarations, not selectors).

| kind | declarations | distinct literal values | tokenized alternative |
|---|---|---|---|
| `font-size` | ~365 | 26 (6.5px…23px, including 12 half-pixel steps) | none — no `--fs-*` scale exists |
| `border-radius` | ~150 | ~15 (2px…20px, plus `50%`, `99px`, mm print values) | `--radius` (12px), used **twice** (`.card`, `.gcard`) |
| `gap` | ~180 | ~15 (0…22px, nearly every integer 1–12 used) | none |
| `box-shadow` (one-off, not `var(--shadow)`) | 7 | 5 distinct recipes | `--shadow` exists, unused by these 7 |
| `z-index` | 16 | 12 distinct values (2…95) | none — no `--z-*` scale |
| hex colour outside a token definition | 8 | `#0007`,`#0006`,`#0005`,`#000` (mask gradients) | n/a — these are overlay/mask opacities, not palette colours |

**Worst clusters:**

- **`z-index`, whole file, no token.** 16 declarations, values `2, 2, 2, 3, 6, 40, 40, 45, 50, 55,
  70, 75, 80, 90, 90, 95` (`styles.css:291,365,447,476,517,527,531,799,925,1023,1595,1912,1945,
  2010,2386,2424`). Read together they form a real, coherent layering (sticky headers 2–6, popovers
  40, guided-builder page 45, `.modal` 50, jump bar 55, `.spmodal` 70, `.modal.over` 75 — the raised
  picker from D149(e) — `.prqpop` 80, `.bswmenu`/`.sptip` 90, `.appnotice` 95) but it exists only as
  tribal knowledge spread across 16 sites; nothing enforces it and nothing documents the whole
  ladder in one place. The one time this mattered (D149(e), stacking a picker over `.spmodal`) the
  fix was a bespoke `.modal.over{z-index:75}` rule rather than a slot in a maintained scale.
- **`box-shadow`, five one-off overlay recipes never routed through `--shadow`:**
  `.modal .box` → `0 20px 60px #0006` (`292`); `.menupop` → `0 12px 34px #0005` (`365`); `.sptip` →
  `0 14px 40px #0006` (`517`); `.spmodal .box` → `0 24px 70px #0007` (`528`); `.prqpop` →
  `0 16px 44px #0007` (`1024`). All five are the same *kind* of shadow (a floating-surface
  elevation, darker/larger than the card shadow) with no shared variable — a `--shadow-float`
  token would collapse five near-identical declarations into one.
- **`font-size`, the spell-modal/tooltip block (`styles.css:517–670`).** In roughly 150 lines the
  block uses 20px, 16px, 14px, 13px, 12.5px, 12px, 11.5px, 11px, 10.5px, 10px, 9.5px, 9px — twelve
  distinct sizes with no naming, several of them half-pixel apart (`12px` vs `12.5px` vs `13px`
  within the same component). The chip/menu block at `163–360` repeats the pattern (16px pill
  radius beside 6–10px ones, 10–13px type in adjacent rules).
- **`gap`/spacing, same two blocks.** Every integer from 1px to 12px appears as a `gap` value
  somewhere; there is no 4px/8px rhythm to point to — spacing is tuned per component, not drawn
  from a scale.

**Proposed normalisation (not applied — D157(e) reserves structural change to findings, and this
crosses component boundaries):**
- Add `--shadow-float` (`0 var(--sf-y) var(--sf-blur) color-mix(in srgb, black 38%, transparent)`
  or similar) and point the five floating-surface shadows at it.
- Add a documented `--z-*` scale (sticky / popover / page-overlay / modal / raised-modal / toast)
  and migrate the 16 literal z-indexes onto it — mechanical, but touches 12 selectors, so it is
  M-sized, not a trivial fix.
- A `--radius-sm`/`--radius-lg` pair (the file already clusters around ~7–8px for tight controls
  and ~10–14px for cards/modals) would absorb most of the 150 literal radii without renaming
  every component.
- Font-size and spacing are scatters wide enough (26 and 15 distinct values respectively) that a
  scale retrofit is a genuine design pass, not a mechanical rename — flagged in §8, not proposed
  as a normalisation list here.

---

## 3. Scales, as actually used

| scale | distinct values (sorted) | verdict |
|---|---|---|
| breakpoints | 400, 520, 560, 620, 640, 820, 920/921px | **mostly a scale.** 920/921 is a deliberate max/min pair for one logical breakpoint (`.layout` two-column collapse). 620 is the main phone breakpoint (header/tabs/modal). 560 and 640 are each single-purpose (`.appnotice`/`.libtray` width; `.tlbox`/`.ghead` height) and sit close enough to 620 that a reader has to check which one applies to a given component — not wrong, but not documented as a system either. |
| z-index | 2,3,6,40,45,50,55,70,75,80,90,95 | **a real scale, undocumented** (see §2). |
| border-radius | 2,3,4,5,6,7,8,9,10,12,14,16,20px + `50%`,`99px` | **scatter.** Near-every integer 2–20 is in use; `--radius` covers exactly 2 of ~150 declarations. |
| font-size | 6.5–23px in 0.5px steps, 26 distinct values | **scatter.** No modular scale, no clamp/rem step; values read as "whatever looked right for that label." |
| gap/spacing | 0–22px, ~15 distinct values, mostly 1px apart | **scatter.** No 4/8 rhythm. |
| shadow | `--shadow` (2 uses) + 5 one-off floating recipes | **two families that should be one scale** (card elevation vs floating-surface elevation), neither fully tokenized. |
| the core palette itself | 17 tokens × 2 themes, each independently contrast-solved (D145) | **a genuine, well-documented scale** — the one place in the file where "scale" is the right word without qualification. |

---

## 4. Component inventory

### Buttons
- `.btn` (`styles.css:113`) — base, `.on` (selected/toggled), `.tiny`, `.busy` (spinner via
  `::before`, `--line-strong`→`--accent` conic border, reduced-motion guarded), `.srctoggle`
  (+`.on`), `.gh-toggle` (phone-only, display fight documented in GOTCHAS/`styles.css:1986–1990`),
  `.gbig` (guide's large CTA). States covered: `:hover` (accent border+text), `.on`, `:disabled`
  is **not styled at the `.btn` level at all** — the file's own comment admits it twice
  (`styles.css:511,2200`: "there is no global `.btn:disabled` look"); every disabled button either
  gets a scoped opacity rule (`#addClass:disabled`, `#gpickModal .mf .btn:disabled`) or nothing.
  `:focus-visible` is likewise not styled on `.btn` itself — only specific instances
  (`.bswmain:focus-visible`, `.abtile:focus-visible`, `.gcstep:focus-visible`) opt in; a plain
  `.btn` falls back to the UA default outline, which is inconsistent with everything else in the
  file being deliberately re-skinned.
- **`.btn.danger` has no CSS rule at any specificity that gives it a red/warning look.**
  Used at `index.html:396` (`#libSelRemove`) and `:600` (`#csrcDelete`); the only `.danger` rules
  in the file are scoped to `.menupop button.danger` (`styles.css:368`) and `.bswmi.danger:hover`
  (`452`). A plain `.btn.danger` renders identically to any other `.btn` until `armConfirm()`
  adds `.armed` on the first click (`.armed{background:var(--bad-soft);border-color:var(--bad);
  color:var(--bad)}`, `styles.css:371`). So the two library/custom-source delete buttons carry no
  visual "this is destructive" signal before the user has already clicked once — the two-step
  confirm (GOTCHAS: native `confirm()` banned, `armConfirm` required) still protects against an
  accidental commit, but the pre-arm state is silently identical to a neutral button. `#resetBtn`
  (`index.html:63`) is the one `.danger` button that *does* render red, because it happens to sit
  inside a `.menupop`.

### Chips / badges
- **`.bchip`** (book-source tag, D147/D148 — "the book is the tag alone") — one CSS component
  (`styles.css:915`), but **built inline at four separate call sites in app.js** instead of one
  shared helper: `entSpellModalHTML` (`app.js:8150`), `creatureModalHTML` (`8283`), `openFeatureModal`
  (`8673`), each hand-writing
  `` `<span class="bchip" data-book="${esc(src)}"${page?...}>${esc(src)}</span>`` ``, while
  `entModalHTML`'s neighbour `bkTag` (`8567`) is the one place this was actually factored into a
  const. Four implementations of one 2-line template is a clear **consolidation candidate — size
  S** (extract `bkTag`'s shape to module scope, point all four call sites at it; the four already
  produce byte-identical markup, so there is no behaviour question, only a reuse one).
- **`.srcbadge`** (D39: names who *grants* the spell in your build, not the book — see the
  GOTCHAS entry contrasting it with `.bchip`) — one emission site, `app.js:6379`, correctly
  distinct from `.bchip` in both meaning and markup.
- **`.abchip`** (ability-colour chip, D142(b)) — `abChip()` helper at `app.js:7688` plus one
  inline duplicate inside the stat-block ability table (`app.js:3365`, `8076`) that builds the
  same `<span class="abchip ${k}">` shape without calling the helper. Minor duplication, size S.
- **`.savechip`** — required-defence chip, three emission sites (`app.js:6046-6047`, `9909-9910`),
  not routed through `abChip()` even though it shares the same ability-colour classes and CSS
  shape family (`styles.css:1153` reuses `--ab-*` directly rather than composing on `.abchip`).
- **`.cartchip`** — one emission path, consistent.
- **Notice/banner family — five near-identical components, no shared base.**
  `.appnotice` (`styles.css:476`), `.gapbar` (`923`), `.healthbar` (`937`), `.swapbar` (`1407`),
  `.libtray` (`2395`) each independently declare `border-radius:10px`, a `border:1px solid
  var(--X)`, a tinted background (`var(--X-soft)` or `color-mix(in srgb,var(--X) 9%,var(--bg))`),
  and `padding:9px 12px` (or 11px, `.libtray`'s own variant) with a flex row inside. The only
  thing that differs between them is which semantic colour and which icon. **Consolidation
  candidate — size M**: a `.notice` base class with a `data-tone` or modifier class
  (`.notice-warn/-bad/-free/-accent`) would replace five independently-maintained blocks; the
  risk is print-block interactions (`.appnotice{display:none}` in print) and the sticky
  positioning `.gapbar` alone carries (`position:sticky;top:0;z-index:6`), both of which the
  merge has to preserve per-instance.

### Switches / checkboxes
- **`input[type=checkbox]`** — fully re-skinned (`styles.css:718–729`), a real native checkbox
  (keyboard/focus/label association intact per the GOTCHAS entry on J11), one component, one
  place, no duplicates found.
- **`.swk`** (Library row's enabled toggle) — a real `<button role="switch" aria-checked>`
  (`app.js:9310–9317`), correctly avoiding the "label wraps switch + checkbox both fire" trap the
  code comments call out. One emission site, consistent.

### Tiles / rows
Nine distinct `*row` component families were found with independent flex-row declarations and no
shared base: `.classrow`, `.entrow`, `.bldrow`, `.csrow`/`.csrowsub`/`.csrowwrap`, `.libsrow`,
`.bswrow`, `.hbrow`, `.trayrow`, `.colrow`. Each reasonably differs in *content*, but all of them
redeclare `display:flex;align-items:center;gap:Npx;padding:...;border-bottom:1px solid var(--line)`
from scratch with a slightly different gap/padding pair (7px/8px/9px/10px, 6px/7px/8px padding) —
see §7 for the naming/structure read on this.

### Modals / sheets
Two parallel modal systems, both real components with distinct jobs (documented: `.modal` is a
generic centred dialog, `.spmodal` is the full-bleed scrim reused for spell/creature/entity detail,
GOTCHAS: "`.spmodal` is `position:fixed;inset:0` — the full-screen scrim, not a box, borrow the
class to inherit `.sb*`"). Close-button styling is correctly unified
(`.modal .mh .x,.spmodal .box>.x{...}`, `styles.css:739`) so that part isn't duplicated. Thirteen
`id="…Modal"` instances exist in `index.html`; **11 of 13 carry no `role="dialog"` and no
`aria-label`/`aria-labelledby`** — see §6, this is an accessibility finding, not a CSS one, but it
is a component-inventory gap (the two that got it — `#tlModal`, `#gpickModal` — are both late
additions, D122/G3, suggesting the pattern was learned but never back-applied).

### Tables
Three independent table implementations: `table.spelltable` (the main spell list/build table,
`styles.css:340` on, by far the largest single component in the file), `.spmodal .cttable` (class
progression table inside the detail modal, D148(d)), and `.pcsb table.sbab` / `.spmodal table.sbab`
(the stat-block ability table, monster-forge convention, duplicated once for screen and once for
print with parallel but not identical rules — `styles.css:656–666` vs `1872–1882`). No shared base
table class; each restates border-collapse, cell padding and header treatment independently. This
is defensible (three genuinely different tables with different densities) but worth naming as a
place a fourth table would likely repeat the pattern rather than reuse it.

### Print sheet
One component family (`.printhead`, `#printTracker`, `#printLegend`, `.pcard`/`.pcsb` appendix,
`.prlines`), entirely inside the single `@media print` block (`styles.css:1673–1898`), which is
good containment — a newcomer looking for "what does print do" finds all of it in one place,
unlike the Library page (§7). Two coverage gaps are real, both already noted in §1/§5: `--ab-*`
and `--cc-*` are never restated for print, and neither `--radius` nor a print-specific radius
matters much since `.card{border-radius:0}` overrides it, but the ability/highlight gap does reach
the printed spell-card appendix and the stat-block table.

---

## 5. Responsive and theming structure

**Breakpoints, sorted with counts:** 400px(2), 520px(1), 560px(2), 620px(6), 640px(2), 820px(1),
920/921px(3+3). See §3 for the "mostly a scale, three of them close together" read.

**Rules that fight across breakpoints:** none found beyond the one GOTCHAS already documents and
fixed (`.gh-toggle` vs `.btn:has(>.lbl-ico)`, `styles.css:1986–1990`, 2220) — kept here only to
confirm the fix is still in place and the comment explaining it is still accurate.

**Specificity hazards:**
- `:has()` — 3 uses, one already the site of a real, documented bug (`.btn:has(>.lbl-ico)` beating
  `.gh-toggle{display:none}` at equal-ish specificity until qualified, `styles.css:60,2220`). The
  other two (`.cartchip:has(button)`, `label.fld:has(.lockchip)`) are narrow, single-purpose, low
  risk.
- `!important` — 8 uses. Six are the `.hidden{display:none!important}` utility and its print-mode
  counterparts (`#buildView`, `#tableView.hidden`, `.gview`, `.gback`, `.csaddrow,.picksel.ph`,
  `styles.css:168,1715,1719,1720,1921,1922`), all documented and load-bearing (the file's own
  comment at `1718` explains the `#tableView.hidden` vs `.hidden` specificity race). Two more sit
  in table grouping headers (`360`, `1064`) forcing `background:transparent`/`var(--panel-2)` over
  a hover rule — narrow, not a hazard chain.
- id selectors — roughly 82 `#id` rules, nearly all one-off bindings to a unique page element
  (`#addClass`, `#tableView`, `#csrcMode`…) in a framework-less single-page app; not combined with
  `!important` except the two cases above, so not a compounding hazard.

**Theme block order and completeness:** light `:root` → dark `@media (prefers-color-scheme:dark)`
→ dark `:root[data-theme=dark]` (explicit override wins over the media query by source order plus
higher specificity from the attribute selector) is repeated identically for the core palette
(`11–37`) and the ability palette (`1076–1092`); the print palette follows the same two-branch
shape at the end of the print block (`1682–1701`). No token is defined in only one screen block.
`color-scheme` is set in all three screen blocks (`21`, `23`, `31`), matching the GOTCHAS rule
("any new theme block must set it too").

**`--ab-*`/`--cc-*` not carried into print** (see §1) is the one real theming-completeness gap:
the print `:root` overrides restate 17 base tokens and `--shadow`, but not the 11 ability/highlight
tokens that the printed spell-card appendix and stat-block table both consume.

**Reduced-motion:** two guards exist (`styles.css:514`, spinner; `1940`, `.gview` slide transition)
against roughly 20 other `transition:` declarations in the file. The unguarded ones are all
sub-150ms colour/border/opacity hover fades or caret-rotate transforms — the kind of "essential,
non-repeating, small" motion WCAG 2.3.3 does not require gating — except `.locard.refuse`'s
`animation:tlrefuse .35s` (`styles.css:1332-1333`, a border-colour pulse on an illegal drag-drop),
which is a real `@keyframes` animation, the same category as the guarded spinner, and is not
covered. Low practical severity (colour-only, single 0.35s pulse, no motion/transform), but
inconsistent with the spinner having been guarded — polish, not major.

**`color-scheme` handling:** covered above; correctly done.

**Print block coverage:** comprehensive by inspection — modal/menu/popover/finder chrome hidden,
palette restated for both light-on-white and dark-on-screen printing, table restyled for paper
density, tracker/legend/appendix/notes all built and torn down around `beforeprint` (per the
file's own header comment at `1655–1658`). The one gap is the ability/highlight token omission
above.

---

## 6. Markup and accessibility statics

**Landmarks.** `index.html` has exactly one `<header>` (`31`), one `<nav>` (`225`, the mobile
jump bar, `hidden` by default and only ever shown under 920px), and one `<footer>` (`227`). **There
is no `<main>` element.** The entire app body — every card, the whole build/table view — lives
inside `<div class="wrap" id="buildView">`/`<div id="tableView">`, which are plain `div`s with no
landmark role. A screen-reader user gets `header`/`nav`/`footer` regions but has to fall through
to "everything else" for the actual content of the page. This is a straightforward, low-cost fix
(`<main class="wrap">` in place of the outer `div`) but it is a markup change to a shared file, so
it is reported as a finding (B2-06) rather than applied under §9's trivial-fix bar.

**Heading hierarchy.** `<h1>My Spellbook</h1>` (`32`) → six `<h2>` card headers in the build view,
two more in the table view, one per modal's `<h2>` inside `.mh`/`.mh-stack` — consistent, no
skipped levels at the page level. Inside modals, app.js-emitted content jumps straight to `<h3>`
(`.spmodal .mh h3`, `app.js` spell/entity modal titles) and `<h4>`/`<h5>` in the print appendix
(`.pcard h4`, `.pcsb .sbsec h5`) — each modal is a separate `role`less overlay with its own local
`<h2>` (the "Choose spells"/"Choose" title bar), so the jump to `<h3>` for the spell-detail modal's
own heading is one level below that, not a skip in the strict sense, but because none of these
modals carries `role="dialog"` (see below) a screen reader has no signal that a new region opened
at all, which makes the heading-level question moot until that is fixed.

**Modal dialog semantics.** Of 13 `id="…Modal"` elements in `index.html`, only two carry
`role="dialog"` + `aria-label` (`#tlModal:611`, `#gpickModal:657`). The other 11 —
`#pickModal`, `#entityModal`, `#customModal`, `#importModal`, `#hbModal`, `#srcAskModal`,
`#buildModal`, `#newBuildModal`, `#printModal`, `#csrcModal`, `#prepModal`, `#famModal` — are
plain `<div class="modal hidden" id="…">` with no ARIA role, no `aria-modal`, no
`aria-labelledby` pointing at their own `<h2>`. This is the single largest accessibility gap
found in the statics: a screen reader has no way to know any of these eleven surfaces is a modal,
what its accessible name is, or that focus should be trapped inside it — severity **major**,
scope is mechanical (add the same three attributes eleven times) but every instance needs its own
`aria-labelledby` target id, so size is **M**, not S.

**Form labels.** Every visible text input in `index.html` that is not inside a `.fld`-labelled
block carries its own `aria-label` or a `placeholder` doubling as one (e.g. `#webSrcRepo`,
`#libSrcSearch`, `#nbChar`/`#nbVer` use real `<label class="fld" for="…">`). No unlabelled input
was found in the static markup.

**Icon-only controls.** The static markup is disciplined: every `class="btn iconbtn ico"` /
`class="x ico"` button in `index.html` carries `aria-label` (`#guideTopBtn`, `#menuBtn`,
`#filterBtn`, `#pickClose`, `#entClose`, every `.x` close button, etc. — checked exhaustively).
The same discipline holds in app.js-generated icon-only buttons: five separate emission sites
(`app.js:3403,3684,3917,7625,7989`) each set `aria-label` alongside the icon, and the `.swk`
switch (`9310`) sets both `role="switch"` and `aria-checked`. No icon-only button without an
accessible name was found anywhere in either file — worth stating plainly since the brief asks
for "with and without": this codebase has the discipline, consistently.

**Nested interactive elements.** GOTCHAS documents the `<button>`-in-`<button>` hoist trap being
hit twice already (build-switcher row, stat-block head) and fixed by making the row a `div` with
`role="button"`/`tabindex` plus sibling buttons. A static grep for `<button` immediately followed
by another `<button`-opening template concatenation inside the same element found no new
instance beyond what GOTCHAS already names — the fix pattern (`.bswrow`, `.sb-head`) is applied
consistently at the sites that need it.

**Tab order / custom-tab semantics.** `.tabs` (Build/Table switch, `index.html:42`) and its two
reuses for `.prepsteps` (custom-spell wizard, `#customSteps`) and step chips elsewhere are plain
`<button>` rows toggled with a `.on` class (`app.js:6527`) — **none carries `role="tablist"` /
`role="tab"` / `aria-selected`**. Visually a tab switcher, semantically an unordered set of
buttons; a screen reader has no way to announce "tab 1 of 2, selected" or to know the two buttons
are mutually exclusive. Minor-to-moderate: keyboard operation still works (they're real buttons),
but the semantics are absent. Tab order itself has no hazard found — no stray `tabindex` values,
`inert` is used correctly on the slid-away guide page (`body.gaside`/`.gvaside`, per the file's own
comment at `styles.css:1936–1938`).

---

## 7. Naming and structure

**Selector naming.** Prefixes are consistent *within* each sub-system but undocumented as a
system: `bsw-` (build switcher), `cs-`/`csrc-` (custom source), `ent-` (entity/detail modal),
`tl-` (timeline), `gc-`/`g-` (guided builder chain/stage), `lib-` (Library page), `pc-` (print
card), `sb-` (stat block, monster-forge convention), `lo-` (level-order/timeline card). A
newcomer has to reverse-engineer what each two-or-three-letter prefix means from context — there
is no legend or glossary comment anywhere naming the abbreviation scheme, only per-block comments
explaining individual decisions. This is a real onboarding cost on a 2491-line file with no other
navigation aid (no CSS custom-property-driven component map, no BEM-style grouping).

**"Row" proliferation** (see §4) is the clearest instance: nine independent `*row` families
redeclare the same flex-row recipe with slightly different numbers instead of composing a shared
`.row` base — not a bug, but exactly the kind of near-duplicate pattern the brief asks to name.
Consolidation candidate, size **L** (nine call sites, each embedded in different markup contexts,
genuine risk of visual regression if merged carelessly) — named here as a structural observation,
not proposed as a queued task.

**Section order in styles.css vs. the app's surfaces.** The file is organised chronologically by
build batch (comments read `── v4 …`, `── v5 …`, `── v6 …`, `── v7 tweaks`, `── v8 …`, `── v9 …`,
then feature/decision-named blocks: `G1`, `H4`, `D147`, `D148`, `D154`) rather than by app surface.
The practical cost: **a single surface's rules are not always in one place.** The Library page
(D154) is the clearest example — its CSS lives in at least four non-adjacent regions:
`.srcpanel` (`976–979`, shared with other pickers), `.importdrop`/`.importstaged` (`1224–1247`,
shared with the build-import panel), `.importdrop.bimport` (`1474–1483`), and the bulk of
Library-specific rules — `.libtray`, `.libtop`, `.libstatus`, `.libfoot`, `.libsrow`, `.libchip`,
`.libselbar` — over 1100 lines later at `2390–2491`. Someone changing "what does a Library row look
like" has to know to search four separate regions of the file, none of which cross-reference the
others. The spell-modal/entity-modal system is better contained (`517–670` for the spell modal,
`8360`-area/`2244–2389` in CSS for the D147/D148 detail-modal additions — still two regions, but
both clearly commented as belonging together).

**Comments that lie:** none found. The comments in this file are unusually reliable — several are
explicitly corrective ("D151: no opacity here…", "NOT inline-flex…", "no `position:sticky` on
these…") and describe rejected alternatives inline, which matches the DECISIONS.md discipline.
No stale comment describing removed behaviour was found in the sections read.

**Could a newcomer find a component's rules in one place?** For most components, yes — the
file's habit of a one-line "why" comment immediately above the block it explains is a real
strength, and most components (spell modal, guided builder, timeline, print) are each contiguous.
The Library page (above) and the notice/banner family (§4, five components sharing one visual
recipe with no shared class) are the two clear exceptions.

---

## 8. Findings list

Ranked; severity is major / minor / polish. Size is a rough implementation estimate, not a
verified one (no browser was used).

| id | severity | file:line | what | evidence | direction | size | constrains |
|---|---|---|---|---|---|---|---|
| B2-01 | major | `index.html:230,248,281,300,427,438,453,479,501,535,681,711` | 11 of 13 modals carry no `role="dialog"`/`aria-label`/`aria-modal` | only `#tlModal`(611) and `#gpickModal`(657) have them | add the same triple to the other 11, each pointing `aria-labelledby` at its own `<h2>`/`h3` id | M | none — purely additive markup |
| B2-02 | major | `index.html:30,73,198` | no `<main>` landmark; entire app body is a bare `div` | `<div class="wrap">`/`#buildView`/`#tableView` hold all content, only `header`/`nav`/`footer` are landmarks | change `.wrap`'s outer element (or `#buildView`) to `<main>` | S | check `.wrap` isn't selected as a non-landmark elsewhere in CSS/JS (it isn't, by grep) |
| B2-03 | minor | `index.html:42`; `app.js:6527` | `.tabs` (Build/Table switch, and its `.prepsteps` reuse) has no `role="tablist"`/`role="tab"`/`aria-selected` | plain buttons + `.on` class toggle, no ARIA | add tab/tablist/aria-selected to the two tab-shaped surfaces | S–M | none |
| B2-04 | minor | `index.html:396,600`; `styles.css:368,452` | `.btn.danger` has no generic rule; only `.menupop button.danger` and `.bswmi.danger:hover` exist | `#libSelRemove`/`#csrcDelete` render as neutral buttons until armed | add `.btn.danger{color:var(--bad);border-color:var(--bad)}` or similar at the base `.btn.danger` level | S | none — D53's arm-then-confirm gate still stands, this only affects the pre-arm visual |
| B2-05 | minor | `styles.css:517–670` (font-size), `163–360` (radius/spacing) | font-size (26 distinct values) and spacing/radius have no scale, tuned per component | grep counts in §2/§3 | not a mechanical fix — a scale retrofit is a design decision, flagged not applied | L | would touch nearly every component rule in the file |
| B2-06 | minor | `app.js:8150,8283,8567,8673` | `.bchip` markup duplicated at 3 of 4 emission sites instead of reusing the one existing helper (`bkTag`, 8567) | byte-identical template repeated 3×; `abChip()` similarly bypassed at `app.js:3365,8076` | extract `bkTag`'s shape to a module-level helper, point all four (six, counting the abchip pair) call sites at it | S | none |
| B2-07 | minor | `styles.css:476,923,937,1407,2395` | five independent notice/banner components (`.appnotice`,`.gapbar`,`.healthbar`,`.swapbar`,`.libtray`) share one visual recipe (bordered, tinted, `border-radius:10px`, padded flex row) with no shared base class | side-by-side rule comparison in §4 | a `.notice`/`.notice-<tone>` base, migrated one instance at a time | M | must preserve `.gapbar`'s sticky positioning and print's `.appnotice{display:none}` per-instance |
| B2-08 | minor | `styles.css:1682–1701` vs `1076–1092` | `--ab-*`/`--cc-*` (11 tokens) are never restated in either print `:root` block, though the printed spell-card appendix and stat-block table consume both | `printCardHTML`→`descP`→`ccText` confirmed to emit `.cc-*` spans (`app.js:7664,7759-7760`); `.pcsb table.sbab .abchip` consumes `--ab-*` (`styles.css:1878`) | add the 11 tokens to both print `:root` overrides, values already exist in the screen palettes to copy from | S | verify against the actual printed page (B1/print-lift territory) before treating the visual impact as confirmed |
| B2-09 | polish | `styles.css:1332-1333` | `.locard.refuse`'s `@keyframes tlrefuse` (illegal-drag pulse) is not covered by the `prefers-reduced-motion` guard that covers the spinner | grep for `transition:`/`animation:` outside the two existing `@media (prefers-reduced-motion:reduce)` blocks | add `.locard.refuse{animation:none}` to the existing reduced-motion block | S | none |
| B2-10 | polish | `styles.css:1796` | `table.spelltable .achip` in the print block matches nothing — `.achip` only ever renders inside `.spmodal .achips` (`app.js:7788,7797`), never inside `table.spelltable` | selector cross-referenced against every `.achip` emission site in app.js | drop the dead half of the selector (keep `.savechip`) | S | spot-checked only, not a substitute for the L0 dead-CSS sweep |
| B2-11 | polish | `styles.css:99` | `--mono` referenced via `var(--mono,ui-monospace,monospace)` but never defined in any theme block | grep across styles.css/app.js/index.html for `--mono:` finds nothing | either define `--mono` in the theme blocks or drop the indirection and write the fallback stack directly | S | none |
| B2-12 | polish | `styles.css:113,511,2200` | `.btn` has no `:disabled` or `:focus-visible` treatment at the base level; both are patched per-instance instead (`#addClass:disabled`, `.bswmain:focus-visible`, `.abtile:focus-visible`, `.gcstep:focus-visible`…) and the file says so itself twice | comments at 511/2200 explicitly disclaim a global `.btn:disabled` look | add base `.btn:disabled`/`.btn:focus-visible` rules once instances are audited for conflicts | M | every existing per-instance override needs checking against a new base rule to avoid double-styling |

**Consolidation candidates, summarised:**
- `.bchip` helper unification — **S** (B2-06)
- `.notice` base for the five banner components — **M** (B2-07)
- `.row` base for the nine row families — **L**, named in §7, not queued as a finding (too broad
  to size responsibly without the markup context each one sits in)
- `--shadow-float` for the five one-off floating shadows — **S**, named in §2
- documented `--z-*` scale — **M**, named in §2/§3

---

## 9. Trivial fixes applied

**None applied.** Every candidate that surfaced during this read failed D157(a)'s bar for a
mechanical, invisible fix:
- `--mono` (B2-11) is referenced, not a zero-use dead token with no mention anywhere — it fails
  the "AND no mention anywhere" clause the other direction (it's mentioned once, just never
  defined), so it is a finding.
- `table.spelltable .achip` (B2-10) is a dead selector but its removal is visible in the rendered
  print output in principle (even though it currently matches nothing, so removing it changes
  nothing on screen) — reported as a finding per the instruction that "anything visible is a
  finding, not a fix," and because it wasn't independently re-verified against a live print
  preview.
- No duplicated identical declaration and no comment naming the wrong thing were found anywhere
  in the two files read in full.

---

## 10. For the docs

- **PLAN.md / STATE.md**: this report exists at `audits/B2-design-system.md`, dated 2026-09,
  per D157(f)'s logistics — no other doc changes made from this worktree (shared-doc edits are
  out of scope per the task brief).
- Two items in this report bear directly on standing decisions and should be named explicitly at
  triage rather than re-derived: **B2-01/B2-02 do not reopen any `Rejected:` clause** — no prior
  decision considered and rejected `role="dialog"` or a `<main>` landmark; they are simply gaps
  D147–D157 never touched. **The light-theme "near-duplicate" tokens noted in §1 are NOT a
  finding** — flagged explicitly so the synthesis pass doesn't propose "spread the ink hues
  apart," which would undo D145(a)'s deliberate equal-contrast method.

---

## 11. Claims register

For the wave-2 verifier. Each line is a specific, checkable claim.

1. 32 custom properties are defined across the three screen theme blocks and none is missing from
   any of the three — `styles.css:11–37` (core), `1076–1092` (ability/highlight).
2. `--mono` is used at `styles.css:99` and defined nowhere in the repo (`grep -n -- "--mono"
   src/styles.css src/app.js src/index.html` returns only the one usage line).
3. `--ab-*`/`--cc-*` (11 tokens) do not appear inside the print `@media` block,
   `styles.css:1673–1898` (confirmed by grepping that line range for `ab-`/`cc-dice` etc. —
   only `--font`/`--sans` recur there).
4. `printCardHTML` (`app.js:9927`) renders spell prose through `descP`→`descPara`→`ccText`
   (`app.js:7664,7759-7760`), which is the function that emits `.cc-dice`/`.cc-dc`/`.cc-dmg`/
   `.cc-cond`/`.cc-range` spans — so claim 3's gap does reach the printed page, not just the
   screen.
5. `.btn.danger` has zero matching CSS rules outside `.menupop button.danger` (`styles.css:368`)
   and `.bswmi.danger:hover` (`452`) — confirmed by `grep -n "\.danger\b" src/styles.css`.
6. `index.html:396` and `:600` are the only two `class="btn danger"` usages in the static markup
   (`grep -n 'class="btn danger` src/index.html`).
7. 11 of the 13 `id="…Modal"` root elements in `index.html` lack `role="dialog"` — verified by
   reading every modal's opening tag (lines 230, 248, 281, 300, 427, 438, 453, 479, 501, 535, 611,
   657, 681, 711 — 14 modal-shaped roots total including `#guideView`/`#gBack` which are not
   `.modal`s and are excluded from the 13/2 count; the two with `role="dialog"` are 611 and 657).
8. `.wrap`/`#buildView`/`#tableView` are plain `<div>`s; no `<main>` element exists anywhere in
   `index.html` (`grep -c "<main" src/index.html` returns 0).
9. `.tabs`'s Build/Table switch (`index.html:42`) and its state toggle (`switchTab`,
   `app.js:6527`) use only `.classList.toggle("on",…)`, no `role`/`aria-selected` anywhere in
   either file for that element.
10. `.bchip` markup is built independently at `app.js:8150`, `8283`, and `8673` (three inline
    template literals producing the same shape `bkTag` at `8567` already factors) — verified by
    reading all four sites in full.
11. `abChip()` (`app.js:7688`) exists as a helper but is bypassed by inline duplicate markup at
    `app.js:3365` and `8076`.
12. `.appnotice`, `.gapbar`, `.healthbar`, `.swapbar`, `.libtray` (`styles.css:476,923,937,1407,
    2395`) each independently declare `border-radius:10px` and a bordered/tinted flex-row
    pattern; no shared class exists between them.
13. z-index literal values in `styles.css`, in file order: 50(291), 40(365), 90(447), 95(476),
    90(517), 70(527), 2(531), 2(799), 6(925), 80(1023), 55(1595), 45(1912), 40(1945), 3(2010),
    75(2386), 2(2424) — 16 declarations, no custom property involved in any of them.
14. `@keyframes tlrefuse` (`styles.css:1333`) is not referenced inside either
    `@media (prefers-reduced-motion:reduce)` block (`514`, `1940`) — confirmed by reading both
    blocks in full.
15. `table.spelltable .achip` (`styles.css:1796`, print block) has no corresponding markup: every
    `.achip` emission in `app.js` (lines 7788, 7797, 8172) is inside `.spmodal .achips`, never
    inside a `table.spelltable` row-rendering function (`cellFor`/`tableRows`, `app.js:5978` on).
16. Relative-luminance computation from the literal light-theme hex values shows `--muted`,
    `--accent`, `--gold`, `--good`, `--free`, `--bad` all within ΔL≤0.005 of each other
    (L≈0.103–0.108) — computed independently from the CSS values in `styles.css:12–15`, not from
    a rendered page (per the "no browser" constraint on this pillar); this is a static-arithmetic
    check, not a substitute for D145's own measured-contrast method.
17. `.btn`'s own rule (`styles.css:113`) carries no `:disabled` or `:focus-visible` selector; the
    file's own comments at lines 511 and 2200 state directly that no global `.btn:disabled` look
    exists.
