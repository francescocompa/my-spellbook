# PLAN — My Spellbook

> What is queued, and what is blocked on a decision. `STATE.md` says where things stand;
> this says what comes next. Closed items → `ARCHIVE.md#closed-backlog`.
>
> **Phase M (the filter system, D172) is DONE** — M1a–M2 (v1.5.30, v1.5.31), **M3 and M4
> (v1.5.40, D182)**. **Phase N (the
> creator ladder, D176) opened 2026-09-05: N1 shipped (v1.5.34 → v1.5.39, D177–D181); N2
> onward each need a decision entry first.**
>
> **Phase L (the audit, D157) is TRIAGED — D158 holds every disposition.** Wave 3 (L4) shipped;
> the build list (L5) is under way — **L5.1 through L5.4 are done** and the guided builder's
> rework (L5.4) drew three rounds of his review, D161 → D166. Two of his notes are still open
> and sit as ⚑ below. Phases E–J are done. Below that is the standing backlog: open ⚑ flags
> (calls only Francesco can make) and the Queue, whose one 🔶 (magic items / rewards) is
> researched and awaits his call.

## Shipped phases — bodies archived, models still binding

The **model** for each phase lives in `DECISIONS.md` and still constrains any change to
these surfaces; cite the D-entry, don't restate it. The task bodies (done-when evidence,
merge notes) are archived.

| Phase | What it built | Model | Bodies |
|---|---|---|---|
| **E** | a build at every level | D115(a–j) | `ARCHIVE.md#phase-e` |
| **F** | the guided builder | D118(a–k) | `ARCHIVE.md#phase-f` |
| **G** | the guide as a full-size page | D126(a–i) | `ARCHIVE.md#phase-g` |
| **H** | guided builder v2 | D130(a–h) | `ARCHIVE.md#phase-h` |
| **I** | guided builder v3 | D131(a–h) + D132 | `ARCHIVE.md#phase-i` |
| **J** | Francesco's notes batch | D142 + D143 + D144 + D145 | `ARCHIVE.md#phase-j` |

→ archived 2026-08-31: the W1–W5 wave batch — `ARCHIVE.md#wave-batch`; the 2026-08-31 bug's
task lines — `ARCHIVE.md#bug-0831`; closed one-off bugs and batches (v1.3.0 → v1.4.3,
D135–D138 + the third-caster clock) — `ARCHIVE.md#closed-oneoffs-0831`.

Optional follow-up, never scoped: D76's Magical Secrets narrowing could report the EXACT
window for ordered picks instead of best-case.

