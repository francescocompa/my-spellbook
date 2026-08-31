# GOTCHAS — My Spellbook

> Traps that have already cost a session, and the rules that stop them recurring. This is
> the copy to trust: where a decision in `DECISIONS.md` is marked **→ Gotcha**, the full
> rule is here.
>
> Read this before touching the extractors, the importer, the grants resolution or any
> DOM handler. Moved out of `STATE.md` on 2026-08-27 (v1.1); nothing was dropped.

- **`DATA.sources` knows only books that publish SPELLS or CLASSES — not bestiary books (D107).**
  Both extractors build the source registry from spell/class content, so MM, XMM, XDMG, ToA, WDH,
  WDMM, BAM and friends are absent even when their monsters are loaded. Anything that filters a
  creature list against `DATA.sources` therefore (a) drops most books from the checklist and
  (b) reads them as OFF, because `srcOn()` cannot say yes to a code it has never seen. That is
  exactly what happened to Find Familiar: 8 of its 12 books were invisible and its carousel opened
  on **2 of 65** forms, with the full set appearing only when you unticked everything and hit the
  "empty selection shows all" fallback. `wireCreatureNav` now builds its own source map from the
  FORMS and defaults an unknown book to on — unknown must never read as excluded (D31). Any future
  creature-side filter has to do the same.
- **Content assembly:** `window.__DATA__` (baked) is optional now. `assembleData()` picks
  imported > baked > empty, merges custom homebrew, calls `buildIndexes()`. Indexes
  (CLS_BY, SPELL_BY, …) are `let`, rebuilt on every content change — never captured.
