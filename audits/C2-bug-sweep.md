# C2 — browser-driven bug sweep

Pillar C2 of the 2026-09 three-pillar audit (D157). Auditor: a fresh agent in its own worktree,
driving the real dev server and the Pages build through a headless browser pane. Read first:
B1-live-ux.md (B1-01, B1-02, B1-07 reproduced/extended below, not restated), C3-data-pipeline.md
(C3-01 reproduced live in section 4), CLAUDE.md, GOTCHAS.md in full, DECISIONS.md D157.

Server: `python3 serve.py 8012` from this worktree, `data/` symlinked to the main checkout.
Browser: the Claude Code browser pane, tab-2 on `http://localhost:8012`. The pane never composited
a screenshot in this session (reported "hidden" throughout) — `getBoundingClientRect` and
`getComputedStyle` still worked normally (unlike the fully-frozen case GOTCHAS describes), so
every check below is a DOM/state assertion, not a pixel read. No screenshots exist for this
report; nothing in these findings depends on one.

Working note on the origin: `/src/index.html` and `/docs/index.html` are the SAME origin on this
port (`localhost:8012`), so they share one `localStorage` and one IndexedDB — an import made from
the Pages build is immediately visible to the dev build and vice versa. This is stronger than the
"same port, different worktree" collision GOTCHAS already warns about; it is the same collision
for a completely mundane reason (one server, two paths). Anyone testing "docs first-run" against
a dev server that also serves `/src` on the same port is not testing two independent profiles.

---

## 1. Library-fetch record

Menu → Library → **Update data**, on an untouched dev-page profile (43 baked/built-in books).

- Repo/version resolved: **5etools v2.34.1**.
- Progress line during fetch: `Fetching v2.34.1 — 57/186: bestiary-mcv1sc.json` (186 candidate
  paths in the tree, 56 kept files after `zipWanted()`).
- Wall time: **~24 seconds** (clicked at unix `1788298782`, tray fully rendered by `1788298806`).
- Result strip: `Read 56 files — 936 spells · 27 classes · 322 subclasses · 276 feats · 215
  species · ⚠ 15 spells no class can reach.`
- Pending-import tray: **56 FILES**, 43 of 43 books ticked, "Add 43 books". No error, no refusal.
- After **Add 43 books**: `Added. 43 books · 936 spells · 27 classes · 322 subclasses · 276
  feats · 215 species.` Status strip: `43 books · 5etools v2.34.1 · parser v1.5.10 · ≈ 1 MB in
  this browser`. Every row now carries a `web` origin chip instead of `built-in`.

No refusal, no rate limit, nothing to record as a failure path — the fetch worked cleanly and
was re-run twice more during this sweep (each ~20-25s) with identical results. The "⚠ 15 spells
no class can reach" line is the app's own honest warning (documented behaviour, not a bug) and
was not investigated further — it is stable across runs at the same repo version.

---

## 2. B1-01 verdict — both states, precisely

B1-01 says pasting a one-spell brew takes the library from 43 books to 1. That is true, but only
under one specific condition, and the sweep asked for exactly which one. Same probe brew pasted
in both states:

```json
{"_meta":{"sources":[{"json":"TSTA","abbreviation":"TSTA","full":"Test Book A"}]},
 "spell":[{"name":"C2 Probe Spell","source":"TSTA","level":1,...}]}
```

**State A — a real digest already sits in IndexedDB** (the 43-book web-fetched library from
section 1, `IMPORT_CACHE` populated). Paste → Add 1 book:

- `DATA.sources` **43 → 44**, `DATA.spells` **936 → 937**. `hasXPHB` stays `true`. The 43 real
  books are untouched; the pasted book is appended. **Merges correctly**, exactly as D86 says.

**State B — a fresh page with an empty IndexedDB** (kv store cleared, reload, so `assembleData()`
falls through to the baked 43-book bundle — the literal "profile you get" the brief describes).
Same paste, same brew, Add 1 book:

- `DATA.sources` **43 → 1**, `DATA.spells` **936 → 1**. `sourceKeys` = `["TSTA"]` only. `hasXPHB`
  is `false`. **Every baked book is gone**, matching B1-01 exactly.

