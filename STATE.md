# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | Every decision D7–D158 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions and old rationale |

## TL;DR (2026-09-02 · **v1.5.23** live · D157 audit DONE through wave 3 · **Phase K closed** · L5.1–L5.4 shipped, the guide stage reworked twice on his review)

- **The three-pillar audit ran end to end this session and shipped.** D157 set the charter
  (fix trivial, report the rest, second-agent verification); six auditors and three verifiers
  produced the record in `audits/` (12 reports + `synthesis.md`); five triage rounds became
  **D158**, which holds every disposition. Wave 3 shipped as **v1.5.9 → v1.5.15**, all pushed
  and tagged: the JSON-upload ordering loss (C3-01), the Choices card counting everything
  unanswered, the D125 trade clamp, `sbFav` edition tolerance, every modal a real dialog
  (role · aria-modal · focus in/out · Tab trap · Escape on all 14), a visible focus ring, AA
  contrast on the badge, the light content cells and dark control borders, 21 dead CSS tokens
  out, `bump.py` validating before it writes, the gate grown to **seven lines** (deadfns · ids ·
  eslint), and the **copy rewrite**: 227 strings, 181 em dashes and 63 ellipses out, table at
  `audits/copy-table.md`.
- **Docs this session:** PLAN 318 → ~200 lines (`/clean`, Phase J archived), README de-staled,
  D149(f) reconciled, CLAUDE.md's versioning clause amended (D158(i): a commit that changes what
  is built bumps), the gate lines added.
- **Facts that changed what we knew:** the browser pane's storage does NOT persist across
  sessions and ports are separate origins; his real 44-book library lives in his own Chrome, not
  the pane. Parallel browser agents share ONE pane tab and hijack each other's navigation. A
  boundary-aware grep cannot see a concatenated class name (nine "dead" tokens were live). The
  first-import replace (43 → 1 on an empty digest) is D137 working as decided and reverses in one
  click; D158(d) makes it merge onto the bundle (L5.3).
- **L5.1 shipped: K3 (v1.5.16) and K4 (v1.5.17), both committed and tagged, neither pushed.**
  **D159** settled the three calls K3's spec left open: the stash holds RAW json for BREWS only
  (`_meta.sources` is the core/homebrew line), "stale" now means the PARSER FINGERPRINT changed
  (`window.__PARSER__`, a hash of both extractors that `build.py` injects) rather than the
  version, and web books are OFFERED, never auto-downloaded. `autoReparse()` replaced the boot
  nag; K4 then took Refresh imported data, the miss memory, the two K1/K2 orphans and the
  remembered directory handle (the `handles` store is dropped at `IDB_V` 3). One real bug found
  on the way: `filterDigest` did not carry the new `parserHash` forward, so an un-re-parsed book
  read as current — the D138(a) false success, third recurrence, now in GOTCHAS.
- **L5.2 (v1.5.18)** the headless engine test joined the gate as its eighth line — ten fixtures,
  35 assertions, mutation-checked — and with it **the pooling correction (D158(b))**: a
  half-caster contributes ⌈its own level/2⌉, so Artificer 5 / Wizard 5 reads 8, not 7.
  **L5.3 (v1.5.19, D160)**: `assembleData` merges the bundle under the import, so a first
  import takes 43 books → 44 instead of 43 → 1; the bundle is merged at assembly, never
  written to storage. **L5.4 (v1.5.20, D161)**: the guide step's picker moved INTO the stage
  above the 820px breakpoint, after two rounds of side-panel mockups he rejected as restating
  the chain rail; below the breakpoint it stays a modal. **Revised as v1.5.21 (D162)** on his
  notes: the list REPLACES the opener button, a multi-section step shows chips instead of a
  button per section (and loses the headers those chips repeat), **one column always**
  (D161(c) reversed), and the end-of-walk sentence moved inside the card — "done and next
  session overlap" was two surfaces claiming the same moment with the nav between them.
- **Next action: L5.7** (the geometry retrofit, D158(g), size L, its own release) or **L5.9/
  L5.10** (magic items as prefill, compare two versions). **L5.5 and L5.6 need Francesco**:
  the level-plan copy format, and the PWA check on his phone.
- **Manual for Francesco:** ⓪ *(the v1.5.16 → v1.5.23 backlog is pushed.)* Two small calls: the
  Library status strip now reads "parser v1.5.15" on a newer app (accurate, but it names a
  version that is behind and says nothing about that being fine); **the rest of his "visual bugs
  in the guided builder" are unlisted** — the end-of-walk overlap is fixed, an element-by-element
  sweep found nothing else, so the others need him to point; and **third-casters are still
  pooled then floored** — Fighter 5 (EK) + Rogue 5 (AT) reads 3 where the table gives 2, the
  same shape as the half-caster bug D158(b) fixed but a separate rules call (⚑ in PLAN).
  ① **Veto pass over `audits/copy-table.md`** (227 rows, by surface):
  name a row and it reverts; and say whether the ten progress ellipses ("Fetching…") go too.
  ② **PWA install check** on your phone (L5.6, the oldest flag). ③ *(closed by K3 — the notice no longer fires on
  a copy-only bump.)* ④ Build "v2" health ⚠ at L1–L4 is real.
  ⑤ Print from Chrome or Safari (D108). ⑥ XMM on for Find Familiar's 2024 forms (D81).
  ⑦ Optionally ask GitHub Support to gc the pre-purge SHAs.

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
bounded set). Ability scores and proficiency are not modelled.

## Now

The queue is `PLAN.md`: **Phase L (D157/D158)** is the live phase, L0–L4 done, **L5 is the
build list** (L5.1 = K3/K4 done; **L5.2 is next**). Phases E–K models (D115, D118, D126, D130, D131, D132, D154–D156)
still bind their surfaces; cite them. `audits/` is a point-in-time artifact: `/clean` archives it
once L5 has consumed it. DECISIONS.md is 2,300+ lines; **D158(q) approved the index-plus-archive
diet for the next `/clean`**, together with the audits folder.

