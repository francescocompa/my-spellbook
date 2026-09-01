# PLAN — My Spellbook

> What is queued, and what is blocked on a decision. `STATE.md` says where things stand;
> this says what comes next. Closed items → `ARCHIVE.md#closed-backlog`.
>
> **Nothing is gated.** Phases E–J are done; **phase K (the Library rebuild, D154) is OPEN —
> K1 shipped in v1.5.7 and K2 in v1.5.8; K3–K4 are next.** Below that is the standing backlog: open ⚑ flags
> (calls only Francesco can make) and the Queue, whose one 🔶 (magic items / rewards) is
> researched and awaits his call.

## Shipped phases — bodies archived, models still binding

The **model** for each phase lives in `DECISIONS.md` and still constrains any change to
these surfaces; cite the D-entry, don't restate it. The task bodies (done-when evidence,
merge notes) are archived.

| Phase | What it built | Model | Bodies |
|---|---|---|---|
| **E** | a build at every level | D115(a–j) | `ARCHIVE.md#phase-e` |
| **F** | the guided builder | D118(a–k) | `ARCHIVE.md#phase-f` |
| **G** | the guide as a full-size page | D126(a–i) | `ARCHIVE.md#phase-g` |
| **H** | guided builder v2 | D130(a–h) | `ARCHIVE.md#phase-h` |
| **I** | guided builder v3 | D131(a–h) + D132 | `ARCHIVE.md#phase-i` |
| **J** | Francesco's notes batch | D142 + D143 + D144 + D145 | `ARCHIVE.md#phase-j` |

→ archived 2026-08-31: the W1–W5 wave batch — `ARCHIVE.md#wave-batch`; the 2026-08-31 bug's
task lines — `ARCHIVE.md#bug-0831`; closed one-off bugs and batches (v1.3.0 → v1.4.3,
D135–D138 + the third-caster clock) — `ARCHIVE.md#closed-oneoffs-0831`.

Optional follow-up, never scoped: D76's Magical Secrets narrowing could report the EXACT
window for ordered picks instead of best-case.

