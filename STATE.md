# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. History → git log.

## TL;DR (2026-08-26 · commit 32b588d · v7 in progress · **LIVE on GitHub Pages**)
- **State:** working, committed + **pushed** (clean tree). This session shipped **three of v7's
  tasks** — **T1** storage + migration, **T3** the build manager, **T2** activation
  reconciliation — so the app now holds **many characters, each with several versions**, and
  **nothing is ever pruned behind your back** (D42). Around them, two batches of Francesco's
  notes: prerequisites as per-part verdict chips with a **one-click fix** on the crossed ones;
  the material popover reduced to cost/consumed/material; **eligibility made a default rather
  than a wall** (an "every spell" option, and searches surfacing dimmed near-misses); one
  source-book chip everywhere; the spell table centred with abbreviations restoring on hover;
  and the `color-scheme` / drawn-caret fixes behind the "light scrollbars" and off-centre-icon
  complaints. Decisions **D33–D42**. All verified in-browser; extract.py ↔ extract.js parity
  re-validated in Node (276/276 feats, 213/213 optional features).
- **Next action:** **v7 · T4 (switcher)** — getting between builds without opening the manager.
  **Done when:** the active build is visible and switchable from the main surface.
  *(Then T5 export/import, T7 storage pressure. T6 closed by D37.)*
- **Manual for Francesco:** ① **Check the live site** once Pages rebuilds — this push changes
  how storage works, and an existing browser session will run the one-time migration on first
  load. ② Optional — ask GitHub Support to gc so the *old* unreachable commits (SHA 2c8bbb6
  etc., held only in `backup/pre-purge-20260826` locally) stop being SHA-addressable.
  ③ To update the live site: `python3 extract.py` (if data changed) → `python3 build.py` →
  commit → push (Pages serves `main:/docs`). ④ `dist/`, `data/`, `data-srd.json` are
  gitignored (local only); public SRD data is inlined in committed `docs/`.
  ⑤ **The bare-list `innate` fix changes existing builds** — 42 grant blocks that were
  silently dropped now resolve, so a saved build may gain spells it should always have had.
  ⑥ **Open question:** the spell-**pick** modal's rows still show the printed book, which D39
  removed from the eligible list. Say if it should follow.

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
- Data refresh: `python3 extract.py` (mirror default = `~/Documents/D&D/5etool_mirror/…/data`, writes data.json + `data-srd.json`), then `python3 build.py` (writes data.js, dist/ with full data, docs/ with SRD inlined).
- `src/extract.js` = in-browser port of extract.py (the importer). Keep them in sync.
- Verify gate: `python3 -c "import ast;ast.parse(open('extract.py').read())"`,
  `node -e "new Function(fs…app.js)"`, `node -e "new Function(fs…extract.js)"`, json load.
- Deploy: commit + push `main`; Pages builds `main:/docs` (has `.nojekyll`).

## Done — v6 / v6.1 (shipped + deployed; candidates for /clean → ARCHIVE)
Note-batch 1 (table + choices + feats):
- [x] Subclass "pick one" aligned under the subclass field (grid-column 2).
- [x] Picker chips show per-source `n/cap` counts, red when over forecast (D7).
- [x] Group header count next to label ("CANTRIPS 21"); toolbar aligned right.
- [x] Spell table: **Prepare-daily** multi-step modal (one step per non-static caster);
  removed the "show all eligible" toggle + inline row prepare (D8).
- [x] Shortened column values (Evoc./1m/Instant./ft); **Save/Atk chip column**;
  read-only preparation column with per-marker tooltips.
- [x] Choices source tag inline after the giver name.
- [x] **Epic-boon feats gated** to char level ≥19 as their own slot (D9).
- [x] Chip right margin fixed (× button kept UA default padding).
- [x] Subclass always-prepared spells no longer offered to their own class (D10).
Note-batch 2 (content system + deploy):
- [x] **Runtime content layer** — rebuildable indexes; slot tables moved into app.js;
  `assembleData()` merges baked/imported/custom; `pruneState()` drops stale build refs.
- [x] **Custom spell authoring** — stepped modal, Homebrew source + class tags,
  live preview, edit/delete from the detail modal (D11).
- [x] **5etools importer** — `extract.js` (Node-validated identical to extract.py:
  936/30/322/276/215, 0 errors); paste/file staging, source-lookup join.
- [x] **No-data build + onboarding**; `docs/` public build; **deployed to Pages** (D12).
- [x] Repo made public, `data/`+`dist/` untracked + **purged from all history**.
Note-batch 3 (v6.1 — SRD, budget rework, zip):
- [x] **SRD 5.2 embedded** in the public build (339 spells / 12 classes, CC-BY-4.0);
  extract.py emits `data-srd.json`, build.py inlines it into `docs/`; credit footer (D13).
- [x] **Per-level budget tiles reworked** — each level shows `picked / total` (how many of
  that level you can hold, up to your whole budget); max level badged; per-level over-flagging removed → free distribution (D14).
- [x] **.zip import** via native `DecompressionStream` (ported from monster-forge, no dep) (D15).
- [x] Onboarding is now a **modal** (pops on empty site; custom-spell option removed) (D16).
- [x] **Empty-search custom CTA** — "Create <query> as a custom spell", prefilled.
- [x] **🎲 random build hidden on the public build** (`window.__PUBLIC__`) (D17).

## Decisions (v6 → v6.6)
- **D7 (2026-08-26) Source counts in chips** — per-source `n/cap` on the take chips
  (cantrips vs prepared/known bucket), red over forecast. *Rejected:* per-source counts in the group toolbar (too complex for multi-source).
- **D8 (2026-08-26) Prepare-daily** — one modal step per **non-static** caster (daily +
  wizard spellbook); static "known" casters excluded. Removed table's inline prepare.
  *Caveat:* wizard step edits the known/spellbook list (model has no separate prepared subset).
