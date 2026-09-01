# V-A: verification of audit A (direction, scope, horizon, pipeline)

Wave 2 of the three-pillar audit (D157(a)). Verifier A, 2026-09-01, worktree fast-forwarded to
`1794c7f` so every line number in the A report resolves against the same tree the auditor read.
The A report was read from the main checkout at `audits/A-direction.md`; nothing shared was
edited.

Method: every claim in the A report's register was opened at its own pointer, every opportunity
row was grepped against `DECISIONS.md` and `ARCHIVE.md` under several phrasings, every number in
the pipeline verdict was recomputed here, and the functions each row would touch were opened
before its size was accepted. Three external URLs were fetched. Two evidence sources the report
leaned on could not be reached from this session and are marked as such.

**Headline: 48 confirmed, 4 plausible, 1 struck, 5 unverifiable.** Two opportunity rows are
struck, four are re-sized, and the ranking moves. The register is the strongest part of the
report and it holds up under a pointer-by-pointer read. The weak part is cost: three rows
describe work as smaller than the code allows, and the single most consequential number in the
pipeline verdict (the flag count) is wrong.

---

## 1. Claims register: verdict per claim

| # | Claim (short) | Verdict | Note |
|---|---|---|---|
| 1 | Line counts 10,159 / 1,837 / 1,206 / 2,491 / 738 | CONFIRMED | Exact at `1794c7f`. `src/app.js` in the main working tree is now 10,161, so the report's baseline must be honoured when re-reading. |
| 2 | Scores/PB unmodelled; printed DC and attack are ruled blanks | CONFIRMED | `src/app.js:9849-9852`, comment and `blank()` both present. |
| 3 | Score prerequisites resolve "?" never "no" | CONFIRMED | `src/app.js:8934-8955`, both comment blocks say it explicitly. |
| 4 | Custom sources carry their own DC and attack | CONFIRMED | `src/app.js:2906`, `:4220`, `:4546-4547`. |
| 5 | Guide's ASI step labelled "Feat / ASI", models no score | CONFIRMED | `:1420` label, `:2323-2324` note. |
| 6 | Inventory section headings and line numbers | CONFIRMED | All pointers land on the named `// ── heading ──`. Two labels in row 10 are mismatched: `:797` is "current level & swap events" (the order substrate is `:1194`), and `:6727` is "the timeline popover", not "fork". |
| 7 | Storage key inventory | CONFIRMED | One pointer off by one: `spellForge.v2` is at `:322`, not `:323`. Everything else exact. |
| 8 | Build state shape and the append-at-end rule | CONFIRMED | `:387-404`; `blankBuildState` at 387, the rule comment at 395-396, `serializeState` at 397. |
| 9 | Browser-pane storage was empty at three origins | UNVERIFIABLE | The auditor's own session. Nothing here can reproduce or refute it. It carries no evidential weight beyond the auditor's word, which is exactly why the usage column is blank. |
| 10 | claude-in-chrome connected but `tabs_context` timed out twice | UNVERIFIABLE | Same. |
| 11 | K1 and K2 verified against a real 44-book digest | CONFIRMED | `PLAN.md:57-60` and `:72-76`; `STATE.md:41-42`. |
| 12 | A saved build "v2" carries a health badge at L1-L4 | CONFIRMED as a quote | `STATE.md:55`. It is a note written to Francesco, not a reading of his storage, so it is documentary evidence that a build exists, not that it is used. |
| 13 | Stale-parser notice fires on every bump; K3 replaces it | CONFIRMED | `STATE.md:57-59`; D154(g) at `DECISIONS.md:2113`. |
| 14 | 24/34/13/13/17/31/23 commits, 155 total, 88 tags | CONFIRMED | Reproduced exactly at `1794c7f`. |
| 15 | Tag dates for 1.0.0, 1.3.0, 1.4.0, 1.4.14, 1.5.0, 1.5.8 | CONFIRMED | `git tag --format='%(refname:short) %(creatordate:short)'`. |
| 16 | 77 numbered versions, 13 doc-only | PLAUSIBLE | 77 is exact (I counted the semver tags 1.0.0 to 1.5.8). The 13 named rows are all genuinely doc-only, but `1.2.33` ("D131 and D132 decided") and `1.2.40` ("D134, the three gate questions, answered") are decision-only on the same reading, which makes 15 the better figure and "about one release in six" an undercount. |
| 17 | From 1.4.7 on, every release carries a CHANGELOG follow-up commit | CONFIRMED | Twelve release/follow-up pairs from v1.4.7 to v1.5.8 in `git log --format=%s`. |
| 18 | 14 pure-fix releases as listed | PLAUSIBLE | The list is defensible but soft at both ends: `1.3.2`/`1.3.3` shipped D137 and D137(d), which are new surfaces answering a bug rather than pure fixes, and `1.5.4`/`1.5.5` shipped the D151/D152 design calls. The pointer for `1.2.10` is wrong: that row and its D120 text live at `ARCHIVE.md:1113`, and "D120" appears nowhere in `CHANGELOG.md` (the 2026-08-31 `/clean` moved the 1.2.x narrative out). |
| 19 | The `refreshAll()` staleness class shipped three times | CONFIRMED | `GOTCHAS.md:655` names v1.2.29, v1.4.2, v1.4.7 by cause. |
| 20 | Three releases spent on the stale-digest diagnosis | CONFIRMED | `GOTCHAS.md:643-654`, "guessing between them cost v1.3.2, v1.3.3 and v1.4.0". |
| 21 | D146 was a model defect from E1 (v1.2.4, 2026-08-28) to 08-31, found by Francesco | CONFIRMED | v1.2.4 tag date 2026-08-28; the CHANGELOG 1.4.14 row opens with Francesco's own note. |
| 22 | The verify gate is four lines and asserts nothing about `app.js` behaviour | CONFIRMED | `CLAUDE.md` gate block: two parses, one JSON load line, `cparity.js`. The `app.js` line constructs a `new Function` and never calls it, so it is a parse, not an execution. |
| 23 | Both siblings gate on typecheck + lint + tests | CONFIRMED | monster-forge `CLAUDE.md:15`; character-forge `CLAUDE.md:43`. |
| 24 | D157(e) allows a linter and the first `package.json` | CONFIRMED, but overtaken | True at `1794c7f`. The main working tree now carries `package.json`, `package-lock.json`, `eslint.config.js` and `node_modules`, all stamped 2026-09-01 23:35, after the audited commit. "This repo has no `package.json`" is no longer true, so pipeline fix 2 lands on a tree that already has the scaffold. |
| 25 | D140 took the minor away after 1.3.0 and 1.4.0 | CONFIRMED | `DECISIONS.md:1483-1496`. |
| 26 | D147's entry records no D140 approval for 1.5.0 | CONFIRMED | `DECISIONS.md:1701-1764`; no "minor", "approv" or "1.5.0" anywhere in the entry. |
| 27 | `CLAUDE.md:82` says every commit bumps; the last three are unbumped docs commits | CONFIRMED | `CLAUDE.md:82` is the "Every commit bumps it" bullet; `00ab59e`, `aec541b`, `1794c7f` are all `docs:` and `VERSION` stayed 1.5.8 across all three. |
| 28 | Doc byte sizes | CONFIRMED | Reproduced to the byte. |
| 29 | 190 `*Rejected:*` occurrences | CONFIRMED | `grep -c Rejected DECISIONS.md` = 190, which is the command cited. The literal `*Rejected:*` token appears on 188 lines; `grep -c` counts lines, not occurrences, so both numbers are honest readings of different questions. |
| 30 | `/clean` took the live set 304 KB to 227 KB | CONFIRMED | `STATE.md:84`. |
| 31 | Four wave traps at GOTCHAS `:495`, `:532`, `:724`, `:737` | CONFIRMED | All four bullets begin on exactly those lines. |
| 32 | 14 open ⚑ flags, by date 1/3/2/3/2/2 | **STRUCK** | The number is **13**. The command the claim cites returns thirteen, and the claim's own breakdown sums to thirteen. The magic-items 🔶 offered as a fourteenth already carries `⚑ (owner: Francesco, 2026-08-27)` at `PLAN.md:195` and is inside the three counted for 08-27. The error propagates into pipeline fix 4 ("the 14 growing to 30") and into L-A11. |
| 33 | Magic-item and rewards research facts | PLAUSIBLE, mostly reproduced | Against the local mirror (`5etools-v2.33.3`) I reproduce exactly: 402 items with `attachedSpells`, 0 of them with a structured DC, 53 `_copy` records, 277 rewards of which 88 carry `additionalSpells` and 0 carry `srd52`. The field counts drift: `charges` is 275 (PLAN says 282), `recharge` 278 (286), `rechargeAmount` 249 (254), which is consistent with PLAN's 2026-08-27 research having run against the 2.29.0 mirror. Every load-bearing figure holds. |
| 34 | Half-caster pooling floors where 2024 rounds up per class | CONFIRMED, and understated | Both `compute()` (`src/app.js:3032`) and `planSlots()` (`:6694`) lump `artificer` and `"1/2"` into one bucket and take `Math.floor(half/2)`. `PLAN.md:167` names both. See the strike on A-02's cost line. |
| 35 | D55 rejected item ingestion for v1, "revisit later" | CONFIRMED | `DECISIONS.md:94-102`. |
| 36 | D36 rejects URL sharing, not file or clipboard export | CONFIRMED | `DECISIONS.md:65-69`. The rejected clause is a URL-hash-encoded build; the entry's title is "Export is a file". |
| 37 | D98 makes print always the spell table and rejected "whichever tab" | PLAUSIBLE, incomplete | True as far as it goes. D98 rejected **two** things, and the report quotes only one. The second is "a purpose-built play sheet (a third rendering of the same rows to keep in sync)", `DECISIONS.md:465-467`. That is the clause A-10 has to answer, and the report never surfaces it. |
| 38 | D115(c) rejected recording prepared lists | CONFIRMED | `DECISIONS.md:627-629`. |
| 39 | D78 bounds the creature set at 65 | CONFIRMED | `DECISIONS.md:156-170`. |
| 40 | D153 left "option B" unbuilt but not rejected on merit | CONFIRMED | `DECISIONS.md:2065-2066`, verbatim "not rejected on merit, just not built". |
| 41 | D154 aligned the Library with monster-forge deliberately | CONFIRMED | `DECISIONS.md:2079-2083`, "Aligning the two apps' managers is DELIBERATE". |
| 42 | monster-forge exports "Copy for Claude" and "Copy for Notion" | CONFIRMED | monster-forge `README.md:74-77`. |
| 43 | character-forge's `spellcasting` contract | CONFIRMED | character-forge `schema/README.md:65-83`: `sources[]` with ability, DC, attack mod and prepare rule; `slotPools[]`; `spells[]` with `origins[]`; `swaps[]`. |
| 44 | character-forge lists a level-up diff and a variant switcher; its app never writes character files | CONFIRMED | `docs/PROJECT-SCOPE.md` §14 row 9 (variant switcher) and row 11 (level-up diff, "later"); `CLAUDE.md:32-34`. |
| 45 | character-forge's session layer tracks HP, slots, uses, rests | CONFIRMED | `docs/PROJECT-SCOPE.md` §7 "Trackers", and §7 also states "the app informs, never blocks, no rules engine", which strengthens the report's A-09 argument. |
| 46 | Neither sibling's docs mention My Spellbook | CONFIRMED | One unrelated hit, monster-forge `DECISIONS.md:312`, about a wizard's spellbook as a gear item. Exactly as claimed. |
| 47 | Notion Character Ideas page contents | UNVERIFIABLE | The Notion connector is unauthorised in this session. Nothing about this claim could be opened. |
| 48 | Notion Character Sheet DB, 12 PCs and its schema | UNVERIFIABLE | Same. |
| 49 | Notion Player Characters, Magic Items, Spellcasting Progression | UNVERIFIABLE | Same. |
| 50 | Foundry Spell Book module features | CONFIRMED | Fetched. The page names per-class tabs, preparation checkboxes, named loadouts, gold-and-time wizard copying, party synergy analysis, and 2014 plus 2024 support. All six. |
| 51 | Book of Spells derives DC, attack, slots, prepared counts | CONFIRMED | Fetched. "automatically calculate ... spell save DC, spell attack modifier, spell slots, cantrips known, spells known, and number of spells you can prepare"; per-class multiclass tracking; both editions. |
| 52 | D&D Beyond pain points | CONFIRMED | Fetched. All four described: always-prepared subclass spells auto-added, duplicate cantrips unflagged, Ritual Caster spells reachable only inside the feat, and unlabelled prepare/unprepare buttons. |
| 53 | `README.md:126` claims no custom-spell manager; it exists | CONFIRMED | `README.md:126` and `src/app.js:5048`. |
| 54 | D135's `##n` suffix distinguishes repeated feat takes | CONFIRMED | `DECISIONS.md:1282-1288`. |
| 55 | D148 prints a feat's ASI grant as a fact | CONFIRMED | `DECISIONS.md:1791`, "category, prerequisite, the ASI it grants, repeatable". |
| 56 | `--ab-*` tokens exist and pass 5.3:1 in both themes | CONFIRMED | `DECISIONS.md:1631`, `:1803`; `src/styles.css:1082`, `:1086`, `:1090`. |
| 57 | STATE's "Manual for Francesco" has seven items | CONFIRMED | ① to ⑦ at `STATE.md:52-59`; the report's cited range stops one line early. |
| 58 | Phase K is paused by D157 pending triage | CONFIRMED | `PLAN.md:6-7`, `:39`; D157 preamble. |

