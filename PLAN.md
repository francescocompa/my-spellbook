# PLAN — My Spellbook

> What is queued, and what is blocked on a decision. `STATE.md` says where things stand;
> this says what comes next. Closed items → `ARCHIVE.md#closed-backlog`.
>
> **Nothing is gated and nothing is owed.** Every phase (E–K) is done; the 2026-08-31 bug is
> resolved and **phase J — Francesco's 18-item notes batch — shipped in full** (v1.4.8 →
> v1.4.12, D142–D145). What remains is the standing backlog below: open ⚑ flags (calls only
> Francesco can make) and the Queue. Its one 🔶 (magic items / rewards) is researched and
> awaits his call. One ⚑ is NEW and was created by J6 — D125's clamp now covers the trade.

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
| **J** | Francesco's notes batch | D142 + D143 + D144 + D145 | still live below |
| **K** | the Library redesigned | D154 + D155–D159 | still live below |

→ archived 2026-08-31: the W1–W5 wave batch — `ARCHIVE.md#wave-batch`; the 2026-08-31 bug's
task lines — `ARCHIVE.md#bug-0831`; closed one-off bugs and batches (v1.3.0 → v1.4.3,
D135–D138 + the third-caster clock) — `ARCHIVE.md#closed-oneoffs-0831`.

Optional follow-up, never scoped: D76's Magical Secrets narrowing could report the EXACT
window for ordered picks instead of best-case.

## Phase J — the 2026-08-31 notes batch — ✅ DONE (v1.4.8 → v1.4.12)

Six surfaces, eighteen items, all shipped. The models are **D142** (masked chip fields, ability
tiles, the filter icon + active-filter chips, the familiar picker), **D143** (one spellcasting
step, the guide's copy), **D144** (the menu grouping, the custom builder) and **D145** (the light
theme). Cite those rather than re-deriving; the bodies below keep each original note under its
ticked line and are the natural next thing a `/clean` archives.

The four mockups that settled J1–J4 are at `scratchpad/mockups/index.html` (gitignored, built
against the real `styles.css`). **Three of the four recommendations were rejected in favour of
Francesco's own reading** — see each D142 sub-entry's *Rejected:* clause before re-proposing.

### J1–J4 · ✅ shipped (were gated on the mockup review)

- [x] **J1 · Choices — the chip field is masked behind its button** (v1.4.8, D142(a)).
  *Shipped as the masked one-line field, not the stacked row — see D142(a).* Original note: Description goes full width; chips wrap
  on a second row with the button on it. Measured in the mockup: today a four-chip run is
  **574px inside a 374px card — 228px past the edge** (`.choicerow>.picks{flex:0 0 auto}` sets
  its width to max-content, so `flex-wrap` on `.picks` can never fire). Two variants: **A1**
  button right-aligned (recommended), **A2** button leads the row. 🔶
- [x] **J2 · Casting ability — chip-only tiles** (v1.4.8, D142(b)). Original note: One tile per eligible ability, wearing
  that ability's key colour. The tokens already exist (`--ab-str`…`--ab-cha`, used by
  `.abchip`/`.savechip`), so no new palette. Variants: **B1** chip + full name (recommended),
  **B2** chip only. Six-wide worst case wraps to two rows at 396px. 🔶
- [x] **J3 · Filters became an icon; the active ones became a masked chip row** (v1.4.8,
  D142(c)). **The height cap was NOT part of what was decided** and is still open — see the
  Queue below. Original note: (i) drop the
  `activeFilterCount()` badge (app.js:7094) for a filtered/not-filtered state on the button
  plus a clear that never opens the panel — **C1** segmented ✕ beside Filters (recommended)
  or **C2** a status line saying "128 of 411". (ii) cap the list height and scroll inside it,
  level headers sticky. 🔶
- [x] **J4 · Familiar picker — search, filters, rename, and stat blocks like spells**
  (v1.4.8, D142(d)). No preview pane. Original note: Add the search + filter row
  the other pickers have; rename *"Find Familiar's own forms"* → **Other familiars**
  (app.js:7513); split into list + collapsible stat-block preview reusing `sbBodyHTML()`.
  **Investigated (asked for):** spell pickers can do the same via the existing `modalHTML(sp)`;
  creatures via `sbBodyHTML(b)`; **feats/optional features cannot yet** — there is no
  feat-detail renderer, only a one-line `.entprev`, so that one is its own task.
  One real cost: the `.sb*` rules are scoped under `.spmodal` and need the scope widened. 🔶

