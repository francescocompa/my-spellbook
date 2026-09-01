# C1 — app.js / index.html structure audit

Pillar C1 of the three-pillar audit (D157(e)). Scope: codebase health of `src/app.js`
(~10,150 lines, one file on purpose per CLAUDE.md) and `src/index.html` — structure, dead
code, duplication, sectioning, tooling, a linter proposal. No split of `app.js` (rejected in
D157(e)); sectioning and tooling are proposal-only. Extractors, the importer's data-model
correctness, storage and build.py belong to C3; the live browser sweep belongs to C2. This
report does not duplicate either.

Starting point: `audits/L0-sweeps.md` and `scratchpad/sweeps/*.js` in the main tree (copied
into this worktree unmodified, plus one new script — `scratchpad/sweeps/ids.js` — described
below). L0's five sweeps were re-run here and reproduce identically (see "L0 cross-check").

Worktree base commit: `00ab59e` (same as `main` at audit time).

---

## 1. Structure map

83 `// ── heading ──` sections (was 84; one orphan header merged, see §9). Full map —
start line, size in lines, section name:

| start | size | section |
|---:|---:|---|
| 25 | 75 | icons |
| 100 | 15 | content assembly: baked bundle (`window.__DATA__`) ⊕ imported 5etools ⊕ custom homebrew |
| 115 | 207 | imported content lives in IndexedDB (D93) |
| 322 | 53 | state + persistence |
| 375 | 222 | builds: many characters, many versions each (v7 · D33–D35) |
| 597 | 74 | rules helpers |
| 671 | 95 | grants / choices resolution |
| 766 | 31 | level preview (D54) |
| 797 | 8 | current level & swap events (E1 · D115(e,g)) |
| 805 | 115 | what each class may trade, and when (app-side hand table) |
| 920 | 24 | slice derivation (E2 · D115(b,c,h)) |
| 944 | 140 | empty slots (D146) |
| 1084 | 110 | feat slots a FEATURE hands you (D135) |
| 1194 | 19 | "order matters" (E7 · D115) |
| 1213 | 66 | consistency sweep (E4 · D115(f)) |
| 1279 | 221 | guided builder: step derivation (F1 · D118, regrouped by D130(c)) |
| 1500 | 79 | the build's pending choices, as sections (D126(g)) |
| 1579 | 298 | the guided builder PAGE (G1 · D126(a,b,c) · D130) |
| 1877 | 143 | the chain column (D126(b) · D130(a)) |
| 2020 | 440 | the decision stage (G2 · D126(d,e,g) · D130(b,c)) |
| 2460 | 345 | the guide's pick modal (G3 · D126(f) · D131(a,b)) |
| 2805 | 133 | custom spell sources (D55) |
| 2938 | 230 | compute |
| 3168 | 83 | toggling picks |
| 3251 | 31 | render |
| 3282 | 130 | choices panel |
| 3412 | 26 | folded level groups (both spell lists) |
| 3438 | 102 | spell-pick modal |
| 3540 | 191 | species / feat picker modal |
| 3731 | 212 | build manager (v7 · T3) |
| 3943 | 97 | build switcher (v7 · T4) |
| 4040 | 24 | export / import a build (v7 · T5) |
| 4064 | 145 | everything, in one file (D138) |
| 4209 | 57 | custom-source editor (D55) |
| 4266 | 296 | D94: the collapsed surface |
| 4562 | 77 | source reconciliation on activation (v7 · T2) |
| 4639 | 77 | prerequisite quick-fix (D41) |
| 4716 | 46 | prepare-daily modal |
| 4762 | 156 | a cantrip replaced on a LONG REST, not on a level-up |
| 4918 | 130 | custom spell authoring (stepped) → stored as a Homebrew source |
| 5048 | 35 | homebrew manager |
| 5083 | 81 | 5etools importer: parse raw files in-browser via SB_extract |
| 5164 | 114 | fetch straight from the 5etools repository, online (D153) |
| 5278 | 96 | additive imports and the book plan (D86) |
| 5374 | 101 | the pending-import tray (D154(h)) |
| 5475 | 236 | folder scan: index a local library BY BOOK (D92) |
| 5711 | 144 | Refresh imported data (D111 · D129) |
| 5855 | 123 | the imported digest is older than the parser (D137) |
| 5978 | 287 | table view: spell-table columns (D29) *(merged, was two headers — §9)* |
| 6265 | 140 | metamagic applicability tags (D123) |
| 6405 | 124 | casting-rule modifications (D85) |
| 6529 | 43 | section jump bar (mobile) |
| 6572 | 152 | level plan & the timeline popover (E5 · D115(j)) |
| 6724 | 178 | the timeline popover (E5 · D115(j)) |
| 6902 | 55 | the level column, shared, order-aware (D132) |
| 6957 | 404 | the level-plan row drag, shared (D122(e) · D126(b)) |
| 7361 | 274 | slots, cart and spell list render |
| 7635 | 23 | spell detail: hover tooltip + click modal |
| 7658 | 156 | spell text highlighting (monster-forge cc-* convention) |
| 7814 | 79 | forms a FEATURE adds to a spell (D109) |
| 7893 | 57 | the forms a feature opened up (D131(g)) |
| 7950 | 351 | the summon-forms chooser (D131(g)) |
| 8301 | 56 | entity detail: hover tip + click modal (D147) |
| 8357 | 381 | the detail modal, one layout per kind (D148) |
| 8738 | 96 | builder UI |
| 8834 | 42 | feat categories and the slots they fill (D84) |
| 8876 | 55 | feats and optional features: their own empty slots (D146) |
| 8931 | 175 | prerequisites (D31) |
| 9106 | 75 | optional features: invocations, metamagic, pact boons… (D28) |
| 9181 | 17 | "?" notes (D88) |
| 9198 | 17 | sources modal |
| 9215 | 42 | shared grouped source checklist (D27) |
| 9257 | 147 | the Library page: one list of books (D154) |
| 9404 | 166 | events |
| 9570 | 180 | folder scan wiring (D92) |
| 9750 | 50 | print / save as PDF |
| 9800 | 89 | the tracker: everything expendable, as boxes to tick |
| 9889 | 29 | the legend |
| 9918 | 57 | the spell-card appendix |
| 9975 | 18 | the print run |
| 9993 | 36 | the settings modal |
| 10029 | 27 | offline: the published build installs as an app |
| 10056 | 71 | test helper: random sample build (local only) |
| 10127 | 30 | boot |