### Numbers in the prose that are not in the register

Three more figures appear only in section 2 and one of them is wrong twice over.

- "DECISIONS.md alone is 195 KB and **2,270 lines**": the byte figure is exact; the line count
  is **2,280**. Minor.
- "D147 to D157 alone added roughly **60 KB** of decision bodies": measured from the D147 bullet
  to end of file, **48,810 bytes**, so about 49 KB. Overstated by a fifth. The point survives.
- "one release every ~1.9 hours of calendar time": between 1.6 and 1.9 hours depending on whether
  the span is counted as five days or six. Order of magnitude correct.
- "a `/start` pays on the order of 75k tokens": the mandated read order (CLAUDE, STATE, PLAN,
  DECISIONS, GOTCHAS) is 293,882 bytes, so roughly 73k to 85k tokens. Confirmed as an estimate.
- "the set is back above the pre-clean size within two days": confirmed. The six live docs are
  353 KB now against the 304 KB the `/clean` started from.
- "roughly one release in four is a fix" (14 of 64): confirmed as arithmetic.
- "the commit count overstates the work by about a third on those days": confirmed. On 08-31,
  8 of 31 commits are CHANGELOG follow-ups; on 09-01, 9 of 23.

---

## 2. Opportunity map: verdicts, my sizes, re-ranked