### J5 · ✅ shipped — a v1.4.5 regression

- [x] **The Chain/Decision toggle showed on desktop and did nothing** — fixed in v1.4.8. — **REGRESSION FROM
  v1.4.5, cause found.** `.btn:has(>.lbl-ico){display:inline-flex}` (styles.css:49, added as
  the `.lbl-ico` baseline-centering fix) has specificity 0-2-0 and beats
  `.gh-toggle{display:none}` (styles.css:1844, 0-1-0); `renderGuide()` wraps the label in a
  `.lbl-ico` span (app.js:1628), so the button matches. Verified at 1280px:
  `getComputedStyle(#ghToggle).display === "flex"`. Fix: raise both the base rule and the
  ≤820px rule to `.btn.gh-toggle`. Then re-check every other `display` rule a `.lbl-ico`
  button could be losing.

### Closed out of J3

- [x] **The eligible list is capped at ~55vh and scrolls inside itself** (v1.4.9, D142(e)) —
  two-column layout only; level headers sticky; print unaffected (`#secSpells` is hidden there).

### J6–J10 · ✅ shipped

- [x] **J6 · Guided builder — one spellcasting step** (v1.4.10, D143(a)). Original note: Fold the spell/cantrip choices and the
  swap option into a single step instead of two. Touches `guideSteps()`; D128 (swaps are per
  KIND) and D131(a) (one picker per section) both constrain it — cite, don't re-derive.
- [x] **J7 · Guided builder — copy pass** (v1.4.10, D143(b)): 14 strings de-em-dashed, 0 left
  in the guide view; the growth card's duplicated section label removed. Original note: Strip AI tells (em dashes) and drop pointless
  notes, starting with the one under the "Next level" section. Note: D131(c) already removed
  the guide's explanatory prose, so this is the remainder.
- [x] **J8 · Random build is official, guided took its place** (v1.4.9). Original note: `#testBtn` (index.html:41,
  the 🎲) currently sits in the header and is `remove()`d on the public build (app.js:8975).
  Swap it for a guided-builder button in the header, move random into `#menuPop` beside
  "Guided builder…", and stop stripping it from the public build.
- [x] **J9 · Timeline arrow + "from level" moved to the header right** (v1.4.9). It is
  parked rather than sticky now, with a `min-width` on the host so a shorter label cannot
  drag the arrow sideways: measured 0px movement on flip. Original note: `tlOrderStrip()`
  (app.js:6844) currently emits into the column head via `col.head(...)` (app.js:6826); the
  timeline header is index.html:575 (`<h2>Timeline</h2>` + `#tlOrder`). D141 owns the arrow's
  behaviour (display inverts, computation never does) — this moves where it lives, not what
  it does.
- [x] **J10 · Settings menu grouped by object** (v1.4.11, D144(a)). Original note: `#menuPop` (index.html:44-56) is ten flat
  items with two separators. Needs grouping.

### Fallout from J6, flagged

- [ ] **D125's clamp now covers the trade.** With the swap inside a step that also holds
  picks, a trade at L4 is clamped to L1 while the L1 picks are unfilled — it could not be
  when the trade was its own pick-free step. Only bites on a part-built character. Fix if it
  matters in use: carry the clicked section through `guideGo` and skip the clamp for a swap.
  ⚑ (owner: Francesco, 2026-08-31)

### J11–J12 · ✅ shipped

- [x] **J11 · Custom spell builder fits the page, and seeds from a spell** (v1.4.11,
  D144(b,c)). Original note: Its fields and
  checkboxes don't match the rest of the app. Plus: load an existing spell from the picker as
  a template. D94/D95 own the editor's model; this is presentation + one new entry path.
- [x] **J12 · Light theme solved** (v1.4.12, D145): 0 contrast failures across 698 rendered
  text nodes in BOTH themes; the flatness was the border contrast (1.25:1 → 2.2:1, and the
  control boundary 1.79:1 → 3.0:1). Original note: Francesco: overall not
  working, and "it all feels too flat". Every token in the light block (styles.css:975 ff.)
  measured for contrast; depth restored. Biggest item in the batch and the one most likely
  to want its own decision entry.

