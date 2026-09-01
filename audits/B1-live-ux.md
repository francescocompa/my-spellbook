# B1 — live UX audit

Pillar B, agent 1 (D157(c)): the app driven in a real browser, every scenario walked at 1280
and 375 in both themes, with measurements taken in the page rather than eyeballed.

- **Date:** 2026-09-01 · **Version under test:** v1.5.8 (`#appVer` read live)
- **Builds tested:** `src/index.html` (dev, 43 baked books) and `docs/index.html` (Pages, SRD 5.2)
- **Method:** headless Chrome 152 driven over CDP from `scratchpad/cdp.js`; measurement helpers
  injected from `scratchpad/probes.js`; every number below was read from the live DOM. Print was
  checked by lifting the 121 rules inside the `@media print` blocks into a screen stylesheet and
  rendering at 794px, the A4 portrait content width (CLAUDE.md).
- **Screenshots:** `audits/img/B1-01.png` to `B1-30.png`.
- **Companion files:** `audits/strings-inventory.md` (the copy rewrite's input).

## Storage

The browser-pane origin `http://localhost:8011` was snapshotted before anything was touched and
re-read at the end. It held **2 localStorage keys, 1,888 bytes**, and an **empty** IndexedDB
`kv` store (no `import` key). A second pane tab on `http://localhost:8000` shows the same two
keys at the same byte lengths, so the store does appear to be shared across localhost ports in
this browser, which is why the restore check below matters.

Francesco's 44-book digest is **not** reachable from this origin: `kv.getAllKeys()` returns `[]`,
and the 43 books the dev build shows come from the baked `data/data.js`, not from an import. The
scenarios were therefore run in a **separate headless Chrome profile** created for this audit,
and the first-run scenario in an isolated browser context inside it, so nothing he owns was in
reach at any point. Restore proof is in section 8.

Consequence for S3: the "digest byte-identical" check the brief asks for was run against an
empty baseline (no digest before, none after). The removal path itself was still exercised end
to end and returned the library to exactly its 43 built-in books.

---

## 1. Surface map

### 1.1 Surfaces

| # | Surface | Reached by | Owns | Model | Shots |
|---|---|---|---|---|---|
| S01 | Header bar | always | identity, build switch, guide entry, tab pair, settings | — | B1-01 |
| S02 | Build switcher popover `#bswPop` | header chip | switch build without the manager | v7 T4 | — |
| S03 | Settings menu `#menuPop` | header ⋯ | ten actions in three groups | D144(a) | B1-26 |
| S04 | Build / Spell table tabs | header | which of the two views is showing | — | B1-01 |
| S05 | Guide CTA card `#guideCta` | empty build only | the entry into the walk | D126(i) | B1-23 |
| S06 | Gap bar `#gapBar` | a pick whose book is off | flagged, never pruned | D42, T2 | B1-20 |
| S07 | Health bar `#healthBar` | the sweep found something | what does not add up at this level | E4 | — |
| S08 | Swap bar `#swapBar` | an armed level-up swap | the pending replacement | D115(g) | — |
| S09 | Character card `#secChar` | Build view | class rows, species, feats, spell sources | D44, D114 | B1-03 |
| S10 | Choices card `#choicesCard` | a build carrying choices | every open choice, grouped by giver | D30, D43, D142(a,b) | B1-03 |
| S11 | Slots and casts `#secSlots` | Build view | stat tiles, slot row, limited casts | — | B1-01 |
| S12 | Prepared budget and picks `#secPicks` | Build view | per-caster budget bars, budget tiles, pick chips | D124 | B1-03 |
| S13 | Eligible spells `#secSpells` | Build view | the browse-and-pick list, level groups | D39, D142(e) | B1-03 |
| S14 | Filter panel `#filterPanel` | funnel icon | ten filter controls plus the books sub-panel | D142(c) | B1-27 |
| S15 | Active-filter chips `#actFilt` | a filter is set | the filters you set, named, with clear-all | D142(c) | B1-20 |
| S16 | Spell table view `#tableView` | Table tab | the selected spells as a table, print's source | — | B1-28 |
| S17 | Table options popover `#tMenuPop` | table ⋯ | grouping and column visibility | — | — |
| S18 | Jump bar `#jumpBar` | ≤820px only | one tap per section | D48 | B1-06 |
| S19 | Footer `.credit` | always | version tag, SRD attribution, icon credit | — | B1-05 |
| S20 | Spell detail modal `.spmodal` | a spell name | full rules text, choices block | D149 | B1-29 |
| S21 | Tooltip `.sptip` | hover or focus on a chip | book, page, condition, severity text | D148 | — |
| S22 | Spell picker `#pickModal` | a choice's button | pick spells for one choice | — | — |
| S23 | Entity picker `#entityModal` | species / feat fields | choose a species, feat or optional feature | D142(d) | B1-02 |
| S24 | Custom spell editor `#customModal` | menu, or empty list | four-step homebrew spell builder | D94, D95, D144(b,c) | — |
| S25 | Library `#importModal` | menu → Library | the one-page book list; see 1.2 | D154, D155, D156 | B1-13 to B1-22 |
| S26 | My homebrew `#hbModal` | menu | every custom spell in one list | — | — |
| S27 | Source reconciliation `#srcAskModal` | opening a build wanting other books | keep my books or turn theirs on | — | — |
| S28 | Builds manager `#buildModal` | menu → Builds | switch, rename, export, import builds | D115 | — |
| S29 | New build `#newBuildModal` | Builds → New | character and version name, start empty or guided | D118(i) | — |
| S30 | Print settings `#printModal` | menu → Print | six sheet options, remembered | D108 | B1-04 |
| S31 | Custom source `#csrcModal` | Spell sources field | an item or boon that grants spells | D55, D94, D95, D96 | — |
| S32 | Timeline `#tlModal` | the level chip | level plan, gains, drag to reorder, fork | D115(j), D122, D141, D146 | B1-10 |
| S33 | Guided builder page `#guideView` | header compass | chain column plus decision stage | D126, D130, D131, D132 | B1-11, B1-12 |
| S34 | Guide return bar `#gBack` | guide set aside | which step is held, and the exit | D130(e) | — |
| S35 | Guide pick modal `#gpickModal` | a step's section | one section's picks, over the guide | D131(a,b) | — |
| S36 | Prepare daily `#prepModal` | table view button | today's prepared list, per caster | — | — |
| S37 | Forms chooser `#famModal` | a widened summon spell | the feature's forms, then the spell's | D131(g), D142(d) | — |
| S38 | Print sheet | `beforeprint` | head, tracker, table, legend, cards, notes | D108 | B1-05 |
| S39 | Import report line `#importReport` | Library, after any content action | fetch progress, refusals, receipts | D157(d) | B1-17 |
| S40 | Empty states | eight places | what to do when a list is empty | — | B1-23, B1-28 |

### 1.2 The Library, broken out (D154 and its sub-surfaces)

| Sub-surface | Owns | Model |
|---|---|---|
| Status strip `#libStatus` | book count, origin summary, parser, storage, **Update data** | D154(b), D153 |
| Repository box `#webSrcBox` | the editable 5etools address, behind Actions | D155(b) |
| Search plus Actions `#srcActPop` | enable/disable all, select all/shown, address | D154, D155(b) |
| Selection bar `#libSelBar` | count, clear, one switch for the lot, **Remove** | D154(e), D53 |
| Book rows `.libsrow` | select checkbox, name over kind counts, origin chip, enable switch | D154, D155(e) |
| Pending tray `#libTray` | staged files, new-book ticks, Discard, Add N books | D154(h), D156 |
| Paste box `#pasteBox` | the paste-JSON input | D154(f) |
| Footer `.libfoot` | Close, **＋ Add files** with four sources | D154(f), D155(a) |
| Help disclosures | four paragraphs on the library, two on the tray | D88 |

### 1.3 Flow maps

**S1 · new level-1 caster, cold start to a printed sheet.** 7 steps, 11 clicks.

| # | Step | Clicks | Note |
|---|---|---|---|
| 1 | Land on an empty build | 0 | Guide CTA card leads the left column; the right column is two empty cards (B1-01) |
| 2 | Add Wizard | 1 | `#addClass` select. Level defaults to 1. Budget card appears filled in (B1-02 area) |
| 3 | Open the species picker | 1 | 127 species, flat alphabetical, `+` per row (B1-02) |
| 4 | Filter and choose High Elf | 2 | **Hesitation:** the picker does not close and has no Done; the ✕ is the only exit |
| 5 | Answer the species choices | 0 | Casting ability defaults to INT; the cantrip choice stays open behind the modal |
| 6 | Pick 3 cantrips and 6 spells | 9 | One click per spell on the `Wizard n/m` button. No confirmation needed (B1-03) |
| 7 | Print | 3 | menu → Print → Print. Sheet is correct and dense (B1-04, B1-05) |

**Dead ends:** none. **Guesses:** what the `6/6 · 1st · max` budget tile means; whether the
species picker had committed.

**S2 · multiclass caster planning a level-up.** 10 steps, 19 clicks.

| # | Step | Clicks | Note |
|---|---|---|---|
| 1 | New build, name it | 4 | Builds → New build → two fields → Create |
| 2 | Wizard to 5 | 5 | select, then four presses on `+` |
| 3 | Cleric to 4 | 4 | same |
| 4 | Read the state | 0 | **Contradiction:** level chip shows `L9 / 9 ⚠`, both rows say `SUBCLASS — PICK ONE`, and the Choices chip says **all set** (B1-09) |
| 5 | Open the timeline | 1 | level chip. Rows read clearly; L3 and L8 carry ⚠ (B1-10) |
| 6 | Read the level slices | 0 | Each row carries its gains, its owed picks and the slot or spell it unlocked |
| 7 | Add a level | 1 | The `L10` card at the top offers `+ Cleric 5` and `+ Wizard 6` |
| 8 | Reorder the plan | — | **Dead end for keyboard:** 9 rows are `draggable` with no non-pointer alternative |
| 9 | Guided builder | 1 | Opens at L1 Species. Chain on the left, stage on the right (B1-11) |
| 10 | Walk a step | 3 | Back / Skip / Next. **The stage is 9.5% filled** at 1280 |

**S3 · import a homebrew book and build from it.** 12 steps, 14 clicks.

| # | Step | Clicks | Note |
|---|---|---|---|
| 1 | Open the Library | 2 | 43 rows in 6 groups, all chipped `built-in` (B1-13) |
| 2 | Actions | 1 | five verbs, in viewport (B1-14) |
| 3 | ＋ Add files | 1 | four sources, in viewport (B1-15) |
| 4 | Paste JSON… | 1 | The paste box opens at the **bottom** of the scroller |
| 5 | Paste and add | 1 | **Dead end:** the tray renders 1,792px above the viewport. Nothing on screen changes (B1-16) |
| 6 | Scroll up | — | Only then is the tray visible, and it reads well (B1-17) |
| 7 | Add 1 book | 1 | **The library collapses from 43 books to 1** (B1-18) |
| 8 | Close and look at the build | 1 | Both class rows are blank, 0 eligible spells, `+ add a class…` reads *every class is already in this build* (B1-20) |
| 9 | Reopen, disable the brew | 2 | switch works, row dims, `aria-checked` follows |
| 10 | Select the brew | 1 | Selection bar appears with `1 selected` (B1-19) |
| 11 | Remove | 1 | Arms to `Confirm?` (D53) (B1-21) |
| 12 | Confirm | 1 | 43 books restored, receipt is exact (B1-22) |

**S4 · first-run visitor on the Pages build.** Run in an isolated browser context, so this is a
genuine first run, not a simulation.

| # | Step | Clicks | Note |
|---|---|---|---|
| 1 | Land | 0 | One book (SRD 5.2, labelled *Player's Handbook (2024)*), 339 spells, a build auto-created |
| 2 | Read the page | 0 | Guide CTA, then three empty states saying nearly the same thing (B1-23) |
| 3 | Open the Library | 2 | `1 book · built-in books only · ≈ <1 MB in this browser`, one row (B1-24) |
| 4 | 375 | 0 | Jump bar appears, no overflow, 0 contrast failures (B1-25) |

**Nothing on the first run says what the app is.** The word "spell" appears only inside empty
states; there is no mention of D&D 2024, of what an import would add, or of the SRD limit until
the reader opens the Library or reads the footer.

---

## 2. Heuristic findings

Severity: **blocker** breaks a scenario · **major** costs the user real time or fails WCAG AA ·
**minor** friction or an inconsistency · **polish** below the line of noticing.

### Blocker

**B1-01 · Adding any imported book replaces the whole content set, and an existing build becomes unreadable**
*Surface:* Library, Character card, Eligible spells, gap bar
*What is wrong:* the imported digest does not merge with the baked bundle, it supersedes it.
Pasting a one-spell brew took `DATA.sources` from **43 to 1** and `DATA.spells` to **1**. The
level-9 Sela build then rendered with two blank class selects, `0 spells` eligible, `+ add a
class…` replaced by **"every class is already in this build"**, an active-filter chip reading
**"Books (45)"**, and a gap bar naming only XPHB out of the 43 books that vanished. Four
surfaces reported four different and mostly wrong facts at once.
*Evidence:* B1-18, B1-20. Live reads: `Object.keys(DATA.sources).length` 43 → 1;
`#spCount` "0 spells"; `#gapBar` "2 picks need a book that isn't loaded — re-import it XPHB".
Repro: Library → ＋ Add files → Paste JSON… → paste any valid `_meta.sources` brew → Add pasted
JSON → scroll up → Add 1 book.
*The single warning is one gold sentence inside the tray* ("Nothing imported yet — adding these
puts the app's built-in books behind them"), phrased abstractly, shown only if the reader has
scrolled up to see the tray at all, and it does not name the number 43.
*Suggested direction:* say the consequence in the commit button's own vicinity and in the
number the reader can check ("this replaces the 43 built-in books with the 1 you are adding"),
and make the gap bar name every missing book rather than the first. A merge instead of a
replacement is a model change and belongs to D86/D112, not here.
*Size:* S for the warning, L for a merge. *Constrained by:* D86, D112, D42 (picks are flagged,
never pruned, which the app did correctly), D156.

### Major

**B1-02 · The pending-import tray renders off-screen, so a staged import looks like nothing happened**
*Surface:* Library
*What is wrong:* the paste box is appended after `#srcList`, at the bottom of a 2,531px
scroller. Pressing "Add pasted JSON" renders the tray at the **top**. Measured immediately
after: `#importModal .mb`.scrollTop **1833**, `#libTray` top **-1693.75**, `#importApply` top
**-1557.25**, `#importReport` top **-1711**. The viewport shows only unchanged book rows.
*Evidence:* B1-16 (nothing visible) versus B1-17 (the same state, scrolled up).
*Suggested direction:* scroll the tray into view on stage, or render the report line where the
action was taken. D157(d) already fixed `#importReport` outside the tray for exactly this class
of problem; the fix did not cover the tray itself.
*Size:* S. *Constrained by:* D154(b) (the status strip and search stay at the top of the
scroller), D154(h), D148's sticky gotcha.

**B1-03 · There is no designed focus indicator anywhere in the app**
*Surface:* every surface
*What is wrong:* `src/styles.css` contains **0** rules whose selector matches `:focus` or
`:focus-visible`, across 2,491 lines. Every focus ring is the browser default. Ten header and
form controls were focused and read back: buttons get Chrome's `outline: auto 1px`, inputs get
`2px solid`. On the dark warm surfaces the default ring is the only thing separating the
focused control from the rest, and it is not part of the palette.
*Evidence:* walked every stylesheet rule in the page and counted; `__P.focusRing()` on
`#menuBtn`, `#guideTopBtn`, `#tabBuild`, `#fq`, `#addClass`, `#speciesBtn`, `#originBtn`,
`#csrcAdd`, `#fChosen`, `#filterBtn`.
*Suggested direction:* one `:focus-visible` rule using `--accent` with a 2px offset, plus the
`.swk` switch and `.tk` chip shapes which have their own radii.
*Size:* S. *Constrained by:* D145 (light theme contrast), D151 (`--muted` is the quiet floor).

**B1-04 · The modal layer has no dialog semantics, no focus management and inconsistent Escape**
*Surface:* 12 of the 14 modals
*What is wrong:* `index.html` declares 14 elements with `class="modal"` and **2** carry
`role="dialog"` (`#tlModal`, `#gpickModal`). Opening `#buildModal` left `document.activeElement`
on `body`, and **263** buttons inside `.wrap` stayed tabbable behind the scrim. No modal sets
`aria-modal`. The one Escape handler (app.js:7645) covers the guide pick modal, the forms
chooser, a raised `#pickModal`, the spell modal, tips, the build-switch menus and the timeline;
`#buildModal`, `#importModal`, `#entityModal`, `#printModal`, `#csrcModal`, `#customModal`,
`#hbModal`, `#newBuildModal`, `#srcAskModal` and `#prepModal` do not close on Escape. Verified:
Escape on an open `#buildModal` left it open.
*Evidence:* measured counts above; `grep -c 'class="modal' src/index.html` = 14,
`grep -c 'role="dialog"' src/index.html` = 2.
*Suggested direction:* one open/close helper that sets `role="dialog"`, `aria-modal="true"`,
`aria-labelledby` on the existing `<h2>`, moves focus to the first control, restores it on
close, and joins the existing Escape chain in the order D120 and D149 already established.
*Size:* M. *Constrained by:* D120 (Escape must not close what sits under a modal), D149 (the
raised pick modal takes Escape first).

**B1-05 · The guided builder's stage is 9.5% filled at 1280**
*Surface:* guided builder
*What is wrong:* `#gStage` measures 1008 × 851.75; its step card measures 640 × 127.25. The
card sits top-left in the void. The chain column beside it is 272px and scrolls.
*Evidence:* B1-11, fill ratio computed live at **9.49%**.
*Suggested direction:* either give the stage the step's own context (what this level already
holds, what the next one brings) or centre the card and cap the stage width so the emptiness
reads as deliberate space rather than a missing panel.
*Size:* M. *Constrained by:* D126(a,b,c) (the guide is its own full-size page), D131(c) (the
guide's explanatory prose was deliberately removed), D131(a) (one picker per section).

**B1-06 · Three contrast failures on real rendered text**
*Surface:* spell detail modal (light), timeline (dark)
*What is wrong:* measured on live text nodes with the composited background:

| text | class | theme | ratio | needs |
|---|---|---|---|---|
| "5-foot-radius" | `.cc-range` | light | **3.85** | 4.5 (14px, 600) |
| "Dexterity saving throw" | `.cc-save` | light | **3.80** | 4.5 (14px, 700) |
| "0/1" | `.lt.lt-count > b` | dark | **4.35** | 4.5 (11.5px, 600) |

These are the only failures found in **1,383 rendered text nodes** swept across the build view,
the pickers, the Library, the guide, the timeline and the spell modal, at 1280 and 375, in both
themes. The build view itself is clean: 0 of 499 fail in either theme at either width. The
static token read reaches the same conclusion from the other end: six `--cc-*` cells fail 4.5:1
in light while all their dark counterparts pass, so the content palette is solved in dark and
unsolved in light, the inverse of the main palette D145 fixed.
*Evidence:* `__P.contrastSweep()` output per surface; token matrix in section 3.
*Suggested direction:* darken `--cc-range` and `--cc-save` in the light content block only;
`--bad` in dark needs 0.15 more ratio over `--panel-2`.
*Size:* S. *Constrained by:* D145, D151, D152.

**B1-07 · "All set" is shown while two required subclasses are unchosen**
*Surface:* Choices card
*What is wrong:* `renderChoices` counts pending as `c.type==="pick"` only (app.js:3302), so an
option-type or ability-type choice can never be pending. On Wizard 5 / Cleric 4 the chip read
**"all set"** while both class rows carried `SUBCLASS — PICK ONE`, the level chip carried ⚠, and
the timeline flagged L3 and L8. Four surfaces, two answers.
*Evidence:* B1-09, B1-10. Live: `#choicesChip` "all set", `state.choices` `{}`, `#clvlChip`
"L9 / 9" with a `.warn`, `#tlList` "Subclass — not chosen" twice.
*Suggested direction:* the chip should count what the health sweep already counts, or say
nothing rather than "all set".
*Size:* S. *Constrained by:* D30, D43, E4 (the sweep owns what does not add up).

**B1-08 · A required either/or choice is answered for the reader and presented as chosen**
*Surface:* Choices card, timeline
*What is wrong:* an option choice renders a `<select>` built only from the real options, with no
empty first entry, and `sel.value = c.value` (app.js:3371). Cleric's Divine Order therefore
displayed **Protector** while `state.choices` was `{}`. This is the documented model, not a bug
(app.js:1327: "an option group ... always HOLD a value, the default stands until you say
otherwise"), but nothing on screen distinguishes "you chose Protector" from "we chose it for
you". The timeline compounds it by printing both branches on one line: *"Divine Order · Protector
· Spellcasting · Thaumaturge"*, which reads as though the character gained both.
*Evidence:* B1-09, B1-10; live select `selectedIndex` 0, `state.choices` `{}`.
*Suggested direction:* mark a defaulted option until it is touched, and render the unchosen
branch of an either/or feature differently in the timeline.
*Size:* S. *Constrained by:* the model note at app.js:1325-1331; D130(g) (Next is what stores a
defaulted option).

**B1-09 · Reordering the level plan is drag-only**
*Surface:* timeline
*What is wrong:* 9 rows in `#tlList` carry `draggable`, and there is no keyboard or button path
to move one. The timeline contains **zero** elements with a `role`, `aria-checked` or
`aria-selected` attribute.
*Evidence:* live counts: 9 draggable, `__P.nrv('#tlModal')` returned an empty array.
*Suggested direction:* a move-up / move-down pair on each row, shown on focus, writing through
the same reorder call the drag uses.
*Size:* M. *Constrained by:* D115(j), D122, D146 (a drop leaves an empty slot; a reorder is not
a drop).

**B1-10 · The class name truncates to "Wiza" at 375**
*Surface:* Character card
*What is wrong:* the class `<select>` in a class row is narrow enough at 375 that "Wizard" is
cut mid-word, with no ellipsis. The row's three columns (class, subclass, level stepper) hold
their desktop proportions at phone width.
*Evidence:* B1-06.
*Suggested direction:* let the class column take the row at ≤420px and drop the subclass onto a
second line, which is what the `SUBCLASS — PICK ONE` note already does.
*Size:* S. *Constrained by:* D150 (class and subclass are one modal on one spine; this is the
row, not the modal).

### Minor

**B1-11 · `aria-expanded` is present on 6 of 13 popover triggers and absent on 7.**
Present: `#bswBtn`, `#srcActBtn`, `#addFilesBtn` (all also `aria-haspopup`), `#fBooksBtn`,
`#csrcNumsBtn`, `#csrcRuleEdit`. Absent: `#menuBtn`, `#filterBtn`, `#tMenuBtn`, `#entMenuBtn`,
`#pickLevelBtn`, `#famMenuBtn`, `#prepLevelBtn`. The Library's own controls are the correct
ones, so the pattern exists and was not carried back. *Size:* S.

**B1-12 · The take button is a toggle with no `aria-pressed`.** `.tk` in a spell row toggles a
pick and marks state with a class plus a check icon; 196 of them render on a two-class build.
`.abtile` in the Choices card sets `aria-pressed` and `aria-label` correctly (app.js:3367), so
again the pattern exists. *Size:* S.

**B1-13 · The origin chip repeats "built-in" 43 times.** With no import, every row carries the
same chip, so the column carries no information and costs a column of width. Measured: 43 of 43
chips read `built-in`. *Evidence:* B1-13. *Constrained by:* D155(e) (the stamp is per book and
its migration rule is settled) — this is about when to draw it, not what it stores. *Size:* S.

**B1-14 · Nine books in the "Other" group show their source code, not their name.** `LLK`,
`IDRotF`, `AitFR-AVT`, `UATheMysticClass`, `DSotDQ`, `EEPC`, `WBtW`, `LR`, `TTP` sit under full
titles like "Xanathar's Guide to Everything" in the group above. `libRow` falls back to `code`
when `s.name` is missing, so this is an extractor gap surfacing in the UI. *Evidence:* B1-16.
*Size:* S in the UI, M if the names must come from the extractors (both extractors or neither).

**B1-15 · The Pages build labels the SRD 5.2 subset "Player's Handbook (2024)".** A first-time
visitor reads that the app holds the 2024 PHB. The footer says SRD 5.2; the Library does not.
*Evidence:* B1-24, live `DATA.sources` on the isolated first run: one entry, 339 spells.
*Size:* S.

**B1-16 · Three near-identical empty states are visible at once on first run.** "No spellcasting
class yet. Add one on the left, then pick spells from the list below." / "Add a spellcasting
class — Then its spells appear here to browse and pick." / "No slots — add a spellcasting
class." *Evidence:* B1-23. *Size:* S, and it is copy, so it belongs to the D157(d) rewrite.

**B1-17 · The theme choice is not persisted.** `#themeBtn` (app.js:9718) sets `data-theme` on
the root and writes nothing; there is no theme key in localStorage. A reader who prefers light
on a dark-mode machine re-picks it every visit. *Size:* S.

**B1-18 · The import report prints four zero counts.** "Read 1 file — 1 spell · 0 classes ·
0 subclasses · 0 feats · 0 species." `libKinds` (app.js:9287) already suppresses zeros and
pluralises for the row lines; `importSummary` does neither. The plural half is fixed in
section 6; the zero-suppression is copy. *Size:* S.

**B1-19 · Inert chips are focus stops with no role and no described-by.** `attachTip`
(app.js:~7700) sets `tabIndex=0` on every chip it decorates so a tap can show the tip on touch.
The result is a focus stop announcing only its own text ("XPHB"), with the tooltip content in a
detached `.sptip` that is never referenced. `.bchip` appears 43+ times in a picker list. *Size:*
S per element, M if a shared tooltip pattern is wanted.

**B1-20 · The species picker does not close after a single choice and offers no Done.** After
selecting High Elf the modal stayed open with a check on the row; the ✕ is the only exit. It is
defensible for a picker that also allows changing your mind, but the build behind is already
updated and the reader has no signal that the job is finished. *Evidence:* B1-02 flow step 4.
*Size:* S.

**B1-21 · Pickers do not use the height available.** `#entityModal .box` measured **645px in a
900px viewport** on an unfiltered 127-row list; `.modal .box` has no `max-height` and `.mb` no
`overflow-y`, so the list is capped by content rather than by the window. `#importModal .box`
does have `max-height: calc(100vh - 80px)` (styles.css:2420) and `.spmodal .box` has `86vh`, so
two of the three patterns are right. *Size:* S.

**B1-22 · 82 of 112 interactive targets are under 24 × 24 at 375.** The smallest is the pick
chip's remove ✕ at **10 × 10** (9 of them in the budget card); the class-row remove is 18 × 16,
the level stepper 22 × 31.5, the field-info buttons 20 × 20, the level-group fold 231 × 18.75,
the spell take buttons 76.5 × 21.75. **WCAG 2.2 AA 2.5.8 is nonetheless met**: no undersized
target has another target's centre within 24px, so the spacing exception applies everywhere
(measured: 0 violations). The finding is practical rather than normative: a 10 × 10 remove
control on a phone is a mis-tap waiting to happen, and it removes a pick.
*Evidence:* full target sweep at 375, grouped by selector. *Size:* S.

**B1-23 · The timeline's order flag has no accessible name.** `#tlOrder` is a 13 × 13 span with
`tabindex="0"` from `attachTip`, an `aria-hidden` SVG inside and no label. The sibling warning
icons are fixed in section 6; this one needs its text decided (it is the D141 walk-direction
flag). *Size:* S. *Constrained by:* D141 (the arrow's display inverts, the computation never
does).

**B1-24 · The health warning is only reachable through the level chip.** `#healthBar` was hidden
on a build whose level chip showed ⚠ and whose timeline flagged two levels. The ⚠ is a 12 × 12
glyph inside a 50 × 22 chip. *Size:* S.

**B1-25 · The timeline prints both branches of an either/or.** "Divine Order · Protector ·
Spellcasting · Thaumaturge" on the Cleric 1 row. See B1-08. *Size:* S.

**B1-26 · "Prepare daily" is named where it does not exist.** The budget card in Build view says
"Use **Prepare daily** to pick 4 from the book"; `#prepDailyBtn` lives in the Spell table view.
*Evidence:* B1-03. *Size:* S.

### Polish

**B1-27 · Chip text is 1.0 to 1.75px low, systematically.** Measured text-node rect against
container rect on every chip, tile and badge class, at 1280 and 375: **horizontal delta is 0.00
everywhere**. Vertical delta is `.tk` 1.75, `.count` 1.50, `.libchip` 1.00, `.cnt` 1.00,
`.need` 1.00, `.lvltools-n` 1.75, and `.badge` and `.bchip` 0.00. Padding is symmetric in every
case, and the value is identical at both widths, so the cause is the font's half-leading, not a
layout bug. It is under half a pixel of visible offset. Recording it so the next alignment sweep
does not re-open it. (`.stat .v` measures dx -49.92 because the stat value is left-aligned by
design, not centred; excluded.)

**B1-28 · All six dark border-over-surface pairs fail WCAG 1.4.11.** `--line` on `--panel-2`
1.21, on `--panel` 1.33, on `--bg` 1.45; `--line-strong` 1.53 / 1.68 / 1.84. D145 solved exactly
these pairs in light (2.22 and 3.02, reproduced to two decimals) and left dark untouched.
Print light fails the same check at 1.73 and 2.58. *Constrained by:* D145, D151.

**B1-29 · `--radius` and `--shadow` are dead tokens.** `--radius` is referenced 2 of 158 radius
declarations; `--shadow` 4 of 14 `box-shadow` declarations. 20 distinct radii and 25 distinct
font sizes on a 0.5px grid sit underneath them. See section 3.

**B1-30 · `#filterBtn .badge{background:var(--accent);color:#fff}` is dead CSS carrying a
2.57:1 hazard.** D142(c) removed the filter-count badge, so the rule never matches; the same
declaration is copied to `#pickLevelBtn .badge` (styles.css:1115) and `#prepLevelBtn .badge`
(:1181), where white on the dark `--accent` `#d9915f` measures **2.57:1** at 10px. The live
`#fBooksN` badge does not use this rule (measured 6.55 light, 6.36 dark), so nothing is failing
on screen today. It is the only hard-coded colour in the file whose meaning changes with theme.

**B1-31 · Reduced motion covers 2 of 24 motion declarations.** `styles.css` holds 23
`transition` and 3 `animation` declarations; two `@media (prefers-reduced-motion:reduce)` blocks
cover `.anspin` / `.btn.busy::before` and `.gview`. The uncovered remainder are short opacity
and colour fades, which is why this is polish and not a finding against 2.3.3.

**B1-32 · `<meta name="theme-color">` light is 4.3 L points lighter than `--bg`.** `#f4f1ea`
against `#eee8da`, same hue. The dark pair matches exactly.

**B1-33 · "≈ <1 MB in this browser"** puts an approximation sign in front of a less-than sign.
Copy, for the D157(d) rewrite.

---

## 3. Palette and type

The full measured read is folded in here from the static pass; the numbers were computed from
`src/styles.css` and cross-checked against live rendered nodes where noted.

### 3.1 Structure

`:root` at styles.css:11 is the **light** palette and the document default. Dark is an override
declared twice, at 22-29 (media) and 30-37 (attribute), as **verbatim duplicates**. A second
token block at 1076-1092 carries the ability and content-highlight colours for both themes, the
dark half again duplicated. Print adds a light set at 1682-1691 and a **third** copy of the dark
hexes at 1695-1702.

**Six blocks, five of which are hand-maintained copies of two palettes.** Any dark change must
be made in three places for the main tokens and two for the content tokens.

Counts: 28 colour tokens light (17 main + 11 content), 28 dark, 12 print-light, plus `--radius`,
`--shadow`, `--font`, `--sans`.

### 3.2 Contrast matrix

Text over surfaces, light (measured against `--bg` `#eee8da`, `--panel` `#fffdf8`, `--panel-2`
`#f2ecdf`):

| token | `--bg` | `--panel` | `--panel-2` |
|---|---|---|---|
| `--ink` … `--free` (5 main inks) | 5.43-5.60 | 6.53-6.73 | 5.63-5.81 |
| `--ab-*` (6) | 6.49-6.58 | 7.80-7.90 | 6.73-6.82 |
| `--cc-dice` | **3.77** | 4.53 | **3.91** |
| `--cc-dc` | **3.16** | **3.80** | **3.28** |
| `--cc-dmg` | **4.45** | 5.35 | 4.62 |
| `--cc-cond` | 4.79 | 5.76 | 4.97 |
| `--cc-range` | **3.20** | **3.85** | **3.32** |

Dark: every text token passes 4.5:1 on all three surfaces; the lowest cell is `--bad` on
`--panel-2` at 4.81, and `--bad` over its own wash on `--panel-2` is **4.16**.

Boundaries at 3:1 (1.4.11): light `--line` 1.85 / 2.22 / 1.92 and `--line-strong` 3.02 / 3.63 /
3.14; dark `--line` 1.45 / 1.33 / 1.21 and `--line-strong` 1.84 / 1.68 / 1.53; print light 1.73
and 2.58.

**25 failing cells across the four palettes.** Twelve are `--line`/`--line-strong` in dark and
print light, six are `--cc-*` body text in light, one is the dark `--bad` wash, six are print.
Two of the light `--cc-*` cells were confirmed on live rendered text (B1-06).

### 3.3 Hue and lightness steps

Both themes fill the same **eight** 30° buckets. Token-for-token hue delta light against dark:
**median 2°, maximum 8°**, nothing crossing a bucket. Nine of 23 opaque tokens sit in the 30-59°
warm-neutral band, including every surface, both greys and `--gold`.

Lightness ladders are monotonic in both themes, with two compressions worth naming. Light:
`--bg` 89.4 and `--panel-2` 91.2 differ by **1.8 L**, so the raised sub-surface is not a visible
step on its own and separation comes from the border and shadow, which is what D145 chose.
`--accent` 35.9 and `--muted` 35.7 are **0.2 L** apart, so in greyscale the accent and the
de-emphasised text are the same value. Dark: `--gold` 59.2, `--muted` 60.8, `--accent` 61.2 and
`--good` 61.6 sit inside a **2.4 L** band and are separated by hue alone.

The relative emphasis order is not preserved across themes: `--muted` is the fourth-darkest ink
in light and the second-lightest-but-six in dark.

Soft-wash alpha is not one value: **.094, .110 and .122** all appear in the dark block, .110
throughout light, with no stated rule.

### 3.4 Colour outside the tokens

`styles.css` holds 1,093 `var(--…)` references and 29 `color-mix()` calls, every argument of
which is a token. Sixteen literals remain: nine "hard-coded", of which six are `#000` alpha
stops inside `mask-image` gradients and three are the `color:#fff` badge rule (B1-30); and seven
`#000x` scrims and shadows, none of which is `--shadow` and none of which is theme-aware, so
the same `#0007` scrim sits over an 89 L page and a 7.5 L page.

`src/app.js` contains zero colour literals in 10,159 lines. All four inline `style=` colours in
`index.html` use `var()`. The one drift outside CSS is the `theme-color` meta (B1-32).

### 3.5 Type, radius, spacing, as observed on screen

**Type:** 25 distinct font sizes, nine of them half-pixel, stepped at **0.5px** through the
8.5-13.5px band that carries 285 of 357 declarations. `11px` (43 uses), `12.5px` (43), `11.5px`
(40) and `10px` (38) are four near-identical sizes each used forty times inside a 2.5px span.
There is no ratio and no token. `header.top h1` is authored at 23px, 17px and 15.5px across
three breakpoints. On screen this reads as a single small-text texture rather than a hierarchy:
the spell row's name, meta line and take chip are 13, 11 and 10.5, and the difference does most
of its work through colour and weight rather than size.

**Radius:** 20 distinct values (13 screen px plus 0, 50%, a 99px pill and four print mm).
`--radius: 12px` is referenced twice of 158 radius declarations; the three commonest values are
10, 8 and 6px, none of which is the token.

**Spacing:** 29 distinct px values across padding, gap and margin, **10 of 29** on a 4px grid.
6, 7, 8, 9 and 10px are each used 45 to 85 times. Every integer from 1 to 18 is in use.

### 3.6 Judgement

**The colour is one palette. The geometry is not one system.**

The palette is coherent by construction rather than by accident: a 2° median hue delta between
themes, one warm-neutral spine carrying every surface and border, six accent hues hung off it,
and a light ink set tuned to a 0.17-wide contrast band. Nothing reads as borrowed from a second
design. The light theme does read as one design with the dark, and the live sweeps back that up:
0 contrast failures in 499 build-view text nodes in either theme, and 0 in 143 Library nodes in
either theme.

What is not one system is everything under the colour. Twenty-five font sizes on a half-pixel
grid, twenty radii over a dead token, and a 1px-resolution spacing continuum are per-component
judgement calls, and the two tokens that survive from an earlier intent (`--radius`, `--shadow`)
are referenced 2 of 158 and 4 of 14 times. The result holds together on screen because the
palette and the density are consistent, not because the geometry is.

Two asymmetries are worth naming as a pair: D145 solved the light theme's borders and left
dark's at 1.21-1.84, and the content palette is the exact inverse, solved in dark and failing in
light. Each theme has had one half of the treatment.

---

## 4. Scenario and persona verdicts

**Francesco, the primary user.** For the thing he built it for, the app is direct and mostly
frictionless: adding a class, reading a budget, picking spells and printing a sheet is 11 clicks
with no dead ends, and the printed sheet is the strongest artefact in the product. The
information design is unusually disciplined for a personal tool: the budget card, the timeline
row and the print legend each say one thing and say it in the reader's vocabulary. Where it
fails him is at the seams between surfaces that each know part of the truth. On a two-class
build, four surfaces disagreed at once about whether anything was outstanding, and the one that
said "all set" was the one designed to answer that question. The second failure is the import
path: the tray he shipped in v1.5.8 renders 1,700px off-screen on the paste route, and
committing it silently drops 43 books' worth of content and leaves a level-9 build showing two
blank class rows. He will hit that the next time he pastes a brew rather than re-importing the
zip. The third is the guided builder, which spends 90% of a 1280 stage on nothing.

**The first-run visitor on the Pages build.** They land on a page that never says what it is. No
subtitle, no mention of D&D 2024, no statement that this holds the SRD subset until you look in
the Library, and three empty states saying the same sentence three ways. The one call to action
is "Start guided", which is a good route, but it is competing with a page that has already shown
them five cards of controls for a character that does not exist. Once they add a class the app
becomes legible fast, which suggests the gap is the first ten seconds rather than the product.
The Library they eventually open tells them it holds "Player's Handbook (2024)", which is not
what it holds.

**Against current standards.** The colour system, the density and the print output are at or
above the bar for a tool of this kind, and the measured contrast record is better than most
shipping apps: three failures in 1,383 live text nodes. The accessibility layer underneath is
where it falls short of 2026 expectations, and the shortfalls are structural rather than
scattered: no designed focus state at all, dialog semantics on 2 of 14 modals, no focus
management or focus trap, Escape on 4 of 14, drag-only reordering, and colour-only severity dots
with names now added on two of the three. None of that is exotic work; it is one modal helper,
one focus rule and a handful of attributes, and the codebase already contains the right pattern
for each (`.abtile` for pressed state, `.swk` for switch semantics, `#srcActBtn` for expanded
state, `#tlModal` for dialog role). The geometry layer (type, radius, spacing) is where the app
reads as hand-built rather than systematised, which is a cost that only shows up when something
new has to be added and has no scale to be added to.

---

## 5. String inventory

Delivered separately as `audits/strings-inventory.md`: **1,370 rows** across 29 surface groups,
**263** carrying at least one AI tell, **1,107** clean.

| tell | count |
|---|---|
| em dash | 166 |
| ellipsis placeholder | 72 |
| states the obvious | 18 |
| Title Case in label | 10 |
| triplet | 7 |
| emoji | 5 |
| just | 4 |
| hedge | 3 |
| simply | 0 |
| seamlessly | 0 |
| "Note:" throat-clearing | 0 |
| exclamation mark | 0 |

The em dash is the house punctuation rather than an isolated habit, and it dominates every other
tell by an order of magnitude. The ellipsis placeholders are the `…`-family PLAN already flags as
one open call for Francesco, so that count is a decision waiting rather than 72 separate edits.
`simply`, `seamlessly` and "Note:" do not occur anywhere in the UI, and there is not one
exclamation mark in the product.

---

## 6. Trivial fixes applied (D157(a))

Three, all one line each, none with a layout, token or model implication. Verified live after
the change.

| # | Fix | Location | Before | After |
|---|---|---|---|---|
| 1 | Pluralise the import summary counts | `src/app.js:5153` | "1 spells · 0 classes · 0 subclasses · 1 feats · 2 species" | "1 spell · 0 classes · 0 subclasses · 1 feat · 2 species" |
| 2 | Name the guide chain's severity dot | `src/app.js:1968` | 12 × 12 focus stop, no accessible name | `aria-label="Level 3: 1 issue — Wizard chooses a subclass at class level 3, and none is set. Steps here are still open."` |
| 3 | Name the timeline's warning icon | `src/app.js:7057` | 12 × 12 focus stop, no accessible name | `aria-label="Level 8: 1 issue"` |

Both aria-labels reuse the string the element's own tooltip already carries, so no new copy was
authored. Verified in the running app: `#tlModal .tlwarn` now reports `["Level 8: 1 issue",
"Level 3: 1 issue"]` and `.gcsev` reports four named levels. `node -e "new Function(...)"` passes
on `src/app.js` and `src/extract.js`.

Everything else found was left as a finding. The zero-suppression half of fix 1, the ellipsis
family, the empty-state duplication and every other string change belong to the D157(d) rewrite.

---

## 7. For the docs (not edited here)

**GOTCHAS candidates**

1. **A re-render detaches the node you are holding.** Toggling a Library switch, re-querying
   nothing and clicking the same reference again is a no-op: `renderLib` replaces the row. A
   first pass of this audit read `aria-checked` as stuck at `true` because of it. Re-query after
   every action that can re-render. This is the same family as the existing blur-then-rerender
   and detached-target entries.
2. **The pending tray is above the scroll, the trigger is below it.** `#pasteBox` is appended
   after `#srcList`; `#libTray` renders above `#libtop`. Any new surface that reports the result
   of an action taken at the bottom of that scroller has the same problem. Measure
   `#importModal .mb`.scrollTop before assuming a new surface was seen.
3. **An import replaces the baked bundle, it does not merge with it.** `DATA.sources` goes to
   the imported book count, not baked + imported. Any test that imports one brew and then reads
   an existing build is reading a build with no classes.

**PLAN candidates**

- The Library's paste route needs the tray scrolled into view, and the commit needs to name what
  it replaces (B1-01, B1-02). Both land inside phase K's remaining scope.
- One modal helper covering role, name, focus move, focus restore and Escape (B1-04).
- One `:focus-visible` rule (B1-03).
- Dark border tokens to 3:1 and the light `--cc-*` tokens to 4.5:1 (B1-06, B1-28), which is the
  half of D145 that was not done.
- Keyboard reorder on the timeline (B1-09).

**DECISIONS candidates**

- Whether a defaulted option choice should be marked as defaulted, and whether the Choices chip
  should count non-pick choices (B1-07, B1-08). Both touch the model note at app.js:1325-1331.
- Whether the origin chip is drawn when it is uniform (B1-13), which is a display rule under
  D155(e) rather than a change to the stamp.
- Whether the guide stage carries context or is composed as deliberate space (B1-05), under
  D126 and D131(c).

---

## 8. Claims register

Every measurement in this report, numbered, with where it came from. All live numbers were read
from the running app over CDP; the job files are in the session scratchpad.

| # | Claim | Evidence |
|---|---|---|
| C01 | Version under test is v1.5.8 | `#appVer` textContent, live |
| C02 | Dev build carries 43 baked books | `Object.keys(DATA.sources).length` = 43 |
| C03 | Pages build carries 1 book, 339 spells | isolated browser context, `DATA` read live |
| C04 | Storage before: 2 keys, 1,888 bytes, empty IDB | snapshot at `scratchpad/storage-snapshot-8011.json` |
| C05 | Storage after: identical | section 8 restore proof below |
| C06 | Species picker holds 127 species | `#entSub` "127 species" |
| C07 | 0 contrast failures in 293 text nodes, species modal, dark | `__P.contrastSweep('#entityModal')` |
| C08 | 0 contrast failures in 499 build-view nodes, dark, 375 | sweep at 375 |
| C09 | 0 contrast failures in 499 nodes, light, 375 | sweep after `data-theme=light` |
| C10 | 0 contrast failures in 494 nodes, light, 1280 | sweep at 1280 |
| C11 | 0 contrast failures in 143 Library nodes, both themes, both widths | four sweeps of `#importModal` |
| C12 | 0 contrast failures in 43 guide nodes | sweep of `#guideView` |
| C13 | `.cc-range` "5-foot-radius" measures 3.85:1 in light | live node, 14px/600, bg `rgb(255,253,248)` |
| C14 | `.cc-save` "Dexterity saving throw" measures 3.80:1 in light | live node, 14px/700 |
| C15 | `.lt-count > b` "0/1" measures 4.35:1 in dark | live node, 11.5px/600, bg `rgb(55,43,31)` |
| C16 | 1,383 text nodes swept in total | sum of C07-C12 plus the spell modal's 53 |
| C17 | 82 of 112 interactive targets under 24 × 24 at 375 | `__P.targets()` grouped by selector |
| C18 | 0 WCAG 2.5.8 spacing violations at 375 | nearest-centre distance computed per undersized target |
| C19 | Smallest target is 10 × 10, the pick chip ✕, 9 instances | target sweep group table |
| C20 | Horizontal text-node delta is 0.00 on every chip class measured | `__P.align()` over 19 selectors, 1280 and 375 |
| C21 | Vertical delta is 1.00-1.75px, identical at both widths, padding symmetric | same |
| C22 | 43 of 43 Library origin chips align within 1.00px | `__P.align('#srcList .libchip')`, both themes |
| C23 | `src/styles.css` contains 0 `:focus` rules | walked every CSSRule in the page |
| C24 | 14 modals, 2 with `role="dialog"` | `grep -c` on `src/index.html` |
| C25 | Focus stays on `body` when `#buildModal` opens | `document.activeElement` after open |
| C26 | 263 background buttons remain tabbable behind a modal | `.wrap button:not([disabled])` count |
| C27 | Escape does not close `#buildModal` | synthetic keydown, modal still visible |
| C28 | 6 of 13 popover triggers carry `aria-expanded` | attribute sweep over 13 ids |
| C29 | Guide stage is 1008 × 851.75, card 640 × 127.25, fill 9.49% | `getBoundingClientRect` on `#gStage` and its child |
| C30 | 9 draggable rows in the timeline, 0 role/aria-checked/aria-selected elements | live counts |
| C31 | Choices chip reads "all set" with `state.choices` `{}` and two subclasses unset | live read plus B1-09 |
| C32 | Divine Order select shows "Protector" at `selectedIndex` 0 with nothing stored | live read |
| C33 | Tray after paste: scrollTop 1833, tray top -1693.75, Add button top -1557.25 | live rects |
| C34 | Import took `DATA.sources` 43 → 1 and `DATA.spells` to 1 | live reads before and after Add |
| C35 | Removal restored 43 books and `IMPORTED` to null | live reads after Confirm |
| C36 | Remove arms from "Remove" to "Confirm?" | label read before and after first click |
| C37 | Print lifted 121 rules from the `@media print` blocks | count returned by the lift |
| C38 | Print sheet at 794px has 0 horizontal overflow offenders | `__P.overflowX()` |
| C39 | No horizontal overflow at 375 on any surface tested | `docScrollW` 375 = `innerWidth` in every sweep |
| C40 | 23 `transition` and 3 `animation` declarations, 2 reduced-motion blocks | `grep -c` on `src/styles.css` |
| C41 | 28 colour tokens per theme in six blocks, dark duplicated three times | static read of `src/styles.css` |
| C42 | 25 failing contrast cells across four palettes | computed matrix, section 3.2 |
| C43 | 25 distinct font sizes, 0.5px grid, 285 of 357 declarations in 8.5-13.5px | literal census |
| C44 | `--radius` used 2 of 158, `--shadow` 4 of 14 | literal census |
| C45 | 29 spacing values, 10 on a 4px grid | literal census |
| C46 | 16 colour literals in CSS, 0 in `app.js`, 0 in inline styles | literal census |
| C47 | `#fBooksN` badge measures 6.55 light and 6.36 dark; `#filterBtn .badge` never renders | live read plus `grep` for `activeFilterCount` callers |
| C48 | String inventory: 1,370 rows, 263 with a tell, 166 em dashes | `audits/strings-inventory.md` |
| C49 | The three trivial fixes are live | `tlwarn` and `gcsev` labels read back, `importSummary(...)` evaluated |
| C50 | `theme-color` light `#f4f1ea` is 4.3 L from `--bg` `#eee8da` | HSL conversion, static read |

### Storage restore proof

| | before | after |
|---|---|---|
| localStorage keys | `spellForge.builds.v1`, `spellForge.sources.v1` | `spellForge.builds.v1`, `spellForge.sources.v1` |
| key set diff | — | **empty** |
| `JSON.stringify(all keys)` length | 1,888 | 1,888 |
| `spellForge.builds.v1` length | 1,176 | 1,176 |
| `spellForge.sources.v1` length | 292 | 292 |
| IndexedDB `spellForge` → `kv` → `import` | absent (`getAllKeys` returned `[]`) | absent |

Re-read in the browser pane at the end of the session: `JSON.stringify(localStorage)` compared
against the snapshot returned **`identical: true`**, key set diff **empty**, 1,888 = 1,888, and
`kv.getAllKeys()` still `[]`.

The snapshot is at `scratchpad/storage-snapshot-8011.json`. No write was made to this origin at
any point: every scenario ran in a separate headless Chrome profile, and the first-run scenario
in an isolated browser context within it. Both were created for this audit and hold nothing of
Francesco's.
