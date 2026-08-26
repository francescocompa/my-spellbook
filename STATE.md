# STATE — My Spellbook

> Resume doc. One current-state block, edited in place.
> History → git log. Consumed phases and decision rationale → `ARCHIVE.md`.

## TL;DR (2026-08-26 · commit 7f57021 · v7 in progress · **LIVE on GitHub Pages**)
- **State:** working, **uncommitted** (see Manual ⓪). v7 is now **T1–T4 done** — storage +
  migration, activation reconciliation, the manager, and now the **header switcher**. On top of
  that, a 15-note batch from Francesco: the Choices card rebuilt so **every giver is a group**;
  feat slots carry an **in-line count tile** instead of a red label chip and taken feats went
  **neutral**; the species picker **groups lineages** under their species; a **mobile jump bar**
  and a top row that fits; the spell table's name column left-aligned and its header one row on a
  phone; and in the spell modal a **collapsible summon stat block**, a **book popover with the
  page**, cantrip-specific meta, and a real heading above Access. Two real bugs fell out:
  **High Elf (and 24 other grants) silently lost their `choose` filter** — a third `known`/
  `prepared` shape, `{"_":[…]}`, exactly like the `innate` gotcha — and `slotCastable` was a
  closure local called from top-level `cellFor()`, so **the Spell table threw on any build with a
  limited-use innate cast** (shipped, live). Decisions **D43–D52**. Verified in-browser at 375px
  and desktop; extractor parity re-validated in Node (936 spells, 276/276 feats, 213/213 optional
  features, 24/24 stat blocks byte-identical).
- **Next action:** **v7 · T5 (export / import a build)** — JSON download + file/paste import
  carrying `meta.sources` (D36 — file only, no URL). **Done when:** a build survives a round trip
  through a file on another machine. *(Then T7 storage pressure. T6 closed by D37.)*
- **Manual for Francesco:** ⓪ **Nothing is committed yet** — review, then
  `git add -A && git commit && git push` (Pages redeploys from `main:/docs`, already rebuilt).
  ① **Check the live site** — the last push changes how storage works,
  and an existing browser session runs the one-time migration on first load. ② Optional — ask
  GitHub Support to gc so the *old* unreachable commits (SHA 2c8bbb6 etc., held only in
  `backup/pre-purge-20260826` locally) stop being SHA-addressable. ③ To update the live site:
  `python3 extract.py` (if data changed) → `python3 build.py` → commit → push (Pages serves
  `main:/docs`). ④ `dist/`, `data/`, `data-srd.json` are gitignored (local only); public SRD data
  is inlined in committed `docs/`. ⑤ **Open question:** the spell-**pick** modal's rows still show
  the printed book, which D39 removed from the eligible list. Say if it should follow.

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
  it via Bash, then open the browser at the URL. **Hard-reload after editing index.html**
  (the static server caches it; a plain reload can serve stale HTML and null-out new elements).
- Data refresh: `python3 extract.py` (mirror default = `~/Documents/D&D/5etool_mirror/…/data`,
  writes data.json + `data-srd.json`), then `python3 build.py` (writes data.js, dist/ with full
  data, docs/ with SRD inlined).
- `src/extract.js` = in-browser port of extract.py (the importer). Keep them in sync.
- Verify gate: `python3 -c "import ast;ast.parse(open('extract.py').read())"`,
  `node -e "new Function(fs…app.js)"`, `node -e "new Function(fs…extract.js)"`, json load.
- Deploy: commit + push `main`; Pages builds `main:/docs` (has `.nojekyll`).

## Now — v7: saved builds

One character at a time was the last hard limit in the app. T1–T3 removed it; what's left is
getting around (T4), getting a build off this machine (T5), and telling the truth about
storage limits (T7).

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
- [ ] **T5 · export / import a build** (`data`, ~M). A build is currently one browser away
  from gone — localStorage, one device, no backup. JSON download + file/paste import, carrying
  `meta.sources` so an imported build tells you which books it expects (D36 — file only, no URL).
  **Done when:** a build survives a round trip through a file on another machine.
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
- [ ] **IndexedDB** for imported data — localStorage may overflow on a full multi-book import
  (the importer reports quota errors but can't store). Related to T7.
- [ ] Importer UI polish — a "clear imported data" button, per-source enable after import, a
  preset-library manager (monster-forge style ticking).
- [ ] Wizard prepare-daily: separate **prepared subset** from the spellbook/known list (partly
  addressed by D20 — book cap + copy modelled; the daily prepared *subset* pick is still flat).
- [ ] Custom-spell **manager** (list all homebrew to edit/delete without opening each).
- [ ] High Elf true in-table cantrip swap; Human extra-origin restricted to origin cats.

→ closed backlog items: `ARCHIVE.md#closed-backlog`

## Gotchas
- **Content assembly:** `window.__DATA__` (baked) is optional now. `assembleData()` picks
  imported > baked > empty, merges custom homebrew, calls `buildIndexes()`. Indexes
  (CLS_BY, SPELL_BY, …) are `let`, rebuilt on every content change — never captured.
- **extract.js ↔ extract.py** must stay in sync (same digest shape). `asArr`/coerced
  `parseGrants` handle 5etools bare-value-instead-of-list quirks.
- **Test the extractors in Node, not by eye**, and **exclude `foundry*.json`** from the harness
  walker. extract.py never reads those files; left in, they overwrite real entries by
  `name|source` and manufacture ~39 false diffs. Filtered out, parity is **exact**: 276/276 feats,
  213/213 optional features, prereqs byte-identical.
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
  editions of the same element; `reprint→all` reveals them. HB never participates. Species named
  differently across editions (`Elf — Drow` vs `Elf (Drow)`) aren't collapsed — different names,
  deliberately not normalized.
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
- **History purge:** old data-bearing commits are unreachable on origin but GitHub may still serve
  them by exact SHA until it gc's. `backup/pre-purge-20260826` (local) has the original.

## Shipped
- v6 / v6.1 — runtime content layer, custom spells, importer, Pages deploy, SRD embed, zip import.
  → `ARCHIVE.md#v6`
- v6.5 / v6.6 — innate-cast fixes, optional features, prerequisites end-to-end, column rework,
  shared source checklist, unified feat picker. → `ARCHIVE.md#v65`
- v7 note batches — prerequisite chips, material popover, eligibility escape hatches, one book
  chip, table centring. → `ARCHIVE.md#v7-notes`