**Verdict: B1-01 is real and it is a first-import edge, not a general merge bug.** The mechanism
is `assembleData()`'s `IMPORTED||BAKED` (GOTCHAS: "Content assembly ... imported > baked > empty,"
also D137) — an import REPLACES what `assembleData` was showing, it never merges baked content
into an import. `mergeSources`/`mergeDigests` (app.js:5302-5323, D86) only run when there is
already something in `IMPORT_CACHE` to merge onto. The very first content action taken from a
totally fresh profile — paste, upload, or web fetch — always discards the 43 baked books, because
there is no prior import to merge onto and the baked bundle was never a candidate to merge with.
Once ANY digest exists in IndexedDB, D86's merge behaves exactly as documented for every
subsequent action. Reproduced identically on `/docs/index.html`'s SRD-only baked bundle (1 → 1,
same replace) — this is not a `/src`-only quirk.

This sharpens B1-01's suggested direction: the fix that matters is at the FIRST content action
from empty state (make it merge with baked, or warn unambiguously before it discards 43 books),
not at the general merge path, which already works.

---

## 3. Findings

| id | severity | scenario / step | what happened vs expected | evidence | repro | cause | size | D-ids |
|---|---|---|---|---|---|---|---|---|
| C2-01 | major | cross-cutting: Escape on every modal | Only 4 of the app's 14 `.modal`-classed overlays close on Escape: the spell detail modal, the guide pick modal, the forms chooser, and the "over" spell picker, plus the timeline (`closeTimeline()`, also called from the same handler). Escape does **nothing** on `#printModal`, `#buildModal`, `#importModal` (Library), `#newBuildModal`, `#srcAskModal`, `#csrcModal`, `#customModal`, `#hbModal`, `#entityModal`, `#prepModal` — 10 modals with zero keyboard-Escape path, even though every one of them closes correctly on an outside/backdrop click. | Dispatched a synthetic `Escape` `keydown` on `document` with `#printModal` open: `hiddenAfterEscape` stayed `false`. Repeated on `#tlModal` (timeline): closed correctly, confirming the dispatch itself was valid. | From an empty profile: open the Print modal (⋯ → Print), press Escape. Modal stays open. Same for Builds, Library, New build, Custom source, My homebrew, Prepare daily, and the species/feat entity picker. | `document.addEventListener("keydown", ...)` at app.js:7648 special-cases only `GPICK`, `FAM`, an "over" `#pickModal`, and calls `closeSpModal()`/`hideTip()`/`closeBswMenus()`/`closeTimeline()` — there is no generic "close the topmost open `.modal`" fallback, so any modal not named in that one function is unreachable by keyboard. | S | extends B1-04 |
| C2-02 | major | S3: stale-parser notice, web-fetched library | On a library built entirely through **Update data** (D153, no local folder ever chosen), the stale-parser notice's only action, **Refresh now**, calls `refreshImported()` — which is folder-only. With `FOLDER` null and no folder `SCAN` this session, it falls straight to the folder-choosing dead end: `"Refresh needs your 5etools files — choose the folder above (it will be remembered), or drop the .zip and Apply."` The real remedy for a web-fetched library is **Update data** again, a completely different code path the notice never offers. | Stamped all 43 `IMPORTED.sources[*].parser` to `"1.0.0"`, called `staleParserNotice()`: notice appeared correctly (`"Your imported books were read by parser v1.5.10 ... Refresh to re-read them"`). Clicked "Refresh now": `#importReport` read `"Refresh needs your 5etools files — choose the folder above..."`, and a second notice appeared: `"Refresh needs the folder — choose it in the Library."` | From a web-fetched library (Update data, Add N books), in the console: set every `IMPORTED.sources[c].parser` to an old version string, call `staleParserNotice()`, click its "Refresh now" button. | `refreshImported()` (app.js:5773) only knows `FOLDER`/`SCAN` (D129/D138's folder-first design); it has no branch for a `webSync`/`Update data` origin. `staleParserNotice()` (app.js:5897) always offers "Refresh now" whenever `!allMiss`, regardless of how the stale books were originally read in. | M | D153, D138, D137 |
| C2-03 | minor | S3: duplicate source key | Pasting/uploading a brew whose `_meta.sources` reuses an EXISTING book's code (e.g. `"json":"PHB"`) with its own `full` name is offered as **"Re-read 1 book — only identical entries are replaced."** Confirming it merges the content safely (PHB's real 361 spells survive, the pasted spell is added, count goes 361→362) but **silently renames the real book's display title everywhere it's shown** — `DATA.sources.PHB.name` went from `"Player's Handbook (2014)"` to the brew's `"Hijacked PHB"`, with no separate confirmation naming the rename. | Pasted a brew `{"_meta":{"sources":[{"json":"PHB","full":"Hijacked PHB"}]},"spell":[...]}`; clicked "Re-read 1 book". Before: `phbSpellCount 361`, `phbName "Player's Handbook (2014)"`. After: `phbSpellCount 362` (content fine), `phbName "Hijacked PHB"`. | From any state: Library → Add files → Paste JSON, paste a `_meta.sources` block reusing `"json":"PHB"` (or any real book code) with a different `full`, Add pasted JSON, click "Re-read N book(s)". | `mergeSources()` (app.js:5302-5310) keeps the OLD name only when the incoming name is falsy or literally equals the bare code (`m.name=was.name` guarded by `!v.name\|\|v.name===c`) — that guard exists for D86's placeholder case (a code with no real title), not for "the incoming file's stated title differs from the real one." Any non-placeholder incoming name always wins. | S | D86 |
| C2-04 | major (confirms C3-01) | C3-01 browser repro, "Upload .json files" | Live confirmation of C3's static finding: `stageFiles()` never calls `resetFormRefs()` and never sorts by `readOrder`, so a bestiary file processed before the feature file that names its familiar forms silently drops those monster records — no error, no warning, no trace in the tray. Built the smallest possible repro: an `optionalfeature` naming `{@creature imp\|mm}` inside a "forms" sentence, and a `bestiary-mm.json` holding `Imp` (fiend, CR 1 — fails every other `carriedMonster()` test). Fed both through the exact production `stageFiles()` function with the bestiary listed first: staged `bestiary-mm.json` came back with **`monster: []`** (0 of 1). Reversed the order (feature file first): staged bestiary came back with **`monster: [Imp]`** (1 of 1) — same two files, same function, order is the only variable. | `IMPORT_STAGE` inspected directly after each `stageFiles()` call; see repro. | In the console, on the Library's Upload-.json-files path or a plain (non-zip) drag-drop: build two `File` objects (a feature file with a `{@creature X\|src}` "forms" sentence, a bestiary file holding that monster with no other qualifying trait), put the bestiary FIRST in the `FileList`/`DataTransfer`, call `stageFiles(...)`. The staged bestiary entry's `monster` array is short by the dropped record(s), silently. | `stageFiles()` app.js:5147-5154 — no `resetFormRefs()` call anywhere in the function (contrast `webFetchAll` app.js:5205/5203 and `stageScanBooks` app.js:5598-5599, both of which reset+sort). `slimJson`/`carriedMonster`/`FORM_REFS` in extract.js:806-836. | M (fix already scoped by C3) | — |

