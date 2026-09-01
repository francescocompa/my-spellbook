# C3 — data pipeline and persistence audit

Scope (D157(e)): extract.py, src/extract.js, the importer and staging flow in src/app.js,
IndexedDB and localStorage persistence and migrations, the web fetch (D153), build.py,
bump.py, serve.py, docs/sw.js. Read against D86, D91, D92, D93, D112, D137, D138, D153,
D154(g), D155(e), D156, D42, D33–D35, D117/D140, and GOTCHAS.md in full.

Worktree: `worktree-agent-ac133f0c0868522f5`, based on main@00ab59e (v1.5.8). Data symlinked
from the main checkout; mirror at `~/Documents/D&D/5etool_mirror/5etools-v2.33.3/data`.

No behavioural edits were made to extract.py, extract.js or app.js. Two new scripts were
added under `scratchpad/` (see "Scripts added"). This document and the two scripts are the
only changes in this worktree.

## Gate and cparity

All four verify-gate commands pass, and `node scratchpad/cparity.js` reports 0 fail:

```
python3 -c "import ast;ast.parse(open('extract.py').read());ast.parse(open('build.py').read())"   → OK
node -e "…new Function(…app.js/extract.js/sw.js…)"                                                  → OK
python3 -c "import json;json.load(open('data/data.json'));json.load(open('docs/manifest.webmanifest'))" → OK
node scratchpad/cparity.js                                                                          → 0 FAIL
```

