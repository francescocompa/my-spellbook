# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D148 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-08-31 · **v1.4.14**, committed · phase J shipped, one model bug closed)

- **Phase J — Francesco's 2026-08-31 notes batch, all eighteen items — is SHIPPED**
  (v1.4.8 → v1.4.12, decisions **D142–D145**), and v1.4.7 closed the last unflagged bug in
  the old queue. Nothing from the batch is owed. What remains is PLAN's standing backlog:
  ⚑ calls that are Francesco's to make, the 🔶 magic-item/rewards decision, and **one new
  flag this session created** (D125's clamp, below).
- **The method lesson, worth more than any single item: he rejected most of what I mocked
  and recommended, and his alternatives were better.** Masking a chip run behind its button
  beat stacking the row; naming the ACTIVE FILTERS as chips beat any "you are filtered"
  status; a hover-tip + dedicated modal beat a preview pane. Mock it, but lead with his
  reading — the mockups were still what made the choice fast.
- **What shipped, by decision:**
  - **v1.4.7** — `refreshAddFeat()`'s `#epicRow`: reproduced in BOTH directions and fixed.
    Third sibling of the `refreshAll()` staleness class (v1.2.29, v1.4.2). → GOTCHAS.
  - **v1.4.8 · D142** — the choices row keeps ONE line with the chip field masked behind its
    button (reusing D124's `.tlchips` pattern, never a second one); chip-only ability tiles;
    a funnel icon for every filters control with the ACTIVE filters named as chips; the
    familiar picker gains search + filters, "Other familiars", and creatures reached the way
    spells are. Plus a v1.4.5 regression: `.btn:has(>.lbl-ico)` outranked
    `.gh-toggle{display:none}` and showed a phone-only control at every width.
  - **v1.4.9** — the eligible list capped at 55vh (two-column layout only); the header slot
    goes to the guided builder and Random character becomes a real menu feature; the
    timeline's arrow moves to the header and stops moving when you use it.
  - **v1.4.10 · D143** — the level-up trade is a SECTION of the spellcasting step, not a step
    of its own; the guide's copy loses fourteen em dashes and one duplicated label.
  - **v1.4.11 · D144** — the ⋯ menu groups by object; and the custom builder's fields were
    never styled because **`el("input")` sets no `type` ATTRIBUTE and `input[type=text]` does
    not match it**. Two more of that shape beside it. A custom spell can now start from an
    existing one.
  - **v1.4.12 · D145** — the light theme SOLVED: **0 contrast failures across 698 rendered
    text nodes, in both themes.** "Too flat" WAS the border contrast.
- **v1.4.14 · D146 — a drop leaves an EMPTY SLOT.** Francesco reported that removing a spell
  in the guided builder moved everything else out of place. Reproduced on a clean Sorcerer 5:
  one drop at L1 re-dated **five of eight** survivors and made **two of them illegal**, and the
  emptied slot opened at the TOP. The cause was the model, not the guide — position IS the
  acquisition slot, so `splice` re-dates. Holes are real positions now, every VIEW strips them,
  and the acquisition walks consume them. Scope is **everywhere picks are level-mapped** (his
  call): spells, cantrips, feats, optional features. Verified: 0 re-dated, 0 illegal.
- **Next action: none blocked.** Francesco picks from PLAN. The nearest well-scoped item is
  the 2024 half-caster pooling flag (⚑, from v1.4.3). **Not yet run for this session: a
  `/handoff`** — STATE's block is restamped here but PLAN's phase J bodies are still live and
  a `/clean` was already queued behind the open flags.
- **Manual for Francesco:** ① the four ⚑ copy/model calls in PLAN — the `…`-placeholder
  family; the chain rail's CSS `· optional` vs the card's "Optional" (styles.css:1822);
  whether `sbFav` should be edition-tolerant; and where the guide's orphaned *"Ability scores
  aren't tracked, so ASI = skip the step"* line should live. ② **New this session:** D125's
  clamp now covers the trade — on a PART-BUILT character a trade at L4 clamps to L1 while the
  L1 picks are unfilled. Inherent to folding the two steps into one (D143(a)); the fix is
  written down if it annoys you in use. ③ Your build "v2" health ⚠ at L1–L4 is real (a
  Warlock 4 row holding 8 spells where the class knows 5). ④ Print from Chrome or Safari,
  not an in-app PDF writer (D108). ⑤ Turn XMM on in Sources for Find Familiar's 2024 forms
  (D81). ⑥ Optionally ask GitHub Support to gc the pre-purge SHAs.

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
below are answered, not before.

**A rename note was retired unapplied, so it is not retried a third time:** the note asking
for the previous session to become *"The bug closed, and four releases in parallel"* could
not be resolved at `/start` or at this close. `list_sessions` shows no My Spellbook session
newer than 14:30 on 2026-08-31, and that one ("Version bump review process") carries what
reads as a hand-written title covering a topic it really did discuss (D140) — renaming it
would more likely hit the wrong chat than the right one.