- **The imported digest is in IndexedDB, and `assembleData()` is still SYNCHRONOUS (D93).** It
  reads `IMPORT_CACHE`, which `importLoad()` fills once inside the async boot IIFE — that is the
  whole reason every other caller stayed unchanged. **Nothing may read the digest before that
  await resolves**: `maybeOnboard()` pops the welcome importer when the app has no content, so
  running boot early shows onboarding over a library that is still loading. Writes go through
  `importSave()`, which returns **null or a sentence** (never a boolean) and only replaces
  `IMPORT_CACHE` once the write resolves, so a failed save can't lose what you already had.
  One database `spellForge`, stores `kv` (content) and `handles` (D92's directory handle).
- **extract.js ↔ extract.py** must stay in sync (same digest shape). `asArr`/coerced
  `parseGrants` handle 5etools bare-value-instead-of-list quirks.
- **`foundry*.json` is the single most damaging file class in a 5etools zip, and it bit for
  real (D82).** extract.py never reads them (it globs `spells-*.json` / `class-*.json`
  explicitly), but the importer's `zipWanted()` excluded only `foundry-*.json` — so
  `spells/foundry.json` (319 stubs), `class/foundry.json` (12 classes + 19 subclasses) and
  `bestiary/foundry.json` (11 monsters) all sailed through and **overwrote real records by
  `name|source`**. Symptom: a spell modal with a level, school, range, components, duration and
  description all blank, and an import report reading 39 classes / 341 subclasses instead of
  27 / 315. Fixed on the name (`startsWith("foundry")`) plus a `migrationVersion` guard, since
  that field marks a Foundry stub and no real record carries it.
- **A parity harness must drive the REAL predicates.** The old `scratchpad/cparity.js` rolled its
  own file filter that happened to be STRICTER than `zipWanted()` — which is exactly how the bug
  above hid through two sessions of "parity is exact". It now imports `zipWanted` and
  `dropFoundryStubs` from extract.js and asserts on the record that broke. Parity is **exact**:
  936 spells, 27 classes, 78 monsters, 276/276 feats, 213/213 optional features, prereqs
  byte-identical — and since 2026-08-28 a **whole-record canonical diff** covers every field of
  every shared record in all six arrays plus the monsters map, so the next drift class needs no
  curated check to be caught. Its canonical form: keys sorted, `undefined` ≡ absent, extract.py's
  own `srd` field skipped; everything else — explicit `null` included — must match byte for byte.
- **Spell-source lookup** (`generated/gendata-spell-source-lookup.json`) is what gives spells
  their `cls`/`sub`/`feat`/`race` access — without it imported spells match no class.
  **And a second file in the export is lookup-SHAPED: `spells/sources.json` (D91).** Same
  `SOURCE → Spell Name → {class…}` structure, but keyed in ORIGINAL case where the generated one
  is lowercased and the spell map is keyed `name|source` lowercase. `looksLikeLookup()` matched
  it by shape and, arriving later, it **overwrote the real lookup** — so every zip import shipped
  936 spells no class could cast, while extract.py (which loads the generated file by explicit
  path) stayed correct. A name match now LOCKS (`lookupNamed`) and keys fold through `spellKey()`
  on use. **This hid for two sessions because `cparity.js` diffed grants but never ACCESS** —
  exactly the "a parity harness must drive the REAL predicates" lesson, a second time. The harness
  now diffs `cls`/`sub`/`feat`/`race` per spell and asserts the with-access COUNT against
  extract.py; reintroduce the bug and it reports 921 diffs. If imported spells ever match no
  class again, look here first.
- **A brew's own `_meta.sources` outranks its `book[]` entries (D92).** A collection brew may carry
  `book` records that REUSE its source code for sub-products: "D&D Beyond Drops" ships four, all
  map bundles. `book[]` was applied first and overwrote unconditionally, so the last one won and
  eight spells filed themselves under **"D&D Beyond Drops—Sewer Maps"** in group `other` — off the
  "Homebrew & UA" shelf and effectively unfindable. `_meta.sources` now runs FIRST, records the
  code in `brewSrc`, and `book[]` may not rename anything in that set.
- **The folder scan must reuse `zipWanted()`, never its own filter (D92).** Same rule the zip
  reader learned the hard way. It also skips `_img/` at the WALK (the FSA path) and by
  `webkitRelativePath` (the input path) — a synthetic entry list bypasses both, so a test that
  fabricates entries is not testing the filter.
- **A remembered directory handle is not a granted one (D92).** The handle survives in IndexedDB;
  the READ PERMISSION dies with the session and can only be re-requested inside a user gesture.
  `folderUsable(h,ask)` takes `ask=false` on the silent recall in `openImport` and `true` in the
  Rescan click. If it fails, forget the handle and offer the picker — never fail silently.
- **A big zip fails as a lie (D91).** `file.arrayBuffer()` on an oversized archive throws
  `NotReadableError`, whose stock message blames *"permission problems"* — the cause is size.
  `stageZip` refuses above `MAX_ZIP` (512 MB) by measured size, translates the OOM, and passes the
  progress callback. Reference: a full 5etools `data` export ≈ **24 MB / 503 files**; the homebrew
  repo as one zip is **gigabytes** and can never work — individual brews are ~60 KB.
- **`innate` has two shapes.** `{"_": {"daily": {...}}}` (a cadence map) AND
  `{"_": ["mage armor|xphb"]}` (a bare list = at-will). The list form was skipped by an
  `isinstance(dict)` guard, silently dropping **42 grant blocks** (23 optional features,
  9 subclasses, 9 species, 1 class). Both extractors handle both now — if grants ever go
  missing, check this first.
- **Artificer infusions grant no spells at all**, so they're out of D28 by construction; the
  **2024 Artificer (EFA) has no `optionalfeatureProgression`**. Don't go looking for either.
- **Homebrew source = "HB"**; auto-enabled on boot when custom spells exist.
- **SRD subset** = entities with 5etools `srd52` truthy (extract.py `_srd_subset`). All 12
  XPHB classes are srd52. Public data is inlined in the committed `docs/index.html` (CC-BY, fine
  to be public); `data-srd.json` itself is gitignored. **Keep the credit footer** for CC-BY.
- **Level budget model (D18/D20):** known/level-swap casters (`static` — Bard, Sorcerer) have a
  *progressive* per-level ceiling from `capsFor().cap[L]` (= max spells at level ≥ L); tiles show
  live room addable at each level, and `overLevels[L]` flags a level over. Daily preparers
  (`static=false`) are free — only the total + max castable level bind. **The wizard spellbook is
  its own third kind**: `known.cap[L]` is progressive too (from the `spellbook` growth array, no
  swap term), and exceeding a level's cap is **not an error** — it's the legal "copy into
  spellbook", shown in accent, not red. Enforcement everywhere is soft (flag, no hard block).
- **Edition dedupe (D19):** `SHADOWED` (WeakSet, rebuilt each `buildIndexes`) hides duplicate
  editions of the same element; `reprint→all` reveals them. HB never participates. **Species do
  NOT key on the name** (D69) — a lineage gets renamed between editions (`Elf (High)` →
  `Elf — High Elf`), so `raceDedupeId()` keys on `base|lineage` with the base word stripped off
  the lineage. Widen that normalization carefully: it is the only thing keeping the SCAG/MTF
  variants and the Kaladesh/Zendikar settings from collapsing into the XPHB lineages.
- **Prerequisites are advisory (D31).** `prereqState()` returns ok/maybe/no; "maybe" means the
  app can't verify (ability scores, proficiencies, backgrounds). Never turn "maybe" into "no" —
  it would hide legal picks. Nothing is ever blocked or auto-removed, only flagged.
- Grants tree `{fixed, picks, expansions, optionGroups, ability}`; path-based choice ids stable.
- Cart/choices keyed by stable row id (`state.nextRowId`), never array index.
- **Column layout is global**, under its own key `spellForge.table.v1` — NOT part of the build
  blob. Adding a column means adding it to both `TABLE_COLS` and `COL_ORDER_DEFAULT`;
  `loadTableOpts` appends unknown-but-new keys so an old saved order doesn't hide a new column.
- **Builds layer (T1–T3, D33–D35).** `spellForge.builds.v1` =
  `{activeId, order, builds:{id:{meta,state}}}`; `spellForge.sources.v1` is the **global** book
  list — `SRC`, a module-level Set, **NOT `state`**. Nothing may put sources back inside a build.
  `save()` = auto-save the active build. `meta.character` is a grouping label only (level-free,
  auto-follows until `meta.named`), and grouping happens **at render time** — never build a
  character object. Legacy `spellForge.v2` is read once for migration and then left alone as a
  rollback — do not delete it before v7 ships.
- **Build manager (T3).** `#buildModal` from the ⋯ menu. `switchBuild()` flushes the outgoing
  build with `save()` first, then `applyState()`. `deleteBuild()` must never leave zero builds;
  it creates a fresh one instead.
- **Nothing prunes on a source change (D42).** `afterSourceChange()` only fixes the filter
  override; `pruneState()` drops refs to content that no longer EXISTS. If a pick ever disappears
  when you untick a book, something has re-added pruning. The visible contract is the gap banner
  (`renderGapBar`), `.gapped` fields, and the activation dialog (`#srcAskModal`, which asks about
  `buildGaps().books` — **not** `meta.sources`, which would list 40+ irrelevant books). Keep all
  three in sync with any new pick kind.
- **A `<select>` must always contain its own current value.** `classOptions(keep)` and the
  subclass list take the row's key so a hidden entry stays selectable; without that the browser
  silently selects option 0 and the next edit writes the wrong class into the build. The same
  class of bug had `refreshSpecies()` clearing `state.speciesKey` outright.
- **Picker book overrides can widen** past the global source list. Committing a pick from a
  globally-disabled book **enables that book**, so the pick is visible in the surface you just
  used rather than immediately flagged. The spell filter's override can only narrow.
- **Dimmed spell rows (D40)** carry `dim:true` and a `why`, and have **no takers** — `mkSpell`
  returns early for them, so they can never be picked. If a dimmed row ever grows a take button,
  that early return has been broken.
- **`.bchip` vs `.srcbadge`** — `.bchip` (D39) names the **printed book**; `.srcbadge` names
  **who grants** the spell in your build and is colour-coded (free / cast). They look similar and
  are not interchangeable.
- **Native scrollbars follow `color-scheme`, not your CSS.** The "light scrollbar in dark mode"
  bug was a missing `color-scheme` on `:root`. It is now set in all three theme blocks (`:root`
  light, the `prefers-color-scheme:dark` block, `[data-theme=dark]`), plus themed
  `::-webkit-scrollbar` rules. **Any new theme block must set it too.**
- **Carets are drawn, not typed.** `⌄` (U+2304) sits wherever its font puts it, which is what made
  picker/access icons read as off-centre. `.pk-caret` and `.acc-toggle` draw a border chevron
  nudged up by `s·√2/4` (the ink of a rotated square lives in its lower half). Reuse that pattern
  rather than a glyph when an icon must sit optically centred.
- **Static preview cache:** editing `src/index.html` needs a hard reload (query-bust) — a plain
  reload serves stale HTML and new `$("#…")` lookups return null. Editing it also re-opens a
  `file://`/`data:` preview tab and fronts it — drive the `http://localhost` tab.
- **A top-level function may not call a closure local.** `cellFor()` (top level) called
  `slotCastable`, a `const` inside `renderTable()` — so the whole Spell table threw
  `ReferenceError` for any build holding a limited-use innate cast (a `1/LR` species grant is
  enough). It shipped. `slotCastable` is module scope now; check this shape when a helper moves.
- **`prepared`/`known`/`expanded` have THREE shapes, like `innate` does** — a bare list, a
  cadence map, and a **class-requirement group map** (`{"_":[…]}` = no requirement). The group
  form fell through to `spell_ref()` as a raw dict and silently discarded its `choose` filter:
  25 grants read "a spell" with no filter, High Elf's Wizard cantrip among them. `ungroup()` in
  both extractors handles it. **Same failure mode as the `innate` gotcha above — check it first
  when a grant is unfiltered or missing.**
- **Summon stat blocks (D50)** come from the bestiary's own `summonedBySpell` field, never from
  parsing `{@creature}` refs. 24 spells carry one. `sb_text`/`sbText` expand the tags whose
  meaning is in the tag NAME (`{@h}`, `{@atkr}`, `{@actSave}`, `{@hit}`) **before** `rich_strip`
  reaches them — that is why `flatten_entries` takes a `strip` parameter. `_srd_subset()` strips
  a non-SRD stat block off an SRD spell. The importer's `slimJson()` keeps only summon monsters
  from a bestiary file; without it a full bestiary would reach localStorage.
- **The mobile jump bar (D48) must not use `behavior:"smooth"` alone.** Some embedded webviews
  accept the call and never scroll — and CSS `scroll-behavior:smooth` on `html` breaks even a
  plain `scrollIntoView` there. `jumpTo()` asks for smooth and jumps after 180 ms if nothing
  moved. Its button set is rebuilt only when the section list changes, so `bar.dataset.sig`
  must be **cleared** whenever the bar is emptied (switching to the table tab) — otherwise
  coming back finds a stale match and renders nothing.
- **Native `confirm()`/`alert()` are banned (D53)** — they silently no-op in embedded webviews
  (confirm returns false with no dialog). Destructive actions use `armConfirm()`. If a button
  ever "does nothing", check for a reintroduced native dialog first.
- **Icons are `ICONS`/`icoEl`/`xBtn` only (D57)** — never a glyph in `textContent`. Static
  markup uses `data-ico` + boot `fillIcons()`. `<option>` elements are the one exception
  (no markup allowed inside). Sizing lives in CSS per context, not in the SVG.
- **The dev server sends `Cache-Control: no-store`** (serve.py) — the old "hard-reload after
  editing" gotcha is gone, but an already-open TAB still runs old code until one reload; a
  cached-before-the-change browser needs one `fetch(url,{cache:'reload'})` bypass.
- **Preview (D54) is module state, never saved.** Every level consumer must go through
  `effLevel(row)` / `charLevel()` — reading `row.level` directly leaks full-level numbers into
  a preview. `state.levelOrder` normalizes through `classLevelPlan()`; never trust it raw.
- **A custom-source entry is a named spell OR a choice (D96).** `csrcIsPick(e)` (i.e. `e.pick`)
  distinguishes them, and `csrcRowId(e)` = `e.key||e.id` because a pick has no spell key —
  anything keying rows on `e.key` will collide or silently no-op on picks. A pick's filter uses
  `filterSpells`' own grammar: `;`-joined values, **absent key = unconstrained**, so an empty
  filter matches every spell (which is why a new choice row opens expanded). `picks` in the
  grants tree carry `extra` now — they used to drop it, which would have cost a picked spell its
  source's DC and attack.
- **A spell's payment is per SPELL, not per source (D95).** `csrcPay(cs,e)` is the only correct
  way to ask how a spell is paid for: it reads `e.pay`, falls back to the pre-D95 source-level
  `cs.uses`, and finally infers from whether a pool exists. **Never read `cs.uses` directly** —
  it is legacy-only and the editor deletes it on open and save. A source may hold a pool AND
  spells on their own uses at once, so anything describing a source (the rule line, `csrcPower`,
  the summary) has to be able to say both. Adding a UNIT means updating `CSRC_UNITS` **and**
  `rechargeShort()` — the latter falls through to "—", which reads as *no limit* and is the
  opposite of what `total` means.
- **A folded section must carry its own state on its label (D94).** The custom-source editor
  folds "how it works", "its own numbers" and each row's fixed cast level. Every one of them
  reports what it is holding while closed — the rule line spells the mode out, the numbers label
  reads "set — DC 15, +7, Intelligence" in accent, a row with a fixed level shows an `at 5th`
  tag. A disclosure that hides a value you set is a trap, not a simplification. Both disclosures
  and every row caret reset to CLOSED on each `openCsrc` (verified over 12 dirty-state reopens).
- **Homebrew import**: books come from `_meta.sources` (group "brew"), spell access from the
  spell's INLINE `classes` field. Both only ADD to what the generated lookup knows.
  ~~An import replaces the previous one — stage core + brews together.~~ **Void since D86:** an
  import MERGES, so a brew can arrive on its own long after the core data.
- **`attachTip()` must be called AFTER an element's own `onclick`** — it used to overwrite the
  handler outright, which silently disabled the preview's "order…" button. It now preserves an
  existing handler; `detachTip()` clears a reused node's stale tip.
- **An empty stored import must not beat the baked data.** `assembleData` took `IMPORTED||BAKED`,
  so a digest that stored but held nothing left `DATA` empty and popped the welcome importer over
  a build that had been working. Content beats presence now.
- **A list whose height changes under a fixed control must pin that control.** The creature
  carousel holds `nav.getBoundingClientRect().top` across the repaint and adds the delta to the
  modal's scroller. Any in-place swap under a control needs the same, or the control moves out
  from under the cursor.
- **A `<button>` may not contain a `<button>` — the parser HOISTS the inner one out.** This has
  now bitten twice: the build-switcher row (caught while building it) and the stat block head,
  where nesting the book icon inside the head button threw the icon AND the chevron out of the
  header onto their own line. Any header that carries its own controls must be a `div` row of
  sibling buttons, with the label part `flex:0 1 auto; min-width:0` + ellipsis so the TEXT gives
  way and the controls never wrap.
- **A nested action button must stop its click** — `xBtn` does. If a handler re-renders, the
  original event keeps bubbling and hits the *freshly attached* parent handler: dismissing the
  level preview immediately re-armed it that way. Watch for this in any rebuild-on-click.
  **The same bug wears a second face on outside-click closers (E5):** a handler that re-renders
  detaches the click's target, so when the event reaches a document-level "was this outside?"
  listener, `target.closest(...)` finds nothing and an INSIDE click reads as outside — the
  timeline popover shut itself on every row jump this way. Since D122 the timeline is a MODAL
  and its closer is a strict `e.target===backdrop` equality — a detached target can never equal
  the backdrop, so the trap is closed by construction. Any future document-level closer still
  needs both guards: the inner handler stops propagation, and the closer must not trust a
  possibly-detached `e.target` — **prefer `e.composedPath()`** (fixed at dispatch, so it
  answers truthfully for BOTH a re-rendered inside click and a re-rendering outside click;
  the older `!document.contains(e.target)`-reads-as-inside guard keeps genuinely-outside
  clicks from closing whenever the click re-rendered something). The menus' closer does
  this since the W1 batch.
- **A fixed popover under a scrolling page re-anchors, it doesn't close** — the rule that kept
  the E5 chip-anchored timeline alive mid-walk (a jump re-renders the page, and that alone
  fires scroll events). **The timeline is a full modal since D122**, so its re-anchor machinery
  (`placeTimeline`, the rAF scroll listener) is deliberately GONE — do not restore it. The rule
  itself stands for any future chip-anchored popover. The build-switcher's close-on-scroll
  menus are DIFFERENT: tiny row menus whose anchor lists scroll under them — don't "fix"
  either to match the other.
- **Preview is a VIEWER (D64) — in the code as it stands; D115 supersedes the viewer, not the
  rule.** Phase E makes the level view editable with a saved current level, but per-level truth
  comes from an acquisition ORDER, sliced. The standing trap is unchanged: do not reintroduce
  `atLevel` stamps on picks — stamps cannot express retraining intervals and D115(b,h)
  re-rejected them.
- **A wizard has two sets (D62):** `chosen[idx].spells` is the spellbook, `chosen[idx].prep` is
  today's prepared subset. Anything that reads "what is prepared" must branch on
  `cart.known.book`, or it will treat the whole book as prepared.
- **Custom sources (D55/D65)** synthesize grants via `customSourceGrants` + `resolveGrants` (tok
  `x<id>`), EXCEPT `mode:"list"`, which widens the eligible pool instead. Per-grant extras
  (DC, attack, fixed cast level) ride through `spellOut`'s `extra` argument. They must never
  grow their own downstream path.
- **`.tk.over` must not eat `.tk.on` (D72/D79).** A selected take chip on an over-budget class
  used to render entirely red, because `.tk.over` follows `.tk.on` at equal specificity — which
  is why selection "sometimes didn't highlight". Selection owns the **border and the icon**;
  `.over` owns the text. `.tk.on.over` restates the green border after both.
- **Two extractor tables are hand-authored and must stay in lockstep (D79):** `PROSE_GRANTS`
  (features that grant spells in prose with no `additionalSpells` — Mystic Arcanum and friends)
  and `MOD_RE` (the sentences that become a grant's `note`). **A hand table can also go stale
  the OTHER way: 5etools grew structured picks for the school Savants (2026-08-28) and the
  merge double-granted them** — `mergeProseGrants`/`merge_prose_grants` now skip any entry
  whose `feature` name the record already carries, so a table entry retires itself the day
  the mirror catches up. Both exist in extract.py AND
  extract.js, plus **`CAST_MODS`** (D85). `scratchpad/gparity.js` is **gone** — `cparity.js`
  absorbed it and now diffs grants record-by-record across all five arrays, cast mods, the feat
  `catName` histogram, the category-exclusive list and the note count. It reports **0 diffs and
  0 one-sided records**; the "pre-existing RHW walker-scope difference" recorded here was
  `feature: undefined` vs `null` in extract.js, and is fixed.
- **The audit that found these:** two sweeps over the mirror — ① features whose prose names a
  `{@spell}` the digest doesn't grant (mostly false positives: "Spellcasting" prose lists example
  spells), ② features with NO `additionalSpells` whose prose says "choose … spell" or "cast …
  without expending". Sweep ② is the one that matters; rerun it after any 5etools update.
- **A creature set is `sp.creatures` (keys) + `DATA.monsters` (blocks), never inlined (D78).**
  `spellCreatures(sp)` = the spell's own summon block, then every carried monster whose book is
  on. `carried_monster()` in extract.py and `carriedMonster()` in extract.js **must stay
  identical** — the Node harness in `scratchpad/cparity.js` diffs both sides and must report
  `diffs=0`. An import built before D78 carries no `monsters`, so `assembleData` keeps the BAKED
  map underneath it; **per-spell `creatures` cannot be back-filled — a re-import is needed.**
- **A ratio widget may never print a denominator below its numerator (D70).** Being over a shared
  TOTAL drives every per-level `room` negative at once; clamping that at 0 produced "4 of up to 0".
  `free` (real room) and `ceil` (what is displayed) are separate values now — `free` still drives
  the over/copied states, `ceil` floors at what is held.
- **A row highlight must not fight its own divider (D72).** A rounded background behind a row with
  `border-bottom` cuts the rule at the corners. `.sp` picked rows use an inset `::before` rail; the
  padding that holds it is on EVERY row so selection never shifts the layout, and the rail insets
  vertically so adjacent picked rows don't merge into one bar.
- **Slots and max spell level are DIFFERENT clocks (D68).** Max spell level comes from a class's
  OWN level (`maxLvlAt(caster,classLevel)`); slots come from the COMBINED caster level
  (`planSlots()` over the whole level plan, or `R.mcSlots`). Deriving one from the other is what
  put the slot gain on the wrong level card. Anything new that reports "what this level gave you"
  must read both, separately.
- **An icon-only button that ARMS needs its icon appended BEFORE `armConfirm`** (D66) —
  `armConfirm` snapshots `innerHTML` as the restore state, so arming an empty button and
  disarming it leaves it blank. Same call order rule as `attachTip` after `onclick`.
- **A `position:fixed` child escapes an ancestor's `overflow` clip — that is the fix, not a hack.**
  The build switcher's row menu lived inside `#bswPop`, which is `overflow:auto`, so it was cut off
  (batch 9). It is `position:fixed` now, placed from the button's own rect and **closed on the
  popover's `scroll`**, because a fixed element does not travel with the list under it. `closeMenu`
  and Escape both call `closeBswMenus()`. Reuse this shape for any menu inside a scroller.
- **A `<button>` may not contain an `<input>` either** — the switcher's row was one big button and
  could not hold the name field, exactly as it could not hold the ⋯ button. It is a `div` with
  `tabindex`/`role="button"` and its own Enter/Space handler; `nameInput()` stops propagation so a
  keystroke never reaches the row.
- **A name field's `onblur` must not re-render the control the next click is travelling to.**
  Committing a rename in the switcher calls `afterBuildMeta(false)` — header and manager only.
  Re-rendering the popover there would destroy the ⋯ button between mousedown and mouseup, so the
  click never lands. Only the character rename (which can regroup rows) passes `true`.
- **A feat slot is gained at a CLASS level but arrives at a CHARACTER level, and only the second
  one qualifies an Epic Boon (D114).** `charLevel()>=19` is not "you have a feat slot at 19" —
  Fighter 10 / Wizard 9 is level 19 with slots at 4, 6, 8, 14, 18 and none after, while
  Warlock 4 / Fighter 4 / Bard 12 has two, at 19 **and** 20. `featSlotLevels()` walks
  `classLevelPlan()` and is the only correct source for this; it also honours `PREVIEW.level` by
  slicing the plan, so never re-derive it from `effLevel(row)`, which knows class levels only.
  A boon **spends** a slot — anything counting feats must use `slotsUsed` (general + epic), or the
  budget offers one more feat than the character has.
- **Feat category ≠ feat slot (D84).** `featCatId`/`featCatLabel` are the book's own label;
  `featSlot` is what it can be spent from; `featSlotOf(key)` is what it WAS spent from
  (`state.featSlots`, validated against `SLOTS_FOR` on read, so a stale record can't misattribute).
  Every budget count goes through `featSlotOf` — never through the category. `SLOTS_FOR.general`
  is `["general","origin"]`: **origin is a subset of general**, and anything that re-narrows it
  puts Wild Talents and Dragonmarks back out of reach at an ASI.
- **Cast mods are resolved per RENDER, not cached across one (D85).** `CASTMODS` is refreshed at
  the top of `render()` AND `renderClassRows()` AND `refreshAll()`, because `#addClass`'s handler
  calls `renderClassRows()` without `refreshAll()`. `modsForSpell(sp,row)` needs the ROW to know
  which class is casting; with no row (the spell modal) it falls back to the spell's own class
  list. A mod carrying `when` may only MARK a component, never strike it — that distinction is
  the whole honesty of the feature.
- **`CAST_MODS` is the third hand-authored extractor table** (after `PROSE_GRANTS` and `MOD_RE`)
  and must stay identical in extract.py AND extract.js — `scratchpad/cparity.js` diffs it, plus
  the feat `catName` histogram, the category-exclusive list and the grant-note count. Run it after
  ANY extractor edit.
- **An import merges; a book's NAME must survive the merge (D86).** A file that references a
  source it doesn't declare emits the bare code as that book's name and `other` as its group, so a
  plain `Object.assign` turned "Test Book A" back into "TSTA" on the next import. `mergeSources()`
  keeps a real title over a placeholder. Entities are keyed by `name|source`
  (`className|shortName|source` for subclasses, which also collapses the 124 genuinely duplicate
  subclass records the mirror emits, 322 → 198).
- **A stat block is filtered by the SPELLS that reference it, never by its own book (D86).** A
  bestiary source (MM, XMM, IDRotF…) never reaches the source registry — it has no spells or
  classes to count — so keying `filterDigest`'s monster pass on `keep` dropped 63 of 65 creatures
  and emptied Find Familiar's carousel. `out.spells[].creatures` is the only correct gate.
- **The Library's "available" books live only in `SCAN` until Apply (D112).** A dimmed row is a
  book the scanned folder offers; ticking it puts its code into `PLAN.keep` while
  `PLAN.merged.sources` still lacks it — `applyImport` materializes those by staging their files
  (plus the bookless aux files) and re-parsing, THEN restores the keep-set, because
  `planFromStage` re-defaults it. Anything comparing `PLAN.keep` against `merged.sources` must
  expect codes the merge hasn't seen yet.
- **`openImport`'s folder recall is fire-and-forget, so a caller that needs `FOLDER` must await
  its own (D111).** The recall is an async IndexedDB read the modal never waits on; on the first
  click of a session `FOLDER` is still null immediately after `openImport` returns. `refreshImported`
  therefore fell straight through to "choose the folder" — a one-click action that only opened the
  modal. It now awaits `folderRecall()` itself, still inside the click, which is what keeps the
  permission prompt (`folderUsable(h,true)`) inside a user gesture.
- **A dropped folder's handles must be collected synchronously in the drop handler.**
  `DataTransferItem.getAsFileSystemHandle()` calls are made for every item BEFORE the first
  `await` — the DataTransfer goes stale at the first microtask, and a late call returns null.
  The webkitGetAsEntry fallback has the same rule for `getAsFileSystemHandle`-less browsers.
- **`buildImport(only, auto)` — the auto path must not scold and must not reset your unticks.**
  Parse-on-arrival (D112) re-runs `buildImport` after every staged batch; `planFromStage`
  defaults the keep-set to everything merged, so the auto path re-applies the previous unticks
  (except for freshly staged books). An empty stage in auto mode clears the incoming layer
  silently — the "stage a file first" message is for the manual path only.
- **Never persist `FILTER_DEFAULT()` (or any live-Set object) into a stored blob.** Its Sets
  JSON.stringify to `{}`, and the next boot's `new Set({})` threw "object is not iterable" and
  killed the boot IIFE half-rendered. The importer stored it as the fallback for a file with no
  filters (`applyImportedState`), so any imported build could plant the mine and it went off on
  the NEXT reload — far from the cause. Fixed both ends (E1 session): the importer stores `null`
  (applyState's own healthy path) and `applyState` guards every Set construction with
  `Array.isArray`, so a malformed stored blob heals on load instead of bricking. Stored filter
  state is arrays-or-null, always; only the live `state.filters` holds Sets.
- **The pick arrays ARE the acquisition order (E1 · D115(b,h)).** `state.feats`, `state.optFeats`
  and each `state.chosen[rowId].cantrips`/`.spells` list picks in acquisition order; per-level
  truth is a slice of it. Nothing may sort a stored pick array in place — every render-side sort
  copies first (`.map()`, `[...]`), and a new one must too. `state.swaps` is keyed by character
  level, ONE EVENT PER KIND — `{spell?, cantrip?}` since D128 (a level can hold a spell
  trade AND a cantrip trade; old single-event blobs heal at every stored-state boundary via
  `swapsNorm`). Read swaps only through `swapEvents()`/`swapAt()` — nothing else may assume
  the map's depth. A row's swap events are dropped with the row (`dropRowSwaps`), exactly
  like its `chosen` lists.
- **The consistency sweep must NEVER read `PREVIEW` (E4 · D115(f)).** `buildHealth()` walks the
  raw pick arrays and the full level plan, not the sliced view — a problem at level 5 has to be
  visible while you stand at 12, which is the badge's entire reason to exist. Anything that
  "optimizes" it to reuse `sliceChosen()`/`featsAt()` silently turns the badge into a report on
  the current view and the done-when stops holding. The BAR is the level-local half (it reads
  `PREVIEW.level` deliberately); the badge is build-wide — since E5 it is the ⚠ ON THE LEVEL
  CHIP, whose tip names the offending levels and whose timeline rows locate each finding. Both
  are advisory (D31): they name and locate, they never remove or block.
- **A preparer's spell list is not swept, and must not be.** `rowSched().spells` is null for a
  daily preparer (Cleric, Druid, Paladin…), and the sweep returns before the spell loop — a
  prepared list is re-chosen every long rest (D18/D115(c)), so "acquired at level N" is
  meaningless for it. Deleting that guard flags every prepared spell as over-budget. Wizard
  copies beyond the free allowance are legal the same way and are exempted by `sched.book`.
- **`save()`'s identical-write skip must compare DETACHED copies, never the live objects
  (D120, found by the E8 gate).** `serializeState()` returns `state`'s own arrays and maps by
  reference, and both `save()` (`b.state=s`) and boot (`applyState(activeBuild().state)`) made
  the stored build and the live state SHARE those sub-objects. An in-place pick edit then
  mutated both sides of D116(d)'s stringify compare at once, the write read as "identical"
  and was skipped — so a session that only toggled spells persisted NOTHING and lost every
  pick on reload, while any primitive-field edit (level, pin, rename) incidentally flushed
  the shared graph and hid the hole. Regression window v1.2.2 → v1.2.9. The fix is a JSON
  round-trip on BOTH boundaries: `save()` stores a detached copy, `applyState` detaches what
  it reads. If picks ever vanish on reload again while other edits stick, look here first —
  and never assign a `serializeState()` result (or anything holding `state`'s sub-objects)
  into a stored build without detaching it.
- **The browser pane's localhost proxy can collapse DIFFERENT ports onto ONE shared origin**
  — so `serve.py 8095` is NOT an isolated sandbox just because the port differs, and
  `localStorage`/IndexedDB there may be the SAME storage the main session's :8000 tab uses.
  This burned a whole agent wave (2026-08-29): four agents "verified on isolated origins"
  while actually sharing one, their fixtures leaked into each other's runs, and the pane's
  scratch build was overwritten in place. Any agent that drives the pane must treat browser
  storage as SHARED: snapshot `spellForge.*` (and note IndexedDB) before writing, restore
  byte-identical after, and verify the restore — never trust port isolation.
- **The level columns' display order is a TOGGLE, but nothing computes descending
  (D132, amended by D141(a) v1.4.5).** Since v1.4.5 `levelColumn(plan,box,multi,asc)` owns
  BOTH orders: the guide's chain rail follows the walk direction (`asc=!guideWalkDown()`,
  so the walk's starting end is the top row) and the timeline has its own arrow strip
  (`tlOrderStrip`, `TL.asc` — display-only module state, never saved). The inversion is
  still purely a rendering concern: `plan` is still ascending, and **`wireRowDrag` takes
  PLAN indices** (`wireRowDrag(card, lv-1, plan, …)`), which is exactly why the one shared
  drag implementation needed no change and why the same drag on either surface, in either
  order, still yields the identical plan. If you ever find yourself converting a visual
  position into a plan index, stop — you are re-deriving something the call already has.
  Everything that reads order off the screen lives inside `levelColumn` with the flag: the
  run map keys on `to` (desc) / `from` (asc), `runjoin` asks about the card above
  (`lv+1` desc / `lv-1` asc), the divider sits above the run's first on-screen card, and
  `top()` split into `head()` (visual top, both orders — the order strip) and `growth()`
  ("+ add level" + growth ghost: head desc, foot asc). The card BODY stays per-surface and
  `wireRowDrag` stays separate, on plan indices. If a column-shape change ever tempts you
  to edit one renderer, it belongs in `levelColumn`; the acceptance test is the same drag
  on both surfaces IN BOTH ORDERS diffing to the identical plan, no-op refusals included.
- **A HIDDEN browser pane does not composite — the page looks broken when the code is fine.**
  While the pane is hidden, `innerWidth`/`innerHeight` read **0**, every
  `getBoundingClientRect()` collapses to `0,0` (so coordinate clicks are refused as
  "outside the viewport"), `requestAnimationFrame` never fires, and **CSS transitions freeze
  at `currentTime:0`** — meaning `getComputedStyle(el).transform` reads the IDENTITY matrix
  on an element that is in fact slid aside. An agent verifying a transition in a hidden pane
  will conclude the animation "doesn't work" and go hunting a bug that isn't there
  (2026-08-30, H4's drawer). Drive the DOM with `el.click()` and assert on classes, `inert`,
  computed `display` and text instead; force an animation's end state with
  `getAnimations().forEach(a=>a.finish())`; and only trust geometry once
  `tabs_context` says the pane is displayed.
- **`pkill -f serve.py` kills EVERY agent's dev server, not yours.** One agent's cleanup took
  down two sibling agents mid-verification (2026-08-30). And the obvious narrowing does not
  work either: `pkill -f "PORT=8011"` matches nothing, because `PORT` is an environment
  variable, not an argv token — it kills only the wrapping shell and leaves the python
  process serving. Kill by PID captured at launch, or resolve it:
  `lsof -nP -iTCP -sTCP:LISTEN | grep 8011` then `kill <pid>`.
- **The pick arrays hold an IDENTITY, not a record key (D135).** `state.feats` and
  `state.optFeats` may now hold `"Magic Initiate|XPHB"` **and** `"Magic Initiate|XPHB##2"` —
  a repeatable feat or invocation is held once per take, and the copy needs its own identity
  or its grants, its choices (`"f"+fk` is the whole token path, so every choice id under it
  would collide) and its feat slot are the first copy's. **Never `FEAT_BY[fk]` or
  `OPT_BY[ok]` on an array entry — always `FEAT_BY[baseKey(fk)]`.** The suffix is the only
  thing that keeps `featAcqLevels()`/`optAcqLevels()` (both Maps keyed by the entry) from
  silently dropping the second copy. Adds go through `nextCopy` (it reuses a freed ordinal),
  removals through `dropCopy`/`dropFeatCopy`, which take the LAST copy — renumbering was
  rejected because the survivor would inherit the removed copy's picks. Export/import
  carries the strings verbatim and the choice-id remap only touches `^[cs]\d+`, so a
  round-trip is safe.
- **A feat / optional feature / species IS its own granting feature — nothing was reading
  its prose (D135(e)).** `_mod_note` (D79) only ever ran through `SUBFEAT_INDEX` /
  `CLSFEAT_INDEX`, which exist because a CLASS's prose lives in a separate feature record.
  These three carry `entries` on the record itself, so for years every invocation's *"on
  yourself"*, *"while you're in an area of Dim Light or Darkness"*, *"without expending a
  spell slot"* was parsed away and the spell modal showed a bare "at will". `_own_note_blocks`
  fixes it, and it must stay **block by block**: the first cut flattened the record and put
  the Aasimar's *"Once you transform, you can't do so again"* on its Light cantrip. A named
  spell matches its own block, a pick matches the block carrying the same `@filter`, and
  anything unmatched keeps NO note — a missing note costs a line of prose, a wrong one
  tells you the wrong rule.
- **A grant kind that does not grant: `marks` must never reach `spellOut`.** A designation
  (Agonizing Blast → "choose one of your known Warlock cantrips that deals damage") rides
  the pick machinery so every existing surface draws it, which makes it very easy to hand it
  to the same `(state.choices[id]||[]).forEach(k=>spellOut(...))` line the real picks use.
  Do that and the designated cantrip becomes a granted free cast — a spell the character
  never paid for. Its only output is `out.marks`, read by `grantNotes` alone. The take-side
  twin is `markTake`: designating a cantrip you have not got spends one of the class's OWN
  slots (D135(b)), so it inserts into `state.chosen` at the E2 slice position — never a
  bonus pick beside the schedule.
- **A shared-literal "empty" is a shared LIST.** `dict(EMPTY_GRANTS)` copied the dict and
  handed all 200+ spell-less records the SAME `fixed`/`picks` arrays; the first `.append`
  anywhere would have shown up on every one of them. It is `empty_grants()` now. Any
  constant in these extractors holding a mutable value has this trap in it.
- **5etools tags its own prose too broadly, in two places that reach the table (D136).**
  ① `savingThrow` lists EVERY save the text mentions, so Synaptic Static carries Constitution
  because it *penalises* the target's later "Constitution saving throws to maintain
  Concentration" — a save this spell never makes anyone roll. `primary_saves` drops an
  ability whose *every* mention is that one clause and nothing else: a spell really can force
  several saves (Prismatic Spray, Symbol, 2014 Sleet Storm), and the phrasings for that are
  open-ended, so the first cut — reading the primary save out of "makes a/an X saving throw" —
  stripped real saves off four spells. ② `innate` sometimes holds an ALWAYS-PREPARED grant
  (Great Old One's Eldritch Hex: "You always have the Hex spell prepared", no free casting at
  all), which this app renders "at will". The rewrite in `add_spell_entry` is narrow on
  purpose and all three guards are load-bearing: **at-will only** (a cadence is an explicit
  free-cast budget — Psi Warrior's daily Telekinesis), **the feature must NAME the spell**
  (Archfey's always-prepared table also names Misty Step, which it separately grants
  innately), and **`FREECAST_RE` must stay wide** ("without *a* spell slot" is Psi Warrior's
  phrasing; a regex that only knew "without expending" let it through). Widening either
  pattern needs the measurement re-run — both were tuned against the whole mirror.
- **The table's granted rows are keyed by SPELL, not by giver (D136).** `push` dedupes on
  `spellKey|src`, so two givers of one spell used to make two rows — and the always-prepared
  branch was worse, reading `e.grants[0]` and silently dropping every later giver. Granted
  rows are merged in `tableRows` now and carry `givers[]`, `kinds` and `recharges`; anything
  reading `row.src` gets the joined label, and `cellFor("build")` draws a badge per giver.
  A PICK is deliberately NOT merged into them: its marker column and its prepare toggle
  belong to a class row.
- **An imported digest REPLACES the bundle, so an extractor fix does not reach an importing
  user until they re-read their books (D137).** `assembleData` is `IMPORTED||BAKED` — not a
  merge (only `monsters` merges) — so with an import present NONE of the baked records are
  used, including ones the bundle carries a corrected copy of. The practical consequence,
  which has now been reported as a bug four times (D127, twice for D135/D136): ship an
  extractor fix and the app-side half works while the data-side half silently does not.
  **When a change touches extract.py / extract.js, the answer to "why is it still wrong"
  is almost always a stale digest — check `IMPORTED.meta.parser` before hunting a
  regression.** `staleParserNotice()` now says it at boot, and the reproduction is two
  lines: hand `IMPORT_CACHE` a copy of `window.__DATA__` with the new fields stripped and a
  stamp of the previous version, call `assembleData()`, and the old symptoms come back
  exactly.
- **"I reloaded and nothing changed" has TWO causes on the published build, and they stack.**
  ① The service worker is stale-while-revalidate on purpose, so a deploy is **exactly one
  reload behind** — reload once and you are still on the old page while the new one caches;
  reload again and you have it. ② The imported digest is independent of the page and only
  changes on a Refresh. So a data fix needs a page update AND a re-import, and until v1.3.2/
  v1.3.3 the app announced neither. Both now raise a notice. When diagnosing, read the
  FOOTER version and `IMPORTED.meta.parser` before anything else — they answer which layer
  is stale, and they disagree far more often than the code is wrong.
  **Service-worker registration fails inside the browser pane** ("An unknown error occurred
  when fetching the script"), so the SW lifecycle cannot be verified there — drive the
  `controllerchange` handler directly with `navigator.serviceWorker.dispatchEvent(new
  Event("controllerchange"))` and say plainly that the lifecycle itself is unexercised.
- **A refresh is PARTIAL, so the parser stamp has to be per book (D138).** `refreshImported`
  re-reads only the books the folder actually holds — `kept=stored.filter(c=>SCAN.books[c])`
  — and the rest keep their stored data, which the report says as a caveat that is easy to
  miss. `applyPlan` used to stamp `meta.parser` on the WHOLE digest anyway, so a refresh that
  re-read 2 of 43 books claimed all 43 were current: the D137 notice went quiet and the data
  stayed wrong with nothing left saying why. Every source carries its own `parser` now, set
  only for books that came through the parser that time. **`staleBooks()` is the honest
  question; `IMPORTED.meta.parser` alone is not** — it is kept only as the fallback for
  digests written before this. **And the stamps must SURVIVE every digest rebuild:** the
  same false success re-opened through a different hole in v1.4.4's audit — `filterDigest`
  rebuilt `out.sources` and silently dropped the per-source `parser`/`parsedAt`, so every
  book NOT re-parsed fell back to the digest-wide stamp `applyPlan` had just set to current.
  Anything that reconstructs a digest's `sources` map must carry the stamps through;
  `applyPlan` alone may overwrite them, and only for books it actually parsed. The remedy
  path (v1.4.4): a refresh ending with books the folder couldn't provide names them, offers
  Open Library, and Manage marks them (`refreshMissed()` = `spellForge.refreshMiss.v1` ∩
  `staleBooks()`), so re-adding + Apply clears everything by construction.
- **Homebrew spells do NOT ride along with a build.** `state.customSources` is per build, but
  authored spells live in the GLOBAL `spellForge.custom.v1`, so a build exported on its own
  arrives on another device with a dangling `Name|HB` key for every homebrew spell it uses.
  That is what the backup file (D138(c)) exists for; per-build export is still the right
  thing for handing one character to someone who has the same books.
- **The agent's browser has NO imported library, so it cannot reproduce an import bug —
  and three releases were spent learning that.** `IMPORTED||BAKED` means the pane runs on the
  baked bundle, where every extractor fix is present by construction. A report of the shape
  "works for you, not for me" about data is therefore almost never reproducible in the pane
  *by default*: you must first put a stale digest in `IMPORT_CACHE` (two lines — copy
  `window.__DATA__`, strip the new fields, stamp a previous version, `assembleData()`).
  **Get the reading from the reporter's browser before shipping a theory.** `ver`,
  `imported`, `IMPORTED.meta.parser`, `staleBooks()` and the record in question separate
  stale-page from stale-data from a real bug in one step; guessing between them cost
  v1.3.2, v1.3.3 and v1.4.0, each fixing something real and none fixing what was reported.
  `node scratchpad/jsimport.js` asserts the in-browser importer's own output on the specific
  records — use it to exonerate (or convict) `src/extract.js` in one command.
- **A `refreshAll()` member that reads CLASS LEVELS goes stale, and this has now cost three
  sessions.** The class row's own handlers (level stepper, swap class, subclass, remove),
  `#addClass` and a feat chip's ✕ all call `render()` WITHOUT `refreshAll()`. So anything
  derived from the level plan belongs in the RENDER PASS, not in those handlers — unless it
  holds a `<select>`, `<input>` or disclosure that would be lost under the user's fingers,
  which is the only reason the rest of `refreshAll()` is kept out of render. Bitten by
  `renderOptFeats` (v1.2.29, which then LIED: Warlock 2 → 1 kept reading "0/3" against 0/1),
  by D135's origin slot (v1.4.2) and by `#epicRow` (v1.4.7, wrong in BOTH directions —
  hidden at 19 with a slot owed, still offered at 18 with none). `refreshSpecies`,
  `renderCustomSources` and `renderFeatChips` read `state.*` only, so they are clean.
- **`el("input")` sets no `type` ATTRIBUTE, and `input[type=text]` does not match an input
  that merely BEHAVES as text.** Every text field in the custom-spell builder therefore fell
  through to the browser's own 2px inset border and square corners — 22px tall beside 34px
  selects — for as long as that builder existed. The base rule carries `input:not([type])`
  now, which is the fix at the SELECTOR rather than at each call site: forgetting the
  attribute again cannot bring the mismatch back. Two neighbours of the same shape, both
  found only by measuring: `.cfield.c-full` required BOTH classes, so `.cchips.c-full` was
  silently half-width (a layout class belongs on the grid child — `.cgrid>.c-full`); and a
  native checkbox only takes `accent-color` when CHECKED, so every unchecked box stayed the
  browser's light square whatever the theme said.
- **A `:has()` rule can silently outrank the state rule that hides something.**
  `.btn:has(>.lbl-ico){display:inline-flex}` — added in v1.4.5 purely to centre a label — is
  specificity 0-2-0 and beat `.gh-toggle{display:none}` at 0-1-0, so the guide's phone-only
  Chain/Decision toggle appeared at every width and did nothing on desktop. Any rule whose
  JOB is to hide or show must be able to win: qualify it (`.btn.gh-toggle`), and when you add
  a broad `:has()` helper, check what display rules it now outranks.
- **Flexbox breaks lines on an item's flex BASE size, not on its size after shrinking.** A
  wrapping row containing a content-sized scroller therefore jumps the scroller (and whatever
  follows it) onto its own line before any shrinking can happen — which is what a chip field
  beside its button does. `nowrap` on that row shape, plus `min-width:0` on the field and a
  `min-width` FLOOR on the label beside it: without the floor the label absorbs its
  proportional share of the overflow and stacks into a 179px-tall column.
- **`.spmodal` is `position:fixed;inset:0`** — it is the full-screen scrim, not a box. Borrow
  the CLASS to inherit its `.sb*` stat-block rules and the borrowing element covers the whole
  page. (Reusing the SPMODAL *element* for a creature modal is fine and is what D142(d)
  does — that is the same scrim doing its job.)
- **Measuring colour contrast: ONE THEME PER PASS, after a real frame.** Flipping
  `data-theme` and auditing in the same synchronous block reads STALE computed styles: it
  invented ~150 phantom failures at 1.3:1 in whichever theme was measured second, and
  separately reported a chip that actually passes at 5.62:1 as 2.06:1. Set the attribute,
  let a frame pass, audit, and do the other theme in its own call. And when auditing, walk
  the real composited background (translucent layers included) and multiply in every
  ancestor's `opacity` — a decorative `opacity` on a text container is a contrast cut no
  palette can repair (`.lvltools` at `.6` put its label at 2.68:1; D145 removed both).

- **History purge:** old data-bearing commits are unreachable on origin but GitHub may still serve
  them by exact SHA until it gc's. `backup/pre-purge-20260826` (local) has the original.