### Reading order: verdict

Roughly 80% of the file reads top to bottom the way CLAUDE.md describes: bootstrap/data
layer → build-rules core (levels, slices, holes, feats, consistency sweep) → guided builder
→ compute/render/choices → build management → the importer pipeline (5083–5978, seven
sections, genuinely well-ordered: parse → online fetch → merge → tray → folder scan →
refresh → stale-parser notice, each one feeding the next) → the spell table → the level
plan/timeline → detail modals → the feat system → sources/Library → event wiring → print.
Three real deviations, findings C1-10 through C1-12 below.

### Proposed index comment

Not applied (a structural proposal only, per D157(e)). A ~20-line index comment at the top
of `app.js`, directly under the file's opening comment block, one line per major region
naming its line range — the "region" grain being coarser than the 83 headings (roughly the
groupings in the paragraph above). This gives a reader `Ctrl+F`-navigable landmarks without
touching a single line of the 83 existing headings, and costs nothing to keep in sync badly
(worst case it goes stale, same as any comment — it does not encode logic).

---

## 2. Dead and dying code

### Functions — `deadfns.js` (7 zero-reference)

All 7 independently re-confirmed by reading the code AND by ESLint's `no-unused-vars` (see
§7) landing on the same 6 app.js names — cross-validation from a second, differently-built
tool.

| function | file:line | verdict | owner |
|---|---|---|---|
| `activeFilterCount` | app.js:369 | dead now — no caller anywhere, not named in K4 | open, unscoped |
| `csrcUnitShort` | app.js:2818 | dead now — no caller anywhere, not named in K4 | open, unscoped |
| `buildToggleRowSingle` | app.js:4375 | dead now — no caller anywhere, not named in K4 | open, unscoped |
| `folderForget` | app.js:5489 | dead now, **K4-scoped** (PLAN.md names it) — do not remove, K4 retires it with the Forget-folder button | K4 |
| `clearImport` | app.js:5970 | dead now, **K4-scoped** (PLAN.md names it) — do not remove, K4 retires it with Remove-imported-data | K4 |
| `isOriginFeat` | app.js:8849 | dead now — no caller anywhere, not named in K4 | open, unscoped |
| `featureFirst` | extract.js:1191 | **not fixed, not mine** — C3's file. L0 flags this as a possible *abandoned correctness fix* (defined right before a `.sort()` that never applies it; `readOrder` is used instead), not simple dead code. Flagging for C3, not re-analysing here. | C3 |

Per the charter, none of the 6 open ones were deleted — deleting a function is K4's job
after K3, not a trivial fix. They're listed here as a **dead-code worklist** distinct from
K4's own list: `activeFilterCount`, `csrcUnitShort`, `buildToggleRowSingle`, `isOriginFeat`
are candidates for a *second*, small cleanup pass whenever K4 runs (same shape of change,
same verification: `rg` finds no caller, syntax gate, cparity where relevant).

### A dead-value variable `deadfns.js` couldn't see — found by ESLint, fixed as trivial

`deadfns.js` only tracks function-shaped bindings (`function name(`, `const/let name =
(...)=>`). Two module-level `let`s were **write-only** — assigned, never read anywhere —
which is a different shape of dead code entirely: not an orphaned function, a variable whose
entire *value* goes nowhere.

- `BOOT_MODE` (was app.js:10135, boot IIFE) — set to `"fresh"` then reassigned from
  `loadBuilds()`'s return value (`"loaded"|"migrated"|"fresh"`), never read. Fixed (§9):
  `loadBuilds()` is still called for its side effects, the return value is no longer stored.
