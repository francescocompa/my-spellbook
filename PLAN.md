# PLAN — My Spellbook

> What is queued, and what is blocked on a decision. `STATE.md` says where things stand;
> this says what comes next. Closed items → `ARCHIVE.md#closed-backlog`.
>
> **⚠ 2026-08-31: the one LIVE item is the open bug at the head of this file — it is
> blocked on a reading from Francesco's browser, not on work.** Everything below it is the
> standing backlog. All phases (E–I) are done and gated; its one 🔶 (magic items / rewards)
> is ungated and awaits Francesco's call.

## ⚠ OPEN — the reported bug is not fixed (2026-08-31)

**This is the queue's only live item and it is BLOCKED ON A READING, not on work.**
Great Old One's Hex still reads "at will" and Lessons of the First Ones grants no origin
feat *on Francesco's browser*, at an updated version; both are correct in the agent's.
The full account, what is verified, and what each possible reading would mean are in
`STATE.md` — read that block before anything else.

- [ ] **D1 — get the reading** ⚑ (owner: Francesco, 2026-08-31). `Done when` the snippet in
  STATE (or ⋯ → Library → Manage) has been run on HIS browser and the five values are known:
  `ver`, `imported`, `digestStamp`, `stale[]`, `hex.kind`. **Ship nothing before this.**
- [ ] **D2 — act on what it says.** STATE maps each possible reading to a different place to
  look. Only one of the branches ("`stale` empty but `hex.kind==="innate"`") is a new bug;
  the rest are stale page or stale data.
- [ ] **D3 — verify the fix the way this bug demands**: NOT on the agent's browser, which has
  no imported library and therefore cannot reproduce it. Either drive a stale digest through
  `IMPORT_CACHE` (two lines, in STATE) or have Francesco confirm on his own machine.
  `node scratchpad/jsimport.js` asserts the in-browser importer's own output on the exact
  records in question — it is the harness this bug needed and it now lives in the repo.

## Phase E — a build at every level (D115, decided 2026-08-28)

Level is a parameter, versions are alternatives — the full model is **D115(a–j)**; cite it,
don't restate it. Order: E1 → E2 → {E3, E4} → E5 → {E6, E7} → E8.
**Phase E is COMPLETE — E1–E7 shipped (v1.2.4 → v1.2.8, plus D119's refinements) and the E8
gate passed 2026-08-28 (v1.2.10, with the D120 fix).**

The guided-builder requirement raised 2026-08-28 was designed the same day → **D118**, and is
**phase F below** — strictly after the E8 gate; E1–E8 are unchanged by it. Optional follow-up once E2
exists (not scoped): D76's Magical Secrets narrowing could report the EXACT window for ordered
picks instead of best-case.

→ archived 2026-08-29: the E1–E8 task bodies (all done, each done-when verified in-browser) — `ARCHIVE.md#phase-e`.

## Phase F — the guided builder (D118, decided 2026-08-28)

A separate coach-driven flow over the D115 substrate, forward and reverse — the full model is
**D118(a–k)**; cite it, don't restate it. Order: F1 → F2 → F3 → F4.
**F1–F3 shipped 2026-08-29 (v1.2.11 → v1.2.13); the F4 gate passed the same day** (D122–D124
— timeline modal + refinements, tile semantics, metamagic row, Ember palette — rode alongside
and were the surfaces the gate reviewed against). **The phase is closed.**

- [x] **F1 — step-list derivation** (**shipped v1.2.11**, done-when verified in-browser: the
  five D114 fixtures yield correct step lists — counts, levels, labels, castMax pools — in both
  directions, and `guideResume()` lands on the first open slot; a filled Bard 20 derives 73
  steps, inside D118(c)'s band) — `guideSteps()` derives one step per decision from the build
  alone (class-per-level, subclass, species, origin/general/epic feat slots, sticky pick slots
  via the E2 schedules, optional-feature slots, swap y/n at eligible level-ups), grouped by
  character level with pool descriptors for F2/F3. Statuses stateless (D118(j)); two calls made
  en route → **D121**: the frontier ignores class steps (a hand-levelled build reads all-open,
  not all-skipped) and OPTIONAL steps (the swap y/n) never capture re-entry.
- [x] **F2 — the coach rail** (**shipped v1.2.12**, fable@high, done-when verified in-browser
  at desktop AND phone widths: open/resume, jump-anywhere, inline class-continue/add, inline
  subclass, species/feat handoff to the real pickers, spell-step page pre-filter + guided note
  + take → auto-advance past optional steps, swap armed from the rail, Skip/Back/Next, progress,
  whole-chain toggle on the phone sheet, both walk directions) — `renderGuide()` over the F1
  chain: level-grouped rail, statuses done/open/skipped rendered honestly, structural choices
  answered inline (D118(k), no new modals), `#guideNote` names the pre-filter on the spell list.
  **No user-facing entry point yet — that is F3's whole job** (until then `openGuide()` exists
  but nothing calls it). **D122 rode along**: the timeline became a full modal (its ×, sub-note,
  order-flag, changed-only dimmed casting tiles, and multiclass run aggregation with no-op
  drops not being targets).
- [x] **F3 — entry points + reverse wiring** (**shipped v1.2.13**, done-when verified
  in-browser: all three entries reach the rail — "Create & start guided" in the new-build
  modal goes straight to the forward walk, the timeline footer's "Guide me from here" and the
  ⋯ "Guided builder…" alias open the walk chooser on a ready build; a Bard 12 fixture with
  three spell-level violations and one over-budget pick reconstructed via the reverse walk to
  **0 spell-level findings** with the unplaced 17th pick settled at top and flagged) —
  reverse mode (D118(f,g)): the chooser asks continue-vs-reconstruct and the walk direction;
  reconstruct narrows the page pool to the row's OWN picks and a take PLACES the pick at the
  current slot's array position (stateless — the position is the answer; the displaced pick
  drifts later and stays in the pool; review clicks can never delete). Reverse re-entry lands
  on the first slot whose occupant is illegal where it sits; illegal slots carry a red ⚠ in
  the rail in every mode.
