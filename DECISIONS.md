# DECISIONS — My Spellbook

> Every choice this project has made, and what was rejected. `D-id · date · headline ·
> rejected options`. A strike-through with `→ D-id` is a supersession, never a deletion.
> Rationale for D7–D80 lives in `ARCHIVE.md#rationale` and `ARCHIVE.md#v7-decisions`;
> a rule marked **→ Gotcha** has its enforced-in-code copy in `GOTCHAS.md`, which is the
> version to trust.
>
> Moved out of `STATE.md` on 2026-08-27 (v1.1) — STATE is the resume block, this is the
> record. Nothing was dropped in the move.


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
- **D96 (2026-08-27) A custom source may grant a CHOICE, not only a named spell** — some items
  give you a spell **picked from one or more lists**, re-chosen on a long rest: Silverquill
  Primer, *"if you study the primer at the end of a long rest, you can choose one 1st-level spell
  from the bard or cleric spell list… you can cast the chosen spell once without a spell slot."*
  5etools models **none** of it (`attachedSpells: null`), so this shape can only ever be
  hand-authored — which is exactly what custom sources are for. **Almost all the machinery
  already existed**: the grants tree has `picks`, `filterSpells` already splits `level`/`class`/
  `school` on `;`, and the choices panel already renders and groups them. `customSourceGrants`
  simply never emitted any. An entry is now **either a named spell (`key`) or a choice (`pick`)**
  — `{take, level, class, school}`, empty meaning *any* — and rows are keyed by `key||id` since a
  pick has no spell key. The filter is three wrapped chip rows in the row's existing disclosure;
  chips rather than selects **because empty-means-any is the same grammar `filterSpells` reads**,
  where a select would need an explicit "any" option to keep in sync. A pick reads as its rule
  ("Choose a spell · level 1st · Bard or Cleric list") in the row and as English in the summary
  ("choose a 1st-level spell from the Bard or Cleric list and cast it per long rest") — two
  renderings of one fact, deliberately. **A latent bug fell out:** `resolveGrants` passed a
  hardcoded `null` where fixed grants pass `g.extra`, so a PICKED spell would have silently lost
  its source's DC, attack and fixed cast level. Nothing in the data emitted a pick with `extra`
  before this, so it had never shown. *Verified:* Silverquill Primer end to end — 96 matching
  spells, the choice grouped under its source in "Choices to make", and the picked spell landing
  in the casts list as "Healing Word (1st) · 1/LR · Silverquill Primer" carrying its note.
  *Rejected:* exposing only level+class (Francesco's call — school is free, `filterSpells`
  already supports it); a separate "choices" section apart from the spell list (one list, two
  kinds of row, is how the source actually reads).
  → **widened same day:** a choice also carries **`pick.swap`** — WHEN you may re-choose, which is
  a **different clock** from how often you may cast. Silverquill uses a long rest for both, but
  they are independent ("choose at dawn, cast twice per long rest" is legal, and a choice you can
  never change is legal too). Closed list: chosen once / long rest / short rest / dawn / on level
  up, defaulting to a long rest because that is what almost every such item uses and the row opens
  expanded so it is seen rather than silently assumed. It rides the **desc**, so it reaches the
  **Choices panel** — the one place you are actually deciding, and therefore the one place "when
  can I change this?" belongs. The app's own `swappable` is derived from grant kind and could
  never express it.
- **D95 (2026-08-27) HOW a spell is paid for belongs to the SPELL, and some uses never come
  back** — two gaps D65's model couldn't express, both found by auditing the 5etools item
  corpus and both now closed. ① **One source, several budgets.** D65 made `uses` a source-level
  either/or — a shared pool OR per-spell uses — but **38 items carry more than one**:
  Demonomicon of Iggwilv casts Tasha's Hideous Laughter *at will* AND spends an 8-charge pool;
  Crook of Rao has a 6-charge pool AND Gate once ever; 26 of the 38 are "something + at will".
  A source now simply **has a charge pool or doesn't** (`pool` blank = none) and each spell
  carries **`pay:"pool"|"per"`**. The source-level select is gone — it would start *lying* the
  moment one spell differed, which is the folded-state-disagrees-with-reality problem D94 was
  about. The switch lives in the row's existing caret disclosure, and **no folded-state tag is
  needed**: which budget a spell spends is always visible in its inline control. ② **Uses that
  never reset.** 5etools' `limited` ("Once the spell has been cast three times, the bracelet can
  no longer cast it") had no equivalent — every unit recharged. New **`total`** unit: "3 times
  total", "once only". *Measured:* of the 332 items whose spell data is structured, expressible
  went **268 → 295 → 312 (81% → 89% → 94%)**; the remaining 20 use `other`/`ritual`, which carry
  no frequency data anywhere but prose, and 84 more items ship a flat spell list with no usage
  data at all. **Legacy sources are read, never rewritten in place** — `csrcPay()` falls back
  through the old `uses` enum, so a source saved before this resolves correctly without being
  opened; the editor normalises and drops `uses` on open and on save. *Rejected:* keeping `uses`
  as a source-level DEFAULT with per-spell overrides (same expressive power, but the rule line
  and the chip would describe a shape the rows contradict); telling the user to make two sources
  for one item (breaks the chip, the summary and "one item is one thing").
  → `rechargeShort()` had to learn the new unit too: Gate rendered as a bare **"—"** in the
  casts list, which reads as *no limit* — the exact opposite of once-ever.
