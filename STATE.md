# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | **Read first.** Binding rules (**D198**, the control scale, is one), the phase in progress, superseded |
> | `DECISIONS-SETTLED.md` | The other 148 entries, D7–D197 — a reference, not a read |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-09-08 · **v1.5.56** live, pushed and tagged · **Phase N · N2 DONE (D191) · creation is a MODE now (D192) · the app has a CONTROL SCALE now (D198)** · nine releases across 2026-09-07/08, v1.5.48 → v1.5.56)

- **Where it stands.** **Character creation is a mode and Simplified is the default (v1.5.49,
  D192)** — his ask, raised mid-interview. Simplified is the app exactly as it stood before N1:
  no scores, no background, and the proficiency bonus, DC and attack back to blanks for a human,
  which is not a second code path but D176's own fallback. Two gates do all of it
  (`abilityScores` returns the empty set, `featScoreGains` asks nothing), so every derived
  number follows without knowing the mode exists. It **hides, never prunes** (D42 as a mode): a
  round trip leaves the stored build byte-identical. App-wide, in the settings menu, off by
  default. **Fixture 18** pins it.
- **N2 shipped (v1.5.50, D191): a background is the origin, and nothing else.** Its own decision
  entry first, as D176(c) requires. A background narrows the origin +2/+1 to the three abilities
  it names — D178's budget still deciding inside them, and a bonus already held always keeping
  its own pill so it can be undone. It NAMES its origin feat and offers it with one click;
  nothing ever writes to `state.feats` on its own (D191(e)). Skills, tools, languages and
  equipment are printed on its detail under a line saying the app does not track them. 2024
  only. Both extractors read `backgrounds.json` and `cparity` diffs all 60 records byte for
  byte; the SRD bundle carries four, so Pages has backgrounds with no import. **Fixture 19**
  pins the narrowing and the held-bonus trap.
- **Two of his bugs closed.** **v1.5.48 (D190)** — the detail modal's close button did nothing
  over its own glyph: the one delegated closer tested `classList.contains("x")` on `e.target`,
  but every control here is an icon button, so the click lands on the `<svg>` and the target is
  never the button. The middle 14px of a 28px control was dead. It walks up now (`closest`),
  fixing all four bodies that borrow the detail surface; sweep rule **(h)** fails on the pattern
  from now on. **v1.5.51 (D194)** — previewing a level below where a feat was taken still drew
  its chip AND judged its "Level 4+" prerequisite against the previewed level, so a legal
  general feat wore a red "prerequisite not met" at level 1 while the counter beside it read
  0/0. `renderFeatChips` was the last per-level reader walking raw `state.feats`.
- **His note on the add-class row shipped with D192 (D193):** it takes the score popover's
  dashed full-row Add — the select's drawn caret dropped so the label can centre, measured
  symmetric to 0.00px at 845px and 375px. Its neighbours stay field-shaped on purpose.
- **Next action: N3 (proficiencies, HP, hit dice, AC) needs its own decision entry** (D176(c))
  — /interview him on the rung, then build. **But L5.5 (copy the build as a level plan) is the
  cheaper next thing and only needs his format call.**