- `TABLE_MM` (was app.js:6298, declared `let TABLE_MM=null`, assigned at 6156 inside
  `renderTable()` from `activeMetamagic()`) — never read. Checked carefully before touching
  it, because this pattern (a cache nothing reads) is exactly the shape of a *previously
  real* bug this codebase has hit (GOTCHAS' `refreshAll()`-staleness family): confirmed the
  feature itself is alive via a **direct** `activeMetamagic()` call at app.js:8165 (inside
  the spell-modal metamagic renderer) and a same-section comment ("`METAMAGIC_WHEN`/
  `activeMetamagic` feed that surface now") that names the newer path — `TABLE_MM` is a
  superseded cache from an earlier design, not a wiring gap. Fixed (§9): both the
  declaration and the dead assignment removed; `activeMetamagic()`'s own call inside
  `renderTable()` provided no side effect (confirmed pure — reads `state`/`OPT_BY`/`CLS_BY`
  only) so removing the assignment changes nothing observable.

Both fixes verified with `node -e "new Function(fs.readFileSync('src/app.js','utf8'))"`
(syntax gate) and a before/after `deadfns.js`/ESLint re-run (counts identical except the two
names dropping out of `no-unused-vars`, confirming no collateral effect — see §7).

### CSS — `deadcss.js` (30 zero-match, 1 possibly-dynamic)

L0 spot-checked 7 of 30 plus the 1 dynamic one. **The remaining 23 checked here**, with a
boundary-aware regex matching each token in `app.js`+`index.html` (excluding it appearing as
a substring of a longer hyphenated class, same rule `deadcss.js` itself uses): `twocol`,
`fmore`, `lvlnav`, `lvcell`, `tableopts`, `entgrants`, `lvltally`, `budgetnote`, `addFeat`,
`addEpic`, `onboard`, `runc0`, `runc1`, `runc2`, `runc3`, `phnote`, `gsh`, `gsub`, `gokline`,
`grinline`, `gchange` — **all 0 matches, confirmed dead**. `c1` — 0 matches, confirmed dead.
`c3` had 1 substring hit, but it's a comment example of a *choice-id* string (`"c3:pk0"` at
app.js:4180), unrelated to the CSS class — confirmed dead too.

**Result: all 30 of L0's `deadcss.js` findings independently confirmed, 30/30.** No token
survived a second look. Not touched (CSS removal wasn't offered as trivial-fix scope, and
`.libo-*` in particular — the pre-K1 tabbed-Library leftover L0 already flagged — is
adjacent to the machinery K4 is about to touch; bundling its removal with K4's pass avoids a
second `styles.css` diff over the same area).

### Other dead-weight categories checked

- **Unreachable branches:** none found (`grep`'d for `if(false)`/`if(true)` literals — 0
  hits; no obviously-dead conditionals).
- **`__PUBLIC__` branches:** exactly one gate (app.js:10045, the service-worker
  registration), correctly conditioned on `window.__PUBLIC__` — build.py sets this
  differently for `dist/`  vs `docs/`, so it is not a flag that's "always one value" in the
  sense the brief means; it's a real build-time switch working as designed.
- **Commented-out code:** none. Regex-swept for lines that look like a disabled statement
  (`// function`, `// const`, `// if(...)`, a bare call-looking line) — every hit was prose,
  not code.
- **TODO/FIXME/XXX:** zero in `app.js`, `index.html`, `styles.css`.
- **`console.log`/`console.debug`/`console.warn`/`console.error`:** zero anywhere in
  `app.js`.

---

## 3. Duplication and helpers

### C1-01 · four near-identical `.bchip` constructions, one already named

`bkTag` (app.js:8564) exists as the named helper for "book chip as an HTML string", and is
called twice (app.js:8567, 8571). Three other sites build the **same markup** — a
`<span class="bchip" data-book="…" data-page="…">…</span>` — inline instead of calling it:

- app.js:8147 (`sp.source`/`sp.page` — spell modal)
- app.js:8280 (`c.source`/`c.page` — creature modal)
- app.js:8670 (`src`/`giver.page` — feature/entity modal)

All four (the def + 3 inline copies) produce byte-identical markup for the same
`{source, page}` shape; the three inline ones differ from `bkTag` only in the *names* of the
local variables feeding it (`sp.source` vs `c.source` vs a bare `src`), not in the template
itself. `dupfns.js` correctly reported 0 duplicate *function bodies* — this isn't
function-level duplication, it's the same **inline template string** repeated across four
sites at a smaller grain than that sweep measures.

*Fix:* have the three call `bkTag({source, page})` (or `bkTag(sp)`/`bkTag(c)` directly, since
`bkTag` already reads `.source`/`.page` off whatever object it's handed) instead of
reimplementing. Size **S** — 3 call sites, no behavior change, each one independently
checkable against its own screenshot by C2 if wanted (no visual diff expected — same
markup). Not applied here: touches rendered HTML in three different modals, which the
charter reserves for someone verifying visually, not a blind trivial fix.

### C1-02 · the plural ternary, 39 sites, no shared helper

`n===1?"":"s"` / `n===1?"s":""` / `n>1?"s":""` appears **39 times** across `app.js` (every
occurrence read; all are the same "is this count singular" question on a different noun —
book, build, spell, file, charge, pick, slot…). One narrow helper exists —
`const nBooks=n=>n+" book"+(n===1?"":"s")` (app.js:5768) — but it's specific to the word
"book" and used only where that exact phrase is needed; every other of the 39 sites
reimplements the ternary by hand.

*Fix:* a generic `const pl=(n,w)=>n+" "+w+(n===1?"":"s")` (or a `plural(n, singular,
plural?)` if any noun needs an irregular form — none of the 39 do, all are regular `+s`)
would let most of the 39 collapse to one call each; `nBooks` itself could stay as a thin
wrapper (`n=>pl(n,"book")`) for its own call sites. Size **M** — mechanical, but 39 sites
across many unrelated features means real review surface, and a few of the 39 have a second
conditional glued on the same line (`e.g. app.js:4287`: `${onPool} spell${onPool===1?"":"s"}
spend${onPool===1?"s":""} charges`, two independent pluralizations in one template) that
would need care, not blind substitution. Not applied here — string-template surface, in
scope for L4's copy pass rather than a blind mechanical fix, and 39 sites is past what "a
truly dead local variable"-sized trivial fix covers.

### Other duplication checked, not found

- **Near-duplicate render fragments at function-body grain:** `dupfns.js` — 0 exact, 0 near
  (Jaccard ≥0.85) across 675 braced bodies; independently re-run here, same result.
- **Repeated DOM-query patterns:** no second `$("#x")` idiom found beyond the ordinary (every
  handler queries its own target once); no copy-pasted multi-line query block.
- **Level-ordinal formatting:** no duplicated "1st/2nd/3rd" computation found — spell levels
  arrive pre-formatted from the data layer (extraction side), so app.js never computes an
  ordinal suffix itself. Nothing to consolidate.
- **Inconsistent helper use elsewhere:** `xBtn` (15 call sites), `icoEl` (58), `attachTip`
  (57), `armConfirm` (9) all read as consistently used everywhere a matching control exists
  — no hand-rolled close button or hand-rolled tooltip attach found sitting beside a working
  helper.

---

## 4. State and render discipline

### Module-level state — who writes what

| state | declared | written by | notes |
|---|---|---|---|
| `state` | app.js:326 | every mutating handler, `applyState()` | the user's build; per CLAUDE.md, never mutated to test something |
| `R` | app.js:3252 | only `render()` | derived, rebuilt every render, safe to poke for a test |
| `PREVIEW` | app.js:767 (`setPreview`) | `setPreview()` only | module state, never saved (GOTCHAS) |
| `IMPORT_STAGE` | app.js:5087 area | importer/stage functions | cleared on Apply/Discard |
| `SHADOWED` | app.js:~200 (`buildIndexes`) | rebuilt on every `buildIndexes()` call, never captured | WeakSet, edition-dedupe |
| `CASTMODS` | app.js (module `let`) | `render()`, `renderClassRows()`, `refreshAll()` | **three** separate writers, all documented — GOTCHAS: "resolved per RENDER, not cached across one," because `#addClass`'s handler calls `renderClassRows()` without `refreshAll()` |

### The one buildHealth/PREVIEW rule — verified clean

GOTCHAS: "the consistency sweep must NEVER read `PREVIEW`" (D115(f)). Read `buildHealth()`
(app.js:1213–1279) in full: zero references to `PREVIEW` in the function body — the only
occurrence of the word in that section is a comment restating the rule. **Confirmed
holding.**

### `refreshAll()` membership vs. the class-level-staleness history

`refreshAll()` (app.js:9402): `CASTMODS=activeCastMods();refreshSpecies();refreshAddFeat();
renderClassRows();renderFeatChips();renderOptFeats();renderFormPins();
renderCustomSources();`.

GOTCHAS documents three past regressions from this exact shape — a `refreshAll()` member
that reads class levels going stale because a class-row handler (level stepper, swap class,
subclass, remove), `#addClass`, or a feat chip's ✕ calls `render()` **without**
`refreshAll()`. Checked the current state of both fixes:

- **`renderOptFeats()`** — v1.2.29's bug. `render()` (app.js:3251) calls it directly
  (line ~3269), with an inline comment explaining exactly why: it "used to run only inside
  `refreshAll()`… so the block kept the PREVIOUS level's cap." **Confirmed present and
  correct** — `renderOptFeats()` now runs on *every* `render()`, not just every
  `refreshAll()`.
- **`refreshAddFeat()`/the Epic Boon row** — v1.4.7's bug. `render()` also calls
  `refreshAddFeat()` directly, again with an inline comment naming the exact historical
  failure ("hidden at 19 with a slot owed, and still offered at 18 with none"). **Confirmed
  present and correct.**
- Every class-row handler (`renderClassRows()`, app.js:8738 section) that mutates
  `row.clsKey`/`row.subKey`/`row.level`/removes a row calls `renderClassRows();render();` as
  a pair — verified all four sites (`onchange`, subclass `onchange`, the level setter, the
  remove `xBtn`) — never `renderClassRows()` alone. So `render()`'s own direct calls always
  run after a class-level change; the historical failure mode (a level change that never
  reaches the level-aware code) is closed by construction on the current code, not just by
  the two named fixes.

**No new candidate for the same bug class found** — i.e., no other level-plan-reading
function that's a member of `refreshAll()` alone and NOT also reachable from `render()`
directly. This was the main thing worth checking here and it came back clean.

### C1-03 · `refreshAll();render();` runs two level-derived renders twice

21 call sites do `refreshAll();render();` back to back (`grep -c` on that exact substring).
Every one of them now runs `renderOptFeats()` and `refreshAddFeat()` **twice** in the same
tick — once as a `refreshAll()` member, once again as `render()`'s own direct call (the fix
described above). Both are pure, idempotent view functions (no state mutation, cheap DOM
diff-free re-render of a small block), so this is **not a correctness bug** — but it is
duplicated render work at every one of those 21 sites, and the reason isn't stated anywhere:
the comments on `render()`'s direct calls explain *why they had to move into render()*, but
don't note that `refreshAll()` still calls them too, now redundantly. Severity **minor**
(inefficiency, not correctness); size **S** to fix (drop the two calls from `refreshAll()`'s
own member list, since `render()` covers them unconditionally now) but touches a function
GOTCHAS has a three-strikes history on, so it belongs in front of a human, not blind-fixed
here.

### Re-entrancy / listeners in render paths

`handlers.js` sweep (g): 0 `addEventListener` calls on `document`/`window` inside a
`render*`/`refresh*` function — re-confirmed. The one flagged double-`onclick` assignment
(`renderLevelChip`, app.js — the `chip.onclick=null` reset before the real handler) is a
documented deliberate node-reuse reset, not an accidental overwrite — re-verified by reading
the surrounding code, matches L0's own read.

### Closure/top-level trap

GOTCHAS: "a top-level function may not call a closure local" — the `cellFor`/`slotCastable`
incident, fixed by moving `slotCastable` to module scope. Grepped for any other function
declared inside a render function's closure (`renderTable`, `renderCart`, `renderSpells`,
`compute`) that a *top-level* function might reach into — none found; `slotCastable` remains
the only historical instance and it stays module-scope today. The generic risk (a top-level
`const helperFn=...` sitting textually near, but logically outside, a render function it
looks related to) doesn't have a mechanical sweep here — ESLint's `no-undef` (§7) is the
closest machine check available, since a mis-scoped reference to a closure-local from
outside it *would* surface as `no-undef` at lint time, and the run reports **zero**
`no-undef` errors across all three files. That's not a proof the trap can't recur, but it's
the strongest available evidence it hasn't, right now.

