# DECISIONS — My Spellbook (live)

> **This file is the COLD-READ half.** It holds only what constrains work in progress:
> **Binding** (rules that bind any change to a live surface), **Live** (the phase being built),
> and **Superseded**. Everything else — 147 entries, D7 → D196 — is the settled record in
> **`DECISIONS-SETTLED.md`**, which is a reference, not a read: open it when you are about to
> propose something, cite something, or touch a surface it owns. `grep -n "D146" DECISIONS*.md`
> finds any entry in one step.
>
> Split 2026-09-07 (`/clean`), completing **D158(q)/L5.11** — the audit measured DECISIONS at
> ~75k tokens per `/start` and asked for an index. Nothing was rewritten in the move: entries
> are verbatim, in their original order.
>
> **Conventions.** `D-id · date · headline · rejected options`. A strike-through with `→ D-id`
> is a supersession, never a deletion. A rule marked **→ Gotcha** has its enforced-in-code copy
> in `GOTCHAS.md`, which is the version to trust. An entry ending `→ body: ARCHIVE.md#…` had its
> narrative and verification evidence archived by an earlier `/clean`; a headline that was cut
> ends `…`.
>
> **When you add a decision:** it goes in **Live** if it constrains the phase in progress,
> **Binding** if it will constrain every future change to a surface, and it moves to
> `DECISIONS-SETTLED.md` at the `/clean` after its phase closes.

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


- **D198 (2026-09-08) DECIDED — the control scale: 34 / 28 / 22, and bare.** His call, off the
  filters row D196(f)'s sweep turned up: *"set a DS standard for buttons and apply it across
  the whole app."* Censused first — every button the app renders across nine surfaces, 40 class
  signatures, ~1,300 instances. Shipped as v1.5.56.
  - **(a) What was there.** Controls that read as buttons stood at **nine heights**: tabs 26,
    `.iconbtn` 27 in a card, `.x` 28, `.pickbtn` 30, `.btn` 32/32.8, fields and `.picksel`
    33.5, the header family 34, a menu row 35.5. The same class changed size by context —
    `.btn.iconbtn.ico` was **27px in a card and 34px in the header**, which is the funnel
    beside a 33.5px field he was looking at. Chips stood at four more: 19, 20, 21.5, 21.8,
    22.5, 27.3.
  - **(b) Three sizes and bare.** `--ctl-h:34px` — anything you click or type in that sits in
    a form or a toolbar (`.btn`, `.pickbtn`, `.picksel`, `.iconbtn`, `select`, `input`, the
    stepper, `.bswitch`, `.lvlchip`, `.prepbtn`). `--ctl-h-compact:28px` — dense contexts (a
    modal's closer, `.abtile`, `.gtchip`, `.helpbtn`). `--chip-h:22px` — a tag you toggle,
    which is not a control (`.tk`, `.cbtn`, `.pgtile`, `.lvltools-btn`, `.prepstep`). And
    **bare**: `.xsm`, `.rm`, `.fldinfo`, `.swk`, `.lvlfold`, `.gwalkbtn` have no box at all,
    are sized by their glyph and align by the row. **A new control picks one. It does not
    invent a height.** 34 was chosen because the whole family already sat within ~1.2px of
    it, so this is a rounding-up, not a redesign. *Rejected:* two sizes only (it forces the
    modal closers and inline row actions to 34, heavy in dense rows); a fourth 40px "primary"
    (a size that exists nowhere today, so every use of it is a fresh judgement call).
  - **(c) `min-height` for anything with a label, `height` for anything without.** A button
    whose label wraps — the guide's "Next →" at 320px — must grow, never clip; a single-line
    pill must be brought DOWN to the scale, which `min-height` cannot do. So `.btn`,
    `.pickbtn` and `.picksel` take `min-height` and the chips take `height`. All of them take
    `box-sizing:border-box` and flex centring, or a one-line label sits at the top of its box.
  - **(d) What is deliberately NOT in the scale.** **List rows** — a `.menupop` item (35.5) and
    the guide's `.gcstep` (36.3) are full-width rows in a list, not controls in a row; they
    are self-consistent and sizing them as controls would be wrong. **Segmented and nav
    strips** size their own track: the tabs are 26px buttons inside a 34px track, the phone
    `.jumpbar` is five 31.3px buttons — the strip is the control, its segments are not.
    And a control inside another control fills it, it does not take the scale: the stepper's
    − and + are 32px inside its own 34px box.
  - **(e) Enforced by measurement, not by eye.** Two sweeps run over nine surfaces at 375 and
    1280 — build, table, timeline, builds, library, homebrew, custom spell, the settings menu,
    the filter panel, the detail modal and the guide. One asserts **no control is clipped or
    escapes its parent**; the other asserts **no row holds two controls more than 1.5px apart**.
    Both are empty. Three rows the second one caught and this fixed: the filters row
    (`#fChosen` is a control in a control row, so it takes 34 and keeps its pill shape — a
    `.cbtn` in the filter PANEL is still a 22px tag), the Library modal's header (a 20px help
    circle beside a 28px closer) and the guide's header (a 22px closer between two 34px
    buttons).
  - **Enforced by:** src/styles.css `:root`'s `--ctl-h` / `--ctl-h-compact` / `--chip-h` and
    every rule that reads them. **→ Gotcha. Affects:** D196(f), D197, D47, D180, D182.