- **The "0 picks" unclearable gap bar is CLOSED (v1.5.52, D195)** — the task_2f797cfd work,
  landed. D189's family one condition along: a pick whose book is present AND on is not a book
  problem at all, so nothing about it reaches the bar (the rejected third flavour, and why
  `pruneState`'s own stance settles it, are in D195(b)). Found alongside it: `buildGaps` read
  the source from `split("|")[1]`, but a **subclass uid is `Short|Class|ClassSource|Source`** —
  a missing Bladesinging asked him to *re-import "Wizard"*. The bar also refuses, on its own
  account, a zero count or a book already on. **Fixtures 17f–17i.**
- **The level chip is a header control now (v1.5.53, D196)**, his ask: "L7 / 20", its ⚠ and the
  door to the timeline left the Character heading for `header.top`, so they are there in the
  Spell table view too; on a phone the switch and the chip share a full second row with the
  chip flush right. His rule came with it — **one row, or two FULL rows, never a ragged wrap,
  and the name ellipsises rather than bleeding**. Three holes let it bleed 209px past the edge,
  the nastiest being that **the build switch IS a `.menu`**, so a `header.top .menu` rule
  outranked its own `flex`. And **Prepare daily's icon is centred**: a plain block button sits
  an icon on the text baseline. Every other icon-only button was measured — 20 controls across
  nine surfaces, all already symmetric. **v1.5.55 (D196(f))** finished it: centring the icon
  made the real mismatch legible — the button was **28px tall next to the ⋯ menu's 34px** in
  the same header. Both modes are 34px now. The lesson, in GOTCHAS: **a shared row is the unit
  to measure, not the control.**
- **…which he turned into a design system: v1.5.56, D198 — the control scale.** A census of
  every button the app renders (nine surfaces, 40 class signatures, ~1,300 instances) found
  **nine heights** for controls and four more for chips, and the same class changing size by
  context. There are three now plus bare: **`--ctl-h:34px`** (anything you click or type in a
  form or toolbar), **`--ctl-h-compact:28px`** (dense — a modal's closer, a tile),
  **`--chip-h:22px`** (a tag you toggle), and **bare** (a glyph with no box). **A new control
  picks one; it does not invent a height.** Deliberately outside the scale, in D198(d): list
  rows, segmented/nav strips, and the parts inside a control. Held by two sweeps at 375 and
  1280 — nothing clipped, and no row with two controls more than 1.5px apart. **D198 is
  BINDING and lives in `DECISIONS.md`, not the settled file.**
- **And the class row restacks on a phone (v1.5.54, D197).** Off the same measuring: the
  four-column row gave the CLASS select **26px of text room at 320px** (36px of its 64px goes
  to the field's own padding and drawn caret), so "Wizard" read `Wiza`; at 375px there were
  50px, enough for the shortest class name and no subclass. Below 480px the class takes a full
  line with the ✕ at its right and the subclass shares the next with Lvl — 177px and 232px of
  room. Above 480 nothing changed. **Left for him:** on a WIDE screen the card sits in the
  narrow left column, so each select gets **74.5px at 1280px**, *less* than at 481px — every
  class name and every SRD subclass fits, a long imported subclass does not. Changing that is
  the desktop grid's proportions, so it is flagged in `PLAN.md`, not taken.
- **Manual for Francesco:** ① the **copy-veto pass** over `audits/copy-table.md` (~305 rows;
  this session appended three sections — D191's nine strings, D192's three, and the naming
  calls are **Full character** for the switch and the derive-nothing footnote on a background);
  ② **try Simplified vs Full** on a real build and say whether Simplified is the right default;
  ③ **the guide's background step is SECOND, not first** — after the class step, which every
  other step hangs off, and before species and every score question (D191(f)); say if you want
  it moved; ④ **send the build** that still offers a swapped-away spell, and **confirm the
  licensed-name twins collapsed** (Hideous Laughter / Arcane Hand / Resilient Sphere once each);
  ⑤ **try the reworked trade** (v1.5.46) and the guided builder's Skip on a real build;
  ⑥ **PWA install check** on your phone (L5.6); ⑦ **third-casters are still pooled then
  floored** — Fighter 5 (EK) + Rogue 5 (AT) reads 3 where the table gives 2, a rules call;
  ⑧ print from Chrome or Safari (D108); ⑨ XMM on for Find Familiar's 2024 forms (D81);
  ⑩ L5.5's format (copy the build as a level plan); ⑪ **should the class row widen on the
  desktop sidebar too?** (D197's measured-and-left, 74.5px per select at 1280).
- **Where the D-entries are:** `DECISIONS.md` holds Binding + the live phase (D176, D191,
  D192) + Superseded; **every other D-id below is in `DECISIONS-SETTLED.md`** —
  `grep -n "D184" DECISIONS*.md` finds any of them in one step.
- **Read before adding a digest ARRAY:** D191(f) and its GOTCHAS entry — `DIGEST_ARRAYS`,
  `ENT_KEY`, `emptyDigest`, `assembleData`'s own literal AND `_srd_subset` are five independent
  lists of the same fact, and three of five is silent.
- **Read before touching anything per-level:** D194 and its GOTCHAS entry — a level surface
  takes `featsAt()`/`optFeatsAt()`; raw `state.feats` is for writers and `featAcqLevels`.
- **Read before touching the score block or the origin bonus:** D176–D181, then **D191(b)**
  (a background narrows the pills, the holder always keeps its own) and **D192** (none of it
  renders in Simplified). The CSS is inside `.menupop`, where `.menupop button` restyles every
  button (GOTCHAS).
- **Read before wiring any delegated handler:** D190 — walk UP from `e.target`, never read its
  own class; every control here has an icon child.
- **Read before adding or restyling ANY control:** **D198** and its GOTCHAS entry — the scale
  is three tokens and "bare", and the three families it deliberately excludes.
- **Read before touching the header, the class row or any icon-only button:** D196 and its
  three GOTCHAS entries — `header.top .menu` catches the build switch, `display:contents` makes
  a pair compete instead of wrapping as one, and a block button puts its icon on the text
  baseline — then **D197**, which restacks the class row below 480px off named cells
  (`.cf-class` / `.cf-sub` / `.cf-lvl`), never `:nth-child`. The standing rule both serve:
  **the header is one row or two FULL ones, never a ragged wrap, and text ellipsises rather
  than bleeding** — measure it, don't eyeball it.
- **Read before touching `buildGaps` or the gap bar:** D195 — a gap is a book problem, and a
  subclass's book is the LAST segment of its uid.
- **Read before touching the guide's pick landing:** D184 (`firstOpen` vs `secOpenSlot`).
  **Before anything that walks `state.choices`:** D189 — three shapes, one is spells.
  **Before the level-up trade:** D188 and its two GOTCHAS entries.
  **Before the guide's picker hosting:** D185. **Before the extractors:** GOTCHAS' lookup
  entries (D91, D183) — the lookup has two class keys.

## What this is

Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools (IndexedDB) ⊕ custom homebrew
(localStorage). Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

Non-goals, as narrowed by D115: no **authored** level-by-level timeline (per-level truth is
derived from the acquisition order; versions are alternatives, never levels), no server sync
or accounts, no sharing a build as a page or URL (D36), no full bestiary (D78 carries a
bounded set). Of a character's numbers, ability scores and the proficiency bonus are modelled
and nothing else (D176).

## Now

The queue is `PLAN.md`: **Phase M is done** (D172–D174, D182); **Phase N** (D176, the creator
ladder) has **N1 and N2 done** (D177–D181, **D191**) and every further rung gated on its own
decision entry — **N3** (proficiencies, HP, hit dice, AC) is next and needs the entry first.
Phase N is also now read through **D192**: the rungs are a MODE, not a destination, and every
one of them is absent in Simplified. Phases E–N models (D115, D118, D126, D130, D131, D132,
D154–D156, D161–D194) still bind their surfaces; cite them. `audits/` is a point-in-time
artifact: `/clean` archives it once L5 has consumed it, together with the three mockup rounds
in `scratchpad/mockups/` (`scores.html`, `picks.html`, `fold.html`, each with its `mk*.py`).

Two `/clean` passes ran, the second completing **D158(q)/L5.11**. The cold read
(`CLAUDE` + `STATE` + `PLAN` + `DECISIONS` + `CHANGELOG`) is **267k → ~95k chars, −64%**, with
nothing deleted: D115–D175 and D177–D189 bodies, Phase K/L/M/N task bodies, fifteen closed
flags and the 1.0 → 1.5.41 changelog rows are in `ARCHIVE.md` behind stubs, and **`DECISIONS.md`
is split** — Binding + the live phase stay, 147 settled entries moved to `DECISIONS-SETTLED.md`.
`audits/` was left where it is on purpose: it is not in the cold-read path, so moving it saves
nothing per session and would churn every pointer into it — worth doing when L5 closes.
`audits/copy-table.md` is at ~305 rows and still waits on his veto.

The queue after N2 is **N3 (gated on its own entry)** and L5.5 onward — see `PLAN.md`.