cparity's own tail: `report: {"spells":936,"classes":27,"subclasses":322,"feats":276,
"species":215,"books":64,"lookup":true,"files":186,"errors":[],"noAccess":15}` — matches the
counts D153 recorded live (936/27/322/276/215).

Every curated check passed: spell/class/monster counts, Find Familiar's level/creatures/desc,
zero hollow spells, zero sidekick classes, the feat catName histogram, category-exclusive
feats, byte-identical prereq text, cast mods, grant notes, grants diffed record-by-record
across all five grant-bearing arrays (classes/subclasses/feats/races/optfeats, 0 diffs, 0
one-sided records each), spell ACCESS diffed record-by-record (0 diffs, 801 spells with class
access on both sides), feature form grants, whole-record canonical diffs for all seven arrays
plus monsters plus conditions (0 diffs everywhere), the D127 `_copy`-resolution checks
(0 hollow subclasses, every reprint pointer present, the Aberrant Mind|TCE twin whole and
pointing at Aberrant|XPHB), and the D130 subclass-spell-list census pinned at the current
6-record literal.

**cparity is exhaustive for what it covers.** It drives the real predicates (`zipWanted`,
`dropFoundryStubs`, `readOrder`, `carriedMonster`) exactly as GOTCHAS requires, and its
whole-record canonical diff means a NEW field added to either extractor without its twin is
caught automatically, not just the fields someone remembered to name. The asymmetry work
below is about what sits **outside** that coverage — surfaces cparity never touches — not
about re-verifying what it already verifies well.

## Asymmetry table — beyond cparity's coverage

| # | Surface | extract.py | src/extract.js | cparity coverage | Verified today |
|---|---|---|---|---|---|
| A1 | `digest.sources` (book registry — D33/D92/D113) | `src_counter` loop, line 1725–1733 | `counter`/`sources` in `buildDigest`, line 1029–1037 | **Never compared.** Every other top-level digest array is diffed whole-record; `sources` is not. | Now compared by `scratchpad/cparity-sources.js` — 0 diff, 43/43 books, identical name/group/counts on both sides. |
| A2 | `fullMc` / `pact` (multiclass + pact slot tables) | Written into `digest` (extract.py:1749–1754) | **Not written at all** — extract.js's digest carries neither field; app.js falls back to its own hardcoded `FULL_MC`/`PACT` consts (app.js:102–108, `emptyDigest`/`assembleData`/`mergeDigests` all read `base.fullMc\|\|FULL_MC`) | **Never compared, on either side.** Not in cparity (extract.js has nothing to diff) and nothing diffs app.js's copy against extract.py's. | Now compared by `scratchpad/cparity-sources.js` — app.js's `FULL_MC`/`PACT` are byte-identical to extract.py's `data.json` output today. |
| A3 | Foundry-stub exclusion mechanism | Explicit glob (`spells-*.json`, `class-*.json`, `bestiary-*.json` + a belt-and-suspenders `startswith("foundry")` skip) — never sees a `foundry*.json` file at all | `zipWanted()` + `dropFoundryStubs()` — a general-purpose filter, because a zip's file set isn't chosen by extract.py's own globs | By design, not a gap: any foundry stub that slipped through would corrupt a record and trip cparity's whole-record diff. | Not a live asymmetry — noted for completeness. |
| A4 | `hasSpells` (feats/optfeats), `countType` (classes) | Computed and written (extract.py:1615, 1649, 1199) | Computed and written identically (extract.js:935/949/901) | Parity-protected (part of the whole-record diff — any divergence would be caught) | **Dead on the consumer side** — `grep -c` finds zero references to either field anywhere in `src/app.js`. Not a correctness bug: both extractors agree, and cparity would catch drift. It is unread output shipped in every digest. See finding C3-05. |

None of A1–A4 represent a live divergence between the two extractors today. The finding is
that A1 and A2 were **untested surfaces** — exactly the shape of gap that let the
`spells/sources.json` lookup clobber and the `foundry.json` stub bug hide for two sessions
each (GOTCHAS: "a parity harness must drive the real predicates," twice). `fullMc`/`pact` in
particular is a **third, unenforced copy** of the same sixteen numbers (extract.py's arrays,
extract.js's absence-by-design, app.js's hardcoded fallback) with no test binding the three
together before this session. Both gaps are now closed by `scratchpad/cparity-sources.js`.

## Digest schema

Top-level digest keys (both extractors, `buildDigest()` in extract.js / the `digest = {…}`
literal in extract.py, line ~1749): `meta`, `sources`, `spells`, `classes`, `subclasses`,
`feats`, `races`, `optfeats`, `monsters`, `conditions`, plus `fullMc`/`pact` **on the
extract.py side only** (A2 above).

- `meta`: `{mirror, spellCount}` (extract.py) vs `{spellCount, imported:true}` (extract.js) —
  deliberately different; `assembleData()` never reads `mirror`, and `imported` is what lets
  the app tell a baked digest from an imported one at a glance. Not an asymmetry, a
  by-design difference in what each producer knows about itself.
- `sources[code]`: `{name, group, counts:{spells,classes,subclasses,feats,species}}` from
  both extractors, **plus `parser`/`parsedAt`/`origin`** — added only by app.js at Apply
  time (`applyPlan`, app.js:5674–5682), never by either extractor. `filterDigest` (app.js:
  5323–5351) explicitly carries these three stamps through when it rebuilds `out.sources`
  from a keep-set — this is the exact fix D138(a)'s "false success" needed and it is present
  and correct.
  - `sources` with **none of the three stamps** (a pre-D138 digest, or the baked bundle) is
    read, not guessed: `bookOrigin()` (app.js:9278–9284) falls back to `"web"` if
    `webSyncRec()` names a version, `"file"` otherwise, and `staleBooks()` falls back to the
    digest-wide `meta.parser` for a pre-D138 stamp. Both fallbacks match D138/D155(e)
    verbatim; the "matching timestamps" approach the same decision rejected is not present in
    the code.
- Content arrays (`spells`/`classes`/`subclasses`/`feats`/`races`/`optfeats`): field sets are
  byte-identical between extractors per cparity's whole-record diff. Every field is consumed
  by app.js **except** `hasSpells` and `countType` (A4/C3-05).
- `monsters`: `{"<Name>|<SRC>": statblock}`, referenced-only (D78) — never the full bestiary.
- `conditions`: `{"<lowercase name>": {name, source, page, kind, desc}}`.

`app.js` never reads a digest field that neither extractor writes (spot-checked: `traits`,
`table`, `grantsFightingStyle`, `bonusChoices`, `fsClass`, `repeatable`, `featSlots`,
`castMods`, `forms`, `marks`, `spellList`, `subclassLevel` are all consumed at least once);
the only fields written and never read are `hasSpells`/`countType` (A4).

## Hazard findings

Ranked by severity. Each carries the exact line, a repro, a suggested fix, a size estimate,
and the decisions it touches.

### C3-01 — severity: major — silent data loss in the "Upload .json files" path

**File:** `src/app.js:5144–5152` (`stageFiles`).

Every OTHER file-ingestion path resets and orders the shared `FORM_REFS` state before calling
`slimJson()` on each file:

- `unzipJsonFiles` (extract.js:1192–1194) — `resetFormRefs()`, then sorts by `readOrder`.
- `webFetchAll` (app.js:5205, 5203) — `SX.resetFormRefs()`, then sorts by `readOrder`.
- `stageScanBooks` (app.js:5598–5599) — sorts by `readOrder`, then `resetFormRefs()`.

`stageFiles` — the "＋ Add files ▾ → Upload .json files" verb and the plain (non-zip)
drag-drop path (D112/D154(f)) — does **neither**. It iterates the dropped `FileList` and
spins up one `FileReader` per file; each `onload` independently calls
`window.SB_extract.slimJson(j)` the moment ITS OWN read completes, with:

1. **No `resetFormRefs()` call anywhere in the function** — `FORM_REFS` carries over from
   whatever the LAST import in this page session left it at, or starts empty on a fresh page.
2. **No ordering at all** — `FileReader.onload` fires in I/O completion order, not array
   order, so even sorting `fileList` first (which the code doesn't do either) would not be
   enough.

`slimJson()` filters a bestiary file's `monster` array through `carriedMonster()`, which
checks `FORM_REFS` — the set of monster names/keys a FEATURE's prose names as a valid form for
a familiar spell (Pact of the Chain's Imp, Strixhaven's Mascot — D50/D78's narrow,
deliberately-scoped extra set). If the bestiary file's `onload` fires before
`optionalfeatures.json`'s/`feats.json`'s has populated `FORM_REFS`, `carriedMonster()` sees an
empty (or stale, unrelated) set and the Imp/Mascot are filtered OUT of the monster array
**before the file is ever staged** — silently, with no error, no warning, and no way to
recover short of re-uploading that exact bestiary file after the feature file has been
processed.

This is the same failure shape as the two worst bugs in this project's history (`foundry.json`
overwriting real records, D82; the `sources.json` lookup clobber, D91) — a file processed in
the wrong order or the wrong state, no error surfaced, content silently missing. The blast
radius here is much smaller (2–3 specific monster records, not 900+ spells), which is why this
is "major" rather than "blocker": it degrades a narrow, already-scoped feature rather than
corrupting the whole library.

**Repro for C2 (browser):**
1. Open the Manage/Library modal, "＋ Add files ▾ → Upload .json files".
2. Select, in a single multi-select, a mirror's `bestiary/bestiary-xge.json` (or any file
   carrying the Imp) together with `optionalfeatures.json` (which carries Pact of the Chain's
   prose naming it). Large files read slower — picking a big bestiary alongside the small
   feature file increases the odds the bestiary's `onload` wins the race, but it is a genuine
   race and may need a few attempts, or forcing it directly:
   `window.SB_extract.resetFormRefs(); window.SB_extract.slimJson(bestiaryJson);` called BEFORE
   `optionalfeatures.json` has ever been scanned reproduces it deterministically in one line —
   the Imp is present in `bestiaryJson.monster` before the call and absent after.
3. Apply, then check the stored digest's `monsters` map for the Imp's key — compare against a
   zip import of the same two files, which (per `scratchpad/cparity-formrefs.js`) always
   processes features first and keeps it.

**Suggested fix:** call `window.SB_extract.resetFormRefs()` once at the top of `stageFiles`
(matching every other ingestion path), and either (a) sort `fileList` by
`window.SB_extract.readOrder` before creating readers and await them sequentially rather than
in parallel, or (b) read every file to a parsed-but-unslimmed `{name, json}` list first, sort
that list by `readOrder`, THEN run `slimJson` over it in order — mirroring
`stageScanBooks`'s shape (app.js:5587–5608) exactly. Size: **S**. Decisions: D92 ("the folder
scan must reuse `zipWanted()`, never its own filter" — the same discipline applies to ordering,
which `stageFiles` alone skips), D50/D78 (the predicate this breaks), D112 (owns this verb).

### C3-02 — severity: minor — `bump.py` can leave `VERSION` ahead of what was actually built

**File:** `bump.py:44–52`.

```python
new = f"{major}.{minor}.{patch}"
with open(PATH, "w", encoding="utf-8") as f:
    f.write(new + "\n")
