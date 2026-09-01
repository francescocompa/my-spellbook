# Synthesis — the three-pillar audit (D157), 2026-09-02

What survived wave 2, ranked, and sorted by what it needs: a fix nobody has to decide on, or a
call only Francesco can make. Sources: `A-direction.md` + `V-A-direction.md`, `B1-live-ux.md` +
`B2-design-system.md` + `strings-inventory.md` + `V-B-design.md`, `L0-sweeps.md` +
`C1-app-structure.md` + `C2-bug-sweep.md` + `C3-data-pipeline.md` + `V-C-code.md`. Every id
below points at its report; the evidence stays there.

Verification record: A 48/58 claims confirmed, 1 struck, 2 map rows struck; B 44 of 45
findings survive, one row struck, two severities raised; C see below.

One fact that shapes everything: **the browser profile every agent received was empty**, so no
report saw Francesco's real 44-book library or his builds. Usage evidence has to come from him
(V-A §6 lists the eight questions). B1-01 and its family fire only on such a profile.

---

## Pillar A · direction

### What holds
- The app's picture, the pipeline numbers (corrected: 13 open flags, not 14) and the decision
  citations. Velocity: 155 commits, 77 versions in six days; the verify gate is syntax-only.
- The horizon recommendation, **close the loop with his table**: finish K (K3/K4), fix the
  pooling bug, then let the plan leave the app (copy as level plan, compare two versions),
  then the minimal ability-score model. Alternatives: content first; consolidation.
- Notion evidence checked by the session: the Character Ideas page is, typed by hand, exactly
  what the timeline derives; the Character Sheet DB holds scores, HP, AC and proficiencies and
  no spells.

