# Feasibility — My Spellbook as a full character creator

> Point-in-time study, 2026-09-05, at v1.5.33. Answers Francesco's ask: *"plan feasibility to
> turn my-spellbook into a full character creator, what it would need, the specs of the
> project and all it entails."* Nothing here is decided; §7 names the one call that gates it.
> Inputs: this repo (`app.js` 11,165 lines, `data.json` shape, DECISIONS D115/D118/D157/D158,
> `audits/A-direction.md` A-06/A-09/A-27), the sibling `~/Documents/GitHub/character-forge`
> (PROJECT-SCOPE, CLAUDE.md, git log), and the 5etools mirror's file list.

## 1. Verdict in four lines

- **Technically feasible.** Every piece of data a creator needs is already in the 5etools
  mirror and the engine already does the hardest part (multiclass progression, acquisition
  order, per-level truth, grants). What is missing is *numbers* (scores, PB, HP, AC,
  proficiencies) and *stuff* (backgrounds, equipment, items), plus a sheet to show them on.
- **It is a rework, not a phase.** Size XL: roughly six phases of the E–M kind, a major
  version (D117: "overhauls only"), and a rewrite of the project's boundary sentence.
- **It collides with two standing decisions and one sibling.** D118(d) rejected "full
  character creator (a different app)"; CLAUDE.md's non-goals exclude scores and proficiency;
  character-forge *is* the character sheet, and its scope doc already assigns the sheet, the
  session layer and equipment to itself.
- **The real gate is not effort.** It is D158(a)'s unanswered question: *where does a
  character live once it leaves this app* — Notion, character-forge, or paper. Three
  directions follow from three answers (§6). Recommendation: **B**, the planner becomes the
  ecosystem's compiler and grows scores first; "full creator" becomes a ladder of gated
  boundary moves rather than one decision.

## 2. What "full character creator" means, and what already exists

A creator, at the level Francesco's paper sheets and the Notion Character Sheet DB use it:

| Piece | Status today | Where it would live |
|---|---|---|
| Class / subclass / level plan, multiclass, order | **done** (D115, D168) | engine |
| Species + lineage, feats (origin/general/epic), optional features | **done** (D84, D135) | engine |
| Spells: known/prepared/granted, slots, swaps, per-level truth | **done** (the whole app) | engine |
| Guided walk, versions of a build, export/import, print | **done** (D118–D173, D35, D98) | UI |
| Ability scores + proficiency bonus | **not modelled** (non-goal; A-06 costed, D158(c) says "decision entry first") | engine + state |
| Background as an entity (2024: +2/+1, origin feat, 2 skills, tool, equipment) | **not modelled** (A-27 struck as D118(d) non-goal); only the origin feat *slot* exists | extractors + engine |
| Saving throws, skills, tools, languages, armour/weapon proficiencies, with multiclass rules | **absent**; class `traits` already carries hd, saves, skill choices (see `data.json` classes) | extractors (partly done) + engine |
| Hit points and hit dice per class | absent | engine |
| AC: armour, shield, unarmoured defence per class | absent | extractors (items-base) + engine |
| Equipment, starting gear, currency, magic items, attunement | absent (D55 rejected items for v1; A-07 is prefill only) | extractors + state + UI |
| Class feature *text* on a sheet | digest carries `features`; the detail modal shows them (D147) | UI |
| A character sheet view / print | absent; print is the spell table (D98) | UI + print |
| Companions, conditions tracking, rests | absent, and character-forge's by design (A-21) | out |

So of thirteen pieces, five are done, one is half-done in the data, and seven are new. The new
seven are the ones that turn a planner into a sheet.

## 3. What it would need — the specs

### 3.1 Data (both extractors, `cparity.js` proves it)

New inputs from the mirror, all present at `~/Documents/D&D/5etool_mirror/…/data`:

- `backgrounds.json` (694 KB) → `backgrounds[]`: name, source, ability (2024 `ability[]`
  choose-shape), feat grant (`feats[]`), skill/tool/language proficiencies (`skillProficiencies`,
  `toolProficiencies`, `languageProficiencies`, each a choose-shape), starting equipment.
  2014 backgrounds have no ability bonus and a "feature" instead of a feat: the edition split
  the app already makes (D19 reprints, the Editions filter) applies.
- `races.json`: the 2014 `ability[]` block (the app drops it today; 2024 species carry none).
- `class/*.json`: `startingProficiencies`, `multiclassing.proficienciesGained`,
  `startingEquipment`, `hd` — most is already read into `traits`; the multiclass block and
  equipment are not.
- `items-base.json` (184 KB) → armour and weapons only: AC, dex cap, strength req, stealth
  disadvantage, weapon properties and mastery. `items.json` (2.8 MB) stays out except through
  A-07's custom-source prefill; the D55/A-07 variant cross-product warning stands.
