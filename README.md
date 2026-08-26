# My Spellbook

A one-page, offline tool for planning a D&D 2024 character's spells: it works out
**which spells you can take, at which level at most, and from which source** —
across multiclassing, subclass grants, feats, species, and their choices.

Open **`dist/index.html`** in any browser (double-click). Fully self-contained,
no internet, no install. Also publishable as-is (single file).

## What it does

- **2024 (XPHB) rules.** A **Sources** panel (⋯ menu) enables/disables any book,
  5etools-style; the *Editions* filter hides reprinted legacy entries by default.
- **Build** any character: class + subclass + level rows (true multiclass;
  non-caster classes allowed), species, spell-granting feats, manual extras.
- **Choices to make** panel surfaces every spell choice a build implies —
  subclass options (Circle of the Land terrain), Magic Initiate's list, "choose N"
  picks (which open a filtered spell-pick modal), Fighting-Style spell options
  (Ranger → Druidic Warrior), and the Cleric/Druid order extra-cantrip.
- **Prepared budget & picks**: per-class cantrip/prepared meters. For **level-swap
  casters** (Sorcerer/Bard/Warlock) it shows the best-case *count per level* from
  the level-up swap rule and flags over-cap picks; **daily casters** re-prepare
  freely; **Wizard** shows the spellbook + daily-prepared dual budget.
- **Casting ability** is resolved per source (defaults to your shared class stat;
  lets you choose where the source allows) and is a grouping option in the table.
- **Spell table** tab: streamlined rows (name, school, time, range, duration,
  concentration, casts/recharge, source), grouped by level / casting ability /
  source; daily casters can show all eligible and toggle selection inline.
- **Spell details**: hover a spell for a tooltip; click for a full modal
  (centered on desktop, bottom-sheet on mobile).

## The rules that matter

- **Max spell level per class** is set by that class's own level; multiclassing
  only changes *slots*. Higher slots just upcast.
- **The swap distribution** (level-swap casters): each class level you add the new
  prepared spells at that level's max, plus one swap. So not every slot can be top
  level — the tool computes the best-case count per level.
- **Magical Secrets** (Bard) is a list expansion (Cleric/Druid/Wizard, level-gated).

## Repo layout

```
src/index.html   HTML shell (dev: links styles.css, app.js, ../data/data.js)
src/styles.css   all styling
src/app.js        the engine + UI (vanilla JS, no framework/build system)
data/data.json    the digest (spells, classes, subclasses, feats, species, sources)
data/data.js      window.__DATA__ = … (generated for the dev page)
extract.py        5etools mirror → data/data.json
build.py          data.json → data/data.js  +  dist/index.html (self-contained)
dist/index.html   the built, offline, single-file deliverable
```

### Develop

```bash
python3 -m http.server 8000      # then open http://localhost:8000/src/index.html
```

### Update the data (after refreshing your 5etools mirror) & rebuild

```bash
python3 extract.py "/path/to/5etool_mirror/5etools-vX.Y.Z/data"
python3 build.py
```

Built to match the `monster-forge` / `character-forge` house style: vanilla JS,
5etools as the data source, no build framework.

## Known gaps / next
- Some 2024 feature names aren't in 5etools' `additionalSpells` blocks (e.g.
  Lore's "Magical Discoveries") — those choices fall back to the subclass name.
- High Elf's swappable cantrip shows as prepared (●) but is swapped in the
  Choices panel, not toggled in the table.
- No runtime "load 5etools files" panel yet (use the regenerate step above).
- Per-source subclass de-duplication in the picker.
