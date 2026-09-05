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
>
> **Compressed again 2026-09-05 (`/clean`, D158(q)/L5.11).** D115–D175 — the guide, the
> timeline, the audit and the filter era — keep their headline, their clause leads and every
> *Rejected:* clause here; the bodies moved verbatim to `ARCHIVE.md#d115-d175-bodies`.
> D157/D158 (the audit's charter and every disposition, L5 still runs on them) and D176
> onward (Phase N, live) stay whole.


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
  - **(a) Jobs.**
  - **(b) The non-goal narrows, not dies.** *Rejected:* per-pick `atLevel` stamps (D64's objections stand — reaffirmed, not superseded); app-derived best-case loadouts (the L5 view would be the app's guess, not the character; kills jobs a/b); linked LV-version careers (manual upkeep, edits at 20 never reach the L5 copy).
  - **(c) Sticky picks only.** *Rejected:* recording prepared lists (records what the rules let you change daily).
  - **(d) The slider is EDITABLE at any level.** *Rejected:* view-only lens (the very weakness that triggered this); append-only editing (a live swap still forces a jump to top).
  - **(e) A build saves its CURRENT level** *Rejected:* ephemeral scrub only.
  - **(f) Consistency = build-wide sweep + badge.** *Rejected:* per-level-only flags; an on-demand check action.
  - **(g) Retraining = swap-at-level-up only ~~(one swap per level)~~** *Rejected:* add-only with removal-erases-history (lies to jobs a/c); full per-pick intervals (exactly the cost D64 priced — not justified).
  - **(h) Mapping is a PURE SLICE, no pins.** *Rejected:* per-pick level pins (stamps by the side door).
  - **(i) Fork replaces save-as-version.** *Rejected:* removing forking; keeping the level/variant double meaning.
  - **(j) Surface = chip + timeline ~~POPOVER~~**
  → body: `ARCHIVE.md#d115-d175-bodies`

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
  - **(a) Identity: a separate guided flow** *Rejected:* a guided mode of the timeline popover (reference density can't host step content); wizard-as-primary-surface (fights the app's free-form browsing language, D57/D66).
  - **(b) Step mechanics: hybrid coach + page.** *Rejected:* self-contained modal steps (clones the pickers into a modal — duplicate surface, duplicate bugs); coach-only (tiny structural choices get heavier than needed).
  - **(c) Granularity: one step per DECISION** *Rejected:* one step per character level; tier grouping (dissolves "what do I get at level 7").
  - **(d) L1 scope: everything the app models** *Rejected:* class-only (breaks the promise at step one); full character creator (a different app).
  - **(e) Skip policy: everything skippable, soft flags.** *Rejected:* required structural picks; must-complete-per-level (fights D31 throughout).
  - **(f) Direction: BOTH walks, chosen per run.** *Rejected:* place-only 1→X (recommended, declined); peel-only X→1.
  - **(g) Leftovers settle at top, soft-flagged.** *Rejected:* fix proposals inside the wizard (a second legality engine that must agree with E4); a holding pen (a pick outside every slice belongs to no level — violates D115(h)).
  - **(h) Order trust: E1's migrated array order is truth, silently.** *Rejected:* a quiet unconfirmed hint on the chip (recommended, declined); blocking level views until confirmed.
  - **(i) Entry points: all three.** *Rejected:* shipping a subset; footer-only; menu-only.
  - **(j) Lifecycle: stateless — the build IS the state.** *Rejected:* a stored wizard session (persisted shape for a distinction the soft flags cover).
  - **(k) Surface: side coach rail, no modals anywhere.** *Rejected:* docked coach bar (hides the remaining decisions at per-decision granularity); chained structural modals.
  → body: `ARCHIVE.md#d115-d175-bodies`

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
  - **(a) Surface: a full-size page** *Rejected:* chained modals (the overview shrinks to a stepper; modal-over-modal is the reported bug); reskinning the rail (the contrast/collision problems are architectural on phone).
  - **(b) Layout: Ledger** *Rejected:* Milestone (level track compresses the 20-level glance); Dossier (chain behind a tap).
  - **(c) Phone: one-tap toggle between the decision view and the chain column**
  - **(d) Class step: current + last-other prominent, compact menu for the rest** *Rejected:* a button per owned class (recommended, declined); a chooser modal on every level-up.
  - **(e) Done state: an answered step stays as a green-tinted card; the walk moves only on Next/Skip or a chain click** *Rejected:* ✓-only subtle state; auto-advance after a beat.
  - **(f) Spell/cantrip steps pick in a MODAL, not the page**
  - **(g) Every choice the build carries is a step that opens its REAL chooser**
  - **(h) Swap step: a direct trade card per kind** *Rejected:* guided arm-then-take (the two-phase indirection was the complaint); inline out+in dropdowns. (raw: *"swapping system isn't intuitive in the guided builder, rework it"*)
  - **(i) Entry: a "Start guided" CTA card on an empty character** *Rejected:* auto-opening the guide (fights the browse-first language); hint text only.
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D127 (2026-08-29) DECIDED — edition identity: resolve `_copy` in both extractors and
  carry the reprint pointer (`supersededBy`).** Mechanism: read-only investigation agent +
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D128 (2026-08-29) DECIDED — swaps are per KIND: one leveled-spell trade + one cantrip
  trade per level-up, by the verified 2024 class rules; Wizard's cantrip trade is 1/LR in
  the prepare modal.** Mechanism: Francesco's direct instruction, raw: *"known casters can
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D129 (2026-08-29) DECIDED — Refresh from the ⋯ menu runs INLINE with a visible progress →
  outcome; the Library modal opens only when a human is needed.** Mechanism: Francesco's direct
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D130 (2026-08-30) DECIDED — GUIDED BUILDER v2: the walk is grouped by feature, the rail
  collapses, the answer is shown once, and the character is a drawer you always return from.**
  - **(a) The chain rail collapses to one line per level** *Rejected:* keeping a row per pick (B — the repetition Francesco flagged, and it fights the multi-pick modal).
  - **(b) An answered pick step shows its answer ONCE, as chips** *Rejected:* prose-only (nowhere to drop one pick).
  - **(c) Granularity: one step per FEATURE/SOURCE, with a section per logical group** *Rejected:* one step per pick (D118(c) as it stood).
  - **(d) The pick modal takes every pick of a step in one visit**
  - **(e) Character view = a DRAWER with a persistent return that can also end the walk.** *Rejected:* A read-only peek panel, B a permanent Guide tab, C a third column (all three rejected in round one); D guided-mode banner over the normal app and E split view (round two).
  - **(f) No walk chooser on entry**
  - **(g) Next COMMITS a shown-but-unstored selection; only Skip leaves it open.** *Rejected:* keeping the commit and treating level 20 as the only true end (the end-of-walk complaint would return in a new form).
  - **(h) End of the walk is a terminal state: the primary becomes "Exit builder" and Skip is hidden.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D131 (2026-08-30) DECIDED — GUIDED BUILDER v3: one picker per section, a proceed button
  that advances, no explanatory prose, and the walk direction as a switch.** Mechanism:
  - **(a) One picker per SECTION, not one per step** *Rejected:* section buttons opening one shared modal filtered to the clicked section (keeps D130(d)'s single surface, but the modal then has two meanings); keeping both a scoped and a combined path (two routes through one surface, double the gate surface).
  - **(b) The picker's footer button IS the proceed nudge, in three states.** *Rejected:* auto-closing on the pick that completes the step (takes the surface away mid-thought, nothing to review); leaving Done as close-only with a colour change (the walk would still need a separate Next press).
  - **(c) The guided builder carries no explanatory prose.**
  - **(d) The "+N" spell chip goes.**
  - **(e) The walk direction is a two-state SWITCH.** *Rejected:* removing the control and leaving the reverse machinery unreachable in the tree (dead code the gate would flag); **removing the reverse walk outright** (F3 + G3 built it and repair would fall back to the timeline and the sweep); a direction-only switch with take semantics both ways, or one where the app picks take-vs-place itself (the surface would change behaviour under you silently).
  - **(f) The drawer's left edge goes.**
  - **(g) Pact of the Chain offers a familiar pin, in a modal of its own.**
  - **(h) The side rail aligns its drag handle to the level chip and title row.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D132 (2026-08-30) DECIDED — BOTH level columns invert: highest level at the TOP, L1 at the
  BOTTOM, in the guide's chain rail AND the timeline modal; the walk-direction control moves
  into the rail.** Mechanism: Francesco's follow-up on D131(e) + AskUserQuestion × 2, mid-build.
  → body: `ARCHIVE.md#d115-d175-bodies`

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
  - **(a) A DESIGNATION is a new grant kind, `marks`** *Rejected:* a note-only advisory with no state (can't say WHICH cantrip, so a build never answers the question); leaving it out of scope because no spell is granted; a hand-authored table keyed by invocation name.
  - **(b) Designating a cantrip you HAVEN'T got takes it — as a normal pick, never a bonus.**
  - **(c) Repeatable is a per-take identity, `key` / `key##n`.** *Rejected:* one key with a parallel count (the two copies' choices would collide, which is the actual bug); renumbering copies on removal (the survivor would inherit the removed copy's picks).
  - **(d) A feature may hand you a FEAT SLOT — `featProgression` → `featSlots`.** *Rejected:* a second labelled row per granted slot (the Feats block would grow a row every time something grants one).
  - **(e) A record's own prose is mined for D79 notes, BLOCK BY BLOCK.** *Rejected:* one note per record (the first cut put the Aasimar's *"Once you transform, you can't do so again"* on its Light cantrip).
  - **(f) A prerequisite that carries a filter is VERIFIABLE.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D136 (2026-08-31) DECIDED — three reads of the table that were wrong** (Francesco's
  - **(a) An at-will `innate` whose feature says only "always prepared" is a PREPARED grant.** *Rejected:* a hand-authored correction table (one name today, stale on the next book); rewriting on the prose alone without the at-will and names-the-spell guards (three false positives, measured).
  - **(b) A save the spell never forces is not a save.** *Rejected:* deriving the primary save from "makes a/an X saving throw" (measured: it strips Prismatic Spray to one save and Whirlwind's Strength save, because the other phrasings are open-ended).
  - **(c) Everything GRANTED is one row per SPELL, with a badge per giver.** *Rejected:* merging picks into granted rows (the marker and the prepare toggle belong to a class); one badge with the givers joined into a string (loses the per-giver tint and note).
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D137 (2026-08-31) DECIDED — the app says when its data is older than its parser** *(amended by D158(d): the first import merges onto the bundle.)*
  - **(d) …and the same silence in the service worker, added v1.3.3.** *Rejected:* dropping stale-while-revalidate for a network-first shell (that is the 1.4 MB download the strategy exists to avoid); reloading the page automatically (it would throw away whatever was on screen).
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D138 (2026-08-31) DECIDED — the parser stamp is PER BOOK, and everything moves in one
  file** (Francesco: *"doesn't work still in my browser, even though the version is updated,
  - **(a) One digest-wide parser stamp was a false success.** *Rejected:* keeping one stamp and trusting the refresh to be total (it is documented as partial); blocking a partial refresh (the books the folder lacks are exactly the ones you cannot re-read).
  - **(b) The stamp is a visible line, not a hover title.**
  - **(c) A BACKUP file: every build plus the homebrew they reference.** *Rejected:* putting the imported 5etools library in the file (content, not character — D33/D86 — and 2.5 MB; the other device imports it from its own copy of the books); a replace-on-import mode (destructive, and the manager already deletes by hand); a second import control.
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D139 (2026-08-31) DECIDED — bug since RESOLVED same day; the method rule stands**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D140 (2026-08-31) DECIDED — minor bumps need Francesco's approval, every time**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D141 (2026-08-31) DECIDED — Francesco's UI calls on the guide and timeline** (his notes,
  - **(a) The direction arrow is an ORDER toggle, and both columns get one.**
  - **(b) The `?` before "⇇ Character view" goes.**
  - **(c) The timeline has ONE current state.**
  - **(d) Alignment is measured, never eyeballed.** *Rejected:* keeping the arrow as a walk-direction-only control with a fixed highest-first display (what D132 shipped — Francesco read the arrow as an order control, and the control should do what it reads as).
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D142 (2026-08-31) DECIDED — Francesco's calls on the 2026-08-31 notes batch** (his
  - **(a) The choices row KEEPS one line — the chip field is masked behind the button.** *Rejected:* **A1** (description full width, chips + CTA on a second row) and **A2** (button leads that row) — both were mocked; a second row buys wrapping at the cost of a taller card per choice, and the masked single line reads the same as the access row he already knows.
  - **(b) Ability tiles are CHIP ONLY.** *Rejected:* **B1** (chip + full name, which I had recommended) and the responsive B1/B2 split — the column is narrow and the colour plus the abbreviation carry it.
  - **(c) Filters become an ICON everywhere, and the active ones become a masked chip row.** *Rejected:* **C1** (accent dot on the button + a segmented ✕, which I had recommended) and **C2** (a "showing 128 of 411" status line) — both say THAT you are filtered without saying BY WHAT.
  - **(d) No preview pane — a creature gets the spell treatment.** *Rejected:* the two-column split with a collapsible `sbBodyHTML()` pane (mocked and recommended) — and with it, for now, rolling a preview column out to the spell and feat pickers.
  - **(e) The eligible list is capped at ~55vh and scrolls inside itself.** *Rejected:* a fixed ~420px cap (steadier on a big screen, tighter on a laptop), and leaving it uncapped.
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D143 (2026-08-31) DECIDED — the guided builder asks about a level-up once, in its own
  words** (J6 + J7 of the 2026-08-31 notes batch):
  - **(a) The trade is a SECTION of the level's spellcasting step, not a step of its own.**
  - **(b) The guided builder's own copy loses its em dashes, and a label that only repeats its card's title is deleted.** *Rejected:* an app-wide em-dash sweep in the same pass, which would have touched print, modal and importer copy nobody asked about.
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D144 (2026-08-31) DECIDED — the menu is grouped by what each item acts on, and the
  custom builder joins the rest of the page** (J10 + J11):
  - **(a) The ⋯ menu groups by OBJECT: this character, then content, then the app.** *Rejected:* four labelled groups (four headers on ten items is more chrome than the list is worth) and separators alone with no headers (leans entirely on ordering to carry the grouping).
  - **(b) The custom builder's fields were never styled, and the cause is one selector.**
  - **(c) A custom spell can start from an existing one.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D145 (2026-08-31) DECIDED — the light theme is SOLVED, not picked** (J12). Francesco:
  - **(a) Every ink colour is derived, not chosen.**
  - **(b) "Flat" was the border contrast, and it is measurable.** *Rejected:* that darker-paper approach, on measurement.
  - **(c) A decorative `opacity` on a text container is a contrast cut no palette can repair.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D146 (2026-08-31) DECIDED — a drop leaves an EMPTY SLOT; it does not close the gap**
  - **(a) The cause is the model, not the guide.**
  - **(b) A hole is a real position.**
  - **(c) Containment is what makes this a ~30-site change, not a 169-site sweep.**
  - **(d) A take answers a standing slot before it adds a position**
  - **(e) Everywhere picks are level-mapped, not the guided builder alone** *Rejected:* **"✕ = replace this slot"** (the ✕ opens the picker addressed at that position and overwrites in place). *Rejected:* **keeping the shift and warning about it** — "this will move 5 later picks up a level" is a truthful sentence about a broken outcome; the outcome was the problem.
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D147 (2026-09-01) DECIDED — every buildable element carries its own text and names its
  book.** Francesco: *"I want to include in the site the source of all character building
  - **(a) The parser carries the prose, in both extractors.**
  - **(b) One modal for all five kinds, borrowing SPMODAL.** *Rejected:* a renderer per kind (five surfaces to keep in step, for one shared question); a preview pane beside the picker (mocked and rejected once already, D142(d)).
  - **(c) Entry points: the picker rows, the builder chips, and the timeline's gains line** *Rejected:* wiring every surface that names a feat (the guide's cards carry their own click behaviour, each needing the nested-interactive check); picker rows only (the chips are where you re-read a pick).
  - **(d) The book is named on every element, core included — but a closed `<select>` states it on its label, not in its option text.**
  - **(e) A record with no text says so.** *Rejected:* inheriting the base record's text through a `_copy` (it would print the lineage the setting REPLACED — wrong rules text is worse than none); porting `_mod`.
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D148 (2026-09-01) DECIDED — one detail layout per KIND, and the book is the tag alone.**
  - **(a) The book is stated ONCE, as the tag.**
  - **(b) Prose is STRUCTURED at the extractor, not guessed at the renderer.** *Rejected:* a sentinel prefix on heading strings (a shape everything downstream would have to strip); widening `isDescTitle`'s regex (a better guess is still a guess, and the next book breaks it).
  - **(c) A layout per kind, because the five answer different questions.** *Rejected:* one body for all five (what D147 shipped, and what these notes are about).
  - **(d) Features group by level, and every group and section is a disclosure.**
  - **(e) An ability is always a coloured chip where it is a FACT** *Rejected:* chipping every ability mentioned in running prose (a paragraph of "Charisma (Deception or Performance)" becomes a chip salad, and the word there is grammar, not a fact).
  - **(f) "Spells it gives you" divides by the level you get them.**
  - **(g) A condition explains itself, in place.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D149 (2026-09-01) DECIDED — the detail modal is a stack of disclosures, and a choice is
  answered where it is read.** Francesco's notes on 1.5.1. Four decided; the fifth is mocked
  - **(a) Every block is a disclosure, and the progression table starts SHUT.**
  - **(b) "Subclass at · Level 3" is gone from Core traits.**
  - **(c) The feat modal follows the canon.**
  - **(d) An ability chip sits on the text baseline, measured — never nudged.**
  - **(e) A choice is answered inside the modal that explains it.** *Rejected:* closing the detail modal to open the picker (loses your place, and the reason to be in the modal at all); a second inline spell list (a copy of the one picker, which this project has refused every time it came up).
  - **(f) DECIDED → D150 (2026-09-01), variant A — the class ⊕ subclass merge.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D150 (2026-09-01) DECIDED — a class and its subclass are ONE modal, on one level spine.**
  - **(a) One spine, the subclass MARKED — never moved.** *Rejected:* **B · two bands** (safest to read and best for "what does the subclass add", but a per-level question means two places and the "Features" header repeats); **C · paired rail** (the most explicit, and the only one that shows a level where the subclass gives nothing — which is most of them — and it collapses to one column under 720px, exactly where the distinction it is built on disappears).
  - **(b) Expand all acts on BOTH scopes.**
  - **(c) Both of a class row's detail buttons open the merged modal.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D151 (2026-09-01) DECIDED — the quiet floor is `--muted`; there is no legal step below it.**
  - **(a) `.logains.dim` loses its `opacity:.6`; the italic is the whole distinction.** *Rejected:* a new token one step below `--muted` (it would fail by construction — `--muted` is the floor); keeping the opacity and lightening `--muted` to compensate (pays for one line by flattening every quiet label in the app).
  - **(b) `.locard.zplan` loses its `opacity:.82` too — the dashed border already says "plan".** *Rejected:* keeping `.82` and exempting text from it (there is no way to un-inherit group opacity); a lighter `.92` (still a cut, still unmeasurable by eye).
  - **(c) Found, measured, NOT fixed — `.lt-count.tlalert` in the dark theme.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D152 (2026-09-01) DECIDED — the timeline's alert tile is a PLATE, and `--muted` was never
  the lever.** D148 left the "0/2 PICKS" tile (`.lt-count.tlalert`) as the one remaining
  - **(a) That assumption was wrong, and measuring it is what unlocked the fix.**
  - **(b) So the tile darkens instead of the ink washing out.**
  - **(c) An opaque plate also deletes the `.here` variant.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D153 (2026-09-01) DECIDED — the app follows the 5etools repo itself: fetch online, and
  a boot check offers each new release** (v1.5.6). Francesco asked whether the app could
  - **(a) The fetch is the zip drop with the zip removed.**
  - **(b) "Updates when the repo does" is a boot check, not a push.**
  - **(c) The repo address is a setting, not a constant**
  - **(d) A file failure is fatal and owns the report.** *Rejected:* **a GitHub Action baking fresh data into the repo** — it would commit non-SRD content to the public repo, which the gitignore stance exists to prevent; **fetching `@latest` per file** — a release landing mid-fetch would mix versions, so the resolved version pins every URL; **auto-refresh without asking** — a multi-MB download the user didn't start, and Apply is where book choices live; **recording the fetched version at stage time** — the record backs the update check, so it is written only when the fetch is APPLIED; **a local mirror-refresh script (option B)** — not rejected on merit, just not built: it only freshens the Mac-side `dist` build and can be added any day.
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D154 (2026-09-01) DECIDED — the Library redesigned: one page, one list, a selection bar,
  and no refresh verbs at all.** AskUserQuestion, 5 rounds, mockups against the real
  - **(a) Shape B: one page, no tabs.** *Rejected:* **A · "Books | Add content" two tabs** (the session's recommendation — he took B over it); **C · tidied Manage** (kept the two different-meaning checklists — half the confusion).
  - **(b) The status strip is the top of the page and owns the web fetch.**
  - **(c) Rows are R3, two lines:** *Rejected:* R1 (origin only), R2 (kinds only).
  - **(d) Groups stay edition-first (G1)** *Rejected:* G2 origin-shelves, G3 a Group ▾ axis switcher (one more control in a modal being quieted).
  - **(e) Removal is monster-forge's selection bar** *Rejected:* **2a storage mode** (his own earlier pick, reversed on seeing both mocked), row-⋯ menu, removal inside an add surface.
  - **(f) Acquisition is the footer: Close · ＋ Add files ▾** *Rejected:* 1a "+ Add content" view swap; **1b + drop-anywhere** (offered, not taken — so drag-and-drop onto the modal is OUT, not silently kept).
  - **(g) Raw-stash + web refetch: the refresh verbs cease to exist.** *Rejected:* stash-everything-including-zips (~25 MB duplicate storage for zip importers; web covers core), keep-folder-refresh (the permission dance is the cost being deleted), offer-don't-act re-parse (stale state lingers behind a button).
  - **(h) The staged flow is a Pending-import tray**
  - **(i) "Remove imported data" is dropped**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D155 (2026-09-01) DECIDED — the calls K1 had to make that D154 did not cover.** Phase
  - **(a) "＋ Add files ▾" is ONE button, not the mockup's split.** *Rejected:* a real split (nothing earns the primary half), the visual split with both halves opening the popover.
  - **(b) D153's editable repository address lives in Actions** *Rejected:* keeping it beside Update data (it is not part of that verb — it is the once-every-two-years fix for when the mirror moves).
  - **(c) The keep-plan is staged-only from K1, not from K2.**
  - **(d) The modal box is a flex column with a pinned footer, and the strip/search/selection bar are one sticky block inside the scroller.**
  - **(e) A book's ORIGIN is stamped per book at apply time** *Rejected:* matching `webSync.syncedAt` against `meta.importedAt` — tried, and WRONG: a second Apply moves `importedAt` past the fetch record, which made a 44-book web-fetched library read "file" on every row. - Also in K1, not a design call: `aria-expanded` is now kept honest on every `[aria-haspopup]` button by one sweep in `closeMenu`/`toggleMenu` — the footer caret is drawn from that attribute, so a stale one was wrong on screen as well as to a reader.
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D156 (2026-09-01) DECIDED — the tray ADDS; it cannot remove.** Phase K2 built D154(h)'s
  - **(a) The tray's ticks govern only books you do NOT already have.** *Rejected:* keeping the old untick-to-delete (two destructive paths, one of them unarmed and reached by a stray click); a per-book "don't update this one" tick (it would mean un-merging a digest that `mergeDigests` has already merged — real machinery for a choice nobody has asked for).
  - **(b) A book you already have is a SENTENCE, not a row.** *Rejected:* listing them dimmed and untickable, which is the same noise wearing an excuse.
  - **(c) The tray's filter and All/None appear at ≥9 new books.**
  - **(d) `#importReport` stays OUTSIDE the tray.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D157 (2026-09-01) DECIDED — the three-pillar audit: its charter, its agents and how its
  findings land.** AskUserQuestion, 5 rounds (the agenda printed as its own message first —
  prose above a question dialog is invisible; raw note: *"The agenda is not visible in chat.
  This is a recurring issue, make sure it doesn't happen again. Print the agenda in chat, the
  reopen the AskUserQuestions"*). Francesco asked for *"a series of agents for parallel audits
  across the main pillars of the app"*: direction and horizon; design, UX/UI, flows and copy;
  codebase health and a bug sweep. **Phase K pauses** (K3/K4) until the audits are triaged —
  the Library is the surface most likely to draw findings, and building its model half first
  risked rework. *Rejected:* K3 in parallel; finishing K first.
  - **(a) Charter.** Agents **fix trivial defects in their worktrees and report the rest** —
    a one-line defect, a typo, dead code; anything with a design or model implication is a
    finding. Every finding reaches Francesco only after a **second, verifying agent** has
    reproduced or struck it (panel-style), ranked. *Rejected:* report-only with fixes in a
    second wave (slower than the risk warranted); fix-as-they-go (design and copy would land
    without his call); the auditor's own evidence as the bar; raw findings triaged by the
    session alone.
  - **(b) Pillar A · direction.** Audience: **Francesco first, the Pages build a by-product**
    (SRD only, a courtesy). Of the standing non-goals, **only ability scores and proficiency
    may be questioned** — the agent may cost out a minimal model, because it is the one
    non-goal that blocks real features (prerequisites, custom-source DCs, ASI steps). Server
    sync, sharing by URL (D36), the full bestiary (D78) and the authored timeline (D115)
    stand. Inputs: this repo; the sibling tools (`monster-forge`, `character-forge`, as D154
    did); a short cited landscape read of comparable tools; his own usage evidence in the
    browser, read-only; and — raw note: *"You can investigate Notion character repository for
    other references."* — the Notion "Player Characters" page, the "Character Sheet" and
    "Spellcasting Progression" databases and "Character Ideas" (access verified this session).
    Deliverable: **a ranked opportunity map** (S/M/L, value × cost, grouped quality-of-life /
    feature / expansion) **plus a draft Phase L task list and a pipeline verdict**.
    *Rejected:* a small circle or a public audience as the frame; re-opening D36 or D78;
    repo-only inputs; a map without a draft phase; three horizon scenarios.
  - **(c) Pillar B · design.** **Two agents:** one drives the real app on its own port —
    every page, modal, popover and empty state at 1280 and 375, both themes, print rules
    lifted — and hands back a surface-and-flow map, then heuristic findings with
    screenshots and a **measured** palette read (contrast, hue, step consistency); the other
    reads the design system in code (tokens, components, duplicate patterns). Four
    scenarios: a new level-1 single-class caster to a printed sheet; a multiclass caster
    planning a level-up; importing a homebrew book and building from it; a first-run visitor
    on the Pages build. Standard: **current standards plus internal consistency** — WCAG AA,
    recognised heuristics, modern density and targets, the app's own tokens; sibling tools
    cited only where D154 already aligned the Library. *Rejected:* one agent of either kind;
    the siblings' house style as the bar; best-in-class references as the bar.
  - **(d) Copy.** **Rewrite freely to the brief** (dry, short, active, sentence case, no AI
    tells, notes cut to what the reader controls), **with a before/after string table
    alongside, grouped by surface, and the work verified internally before it is made
    official** — raw note: *"Free rewrite, but a string table alongside. Verify internally the
    work before making it official."* The pushback that copy is design material he owns was
    made once and answered: the table is the review surface, vetoes revert by name.
    *Rejected:* table-only; mechanical fixes applied and rewrites tabled (his first answer,
    widened on the challenge).
  - **(e) Pillar C · code.** **Scripts first, then three concern agents.** Deterministic
    sweeps (functions defined and never called; CSS selectors matching nothing in markup or
    JS; duplicated helpers; storage keys and their migrations; handler wiring against the
    GOTCHAS pitfalls) run before any agent and join the verify gate. Then: app.js structure
    and dead code; a browser-driven bug sweep of the four scenarios with console, network
    and storage invariants watched; extractors, importer and storage integrity with cparity.
    Every finding carries `file:line` and a repro. **The repo's shape is open to sectioning
    and tooling proposals only** — `app.js` stays one file (CLAUDE.md, on purpose). **A
    linter is allowed** (eslint / stylelint with devDependencies) — the first `package.json`
    in the project, accepted knowingly. *Rejected:* one deep whole-tree review; scripts and
    browser sweep only; proposing a split of app.js; findings-only with no structural voice;
    no new tooling.
  - **(f) Logistics.** Reports live in **`audits/`**, committed, one file per pillar plus a
    synthesis, dated 2026-09; PLAN points at them as a point-in-time artifact and `/clean`
    archives them once consumed. Models follow `model-policy.md`: direction, live UX and the
    copy rewrite on the strong model at high effort; the static design read, the three code
    agents and the browser sweep on Sonnet; verifiers on the strong model. **Three waves:
    audit → verify → act** — wave 1 all auditors in parallel, reporting; wave 2 verifiers
    strike or confirm; wave 3 the copy rewrite (from the verified string inventory) and the
    trivial-fix batch, in worktrees, merged with the gate, because copy last means the UX
    audit reads stable strings. Landing: **one ranked synthesis, then a triage interview per
    pillar** (keep / change / park / kill per item); dispositions become Phase L task lines
    and decision entries. *Rejected:* gitignored scratchpad or artifact pages as the home;
    strong-everywhere or cheap-first models; everything at once; two waves without a
    separate verify; synthesis annotated in prose; a draft Phase L with no triage.
  - **Enforced by:** the audit briefs (each agent is told its wave, its files, its bar) and
    the wave-2 verifiers; prose only for the rest. **Affects:** PLAN.md (Phase L opened, K
    marked paused), STATE.md, CLAUDE.md's decision range.

- **D158 (2026-09-02) DECIDED — the audit's triage: every confirmed finding has a disposition,
  and Phase L is the build list.** AskUserQuestion, 5 rounds over `audits/synthesis.md` (the
  verified record of D157's waves 1 and 2). Raw notes kept verbatim. Also: *"for the next
  waves, try to reduce the overall token cost"* — wave 3 runs on two Sonnet fix agents and one
  strong-model copy agent, with no separate verification wave; the gate, a merged-tree smoke
  and the string table are the check.
  - **(a) Horizon: close the loop with his table.** K3/K4 and the pooling fix first, then the
    plan leaves the app (copy as a level plan, compare two versions), then the minimal
    ability-score model. Raw note on where a character lives: *"Notion could be a useful
    destination, character-forge isn't in a good dev spot yet but ideally the ecosystem should
    be connected."* So A-03 (level plan as text, in the Character Ideas shape) rises; A-09 (the
    character-forge handoff) stays queued behind it. *Rejected:* content first; consolidation.
  - **(b) Pooling: all three half-casters round up per class** (Artificer, Paladin, Ranger),
    per XPHB's multiclass table. Paladin 1 / Sorcerer 4 pools to 5; the fixture asserts 5.
    *Rejected:* Artificer only; leave floored.
  - **(c) Ability scores + proficiency bonus: a decision entry first, the build later.** The
    entry fixes the boundary (six scores and PB, nothing else) so the orphaned ASI note, the
    unverifiable prerequisites and custom-source DCs have a home. Sized L (V-A §4). *Rejected:*
    keep closed; build next.
  - **(d) First import merges onto the bundle.** The baked data is the base the first import
    merges into, as every later import merges into the stored digest (D86); nothing is ever
    lost. Amends **D137**'s `IMPORTED||BAKED` and the staging base. Size M. *Rejected:* keep
    the replace and say it plainly; leave it.
  - **(e) "Pending" in the Choices card counts everything unanswered** — picks, unchosen
    subclasses, either/or choices left on their default — so the card agrees with the level
    chip, the class rows and the timeline (B1-07/08; app.js:1325–1331). *Rejected:* defaults
    count as answers; picks only.
  - **(f) The guide stage gets one mockup round** (two or three variants against the real
    stylesheet) before anything ships (B1-05, under D126/D131(c)). *Rejected:* leave; widen
    without a mockup.
  - **(g) Geometry: a FULL retrofit** onto type, spacing, radius, shadow and z-index scales,
    measured before and after (B2-05, size L). His call over the recommended migrate-as-touched.
    Runs as its own Phase L item, never inside a fix batch. *Rejected:* define-and-migrate;
    leave hand-built.
  - **(h) The refresh dead end folds into K3**, which resumes as the first build item (C2-02).
    No interim patch; the notice is dismissed per version until then. *Rejected:* patch now;
    hide the notice.
  - **(i) Versioning rule amended (D117, D140 unchanged): a commit that changes what is built
    bumps.** Docs, audits and scratchpad commits carry no version. *Rejected:* every commit bumps.
  - **(j) A headless engine test joins the gate as line five**, with an export shim and a boot
    guard inside app.js (a stated step past D157(e)); the pooling correction is fixture one.
    *Rejected:* after K3; no harness.
  - **(k) Gate and lint:** `deadfns` and the id cross-check gate; `deadcss` only with a
    dynamic-class allowlist (nine "dead" tokens were live by concatenation, V-C); the six
    source assertions fold into `cparity.js`; `cparity-formrefs.js` does not gate; eslint gates
    with `eqeqeq: ["always",{null:"ignore"}]` and unused `catch` params ignored; `package.json`
    stays. *Rejected:* lint as an optional script; everything strict.
  - **(l) Placeholders: drop the ellipses, keep the verbs** ("Add a class", "Filter books",
    "All schools", "Any save"), applied by the copy rewrite in one pass. Closes the 2026-08-30
    ⚑. *Rejected:* keep; ellipsis only where a dialog opens.
  - **(m) Small flags, all four FIXED in wave 3:** D125's clamp on a trade (carry the clicked
    section through `guideGo`); the `· optional` CSS twin aligned with the card's "Optional";
    `.tlswapc` restyled to a plate like `.tlalert` (D152); `sbFav` made edition-tolerant.
  - **(n) Items before rewards:** magic items as "prefill a custom source from an item" first
    (DC typed by hand; the variant cross-product ported into both extractors), rewards after.
    His call over the recommended rewards-first. *Rejected:* rewards first; park both.
  - **(o) The model queue stays live, all four:** SHADOWED source-aware; `subclassFeature`
    `_copy` records; long-rest swap detection; High Elf swap and Human origin categories.
    Polymorph / Shapechange creature sets are archived as out of scope (A-19 to A-24 noise).
  - **(p) The feature-table flag closes as read** (progression table, D149(a)). **(q) Doc diet:**
    DECISIONS.md becomes an index with bodies archived at the next `/clean`.
  - **(r) Usage, from him:** he uses every surface (Character card and pick modals, guided
    builder, timeline and slices, spell table and the printed sheet); he opens the Pages build
    on a phone at the table; NOT ticked: the 44-book library with the nag, authored custom
    content, comparing versions by hand. So A-08 (PWA install check) and a mobile pass rise;
    A-05 (compare) drops below A-03; the Pages first-run gets one line of copy in the rewrite.
  - **Enforced by:** PLAN.md Phase L task lines; the gate additions in (j)/(k) once landed; the
    rest prose. **Affects:** PLAN.md, CLAUDE.md (versioning clause, gate), STATE.md.

- **D159 (2026-09-02) DECIDED — what K3 stashes, and what makes a book stale.** AskUserQuestion,
  - **(a) The stash holds RAW json, and only for brews — never for core 5etools files** *Rejected:* **raw for everything hand-added** (~25 MB total, truest possible replay — it reverses D154(g)'s cost call); **slimmed for everything** (12.7 MB, but buys the saving with a quiet correctness hole).
  - **(b) Stale means the PARSER changed, not the version.** *Rejected:* keeping VERSION as the test (re-reads the whole library on every release, D158(i)); a fingerprint that also replaces the version on screen.
  - **(c) Stashed books re-parse automatically; web books are OFFERED.** *Rejected:* everything automatic including the refetch; everything offered (that keeps the nag K3 exists to delete).
  - **(d) Stash bookkeeping:**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D160 (2026-09-02) DECIDED — the first import merges at ASSEMBLY, and the bundle is never
  written to storage.** D158(d) settled the behaviour ("the baked data is the base the first
  - **(a) `assembleData` merges: `IMPORTED ? mergeDigests(BAKED, IMPORTED) : BAKED`.** *Rejected:* **writing `BAKED ⊕ incoming` into IndexedDB on the first Apply** — it duplicates 4 MB, and worse, it freezes a copy of the bundle that then WINS over the newer bundle a release later.
  - **(b) The staging base stays a STORAGE question.**
  - **(c) Removing a book you also have from the bundle removes YOUR copy, and the bundle's stays.** *Rejected:* a "removed" list that suppresses bundled books — a second, invisible piece of state to explain and to migrate.
  - **(d) Source counts are recomputed at assembly whenever an import is present.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D161 (2026-09-02) DECIDED — the guide step's picker lives IN the stage above the
  breakpoint, and stays a modal below it.** AskUserQuestion, three rounds over mockups against
  - **(a) Rounds 1 and 2 were REJECTED by Francesco, and the reason is the useful part.**
  - **(b) What is not on screen anywhere is the step's own WORK.**
  - **(c) The list uses the width it gains**
  - **(d) A pick leaves the list OPEN with the row marked**
  - **(e) Below the guide's own one-pane breakpoint (820) the picker is a modal, unchanged**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D162 (2026-09-02) DECIDED — the reviewed in-stage picker: the list REPLACES the button, in
  one column, and the end of a walk is one card.** Francesco's notes on v1.5.20, verbatim:
  - **(a) The list is the control.**
  - **(b) A multi-section step shows its sections as CHIPS** *Rejected:* one button per section (the redundancy he named); stacking every section's list.
  - **(c) One column, always.**
  - **(d) The end of a walk is ONE card.**
  - **(e) Also fixed, found while building (b):**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D164 (2026-09-02) DECIDED — the guide stage is a PICKER SURFACE, opened by default, with a
  preview pane.** Francesco on v1.5.21: *"weird background of the header, close button without
  - **(a) Both visual bugs were ONE cause, and the fix is not a patch.**
  - **(b) The picker is the step's DEFAULT surface.**
  - **(c) The preview pane is the app's OWN detail surface**
  - **(d) Every filter and option comes with the picker**
  - **(e) Two re-entrancy bugs, same shape, both found by walking every step:**
  - **(f) Leaving the guide must give the detail surface back.**
  - **(g) No redundant subtitle.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D165 (2026-09-02) DECIDED — eight adjustments to the guided builder, one of them a real
  bug.** Francesco's list, acted on in order. Amends D164 where noted.
  - **(a) The undroppable pick (the bug).**
  - **(b) And it says so:**
  - **(c) The detail pane earns its width or it does not open.**
  - **(d) The filter popover is no longer masked.**
  - **(e) The grouping header inside a picker was 13.5px semibold in the display face — the same weight as the spell names under it — with no air above.**
  - **(f) The walk's buttons grew**
  - **(g) The level chip leaves the guide's top bar.**
  - **(h) A finished section hands the picker over.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D166 (2026-09-02) DECIDED — seven of nine review notes, and what the other two are waiting
  for.** Francesco's second review of the guide. Amends D165(c,f) and narrows D147.
  - **(a) The last row of a picker was unreachable**
  - **(b) A preselected option counts as ANSWERED in the guide.** *Rejected:* dropping the preselection (the default is right far more often than not, and Next already writes it).
  - **(c) A prefiltered group wears a funnel.**
  - **(d) The detail pane CLOSES rather than collapses**
  - **(e) The walk's buttons: wider, not taller.**
  - **(f) XPHB is dropped from class and subclass menus**
  - **(g) The end-of-walk primary reads "Answer what is still open"**
  - **(h) Four CSS answers to one animation, all measured, all wrong**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D167 (2026-09-02) DECIDED — the next choice in a step is MARKED, and Next names it.**
  - **(a) The mark is the accent ring** *Rejected:* **B, a leading dot** (the chain's own open mark — quieter, but it adds a glyph to a row that is already carrying a counter) and **C, the rest recede** (answered chips dimmed, the next one at full strength — it reads as progress, but it says nothing on a step whose sections are all still open, which is exactly when the mark is wanted).
  - **(b) Hover REPLACES the mark, it does not layer on it.**
  - **(c) What gets marked: where the walk STANDS.**
  - **(d) Next walks the step's own sections before the level**
  - **(e) The button prints the chip's own label** *Rejected:* lowercasing unconditionally, which writes "eldritch Invocations".
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D168 (2026-09-02) DECIDED — the class step gets the full-size picker, and a class can be
  CHANGED.** Francesco, raw: *"a class cannot be changed once chosen — the step draws its value
  - **(a) The entity picker gains a `class` kind.**
  - **(b) Changing a level REWRITES the plan, it never adds.**
  - **(c) A class left with no levels leaves the build, and that take ARMS (D53).**
  - **(d) The cost is stated ONCE, in the bar, not per row.**
  - **(e) A class picker NEVER opens with its step**
  - **(f) The `<select>` goes; the two big buttons stay.**
  - **(g) Taking answers, changing edits.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D169 (2026-09-02) DECIDED — a take button says whether the question takes one answer or
  several, and the FIRST class opens its picker.** Two notes on v1.5.26.
  - **(a) `+` means "one more"; a ring means "this one instead".**
  - **(b) Which questions take ONE answer.**
  - **(c) The FIRST class opens its picker with the step.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D170 (2026-09-02) DECIDED — the chain rail collapses from its OWN header, into a narrow
  column.** Francesco: *"still no way to collapse the side rail, put a command in the rail header
  - **(a) The command belongs to the rail.**
  - **(b) The header draws unconditionally now.**
  - **(c) Collapsed is a COLUMN, not a hidden pane.**
  - **(d) No transition on the width.**
  - **(e) Every collapsed rule is gated on `min-width:821px`**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D171 (2026-09-02) DECIDED — the class picker gets the filters a class actually has.**
  - **(a) A filter that cannot mean anything does not draw.**
  - **(b) MAIN SCORE is the class filter**
  - **(c) The row leads with its main scores as chips**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D172 (2026-09-02) DECIDED — the filter set, picker by picker; the surface is still his to
  choose.** His note: *"Audit and rework all filters, studying how they are implemented in
  - **(a) A collapsed rail tile JUMPS, it does not expand**
  - **(b) The spell set, all four groups he was offered:**
  - **(c) The GUIDE's spell picker gets the same set and the same controls.**
  - **(d) Feats: prerequisite STATE and ability bonus.** *Rejected:* a repeatable switch (offered, not taken).
  - **(e) Species keeps books and nothing more.**
  - **(f) The visual standard is GATED on a mockup**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D173 (2026-09-02) DECIDED — the filter surface is the SECTIONED POPOVER, and three defects
  it exposed are fixed.** His pick of the three mocked in D172(f): **variant 1**. Closes that
  - **(a) A toggle chip keeps its box inside a popover.**
  - **(b) An ability toggle wears its signature colour.**
  - **(c) The OFF switch reads as a control, not as an absence.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D174 (2026-09-02) DECIDED — the filter menu is a stack of GROUPS that open one at a time,
  and every axis reads "empty means all".** M1b and M2 of Phase M, on the surface D173 chose.
  - **(a) A calmer chip.** *Rejected:* going back to bare text (that was D173(a)'s bug) and a checklist (calmer still, and four times taller).
  - **(b) EMPTY MEANS ALL, everywhere.**
  - **(c) One group open at a time**
  - **(d) The margins, and the two rules that were eating them.**
  - **(e) Books stay individually checkable**
  - **(f) M2: the spell filters, on BOTH spell pickers**
  - **(g) Duration is DERIVED, not extracted.**
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D175 (2026-09-04) DECIDED — a rich tag's display text is per-tag, not "segment 0".**
  - **(a) The cause.**
  - **(b) The rule.** *Rejected:* defaulting every tag to segment 2 — the FORMATTING tags (`@dice`, `@filter`, `@book`, `@chance`, `@color`) take pipes too and carry their display elsewhere, so a blanket rule prints a book code where a spell name belongs.
  - **(c) The gate grows a prose line.**
  - **(c) A granted spell's NAME is a link, and the jump remembers where it came from.** *Rejected:* a one-way link (cheapest, consistent with `attachSpell`, but you lose your place); expanding the spell in place under its row (keeps the feat on screen, but the block becomes a scroller and a spell's access chips and stat block do not fit it).
  → body: `ARCHIVE.md#d115-d175-bodies`

- **D176 (2026-09-05) DECIDED — the character-creator question: every destination is valid,
  and the boundary moves ONE rung at a time, scores + proficiency bonus first.** Closes
  D158(c)'s "decision entry first" (L5.8) and answers the question D158(a) recorded without
  answering. The study is `audits/character-creator-feasibility.md` (§6 has the three
  directions, §4 the ladder N0–N6).
  - **(a) Where a character lives.** Raw answer, to *"Where does a character live once it
    leaves My Spellbook?"*: **"All of these options"** — in My Spellbook itself, in
    character-forge or Notion, and on paper. Read as: the app is a creator in its own right
    AND the ecosystem's compiler AND the paper source, so no destination can be designed out.
    Consequence: the export surfaces (A-03 text plan for paper and Notion, A-09 the
    character-forge chassis) are part of the horizon, not alternatives to it; D36's
    file-export-only rule still bounds them. *Rejected:* one home (would have let one of the
    three directions retire the others).
  - **(b) How far, now: scores and proficiency bonus only** (N1 = A-06 as costed in
    `audits/A-direction.md` §3). Six base scores, the origin +2/+1 bonus, one `choices` entry
    per ASI or +1 feat pick, PB from character level; DC and attack per source on the table
    and the printed sheet, custom-source DC defaulting to "yours", prerequisite `checks` on a
    score resolving to pass/fail while every other check stays advisory (D31 holds). **Not
    in this rung:** backgrounds as entities, saves, skills, tools, HP, AC, gear, a sheet page.
    CLAUDE.md's non-goal sentence moves from "not modelled" to "scores and proficiency bonus
    only, nothing else" when N1 ships. *Rejected:* N1–N3 (scores, backgrounds,
    proficiencies — what a character-forge chassis needs; queued as the next rung, not
    taken); N1–N6 (everything, including gear and a sheet; only coherent with the
    spellbook-as-sole-home reading, which (a) declined).
  - **(c) The ladder is gated per rung.** Each further rung (N2 backgrounds, N3
    proficiencies/HP/AC, N4 gear, N5 sheet + second print kind, N6 homebrew for the new
    kinds) needs its own decision entry naming what stays out, because the audit's warning
    stands: once scores exist the next request is saves and skills. **D118(d)'s "full
    character creator (a different app)" is NOT superseded** by this entry — it is questioned
    rung by rung; N5 is the rung that would supersede it, and that call is his.
  - **Enforced by:** this entry, PLAN.md's Phase N; in code (v1.5.34): `abilityScores`,
    `featScoreGains`, `profBonus`, `castNums` and the `score` choice type in `app.js`,
    `abilities`/`originBonus` at the END of `serializeState`, `hidden`/`count` kept by both
    extractors' ability-gain normaliser, `cparity.js`'s "feat ability gains (byte-identical)",
    and `engine.test.js` fixture 11 (the slice, the ASI's either/or, blank derives nothing). **Affects:** CLAUDE.md non-goals (at N1 ship), D31, D115(b,h),
    D142(b), D148(c), D158(a,c), PLAN L5.8 (closed by this entry).

- **D177 (2026-09-05) DECIDED — the ability-score block: the TILE is the control, and each
  opens its own popover.** His six notes on N1 as shipped, one mockup round
  (`scratchpad/mockups/scores.html`, `python3 scratchpad/mkscores.py` regenerates — five
  shapes and the ⋯ menu), one interview.
  - **(a) Shape: D, the per-tile popover** (his pick, with amendments). Clicking an ability
    opens ITS popover, anchored to the tile, on the app's own `.menupop` surface: the base
    field first and FOCUSED on open (you type straight away), the origin bonus as pills,
    every feat that raised it read-only with its level, the custom bonuses, and a full-row
    **+ Add a bonus** as the LAST element. No total row — the tile already says it. The base
    field has a fixed width. *Rejected:* A, tiles read and rows edit (the breakdown always
    visible, tallest); B, the folded disclosure under the row (what shipped, plus a fold);
    C, an in-card sheet under the row for the open ability (grows the card); E, a read-only
    card with one edit modal (calmest card, a round trip per edit).
  - **(b) A custom bonus is per ability, named, and either ADDS or SETS.** `+1`/`-1` adds (a
    Manual, a curse); a bare number sets the score to it unless it is already higher (a
    Headband of Intellect's 19). Both from one field, told apart by the sign. Origin bonus
    stays a pill row (+2 · +1 · none) inside the popover; the tile-face cycler is gone (his
    note: at +0 it read as the modifier).
  - **(c) The tile face.** Chip, total, modifier; **main abilities tinted** with their own
    `--ab-*` colour, main = the UNION of every class's primary abilities (Wizard + Paladin
    tints Int, Str and Cha); a small **ring on the chip for saving-throw proficiency**, from
    the FIRST class only per the multiclass rule, with a hover that says so. No note beside
    the label, nothing under the block. *Rejected:* main = casting stats only; saves from
    every class.
  - **(d) The derived numbers move to the Slots & casts card:** proficiency as a stat tile,
    and one line per caster — class · casting stat · DC · attack. *Rejected:* inside the
    popover only (discoverable only by opening it); nowhere on the card.
  - **(e) The ⋯ menu, right-aligned in the label line, ships whole this round:** Standard
    array, Point buy (27, with the points left shown beside the label while it is the
    method), Type them (default), Roll (4d6 drop lowest, fixed), Fill for my classes (the
    pool's best values onto the main abilities, casting stats first), Clear scores (armed).
    Whatever the method, the tiles keep their shape. *Rejected, his call:* Swap two scores
    and Copy as text (removed); the editable roll formula (hidden — the roll is 4d6dl1).
  - **Enforced by:** `renderScores`/`openScorePop`/`renderScoreMenu` in `app.js`,
    `scoreBonus` and `scoreMethod` at the END of `serializeState`, `mainAbilities()` and
    `saveProfs()`, `engine.test.js` fixture 11's added assertions. **Affects:** D176 (the
    model, unchanged in scope), D142(b), D173, the N1 line in PLAN.

- **D178 (2026-09-05) DECIDED — second review of the score block (his nine notes on v1.5.35),
  and a wizard's copies leave the lower levels alone.** Amends D177 in place.
  - **(a) Origin pills follow the budget.** +2/+1 or +1/+1/+1: a +2 elsewhere, or two +1s
    elsewhere, hide +2 here; a +2 and a +1 elsewhere, or three +1s, hide +1 too. The
    ability's CURRENT value is always offered so it can be undone. *Rejected:* a soft flag
    after the fact (the row would let you build +2/+2).
  - **(b) Save proficiency is a border on the chip itself** (inset, so the chip keeps its
    size), not a ring beside it. The hover explanation stays on the chip.
  - **(c) The base field takes focus on open only while it is BLANK.** A filled score is
    read first; auto-selecting it invited overtyping.
  - **(d) Menu rows never wrap:** label on one line, the note UNDER it, both clipped.
    **"Fill for my classes" is an Optimize SWITCH**, not a verb: while on, the six values are
    kept best-first on the class order (casting stats, then primaries, then Con) after every
    edit and fill. The **roll's formula sits behind a chevron in line with the Roll row**,
    in the established dice notation — `4d6dl1`, `4d6kh3`, `3d6`, `2d6+6` — validated as
    you type, stored per build, the default 4d6dl1. *Rejected:* the formula as its own menu
    section (his call, v1.5.35 hid it); a free-text hint sentence.
  - **(e) The roll animates as monster-forge's initiative roll does** — his explicit ask, so
    the cross-project rule is set aside for this one mechanism: each tile's number becomes a
    column of twenty values in the formula's range with the real one last, scrolling up to
    it (1.35s, the same easing); the face underneath already holds the result, so reduced
    motion shows it at once.
  - **(f) A wizard's per-level tile reads the FREE allowance as its ceiling**, with the copies
    beside it (`4/4 +36`), and copies never eat the allowance of the levels below: the room
    at level L is the cumulative cap minus the FREE picks held above L, walked top-down.
    "40/40 · 2nd · max" was a wizard holding 4 free and 36 copied spells; the same book read
    "0/0" at 1st where 8 were still free. Non-wizard tiles are unchanged (the D70 floor).
  - **(g) The prepared-picks height** (his ninth note) is a design call — options and a
    mockup first, not a change in this batch. ⚑ in PLAN.
  - **Enforced by:** `originOptions`, `parseFormula`/`rollFormula`/`formulaRange`,
    `optimizeScores`, `animateScoreRoll`, the `freeAt` walk in `renderCart`, `.abchip.absv`,
    and `engine.test.js` fixture 12 (eleven assertions). **Affects:** D177(a,c,e), D70.

- **D179 (2026-09-05) DECIDED — third review of the score block, and the character's own
  menu in the build switcher.** His six notes on v1.5.36; amends D177/D178 in place.
  - **(a) Origin pills stay in place and DISABLE** when the budget rules them out (dashed,
    dimmed, a hover that says why), instead of disappearing (D178(a) hid them); a **Reset**
    on the Origin row clears the bonus on every ability, shown only while one is set.
  - **(b) The popover header is the ability's NAME alone** — the coloured chip was the
    tile's label repeated an inch away.
  - **(c) One geometry for the face and the reel.** The resting number is rendered in the
    reel's own structure (a 1em window, a column, one cell), so the roll's last frame and
    the face are the same box in the same font — measured 0.00px apart in x, y, width and
    height. His note: *"a subtle font or placement difference with the final result"*.
  - **(d) The build switcher's character row carries a ⋯ menu where the version count
    was:** **New empty version** (a blank build under the same character, placed after its
    siblings, named as the next version would be — and the character becomes NAMED, or the
    D35 auto-follow would rename the whole group after the blank build) and **Delete
    character** (armed, D53; every version through `deleteBuild`, which keeps the
    never-no-build and active-repointed invariants). The manager keeps its count.
  - **(e) The character name field has no resting border in either place**, exactly as the
    version name: a rule scoped to the switcher and the manager pins it, whatever a broader
    input rule says. (Measured transparent at rest before and after; the rule is a
    guarantee, not a fix for a border found.)
  - **(f) The Optimize switch sits on the label's line**, the note under the label only —
    a two-column grid, not a wrapping row.
  - **(g) Prepared budget & picks:** two shapes mocked (`scratchpad/mockups/picks.html`,
    `python3 scratchpad/mkpicks.py`) — fold per class, group by level — 🔶 his pick.
  - **Enforced by:** `originOptions` + the disabled pill in `fillScorePop`, `renderScoreNums`'s
    reel-shaped face, `newVersionOf`/`deleteCharacter` and the group menu in `renderBswPop`,
    the `.bswgrpn`/`.bldchar` resting-border rules, `.scoremenu .mswitch` grid.

- **D180 (2026-09-05) DECIDED — the picked chips are grouped by spell level, and a big group
  is ONE ROW that scrolls.** Closes D178(g)/D179(g) after the two-shape mockup
  (`scratchpad/mockups/picks.html`).
  - **(a) Shape: group by level** (his pick of the two, amended): a header per level with
    its count, the chips under it. **Not a fold** — past a threshold (12 chips) the group is
    one row scrolling horizontally under the right-edge mask, exactly the Access row in a
    spell's detail (D124's `.tlchips` mask), with a toggle that wraps it open; under the
    threshold the chips wrap as before. *Rejected:* fold per class behind a summary line
    (recommended; he preferred the levels readable at a glance); both combined; a
    one-line field for the whole run; dropping the chips from the card.
  - **(b) Open while few, folded past the threshold — automatic**, no state stored: a
    group's manual wrap-open lives for the session only. *Rejected:* remembered per build;
    always closed on load.
  - **(c) The wizard tile reads held over free, plainly:** `40/4`, no `+36` — *"the key is
    to get the second number correct"*. The copies stay in the tile's colour and title, and
    the level header says "40 · 4 free".
  - **Enforced by:** `PICK_ROW_MAX`, `PICK_EXP` and the `.pgrp` block in `renderCart`;
    `.pgrp.many[data-exp="0"] .cartchips`. **Affects:** D178(f), D142(a), D124.

- **D181 (2026-09-05) DECIDED — the level tiles fold into the level rows; and two D173-class
  fixes.** His three closing notes; one mockup (`scratchpad/mockups/fold.html`,
  `python3 scratchpad/mkfold.py`, shapes A and B), one interview.
  - **(a) Shape A, chips always shown** (his pick, amended): the tile row is gone; every
    level from cantrips to the top castable one is a row — its name, the tile's numbers
    (held over what you can hold there, the max mark, the over/copied colour, tap to edit
    picks as the tile did), and its chips under it. Past 12 chips the chips are ONE ROW
    scrolling under the mask, and **the toggle sits at the chip row's right end**, as the
    Access row's does in a spell's detail, wrapping the full list open. An empty level says
    "none". *Rejected:* A with a chevron per row (chips hidden until opened); B, the tile
    row kept with each tile a toggle for its level.
  - **(b) Session memory only:** opened rows are remembered until reload, nothing stored.
    *Rejected:* top level open by default; remembered per build.
  - **(c) The Optimize switch had been stripped to its knob** by `.menupop button` (the
    D173 trap: transparent track, 7px radius, 8px padding) — the track is restated inside
    the score menu; OFF's ring measures 6.36:1.
  - **(d) The version name in the manager measured a line-strong border on a filled box at
    rest;** pinned borderless like the character name (D179(e)).
  - **Enforced by:** the `tiles` map and `.pgrows` loop in `renderCart`, `.pgtile`,
    `.pgrow` + `.pgtoggle`, `.scoremenu .mswitch .swk`, `.modal .bldname`. **Affects:**
    D70 (the floor now lives in the row's tile), D178(f), D180.

- **D182 (2026-09-05) DECIDED — the feat filters read the prerequisite STATE, and every
  filter surface speaks the menu's vocabulary.** Phase M's M3 and M4, both from D172; shipped
  as v1.5.40.
  - **(a) Prerequisites is a three-way toggle row, not a switch.** "Eligible only" hid
    everything the engine rated "no" — and D31's "maybe" went with it, flattened into a no.
    The row's three chips are the engine's own states: **Eligible** (`ok`), **Not yet**
    (`no`), **Can't verify** (`maybe`), any subset, empty means all (D174(b)). Feats,
    invocations and species share it; the class picker has no prerequisites (D171(a)).
    *Rejected:* keeping the switch beside the row (two controls for one fact); a repeatable
    switch (D172(d) already declined it).
  - **(b) Ability bonus is a row of the six scores** in their D173(b) colours, feats only. A
    feat matches when ANY of its `ability` entries names a selected score, so a "choose one
    of Int/Wis/Cha" feat answers for all three and the ASI's either/or answers for all six —
    which is what those feats do. Nothing new is extracted: `ability` has carried the
    scores since D176.
  - **(c) One name per thing, across every filter surface.** The table's filter card said
    "Source book", "Casting time", "Saving throw", "Damage type", "Class / list", "Tags",
    "Editions" where the pickers' menu (D174) says Books, Cast time, Save, Damage; now the
    card says the same, plus **Access** (who gives you the spell — the noun the spell detail
    already uses) and **Properties** for the ritual/concentration/attack/upcast/material
    row, whose chips lose their abbreviations ("Concentr.", "Atk roll", "Consumes mat.") and
    take the names the active-filter strip already printed. Every select's empty option is
    **All**; the book quick actions are All · None · 2024 core · My sources, as in the menu;
    the prepared list's level popover and the forms picker's book head follow.
  - **(d) A binary is a labelled switch.** "Editions" (a two-option select) is **Reprints**,
    a `.swk` switch: on shows every printing, off the newest only; its strip chip reads
    "Reprints". The forms picker's "Only the ones I've marked" checkbox is a **Marked**
    switch. `syncSwitch`/`syncReprint` draw both from state, the way `filterMenu` draws its
    own; `state.filters.reprint` keeps its `dedupe|all` values, so stored builds are
    untouched.
  - **Enforced by:** `entFilterGroups` (`prq`, `raise`), the `prq`/`raise` clauses in
    `renderEntityList`, `F_TAGS` as the one source of the property names, `syncSwitch`.
    **Affects:** PLAN.md (Phase M closes), D31, D172(d), D174, `audits/copy-table.md` (the
    M4 rows, for the veto pass).

- **D183 (2026-09-05) DECIDED — a `classVariant` list is class membership.** His report:
  *"I can't see the Battle Familiar spell while building a Warlock (which 5etools marks as a
  class receiving the spell)."* The generated lookup files a spell's classes under two keys:
  `class` (the class's own list) and `classVariant` (a list a BOOK adds the spell to —
  Fizban's dragon spells for the sorcerer and wizard, Arcana Unleashed's Battle Familiar for
  the druid, warlock and wizard). Both extractors read only `class`, so every such spell was
  reachable through a subclass or a feat and never through the class. The local mirror
  already carried 180 of them; the live library, 213. Shipped as v1.5.41.
  - **(a) Both keys are membership, deduped, in both extractors.** A spell's own source
    already gates whether it is offered; the class list needs no second gate. `extract.js`
    had honoured the older inline `fromClassListVariant` all along — this is the lookup-era
    twin of that rule. *Rejected:* a `variant` marker on the class entry (nothing in the app
    would read it, and the book's text says "added to the list", not "optionally").
  - **(b) It reaches the live page through the parser fingerprint** (D159(b)): `__PARSER__`
    moved with `extract.js`, so a stored library is re-read on the next visit — no re-import.
  - **Enforced by:** the `("class", "classVariant")` loop in `extract.py`'s lookup pass and
    its twin in `extract.js`; `cparity.js` compares `cls` byte-identical (0 fail, and the
    mirror's 180 exercise it). **Affects:** GOTCHAS.md (extractor gaps), D91, D22.

- **D184 (2026-09-05) DECIDED — the card you are standing on owns the slot, and Skip is
  final.** His report, two bugs in one message: *"sometimes, after tinkering with spell
  selection in the guided builder, a spell becomes 'unselectable' even though I fit the
  requirements"*, and *"the guided builder doesn't really let me skip a step, it always
  guides me back to the empty step unless I keep skipping."* Both reproduced on a Sorcerer 5.
  One cause under them: **D125 read the ROW's first open slot as the landing for every
  section of that row**, which was true when it was written and stopped being true the day
  D146 made a drop leave an empty slot. Dropping one 1st-level pick from a level 5 card
  re-capped that card at 1 — **112 spells to 30, every 2nd- and 3rd-level one gone** with only
  a hint line saying why — and the same reading dragged the walk back to the level that owned
  the hole, which is what made Skip alternate between two steps forever. Shipped as v1.5.42.
  - **(a) A section's landing is its OWN first open slot** — an empty slot inside its range,
    or its first position past what the array holds. `secOpenSlot` is the single owner;
    `guideLandingSec`, the picker's cap and `toggle`'s write all read it, so they cannot
    drift apart the way the cap and the insert point had. An empty slot an earlier level
    left behind is **that level's question**, not this one's. *Rejected:* keeping the model
    and extending the clamp to cover an answered section, so the walk moves you to the L1
    card where a 30-spell list explains itself (faithful to D125 and smaller, but it makes
    dropping a low-level pick yank you back down the walk — the second half of his report);
    compacting the array on a drop so no hole is ever left (reopens D146, which was decided
    the other way: a drop would re-date every pick below it).
  - **(b) The pool is the SECTION's reach, never the landing's.** `castMax` comes from the
    section you are standing on. Where the section is full and a take will really land in an
    earlier empty slot, the hint says so per level — "A spell of level 1 or lower taken here
    fills your still-open L1 slot instead" — instead of the list silently shrinking.
  - **(c) The view stands on the section's own level.** `openGpickSec` used to preview the
    LANDING section's level, which re-created (b) from the other side: a fresh open of a full
    level 5 card with a level 1 slot outstanding moved the view to L1 and `R.pool` narrowed
    to 30 before the cap was ever consulted. On the section's own level the pool, the cap,
    `sliceInsertAt` and `toggle`'s write all agree.
  - **(d) Skipped levels leave EMPTY SLOTS, exactly as a drop does (D146).** A take on the L3
    card of an empty row lands at slot 4 with slots 0–3 standing open, rather than falling
    into slot 0 and going red — which is the illegal-slot hazard D125 was raised about,
    solved at the source instead of by moving the reader.
  - **(e) SKIP IS FINAL.** `guideGo` records any step the walk moves off while it is still
    open, and the clamp may never retarget you onto one; landing on a step clears it, because
    you asked for that one. The step stays open and flagged in the chain either way — Skip
    still commits nothing (D126(e)). *Rejected:* deleting D125's clamp outright (his call:
    narrow it, don't retire it — and with (a) in place its premise is unreachable, so it now
    costs six lines and guarantees the rail can never contradict the picker).
  - **Enforced by:** src/app.js `secOpenSlot` (the one owner), `guideLandingSec`,
    `openGpickSec`, `toggle`'s `slots` argument — handed over by the CALL SITE, never read
    off the walk (D133(a)) — and `GUIDE.passed`. **Fixture 13** in `scratchpad/engine.test.js`
    covers the landing rule and the padding; both go red if either is re-pointed at
    `firstOpen`. **Affects:** D125 (premise corrected), D146, D118(b,g), GOTCHAS.md.

- **D185 (2026-09-05) DECIDED — the guide gives the detail surface back, and a step that
  owns a slot CHANGES it rather than overspending.** Two reports: *"on the guided builder
  character view, I should be able to open spell details or other details"* and *"there is no
  way to change a selected feat in the guided builder."* Unrelated causes, both reproduced.
  Shipped as v1.5.43.
  - **(a) The detail surface comes back when the walk goes aside.** `SPMODAL` is a SINGLETON
    that the stage BORROWS: above 1100px `stagePrev()` MOVES it into the guide's preview pane
    (D166) so clicking a name fills the pane instead of opening a dialog. `renderGuide`
    returned at `aside` BEFORE the code that hands it back, so the guide slid off-screen and
    `inert` still holding the app's only detail box — and every detail the character view
    opened rendered into it. The click worked, the state changed, nothing appeared: D149(e)'s
    dead-control shape, one layer out. `stagePrevPut()` now runs on the way out. The PICKER
    stays hosted, so returning finds the step as you left it (D130(e)) and re-borrows the
    surface — a detail you were reading follows you back into the pane. *Rejected:* dropping
    the whole hosted picker on the way out (loses the step's open surface, which is exactly
    what the aside contract promises to keep); giving the pane a detail box of its own (two
    surfaces to keep in step, and D166 chose the move for that reason).
  - **(b) A guide step owns ONE slot, so a full slot changes rather than overspends.**
    `takeFeat`/`takeOpt` fill a hole or append and never consult the budget — right outside
    the guide (flag, don't prune, D42) and wrong inside it, where a step's card claims one
    answer. Clicking a second origin feat read **`origin 2/1`** with the card still naming the
    first; three metamagics read `3/2`. The picker now carries `owns`, a DESCRIPTOR (`{key}`,
    null while the slot is empty) handed over by the CALL SITE and never read off the walk
    (D133(a)) — so every other surface leaves it null and keeps the old behaviour. Once
    `entSlotSpend()` says the slot is full, a take drops what THIS step holds and the new
    entry lands in the hole it leaves (D146), keeping the level that slot arrives at.
    **Within budget nothing changes**: two metamagics at Sorcerer 2 are still two clicks, and
    an in-budget add does NOT re-point ownership — that pick went to a SIBLING step's slot,
    and aiming the next change at it would rewrite another step's answer. His call, over
    refusing the click with a "this slot is full" message, and over showing every feat in the
    slot on the card and leaving the overspend. Covers feats AND optional features, his call:
    one code path, and fixing one would leave a known twin.
  - **Enforced by:** src/app.js `renderGuide`'s aside branch; `entSlotSpend` (the one owner of
    the numbers the budget pill prints, so the pill and the rule cannot disagree),
    `entOwnsSwap`, `ENT.owns`, and the `held` field on feat/optfeat sections. **Fixture 14**
    in `scratchpad/engine.test.js` pins the cap rule and the untouched sibling; it goes red on
    a revert. **Affects:** D166, D149(e), D130(e), D42, D84, D146, GOTCHAS.md.

- **D186 (2026-09-05) DECIDED — a pick you already hold never moves, and a spell your build
  already grants says so.** Two of the six items in his 2026-09-05 report. Shipped as v1.5.44.
  - **(a) The previewed-level pull-back is REFUSED, with a reason.** His note: *"there's still
    a spell placing bug when picking and removing spells that moves spells to random earlier
    slots."* Standing at level 3 and clicking one spell the build acquires at level 8 re-dated
    FIVE picks (Cloud of Daggers L4→L5, Antagonize L5→L6, Counterspell L6→L7, Backlash L7→L8)
    and dropped a 4th-level spell into a level-4 slot a Warlock cannot cast from. `toggle`'s
    pull-back (D115(d)) still did `splice(i,1)` then `splice(at,0,…)` — the exact move D146
    outlawed for a drop, which survived only because this path predates the slot model. The
    click now changes nothing and says where the pick really lives. His call. *Rejected:*
    keeping the pull-back but trading places with the pick already in that slot (two spells
    re-dated instead of five, and it can still manufacture an illegal slot); dropping the pick
    instead (recommended, declined — a click that deletes from a list where the pick never
    showed is the surprise D115(d) was written against).
  - **(b) A spell your build already grants is marked in the guide's picker.** His note. The
    main table has said this since D104 — it drops the class's take button and shows the
    granting source — but the guide's picker never did, so a spell a subclass hands you free
    read as a plain choice. It is still OFFERED (nothing here is ever blocked, D31); it just
    carries a chip. The chip claims **always prepared** only where `always` really holds this
    class row, and **already granted** otherwise: `always` carries class-row indexes only
    (D104), so a feat, a species or a custom source grants the same spell without landing
    there, and a limited free cast is still worth taking as a known spell where an
    always-prepared one is not. *Rejected:* excluding them from the pool the way `openPick`
    does (he asked for them to be MARKED, and a spell that vanishes teaches nothing).
  - **Enforced by:** src/app.js `toggle`'s `later` branch, `alreadyAlways`/`alwaysChip`, and
    `.alwchip` in styles.css. **Affects:** D115(d) (its pull-back retired), D146, D104, D31.
  - **Still open from the same report:** the swap system's rework (a mockup owes him a
    choice), the SRD product-identity merge, the connected-choice collapse, and the trade that
    still offers a spell already swapped away — that last one needs his build to reproduce.

### Superseded
- ~~**D14** Level budget = free distribution~~ → **D18.** Free distribution was wrong for
  known/level-swap casters (a Bard learns spells on level-up capped at its top slot); it survives
  only for daily preparers.
- ~~**D22** Sub-heading style = accent uppercase~~ → **D24b.**
