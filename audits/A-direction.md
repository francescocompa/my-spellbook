# Audit A: direction, scope, horizon and pipeline

Wave 1 of the three-pillar audit (D157). Auditor A, 2026-09-01, against `main` at `1794c7f`
(v1.5.8). Frame as charted by D157(b): Francesco first, the Pages build a by-product; the
standing non-goals (server sync, sharing by URL D36, the full bestiary D78, the authored
timeline D115) are not re-proposed; ability scores and proficiency are the one non-goal costed
out. Every idea below was grepped against `DECISIONS.md`, `PLAN.md` and `ARCHIVE.md` before it
was written down; where a decision constrains or rejects it, the D-id is named. Section 8
numbers every factual claim for the wave-2 verifier.

A note on inputs before anything else. The brief's usage evidence could not be collected.
The browser pane's profile is empty at all three origins the app has ever lived on for the
agent (`localhost:8000`, `localhost:8010`, `francescocompa.github.io`): one auto-created empty
build of 1,176 bytes created during this session, no IndexedDB digest, no column layout, no
print settings, no web-sync record. The 44-book digest that the K1 and K2 sessions verified
against was in a different pane profile. Francesco's own Chrome is connected through the
claude-in-chrome extension but did not answer `tabs_context` within its timeout (twice), which
is the expected behaviour for a non-interactive agent with no permission grant. So the usage
column of the inventory reads "unknown" wherever the docs do not carry documentary evidence,
and the ranking leans on the two other sources of evidence about his use that were reachable:
`STATE.md`'s "Manual for Francesco" list and the Notion character repository. That is a real
limitation and section 5 says what would change the recommendation once real usage is read.

---

## 1. The app today

My Spellbook is a 10,159-line vanilla-JS single page (`src/app.js`) over a digest that two
extractors produce in lockstep (`extract.py`, 1,837 lines; `src/extract.js`, 1,206 lines), with
a 2,491-line stylesheet and a 738-line HTML shell. It answers one question, which spells a D&D
2024 character can take, at what level at most, and from which source, and it now answers it at
every character level of an acquisition order (D115), through a coach-driven guided builder
(D118, D126, D130, D131), across many saved characters with versions (D33 to D37), from a book
library that fetches the 5etools repo itself (D153) and is being rebuilt as one page (D154, K1
and K2 shipped, K3 and K4 paused by D157). Content is baked SRD plus imported 5etools plus
authored homebrew. The one thing it deliberately does not know is the character's numbers:
ability scores and proficiency are not modelled, so a save DC on the printed sheet is a ruled
blank (`src/app.js:9849`) and a prerequisite that names a score reads "?" rather than pass or
fail (`src/app.js:8954`).

### Feature inventory

Where = the section heading in `src/app.js` (line of the `// ── heading ──` comment) or the
shell. Usage: **used** only where a document records it; **unknown** otherwise (see the input
note above); **by-product** for the public build.

| # | Feature | Where it lives | D-id that owns it | Usage evidence |
|---|---|---|---|---|
| 1 | Character card: classes, subclasses, levels, species, feats (origin, general, epic), optional features, custom sources | `index.html:93`; `app.js:8741` builder UI, `:8837` feat slots, `:9109` optional features | D28, D84, D114, D135 | used: STATE.md:55 names a saved build ("v2") with a health badge at L1–L4; the Notion Character Ideas page is full of multiclass concepts of exactly this shape |
| 2 | Eligible spells list with filters, "every spell" widening, capped and sticky | `index.html:152`; `app.js:7364`, filter chips `:343` | D40, D142(c,e) | unknown |
| 3 | Prepared budget and picks (per-class cantrip and prepared meters, swap-caster caps, wizard dual budget) | `index.html:146`; `app.js:2938` compute | D18, D20, D62, D68 | unknown |
| 4 | Choices to make (subclass options, choose-N picks, designations) | `index.html:129`; `app.js:3282` | D30, D43, D96, D135 | unknown |
| 5 | Slots and casts card | `index.html:134` | D68, D97 | unknown |
| 6 | Spell table tab with a global column layout (`spellForge.table.v1`) | `app.js:5978`, `:5983` | D29, D38, D104 | unknown (the key is absent in the pane) |
| 7 | Spell detail: tooltip, modal, creature carousel, cast-rule notes, condition popovers | `app.js:7638`, `:7817`, `:7953` | D74, D78, D81, D85, D109, D148(g) | unknown |
| 8 | Entity detail modal for class, subclass, feat, species, optional feature; choices answered in place | `app.js:8304`, `:8360` | D147, D148, D149, D150 | unknown |
| 9 | Builds: many characters, versions, manager, header switcher, export and import, export all | `app.js:375`, `:3731`, `:3943`, `:4040`, `:4064` | D33–D37, D53, D87, D138 | used: STATE.md:55 ("v2") implies at least one character with a second version |
| 10 | Level as a parameter: order substrate, slice derivation, empty slots, consistency sweep, timeline modal, fork | `app.js:797`, `:920`, `:944`, `:1213`, `:6575`, `:6727` | D115, D122, D124, D141, D146 | used: STATE.md:55 (health ⚠ at L1–L4 is the sweep) |
| 11 | Guided builder page: step derivation, chain column, decision stage, pick modal | `app.js:1279`, `:1579`, `:1877`, `:2020`, `:2460` | D118, D126, D130, D131, D143 | unknown |
| 12 | Custom spell sources (items, boons): pool or per-spell uses, own DC/attack/ability, fixed cast level, named spell or filtered choice | `app.js:2805`, `:4209`, `:4266` | D55, D65, D94, D95, D96 | unknown |
| 13 | Custom spell authoring and the homebrew manager | `app.js:4918`, `:5048` | D11, D144(b,c) | unknown (`spellForge.custom.v1` absent in the pane) |
| 14 | Library: zip, JSON, folder and paste import; web fetch from the 5etools repo; pending-import tray; selection-bar removal; per-book parser and origin stamps | `app.js:5083`, `:5164`, `:5278`, `:5374`, `:5475`, `:9260` | D86, D91–D93, D111–D113, D137, D138, D153–D156 | used: STATE.md:42 (he re-imported all 44 books through D153); PLAN.md:60 (removal proved against his real 44-book digest) |
| 15 | Prerequisites, advisory, with a one-click quick-fix | `app.js:8934`, `:4639` | D31, D41 | unknown |
| 16 | Prepare-daily modal and the long-rest cantrip swap | `app.js:4716`, `:4762` | D8, D73, D128 | unknown |
| 17 | Print / save as PDF: summary, tracker, table, cards, notes, remembered settings | `app.js:9753`–`:10032` | D98–D108 | unknown (`spellForge.print.v1` absent in the pane; STATE.md:55 instructs "print from Chrome or Safari", which is an instruction, not evidence) |
| 18 | Offline install (manifest, service worker, update notice) | `app.js:10032`; `docs/sw.js` | D99, D137(d) | unknown; registration itself is an open ⚑ since 2026-08-27 (CHANGELOG.md "Offline install" paragraph) |
| 19 | Light and dark theme, solved to AA | `styles.css` light block | D145, D151, D152 | unknown |
| 20 | Random character | `app.js:10059` | J8 (CHANGELOG 1.4.9) | unknown |
| 21 | Summon-form favourites per build (`sbFav`) | `app.js:7896` | D105, D131(g) | unknown |
| 22 | Mobile jump bar and the 375px layouts | `app.js:6532` | D47, D48 | unknown |
| 23 | Public SRD build on Pages | `build.py`; `docs/` | D12, D13, D17 | by-product (D157(b)) |