- `skills.json`, `languages.json`: small lookups.
- The **third hand-authored table** of the kind GOTCHAS names: unarmoured-defence formulas
  (Barbarian, Monk, Draconic Sorcerer, Lizardfolk…), because 5etools states them in prose.

Digest growth: an estimated 300–500 KB on 4.0 MB. The SRD 5.2 subset covers backgrounds,
armour and weapons, so the Pages build loses nothing.

### 3.2 Model (storage v8, `serializeState` additive)

- `abilities` base six + `originBonus` map + per-feat `choices` entries for ASI/+1 feats
  (A-06 as costed; the `##n` suffix from D135 keeps repeated ASIs distinct).
- `backgroundKey`, plus its choices (skills, tool, language, which score gets the +2).
- `profs` derived, never stored: saves from the *first* class, skills from first class + all
  multiclass grants + background + species + feats, with the "choose N" shapes as `choices`.
- `hp`: per-level entries derived from the acquisition order (class at that level → hit die)
  with a fixed/rolled switch; CON modifier is retroactive across all levels, which the slice
  model handles by re-deriving rather than storing.
- `gear`: worn armour, shield, weapons, with `equipped` — the first free-text-ish state after
  D94's notes; export stays additive.
- The builds model (v7, D33–D35) stays: versions remain alternatives, never levels (D115).

### 3.3 Engine

- Scores at level L = base + origin + ASI choices at or below L (D115(b,h) slice).
- PB from character level; DC and attack per casting source; custom-source DC defaults to
  "yours" (`cs.dc`).
- Prerequisite `checks` for scores resolve to pass/fail; D31's advisory rule survives for
  campaign/DM conditions.
- Proficiency resolution with 2024 multiclass rules (first-class saves, limited skill grants,
  armour and weapon grants by class) and the 2014 variants behind the Editions filter.
- HP, AC (armour table + unarmoured-defence table + shield), initiative, passive perception,
  speed from species. Nothing else derived: no attacks, no damage rows, no conditions.
- `engine.test.js` grows a fixture per rule: scores slice, PB, HP at a multiclass change,
  AC with unarmoured defence, first-class saves. The fixture-8 carry-forward rule applies to
  every new per-book field.

### 3.4 UI

- Character card: a six-tile score row (the `--ab-*` tokens exist, D142(b)), a background
  row like the species row, a proficiencies block, an HP/AC strip.
- Guided builder: three new step kinds — scores (standard array / point buy / manual, then the
  origin +2/+1), background (picker with the entity-picker kind D168 introduced), gear
  (starting equipment choice; the 2024 "or 50 GP" shape). ASI steps gain "which score".
- Pickers: `background` and `item` kinds in the existing entity picker; the M-phase filter
  menu (D174) applies unchanged.
- A **sheet page**: identity strip, scores/saves/skills, HP/AC/PB, features by class, the
  spell table as it is. This is the surface that competes with character-forge outright.
- Print: a second print kind (D98 rejected "print whichever tab", not a second kind; A-10).

### 3.5 Docs and governance

- CLAUDE.md: "Ability scores and proficiency are not modelled" becomes a boundary list of
  what is; the "What this is not" section is rewritten; the one-line description of the app
  changes.
- DECISIONS: a decision entry per boundary move (scores, backgrounds, proficiencies/HP/AC,
  equipment, the sheet), each naming what stays out. D118(d) gets a **SUPERSEDED →** strike.
- VERSION: `--major` to 2.0.0 at the first phase that changes the stored shape, on his say-so
  (D140).
- character-forge's docs never mention My Spellbook and vice versa (A §4); whichever way this
  goes, both scope docs need one paragraph naming the boundary.

## 4. What it entails — cost, risk, drift

| Phase | Content | Size | Sessions (rough) |
|---|---|---|---|
| N0 | Decision entries: where a character lives; the boundary ladder; D118(d) superseded | S | interview only |
| N1 | Scores + PB (A-06) + ASI choices; DC/attack on table and print; prereq checks | L | 2–3 |
| N2 | Backgrounds as an entity (A-27), both extractors, picker, guide step, origin bonus | M | 1–2 |
| N3 | Proficiencies, HP, hit dice, AC, unarmoured-defence table; engine fixtures | L | 2–3 |
| N4 | Starting equipment, armour/weapons from items-base, gear state | M/L | 2 |
| N5 | The sheet page and the second print kind | L | 2–3 |
| N6 | Homebrew for the new kinds (custom background, custom item) via the K2 tray recipe | S–M | 1 |

Twelve to fifteen sessions at the current pace, against Phase M's remaining two tasks and
L5.5–L5.9 still queued. Every phase after N1 changes both extractors.

