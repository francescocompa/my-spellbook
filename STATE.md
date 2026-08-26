# STATE — My Spellbook

> Resume doc. One current-state block, edited in place.
> History → git log. Consumed phases and decision rationale → `ARCHIVE.md`.

## TL;DR (2026-08-27 · code at 3003784, pushed · v7: T1–T5 done, T7 left · **LIVE on GitHub Pages**)
- **State:** working, committed, **pushed**. **v7 is T1–T5 done — only T7 remains.** Seven note
  batches have landed on top of the tasks (**D43–D81**); their per-batch detail is in `Shipped`
  and `ARCHIVE.md#v7-batches`, not here. The last three, in brief: **batch 5** fixed the `x/0`
  tile clamp and rebuilt the level cards, spell-row selection and prepare modal; **batch 6** added
  the Magical Secrets level weighting, took the accent off the table's grouping headers, and
  introduced **creature sets + the stat block carousel**; **batch 7** closed two gaps in 5etools'
  own model — **prose-only grants** (Mystic Arcanum had `additionalSpells: null`, so the Warlock
  never got its arcana) and **grant modification notes** ("you can cast it without expending a
  spell slot"). Verified in-browser at 375px and desktop each time; extractor parity checked in
  Node (`scratchpad/cparity.js`, `scratchpad/gparity.js` — both clean apart from a documented
  pre-existing `RHW` walker-scope diff).
- **Next action:** **custom sources — a dedicated back-and-forth design session.** Francesco's
  call from note batch 4, deferred three times by later batches. The D55/D65 *model* is right;
  its UI is not. **Done when:** the surface is interviewed end to end and the redesign is a
  decision entry with a task line behind it. Then **v7 · T7 (storage-pressure reporting)** — no
  count cap (D37); catch the quota failure on write and name the real cause. **Done when:** a
  failed save says what is using the space, not "something went wrong". *(Last task in v7.)*
- **Manual for Francesco:** ⓪ **Re-import your 5etools data** — this is the one that bites.
  Creature sets (D78) and the new prose grants / modification notes (D79) are produced by the
  extractors, so an import made before them carries none of it. `assembleData` keeps the BAKED
  monster map underneath an old import, but **per-spell `creatures` and grant notes cannot be
  back-filled**. ① **Check the live site** — the push is out; Pages rebuilds `main:/docs`.
  ② **Turn XMM on in Sources** if you want Find Familiar's 24 Monster Manual 2024 forms in the
  default view — they were never missing, XMM is off (the carousel's book panel now says so).
  ③ Optional — ask GitHub Support to gc so the *old* unreachable commits (SHA 2c8bbb6 etc., held
  only in `backup/pre-purge-20260826` locally) stop being SHA-addressable. ④ To update the live
  site: `python3 extract.py` (if data changed) → `python3 build.py` → commit → push.
  ⑤ `dist/`, `data/`, `data-srd.json` are gitignored (local only); public SRD data is inlined in
  committed `docs/`. ⑥ **Open question:** the spell-**pick** modal's rows still show the printed
  book, which D39 removed from the eligible list. Say if it should follow.
- **⚠ STATE is 830+ lines.** Seven batches of decisions have accumulated; `/resume` pays for all
  of it on every cold read. **Recommend running `/clean`** before the next substantive session —
  D43–D69 are settled and their rationale belongs in `ARCHIVE.md`.

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Build / run
- Dev: `python3 serve.py 8000` → `http://localhost:8000/src/index.html` (launch.json
  `spellbook`). Use `serve.py`, **not** `python3 -m http.server`: the latter evaluates
  `os.getcwd()` at argparse time, which the preview sandbox blocks (startup crash);
  `serve.py` binds an absolute root as a library and sidesteps it. Under the restricted
  preview sandbox `preview_start` still can't spawn it (can't read the project dir) — start
  it via Bash, then open the browser at the URL. serve.py sends `Cache-Control: no-store`,
  so a plain reload always picks up edits (the old hard-reload gotcha is gone).
- Data refresh: `python3 extract.py` (mirror default = `~/Documents/D&D/5etool_mirror/…/data`,
  writes data.json + `data-srd.json`), then `python3 build.py` (writes data.js, dist/ with full
  data, docs/ with SRD inlined).
- `src/extract.js` = in-browser port of extract.py (the importer). Keep them in sync.
- Verify gate: `python3 -c "import ast;ast.parse(open('extract.py').read())"`,
  `node -e "new Function(fs…app.js)"`, `node -e "new Function(fs…extract.js)"`, json load.
- Deploy: commit + push `main`; Pages builds `main:/docs` (has `.nojekyll`).

## Now — v7: saved builds

One character at a time was the last hard limit in the app. T1–T3 removed it, T4 made builds
reachable from the header and T5 got them off this machine as files. What's left is telling
the truth about storage limits (T7).

### Shape *(settled by D33–D37)*
```
spellForge.builds.v1  = { activeId, order:[id…], builds:{ id: {meta, state} } }
meta = { name, character, named, created, updated, summary, sources:[…] }
       // name      = the version's name ("Evocation", "L3")
       // character = the GROUPING LABEL (D35) — versions of one character share it;
       //             level-free, auto-follows the build until `named` is set by a rename
       // summary   = "Wizard 8 · Evocation", derived
       // sources   = the books this build was last seen under (D33)
spellForge.sources.v1 = [ … ]     // the GLOBAL book list, hoisted OUT of `state` (D33)
```
`state` keeps its old shape inside each build **minus `enabledSources`**, so `save()`/`load()`
became "save/load the active build" and nothing else downstream changed. Homebrew, imported data
and the column layout stay global — they're content and preferences, not character sheets.
Sources join them, but every build remembers what it expected.
→ what T1 replaced: `ARCHIVE.md#pre-v7-storage`

### Tasks
- [x] **T1 · storage + migration** (`model`, ~M) — **DONE 2026-08-26.** New keys, `activeBuild()`,
  `enabledSources` hoisted to `spellForge.sources.v1`, and a one-time migration lifting the
  legacy `spellForge.v2` blob into build #1. `save()` is now auto-save of the active build (D34).
  The legacy key is left untouched as a one-release rollback. *Verified:* migrated session →
  "Wizard 8 / v1" with classes + picks intact and `meta.sources` = its 43 books; reload idempotent
  (`BOOT_MODE` "loaded", one build); wiped session → exactly one empty build, sources all-on.
- [x] **T2 · activation reconciliation** (`correctness`, ~S) — **DONE 2026-08-26.** `#srcAskModal`
  asks, on activation, **only about books the build's picks actually depend on**
  (`buildGaps().books`) — a book it merely had enabled changes what you can browse, not what it
  holds, and listing all 42 of those was noise. Each book is named with its affected-pick count.
  Declining activates the build whole and raises the gap banner (`#gapBar`). See **D42**.
  *Verified:* a Wizard build carrying a TCE feat, activated under "2024 core only" → dialog names
  TCE / 1 pick → **Keep my books** keeps the feat and its two pending choices plus the banner;
  **Turn them on** enables TCE and clears it; disabling a book by hand keeps an `Aarakocra|DMG`
  species (field reads "Aarakocra · DMG is off") and an `Artificer|TCE` row that still resolves.
- [x] **T3 · manager UI** (`ui`, ~M) — **DONE 2026-08-26.** `#buildModal` from the ⋯ menu: one flat
  list grouped by `character`, each row name + summary + last edited; switch, rename, duplicate,
  delete (confirm), new. Names are **inline inputs** that look like text until touched — no edit
  mode; renaming a character rewrites every version under it and sets `meta.named`. Duplicate
  *is* "save as new version" (D34), one action. Active build = accent left-bar + tint + `current`
  chip. *Verified:* switch loads the other build's state; rename at both levels; delete moves the
  active to a neighbour; **deleting every build never leaves zero**; survives reload.
- [x] **T4 · switcher** (`ui`, ~S) — **DONE 2026-08-26.** `#bswBtn` sits in the header next to
  the title: `▤ <character> <version>`, with the version chip appearing only when that character
  has more than one. Its popover lists every build grouped by character (current marked), plus
  **New build** and **Manage builds…**. Switching goes through `switchBuild()`, so the T2
  activation dialog and the gap banner still apply. On a phone it takes its own full-width line
  under the top row, which stays intact (D47/D52). *Verified:* switch both ways reloads the other
  build's classes/species; duplicate → the `v2` chip appears; rename in the manager updates the
  header; no console errors.
- [x] **T5 · export / import a build** (`data`, ~M) — **DONE 2026-08-26.** Every row in the
  manager has **export** (downloads `<character>-<version>.spellbook.json`, a
  `{kind,version,exported,meta,state}` envelope carrying `meta.sources` per D33). **Import…**
  opens a panel in the manager taking a dropped file, a browse, or pasted JSON. Import always
  **adds** — never overwrites — deduping the version name (`L9` → `L9 (2)`), and
  `applyImportedState()` renumbers class row ids while remapping `chosen` keys and the `c<N>:`/
  `s<N>:` choice-id prefixes, so picks and pending choices survive the renumber. Nothing from
  the file is trusted: levels clamp, arrays coerce, `meta.sources` is a **record**, never an
  instruction — a missing book is reported, never auto-enabled. *Verified:* round trip preserves
  summary, picks and choices; malformed / foreign / newer-version files are each rejected with
  their own message; a build naming an unloaded book says so on arrival.
- [ ] **T7 · storage-pressure reporting** (`data`, ~S). No count cap (D37); instead catch the
  quota failure on write and name the real cause. **Done when:** a failed save says what is
  using the space, not "something went wrong".
- [x] ~~**T6 · budget/choice reset semantics**~~ **Closed by D37** — picks survive a relevel
  untouched and the existing soft over-flag does the rest. No new machinery.

Nothing gates the remaining tasks.

### Non-goals
~~Level-up history/snapshots~~ — **superseded by D34/D35**: versions exist, but as *named copies*
the app never orders or interprets. A true level-by-level timeline (ordering rules, fork-on-edit)
stays out. Server sync or accounts. Sharing a build as a rendered page, or via a URL (D36).

## Decisions

### Binding — these constrain current and future work
- **D12 (2026-08-26) Deploy = app-not-data; repo public + history purged** — the Pages build ships
  the app, not the full dataset. *Rejected:* a separate public repo; private+Pro; keeping the data
  in the bundle. → rationale `ARCHIVE.md#rationale`
- **D13 (2026-08-26) Embed SRD 5.2** — the public build ships the `srd52`-flagged subset
  (CC-BY-4.0, **credit footer required**) so it's usable without importing; import adds the rest.
  Supersedes D12's "no data in public build" — SRD is licensed, safe to distribute.
- **D17 (2026-08-26) Public build flag** — build.py injects `window.__PUBLIC__=1` into `docs/`;
  the app hides the 🎲 random-build helper when set.
- **D27 (2026-08-26) Source selection is one global list, overridable per picker** — the ⚙ Sources
  modal is the single place books are chosen. Every picker reuses **that same granular component**,
  seeded from the global list, with a local override that does not write back. Overrides are **not**
  sticky — a picker opens on the global selection. *Rejected:* named switchable presets (more UI
  than the problem needs); per-picker defaults in settings (three lists to keep in sync); keeping
  the one-line "any book" select.
- **D31 (2026-08-26) Prerequisites are advisory, never prohibitive** — both extractors emit
  `prereqs`: one record per OR-alternative, splitting the checkable parts (level, feats, optional
  features, species, spellcasting, pact) from the unverifiable ones (`checks`: ability scores,
  proficiencies, backgrounds, campaigns). An alternative carrying an unverifiable part resolves to
  "maybe" and **can never read as a hard no**. Pickers sort eligible first and dim the rest; a
  picked entity whose prerequisites lapse gets ⚠ and is **kept**. *Rejected:* hiding ineligible
  entries by default (would hide legal picks the app can't verify); blocking selection outright.
  → the runtime rule lives in Gotchas.
- **D33 (2026-08-26) Sources stay global; each build *records* the list it was made with** —
  `enabledSources` lives in `spellForge.sources.v1`, so D27 survives intact. Each build stores
  `meta.sources`; activating one whose list differs prompts rather than pruning. This **dissolves
  the original T2 hazard by construction** (there is no bulk prune to get wrong) and gives T5's
  export its embedded source list for free. *Rejected:* sources travelling inside the build
  (contradicts D27; relocates the hazard); purely global with builds unaware of their books (a
  build reopened with a book off loses picks with no way to know what it expected).
- **D34 (2026-08-26) Auto-save, plus versions — reverses the "no snapshots" non-goal** — every edit
  writes through to the active build: no dirty state, no unsaved-changes guard, no way to lose work
  by closing a tab. On top of that a build can be saved as a **new version**, so one character holds
  several sets of build choices side by side. Raw note: *"Auto-save + snapshot, builds should have
  versions (different build choices for the same character aggregated)"*. "Snapshot" and "new
  version" are **one action**. *Rejected:* explicit save with a dirty indicator (three states to
  keep honest, a guard on every exit path, and a crash would start losing work the app can't lose).
- **D35 (2026-08-26) A version is a named copy; `character` is a label, not a container** — builds
  stay ONE flat list keyed by id; the manager **groups by the label on render**, so aggregation is
  a render concern, not a data hierarchy. The app never interprets whether a version is an
  alternative or an older level. Duplicating keeps the character name, so **duplicating is how you
  create a version**. *Rejected:* versions as explicit same-level variants (asserts a sameness that
  breaks the moment you level up and keep the old one); versions as an ordered level timeline (the
  non-goal proper); `characters:{…}` as a real object (two things to name and delete, a
  zero-version state to define, roughly doubles T1 and T3).
- **D36 (2026-08-26) Export is a file; URL sharing is out of v7** — JSON download + file/paste
  import, with `meta.sources` embedded. Covers the actual risk (a build is one browser away from
  gone) with no size ceiling. *Rejected:* a URL-hash-encoded build (a heavily-picked multiclass
  build exceeds what browsers and chat apps carry, so it needs compression **plus** a graceful
  fallback — roughly doubles T5); parking it as a deferred task (it stays a non-goal, not a queue item).
- **D37 (2026-08-26) Relevel keeps every pick and flags it; no cap on builds** — duplicating a build
  then changing its level leaves `chosen`/`choices` untouched (keyed by row id and choice path);
  anything now over budget or above max spell level gets the **existing** soft over-flag. Consistent
  with D18 and D31 — zero new machinery, and it **closes T6**. There is **no count cap**: the real
  constraint is the ~5 MB localStorage quota that imported data dominates, so quota failures are
  caught on write and reported for what they are (T7). *Rejected:* auto-dropping picks that no
  longer fit (silent destructive pruning); a "duplicate without picks" prompt; a soft warning past
  ~20 and a hard cap (arbitrary — eight characters × three versions is 24 and entirely reasonable).
- **D42 (2026-08-26) Turning a book off flags picks, it never removes them** — `afterSourceChange()`
  used to strip every class, subclass, feat, optional feature and species whose book you had just
  disabled. Unticking a book to browse is not a decision to delete half a character. It now prunes
  **nothing**; only `pruneState()` drops refs, and only to content that has ceased to exist. What
  remains is surfaced: the gap banner, `.gapped` fields, and the T2 dialog. Same rule covers a
  manual source change and a build switch — one behaviour, not two. Two silent-rewrite bugs fell
  out of this and are fixed (see Gotchas). *Rejected:* pruning only the active build (the inactive
  ones then rot silently); asking on every source change (it is a browse action, not a commitment).

- **D43 (2026-08-26) Every giver in "Choices to make" is a group** — a giver with one choice
  used to be a bare row and one with several a bordered box, so the same thing had two
  treatments. Now every giver is a `.choicegroup`; the granting *feature* is named once above
  the run of rows it owns (it used to repeat twice then vanish); and each row is one line —
  what it asks for on the left, its control on the right. *Rejected:* a flat list with a quiet
  giver label (Francesco's call — the box carries the grouping more clearly); an accordion per
  giver (a pending choice can hide behind a fold).
- **D44 (2026-08-26) A slot's count is a tile in line with its field, not a chip on the label**
  — origin / general / epic each carry their own `n/cap` tile at the field's own height, in
  three states: `need` (accent), `done` (green), `over` (red). The single `origin 0/1 · general
  1/4 · epic 0/1` chip on the FEATS label is gone. Optional-feature slots use the same tile, so
  the Character card has one language for "how many of these do I still owe".
- **D45 (2026-08-26) A taken feat is neutral; red means exactly one thing** — the base `.chip`
  was accent (a red-brown), so every general feat read as a warning. Chips are now neutral,
  `origin` stays gold and `epic` indigo as category tints, and `.chip.unmet` — a prerequisite
  that isn't met — is the only red chip in the card.
- **D46 (2026-08-26) The species picker groups lineages under their species** — both extractors
  emit `base` + `lineage` on every species record, and the picker renders one `.entgroup` per
  base with its lineages as sub-rows (the same shape D43 gave the choices card). A species with
  no lineages stays a flat row.
- **D47 (2026-08-26) The top row and the table header stay ONE row on a phone** — the header
  wrapped and the title truncated. The tab switch drops to short labels (`Build` / `Table`)
  before the title is allowed to shrink, and the title never ellipsizes. In the spell table the
  same rule holds by turning **Prepare daily** into its ☾ icon below 620px; the total-spells
  chip is kept (it is information, the label is not). *Rejected:* collapsing the switch to
  icons (ambiguous — the app's glyph vocabulary is already spent on the ⋯ menu).
- **D48 (2026-08-26) Mobile navigation = a docked jump bar, not a second level of tabs** — five
  stacked cards made reaching your classes from the spell list a very long scroll. A fixed
  bottom bar gives one tap per section and tracks the one you're in. The page stays **one
  continuous scroll** on purpose: the prepared budget and the spell list are read together.
  *Rejected:* Build splitting into mobile sub-tabs (loses the budget while picking spells, and
  stacks two tab rows); collapsible cards with sticky headers (reaching a section still means
  scrolling past the folded ones). A smooth scroll is attempted and **falls back to an instant
  jump** — some embedded webviews accept `behavior:"smooth"` and never move.
- **D49 (2026-08-26) A cantrip's modal says it once** — the subtitle reads "`<School>` cantrip"
  (was "Cantrip `<School>`") and the Level and School rows leave the grid, where they only
  repeated the line above them. Levelled spells keep both rows.
- **D50 (2026-08-26) Summon stat blocks live in the spell modal, collapsed** — 24 spells print a
  creature beside them. They are matched by the bestiary's own **`summonedBySpell`** field, not
  by parsing `{@creature}` refs out of spell text, so there are no cross-source false positives.
  The section is collapsed by default (it is reference material, not part of reading the spell).
  The importer keeps only these monsters from a bestiary file — a full one is megabytes.
  **SRD gate:** a non-SRD stat block is stripped from an SRD spell in the public build.
- **D51 (2026-08-26) A book chip carries a popover, not a native `title`** — full book name,
  the page the inspected element is printed on, and the code. Both extractors now emit `page`
  on spells, classes, subclasses, feats, species and optional features. Works on touch (the
  shared `attachTip` treats a tap as hover).

- **D52 (2026-08-26) The build switcher lives in the header, beside the title** — `▤ <character>
  <version>`, with a popover grouped by character plus New build / Manage builds…. It is a quiet
  label you can act on, not a control competing with the Build/Table switch, and it goes through
  `switchBuild()` so T2's activation dialog still fires. *Rejected:* putting it in the ⋯ menu (T4
  asks for it to be **visible**, and a menu isn't); a full-width build bar on every screen (chrome
  on every view for what is usually a single-build session); replacing the app title on mobile
  (D47 had just been spent making the title fit) — on a phone it takes its own line instead.

- **D53 (2026-08-26) New build starts in a modal; destructive buttons arm, never confirm()** —
  creating a character asks for character name + version name (both optional — an empty name
  keeps D35's auto-follow). And **native `confirm()` is banned**: it silently returns `false` in
  embedded webviews (no dialog at all), which is why "delete" in the manager looked dead. Every
  destructive button now ARMS on first click ("confirm?", red, 4 s window) and commits on the
  second — `armConfirm()`. *Rejected:* keeping confirm() with a fallback (the failure is
  undetectable); a shared confirm modal (heavier than the two-click pattern needs).
- **D54 (2026-08-26) Level preview: plan at full level, look at any level below it** — the level
  chip on the Character card becomes a scrubber (`preview − L5 + ×`). View-only: `PREVIEW` is
  never saved, releasing it changes nothing; picks above the previewed level get the existing
  soft over-flags (D37), grants not yet unlocked vanish, slots/budgets/eligibility all follow.
  Multiclass works through the **level plan** (`state.levelOrder`, saved): which class each
  character level is taken in, edited in a per-level modal whose edits normalize against the
  build's real class totals — an overfill snaps back, so no invalid state exists. *Rejected:*
  versions-as-levels with a "duplicate at level N" helper (real copies drift when the plan
  changes); a true level timeline (the standing non-goal).
- **D55 (2026-08-26) Custom spell sources — a thing the character owns that grants spells** —
  "Spell sources" fieldset on the Character card; a modal defines name, kind (item/boon/
  blessing/other), mode (**cast without preparing** with per-spell cadence — at will, n/long
  rest, n/short rest, n/dawn, charges — or **always prepared**, no cadence), and a searched
  spell list. Stored INSIDE the build (`state.customSources` — a Staff of Fire belongs to a
  character and travels with T5's export) and resolved through `resolveGrants` like a species
  or feat, so free casts, the cart and the table need no new paths. Deleting arms (D53).
  *Rejected for v1:* ingesting magic items from 5etools data (items carry `attachedSpells` but
  no structured uses — hand-set cadence is needed regardless; revisit later); global storage.
- **D56 (2026-08-26) Prune only inside a loaded book — D42 extended to imports** — `pruneState()`
  used to treat "entity not in the current content" as "ceased to exist", so importing a lone
  homebrew file (which REPLACES imported data) silently stripped whole builds. Now a ref is
  pruned only when its BOOK is loaded and the entity is gone from it; a ref whose whole book is
  absent is kept and surfaces through the gap machinery, and the gap bar distinguishes "turned
  off" (one-click fix) from "not loaded — re-import it". Found when an import test ate the test
  build's classes.
- **D57 (2026-08-26) Icons are real SVGs, never font glyphs** — monster-forge convention: 16×16
  `currentColor` stroke paths in an `ICONS` map, sized by context via CSS (`.ico svg`), static
  markup declares `data-ico` and boot fills it. The full sweep replaced 🎲 ⋯ ▤ ✎ ⭳ ⚙ ◐ ⟲ ☾ ＋ ×
  ✓ ✗ ● ✦ ⚠ everywhere (`<option>` text keeps "+"/"✦" — options can't hold markup). Top-row
  controls got one 34 px height and the header centres. **From now on every new icon goes
  through `ICONS`/`icoEl`/`xBtn` — no glyphs.**
- **D58 (2026-08-26) Homebrew & UA import through the same importer** — verified on 5e.tools:
  homebrew (including D&D Beyond drops) lives in **github.com/TheGiddyLimit/homebrew**, UA in
  **github.com/TheGiddyLimit/unearthed-arcana** (the site's Manage Homebrew / Manage Prerelease
  pages front them); both are per-brew JSON with `_meta.sources` + the usual entity arrays. The
  importer now registers `_meta.sources` books under a "Homebrew & UA" group and reads a spell's
  INLINE `classes.fromClassList`/`fromSubclass` access (brew style — core data uses the
  generated lookup). Import modal documents the path. Caveat kept: building an import REPLACES
  the previous one, so core data and brews must be staged together.

- **D59 (2026-08-26) The level-order panel is a single column of draggable level cards** — one
  card per character level in acquisition order, dragged by a handle, each naming its class and
  what that level gives. Single column at every width: the list is a **sequence**, and columns
  break the reading of it. *Rejected:* a per-level `<select>` grid (compact, but you cannot see
  the shape of the progression); a multi-column card grid (Francesco's call).
- **D60 (2026-08-26) A level gate is a lock icon + the level, never prose** — "— unlocks at 3 —"
  was truncated inside the subclass `<select>` at desktop width. The `<select>` says
  "— locked —" and the LABEL carries a `.lockchip` (lock + `L3`) with the explanation in its
  popover. **Reuse `lockChip()` for anything gated on a level.** A label carrying a chip
  ellipsizes its own text rather than wrapping, so rows never lose alignment.
- **D61 (2026-08-26) The Build/Table switch is a fixed size** — selecting a tab bolds it, which
  changed its width and made the whole switch resize. Each label now reserves the width of its
  own bold rendering (`::after` with `attr(data-t)`), so selection changes weight and nothing else.
- **D62 (2026-08-26) A wizard's spellbook and its prepared list are different sets** — "Prepare
  daily" was editing the spellbook, because both lived in `chosen[idx].spells`. The book stays
  there; the daily subset is `chosen[idx].prep`, capped by `known.prepares` (the class's own
  `preparedSpellsProgression`, already in the data). The prepare step for a book caster lists
  **the book**, not the class list. The cart gains a Prepared meter and the table distinguishes
  ● prepared today from 📖 in the book but not prepared. Dropping a spell from the book
  unprepares it. Closes the D8 caveat.
- **D63 (2026-08-26) Level cards name real features, not derived counts** — both extractors emit
  `features:[{level,name}]` for classes and subclasses (the feature index already existed for
  grant correlation). "Arcane Recovery · Ritual Adept" says more than "+1 prepared". ASI/Epic
  Boon and the `<Class> Subclass` placeholders are filtered; spellcasting milestones (a new
  spell level, a new slot) are kept as a separate accent line. Sorting is case-insensitive in
  **both** extractors so parity stays byte-exact.
- **D64 (2026-08-26) Per-level loadouts are VERSIONS, not per-pick level stamps** — the preview
  gains **save as version**, which forks the build at the previewed level split (D37 keeps the
  picks and soft-flags what no longer fits), so you can then pick freely at that level. Stamping
  each pick with `atLevel` was chosen first and then **rejected on Francesco's own objections,
  which are correct**: planning at level 20 first leaves every pick unstamped, and a stamp cannot
  express **retraining** — a spell gained, dropped and regained needs intervals per pick, which
  would touch every budget check, the whole UI and the export format. Versions already do this
  correctly and already export. The preview stays a viewer.
- **D65 (2026-08-26) Custom sources model how items actually work** — kind is **free text**. A
  source spends **either a shared pool** ("10 charges, regains 1d6+4 at dawn", each spell costing
  N — how most magic items work) **or per-spell uses** (a boon's 1/long rest). It may carry **its
  own save DC / attack bonus / casting ability** — an item casts on its numbers, not yours — and
  a **per-spell fixed cast level** ("as a 5th-level spell"). Three modes: cast without preparing,
  always prepared, and **added to my spell list** (prepare it normally, it costs a prepared slot
  — resolved by widening the eligible pool, not as a grant). *Rejected:* an attunement/active
  toggle (Francesco's call); a Kind dropdown.

- **D66 (2026-08-26) An action button whose label is a verb is an icon** — extends D57 from
  chrome to actions. `order…` / `save as version` on the level preview (which also drops the word
  "preview" — the chip's context is the level), `export` / `duplicate` / `delete` in the build
  manager (three word-buttons ran into the `current` chip on a phone), `select` in the species /
  feat / spell pickers, and `clear` in an eligible-spells group header. One class, `.ico-only`, and
  the meaning moves to the popover or `title`. A destructive icon still ARMS to the word
  "confirm?" (D53) — the icon must be appended **before** `armConfirm`, which snapshots
  `innerHTML` to restore. *Rejected:* keeping text on the destructive ones (the row's width was
  the problem, and `delete` was the widest); icon + text (the same width back).
- **D67 (2026-08-26) In "Choices to make" the category is a subtitle; the book chip is the only
  tag** — two tags side by side on the group head read as equals when one names the *printing* and
  the other names *what kind of thing this is*. The category drops to a quiet line under the name.
  A **feat also names its own type** there — "origin feat", "general feat", "epic boon", "fighting
  style" — because "feat" alone doesn't say which of your slots it came out of. Revises D30's "a
  category tag on every row/group". *Rejected:* dropping the category (it is how you tell a
  subclass choice from a species one at a glance).
- **D68 (2026-08-26) Slots and max spell level are two clocks, and a level card shows both** —
  the cards derived both from the class's own slot table, so in a caster-caster multiclass the
  slot gain landed on the wrong level. **Max spell level** follows that class's OWN level;
  **slots** follow the COMBINED caster level. A Bard 7 / Wizard 2 gets 5th-level slots at
  character level 9 while the Bard's own max spell level is 4th — the card now says both, the slot
  line in accent and the max line quiet. `planSlots()` reads the whole plan up to each card;
  `levelGains()` is features-only. The panel's bottom note is gone (the modal's own subtitle
  already said it). *Rejected:* one merged line (it is exactly the conflation that caused the bug).
- **D69 (2026-08-26) Species collapse on base + lineage, not on name** — reverses the recorded
  "different names, deliberately not normalized". A lineage can be RENAMED between editions
  ("Elf (High)" → "Elf — High Elf"), so a name match missed it and the picker listed Drow and High
  Elf twice. `raceDedupeId()` keys on `base|lineage` with the base word stripped back off the
  lineage, and the existing Editions filter hides the older printing — `reprint→all` still reveals
  it. Verified nothing over-collapses: the SCAG/MTF/ERLW variants and the Kaladesh/Zendikar
  settings all survive. *Rejected:* nesting both printings under one row (one more level of
  nesting for a duplicate nobody wants to see); a canonical key from both extractors (structurally
  cleaner, but it is an extract.py + extract.js change plus a data rebuild for a display problem).

- **D70 (2026-08-27) A ratio widget may never state an impossible ratio** — the per-level tiles
  printed `4/0`: being over the PREPARED TOTAL drives the per-level room negative at every level
  at once, and the old `Math.max(0, held+room)` clamp turned that into a denominator BELOW the
  numerator. The denominator now floors at what is actually held; the `.over` state and the meter
  above say what is wrong, and the tooltip names the real cause ("you are over your prepared
  total, so there is no room at any level until you drop some"). The tile design itself is right
  (Francesco's call) — this was a clamp bug, not a modelling one. *Rejected:* dropping the
  denominator for daily preparers (I proposed it; the per-level ceiling is real information when
  you are inside your budget).
- **D71 (2026-08-27) A level card's two clocks are tinted tiles on the right edge** — supersedes
  D68's prose lines. Both tiles are present on every card so either progression reads straight
  down the column; each keeps its own hue at all times (**spell = accent, slot = gold** — the tint
  IS the label, never grey), and the level that RAISED one takes the full colour and a border. The
  `+N slots` count is gone: the number of slots is on the Slots card, and what a level card is for
  is *when a threshold moved*. A **feat / epic boon** is budget you owe, not a feature, so it
  leaves the prose run for its own gold chip beside the class name. The drag handle centres on the
  card, not on its first line. *Rejected:* a tile only on the level that changes (ragged right
  edge, and you have to scan upward to answer "what is my max spell level at L7").
- **D72 (2026-08-27) A picked spell row gets a rail, never a fill** — the old
  `background + border-radius` on `.sp:hover` and `.sp.chosen` cut through the 1px divider and
  read as broken stripes. Both fills are gone. Picked rows carry a 2px green rail that **insets
  vertically and rounds its ends**, so a run of picked rows reads as one rail per row rather than
  one long bar, and the left padding that holds it is reserved on EVERY row so nothing shifts when
  you take a spell. The take chip stops being a solid green pill — **green lives on the icon
  only**, the chip just gains ink-weight text, so it still reads as a button. *Rejected:* a 6%
  square-cornered tint; the spell name going green (competes with the ritual badge and the name's
  own click affordance); no signal at all beyond the chip (Francesco picked the rail).
- **D73 (2026-08-27) Prepare-daily is tabbed by SET, and its chrome hides when it has nothing to
  do** — the tabs are one per re-preparing caster **plus a "Granted" tab** for grant picks you
  chose rather than were given (High Elf's Wizard cantrip and its kin, which the 2024 lineages
  re-choose on a long rest). The tab row hides with one tab, the level filter hides when only one
  level is present, the toolbar never wraps (the search field is what gives way), and the
  prepared count moves out of the toolbar to the **centre of the footer** — it answers "am I
  done", which is a footer question, not a filter. **Caveat:** the data carries no swappable flag,
  so the tab lists every `kind:"known"` pick; a one-time choice like Aberrant Dragonmark's appears
  there too. Detecting the real long-rest swap is a backlog item.
- **D74 (2026-08-27) The spell modal never says the same thing twice, and its stat block follows
  monster-forge** — Level and School leave the grid for **every** spell, not just cantrips (D49
  widened): the subtitle already reads "5th-level Conjuration". The stat block's header inverts —
  the **creature names the section** in the display face, with "stat block" as the small uppercase
  label after it. The ability block becomes the monster-forge **table**: two ability columns, each
  score / Mod / Save, proficient saves bold (no summon carries one, so a save is its modifier).
  Access chips all look the same — the category is named by the row they sit on when expanded, so
  tinting them by kind in the merged row only added noise.
- **D75 (2026-08-27) A version forked from the preview keeps its lineage in its name** —
  `<version> · LV<level>` ("L9 · LV5"), so you can see what it came from and at what level.
  *Rejected:* the bare level (two forks from different versions at the same level collide);
  the character name (it already sits above the version in the manager).

- **D76 (2026-08-27) Magical Secrets weighs on the TOP of your list, not just its own count**
  — an off-list spell can only have been taken from the feature's level on, so every off-list
  spell you hold **below** level L has already spent one of the acquisition events at levels
  ≥ onset — the same events that buy you spells at level L. Best case those are the earliest
  such events (the window between onset and your first L-level slot); the shortfall comes out of
  `cap[L]` itself, and the per-level tiles and over-flags follow the narrowed ceiling. Two things
  fall out: one off-list **1st**-level spell costs a slot of "spells at level ≥ 2" (it cannot
  have been learned before the feature), and it does **not** cost 8th-level capacity unless the
  off-list picks outnumber the window — the tool reports the BEST case (D18), so "I retrained at
  15" and "I could have retrained at 10" are the same build to it. *Rejected:* stamping each pick
  with the level it was taken at, which would price the retrain exactly — that is D64, rejected
  because a stamp cannot express retraining intervals.
- **D77 (2026-08-27) A grouping header carries no accent** — the source group ran accent text on
  an accent-soft band while the ability names carry the six ability hues, so two colour systems
  fought inside one table. The outer group keeps a neutral `--panel-2` fill with ink text and its
  **casting-stat chip** (never a book chip — the stat is what you group on); the level sub-header
  drops to a quiet muted sans label. The ability names are now the table's only hue. *Rejected:*
  no fill with a rule above (lighter but the groups read loose in a long table); a small-caps
  label over a hairline (quieter still, same problem).
- **D78 (2026-08-27) A spell can print a CAST, not just a creature** — some spells name a whole
  group: Find Familiar lists eleven forms and then says "or any beast of CR 0". Both extractors
  resolve `{@creature Name|SRC}` refs and `{@filter …|bestiary|challenge rating=[&0]|type=…}`
  into a list of monster keys on `sp.creatures`, against a shared `DATA.monsters` map — so a
  monster referenced twice is stored once. The stat block section becomes a **carousel** (prev /
  position / next + a book filter) whenever the set holds more than one, and it respects the
  global Sources list like everything else. **SCOPE:** the monsters carried out of a bestiary are
  `summonedBySpell` blocks plus **CR 0 non-swarm beasts** — exactly Find Familiar's set in both
  editions — and filters expand for **XPHB spells only**. That is 65 monsters, +48 KB to the
  offline digest and +16 KB to the SRD subset. *Rejected:* expanding the 2014 Conjure spells'
  CR ≤ 2 filters (219 beasts + 58 fey + 36 elementals — ~450 KB, for spells the Editions filter
  hides by default); named refs only (drops the CR 0 set that was the point).
  → widening is a change to `carried_monster()` / `carriedMonster()` in the two extractors and
  nowhere else. A ref to a creature outside the carried set silently doesn't resolve.

- **D79 (2026-08-27) A grant may be prose-only, and a grant may modify how you cast** — two
  gaps in 5etools' model, both fixed at the extractor. ① **Prose-only grants**: Mystic Arcanum
  ("Choose one level 6 Warlock spell") carries `additionalSpells: null`, so there was nothing to
  parse and the Warlock simply never got its arcana. A hand-authored `PROSE_GRANTS` table emits
  the same shape `parse_grants()` does — Warlock's four arcana, the Cleric capstone's Wish, the
  four Wizard school Savants, and Knowledge Domain's Mind Magic. ② **Modification notes**: a
  feature often changes HOW you cast what it grants ("without expending a spell slot", "you
  automatically succeed on the save") and 5etools carries that in prose only. `MOD_RE` lifts just
  those sentences onto the grant as `note`, shown as a bordered block in the spell modal and a
  dotted-underline popover on the table's source badge. The regex is deliberately **narrow**: the
  first cut matched "you always have these prepared" and produced 470 notes of boilerplate for
  something "Always prepared" already says — it is 44 now. *Rejected:* shipping each granting
  feature's full text (most of it is not a modification).
- **D80 (2026-08-27) Magical Secrets gets its own picker** — the off-list meter had no way to act
  on it, so adding an off-list spell meant hunting the eligible list. "Add an off-list spell"
  opens the spell-pick modal scoped to the lists the feature opened (the class's own list is
  filtered OUT), mirroring the wizard's "Copy a spell into your book".
- **D81 (2026-08-27) A creature set is filtered in the carousel, never pruned by it** — extends
  D42 to D78's creature sets. `spellCreatures()` no longer drops forms whose book is off; the
  carousel's own **book panel** (a ghost icon before the head's chevron) lists every book in the
  set with its count and marks the ones off in your Sources, so you can tick them in locally.
  This is what "Find Familiar is missing most base MM25 options" turned out to be — all 24 XMM
  CR 0 beasts were in the data, XMM was simply switched off. The carousel's controls also moved
  BELOW the block: you read the creature, then step. *Rejected:* the `<select>` book filter it
  replaces (it sat in the head and could only narrow to one book at a time).

- **D82 (2026-08-27) The importer rejects Foundry payloads by name AND by marker** — a zip
  carries per-directory `foundry.json` files alongside the top-level `foundry-*.json` ones, and
  `zipWanted()` only matched the hyphenated form. Their stub records then won, because the
  builder overwrites by `name|source` and pushes classes unconditionally. The name test drops
  the hyphen; on top of it `dropFoundryStubs()` strips any entity carrying `migrationVersion`,
  a Foundry-only field, so a differently-named dump cannot repeat this. **Anyone who imported
  before this must re-import** — the corrupt records are already in their localStorage.
  *Rejected:* filtering only by `migrationVersion` (the name test also saves parsing three large
  files); detecting the corruption at boot and warning (machinery for a one-off).

### Settled — recorded so they aren't re-proposed
Headline + rejected options only; reasoning → `ARCHIVE.md#rationale`.
- **D7** Source counts in chips — per-source `n/cap` on take chips, red over forecast.
  *Rejected:* counts in the group toolbar.
- **D8** Prepare-daily — one modal step per non-static caster; table's inline prepare removed.
  *Caveat:* the wizard step edits the spellbook (no separate prepared subset in the model).
- **D9** Epic boons — EB is its own slot, gated to level ≥19. *Rejected:* leaving EB in the general list.
- **D10** Always-prepared dedup — a spell always-prepared by a class's own subclass/feature is not
  offered as a prepare option for that same class.
- **D11** Custom spells — a toggleable "Homebrew" (HB) source; class tags drive eligibility.
  *Rejected:* global always-on; per-build only.
- **D15** Zip import — native `DecompressionStream`, manual central-directory walk. *Rejected:* JSZip.
- **D16** Onboarding = modal — the import modal auto-pops on a truly-empty state.
- **D18** Per-spell-level caps for known casters — `capsFor().cap[L]` reconnected; daily preparers
  stay free. *Rejected:* capping daily preparers (not RAW); a fixed per-level quota.
  → the runtime rule lives in Gotchas.
- **D19** Edition de-duplication — `SHADOWED` keeps the highest-ranked printing, `reprint→all`
  reveals the rest. → the runtime rule lives in Gotchas.
- **D20** Wizard spellbook model — a third caster kind with a progressive per-level book cap;
  exceeding it is the legal "copy into spellbook", not an error. *Rejected:* a flat free cap
  (D14-style, wrong for wizards); hard-blocking copies. → the runtime rule lives in Gotchas.
- **D21 / D25** Spell modal Access — who grants it, per category, edition-deduped; collapsed to one
  merged row + ⌄ expander by default.
- **D23** Level lists as ranges — "0;1;2" → "0-2" in grant descriptions, render-time.
- **D24** Grant feature names — extractors correlate `additionalSpells` back to the feature that
  describes it; ~93% named, the rest fall back to the subclass name.
- **D24b** Description sub-heading style = quiet label — muted sans sentence-case `.spttl`.
  *Rejected:* D22's accent-uppercase ("too flashy"; hierarchy was off).
- **D26** Species & feats picker modals — `.picksel` triggers opening a shared `#entityModal`.
  **Three entry points kept**, each pre-scoped to its feat category (Francesco's call).
- **D28** Optional features = every spell-granting type, filtered by source — slots come from
  `optionalfeatureProgression`, so they are data, not per-type code. *Rejected:* invocations-only;
  invocations + pact boons only (Francesco overrode the narrower scope).
- **D29** Spell-table column rework — fixed order, ⋯ column checklist with drag-to-reorder, layout
  is a **global preference**. Both source columns stay always-on (Francesco's override; horizontal
  scroll accepted). *Rejected:* one merged source column; header-drag reordering; per-build state.
  ~~Components cell = cost inline~~ **SUPERSEDED → D32.**
- **D30** Choices grouped by their granting entity, with a category tag on every row/group.
  *Rejected:* grouping by the composed giver label (breaks when an option group renames the giver).
- **D32** Material component moved to a popover — supersedes D29's cost-inline treatment, which
  Francesco picked and then reversed on seeing it. *Rejected:* keeping cost inline.
- **D38** Spell table reads as a grid — columns and contents centred, abbreviations restore on
  hover, the cantrip group note removed.
- **D39** One source-book chip — `.bchip` everywhere a printed book is named; the book leaves the
  eligible-spell rows for the spell modal's title line.
- **D40** Eligibility is a default, not a wall — an "every spell" filter option, and any search
  surfaces near-misses dimmed and tagged with why. *Rejected:* a divider per level group (noise at
  ten groups); making them pickable (they aren't legal).
- **D41** A crossed prerequisite is a one-click fix (species swaps; feats and options are added);
  unverifiable parts carry no "?". *Rejected:* auto-taking the prerequisite on select (silent
  state changes).

### Superseded
- ~~**D14** Level budget = free distribution~~ → **D18.** Free distribution was wrong for
  known/level-swap casters (a Bard learns spells on level-up capped at its top slot); it survives
  only for daily preparers.
- ~~**D22** Sub-heading style = accent uppercase~~ → **D24b.**

## Backlog (next sessions)
- [ ] **Prerequisites we can't check**: ability scores, proficiencies, backgrounds and campaigns
  aren't in the app's model, so those alternatives read "check …" rather than pass/fail. Closing
  this means tracking ability scores — a bigger change than it looks. ⚑ (owner: Francesco, 2026-08-26)
- [ ] **Feat budget attribution when categories are crossed** — a general slot holding an origin
  feat still counts against `origin`, so the budget pill can read `origin 2/1`. Soft-flagged only.
- [ ] **Ability column** wasn't in Francesco's column order; kept visible in place so the table
  didn't regress. Confirm whether it should default to hidden.
- [ ] **Book in the spell-pick modal rows** — D39 removed it from the eligible list only.
  ⚑ (open question for Francesco, 2026-08-26)
- [ ] **extract.py ↔ extract.js grant divergence** (found 2026-08-26, **pre-existing**): the
  Node parity harness now diffs `grants`, and finds 77 species + 73 subclass mismatches. Two
  causes, both cosmetic-or-coverage rather than wrong output: Python always writes
  `"feature": null` where JS omits the key; and JS finds TCE Artificer subclass spells that
  extract.py's walker never reads. Prereqs, stat blocks and every count are exact.
  ⚑ (owner: Francesco, 2026-08-26)
- [ ] **`page` is not on every book chip** — the choices-card group header and the gap dialog
  pass a source with no page, so their popover shows the book name only. Resolving the owner
  entity back to its record would close it.
- [ ] **Additive imports** — building an import replaces the previous one, so adding one brew
  means re-staging everything. A merge mode (import ⊕ import) would close D58's caveat and the
  quota story together. Related to T7/IndexedDB.
- [ ] **Magic-item ingestion for custom sources** — prefill a D55 source from items.json's
  `attachedSpells` (rejected from v1; items carry no structured uses). Needs items in both
  extractors + SRD gate.
- [ ] **IndexedDB** for imported data — localStorage may overflow on a full multi-book import
  (the importer reports quota errors but can't store). Related to T7.
- [ ] Importer UI polish — a "clear imported data" button, per-source enable after import, a
  preset-library manager (monster-forge style ticking).
- [x] ~~Wizard prepare-daily: separate **prepared subset** from the spellbook/known list~~
  **CLOSED 2026-08-26 → D62** — `chosen[idx].prep` is the daily subset, drawn from the book.
- [ ] **Custom sources UI redesign** — Francesco: "still a UI mess, let's do a dedicated back and
  forth design session". The MODEL (D55/D65) stands; this is the surface. It is the **next
  action**, ahead of T7.
- [ ] **Polymorph / Shapechange / True Polymorph as creature sets** — Francesco: "technically a
  spell with multiple stat block options, but perhaps it would require full monster catalogue".
  Correct: their filters are open-ended (any Beast of CR ≤ your level, any creature of CR ≤ …),
  which is the whole bestiary — 4,458 monsters. D78's carried set is 65. Out of scope until
  there is a reason to ship the catalogue; a CR-capped subset would still be hundreds.
  ⚑ (owner: Francesco, 2026-08-27)
- [ ] **Free-cast modifications that are not grants** — D79's notes only reach spells a feature
  GRANTS. A dozen 2024 features let you cast a spell you already have for free (Paladin's Smite,
  Ranger's Favored Enemy, Bard/Glamour's Mantle of Majesty, Druid/Stars' Star Map,
  Warlock/Archfey's Steps of the Fey and Bewitching Magic, Wizard/Diviner's The Third Eye,
  Wizard/Illusionist's Phantasmal Creatures, Cleric's Divine Intervention). They are listed in
  the sweep below and would need the same note attached to a spell the build merely knows.
- [ ] **Detect a real long-rest spell swap in the extractors** — D73's Granted tab lists every
  `kind:"known"` pick because the digest has no flag for "you may replace this on a long rest".
  The 2024 lineages say it in prose ("Whenever you finish a Long Rest, you can replace that
  cantrip…"); a one-time choice like Aberrant Dragonmark's does not. Emitting `swap:true` from
  both extractors would let the tab say which is which. ⚑ (owner: Francesco, 2026-08-27)
- [ ] Custom-spell **manager** (list all homebrew to edit/delete without opening each).
- [ ] High Elf true in-table cantrip swap; Human extra-origin restricted to origin cats.

→ closed backlog items: `ARCHIVE.md#closed-backlog`

## Gotchas
- **Content assembly:** `window.__DATA__` (baked) is optional now. `assembleData()` picks
  imported > baked > empty, merges custom homebrew, calls `buildIndexes()`. Indexes
  (CLS_BY, SPELL_BY, …) are `let`, rebuilt on every content change — never captured.
- **extract.js ↔ extract.py** must stay in sync (same digest shape). `asArr`/coerced
  `parseGrants` handle 5etools bare-value-instead-of-list quirks.
- **`foundry*.json` is the single most damaging file class in a 5etools zip, and it bit for
  real (D82).** extract.py never reads them (it globs `spells-*.json` / `class-*.json`
  explicitly), but the importer's `zipWanted()` excluded only `foundry-*.json` — so
  `spells/foundry.json` (319 stubs), `class/foundry.json` (12 classes + 19 subclasses) and
  `bestiary/foundry.json` (11 monsters) all sailed through and **overwrote real records by
  `name|source`**. Symptom: a spell modal with a level, school, range, components, duration and
  description all blank, and an import report reading 39 classes / 341 subclasses instead of
  27 / 315. Fixed on the name (`startsWith("foundry")`) plus a `migrationVersion` guard, since
  that field marks a Foundry stub and no real record carries it.
- **A parity harness must drive the REAL predicates.** The old `scratchpad/cparity.js` rolled its
  own file filter that happened to be STRICTER than `zipWanted()` — which is exactly how the bug
  above hid through two sessions of "parity is exact". It now imports `zipWanted` and
  `dropFoundryStubs` from extract.js and asserts on the record that broke. Parity is **exact**:
  936 spells, 27 classes, 65 monsters, 276/276 feats, 213/213 optional features, prereqs
  byte-identical.
- **Spell-source lookup** (`generated/gendata-spell-source-lookup.json`) is what gives spells
  their `cls`/`sub`/`feat`/`race` access — without it imported spells match no class.
- **`innate` has two shapes.** `{"_": {"daily": {...}}}` (a cadence map) AND
  `{"_": ["mage armor|xphb"]}` (a bare list = at-will). The list form was skipped by an
  `isinstance(dict)` guard, silently dropping **42 grant blocks** (23 optional features,
  9 subclasses, 9 species, 1 class). Both extractors handle both now — if grants ever go
  missing, check this first.
- **Artificer infusions grant no spells at all**, so they're out of D28 by construction; the
  **2024 Artificer (EFA) has no `optionalfeatureProgression`**. Don't go looking for either.
- **Homebrew source = "HB"**; auto-enabled on boot when custom spells exist.
- **SRD subset** = entities with 5etools `srd52` truthy (extract.py `_srd_subset`). All 12
  XPHB classes are srd52. Public data is inlined in the committed `docs/index.html` (CC-BY, fine
  to be public); `data-srd.json` itself is gitignored. **Keep the credit footer** for CC-BY.
- **Level budget model (D18/D20):** known/level-swap casters (`static` — Bard, Sorcerer) have a
  *progressive* per-level ceiling from `capsFor().cap[L]` (= max spells at level ≥ L); tiles show
  live room addable at each level, and `overLevels[L]` flags a level over. Daily preparers
  (`static=false`) are free — only the total + max castable level bind. **The wizard spellbook is
  its own third kind**: `known.cap[L]` is progressive too (from the `spellbook` growth array, no
  swap term), and exceeding a level's cap is **not an error** — it's the legal "copy into
  spellbook", shown in accent, not red. Enforcement everywhere is soft (flag, no hard block).
- **Edition dedupe (D19):** `SHADOWED` (WeakSet, rebuilt each `buildIndexes`) hides duplicate
  editions of the same element; `reprint→all` reveals them. HB never participates. **Species do
  NOT key on the name** (D69) — a lineage gets renamed between editions (`Elf (High)` →
  `Elf — High Elf`), so `raceDedupeId()` keys on `base|lineage` with the base word stripped off
  the lineage. Widen that normalization carefully: it is the only thing keeping the SCAG/MTF
  variants and the Kaladesh/Zendikar settings from collapsing into the XPHB lineages.
- **Prerequisites are advisory (D31).** `prereqState()` returns ok/maybe/no; "maybe" means the
  app can't verify (ability scores, proficiencies, backgrounds). Never turn "maybe" into "no" —
  it would hide legal picks. Nothing is ever blocked or auto-removed, only flagged.
- Grants tree `{fixed, picks, expansions, optionGroups, ability}`; path-based choice ids stable.
- Cart/choices keyed by stable row id (`state.nextRowId`), never array index.
- **Column layout is global**, under its own key `spellForge.table.v1` — NOT part of the build
  blob. Adding a column means adding it to both `TABLE_COLS` and `COL_ORDER_DEFAULT`;
  `loadTableOpts` appends unknown-but-new keys so an old saved order doesn't hide a new column.
- **Builds layer (T1–T3, D33–D35).** `spellForge.builds.v1` =
  `{activeId, order, builds:{id:{meta,state}}}`; `spellForge.sources.v1` is the **global** book
  list — `SRC`, a module-level Set, **NOT `state`**. Nothing may put sources back inside a build.
  `save()` = auto-save the active build. `meta.character` is a grouping label only (level-free,
  auto-follows until `meta.named`), and grouping happens **at render time** — never build a
  character object. Legacy `spellForge.v2` is read once for migration and then left alone as a
  rollback — do not delete it before v7 ships.
- **Build manager (T3).** `#buildModal` from the ⋯ menu. `switchBuild()` flushes the outgoing
  build with `save()` first, then `applyState()`. `deleteBuild()` must never leave zero builds;
  it creates a fresh one instead.
- **Nothing prunes on a source change (D42).** `afterSourceChange()` only fixes the filter
  override; `pruneState()` drops refs to content that no longer EXISTS. If a pick ever disappears
  when you untick a book, something has re-added pruning. The visible contract is the gap banner
  (`renderGapBar`), `.gapped` fields, and the activation dialog (`#srcAskModal`, which asks about
  `buildGaps().books` — **not** `meta.sources`, which would list 40+ irrelevant books). Keep all
  three in sync with any new pick kind.
- **A `<select>` must always contain its own current value.** `classOptions(keep)` and the
  subclass list take the row's key so a hidden entry stays selectable; without that the browser
  silently selects option 0 and the next edit writes the wrong class into the build. The same
  class of bug had `refreshSpecies()` clearing `state.speciesKey` outright.
- **Picker book overrides can widen** past the global source list. Committing a pick from a
  globally-disabled book **enables that book**, so the pick is visible in the surface you just
  used rather than immediately flagged. The spell filter's override can only narrow.
- **Dimmed spell rows (D40)** carry `dim:true` and a `why`, and have **no takers** — `mkSpell`
  returns early for them, so they can never be picked. If a dimmed row ever grows a take button,
  that early return has been broken.
- **`.bchip` vs `.srcbadge`** — `.bchip` (D39) names the **printed book**; `.srcbadge` names
  **who grants** the spell in your build and is colour-coded (free / cast). They look similar and
  are not interchangeable.
- **Native scrollbars follow `color-scheme`, not your CSS.** The "light scrollbar in dark mode"
  bug was a missing `color-scheme` on `:root`. It is now set in all three theme blocks (`:root`
  light, the `prefers-color-scheme:dark` block, `[data-theme=dark]`), plus themed
  `::-webkit-scrollbar` rules. **Any new theme block must set it too.**
- **Carets are drawn, not typed.** `⌄` (U+2304) sits wherever its font puts it, which is what made
  picker/access icons read as off-centre. `.pk-caret` and `.acc-toggle` draw a border chevron
  nudged up by `s·√2/4` (the ink of a rotated square lives in its lower half). Reuse that pattern
  rather than a glyph when an icon must sit optically centred.
- **Static preview cache:** editing `src/index.html` needs a hard reload (query-bust) — a plain
  reload serves stale HTML and new `$("#…")` lookups return null. Editing it also re-opens a
  `file://`/`data:` preview tab and fronts it — drive the `http://localhost` tab.
- **A top-level function may not call a closure local.** `cellFor()` (top level) called
  `slotCastable`, a `const` inside `renderTable()` — so the whole Spell table threw
  `ReferenceError` for any build holding a limited-use innate cast (a `1/LR` species grant is
  enough). It shipped. `slotCastable` is module scope now; check this shape when a helper moves.
- **`prepared`/`known`/`expanded` have THREE shapes, like `innate` does** — a bare list, a
  cadence map, and a **class-requirement group map** (`{"_":[…]}` = no requirement). The group
  form fell through to `spell_ref()` as a raw dict and silently discarded its `choose` filter:
  25 grants read "a spell" with no filter, High Elf's Wizard cantrip among them. `ungroup()` in
  both extractors handles it. **Same failure mode as the `innate` gotcha above — check it first
  when a grant is unfiltered or missing.**
- **Summon stat blocks (D50)** come from the bestiary's own `summonedBySpell` field, never from
  parsing `{@creature}` refs. 24 spells carry one. `sb_text`/`sbText` expand the tags whose
  meaning is in the tag NAME (`{@h}`, `{@atkr}`, `{@actSave}`, `{@hit}`) **before** `rich_strip`
  reaches them — that is why `flatten_entries` takes a `strip` parameter. `_srd_subset()` strips
  a non-SRD stat block off an SRD spell. The importer's `slimJson()` keeps only summon monsters
  from a bestiary file; without it a full bestiary would reach localStorage.
- **The mobile jump bar (D48) must not use `behavior:"smooth"` alone.** Some embedded webviews
  accept the call and never scroll — and CSS `scroll-behavior:smooth` on `html` breaks even a
  plain `scrollIntoView` there. `jumpTo()` asks for smooth and jumps after 180 ms if nothing
  moved. Its button set is rebuilt only when the section list changes, so `bar.dataset.sig`
  must be **cleared** whenever the bar is emptied (switching to the table tab) — otherwise
  coming back finds a stale match and renders nothing.
- **Native `confirm()`/`alert()` are banned (D53)** — they silently no-op in embedded webviews
  (confirm returns false with no dialog). Destructive actions use `armConfirm()`. If a button
  ever "does nothing", check for a reintroduced native dialog first.
- **Icons are `ICONS`/`icoEl`/`xBtn` only (D57)** — never a glyph in `textContent`. Static
  markup uses `data-ico` + boot `fillIcons()`. `<option>` elements are the one exception
  (no markup allowed inside). Sizing lives in CSS per context, not in the SVG.
- **The dev server sends `Cache-Control: no-store`** (serve.py) — the old "hard-reload after
  editing" gotcha is gone, but an already-open TAB still runs old code until one reload; a
  cached-before-the-change browser needs one `fetch(url,{cache:'reload'})` bypass.
- **Preview (D54) is module state, never saved.** Every level consumer must go through
  `effLevel(row)` / `charLevel()` — reading `row.level` directly leaks full-level numbers into
  a preview. `state.levelOrder` normalizes through `classLevelPlan()`; never trust it raw.
- **Custom sources (D55)** synthesize a grants object (`customSourceGrants`) and ride
  `resolveGrants` with tok `x<id>` — they must never grow their own downstream path.
- **Homebrew import**: books come from `_meta.sources` (group "brew"), spell access from the
  spell's INLINE `classes` field. Both only ADD to what the generated lookup knows. An import
  still replaces the previous import wholesale — stage core + brews together (D58 caveat).
- **`attachTip()` must be called AFTER an element's own `onclick`** — it used to overwrite the
  handler outright, which silently disabled the preview's "order…" button. It now preserves an
  existing handler; `detachTip()` clears a reused node's stale tip.
- **A nested action button must stop its click** — `xBtn` does. If a handler re-renders, the
  original event keeps bubbling and hits the *freshly attached* parent handler: dismissing the
  level preview immediately re-armed it that way. Watch for this in any rebuild-on-click.
- **Preview is a VIEWER (D64).** Per-level loadouts are versions ("save as version"), not
  per-pick stamps. Do not reintroduce `atLevel` on picks without solving retraining intervals.
- **A wizard has two sets (D62):** `chosen[idx].spells` is the spellbook, `chosen[idx].prep` is
  today's prepared subset. Anything that reads "what is prepared" must branch on
  `cart.known.book`, or it will treat the whole book as prepared.
- **Custom sources (D65)** synthesize grants via `customSourceGrants` + `resolveGrants` (tok
  `x<id>`), EXCEPT `mode:"list"`, which widens the eligible pool instead. Per-grant extras
  (DC, attack, fixed cast level) ride through `spellOut`'s `extra` argument.
- **`.tk.over` must not eat `.tk.on` (D72/D79).** A selected take chip on an over-budget class
  used to render entirely red, because `.tk.over` follows `.tk.on` at equal specificity — which
  is why selection "sometimes didn't highlight". Selection owns the **border and the icon**;
  `.over` owns the text. `.tk.on.over` restates the green border after both.
- **Two extractor tables are hand-authored and must stay in lockstep (D79):** `PROSE_GRANTS`
  (features that grant spells in prose with no `additionalSpells` — Mystic Arcanum and friends)
  and `MOD_RE` (the sentences that become a grant's `note`). Both exist in extract.py AND
  extract.js; `scratchpad/gparity.js` diffs the notes and must report `diffs=0` for classes.
  Subclasses show 2 diffs from `RHW`, a **pre-existing** walker-scope difference — extract.py's
  `class/class-*.json` glob reads partnered content that the zip reader excludes.
- **The audit that found these:** two sweeps over the mirror — ① features whose prose names a
  `{@spell}` the digest doesn't grant (mostly false positives: "Spellcasting" prose lists example
  spells), ② features with NO `additionalSpells` whose prose says "choose … spell" or "cast …
  without expending". Sweep ② is the one that matters; rerun it after any 5etools update.
- **A creature set is `sp.creatures` (keys) + `DATA.monsters` (blocks), never inlined (D78).**
  `spellCreatures(sp)` = the spell's own summon block, then every carried monster whose book is
  on. `carried_monster()` in extract.py and `carriedMonster()` in extract.js **must stay
  identical** — the Node harness in `scratchpad/cparity.js` diffs both sides and must report
  `diffs=0`. An import built before D78 carries no `monsters`, so `assembleData` keeps the BAKED
  map underneath it; **per-spell `creatures` cannot be back-filled — a re-import is needed.**
- **A ratio widget may never print a denominator below its numerator (D70).** Being over a shared
  TOTAL drives every per-level `room` negative at once; clamping that at 0 produced "4 of up to 0".
  `free` (real room) and `ceil` (what is displayed) are separate values now — `free` still drives
  the over/copied states, `ceil` floors at what is held.
- **A row highlight must not fight its own divider (D72).** A rounded background behind a row with
  `border-bottom` cuts the rule at the corners. `.sp` picked rows use an inset `::before` rail; the
  padding that holds it is on EVERY row so selection never shifts the layout, and the rail insets
  vertically so adjacent picked rows don't merge into one bar.
- **Slots and max spell level are DIFFERENT clocks (D68).** Max spell level comes from a class's
  OWN level (`maxLvlAt(caster,classLevel)`); slots come from the COMBINED caster level
  (`planSlots()` over the whole level plan, or `R.mcSlots`). Deriving one from the other is what
  put the slot gain on the wrong level card. Anything new that reports "what this level gave you"
  must read both, separately.
- **An icon-only button that ARMS needs its icon appended BEFORE `armConfirm`** (D66) —
  `armConfirm` snapshots `innerHTML` as the restore state, so arming an empty button and
  disarming it leaves it blank. Same call order rule as `attachTip` after `onclick`.
- **History purge:** old data-bearing commits are unreachable on origin but GitHub may still serve
  them by exact SHA until it gc's. `backup/pre-purge-20260826` (local) has the original.

## Shipped
- v6 / v6.1 — runtime content layer, custom spells, importer, Pages deploy, SRD embed, zip import.
  → `ARCHIVE.md#v6`
- v6.5 / v6.6 — innate-cast fixes, optional features, prerequisites end-to-end, column rework,
  shared source checklist, unified feat picker. → `ARCHIVE.md#v65`
- v7 note batches — prerequisite chips, material popover, eligibility escape hatches, one book
  chip, table centring. → `ARCHIVE.md#v7-notes`
- v7 · T1–T5 — saved builds end to end: storage + migration, activation reconciliation, the
  manager, the header switcher, and export/import as files.
- v7 note batches 2–3 (2026-08-26) — SVG icon sweep, mobile jump bar, level preview + level
  plan, custom spell sources, homebrew/UA import, wizard spellbook ≠ prepared. **D43–D65.**
- v7 note batch 4 (2026-08-26) — icon-only actions, choices category as a subtitle, the level
  card's two casting clocks, species lineage dedupe, equal card spacing on a phone, the
  prepare-daily step row hidden for a single caster. **D66–D69.**
- v7 note batch 5 (2026-08-27) — the `x/0` tile clamp bug, level cards as tinted tiles + feat
  chip, spell rows on a rail instead of a fill, the prepare modal tabbed by set with a Granted
  tab, the spell modal's stat block and access chips, preview-version naming. **D70–D75.**
- v7 note batch 6 (2026-08-27) — the Magical Secrets level weighting (D76), grouping headers off
  the accent (D77), creature sets + the stat block carousel (D78), the selected-chip highlight
  bug, level tiles de-tinted, feats back in the level prose, spellbook-not-prepared dimming,
  "Spell preparation" with a per-tab subtitle and a three-state counter, and per-version action
  menus in the build switcher. **D76–D78.**
- v7 note batch 7 (2026-08-27) — prose-only grants and grant modification notes (D79), the
  Magical Secrets picker (D80), the carousel's book panel and bottom controls (D81), plus a
  two-pass audit of every XPHB class and subclass for missing spell sources. **D79–D81.**

⟳ Rename previous session → "Note batches 4–7: icons, level cards, creature sets, Warlock grants" · session: resolve by cwd + latest
  (The 2026-08-26 note naming "Level preview, custom sources, build export" was never applied — no session in this cwd matched it confidently. Dropped rather than carried a third time.)
