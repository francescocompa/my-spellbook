# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. History → git log.

## TL;DR (2026-08-26 · commit cbf150d + uncommitted v6.2 fixes · **LIVE on GitHub Pages**)
- **State:** working. v6.1 (SRD embed, importer, custom spells, Pages) **plus**
  two uncommitted fixes this session (v6.2, in `src/` + rebuilt `dist`/`docs`, **not
  yet committed/pushed**): ① **per-spell-level caps reconnected** for known/level-swap
  casters — an L8 Bard now shows IV 0/4, III 0/9, II/I 0/12 (was a flat 0/12 on every
  tile); daily preparers stay free. ② **edition de-duplication** — same-named classes/
  subclasses/feats/species/spells collapse to the newest edition (2024 XPHB wins), so
  pickers no longer list Bard/Lore/Life twice; "show all editions" via the reprint→all
  filter is the escape hatch. Both verified in-browser (L8 Bard + L8 Cleric).
  Follow-up batch (same v6.2): **wizard spellbook** now a progressive per-level book cap
  (fixed growth, no retrain) + a **copy-beyond-limits** option (extra shows as "copied",
  not an error); spell modal gained an **Access** section (class/subclass/species/feat
  chips, horizontal-scroll, edition-deduped); description **sub-headings styled distinctly**;
  grant level lists render as **ranges** (0-2 not 0;1;2). All verified in-browser.
- **Next action:** commit + push v6.2 to deploy (see Manual ②), then pick from Backlog
  (likely **IndexedDB** for imported data — localStorage may overflow on a full import).
- **Manual for Francesco:** ① Optional — ask GitHub Support to gc so the *old*
  unreachable commits (SHA 2c8bbb6 etc., held only in `backup/pre-purge-20260826`
  locally) stop being SHA-addressable on GitHub. ② To update the live site:
  `python3 extract.py` (if data changed) → `python3 build.py` → commit → push
  (Pages serves `main:/docs`). ③ `dist/`, `data/`, `data-srd.json` are gitignored
  (local only); the public SRD data lives inlined inside the committed `docs/index.html`.

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

## Done (this session — v6)
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

## Decisions (this session)
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

## Backlog (next sessions)
- [ ] **IndexedDB** for imported data — localStorage may overflow on a full multi-book import (importer reports quota errors but can't store).
- [ ] Importer UI polish — a "clear imported data" button, per-source enable after import, a preset-library manager (monster-forge style ticking).
- [ ] Wizard prepare-daily: separate **prepared subset** from the spellbook/known list (partly
  addressed by D20 — book cap + copy modelled; the daily prepared *subset* pick is still flat).
- [ ] **Grant feature names** — correlate `additionalSpells` to subclassFeatures in extract.py so
  grants show e.g. "Abjuration Savant" instead of the subclass name (D23; only 17/925 have names now).
- [ ] Custom-spell **manager** (list all homebrew to edit/delete without opening each).
- [ ] Feature names for 2024 blocks (Lore's "Magical Discoveries" → subclass name fallback).
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
