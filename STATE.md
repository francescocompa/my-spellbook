# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D141 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-08-31 · **v1.4.5** at `02f51fd`, pushed + tagged · LIVE on Pages)

- **Nothing is open, owed or gated.** Every phase (E–I) is closed and gated; the
  "works for you, not for me" bug is resolved; four releases shipped this session.
  What remains is PLAN's standing backlog — ⚑ calls that are Francesco's to make, plus
  the 🔶 magic-item/rewards decision.
- **The bug is RESOLVED** (confirmed by Francesco): his imported library was stale, and the
  books that stayed wrong were ones the refresh **could not find in the linked folder to
  re-parse** — he relinked those sources by hand and the refresh healed them. v1.4.4 then
  closed that dead end in the app itself. The method rule the episode produced is **D139**.
- **This session shipped v1.4.2 → v1.4.5** (four parallel worktree agents, merged one at a
  time with the verify gate re-run on each merged tree, 48/48 parity throughout):
  - **v1.4.2** — Lessons of the First Ones: a granted origin slot arrives WITH its giver,
    not at level 1, and its cap is full-plan, not PREVIEW-sliced. One cause, both symptoms.
  - **v1.4.3** — D68's own-class clock rounds UP: third-casters (2nd at 7) and 2014
    half-casters. Multiclass pooling still floors, verified byte-identical.
  - **v1.4.4** — the refresh carries you to the remedy; and `filterDigest` was dropping
    D138's per-book stamps, which had re-opened the "all current" false success.
  - **v1.4.5** — D141: the arrow orders both columns, the timeline has one current state,
    the `?` before Character view is gone, and the centering audit fixed `#clvlChip` at its
    root (dead D54 scrubber padding) plus a baseline bug on icon-label buttons.
- **Two rules changed this session.** **D140** — minor and major bumps need Francesco's
  explicit approval (present the case, ask); patch stays the per-commit default. **D141(d)**
  → CLAUDE.md: alignment on new/changed UI is **measured** (text rect vs container rect at
  1280 and 375), never eyeballed.
- **Next action: none blocked.** Francesco picks from PLAN. The nearest well-scoped items:
  `refreshAddFeat()`'s `#epicRow` (high-confidence, unreproduced), and the 2024 half-caster
  pooling flag found during v1.4.3.
- **Manual for Francesco:** ① the four ⚑ copy/model calls in PLAN — the `…`-placeholder
  family; the chain rail's CSS `· optional` vs the card's "Optional" (styles.css:1822);
  whether `sbFav` should be edition-tolerant; **and new this session**, where the guide's
  orphaned *"Ability scores aren't tracked, so ASI = skip the step"* line should live now
  that the `?` disclosure is gone. ② Your build "v2" health ⚠ at L1–L4 is real (a Warlock 4
  row holding 8 spells where the class knows 5). ③ Print from Chrome or Safari, not an
  in-app PDF writer (D108). ④ Turn XMM on in Sources for Find Familiar's 2024 forms (D81).
  ⑤ Optionally ask GitHub Support to gc the pre-purge SHAs.

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

⟳ Rename previous session → "The bug closed, and four releases in parallel"  · session: resolve by cwd + latest