print(f"{cur} -> {new}")
subprocess.run([sys.executable, os.path.join(ROOT, "build.py")], check=True)
```

`VERSION` is written to disk **before** `build.py` runs. `check=True` means a non-zero exit
from `build.py` raises `CalledProcessError` in `bump.py` — but by then `VERSION` already holds
the new number while `dist/`, `docs/`, and `data/data.js` were never regenerated with it. This
is exactly the situation CLAUDE.md's own rule exists to prevent: "A version nothing was built
with lies in the footer." `build.py` has several `assert` guards that can legitimately fire
during active development (an inline marker not matching exactly once, `</script` appearing
in data — see C3-03) — precisely the moments `bump.py` is being run, per the "every commit
bumps it" workflow.

**Repro:** temporarily rename `<script src="app.js">` in `src/index.html` (breaking
`sub_once`'s marker match) and run `python3 bump.py` — it prints the version bump, then dies
with a traceback from `build.py`'s `assert`, leaving `VERSION` bumped and every deliverable
still built from the OLD source. (Do not do this on a real commit — it is destructive to the
checked-out working tree until reverted.)

**Suggested fix:** write `VERSION` only after `build.py` exits 0, or wrap the write/run pair
so a failed build restores the previous `VERSION` content. Size: **S**. Decisions: D117/D140
(VERSION is "the single source of truth"), CLAUDE.md § Versioning.

### C3-03 — severity: minor — `build.py`'s injection guard covers `</script` but not `</style`

**File:** `build.py:112–134`.

```python
data_json = read("data", "data.json")
assert "</script" not in data_json.lower(), "data contains </script"
...
for nm, txt in (("app.js", appjs), ("extract.js", extractjs), ("styles.css", css)):
    assert "</script" not in txt.lower(), f"{nm} contains </script"
