# CLAUDE.md — My Spellbook

An offline, single-page D&D 2024 spell planner. It works out **which spells a character can
take, at which level at most, and from which source** — across multiclassing, subclass grants,
feats, species, items and their choices. Vanilla JS, no framework, no build step for the app
itself beyond inlining.

Live at <https://francescocompa.github.io/my-spellbook/>. Personal tool; Francesco is the only
user and the only decision-maker.

---

## Read this first

`STATE.md` is the resume block and it names the rest. One owner per fact — if two files say the
same thing, one of them is wrong:

| File | Owns |
|---|---|
| `CLAUDE.md` (this) | What the project is, conventions, build/run, the verify gate, versioning |
| `STATE.md` | Where things stand right now, and what is blocked on Francesco |
| `PLAN.md` | The queue — what is next, what is gated |
| `DECISIONS.md` | Every decision D7–D158 and the options rejected with them |
| `GOTCHAS.md` | Traps that have already cost a session. **Read before touching the extractors, the importer, grants resolution or any DOM handler.** |
| `CHANGELOG.md` | Versions, and the tag map for the pre-1.0 line |
| `ARCHIVE.md` | Bodies of consumed phases and old rationale — stubs in the live docs point here |

`DECISIONS.md` entries marked **→ Gotcha** have their real, enforced-in-code copy in
`GOTCHAS.md`. Trust that one.

---

## Shape

- `src/{index.html,styles.css,app.js,extract.js}` — the app. `app.js` is one large file on
  purpose; it is read top-to-bottom and sectioned by `// ── heading ──` comments.
- `extract.py` — turns a 5etools mirror into `data/data.json` + `data/data-srd.json`.
- `src/extract.js` — the **in-browser port** of `extract.py` (the importer). The two must stay
  in step; `node scratchpad/cparity.js` proves it.
- `build.py` — inlines everything into two deliverables:
  - `dist/index.html` — self-contained, bundles the full data, opens by double-click. Local only.
  - `docs/index.html` — the public Pages build. SRD 5.2 inlined; more is imported at runtime.
- `data/`, `dist/`, `data-srd.json` are gitignored — 5etools content stays local. Only the SRD
  subset is committed, inside `docs/`.

Content at runtime = baked/SRD bundle ⊕ imported 5etools (IndexedDB) ⊕ custom homebrew
(localStorage).

## Build / run

- Dev: **start the server from Bash** — `python3 serve.py 8000` — then `preview_start`
  (launch.json `spellbook` is an **attach** config: a `url`, no command) and navigate to
  `http://localhost:8000/src/index.html`. The preview sandbox cannot spawn the server itself:
  a spawn config dies with `can't open file 'serve.py': Operation not permitted`, which is
  why the entry attaches instead. Use `serve.py`, **not** `python3 -m http.server`: the latter
  evaluates `os.getcwd()` at argparse time, which the sandbox also blocks (startup crash);
  `serve.py` binds an absolute root as a library and sidesteps it. `serve.py` sends
  `Cache-Control: no-store`, so a plain reload always picks up edits.
- Data refresh: `python3 extract.py` (mirror default `~/Documents/D&D/5etool_mirror/…/data`),
  then `python3 build.py`.
- Deploy: commit + push `main`; Pages builds `main:/docs` (which has `.nojekyll`).

## Verify gate — run before declaring anything done

```bash
python3 -c "import ast;ast.parse(open('extract.py').read());ast.parse(open('build.py').read())"
node -e "const fs=require('fs');['src/app.js','src/extract.js','docs/sw.js'].forEach(f=>new Function(fs.readFileSync(f,'utf8')))"
python3 -c "import json;json.load(open('data/data.json'));json.load(open('docs/manifest.webmanifest'))"
node scratchpad/cparity.js        # extractor parity — MUST be 0 fail after any extractor edit
node scratchpad/sweeps/deadfns.js # dead functions — MUST exit 0 (K4 spent the allowlist)
node scratchpad/sweeps/ids.js     # a lookup for an id defined nowhere — MUST exit 0
npx eslint src/app.js src/extract.js docs/sw.js   # D158(k) rules — MUST exit 0 (npm install once)
```

