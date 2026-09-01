# V-C, verification of pillar C (codebase health and the bug sweep)

Wave 2 of D157. Adversarial re-check of `L0-sweeps.md`, `C1-app-structure.md`,
`C2-bug-sweep.md` and `C3-data-pipeline.md`. Nothing in the C reports, `src/`, `docs/`,
`dist/`, `data/` or any shared doc was edited. Only this file is added.

**Method.** Worktree `worktree-agent-a92d4f6f2ba383f0e`, reset to `main@387035a` (v1.5.10) so
the code under test is the code Francesco has, not the older base the worktree was cut from.
`data/` symlinked to the main checkout. `python3 serve.py 8014` from this worktree, killed by
the PID captured at launch; the served tree was proved to be this one before any measurement
(`curl .../src/app.js | grep -c TABLE_MM` returned 0, `data/data.js` reported
`window.__VERSION__="1.5.10"`). Browser pane on `http://localhost:8014/src/index.html`;
`eslint@9.39.5` installed under `npm install` in this worktree only, `node_modules/` already
gitignored, `package.json`/`package-lock.json`/`eslint.config.js` already committed on main by
v1.5.9 and not touched here.

Verdict vocabulary: **CONFIRMED** means reproduced independently, by my own repro rather than
by re-reading the auditor's. **PLAUSIBLE** means the mechanism is right but the claim is
partly unsupported or overstated. **STRUCK** means the claim is wrong.

---

## 1. Verdict table, L0 and C1

