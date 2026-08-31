# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next and what is gated |
> | `DECISIONS.md` | Every decision D7–D139 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases and old rationale |

## TL;DR (2026-08-31 · **v1.4.1** at `d3719a1`, pushed · LIVE on Pages)
- **The reported bug is RESOLVED (2026-08-31, confirmed by Francesco).** It was the
  stale-library branch: his imported digest was behind, and the books that stayed wrong were
  ones the refresh **could not find in the linked folder to re-parse** — he relinked those
  sources manually and the refresh healed them. Hex and Lessons now read correctly on his
  browser. The method rule the episode produced is **D139** (and its Gotcha); the resolved
  account is below.
- Verified en route (first time with a controlling service worker): Pages serves the pushed
  build; a returning browser gets the PREVIOUS page on first load by design
  (stale-while-revalidate), and the v1.3.3 "newer version downloaded — Reload" notice
  appears correctly and offers the reload. **D137(d) is no longer unverified.**
- **Versioning changed → D140:** minor and major bumps only with Francesco's explicit
  approval (present the case, ask); patch stays the automatic per-commit default.
- **Next action:** nothing blocked — the queue is PLAN's standing backlog (⚑ calls and the
  🔶 magic-item/rewards decision). A rework survey was delivered 2026-08-31; direction
  awaits Francesco's pick.
- **Manual for Francesco:** the standing list is unchanged: three copy/model calls
  (the `…`-placeholder family; the chain rail's CSS `· optional` vs the card's "Optional",
  styles.css:1822; whether `sbFav` should be edition-tolerant); your build "v2" health ⚠ at
  L1–L4 (real: a Warlock 4 row holding 8 spells where the class knows 5); print from Chrome
  or Safari, not an in-app PDF writer (D108); turn XMM on in Sources for Find Familiar's 2024
  forms (D81); optionally ask GitHub Support to gc the pre-purge SHAs.

## ✅ The bug, resolved (2026-08-31)

**Cause, confirmed by Francesco:** his imported library was stale, and the books that stayed
wrong were ones the refresh **could not find in the linked folder to re-parse** — a partial
refresh can never heal a book the folder does not hold (D129's caveat, D138's per-book
stamps). He relinked those sources manually; the refresh then healed them and every symptom
cleared. The method rule this episode produced — no fix for a "works for you, not for me"
report without the reporter's own reading — is **D139** and its Gotcha entry; the
stale-digest reproduction is in GOTCHAS. The three releases it took (v1.3.2/v1.3.3/v1.4.0)
each fixed something real and all three now stand verified, including D137(d)'s update
notice (seen live with a controlling service worker, 2026-08-31).

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Now

**Nothing is open or owed.** The 2026-08-31 bug is resolved (block above); what remains is
the standing queue/backlog in PLAN.

**Phases E, F, G, H and I are ALL DONE** — every gate has passed (E8, F4, and on
2026-08-31 G4, H5 and I5, all three PASSED-WITH-FINDINGS with the findings fixed in
v1.2.39 → D133; the three gate questions answered by Francesco → D134, v1.2.40 — both
pushed and live). No phase is open, no gate is owed, no ⚑ from the gates remains. On top of
that, **D135 (v1.3.0) wired invocations and everything shaped like one** — designations,
repeatable takes, a record's own casting notes, and feature-granted feat slots — and
**D136 (v1.3.1)** fixed three wrong reads of the spell table and **D137 (v1.3.2)** made the
app say when its data is older than its parser. What
remains is the standing queue/backlog in PLAN.
v7 (saved builds) is complete → `ARCHIVE.md#v7-tasks`. Non-goals as narrowed by D115: no
**authored** timeline (the level view is derived from the acquisition order; versions are
alternatives, never levels), no server sync or accounts, no sharing a build as a page or
URL (D36).

The queue is `PLAN.md`; the next action is named in the TL;DR.

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`