Two rows struck. Four re-sized. The re-rank below is mine, under D157(b)'s frame (Francesco
first) and with the sizes I could substantiate by opening the code.

### Struck rows

**A-10, print the level plan as a second print kind. STRUCK.** The row answers "Rejected
before?" with "D98 rejected 'print whichever tab', not a second kind". D98 rejected two options,
and the one that fits A-10 is the one the report does not quote: *"a purpose-built play sheet (a
third rendering of the same rows to keep in sync)"* (`DECISIONS.md:465-467`). A second print kind
is a second rendering of the same picks that has to stay in step with the first. Under the
verifier rule, a row that re-proposes a closed option without naming what changed is struck. It
may come back as a proposal that answers that clause directly, and it should come back only after
A-03, which proves the same format on the clipboard for a fraction of the cost.

**A-27, backgrounds as a named pick. STRUCK.** The row answers "Rejected before?" with "no" and
cites D84 and D135. `DECISIONS.md:722-723` (D118(d)) says: *"Nothing new is modelled: no ability
scores, no backgrounds-as-entities (standing non-goal; prerequisites stay advisory)."* Backgrounds
as an entity that gives the origin feat and carries the +2/+1 is exactly that. It is also outside
the charter: D157(b) opens **one** standing non-goal, ability scores and proficiency, and names no
other. The label-only half (an optional string saying which background) is not an entity and
survives, but it is then indistinguishable from A-13 and should be folded into it rather than
carried as its own row.

