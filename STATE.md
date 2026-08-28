# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next and what is gated |
> | `DECISIONS.md` | Every decision D7–D119 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases and old rationale |

## TL;DR (2026-08-28 · **v1.2.9**, code at `d55f8cf`, pushed · **LIVE on GitHub Pages**)
- **State:** working, committed, **pushed**, tags pushed, tree clean except this handoff.
  **Phase E's build work is COMPLETE — E1–E7 all shipped this session** (v1.2.4 → v1.2.8, five
  tagged releases), each done-when verified in-browser. What the app does now that it didn't:
  a build **works at every level**. The pick arrays ARE the acquisition order (E1) plus a saved
  `currentLevel` and swap events; order + each class's schedule maps every pick to the level it
  arrived at (E2), and every level-view consumer reads that slice; a build-wide **consistency
  sweep** locates what doesn't add up AT ITS LEVEL and flags it on the level chip and a bar
  (E4); the chip opens a **timeline popover** — jump to any level, drag rows to reorder the
  level plan (the D59 panel is retired into it), drag pick chips to move acquisition, pin the
  current level, fork a variant (E5); editing at any level is order-aware and the **level-up
  swap now records** by click-to-arm on a chip + take the replacement (E3, closed);
  fork-a-variant truncates at the slice with swaps rewound, and printing at a level is
  first-class (E6); a quiet **order-matters** line names why the order is load-bearing (E7).
  Also this session: **D118 DECIDED** — the guided builder (a coach rail, forward and reverse
  over the same substrate) is **phase F (F1–F4)**, strictly after the E8 gate; and **D119** —
  the timeline's two casting tiles merge where the clocks agree, and the swap flow's shape.
  Two real bugs were found and fixed en route, both now in `GOTCHAS.md`: an importer boot-brick
  (a build imported without filters stored live Sets as `{}` and the next boot died at
  `new Set({})`) and two popover traps (a re-render detaches a click's target so an INSIDE
  click read as outside; scroll must re-anchor a fixed popover, not close it).
- **Next action:** **E8 — the 🔍 fresh-eyes gate** (`fable@high`, **a separate session** per
  `~/.claude/docs/model-policy.md`): review the shipped phase against **D115(a–j)** before it
  is declared done. Nothing else in phase E is open. After the gate, **phase F** (D118) is the
  plan of record. The 🔶 **magic-item / reward import** decision remains ungated and awaits
  Francesco's call.
- **Manual for Francesco:** ⓪ **Refresh your imported data in each browser** — ⋯ → **Refresh
  imported data** (choose the folder once if asked). The v1.2.2 parser fixes live in your
  stored digests only after it: heals the **Savant double-grant** (an Evoker was offered 5
  free picks instead of 3), the `[Area of Effect]`-style tag suffixes, and everything earlier
  (Imp's raw tag, D109 forms, D91 access). ① **Your build "v2" now shows a health ⚠ at L1–L4**
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

**Phase E is built and awaiting its gate** (D115) — E1–E7 shipped 2026-08-28, E8 is the only
open task in it. **Phase F** (the guided builder, D118) is queued strictly behind that gate.
v7 (saved builds) is complete — T1–T5 and T7, all six task bodies and the storage shape →
`ARCHIVE.md#v7-tasks`. Non-goals as narrowed by D115: no **authored** timeline (the level view
is derived from the acquisition order; versions are alternatives, never levels), no server sync
or accounts, no sharing a build as a page or URL (D36).

The queue is `PLAN.md`; the next action is named in the TL;DR.

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`

⟳ Rename previous session → "Phase E — the build at every level" · session: resolve by cwd + latest
