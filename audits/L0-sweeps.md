# L0 sweeps — dead weight and wiring pitfalls

Five deterministic, dependency-free Node scripts over `src/app.js`, `src/extract.js`,
`src/index.html` and `src/styles.css`. They are reports, not gates: nothing fails a build,
nothing is auto-fixed. Run any of them with `node scratchpad/sweeps/<name>.js`, or run all
five plus a one-line summary with:

```bash
node scratchpad/sweeps/all.js
```

All five share `scratchpad/sweeps/_lib.js`, a small hand-rolled JS tokenizer. It classifies
every character of a source file as code, comment, string/template-literal content, or
regex-literal content, tracking `${...}` template interpolation as real code (nested
template literals included) and doing a best-effort regex-vs-division disambiguation so a
stray `//` or `/*` inside a regex isn't misread as a comment. This is what lets the sweeps
tell "a function name inside a comment" apart from "a function name inside a live template
string" apart from "a function name actually called".

**Known tokenizer limitations** (accepted, not worth the engineering cost to close):
an escaped backtick `` \` `` inside a template literal would be misread as a delimiter by
the `<button>`-nesting and glyph checks, which pair up backticks by simple toggling rather
than honouring the escape — no such case was found in this codebase, but a future one
could produce a false split. The regex-literal heuristic is a lookbehind on the previous
significant token, not a real parser; it held up on every case actually hit here.

## How to run

```bash
node scratchpad/sweeps/deadfns.js       # sweep 1 — unreferenced functions
node scratchpad/sweeps/deadcss.js       # sweep 2 — unreferenced CSS class/id selectors
node scratchpad/sweeps/dupfns.js        # sweep 3 — exact/near-duplicate function bodies
node scratchpad/sweeps/storagekeys.js   # sweep 4 — every storage key, read/write/remove sites
node scratchpad/sweeps/handlers.js      # sweep 5 — GOTCHAS.md wiring pitfalls
node scratchpad/sweeps/all.js           # all five + one-line summary, exit 0 always
```

## Summary

| sweep | finding | count | notes |
|---|---|---:|---|
| deadfns | zero-reference functions | 7 | includes the two known orphans from PLAN.md K4 (cross-check passes) |
| deadfns | string-only-referenced functions | 0 | no dynamic (string-dispatched) wiring found |
| deadcss | zero-match class/id tokens | 30 | mostly plausible leftovers from superseded UI (e.g. `libo-*` predates D154's Library rework) |
| deadcss | possibly-dynamic tokens | 1 | `.ent-class` — confirmed real dynamic wiring (`` `ent-${esc(kind)}` ``), not dead |
| deadcss | duplicate selectors, identical declarations | 0 | none |
| dupfns | exact duplicate bodies (≥3 lines) | 0 | one early hit was a bug in the sweep itself, see below — 0 after the fix |
| dupfns | near-duplicate bodies (Jaccard ≥0.85, ≥8 lines) | 0 | detector verified live at a lower threshold (0.5) to prove it isn't just silent |
| storagekeys | distinct storage keys/stores | 16 | 2 IndexedDB, 1 IndexedDB database, 13 localStorage (including a wrapper-resolved legacy key); 0 sessionStorage use anywhere |
| handlers | (a) onclick assigned twice, same binding | 1 | `renderLevelChip` — deliberate reset-then-set, not a bug (see below) |
| handlers | (b) attachTip before onclick, same binding | 0 | none |
| handlers | (c) confirm/alert/prompt | 0 | none — D53 holds |
| handlers | (d) `<button>` nested in `<button>` | 0 | none |
| handlers | (e) `behavior:"smooth"` without fallback | 1 occurrence, has fallback | the one use (jump bar) already carries its `setTimeout` fallback per D48 |
| handlers | (f) glyph via textContent/innerText or `<button>` literal | 8 | 3 are prose punctuation (false positive, see below); 5 are real un-iconified glyphs — see "possible real bugs" |
| handlers | (g) addEventListener leak in render*/refresh* | 0 | none |

## deadfns.js — unreferenced functions

Scans `function name(`, `const/let name = (...) => {...}` (including bare-identifier arrow
heads) and `const/let name = function`. 834 definitions found across the two files. A
reference is counted only in real code (comments and string/template-literal *content* are
excluded from the "alive" count, but tracked separately as "string-only" in case a name is
dispatched dynamically, e.g. `window[name]()`). `src/index.html` is searched as plain text
for inline `onclick="name(...)"` wiring.

```
=== deadfns: 834 function definitions scanned (app.js + extract.js) ===

--- zero references anywhere (code, inline HTML, or string) [7] ---
src/app.js:369  activeFilterCount  (function)
src/app.js:2818  csrcUnitShort  (arrow)
src/app.js:4375  buildToggleRowSingle  (function)
src/app.js:5489  folderForget  (function)
src/app.js:5970  clearImport  (function)
src/app.js:8852  isOriginFeat  (arrow)
src/extract.js:1191  featureFirst  (arrow)

--- zero CODE/HTML references, but referenced from inside a string/template literal (possibly dynamic wiring) [0] ---

--- known-orphan cross-check (PLAN.md K4) ---
folderForget: FOUND in dead list (src/app.js:5489)
clearImport: FOUND in dead list (src/app.js:5970)

TOTAL dead (zero refs): 7
TOTAL string-only wired: 0
```

**Spot-checked 5 of 7 by reading the code:**
- `activeFilterCount` (app.js:369) — a comment right above it (line 335) says it used to
  answer "how many filters are set"; nothing calls it now. Looks like a genuine orphan from
  a past refactor, not a false positive.
- `csrcUnitShort` (app.js:2818) — grepped clean, no other reference anywhere. Real orphan.
- `buildToggleRowSingle` (app.js:4375) — a one-of chip row helper with a comment calling it
  out as "the cbrow pattern, but single-select"; not called anywhere. Real orphan.
- `isOriginFeat` (app.js:8852) — grepped clean. Real orphan.
- `featureFirst` (extract.js:1191) — defined right before a sort call, with a comment
  explaining why ordering "costs nothing", but the variable is never applied to the actual
  `.sort()` two lines down (`readOrder` is used instead). This reads less like dead code and
  more like an **abandoned fix** — see "possible real bugs" below.

`folderForget`/`clearImport` cross-check passes, confirming the detector agrees with the
two orphans PLAN.md already names for K4.

## deadcss.js — unreferenced CSS class/id selectors

Parses `src/styles.css` with a recursive-descent block parser: `@media`/`@supports` bodies
are recursed into (their rules count), `@keyframes`/`@font-face`/`@page` bodies are skipped
entirely (percentages and keywords aren't class/id selectors). 749 distinct class/id tokens
found across 1501 flattened rules. Each token is searched as a bounded literal (not inside a
longer hyphenated name) across `index.html`, `app.js`, `extract.js` with comments stripped.

```
=== deadcss: 749 distinct class/id tokens found across 1501 rules ===

--- zero matches in index.html / app.js / extract.js [30] ---
styles.css:51  .icobig  selector=".icobig svg"
styles.css:112  .toolbtns  selector=".toolbtns"
styles.css:159  .twocol  selector=".twocol"
styles.css:223  .fmore  selector=".fmore"
styles.css:234  .lvlnav  selector=".lvlnav"  (+2 more rules)
styles.css:349  .lvcell  selector="table.spelltable .lvcell"
styles.css:692  .tableopts  selector=".tableopts"  (+2 more rules)
styles.css:867  .entgrants  selector=".pickbar .entgrants"
styles.css:1067  .lvltally  selector=".lvltally"  (+2 more rules)
styles.css:1069  .muted  selector=".lvltally.muted"
styles.css:1125  .budgetnote  selector=".budgetnote"  (+1 more rules)
styles.css:1127  #addOrigin  selector="#addOrigin"
styles.css:1149  #addFeat  selector="#addFeat"
styles.css:1150  #addEpic  selector="#addEpic"
styles.css:1253  .onboard  selector=".onboard"  (+3 more rules)
styles.css:1302  .runc0  selector=".locard.runc0"  (+1 more rules)
styles.css:1303  .runc1  selector=".locard.runc1"  (+1 more rules)
styles.css:1304  .runc2  selector=".locard.runc2"  (+1 more rules)
styles.css:1305  .runc3  selector=".locard.runc3"  (+1 more rules)
styles.css:1325  .c1  selector=".tlrundiv .rdot.c1"
styles.css:1327  .c3  selector=".tlrundiv .rdot.c3"
styles.css:1727  .phnote  selector=".printhead .phnote"
styles.css:2080  .gsh  selector=".gstage .gsh"  (+1 more rules)
styles.css:2081  .gsub  selector=".gstage .gsub"
styles.css:2120  .gokline  selector=".gokline"  (+3 more rules)
styles.css:2124  .grinline  selector=".gcard .grinline"  (+8 more rules)
styles.css:2126  .gchange  selector=".gcard .grinline.gchange"  (+2 more rules)
styles.css:2466  .libo-web  selector=".libo-web"
styles.css:2467  .libo-file  selector=".libo-file"
styles.css:2468  .libo-baked  selector=".libo-baked"

--- zero direct matches, but a hyphen-prefix looks dynamically concatenated in app.js (possibly dynamic, not dead) [1] ---
styles.css:2274  class=ent-class  dynamic-prefix="ent"  selector=".spmodal .ent-class"

--- duplicate selectors declared more than once with IDENTICAL declarations [0] ---
```

**Spot-checked 6 of 30, plus the 1 possibly-dynamic hit, by reading the code:**
- `.icobig`, `.toolbtns`, `#addOrigin` — grepped clean in all three files (not even a
  near-miss). Real dead CSS.
