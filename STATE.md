# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D158 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-09-02 · **v1.5.24** live, pushed and tagged · `d978a40` · D157 audit DONE · **Phase K closed** · L5.1–L5.4 shipped · the guided builder reworked three times on his review)

- **Where it stands.** The audit line (D157/D158) is finished through wave 3, Phase K is closed,
  and **L5.1–L5.4 all shipped**: the raw stash and the parser fingerprint (K3, D159), the old
  refresh machinery retired (K4), the headless engine test as the gate's eighth line with the
  pooling correction as fixture one (L5.2, D158(b)/(j)), the first import merging onto the
  bundle (L5.3, D160), and the guide stage rebuilt around its picker (L5.4 → D161, D162, D164,
  D165, D166). **Nine releases this session, v1.5.16 → v1.5.24, all pushed and tagged.**
- **The guided builder is where his attention is.** Three review rounds, each with mockups
  approved before code (`scratchpad/mkguide.py` → `mockups/guide1..11.html`). It now opens its
  picker by default, with no dialog chrome, a detail pane that opens on a name click above
  1100px, chips instead of one opener per section, and a collapsible chain rail.
- **Next action: his two open calls, then L5.5.** ① the **class picker** — a class cannot be
  changed once chosen and needs the full-size picker the others have (size M; changing a class
  rewrites a row rather than adding one, which is the part to think about); ② **highlighting the
  next choice** plus the new Next state — **mockup with three options is ready**,
  `scratchpad/mockups/guide11.html` (A accent ring · B leading dot · C the rest recede), his
  pick then build. After those, L5.5 (copy the build as a level plan) needs his format.
- **Manual for Francesco:** ① **pick a highlight option** (guide11) and say whether Next should
  name where it goes ("Next: spellbook spells"); ② the **copy-veto pass** over
  `audits/copy-table.md` (227 rows) is still owed; ③ **PWA install check** on your phone (L5.6);
  ④ **third-casters are still pooled then floored** — Fighter 5 (EK) + Rogue 5 (AT) reads 3
  where the table gives 2, the same shape as the half-caster bug but a separate rules call;
  ⑤ the Library status strip reads "parser v1.5.15" on a newer app — accurate, but it names a
  version that is behind without saying that is now fine; ⑥ *"make all choices"* from your notes
  was read as "remove the level chip" only — if the progress counter should also count optional
  steps, that is one line; ⑦ print from Chrome or Safari (D108); ⑧ XMM on for Find Familiar's
  2024 forms (D81).

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

The queue is `PLAN.md`: **Phase L (D157/D158)** is the live phase, L0–L4 done, **L5 is the
build list** (L5.1 = K3/K4 done; **L5.2 is next**). Phases E–K models (D115, D118, D126, D130, D131, D132, D154–D156)
still bind their surfaces; cite them. `audits/` is a point-in-time artifact: `/clean` archives it
once L5 has consumed it. DECISIONS.md is 2,300+ lines; **D158(q) approved the index-plus-archive
diet for the next `/clean`**, together with the audits folder.

⟳ Rename previous session → "Guided builder rework"  · session: resolve by cwd + latest