## Closed this session

- [x] **A drop re-dated every pick below it** (v1.4.14, **D146**). Reported by Francesco as
  *"removing a spell moves all other spells out of place, resulting in a broken build"* and
  reproduced exactly: one drop at L1 on a clean Sorcerer 5 moved five of eight survivors and
  created two illegal slots. A drop leaves an **empty slot** now; the model, the four pick
  arrays, the guide, the timeline, the fork and the exporter all carry it. Cite D146 and the
  GOTCHAS entry before touching a raw pick array — `.length` on one is almost always the
  wrong question now (`nFilled` counts what is answered, `firstOpen` finds what is owed).

## Closed this session

- [x] **The class ⊕ subclass merge** — 🔶 answered: **variant A**, plus "subclass expands
  together with other features in expand all" (**D150**, v1.5.3). Three variants were mocked
  against the real stylesheet at `scratchpad/mockups/class-subclass.html` (gitignored —
  `python3 scratchpad/mkmerge.py` regenerates); B and C keep their *Rejected:* clauses in
  D150(a) so neither is re-proposed.
- [ ] **⚑ "The feature table should be collapsible and start out collapsed"** was read as the
  PROGRESSION table (D149(a)). If it meant the Features BLOCK, the default is one word to
  flip. ⚑ (owner: Francesco, 2026-09-01)

## Phase K — the Library redesigned (D154, 2026-09-01) — ✅ DONE (v1.5.7 → v1.5.10)

The design is LOCKED — one page, one list, selection bar, no refresh verbs; the approved
mockup is `scratchpad/mockups/library4.html` (`python3 scratchpad/mklib4.py` regenerates)
and **D154 owns every call and every rejected option — cite it, don't re-derive.** Order
matters: K1/K2 are UI over the existing model; K3 changes the model and K4 deletes what K3
obsoletes. **Phase K is DONE: K1 (v1.5.7), K2 (v1.5.8), K3 (v1.5.9), K4 (v1.5.10).**
The build-time calls each had to make are **D155**, **D156**, **D157 + D158** and **D159** —
read them before touching the page.

