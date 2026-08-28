# Changelog

The version in the app's footer comes from `VERSION`, which `build.py` injects into every
deliverable. **MAJOR.MINOR.PATCH** (D117, 2026-08-28): the **major** moves only for
overhauls or massive reworks, on Francesco's say-so (`python3 bump.py --major`); the
**minor** for larger batches that ship features (`--minor`); the **patch** once per
ordinary commit (`python3 bump.py`). Releases are tagged (`git tag v1.2.2`) from 1.2.2 on.

**The old two-part 1.x line (1.0 → 1.8) is mapped, not rewritten** — same commits, same
SHAs, retro-tagged with their semver identity, exactly as the pre-1.0 line was. The table
below names both. Everything before 1.0.0 is the internal v4 → v7 line, mapped onto a
pre-1.0 series and tagged in place. `git tag` lists them all; `git show v0.6.5` opens one.

## 1.x — the numbered line

| Version | (was) | Commit | What shipped |
|---|---|---|---|
| **1.2.11** | — | *this commit* | **F1 — step-list derivation** (D118): `guideSteps()` derives the guided builder's chain — one step per decision, statelessly from the build alone: class-per-level (plus the next-level growth step), subclass where due, species, origin/general/epic feat slots at their D114 character levels, sticky pick slots from the E2 schedules (preparer lists yield none; a wizard's steps are the free allowance), optional-feature slots from their progressions, and a swap y/n at eligible level-ups. Steps group by character level, carry pool descriptors (castMax at the slice for "legal now"), and get done/open/skipped statuses; `guideResume()` finds the re-entry point in either walk direction. **D121**: the frontier ignores class steps; optional steps never capture re-entry. Verified on the five D114 fixtures in both directions; a filled Bard 20 derives 73 steps (D118(c)'s band). No UI yet — F2 renders it. |
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
| **1.1.3** | 1.6 | d8db42a | `CLAUDE.md` dev-server note matches the attach-mode launch config (the preview sandbox cannot spawn `serve.py`). |
| **1.1.2** | 1.5 | 0b52f16 | The ⋯ Refresh actually refreshes: await the folder recall inside the click, so the first click of a session no longer falls through to "choose the folder". |
| **1.1.1** | 1.4 | 3cb4ede | Handoff: STATE stamped, docs aligned to D113. |
| **1.1.0** | 1.3 | 99e883f | **The Library** (D110–D113): import + Sources merged into one two-tab modal; universal drop zone (zip / files / dragged folder); one three-state book list with one Apply; parse on arrival; Refresh imported data (one click, summary + parser stamp); edition-first source groups with search. |
| **1.0.2** | 1.2 | d9a233f | Stat-block tag strip on every free-text field (the Imp's `{@variantrule}`); folder scan backfills book names from books.json; folder import carries the lookup, books.json and bestiary files, in readOrder. |
| **1.0.1** | 1.1 | e9d4886 | `/clean`: the doc set split (STATE → CLAUDE/PLAN/DECISIONS/GOTCHAS/CHANGELOG/ARCHIVE). |
| **1.0.0** | 1.0 | 7523c81 | The app reports its own version. `VERSION` + `bump.py` + a footer tag; the numbering starts here. |

## 0.x — before the numbering (tagged retroactively)

| Tag | Commit | What shipped |
|---|---|---|
| `v0.4`   | `5762b2e` | Repo split, choices engine, casting stats, spell table + details. |
| `v0.6`   | `468436f` | Runtime content layer, custom spells, the 5etools importer, the no-data deploy build. |
| `v0.6.1` | `cbf150d` | SRD-embedded public build, reworked level budget, zip import. |
| `v0.6.2` | `0cc931f` | Per-level caps, edition dedup, the wizard book model, spell-modal access. |
| `v0.6.3` | `58d0cc5` | Grant feature names, quiet description sub-headings, collapsed Access. |
| `v0.6.4` | `575ce5c` | Dedicated species and feat picker modals. |
| `v0.6.5` | `f0ac6b8` | Innate-cast fixes, the shared source checklist, the column rework, optional features. |
| `v0.6.6` | `a4958e2` | Prerequisites end to end, grouped choices, picker menus, quieter components. |
| `v0.7`   | `1115e1f` | Saved builds complete — storage, activation, the manager, the switcher, export/import, IndexedDB. |

Between `v0.7` and `1.0`, unnumbered: the print / save-as-PDF surface, the offline install for
the published build, and feature-granted familiar forms (decisions D97–D109 in `STATE.md`).

## What shipped, by phase

Moved from `STATE.md`'s Shipped list on 2026-08-27 (v1.1) — one owner for "what shipped when".
Per-batch narrative → `ARCHIVE.md#v7-batches`.

- v6 / v6.1 — runtime content layer, custom spells, importer, Pages deploy, SRD embed, zip import.
  → `ARCHIVE.md#v6`
- v6.5 / v6.6 — innate-cast fixes, optional features, prerequisites end-to-end, column rework,
  shared source checklist, unified feat picker. → `ARCHIVE.md#v65`
- v7 · T1–T5 — saved builds end to end: storage + migration, activation reconciliation, the
  manager, the header switcher, and export/import as files.
- v7 · T7 — storage-pressure reporting, closed by moving the imported digest to IndexedDB (D93).
- **Importer rework** (2026-08-27) — **D90–D93**: app icon; honest zip errors + unpack progress +
  the clobbered spell-lookup fix (D91); folder scanning indexed by book (D92); IndexedDB (D93).
- **Custom sources** (2026-08-27) — **D94–D95**: the editor redesigned progressive with a live
  summary and per-spell notes, then its two model gaps closed (payment per spell; a `total` unit
  for uses that never reset). The D55/D65 model was never the problem; D95 widened it.
- **Print / save as PDF** (2026-08-27) — **D97–D103, D106–D108**. The whole printed surface: the
  sheet is the spell table under a build summary, with a tick-box tracker for everything
  expendable, a legend of the marks it uses, an optional full-text spell-card appendix with
  internal links, and a remembered settings modal (colour, orientation, tracker, cards,
  all-preparable, page-per-level, notes) that says what a setting will cost.
- **Offline install** (2026-08-27) — **D99**. `build.py` writes a manifest, a stale-while-revalidate
  service worker and a 192/512/maskable icon set into `docs/` only; registration is guarded on
  `__PUBLIC__`. ⚑ Registration is **unverified** — the in-app browser refuses to register a worker
  and Chrome was unreachable from the session (owner: Francesco, 2026-08-27).
- **Table & data fixes** (2026-08-27) — **D100** (a source states only the numbers a spell rolls),
  **D104** (grouping by source folds a subclass or invocation into its class), **D105** (marked
  summon forms print and lead the carousel), **D109** (a feature can add forms to a familiar
  spell), plus the creature-book filter bug → Gotchas.
- **v7 note batches 1–10** (2026-08-26 → 2026-08-27) — **D43–D89**. Ten batches of notes plus two
  bug hunts on top of the tasks. Per-batch narrative → `ARCHIVE.md#v7-batches`; the earlier notes
  → `ARCHIVE.md#v7-notes`. The load-bearing outcomes are the decisions above and the Gotchas
  below — this list used to restate them a third time.