### Cost lines corrected

**A-02.** The row costs the fix as "one table in `planSlots()`". That contradicts its own cited
source. `PLAN.md:167` says `compute()`/`planSlots()` both lump the buckets, and the code agrees:
`src/app.js:3032` and `src/app.js:6694` each run `half+=lvl` and then `Math.floor(half/2)`. The
fix is two accumulators, not one table, and it has to change shape rather than value (the sum of
per-class `Math.ceil(l/2)`, which `eclOwn()` at `:606` already computes for the own-class clock).
Size stays **S**. Separately, the rules premise is only firmly established for Artificer (TCE
rounds its own levels up); "XPHB Paladin/Ranger round up per class" is the flag's reading, and the
2024 multiclass wording halves the combined Paladin-plus-Ranger total. That needs Francesco's
ruling before a fixture is written, not an agent's.

**A-04, rewards ingestion. S/M becomes M.** A new top-level digest array is not a local change.
`optfeats`, the closest analogue, is enumerated 15 times in `src/app.js`, 8 times in
`src/extract.js` and 10 times in `extract.py`, plus `emptyDigest` (`:112`), `DIGEST_ARRAYS`
(`:5285`), the merge key map (`:5294`), the folder-scan kind map (`:5523`) and the per-book counts
(`:5530`, `:5545`). A `rewards` array follows all of them, in both extractors, under cparity, plus
grants resolution and a picker. The underlying data facts reproduce exactly, so the *value* claim
is sound; only the cost was light.