`cparity.js` drives the **real** predicates (`zipWanted`, `dropFoundryStubs`, `readOrder`,
`carriedMonster`). A harness that rolls its own copy is how the `foundry.json` corruption hid
for two sessions — never re-implement one there.

## Versioning

`VERSION` is the single source of truth. `build.py` reads it and injects `__VERSION__` into
`data.js`, `dist/` and `docs/`; `app.js` renders it as a tag at the head of the footer, so any
page — including a printed sheet — names the code that made it.

Beside it `build.py` injects `__PARSER__`, a hash of `extract.js` + `extract.py` (**D159(b)**).
That, not the version, is what decides whether stored data needs re-reading: since D158(i) a
version moves on copy-only patches, which change nothing a digest holds. Nothing has to be
maintained by hand — touch either extractor and the fingerprint moves with it.

- **Every commit that changes what is built bumps it** (D158(i)): `python3 bump.py` (patch,
  1.2.1 → 1.2.2), which also rebuilds. Docs, audits and scratchpad commits carry no bump. A
  version nothing was built with lies in the footer.
- **MAJOR.MINOR.PATCH (D117, amended by D140)** — patch for day-to-day fixes and small
  batches (the once-per-commit default); `--minor` for larger batches that ship features;
  `--major` for overhauls and massive reworks only.
- **Minor and major only move when Francesco says so (D140).** Present what shipped and why
  it might warrant the bump, ask (AskUserQuestion), and take patch until he approves. Never
  take `--minor` or `--major` on your own.
- Commit messages lead with the version: `v1.2.2 — what changed`. Release commits are
  tagged (`git tag v1.2.2`) and tags are pushed.
- The pre-semver lines are tagged in place, never rewritten: the pre-1.0 line (v4 → v7)
  and the two-part 1.x line (1.0 → 1.8, retro-tagged v1.0.0 → v1.2.1). `CHANGELOG.md`
  maps both.

## How to work here

- **Verify in the browser, don't ask Francesco to check.** Start `serve.py` via Bash, drive the
  page, screenshot the result. Print output is checked by lifting the `@media print` rules into
  a screen stylesheet — the browser pane has no print preview.
- **Measure alignment on every new or changed UI element before calling it done.**
  Off-center text in chips/tiles/badges is a recurring bug class (Francesco, 2026-08-31).
  Don't eyeball it: compare the text node's `getBoundingClientRect` against its container's
  in-browser and assert the deltas are symmetric, at both 1280 and 375.
- **Never mutate Francesco's saved builds to test something.** Derived state (`R`, `PREVIEW`) is
  rebuilt on the next render and is safe to poke; `state.*` is his data. If a test must write,
  capture the value first and restore it, then verify the restore.
- **Log decisions as they are made** (`/decision` → `DECISIONS.md`), with the rejected options
  and why. A rejected option that isn't written down gets re-proposed in three sessions.
- **Both extractors or neither.** A hand-authored table, a predicate, a parse — if it lives in
  `extract.py` it lives in `src/extract.js` too, identically, and `cparity.js` proves it.
- **Don't extend**: `ARCHIVE.md` (append-only, stubs point at it) and the `data/` outputs
  (generated). Don't edit `docs/` or `dist/` by hand — they are build products.

## What this is not

Non-goals, still standing: no **authored** level-by-level timeline — per-level truth is a view
derived from the acquisition order, and versions are alternative builds, never levels (D115
narrowed this; per-pick stamps stay rejected); no server sync or accounts; no sharing a build as
a page or URL (D36); no full bestiary (D78 carries a bounded creature set). Ability scores and proficiency are **not modelled** —
anything needing them is left blank for a human rather than guessed.
