# PLAN — My Spellbook

> What is queued, and what is blocked on a decision. `STATE.md` says where things stand;
> this says what comes next. Closed items → `ARCHIVE.md#closed-backlog`.
>
> **Phase M (the filter system, D172) is the newest phase and it is GATED** on his pick between
> three mocked surfaces — see below.
>
> **Phase L (the audit, D157) is TRIAGED — D158 holds every disposition.** Wave 3 (L4) shipped;
> the build list (L5) is under way — **L5.1 through L5.4 are done** and the guided builder's
> rework (L5.4) drew three rounds of his review, D161 → D166. Two of his notes are still open
> and sit as ⚑ below. Phases E–J are done. Below that is the standing backlog: open ⚑ flags
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

## Phase K — the Library redesigned (D154, decided 2026-09-01) — ✅ K1–K4 DONE (v1.5.7 → v1.5.17)

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
- [x] **K3 · Raw-stash + web refetch (the model half)** — shipped **v1.5.16** (D154(g) + **D159**). Hand-added files stash raw JSON in
  IndexedDB at import; a parser bump triggers an automatic background re-parse (stash for
  `file` books, D153 refetch for `web` books) that reports once, after, via a fading
  notice. Migration: a pre-K3 digest has no stash — its `file` books keep working and get
  stashed on their next manual re-add; the notice names them once. D138's per-book stamps
  survive and drive the auto pass. *Done when:* bumping VERSION and reloading re-parses
  everything without a prompt and the footer stamp matches; a stashless legacy book is
  named, not silently stale.
  **D159 settled the three calls this spec left open:** the stash holds RAW json and only for
  brews (`_meta.sources` is the core/homebrew line — measured 20.8 MB raw · 12.7 MB slimmed ·
  4.0 MB digest, so stashing core content is the duplication D154(g) refused); **"stale" now
  means the PARSER FINGERPRINT changed** (`window.__PARSER__`, a hash of both extractors
  injected by `build.py`), not the version, because since D158(i) a version moves on copy-only
  patches; and web books are OFFERED, never auto-downloaded (D153).
  **Verified** in the pane, every staging route and both branches: paste and zip carry `raw`
  for a brew and nothing for a core-shaped file; Apply stamped both books
  `parserHash=44301f13e4be` and stashed only the brew; flipping the fingerprint and reloading
  **re-read the brew with no prompt** (its stamp followed, its spell intact) and left the
  stashless book NAMED — *"Re-read 1 book with the current parser. 1 book (K3CORE) was added
  before the app kept a copy…"*, waiting (`ask`), one action, dismissed per fingerprint and
  silent on the next boot; a web-origin stale book got **Update data** and downloaded nothing;
  healing everything gave the fading `ok` notice with no actions; **a version-only bump
  (1.5.15 → 1.5.16) changed nothing at all** — no re-parse, no notice, footer `v1.5.16`;
  removal pruned the stash to 0 along with the digest; 0 console errors; gate clean,
  cparity 58 ok / 0 fail.
  **Found and fixed while verifying:** `filterDigest` carried `parser`/`parsedAt`/`origin`
  forward but not the new `parserHash`, so a book not re-parsed in an Apply lost its
  fingerprint and then read as current — the D138(a) false success, one field along.
