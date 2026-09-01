# V-B · verification of pillar B (design, UX/UI, flows, copy)

Wave 2 (D157(a), (f)). Adversarial re-measurement of `audits/B1-live-ux.md` (33 findings),
`audits/B2-design-system.md` (12 findings) and `audits/strings-inventory.md` (1,370 rows).
Nothing in those three files was edited. Only what survives this pass should reach Francesco.

- **Date:** 2026-09-02 · **Code under test:** `main` at v1.5.8 (commit `00ab59e`), in a worktree.
  The footer reads v1.5.10 because `data/` is a symlink to the main checkout's `data.js`, which
  a parallel session rebuilt; `__VERSION__` lives in that file. The app code is v1.5.8.
- **Method:** real Chrome on macOS, `python3 serve.py 8013`, `http://localhost:8013/src/index.html`,
  1280x900 and 375x812, both themes. Every number below was read from the live DOM or computed
  from the CSS literals; nothing is quoted from B1 or B2 without being re-derived.
- **Important difference from B1:** B1 ran headless Chrome. Two of its numbers move under a real
  font stack and a real colour parser. Both are named where they matter (B1-06, B1-10).
- **Contrast probe:** the probe used here resolves `color(srgb r g b)`, which is what Chrome
  computes `color-mix()` to. B1's probe appears not to, and that single gap produces one of the
  three strikes below.

---

## 1. B1 verdicts

Severity column reads `kept` or `old -> new`.

### Blocker

| id | verdict | my measurement | severity | note |
|---|---|---|---|---|
| B1-01 · an import replaces the whole content set | **CONFIRMED, scope narrowed** | Pasted a one-spell brew through the real UI. `Object.keys(DATA.sources).length` 43 -> 1, `DATA.spells.length` 936 -> 1, `DATA.classes.length` 27 -> 0. Report line: "Added. 1 book · 1 spells · 0 classes · 0 subclasses · 0 feats · 0 species." | blocker kept | See 1.1 |

**1.1 · B1-01, the code path and the precondition.** The behaviour is by design, not a failed
merge. `assembleData` (app.js:291) computes `const base=IMPORTED||BAKED||emptyDigest()`, and
GOTCHAS already states it: "An imported digest REPLACES the bundle". `planFromStage`
(app.js:5355) sets `const stored=IMPORTED||emptyDigest()`, so `BAKED` never enters the plan;
`mergeDigests` (5308) then merges the brew into an empty base, and `applyImport` (5641) folds
only `PLAN.stored.sources` back in (D156(a)). The merge did not fail. It merged with nothing.

The precondition matters and B1 does not state it. Read-only probe, no write: with a 43-book
stored digest in place, `planFromStage(brew)` yields `merged.sources` **44** and `keep` **44**,
no collapse. With no stored digest it yields **1** and **1**. So the collapse fires only for a
profile running on the baked or SRD bundle: the Pages first-run visitor, and the dev page before
any import. **Francesco's own 44-book library is not at risk from a paste**, which contradicts
B1's persona verdict ("He will hit that the next time he pastes a brew"). Severity stays blocker
because scenario S3 is one of D157(c)'s four and it breaks end to end for the audience that has
not imported yet.

Downstream surfaces, re-measured, all confirmed and one worse than reported:

- `#spCount` reads `0 spells`.
- `#addClass` collapses to a single option reading **"every class is already in this build"**.
  This fires on an **empty** build with zero classes, so it needs no populated build at all. B1
  reached it only through a level-9 build; the wrong sentence is one step closer than reported.
- The active-filter chip reads **"Books (43)"** while one book exists: it counts the build's
  saved `filters.books` list, which nothing reconciled against the new content.
- The tray's whole warning is one sentence, verbatim: *"Nothing imported yet — adding these puts
  the app's built-in books behind them."* It does not name 43, and it renders 1,693px above the
  viewport (B1-02).

### Major

