# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D155 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-09-01 · **v1.5.7** built · D154 phase **K1 SHIPPED**; K2–K4 next)

- **v1.5.6 · D153 — the app follows the 5etools repo itself.** "Fetch 5etools data online"
  (now the Library's **Update data**) pulls the current release via the jsDelivr CDN — file list from the
  GitHub tree API, filtered through the REAL `zipWanted()` — into the same staging as a
  dropped zip; on Apply the release is recorded and a boot check offers each new one
  (dismissible per release, silent offline). The repo address is editable (mirror orgs
  rotate). A file failure is FATAL and owns the report (seen live: jsDelivr 403'd one file
  mid-burst and the worker fleet painted progress over the error — `dead` flag now).
  Pushed, LIVE, and already used: Francesco re-imported his 44 books with it.
- **v1.5.7 · K1 — the Library is ONE page, built and verified.** Tabs gone; status strip
  (books · 5etools version · parser · storage, accent-bordered when a release is out) owns
  the web fetch; G1 edition groups of R3 two-line rows (select-checkbox · name over kind
  counts · origin chip · enable switch, off = dimmed, no badge); the checkbox means SELECT
  and raises the selection bar, which holds the only Remove there is; footer **＋ Add files**
  (zip · JSON · folder · paste); the drop zone and drag-drop are gone. Removal proved singly
  and in bulk against his real 44-book digest and RESTORED byte-identical; 0 of 44 chips
  misaligned at 1280 and 375 in both themes; gate clean, cparity 51 ok / 0 fail.
  **D155 records the five calls D154 left open** — one Add-files button not the mockup's
  split, the repo address in Actions, the keep-plan staged-only until K2, the pinned flex
  column, and the per-book origin stamp with its migration rule (timestamp-matching was
  tried and is wrong).
- **D154 — the Library REDESIGN, the spec K1 built against.** Five AskUserQuestion rounds with
  real-stylesheet mockups (`scratchpad/mockups/library4.html` is the approved final;
  `mklib{,2,3,4}.py` regenerate). One page, no tabs; status strip owns **Update data**;
  R3 two-line rows (select-checkbox · kind counts · origin chip · enable switch, off =
  dimmed, no badge) in edition groups; monster-forge's selection bar for removal (checkbox
  now means SELECT); footer **＋ Add files ▾**; pending-import tray; **raw-stash + web
  refetch retires every refresh verb** (auto re-parse on a parser bump, one notice after);
  the standing Remove button and the drop zone are gone. monster-forge's "Preset
  libraries" was agent-investigated and deliberately aligned with — his request, not
  cross-contamination. **D154 owns every call and every rejected option.**
- The phase-J method lesson held again: he took B over the recommended A, and the
  selection bar over the recommended storage mode — **mock it, lead with his reading.**
- **Next action: K2** (the pending-import tray — restyle what is left of `#importPlan`
  into chips + new-book ticks + Discard / Add N books). Then K3 (raw-stash + web refetch,
  the model half) and K4 (retire the old machinery). Task lines in PLAN; D154 is the spec.
  Not gated. **v1.5.7 is built and committed but NOT pushed** — say so before deploying.
- **Manual for Francesco:** ① the four ⚑ copy/model calls in PLAN — the `…`-placeholder
  family; the chain rail's CSS `· optional` (styles.css:1822); `sbFav` edition tolerance;
  the orphaned ability-score note. ② D125's clamp now covers the trade (⚑, fix written
  down if it annoys). ③ Build "v2" health ⚠ at L1–L4 is real. ④ Print from Chrome or
  Safari (D108). ⑤ XMM on in Sources for Find Familiar's 2024 forms (D81). ⑥ Optionally
  ask GitHub Support to gc the pre-purge SHAs. ⑦ Nothing new from this session.
- Housekeeping: this block had lagged for five releases (v1.4.14 → v1.5.5 shipped from
  worktree sessions that never restamped it) — restamped now; the v1.5.x story is in
  CHANGELOG and D147–D152.

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

The queue is `PLAN.md` — a phase table pointing at the archived bodies, then the open ⚑
flags and the backlog. Phases E–I are all closed and gated; their models (D115, D118, D126,
D130, D131, D132) still bind any change to those surfaces, so cite them rather than
re-deriving.

**Docs were cleaned 2026-08-31** (`/clean`): the live set went 304 KB → 227 KB. Consumed
phase bodies, the wave batch, the 1.2.x changelog narrative and 43 settled decision bodies
moved to `ARCHIVE.md` — every one leaving a stub, every `*Rejected:*` clause kept in place.
→ archived: `ARCHIVE.md#state-consumed-0831` (STATE's own retired sections).

Phase J's own task bodies are still live in `PLAN.md` (ticked, with the original notes kept
under each). They are the natural next thing to archive — worth a `/clean` once the flags
below are answered, not before. **Phase K (the Library rebuild, D154) is OPEN**: K1 is
shipped in v1.5.7, K2–K4 are queued in PLAN.

⟳ Rename previous session → "The Library rebuild — phase K"  · session: resolve by
cwd + latest