---

## 5. Error handling

| surface | coverage | evidence |
|---|---|---|
| `localStorage.getItem/setItem/removeItem` | **25/25 call sites wrapped in try/catch** | every call site checked individually (app.js:113, 170, 177, 186, 198, 216, 492, 493, 4919, 5178, 5179, 5268, 5275, 5692, 5887, 5889, 5899, 5914, 5921, 6001, 6008, 9569–70, 9763, 9766) |
| `JSON.parse` | wrapped everywhere it can fail on untrusted input (imports, pastes, stored blobs); the handful of un-wrapped call sites are `JSON.parse(JSON.stringify(x))` round-trips of the app's OWN just-produced data (deep-clone idiom), which cannot throw | app.js:412, 500, 3779, 3824, etc. are all `JSON.parse(JSON.stringify(...))`; genuinely external input (app.js:4124, 5147, 5553, 5604, 9552, 9618) is all try/caught with a user-facing message |
| IndexedDB (`idbOpen`/`idbTx`/`idbGet`/`idbPut`/`idbDel`) | every promise path has an explicit `onerror`/`onblocked`/`onabort` rejecting with a real `Error`; every *caller* (`importLoad`, `importSave`) catches and degrades — IDB → localStorage → user-visible sentence | app.js:129–142 (the primitives), 167–216 (`importLoad`/`importSave`) |
| `fetch` (D153 online import) | `webJson`/`webResolve`/`webTree`/`webFetchAll` throw on failure (by design, no local catch); the one user-triggered entry point, `webSync()`, wraps the whole chain in try/catch/finally and writes the error into `#importReport` | app.js:5180–5251 |
| the passive background variant (`webUpdateNotice`) | deliberately **silent** on failure — documented in its own comment ("Quiet unless the answer is yes — offline, CDN down, never fetched… all say nothing") | app.js:5261–5265 |
| zip/folder file reads (`runScan`, `stageScanBooks`) | per-file try/catch with a `bad`/counter, summarized to the user afterward rather than aborting the whole scan on one bad file | app.js:5546–5610 |