- [x] **F4 — 🔍 fresh-eyes gate** (**passed 2026-08-29**, fable@high, separate session per
  model-policy) — every D118(a–k) clause verified in-browser on a fresh fixture; one real
  finding, fixed in-gate → **D125** (the forward walk's pre-filter described a later slot
  than the one a take actually fills; `guideSync` now clamps to the row's first open slot).
  **Phase F is DONE.**

## Wave batch (2026-08-29, Francesco's notes) — ✅ COMPLETE

All five merged, gated and tagged (v1.2.19 → v1.2.23) by the coordinating session; two
became decisions (**D128** per-kind swaps, **D129** Refresh feedback) and W3's investigation
became **D127**. The guided-builder notes became **phase G below (D126)**.

- [x] **W1 — general UI fixes** (**merged v1.2.20**): duplicate multiclass blocked (keyed on
  class NAME — editions are one class; `refreshAddClass` moved into `renderClassRows`, fixing
  a stale-select hole); popover batch (badge margin was the off-center cause; closer reads
  `composedPath()` → Gotcha updated; toggle fixed for every menu; count badge gone);
  foldable level groups in the eligible list AND the pick modal (which gained grouping —
  it was flat; revert is one line at the `lvls.length<2` branch if unwanted).
- [x] **W2 — the swap model, app-wide** (**merged v1.2.19 → D128**): `SWAP_RULES` verified
  from XPHB prose; `state.swaps[lv]={spell?,cantrip?}` with healing migration at all three
  stored-state boundaries; timeline arming per kind; Wizard cantrip 1/LR in the prepare
  modal; guide emits up to two swap steps. Agent-verified in-browser on an isolated origin.
- [x] **W3 — sorcerer/edition dedupe investigation** (agent, read-only) — DONE, see the
  report: `reprintedAs` covers all 58 cross-edition subclass links (0 misses); root cause is
  unresolved `_copy` records; TWO bigger live bugs found (67 classic subclasses missing from
  2024 pickers; **73 subclasses resolve to hollow zero-grant records** — every 2014 subclass
  currently grants no subclass spells). Francesco chose **C → D127, BUILT and merged
  v1.2.21**: `_copy` resolved in both extractors (`_mod` tripwire live at zero),
  `supersededBy` on all six types, cparity keyed with `classSource` (322/322 diffed, 42
  checks), app-side class-scoped subclass resolution + successor-aware `reprintOk`.
  Verified: no duplicate pairs in any class picker, +67 classics visible, the 73 hollow
  records healed. Needs Francesco's one-click re-import per browser.
- [x] **W4 — timeline batch** (**merged v1.2.22**, 11 items incl. 4 mid-flight additions):
  labeled ghosts (D124(b) rejection reversed, annotated); retrain chips (icon + Ln, level
  tag opens an inline move chooser — one eligibility predicate `swapLevelOk` shared by arm/
  move/ceiling); violet incoming chips + per-half count tiles (over/under crimson — "have"
  now counted at landing, so over-schedule is finally expressible); quiet click-to-choose
  on undecided gains (opens the REAL choosers); full copy scrub (all D-codes gone; trade
  wording); "+ add level" row (D126(d) shape); iconed footer (the ⇄ glyph violation fixed);
  chip-row mask padding; unified tile base color (D123(a) hue-mix clause superseded,
  annotated); pact tile fits its square. Deviation flagged: an ARMED chip's level tag is a
  marker, not a mover (no event exists yet).

- [x] **W5 — Refresh imported data UX** (**merged v1.2.23 → D129**): the ⋯ menu button
  refreshes INLINE (busy → staged progress → green done / red fail notice); the modal opens
  only for the four ask-cases a human must fix, and its own button gets the same states. Two
  FALSE-SUCCESS holes closed: a stage that read nothing (stale folder, dead permission) used
  to re-store the unchanged digest under a new parser stamp and report "Re-imported N books"
  — the likely mechanism behind the Aberrant-still-duplicated report; both now stop with
  "Your imported data is unchanged", and books the folder no longer holds are named, not
  counted.

## Phase G — the guided builder as a full-size page (D126, decided 2026-08-29)

Ground-up surface redesign over the standing D118(a–j) model — the full design is
**D126(a–i)**; cite it, don't restate it. Strictly after W1/W2/W4 merge.
Order: G1 → G2 → G3 → G4.

- [x] **G1 — page shell + chain column** (**merged v1.2.24**, done-when verified: the
  Bard 5/Fighter 1 walk reads in both columns at 1280 and 375, and a chain drag produced
  the identical plan as the same drag in the timeline modal) — the guide is a full-size
  fixed surface UNDER the modal layer (z 45 < 50, so pickers open over it — the D126
  complaint closed by construction); `body.guiding` hides `.wrap` (print restores it);
  ⇇ Character view is a SWITCH (`GUIDE.away`, a header Guide tab returns; entries resume
  instead of re-asking); the chain column reuses the timeline's run/rail/divider classes
  and the row drag is ONE extracted implementation (`wireRowDrag` + `commitPlan`) that
  `renderTimeline` now also calls; phone = one-pane toggle. Stage is a minimal F2 port
  marked `// G2 rebuilds this stage`. Flags carried to G2: auto-advance still fires
  (D126(e) done-cards are G2's), `#guideNote` copy retires with G3's modals.
- [x] **G2 — decision stage + structural/choice steps** (**merged v1.2.25**, done-when
  verified: Magic Initiate's choice steps and the invocation step both open the app's REAL
  choosers and picks commit inside the walk) — auto-advance DELETED (`autonext` removed
  whole; D125 clamp, resume fallback and reverse stepNext kept); green done cards with a
  change affordance; class card = continue + last-other + menu through one `guideTakeClass`;
  `kind:"choice"` steps keyed on the stable grants path id, hosting `choiceRow` itself;
  `collectGrants` lifted out of `compute()` so choice steps derive at BUILD scope, not the
  preview slice (at preview L1/3 `R.choices` undercounted and steps vanished mid-walk);
  optfeat cards open `openGainChooser`. Flags to G3: Next wraps from the last answered step;
  pick steps still hand off to the page (`guidePageBtn`); choice labels read clunky.
- [x] **G3 — pick modals + trade cards + entries** (**merged v1.2.26**, done-when verified:
  a forward walk from empty and a reverse reconstruct both complete entirely in the modal,
  cap honesty held) — `#gpickModal` (eligible-only via the MOVED page predicate, groups
  DESCENDING, W1 folds cleared per open, filter+count; take closes, drop stays); the page
  handoff RETIRED (`#guideNote`, the renderSpells guided block, `guidePageBtn`, the jumps);
  trade cards per kind wiring through the timeline's own SWAPARM→`recordSwap` intercept
  (one writer; undo = `clearSwap`; `guideSwapMax` now shared with `renderSwapArm`); the
  empty-build "Start guided" CTA; end-of-walk Next disables with honest counts; choice
  labels composed from the filter (92/99, 7 honest fallbacks). Bug found+fixed:
  `guideSlotIllegal` read the raw array and painted a lent slot red after a legal trade —
  it un-applies later trades first, agreeing with the sweep. **The build is done; only the
  G4 gate remains.** Gate notes from G3: the reverse-placement intercept in `toggle` is
  reachable from the character view against an unnarrowed list; `guideResume` now serves
  re-entry only.
- [x] **G4 — 🔍 fresh-eyes gate** (**PASSED-WITH-FINDINGS 2026-08-31**, opus@high fresh
  agent, coordinated by a session that built nothing) — every D126(a–i) clause and every
  surviving D118 clause verified in-browser at 1280+375; D118(b,c,k) are legitimate
  supersessions (D126/D130). One structural finding with four faces, **all fixed v1.2.39
  (D133)**: `toggle`'s ambient reverse-placement intercept hijacked every surface sharing
  the one take/drop writer — worst case the prepare modal's unprepare silently REORDERED
  the wizard spellbook (`arr==="prep"` read as "spell"); also a "Drop" chip that reordered,
  a dead ✓, and a dead place-mode cpick picker. Placement is now explicit at the call site
  (`guidePlace` has one caller — the guide's own modal), and cpick sections always open
  take-mode. Both G3 probes confirmed: the intercept WAS reachable from three foreign
  surfaces; `guideResume` re-entry behaviour is correct on all four entries.

## Phase H — guided builder v2 (D130, decided 2026-08-30)

Refinements from using the shipped phase G — the full model is **D130(a–h)**; cite it, don't
restate it. **The phase is CLOSED — H1/H2 (v1.2.27), H3 (v1.2.28), H4 (v1.2.31) and H6
(v1.2.30) all merged, and the H5 gate passed 2026-08-31** (findings fixed v1.2.39; three
⚑ calls for Francesco remain in the H5 block below).

- [x] **H1 — guide navigation** (**merged v1.2.27**): the dead end-of-walk button was the
  trailing "Next level" step — always open, always last, so `nxOpen` was null there; two
  terminal states now (open steps behind → "Go to the first open step"; nothing open →
  "Exit builder"), Skip hidden in both, and the previously control-less "nothing open" card
  fixed. Entry chooser gone (reconstruct is a header command menu). Next commits option-group
  and casting-ability defaults; the growth class step was EXEMPTED at merge (D130(g) refined
  — it was levelling the character once per press). Back already reached class steps.
- [x] **H2 — subclass spell lists** (**merged v1.2.27**): the empty Arcane Trickster picker
  is a **pre-D127 stored digest** (hollow `_copy` twin → `nonCaster` → pool 0, silently) —
  fresh data gives AT/EK 61 spells. Fixed anyway: the EK/AT Wizard hardcode is replaced by a
  rule derived from the subclass's own `expanded` filters (100% coverage — `casterProgression`
  exists on exactly those two subclasses; 0 or >1 class name → `spellList=null` + a tripwire
  proved firing), 6 new cparity checks (48 total), and `listUnknown` now makes the app SAY it
  can't name the list instead of showing an empty picker. Subclasses of casting classes that
  reach another list (Lore, Divine Soul…) correctly keep their own list + expansions.
- [x] **H3 — the v2 surfaces** (**merged v1.2.28**, verified on the merged tree: 20 level rows,
  exactly one expanded, exactly ONE severity icon each; a `cast` step holds Cantrips + Spells
  sections; the modal shows both with their own counters and a "Chosen 4 of 4 · Done" footer;
  storage byte-identical after the walk): D130(a) collapsed rail rows
  with ONE highest-severity icon + aggregated counter rows; (b) chips-only answers with the
  header counter; (c) one step per feature/source with a section per logical group
  (`guideSteps` regrouping — reverses D118(c) in part; reconstruct keeps slot placement
  inside the modal); (d) the multi-pick modal with per-section counters.
- [x] **H4 — the character drawer** (**merged v1.2.31**, done-when verified in-browser at 1280
  AND 375, and again on the merged tree): D130(e) — the guide slides aside to a 14px accent
  edge and stays MOUNTED (inert, `pointer-events:none`) rather than being swapped away; a
  sticky bar names the step you left ("Back to the guide / Step 12 of 16 · Feat / ASI") and
  carries the **Exit builder** control that ends the walk from that state (D130(h) wording).
  G1's `GUIDE.away` and the vanishing `#tabGuide` are gone from app.js, index.html and CSS.
  The bar tracks the walk live (levelling while aside recounted 16 → 18 → 16), entries used
  while aside resume the same step, print is restored in both states, and exiting leaves
  storage byte-identical. **Deviation, accepted at merge:** the bar renders as TWO lines, not
  one em-dash-joined string — at 375px the one-line form ellipsised the step label; the em
  dash became the line break. Open choices it settled, for the H5 gate to confirm: the guide
  slides LEFT (its chain column's own side); the bar is pinned at the TOP (the bottom belongs
  to the phone jump bar) as a sticky flow element.
- [x] **H5 — 🔍 fresh-eyes gate** (**PASSED-WITH-FINDINGS 2026-08-31**, opus@high fresh
  agent, run as one session with I5) — D130(a–h) verified clause-by-clause in-browser on a
  Bard 6 / Wizard 2 / Warlock 3 fixture; D130(d) judged under its D131(a) supersession.
  Nothing in phase H blocked. The three carried questions were tested, recommended on,
  and **answered by Francesco 2026-08-31 → D134** (all three resolved, none open):
  - **Q1** place-mode cast cap **kept** + one minimal `gphint` when the cap hides some of
    the section's own picks (shipped v1.2.40, verified in-browser: "2 picks are above this
    slot's cap — they fit a later slot.").
  - **Q2** `PREVIEW.level` surviving `closeGuide` is **decided behaviour, kept as is** —
    the gate's snapshot/restore and the unconditional clear are both rejected, don't
    re-propose them.
  - **Q3** the two-line pinned bar is **confirmed**; D130(e) annotated in place.
- [x] **H6 — capitalization sweep** (**merged v1.2.30**, done-when verified in-browser
  including a print lift). The audit's mechanism held: **one shared display helper + ~25
  source-string edits, no CSS work.** `cap1` is now the file's ONLY display capitaliser — the
  top-level `cap` and three inline copies are gone, and it is never applied to a stored value.
  `sp.time` capitalised at all 8 render sites (meta rows, spell modal, table restore tip,
  hover tip, custom-spell preview, PRINT card); `"casting ability"`/`"choose one"` fixed once
  in `choiceRow` (**app.js:2776, not 2444** — H3 moved it), which the Choices card and the
  guide stage both reach; grant descs route through `cap1(guidePickAsk(c) || fmtDesc(c.desc))`
  at 4 sites, which also fixed the lowercase class names and "a Artificer"; 13 label-initial
  strings follow. The do-not-touch list was verified by round-trip, not assumed: option
  labels, `— none —`, `sp.tcat`/filter keys, `rechargeShort()` and the CSRC/SAVE/CT tables all
  still persist and match. Left deliberately: the `…`-placeholder family, the ~30 CSS-uppercased
  strings, and mid-row fragments in the custom-source editor.
- [ ] **The `…`-placeholder family needs Francesco's one call** (H6, left as scoped): "+ add a
  class…", "cantrip leaving…", "its replacement…", "filter books…", "note — e.g. …" — plus the
  same-shaped "no filter" options the audit had missed, `all schools` / `all classes`
  (index.html:139-140), `"any save"` / `"any damage"` (app.js:6383-6384) and `#fChosen`'s
  `picked` (index.html:135). They are internally consistent; one call settles all of them.
  ⚑ (owner: Francesco, 2026-08-30)
- [ ] **`.gcstep.optional .gcl::after{content:" · optional"}`** (styles.css:1822) is the
  CSS-authored twin of the `"Optional"` H6 capitalised at app.js:2042. Different surface
  (chain rail, appended mid-line after a middot) and the audit said no CSS work — but if the
  two should match, that is the line. ⚑ (owner: Francesco, 2026-08-30)
- [ ] **Third-caster max spell level is one tier low from class level 7** (H2 agent, flagged
  not fixed): `maxLvlAt("1/3",L)` uses `ecl=floor(L/3)`, so an Arcane Trickster / Eldritch
  Knight gets 2nd-level spells at class level 9 when the mirror's own
  `subclassTableGroups.rowsSpellProgression` says **7** (3rd at 13, 4th at 19 — `ceil(L/3)`).
  This is D68's two clocks: `floor` is right for multiclass slot pooling, `ceil` for the
  class's own max spell level, and `ecl` currently serves both. Neither extractor reads
  `subclassTableGroups`. Touches multiclass slot maths. ⚑ (owner: Francesco, 2026-08-30)
- [x] **`renderOptFeats()` goes stale after a class or level change** (**fixed v1.2.29** —
  the suspicion was right and understated). Five handlers, not two, call
  `renderClassRows(); render();` (class swap, subclass, level stepper, remove row, and
  `#addClass`), and `render()` never called `renderOptFeats()`. Reproduced from a fresh load:
  the block did not draw at all on the first add, and once drawn it LIED — a Warlock stepped
  2 → 1 kept reading "0/3" against `optSlots()`'s 0/1. Fixed by moving the call into
  `render()` beside `renderFeatBudget()` rather than widening the handlers to `refreshAll()`:
  it holds no `<select>`, `<input>` or disclosure, which is exactly why the rest of
  `refreshAll()` is deliberately kept out of the render pass. Also closes the same hole on
  the feat-chip remove handler.
- [x] **`#tableChip` has no singular case** (**fixed v1.2.29**) — guards the way every
  sibling count in the file does; `nsp` was NOT reused (it is a `const` local to
  `renderSpells()`).
- [x] **Invocations, and everything shaped like one** (**shipped v1.3.0 → D135**, Francesco's
  report of four broken behaviours, audited whole rather than patched one by one; done-when
  verified in-browser on a Warlock 5 fixture and torn down after): ① the three DESIGNATION
  invocations get a real choice whose pool is a filter read out of their own prose, and whose
  effect lands on the designated spell as a D79 note — and designating a cantrip you have not
  got takes it on the class's own schedule; ② repeatable is read from BOTH shapes 5etools
  uses and the nth take carries a `##n` identity, so two Magic Initiates hold two independent
  sets of picks and two Agonizing Blasts two independent designations; ③ a feat / optional
  feature / species now has its OWN prose mined for casting notes (252 of them, block-scoped);
  ④ `featProgression` is read, so Lessons of the First Ones adds its Origin slot to the budget
  card and to the guided chain. Plus a verifiable filtered prerequisite and two bugs found in
  passing (`Seeking Spell`'s boolean-as-array test; `EMPTY_GRANTS`'s shared mutable lists).
- [x] **Three wrong reads of the spell table** (**shipped v1.3.1 → D136**, Francesco's
  report; done-when verified in-browser on a Great Old One Warlock 10 fixture, torn down
  after): Great Old One's Hex is a PREPARED grant, not "at will" (5etools files it under
  `innate`, its own feature says only "you always have it prepared"); Synaptic Static's Save
  column drops the Constitution it never forces (the tag came from a penalty on the target's
  own concentration saves); and everything GRANTED is one row per spell with a badge per
  giver — the always-prepared branch used to read `grants[0]` and silently drop the rest.
- [x] **An extractor fix never reached an importing user, and nothing said so**
  (**shipped v1.3.2 → D137**; done-when verified in-browser by reproducing every reported
  symptom from a v1.2.41-stamped digest and clearing them from a current one, plus the six
  `verLt` cases, the no-import case, the no-stamp case, the × and the action button): the
  boot notice compares the imported digest's parser stamp with the app version and offers
  the inline refresh. **The reproduction is the thing to keep** — it is in GOTCHAS.
- [x] **A partial refresh claimed the whole library was current** (**shipped v1.4.0 →
  D138(a,b)**; done-when verified in-browser by storing a digest whose meta stamp reads
  current while 41 of 43 sources read v1.2.41 — the notice and the Library line both name
  41, where the old code stayed silent): per-source `parser`/`parsedAt`, `staleBooks()`, and
  the stamp promoted from a hover title to a visible line above the Library's footer.
- [x] **Export/import characters between devices** (**shipped v1.4.0 → D138(c)**; done-when
  verified in-browser by a full round trip onto an emptied browser: 3 builds + 1 homebrew
  spell land, the homebrew spell resolves, and the build's pick of it survives — plus
  re-import not duplicating homebrew, and a single-build file still importing through the
  same box): `Export all…` writes one backup file carrying every build and the homebrew they
  reference; one import entry point takes either kind.
- [ ] **`refreshAddFeat()` has the identical defect for `#epicRow`** (found while fixing the
  above, 2026-08-30 — HIGH CONFIDENCE from reading, NOT reproduced in the browser): it
  toggles `#epicRow` on `featBudget().epic`, which per D114 is a function of
  `featSlotLevels()` → `classLevelPlan()` → class levels, yet it too runs only inside
  `refreshAll()`. So stepping a class across the level where an Epic Boon slot arrives should
  leave the row showing the previous answer. Verify from a fresh load, then fix. The other
  three `refreshAll()` members are clean (`refreshSpecies`, `renderCustomSources`,
  `renderFeatChips` read `state.*`, not class levels).

## Phase I — guided builder v3 (D131, decided 2026-08-30)

Francesco's notes after using the shipped phase H — the full model is **D131(a–h)**; cite it,
don't restate it. Four parallel builds, then a gate. **The phase is CLOSED — I1–I4 merged
(v1.2.34 → v1.2.37) and the I5 gate passed 2026-08-31** (findings fixed v1.2.39).

- [x] **I1 — the pick modal** (**merged v1.2.35**, done-when verified in-browser: a
  spellcasting step opens two scoped pickers and Magic Initiate four; the three footer states
  measured with transitions forced off; the click closes and advances to the same target Next
  computes; cap honesty and place-mode slot addressing both intact; trade still records): one picker per SECTION, not one per step
  (superseding D130(d) — D130(c)'s step grouping is unchanged); the footer button becomes the
  proceed nudge in three states ("Choose N more" quiet/disabled → accent "Done — next step"),
  and its click closes AND advances the walk. The `#gpPill` goes. Cap honesty (D125) and the
  place-mode slot addressing (D118(f,g)) must both survive. Carries the modal's share of
  D131(c) — its explanatory `#gpSub`/`#gpPill` prose.
- [x] **I2 — the guide's chrome, and both columns invert** (**merged v1.2.37**, done-when
  verified in-browser and again on the merged tree: the chain reads L6→L1 and the timeline
  L5→L1 with its add row on top; the same drag on either surface produced the identical plan
  and the D122 no-op guard refused identically on both; zero walk banners, zero ghost chips;
  the arrow toggles "from L1" ↔ "from L5"; "reconstruct" scanned to zero hits across 36 step
  visits and the timeline, in text and in every aria-label/title): the
  explanatory prose off the stage and the section blocks (live status and error/empty states
  stay; anything load-bearing moves behind D88's `?` disclosure — note `wireHelpNotes()` is
  boot-only and the guide is JS-built, so it needs a re-call); the dead "+ N more" ghost chip
  removed; the reconstruct dropdown gone with the word "reconstruct" itself. Then **D132**:
  the chain rail AND the timeline modal invert to highest-level-first, the "+ add level" row
  moves to the top, and the ↑ Up / ↓ Down control moves into the RAIL where it can show its
  travel. One agent owns both inversions because **the row drag is one shared implementation**
  and G1's acceptance test still stands — the same drag in the chain must produce the identical
  plan as the same drag in the timeline. Everything assuming ascending order gets re-read: the
  current-level pin and its zone tinting, D122's run dividers and aggregation, every first/last
  assumption. **Fallback if the inversion proves larger than it reads** (D132's rejected option,
  kept live for exactly this): leave both columns ascending and express direction as "start
  here" caps at the two ends of the rail.
- [x] **I3 — drawer edge + rail alignment** (**merged v1.2.34**, `src/styles.css` only —
  zero app.js surface; done-when verified at 1280 AND 375: the guide's right edge sits at
  exactly 0 aside, `elementFromPoint` across the first 20px never lands inside it, the grip
  delta is 0.00 on every row collapsed and open, and a real drag still reorders): the 14px accent sliver goes and the
  guide slides fully off-canvas (the `body.gaside` offsets key off `--gbh`, not the edge, so
  they stay); the chain rail's drag handle aligns to the level chip and title row on a
  collapsed card without breaking the open card that `align-items:flex-start` exists for.
- [x] **I4 — the familiar pin** (**merged v1.2.36**, done-when verified in-browser incl. print:
  the offer appears the instant the boon is taken, the two tiers differ by order, elevation,
  colour, opacity AND disclosure, marks and dismissal survive a reload, dismissal pins nothing,
  a marked form prints and the nudge goes): a DEDICATED modal for the
  familiar choice — the eight Pact of the Chain forms as the unique tier, Find Familiar's own
  ~65 offered subordinate to them — whose choice IS the pin, routed through `toggleFav` so the
  carousel star, `orderedCreatures` and `printCreatures` keep one writer. Optional and
  dismissible; nothing pinned on its own. Carries a real bug found in the survey: `activeFormGrants`
  matches the exact `name|source` key (app.js:6657) while `grantRec` resolves by NAME only
  (app.js:592), so a PHB/XPHB split between boon and spell silently drops every granted form —
  fix it with D127's successor-aware machinery, and prove the failing case.
- [x] **Next duplicates `guideAdvance()`'s expression** (**fixed v1.2.39**): the stage's
  Next now calls `guideAdvance()` — one function, two callers, verified to land exactly
  where `guideStepAfter` predicts.
- [x] **The guide's pre-filter is capped by `PREVIEW`, not only by the landing slot**
  (**fixed v1.2.39, D133**): opening a section's picker now stands the view on that
  section's LANDING level — per SECTION, not per step (two sections of one step can land
  at two levels), decided in `openGpickSec`, not `guideGo`. The fix also closed a second
  lie the gate hadn't measured: the take used to INSERT at the previewed slice point, not
  the promised slot. Pool, cap, hint and insert position now derive from one number —
  the Bard-5 "Change…" repro went from 26 offered/insert-at-4 to 76 offered/insert-at-7
  with 0 illegal flags.