- **D94 (2026-08-27) The custom-source editor is PROGRESSIVE — the name and the spells are the
  surface, everything else folds, and the foot says what you built** — the long-deferred design
  session, settled against three mockups rendered in the app's own stylesheet
  (`scratchpad/csrc-mockups.html`). The old modal stacked **five equally-loud fieldsets**, so
  "Its own numbers" — three fields you almost never fill, permanently on screen to announce
  *blank = use mine* — carried the same weight as the spell list, and two toggle rows (five chips)
  stood between you and the content. Now: name + kind, then **one rule line** stating what the
  source is (*"Cast without preparing · a shared pool of 10 charges, regains 1d6+4 at dawn"*) with
  a **Change** button opening the toggles; then the spells; then **Its own numbers folded**, its
  label carrying the state (*"set — DC 15, +7, Intelligence"*, in accent when set, "uses mine"
  when not) so a fold can never hide something you changed. A spell row keeps only the control its
  mode actually spends and folds the rare fixed-cast-level behind a per-row caret — a row that HAS
  one shows an `at 5th` tag, for the same reason. **From C (Francesco: "also C is decent"): a live
  summary sentence** at the foot — *"Staff of Fire — cast Burning Hands or Fireball without
  preparing, spending from 10 charges (regains 1d6+4 at dawn). Saves are DC 15…"* — because the
  model is subtle enough to build something you didn't mean and nothing else ever said what you
  made. It stays quiet (dashed, no accent) until there is something to describe. **Scope: the
  modal only** — the Character card's chips are unchanged. The MODEL (D55/D65) is untouched;
  `customSourceGrants` and every downstream path still resolve exactly as before.
  *Rejected:* B, the whole form as an editable sentence (most distinctive, hardest to keep tidy as
  the model grows); C's two-pane layout and its always-visible toggles (that density is what made
  this a mess); reworking the card's chips or the casting surfaces (not what was complained about).
  → **refined 2026-08-27 on Francesco's review:** the mode/uses **chips became two labelled
  `<select>`s** side by side ("Casting" / "Uses") — five wrapping chips were most of the weight —
  and the section lost its "How its spells work" heading to them. **"Its own numbers" → "Spellcasting
  stat".** A spell row's unit control is **fixed-width with short labels** (`/LR`, `/SR`, `/dawn`,
  `at will`) so the caret and × hold their column, and its count **greys out at will**, which has
  no count to set. The expanded row **dropped the "Cast at" label** (it wrapped) for a select that
  names its own options, at a fixed width, leaving the rest to a new **per-spell NOTE** — it rides
  the grant as `note`, so D79's path renders it in the spell modal and on the table's source badge
  with no new machinery ("Fireball · deals cold damage instead"). A folded row with a note shows a
  spark, as one with a fixed level shows `at 5th`. The summary now **names the uses**: per-spell
  cadences ("Bless 2× per long rest, Light at will") and pool costs ("Fireball (3)").
- **D93 (2026-08-27) Imported content lives in IndexedDB; only the LOAD and the SAVE are async**
  — the digest was the one thing in localStorage large enough to matter (a full 5etools export is
  ~2.3 MB before a single brew), which made D92's folder scan a way to *choose* books the app
  then couldn't *store*. It now sits in **IndexedDB** — one database `spellForge`, store `kv` for
  content and `handles` for D92's directory handle (the old separate `spellForgeFolder` DB is
  deleted once, quietly). **`assembleData()` stays synchronous**: boot fills `IMPORT_CACHE` first
  and every existing caller — a custom-spell edit, an apply, a source change — is untouched. The
  whole boot block moved inside an async IIFE so nothing decides anything early; in particular
  `maybeOnboard()` must not fire the welcome importer over a library still loading, which is the
  same failure the "an empty stored import must not beat the baked data" gotcha describes.
  Migration reads the legacy key, writes it to IndexedDB, and **only then** removes it — a
  half-done move that loses the import is far worse than one that briefly stores it twice.
  A private window that refuses IndexedDB falls back to localStorage and says so. **This closes
  T7 and the standing IndexedDB backlog item.** *Measured:* localStorage's ceiling is 5 MB by
  convention but is **not** universal — this Chromium took 36 MB and threw at 161 MB — so the
  failure copy quotes no fixed number, only the real `storage.estimate()` figures.
  *Rejected:* moving builds/sources/table layout too (kilobytes, and sync access is worth
  keeping — with the digest gone they have the whole quota to themselves); storing the digest as
  a JSON string in IndexedDB (a structured value skips a multi-MB string held twice at save time).
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
written up in full in `GOTCHAS.md` — that is the copy to trust.
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
- **D97 (2026-08-27)** A slot count has a **fourth** state, `none` — dimmed and dashed, for a
  cap of **0**. Revises D44: a zero cap fell through to `need`, so a level-3 character's general
  feats read as an urgent red `0/0` promising "0 of 0 left to choose". Nothing is owed, so
  nothing is due. `budgetPill()` carries the same state (a cap of 0 used to read "filled").
  *Rejected:* printing "—" instead of `0/0` (the column reads down; the ratio is true, only its
  urgency was wrong); hiding the tile (its absence would read as a missing feature).