### Re-ranked map, top of the board (V-A sizes)
| # | Id | What | Size | Needs |
|---|---|---|---|---|
| 1 | A-01 | K3 raw-stash + auto re-parse, then K4 | M | resume; design locked (D154) |
| 2 | A-02 | Half-caster pooling rounds up per class | S | **his ruling** on the Paladin/Ranger half; fixture must assert 5, not 4 |
| 3 | A-25 | The open ⚑ batch as one interview round | S | **him**, one round |
| 4 | A-08 | PWA install check on his phone | S | **him** |
| 5 | A-03 | Copy the build as a level plan (clipboard text) | S | format is his call; Done-when rewritten to a fixture |
| 6 | A-14 | Homebrew-by-paste recipe (a doc, not an editor) | S | fixture species, not his |
| 7 | A-04 | Rewards ingestion | M | **gated on the magic-items 🔶** (PLAN); strong model for the shape |
| 8 | A-05 | Compare two versions | M/L | global-state coupling is the hidden cost |
| 9 | A-06 | Ability scores + PB, minimal | **L** | a D-entry first; the ASI-note ⚑ is inside it |
| 10 | A-13 | A concept line on a character | S | none |
| 11–19 | A-07, A-09, A-15, A-11, A-12, A-18, A-16, A-26, A-17 | items, character-forge handoff, mirror script, SHADOWED, `_copy`, High Elf, undo, `sbFav`, long-rest swap | S–M | as PLAN's Queue already says |
| struck | A-10 print the plan (D98's second clause); A-27 backgrounds (D118(d) non-goal) | | | |
| noise | A-19 to A-24 | creature sets, loadouts, live tracking, cross-build search, DDB import, wizard costs | | correctly classified |

### Pipeline fixes that survived (A §2, checked in V-A §3)
1. Doc-only commits stop bumping VERSION: CLAUDE.md:82 to read "every commit that changes
   what is built bumps". Amends D117; **his yes**.
2. A headless engine test as gate line five: needs an export shim and a boot guard inside
   app.js (V-A: M/L, not M), so it is a small step past D157(e) and must be said out loud.
3. Wave discipline as scripts: snapshot/restore for storage; D-id and version reservation.
4. A flag round at every handoff (the 13 flags, plus one living in CHANGELOG:138–141).
5. DECISIONS.md kept to an index: 2,280 lines, ~75k tokens per `/start` across the live set.

### Triage questions (V-A §6, the usage column)
Where does a character live once it leaves the app · which surfaces he opens · whether and what
he prints · phone at the table, Pages or dist · how many characters and versions, has he wanted
to compare two · custom spells or sources ever authored · all 44 books loaded, does he act on
the parser nag · which of the 13 flags annoy in use.

---

## Pillar B · design, UX, copy

### Verdict
Trustworthy: 44 of 45 findings survive. The colour is one palette (2° median hue delta between
themes, 0 failures in 499 build-view nodes either theme); the geometry is not one system (26
font sizes, ~15 radii, a 1px spacing continuum, `--radius` used twice). The accessibility layer
is the structural shortfall: focus, dialog semantics, keyboard reorder. The print sheet is the
strongest artefact. B1's contrast probe cannot read `color-mix()`, so its clean sweeps over the
29 surfaces using it are weaker than they look; D152's tile is fine.

### Surviving blocker and majors (V-B §9 order)
| # | Id | What | Fix shape | Needs |
|---|---|---|---|---|
| 1 | B1-01 | A paste on a profile with **no prior import** replaces the baked content set (43 → 1); four surfaces then report four wrong facts; the only warning sits 1,693px off-screen. Merges correctly on a populated digest (C2). Fires for the Pages visitor and the dev page, not for his library. | copy + placement is cheap; the merge is a D86/D112/D93 model call | **his call**: baked ⊕ imported union on first import, or keep replace and warn |
| 2 | B1-30 | White on `--accent` at 2.57:1 on the level badges, live (was polish) | one declaration | none |
| 3 | B1-04 + B2-01 | 12 of 14 modals unnamed, no `aria-modal`, no focus trap, Escape on 4 of 14 (C2-01) | one shared open/close helper + the attribute triple | none |
| 4 | B1-02 | The pending tray renders above the scroller on the paste route | scroll the tray into view on stage, or move the paste box | small; D154(h) placement stands |
| 5 | V-B 5.1 | The authored focus ring is `--accent-soft` at 1.2:1; the Library's 43 checkboxes have nothing else | two declarations | none; precondition for 6 |
| 6 | B1-03 | No `:focus-visible` on `.btn`; 17 of 19 controls on the UA ring | one base rule + `.swk`/`.tk` shapes | none |
| 7 | B1-06 | `--cc-range` 3.85 and `--cc-dc` 3.80 in light; 9 of 15 light content cells fail, 0 dark | retune two light tokens | the half of D145 not done; measured method, no call |
| 8 | B1-07 + B1-08 | "All set" over an unchosen subclass; a defaulted either/or reads as chosen | a counting fix + a display rule at app.js:1325–1331 | **his call** on what "pending" counts |
| 9 | B1-05 | The guide stage 11–27% filled at 1280 | composition | **his call** (D126/D131(c)) |
| 10 | B1-09 | Timeline reorder is drag-only, no roles | move up/down buttons + roles | none in principle; placement his |
| 11 | B1-28 | Dark `--line-strong` 1.53–1.84 where it bounds a control | split decorative vs control, then retune | small call |
| 12 | B2-02 | No `<main>` landmark | one element | none |
| 13 | V-B 5.2 | On an empty build after that paste, "Books (43)" with one book and "every class is already in this build" with zero classes | downstream of 1; the second string is simply false | fix with 1 |

### Minor and polish worth batching (no call needed)
B2-04 `.btn.danger` neutral until armed · B2-06 `.bchip` built at three sites bypassing `bkTag` ·
B2-08 `--ab-*`/`--cc-*` missing from the print palette · B2-09 refuse-pulse outside the
reduced-motion guard · B2-10 dead print selector · B2-11 `--mono` never defined · B2-12 no base
`.btn:disabled`/`:focus-visible` · B2-03 tab semantics · the 30 dead CSS tokens (L0/C1).

### Design-system calls (his, not fixes)
- A type and spacing scale (B2-05, L): retrofit or leave the hand-built geometry.
- `.notice` base for five banners (M) · `.row` base for nine row families (L) · `--shadow-float`
  (S) · a documented `--z-*` scale (M).
- Dark borders (`--line`/`--line-strong`) got half the D145 treatment; the content palette got
  the other half in the other theme.

### First-run visitor (Pages)
The page never says what it is; three empty states say the same sentence three ways; the
Library names "Player's Handbook (2024)" for an SRD subset. Ten seconds of gap, then legible.
Whether that matters is the audience frame (D157(b): by-product).

### Copy
1,370 strings, 263 with a tell: em dash 166 · ellipsis placeholder 72 (an open ⚑, his call,
not to be rewritten silently) · states the obvious 18 · Title Case 10 · triplet 7 · emoji 5 ·
"just" 4 · hedge 3. Zero "simply", "seamlessly", "Note:", exclamation marks. Tell precision on
the em dash 166/166; recall 100% on the Library walk. **Line numbers above app.js:6036 are 3
too high** (inventory built on a tree three lines longer); wave 3 applies the offset or
re-derives locations by string match. Persona verdict: the information design is disciplined;
the seams between surfaces are where copy contradicts itself.

---

## Pillar C · code health

### Verdict
The gate, cparity (51 ok / 0 fail) and every L0 sweep reproduce. All four C2 findings and all
five C3 findings reproduced in the browser or the code. Two C1 claims struck: nine of the "30
dead CSS tokens" are live through concatenated class names (`runc0-3`, `c1`/`c3`, `libo-*`, the
Library's own origin chips), so the dead-CSS list is **21**, and `featureFirst` is a
byte-equivalent local duplicate of `readOrder`, a one-line deletion, not an abandoned fix.
`cparity-formrefs.js` is a text scan, not a proof; the finding it restates stands on the
browser repro. eslint: 0 `no-undef`, 0 `no-redeclare`, 62 `no-unused-vars` (42 are `catch`
params); every `eqeqeq` hit is `==null`, so `["always",{null:"ignore"}]` is the honest rule.

### Surviving majors
| # | Id | What | Fix shape | Needs |
|---|---|---|---|---|
| 1 | C3-01 / C2-04 | **Upload .json files** skips the form-reference reset and `readOrder`; bestiary before feature file loses the dependent monster record silently, and alphabetical order IS the losing order, so it is the default case | mirror the other three ingestion paths in `stageFiles` (app.js:5144) | none; a behavioural fix, small, D92 rule |
| 2 | C2-02 | The stale-parser notice's "Refresh now" is folder-only; a web-fetched library gets "choose the folder above", a dead end | add the D153 branch, or retire the notice with K3 | **his call**: patch now or fold into K3 |
| 3 | C2-01 / B1-04 | Escape closes 4 of 14 modals; the close helper has no generic fallback (app.js:7648) | one helper | none |
| 4 | B1-01 | First-import replace, see pillar B; reversible with one click (select all → Remove restores the bundle, picks survive both ways) | presentation | **his call** on union vs warn |

### Minor, needs a decision
- C3-02 `bump.py` writes VERSION and `data/data.js` before the asserts that can fail; a failed
  build leaves a footer version nothing was built with. Reorder, S.
- C3-03 `build.py` has a `</script` guard and no `</style` guard for the one inlined stylesheet. S.
- C3-04 the fetch's rate-limit and non-JSON errors read generic. S.
- C3-05 `hasSpells`/`countType` emitted by both extractors, read by neither. Drop from both, S.
- C1: custom-source code split across three places; the Library 4,000 lines from its importer;
  a proposed 20-line index comment for the top of app.js (sectioning proposal only, D157(e)).
- C1 duplication: `.bchip` built at three sites (B2-06); a 39-site plural ternary with no helper;
  `refreshAll(); render()` double-running two level-derived renders at 21 call sites.
- Tooling: which sweeps join the gate (deadfns and ids yes; deadcss only with a dynamic-class
  allowlist; formrefs no while C3-01 is open); fold `cparity-sources.js`'s six assertions into
  `cparity.js` rather than a fifth line; eslint lands with `["always",{null:"ignore"}]` and
  `caughtErrorsIgnorePattern`; `package.json` already on main since v1.5.9.

### Trivial (one line, no design implication)
Remove `featureFirst` (extract.js:1191) · pluralise `applyPlan`'s success sentence
(app.js:5710) · add the `</style` assert to build.py · drop the dead destructuring at
app.js:6200 · delete the four unscoped dead functions and `ABIL_FULL` (not K4's list) · the four
raw glyphs (`⌄` `‹` `›`) through `icoEl` (D57).

---

## What wave 3 ships without a decision

**Copy.** The rewrite to the brief (D157(d)) with its before/after table, the `…` placeholders
left alone (open ⚑), locations re-derived by string match.

**Code, trivial.** The pillar C trivial list above; the L0 `deadfns` orphans except K4's own
list; the 21 dead CSS tokens after a browser check of each.

**Accessibility, no design implication.** B1-30 badge contrast · V-B 5.1 focus ring on
checkboxes · B1-03 base `.btn:focus-visible` · B2-01/B1-04 dialog role, `aria-modal`,
`aria-labelledby`, Escape everywhere, focus trap in the one helper · B2-02 `<main>` · B2-03 tab
roles · B2-09 reduced motion · B2-11 `--mono` · B2-10 dead print selector · B2-08 print tokens.

**Bugs.** C3-01 `stageFiles` ordering + form-refs reset · V-B 5.2 the false "every class is
already in this build" string · B1-02 scroll the tray into view on stage.

**Small consistency.** B2-04 `.btn.danger` pre-arm look · B2-06 one `bkTag` helper · a plural
helper for the 39 sites · C3-02 bump.py order · C3-05 drop the dead output from both extractors.

## What goes to the triage interview

**Round 1 · direction.** Horizon (close the loop / content first / consolidation) · where a
character lives after the app · the pooling ruling for Paladin/Ranger · A-06 ability scores:
open a D-entry or leave closed.

**Round 2 · design.** B1-01 union or warn · B1-07/08 what "pending" counts · B1-05 the guide
stage composition · the geometry scale retrofit (B2-05) and the `.notice`/`.row` bases · the
first-run visitor: worth ten seconds of copy or not.

**Round 3 · code and pipeline.** C2-02 patch or fold into K3 · CLAUDE.md:82 "every commit that
changes what is built bumps" (amends D117) · the engine-test scaffold with its export shim in
app.js · which sweeps gate and the linter's rule set · the DECISIONS diet.

**Round 4 · the flag batch and usage (A-25).** The 13 open ⚑ in one pass, plus V-A §6's eight
usage questions folded in where they decide a flag.
