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

## TL;DR (2026-08-30 · **v1.2.31**, committed + tagged LOCALLY, **not pushed** · live site still on v1.2.28)
- **State:** tree clean, three more releases merged from parallel agent worktrees —
  **v1.2.29** (two queued bugs), **v1.2.30** (H6 capitalization), **v1.2.31** (H4 the
  character drawer). **Phase H's BUILD IS COMPLETE**: H1/H2 (v1.2.27), H3 (v1.2.28), H6 and
  H4 have all merged, and **H5, its fresh-eyes gate, is the only open task in the phase**.
  Phase G is likewise built and owes only **G4**. The bug batch turned out bigger than its
  line said — `renderOptFeats()` was stale from FIVE handlers, not two, and once drawn it
  actively lied (a Warlock stepped 2 → 1 kept reading "0/3" against a truth of 0/1); fixed
  by moving it into `render()`, which is also where the feat-chip remove handler's identical
  hole closed. H6 left `cap1` as the file's one display capitaliser and never touches a
  stored value; the do-not-touch list was proved by round-trip, not assumed. H4 removed G1's
  `GUIDE.away` + vanishing Guide tab from the tree entirely.
- **Next action:** **H5 — the phase H fresh-eyes gate**, which **must be a SEPARATE session**
  (model policy; this one coordinated every phase-H build). It carries three questions:
  H3's reverse-`place` cast-cap reading of D118(g); H4's `PREVIEW.level` surviving
  `closeGuide`; and H4's two-line bar deviation from D130(e). **G4 is owed too and is also a
  separate session.** Nothing else in phase H is open. Unblocked backlog work, if you'd
  rather build than gate: `refreshAddFeat()`'s `#epicRow` has the same staleness defect the
  v1.2.29 fix just closed (found by reading, not yet reproduced).
- **Manual for Francesco:** ⓪ **Refresh your imported data in each browser — the top item, and
  it now explains three separate symptoms** — ⋯ → **Refresh imported data** (since v1.2.23 the
  menu button runs inline and SHOWS a green "Re-imported N books" / a red reason, so you can
  tell it worked). A pre-**D127** digest still holds the unresolved `_copy` twins, which is why
  **Aberrant/Clockwork/Wild Magic appear twice**, why every **2014 subclass grants nothing**,
  and why the **Arcane Trickster / Eldritch Knight spell picker is EMPTY** (verified: on fresh
  data both offer 61 spells). It also carries the earlier v1.2.2 parser fixes (Savant
  double-grant, tag suffixes, Imp's raw tag, D109 forms, D91 access).
  ① **v1.2.29–31 are committed and tagged but NOT pushed** — say the word and they go up
  (that is also what updates the live site). ② **Two copy calls are yours**: the
  `…`-placeholder family ("+ add a class…", "all schools", "any save", "picked") — one call
  settles all of them — and whether the chain rail's CSS-authored `· optional` should match
  the card's now-capitalised "Optional" (styles.css:1822). ③ **Your build "v2" showed a
  health ⚠ at L1–L4** — it is not a false positive: its Warlock 4 row holds 8 spells where
  the class knows 5, five of them 3rd-level when a Warlock 4 casts at most 2nd. Looks like a
  dev scratch build — fix or ignore, your call. ④ **Print from Chrome or Safari**, not from an
  in-app PDF writer: the filename and the clickable spell links come from the browser's own
  export, and some hosts ignore both (D108). ⑤ **Turn XMM on in Sources** for Find Familiar's
  Monster Manual 2024 forms in the default view (D81). ⑥ Optional — ask GitHub Support to gc
  so the old unreachable commits (SHA 2c8bbb6 etc., held only in
  `backup/pre-purge-20260826` locally) stop being SHA-addressable. ⑦ To update the live site:
  `python3 extract.py` (if data changed) → `python3 build.py` → commit → push.
  ⑧ `dist/`, `data/`, `data-srd.json` are gitignored (local only); public SRD data is inlined
  in committed `docs/`. ⑨ **14 stale agent worktrees/branches** are sitting in
  `.claude/worktrees/` (all consumed — the v1.2.19→v1.2.31 builds, plus
  `claude/zen-rhodes-4b15f8`, whose cadence fix reached main by another path). Prunable on
  your word: `git worktree remove` + `git branch -D`. ⑩ An old rename note ("Print sheet, PDF
  options and familiar forms") could not be applied — two candidate sessions both carry
  meaningful titles ("General feats required zero state", "Importer rework and custom
  sources"); say which (if either) should take it.

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Now

**Phases E and F are DONE** (E8 and F4 both passed; bodies → `ARCHIVE.md#phase-e` and the
PLAN's phase F block). **Phase G is BUILT** (D126 — the guided builder is a full-size page,
G1–G3 shipped v1.2.24 → v1.2.26) and **awaits its G4 gate**. **Phase H is BUILT too** (D130 —
guided builder v2: H1/H2 v1.2.27, H3 v1.2.28, H6 v1.2.30, H4 v1.2.31) and **awaits H5**.
v7 (saved builds) is complete → `ARCHIVE.md#v7-tasks`. Non-goals as narrowed by D115: no
**authored** timeline (the level view is derived from the acquisition order; versions are
alternatives, never levels), no server sync or accounts, no sharing a build as a page or
URL (D36).

**Two gates are owed and neither may be run by the session that built the phase** (model
policy): **G4** for phase G (start from G3's notes in PLAN) and **H5** for phase H.

The queue is `PLAN.md`; the next action is named in the TL;DR.

⟳ Rename previous session → "Phase H builds merged in parallel"  · session: resolve by cwd + latest

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`
