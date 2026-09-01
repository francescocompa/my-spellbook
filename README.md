# My Spellbook

A one-page, offline tool for planning a D&D 2024 character's spells: it works out
**which spells you can take, at which level at most, and from which source** —
across multiclassing, subclass grants, feats, species, and their choices.

Open **`dist/index.html`** in any browser (double-click). Fully self-contained,
no internet, no install. Also publishable as-is (single file). The public build is
live at <https://francescocompa.github.io/my-spellbook/>.

## What it does

- **2024 (XPHB) rules.** The **Library** (⋯ menu) is one page listing every book: a
  status strip (books · 5etools version vs latest · storage · **Update data**, a web
  fetch from the 5etools repo), search, rows with an enable switch per book, ＋ Add
  files (zip / JSON files / a folder / paste JSON), and a selection bar for removal.
  The *Editions* filter hides reprinted legacy entries by default.
- **Build** any character: class + subclass + level rows (true multiclass;
  non-caster classes allowed), species, spell-granting feats, manual extras.
- **Saved builds**: many characters, each with several versions, from one manager
  (⋯ → Builds…) and a switcher in the header. Everything auto-saves. Books are a
  global setting, but every build remembers the ones it was made with and tells you
  when they're off — picks are flagged, never removed. **Export** any build to a
  `.spellbook.json` file and **import** it back on another machine; importing always
  adds a build, never overwrites one.
- **Level preview**: click the level chip to see the build at any lower level —
  grants that haven't unlocked disappear, budgets follow, nothing is changed. For a
  multiclass build an **order** panel sets which class each character level is taken
  in. To actually *build* a loadout at a level, **save it as a version**.
- **Custom spell sources**: a magic item, boon or blessing that grants spells —
  with a shared charge pool (or per-spell uses), its own save DC / attack bonus /
  casting ability, a fixed cast level, and a choice of always-prepared, cast-without-
  preparing, or simply added to your spell list. Stored inside the build, so it
  travels with an export.
- **Choices to make** panel surfaces every spell choice a build implies —
  subclass options (Circle of the Land terrain), Magic Initiate's list, "choose N"
  picks (which open a filtered spell-pick modal), Fighting-Style spell options
  (Ranger → Druidic Warrior), and the Cleric/Druid order extra-cantrip.
- **Prepared budget & picks**: per-class cantrip/prepared meters. For **level-swap
  casters** (Sorcerer/Bard/Warlock) it shows the best-case *count per level* from
  the level-up swap rule and flags over-cap picks; **daily casters** re-prepare
  freely; **Wizard** shows the spellbook + daily-prepared dual budget.
- **Homebrew & Unearthed Arcana**: the importer takes per-brew JSON from the
  5etools [homebrew](https://github.com/TheGiddyLimit/homebrew) (D&D Beyond drops
  included) and [prerelease](https://github.com/TheGiddyLimit/unearthed-arcana)
  repositories alongside your core data — their books appear under "Homebrew & UA"
  in the Library. An import **merges** into what you already have (keyed by book);
  nothing is stored until you commit the staged tray.
- **Casting ability** is resolved per source (defaults to your shared class stat;
  lets you choose where the source allows) and is a grouping option in the table.
- **Spell table** tab: streamlined rows (name, school, time, range, duration,
  concentration, casts/recharge, source), grouped by level / casting ability /
  source; daily casters can show all eligible and toggle selection inline.
- **Spell details**: hover a spell for a tooltip; click for a full modal
  (centered on desktop, bottom-sheet on mobile). A spell that prints creatures shows them
  as a **carousel** — Find Familiar carries all 65 CR-0 beasts, filterable by book. When one
  of your features changes *how* you cast a granted spell ("without expending a spell slot,
  and you automatically succeed on the save"), that note appears with the spell.

## The rules that matter

- **Max spell level per class** is set by that class's own level; multiclassing
  only changes *slots*. Higher slots just upcast.
- **The swap distribution** (level-swap casters): each class level you add the new
  prepared spells at that level's max, plus one swap. So not every slot can be top
  level — the tool computes the best-case count per level.
- **Magical Secrets** (Bard) is a list expansion (Cleric/Druid/Wizard, level-gated).

## Repo layout

```
src/index.html    HTML shell (dev: links styles.css, app.js, ../data/data.js)
src/styles.css    all styling
src/app.js        the engine + UI (vanilla JS, no framework/build system)
src/extract.js    in-browser port of extract.py (the importer)
data/data.json    the digest (spells, classes, subclasses, feats, species, sources)
data/data.js      window.__DATA__ = … (generated for the dev page)
data/data-srd.json  the SRD 5.2 subset, committed and inlined into docs/
extract.py        5etools mirror → data/data.json + data/data-srd.json
build.py          inlines everything into dist/index.html and docs/index.html
serve.py          dev server (see Develop, below)
bump.py           bumps VERSION and rebuilds
VERSION           single source of truth for the version tag
dist/index.html   the built, offline, single-file deliverable (local only)
docs/             the public GitHub Pages build (SRD 5.2 inlined; more imported at runtime)
```

### Develop

```bash
python3 serve.py 8000            # then open http://localhost:8000/src/index.html
```

Use `serve.py`, **not** `python3 -m http.server` — the latter evaluates `os.getcwd()`
at argparse time, which the preview sandbox blocks. `serve.py` sends
`Cache-Control: no-store`, so a plain reload always picks up edits.

### Update the data (after refreshing your 5etools mirror) & rebuild

```bash
python3 extract.py "/path/to/5etool_mirror/5etools-vX.Y.Z/data"
python3 build.py
```

Built to match the `monster-forge` / `character-forge` house style: vanilla JS,
5etools as the data source, no build framework.

## Known gaps / next
`PLAN.md` is the live queue — this list is only the long-standing ones.
- **After updating the app, re-import your 5etools data.** Creature sets and grant notes are
  produced by the extractors, so an import made before them carries neither, and per-spell
  data cannot be back-filled. The baked stat blocks survive an old import; the rest doesn't.
- A handful of 2024 features grant spells in **prose only** (Mystic Arcanum, the Wizard school
  Savants, Knowledge Domain's Mind Magic, the Cleric capstone). 5etools models none of them, so
  they are hand-authored in `PROSE_GRANTS` in both extractors — re-run the audit sweeps in
  `GOTCHAS.md` after a 5etools update to catch new ones.
- Features that let you cast for free a spell you **already know** (Paladin's Smite, Ranger's
  Favored Enemy, and ~10 more) carry no note yet — notes only reach spells a feature *grants*.
- Polymorph / Shapechange / True Polymorph name open-ended creature sets (any beast up to a CR),
  which is the whole bestiary — out of scope against the 65 stat blocks the digest carries.
- Prerequisites the app can't verify (ability scores, proficiencies, backgrounds,
  campaigns) read "can't check" rather than pass/fail; closing that means modelling
  ability scores.
- High Elf's swappable cantrip shows as prepared (●) but is swapped in the
  Choices panel, not toggled in the table.
- No custom-spell manager (homebrew is edited one spell at a time, from its modal).
