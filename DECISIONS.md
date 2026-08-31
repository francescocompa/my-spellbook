# DECISIONS — My Spellbook

> Every choice this project has made, and what was rejected. `D-id · date · headline ·
> rejected options`. A strike-through with `→ D-id` is a supersession, never a deletion.
> Rationale for D7–D80 lives in `ARCHIVE.md#rationale` and `ARCHIVE.md#v7-decisions`;
> a rule marked **→ Gotcha** has its enforced-in-code copy in `GOTCHAS.md`, which is the
> version to trust.
>
> Moved out of `STATE.md` on 2026-08-27 (v1.1) — STATE is the resume block, this is the
> record. Nothing was dropped in the move.
>
> **Compressed 2026-08-31 (`/clean`).** An entry ending `→ body: ARCHIVE.md#…` keeps its
> headline, its model sentence, every *Rejected:* clause and its clause letters here; the
> narrative, the measurements and the verification evidence moved, verbatim, to
> `ARCHIVE.md#d81-d96-bodies` (the importer / custom-source / feat-category era),
> `#print-family-bodies` (D97–D109), `#library-bodies` (D110–D113) and
> `#phase-refinement-bodies` (D116, D119–D125, D133, D134). Nothing was deleted.


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
  → the runtime rule lives in `GOTCHAS.md`.
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
  would touch every budget check, the whole UI and the export format. ~~Versions already do this
  correctly and already export. The preview stays a viewer.~~ **The save-as-version mechanism
  and the viewer-only preview are SUPERSEDED → D115(i,d); the core — no per-pick stamps — is
  REAFFIRMED by D115(b,h)** (per-level truth is an order, sliced, never a stamp).
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
  D42 to D78's creature sets: `spellCreatures()` never drops forms whose book is off, and the
  carousel's own **book panel** lists every book in the set with its count and marks the ones off in
  your Sources. Its controls sit BELOW the block — you read the creature, then step. *Rejected:* the
  `<select>` book filter it replaces (it sat in the head and could only narrow to one book at a
  time). → body: `ARCHIVE.md#d81-d96-bodies`

- **D82 (2026-08-27) The importer rejects Foundry payloads by name AND by marker** — `zipWanted()`
  drops the un-hyphenated per-directory `foundry.json` too, and on top of it `dropFoundryStubs()`
  strips any entity carrying `migrationVersion`, a Foundry-only field. **Anyone who imported before
  this must re-import** — the corrupt records are already in their localStorage. *Rejected:*
  filtering only by `migrationVersion` (the name test also saves parsing three large files);
  detecting the corruption at boot and warning (machinery for a one-off).
  → body: `ARCHIVE.md#d81-d96-bodies`

- **D83 (2026-08-27) One book checklist, everywhere** — the carousel's book filter is the shared
  grouped checklist (D27), seeded from the global Sources list but **local** (ticking never writes
  back), with an optional per-source count label so it can count *forms* instead of spells. Two
  fixes ride it for **every** checklist: `GROUP_NAME`/`GROUP_ORDER` gained 5etools'
  `supplement-alt`/`setting-alt` groups, and the carousel's controls are **pinned** across a repaint
  so a taller creature never shoves them under the cursor. → body: `ARCHIVE.md#d81-d96-bodies`

- **D84 (2026-08-27) A feat's CATEGORY is a book's own label; its SLOT is what it can be spent
  from — and origin is a SUBSET of general** — both extractors emit `catName` (known code →
  `_meta.featCategories` → the raw value); the app derives the slot (`EB`→epic, `FS*`→fighting
  style, `G`/absent→general, **anything else→origin**) and builds the picker's toggle row from the
  categories actually present. The **general** picker offers origin-slot feats too (Francesco's
  call), so budget is attributed to **the slot it was spent from** (`state.featSlots`), not the
  category; category exclusivity ("no other Dragonmark feat") became a **real check**. *Rejected:*
  treating unknown categories as origin-only (correct for Dragonmarks and Dark Gifts, wrong for Wild
  Talents, which the UA explicitly also allows at an ASI); a hand-maintained category→slot map in
  both extractors (precise, but every new UA that invents a category would need a code change and a
  re-import). → body: `ARCHIVE.md#d81-d96-bodies`
