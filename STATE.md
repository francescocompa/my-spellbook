# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next and what is gated |
> | `DECISIONS.md` | Every decision D7–D138 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases and old rationale |

## TL;DR (2026-08-31 · **v1.4.0**, committed · **pushed** · app content = v1.4.0)
- **State:** phases E–I all closed (every gate passed 2026-08-31). This session was
  Francesco's own bug report, taken as a **full audit of invocations and everything shaped
  like one** → **D135, shipped v1.3.0**. Four independent holes, every one a 5etools field
  neither extractor read: ① the three DESIGNATION invocations (Agonizing Blast, Repelling
  Blast, Eldritch Spear) get a real choice — a new grant kind `marks`, parsed from the
  `{@filter …}` tag inside their own prose, drawn by every surface that already draws a
  pick, landing its effect on the designated spell as a D79 note; designating a cantrip you
  have NOT got takes it on the class's own schedule (Francesco's call — a shortcut, never a
  bonus). ② **Repeatable** is read from both shapes 5etools uses and the nth take carries a
  `##n` identity, so two Magic Initiates hold two independent sets of picks. ③ A feat /
  optional feature / species now has its own prose mined for casting notes — 252 of them,
  block-scoped so a trait's note can only reach the grant its own block names. ④
  `featProgression` → `featSlots`, so Lessons of the First Ones adds its Origin slot to the
  budget card and to the guided chain. Plus: a prerequisite carrying a `choose` filter is now
  verifiable, and two bugs found in passing (Seeking Spell's boolean-as-array test;
  `EMPTY_GRANTS`'s shared mutable lists). A second report the same day → **D136, v1.3.1**:
  Great Old One's Hex is a PREPARED grant, not "at will" (5etools files it under `innate`;
  its own feature says only "you always have it prepared"); Synaptic Static's Save column
  drops the Constitution the spell never forces (the tag came from a penalty on the target's
  own concentration saves); and everything GRANTED is now one row per spell with a badge per
  giver — the always-prepared branch used to read `grants[0]` and silently drop the rest.
  Then Francesco reported two of those as still broken on the new build, which turned out to
  be the standing trap, not a regression → **D137, v1.3.2**: `assembleData` is
  `IMPORTED||BAKED`, so an imported digest replaces the bundle WHOLE and an extractor fix
  never reaches an importing browser until the books are re-read. Reproduced exactly from a
  v1.2.41-stamped digest and cleared from a current one. The app has stamped `meta.parser`
  since D111 and never read it; `staleParserNotice()` now says it at boot and offers the
  inline refresh — and **v1.3.3** adds the same for the published build's service worker,
  which is stale-while-revalidate by design and so is always exactly one reload behind.
  Then a REAL bug under all of that → **D138, v1.4.0**: a refresh re-reads only the books the
  folder holds, but the digest was stamped current as a whole, so a partial refresh silenced
  the notice and left the library stale with nothing saying why. The stamp is per book now,
  the notice names the books behind, and the Library shows it as a line rather than a hover
  title. Same release adds **Export all…** — one backup file carrying every build AND the
  homebrew spells they reference, which a per-build export could never carry.
- **Next action:** **push v1.4.0** (v1.3.x is already on origin, tags too). Then the
  standing queue in PLAN: the fattest small item is `refreshAddFeat()`'s `#epicRow`
  staleness (verify from a fresh load, then fix); the one 🔶 is magic items / rewards,
  awaiting Francesco. The live docs carry five finished phases inline — **`/clean` is still
  recommended** before the next substantive session.
- **Manual for Francesco:** ⓪ **Refresh your imported data in each browser — still the top
  item, and since v1.3.2 the app ASKS you to (D137): a boot notice naming the parser gap,
  with a "Refresh now" button.** It carries D135's and D136's fixes, which cannot reach an
  importing browser any other way — ⋯ → **Refresh imported data** (since
  v1.2.23 it runs inline and SHOWS a green "Re-imported N books" / a red reason). A
  pre-**D127** digest still holds the unresolved `_copy` twins, which is why
  **Aberrant/Clockwork/Wild Magic appear twice**, why every **2014 subclass grants nothing**,
  and why the **Arcane Trickster / Eldritch Knight picker is EMPTY**; a pre-**D135** digest
  has no designations, no repeatable flags, no granted feat slots and none of the new notes;
  a pre-**D136** one still reads Great Old One's Hex as "at will" and Synaptic Static as a
  Con save.
  ① **Three copy/model calls are yours**: the `…`-placeholder family ("+ add a class…", "all
  schools", "any save", "picked") — one call settles all of them; whether the chain rail's
  CSS-authored `· optional` should match the card's now-capitalised "Optional"
  (styles.css:1822); and whether `sbFav` should become edition-tolerant (a mark is stored per
  PRINTING, so it is not seen if a book toggle later resolves the other one — a storage-shape
  change). ② **Your build "v2" showed a health ⚠ at L1–L4** — not a false positive: its
  Warlock 4 row holds 8 spells where the class knows 5, five of them 3rd-level when a Warlock
  4 casts at most 2nd. Fix or ignore, your call. ③ **Print from Chrome or Safari**, not an
  in-app PDF writer — the filename and the clickable links come from the browser's own export
  and some hosts ignore both (D108). ④ **Turn XMM on in Sources** for Find Familiar's Monster
  Manual 2024 forms in the default view (D81). ⑤ Optional — ask GitHub Support to gc so the
  old unreachable commits (SHA 2c8bbb6 etc., held only in `backup/pre-purge-20260826`
  locally) stop being SHA-addressable. ⑥ `dist/`, `data/`, `data-srd.json` are gitignored;
  public SRD data is inlined in committed `docs/`. To update the live site later:
  `python3 extract.py` (if data changed) → `python3 build.py` → commit → push.
- **⚠ One thing I broke, on the dev origin only:** verifying D135 in the browser I restored
  `localhost:8000`'s `spellForge.builds.v1` from a `window` variable that two page reloads had
  already cleared, so that origin's single stored build was replaced by a fresh empty one.
  That origin is the dev server's, used only by verification sessions — the Pages origin and
  the local `dist/index.html` (`file://`) were never touched, and that origin held no
  homebrew or custom sources (only the builds blob and the sources list, which is intact).

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Now

**Phases E, F, G, H and I are ALL DONE** — every gate has passed (E8, F4, and on
2026-08-31 G4, H5 and I5, all three PASSED-WITH-FINDINGS with the findings fixed in
v1.2.39 → D133; the three gate questions answered by Francesco → D134, v1.2.40 — both
pushed and live). No phase is open, no gate is owed, no ⚑ from the gates remains. On top of
that, **D135 (v1.3.0) wired invocations and everything shaped like one** — designations,
repeatable takes, a record's own casting notes, and feature-granted feat slots — and
**D136 (v1.3.1)** fixed three wrong reads of the spell table and **D137 (v1.3.2)** made the
app say when its data is older than its parser. What
remains is the standing queue/backlog in PLAN.
v7 (saved builds) is complete → `ARCHIVE.md#v7-tasks`. Non-goals as narrowed by D115: no
**authored** timeline (the level view is derived from the acquisition order; versions are
alternatives, never levels), no server sync or accounts, no sharing a build as a page or
URL (D36).

The queue is `PLAN.md`; the next action is named in the TL;DR.

⟳ Rename previous session → "Invocations audit"  · session: resolve by cwd + latest

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`
