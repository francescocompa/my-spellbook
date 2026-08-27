# STATE — My Spellbook

> Resume doc. One current-state block, edited in place.
> History → git log. Consumed phases and decision rationale → `ARCHIVE.md`.

## TL;DR (2026-08-27 · code at 0de78ed, **pushed** · v7: T1–T5 done, T7 left · **LIVE on GitHub Pages**)
- **State:** working, committed, **pushed**. **v7 is T1–T5 done; only T7 remains.** Ten note
  batches have landed on top of the tasks (**D43–D89**); per-batch narrative →
  `ARCHIVE.md#v7-batches`. The last two shipped together in 0de78ed. **Batch 9** made feat
  categories **data-driven** (an unknown category — UA's Wild Talent — keeps its own name instead
  of being filed as "general", origin is a **subset** of general, and a feat is attributed to the
  slot it was SPENT from, D84), added **casting-rule modifications** end to end (D85), and made
  imports **additive** behind one "Your books" keep-list (D86). **Batch 10** was polish and
  backlog: switcher characters as **cards with a pinned footer** (D87), reference prose behind a
  **`?` disclosure** while live state stays put (D88), staged files on one scrolling row, casting
  mods surfaced in the spell table, the double divider above a dimmed list gone, the book chip out
  of the spell-**pick** modal (D89), and **eight backlog items closed**. Extractor parity is
  **byte-exact** — grants diff to 0 across all five arrays with 0 one-sided records
  (`node scratchpad/cparity.js`, 24/24).
- **Next action:** **custom sources — a dedicated back-and-forth design session.** Francesco's
  call from note batch 4, now deferred six times. The D55/D65 *model* is right; its UI is not.
  **Done when:** the surface is interviewed end to end and the redesign is a decision entry with a
  task line behind it. Then **v7 · T7 (storage-pressure reporting)** — no count cap (D37); catch
  the quota failure on write and name the real cause. **Done when:** a failed save says what is
  using the space, not "something went wrong". *(Last task in v7.)*
- **Manual for Francesco:** ⓪ **Re-import again after D91** — any zip import made before it stored
  spells with **no class access at all** (`spells/sources.json` clobbered the real lookup). If your
  imported spells match no class, that is why; re-importing fixes it. ① **Re-import your 5etools
  data on every browser** — an import made
  before 0de78ed carries no `catName`, no `exclusiveCat` and no `castMods`, and one made before
  **b3a734c** also has Foundry stubs baked in (D82). None of it back-fills. Re-importing is cheap
  now: it **adds** rather than replacing, and the "Your books" panel is where you drop what you
  don't want. ② **Turn XMM on in Sources** if you want Find Familiar's 24 Monster Manual 2024
  forms in the default view (D81). ③ Optional — ask GitHub Support to gc so the *old* unreachable
  commits (SHA 2c8bbb6 etc., held only in `backup/pre-purge-20260826` locally) stop being
  SHA-addressable. ④ To update the live site: `python3 extract.py` (if data changed) →
  `python3 build.py` → commit → push. ⑤ `dist/`, `data/`, `data-srd.json` are gitignored (local
  only); public SRD data is inlined in committed `docs/`.

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Build / run
- Dev: `python3 serve.py 8000` → `http://localhost:8000/src/index.html` (launch.json
  `spellbook`). Use `serve.py`, **not** `python3 -m http.server`: the latter evaluates
  `os.getcwd()` at argparse time, which the preview sandbox blocks (startup crash);
  `serve.py` binds an absolute root as a library and sidesteps it. Under the restricted
  preview sandbox `preview_start` still can't spawn it (can't read the project dir) — start
  it via Bash, then open the browser at the URL. serve.py sends `Cache-Control: no-store`,
  so a plain reload always picks up edits (the old hard-reload gotcha is gone).
- Data refresh: `python3 extract.py` (mirror default = `~/Documents/D&D/5etool_mirror/…/data`,
  writes data.json + `data-srd.json`), then `python3 build.py` (writes data.js, dist/ with full
  data, docs/ with SRD inlined).
- `src/extract.js` = in-browser port of extract.py (the importer). Keep them in sync.
- Verify gate: `python3 -c "import ast;ast.parse(open('extract.py').read())"`,
  `node -e "new Function(fs…app.js)"`, `node -e "new Function(fs…extract.js)"`, json load.
- Deploy: commit + push `main`; Pages builds `main:/docs` (has `.nojekyll`).

## Now — v7: saved builds

One character at a time was the last hard limit in the app. T1–T3 removed it, T4 made builds
reachable from the header and T5 got them off this machine as files. What's left is telling
the truth about storage limits (T7).

### Shape *(settled by D33–D37)*
```
spellForge.builds.v1  = { activeId, order:[id…], builds:{ id: {meta, state} } }
meta = { name, character, named, created, updated, summary, sources:[…] }
       // name      = the version's name ("Evocation", "L3")
       // character = the GROUPING LABEL (D35) — versions of one character share it;
       //             level-free, auto-follows the build until `named` is set by a rename
       // summary   = "Wizard 8 · Evocation", derived
       // sources   = the books this build was last seen under (D33)
spellForge.sources.v1 = [ … ]     // the GLOBAL book list, hoisted OUT of `state` (D33)
```
`state` keeps its old shape inside each build **minus `enabledSources`**, so `save()`/`load()`
became "save/load the active build" and nothing else downstream changed. Homebrew, imported data
and the column layout stay global — they're content and preferences, not character sheets.
Sources join them, but every build remembers what it expected.
→ what T1 replaced: `ARCHIVE.md#pre-v7-storage`

### Tasks
- [x] **T1 · storage + migration** (`model`, ~M) — **DONE 2026-08-26.** New keys, `activeBuild()`,
  `enabledSources` hoisted to `spellForge.sources.v1`, and a one-time migration lifting the
  legacy `spellForge.v2` blob into build #1. `save()` is now auto-save of the active build (D34).
  The legacy key is left untouched as a one-release rollback. *Verified:* migrated session →
  "Wizard 8 / v1" with classes + picks intact and `meta.sources` = its 43 books; reload idempotent
  (`BOOT_MODE` "loaded", one build); wiped session → exactly one empty build, sources all-on.
- [x] **T2 · activation reconciliation** (`correctness`, ~S) — **DONE 2026-08-26.** `#srcAskModal`
  asks, on activation, **only about books the build's picks actually depend on**
  (`buildGaps().books`) — a book it merely had enabled changes what you can browse, not what it
  holds, and listing all 42 of those was noise. Each book is named with its affected-pick count.
  Declining activates the build whole and raises the gap banner (`#gapBar`). See **D42**.
  *Verified:* a Wizard build carrying a TCE feat, activated under "2024 core only" → dialog names
  TCE / 1 pick → **Keep my books** keeps the feat and its two pending choices plus the banner;
  **Turn them on** enables TCE and clears it; disabling a book by hand keeps an `Aarakocra|DMG`
  species (field reads "Aarakocra · DMG is off") and an `Artificer|TCE` row that still resolves.
- [x] **T3 · manager UI** (`ui`, ~M) — **DONE 2026-08-26.** `#buildModal` from the ⋯ menu: one flat
  list grouped by `character`, each row name + summary + last edited; switch, rename, duplicate,
  delete (confirm), new. Names are **inline inputs** that look like text until touched — no edit
  mode; renaming a character rewrites every version under it and sets `meta.named`. Duplicate
  *is* "save as new version" (D34), one action. Active build = accent left-bar + tint + `current`
  chip. *Verified:* switch loads the other build's state; rename at both levels; delete moves the
  active to a neighbour; **deleting every build never leaves zero**; survives reload.
- [x] **T4 · switcher** (`ui`, ~S) — **DONE 2026-08-26.** `#bswBtn` sits in the header next to
  the title: `▤ <character> <version>`, with the version chip appearing only when that character
  has more than one. Its popover lists every build grouped by character (current marked), plus
  **New build** and **Manage builds…**. Switching goes through `switchBuild()`, so the T2
  activation dialog and the gap banner still apply. On a phone it takes its own full-width line
  under the top row, which stays intact (D47/D52). *Verified:* switch both ways reloads the other
  build's classes/species; duplicate → the `v2` chip appears; rename in the manager updates the
  header; no console errors.
- [x] **T5 · export / import a build** (`data`, ~M) — **DONE 2026-08-26.** Every row in the
  manager has **export** (downloads `<character>-<version>.spellbook.json`, a
  `{kind,version,exported,meta,state}` envelope carrying `meta.sources` per D33). **Import…**
  opens a panel in the manager taking a dropped file, a browse, or pasted JSON. Import always
  **adds** — never overwrites — deduping the version name (`L9` → `L9 (2)`), and
  `applyImportedState()` renumbers class row ids while remapping `chosen` keys and the `c<N>:`/
  `s<N>:` choice-id prefixes, so picks and pending choices survive the renumber. Nothing from
  the file is trusted: levels clamp, arrays coerce, `meta.sources` is a **record**, never an
  instruction — a missing book is reported, never auto-enabled. *Verified:* round trip preserves
  summary, picks and choices; malformed / foreign / newer-version files are each rejected with
  their own message; a build naming an unloaded book says so on arrival.
- [ ] **T7 · storage-pressure reporting** (`data`, ~S). No count cap (D37); instead catch the
  quota failure on write and name the real cause. **Done when:** a failed save says what is
  using the space, not "something went wrong".
- [x] ~~**T6 · budget/choice reset semantics**~~ **Closed by D37** — picks survive a relevel
  untouched and the existing soft over-flag does the rest. No new machinery.