html = sub_once(html, '<link rel="stylesheet" href="styles.css">',
                "<style>\n" + css + "\n</style>")
```

`styles.css` is checked against `</script` (irrelevant to how it is inlined) but **not**
against `</style`, even though it is the one blob wrapped in a `<style>` tag rather than a
`<script>` tag. A literal `</style` substring anywhere in `styles.css` (a comment documenting
markup, a `content:` string) would close the style block early and leak the rest of the
stylesheet as raw page text in every deliverable (`dist/index.html`, `docs/index.html`). This
is not live today — `styles.css` contains no such substring, confirmed by direct grep — so
there is no current corruption, only an asymmetric guard: three checks exist for `</script`
across app.js/extract.js/styles.css, and CSS is the one of the three that doesn't actually
need that check and does need the other one, which is absent.

`${...}` — the other escaping concern named in the audit brief — does **not** apply here:
`build.py` inlines everything via plain Python string concatenation (`"<script>\n" + appjs +
"\n</script>"`), never a JS template literal, so a `${...}` sequence inside any inlined blob
has no special meaning to the Python build step. Checked and not a hazard.

**Suggested fix:** add `assert "</style" not in css.lower(), "styles.css contains </style"`
alongside the existing three. Size: **S**. Decisions: none directly; enforces the same
inlining-safety intent CLAUDE.md's build section already states.

### C3-04 — severity: minor — web fetch (D153) surfaces generic errors for two distinguishable failures

**File:** `src/app.js:5180–5197` (`webJson`, `webResolve`, `webTree`).

Two related gaps, both cosmetic (no data-integrity risk — `webSync`'s outer try/catch already
prevents anything from being staged on failure, matching D153(d)):

1. **GitHub tree-API rate limiting (60 requests/hour unauthenticated).** A 403 from
   `api.github.com` surfaces as `"api.github.com answered HTTP 403"` — technically accurate,
   but indistinguishable from "wrong repo address" or any other 403 cause. GitHub returns
   `X-RateLimit-Remaining`/`Retry-After` headers on this response; `webJson` never reads them.
2. **The `"v"+ver` → bare `ver` retry doesn't distinguish cause.** `webTree` (app.js:5192–5194)
   retries the tree-API call with the tag's bare version number if the `"v"+ver` form throws —
   correct for "this repo doesn't prefix its tags with v", but if the FIRST call failed because
   of rate-limiting (not a bad ref), the retry immediately burns a second request against the
   same limit and fails the same way, for a doubled cost and no better diagnosis.
3. **A non-JSON 200 response** (an edge-cache interstitial, a CDN hiccup) makes `.json()`
   throw a `SyntaxError` inside `webJson`; the resulting message ("Unexpected token < in
   JSON…") reaches the user verbatim via the outer catch. Not wrong, just uninformative.

**Suggested fix:** read rate-limit headers when present and give a specific message
("5etools online is rate-limited for anonymous requests — try again in a few minutes");
skip the tag-form retry when the failure looks like a rate limit rather than a 404. Size:
**S/M**. Decisions: D153(a,d).

### C3-05 — severity: minor — two parity-protected fields nothing reads

**Files:** `extract.py:1199,1615,1649`; `src/extract.js:901,935,949`.

`countType` (`"fixed"|"known"|"formula"|null`, on every class record) and `hasSpells`
(bool, on every feat/optfeat record) are computed identically by both extractors — protected
by cparity's whole-record diff, so they cannot silently drift — but nothing in `src/app.js`
reads either field (confirmed: zero matches for `countType`, zero for `hasSpells` across the
whole file). This is not a correctness bug; it is unread output shipped in every digest
(baked, imported, and every zip/web-fetch re-import), a small, repeated storage and
maintenance cost. `hasSpells`'s own comment ("non-spell feats are build-choice-only") suggests
it was meant to let the picker distinguish spell-granting from non-spell-granting feats — the
app evidently derives that some other way today (worth a follow-up question to Francesco
rather than a guess).

**Suggested fix:** either wire `hasSpells`/`countType` into whatever surface was meant to use
them, or remove both from both extractors (never one alone — "both extractors or neither") and
re-run `extract.py` + `cparity.js` to confirm the digest shape still parses everywhere. Left as
a finding rather than a fix here because removing a shipped digest field is a data-shape
change, not a "dead constant with zero uses" in D157(a)'s trivial-fix sense. Size: **S**.

## Persistence table

| Key | Store | Shape | Written by | Migrated from | Notes |
|---|---|---|---|---|---|
| `spellForge.builds.v1` | localStorage | `{activeId, order[], builds:{id:{meta,state}}}` (D33–D35) | `persistBuilds()` | `spellForge.v2` (legacy single build), on first `loadBuilds()` | Migration is idempotent — re-running `loadBuilds()` on an already-migrated store is a no-op (`stored.builds` present short-circuits). E1 per-build field migration (`currentLevel`, `swaps`, `sbFavSkip`) also idempotent — each field checked with `===undefined` before being set, and the identical-write skip (`JSON.stringify` compare) means a repeat run touches nothing. |
| `spellForge.sources.v1` | localStorage | `string[]` of enabled book codes | `saveSources()` | `spellForge.v2.enabledSources`, in `loadSources()`, else `Object.keys(DATA.sources)` | Runs AFTER `assembleData()` in the boot IIFE, so the fallback correctly sees imported sources, not just baked ones (verified — see "assembleData ordering" below). |
| `spellForge.custom.v1` | localStorage | `{spells:[...]}` homebrew spell records | `saveCustom()` | none (new in this shape from the start) | Included in `assembleData()`'s merge every call; a large homebrew set (see quota note below) shares localStorage with builds/sources/table layout. |
| `spellForge.table.v1` | localStorage | column layout, global, NOT part of a build (GOTCHAS: "under its own key… NOT part of the build blob") | `save` path inside `loadTableOpts`/column handlers | none | Unread by this audit in detail — table-layout persistence is UI state, out of pillar scope beyond confirming it is NOT nested inside a build blob (confirmed by grep — it is its own key). |
| `spellForge.webRepo.v1` | localStorage | bare string (repo `owner/name`), empty = default | `webRepo()`'s setter (line ~9569) | none | Empty string is deliberately NOT stored (removed instead) so the default can change centrally. |
| `spellForge.webSync.v1` | localStorage | `{repo, version, syncedAt}` — last **applied** fetch | `applyPlan()`, only when `WEB_PENDING` is set (i.e. only on Apply, never on stage) | none | Matches D153(b)/(c) exactly — recorded only once applied, read by `webUpdateNotice()` and `bookOrigin()`'s fallback. |
| `spellForge.webNag.v1` | localStorage | bare version string already offered/dismissed | the notice's × handler | none | Per-version, so a dismissed nag reappears on the NEXT newer release — matches D153(b). |
| `spellForge.refreshMiss.v1` | localStorage | codes a refresh could not re-read from the linked folder | `refreshMissed()`/its writer | none | Self-clearing: re-adding the missing file and re-Applying takes the book off `staleBooks()`, which empties this set (per D138's remedy path). |
| `spellForge.parserNag.v1` | localStorage | per-version dismissal for the stale-parser boot notice | `staleParserNotice()` | none | Matches D137's "says its piece once and then stops until the next release." |
| `spellForge.print.v1` | localStorage | print options | print-options handlers | none | Out of pillar scope beyond confirming the key exists and is independent. |
| `spellForge.import.v1` (`LS_IMPORT`) | localStorage — **legacy fallback only** | the full imported digest, JSON string | `importSave()` **only when IndexedDB is unavailable** | — | The pre-D93 home for this data. `importLoad()` migrates it to IndexedDB and deletes the localStorage copy **only after** the IndexedDB write resolves (verified: `idbPut` awaited before `localStorage.removeItem`) — a half-done migration cannot lose the import. |
| IndexedDB `spellForge` / store `kv`, key `"import"` | IndexedDB | the digest, structured clone (no JSON round-trip) | `importSave()` | `spellForge.import.v1`, once, on first `importLoad()` | Primary store since D93. Quota failures are caught and translated into a named, actionable message (`importSave`'s `QuotaExceededError` branch names entry/book counts and, where available, `navigator.storage.estimate()`'s usage/quota) — this is the T7 guard the 27 MB web fetch (D153) exercises for real. |
| IndexedDB `spellForge` / store `handles` | IndexedDB | D92's remembered directory handle | folder-scan code | old standalone `spellForgeFolder` DB, dropped once via `dropLegacyFolderDb()` | A remembered handle is not a granted one (GOTCHAS) — re-request happens inside a user gesture, correctly. |

**`assembleData()` ordering (D93):** confirmed safe. The boot sequence is
`await importLoad()` → `assembleData()` (now IndexedDB-aware) → `loadSources()` →
`loadBuilds()` → … → `render()`, all inside one `(async()=>{...})()` IIFE that is the LAST
statement in `src/app.js`. A SEPARATE, synchronous `assembleData()` call exists at module-load
time (app.js:320, immediately after `hasContent`'s definition) to give `SRC`/`state`'s initial
declarations something to read — but it necessarily runs on `BAKED||emptyDigest()` only
(`IMPORT_CACHE` is still `null` at that point) and nothing observable (no `render()`, no user
gesture) happens between that call and the boot IIFE's own `assembleData()` re-run with the
real (possibly imported) data. **No hazard found** — this matches the GOTCHAS description
exactly and the ordering was traced line-by-line to confirm it.

**Empty-import-beats-baked guard:** confirmed present and correct (`assembleData`,
app.js:296–300 — `impOk` requires spells or classes present; an empty/broken stored digest
falls back to `BAKED`).

**Quota handling:** IndexedDB failures are caught, diagnosed (quota vs. other), and named with
actionable detail (`importSave`). localStorage failures elsewhere (`saveSources`,
`persistBuilds`, `saveCustom`) route through `storageNotice()`, a single warn-once notice
("Changes aren't saving — browser storage is full or blocked…") rather than per-call detail —
appropriate for these, since they're small (KB, not MB) and the detailed diagnosis belongs to
the one store that actually approaches quota (the import digest).

## Export/import of builds (`.spellbook.json` / `.spellbook-backup.json`)

- **Per-build** (`exportBuild`/`importBuildText`, app.js:4049–4146): envelope
  `{kind, version, exported, app, meta, state}`, `BUILD_FILE_VERSION=1`. `parseBuildFile`
  refuses a file whose `version` exceeds the reader's own (forward-compat refusal — correct);
  a **missing** `version` reads as `1` (backward-compat for the format's own first release —
  correct, nothing older exists yet). `applyImportedState` (app.js:4148 onward) is
  fully defensive: every array is type-checked, every numeric field clamped, choice-id and
  row-id remapping done through an explicit `idMap`, `featSlots` only accepted for a feat the
  build actually holds and a slot name the app recognizes. Nothing from the file is trusted
  structurally — matches the file's own comment, "normalise a foreign state blob to this
  app's shape without trusting any of it," and was verified against the code rather than
  taken on faith.
- **A build referencing a book you don't have:** `meta.sources` rides along as "a RECORD of
  what it expected… never as an instruction" (D33) — the imported build is simply activated
  with whatever content is loaded; `pruneState()` (D42/D56, flag-don't-prune) and the gap
  machinery (`renderGapBar`, `.gapped`, `#srcAskModal`) take it from there exactly as they
  would for a build made locally that later had a book turned off. No separate code path,
  no separate bug surface.
