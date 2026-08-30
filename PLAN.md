# PLAN — My Spellbook

> What is queued, and what is blocked on a decision. `STATE.md` says where things stand;
> this says what comes next. Closed items → `ARCHIVE.md#closed-backlog`.
>
> **v7 shipped as v1.0; phase E (D115) is DONE; phase F (D118) is DONE — the F4 gate
> passed 2026-08-29 (D125 fixed in-gate).** Nothing is queued as a plan of record. The
> queue below is a backlog; its one 🔶 (magic items / rewards) is ungated and awaits
> Francesco's call.

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

## Wave batch (2026-08-29, Francesco's notes — agents in flight)

Three parallel Opus agents + one queued behind them; merged, gated and versioned by the
coordinating session. The guided-builder notes became **phase G below (D126)**.

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
- [ ] **G4 — 🔍 fresh-eyes gate** (separate session per model-policy — NOT the session
  that coordinated the G1–G3 agents) — review the shipped phase against D126(a–i) + the
  standing D118(a–j), with G3's gate notes above as starting probes.

## Phase H — guided builder v2 (D130, decided 2026-08-30)

Refinements from using the shipped phase G — the full model is **D130(a–h)**; cite it, don't
restate it. H1/H2 are in flight as agents; H3 is the big one and waits for H1 to merge
(same code region). The G4 gate reviews phase G as shipped; **phase H gets its own gate (H5)**.

- [ ] **H1 — guide navigation** (agent, in flight): D130(f) no entry chooser (reconstruct
  becomes an in-guide control), (g) Next commits a shown selection / Skip leaves it open,
  (h) end-of-walk = "Exit builder" with Skip hidden and the dead button fixed, plus Back
  reaching class steps.
- [ ] **H2 — subclass spell lists** (agent, in flight): Arcane Trickster's picker is empty;
  EK/AT's Wizard list is HARDCODED in both extractors. Derive it instead, sweep every
  casting subclass that uses another class's list, cparity assertions, and make an
  underivable list say so rather than showing an empty picker (D31).
- [ ] **H3 — the v2 surfaces** (queued behind H1, same region): D130(a) collapsed rail rows
  with ONE highest-severity icon + aggregated counter rows; (b) chips-only answers with the
  header counter; (c) one step per feature/source with a section per logical group
  (`guideSteps` regrouping — reverses D118(c) in part; reconstruct keeps slot placement
  inside the modal); (d) the multi-pick modal with per-section counters.
- [ ] **H4 — the character drawer** (after H3): D130(e) — "Character" slides the guide aside
  with a persistent bar naming the step you left, which can also END the walk; G1's
  `GUIDE.away` + vanishing Guide tab come out.
- [ ] **H5 — 🔍 fresh-eyes gate** (separate session) — phase H against D130(a–h).
- [ ] **Capitalization sweep** — audit agent running read-only (Francesco: *"many elements
  should be capitalize … ex. casting ability in magic initiate"*); its inventory decides
  whether this is one display helper or per-site edits. ⚑ (owner: Francesco, 2026-08-30)

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