Storage footprint by design: builds, sources, column layout, print settings, custom spells and
five small web/parser records in localStorage (`app.js:110`, `:381`, `:5174`–`:5176`, `:5862`,
`:5885`, `:5983`, `:9759`); the imported digest and the folder handle in IndexedDB
(`app.js:126`). Nothing in the build carries ability scores, skills, proficiency, HP or gear,
and nothing in the stored shape carries free text authored by the user except custom-source
per-spell notes (D94).

---

## 2. Pipeline verdict

The pipeline is unusually disciplined for a one-person tool and it is paying for that
discipline in reading cost. It ships fast and verifiably; it strains on three things: the
weight of the doc set every session reads, the absence of any regression floor below the
browser, and a backlog that is blocked entirely on Francesco's calls rather than on work.

**Evidence.**

- *Velocity.* 155 commits in 7 days (24, 34, 13, 13, 17, 31, 23 per day from 2026-08-26 to
  2026-09-01); 88 tags. From v1.0.0 (2026-08-27) to v1.5.8 (2026-09-01) there are 77 numbered
  versions in six days, i.e. one release every ~1.9 hours of calendar time. Of those 77, 13 are
  handoff or doc-only bumps (1.0.1, 1.1.1, 1.1.3, 1.2.1, 1.2.3, 1.2.9, 1.2.16, 1.2.32, 1.2.38,
  1.2.41, 1.4.1, 1.4.6, 1.4.13, per their CHANGELOG rows). From 1.4.7 on, every release is two
  commits (the release, then "CHANGELOG: point the row at its own commit"), so the commit
  count overstates the work by about a third on those days.
- *Fixes versus features.* Reading the 64 non-doc rows of the 1.x table: 14 are pure fix
  releases (1.1.2, 1.2.29, 1.3.1, 1.3.2, 1.3.3, 1.4.2, 1.4.3, 1.4.4, 1.4.7, 1.4.14, 1.5.4,
  1.5.5, plus the 1.4.8 regression fix folded into a feature row and 1.2.10's D120 fix folded
  into a gate row). Roughly one release in four is a fix, and most feature rows carry a
  "found in passing" fix as well. That is a healthy ratio for a project moving this fast; it
  is not a sign of rot.
- *Regressions and repeat classes.* Explicit regressions: the v1.4.5 Chain/Decision toggle
  (fixed 1.4.8, a `:has()` specificity rule, GOTCHAS.md:675); D120's save-skip identity
  regression (1.2.10); D129's false-success hole re-opened through `filterDigest` (1.4.4).
  Repeat classes: the `refreshAll()` staleness bug shipped three times (v1.2.29, v1.4.2,
  v1.4.7; GOTCHAS.md:655); the stale-digest diagnosis cost three releases (v1.3.2, v1.3.3,
  v1.4.0) before the reporter's browser was read (GOTCHAS.md:643, D139); the D146 splice
  re-dating was a model defect present from E1 (2026-08-28) until 2026-08-31 and was found by
  Francesco, not by the gate. Every one of these is the kind of defect a headless test over the
  pure engine catches and the browser-driven gate does not.
- *The verify gate.* Four lines (CLAUDE.md § Verify gate): two syntax parses, two JSON loads,
  and `cparity.js`, which is real and valuable (51 checks, exact whole-record diffs across both
  extractors). It has no assertion about `app.js` behaviour. Both sibling repos run
  `npm run verify` as typecheck plus lint plus tests (monster-forge CLAUDE.md:15–17,
  character-forge CLAUDE.md:43); this repo has no `package.json`, which D157(e) now explicitly
  permits.
- *Versioning.* D117 set MAJOR.MINOR.PATCH with a patch per commit; D140 (2026-08-31) took the
  minor away from the agent after 1.3.0 and 1.4.0 were taken autonomously. 1.5.0 followed on
  2026-09-01; D147's entry does not record the approval D140 requires, so the verifier should
  check whether it was asked. Separately, CLAUDE.md:82 says every commit bumps, while the last
  three commits on `main` (`aec541b`, `1794c7f`, `00ab59e`, all "docs:") did not, and 1.4.13
  did. The rule and the practice already disagree; the practice is the better one.
- *The doc set.* Live docs (CLAUDE, STATE, PLAN, DECISIONS, GOTCHAS, CHANGELOG, README) total
  361 KB; with ARCHIVE, 555 KB. DECISIONS.md alone is 195 KB and 2,270 lines with 190
  `*Rejected:*` clauses; GOTCHAS.md is 68 KB and 777 lines. `/clean` on 2026-08-31 took the
  live set from 304 KB to 227 KB (STATE.md, "Docs were cleaned") and a second pass on
  2026-09-01 archived phase J; the set is back above the pre-clean size within two days
  because D147–D157 alone added roughly 60 KB of decision bodies. A `/start` that honours
  CLAUDE.md's read order pays on the order of 75k tokens before touching code.
- *Parallel batches.* The method works (K1 and K2 were built and verified against the real
  digest and restored byte-identical) but every wave has left a new trap in GOTCHAS: the shared
  storage origin that burned a whole wave (GOTCHAS.md:495), `pkill -f serve.py` killing every
  agent's server (:532), a server that is not yours (:724), shared tags and D-numbers forcing
  the D151→D152 and 1.5.4→1.5.5 renumbering (:737, CHANGELOG 1.5.5). The knowledge lives in
  prose; nothing enforces it.