- **D9 (2026-08-26) Epic boons** — category EB carved out; own dropdown + budget slot,
  gated to char level ≥19; general ASI now 4/8/12/16 (19 = the epic slot). *Rejected:* leaving EB in the general list.
- **D10 (2026-08-26) Always-prepared dedup** — a spell always-prepared via a class's own
  subclass/feature is not offered as a prepare option for that same class (pool entry `always` idx set).
- **D11 (2026-08-26) Custom spells** — stored as a toggleable "Homebrew" (HB) source;
  class-list tags drive eligibility; stepped modal (Identity/Mechanics/Lists+text) + live preview. *Rejected:* global always-on; per-build only.
- **D12 (2026-08-26) Deploy = app-not-data, this repo public + history purge** — `docs/`
  shell (no bundled data) on Pages; repo flipped public after force-pushing a
  filter-branch'd history with `data/`+`dist/` removed everywhere. *Rejected:* separate public repo; private+Pro; keep data in bundle.
- **D13 (2026-08-26) Embed SRD 5.2** — the public build ships the `srd52`-flagged subset
  (CC-BY-4.0, credit footer) so it's usable without importing; import adds the rest. Supersedes D12's "no data in public build" — SRD is licensed, safe to distribute.
- ~~**D14 (2026-08-26) Level budget = free distribution**~~ **SUPERSEDED → D18.** Free
  distribution was wrong for known/level-swap casters (a Bard learns spells on level-up
  capped at its top slot). Kept only for daily preparers.
- **D18 (2026-08-26) Per-spell-level caps for known casters** — `capsFor()` already
  computed the correct progressive ceiling `cap[L]` = max spells at level ≥ L (learn-on-
  level-up + one swap/level); D14 had stopped *using* it. Reconnected in `renderCart`
  (tile denom = live room addable at that level) and `compute` (`overLevels` flags a level
  over). Applies to `static` casters (Bard, Sorcerer) + wizard spellbook cap; **daily
  preparers (Cleric/Druid/Wizard-prepared/etc.) stay free** — only total + top slot bind.
  L8 Bard → IV 4 / III 9 / II 12 / I 12. *Rejected:* capping daily preparers too (not RAW);
  a fixed per-level quota (the D14-rejected pyramid). Enforcement stays soft (visual over-flag).
- **D20 (2026-08-26) Wizard spellbook model** — a third caster kind, distinct from daily &
  level-swap. `known.book`: the book grows a fixed amount per level, each addition ≤ current
  top slot → a **progressive per-level cap** (`known.cap[L]`, built from the `spellbook` growth
  array, no swap term). L8 Wizard book caps IV 4 / III 8 / II 12 / I 20. Exceeding a level's cap
  is **not an error** — it's the unique "copy into spellbook" option, shown as "copied" (accent,
  not red) with a "＋ Copy a spell into your book" button + a "+N copied" note. Prepared count
  (spell table) shown as info; a separate prepared-subset stays backlog. *Rejected:* flat free
  cap (D14-style — wrong for wizards); hard-blocking copies.
- **D21 (2026-08-26) Spell modal Access section** — each spell modal lists who grants it, per
  category (Classes/Subclasses/Species/Feats), as horizontal-scroll chip rows, edition-deduped
  (prefer newest via `srcRank`) from `sp.cls/sub/feat/race`. Empty categories omitted.
- **D22 (2026-08-26) Distinct description sub-headings** — a desc/higher paragraph that is a
  short "Title." (≤5 words, `_TITLE_RE`) renders as `.spttl` (accent, uppercase) instead of body.
  Render-time heuristic (the extractor emits named-entry titles as their own line); no re-extract.
- **D23 (2026-08-26) Level lists as ranges** — `fmtLevelList`/`fmtDesc` collapse "0;1;2" → "0-2"
  in grant descriptions (choices panel + pick modal). Render-time, so it covers baked + imported
  data without an extract change. **Note:** grant *feature names* (e.g. "Abjuration Savant") are
  NOT in the 5etools `additionalSpells` data (only 17/925 carry one) — the giver falls back to the
  **subclass name** ("Abjurer"), which is what shows now. True feature names would need a separate
  subclassFeature-correlation pass in extract.py (deferred → Backlog).
- **D24 (2026-08-26) Grant feature names** — extract.py/js build a feature index from each
  class file's `subclassFeature`/`classFeature` entries and match every additionalSpells grant
  back to the feature that describes it (same @filter, or a named @spell, else the sole
  spell-granting feature at that level; incl. table rows). ~93% named; rest fall back to the
  subclass name. app.js `resolveGrants.spellOut` now prefers `g.feature`/`p.feature` for the
  src label. Closes the D23 backlog item.
- **D24b (2026-08-26) Description sub-heading style = quiet label (option B)** — a short
  "Title." desc line renders as `.spttl`: muted, sans, 11px/600, **sentence case** (not the
  accent-uppercase of D22 — Francesco: "too flashy"; hierarchy was off). Body stays the primary
  ink prose; the higher-levels block keeps its dashed-rule separation. Mockup A/B/C → B chosen.
