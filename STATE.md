# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. History → git log.

## TL;DR (2026-08-26 · commit 2c8bbb6 + **uncommitted working tree** · v5)
- **State:** working v5. Three note-batches implemented and verified in-browser
  (class UI, table rework, choices engine, casting stats, Magical Secrets cap,
  Wizard known-tracking, monster-forge text/ability colours, all-feats + feat
  budget). `extract.py` re-run against the mirror → data.json now carries all
  feats + feature names. 7 files modified, **not yet committed**.
- **Next action:** commit the working tree (branch first — on `main`), then pick
  from Backlog. Ask Francesco before committing/pushing.
- **Manual for Francesco:** ① commit/push is yours to approve (repo still
  local-only — no remote). ② To republish the Artifact, rebuild happens here but
  publishing is the Drive-path step. ③ Optional: delete superseded files in
  `D&D/Strumenti & Manuali/Spell Eligibility Forge/` (see its MOVED.md).

## What this is
Offline single-page D&D 2024 spell planner. Canonical source = this repo.
`dist/index.html` is the built, self-contained deliverable (~1.95 MB after
all-feats data). Artifact URL:
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0
(published from `D&D/Strumenti & Manuali/Spell Eligibility Forge/index.html` in
Drive — that path is kept only to preserve the URL; republish it there to update).

## Build / run
- Dev: `python3 -m http.server 8000` → `http://localhost:8000/src/index.html`
- Data refresh: `python3 extract.py` (mirror default = `~/Documents/D&D/5etool_mirror/5etools-v2.33.3/data`), then `python3 build.py`
- Verify gate (no test suite): `python3 -c "import ast;ast.parse(open('extract.py').read())"`,
  `node -e "new Function(fs…app.js)"`, `json.load(data.json)`. All green this session.
- **Browser test:** header 🎲 button populates a random build (local-only).

## Done (this session — v5, 3 note-batches)
Batch 1 — build/table foundations:
- [x] Divine Order/Primal Order as an **order choice** before the cantrip (may pick order w/o cantrip).
- [x] **Magical Secrets** = cap + track non-Bard prepared (see D1). EK false-positive fixed (D1).
- [x] Removed manual extra-spell steppers; picks count against source limit, over-cap flagged (D2).
- [x] Table rework: always level-grouped + optional outer group (ability/source); **Ability column** (colours); indicators **✓ always / ● prepared / ○ eligible / ✦ innate**; per-level tally; `1/LR*` w/ "also with slots"; group-by + show-all moved to a ⋯ menu.
- [x] Recharge chips `1/LR` / `at will`; level-tile click → level-filtered prepare modal; pick modal subtitle + level filter.
Batch 2 — polish + engine:
- [x] Class tile = class **dropdown** (change class resets subclass, keeps level); × at labels row; subclass alert caption.
- [x] **Wizard known tracking** (D4): Known meter + per-level tiles from spellbook growth.
- [x] **Magical Secrets source filter**; choices show source; per-level **hover toolbar** (D5); cart-chip spell popovers; monster-forge **ability colours** + **spell text highlights** (`cc-*`).
Batch 3 — final:
- [x] `extract.py`: **all feats** (spell + non-spell, `hasSpells` flag) + **feature names** from `additionalSpells` block `name`; data regenerated.
- [x] **Feat budget** (origin + general ASI slots, Human extra origin) + separate Origin-feat pick (D6).
- [x] Divine Order cantrip inherits class ability (no longer "Other casting"); High Elf swappable cantrip shows ● in table; source shown as abbreviated chip; caster-type notes moved to kind-chip tooltip; "pick one" no longer displaces field; add-class regular colour.

## Decisions (this session)
- **D1 (2026-08-26) Magical Secrets** — model as a cap: non-own-list prepared spells ≤ (prepared gained since onset) + (retrains since onset), flagged over. Lore's L6 picks stay discrete choices. Only expansions whose `class` differs from the caster's own list count → Eldritch Knight (expands its *own* Wizard list) is NOT Magical Secrets. *Rejected:* free/unbounded expansion (no tracking); rigid per-level secret slots.
- **D2 (2026-08-26) Manual extras** — removed the numeric steppers; any pick counts against that source's cantrip/prepared limit, over-cap allowed but flagged. *Rejected:* keep opaque counters.
- **D3 (2026-08-26) Lineages** — left as one flat species dropdown (data has no parent/child link; entries like `Elf — High Elf`). *Rejected:* split into a second dropdown; restructure extract.
- **D4 (2026-08-26) Wizard** — meter row tracks total **Known** + Prepared; per-level tiles computed from spellbook growth (best-case known per spell level). *Rejected:* per-level from example numbers; total-only.
- **D5 (2026-08-26) Hover toolbar** — per level-group toolbar (eligible list + table): count at that level + clear. *Rejected:* single bottom bar.
- **D6 (2026-08-26) Feats** — full budget (general ASI slots 4/8/12/16/19 +Fighter 6/14 +Rogue 10; 1 origin + 1 for Humans) + separate Origin pick; `extract.py` now keeps all feats. *Rejected:* highlight-only; no budget.

## Backlog (next sessions)
- [ ] **Feature names for 2024 blocks** — e.g. Lore's "Magical Discoveries" (XPHB `additionalSpells` block is unnamed → falls back to subclass name). Needs matching `subclassFeature` text in extract, or a manual map.
- [ ] **High Elf true in-table swap** — currently ● + "swappable (change in Choices)"; actual swap is via the Choices panel, not toggle-in-table.
- [ ] **Human extra-origin** not restricted to origin-only (single Origin dropdown includes dragonmarks/dark gifts).
- [ ] Runtime **"Load 5etools files"** panel (drag-drop mirror JSON, re-parse in-JS).
- [ ] Per-source **subclass de-duplication** in the picker (2014 + 2024 both show).
- [ ] Ability **`inherit` with mixed multiclass** → prompt a choice instead of "Other".

## Gotchas
- Grants tree `{fixed, picks, expansions, optionGroups, ability}`; `resolveGrants` recurses; path-based choice ids (`c<rowId>:pk1`, `s<rowId>:og0`, `c<rowId>:bo0`/`:bc0` for orders) stable across renders.
- Cart/choices keyed by **stable row id** (`state.nextRowId`), never array index.
- Expansion filters carry `_atLevel` (onset) for the Magical Secrets cap; off-list access adds `srcs:"Magical Secrets"` for the filter.
- Feats: only ~66 of 276 grant spells (`hasSpells`); origin cats = O/D/DG, general = G/EB, FS* excluded from picker.
- Text highlights (`ccText`) + ability chips ported from monster-forge; colours are theme-token pairs in styles.css v6.
- **Browser preview quirk:** editing `src/index.html` re-opens a `data:` preview tab (unstyled, storage-blocked) and fronts it — always test on the `http://localhost` tab, not the `data:` one.