Risks, ranked:

1. **Sibling collision.** N5 duplicates character-forge's whole reason to exist. The scope doc
   there assigns the sheet, the session layer, equipment and companions to itself, and the
   audit already ruled live tracking "out by sibling ownership" (A-21). Two apps with one
   sheet each is the situation D118(d) was avoiding.
2. **The drift the audit predicted.** "Once scores exist the next request is saves and
   skills" (A-direction §3). This plan is that drift, written down. The mitigation is the
   ladder in §6: each rung has its own decision entry and its own stop line.
3. **`app.js` at 11k lines, one file by convention.** N1–N5 add an estimated 3–4k lines. The
   convention holds, but read cost per session grows; the DECISIONS diet (D158(q)) is overdue
   already.
4. **Rules surface.** Multiclass proficiencies, 2014 racial ASIs, unarmoured defence and the
   2024 background-bonus rules are all hand-tables. Each is a GOTCHAS entry waiting to happen,
   and each must exist twice (both extractors or neither).
5. **The non-goal on ability scores was load-bearing.** D31 keeps prerequisites advisory
   *because* scores were unknown; once known, "can't verify" collapses to pass/fail for scores
   only, and the UI has to keep the asymmetry legible.

## 5. Where character-forge stands (read 2026-09-05)

- Last commit 2026-08-25, "T28 post-T27 polish"; ten CSS/TSX files uncommitted since. React +
  TypeScript + Vite PWA, `npm run verify` green at 220 tests. T01–T28 done of a T22 plan plus
  extensions: the sheet renders, the session layer works, the pipeline is proven on Vice.
- Its model is **compile-time, no rules engine**: Claude turns a chassis doc into a
  self-contained character JSON with embedded rules extracts; the app renders and tracks play.
- Francesco on 2026-09-02: *"character-forge isn't in a good dev spot yet but ideally the
  ecosystem should be connected."*
- Its `spellcasting` schema (sources, slot pools, spells with origins, swaps) is a near
  one-to-one of what My Spellbook derives (A-09). Its `chassis` wants species, background,
  classes with subclass unlock levels, per-class hit die. Its `abilities` wants base and final
  with provenance. **Everything My Spellbook would add in N1–N3 is exactly what a chassis needs
  and what Claude currently computes by hand.**

## 6. Three directions

**A · The spellbook becomes the creator** (the ask, literally). N0–N6 above. One app does
planning and the sheet; character-forge is retired or shrinks to the at-table layer fed by
this app's export. *For:* one codebase he actually uses daily; the engine is already the hard
part; offline, no build step, vanilla. *Against:* XL, supersedes D118(d), duplicates a
working sibling, and the vanilla single-file shape strains at a sheet. *When right:* if the
answer to "where does a character live" is "in My Spellbook".

**B · The planner grows numbers and becomes the compiler** (recommended). N0–N3 only, in the
order D158(a) already set: A-03 level plan → A-06 scores → A-27 backgrounds → A-09 the
character-forge/Notion export. The "full creator" is the ecosystem: My Spellbook builds the
chassis (classes, species, background, feats, scores, spells, proficiencies), exports it in
the chassis/`spellcasting` shape, Claude compiles, character-forge renders and tracks. No
sheet page here, no equipment beyond what a chassis names. *For:* every rung is already an
audit item with a D-id; keeps D118(d) and the sibling boundary; stops at the point where
drift starts (N4/N5). *Against:* character-forge has to be brought back to a good spot for
the loop to close, and the pipeline still has a Claude step in it. *When right:* if the
answer is "Notion or character-forge".

**C · A third app that embeds the engine.** The D118(d) reading of "a different app": extract
the engine from `app.js` behind the headless shim D158(j) already opened, and build the
creator around it (possibly *as* character-forge's missing rules engine). *For:* clean
boundaries. *Against:* a refactor of an 11k-line file into a module nobody asked for, XL
before any feature lands, and character-forge's scope doc explicitly refused a rules engine.
*Not recommended now*; it becomes the right answer only if B lands and the Claude compile step
proves to be the bottleneck.

## 7. The one call that gates everything

Where does a character live once it leaves My Spellbook: **here** (→ A), **character-forge or
Notion** (→ B), or **paper** (→ B, export as text, A-03 first). The audit asked it, D158(a)
recorded the raw note without answering it, and every phase above forks on it. Second call,
only if A: whether to supersede D118(d) and accept a major version.

## 8. What stays out under every direction

Server sync, accounts, sharing by URL (D36), the full bestiary (D78), the authored timeline
(D115), live rest/slot/HP tracking and companions (character-forge's session layer, A-21),
dice, D&D Beyond import (A-23).