- *The backlog.* PLAN.md carries 14 open ⚑ flags, every one owned by Francesco: 1 from
  2026-08-26, 3 from 08-27, 2 from 08-29, 3 from 08-30, 2 from 08-31, 2 from 09-01, plus the
  magic-items 🔶 researched on 08-27 and still awaiting a call. The Queue has no item that is
  blocked on work. STATE.md's "Manual for Francesco" list has grown to seven items (STATE.md:52–58).
  Flags are created at roughly two per session and closed at roughly zero.

**Verdict in three lines.** Shipping and verification are excellent and the decision record is
the project's real asset. The cost side is a doc set that grows faster than `/clean` shrinks
it, no automated behavioural floor under a 10k-line file, and a flag backlog that only an
interview can drain. None of this is urgent; all of it compounds.

**Five pipeline improvements, each with its cost.**

1. **Doc-only commits stop bumping VERSION.** Amend CLAUDE.md:82 to "every commit that changes
   `src/`, the extractors or `build.py` bumps"; the footer still names the build that made the
   page because nothing built changes. Removes about one release in six from the CHANGELOG
   and answers the D140 complaint at its root. Cost: S, one line plus a D-entry; needs
   Francesco (it amends D117).
2. **A headless engine test as gate line five.** `app.js` already loads under `new Function`
   in the gate; a `scratchpad/engine.test.js` that stubs `document` minimally, loads the
   baked data and asserts fixtures through the pure functions (`compute`, `sliceChosen`,
   `planSlots`, `featBudget`, `prereqParts`, `buildHealth`, `guideSteps`) would have caught
   D146, the three `refreshAll` recurrences and the half-caster pooling gap before a release.
   D157(e) allows a `package.json`; the siblings already have the shape. Cost: M for the
   scaffold and the first ten fixtures (one session), S per feature after.
3. **Codify the wave discipline as scripts, not prose.** A `scratchpad/snap.js` that snapshots
   every `spellForge.*` key and the IndexedDB digest, and a `restore` that proves
   `JSON.stringify` equality (the K1/K2 method, memory "destructive tests"); a PLAN line per
   wave that reserves the D-ids and version numbers each agent may take; a port per agent
   named in the brief. Cost: S, and it removes the two most expensive GOTCHAS classes.
4. **A flag round at every handoff.** Flags older than one session go into one AskUserQuestion
   batch at `/handoff` time: decide, or park with a date, or kill. Parked flags move to
   ARCHIVE with a stub. Cost: S per session; the alternative is the 14 growing to 30.
5. **Cap DECISIONS at the index.** Every D-entry keeps only its first line plus the clause
   letters and the `*Rejected:*` lines in the live file; bodies go to ARCHIVE at the handoff
   that closes the phase they belong to, not at the next `/clean`. `/clean` already does this
   selectively; making it the handoff default keeps DECISIONS under ~80 KB. Cost: S per
   handoff. Sixth, cheaper still: merge the "CHANGELOG: point the row at its own commit"
   follow-up into the release commit by writing the tag name into the row instead of the SHA
   (`git show v1.5.8` resolves it), halving release commits. Cost: S, `bump.py`.

---

## 3. Ranked opportunity map

Ranked by value for Francesco over cost. Group: QoL / feature / expansion. Size: S under half
a session, M one to two sessions, L more. "Rejected before?" names the D-id and what has
changed; "no" means the grep of DECISIONS, PLAN and ARCHIVE found nothing.

