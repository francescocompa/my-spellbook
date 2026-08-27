# Changelog

The version in the app's footer comes from `VERSION`, which `build.py` injects into every
deliverable. **MAJOR.MINOR**, minor bumped once per commit (`python3 bump.py`); the major
moves only on Francesco's say-so (`python3 bump.py --major`).

**1.0 is where the numbering starts.** Everything before it is the internal v4 → v7 line the
commit messages already named, mapped onto a pre-1.0 series and tagged in place — no history
was rewritten, so every SHA in `STATE.md`, `ARCHIVE.md` and the memories stays valid.
`git tag` lists them; `git show v0.6.5` opens one.

## 1.x — the numbered line

| Version | Commit | What shipped |
|---|---|---|
| **1.0** | — | The app reports its own version. `VERSION` + `bump.py` + a footer tag; the numbering starts here. |

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