**Overall verdict: this is a strength, not a weakness.** Every storage touchpoint checked
(25/25) is guarded; the two places that fail *silently* on purpose (`webUpdateNotice`, the
`_`-named inner catches throughout) are consistently the passive/background paths, and every
user-INITIATED action that can fail surfaces a sentence explaining what happened and, where
relevant, what to do about it (`importSave`'s quota-aware message is a good example: it
names entry/book counts and tells the user to untick books, not just "storage failed").
Nothing found that silently swallows a user-facing failure.

---

## 6. `index.html` cross-check

New script: **`scratchpad/sweeps/ids.js`** (this worktree, following L0's own conventions —
plain Node, no deps, reuses `_lib.js`'s tokenizer). Two directions:

- **(A)** every id `app.js` looks up (`$("#id")`, `getElementById("id")`,
  `querySelector("#id")`, and any other quoted `"#id"` string literal — broadened after the
  first pass missed ids threaded through a helper by name, e.g. `toggleMenu("#entMenuPop")`)
  that is defined **nowhere** (neither `index.html`'s static markup nor an `id="…"` app.js
  itself renders into a template).
- **(B)** the reverse: an id defined somewhere that app.js never looks up by id.

```
=== ids: 322 static ids (index.html), 3 templated ids (app.js), 310 distinct ids looked up by id in app.js ===

--- (A) referenced by app.js but defined NOWHERE --- [0]
--- (B1) static index.html id never looked up by id in app.js --- [15]
--- (B2) app.js-templated id never looked up by id in app.js --- [0]
```

**(A) is 0 — no dangling id lookup found.** A genuinely useful negative result: across 310
distinct id lookups and 322+3 defined ids, nothing in `app.js` reaches for an id that
doesn't exist anywhere. (Two earlier false-positive classes were caught and fixed inside the
script itself before trusting this: JS assignments shaped like `const id="c"+r.idx` were
initially mis-read as HTML `id="c"` attributes — filtered by checking the character right
after the closing quote isn't `+`; and the first, narrower reference-matching pass missed
every id passed as a plain string argument to a wrapper function.)

**(B1)'s 15 were checked by hand, one at a time.** All 15 turned out to be **false
positives of the static-analysis kind**, not real orphans — three distinct resolution paths
a purely textual sweep can't trace:

- `#gpHelpPlace`/`#gpHelpTrade` — read via `$("#gpHelp"+m)` string concatenation
  (app.js:2596, `m` = `"Place"`/`"Trade"`).
- `#importHelp`/`#planHelp` — never looked up by id at all; consumed generically by
  `wireHelpNotes()` via a `data-help="importHelp"` **attribute value** on a different
  element (index.html:303, :334), resolved through `document.getElementById(btn.dataset.help)`
  (app.js:9193-ish) — a cross-attribute link inside `index.html` itself, invisible to an
  app.js-only sweep.
- `#prBreak`/`#prCards`/`#prEligible`/`#prNotes`/`#prTracker`, `#secPicks`/`#secSlots` — read
  via `$("#"+key)` over an object's keys / an array's string values
  (`PR_FIELDS`, app.js:9997; `JUMP_SECTIONS`, app.js:6537) — the id string exists in the
  source, just not as one contiguous quoted `"#id"` literal.
- `#csrcPoolRow`, `#ghProg`, `#srcAskTitle` — the only three genuinely never referenced by
  id anywhere. All three are **wrapper elements** whose *children* are queried individually
  instead (`#csrcPool`/`#csrcRecharge` inside `#csrcPoolRow`; `#ghProgN`/`#ghBar` inside
  `#ghProg`), or (for `#srcAskTitle`) a static heading with no JS hook needed. Harmless —
  not removed here (index.html markup edits are out of trivial-fix scope), listed as
  **polish**.