- `.muted` (as `.lvltally.muted`, styles.css:1069) — grepped clean too. Worth flagging that
  `var(--muted)` appears constantly in app.js, which could look like a false "used" hit to a
  naive substring search; the sweep's boundary check correctly treats `-` as a non-boundary
  character so `--muted` never matches the bare token `muted`.
- `.libo-web`/`.libo-file`/`.libo-baked` (styles.css:2466-2468) — grepped clean. Given the
  name (`libo-` = library origin?) and that D154 phases K1/K2 just collapsed the Library
  into one page (per STATE.md/MEMORY), these read like leftovers from the pre-K1 tabbed
  Library UI. Worth a look before K4 retires more code in the same area.
- `.ent-class` (possibly-dynamic) — confirmed real: app.js:8572 builds
  `` `ent-${esc(kind)}` `` where `kind` includes `"class"` as one of its values (grepped the
  surrounding `entmodal`/`ent-merged` code). Correctly NOT dead.

## dupfns.js — exact and near-duplicate function bodies

Only braced bodies (`function(){...}` / `name=(...)=>{...}`) are compared; concise
one-line arrow bodies are skipped since they can't reach the 8-line near-duplicate floor
anyway. 675 braced bodies extracted from the two files.

```
=== dupfns: 675 braced function bodies extracted (app.js + extract.js) ===

--- exact duplicate bodies (>= 3 lines) [0 groups] ---

--- near-duplicate bodies (Jaccard 3-gram >= 0.85, >= 8 lines) [0 pairs] ---
```

