# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. History → git log.

## TL;DR (2026-08-26 · commit 6ad6a0f · clean tree)
- **State:** working v4. Repo split done; all of Francesco's latest note-batch
  implemented and verified in-browser. Deployed as the Artifact "My Spellbook".
- **Next action:** pick from Backlog — most valuable is likely the runtime
  **"Load 5etools files"** panel (so an updated mirror updates the tool without
  re-running `extract.py`).
- **Manual for Francesco:** none blocking. Optional: `git remote add` + push
  (repo is local-only so far); delete the superseded files in the Drive folder
  `D&D/Strumenti & Manuali/Spell Eligibility Forge/` (see its MOVED.md).

## What this is
Offline single-page D&D 2024 spell planner. Canonical source = this repo.
`dist/index.html` is the built, self-contained deliverable. Artifact URL:
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0
(published from `D&D/Strumenti & Manuali/Spell Eligibility Forge/index.html` in
Drive — that path is kept only to preserve the URL; republish it there to update).

## Build / run
- Dev: `python3 -m http.server 8000` → `http://localhost:8000/src/index.html`
- Data refresh: `python3 extract.py "<mirror>/data"` then `python3 build.py`
- Verify gate (no test suite yet): sources must parse — `python3 -c "import ast;…"`
  and `node -e "new Function(fs…app.js)"`. Both green at 6ad6a0f.

## Done (this session)
- [x] Repo scaffold + git init; split monolith → `src/{index.html,styles.css,app.js}`,
      `data/`, `extract.py`, `build.py`, `dist/`. Renamed to **My Spellbook**.
- [x] Spell **tooltip on hover + full modal on click** (modal bottom-sheet on mobile).
- [x] **Casting ability** resolved per source (defaults to shared class stat;
      choice surfaced when the source allows) + table grouping by ability.
- [x] **Spell table** rework: removed level column; split Duration / Conc (✓ check);
      **Casts** column for recharge (1/LR…); tidied source chips `Land (Polar)`;
      group-by level/ability/source; daily casters "show all eligible" + inline select.
- [x] **Fighting-Style spell choices** (Ranger→Druidic Warrior, Paladin→Blessed
      Warrior) surfaced as class choices; FS feats removed from the feat picker.
- [x] **Cleric/Druid order extra-cantrip** choice (Thaumaturge/Magician). Scan
      confirmed no other 2024 class/subclass grants an extra cantrip.
- [x] Overflow **⋯ settings menu** (Sources / theme / Reset); removed header
      subtitle; removed "max Xth" from cart; searchable add-class; subclass locked
      until unlock level; dropdown-arrow spacing; left-column scroll; add-class field.

## Backlog (next sessions)
- [ ] Runtime **"Load 5etools files"** panel (drag-drop mirror JSON, re-parse in-JS).
- [ ] **Fixed-but-swappable grants** (High Elf L3/5 spells) as editable choices —
      5etools doesn't flag swappability, needs a heuristic or manual table.
- [ ] Per-source **subclass de-duplication** in the picker (2014 + 2024 both show).
- [ ] Ability **`inherit` with mixed multiclass** currently groups as "Other" —
      could prompt a choice instead.
- [ ] Optional: "show all eligible" for **static** casters too (currently daily only).

## Gotchas
- Grants model is a nested tree: `{fixed, picks, expansions, optionGroups, ability}`;
  `resolveGrants` recurses through option groups. Choice ids are path-based
  (`c<rowId>:og0`, `s<rowId>:pk1`, `f<featKey>:ab`, …) → stable across renders.
- Cart/choices are keyed by a **stable row id** (`state.nextRowId`), NOT array
  index — never reintroduce index keys (caused the pick-carryover bug).
- Magical Secrets = `expanded` with `all`-filters → parsed as list *expansions*,
  not spells; `s6..s9` expanded keys map to caster levels 11/13/15/17.
- Data has spell descriptions now (`desc`,`higher`,`durTxt`) → data.json ~1.8MB;
  dist ~1.84MB, still well under the 16MB Artifact cap.

⟳ Rename previous session → "My Spellbook spell-planner"  · session: resolve by cwd + latest
