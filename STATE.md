# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next and what is gated |
> | `DECISIONS.md` | Every decision D7–D113 and what was rejected |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
> | `ARCHIVE.md` | Bodies of consumed phases and old rationale |

## TL;DR (2026-08-27 · **v1.4**, pushed · **LIVE on GitHub Pages**)
- **State:** working, committed, **pushed**, tree clean. This session shipped **the Library**
  (v1.3, **D110–D113**): the import modal and the Sources modal are ONE modal with a
  **Sources | Manage** tab bar behind one ⋯ **Library…** entry. Sources gained a search field,
  **edition-first groups** (2024 core / 2014 core / Supplements / Settings & adventures /
  Homebrew & UA — a display-only remap, no re-import needed) and an Actions menu holding
  Enable/Disable all. Manage has **one drop zone** (a .zip, JSON files, or a whole dragged
  folder — a Chrome drop yields the same rememberable handle as the picker), paste behind a
  disclosure, **parse on arrival** (no "Read staged files" click), and **one three-state book
  list** — kept · new · available-in-folder — reconciled by one Apply. **Refresh imported data**
  (⋯ menu + Manage footer) re-reads the remembered folder with the current parser and re-imports
  exactly the stored books, reporting a summary + parser stamp. Before it (v1.2): stat-block
  senses/languages/etc. now go through the tag strip in both extractors (the Imp's raw
  `{@variantrule}`), and the folder path stopped dropping book names, the spell-source lookup,
  `books.json` and bestiary files — the zip/folder behaviour gap is closed → `GOTCHAS.md`.
  All flows verified in-browser (fixture folder scan → available row → Apply add → danger Apply
  remove → store restored exactly); parity 0 fail. Print/PDF surface (D97–D108) unchanged.
- **Next action:** the standing 🔶 **decide the magic-item / reward import** — researched, parked on Francesco's call; findings
  and the one real trap are in `PLAN.md`. **Done when:** rewards-first vs items-first vs
  neither is a decision entry with a task line behind it.
- **Manual for Francesco:** ⓪ **Refresh your imported data — now one click**: ⋯ → **Refresh
  imported data** in each browser (choose the folder once if asked). It re-parses with the
  current extractor: heals the Imp's raw tag, and carries D109 familiar forms, D91 access,
  D82 stub-drop, `catName`/`castMods`. ① **Print from Chrome or Safari**,
  not from an in-app PDF writer: the filename and the clickable spell links come from the
  browser's own export, and some hosts ignore both (D108). ② **Turn XMM on in Sources** for Find
  Familiar's Monster Manual 2024 forms in the default view (D81). ③ Optional — ask GitHub Support
  to gc so the old unreachable commits (SHA 2c8bbb6 etc., held only in
  `backup/pre-purge-20260826` locally) stop being SHA-addressable. ④ To update the live site:
  `python3 extract.py` (if data changed) → `python3 build.py` → commit → push. ⑤ `dist/`, `data/`,
  `data-srd.json` are gitignored (local only); public SRD data is inlined in committed `docs/`.
  ⑥ An old rename note ("Print sheet, PDF options and familiar forms") could not be applied —
  two candidate sessions both carry meaningful titles ("General feats required zero state",
  "Importer rework and custom sources"); say which (if either) should take it.

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

⟳ Rename previous session → "Library modal and refresh" · session: resolve by cwd + latest