→ archived 2026-09-01: Phase J body (J1–J4, J5, "Closed out of J3", J6–J10, J11–J12, all
eighteen items, models D142–D145) — `ARCHIVE.md#phase-j`; "Closed in v1.4.7"
(`refreshAddFeat()`'s `#epicRow` defect) — `ARCHIVE.md#closed-v1-4-7`; "Closed in v1.4.14"
(a drop re-dating every pick below it, D146) — `ARCHIVE.md#closed-v1-4-14`; "Closed in
v1.5.3" (the class ⊕ subclass merge, D150) — `ARCHIVE.md#closed-v1-5-3`.

## Phase K — the Library redesigned (D154, decided 2026-09-01) — ✅ K1–K4 DONE (v1.5.7 → v1.5.17)

One page, one list, selection bar, no refresh verbs (D154–D156, D159). K1 shell (v1.5.7), K2
tray (v1.5.8), K3 raw-stash + parser-fingerprint re-parse (v1.5.16), K4 old machinery retired
(v1.5.17, deadfns allowlist spent). Mockup `scratchpad/mockups/library4.html`.
→ archived 2026-09-05: K1–K4 task bodies and verification — `ARCHIVE.md#phase-k`

## Phase L — the three-pillar audit (D157, decided 2026-09-01) — ✅ L0–L4 DONE (v1.5.9 → v1.5.15) · ⏳ L5: **L5.1–L5.4 shipped** (v1.5.16 → v1.5.24), L5.5 on

D157 owns the charter, the agents, the rejected shapes; **D158 every disposition** — cite
them. Reports in `audits/` (one per pillar + `synthesis.md`), archived once L5 consumes them.

- [x] **L0 · Sweeps** — `scratchpad/sweeps/` (deadfns · deadcss · dupfns · storagekeys ·
  handlers · ids); deadfns + ids in the gate. `audits/L0-sweeps.md`.
- [x] **L1 · Wave 1 auditors** — six reports in `audits/` + `strings-inventory.md`.
- [x] **L2 · Wave 2 verifiers** — `V-A`, `V-B`, `V-C`; 2 C1 claims struck.
- [x] **L3 · Synthesis + triage** — `audits/synthesis.md` → **D158**.
- [x] **L4 · Wave 3, act** — v1.5.11 → v1.5.15: the "ships without a decision" list, D158(m)'s
  four flags, D158(e), D158(k); the copy table awaits his veto (⚑ below).
→ archived 2026-09-05: L0–L4 and L5.1–L5.4 bodies with their verification — `ARCHIVE.md#phase-l`

- [ ] **L5 · The build list** (D158(a) order):
  - [x] **L5.1 · K3** raw-stash + automatic re-parse — v1.5.16, **D159**.
  - [x] **L5.2 · Engine test scaffold** — v1.5.18, the gate's eighth line (D158(j)); shipped
    the pooling correction with it (D158(b): each half-caster ⌈level/2⌉, never one floored
    bucket). Fixture 8 guards the per-book stamp carry-forward.
  - [x] **L5.3 · First import merges onto the bundle** — v1.5.19, **D160** (merged at
    assembly, never stored).
  - [x] **L5.4 · Guide-stage rework** — v1.5.20 → v1.5.23, **D161, D162, D164, D165**: the
    stage is a picker surface, open by default, with the detail as a preview pane above
    1100px. Mobile mockup `guide6.html` kept for L5.6.
  - [ ] **L5.5 · Copy the build as a level plan** to the clipboard, in the Character Ideas shape
    (A-03; `levelGains`/`levelCasting`/`timelinePicks` already derive it). Size S, format his. 🔶
  - [ ] **L5.6 · PWA install check + a mobile pass on the Pages build** (D158(r); A-08). His
    action first, then measured fixes.
  - [ ] **L5.7 · Geometry full retrofit** (D158(g)), measured before/after, own release. Size L.
  - [x] **L5.8 · Ability scores + PB: the decision entry** (D158(c)) — **D176**, 2026-09-05; the
    build is **Phase N · N1** below.
  - [ ] **L5.9 · Magic items as custom-source prefill**, then rewards (D158(n)). Size M/L + M.
  - [ ] **L5.10 · Compare two versions** (A-05). Size M/L.
  - [x] **L5.11 · Doc diet** — the 2026-09-05 `/clean`: D115–D175 bodies to `ARCHIVE.md`, DECISIONS.md 3253 → ~1575 lines (D158(q)).
  - Also live, unscheduled (D158(o)): SHADOWED source-aware · `subclassFeature` `_copy` · long-rest
    swap detection · High Elf / Human origin · A-09 character-forge handoff · A-13 concept line ·
    A-14 homebrew recipe · A-15 mirror script.

## Phase M — the filter system (D172, decided 2026-09-02) — ✅ DONE (v1.5.30, v1.5.31, v1.5.40)

Every picker's filters to one standard: **D172 the set, D173 the surface (sectioned popover),
D174 the menu (groups open one at a time, empty means all), D182 the feat filters and the
wording.** M1a/M1b/M2 v1.5.30–31, M3/M4 v1.5.40. `python3 scratchpad/mkfilters.py`
regenerates the mockups; `filters1.html` was chosen.
- Not in scope, with his agreement (D172(e)): species size / speed / traits / creature type —
  we extract none of it, and it would mean both extractors, cparity and a data refresh.
→ archived 2026-09-05: M1a–M4 task bodies — `ARCHIVE.md#phase-m`

## Phase N — the character-creator ladder (D176, decided 2026-09-05) — 🔶 N1 is the only rung taken

The study is `audits/character-creator-feasibility.md`; **D176 owns the calls**: every
destination is valid (this app, character-forge/Notion, paper), the boundary moves one rung
at a time, and each rung after N1 needs its own decision entry. Order relative to Phase M was
his call: N1 first, then M3/M4 (settled 2026-09-05).

- [x] **N1 · Ability scores + proficiency bonus** (A-06 as costed, D176(b)) — shipped
  **v1.5.34**, 2026-09-05. **Verified** in the pane on a throwaway Wizard 4 / Paladin 1 (restored
  byte-identical after): Int 15 + origin +2 + ASI one tile → 19, two tiles → 18/14; at level 3
  the level-4 ASI is out of effect (17) and PB reads 2; `INT 13+` → ok, `CHA 15+` → no, `STR 13+`
  (blank) → ?; the tracker printed `+7 / 15` and `+5 / 13`; the table's Ability cell `DC 15 · +7`;
  the guide's ASI step carries "Ability score increase · +1 Int, +1 Cha"; every tile child centred
  to 0.00px at 1280 and 375, 0 overflow; cycler on-state 2.04:1 caught and fixed; 0 console errors;
  gate clean, cparity 61 ok, engine 47 ok. Size L.
  **Reviewed the same day — six notes, one mockup round (`scratchpad/mockups/scores.html`),
  D177 — and reworked as v1.5.35:** the tile is the control and opens its own popover (base
  focused, origin pills, feats read-only, named add/set bonuses, full-row Add last); main
  abilities tinted, save ring from the first class; the ⋯ menu (array · point buy with its
  counter · type · roll 4d6dl1 · fill for my classes · armed clear); the numbers moved to
  Slots & casts. **Verified:** Int 15 + origin +2 + a +1 Manual + a set-19 → 19 then 20 with
  the ASI; standard array lands 15 on Int and the pool select swaps two abilities; point buy
  reads "0 of 27 points left" on the array; Clear arms then clears all three stores; the
  popover inside the card and the viewport at 1280 (left-hung) and 375 (right-hung, 236px);
  every tile child centred to 0.00px; pill on 13.9:1, off 6.4:1, modifier on the tint 6.6:1;
  restored byte-identical; 0 console errors; engine 55 ok.
  **Second review, nine notes, D178 — v1.5.36:** origin pills follow the +2/+1 · +1/+1/+1
  budget; save proficiency is a border on the chip; the base field focuses only while blank;
  menu rows never wrap with the note under the label; Optimize is a switch; the roll formula
  behind a chevron in dice notation; the roll reel from monster-forge's initiative; a wizard's
  tile reads the free allowance with copies beside it and copies leave the lower levels alone
  (`4/4 +36 · 2nd`, `0/8 · 1st`, was `40/40` and `0/0`). **Verified:** Int +2 → Cha offers +1
  only → Str offers none, the holder keeps its pill; blank Wis focuses, filled Int does not;
  `4d6kh3` accepted and `nope` refused; Optimize re-sorts six values; six reels of 21 values
  land on the totals; engine 66 ok.
  **Third review, six notes, D179 — v1.5.37:** disabled pills + Reset; no chip in the popover
  header; face and reel share one geometry (0.00px); Optimize switch on its label's line; the
  build switcher's character ⋯ menu (new empty version · delete character); character name
  borderless at rest in both places. **Verified:** Cha offers +2 disabled while Int holds it,
  Reset clears; the reel's last frame lands 0.00px from the face in x/y/w/h, same font; a new
  empty version is blank, named v2, placed after its siblings, under the same character; delete
  character arms then removes the group; builds and state restored byte-identical; engine 66 ok.
  **v1.5.38 (D180):** the picked chips grouped by level, a group past 12 chips one scrolling
  row under the mask with a wrap-open toggle; the wizard tile reads `40/4`.
  **v1.5.39 (D181):** the tile row folded into the level rows (name · tile numbers · chips,
  toggle at the chip row's right end); the Optimize switch's track restated; the manager's
  version name borderless at rest.
  Storage: `abilities` base six + `originBonus`, appended at the end of `serializeState` so
  untouched builds compare equal; one `choices` entry per ASI/+1 feat pick (D135's `##n`
  suffix keeps repeats distinct). Engine: a score at level L = base + origin + ASI choices at
  or below L in the acquisition order (D115(b,h)); PB from character level; DC and attack per
  casting source; `cs.dc` defaults to "yours". UI: a six-tile row on the Character card
  (`--ab-*`, D142(b)); the guide's ASI step gains a "which score" section; the table's DC and
  attack become numbers; the print's two ruled blanks fill; `checks` on a score resolve.
  Exporter and importer additive. *Done when:* `engine.test.js` has fixtures for the score
  slice (an ASI at level 4 is not counted at level 3), PB by level and a source DC; the table,
  the print and a prerequisite each show a derived number in the pane; a pre-N1 build
  round-trips byte-identical; CLAUDE.md's non-goal sentence reads "scores and proficiency
  bonus only, nothing else"; gate clean.
- [ ] **N2 · Backgrounds as an entity** — 🔶 its own decision entry first (D176(c)). Both
  extractors (`backgrounds.json`), the entity picker's `background` kind, a guide step, the
  origin +2/+1 moving onto it. Size M.
- [ ] **N3 · Proficiencies, HP, hit dice, AC** — 🔶 decision entry first. Multiclass rules,
  the unarmoured-defence hand table (both extractors). Size L.
- [ ] **N4 · Starting equipment and armour/weapons** (`items-base.json`) — 🔶. Size M/L.
- [ ] **N5 · A sheet page and a second print kind** — 🔶 the rung that would supersede
  D118(d); collides with character-forge's scope. Size L.
- [ ] **N6 · Homebrew for the new kinds** via the K2 tray recipe. Size S–M.
- Exports are part of the horizon, not a rung: A-03 (level plan as text, L5.5) and A-09 (the
  character-forge chassis) land whenever their inputs exist.

## Open ⚑ — calls for Francesco

→ archived 2026-09-05: 12 closed items — `ARCHIVE.md#flags-closed-by-2026-09-05`

- [ ] **Copy veto pass** — `audits/copy-table.md`, 227 rows; revert by name. Also decide the ten
  progress ellipses ("Fetching…", kept as "still running"). Phase M's **M4** will add the filter
  strings to it. ⚑ (owner: Francesco, 2026-09-02)
- [ ] **Third-casters are still POOLED, then floored** — found while implementing D158(b),
  outside its scope. `Math.floor(third/3)` sums Eldritch Knight and Arcane Trickster levels
  into one bucket; the table reads "a third of your Fighter levels" and "a third of your Rogue
  levels" separately, so Fighter 5 (EK) + Rogue 5 (AT) should pool to 2, and the app says 3.
  Same shape as the half-caster bug, one class-pair rarer. One line in each of `compute()` and
  `planSlots()`, plus a fixture. ⚑ (owner: Francesco, 2026-09-02)
- [ ] **Wave-3 leftovers, small:** the four importer strings in `extract.js` whose twins live in
  `extract.py` (move together, cparity); `— none —` (Fighting Style) is label AND stored key, needs
  a display/key split before it can be renamed; the `.abtile` DOM-built abchip (app.js ~3369) not
  routed through `abChip()`; `.gmenu` selects were styled only through the removed `.grinline`
  ancestor and render unstyled (pre-existing, found by 3b). ⚑ (owner: session, 2026-09-02)

## Queue — open work

→ archived 2026-09-05: 3 closed items — `ARCHIVE.md#queue-items-closed-by-2026-09-05`

- [x] **Magic-item / reward ingestion** — 🔶 **RESEARCHED 2026-08-27, awaiting the call.**
  The old note said "items carry no structured uses"; that is **wrong** and the audit
  corrected it.
  - **Items.** `charges` (282), `recharge` (286, closed enum), `rechargeAmount` (254) and
    `attachedSpells.charges` (a real cost→spells map, 138 items) map **straight** onto the
    D55/D95 model. Staff of Fire's record is literally `pool:10 · "1d6+4 at dawn" · costs 1/3/4`.
  - **The hole:** save DC, attack bonus and casting ability are **prose only** — of 402
    items with attached spells, **zero** carry a structured DC or attack and only **9** name
    an ability. Those three fields would always arrive blank and be typed by hand.
  - **The trap:** *Luck Blade is not a record in `items.json`.* It is a magicvariant template
    (`requires:{sword:true}`) cross-multiplied against base items. 11 spell-granting
    templates expand to **115** items, plus 53 `_copy` records (41 with no content of their
    own). A naive flat read returns 402 and silently drops the rest — porting
    `_createSpecificVariants` is ~150 lines **into both extractors**.
  - **Size:** ~120 KB slimmed, ~780 KB with prose — and the prose is the only place the DC lives.
  - **SRD:** only ~80 of 542 spell-granting items are `srd52`, so the public build gets almost none.
  - **The cheaper half — `rewards.json`:** 277 charms / blessings / boons / piety traits,
    **88 with `additionalSpells`** — the *same* schema the extractors already parse for
    classes, species and feats. No new parsing, no variant cross-product, no prose regex;
    its `innate`/`known`/`prepared` map onto the app's three modes directly. **Caveat: zero
    SRD flags**, so it is import-only content.
  - **Suggested order** (not decided): rewards first as a small self-contained addition,
    then items as *"prefill a custom source from an item"* rather than a first-class entity,
    since the DC needs hand-entry regardless. ⚑ (owner: Francesco, 2026-08-27)
  → **D158(n): items as prefill first, then rewards (L5.9).**

- [ ] **`SHADOWED` is not source-aware** (D127 agent flag): with XPHB off, 90 reprinted
  subclasses stop being reprint-hidden but only 6 surface — `collapseEditions` still shadows
  them behind an XPHB winner whose book is off. Consulting `srcOn` there means re-running
  `buildIndexes` on every source change — a D-level behavioural call.
  ⚑ (owner: Francesco, 2026-08-29)
- [ ] **`subclassFeature` `_copy` records (75, all shallow/same-file, zero `_mod`)** are
  still unresolved (D127 scoped them out): 2014 twins' FEATURE lists may read hollow even
  though grants now resolve. If feature names ever look wrong on a 2014 subclass, this is
  why — the resolver exists, it just isn't pointed at them. ⚑ (owner: Francesco, 2026-08-29)

- [ ] **Detect a real long-rest spell swap in the extractors** — D73's Granted tab lists
  every `kind:"known"` pick because the digest has no flag for "you may replace this on a
  long rest". **Attempted 2026-08-27 and deliberately stopped:** the prose is there
  ("Whenever you finish a Long Rest, you can replace that cantrip…") but it is NOT on the
  species entry a flat walk reaches — it lives inside 5etools' unresolved `_copy._mod` /
  `_versions` blocks and inside TABLE rows. A regex over `entries` finds **zero** matches.
  Closing this means resolving those structures, which neither extractor does. Bigger than
  it looks. ⚑ (owner: Francesco, 2026-08-27)
- [ ] High Elf true in-table cantrip swap; Human extra-origin restricted to origin cats.

→ closed backlog items (all of them): `ARCHIVE.md#closed-backlog`
