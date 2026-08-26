# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. History → git log.

## TL;DR (2026-08-26 · commit cbf150d · v6.1 · **LIVE on GitHub Pages**)
- **State:** working v6.1, committed + deployed. v6 (content system, importer,
  custom spells, Pages deploy) **plus** this session: public build now embeds the
  **SRD 5.2** subset (usable out of the box, CC-BY footer), reworked per-level
  budget tiles (free distribution), **.zip** import, and an empty-search custom-spell
  CTA. All verified in-browser and on the live site.
- **Next action:** none forced — pick from Backlog. Likely first: move imported
  data to **IndexedDB** (localStorage may overflow on a full multi-book import).
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
- Dev: `python3 -m http.server 8000` → `http://localhost:8000/src/index.html`
  (**hard-reload after editing index.html** — the static server caches it; a plain
  reload can serve stale HTML and null-out new elements).
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
- **D14 (2026-08-26) Level budget = free distribution** — per-level tiles show `pickedAtL / total`
  (each level can hold up to your whole prepared/known budget); only the total + max spell level bind. *Rejected:* the old best-case per-level quota (read as a forced pyramid); mockup concepts A/B/C (Francesco: "show how many of that level I can have").
- **D15 (2026-08-26) Zip import** — native `DecompressionStream('deflate-raw')` + manual ZIP
  central-directory walk (ported from monster-forge). No JSZip. `zipWanted` allows the spell-source-lookup under `generated/`.
- **D16 (2026-08-26) Onboarding = modal** — the import modal auto-pops (welcome mode) on an
  empty site; the custom-spell option was removed from it. (With SRD embedded, it now only fires on a truly-empty state.)
- **D17 (2026-08-26) Public build flag** — build.py injects `window.__PUBLIC__=1` in `docs/`;
  app hides the 🎲 random-build helper when set.

## Backlog (next sessions)
- [ ] **IndexedDB** for imported data — localStorage may overflow on a full multi-book import (importer reports quota errors but can't store).
- [ ] Importer UI polish — a "clear imported data" button, per-source enable after import, a preset-library manager (monster-forge style ticking).
- [ ] Wizard prepare-daily: separate **prepared subset** from the spellbook/known list.
- [ ] Custom-spell **manager** (list all homebrew to edit/delete without opening each).
- [ ] Feature names for 2024 blocks (Lore's "Magical Discoveries" → subclass name fallback).
- [ ] High Elf true in-table cantrip swap; Human extra-origin restricted to origin cats.
- [ ] Per-source subclass de-duplication in the picker (2014 + 2024 both show).

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
- **Level budget model:** distribution across spell levels is free — the only limits are the
  total (prepared/known) and the max castable level. Tiles show `pickedAtL / total`; no per-level over-flag.
- **Static preview cache:** editing `src/index.html` needs a hard reload (query-bust) —
  a plain reload serves stale HTML and new `$("#…")` lookups return null. Editing it also
  re-opens a `file://`/`data:` preview tab and fronts it — drive the `http://localhost` tab.
- Grants tree `{fixed, picks, expansions, optionGroups, ability}`; path-based choice ids stable.
- Cart/choices keyed by stable row id (`state.nextRowId`), never array index.
- **History purge:** old data-bearing commits are unreachable on origin but GitHub may
  still serve them by exact SHA until it gc's. `backup/pre-purge-20260826` (local) has the original.

⟳ Rename previous session → "Content system, importer, Pages deploy, SRD"  · session: resolve by cwd + latest
