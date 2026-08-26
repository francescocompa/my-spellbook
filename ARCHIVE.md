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