| id | verdict | my measurement | severity | note |
|---|---|---|---|---|
| B1-02 · the tray renders off-screen | **CONFIRMED** | After "Add pasted JSON": `#importModal .mb`.scrollTop **1832.5**, `#libTray` top **-1693.25** (offsetTop 139), `#importApply` top **-1556.75** ("Add 1 book"), `#importReport` top **-1710.5**. Scroller 2,531 x 698. B1's four numbers reproduce to within 0.5px. | kept | `#pasteTog` does scroll the paste box into view (scrollTop 0 -> 1734.5); only the tray is left behind |
| B1-03 · no designed focus indicator | **PLAUSIBLE, evidence struck** | `src/styles.css` contains **23** rules whose selector matches `:focus`, 8 of them `:focus-visible` with a 2px `--accent` outline (lines 136, 442, 461, 728, 737, 772, 845, 958, 968, 1375, 1394, 2021, 2077, 2168, 2192, 2260, 2264, 2286, 2296, 2313, 2332, 2333, 2476). B1's "0 rules" is wrong, and B2 contradicted it correctly. What survives: of 19 visible focusable controls on the default page, **2** are covered by an authored rule and **17** fall back to Chrome's default (measured live: `rgb(153,200,255) auto 1px` after a real Tab). `.btn` has no base rule. | kept at major | The finding is right, the number that carries it is not. See also 5.1, which is worse than what B1 described |
| B1-04 · modals have no dialog semantics | **CONFIRMED** | 14 `.modal` roots, **2** with `role="dialog"`, **0** with `aria-modal`, 0 `<main>`. Opening `#buildModal` left `document.activeElement` on `body`; 17 controls behind it stayed tabbable on an empty build (B1's 263 was on a populated one); `.wrap` carries no `inert`. Escape on `#buildModal` left it open. The one handler (app.js:7645) covers gpick, fam, a raised `#pickModal`, the spell modal, tips, the build-switch menus and the timeline: 4 of 14. Escape on `#entityModal` also left it open. | kept | B2-01 counts the same thing as 11 of 13 and is off by one, see section 2 |
| B1-05 · the guide stage is 9.5% filled | **CONFIRMED, number refined** | `#gStage` measures 1008 x 851.75 at 1280x900, chain column 272px. Counting every visible stage child (`.gcard` + `.gnav` + `.gend`), fill across four consecutive steps is **11.22%, 22.70%, 26.97%, 11.22%**. The card is 640px wide in a 1008px stage and 117 to 311px tall, parked top-left. B1's 9.49% counts the step card alone on a cold first step, which is the floor rather than the typical value. | kept | The substance holds at every step measured |
| B1-06 · three contrast failures | **PARTLY STRUCK: 2 of 3 confirmed, 1 struck** | `.cc-range` "20-foot-radius" **3.85:1** and `.cc-save` "Dexterity saving throw" **3.80:1**, both 14px on `--panel` `rgb(255,253,248)` in light: exact, and both fail SC 1.4.3. `.lt.lt-count > b` "0/1" in dark measures **5.23:1**, not 4.35, on the real composited background `rgb(43,27,24)`; its `small` measures **5.38:1**. Those are D152's own published figures reproduced to two decimals. A corrected sweep of `#tlModal` returns **0 failures in 100 nodes**. | major kept, content halved | See 1.2 |

**1.2 · why B1-06's third row is struck.** `.lt-count.tlalert`'s fill is
`color-mix(in srgb,var(--bad) 9%,var(--bg))`, which Chrome computes to `color(srgb …)`. A probe
that only parses `rgb()` and `#hex` skips that background and measures the ink against the card
underneath the plate instead. B1 reports the background as `rgb(55,43,31)`, which is exactly the
value a probe with that gap produces, and 4.35 is exactly what falls out of it. D152 measured and
solved this tile on 2026-09-01, deliberately replacing a tint with an opaque plate for this
reason, and the plate is working. **A finding that re-opens D152's fix on a mis-measurement is
struck.** Consequence for the rest of B1: any of its contrast numbers taken over a `color-mix()`
surface is unsafe. There are 29 `color-mix()` calls in `styles.css`.

| id | verdict | my measurement | severity | note |
|---|---|---|---|---|
| B1-07 · "all set" while two subclasses are unchosen | **CONFIRMED** | Wizard 5 / Cleric 4 built through the UI. `#choicesChip` "all set", `state.choices` `{}`, both class rows carrying `SUBCLASS — PICK ONE`, `#clvlChip` "L9 / 9" with a live `.chipwarn` icon, timeline rows "Subclass — not chosen" twice. `renderChoices` counts pending as `c.type==="pick"` only. | kept | Sharper than reported: the "all set" chip sits in the header of the same card whose body lists "1 choice · Divine Order · Choose one" |
| B1-08 · a required either/or is answered for the reader | **CONFIRMED** | The Divine Order `<select>` has 2 options, no empty first entry, `selectedIndex` 0, `value` "Protector", with `state.choices` `{}`. | kept | Documented model (app.js:1325-1331), so this is a display question, not a bug |
| B1-09 · reordering is drag-only | **CONFIRMED** | `#tlModal` holds **9** `[draggable=true]` rows and **0** descendants with `role`, `aria-checked` or `aria-selected`. No keyboard path. | kept | The modal root itself does carry `role="dialog"` |
| B1-10 · "Wizard" truncates to "Wiza" at 375 | **PLAUSIBLE, wrong example** | At 375 the class `<select>` is 88px with 8px + 28px padding, so **50px** of text width. In real Chrome on macOS with the app's own font stack, "Wizard" measures **42.3px** and fits. What does not fit: "Sorcerer" 52.0, "Fighter ·" 50.1, "Barbarian ·" 65.4, and the subclass placeholder "— none —" at **59.7px**. `text-overflow` is `clip`, so all four cut mid-word. | minor kept | B1 ran headless, where the fallback font is wider. The class of defect is real; the named example is not |

### Minor

Sampled at random, seed **20260901**, Fisher-Yates over the 16 minors, first 8:
**B1-12, B1-13, B1-19, B1-21, B1-22, B1-23, B1-24, B1-26**. B1-11, B1-14, B1-15, B1-16, B1-17,
B1-18 and B1-20 were also checked while other findings were being reproduced, and are reported.

| id | verdict | my measurement | severity |
|---|---|---|---|
| B1-11 · `aria-expanded` on 6 of 13 triggers | **CONFIRMED** | Present on `bswBtn`, `srcActBtn`, `addFilesBtn`, `fBooksBtn`, `csrcNumsBtn`, `csrcRuleEdit`; absent on `menuBtn`, `filterBtn`, `tMenuBtn`, `entMenuBtn`, `pickLevelBtn`, `famMenuBtn`, `prepLevelBtn`. Exact match. | kept |
| B1-12 · the take button has no `aria-pressed` | **CONFIRMED** | **196** `.tk` buttons rendered, **0** with `aria-pressed`. State is a `.on` class plus a check icon plus a `title`. | kept |
| B1-13 · the origin chip repeats "built-in" 43 times | **CONFIRMED** | 43 of 43 `.libchip` read `built-in` with no import. | kept |
| B1-14 · nine books show their code | **CONFIRMED** | The "Other" group holds exactly `LLK, IDRotF, AitFR-AVT, UATheMysticClass, DSotDQ, EEPC, WBtW, LR, TTP`, all 9 identical to a `DATA.sources` key. Groups: 2024 core 1, 2014 core 2, Supplements 12, Settings & adventures 19, Other 9. | kept |
| B1-15 · the Pages build calls SRD 5.2 the 2024 PHB | **CONFIRMED** | `data/data-srd.json` holds one source, code `XPHB`, `name` "Player's Handbook (2024)", 339 spells. | kept |
| B1-16 · three near-identical empty states at once | **CONFIRMED** | On a restored empty build, all three render together: "No slots — add a spellcasting class.", "No spellcasting class yet. Add one on the left, then pick spells from the list below.", "Add a spellcasting class / Then its spells appear here to browse and pick." | kept |
| B1-17 · the theme is not persisted | **CONFIRMED** | `#themeBtn` (app.js:9718) sets the attribute and returns. Toggling wrote **0** new localStorage keys; no key matches `/theme/`. | kept |
| B1-18 · the import report prints four zero counts | **CONFIRMED** | Live: "Read 1 file — 1 spells · 0 classes · 0 subclasses · 0 feats · 0 species." Both halves reproduce on `main`; B1's pluralisation fix lives only in its own worktree. | kept |
| B1-19 · inert chips are focus stops | **CONFIRMED in kind** | `.bchip` carries `tabindex="0"` with no `role` and no `aria-describedby`; the tip lives in a detached `.sptip`. Count is per surface (2 of 23 chips on the build view I measured, not 43). | kept |
| B1-20 · the species picker does not close | **CONFIRMED** | After picking High Elf the modal stayed open, no control labelled Done or Close beyond the x, and `#speciesBtn` behind already read "Elf — High Elf". Escape also left it open. | kept |
| B1-21 · pickers do not use the height available | **CONFIRMED** | `#entityModal .box` measures **645px** in a 900px viewport on 127 rows; `max-height` is `none` and `.mb` `overflow-y` is `visible`. `#importModal .box` resolves to `820px`. Exact. | kept |
| B1-22 · undersized targets at 375 | **CONFIRMED, counts differ** | My sweep: **249** targets, **221** under 24x24, **0** WCAG 2.5.8 spacing violations. Smallest is the pick chip remove at exactly **10 x 10** with `aria-label="Remove"`, and `.tk` at 76.5 x 21.8 (B1's 76.5 x 21.75). B1's 112/82 is the same picture on a smaller render. | kept |
| B1-23 · the timeline order flag has no name | **CONFIRMED** | `#tlOrder`: 13 x 13, `tabindex="0"`, no `aria-label`, empty text content. | kept |
| B1-24 · the health warning is only reachable through the chip | **CONFIRMED** | On the Wizard 5 / Cleric 4 build `#healthBar` was `.hidden` while `#clvlChip` carried a `.chipwarn`. Chip 63.2 x 22, glyph **11 x 11**, `aria-hidden` svg, no accessible name. | kept |
| B1-25 · the timeline prints both branches | **CONFIRMED** | The L6 row reads "Cleric 1 · Divine Order · Protector · Spellcasting · Thaumaturge". | kept |
| B1-26 · "Prepare daily" named where it does not exist | **CONFIRMED** | Build view: "Fixed growth, no retraining. Use Prepare daily to pick 9 from the book." `#prepDailyBtn` resolves inside `#tableView`. | kept |

### Polish

| id | verdict | my measurement | severity |
|---|---|---|---|
| B1-27 · chip text sits low | **CONFIRMED, number differs** | 43 `.libchip`: horizontal delta **0.00** on every one; vertical (top minus bottom) **-0.50** on every one, identical at both widths. B1 reports 1.00 for this class. Either way it is a quarter of a pixel and the cause is half-leading, not layout. | kept |
| B1-28 · dark borders fail 1.4.11 | **CONFIRMED** | Computed from the literals: dark `--line` 1.45 / 1.33 / 1.21 and `--line-strong` 1.84 / 1.68 / 1.53 over `--bg` / `--panel` / `--panel-2`; light `--line` 1.85 / 2.22 / 1.92 and `--line-strong` 3.02 / 3.63 / 3.14. Every figure matches B1 exactly. | polish -> minor, see 4 |
| B1-29 · `--radius` and `--shadow` are dead tokens | **CONFIRMED** | 158 `border-radius` declarations, `var(--radius)` in **2**. 14 `box-shadow` declarations, `var(--shadow)` in **4**; the other 10 are one-off, of which 5 are the floating family B2-07 names. | kept |
| B1-30 · the badge rule is dead CSS carrying a hazard | **CONFIRMED as a rule, its conclusion STRUCK** | The rule is not dead. `#pickLevelBtn .badge` (app.js:3497) and `#prepLevelBtn .badge` (app.js:4885) both render. Reproduced live: opened the spell picker, set a level filter, and `#pickLevelBtn .badge` rendered white on `--accent` at 10px, measuring **2.57:1** on screen. B1's "nothing is failing on screen today" is wrong. | **polish -> major** |
| B1-31 · reduced motion covers 2 of 24 | **CONFIRMED** | 23 `transition:` and 3 `animation:` declarations, two `@media (prefers-reduced-motion:reduce)` blocks (514, 1940). | kept |
| B1-32 · `theme-color` light is off `--bg` | **CONFIRMED** | `#f4f1ea` at HSL L 93.7 against `--bg` `#eee8da` at 89.4, delta **4.3**. The dark pair `#17140f` matches `--bg` exactly. | kept |
| B1-33 · "≈ <1 MB in this browser" | **CONFIRMED** | Live status strip: "43 books · built-in books only · ≈ <1 MB in this browser". | kept |

**B1 tally:** 33 findings. **26 CONFIRMED**, 3 confirmed with a refined or corrected measurement
(B1-05, B1-10, B1-27), 2 PLAUSIBLE with their stated evidence struck (B1-03, B1-30 in part),
1 partly struck (B1-06, one of three rows), 1 confirmed with its scope narrowed (B1-01).
**Nothing was struck outright.** Severity moved on two: B1-30 up, B1-28 up.

---

## 2. B2 verdicts, with my counts beside theirs

| id | verdict | B2's number | my number | note |
|---|---|---|---|---|
| B2-01 · 11 of 13 modals lack `role="dialog"` | **CONFIRMED, count wrong** | 13 modals, 11 without | **14** `id="…Modal"` roots, all of them `class="modal"`; **2** with `role="dialog"` (611, 657); **12** without; **0** `aria-modal` anywhere | B2's own list in section 6 names 12 ids while the prose says 11. B1's 14/2 is right. Additive markup, no `Rejected:` clause reopened |
| B2-02 · no `<main>` landmark | **CONFIRMED** | 0 `<main>` | `grep -c "<main"` = **0**; live `document.querySelectorAll('main').length` = **0**; landmarks are 1 header, 1 nav, 1 footer | Size S stands |
| B2-03 · `.tabs` has no tab semantics | **CONFIRMED** | none | `grep 'role="tab'` across `index.html` and `app.js` returns **0 hits** | |
| B2-04 · `.btn.danger` has no look until armed | **CONFIRMED, measured** | rule absent | Live on `#libSelRemove`: pre-arm `color rgb(236,228,214)` (`--ink`), `border rgb(76,65,48)` (`--line-strong`), `background rgb(33,29,22)` (`--panel`), identical to a neutral `.btn`. After one click: `color`/`border` `rgb(240,97,110)` (`--bad`), `background rgba(240,97,110,0.11)`, label "Confirm?" | The measurement B2 could not take, because it opened no browser |
| B2-05 · no type, radius or spacing scale | **CONFIRMED, counts corrected** | font-size ~365 decls / 26 values; radius ~150 / ~15; gap ~180 / ~15 | font-size **357** declarations, **26** distinct (25 real plus a `0`); border-radius **158** declarations, **24** distinct literal forms; `gap` **195** declarations, 16 distinct px values plus print mm | B1's 357 and 158 are the accurate ones |
| B2-06 · `.bchip` built at 4 sites | **CONFIRMED** | 4 sites, `abChip` bypassed twice | `.bchip` template at app.js **8150, 8283, 8567 (`bkTag`), 8673**; `abChip()` defined at 7688 and bypassed by hand-built `span.abchip` at **3365** (DOM) and **8076** (template) | Exact |
| B2-07 · five notice components, no base | **CONFIRMED** | 5 at 476, 923, 937, 1407, 2395 | Same five lines, each independently declaring `border-radius:10px` and a bordered tinted flex row with `padding:9px 12px` or `11px` | Exact |
| B2-08 · `--ab-*`/`--cc-*` not restated for print | **CONFIRMED** | 11 tokens missing | Grep of `styles.css:1673-1898` for `--ab-` or `--cc-` returns **0 hits**; both print `:root` blocks restate 17 base tokens and `--shadow` only | The reach into print is real: `printCardHTML` runs prose through `ccText` |
| B2-09 · `tlrefuse` not reduced-motion guarded | **CONFIRMED** | 1 animation uncovered | `@keyframes tlrefuse` at 1333, used at 1332; the two guard blocks are at 514 and 1940 and neither names it | |
| B2-10 · `table.spelltable .achip` is dead | **CONFIRMED** | dead half-selector | `.achip` is emitted at app.js 7788, 7797 and 8172, always inside `.achips` in a modal, never inside `table.spelltable` | |
| B2-11 · `--mono` referenced, never defined | **CONFIRMED** | 1 use, 0 definitions | `grep -- "--mono"` across `styles.css`, `app.js`, `index.html` returns exactly **one** line, `styles.css:99`, the usage | |
| B2-12 · `.btn` has no base `:disabled` or `:focus-visible` | **CONFIRMED** | comments at 511, 2200 admit it | Confirmed, and quantified: of 19 visible focusable controls on the default page, **17** match no authored focus rule | Feeds B1-03 |

**B2 tally:** 12 findings, **12 CONFIRMED**, **0 struck**. Two carry counting errors that do not
change the finding (B2-01 by one, B2-05 by tens). One inventory omission: B2 reports **32**
custom properties; `styles.css` defines **33**. The missing one is **`--gbh`** (`styles.css:1944`,
the guide-aside header height, read at 1945, 1964, 1965). With the undefined `--mono` that is 34
names in play, not 32.

**Consolidation candidates checked against the decision record.** None re-proposes a rejected
option. `.bchip` versus `.srcbadge` is D39 and B2 keeps them apart correctly. `--muted` as the
quiet floor is D151 and B2 does not touch it. The alert plate is D152 and B2 does not touch it.
B2 goes further and explicitly warns the synthesis not to "spread the light ink hues apart",
which would undo D145(a); that warning is correct and is the single most useful line in the
report. `box-shadow`: B2 says 7 one-off declarations, the file has **10**, but the five-recipe
floating family it proposes to collapse is exactly right.

---

## 3. Palette reconciliation, B1 section 3 against B2 section 1

I recomputed the whole matrix from the CSS literals independently of both reports.

**They agree, and B1's numbers are right to two decimals.** Every cell I computed matches B1
section 3.2: light inks 5.43 to 5.60 on `--bg`, 6.52 to 6.73 on `--panel`, 5.63 to 5.81 on
`--panel-2`; `--cc-dice` 3.77 / 4.53 / 3.91; `--cc-dc` 3.16 / 3.80 / 3.28; `--cc-dmg` 4.45 /
5.35 / 4.62; `--cc-cond` 4.79 / 5.76 / 4.97; `--cc-range` 3.20 / 3.85 / 3.32; every dark text
token passes with `--bad` on `--panel-2` lowest at 4.81; the border rows exactly as B1 prints
them. Two small corrections: the light `--ab-*` band is 6.49 to **6.64** / 7.80 to **7.98** /
6.73 to **6.89**, slightly wider than B1's stated upper bounds, and the light `--cc-*` cells
failing 4.5:1 number **9**, not 6 (cc-dice 2, cc-dc 3, cc-dmg 1, cc-range 3). The asymmetry B1
names is therefore stronger than it claims: 9 of 15 light content cells fail, 0 of 15 dark.

**The one place they read the same fact differently is the light equal-luminance cluster.** B1
section 3.3 records `--accent` at L 35.9 and `--muted` at L 35.7 as a compression, and notes
"the relative emphasis order is not preserved across themes". B2 section 1 records the same
cluster and states plainly that it is D145(a) working as designed and must not be "fixed".
**B2 is right.** D145(a) derives every ink to the same contrast floor against every surface it
can land on, so equal luminance is the method's output, not a defect; my matrix confirms it
(light muted / accent / gold / good / free / bad all land within 0.17 of each other on `--bg`).
The two reports do not actually conflict in what they would have Francesco do, because B1 never
raised it as a finding, but the observation needs B2's frame attached to it before it reaches
triage, or someone will act on it.

**Where B1 and B2 do conflict, on focus rules, B2 is right.** B1-03 asserts zero `:focus` rules
in `styles.css`; B2 section 4 names three `:focus-visible` instances. The file holds 23. See 1
and 5.1.

---

## 4. Standards mapping

Every WCAG claim in the two reports, with the criterion it belongs to and whether the measured
value fails it or misses a best practice.

| finding | criterion | level | verdict |
|---|---|---|---|
| `.cc-range` 3.85:1, `.cc-save` 3.80:1, light, 14px 600/700 | **1.4.3 Contrast (Minimum)** | AA | **Fails.** 14px at weight 600 or 700 is not large text (large is 18.66px bold or 24px), so the threshold is 4.5:1 |
| `#pickLevelBtn .badge` / `#prepLevelBtn .badge` 2.57:1, 10px | **1.4.3** | AA | **Fails**, and it renders. This is the one live 1.4.3 failure both reports missed or dismissed |
| `.lt-count.tlalert` in dark | 1.4.3 | AA | **Passes** at 5.23:1 and 5.38:1. B1's failure is a probe artefact |
| dark `--line-strong` at 1.53 to 1.84 over the three surfaces | **1.4.11 Non-text Contrast** | AA | **Fails** where it is the visual boundary of an input, button, switch or chip, which is what it is for. This is a real AA failure, not polish, which is why B1-28 moves up |
| dark `--line` at 1.21 to 1.45 | 1.4.11 | AA | **In scope only where the hairline is the boundary of a control.** A purely decorative divider is out of scope, so part of B1-28 is best practice rather than a failure. B1 does not make this split |
| 221 of 249 targets under 24 x 24 at 375 | **2.5.8 Target Size (Minimum)** | AA | **Passes.** 0 spacing-exception violations measured (no undersized target has another target's centre within 24px). Both reports say so. The 10 x 10 remove control is a usability finding, not a conformance one |
| no `role="dialog"`, no `aria-modal`, no accessible name on 12 of 14 modals | **4.1.2 Name, Role, Value** | A | **Fails.** A surface that behaves as a dialog and exposes none of it |
| 196 `.tk` toggles with no `aria-pressed` | **4.1.2** | A | **Fails.** The state is conveyed by class and icon only |
| `aria-expanded` absent on 7 of 13 popover triggers | **4.1.2** | A | **Fails** on those seven |
| no `<main>` | 1.3.1 Info and Relationships / ARIA landmark practice | A / best practice | Best practice. Not a strict 1.3.1 failure, but it is the cheapest fix in either report |
| focus stays on `body` when a modal opens, background stays tabbable | **2.4.3 Focus Order** | A | **Fails** in effect: the reading order after opening a dialog is the page behind it |
| 17 of 19 controls fall back to the UA focus ring | 2.4.7 Focus Visible | AA | **Passes** as long as the UA ring is not suppressed. It is visible. The finding is consistency, not conformance |
| the authored ring on inputs, selects and checkboxes at 1.2:1 | **2.4.7** where it replaces the UA ring | AA | See 5.1. **Fails for the checkbox**, which has no compensating signal; 2.4.13 Focus Appearance (AAA) is failed by all of them |
| `.tabs` with no `role="tablist"` | 4.1.2 | A | Best practice here, not a failure: they are real buttons with real labels and the pattern is a button group, not a claimed tab widget |
| `tlrefuse` uncovered by reduced motion | 2.3.3 Animation from Interactions | AAA | Best practice. A single 0.35s colour pulse with no transform |

---

## 5. What the auditors missed

Three, each measured by me, each marked as mine.

**5.1 · The one authored focus rule that covers ordinary controls paints a ring at 1.2:1, and on
the Library's checkboxes there is nothing else.** `styles.css:136`
`select:focus,input:focus{outline:2px solid var(--accent-soft);border-color:var(--accent)}` and
`styles.css:728` `input[type=checkbox]:focus-visible{outline:2px solid var(--accent-soft);
outline-offset:1px}`. `--accent-soft` is `#d9915f1f`, twelve percent alpha. Composited: the ring
measures **1.20:1** over `--bg`, **1.22:1** over `--panel`, **1.23:1** over `--panel-2`. Verified
live with a real Tab press: a focused Library row checkbox computes
`outline: rgba(217,145,95,0.12) solid 2px`, `outline-offset: 1px`. For `<input>` and `<select>`
the accompanying `border-color:var(--accent)` is the thing actually carrying the state, so the
outline is merely inert. The checkbox rule has no such companion, so the 43 selection checkboxes
that D154(e) made the Library's primary control have a focus indicator that is effectively
invisible. This is worse than B1-03 describes: the rule does not leave the browser default in
place, it replaces it with something weaker.

**5.2 · The active-filter chip counts a books list that no longer matches the data, and the class
select tells the reader the opposite of the truth.** After the paste import, on an **empty**
build, `#actFilt` read "Books (43)" while `DATA.sources` held one book, and `#addClass` offered a
single option reading "every class is already in this build" while `DATA.classes.length` was 0.
Neither needs a populated build, and neither is downstream of a pick. B1 folds both into B1-01's
level-9 repro; they are one step earlier and one of them is a sentence that is simply false.

**5.3 · The strings inventory's `app.js` line numbers are systematically three too high above
roughly line 6000.** Of a 60-row random sample, 21 locations do not resolve to the cited line and
**19 of those 21 are off by exactly -3**, every one of them above `app.js:6036`. Below that the
same sample resolves exactly. The inventory was written against a working copy carrying three
extra lines that `main` at v1.5.8 does not have. Anyone acting on the inventory in wave 3 has to
apply that offset or they will edit the wrong line. See section 6 for the full numbers.

---

## 6. The string inventory: precision and recall

**Sampler:** Fisher-Yates over all 1,370 parsed rows with an LCG seeded at **20260901**
(`x = (1664525x + 1013904223) mod 2^32`), first 60 taken. Verification normalises curly quotes,
splits each string cell on `${…}` placeholders and on the `/` alternative separator, and searches
the cited file for the nearest line carrying any literal chunk.

**Row and tell totals reproduce exactly.** 1,370 rows parsed, 1,370 carrying a `file:line`
location, 263 with at least one tell. Tell counts: em dash 166, ellipsis placeholder 72, states
the obvious 18, Title Case in label 10, triplet 7, emoji 5, just 4, hedge 3, and zero for simply,
seamlessly, "Note:" and exclamation mark. Every figure matches B1 section 5.

**Precision, location.** 36 of 60 resolve to the cited line exactly (**60%**). 57 of 60 resolve
within 3 lines (**95%**). The residue: 19 rows off by exactly -3 (see 5.3), 2 off by -1 which are
probe artefacts on short repeated strings, 1 row whose "string" cell is a description rather than
a string (`app.js:3931`, "(build row Delete)"; the real `aria-label="Delete"` is at 3929), and 1
row whose file is wrong (`app.js:9717` for "Reset build"; the string is at `index.html:63`, and
9717 is the theme handler). **Two rows in 60 are wrong rather than offset: 3.3%.**

**Precision, tells.** Checked mechanically across all 1,370 rows, not just the sample:

| tell | labelled | mechanically present | false positives | false negatives |
|---|---|---|---|---|
| em dash | 166 | 166 | 0 | 0 |
| ellipsis placeholder | 72 | 78 | 0 | 0 real (see below) |
| just | 4 | 4 | 0 | 0 |
| exclamation mark | 0 | 0 | 0 | 0 |
| simply / seamlessly | 0 | 0 | 0 | 0 |
| emoji | 5 | 4 | **1** | 0 |

The em dash classification is perfect: 166 labelled, 166 present, no drift in either direction.
The six unlabelled ellipses are the document's own elision notation (`` `Abjuration` … `Psionic` ``
meaning "and the rest"), not UI strings; that is a notation ambiguity worth a one-line legend,
not a miss. The one emoji false positive is `app.js:3627`, where the string cell reads `[spark]`:
that is `ICONS.spark`, an inline SVG, which is what D57 requires. The other four (`✦`, `✓`, two
`⚠`) are real character glyphs standing in for icons and the tell is fair.

**Recall.** I walked the Library page in full, every disclosure expanded and both popovers open,
and collected every visible text node plus every `aria-label`, `title` and `placeholder`: **248**
distinct values, of which 156 are visible text and the rest accessible names, titles and
placeholders. **Every one resolves to an inventory row.** Two are filed under a different
surface heading than the one they render on (the five book group labels `2024 core` /
`2014 core` / `Supplements` / `Settings & adventures` / `Other` sit in "Spell list and filters"
at rows 456 and 457, because the same labels also render in the filter's books sub-panel), which
is an attribution imprecision, not a gap. **Recall on the surface walked: 100%.**

**On the ellipsis tell rule itself.** The 72 `…` placeholders are not 72 defects. `PLAN.md:140`
carries "**The `…`-placeholder family needs one call**" as an open ⚑ owned by Francesco since
2026-08-30, naming "+ add a class…", "cantrip leaving…", "its replacement…", "filter books…",
"note — e.g. …" plus the same-shaped `<select>` no-filter options `all schools` / `all classes`
(index.html:139-140), `any save` / `any damage` (app.js:6383-6384) and `#fChosen`'s `picked`.
They are internally consistent, and one call settles all of them. B1 says exactly this, and it is
correct: the wave-3 rewrite must not silently change any of them.

---

## 7. Storage restore proof

Origin `http://localhost:8013`, a profile that has never held anything of Francesco's. It held
**2 localStorage keys, 1,888 bytes**, and an **empty** IndexedDB `spellForge` -> `kv` store.

One correction to B1's storage section: it infers from 8011 and 8000 showing the same two keys at
the same byte lengths that "the store does appear to be shared across localhost ports". It is
not. Origin 8013 also holds exactly two keys at exactly 1,176 and 292 bytes, and the contents are
a freshly auto-created build named "New character" with `created` stamped today and
`classes: []`. The lengths match across ports because an auto-created empty build is
deterministic in size, not because the store is shared.

| | before | after work | after restore |
|---|---|---|---|
| localStorage keys | `spellForge.builds.v1`, `spellForge.sources.v1` | same 2 | same 2 |
| key set diff vs baseline | n/a | empty | **empty** |
| `JSON.stringify(localStorage)`.length | 1,888 | 1,902 | **1,888** |
| `spellForge.builds.v1`.length | 1,176 | 1,181 | **1,176** |
| `spellForge.sources.v1`.length | 292 | 297 | **292** |
| IndexedDB `kv` keys | `[]` | `[]` after removal | `[]` |
| byte-identical to baseline | n/a | no | **`identical: true`** |

The 14 bytes of drift during the work were the build's `updated` timestamp (5 bytes) and the
pseudo-source `"HB"` (5 bytes plus separators) that `applyPlan` adds to
`spellForge.sources.v1` on every apply and that the removal path does not take back out. Worth
knowing: **an import followed by a removal is not byte-reversible**; it leaves `HB` in the saved
source list. Harmless, since `HB` is the homebrew pseudo-source and is always on by design, but
it means "remove restores the previous state" is true of content and not of the source
preference.

Restore was by writing the captured baseline back key by key after a `clear()`, then verified
three ways: `JSON.stringify(localStorage) === baseline` returned **true**, the key-set diff was
empty, and after a full page reload the app came back to 43 books, 936 spells, an empty build
and `kv.getAllKeys()` still `[]`. The verify gate was run at the end and is green, including
`node scratchpad/cparity.js` with 0 fails.

---

## 8. Overall verdict

Pillar B is trustworthy. Of 45 findings across the two reports, 44 survive in substance and one
row of one finding is struck outright; the strike, B1-06's dark timeline tile, matters less for
what it removes than for what it reveals, which is that B1's contrast probe cannot read
`color-mix()` and that its clean sweeps over the 29 surfaces using it are therefore weaker
evidence than they look. B1 is strongest where it drove the app: the tray offsets reproduce to
half a pixel, the "all set" contradiction reproduces exactly, the import collapse reproduces
exactly, and the token matrix in its section 3 is correct to two decimals against an independent
recomputation. It is weakest where it counted files rather than measuring them: the claim that
the stylesheet holds no focus rules is simply false, and the claim that the white-on-accent badge
never renders is false in the opposite direction, which turned the one live AA contrast failure
in the product into a polish note. B2 is the more reliable document per claim, with all twelve
findings confirmed and none reopening a decision, but it counts loosely (modals off by one,
shadows off by three, a whole custom property missed) and it never opened a browser, so the two
reports are complementary rather than redundant: where they disagree, B2 was right about the
focus rules and B1 was right about the modal count. The string inventory is the most solid
artefact of the three: its tell classification is mechanically perfect on the tell that dominates
it, and its recall on a fully walked surface is complete. Its line numbers are not, and the
wave-3 rewrite has to correct for a systematic -3 above `app.js:6000` before it edits anything.
Where the pillar is thin: nobody measured the print sheet in a real browser (B1 lifted the rules,
which is the documented method but is not the same thing), nobody opened the pick, prepare or
forms modals to sweep them, and the `color-mix()` surfaces have not been swept correctly by
anyone.

---

## 9. Surviving blocker and major items, ranked

1. **B1-01 · a paste import replaces the whole content set** (blocker). Fires on any profile with
   no prior import, which is the Pages visitor and the dev page, not Francesco's own library. When
   it fires: 43 books to 1, an unreadable build, and four surfaces reporting four different wrong
   facts. The warning is one abstract sentence rendered 1,693px off-screen. Cheapest half is the
   copy and the placement; the merge is a D86/D112 model change.
2. **B1-30 · white on `--accent` at 2.57:1, live** (was polish, now major). `#pickLevelBtn .badge`
   and `#prepLevelBtn .badge` render this on a real path, reproduced on screen. It is the only
   confirmed live WCAG 1.4.3 failure with a hard-coded colour behind it, and the fix is one
   declaration.
3. **B1-04 · no dialog semantics, no focus management, Escape on 4 of 14** (major). 4.1.2 and
   2.4.3, 12 modals, one shared open/close helper.
4. **B1-02 · the pending tray renders off-screen on the paste route** (major). Half of blocker 1
   and the cheaper half.
5. **New, 5.1 · the authored focus ring is 1.2:1 and the Library checkbox has nothing else**
   (major). Two declarations, and it is a precondition for fixing B1-03 correctly rather than
   adding a third weak ring.
6. **B1-03 · no focus treatment on `.btn`, 17 of 19 controls on the UA default** (major, evidence
   corrected). One `:focus-visible` rule, plus the `.swk` and `.tk` shapes.
7. **B1-06 · `--cc-range` 3.85:1 and `--cc-dc` 3.80:1 in light** (major, two rows not three).
   9 of 15 light content cells fail 4.5:1 against 0 of 15 in dark. This is the half of D145 that
   was not done, on the content palette.
8. **B1-07 and B1-08 · the Choices card says "all set" over an unanswered choice, and a defaulted
   either/or reads as chosen** (major, both). One counting fix and one display rule; both touch
   the model note at app.js:1325-1331 and need Francesco's call.
9. **B1-05 · the guide stage runs 11% to 27% filled at 1280** (major). A composition call under
   D126 and D131(c), not a bug.
10. **B1-09 · the level plan reorders by drag only** (major). No keyboard path, no roles.
11. **B1-28 · dark `--line-strong` at 1.53 to 1.84** (was polish, now minor to major depending on
    scope). Where it bounds a control it is a 1.4.11 AA failure; where it is a decorative
    hairline it is not. That split is not in either report and should be made before the fix.
12. **B2-01 and B2-02 · 12 of 14 modals unnamed, no `<main>`** (major and minor). The same work as
    item 3 for the first; the second is a one-element change.
