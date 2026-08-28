# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next and what is gated |
> | `DECISIONS.md` | Every decision D7–D117 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases and old rationale |

## TL;DR (2026-08-28 · **v1.2.2**, `41494c0`, pushed · **LIVE on GitHub Pages**)
- **State:** working, committed, **pushed**, tags pushed, tree clean except this handoff.
  This session did three things. ① **D115 DECIDED** — the every-level design session ran:
  level is a **parameter** (editable slider, saved current level, pure order-slice, swap at
  level-up, build-wide health badge, chip + timeline popover), versions are **true
  alternatives**; the model is D115(a–j), the plan is **phase E (E1–E8)** in `PLAN.md`.
  ② **The two-lane audit shipped as v1.2.2**: unnamed-record guards + boot fallback (a
  malformed brew no longer bricks boot), the escaping pass on imported strings, the **Savant
  double-grant fix** (5etools grew structured picks; the hand table now retires itself),
  `[disambiguator]` strip, whole-record parity diff (35 checks / 0 fail), build.py marker
  asserts, import errors + storage-quota failures surfaced, a **Remove imported data** danger
  row, UA books on the Homebrew & UA shelf, caster-kind picker vocabulary, honest
  `meta.updated` (identical writes skipped), item DC/atk in source group headers, sticky gap
  banner + flagged chips, and the public build's **17 product-identity spells renamed** to
  their licensed SRD names (D116). ③ **Versioning is MAJOR.MINOR.PATCH** (D117): `bump.py`
  patch/`--minor`/`--major`, the old 1.x line retro-tagged v1.0.0→v1.2.1 (no history
  rewrite), release tags resume from v1.2.2. All verified in-browser (his builds untouched —
  byte-compared) and by the gate. Versions before this handoff read as: v1.7 ≙ v1.2.0
  (epic boons, D114), v1.3 ≙ v1.1.0 (the Library, D110–D113) — map in `CHANGELOG.md`.
- **Next action:** **E1** (phase E — a build at every level). The D115 design session ran
  2026-08-28 and is **DECIDED**: level is a parameter, versions are alternatives — the model is
  D115(a–j) in `DECISIONS.md`, the task lines are E1–E8 in `PLAN.md`. **D118 (same day) added
  the guided builder** — a coach-driven forward/reverse flow over the same substrate — as
  **phase F (F1–F4)**, strictly after the E8 gate; E1–E8 unchanged. The 🔶 **magic-item /
  reward import** decision is no longer gated and awaits Francesco's call.
- **Manual for Francesco:** ⓪ **Refresh your imported data in each browser** — ⋯ → **Refresh
  imported data** (choose the folder once if asked). The v1.2.2 parser fixes live in your
  stored digests only after it: heals the **Savant double-grant** (an Evoker was offered 5
  free picks instead of 3), the `[Area of Effect]`-style tag suffixes, and everything earlier
  (Imp's raw tag, D109 forms, D91 access). ① **Print from Chrome or Safari**, not from an
  in-app PDF writer: the filename and the clickable spell links come from the browser's own
  export, and some hosts ignore both (D108). ② **Turn XMM on in Sources** for Find Familiar's
  Monster Manual 2024 forms in the default view (D81). ③ Optional — ask GitHub Support to gc
  so the old unreachable commits (SHA 2c8bbb6 etc., held only in `backup/pre-purge-20260826`
  locally) stop being SHA-addressable. ④ To update the live site: `python3 extract.py` (if
  data changed) → `python3 build.py` → commit → push. ⑤ `dist/`, `data/`, `data-srd.json` are
  gitignored (local only); public SRD data is inlined in committed `docs/`. ⑥ An old rename
  note ("Print sheet, PDF options and familiar forms") could not be applied — two candidate
  sessions both carry meaningful titles ("General feats required zero state", "Importer
  rework and custom sources"); say which (if either) should take it.

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Now

**Phase E is the plan of record** (D115). v7 (saved builds) is complete — T1–T5 and T7, all six
task bodies and the storage shape → `ARCHIVE.md#v7-tasks`. Non-goals as narrowed by D115: no
**authored** timeline (the level view is derived from the acquisition order; versions are
alternatives, never levels), no server sync or accounts, no sharing a build as a page or URL
(D36).

The queue is `PLAN.md`; the next action is the 🔶 in the TL;DR.

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`