- [x] **`.spmodal` is missing from the print `display:none` list** (**fixed v1.2.39**):
  one token added at styles.css:1540, verified through CSSOM.
- [ ] **`favKey` is per PRINTING, so a mark is stored under one edition** (I4, flagged): a
  mark lives under `Find Familiar|XPHB`; if `grantRec` later resolves the other printing (the
  reprint filter set to `all`, or a book toggled) the mark is not seen. Deterministic and
  consistent under the default filter — every surface goes through `grantRec` — but making
  `sbFav` itself edition-tolerant is a storage-shape change. ⚑ (owner: Francesco, 2026-08-30)
- [x] **The Down-walk trio** (**fixed v1.2.39, D133** — the gate showed findings 3/4/5 were
  one defect seen three times): a single `guideDownPlaceable(steps)` predicate now decides
  whether the Down control is offered (`guideCanWalkDown`, OR-ed with `GUIDE.reverse` so an
  in-flight walk never hides its own way back), which step reverse re-entry opens on
  (`guideSync` — a placement step, never the growth card), and which level the rail's
  "from L{n}" names (`guideWalkStrip` — was off by one against the actual landing).
- [x] **`renderGuideChain` and `renderTimeline` duplicated four pieces of inversion logic**
  (**extracted v1.2.39**): the I5 gate first PROVED the copies in step (4 real drags
  byte-identical on both surfaces, 5 no-op drags refused identically — D122 guard held),
  then the extraction rode that proof: one `levelColumn` owner (runs keyed on `to`,
  divider, `runjoin`, prepend), card bodies stay per-surface, `wireRowDrag` untouched on
  plan indices. Rendered columns byte-identical pre/post; drag battery re-run clean.
  Gotcha entry updated.
