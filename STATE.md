# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next and what is gated |
> | `DECISIONS.md` | Every decision D7–D109 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases and old rationale |

## TL;DR (2026-08-27 · **v1.1**, pushed · **LIVE on GitHub Pages**)
- **State:** working, committed, **pushed**, tree clean. **Versioned from v1.0** — the footer
  names the live build, `bump.py` moves it, `CHANGELOG.md` maps the old v4→v7 line onto tags.
  The doc set was split this session (see "Where things live"). Before that, one session shipped
  the **print / PDF surface end to end** and one real data bug. Print (**D97–D103, D106–D108**): a fourth `none` state for a zero-cap slot tile;
  the sheet is **always the spell table** under a build summary; a **tracker** of everything
  expendable as tick boxes (slots as a one-row table incl. Pact, uses capped at 6 then a written
  total, per-class prepared/cantrip counts with **write-in boxes** for attack and DC); a **legend**
  of only the marks used; an optional **spell-card appendix** with full rules text, level groups
  and same-document links; **all-preparable-unticked** for daily casters; light/dark, portrait/
  landscape, page-per-level, notes page — all in a remembered modal that states what a setting
  costs. Also: the **published build installs and runs offline** (D99 — manifest, service worker,
  icon set, `docs/` only); source DC/attack **narrowed to what each spell rolls** (D100); grouping
  by source **folds a subclass or invocation back into its class** (D104); summon **forms you mark**
  print and lead the carousel (D105); and a **feature can add forms** to a familiar spell (D109 —
  Pact of the Chain). The creature book filter was checking against a registry that has no bestiary
  books, which is why Find Familiar opened on **2 of 65** forms → `GOTCHAS.md`. Parity is exact and now
  covers the new `forms` field (`node scratchpad/cparity.js`, 0 fail).
- **Next action:** the standing 🔶 **decide the magic-item / reward import** — researched, parked on Francesco's call; findings
  and the one real trap are in `PLAN.md`. **Done when:** rewards-first vs items-first vs
  neither is a decision entry with a task line behind it.
- **Manual for Francesco:** ⓪ **Re-import your 5etools data** — this is now the standing chore and
  it back-fills nothing. After **D109** an import carries a feature's granted familiar forms and
  their stat blocks; after **D91** it no longer stores spells with no class access at all; after
  **b3a734c** it has no Foundry stubs (D82); after **0de78ed** it has `catName`, `exclusiveCat`
  and `castMods`. Re-importing is cheap — it **adds** rather than replacing, and "Your books" is
  where you drop what you don't want. Do it on every browser. ① **Print from Chrome or Safari**,
  not from an in-app PDF writer: the filename and the clickable spell links come from the
  browser's own export, and some hosts ignore both (D108). ② **Turn XMM on in Sources** for Find
  Familiar's Monster Manual 2024 forms in the default view (D81). ③ Optional — ask GitHub Support
  to gc so the old unreachable commits (SHA 2c8bbb6 etc., held only in
  `backup/pre-purge-20260826` locally) stop being SHA-addressable. ④ To update the live site:
  `python3 extract.py` (if data changed) → `python3 build.py` → commit → push. ⑤ `dist/`, `data/`,
  `data-srd.json` are gitignored (local only); public SRD data is inlined in committed `docs/`.

## What this is
Offline single-page D&D 2024 spell planner. Two builds from one source:
- `dist/index.html` — self-contained, **bundles the full data** (personal offline use). Local-only.
- `docs/index.html` — **embeds the SRD 5.2 subset**, imports more 5etools at runtime. Public Pages build.

Content at runtime = baked/SRD bundle ⊕ imported 5etools ⊕ custom homebrew (localStorage).
Legacy Artifact URL (superseded by Pages, kept for reference):
https://claude.ai/code/artifact/47dbe945-a18a-4444-af21-c0143faa2eb0

## Now

**Nothing in flight.** v7 (saved builds) is complete — T1–T5 and T7, all six task bodies and
the storage shape → `ARCHIVE.md#v7-tasks`. Its **non-goals still stand**: no level-by-level
timeline (versions are named copies the app never orders), no server sync or accounts, no
sharing a build as a page or URL (D36).

The queue is `PLAN.md`; the next action is the 🔶 in the TL;DR.

## Where things live

Split out of this file on 2026-08-27 so the resume read is short. Nothing was dropped.

- → moved: the Decisions section (D7–D109, 679 lines) — `DECISIONS.md`
- → moved: the Gotchas section (311 lines) — `GOTCHAS.md`
- → moved: the Backlog — `PLAN.md`
- → moved: Build / run — `CLAUDE.md`
- → moved: the Shipped list — `CHANGELOG.md`

⟳ Rename previous session → "Print sheet, PDF options and familiar forms" · session: resolve by cwd + latest