Three cross-cutting probes came back clean and are recorded as holds rather than findings:
double-click/rapid-arm on `#libSelBar`'s Remove and the Library tray's Discard both behave —
the second click only fires the destructive action if it lands inside the arm window; a slow
second click (a fresh tool round-trip, ~1-3s) finds the button already reverted to its unarmed
label rather than double-firing. The armed window is short enough that a human could plausibly
miss it too, but that is a UX-timing question for B1, not a functional defect — nothing fired
twice, nothing corrupted.

An unknown-class-key build import (`clsKey:"Nonexistent|SOMEFUTUREBOOK"`) was pasted and
switched to: no console error, no crash, the class row rendered with empty `— none —`
placeholders, `#srcAskModal` correctly gated the switch on the unrecognized book first. **This
check is reported with a caveat, not as a clean pass**: at the moment it ran, `DATA` itself had
been reduced to a single custom-pasted book by an earlier step in this same session (a
side-effect of chasing B1-01's mechanism on the docs/src shared origin), so `classOptions()`
correctly had nothing to offer regardless of the unknown class — the "every class already in
this build" / zero-option `<select>` observed is explained by that confound, not by the unknown
key. Re-run this specific check from a full 43-book library before trusting it either way.

---

## 4. Invariant checker

Injected once per active build after each mutation (`window.c2Invariants`, source below). It
never reported a `problems[]` entry across S1/S2/S3 — no duplicate choice ids, no non-array
`chosen[].spells`/`.cantrips`, no `nFilled > cap` on any `R.cart` row it could see, `PREVIEW.level`
was `null` on every check taken outside a preview. One caveat: `orderLen` (raw `state.levelOrder`
length) stayed `0` throughout single- and multi-class builds that were never leveled through the
timeline's drag-reorder UI — `classLevelPlan()`'s own length (`planLen`) tracked the character
level correctly in every case, so this reads as `levelOrder` only getting populated by an actual
reorder action (which this sweep did not simulate — see the drag-reorder gap in the claims
register), not as a bug on its own.

```js
window.c2Invariants = function(){
  const problems = [];
  const st = state;
  const seenIds = new Set();
  for (const k of Object.keys(st.choices||{})) {
    if (seenIds.has(k)) problems.push('duplicate choice id '+k);
    seenIds.add(k);
  }
  let planLen = null, orderLen = null;
  try {
    orderLen = (st.levelOrder||[]).length;
    if (typeof classLevelPlan === 'function') planLen = classLevelPlan().length;
  } catch(e) { problems.push('classLevelPlan threw: '+e.message); }
  let previewLevel = 'n/a';
  try { previewLevel = (typeof PREVIEW !== 'undefined') ? PREVIEW.level : 'undefined-var'; }
  catch(e) { previewLevel = 'err:'+e.message; }
  const rowProblems = [];
  for (const rowId of Object.keys(st.chosen||{})) {
    const row = st.chosen[rowId];
    for (const kind of ['spells','cantrips']) {
      const arr = row[kind];
      if (arr && !Array.isArray(arr)) rowProblems.push(rowId+'.'+kind+' not array');
    }
  }
  let budgetProblems = [];
  try {
    if (typeof R !== 'undefined' && R && R.cart) {
      for (const rowId of Object.keys(R.cart||{})) {
        const c = R.cart[rowId];
        if (c && typeof c.nFilled === 'number' && typeof c.cap === 'number' && c.nFilled > c.cap)
          budgetProblems.push(rowId+': nFilled '+c.nFilled+' > cap '+c.cap);
      }
    }
  } catch(e) { budgetProblems.push('R check threw: '+e.message); }
  return {
    problems: problems.concat(rowProblems).concat(budgetProblems),
    orderLen, planLen,
    previewLevelIsNull: previewLevel===null, previewLevel,
    featCount: (st.feats||[]).length, optFeatCount: (st.optFeats||[]).length,
    classesCount: (st.classes||[]).length, choicesCount: Object.keys(st.choices||{}).length,
  };
};
```

Sample result after the S2 multiclass build (Wizard 5 / Cleric 4, 8 spells picked, one dropped
mid-array, one dropped at the tail, a level removed and re-added):
`{"problems":[],"orderLen":0,"planLen":9,"previewLevelIsNull":true,"previewLevel":null,
"featCount":0,"optFeatCount":0,"classesCount":2,"choicesCount":0}` — clean.

Notes for whoever extends this: `state`/`DATA`/`R`/`PREVIEW`/`classLevelPlan` are `let`/`const`
top-level bindings in `app.js`, not `window` properties — they're reachable by bare name from a
same-realm `eval`/injected script (which is how this checker and every other probe in this sweep
reached them), but `Object.keys(window)` will not find them. Functions declared with `function
name(){}` at the top level DO show up on `window` (e.g. `exportBuild`, `switchBuild`, `SB_extract`).

---

## 5. GOTCHAS re-test table

| entry | re-tested? | holds / regressed |
|---|---|---|
| D146 — a drop leaves an EMPTY SLOT (`∅\|`), never a splice; only the LAST position shrinks | yes, both halves | **holds** — dropped a mid-array spell (position 1 of 8): array became `[...,"∅\|",...]`, positions unchanged. Dropped the new tail position: array shrank by one, no trailing hole. |
| D42 — nothing prunes on a source change; a pick is flagged, never pruned | yes, both disable-book and full-removal paths | **holds** — disabling a book via `SRC.delete()` left the pick in `state.chosen[].spells` and raised the gap bar (`"1 pick needs a book you have turned off"`); removing the book entirely via the Library selection bar (armed Remove) left the same pick in place and raised `"1 pick needs a book that isn't loaded — re-import it"`. Re-enabling cleared the gap bar with the pick still there. |
| D86 — an import merges (void since D86; not a replace) | yes | **holds, with the documented boundary sharpened** — see section 2. Merges correctly whenever `IMPORT_CACHE` already holds something; the very first content action from an empty profile still replaces the baked bundle by construction (`IMPORTED\|\|BAKED`), which is exactly what B1-01 reports. |
| "Content assembly: `IMPORTED\|\|BAKED`... not a merge" | yes | **holds** — this is the mechanism behind both the B1-01 verdict and C2-03's book-rename; confirmed identically on `/docs` (SRD-only baked bundle) and `/src` (43-book baked bundle). |
| D53 — native `confirm()`/`alert()` banned; destructive actions use `armConfirm()` | yes | **holds** — Library selection-bar Remove and the pasted-tray Discard both arm to "Confirm?" and revert if not confirmed promptly; no native dialog appeared anywhere in this sweep. |
| D135 — a `<select>` must always contain its own current value | attempted, inconclusive | see the unknown-class-key caveat in section 3 — the specific run was confounded by an emptied `DATA`, so this needs a clean re-run before it can be marked either way. |
| D122 / E5 — the timeline is a full modal, Escape closes it before anything under it | yes | **holds** — `closeTimeline()` fired correctly on a synthetic Escape with the timeline open over the class rows. |
| C3-01 — `stageFiles()` drops content depending on file-read order | yes, live browser repro | **regressed / confirmed live** — see C2-04. Not previously exercised in a browser; now reproduced with a minimal two-file case in both orders. |
| D91/D92 zip-import gotchas (foundry.json, lookup clobber, MAX_ZIP) | no | not tested this session — no zip file was constructed or dropped. Flagged in the claims register as unexecuted, not as "holds." |
| Shared browser storage across localhost ports/origins | yes (a stronger case: same port, two paths) | **holds / confirmed** — `/src` and `/docs` on `:8012` are the identical origin, so an import made through one is visible from the other immediately; this needs to be accounted for by anyone testing "first run on the Pages build" against a dev server also serving `/src`. |

---

## 6. Storage restore proof

Baseline snapshot taken before any interaction (this origin, `localhost:8012`):

- `localStorage`: 2 keys, `spellForge.builds.v1` (1176 bytes) and `spellForge.sources.v1`
  (292 bytes) — a single empty "New character · v1" build with all 43 codes enabled. This was
  NOT an empty profile; it carried a leftover default build from whatever last touched this
  origin, consistent with GOTCHAS' warning that the browser pane's storage is shared and
  port/path isolation cannot be assumed.
- IndexedDB `spellForge`: stores `kv` and `handles`, both empty (no `import` key, no remembered
  folder handle).

End-of-session restore: `localStorage.clear()` then both keys rewritten from the exact baseline
strings captured at the start; `kv` and `handles` object stores cleared via the same transaction
pattern. Verified in the same call, not a separate trust-me step:

```json
{"lsKeysAfter":["spellForge.builds.v1","spellForge.sources.v1"],
 "lsMatchExact":true,
 "kvKeys":[],"handleKeys":[],
 "builtSize":1176,"srcSize":292}
```

`lsMatchExact` is a `JSON.stringify` equality between the restored key/value map and the
baseline map taken at session start — byte-identical, not just same key set or same lengths.
A follow-up reload of `/src/index.html` against the restored storage booted cleanly: 43 baked
sources (no import present, as expected), 1 build (the original empty "New character · v1").
Dev server (PID captured at launch) was killed by PID, not by `pkill`, after the restore was
verified; port 8012 confirmed free afterward.

---

## 7. Trivial fixes applied

**None.** D157(a)'s bar (a one-token typo or a plainly-wrong label) was not met by anything found
in this pillar — every defect above is behavioural and belongs in the findings table, not a local
edit. No files under `src/`, `docs/`, `dist/`, or `data/` were modified in this worktree.

---

## 8. For the docs

Not written here — shared docs (`PLAN.md`, `GOTCHAS.md`, `DECISIONS.md`) are explicitly out of
scope for this worktree per the brief. Candidate propagation, for whoever runs the synthesis
triage:

- **GOTCHAS.md**: C2-04 is the browser-side half of the C3-01 entry C3 already proposed —
  the two should land together, one entry, since they're the same defect proven two ways.
  C2-01 (Escape) is a strong candidate for its own entry given how load-bearing the existing
  "Escape must take the raised layer first" / "prefer `e.composedPath()`" entries already are
  for the handful of overlays that DO implement it — the gap is that ten more never got the
  same treatment at all.
- **PLAN.md**: none of these findings block Phase K3/K4 on their own reading, but C2-02 (stale
  library, web-fetch origin) sits directly in D153/D155's territory and is worth folding into
  whichever session next touches the web-fetch refresh path, alongside C3-01/C2-04.
- **DECISIONS.md**: no new decision needed for the findings themselves (this report is that,
  per D157(f)); a decision attaches to whichever fix Francesco picks at triage.

---

## 9. Claims register

What this report verified directly vs. what it did not reach, given the session's scope:

**Verified directly, with live evidence quoted above:** the library fetch (timing, counts,
tray contents); the B1-01 mechanism in both states; D146 (both halves); D42 (both disable and
full-removal paths); D53 (two live arm/confirm flows); D86/`IMPORTED||BAKED` boundary; the
timeline's Escape handling; the export→import build round trip (confirmed **ADD, never
overwrite** — export the active build's JSON via `buildExportObj`, paste into Builds → Import,
confirm: build count 3→4, a dedup suffix `(2)` applied automatically, `activeId` untouched);
fork-a-variant (`savePreviewAsVersion`) and switch-build (gated correctly by `#srcAskModal` when
the target build's snapshot sources differ from the live set); malformed-JSON paste (clean
error, no crash); duplicate-source-key paste (C2-03); the C3-01 browser repro in both file
orders; the print sheet at 1280 and 375 (CSS lifted from `@media print` into a plain
`<style>` per CLAUDE.md's method, header/body/tableView visibility and the 9-row spell table
both verified via computed styles, not screenshots); first-run on `/docs/index.html` from a
genuinely cleared origin (SRD-only baked bundle, 339 spells / 12 classes / 1 source, reload
persistence of a subsequent import); the service-worker's known-broken registration inside this
sandbox (matches the GOTCHAS entry exactly — not re-litigated as a new finding).

