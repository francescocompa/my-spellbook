# Changelog

The version in the app's footer comes from `VERSION`, which `build.py` injects into every
deliverable. **MAJOR.MINOR.PATCH** (D117, 2026-08-28): the **major** moves only for
overhauls or massive reworks, on Francesco's say-so (`python3 bump.py --major`); the
**minor** for larger batches that ship features (`--minor`); the **patch** once per
ordinary commit (`python3 bump.py`). Releases are tagged (`git tag v1.2.2`) from 1.2.2 on.

**The old two-part 1.x line (1.0 → 1.8) is mapped, not rewritten** — same commits, same
SHAs, retro-tagged with their semver identity, exactly as the pre-1.0 line was. The table
below names both. Everything before 1.0.0 is the internal v4 → v7 line, mapped onto a
pre-1.0 series and tagged in place. `git tag` lists them all; `git show v0.6.5` opens one.

## 1.x — the numbered line

| Version | (was) | Commit | What shipped |
|---|---|---|---|
| **1.2.4** | — | *this commit* | **E1 — the order substrate** (D115): the pick arrays are declared the acquisition order (nothing may sort them in place); `state.currentLevel` (null = at top) and `state.swaps` (one −out/+in event per character level, D115(g)) with export/import + one-time migration that leaves `meta.updated` alone; fork-a-version truncates both; swap events die with their class row. **Importer boot-brick fixed**: an imported build without filters stored `FILTER_DEFAULT()`'s live Sets as `{}`, and the next boot threw at `new Set({})` — the importer now stores null and `applyState` heals any malformed filters blob instead of dying. **D118 decided** — the guided builder (coach rail, forward + reverse) is phase F, after the E8 gate. |
| **1.2.3** | — | 902e44c | Handoff: STATE stamped at 41494c0, docs aligned to D115–D117. |
| **1.2.2** | — | 41494c0 | **The audit batch**: unnamed-record guard in both extractors + boot fallback (a malformed brew can no longer brick every boot); escaping pass on imported strings (`esc()` covers quotes; six raw `innerHTML` sinks closed); **Savant double-grant fixed** (5etools grew structured picks; the hand table now retires itself per feature); `[disambiguator]` tag suffixes stripped; whole-record parity diff (35 checks); build.py marker asserts; import-file errors surfaced; storage-quota notice; "Remove imported data" danger row; UA books on the Homebrew & UA shelf; caster-kind vocabulary in the by-level picker; `meta.updated` means edited, not opened; item DC/attack in source group headers; sticky gap banner + flagged chips; **SRD subset renames the 17 product-identity spells** to their licensed names; MAJOR.MINOR.PATCH versioning (D117). |
| **1.2.1** | 1.8 | d14ac89 | Handoff: STATE stamped, docs aligned to D115. |
| **1.2.0** | 1.7 | 65aa06d | **Epic boons** (D114): a boon is a feat taken WITH a slot that arrived at character level 19+, never a bonus pick. `featSlotLevels()` walks the level plan; the old `charLevel()>=19?1:0` gave boons to builds with no slot near 19 and capped at one builds with slots on 19 **and** 20. D115 opens the multi-level-build design session. |
| **1.1.3** | 1.6 | d8db42a | `CLAUDE.md` dev-server note matches the attach-mode launch config (the preview sandbox cannot spawn `serve.py`). |
| **1.1.2** | 1.5 | 0b52f16 | The ⋯ Refresh actually refreshes: await the folder recall inside the click, so the first click of a session no longer falls through to "choose the folder". |
| **1.1.1** | 1.4 | 3cb4ede | Handoff: STATE stamped, docs aligned to D113. |
| **1.1.0** | 1.3 | 99e883f | **The Library** (D110–D113): import + Sources merged into one two-tab modal; universal drop zone (zip / files / dragged folder); one three-state book list with one Apply; parse on arrival; Refresh imported data (one click, summary + parser stamp); edition-first source groups with search. |
| **1.0.2** | 1.2 | d9a233f | Stat-block tag strip on every free-text field (the Imp's `{@variantrule}`); folder scan backfills book names from books.json; folder import carries the lookup, books.json and bestiary files, in readOrder. |
| **1.0.1** | 1.1 | e9d4886 | `/clean`: the doc set split (STATE → CLAUDE/PLAN/DECISIONS/GOTCHAS/CHANGELOG/ARCHIVE). |
| **1.0.0** | 1.0 | 7523c81 | The app reports its own version. `VERSION` + `bump.py` + a footer tag; the numbering starts here. |

## 0.x — before the numbering (tagged retroactively)

| Tag | Commit | What shipped |
|---|---|---|
| `v0.4`   | `5762b2e` | Repo split, choices engine, casting stats, spell table + details. |
| `v0.6`   | `468436f` | Runtime content layer, custom spells, the 5etools importer, the no-data deploy build. |
| `v0.6.1` | `cbf150d` | SRD-embedded public build, reworked level budget, zip import. |
| `v0.6.2` | `0cc931f` | Per-level caps, edition dedup, the wizard book model, spell-modal access. |
| `v0.6.3` | `58d0cc5` | Grant feature names, quiet description sub-headings, collapsed Access. |
| `v0.6.4` | `575ce5c` | Dedicated species and feat picker modals. |
| `v0.6.5` | `f0ac6b8` | Innate-cast fixes, the shared source checklist, the column rework, optional features. |
| `v0.6.6` | `a4958e2` | Prerequisites end to end, grouped choices, picker menus, quieter components. |
| `v0.7`   | `1115e1f` | Saved builds complete — storage, activation, the manager, the switcher, export/import, IndexedDB. |

Between `v0.7` and `1.0`, unnumbered: the print / save-as-PDF surface, the offline install for
the published build, and feature-granted familiar forms (decisions D97–D109 in `STATE.md`).

## What shipped, by phase

Moved from `STATE.md`'s Shipped list on 2026-08-27 (v1.1) — one owner for "what shipped when".
Per-batch narrative → `ARCHIVE.md#v7-batches`.

- v6 / v6.1 — runtime content layer, custom spells, importer, Pages deploy, SRD embed, zip import.
  → `ARCHIVE.md#v6`
- v6.5 / v6.6 — innate-cast fixes, optional features, prerequisites end-to-end, column rework,
  shared source checklist, unified feat picker. → `ARCHIVE.md#v65`
- v7 · T1–T5 — saved builds end to end: storage + migration, activation reconciliation, the
  manager, the header switcher, and export/import as files.
- v7 · T7 — storage-pressure reporting, closed by moving the imported digest to IndexedDB (D93).
- **Importer rework** (2026-08-27) — **D90–D93**: app icon; honest zip errors + unpack progress +
  the clobbered spell-lookup fix (D91); folder scanning indexed by book (D92); IndexedDB (D93).
- **Custom sources** (2026-08-27) — **D94–D95**: the editor redesigned progressive with a live
  summary and per-spell notes, then its two model gaps closed (payment per spell; a `total` unit
  for uses that never reset). The D55/D65 model was never the problem; D95 widened it.
- **Print / save as PDF** (2026-08-27) — **D97–D103, D106–D108**. The whole printed surface: the
  sheet is the spell table under a build summary, with a tick-box tracker for everything
  expendable, a legend of the marks it uses, an optional full-text spell-card appendix with
  internal links, and a remembered settings modal (colour, orientation, tracker, cards,
  all-preparable, page-per-level, notes) that says what a setting will cost.
- **Offline install** (2026-08-27) — **D99**. `build.py` writes a manifest, a stale-while-revalidate
  service worker and a 192/512/maskable icon set into `docs/` only; registration is guarded on
  `__PUBLIC__`. ⚑ Registration is **unverified** — the in-app browser refuses to register a worker
  and Chrome was unreachable from the session (owner: Francesco, 2026-08-27).
- **Table & data fixes** (2026-08-27) — **D100** (a source states only the numbers a spell rolls),
  **D104** (grouping by source folds a subclass or invocation into its class), **D105** (marked
  summon forms print and lead the carousel), **D109** (a feature can add forms to a familiar
  spell), plus the creature-book filter bug → Gotchas.
- **v7 note batches 1–10** (2026-08-26 → 2026-08-27) — **D43–D89**. Ten batches of notes plus two
  bug hunts on top of the tasks. Per-batch narrative → `ARCHIVE.md#v7-batches`; the earlier notes
  → `ARCHIVE.md#v7-notes`. The load-bearing outcomes are the decisions above and the Gotchas
  below — this list used to restate them a third time.