Nothing gates the remaining tasks.

### Non-goals
~~Level-up history/snapshots~~ — **superseded by D34/D35**: versions exist, but as *named copies*
the app never orders or interprets. A true level-by-level timeline (ordering rules, fork-on-edit)
stays out. Server sync or accounts. Sharing a build as a rendered page, or via a URL (D36).

## Decisions

### Binding — these constrain current and future work
- **D12 (2026-08-26) Deploy = app-not-data; repo public + history purged** — the Pages build ships
  the app, not the full dataset. *Rejected:* a separate public repo; private+Pro; keeping the data
  in the bundle. → rationale `ARCHIVE.md#rationale`
- **D13 (2026-08-26) Embed SRD 5.2** — the public build ships the `srd52`-flagged subset
  (CC-BY-4.0, **credit footer required**) so it's usable without importing; import adds the rest.
  Supersedes D12's "no data in public build" — SRD is licensed, safe to distribute.
- **D17 (2026-08-26) Public build flag** — build.py injects `window.__PUBLIC__=1` into `docs/`;
  the app hides the 🎲 random-build helper when set.
- **D27 (2026-08-26) Source selection is one global list, overridable per picker** — the ⚙ Sources
  modal is the single place books are chosen. Every picker reuses **that same granular component**,
  seeded from the global list, with a local override that does not write back. Overrides are **not**
  sticky — a picker opens on the global selection. *Rejected:* named switchable presets (more UI
  than the problem needs); per-picker defaults in settings (three lists to keep in sync); keeping
  the one-line "any book" select.
