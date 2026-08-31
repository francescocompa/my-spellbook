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

## TL;DR (2026-08-31 · **v1.4.1** at `d261ea9`+handoff, pushed · LIVE on Pages · app content = v1.4.0)
- **State: ⚠ THE REPORTED BUG IS NOT FIXED.** Francesco still sees Great Old One's Hex as
  "at will" and Lessons of the First Ones granting no origin feat, **on his own browser**,
  on an updated version. It works in the agent's browser. **Three releases (v1.3.2, v1.3.3,
  v1.4.0) shipped fixes for three DIFFERENT plausible causes and none of them was ever
  confirmed to be HIS cause** — every one was reasoned from the agent's own environment,
  which has **no imported library** and therefore runs on the baked bundle. That is the
  mistake to not repeat.
- **Next action: 🔍 GET FACTS FROM FRANCESCO'S BROWSER BEFORE CHANGING ANY CODE.** Do not
  ship a fourth theory. The four numbers that settle it are in **⋯ → Library → Manage**
  (the parser line, added v1.4.0) and in the footer. If a console reading is easier, this
  one line answers everything at once — see **What is still unknown** below for what each
  value would mean:
  ```js
  ({ver:window.__VERSION__, url:location.href, imported:!!IMPORTED,
    digestStamp:(IMPORTED&&IMPORTED.meta||{}).parser, books:Object.keys((IMPORTED||{}).sources||{}).length,
    stale:(typeof staleBooks==="function")?staleBooks():"n/a",
    hex:((DATA.subclasses.find(s=>s.shortName==="Great Old One"&&s.source==="XPHB"&&s.classSource==="XPHB")||{grants:{fixed:[]}}).grants.fixed.find(g=>g.spell&&g.spell.name==="Hex")||null),
    lessons:((OPT_BY[key("Lessons of the First Ones","XPHB")]||{}).featSlots)||null})
  ```
- **Manual for Francesco:** ⓪ **Run the snippet above (or read ⋯ → Library → Manage) and
  paste the result back** — this is the one thing blocking the fix, and four rounds have now
  gone by without it. ① The rest of the standing list is unchanged: three copy/model calls
  (the `…`-placeholder family; the chain rail's CSS `· optional` vs the card's "Optional",
  styles.css:1822; whether `sbFav` should be edition-tolerant); your build "v2" health ⚠ at
  L1–L4 (real: a Warlock 4 row holding 8 spells where the class knows 5); print from Chrome
  or Safari, not an in-app PDF writer (D108); turn XMM on in Sources for Find Familiar's 2024
  forms (D81); optionally ask GitHub Support to gc the pre-purge SHAs.

## ⚠ The open bug — read this before touching anything

**Symptom (Francesco, 2026-08-31, unresolved):** on his browser, at an updated version,
Great Old One's Hex still reads "at will" and Lessons of the First Ones grants no extra
origin feat. **The same build is correct in the agent's browser.**

### What is VERIFIED (assert on these, don't re-derive them)
- **Both extractors emit the right records.** Asserted directly, not only through parity —
  `scratchpad/jsimport.js` drives `src/extract.js` over the real mirror and prints:
  GOO Hex `kind:"prepared"`, Lessons `featSlots:[{name:"Origin Feat",cats:["O"],…}]`,
  Agonizing Blast `repeatable:true` + 1 mark, Synaptic Static `save:["intelligence"]`,
  One with Shadows' note. `cparity.js` is 48/48, 0 fail.
- **The app renders them correctly when DATA carries them** — verified in-browser on the
  baked bundle and on a hand-built current digest.
- **A stale digest reproduces EVERY symptom exactly, and a current one clears every one.**
  Two lines: hand `IMPORT_CACHE` a copy of `window.__DATA__` with the new fields stripped and
  a previous-version stamp, call `assembleData()`.
- **Saved builds are not affected by any of this** — proven byte-identical across a
  stale→fresh digest swap. Builds store references, never rules.

### What is still UNKNOWN — and each answer points somewhere different
Nothing about the actual state of Francesco's browser was ever obtained. From the snippet:
- **`ver` is not 1.4.0** → he is on an older page. On Pages the service worker is
  stale-while-revalidate BY DESIGN, so a deploy is exactly one reload behind (v1.3.3 added a
  notice for it, unverified — SW registration fails in the agent's pane). On `dist/index.html`
  it updates the moment `build.py` runs. **This is the most likely answer and the cheapest to
  check.**
- **`imported` is false** → he is on baked data and the records should be right; if `hex`
  still reads innate then the build products are stale — rerun `python3 build.py`.
- **`stale` is a non-empty list** → the library really is behind; Refresh, then read the
  Library line again. Books the folder does not hold can never be re-read and are now named.
- **`stale` is empty but `hex.kind==="innate"`** → **a genuinely new bug**, and the first
  one that would NOT be a stale-data story. Chase `applyPlan`'s merge: `mergeDigests` lets
  the INCOMING record win per key, so a stored record could survive if its book was not
  re-parsed while its source stamp was.
- **`hex` is null** → his subclass record resolves elsewhere (a `_copy`/reprint identity
  problem, D127 territory), not a grant-kind problem at all.

### The mistake to not repeat
Each of v1.3.2 / v1.3.3 / v1.4.0 fixed something real (the app was silent about a stale
digest; the published build was silent about a waiting update; a partial refresh stamped the
whole library current). **None was confirmed to be the cause of what he reported.** Theorising
from an environment with no imported library is what produced three releases and no fix.
Ask for the reading first.

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Now

**⚠ One thing is OPEN and it is the only thing that matters: the bug above.** Everything
below is context.

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

⟳ Rename previous session → "Invocations audit, and three theories that didn't land"  · session: resolve by cwd + latest

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`
