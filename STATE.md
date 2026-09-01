# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D161 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-09-01 · branch **v1.5.12** · **main is still 1.5.6 — nothing is merged**)

- **READ THIS FIRST: the merge is withheld.** `main` = **1.5.6** (`71a3d7b`); the branch
  `claude/new-session-u4ca0a` = **v1.5.12**. Pages builds `main:/docs`, so **the live site is
  still 1.5.6**. Francesco reviewed the branch build in a private artifact copy and asked for
  five changes to the ability editor before it goes in — they are **PLAN L6**, mocked and
  waiting on his pick between the alternatives. Nothing else blocks the merge.
- **The review copy:** <https://claude.ai/code/artifact/03d84f4d-c239-41ba-bf15-30df1cb7cc49>
  — the real v1.5.12 page, private, on its own storage (SRD 5.2 only, none of his 44 books).
  The artifact sandbox blocks **Update data** (no external fetch) and **every download**
  (build export, backup); everything else is live. Re-publish the same path to update it.
- **Shipped on the branch this session** — six releases, each with its own CHANGELOG row:
  - **v1.5.7–v1.5.10 · phase K, the Library rebuilt** (D154 + D155–D159): one page, status
    strip, R3 rows with origin chips, the selection bar as the only removal path, the
    pending-import tray, K3's automatic re-parse from a raw stash + D153 refetch, and K4
    deleting Refresh / Rescan / Forget and the remembered folder handle.
  - **v1.5.11 · D160** — the pooled caster level rounds UP, all half-casters in one bucket
    (Artificer included), keyed by DIVISOR so a future category inherits it.
  - **v1.5.12 · D161 L1–L4** — ability scores as a stack of contributions, the editor, the ASI
    as a choice on the feat, save DC / spell attack (including on the printed sheet) and the
    multiclass minimums.
  - **D157 is the one to remember:** the per-book parser stamp is now a build-time hash of
    `src/extract.js`, so an ordinary release no longer marks the library stale — only a real
    extractor change does. That is what makes K3's automatic re-parse safe.
- **Next actions, in order:** ① ask Francesco to pick A1/A2/A3 and B1/B2/B3 in PLAN L6 (the
  mockups are sent; `python3 scratchpad/mkabil2.py` regenerates them), build it, show him
  again, then **merge to main** — he asked for the merge once the changes land. ② L5 needs
  his Mac. ③ A `/clean` is overdue (phase J and K bodies are consumed).
- **This container cannot run `cparity.js`** — no 5etools mirror, and `data/` is gitignored.
  `data/data.json` here was reconstructed from the SRD digest inlined in `docs/index.html`
  (verified byte-identical rebuild before any edit), so `build.py` and the dev page work. No
  extractor was touched by phase K, D160 or L1–L4, so parity is unaffected — but **L5 changes
  both extractors and must be done where cparity can run.**
- **Manual for Francesco:** ① the four ⚑ copy/model calls in PLAN — the `…`-placeholder
  family; the chain rail's CSS `· optional` (styles.css:1822); `sbFav` edition tolerance;
  the orphaned ability-score note (**L1–L4 gives it a home now — the ASI step is a real
  choice**). ② D125's clamp now covers the trade (⚑). ③ Build "v2" health ⚠ at L1–L4 is real.
  ④ Print from Chrome or Safari (D108). ⑤ XMM on in Sources for Find Familiar's 2024 forms
  (D81). ⑥ Optionally ask GitHub Support to gc the pre-purge SHAs. ⑦ Phase K stays four
  patches — asked and answered (D159(e)), settled, not to be re-offered.

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
bounded set). **Ability scores are modelled since D161** (a stack of contributions, phase L);
proficiencies, equipment/AC and backgrounds are not.

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
K1–K4 — all four are built and shipped. **Phase L (ability scores, D161) is L1–L4 shipped,
L6 (his five notes) next and L5 waiting on the mirror.**

⟳ Rename previous session → "The Library rebuilt, and ability scores"  · session: resolve by
cwd + latest