**A bug in the sweep itself, caught and fixed before trusting the result:** the first
version stored each function's source text on a shared array via a `.forEach` that ran once
per file, which — because it iterated the *whole* accumulated definitions array each time —
silently overwrote every `app.js` definition's source with `extract.js`'s source on the
second pass. That produced one false "exact duplicate": `setCurrentLevel` (app.js:800) and
`clearSwap` (app.js:867) reported as identical 3-line bodies, when reading the actual code
shows they share nothing (one totals class levels and saves, the other rounds a level and
deletes a swap key). Fixed by keying source/mask lookup off `d.file` instead of closing over
a shared mutable field. **Spot-checked:** re-ran after the fix, 0 exact duplicates remain,
and the near-duplicate detector was verified live by lowering its threshold to 0.85→0.5,
which surfaced 4 plausible structurally-similar pairs (e.g. `openOffListPick` /
`openLevelPick`, jaccard 0.640) — proving the detector works and 0 at the real 0.85 bar is a
genuine result, not a silently-broken check.

## storagekeys.js — every storage key, read/write/remove sites

Resolves `localStorage`/`sessionStorage` `.getItem`/`.setItem`/`.removeItem` calls and
`idbGet`/`idbPut`/`idbDel(store,key)` calls back to their literal key, including through
named `const LS_X="..."` declarations (including comma-separated multi-declarations like
`const IDB_NAME="spellForge", IDB_V=1, KV="kv", HANDLES="handles";`, which a naive
single-declarator regex would have missed the second item of onward) and through one hop of
wrapper-function indirection (`loadJSON(k){...localStorage.getItem(k)...}` → every
`loadJSON(LS_X)` call site is resolved back to `LS_X`'s value). 16 distinct
keys/stores found, 0 `sessionStorage` use anywhere in the app.

```
=== storagekeys: 16 distinct storage keys/stores found ===

[idb] handles/dir
  read:    src/app.js:5488
  written: src/app.js:5487
  removed: src/app.js:5489

[idb] kv/import
  read:    src/app.js:169
  written: src/app.js:177, src/app.js:185
  removed: src/app.js:215

[idb-database] spellForgeFolder
  read:    -
  written: -
  removed: src/app.js:212
  ** write-only / remove-only, never read back **

[localStorage] <unresolved: k>
  read:    src/app.js:113
  written: -
  removed: -
  version: v1 (no prior version to migrate from)
  ** read-only, never written by this code (external or legacy) **

[localStorage] spellForge.builds.v1
  read:    src/app.js:528
  written: src/app.js:492
  removed: -
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.custom.v1
  read:    src/app.js:295
  written: src/app.js:4919
  removed: -
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.import.v1
  read:    src/app.js:173
  written: src/app.js:198
  removed: src/app.js:170, src/app.js:177, src/app.js:186, src/app.js:216
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.parserNag.v1
  read:    src/app.js:5899
  written: src/app.js:5914, src/app.js:5921
  removed: -
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.print.v1
  read:    src/app.js:9763
  written: src/app.js:9766
  removed: -
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.refreshMiss.v1
  read:    src/app.js:5889
  written: src/app.js:5887
  removed: -
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.sources.v1
  read:    src/app.js:520
  written: src/app.js:493
  removed: -
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.table.v1
  read:    src/app.js:6001
  written: src/app.js:6008
  removed: -
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.v2
  read:    src/app.js:522, src/app.js:551
  written: -
  removed: -
  version: no v1 sibling found - can't confirm migration either way
  ** read-only, never written by this code (external or legacy) **

[localStorage] spellForge.webNag.v1
  read:    src/app.js:5268
  written: src/app.js:5275
  removed: -
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.webRepo.v1
  read:    src/app.js:5178
  written: src/app.js:9570
  removed: src/app.js:9569
  version: v1 (no prior version to migrate from)

[localStorage] spellForge.webSync.v1
  read:    src/app.js:5179
  written: src/app.js:5692
  removed: -
  version: v1 (no prior version to migrate from)
```

**Spot-checked 3 by reading the code:**
- `spellForge.v2` (`LS`, app.js:323) — flagged read-only, never written by this code. The
  comment on its declaration says exactly that: "legacy single-build blob (kept for
  rollback)". The sweep's finding matches the code's own documentation of itself.