- **Backup file** (`backupObj`/`importBackupObj`, app.js:4074–4116): `BACKUP_FILE_KIND`,
  `BACKUP_FILE_VERSION=1`, carries every build plus the global homebrew spell list (the gap a
  per-build export can't cover — D138(c)). Import is additive-always: one unreadable build
  inside the backup is skipped (`try/catch` per build) rather than sinking the whole import;
  homebrew is merged by `name|source` with the STORED spell winning a collision (documented
  rationale: "the file may be older than what you have been editing"). Verified this dedupe
  key matches `CUSTOM.spells`'s own key shape elsewhere in the file.

No hazard found in this area — the code matches its own documentation and the relevant
decisions closely enough that a line-by-line trace turned up nothing worth flagging.

## Build-product findings

Covered above as C3-02 (bump.py atomicity) and C3-03 (`</style` escaping gap). Additional,
non-finding observations, verified rather than assumed:

- **`__VERSION__`/`__PUBLIC__` injection:** `data/data.js` gets `window.__VERSION__=…` and
  `window.__DATA__=…` (dev); `dist/index.html` inlines both directly; `docs/index.html` gets
  `window.__PUBLIC__=1;window.__VERSION__=…;window.__DATA__=…` — the SRD subset, not the full
  digest (build.py:154–163). All three read from the SAME `VERSION` file read once at the top
  of the script, so within one `build.py` run the three deliverables cannot disagree with each
  other about the version — the only way they can disagree with `VERSION` on disk is C3-02's
  scenario (a run that never happened because `build.py` failed after `VERSION` was already
  rewritten by `bump.py`).
- **SRD subset selection:** `_srd_subset()` (extract.py:1760–1794) gates on 5etools' own
  `srd52` truthy flag, drops a non-SRD stat block off an otherwise-SRD spell (so the public
  build never redistributes unlicensed monster text under its CC-BY footer), and applies the
  17 product-identity spell renames (Bigby's Hand → Arcane Hand, etc.) over the SERIALIZED
  JSON blob rather than field-by-field — verified this is deliberate (comment: "the rename
  runs over the serialized subset… so the record itself, other spells' prose, and every grant
  that names the spell" all update at once) and correctly scoped to the longest-name-first
  replacement order to avoid a short rename clobbering a longer one that contains it.
- **Service-worker cache key vs. `VERSION`:** `build.py`'s `stamp` is a SHA-1 of the FULLY
  ASSEMBLED `docs/index.html` (`shell`, which already has `__VERSION__` baked in) — so the
  cache key changes on ANY change to the page (data, code, or just the version string), not
  only on a version bump specifically. This is stricter than tying the key to `VERSION` alone
  and correctly forces a fresh cache on every rebuild, matching D137(d)'s "the SW must be able
  to say a newer build exists" requirement. `controllerchange` firing exactly when a newer
  worker takes over (`skipWaiting()`+`clients.claim()`) was traced and matches the D137(d)
  description; GOTCHAS already notes SW registration itself cannot be exercised in the browser
  pane, and this audit did not attempt to (no browser was used, per the C3 charter).

## Scripts added

Both are dependency-free Node scripts, in the `cparity.js` style: they load the REAL
extract.js exports (`window.SB_extract`) rather than re-implementing any predicate, and diff
against the checked-in `data/data.json` or the checked-in `src/app.js` source text. Neither
touches the browser, `dist/`, `docs/`, or the `data/` outputs.

- **`scratchpad/cparity-sources.js`** — closes A1/A2. Diffs `digest.sources` (name/group/
  counts) between the two extractors' outputs, and diffs `src/app.js`'s hardcoded `FULL_MC`/
  `PACT` constants against `extract.py`'s `data.json` output (pulled out by source-text regex,
  not retyped by hand). Run: `node scratchpad/cparity-sources.js [mirror-path]`. Currently:
  **0 fail** (43/43 books identical, `FULL_MC`/`PACT` byte-identical).
- **`scratchpad/cparity-formrefs.js`** — a static invariant check for C3-01: every function in
  `src/app.js` that calls `slimJson(` must also call `resetFormRefs(` in the same function
  body (the ordering half of the invariant — feature-files-before-bestiary via `readOrder` —
  still needs the browser repro above; this half is exactly what a Node script CAN prove
  without one). Run: `node scratchpad/cparity-formrefs.js`. Currently: **1 fail** —
  `stageFiles` (line 5144) calls `slimJson()` without `resetFormRefs()`; `webFetchAll` and
  `stageScanBooks` both pass. This failure is expected and documents C3-01 mechanically; it
  will start passing the moment that finding is fixed, and should be added to the verify gate
  alongside `cparity.js` at that point (or left red as a visible marker — Francesco's call).

Both scripts were run against the current mirror and their output is quoted above.

## Trivial fixes applied

**None.** D157(a) permits only a comment, a dead constant with zero uses, or a one-token typo
— nothing meeting that bar was found in this pillar's files. The one candidate that looked
close (C3-05, `hasSpells`/`countType`) is a shipped digest field consumed by neither app.js nor
any known future surface, but removing it means editing both extractors and regenerating
`data/data.json` — a data-shape change, not a local dead constant — so it is reported as a
finding rather than fixed.

## For the docs

- **PLAN.md**: none of these findings block Phase K3/K4 (the Library-verb cleanup and
  raw-stash work are UI-surface, not pipeline-shape) — C3-01 is the one item worth pulling
  forward, since K3's "raw-stash + auto re-parse" work (D154(g)) touches the same staging
  functions `stageFiles` lives beside and would be a natural place to fix it in the same pass.
- **GOTCHAS.md**: C3-01 is a strong candidate for a new entry once fixed — it is exactly the
  "order-dependent, silently-drops-content" shape the file already documents twice
  (`foundry.json`, the lookup clobber), and the file's own framing ("if X ever happens again,
  look here first") applies just as well to a third occurrence of the same root cause
  (an ingestion path that doesn't share the ordering/reset discipline the others do).
- **DECISIONS.md**: no new decision is needed to log these findings themselves (that's what
  this document is for, per D157(f)); a decision would attach to whichever fix Francesco
  picks at triage.

## Claims register

1. Verify gate (all four commands) passes clean on this worktree — ran directly, output
   quoted above under "Gate and cparity."
2. `node scratchpad/cparity.js` reports 0 fail across every check it runs — ran directly,
   output quoted above.
3. `digest.sources` is never compared by `cparity.js` — confirmed by reading the whole file
   (237 lines, quoted structure above); no `.sources` reference anywhere in it.
4. `extract.js`'s digest never carries `fullMc`/`pact` — confirmed by reading `buildDigest`'s
   final `digest = {…}` literal (extract.js:1127–1128) and grepping the whole file for
   `fullMc`/`FULL_MC`/`pact`/`PACT` (only match is inside `prereqBlocks`' unrelated `pact`
   prerequisite field, not the slot table).
5. `src/app.js`'s `FULL_MC`/`PACT` constants are byte-identical to `extract.py`'s `data.json`
   output — proven by `scratchpad/cparity-sources.js`, run today, 0 fail on that check.
6. `hasSpells`/`countType` are written by both extractors and read by neither — confirmed by
   `grep -c` returning 0 for both terms across `src/app.js`, and by locating every write site
   in both extractors (extract.py:1199,1615,1649; extract.js:901,935,949).
7. `stageFiles` (app.js:5144–5152) is the only one of four file-ingestion functions
   (`unzipJsonFiles`, `webFetchAll`, `stageScanBooks`, `stageFiles`) that calls `slimJson`
   without also calling `resetFormRefs` in the same function body — proven mechanically by
   `scratchpad/cparity-formrefs.js`, run today: 1 fail (`stageFiles`), 2 pass
   (`webFetchAll`, `stageScanBooks`); `unzipJsonFiles` (extract.js) was confirmed by direct
   reading (line 1192) since the script only scans `app.js`.
8. `bump.py` writes `VERSION` before invoking `build.py`, with no rollback on build failure —
   read directly (bump.py:44–52); not executed (RULES forbid running `bump.py`).
9. `build.py` asserts `</script` is absent from `app.js`/`extract.js`/`styles.css` but never
   asserts `</style` is absent from `styles.css` — read directly (build.py:112–134); confirmed
   `</style` does not currently appear in `styles.css` by direct grep (no live bug).
10. `build.py` inlines every blob via plain string concatenation, never a JS template literal,
    so `${…}` sequences have no special meaning to the build step — read directly, no
    backtick-delimited inlining found anywhere in `build.py`.
11. `assembleData()`'s only pre-import synchronous call (app.js:320) is followed by no
    observable side effect (no render, no user-visible state) before the boot IIFE's own
    post-`importLoad()` call reassembles it — traced by reading every line between the two
    calls and confirming the boot IIFE is the last statement in the file.
12. The empty-import-beats-baked guard (app.js:296–300) and the per-source parser/parsedAt/
    origin stamp survival through `filterDigest` (app.js:5341–5349) both match their governing
    decisions (the GOTCHAS entry and D138(a)/D155(e) respectively) — read directly, matched
    clause-by-clause against the decision text.
13. Export/import of builds and the backup file were traced end-to-end
    (`buildExportObj`/`exportBuild`/`parseBuildFile`/`importBuildText`/`applyImportedState`
    and `backupObj`/`exportAll`/`importBackupObj`, app.js:4040–4146) and found to match their
    stated behaviour; no hazard found.
14. The GitHub tree-API rate-limit and non-JSON-response paths (C3-04) surface a generic but
    not misleading message, and the `"v"+ver`→bare-`ver` retry does not distinguish a
    rate-limited failure from a bad ref — read directly (app.js:5180–5197); not exercised
    live (no browser, no network calls made from this session).