- **D98 (2026-08-27)** Print is **always the spell table**, whichever tab is on screen, over a
  brief build summary that identifies it — Francesco's call. The Build tab is a set of controls,
  not a document; the sheet you carry to a session is the spell list. A `.printhead` filled on
  `beforeprint` names the character, version, level, classes and species, and calls out a level
  preview, since on paper an unmarked preview reads as the character itself. `beforeprint` also
  re-runs `renderTable()`, because `render()` refreshes the table only while its own tab shows.
  Chrome and controls go, the light palette is forced onto white, and `renderTable` gained a real
  `thead`/`tbody` so column names repeat on every page. *Rejected:* printing whichever tab you
  are on (the first cut — the Build tab printed as a form with controls flattened out of it, and
  needed a page of CSS to look like a document); a purpose-built play sheet (a third rendering of
  the same rows to keep in sync).
- **D99 (2026-08-27)** The published build **installs and runs offline**; `dist/` and `src/`
  never register a worker. A service worker needs real files at a real origin — dist/ opens over
  `file://` and serve.py sends `no-store` on purpose, so registering there would only cache the
  file being edited. build.py writes `manifest.webmanifest`, `sw.js` and the icon set into
  `docs/` alone, and registration is guarded on `__PUBLIC__`. Caching is
  **stale-while-revalidate** with a build-stamped cache name: an update is deliberately one
  reload behind, because the alternative is a 1 MB blocking download every time the app opens.
  *Rejected:* network-first (defeats the point on a phone at a table); cache-first with no
  revalidation (a deploy would never reach anyone); an "update available" banner (new UI for a
  gap that closes itself on the next load).
- **D100 (2026-08-27)** A source's own numbers state only what the spell actually **rolls** —
  `ownNumbers(sp,dc,atk)`: the save DC when the spell forces a save, the attack bonus when it
  needs an attack roll, both only when it needs both. A Staff of Frost printed "DC 16 · +8" next
  to Ray of Frost, quoting a DC nothing in that spell ever calls for. One helper, used by the
  table's Ability column and by the per-spell rows in Slots & casts, so the two panels cannot
  disagree; a **choice** row names no single spell, so there both numbers still stand. With no
  spell record to check against, both are stated — an unverifiable case must not read as "there
  is none" (D31). A spell that rolls neither falls through to the casting-ability chip like any
  other row. *Rejected:* showing the numbers only in the tooltip (they are the reason that column
  exists for an item); dropping the row's ability chip when a source has its own numbers.
- **D101 (2026-08-27)** The sheet's anatomy is **summary → tracker → table → cards → notes**, and
  the tracker is **boxes, not counts** — on screen a slot count is information; on paper it is the
  one thing you cannot mark off mid-session. It covers everything the app already knows is
  expendable: each spell slot, Pact Magic on its own line (short rest), each limited innate cast,
  and each item's charge pool as **one** row (a shared pool listed per spell would double-count
  it). Box counts read `rechargeShort()`'s output rather than re-parsing cadence strings, so the
  tracker cannot disagree with the Casts column; a `chg` cadence means "paid from a pool", which
  has its own row. Optional **all preparable spells, unticked** prints every spell a *daily*
  caster could prepare with an empty box, so a Cleric or Druid list can be prepared on paper —
  Francesco's addition. Level-swap casters are skipped (nothing to prepare) and so are wizards
  (their preparable list is their spellbook, already on the sheet and already marked); anything
  genuinely picked is pushed first, so the dedupe keeps its real marker.
- **D102 (2026-08-27)** Optional **spell cards** print the full rules text of every spell on the
  sheet as a two-column appendix, and the table's spell names are **same-document links** into
  them, which is what a PDF turns into clickable internal navigation; each card links back to its
  first row. Cards carry the stat grid, every paragraph, the at-higher-levels clause, the book and
  page, and any grant or casting-rule note. *Rejected:* compact cards (they truncate exactly the
  spells that needed one); one card per page-width (half the sheet spent on unreadable line
  lengths).
- **D103 (2026-08-27)** Print options live in a **remembered modal** (⋯ → Print / save as PDF…) —
  colour (light on white / dark as on screen), page (portrait / landscape), and five toggles — and
  the modal states what the current settings will cost, counted through the same code path that
  builds the sheet. The **PDF filename is the build name**: browsers take it from `document.title`,
  so it is swapped on `beforeprint` and restored on `afterprint`. Everything below the summary is
  **built on `beforeprint` and torn down on `afterprint`**, so the screen never carries a 31-card
  appendix around and ⌘P takes exactly the same path as the button. `@page` cannot be
  selector-scoped, so page size gets its own injected rule element. *Rejected:* options in the ⋯
  menu (five toggles and two selects is a form, not a menu); a print-only route that ⌘P bypasses.