- [x] **I5 — 🔍 fresh-eyes gate** (**PASSED-WITH-FINDINGS 2026-08-31**, opus@high fresh
  agent, one session with H5) — D131(a–h) + D132 verified clause-by-clause: prose sweep
  over 41 steps × both directions clean, "reconstruct" absent from every user-visible
  string and aria-label, drawer edge at exactly 0, grip delta 0.00, the I4 familiar
  modal's edition-split fix proven in BOTH directions at unit level, D132 inversion
  correct on pins/zones/dividers/joins. One real defect — the chain's growth ghost was a
  silent drop target (the one crack in G1's drag-equivalence) — **fixed v1.2.39**:
  `wireRowDrag`'s row branch now gates BOTH ends on `opt.enabled` (chip branch untouched;
  timeline add row stays unwired). Residual minors deliberately not taken: the place-mode
  footer opens accent (I5-8, defensible), an answered chain row names its picks (I5-11,
  comment aligned to the behaviour instead).

## Queue
- [ ] **Magic-item / reward ingestion** — 🔶 **RESEARCHED 2026-08-27, awaiting Francesco's call.**
  The old note said "items carry no structured uses"; that is **wrong** and the audit corrected it.
  What the 5etools corpus actually holds:
  - **Items.** `charges` (282), `recharge` (286, closed enum), `rechargeAmount` (254) and
    `attachedSpells.charges` (a real cost→spells map, 138 items) map **straight** onto the D55/D95
    model. Staff of Fire's record is literally `pool:10 · "1d6+4 at dawn" · costs 1/3/4`.
  - **The hole:** save DC, attack bonus and casting ability are **prose only** — of 402 items with
    attached spells, **zero** carry a structured DC or attack and only **9** name an ability. Those
    three fields would always arrive blank and be typed by hand.
  - **The trap:** *Luck Blade is not a record in `items.json`.* It is a magicvariant template
    (`requires:{sword:true}`) cross-multiplied against base items. 11 spell-granting templates
    expand to **115** items, plus 53 `_copy` records (41 with no content of their own). A naive
    flat read returns 402 and silently drops the rest — porting `_createSpecificVariants` is
    ~150 lines **into both extractors**.
  - **Size:** ~120 KB slimmed, ~780 KB with prose — and the prose is the only place the DC lives.
  - **SRD:** only ~80 of 542 spell-granting items are `srd52`, so the public build gets almost none.
  - **The cheaper half — `rewards.json`:** 277 charms / blessings / boons / piety traits, **88 with
    `additionalSpells`** — the *same* schema the extractors already parse for classes, species and
    feats. No new parsing, no variant cross-product, no prose regex; its `innate`/`known`/`prepared`
    map onto the app's three modes directly. **Caveat: zero SRD flags**, so it is import-only content.
  - **Suggested order** (not decided): rewards first as a small self-contained addition, then items
    as *"prefill a custom source from an item"* rather than a first-class entity, since the DC needs
    hand-entry regardless. ⚑ (owner: Francesco, 2026-08-27)
