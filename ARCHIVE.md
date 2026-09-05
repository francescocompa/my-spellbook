# ARCHIVE — My Spellbook

Bodies moved out of `STATE.md` so `/resume` doesn't pay for them every session.
Nothing here is deleted from the record — `STATE.md` keeps a stub or a one-line
outcome for every section below, and git holds the full history either way.

Created 2026-08-26 (at commit `7f57021`).

---

## v6 / v6.1 — shipped + deployed {#v6}

Three note-batches that took the app from "works locally" to "public on GitHub Pages".

Note-batch 1 (table + choices + feats):
- [x] Subclass "pick one" aligned under the subclass field (grid-column 2).
- [x] Picker chips show per-source `n/cap` counts, red when over forecast (D7).
- [x] Group header count next to label ("CANTRIPS 21"); toolbar aligned right.
- [x] Spell table: **Prepare-daily** multi-step modal (one step per non-static caster);
  removed the "show all eligible" toggle + inline row prepare (D8).
- [x] Shortened column values (Evoc./1m/Instant./ft); **Save/Atk chip column**;
  read-only preparation column with per-marker tooltips.
- [x] Choices source tag inline after the giver name.
- [x] **Epic-boon feats gated** to char level ≥19 as their own slot (D9).
- [x] Chip right margin fixed (× button kept UA default padding).
- [x] Subclass always-prepared spells no longer offered to their own class (D10).

Note-batch 2 (content system + deploy):
- [x] **Runtime content layer** — rebuildable indexes; slot tables moved into app.js;
  `assembleData()` merges baked/imported/custom; `pruneState()` drops stale build refs.
- [x] **Custom spell authoring** — stepped modal, Homebrew source + class tags,
  live preview, edit/delete from the detail modal (D11).
- [x] **5etools importer** — `extract.js` (Node-validated identical to extract.py:
  936/30/322/276/215, 0 errors); paste/file staging, source-lookup join.
- [x] **No-data build + onboarding**; `docs/` public build; **deployed to Pages** (D12).
- [x] Repo made public, `data/`+`dist/` untracked + **purged from all history**.

Note-batch 3 (v6.1 — SRD, budget rework, zip):
- [x] **SRD 5.2 embedded** in the public build (339 spells / 12 classes, CC-BY-4.0);
  extract.py emits `data-srd.json`, build.py inlines it into `docs/`; credit footer (D13).
- [x] **Per-level budget tiles reworked** — each level shows `picked / total`; max level
  badged; per-level over-flagging removed → free distribution (D14, later superseded by D18).
- [x] **.zip import** via native `DecompressionStream` (ported from monster-forge, no dep) (D15).
- [x] Onboarding is now a **modal** (pops on empty site; custom-spell option removed) (D16).
- [x] **Empty-search custom CTA** — "Create <query> as a custom spell", prefilled.
- [x] **🎲 random build hidden on the public build** (`window.__PUBLIC__`) (D17).

---

## v6.5 / v6.6 — shipped + deployed {#v65}

- [x] 🐛 **Innate-cast parsing** merged from `claude/zen-rhodes-4b15f8` — a cadence map under
  prepared/known/expanded is routed through `emit_cadence` instead of being read as a spell list.
- [x] 🐛 **Thunderclap range** — 2024's `emanation` shape was unhandled (69 spells rendered as a
  bare "emanation"); point ranges of type sight/unlimited also never reached their branch.
- [x] **Remove sidekicks** — Expert/Spellcaster/Warrior dropped in both extractors. 30 → 27 classes.
- [x] **Spell filters: upcast + consumed** — `comp` now carries `cost` (copper) + `consume`;
  Tags gained "Upcasts" and "Consumes mat.".
- [x] 🐛 **Prepare-state hover popover** — the markers had a native `title`, which reads as broken.
  New generic `attachTip()` reuses the styled `.sptip` popover.
- [x] **Picker design-system polish** — not a taste question: `.entrow .tk` never matched the chip
  rules (scoped to `.take .tk`). Unscoped; selected chips go red on hover.
- [x] **Source checklist shared by every picker** (D27) — `renderSourceChecklist()`/`srcQuick()`.
- [x] **Unified feat picker** (D27) — one picker, grouped "feat kind" row preset per slot but editable.
- [x] **Spell-table column rework** (D29) — registry + `cellFor()`, ⋯ column checklist with
  drag-to-reorder, global preference under `spellForge.table.v1`.
- [x] **Optional features** (D28) — `optionalfeatures.json` extracted generically (213 records, 54
  spell-granting); slots come from `optionalfeatureProgression` on classes, subclasses **and feats**
  (Eldritch Adept, Metamagic Adept, Martial Adept). Picked features resolve grants like feats do.
- [x] 🐛 **Bare-list `innate` blocks** — `innate:{"_":["mage armor|xphb"]}` (the at-will shorthand)
  was skipped by the `isinstance(cadmap, dict)` guard, so 23 of 54 spell-granting optional features
  produced nothing. Fixed in both extractors → 54/54.

v6.6 — Francesco's second batch:
- [x] **Components cell back to icon + colour**; material text + price in a popover on the M,
  tap-to-show on touch, Esc / outside click to dismiss (D32).
- [x] **Feat pickers show what you still owe** at this level — budget pills.
- [x] **Choices grouped by granting entity** + category tag on every row/group (D30).
- [x] **"In build" column renamed to Source** (`book` remains the printed book).
- [x] **Always-prepared block** is a real title with a muted explainer; "free" removed — it read
  as at-will.
- [x] **Prerequisites** end-to-end (D31) — extracted for feats *and* optional features, evaluated
  against the build, eligible-first ordering with a dimmed blocked section, ⚠ on picked entities
  whose prerequisites lapse.
- [x] **Feat kind always offers Epic boon**, unselected below level 19.
- [x] **Books / grants-spells / feat-kind moved into a per-picker overflow menu**, with a count
  badge when any filter is off its default.

---

## v7 note batches — shipped {#v7-notes}

Shipped alongside v7 T1–T3 (commit `32b588d`). The decisions they produced (D38–D41) stay
live in `STATE.md`; this is the task-level record.

Batch 1 (prerequisites, popovers, chrome):
- [x] Prerequisite section title removed; prerequisites render as per-part **verdict chips**
  visually distinct from the grants line. Level is verified and flagged.
- [x] **Extractors emit `checks`** — the unverifiable parts of a prerequisite kept separate, so
  the checkable ones get a real pass/fail instead of one undifferentiated "check …".
- [x] Material popover → Cost / Consumed chip / Material, with the price-and-consume restatement
  stripped from the material text (trailing clauses only; mid-sentence ones say *which* component
  is spent and are left verbatim).
- [x] 🐛 `color-scheme` was missing entirely — native scrollbars followed the OS, not the theme
  toggle. Set in all three theme blocks + themed WebKit scrollbars.
- [x] 🐛 Carets are drawn, not typed — `⌄` sat wherever its font put it.
- [x] Access section hides its horizontal scrollbar; the expander is pinned right.
- [x] **Picked filter** in both spell modals (pick + prepare), with a count badge.

Batch 2 (the spell list and table):
- [x] "Every spell (ignore eligibility)" option on the class/list filter (D40).
- [x] Searches surface near-misses dimmed, tagged "not on your lists" / "filtered out" (D40).
- [x] One source-book chip (`.bchip`) everywhere a printed book is named (D39).
- [x] Book removed from the eligible-spell rows, moved to the spell modal's title line; the
  modal's × was escaping its box (no `position` on `.box`) — fixed.
- [x] Spell table centred; abbreviated values restore in a hover popover (D38).
- [x] Cantrip group note removed (D38); "?" dropped from unverifiable prerequisite chips (D41);
  crossed prerequisites made actionable (D41).

---

## Pre-v7 storage — what T1 replaced {#pre-v7-storage}

Before T1, `state` was a single blob in `localStorage["spellForge.v2"]`: `classes, speciesKey,
feats, optFeats, chosen, choices, enabledSources, filters, nextRowId`. Alongside it sat three
keys that were **not** part of a build: `spellForge.table.v1` (column layout),
`spellForge.custom.v1` (homebrew spells), `spellForge.import.v1` (imported 5etools data).

The blob is still written-to-once and left in place as a one-release rollback; the migration
reads it on first boot. See `STATE.md` → Gotchas → Builds layer for the current shape.

---

## Decision rationale — bodies {#rationale}

`STATE.md` keeps every decision's headline and its **rejected options** (the part that stops a
future session re-proposing something). The reasoning behind the shipped ones lives here.

**D8 · Prepare-daily.** One modal step per **non-static** caster (daily + wizard spellbook);
static "known" casters excluded, since they don't re-prepare. Removed the table's inline prepare.

**D9 · Epic boons.** Category EB carved out with its own dropdown + budget slot, gated to
character level ≥19; general ASI feats become 4/8/12/16 (19 is the epic slot).

**D11 · Custom spells.** Stored as a toggleable "Homebrew" (HB) source; class-list tags drive
eligibility; stepped modal (Identity / Mechanics / Lists+text) with a live preview.

**D12 · Deploy = app-not-data, repo public + history purge.** `docs/` shell on Pages; the repo
was flipped public after force-pushing a filter-branch'd history with `data/`+`dist/` removed
everywhere. (D13 later added the licensed SRD subset back into the public build.)

**D15 · Zip import.** Native `DecompressionStream('deflate-raw')` + a manual ZIP
central-directory walk, ported from monster-forge. No JSZip. `zipWanted` allows the
spell-source-lookup under `generated/`.

**D21 / D25 · Spell modal Access section.** Each modal lists who grants the spell per category
(Classes / Subclasses / Species / Feats) as horizontal-scroll chip rows, edition-deduped (prefer
newest via `srcRank`) from `sp.cls/sub/feat/race`; empty categories omitted. D25 then collapsed
it by default to one merged row inline with the label plus a ⌄ expander (`data-exp` toggle).

**D22 / D24b · Description sub-headings.** A desc/higher paragraph that is a short "Title."
(≤5 words, `_TITLE_RE`) renders as `.spttl` instead of body — a render-time heuristic, no
re-extract needed. D22 shipped it accent-uppercase; Francesco called that "too flashy" and the
hierarchy was off, so D24b restyled it as a quiet label: muted, sans, 11px/600, sentence case.
Mockups A/B/C were shown; B was chosen.

**D23 · Level lists as ranges.** `fmtLevelList`/`fmtDesc` collapse "0;1;2" → "0-2" in grant
descriptions. Render-time, so it covers baked and imported data without an extract change.

**D24 · Grant feature names.** Both extractors build a feature index from each class file's
`subclassFeature`/`classFeature` entries and match every `additionalSpells` grant back to the
feature that describes it (same @filter, or a named @spell, else the sole spell-granting feature
at that level, table rows included). ~93% get a real name; the rest fall back to the subclass
name, because only 17 of 925 grants carry one in the source data.

**D26 · Species & feats picker modals.** The species dropdown and the three feat dropdowns became
`.picksel` trigger buttons opening a shared `#entityModal` (`openEntityPicker(kind,category)` /
`renderEntityList`): search + source-book filter + "grants spells" toggle, each row showing name
+ source + ✦ + a `grantPreview()`. Select commits (species single, feats multi).

**D28 · Optional features.** Extract `optionalfeatures.json` generically (name, source,
`featureType`, prerequisites, `additionalSpells`) plus each class/subclass's
`optionalfeatureProgression`, so slots are data rather than per-type code. Nothing 2014-only gets
special machinery — source enablement + edition dedup decide visibility. Spell-granting types
present: EI 38, ED 12, PB 2, FS:P/FS:R 1 each. Francesco's raw note: *"All of them. Check the 2024
artificer, do not build 2014 only outdated elements"* — he overrode the narrower scope I proposed,
and the generic progression data made the per-type cost I feared not exist.

**D29 · Spell-table column rework.** Order: prepare-marker · spell · save · school · time · range ·
components · duration · conc · casts · source-in-build · source-book. Both source columns stay
always-on — Francesco overrode "hide the book by default", accepting horizontal scroll at narrow
widths. (D39 later removed the book from the *eligible-spell rows*, a different surface.)

