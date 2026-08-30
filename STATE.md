# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next and what is gated |
> | `DECISIONS.md` | Every decision D7–D124 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases and old rationale |

## TL;DR (2026-08-30 · **v1.2.27** at `e542e35`, pushed, tags pushed · **LIVE on GitHub Pages**)
- **State:** tree clean, everything committed and pushed. **Eleven tagged releases across two
  days (v1.2.17 → v1.2.27)**, most built by parallel Opus agents in worktrees and merged here.
  ① **F4 passed** → phase F done, with **D125** fixed in-gate (a forward pick step now clamps
  to the row's FIRST open slot, because a take always lands there). ② **The wave batch**:
  **D128** swaps are per KIND (one leveled-spell trade + one cantrip trade per level-up, rules
  read from XPHB prose class by class; Wizard cantrip 1/LR in the prepare modal);
  **D129** Refresh imported data runs inline with real progress/outcome feedback and **two
  false-success holes closed** (a failed folder read used to re-store the unchanged digest
  under a new parser stamp and report success); plus no-duplicate-multiclass, the picker
  popover batch (`composedPath` closer), foldable level groups, and the timeline batch
  (movable retrain trades, per-half count tiles, quiet choosers, copy scrub, add-level row).
  ③ **D127 built** — 5etools `_copy` twins resolved in both extractors + `supersededBy`,
  which healed **73 subclasses that granted NOTHING** and 67 missing from 2024 pickers.
  ④ **Phase G**: the guided builder is a **full-size page** (D126) — chain column in the
  timeline's language with shared drag-to-reorder, decision stage, pick modal over it, choice
  steps that open the app's real choosers. ⑤ **Phase H started** (D130, from using it):
  H1 nav + H2 subclass spell lists merged in v1.2.27.
- **Next action:** **H3 — the guided builder v2 surfaces** (D130(a–d): collapsed rail with one
  severity icon, chips-only answers, ONE STEP PER FEATURE with sections, multi-pick modal) —
  **an agent is IN FLIGHT on it** (worktree branch `worktree-agent-afa4cdde2296b6f0b`); merge
  it, then **H4** (D130(e) the character drawer), then **H6** (capitalization — audited, the
  inventory and the do-not-touch key list are in PLAN). **G4 and H5 are 🔍 fresh-eyes gates
  and both need SEPARATE sessions** — this one coordinated every build in phases G and H.
- **Manual for Francesco:** ⓪ **Refresh your imported data in each browser — the top item, and
  it now explains three separate symptoms** — ⋯ → **Refresh imported data** (since v1.2.23 the
  menu button runs inline and SHOWS a green "Re-imported N books" / a red reason, so you can
  tell it worked). A pre-**D127** digest still holds the unresolved `_copy` twins, which is why
  **Aberrant/Clockwork/Wild Magic appear twice**, why every **2014 subclass grants nothing**,
  and why the **Arcane Trickster / Eldritch Knight spell picker is EMPTY** (verified: on fresh
  data both offer 61 spells). It also carries the earlier v1.2.2 parser fixes (Savant
  double-grant, tag suffixes, Imp's raw tag, D109 forms, D91 access).
  ① **Your build "v2" showed a health ⚠ at L1–L4**
  — it is not a false positive: its Warlock 4 row holds 8 spells where the class knows 5, five
  of them 3rd-level when a Warlock 4 casts at most 2nd. The app already flagged it as over
  before E4; the sweep only located it. Looks like a dev scratch build — fix or ignore, your
  call. ② **Print from Chrome or Safari**, not from an in-app PDF writer: the filename and the
  clickable spell links come from the browser's own export, and some hosts ignore both (D108).
  ③ **Turn XMM on in Sources** for Find Familiar's Monster Manual 2024 forms in the default
  view (D81). ④ Optional — ask GitHub Support to gc so the old unreachable commits (SHA
  2c8bbb6 etc., held only in `backup/pre-purge-20260826` locally) stop being SHA-addressable.
  ⑤ To update the live site: `python3 extract.py` (if data changed) → `python3 build.py` →
  commit → push. ⑥ `dist/`, `data/`, `data-srd.json` are gitignored (local only); public SRD
  data is inlined in committed `docs/`. ⑦ An old rename note ("Print sheet, PDF options and
  familiar forms") could not be applied — two candidate sessions both carry meaningful titles
  ("General feats required zero state", "Importer rework and custom sources"); say which (if
  either) should take it.

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
G1–G3 shipped v1.2.24 → v1.2.26) and **awaits its G4 gate**. **Phase H is under way** (D130 —
guided builder v2: H1/H2 merged in v1.2.27, H3 in flight, then H4 and H6, gated by H5).
v7 (saved builds) is complete → `ARCHIVE.md#v7-tasks`. Non-goals as narrowed by D115: no
**authored** timeline (the level view is derived from the acquisition order; versions are
alternatives, never levels), no server sync or accounts, no sharing a build as a page or
URL (D36).

**Two gates are owed and neither may be run by the session that built the phase** (model
policy): **G4** for phase G (start from G3's notes in PLAN) and **H5** for phase H.

The queue is `PLAN.md`; the next action is named in the TL;DR.

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`