### Live — the phase in progress (Phase N, the creator ladder)

The three entries a session picking up N3 has to have read. Everything else from Phase N —
D177–D181 (the score block), D182–D190 and D193–D196 (Phase M's close, his bug batch, the
closed one-offs) — is settled and lives in `DECISIONS-SETTLED.md`.

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

- **D191 (2026-09-07) DECIDED — N2: a background is the origin, and nothing else.** The rung's
  own entry, which D176(c) requires before anything is built. Interviewed 2026-09-07; four
  calls, all his.
  - **(a) Origin only.** The background owns the two things N1 asks you to set by hand — the
    **+2/+1 origin bonus** and the **origin feat**. Its skills, tool, language and starting
    equipment are extracted and READ ON ITS DETAIL as text, and nothing derives from them, so
    D176's "scores and the proficiency bonus, and nothing else" still holds word for word.
    *Rejected:* modelling the proficiency choose-shapes too (it is most of N3's `profs` slice
    pulled forward, and the non-goal sentence would have to be rewritten a rung early);
    the full 2024 entity with equipment (N2+N3+N4 as one rung, against D176's one-at-a-time).
  - **(b) A background NARROWS the origin pills, it does not own them.** With a background
    picked, the pills offer only the three abilities it names, with D178's +2/+1 vs +1/+1/+1
    budget still applying inside those three. With none picked they stay free, exactly as
    v1.5.39 ships. *Rejected:* the background merely SUGGESTING with an apply button (nothing
    is ever refused, which fits D31's advisory habit — but then the origin bonus has no owner
    and the background is decoration); the background owning the bonus outright and the pills
    leaving the score tiles (cleanest model, but a build with no background loses a control it
    has today and N1's surface gets rebuilt one release after shipping).
  - **(c) 2024 backgrounds only** — those carrying an `ability` block. A 2014 background has no
    ability bonus and a prose "feature" where the origin feat goes, so under (a) it would grant
    NOTHING this rung models. *Rejected:* extracting both and letting the Editions filter and
    D19's reprint dedupe separate them (the consistent answer, and what species and classes do
    — but every 2014 row would be a pick that changes nothing, which is worse than absent);
    both with 2014 dimmed and a `why` (D40's machinery for a case the filter already covers).
  - **(d) The Character card, and the guide's FIRST step.** A background row beside species and
    class, and a guide step that comes **before** the score step, so the pills are already
    narrowed when you meet them. *Rejected:* a step after the scores (cheaper, but picking a
    background would then re-narrow pills you have already set and send the walk backwards —
    the exact shape D184 spent v1.5.42 removing); the card with no guide step at all (the
    bonus set in one place and constrained from another, with nothing walking you through it).
  - **(e) The origin feat is OFFERED, never written behind your back.** The background names
    it and one click takes it into the origin slot; nothing about picking or changing a
    background ever adds, removes or replaces a feat on its own. Settled while building, not
    in the interview. *Rejected:* taking it automatically on the pick (it is what the rules
    say, and it would silently edit `state.feats` — the acquisition order (D115(b,h)) is his
    data, changing background would have to guess whether the feat there was still "the
    background's", and D42's flag-don't-prune exists precisely because this app does not
    rewrite picks it did not ask about).
  - **(f) Two boundaries this rung leaves standing, deliberately.** ① The guide step is
    **second, not first** — after the class step, which every other step's existence hangs
    off, and before species, the origin feat and every score question, which is the order the
    2024 book itself uses and the whole reason (d) wanted it early. ② A book that publishes
    **only** backgrounds is not in the source registry, so it would not be listed and
    `filterDigest` could drop it: the registry counts spells, classes, subclasses, feats and
    species, and adding a sixth count touches both extractors, the Library strip and the
    filter. Every one of the six books with 2024 backgrounds is already in the registry
    through its feats, so nothing is hidden today — → **Gotcha**, and a real cost if a brew
    ever ships backgrounds alone.
  - **Enforced by:** both extractors (`backgrounds.json`, 2024 filter, and `cparity.js` proves
    them equal record by record), `DIGEST_ARRAYS`/`ENT_KEY`/`emptyDigest`/`assembleData` (all
    four, or the array survives the merge and vanishes at assembly — it did), the entity
    picker's `background` kind, `state.backgroundKey`, `originOptions`'s narrowing, and
    **fixture 19**, which goes red on a revert. **Affects:** D176, D177(b), D178, D168, D19,
    D118(d), D42, and **D192**, which hides all of it in Simplified.

- **D192 (2026-09-07) DECIDED — the creator ladder is a MODE, not a destination.** His ask,
  raised in the N2 interview: an app setting that switches between complete and simplified
  character creation, "simplified removes all unnecessary elements and essentially streamlines
  for spellbook creation". This re-reads D176: the rungs stop being how far the app has
  climbed and become how far THIS session wants to climb.
  - **(a) Simplified is the app before N1, exactly.** No score block, no background, no origin
    bonus; the proficiency bonus, each caster's DC and attack go back to **ruled blanks for a
    human**, and a `13+` prerequisite reads "can't verify" rather than yes or no. That is not a
    new behaviour to write — it is D176's own stated fallback, the path a build with no scores
    entered already takes. His call, over two softer boundaries. *Rejected:* hiding only what
    does not touch spells and keeping a minimal casting-ability input so DC and attack stay
    numbers (the most useful reading of "streamlined for spellbook creation", and the rule
    scales as N3–N5 land — but it invents a third, half-sized score surface to maintain);
    hiding only the non-spell rungs with the score block whole (barely simplifies anything
    today, since the scores are most of what is on screen).
  - **(b) Simplified is the DEFAULT, and the setting is app-wide** (his call, explicit): a
    switch in the settings menu beside the theme, stored outside the build like every other
    global preference (`spellForge.*`), and changing it changes every character at once — not
    a per-build property. So the app opens as what it has always been, a spell planner, and
    Complete is opt-in. *Rejected:* Complete as the default (nothing changes for anyone who
    never opens settings, but the app's plainest use goes behind a setting); asking once per
    character and remembering it per build (fits builds that differ in kind, and he asked for
    an app setting, not a per-build one).
  - **(c) Simplified HIDES, it never prunes** — the flag-don't-prune rule the source toggles
    already follow (D42), applied to a mode. Flip to Simplified and back and every score, every
    origin pill and the background are where you left them; nothing stored is dropped and no
    export loses a field. Taken from convention, not asked.
  - **(d) One gate, not a sweep of hidden classes.** `abilityScores()` is the single funnel
    into `R.scores`, so Simplified makes it return the empty score set and DC, attack, the
    prerequisite verdicts and the print's blanks all fall back to the pre-N1 path for free;
    the proficiency bonus derives from LEVEL, not scores, so it needs its own gate beside it.
    The surfaces are emptied, not merely covered: `#scoreBlock` takes `hidden` AND
    `renderScores` returns before building a single tile, popover or listener, so Simplified
    carries no dormant controls. The score CHOICES stop at the same one gate — `featScoreGains`
    pushes none — so the guide and the Choices card ask nothing without either knowing about
    the mode.
  - **Enforced by:** src/app.js `abilityScores`, `profBonus`'s caller, `renderScores`, the
    guide's step list; an engine fixture pinning that Simplified derives nothing and that a
    round-trip through both modes restores byte-identical. **Affects:** D176, D191, D177–D181,
    D42, D31, D108's print.

### Live — Phase O, the spell table's filter and sort

- **D199 (2026-09-08) DECIDED — the spell table filters and sorts, from ONE button in its
  heading.** His ask, opened 2026-09-08: *"add filtering and sorting tools to the spell
  table."* Designed against four mockups (`python3 scratchpad/mktable.py` regenerates
  `scratchpad/mockups/table{1,2,3,4}.html`); **table4 is his shape**, and it is none of the
  three I offered.
  - **(a) The filter narrows on BOTH sets, in one sectioned popover.** The axes only this
    table knows come FIRST — **Prepared status · Granted by · Casting ability · Book** —
    then the picker's own spell axes, reused verbatim from D174: level, school, cast time,
    duration, components, damage, save, condition, plus the ritual and concentration
    switches. `filterMenu` / `spFiltGroups` / `spFiltOk` are called, never re-implemented,
    so "empty means all", OR-within / AND-across and components-are-AND all hold here by
    construction. *Rejected:* the picker set only (no way to ask "what is prepared today",
    the one question this surface exists for); the table-only axes alone (you would leave
    the table to ask for your concentration spells).
  - **(b) The surface: one button in the heading, and a chip field above the table.** The
    card heading grows exactly one control — a filter `.iconbtn` between **Prepare daily**
    and the **⋯**, wearing the accent and a dot while anything is set. What is set reads as
    a **chip field above the table**, present only when narrowed, **each chip dropping its
    own axis** with the clear-all `×` at the right (D142(c)'s line, made interactive).
    **No search box** — his call, reversing the earlier yes: the table is your own spells
    and the axes reach them. *Rejected:* a filters row like the eligible-spells card's
    (table1 — a whole row of chrome for a surface that already has a heading with room in
    it); everything inside the ⋯ menu (table2 — the menu becomes long and every setting is
    behind a button); a visible toolbar (table3 — two full rows before you reach a spell at
    375px).
  - **(c) A sort orders rows INSIDE the groups, and "No grouping" is how you flatten
    them.** Group by gains a fourth value, **No grouping**, which is the only way to read
    the whole list as one ordered run — his amendment, taken in the interview. *Rejected:*
    a sort that silently flattens the groups (two controls whose states contradict each
    other); grouping and sorting as fully independent axes at once (more to hold in the
    head than the table earns).
  - **(d) The sort is invoked BOTH ways, one piece of state.** A **click on a column
    header** sorts by it, a second click reverses, and the app's drawn caret marks the
    active one; a **Sort by select + Reverse** sit in the ⋯ menu beside Group by. Each
    reflects the other, and the select is what a **hidden** column falls back to. *Rejected:*
    headers alone (a column you have hidden becomes unsortable, and the print sheet inherits
    a sort with no visible cause); the select alone (ignores the control the reader's eye is
    already on).
  - **(e) Filter, sort and group all persist globally**, in `spellForge.table.v1` beside the
    column order and hidden set — his call. One rule for every table preference. What keeps
    it honest is (b)'s chip field and the button's dot, plus **(f)**. *Rejected:* a
    session-only filter (recommended, and declined — it would forget the reading you set up
    every reload); per-build persistence (it would make a view preference part of his data,
    exported and travelling, which no other view preference does).
  - **(f) The count chip reads "15 of 47" while narrowed**, and "47 spells" when it is not.
    The heading says the table is narrowed before you look at anything else. *Rejected:*
    leaving the chip alone; "15 of 47 shown" (the heading is the surface D196 just spent a
    release keeping to one row).
  - **(g) The print sheet takes a toggle, default OFF.** Print already renders exactly what
    `tableRows()` returns, so a filtered sheet is one line of plumbing — but it is also how
    you take half a spell list to the table by accident. It becomes an explicit print option
    beside the page-break switch. *Rejected:* print always following the filter (the useful
    default and the dangerous one); print always ignoring it (removes the best thing the
    filter could do here).
  - **Two defects this work closes, both found while mocking it up.** ① `filterMenu` appends
    a `.lvlcar` chevron to every filter-group head, but `.lvlcar` is only ever dressed under
    `.lvlgroup h3`, `.gclv` and `.scoremenu .mchev` — **so in every live filter menu that
    element is 0×0 and invisible**, and the open/closed groups have had no chevron since
    M1b shipped. ② `.afchip` measures 22.5px, a hair off `--chip-h`; it takes the token
    (D198). → **Gotcha** for ①.
  - **(h) His note, 2026-09-08: the switch's ON state has been invisible app-wide.**
    `.menupop button` (0,1,1) sets `background:none` and OUTRANKS a bare `.swk` (0,1,0), so
    every switch inside a popover drew its ON state fully transparent — `rgba(0,0,0,0)`
    measured against the accent's `rgb(217,145,95)` outside one. `.swoff` is (0,2,0) and won,
    which is why only the ON state vanished and why it read as "off looks fine, on is
    missing". The two menus with their own scoped rules (`.scoremenu`, `#menuPop .mswitch`)
    escaped; the filter menus have been like this since M2 and the creature carousel's
    **Marked** since D81. Fixed by doubling the class (`.swk,.swk.swk`) rather than by
    scoping it again — one rule, every switch, whatever it sits in. A **disabled** switch
    also styles itself now, because `#tSortRev` is dead while no sort is set and was
    pixel-identical to a live one. *Rejected:* another per-surface override (a fourth copy
    of the same fix, and the next popover starts the cycle again); `button.swk` (`#libSelSw`
    is a span). → **Gotcha**.
  - **(i) An axis reads THREE ways, not two — the segmented strip.** His note: filter by NOT
    concentration, NOT ritual, and give Save, Damage and friends an "Any". Both are the same
    hole: **"empty means all" (D174(b)) can say ANY and YES and can never say NO.** So every
    axis reading a list that can be empty, or a boolean, takes a three-way strip —
    **Any · Yes · No** — and the value chips narrow *inside* it. The strip is the control and
    its segments are parts of it, which is how D198(d) already sizes the tabs; one notch down
    for a dense panel (a 28px track holding 22px segments). It replaces the `.swk` switch in
    every filter menu: Ritual, Concentration, and the entity picker's Spellcasting; and it
    joins Save, Damage, Condition and the feat picker's Ability bonus above their values.
    The nouns stay in the group's HEAD so the segments never repeat them. `triOk` is the one
    rule all of them read, and a stored boolean still means what it meant (`true` → yes).
    **The Build tab's own `#filterPanel` is a `<select>` grid, not a menu** — a select already
    holds three answers, so its Save and Damage take **Any** and **None** options instead of a
    strip. Its five Properties chips (ritual, concentration, attack roll, upcast, consumes)
    still cannot say NOT: giving them the strip means converting that panel to the menu
    grammar, which D172 never did. **Left open, flagged in PLAN.** *Rejected:* a second
    "exclude" switch beside each one (two binaries that can contradict each other); cycling a
    single chip through three states (no new height, but a third state you can only find by
    clicking twice, and it is not the shape the rest of the app would then use).
  - **(j) The sort is a chip, and the field's × clears the field.** His note: there was no way
    to reset a sort. It joins the same chip field, in the panel's own tone rather than the
    accent every narrowing wears — it states an ORDER, not a narrowing — carrying the drawn
    caret and its own ×. The clear-all at the field's right now empties **the row it sits
    in**, sort included ("Clear filters and sorting"); the popover's own footer button stays
    scoped to filters, because it clears the panel it lives in. *Rejected:* leaving the × on
    filters only (a control that says clear-all and leaves a chip standing is what he was
    reporting).
  - **Enforced by:** src/app.js `tableOpts` (a `filter`/`sort` half beside `group`/`order`/
    `hidden`), `tableRows`'s narrowing, `renderTable`'s comparator and header buttons,
    `renderTableFilters`, and an engine fixture pinning that a filter changes what the table
    RETURNS and never what the build stores. **Affects:** D29 (the column registry), D142(c)
    (the active-filter line), D172–D174 and D182 (the filter standard, extended to a
    non-picker surface for the first time), D108 (print), D196 (the heading's one row),
    D198 (every new control's height, and the strip as a new entry on its scale). (h)–(j)
    are his notes on v1.6.0, shipped as v1.6.1; `triOk`/`triNorm`/`optListOk` and engine
    **fixture 21** enforce (i), and (h) is proved by measuring an ON `.swk` inside a
    `.menupop`.

### Live — the palette (D200)

- **D200 (2026-09-08) DECIDED — the palette is AMETHYST, and the palette is a PREFERENCE
  with variants.** His ask, opened 2026-09-08: *"try a few variations on the current app
  palette"*, sourced from the Threads account **@color.bears** — two agents read 33 palettes
  off 14 posts (the logged-out profile shows four; the replies tab and indexed old posts gave
  the rest; the account recycles a fixed dictionary, so the yield is near its ceiling).
  Mechanism: two mockup rounds ON THE REAL APP — `python3 scratchpad/mockups/mkpalette.py`
  writes `palette.html` (30 candidates, every scraped palette auto-mapped) and
  `mkpalette.py round2` writes `palette2.html` (his shortlist) — each an iframe of
  `src/index.html` with a per-candidate variable override, light and dark, phone and desktop,
  with the measured contrast pairs beside it; three AskUserQuestion rounds. Sources beside the
  generator: `palettes-scraped-{1,2}.json`, `palette-candidates.json`, `palette-round2.json`.
  - **(a) The main palette is P2 Amethyst** — neutral grey paper `#e6e6e6`, ink `#141414`,
    accent `#7443a5` / `#b494d4`; **the swap/pact violet moves to teal** (`#1d726e` /
    `#5fc4bf`) to stay 90° from the accent — the cost that sank Lapis in D124, this time
    shown in the mockup and accepted; **gold is hand-set to a real ochre** (`#8a6a1a` /
    `#d4ad5a`), the generated analogous secondary having been a plum that muddied the accent.
    *Rejected:* **P4 Heraldic** (ruby on parchment gold — my recommendation, twice), P22
    Deep Anchor, P16 Bloodwood, P3 Orchid-on-sky as the MAIN (kept as a variant), and the
    other 25 in `palette.html`. His round-1 note, verbatim: *"in dark mode, the background and
    panel colors are too light or too saturated and make everything too heavy on the eyes.
    Light modes all look very similar, there's very little use of color and it all looks too
    papery (but this is a DS wide issue, not about these specific palettes)"* — the first
    half is (c), the second is (f).
  - **(b) The rest of his shortlist ships as VARIANTS in the settings menu, beside the theme:**
    **Ember** (the D124 palette, as it was), **Velvet** (wine on almond), **Sky** (orchid on
    a full-chroma sky-blue paper — the one that is not papery), **Petal** (raspberry on
    ivory), **Cinder** (plum on pale blue — *plum, not indigo*: P5's indigo would have moved
    the swap violet again for no gain). `data-palette` on the root; `spellForge.palette.v1`
    in localStorage like the mode (D192 — a preference, never a build property); a one-line
    head script in `index.html` applies a stored key before the first paint. Each variant
    restates the full token set in the three shapes the base uses (light, system-dark, forced
    dark) so its dark blocks (0,3,0) always outrank the base dark block. Print keeps its own
    palette (D152) and takes only the main accent, gold and swap hues. The row is six
    22px swatches (`--chip-h`, D198 — a tag you pick), paper on one half and accent on the
    other, the chosen one in the accent ring; measured 22×22, 3px/3px in the row at 1280 and
    375. *Rejected:* a select (six named colours are quicker to SEE than to read); dropping
    Ember (it is one block, and it is the record).
  - **(c) Every ink is derived, at the shipped STEPS — D145(b) restated as numbers.** A
    candidate gives paper, ink and accent; the generator reproduces the Ember palette's
    measured ratios: panel over page **1.20 / 1.09**, panel-2 **1.04 / 1.21**, line on panel
    **2.22 / 1.33**, line-strong **3.63 / 3.5**, muted **6.5 / 6.4**, ink **16 / 13.3**,
    accent and gold **6.5** as text on the panel, semantics **5.5 / 5.3** (light / dark). Re-
    deriving Ember from its own three colours lands within two hex points of what shipped —
    that is the generator's self-test. **Dark derives desaturated:** page at 7% lightness
    with chroma capped at 0.2, lifts toward a paper capped at 0.25, ink capped at 0.35 — his
    round-1 note. *Rejected:* a 4.5:1 floor for accent text (the first round's mistake: the
    shipped accent reads 6.5:1, and every candidate looked weak beside it); lifting the dark
    surfaces toward white (loses the hue, and read as grey in the self-test).
  - **(d) Semantics keep apart from the accent AND each other; alerts are RED.** Good, swap
    and alert are chosen per palette from a small hue set (green / teal-green; violet / teal /
    plum; crimson / raspberry) by the smallest hue distance to the accent and to each other,
    and the mockup flags any pair under 40° in red. **Orange alerts are rejected** — his
    call, *"let's use reds and not oranges for bad colors"* — so a red-family accent (Velvet
    8°, Petal 11°) separates by LIGHTNESS instead: the wine accent reads 12:1, the alert 6:1.
    Gold is not semantic and is exempt.
  - **(e) Not re-proposed:** four palettes led by a teal or blue were skipped on the record
    (Verdigris and Lapis, D124); four more with a teal or blue MID were rescued by letting
    their dark colour lead and the teal take the gold role.
  - **(f) ⚑ OPEN — the light modes are all alike, papery, and use too little colour.** His
    words, and his scoping: *"this is a DS wide issue, not about these specific palettes"*.
    A separate task, on Amethyst, in `PLAN.md`. Not folded into this round (his call, over
    my offer to tint panel-2 and the section headers now).
  - **(g) His notes on v1.6.2, 2026-09-09: the theme is a SWITCH and the palette is ONE ROW.**
    "Toggle theme" (a verb) becomes **Dark theme**, a switch beside Full character (D182's
    rule); until the first click it reads the system's answer and a click writes `data-theme`
    the other way, the row staying put. The six swatches collapse to a single row — label,
    the current palette's name as its note, and the CURRENT swatch flush right where a switch
    would sit (D179's line); a click anywhere on the row opens the six beneath it, a pick
    closes them, and opening the ⋯ menu always starts closed. Measured: swatch 22×22 at the
    row's 11px, −0.5/−0.5 on the label line; the switch 3/3; the open list 5/5 at 1280.
    *Rejected:* a sub-menu or popover for the six (a second surface for one pick);
    remembering the theme (not asked — it still follows the system until switched).
  Enforced by: `src/styles.css` (`:root` blocks + the `[data-palette]` blocks, the
  `#menuPop .palsw` / `.palrow` rules), `src/app.js` (`LS_PALETTE`, `PALETTES`, `loadPalette`,
  `setPalette`, `syncPaletteRow`), `src/index.html` (the head script, `#paletteRow`),
  `scratchpad/mockups/mkpalette.py` (`python3 mkpalette.py round2 emit` regenerates the CSS).
  → shipped v1.6.2; (g) v1.6.3.

### Live — the class picker crash (D201)

- **D201 (2026-09-12) DECIDED — a filter that has no GROUP for a kind does not RUN for that
  kind.** His bug, reported at the top of the session: *"on guided builder, when selecting a
  class, the picker shows nothing and seems to refer to backgrounds instead"*. Mechanism:
  reproduced on a clean profile (`127.0.0.1:8000` is a different origin from `localhost`, so
  it carries its own empty storage and never touches his builds), Complete mode, guided
  builder, first step — `TypeError: (i.ability || []).some is not a function` at the row
  filter in `renderEntityList`.
  - **(a) What broke.** `ability` means two different things: an ARRAY of raise-groups on a
    feat, the spellcasting SCORE — a bare string, `"int"` — on a class. The raise filter
    always read it, but until v1.6.1 it was guarded by `!ENT.raise.size`, which is empty
    unless you tick a score, so the string was never touched. **D199(i) made that axis a
    three-way**, and `triOk(state, has)` takes its `has` as an ARGUMENT: JavaScript evaluates
    it before `triOk` can decide the axis is resting. So every class row threw, on every
    open, since v1.6.1 — the guided builder's class step and the character card's
    "Change the class at level N" alike.
  - **(b) Why it looked like backgrounds.** `renderEntityList` empties `#entList` on its
    first line and writes `#entSub` two thirds of the way down. Throwing in between leaves an
    empty list under **the previous picker's count** — his screenshot says "70 backgrounds"
    over the Class step because the background picker was the last one that finished.
  - **(c) The fix is the rule, not a type guard.** `entFilterGroups` already omits
    Spellcasting and Prerequisites for a class and offers the ability-bonus strip only for a
    feat (D171(a): a filter that cannot mean anything for a kind is absent, not disabled).
    The row filter now says the same thing — `fGrants`/`fRaise` gate the two blocks — so the
    menu and the predicate read one list instead of two that drifted. A `raises()` helper
    keeps the array coercion honest besides. *Rejected:* `Array.isArray(i.ability)` alone
    (silences this crash and leaves the predicate running filters the menu never offers, so
    the next kind-specific field does it again); making `triOk` take a thunk (it is called
    from eleven sites on uniform spell records, and a lazy signature there buys nothing).
  - **(d) The class of trap, → Gotcha:** a three-way axis EVALUATES its `has` even at rest,
    so converting a short-circuited `!size||` filter into one is a behaviour change for every
    record shape the old guard was hiding.
  Enforced by: `src/app.js` `renderEntityList`'s filter, and engine **fixture 22** (the
  picker predicate over a class record, which fails on the pre-fix expression).
  → shipped v1.6.4.

### Superseded
- ~~**D14** Level budget = free distribution~~ → **D18.** Free distribution was wrong for
  known/level-swap casters (a Bard learns spells on level-up capped at its top slot); it survives
  only for daily preparers.
- ~~**D22** Sub-heading style = accent uppercase~~ → **D24b.**

### The settled record — `DECISIONS-SETTLED.md`

148 entries, verbatim. Open it to cite, to check whether something was already rejected, or
before touching a surface it owns. By era:

| Entries | What they own |
|---|---|
| **D7–D80** | the v7 line: the spell table, pickers, budgets, prerequisites, the builds model, print |
| **D81–D114** | the importer, custom sources, feat categories, the print family, the Library |
| **D115–D156** | the acquisition-order model, the guide (phases E–I), the timeline, empty slots (D146) |
| **D157–D175** | the three-pillar audit (D157 charter, **D158 every disposition**), the filter system |
| **D177–D189** | the score block's four review rounds, Phase M's close, his 2026-09 bug batch |
| **D190, D193–D197** | delegated handlers, the add-class row, the feat chips' level slice, the gap bar, the header, the class row |