- **D104 (2026-08-27)** Grouping by source groups by **where it came from**, and a subclass, a
  class feature and an invocation all came from the class — Light Domain is not a source separate
  from Cleric, and splitting it out answers a question nobody asked at the table. Every grant
  resolved inside a caster's loop is tagged with that caster's row (`srcIdx`, now on free casts as
  well as always-prepared ones), and an optional feature — resolved outside the loop, since a feat
  can grant one — is tagged by which class's progression opened the slot it fills. Only a genuinely
  separate source keeps its own group: a feat, an item, your species. A feat that **adds to your
  list** (a Dragonmark) is not one of those, and needs no special case: those spells are picked as
  the class and already carry its row. The Source **column** still names the specific giver — the
  folding is the group header only. *Rejected:* a hand-kept list of "class-ish" source names
  (wrong the moment a book invents a new feature type).
- **D105 (2026-08-27)** A summon spell's stat blocks print, but only the forms this character
  **marks** — a star in the stat-block header, stored in the build so it travels with an export
  (D55's rule). Find Familiar carries 65 forms; an appendix that prints all of them is not an
  appendix. Marked forms also lead the carousel, since the form you use is the one you open the
  spell to see. A spell with exactly **one** form prints it unmarked (marking the only option is
  a chore, not a choice); a multi-form spell with nothing marked prints a line saying how to mark
  them, rather than silently omitting the block. *Rejected:* printing the first N forms (the first
  is alphabetical, not yours); a global favourites list (a familiar belongs to a character).
- **D106 (2026-08-27)** The printed sheet is **hairlines only** — no box around the table, no card
  borders; a row rule, a heading rule, and nothing else, because paper already has edges. The
  tracker's slots and per-class numbers are **tables**, not flex rows: nine slot levels plus Pact
  have to sit in one row of columns at any width, and only a table guarantees that without
  shrinking the boxes below a tickable 3 mm. Past **6** uses the boxes become a ruled field and a
  `/N` total — twenty 3 mm boxes are not tickable apart, and a written count is how a character
  sheet has always done it. Each caster gets its prepared and cantrip counts plus **blank ruled
  fields for spell attack and save DC**, which the app cannot compute (it models neither ability
  scores nor proficiency) and must not guess. A **legend** prints only the marks the sheet
  actually uses. *Rejected:* the per-class numbers in the group headers (they only exist when you
  group by source; the block is always there and always right).
- **D107 (2026-08-27)** Printing a daily caster's **whole** list means preparing on paper from
  scratch, so every one of that class's preparable rows gets the same empty box — marking today's
  picks differently states a decision the sheet exists to let you re-make. Cantrips, always-prepared
  grants and innate casts keep their own marks: none of them is yours to choose. A level-swap
  caster (Warlock, Sorcerer, Bard) is untouched — it knows spells, it does not prepare them. The
  two write-in fields are **boxes, not rules**: a rule is something a pen sits on top of.
- **D108 (2026-08-27)** The PDF's **filename and internal links belong to the browser's own
  export**, and there is nothing in the page that can substitute for either. The name comes from
  `document.title` at print time (set, and verified set) and the links from same-document anchors
  (79 forward, 75 back, none broken, no duplicate ids, in-page navigation works). Chrome and Safari
  honour both; an in-app PDF writer may ignore them and save under the host app's name. The print
  modal says so rather than leaving it as a mystery. *Rejected:* generating the PDF in-page (a
  bundled PDF library, for a file the browser already knows how to make); UA-sniffing the host.
- **D109 (2026-08-27)** A **feature** can add forms to a familiar spell, and those forms are yours,
  not the spell's. Pact of the Chain's Imp is a CR 1 fiend that survives none of D78's carried-
  monster tests, and 5etools states the list only in the feature's prose — the bestiary's
  `summonedBySpell` links a monster to a SPELL and cannot express "this feature widens that list",
  so D50's rule (never parse `{@creature}` refs off a spell) does not reach the case. Both
  extractors now emit `forms:[{spell,creatures,mode}]` on feats and optional features, parsed
  narrowly: the sentence must name **forms** and carry `{@creature}` refs, and the record must
  reference a spell. Across the 2024 corpus that is two records, and it picks up homebrew with the
  same wording for free. At runtime the grant is live only while you hold the feature; a ref with
  no book resolves to every book that prints the creature, so the app offers **one** copy — from a
  book you have on, newest edition first. Granted forms are exempt from the stat-block book filter
  (a form your feature adds is not an option from a book you don't use) and rank **second in the
  carousel, after your marked favourites**. `mode:"only"` replaces the list instead of widening it.
  *Rejected:* a hand-authored table in app.js (it would cover what I happened to write down, and
  the extractors are where content gaps are filled — PROSE_GRANTS and CAST_MODS set the pattern).

- **D110 (2026-08-27)** **The Library: one surface, two panes.** The import modal and the Sources
  modal merge into one **Library** modal with a tab bar — **Sources** (the everyday on/off list)
  and **Manage** (import, refresh, remove: the rare and destructive work). One toolbar **Library**
  button replaces both the Sources button and the ⋯ Import entry; onboarding opens straight to
  Manage. The split keeps a free visibility toggle from sitting next to a storage-destroying
  untick. (AskUserQuestion, 6 rounds + mockups.) *Rejected:* a full one-list merge (both states on
  one row is a trap without heavy row design); two sharpened modals (the two-door confusion only
  shrinks); stacked sections (recreates today's long scroll, Apply below the fold); drill-in
  (cleanest Sources but hides Manage, and Refresh must stay discoverable).
- **D111 (2026-08-27)** **Refresh imported data = one click, then report.** Re-reads the
  remembered folder (or asks for input when there is none), re-parses with the **current**
  extractor, re-imports exactly the books already kept, and reports a summary plus a parser
  version stamp — the stamp answers "did the new parser actually run". Sits in the Manage
  **bottom row** next to Apply, with the last-import stamp beside it (detail in a popover), plus
  a ⋯-menu shortcut — it is the standing after-update chore. *Rejected:* review-before-apply (an
  extra step on an action that only replaces same-key records); silent auto-refresh on version
  change (permission re-grant needs a user gesture, and a background re-parse is a surprise);
  a record-level diff in the report (a deep compare pass for a line that reads as noise).
- **D112 (2026-08-27)** **Manage pane: one drop zone, one book list, parse on arrival.** The drop
  zone takes a **.zip, JSON files, or a whole dragged folder** (dropped directories walk via
  `getAsFileSystemHandle`, falling back to `webkitGetAsEntry`; a Chrome-dropped folder yields the
  same rememberable handle as the picker). The *click* path stays two verbs — "browse files… ·
  choose folder…" — because the native dialogs differ. Raw note: *"Can a single button work with
  both? Either accepts a zip or a folder, depending on what I give. Otherwise, a compact
  chooser."* Paste-JSON folds behind a disclosure. Files **parse on arrival** — the "Read staged
  files" click is gone; chips remain for removing a bad file, nothing stored until Apply. The
  folder-scan picker and "Your books" merge into **one three-state list** — kept (ticked) · new
  (ticked, badged) · available in the scanned folder (unticked, dim) — and one Apply reconciles
  all of it. A storage total line (`navigator.storage.estimate()`) sits in the footer. Onboarding
  is the Manage tab plus a welcome banner; the Sources tab hides until content exists.
  *Rejected:* folder-first or zip-first hierarchy (superseded by the universal zone); keeping
  pick-then-plan (a third list); the explicit read step; a dedicated welcome screen (a second
  surface that drifts); no storage info.
- **D113 (2026-08-27)** **Sources pane: edition-first groups, actions behind the search bar.**
  Groups become **2024 core · 2014 core · Supplements · Settings & adventures · Homebrew & UA ·
  Other** — the "(alternate)" jargon folds into its parents, and the 2024/2014 split is an
  **app-side display remap** of the 2024 codes (XPHB/XDMG/XMM), not an extractor change, so
  already-imported digests regroup without a re-import. The pane gains the **search field** the
  other book lists have; **Enable all / Disable all move into a compact menu inline right of the
  search**; the "2024 core only" button is gone — it is a group header's all-tick now. Bestiary-
  only books (XMM, MM…) stay **invisible** in every book list: stat blocks follow the spells that
  reference them (D86) and the carousel builds its own book filter (D107). *Rejected:* making
  bestiary books first-class registry entries (the D107 trap in reverse — both extractors, the
  carousel filter and the gotcha would all rework for display value); merging alternates only;
  a flat searched list (loses the shelf feel); extra edition preset buttons.

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
  - **(g) Retraining = swap-at-level-up only.** A level event may carry one swap (−X +Y) where
    RAW grants one (known casters; cantrip/feature swap rules ride the same shape); the wizard
    spellbook is add-only. *Rejected:* add-only with removal-erases-history (lies to jobs a/c);
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
- **D116 (2026-08-28) Audit-batch dispositions** (two-lane audit, AskUserQuestion × 2 rounds;
  the fix-safe findings needed no decision and shipped in v1.2.2 — `CHANGELOG.md` lists them):
  - **(a) The public build renames the 17 product-identity spells** to the licensed SRD names
    5etools carries in `srd52` (Bigby's Hand → Arcane Hand …), applied over the whole
    serialized subset so prose and grants follow; the full local digest keeps real names.
    Raw note: *"Check the 5etools folders to see if there is already a series of SRD-only
    documents and let's embed those. If not, rename manually to SRD names"* — the mirror has
    no SRD-only documents; the `srd52` string is the mechanism. *Rejected:* dropping the 17
    from the subset; accepting the license risk.
  - **(b) `clearImport` is wired**, not deleted: a red armed "Remove imported data" row in the
    Library's Manage footer (shown only when an import exists) — closes ARCHIVE's ⚑ and is the
    manual recovery for a digest the boot guard set aside. *Rejected:* deleting the dead code.
  - **(c) UA/prerelease books fold into "Homebrew & UA"** (`srcGroupOf` remap) — D113's shelf
    name already promises them. *Rejected:* a sixth "Prerelease (UA)" shelf.
  - **(d) `save()` skips identical writes**, so `meta.updated` means last EDITED — opening the
    app no longer re-stamps the active build. *Rejected:* stamping only from mutating call
    sites (one missed site lies the other way); relabeling to "opened".
  - **(e) An item's own DC/attack print in the source GROUP HEADER** when the table groups by
    source ("Staff of Frost · DC 16 · atk +8 · Cha") — the numbers are per-source constants,
    the header is their altitude. *Rejected:* un-suppressing the Ability column; accepting.
  - **(f) The gap banner is sticky and the gapped pick chips carry the flag** (D42's visible
    contract at both altitudes). *Rejected:* auto-scrolling the column; accepting.
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
  - **(c) Granularity: one step per DECISION** — Francesco's call against the per-level
    recommendation. Consequence, accepted into the design: ~60–80 steps for a level-20 build, so
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
  *"in the timeline which inherited the level order system, only display two tiles (highest
  spell/slots) if they diverge, otherwise only show one. Also make sure this feature supports and
  makes it easy to swap lower level spells for higher ones, marking the state clearly."*
  - **(a) The two casting tiles merge into one ("cast") when max spell level and top slot
    agree** at a row — they split back into spell + slot exactly where multiclassing (or Pact
    Magic) pulls the clocks apart. *Rejected:* always-two (repetitive at nearly every
    single-class level); always-one (hides the two-clocks distinction D68 exists to keep).
  - **(b) The swap flow is click-to-arm on a timeline chip, take-to-record.** Clicking an
    eligible chip arms "− this pick at L{view}" (violet chip + a swapbar naming the level and
    the loss, with *Choose replacement…* opening the class picker capped at that level's max);
    the next take for that row and kind records the swap — the outgoing pick's POSITION keeps
    its acquisition history, the event carries the trade (E1 shape). Eligibility is
    RAW-shaped and explained on every chip's tip: known-caster picks only (a wizard's book
    only grows), at a later level-up of that class, one swap per level, chains blocked until
    the standing pill is cleared. States marked: armed chip, ⇄ on picks later traded away,
    the pill at the swap level. This closed E3. *Rejected:* a chip context menu (one action
    doesn't need one); swap-on-remove prompts in the cart (heavier, off the level surface).
  Enforced by: src/app.js (renderTimeline chips, SWAPARM, toggle intercept). Affects: PLAN E3/E5.

- **D120 (2026-08-28) The stored build and the live state never share objects — `save()` and
  `applyState` both detach.** Mechanism: E8 fresh-eyes gate (separate session, fable@high); found
  while probing D115(e) reload behaviour — picks vanished on reload while other edits stuck.
  Root cause: `serializeState()` returns the live sub-objects by reference, so after any full
  save (or boot, which applies `activeBuild().state` itself) the D116(d) identical-write compare
  diffed an object against itself and skipped every pure pick edit; localStorage silently went
  stale (regression window v1.2.2 → v1.2.9). Fix: JSON round-trip at both boundaries — `save()`
  stores a detached copy, `applyState` detaches what it reads. D116(d)'s intent is preserved
  (a plain open still doesn't restamp `meta.updated`; verified both ways in-browser).
  *Rejected:* comparing against a cached last-written string (a second cache that can drift from
  what localStorage really holds); dropping the skip and always writing (reintroduces the exact
  restamp D116(d) exists to stop); deep-copying in `serializeState` alone (leaves boot's shared
  identity in place — the first edit after open still self-masks). → **Gotcha** (the enforced
  copy lives in `GOTCHAS.md`). Enforced by: src/app.js `save()`/`applyState`. Affects: GOTCHAS.md.
  E8 side notes, logged not fixed: `recordSwap()` has no callers (the toggle intercept writes
  `state.swaps` directly, and the "only writers" comment above it is stale); a chained swap's
  chip tip names the LAST event's level, not the chip's own trade (unreachable from the UI —
  chains are blocked — import-only); Escape with the level picker open closes the timeline
  UNDER it, and the picker itself only closes by ×/outside (pre-E5 behaviour, now more visible).

- **D121 (2026-08-28) F1 status semantics: the frontier ignores class steps, and optional
  steps never capture re-entry.** Mechanism: two calls surfaced while building F1's
  `guideSteps()`/`guideResume()` (fixture E exposed both). ① `skipped` = unanswered below the
  frontier — but class steps are pre-answered by the plan (D118(e)), so counting them dragged
  the frontier to top and a hand-levelled build with no picks read ALL-skipped; the frontier now
  tracks the highest level with a done NON-class step, so that build reads all-open and the
  forward walk still leaves skipped ones honestly behind it. *Rejected:* keying the frontier on
  `state.currentLevel` (conflates D115(e)'s "where the character stands" with "how far the
  answers go"). ② The swap y/n step is `optional:true` and `guideResume()` passes it: "no swap"
  is a legitimate answer the build cannot store (stateless, D118(j)), so an unanswered one would
  trap re-entry at the first level-up forever. *Rejected:* storing an answered-no bit (the
  stored wizard session D118(j) already rejected); dropping swap steps entirely (D118(k) names
  swap y/n a structural choice of the chain). Enforced by: src/app.js `guideSteps`/`guideResume`.
  Affects: PLAN F1/F2.

- **D122 (2026-08-29) Timeline refinements v2, direct instruction while F2 shipped.** Raw note:
  *"remove the note next to timeline; fix visually the x button; turn the popover into a full
  fledged modal; move the alert to reorder as a note inside an alert icon popover next to title;
  instead of featuring the Cast/spell/slot option at every level, feature them only at the level
  where they change, and not as highlighted but in their dimmed state, currently they have a too
  important visual hierarchy and seem like buttons; let's evaluate if there's a change we can do
  to the draggable list in multiclass: … there should be a visual aggregation that facilitates
  moving levels only when moving them matter ideally."*
  - **(a) The timeline is a FULL MODAL** (standard `.modal` chrome — which also gives it the
    standard ×, closing the "fix the x button" note by construction). D115(j)'s raw note
    anticipated exactly this ("we can consider turning it into a proper modal…"). The chip
    anchoring, the rAF scroll re-anchor and the document-level outside-click closer are GONE —
    backdrop click (strict `target===backdrop`, detached-target-proof), Escape and × close it.
    → **Gotcha** (both E5 popover entries updated so the machinery isn't restored).
  - **(b) The header sub-note ("click a level…") is removed** — the rows teach themselves.
  - **(c) E7's order-matters word moves into a GOLD FLAG beside the title**; the named reasons
    and the "drag the rows" instruction live in its tip. Supersedes E7's gold-line surface;
    E7's derivation (`orderMatters()`) is untouched.
  - **(d) Casting tiles appear ONLY at the level that moved a clock, styled as dimmed notes**
    (no border, no fill, no accent) — the tile's presence is the signal, and it can no longer
    read as a control. In split mode only the clock that changed shows. *Rejected:* keeping
    per-row tiles in a dimmed state (the repetition was the complaint, not just the weight).
  - **(e) Multiclass run aggregation:** consecutive levels of one class share a per-class
    coloured left rail and close ranks (2px joins vs 6px between runs), so a run reads as one
    block; and a row drop whose resulting plan is IDENTICAL (any move inside a same-class run,
    including onto its own boundary) is **not a drop target at all** — no highlight, no
    pretend-move. *Rejected:* collapsing a run into a single draggable block (kills the
    per-level rows the timeline exists for — picks, flags, tiles live on them); allowing the
    drop and flashing the refuse animation (a control that accepts a gesture only to refuse it
    is worse than one that never lights up).
  Enforced by: src/index.html `#tlModal`, src/styles.css `.tlbox`/`.ordflag`/`.runc*`/`.lt`,
  src/app.js `renderTimeline`/`openTimeline`. Affects: PLAN E5/E7 surface notes, GOTCHAS.md.

- **D123 (2026-08-29) Tile semantics + metamagic tags, direct instruction while F3 shipped.**
  Raw notes: *"when slot and spell are overlapping, write 'spell' in the tile, not 'cast'.
  Also the word should be neutral color"* · *"pact slots should be measured differently in
  these tiles (ex. 1st pact), ideally also with amount"* · *"some selected metamagic options
  could be mentioned in the spell table rows when they affect only a specific type of spell
  (ex. twinned)"*.
  - **(a) The merged casting tile reads "spell" in the muted colour** — where the two clocks
    agree, naming the merger ("cast") answered a question nobody asked; split tiles keep their
    38% hue mix.
  - **(b) Pact Magic gets its OWN tile, measured as count × slot level** ("2× 2nd pact",
    neutral), shown at levels where either number moves; it never merges with the spell clock.
    `levelCasting` now returns `{pact,pactUp}` for pact casters instead of masquerading pact
    level as a slot level.
  - **(c) Metamagic applicability tags in the Spell table's name cell** (`METAMAGIC_WHEN`,
    app-side hand table): when the build has a metamagic option selected, spells it can touch
    carry a quiet neutral tag (twin, quicken, careful…) with the reason in the tip. Judged
    from digest fields only (save/dmg/atk/tcat/rcat/durTxt/higher) — advisory (D31), scoped
    to rows owned by the class whose progression grants Metamagic. **Twinned uses the XPHB
    shape** (`higher` text matching "target one additional") — Scorching Ray's "one additional
    ray" correctly does NOT tag. **Options that touch nearly everything (Subtle) are
    deliberately absent** — a tag on every row says nothing (the note asked for "only a
    specific type of spell"). *Rejected:* putting metamagic into the extractor `CAST_MODS`
    table (applicability depends on the BUILD's selections, an app-side fact; and D85 mods
    mark casting rules, not opportunity).
  Enforced by: src/app.js `levelCasting`/`lvTile`/`METAMAGIC_WHEN`/`activeMetamagic`.
  Affects: the timeline tiles, the Spell table name cell.

- **D124 (2026-08-29) Timeline separation + pick counts (decided); metamagic placement +
  palette (OPEN).** Mechanism: mockup round (`scratchpad/tl-mockups2.html`) + AskUserQuestion;
  the two open halves have their second mockup round in `scratchpad/mm-palette-mockups.html`.
  - **(a) DECIDED — class separation = run divider labels TOGETHER WITH the rail.** Raw:
    *"Run divider labels, together with current rail."* Each class block opens with a labelled
    divider ("Bard · L4–L7" + colour dot) AND keeps its coloured left rail — whose colour is
    now re-asserted after the zone tints, so the here/pin highlight can no longer eat it (the
    bug that opened the question). *Rejected:* inset-bar-only (A); rail-less dividers (B
    alone); coloured L-pills (C).
  - **(b) DECIDED — pick counts = bare "+" ghost chips AND a count tile.** Raw: *"ghost chip
    with only + to add spells, with also count tile. Also, the spell list shouldn't wrap but
    bleed past the card, masked by it (like access in spell details)."* Open schedule slots
    render as dashed "+" chips (click = jump the view there); a neutral "2/6 picks" tile
    states wants/has wherever a level opens slots; and the chip row is ONE line that bleeds
    under a right-edge mask and scrolls (the spell-details access pattern) instead of
    wrapping. *Rejected:* counts in the gains line; labelled "+ spell" ghosts.
  - **(c) DECIDED — metamagic lives in the spell details as an Access-style row labelled
    "Metamagic".** Raw: *"Access-style row, do not wrap title (perhaps only 'metamagic' is
    enough)."* One row under Access, the one-word label, dashed neutral chips (twin ·
    quicken · careful) with the reason in each tip; rendered only when a Metamagic-owning
    class can take the spell AND at least one selected option's condition holds. The D123(c)
    table tags are gone; `METAMAGIC_WHEN`/`activeMetamagic` feed this row now. *Rejected:*
    meta-line badges (the line is dense and wraps on phones); a reasons line above the text
    (repeats itself once learned); the two-word label ("Your metamagic" wrapped).
  - **(d) DECIDED — the palette is P3 EMBER: keep the rust identity, widen the gap.**
    Mechanism note: the first answer picked P1 Verdigris; Francesco reversed it — raw:
    *"Try again, switch to ember instead of verdigris."* Applied across all five theme
    blocks (light, two dark, print-light, print-dark): accent slides to terracotta
    (light #8f4b2b, dark #d9915f), alerts to crimson (light #c1273b, dark #f0616e, print
    #9c1f30). Separation = ΔH≈27–30° PLUS a lightness/chroma gap — improved, deliberately
    not categorical; the analysis (and the caveat that gold sits ~18° from the dark accent)
    is in `scratchpad/mm-palette-mockups.html`. The app icon keeps the old rust — it is
    artwork, not a functional colour, and its PNGs are pre-rendered. *Rejected:* **P1
    Verdigris** (picked once, then reversed — do not re-propose); **P2 Lapis & Gold**
    (would force the swap/pact violet to move to plum).
  Enforced by: src/app.js `timelinePicks`/`renderTimeline`, src/styles.css rails/dividers/
  ghost/count/mask rules. Affects: the timeline; the Spell table name cell (tags removed).

- **D125 (2026-08-29) The forward guide clamps its current pick step to the row's FIRST open
  slot — found by the F4 fresh-eyes gate.** Mechanism: F4 gate session (fable@high, separate
  from the F1–F3 build session), reviewing the shipped rail against D118(a–k). The hole: skip
  an earlier pick slot of a row, jump to a later slot of the same row — the page pre-filtered
  by the LATER slot's castMax, but a take always lands in the row's first open slot (the pick
  arrays are dense, D115(b,h): push-at-end and `sliceInsertAt` both resolve there), so a
  legal-looking pick could arrive at a slot whose cap it breaks. Reproduced: Bard 3, L2 slot
  skipped, L3 step current ("level 1–2 is legal") — taking Invisibility (L2) landed in the
  L2 slot (cap 1) and went red. The rail flagged it instantly and nothing was lost (D118(e,g)
  held; the failure was only the pre-filter's honesty, D118(b)). Fix: `guideSync` retargets a
  forward, not-done spell/cantrip step whose `pos` exceeds the filled count to the same
  row+kind step at the filled count — the note and cap now always describe where the pick
  really lands; once the earlier slot fills, a jump to the later step sticks. Reverse mode is
  positional placement and needs no clamp. *Rejected:* letting the take honour the clicked
  slot's position (a hole in a dense array is exactly the holding pen D118(g) rejected);
  filtering by the landing slot while leaving `cur` on the clicked step (the rail would
  highlight one step while the note described another). Side note, logged not fixed: in
  reverse mode a step at `pos ≥ length` accepts a placement click as a silent no-op —
  harmless (never deletes) and unreachable in a normal walk. Gate verdict: every other
  clause of D118(a–k) verified in-browser this session (all three entries, chooser, both
  walks, inline structural answers, phone sheet + whole-chain toggle, stateless close/resume,
  skip/frontier semantics, 73 steps at Bard 20, reverse re-entry at the first illegal slot,
  own-picks narrowing, flag-don't-prune). Enforced by: src/app.js `guideSync` clamp; the
  cap/note text follows `guidePickStep()` so it cannot drift separately. Affects: PLAN.md F4
  (done), STATE.md next-action.

### Superseded
- ~~**D14** Level budget = free distribution~~ → **D18.** Free distribution was wrong for
  known/level-swap casters (a Bard learns spells on level-up capped at its top slot); it survives
  only for daily preparers.
- ~~**D22** Sub-heading style = accent uppercase~~ → **D24b.**