- **D31 (2026-08-26) Prerequisites are advisory, never prohibitive** — both extractors emit
  `prereqs`: one record per OR-alternative, splitting the checkable parts (level, feats, optional
  features, species, spellcasting, pact) from the unverifiable ones (`checks`: ability scores,
  proficiencies, backgrounds, campaigns). An alternative carrying an unverifiable part resolves to
  "maybe" and **can never read as a hard no**. Pickers sort eligible first and dim the rest; a
  picked entity whose prerequisites lapse gets ⚠ and is **kept**. *Rejected:* hiding ineligible
  entries by default (would hide legal picks the app can't verify); blocking selection outright.
  → the runtime rule lives in Gotchas.
- **D33 (2026-08-26) Sources stay global; each build *records* the list it was made with** —
  `enabledSources` lives in `spellForge.sources.v1`, so D27 survives intact. Each build stores
  `meta.sources`; activating one whose list differs prompts rather than pruning. This **dissolves
  the original T2 hazard by construction** (there is no bulk prune to get wrong) and gives T5's
  export its embedded source list for free. *Rejected:* sources travelling inside the build
  (contradicts D27; relocates the hazard); purely global with builds unaware of their books (a
  build reopened with a book off loses picks with no way to know what it expected).
- **D34 (2026-08-26) Auto-save, plus versions — reverses the "no snapshots" non-goal** — every edit
  writes through to the active build: no dirty state, no unsaved-changes guard, no way to lose work
  by closing a tab. On top of that a build can be saved as a **new version**, so one character holds
  several sets of build choices side by side. Raw note: *"Auto-save + snapshot, builds should have
  versions (different build choices for the same character aggregated)"*. "Snapshot" and "new
  version" are **one action**. *Rejected:* explicit save with a dirty indicator (three states to
  keep honest, a guard on every exit path, and a crash would start losing work the app can't lose).
- **D35 (2026-08-26) A version is a named copy; `character` is a label, not a container** — builds
  stay ONE flat list keyed by id; the manager **groups by the label on render**, so aggregation is
  a render concern, not a data hierarchy. The app never interprets whether a version is an
  alternative or an older level. Duplicating keeps the character name, so **duplicating is how you
  create a version**. *Rejected:* versions as explicit same-level variants (asserts a sameness that
  breaks the moment you level up and keep the old one); versions as an ordered level timeline (the
  non-goal proper); `characters:{…}` as a real object (two things to name and delete, a
  zero-version state to define, roughly doubles T1 and T3).
- **D36 (2026-08-26) Export is a file; URL sharing is out of v7** — JSON download + file/paste
  import, with `meta.sources` embedded. Covers the actual risk (a build is one browser away from
  gone) with no size ceiling. *Rejected:* a URL-hash-encoded build (a heavily-picked multiclass
  build exceeds what browsers and chat apps carry, so it needs compression **plus** a graceful
  fallback — roughly doubles T5); parking it as a deferred task (it stays a non-goal, not a queue item).
- **D37 (2026-08-26) Relevel keeps every pick and flags it; no cap on builds** — duplicating a build
  then changing its level leaves `chosen`/`choices` untouched (keyed by row id and choice path);
  anything now over budget or above max spell level gets the **existing** soft over-flag. Consistent
  with D18 and D31 — zero new machinery, and it **closes T6**. There is **no count cap**: the real
  constraint is the ~5 MB localStorage quota that imported data dominates, so quota failures are
  caught on write and reported for what they are (T7). *Rejected:* auto-dropping picks that no
  longer fit (silent destructive pruning); a "duplicate without picks" prompt; a soft warning past
  ~20 and a hard cap (arbitrary — eight characters × three versions is 24 and entirely reasonable).
- **D42 (2026-08-26) Turning a book off flags picks, it never removes them** — `afterSourceChange()`
  used to strip every class, subclass, feat, optional feature and species whose book you had just
  disabled. Unticking a book to browse is not a decision to delete half a character. It now prunes
  **nothing**; only `pruneState()` drops refs, and only to content that has ceased to exist. What
  remains is surfaced: the gap banner, `.gapped` fields, and the T2 dialog. Same rule covers a
  manual source change and a build switch — one behaviour, not two. Two silent-rewrite bugs fell
  out of this and are fixed (see Gotchas). *Rejected:* pruning only the active build (the inactive
  ones then rot silently); asking on every source change (it is a browse action, not a commitment).

- **D53 (2026-08-26) New build starts in a modal; destructive buttons arm, never confirm()** —
  creating a character asks for character name + version name (both optional — an empty name
  keeps D35's auto-follow). And **native `confirm()` is banned**: it silently returns `false` in
  embedded webviews (no dialog at all), which is why "delete" in the manager looked dead. Every
  destructive button now ARMS on first click ("confirm?", red, 4 s window) and commits on the
  second — `armConfirm()`. *Rejected:* keeping confirm() with a fallback (the failure is
  undetectable); a shared confirm modal (heavier than the two-click pattern needs).
- **D55 (2026-08-26) Custom spell sources — a thing the character owns that grants spells** —
  "Spell sources" fieldset on the Character card; a modal defines name, kind (item/boon/
  blessing/other), mode (**cast without preparing** with per-spell cadence — at will, n/long
  rest, n/short rest, n/dawn, charges — or **always prepared**, no cadence), and a searched
  spell list. Stored INSIDE the build (`state.customSources` — a Staff of Fire belongs to a
  character and travels with T5's export) and resolved through `resolveGrants` like a species
  or feat, so free casts, the cart and the table need no new paths. Deleting arms (D53).
  *Rejected for v1:* ingesting magic items from 5etools data (items carry `attachedSpells` but
  no structured uses — hand-set cadence is needed regardless; revisit later); global storage.
- **D56 (2026-08-26) Prune only inside a loaded book — D42 extended to imports** — `pruneState()`
  used to treat "entity not in the current content" as "ceased to exist", so importing a lone
  homebrew file (which REPLACES imported data) silently stripped whole builds. Now a ref is
  pruned only when its BOOK is loaded and the entity is gone from it; a ref whose whole book is
  absent is kept and surfaces through the gap machinery, and the gap bar distinguishes "turned
  off" (one-click fix) from "not loaded — re-import it". Found when an import test ate the test
  build's classes.
- **D57 (2026-08-26) Icons are real SVGs, never font glyphs** — monster-forge convention: 16×16
  `currentColor` stroke paths in an `ICONS` map, sized by context via CSS (`.ico svg`), static
  markup declares `data-ico` and boot fills it. The full sweep replaced 🎲 ⋯ ▤ ✎ ⭳ ⚙ ◐ ⟲ ☾ ＋ ×
  ✓ ✗ ● ✦ ⚠ everywhere (`<option>` text keeps "+"/"✦" — options can't hold markup). Top-row
  controls got one 34 px height and the header centres. **From now on every new icon goes
  through `ICONS`/`icoEl`/`xBtn` — no glyphs.**
- **D58 (2026-08-26) Homebrew & UA import through the same importer** — verified on 5e.tools:
  homebrew (including D&D Beyond drops) lives in **github.com/TheGiddyLimit/homebrew**, UA in
  **github.com/TheGiddyLimit/unearthed-arcana** (the site's Manage Homebrew / Manage Prerelease
  pages front them); both are per-brew JSON with `_meta.sources` + the usual entity arrays. The
  importer now registers `_meta.sources` books under a "Homebrew & UA" group and reads a spell's
  INLINE `classes.fromClassList`/`fromSubclass` access (brew style — core data uses the
  generated lookup). Import modal documents the path.
  ~~Caveat: building an import REPLACES the previous one.~~ **SUPERSEDED → D86.**

- **D64 (2026-08-26) Per-level loadouts are VERSIONS, not per-pick level stamps** — the preview
  gains **save as version**, which forks the build at the previewed level split (D37 keeps the
  picks and soft-flags what no longer fits), so you can then pick freely at that level. Stamping
  each pick with `atLevel` was chosen first and then **rejected on Francesco's own objections,
  which are correct**: planning at level 20 first leaves every pick unstamped, and a stamp cannot
  express **retraining** — a spell gained, dropped and regained needs intervals per pick, which
  would touch every budget check, the whole UI and the export format. Versions already do this
  correctly and already export. The preview stays a viewer.
- **D65 (2026-08-26) Custom sources model how items actually work** — kind is **free text**. A
  source spends **either a shared pool** ("10 charges, regains 1d6+4 at dawn", each spell costing
  N — how most magic items work) **or per-spell uses** (a boon's 1/long rest). It may carry **its
  own save DC / attack bonus / casting ability** — an item casts on its numbers, not yours — and
  a **per-spell fixed cast level** ("as a 5th-level spell"). Three modes: cast without preparing,
  always prepared, and **added to my spell list** (prepare it normally, it costs a prepared slot
  — resolved by widening the eligible pool, not as a grant). *Rejected:* an attunement/active
  toggle (Francesco's call); a Kind dropdown.

- **D76 (2026-08-27) Magical Secrets weighs on the TOP of your list, not just its own count**
  — an off-list spell can only have been taken from the feature's level on, so every off-list
  spell you hold **below** level L has already spent one of the acquisition events at levels
  ≥ onset — the same events that buy you spells at level L. Best case those are the earliest
  such events (the window between onset and your first L-level slot); the shortfall comes out of
  `cap[L]` itself, and the per-level tiles and over-flags follow the narrowed ceiling. Two things
  fall out: one off-list **1st**-level spell costs a slot of "spells at level ≥ 2" (it cannot
  have been learned before the feature), and it does **not** cost 8th-level capacity unless the
  off-list picks outnumber the window — the tool reports the BEST case (D18), so "I retrained at
  15" and "I could have retrained at 10" are the same build to it. *Rejected:* stamping each pick
  with the level it was taken at, which would price the retrain exactly — that is D64, rejected
  because a stamp cannot express retraining intervals.
- **D78 (2026-08-27) A spell can print a CAST, not just a creature** — some spells name a whole
  group: Find Familiar lists eleven forms and then says "or any beast of CR 0". Both extractors
  resolve `{@creature Name|SRC}` refs and `{@filter …|bestiary|challenge rating=[&0]|type=…}`
  into a list of monster keys on `sp.creatures`, against a shared `DATA.monsters` map — so a
  monster referenced twice is stored once. The stat block section becomes a **carousel** (prev /
  position / next + a book filter) whenever the set holds more than one, and it respects the
  global Sources list like everything else. **SCOPE:** the monsters carried out of a bestiary are
  `summonedBySpell` blocks plus **CR 0 non-swarm beasts** — exactly Find Familiar's set in both
  editions — and filters expand for **XPHB spells only**. That is 65 monsters, +48 KB to the
  offline digest and +16 KB to the SRD subset. *Rejected:* expanding the 2014 Conjure spells'
  CR ≤ 2 filters (219 beasts + 58 fey + 36 elementals — ~450 KB, for spells the Editions filter
  hides by default); named refs only (drops the CR 0 set that was the point).
  → widening is a change to `carried_monster()` / `carriedMonster()` in the two extractors and
  nowhere else. A ref to a creature outside the carried set silently doesn't resolve.

- **D79 (2026-08-27) A grant may be prose-only, and a grant may modify how you cast** — two
  gaps in 5etools' model, both fixed at the extractor. ① **Prose-only grants**: Mystic Arcanum
  ("Choose one level 6 Warlock spell") carries `additionalSpells: null`, so there was nothing to
  parse and the Warlock simply never got its arcana. A hand-authored `PROSE_GRANTS` table emits
  the same shape `parse_grants()` does — Warlock's four arcana, the Cleric capstone's Wish, the
  four Wizard school Savants, and Knowledge Domain's Mind Magic. ② **Modification notes**: a
  feature often changes HOW you cast what it grants ("without expending a spell slot", "you
  automatically succeed on the save") and 5etools carries that in prose only. `MOD_RE` lifts just
  those sentences onto the grant as `note`, shown as a bordered block in the spell modal and a
  dotted-underline popover on the table's source badge. The regex is deliberately **narrow**: the
  first cut matched "you always have these prepared" and produced 470 notes of boilerplate for
  something "Always prepared" already says — it is 44 now. *Rejected:* shipping each granting
  feature's full text (most of it is not a modification).
- **D81 (2026-08-27) A creature set is filtered in the carousel, never pruned by it** — extends
  D42 to D78's creature sets. `spellCreatures()` no longer drops forms whose book is off; the
  carousel's own **book panel** (a ghost icon before the head's chevron) lists every book in the
  set with its count and marks the ones off in your Sources, so you can tick them in locally.
  This is what "Find Familiar is missing most base MM25 options" turned out to be — all 24 XMM
  CR 0 beasts were in the data, XMM was simply switched off. The carousel's controls also moved
  BELOW the block: you read the creature, then step. *Rejected:* the `<select>` book filter it
  replaces (it sat in the head and could only narrow to one book at a time).

- **D82 (2026-08-27) The importer rejects Foundry payloads by name AND by marker** — a zip
  carries per-directory `foundry.json` files alongside the top-level `foundry-*.json` ones, and
  `zipWanted()` only matched the hyphenated form. Their stub records then won, because the
  builder overwrites by `name|source` and pushes classes unconditionally. The name test drops
  the hyphen; on top of it `dropFoundryStubs()` strips any entity carrying `migrationVersion`,
  a Foundry-only field, so a differently-named dump cannot repeat this. **Anyone who imported
  before this must re-import** — the corrupt records are already in their localStorage.
  *Rejected:* filtering only by `migrationVersion` (the name test also saves parsing three large
  files); detecting the corruption at boot and warning (machinery for a one-off).

- **D83 (2026-08-27) One book checklist, everywhere** — the carousel's book filter was
  hand-rolled markup; it is now the shared grouped checklist (D27) with its group headers and
  all/some/none toggles, seeded from the global Sources list but **local** — ticking there never
  writes back. `renderSourceChecklist()` gained an optional per-source count label so it can
  count *forms* instead of spells; every existing caller keeps the `Nsp` default. Two fixes fell
  out that affect **every** checklist, not just this one: `GROUP_NAME`/`GROUP_ORDER` never
  covered 5etools' `supplement-alt` / `setting-alt` groups, so ten books (the Plane Shift
  crossovers among them) rendered as a raw key and sorted last. Also **the carousel's controls
  are pinned**: the nav's viewport position is held across a repaint and the height difference
  handed to the scroller, so a taller or shorter creature is absorbed above the controls rather
  than shoving them under the cursor. The head stopped counting forms — `3 / 8` already does.

- **D84 (2026-08-27) A feat's CATEGORY is a book's own label; its SLOT is what it can be spent
  from — and origin is a SUBSET of general** — `featCat()` folded every category it didn't know
  into "general", which is exactly where UA's ten **Wild Talent** feats landed (5etools stores
  the category as free text — `"Wild Talent"` — and declares nothing about which slot it fills;
  the rule lives only in the book's prose). Now both extractors emit `catName` (known code →
  `_meta.featCategories` → the raw value), the app derives the slot (`EB`→epic, `FS*`→fighting
  style, `G`/absent→general, **anything else→origin**), and the picker's toggle row is built from
  the categories actually present rather than three fixed buttons. The **general** picker offers
  origin-slot feats too — Francesco's call, and what the Wild Talent rule says in as many words.
  Because of that, budget attribution had to move: a feat is counted against **the slot it was
  spent from** (`state.featSlots`), not its category, which also closes the standing
  `origin 2/1` backlog item. On top of it, category exclusivity ("no other Dragonmark feat",
  "No other Wild Talent") became a **real check** instead of an unverifiable one — the build's
  own feats answer it, and self-exclusion doesn't count. *Rejected:* treating unknown categories
  as origin-only (correct for Dragonmarks and Dark Gifts, wrong for Wild Talents, which the UA
  explicitly also allows at an ASI); a hand-maintained category→slot map in both extractors
  (precise, but every new UA that invents a category would need a code change and a re-import).
- **D85 (2026-08-27) A feature may change HOW you cast a spell you already have, and an
  unverifiable condition marks rather than strikes** — a dozen features rewrite casting rules for
  a whole class list or school: Psion's *Psionic Spellcasting* (no V or M on any Psion spell),
  GOO Warlock's *Psychic Spells*, Illusionist's *Improved Illusions*, Aberrant Sorcery's *Psionic
  Sorcery*, Undead Warlock's *Profane Casting*, 2014 *Archdruid*, Shadow Monk. 5etools carries
  none of it structurally and D79's `MOD_RE` never matched component language at all, so it only
  ever reached spells a feature GRANTS. A hand-authored `CAST_MODS` table (like `PROSE_GRANTS`,
  identical in both extractors) attaches `{feature, level, scope, drop, exceptCostly, when, note}`
  to the class/subclass; `scope` is `{cls, schools, spells, giver}`. The app resolves what is live
  at your level and marks the affected components in **three places**: a chip under the class row
  that added it, the table's Comp. column, and the spell modal. **`when` is the honest half** — a
  condition the app cannot verify ("by spending Sorcery Points") marks the letter with a dotted
  underline and never strikes it through. A component the spell doesn't have, or a Material the
  feature exempts for costing money, is not touched. `MOD_RE` widened to the component clauses
  too, so a grant that strips V/M (every Wild Talent) now carries its note: 44 → 52 notes, still
  narrow. *Rejected:* a note with no computation (the table would still print V/S/M that don't
  apply to you); covering feats, species and optional features with their own scope table (mostly
  already served by grant notes, for a much bigger authored table).
  → **widened 2026-08-27:** `scope` gained `maxLevel` and `optTypes` (a spell granted by one of
  YOUR optional features of that type), entries gained `label`, and a mod with an **empty `drop`**
  is a free cast rather than a component change — it still registers and names itself. That took
  the table from 9 entries to 13 and closed three backlog items at once. A grant row also carries
  `ownIdx` now, so `scope.cls` matches the class exactly instead of by substring.
- **D86 (2026-08-27) An import ADDS, and ONE list decides what is in your data** — building an
  import used to replace everything stored, so adding one brew meant re-staging every core file
  with it (D58's caveat). `mergeDigests()` now merges by `name|source` — a staged file wins only
  over its own exact record — and what ends up stored is chosen in a single **"Your books"**
  panel listing every book you already have plus every book the staged files hold, where a tick
  means "this is in my data". Unticking a book you have **removes its content**, which is the
  only way to get storage back; picks that referenced it are kept and surface through the gap
  machinery (D42/D56), never deleted. Nothing is written until **Apply**, which names the delta
  and turns red when it would remove something. The list carries its own **filter**, and All /
  None act on what the filter is showing — with 60+ books that is what makes it quick. *Rejected:* two panels, one for staging and one
  for what is loaded (monster-forge's shape — but "keep or remove" is one question, so it is one
  list); ticking only at staging time (a book you regret importing would keep eating quota).
  **Not done:** the merge base is the stored import, not the baked bundle — importing on a
  browser with nothing imported still puts the built-in books behind what you tick, and the panel
  says so rather than pretending otherwise.

- **D87 (2026-08-27) A character is a CARD its versions live in, and the switcher's actions are
  pinned** — the popover grouped by character with a small uppercase divider above each run, which
  reads as a separator rather than as the thing the versions belong to. Each character is now its
  own panel: name at reading size in ink with its version count, versions inside it, and the active
  build's tint stops at the card's edge instead of bleeding to the popover's. Underneath, the list
  scrolls and **New build / Manage builds… are pinned below it**, so they are reachable with two
  builds or twenty — Francesco's call, and it is what made the extra height affordable. *Rejected:*
  a manager-style head with a hairline and versions on a left rail (mocked up and compared side by
  side; compact, but the rail read faint and the grouping stayed weaker than the card's).
- **D88 (2026-08-27) A note that is REFERENCE moves behind a `?`; a note that is STATE stays** —
  the import modal spent five lines on how to get a 5etools zip, three more on what a tick means,
  and two on which JSON files count: the same space on the hundredth visit as the first. Reference
  prose now sits behind a `?` in line with its header. It is a **disclosure, not a hover popover**,
  because these notes carry links and code the reader has to be able to click, and `attachTip`
  vanishes on mouseleave. What stays visible is anything that changes with the build or warns about
  the action in front of you — the "nothing imported yet" line, the wizard's copied-in count, the
  Magical Secrets cap. The Magical Secrets note split along exactly that seam: the live half on the
  card, the D76 weighting explanation on a popover on the meter that states it. *Rejected:* one
  rule for every note (Francesco: "depends on the instance"); tightening the prose in place with no
  popovers (the removal warning has to stay long, and had nowhere to go).
- **D92 (2026-08-27) A library is scanned BY BOOK, one file at a time — the folder is the unit,
  not the zip** — a homebrew repository is filed by **category** (`spell/`, `class/`,
  `collection/`…), so one brew's content scatters across folders and a *collection* brew keeps its
  spells in `collection/` — which is why **D&D Beyond Drops** could not be found by browsing
  (`collection/D&D Beyond; D&D Beyond Drops.json`, 8 spells + 10 feats). **Or scan a folder** walks
  every `.json` once, keeps only a book index (name, creator from the `Author; Brew.json`
  filename, per-type counts, which files), and **throws each parsed file away** — peak memory is
  the largest single file (6 MB), not the library (316 MB / 1,314 files / 1,549 books, ~2 s local).
  The list is **flat and search-first** with **grouping tools** (every book · by creator · by what
  it holds) — Francesco's call. Ticking re-reads **only the ticked books' files** and hands them to
  the normal staging flow, so D86's "Your books" panel and Apply still decide what is stored;
  `planFromStage` gained an `only` argument so books riding along in the same file are **not**
  kept. Reached two ways: `showDirectoryPicker` where it exists, with the handle **remembered in
  IndexedDB** and re-granted on Rescan (permission never survives a reload — a lost folder says so
  and offers the picker), and a `webkitdirectory` input everywhere else. `_img/` is skipped and
  `zipWanted()` is reused rather than re-implemented. Two fixes fell out: `buildImport` rejected a
  digest with **no spells or classes**, which killed a legitimate feats-only brew (D&D Beyond's
  Expanded Racial Feats), and `renderSourceChecklist` gained an `opts` argument (group labels,
  group order, row order) so this list **is** the shared checklist (D83) rather than a fork.
  *Rejected:* grouping by creator or content as the primary shape (search wins at 1,000 rows);
  File System Access as the only path (Chromium-only); importing everything scanned (316 MB has
  nowhere to go — localStorage is ~5 MB).
- **D91 (2026-08-27) A zip that can't work says why, and the lookup file is chosen by NAME**
  — chasing "the homebrew zip won't import" turned up one UX failure and one silent data bug.
  ① **The zip.** A GitHub "Download ZIP" of `TheGiddyLimit/homebrew` is **gigabytes** (the repo is
  5.3 GB, mostly artwork); a complete 5etools `data` export zips to **24 MB**. `stageZip` echoed
  the browser's raw `NotReadableError`, whose stock text blames *"permission problems"* — it is
  size, not permissions. Now: a hard refuse above 512 MB naming the file's measured size, a
  translated out-of-memory message, **ZIP64 detection** (past 4 GB or 65,535 entries the count and
  directory offset are sentinels, so the old reader walked to garbage and called a valid archive
  "not a .zip"), and the progress callback `unzipJsonFiles` had always accepted but **no caller
  ever passed** — a 186-file unpack now reports every file instead of looking like a hang.
  ② **The lookup.** TWO files in an export are lookup-SHAPED: `generated/gendata-spell-source-lookup.json`
  (keys lowercased — what extract.py reads) and `spells/sources.json` (ORIGINAL case). Last one
  won, and it was `sources.json`, whose keys missed the lowercase spell map entirely: **every zip
  import produced 936 spells no class could cast.** The named file is authoritative now and keys
  fold on use. ③ The import warning fired on "no lookup file staged" — false for homebrew, which
  carries access inline (D58) — so it told every brew importer to add a file they don't need. It
  counts **spells nothing can reach** instead. *Rejected:* raising the size cap instead of refusing
  (no cap makes a 5 GB archive openable); merging both lookup files (duplicate access entries).
- **D90 (2026-08-27) App icon / favicon — "Secret book" (Delapouite, game-icons.net, CC BY 3.0)
  on the parchment-on-accent tile** — Francesco's pick "**for now**" from an 8-candidate
  comparison rendered at 16/32/48 px in the app's palette (`scratchpad/icon-compare.html`).
  Delivered as a **data-URI SVG favicon inline in `src/index.html`** (rounded #8a3324 tile,
  #f4f1ea glyph — survives all three builds with no build.py change, keeps dist self-contained)
  plus `docs/apple-touch-icon.png` (180 px, full-bleed — iOS masks its own corners; build.py never
  wipes docs/, so the static file survives rebuilds). CC BY credit added to the footer beside the
  SRD line; glyph source kept at `scratchpad/favicon.svg`. *Rejected:* spell-book (recommended —
  literal name match, but Francesco's call), enlightenment (crispest at 16 px), book-aura;
  gold-on-ink and ink-on-parchment treatments. **Provisional** — "for now" means revisiting is
  fair game, but re-proposing the three rejected icons unprompted is not.
- **D89 (2026-08-27) D39 reaches the spell-PICK modal too** — the printed book left the eligible
  list in D39 but stayed on the rows of the wizard's "copy into your book" and the Magical Secrets
  picker, so two spell lists behaved differently for no reason a reader could infer. It is gone
  there as well; the book lives in the spell modal's title line, one rule for both. *Rejected:*
  keeping it where you are picking (defensible — the book is more interesting mid-pick — but
  Francesco's call was one rule).

### Settled — recorded so they aren't re-proposed
Headline + rejected options only; reasoning → `ARCHIVE.md#rationale` (D7–D41) and
`ARCHIVE.md#v7-decisions` (D43–D80). A `→ Gotcha` marks a rule that is enforced in code and
written up in full under Gotchas below — that is the copy to trust.
- **D43** Every giver in "Choices to make" is a group — one choice and five get the same
  `.choicegroup` treatment. *Rejected:* a flat list with a quiet giver label; an accordion per
  giver (a pending choice can hide behind a fold).
- **D44** A slot's count is a tile in line with its field — origin/general/epic each carry their
  own `n/cap` in three states (`need`/`done`/`over`). Optional-feature slots reuse it.
- **D45** A taken feat is neutral; **red means exactly one thing** — `.chip.unmet`, a prerequisite
  that isn't met. `origin` is gold and `epic` indigo as category tints, never warnings.
- **D46** The species picker groups lineages under their base species (`.entgroup`).
- **D47** The top row and the table header stay **ONE row on a phone** — the tab switch drops to
  short labels before the title is allowed to shrink, and the title never ellipsizes.
  *Rejected:* collapsing the switch to icons (the glyph vocabulary is already spent).
- **D48** Mobile navigation is a **docked jump bar**, not a second level of tabs; the page stays
  one continuous scroll on purpose. *Rejected:* mobile sub-tabs; collapsible cards.
  → its smooth-scroll fallback is a Gotcha.
- **D49** A cantrip's modal says it once — the subtitle carries level+school. Widened by D74.
- **D50** Summon stat blocks live in the spell modal, collapsed, matched by the bestiary's own
  `summonedBySpell` — never by parsing `{@creature}` refs. → Gotcha.
- **D51** A book chip carries a popover (full name, page, code), not a native `title`. Both
  extractors emit `page`. **Use `bookChip()` wherever a printed book is named.**
- **D52** The build switcher lives in the header beside the title, and goes through
  `switchBuild()` so T2's dialog still fires. *Rejected:* burying it in the ⋯ menu (T4 asks for
  it to be visible); replacing the app title on a phone. Regrouped by D87.
- **D54** Level preview: plan at full level, look at any level below it. View-only, never saved;
  multiclass runs through the saved `state.levelOrder`. *Rejected:* versions-as-levels; a true
  level timeline (the standing non-goal). → Gotcha, and D64 settled what it is NOT.
- **D59** The level-order panel is a **single column** of draggable level cards at every width —
  the list is a sequence, and columns break the reading of it. *Rejected:* a `<select>` grid.
- **D60** A level gate is a lock icon + the level, never prose. **Reuse `lockChip()` for anything
  gated on a level.** A label carrying a chip ellipsizes rather than wrapping.
- **D61** The Build/Table switch is a fixed size — each label reserves the width of its own bold
  rendering, so selection changes weight and nothing else.
- **D62** A wizard's spellbook and its prepared list are different sets. → Gotcha.
- **D63** Level cards name **real features**, not derived counts; both extractors emit
  `features:[{level,name}]`. Spellcasting milestones stay a separate accent line.
- **D66** An action button whose label is a **verb** is an icon (`.ico-only`), meaning in the
  popover. *Rejected:* icon + text (the same width back). → the armConfirm ordering is a Gotcha.
- **D67** In "Choices to make" the category is a quiet **subtitle** and the book chip is the only
  tag; a feat also names its own type. Revises D30. *Rejected:* dropping the category.
- **D68** Slots and max spell level are two clocks and a level card shows both. → Gotcha.
- **D69** Species collapse on `base|lineage`, not on name. → Gotcha.
- **D70** A ratio widget may never state an impossible ratio. → Gotcha.
- **D71** A level card's two clocks are tinted tiles on the right edge, present on every card so
  either progression reads straight down; the level that RAISED one takes the full colour. A feat
  is budget you owe, so it leaves the prose for its own gold chip. Supersedes D68's prose lines.
- **D72** A picked spell row gets a **rail, never a fill**. → Gotcha. *Rejected:* a square-cornered
  tint; the spell name going green.
- **D73** Prepare-daily is tabbed by SET (one per re-preparing caster + a **Granted** tab), and its
  chrome hides when it has nothing to do. **Caveat:** the data carries no swappable flag — see the
  backlog item on detecting a real long-rest swap.
- **D74** The spell modal never says the same thing twice; its stat block follows monster-forge
  (creature names the section, monster-forge ability table). Widens D49 to every spell.
- **D75** A version forked from the preview keeps its lineage in its name — `<version> · LV<level>`.
  *Rejected:* the bare level (two forks at the same level collide).
- **D77** A grouping header carries no accent — the ability hues are the table's only colour
  system. *Rejected:* no fill with a rule above; a small-caps label over a hairline.
- **D80** Magical Secrets gets its own picker, scoped to the lists the feature opened (the class's
  own list filtered out), mirroring the wizard's "copy a spell into your book".

- **D7** Source counts in chips — per-source `n/cap` on take chips, red over forecast.
  *Rejected:* counts in the group toolbar.
- **D8** Prepare-daily — one modal step per non-static caster; table's inline prepare removed.
  *Caveat:* the wizard step edits the spellbook (no separate prepared subset in the model).
- **D9** Epic boons — EB is its own slot, gated to level ≥19. *Rejected:* leaving EB in the general list.
- **D10** Always-prepared dedup — a spell always-prepared by a class's own subclass/feature is not
  offered as a prepare option for that same class.
- **D11** Custom spells — a toggleable "Homebrew" (HB) source; class tags drive eligibility.
  *Rejected:* global always-on; per-build only.
- **D15** Zip import — native `DecompressionStream`, manual central-directory walk. *Rejected:* JSZip.
- **D16** Onboarding = modal — the import modal auto-pops on a truly-empty state.
- **D18** Per-spell-level caps for known casters — `capsFor().cap[L]` reconnected; daily preparers
  stay free. *Rejected:* capping daily preparers (not RAW); a fixed per-level quota.
  → the runtime rule lives in Gotchas.
- **D19** Edition de-duplication — `SHADOWED` keeps the highest-ranked printing, `reprint→all`
  reveals the rest. → the runtime rule lives in Gotchas.
- **D20** Wizard spellbook model — a third caster kind with a progressive per-level book cap;
  exceeding it is the legal "copy into spellbook", not an error. *Rejected:* a flat free cap
  (D14-style, wrong for wizards); hard-blocking copies. → the runtime rule lives in Gotchas.
- **D21 / D25** Spell modal Access — who grants it, per category, edition-deduped; collapsed to one
  merged row + ⌄ expander by default.
- **D23** Level lists as ranges — "0;1;2" → "0-2" in grant descriptions, render-time.
- **D24** Grant feature names — extractors correlate `additionalSpells` back to the feature that
  describes it; ~93% named, the rest fall back to the subclass name.
- **D24b** Description sub-heading style = quiet label — muted sans sentence-case `.spttl`.
  *Rejected:* D22's accent-uppercase ("too flashy"; hierarchy was off).
- **D26** Species & feats picker modals — `.picksel` triggers opening a shared `#entityModal`.
  **Three entry points kept**, each pre-scoped to its feat category (Francesco's call).
- **D28** Optional features = every spell-granting type, filtered by source — slots come from
  `optionalfeatureProgression`, so they are data, not per-type code. *Rejected:* invocations-only;
  invocations + pact boons only (Francesco overrode the narrower scope).
- **D29** Spell-table column rework — fixed order, ⋯ column checklist with drag-to-reorder, layout
  is a **global preference**. Both source columns stay always-on (Francesco's override; horizontal
  scroll accepted). *Rejected:* one merged source column; header-drag reordering; per-build state.
  ~~Components cell = cost inline~~ **SUPERSEDED → D32.**
- **D30** Choices grouped by their granting entity, with a category tag on every row/group.
  *Rejected:* grouping by the composed giver label (breaks when an option group renames the giver).
- **D32** Material component moved to a popover — supersedes D29's cost-inline treatment, which
  Francesco picked and then reversed on seeing it. *Rejected:* keeping cost inline.
- **D38** Spell table reads as a grid — columns and contents centred, abbreviations restore on
  hover, the cantrip group note removed.
- **D39** One source-book chip — `.bchip` everywhere a printed book is named; the book leaves the
  eligible-spell rows for the spell modal's title line.
- **D40** Eligibility is a default, not a wall — an "every spell" filter option, and any search
  surfaces near-misses dimmed and tagged with why. *Rejected:* a divider per level group (noise at
  ten groups); making them pickable (they aren't legal).
- **D41** A crossed prerequisite is a one-click fix (species swaps; feats and options are added);
  unverifiable parts carry no "?". *Rejected:* auto-taking the prerequisite on select (silent
  state changes).

### Superseded
- ~~**D14** Level budget = free distribution~~ → **D18.** Free distribution was wrong for
  known/level-swap casters (a Bard learns spells on level-up capped at its top slot); it survives
  only for daily preparers.
- ~~**D22** Sub-heading style = accent uppercase~~ → **D24b.**

## Backlog (next sessions)
- [ ] **Prerequisites we can't check**: ability scores, proficiencies, backgrounds and campaigns
  aren't in the app's model, so those alternatives read "check …" rather than pass/fail. Closing
  this means tracking ability scores — a bigger change than it looks. ⚑ (owner: Francesco, 2026-08-26)
- [x] ~~**Feat budget attribution when categories are crossed**~~ **CLOSED 2026-08-27 → D84** —
  a feat is counted against the slot it was SPENT from (`state.featSlots`), not its category.
- [x] ~~**Ability column** default~~ **CLOSED 2026-08-27** — Francesco confirmed it stays visible.
  It remains hideable in the ⋯ column checklist like any other.
- [x] ~~**Book in the spell-pick modal rows**~~ **CLOSED 2026-08-27 → D89** — removed there too,
  so both spell lists behave the same and the printed book lives only in the spell modal.
- [x] ~~**extract.py ↔ extract.js grant divergence**~~ **CLOSED 2026-08-27** — it was ONE cause,
  not two: `feature: undefined` disappears through `JSON.stringify` where Python writes
  `"feature": null`. extract.js now coerces it. The second claimed cause (TCE Artificer subclass
  spells only JS sees) does not reproduce. The harness diffs grants record-by-record across all
  five arrays **and** reports records only one side has: **0 and 0** on 929 shared records.
- [x] ~~**`page` is not on every book chip**~~ **CLOSED 2026-08-27** — `ownerPage()` resolves a
  choice group's owner back to its record (matching a subclass on `shortName` as well as `name`),
  so the choices card and the prepare modal now carry the page. The **gap dialog was never a gap**:
  its chip names a BOOK, not an element printed on a page, so there is nothing to show.
- [x] ~~**Additive imports**~~ **CLOSED 2026-08-27 → D86** — an import merges by `name|source`,
  and the "Your books" panel is where content is kept or removed. D58's caveat is gone.
- [ ] **Magic-item ingestion for custom sources** — prefill a D55 source from items.json's
  `attachedSpells` (rejected from v1; items carry no structured uses). Needs items in both
  extractors + SRD gate.
- [ ] **IndexedDB** for imported data — localStorage may overflow on a full multi-book import
  (the importer reports quota errors but can't store). Related to T7.
- [x] ~~Importer UI polish — per-source keep/remove, monster-forge style ticking~~ **CLOSED
  2026-08-27 → D86.** A "clear imported data" button is still absent: unticking every book in the
  plan is the equivalent, and it refuses to leave you with nothing.
- [x] ~~Wizard prepare-daily: separate **prepared subset** from the spellbook/known list~~
  **CLOSED 2026-08-26 → D62** — `chosen[idx].prep` is the daily subset, drawn from the book.
- [ ] **Custom sources UI redesign** — Francesco: "still a UI mess, let's do a dedicated back and
  forth design session". The MODEL (D55/D65) stands; this is the surface. It is the **next
  action**, ahead of T7.
- [ ] **Polymorph / Shapechange / True Polymorph as creature sets** — Francesco: "technically a
  spell with multiple stat block options, but perhaps it would require full monster catalogue".
  Correct: their filters are open-ended (any Beast of CR ≤ your level, any creature of CR ≤ …),
  which is the whole bestiary — 4,458 monsters. D78's carried set is 65. Out of scope until
  there is a reason to ship the catalogue; a CR-capped subset would still be hundreds.
  ⚑ (owner: Francesco, 2026-08-27)
- [x] ~~**Free-cast modifications that are not grants**~~ **CLOSED 2026-08-27 → D85 widened** —
  seven of the ten turned out to GRANT their spell, so D79 already covers them. The three that
  don't (Archfey's *Steps of the Fey* and *Bewitching Magic*, Cleric's *Divine Intervention*) are
  now `CAST_MODS` entries with an empty `drop` and their own `label` — a free cast is a change to
  how you cast something you already have, which is exactly what D85 models.
- [ ] **Detect a real long-rest spell swap in the extractors** — D73's Granted tab lists every
  `kind:"known"` pick because the digest has no flag for "you may replace this on a long rest".
  **Attempted 2026-08-27 and deliberately stopped:** the prose is there ("Whenever you finish a
  Long Rest, you can replace that cantrip…") but it is NOT on the species entry a flat walk
  reaches — it lives inside 5etools' unresolved `_copy._mod` / `_versions` blocks and inside
  TABLE rows. A regex over `entries` finds **zero** matches. Closing this means resolving those
  structures, which neither extractor does. Bigger than it looks. ⚑ (owner: Francesco, 2026-08-27)
- [x] ~~**Cast mods D85 can't scope yet**~~ **CLOSED 2026-08-27** — the grammar gained `optTypes`
  (a spell granted by one of YOUR optional features of that type) and `maxLevel`, so Four Elements'
  *Disciple of the Elements* and the Cleric's level-capped *Divine Intervention* both fit.
- [x] ~~**`scope.giver` is a substring match**~~ **MOSTLY CLOSED 2026-08-27** — a grant row now
  carries `ownIdx`, the class row that produced it, so `scope.cls` matches the class EXACTLY on
  both class-cast and granted rows. The giver-name match survives only as a last resort for a row
  with neither, which is what let a Shadow Sorcerer's Darkness pick up the Shadow Monk's feature.
  Every `spells`-scoped entry also gained an explicit `cls` guard.
- [x] ~~**The merge base is the stored import, not the baked bundle**~~ **WON'T DO 2026-08-27** —
  merging baked under imported would break D86's other half: unticking a book in the plan removes
  its content, and the baked bundle would put it straight back. Fallback-when-nothing-imported is
  the only shape where both contracts hold, and the panel says so. Recorded so it isn't re-proposed.
- [x] ~~Custom-spell **manager**~~ **CLOSED 2026-08-27** — ⋯ → **My homebrew**: every custom spell
  in one list, filterable, with edit and (armed) delete in line. It used to need a build that could
  already cast the spell before you could reach its modal.
- [ ] High Elf true in-table cantrip swap; Human extra-origin restricted to origin cats.

→ closed backlog items: `ARCHIVE.md#closed-backlog`

## Gotchas
- **Content assembly:** `window.__DATA__` (baked) is optional now. `assembleData()` picks
  imported > baked > empty, merges custom homebrew, calls `buildIndexes()`. Indexes
  (CLS_BY, SPELL_BY, …) are `let`, rebuilt on every content change — never captured.
- **extract.js ↔ extract.py** must stay in sync (same digest shape). `asArr`/coerced
  `parseGrants` handle 5etools bare-value-instead-of-list quirks.
- **`foundry*.json` is the single most damaging file class in a 5etools zip, and it bit for
  real (D82).** extract.py never reads them (it globs `spells-*.json` / `class-*.json`
  explicitly), but the importer's `zipWanted()` excluded only `foundry-*.json` — so
  `spells/foundry.json` (319 stubs), `class/foundry.json` (12 classes + 19 subclasses) and
  `bestiary/foundry.json` (11 monsters) all sailed through and **overwrote real records by
  `name|source`**. Symptom: a spell modal with a level, school, range, components, duration and
  description all blank, and an import report reading 39 classes / 341 subclasses instead of
  27 / 315. Fixed on the name (`startsWith("foundry")`) plus a `migrationVersion` guard, since
  that field marks a Foundry stub and no real record carries it.
- **A parity harness must drive the REAL predicates.** The old `scratchpad/cparity.js` rolled its
  own file filter that happened to be STRICTER than `zipWanted()` — which is exactly how the bug
  above hid through two sessions of "parity is exact". It now imports `zipWanted` and
  `dropFoundryStubs` from extract.js and asserts on the record that broke. Parity is **exact**:
  936 spells, 27 classes, 65 monsters, 276/276 feats, 213/213 optional features, prereqs
  byte-identical.
- **Spell-source lookup** (`generated/gendata-spell-source-lookup.json`) is what gives spells
  their `cls`/`sub`/`feat`/`race` access — without it imported spells match no class.
  **And a second file in the export is lookup-SHAPED: `spells/sources.json` (D91).** Same
  `SOURCE → Spell Name → {class…}` structure, but keyed in ORIGINAL case where the generated one
  is lowercased and the spell map is keyed `name|source` lowercase. `looksLikeLookup()` matched
  it by shape and, arriving later, it **overwrote the real lookup** — so every zip import shipped
  936 spells no class could cast, while extract.py (which loads the generated file by explicit
  path) stayed correct. A name match now LOCKS (`lookupNamed`) and keys fold through `spellKey()`
  on use. **This hid for two sessions because `cparity.js` diffed grants but never ACCESS** —
  exactly the "a parity harness must drive the REAL predicates" lesson, a second time. The harness
  now diffs `cls`/`sub`/`feat`/`race` per spell and asserts the with-access COUNT against
  extract.py; reintroduce the bug and it reports 921 diffs. If imported spells ever match no
  class again, look here first.
- **A brew's own `_meta.sources` outranks its `book[]` entries (D92).** A collection brew may carry
  `book` records that REUSE its source code for sub-products: "D&D Beyond Drops" ships four, all
  map bundles. `book[]` was applied first and overwrote unconditionally, so the last one won and
  eight spells filed themselves under **"D&D Beyond Drops—Sewer Maps"** in group `other` — off the
  "Homebrew & UA" shelf and effectively unfindable. `_meta.sources` now runs FIRST, records the
  code in `brewSrc`, and `book[]` may not rename anything in that set.
- **The folder scan must reuse `zipWanted()`, never its own filter (D92).** Same rule the zip
  reader learned the hard way. It also skips `_img/` at the WALK (the FSA path) and by
  `webkitRelativePath` (the input path) — a synthetic entry list bypasses both, so a test that
  fabricates entries is not testing the filter.
- **A remembered directory handle is not a granted one (D92).** The handle survives in IndexedDB;
  the READ PERMISSION dies with the session and can only be re-requested inside a user gesture.
  `folderUsable(h,ask)` takes `ask=false` on the silent recall in `openImport` and `true` in the
  Rescan click. If it fails, forget the handle and offer the picker — never fail silently.
- **A big zip fails as a lie (D91).** `file.arrayBuffer()` on an oversized archive throws
  `NotReadableError`, whose stock message blames *"permission problems"* — the cause is size.
  `stageZip` refuses above `MAX_ZIP` (512 MB) by measured size, translates the OOM, and passes the
  progress callback. Reference: a full 5etools `data` export ≈ **24 MB / 503 files**; the homebrew
  repo as one zip is **gigabytes** and can never work — individual brews are ~60 KB.
- **`innate` has two shapes.** `{"_": {"daily": {...}}}` (a cadence map) AND
  `{"_": ["mage armor|xphb"]}` (a bare list = at-will). The list form was skipped by an
  `isinstance(dict)` guard, silently dropping **42 grant blocks** (23 optional features,
  9 subclasses, 9 species, 1 class). Both extractors handle both now — if grants ever go
  missing, check this first.
- **Artificer infusions grant no spells at all**, so they're out of D28 by construction; the
  **2024 Artificer (EFA) has no `optionalfeatureProgression`**. Don't go looking for either.
- **Homebrew source = "HB"**; auto-enabled on boot when custom spells exist.
- **SRD subset** = entities with 5etools `srd52` truthy (extract.py `_srd_subset`). All 12
  XPHB classes are srd52. Public data is inlined in the committed `docs/index.html` (CC-BY, fine
  to be public); `data-srd.json` itself is gitignored. **Keep the credit footer** for CC-BY.
- **Level budget model (D18/D20):** known/level-swap casters (`static` — Bard, Sorcerer) have a
  *progressive* per-level ceiling from `capsFor().cap[L]` (= max spells at level ≥ L); tiles show
  live room addable at each level, and `overLevels[L]` flags a level over. Daily preparers
  (`static=false`) are free — only the total + max castable level bind. **The wizard spellbook is
  its own third kind**: `known.cap[L]` is progressive too (from the `spellbook` growth array, no
  swap term), and exceeding a level's cap is **not an error** — it's the legal "copy into
  spellbook", shown in accent, not red. Enforcement everywhere is soft (flag, no hard block).
- **Edition dedupe (D19):** `SHADOWED` (WeakSet, rebuilt each `buildIndexes`) hides duplicate
  editions of the same element; `reprint→all` reveals them. HB never participates. **Species do
  NOT key on the name** (D69) — a lineage gets renamed between editions (`Elf (High)` →
  `Elf — High Elf`), so `raceDedupeId()` keys on `base|lineage` with the base word stripped off
  the lineage. Widen that normalization carefully: it is the only thing keeping the SCAG/MTF
  variants and the Kaladesh/Zendikar settings from collapsing into the XPHB lineages.
- **Prerequisites are advisory (D31).** `prereqState()` returns ok/maybe/no; "maybe" means the
  app can't verify (ability scores, proficiencies, backgrounds). Never turn "maybe" into "no" —
  it would hide legal picks. Nothing is ever blocked or auto-removed, only flagged.
- Grants tree `{fixed, picks, expansions, optionGroups, ability}`; path-based choice ids stable.
- Cart/choices keyed by stable row id (`state.nextRowId`), never array index.
- **Column layout is global**, under its own key `spellForge.table.v1` — NOT part of the build
  blob. Adding a column means adding it to both `TABLE_COLS` and `COL_ORDER_DEFAULT`;
  `loadTableOpts` appends unknown-but-new keys so an old saved order doesn't hide a new column.
- **Builds layer (T1–T3, D33–D35).** `spellForge.builds.v1` =
  `{activeId, order, builds:{id:{meta,state}}}`; `spellForge.sources.v1` is the **global** book
  list — `SRC`, a module-level Set, **NOT `state`**. Nothing may put sources back inside a build.
  `save()` = auto-save the active build. `meta.character` is a grouping label only (level-free,
  auto-follows until `meta.named`), and grouping happens **at render time** — never build a
  character object. Legacy `spellForge.v2` is read once for migration and then left alone as a
  rollback — do not delete it before v7 ships.
- **Build manager (T3).** `#buildModal` from the ⋯ menu. `switchBuild()` flushes the outgoing
  build with `save()` first, then `applyState()`. `deleteBuild()` must never leave zero builds;
  it creates a fresh one instead.
- **Nothing prunes on a source change (D42).** `afterSourceChange()` only fixes the filter
  override; `pruneState()` drops refs to content that no longer EXISTS. If a pick ever disappears
  when you untick a book, something has re-added pruning. The visible contract is the gap banner
  (`renderGapBar`), `.gapped` fields, and the activation dialog (`#srcAskModal`, which asks about
  `buildGaps().books` — **not** `meta.sources`, which would list 40+ irrelevant books). Keep all
  three in sync with any new pick kind.
- **A `<select>` must always contain its own current value.** `classOptions(keep)` and the
  subclass list take the row's key so a hidden entry stays selectable; without that the browser
  silently selects option 0 and the next edit writes the wrong class into the build. The same
  class of bug had `refreshSpecies()` clearing `state.speciesKey` outright.
- **Picker book overrides can widen** past the global source list. Committing a pick from a
  globally-disabled book **enables that book**, so the pick is visible in the surface you just
  used rather than immediately flagged. The spell filter's override can only narrow.
- **Dimmed spell rows (D40)** carry `dim:true` and a `why`, and have **no takers** — `mkSpell`
  returns early for them, so they can never be picked. If a dimmed row ever grows a take button,
  that early return has been broken.
- **`.bchip` vs `.srcbadge`** — `.bchip` (D39) names the **printed book**; `.srcbadge` names
  **who grants** the spell in your build and is colour-coded (free / cast). They look similar and
  are not interchangeable.
- **Native scrollbars follow `color-scheme`, not your CSS.** The "light scrollbar in dark mode"
  bug was a missing `color-scheme` on `:root`. It is now set in all three theme blocks (`:root`
  light, the `prefers-color-scheme:dark` block, `[data-theme=dark]`), plus themed
  `::-webkit-scrollbar` rules. **Any new theme block must set it too.**
- **Carets are drawn, not typed.** `⌄` (U+2304) sits wherever its font puts it, which is what made
  picker/access icons read as off-centre. `.pk-caret` and `.acc-toggle` draw a border chevron
  nudged up by `s·√2/4` (the ink of a rotated square lives in its lower half). Reuse that pattern
  rather than a glyph when an icon must sit optically centred.
- **Static preview cache:** editing `src/index.html` needs a hard reload (query-bust) — a plain
  reload serves stale HTML and new `$("#…")` lookups return null. Editing it also re-opens a
  `file://`/`data:` preview tab and fronts it — drive the `http://localhost` tab.
- **A top-level function may not call a closure local.** `cellFor()` (top level) called
  `slotCastable`, a `const` inside `renderTable()` — so the whole Spell table threw
  `ReferenceError` for any build holding a limited-use innate cast (a `1/LR` species grant is
  enough). It shipped. `slotCastable` is module scope now; check this shape when a helper moves.
- **`prepared`/`known`/`expanded` have THREE shapes, like `innate` does** — a bare list, a
  cadence map, and a **class-requirement group map** (`{"_":[…]}` = no requirement). The group
  form fell through to `spell_ref()` as a raw dict and silently discarded its `choose` filter:
  25 grants read "a spell" with no filter, High Elf's Wizard cantrip among them. `ungroup()` in
  both extractors handles it. **Same failure mode as the `innate` gotcha above — check it first
  when a grant is unfiltered or missing.**
- **Summon stat blocks (D50)** come from the bestiary's own `summonedBySpell` field, never from
  parsing `{@creature}` refs. 24 spells carry one. `sb_text`/`sbText` expand the tags whose
  meaning is in the tag NAME (`{@h}`, `{@atkr}`, `{@actSave}`, `{@hit}`) **before** `rich_strip`
  reaches them — that is why `flatten_entries` takes a `strip` parameter. `_srd_subset()` strips
  a non-SRD stat block off an SRD spell. The importer's `slimJson()` keeps only summon monsters
  from a bestiary file; without it a full bestiary would reach localStorage.
- **The mobile jump bar (D48) must not use `behavior:"smooth"` alone.** Some embedded webviews
  accept the call and never scroll — and CSS `scroll-behavior:smooth` on `html` breaks even a
  plain `scrollIntoView` there. `jumpTo()` asks for smooth and jumps after 180 ms if nothing
  moved. Its button set is rebuilt only when the section list changes, so `bar.dataset.sig`
  must be **cleared** whenever the bar is emptied (switching to the table tab) — otherwise
  coming back finds a stale match and renders nothing.
- **Native `confirm()`/`alert()` are banned (D53)** — they silently no-op in embedded webviews
  (confirm returns false with no dialog). Destructive actions use `armConfirm()`. If a button
  ever "does nothing", check for a reintroduced native dialog first.
- **Icons are `ICONS`/`icoEl`/`xBtn` only (D57)** — never a glyph in `textContent`. Static
  markup uses `data-ico` + boot `fillIcons()`. `<option>` elements are the one exception
  (no markup allowed inside). Sizing lives in CSS per context, not in the SVG.
- **The dev server sends `Cache-Control: no-store`** (serve.py) — the old "hard-reload after
  editing" gotcha is gone, but an already-open TAB still runs old code until one reload; a
  cached-before-the-change browser needs one `fetch(url,{cache:'reload'})` bypass.
- **Preview (D54) is module state, never saved.** Every level consumer must go through
  `effLevel(row)` / `charLevel()` — reading `row.level` directly leaks full-level numbers into
  a preview. `state.levelOrder` normalizes through `classLevelPlan()`; never trust it raw.
- **Custom sources (D55)** synthesize a grants object (`customSourceGrants`) and ride
  `resolveGrants` with tok `x<id>` — they must never grow their own downstream path.
- **Homebrew import**: books come from `_meta.sources` (group "brew"), spell access from the
  spell's INLINE `classes` field. Both only ADD to what the generated lookup knows.
  ~~An import replaces the previous one — stage core + brews together.~~ **Void since D86:** an
  import MERGES, so a brew can arrive on its own long after the core data.
- **`attachTip()` must be called AFTER an element's own `onclick`** — it used to overwrite the
  handler outright, which silently disabled the preview's "order…" button. It now preserves an
  existing handler; `detachTip()` clears a reused node's stale tip.
- **An empty stored import must not beat the baked data.** `assembleData` took `IMPORTED||BAKED`,
  so a digest that stored but held nothing left `DATA` empty and popped the welcome importer over
  a build that had been working. Content beats presence now.
- **A list whose height changes under a fixed control must pin that control.** The creature
  carousel holds `nav.getBoundingClientRect().top` across the repaint and adds the delta to the
  modal's scroller. Any in-place swap under a control needs the same, or the control moves out
  from under the cursor.
- **A `<button>` may not contain a `<button>` — the parser HOISTS the inner one out.** This has
  now bitten twice: the build-switcher row (caught while building it) and the stat block head,
  where nesting the book icon inside the head button threw the icon AND the chevron out of the
  header onto their own line. Any header that carries its own controls must be a `div` row of
  sibling buttons, with the label part `flex:0 1 auto; min-width:0` + ellipsis so the TEXT gives
  way and the controls never wrap.
- **A nested action button must stop its click** — `xBtn` does. If a handler re-renders, the
  original event keeps bubbling and hits the *freshly attached* parent handler: dismissing the
  level preview immediately re-armed it that way. Watch for this in any rebuild-on-click.
- **Preview is a VIEWER (D64).** Per-level loadouts are versions ("save as version"), not
  per-pick stamps. Do not reintroduce `atLevel` on picks without solving retraining intervals.
- **A wizard has two sets (D62):** `chosen[idx].spells` is the spellbook, `chosen[idx].prep` is
  today's prepared subset. Anything that reads "what is prepared" must branch on
  `cart.known.book`, or it will treat the whole book as prepared.
- **Custom sources (D65)** synthesize grants via `customSourceGrants` + `resolveGrants` (tok
  `x<id>`), EXCEPT `mode:"list"`, which widens the eligible pool instead. Per-grant extras
  (DC, attack, fixed cast level) ride through `spellOut`'s `extra` argument.
- **`.tk.over` must not eat `.tk.on` (D72/D79).** A selected take chip on an over-budget class
  used to render entirely red, because `.tk.over` follows `.tk.on` at equal specificity — which
  is why selection "sometimes didn't highlight". Selection owns the **border and the icon**;
  `.over` owns the text. `.tk.on.over` restates the green border after both.
- **Two extractor tables are hand-authored and must stay in lockstep (D79):** `PROSE_GRANTS`
  (features that grant spells in prose with no `additionalSpells` — Mystic Arcanum and friends)
  and `MOD_RE` (the sentences that become a grant's `note`). Both exist in extract.py AND
  extract.js, plus **`CAST_MODS`** (D85). `scratchpad/gparity.js` is **gone** — `cparity.js`
  absorbed it and now diffs grants record-by-record across all five arrays, cast mods, the feat
  `catName` histogram, the category-exclusive list and the note count. It reports **0 diffs and
  0 one-sided records**; the "pre-existing RHW walker-scope difference" recorded here was
  `feature: undefined` vs `null` in extract.js, and is fixed.
- **The audit that found these:** two sweeps over the mirror — ① features whose prose names a
  `{@spell}` the digest doesn't grant (mostly false positives: "Spellcasting" prose lists example
  spells), ② features with NO `additionalSpells` whose prose says "choose … spell" or "cast …
  without expending". Sweep ② is the one that matters; rerun it after any 5etools update.
- **A creature set is `sp.creatures` (keys) + `DATA.monsters` (blocks), never inlined (D78).**
  `spellCreatures(sp)` = the spell's own summon block, then every carried monster whose book is
  on. `carried_monster()` in extract.py and `carriedMonster()` in extract.js **must stay
  identical** — the Node harness in `scratchpad/cparity.js` diffs both sides and must report
  `diffs=0`. An import built before D78 carries no `monsters`, so `assembleData` keeps the BAKED
  map underneath it; **per-spell `creatures` cannot be back-filled — a re-import is needed.**
- **A ratio widget may never print a denominator below its numerator (D70).** Being over a shared
  TOTAL drives every per-level `room` negative at once; clamping that at 0 produced "4 of up to 0".
  `free` (real room) and `ceil` (what is displayed) are separate values now — `free` still drives
  the over/copied states, `ceil` floors at what is held.
- **A row highlight must not fight its own divider (D72).** A rounded background behind a row with
  `border-bottom` cuts the rule at the corners. `.sp` picked rows use an inset `::before` rail; the
  padding that holds it is on EVERY row so selection never shifts the layout, and the rail insets
  vertically so adjacent picked rows don't merge into one bar.
- **Slots and max spell level are DIFFERENT clocks (D68).** Max spell level comes from a class's
  OWN level (`maxLvlAt(caster,classLevel)`); slots come from the COMBINED caster level
  (`planSlots()` over the whole level plan, or `R.mcSlots`). Deriving one from the other is what
  put the slot gain on the wrong level card. Anything new that reports "what this level gave you"
  must read both, separately.
- **An icon-only button that ARMS needs its icon appended BEFORE `armConfirm`** (D66) —
  `armConfirm` snapshots `innerHTML` as the restore state, so arming an empty button and
  disarming it leaves it blank. Same call order rule as `attachTip` after `onclick`.
- **A `position:fixed` child escapes an ancestor's `overflow` clip — that is the fix, not a hack.**
  The build switcher's row menu lived inside `#bswPop`, which is `overflow:auto`, so it was cut off
  (batch 9). It is `position:fixed` now, placed from the button's own rect and **closed on the
  popover's `scroll`**, because a fixed element does not travel with the list under it. `closeMenu`
  and Escape both call `closeBswMenus()`. Reuse this shape for any menu inside a scroller.
- **A `<button>` may not contain an `<input>` either** — the switcher's row was one big button and
  could not hold the name field, exactly as it could not hold the ⋯ button. It is a `div` with
  `tabindex`/`role="button"` and its own Enter/Space handler; `nameInput()` stops propagation so a
  keystroke never reaches the row.
- **A name field's `onblur` must not re-render the control the next click is travelling to.**
  Committing a rename in the switcher calls `afterBuildMeta(false)` — header and manager only.
  Re-rendering the popover there would destroy the ⋯ button between mousedown and mouseup, so the
  click never lands. Only the character rename (which can regroup rows) passes `true`.
- **Feat category ≠ feat slot (D84).** `featCatId`/`featCatLabel` are the book's own label;
  `featSlot` is what it can be spent from; `featSlotOf(key)` is what it WAS spent from
  (`state.featSlots`, validated against `SLOTS_FOR` on read, so a stale record can't misattribute).
  Every budget count goes through `featSlotOf` — never through the category. `SLOTS_FOR.general`
  is `["general","origin"]`: **origin is a subset of general**, and anything that re-narrows it
  puts Wild Talents and Dragonmarks back out of reach at an ASI.
- **Cast mods are resolved per RENDER, not cached across one (D85).** `CASTMODS` is refreshed at
  the top of `render()` AND `renderClassRows()` AND `refreshAll()`, because `#addClass`'s handler
  calls `renderClassRows()` without `refreshAll()`. `modsForSpell(sp,row)` needs the ROW to know
  which class is casting; with no row (the spell modal) it falls back to the spell's own class
  list. A mod carrying `when` may only MARK a component, never strike it — that distinction is
  the whole honesty of the feature.
- **`CAST_MODS` is the third hand-authored extractor table** (after `PROSE_GRANTS` and `MOD_RE`)
  and must stay identical in extract.py AND extract.js — `scratchpad/cparity.js` diffs it, plus
  the feat `catName` histogram, the category-exclusive list and the grant-note count. Run it after
  ANY extractor edit.
- **An import merges; a book's NAME must survive the merge (D86).** A file that references a
  source it doesn't declare emits the bare code as that book's name and `other` as its group, so a
  plain `Object.assign` turned "Test Book A" back into "TSTA" on the next import. `mergeSources()`
  keeps a real title over a placeholder. Entities are keyed by `name|source`
  (`className|shortName|source` for subclasses, which also collapses the 124 genuinely duplicate
  subclass records the mirror emits, 322 → 198).
- **A stat block is filtered by the SPELLS that reference it, never by its own book (D86).** A
  bestiary source (MM, XMM, IDRotF…) never reaches the source registry — it has no spells or
  classes to count — so keying `filterDigest`'s monster pass on `keep` dropped 63 of 65 creatures
  and emptied Find Familiar's carousel. `out.spells[].creatures` is the only correct gate.
- **History purge:** old data-bearing commits are unreachable on origin but GitHub may still serve
  them by exact SHA until it gc's. `backup/pre-purge-20260826` (local) has the original.

## Shipped
- v6 / v6.1 — runtime content layer, custom spells, importer, Pages deploy, SRD embed, zip import.
  → `ARCHIVE.md#v6`
- v6.5 / v6.6 — innate-cast fixes, optional features, prerequisites end-to-end, column rework,
  shared source checklist, unified feat picker. → `ARCHIVE.md#v65`
- v7 · T1–T5 — saved builds end to end: storage + migration, activation reconciliation, the
  manager, the header switcher, and export/import as files.
- **v7 note batches 1–10** (2026-08-26 → 2026-08-27) — **D43–D89**. Ten batches of notes plus two
  bug hunts on top of the tasks. Per-batch narrative → `ARCHIVE.md#v7-batches`; the earlier notes
  → `ARCHIVE.md#v7-notes`. The load-bearing outcomes are the decisions above and the Gotchas
  below — this list used to restate them a third time.
