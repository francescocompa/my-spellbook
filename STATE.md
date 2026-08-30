# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next and what is gated |
> | `DECISIONS.md` | Every decision D7–D130 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases and old rationale |

## TL;DR (2026-08-30 · **v1.2.38**, pushed, tags pushed · **LIVE on GitHub Pages**)
- **State:** tree clean. **Ten tagged releases this session (v1.2.29 → v1.2.38)**, seven of
  them built by parallel Opus agents in worktrees and merged here. **Phase H's build closed**
  (H4 the character drawer, H6 the capitalization sweep) and **phase I — guided builder v3 —
  was decided AND built in the same session** (D131 + D132, from Francesco using phase H):
  ① **I1** one picker per SECTION, not per step (superseding D130(d)), and the modal's footer
  button became the proceed nudge that ADVANCES the walk. ② **I2** the guided builder lost its
  explanatory prose (what remains sits behind a `?`), the dead "+ N more" chip went, and
  **both level columns inverted** to highest-first — the chain rail AND the timeline — so
  "walk L1 upward" travels upward on screen and the new ghost arrow beside "from L5" means
  what it says. ③ **I3** the drawer's 14px accent edge went (it read as a stray highlight) and
  the rail's grip lines up with its row. ④ **I4** Pact of the Chain got a familiar chooser —
  and under it, a live bug: `activeFormGrants` matched an exact `name|source` key while
  `grantRec` resolves by name through the reprint chain, so a 2014 boon silently dropped all
  eight granted forms into the generic 65. Also **v1.2.29**'s two bug fixes, one of which
  (`renderOptFeats`) was stale from FIVE handlers and, once drawn, actively lied.
- **Next action:** **the gates — and they are the only open work.** **H5** (phase H against
  D130(a–h)) and **I5** (phase I against D131(a–h) + D132) **may be run as ONE session**,
  since the two phases share surfaces and neither has been reviewed; **G4** (phase G against
  D126) is still owed too. **None of them may be this session or any session that built these
  phases** (model policy). PLAN carries the questions each gate inherits. If you would rather
  build than gate, the queue holds eight flagged items, all small and none blocking — the
  fattest is `refreshAddFeat()`'s `#epicRow`, which has the same staleness defect v1.2.29 just
  closed.
- **Manual for Francesco:** ⓪ **Refresh your imported data in each browser — still the top
  item** — ⋯ → **Refresh imported data** (since v1.2.23 it runs inline and SHOWS a green
  "Re-imported N books" / a red reason). A pre-**D127** digest still holds the unresolved
  `_copy` twins, which is why **Aberrant/Clockwork/Wild Magic appear twice**, why every
  **2014 subclass grants nothing**, and why the **Arcane Trickster / Eldritch Knight picker is
  EMPTY** (verified: fresh data gives both 61 spells). ① **Three copy/model calls are yours**:
  the `…`-placeholder family ("+ add a class…", "all schools", "any save", "picked") — one
  call settles all of them; whether the chain rail's CSS-authored `· optional` should match
  the card's now-capitalised "Optional" (styles.css:1822); and whether `sbFav` should become
  edition-tolerant (a mark is stored per PRINTING, so it is not seen if a book toggle later
  resolves the other one — a storage-shape change). ② **Your build "v2" showed a health ⚠ at
  L1–L4** — not a false positive: its Warlock 4 row holds 8 spells where the class knows 5,
  five of them 3rd-level when a Warlock 4 casts at most 2nd. Fix or ignore, your call.
  ③ **Print from Chrome or Safari**, not an in-app PDF writer — the filename and the clickable
  links come from the browser's own export and some hosts ignore both (D108). ④ **Turn XMM on
  in Sources** for Find Familiar's Monster Manual 2024 forms in the default view (D81).
  ⑤ Optional — ask GitHub Support to gc so the old unreachable commits (SHA 2c8bbb6 etc., held
  only in `backup/pre-purge-20260826` locally) stop being SHA-addressable. ⑥ To update the
  live site: `python3 extract.py` (if data changed) → `python3 build.py` → commit → push.
  ⑦ `dist/`, `data/`, `data-srd.json` are gitignored; public SRD data is inlined in committed
  `docs/`. ⑧ An old rename note ("Print sheet, PDF options and familiar forms") could not be
  applied — two candidate sessions both carry meaningful titles ("General feats required zero
  state", "Importer rework and custom sources"); say which (if either) should take it.

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Now

**Phases E and F are DONE** (E8 and F4 both passed; bodies → `ARCHIVE.md#phase-e` and the
PLAN's phase F block). **Phases G, H and I are all BUILT and all three await their gates.**
G (D126 — the guided builder as a full-size page, v1.2.24 → v1.2.26) owes **G4**;
H (D130 — guided builder v2: H1/H2 v1.2.27, H3 v1.2.28, H6 v1.2.30, H4 v1.2.31) owes **H5**;
I (D131 + D132 — guided builder v3: I3 v1.2.34, I1 v1.2.35, I4 v1.2.36, I2 v1.2.37) owes
**I5**, which may share a session with H5.
v7 (saved builds) is complete → `ARCHIVE.md#v7-tasks`. Non-goals as narrowed by D115: no
**authored** timeline (the level view is derived from the acquisition order; versions are
alternatives, never levels), no server sync or accounts, no sharing a build as a page or
URL (D36).

**Three gates are owed and none may be run by a session that built the phase** (model
policy): **G4** (start from G3's notes in PLAN), **H5**, and **I5** — H5 and I5 may be one
session, since the phases share surfaces and neither has been reviewed.

The queue is `PLAN.md`; the next action is named in the TL;DR.

⟳ Rename previous session → "Phase H closed and phase I built"  · session: resolve by cwd + latest

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`