- [x] **K1 · The one-page shell** — shipped v1.5.7, **D155** owns the five calls D154 had
  not been asked. Kill the Sources|Manage tabs; status strip (books · 5etools version vs
  latest · storage · **Update data**, accent-bordered when a release is
  out) + search/Actions + G1 edition groups + R3 two-line rows (select-checkbox · name over
  kind counts · origin chip web/file/built-in · enable switch; disabled = dimmed, no badge)
  + selection bar (Clear · enabled switch · Remove, armed) + footer Close · ＋ Add files ▾
  (Upload .zip · Upload .json files · Choose a folder… · Paste JSON…). The permanent drop
  zone and drag-drop die (D154(f) — drop-anywhere was offered and rejected). Onboarding =
  the same page's empty state. *Done when:* every current capability except the retired
  verbs is reachable on the new page; a book can be enabled, disabled and removed singly
  and in bulk; alignment measured at 1280 and 375 in both themes.
  **Also delivered early:** the standing "Remove imported data" button (K4's list) — its
  one job that select-all → Remove cannot do is emptying the digest outright, and that path
  is wired instead (D155(d)). **Still transitional** until K2/K4: the staged files +
  keep-plan + Apply block above the strip, and Refresh / Rescan / Forget inside Actions.
- [x] **K2 · The pending-import tray** — shipped v1.5.8, **D156**. Staged files render as a
  tray above the status
  strip, only while staged: chips · new-book ticks · Discard / **Add N books**. Replaces
  `#importPlan` as a standing surface; D86/D112 merge semantics unchanged underneath.
  *Done when:* a brew lands, shows in the tray, Adds into the list, and nothing is stored
  before the commit; Discard is armed. **The model moved with it:** `PLAN.pick` is what the
  tray edits and `PLAN.keep` is derived (`stored ∪ pick`), so unticking a book you already
  have means *don't take this file's version* rather than *delete the book* — see D156(a)
  and the GOTCHAS entry.
- [x] **K3 · Raw-stash + web refetch (the model half)** — shipped v1.5.9, **D157 + D158**.
  Hand-added files stash raw JSON in
  IndexedDB at import; a parser bump triggers an automatic background re-parse (stash for
  `file` books, D153 refetch for `web` books) that reports once, after, via a fading
  notice. Migration: a pre-K3 digest has no stash — its `file` books keep working and get
  stashed on their next manual re-add; the notice names them once. D138's per-book stamps
  survive and drive the auto pass. *Done when (amended by D157):* ~~bumping VERSION~~
  **changing the extractor** and reloading re-parses everything without a prompt and the
  stamp matches; a stashless legacy book is named, not silently stale. **D157 is why:** the
  stamp is now a build-time hash of `src/extract.js`, so an ordinary release no longer marks
  every book stale — which under an *automatic* re-parse would have meant a multi-MB refetch
  after every deploy. A pre-K1 digest (no origin stamps) is healed by the web fetch where a
  D153 record exists, and gains the origins it always had (D158(d)).
- [x] **K4 · Retire the old machinery** — shipped v1.5.10, **D159**. Removed: Refresh
  imported data (both surfaces) and its whole pipeline, Rescan/Forget folder and the
  remembered handle with them (the folder picker stays as an input method under ＋ Add
  files), and — earlier in the phase — the standing Remove-imported-data button (K1,
  D155(d)), Clear staged (K2, the tray's armed Discard) and the stale-parser boot nag (K3,
  `autoReparse()` replaced it). The miss-memory (`spellForge.refreshMiss.v1`) went with the
  refresh. GOTCHAS entries touching `refreshImported`/folder recall were updated, not
  deleted — the permission trap is exactly why the machinery went, and it comes back the
  moment anyone stores a handle again. *Done:* the six old verbs are gone, no dead handler
  remains (a sweep of every markup id and every top-level function), and **D42 was re-proved
  through the real UI** — remove a book and its picks are still in `state`, survive a reload,
  and are named by the gap bar.

## Phase L — ability scores (D161, 2026-09-01) — L1–L4 SHIPPED (v1.5.12) · L6 is next (his notes), L5 needs the Mac

The design is settled in two rounds; **D161 owns every call and every rejected option.** The
model is a **stack of contributions** — each knows its giver and its level — so per-level truth
is a slice, and a source nobody has modelled yet is a new contributor rather than a new model.
Order matters: L1 is the model and can ship alone; L2 is the surface; L3–L4 are what the scores
drive; L5 is the one piece that needs the mirror. **L1–L4 shipped as v1.5.12. L6 — Francesco's
five notes on that build — is the next thing to do, and it is what the merge is waiting on.**

- [x] **L1 · The model** — shipped v1.5.12. `state.abilities` = `{method, base:{…}, origin:{…}}` plus the
  contributions derived from what is already in the build (feats' structured `ability` blocks,
  the ASI choices). `abilityStack(ab)` → the ordered contributions; `abilityAt(ab, level)` →
  the score at a level; `abMod` already exists. Lives in the build blob (it is character data,
  D33), detached on save like every other stored object (the `save()` gotcha). *Done when:* a
  score round-trips through save/load/export/import and a fork, and a level slice reads the
  pre-ASI number.
- [x] **L2 · The section (placement C)** — shipped v1.5.12. A compact six-ability strip in the Character card
  that opens the editor modal: entry method (standard array · point buy · type them in ·
  4d6-drop-lowest), the six rows with their stacks, and the origin +2/+1 row that stands in
  for a background (D161(e)). *Done when:* every entry method fills the same stack, the strip
  reads the same numbers as the modal, and alignment is measured at 1280 and 375 in both
  themes.
- [x] **L3 · The ASI as a choice on the feat (D161(c,g))** — shipped v1.5.12. Taking "Ability Score Improvement"
  fills a general feat slot; a choice row asks +2-to-one or +1-to-two with the tiles
  `choiceRow` already draws. A half-feat carrying structured `ability` with `choose:true` gets
  the same row with no table. *Done when:* the timeline reads "L8 · ASI +2 INT", a second take
  (`##2`) keeps its own answer, and dropping the feat drops its contribution.
- [x] **L4 · Save DC, spell attack, and the multiclass minimums** — shipped v1.5.12. 8 + PB + mod and PB + mod
  per casting class, into the Slots & casts card, the spell modal, the table's Ability column
  and — the point of the exercise — the two columns the print sheet has been ruling BLANK on
  purpose. Plus 2024's 13-in-each-primary-ability check, advisory, in the consistency sweep.
  *Done when:* the printed sheet carries real numbers, and a Wizard 5 / Paladin 3 with STR 10
  is flagged and not blocked.
- [ ] **L6 · Francesco's five notes on the shipped editor — MOCKED, AWAITING HIS PICK.**
  He reviewed v1.5.12 in a private artifact copy
  (<https://claude.ai/code/artifact/03d84f4d-c239-41ba-bf15-30df1cb7cc49>) and **withheld the
  merge** pending these. Verbatim:
  > - the rolled results should appear in the dropdown
  > - dropdowns should allow me to input also already inputed numbers (but marked). On input
  >   of the same value in std array for example the system should alert you to fix it
  > - dropdowns should start with empty state rather than random number
  > - the current design show redundantly twice the ability score. Try a version with two rows
  >   of tiles one per ability instead of the current vertical distribution
  > - there should be a more elegant solution to apply background bonuses

  **Round-3 mockups are built and sent** — `scratchpad/mkabil2.py` → `mockups/abil2.html`
  (gitignored, real stylesheet, at the modal's real 440px). **The questions below were put to
  him and are UNANSWERED; ask before building.**
  - **Note 4 · the panel:** **A1** two rows of three tiles, the base edited inside the tile and
    the big number the TOTAL · **A2** one compact row of six, stack in the tooltip · **A3** a
    pool of values you assign by tapping (pick a value, tap an ability), no dropdowns at all.
  - **Note 5 · the origin bonus:** **B1** three points on ONE tile row — the same control as an
    ASI, one point wider, so +2/+1 and +1/+1/+1 both fall out of it with no mode to choose ·
    **B2** a row per amount (+2 row, +1 row) · **B3** the bonus placed onto the score tiles as
    a badge, no origin block at all.
  - **Also open, raised by note 2:** point buy currently **hard-blocks** the + button at 27.
    If a duplicate array value is "named, never blocked" (D31), consistency says the budget
    should warn and let you pass it. Ask.
  - **Notes 1–3 are instructions, not questions** — build them as mocked: every rolled value is
    its own entry (**today's bug: `abPool()` runs the pool through `new Set`, so a rolled pair
    of 13s offers ONE**); every pool value stays selectable and names who holds it; a value
    taken twice is flagged in gold, never prevented; and nothing is pre-filled — **point buy
    currently opens with six 8s**, which reads as an answer nobody gave.
  *Done when:* the five notes are answered in the app, the editor is measured at 1280 and 375
  in both themes, and Francesco has seen it again.
- [ ] **L5 · Prerequisite pass/fail — NEEDS THE MIRROR.** `p.ability` is parsed and then
  flattened to "CHA 13+" in `checks[]`, where D31 can only ever say "maybe". Keeping it
  structured is an edit to **`extract.py` and `src/extract.js` both**, proved by
  `node scratchpad/cparity.js` — which needs the 5etools mirror, so this one waits for a
  session on Francesco's Mac. *Done when:* parity is 0 fail and a feat with an ability
  prerequisite reads ✓/✗ in every picker.

### Where ability scores land — the audit (2026-09-01)

What already exists, and cost nothing: `abMod()` (app.js:7752, creature blocks only); the
`--ab-*` tokens with `.abchip`/`.savechip`/`.abtile`, contrast-checked in both themes (D142(b),
D148(e)); **feats carrying structured ASI grants** (`ability:[{abils,amount,choose}]`, D148);
classes carrying `traits.primary`, `traits.saves` and the spellcasting `ability`; and
`choiceRow`'s `type==="ability"` branch, which already renders the tile row an ASI needs.

| Surface | Today | With scores |
|---|---|---|
| Print sheet (app.js:9824) | "Spell attack" and "Save DC" print as ruled BLANK fields | real numbers |
| Slots & casts card | four tiles, no abilities | DC / attack per class |
| Spell table "Ability" column, spell modal | a custom source's hand-typed numbers only | the character's own |
| `prereqParts` | an ability minimum lands in `checks[]` → always "maybe" | pass/fail (L5) |
| Multiclass legality | not checked at all | 2024's 13-minimum, advisory |
| Guided builder ASI step | "taking the ASI means leaving this empty" | a real choice; re-homes the orphaned ⚑ note |
| Custom sources (D55/D95) | DC / attack / ability typed by hand | could default from the character |
| 2014 preparers | 0 prepared (`countType:"formula"`, no table) | computable — **not taken** (D161(f)) |

Two constraints the audit fixed: **the app cannot derive a score** (no backgrounds in the
digest — `DIGEST_ARRAYS` is spells, classes, subclasses, feats, races, optfeats), so something
is always entered; and **making prereqs checkable is extractor work in both files**, hence L5.

### Beyond spells — what a full builder would need (analysis, 2026-09-01)

Asked for alongside D161: *"a first analysis of what it would take to make it a full builder."*
Nothing here is decided or queued — it is the map.

- **Already in the digest, unused.** `traits` carries hit dice, saving throws, skills, armor,
  weapons, tools and starting equipment per class, each with its `{fixed, choices}` shape; feats
  carry their ability grants and prerequisites; species carry their prose and grants. A
  surprising amount of a builder is sitting in the data already.
- **A stale note, corrected while auditing:** app.js:8993 says *"data only carries
  spell-granting feats (extract.py filters the rest)"*. **Neither extractor filters** — the SRD
  digest holds 17 feats, exactly 1 of which grants spells. The feat list is already complete.
- **Free, or nearly:** the **proficiency bonus** is a function of character level; **hit
  points** need only CON (after L1) plus `traits.hd` and a per-level average/roll choice;
  **saving throws** are `traits.saves` + the scores this phase adds; **skills** are a fixed
  list of 18 plus the `{fixed, choices}` the class already carries, and the app's own choice
  machinery (D96) is the right widget for "choose 2 from these".
- **Needs new data:** **backgrounds** (a seventh entity — D161(e) defers it); **equipment and
  armour class**, which is `items.json` and therefore the magicvariant cross-product already
  researched in the Queue's 🔶 — the same ~150 lines into both extractors, plus a mundane-item
  slice the spell planner never needed; **weapons and attacks**, same source.
- **The real question is not technical.** Every non-goal in CLAUDE.md exists to keep this a
  spell planner: no sharing (D36), no bestiary (D78), no server. A builder is a different
  product with a different surface — the Character card would stop being a card. Worth deciding
  as a direction, once, rather than arriving at it one entity at a time.

## Open ⚑ — calls for Francesco

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

- [x] **`refreshAddFeat()` had the identical defect for `#epicRow`** — REPRODUCED and FIXED
  in **v1.4.7**; the toggle joins the render pass beside `renderOptFeats()`. Both directions
  were wrong (18 → 19 hid a slot that existed; 19 → 18 offered one that did not), and the
  class-remove and `#addClass` paths carried it too. Original note: it toggles `#epicRow` on
  `featBudget().epic`, which per D114 is a function of `featSlotLevels()` →
  `classLevelPlan()` → class levels, yet it runs only inside `refreshAll()`. So stepping a
  class across the level where an Epic Boon slot arrives should leave the row showing the
  previous answer. Verify from a fresh load, then fix. The other three `refreshAll()`
  members are clean (`refreshSpecies`, `renderCustomSources`, `renderFeatChips` read
  `state.*`, not class levels). *(Sibling defects fixed v1.2.29 and v1.4.2.)*
- [x] **2024 pooling floored the half-casters; it rounds up now** — fixed in **v1.5.11**,
  **D160**. Francesco's call on the one ambiguity: **all half-casters share one bucket,
  Artificer included, and all third-casters share another** — the bucket is keyed by DIVISOR
  so a category added later inherits the rule. `poolLevel()` is the single writer for both
  `compute()` and `planSlots()`. Original note: `compute()`/`planSlots()` lump `artificer` and
  `"1/2"` into one bucket and take `⌊half/2⌋`, but TCE Artificer and XPHB Paladin/Ranger
  round up when multiclassing — Artificer 5 / Wizard 5 should pool to caster
  level 8, the app says 7. Touches the pooled slot table only.
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
