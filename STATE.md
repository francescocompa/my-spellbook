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

## TL;DR (2026-08-29 · **v1.2.16**, code at `dd31abb` (v1.2.15), pushed · **LIVE on GitHub Pages**)
- **State:** working, committed, **pushed**, tags pushed, tree clean except this handoff.
  One session closed **phase E and built all of phase F**, six tagged releases
  (v1.2.10 → v1.2.15). ① **E8 passed** — full substrate review + in-browser verification of
  every D115 clause on fresh fixtures — and found/fixed **D120, a CRITICAL data-loss
  regression** (v1.2.2 → v1.2.9): `save()`'s identical-write skip compared the live state
  against itself (`serializeState()` returns live sub-objects by reference; `save()` and boot
  both made `b.state` share them), so a session that only toggled picks persisted NOTHING.
  Detached at both boundaries; no-restamp preserved; three cosmetic side notes logged in D120.
  ② **F1–F3 shipped** (D118): `guideSteps()`/`guideResume()` derive the per-decision chain
  statelessly (D121: the frontier ignores class steps; optional steps never capture re-entry);
  the coach rail renders it (side rail / phone bottom sheet, structural answers inline,
  spell-list pre-filter with a named note, auto-advance); all three entries exist, and
  reverse RECONSTRUCT places the build's own picks slot by slot (position = the answer,
  never deletes; verified: an illegal Bard 12 reordered to zero findings, the over-budget
  leftover flagged at top). ③ **Francesco's design notes → D122–D124, all DECIDED**: the
  timeline is a full MODAL (order flag by the title, casting tiles only where a clock moves,
  run dividers + rails that survive highlights, ghost "+" slots, wants/has count tiles,
  masked one-line chip rows); pact slots measure as count × level; metamagic mentions live
  in the spell details' "Metamagic" row (left the table); and the **Ember palette** shipped —
  terracotta accent, crimson alerts, all five theme blocks (P1 Verdigris was picked once
  then REVERSED — don't re-propose it).
- **Next action:** **G4 — the phase G 🔍 fresh-eyes gate** (fable, a SEPARATE session —
  this one coordinated the G1–G3 agents and cannot gate them): review the full-page guided
  builder against **D126(a–i)** + the standing D118(a–j); start from G3's gate notes in
  PLAN. Everything else shipped: the whole wave batch (W1/W2/W4/W5 → D128, D129), D127
  built (needs Francesco's one-click re-import per browser), phase G built G1–G3
  (v1.2.24 → v1.2.26). 🔶 still open on Francesco: the magic-item / reward import call.
- **Manual for Francesco:** ⓪ **Refresh your imported data in each browser** — ⋯ → **Refresh
  imported data** (choose the folder once if asked). Now also required for **D127** (v1.2.21):
  a stored digest keeps the hollow 2014 subclasses (no grants, duplicate pairs, missing
  classics) until re-imported; plus the earlier v1.2.2 fixes (Savant double-grant, tag
  suffixes, Imp's raw tag, D109 forms, D91 access). ① **Your build "v2" now shows a health ⚠ at L1–L4**
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

**Phase E is DONE** (D115, task bodies → `ARCHIVE.md#phase-e`) and **phase F is BUILT**
(D118) — F1–F3 shipped 2026-08-29; **F4, the fresh-eyes gate, is the only open task** and
needs a session that didn't build the phase. v7 (saved builds) is complete →
`ARCHIVE.md#v7-tasks`. Non-goals as narrowed by D115: no **authored** timeline (the level
view is derived from the acquisition order; versions are alternatives, never levels), no
server sync or accounts, no sharing a build as a page or URL (D36).

The queue is `PLAN.md`; the next action is named in the TL;DR.

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`