| id | verdict | evidence | severity |
|---|---|---|---|
| L0 sweep reproducibility | CONFIRMED | `node scratchpad/sweeps/all.js` on the current tree returns `deadfns 7/0`, `deadcss 30/1/0`, `dupfns 0/0`, `storagekeys 16`, `handlers 1/0/0/0/8/0/1`. Identical to the report, on a tree three commits newer than the one it was written against. | n/a |
| L0/C1 · 7 dead functions | CONFIRMED, 7 of 7 | One grep over `src/app.js`, `src/extract.js`, `src/index.html`, `src/styles.css`, `docs/sw.js` for all seven names plus `ABIL_FULL`: every one returns exactly one hit, the definition. `activeFilterCount` has a second hit at app.js:335 which is inside a `//` comment. No `window[name]` dispatch anywhere (deadfns' string-only bucket is 0 and I found no counter-example). | minor, kept |
| C1 · K4 "still live until K3" list is not marked dead | CONFIRMED | `refreshImported`, `staleBooks`, `refreshMissed`, `folderRecall`, `folderUsable`, `scanHandle`, `stageScanBooks`: 24 reference sites across app.js, including live wiring (`$("#refreshBtn").onclick=()=>refreshImported(false)` at 9513, `staleParserNotice`'s Refresh button at 5920, `refreshMissed()` read at 5416 and 5906). None appears in any dead list. C1 correctly scopes `folderForget`/`clearImport` to K4 and does not delete them. | n/a |
| C1 · the two applied trivial fixes (`TABLE_MM`, `BOOT_MODE`) | CONFIRMED | `git show 8fc489f -- src/app.js` removes exactly three things. Pre-change tree (`git show 00ab59e:src/app.js`): `TABLE_MM` at 6157 (assignment) and 6299 (declaration), 2 occurrences, no reader; `BOOT_MODE` at 10135 and 10145, 2 occurrences, no reader. `activeMetamagic()` read directly by grep: it reads `state.optFeats`, `OPT_BY`, `baseKey`, `METAMAGIC_WHEN`, `state.classes`, `CLS_BY`, `subOfRow` and mutates nothing, so dropping the call site in `renderTable()` has no side effect. The surviving call at app.js:8166 keeps the feature alive. Both fixes are safe. | n/a |
| C1-07 · "all 30 dead CSS tokens confirmed, 30/30" | **STRUCK for 9 of 30** | See §2 below. `runc0`, `runc1`, `runc2`, `runc3`, `c1`, `c3`, `libo-web`, `libo-file`, `libo-baked` are all constructed dynamically and all render live. 21 of the 30 are genuinely dead. | the finding shrinks to 21 tokens; the erroneous 9 would have broken shipped UI |
| C1-09 · `featureFirst` is "possibly an abandoned correctness fix", major, handed to C3 | **STRUCK** | See §2 below. It is a byte-equivalent local duplicate of the exported `readOrder`, which the sort two lines below already uses. The ordering is happening. No `extract.py` counterpart exists or is needed. | major → trivial dead local |
| C1 · claim 1, "83 sections (was 84)" | PLAUSIBLE, off by one | `grep -c "^// ──" src/app.js` (the command C1's own claims register cites) returns **84** at `8fc489f` and 85 at the pre-change commit. Line count 10,155 at `8fc489f` is exact. The merge of the orphan header is real; only the two numbers are wrong. | cosmetic |
| C1 · `ids.js` (A) = 0 dangling id lookups | CONFIRMED | Re-ran: `322 static ids, 3 templated, 310 looked up; (A) 0, (B1) 15, (B2) 0`. Manual sample of 10 lookups drawn from the sorted `$("#id")` set (`bImportBox`, `csrcAdd`, `customDone`, `fBooksPanel`, `formPinBlock`, `guideCtaBtn`, `libSelBar`, `pickSub`, `refreshBtn`, `tableChip`): all 10 present in `src/index.html`. | n/a |
| C1 · "(B1)'s 15 were checked by hand" | PLAUSIBLE, 14 named of 15 | `#importTitle` (index.html:301) appears in the sweep output but in none of C1's three resolution buckets. It is a real orphan of the same harmless kind as `#srcAskTitle`: a static `<h2>` with no JS hook. There is no `aria-labelledby` or `aria-describedby` anywhere in `index.html` or `app.js`, so neither heading is reachable by that route either. C1's "3 genuine" should read 4. | polish |
| C1-01 · three inline `.bchip` duplicates of `bkTag` | CONFIRMED | `bkTag` defined at app.js:8570; inline constructions of the same `<span class="bchip" data-book=… data-page=…>` at 8153, 8286 and 8676 (C1's line numbers plus the six lines v1.5.10 added). | minor, kept |
| C1-02 · plural ternary, 39 sites | CONFIRMED | `grep -c '===1?"":"s"\|===1?"s":""\|>1?"s":""' src/app.js` returns 39. | minor, kept |
| C1-03 · `renderOptFeats`/`refreshAddFeat` run twice per `refreshAll();render();` | CONFIRMED | `refreshAll()` (app.js:9408) lists both; `render()` calls `renderOptFeats()` at 3268 and `refreshAddFeat()` at 3277 directly; `grep -c "refreshAll();render();"` returns 21. Both are read-only view functions, so the report's "not a correctness bug" reading holds. | minor, kept |
| C1 · error handling, 25/25 localStorage sites wrapped | CONFIRMED by sampling | Every `localStorage` line number C1 lists resolves to a `try{…}catch` in the surrounding source. I did not re-read all 25 individually; the six I opened (113, 5268, 5887, 5899, 5914, 9569) are all guarded, and `no-unused-vars` reports a `catch(_)`/`catch(e)` parameter at 42 distinct lines, which is independent corroboration that the catches exist. | n/a |
| C1 · eslint numbers | CONFIRMED exactly | See §3. | n/a |

### 2. The two struck C1 findings, in full

**C1-07, dead CSS.** L0 spot-checked 7 of 30 and C1 said it re-checked the remaining 23 "with
a boundary-aware regex". That method is exactly the one that cannot see a class name built by
concatenation, and nine of the thirty are built by concatenation:

- `src/app.js:6936`, `railCls:(lv,id)=>!multi||id==null?"":" runc"+runColor.get(id)`, where
  `runColor` (app.js:6926) assigns `runColor.size%4`, so the values are 0, 1, 2, 3. Applied to
  `.locard` at app.js:1955 (the guide chain) and 7047 (the timeline).
- `src/app.js:6945`, `dv.append(el("span","rdot c"+runColor.get(id)))`, which is what
  `.tlrundiv .rdot.c1` and `.c3` style.
- `src/app.js:9312`, `row.append(el("span","libchip libo-"+o,ORIGIN_LABEL[o]))`, where
  `bookOrigin()` (app.js:9281) returns exactly `"web" | "file" | "baked"` and `ORIGIN_LABEL`
  (app.js:9288) is keyed on those three.

Proved live in the browser, not by reading:

- With four class rows (Sorcerer 5 / Cleric 4 / Bard 1 / Druid 1) and the timeline open, the
  DOM carries `runc0, runc1, runc2, runc3` on `.locard` and `c0, c1, c2, c3` on
  `.tlrundiv .rdot`. `getComputedStyle` on the `.c3` dot returns
  `color(srgb 0.498039 0.733333 0.54902 / 0.7)`, which is `color-mix(in srgb, var(--good) 70%,
  transparent)` from styles.css:1327 actually applying. `.runc3`'s left border resolves to the
  same hue at 0.6 alpha, from styles.css:1305/1317.
- With the Library open on a web-fetched library, 43 `.libchip` elements are present and
  `libo-web` and `libo-file` are both in the DOM, `libo-web` computing to
  `background rgba(217,145,95,0.12)` and `color rgb(217,145,95)`, which is styles.css:2466.

The `.libo-*` case is the one that matters. Those are the per-book origin chips D154(d) and
D155 shipped in v1.5.7. C1 recommends bundling the removal of these selectors with K4 "to avoid
a second `styles.css` diff over the same area". Doing that would strip the styling off the
newest control in the Library. L0's own spot-check named these three and called them "leftovers
from the pre-K1 tabbed Library UI"; they are the opposite, they are K1's own output.

I re-checked the other 21 tokens two ways: a boundary-aware grep across `app.js` and
`index.html` (zero hits for all 21), and a concatenation sweep looking for any quoted literal
ending in a prefix of the token followed by `+`, or a template literal with the prefix followed
by `${`. The only multi-character prefix hits were `runc` (6936) and `budget` (7408); the latter
builds `"budget"` / `"budget over"` and never `budgetnote`. So the surviving finding is **21
dead CSS tokens, not 30**, and the sweep itself has a named blind spot: `deadcss.js`'s
"possibly-dynamic" heuristic only recognised the template-literal form (`` `ent-${…}` ``) and
missed both the `"prefix"+expr` form and a prefix that sits inside a longer class literal
(`"libchip libo-"`).

**C1-09, `featureFirst`.** L0 read it as an abandoned correctness fix and C1 escalated it to the
only **major** in its table, handing it to C3. C3's report never mentions it, so it was about to
reach Francesco as an unverified major that no one owned. It is neither.

```
src/extract.js:839   const readOrder=n=>/^(optionalfeatures|feats)/i.test(String(n||"").split("/").pop())?0:1;
src/extract.js:1191  const featureFirst=n=>/^(optionalfeatures|feats)/i.test(String(n).split("/").pop())?0:1;
src/extract.js:1194    .sort((a,b)=>readOrder(a.name)-readOrder(b.name)),out=[];
```

The two bodies differ only in `String(n||"")` versus `String(n)`, which cannot differ for a
filename. `readOrder` is the exported one (`window.SB_extract` at extract.js:1205), added so
that nothing re-implements the rule, and it is what the sort uses. `featureFirst` is the local
it replaced. The ordering the comment describes is happening. On the `extract.py` side there is
no counterpart and none is wanted: `_scan_form_refs()` (extract.py:493) runs once at module
level from explicit globs, so extract.py never has an ordering problem to solve. Removing
`featureFirst` is a one-line dead-local deletion with no parity implication, which puts it in
the same bucket as the other six orphans, not in a bucket of its own.

---

## 3. eslint, side by side

`npx eslint <file> -f json`, counted per `ruleId`, on `main@387035a` with the committed
`eslint.config.js`.

| file | rule | C1 reported | measured here |
|---|---|---:|---:|
| `src/app.js` | no-undef | 0 | **0** |
| `src/app.js` | no-redeclare | 0 | **0** |
| `src/app.js` | eqeqeq (smart) | 0 | **0** |
| `src/app.js` | no-unused-vars | 57 | **57** |
| `src/extract.js` | all four | 0/0/0/4 | **0/0/0/4** |
| `docs/sw.js` | all four | 0/0/0/1 | **0/0/0/1** |
| **total** | | **62** | **62** |
| `src/app.js` | eqeqeq with `"always"` | 121 | **121** |
| `src/extract.js` | eqeqeq with `"always"` | 18 | **18** |

Every number matches. The `"always"` measurement was reproduced with
`npx eslint src/app.js --rule '{"eqeqeq":["warn","always"]}'`, not by editing the config.

**`eqeqeq: "smart"` judgement: defensible, and better calibrated than C1 claims, but not the
tightest option.** C1 says 116 of the 121 `"always"` findings are the `==null` idiom. I
classified all 121 by reading the source at each reported line and column: **121 of 121** are
`x==null` or `x!=null`. There is not a single loose comparison in `app.js` that is not a
nullish check. That makes `"smart"` correct in outcome and makes the alternative
`["error","always",{null:"ignore"}]` strictly tighter for the same zero findings today, because
`"smart"` additionally permits two forms this codebase never uses (literal-to-literal, and a
`typeof` result). If the rule is ever promoted from `warn` to `error`, `{null:"ignore"}` is the
option that expresses the measured idiom exactly and grants nothing beyond it. Either way, C1's
underlying call, that `"always"` would have been 100% noise, is correct and worth keeping.

Two notes on `no-unused-vars` that C1 rounds off. 42 of the 57 are `catch` parameters (ESLint 9
defaults `caughtErrors:"all"`), and `caughtErrorsIgnorePattern:"^[_e]$"` would cut the file to
15 findings without losing anything real. Of the remaining 15, 7 are the dead functions and
`ABIL_FULL` that C1 already names, 5 are deliberate signature parameters the code documents as
ignored (`tab` at 5928 has a comment saying so, plus `idx` at 616, `i` at 7776, `it`/`kind` at
8552), and 3 are a genuinely dead destructuring at app.js:6200
(`const {sp,type,recharge,sel}=row; const src=row.src;` where `type`, `recharge` and `src` are
never read in that body). That last one is a real, trivial cleanup C1 did not separate out.

---

## 4. Verdict table, C2

| id | verdict | my evidence | severity |
|---|---|---|---|
| C2-01 · Escape closes 4 of 14 modals | **CONFIRMED** | I enumerated the overlays myself: `document.querySelectorAll('.modal')` returns exactly 14, plus one `.spmodal` with no id. Testing each through its own real opener (`openPrintModal`, `openBuilds`, `openImport`, `openCustom`, `openHb`, `openNewBuild`, `openTimeline`, and the module-state assignments `GPICK` / `FAM` the real openers make) then dispatching a synthetic `keydown{key:"Escape"}` on `document`: `gpickModal`, `famModal`, `tlModal` and `pickModal` **only while it carries `.over`** close; `printModal`, `buildModal`, `importModal`, `newBuildModal`, `srcAskModal`, `csrcModal`, `customModal`, `hbModal`, `entityModal`, `prepModal` and a plain `pickModal` do not. The `.spmodal` closes. Cause confirmed at app.js:7648, which special-cases `GPICK`, `FAM` and `pickModal.over` and then calls `closeSpModal()`/`hideTip()`/`closeBswMenus()`/`closeTimeline()`, with no generic topmost-modal fallback. | major, kept |
| C2-02 · stale-parser "Refresh now" is a dead end for a web-fetched library | **CONFIRMED verbatim** | Read `refreshImported` (app.js:5773 to 5835) in full: every branch is `FOLDER` / `SCAN` / `stageScanBooks`; there is no `webSync`/`webFetchAll` path anywhere in it. `staleParserNotice` (app.js:5920) offers "Refresh now" whenever `!allMiss`, without consulting `bookOrigin()`. Live: after a real **Update data** fetch (43 books, 42 of them stamped `origin:"web"`), stamping every `IMPORTED.sources[c].parser` to `"1.0.0"` and calling `staleParserNotice()` raised the notice; clicking its Refresh now button produced `#importReport` = "Refresh needs your 5etools files, choose the folder above (it will be remembered), or drop the .zip and Apply." and a second notice "Refresh needs the folder, choose it in the Library." Both sentences match C2's quotes exactly. `FOLDER` was false and `SCAN` was false, as they are for any library built only from the web. | major, kept |
| C2-03 · a source-code collision silently renames a real book | **CONFIRMED** | On the 44-book library, pasting a one-spell brew whose `_meta.sources` declares `{"json":"PHB","full":"Hijacked PHB"}` through the real `stageFiles` path is offered as **"Re-read 1 book"**. After Apply: `DATA.sources.PHB.name` went from `"Player's Handbook (2014)"` to `"Hijacked PHB"`, `counts.spells` 361 → 362, Fireball still present, book count unchanged at 44. No confirmation named the rename. Cause is `mergeSources` (app.js:5305-5306): the old name is kept only when the incoming name is falsy or equals the bare code. | minor, kept |
| C2-04 · `stageFiles` loses dependent monster records by order | **CONFIRMED, and worse than reported** | See §5. | major, kept |
| C2 §1 · the library-fetch record | CONFIRMED | Re-ran **Update data** live. Same repo (`5etools-mirror-3/5etools-src`), same resolved version **5etools v2.34.1**, 56 files, report string `Read 56 files, 936 spells · 27 classes · 322 subclasses · 276 feats · 215 species · ⚠ 15 spells no class can reach.`, tray offering "Add 43 books", status strip after Apply reading `43 books · 5etools v2.34.1 · parser v1.5.10 · ≈ 1 MB in this browser`, origins stamped `web`. Wall time here was 8.7 s rather than C2's 24 s, which is network variance, not a discrepancy. | n/a |
| C2 §2 · B1-01 in both states | CONFIRMED, with one omission | See §6. | see §6 |
| C2 · "the pane never composited a screenshot" | not re-tested | My pane also reported hidden. Every check in this report is a DOM or computed-style assertion for the same reason. | n/a |

**One thing found while testing C2-01, recorded here rather than as a separate finding.**
`openTimeline()` (app.js:6740) is `TL.open=true; renderTimeline(); $("#tlModal").classList.remove("hidden");`
and `renderTimeline()` (app.js:7010) begins `if(!total){closeTimeline();return;}`. On a build
with zero class levels the render closes the modal and clears `TL.open`, then `openTimeline`
un-hides it anyway, leaving a visible modal that Escape cannot close (because `closeTimeline`
early-returns on `!TL.open`) and that `toggleTimeline()` would re-open rather than close. This is
**not user-reachable today**: `renderLevelChip` (app.js:6587) nulls the chip's `onclick` when
`total` is 0, and that chip is the only caller. It is a latent ordering fragility, not a bug to
fix now, but it is the reason my first Escape harness reported `tlModal` as not closing and it
is worth knowing before any new caller of `openTimeline` is added.

### 5. C2-04 / C3-01, reproduced

I built the smallest fixture the predicate allows: a feature file whose prose contains a
sentence with the word "forms" and `{@creature imp|mm}`, and a bestiary file holding an Imp
(`type: fiend`, `cr: "1"`, no `summonedBySpell`), which fails every other branch of
`carriedMonster` (extract.js:825-828). Files were passed to the production `stageFiles` as an
array of `File` objects rather than a real `FileList`, because an `<input type=file>` cannot be
set from script; `stageFiles` does `[...fileList]`, so an array is exactly equivalent, and no
other code in the function distinguishes them. `SB_extract.resetFormRefs()` was called between
trials, and the page was reloaded first so `FORM_REFS` started cold.

| trial | staged bestiary's `monster` array |
|---|---|
| bestiary staged first, feature second (two calls) | `[]`, 0 of 1 |
| feature staged first, bestiary second (two calls) | `[Imp]`, 1 of 1 |
| **one call, `stageFiles([bestiary, feature])`** | **`[]`, 0 of 1** |

The third row is the sharpening. C3's repro frames this as "a genuine race" that "may need a
few attempts". It is not a race in the common case: `FileReader.onload` for two small files
fires in array order, and a multi-select from a file picker returns files in directory order,
where `bestiary-mm.json` sorts before `optionalfeatures.json`. **The alphabetical order is the
losing order**, so a user who multi-selects a bestiary and a feature file in one go loses the
record deterministically, not occasionally. `readOrder("bestiary-mm.json")` is 1 and
`readOrder("optionalfeatures.json")` is 0, confirming the intended order is the reverse of the
one a picker hands over.

One more condition worth stating, because it explains why this has not been noticed: after a
web fetch or a zip import in the same page session, `FORM_REFS` is already warm and
`stageFiles` accidentally works. The failure needs a cold page, which is also the state a first
import is taken in.

**Does `cparity-formrefs.js` prove the finding? No.** It restates the static half of it. The
script reads `src/app.js` as text, splits it at every line matching `^(async )?function name(`,
and asserts that any such block containing `slimJson(` also contains `resetFormRefs(`. It never
loads `extract.js`, never calls `slimJson`, `carriedMonster`, `resetFormRefs` or `readOrder`,
and never checks ordering, which is the half that actually drops the record. Its own comments
say the ordering half needs a browser, which is honest, but the report's claim 7 ("proven
mechanically") overstates what a substring check can prove. Three further limits: the block
boundary is "up to the next top-level `function` line", not a brace match, so a `slimJson` call
in an arrow function between two declarations is attributed to the wrong one; a future ingestion
path written as `const stageX = async (…) => {…}` is invisible to it, which contradicts its
comment that a new path "is caught automatically"; and `unzipJsonFiles` lives in `extract.js`
and is never scanned. The load-bearing evidence for C3-01 is the browser repro, not this script.

---

## 6. B1-01 model verdict

**Reproduced exactly, both states, through the real `stageFiles` → `buildImport` →
`applyImport` path.**

State B, fresh profile, empty IndexedDB, one-spell brew declaring a new source code:
`DATA.sources` **43 → 1**, `DATA.spells` **936 → 1**, `DATA.classes` **27 → 0**,
`hasXPHB` true → false, `sourceKeys` `["VTST"]`. The report line read
`Added. 1 book · 1 spells · 0 classes · 0 subclasses · 0 feats · 0 species.` and said nothing
about the 42 books and 27 classes that had just left the screen.

State A, same brew, same code, on the 43-book web-fetched library:
`DATA.sources` **43 → 44**, `DATA.spells` **936 → 937**, PHB's 361 spells untouched. Merge
behaves exactly as D86 documents.

**Is the replace a design or a defect?** It is a design, and it has a D-id. **D137** states it
in terms: "An imported digest REPLACES the bundle. `assembleData` is `IMPORTED||BAKED`, not a
merge (only `monsters` merges), so with an import present NONE of the baked records are used."
The GOTCHAS entry "Content assembly" says the same. The second half of the mechanism is
`planFromStage` (app.js:5360), whose base is `const stored=IMPORTED||emptyDigest()`, not
`IMPORTED||BAKED`. So on a fresh profile the merge base is genuinely empty and there is nothing
for D86's merge to merge onto. C2's mechanism read is right and its verdict, that this is a
first-import edge rather than a merge bug, is right.

**What is a defect is the presentation, and one fact both B1 and C2 missed.** The action is
**fully reversible in one step**, and neither report says so. `removeBooks` (app.js:9382) does
`if(!keep.size)await importDrop();`, so removing the last imported book deletes the stored
digest and `assembleData` falls straight back to the bundle. I ran it: after Remove, the profile
was back to **43 sources, 936 spells, 27 classes**, `IMPORTED` null, the Sorcerer class row
still in `state.classes` and the gap bar cleared. Nothing was ever lost; the baked bundle is
part of the page and cannot be deleted by an import. That moves this from "an import destroys
your library" to "an import hides your library behind itself, with a one-click undo that is not
labelled as one".

**What the dist build does for a user whose first import is one homebrew file.** `dist/` bakes
the FULL data (build.py:141-143 inlines `data/data.json`), which is what `/src` also serves, so
my State B run **is** the dist case: 43 books and 936 spells replaced by one book and one spell.
`docs/` bakes only the SRD 5.2 subset, so there the same action replaces 339 SRD spells and 12
classes with one spell. In both builds the baked bundle survives untouched inside the page and
comes back the moment the imported digest is empty. There is no route through the Library that
can leave the user with nothing: `applyPlan` refuses a keep-set that would leave zero content,
and `removeBooks` restores the bundle rather than emptying the app.

**Verdict in two lines.** The replace is D137's decided model working as decided, not a defect,
and D86's merge is correct on every action after the first. The defect is that the first import
from an empty profile silently discards the visible library and reports it as an addition, when
it is reversible in one click and could simply say so.

---

## 7. Verdict table, C3

| id | verdict | my evidence | severity |
|---|---|---|---|
| Gate and cparity clean | CONFIRMED | All four gate commands pass on this tree. `node scratchpad/cparity.js` prints 51 `ok` lines and 0 `FAIL`, with the same tail report (`936/27/322/276/215`, `books:64`, `files:186`, `noAccess:15`). | n/a |
| C3-01 · `stageFiles` silent order-dependent loss | **CONFIRMED, severity holds** | §5. Static half re-proved by reading app.js:5147-5155 (no `resetFormRefs`, no sort, one `FileReader` per file, `slimJson` called inside each independent `onload`) against `webFetchAll` (app.js:5203-5205, resets then sorts by `readOrder`) and `stageScanBooks` (app.js:5590+). Dynamic half reproduced in three orders. | major, kept |
| C3-02 · `bump.py` writes `VERSION` before `build.py` | **CONFIRMED, and understated** | `bump.py:44-52` writes `VERSION`, prints, then `subprocess.run([... "build.py"], check=True)`. There is no rollback. The report says a failed build leaves every deliverable un-regenerated; that is not quite what happens. `build.py` writes `data/data.js` with the new `__VERSION__` at step 1 (build.py:121-124), **before** the `sub_once` marker asserts and the app.js/extract.js/styles.css `</script` asserts that can fail at step 2. So a failure there leaves `VERSION` new, `data/data.js` new, and `dist/`/`docs/` old, and the **dev build's footer reads the new version off a data.js that was written by a build that did not finish**. That is the exact lie CLAUDE.md's rule exists to prevent, one layer closer than the report says. | minor, kept |
| C3-03 · `</style` guard missing | **CONFIRMED, not live** | `build.py:130-136`: `assert "</script" not in txt.lower()` for `app.js`, `extract.js` and `styles.css`, plus the same on `data.json` (113) and `data-srd.json` (159). There is no `</style` assert anywhere. `styles.css` is the one blob wrapped in `<style>`, and it is the one file for which the `</script` check is meaningless. Confirmed `</style` does not appear in `styles.css` today (0 hits, case-insensitive), so nothing is broken. I also checked the one further hole a `<script>` blob can have, `<!--` opening the script-data-escaped state so that `</script>` no longer closes it: 0 occurrences in `app.js`, `extract.js` or `data/data.json`, so that is not live either. | minor, kept |
| C3-04 · web fetch surfaces generic errors | **CONFIRMED, all three parts** | `webJson` (app.js:5183) throws `host + " answered HTTP " + r.status` and never reads `r.headers`, so a rate-limit 403 is indistinguishable from any other 403. `webTree` (app.js:5194-5196) retries the bare `ver` inside a bare `catch(_)` that discards the first error, so a rate-limited first call burns a second request and the user sees the second failure's message. `r.json()` on a non-JSON 200 throws a `SyntaxError` that reaches the outer catch verbatim. No integrity risk: `webSync`'s outer try/catch/finally means nothing is staged on failure. | minor, kept |
| C3-05 · `hasSpells` / `countType` written and never read | **CONFIRMED** | `grep -c` on `src/app.js` returns 0 for both. Write sites confirmed at `extract.js:901, 935/937, 949/953` and `extract.py:1199, 1615, 1649`. | minor, kept |
| A1/A2 · `digest.sources` and `FULL_MC`/`PACT` were untested surfaces | CONFIRMED | `cparity.js` contains no `.sources` comparison. `scratchpad/cparity-sources.js` closes both and reports 0 fail: 43/43 books, whole-record diff 0, `FULL_MC` and `PACT` byte-identical between `src/app.js` and `data/data.json`. | n/a |
| `cparity-sources.js` drives the real predicates | **CONFIRMED** | It loads `src/extract.js` with `new Function(...)` and destructures `buildDigest`, `slimJson`, `zipWanted`, `dropFoundryStubs`, `readOrder`, `resetFormRefs` off `window.SB_extract`. Nothing is re-implemented. It walks the mirror with the real `zipWanted`, applies the real `dropFoundryStubs`, sorts with the real `readOrder` and slims with the real `slimJson`, which is exactly what the GOTCHAS rule requires. | n/a |
| `cparity-formrefs.js` drives the real predicates | **STRUCK** | It drives none. It is a text scan of `src/app.js`. See §5. | the check is worth keeping; the claim that it proves the finding is not |

**Should `cparity-sources.js` join the gate line in CLAUDE.md?** The checks should; the extra
line is the wrong shape for them. It costs 0.48 s (measured, against `cparity.js`'s 0.44 s), so
cost is not the objection. The objection is that it re-does the entire mirror walk and
`buildDigest` that `cparity.js` has already done in order to add six assertions, and that this
project's own history answers coverage gaps by **widening `cparity.js`**, twice, in the words
of the GOTCHAS entry itself ("the harness now diffs `cls`/`sub`/`feat`/`race` per spell",
"`gparity.js` is gone, `cparity.js` absorbed it"). Two harnesses that build the same digest will
drift. Recommendation: fold the six assertions into `cparity.js` and leave the gate at four
lines. If Francesco would rather not touch `cparity.js`, adding the fifth line is acceptable and
harmless. Its one fragility to note either way: the `FULL_MC`/`PACT` extraction is an `eval` of
a non-greedy `const NAME=(\[[\s\S]*?\]);` match, which is correct only while the literal ends in
`]];` and nothing nested ends in `];` first.

`cparity-formrefs.js` should **not** join the gate while C3-01 is open. A gate line that is
permanently red teaches the reader to skip the gate, which is the same argument C1 made for not
shipping `eqeqeq:"always"`. Fix C3-01, then gate it, and widen it to brace matching and
arrow-function definitions when you do.

---

## 8. GOTCHAS re-test, five entries C2 marked "holds"

Re-tested independently, by driving the real controls rather than calling internals where a
control existed.

| entry | my test | result |
|---|---|---|
| **D146** a drop leaves an empty slot, never a splice; only the last position shrinks | Sorcerer 5, five spells taken through the real `.tk` take chips. Dropping the pick at index 1 through its own chip gave `["Burning Hands\|XPHB","∅\|","Chromatic Orb\|XPHB","Color Spray\|XPHB","Comprehend Languages\|XPHB"]`: the hole is written in place and every later position is unmoved. Dropping the new tail gave `[…,"Color Spray\|XPHB"]`, length 4, no trailing hole. | **holds**, both halves |
| **D42** nothing prunes on a source change | Two paths. (a) The State B import that took `DATA.sources` from 43 to 1: `state.classes` still held `Sorcerer\|XPHB@5` and the gap bar read "1 pick needs a book that isn't loaded, re-import it · XPHB". (b) Removing a book from the Library selection bar: the picks, holes included, survived verbatim (`["Burning Hands\|XPHB","∅\|","Chromatic Orb\|XPHB","Color Spray\|XPHB"]`). Re-adding cleared the gap bar with the picks still in place. | **holds** |
| **D53** native dialogs banned, destructive actions arm | Patched `window.confirm`/`alert`/`prompt` to record every call, then drove the Library selection bar's Remove twice. First click changed the label from "Remove" to "Confirm?" and removed nothing; the second click inside the arm window committed. Recorded native dialogs: **zero**. | **holds** |
| **D122 / E5** the timeline is a modal and Escape takes it first | With a real plan (Sorcerer 5, 5 levels), `openTimeline()` then a synthetic Escape closed it and cleared `TL.open`. C2's verdict is right. The empty-plan case is the latent ordering issue recorded in §4; it does not contradict the entry. | **holds** |
| **"An empty stored import must not beat the baked data"** | Put a present-but-empty digest into `IMPORT_CACHE` (one ghost source, zero spells and zero classes) and called `assembleData()`. Result: 43 sources, 936 spells, `IMPORTED` null, the ghost source absent, `hasXPHB` true. Restoring the real cache returned the imported state. `assembleData`'s `impOk` guard (app.js:298-300) is doing its job. | **holds** |

Also re-confirmed in passing: the `IMPORTED||BAKED` assembly rule (§6) and the shared-origin
warning (my `localhost:8014` profile arrived carrying the same 1176 and 292 byte keys C2's
`:8012` profile did, which is the shared browser storage GOTCHAS describes).

---

## 9. What the auditors missed

Three items, found while verifying, marked as mine.

**V-C-a · Nine of C1's thirty "confirmed dead" CSS selectors are live, and three of them style
the newest control in the Library.** Full evidence in §2. The consequence is concrete: C1
recommends removing all thirty alongside K4, and doing that would strip the styling off the
per-book origin chips (`.libo-web`, `.libo-file`, `.libo-baked`, D154(d) and D155, shipped
v1.5.7) and off the multiclass run rails and dots in the timeline and the guide chain
(`.locard.runc0-3`, `.tlrundiv .rdot.c0-c3`, D132/D141(a)). The method failure is shared by both
reports: a boundary-aware textual grep cannot see a class name built by concatenation, and
`deadcss.js`'s own dynamic heuristic only recognises the template-literal form. Before any
CSS removal pass, that heuristic needs to cover `"prefix"+expr` and prefixes embedded in a
longer class literal.

**V-C-b · `applyPlan`'s success sentence does not pluralise, one function away from the
`importSummary` that v1.5.10 fixed.** `src/app.js:5710-5711` builds
`` `${out.spells.length} spells · ${out.classes.length} classes · ${out.subclasses.length} subclasses · ${out.feats.length} feats · ${out.races.length} species.` ``
with the plural hardcoded on all five nouns; only the book count uses a ternary. My State B
import produced, verbatim, `Added. 1 book · 1 spells · 0 classes · 0 subclasses · 0 feats · 0
species.` B1's v1.5.10 trivial fix pluralised `importSummary` (the pre-apply "Read N files"
line) and left this one, the post-apply confirmation, untouched. Trivial fix, no design
implication, same shape as the one already accepted.

**V-C-c · The first-import replace is reversible in one click, and neither B1 nor C2 says so.**
Full evidence in §6. `removeBooks` calls `importDrop()` when the keep-set empties, so removing
the only imported book restores the baked bundle intact. I reproduced the full round trip: 43 →
1 → 43, with the build's picks surviving both transitions. This is the single fact that decides
how B1-01 should be triaged: the fix is a sentence in front of the first import (or a label on
the undo), not a change to the content-assembly model, and it does not need to be urgent.

---

## 10. Storage restore proof

Baseline taken before any interaction, on `localhost:8014`, and saved to disk outside the page
so it survived two reloads (`scratchpad/baseline.json`, gitignored scratch location, not
committed):

- `localStorage`: 2 keys, `spellForge.builds.v1` (1176 bytes) and `spellForge.sources.v1`
  (292 bytes). A single empty "New character · v1" build with all 43 codes enabled. Identical
  to the baseline C2 recorded on `:8012`, which is the shared-origin behaviour GOTCHAS warns
  about, not a coincidence.
- IndexedDB `spellForge` v1: stores `kv` and `handles`, both empty.

During the session the profile accumulated a 44-book web-fetched digest in `kv`, a Sorcerer 5 /
Cleric 4 / Bard 1 / Druid 1 build with picks and holes, and two extra localStorage keys
(`spellForge.webSync.v1`, `spellForge.parserNag.v1`).

Restore: `localStorage.clear()`, both baseline keys rewritten from the saved strings, then `kv`
and `handles` cleared in one readwrite transaction. Verified in the same call:

```json
{"dirtyKeysBeforeRestore":["spellForge.builds.v1","spellForge.webSync.v1",
                           "spellForge.parserNag.v1","spellForge.sources.v1"],
 "lsKeysAfter":["spellForge.builds.v1","spellForge.sources.v1"],
 "lsMatchExact":true,
 "sizes":{"spellForge.builds.v1":1176,"spellForge.sources.v1":292},
 "idbStores":{"handles":[],"kv":[]}}
```

`lsMatchExact` is a `JSON.stringify` equality between the restored key/value map and the
baseline map, not a key-set or length comparison. A follow-up reload booted clean on the
restored profile: 43 baked sources, 936 spells, `IMPORTED` null, 1 build, 0 class rows, both
keys still at exactly 1176 and 292 bytes (so boot's identical-write skip held and did not
rewrite them), and zero console errors. The dev server was killed by the PID captured at launch
(38771), never by `pkill`; port 8014 confirmed free afterwards.

---

## 11. Overall verdict

Pillar C is mostly trustworthy and its two most expensive claims survive intact. Every C2 and C3
finding reproduced, four of them verbatim and two of them more severely than reported, and the
verify gate, `cparity.js`, both new parity scripts and all five L0 sweeps reproduce exactly on a
tree three commits newer than the one they were written against. The eslint work is exact to the
number, and its central judgement about `eqeqeq` is not just defensible but conservative, since
the idiom is 121 of 121 rather than the 116 claimed. The static reading in C1 sections 4 and 5,
the `refreshAll` history, the `PREVIEW` rule and the storage error handling, held everywhere I
sampled it.

The weakness is concentrated in exactly one place, and it is a method weakness rather than a
carelessness one: **both L0 and C1 treated "a boundary-aware grep finds nothing" as proof that a
CSS class or a function is unused**, and that method is blind to concatenated class names. It
produced one wrong finding of thirty tokens (nine of them live, three of them styling v1.5.7's
own new chips) and, in a different guise, escalated a plain duplicate local to the report's only
major and shipped it across a pillar boundary where nobody caught it. C1's own arithmetic is
also slightly loose in two harmless places (the section count, the fifteenth id). C3, by
contrast, verified its own claims against the code every time I checked, and its one overstated
sentence is about what a script proves, not about what the code does. C2 is the strongest of the
three: every finding reproduced, and its analysis of the B1-01 mechanism is exactly right; its
only gap is that it stopped one step short of asking whether the state it had reached was
recoverable.

Practically: trust C2 and C3 as written, subject to the three sharpenings above. Trust C1's
structure, error-handling and eslint sections. Do not act on C1-07's token list or C1-09 without
re-checking each token for dynamic construction first.

### Ranked surviving findings

**Majors, in the order I would take them.**

1. **C3-01 / C2-04** `stageFiles` drops dependent monster records. The only finding here that
   loses content silently, it is the third instance of the exact failure shape GOTCHAS documents
   twice, and it fires on the *default* file order rather than an unlucky one. It sits in the
   staging code K3 will touch anyway.
2. **C2-02** the stale-parser notice offers a remedy that cannot work for a web-fetched library.
   No data risk, but D137's whole point is that a stale digest is the first thing misdiagnosed,
   and this actively misdirects the diagnosis. D153 and D155 territory.
3. **C2-01** Escape closes 4 of 14 modals. Cross-cutting, ten surfaces, and the fix is one
   fallback clause in a handler that already exists.
4. **B1-01 presentation** the first import from an empty profile replaces the visible library
   and reports it as an addition. Downgraded by V-C-c: recoverable in one click, so this is a
   copy and confirmation problem, not a model problem. D137 stands.

**Trivial, one line each, no design implication.**

- Remove `featureFirst` (extract.js:1191). Dead local, identical to `readOrder`. No `extract.py`
  counterpart, so "both extractors or neither" is not engaged.
- Pluralise `applyPlan`'s success sentence (app.js:5710-5711). Same shape as v1.5.10's accepted
  `importSummary` fix (V-C-b).
- Add `assert "</style" not in css.lower()` to `build.py` beside the three `</script` asserts
  (C3-03).
- Drop the unread `type`, `recharge` and `src` from the destructuring at app.js:6200.
- The four unscoped dead functions C1 names (`activeFilterCount`, `csrcUnitShort`,
  `buildToggleRowSingle`, `isOriginFeat`) plus `ABIL_FULL`. Deletion is still K4's call per the
  charter, but nothing about them needs a decision.

**Needs a decision from Francesco.**

- **C3-02** whether `bump.py` should write `VERSION` only after `build.py` exits 0. It changes
  the release workflow's failure semantics, and the partial-write case (`data/data.js` new,
  `dist/` and `docs/` old) makes the current behaviour worse than it reads.
- **C3-05** whether to wire `hasSpells`/`countType` into a surface or remove them from both
  extractors. Removing a shipped digest field is a data-shape change.
- **C1-07, reduced to 21 tokens** whether the dead-CSS pass happens at all, and whether it waits
  for K4. It should not run until each token is re-checked for dynamic construction.
- **C1-02** the plural helper across 39 sites, and **C1-03** dropping `renderOptFeats`/
  `refreshAddFeat` from `refreshAll`'s member list. The second touches a function with a
  three-strikes staleness history.
- **The tooling questions.** Which L0 sweeps join the verify gate and with what exit-code
  policy; whether the six `cparity-sources.js` assertions are folded into `cparity.js` (my
  recommendation) or added as a fifth gate line; whether `eqeqeq` is promoted from `warn` to
  `error` and, if so, whether it moves to `["always",{null:"ignore"}]`; and whether
  `no-unused-vars` gets `caughtErrorsIgnorePattern` so the file reads 15 instead of 57.
