# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. History → git log.

## TL;DR (2026-08-26 · commit 34ea6f2 · v6.6 · **LIVE on GitHub Pages**)
- **State:** working, committed + **pushed** (clean tree). This session cleared the whole
  **v6.5 backlog** and then a second batch of Francesco's notes (**v6.6**): innate-cast fix
  merged; `emanation` ranges; sidekicks dropped; upcast/consumed filters; styled prepare-marker
  popover; **shared source checklist** in every picker; **one unified feat picker**;
  **spell-table column rework** (registry + drag-to-reorder, global preference);
  **optional features** (invocations/metamagic/pact boons, slots from data);
  **prerequisites** end-to-end (extract → evaluate → sort → flag); **grouped choices** with
  category tags; picker **overflow menus** + budget pills. Decisions D27–D31.
  All verified in-browser; extract.py ↔ extract.js parity re-validated in Node.
- **Next action:** **v7 · saved builds** — start at **T1 (storage + migration)**, but the
  four 🔶 decisions under "Next phase" gate it. Ask them first (the source-ownership one
  conflicts with D27 and needs Francesco's call). **Done when:** an existing session reloads
  into a named build with nothing lost, and a fresh session gets one empty build.
- **Manual for Francesco:** ① 🔶 Four decisions gate v7 T1 — see "Next phase → Decisions
  needed". ② Optional — ask GitHub Support to gc so the *old* unreachable commits (SHA
  2c8bbb6 etc., held only in `backup/pre-purge-20260826` locally) stop being SHA-addressable.
  ③ To update the live site: `python3 extract.py` (if data changed) → `python3 build.py` →
  commit → push (Pages serves `main:/docs`). ④ `dist/`, `data/`, `data-srd.json` are
  gitignored (local only); public SRD data is inlined in committed `docs/`.
  ⑤ **The bare-list `innate` fix changes existing builds** — 42 grant blocks that were
  silently dropped now resolve, so a saved build may gain spells it should always have had.

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

## Next phase — v7: saved builds

One character at a time is the last hard limit in the app. Everything else (content,
sources, columns) is already multi-valued; the build isn't.

### What exists now
`state` is a single blob in `localStorage["spellForge.v2"]`: `classes, speciesKey, feats,
optFeats, chosen, choices, enabledSources, filters, nextRowId`. Alongside it sit three
other keys that are **not** part of a build: `spellForge.table.v1` (column layout),
`spellForge.custom.v1` (homebrew spells), `spellForge.import.v1` (imported 5etools data).

### Shape
```
spellForge.builds.v1 = { activeId, order:[id…], builds:{ id: {meta, state} } }
meta = { name, created, updated, summary }      // summary = "Wizard 8 · Evocation", derived
```
`state` keeps its current shape verbatim inside each build, so `save()`/`load()` become
"save/load the active build" and nothing downstream changes. Homebrew, imported data and
the column layout stay global — they're content and preferences, not character sheets.

### Tasks
- [ ] **T1 · storage + migration** (`model`, ~M). New keys, `activeBuild()`, and a one-time
  migration that lifts the existing `spellForge.v2` blob into build #1 named from its classes.
  Keep the old key untouched for one release as a rollback. **Done when:** an existing session
  reloads into a named build with nothing lost, and a fresh session gets one empty build.
- [ ] **T2 · pruning hazard** (`correctness`, ~S). ⚠ `pruneState()` and `afterSourceChange()`
  currently mutate the one live build. With several, disabling a book would quietly strip
  picks from **inactive** builds too — or, if we only prune the active one, an inactive build
  silently holds refs to content that no longer resolves. **Prune on activation, never in
  bulk**, and show what was dropped. **Done when:** switching sources can't damage a build
  you aren't looking at, and activating a build reports what it lost.
- [ ] **T3 · manager UI** (`ui`, ~M). List with name, summary, last edited; switch, rename,
  duplicate, delete (confirm), new. **Done when:** every operation works from one surface and
  the active build is unmistakable.
- [ ] **T4 · switcher** (`ui`, ~S). Getting between builds without opening the manager.
- [ ] **T5 · export / import a build** (`data`, ~M). A build is currently one browser away
  from gone — localStorage, one device, no backup. JSON download + file/paste import, with
  the source list embedded so an imported build tells you which books it expects.
  **Done when:** a build survives a round trip through a file on another machine.
- [ ] **T6 · budget/choice reset semantics** (`model`, ~S). Duplicating a build then changing
  its level: `chosen`/`choices` are keyed by row id and choice path, so they survive — confirm
  that's wanted, or offer "reset picks" on duplicate.

### 🔶 Decisions needed before T1 (these change the model, not just the UI)
- **Does a build own its source selection?** `enabledSources` is inside `state` today, so it
  would travel per build — a 2014 character and a 2024 one could each carry their own books.
  The alternative is hoisting it out as a global preference, which matches D27's "one place
  books are chosen". These two readings conflict; **D27 wins by default unless overridden.**
- **Auto-save or explicit save?** Today every edit writes through. Auto-save into the active
  build is the smaller change and keeps the app honest; explicit save needs a dirty state,
  a discard path and an "unsaved changes" guard.
- **Is sharing in scope?** A URL-encoded build (compressed into the hash) would make builds
  shareable without a server, at the cost of a size ceiling. File export alone is simpler and
  covers backup, which is the actual risk.
- **Cap on builds?** localStorage is ~5 MB and already carries imported data; a build is a
  few KB, so the cap is really about the list staying readable, not about bytes.

### Non-goals
Level-up history/snapshots. Server sync or accounts. Sharing a build as a rendered page.

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

⟳ Rename previous session → "v6.5 and v6.6: optional features, prerequisites, columns"  · session: resolve by cwd + latest