| Id | Title | Group | Size | Value for Francesco (and why) | Cost and risk | Constraining D-ids | Rejected before? |
|---|---|---|---|---|---|---|---|
| A-01 | Finish the Library model half (K3 raw-stash + automatic re-parse, then K4 retire the six verbs) | feature | M | High. He sees the stale-parser notice on every version bump today (STATE.md:57, item ⑦), on a 44-book library he actually uses (STATE.md:42). K3 is what silences it honestly. | Two sessions; the model half touches IndexedDB and D138's stamps; migration for a stashless legacy digest is specified in PLAN.md:80–87. Risk: low, the design is locked and mocked. | D154(g), D155, D156, D138, D42 | no; paused by D157, not rejected |
| A-02 | 2024 pooling rounds half-casters up per class | QoL (correctness) | S | High. Three of his Notion concepts are half-caster multiclasses (Paladin 1 / Lunar Sorcerer, Artificer 1 / Thief Rogue, Paladin/Warlock "Senzo Kanjimasu" in the Character Sheet DB). The app under-reports their pooled caster level by one (PLAN.md:166–171). | One table in `planSlots()`; the rule is already stated in the flag. Risk: none beyond a fixture. | D68, D115(f) | no; open ⚑ since 2026-08-31 |
| A-03 | Copy the build as a level plan (text) | feature | S | High. His Notion "Character Ideas" page is, by hand, exactly what the timeline derives: `LV3: Arcane Trickster Rogue 3 · Spells (3, LV1): …`, `LV7: ~~Charm Person~~ Hold Person`, with three variants of "Heavenly Archer" typed out in full. The app already knows every line of that (D115, D128 swaps, D146 slots); a clipboard export in that shape replaces the typing and makes the app the place the plan is made. monster-forge's "Copy for Claude / Copy for Notion" is the sibling precedent (monster-forge README:74–77). | One serialiser over the timeline walk plus a menu item; no storage change. Risk: format taste, which is his call. | D36 (a file or clipboard is not a URL); D98 (print stays the table); D115 | no |
| A-04 | Rewards ingestion (`rewards.json`: charms, blessings, boons, piety) | expansion | S/M | Medium. 88 of 277 rewards carry `additionalSpells` in the exact schema both extractors already parse; import-only content (zero SRD flags). He has a "Magic Items" page under Player Characters in Notion, so items and rewards are part of his table. | Both extractors plus cparity; a new picker or a fold into the feat/optional-feature picker. Risk: low. | D55 ("revisit later"), D96, D28 | D55 rejected item ingestion for v1 only; the 2026-08-27 research (PLAN.md:172–195) corrected its premise |
| A-05 | Compare two versions of a character | feature | M | Medium-high. He plans alternatives ("Arcane Spy V1 / V2", three "Heavenly Archer" drafts, in Notion); D35 made versions exactly for this and the manager shows them side by side as cards but never as a diff. A two-column diff at a chosen level (classes, feats, picks, swaps) is the missing half of D35. character-forge lists a level-up diff as its own backlog item (PROJECT-SCOPE §14 #11), so neither sibling has it. | Read-only over two stored states through the existing slice; one modal. Risk: layout at 375. | D35, D87, D115 | no |
| A-06 | Ability scores and proficiency bonus, minimal model (the questioned non-goal) | expansion | M | Medium. Honest costing below the table. Unlocks: save DC and attack bonus per source on the table and the printed sheet (today ruled blanks, `app.js:9849`); prerequisite `checks` that name a score resolve to pass or fail instead of "?" (`app.js:8954`); a custom source's default DC (`app.js:2906`) can be "yours" instead of typed; the guide's "Feat / ASI" step (`app.js:1420`) can record the +2/+1 it grants; the orphaned ASI note (PLAN ⚑ 2026-08-31) gets a home by ceasing to be true. | Storage: six numbers plus a background-and-species origin bonus on the build state, appended at the end of the `serializeState` literal (`app.js:396–404` rule); per-level truth needs each ASI or +1 feat to record which score it raised, which is a choice entry per feat pick (the feat record already carries the ASI it grants, D148(c)). UI: a six-tile row on the Character card (the `--ab-*` tokens exist, D142(b)). Exporter: additive. Print: fill two blanks. Guide: one more section on ASI steps. Proficiency bonus derives from character level; skills and saves stay out. Risk: scope creep toward a sheet, which is character-forge's job, and it doubles the surface D31 must stay advisory on. | D31 (advisory stays), D115 (scores slice like picks), D142(b), D148(c), CLAUDE.md non-goals | the non-goal itself; D157(b) opens it for costing only |
| A-07 | Magic items as a prefill for a custom source | expansion | M/L | Medium. The DC has to be typed anyway (0 of 402 items carry a structured DC, PLAN.md:178–180), so the win is charges, recharge and the spell list arriving filled. | ~150 lines of `_createSpecificVariants` in both extractors, ~120 KB more digest, mostly import-only. Risk: the variant cross-product is the trap PLAN names. | D55, D65, D95, D96 | D55 rejected for v1; premise corrected 2026-08-27 |
| A-08 | Verify the PWA installs and works offline on a phone | QoL | S | Medium-high if he uses the Pages build on a phone at the table; unknown otherwise. The ⚑ is the oldest open one (2026-08-27) and only he can perform it. | Ten minutes of his time; none of ours. | D99, D137(d) | no; open ⚑ |
| A-09 | Hand a build to character-forge (its `spellcasting` shape) | expansion | M | Unknown, potentially high. character-forge's schema wants `sources[]` (ability, DC, attack, prepare rule), `spells[]` with `origins[]`, and `swaps[]` (schema/README.md:65–83), which is a near one-to-one of what this app derives; the sheet app has no rules engine, so this app would be its spell compiler. Value depends on whether he runs his live characters in character-forge or in Notion; today the Notion Character Sheet DB holds 12 PCs with scores, HP and AC and no spells. | A second exporter pinned to a schema version; needs A-06 for DC and attack or leaves them null; character-forge's guardrail is that only `compile` writes character files, so this lands as a compile input, not a character file. Risk: cross-repo contract upkeep. | D36 (file export is allowed), character-forge CLAUDE.md guardrails | no |
| A-10 | Print the level plan as a second print kind | feature | M | Medium. Same evidence as A-03, on paper. | D98 says print is always the spell table; this is a second kind, a new decision. Cost: a print template plus a settings switch. | D98, D101, D103 | D98 rejected "print whichever tab", not a second kind |
| A-11 | `SHADOWED` becomes source-aware | QoL | S/M | Low-medium. Only bites with XPHB off, which his 44-book library and 2024-first play make rare. | `buildIndexes` on every source change (D127 flag). | D19, D127 | no; open ⚑ |
| A-12 | Resolve `subclassFeature` `_copy` records (75, shallow) | QoL | S | Low-medium. 2014 subclass feature lists may read hollow in the detail modal (D147(e) prints a sentence). | The resolver exists (D127); point it at one more array in both extractors. | D127, D147(e) | scoped out by D127, not rejected |
| A-13 | A concept line on a character | QoL | S | Low-medium. Every Notion idea opens with a concept ("Sage Chef", "Failed Lich"); the manager has only `meta.name`/`character`. | One optional string on `meta`; shown in the manager card and the print summary. | D35, D87, D88 | no |
| A-14 | Author homebrew species, feats and classes that grant spells | expansion | L | Medium in principle: his campaigns use homebrew species (Kintsujin, Memento, Silf, Silvano, Saru) and a homebrew class ("Savant") per the Character Sheet DB's select options, and the app cannot name them unless a 5etools-format brew exists. | An editor is a large surface. The cheap route already exists: a Claude-authored brew JSON pasted through the K2 tray (D58, D154(f)). Recommend a written recipe, not an editor. | D58, D86, D154 | no |
| A-15 | Mac-side mirror-refresh script (D153's "option B") | QoL | S | Low-medium. Keeps `dist/` current without a browser fetch. | A script; "can be added any day" (D153). | D153 | not rejected on merit (D153) |
| A-16 | One-step undo for a destructive pick action | QoL | M | Low. D146 already turned the worst case (a drop re-dating everything) into an empty slot; the remaining destructive paths are armed (D53). | A shadow copy of the pre-action state per build. | D34, D53, D146 | no |
| A-17 | Detect a real long-rest spell swap in the extractors | QoL | M | Low. The Granted tab over-lists; the prose lives inside `_copy._mod` and table rows neither extractor resolves (PLAN.md:215–222). | Structural resolution in both extractors. | D73, D127 | attempted and stopped 2026-08-27 |
| A-18 | High Elf in-table cantrip swap; Human extra origin restricted to origin categories | QoL | S | Low. | Small. | D84, D128 | no; queued |
| A-19 | Polymorph / Shapechange / True Polymorph creature sets | expansion | L | Low for the cost: the open-ended filters are the bestiary. | 4,458 monsters; a CR-capped subset is still hundreds. | D78 stands (D157(b)) | out of scope until a reason ships the catalogue (PLAN.md:209) |
| A-20 | Named spell loadouts (saved prepared sets) | feature | M | Low. A planner records what sticks; daily preparation is derivable and D115(c) rejected recording prepared lists for that reason. Foundry's Spell Book module has it because it serves play, not planning. | Storage shape. | D115(c), D62, D73 | rejected-adjacent: D115(c) |
| A-21 | Live slot, charge and rest tracking | feature | M | Noise for this app. The printed tracker covers paper (D101); the live version is character-forge's session layer (its PROJECT-SCOPE §7) and monster-forge P7. | Would duplicate a sibling. | D101, project boundary | no; out by sibling ownership |
| A-22 | Search across all builds ("who has Counterspell") | QoL | S | Low with a handful of characters. | Small. | D33, D35 | no |
| A-23 | Import a D&D Beyond character | expansion | L | Noise. His characters live in Notion and in this app; DDB's export is not a public contract. | High and brittle. | D157(b) frame | no |
| A-24 | Wizard spell-copying costs (gold, time, scrolls) | feature | S | Noise. The app models no gold; D20's add-only spellbook is the planning truth. | Small but pointless. | D20 | no |
| A-25 | The open copy and design ⚑ calls (placeholder family, chain-rail `· optional`, feature block default, `.tlswapc` kind, D125 clamp on trades) | QoL | S | Medium as a batch: they are cheap and they are visible. Pillar B's triage should absorb them. | One interview round. | D125, D142, D143, D149, D152 | no; open ⚑ |
| A-26 | `sbFav` edition tolerance | QoL | S/M | Low; deterministic under the default reprint filter. | A storage-shape change to a per-build map. | D131(g), D19 | no; open ⚑ |
| A-27 | Backgrounds as a named pick (the origin feat's giver and, with A-06, its +2/+1) | feature | S (label) / M (with scores) | Low alone; medium folded into A-06 (2024 puts the ability bonus on the background, and every Notion entry writes "Background: … ASI +2 X, +1 Y"). | A label is a string on the build; the bonus needs A-06. | D84, D135 | no |

### The ability-scores costing, spelled out (A-06)

What it would take, honestly, at minimum:

- **Storage.** `abilities:{str,dex,con,int,wis,cha}` as the base array, plus the origin
  bonus (+2/+1 or +1/+1/+1) as a small map, both appended at the end of `serializeState`
  (`app.js:396–404`) so untouched builds keep comparing equal and the export stays additive.
  Per-level truth: an ASI feat or a "+1 to a score" feat must record which score it raised.
  That is one `choices` entry per such feat pick, keyed by the pick's identity (the `##n`
  suffix D135 introduced makes repeated ASIs distinct). The digest already carries the ASI a
  feat grants (D148(c) prints it as a fact), so no extractor work for the common case.
- **Derivation.** Proficiency bonus from character level; a score at level L = base + origin
  bonus + the sum of the ASI choices whose pick sits at or below L in the acquisition order,
  which is the same slice the picks use (D115(b,h)). Casting-stat modifier, save DC and attack
  bonus per source follow, and a custom source with no typed DC (`cs.dc`, `app.js:2906`) can
  default to the character's.
- **Surfaces.** Character card: a six-tile row, editable, using the existing `--ab-*` tokens
  (D142(b)); guide: the ASI step gains a "which score" section; table: DC and attack columns
  become real numbers (the Ability column already exists, D29); print: the two ruled blanks
  fill (`app.js:9849`); prerequisites: `checks` for scores resolve (`app.js:8954`), and D31's
  asymmetry still holds because proficiencies, backgrounds and campaigns stay unverifiable;
  exporter and importer: additive fields; the consistency sweep gains nothing mandatory (a
  score is never illegal).
- **Not included, on purpose.** Skills, saving-throw proficiencies, tools, HP, AC, gear. Those
  are a sheet and the sheet is character-forge's; the Notion Character Sheet DB already tracks
  them (its schema has Save Prof., Skill Prof., Tool Prof., HP, AC).
- **What it buys, weighed.** For a spell planner the DC and attack numbers on the sheet and
  in the table are the visible win; verifiable prerequisites matter less in 2024 than in 2014
  (2024 feats gate mostly on level and class, and the app's 2024-first stance and Editions
  filter hide most score-gated 2014 feats by default). The ASI-step honesty is real but small.
  Size M; value medium; the largest risk is not effort but drift, because once scores exist
  the next request is saves and skills. If it is built, the boundary sentence in CLAUDE.md
  should move from "not modelled" to "scores and proficiency bonus only, nothing else".

---

## 4. What is missing

**Against his own use (Notion).** The Character Ideas page and the Character Sheet DB show
what he actually writes down about a character: a concept name; scores and the origin bonus;
background, species and class per level; skills, expertise, tools, languages, weapon masteries,
fighting styles; feats with the +1 they carry; invocations with their designated cantrip
("Agonizing Blast (True Strike)"); and, for casters, spells and cantrips per level with swaps
struck through. Twelve live PCs sit in the Sheet DB with HP, AC, saves and skills. Of that
list the app owns class, species, feats, invocations, designations (D135 marks), spells,
cantrips and swaps, and derives the per-level plan. Real gaps: the plan cannot leave the app
in the shape he writes it (A-03, A-10); alternatives cannot be compared (A-05); the score and
the origin bonus that every entry starts with are absent (A-06, A-27); the concept line has
no field (A-13); his campaigns' homebrew species and class cannot be named without a brew
(A-14). Noise: skills, expertise, masteries, HP and AC. Those belong to a sheet and he has
two of them (Notion today, character-forge by design).

**Against the siblings.** monster-forge: the content manager pattern D154 already borrowed;
the "Copy for Claude / Copy for Notion" export (README:74–77) that A-03 mirrors; a real
`npm run verify` with lint and tests (CLAUDE.md:15–17) that this repo lacks. character-forge:
a level-up diff view in its backlog that neither app has (PROJECT-SCOPE §14 #11), variant
grouping that this app already has (D35 ≈ its D12), a `spellcasting` schema that this app
could feed (A-09), and a session layer for at-table state that this app should keep not
having (A-21). Neither sibling mentions My Spellbook anywhere in its docs, which means the
handoff in either direction is unplanned on both sides.

**Against the landscape.** Three sources were read: Foundry's Spell Book module (per-class
tabs, preparation checkboxes, saved loadouts, wizard scroll economics, party synergy),
the Book of Spells iOS app (derives DC, attack and slot counts from scores, per-class known
and prepared for multiclass, 2014 and 2024), and a D&D Beyond walkthrough (always-prepared
subclass spells auto-added, duplicate cantrips from multiple sources unflagged, Ritual Caster
spells hidden inside the feat, wizard Learn/Prepare labels confusing). Two observations tie to
his use. First, every comparable tool derives DC and attack from ability scores; this app is
the only one that prints a blank, which is the strongest external argument for A-06. Second,
the pain points named for D&D Beyond (always-prepared handling, duplicate sources, feat spells
not surfacing) are exactly the cases this app already models carefully (D10, D21, D136,
D135), which says the app's core is not behind the field; it is ahead of it on its one
question. Loadouts, party views, dice and wizard economics serve play, not planning, and are
noise here.

**Summary.** Real: A-01, A-02, A-03, A-05, A-06/A-27, A-04/A-07, A-08, A-14 (as a recipe).
Noise: A-19 through A-24 and everything sheet-shaped.

---

## 5. Horizon

**Recommended: close the loop with his table.** Three phases after the audit lands. First,
finish what is open and wrong: K3 and K4 (A-01) and the half-caster pooling (A-02), with the
engine test scaffold from section 2 landing alongside so the pooling fix is the first fixture.
Second, make the plan leave the app: the level-plan copy (A-03) and the version compare
(A-05), both read-only over data the app already derives, both directly evidenced by the
Notion page. Third, the one model change: ability scores and proficiency bonus at the
minimum scope in A-06, gated on a D-entry that fixes the boundary sentence, with A-27 folded
in and the print blanks, the table's DC and the ASI step as the acceptance surfaces. Rewards
(A-04) fits at the end of any of the three as a small self-contained extractor addition.

**Alternative A: content first.** Rewards, then items as custom-source prefill, then the
homebrew recipe (A-04, A-07, A-14), with A-01 and A-02 first as above. Chosen if his current
campaigns lean on items and boons more than on planning alternatives; the Notion "Magic
Items" page hints they might. Costs more extractor work per unit of visible change and
leaves the plan still typed by hand.

**Alternative B: consolidation.** No new features for two phases: the engine test floor, the
linter D157(e) allows, the doc diet (DECISIONS to an index), the flag round, and the audit's
own fix batch. Chosen if wave 2 confirms more defects than expected, or if the reading cost
per session is already what limits him. Cheapest and least visible.

**What would change the recommendation.** Real usage evidence, which this session could not
read. If the guided builder and the timeline turn out unused, A-03 and A-05 drop and
Alternative B rises. If the Pages build on a phone is his real table surface, A-08 and a
mobile pass move to the front. If character-forge is where his live characters run, A-09
jumps above A-03 and A-06 becomes its prerequisite. One interview question settles all
three: where does a character live once it leaves this app, Notion, character-forge, or
paper.

---

## 6. Draft Phase L build candidates

Candidates for the triage interview, in PLAN.md's style. Model and effort follow
`model-policy.md` as D157(f) applied it: model changes and design on the strong model,
mechanical work on Sonnet.

- [ ] **L-A1 · K3 raw-stash + automatic re-parse.** *Done when:* bumping VERSION and reloading
  re-parses every `file` and `web` book without a prompt, the footer stamp matches, and a
  stashless legacy book is named once. Size M · opus@high (model half).
- [ ] **L-A2 · K4 retire the six verbs.** *Done when:* Refresh, Rescan, Forget, Remove-imported,
  Clear staged and the boot nag are gone, `rg` finds no dead handler, and a book removal still
  flags picks and deletes none (D42). Size S · sonnet@medium.
- [ ] **L-A3 · Half-caster pooling rounds up per class.** *Done when:* Artificer 5 / Wizard 5 pools
  to caster level 8 and Paladin 1 / Sorcerer 4 to 4, a fixture in the new engine test asserts
  both, and single-class slot rows are byte-identical before and after. Size S · sonnet@medium.
- [ ] **L-A4 · Engine test scaffold joins the gate.** *Done when:* `node scratchpad/engine.test.js`
  loads `app.js` headless against the baked data, runs at least ten fixtures across
  `compute`, `sliceChosen`, `planSlots`, `featBudget`, `prereqParts` and `buildHealth`, and
  CLAUDE.md's gate lists it as line five. Size M · sonnet@medium, fixtures reviewed opus@high.
- [ ] **L-A5 · Copy the build as a level plan.** *Done when:* a ⋯ menu item puts a plain-text
  plan on the clipboard in the shape `LVn: Class n / Class m · Feat · Spells (k, LVx): … ·
  ~~out~~ in`, honouring the acquisition order, D146 empty slots and D128 swaps, and a
  Notion paste of it round-trips his "Arcane Trickster" entry line for line. Size S ·
  opus@high (the format is design).
- [ ] **L-A6 · Compare two versions.** *Done when:* the manager offers "Compare" on two versions
  of one character and shows classes, feats, optional features, picks and swaps side by side
  at a chosen level, differences marked, nothing writable, measured at 1280 and 375. Size M ·
  opus@high.
- [ ] **L-A7 · Ability scores and proficiency bonus, minimal (D-entry first).** *Done when:* a
  D-entry fixes the boundary (scores and PB only); six editable tiles on the Character card;
  DC and attack fill on the table and the printed sheet; a score-gated prerequisite reads pass
  or fail; the ASI step records its score; export and import carry the fields additively;
  every existing build loads unchanged. Size M · opus@high.
- [ ] **L-A8 · Rewards ingestion.** *Done when:* both extractors emit `rewards` with
  `additionalSpells` resolved through the existing grant parser, cparity reports 0 fail with a
  census for the new array, and a reward is pickable where optional features are, with its
  grants in the Choices card and the table. Size S/M · sonnet@medium, cparity gate.
- [ ] **L-A9 · Homebrew-by-paste recipe.** *Done when:* a short doc (README or a `docs/` page)
  shows how a Claude session authors a 5etools-format brew for a species, feat or class that
  grants spells, and one of his campaign species round-trips through the K2 tray. Size S ·
  sonnet@medium.
- [ ] **L-A10 · Pipeline rules.** *Done when:* CLAUDE.md:82 reads "every commit that changes
  what is built bumps", `bump.py` writes the tag name into the CHANGELOG row, and a
  `scratchpad/snap.js` snapshot-and-restore script exists and is named in the wave brief.
  Size S · sonnet@medium; the CLAUDE.md line needs Francesco's yes (it amends D117).
- [ ] **L-A11 · The flag round.** *Done when:* the 14 open ⚑ flags have each been decided,
  parked with a date, or killed in one AskUserQuestion batch, and the parked ones live in
  ARCHIVE with a stub. Size S · session, no agent.
- [ ] **L-A12 · PWA install check.** *Done when:* Francesco reports the Pages build installed
  on his phone and opened offline, and the 2026-08-27 ⚑ closes. Size S · Francesco.

---

## 7. For the docs

Nothing here was edited; these are findings for the owners of each file.

- **README.md:126** still says "No custom-spell manager (homebrew is edited one spell at a
  time, from its modal)". The manager shipped on 2026-08-27 (ARCHIVE.md, closed backlog,
  "Custom-spell manager CLOSED → My homebrew"; `app.js:5048`). Stale after the 09-01 de-stale.