**Not executed this session, and not claimed as "holds" anywhere above:** the timeline's actual
pointer drag-reorder (only `wireRowDrag`'s existence and the invariant checker's `orderLen`
reading were touched, not a simulated drag — GOTCHAS' D132/D141(a) shape was not exercised);
the guided-builder walkthrough end-to-end (opened and read once during S2's context, not walked
step-by-step); a real zip upload/drop (D91/D92's foundry.json and MAX_ZIP paths); keyboard-only
navigation through the header and a full modal (tab order, focus trapping — B1-03/B1-04 already
cover this territory at a heuristic level); resize-during-open-modal; browser back-button
behaviour; localStorage-near-quota. These were named explicitly in the brief and are recorded
here as gaps, not silently dropped — a second pass with more budget should start with the
drag-reorder and zip-upload paths, since both sit on top of gotchas (D141(a), D91/D92) with a
documented history of breaking.

**Confounded and flagged rather than reported as a finding:** the unknown-class-key import check
(section 3) — the DATA state at the time of that specific check had already been reduced to a
single custom book by an earlier probe, so "every class already in this build" cannot be
distinguished from "there are no classes to offer" in that run. Needs a clean re-run.

Branch: `worktree-agent-a8a196cdc8d3d57e9`. No shared docs touched. No files under `docs/`,
`dist/`, `data/` touched. `VERSION`/`bump.py`/`build.py` not touched.
