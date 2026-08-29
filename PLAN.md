# PLAN — My Spellbook

> What is queued, and what is blocked on a decision. `STATE.md` says where things stand;
> this says what comes next. Closed items → `ARCHIVE.md#closed-backlog`.
>
> **v7 shipped as v1.0; phase E (D115) is DONE; phase F (D118) is BUILT.** The plan of
> record is **F4 — the phase F fresh-eyes gate**, which needs a session that didn't build
> F1–F3. The queue below is a backlog; its one 🔶 (magic items / rewards) is ungated and
> awaits Francesco's call.

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
**F1–F3 shipped 2026-08-29 (v1.2.11 → v1.2.13); only the F4 gate remains** — and D122–D124
(timeline modal + refinements, tile semantics, metamagic row, Ember palette) rode alongside,
so the gate reviews the rail against D118(a–k) with those surfaces as they now stand.

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
