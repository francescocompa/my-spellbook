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