→ archived 2026-09-01: Phase J body (J1–J4, J5, "Closed out of J3", J6–J10, J11–J12, all
eighteen items, models D142–D145) — `ARCHIVE.md#phase-j`; "Closed in v1.4.7"
(`refreshAddFeat()`'s `#epicRow` defect) — `ARCHIVE.md#closed-v1-4-7`; "Closed in v1.4.14"
(a drop re-dating every pick below it, D146) — `ARCHIVE.md#closed-v1-4-14`; "Closed in
v1.5.3" (the class ⊕ subclass merge, D150) — `ARCHIVE.md#closed-v1-5-3`.

## Phase K — the Library redesigned (D154, decided 2026-09-01) — ⏳ K1 + K2 SHIPPED, K3–K4 OPEN

The design is LOCKED — one page, one list, selection bar, no refresh verbs; the approved
mockup is `scratchpad/mockups/library4.html` (`python3 scratchpad/mklib4.py` regenerates)
and **D154 owns every call and every rejected option — cite it, don't re-derive.** Order
matters: K1/K2 are UI over the existing model; K3 changes the model and K4 deletes what K3
obsoletes.

- [x] **K1 · The one-page shell** — shipped **v1.5.7** (D154 + **D155**). Kill the Sources|Manage tabs; status strip (books ·
  5etools version vs latest · storage · **Update data**, accent-bordered when a release is
  out) + search/Actions + G1 edition groups + R3 two-line rows (select-checkbox · name over
  kind counts · origin chip web/file/built-in · enable switch; disabled = dimmed, no badge)
  + selection bar (Clear · enabled switch · Remove, armed) + footer Close · ＋ Add files ▾
  (Upload .zip · Upload .json files · Choose a folder… · Paste JSON…). The permanent drop
  zone and drag-drop die (D154(f) — drop-anywhere was offered and rejected). Onboarding =
  the same page's empty state. *Done when:* every current capability except the retired
  verbs is reachable on the new page; a book can be enabled, disabled and removed singly
  and in bulk; alignment measured at 1280 and 375 in both themes.
  **Verified:** 44 rows in 6 edition groups; the switch toggles and dims (`aria-checked`
  follows), the row body selects and the switch does not; Actions' four verbs scoped to what
  the search is showing; removal armed (D53) and proved singly AND in bulk against the real
  44-book digest, then restored **byte-identical** (`JSON.stringify` equal, 4,373,629 bytes);
  paste → tray → Apply/Discard with nothing stored; empty state renders; **0 of 44 origin
  chips misaligned** (X and Y within 0.6px) at 1280 and 375 in BOTH themes, switch and
  checkbox centred to 0.00px; footer pinned and the popover in-viewport at both widths;
  0 console errors; gate clean, cparity 51 ok / 0 fail. **D155 records the five calls D154
  left open** — the single Add-files button, the address in Actions, the staged-only
  keep-plan, the pinned column, and the per-book origin stamp with its migration rule.
- [x] **K2 · The pending-import tray** — shipped **v1.5.8** (D154(h) + **D156**). Staged files render as a tray above the status
  strip, only while staged: chips · new-book ticks · Discard / **Add N books**. Replaces
  `#importPlan` as a standing surface; D86/D112 merge semantics unchanged underneath.
  *Done when:* a brew lands, shows in the tray, Adds into the list, and nothing is stored
  before the commit; Discard is armed.
  **Verified:** hidden at rest, shown only while staged, and rendered ABOVE the status strip;
  a two-book paste showed 1 new book tickable and summarised the 1 re-read as a sentence
  ("Add 1 book"); Add took the digest 44 → 45 with the new book enabled, took XGE 95 → 96
  spells, and **dropped nothing** (`lost: []` against a pre-Add snapshot) — then restored
  byte-identical; Discard is armed (D53) and left the stored digest untouched; a 12-book
  brew brought the filter row out at the ≥9 threshold and the list scrolled inside itself;
  checkbox and counts centred to 0.00px on every row at 1280 and 375 in both themes, 0
  overflow out of the box, footer in view. **D156 records the add-only model.**
- [ ] **K3 · Raw-stash + web refetch (the model half).** Hand-added files stash raw JSON in
  IndexedDB at import; a parser bump triggers an automatic background re-parse (stash for
  `file` books, D153 refetch for `web` books) that reports once, after, via a fading
  notice. Migration: a pre-K3 digest has no stash — its `file` books keep working and get
  stashed on their next manual re-add; the notice names them once. D138's per-book stamps
  survive and drive the auto pass. *Done when:* bumping VERSION and reloading re-parses
  everything without a prompt and the footer stamp matches; a stashless legacy book is
  named, not silently stale.
- [ ] **K4 · Retire the old machinery.** K1/K2 already orphaned two functions — `folderForget`
  (app.js:5489) and `clearImport` (app.js:5970) are defined and never called, their only
  callers having been the Forget-folder and Remove-imported-data buttons. `entryWalk` and the
  drop-zone handlers went with the zone in K1. Still LIVE and still needed until K3 lands:
  `refreshImported` (the ⋯ menu's Refresh and the stale-parser notice's "Refresh now"),
  `staleBooks`/`refreshMissed` (the status strip and the tray both read them), and the whole
  folder-scan chain (`folderRecall`/`folderUsable`/`scanHandle`/`stageScanBooks` — the folder
  survives as an INPUT). Remove: Refresh imported data (both surfaces),
  Rescan/Forget folder + the linked-folder row (folder picker stays as input), the
  standing Remove-imported-data button, Clear staged (the tray's Discard covers it), the
  stale-parser boot nag (refitted by K3), and their wiring/notices. GOTCHAS entries touching
  `refreshImported`/folder recall get updated, not deleted — they explain history.
  *Done when:* the six old verbs are gone, `rg` finds no dead handlers, and the D42
  nothing-prunes contract still holds on a book removal (picks flagged, never deleted).

## Open ⚑ — calls for Francesco

- [ ] **D125's clamp now covers the trade.** With the swap inside a step that also holds
  picks, a trade at L4 is clamped to L1 while the L1 picks are unfilled — it could not be
  when the trade was its own pick-free step. Only bites on a part-built character. Fix if it
  matters in use: carry the clicked section through `guideGo` and skip the clamp for a swap.
  ⚑ (owner: Francesco, 2026-08-31)
- [ ] **⚑ "The feature table should be collapsible and start out collapsed"** was read as the
  PROGRESSION table (D149(a)). If it meant the Features BLOCK, the default is one word to
  flip. ⚑ (owner: Francesco, 2026-09-01)
- [ ] **The `…`-placeholder family needs one call** (H6, left as scoped): "+ add a class…",
  "cantrip leaving…", "its replacement…", "filter books…", "note — e.g. …" — plus the
  same-shaped "no filter" options the audit had missed, `all schools` / `all classes`
  (index.html:139-140), `"any save"` / `"any damage"` (app.js:6383-6384) and `#fChosen`'s
  `picked` (index.html:135). They are internally consistent; one call settles all of them.
  ⚑ (owner: Francesco, 2026-08-30)
- [ ] **`.gcstep.optional .gcl::after{content:" · optional"}`** (styles.css:1822) is the
  CSS-authored twin of the `"Optional"` capitalised at app.js:2042. Different surface
  (chain rail, appended mid-line after a middot) and H6's audit said no CSS work — but if
  the two should match, that is the line. ⚑ (owner: Francesco, 2026-08-30)
- [ ] **`favKey` is per PRINTING, so a mark is stored under one edition** (I4): a mark lives
  under `Find Familiar|XPHB`; if `grantRec` later resolves the other printing (reprint
  filter `all`, or a book toggled) the mark is not seen. Deterministic under the default
  filter — every surface goes through `grantRec` — but making `sbFav` edition-tolerant is a
  storage-shape change. ⚑ (owner: Francesco, 2026-08-30)
- [ ] **The guide's ability-score note has no home** (v1.4.5): removing the `?` before
  "Character view" (D141(b)) deleted its disclosure, and *"Ability scores aren't tracked, so
  ASI = skip the step"* is the one line in it with no remaining surface. Re-home it (the ASI
  step card is the natural place) or drop it. ⚑ (owner: Francesco, 2026-08-31)
- [ ] **`.tlswapc` and `.tlalert` now differ in KIND** (D152): the trade state is still a
  translucent TINT, the alert state is an opaque plate. `.tlswapc` passes AA on its own, so
  aligning it would be a restyle rather than a fix — flagged only in case the mismatch reads
  wrong in use. ⚑ (owner: Francesco, 2026-09-01)

## Queue — open work

- [ ] **2024 pooling rounds half-casters up per class, and the app floors them** (found
  during the v1.4.3 fix, out of its scope): `compute()`/`planSlots()` lump `artificer` and
  `"1/2"` into one bucket and take `⌊half/2⌋`, but TCE Artificer and XPHB Paladin/Ranger
  round up PER CLASS when multiclassing — Artificer 5 / Wizard 5 should pool to caster
  level 8, the app says 7. Touches the pooled slot table only. ⚑ (owner: Francesco,
  2026-08-31)
- [ ] **Magic-item / reward ingestion** — 🔶 **RESEARCHED 2026-08-27, awaiting the call.**
  The old note said "items carry no structured uses"; that is **wrong** and the audit
  corrected it.
  - **Items.** `charges` (282), `recharge` (286, closed enum), `rechargeAmount` (254) and
    `attachedSpells.charges` (a real cost→spells map, 138 items) map **straight** onto the
    D55/D95 model. Staff of Fire's record is literally `pool:10 · "1d6+4 at dawn" · costs 1/3/4`.
  - **The hole:** save DC, attack bonus and casting ability are **prose only** — of 402
    items with attached spells, **zero** carry a structured DC or attack and only **9** name
    an ability. Those three fields would always arrive blank and be typed by hand.
  - **The trap:** *Luck Blade is not a record in `items.json`.* It is a magicvariant template
    (`requires:{sword:true}`) cross-multiplied against base items. 11 spell-granting
    templates expand to **115** items, plus 53 `_copy` records (41 with no content of their
    own). A naive flat read returns 402 and silently drops the rest — porting
    `_createSpecificVariants` is ~150 lines **into both extractors**.
  - **Size:** ~120 KB slimmed, ~780 KB with prose — and the prose is the only place the DC lives.
  - **SRD:** only ~80 of 542 spell-granting items are `srd52`, so the public build gets almost none.
  - **The cheaper half — `rewards.json`:** 277 charms / blessings / boons / piety traits,
    **88 with `additionalSpells`** — the *same* schema the extractors already parse for
    classes, species and feats. No new parsing, no variant cross-product, no prose regex;
    its `innate`/`known`/`prepared` map onto the app's three modes directly. **Caveat: zero
    SRD flags**, so it is import-only content.
  - **Suggested order** (not decided): rewards first as a small self-contained addition,
    then items as *"prefill a custom source from an item"* rather than a first-class entity,
    since the DC needs hand-entry regardless. ⚑ (owner: Francesco, 2026-08-27)
- [ ] **`SHADOWED` is not source-aware** (D127 agent flag): with XPHB off, 90 reprinted
  subclasses stop being reprint-hidden but only 6 surface — `collapseEditions` still shadows
  them behind an XPHB winner whose book is off. Consulting `srcOn` there means re-running
  `buildIndexes` on every source change — a D-level behavioural call.
  ⚑ (owner: Francesco, 2026-08-29)
- [ ] **`subclassFeature` `_copy` records (75, all shallow/same-file, zero `_mod`)** are
  still unresolved (D127 scoped them out): 2014 twins' FEATURE lists may read hollow even
  though grants now resolve. If feature names ever look wrong on a 2014 subclass, this is
  why — the resolver exists, it just isn't pointed at them. ⚑ (owner: Francesco, 2026-08-29)
- [ ] **Prerequisites we can't check**: ability scores, proficiencies, backgrounds and
  campaigns aren't in the app's model, so those alternatives read "check …" rather than
  pass/fail. Closing this means tracking ability scores — a bigger change than it looks.
  ⚑ (owner: Francesco, 2026-08-26)
- [ ] **Polymorph / Shapechange / True Polymorph as creature sets** — Francesco:
  "technically a spell with multiple stat block options, but perhaps it would require full
  monster catalogue". Correct: their filters are open-ended (any Beast of CR ≤ your level,
  any creature of CR ≤ …), which is the whole bestiary — 4,458 monsters. D78's carried set
  is 65. Out of scope until there is a reason to ship the catalogue; a CR-capped subset
  would still be hundreds. ⚑ (owner: Francesco, 2026-08-27)
- [ ] **Detect a real long-rest spell swap in the extractors** — D73's Granted tab lists
  every `kind:"known"` pick because the digest has no flag for "you may replace this on a
  long rest". **Attempted 2026-08-27 and deliberately stopped:** the prose is there
  ("Whenever you finish a Long Rest, you can replace that cantrip…") but it is NOT on the
  species entry a flat walk reaches — it lives inside 5etools' unresolved `_copy._mod` /
  `_versions` blocks and inside TABLE rows. A regex over `entries` finds **zero** matches.
  Closing this means resolving those structures, which neither extractor does. Bigger than
  it looks. ⚑ (owner: Francesco, 2026-08-27)
- [ ] High Elf true in-table cantrip swap; Human extra-origin restricted to origin cats.

→ closed backlog items (all of them): `ARCHIVE.md#closed-backlog`
