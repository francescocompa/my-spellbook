# PLAN — My Spellbook

> What is queued, and what is blocked on a decision. `STATE.md` says where things stand;
> this says what comes next. Closed items → `ARCHIVE.md#closed-backlog`.
>
> **v7 is complete and shipped as v1.0.** The plan of record is **phase E** (D115, decided
> 2026-08-28); the queue below it is a backlog, and its one 🔶 (magic items / rewards) is no
> longer gated — it awaits Francesco's call.

## Phase E — a build at every level (D115, decided 2026-08-28)

Level is a parameter, versions are alternatives — the full model is **D115(a–j)**; cite it,
don't restate it. Order: E1 → E2 → {E3, E4} → E5 → {E6, E7} → E8.
**Phase E is COMPLETE — E1–E7 shipped (v1.2.4 → v1.2.8, plus D119's refinements) and the E8
gate passed 2026-08-28 (v1.2.10, with the D120 fix).**

The guided-builder requirement raised 2026-08-28 was designed the same day → **D118**, and is
**phase F below** — strictly after the E8 gate; E1–E8 are unchanged by it. Optional follow-up once E2
exists (not scoped): D76's Magical Secrets narrowing could report the EXACT window for ordered
picks instead of best-case.

- [x] **E1 — order substrate + saved current level** (**shipped v1.2.4**, done-when verified
  in-browser: round-trip with order + pointer + swap, migration leaves `meta.updated` alone) — treat the
  `state.chosen`/`state.feats` array order as the acquisition order; add `state.currentLevel`;
  add the swap-event shape (at most one swap per character level, D115(g)); export/import +
  migration (old builds: order = array order, currentLevel = top). **Done when:** a build
  round-trips export→import with order, pointer and a swap intact, and old builds load unchanged.
- [x] **E2 — slice derivation** (**shipped v1.2.5**, done-when verified in-browser: 27 checks
  over five fixtures — Bard 12, Fighter 10/Wizard 9 interleaved, Warlock 4/Fighter 4/Bard 12
  with slots [4,11,15,19,20], Cleric 20, Sorcerer 15 metamagic — all pass; swap rewind both
  sides) — per-class sticky-pick schedules (known
  counts, spellbook 2/level, cantrip gains, feat slots via `featSlotLevels()`) map order →
  acquisition character level; every `effLevel` consumer reads the slice; prepared lists stay
  derived (D18). App-side only — no extractor change. **Done when:** the level view lists exactly
  the sticky picks acquired by that level for the five D114 fixture builds.
- [x] **E3 — editing at any level** (**completed across v1.2.5 → v1.2.8**, every done-when
  clause verified in-browser at its step) — adds insert at the viewed level's slice point and a
  later pick pulls back to it (v1.2.5); chip-drag moves acquisition, the pill's × clears a swap
  (v1.2.7); **v1.2.8 shipped the recording surface (D119(b))**: click an eligible timeline chip
  to arm "− this pick at L{view}", take the replacement to record — the position keeps the
  acquisition history, the event carries the trade; armed / ⇄-traded / pill states all marked.
  Removal below top stands as defined: removing a visible pick removes it at every level; the
  swap is the honest alternative when the rules grant one.
- [x] **E4 — consistency sweep + badge** (**shipped v1.2.6**, done-when verified in-browser: a
  Bard 12 holding a 4th-level spell in a slot that arrives at L5 shows "⚠ L5" on the badge at
  top level, and the bar names it when standing at 5; 19 checks incl. D114's [4,6,8,14,18]) —
  per-slice legality (counts vs class tables, spell level at acquisition, boons on 19+ slots,
  choice availability); one build-health badge naming the offending levels; per-level flags in
  place. Soft (D31). *Shipped checks: spell level at acquisition (swap-aware), picks past the
  schedule (wizard copies exempt, preparers not swept), feat slots incl. origin and epic-without-
  a-19+-slot, optional features past their progression, subclass due and unset. `choices` are
  already `atLevel`-gated at resolution, so they need no separate check.*
- [x] **E5 — the timeline popover** (**shipped v1.2.7**, done-when verified in-browser: every
  interaction — open/toggle, row-click jump with the popover staying open, row drag reorder,
  chip drag move + visible refusal, swap pill + clear, pin, fork, Escape/outside/scroll-out
  closes, re-anchor on scroll — at desktop and phone widths) — chip "L7 / 20 + ⚠"; popover per
  the D115(j) mockup: zone tinting, draggable rows (the old level-order panel is retired; its
  single-column rule transferred), draggable pick chips, swap pills, current-level pin, footer
  *fork a variant here* · *set as current level*. A build now **opens at its saved current
  level** (D115(e)), and the E4 ⚠ lives on the chip with the timeline locating each finding.
- [x] **E6 — fork-a-variant + print at level** (**shipped v1.2.8**, done-when verified
  in-browser: the fork truncates arrays at the slice with swaps rewound in, drops late feats and
  options, prunes orphans, names "· L5 variant", opens on activation; the print header names the
  level and the "not a saved version" note is gone) — `savePreviewAsVersion` → fork-a-variant-here
  (truncated at the slice, named as a variant, D115(i)).
- [x] **E7 — "order matters" soft flag** (**shipped v1.2.8**, done-when verified in-browser:
  Fighter 10/Wizard 9 flags on pick timing, Warlock 4/Fighter 4/Bard 12 on the level-19 straddle,
  single-class and casterless-no-straddle multiclass stay silent) — a quiet gold line in the
  timeline header naming WHY the order is load-bearing, per D115's plan-default round.
- [x] **E8 — 🔍 fresh-eyes gate** (**passed 2026-08-28**, fable@high, separate session) — code
  review of the whole substrate (E1/E2/E4 core, E5 surface, E3 swap flow, E6 fork/print, E7,
  importer migration) + in-browser verification of every D115 clause on fresh fixtures: slices,
  swap arm→record→clear, fork rewind+truncation, pin+reopen-at-level, chip/row drag incl.
  visible refusal, D119(a) tile merge/split, preparer pass-through, wizard-copy exemption,
  E1 round-trip. **Phase E holds — one CRITICAL adjacent regression found and fixed (D120):**
  `save()`'s D116(d) skip compared the live state against itself, so pure pick edits never
  persisted (v1.2.2 → v1.2.9). Three cosmetic side notes logged in D120, none blocking.

## Phase F — the guided builder (D118, decided 2026-08-28; **the plan of record** — E8 passed)

A separate coach-driven flow over the D115 substrate, forward and reverse — the full model is
**D118(a–k)**; cite it, don't restate it. Order: F1 → F2 → F3 → F4.

- [ ] **F1 — step-list derivation** (`sonnet@high`, M) — from the E2 schedules + build state,
  derive the per-decision step list grouped by character level, statuses (done / open / skipped)
  computed statelessly (D118(j)); direction is an iteration order over the same slices, ascending
  or descending (D118(f)); candidate pools: full catalog (forward) vs the build's own picks
  (reverse). **Done when:** the five D114 fixture builds yield correct step lists in both
  directions, and re-entry lands on the first open slot.
- [ ] **F2 — the coach rail** (`fable@high` — core surface, L) — side rail per the D118(k)
  mockup: level-grouped chain, jump-anywhere, structural choices inline (no modals), page
  pre-filtered with "legal now" highlighting, Skip/Back/Next, progress; bottom sheet at phone
  widths. **Done when:** every rail interaction verified in-browser at desktop and phone widths.
- [ ] **F3 — entry points + reverse wiring** (`sonnet@medium`, S) — "Start guided" beside
  start-empty; "Guide me from here" in the E5 popover footer + ⋯ menu alias; reverse on a ready
  build asks the walk direction; leftovers settle at top, soft-flagged (D118(g)). **Done when:**
  all three entries reach the rail, and a ready L12 fixture reverse-engineers to a legal order
  with its leftovers flagged.
- [ ] **F4 — 🔍 fresh-eyes gate** (`fable@high`, separate session per model-policy) — review the
  shipped phase against D118(a–k) before it is declared done.

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
