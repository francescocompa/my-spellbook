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

## TL;DR (2026-09-01 · **v1.5.7** built · D154 designed, **phase K1 SHIPPED**, K2 next)

- **v1.5.7 · K1 — the Library is ONE page (D154(a–f,i) + D155).** Sources|Manage tabs gone;
  status strip owns **Update data** (books · 5etools version vs latest · storage, accent
  border when a release is out); R3 two-line rows in G1 edition groups (select-checkbox ·
  name over kind counts · origin chip `web`/`file`/`built-in`/`custom` · enable switch, off
  = dimmed, no badge); the selection bar is the only removal path (Clear · one switch ·
  Remove, armed) and **select all → Remove is the reset**; footer **＋ Add files ▾** (zip ·
  JSON · folder · paste). Drop zone and drag-and-drop are gone by decision. Onboarding is
  the page's own empty state. Origin is stamped per book at import beside the D138 parser
  stamp. Verified in a real browser: 16/16 functional checks, 0 contrast failures in both
  themes, alignment 0.00px at 1280 and 375.
- **D155 — the five calls K1 had to make** that D154 was never asked: the group all-tick is
  gone (search → Select shown → the bar's switch replaces it); the Library gets its own row
  renderer and `renderSourceChecklist` is untouched; the origin chip gains `custom` for the
  homebrew pseudo-book; "Remove imported data" dies in K1 rather than K4; ＋ Add files is
  one button with a caret, not a split. Read it before touching the page.
- **Still transitional, and commented so in the code:** the staged files + keep-plan +
  Apply block above the strip (K2 turns it into the tray) and Refresh / Rescan / Forget
  under a separator in Actions (K3 makes them unnecessary, K4 deletes them).
- **Next action: K2 — the pending-import tray** (D154(h)); then K3 (raw-stash + web
  refetch), then K4. Task lines in PLAN.
- **This container has no 5etools mirror and no `data/`** (both gitignored). `data/data.json`
  was reconstructed from the SRD digest inlined in `docs/index.html` so `build.py` runs —
  verified byte-identical output at the same VERSION before any edit. Consequence:
  **`node scratchpad/cparity.js` cannot run here.** Neither extractor was touched by K1, so
  parity is unaffected; run the gate in full on a machine with the mirror before the next
  extractor change.
- **Manual for Francesco:** ① the four ⚑ copy/model calls in PLAN — the `…`-placeholder
  family; the chain rail's CSS `· optional` (styles.css:1822); `sbFav` edition tolerance;
  the orphaned ability-score note. ② D125's clamp now covers the trade (⚑, fix written
  down if it annoys). ③ Build "v2" health ⚠ at L1–L4 is real. ④ Print from Chrome or
  Safari (D108). ⑤ XMM on in Sources for Find Familiar's 2024 forms (D81). ⑥ Optionally
  ask GitHub Support to gc the pre-purge SHAs. ⑦ **New:** phase K is landing in patch
  releases (D140 — minor is your call). When K4 closes, the whole Library rebuild may be
  worth a `--minor`; say the word and it takes one.

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
below are answered, not before. **Phase K (the Library rebuild, D154) is in PLAN with tasks
K1–K4: K1 is built and shipped, K2–K4 are open.**

⟳ Rename previous session → "Web sync and the Library redesign"  · session: resolve by
cwd + latest

