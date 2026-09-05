# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D183 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-09-05 · **v1.5.41** live, pushed and tagged · `1190ed8` · **Phase M DONE (D182) · a lookup gap closed (D183)** · two releases this session, v1.5.40 → v1.5.41)

- **Where it stands.** **Phase M closed** with M3 and M4 (v1.5.40, **D182**): the feat picker's
  "Eligible only" is a three-way Prerequisites row (Eligible / Not yet / Can't verify) plus an
  Ability bonus row, and every filter surface speaks the D174 menu's vocabulary (Books, Cast
  time, Save, Damage, Access, Properties; Reprints and Marked are switches). His bug report
  closed a real extractor gap (v1.5.41, **D183**): the lookup's `classVariant` key — a list a
  book adds a spell to — was never read, so Battle Familiar (AU) had no warlock and Fizban's
  dragon spells no sorcerer or wizard; 180 spells in the mirror, 213 in a live library. The
  parser fingerprint moved, so a stored library re-reads itself on the next visit. **Phase N**
  (D176) has N1 shipped (D177–D181); N2 onward each need a decision entry first.
- **Next action: N2 (backgrounds) needs its own decision entry before anything is built**
  (D176(c)) — /interview him on the rung, then build. L5.5 onward still queued.
- **Manual for Francesco:** ① the **copy-veto pass** over `audits/copy-table.md` (now 245
  rows; M4's eighteen are at the end, and two of the names are the session's own call:
  **Access** for the old "Class / list" and **Properties** for "Tags"); ② confirm on the live
  page that Battle Familiar now shows for a Warlock once the library has re-read (the Library
  strip says so); ③ **PWA install check** on your phone (L5.6); ④ **third-casters are still
  pooled then floored** — Fighter 5 (EK) + Rogue 5 (AT) reads 3 where the table gives 2, a
  separate rules call; ⑤ print from Chrome or Safari (D108); ⑥ XMM on for Find Familiar's 2024
  forms (D81); ⑦ L5.5's format (copy the build as a level plan).
- **Read before touching the score block:** D176–D181 in that order; the CSS is inside
  `.menupop`, where `.menupop button` restyles every button (GOTCHAS). **Before touching the
  extractors:** GOTCHAS' lookup entries (D91, D183) — the lookup has two class keys.

## What this is

Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools (IndexedDB) ⊕ custom homebrew
(localStorage). Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

Non-goals, as narrowed by D115: no **authored** level-by-level timeline (per-level truth is
derived from the acquisition order; versions are alternatives, never levels), no server sync
or accounts, no sharing a build as a page or URL (D36), no full bestiary (D78 carries a
bounded set). Of a character's numbers, ability scores and the proficiency bonus are modelled
and nothing else (D176).

## Now

The queue is `PLAN.md`: **Phase M is done** (D172–D174, D182); **Phase N** (D176, the creator
ladder) has **N1 done** and every further rung gated on its own decision entry — N2
(backgrounds) is next and needs the entry first. Phases E–N models (D115, D118, D126, D130,
D131, D132, D154–D156, D161–D183) still bind their surfaces; cite them. `audits/` is a
point-in-time artifact: `/clean` archives it once L5 has consumed it, together with the three
mockup rounds in `scratchpad/mockups/` (`scores.html`, `picks.html`, `fold.html`, each with
its `mk*.py`).

A full `/clean` ran 2026-09-05 (D158(q)/L5.11): D115–D175 bodies, Phase K/L/M task bodies,
fifteen closed flags and the 1.0–1.4 changelog rows moved to `ARCHIVE.md`; stubs point.

⟳ Rename previous session → "Feat filters, the filter wording pass, and the classVariant gap" · session: local_f68f3c8c-2e5f-4455-91d2-3df0f69abdae

The queue after N2 is L5.5 onward — see `PLAN.md`.
