# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D172 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-09-02 · **v1.5.29** live, pushed and tagged · `4ed930a` · **Phase L's two open calls closed** · **Phase M opened and gated** · six releases this session)

- **Where it stands.** Both of the calls Phase L was waiting on are shipped, and three of his
  four closing notes with them: the **next-choice mark** and its Next state (D167), the
  **class picker** with a level-rewriting change (D168), the **one-answer vs several take
  mark** and the first class picker opening with its step (D169), the **rail collapsing from
  its own header** into a 54px column and the **class picker's own filters** (D170, D171), and
  a collapsed tile jumping to its level rather than expanding the rail (D172(a)).
  **Six releases, v1.5.24 → v1.5.29, all pushed and tagged.**
- **Phase M is open and it is the next thing.** His fourth note — audit every filter against
  5etools and rework them — was interviewed (D172). The SET is settled per picker; the SURFACE
  is his call between three mockups, and the phase is blocked on it. Nothing in it needs the
  extractors: every value is already in `data.json`.
- **Next action: his pick of `filters{1,2,3}.html`**, then M1 → M2 → M3 → M4 in order. After
  Phase M, L5.5 (copy the build as a level plan) still needs his format.
- **Manual for Francesco:** ① **pick the filter surface** — `scratchpad/mockups/filters1.html`,
  `filters2.html`, `filters3.html` (each also `-light`), the whole of Phase M waits on it;
  ② the **copy-veto pass** over `audits/copy-table.md` (227 rows), which M4 will add to;
  ③ **PWA install check** on your phone (L5.6); ④ **third-casters are still pooled then
  floored** — Fighter 5 (EK) + Rogue 5 (AT) reads 3 where the table gives 2, the same shape as
  the half-caster bug but a separate rules call; ⑤ the Library status strip names a parser
  version that is behind without saying that is now fine; ⑥ *"make all choices"* was read as
  "remove the level chip" only — if the progress counter should also count optional steps,
  that is one line; ⑦ print from Chrome or Safari (D108); ⑧ XMM on for Find Familiar's 2024
  forms (D81).
- **One thing lost, and it was mine:** the browser pane's throwaway test build. A snapshot held
  in a page global did not survive a reload and `setItem` wrote the string `"undefined"` over
  the store. None of your data — the pane profile holds none — and it is a GOTCHAS entry now.

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

The queue is `PLAN.md`: **Phase M (D172, the filter system)** is the live phase and it is
🔶 GATED on his mockup pick; **Phase L** is done through L5.4 with L5.5 onward still queued.
Phases E–L models (D115, D118, D126, D130, D131, D132, D154–D156, D161–D172) still bind their
surfaces; cite them. `audits/` is a point-in-time artifact: `/clean` archives it once L5 has
consumed it. DECISIONS.md is now 2,700+ lines; **D158(q) approved the index-plus-archive diet
for the next `/clean`**, together with the audits folder — it is overdue.

⟳ Rename previous session → "Guided builder, class picker and filters" · session: resolve by cwd + latest