**Net verdict: the id layer between `app.js` and `index.html` is clean.** No dangling
lookups, and every apparent orphan resolves to a legitimate indirect wiring path once
followed by hand.

---

## 7. Tooling proposal

### (a) L0 sweeps → the verify gate

Recommend joining **`deadfns.js`, `deadcss.js`, `handlers.js`, and this pillar's new
`ids.js`** to CLAUDE.md's verify gate, each **non-blocking (report, don't fail)** for now —
none of these has a "correct" target count that would make a hard exit-code threshold safe
today (e.g. `deadfns.js`'s 7 is expected to *shrink* once K4 lands, not sit at a fixed
number). Concrete exit-code policy to propose to CLAUDE.md:

- `ids.js`: exit **non-zero** on any (A) finding (a dangling id lookup is unambiguously a
  bug — 0 is the only correct answer) — this one CAN be a hard gate. Exit 0 on (B)
  findings (informational only, per §6).
- `deadfns.js`, `deadcss.js`, `handlers.js`: exit 0 always (as `all.js` already does),
  reviewed by eye until the K4 cleanup settles the "known baseline" count, at which point a
  future session can pin an expected count and fail on drift above it.
- `dupfns.js`, `storagekeys.js`: informational only, no gate — nothing to fail on.

### (b) ESLint

Flat config at **`eslint.config.js`** (this worktree, reviewable). `no-undef` (browser
globals via the `globals` npm package + each file's own small cross-file globals list),
`no-unused-vars`, `no-redeclare`, `eqeqeq` — nothing stylistic, per the charter. Installed
`eslint@9.39.5` + `globals@15` as devDependencies in this worktree only, ran once.

**Globals design:** `app.js`/`extract.js`/`docs/sw.js` are plain (non-module) `<script>`s
sharing one runtime global scope (`index.html:734–736` loads `data.js` → `extract.js` →
`app.js` in order). Each file's OWN top-level declarations are already in ESLint's scope —
nothing to list. The only bare (non-`window.`-prefixed) cross-file name `app.js` reads is
`SB_extract` (from `extract.js`); `window.__DATA__`/`window.__VERSION__`/`window.__PUBLIC__`
are always accessed through `window.`, so they need no global declaration at all.
`extract.js` needs one external: `JSZip` (loaded from a CDN `<script>` ahead of it, not
resolvable by npm — a real global, not a typo). `docs/sw.js` gets `globals.serviceworker`
(a different runtime — no DOM).

**`eqeqeq`: shipped in `"smart"` mode, not `"always"`, and this is itself a finding.**
Measured `"always"` first: 121 warnings in `app.js`, 18 in `extract.js`. Reading a sample
showed 116/121 in `app.js` were `==null`/`!=null` — the standard "null-or-undefined, either
is fine" idiom, not a bug. Switching to `"smart"` (which also permits comparing two literals
or a `typeof` result) drops **both files to zero** eqeqeq findings. **The codebase's loose-
equality usage is already 100% deliberate and idiomatic** — `"always"` would have been pure
noise here; shipping it that way would have taught the team to ignore the linter.

**Final counts, `eqeqeq:"smart"`, after the trivial fixes in §9:**

| file | no-undef | no-redeclare | eqeqeq (smart) | no-unused-vars | total |
|---|---:|---:|---:|---:|---:|
| `src/app.js` | 0 | 0 | 0 | 57 | 57 |
| `src/extract.js` | 0 | 0 | 0 | 4 | 4 |
| `docs/sw.js` | 0 | 0 | 0 | 1 | 1 |
| **total** | **0** | **0** | **0** | **62** | **62** |

**Zero `no-undef` and zero `no-redeclare` across all three files is itself a real, positive
result** — it means the globals list above is complete (nothing accidentally leaked as
"undefined") AND that 10,150+ lines of hand-written top-level declarations never collide
with each other or shadow a browser global. That's not free — it's what a linter is *for*
finding — and this codebase already has it.