**A-05, compare two versions. M becomes M/L.** The row says "read-only over two stored states
through the existing slice". That path does not exist. `sliceChosen` (`src/app.js:1021`),
`sliceInsertAt` (`:1046`) and `compute` (`:3018`) all read the module-global `state` and `PREVIEW`
directly; none takes a state argument. Comparing two builds means either parameterising that whole
chain or swapping the global state in and out around each render, which is the exact shape
`GOTCHAS.md:490` warns about ("never assign a `serializeState()` result, or anything holding
`state`'s sub-objects, into a stored build without detaching it"). The idea is still right and
still evidenced by D35; the cost is one tier higher.

**A-06, ability scores. M becomes L.** See section 4.

**A-12 (S to S/M)** and **A-22 (S to S/M)**: A-12 touches both extractors under cparity, which
CLAUDE.md's "both extractors or neither" rule makes non-trivial; A-22 inherits the same
global-state coupling as A-05.

### Ranking not supported by verifiable evidence

Every value claim resting on Notion (A-02's half-caster concepts, A-03's Arcane Trickster entry,
A-05's "Arcane Spy V1/V2", A-13's concept names, A-14's campaign species, A-27's background line)
is unverifiable from here. That is not a strike, because the auditor cited a source and the
charter named it as an input. It does mean **the value column of six rows rests on one unaudited
source**, and Francesco should read those rows as "the auditor says your Notion says". Where a row
has a second, checkable motive (A-02 is a correctness bug on its own; A-03 has monster-forge's
verified precedent), the row survives the doubt. Where it does not (A-13, A-14), it should be
triaged as a question, not a task.

### My re-ranked map

| Rank | Id | Title | Group | My size | Verdict on the row | Was |
|---|---|---|---|---|---|---|
| 1 | A-01 | K3 raw-stash and automatic re-parse, then K4 | feature | M | Stands. Design locked, mocked, dead-code list already written. Only paused, never rejected. | 1 |
| 2 | A-02 | Half-caster pooling rounds up per class | QoL (correctness) | S | Stands; cost line corrected to two call sites; the Paladin/Ranger half of the rule needs his ruling. | 2 |
| 3 | A-25 | The open copy and design ⚑ batch, as one round | QoL | S | Stands, promoted. The report itself calls it "cheap and visible" and then ranks it 25th. It is one interview round against five flags, three of which have sat since 08-30. | 25 |
| 4 | A-08 | Verify the PWA installs and works offline on a phone | QoL | S | Stands, promoted. Oldest open flag (`CHANGELOG.md:138-141`, 2026-08-27), costs the project nothing, and only he can close it. | 8 |
| 5 | A-03 | Copy the build as a level plan (text) | feature | S | Stands. Size confirmed: `levelGains()` (`:6625`), `levelCasting()` (`:6707`) and `timelinePicks()` (`:6773`) already derive the data; the serialiser walks them. Value evidence is Notion-only. | 3 |
| 6 | A-14 | Homebrew species and classes by paste, as a written recipe | expansion | S (recipe) | Stands, and the recommendation to write a recipe rather than build an editor is the right call. Value evidence is Notion-only. | 14 |
| 7 | A-04 | Rewards ingestion (`rewards.json`) | expansion | M | Stands, re-sized. Data facts reproduced exactly against the mirror. | 4 |
| 8 | A-05 | Compare two versions of a character | feature | M/L | Stands, re-sized. Global-state coupling is the cost the row missed. | 5 |
| 9 | A-06 | Ability scores and proficiency bonus, minimal | expansion | L | Stands as the one re-openable non-goal; costing incomplete, see section 4. | 6 |
| 10 | A-13 | A concept line on a character | QoL | S | Stands. No prior rejection (checked D35, D53, D87, D88). Absorbs A-27's surviving half. | 13 |
| 11 | A-07 | Magic items as a custom-source prefill | expansion | M/L | Stands. D55 correctly named with what changed. | 7 |
| 12 | A-09 | Hand a build to character-forge's `spellcasting` shape | expansion | M | Stands, demoted. Contract verified; value explicitly unknown, and under a Francesco-first frame an unknown-value M cannot outrank evidenced work. | 9 |
| 13 | A-15 | Mac-side mirror-refresh script (D153 option B) | QoL | S | Stands. | 15 |
| 14 | A-11 | `SHADOWED` becomes source-aware | QoL | S/M | Stands. | 11 |
| 15 | A-12 | Resolve `subclassFeature` `_copy` records | QoL | S/M | Stands, re-sized. | 12 |
| 16 | A-18 | High Elf in-table cantrip swap; Human origin categories | QoL | S | Stands. | 18 |
| 17 | A-16 | One-step undo for a destructive pick action | QoL | M | Stands. D34 rejected a dirty-state save model, not undo, so "no" is correct. | 16 |
| 18 | A-26 | `sbFav` edition tolerance | QoL | S/M | Stands. | 26 |
| 19 | A-17 | Detect a real long-rest spell swap in the extractors | QoL | M | Stands; attempted and stopped 2026-08-27, correctly flagged. | 17 |
| - | A-19 to A-24 | Creature sets, loadouts, live tracking, cross-build search, DDB import, wizard costs | mixed | - | All stand as correctly-classified noise. One addition: A-20 should also cite **D64** (`DECISIONS.md:125-132`, "per-level loadouts are VERSIONS, not per-pick level stamps"), which closes the idea a second way. A-22 is S/M, not S. | - |
| STRUCK | A-10 | Print the level plan as a second print kind | - | - | D98's second rejected clause, not quoted. | 10 |
| STRUCK | A-27 | Backgrounds as a named pick | - | - | D118(d) standing non-goal, not named; outside D157(b)'s single opening. | 27 |

---

## 3. The pipeline verdict, checked

Every number recomputed here. Their figure, then mine.

| Claim | Report | Mine | Verdict |
|---|---|---|---|
| Commits, 2026-08-26 to 09-01 | 24/34/13/13/17/31/23, 155 | identical | confirmed |
| Tags | 88 | 88 | confirmed |
| Numbered versions 1.0.0 to 1.5.8 | 77 | 77 | confirmed |
| Doc-only versions | 13 | 13 as named, 15 on a consistent reading | plausible, undercount |
| Pure-fix releases | 14 of 64 | 14 as listed, 4 of them arguable | plausible |
| Live doc set | 361 KB, 555 KB with ARCHIVE | 361,353 B and 555,220 B | confirmed |
| DECISIONS | 195 KB, 2,270 lines | 195,431 B, **2,280 lines** | line count wrong |
| `*Rejected:*` clauses | 190 | 190 lines by the cited grep, 188 literal tokens | confirmed |
| D147 to D157 growth | ~60 KB | **48,810 B** | overstated |
| `/start` cost | ~75k tokens | 293,882 B of mandated reading, ~73-85k | confirmed as an estimate |
| Open ⚑ flags | **14** | **13** | **struck** |
| Flags closed recently | "roughly zero" | confirmed and stronger: all 14 `CLOSED` entries in `ARCHIVE.md` are dated 2026-08-26 or 08-27; nothing has closed since 08-28 while twelve have opened | confirmed |
| Verify gate | four lines, no `app.js` behaviour | confirmed, and the `app.js` line only *parses* (a `new Function` that is never called) | confirmed |

The three named strains are real and I reproduced the evidence for each: the doc set does grow
faster than `/clean` shrinks it, there is no behavioural floor under `src/app.js`, and the backlog
is entirely Francesco-gated. The verdict paragraph is sound. One number in it is wrong.

### The five (six) proposed fixes, against the standing decisions

1. **Doc-only commits stop bumping VERSION.** No conflict. It amends D117 and the report says so,
   and D140 is untouched (it governs the minor, not whether a patch fires). Correctly flagged as
   needing Francesco. One refinement: `bump.py` needs no change at all, because it cannot know
   what a commit touched; this is a `CLAUDE.md` rule plus judgment, so the cost really is one line.
2. **A headless engine test as gate line five. Size wrong, prerequisite missing.** `src/app.js`
   exports nothing: `grep "window\.SB_"` over it returns only *consumers* of `window.SB_extract`.
   `scratchpad/cparity.js` can drive `src/extract.js` precisely because that file publishes
   `window.SB_extract`. `src/app.js` has no equivalent, and its final statement is an async IIFE
   (`:10136-10159`) that calls `importLoad`, `assembleData`, `loadSources`, `loadBuilds`,
   `applyState`, `$("#fReprint").value`, `loadTableOpts`, `loadPrintOpts`, `fillIcons`,
   `refreshAll` and `render` the moment the file is evaluated. The gate's `new Function` line never
   calls it, so "app.js already loads under `new Function` in the gate" is true only in the sense
   that it parses. Running it headless needs either a DOM, localStorage and IndexedDB stub good
   enough for the whole boot path, or a change to `src/app.js` (an export object and a boot guard).
   Size **M/L**, not M, and it puts a change into the app file that D157(e)'s "tooling proposals
   only" permission does not obviously cover. The idea is still right: it would have caught D146,
   the three `refreshAll` recurrences and the half-caster gap. Note also that the main tree already
   has `package.json` and `eslint.config.js`, so the scaffolding half is partly done.
3. **Codify the wave discipline as scripts.** No conflict; it matches `GOTCHAS.md:495`, `:532`,
   `:724`, `:737` and the parallel-agent method exactly. Accept as written.
4. **A flag round at every handoff.** No conflict. Correct the count to 13, and see section 7:
   the flags live in three files, not one.
5. **Cap DECISIONS at the index.** No conflict with `/clean` or with the convention that
   `*Rejected:*` clauses stay in place. But it fights `CLAUDE.md`'s "the model for each phase lives
   in `DECISIONS.md` and still constrains any change; cite the D-entry, don't restate it": moving
   bodies out makes every such citation a second hop into a 194 KB `ARCHIVE.md`. Safe for closed
   phases, which is what `/clean` already does; risky as a blanket handoff default.
5b. **Tag name in the CHANGELOG row instead of the SHA.** Sound, and cheaper than costed, but the
   cost line is misattributed. `bump.py` writes `VERSION` and runs `build.py` and nothing else; it
   never opens `CHANGELOG.md`. This is a convention change with zero code, unless the intent is to
   have `bump.py` start inserting rows, which is a new capability rather than an edit.

None of the six contradicts a standing decision without saying so.

---

## 4. The ability-scores costing (A-06), reviewed

What the costing gets right: the append-at-end storage rule is correctly read (`src/app.js:395-396`
says exactly that), the derivation is correctly placed on the same slice the picks use, the
`--ab-*` tokens do exist and are solved to 5.3:1, `D148` really does already print a feat's ASI
grant as a fact, and the "not included" boundary (skills, saves, HP, gear belong to
character-forge) is the right line to draw. The verdict that the visible win is DC and attack, not
verified prerequisites, is well argued and I agree with it.

What it misses, opened one by one:

- **The unset state.** The proposed shape is `abilities:{str,dex,con,int,wis,cha}` with no way to
  say "not entered". D31's whole contract (`src/app.js:8937-8941`) is that an unverifiable part is
  *"maybe" never a hard no*, because "the app should never hide something the player is actually
  allowed to take". The moment scores exist, a blank or default score turns a `checks` part from
  "?" into "no" and the app starts hiding legal feats. That is a D-level call, not an
  implementation detail, and it needs a sentinel plus a rule ("unset scores keep reading ?").
- **The prerequisite quick-fix.** `prereqParts` feeds D41's one-click quick-fix
  (`src/app.js:4639`). Every other part kind resolves to something you can go and take. "Raise your
  Intelligence" is not a pick, so a score part either has no quick-fix or gets a new kind. Not
  named.
- **Interaction with D146 empty slots.** The costing puts each ASI's score choice in `state.choices`
  keyed by the pick's identity. A dropped feat leaves an **empty slot**, not a splice (D146), and
  the slot keeps its position. What happens to the orphaned score choice, and does the derived
  score at level L drop with it, is unspecified. The costing says "the consistency sweep gains
  nothing mandatory (a score is never illegal)", which is true of the score and false of the
  orphaned choice.
- **Versions and forks.** Not named at all. A build forks at a level (D115, D37 relevel), versions
  are alternative builds (D35), and `serializeState`'s identical-write compare (D116(d), D120)
  governs whether an untouched build still compares equal. Scores and their per-pick ASI choices
  have to travel through the fork and through D37's flag-don't-prune relevel. That is at least a
  session of its own.
- **Export and import.** The costing says "additive fields", which covers the per-build export
  (D36) but not the D138(c) all-in-one backup, nor the reverse case: a build exported before
  scores exist, imported after, must land with unset scores rather than zeros. Related to the
  sentinel above.
- **The custom-source editor.** The costing names the *default* (`cs.dc`, `:2906`) but not the
  editor where DC and attack are typed (`:4209`, `:4546-4547`) or D95's per-spell shape. A default
  that fills in from the character has to be visibly overridable, which is editor work.
- **The guide.** "One more section on ASI steps" understates it: `guideSteps` derives the step and
  section list (`:1279`), the chain rail labels them (`:1877`), and the end-of-walk "honest
  open/skipped counts" (D118(e)) all move when a section is added. Small, but not one section.
- **The print sheet.** "Fill two blanks" is right for the tracker table (`:9849-9852`) but the
  print head (`.printhead`, D98) and the spell-card appendix (`:9921`) also carry per-spell facts,
  and the print settings modal (`:9996`) may want a switch.
- **The Pages build.** Not named. It is genuinely nothing: scores are build state, no digest
  change, `build.py` inlines the same source. Worth one sentence to close it rather than leaving
  the reader to wonder.

What it correctly does **not** need, and I checked because the report did not claim it: the table's
column layout self-migrates. `loadTableOpts` (`src/app.js:6001-6006`) keeps known keys and appends
any column added since, so new DC and attack columns need no storage migration. That is a point in
the row's favour the auditor left on the table.

**My size: L.** The reason is not effort per surface, it is that three of the missing pieces are
each their own decision, not code: the unset sentinel and what it does to D31; the per-pick ASI
choice model and how it survives a D146 hole and a D37 relevel; and the boundary sentence itself.
Any one of them going the wrong way in isolation produces the drift the report already warns
about. Value stays medium, and the recommendation to gate it on a D-entry first is correct and
should be the *only* part of A-06 that enters the build list until that entry exists.

---

## 5. Draft Phase L candidates, checked

Testability of the Done-when; model and effort against `~/.claude/docs/model-policy.md`; collision
with paused K3/K4 or an open ⚑.

| Id | Done-when testable? | Model/effort | Collision | Verdict |
|---|---|---|---|---|
| L-A1 K3 | Yes. Bump VERSION, reload, check for a prompt and read the footer stamp. | `opus@high` fits "architecture, schema design" (it is an IndexedDB shape change). | Is K3. D157 pauses it pending triage; L5 already says K3/K4 are re-queued from the triage, so listing it here is correct. | accept |
| L-A2 K4 | Yes. Six named verbs gone, `rg` clean, D42 contract holds on a removal. | `sonnet@medium`; the matrix would allow cheaper for a delete pass, but K4 touches handler wiring against GOTCHAS, so medium is right. | Is K4. Same as above. | accept |
| L-A3 half-caster | **No, as written.** "Artificer 5 / Wizard 5 pools to caster level 8" is a valid fixture. "Paladin 1 / Sorcerer 4 to 4" is the answer the **current, floored** code already gives (⌊1/2⌋ + 4 = 4); under the rule the item is asserting it would be 5. That fixture passes before the fix and cannot serve as the regression test. Either it is a typo for 5, or it silently encodes 2024 Paladin having no spellcasting at level 1, which the item never says. | `sonnet@medium` fits. | Sits on the open ⚑ at `PLAN.md:166-171` (owner Francesco, 08-31). Acceptable only because L3 triage is the mechanism that closes it, but the Paladin/Ranger rounding rule is his ruling to give first. | fix the fixture, then accept |
| L-A4 engine test | Yes, but the item omits its prerequisite. `src/app.js` publishes nothing and boots on load; the harness needs an export shim and a boot guard **in the app file**, or a DOM stub good enough for the whole boot IIFE. | `sonnet@medium` with `opus@high` fixture review is a reasonable read of the matrix. | None, but D157(e) permits "sectioning and tooling proposals"; editing `src/app.js` to export is a small step past that and should be said out loud. | re-size to M/L, name the shim |
| L-A5 copy the plan | **No.** "a Notion paste of it round-trips his 'Arcane Trickster' entry line for line" cannot be executed by an agent: it needs Notion access and his private entry. Replace with a testable form (a fixture build serialises to a stated shape; round-trip and 375px behaviour asserted) and keep the Notion check as his acceptance at review. | `opus@high` correct: the format is design judgment. | None. | rewrite the Done-when |
| L-A6 compare | Yes, and it names the 1280/375 measurement the project requires. | `opus@high` correct (new surface). | None. | accept, size M/L |
| L-A7 scores | Mostly. "Every existing build loads unchanged" is testable. The rest presumes decisions that do not exist yet. | `opus@high` correct. | The orphaned ASI-note ⚑ (`PLAN.md:156-158`, owner Francesco) is *inside* this item's scope; the item does not say so. | split: the D-entry is the whole first task |
| L-A8 rewards | Yes: both extractors emit the array, cparity 0 fail with a census, a reward is pickable. Good shape. | `sonnet@medium` is **under-modelled**. There is no approved spec: the magic-items 🔶 (`PLAN.md:195`) is still awaiting Francesco's call, and where a reward becomes pickable is a design call. The matrix puts schema design on the strong model. | Sits directly on the open 🔶. | gate on the 🔶; opus for the shape, sonnet for the port |
| L-A9 recipe | Weak. "One of his campaign species round-trips" needs species names that live in Notion. | `sonnet@medium`; the matrix would say cheaper for a doc. | None. | make the fixture a stated species, not his |
| L-A10 pipeline rules | Yes for the CLAUDE.md line and `snap.js`. The `bump.py` clause is misdescribed: `bump.py` never touches `CHANGELOG.md`. | `sonnet@medium` fine. | Amends D117, correctly flagged as his yes. | accept with the correction |
| L-A11 flag round | Yes. Correct "the 14" to 13, and include the CHANGELOG-resident flag (section 7). | Session, no agent. Correct. | It is the mechanism for every ⚑ collision above. | accept |
| L-A12 PWA check | Yes, but it is his action, not a task. | Francesco. Correct. | Closes the oldest ⚑. | accept |

No candidate collides with a paused K item in a way that matters: L-A1 and L-A2 **are** K3 and K4,
and D157 pauses them pending exactly this triage. Three (L-A3, L-A7, L-A8) sit on open flags that
Francesco owns and should be presented as flags first, tasks second.

---

## 6. Triage questions to fill the usage column

The report marks usage unknown because the pane profile was empty, and I confirm nothing here can
recover it. These are what Francesco has to answer at triage for the ranking to firm up. Question
1 is the one the report itself identifies as decisive; the rest fill the inventory's blank column.

1. Where does a character live once it leaves this app: Notion, character-forge, or paper?
2. Which surfaces do you actually open when you plan: the Character card, the guided builder, the
   timeline, the spell table, or the printed sheet?
3. Do you print, and if so what: the summary, the tracker, the table, the spell cards?
4. Do you open the app on a phone at the table, and is that the Pages build or the local `dist/`?
5. How many characters and versions do you keep, and have you ever wanted to compare two versions?
6. Have you ever authored a custom spell, or a custom source (item or boon), in the app?
7. Do you keep all 44 books loaded, and do you act on the parser nag when a version bump fires it?
8. Of the 13 open flags, which are real annoyances in use and which would you kill unread?

---

## 7. What the auditor missed (mine, found while verifying)

**a. `src/app.js` exports nothing and boots on load, so the engine-test proposal is bigger than
costed.** `src/extract.js` publishes `window.SB_extract`, which is the only reason
`scratchpad/cparity.js` can drive it (`cparity.js:6-7`). `src/app.js` has no equivalent, and its
final statement is `(async()=>{ await importLoad(); ... refreshAll(); render(); ... })()` at
`src/app.js:10136-10159`, which touches `document`, `localStorage` and IndexedDB the instant the
file is evaluated. The gate's `new Function` line constructs and discards; it never runs. Pipeline
fix 2 and L-A4 both rest on "app.js already loads under `new Function`", which is true only as a
parse. The proposal survives, at M/L, with an export shim and a boot guard added to the app file.

**b. The derivation chain is welded to the module-global `state` and `PREVIEW`.** `sliceChosen`
(`src/app.js:1021`), `sliceInsertAt` (`:1046`) and `compute` (`:3018`) read the globals directly
and take no state argument. Every "read-only over two builds" idea in the map inherits this: A-05
(compare), A-22 (search across builds), and the per-level half of A-06 if scores ever have to be
shown for anything but the active build. The report costs none of them for it, and `GOTCHAS.md:490`
already records what happens when stored and live state are allowed to touch.

**c. A-02's cost line contradicts its own source, and L-A3's second fixture asserts the bug.**
`PLAN.md:167` names `compute()` *and* `planSlots()`; the report wrote "one table in
`planSlots()`". `src/app.js:3032` and `:6694` both run `half+=lvl` then `Math.floor(half/2)`. And
L-A3's "Paladin 1 / Sorcerer 4 to 4" is the current floored answer, so the fixture would pass
before the fix. This is the highest-ranked cheap item on the board and its acceptance test is
currently a no-op.

**d. The flag backlog lives in three files, not two.** The report caught `STATE.md:52-59` as a
second list beside `PLAN.md`. There is a third: `CHANGELOG.md:138-141` carries
`⚑ Registration is unverified (owner: Francesco, 2026-08-27)`, the PWA flag that A-08 is about,
and it appears in no `PLAN.md` row at all. A flag round that reads only `PLAN.md` will miss the
oldest open item in the project.

---

## 8. Overall verdict

The claims register is the best part of this report and it earns its keep: 48 of 58 claims land on
their pointer exactly, four are directionally right with a caveat I have written down, one is
wrong, and five could not be checked from here for reasons that have nothing to do with the
auditor. Francesco can trust the report's picture of what the app is, what the docs cost, how fast
it ships, and which decisions constrain what; the section 1 inventory, the section 2 evidence
bullets and the D-id citations survived a pointer-by-pointer read almost intact, and the three
external sources it leans on for the landscape read all say what it says they say. He should not
trust the report's costs without the corrections above (three rows describe work as smaller than
the code permits, and the engine-test proposal rests on a misreading of what the verify gate
actually does to `app.js`), he should not trust the flag count of 14 (it is 13, and the error
propagates into a fix and a task line), and he should read every value claim sourced to Notion as
unaudited, because the connector was unreachable in this session and six rows rest on it.