- **CLAUDE.md:82** ("Every commit bumps it") disagrees with practice: `aec541b`, `1794c7f` and
  `00ab59e` are unbumped docs commits on `main`; 1.4.13 was a bumped one. Pick one; section 2
  recommends the unbumped practice, as an amendment to D117.
- **DECISIONS.md D147** does not record the D140 approval for the 1.5.0 minor. If it was
  asked, one line closes the gap; if not, it is the first breach after D140 and belongs in
  D140's enforcement note.
- **GOTCHAS.md** should gain: the browser pane's storage is not only shared across ports
  (GOTCHAS.md:495), it can also be a fresh, empty profile from one desktop session to the
  next; a session that expects to find the real digest must confirm `IMPORT_KEY` exists
  before drawing any conclusion from its absence. Also: the claude-in-chrome extension lists
  as connected to a non-interactive agent but does not answer `tabs_context`, so "his
  browser" is not an input an agent can rely on.
- **PLAN.md** Queue: every item is owner-Francesco; add a "decide-by" date or move the
  undated ones to ARCHIVE at the flag round. The magic-items 🔶 should cite D55's "revisit
  later" as its owner so the two are not re-derived apart.
- **DECISIONS.md** should carry, when triaged: the A-06 boundary sentence if scores are
  built; a D-entry for A-03's format; and the pipeline amendments (docs commits, tag-in-row).