**`no-unused-vars` (62 total) breakdown, `app.js`'s 57:** the large majority (~46 of 57) are
`catch(e)`/`catch(_)` parameters never read inside the catch block, or a callback parameter
intentionally discarded (`(it,kind)=>...` where only one is used) — both are ordinary,
deliberate JS idiom, not real dead locals. The genuinely actionable subset:
`activeFilterCount`, `csrcUnitShort`, `buildToggleRowSingle`, `isOriginFeat`,
`folderForget`, `clearImport` — **the same 6 functions §2 already found by reading the code**
(independent cross-validation, two different tools, same answer), plus **two constants
`deadfns.js` couldn't see because it only tracks function-shaped bindings**: `TABLE_MM` and
`ABIL_FULL` (app.js — `ABIL_FULL`, a `{str:"Strength",…}` lookup table, zero references
anywhere; not fixed here — deleting a whole data table read more like K4-shaped work than a
single dead variable, so it's listed as a finding, not applied). `TABLE_MM` was fixed (§9).

**Recommendation — should the `package.json` land?** **Yes, with the config as delivered.**
D157(e) pre-authorized "the first `package.json` in the project, accepted knowingly" for
exactly this purpose. The zero-`no-undef`/zero-`no-redeclare` result validates the globals
list is accurate (not just permissive), and `eqeqeq:"smart"` is calibrated against this
actual codebase rather than shipped as a stock preset that would have buried 3 real findings
under 136 false ones. **Not** recommended: committing `package-lock.json` blind — it's
present in this worktree (`npm install` generated it) and is fine to land alongside
`package.json` if the recommendation is accepted, but that's Francesco's call per the
existing "first package.json" framing, not something to force through in an audit commit.
`node_modules/` was already in `.gitignore` before this session; confirmed still excluded.

### (c) Stylelint

Not run. `styles.css` issues found in this audit (30 dead selectors) are a **selector**
problem `deadcss.js` already covers with the surrounding-code context stylelint can't see
(whether the token is truly unreferenced across three files, not just unused-looking).
Nothing else surfaced in this pillar's work — no malformed CSS, no obvious specificity
footgun beyond what GOTCHAS already documents and has already fixed (the `:has()` /
`.gh-toggle` incident, the `.tk.over`/`.tk.on` incident) — that stylelint's ruleset would
add value finding. Per the charter ("only if it finds something real"), skipped.

---

## 8. Ranked findings

| id | severity | file:line | what | size | D-ids |
|---|---|---|---|---|---|
| C1-01 | minor | app.js:8147, 8280, 8564, 8670 | 3 inline `.bchip` constructions duplicate the `bkTag` helper instead of calling it | S | D39 (`.bchip` naming rule) |
| C1-02 | minor | app.js, 39 sites | plural ternary repeated with no shared helper | M | — |
| C1-03 | minor | app.js:9402 (`refreshAll`), 21 call sites | `renderOptFeats()`/`refreshAddFeat()` run twice per `refreshAll();render();` call | S | GOTCHAS (`refreshAll` staleness family) |
| C1-06a | minor | app.js:369, 2818, 4375, 8849 | 4 dead functions, not K4-scoped, no owner | S ×4 | — |
| C1-06b | minor | app.js (`ABIL_FULL`, `.` dead constant) | dead data table, zero references, found only by ESLint | S | — |
| C1-07 | minor | styles.css, 30 selectors | dead CSS confirmed 30/30 (7 by L0, 23 here) | S (batch) | D154 (`.libo-*` predates the K1 rework) |
| C1-08 | minor | app.js:5104, 7801(≈), 8112, 8114 | 4 raw glyph characters standing in for icons, violate D57 | S ×4 | D57 |
| C1-09 | major (handoff to C3) | extract.js:1191 | `featureFirst` — possibly an abandoned correctness fix, not simple dead code; needs extract.py comparison | — | — |
| C1-10 | minor | app.js:2805, 4209–4562, 4918–5048 | custom-source/custom-spell material split across 3 non-adjacent locations | — (proposal only) | — |
| C1-11 | minor | app.js:9257 vs 5083–5978 / 9570 | Library page sits ~4,000 lines from the importer/folder-scan machinery that feeds it | — (proposal only) | D154 |
| C1-12 | polish | index.html: `#csrcPoolRow`, `#ghProg`, `#srcAskTitle` | 3 static ids genuinely never looked up by id (wrapper divs / a static heading) | S | — |
| C1-13 | polish | app.js:5978 | orphan section header, umbrella label with no content of its own | trivial | fixed, §9 |
| C1-14 | polish | app.js (was :10135, :6298/:6156) | 2 write-only module variables (`BOOT_MODE`, `TABLE_MM`) | trivial | fixed, §9 |

No finding here carries a behavioural consequence C2 would need to reproduce in the
browser — everything above is dead weight, duplication, or an organizational proposal, not
a functional bug. (C1-09 is the one item that MIGHT be a functional bug, but it's in
extract.js/extract.py, outside this pillar and C2's browser scope alike — it's C3's repro to
write, not this report's.)

---

## 9. Trivial fixes applied (D157(a))

1. **app.js:6154–6156 area** — removed the dead-value assignment `TABLE_MM=activeMetamagic();`
   inside `renderTable()`, and the now-fully-dead `let TABLE_MM=null;` declaration
   (was app.js:6298). Verified `activeMetamagic()` is pure (no side effects) before removing
   the call target entirely, and that the feature it feeds is alive via a direct call
   elsewhere (app.js:8165) — see §2.
2. **app.js (boot IIFE)** — removed the dead-value `let BOOT_MODE="fresh";` declaration and
   its reassignment from `loadBuilds()`'s return value; `loadBuilds()` is still called for
   its side effects, just no longer stored anywhere.
3. **app.js:5978** — merged an orphan `// ── table view ──` section header (zero lines of
   content of its own, immediately followed by `// ── spell-table columns (D29) ──`) into
   one heading: `// ── table view: spell-table columns (D29) ──`.

No function was deleted (K4's job, after K3, per the charter); no behaviour changed (both
variable removals are write-only values nothing reads — confirmed by grep AND by ESLint's
`no-unused-vars` before touching them); no section was reordered.

**Verification, each step re-run after all three edits:**

```
node -e "new Function(require('fs').readFileSync('src/app.js','utf8'))"        → OK
node -e "const fs=require('fs');['src/app.js','src/extract.js','docs/sw.js']
         .forEach(f=>new Function(fs.readFileSync(f,'utf8')))"                  → OK
python3 -c "import ast;ast.parse(open('extract.py').read());
            ast.parse(open('build.py').read())"                                 → OK
python3 -c "import json;json.load(open('docs/manifest.webmanifest'))"           → OK
node scratchpad/sweeps/all.js
  deadfns.js: 7 / 0     (unchanged — none of the 3 fixes touch a deadfns.js-tracked name)
  deadcss.js: 30 / 1 / 0 (unchanged)
  dupfns.js:  0 / 0      (unchanged)
  storagekeys.js: 16     (unchanged)
  handlers.js: 1/0/0/0/8/0/1 (unchanged)
npx eslint src/app.js
  no-unused-vars: 58 → 57 → (after both dead-var fixes)  — confirms exactly the two
  names dropped out and nothing else moved
```

`data/data.json` isn't present in this worktree (gitignored, generated, per GOTCHAS' own
note that a fresh worktree has no `data/`) — that leg of the verify gate wasn't run; nothing
in this session touches `extract.py`/`data/` so it isn't expected to matter, and `cparity.js`
was likewise not run for the same reason (no extractor edits were made).

---

## For the docs

Not edited — shared-doc edits are out of scope for this pillar (`STATE.md`, `PLAN.md`,
`DECISIONS.md`, `GOTCHAS.md`, `CLAUDE.md` untouched). Flagged here for whoever runs the L3
triage interview and the eventual doc pass:

- **PLAN.md's K4 task** could grow a short "while you're in there" line pointing at
  `activeFilterCount`, `csrcUnitShort`, `buildToggleRowSingle`, `isOriginFeat` (C1-06a) and
  `ABIL_FULL` (C1-06b) — same shape of change as `folderForget`/`clearImport`, same
  verification, just not currently named by K4 and not blocking it.
- **CLAUDE.md's verify gate** is a candidate to grow the four lines proposed in §7(a), once
  Francesco decides which sweeps graduate from "session script" to "gate member" and which
  exit-code policy he wants.
- **GOTCHAS.md** doesn't need a new entry from this pillar — nothing found here is a *new*
  trap; `refreshAll()`'s staleness pattern (C1-03) is the existing entry working as
  documented, not a new one.
- **A future `/decision` entry**, if the eslint tooling is accepted, should record: eslint
  version pinned, `eqeqeq:"smart"` chosen over `"always"` and why (the 121→0 measurement in
  §7(b)), and whether `package-lock.json` lands with it.

---

## Claims register

Numbered claims with `file:line` for the wave-2 verifier. Every claim below was checked by
reading the cited code directly (not inferred from a comment or a sweep's own summary
alone), except where the claim IS about what a sweep reported, in which case the sweep's
raw output is the citation.

1. `app.js` is 10,155 lines after the 3 trivial fixes (was 10,159). Section count 83 (was
   84). — regenerated with a one-off Node script counting `// ── … ──` lines; reproducible
   with `grep -c "^// ──" src/app.js`.
2. The 7 `deadfns.js` zero-reference functions and their line numbers — app.js:369, 2818,
   4375, 5489, 5970, 8849 (shifted from 8852 by the 3 line removals above `it`), and
   extract.js:1191. Verified each by `grep -n` for the name across `app.js`, `extract.js`,
   `index.html` (whole-word boundary), confirming exactly one hit (the definition).
3. `folderForget` (app.js:5489) and `clearImport` (app.js:5970) are the two functions
   PLAN.md's K4 task names — verified by reading `PLAN.md`'s K4 bullet directly, which cites
   the identical two line numbers.
4. All 30 `deadcss.js` zero-match tokens confirmed dead — 7 previously by L0 (re-verified
   here by re-reading its report), 23 independently re-checked here with a boundary-aware
   regex over `app.js`+`index.html` (script at `/tmp` during the session, logic reproduced
   inline in this report's §2; not committed as a separate file since `deadcss.js` itself
   already IS the reusable version of this check).
5. `TABLE_MM` (was app.js:6156 assignment, :6298 declaration) had exactly 2 occurrences
   pre-fix (`grep -n "TABLE_MM" src/app.js`) and 0 after. `activeMetamagic()` (app.js:6299
   pre-fix) is called directly elsewhere at app.js:8165 (`const mm=activeMetamagic();`) —
   confirms the feature survives the removal.
6. `BOOT_MODE` had exactly 2 occurrences pre-fix, 0 after (`grep -n "BOOT_MODE"
   src/app.js`).
7. `bkTag` (app.js:8564) is called at app.js:8567 and 8571 (2 sites); the 3 inline
   duplicates are at app.js:8147, 8280, 8670 — all 5 read directly, template strings compared
   character-by-character (modulo the source variable name).
8. The plural-ternary pattern count of 39 — `grep -c '===1?"":"s"\|===1?"s":""\|>1?"s":""'
   src/app.js` (reproducible one-liner, cited verbatim).
9. `refreshAll()` (app.js:9402) member list and `render()`'s (app.js:3251) direct calls to
   `renderOptFeats()`/`refreshAddFeat()` — both read directly; the `refreshAll();render();`
   count of 21 is `grep -c "refreshAll();render();" src/app.js` (exact-substring count —
   a few sites have e.g. `save();refreshAll();render();` which still contains the substring
   and is included; this is a lower bound on "sites where both run", not an over-count).
10. `buildHealth()` (app.js:1213–1279 section) contains zero live references to `PREVIEW` —
    read the full ~66-line section; the only occurrence of the string "PREVIEW" is inside a
    `//` comment.
11. 25/25 `localStorage` call sites wrapped in try/catch — full list of line numbers in §5's
    table, each one read individually (not sampled).
12. The `ids.js` cross-check: 0 dangling references (category A), 15 raw B1 orphans reducing
    to 3 genuine ones after manual resolution-path tracing (§6) — script at
    `scratchpad/sweeps/ids.js` in this worktree, runnable directly
    (`node scratchpad/sweeps/ids.js`), output reproduced verbatim in §6.
13. ESLint final counts (§7 table): reproducible via `npx eslint src/app.js`,
    `npx eslint src/extract.js`, `npx eslint docs/sw.js` from this worktree after `npm
    install` (devDependencies in `package.json`; `package-lock.json` present).
14. `eqeqeq:"always"` vs `"smart"` counts (121→0 for app.js, 18→0 for extract.js) —
    reproducible by temporarily swapping the rule option in `eslint.config.js` and re-running
    (was measured, then the "smart" config is what's actually committed).
15. `SB_extract` is the only bare (non-`window.`-prefixed) cross-file global `app.js` reads;
    `window.__DATA__`/`window.__VERSION__`/`window.__PUBLIC__` are all read via `window.`
    property access — `grep -noE "window\.__[A-Z_]+|__VERSION__|__PUBLIC__|SB_extract"
    src/app.js`, every non-`window.`-prefixed hit manually checked and found to be inside a
    comment except the `SB_extract` call sites themselves.