The thin parts are all on the same axis: the report was rigorous about what is *true* and
optimistic about what is *cheap*. Its direction judgment is nonetheless sound, and the two rows I
struck (A-10, A-27) were struck for the same reason: a `*Rejected:*` clause quoted selectively and
a standing non-goal not grepped, in a report that otherwise grepped everything. After the
re-ranking, the top of the board is unchanged in substance (finish K, fix the pooling bug) and
better ordered underneath, because the two cheapest items on it, the open-flag batch and the PWA
check, were ranked 25th and 8th in a map whose stated frame is Francesco first.

## Addendum, session check of the Notion claims (2026-09-01)

The verifier's session had no Notion access; the coordinating session does, and read the three
pages read-only.

| Claim | Verdict | Evidence |
|---|---|---|
| 47 · Character Ideas: level-by-level plans, struck-through swaps, Arcane Spy V1/V2, three Heavenly Archer drafts, "Background … ASI +2/+1", "Agonizing Blast (True Strike)" | CONFIRMED | Page 2d029a9d…, last edited 2026-05-01. "LV7: … ~~Charm Person~~ Hold Person, Suggestion" under Controller; "Arcane Spy" carries V1 and V2; "Heavenly Archer" appears as three full blocks, the third with per-level Warlock spell lines to LV20 and Epic Boons; every entry opens with six stats and a Background block with "+2 X, +1 Y". |
| 48 · Character Sheet DB: scores, HP, AC, Save/Skill/Tool Prof., languages; class option "Savant"; species Kintsujin, Memento, Silf, Silvano, Saru | CONFIRMED (schema); row count not re-queried | Data source 68a965f9…: Strength…Charisma numbers, Hit Points, Armor Class, Save Prof., Skill Prof., Tool Prof., Lingue; Classe options include Savant; Specie options include Kintsujin, Memento, Silf, Silvano, Saru; two campaigns (Foglie Silenti, Squadra Zero). |
| 49 · "Player Characters" links a Magic Items page and a Spellcasting Progression table | PLAUSIBLE | Player Characters (11c29a9d…) links Character Sheet, Conteggio Dadi, Magic Items and Cassa comune. The Spellcasting Progression database lives under "Altro / Possibili personaggi / Character Sheet DB", a different page, not under Player Characters. The substance (both exist, both are his) holds; the attribution is off by one page. |

So the six opportunity rows resting on Notion (A-02, A-03, A-04, A-05, A-09, A-13) keep their
value claims. The usage column of the feature inventory stays unknown: the browser profile every
agent and this session received was empty, so usage has to come from Francesco at triage.