- [ ] **`SHADOWED` is not source-aware** (D127 agent flag): with XPHB off, 90 reprinted
  subclasses stop being reprint-hidden but only 6 surface — `collapseEditions` still shadows
  them behind an XPHB winner whose book is off. Consulting `srcOn` there means re-running
  `buildIndexes` on every source change — a D-level behavioural call. ⚑ (owner: Francesco, 2026-08-29)
- [ ] **`subclassFeature` `_copy` records (75, all shallow/same-file, zero `_mod`)** are still
  unresolved (D127 scoped them out): 2014 twins' FEATURE lists may read hollow even though
  grants now resolve. If feature names ever look wrong on a 2014 subclass, this is why —
  the resolver exists, it just isn't pointed at them. ⚑ (owner: Francesco, 2026-08-29)
- [ ] **Prerequisites we can't check**: ability scores, proficiencies, backgrounds and campaigns
  aren't in the app's model, so those alternatives read "check …" rather than pass/fail. Closing
  this means tracking ability scores — a bigger change than it looks. ⚑ (owner: Francesco, 2026-08-26)
- [ ] **Polymorph / Shapechange / True Polymorph as creature sets** — Francesco: "technically a
  spell with multiple stat block options, but perhaps it would require full monster catalogue".
  Correct: their filters are open-ended (any Beast of CR ≤ your level, any creature of CR ≤ …),
  which is the whole bestiary — 4,458 monsters. D78's carried set is 65. Out of scope until
  there is a reason to ship the catalogue; a CR-capped subset would still be hundreds.
  ⚑ (owner: Francesco, 2026-08-27)
- [ ] **Detect a real long-rest spell swap in the extractors** — D73's Granted tab lists every
  `kind:"known"` pick because the digest has no flag for "you may replace this on a long rest".
  **Attempted 2026-08-27 and deliberately stopped:** the prose is there ("Whenever you finish a
  Long Rest, you can replace that cantrip…") but it is NOT on the species entry a flat walk
  reaches — it lives inside 5etools' unresolved `_copy._mod` / `_versions` blocks and inside
  TABLE rows. A regex over `entries` finds **zero** matches. Closing this means resolving those
  structures, which neither extractor does. Bigger than it looks. ⚑ (owner: Francesco, 2026-08-27)
- [ ] High Elf true in-table cantrip swap; Human extra-origin restricted to origin cats.

→ closed backlog items (all of them, including this session's): `ARCHIVE.md#closed-backlog`
