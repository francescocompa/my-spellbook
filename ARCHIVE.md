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