- `handles/dir` (IndexedDB) — all three of `folderRemember`/`folderRecall`/`folderForget`
  resolved correctly to store `HANDLES`="handles", key `"dir"`, merging what would otherwise
  have been three unresolved rows into one. (Note: `folderForget` is also sweep 1's dead
  function — this key is still written and read by the two live functions, just never
  cleared, which lines up with PLAN.md K4 flagging `folderForget` itself as the orphan, not
  the key.)
- `<unresolved: k>` — this is `loadJSON`'s own body (`localStorage.getItem(k)`, `k` being
  its parameter, not a global constant). Expected noise: every real call site
  (`loadJSON(LS_IMPORT)`, `loadJSON(LS_CUSTOM)`, etc.) resolves correctly and is merged into
  the named key's row; this leftover row is just the wrapper's own unresolvable body, not a
  6th unknown key.

A real thing worth double-checking by hand: `spellForge.builds.v1`, `.custom.v1`,
`.sources.v1` are all v1 with no sibling version, so "no migration" is correctly the
expected answer for all of them — there is currently no versioned-key family in this
codebase to actually exercise the migration-check logic against. That logic ran clean but
is effectively untested by this codebase's current data; keep it in mind if a `.v2` key is
ever introduced.

## handlers.js — GOTCHAS.md wiring pitfalls