**D30 · Choices grouped by granting entity.** `resolveGrants` carries an `owner {id,name,src,kind}`
through nested option groups, so the choices panel groups every row a single entity produced
(Magic Initiate's four rows become one block) and tags each row/group with its category. A lone
choice keeps the flat row, with the tag added.

**D32 · Material component popover.** The table's components cell went back to plain `V S M`, the
M tinted gold (costly, kept) or accent (consumed); text and price live in a popover. This reversed
D29's cost-inline treatment (mockup B), which Francesco had picked and then reversed after seeing
it in place: the price widened the column for a fact you rarely need mid-scan.

**D38 · Spell table as a grid.** Every column and its contents centre-aligned, headers included;
group headers stay left. `shortCell()` attaches the full value in a hover popover only when the
displayed text was actually abbreviated, and marks those cells `cursor:help`.

**D40 · Eligibility is a default, not a wall.** Dimmed entries sort below the eligible ones inside
their level group and the count reads `N spells · M dimmed`. Same treatment as a blocked feat in
the pickers (D31).

**D41 · Prerequisite quick-fix.** A prerequisite part naming something concrete carries `pick`
metadata; clicking the ✗ chip opens a popup offering to take it. Species swap (single-valued, and
the popup says what it replaces); feats and optional features are added. Committing from a
disabled book enables that book, mirroring the picker rule.

---

## Backlog items closed {#closed-backlog}

- ~~Feat prerequisites are display-only~~ — done (D31); enforcement stays advisory by design.
- ~~Grant feature names — correlate `additionalSpells` to subclassFeatures~~ — done (D24, ~93%).
- ~~Feature names for 2024 blocks (Lore's "Magical Discoveries")~~ — done (D24).
- ~~🐛 Innate-cast parsing — phantom "Daily"/"Rest" grants~~ — done; merged from
  `claude/zen-rhodes-4b15f8`, plus the bare-list `innate` bug found on top.
- ~~Per-source subclass de-duplication in the picker (2014 + 2024 both show)~~ — done (D19).
- ~~Picker design-system polish~~ — not taste: `.entrow .tk` never matched the chip rules, which
  were scoped to `.take .tk`. Fixed by unscoping `.tk`.

### Closed in the importer / custom-source sessions (2026-08-27)

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
- [x] ~~**IndexedDB** for imported data~~ **CLOSED 2026-08-27 → D93** — the digest lives in
  IndexedDB; localStorage keeps only builds, sources, custom spells and the column layout
  (~16 KB measured). Closed T7 with it.
- [x] ~~Importer UI polish — per-source keep/remove, monster-forge style ticking~~ **CLOSED
  2026-08-27 → D86.** A "clear imported data" button is still absent: unticking every book in the
  plan is the equivalent, and it refuses to leave you with nothing.
- [x] ~~Wizard prepare-daily: separate **prepared subset** from the spellbook/known list~~
  **CLOSED 2026-08-26 → D62** — `chosen[idx].prep` is the daily subset, drawn from the book.
- [x] ~~**Custom sources UI redesign**~~ **CLOSED 2026-08-27 → D94** — direction A (progressive)
  plus C's live summary sentence, modal only. The model (D55/D65) was never the problem and is
  untouched.
- [x] ~~**Free-cast modifications that are not grants**~~ **CLOSED 2026-08-27 → D85 widened** —
  seven of the ten turned out to GRANT their spell, so D79 already covers them. The three that
  don't (Archfey's *Steps of the Fey* and *Bewitching Magic*, Cleric's *Divine Intervention*) are
  now `CAST_MODS` entries with an empty `drop` and their own `label` — a free cast is a change to
  how you cast something you already have, which is exactly what D85 models.
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

<a id="v7-batches"></a>
## v7 note batches 1–7 (2026-08-26 → 2026-08-27) {#v7-batches}

Lifted out of STATE's TL;DR on 2026-08-27 — the block had stacked one paragraph per batch,
which is exactly what the resume doc is not for. Decisions D43–D81 stay in STATE; this is
only the narrative of what each batch contained.

- **Batch 1 (15 notes)** — Choices as uniform groups, in-line feat count tiles, neutral chips,
  lineage-grouped species picker, mobile jump bar + fitted top row, and in the spell modal a
  collapsible summon stat block, book popovers with page, cantrip meta.
- **Batch 2 (10 notes)** — new-build modal; **delete fixed** (native `confirm()` is dead in
  webviews → armed two-click buttons, D53); class-searchable build summaries; the **level
  preview scrubber** (D54); **custom spell sources** (D55); **homebrew & UA import** (D58); the
  **full SVG icon sweep** (D57); `serve.py` `no-store`.
- **Batch 3 (9 notes)** — preview interaction bugs (`attachTip` swallowing button clicks; `xBtn`
  letting a re-render's event re-arm the preview); the order panel rebuilt as **draggable level
  cards naming real class features** (D59/D63); **lock chips** (D60); a **fixed-size tab switch**
  (D61); **the wizard's spellbook and prepared list separated** (D62); per-level loadouts settled
  as **versions, not per-pick stamps** (D64). Custom sources got the deeper pass — shared charge
  pools, own DC/attack/ability, fixed cast level, list mode (D65).
- **Batch 4** — icon-only action buttons wherever the label was a verb (D66); the Choices card's
  category as a subtitle with feats naming their own type (D67); **slots and max spell level as
  two separate clocks** on the level cards (D68); species lineages renamed between editions stop
  appearing twice (D69); equal card spacing on a phone.
- **Batch 5** — the `x/0` tile clamp bug (D70); level cards as tiles (D71); spell rows on a rail
  instead of a fill (D72); prepare-daily tabbed by set with a **Granted** tab (D73); the spell
  modal's stat block hierarchy and monster-forge ability table (D74); preview-fork naming (D75).
- **Batch 6** — the **Magical Secrets level weighting** (D76); grouping headers off the accent
  (D77); **creature sets + the stat block carousel** (D78); the selected-chip highlight bug.
- **Batch 7** — **prose-only grants and grant modification notes** (D79, closing the Warlock's
  missing Mystic Arcanum and Contact Patron's free cast); the Magical Secrets picker (D80); the
  carousel's book panel and bottom controls (D81); a two-pass audit of every XPHB class and
  subclass for missing spell sources.
- **Batch 8 (a bug hunt, not notes)** — the importer had been silently corrupting **every** zip
  import: per-directory `foundry.json` files slipped past `zipWanted()` and their stubs overwrote
  real records (D82). Then the stat block head rebuilt as sibling buttons after the nested-
  `<button>` hoist, the carousel's shared book checklist / pinned controls / `-alt` group names
  (D83), and an empty stored import that could blank the app.
- **Batch 10 (6 notes, 2026-08-27)** — a polish-and-backlog pass. The switcher's characters became
  cards with a pinned footer (D87, mocked up against a rail variant and chosen side by side);
  reference prose moved behind a `?` disclosure while live state stayed visible (D88); the staged
  files collapsed to one scrolling row with the Access section's expander; casting mods reached
  the spell table as a chip row plus a marker on the Source cell; the double divider above a
  dimmed picker section is gone; the book chip left the spell-pick modal (D89). Eight backlog
  items closed, among them the standing extractor-parity ⚑ (one `undefined`/`null` slip — grants
  are byte-exact on 929 shared records), the `page`-less book chips, `scope.giver`'s substring
  fragility, and a homebrew manager under ⋯ → **My homebrew**.
- **Batch 9 (4 notes, 2026-08-27)** — the build switcher's version and character names became
  fields you type in, and its per-row ⋯ menu stopped being clipped by the popover it lives in;
  **imports became additive** with one "Your books" keep-list that also removes what you no
  longer want (D86); **feat categories became data-driven**, with origin a subset of general and
  budget attributed to the slot spent (D84); and **casting-rule modifications** — features that
  strip V/S/M from spells you already have — reached both extractors and the app (D85).

<a id="v7-decisions"></a>
## v7 decision bodies — D43–D80, the ones that no longer bind {#v7-decisions}

Moved out of `STATE.md` on 2026-08-27 by `/clean`. These are **settled and shipped**: their
result is simply how the app looks and behaves now, and the rules any of them still impose live
in `GOTCHAS.md` or in the one-line entry left behind under "Settled" in `DECISIONS.md`. Nothing here was
deleted — the headline and the rejected options stayed in the live doc, this is the reasoning.

- **D43 (2026-08-26) Every giver in "Choices to make" is a group** — a giver with one choice
  used to be a bare row and one with several a bordered box, so the same thing had two
  treatments. Now every giver is a `.choicegroup`; the granting *feature* is named once above
  the run of rows it owns (it used to repeat twice then vanish); and each row is one line —
  what it asks for on the left, its control on the right. *Rejected:* a flat list with a quiet
  giver label (Francesco's call — the box carries the grouping more clearly); an accordion per
  giver (a pending choice can hide behind a fold).
- **D44 (2026-08-26) A slot's count is a tile in line with its field, not a chip on the label**
  — origin / general / epic each carry their own `n/cap` tile at the field's own height, in
  three states: `need` (accent), `done` (green), `over` (red). The single `origin 0/1 · general
  1/4 · epic 0/1` chip on the FEATS label is gone. Optional-feature slots use the same tile, so
  the Character card has one language for "how many of these do I still owe".
- **D45 (2026-08-26) A taken feat is neutral; red means exactly one thing** — the base `.chip`
  was accent (a red-brown), so every general feat read as a warning. Chips are now neutral,
  `origin` stays gold and `epic` indigo as category tints, and `.chip.unmet` — a prerequisite
  that isn't met — is the only red chip in the card.
- **D46 (2026-08-26) The species picker groups lineages under their species** — both extractors
  emit `base` + `lineage` on every species record, and the picker renders one `.entgroup` per
  base with its lineages as sub-rows (the same shape D43 gave the choices card). A species with
  no lineages stays a flat row.
- **D47 (2026-08-26) The top row and the table header stay ONE row on a phone** — the header
  wrapped and the title truncated. The tab switch drops to short labels (`Build` / `Table`)
  before the title is allowed to shrink, and the title never ellipsizes. In the spell table the
  same rule holds by turning **Prepare daily** into its ☾ icon below 620px; the total-spells
  chip is kept (it is information, the label is not). *Rejected:* collapsing the switch to
  icons (ambiguous — the app's glyph vocabulary is already spent on the ⋯ menu).
- **D48 (2026-08-26) Mobile navigation = a docked jump bar, not a second level of tabs** — five
  stacked cards made reaching your classes from the spell list a very long scroll. A fixed
  bottom bar gives one tap per section and tracks the one you're in. The page stays **one
  continuous scroll** on purpose: the prepared budget and the spell list are read together.
  *Rejected:* Build splitting into mobile sub-tabs (loses the budget while picking spells, and
  stacks two tab rows); collapsible cards with sticky headers (reaching a section still means
  scrolling past the folded ones). A smooth scroll is attempted and **falls back to an instant
  jump** — some embedded webviews accept `behavior:"smooth"` and never move.
- **D49 (2026-08-26) A cantrip's modal says it once** — the subtitle reads "`<School>` cantrip"
  (was "Cantrip `<School>`") and the Level and School rows leave the grid, where they only
  repeated the line above them. Levelled spells keep both rows.
- **D50 (2026-08-26) Summon stat blocks live in the spell modal, collapsed** — 24 spells print a
  creature beside them. They are matched by the bestiary's own **`summonedBySpell`** field, not
  by parsing `{@creature}` refs out of spell text, so there are no cross-source false positives.
  The section is collapsed by default (it is reference material, not part of reading the spell).
  The importer keeps only these monsters from a bestiary file — a full one is megabytes.
  **SRD gate:** a non-SRD stat block is stripped from an SRD spell in the public build.
- **D51 (2026-08-26) A book chip carries a popover, not a native `title`** — full book name,
  the page the inspected element is printed on, and the code. Both extractors now emit `page`
  on spells, classes, subclasses, feats, species and optional features. Works on touch (the
  shared `attachTip` treats a tap as hover).
- **D52 (2026-08-26) The build switcher lives in the header, beside the title** — `▤ <character>
  <version>`, with a popover grouped by character plus New build / Manage builds…. It is a quiet
  label you can act on, not a control competing with the Build/Table switch, and it goes through
  `switchBuild()` so T2's activation dialog still fires. *Rejected:* putting it in the ⋯ menu (T4
  asks for it to be **visible**, and a menu isn't); a full-width build bar on every screen (chrome
  on every view for what is usually a single-build session); replacing the app title on mobile
  (D47 had just been spent making the title fit) — on a phone it takes its own line instead.
- **D54 (2026-08-26) Level preview: plan at full level, look at any level below it** — the level
  chip on the Character card becomes a scrubber (`preview − L5 + ×`). View-only: `PREVIEW` is
  never saved, releasing it changes nothing; picks above the previewed level get the existing
  soft over-flags (D37), grants not yet unlocked vanish, slots/budgets/eligibility all follow.
  Multiclass works through the **level plan** (`state.levelOrder`, saved): which class each
  character level is taken in, edited in a per-level modal whose edits normalize against the
  build's real class totals — an overfill snaps back, so no invalid state exists. *Rejected:*
  versions-as-levels with a "duplicate at level N" helper (real copies drift when the plan
  changes); a true level timeline (the standing non-goal).
- **D59 (2026-08-26) The level-order panel is a single column of draggable level cards** — one
  card per character level in acquisition order, dragged by a handle, each naming its class and
  what that level gives. Single column at every width: the list is a **sequence**, and columns
  break the reading of it. *Rejected:* a per-level `<select>` grid (compact, but you cannot see
  the shape of the progression); a multi-column card grid (Francesco's call).
- **D60 (2026-08-26) A level gate is a lock icon + the level, never prose** — "— unlocks at 3 —"
  was truncated inside the subclass `<select>` at desktop width. The `<select>` says
  "— locked —" and the LABEL carries a `.lockchip` (lock + `L3`) with the explanation in its
  popover. **Reuse `lockChip()` for anything gated on a level.** A label carrying a chip
  ellipsizes its own text rather than wrapping, so rows never lose alignment.
- **D61 (2026-08-26) The Build/Table switch is a fixed size** — selecting a tab bolds it, which
  changed its width and made the whole switch resize. Each label now reserves the width of its
  own bold rendering (`::after` with `attr(data-t)`), so selection changes weight and nothing else.
- **D62 (2026-08-26) A wizard's spellbook and its prepared list are different sets** — "Prepare
  daily" was editing the spellbook, because both lived in `chosen[idx].spells`. The book stays
  there; the daily subset is `chosen[idx].prep`, capped by `known.prepares` (the class's own
  `preparedSpellsProgression`, already in the data). The prepare step for a book caster lists
  **the book**, not the class list. The cart gains a Prepared meter and the table distinguishes
  ● prepared today from 📖 in the book but not prepared. Dropping a spell from the book
  unprepares it. Closes the D8 caveat.
- **D63 (2026-08-26) Level cards name real features, not derived counts** — both extractors emit
  `features:[{level,name}]` for classes and subclasses (the feature index already existed for
  grant correlation). "Arcane Recovery · Ritual Adept" says more than "+1 prepared". ASI/Epic
  Boon and the `<Class> Subclass` placeholders are filtered; spellcasting milestones (a new
  spell level, a new slot) are kept as a separate accent line. Sorting is case-insensitive in
  **both** extractors so parity stays byte-exact.
- **D66 (2026-08-26) An action button whose label is a verb is an icon** — extends D57 from
  chrome to actions. `order…` / `save as version` on the level preview (which also drops the word
  "preview" — the chip's context is the level), `export` / `duplicate` / `delete` in the build
  manager (three word-buttons ran into the `current` chip on a phone), `select` in the species /
  feat / spell pickers, and `clear` in an eligible-spells group header. One class, `.ico-only`, and
  the meaning moves to the popover or `title`. A destructive icon still ARMS to the word
  "confirm?" (D53) — the icon must be appended **before** `armConfirm`, which snapshots
  `innerHTML` to restore. *Rejected:* keeping text on the destructive ones (the row's width was
  the problem, and `delete` was the widest); icon + text (the same width back).
- **D67 (2026-08-26) In "Choices to make" the category is a subtitle; the book chip is the only
  tag** — two tags side by side on the group head read as equals when one names the *printing* and
  the other names *what kind of thing this is*. The category drops to a quiet line under the name.
  A **feat also names its own type** there — "origin feat", "general feat", "epic boon", "fighting
  style" — because "feat" alone doesn't say which of your slots it came out of. Revises D30's "a
  category tag on every row/group". *Rejected:* dropping the category (it is how you tell a
  subclass choice from a species one at a glance).
- **D68 (2026-08-26) Slots and max spell level are two clocks, and a level card shows both** —
  the cards derived both from the class's own slot table, so in a caster-caster multiclass the
  slot gain landed on the wrong level. **Max spell level** follows that class's OWN level;
  **slots** follow the COMBINED caster level. A Bard 7 / Wizard 2 gets 5th-level slots at
  character level 9 while the Bard's own max spell level is 4th — the card now says both, the slot
  line in accent and the max line quiet. `planSlots()` reads the whole plan up to each card;
  `levelGains()` is features-only. The panel's bottom note is gone (the modal's own subtitle
  already said it). *Rejected:* one merged line (it is exactly the conflation that caused the bug).
- **D69 (2026-08-26) Species collapse on base + lineage, not on name** — reverses the recorded
  "different names, deliberately not normalized". A lineage can be RENAMED between editions
  ("Elf (High)" → "Elf — High Elf"), so a name match missed it and the picker listed Drow and High
  Elf twice. `raceDedupeId()` keys on `base|lineage` with the base word stripped back off the
  lineage, and the existing Editions filter hides the older printing — `reprint→all` still reveals
  it. Verified nothing over-collapses: the SCAG/MTF/ERLW variants and the Kaladesh/Zendikar
  settings all survive. *Rejected:* nesting both printings under one row (one more level of
  nesting for a duplicate nobody wants to see); a canonical key from both extractors (structurally
  cleaner, but it is an extract.py + extract.js change plus a data rebuild for a display problem).
- **D70 (2026-08-27) A ratio widget may never state an impossible ratio** — the per-level tiles
  printed `4/0`: being over the PREPARED TOTAL drives the per-level room negative at every level
  at once, and the old `Math.max(0, held+room)` clamp turned that into a denominator BELOW the
  numerator. The denominator now floors at what is actually held; the `.over` state and the meter
  above say what is wrong, and the tooltip names the real cause ("you are over your prepared
  total, so there is no room at any level until you drop some"). The tile design itself is right
  (Francesco's call) — this was a clamp bug, not a modelling one. *Rejected:* dropping the
  denominator for daily preparers (I proposed it; the per-level ceiling is real information when
  you are inside your budget).
- **D71 (2026-08-27) A level card's two clocks are tinted tiles on the right edge** — supersedes
  D68's prose lines. Both tiles are present on every card so either progression reads straight
  down the column; each keeps its own hue at all times (**spell = accent, slot = gold** — the tint
  IS the label, never grey), and the level that RAISED one takes the full colour and a border. The
  `+N slots` count is gone: the number of slots is on the Slots card, and what a level card is for
  is *when a threshold moved*. A **feat / epic boon** is budget you owe, not a feature, so it
  leaves the prose run for its own gold chip beside the class name. The drag handle centres on the
  card, not on its first line. *Rejected:* a tile only on the level that changes (ragged right
  edge, and you have to scan upward to answer "what is my max spell level at L7").
- **D72 (2026-08-27) A picked spell row gets a rail, never a fill** — the old
  `background + border-radius` on `.sp:hover` and `.sp.chosen` cut through the 1px divider and
  read as broken stripes. Both fills are gone. Picked rows carry a 2px green rail that **insets
  vertically and rounds its ends**, so a run of picked rows reads as one rail per row rather than
  one long bar, and the left padding that holds it is reserved on EVERY row so nothing shifts when
  you take a spell. The take chip stops being a solid green pill — **green lives on the icon
  only**, the chip just gains ink-weight text, so it still reads as a button. *Rejected:* a 6%
  square-cornered tint; the spell name going green (competes with the ritual badge and the name's
  own click affordance); no signal at all beyond the chip (Francesco picked the rail).
- **D73 (2026-08-27) Prepare-daily is tabbed by SET, and its chrome hides when it has nothing to
  do** — the tabs are one per re-preparing caster **plus a "Granted" tab** for grant picks you
  chose rather than were given (High Elf's Wizard cantrip and its kin, which the 2024 lineages
  re-choose on a long rest). The tab row hides with one tab, the level filter hides when only one
  level is present, the toolbar never wraps (the search field is what gives way), and the
  prepared count moves out of the toolbar to the **centre of the footer** — it answers "am I
  done", which is a footer question, not a filter. **Caveat:** the data carries no swappable flag,
  so the tab lists every `kind:"known"` pick; a one-time choice like Aberrant Dragonmark's appears
  there too. Detecting the real long-rest swap is a backlog item.
- **D74 (2026-08-27) The spell modal never says the same thing twice, and its stat block follows
  monster-forge** — Level and School leave the grid for **every** spell, not just cantrips (D49
  widened): the subtitle already reads "5th-level Conjuration". The stat block's header inverts —
  the **creature names the section** in the display face, with "stat block" as the small uppercase
  label after it. The ability block becomes the monster-forge **table**: two ability columns, each
  score / Mod / Save, proficient saves bold (no summon carries one, so a save is its modifier).
  Access chips all look the same — the category is named by the row they sit on when expanded, so
  tinting them by kind in the merged row only added noise.
- **D75 (2026-08-27) A version forked from the preview keeps its lineage in its name** —
  `<version> · LV<level>` ("L9 · LV5"), so you can see what it came from and at what level.
  *Rejected:* the bare level (two forks from different versions at the same level collide);
  the character name (it already sits above the version in the manager).
- **D77 (2026-08-27) A grouping header carries no accent** — the source group ran accent text on
  an accent-soft band while the ability names carry the six ability hues, so two colour systems
  fought inside one table. The outer group keeps a neutral `--panel-2` fill with ink text and its
  **casting-stat chip** (never a book chip — the stat is what you group on); the level sub-header
  drops to a quiet muted sans label. The ability names are now the table's only hue. *Rejected:*
  no fill with a rule above (lighter but the groups read loose in a long table); a small-caps
  label over a hairline (quieter still, same problem).
- **D80 (2026-08-27) Magical Secrets gets its own picker** — the off-list meter had no way to act
  on it, so adding an off-list spell meant hunting the eligible list. "Add an off-list spell"
  opens the spell-pick modal scoped to the lists the feature opened (the class's own list is
  filtered OUT), mirroring the wizard's "Copy a spell into your book".


<a id="v7-tasks"></a>
## v7 — saved builds, task bodies (archived 2026-08-27) {#v7-tasks}

> Consumed 2026-08-27: all six tasks done. The non-goals stayed in `STATE.md`.

One character at a time was the last hard limit in the app. T1–T3 removed it, T4 made builds
reachable from the header and T5 got them off this machine as files. T7 told the truth about
storage limits and then removed most of them (D93). **v7 is complete.**

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
- [x] **T7 · storage-pressure reporting** (`data`, ~S) — **DONE 2026-08-27 (D93).** No count cap
  (D37). The imported digest moved to **IndexedDB**, and `importSave()` returns a sentence rather
  than a boolean: on a quota failure it names the entry count, the book count, the **three
  largest books by entry count**, and the browser's real `navigator.storage.estimate()`
  quota/usage. *Verified:* a 161 MB digest that localStorage rejects with `QuotaExceededError`
  stored in IndexedDB in 65 ms (quota measured 2,500 MB); forcing both stores to fail produces
  "…its database is unavailable — a private window blocks it — and the fallback store is full.
  This holds 2291 entries across 64 books, the largest being Player's Handbook (2024) (600)…".
  Nothing is lost on a failed save — `IMPORT_CACHE` is only replaced once a write resolves.
- [x] ~~**T6 · budget/choice reset semantics**~~ **Closed by D37** — picks survive a relevel
  untouched and the existing soft over-flag does the rest. No new machinery.

All v7 tasks are done. What remains for the project is the open queue in `PLAN.md`.

### Non-goals
~~Level-up history/snapshots~~ — **superseded by D34/D35**: versions exist, but as *named copies*
the app never orders or interprets. A true level-by-level timeline (ordering rules, fork-on-edit)
stays out. Server sync or accounts. Sharing a build as a rendered page, or via a URL (D36).

## Phase E task bodies — a build at every level (archived 2026-08-29) {#phase-e}

> Moved whole from `PLAN.md` at close of the E8/phase-F session. The phase is DONE —
> E1–E7 shipped v1.2.4 → v1.2.8, the E8 gate passed at v1.2.10 (finding and fixing
> D120, the save-skip data-loss regression). The model is D115(a–j); the surfaces were
> later reshaped by D122–D124 (timeline modal, dividers+rails, ghost slots, counts).

- [x] **E1 — order substrate + saved current level** (**shipped v1.2.4**, done-when verified
  in-browser: round-trip with order + pointer + swap, migration leaves `meta.updated` alone) — treat the
  `state.chosen`/`state.feats` array order as the acquisition order; add `state.currentLevel`;
  add the swap-event shape (at most one swap per character level, D115(g)); export/import +
  migration (old builds: order = array order, currentLevel = top). **Done when:** a build
  round-trips export→import with order, pointer and a swap intact, and old builds load unchanged.
- [x] **E2 — slice derivation** (**shipped v1.2.5**, done-when verified in-browser: 27 checks
  over five fixtures — Bard 12, Fighter 10/Wizard 9 interleaved, Warlock 4/Fighter 4/Bard 12
  with slots [4,11,15,19,20], Cleric 20, Sorcerer 15 metamagic — all pass; swap rewind both
  sides) — per-class sticky-pick schedules (known
  counts, spellbook 2/level, cantrip gains, feat slots via `featSlotLevels()`) map order →
  acquisition character level; every `effLevel` consumer reads the slice; prepared lists stay
  derived (D18). App-side only — no extractor change. **Done when:** the level view lists exactly
  the sticky picks acquired by that level for the five D114 fixture builds.
- [x] **E3 — editing at any level** (**completed across v1.2.5 → v1.2.8**, every done-when
  clause verified in-browser at its step) — adds insert at the viewed level's slice point and a
  later pick pulls back to it (v1.2.5); chip-drag moves acquisition, the pill's × clears a swap
  (v1.2.7); **v1.2.8 shipped the recording surface (D119(b))**: click an eligible timeline chip
  to arm "− this pick at L{view}", take the replacement to record — the position keeps the
  acquisition history, the event carries the trade; armed / ⇄-traded / pill states all marked.
  Removal below top stands as defined: removing a visible pick removes it at every level; the
  swap is the honest alternative when the rules grant one.
- [x] **E4 — consistency sweep + badge** (**shipped v1.2.6**, done-when verified in-browser: a
  Bard 12 holding a 4th-level spell in a slot that arrives at L5 shows "⚠ L5" on the badge at
  top level, and the bar names it when standing at 5; 19 checks incl. D114's [4,6,8,14,18]) —
  per-slice legality (counts vs class tables, spell level at acquisition, boons on 19+ slots,
  choice availability); one build-health badge naming the offending levels; per-level flags in
  place. Soft (D31). *Shipped checks: spell level at acquisition (swap-aware), picks past the
  schedule (wizard copies exempt, preparers not swept), feat slots incl. origin and epic-without-
  a-19+-slot, optional features past their progression, subclass due and unset. `choices` are
  already `atLevel`-gated at resolution, so they need no separate check.*
- [x] **E5 — the timeline popover** (**shipped v1.2.7**, done-when verified in-browser: every
  interaction — open/toggle, row-click jump with the popover staying open, row drag reorder,
  chip drag move + visible refusal, swap pill + clear, pin, fork, Escape/outside/scroll-out
  closes, re-anchor on scroll — at desktop and phone widths) — chip "L7 / 20 + ⚠"; popover per
  the D115(j) mockup: zone tinting, draggable rows (the old level-order panel is retired; its
  single-column rule transferred), draggable pick chips, swap pills, current-level pin, footer
  *fork a variant here* · *set as current level*. A build now **opens at its saved current
  level** (D115(e)), and the E4 ⚠ lives on the chip with the timeline locating each finding.
- [x] **E6 — fork-a-variant + print at level** (**shipped v1.2.8**, done-when verified
  in-browser: the fork truncates arrays at the slice with swaps rewound in, drops late feats and
  options, prunes orphans, names "· L5 variant", opens on activation; the print header names the
  level and the "not a saved version" note is gone) — `savePreviewAsVersion` → fork-a-variant-here
  (truncated at the slice, named as a variant, D115(i)).
- [x] **E7 — "order matters" soft flag** (**shipped v1.2.8**, done-when verified in-browser:
  Fighter 10/Wizard 9 flags on pick timing, Warlock 4/Fighter 4/Bard 12 on the level-19 straddle,
  single-class and casterless-no-straddle multiclass stay silent) — a quiet gold line in the
  timeline header naming WHY the order is load-bearing, per D115's plan-default round.
- [x] **E8 — 🔍 fresh-eyes gate** (**passed 2026-08-28**, fable@high, separate session) — code
  review of the whole substrate (E1/E2/E4 core, E5 surface, E3 swap flow, E6 fork/print, E7,
  importer migration) + in-browser verification of every D115 clause on fresh fixtures: slices,
  swap arm→record→clear, fork rewind+truncation, pin+reopen-at-level, chip/row drag incl.
  visible refusal, D119(a) tile merge/split, preparer pass-through, wizard-copy exemption,
  E1 round-trip. **Phase E holds — one CRITICAL adjacent regression found and fixed (D120):**
  `save()`'s D116(d) skip compared the live state against itself, so pure pick edits never
  persisted (v1.2.2 → v1.2.9). Three cosmetic side notes logged in D120, none blocking.

## Phase F task bodies — the guided builder (archived 2026-08-31) {#phase-f}

F1–F4, all done, each done-when verified in-browser; the F4 gate passed 2026-08-29. The model is D118(a–k) in `DECISIONS.md`.

## Phase F — the guided builder (D118, decided 2026-08-28)

A separate coach-driven flow over the D115 substrate, forward and reverse — the full model is
**D118(a–k)**; cite it, don't restate it. Order: F1 → F2 → F3 → F4.
**F1–F3 shipped 2026-08-29 (v1.2.11 → v1.2.13); the F4 gate passed the same day** (D122–D124
— timeline modal + refinements, tile semantics, metamagic row, Ember palette — rode alongside
and were the surfaces the gate reviewed against). **The phase is closed.**

- [x] **F1 — step-list derivation** (**shipped v1.2.11**, done-when verified in-browser: the
  five D114 fixtures yield correct step lists — counts, levels, labels, castMax pools — in both
  directions, and `guideResume()` lands on the first open slot; a filled Bard 20 derives 73
  steps, inside D118(c)'s band) — `guideSteps()` derives one step per decision from the build
  alone (class-per-level, subclass, species, origin/general/epic feat slots, sticky pick slots
  via the E2 schedules, optional-feature slots, swap y/n at eligible level-ups), grouped by
  character level with pool descriptors for F2/F3. Statuses stateless (D118(j)); two calls made
  en route → **D121**: the frontier ignores class steps (a hand-levelled build reads all-open,
  not all-skipped) and OPTIONAL steps (the swap y/n) never capture re-entry.
- [x] **F2 — the coach rail** (**shipped v1.2.12**, fable@high, done-when verified in-browser
  at desktop AND phone widths: open/resume, jump-anywhere, inline class-continue/add, inline
  subclass, species/feat handoff to the real pickers, spell-step page pre-filter + guided note
  + take → auto-advance past optional steps, swap armed from the rail, Skip/Back/Next, progress,
  whole-chain toggle on the phone sheet, both walk directions) — `renderGuide()` over the F1
  chain: level-grouped rail, statuses done/open/skipped rendered honestly, structural choices
  answered inline (D118(k), no new modals), `#guideNote` names the pre-filter on the spell list.
  **No user-facing entry point yet — that is F3's whole job** (until then `openGuide()` exists
  but nothing calls it). **D122 rode along**: the timeline became a full modal (its ×, sub-note,
  order-flag, changed-only dimmed casting tiles, and multiclass run aggregation with no-op
  drops not being targets).
- [x] **F3 — entry points + reverse wiring** (**shipped v1.2.13**, done-when verified
  in-browser: all three entries reach the rail — "Create & start guided" in the new-build
  modal goes straight to the forward walk, the timeline footer's "Guide me from here" and the
  ⋯ "Guided builder…" alias open the walk chooser on a ready build; a Bard 12 fixture with
  three spell-level violations and one over-budget pick reconstructed via the reverse walk to
  **0 spell-level findings** with the unplaced 17th pick settled at top and flagged) —
  reverse mode (D118(f,g)): the chooser asks continue-vs-reconstruct and the walk direction;
  reconstruct narrows the page pool to the row's OWN picks and a take PLACES the pick at the
  current slot's array position (stateless — the position is the answer; the displaced pick
  drifts later and stays in the pool; review clicks can never delete). Reverse re-entry lands
  on the first slot whose occupant is illegal where it sits; illegal slots carry a red ⚠ in
  the rail in every mode.
- [x] **F4 — 🔍 fresh-eyes gate** (**passed 2026-08-29**, fable@high, separate session per
  model-policy) — every D118(a–k) clause verified in-browser on a fresh fixture; one real
  finding, fixed in-gate → **D125** (the forward walk's pre-filter described a later slot
  than the one a take actually fills; `guideSync` now clamps to the row's first open slot).
  **Phase F is DONE.**


## Wave batch W1–W5 (archived 2026-08-31) {#wave-batch}

Francesco's 2026-08-29 notes: all five merged, gated and tagged v1.2.19 → v1.2.23. Became D127 (edition identity), D128 (per-kind swaps), D129 (Refresh feedback).

## Wave batch (2026-08-29, Francesco's notes) — ✅ COMPLETE

All five merged, gated and tagged (v1.2.19 → v1.2.23) by the coordinating session; two
became decisions (**D128** per-kind swaps, **D129** Refresh feedback) and W3's investigation
became **D127**. The guided-builder notes became **phase G below (D126)**.

- [x] **W1 — general UI fixes** (**merged v1.2.20**): duplicate multiclass blocked (keyed on
  class NAME — editions are one class; `refreshAddClass` moved into `renderClassRows`, fixing
  a stale-select hole); popover batch (badge margin was the off-center cause; closer reads
  `composedPath()` → Gotcha updated; toggle fixed for every menu; count badge gone);
  foldable level groups in the eligible list AND the pick modal (which gained grouping —
  it was flat; revert is one line at the `lvls.length<2` branch if unwanted).
- [x] **W2 — the swap model, app-wide** (**merged v1.2.19 → D128**): `SWAP_RULES` verified
  from XPHB prose; `state.swaps[lv]={spell?,cantrip?}` with healing migration at all three
  stored-state boundaries; timeline arming per kind; Wizard cantrip 1/LR in the prepare
  modal; guide emits up to two swap steps. Agent-verified in-browser on an isolated origin.
- [x] **W3 — sorcerer/edition dedupe investigation** (agent, read-only) — DONE, see the
  report: `reprintedAs` covers all 58 cross-edition subclass links (0 misses); root cause is
  unresolved `_copy` records; TWO bigger live bugs found (67 classic subclasses missing from
  2024 pickers; **73 subclasses resolve to hollow zero-grant records** — every 2014 subclass
  currently grants no subclass spells). Francesco chose **C → D127, BUILT and merged
  v1.2.21**: `_copy` resolved in both extractors (`_mod` tripwire live at zero),
  `supersededBy` on all six types, cparity keyed with `classSource` (322/322 diffed, 42
  checks), app-side class-scoped subclass resolution + successor-aware `reprintOk`.
  Verified: no duplicate pairs in any class picker, +67 classics visible, the 73 hollow
  records healed. Needs Francesco's one-click re-import per browser.
- [x] **W4 — timeline batch** (**merged v1.2.22**, 11 items incl. 4 mid-flight additions):
  labeled ghosts (D124(b) rejection reversed, annotated); retrain chips (icon + Ln, level
  tag opens an inline move chooser — one eligibility predicate `swapLevelOk` shared by arm/
  move/ceiling); violet incoming chips + per-half count tiles (over/under crimson — "have"
  now counted at landing, so over-schedule is finally expressible); quiet click-to-choose
  on undecided gains (opens the REAL choosers); full copy scrub (all D-codes gone; trade
  wording); "+ add level" row (D126(d) shape); iconed footer (the ⇄ glyph violation fixed);
  chip-row mask padding; unified tile base color (D123(a) hue-mix clause superseded,
  annotated); pact tile fits its square. Deviation flagged: an ARMED chip's level tag is a
  marker, not a mover (no event exists yet).

- [x] **W5 — Refresh imported data UX** (**merged v1.2.23 → D129**): the ⋯ menu button
  refreshes INLINE (busy → staged progress → green done / red fail notice); the modal opens
  only for the four ask-cases a human must fix, and its own button gets the same states. Two
  FALSE-SUCCESS holes closed: a stage that read nothing (stale folder, dead permission) used
  to re-store the unchanged digest under a new parser stamp and report "Re-imported N books"
  — the likely mechanism behind the Aberrant-still-duplicated report; both now stop with
  "Your imported data is unchanged", and books the folder no longer holds are named, not
  counted.


## Phase G task bodies — the guided builder as a full-size page (archived 2026-08-31) {#phase-g}

G1–G4, all done; the G4 gate passed 2026-08-31 with findings fixed in v1.2.39 (D133). The model is D126(a–i).

## Phase G — the guided builder as a full-size page (D126, decided 2026-08-29)

Ground-up surface redesign over the standing D118(a–j) model — the full design is
**D126(a–i)**; cite it, don't restate it. Strictly after W1/W2/W4 merge.
Order: G1 → G2 → G3 → G4.

- [x] **G1 — page shell + chain column** (**merged v1.2.24**, done-when verified: the
  Bard 5/Fighter 1 walk reads in both columns at 1280 and 375, and a chain drag produced
  the identical plan as the same drag in the timeline modal) — the guide is a full-size
  fixed surface UNDER the modal layer (z 45 < 50, so pickers open over it — the D126
  complaint closed by construction); `body.guiding` hides `.wrap` (print restores it);
  ⇇ Character view is a SWITCH (`GUIDE.away`, a header Guide tab returns; entries resume
  instead of re-asking); the chain column reuses the timeline's run/rail/divider classes
  and the row drag is ONE extracted implementation (`wireRowDrag` + `commitPlan`) that
  `renderTimeline` now also calls; phone = one-pane toggle. Stage is a minimal F2 port
  marked `// G2 rebuilds this stage`. Flags carried to G2: auto-advance still fires
  (D126(e) done-cards are G2's), `#guideNote` copy retires with G3's modals.
- [x] **G2 — decision stage + structural/choice steps** (**merged v1.2.25**, done-when
  verified: Magic Initiate's choice steps and the invocation step both open the app's REAL
  choosers and picks commit inside the walk) — auto-advance DELETED (`autonext` removed
  whole; D125 clamp, resume fallback and reverse stepNext kept); green done cards with a
  change affordance; class card = continue + last-other + menu through one `guideTakeClass`;
  `kind:"choice"` steps keyed on the stable grants path id, hosting `choiceRow` itself;
  `collectGrants` lifted out of `compute()` so choice steps derive at BUILD scope, not the
  preview slice (at preview L1/3 `R.choices` undercounted and steps vanished mid-walk);
  optfeat cards open `openGainChooser`. Flags to G3: Next wraps from the last answered step;
  pick steps still hand off to the page (`guidePageBtn`); choice labels read clunky.
- [x] **G3 — pick modals + trade cards + entries** (**merged v1.2.26**, done-when verified:
  a forward walk from empty and a reverse reconstruct both complete entirely in the modal,
  cap honesty held) — `#gpickModal` (eligible-only via the MOVED page predicate, groups
  DESCENDING, W1 folds cleared per open, filter+count; take closes, drop stays); the page
  handoff RETIRED (`#guideNote`, the renderSpells guided block, `guidePageBtn`, the jumps);
  trade cards per kind wiring through the timeline's own SWAPARM→`recordSwap` intercept
  (one writer; undo = `clearSwap`; `guideSwapMax` now shared with `renderSwapArm`); the
  empty-build "Start guided" CTA; end-of-walk Next disables with honest counts; choice
  labels composed from the filter (92/99, 7 honest fallbacks). Bug found+fixed:
  `guideSlotIllegal` read the raw array and painted a lent slot red after a legal trade —
  it un-applies later trades first, agreeing with the sweep. **The build is done; only the
  G4 gate remains.** Gate notes from G3: the reverse-placement intercept in `toggle` is
  reachable from the character view against an unnarrowed list; `guideResume` now serves
  re-entry only.
- [x] **G4 — 🔍 fresh-eyes gate** (**PASSED-WITH-FINDINGS 2026-08-31**, opus@high fresh
  agent, coordinated by a session that built nothing) — every D126(a–i) clause and every
  surviving D118 clause verified in-browser at 1280+375; D118(b,c,k) are legitimate
  supersessions (D126/D130). One structural finding with four faces, **all fixed v1.2.39
  (D133)**: `toggle`'s ambient reverse-placement intercept hijacked every surface sharing
  the one take/drop writer — worst case the prepare modal's unprepare silently REORDERED
  the wizard spellbook (`arr==="prep"` read as "spell"); also a "Drop" chip that reordered,
  a dead ✓, and a dead place-mode cpick picker. Placement is now explicit at the call site
  (`guidePlace` has one caller — the guide's own modal), and cpick sections always open
  take-mode. Both G3 probes confirmed: the intercept WAS reachable from three foreign
  surfaces; `guideResume` re-entry behaviour is correct on all four entries.


## Phase H task bodies — guided builder v2 (archived 2026-08-31) {#phase-h}

H1–H6, all done; the H5 gate passed 2026-08-31, its three questions answered by Francesco (D134). The model is D130(a–h). Open flags from this phase stayed in PLAN.

- [x] **H1 — guide navigation** (**merged v1.2.27**): the dead end-of-walk button was the
  trailing "Next level" step — always open, always last, so `nxOpen` was null there; two
  terminal states now (open steps behind → "Go to the first open step"; nothing open →
  "Exit builder"), Skip hidden in both, and the previously control-less "nothing open" card
  fixed. Entry chooser gone (reconstruct is a header command menu). Next commits option-group
  and casting-ability defaults; the growth class step was EXEMPTED at merge (D130(g) refined
  — it was levelling the character once per press). Back already reached class steps.
- [x] **H2 — subclass spell lists** (**merged v1.2.27**): the empty Arcane Trickster picker
  is a **pre-D127 stored digest** (hollow `_copy` twin → `nonCaster` → pool 0, silently) —
  fresh data gives AT/EK 61 spells. Fixed anyway: the EK/AT Wizard hardcode is replaced by a
  rule derived from the subclass's own `expanded` filters (100% coverage — `casterProgression`
  exists on exactly those two subclasses; 0 or >1 class name → `spellList=null` + a tripwire
  proved firing), 6 new cparity checks (48 total), and `listUnknown` now makes the app SAY it
  can't name the list instead of showing an empty picker. Subclasses of casting classes that
  reach another list (Lore, Divine Soul…) correctly keep their own list + expansions.
- [x] **H3 — the v2 surfaces** (**merged v1.2.28**, verified on the merged tree: 20 level rows,
  exactly one expanded, exactly ONE severity icon each; a `cast` step holds Cantrips + Spells
  sections; the modal shows both with their own counters and a "Chosen 4 of 4 · Done" footer;
  storage byte-identical after the walk): D130(a) collapsed rail rows
  with ONE highest-severity icon + aggregated counter rows; (b) chips-only answers with the
  header counter; (c) one step per feature/source with a section per logical group
  (`guideSteps` regrouping — reverses D118(c) in part; reconstruct keeps slot placement
  inside the modal); (d) the multi-pick modal with per-section counters.
- [x] **H4 — the character drawer** (**merged v1.2.31**, done-when verified in-browser at 1280
  AND 375, and again on the merged tree): D130(e) — the guide slides aside to a 14px accent
  edge and stays MOUNTED (inert, `pointer-events:none`) rather than being swapped away; a
  sticky bar names the step you left ("Back to the guide / Step 12 of 16 · Feat / ASI") and
  carries the **Exit builder** control that ends the walk from that state (D130(h) wording).
  G1's `GUIDE.away` and the vanishing `#tabGuide` are gone from app.js, index.html and CSS.
  The bar tracks the walk live (levelling while aside recounted 16 → 18 → 16), entries used
  while aside resume the same step, print is restored in both states, and exiting leaves
  storage byte-identical. **Deviation, accepted at merge:** the bar renders as TWO lines, not
  one em-dash-joined string — at 375px the one-line form ellipsised the step label; the em
  dash became the line break. Open choices it settled, for the H5 gate to confirm: the guide
  slides LEFT (its chain column's own side); the bar is pinned at the TOP (the bottom belongs
  to the phone jump bar) as a sticky flow element.
- [x] **H5 — 🔍 fresh-eyes gate** (**PASSED-WITH-FINDINGS 2026-08-31**, opus@high fresh
  agent, run as one session with I5) — D130(a–h) verified clause-by-clause in-browser on a
  Bard 6 / Wizard 2 / Warlock 3 fixture; D130(d) judged under its D131(a) supersession.
  Nothing in phase H blocked. The three carried questions were tested, recommended on,
  and **answered by Francesco 2026-08-31 → D134** (all three resolved, none open):
  - **Q1** place-mode cast cap **kept** + one minimal `gphint` when the cap hides some of
    the section's own picks (shipped v1.2.40, verified in-browser: "2 picks are above this
    slot's cap — they fit a later slot.").
  - **Q2** `PREVIEW.level` surviving `closeGuide` is **decided behaviour, kept as is** —
    the gate's snapshot/restore and the unconditional clear are both rejected, don't
    re-propose them.
  - **Q3** the two-line pinned bar is **confirmed**; D130(e) annotated in place.
- [x] **H6 — capitalization sweep** (**merged v1.2.30**, done-when verified in-browser
  including a print lift). The audit's mechanism held: **one shared display helper + ~25
  source-string edits, no CSS work.** `cap1` is now the file's ONLY display capitaliser — the
  top-level `cap` and three inline copies are gone, and it is never applied to a stored value.
  `sp.time` capitalised at all 8 render sites (meta rows, spell modal, table restore tip,
  hover tip, custom-spell preview, PRINT card); `"casting ability"`/`"choose one"` fixed once
  in `choiceRow` (**app.js:2776, not 2444** — H3 moved it), which the Choices card and the
  guide stage both reach; grant descs route through `cap1(guidePickAsk(c) || fmtDesc(c.desc))`
  at 4 sites, which also fixed the lowercase class names and "a Artificer"; 13 label-initial
  strings follow. The do-not-touch list was verified by round-trip, not assumed: option
  labels, `— none —`, `sp.tcat`/filter keys, `rechargeShort()` and the CSRC/SAVE/CT tables all
  still persist and match. Left deliberately: the `…`-placeholder family, the ~30 CSS-uppercased
  strings, and mid-row fragments in the custom-source editor.


## Closed one-off bugs and batches, 2026-08-29 → 2026-08-31 (archived 2026-08-31) {#closed-oneoffs-0831}

Queued items that shipped: renderOptFeats staleness, #tableChip, D135 invocations (v1.3.0), D136 three wrong table reads (v1.3.1), D137 stale-parser notice (v1.3.2), D138 per-book stamps + backup export (v1.4.0), and the third-caster clock (v1.4.3).

- [x] **Third-caster max spell level is one tier low from class level 7** (**fixed v1.4.3**,
  and the audit widened it — the same one-variable bug hit 2014 half-casters and the lone
  third-caster's own slot row): `ecl()` became `eclOwn()`, rounding UP per D68's own-class
  clock (`1/3`: 2nd at 7, 3rd at 13, 4th at 19; `1/2`: one tier up at every odd gain level —
  PHB Paladin 5 read max 1st, the mirror says 2nd; XPHB Paladin/Ranger were already tagged
  `artificer`-progression and unaffected). `maxLvlAt` now prefers the class's REAL extracted
  slot row when present, formula fallback otherwise — no new extractor surface. Multiclass
  slot POOLING still floors and was verified byte-identical before/after (Wizard 5 / AT 7
  pooled `[4,3,3,1]` unchanged). Deliberate widening: a lone AT 7's own slot strip now
  matches the mirror's printed row (`1st×4 | 2nd×2`, was `1st×3`).
- [x] **`renderOptFeats()` goes stale after a class or level change** (**fixed v1.2.29** —
  the suspicion was right and understated). Five handlers, not two, call
  `renderClassRows(); render();` (class swap, subclass, level stepper, remove row, and
  `#addClass`), and `render()` never called `renderOptFeats()`. Reproduced from a fresh load:
  the block did not draw at all on the first add, and once drawn it LIED — a Warlock stepped
  2 → 1 kept reading "0/3" against `optSlots()`'s 0/1. Fixed by moving the call into
  `render()` beside `renderFeatBudget()` rather than widening the handlers to `refreshAll()`:
  it holds no `<select>`, `<input>` or disclosure, which is exactly why the rest of
  `refreshAll()` is deliberately kept out of the render pass. Also closes the same hole on
  the feat-chip remove handler.
- [x] **`#tableChip` has no singular case** (**fixed v1.2.29**) — guards the way every
  sibling count in the file does; `nsp` was NOT reused (it is a `const` local to
  `renderSpells()`).
- [x] **Invocations, and everything shaped like one** (**shipped v1.3.0 → D135**, Francesco's
  report of four broken behaviours, audited whole rather than patched one by one; done-when
  verified in-browser on a Warlock 5 fixture and torn down after): ① the three DESIGNATION
  invocations get a real choice whose pool is a filter read out of their own prose, and whose
  effect lands on the designated spell as a D79 note — and designating a cantrip you have not
  got takes it on the class's own schedule; ② repeatable is read from BOTH shapes 5etools
  uses and the nth take carries a `##n` identity, so two Magic Initiates hold two independent
  sets of picks and two Agonizing Blasts two independent designations; ③ a feat / optional
  feature / species now has its OWN prose mined for casting notes (252 of them, block-scoped);
  ④ `featProgression` is read, so Lessons of the First Ones adds its Origin slot to the budget
  card and to the guided chain. Plus a verifiable filtered prerequisite and two bugs found in
  passing (`Seeking Spell`'s boolean-as-array test; `EMPTY_GRANTS`'s shared mutable lists).
- [x] **Three wrong reads of the spell table** (**shipped v1.3.1 → D136**, Francesco's
  report; done-when verified in-browser on a Great Old One Warlock 10 fixture, torn down
  after): Great Old One's Hex is a PREPARED grant, not "at will" (5etools files it under
  `innate`, its own feature says only "you always have it prepared"); Synaptic Static's Save
  column drops the Constitution it never forces (the tag came from a penalty on the target's
  own concentration saves); and everything GRANTED is one row per spell with a badge per
  giver — the always-prepared branch used to read `grants[0]` and silently drop the rest.
- [x] **An extractor fix never reached an importing user, and nothing said so**
  (**shipped v1.3.2 → D137**; done-when verified in-browser by reproducing every reported
  symptom from a v1.2.41-stamped digest and clearing them from a current one, plus the six
  `verLt` cases, the no-import case, the no-stamp case, the × and the action button): the
  boot notice compares the imported digest's parser stamp with the app version and offers
  the inline refresh. **The reproduction is the thing to keep** — it is in GOTCHAS.
- [x] **A partial refresh claimed the whole library was current** (**shipped v1.4.0 →
  D138(a,b)**; done-when verified in-browser by storing a digest whose meta stamp reads
  current while 41 of 43 sources read v1.2.41 — the notice and the Library line both name
  41, where the old code stayed silent): per-source `parser`/`parsedAt`, `staleBooks()`, and
  the stamp promoted from a hover title to a visible line above the Library's footer.
- [x] **Export/import characters between devices** (**shipped v1.4.0 → D138(c)**; done-when
  verified in-browser by a full round trip onto an emptied browser: 3 builds + 1 homebrew
  spell land, the homebrew spell resolves, and the build's pick of it survives — plus
  re-import not duplicating homebrew, and a single-build file still importing through the
  same box): `Export all…` writes one backup file carrying every build and the homebrew they
  reference; one import entry point takes either kind.


## Phase I task bodies — guided builder v3 (archived 2026-08-31) {#phase-i}

I1–I5 plus the v1.2.39 fix run, all done; the I5 gate passed 2026-08-31. The model is D131(a–h) + D132.

- [x] **I1 — the pick modal** (**merged v1.2.35**, done-when verified in-browser: a
  spellcasting step opens two scoped pickers and Magic Initiate four; the three footer states
  measured with transitions forced off; the click closes and advances to the same target Next
  computes; cap honesty and place-mode slot addressing both intact; trade still records): one picker per SECTION, not one per step
  (superseding D130(d) — D130(c)'s step grouping is unchanged); the footer button becomes the
  proceed nudge in three states ("Choose N more" quiet/disabled → accent "Done — next step"),
  and its click closes AND advances the walk. The `#gpPill` goes. Cap honesty (D125) and the
  place-mode slot addressing (D118(f,g)) must both survive. Carries the modal's share of
  D131(c) — its explanatory `#gpSub`/`#gpPill` prose.
- [x] **I2 — the guide's chrome, and both columns invert** (**merged v1.2.37**, done-when
  verified in-browser and again on the merged tree: the chain reads L6→L1 and the timeline
  L5→L1 with its add row on top; the same drag on either surface produced the identical plan
  and the D122 no-op guard refused identically on both; zero walk banners, zero ghost chips;
  the arrow toggles "from L1" ↔ "from L5"; "reconstruct" scanned to zero hits across 36 step
  visits and the timeline, in text and in every aria-label/title): the
  explanatory prose off the stage and the section blocks (live status and error/empty states
  stay; anything load-bearing moves behind D88's `?` disclosure — note `wireHelpNotes()` is
  boot-only and the guide is JS-built, so it needs a re-call); the dead "+ N more" ghost chip
  removed; the reconstruct dropdown gone with the word "reconstruct" itself. Then **D132**:
  the chain rail AND the timeline modal invert to highest-level-first, the "+ add level" row
  moves to the top, and the ↑ Up / ↓ Down control moves into the RAIL where it can show its
  travel. One agent owns both inversions because **the row drag is one shared implementation**
  and G1's acceptance test still stands — the same drag in the chain must produce the identical
  plan as the same drag in the timeline. Everything assuming ascending order gets re-read: the
  current-level pin and its zone tinting, D122's run dividers and aggregation, every first/last
  assumption. **Fallback if the inversion proves larger than it reads** (D132's rejected option,
  kept live for exactly this): leave both columns ascending and express direction as "start
  here" caps at the two ends of the rail.
- [x] **I3 — drawer edge + rail alignment** (**merged v1.2.34**, `src/styles.css` only —
  zero app.js surface; done-when verified at 1280 AND 375: the guide's right edge sits at
  exactly 0 aside, `elementFromPoint` across the first 20px never lands inside it, the grip
  delta is 0.00 on every row collapsed and open, and a real drag still reorders): the 14px accent sliver goes and the
  guide slides fully off-canvas (the `body.gaside` offsets key off `--gbh`, not the edge, so
  they stay); the chain rail's drag handle aligns to the level chip and title row on a
  collapsed card without breaking the open card that `align-items:flex-start` exists for.
- [x] **I4 — the familiar pin** (**merged v1.2.36**, done-when verified in-browser incl. print:
  the offer appears the instant the boon is taken, the two tiers differ by order, elevation,
  colour, opacity AND disclosure, marks and dismissal survive a reload, dismissal pins nothing,
  a marked form prints and the nudge goes): a DEDICATED modal for the
  familiar choice — the eight Pact of the Chain forms as the unique tier, Find Familiar's own
  ~65 offered subordinate to them — whose choice IS the pin, routed through `toggleFav` so the
  carousel star, `orderedCreatures` and `printCreatures` keep one writer. Optional and
  dismissible; nothing pinned on its own. Carries a real bug found in the survey: `activeFormGrants`
  matches the exact `name|source` key (app.js:6657) while `grantRec` resolves by NAME only
  (app.js:592), so a PHB/XPHB split between boon and spell silently drops every granted form —
  fix it with D127's successor-aware machinery, and prove the failing case.
- [x] **Next duplicates `guideAdvance()`'s expression** (**fixed v1.2.39**): the stage's
  Next now calls `guideAdvance()` — one function, two callers, verified to land exactly
  where `guideStepAfter` predicts.
- [x] **The guide's pre-filter is capped by `PREVIEW`, not only by the landing slot**
  (**fixed v1.2.39, D133**): opening a section's picker now stands the view on that
  section's LANDING level — per SECTION, not per step (two sections of one step can land
  at two levels), decided in `openGpickSec`, not `guideGo`. The fix also closed a second
  lie the gate hadn't measured: the take used to INSERT at the previewed slice point, not
  the promised slot. Pool, cap, hint and insert position now derive from one number —
  the Bard-5 "Change…" repro went from 26 offered/insert-at-4 to 76 offered/insert-at-7
  with 0 illegal flags.
- [x] **`.spmodal` is missing from the print `display:none` list** (**fixed v1.2.39**):
  one token added at styles.css:1540, verified through CSSOM.
- [x] **The Down-walk trio** (**fixed v1.2.39, D133** — the gate showed findings 3/4/5 were
  one defect seen three times): a single `guideDownPlaceable(steps)` predicate now decides
  whether the Down control is offered (`guideCanWalkDown`, OR-ed with `GUIDE.reverse` so an
  in-flight walk never hides its own way back), which step reverse re-entry opens on
  (`guideSync` — a placement step, never the growth card), and which level the rail's
  "from L{n}" names (`guideWalkStrip` — was off by one against the actual landing).
- [x] **`renderGuideChain` and `renderTimeline` duplicated four pieces of inversion logic**
  (**extracted v1.2.39**): the I5 gate first PROVED the copies in step (4 real drags
  byte-identical on both surfaces, 5 no-op drags refused identically — D122 guard held),
  then the extraction rode that proof: one `levelColumn` owner (runs keyed on `to`,
  divider, `runjoin`, prepend), card bodies stay per-surface, `wireRowDrag` untouched on
  plan indices. Rendered columns byte-identical pre/post; drag battery re-run clean.
  Gotcha entry updated.
- [x] **I5 — 🔍 fresh-eyes gate** (**PASSED-WITH-FINDINGS 2026-08-31**, opus@high fresh
  agent, one session with H5) — D131(a–h) + D132 verified clause-by-clause: prose sweep
  over 41 steps × both directions clean, "reconstruct" absent from every user-visible
  string and aria-label, drawer edge at exactly 0, grip delta 0.00, the I4 familiar
  modal's edition-split fix proven in BOTH directions at unit level, D132 inversion
  correct on pins/zones/dividers/joins. One real defect — the chain's growth ghost was a
  silent drop target (the one crack in G1's drag-equivalence) — **fixed v1.2.39**:
  `wireRowDrag`'s row branch now gates BOTH ends on `opt.enabled` (chip branch untouched;
  timeline add row stays unwired). Residual minors deliberately not taken: the place-mode
  footer opens accent (I5-8, defensible), an answered chain row names its picks (I5-11,
  comment aligned to the behaviour instead).


## The 2026-08-31 bug — task lines as closed (archived 2026-08-31) {#bug-0831}

D1–D3, closed the same day. The resolved account lives in STATE.md; the method rule is D139.

## ✅ RESOLVED — the reported bug (2026-08-31)

- [x] **D1 — get the reading**: obtained the practical way — Francesco found the cause via
  the v1.4.0 per-book stamps: his library was stale and the wrong books were ones the
  linked folder could not provide for re-parsing.
- [x] **D2 — act on what it says**: it was the "`stale` is a non-empty list" branch — no
  code change owed; he relinked the missing sources manually and the refresh healed them.
- [x] **D3 — verify on the reporter's environment**: confirmed by Francesco on his own
  browser, 2026-08-31. Also verified live the same day: the SW serves the previous page
  first by design and the v1.3.3 update notice appears and offers the reload (D137(d),
  previously unverified).


## Changelog bodies — the 1.2.x line (archived 2026-08-31) {#changelog-12x}

Full release narrative for v1.2.0 → v1.2.41 (phases E–I and the wave batch). The live
`CHANGELOG.md` keeps the tag map for these versions; this holds what each one shipped.

| Version | (was) | Commit | What shipped |
|---|---|---|---|
| **1.2.41** | — | 107b6b2 | Handoff: STATE restamped at `4558952` (all five phases DONE, every gate passed, nothing owed — next session picks from the queue, `/clean` recommended first), the push done (v1.2.39+v1.2.40 live on Pages), memory updated. No code. |
| **1.2.40** | — | 4558952 | **D134 — the three gate questions, answered.** Q1: the place-mode cast cap stays (the H5 gate's reading of D118(g) confirmed) plus one minimal `gphint` when the cap hides some of the section's own picks — "N picks are above this slot's cap — they fit a later slot." Q2: `PREVIEW.level` surviving `closeGuide` is decided behaviour, kept as is; snapshot/restore and unconditional clear both rejected. Q3: the pinned bar's two-line form confirmed, D130(e) annotated in place. PLAN's H5 ⚑s resolved; STATE restamped. |
| **1.2.39** | — | dab9541 | **All three gates, and their fixes (G4 + H5/I5 → D133).** Three fresh opus agents ran the owed fresh-eyes gates in one coordinated session — G4 against D126+D118, H5 against D130, I5 against D131+D132 — and all three PASSED-WITH-FINDINGS, closing phases G, H and I. The findings shipped in this commit: `toggle`'s ambient reverse-placement intercept is gone (it hijacked every surface sharing the app's one take/drop writer — the prepare modal's unprepare silently reordered the wizard spellbook, the chip ✕ reordered instead of dropping, a ✓ sat dead); placement is explicit at the call site with `guidePlace`'s one caller, and cpick sections always open take-mode. The pick modal stands the view on the landing section's level — per section, not per step — so pool, cap, hint and insert position derive from one number (26 offered → 76 on the Bard-5 repro, insert at the promised slot). One `guideDownPlaceable` predicate owns whether Down is offered, where it lands (never the growth card) and what "from L{n}" names. A row that can't be dragged is no longer a drop target, closing the growth ghost's silent plan write. The duplicated column-inversion logic became one `levelColumn` owner, extracted the moment the gate proved the copies byte-identical (drag battery re-run clean). Plus: `.spmodal` joins the print hide list, cantrip-only granted groups say "cantrips", the stage's Next calls `guideAdvance()`, two stale comments corrected, the chain's top row gets its margin back. Three ⚑ calls left for Francesco: Q1 place-mode cap copy, Q2 preview restore on exit, Q3 the two-line bar. |
| **1.2.38** | — | cfd1e44 | Handoff: STATE restamped at `86a2a4d` (phases G, H and I all BUILT, three gates owed), PLAN reconciled — I1–I4 ticked with their done-when evidence, I5 added, and eight flags queued from the wave (`refreshAddFeat`'s `#epicRow`, Next duplicating `guideAdvance`, the `PREVIEW`-capped pre-filter, `.spmodal` missing from the print hide list, per-printing `favKey`, the Down walk resuming on the growth step, a loose `guideCanWalkDown`, and the duplicated inversion logic) — plus a Gotcha for D132: the columns display descending but nothing computes descending, and `wireRowDrag` takes plan indices. Memory updated. |
| **1.2.37** | — | 86a2a4d | **I2 — the guide loses its prose, and both level columns invert (D131(c,d,e) + D132).** The chain rail and the timeline now read highest-level-first, so "walk L1 upward" travels upward on screen too: the add-level row heads the column, run headers key on a run's highest level, the join reaches upward. The display inverted, the computation did not — `wireRowDrag` still takes plan indices, which is why the one shared drag needed no change and the same drag on either surface still yields the identical plan. The direction control is a ghost arrow button beside a new "from L5" note at the head of the rail, with a one-line hover tip, drawn from `ICONS` rather than a typed glyph, its onclick set before `attachTip` so the tip cannot swallow it; the strip hides entirely where a down walk means nothing. The reconstruct select is gone and the word appears nowhere — 36 step visits plus the timeline, scanned in text and in every aria-label and title, zero hits. Prose: the walk banner, both picker notes, the ASI note, the wayfinding line and the swap paragraph are out, the ones naming an invisible consequence moved behind a `?` disclosure; counters, empty states, the illegal-slot error and the three end-of-walk states stayed. The "+ N more" ghost chip is gone with its CSS. |
| **1.2.36** | — | fcb55b2 | **I4 — the familiar chooser, and the edition mismatch under it (D131(g)).** Pact of the Chain's D109 forms get a modal of their own, opened from a "Summon forms" field under the optional-features block: an offer while nothing is marked, an ordinary field once something is, and an × that silences the offer but never a value. Granted forms lead in an elevated box at full opacity; Find Familiar's own 65 sit below with no box, a muted header, dimmed rows and a fold that opens itself when one of its forms is already marked. Every row writes through `toggleFav`, so field, carousel and print cannot disagree. The bug underneath: `activeFormGrants` compared the exact `name\|source` key while `grantRec` resolves by name and returns the first visible printing — `Find Familiar\|PHB` carries `supersededBy`, so a 2014 boon resolved the XPHB spell and all eight granted forms vanished into the generic 65 with nothing saying why. Both directions now match through the reprint chain, measured 0 → 1 on both failing cases with a negative control. |
| **1.2.35** | — | 730e030 | **I1 — one picker per section, and a footer button that advances (D131(a,b)).** A section owns its picker: a spellcasting step opens Cantrips and Spells separately, Magic Initiate opens four, and the modal resolves its section by stable id so a re-render cannot slide it onto a neighbour. D130(c)'s step grouping is untouched — only the picker narrowed. The footer button is the nudge: quiet and disabled at "Choose N more", accent at the count, and the click closes AND advances through the same primitives Next presses — or reads "Done — next section" and lands back on the card where the step still has another section open, because the walk must not step over a question the card is still asking. `#gpPill` is gone. Cap honesty (D125) and place-mode slot addressing verified intact. |
| **1.2.34** | — | 68cfd97 | **I3 — the drawer slides fully off-canvas, and the rail's grip lines up (D131(f,h)).** The 14px accent edge read as a stray highlight, so the guide now slides fully off; the border and shadow go with it, since at -100% the border is off-canvas and the shadow would still bleed a dark band. Measured aside at 1280 and 375: right edge at exactly 0, and `elementFromPoint` across the first 20px never lands inside it. The chain's drag handle is a child of the card, so `.gclv`'s `flex-start` started its icon box 2.75px above the centre the level chip and title share — it now takes the header row's own line box as its height instead of a magic-number margin. Delta 0.00 on every row, collapsed and open; the timeline never had the offset. |
| **1.2.33** | — | 1d8ce7f | **D131 and D132 decided.** D131(a–h), from Francesco's notes on the shipped phase H: one picker per section; a proceed button that advances; no explanatory prose in the guided builder; the dead "+ N more" chip out; the reconstruct dropdown replaced; the drawer's accent edge out; an optional familiar pin for Pact of the Chain; the rail's grip aligned. D132 followed mid-build — told that the rail lists L1 at the top, so "walk L1 upward" travels visually downward and a bare up/down pair would contradict the screen, Francesco chose to fix it at the root: both columns invert, and the direction control moves into the rail as a ghost arrow. PLAN gains phase I. |
| **1.2.32** | — | 438e6d2 | Handoff: STATE restamped at `c72dd4f` (phase H BUILT, H5 the only open task in it), PLAN reconciled — H4/H6 ticked, H5 carrying three gate questions, three new flags queued (`refreshAddFeat`'s `#epicRow`, the `…`-placeholder family, the CSS `· optional` twin) — D130(e) annotated with its merge refinement, two agent-verification gotchas added (a hidden browser pane freezes CSS transitions and reports a 0×0 viewport; `pkill -f serve.py` kills every parallel agent's server and `pkill -f "PORT=…"` kills none), memory updated. |
| **1.2.31** | — | c72dd4f | **H4 — the character view is a drawer (D130(e)).** "Character view" no longer swaps the guide away: the guide slides aside to a 14-pixel accent edge and stays mounted (inert, click-through), the character view becomes fully usable, and a sticky bar names the step you left — "Back to the guide / Step 12 of 16 · Feat / ASI" — with an **Exit builder** control that ends the walk from that state. G1's `GUIDE.away` flag and the vanishing Guide tab are gone from the tree with their CSS. The bar tracks the walk live (levelling from the drawer recounts the steps), entries used while aside resume the same step, print is restored in both states, and ending the walk leaves storage byte-identical. Deviation: the bar renders as two lines rather than one em-dash-joined string — at 375px the one-line form ellipsised the step label. |
| **1.2.30** | — | 2f3e1ac | **H6 — one display capitaliser, and the strings that read lowercase beside capitalised siblings.** The top-level `cap` and three inline copies collapse into `cap1`, which is now the file's only display capitaliser and is never applied to a stored value. `sp.time` reads "Action" at all eight render sites, including the spell modal and the print card, where it used to sit lowercase beside a capitalised range and duration; "casting ability"/"choose one" is fixed once in `choiceRow`, which both the Choices card and the guide stage reach; grant descriptions route through `cap1(guidePickAsk(c) ?? fmtDesc(c.desc))`, which also fixes 5etools' lowercase class names and "a Artificer". Thirteen label-initial strings follow. The do-not-touch list (option labels, `— none —`, filter keys, `rechargeShort()`, the CSRC/SAVE/CT tables) was verified by round-trip, not assumed. |
| **1.2.29** | — | 87e32ca | **Two queued bugs.** `renderOptFeats()` ran only inside `refreshAll()`, while five handlers (class swap, subclass, level stepper, remove row, add class) call `renderClassRows(); render();` — so the optional-features block did not draw at all on the first add and, once drawn, actively lied: a Warlock stepped 2 → 1 kept reading "0/3" against `optSlots()`'s 0/1. Moved into `render()` beside `renderFeatBudget()` rather than widening the five handlers to `refreshAll()`: it is a pure derived view holding no `<select>`, `<input>` or disclosure, which is exactly why the rest of `refreshAll()` is kept out of the render pass. Also closes the same hole on the feat-chip remove handler. And `#tableChip` no longer reads "1 spells". |
| **1.2.28** | — | a617b12 | **H3 — the guided builder's v2 surfaces (D130(a–d)).** The chain rail collapses to one line per level carrying a single icon for the worst thing in it (red for an illegal pick or a health finding, gold for open or skipped, green for settled); only the current level is expanded, and an expanded level shows aggregated rows with counters instead of one row per slot. A step is now one FEATURE with a section per logical group — a level's spellcasting is one step holding Cantrips and Spells; Magic Initiate is one step holding its list, ability, cantrips and 1st-level spell separately — and its modal takes every pick in one visit, each section counting its own. Answers show once, as chips with their own ✕. Fixed en route: the subclass and "another class…" menus built their prompt without a value, so the control went blank after a pick and re-selecting the prompt could write "choose a subclass…" into the build. |
| **1.2.27** | — | e542e35 | **H1 + H2 — guide navigation, and subclass spell lists.** The end-of-walk button was dead because the last step of a forward walk is always the "Next level" growth step: there are two terminal states now ("Go to the first open step" when decisions remain behind, "Exit builder" when none do), Skip is hidden in both, and the walk-chooser screen is gone — entering goes straight into the walk, with reconstruct as a header menu. Next commits a shown-but-unstored default (option groups, casting ability) while Skip leaves the step open; the growth step is exempt, so Next can no longer level your character once per press. **Arcane Trickster / Eldritch Knight**: the empty picker turns out to be a pre-D127 stored digest — on fresh data both get 61 spells. The hardcoded "EK/AT use the Wizard list" is replaced by a rule derived from each subclass's own spell-list filters, with a tripwire when the data names none (and 6 new parity checks); a caster whose list can't be named now says so instead of showing an empty picker. |
| **1.2.26** | — | 25c9b1a | **G3 — phase G's build completes.** Spell/cantrip steps answer in a dedicated modal: eligible-only (the page pre-filter's predicate moved, not rewritten), grouped by level highest-first with collapsible headers, name filter, cap-honest header; a take closes it, a drop doesn't. The page handoff is retired (guided pre-filter, #guideNote, the jump-to-list buttons). Swap steps become direct trade cards per kind — tap the loss, pick the replacement in the modal, see "− X + Y" with undo — recording through the timeline's own arm-then-take intercept, so there is exactly one swap writer. An empty build leads with a "Start guided" card that vanishes at the first answer. End-of-walk disables Next with honest open/skipped counts; 92 of 99 choice labels compose cleanly from their filters. Fixed en route: a legal trade painted the slot that lent its position red (the chain flag now un-applies later trades, agreeing with the sweep). |
| **1.2.25** | — | fe93cf4 | **G2 — the decision stage.** Answering a step no longer auto-jumps: it renders a green done card naming the answer (change affordance included) and the walk moves only on Next/Skip/chain click. The class step is the decided card — Continue {class} → {n}, the other most-recent class, a compact menu for the rest. Species/feat/subclass/optfeat steps are uniform stage cards; optional features open the real picker from the card. NEW `choice` steps: every pending grant choice (Magic Initiate's picks, casting-ability choices…) is a step in the chain hosting the Choices card's own control — closing "Magic Initiate doesn't let me choose its spells" and "invocations don't open their modal". Choice derivation runs at build scope, not the preview slice, so steps can't vanish mid-walk. |
| **1.2.24** | — | b49cb40 | **G1 — the guided builder becomes a full-size page (D126 shell).** Its own fixed surface under the modal layer — pickers, timeline and spell modal open over it with their own backdrop, closing the contrast/covers-its-own-modals complaint by construction. Header: build + level + progress + ⇇ Character view (a switch, not an exit — a Guide tab brings you back mid-walk, entries resume instead of re-asking) + ×. The chain column is the timeline's language lean — class rails, run dividers, level cards, step statuses (✓/open/skipped/red) — with drag-to-reorder sharing ONE extracted implementation with the timeline modal. Phone: one-pane toggle between stage and chain (the bottom sheet and whole-chain toggle are gone). The stage is a minimal port; G2 rebuilds it, G3 adds pick modals + trade cards. Also: a new Gotcha — the browser pane can collapse different localhost ports onto one shared origin; agent verification must snapshot/restore browser storage, never trust port isolation. |
| **1.2.23** | — | f3fe566 | **W5/D129 — Refresh with feedback.** The ⋯ menu's Refresh runs inline: busy buttons, staged progress ("Reading the folder… Reading N books… Storing…" with live counters), a green "Re-imported N books with parser vX." that fades, red failures that don't. The Library modal opens only for the four cases a human must fix (nothing imported / no folder / permission refused / folder lacks the books) and says why; its own Refresh button gets the same states. Two false-success holes closed: a refresh whose folder read failed used to re-store the unchanged digest under a new parser stamp and claim success — it now says "Your imported data is unchanged", and stored books missing from the folder are named instead of counted. |
| **1.2.22** | — | f96cc3a | **W4 — the timeline batch, 11 items.** Ghost slots read "+ spell"/"+ cantrip" again (D124(b) reversed); a traded chip wears a retrain icon + "L{n}", and clicking the level moves the trade to another eligible level-up (one shared predicate gates arm, move and chain ceiling); the incoming pick is its own violet chip and the count tile counts it in violet, with crimson over/under tints (over-schedule is now actually countable); undecided gains (subclass, feat slot, metamagic) are quietly clickable and open the app's real choosers; every user-facing D-code and verbose phrase scrubbed ("1 issue", trade wording); a "+ add level" row closes the timeline; footer buttons get icons (the typed ⇄ glyph is now a drawn icon, closing a D57 violation); the chip row's last entry scrolls clear of the gradient mask; all tiles share one muted base color (D123(a) hue mix superseded); the pact tile fits its square. |
| **1.2.21** | — | c543b8e | **D127 built — edition identity.** Both extractors resolve same-file `_copy` twins (shallow merge honouring `_preserve`; a `_copy` with `_mod` trips a visible error — zero today, asserted) and emit `supersededBy` on all six record types (both `reprintedAs` shapes). The 73 hollow zero-grant subclasses heal (Aberrant Mind: 11 grants + pointer), 67 missing classics return to 2024 pickers, zero duplicate pairs remain; races' reprint stamp now reaches split species and subraces (Gith, Half-Elf +23 flags). App-side: subclass identity/resolution is class-scoped (stored `subKey` untouched), `reprintOk` hides a superseded record only when its successor is actually present and enabled (D31). cparity keys subclasses with `classSource` — 322/322 records diffed (124 were invisible to it), 42 checks. **Stored digests need one re-import.** Also: the 🎲 random build respects the 20-level budget. |
| **1.2.20** | — | 45074f2 | **W1 — general UI batch.** The same class can no longer be multiclassed twice (identity = class name, so editions are one class; the add select disables when exhausted, and `refreshAddClass` now rides `renderClassRows`, closing a stale-options hole). Entity-picker popover: ⋯ icon optically centered (a hidden badge's margin), stays open across filter clicks (closer reads `composedPath()` — the Gotcha now prescribes it), the button toggles closed, the filter count badge is gone. Level groups fold in the Eligible spells list and the spell-pick modal — which also GAINED level grouping (it was flat). Checklist scroll survives a book tick. |
| **1.2.19** | — | 9f0e350 | **W2/D128 — swaps are per kind.** `SWAP_RULES` verified from XPHB prose (level-up spell swap: Bard/Sorcerer/Warlock/EK/AT; level-up cantrip swap: those + Cleric/Druid; Wizard: cantrip 1/LR only — now offered in the prepare modal; Paladin/Ranger n/a). `state.swaps[lv]` holds `{spell?, cantrip?}` — a level can carry both trades; old blobs heal at every stored-state boundary. Timeline arming, tips, guide steps, export/fork/sweep all per-kind. The user-facing "D115:" code left the pill tip. |
| **1.2.18** | — | de91ea4 | **Design batch from Francesco's notes.** **D126 — phase G**: the guided builder becomes a full-size page (Ledger layout: chain column as a lean timeline variant with drag-to-reorder + decision stage; phone one-tap toggle; spells picked in a modal grouped highest-level-first; direct trade cards; done-states highlight instead of auto-jumping; empty-character CTA) — settled via mockups (`scratchpad/gb-mockups.html`) + interview, build queued as G1–G4. **D127 decided**: edition identity — resolve 5etools `_copy` twins in both extractors + carry `supersededBy`; the investigation found 73 subclasses resolving to hollow zero-grant records (every 2014 subclass granted nothing) and 67 missing from 2024 pickers. Wave batch W1–W4 planned; agents in flight. |
| **1.2.17** | — | 027ec78 | **F4 — the phase F fresh-eyes gate: PASSED; phase F is DONE.** Every D118(a–k) clause verified in-browser on a fresh fixture (all three entries, the walk chooser, both directions, inline structural answers, the phone sheet + whole-chain toggle, stateless close/resume, skip/frontier semantics, 73 steps at Bard 20, reverse re-entry at the first illegal slot, own-picks narrowing, flag-don't-prune). One real finding, fixed in-gate → **D125**: with an earlier pick slot skipped, the page pre-filtered by a later slot's cap while the take landed in the first open slot — a legal-looking pick could arrive illegal (instantly red-flagged, nothing lost, but the D118(b) promise broke). `guideSync` now clamps a forward pick step to the row's first open slot, so the note and cap always name where the pick really lands. |
| **1.2.16** | — | 27ba3e4 | Handoff: STATE stamped at `dd31abb` (phase E done, phase F built, F4 the only open task), phase E task bodies archived to `ARCHIVE.md#phase-e`, PLAN/CLAUDE headers reconciled to D124, D115(j) annotated with the D122 modal reshape, memory updated. |
| **1.2.15** | — | dd31abb | **D124(c,d) closed.** The spell details gain a **"Metamagic" row** (Access anatomy, one-word label): dashed neutral chips for each selected option whose condition the spell meets, reasons in the tips, shown only when a Metamagic-owning class can take the spell. And the **P3 Ember palette** ships across all five theme blocks: accent slides to terracotta (#8f4b2b light / #d9915f dark), alerts to crimson (#c1273b / #f0616e, #9c1f30 on paper) — the accent-vs-alert confusion measured at 3–6° of hue is now ~30° plus a lightness gap, with the warm identity kept (chosen over Verdigris after an initial pick, and over Lapis). The app icon keeps its rust — artwork, not a functional colour. |
| **1.2.14** | — | 0066ff9 | **D124(a,b) — timeline separation + pick counts**: class blocks open with a labelled run divider ("Bard · L4–L7" + colour dot) and the class rail now survives the here/pin highlight (re-asserted after the zone tints); open schedule slots render as bare "+" ghost chips that jump the view to their level; a neutral "2/6 picks" tile states wants/has wherever a level opens slots; and pick-chip rows are one line that bleeds under a right-edge mask and scrolls instead of wrapping. **D124(c)**: the D123 metamagic tags left the Spell table — their new home in the spell details is mocked in `scratchpad/mm-palette-mockups.html` together with **D124(d)**, three fully-analysed palette proposals (ΔH/WCAG numbers) for the accent-vs-alert legibility problem; both open on Francesco. |
| **1.2.13** | — | b50d44c | **F3 — guided entry points + reverse reconstruct** (D118(f,g,i)): "Create & start guided" beside start-empty, "Guide me from here" in the timeline footer, a ⋯ "Guided builder…" alias; a ready build gets the walk chooser (continue forward · reconstruct L1-up · reconstruct top-down). Reconstruct narrows the page to the build's OWN picks and a take PLACES the pick at the current slot's position — stateless, never deletes; re-entry lands on the first slot whose spell is illegal where it sits, and illegal slots carry a red ⚠ in the rail. Verified: a Bard 12 with three spell-level violations reconstructs to zero, the over-budget 17th pick settles at top, flagged. **D123**: the merged casting tile reads "spell" in neutral; Pact Magic gets its own tile measured as count × slot level ("2× 2nd pact"); and selected metamagic options tag the Spell-table rows they can touch (twin/quicken/careful/… — hand-authored predicates over digest fields, advisory, Subtle deliberately absent, Twinned on the XPHB "target one additional" shape). |
| **1.2.12** | — | 606e7e2 | **F2 — the coach rail** (D118(k)): the guided builder's surface over F1's chain — a side rail (bottom sheet at phone widths) with the whole decision chain grouped under level headers, jump-anywhere, honest done/open/skipped rows, structural choices answered inline (class continue/add, subclass, feat handoff, swap armed from the rail), the spell list pre-filtered to what is legal at the current pick step with a note saying so, Skip/Back/Next + progress, auto-advance past answered steps, both walk directions. No entry point yet — F3 wires those. **D122 — timeline refinements v2** (direct notes): the timeline is a full MODAL now (standard chrome and ×; the D115(j) raw note anticipated it; re-anchor machinery removed), the header sub-note is gone, E7's order-matters word is a gold flag by the title with the reasons in its tip, casting tiles appear only at the level that moved a clock and read as dimmed notes rather than buttons, and multiclass runs aggregate visually (per-class rails, closed gaps) with plan-identical row drops not accepting the drop at all. |
| **1.2.11** | — | e130fe8 | **F1 — step-list derivation** (D118): `guideSteps()` derives the guided builder's chain — one step per decision, statelessly from the build alone: class-per-level (plus the next-level growth step), subclass where due, species, origin/general/epic feat slots at their D114 character levels, sticky pick slots from the E2 schedules (preparer lists yield none; a wizard's steps are the free allowance), optional-feature slots from their progressions, and a swap y/n at eligible level-ups. Steps group by character level, carry pool descriptors (castMax at the slice for "legal now"), and get done/open/skipped statuses; `guideResume()` finds the re-entry point in either walk direction. **D121**: the frontier ignores class steps; optional steps never capture re-entry. Verified on the five D114 fixtures in both directions; a filled Bard 20 derives 73 steps (D118(c)'s band). No UI yet — F2 renders it. |
| **1.2.10** | — | 339720a | **E8 — the fresh-eyes gate: PHASE E PASSED.** Full code review of the substrate plus in-browser verification of every D115 clause on fresh fixtures. **Found and fixed D120, a critical data-loss regression** (window 1.2.2 → 1.2.9): `save()`'s identical-write skip compared the live state against itself — `serializeState()` returns live sub-objects by reference and both `save()` and boot made the stored build share them — so a session that only toggled spell picks persisted nothing and lost them on reload. Fixed by detaching (JSON round-trip) at both boundaries; the D116(d) no-restamp behaviour is preserved. Three cosmetic side notes logged in D120. |
| **1.2.9** | — | b5f1fea | Handoff: STATE stamped at `d55f8cf` (phase E built, E8 the only open task), docs aligned to D118–D119, memory updated. |
| **1.2.8** | — | d55f8cf | **E3 closed, E6, E7, D119** — phase E's build work is complete; only the E8 gate remains. **The swap flow (D119(b))**: click an eligible timeline chip to arm "− this pick at L{view}" (violet chip + swapbar with *Choose replacement…* opening the class picker capped at that level), take the replacement to record — position keeps history, the event carries the trade; ⇄ marks picks later traded away; eligibility is RAW-shaped and every chip's tip says what a click will or won't do. **E6**: the fork truncates every sticky array at the slice (swap events above it rewound in first), drops late feats/options, prunes orphans, and is named "· L5 variant"; the print sheet names its level and drops "not a saved version". **E7**: a quiet gold order-matters line in the timeline header, only where the order is load-bearing (pick timing; a feat slot straddling level 19). **D119(a)**: the two casting tiles merge into one where max spell and top slot agree, splitting only where multiclassing pulls the clocks apart. |
| **1.2.7** | — | 4bd1849 | **E5 — the timeline popover** (D115(j)): the level chip reads "L7 / 20" (+ ⚠ from the E4 sweep) and opens a jumpable timeline — one row per character level with its class, named gains (D63), the two casting clocks, the sticky picks the schedule places there (E2, swap-rewound display), recorded swap pills (clearable), per-level ⚠ flags, and zone tinting around the **current-level pin**. Rows drag to reorder the level plan (the D59 Level order panel is retired); pick chips drag between rows to move acquisition — landing exactly where the schedule allows, visibly refusing where it doesn't. Footer: *fork a variant here* · *set as current level*; a build now **opens at its saved current level** (D115(e)). Fixed en route: an inner click whose handler re-renders must not reach the outside-click closer as a detached "outside" target, and scrolling re-anchors the popover instead of killing it mid-walk. |
| **1.2.6** | — | e0f56ea | **E4 — the consistency sweep + build-health badge** (D115(f)): `buildHealth()` walks the acquisition order build-wide (never the preview) and locates what doesn't add up — a spell whose level exceeds what its class could cast where it arrives (swap-aware), picks past the class schedule (wizard copies exempt, preparer lists not swept), feat slots incl. origin overspend and an epic boon with no slot at 19+, optional features past their progression, a subclass due and unset. Two surfaces: a **badge** beside the Character heading naming the offending levels (click to jump there) — which is what makes a level-5 problem visible while standing at 12 — and a **bar** naming what is wrong at the level you are standing at. Advisory throughout (D31): nothing is removed, nothing blocks. |
| **1.2.5** | — | a54a2ea | **E2 — slice derivation** (D115(b,c,h)): order + schedule = acquisition level. Sticky arrays (cantrips; known-caster spells; the wizard BOOK) slice at the previewed level through each class's cumulative schedule mapped over the full level plan; preparer lists stay daily (D18); wizard copies and over-budget picks arrive at top; prep can only draw on the book as it exists at L. Feats map origin→L1 and general/epic→slot levels in array order (`featSlotLevels(true)`); optional features ride their progression counts. Every level-view consumer reads the slice: cart, grants, choices, forms, budgets, table markers, prereq names. `toggle()` is order-aware at a previewed level (adds insert at the slice point; a later pick pulls back; swap-display entries refuse edits). 27 fixture checks over five builds, in-browser. |
| **1.2.4** | — | d9e4824 | **E1 — the order substrate** (D115): the pick arrays are declared the acquisition order (nothing may sort them in place); `state.currentLevel` (null = at top) and `state.swaps` (one −out/+in event per character level, D115(g)) with export/import + one-time migration that leaves `meta.updated` alone; fork-a-version truncates both; swap events die with their class row. **Importer boot-brick fixed**: an imported build without filters stored `FILTER_DEFAULT()`'s live Sets as `{}`, and the next boot threw at `new Set({})` — the importer now stores null and `applyState` heals any malformed filters blob instead of dying. **D118 decided** — the guided builder (coach rail, forward + reverse) is phase F, after the E8 gate. |
| **1.2.3** | — | 902e44c | Handoff: STATE stamped at 41494c0, docs aligned to D115–D117. |
| **1.2.2** | — | 41494c0 | **The audit batch**: unnamed-record guard in both extractors + boot fallback (a malformed brew can no longer brick every boot); escaping pass on imported strings (`esc()` covers quotes; six raw `innerHTML` sinks closed); **Savant double-grant fixed** (5etools grew structured picks; the hand table now retires itself per feature); `[disambiguator]` tag suffixes stripped; whole-record parity diff (35 checks); build.py marker asserts; import-file errors surfaced; storage-quota notice; "Remove imported data" danger row; UA books on the Homebrew & UA shelf; caster-kind vocabulary in the by-level picker; `meta.updated` means edited, not opened; item DC/attack in source group headers; sticky gap banner + flagged chips; **SRD subset renames the 17 product-identity spells** to their licensed names; MAJOR.MINOR.PATCH versioning (D117). |
| **1.2.1** | 1.8 | d14ac89 | Handoff: STATE stamped, docs aligned to D115. |
| **1.2.0** | 1.7 | 65aa06d | **Epic boons** (D114): a boon is a feat taken WITH a slot that arrived at character level 19+, never a bonus pick. `featSlotLevels()` walks the level plan; the old `charLevel()>=19?1:0` gave boons to builds with no slot near 19 and capped at one builds with slots on 19 **and** 20. D115 opens the multi-level-build design session. |



<a id="d81-d96-bodies"></a>
## Decision bodies — D81–D96, the importer / custom-source / feat-category era (archived 2026-08-31) {#d81-d96-bodies}

The 2026-08-27 batch that made imports additive, custom sources expressive and feat categories data-driven. Every headline, model sentence and *Rejected:* clause stays live in `DECISIONS.md`; this is the reasoning, the measurements and the worked examples.

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


<a id="print-family-bodies"></a>
## Decision bodies — D97–D109, the printed sheet and its neighbours (archived 2026-08-31) {#print-family-bodies}

The print family (D98–D108) plus the zero-cap tile (D97) and feature-granted familiar forms (D109). Headlines and *Rejected:* clauses stay live in `DECISIONS.md`; this is the reasoning and the verification evidence.

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


<a id="library-bodies"></a>
## Decision bodies — D110–D113, the Library (archived 2026-08-31) {#library-bodies}

The 2026-08-27 merge of the import and Sources modals into one Library. Headlines and *Rejected:* clauses stay live in `DECISIONS.md`; this is the reasoning and the mockup history.

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


<a id="phase-refinement-bodies"></a>
## Decision bodies — phase refinements, gate fixes and consumed dispositions (archived 2026-08-31) {#phase-refinement-bodies}

D116, D119–D125, D133 and D134: point-in-time dispositions, the timeline/tile refinement batches issued as direct instruction while phases E–I shipped, and the mechanism choices made at the E8/F4/G4/H5/I5 gates. All of it is shipped and enforced in code. Headlines, clause letters and *Rejected:* clauses stay live in `DECISIONS.md`; this is the narrative, the raw notes in full and the verification evidence.

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

- **D119 (2026-08-28) Timeline refinements, direct instruction while E6/E7 shipped.** Raw note:
  *"in the timeline which inherited the level order system, only display two tiles (highest
  spell/slots) if they diverge, otherwise only show one. Also make sure this feature supports and
  makes it easy to swap lower level spells for higher ones, marking the state clearly."*
  - **(a) The two casting tiles merge into one ("cast") when max spell level and top slot
    agree** at a row — they split back into spell + slot exactly where multiclassing (or Pact
    Magic) pulls the clocks apart. *Rejected:* always-two (repetitive at nearly every
    single-class level); always-one (hides the two-clocks distinction D68 exists to keep).
  - **(b) The swap flow is click-to-arm on a timeline chip, take-to-record.** *(Eligibility
    superseded → D128: leveled-spell and cantrip trades are separate, per the verified 2024
    class rules — "known-caster picks only, one per level" no longer describes it.)* Clicking an
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
    agree, naming the merger ("cast") answered a question nobody asked; ~~split tiles keep
    their 38% hue mix~~ **→ superseded 2026-08-29 (W4)**: Francesco, raw — *"spells, slots,
    picks, and pact tiles should have the same base colors"* — every tile shares the muted
    base now; only alert/highlight states differ.
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
    wrapping. *Rejected:* counts in the gains line; ~~labelled "+ spell" ghosts~~ **→ the
    label rejection was REVERSED 2026-08-29 (W4)**: Francesco, raw — *"add back the 'spell'
    to the + spell button … write instead + cantrip if it's a cantrip"* — ghosts read
    "+ spell" / "+ cantrip" now; the bare "+" is gone.
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

- **D133 (2026-08-31) DECIDED — GATE-FIX MECHANISMS (G4 + H5/I5, all three passed with
  findings; fixes shipped v1.2.39).** Raw: coordinated session, from the two opus gate
  reports — mechanism choices made while fixing, logged so they aren't re-litigated.
  - **(a) Placement is a property of the CALL SITE, never of the walk.** `toggle`'s ambient
    `GUIDE.reverse` intercept is deleted; `guidePlace` has exactly one caller — `gpickCommit`
    in place mode, the guide's own pick modal. The shared take/drop writer behaves the same
    inside a walk as outside it, `arr==="prep"` can never be read as a placement, `guideDrop`
    drops. *Rejected:* keeping the intercept and gating it on `!GUIDE.aside` + refusing
    `prep` (still ambient — the next surface that shares the writer inherits the bug);
    a second placement writer beside `toggle` (forks the one-writer discipline).
  - **(b) A `cpick` section always opens its picker in `take` mode** — a granted choice is
    a SET with no acquisition order to reconstruct; mode derives from section kind, not
    from the walk's direction alone.
  - **(c) The pick modal's honesty clock is the LANDING section's level, set per SECTION in
    `openGpickSec`** — pool, cap, hint and `sliceInsertAt` insert position all derive from
    that one number. *Rejected:* shifting the preview in `guideGo` (the gate's own first
    suggestion — wrong at step granularity: one step's two sections can land at two levels,
    and a step-level shift would misplace the other section's take); widening
    `guideEligible` to ignore `R.pool` (decouples the picker from the view — bigger, kept
    as fallback, not needed).
  - **(d) One `guideDownPlaceable` predicate answers all three Down-walk questions** —
    whether the control is offered, where reverse re-entry lands (never the growth card),
    what "from L{n}" names. Replaces `guideAnswered()` there, which counted things Down
    cannot place.
  - **(e) A row that cannot be dragged is not a drop target** — `wireRowDrag`'s row branch
    gates over/drop on `opt.enabled` at both ends; the chip branch stays on `opt.onChip`
    (a chip must still drop on a single-class row). *Rejected:* wiring the timeline's add
    row to match the ghost (adds a gesture nobody asked for).
  - **(f) The four duplicated inversion pieces are one owner, `levelColumn`** — extracted
    the moment the I5 gate proved the copies byte-identical; card bodies stay per-surface,
    `wireRowDrag` stays separate on plan indices. Supersedes the keep-in-step-by-hand rule
    the I2 merge left (its Gotcha entry updated).
  Affects: src/app.js (guide + timeline + `wireRowDrag`), src/styles.css (print list,
  chain top margin), GOTCHAS (D132 entry), PLAN (G4/H5/I5 closed).

- **D134 (2026-08-31) DECIDED — the three gate questions, answered by Francesco**
  (AskUserQuestion round at the gate session's close; shipped v1.2.40).
  - **(a) The place-mode cast cap STAYS, plus one minimal alert.** Raw: *"Keep + add a
    subtle alert, let's try to keep the copy and notes text to a minimum."* The H5 gate's
    reading of D118(g) is confirmed: a too-high pick is never placeable into a low slot —
    the repair is placing a legal pick and letting the offender drift later. What was
    missing was one quiet line when the cap hides some of the section's own picks, now in
    `renderGpick`: "N picks are above this slot's cap — they fit a later slot." (a
    `gphint`, spells only — cantrips have no cap). *Rejected:* allowing over-cap placement
    (manufactures the violation the walk exists to repair); keeping the list silent (the
    short list reads as the whole of it).
  - **(b) `PREVIEW.level` KEEPS surviving `closeGuide`.** Raw: *"Keep as is."* Exiting the
    walk leaves the character view at the last-visited step's level; the level chip's
    `.prevon` state makes it visible and one click clears it. *Rejected:* the gate's
    snapshot-on-open/restore-on-close (exit as the exact inverse of entry); clearing
    unconditionally. Neither may be re-proposed as a "fix" — this is decided behaviour.
  - **(c) The pinned bar's TWO-LINE form is confirmed** — D130(e) annotated in place. The
    measured case: one line needs ~430px of content in a 375px bar and would ellipsise the
    step label, the half worth returning for. *Rejected:* one line everywhere; a
    desktop-only one-line variant (two forms of one bar).
  Affects: src/app.js `renderGpick` (the (a) alert), DECISIONS D130(e) annotation,
  PLAN's H5 block (three ⚑ resolved).

## STATE's consumed sections (archived 2026-08-31) {#state-consumed-0831}

Two blocks retired from `STATE.md` by the 2026-08-31 `/clean`: the record of the
2026-08-27 doc split (its result is the doc table at the head of STATE), and the phase
roll-call (now the phase table in `PLAN.md`, whose bodies are archived per phase).

### Where things live — the 2026-08-27 split
Split out of STATE on 2026-08-27 so the resume read is short. Nothing was dropped.
- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`

### The phase roll-call, as STATE carried it
**Phases E, F, G, H and I are ALL DONE** — every gate has passed (E8, F4, and on
2026-08-31 G4, H5 and I5, all three PASSED-WITH-FINDINGS with the findings fixed in
v1.2.39 → D133; the three gate questions answered by Francesco → D134, v1.2.40 — both
pushed and live). No phase is open, no gate is owed, no ⚑ from the gates remains. On top of
that, **D135 (v1.3.0) wired invocations and everything shaped like one** — designations,
repeatable takes, a record's own casting notes, and feature-granted feat slots — and
**D136 (v1.3.1)** fixed three wrong reads of the spell table and **D137 (v1.3.2)** made the
app say when its data is older than its parser.
v7 (saved builds) is complete → `ARCHIVE.md#v7-tasks`.

---

## Phase J task bodies — the 2026-08-31 notes batch (archived 2026-09-01) {#phase-j}

Six surfaces, eighteen items, all shipped. The models are **D142** (masked chip fields, ability
tiles, the filter icon + active-filter chips, the familiar picker), **D143** (one spellcasting
step, the guide's copy), **D144** (the menu grouping, the custom builder) and **D145** (the light
theme). Cite those rather than re-deriving; the bodies below keep each original note under its
ticked line and are the natural next thing a `/clean` archives.

The four mockups that settled J1–J4 are at `scratchpad/mockups/index.html` (gitignored, built
against the real `styles.css`). **Three of the four recommendations were rejected in favour of
Francesco's own reading** — see each D142 sub-entry's *Rejected:* clause before re-proposing.

### J1–J4 · ✅ shipped (were gated on the mockup review)

- [x] **J1 · Choices — the chip field is masked behind its button** (v1.4.8, D142(a)).
  *Shipped as the masked one-line field, not the stacked row — see D142(a).* Original note: Description goes full width; chips wrap
  on a second row with the button on it. Measured in the mockup: today a four-chip run is
  **574px inside a 374px card — 228px past the edge** (`.choicerow>.picks{flex:0 0 auto}` sets
  its width to max-content, so `flex-wrap` on `.picks` can never fire). Two variants: **A1**
  button right-aligned (recommended), **A2** button leads the row. 🔶
- [x] **J2 · Casting ability — chip-only tiles** (v1.4.8, D142(b)). Original note: One tile per eligible ability, wearing
  that ability's key colour. The tokens already exist (`--ab-str`…`--ab-cha`, used by
  `.abchip`/`.savechip`), so no new palette. Variants: **B1** chip + full name (recommended),
  **B2** chip only. Six-wide worst case wraps to two rows at 396px. 🔶
- [x] **J3 · Filters became an icon; the active ones became a masked chip row** (v1.4.8,
  D142(c)). **The height cap was NOT part of what was decided** and is still open — see the
  Queue below. Original note: (i) drop the
  `activeFilterCount()` badge (app.js:7094) for a filtered/not-filtered state on the button
  plus a clear that never opens the panel — **C1** segmented ✕ beside Filters (recommended)
  or **C2** a status line saying "128 of 411". (ii) cap the list height and scroll inside it,
  level headers sticky. 🔶
- [x] **J4 · Familiar picker — search, filters, rename, and stat blocks like spells**
  (v1.4.8, D142(d)). No preview pane. Original note: Add the search + filter row
  the other pickers have; rename *"Find Familiar's own forms"* → **Other familiars**
  (app.js:7513); split into list + collapsible stat-block preview reusing `sbBodyHTML()`.
  **Investigated (asked for):** spell pickers can do the same via the existing `modalHTML(sp)`;
  creatures via `sbBodyHTML(b)`; **feats/optional features cannot yet** — there is no
  feat-detail renderer, only a one-line `.entprev`, so that one is its own task.
  One real cost: the `.sb*` rules are scoped under `.spmodal` and need the scope widened. 🔶

### J5 · ✅ shipped — a v1.4.5 regression

- [x] **The Chain/Decision toggle showed on desktop and did nothing** — fixed in v1.4.8. — **REGRESSION FROM
  v1.4.5, cause found.** `.btn:has(>.lbl-ico){display:inline-flex}` (styles.css:49, added as
  the `.lbl-ico` baseline-centering fix) has specificity 0-2-0 and beats
  `.gh-toggle{display:none}` (styles.css:1844, 0-1-0); `renderGuide()` wraps the label in a
  `.lbl-ico` span (app.js:1628), so the button matches. Verified at 1280px:
  `getComputedStyle(#ghToggle).display === "flex"`. Fix: raise both the base rule and the
  ≤820px rule to `.btn.gh-toggle`. Then re-check every other `display` rule a `.lbl-ico`
  button could be losing.

### Closed out of J3

- [x] **The eligible list is capped at ~55vh and scrolls inside itself** (v1.4.9, D142(e)) —
  two-column layout only; level headers sticky; print unaffected (`#secSpells` is hidden there).

### J6–J10 · ✅ shipped

- [x] **J6 · Guided builder — one spellcasting step** (v1.4.10, D143(a)). Original note: Fold the spell/cantrip choices and the
  swap option into a single step instead of two. Touches `guideSteps()`; D128 (swaps are per
  KIND) and D131(a) (one picker per section) both constrain it — cite, don't re-derive.
- [x] **J7 · Guided builder — copy pass** (v1.4.10, D143(b)): 14 strings de-em-dashed, 0 left
  in the guide view; the growth card's duplicated section label removed. Original note: Strip AI tells (em dashes) and drop pointless
  notes, starting with the one under the "Next level" section. Note: D131(c) already removed
  the guide's explanatory prose, so this is the remainder.
- [x] **J8 · Random build is official, guided took its place** (v1.4.9). Original note: `#testBtn` (index.html:41,
  the 🎲) currently sits in the header and is `remove()`d on the public build (app.js:8975).
  Swap it for a guided-builder button in the header, move random into `#menuPop` beside
  "Guided builder…", and stop stripping it from the public build.
- [x] **J9 · Timeline arrow + "from level" moved to the header right** (v1.4.9). It is
  parked rather than sticky now, with a `min-width` on the host so a shorter label cannot
  drag the arrow sideways: measured 0px movement on flip. Original note: `tlOrderStrip()`
  (app.js:6844) currently emits into the column head via `col.head(...)` (app.js:6826); the
  timeline header is index.html:575 (`<h2>Timeline</h2>` + `#tlOrder`). D141 owns the arrow's
  behaviour (display inverts, computation never does) — this moves where it lives, not what
  it does.
- [x] **J10 · Settings menu grouped by object** (v1.4.11, D144(a)). Original note: `#menuPop` (index.html:44-56) is ten flat
  items with two separators. Needs grouping.

### J11–J12 · ✅ shipped

- [x] **J11 · Custom spell builder fits the page, and seeds from a spell** (v1.4.11,
  D144(b,c)). Original note: Its fields and
  checkboxes don't match the rest of the app. Plus: load an existing spell from the picker as
  a template. D94/D95 own the editor's model; this is presentation + one new entry path.
- [x] **J12 · Light theme solved** (v1.4.12, D145): 0 contrast failures across 698 rendered
  text nodes in BOTH themes; the flatness was the border contrast (1.25:1 → 2.2:1, and the
  control boundary 1.79:1 → 3.0:1). Original note: Francesco: overall not
  working, and "it all feels too flat". Every token in the light block (styles.css:975 ff.)
  measured for contrast; depth restored. Biggest item in the batch and the one most likely
  to want its own decision entry.

## Closed in v1.4.7 (archived 2026-09-01) {#closed-v1-4-7}

- [x] **`refreshAddFeat()` had the identical defect for `#epicRow`** — REPRODUCED and FIXED
  in **v1.4.7**; the toggle joins the render pass beside `renderOptFeats()`. Both directions
  were wrong (18 → 19 hid a slot that existed; 19 → 18 offered one that did not), and the
  class-remove and `#addClass` paths carried it too. Original note: it toggles `#epicRow` on
  `featBudget().epic`, which per D114 is a function of `featSlotLevels()` →
  `classLevelPlan()` → class levels, yet it runs only inside `refreshAll()`. So stepping a
  class across the level where an Epic Boon slot arrives should leave the row showing the
  previous answer. Verify from a fresh load, then fix. The other three `refreshAll()`
  members are clean (`refreshSpecies`, `renderCustomSources`, `renderFeatChips` read
  `state.*`, not class levels). *(Sibling defects fixed v1.2.29 and v1.4.2.)*

## Closed in v1.4.14 (archived 2026-09-01) {#closed-v1-4-14}

- [x] **A drop re-dated every pick below it** (v1.4.14, **D146**). Reported by Francesco as
  *"removing a spell moves all other spells out of place, resulting in a broken build"* and
  reproduced exactly: one drop at L1 on a clean Sorcerer 5 moved five of eight survivors and
  created two illegal slots. A drop leaves an **empty slot** now; the model, the four pick
  arrays, the guide, the timeline, the fork and the exporter all carry it. Cite D146 and the
  GOTCHAS entry before touching a raw pick array — `.length` on one is almost always the
  wrong question now (`nFilled` counts what is answered, `firstOpen` finds what is owed).

## Closed in v1.5.3 (archived 2026-09-01) {#closed-v1-5-3}

- [x] **The class ⊕ subclass merge** — 🔶 answered: **variant A**, plus "subclass expands
  together with other features in expand all" (**D150**, v1.5.3). Three variants were mocked
  against the real stylesheet at `scratchpad/mockups/class-subclass.html` (gitignored —
  `python3 scratchpad/mkmerge.py` regenerates); B and C keep their *Rejected:* clauses in
  D150(a) so neither is re-proposed.

## Decision bodies — D115–D175, the guide, timeline, audit and filter era (archived 2026-09-05) {#d115-d175-bodies}

Verbatim bodies; the live `DECISIONS.md` keeps each headline, clause lead and *Rejected:* clause.

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

- **D137 (2026-08-31) DECIDED — the app says when its data is older than its parser** *(amended by D158(d): the first import merges onto the bundle.)*
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

- **D142 (2026-08-31) DECIDED — Francesco's calls on the 2026-08-31 notes batch** (his
  answers to the four mockup questions, verbatim in quotes; mockups at
  `scratchpad/mockups/index.html`):
  - **(a) The choices row KEEPS one line — the chip field is masked behind the button.**
    *"The block you marked as 'now' works as long as you mask the chipfield behind the button
    (which could be an icon), similarly to the access chipfield in spell modals."* So the fix
    for the 228px overflow is not a stacked layout: `.picks` becomes a horizontal scroller
    under a right-edge gradient mask, exactly the **`.tlchips` pattern already shipped for
    D124** (`overflow-x:auto`, no scrollbar, `mask-image`, and the trailing `margin-right` on
    the last child so it can reach lit space). The button stays a sibling at `flex:0 0 auto`.
    *Rejected:* **A1** (description full width, chips + CTA on a second row) and **A2** (button
    leads that row) — both were mocked; a second row buys wrapping at the cost of a taller card
    per choice, and the masked single line reads the same as the access row he already knows.
  - **(b) Ability tiles are CHIP ONLY.** B2: the three-letter chip in its ability colour, no
    name beside it. *Rejected:* **B1** (chip + full name, which I had recommended) and the
    responsive B1/B2 split — the column is narrow and the colour plus the abbreviation carry it.
  - **(c) Filters become an ICON everywhere, and the active ones become a masked chip row.**
    *"replace filter text with icon (do it everywhere we have filters); show active filters as
    chips in a chipfield row right below it with a close button at the right to remove all, the
    chips mask behind that (again, like the access row in spell modal)."* So the count badge
    goes, and so does the word "Filters"; what replaces it is not a status word but the filters
    themselves, named as chips. Same mask pattern as (a). *Rejected:* **C1** (accent dot on the
    button + a segmented ✕, which I had recommended) and **C2** (a "showing 128 of 411" status
    line) — both say THAT you are filtered without saying BY WHAT.
  - **(d) No preview pane — a creature gets the spell treatment.** *"Instead of a preview pane,
    let's have the statblocks like spells, with a dedicated modal with a preview on hover."* So
    the familiar picker's rows follow `attachSpell`'s contract: hover the name for a tip, click
    it for a dedicated modal; the rest of the row keeps toggling the mark. *Rejected:* the
    two-column split with a collapsible `sbBodyHTML()` pane (mocked and recommended) — and with
    it, for now, rolling a preview column out to the spell and feat pickers. Also noted against
    the mock: *"Make sure the top empty margin is the same between the two columns (currently
    stat block hits the row above)"* — moot for the pane, but it stands as the rule for any
    future two-column picker.
  - **(e) The eligible list is capped at ~55vh and scrolls inside itself.** Asked separately
    after the fact: (c) replaced the filter-status half of the mockup's C question and said
    nothing about the height half, so it was re-put rather than assumed. Two-column layout
    only — below 920px the columns stack and a nested scroller fights the page scroll under
    a thumb — and `#secSpells` is already hidden outright in print. Level headers go sticky
    inside the scroller. *Rejected:* a fixed ~420px cap (steadier on a big screen, tighter on
    a laptop), and leaving it uncapped.
  - **Scope:** the familiar picker only for now; the spell and feat pickers are not touched.

- **D143 (2026-08-31) DECIDED — the guided builder asks about a level-up once, in its own
  words** (J6 + J7 of the 2026-08-31 notes batch):
  - **(a) The trade is a SECTION of the level's spellcasting step, not a step of its own.**
    *"when you get to choose spells/cantrips, fold the choices and the swap option into one
    spellcasting step rather than two."* What you learn and what you give up at a level-up is
    one moment to a player, and the walk was asking about it twice. The `swap~<lv>~<kind>`
    steps are gone; their sections join `cast~<row>~<lv>`, sorted LAST (a new band in the
    section sort) so you take what the level grants before deciding what to give up. **D128
    is untouched** — trades are still per KIND, still written and read through
    `swapAt`/`clearSwap`, and a level that grants nothing new but still allows a trade gets
    the step for the trade alone. Section ids had to become `swap-<kind>`: two swaps can now
    share a step, and `guideSecKey` is `step#id`.
    - **Known consequence, deliberately not worked around: D125's clamp now covers the
      trade.** A forward take lands in the row's first open slot, so the walk clamps to the
      step owning that slot — and with the trade inside a step that also holds picks, a
      trade at L4 is clamped to L1 while the L1 picks are unfilled. It could not be before,
      when the trade was its own pick-free step. This only bites on a part-built character
      (picks filled in order never trigger it), and un-merging that half would undo what
      this decision is for. ⚑ If it turns out to matter in use, the fix is to carry the
      clicked section through `guideGo` and skip the clamp for a swap.
  - **(b) The guided builder's own copy loses its em dashes, and a label that only repeats
    its card's title is deleted.** *"clean up the text removing AI tells like em dashes.
    Remove pointless notes (ex note under next level section)."* Fourteen strings rewritten:
    where the dash joined two clauses the sentence splits, where it separated a label from a
    status it becomes a comma. `"—"` as an EMPTY-VALUE glyph stays — that is a symbol, not
    punctuation. The "pointless note" is the chain rail's section label when a single-section
    card's label equals its own head: the growth card read "next level" and then "NEXT LEVEL"
    directly under it. Suppressed for that shape only; a multi-section card keeps every label
    (verified: 13 of them on L1). Scope is the guide's own copy — the rest of the app was not
    swept. *Rejected:* an app-wide em-dash sweep in the same pass, which would have touched
    print, modal and importer copy nobody asked about.

- **D144 (2026-08-31) DECIDED — the menu is grouped by what each item acts on, and the
  custom builder joins the rest of the page** (J10 + J11):
  - **(a) The ⋯ menu groups by OBJECT: this character, then content, then the app.** Chosen
    from three mocked groupings. Only **CONTENT** gets a header — the first group needs none
    (the menu is opened from the build it acts on), and the last two are one item each.
    "Print / save as PDF…" joins the character group, where it belongs; "Custom spell…" and
    "My homebrew…" leave it, because sitting among build actions they read as things you do
    to the character rather than to your library. *Rejected:* four labelled groups (four
    headers on ten items is more chrome than the list is worth) and separators alone with no
    headers (leans entirely on ordering to carry the grouping).
  - **(b) The custom builder's fields were never styled, and the cause is one selector.**
    `el("input")` sets no `type` ATTRIBUTE, and `input[type=text]` does not match an input
    that merely behaves as text — so every text field in that builder fell through to the
    browser's own 2px inset border and square corners at 22px, beside 34px selects. Fixed by
    adding `input:not([type])` to the base rule rather than by touching each call site, so
    forgetting the attribute again cannot bring the mismatch back. Two more of the same shape
    found in passing: `.cfield.c-full` required BOTH classes, so `.cchips.c-full` (the class
    list) and the new template row stayed half-width — the rule is `.cgrid>.c-full` now; and
    a native checkbox only takes `accent-color` when CHECKED, so unchecked ones stayed the
    browser's light box. Checkboxes are rebuilt on the app's own tokens, **app-wide** (34 of
    them), because "fit the rest of the page" is not satisfied by fixing one modal.
  - **(c) A custom spell can start from an existing one.** A search row at the top of step 1,
    on a NEW spell only — on an edit it would silently overwrite what is being edited. It
    fills the form through `customFromSpell()`, the same converter the homebrew Edit path
    uses, so a template and an edit read a spell into this form identically. The name takes a
    "(copy)" suffix: a homebrew keyed `Name|HB` beside a real `Name|XPHB` reads as the same
    spell twice. Nothing is written until "Compile & add", as before.

- **D145 (2026-08-31) DECIDED — the light theme is SOLVED, not picked** (J12). Francesco:
  *"the light theme is overall not working well, fully audit the colors, especially for
  contrast and accessibility. It also all feels too flat."* Both halves turned out to be the
  same measurement.
  - **(a) Every ink colour is derived, not chosen.** Each was darkened along its own hue
    until it clears **4.7:1 against every surface it can land on** — `--bg`, `--panel`,
    `--panel-2` — *and* against its own soft wash over each of those, which is where the old
    palette failed quietly: `--gold` measured **3.37:1** on `panel-2` and 3.55:1 on its own
    wash, `--muted` **4.07:1**. The ability tokens got the same treatment at 5.3:1 (they need
    the extra headroom because D142(b) made the three-letter chip a control's only label, and
    an unselected tile veils it); `--ink` already passed at 10.8:1 and did not move; `--accent`
    moved by one step and keeps the Ember identity.
  - **(b) "Flat" was the border contrast, and it is measurable.** `--line` sat at **1.25:1**
    against the page and `--line-strong` — the visual boundary of every input, button and
    chip, which WCAG 1.4.11 wants at 3:1 — at **1.79:1**. They are 2.2:1 and 3.0:1 now, and
    the shadow went from two layers to three. **Depth comes from the borders and the shadow,
    never from darkening the paper**: a first attempt deepened `--bg` and `--panel-2` and made
    things worse, because every point of surface separation is paid for directly out of the
    text contrast on that surface. *Rejected:* that darker-paper approach, on measurement.
  - **(c) A decorative `opacity` on a text container is a contrast cut no palette can repair.**
    `.lvltools` (`opacity:.6`) put its label at **2.68:1** and `.fldnote` (`opacity:.8`) at
    4.08:1. Both dropped: they are quiet by COLOUR now (`--muted`, already solved), and
    `.lvltools` earns its emphasis on hover by taking ink rather than by losing transparency.
    The same reasoning cut the unselected ability tile's veil from 0.6 to 0.85.
  - **Result: 0 failures across 698 rendered text nodes, in BOTH themes** (WCAG AA, 4.5:1
    normal / 3:1 large), measured against each element's real composited background including
    translucent layers and inherited opacity. The dark theme's ability tokens were re-solved
    to the same standard while there. **Print is untouched by construction** — its block
    restates the whole palette rather than inheriting it.
  - **Method note for the next audit:** flipping `data-theme` and measuring in the same
    synchronous block reads STALE computed styles — it reported ~150 phantom failures at
    1.3:1 in whichever theme was measured second. Measure one theme per pass, after a real
    frame.

- **D146 (2026-08-31) DECIDED — a drop leaves an EMPTY SLOT; it does not close the gap**
  (Francesco: *"there seems to be an issue with spells and level assignment in the guided
  builder. Removing a spell moves all other spells out of place, resulting in a broken
  build."*). Reproduced exactly: on a clean Sorcerer 5, dropping the L1 pick re-dated **five
  of the eight survivors** and produced **two illegal slots** (a 2nd-level spell in an L2
  slot, a 3rd-level in an L4 slot), and the emptied slot opened at **L5** instead of L1.
  The ✕'s own tip promised *"Nothing else moves"*, which had never been true for any pick
  but the last one.
  - **(a) The cause is the model, not the guide.** A pick array's POSITION *is* the
    acquisition slot (D64 · D115(b,h)), so `toggle`'s `splice(i,1)` moved every later pick
    one slot earlier. The guided builder is only where it is VISIBLE — the character view,
    the picker's ✓ and the bulk clears all shared the same writer.
  - **(b) A hole is a real position.** `state.chosen[row].cantrips`/`.spells`,
    `state.feats` and `state.optFeats` now carry an `∅|`-prefixed sentinel at a dropped
    position. A string, so the four arrays stay homogeneous and no content key can collide
    (a key is `Name|SOURCE`, and a name is never empty). Its tag carries what a position
    cannot say for itself: a feat's slot category, an optional feature's progression — a
    spell slot needs none, the schedule owns it.
  - **(c) Containment is what makes this a ~30-site change, not a 169-site sweep.** RAW
    arrays carry holes; every VIEW strips them (`sliceChosen`, `featsAt`, `optFeatsAt`), so
    nothing downstream of `R.cart` or a sliced reader ever meets one — never known, never
    prepared, never printed, never counted as spent. The ACQUISITION WALKS consume them,
    and that consumption is the entire mechanism. A **trailing** hole is not a slot:
    dropping the LAST pick still shrinks the array, because nothing follows it to move.
  - **(d) A take answers a standing slot before it adds a position** — earliest first, the
    same best-case rule as everywhere else (D18), **but never a slot the pick could not
    legally have been learned in**. Filling an L1 hole with a 3rd-level spell would
    manufacture exactly the illegal slot the chain flags, so `holeFor` steps over those and
    the pick lands at the insert point instead, where the sweep reports it as over-budget —
    honest, and reversible by filling the slot.
  - **(e) Everywhere picks are level-mapped, not the guided builder alone** (Francesco's
    call). Spells, cantrips, feats and optional features; the guide, the character view, the
    timeline's drag-to-level, the bulk clears, the fork and the exporter. `prep` is the one
    array excluded by construction — a daily subset re-chosen every long rest has no
    acquisition order and therefore no slots (D18/D115(c)).
  - *Rejected:* **"✕ = replace this slot"** (the ✕ opens the picker addressed at that
    position and overwrites in place). Cheapest of the three, no storage change, and the
    app already has two in-place position writers — but it takes away "just remove it",
    and a slot left open while you go and think about it is a real state a builder needs.
    *Rejected:* **keeping the shift and warning about it** — "this will move 5 later picks
    up a level" is a truthful sentence about a broken outcome; the outcome was the problem.
  - **→ Gotcha.** The rule about where holes may live is enforced in code and copied to
    `GOTCHAS.md`; that is the version to trust.

- **D147 (2026-09-01) DECIDED — every buildable element carries its own text and names its
  book.** Francesco: *"I want to include in the site the source of all character building
  elements that we can choose (ex. feats). Update the parser to account for that and include
  the feat modal (and whatever other content the first audit finds), and show this modal like
  we did for spells."* The audit found the gap was **rules text, not source codes**: `source`,
  `book` and `page` were already on every array, but **nothing outside `spells` carried a
  `desc`** — a feat, an invocation, a species and a subclass were a name, a prerequisite line
  and a one-line grant preview, and PLAN's J4 had already parked this (*"there is no
  feat-detail renderer … that one is its own task"*).
  - **(a) The parser carries the prose, in both extractors.** `desc` (via the existing
    `flatten_entries` / `flattenEntries`, so `descP`'s heading and bullet handling works
    unchanged) on **feats** (276/276), **optional features** (213/213), **species** (198/215)
    and on every entry of a class's or subclass's `features` list (438/438 class features,
    2143/2283 subclass). `_feat_record` keeps the flattened entries so `feature_list` can pass
    them through; the `(level, name)` dedupe still decides which copy wins, its prose with it.
    Parity is exact — 0 whole-record diffs across all six arrays.
  - **(b) One modal for all five kinds, borrowing SPMODAL.** `entModalHTML` renders feat,
    optional feature, species, class and subclass: name + book chip, a "what kind of thing"
    subtitle, the non-prose facts as the spell modal's own `.grid`, the rules text, then a
    `.gnote` naming the spells it gives you. A class or subclass has no prose of its own, so
    its body is its FEATURES, each with its level. Reached the way a spell is — hover the NAME
    for a tip, click for the modal (D142(d)'s contract, third use). *Rejected:* a renderer per
    kind (five surfaces to keep in step, for one shared question); a preview pane beside the
    picker (mocked and rejected once already, D142(d)).
  - **(c) Entry points: the picker rows, the builder chips, and the timeline's gains line**
    (Francesco's call was rows + chips; the gains line came with the class/subclass half,
    because it is the only place a class FEATURE is named). `attachEntity` stops the click,
    so the row keeps taking the pick and the chip keeps dropping it. A `<select>` can hold
    neither a chip nor a link, so class, subclass and species state both on their **label**:
    a book chip and a small book-icon button beside it (`fldDetail`). *Rejected:* wiring every
    surface that names a feat (the guide's cards carry their own click behaviour, each needing
    the nested-interactive check); picker rows only (the chips are where you re-read a pick).
  - **(d) The book is named on every element, core included — but a closed `<select>` states
    it on its label, not in its option text.** The `source !== CORE` suppression is gone from
    all nine sites it lived at, and `CORE` itself with it. Taken literally in the class and
    subclass selects it clipped every name — a permanent `" (XPHB)"` turned "Warlock (XPHB)"
    into **"Warlock (XI"** in a ~90px control — so an option list suffixes the book only where
    two options share a name (`dupNames`), and the label's chip carries it unconditionally, in
    a place with room. A dropdown that is a MENU (the guide's class and subclass choosers)
    suffixes every option: it has the width, and nothing else there states the book.
  - **(e) A record with no text says so.** 17 setting-book species are 5etools `_copy` records
    whose `_mod` edits `resolve_copies` deliberately refuses to replay, and 75 subclass feature
    records carry no `entries` at all. Those get a plain sentence, never an empty box.
    *Rejected:* inheriting the base record's text through a `_copy` (it would print the
    lineage the setting REPLACED — wrong rules text is worse than none); porting `_mod`.
  - **A granted spell is named the way the book prints it.** `spell_ref` title-cases a
    lowercased grant reference, which writes "Tasha'S Hideous Laughter" and "Hunger Of Hadar".
    Harmless while that string was a one-line preview; wrong once a modal states it.
    `grantPreview` resolves through `grantRec` (already case-insensitive) and shows the real
    record's name — fixed at the display, not in the extractors, so no parity risk.
  - **Cost, measured:** `data.json` 2516 KB → 4051 KB, `dist/index.html` 3461 KB → 4913 KB
    (local, double-click). The public build barely moves: the SRD subset is 17 feats, 29
    optional features, 9 species and 12+12 classes/subclasses, so `docs/index.html` goes
    1529 KB → 1611 KB (**+5%**). Accepted for the local build; the public one was never in
    question.
  - **Verified:** 0 contrast failures across 42 measured nodes dark / 59 light (min 5.17:1 and
    5.57:1); `.fldinfo` centred to 0.00px on both axes at 1280 and 375, `.bchip` and
    `.entfeatlv` within 0.5px (the sub-pixel their line-height already carried elsewhere);
    the class row's three labels share an exact baseline again after the decorated ones grew
    (`align-items:end` had dropped "Lvl" 3.5px); clicking a name in the picker leaves
    `state.feats` byte-identical and the picker open; Escape closes the detail modal and not
    the picker under it; `refreshSpecies` ×3 and `renderClassRows` ×2 stack no chips; the
    whole session left `state` byte-identical.

- **D148 (2026-09-01) DECIDED — one detail layout per KIND, and the book is the tag alone.**
  Francesco's notes on D147, in his order. Four of the five are corrections to what D147
  shipped; the fifth is new.
  - **(a) The book is stated ONCE, as the tag.** Raw: *"remove the book tag in the chip or
    field label"* and *"remove the book mention in detail modals, leave only the tag"*. It
    was being said three times over — the chip beside a feat's name, the chip on a class
    row's label, and again spelled out in the modal's subtitle beside the kind. The `.bchip`
    keeps it, and its popover already names the book in full and says where the element is
    printed (D51), so nothing is lost. The label keeps only the button that opens the modal.
    Consequence, accepted: D147(d) justified dropping the select's `" (SRC)"` suffix by
    pointing at the label's chip. The suffix rule is unchanged (duplicate names only) — the
    modal's tag is now what states the book for a class or subclass.
  - **(b) Prose is STRUCTURED at the extractor, not guessed at the renderer.** `desc` was a
    flat paragraph list, so `isDescTitle` — "≤5 words, capitalised, ends in a period" — had
    to guess which paragraphs were headings, and it read *"You gain the following benefits."*
    as one, which is exactly the "sits in a weird way" Francesco named. `entry_blocks` /
    `entryBlocks` now emit `["a paragraph", {"n": "Section", "e": [...]}]`, so a heading is
    DATA. Spells are untouched — they keep the flat array and the heuristic, because a spell
    has no sections to find. A section's own body stays flat (one nesting level is all these
    records use). *Rejected:* a sentinel prefix on heading strings (a shape everything
    downstream would have to strip); widening `isDescTitle`'s regex (a better guess is still
    a guess, and the next book breaks it).
  - **(c) A layout per kind, because the five answer different questions.** A **class** is a
    contract: its Core Traits block (primary ability, hit die, saves, skills, weapons, armor,
    tools, starting equipment) and its 20-row progression table, neither of which D147 had at
    all. A **feat** is a benefit list behind a requirement, so it opens with a bullet list of
    facts — category, prerequisite, the ASI it grants, repeatable — before a word of prose. A
    **subclass** is its features. A **species** and an **optional feature** are prose. The
    shell (box, title, tag, subtitle) stays shared. *Rejected:* one body for all five (what
    D147 shipped, and what these notes are about).
  - **(d) Features group by level, and every group and section is a disclosure.** Both open
    by default with one "Collapse all" for the level groups — the modal is opened to READ,
    and a body that starts folded is a click before the first word. The level column, the
    proficiency bonus and the Features column are composed by the APP, not carried in the
    digest: level is the row index, PB is arithmetic, and features already exist. Only what
    `classTableGroups` actually holds is extracted.
  - **(e) An ability is always a coloured chip where it is a FACT** — primary ability, saving
    throws, casting ability, a feat's ASI, and the three-letter codes inside a prerequisite
    string. Reusing D142(b)'s `--ab-*` tokens, already solved to 5.3:1 in both themes.
    *Rejected:* chipping every ability mentioned in running prose (a paragraph of "Charisma
    (Deception or Performance)" becomes a chip salad, and the word there is grammar, not a
    fact).
  - **(f) "Spells it gives you" divides by the level you get them.** Every grant shape
    already carries `atLevel` — it is what the acquisition walk reads — so a subclass states
    "Level 3 · Level 5 · Level 7 · Level 9 · Level 10" instead of flattening four tiers into
    one comma run. An option group keeps its own "Choose" row: it is a choice BETWEEN blocks,
    not a level's worth of spells.
  - **(g) A condition explains itself, in place.** `conditionsdiseases.json` becomes a
    `conditions` map in the digest (18 records: the 15 XPHB conditions plus the statuses that
    read like them — Concentration, Surprised, Bloodied). `ccText` already marked conditions
    for colour, so the mark gains a `data-cond` key and `wireCondTips` hangs the book's own
    wording on it — in the spell modal, the creature modal and every detail modal. 2024 wins
    where both editions print one, matching the default reprint filter. Conditions survive a
    book filter: they are the rules vocabulary the text uses, not a book's content.
    The parity harness gained a whole-record diff and a census for the new map — a top-level
    map with no check is the shape that let the lookup clobber and the foundry stubs hide
    (D82 · D91).
  - **An older import still renders.** `desc` from a pre-D148 digest is flat, and a class
    from one has no `traits` or `table`; the modal falls back to `descP`'s heuristic and
    composes the progression table from `features` alone. D137's nag is what gets the books
    re-read. Verified against a real stale import: 5 paragraphs, 3 headings, 0 blank bodies,
    21 table rows.
  - **Verified:** 0 contrast failures across **373 nodes** (class), 47 (subclass) and 13
    (feat) in dark, and 374 / 48 / 9 in light — min 5.66:1. At 375 the page has **0**
    horizontal overflow and the progression table scrolls inside its own container. Every
    new chip and control measured symmetric to ≤0.5px at 1280 and 375. Collapse-all and each
    disclosure toggle both ways. Parity exact: 51 checks, 0 fail, 0 whole-record diffs
    including the new `traits`, `table`, `ability`, block `desc` and `conditions`.

- **D149 (2026-09-01) DECIDED — the detail modal is a stack of disclosures, and a choice is
  answered where it is read.** Francesco's notes on 1.5.1. Four decided; the fifth is mocked
  and open.
  - **(a) Every block is a disclosure, and the progression table starts SHUT.** Raw: *"the
    feature table should be collapsible and start out collapsed"* — read as the progression
    table, which is twenty rows of numbers you consult rather than read and which pushed the
    features, the thing a class modal is opened for, a screen and a half down. Core traits
    and Features stay open. The title is the fold control and sits INSIDE the header row
    rather than wrapping it, because the Features block hangs a second button off that row
    and a button may not contain a button (the `.bswrow` trap, D142(d)). ⚑ If "feature table"
    meant the Features BLOCK, the default is one word to flip.
  - **(b) "Subclass at · Level 3" is gone from Core traits.** It is the one row that describes
    a relationship rather than the class itself, and it is about to be answered by whatever
    (e) becomes.
  - **(c) The feat modal follows the canon.** Its facts list was sitting loose in the body
    while a class's facts sat in a titled block, so the two modals read as different objects.
    Every kind is now the same stack: a titled, foldable block per section — "At a glance",
    then the prose under a kind-appropriate title (Benefits · What it does · Traits), then
    the grants, then the choices. The bullet list itself stays (D148(c)); what was off-canon
    was its framing.
  - **(d) An ability chip sits on the text baseline, measured — never nudged.** Two real
    faults: `vertical-align:-1px` on the chip (a guess, and exactly 1px wrong), and
    `.abgain` as an `inline-flex` with `align-items:center`, which takes its baseline from
    its first flex item and put the chip **3.5px** low. An inline-block's baseline IS its
    last line box's baseline, so a chip aligns on its own; the wrapper is a plain `inline`
    now. Measured with a zero-size inline-block probe — whose bottom margin edge sits on the
    line's baseline — inside the chip and beside it: **0.00px** at every site, both themes.
  - **(e) A choice is answered inside the modal that explains it.** Raw: *"detail modals that
    include choice-based elements (ex. fey touched) should let you pick inside the modal"*.
    The rows are the app's **own** `choiceRow` (D30/D43) — never a copy — so a pick made here
    and a pick made on the Choices card are one control with one writer. Option and ability
    choices resolve fully inline; a spell pick opens the app's one picker, **raised above the
    detail modal** (`.modal.over`, z 75 over `.spmodal`'s 70) because a plain `.modal` is z 50
    and would otherwise open underneath and read as a dead button. Escape takes the raised
    picker first, then the modal. The block appears **only when the element is in your build**:
    before that a choice has no id, no slot and nothing to write to, and the "Spells it gives
    you" block already states what it will ask. Matched on name+source, never on the owner id,
    so a repeatable feat's `##N` copies all belong to it. `render()` refreshes **only** that
    block — rebuilding the modal would throw away every disclosure the reader had opened.
    *Rejected:* closing the detail modal to open the picker (loses your place, and the reason
    to be in the modal at all); a second inline spell list (a copy of the one picker, which
    this project has refused every time it came up).
  - **(f) DECIDED → D150 (2026-09-01), variant A — the class ⊕ subclass merge.** Three variants mocked against the real
    stylesheet with real digest content, at `scratchpad/mockups/class-subclass.html`
    (gitignored; regenerate with `python3 scratchpad/mkmerge.py`). **A · one spine, the
    subclass marked** (recommended): one Features list in level order holding both, the
    subclass told apart by an accent rule and its own tag rather than by position, and the
    progression table's Features column marking its entries the same way — so "what do I get
    at level 6" is one place, and it costs nothing at 375. **B · two bands**: the class runs
    to its end, then the subclass arrives as its own tinted band; safest to read and easiest
    for "what does the subclass add", but a per-level question means two places and the
    "Features" header repeats. **C · paired rail**: one level spine, class left and subclass
    right in its own tint; the most explicit, the only one that shows a level where the
    subclass gives nothing — which is most of them — and it collapses to one column under
    720px, exactly where the distinction it is built on disappears. Awaiting Francesco.
  - **Verified:** 0 contrast failures across **372 nodes** (class, every block forced open)
    and 21 (Fey Touched) in dark, same counts in light — min 5.66:1. Ability-chip baseline
    delta 0.00px at every site in both themes. The full choice loop: pick in the raised
    picker → `state.choices` written → the modal's own row refreshed to 1/1 with its chip →
    picker closed, `over` cleared, detail modal still open on the same scroll and the same
    folds (0,1,1,1 before and after). Escape closes the picker then the modal, and `ENTM`
    is cleared so a later `render()` cannot revive a modal that is gone.

- **D150 (2026-09-01) DECIDED — a class and its subclass are ONE modal, on one level spine.**
  Closes D149(f)'s 🔶. Francesco picked **variant A** off the mockup: *"go with A, but subclass
  expands together with other features in expand all"*.
  - **(a) One spine, the subclass MARKED — never moved.** The class modal holds both records'
    features in a single level-ordered list, so *"what do I get at level 6"* is one place. A
    subclass feature is told apart by an accent left rule and its own tag bearing the
    subclass's name; the progression table's Features column and the "Spells it gives you"
    rows carry the same mark, so the distinction reads identically in all three. The header
    shows **two book tags** — an XPHB class can carry a TCE subclass, and D148(a)'s rule is
    that the book is the tag, so two records means two tags. `subclassTableGroups` join the
    progression table where a subclass has them (Rune Knight's runes). Choices and grants
    both answer for the pair. *Rejected:* **B · two bands** (safest to read and best for
    "what does the subclass add", but a per-level question means two places and the
    "Features" header repeats); **C · paired rail** (the most explicit, and the only one that
    shows a level where the subclass gives nothing — which is most of them — and it collapses
    to one column under 720px, exactly where the distinction it is built on disappears).
  - **(b) Expand all acts on BOTH scopes.** Francesco's amendment. It folded only the level
    groups, so a feature the reader had folded by hand stayed folded through an "Expand all"
    — which made the label a lie for exactly the features they had been looking at. It now
    reaches every `.entsec.fold` inside the levels, the subclass's included, so the control
    means what it says. Verified: two features hand-folded (one of them a subclass feature),
    Collapse all → all zero, Expand all → all one.
  - **(c) Both of a class row's detail buttons open the merged modal.** The Class ⓘ and the
    Subclass ⓘ land on the same view; the subclass button keeps its own name and tip, because
    that is what the reader clicked, but a separate subclass modal would undo the merge the
    moment it opened. The standalone `kind:"sub"` modal stays intact for any caller that has
    no class context.
  - **Verified:** 0 contrast failures across **445 nodes** with every block forced open, in
    both themes (min 4.82:1 dark / 4.87:1 light). The subclass tag measured symmetric to
    0.00px on both axes. At 375 the merged modal has **0** horizontal page overflow and the
    marks stay legible. The Evoker's five choices appear in the merged modal's own choices
    block and commit through the app's one picker.

- **D151 (2026-09-01) DECIDED — the quiet floor is `--muted`; there is no legal step below it.**
  D145(c) dropped a decorative `opacity` from `.lvltools` and `.fldnote`, but its audit could
  only see what was on screen, and **`.logains.dim` ("No new features") renders only for a
  character level that gains nothing** — the audited build had no such level. Measured now, in
  the real timeline, against the real composited background:

  | | dark | light |
  |---|---|---|
  | `.logains.dim` on a lived card | 3.01:1 | 2.52:1 |
  | `.logains.dim` on the current card | 2.84:1 | 2.50:1 |
  | `.logains.dim` on a **plan** card | **2.49:1** | **2.10:1** |

  - **(a) `.logains.dim` loses its `opacity:.6`; the italic is the whole distinction.** The
    line is already `color:var(--muted)`, and D145(a) derived `--muted` to *just over* 4.5:1
    against every surface it can land on. So there is no colour quieter than `--muted` that
    still clears AA — the "second quiet step" `.dim` was reaching for **does not exist**.
    What separates this line from a list of gains is that it states an ABSENCE, and the
    italic already says that. *Rejected:* a new token one step below `--muted` (it would fail
    by construction — `--muted` is the floor); keeping the opacity and lightening `--muted`
    to compensate (pays for one line by flattening every quiet label in the app).
  - **(b) `.locard.zplan` loses its `opacity:.82` too — the dashed border already says
    "plan".** This one is *load-bearing for (a)*: a plan card multiplies its opacity into
    everything inside it, so `.dim` there was `.6 × .82 = .492`, and fixing `.dim` alone
    would have left it failing. The same `.82` was independently holding a whole family of
    `--muted` text at **4.44:1 dark / 3.92:1 light** — `.lolv`, the clock tiles' `b`/`small`,
    `.tlchip.ghost`, `.gopen`. Two signals said "not yet lived"; the border is the one that
    costs no contrast. *Rejected:* keeping `.82` and exempting text from it (there is no way
    to un-inherit group opacity); a lighter `.92` (still a cut, still unmeasurable by eye).
  - **Not touched:** `.locard.dragging{opacity:.4}` — a drag ghost is transient and is not a
    reading surface. Print is untouched by construction: `.modal` is `display:none` there, so
    neither rule reaches a page.
  - **Result: `.logains.dim` measures 5.77:1 dark / 5.66:1 light** on every card variant
    (lived, current, plan), at 1280 and 375. The light timeline is at **0 failures across 111
    rendered text nodes**; dark keeps **24**, all of them `.lt-count.tlalert` — see (c).
  - **(c) Found, measured, NOT fixed — `.lt-count.tlalert` in the dark theme.** The pick-alert
    tile's `color-mix(in srgb,var(--bad) 62%,var(--muted))` (`b`) and `40%` (`small`) sit on
    `--bad-soft` at **3.85 / 4.01 / 4.26 / 4.44:1** depending on the card underneath. This is
    a *palette* defect (D145a), not an opacity one — it fails at full opacity and it changes
    the alert's identity colour, which is Francesco's call. Light passes. Left standing and
    flagged rather than folded into an opacity fix.
  - **Numbering note:** this work was done in a parallel worktree off v1.5.0 and was first
    written up as D148 / v1.5.1. `main` had meanwhile taken D148–D150 and v1.5.1–v1.5.3, so
    it was renumbered on landing. Nothing about the finding changed.

- **D152 (2026-09-01) DECIDED — the timeline's alert tile is a PLATE, and `--muted` was never
  the lever.** D148 left the "0/2 PICKS" tile (`.lt-count.tlalert`) as the one remaining
  contrast failure in the timeline modal: **3.85:1** for the number and **4.01:1** for the
  label on a `.here` card, 4.26/4.44 on a normal one — 24 nodes failing in dark, 0 in light.
  It was deferred as a PALETTE defect (D145(a) territory) on the assumption that the fix was
  to raise the `--muted` share of the ink, which would wash out the red the tile is FOR.
  - **(a) That assumption was wrong, and measuring it is what unlocked the fix.** Sweeping the
    whole `--bad`→`--muted` mix in 10% steps, **every value fails on a `.here` card** — pure
    `--muted`, no red left at all, still reaches only **4.49:1**. The ink was never the thing
    holding the tile down. A translucent `--bad-soft` over a dark card composites to a MID
    background (**#4c3128** on `.here`, #402c25 on a normal card), and in a dark theme nothing
    of that lightness supports a mid red above it. Contrast had to come from the TILE.
  - **(b) So the tile darkens instead of the ink washing out.** The fill becomes an opaque
    plate, `color-mix(in srgb,var(--bad) 9%,var(--bg))`, and the number takes `--bad` at
    **full strength** — it was `bad 62% + muted` before, so this is *more* red than it was,
    not less. The label sits where the number used to (`bad 60% + muted`), which keeps the
    internal hierarchy the size difference alone was carrying. **Measured 5.23:1 / 5.38:1
    dark and 4.87:1 / 5.25:1 light**, on the real composited background.
  - **(c) An opaque plate also deletes the `.here` variant.** Because the fill no longer lets
    the card through, the tile composites **identically** over a current-level card and a
    normal one (both #2b1b18 dark, #e8d6cb light) — one background to reason about instead of
    two, and the worst case is no longer whichever card the alert happens to land on.
  - **Cost, named:** the two picks-tile states now differ in KIND — a trade is still a TINT
    (`.tlswapc`, `--free-soft`), an alert is a plate. The CSS comment above them said "both a
    TINT and nothing more" and has been amended to say which is which. Aligning `.tlswapc`
    is NOT done here: it passes, and changing a passing state to match a failing one's fix is
    a restyle, not an accessibility fix. ⚑ Francesco's call if the mismatch reads wrong in use.
  - *Rejected:* **1 · brighter ink** (`bad 65% + --ink`, 5.07:1 dark) — passes, and keeps the
    wash pattern shared with the trade tile, but the ink reads salmon-pink rather than red in
    dark, which is the identity loss the whole deferral was protecting against;
    **3 · both, halfway** (lighter wash at alpha `0e` + `bad 75% + --ink`, 4.99:1) — moves two
    variables for the least headroom of the three; **4 · leave it and document it** — the
    plate costs nothing the alert needed, so there was no trade to accept.
  - **Print is untouched, by construction and by check:** the print block hides `.modal,
    .spmodal` with `display:none!important`, so the timeline never reaches paper. (Worth
    knowing if that ever changes: print sets `--bad-soft:transparent` precisely so soft tints
    spend no ink, and this plate — being a `color-mix` on `--bg`, not a soft token — would
    print as a filled tint.)
  - **Verified:** 24/24 alert nodes pass in both themes; the tile's text measures symmetric to
    **0.01px** at 1280 and 375, and contrast holds at 375. Verify gate green, `cparity` 0 fail.
  - **Found while measuring, and already fixed in parallel — see D151.** The sweep also
    caught `.logains.dim` (`opacity:.6`, the italic *"No new features"* line on a level card)
    failing in **both** themes at **3.01:1** dark / **2.52:1** light — a fourth instance of
    D145(c)'s decorative-opacity class. A concurrent session had independently found and
    fixed it as **D151 (v1.5.4, branch `claude/gallant-hermann-2c8e28`)**, measuring the
    identical 3.01/2.52 on a lived card and going further than this session would have:
    `.locard.zplan`'s `opacity:.82` was load-bearing for it (a plan card multiplies `.82`
    into `.dim`'s `.6`) and was holding a whole family of `--muted` text at 4.44:1 besides.
    Nothing is owed here. Recorded because two independent measurements agreeing on the same
    numbers is the strongest evidence the method in GOTCHAS actually works.
  - **This decision was renumbered D151 → D152 and its version 1.5.4 → 1.5.5** after that
    branch was found holding both. Parallel worktrees do not reserve a `VERSION` or a D-id:
    check `git tag` and the other branches before claiming either.

- **D153 (2026-09-01) DECIDED — the app follows the 5etools repo itself: fetch online, and
  a boot check offers each new release** (v1.5.6). Francesco asked whether the app could
  link to the 5etools content repo "without importing content by hand and in a way that it
  updates when the source repo does". It can, and the two enabling facts were verified
  live before a line was written: the mirror repo (`5etools-mirror-3/5etools-src`) is
  served file-by-file by the jsDelivr CDN with `Access-Control-Allow-Origin: *`, and the
  in-browser importer already parses exactly those files — the whole feature is a third
  way INTO the existing staging, not a new pipeline.
  - **(a) The fetch is the zip drop with the zip removed.** "Fetch 5etools data online"
    (Manage pane) resolves the latest release via jsDelivr, enumerates the tag's files via
    the GitHub tree API (one call; jsDelivr's own listing refuses the repo — past its 50 MB
    listing cap — while happily serving the files), filters them through the REAL
    `zipWanted()` (the D92 rule: never a hand-rolled file list), fetches ~186 files /
    ~27 MB raw (a few MB gzipped on the wire, feature files processed first per
    `readOrder`/`slimJson`), and pushes the result into `IMPORT_STAGE`. From there
    everything is the existing D86/D112 flow: plan, tick books, Apply, per-book parser
    stamps. Nothing is stored until Apply.
  - **(b) "Updates when the repo does" is a boot check, not a push.** Nothing can push to
    an offline page and no server is coming (non-goal). On Apply the fetched release is
    recorded (`spellForge.webSync.v1`); at boot, `webUpdateNotice()` asks jsDelivr for the
    latest release and — only if it is newer, the user is online, and that version wasn't
    already dismissed — offers "Fetch it now". Offline or CDN-down it says nothing.
  - **(c) The repo address is a setting, not a constant** ("Address…", stored in
    `spellForge.webRepo.v1`), because the mirror orgs rotate every year or two after
    takedowns (mirror-1 → -2 → -3). Empty means the default.
  - **(d) A file failure is fatal and owns the report.** Seen live on the first real run:
    jsDelivr 403'd one file mid-burst, the fetch correctly refused to stage 185/186 of a
    library (a missing file is half a book — the half-import trap), but the surviving
    workers painted "Fetching 185/186" OVER the error. A first hard failure now poisons
    the fleet (`dead` flag): remaining workers stop, nothing staged, and the error keeps
    the report. Per file: three CDN tries with backoff, then once from
    `raw.githubusercontent.com`, then give up honestly.
  - *Rejected:* **a GitHub Action baking fresh data into the repo** — it would commit
    non-SRD content to the public repo, which the gitignore stance exists to prevent;
    **fetching `@latest` per file** — a release landing mid-fetch would mix versions, so
    the resolved version pins every URL; **auto-refresh without asking** — a multi-MB
    download the user didn't start, and Apply is where book choices live; **recording the
    fetched version at stage time** — the record backs the update check, so it is written
    only when the fetch is APPLIED; **a local mirror-refresh script (option B)** — not
    rejected on merit, just not built: it only freshens the Mac-side `dist` build and can
    be added any day.
  - **Verified in the pane** (storage snapshotted and restored byte-identical, per the
    shared-origin rule): full fetch → 936/27/322/276/215 — cparity's exact counts — →
    Apply merged 44 books, record written; the boot notice fires on an older recorded
    version and stays dismissed per release; alignment symmetric at 1280 and 375.

- **D154 (2026-09-01) DECIDED — the Library redesigned: one page, one list, a selection bar,
  and no refresh verbs at all.** AskUserQuestion, 5 rounds, mockups against the real
  stylesheet at `scratchpad/mockups/library{,2,3,4}.html` (gitignored; `python3
  scratchpad/mklib{,2,3,4}.py` regenerates; library4 is the approved final). Raw notes
  kept verbatim below. Francesco: the modal is "messy, the ux is unclear and there are too
  many unorganized options and features" — today it stacks four acquisition methods, six
  verbs and four status lines. Mid-session he asked to *"deploy a cheaper agent to
  investigate how the content manager works in monster-forge"*; its "Preset libraries"
  modal (one page, pending-import tray, footer split-button, selection-bar removal,
  raw-JSON stash for re-parse) shaped rounds 2–4. Aligning the two apps' managers is
  DELIBERATE (sibling D&D tooling, explicit request) — not cross-contamination.
  - **(a) Shape B: one page, no tabs.** Sources|Manage dies; there is ONE books list.
    Onboarding is the same page in its empty state. *Rejected:* **A · "Books | Add
    content" two tabs** (the session's recommendation — he took B over it); **C · tidied
    Manage** (kept the two different-meaning checklists — half the confusion).
  - **(b) The status strip is the top of the page and owns the web fetch.** One line —
    books count · 5etools version vs latest · storage — plus **Update data** (D153's
    fetch). Accent border when a release is out. The four scattered status surfaces
    (importReport, folderProgress, libParser, libStore) fold into it and into transient
    notices.
  - **(c) Rows are R3, two lines:** select-checkbox · name over kind counts ("172 spells ·
    31 subclasses") · origin chip (`web` / `file` / `built-in`) · enable switch at the
    right edge. **A disabled book DIMS — there is no OFF badge.** Raw note: *"Not sure
    what off is there for, if it only reflects the status of the visible toggle"* —
    correct; the badge existed in monster-forge because it has no row switch. *Rejected:*
    R1 (origin only), R2 (kinds only).
  - **(d) Groups stay edition-first (G1)** — 2024 core · 2014 core · Supplements ·
    Homebrew & UA; the origin chip answers *"how do we visualize and organize imports by
    type of source?"* (raw note) at row level. *Rejected:* G2 origin-shelves, G3 a
    Group ▾ axis switcher (one more control in a modal being quieted).
  - **(e) Removal is monster-forge's selection bar** — select rows → a bar rises (count ·
    Clear · enabled-switch · **Remove**, armed). **The checkbox now means SELECT, not
    enabled** — the switch carries enabled. His call over the session's 2a
    recommendation, made with the resemantization cost stated. *Rejected:* **2a storage
    mode** (his own earlier pick, reversed on seeing both mocked), row-⋯ menu, removal
    inside an add surface.
  - **(f) Acquisition is the footer: Close · ＋ Add files ▾** (popover: Upload .zip ·
    Upload .json files · Choose a folder… · Paste JSON…). The permanent drop zone dies
    with the Manage tab. *Rejected:* 1a "+ Add content" view swap; **1b + drop-anywhere**
    (offered, not taken — so drag-and-drop onto the modal is OUT, not silently kept).
  - **(g) Raw-stash + web refetch: the refresh verbs cease to exist.** Hand-added files
    stash their raw JSON in IndexedDB at import (monster-forge's `stashRawLibs` pattern);
    core content re-fetches via D153 on a parser bump; **re-parse runs automatically in
    the background after boot and announces itself once, after** ("re-read with parser
    vX", fading). "Refresh imported data", "Rescan folder", "Forget folder" and the
    linked-folder row all leave the UI — the folder picker survives only as an input
    method. D137/D138's stale-parser machinery refits to drive the auto pass instead of
    nagging. *Rejected:* stash-everything-including-zips (~25 MB duplicate storage for
    zip importers; web covers core), keep-folder-refresh (the permission dance is the
    cost being deleted), offer-don't-act re-parse (stale state lingers behind a button).
  - **(h) The staged flow is a Pending-import tray** above the status strip, existing
    only while something is staged: file chips · its books ticked to keep · **Discard /
    Add N books**. Replaces the always-visible "Your books" keep-plan (D86/D112 semantics
    unchanged underneath — merge, keyed entities, nothing stored until commit).
  - **(i) "Remove imported data" is dropped** — select all → Remove is the reset. One
    destructive path, armed, never a standing red button.
  - **Final verb set** (replaces today's six): Update data · ＋ Add files ▾ (its four) ·
    Actions (Enable all · Disable all · Select all · Select shown) · selection bar
    (Clear · enabled · Remove) · tray (Discard · Add N books) · Close.
  - **Build queued as phase K** (his call: queue, not build now) — task lines in PLAN.md.
    Ability to remove ONE book, D42's nothing-prunes rule, and D138's per-book stamps all
    survive by construction and are named in the tasks.

- **D155 (2026-09-01) DECIDED — the calls K1 had to make that D154 did not cover.** Phase
  K1 built D154's one page as specified; five things the spec left open were settled in the
  build and are recorded so they are not re-argued from the mockup.
  - **(a) "＋ Add files ▾" is ONE button, not the mockup's split.** `library4.html` drew two
    segments; a split button whose halves do the same thing is a lie about the control, and
    D154(f) itself writes the verb as one label plus a caret. The caret is DRAWN, never
    typed — a bare `.pk-caret` carries no styling of its own, so `.libfoot` draws its own
    (the same trap as `.csrowcar`). *Rejected:* a real split (nothing earns the primary
    half), the visual split with both halves opening the popover.
  - **(b) D153's editable repository address lives in Actions**, as "5etools address…".
    D154's final verb set never placed it, and the status strip is one line about your data,
    not a settings row. *Rejected:* keeping it beside Update data (it is not part of that
    verb — it is the once-every-two-years fix for when the mirror moves).
  - **(c) The keep-plan is staged-only from K1, not from K2.** `#importPlan` used to stand
    permanently at the top of the Manage tab; on one page it is 400px of the modal restating
    the list underneath it. It now renders only while something is staged or a scan is
    offering books — the tray's existence rule (D154(h)) applied to the old markup, which K2
    then restyles. Its Apply and its Discard (the old "Clear staged", armed) live in it.
  - **(d) The modal box is a flex column with a pinned footer, and the strip/search/selection
    bar are one sticky block inside the scroller.** 44 books in one column is a 3,000px page
    with "＋ Add files" at the bottom of it. The sticky lives in the element that actually
    scrolls, which is D148's rule. At ≤560px the top block un-sticks: pinned, it is ~480px of
    a 700px sheet and only two books fit under it. The footer stays pinned at every width.
  - **(e) A book's ORIGIN is stamped per book at apply time**, beside its parser stamp, and
    survives `filterDigest` the way the parser stamp does. A digest stored before the stamp
    existed is READ rather than guessed: bundle-only is built-in, and an unstamped imported
    book is `web` if a fetch was ever applied here, `file` otherwise. *Rejected:* matching
    `webSync.syncedAt` against `meta.importedAt` — tried, and WRONG: a second Apply moves
    `importedAt` past the fetch record, which made a 44-book web-fetched library read
    "file" on every row.
  - Also in K1, not a design call: `aria-expanded` is now kept honest on every
    `[aria-haspopup]` button by one sweep in `closeMenu`/`toggleMenu` — the footer caret is
    drawn from that attribute, so a stale one was wrong on screen as well as to a reader.

- **D156 (2026-09-01) DECIDED — the tray ADDS; it cannot remove.** Phase K2 built D154(h)'s
  pending-import tray, and building it forced one model call the spec implied but never
  stated. The old keep-plan carried TWO meanings in one tick: "add this book" for a staged
  book, and — for a book you already had — "keep it, or delete it". D154 moved removal to the
  list's selection bar and made it the single destructive path (D154(e), (i)), so the second
  meaning had nowhere left to live.
  - **(a) The tray's ticks govern only books you do NOT already have.** `applyImport` folds
    every stored source back into the keep-set before the write, so no path through the tray
    can drop a book. The button says what it does — **Add N books**, never "Apply (3 books
    removed)", and it never wears `.danger`. *Rejected:* keeping the old untick-to-delete
    (two destructive paths, one of them unarmed and reached by a stray click); a per-book
    "don't update this one" tick (it would mean un-merging a digest that `mergeDigests` has
    already merged — real machinery for a choice nobody has asked for).
  - **(b) A book you already have is a SENTENCE, not a row.** "N books you already have will
    be re-read with parser vX — only identical entries are replaced." A full-repository fetch
    stages 64 books of which 44 are re-reads; as rows they are 44 untickable ticks pretending
    to be decisions. *Rejected:* listing them dimmed and untickable, which is the same noise
    wearing an excuse.
  - **(c) The tray's filter and All/None appear at ≥9 new books.** A brew is one or two rows
    and does not need a search field over itself; a repository fetch does.
  - **(d) `#importReport` stays OUTSIDE the tray.** A fetch's progress, a zip's size refusal
    and a removal's receipt all have to show when there is no tray at all — putting the line
    inside a surface that only exists while staging would have hidden every one of them.
  - Also in K2, not a design call: the narrow-width **notice bar** was shrinking to its
    content and wrapping one word per line whenever it carried an action button (seen at 375
    with the stale-parser notice). It spans the width below 560px now and wraps its actions
    onto the second row, which is what the wrap is for.

- **D159 (2026-09-02) DECIDED — what K3 stashes, and what makes a book stale.** AskUserQuestion,
  one round of three, asked because D154(g) named "raw JSON" as the pattern while rejecting
  "stash-everything-including-zips" on cost — the boundary between those two was never drawn —
  and because **D158(i) later made every build commit bump VERSION**, which would have turned
  D154(g)'s automatic re-parse into a full re-read (and, for web books, a ~21 MB download) on
  every copy-only patch. Measured first, against the 2.33.3 mirror through the real `zipWanted`
  and `slimJson`: 186 wanted files = **20.8 MB raw · 12.7 MB slimmed · 4.0 MB stored digest**.
  - **(a) The stash holds RAW json, and only for brews — never for core 5etools files**, which
    D153's web fetch can re-read instead. Raw because a slimmed stash cannot replay a future
    `slimJson`/`carriedMonster` change: it would re-parse from already-thinned data and could
    not recover a record slimming had dropped. **The core/brew line is `_meta.sources`**: a
    5etools repo file declares none (the repo's sources live in `sources.json`), a brew always
    declares its own — so the test needs no hand-authored list and no second table. A core book
    added by zip and never web-fetched therefore has no stash and is NAMED by the notice, the
    same treatment a pre-K3 legacy book gets. Cost for Francesco's library (44 books, all from
    the web fetch): near zero. *Rejected:* **raw for everything hand-added** (~25 MB total,
    truest possible replay — it reverses D154(g)'s cost call); **slimmed for everything**
    (12.7 MB, but buys the saving with a quiet correctness hole).
  - **(b) Stale means the PARSER changed, not the version.** `build.py` injects
    `window.__PARSER__` — a hash of `extract.js` + `extract.py` — beside `__VERSION__`, and a
    book is stale when its stamped hash differs from the current one. A copy-only patch triggers
    nothing; an extractor fix triggers everything. VERSION stays what every surface shows
    (footer, status strip, per-book stamp); the hash is an internal field. *Rejected:* keeping
    VERSION as the test (re-reads the whole library on every release, D158(i)); a fingerprint
    that also replaces the version on screen.
  - **(c) Stashed books re-parse automatically; web books are OFFERED.** The background pass
    after boot heals everything the stash covers and reports once, after, in a fading notice —
    D154(g) as written. Web-origin books are named in that same notice with one action
    (**Update data**), because a multi-MB download that starts on its own is exactly what
    D153 refused. *Rejected:* everything automatic including the refetch; everything offered
    (that keeps the nag K3 exists to delete).
  - **(d) Stash bookkeeping:** one IndexedDB store (`raw`, `IDB_V` 1 → 2), keyed by file name,
    each record carrying the source codes it declares — so removing a book can prune its
    stashed file, and the auto pass knows exactly which books the stash can heal without
    attributing books to files after the fact.
  - **Enforced by:** K3's code; the gate unchanged. **Affects:** PLAN.md (K3/K4), `build.py`,
    `src/app.js`, `src/extract.js`, STATE.md.

- **D160 (2026-09-02) DECIDED — the first import merges at ASSEMBLY, and the bundle is never
  written to storage.** D158(d) settled the behaviour ("the baked data is the base the first
  import merges into; nothing is ever lost") and named two things to amend — D137's
  `IMPORTED||BAKED` and the staging base. Building it surfaced that those are two different
  questions, and answering them the same way breaks the app; this entry records the split so it
  is not re-litigated.
  - **(a) `assembleData` merges: `IMPORTED ? mergeDigests(BAKED, IMPORTED) : BAKED`.** The
    import wins record by record (the merge is keyed), so re-importing a book still overrides
    the baked copy of itself. *Rejected:* **writing `BAKED ⊕ incoming` into IndexedDB on the
    first Apply** — it duplicates 4 MB, and worse, it freezes a copy of the bundle that then
    WINS over the newer bundle a release later. The stored digest holds imports only.
  - **(b) The staging base stays a STORAGE question.** `planFromStage`'s `had`/`fresh` say what
    the stored digest holds, because `buildImport` uses `fresh` to tell a book you unticked
    from one that has just arrived. Widening it to include the bundle was tried and reverted
    the same hour: every bundled book then looked deliberately unticked and the next Apply
    dropped it. The reader-facing "do I already have this" lives in `trayBooks()`, which DOES
    count the bundle — so importing a book the app ships with reads "nothing new here · Re-read
    1 book", which is the truth.
  - **(c) Removing a book you also have from the bundle removes YOUR copy, and the bundle's
    stays.** Its origin chip flips back to `built-in` and the switch is how you hide it. The
    selection bar already refuses to arm Remove for a bundle-only book, so this is consistent
    rather than new. *Rejected:* a "removed" list that suppresses bundled books — a second,
    invisible piece of state to explain and to migrate.
  - **(d) Source counts are recomputed at assembly whenever an import is present.** A merged
    book's stored count is only its own half — a brew adding one XPHB spell made the Library
    row read "1 spell" beside 392 on screen. Same recount `filterDigest` already does.
  - **Verified live:** 43 books → **44** on the first import (was 43 → 1), storage holding one
    book; a bundled book re-imported reads as a re-read, applies, and its extra record shows
    beside the bundle's; removing it leaves the bundle's copy and its 392 spells. Fixtures 9d/9e.
  - **Enforced by:** `assembleData`, `planFromStage`, `trayBooks`, `engine.test.js` 9d/9e.
    **Affects:** `src/app.js`, PLAN.md (L5.3), CLAUDE.md's content line.

- **D161 (2026-09-02) DECIDED — the guide step's picker lives IN the stage above the
  breakpoint, and stays a modal below it.** AskUserQuestion, three rounds over mockups against
  the real stylesheet (`scratchpad/mkguide.py` → `scratchpad/mockups/guide{1..6}.html`), closing
  B1-05 and D158(f). **Narrows D126(f)**, which made the guide's picker a modal: at 1280 that
  meant a 760 × 645 dialog over 852px of empty stage — a full-size page hiding itself to ask
  its own question. Measured fill before: **12%** on the Species step, 11–27% across a walk.
  - **(a) Rounds 1 and 2 were REJECTED by Francesco, and the reason is the useful part.** Two
    of the three first variants filled the stage with a side panel ("this level holds", "level
    2 brings", "casting now"). His note: *"The current proposed side elements has redundant
    content and wouldn't make sense"* — correct, and precisely: the chain rail three inches to
    the left already lists every step of the level with its value. **A summary of what is
    already on screen is not content.** *Rejected with it:* the card owning the stage (a
    one-section step then leaves a large bordered empty box, which reads worse than open
    space); centring the card and adding nothing (kept as the fallback if the rework had been
    refused).
  - **(b) What is not on screen anywhere is the step's own WORK.** So the picker's box moves
    into the stage. The same node, the same render functions, the same markup — it is
    relocated, never re-created, so no second surface can drift from the first.
  - **(c) The list uses the width it gains** (his call over the same picker merely unwrapped at
    its old 760): a responsive grid, ~30 species on screen instead of 8. Groups span every
    column — `column-width` was tried first and **measured wrong**: an expanded lineage group
    is 486px against a 30px row, which pushed the flow into columns off the right edge
    (`scrollWidth` 6880 in a 964 box, most of the list unreachable).
  - **(d) A pick leaves the list OPEN with the row marked** (his call), which is what both
    pickers already did — completion is said by the chain rail and the step counter, and the
    multi-pick steps (cantrips, spellbook) need the list to stay put.
  - **(e) Below the guide's own one-pane breakpoint (820) the picker is a modal, unchanged**,
    with its dialog role, `aria-modal` and focus trap (v1.5.13) intact — inline it is not a
    dialog and takes none of them. Francesco: *"Mobile would probably keep the modal though"*,
    then asked for a mobile variant to be tried anyway; the mockup (`guide6.html`) is kept for
    the L5.6 mobile pass. **Narrowing the window mid-pick hands the picker back to its modal**
    rather than leaving it in a column it no longer fits; widening does not promote an open
    modal, because moving a surface out from under the cursor is worse than leaving it.
  - **Verified live at 1280 and 375, both themes:** stage fill **12% → 68%** (species) and
    **55.6%** (spellbook, whose step card is taller); 0 horizontal overflow after the grid fix;
    one scroller, not two (the list's own `max-height:54vh` is dropped inline); picking
    Dragonborn from the stage set `state.speciesKey`, marked the row, left the list open and
    updated card and chain; every row's text at a uniform 11px inset; at 375 the picker opens
    as a modal with `role="dialog"` and `aria-modal="true"`; narrowing to 700 mid-pick demoted
    it to its modal with the pick still open. Gate clean, engine 35 ok / 0 fail.
  - **Enforced by:** `stagePickTake`/`stagePickMount`/`stagePickDemote` in `src/app.js`, the
    `.gstage.haspick` / `.box.gpin` rules in `styles.css`. **Affects:** PLAN.md (L5.4), D126(f).

- **D162 (2026-09-02) DECIDED — the reviewed in-stage picker: the list REPLACES the button, in
  one column, and the end of a walk is one card.** Francesco's notes on v1.5.20, verbatim:
  *"the current implementation of the picker inside the guided builder doesn't make sense. The
  picker should essentially replace the choose buttons, right now the choose buttons are
  redundant"* · *"done and next session overlap"* · *"the UI of the guided builder has some
  visual bugs"* · *"never set the picker on more than one column"* · *"make a mockup with a
  reviewed version before implementing it"*. Mockups `guide7`/`guide8`, approved before a line
  was changed. Amends **D161(c)**.
  - **(a) The list is the control.** While the picker is inline, the card drops the button that
    opens it — a control that repeats what is already open. Below the breakpoint the buttons
    stay, because there the picker is a modal that needs one.
  - **(b) A multi-section step shows its sections as CHIPS** (`.gtchips`, the guide's own
    control), the open one marked, and the section HEADERS go with the buttons: a chip already
    carries the label and the count, so `guideSecWrap` drawing them again underneath was the
    same redundancy one level down. Exactly one picker stays on screen (D131(a)).
    *Rejected:* one button per section (the redundancy he named); stacking every section's list.
  - **(c) One column, always.** D161(c)'s multi-column list is reversed: *"never set the picker
    on more than one column"*. A picker is a list you read down; three columns of it is a table
    of contents. The column is capped at 720 and centred, so the space around it is composition
    rather than a missing panel — variant 1's lesson, applied to a stage that now carries the
    work. The grid rules, the group-spanning rule and the `#gpList` grid all came out.
  - **(d) The end of a walk is ONE card.** The end-of-walk sentence sat BELOW the nav while the
    card above still showed a step ("Next level"), so two surfaces claimed the same moment with
    the buttons between them — his *"done and next session overlap"*, confirmed by him against
    the alternative reading (the chain's focus ring). The sentence moved inside the card. "Next
    locks X" stays under the nav, because it describes the button it sits beneath.
  - **(e) Also fixed, found while building (b):** with every section drawing nothing, the card
    fell back to *"Nothing to answer here"* over an open picker. That hint is now suppressed
    while the list is inline.
  - **Verified live, 1280 and 375, both themes:** opening the picker leaves **zero** opener
    buttons and closing it brings them back; one column at 720 with symmetric 144px gaps and no
    horizontal overflow; a two-section step shows two chips with counts, the open one marked,
    zero section headers, one list; taking a cantrip from the inline list landed it as a chip
    and moved the chip's count to 1/3 with the list still open; the end-of-walk stage is
    `[gcard, gnav]` with the sentence inside the card; at 375 the button is there and opens the
    modal. Gate clean, engine 35 ok / 0 fail.
  - **Enforced by:** `guideSecOpen`/`stagePickIsFor` and the `inline` flag through
    `guideSecBlock`/`guideSecWrap`. **Affects:** PLAN.md (L5.4), D161(c), D126(f).

- **D164 (2026-09-02) DECIDED — the guide stage is a PICKER SURFACE, opened by default, with a
  preview pane.** Francesco on v1.5.21: *"weird background of the header, close button without
  our styling, but also shouldn't be there: there still is the double click first to open the
  picker, then to select. The picker should be the default section there, it needs a rework.
  Also you didn't go through mockups for feedback. Lastly, we could consider to dedicate the
  third empty section on the right to the preview of whatever is selected if there's enough
  space"* — plus, on the mockups: *"make sure each picker has all its filters and options. Do
  not mention redundant info in the subtitle"*. Mockups `guide9`/`guide10`, approved first.
  Supersedes the relocation half of **D161** and **D162(c)**'s centred single column.
  - **(a) Both visual bugs were ONE cause, and the fix is not a patch.** Relocating the modal's
    `.box` takes it out of `.modal`, so `.modal .box` (panel, border, radius, shadow),
    `.modal .mh` (padding, divider) and `.modal .mh .x` (the entire close button) stop matching:
    the box goes transparent, the header paints a band onto nothing, and the × falls back to a
    raw browser button — measured on the shipped page. Inline it is **not a dialog**, so it
    takes the panel look explicitly and drops what only a dialog needs: no title (the step card
    is the title), no close (Back / Skip / Next is the way out), no footer (Next did Done's job
    already).
  - **(b) The picker is the step's DEFAULT surface.** Landing on a step that asks for a pick
    shows the list — the double click is gone. The auto-open is deferred out of the render pass
    (`setTimeout(f,0)`), which is the whole lesson of (e).
  - **(c) The preview pane is the app's OWN detail surface**, `SPMODAL`, moved into the stage
    and keeping its `.spmodal` class — which is exactly what keeps every rule that styles a
    detail matching, the mistake in (a) not repeated. Clicking a row's NAME fills it (his call);
    the + still takes the pick. So a modal is removed rather than a surface added.
  - **(d) Every filter and option comes with the picker**, because the whole box moves — but its
    `.pickbar` is lifted OUT of the scrolling body: a filter popover inside an `overflow-y:auto`
    parent is a clipped menu (the trap the build switcher went `position:fixed` to escape).
    Verified live: the popover opens 518px tall, unclipped, all eight options reachable.
  - **(e) Two re-entrancy bugs, same shape, both found by walking every step:** opening a picker
    from inside `renderGuideStage` and closing a stale one from inside it each re-render — and a
    render inside a render leaves the stage half-built (**two cards** on one step, an **empty
    stage** on another). Nothing may re-render from inside a render pass: the auto-open defers,
    and `stagePickDrop()` releases quietly.
  - **(f) Leaving the guide must give the detail surface back.** `closeGpick` returns early when
    the ENTITY picker is the hosted one, so exiting stranded `SPMODAL` inside a detached pane and
    every later detail modal in the app opened into it, unstyled and never on top. Both exits and
    the no-guide render path drop it now.
  - **(g) No redundant subtitle.** The spell picker's sub repeats the step card's context line
    verbatim on an ordinary take ("L1 · Wizard") and is suppressed; the entity picker's carries a
    count ("127 species · grants spells") and stays. It COMPARES rather than assumes, and it runs
    where the sub is written — the mount happens first and would read the previous step's text.
  - **Verified live, 1280 and 375, both themes:** zero clicks to the list on every picker step;
    all ten steps render exactly one card, one nav, at most one work grid; the filter popover
    unclipped; clicking a name fills the pane and opens no dialog; taking a pick still lands and
    the list stays; at 375 nothing auto-opens, the button is there and the modal keeps its title,
    its × and `role="dialog"`; leaving the guide returns the detail surface to the body, hidden
    and fixed, and a detail modal from the main page works after. Gate clean, engine 35 ok/0 fail.
  - **Enforced by:** `stagePickMount`/`stagePrev`/`stagePickDrop`/`stagePickSubSync` in
    `src/app.js` and the `.gwork`/`.gprev`/`.box.gpin` rules. **Affects:** D161, D162(c), D126(f).

- **D165 (2026-09-02) DECIDED — eight adjustments to the guided builder, one of them a real
  bug.** Francesco's list, acted on in order. Amends D164 where noted.
  - **(a) The undroppable pick (the bug).** Taking a 4th cantrip where 3 are due is allowed —
    a build may run ahead of its schedule — but clicking it again did nothing visible: the row
    showed a ✓ and the click merely reshuffled the order. Cause: `toggle` is the CHARACTER
    view's writer and carries D115(d)'s pull-back — a pick the build acquires LATER is moved
    to the level you are standing on rather than deleted. Right for a table you browse at a
    level, wrong for a picker whose row says "picked". **In the guide a held pick drops**
    (`guidePickDrop`), wherever it sits, still leaving its slot (D146) and still clearing a
    stale prepared entry. D115(d) is untouched everywhere else.
  - **(b) And it says so:** a take that lands beyond the section's window reports the level it
    filled ("Chill Touch fills a slot you get at level 3. This level's 3 are already chosen."),
    fading. His note: *"it should signal the choices are over the number"*.
  - **(c) The detail pane earns its width or it does not open.** Its own breakpoint is **1100**,
    not the picker's 821 — at 360px against a 1008px stage a detail reads, at 340 against 860 it
    does not, and below the breakpoint the detail is a modal again. With nothing selected there
    is **no pane at all**: the picker takes the whole stage, and opening one animates the
    columns (`transition:grid-template-columns`, honoured `prefers-reduced-motion`). The pane is
    **collapsible** by hand, from a control on the seam between the columns.
  - **(d) The filter popover is no longer masked.** `overflow:hidden` on the inline box clipped
    it; the box does not clip at all now and its BODY is the scroller.
  - **(e) The grouping header inside a picker was 13.5px semibold in the display face — the same
    weight as the spell names under it — with no air above.** It is a label now (10.5px,
    uppercase, muted, `margin-top:18px`), which is the app's own idiom for one.
  - **(f) The walk's buttons grew** (14px, and Next at 15px semibold with more padding).
  - **(g) The level chip leaves the guide's top bar.** The chain names every level down its
    length and the step card names the one you are standing on; a third reading was the same
    fact a third time. *(The progress counter keeps its meaning — decisions you must make. If
    "make all choices" meant counting optional steps too, that is a one-line change.)*
  - **(h) A finished section hands the picker over.** *"Sometimes it is unintuitive that there
    is still something to choose (ex. cantrips and spells)"* — a step with two pick sections
    answered one and sat there. Completing one now opens the next section still asking, and only
    after a TAKE, so dropping a pick never yanks the list away. **The chip row also draws at
    mobile now**, where it is the opener: without that, a two-section step showed chips and no
    buttons — a dead end, found while verifying this.
  - **Verified live at 1280, 1000 and 375, both themes:** the 4th cantrip is accepted, reported
    and droppable, while a drop inside the window still leaves its slot; nothing selected gives
    the picker all 956px and the pane 0; opening a detail animates to 498/440 and the collapse
    control closes it back to 956/0; the filter popover opens 518px tall over the list; the group
    label is 10.5px uppercase against 13px rows; three cantrips hand the picker to Spellbook
    spells; at 1000 the pane never opens and the detail is a modal; at 375 the chips open the
    modal and a single-section step keeps its button. Gate clean, engine 35 ok / 0 fail.
  - **Enforced by:** `guidePickDrop`/`acqLevelOf`/`stagePrevOk`/`stagePrevToggle`; the `.gwork`,
    `.gprev*`, `.gpsech` and `.gnav` rules. **Affects:** D164, D115(d) (scoped, not changed).

- **D166 (2026-09-02) DECIDED — seven of nine review notes, and what the other two are waiting
  for.** Francesco's second review of the guide. Amends D165(c,f) and narrows D147.
  - **(a) The last row of a picker was unreachable** (True Strike findable by search, not by
    scrolling): `#gpList` keeps its own `max-height` for the modal, which inside the stage nests
    a second scroller within the body's. The tail sat in the inner one and nothing reached it.
    Both lists are neutralised inline now — the body is the only scroller. *(The same fix landed
    for `#entList` in D164 and was not carried across; one list, one scroller, both of them.)*
  - **(b) A preselected option counts as ANSWERED in the guide.** The casting-ability question
    shows "Intelligence" and the chain called it open, so the rail asked for a decision the card
    had already made. The Choices card's stricter count (D158(e)) is a different surface and is
    unchanged. *Rejected:* dropping the preselection (the default is right far more often than
    not, and Next already writes it).
  - **(c) A prefiltered group wears a funnel.** A granted group ("a Druid cantrip") showed a
    short list with nothing saying it was narrowed, which reads as a short pool.
  - **(d) The detail pane CLOSES rather than collapses**, from an icon inside the pane with no
    box around it, and nothing is left on the picker when it goes. The collapse he asked for
    went to the chain rail instead, driven by the header control that already exists — below the
    breakpoint it still switches panes, above it hides the rail and gives the stage its width.
  - **(e) The walk's buttons: wider, not taller.** D165(f) grew both; the height was already right.
  - **(f) XPHB is dropped from class and subclass menus** (narrowing D147): naming the edition
    the app is FOR says nothing, while "Artificer (TCE)" beside it still says something.
  - **(g) The end-of-walk primary reads "Answer what is still open"** — "Go to the first open
    step" described the mechanism rather than the offer.
  - **(h) Four CSS answers to one animation, all measured, all wrong** — worth writing down
    because each looked right: `grid-template-columns` transitions froze at their start value
    (both `0fr`→`minmax()` and `0px`→length); a `:has()` rule matched when queried but the engine
    never re-ran style on the ancestor when the descendant's class changed; and a `width` on the
    grid ITEM cannot grow an `auto` track a sibling `1fr` has already claimed. The track template
    is set from JS and the pane fades. **`:has()` for a state that changes at runtime is not
    reliable here** — set a class where the state changes.
  - **Still open, both with his agreement:** the **class picker** (a class cannot be changed once
    chosen — it needs the full-size picker the others have, not a bolt-on), and **highlighting
    the next choice in a section plus a new Next state that walks the choices before the level**
    — he asked for a mockup with options on that one, so it is a decision, not a task.
  - **Verified live at 1280 and 375:** True Strike reachable with one scroller; the casting
    ability reads answered in the chain with its value; the funnel shows on a granted group;
    the pane opens 0 → 420 (picker 956 → 536) and closes back with no stray icon; the rail
    collapses and returns from the header; buttons 34px tall and wider; no XPHB in the class or
    subclass menus. Gate clean, engine 35 ok / 0 fail.
  - **Enforced by:** `stagePrevSync`/`stagePrevClose`/`srcTag`/`gchoiceSec`; the `.gpsech`,
    `.gnav`, `.gprev` and `.railshut` rules. **Affects:** D147, D158(e) (scoped), D165.

- **D167 (2026-09-02) DECIDED — the next choice in a step is MARKED, and Next names it.**
  Francesco's note, raw: *"once a choice lands, mark the one to make next"* and *"Next: it
  should move onto the next choice in the section before moving to next level"*. Mocked as
  three options in `scratchpad/mockups/guide11.html` (`python3 scratchpad/mkguide.py`), his
  pick **A** with one amendment.
  - **(a) The mark is the accent ring** — `border-color:var(--accent)` over
    `background:var(--accent-soft)` on `.gtchip.nextup`, the same mark the chain already uses
    for the step you are standing on (`.gcstep.cur`), one level down. *Rejected:* **B, a
    leading dot** (the chain's own open mark — quieter, but it adds a glyph to a row that is
    already carrying a counter) and **C, the rest recede** (answered chips dimmed, the next
    one at full strength — it reads as progress, but it says nothing on a step whose sections
    are all still open, which is exactly when the mark is wanted).
  - **(b) Hover REPLACES the mark, it does not layer on it.** His amendment to A, and the one
    thing the mockup had wrong: hovering a marked chip changed its border and ink and left the
    accent ground behind it, so two states showed at once. `.gtchip.nextup:hover` puts the
    ground back to `--panel`, and a hovered chip is a hovered chip.
  - **(c) What gets marked: where the walk STANDS.** The picker's own section while it is
    still asking; otherwise the first section that is. Below the picker's breakpoint no
    picker is open and the first still-asking section is the answer. So filling a section
    moves the mark to the next one still asking, which is the "once a choice lands" half.
  - **(d) Next walks the step's own sections before the level**, and NAMES where it is going —
    "Next: spellbook spells". Only once nothing in the step is still asking does it read the
    bare "Next →" and advance the walk. It still commits what the step is showing first
    (`guidePending`), and it is still forward-only (G3): a section left behind stays open and
    the chain flags it, exactly as a skipped step does.
  - **(e) The button prints the chip's own label**, lowering its first letter only when the
    label carries no other capital ("Spellbook spells" → "next: spellbook spells"; "Feat /
    ASI" and a granted group's name are left alone). The button and the chip have to read as
    the same thing. *Rejected:* lowercasing unconditionally, which writes "eldritch
    Invocations".
  - **Verified live**, dark and light, at 1280 and 375: on an untouched L1 Wizard the Cantrips
    chip carries the ring and Next reads "Next: spellbook spells"; pressing it moves the
    picker to the spellbook list (37 spells, "0 of 6"), moves the ring with it and drops Next
    back to "Next →"; filling the three cantrips turns that chip `gtdone` and hands the ring
    on by itself; hover on the marked chip measured `background rgb(33,29,22)` — the plain
    chip's own ground — with border and ink on `--free`; the mark changes no box metric
    (12/12 and 6.5/6.5 on both chips, identical to unmarked); at 375 the same Next opens the
    section's modal. 0 console errors; gate clean, cparity 58 ok / 0 fail, engine 35 ok / 0 fail.
  - **Enforced by:** `guideSecName` and the `here`/`upsec`/`from`/`secNext` block in
    `guideStage`; the `.gtchip.nextup` rules. **Affects:** PLAN.md (the open ⚑ this closes),
    D162 (the chip row it marks), D165(h)/D166 (the walk's buttons).

- **D168 (2026-09-02) DECIDED — the class step gets the full-size picker, and a class can be
  CHANGED.** Francesco, raw: *"a class cannot be changed once chosen — the step draws its value
  and stops, and the two big buttons beside it take the NEXT level rather than edit this one"*,
  wanting *"the same surface species and feats now have"*. Two calls in it were his; the rest
  follow from the plan model.
  - **(a) The entity picker gains a `class` kind.** Same box, same filters, same rows, and the
    same detail surface — so a class arrives in the preview pane with the D148 class body it
    already had (core traits, progression, features), which is more than the old `<select>`
    could ever say. Its row line is the one the list owes: casting progression and ability,
    hit die, and the level its subclass lands at. `caster:"artificer"` is a PROGRESSION, not a
    class — half casting that rounds up, what the 2024 Paladin and Ranger print (D158(b)) — so
    it reads "Half caster" like `1/2`, which is how `compute()` and `planSlots()` already treat
    it. A class with no casting of its own says NOTHING about casting: a Fighter's spellcasting
    arrives with Eldritch Knight, and the subclass line is where that is answered.
  - **(b) Changing a level REWRITES the plan, it never adds.** `state.levelOrder` is the
    acquisition order of class-level rows, so changing the class at character level N hands
    that one place to another row: the new class gains a level, the old one loses the level it
    held there, and everything below keeps the class it was taken in. Still one idiom —
    `classLevelPlan()` plus a single assignment to `state.levelOrder`.
  - **(c) A class left with no levels leaves the build, and that take ARMS (D53).** His call,
    over "just do it" (what the character view's own Remove class ✕ does today, unarmed) and
    over refusing the change and sending him to that other surface. Two clicks, and only where
    the change would empty a class — every other take is one, as everywhere else.
  - **(d) The cost is stated ONCE, in the bar, not per row.** Built as he approved it — a line
    under each candidate — it turned out to be the same sentence on all thirteen rows, and
    clipped. It is a fact about the LEVEL, not about each class on offer, so it sits beside the
    count in the picker's own bar, which the stage lifts out of the scroller: *"Cleric holds
    only this level: changing it takes Cleric and its 1 pick out of the build"*.
  - **(e) A class picker NEVER opens with its step** — the one place this surface departs from
    species and feats (D164). His instruction for the growth step is explicit: *"the picker
    only opens when you choose not to pick either of the preselected classes"*, so the two big
    buttons of **D126(d)** stay and the picker is what you reach for when neither is the answer.
    On a level already taken the same rule holds for a different reason — that picker rewrites
    the plan, and a rewrite surface standing open on every class step of the walk is one stray
    click from a change he did not ask for. Enforced by `guideSecAuto`, a narrower predicate
    than `guideSecOpen`.
  - **(f) The `<select>` goes; the two big buttons stay.** It answered the same question the
    picker now answers better — an `<option>` holds a name and a book code and nothing else.
    Amends **D126(d)**, which chose a select over a popover because the stage would clip one;
    a hosted picker is not a popover, so that reason no longer bites. Below the breakpoint it
    is a button opening the modal, the shape species and feats use.
  - **(g) Taking answers, changing edits.** A take on the growth step CLOSES the picker: the
    step is answered and the card says so, and leaving the whole class list standing over an
    answered step is how a second click means "replace" when it was meant as "add". A rewrite
    picker stays open on the level it is editing.
  - **Verified live**, dark and light, at 1280 and 375: from an empty build the growth step
    drew "Choose a class" alone and opened nothing until clicked; taking Wizard wrote one level
    and closed the picker; the step then drew "Continue Wizard → 2" plus "Another class…" and
    no select. Changing L1 of a Wizard 3 to Cleric took the plan to `[Cleric, Wizard, Wizard]`
    with Wizard at 2 and Cleric at 1 — total level unchanged, L2/L3 still Wizard. Changing a
    level whose class held only it armed, showed "Confirm?" in the widened `.tk.ico-only.armed`,
    and on the second click removed the row, its `state.chosen` entry and its trades. The
    current level's row is ticked and its button disabled ("This level is already Cleric").
    Walking to another step while a rewrite picker is open closes it and writes nothing.
    Take buttons centred to 0.00px on both axes across six rows; no horizontal overflow at 375;
    0 console errors; gate clean, cparity 58 ok / 0 fail, engine 35 ok / 0 fail.
  - **Enforced by:** `guideChangeClass`, `rowAtLevel`, `classChangeCost`, `classPreview`,
    `CASTER_NAME`, `guideSecAuto`, the `class` branches of `entItems`/`openEntityPicker`/
    `renderEntityList`/`renderEntBudget`/`stagePickIsFor`, and the `#entSub .subwarn` rule.
    **Affects:** PLAN.md (the open ⚑ this closes), D126(d), D147, D164 (scoped by (e)).

- **D169 (2026-09-02) DECIDED — a take button says whether the question takes one answer or
  several, and the FIRST class opens its picker.** Two notes on v1.5.26.
  - **(a) `+` means "one more"; a ring means "this one instead".** Francesco, raw: *"we need to
    distinguish picker buttons where you get to select more choices (feats, spells etc.) and
    pickers with only one selection (ex. class, subclass etc.). The + button works for the first
    but not the second group"*. A new `ring` icon carries the radio idiom, and every take button
    in the app now goes through one helper, `takeIco(on,one)`, so the two marks cannot drift.
    Both still become a ✓ once taken — that half is unchanged, and it is still click-to-take-back.
  - **(b) Which questions take ONE answer.** The species (there is only ever one), the class at a
    character level (every mode of that picker answers "which class at this level", so it is a
    ring whether it is rewriting a level or taking the next one), a spell TRADE and a PLACE (one
    replacement, one slot), and any pick section asking for a single pick — `sec.need===1`, which
    is the same number the chip prints ("Cantrip 0 / 1"). Everything else keeps `+`: feats and
    optional features are slots you hold several of, a class's spell list is filled to a count,
    prepared spells and marked creature forms are lists. The repeatable "take another copy"
    button keeps its plus for the obvious reason.
  - **(c) The FIRST class opens its picker with the step.** His note: *"the initial choose a
    class should have the picker open"*. It is the one class step with nothing to choose the
    picker OVER — no class to continue, no other class to go back to, and "Choose a class" alone
    on the card. Narrows **D168(e)**, whose blanket "a class picker never opens with its step"
    was right for every other case and wrong for this one. The predicate is one clause in
    `guideSecAuto`: not done, and no `continueOf`.
  - **Verified live** on a build taken from empty to Wizard 4: the first class step came up with
    the picker already open and no button on the card; class rows and species rows draw the ring,
    feat rows and a 3-cantrip section draw the plus, and the L4 "Cantrip 0 / 1" section draws the
    ring with a ✓ on the three cantrips already held. 0 console errors; gate clean, cparity 58 ok
    / 0 fail, engine 35 ok / 0 fail.
  - **Enforced by:** `takeIco` and the `ring` icon; the `one` argument at `gpickRow`, `pickRow`,
    `entRow` and the class row; `guideSecAuto`. **Affects:** D168(e) (narrowed), D31, D135.

- **D170 (2026-09-02) DECIDED — the chain rail collapses from its OWN header, into a narrow
  column.** Francesco: *"still no way to collapse the side rail, put a command in the rail header
  (right aligned). When collapsed, the rail is a narrow column with only the level indicators and
  their state"*.
  - **(a) The command belongs to the rail.** **D166(d)** put it in the page header as
    "Hide chain", sharing one control with the phone's pane switch — and he never found it,
    which is the report. A control for a state you cannot see is not discoverable; the rail is
    the one surface that can show it is collapsed and offer its own way back. `railToggle` sits
    right-aligned in the rail's header (`.railtog{margin-left:auto}`), a chevron in the same
    ghost affordance as the walk arrow beside it.
  - **(b) The header draws unconditionally now.** It used to render only where a downward walk
    was possible; it carries the collapse, which is not optional. Collapsed, the walk control
    goes — there is no room and nothing to point along — and only the chevron is left, centred.
  - **(c) Collapsed is a COLUMN, not a hidden pane.** 54px: the level chip and the level's one
    state icon, stacked and centred, class rails and all. The name, the caret, the grip, the
    steps and the run dividers go. Clicking a card opens the rail ON that level — collapsed
    there is nothing else a card could usefully toggle.
  - **(d) No transition on the width.** **D166(h)** is the standing lesson and it bit again in
    the same session: `flex-basis` animated from 272 to 54 reads as 272 wherever frames are not
    running, so the rail says it is collapsed and is not. Instant.
  - **(e) Every collapsed rule is gated on `min-width:821px`**, and the toggle is hidden below
    it. Under the breakpoint the rail IS the pane you switched to, and a `railShut` left over
    from a wide session would otherwise squash the whole chain to 54px. The page header's
    control goes back to being the phone's pane switch and nothing else.
  - **Verified live:** the rail collapses 272 → 54 and back from its own header; the level chip
    and the state icon measure 8.05/8.05 symmetric on every card including the growth ghost
    (whose 1px dashed border needs the compensation the 3px class rail gets removed from); the
    page header's toggle is hidden above the breakpoint and switches panes below it, where the
    chain still fills 375 and the rail toggle does not draw.
  - **Enforced by:** `railToggle`/`railHead`, the collapsed-card branch of the chain card's
    `onclick`, and the `@media (min-width:821px)` `.railshut` block. **Affects:** D166(d)
    (superseded in its control half), D131(e) (the walk strip is now part of a header).

- **D171 (2026-09-02) DECIDED — the class picker gets the filters a class actually has.**
  Francesco: *"the filters for the class picker aren't adapted to it (hide ones I can take
  doesn't make sense)"* and *"remove granted spells from class picker, mention main scores
  instead (they should also be a filter)"*.
  - **(a) A filter that cannot mean anything does not draw.** "Hide ones I can't take" answers
    prerequisites, and a class has none; "only ones that grant spells" would tick every row,
    because a class's spells are its whole list rather than a grant. Both go for `class`, with
    their separator, and the ⋯ button's narrowed-count stops counting them.
  - **(b) MAIN SCORE is the class filter** — the 2024 class table's primary ability, the six
    scores as a toggle row, preset to all so an untouched preset filters nothing. That guard is
    load-bearing: the one record with no primary stated (the UA Mystic) would otherwise vanish
    the moment any narrowing was applied.
  - **(c) The row leads with its main scores as chips** (D148: an ability stated as a FACT is
    always a coloured chip) and the granted-spell tail and its ✦ mark are gone. The CASTING
    ability went with them — every caster's primary ability contains it, and printing both made
    a Paladin's row say Cha twice. What is left is the line a class owes: scores, progression,
    hit die, and when the subclass lands.
  - **Verified live:** the class menu draws Main score and Books and nothing else; narrowing to
    Int leaves Artificer and Wizard and lights the filter button; the feat picker still draws
    its category row and both toggles, 47 feats, unchanged. Gate clean, cparity 58 ok / 0 fail,
    engine 35 ok / 0 fail.
  - **Enforced by:** the `class` branches of `entItems`, `openEntityPicker` (`abils`/
    `presetAbils`) and `renderEntityList`; `classPreview`/`classScores`; `#entAbs`. **Affects:**
    D168(a), D147, D31.

- **D172 (2026-09-02) DECIDED — the filter set, picker by picker; the surface is still his to
  choose.** His note: *"Audit and rework all filters, studying how they are implemented in
  5etools. Interview me and ask me which of those filters I want to include (for each picker),
  then standardize them visually as well"*. The audit read 5etools' own source in the mirror
  (`5etools-v2.33.3/js/filter-*.js`), not a recollection of it.
  - **(a) A collapsed rail tile JUMPS, it does not expand** — his correction to **D170(c)**,
    given in the same round. The rail is collapsed because you wanted the width; a click that
    gives it back undoes the thing you asked for. The header chevron is what expands it.
    Shipped as v1.5.29.
  - **(b) The spell set, all four groups he was offered:** School · Cast time + Duration ·
    Components with Ritual and Concentration · Damage type, Saving throw, Condition inflicted.
    Level and search already exist. Every one of these is already in `data.json`
    (`school`, `tcat`, `comp`, `ritual`, `conc`, `dmg`, `save`, `cond`), so this is UI only —
    no extractor work and no `cparity` exposure. The one derivation needed is a DURATION
    CATEGORY: we store `durTxt` and `conc` and no category, so instantaneous / rounds /
    hours+ / permanent has to be derived in `app.js` rather than added to both extractors.
  - **(c) The GUIDE's spell picker gets the same set and the same controls.** It has only a
    search box today, and it is the surface the guided builder puts him in — the audit's own
    finding, not one of his notes. One filter vocabulary across both spell pickers.
  - **(d) Feats: prerequisite STATE and ability bonus.** The state filter replaces
    "hide ones I can't take" with the three-way the prereq engine already computes — eligible /
    not yet / can't verify — which is D-prereq's advisory model made visible instead of the
    binary that flattened it. *Rejected:* a repeatable switch (offered, not taken).
  - **(e) Species keeps books and nothing more.** 5etools filters species on size, speed,
    traits, creature type and languages; **we extract none of it**, so it would mean both
    extractors, cparity and a data refresh. Offered with that cost stated and not taken.
  - **(f) The visual standard is GATED on a mockup** — his call, the way every guide round has
    gone. `python3 scratchpad/mkfilters.py` → `mockups/filters{1,2,3}.html`, self-contained
    (the stylesheet inlined, a theme switch on each), every value read off `data.json` so the size is real (~68 toggles for the spell
    picker against a `.menupop` whose min-width is 180px): **1** one popover sectioned, the
    honest baseline that scrolls taller than the list it filters; **2** a filter panel beside
    the list, everything visible at once, costing width the stage has and a phone does not;
    **3** a filter bar whose group buttons each open one small popover, with the active
    choices as removable chips — the only one where the narrowing is readable without opening
    anything. **His pick, then the build.** The wording pass he asked for separately
    (*"dry, streamlined"* — "Only ones that grant spells" → "Spellcasting" with an on/off
    toggle) lands WITH the chosen surface rather than before it: it is the same standard.
  - **Enforced by:** the collapsed-tile branch in the chain card's `onclick` (a);
    `scratchpad/mkfilters.py` (f). **Affects:** PLAN.md (Phase M), D170(c) (corrected),
    D31, D147.

- **D173 (2026-09-02) DECIDED — the filter surface is the SECTIONED POPOVER, and three defects
  it exposed are fixed.** His pick of the three mocked in D172(f): **variant 1**. Closes that
  gate; Phase M's M2–M4 can proceed on it. The three notes he attached are all REAL and all
  already shipped, on rows that exist today — this is not mockup polish.
  - **(a) A toggle chip keeps its box inside a popover.** *"In the unselected state they simply
    look like random text."* `.menupop button` sets `border:none; background:none; 13px;
    text-align:left; padding:8px 11px` and it OUTRANKS `.cbtn` (one class + one type beats one
    class), so every toggle row inside a popover was stripped to a menu row: no border, no
    radius, wrong size, left-ranged. Only the SELECTED ones read as controls, because
    `.cbtn.on`'s background survived — which is exactly why the rest looked like loose words.
    `#pickLevels`, `#prepLevels`, `#entCats` and `#entAbs` were all affected, and the same
    control outside a popover (`#fLevel` on the filter card) always looked right, so the app
    had two treatments of one control. `.menupop .cbtn` restores the chip; the menu rule is
    left alone, because it is correct for the menu ROWS it was written for.
  - **(b) An ability toggle wears its signature colour.** `--ab-*` (D142(b)) on the chip's ink,
    and on its border and 14% fill when selected — the same treatment `.abtile` already had,
    and what D148 requires of an ability stated as a fact. `buildToggleRow` gained a `clsOf`
    argument so a row can carry per-item classes; the ability rows are its only caller.
  - **(c) The OFF switch reads as a control, not as an absence.** *"Disabled toggle is almost
    invisible."* Measured: OFF 3.63:1 against the panel where ON is 6.57 — passing on its own
    and invisible beside its own on-state. The track is outlined now (an INSET shadow, not a
    border, which would resize the 26x15 track) with a solid knob, both `--muted`.
  - **Verified live in both themes, measured after a real frame:** ability inks 7.80–7.98:1
    (light) and 6.71–7.31:1 (dark) on the panel; the chip's border 3.63 / 3.51; the off
    switch's ring 6.55 (light) and 6.36 (dark) against 6.52 for the on track — the asymmetry
    that made it disappear is gone. Chips measure 11.5px, `3px 9px`, radius 16, centred, inside
    the popover and out. Gate clean, cparity 58 ok / 0 fail, engine 35 ok / 0 fail.
  - **A side effect worth naming:** with the chips at their real size the sectioned popover's
    content dropped from a menu-row stack to 857px against a 518px box. Variant 1's known
    weakness — it is taller than the list it filters — is *smaller*, not solved: it still needs
    a max-height and a scroll, and M1 has to give it one.
  - **Enforced by:** `.menupop .cbtn`, `.cbtn.abt.*`, `.swk.swoff`; `buildToggleRow`'s `clsOf`.
    **Affects:** D172(f) (the gate it closes), PLAN.md (Phase M), D142(b), D148, D31.

- **D174 (2026-09-02) DECIDED — the filter menu is a stack of GROUPS that open one at a time,
  and every axis reads "empty means all".** M1b and M2 of Phase M, on the surface D173 chose.
  - **(a) A calmer chip.** His note on the chosen mockup: *"try a different visual than these
    chips, it can feel overwhelming now"*. The overwhelm was an OUTLINE PER ITEM: at rest
    nothing is selected, so ~68 borders were each drawing a box around something you had not
    chosen. The resting chip is filled and BORDERLESS (`--panel-2`, `--ink`) — plainly a
    control, no line noise — and the outline is spent only on what you have chosen. The filter
    card's own rows keep the outlined chip: short, on a panel, never sixty items.
    *Rejected:* going back to bare text (that was D173(a)'s bug) and a checklist (calmer still,
    and four times taller).
  - **(b) EMPTY MEANS ALL, everywhere.** The spell picker's levels have always worked that way
    (`PICK.levelSet`); the feat categories and the class's main scores were preset-to-ALL and
    had to be *narrowed down*. One convention now, which is also what lets a resting menu show
    nothing selected — half of why the old rows read as a wall. D171(b)'s Mystic guard survives
    it unchanged: an untouched row still filters nothing.
  - **(c) One group open at a time**, each closed row STATING what it is narrowed to — "all",
    the single value by name ("Evocation" says more than "1 of 8" and costs the same room), or
    a count. Nine groups is nine lines until you ask for one. The idiom is the chain rail's,
    which has opened one level at a time since D130(a).
  - **(d) The margins, and the two rules that were eating them.** His *"increase slightly the
    left and right margins"*: 14px → 18–20px, measured symmetric. Getting there needed the
    menu to name its wrappers — `.pickermenu .menupop` and `.pickfiltermenu .menupop` predate
    it and outrank a bare `.menupop.fmenu` by coming later at equal weight, which is why the
    main picker's menu first came out 180px wide with its chips wrapping.
  - **(e) Books stay individually checkable** (his note). The book checklist is the one group
    that is not a toggle row — a `custom` body holding `renderSourceChecklist` and its four
    quick actions, with its scroll position held across the rebuild.
  - **(f) M2: the spell filters, on BOTH spell pickers** (D172(b,c)) — School, Cast time,
    Duration, Components, Damage, Save, Condition, plus Ritual and Concentration as switches,
    and Level where the pool spans more than one. The guide's picker had a search box and
    nothing else. **A row's items come from the POOL IN FRONT OF YOU**, not a hand-written
    list, so a class-scoped picker offers the schools that class has and a new book brings its
    own damage type with it; a row with fewer than two values does not draw at all.
    Multi-select is OR within an axis and AND across them. **Components are the exception and
    deliberately so** — they are properties of one spell rather than alternatives, so V+M asks
    for spells with both.
  - **(g) Duration is DERIVED, not extracted.** `durTxt` is the printed string and `conc` is
    its own flag; `durCat` buckets them in `app.js` (instant · rounds · minutes · hours · days
    · until dispelled · special) rather than adding a field to both extractors for one filter.
    "24 hours" reads as hours, because that is what the book prints.
  - **Verified live, dark and light, at 1280 and 375:** the class menu is 2 rows / 86px at rest
    against a stacked wall before; narrowing Main score to Int leaves Artificer and Wizard and
    the row reads "Int", adding Wis reads "2 of 6"; the guide picker's School → Evocation takes
    37 spells to 8 and its Damage row offers the 9 types that pool actually has; Fire leaves
    Burning Hands and Chromatic Orb, and Concentration on top of it leaves none — correct, and
    every axis clears back to 37. The main picker's menu is 270x361 with no inner scroll and
    draws its Level row where the pool spans levels. Margins 18/18 and 20/20, symmetric.
    Books: 31 individual checkboxes plus the four quick actions, 363px inside the 520 cap.
    At 375 the menu is 270x454, fully in viewport, no horizontal overflow. Resting chip text
    17.84:1, selected 5.57:1 with a 6.57:1 border; group label and value 6.55:1. 0 console
    errors; gate clean, cparity 58 ok / 0 fail, engine 35 ok / 0 fail.
  - **Enforced by:** `filterMenu`/`filterSum`; `spFiltNew`/`spFiltOk`/`spFiltItems`/
    `spFiltGroups`/`durCat`; `entFilterGroups`/`entBooksGroup`; `gpickMenu`; the `.fmenu`
    block and `.menupop .cbtn`. **Affects:** PLAN.md (M1b, M2 done), D171(b), D173(a), D31.

- **D175 (2026-09-04) DECIDED — a rich tag's display text is per-tag, not "segment 0".**
  Francesco: *"the scaling in conjure elementals is wrong, check if other spells have the same
  issue"*. It printed *"the damage increases by 8d8;4d8"* where the book says **1d8**.
  - **(a) The cause.** `rich_strip`/`richStrip` kept the FIRST pipe segment of every
    `{@tag …}`. For `{@scaledamage 8d8;4d8|5-9|1d8}` segment 0 is the BASE damage, segment 2
    the per-slot increase — so the sentence that promises an increase printed the whole base.
    Not one spell: **137 spells** carried a wrong number in their higher-level line, in both
    editions and across `@scaledamage` and `@scaledice` (Fireball read 8d6, Cone of Cold 8d8,
    Color Spray 6d10). The screen was self-consistent, which is why it survived this long.
  - **(b) The rule.** Segment 0 stays the DEFAULT — it is right for most tags. Two tables name
    the exceptions, taken from 5etools' own unpackers rather than guessed: `TAG_DISPLAY`
    (`scaledice`/`scaledamage` → 4 then 2, `quickref` → 4, `deity` → 3, `card` → 3,
    `subclass` → 4, `classFeature` → 5, `subclassFeature` → 7) and `LINK_TAGS`, the 30 tags
    whose display text is segment 2. Of the 605 strings that moved, **135 are higher-level
    lines** and the other 470 are link tags: *"Proficiency"* → *"Proficiency Bonus"*,
    *"you have Cover"* → *"Three-Quarters Cover"*, *"Ghoul"* → *"Ghouls"*.
    *Rejected:* defaulting every tag to segment 2 — the FORMATTING tags (`@dice`, `@filter`,
    `@book`, `@chance`, `@color`) take pipes too and carry their display elsewhere, so a
    blanket rule prints a book code where a spell name belongs.
  - **(c) The gate grows a prose line.** `cparity.js` compared desc paragraph COUNTS, so a
    table that drifts between the two extractors would print a different number in the two
    builds and pass. It now compares every spell's `desc` + `higher` **byte-identical** across
    js and py, and asserts no higher-level line still carries a `Nd N;` base list. Both
    assertions were watched go red (one index flipped in `extract.js`: 7 spells, prose false)
    before being put back.
  - **Verified:** 605 strings changed in `data/data.json`, 0 keys added or lost; every sampled
    diff strictly better; Conjure Elemental XPHB reads *"The damage increases by 1d8 for each
    spell slot level above 5"* in the live app. Gate clean — cparity 60 ok / 0 fail, engine,
    deadfns, ids, eslint all 0.
  - **(c) A granted spell's NAME is a link, and the jump remembers where it came from.**
    Francesco's second note: *"in the section spells it gives you, you should be able to click
    and see the spell details"*. Both surfaces live in the SAME box (`SPMODAL`), so the spell
    replaces the feat/species/subclass you were reading — and every other detail surface in
    this app is a dead end you leave by closing, so a one-way jump would have made this one a
    trap. `SPBACK` holds what was replaced and the spell modal's header offers it back BY NAME
    ("← Fey-Touched"), which a bare arrow does not say. `ENTM` is nulled on the way in: the
    entity modal is gone from the DOM and a live pointer would have `renderEntChoices` write
    into a node that no longer exists.
    **Only a named spell is a link** (his call): a pick's question ("2× a spell of level 1 or
    lower"), an expansion and an option group describe a CHOICE, not a spell, so there is
    nothing to open — and an option group's names are the group's alternatives, not its grant.
    *Rejected:* a one-way link (cheapest, consistent with `attachSpell`, but you lose your
    place); expanding the spell in place under its row (keeps the feat on screen, but the
    block becomes a scroller and a spell's access chips and stat block do not fit it).
    The link is a `<button>` for keyboard and screen readers, with everything a button brings
    of its own — font, colour, padding, background — handed back to the prose, or the row
    breaks into boxes the way `.menupop button` broke the toggle chips in D173. `.ctsub`
    reaches through it by `color:inherit`, so a subclass's entry keeps its mark.
  - **Verified live:** Fey-Touched → Misty Step → back, twice, with the title and the grants
    block correct each time and `ENTM` null while the spell shows and restored on return; a
    spell opened any other way has no back control; Alchemist's 13 grants render as links with
    12 of them keeping the `.ctsub` accent through the button. The chevron's left edge is
    **0.00px** off the title's at both 1280 and 375, the icon vertically centred to 0.00px, the
    control clear of the ✕ and in viewport at both widths with no horizontal overflow; back
    control 6.36:1 dark, 6.55:1 light; the link sits on its row's own line box (Δtop 0.00px).
    0 console errors; gate clean.
  - **Enforced by:** `TAG_DISPLAY` + `LINK_TAGS` in `extract.py` AND `src/extract.js`;
    `cparity.js`'s "spell prose (byte-identical)"; `SPBACK`, `wireGrantLinks`,
    `openSpellModal(sp,back)`, `.gsplink` and `.spback`. **Affects:** GOTCHAS.md, CLAUDE.md's
    both-extractors rule, D50 (stat-block prose rides the same stripper), D147 (the Access
    chips stay unlinked), D149 (the choices block), D164.

## Phase K task bodies — the Library redesigned (archived 2026-09-05) {#phase-k}

## Phase K — the Library redesigned (D154, decided 2026-09-01) — ✅ K1–K4 DONE (v1.5.7 → v1.5.17)

The design is LOCKED — one page, one list, selection bar, no refresh verbs; the approved
mockup is `scratchpad/mockups/library4.html` (`python3 scratchpad/mklib4.py` regenerates)
and **D154 owns every call and every rejected option — cite it, don't re-derive.** Order
matters: K1/K2 are UI over the existing model; K3 changes the model and K4 deletes what K3
obsoletes.

- [x] **K1 · The one-page shell** — shipped **v1.5.7** (D154 + **D155**). Kill the Sources|Manage tabs; status strip (books ·
  5etools version vs latest · storage · **Update data**, accent-bordered when a release is
  out) + search/Actions + G1 edition groups + R3 two-line rows (select-checkbox · name over
  kind counts · origin chip web/file/built-in · enable switch; disabled = dimmed, no badge)
  + selection bar (Clear · enabled switch · Remove, armed) + footer Close · ＋ Add files ▾
  (Upload .zip · Upload .json files · Choose a folder… · Paste JSON…). The permanent drop
  zone and drag-drop die (D154(f) — drop-anywhere was offered and rejected). Onboarding =
  the same page's empty state. *Done when:* every current capability except the retired
  verbs is reachable on the new page; a book can be enabled, disabled and removed singly
  and in bulk; alignment measured at 1280 and 375 in both themes.
  **Verified:** 44 rows in 6 edition groups; the switch toggles and dims (`aria-checked`
  follows), the row body selects and the switch does not; Actions' four verbs scoped to what
  the search is showing; removal armed (D53) and proved singly AND in bulk against the real
  44-book digest, then restored **byte-identical** (`JSON.stringify` equal, 4,373,629 bytes);
  paste → tray → Apply/Discard with nothing stored; empty state renders; **0 of 44 origin
  chips misaligned** (X and Y within 0.6px) at 1280 and 375 in BOTH themes, switch and
  checkbox centred to 0.00px; footer pinned and the popover in-viewport at both widths;
  0 console errors; gate clean, cparity 51 ok / 0 fail. **D155 records the five calls D154
  left open** — the single Add-files button, the address in Actions, the staged-only
  keep-plan, the pinned column, and the per-book origin stamp with its migration rule.
- [x] **K2 · The pending-import tray** — shipped **v1.5.8** (D154(h) + **D156**). Staged files render as a tray above the status
  strip, only while staged: chips · new-book ticks · Discard / **Add N books**. Replaces
  `#importPlan` as a standing surface; D86/D112 merge semantics unchanged underneath.
  *Done when:* a brew lands, shows in the tray, Adds into the list, and nothing is stored
  before the commit; Discard is armed.
  **Verified:** hidden at rest, shown only while staged, and rendered ABOVE the status strip;
  a two-book paste showed 1 new book tickable and summarised the 1 re-read as a sentence
  ("Add 1 book"); Add took the digest 44 → 45 with the new book enabled, took XGE 95 → 96
  spells, and **dropped nothing** (`lost: []` against a pre-Add snapshot) — then restored
  byte-identical; Discard is armed (D53) and left the stored digest untouched; a 12-book
  brew brought the filter row out at the ≥9 threshold and the list scrolled inside itself;
  checkbox and counts centred to 0.00px on every row at 1280 and 375 in both themes, 0
  overflow out of the box, footer in view. **D156 records the add-only model.**
- [x] **K3 · Raw-stash + web refetch (the model half)** — shipped **v1.5.16** (D154(g) + **D159**). Hand-added files stash raw JSON in
  IndexedDB at import; a parser bump triggers an automatic background re-parse (stash for
  `file` books, D153 refetch for `web` books) that reports once, after, via a fading
  notice. Migration: a pre-K3 digest has no stash — its `file` books keep working and get
  stashed on their next manual re-add; the notice names them once. D138's per-book stamps
  survive and drive the auto pass. *Done when:* bumping VERSION and reloading re-parses
  everything without a prompt and the footer stamp matches; a stashless legacy book is
  named, not silently stale.
  **D159 settled the three calls this spec left open:** the stash holds RAW json and only for
  brews (`_meta.sources` is the core/homebrew line — measured 20.8 MB raw · 12.7 MB slimmed ·
  4.0 MB digest, so stashing core content is the duplication D154(g) refused); **"stale" now
  means the PARSER FINGERPRINT changed** (`window.__PARSER__`, a hash of both extractors
  injected by `build.py`), not the version, because since D158(i) a version moves on copy-only
  patches; and web books are OFFERED, never auto-downloaded (D153).
  **Verified** in the pane, every staging route and both branches: paste and zip carry `raw`
  for a brew and nothing for a core-shaped file; Apply stamped both books
  `parserHash=44301f13e4be` and stashed only the brew; flipping the fingerprint and reloading
  **re-read the brew with no prompt** (its stamp followed, its spell intact) and left the
  stashless book NAMED — *"Re-read 1 book with the current parser. 1 book (K3CORE) was added
  before the app kept a copy…"*, waiting (`ask`), one action, dismissed per fingerprint and
  silent on the next boot; a web-origin stale book got **Update data** and downloaded nothing;
  healing everything gave the fading `ok` notice with no actions; **a version-only bump
  (1.5.15 → 1.5.16) changed nothing at all** — no re-parse, no notice, footer `v1.5.16`;
  removal pruned the stash to 0 along with the digest; 0 console errors; gate clean,
  cparity 58 ok / 0 fail.
  **Found and fixed while verifying:** `filterDigest` carried `parser`/`parsedAt`/`origin`
  forward but not the new `parserHash`, so a book not re-parsed in an Apply lost its
  fingerprint and then read as current — the D138(a) false success, one field along.
- [x] **K4 · Retire the old machinery** — shipped **v1.5.17**. K1/K2 already orphaned two functions — `folderForget`
  (app.js:5489) and `clearImport` (app.js:5970) are defined and never called, their only
  callers having been the Forget-folder and Remove-imported-data buttons. `entryWalk` and the
  drop-zone handlers went with the zone in K1. Still LIVE and still needed until K3 lands:
  `refreshImported` (the ⋯ menu's Refresh and the stale-parser notice's "Refresh now"),
  `staleBooks`/`refreshMissed` (the status strip and the tray both read them), and the whole
  folder-scan chain (`folderRecall`/`folderUsable`/`scanHandle`/`stageScanBooks` — the folder
  survives as an INPUT). Remove: Refresh imported data (both surfaces),
  Rescan/Forget folder + the linked-folder row (folder picker stays as input), the
  standing Remove-imported-data button, Clear staged (the tray's Discard covers it), and
  their wiring/notices — the stale-parser boot nag is already gone, K3 replaced
  `staleParserNotice()` with `autoReparse()`. GOTCHAS entries touching
  `refreshImported`/folder recall get updated, not deleted — they explain history.
  *Done when:* the six old verbs are gone, `rg` finds no dead handlers, and the D42
  nothing-prunes contract still holds on a book removal (picks flagged, never deleted).
  **Removed:** `#refreshBtn` and `refreshImported` with its whole cast (`REFRESH_BUSY`, the
  R-state, `btnText`, `refreshButtons`, `refreshPaint`/`Stage`/`Stop`/`Done`/`Fail`/`Ask`); the
  miss memory (`refreshMissed`, `refreshMissRemember`, `spellForge.refreshMiss.v1`, the tray's
  `#importMissNote` and its `.trayrow.miss` rule); the two K1/K2 orphans `folderForget` and
  `clearImport`; and — beyond the written scope, because K4 left it with no job but a button
  label — the REMEMBERED handle (`folderRemember`/`folderRecall`/`folderUsable`, the silent
  recall in `openImport`, and the `handles` store itself, dropped at `IDB_V` 3). The folder
  picker survives as an input, and the browser reopens it where you left it on its own.
  **Kept:** the whole scan chain (`scanHandle`/`scanEntries`/`stageScanBooks`), `staleBooks()`,
  and D42's `pruneState` contract.
  **Two stale sentences went with the verbs:** the unreadable-digest boot notice said *"Use ⋯ →
  Refresh imported data"* and `stageScanBooks` said *"Rescan the folder"* — both named controls
  that no longer exist.
  **Verified** in the pane: the ⋯ menu is nine items with no Refresh; `#refreshBtn` and
  `#importMissNote` are gone from the DOM; the database upgraded to **v3 with `handles`
  dropped** (`kv`, `raw` remain) and the app booted, imported and removed across the upgrade
  without a hiccup; paste → Apply → remove still works with the busy guards gone; **D42 proved
  on a real row** — a Wizard L3 build holding `Stash Bolt|K3BREW` and `Magic Missile|XPHB` kept
  BOTH picks after its book was removed (the spell left `DATA`, the pick did not); 0 console
  errors; gate clean, cparity 58 ok / 0 fail, **deadfns now 0 with the allowlist retired** (the
  sweep's `knownOrphans` cross-check is gone — the bar is zero, and `CLAUDE.md`'s gate line says
  so).



## Phase L task bodies — L0–L4 and L5.1–L5.4 (archived 2026-09-05) {#phase-l}

## Phase L — the three-pillar audit (D157, decided 2026-09-01) — ✅ L0–L4 DONE (v1.5.9 → v1.5.15) · ⏳ L5: **L5.1–L5.4 shipped** (v1.5.16 → v1.5.24), L5.5 on

D157 owns the charter, the agents, the rejected shapes — cite it. Reports land in `audits/`
(one per pillar + `synthesis.md`), a point-in-time artifact `/clean` archives once consumed.

- [x] **L0 · Deterministic sweeps** (session, scripts in `scratchpad/`, join the verify gate):
  uncalled functions · unmatched CSS selectors · duplicated helpers · storage keys and
  migrations · handler wiring against GOTCHAS. *Done when:* each script runs with nothing
  installed and prints a list the code agents start from.
  → done 2026-09-01: `scratchpad/sweeps/` (deadfns · deadcss · dupfns · storagekeys · handlers · ids), report `audits/L0-sweeps.md`; deadfns + ids gate since v1.5.12.

- [x] **L1 · Wave 1, auditors in parallel** (all report; trivial fixes in worktrees only):
  A direction `opus@high` · B1 live UX `opus@high` · B2 design-system read `sonnet@medium` ·
  C1 app.js structure `sonnet@medium` · C2 browser bug sweep `sonnet@medium` · C3 extractors
  / importer / storage `sonnet@medium`. *Done when:* six reports in `audits/`, every finding
  with evidence, B1 also holding the string inventory the copy rewrite starts from.
  → done 2026-09-01/02: six reports in `audits/` (A, B1, B2, C1, C2, C3) + `strings-inventory.md`.

- [x] **L2 · Wave 2, verifiers** `opus@high`, one per pillar, blind to the auditor's
  reasoning: reproduce or strike, then rank. *Done when:* each report carries a verdict per
  finding and a struck list.
  → done 2026-09-02: `V-A`, `V-B`, `V-C`; A 48/58 claims confirmed, B 44/45 findings, C all bugs reproduced, 2 C1 claims struck.

- [x] **L3 · Synthesis + triage interview** — done 2026-09-02: `audits/synthesis.md`, then five
  AskUserQuestion rounds → **D158** (every disposition, cite it).
- [x] **L4 · Wave 3, act** (D157(f), token-lean per D158): two Sonnet fix agents in worktrees
  (engine/importer · UI/a11y/CSS), then the copy rewrite on the merged tree with its before/after
  string table (D157(d), D158(l)), sequential squash-merge, gate each time, patch bumps.
  *Done when:* merged, smoke-tested on the merged tree, the table reviewed, vetoes reverted by
  name. Contents: the synthesis's "ships without a decision" list + D158(m)'s four flags +
  D158(e) pending count + D158(k) gate and lint.
  → done 2026-09-02, **v1.5.11 → v1.5.15** (two Sonnet fix agents + one copy agent, no verifier wave per D158): every item in the synthesis's "ships without a decision" list, D158(m)'s four flags, D158(e), D158(k). Smoke on the merged tree caught the dialog observer's first-open miss (v1.5.14). **Copy table awaits Francesco's veto** (⚑ below).

- [ ] **L5 · The build list** (D158(a) order; K3/K4 re-queued at the top):
  - [x] **L5.1 · K3** raw-stash + automatic re-parse — v1.5.16, **D159** (absorbed the C2-02 dead end, D158(h)). **K4 is next.**
  - [x] **L5.2 · Engine test scaffold** — shipped **v1.5.18**, the gate's **eighth** line
    (D158(j)): a boot guard (`__SB_HEADLESS__`) and an export shim in app.js,
    `scratchpad/engine.test.js` with a permissive DOM stub, **ten fixtures / 33 assertions**.
    **Fixture one is the pooling correction (D158(b)), which this task also SHIPPED:** every
    half-caster now contributes ⌈its own level/2⌉ instead of joining one bucket floored once,
    in both `compute()` and `planSlots()`. Artificer 5 / Wizard 5 → **8** (was 7), Paladin 1 /
    Sorcerer 4 → **5** (was 4), Paladin 3 / Ranger 3 → **4** (was 3); even splits unchanged.
    The other nine cover the own clock and the AT/EK rows, single-caster vs pooled, the pact
    pool staying separate, `verLt`, D146's empty slot, the per-book stamp carry-forward
    (fixture 8 guards the hole that has opened three times), the keyed digest merge, and
    D159(a)'s brew test.
    **Verified:** 33 ok / 0 fail, and **mutation-checked** — reverting the pooling fix reddens
    1a/1b/1c and dropping `parserHash` from `filterDigest` reddens 8b, exit 1 either way; the
    live app now reads `1st 4 · 2nd 3 · 3rd 2` for Paladin 1 / Sorcerer 4 (caster level 5).
    eslint needed one global (`module`, guarded by the shim's `typeof` test); config comment
    says why.
  - [x] **L5.3 · First import merges onto the bundle** (D158(d), amends D137) — shipped
    **v1.5.19**, implementation calls in **D160**. `assembleData` is now
    `IMPORTED ? mergeDigests(BAKED,IMPORTED) : BAKED`; the bundle is merged at ASSEMBLY and
    never written to storage (that would duplicate 4 MB and freeze a stale bundle that wins
    over the next release's). The staging base stays a storage question — widening it was
    tried and reverted the same hour, because `buildImport` reads `fresh` to tell an unticked
    book from a new one and every bundled book then looked unticked. Source counts are
    recomputed at assembly so a merged book's row matches what is on screen.
    **Verified:** first import takes 43 books → **44** (was 43 → 1) with one book in storage;
    a bundled book re-imported reads "nothing new here · Re-read 1 book", applies, and its
    record sits beside the bundle's; removing it leaves the bundle's copy, 392 spells and a
    `built-in` chip; 936 → 937 spells on a brew; gate clean, engine 35 ok / 0 fail.
  - [x] **L5.4 · Guide-stage mockup round** (D158(f)), then the chosen variant — shipped
    **v1.5.20**, **D161**. Six mockups from `scratchpad/mkguide.py`; the first round's side
    panels were rejected as redundant with the chain rail (his call, and right), so the answer
    became the step's own WORK: the picker's box moves into the stage above the guide's
    breakpoint and stays a modal below it. Fill **12% → 68%**. `column-width` was tried and
    measured wrong (a 486px lineage group pushed the list off the right edge, `scrollWidth`
    6880 in a 964 box). Mobile mockup `guide6.html` kept for L5.6.
    **Reviewed and re-shipped as v1.5.21 (D162)** on his notes: the list REPLACES the opener
    button (it was redundant beside an open picker), a multi-section step shows its sections as
    chips and loses the duplicated section headers, **one column always** (D161(c) reversed),
    capped at 720 and centred, and the end-of-walk sentence moved INSIDE the card — his "done
    and next session overlap", two surfaces claiming the same moment with the nav between them.
    Mockups `guide7`/`guide8` approved before implementation, as he asked.
    **Reworked again as v1.5.22 (D164)** — his notes on 1.5.21: the header's background and the
    unstyled × were ONE bug (a node moved out of `.modal` loses every `.modal`-scoped rule), the
    picker still took a click to reveal, and the mockups had been idealised rather than built
    from the app's own markup. So: the stage is a picker SURFACE with no dialog chrome, open by
    DEFAULT, with the app's own detail surface as a **preview pane** filled by clicking a name
    (his idea for the empty right band). Every filter comes with the box and its `.pickbar` is
    lifted out of the scroller so the popover cannot clip. Mockups `guide9`/`guide10` approved
    first. Two re-entrancy bugs and one stranded-detail-surface regression found and fixed on
    the way — all three are now GOTCHAS.
    **Eight adjustments on his review shipped as v1.5.23 (D165)**, including the one real bug:
    a pick taken beyond what the level asks for could not be dropped (the character view's
    pull-back rule reached a surface it was never meant for). The detail pane now opens only
    above 1100px and only once something is selected, animating the picker down and collapsing
    by hand; the filter popover is unmasked; the picker's grouping header is a label; the walk's
    buttons grew; the level chip left the top bar; and a finished section hands the picker to
    the next one still asking.
  - [ ] **L5.5 · Copy the build as a level plan** to the clipboard, in the Character Ideas shape
    (A-03; `levelGains`/`levelCasting`/`timelinePicks` already derive it). Size S, format his. 🔶
  - [ ] **L5.6 · PWA install check + a mobile pass on the Pages build** (D158(r); A-08). His
    action first, then measured fixes.
  - [ ] **L5.7 · Geometry full retrofit** (D158(g)), measured before/after, own release. Size L.
  - [x] **L5.8 · Ability scores + PB: the decision entry** (D158(c)) — **D176**, 2026-09-05; the
    build is **Phase N · N1** below.
  - [ ] **L5.9 · Magic items as custom-source prefill**, then rewards (D158(n)). Size M/L + M.
  - [ ] **L5.10 · Compare two versions** (A-05). Size M/L.
  - [ ] **L5.11 · Doc diet**: DECISIONS.md to an index at the next `/clean` (D158(q)).
  - Also live, unscheduled (D158(o)): SHADOWED source-aware · `subclassFeature` `_copy` · long-rest
    swap detection · High Elf / Human origin · A-09 character-forge handoff · A-13 concept line ·
    A-14 homebrew recipe · A-15 mirror script.



## Phase M task bodies — the filter system (archived 2026-09-05) {#phase-m}

## Phase M — the filter system (D172, decided 2026-09-02) — ✅ DONE (v1.5.30, v1.5.31, v1.5.40)

Every picker's filters, audited against 5etools' own source and rebuilt to one standard.
**D172 owns the SET and D173 the SURFACE — cite them, don't re-derive.** Nothing here needs
the extractors: every value is already in `data.json`. `python3 scratchpad/mkfilters.py`
regenerates the mockups; `filters1.html` is the one that was chosen.

- [x] **M1a · The control standard** — shipped **v1.5.30**, **D173**. His three notes on the
  chosen mockup, all of them real and already shipped: a toggle chip keeps its box inside a
  popover (`.menupop button` was stripping it, so unselected rows read as loose text on
  `#pickLevels`/`#prepLevels`/`#entCats`/`#entAbs`), an ability toggle wears its `--ab-*`
  signature colour, and the OFF switch is outlined rather than a flat grey track.
- [x] **M1b · The container** — shipped **v1.5.31**, **D174(a–e)**. `filterMenu` builds every
  picker's menu from a spec: groups that open ONE AT A TIME, each closed row stating what it
  is narrowed to; a calmer chip (filled, borderless at rest — the outline is spent only on
  what you chose, his *"can feel overwhelming"*); empty-means-all on every axis; margins
  18–20px symmetric; books still individually checkable; `max-height:min(70vh,520px)`.
- [x] **M2 · The spell filters** (D172(b)) — shipped **v1.5.31**, **D174(f,g)**. School, Cast
  time, Duration, Components, Damage, Save, Condition + Ritual/Concentration switches, on BOTH
  spell pickers, with Level where the pool spans more than one. Rows are built from the pool in
  front of you, so a class-scoped picker offers only what that class has. Duration is derived
  in `durCat` rather than added to the extractors.
- [x] **M3 · The feat filters** (D172(d)) — shipped **v1.5.40**, **D182(a,b)**: Prerequisites
  is a three-way row (Eligible / Not yet / Can't verify) and Ability bonus a row of the six
  scores.
- [x] **M4 · The wording pass** — shipped **v1.5.40**, **D182(c,d)**: one name per thing across
  the table's filter card, the prepared list and the forms picker; Reprints and Marked are
  switches. Its rows are in `audits/copy-table.md` for the veto pass.
- Not in scope, with his agreement (D172(e)): species size / speed / traits / creature type —
  we extract none of it, and it would mean both extractors, cparity and a data refresh.



## Flags closed by 2026-09-05 (archived 2026-09-05) {#flags-closed-by-2026-09-05}

- [x] **🔶 Pick the filter surface** — **variant 1, the sectioned popover** (D173), with three
  fixes he attached to it, all shipped in v1.5.30. Phase M is unblocked.

- [x] **Prepared budget & picks grows with the pick count** (his note, 2026-09-05, D178(g)) → **D180, v1.5.38**: grouped by level, a big group one scrolling row. Was: a
  wizard with 40 book spells is 40 chips in the card. Options to bring: fold the chip run per
  class behind a count with a disclosure; group the chips by spell level as folded groups (the
  eligible list's own pattern); a one-line scrolling field under a mask (the D142(a)
  `.pickfield` pattern) with "show all"; or drop the chips from the card and mark picks in the
  eligible list only. 🔶 mockup + his pick. ⚑ (owner: Francesco, 2026-09-05)

- [x] **N1 before or after M3/M4?** → **N1 now** (his call, 2026-09-05); M3/M4 after. Phase N is decided (D176) and Phase M has two small tasks
  left. Either order is fine; N1 is L and touches the guide, the table and the print. ⚑
  (owner: Francesco, 2026-09-05)
- [x] **The class step needs the full-size picker the others have** (his note, 2026-09-02) —
  shipped **v1.5.26**, **D168**. The entity picker has a `class` kind (with the D148 class body
  in the preview pane), a change REWRITES the level's row in `state.levelOrder`, and a change
  that would empty a class arms first and says so once, in the bar. Two of his calls settled it:
  arm the destructive case, and never open a class picker with its step — the growth step's two
  big buttons (D126(d)) stay and the picker is the way out when neither is the answer. The
  `<select>` D126(d) put there is gone.
- [x] **Highlight the next choice in a section, and a new Next state** (his note) — shipped
  **v1.5.25**, **D167**. He took **A, the accent ring** (`guide11.html`), with hover REPLACING
  the mark rather than layering on it — the one thing the mockup had wrong. B (leading dot) and
  C (the rest recede) are rejected in D167(a). Next now walks the step's own sections before the
  level and names where it goes ("Next: spellbook spells").
- [x] **D125's clamp now covers the trade.** With the swap inside a step that also holds
  picks, a trade at L4 is clamped to L1 while the L1 picks are unfilled — it could not be
  when the trade was its own pick-free step. Only bites on a part-built character. Fix if it
  matters in use: carry the clicked section through `guideGo` and skip the clamp for a swap.
  ⚑ (owner: Francesco, 2026-08-31)
  → **D158(m): FIX in wave 3.**
- [x] **⚑ "The feature table should be collapsible and start out collapsed"** was read as the
  PROGRESSION table (D149(a)). If it meant the Features BLOCK, the default is one word to
  flip. ⚑ (owner: Francesco, 2026-09-01)
  → **D158(p): closed as read.**
- [x] **The `…`-placeholder family needs one call** (H6, left as scoped): "+ add a class…",
  "cantrip leaving…", "its replacement…", "filter books…", "note — e.g. …" — plus the
  same-shaped "no filter" options the audit had missed, `all schools` / `all classes`
  (index.html:139-140), `"any save"` / `"any damage"` (app.js:6383-6384) and `#fChosen`'s
  `picked` (index.html:135). They are internally consistent; one call settles all of them.
  ⚑ (owner: Francesco, 2026-08-30)
  → **D158(l): drop the ellipses, keep the verbs; the copy rewrite applies it.**
- [x] **`.gcstep.optional .gcl::after{content:" · optional"}`** (styles.css:1822) is the
  CSS-authored twin of the `"Optional"` capitalised at app.js:2042. Different surface
  (chain rail, appended mid-line after a middot) and H6's audit said no CSS work — but if
  the two should match, that is the line. ⚑ (owner: Francesco, 2026-08-30)
  → **D158(m): align with the card, wave 3.**
- [x] **`favKey` is per PRINTING, so a mark is stored under one edition** (I4): a mark lives
  under `Find Familiar|XPHB`; if `grantRec` later resolves the other printing (reprint
  filter `all`, or a book toggled) the mark is not seen. Deterministic under the default
  filter — every surface goes through `grantRec` — but making `sbFav` edition-tolerant is a
  storage-shape change. ⚑ (owner: Francesco, 2026-08-30)
  → **D158(m): make `sbFav` edition-tolerant, wave 3.**
- [x] **The guide's ability-score note has no home** (v1.4.5): removing the `?` before
  "Character view" (D141(b)) deleted its disclosure, and *"Ability scores aren't tracked, so
  ASI = skip the step"* is the one line in it with no remaining surface. Re-home it (the ASI
  step card is the natural place) or drop it. ⚑ (owner: Francesco, 2026-08-31)
  → **D158(c): re-homed by the ability-score decision entry (L5.8).**
- [x] **`.tlswapc` and `.tlalert` now differ in KIND** (D152): the trade state is still a
  translucent TINT, the alert state is an opaque plate. `.tlswapc` passes AA on its own, so
  aligning it would be a restyle rather than a fix — flagged only in case the mismatch reads
  wrong in use. ⚑ (owner: Francesco, 2026-09-01)


## Queue items closed by 2026-09-05 (archived 2026-09-05) {#queue-items-closed-by-2026-09-05}

(continuation of the trade-tile item) → **D158(m): restyle the trade tile to a plate, wave 3.**

- [x] **2024 pooling rounds half-casters up per class, and the app floors them** (found
  during the v1.4.3 fix, out of its scope): `compute()`/`planSlots()` lump `artificer` and
  `"1/2"` into one bucket and take `⌊half/2⌋`, but TCE Artificer and XPHB Paladin/Ranger
  round up PER CLASS when multiclassing — Artificer 5 / Wizard 5 should pool to caster
  level 8, the app says 7. Touches the pooled slot table only. ⚑ (owner: Francesco,
  2026-08-31)
  → **D158(b): all three round up per class; fixture one of L5.2.**
- [x] **Prerequisites we can't check**: ability scores, proficiencies, backgrounds and
  campaigns aren't in the app's model, so those alternatives read "check …" rather than
  pass/fail. Closing this means tracking ability scores — a bigger change than it looks.
  ⚑ (owner: Francesco, 2026-08-26)
- [x] **Polymorph / Shapechange / True Polymorph as creature sets** — Francesco:
  "technically a spell with multiple stat block options, but perhaps it would require full
  monster catalogue". Correct: their filters are open-ended (any Beast of CR ≤ your level,
  any creature of CR ≤ …), which is the whole bestiary — 4,458 monsters. D78's carried set
  is 65. Out of scope until there is a reason to ship the catalogue; a CR-capped subset
  would still be hundreds. ⚑ (owner: Francesco, 2026-08-27)
  → **D158(o): archived as out of scope.**
  → **D158(c): folds into the ability-score decision entry (L5.8).**


## Changelog bodies — 1.0.0 → 1.4.14 (archived 2026-09-05) {#changelog-10-14}

| Version | (was) | Commit | What shipped |
|---|---|---|---|
| **1.4.14** | — | f7610cd | **D146 — a drop leaves an EMPTY SLOT; it does not close the gap.** Francesco: *"removing a spell moves all other spells out of place, resulting in a broken build"*. Reproduced exactly on a clean Sorcerer 5: dropping the L1 pick re-dated **five of the eight survivors** and produced **two illegal slots** (Scorching Ray, a 2nd-level spell, in an L2 slot; Fireball, 3rd-level, in an L4 slot), and the emptied slot opened at **L5** rather than L1. The ✕'s own tip promised *"Nothing else moves"*, which had never been true for any pick but the last one. **The cause is the model, not the guide**: a pick array's POSITION *is* the acquisition slot (D64 · D115(b,h)), so `toggle`'s `splice(i,1)` moved every later pick one slot earlier — the guided builder is only where it is VISIBLE, since the character view, the picker's ✓ and the bulk clears all share that writer. A drop now writes an `∅|` **empty slot** at that position: the slot still exists, it is simply unanswered. The sentinel is a STRING so the four pick arrays stay homogeneous (the exporter's `map(String)`, `includes`, `new Set` and JSON all keep working) and no content key can collide with it, and its tag carries what a position cannot say for itself — a feat's slot category, an optional feature's progression. **Containment is what kept this to ~30 sites rather than the 169 that touch a pick array**: raw arrays carry holes, every VIEW strips them (`sliceChosen`, `featsAt`, `optFeatsAt`), so nothing downstream of `R.cart` or a sliced reader ever meets one — never known, never prepared, never printed, never counted as spent; the ACQUISITION WALKS consume them, which is the entire mechanism; and a **trailing** hole is not a slot, so dropping the LAST pick still shrinks the array. A take answers a standing slot before it appends (`holeFor`), earliest first — **but never a slot the pick could not legally have been learned in**, since filling an L1 slot with a 3rd-level spell would manufacture the very illegal slot the chain flags; those land over-budget instead, where the sweep says so. Scope is **everywhere picks are level-mapped** (Francesco's call): spells, cantrips, feats and optional features, across the guide, the character view, the timeline's drag-to-level, `clearLevel`, the pick-modal clear, the fork and the exporter. `prep` is excluded by construction — a daily subset has no acquisition order and therefore no slots. New UI: the guide draws the empty slot as a dashed chip that opens its own section's picker. **Verified**: same Sorcerer 5, same drop — 0 picks re-dated, 0 illegal slots, the open slot at L1 where it was emptied, and filling it put the new spell back in position 0 with nothing else touched; feats keep their levels (dropping the L8 feat left L12/L16 alone and the next take refilled L8); the wizard's book holds slots while `prep` does not; save, export/import and the fork all round-trip a hole; the timeline draws its ghost at the emptied level; 0 sentinel leaks in the rendered DOM. The empty-slot chip measured symmetric (0.00px both axes) at 1280 and 375, same 24px height as a real chip, text at 6.55:1 light / 6.36:1 dark and its border at 3.63:1 / 4.54:1. |
| **1.4.13** | — | ef35af1 | Handoff: STATE's block restamped in place at **v1.4.12 / `1bd4f5a`** — phase J (Francesco's 18-item notes batch) shipped in full as D142–D145, the Manual-for-Francesco list re-aggregated, and the one flag this session CREATED called out rather than buried (D125's clamp now covers the trade, from J6). PLAN reconciled: the header no longer reads E–I, phase J joins the shipped-phases table, and its four section status lines now match their ticked boxes — the single remaining unticked line in J is that clamp flag, under its own heading. **GOTCHAS gains six traps this session paid for**: the `refreshAll()`-staleness class on its THIRD occurrence; `el("input")` setting no `type` ATTRIBUTE so `input[type=text]` misses it, plus its two neighbours (`.cfield.c-full` needing both classes, `accent-color` only applying when checked); a `:has()` rule outranking the state rule that hides something; flexbox breaking lines on an item's flex BASE size rather than after shrinking; `.spmodal` being the full-screen scrim rather than a box; and contrast auditing needing one theme per pass after a real frame, since flipping in one block invents phantom failures. CLAUDE.md's decision range → D7–D145. A rename note was retired UNAPPLIED with its reason recorded, so it is not retried a third time. No app code. |
| **1.4.12** | — | 949bc08 | **D145 — the light theme is solved, not picked, and "too flat" turned out to be the same measurement as "not accessible".** **(a)** Every ink colour is now DERIVED: darkened along its own hue until it clears 4.7:1 against every surface it can land on (`--bg`, `--panel`, `--panel-2`) **and** against its own soft wash over each — which is exactly where the old palette failed quietly. `--gold` measured **3.37:1** on panel-2 and 3.55:1 on its own wash; `--muted` **4.07:1**. `--ink` already passed at 10.8:1 and did not move, and `--accent` moved one step, keeping Ember. The ability tokens were solved to 5.3:1 in BOTH themes, needing the extra headroom because D142(b) made the three-letter chip a control's only label. **(b)** "Flat" was the border contrast: `--line` sat at **1.25:1** against the page and `--line-strong` — the visual boundary of every input, button and chip, which WCAG 1.4.11 wants at 3:1 — at **1.79:1**. They are 2.2:1 and 3.0:1 now, with a three-layer shadow. Depth comes from the borders and the shadow, never from darkening the paper: a first attempt deepened `--bg` and `--panel-2` and measured WORSE, because every point of surface separation is paid straight out of the text contrast on that surface. **(c)** A decorative `opacity` on a text container is a contrast cut no palette can repair — `.lvltools` at `opacity:.6` put its label at **2.68:1** and `.fldnote` at `.8` at 4.08:1. Both dropped in favour of colour, and the unselected ability tile's veil went 0.6 → 0.85. **Result: 0 failures across 698 rendered text nodes in BOTH themes** (AA: 4.5:1 normal, 3:1 large), measured against each element's real composited background including translucent layers and inherited opacity. Print is untouched by construction — its block restates the whole palette rather than inheriting it. Method note logged for next time: flipping `data-theme` and measuring in the same synchronous block reads STALE styles and invented ~150 phantom failures at 1.3:1. |
| **1.4.11** | — | 7d69272 | **D144 — the menu groups by what it acts on, and the custom builder stops looking like a different app.** **(a) J10** the ⋯ menu is three groups: this character (Builds, Guided builder, Random character, Print), then a headed **CONTENT** group (Library, Refresh, Custom spell, My homebrew), then Toggle theme, then Reset build. Only CONTENT is labelled — the first group needs no header since the menu is opened from the build it acts on. Print moved INTO the character group; "Custom spell…" and "My homebrew…" moved OUT of it, because sitting among build actions they read as things you do to the character rather than to your library. The header's own alignment measured symmetric (6/6). The header's guided-builder button also swapped `spark` for `compass`: as a bare unlabelled icon the four-pointed star read as "+", i.e. add, and `compass` is already what the timeline's "Guide from here" uses for the same destination. **(b) J11** the builder's fields were never styled and the cause is one selector: `el("input")` sets no `type` ATTRIBUTE, and `input[type=text]` does not match an input that merely behaves as text — so every text field fell through to the browser's own 2px inset border and square corners at **22px, beside 34px selects**. Fixed by adding `input:not([type])` to the base rule rather than at each call site, so forgetting the attribute again cannot bring it back; inputs and selects now measure identically (34px, 8px radius, 1px border). Two more of the same shape found in passing: `.cfield.c-full` required BOTH classes, so `.cchips.c-full` (the class list) and the new template row stayed half-width — it is `.cgrid>.c-full` now, and all three measured spanning the full 722px grid; and a native checkbox only takes `accent-color` when CHECKED, leaving unchecked ones as the browser's light box, so checkboxes are rebuilt on the app's own tokens **app-wide** (34 of them, still real checkboxes — focus, keyboard and label association untouched). **(c) J11** a custom spell can start from an existing one: a search row at the top of step 1, on a NEW spell only, filling the form through the same `customFromSpell()` the homebrew Edit path uses. Verified filling every field from Delayed Blast Fireball (level, school, time, range, concentration, all three components, save, damage, 975 chars of description, 2 classes) with the name suffixed "(copy)" and nothing written to storage until "Compile & add". |
| **1.4.10** | — | 6f71c55 | **D143 — the guided builder asks about a level-up once, in its own words.** **(a) J6** the level-up trade is a SECTION of that level's spellcasting step now, not a step of its own: the `swap~<lv>~<kind>` steps are gone and their sections join `cast~<row>~<lv>`, sorted LAST via a new band in the section sort, so you take what the level grants before deciding what to give up. Nine steps folded away in the test build, 0 standalone swap steps left, section ids became `swap-<kind>` because two swaps can now share a step and `guideSecKey` is `step#id`. D128's model is untouched — per KIND, written and read through `swapAt`/`clearSwap` — and a level that grants nothing new but still allows a trade keeps the step for the trade alone. Known consequence, deliberately not worked around and logged in D143(a): D125's clamp now covers the trade, so on a PART-BUILT character a trade at L4 is clamped to L1 while the L1 picks are unfilled. **(b) J7** fourteen guide strings lose their em dashes — where the dash joined two clauses the sentence splits, where it separated a label from a status it becomes a comma; `"—"` as an empty-value GLYPH stays, being a symbol rather than punctuation. Verified 0 em dashes left in the rendered guide view. The "pointless note" is the chain rail's section label where a single-section card's label repeats its own head: the growth card read "next level" and then "NEXT LEVEL" directly beneath it. Suppressed for that shape only — a multi-section card still keeps every label (13 of them on L1, verified). Scope is the guide's own copy; the rest of the app was not swept. |
| **1.4.9** | — | b4944d3 | **The eligible list gets a ceiling, the header slot goes to the guided builder, and the timeline's arrow stops moving when you use it.** **D142(e)** — `#spellList` is capped at 55vh and scrolls inside itself with the level headers sticky, so the page's height is a function of the build rather than of however many spells are eligible. Two-column layout ONLY (`min-width:921px`): below that the columns stack and the card is the whole screen, where a nested scroller fights the page scroll under a thumb. Print is untouched by construction — `#secSpells` is hidden outright there. **J8** — the header's 🎲 slot becomes the guided builder (`#guideTopBtn`), and **Random character** moves into the ⋯ menu beside "Guided builder…" and stops being stripped from the public build: it was `remove()`d there as a local testing tool, and it is a real feature of the page now. **J9** — the timeline's order arrow and its "from L…" note move from a sticky strip at the head of the column into the modal header, right-aligned. Two things had to be fixed to make that read right: the close button in that header also carries `margin-left:auto`, and two auto margins SPLIT the free space, which parked the strip in the middle of the header (pinned with id-specificity); and the host needed a `min-width`, because its right edge is fixed while the label changes width, so "from L12" → "from L1" dragged the very control you had just clicked. Measured 0px movement on flip, and 0px returning. The strip was previously placed at whichever end the walk started from (D141), so the control that inverts the order was the one thing changing places. |
| **1.4.8** | — | 57b3d32 | **D142 — Francesco's calls on the notes batch: masked chip fields, ability tiles, an icon for filters, and a creature that reads like a spell.** **J1** the choices row keeps ONE line and the chip run is masked behind its button (his call, over the two stacked layouts I mocked): `.picks` became `.pickfield`, a horizontal scroller under a right-edge gradient — the `.tlchips` pattern D124 already shipped, trailing-gap rule included — and the button is now its SIBLING at `flex:0 0 auto`, icon-only once the count is met (the `have/count` counter beside the question already carries the number). Measured before: a four-chip run was 574px inside a 374px card, **228px past the edge**, because `flex:0 0 auto` around wrapping chips sets the width to max-content so `flex-wrap` can never fire. Two second-order bugs found while building it: the row wrapped before it shrank (flexbox breaks lines on an item's flex BASE size, so the field took the button to its own line — fixed with an explicit `.pickrow{flex-wrap:nowrap}`, NOT another `:has()`), and the description then absorbed its proportional share of a 500px overflow and stacked 179px tall (fixed with a `min-width` floor). Row height is now constant at 58px with one chip or five. **J2** casting ability is a tile row, chip only, each in its own `--ab-*` key colour — no new palette, and the selected tile is the only coloured thing in the card. **J3** the filters control is the new funnel icon everywhere (`#filterBtn`, `#entMenuBtn` which was wearing the generic `dots`, `#pickLevelBtn` which said "Levels"), `activeFilterCount()`'s badge is gone, and what is SET is named instead: `activeFilterChips()` renders one chip per active filter in a masked row with a clear-all at the right, hidden entirely when nothing is filtered. No second "filters are set" state on the button — the row below is the honest indicator. **J4** the familiar picker gains the search + filter bar every other picker has (book toggles built from the whole set so turning one off can't remove its own toggle, plus only-marked), *"Find Familiar's own forms"* became **Other familiars**, and a stat block is now reached the way a spell is — hover the name for a tip, click for a dedicated modal — rather than through the preview pane I had mocked and recommended. The modal borrows SPMODAL itself, which is why the `.spmodal`-scoped `.sb*` rules needed no widening. Only the NAME is the link; the row still toggles the mark, verified unchanged. **Plus a v1.4.5 regression, found while triaging his note that the Chain/Decision button appears on desktop doing nothing:** `.btn:has(>.lbl-ico){display:inline-flex}` — the `.lbl-ico` baseline-centring fix — is 0-2-0 and outranked `.gh-toggle{display:none}` at 0-1-0, and `renderGuide()` wraps that button's label in a `.lbl-ico` span, so the phone-only toggle showed at every width. Both rules raised to `.btn.gh-toggle`; verified `none` at 1280 and `flex` at 375. Alignment measured on every new element at 1280 and 375: no horizontal asymmetry above 0.5px across 11 elements, the three filter buttons identical at 41×34 with the icon at 13/13 and 9.5/9.5, and the residual vertical deltas (0.25–0.5px) are at or below the existing accepted `.bchip`/`.cartchip` baseline — font metrics, not padding. |
| **1.4.7** | — | 6ae3194 | **The epic-boon row follows the level plan.** `refreshAddFeat()` toggles `#epicRow` on `featBudget().epic` — a function of the level plan (D114) plus any granted slot (D135) — but ran only inside `refreshAll()`, while the class row's own handlers (level stepper, swap class, subclass, remove), `#addClass` and a feat chip's ✕ call `render()` alone. Reproduced from a fresh load in BOTH directions: a Warlock stepped 18 → 19 held `epic:1` with the row still `hidden` (the boon picker never offered), and stepped 19 → 18 left the row on screen with `epic:0` (a picker for a slot the build does not have). The toggle joins the render pass beside `renderOptFeats()` — the same v1.4.2 fix and the same reason it is safe there: the row holds no `<select>`, `<input>` or disclosure to lose under the user's fingers, and `#epicCnt` inside it has always been render-driven. Verified across the level stepper, class remove and `#addClass`; the third sibling of the defect fixed in v1.2.29 and v1.4.2. |
| **1.4.6** | — | 7447bd9 | `/clean` + handoff: the live doc set drops a quarter, nothing deleted. Consumed phase bodies, the wave batch, the 1.2.x changelog narrative and 43 settled decision bodies moved to `ARCHIVE.md`, every one leaving a stub and every *Rejected:* clause kept in place (304 KB → 227 KB). *(Row added in v1.4.7 — the release shipped without one.)* |
| **1.4.5** | — | 02f51fd | **D141 — the arrow orders the columns; one timeline state; measured centering.** The direction arrow now inverts the level column's *display* order on BOTH surfaces — the chain rail follows the walk (its starting end on top, `asc=!guideWalkDown()`) and the timeline gets its own arrow strip (`tlOrderStrip`, `TL.asc`, display-only and never saved). D132's rule holds: display inverts, computation never does; `levelColumn(plan,box,multi,asc)` is the one owner and `top()` split into `head()` (visual top, both orders) and `growth()` (add-row + growth ghost, head desc / foot asc). G1's acceptance test re-proven in BOTH orders on both surfaces — the same drag yields the identical plan, the D122 no-op guard refuses identically. The `?` before "Character view" is gone with its disclosure (one orphaned line queued in PLAN). Centering audit, measured text-rect vs container-rect at 1280 and 375 across every chip/tile/badge: `#clvlChip`'s +3.0px came from `.count.prevon` padding left behind by the retired D54 scrubber (dead `.pvb`/`.pvo`/`.pvx` removed with it); `.btn` holding a `.lbl-ico` span sat 2.38px high on the baseline strut, fixed with `:has()` flex centering; deliberate optical offsets (`.cartchip`'s × padding) measured, documented and kept. The timeline's separate pin state is gone — clicking a row IS the current state (`#tlPin`, the `tlpin` bookmark and `.zpin` removed, `.here` the single treatment). The pact tile drops its 10px override for the shared tile type. |
| **1.4.4** | — | bab48bd | **The refresh carries you to the remedy, and the stamps survive `filterDigest`.** A refresh that ends with books the linked folder could not provide no longer stops at the caveat: the notice names them and carries an **Open Library** action, and Manage marks exactly which files to drop (`#importMissNote` + `.miss` rows, from `refreshMissed()` = `spellForge.refreshMiss.v1` ∩ `staleBooks()`), so re-adding + Apply clears it by construction. The boot notice routes the same way and DROPS "Refresh now" when every stale book is one refreshing cannot heal. D129's four ask-cases and both false-success guards intact. Real bug found en route: `filterDigest` rebuilt `out.sources` and silently dropped D138's per-source `parser`/`parsedAt`, so every book not re-parsed fell back to the digest-wide stamp `applyPlan` had just set current — D138(a)'s false success re-opened through a different hole. |
| **1.4.3** | — | 74523a1 | **D68's own-class clock rounds UP — third-casters and 2014 half-casters.** `ecl()` became `eclOwn()`: a class's OWN max spell level follows its own printed table (`1/3`: 2nd at 7, 3rd at 13, 4th at 19; `1/2`: 2nd at 5, one tier up at every odd gain), while multiclass slot POOLING keeps flooring — the two clocks D68 named, finally on two variables. Verified byte-identical pooling before/after (Wizard 5 / AT 7 → `[4,3,3,1]`). The audit widened it twice: 2014 PHB Paladin/Ranger read max 1st at level 5 where the mirror says 2nd (XPHB ones were already tagged `artificer`-progression), and a lone third-caster's own slot strip now matches its printed row (AT 7 = `1st×4 \| 2nd×2`, was `1st×3` — a max of 2nd with no 2nd-level slot). `maxLvlAt` prefers the class's real extracted slot row when present, formula fallback otherwise; no new extractor surface. Queued, not fixed: 2024 pooling should round `artificer`/XPHB half-casters up per class. |
| **1.4.2** | — | 45d62ca | **D135's granted origin slot arrives WITH its giver, not at level 1.** Lessons of the First Ones — the only `featSlots` carrier in the corpus — scheduled its granted Origin slot at character level 1 everywhere, and `grantedFeatSlots()` read the PREVIEW slice, so the cap shrank below the invocation's arrival: `buildHealth()` (which must never see PREVIEW, D115(f)) flagged the feat as an origin pick with no slot left AT LEVEL 1, and the guided chain's second origin step vanished mid-walk because `guideGo()` previews each step's level. Both were one cause. `grantedFeatSlots()` is full-plan now and each `from` carries the level its giver arrives at; new `originSlotLevels()` is the single owner of origin-slot arrival levels; origin spends fill them earliest-first; `guideSteps()` emits one origin step per slot at the slot's own level; the budget card counts a granted slot only once its giver has arrived. Timeline places the feat beside the invocation. |
| **1.4.1** | — | d3719a1 | Handoff: STATE rewritten around **the bug that is still open** — Great Old One's Hex and Lessons of the First Ones are still wrong on Francesco's browser and right on the agent's, and v1.3.2/v1.3.3/v1.4.0 each fixed a different real thing without any of them being confirmed as the cause. The block now separates what is VERIFIED (both extractors emit the right records — asserted directly by the new `scratchpad/jsimport.js`, not only through parity; the app renders them when DATA carries them; a stale digest reproduces every symptom and a current one clears them; saved builds are byte-identical across the swap) from what is UNKNOWN (everything about his browser), and maps each possible reading of a five-value diagnostic to a different place to look — only one branch is a new bug. PLAN gains that as its only live item, blocked on the reading rather than on work. **D139** logs the method rule; GOTCHAS gains why the agent's pane cannot reproduce an import bug by default. No app code. |
| **1.4.0** | — | d261ea9 | **D138 — the parser stamp goes per book, and everything moves in one file.** ① **The bug under D137**: a refresh re-reads only the books your FOLDER holds (the rest "keep their stored data" — D129 says so in its own caveat), but `applyPlan` stamped `meta.parser` on the whole digest anyway. A refresh that re-read 2 of 43 books claimed all 43 were current, so D137's notice went quiet and the data stayed wrong with nothing left saying why — the D129 false-success shape one level down, and the likely reason "it works in the Claude browser" (no import, so baked data) and not in a browser with a library. Every source carries its own `parser`/`parsedAt` now, set only for books that actually came through the parser; the notice counts and names them ("41 of your 43 imported books (…) were read by an older parser"). ② The stamp is a **visible line** in the Library's Manage tab instead of a hover title on the Refresh button — quiet when current, gold when a book is behind. ③ **Export all…** writes one `my-spellbook-YYYY-MM-DD.spellbook-backup.json` carrying every build **and the homebrew spells they reference** — the part a per-build export cannot carry, since authored spells live in a global store, so a build moved alone arrives with a dangling key for each one. The existing import box takes either file kind, told apart by `kind`. Additive always: it adds beside what is there, never replaces or removes, and a homebrew spell already present wins. The imported 5etools library is deliberately not in the file — content, not character, and 2.5 MB. |
| **1.3.3** | — | 0b444e1 | **D137(d) — the published build says when a newer one has downloaded.** The service worker is stale-while-revalidate by design, so a deploy is exactly one reload behind: reload once and you are still on the old page while the new one caches, reload again and you have it. That trade is deliberate (the alternative is a 1.4 MB blocking download every open) but it was SILENT, which is the same shape as the parser stamp — the app knew and said nothing, so "I reloaded and nothing changed" was the only way to find out. `controllerchange` fires exactly when a newer build has taken over (the worker calls `skipWaiting()`+`claim()`), and now raises "A newer version of the app has downloaded. Reload to use it." with a Reload button; the first install is not an update and stays silent. Verified at the handler only — service-worker registration fails inside the browser pane, so the lifecycle on Pages is reasoned, not exercised, and that limitation is now in GOTCHAS along with the two-layer diagnosis (footer version, then `IMPORTED.meta.parser`). |
| **1.3.2** | — | 1972d53 | **D137 — the app says when its data is older than its parser.** Francesco, on the v1.3.1 build: "the version is updated (and loaded in browser), but I still see at will for hex and lessons of the first ones doesn't grant extra feat slot". Not a regression — reproduced exactly by handing a v1.2.41-stamped digest to the v1.3.1 app, and cleared exactly by handing it a current one. `assembleData` is `IMPORTED \|\| BAKED`: an imported digest replaces the bundled one WHOLE, so an extractor fix is invisible until the books are re-read, even for records the bundle already carries — which is why D136's merged row landed (app code) while its Hex and Synaptic Static halves did not (data). Four rounds of "this is still wrong" have now had that one cause, and the app has known the answer since D111 stamped `meta.parser` on every import: nothing read it. `staleParserNotice()` now compares the stamp with `__VERSION__` at boot through a numeric `verLt` (a string compare reads 1.2.9 as newer than 1.2.41) and says so, carrying the notice bar's first ACTION button — "Refresh now", wired to the same inline refresh the ⋯ menu uses. The × means "not now"; both stamp the version, so it speaks once per release. A pre-D111 digest has no stamp and counts as stale; no import, or a current stamp, says nothing. Nothing is auto-refreshed: a refresh needs a folder permission gesture and can fail in four ways a human must fix. |
| **1.3.1** | — | 920fc55 | **D136 — three reads of the table that were wrong.** ① **Great Old One's Hex** read "at will": 5etools files Eldritch Hex under `innate`, but the feature says only "You always have the Hex spell prepared" and grants no free casting. An at-will innate whose own feature says always-prepared is rewritten to a prepared grant — narrow on purpose, and all three guards measured against the whole mirror: at-will only (a cadence is a real free-cast budget — Psi Warrior's daily Telekinesis stays innate), the feature must NAME the spell (Archfey's always-prepared table also names its innate Misty Step), and any free-casting clause vetoes it ("without *a* spell slot" is Psi Warrior's phrasing). One record matches. ② **Synaptic Static's Save column** read "Con/Int": `savingThrow` tags every save the text mentions, and that spell only *penalises* the target's later "Constitution saving throws to maintain Concentration". A save whose every mention is that one clause is dropped; everything else keeps 5etools' tag, because a spell really can force several (Prismatic Spray, Symbol, 2014 Sleet Storm all unchanged). Two records change. ③ **Two sources granting one spell are now one row.** It failed both ways: the always-prepared branch read `grants[0]` and silently dropped every later giver, while two innate grants made a row each. Granted rows merge on the spell, each giver keeping its own badge, tint and note; where cadences disagree the Uses cell names them all; a spell both always-prepared and innately granted takes the innate marker and says the other half in its tip. Picks stay their own rows — the marker and the prepare toggle belong to a class. |
| **1.3.0** | — | 76b12c0 | **D135 — invocations, and everything shaped like one.** Four independent holes, every one a 5etools field neither extractor read. ① **Designations**: Agonizing Blast, Repelling Blast and Eldritch Spear name a cantrip you already know, and 5etools carries the pool as a real filter tag inside the prose — `parse_marks` reads it, so a new grant kind `marks` becomes a first-class choice in the Choices card, the guided chain and both pick modals, and hangs its effect on the designated spell as a D79 note (modal and printed card). It never grants: the pool is *your own* list, and designating a cantrip you have NOT got takes it on the owning class's own schedule (Francesco: "a shortcut to pick", never a bonus). `filterSpells` grew `damage type` and `spell attack`. ② **Repeatable**: 5etools flags a repeatable feat but marks a repeatable optional feature only with a nested "Repeatable" entry — both are read now, and the nth take carries a `##n` identity so its grants, its choices and its feat slot are its own (8 records: 4 invocations, Magic Initiate, Elemental Adept, Skilled, ASI). The picker grows a "+ again" button beside the take button; copies carry an ordinal on their chip and their Choices group. ③ **One with Shadows' condition**: `_mod_note` only ever ran through the class-feature index, so a feat, an optional feature or a species — which carry their prose on the record itself — never got a note. Now 252, mined block by block so a trait's note can only reach the grant its own block names (flattening put the Aasimar's "Once you transform" on its Light cantrip). ④ **Lessons of the First Ones**: `featProgression` → `featSlots`, read from feats/optional features/species only, +1 on the Origin row with the giver named in its tooltip; `originSlots()` is now one owner for a cap three surfaces derived separately, so the guided chain grows the extra step too. Plus: a prerequisite that carries a `choose` filter is now VERIFIABLE ("a Warlock Cantrip That Deals Damage" reads ✓ against a build holding Eldritch Blast) and two bugs found in passing — `METAMAGIC_WHEN["Seeking Spell"]` tested a boolean as an array so that chip could never appear, and `EMPTY_GRANTS` was a shared literal handing every spell-less record the same mutable lists. |
| **1.2.41** | — | 107b6b2 | Handoff: STATE restamped at `4558952` (all five phases DONE, every gate passed, n… |
| **1.2.40** | — | 4558952 | D134 — the three gate questions, answered |
| **1.2.39** | — | dab9541 | All three gates, and their fixes (G4 + H5/I5 → D133) |
| **1.2.38** | — | cfd1e44 | Handoff: STATE restamped at `86a2a4d` (phases G, H and I all BUILT, three gates o… |
| **1.2.37** | — | 86a2a4d | I2 — the guide loses its prose, and both level columns invert (D131(c,d,e) + D132) |
| **1.2.36** | — | fcb55b2 | I4 — the familiar chooser, and the edition mismatch under it (D131(g)) |
| **1.2.35** | — | 730e030 | I1 — one picker per section, and a footer button that advances (D131(a,b)) |
| **1.2.34** | — | 68cfd97 | I3 — the drawer slides fully off-canvas, and the rail's grip lines up (D131(f,h)) |
| **1.2.33** | — | 1d8ce7f | D131 and D132 decided |
| **1.2.32** | — | 438e6d2 | Handoff: STATE restamped at `c72dd4f` (phase H BUILT, H5 the only open task in it… |
| **1.2.31** | — | c72dd4f | H4 — the character view is a drawer (D130(e)) |
| **1.2.30** | — | 2f3e1ac | H6 — one display capitaliser, and the strings that read lowercase beside capitali… |
| **1.2.29** | — | 87e32ca | Two queued bugs |
| **1.2.28** | — | a617b12 | H3 — the guided builder's v2 surfaces (D130(a–d)) |
| **1.2.27** | — | e542e35 | H1 + H2 — guide navigation, and subclass spell lists |
| **1.2.26** | — | 25c9b1a | G3 — phase G's build completes |
| **1.2.25** | — | fe93cf4 | G2 — the decision stage |
| **1.2.24** | — | b49cb40 | G1 — the guided builder becomes a full-size page (D126 shell) |
| **1.2.23** | — | f3fe566 | W5/D129 — Refresh with feedback |
| **1.2.22** | — | f96cc3a | W4 — the timeline batch, 11 items |
| **1.2.21** | — | c543b8e | D127 built — edition identity |
| **1.2.20** | — | 45074f2 | W1 — general UI batch |
| **1.2.19** | — | 9f0e350 | W2/D128 — swaps are per kind |
| **1.2.18** | — | de91ea4 | Design batch from Francesco's notes |
| **1.2.17** | — | 027ec78 | F4 — the phase F fresh-eyes gate: PASSED; phase F is DONE |
| **1.2.16** | — | 27ba3e4 | Handoff: STATE stamped at `dd31abb` (phase E done, phase F built, F4 the only ope… |
| **1.2.15** | — | dd31abb | D124(c,d) closed |
| **1.2.14** | — | 0066ff9 | D124(a,b) — timeline separation + pick counts |
| **1.2.13** | — | b50d44c | F3 — guided entry points + reverse reconstruct |
| **1.2.12** | — | 606e7e2 | F2 — the coach rail |
| **1.2.11** | — | e130fe8 | F1 — step-list derivation |
| **1.2.10** | — | 339720a | E8 — the fresh-eyes gate: PHASE E PASSED |
| **1.2.9** | — | b5f1fea | Handoff: STATE stamped at `d55f8cf` (phase E built, E8 the only open task), docs… |
| **1.2.8** | — | d55f8cf | E3 closed, E6, E7, D119 |
| **1.2.7** | — | 4bd1849 | E5 — the timeline popover |
| **1.2.6** | — | e0f56ea | E4 — the consistency sweep + build-health badge |
| **1.2.5** | — | a54a2ea | E2 — slice derivation |
| **1.2.4** | — | d9e4824 | E1 — the order substrate |
| **1.2.3** | — | 902e44c | Handoff: STATE stamped at 41494c0, docs aligned to D115–D117 |
| **1.2.2** | — | 41494c0 | The audit batch |
| **1.2.1** | 1.8 | d14ac89 | Handoff: STATE stamped, docs aligned to D115 |
| **1.2.0** | 1.7 | 65aa06d | Epic boons |
| **1.1.3** | 1.6 | d8db42a | `CLAUDE.md` dev-server note matches the attach-mode launch config (the preview sandbox cannot spawn `serve.py`). |
| **1.1.2** | 1.5 | 0b52f16 | The ⋯ Refresh actually refreshes: await the folder recall inside the click, so the first click of a session no longer falls through to "choose the folder". |
| **1.1.1** | 1.4 | 3cb4ede | Handoff: STATE stamped, docs aligned to D113. |
| **1.1.0** | 1.3 | 99e883f | **The Library** (D110–D113): import + Sources merged into one two-tab modal; universal drop zone (zip / files / dragged folder); one three-state book list with one Apply; parse on arrival; Refresh imported data (one click, summary + parser stamp); edition-first source groups with search. |
| **1.0.2** | 1.2 | d9a233f | Stat-block tag strip on every free-text field (the Imp's `{@variantrule}`); folder scan backfills book names from books.json; folder import carries the lookup, books.json and bestiary files, in readOrder. |
| **1.0.1** | 1.1 | e9d4886 | `/clean`: the doc set split (STATE → CLAUDE/PLAN/DECISIONS/GOTCHAS/CHANGELOG/ARCHIVE). |
| **1.0.0** | 1.0 | 7523c81 | The app reports its own version. `VERSION` + `bump.py` + a footer tag; the numbering starts here. |