- **STATE.md:52–58** "Manual for Francesco" is a second flag list; fold it into PLAN's ⚑
  section so there is one.

---

## 8. Claims register

Each claim with its evidence pointer. Line numbers are against the worktree at `1794c7f`.

1. `src/app.js` is 10,159 lines; `extract.py` 1,837; `src/extract.js` 1,206; `styles.css` 2,491; `index.html` 738. — `wc -l` on the worktree.
2. Ability scores and proficiency are not modelled; the printed DC and attack cells are ruled blanks. — `src/app.js:9849–9852`; CLAUDE.md § What this is not.
3. Prerequisite parts naming a score resolve to "?" never "no". — `src/app.js:8934–8955`; D31.
4. Custom sources carry their own DC and attack. — `src/app.js:2906`, `:4220`, `:4546–4547`; D65.
5. The guide's ASI step is labelled "Feat / ASI" and models no score. — `src/app.js:1420`; the note at `:2323`.
6. Section headings and line numbers in the inventory. — `grep -n "^// ──" src/app.js`, output as cited per row.
7. Storage keys: `spellForge.custom.v1`, `.import.v1`, `.v2` (legacy), `.builds.v1`, `.sources.v1`, `.webRepo.v1`, `.webSync.v1`, `.webNag.v1`, `.parserNag.v1`, `.refreshMiss.v1`, `.table.v1`, `.print.v1`; IndexedDB `spellForge` with stores `kv` and `handles`. — `src/app.js:110`, `:126`, `:323`, `:381`, `:5174–5176`, `:5862`, `:5885`, `:5983`, `:9759`.
8. The build state shape and the append-at-end rule. — `src/app.js:387–404`.
9. Usage evidence: at `http://localhost:8010`, `http://localhost:8000` and `https://francescocompa.github.io` the pane holds one build (`spellForge.builds.v1`, 1,176 / 1,176 / 608 bytes), `spellForge.sources.v1`, no other `spellForge.*` key, and an IndexedDB `spellForge` with empty `kv` and `handles`; the one build's `meta.created` is 1788296743909 (2026-09-01 21:05:43 UTC, this session). — usage evidence (javascript_tool runs, this session).
10. The claude-in-chrome extension lists one connected local browser and `tabs_context_mcp` timed out twice. — usage evidence (tool results, this session).
11. K1 and K2 verified against a real 44-book digest. — PLAN.md:57–60, :72–76; STATE.md:42.
12. A saved build named "v2" has a health badge at L1–L4. — STATE.md:55.
13. The stale-parser notice fires on every version bump and K3 is its replacement. — STATE.md:57–58; D154(g).
14. Commits per day: 24, 34, 13, 13, 17, 31, 23 (2026-08-26 → 09-01), 155 total; 88 tags. — `git log --date=short --format=%ad | sort | uniq -c`; `git tag | wc -l`.
15. v1.0.0 is dated 2026-08-27, v1.5.8 2026-09-01; 1.3.0, 1.4.0 and 1.4.14 are 2026-08-31; 1.5.0 is 2026-09-01. — `git tag --format='%(refname:short) %(creatordate:short)'`.
16. 77 numbered versions 1.0.0 → 1.5.8; 13 of them doc-only. — CHANGELOG.md 1.x table (rows 1.0.1, 1.1.1, 1.1.3, 1.2.1, 1.2.3, 1.2.9, 1.2.16, 1.2.32, 1.2.38, 1.2.41, 1.4.1, 1.4.6, 1.4.13 read as handoff/clean rows).
17. From 1.4.7 on each release is followed by a "CHANGELOG: point the row at its own commit" commit. — `git log --format=%s v1.0.0..HEAD`.
18. Pure-fix releases as listed. — CHANGELOG.md rows 1.1.2, 1.2.29, 1.3.1, 1.3.2, 1.3.3, 1.4.2, 1.4.3, 1.4.4, 1.4.7, 1.4.14, 1.5.4, 1.5.5; the 1.4.8 row's "Plus a v1.4.5 regression"; the 1.2.10 row (D120).
19. The `refreshAll()` staleness class shipped three times. — GOTCHAS.md:655; CHANGELOG 1.4.7 ("third sibling of the defect fixed in v1.2.29 and v1.4.2").
20. Three releases were spent on the stale-digest diagnosis. — GOTCHAS.md:643–654; D139.
21. D146 was a model defect from E1 (v1.2.4, 2026-08-28) found by Francesco on 2026-08-31. — D146; CHANGELOG 1.4.14; CHANGELOG 1.2.4 date via claim 15's tag list (v1.2.2 2026-08-28).
22. The verify gate is four lines and asserts no `app.js` behaviour. — CLAUDE.md § Verify gate.
23. Both siblings gate on typecheck + lint + tests. — monster-forge CLAUDE.md:15–17; character-forge CLAUDE.md:43.
24. D157(e) allows a linter and the first `package.json`. — DECISIONS.md D157(e).
25. D140 took the minor away after 1.3.0 and 1.4.0. — DECISIONS.md:1483–1495.
26. D147's entry does not record an approval for 1.5.0. — DECISIONS.md:1701–1765 (grep for "minor"/"approv" finds none).
27. CLAUDE.md:82 says every commit bumps; the last three `main` commits are unbumped docs commits. — CLAUDE.md:82; `git log --oneline -3`; VERSION = 1.5.8.
28. Doc sizes: CLAUDE 7,139 B; STATE 6,558; PLAN 17,089; DECISIONS 195,431; GOTCHAS 67,665; CHANGELOG 59,809; ARCHIVE 193,867; README 7,662. — `wc -c`.
29. DECISIONS has 190 `*Rejected:*` occurrences. — `grep -c Rejected DECISIONS.md`.
30. `/clean` on 2026-08-31 took the live set 304 KB → 227 KB. — STATE.md "Docs were cleaned 2026-08-31".
31. Wave traps: shared origin, `pkill`, wrong server, shared tags and D-numbers. — GOTCHAS.md:495, :532, :724, :737; CHANGELOG 1.5.5 renumbering note.
32. 14 open ⚑ flags by date: 1 (08-26), 3 (08-27), 2 (08-29), 3 (08-30), 2 (08-31), 2 (09-01). — `grep -o "⚑ (owner: Francesco, [0-9-]*)" PLAN.md | sort | uniq -c`.
33. The magic-items 🔶 was researched 2026-08-27 and awaits a call; the item facts (282 `charges`, 0 structured DC of 402, 115 variant items, 88 rewards with `additionalSpells`). — PLAN.md:172–195.
34. Half-caster pooling floors where 2024 rounds up per class. — PLAN.md:166–171; CHANGELOG 1.4.3.
35. D55 rejected item ingestion "for v1 … revisit later". — DECISIONS.md:94–102.
36. D36 rejects URL sharing, not file or clipboard export. — DECISIONS.md:65–69.
37. D98 makes print always the spell table and rejected "whichever tab". — DECISIONS.md:460–468.
38. D115(c) rejected recording prepared lists. — DECISIONS.md:627–629.
39. D78 bounds the creature set; Polymorph is out until the catalogue ships. — DECISIONS.md:156–170; PLAN.md:209–214.
40. D153 left "option B", a Mac-side mirror-refresh script, unbuilt but not rejected. — DECISIONS.md D153 *Rejected:* clause.
41. D154 aligned the Library with monster-forge's preset-library modal deliberately. — DECISIONS.md D154 preamble.
42. monster-forge exports "Copy for Claude" and "Copy for Notion". — monster-forge README.md:74–77.
43. character-forge's `spellcasting` contract: `sources[]` (ability, DC, attack, prepare rule), `slotPools[]`, `spells[]` with `origins[]`, `swaps[]`. — character-forge schema/README.md:65–83.
44. character-forge lists a level-up diff view and a variant switcher; its app never writes character files. — character-forge docs/PROJECT-SCOPE.md §14 rows 9 and 11, §7; CLAUDE.md:32–34.
45. character-forge's session layer tracks HP, slots, uses, rests. — character-forge docs/PROJECT-SCOPE.md §7 "Trackers".
46. Neither sibling's docs mention My Spellbook. — `grep -rni "spellbook"` over character-forge docs/CLAUDE/CHANGELOG and monster-forge ROADMAP/TASKS/DECISIONS returns one unrelated hit (monster-forge DECISIONS.md:312).
47. Notion Character Ideas: level-by-level plans with spells per level and struck-through swaps (Arcane Trickster: "LV7 … ~~Charm Person~~ Hold Person"), variants "Arcane Spy V1/V2" and three "Heavenly Archer" drafts, every entry opening with stats and "Background … ASI +2/+1", and invocations with designations ("Agonizing Blast (True Strike)"). — Notion page 2d029a9da02580379cddeb432648cbb2 (fetched read-only, last edited 2026-05-01).
48. Notion Character Sheet DB: 12 PCs across two campaigns; schema carries scores, HP, AC, Save/Skill/Tool Prof., languages; class options include "Savant"; species options include Kintsujin, Memento, Silf, Silvano, Saru. — data source 68a965f9-9a41-446f-8f1d-a78094ec60a2 (schema fetch and a read-only SELECT of 12 rows).
49. Notion "Player Characters" links a "Magic Items" page and a "Spellcasting Progression" table (spell slots by level, LV1–LV20). — pages 11c29a9da025800994c1f17232a81b2f and 10629a9da025809abe40fc0bdef932e6.
50. Foundry Spell Book module: per-class tabs, preparation checkboxes, loadouts, wizard scroll costs, party synergy, 2014 and 2024. — https://foundryvtt.com/packages/spell-book
51. Book of Spells app derives DC, attack, slots and prepared counts, per-class known/prepared for multiclass, 2014 and 2024. — https://apps.apple.com/us/app/book-of-spells-5e-2024/id6444626336
52. D&D Beyond: always-prepared subclass spells auto-added; duplicate cantrips unflagged; Ritual Caster spells hidden in the feat; wizard Learn/Prepare confusion. — https://whatdoiknowknighterrantjr.wordpress.com/2025/04/15/demystifying-spellcasters-in-dd-beyond/ (via the 301 from whatdoiknowjr.com); forum thread https://www.dndbeyond.com/forums/d-d-beyond-general/bugs-support/205230-2024-classes-spell-issues-subclass-spells-spells
53. README.md:126 claims no custom-spell manager; the manager exists. — README.md:126; ARCHIVE.md closed backlog "Custom-spell manager CLOSED 2026-08-27"; `src/app.js:5048`.
54. The D135 `##n` suffix distinguishes repeated feat takes. — DECISIONS.md D135 ②; CHANGELOG 1.3.0.
55. D148(c) shows a feat's ASI grant as a fact in the detail modal. — CHANGELOG 1.5.1 (c); DECISIONS.md D148.
56. The `--ab-*` ability tokens exist and pass 5.3:1 in both themes. — D142(b), D145(a).
57. STATE's "Manual for Francesco" list has seven items. — STATE.md:52–58.
58. Phase K is paused by D157 pending triage. — PLAN.md:6–7, :39; DECISIONS.md D157 preamble.