- **D85 (2026-08-27) A feature may change HOW you cast a spell you already have, and an
  unverifiable condition marks rather than strikes** — a hand-authored `CAST_MODS` table (like
  `PROSE_GRANTS`, identical in both extractors) attaches `{feature, level, scope, drop,
  exceptCostly, when, note}` to the class/subclass, `scope` being `{cls, schools, spells, giver}`;
  the app resolves what is live at your level and marks the affected components in three places —
  a chip under the class row, the table's Comp. column, the spell modal. **`when` is the honest
  half**: a condition the app cannot verify marks the letter with a dotted underline and never
  strikes it through. *Rejected:* a note with no computation (the table would still print V/S/M that
  don't apply to you); covering feats, species and optional features with their own scope table
  (mostly already served by grant notes, for a much bigger authored table).
  → **widened 2026-08-27:** `scope` gained `maxLevel`/`optTypes`, entries gained `label`, an empty
  `drop` is a free cast, and a grant row carries `ownIdx` so `scope.cls` matches exactly.
  → body: `ARCHIVE.md#d81-d96-bodies`
- **D86 (2026-08-27) An import ADDS, and ONE list decides what is in your data** —
  `mergeDigests()` merges by `name|source` (a staged file wins only over its own exact record) and
  what ends up stored is chosen in a single **"Your books"** panel, where a tick means "this is in
  my data". Unticking a book **removes its content** — the only way to get storage back — while
  picks that referenced it are kept and surface through the gap machinery (D42/D56), never deleted.
  Nothing is written until **Apply**, which names the delta and turns red when it would remove
  something; the list carries its own filter, and All / None act on what the filter is showing.
  *Rejected:* two panels, one for staging and one for what is loaded (monster-forge's shape — but
  "keep or remove" is one question, so it is one list); ticking only at staging time (a book you
  regret importing would keep eating quota). **Not done:** the merge base is the stored import, not
  the baked bundle, and the panel says so. → body: `ARCHIVE.md#d81-d96-bodies`

- **D87 (2026-08-27) A character is a CARD its versions live in, and the switcher's actions are
  pinned** — each character is its own panel (name at reading size with its version count, its
  versions inside it, the active build's tint stopping at the card's edge); underneath, the list
  scrolls and **New build / Manage builds… are pinned below it**, so they are reachable with two
  builds or twenty. *Rejected:* a manager-style head with a hairline and versions on a left rail
  (mocked up and compared side by side; compact, but the rail read faint and the grouping stayed
  weaker than the card's). → body: `ARCHIVE.md#d81-d96-bodies`
- **D88 (2026-08-27) A note that is REFERENCE moves behind a `?`; a note that is STATE stays** —
  reference prose sits behind a `?` in line with its header, as a **disclosure, not a hover
  popover**, because these notes carry links and code the reader has to be able to click and
  `attachTip` vanishes on mouseleave. What stays visible is anything that changes with the build or
  warns about the action in front of you. *Rejected:* one rule for every note (Francesco: "depends
  on the instance"); tightening the prose in place with no popovers (the removal warning has to stay
  long, and had nowhere to go). → body: `ARCHIVE.md#d81-d96-bodies`
- **D96 (2026-08-27) A custom source may grant a CHOICE, not only a named spell** — some items
  give you a spell picked from one or more lists, re-chosen on a long rest (Silverquill Primer);
  5etools models none of it, so the shape can only be hand-authored. An entry is now **either a
  named spell (`key`) or a choice (`pick`)** — `{take, level, class, school}`, empty meaning *any* —
  and rows are keyed by `key||id`. The filter is three wrapped chip rows in the row's disclosure,
  **because empty-means-any is the same grammar `filterSpells` reads**; a pick reads as its rule in
  the row and as English in the summary. *Rejected:* exposing only level+class (Francesco's call —
  school is free, `filterSpells` already supports it); a separate "choices" section apart from the
  spell list (one list, two kinds of row, is how the source actually reads).
  → **widened same day:** a choice also carries **`pick.swap`** — WHEN you may re-choose, a
  **different clock** from how often you may cast (chosen once / long rest / short rest / dawn / on
  level up, defaulting to long rest). It rides the **desc**, so it reaches the **Choices panel** —
  the one place you are actually deciding. → body: `ARCHIVE.md#d81-d96-bodies`
- **D95 (2026-08-27) HOW a spell is paid for belongs to the SPELL, and some uses never come
  back** — two gaps D65's model couldn't express. ① **One source, several budgets:** a source now
  simply **has a charge pool or doesn't** (`pool` blank = none) and each spell carries
  **`pay:"pool"|"per"`**; the source-level select is gone, because it would start lying the moment
  one spell differed. ② **Uses that never reset:** a new **`total`** unit ("3 times total", "once
  only"). **Legacy sources are read, never rewritten in place** — `csrcPay()` falls back through the
  old `uses` enum, and the editor normalises on open and on save. *Rejected:* keeping `uses` as a
  source-level DEFAULT with per-spell overrides (same expressive power, but the rule line and the
  chip would describe a shape the rows contradict); telling the user to make two sources for one
  item (breaks the chip, the summary and "one item is one thing").
  → `rechargeShort()` had to learn the new unit too: Gate rendered as a bare **"—"**, which reads as
  *no limit* — the exact opposite of once-ever. → body: `ARCHIVE.md#d81-d96-bodies`
- **D94 (2026-08-27) The custom-source editor is PROGRESSIVE — the name and the spells are the
  surface, everything else folds, and the foot says what you built** — settled against three mockups
  rendered in the app's own stylesheet (`scratchpad/csrc-mockups.html`). Name + kind, then **one
  rule line** stating what the source is with a **Change** button; then the spells; then
  **"Spellcasting stat" folded**, its label carrying the state so a fold can never hide something
  you changed; then a **live summary sentence** at the foot, because the model is subtle enough to
  build something you didn't mean. **Scope: the modal only** — the MODEL (D55/D65) is untouched.
  *Rejected:* B, the whole form as an editable sentence (most distinctive, hardest to keep tidy as
  the model grows); C's two-pane layout and its always-visible toggles (that density is what made
  this a mess); reworking the card's chips or the casting surfaces (not what was complained about).
  → **refined 2026-08-27 on Francesco's review:** mode/uses became two labelled `<select>`s, unit
  controls are fixed-width with short labels, and a per-spell **note** rides the grant as `note`
  (D79's path renders it). → body: `ARCHIVE.md#d81-d96-bodies`
- **D93 (2026-08-27) Imported content lives in IndexedDB; only the LOAD and the SAVE are async**
  — one database `spellForge`, store `kv` for content and `handles` for D92's directory handle.
  **`assembleData()` stays synchronous**: boot fills `IMPORT_CACHE` first and every existing caller
  is untouched; the whole boot block moved inside an async IIFE so nothing decides anything early.
  Migration reads the legacy key, writes it to IndexedDB and **only then** removes it. A private
  window that refuses IndexedDB falls back to localStorage and says so. **Closes T7.** *Rejected:*
  moving builds/sources/table layout too (kilobytes, and sync access is worth keeping — with the
  digest gone they have the whole quota to themselves); storing the digest as a JSON string in
  IndexedDB (a structured value skips a multi-MB string held twice at save time).
  → body: `ARCHIVE.md#d81-d96-bodies`
- **D92 (2026-08-27) A library is scanned BY BOOK, one file at a time — the folder is the unit,
  not the zip** — a homebrew repository is filed by category, so one brew's content scatters across
  folders. **Or scan a folder** walks every `.json` once, keeps only a book index (name, creator,
  per-type counts, which files) and **throws each parsed file away**, so peak memory is the largest
  single file. The list is **flat and search-first** with grouping tools; ticking re-reads **only
  the ticked books' files** into the normal staging flow (`planFromStage`'s `only`), so D86's panel
  and Apply still decide what is stored. Reached via `showDirectoryPicker` (handle remembered in
  IndexedDB, re-granted on Rescan) or a `webkitdirectory` input. *Rejected:* grouping by creator or
  content as the primary shape (search wins at 1,000 rows); File System Access as the only path
  (Chromium-only); importing everything scanned (316 MB has nowhere to go — localStorage is ~5 MB).
  → body: `ARCHIVE.md#d81-d96-bodies`
- **D91 (2026-08-27) A zip that can't work says why, and the lookup file is chosen by NAME** —
  ① a hard refuse above 512 MB naming the file's measured size, a translated out-of-memory message,
  **ZIP64 detection**, and real per-file unpack progress. ② TWO files in an export are
  lookup-SHAPED: `generated/gendata-spell-source-lookup.json` (lowercased keys — what extract.py
  reads) and `spells/sources.json` (ORIGINAL case). Last one won, and it was `sources.json`: **every
  zip import produced 936 spells no class could cast.** The named file is authoritative now and keys
  fold on use. ③ The import warning counts **spells nothing can reach** instead of demanding a
  lookup file homebrew doesn't need (D58). *Rejected:* raising the size cap instead of refusing (no
  cap makes a 5 GB archive openable); merging both lookup files (duplicate access entries).
  → body: `ARCHIVE.md#d81-d96-bodies`
- **D90 (2026-08-27) App icon / favicon — "Secret book" (Delapouite, game-icons.net, CC BY 3.0)
  on the parchment-on-accent tile** — Francesco's pick "**for now**" from an 8-candidate comparison
  (`scratchpad/icon-compare.html`); a data-URI SVG favicon inline in `src/index.html` plus
  `docs/apple-touch-icon.png`, with CC BY credit in the footer. *Rejected:* spell-book (recommended
  — literal name match, but Francesco's call), enlightenment (crispest at 16 px), book-aura;
  gold-on-ink and ink-on-parchment treatments. **Provisional** — "for now" means revisiting is fair
  game, but re-proposing the three rejected icons unprompted is not.
  → body: `ARCHIVE.md#d81-d96-bodies`
- **D89 (2026-08-27) D39 reaches the spell-PICK modal too** — the printed book left the eligible
  list in D39 but stayed on the wizard's "copy into your book" rows and the Magical Secrets picker;
  it is gone there as well, and lives in the spell modal's title line, one rule for both.
  *Rejected:* keeping it where you are picking (defensible — the book is more interesting mid-pick
  — but Francesco's call was one rule). → body: `ARCHIVE.md#d81-d96-bodies`

### Settled — recorded so they aren't re-proposed
Headline + rejected options only; reasoning → `ARCHIVE.md#rationale` (D7–D41) and
`ARCHIVE.md#v7-decisions` (D43–D80). A `→ Gotcha` marks a rule that is enforced in code and
written up in full in `GOTCHAS.md` — that is the copy to trust. Entries from D97 on carry their
own `→ body:` pointer where their reasoning was archived by the 2026-08-31 `/clean`.
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
  → its smooth-scroll fallback is in `GOTCHAS.md`.
- **D49** A cantrip's modal says it once — the subtitle carries level+school. Widened by D74.
- **D50** Summon stat blocks live in the spell modal, collapsed, matched by the bestiary's own
  `summonedBySpell` — never by parsing `{@creature}` refs. → Gotcha.
- **D51** A book chip carries a popover (full name, page, code), not a native `title`. Both
  extractors emit `page`. **Use `bookChip()` wherever a printed book is named.**
- **D52** The build switcher lives in the header beside the title, and goes through
  `switchBuild()` so T2's dialog still fires. *Rejected:* burying it in the ⋯ menu (T4 asks for
  it to be visible); replacing the app title on a phone. Regrouped by D87.
- **D54** Level preview: plan at full level, look at any level below it. ~~View-only, never
  saved~~ **SUPERSEDED → D115(d,e)** — the level view is editable and the current level is saved;
  multiclass still runs through the saved `state.levelOrder`. *Rejected:* versions-as-levels; a
  true level timeline (the standing non-goal, narrowed by D115(b)). → Gotcha, and D64 settled
  what it is NOT.
- **D59** ~~The level-order panel~~ **SUPERSEDED → D115(j)** — the surface moves into the
  timeline popover; the rule transfers: the level sequence is a **single column** of draggable
  rows at every width — the list is a sequence, and columns break the reading of it.
  *Rejected:* a `<select>` grid.
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
  → the runtime rule lives in `GOTCHAS.md`.
- **D19** Edition de-duplication — `SHADOWED` keeps the highest-ranked printing, `reprint→all`
  reveals the rest. → the runtime rule lives in `GOTCHAS.md`.
- **D20** Wizard spellbook model — a third caster kind with a progressive per-level book cap;
  exceeding it is the legal "copy into spellbook", not an error. *Rejected:* a flat free cap
  (D14-style, wrong for wizards); hard-blocking copies. → the runtime rule lives in `GOTCHAS.md`.
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
- **D97 (2026-08-27)** A slot count has a **fourth** state, `none` — dimmed and dashed, for a cap
  of **0**; `budgetPill()` carries it too. Revises D44: a zero cap fell through to `need`, so
  nothing owed read as urgently due. *Rejected:* printing "—" instead of `0/0` (the column reads
  down; the ratio is true, only its urgency was wrong); hiding the tile (its absence would read as
  a missing feature). → body: `ARCHIVE.md#print-family-bodies`
- **D98 (2026-08-27)** Print is **always the spell table**, whichever tab is on screen, over a
  brief build summary that identifies it — Francesco's call: the Build tab is a set of controls, the
  sheet you carry to a session is the spell list. A `.printhead` filled on `beforeprint` names the
  character, version, level, classes and species and calls out a level preview; `beforeprint` also
  re-runs `renderTable()`, and `renderTable` gained a real `thead`/`tbody` so column names repeat on
  every page. *Rejected:* printing whichever tab you are on (the first cut — the Build tab printed
  as a form with controls flattened out of it, and needed a page of CSS to look like a document); a
  purpose-built play sheet (a third rendering of the same rows to keep in sync).
  → body: `ARCHIVE.md#print-family-bodies`
- **D99 (2026-08-27)** The published build **installs and runs offline**; `dist/` and `src/` never
  register a worker. build.py writes `manifest.webmanifest`, `sw.js` and the icon set into `docs/`
  alone, registration is guarded on `__PUBLIC__`, and caching is **stale-while-revalidate** with a
  build-stamped cache name — an update is deliberately one reload behind, because the alternative is
  a 1 MB blocking download every time the app opens. *Rejected:* network-first (defeats the point on
  a phone at a table); cache-first with no revalidation (a deploy would never reach anyone); an
  "update available" banner (new UI for a gap that closes itself on the next load) — **that last one
  was reversed → D137(d)**, which raises exactly such a notice on `controllerchange`.
  → body: `ARCHIVE.md#print-family-bodies`
- **D100 (2026-08-27)** A source's own numbers state only what the spell actually **rolls** —
  `ownNumbers(sp,dc,atk)`: the save DC when the spell forces a save, the attack bonus when it needs
  an attack roll, both only when it needs both. One helper, used by the table's Ability column and
  by the per-spell rows in Slots & casts, so the two panels cannot disagree; a **choice** row names
  no single spell, so there both still stand — an unverifiable case must not read as "there is none"
  (D31). *Rejected:* showing the numbers only in the tooltip (they are the reason that column exists
  for an item); dropping the row's ability chip when a source has its own numbers.
  → body: `ARCHIVE.md#print-family-bodies`
- **D101 (2026-08-27)** The sheet's anatomy is **summary → tracker → table → cards → notes**, and
  the tracker is **boxes, not counts** — on paper a slot count is the one thing you cannot mark off
  mid-session. It covers each spell slot, Pact Magic on its own line, each limited innate cast, and
  each item's charge pool as **one** row; box counts read `rechargeShort()`'s output rather than
  re-parsing cadence strings, so the tracker cannot disagree with the Casts column. Optional **all
  preparable spells, unticked** prints every spell a *daily* caster could prepare (level-swap
  casters and wizards skipped). → body: `ARCHIVE.md#print-family-bodies`
- **D102 (2026-08-27)** Optional **spell cards** print the full rules text of every spell on the
  sheet as a two-column appendix, and the table's spell names are **same-document links** into them
  — which is what a PDF turns into clickable internal navigation; each card links back to its first
  row. *Rejected:* compact cards (they truncate exactly the spells that needed one); one card per
  page-width (half the sheet spent on unreadable line lengths).
  → body: `ARCHIVE.md#print-family-bodies`
- **D103 (2026-08-27)** Print options live in a **remembered modal** (⋯ → Print / save as PDF…) —
  colour, page orientation and five toggles — and the modal states what the current settings will
  cost, counted through the same code path that builds the sheet. The **PDF filename is the build
  name** (`document.title` swapped on `beforeprint`, restored on `afterprint`), and everything below
  the summary is **built on `beforeprint` and torn down on `afterprint`**, so ⌘P takes exactly the
  same path as the button. *Rejected:* options in the ⋯ menu (five toggles and two selects is a
  form, not a menu); a print-only route that ⌘P bypasses.
  → body: `ARCHIVE.md#print-family-bodies`
- **D104 (2026-08-27)** Grouping by source groups by **where it came from**, and a subclass, a
  class feature and an invocation all came from the class — Light Domain is not a source separate
  from Cleric. Every grant resolved inside a caster's loop is tagged with that caster's row
  (`srcIdx`), and an optional feature is tagged by which class's progression opened the slot it
  fills; only a genuinely separate source — a feat, an item, your species — keeps its own group. The
  Source **column** still names the specific giver; the folding is the group header only.
  *Rejected:* a hand-kept list of "class-ish" source names (wrong the moment a book invents a new
  feature type). → body: `ARCHIVE.md#print-family-bodies`
- **D105 (2026-08-27)** A summon spell's stat blocks print, but only the forms this character
  **marks** — a star in the stat-block header, stored in the build so it travels with an export
  (D55's rule); marked forms also lead the carousel. A spell with exactly **one** form prints it
  unmarked (marking the only option is a chore, not a choice); a multi-form spell with nothing
  marked prints a line saying how to mark them. *Rejected:* printing the first N forms (the first is
  alphabetical, not yours); a global favourites list (a familiar belongs to a character).
  → body: `ARCHIVE.md#print-family-bodies`
- **D106 (2026-08-27)** The printed sheet is **hairlines only** — a row rule, a heading rule, and
  nothing else, because paper already has edges. The tracker's slots and per-class numbers are
  **tables**, not flex rows, so nine slot levels plus Pact sit in one row of columns at any width
  without shrinking the boxes below a tickable 3 mm; past **6** uses the boxes become a ruled field
  and a `/N` total. Each caster gets **blank ruled fields for spell attack and save DC**, which the
  app cannot compute and must not guess, and the **legend** prints only the marks the sheet actually
  uses. *Rejected:* the per-class numbers in the group headers (they only exist when you group by
  source; the block is always there and always right). → body: `ARCHIVE.md#print-family-bodies`
- **D107 (2026-08-27)** Printing a daily caster's **whole** list means preparing on paper from
  scratch, so every one of that class's preparable rows gets the same empty box — marking today's
  picks differently states a decision the sheet exists to let you re-make. Cantrips,
  always-prepared grants and innate casts keep their own marks; a level-swap caster is untouched.
  The two write-in fields are **boxes, not rules**. → body: `ARCHIVE.md#print-family-bodies`
- **D108 (2026-08-27)** The PDF's **filename and internal links belong to the browser's own
  export**, and nothing in the page can substitute for either: the name comes from `document.title`
  at print time and the links from same-document anchors (verified — 79 forward, 75 back, none
  broken). Chrome and Safari honour both; an in-app PDF writer may ignore them, and the print modal
  says so. *Rejected:* generating the PDF in-page (a bundled PDF library, for a file the browser
  already knows how to make); UA-sniffing the host. → body: `ARCHIVE.md#print-family-bodies`
- **D109 (2026-08-27)** A **feature** can add forms to a familiar spell, and those forms are yours,
  not the spell's. The bestiary's `summonedBySpell` links a monster to a SPELL and cannot express
  "this feature widens that list", so D50's rule (never parse `{@creature}` refs off a spell) does
  not reach the case: both extractors emit `forms:[{spell,creatures,mode}]` on feats and optional
  features, parsed narrowly (the sentence must name **forms** and carry `{@creature}` refs, and the
  record must reference a spell). At runtime the grant is live only while you hold the feature;
  granted forms are exempt from the stat-block book filter and rank **second in the carousel, after
  your marked favourites**; `mode:"only"` replaces the list instead of widening it. *Rejected:* a
  hand-authored table in app.js (it would cover what I happened to write down, and the extractors
  are where content gaps are filled — PROSE_GRANTS and CAST_MODS set the pattern).
  → body: `ARCHIVE.md#print-family-bodies`

- **D110 (2026-08-27)** **The Library: one surface, two panes.** The import modal and the Sources
  modal merge into one **Library** modal with a tab bar — **Sources** (the everyday on/off list) and
  **Manage** (import, refresh, remove: the rare and destructive work). One toolbar **Library**
  button replaces both old entry points; onboarding opens straight to Manage. The split keeps a free
  visibility toggle from sitting next to a storage-destroying untick. *Rejected:* a full one-list
  merge (both states on one row is a trap without heavy row design); two sharpened modals (the
  two-door confusion only shrinks); stacked sections (recreates today's long scroll, Apply below the
  fold); drill-in (cleanest Sources but hides Manage, and Refresh must stay discoverable).
  → body: `ARCHIVE.md#library-bodies`
- **D111 (2026-08-27)** **Refresh imported data = one click, then report.** Re-reads the
  remembered folder (or asks for input when there is none), re-parses with the **current**
  extractor, re-imports exactly the books already kept, and reports a summary plus a **parser
  version stamp** — the stamp answers "did the new parser actually run", and D137/D138 build on it.
  Sits in the Manage bottom row next to Apply, with a ⋯-menu shortcut. *Rejected:*
  review-before-apply (an extra step on an action that only replaces same-key records); silent
  auto-refresh on version change (permission re-grant needs a user gesture, and a background
  re-parse is a surprise); a record-level diff in the report (a deep compare pass for a line that
  reads as noise). → body: `ARCHIVE.md#library-bodies`
- **D112 (2026-08-27)** **Manage pane: one drop zone, one book list, parse on arrival.** The drop
  zone takes a **.zip, JSON files, or a whole dragged folder**; the *click* path stays two verbs
  ("browse files… · choose folder…") because the native dialogs differ, and paste-JSON folds behind
  a disclosure. Files **parse on arrival** — the "Read staged files" click is gone, nothing is
  stored until Apply. The folder-scan picker and "Your books" merge into **one three-state list** —
  kept · new · available in the scanned folder — reconciled by one Apply, with a storage total in
  the footer. Onboarding is the Manage tab plus a welcome banner. *Rejected:* folder-first or
  zip-first hierarchy (superseded by the universal zone); keeping pick-then-plan (a third list); the
  explicit read step; a dedicated welcome screen (a second surface that drifts); no storage info.
  → body: `ARCHIVE.md#library-bodies`
- **D113 (2026-08-27)** **Sources pane: edition-first groups, actions behind the search bar.**
  Groups become **2024 core · 2014 core · Supplements · Settings & adventures · Homebrew & UA ·
  Other** — the 2024/2014 split is an **app-side display remap** of the 2024 codes, not an extractor
  change, so already-imported digests regroup without a re-import. The pane gains the shared search
  field, Enable all / Disable all move into a compact menu beside it, and "2024 core only" is a
  group header's all-tick now. **Bestiary-only books (XMM, MM…) stay invisible in every book list**
  — stat blocks follow the spells that reference them and the carousel builds its own book filter.
  *Rejected:* making bestiary books first-class registry entries (the D107 trap in reverse — both
  extractors, the carousel filter and the gotcha would all rework for display value); merging
  alternates only; a flat searched list (loses the shelf feel); extra edition preset buttons.
  → body: `ARCHIVE.md#library-bodies`

- **D114 (2026-08-28)** **An Epic Boon is a feat you take WITH a feat slot, not a bonus pick, and
  the slot's CHARACTER level is what qualifies it.** The old rule was one line —
  `epic = charLevel()>=19 ? 1 : 0` — which got single-class 20 right by luck (ASIs at 4/8/12/16
  plus the class-19 Epic Boon feature) and multiclass wrong three ways: it handed a boon to a
  build with no feat slot anywhere near 19 (Fighter 10 / Wizard 9 gains slots at character 4, 6,
  8, 14, 18 and none after), it capped at one a build whose slots land on **both** 19 and 20
  (Francesco's Warlock 4 / Fighter 4 / Bard 12 — slots at 4, 11, 15, **19**, **20**), and it made
  the boon **additive**, offering six feats to a character who has five. Every Epic Boon feat in
  the corpus carries `prereq: "level 19"` — a character-level test — and both the ASI feature and
  the class-19 Epic Boon feature read "…or another feat of your choice for which you qualify", so
  they are one pool. `featSlotLevels()` now walks `classLevelPlan()` and returns the **character**
  level each feat slot arrives at (class levels 4/8/12/16, plus Fighter 6/14 and Rogue 10, plus
  class level 19); `general` is all of them, `epic` is how many landed at 19+, and the general row
  counts boons among what it has spent (`slotsUsed`). The epic row now appears on **holding such a
  slot**, not on being level 19. Enforcement stays soft (D31): the caps flag, they never block.
  → Gotcha. *Rejected:* keeping the two pools separate and merely raising the cap (it would still
  invent a feat the character does not have); counting boons by class level 19 alone (correct for
  single-class, but it denies the level-19/20 ASIs that legally qualify).
- **D115 (2026-08-28) DECIDED — a build works at every level: LEVEL IS A PARAMETER, VERSIONS ARE
  ALTERNATIVES.** Mechanism: design session, AskUserQuestion × 5 rounds + 2 mockup iterations
  (2026-08-28). Trigger stands as recorded: D114 made the level order load-bearing, and the old
  preview was "weak level-by-level tools" whose only save path was a version copy. The model:
  - **(a) Jobs.** One build usable at any level · track a live character · reference/print at any
    level. *Not picked:* legality-validation as a goal of its own (it arrives as a by-product of
    (f)). Raw note: *"keep the variant as true alternative builds variants, while level becomes a
    'slider' or parameter and a build can be viewed at any given level below its top level."*
  - **(b) The non-goal narrows, not dies.** "No level-by-level timeline" now means **no AUTHORED
    timeline artifact**. Per-level truth comes from an **acquisition ORDER** — the existing
    `state.chosen`/`state.feats` array order made meaningful — normalized like `classLevelPlan()`
    (no invalid state), sliced at any level; the timeline is a **derived view**. *Rejected:*
    per-pick `atLevel` stamps (D64's objections stand — reaffirmed, not superseded); app-derived
    best-case loadouts (the L5 view would be the app's guess, not the character; kills jobs a/b);
    linked LV-version careers (manual upkeep, edits at 20 never reach the L5 copy).
  - **(c) Sticky picks only.** Known spells, spellbook entries, feats, fixed choices carry
    per-level truth; daily-prepared lists stay freely derivable at every level (D18). *Rejected:*
    recording prepared lists (records what the rules let you change daily).
  - **(d) The slider is EDITABLE at any level.** Standing at L7, a new pick inserts at L7's slice
    point; upper views inherit it. Raw note: *"it should detect inconsistencies so that they can
    be fixed at any level maintaining overall build consistency on the D&D character building
    ground rules."* *Rejected:* view-only lens (the very weakness that triggered this);
    append-only editing (a live swap still forces a jump to top).
  - **(e) A build saves its CURRENT level** and opens there; the plan above stays intact.
    *Rejected:* ephemeral scrub only.
  - **(f) Consistency = build-wide sweep + badge.** Every level slice is checked (pick counts vs
    class tables, spell level available at acquisition, boons on 19+ slots, choices available when
    features arrive); one badge names the offending levels; per-level flags when standing there.
    Soft throughout (D31). *Rejected:* per-level-only flags; an on-demand check action.
  - **(g) Retraining = swap-at-level-up only ~~(one swap per level)~~** **→ one swap per KIND
    per level since D128** (a level may carry a leveled-spell trade AND a cantrip trade).
    A level event carries a swap (−X +Y) where RAW grants one; the wizard spellbook is
    add-only. *Rejected:* add-only with removal-erases-history (lies to jobs a/c);
    full per-pick intervals (exactly the cost D64 priced — not justified).
  - **(h) Mapping is a PURE SLICE, no pins.** Order + each class's acquisition schedule fully
    determine every level; off-schedule acquisitions belong to custom sources. *Rejected:*
    per-pick level pins (stamps by the side door).
  - **(i) Fork replaces save-as-version.** `savePreviewAsVersion` is repurposed to **fork a
    VARIANT here** — an alternative branching at the slice, truncated and named as such. Existing
    "· LV5" copies stay ordinary variants (no migration); printing at a scrubbed level becomes
    first-class (the "not a saved version" print note goes). *Rejected:* removing forking; keeping
    the level/variant double meaning.
  - **(j) Surface = chip + timeline ~~POPOVER~~** **→ a full MODAL since D122(a)** — its own
    raw note anticipated it; the chip and everything else in (j) stands.
    (mockup round; chosen over a full-width level rail,
    cards-as-scrubber, and a rail+cards hybrid — the chip-and-popover is the app's own language,
    D57/D66). Chip reads "L7 / 20" + ⚠; the popover is a jumpable timeline: zone tinting
    (history · current pin · plan), **draggable rows absorb level-order editing and retire the
    D59 panel** (its single-column rule transfers), **pick chips on rows** draggable between rows
    to move acquisition, swap pills, footer actions *fork a variant here* · *set as current
    level*. Raw notes: *"we can consider turning it into a proper modal if it features too many
    details and interactions"* · *"picks acquisition still needs another control in the app"*
    (acquiring stays in the spell browser; chips only reorder).
  Supersedes: D54's view-only/never-saved clause → (d)/(e); D59's panel → (j); D64's
  save-as-version mechanism → (i) (its versions-not-stamps core is reaffirmed by (b)).
  Enforced by: prose + PLAN.md phase E task lines; once built, the E4 sweep is the guard.
  Affects: PLAN.md (phase E), CLAUDE.md + STATE.md non-goals wording, src/app.js when built.
- **D116 (2026-08-28) Audit-batch dispositions** (two-lane audit, AskUserQuestion × 2 rounds; the
  fix-safe findings needed no decision and shipped in v1.2.2 — `CHANGELOG.md` lists them):
  - **(a) The public build renames the 17 product-identity spells** to the licensed SRD names
    5etools carries in `srd52`; the full local digest keeps real names. *Rejected:* dropping the 17
    from the subset; accepting the license risk.
  - **(b) `clearImport` is wired**, not deleted — a red armed "Remove imported data" row in the
    Library's Manage footer. *Rejected:* deleting the dead code.
  - **(c) UA/prerelease books fold into "Homebrew & UA"** (`srcGroupOf` remap). *Rejected:* a sixth
    "Prerelease (UA)" shelf.
  - **(d) `save()` skips identical writes**, so `meta.updated` means last EDITED. *Rejected:*
    stamping only from mutating call sites (one missed site lies the other way); relabeling to
    "opened".
  - **(e) An item's own DC/attack print in the source GROUP HEADER** when the table groups by
    source — the numbers are per-source constants, the header is their altitude. *Rejected:*
    un-suppressing the Ability column; accepting.
  - **(f) The gap banner is sticky and the gapped pick chips carry the flag** (D42's visible
    contract at both altitudes). *Rejected:* auto-scrolling the column; accepting.
  → body: `ARCHIVE.md#phase-refinement-bodies`
- **D117 (2026-08-28) Versioning is MAJOR.MINOR.PATCH; the past is mapped, never rewritten.**
  Raw note: *"the versioning convention is moving the .X number too fast, we should make the
  versions 1.0.0, keep the first number for overhauls or massive reworks, the second number
  only for larger batches with features, and the third for smaller day to day fixes and
  batches. Rename the past commits in line with this as well. I am not expert in versioning,
  so I'll also accept your input and feedback on this."* Implemented: `bump.py` defaults to
  patch, takes `--minor` for feature batches, keeps `--major` gated on Francesco. On the
  invited feedback, **"rename the past commits" is honored by RETRO-TAGS + the CHANGELOG map,
  not a history rewrite** — the repo's SHAs are load-bearing (STATE/ARCHIVE/memories, the
  purge episode) and the pre-1.0 line set the precedent: tag in place. Map: 1.0→1.0.0,
  1.1→1.0.1, 1.2→1.0.2, 1.3→1.1.0, 1.4→1.1.1, 1.5→1.1.2, 1.6→1.1.3, 1.7→1.2.0, 1.8→1.2.1;
  the audit batch ships as 1.2.2. Release tags resume from v1.2.2 (Francesco's call,
  reversing the CHANGELOG-only recommendation). Enforced by: `bump.py`; `CHANGELOG.md` is
  the map's single owner. Affects: CLAUDE.md Versioning, CHANGELOG.md, bump.py, VERSION.
- **D118 (2026-08-28) DECIDED — THE GUIDED BUILDER: a separate coach-driven flow over the D115
  substrate, forward and reverse.** Mechanism: design session, AskUserQuestion × 6 rounds + 1
  mockup round (2026-08-28). Trigger — Francesco's /resume note, raw: *"alongside the option to
  troubleshoot a build at each level, I want to be able to build a character with a series of
  steps that populate the page, perhaps with a series of chained modals, that guides me through
  a level by level character creation and works both from level 1 to X with an empty build or
  from level X to 1 reverse engineering a ready build for lower levels."* The model:
  - **(a) Identity: a separate guided flow** writing the same order/slice substrate the D115(j)
    popover reads — two jobs, two surfaces; D115 stands whole. *Rejected:* a guided mode of the
    timeline popover (reference density can't host step content); wizard-as-primary-surface
    (fights the app's free-form browsing language, D57/D66).
  - **(b) Step mechanics: hybrid coach + page.** The coach states the task; multi-pick decisions
    hand off to the real page pre-filtered to what is legal at that acquisition point. *Rejected:*
    self-contained modal steps (clones the pickers into a modal — duplicate surface, duplicate
    bugs); coach-only (tiny structural choices get heavier than needed).
  - **(c) Granularity: one step per DECISION** ~~one step per decision~~ **→ REVERSED IN PART
    BY D130(c) (2026-08-30)**: a step is now one FEATURE/SOURCE with a section per logical
    group; slot-level addressing lives inside the pick modal. Originally Francesco's call
    against the per-level recommendation. Consequence, accepted into the design: ~60–80 steps for a level-20 build, so
    level milestones are the chain's visible skeleton (steps grouped under level headers) and
    navigation is jump-anywhere, never a forced march. *Rejected:* one step per character level;
    tier grouping (dissolves "what do I get at level 7").
  - **(d) L1 scope: everything the app models** — class, species, origin feat slot. Nothing new
    is modelled: no ability scores, no backgrounds-as-entities (standing non-goal; prerequisites
    stay advisory). *Rejected:* class-only (breaks the promise at step one); full character
    creator (a different app).
  - **(e) Skip policy: everything skippable, soft flags.** The wizard never blocks; open slots
    land in the E4 sweep and badge; class-per-level pre-answers "continue current class".
    *Rejected:* required structural picks; must-complete-per-level (fights D31 throughout).
  - **(f) Direction: BOTH walks, chosen per run.** One engine — "fill slice k's slots from a
    pool" — iterated ascending or descending; the direction is an iteration order, not a second
    engine. Forward-from-empty defaults ascending; reverse mode restricts the candidate pool to
    the build's own picks and asks which walk. *Rejected:* place-only 1→X (recommended, declined);
    peel-only X→1.
  - **(g) Leftovers settle at top, soft-flagged.** Picks never placed (or unfittable) land in the
    top slice and take E4 flags; the wizard never blocks, never deletes (flag-don't-prune).
    *Rejected:* fix proposals inside the wizard (a second legality engine that must agree with
    E4); a holding pen (a pick outside every slice belongs to no level — violates D115(h)).
  - **(h) Order trust: E1's migrated array order is truth, silently.** No "unconfirmed" state
    bit. *Rejected:* a quiet unconfirmed hint on the chip (recommended, declined); blocking level
    views until confirmed.
  - **(i) Entry points: all three.** Start-guided beside start-empty on new builds; guided
    level-up from the current level; reconstruct (reverse) on a ready build. Invocation on an
    existing build: **popover footer ("guide me from here") as primary + a ⋯ menu alias.**
    *Rejected:* shipping a subset; footer-only; menu-only.
  - **(j) Lifecycle: stateless — the build IS the state.** Exiting keeps everything placed;
    re-entry computes the first open slot and resumes. *Rejected:* a stored wizard session
    (persisted shape for a distinction the soft flags cover).
  - **(k) Surface: side coach rail, no modals anywhere.** Desktop: a rail with the whole chain
    visible, grouped under level headers, jump-anywhere, Skip/Back/Next, page candidates
    highlighted "legal now"; phone widths: collapses to a bottom sheet showing the current
    level's group. Structural choices (class, subclass, feat-or-ASI, swap y/n) are answered
    INLINE in the rail. Mockup round: *chose the rail over the docked bar and the bar+overlay
    hybrid, then dropped the structural-choice modal too* — the "chained modals" phrasing in the
    trigger is recorded as the trigger, not the mechanism. *Rejected:* docked coach bar (hides
    the remaining decisions at per-decision granularity); chained structural modals.
  - **Plan: new phase F, strictly after the E8 gate** — F1 step derivation · F2 coach rail ·
    F3 entry points + reverse · F4 fresh-eyes gate; E1–E8 unchanged (F3 adds the one footer
    action). *Rejected:* extending phase E to E9–E11 (E8 would review half a phase); starting F
    after E4 interleaved with E5–E7 (wizard built on unreviewed substrate).
  Supersedes: nothing — D115 stands whole. Enforced by: PLAN.md phase F task lines; once built,
  F4 is the guard. Affects: PLAN.md (phase F), STATE.md next-action framing, src/app.js when built.

- **D119 (2026-08-28) Timeline refinements, direct instruction while E6/E7 shipped.** Raw note:
  *"in the timeline … only display two tiles (highest spell/slots) if they diverge … Also make sure
  this feature supports and makes it easy to swap lower level spells for higher ones, marking the
  state clearly."*
  - **(a) The two casting tiles merge into one ("cast") when max spell level and top slot agree**
    at a row, splitting back into spell + slot exactly where multiclassing (or Pact Magic) pulls the
    clocks apart. *Rejected:* always-two (repetitive at nearly every single-class level); always-one
    (hides the two-clocks distinction D68 exists to keep).
  - **(b) The swap flow is click-to-arm on a timeline chip, take-to-record** — the outgoing pick's
    POSITION keeps its acquisition history and the event carries the trade. *(Eligibility superseded
    → D128: leveled-spell and cantrip trades are separate; the arm-then-take mechanism stands.)*
    States marked: armed chip, ⇄ on picks later traded away, the pill at the swap level. *Rejected:*
    a chip context menu (one action doesn't need one); swap-on-remove prompts in the cart (heavier,
    off the level surface).
  Enforced by: src/app.js (renderTimeline chips, SWAPARM, toggle intercept).
  → body: `ARCHIVE.md#phase-refinement-bodies`

- **D120 (2026-08-28) The stored build and the live state never share objects — `save()` and
  `applyState` both detach.** Found at the E8 fresh-eyes gate: `serializeState()` returned the live
  sub-objects by reference, so after any full save (or boot) D116(d)'s identical-write compare
  diffed an object against itself and skipped every pure pick edit — localStorage silently went
  stale (regression window v1.2.2 → v1.2.9). Fix: JSON round-trip at both boundaries; D116(d)'s
  intent is preserved. *Rejected:* comparing against a cached last-written string (a second cache
  that can drift from what localStorage really holds); dropping the skip and always writing
  (reintroduces the exact restamp D116(d) exists to stop); deep-copying in `serializeState` alone
  (leaves boot's shared identity in place — the first edit after open still self-masks).
  → **Gotcha** (the enforced copy lives in `GOTCHAS.md`). Enforced by: src/app.js
  `save()`/`applyState`. Three E8 side notes were logged, not fixed (`recordSwap()` has no callers;
  a chained swap's chip tip names the wrong level, import-only; Escape with the level picker open
  closes the timeline under it) → body: `ARCHIVE.md#phase-refinement-bodies`

- **D121 (2026-08-28) F1 status semantics: the frontier ignores class steps, and optional steps
  never capture re-entry.** ① `skipped` = unanswered below the frontier, but class steps are
  pre-answered by the plan (D118(e)), so the frontier now tracks the highest level with a done
  NON-class step. *Rejected:* keying the frontier on `state.currentLevel` (conflates D115(e)'s
  "where the character stands" with "how far the answers go"). ② The swap y/n step is
  `optional:true` and `guideResume()` passes it — "no swap" is a legitimate answer the build cannot
  store (stateless, D118(j)), so an unanswered one would trap re-entry forever. *Rejected:* storing
  an answered-no bit (the stored wizard session D118(j) already rejected); dropping swap steps
  entirely (D118(k) names swap y/n a structural choice of the chain). Enforced by: src/app.js
  `guideSteps`/`guideResume`. → body: `ARCHIVE.md#phase-refinement-bodies`

- **D122 (2026-08-29) Timeline refinements v2, direct instruction while F2 shipped.**
  - **(a) The timeline is a FULL MODAL** (standard `.modal` chrome, which also gives it the standard
    ×). The chip anchoring, the rAF scroll re-anchor and the document-level outside-click closer are
    GONE — backdrop click (strict `target===backdrop`), Escape and × close it. → **Gotcha**.
  - **(b) The header sub-note ("click a level…") is removed** — the rows teach themselves.
  - **(c) E7's order-matters word moves into a GOLD FLAG beside the title**, with the reasons and
    the "drag the rows" instruction in its tip; `orderMatters()` is untouched.
  - **(d) Casting tiles appear ONLY at the level that moved a clock, styled as dimmed notes** — the
    tile's presence is the signal, and it can no longer read as a control. *Rejected:* keeping
    per-row tiles in a dimmed state (the repetition was the complaint, not just the weight).
  - **(e) Multiclass run aggregation:** consecutive levels of one class share a per-class coloured
    left rail and close ranks, so a run reads as one block; a drop whose resulting plan is IDENTICAL
    is **not a drop target at all**. *Rejected:* collapsing a run into a single draggable block
    (kills the per-level rows the timeline exists for — picks, flags, tiles live on them); allowing
    the drop and flashing the refuse animation (a control that accepts a gesture only to refuse it
    is worse than one that never lights up).
  Enforced by: src/index.html `#tlModal`, src/styles.css `.tlbox`/`.ordflag`/`.runc*`/`.lt`,
  src/app.js `renderTimeline`/`openTimeline`. → body: `ARCHIVE.md#phase-refinement-bodies`

- **D123 (2026-08-29) Tile semantics + metamagic tags, direct instruction while F3 shipped.**
  - **(a) The merged casting tile reads "spell" in the muted colour** — where the two clocks agree,
    naming the merger ("cast") answered a question nobody asked; ~~split tiles keep their 38% hue
    mix~~ **→ superseded 2026-08-29 (W4)**: Francesco, raw — *"spells, slots, picks, and pact tiles
    should have the same base colors"* — every tile shares the muted base now.
  - **(b) Pact Magic gets its OWN tile, measured as count × slot level** ("2× 2nd pact", neutral),
    shown where either number moves and never merged with the spell clock; `levelCasting` returns
    `{pact,pactUp}` instead of masquerading pact level as a slot level.
  - **(c) Metamagic applicability tags in the Spell table's name cell** (`METAMAGIC_WHEN`, an
    app-side hand table judged from digest fields only, advisory per D31) — ~~in the table~~
    **→ moved into the spell details by D124(c)**; options that touch nearly everything (Subtle)
    stay deliberately absent. *Rejected:* putting metamagic into the extractor `CAST_MODS` table
    (applicability depends on the BUILD's selections, an app-side fact; and D85 mods mark casting
    rules, not opportunity). → body: `ARCHIVE.md#phase-refinement-bodies`

- **D124 (2026-08-29) Timeline separation + pick counts; metamagic placement + palette.**
  Mechanism: mockup rounds (`scratchpad/tl-mockups2.html`, `scratchpad/mm-palette-mockups.html`) +
  AskUserQuestion.
  - **(a) Class separation = run divider labels TOGETHER WITH the rail** — each class block opens
    with a labelled divider ("Bard · L4–L7" + colour dot) AND keeps its coloured left rail, whose
    colour is re-asserted after the zone tints. *Rejected:* inset-bar-only (A); rail-less dividers
    (B alone); coloured L-pills (C).
  - **(b) Pick counts = ghost chips AND a count tile** — open schedule slots render as dashed chips
    (click jumps the view there), a neutral "2/6 picks" tile states wants/has, and the chip row is
    ONE line that bleeds under a right-edge mask and scrolls instead of wrapping. *Rejected:* counts
    in the gains line; ~~labelled "+ spell" ghosts~~ **→ REVERSED 2026-08-29 (W4)**: ghosts read
    "+ spell" / "+ cantrip" now; the bare "+" is gone.
  - **(c) Metamagic lives in the spell details as an Access-style row labelled "Metamagic"** — one
    row under Access, dashed neutral chips with the reason in each tip, rendered only when a
    Metamagic-owning class can take the spell AND a selected option's condition holds; D123(c)'s
    table tags are gone. *Rejected:* meta-line badges (the line is dense and wraps on phones); a
    reasons line above the text (repeats itself once learned); the two-word label ("Your metamagic"
    wrapped).
  - **(d) The palette is P3 EMBER: keep the rust identity, widen the gap** — accent slides to
    terracotta (light #8f4b2b, dark #d9915f), alerts to crimson (light #c1273b, dark #f0616e, print
    #9c1f30), across all five theme blocks; the app icon keeps the old rust (artwork, pre-rendered).
    *Rejected:* **P1 Verdigris** (picked once, then reversed — do not re-propose); **P2 Lapis &
    Gold** (would force the swap/pact violet to move to plum).
  → body: `ARCHIVE.md#phase-refinement-bodies`

- **D125 (2026-08-29) The forward guide clamps its current pick step to the row's FIRST open slot
  — found by the F4 fresh-eyes gate.** The hole: skip an earlier pick slot of a row, jump to a later
  slot of the same row, and the page pre-filtered by the LATER slot's castMax — but a take always
  lands in the row's first open slot (the pick arrays are dense, D115(b,h)), so a legal-looking pick
  could arrive at a slot whose cap it breaks. Fix: `guideSync` retargets a forward, not-done
  spell/cantrip step whose `pos` exceeds the filled count to the same row+kind step at the filled
  count, so the note and cap always describe where the pick really lands. Reverse mode is positional
  placement and needs no clamp. *Rejected:* letting the take honour the clicked slot's position (a
  hole in a dense array is exactly the holding pen D118(g) rejected); filtering by the landing slot
  while leaving `cur` on the clicked step (the rail would highlight one step while the note
  described another). Gate verdict: every other clause of D118(a–k) verified in-browser this
  session. Enforced by: src/app.js `guideSync` clamp.
  → body: `ARCHIVE.md#phase-refinement-bodies`

- **D126 (2026-08-29) DECIDED — THE GUIDED BUILDER BECOMES A FULL-SIZE PAGE (phase G):
  ground-up surface redesign; the D118 model stands, its (k) surface is superseded.**
  Mechanism: interview, AskUserQuestion × 3 rounds + a mockup round
  (`scratchpad/gb-mockups.html`, variants Ledger/Milestone/Dossier). Trigger — Francesco's
  notes, raw: *"the modal has no contrast with the background, especially on mobile. It
  sometimes partially covers the modals it opens. The guided builder could be either a series
  of actual modals or probably even better a full size page (with quick switch to the
  character view). Let's redesign from the ground up through mockup and interview iterations
  … in general, the overall UI has issues: unclear hierarchy, verbosity, bland layout."*
  - **(a) Surface: a full-size page** — the guide is its own view (like Build/Table) with a
    header switch back to the character view. *Rejected:* chained modals (the overview
    shrinks to a stepper; modal-over-modal is the reported bug); reskinning the rail (the
    contrast/collision problems are architectural on phone). Supersedes **D118(k)** only —
    D118(a–j) stand whole.
  - **(b) Layout: Ledger** — chain column left, decision stage right. Francesco's addition,
    raw: *"The chain column on the left could be a lean variant of the timeline modal, with
    also the ability to change order."* So the column speaks the timeline's language (level
    rows, class runs, flags) lean, and row drag-to-reorder works there too. *Rejected:*
    Milestone (level track compresses the 20-level glance); Dossier (chain behind a tap).
  - **(c) Phone: one-tap toggle between the decision view and the chain column** (raw: *"one
    tap to swap between current choices and the timeline/chain column"*) — a full-screen
    page, both directions; the bottom sheet and the whole-chain toggle are GONE (raw:
    *"remove the full chain option, not needed"*).
  - **(d) Class step: current + last-other prominent, compact menu for the rest** — resolves
    the "3+ classes to be decided" flag. *Rejected:* a button per owned class (recommended,
    declined); a chooser modal on every level-up.
  - **(e) Done state: an answered step stays as a green-tinted card; the walk moves only on
    Next/Skip or a chain click** (raw: *"do not jump automatically to next step, but
    highlight the completed state"*) — supersedes F2's auto-advance. *Rejected:* ✓-only
    subtle state; auto-advance after a beat.
  - **(f) Spell/cantrip steps pick in a MODAL, not the page** (raw: *"spells should be chosen
    from a modal, not the page … show a filtered modal with only eligible spells grouped by
    level, but those groups are sorted from highest to lowest"*) — eligible-only, grouped by
    castable level DESCENDING, collapsible groups. Supersedes D118(b)'s page pre-filter for
    pick steps (`#guideNote` retires with it); the D125 first-open-slot honesty carries into
    the modal's cap.
  - **(g) Every choice the build carries is a step that opens its REAL chooser** — feat-granted
    choices (raw: *"magic initiate doesn't let me choose its spells, perhaps all choices to
    make like this are skipped"*) and optional features (raw: *"some options (ex. invocations)
    do not open their modal"*) become first-class steps in the chain.
  - **(h) Swap step: a direct trade card per kind** at each eligible level-up — "Replace a
    spell?" → tap the pick you lose → the modal opens for the replacement → the card shows
    "− X + Y" with an undo ×. Rides the two-kind swap model (spell + cantrip). *Rejected:*
    guided arm-then-take (the two-phase indirection was the complaint); inline out+in
    dropdowns. (raw: *"swapping system isn't intuitive in the guided builder, rework it"*)
  - **(i) Entry: a "Start guided" CTA card on an empty character**, gone once anything is
    answered; the three D118(i) entries stay. *Rejected:* auto-opening the guide (fights the
    browse-first language); hint text only. Back is hidden/disabled when unavailable and
    also reaches the class-pick step (raw notes).
  - **Plan: phase G, strictly after the wave-1/2 merges** (swap model D-batch, general fixes,
    timeline batch) — G1 page shell + chain column (the lean timeline variant) · G2 decision
    stage + structural/choice step cards · G3 pick modals + trade cards + entries · G4 🔍
    fresh-eyes gate. Fresh sessions per model policy. *Rejected:* building today in this
    session (already coordinating three agents); mockups-only with no scheduled build.
  Supersedes: D118(k), D118(b) for pick steps, F2's auto-advance. Enforced by: PLAN.md phase
  G task lines; G4 is the guard once built. Affects: PLAN.md (phase G), STATE.md, src/app.js
  + src/index.html + src/styles.css when built.

- **D127 (2026-08-29) DECIDED — edition identity: resolve `_copy` in both extractors and
  carry the reprint pointer (`supersededBy`).** Mechanism: read-only investigation agent +
  AskUserQuestion. Trigger — Francesco, raw: *"some sorcerer subclasses read as different
  and not direct upgrades between edition (namely aberrant, clockwork, wild magic). Let's
  investigate this issue with all data and let's see if there is a way to identify them
  correctly without hardcoding it."* Findings: `reprintedAs` links all 58 cross-edition
  subclass pairs with zero misses (11 renamed); the bug is that 5etools ships every classic
  subclass a second time as an unresolved `_copy` twin on the 2024 chassis, which neither
  extractor resolves — the hollow twin lands unflagged and (a) 9 duplicate pairs show in
  2024 pickers, (b) 67 classic subclasses vanish from them (dedupe id lacks `classSource`),
  and (c) **73 subclasses resolve to hollow zero-grant records — every 2014 subclass
  granted no subclass spells** (`SUB_BY` keyed without `classSource`, hollow twin wins).
  The fix (option C): resolve same-file `_copy` (shallow merge honouring `_preserve`; all
  124 current copies carry no `_mod`) in BOTH extractors; emit `supersededBy` (first
  `reprintedAs` uid — the field has TWO shapes, string and `{uid,tag}`) on all six record
  types; app-side, `collapseEditions`' subclass id gains `classSource` and the subclass
  lookup becomes class-scoped (stored `subKey` untouched); reprint hiding may consult the
  pointer so a record only hides when its successor is actually installed (D31: unknown
  never reads as excluded). Prerequisite folded in: `cparity.js` keyed subclasses without
  `classSource`, so ~124 of 322 records were never diffed — fixed first so the `_copy` work
  lands tested. Needs ONE re-import of stored digests (D78 precedent) + a data/docs
  rebuild. *Rejected:* **A** app-side twin merge in `buildIndexes` (no re-import, but a
  heuristic hiding a data defect, wrong the day a `_copy` carries `_mod`); **B** resolve
  `_copy` without the pointer (heals the data but the pair still can't read as an upgrade —
  the thing actually asked for); hardcoding the three sorcerer pairs (the premise of the
  investigation). Enforced by: cparity (with the widened keying) after any extractor edit.
  Affects: extract.py, src/extract.js, scratchpad/cparity.js, src/app.js `buildIndexes`/
  `reprintOk`/subclass lookup; data + docs rebuilds; Francesco's per-browser re-import
  (Manual list).

- **D128 (2026-08-29) DECIDED — swaps are per KIND: one leveled-spell trade + one cantrip
  trade per level-up, by the verified 2024 class rules; Wizard's cantrip trade is 1/LR in
  the prepare modal.** Mechanism: Francesco's direct instruction, raw: *"known casters can
  swap 1 leveled spell, but cantrips do not count in this swap. Most classes (check to be
  sure) can swap 1 cantrip on level up (on top of the other swap), while Wizard can swap
  1/LR (add the option to do so in the prepare spells modal. Fix this issue app-wide"* —
  built by the W2 agent, rules verified from the mirror's XPHB class prose (zero `_copy`
  blocks hide XPHB text, so every row is read, not assumed). The table (`SWAP_RULES`,
  src/app.js): level-up SPELL swap = Bard, Sorcerer, Warlock ("of an eligible level"),
  Eldritch Knight, Arcane Trickster — exactly the digest's `static:true` set; level-up
  CANTRIP swap = those five plus Cleric and Druid (their spell cadence is long-rest re-prep,
  the cantrip cadence still level-up); Wizard = cantrip 1/LR only (spellbook add-only
  stands); Paladin/Ranger have no cantrips; Artificer per EFA (flagged, no XPHB text). UA
  "Spell Versatility"/"Modify Spells" confirmed absent from the corpus — never model them.
  Shape: `state.swaps[lv] = {spell?, cantrip?}` — one event per kind, a level can carry
  both pills; old single-event blobs heal at every stored-state boundary (applyState /
  loadBuilds / build import), normalized key order keeps D116(d)'s identical-write compare
  honest. The wizard's prepare-modal trade records at the viewed level (an array edit
  without an event would lie about where the cantrip was learned); re-trading the same slot
  at that level COLLAPSES into the standing event (original out, newest in) — never chains.
  *Rejected:* a new stored field marking rest-cadence events (the pill derives its wording
  from `SWAP_RULES` instead); silently overwriting a standing event (the slice below would
  lie); keying `SWAP_RULES` by name|source (2014 reprints inherit 2024 rules — advisory
  either way, D31, and writing unverified 2014 rows was worse). Known give: a 2014 class
  sharing the name is over-offered the 2024 cantrip swap. Supersedes: D115(g)'s
  one-per-level clause; D119(b)'s eligibility wording (the arm-then-take mechanism stands).
  → **Gotcha** (the E1 line now states per-kind). Enforced by: src/app.js `SWAP_RULES`/
  `swapRule`/`swapNorm` and the per-kind writers; in-browser verified by the agent on an
  isolated origin (migration, both pills on one level, Wizard refusals, guide 2/1/0 steps
  for Bard/Cleric/Wizard, export round-trip, fork rewind of both kinds). Affects:
  GOTCHAS.md E1 line, PLAN W2, the W4 timeline batch (retrain chips ride this shape).

- **D129 (2026-08-29) DECIDED — Refresh from the ⋯ menu runs INLINE with a visible progress →
  outcome; the Library modal opens only when a human is needed.** Mechanism: Francesco's direct
  instruction, raw: *"The refresh import data still leads to the library modal in the menu, and
  once in the modal there is no feedback of it working. In menu, the button should work without
  opening the modal, and should have a loading status into a completed status or alert if it
  didn't work, some way to give feedback. Same feedback applied to the modal."* D111 kept its
  contract (one click, then report, parser stamp) — only the surfaces change. Five states, two
  surfaces: **busy** (both buttons disabled + "Refreshing…", spinner on the `.btn`; from the
  menu the notice bar carries the stage line, from the modal `#importReport` does), **done**
  ("Re-imported N books with parser vX." — a green notice that fades after 9 s, and the report's
  own line), **failed** (red notice + report, modal stays shut — a read or storage error is not
  something the modal can fix), **ask** (the four cases whose fix IS in the modal: nothing
  imported, no remembered folder, permission refused, the folder holds none of your books —
  those open it on Manage and say why in both places), **idle**. The stage line reads the
  pipeline's own `#folderProgress` counters rather than threading a callback through the scan
  and the stage; `RSEEN` keeps a line left over from an earlier scan out. `applyPlan` now
  returns **null or a sentence** (importSave's contract) so the caller can report the outcome
  somewhere other than `rep`. Two false-success holes closed on the way: a stage that read
  **nothing** — a folder gone stale — used to fall through to `applyPlan`, which re-stored the
  digest you already had under a NEW parser stamp and reported "Re-imported N books"; the same
  went for a `buildImport` that bailed. Both now stop with "Your imported data is unchanged."
  A refresh that couldn't re-read every stored book says so ("N weren't in that folder and kept
  their stored data") instead of counting them as re-imported. *Rejected:* keeping the modal as
  the only report surface (that IS the bug — from the menu it reads as "it just opened a
  modal"); a MutationObserver mirroring the pipeline's DOM writes (more machinery than a 180 ms
  read of one node, and it would mirror error text as progress); threading progress callbacks
  into `stageScanBooks`/`buildImport` (a surface task must not reshape the pipeline); an
  outcome notice that waits to be dismissed (good news shouldn't outstay it — failures and asks
  still do); a global `.btn:disabled` look (Apply's disabled state is not this batch's to
  change). Enforced by: src/app.js `refreshImported`/`refreshButtons`/`refreshPaint`/
  `refreshStage`/`refreshDone`/`refreshFail`/`refreshAsk`, `appNotice(msg,kind,fade)`;
  `REFRESH_BUSY` also gates Apply, folder pick/rescan/forget. In-browser verified on an
  isolated origin (real scan/stage/merge/apply over real 5etools files behind a stubbed
  directory handle): both fallback paths, permission refused, wrong folder, the false-success
  guard, double-click, and the happy path end to end.

- **D130 (2026-08-30) DECIDED — GUIDED BUILDER v2: the walk is grouped by feature, the rail
  collapses, the answer is shown once, and the character is a drawer you always return from.**
  Mechanism: Francesco's notes after using the shipped phase G + mockup round
  (`scratchpad/gb-mockups2.html`, sections 1–4b) + AskUserQuestion × 5. The clauses:
  - **(a) The chain rail collapses to one line per level** — level, class, and **ONE icon
    naming the worst thing in it** (green ok · gold open/skipped · red illegal), raw:
    *"no need to show all green-yellow-red indicators on a collapsed row, simply show the
    highest alert … using their icons."* Only the current level is open; clicking a header
    opens another. An open level shows **aggregated rows with counters** ("Cantrips 0 of 2")
    rather than one row per slot. *Rejected:* keeping a row per pick (B — the repetition
    Francesco flagged, and it fights the multi-pick modal).
  - **(b) An answered pick step shows its answer ONCE, as chips** — each chip carries its
    own ✕, the counter sits in the card header and turns green when full; the duplicate ✓
    sentence goes. Raw: *"the spell picker is currently redundant, showing twice the selected
    spells both as answered and as chips."* *Rejected:* prose-only (nowhere to drop one pick).
  - **(c) Granularity: one step per FEATURE/SOURCE, with a section per logical group** —
    partially superseding **D118(c)**'s one-step-per-decision (Francesco's own earlier call,
    reversed by use). Raw: *"cantrips and spells appear in a single spellcasting page with two
    sections, same for other features that have multiple choice groups. However, always
    separate them by logic groups (ex. magic initiate cantrips separated from the 1st level
    spell)."* So a level's Bard spellcasting is ONE step holding a Cantrips section and a
    Spells section; Magic Initiate is ONE step holding list, ability, its cantrips and its
    1st-level spell as separate sections. Slot-level addressing survives INSIDE the modal,
    which is what the reverse/reconstruct walk (D118(f,g)) needs. *Rejected:* one step per
    pick (D118(c) as it stood).
  - **(d) The pick modal takes every pick of a step in one visit** — multi-select, sections
    each carrying their own "N of M" counter, groups still level-DESCENDING and collapsible
    (D126(f) stands), a footer count and Done. Raw: *"let me pick them up all in one modal."*
  - **(e) Character view = a DRAWER with a persistent return that can also end the walk.**
    "Character" slides the guide aside (it does not hide it) and an unmissable pinned bar
    names the step you left ("Back to the guide — step 12 of 23 · Cantrips"), plus a control
    to CLOSE the walk from that state. Raw: *"F - drawer with a persistent return that can
    also be closed form the drawer state."* Supersedes G1's `GUIDE.away` + vanishing Guide
    tab, which Francesco reported as not working. **Refined at merge (2026-08-30, v1.2.31):**
    the bar renders the line on TWO lines — "Back to the guide" over "Step N of M · <label>"
    — because at 375px the single em-dash-joined string ellipsised the step label, which is
    the half that makes the bar unmissable; the em dash became the line break. **CONFIRMED
    by Francesco 2026-08-31 (D134(c))** on the H5 gate's measurement — the two-line form is
    the decided one; the single string was the sketch. Three choices
    the clause left open, settled at build: the guide slides LEFT (its chain column's own
    side) to a 14px accent edge and stays mounted `inert` + `pointer-events:none`; the bar is
    pinned at the TOP as a sticky flow element (the bottom belongs to the phone jump bar, and
    sticky means nothing hides under it); the end control reads **"Exit builder"**, matching
    (h). *Rejected:* A read-only peek panel, B a permanent Guide tab, C a third column (all
    three rejected in round one); D guided-mode banner over the normal app and E split view
    (round two).
  - **(f) No walk chooser on entry** — entering goes straight into the walk at its resume
    point; reconstruct becomes a control INSIDE the guide, so both walks (D118(f)) survive
    without a gate screen. Raw: *"the current start of the guided builder feels kind of
    redundant … jump instead directly into the builder."* Supersedes D126's entry chooser.
  - **(g) Next COMMITS a shown-but-unstored selection; only Skip leaves it open.** Raw:
    *"If I click 'next' after a preselected option, it should lock that option as chosen.
    Only skipping it ignores it."* Must never fabricate an answer where nothing is shown,
    and never fabricate a trade on an optional swap step (D121). **Refined at merge
    (2026-08-30):** the trailing "Next level" CLASS step is EXCLUDED. Its "Continue X → N"
    is an action that grows the build, not a selection waiting to be stored — committing it
    on Next made the primary control add a character level per press, so the walk could
    never reach the terminal state (h) exists to give it (measured: plan 2 → 3 on one
    press). Levelling stays the card's own button. *Rejected:* keeping the commit and
    treating level 20 as the only true end (the end-of-walk complaint would return in a new
    form).
  - **(h) End of the walk is a terminal state: the primary becomes "Exit builder" and Skip
    is hidden.** Raw: *"end of the walk button doesn't work. Also rename it exit builder or
    something cleaner. Skip option also doesn't make sense here."*
  Supersedes: D118(c) in part (c); D126(f)'s per-slot implication and D126's entry chooser
  (f); G1's character-view switch (e). Enforced by: PLAN phase H task lines; the G4 gate
  reviews phase G as shipped, phase H gets its own. Affects: src/app.js guide section,
  src/index.html, src/styles.css.

- **D131 (2026-08-30) DECIDED — GUIDED BUILDER v3: one picker per section, a proceed button
  that advances, no explanatory prose, and the walk direction as a switch.** Mechanism:
  Francesco's notes after using the shipped phase H (v1.2.28–v1.2.31) + AskUserQuestion × 4.
  The clauses:
  - **(a) One picker per SECTION, not one per step** — **supersedes D130(d)**. Raw:
    *"choosing spells and cantrips in the same section should each open the picker only for
    itself, not including both."* Each section (cantrips, spells, each logical group of a
    feature) opens its own modal that knows only its own pool; you visit the modal once per
    section instead of once per step. D130(c)'s one-step-per-feature grouping is UNCHANGED —
    the step still holds its sections, they just each own their picker. *Rejected:* section
    buttons opening one shared modal filtered to the clicked section (keeps D130(d)'s single
    surface, but the modal then has two meanings); keeping both a scoped and a combined path
    (two routes through one surface, double the gate surface).
  - **(b) The picker's footer button IS the proceed nudge, in three states.** Raw: *"the
    pickers should have a button that nudges you to 'proceed' and close them when the choices
    are all made."* Quiet and disabled reading "Choose N more" while picks are owed; accent
    and reading "Done — next step" the moment the count is met; the click CLOSES the modal
    and ADVANCES the walk, rather than only closing. The `#gpPill`'s "Chosen N of M" goes —
    the section header counter already says it. *Rejected:* auto-closing on the pick that
    completes the step (takes the surface away mid-thought, nothing to review); leaving Done
    as close-only with a colour change (the walk would still need a separate Next press).
  - **(c) The guided builder carries no explanatory prose.** Raw: *"remove the notes and
    suggestions in the guided builder, if some are necessary, move them to a ? button."*
    Explanatory strings come out; anything genuinely load-bearing moves behind the project's
    existing `?` disclosure (**D88** — reference prose behind a disclosure, live state
    visible). Live status the user acts on and error/empty states are NOT prose and stay.
  - **(d) The "+N" spell chip goes.** Raw: *"the +x spell chip has an hover state but no
    click result. Remove it and only show actual spell chips, the pick counter is already
    present."* A control that looks interactive and does nothing is worse than the count it
    saved; the header counter carries that number already.
  - **(e) The walk direction is a two-state SWITCH.** **Refined the same day, before build →
    the switch lives in the SIDE RAIL, not the guide header, and both level columns invert —
    see D132.** Original clause, styled like the Build | Spell table tabs:
    Raw: *"remove altogether the reconstruct dropdown"* → *"turn it into a switch like
    build/spell table between with only build up or down."* **↑ Up** is the forward walk from
    L1 (a take fills the next open slot); **↓ Down** starts at the top level and walks down in
    place mode (the pool narrows to the build's OWN picks, a click places one into the
    selected slot). Both walks of **D118(f,g)** survive — as the switch's two states — but the
    word "reconstruct" leaves the UI entirely. **Supersedes D130(f)'s** reconstruct-as-header-
    command-menu shape. *Rejected:* removing the control and leaving the reverse machinery
    unreachable in the tree (dead code the gate would flag); **removing the reverse walk
    outright** (F3 + G3 built it and repair would fall back to the timeline and the sweep);
    a direction-only switch with take semantics both ways, or one where the app picks
    take-vs-place itself (the surface would change behaviour under you silently).
  - **(f) The drawer's left edge goes.** Raw: *"the character view from the builder has a
    weird highlight vertical bar on the left."* That bar is v1.2.31's 14px accent edge —
    it reads as a stray highlight, not as an affordance. The guide slides FULLY off-canvas
    and the pinned return bar is what says the walk is still standing. **Refines D130(e)**;
    the `body.gaside` offsets that assumed the 14px go with it.
  - **(g) Pact of the Chain offers a familiar pin, in a modal of its own.** Raw: *"pact of
    the chain should trigger an optional pin choice for familiar in find familiar."* The
    feature's **D109** forms reach Find Familiar as an OPTIONAL choice the user can pin —
    optional, so nothing is fabricated where the character hasn't chosen (D31 advisory).
    **Refined the same day, mid-build:** *"the pact of the chain familiar choice should live
    in a dedicated modal (with unique choices and also regular ones, but with lower
    hierarchy), which then influences which familiar is pinned in the spell."* So: a
    dedicated modal, not an inline affordance beside the optional-feature block; the eight
    granted forms lead as the unique tier and Find Familiar's own ~65 forms are offered
    **subordinate** to them, not as peers; and the modal's choice IS the pin — routed through
    the existing `toggleFav` so the carousel star, `orderedCreatures` and `printCreatures`
    keep one writer between them (the D105 marked-forms model is unchanged).
  - **(h) The side rail aligns its drag handle to the level chip and title row.** Raw:
    *"align drag handle to level chip and title row in the entries of the side rail."*
  Supersedes: **D130(d)** in full (a); **D130(f)**'s reconstruct control shape (e);
  **D130(e)**'s 14px edge (f). Affects: src/app.js guide + gpick sections, src/index.html,
  src/styles.css; PLAN's phase H (the H5 gate now reviews these too).

- **D132 (2026-08-30) DECIDED — BOTH level columns invert: highest level at the TOP, L1 at the
  BOTTOM, in the guide's chain rail AND the timeline modal; the walk-direction control moves
  into the rail.** Mechanism: Francesco's follow-up on D131(e) + AskUserQuestion × 2, mid-build.
  Raw: *"let's move the up and down build direction into the side rail, in a way that visually
  conveys how it works"* → then, told that the rail lists L1 at the top so "walk L1 upward"
  travels visually DOWNWARD and a bare ↑/↓ pair would contradict the screen: *"Could the rail
  be rearranged to go from highest level at the top to 1st at the bottom, using the same
  direction but inverting the rows?"* → and, asked whether the timeline inverts with it,
  **both**. So the contradiction is fixed at the root instead of designed around: with the
  columns descending, ↑ Up means up on screen and in the fiction, and the control can sit in
  the rail and show its travel rather than merely label it. **The "+ add level" row moves to
  the top** — it is the growth end now (D126(d)'s shape, re-anchored).
  **Refined again, same day, mid-build — the control is a GHOST ARROW BUTTON, not a switch.**
  Raw: *"for the up/down button, make it a simple ghost arrow button next to the from level
  note (a short popover explains it on hover)."* One quiet ghost button carrying an arrow
  that points the way the walk travels — with the columns inverted the arrow agrees with the
  screen, so the glyph carries the meaning and the button needs no label; it sits beside the
  rail's "from level" note, clicking toggles the direction, and a short `attachTip` popover
  says what that direction does. (Two standing traps apply: `attachTip` goes AFTER the
  element's own `onclick` or it swallows the click, and the arrow comes from `ICONS`/`icoEl`
  per D57, never a typed glyph.) *Rejected on the way here:* a two-state segmented switch in
  the guide header (D131(e) as first written); the same switch moved into the rail with a
  travel treatment on the spine.
  Load-bearing consequence, carried into the build brief: **the row drag is ONE shared
  implementation** (`wireRowDrag` + `commitPlan`, extracted in G1 and called by both surfaces),
  so the visual-position → plan-index mapping inverts in one place, and **G1's acceptance test
  stands unchanged — the same drag in the chain must still produce the identical plan as the
  same drag in the timeline**. Everything that assumed ascending order gets re-read rather than
  assumed: the current-level pin and its zone tinting, D122's run dividers and run aggregation,
  every first/last assumption about level rows.
  *Rejected:* **inverting the rail only** (cheaper, but the two surfaces would disagree
  spatially while sharing a drag implementation — exactly the equivalence G1 was gated on);
  **not inverting at all**, expressing direction as "start here" caps at the column's two ends
  with a travel tint on the spine (the smallest change, nothing to re-verify in the timeline —
  and the fallback if the inversion proves larger than it reads); a chevron trail on the spine
  under a header switch; a segmented switch labelled by origin ("From L1" | "From L8").
  Supersedes: D131(e)'s placement in the guide header. Affects: src/app.js `renderGuideChain`
  + `renderTimeline` + the shared row drag, src/styles.css, PLAN's phase I (I2).

- **D133 (2026-08-31) DECIDED — GATE-FIX MECHANISMS (G4 + H5/I5, all three passed with findings;
  fixes shipped v1.2.39).** Mechanism choices made while fixing, logged so they aren't re-litigated.
  - **(a) Placement is a property of the CALL SITE, never of the walk.** `toggle`'s ambient
    `GUIDE.reverse` intercept is deleted; `guidePlace` has exactly one caller — `gpickCommit` in
    place mode. *Rejected:* keeping the intercept and gating it on `!GUIDE.aside` + refusing `prep`
    (still ambient — the next surface that shares the writer inherits the bug); a second placement
    writer beside `toggle` (forks the one-writer discipline).
  - **(b) A `cpick` section always opens its picker in `take` mode** — a granted choice is a SET
    with no acquisition order to reconstruct; mode derives from section kind.
  - **(c) The pick modal's honesty clock is the LANDING section's level, set per SECTION in
    `openGpickSec`** — pool, cap, hint and `sliceInsertAt` all derive from that one number.
    *Rejected:* shifting the preview in `guideGo` (the gate's own first suggestion — wrong at step
    granularity: one step's two sections can land at two levels, and a step-level shift would
    misplace the other section's take); widening `guideEligible` to ignore `R.pool` (decouples the
    picker from the view — bigger, kept as fallback, not needed).
  - **(d) One `guideDownPlaceable` predicate answers all three Down-walk questions** — whether the
    control is offered, where reverse re-entry lands (never the growth card), what "from L{n}"
    names.
  - **(e) A row that cannot be dragged is not a drop target** — `wireRowDrag`'s row branch gates
    over/drop on `opt.enabled`; the chip branch stays on `opt.onChip`. *Rejected:* wiring the
    timeline's add row to match the ghost (adds a gesture nobody asked for).
  - **(f) The four duplicated inversion pieces are one owner, `levelColumn`** — card bodies stay
    per-surface, `wireRowDrag` stays separate on plan indices. Supersedes the keep-in-step-by-hand
    rule the I2 merge left (its Gotcha entry updated).
  → body: `ARCHIVE.md#phase-refinement-bodies`

- **D134 (2026-08-31) DECIDED — the three gate questions, answered by Francesco** (shipped
  v1.2.40).
  - **(a) The place-mode cast cap STAYS, plus one minimal alert** — the H5 gate's reading of
    D118(g) is confirmed; what was missing was one quiet `gphint` when the cap hides some of the
    section's own picks ("N picks are above this slot's cap — they fit a later slot.", spells only).
    *Rejected:* allowing over-cap placement (manufactures the violation the walk exists to repair);
    keeping the list silent (the short list reads as the whole of it).
  - **(b) `PREVIEW.level` KEEPS surviving `closeGuide`** — raw: *"Keep as is."* Exiting leaves the
    character view at the last-visited step's level; the chip's `.prevon` state makes it visible.
    *Rejected:* the gate's snapshot-on-open/restore-on-close (exit as the exact inverse of entry);
    clearing unconditionally. Neither may be re-proposed as a "fix" — this is decided behaviour.
  - **(c) The pinned bar's TWO-LINE form is confirmed** — D130(e) annotated in place; one line needs
    ~430px of content in a 375px bar. *Rejected:* one line everywhere; a desktop-only one-line
    variant (two forms of one bar).
  → body: `ARCHIVE.md#phase-refinement-bodies`

- **D135 (2026-08-31) DECIDED — invocations, and everything shaped like one, are wired**
  (Francesco's report: *"invocations do not seem to be wired correctly: agonizing and
  repelling do not let me choose a cantrip, repeatable invocations (and also feats) are not
  actually repeatable, one with shadows does not add extra condition to invisible spell
  modal, lessons of the first ones does not grant extra origin feat. Do a full audit of
  invocations and similar features and fix all these issues."*). Four independent holes,
  every one of them a 5etools field neither extractor read, or a note path that never ran
  for the record type. **Nothing here is hand-authored per invocation** — the data carries
  all four answers and the audit found the whole affected set each time (3 designations,
  8 repeatables, 1 feat-slot grant, 252 notes).
  - **(a) A DESIGNATION is a new grant kind, `marks`** — not a grant, not a pick. Agonizing
    Blast, Repelling Blast and Eldritch Spear say *"Choose one of your known {@filter
    Warlock cantrips|spells|level=0|class=Warlock|damage type=…} that deals damage"*: the
    spell is already yours and the feature changes what it does. 5etools carries the pool as
    a real **filter tag inside the prose**, so `parse_marks` reads it — a table would have
    been three names today and stale on the next book. A mark rides the pick machinery
    (`type:"pick"`, count 1, an array value) so every surface that already draws a pick
    draws it — Choices card, guided chain, both pick modals — but it never calls
    `spellOut`, because nothing is granted. What it produces is a **note on the designated
    spell**, through D79's own channel, so it lands in the spell modal and on the printed
    card with no new machinery. *Rejected:* a note-only advisory with no state (can't say
    WHICH cantrip, so a build never answers the question); leaving it out of scope because
    no spell is granted; a hand-authored table keyed by invocation name.
  - **(b) Designating a cantrip you HAVEN'T got takes it — as a normal pick, never a
    bonus.** Francesco's call, raw: *"The choice should also let me pick a cantrip (not in
    addition to warlock, but essentially a shortcut to pick)."* The modal offers the whole
    filtered pool, and a take lands in the owning class's own cantrip list at the E2 slice
    position, spending one of that class's slots exactly as picking it on the page would.
    The owning row is the one whose progression opened the invocation's slot — the same
    `optOwner` answer the grants already use. Dropping the designation afterwards leaves
    the pick where it is: it is a real pick now, and `markTake` never deletes one.
  - **(c) Repeatable is a per-take identity, `key` / `key##n`.** 5etools flags a repeatable
    FEAT with `repeatable`, but a repeatable optional feature only with a nested entry
    named "Repeatable" — so Agonizing/Repelling/Eldritch Spear and Lessons of the First
    Ones all read as take-once, and so did Magic Initiate, Elemental Adept, Skilled and
    ASI. Both shapes are read now. The second copy needs an identity of its own or its
    grants, its choices (`"f"+fk` IS the whole token path) and its feat slot would be the
    first copy's — so the nth copy carries a `##n` suffix, the first keeps the bare key
    (nothing stored moves, no migration owed), and every FEAT_BY/OPT_BY lookup goes through
    `baseKey`. The picker keeps its take button meaning click-to-remove and grows a second
    "+ again" button only where the rule applies; copies past the first carry their ordinal
    on the chip and on their Choices group. *Rejected:* one key with a parallel count (the
    two copies' choices would collide, which is the actual bug); renumbering copies on
    removal (the survivor would inherit the removed copy's picks).
  - **(d) A feature may hand you a FEAT SLOT — `featProgression` → `featSlots`.** Lessons of
    the First Ones grants an Origin feat and 5etools models it properly; neither extractor
    read the field. It is read from **feats, optional features and species only** — a
    class's own ASI / Epic Boon / Fighting Style schedule is `featSlotLevels()`'s to derive
    from the level plan, and reading the class copy too would hand every class its boon
    twice. **+1 on the Origin row** (Francesco's call), whose tooltip names the giver; the
    guided chain grows one more Origin-feat step because `originSlots()` is now ONE owner
    for a cap three surfaces used to derive separately. *Rejected:* a second labelled row
    per granted slot (the Feats block would grow a row every time something grants one).
  - **(e) A record's own prose is mined for D79 notes, BLOCK BY BLOCK.** `_mod_note` only
    ever ran through the class/subclass feature index, so a feat, an optional feature or a
    species — which carry `entries` on the record itself — never got one: every
    invocation's *"on yourself"*, *"while you're in Dim Light or Darkness"*, *"without
    expending a spell slot"* was dropped and the modal showed a bare "at will". Now 252
    notes across the three types. Block by block, never the record flattened: a named spell
    matches its own block, a pick matches the block carrying the same `@filter`, and
    anything unmatched keeps no note — a missing note costs a line of prose, a wrong one
    tells you the wrong rule. *Rejected:* one note per record (the first cut put the
    Aasimar's *"Once you transform, you can't do so again"* on its Light cantrip).
  - **(f) A prerequisite that carries a filter is VERIFIABLE.** "a Warlock Cantrip That
    Deals Damage" could only ever read "?" (D31) because it is not a spell name — but
    5etools ships the `choose` string beside it, so `spellFilters` carries it and the build
    answers it exactly. Agonizing and Repelling Blast now read ✓ against a build that holds
    Eldritch Blast. D31's asymmetry is untouched: what still cannot be checked still
    cannot say no.
  - **Two bugs found in passing, fixed:** `METAMAGIC_WHEN["Seeking Spell"]` tested
    `(sp.atk||[]).length>0` where the record carries a **boolean** — `undefined>0`, so that
    chip could never appear on any spell; and `EMPTY_GRANTS` was a shared literal whose
    `fixed`/`picks` LISTS were handed to every spell-less record by `dict(EMPTY_GRANTS)`, so
    the first append would have appeared on all 200+ of them (it is a function now).
  Affects: extract.py + src/extract.js (`parse_marks`, `_repeatable`, `feat_progression`,
  `_own_note_blocks`/`_apply_own_note`, `spellFilters`, `empty_grants`), src/app.js
  (`baseKey`/`nextCopy`/`dropCopy`, `filterSpells` damage-type + spell-attack, `markTake`,
  `grantedFeatSlots`/`originSlots`, `grantNotes`, the entity picker, both pick modals, the
  Choices card), src/styles.css (`.entcount`, `.chipn`), GOTCHAS (three new entries).

- **D136 (2026-08-31) DECIDED — three reads of the table that were wrong** (Francesco's
  report: *"for great old one, hex is marked as at will but is instead simply always
  prepared"*, *"synaptic static includes in the save row Con save, but that's only a
  secondary effect, it only targets intelligence saves"*, *"if two source grant the same
  spell (ex. Shadowmoor Hexer and Eldritch Hex), ideally they should be merged in one
  row"*). Two are 5etools tagging its own prose too broadly, one is ours.
  - **(a) An at-will `innate` whose feature says only "always prepared" is a PREPARED
    grant.** Great Old One's Eldritch Hex reads *"You always have the Hex spell prepared"*
    and grants no free casting at all, but 5etools files it under `innate`, which this app
    renders "at will". `add_spell_entry` now rewrites the kind — deliberately narrow, so a
    real free cast is never touched: **only the at-will shape** (a cadence is an explicit
    free-cast budget: Psi Warrior's daily Telekinesis and Archfey's Cha-per-day Misty Step
    both stay innate), **only when the feature NAMES this spell** (a fallback feature match
    may not rewrite a grant's kind — Archfey's always-prepared table also names Misty Step),
    and **only when its prose carries no free-casting clause** (`FREECAST_RE` stays wide on
    purpose: "without a spell slot" is the phrasing Psi Warrior uses, and a narrower regex
    let it through). One record in 5etools v2.33.3 matches. *Rejected:* a hand-authored
    correction table (one name today, stale on the next book); rewriting on the prose alone
    without the at-will and names-the-spell guards (three false positives, measured).
  - **(b) A save the spell never forces is not a save.** 5etools' `savingThrow` tags every
    save the text mentions, so Synaptic Static carried Con because it *penalises* the
    target's later *"Constitution saving throws to maintain Concentration"* — a spell that
    only ever makes anyone roll Intelligence read "Con/Int" in the Save column.
    `primary_saves` drops an ability whose **every** mention is that one clause. Everything
    else keeps 5etools' tag: a spell really can force several saves (Prismatic Spray,
    Symbol, 2014 Sleet Storm all verified unchanged), and the phrasings for that are not
    enumerable. Two records change, both printings of Synaptic Static. *Rejected:* deriving
    the primary save from "makes a/an X saving throw" (measured: it strips Prismatic Spray
    to one save and Whirlwind's Strength save, because the other phrasings are open-ended).
  - **(c) Everything GRANTED is one row per SPELL, with a badge per giver.** It failed in
    both directions: the always-prepared branch read `e.grants[0]` and **silently dropped**
    every later giver, while two innate grants produced a row each. Now the granted rows are
    merged on the spell — each giver keeps its own badge, its own free/cast tint and its own
    note, and where cadences disagree the Uses cell names them all rather than letting one
    stand for the rest. A free cast is the stronger fact, so a spell both always-prepared
    AND innately granted takes the innate marker and cadence and says the other half in the
    marker's tip. **A PICK stays its own row** — that one is your choice on a class row and
    the marker column is about that class. *Rejected:* merging picks into granted rows (the
    marker and the prepare toggle belong to a class); one badge with the givers joined into
    a string (loses the per-giver tint and note).
  Affects: extract.py + src/extract.js (`primary_saves`/`primarySaves`, `AP_RE`/
  `FREECAST_RE`, `_feat_record.alwaysPrepared`, `add_spell_entry`), src/app.js
  (`tableRows` merge, `cellFor` mark/casts/build), src/styles.css (badge gap, print
  separator).

- **D137 (2026-08-31) DECIDED — the app says when its data is older than its parser**
  (Francesco, on the D135/D136 builds: *"the version is updated (and loaded in browser), but
  I still see at will for hex and lessons of the first ones doesn't grant extra feat
  slot"*). Not a regression — reproduced exactly by handing a v1.2.41-stamped digest to the
  v1.3.1 app, and cleared exactly by handing it a current one. **`assembleData` uses
  `IMPORTED||BAKED`: an imported digest replaces the bundled one WHOLE**, so every extractor
  fix is invisible until the books are re-read, even for records the bundle already carries.
  The merged-row half of D136 landed because it is app code; the two data halves did not.
  That asymmetry has now cost four rounds of "this is still wrong" (D127's `_copy` twins,
  D135's designations and feat slots, D136's Hex and Synaptic Static), and the app has known
  the answer the whole time — D111 stamps `meta.parser` on every import and nothing read it.
  - **A boot notice, version-aware and dismissible per version.** `staleParserNotice()`
    compares the digest's stamp with `__VERSION__` through a numeric `verLt` (string
    compare would read 1.2.9 as newer than 1.2.41) and says: *"Your imported books were read
    by parser v1.2.41 — this is v1.3.1. Refresh to re-read them and pick up the fixes
    since."* It carries the bar's first ACTION button, "Refresh now", wired to the same
    inline `refreshImported(false)` the ⋯ menu uses (D129), and the × means "not now" — both
    stamp the version so it says its piece once and then stops until the next release. A
    digest from before D111 carries no stamp at all and counts as stale.
  - **Nothing is auto-refreshed.** A refresh re-reads the local folder, needs a permission
    gesture, and can fail in four ways a human must fix (D129) — doing it silently at boot
    would be a long unasked-for job with no gesture behind it, and would fail invisibly on
    every browser that has no folder handle. *Rejected:* auto-refresh on a version change;
    blocking the app until the data is refreshed; a permanent banner (the ⋯ menu and the
    Library footer already carry the stamp for anyone who wants to look).
  - **The notice is silent where there is nothing to say**: no import at all (the public
    build's default, and any browser using the bundle) and a stamp at the current version
    both produce nothing.
  - **(d) …and the same silence in the service worker, added v1.3.3.** The published build
    is stale-while-revalidate BY DESIGN — the page comes from the cache instantly and the
    new copy lands for the NEXT load, so a deploy is always exactly one reload behind, a
    trade taken deliberately against a 1.4 MB blocking download on every open. The app KNEW
    a newer build had arrived and said nothing, so "I reloaded and nothing changed" was the
    only way to find out. The worker calls `skipWaiting()`+`claim()`, so `controllerchange`
    fires exactly when a newer build has taken over: that now raises "A newer version of the
    app has downloaded. Reload to use it." with a Reload button. The very first install is
    NOT an update and stays silent. *Rejected:* dropping stale-while-revalidate for a
    network-first shell (that is the 1.4 MB download the strategy exists to avoid);
    reloading the page automatically (it would throw away whatever was on screen).
    **Verified only at the handler** — service-worker registration fails inside the browser
    pane, so the lifecycle on Pages is reasoned from `skipWaiting`+`claim`, not exercised.
  Affects: src/app.js (`staleParserNotice`, `verLt`, the boot tail, the SW registration),
  src/styles.css (`.appnotice .anact`), GOTCHAS (the `IMPORTED||BAKED` entry).

- **D138 (2026-08-31) DECIDED — the parser stamp is PER BOOK, and everything moves in one
  file** (Francesco: *"doesn't work still in my browser, even though the version is updated,
  but it works in the Claude browser"*, and *"let's add a feature that lets me export/import
  characters between devices"*). The first half found a real bug under D137.
  - **(a) One digest-wide parser stamp was a false success.** A refresh only re-reads the
    books the FOLDER holds — the rest "keep their stored data" (D129 says so in its own
    caveat) — but `applyPlan` stamped `meta.parser` on the whole digest anyway. So a partial
    refresh claimed the entire library was current, D137's notice went quiet, and the data
    stayed wrong with nothing left saying why. That is the D129 false-success shape one level
    down, and it is almost certainly why "it works in the Claude browser" (no import at all,
    so baked data) and not in Francesco's (an import that reported itself current). Every
    source now carries its own `parser`/`parsedAt`, set only for the books that actually came
    through the parser that time; `staleBooks()` asks per book and falls back to the
    digest-wide stamp for pre-D138 digests. The notice counts and NAMES them ("41 of your 43
    imported books (…) were read by an older parser"). *Rejected:* keeping one stamp and
    trusting the refresh to be total (it is documented as partial); blocking a partial
    refresh (the books the folder lacks are exactly the ones you cannot re-read).
  - **(b) The stamp is a visible line, not a hover title.** It sat in the Refresh button's
    `title`, which is no use when the question being asked is "why is my data still wrong".
    `#libParser` sits above the Library's own footer buttons, quiet when everything is
    current and gold when a book is behind.
  - **(c) A BACKUP file: every build plus the homebrew they reference.** Per-build export has
    existed since v7 (T5) and is right for handing one character to someone; moving to
    another device is a different job. The part a per-build file cannot carry is **homebrew
    spells** — they live in a GLOBAL store, not in a build, so a build exported alone arrives
    with a dangling key for every homebrew spell in it (verified: the round trip restores the
    pick AND resolves the spell). `Export all…` writes one
    `my-spellbook-YYYY-MM-DD.spellbook-backup.json`; the existing import box takes it, told
    apart from a single build by its `kind`, so there is one import entry point and no
    question for the reader to answer. **Additive, always** — like the single-build import it
    adds beside what is there and never replaces or removes; a homebrew spell already present
    WINS, since the file may be older than what you have been editing. *Rejected:* putting
    the imported 5etools library in the file (content, not character — D33/D86 — and 2.5 MB;
    the other device imports it from its own copy of the books); a replace-on-import mode
    (destructive, and the manager already deletes by hand); a second import control.
  Affects: src/app.js (`applyPlan` per-source stamp, `staleBooks`, `staleParserNotice`,
  `renderLibFoot`, `backupObj`/`exportAll`/`importBackupObj`, `doBuildImport`),
  src/index.html (`#libParser`, `#buildExportAll`, the import note), src/styles.css
  (`.libparser`), GOTCHAS (the per-book stamp).

- **D139 (2026-08-31) DECIDED — bug since RESOLVED same day; the method rule stands**
  *(Resolution: it was the stale-library branch — books the linked folder could not provide
  for re-parsing stayed wrong until Francesco relinked them manually; the v1.4.0 per-book
  stamps are what surfaced it. Confirmed on his browser. The rule below remains in force.)*
  Original entry, logged while open:
  (Francesco: *"the problem wasn't solved"*, after v1.3.2, v1.3.3 and v1.4.0). Logged as a
  decision because the lesson is a working rule, not a bug: **do not ship a fix for a
  "works for you, not for me" report until the reporter's own reading is in hand.** The
  agent's browser holds no imported library, so `IMPORTED||BAKED` puts it on the baked bundle
  where every extractor fix is present by construction — it cannot reproduce the class of bug
  being reported without being *made* to. Three releases followed from theorising in that
  environment: D137 (the app was silent about a stale digest), D137(d) (the published build
  was silent about a waiting update), D138(a) (a partial refresh stamped the whole library
  current). **Each fixed something real. None was confirmed to be the reported cause.**
  → The next session's first act is the reading, not a change: `ver`, `imported`,
  `IMPORTED.meta.parser`, `staleBooks()`, and the Hex grant — the snippet is in `STATE.md`,
  which also maps each possible answer to a different place to look. Only one branch
  (`staleBooks()` empty while the record is still wrong) is a new bug; the others are a
  stale page or stale data. → **Gotcha** (the pane cannot reproduce an import bug by
  default; `scratchpad/jsimport.js` exonerates the in-browser importer in one command).
  *Rejected:* shipping a fourth theory; treating "re-import" as an answer without evidence
  it ran and covered the books in question.

- **D140 (2026-08-31) DECIDED — minor bumps need Francesco's approval, every time**
  (Francesco: *"the versions are advancing too quickly, there was no big improvement between
  1.2 to 1.4 — always review if it warrants a version bump and interview me to get my
  approval"*). D117's "minor for larger batches that ship features" left the call to the
  agent, and two single-session batches (D135 → v1.3.0, D138 → v1.4.0) took it — real
  features, but not 1.2→1.4-sized in Francesco's judgment, and he is the versioning
  authority. **New rule: patch stays the automatic per-commit default (the footer must name
  the exact build — unchanged); a `--minor` or `--major` is never taken autonomously.** The
  agent presents what shipped and why it might warrant the bump (AskUserQuestion), and it
  stays a patch until Francesco says yes. Existing tags stand — the pre-semver rule that
  tags are never rewritten applies to 1.3/1.4 too. *Rejected:* minor-at-phase-gates with
  agent autonomy (still leaves the judgment call on the wrong side); retro-renumbering
  1.3/1.4 (tags are never rewritten). Amends **D117**; enforced by CLAUDE.md § Versioning.

- **D141 (2026-08-31) DECIDED — Francesco's UI calls on the guide and timeline** (his notes,
  verbatim in quotes; shipped by the 2026-08-31 parallel batch):
  - **(a) The direction arrow is an ORDER toggle, and both columns get one.** *"the guided
    builder arrow isn't correctly changing the order of the entries in the side rail, high
    level is always on top. Add the arrow option also in timeline."* The arrow now inverts
    the rendered order of the level column (walk's starting end on top), on the chain rail
    AND the timeline. Amends **D132**: highest-first stops being fixed and becomes the
    toggle's default; D132's hard rule is UNCHANGED — display inverts, computation never
    does, `wireRowDrag` stays on plan indices, `levelColumn` stays the one owner.
  - **(b) The `?` before "⇇ Character view" goes.** *"remove the ? button before character
    view, redundant."*
  - **(c) The timeline has ONE current state.** *"remove the current level state from
    timeline. Current state is always the clicked state of a row, they are not different
    states."* The clicked row IS the current state; the separate pin state/control goes.
    D134's Q2 (PREVIEW.level surviving closeGuide) is untouched.
  - **(d) Alignment is measured, never eyeballed.** *"the text of the chip indicating the
    class level on top isn't centered in the chip. This is a recurring issue, audit the page
    and fix it everywhere it appears. Log the doublecheck for alignment on new ui elements."*
    → the rule is in CLAUDE.md § How to work here (measure text-vs-container rect deltas at
    1280 and 375 on every new/changed UI element); the audit itself rides the batch.
  *Rejected:* keeping the arrow as a walk-direction-only control with a fixed highest-first
  display (what D132 shipped — Francesco read the arrow as an order control, and the
  control should do what it reads as).

### Superseded
- ~~**D14** Level budget = free distribution~~ → **D18.** Free distribution was wrong for
  known/level-swap casters (a Bard learns spells on level-up capped at its top slot); it survives
  only for daily preparers.
- ~~**D22** Sub-heading style = accent uppercase~~ → **D24b.**