- **D26 (2026-08-26) Species & feats picker modals** — the species dropdown and the three
  feat dropdowns (origin/general/epic) became trigger buttons (`.picksel`) opening a shared
  `#entityModal` (`openEntityPicker(kind,category)` / `renderEntityList`): search + source-book
  filter + "grants spells" toggle, each row showing name + source + ✦ + a `grantPreview()` of
  what it grants; select commits (species = single, feats = multi). **Three entry points kept**
  (each pre-scoped to its feat category — Francesco's call). `grantPreview` skips empty-source
  fixed entries (was an extract innate-parsing artifact; fixed in v6.5a — the guard is harmless
  and stays as a belt-and-braces).
- **D25 (2026-08-26) Access collapsed by default** — the modal Access section shows one merged
  horizontal-scroll row of all sources inline with the label + a ⌄ expander that reveals the
  per-category line-up (`data-exp` toggle). Was always-expanded (D21).
- **D19 (2026-08-26) Edition de-duplication** — `buildIndexes` builds a `SHADOWED` set:
  group every class/subclass/feat/species/spell by identity (name; subclass = className+
  shortName), keep the highest-ranked (non-reprint beats reprint, then 2024 core `EDITION_RANK`
  XPHB/XDMG/XMM > 2014 PHB/DMG/MM > others), shadow the rest. `visible()` hides shadowed under
  the default `dedupe`; `reprint→all` reveals every edition. Homebrew (HB) never shadows / is
  never shadowed. *Note:* species named differently across editions (`Elf — Drow` vs `Elf (Drow)`)
  aren't collapsed (different names, deliberately not normalized).
- **D15 (2026-08-26) Zip import** — native `DecompressionStream('deflate-raw')` + manual ZIP
  central-directory walk (ported from monster-forge). No JSZip. `zipWanted` allows the spell-source-lookup under `generated/`.
- **D16 (2026-08-26) Onboarding = modal** — the import modal auto-pops (welcome mode) on an
  empty site; the custom-spell option was removed from it. (With SRD embedded, it now only fires on a truly-empty state.)
- **D17 (2026-08-26) Public build flag** — build.py injects `window.__PUBLIC__=1` in `docs/`;
  app hides the 🎲 random-build helper when set.

- **D27 (2026-08-26) Source selection is one global list, overridable per picker** — the
  ⚙ Sources modal (grouped checkboxes + Enable all / 2024 core only) is the single place
  books are chosen. Every picker (spells, feats, species) reuses **that same granular
  component**, seeded from `state.enabledSources`, with a local override that does not write
  back to the global setting. *Rejected:* named switchable presets (a preset manager is more
  UI than the problem needs); per-picker defaults stored in settings (three lists to keep in
  sync); keeping the one-line "any book" select (not the granularity Francesco asked for).
  Overrides are **not** sticky across sessions — a picker opens on the global selection.
- **D28 (2026-08-26) Optional features = every spell-granting type, filtered by source** —
  extract `optionalfeatures.json` generically (name, source, `featureType`, prerequisites,
  `additionalSpells`) plus each class/subclass's `optionalfeatureProgression`
  (`featureType` + per-level count), so slots are data, not per-type code. Nothing 2014-only
  gets special machinery: the existing source enablement + edition dedup (D19) decide what is
  visible. Findings that shaped this: **artificer infusions grant no spells at all**, so they
  are out by construction; the **2024 Artificer (EFA, 2025-12-09) has no
  `optionalfeatureProgression`**; 2024 pact boons became invocations, so XPHB EI already
  covers them. Spell-granting types present: EI 38, ED 12, PB 2, FS:P/FS:R 1 each.
  Raw note: *"All of them. Check the 2024 artificer, do not build 2014 only outdated elements"*.
  *Rejected:* invocations-only; invocations + pact boons only (the friction I raised — he
  overrode it, and the generic progression data made the per-type cost I feared not exist).
- **D29 (2026-08-26) Spell-table column rework** — order: prepare-marker · spell · save ·
  school · time · range · components · duration · conc · casts · source-in-build · source-book.
  ~~Components cell = **cost inline** (mockup B)~~ **SUPERSEDED → D32** (icon + colour, price in a popover). **Both source columns stay
  always-on** (Francesco overrode my "hide the book by default" — the table will scroll
  horizontally at narrow widths and that is accepted). The ⋯ overflow menu gets a **column
  checklist with drag-to-reorder**; the layout is a **global preference**, not per build.
  *Rejected:* quiet-letters (A) and material-chip (C) treatments; one merged source column;
  header-drag reordering; per-build or unsaved column state.
- **Note (2026-08-26):** the picker "design-system polish" backlog item was not a taste
  question — `.entrow .tk` never matched the chip rules, which were scoped to `.take .tk`,
  so the select buttons fell back to UA default styling. Fixed by unscoping `.tk`.

- **D30 (2026-08-26) Choices grouped by their granting entity** — `resolveGrants` carries an
  `owner {id,name,src,kind}` through nested option groups, so the choices panel groups every
  row a single entity produced (Magic Initiate's four rows become one block) and tags each
  row/group with its category (class · subclass · species · feat · optional feature). A lone
  choice keeps the flat row, with the tag added. *Rejected:* grouping by the composed giver
  label (breaks as soon as an option group renames the giver).
- **D31 (2026-08-26) Prerequisites are advisory, never prohibitive** — both extractors emit
  `prereqs`: one record per OR-alternative, splitting the checkable parts (level, feats,
  optional features, species, spellcasting, pact) from the display text. Ability scores,
  proficiencies, backgrounds and campaigns are **not modelled**, so an alternative carrying
  one resolves to "maybe" and can never read as a hard no. Pickers sort eligible entries
  first and dim the rest below a divider (opt-in "hide ones I can't take"); a picked entity
  whose prerequisites lapse gets a ⚠ chip and is **kept in the build**. Same path for feats
  and invocations. *Rejected:* hiding ineligible entries by default (would hide legal picks
  the app can't verify); blocking selection outright (enforcement everywhere else is soft).
- **D32 (2026-08-26) Material component moved to a popover** — the table's components cell is
  back to plain `V S M`, the M tinted gold (costly, kept) or accent (consumed); the material
  text and price live in a hover/tap popover on the M. Supersedes D29's cost-inline treatment
  (mockup B), which Francesco had picked and then reversed after seeing it in place: the price
  widened the column for a fact you rarely need mid-scan. *Rejected:* keeping cost inline.

- **D33 (2026-08-26) Sources stay global; each build *records* the list it was made with** —
  `enabledSources` hoists out of `state` into its own global key (alongside `spellForge.table.v1`),
  so D27 survives intact: the ⚙ Sources modal is still the single place books are chosen. Each
  build additionally stores `meta.sources` — the list it was authored under. Activating a build
  whose recorded list differs prompts *"this build expects X — switch your sources to match?"*.
  Nothing is ever pruned silently, which **dissolves T2's hazard by construction** (there is no
  bulk prune to get wrong) and gives T5's export its embedded source list for free.
  *Rejected:* sources travelling inside the build (contradicts D27; relocates T2's hazard rather
  than removing it); purely global with builds unaware of their books (a build reopened with a
  book off loses picks with no way to know what it expected — the exact failure T2 exists to prevent).
- **D34 (2026-08-26) Auto-save, plus versions — reverses the "no snapshots" non-goal** — every
  edit still writes through to the active build (no dirty state, no unsaved-changes guard, no way
  to lose work by closing a tab). On top of that a build can be saved as a **new version**, so one
  character can hold several sets of build choices side by side. This **overrides v7's stated
  non-goal "Level-up history/snapshots"** — Francesco's call, logged rather than smuggled in.
  Raw note: *"Auto-save + snapshot, builds should have versions (different build choices for the
  same character aggregated)"*. "Snapshot" and "new version" are **one action**, not two.
  *Rejected:* explicit save with a dirty indicator (three states to keep honest, a guard on every
  exit path, and a crash would start losing work the app currently can't lose).
- **D35 (2026-08-26) A version is a named copy; `character` is a label, not a container** — builds
  stay ONE flat list keyed by id; each build's meta carries a `character` string and the manager
  **groups the list by it**, so aggregation is a render concern, not a data hierarchy. The app never
  interprets whether a version is an alternative build or an older level — you name it. Duplicate
  keeps the character name, so **duplicating is how you create a version** (no separate command).
  Migration stays a one-liner: the existing blob becomes character "Wizard 8", version 1.
  *Rejected:* versions as explicit same-level variants (asserts a sameness that breaks the moment
  you level up and keep the old one); versions as an ordered level timeline (the non-goal proper —
  ordering rules, fork-on-edit semantics, the most machinery of the three); `characters:{…}` as a
  real container object (two objects to name and delete, a zero-version character state to define,
  roughly doubles T1 and T3).
- **D36 (2026-08-26) Export is a file; URL sharing is out of v7** — JSON download + file/paste
  import, with `meta.sources` embedded. Covers the actual risk (a build is one browser away from
  gone) with no size ceiling and no new failure mode. *Rejected:* a URL-hash-encoded build (a
  heavily-picked multiclass build exceeds what browsers and chat apps carry, so it needs
  compression **plus** a graceful "too big, export a file" fallback — roughly doubles T5);
  parking it as a named deferred task (it stays a non-goal, not a queue item).
- **D37 (2026-08-26) Relevel keeps every pick and flags it; no cap on builds** — duplicating a
  build then changing its level leaves `chosen`/`choices` untouched (they're keyed by row id and
  choice path); anything now over budget or above max spell level gets the **existing** soft
  over-flag. Consistent with D18 (over-cap levels flagged, not blocked) and D31 (lapsed
  prerequisites kept, not removed) — zero new machinery, and it **closes T6**. Separately, there
  is **no count cap**: a build is a few KB and the real constraint is the ~5 MB localStorage quota
  that imported data already dominates, so quota failures are caught on write and reported for
  what they are ("your imported book data is using most of the space"). *Rejected:* auto-dropping
  picks that no longer fit (silent destructive pruning, against the soft-enforcement stance);
  a "duplicate without picks" prompt (a decision at a fast-moving moment, and recoverable anyway);
  a soft warning past ~20 and a hard cap (arbitrary — eight characters × three versions is 24 and
  entirely reasonable).

- **D38 (2026-08-26) The spell table reads as a grid** — every column and its contents are
  **centre-aligned**, headers included; group headers stay left. Cells whose value was
  abbreviated to keep the column narrow (school/time/range/duration) restore the full text in a
  hover popover via `shortCell()`, and carry `cursor:help` so you can tell which ones will.
  The *"cantrips aren't prepared daily"* note beside the cantrip group header is gone — the ●
  marker's own popover already says it, and the note repeated it on every build.
- **D39 (2026-08-26) One source-book chip, and the book leaves the spell rows** — `bookChip()`
  + `.bchip` is now the single treatment everywhere a **printed book** is named (entity pickers,
  choices rows, spell-table `book` column, spell-modal title), promoted from the species/feat
  picker's version. `.entsrc` and `.csrc` are gone. Not to be confused with `.srcbadge`, which is
  a different object: who **grants** a spell in your build. The printed book is **removed from
  the eligible-spells rows** and now rides the **spell modal's title line** as that chip; the
  modal's × was also escaping its box (`.spmodal .box` had no `position`), so it now sits in the
  box's top-right. *Note:* the spell-**pick** modal's rows still show the book — left alone
  because the ask was scoped to the eligible list; say if it should follow.
- **D40 (2026-08-26) Eligibility is a default, not a wall** — two ways a spell you can't take
  still appears, always **dimmed**, never pickable, always tagged with why (*"not on your lists"*
  / *"filtered out"*): ① the class/list filter gained an **"every spell (ignore eligibility)"**
  option; ② **any search** surfaces every visible spell matching the name, including ones the
  other filters or your lists exclude — a name you typed and can't find is worse than one shown
  greyed with a reason. Dimmed entries sort below the eligible ones inside their level group, and
  the count reads `N spells · M dimmed`. Same treatment as a blocked feat in the pickers (D31).
  *Rejected:* a divider per level group (noise at ten groups); making them pickable (they aren't legal).
- **D41 (2026-08-26) A crossed prerequisite is a one-click fix** — a prerequisite part that names
  something concrete (a feat, an optional feature, a species, a pact) carries `pick` metadata, and
  clicking the ✗ chip opens a small popup offering to take it: **species swaps** (single-valued,
  and the popup says what it replaces), feats and optional features are added. Committing from a
  disabled book enables that book, mirroring the picker rule. Enforcement stays **soft (D31)** —
  this is a shortcut, never a gate; you can still select a blocked entry outright. Separately,
  an **unverifiable part no longer shows "?"** — the dashed border already says "can't check",
  and the mark read as a question being asked of you. *Rejected:* auto-taking the prerequisite
  when you select a blocked entry (silent state changes).

- **D42 (2026-08-26) Turning a book off flags picks, it never removes them** — `afterSourceChange()`
  used to strip every class, subclass, feat, optional feature and species whose book you had just
  disabled. With several builds that was the T2 hazard in a different coat, and it was already
  wrong on its own: unticking a book to browse is not a decision to delete half a character.
  It now prunes **nothing**; only `pruneState()` drops refs, and only to content that has ceased
  to exist. What remains is surfaced instead: a standing **gap banner** naming the books and the
  count, with one-click "Turn them on", and gold-flagged fields (`.gapped`) on the affected
  species / class rows. Two silent-rewrite bugs fell out of this and are fixed: `refreshSpecies()`
  cleared `state.speciesKey` outright, and a class row's `<select>` omitted its own class when
  hidden, so the browser fell back to the first option and the next edit **wrote a different
  class into the build**. Same rule now covers a manual source change and a build switch —
  one behaviour, not two. *Rejected:* pruning only the active build (the inactive ones then rot
  silently); asking on every source change (it is a browse action, not a commitment).

## Done — v6.5 / v6.6 (this session; all verified in-browser)
- [x] 🐛 **Innate-cast parsing** merged from `claude/zen-rhodes-4b15f8` — a cadence map under
  prepared/known/expanded is routed through `emit_cadence` instead of being read as a spell list.
- [x] 🐛 **Thunderclap range** — 2024's `emanation` shape was unhandled (69 spells rendered as a
  bare "emanation"); point ranges of type sight/unlimited also never reached their branch.
- [x] **Remove sidekicks** — Expert/Spellcaster/Warrior dropped in both extractors. 30 → 27 classes.
- [x] **Spell filters: upcast + consumed** — `comp` now carries `cost` (copper) + `consume`;
  Tags gained "Upcasts" and "Consumes mat.".
- [x] 🐛 **Prepare-state hover popover** — the markers had a native `title`, which reads as broken.
  New generic `attachTip()` reuses the styled `.sptip` popover.
- [x] **Picker design-system polish** — not a taste question: `.entrow .tk` never matched the chip
  rules (scoped to `.take .tk`). Unscoped; selected chips go red on hover.
- [x] **Source checklist shared by every picker** (D27) — `renderSourceChecklist()`/`srcQuick()`.
- [x] **Unified feat picker** (D27) — one picker, grouped "feat kind" row preset per slot but editable.
- [x] **Spell-table column rework** (D29) — registry + `cellFor()`, cost-inline components cell,
  ⋯ column checklist with drag-to-reorder, global preference under `spellForge.table.v1`.
- [x] **Optional features** (D28) — `optionalfeatures.json` extracted generically (213 records, 54
  spell-granting); slots come from `optionalfeatureProgression` on classes, subclasses **and feats**
  (Eldritch Adept, Metamagic Adept, Martial Adept). Picked features resolve grants like feats do.
- [x] 🐛 **Bare-list `innate` blocks** — `innate:{"_":["mage armor|xphb"]}` (the at-will shorthand)
  was skipped by the `isinstance(cadmap, dict)` guard, so 23 of 54 spell-granting optional features
  produced nothing. Fixed in both extractors → 54/54. **This also affected feats/species/classes
  using the same shorthand**, so some grants that were silently missing now appear.

### v6.6 — Francesco's second batch (2026-08-26)
- [x] **Components cell back to icon + colour**; material text + price in a popover on the M,
  tap-to-show on touch, Esc / outside click to dismiss (D32).
- [x] **Feat pickers show what you still owe** at this level — budget pills (origin / general /
  epic boon, or the slot's own count for optional features).
- [x] **Choices grouped by granting entity** + category tag on every row/group (D30).
- [x] **"In build" column renamed to Source** (`book` remains the printed book).
- [x] **Always-prepared block** is a real title with a muted explainer; "free" removed — it read
  as at-will.
- [x] **Prerequisites** end-to-end (D31) — extracted for feats *and* optional features, evaluated
  against the build, eligible-first ordering with a dimmed blocked section, ⚠ on picked entities
  whose prerequisites lapse.
- [x] **Feat kind always offers Epic boon**, unselected below level 19.
- [x] **Books / grants-spells / feat-kind moved into a per-picker overflow menu**, with a count
  badge when any filter is off its default.
- [x] **v7 planned** — see "Next phase" (shape, six tasks, four gating decisions).

## Done — v7 tasks + note batches (2026-08-26; all verified in-browser)
Saved builds — **T1** storage + migration · **T3** manager UI · **T2** activation
reconciliation. Each task line under "Next phase" carries its own verification notes.
Note-batch 1 (prerequisites, popovers, chrome):
- [x] **Prerequisite section title removed**; prerequisites render as per-part **verdict chips**
  visually distinct from the grants line. Level is verified and flagged (D31 extended).
- [x] **Extractors emit `checks`** — the unverifiable parts of a prerequisite kept separate, so
  the checkable ones get a real pass/fail instead of one undifferentiated "check …".
- [x] **Material popover** → Cost / Consumed chip / Material, with the price-and-consume
  restatement stripped from the material text (trailing clauses only; mid-sentence ones say
  *which* component is spent and are left verbatim).
- [x] 🐛 **`color-scheme` was missing entirely** — native scrollbars followed the OS, not the
  theme toggle. Set in all three theme blocks + themed WebKit scrollbars.
- [x] 🐛 **Carets are drawn, not typed** — `⌄` sat wherever its font put it; `.pk-caret` and
  `.acc-toggle` now draw a border chevron, optically centred by construction.
- [x] **Access section** hides its horizontal scrollbar; the expander is pinned right and
  centred on the label.
- [x] **Picked filter** in both spell modals (pick + prepare), with a count badge.
Note-batch 2 (the spell list and table):
- [x] **"Every spell (ignore eligibility)"** option on the class/list filter (D40).
- [x] **Searches surface near-misses dimmed**, tagged "not on your lists" / "filtered out" (D40).
- [x] **One source-book chip** (`.bchip`) everywhere a printed book is named (D39).
- [x] **Book removed from the eligible-spell rows**, moved to the spell modal's title line; the
  modal's **× was escaping its box** (no `position` on `.box`) — fixed.
- [x] **Spell table centred**; abbreviated values restore in a hover popover (D38).
- [x] **Cantrip group note removed** — the ● marker's popover already said it (D38).
- [x] **"?" dropped from unverifiable prerequisite chips**; the dashed border carries it (D41).
- [x] **Crossed prerequisites are actionable** — click to take the feat / option / species,
  species swapping in place (D41).

## Next phase — v7: saved builds

One character at a time is the last hard limit in the app. Everything else (content,
sources, columns) is already multi-valued; the build isn't.

### What exists now
`state` is a single blob in `localStorage["spellForge.v2"]`: `classes, speciesKey, feats,
optFeats, chosen, choices, enabledSources, filters, nextRowId`. Alongside it sit three
other keys that are **not** part of a build: `spellForge.table.v1` (column layout),
`spellForge.custom.v1` (homebrew spells), `spellForge.import.v1` (imported 5etools data).

### Shape  *(settled by D33–D37)*
```
spellForge.builds.v1  = { activeId, order:[id…], builds:{ id: {meta, state} } }
meta = { name, character, created, updated, summary, sources:[…] }
       // name      = the version's name ("Evocation", "L3")
       // character = the grouping label (D35) — versions of one character share it
       // summary   = "Wizard 8 · Evocation", derived
       // sources   = the book list this build was authored under (D33)
spellForge.sources.v1 = [ …enabledSources… ]     // hoisted OUT of `state` (D33)
```
`state` keeps its current shape verbatim inside each build **minus `enabledSources`**, so
`save()`/`load()` become "save/load the active build" and nothing else downstream changes.
Homebrew, imported data and the column layout stay global — they're content and preferences,
not character sheets. Sources join them, but every build remembers what it expected.

### Tasks
- [x] **T1 · storage + migration** (`model`, ~M) — **DONE 2026-08-26.** New keys, `activeBuild()`,
  `enabledSources` hoisted out of `state` to `spellForge.sources.v1` (D33), and a one-time
  migration that lifts the existing `spellForge.v2` blob into build #1. `save()` is now
  "auto-save the active build" (D34): it re-derives `meta.summary`, stamps `updated`, and records
  `meta.sources` = the list the build was last seen under. The legacy key is left untouched as a
  one-release rollback. *Verified in-browser:* migrated session → build "Wizard 8 / v1" with
  classes + picks intact, `meta.sources` = its 43 books, `state` no longer carrying
  `enabledSources`, `spellForge.v2` still present; reload idempotent (`BOOT_MODE` "loaded", one
  build); wiped session → exactly one empty build, sources default all-on; source changes persist
  globally **and** update `meta.sources`. `meta.character` is a **level-free** label
  ("Bard / Wizard") that auto-follows the build until `meta.named` is set — T3 sets it on rename.
- [x] **T2 · activation reconciliation** (`correctness`, ~S) — **DONE 2026-08-26.** On activation,
  compare the build's `meta.sources` against the live global list and offer to switch rather than
  prune. **Done when:** activating a build authored under other books prompts instead of silently
  dropping picks, and declining leaves the build intact with its unresolved picks flagged, not
  removed. *Built as `#srcAskModal`.* It asks **only about books the build's picks actually depend
  on** (`buildGaps().books`) — a book it merely had enabled changes what you can browse, not what
  it holds, and listing all 42 of those was noise. The dialog names each book with its
  affected-pick count and says plainly that nothing is removed either way. Declining activates the
  build whole and raises the **gap banner** (`#gapBar`). See **D42** — the same flag-don't-prune
  rule now also governs turning a book off by hand. *Verified in-browser:* a Wizard build carrying
  a TCE feat, activated under "2024 core only" → dialog names TCE / 1 pick → **Keep my books**
  activates with the feat and its two pending choices intact plus the banner; **Turn them on**
  enables TCE and clears the banner; disabling a book by hand keeps an `Aarakocra|DMG` species
  (field reads "Aarakocra · DMG is off") and an `Artificer|TCE` class row whose select still
  resolves to itself.
- [x] **T3 · manager UI** (`ui`, ~M) — **DONE 2026-08-26.** One flat list **grouped by `character`** (D35), each row
  name + summary + last edited; switch, rename (version and character), duplicate, delete
  (confirm), new. Duplicate keeps the character name — that *is* "save as new version" (D34),
  one action, not two. **Done when:** every operation works from one surface and the active
  build is unmistakable. *Built as `#buildModal`, reached from the ⋯ menu ("Builds…").* Names are
  **inline inputs** that look like text until touched — no edit mode to enter or leave; editing a
  character name rewrites every version under it and sets `meta.named`, which stops the
  auto-follow. Active build = accent left-bar + tint + a `current` chip. *Verified in-browser:*
  switch loads the other build's state; version rename → "Evocation"; character rename → "Thalia"
  applied to all three versions; delete moves the active to a neighbour; **deleting every build
  never leaves zero** — a fresh empty one is created. All of it survives a reload.
  ⚠ Switching is deliberately **non-destructive**: nothing is pruned on activation, so a build
  authored under other books keeps its picks. The reconciliation prompt is **T2**.
- [ ] **T4 · switcher** (`ui`, ~S). Getting between builds without opening the manager.
- [ ] **T5 · export / import a build** (`data`, ~M). A build is currently one browser away
  from gone — localStorage, one device, no backup. JSON download + file/paste import, carrying
  `meta.sources` so an imported build tells you which books it expects (D36 — file only, no URL).
  **Done when:** a build survives a round trip through a file on another machine.
- [ ] **T7 · storage-pressure reporting** (`data`, ~S). No count cap (D37); instead catch the
  quota failure on write and name the real cause. **Done when:** a failed save says what is
  using the space, not "something went wrong".
- [x] ~~**T6 · budget/choice reset semantics**~~ **Closed by D37** — picks survive a relevel
  untouched and the existing soft over-flag does the rest. No new machinery.

### Decisions that shaped v7 — all settled 2026-08-26
D33 sources · D34 auto-save + versions · D35 version shape · D36 file-only export ·
D37 relevel + no cap · D42 flag-don't-prune. See the Decisions section above.
**Nothing gates the remaining tasks.**

### Non-goals
~~Level-up history/snapshots~~ — **superseded by D34/D35**: versions exist, but as *named copies*
the app never orders or interprets. A true level-by-level timeline (ordering rules, fork-on-edit)
stays out. Server sync or accounts. Sharing a build as a rendered page, or via a URL (D36).

## Backlog (next sessions)
### v6.5 / v6.6 leftovers
- [x] ~~**Feat prerequisites are display-only**~~ Done (D31) — extracted, evaluated and surfaced
  for feats and optional features. Enforcement stays **advisory by design**, not an omission.
- [ ] **Prerequisites we can't check**: ability scores, proficiencies, backgrounds and campaigns
  aren't in the app's model, so those alternatives read "check …" rather than pass/fail. Closing
  this means tracking ability scores — a bigger change than it looks. ⚑ (owner: Francesco, 2026-08-26)
- [ ] **Feat budget attribution when categories are crossed** — a general slot holding an origin
  feat still counts against `origin`, so the budget pill can read `origin 2/1`. Soft-flagged only.
- [ ] **Ability column** wasn't in Francesco's column order; kept visible in place so the table
  didn't regress. Confirm whether it should default to hidden.
### earlier
- [ ] **IndexedDB** for imported data — localStorage may overflow on a full multi-book import (importer reports quota errors but can't store).
- [ ] Importer UI polish — a "clear imported data" button, per-source enable after import, a preset-library manager (monster-forge style ticking).
- [ ] Wizard prepare-daily: separate **prepared subset** from the spellbook/known list (partly
  addressed by D20 — book cap + copy modelled; the daily prepared *subset* pick is still flat).
- [x] ~~**Grant feature names** — correlate `additionalSpells` to subclassFeatures.~~ Done (D24, ~93%).
- [x] ~~🐛 **Innate-cast parsing** — phantom "Daily"/"Rest" grants from feats' innate blocks.~~
  Done — merged from `claude/zen-rhodes-4b15f8`, plus a second bug found on top (bare-list `innate`).
- [ ] Custom-spell **manager** (list all homebrew to edit/delete without opening each).
- [x] ~~Feature names for 2024 blocks (Lore's "Magical Discoveries" → subclass name fallback).~~ Done (D24).
- [ ] High Elf true in-table cantrip swap; Human extra-origin restricted to origin cats.
- [x] ~~Per-source subclass de-duplication in the picker (2014 + 2024 both show).~~ Done (D19).

## Gotchas
- **Content assembly:** `window.__DATA__` (baked) is optional now. `assembleData()` picks
  imported > baked > empty, merges custom homebrew, calls `buildIndexes()`. Indexes
  (CLS_BY, SPELL_BY, …) are `let`, rebuilt on every content change — never captured.
- **extract.js ↔ extract.py** must stay in sync (same digest shape). `asArr`/coerced
  `parseGrants` handle 5etools bare-value-instead-of-list quirks.
- **Spell-source lookup** (`generated/gendata-spell-source-lookup.json`) is what gives spells
  their `cls`/`sub`/`feat`/`race` access — without it imported spells match no class.
- **Homebrew source = "HB"**; auto-enabled on boot when custom spells exist.
- **SRD subset** = entities with 5etools `srd52` truthy (extract.py `_srd_subset`). All 12
  XPHB classes are srd52. Public data is inlined in the committed `docs/index.html` (CC-BY,
  fine to be public); `data-srd.json` itself is gitignored. Keep the credit footer for CC-BY compliance.
- **Level budget model (D18):** known/level-swap casters (`static` — Bard, Sorcerer) have a
  *progressive* per-level ceiling from `capsFor().cap[L]` (= max spells at level ≥ L); tiles show
  live room addable at each level, and `overLevels[L]` flags a level over. Daily preparers
  (`static=false`) are free — only the total + max castable level bind. Wizard spellbook = flat
  known total. Enforcement is soft (red flag, no hard block), matching `spellOver`.
- **Edition dedupe (D19):** `SHADOWED` (WeakSet, rebuilt each `buildIndexes`) hides duplicate
  editions of the same element; `reprint→all` filter reveals them. HB never participates.
- **Static preview cache:** editing `src/index.html` needs a hard reload (query-bust) —
  a plain reload serves stale HTML and new `$("#…")` lookups return null. Editing it also
  re-opens a `file://`/`data:` preview tab and fronts it — drive the `http://localhost` tab.
- Grants tree `{fixed, picks, expansions, optionGroups, ability}`; path-based choice ids stable.
- Cart/choices keyed by stable row id (`state.nextRowId`), never array index.
- **History purge:** old data-bearing commits are unreachable on origin but GitHub may
  still serve them by exact SHA until it gc's. `backup/pre-purge-20260826` (local) has the original.
- **`innate` has two shapes.** `{"_": {"daily": {...}}}` (a cadence map) AND `{"_": ["mage armor|xphb"]}`
  (a bare list = at-will). The list form was skipped by an `isinstance(dict)` guard, silently
  dropping **42 grant blocks** (23 optional features, 9 subclasses, 9 species, 1 class). Both
  extractors handle both now — if grants ever go missing, check this first.
- **Prerequisites are advisory (D31).** `prereqState()` returns ok/maybe/no; "maybe" means the
  app can't verify (ability scores, proficiencies, backgrounds). Never turn "maybe" into "no" —
  it would hide legal picks. Nothing is ever blocked or auto-removed, only flagged.
- **Column layout is global**, under its own key `spellForge.table.v1` — NOT part of the build
  blob. Adding a column means adding it to both `TABLE_COLS` and `COL_ORDER_DEFAULT`;
  `loadTableOpts` appends unknown-but-new keys so an old saved order doesn't hide a new column.
- **Picker book overrides can widen** past the global source list. Committing a pick from a
  globally-disabled book **enables that book** — otherwise `afterSourceChange()` prunes the pick
  straight back out. The spell filter's override can only narrow (the pool is already gated).
- **Test the extractors in Node, not by eye:** `scratchpad/valid.js` walks the mirror and diffs
  `extract.js` against `data/data.json`. Ignore its class/subclass counts — its walker also
  feeds `foundry.json`, which extract.py never reads; spells/feats/races/optfeats are the
  meaningful columns.
- **Extractor parity: exclude `foundry*.json`.** The Node harness walker feeds every `.json` in
  the mirror, including `foundry-feats.json` etc. which extract.py never reads — those overwrite
  real entries by `name|source` and manufacture ~39 false diffs. Filter them out and parity is
  **exact**: 276/276 feats, 213/213 optional features, prereqs byte-identical.
- **Native scrollbars follow `color-scheme`, not your CSS.** The "light scrollbar in dark mode"
  bug was a missing `color-scheme` on `:root` — the UA painted OS-themed scrollbars while the
  `data-theme` toggle changed only the custom properties. `color-scheme` is now set in all three
  theme blocks (`:root` light, the `prefers-color-scheme:dark` block, `[data-theme=dark]`), plus
  themed `::-webkit-scrollbar` rules. Any new theme block must set it too.
- **Carets are drawn, not typed.** `⌄` (U+2304) sits wherever its font puts it, which is what made
  picker/access icons read as off-centre. `.pk-caret` and `.acc-toggle` now draw a border chevron
  nudged up by `s·√2/4` (the ink of a rotated square lives in its lower half). Reuse that pattern
  rather than a glyph when an icon must sit optically centred.
- **Builds layer (T1, D33–D35).** `spellForge.builds.v1` = `{activeId, order, builds:{id:{meta,state}}}`;
  `spellForge.sources.v1` is the **global** book list — `SRC`, a module-level Set, NOT `state`.
  Nothing may put sources back inside a build. `save()` = auto-save the active build. `meta.character`
  is a grouping label only (level-free, auto-follows until `meta.named`). Legacy `spellForge.v2` is
  read once for migration and then left alone as a rollback — do not delete it before v7 ships.
- **Build manager (T3).** `#buildModal` from the ⋯ menu. Grouping by `meta.character` is a
  **render-time** concern (D35) — never build a character object. `switchBuild()` flushes the
  outgoing build with `save()` first, then `applyState()`; it calls `pruneState()` (drops refs to
  content that no longer EXISTS) but never `afterSourceChange()` (source-gated pruning) — that
  asymmetry is deliberate and is what makes switching non-destructive until T2 lands.
  `deleteBuild()` must never leave zero builds; it creates a fresh one instead.
- **`.bchip` vs `.srcbadge`** — `.bchip` (D39) names the **printed book**; `.srcbadge` names
  **who grants** the spell in your build and is colour-coded (free / cast). They look similar and
  are not interchangeable.
- **Dimmed spell rows (D40)** carry `dim:true` and a `why`, and have **no takers** — `mkSpell`
  returns early for them, so they can never be picked. If a dimmed row ever grows a take button,
  that early return has been broken.
- **Nothing prunes on a source change any more (D42).** `afterSourceChange()` only fixes the
  filter override; `pruneState()` drops refs to content that no longer EXISTS. If a pick ever
  disappears when you untick a book, something has re-added pruning. The visible contract is the
  gap banner (`renderGapBar`) plus `.gapped` fields — keep those in sync with any new pick kind.
- **A `<select>` must always contain its own current value.** `classOptions(keep)` and the
  subclass list take the row's key so a hidden entry stays selectable; without that the browser
  silently selects option 0 and the next edit writes the wrong class into the build.

⟳ Rename previous session → "Saved builds (T1–T3) and UI note batches"  · session: resolve by cwd + latest