- [x] **K4 · Retire the old machinery** — shipped **v1.5.17**. K1/K2 already orphaned two functions — `folderForget`
  (app.js:5489) and `clearImport` (app.js:5970) are defined and never called, their only
  callers having been the Forget-folder and Remove-imported-data buttons. `entryWalk` and the
  drop-zone handlers went with the zone in K1. Still LIVE and still needed until K3 lands:
  `refreshImported` (the ⋯ menu's Refresh and the stale-parser notice's "Refresh now"),
  `staleBooks`/`refreshMissed` (the status strip and the tray both read them), and the whole
  folder-scan chain (`folderRecall`/`folderUsable`/`scanHandle`/`stageScanBooks` — the folder
  survives as an INPUT). Remove: Refresh imported data (both surfaces),
  Rescan/Forget folder + the linked-folder row (folder picker stays as input), the
  standing Remove-imported-data button, Clear staged (the tray's Discard covers it), and
  their wiring/notices — the stale-parser boot nag is already gone, K3 replaced
  `staleParserNotice()` with `autoReparse()`. GOTCHAS entries touching
  `refreshImported`/folder recall get updated, not deleted — they explain history.
  *Done when:* the six old verbs are gone, `rg` finds no dead handlers, and the D42
  nothing-prunes contract still holds on a book removal (picks flagged, never deleted).
  **Removed:** `#refreshBtn` and `refreshImported` with its whole cast (`REFRESH_BUSY`, the
  R-state, `btnText`, `refreshButtons`, `refreshPaint`/`Stage`/`Stop`/`Done`/`Fail`/`Ask`); the
  miss memory (`refreshMissed`, `refreshMissRemember`, `spellForge.refreshMiss.v1`, the tray's
  `#importMissNote` and its `.trayrow.miss` rule); the two K1/K2 orphans `folderForget` and
  `clearImport`; and — beyond the written scope, because K4 left it with no job but a button
  label — the REMEMBERED handle (`folderRemember`/`folderRecall`/`folderUsable`, the silent
  recall in `openImport`, and the `handles` store itself, dropped at `IDB_V` 3). The folder
  picker survives as an input, and the browser reopens it where you left it on its own.
  **Kept:** the whole scan chain (`scanHandle`/`scanEntries`/`stageScanBooks`), `staleBooks()`,
  and D42's `pruneState` contract.
  **Two stale sentences went with the verbs:** the unreadable-digest boot notice said *"Use ⋯ →
  Refresh imported data"* and `stageScanBooks` said *"Rescan the folder"* — both named controls
  that no longer exist.
  **Verified** in the pane: the ⋯ menu is nine items with no Refresh; `#refreshBtn` and
  `#importMissNote` are gone from the DOM; the database upgraded to **v3 with `handles`
  dropped** (`kv`, `raw` remain) and the app booted, imported and removed across the upgrade
  without a hiccup; paste → Apply → remove still works with the busy guards gone; **D42 proved
  on a real row** — a Wizard L3 build holding `Stash Bolt|K3BREW` and `Magic Missile|XPHB` kept
  BOTH picks after its book was removed (the spell left `DATA`, the pick did not); 0 console
  errors; gate clean, cparity 58 ok / 0 fail, **deadfns now 0 with the allowlist retired** (the
  sweep's `knownOrphans` cross-check is gone — the bar is zero, and `CLAUDE.md`'s gate line says
  so).

## Phase L — the three-pillar audit (D157, decided 2026-09-01) — ✅ L0–L4 DONE (v1.5.9 → v1.5.15) · ⏳ L5: **L5.1–L5.4 shipped** (v1.5.16 → v1.5.24), L5.5 on

D157 owns the charter, the agents, the rejected shapes — cite it. Reports land in `audits/`
(one per pillar + `synthesis.md`), a point-in-time artifact `/clean` archives once consumed.

- [x] **L0 · Deterministic sweeps** (session, scripts in `scratchpad/`, join the verify gate):
  uncalled functions · unmatched CSS selectors · duplicated helpers · storage keys and
  migrations · handler wiring against GOTCHAS. *Done when:* each script runs with nothing
  installed and prints a list the code agents start from.
  → done 2026-09-01: `scratchpad/sweeps/` (deadfns · deadcss · dupfns · storagekeys · handlers · ids), report `audits/L0-sweeps.md`; deadfns + ids gate since v1.5.12.

- [x] **L1 · Wave 1, auditors in parallel** (all report; trivial fixes in worktrees only):
  A direction `opus@high` · B1 live UX `opus@high` · B2 design-system read `sonnet@medium` ·
  C1 app.js structure `sonnet@medium` · C2 browser bug sweep `sonnet@medium` · C3 extractors
  / importer / storage `sonnet@medium`. *Done when:* six reports in `audits/`, every finding
  with evidence, B1 also holding the string inventory the copy rewrite starts from.
  → done 2026-09-01/02: six reports in `audits/` (A, B1, B2, C1, C2, C3) + `strings-inventory.md`.

- [x] **L2 · Wave 2, verifiers** `opus@high`, one per pillar, blind to the auditor's
  reasoning: reproduce or strike, then rank. *Done when:* each report carries a verdict per
  finding and a struck list.
  → done 2026-09-02: `V-A`, `V-B`, `V-C`; A 48/58 claims confirmed, B 44/45 findings, C all bugs reproduced, 2 C1 claims struck.

- [x] **L3 · Synthesis + triage interview** — done 2026-09-02: `audits/synthesis.md`, then five
  AskUserQuestion rounds → **D158** (every disposition, cite it).
- [x] **L4 · Wave 3, act** (D157(f), token-lean per D158): two Sonnet fix agents in worktrees
  (engine/importer · UI/a11y/CSS), then the copy rewrite on the merged tree with its before/after
  string table (D157(d), D158(l)), sequential squash-merge, gate each time, patch bumps.
  *Done when:* merged, smoke-tested on the merged tree, the table reviewed, vetoes reverted by
  name. Contents: the synthesis's "ships without a decision" list + D158(m)'s four flags +
  D158(e) pending count + D158(k) gate and lint.
  → done 2026-09-02, **v1.5.11 → v1.5.15** (two Sonnet fix agents + one copy agent, no verifier wave per D158): every item in the synthesis's "ships without a decision" list, D158(m)'s four flags, D158(e), D158(k). Smoke on the merged tree caught the dialog observer's first-open miss (v1.5.14). **Copy table awaits Francesco's veto** (⚑ below).

- [ ] **L5 · The build list** (D158(a) order; K3/K4 re-queued at the top):
  - [x] **L5.1 · K3** raw-stash + automatic re-parse — v1.5.16, **D159** (absorbed the C2-02 dead end, D158(h)). **K4 is next.**
  - [x] **L5.2 · Engine test scaffold** — shipped **v1.5.18**, the gate's **eighth** line
    (D158(j)): a boot guard (`__SB_HEADLESS__`) and an export shim in app.js,
    `scratchpad/engine.test.js` with a permissive DOM stub, **ten fixtures / 33 assertions**.
    **Fixture one is the pooling correction (D158(b)), which this task also SHIPPED:** every
    half-caster now contributes ⌈its own level/2⌉ instead of joining one bucket floored once,
    in both `compute()` and `planSlots()`. Artificer 5 / Wizard 5 → **8** (was 7), Paladin 1 /
    Sorcerer 4 → **5** (was 4), Paladin 3 / Ranger 3 → **4** (was 3); even splits unchanged.
    The other nine cover the own clock and the AT/EK rows, single-caster vs pooled, the pact
    pool staying separate, `verLt`, D146's empty slot, the per-book stamp carry-forward
    (fixture 8 guards the hole that has opened three times), the keyed digest merge, and
    D159(a)'s brew test.
    **Verified:** 33 ok / 0 fail, and **mutation-checked** — reverting the pooling fix reddens
    1a/1b/1c and dropping `parserHash` from `filterDigest` reddens 8b, exit 1 either way; the
    live app now reads `1st 4 · 2nd 3 · 3rd 2` for Paladin 1 / Sorcerer 4 (caster level 5).
    eslint needed one global (`module`, guarded by the shim's `typeof` test); config comment
    says why.
  - [x] **L5.3 · First import merges onto the bundle** (D158(d), amends D137) — shipped
    **v1.5.19**, implementation calls in **D160**. `assembleData` is now
    `IMPORTED ? mergeDigests(BAKED,IMPORTED) : BAKED`; the bundle is merged at ASSEMBLY and
    never written to storage (that would duplicate 4 MB and freeze a stale bundle that wins
    over the next release's). The staging base stays a storage question — widening it was
    tried and reverted the same hour, because `buildImport` reads `fresh` to tell an unticked
    book from a new one and every bundled book then looked unticked. Source counts are
    recomputed at assembly so a merged book's row matches what is on screen.
    **Verified:** first import takes 43 books → **44** (was 43 → 1) with one book in storage;
    a bundled book re-imported reads "nothing new here · Re-read 1 book", applies, and its
    record sits beside the bundle's; removing it leaves the bundle's copy, 392 spells and a
    `built-in` chip; 936 → 937 spells on a brew; gate clean, engine 35 ok / 0 fail.
  - [x] **L5.4 · Guide-stage mockup round** (D158(f)), then the chosen variant — shipped
    **v1.5.20**, **D161**. Six mockups from `scratchpad/mkguide.py`; the first round's side
    panels were rejected as redundant with the chain rail (his call, and right), so the answer
    became the step's own WORK: the picker's box moves into the stage above the guide's
    breakpoint and stays a modal below it. Fill **12% → 68%**. `column-width` was tried and
    measured wrong (a 486px lineage group pushed the list off the right edge, `scrollWidth`
    6880 in a 964 box). Mobile mockup `guide6.html` kept for L5.6.
    **Reviewed and re-shipped as v1.5.21 (D162)** on his notes: the list REPLACES the opener
    button (it was redundant beside an open picker), a multi-section step shows its sections as
    chips and loses the duplicated section headers, **one column always** (D161(c) reversed),
    capped at 720 and centred, and the end-of-walk sentence moved INSIDE the card — his "done
    and next session overlap", two surfaces claiming the same moment with the nav between them.
    Mockups `guide7`/`guide8` approved before implementation, as he asked.
    **Reworked again as v1.5.22 (D164)** — his notes on 1.5.21: the header's background and the
    unstyled × were ONE bug (a node moved out of `.modal` loses every `.modal`-scoped rule), the
    picker still took a click to reveal, and the mockups had been idealised rather than built
    from the app's own markup. So: the stage is a picker SURFACE with no dialog chrome, open by
    DEFAULT, with the app's own detail surface as a **preview pane** filled by clicking a name
    (his idea for the empty right band). Every filter comes with the box and its `.pickbar` is
    lifted out of the scroller so the popover cannot clip. Mockups `guide9`/`guide10` approved
    first. Two re-entrancy bugs and one stranded-detail-surface regression found and fixed on
    the way — all three are now GOTCHAS.
    **Eight adjustments on his review shipped as v1.5.23 (D165)**, including the one real bug:
    a pick taken beyond what the level asks for could not be dropped (the character view's
    pull-back rule reached a surface it was never meant for). The detail pane now opens only
    above 1100px and only once something is selected, animating the picker down and collapsing
    by hand; the filter popover is unmasked; the picker's grouping header is a label; the walk's
    buttons grew; the level chip left the top bar; and a finished section hands the picker to
    the next one still asking.
  - [ ] **L5.5 · Copy the build as a level plan** to the clipboard, in the Character Ideas shape
    (A-03; `levelGains`/`levelCasting`/`timelinePicks` already derive it). Size S, format his. 🔶
  - [ ] **L5.6 · PWA install check + a mobile pass on the Pages build** (D158(r); A-08). His
    action first, then measured fixes.
  - [ ] **L5.7 · Geometry full retrofit** (D158(g)), measured before/after, own release. Size L.
  - [ ] **L5.8 · Ability scores + PB: the decision entry** (D158(c)); the build queued behind it.
  - [ ] **L5.9 · Magic items as custom-source prefill**, then rewards (D158(n)). Size M/L + M.
  - [ ] **L5.10 · Compare two versions** (A-05). Size M/L.
  - [ ] **L5.11 · Doc diet**: DECISIONS.md to an index at the next `/clean` (D158(q)).
  - Also live, unscheduled (D158(o)): SHADOWED source-aware · `subclassFeature` `_copy` · long-rest
    swap detection · High Elf / Human origin · A-09 character-forge handoff · A-13 concept line ·
    A-14 homebrew recipe · A-15 mirror script.

## Phase M — the filter system (D172, decided 2026-09-02) — 🔶 GATED on his mockup pick

Every picker's filters, audited against 5etools' own source and rebuilt to one standard.
**D172 owns the SET — cite it, don't re-derive it** — and the SURFACE is the one open call:
`python3 scratchpad/mkfilters.py` → `mockups/filters{1,2,3}.html` (popover · panel · bar).
Nothing here needs the extractors: every value is already in `data.json`.

- [ ] **M1 · The surface** 🔶 — his pick of filters1/2/3, then build the container and the
  standard: noun headings (`.mopt.colhead`), toggle rows (`.cbrow`/`.cbtn`) for enumerations,
  the Library's switch (`.swk`) for binaries, the book checklist for books. Size M.
  *Done when:* one filter surface renders for every picker, measured at 1280 and 375 in both
  themes, and no popover scrolls taller than the list it filters.
- [ ] **M2 · The spell filters** (D172(b)) — School · Cast time · Duration · Components +
  Ritual + Concentration · Damage · Save · Condition, on BOTH spell pickers (D172(c)); the
  guide's has none today. Duration needs a category DERIVED in `app.js` from `durTxt`+`conc`
  — deliberately not an extractor field. Size M/L.
  *Done when:* each filter narrows the list correctly against a known spell, the guide picker
  and the main picker offer the same set, and the ⋯ button's narrowed-count follows.
- [ ] **M3 · The feat filters** (D172(d)) — prerequisite STATE (eligible / not yet / can't
  verify, replacing the binary "hide ones I can't take") and ability bonus. Size S.
- [ ] **M4 · The wording pass** — his *"dry, streamlined"*: every group a noun, every binary a
  labelled toggle, one name per thing ("Books", never "Source book"). It lands WITH M1's
  standard, not before it. Feeds the copy-veto pass. Size S.
- Not in scope, with his agreement (D172(e)): species size / speed / traits / creature type —
  we extract none of it, and it would mean both extractors, cparity and a data refresh.

## Open ⚑ — calls for Francesco

- [ ] **🔶 Pick the filter surface** — `scratchpad/mockups/filters{1,2,3}.html`, both themes
  (`python3 scratchpad/mkfilters.py` regenerates): **1** one popover sectioned · **2** a panel
  beside the list · **3** a bar with one popover per group and chips for what is narrowed.
  D172(f); Phase M is blocked on it. ⚑ (owner: Francesco, 2026-09-02)
- [ ] **Copy veto pass** — `audits/copy-table.md`, 227 rows; revert by name. Also decide the ten
  progress ellipses ("Fetching…", kept as "still running"). Phase M's **M4** will add the filter
  strings to it. ⚑ (owner: Francesco, 2026-09-02)
- [x] **The class step needs the full-size picker the others have** (his note, 2026-09-02) —
  shipped **v1.5.26**, **D168**. The entity picker has a `class` kind (with the D148 class body
  in the preview pane), a change REWRITES the level's row in `state.levelOrder`, and a change
  that would empty a class arms first and says so once, in the bar. Two of his calls settled it:
  arm the destructive case, and never open a class picker with its step — the growth step's two
  big buttons (D126(d)) stay and the picker is the way out when neither is the answer. The
  `<select>` D126(d) put there is gone.
- [x] **Highlight the next choice in a section, and a new Next state** (his note) — shipped
  **v1.5.25**, **D167**. He took **A, the accent ring** (`guide11.html`), with hover REPLACING
  the mark rather than layering on it — the one thing the mockup had wrong. B (leading dot) and
  C (the rest recede) are rejected in D167(a). Next now walks the step's own sections before the
  level and names where it goes ("Next: spellbook spells").
- [ ] **Third-casters are still POOLED, then floored** — found while implementing D158(b),
  outside its scope. `Math.floor(third/3)` sums Eldritch Knight and Arcane Trickster levels
  into one bucket; the table reads "a third of your Fighter levels" and "a third of your Rogue
  levels" separately, so Fighter 5 (EK) + Rogue 5 (AT) should pool to 2, and the app says 3.
  Same shape as the half-caster bug, one class-pair rarer. One line in each of `compute()` and
  `planSlots()`, plus a fixture. ⚑ (owner: Francesco, 2026-09-02)
- [ ] **Wave-3 leftovers, small:** the four importer strings in `extract.js` whose twins live in
  `extract.py` (move together, cparity); `— none —` (Fighting Style) is label AND stored key, needs
  a display/key split before it can be renamed; the `.abtile` DOM-built abchip (app.js ~3369) not
  routed through `abChip()`; `.gmenu` selects were styled only through the removed `.grinline`
  ancestor and render unstyled (pre-existing, found by 3b). ⚑ (owner: session, 2026-09-02)
- [x] **D125's clamp now covers the trade.** With the swap inside a step that also holds
  picks, a trade at L4 is clamped to L1 while the L1 picks are unfilled — it could not be
  when the trade was its own pick-free step. Only bites on a part-built character. Fix if it
  matters in use: carry the clicked section through `guideGo` and skip the clamp for a swap.
  ⚑ (owner: Francesco, 2026-08-31)
  → **D158(m): FIX in wave 3.**

- [x] **⚑ "The feature table should be collapsible and start out collapsed"** was read as the
  PROGRESSION table (D149(a)). If it meant the Features BLOCK, the default is one word to
  flip. ⚑ (owner: Francesco, 2026-09-01)
  → **D158(p): closed as read.**

- [x] **The `…`-placeholder family needs one call** (H6, left as scoped): "+ add a class…",
  "cantrip leaving…", "its replacement…", "filter books…", "note — e.g. …" — plus the
  same-shaped "no filter" options the audit had missed, `all schools` / `all classes`
  (index.html:139-140), `"any save"` / `"any damage"` (app.js:6383-6384) and `#fChosen`'s
  `picked` (index.html:135). They are internally consistent; one call settles all of them.
  ⚑ (owner: Francesco, 2026-08-30)
  → **D158(l): drop the ellipses, keep the verbs; the copy rewrite applies it.**

- [x] **`.gcstep.optional .gcl::after{content:" · optional"}`** (styles.css:1822) is the
  CSS-authored twin of the `"Optional"` capitalised at app.js:2042. Different surface
  (chain rail, appended mid-line after a middot) and H6's audit said no CSS work — but if
  the two should match, that is the line. ⚑ (owner: Francesco, 2026-08-30)
  → **D158(m): align with the card, wave 3.**

- [x] **`favKey` is per PRINTING, so a mark is stored under one edition** (I4): a mark lives
  under `Find Familiar|XPHB`; if `grantRec` later resolves the other printing (reprint
  filter `all`, or a book toggled) the mark is not seen. Deterministic under the default
  filter — every surface goes through `grantRec` — but making `sbFav` edition-tolerant is a
  storage-shape change. ⚑ (owner: Francesco, 2026-08-30)
  → **D158(m): make `sbFav` edition-tolerant, wave 3.**

- [x] **The guide's ability-score note has no home** (v1.4.5): removing the `?` before
  "Character view" (D141(b)) deleted its disclosure, and *"Ability scores aren't tracked, so
  ASI = skip the step"* is the one line in it with no remaining surface. Re-home it (the ASI
  step card is the natural place) or drop it. ⚑ (owner: Francesco, 2026-08-31)
  → **D158(c): re-homed by the ability-score decision entry (L5.8).**

- [x] **`.tlswapc` and `.tlalert` now differ in KIND** (D152): the trade state is still a
  translucent TINT, the alert state is an opaque plate. `.tlswapc` passes AA on its own, so
  aligning it would be a restyle rather than a fix — flagged only in case the mismatch reads
  wrong in use. ⚑ (owner: Francesco, 2026-09-01)

## Queue — open work
  → **D158(m): restyle the trade tile to a plate, wave 3.**

- [x] **2024 pooling rounds half-casters up per class, and the app floors them** (found
  during the v1.4.3 fix, out of its scope): `compute()`/`planSlots()` lump `artificer` and
  `"1/2"` into one bucket and take `⌊half/2⌋`, but TCE Artificer and XPHB Paladin/Ranger
  round up PER CLASS when multiclassing — Artificer 5 / Wizard 5 should pool to caster
  level 8, the app says 7. Touches the pooled slot table only. ⚑ (owner: Francesco,
  2026-08-31)
  → **D158(b): all three round up per class; fixture one of L5.2.**

- [x] **Magic-item / reward ingestion** — 🔶 **RESEARCHED 2026-08-27, awaiting the call.**
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
  → **D158(n): items as prefill first, then rewards (L5.9).**

- [ ] **`SHADOWED` is not source-aware** (D127 agent flag): with XPHB off, 90 reprinted
  subclasses stop being reprint-hidden but only 6 surface — `collapseEditions` still shadows
  them behind an XPHB winner whose book is off. Consulting `srcOn` there means re-running
  `buildIndexes` on every source change — a D-level behavioural call.
  ⚑ (owner: Francesco, 2026-08-29)
- [ ] **`subclassFeature` `_copy` records (75, all shallow/same-file, zero `_mod`)** are
  still unresolved (D127 scoped them out): 2014 twins' FEATURE lists may read hollow even
  though grants now resolve. If feature names ever look wrong on a 2014 subclass, this is
  why — the resolver exists, it just isn't pointed at them. ⚑ (owner: Francesco, 2026-08-29)
- [x] **Prerequisites we can't check**: ability scores, proficiencies, backgrounds and
  campaigns aren't in the app's model, so those alternatives read "check …" rather than
  pass/fail. Closing this means tracking ability scores — a bigger change than it looks.
  ⚑ (owner: Francesco, 2026-08-26)
- [x] **Polymorph / Shapechange / True Polymorph as creature sets** — Francesco:
  "technically a spell with multiple stat block options, but perhaps it would require full
  monster catalogue". Correct: their filters are open-ended (any Beast of CR ≤ your level,
  any creature of CR ≤ …), which is the whole bestiary — 4,458 monsters. D78's carried set
  is 65. Out of scope until there is a reason to ship the catalogue; a CR-capped subset
  would still be hundreds. ⚑ (owner: Francesco, 2026-08-27)
  → **D158(o): archived as out of scope.**
  → **D158(c): folds into the ability-score decision entry (L5.8).**

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
