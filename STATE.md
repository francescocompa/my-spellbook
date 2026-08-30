# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next and what is gated |
> | `DECISIONS.md` | Every decision D7–D130 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases and old rationale |

## TL;DR (2026-08-31 · **v1.2.40**, committed locally, **NOT pushed** · Pages still serves v1.2.38)
- **State:** **all three gates ran 2026-08-31 and all three PASSED-WITH-FINDINGS** — G4,
  H5 and I5, each by a fresh opus@high agent coordinated by a session that built nothing
  (model policy satisfied). **Phases G, H and I are CLOSED.** The findings shipped as
  **v1.2.39 (D133)**, built by a third opus agent and verified before/after in-browser:
  ① the G4 blocker — `toggle`'s ambient reverse-placement intercept hijacked every surface
  sharing the one take/drop writer (an *unprepare* click silently REORDERED the wizard
  spellbook; a "Drop" chip reordered; a ✓ was dead) — placement is now explicit at the call
  site, `guidePlace` has one caller. ② The pick modal's pool/cap/hint/insert-position now
  derive from ONE number (the landing section's level, set per section — the gate's own
  per-step suggestion was wrong and the fix agent caught it). ③ One `guideDownPlaceable`
  predicate now owns all three Down-walk questions. ④ The chain's growth ghost no longer
  accepts drops (the one crack in G1's drag equivalence). ⑤ The duplicated column-inversion
  logic is extracted into one `levelColumn` owner — done the moment the gate proved the
  copies byte-identical; Gotcha updated. Plus the small ones (`.spmodal` print leak, cantrip
  noun, one `guideAdvance`, stale comments, chain top margin).
- **Next action:** **push** — `git push && git push --tags` deploys v1.2.39+v1.2.40 to
  Pages; deliberately left to Francesco. The three gate questions were asked and answered
  in-session → **D134** (Q1 cap kept + minimal alert, shipped v1.2.40; Q2 preview-on-exit
  kept as is, both alternatives rejected; Q3 two-line bar confirmed, D130(e) annotated).
  Nothing else is open but the standing queue; the fattest small item is still
  `refreshAddFeat()`'s `#epicRow` staleness.
- **Manual for Francesco:** ⓪ **Refresh your imported data in each browser — still the top
  item** — ⋯ → **Refresh imported data** (since v1.2.23 it runs inline and SHOWS a green
  "Re-imported N books" / a red reason). A pre-**D127** digest still holds the unresolved
  `_copy` twins, which is why **Aberrant/Clockwork/Wild Magic appear twice**, why every
  **2014 subclass grants nothing**, and why the **Arcane Trickster / Eldritch Knight picker is
  EMPTY** (verified: fresh data gives both 61 spells). ① **Three copy/model calls are yours**:
  the `…`-placeholder family ("+ add a class…", "all schools", "any save", "picked") — one
  call settles all of them; whether the chain rail's CSS-authored `· optional` should match
  the card's now-capitalised "Optional" (styles.css:1822); and whether `sbFav` should become
  edition-tolerant (a mark is stored per PRINTING, so it is not seen if a book toggle later
  resolves the other one — a storage-shape change). ② **Your build "v2" showed a health ⚠ at
  L1–L4** — not a false positive: its Warlock 4 row holds 8 spells where the class knows 5,
  five of them 3rd-level when a Warlock 4 casts at most 2nd. Fix or ignore, your call.
  ③ **Print from Chrome or Safari**, not an in-app PDF writer — the filename and the clickable
  links come from the browser's own export and some hosts ignore both (D108). ④ **Turn XMM on
  in Sources** for Find Familiar's Monster Manual 2024 forms in the default view (D81).
  ⑤ Optional — ask GitHub Support to gc so the old unreachable commits (SHA 2c8bbb6 etc., held
  only in `backup/pre-purge-20260826` locally) stop being SHA-addressable. ⑥ **Push to deploy
  v1.2.40** — the gate fixes and D134 are committed locally only; `git push &&
  git push --tags` puts them on Pages. ⑦ `dist/`, `data/`, `data-srd.json` are gitignored; public SRD data is
  inlined in committed `docs/`.

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Now

**Phases E, F, G, H and I are ALL DONE** — every gate has passed (E8, F4, and on
2026-08-31 G4, H5 and I5, all three PASSED-WITH-FINDINGS with the findings fixed in
v1.2.39 → D133; the three gate questions answered by Francesco → D134, v1.2.40). No phase
is open, no gate is owed, no ⚑ from the gates remains. What remains is the push that
deploys, and the standing queue/backlog items.
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
