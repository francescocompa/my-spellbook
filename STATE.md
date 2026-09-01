# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D156 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-09-01 · **v1.5.8** live · `550ae0c` · D154 phase **K1 + K2 shipped**, K3–K4 next)

- **The Library was rebuilt this session, in two releases, and both are pushed.** D154 locked
  the design last session against real-stylesheet mockups; K1 and K2 built it.
- **v1.5.7 · K1 — one page.** Sources|Manage tabs gone. A status strip (books · 5etools
  version · parser · storage, accent-bordered when a release is out) owns the web fetch and
  absorbed the four surfaces that each said a fragment of it. Under it, G1 edition groups of
  R3 two-line rows: select-checkbox · name over kind counts · origin chip (web / file /
  built-in, stamped per book at apply time) · enable switch, off = dimmed with no badge. The
  checkbox means **SELECT**; selecting raises the bar (Clear · one switch for the lot ·
  Remove, armed) which is **the only removal path there is**. Footer **＋ Add files** (zip ·
  JSON · folder · paste); the drop zone and drag-drop are gone. **D155** = the five calls
  D154 left open (one Add-files button not the mockup's split, the repo address in Actions,
  the keep-plan staged-only until K2, the pinned flex column, the origin stamp + its
  migration rule — timestamp-matching was tried and is **wrong**).
- **v1.5.8 · K2 — the pending-import tray.** Above the strip, only while staged: file chips ·
  the new books ticked · Discard / **Add N books**. It replaced D86's standing keep-plan and
  killed the plan's second meaning — **D156: the tray ADDS and cannot remove** (every stored
  book is folded back into the keep-set before the write). A book you already have is one
  sentence, not 44 untickable rows; the filter appears at ≥9 new books; `#importReport` stays
  OUTSIDE the tray so a fetch's progress and a removal's receipt still show. Also fixed on
  the way: the notice bar wrapped one word per line at 375 whenever it carried an action.
- **Method that held all session:** every destructive path was proved against his REAL
  44-book digest and restored **byte-identical** (`JSON.stringify` equal) — snapshot first,
  act, verify, restore. Do that again in K3; there is no fixture to test removal on.
- Earlier this line: **v1.5.6 · D153**, the app follows the 5etools repo itself (Update data
  → jsDelivr + the GitHub tree API, filtered through the REAL `zipWanted()`); he re-imported
  all 44 books with it. Full story in CHANGELOG and D153.
- **D154 is still the spec for K3–K4**, and its unbuilt half is the one that matters:
  **raw-stash + web refetch retires every refresh verb** — hand-added files stash their raw
  JSON at import, core content re-fetches via D153, and the re-parse runs AUTOMATICALLY in
  the background on a parser bump, announcing itself once, after. `scratchpad/mockups/library4.html`
  is the approved final mockup (`python3 scratchpad/mklib4.py` regenerates; gitignored).
- **Next action: K3** — the model half. Then K4, which now inherits a concrete dead-code list
  in PLAN (`folderForget` and `clearImport` are already orphaned; `refreshImported`,
  `staleBooks`/`refreshMissed` and the folder-scan chain are still live until K3 lands).
  Not gated.
- **Manual for Francesco:** ① the four ⚑ copy/model calls in PLAN — the `…`-placeholder
  family; the chain rail's CSS `· optional` (styles.css:1822); `sbFav` edition tolerance;
  the orphaned ability-score note. ② D125's clamp now covers the trade (⚑, fix written
  down if it annoys). ③ Build "v2" health ⚠ at L1–L4 is real. ④ Print from Chrome or
  Safari (D108). ⑤ XMM on in Sources for Find Familiar's 2024 forms (D81). ⑥ Optionally
  ask GitHub Support to gc the pre-purge SHAs. ⑦ **New, and not a bug:** the stale-parser
  notice now fires on every version bump ("read by parser v1.5.7 — this is v1.5.8"). It is
  D138 being honest, and **K3 is what replaces it** with a silent automatic re-parse. Dismiss
  it per version until then.

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
under each), and so are three small "closed in vX" sections. They are the natural next thing
to archive — **`PLAN.md` is past 300 lines and a full `/clean` is now worth running**, best
once phase K is finished rather than mid-phase. **Phase K (the Library rebuild, D154) is OPEN**: K1
shipped in v1.5.7 and K2 in v1.5.8; K3–K4 are queued in PLAN.