Builds a lexical scope tree (every function-body brace — named or anonymous, declaration or
arrow — is its own frame; `if`/`for`/`while`/object-literal braces are not) so "same
function" means the same closure, not just nearby lines. Checks (a) and (b) also resolve
each `.onclick=` target back to its nearest `const`/`let` declaration site, so two sibling
`if` branches that both do `const btn=el(...); btn.onclick=...` are correctly treated as two
different bindings, not a double-assignment on one element.

```
=== handlers: GOTCHAS wiring pitfalls ===

--- (a) .onclick assigned twice to the same target in the same function scope ---
src/app.js  target="chip"  lines: 6585, 6593  (frame renderLevelChip)
[1 findings]

--- (b) attachTip(x) called before x.onclick= in the same function scope ---
[0 findings]

--- (c) native confirm()/alert()/prompt() calls (banned, D53) ---
[0 findings]

--- (d) <button nested inside <button in a template literal ---
[0 findings]

--- (e) behavior:"smooth" without an apparent fallback (setTimeout) nearby ---
src/app.js:6561  behavior:"smooth"  fallback nearby: yes (setTimeout found within 300 chars)
[1 occurrences]

--- (f) non-ASCII glyph char via textContent/innerText, or literal inside a <button> template ---
src/app.js:3463  .textContent=  glyphs: ·
src/app.js:3473  .textContent=  glyphs: ·
src/app.js:4624  .textContent=  glyphs: ·
src/app.js:5104  .textContent=  glyphs: ⌄
src/app.js:5968  .textContent=  glyphs: ≈
src/app.js:7801  <button> literal text  glyphs: ⌄
src/app.js:8112  <button> literal text  glyphs: ‹
src/app.js:8114  <button> literal text  glyphs: ›
[8 findings]

--- (g) addEventListener on document/window inside a render*/refresh* function (leak candidate) ---
[0 findings]
```

**A false-positive class caught and fixed before trusting (a)/(b):** the first version of
these two checks grouped only by (function scope, variable name). That produced 4 findings
for (a) and 2 for (b) — all false positives, e.g. `guideSecBlock` declares its own
`const btn=el(...)` in *each* of several sibling `if(sec.kind===...)` branches, and
`cellFor` declares its own `const td=el("td")` in each of several sibling `if(k===...)`
branches — same name, completely different DOM elements, never the same binding. Adding the
declaration-site check (same `const`/`let NAME=` statement, not just the same name) dropped
this from 6 false positives to 0, leaving only the 1 genuine finding below.

