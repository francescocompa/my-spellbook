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
## v7 note batches 1–7 (2026-08-26 → 2026-08-27)

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
in STATE's Gotchas or in the one-line entry left behind under "Settled". Nothing here was
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

All v7 tasks are done. What remains for the project is the custom-sources design session and
the open backlog below.

### Non-goals
~~Level-up history/snapshots~~ — **superseded by D34/D35**: versions exist, but as *named copies*
the app never orders or interprets. A true level-by-level timeline (ordering rules, fork-on-edit)
stays out. Server sync or accounts. Sharing a build as a rendered page, or via a URL (D36).