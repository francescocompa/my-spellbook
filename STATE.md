# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D181 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-09-05 · **v1.5.39** live, pushed and tagged · `523793d` · **Phase N opened (D176) and N1 shipped, reviewed three times** · six releases this session, v1.5.34 → v1.5.39)

- **Where it stands.** The character-creator question was studied
  (`audits/character-creator-feasibility.md`) and answered by **D176**: every destination is
  valid (this app, character-forge/Notion, paper) and the boundary moves ONE rung at a time,
  scores + proficiency bonus first. **N1 shipped as v1.5.34** and drew three review rounds the
  same day: the ability tile is the control with a per-tile popover, the ⋯ fill menu (array ·
  point buy · type · roll with a formula · Optimize switch · armed clear), main tints, save
  borders (**D177 → D179**); the picked chips are grouped by level with the level tiles folded
  into the rows and a one-row scroller past twelve chips (**D180, D181**). The wizard's
  per-level tile was wrong and is fixed: copies never eat the lower levels' allowance
  (D178(f)). **A 2026-09-04 session shipped v1.5.31 → v1.5.33 (D174, D175) with no handoff.**
- **Next action: Phase M's M3 (feat filters) then M4 (wording)**, both small; after them N2
  (backgrounds) needs its own decision entry before anything is built (D176(c)). L5.5 onward
  still queued.
- **Manual for Francesco:** ① the **copy-veto pass** over `audits/copy-table.md` (227 rows;
  M4 will add to it); ② **PWA install check** on your phone (L5.6); ③ **third-casters are
  still pooled then floored** — Fighter 5 (EK) + Rogue 5 (AT) reads 3 where the table gives 2,
  a separate rules call; ④ the Library status strip names a parser version that is behind
  without saying that is now fine; ⑤ *"make all choices"* was read as "remove the level chip"
  only; ⑥ print from Chrome or Safari (D108); ⑦ XMM on for Find Familiar's 2024 forms (D81);
  ⑧ L5.5's format (copy the build as a level plan).
- **Read before touching the score block:** D176–D181 in that order; the CSS is inside
  `.menupop`, where `.menupop button` restyles every button — the D173 trap bit three times
  today (chips, the switch, the pills). **DECISIONS.md is past 3,100 lines and the doc set
  carries three consumed mockup rounds — a full `/clean` is overdue (D158(q)).**

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
bounded set). Ability scores and proficiency are not modelled.

## Now

The queue is `PLAN.md`: **Phase M** (D172) has **M3 and M4 left**; **Phase N** (D176, the
creator ladder) has **N1 done** and every further rung gated on its own decision entry.
Phases E–N models (D115, D118, D126, D130, D131, D132, D154–D156, D161–D181) still bind their
surfaces; cite them. `audits/` is a point-in-time artifact: `/clean` archives it once L5 has
consumed it, together with the three mockup rounds in `scratchpad/mockups/`
(`scores.html`, `picks.html`, `fold.html`, each with its `mk*.py`).

⟳ Rename previous session → "Character creator feasibility, scores, and the picks card" · session: local_d5588eff-b469-43ac-a8dc-493404743459

The queue after Phase M is N2 (decision entry first) and L5.5 onward — see `PLAN.md`.