**Spot-checked all non-empty findings by reading the code:**
- (a) `renderLevelChip` (app.js:6582-6593) — `chip.onclick=null` at line 6584 immediately
  after `chip.innerHTML=""`, then the real handler `chip.onclick=e=>{...}` at line 6593.
  Both target the *same* `const chip` (one declaration, line 6582), so this is a textbook
  match for the check — but reading the code, it's a deliberate reset because the node is
  reused between renders (the comment on line 6583 says exactly that: "the node is reused;
  its old meaning is gone"). Not a bug. The check as specified catches literal
  double-assignment to one binding; distinguishing "deliberate null-then-set" from "silent
  accidental overwrite" needs a human, which is the right place for that call to live.
- (e) `behavior:"smooth"` (app.js:6561, inside the function starting ~6556) — confirmed to
  be the D48 mobile jump bar the GOTCHA describes, and it does carry the documented
  `try{...}catch(e){scrollTo(0,y);return;}` fallback. Matches the gotcha's own account of
  itself.
- (f) `.textContent="⌄"` (app.js:5104) and the identical pattern at app.js:7801
  (`>⌄</button>` inside a template) — both are "acc-toggle" accordion-expand buttons using a
  literal chevron character instead of `ICONS`/`icoEl`. app.js:8112 and 8114
  (`>‹</button>`/`>›</button>`) are the creature-carousel prev/next buttons, same pattern.
  These four read like genuine, if longstanding, violations of D57 ("Icons are
  ICONS/icoEl/xBtn only — never a glyph in textContent... `<option>` elements are the one
  exception"). None of these four are `<option>` elements, so the stated exception doesn't
  cover them. Worth a look — see "possible real bugs" below.
- (f) the three `·` hits (app.js:3463, 3473, 4624) and the one `≈` hit (app.js:5968) are
  false positives relative to the D57 icon rule: reading the surrounding text, `·` is used
  as a plain prose separator (`"…other lists · {n} of {m} used"`, `"{char} · {name}"`) and
  `≈` is a plain "approximately" sign in front of a computed size (`"≈ 12 MB in this
  browser"`). Both are ordinary punctuation in a text string, not an icon standing in for a
  control — D57's concern is glyphs used *as* icons (checkmarks, chevrons, arrows on
  buttons), not typographic punctuation inside prose. The sweep's exclude-list for common
  typography (em/en dash, curly quotes, ellipsis, degree, ×, ÷, →) didn't include `·` or
  `≈`; a future run of this sweep should probably add them to cut this noise.

## Possible real bugs (not just dead weight)

- **`featureFirst` (src/extract.js:1191)** is defined with a comment explaining its purpose
  (ordering feature files before bestiary files so familiar-form data isn't dropped), sits
  immediately before a `.sort()` call, and is never referenced again — `readOrder` is what
  the sort actually uses. Either the intended ordering isn't happening and should be (a
  correctness bug matching the exact failure mode GOTCHAS already documents for the
  Find-Familiar/forms bug), or the comment and function are stale and should go. Worth
  checking against `extract.py`'s equivalent to see which side is out of date — the "both
  extractors, never one" rule means whichever way this resolves, extract.py needs the same
  answer.
- **Four raw glyph characters standing in for icons**, all pre-existing, all in `src/app.js`:
  `.textContent="⌄"` at line 5104, `` `⌄</button>` `` at line 7801 (both accordion toggles),
  and `` `‹</button>` ``/`` `›</button>` `` at lines 8112/8114 (creature carousel prev/next).
  D57 bans exactly this pattern outside `<option>` elements. Not urgent — these clearly work
  today — but they're the kind of thing that bites later (per GOTCHAS' own pattern: a glyph
  in markup is one `<option>`-shaped refactor away from becoming invisible or mis-sized in a
  way `ICONS`/`icoEl` sizing rules don't reach).

## Files

- `scratchpad/sweeps/_lib.js` — shared tokenizer/classifier
- `scratchpad/sweeps/deadfns.js`, `deadcss.js`, `dupfns.js`, `storagekeys.js`, `handlers.js`
- `scratchpad/sweeps/all.js` — runs all five, one-line summary, exit 0 always
- `scratchpad/sweeps/out/*.txt` — raw output captured for this report
