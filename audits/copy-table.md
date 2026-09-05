# Copy rewrite — before/after (D157(d), D158(l), D158(r))

The review surface for the free rewrite D157(d) mandates. Every user-visible string changed in
`src/index.html`, `src/app.js`, `src/extract.js` and `README.md`, grouped by surface. Vetoes
revert by row.

Brief applied: dry, short, active, sentence case; no em dashes in user-visible text (a comma, a
colon, a full stop, or the app's own `·` separator instead); no *just* / *simply* / *seamlessly*;
no exclamation marks; no Title Case in labels except proper nouns and 2024 rule terms; no
triplets for rhythm; no hedges; no sentence that explains what the reader can already see.
Placeholders per **D158(l)**: ellipses out, verbs kept.

`why` codes: **tell** = an AI tell removed (em dash, ellipsis, *just*) · **short** = shortened ·
**ph** = D158(l) placeholder rule · **cut** = removed entirely · **new** = added string.

---

## Header and settings menu

| location | before | after | why |
|---|---|---|---|
| index.html `#buildsBtn` | `Builds…` | `Builds` | ph |
| index.html `#guideBtn` | `Guided builder…` | `Guided builder` | ph |
| index.html `#printBtn` | `Print / save as PDF…` | `Print / save as PDF` | ph |
| index.html `#libBtn` | `Library…` | `Library` | ph |
| index.html `#customBtn` | `Custom spell…` | `Custom spell` | ph |
| index.html `#hbBtn` | `My homebrew…` | `My homebrew` | ph |
| index.html `#firstRun` | — | `A D&D 2024 spell planner, with the SRD 5.2 built in. Add more books from the Library.` | new (D158(r)); shown only on the Pages build (`__PUBLIC__`) while nothing is imported and nothing is built |

## Guided-builder entry card

| location | before | after | why |
|---|---|---|---|
| index.html `.gctap` | `A level-by-level walk through every decision this build carries — class, species, feats, spells and the choices they open. Nothing is forced: skip anything, jump anywhere, leave whenever.` | `A level-by-level walk through every decision this build carries: class, species, feats, spells and the choices they open. Skip a step or leave at any point.` | tell (em dash, triplet), short |

## Character card

| location | before | after | why |
|---|---|---|---|
| index.html `#addClass` / app.js `refreshAddClass` | `+ add a class…` | `Add a class` | ph (D158(l) names this one) |
| index.html `#speciesBtnLbl` / app.js `refreshSpecies` | `— none —` | `None` | tell |
| index.html `#originBtn` | `origin feat…` | `Add an origin feat` | ph |
| index.html `#generalBtn` | `general feat…` | `Add a general feat` | ph |
| index.html `#epicBtn` | `epic boon…` | `Add an epic boon` | ph |
| index.html `#csrcAdd` | `custom source…` | `Add a custom source` | ph |
| index.html `.fldnote` (Spell sources) | `items, boons…` | `items, boons` | tell |
| app.js `renderClassRows` | `subclass — pick one` | `subclass · pick one` | tell (middot, the app's separator) |
| app.js `renderClassRows` | `— locked —` / `— none —` (subclass select) | `Locked` / `None` | tell |
| app.js `renderOptFeats` | `invocation…` / `metamagic…` (slot name, lowercased) | `Add an invocation` / `Add a metamagic` | ph, parallel with the feat slots |

## Spell list and filters

| location | before | after | why |
|---|---|---|---|
| index.html × 8 (`#fq`, `#pickSearch`, `#entSearch`, `#hbSearch`, `#buildSearch`, `#gpSearch`, `#prepSearch`, `#famSearch`) | `filter by name…` | `Filter by name` | ph |
| index.html `#fChosen` | `picked` | `Picked` | ph (D158(l) names this one) |
| index.html `#fSchool` / app.js `syncOpt` | `all schools` | `All schools` | ph (D158(l)) |
| index.html `#fClass` / app.js `syncOpt` | `all classes` / `any source` | `Any source` | ph; index.html's dead pre-JS option now matches the one app.js writes |
| app.js `syncOpt` | `every spell (ignore eligibility)` | `Every spell (ignore eligibility)` | ph |
| index.html `#fSave` / app.js `syncOpt` | `any save` | `Any save` | ph (D158(l)) |
| index.html `#fDmg` / app.js `syncOpt` | `any damage` | `Any damage` | ph |
| app.js `renderList` (empty) | `<b>Nothing matches</b><br>Loosen the filters — or make it yourself.` | `…Loosen the filters, or make it yourself.` | tell |

## Pickers (spell picker, entity picker, guided picker)

| location | before | after | why |
|---|---|---|---|
| app.js `pickView` | `sub: "click to add or remove from your book"` | `sub: ""` | cut — the title already says Spellbook |
| app.js `pickView` | `sub: "click to learn or drop"` | `sub: ""` | cut — the title already says Known spells |
| app.js `pickView` | `sub: "click to prepare or unprepare"` | `sub: ""` | cut — the title already says Prepare spells |
| app.js `openPick` | `Level 1–${max} · ${v.sub}` | `Level 1–${max}` + the sub only when there is one | follows the cut above, so no dangling `·` |
| app.js `openMagicalSecrets` | `${class} — Magical Secrets` | `${class} · Magical Secrets` | tell |
| app.js `openPick` | `${class} — ${v.title}` | `${class} · ${v.title}` | tell |
| app.js `pickView` | `In your book — click to remove` | `In your book. Click to remove` | tell |
| app.js `pickView` | `Known — click to drop` | `Known. Click to drop` | tell |
| app.js `pickView` | `Prepared — click to unprepare` | `Prepared. Click to unprepare` | tell |
| app.js `renderPickList` | `Picked — click to remove` | `Picked. Click to remove` | tell |
| app.js `renderEntityList` | `Selected — click to remove` | `Selected. Click to remove` | tell |
| app.js `renderEntityList` | `Take ${name} again — you can gain it more than once` | `Take ${name} again: you can gain it more than once` | tell |
| app.js `entityAria` | `${name} — read what it gives` | `${name}: read what it gives` | tell |
| app.js `renderClassRows` (subclass prompt) | `change the subclass…` / `choose a subclass…` | `Change the subclass` / `Choose a subclass` | ph |
| app.js `guideStage` | `Place picks here…` / `Change…` / `Choose ${noun}…` | `Place picks here` / `Change` / `Choose ${noun}` | ph |
| app.js `guideStage` | `Change the species…` / `Choose a species…` | `Change the species` / `Choose a species` | ph |
| app.js `guideStage` | `Change the feat…` / `Choose a feat…` | `Change the feat` / `Choose a feat` | ph |
| app.js `guideStage` | `Change it…` / `Choose ${label}…` | `Change it` / `Choose ${label}` | ph |
| app.js `guideStage` (empty slot tip) | `Fill it here — everything you learned later keeps the level you learned it at.` | `Fill it here: everything you…` | tell |
| app.js `takeLabel` | `Picked — click to drop it` / `This group is full — drop one of its picks first` | `Picked. Click to drop it` / `This group is full. Drop one of its picks first` | tell |
| app.js `guideStage` | `Open the ${picker} picker — this level still has room.` | `Open the ${picker} picker. This level still has room.` | tell |
| app.js `guideStage` | `The schedule wants ${n} — this level is over by ${d}.` | `The schedule wants ${n}, so this level is over by ${d}.` | tell |
| app.js `renderFormPins` | `choose a ${spell} form…` | `Choose a ${spell} form` | ph |
| app.js `renderSwapBlock` | `cantrip leaving…` / `its replacement…` | `Cantrip leaving` / `Its replacement` | ph |
| app.js `renderSwapBlock` | `Choose replacement…` | `Choose replacement` | ph |

## Choices card and grants

| location | before | after | why |
|---|---|---|---|
| app.js `castModLabel` | `${feature} — no V / S` | `${feature} · no V / S` | tell |
| app.js `optFeatTip` | `More than your level grants… Nothing is removed — check with your DM.` | `…Nothing is removed; check with your DM.` | tell |
| app.js `optFeatTip` | `You can still take one — it will read as more than your level grants.` | `You can still take one, and it will read as…` | tell |
| app.js `prereqWarn` × 2 | `Kept in the build — nothing is removed.` | `Kept in the build; nothing is removed.` | tell |
| app.js `speciesPrq` | `Replaces ${name} — you can only have one species.` | `Replaces ${name}: you can only have one species.` | tell |
| app.js `renderPrepared` | `Granted — they don’t use your prepared slots` | `Granted, so they don’t use your prepared slots` | tell |
| app.js `alwaysTip` × 2 | `A free grant — it doesn’t count against your prepared list.` / `Free from ${src} — it doesn’t…` | `A free grant. It doesn’t count…` / `Free from ${src}. It doesn’t…` | tell |
| app.js `takeTitle` | `Prepared — click to remove. ` / `Not prepared — click to add. ` | `Prepared. Click to remove. ` / `Not prepared. Click to add. ` | tell |

## Custom spell sources

| location | before | after | why |
|---|---|---|---|
| index.html `.sub` | `A thing this character owns that grants spells — a magic item, a boon, a blessing.` | `Something this character owns that grants spells: a magic item, a boon or a blessing.` | tell (em dash, triplet) |
| index.html `#csrcKind` | `magic item, boon, blessing… (optional)` | `Magic item, boon, blessing (optional)` | ph |
| index.html `#csrcSearch` | `add a spell by name…` | `Add a spell by name` | ph |
| index.html `#csrcAddPick` | `or a choice…` | `Or a choice` | ph |
| app.js `CSRC_SWAP` | `chosen once — can't be changed` | `chosen once, can't be changed` | tell |
| app.js `csrcRuleText` | `add ${list} to your spell list — you prepare them normally` | `add ${list} to your spell list, prepared as normal` | tell, short |
| app.js `csrcRuleText` | `${clauses} — all without preparing` | `${clauses}, all without preparing` | tell |
| app.js `csrcSummary` | `<b>${name}</b> — ${how}.` | `<b>${name}</b>: ${how}.` | tell |
| app.js `csrcNumsSub` | `set — ${bits}` | `set: ${bits}` | tell |
| app.js `renderCsrcRows` | `No spells yet — search below to add one.` | `No spells yet. Search below to add one.` | tell |
| app.js `renderCsrcRows` | `note — e.g. deals cold damage instead` | `Note` | ph (D158(l) names this one) |
| app.js `renderCsrcPick` | `spell(s) — nothing ticked below means ANY` | `spell(s). Nothing ticked below means ANY` | tell |
| app.js `csrcFilterText` | `choose a spell … — any spell` | `choose a spell · any spell` | tell |
| app.js `csrcBookNote` | `a book that isn’t loaded — re-import it` | `a book that isn’t loaded, so re-import it` | tell |

## Custom spell editor and homebrew

| location | before | after | why |
|---|---|---|---|
| app.js `SAVE_OPTS` | `— none —` | `None` | tell |
| app.js `renderCustomStep` | `start from an existing spell…` | `Start from an existing spell` | ph |
| app.js `renderCustomStep` | `What the spell does…` | `What the spell does` | ph |
| app.js `renderCustomStep` | `At higher levels…` | `At higher levels` | ph |
| app.js `renderHbList` | `No homebrew spells yet — “New spell” writes one.` | `No homebrew spells yet. “New spell” writes one.` | tell |
| app.js `spellPreview` | `Defence — ${dfn}` | `Defence: ${dfn}` | tell |

## Prepare daily

| location | before | after | why |
|---|---|---|---|
| app.js `prepSub` | `Some sources — the 2024 species lineages among them — let you replace…` | `Some sources, the 2024 species lineages among them, let you replace…` | tell |
| app.js `prepSub` | `Prepared from your spellbook — pick which of the book's spells are live.` | `Prepared from your spellbook: pick which…` | tell |
| app.js `prepSub` | `Prepared from the ${class} list — any mix of levels up to ${max}.` | `Prepared from the ${class} list, any mix of levels up to ${max}.` | tell |
| app.js `renderPrepSwap` | `Recorded at L${lv} — below that level the cantrip you traded away is still yours.` | `Recorded at L${lv}. Below that level…` | tell |
| app.js `renderPrepSwap` | `L${lv} already records a cantrip swap for another class — clear its pill…` | `…for another class. Clear its pill…` | tell |
| app.js `renderPrepSwap` | `Pick the cantrip leaving and the one arriving — ${class} may replace one…` | `Pick the cantrip leaving and the one arriving. ${class} may replace one…` | tell |
| app.js `renderPrepList` | `Chosen — click to drop it` | `Chosen. Click to drop it` | tell |
| app.js `renderPrepList` | `Prepared — click to unprepare` | `Prepared. Click to unprepare` | tell |
| app.js `renderPrepList` | `Your spellbook is empty — copy spells into it first.` | `Your spellbook is empty. Copy spells into it first.` | tell |
| app.js `prepNote` | `Nothing to prepare — no class here prepares from a whole list.` | `Nothing to prepare: no class here prepares from a whole list.` | tell |

## Budget, cart and health

| location | before | after | why |
|---|---|---|---|
| app.js `renderStats` | `short-rest recharge — separate from the above.` | `short-rest recharge, separate from the above.` | tell |
| app.js `renderStats` | `No slots — add a spellcasting class.` | `No slots. Add a spellcasting class.` | tell |
| app.js `kindTip` (wizard) | `(${max}) — so the count at each level is capped…` / `beyond the allowance — those show as “copied”.` | `(${max}), so the count…` / `beyond the allowance; those show as “copied”.` | tell |
| app.js `kindTip` (level-swap) | `is limited — the tiles show it` | `is limited: the tiles show it` | tell |
| app.js `cellTitle` | `prepared — ${n} of up to ${ceil} at this level` | `prepared · ${n} of up to ${ceil} at this level` | tell |
| app.js `cellTitle` | ` — you are over your prepared total…` | `. You are over your prepared total…` | tell |
| app.js `cellTitle` | ` — no room here while you are over your prepared total` | `. No room here while you are over…` | tell |
| app.js `gapChipTitle` | `${book} is turned off in Sources — the pick is kept, not removed. The banner above can turn the book back on.` | `${book} is turned off in Sources. The pick is kept, not removed, and the banner above can turn the book back on.` | tell |
| app.js `healthLine` | `${n} to check, at L3, L5 — the timeline marks the rows.` | `${n} to check, at L3, L5. The timeline marks the rows.` | tell |
| app.js `sweepSpellLevel` | `${spell} is level ${l}, but ${class} ${cl} — which is where it arrives — casts at most level ${n}.` | `…but ${class} ${cl}, which is where it arrives, casts at most level ${n}.` | tell |
| app.js `sweepSubclass` | `Subclass — not chosen` | `Subclass not chosen` | tell |

## Timeline

| location | before | after | why |
|---|---|---|---|
| app.js `renderTimeline` | `another class…` (add-class prompt, both the character card and the timeline) | `Another class` | ph |
| app.js `lvTile` tips × 4 | `Max spell level — raised here` / `Top slot level — raised here` / `Pact Magic slots — changed here` | `Max spell level, raised here` / `Top slot level, raised here` / `Pact Magic slots, changed here` | tell |
| app.js `lvTile` tip | `They are two different clocks — the row notes them separately…` | `They are two different clocks, and the row notes them separately…` | tell |
| app.js `swapWhy` | `Armed — traded at L${n} for the next ${kind} you take.` | `Armed. Traded at L${n} for the next ${kind} you take.` | tell |
| app.js `swapWhy` | `L${v} already carries a ${kind} trade — clear its pill first.` | `…trade. Clear its pill first.` | tell |
| app.js `swapWhy` | `A trade happens at a later level-up — jump to one first.` | `A trade happens at a later level-up, so jump to one first.` | tell |
| app.js `swapWhy` | `L${v} isn't a level-up of this class — jump to one of its levels…` | `L${v} isn't a level-up of this class. Jump to one of its levels…` | tell |
| app.js `swapChip` | `${label} — trade away here` | `${label} · trade away here` | tell |
| app.js `swapEventNote` | `replaces one cantrip per long rest — the level only records where it happened.` | `…per long rest; the level only records where it happened.` | tell |
| app.js `noCantripSwap` | `not on level-up — do it in Prepare daily.` | `not on level-up. Do it in Prepare daily.` | tell |
| app.js `noSpellSwap` | `A spellbook only grows — copying in is the wizard's move;` | `A spellbook only grows. Copying in is the wizard's move;` | tell |
| app.js `noSpellSwap` | `not on level-up — nothing is traded away here.` | `not on level-up, so nothing is traded away here.` | tell |
| app.js `forkTitle` | `Jump to a lower level first — the fork branches there` | `Jump to a lower level first: the fork branches there` | tell |
| app.js `orderArrowAria` | `Levels listed lowest first — flip the order` | `Levels listed lowest first. Flip the order` | tell |
| app.js `levelChipTip` | `Open the timeline to jump to a level, reorder how the levels were taken, and move picks between them.` | `Open the timeline to jump to a level, reorder the levels, or move picks between them.` | tell (triplet), short |

## Library — help, status, tray, controls

| location | before | after | why |
|---|---|---|---|
| index.html `#importHelp` ¶1 | `This is every book the planner knows about. … turning one off costs nothing and deletes nothing. … selecting anything raises a bar with Remove in it.` | `Every book the planner knows about. … turning one off deletes nothing. … and raises a bar with Remove in it.` | tell, short |
| index.html `#importHelp` ¶2 | `…straight from the public repository — no download step. … its address is editable under Actions → 5etools address….` | `…straight from the public repository. … edit its address under Actions → 5etools address.` | tell, ph |
| index.html `#importHelp` ¶3 | `…stored in this browser — nothing is uploaded.` | `…stored in this browser. Nothing is uploaded.` | tell |
| index.html `#importHelp` ¶4 | `Homebrew & Unearthed Arcana work too. Download any brew … — around 60 KB each. … (spell/, class/, collection/…) … Not the repository's “Download ZIP” — that is every brew plus artwork…` | `Homebrew and Unearthed Arcana work too. Download a brew … They run around 60 KB each. … (spell/, class/, collection/) … Do not use the repository's “Download ZIP”: that is every brew plus artwork…` | tell |
| index.html `#importWelcome` | `…stored in your browser — nothing is uploaded.` | `…stored in your browser. Nothing is uploaded.` | tell |
| index.html `.traysub` | `nothing is stored yet` | `Nothing is stored yet` | sentence case |
| index.html `#planHelp` | `These are the files you just added… re-read rather than duplicated — only identical entries are replaced — and it is listed above the ticks rather than among them, because declining is not what the tick is for: removing a book you have is the list's own selection bar, never this tray.` | `The files you just added… re-read rather than duplicated, and only identical entries are replaced; it is listed above the ticks, not among them. To remove a book you have, use the list's own selection bar.` | tell, short |
| index.html `#importPlanNote` | `Nothing imported yet — adding these puts the app's built-in books behind them.` | `Nothing imported yet. Adding these puts the app's built-in books behind them.` | tell |
| index.html `#webSrcBox .note` | `The 5etools mirror moves every year or two — if fetching stops working…` | `The 5etools mirror moves every year or two. If fetching stops working…` | tell |
| index.html `#libSrcSearch` | `search books…` | `Filter books` | ph (D158(l) names this string) |
| index.html `#webSrcTog` | `5etools address…` | `5etools address` | ph (D155(b) placed the row; D158(l) drops the ellipsis) |
| index.html `#importPaste` | `paste 5etools JSON here…` | `Paste 5etools JSON here` | ph |
| index.html `#folderPick` | `Choose a folder…` | `Choose a folder` | ph (same for app.js's `Choose another folder…`) |
| index.html `#pasteTog` | `Paste JSON…` | `Paste JSON` | ph |
| app.js `renderPlanFilter` | `filter books…` | `Filter books` | ph |
| app.js `trayMissNote` | `Couldn’t re-read this book earlier — the linked folder doesn’t hold it` | `…this book earlier; the linked folder doesn’t hold it` | tell |
| app.js `trayUpdNote` | `${n} you already have will be re-read with parser v${x} — only identical entries are replaced.` | `…with parser v${x}. Only identical entries are replaced.` | tell (D156(b) fixes the sentence, not its dash) |
| app.js `renderSrcList` (empty) | `No books yet — add some below.` | `No books yet. Add some below.` | tell |
| app.js `webStatusLine` | `5etools v${x} is out — you have v${y}` | `5etools v${x} is out · you have v${y}` | tell |

## Import, scan and fetch

| location | before | after | why |
|---|---|---|---|
| app.js `ZIP_TOOBIG` | `Unzip it yourself and stage just the .json files you want — imports add to what you already have` | `Unzip it yourself and stage only the .json files you want: imports add to what you already have` | tell (*just*, em dash) |
| app.js `stageZip` | `${file} is ${size}</b> — too large for a browser tab to open.` | `${file} is ${size}</b>, too large for a browser tab to open.` | tell |
| app.js `stageZip` | `Unpacking ${file} — ${i}/${n}` | `Unpacking ${file} · ${i}/${n}` | tell |
| app.js `importSummary` | ` — add generated/gendata-spell-source-lookup.json` | `; add generated/gendata-spell-source-lookup.json` | tell |
| app.js `webTree` | `the repository’s file list came back truncated — try again later.` | `…came back truncated. Try again later.` | tell |
| app.js `webFetch` | `no data files found in ${repo} — is the repository address right?` | `no data files found in ${repo}. Is the repository address right?` | tell |
| app.js `webFetch` | `Fetching v${v} — ${i}/${n}` | `Fetching v${v} · ${i}/${n}` | tell |
| app.js `webUpdateNotice` | `5etools has newer data — v${x} is out; you have v${y}.` | `5etools has newer data: v${x} is out and you have v${y}.` | tell |
| app.js `scanProgress` | `Scanning ${i}/${n} — ${b} books so far…` | `Scanning ${i}/${n} · ${b} books so far…` | tell |
| app.js `scanDone` | `Scanned <b>${label}</b> — ${n} files,` | `Scanned <b>${label}</b> · ${n} files,` | tell |
| app.js `rescan` | `Those files are no longer reachable — rescan the folder.` | `Those files are no longer reachable. Rescan the folder.` | tell |
| app.js `readFiles` | `Read ${n} files — ${summary}.` | `Read ${n} files · ${summary}.` | tell |
| app.js `removeGuard` | `That would leave no content at all — keep at least one book.` | `That would leave no content at all. Keep at least one book.` | tell |
| extract.js `readZip` | `…about 25 MB — if this is a whole-repository download, unzip it and stage just the .json files you want.` | `…about 25 MB. If this is a whole-repository download, unzip it and stage only the .json files you want.` | tell (*just*, em dash) |
| extract.js `readZip` | `this zip's directory points past the end of the file — it may be truncated or still downloading.` | `…past the end of the file. It may be truncated or still downloading.` | tell |

## Refresh and app-level notices

| location | before | after | why |
|---|---|---|---|
| app.js `refreshStage` | `${stage} — ${detail}` | `${stage} · ${detail}` | tell |
| app.js `refreshAsk` × 5 pairs | `Nothing imported yet — Refresh re-reads…` / `That folder wasn’t opened — permission is asked once per session.` / `Refresh needs your 5etools files — choose the folder above…` / `Refresh needs the folder — permission wasn’t granted.` / `The scanned folder holds none of your imported books — choose the folder…` | full stops and semicolons in place of every dash | tell |
| app.js `refreshMissNote` | `Re-add it below — drop the file, or choose the folder…` | `Re-add it below: drop the file, or choose the folder…` | tell |
| app.js `staleNotice` | `couldn’t re-read it — the folder doesn’t hold it.` | `couldn’t re-read it; the folder doesn’t hold it.` | tell |
| app.js `staleNotice` | `Refresh to re-read them — but ${n} wasn’t in the folder…` | `Refresh to re-read them, but ${n} wasn’t in the folder…` | tell |
| app.js `staleNotice` | ` — this is v${app}.` | `; this is v${app}.` | tell |
| app.js `storageReport` | ` — the largest are ${list}` | `. The largest are ${list}` | tell |
| app.js `storageReport` | `its database is unavailable — a private window blocks it — and the fallback store is full.` | `its database is unavailable (a private window blocks it) and the fallback store is full.` | tell |
| app.js `storageNotice` | `Changes aren't saving — browser storage is full or blocked.` | `Changes aren't saving: browser storage is full or blocked.` | tell |
| app.js `boot` | `the app started on its bundled data — your builds are untouched.` | `the app started on its bundled data. Your builds are untouched.` | tell |

## Builds manager and build import/export

| location | before | after | why |
|---|---|---|---|
| index.html `#buildExportAll` | `Export all…` | `Export all` | ph |
| index.html `#buildImport` | `Import…` | `Import` | ph |
| index.html `#bImportPick` | `browse…` | `browse` | ph |
| index.html `#bImportBox .note` | `Importing <b>adds</b> — it never replaces or removes anything you already have.` | `Importing <b>adds</b>: it never replaces or removes anything you already have.` | tell |
| index.html `#bImportPaste` | `paste an exported build here…` | `Paste an exported build here` | ph |
| index.html `#nbChar` | `follows the classes you pick…` | `Follows the classes you pick` | ph |
| app.js `renderBuildSwitch` | `Manage builds…` | `Manage builds` | ph |
| app.js `renderBuildList` | `${n} builds across ${m} characters · click one to switch` | `${n} builds across ${m} characters` | cut — the rows are the switch |
| app.js `exportAll` | `Nothing to export yet — this browser holds no builds.` | `Nothing to export yet: this browser holds no builds.` | tell |
| app.js `importBuild` | `…which isn't loaded here — import that data to see those picks resolve.` | `…which isn't loaded here. Import that data to see those picks resolve.` | tell |

## Source reconciliation prompt

| location | before | after | why |
|---|---|---|---|
| app.js `srcAskNote` | `Nothing is removed either way — keep your books and those picks stay in the build, flagged.` | `Nothing is removed either way. Keep your books and those picks stay in the build, flagged.` | tell |

## Spell table, markers and print sheet

| location | before | after | why |
|---|---|---|---|
| app.js `#tableEmpty` | `Nothing selected yet — pick spells in the Build tab (or use Prepare daily); subclass/feat/species grants appear here too.` | `Nothing selected yet. Pick spells in the Build tab, or use Prepare daily; subclass, feat and species grants appear here too.` | tell |
| app.js `markerTip` | `A free grant — it doesn’t count against your prepared list.` | `A free grant. It doesn’t count against your prepared list.` | tell |
| app.js `markerTip` | `Swappable on a long rest — change it in Choices.` | `Swappable on a long rest. Change it in Choices.` | tell |
| app.js `markerTip` | `Always known — not re-prepared daily.` | `Always known, not re-prepared daily.` | tell |
| app.js `markerTip` | `Chosen from your spellbook this long rest — change it with Prepare daily.` | `…this long rest. Change it with Prepare daily.` | tell |
| app.js `markerTip` | `This class learns spells on level-up, not daily — you can swap one whenever you gain a level.` | `…not daily. You can swap one whenever you gain a level.` | tell |
| app.js `markerHeadTip` | `Hover a marker for what it means.` | `Each marker in this column says how the spell is prepared.` | cut the obvious, replaced with the fact |
| app.js `mmTip` | `Advisory — the option's full text has the final word.` | `Advisory: the option's full text has the final word.` | tell |
| app.js `twinnedWhy` | `from a higher slot — Twinned adds one without spending it` | `from a higher slot; Twinned adds one without spending it` | tell |
| app.js `printLegend` | `Always prepared — a free grant that costs you nothing` | `Always prepared: a free grant that costs you nothing` | tell |
| app.js `printLegend` | `Innate — cast without preparing it` | `Innate: cast without preparing it` | tell |
| app.js `printLegend` | `You could prepare this — tick what you take` | `You could prepare this: tick what you take` | tell |
| app.js `printLegend` | `Ritual — castable without a slot at 10 extra minutes` | `Ritual: castable without a slot at 10 extra minutes` | tell |
| app.js `rechargeNote` | `total — never regained` | `total, never regained` | tell |
| app.js `printCards` | `${n} forms — mark the ones you use in the spell's details to print them.` | `${n} forms. Mark the ones you use…` | tell |
| app.js `printDocName` | `${character} — ${version}` (the PDF's filename) | `${character} · ${version}` | tell; matches the header switcher's separator |

## Print modal

| location | before | after | why |
|---|---|---|---|
| index.html `#prTheme` | `Light — on white` / `Dark — as on screen` | `Light, on white` / `Dark, as on screen` | tell |
| index.html `#prOrient` | `Landscape — fits every column` | `Landscape, fits every column` | tell |
| index.html `#prEligible` | `For classes that prepare from their whole list (Cleric, Druid, Paladin) — print everything you could prepare with an empty box, and prepare on paper.` | `For classes that prepare from their whole list (Cleric, Druid, Paladin). Prints everything you could prepare with an empty box, so you can prepare on paper.` | tell |
| index.html `.prfoot` | `…save the page under the app's name — open this page in a browser to print if that happens.` | `…save the page under the app's name; open this page in a browser to print if that happens.` | tell |
| index.html `#prGo` | `Print…` | `Print` | ph |

## Forms picker

| location | before | after | why |
|---|---|---|---|
| app.js `formPinDismiss` | `Dismiss — you can still mark forms in the spell's own details` | `Dismiss. You can still mark forms in the spell's own details` | tell |
| app.js `famRow` | `Marked — click to unmark` | `Marked. Click to unmark` | tell |
| app.js `favBtn` | `Marked — this form prints and comes first` | `Marked. This form prints and comes first` | tell |
| app.js `famBooksNote` | `off in your sources — tick one to include its forms here.` | `off in your sources. Tick one to include its forms here.` | tell |

## README.md

| location | before | after | why |
|---|---|---|---|
| intro | `…and from which source** — across multiclassing` | `…and from which source**, across multiclassing` | tell |
| Saved builds | `(⋯ → Builds…)` | `(⋯ → Builds)` | ph, matches the menu |
| Saved builds | `tells you when they're off — picks are flagged` | `…when they're off: picks are flagged` | tell |
| Level preview | `at any lower level — grants that haven't unlocked disappear` | `at any lower level: grants that haven't unlocked…` | tell |
| Custom spell sources | `that grants spells — with a shared charge pool` | `that grants spells, with a shared charge pool` | tell |
| Custom spell sources | `or simply added to your spell list` | `or added to your spell list` | tell (*simply*) |
| Choices to make | `every spell choice a build implies — subclass options` | `…a build implies: subclass options` | tell |
| Homebrew & UA | `alongside your core data — their books appear under` | `alongside your core data. Their books appear under` | tell |
| Spell details | `as a **carousel** — Find Familiar carries all 65` | `as a **carousel**. Find Familiar carries all 65` | tell |
| Rules | `Higher slots just upcast.` | `Higher slots only upcast.` | tell (*just*) |
| Rules | `not every slot can be top level — the tool computes` | `…top level, and the tool computes` | tell |
| Develop | `` `python3 -m http.server` — the latter evaluates `` | `` `python3 -m http.server`: the latter evaluates `` | tell |
| Known gaps | `PLAN.md is the live queue — this list is only` | `PLAN.md is the live queue; this list is only` | tell |
| Known gaps | `in both extractors — re-run the audit sweeps` | `in both extractors. Re-run the audit sweeps` | tell |
| Known gaps | `carry no note yet — notes only reach` | `carry no note yet: notes only reach` | tell |
| Known gaps | `which is the whole bestiary — out of scope` | `which is the whole bestiary, out of scope` | tell |

---

## M4 — the filter wording pass (D182, 2026-09-05)

One name per thing across every filter surface; the standard is the pickers' menu (D174).
Vetoes revert by row, as above.

| location | before | after | why |
|---|---|---|---|
| index.html `#filterPanel` label | `Class / list` | `Access` | short; the spell detail's own noun |
| index.html `#filterPanel` label | `Source book` | `Books` | one name (the menu's) |
| index.html `#fBooksBtn` | `Books N/N` | `Choose N/N` | the label above it says Books now |
| index.html `#filterPanel` label | `Casting time` | `Cast time` | one name (the menu's) |
| index.html `#filterPanel` label | `Tags` | `Properties` | noun for what the row holds |
| index.html `#filterPanel` label | `Saving throw` | `Save` | one name (the menu's) |
| index.html `#filterPanel` label | `Damage type` | `Damage` | one name (the menu's) |
| index.html `#filterPanel` label + `#fReprint` | `Editions` · `Hide reprinted (newest only)` / `Show all versions` | `Reprints` switch, title `On: every printing. Off: the newest only` | binary → labelled switch |
| app.js `syncOpt` × 4 (`#fSchool`, `#fClass`, `#fSave`, `#fDmg`) | `All schools` / `Any source` / `Any save` / `Any damage` | `All` | one word for "empty means all" |
| app.js `#fClass` first option | `Every spell (ignore eligibility)` | `Every spell` | short; the strip already said it |
| app.js `#fTags` chips | `Concentr.` · `Atk roll` · `Upcasts` · `Consumes mat.` | `Concentration` · `Attack roll` · `Upcast` · `Consumes material` | abbreviations out; same names as the strip (`F_TAGS`) |
| app.js `activeFilterChips` | `All editions` | `Reprints` | matches its control |
| index.html `#fBooksPanel .quick` | `Enable all` · `Disable all` · `2024 core only` · `Reset to my sources` | `All` · `None` · `2024 core` · `My sources` | the menu's own labels |
| index.html `#prepLevelBtn` / `#prepLevelPop` | `Levels` / `Filter by level` | `Level` / `Level` | one name |
| index.html `#famMenuPop` head | `Source book` | `Books` | one name |
| index.html `#famOnly` | `Only the ones I've marked` checkbox | `Marked` switch | binary → labelled switch (D172(f): "Spellcasting", not "Only ones that grant spells") |
| app.js `entFilterGroups` | `Eligible only` switch | `Prerequisites` row: `Eligible` · `Not yet` · `Can't verify` | new (M3); D172(d)'s own words |
| app.js `entFilterGroups` | — | `Ability bonus` row: `Str` … `Cha` | new (M3) |

## D184 — the guide picker's landing hint (2026-09-05)

One string, replaced by two. The old line stated a landing that D184 made conditional: with the
pool no longer narrowed to the earlier slot, only spells that slot's level can cast actually go
there, and the sentence has to say which. Veto reverts the row.

| location | before | after | why |
|---|---|---|---|
| app.js `renderGpick` hint (a slot open behind you) | `A pick taken here fills the still-open L5 slot first. That is where it lands.` | `Every spell slot this step owns is filled. A spell of level 1 or lower taken here fills your still-open L1 slot instead.` | the old line was true of every pick; it is now true only up to that slot's level (D184(b)) |
| app.js `renderGpick` hint (nothing open behind you) | `Every slot of this kind is filled. Click one you hold to drop it first.` | `Every spell slot this step owns is filled. A pick taken here lands past what your schedule gives you. Click one you hold to drop it first.` | "of this kind" named the array, not the step; and it never said what a take would do |

## Totals

| measure | count |
|---|---|
| string edits applied (exact-match replacements) | 227 |
| additional sites covered by a shared string | 7 (`filter by name…` appears at 8 places in `index.html`) |
| strings cut entirely | 5 (three picker subtitles, the builds-manager tail, the marker-tip instruction) |
| strings added | 1 (the Pages first-run line) |
| em dashes removed from user-visible text | 181 |
| ellipses removed (placeholders, labels, menu items) | 63 |
| *just* / *simply* removed | 3 |
| triplets rewritten | 4 |
| files touched | 4 (`src/index.html`, `src/app.js`, `src/extract.js`, `README.md`) |

Diff: 256 lines removed, 269 added. `grep -c "—"` on user-visible strings is **0** in
`index.html` and `README.md`; `app.js` keeps 5 (listed below), `extract.js` keeps 4.

---

## Deliberately left

### Key collisions — the string is read back by code

| string | site | reason |
|---|---|---|
| `— none —` | app.js:2982–2985, Fighting Style option group | the label **is** the value written to `state.choices[id]`. `choiceRow` renders `c.options` directly and `resolveGrants` compares `opt.name===sel`, so renaming it silently unsets the choice on every saved build that has one. Display and key have to be split in code first — out of a copy pass's scope. |
| `—` (bare, as an empty-cell marker) | app.js ×19 (`cellFor`, `abChip`, `compText`, stat tiles, print tables); extract.js ×3 | compared with `===` at three sites (`td.textContent==="—"` for the `.nil` class, `lab!=="—"` in the casts cell, `short==="—"` in `rechargeNote`). It is also a typographic nil marker rather than prose punctuation, so the brief's replacements (comma, colon, full stop, middot) do not apply to it. |
| `Divine Order — Thaumaturge (extra cantrip)`, `Primal Order — Magician (extra cantrip)` | extract.js:704–705 | the `" — "` is the **parse separator**: app.js splits the label on it to get the feature and the order name (`String(bc.label).split(" — ")`). It is also a hand-authored table that must stay identical in `extract.py`, which is out of scope. |

### Out of scope — mirrored in `extract.py`

| string | site |
|---|---|
| `Added to your spellbook for free when you take the subclass — they don't count…` | extract.js:418 (`PROSE_GRANTS` note; `extract.py:1275` carries the twin) |
| `…names no class list — spellList=null (D130)` | extract.js:1122 (`extract.py:1828`) |
| `…left unresolved — ${why} (D127)` | extract.js:914 |

"Both extractors or neither" (CLAUDE.md): changing these in `extract.js` alone would drift the
two files apart, and `extract.py` is outside this task's scope. They should move together in a
follow-up.

### D-decided wording kept verbatim

- **D154** final verb set, untouched: `Update data` · `＋ Add files` · `Actions` (`Enable all` ·
  `Disable all` · `Select all` · `Select shown`) · selection bar (`Clear` · `enabled` ·
  `Remove`) · tray (`Discard` · `Add N books`) · `Close`. `enabled` stays lowercase because
  D154(e) writes it that way as a switch label, not a sentence.
- **D156(a)** `Add N books`, and the button never wears `.danger`.
- **D144** menu grouping and the `Content` group header.
- **D149(a)** / **D158(p)** progression-table wording.
- **D141** arrow controls: `← Back` / `Next →` and the order-toggle arrow keep their glyphs.

### Kept against a brief clause, flagged for veto

| string | why kept |
|---|---|
| `Refreshing…`, `Reading…`, `Storing…`, `Refreshing imported data…`, `Reading the folder…`, `Re-reading with the current parser…`, `Finding the latest 5etools release…`, `Listing the files of v${x}…`, `Scanning ${i}/${n} · ${b} books so far…`, `Reading ${i}/${n} files…` (10 strings) | these are **progress** ellipses, not placeholders: the ellipsis means "still running", which is a fact the reader needs. D137 quotes `Refreshing…` verbatim. D158(l) is about placeholders; the brief's "ellipses go everywhere" would strip a working signal. **Francesco's call.** |
| `just now` (app.js `agoText`) | idiomatic time-ago, not the filler adverb the brief bans. |
| `click for full details` ×2, `click for the full stat block`, `. Tap to edit.` | they sit inside hover tips and `title` attributes, where the click affordance is **not** visible; cutting them removes the only signal the thing is clickable. |
| `Export, duplicate or delete this version` | three real actions the row's ⋯ carries, not rhythm. |
| `Identity` / `Mechanics` / `Lists & text` | the custom-spell editor's three step names. |
| `Epic Boon`, `Eldritch Invocation`, `Metamagic`, `Fighting Style`, `Pact Boon`, `Battle Master Maneuver`, `Arcane Shot`, `Artificer Infusion`, `Rune`, `Origin`, `General`, `Dark Gift`, `Dragonmark` | 2024 rule terms, printed as the books print them. |
| `Open Library` | `Library` is the app's own surface name. |
| `✦`, `✓`, `⚠`, `·` | typographic marks doing structural work (caster flag, already-taken tick, warning, separator), not decoration. |
| `Up to ${cap} of your prepared spells **may** come from other lists` | "may" is the rule's permission, not a hedge. |
| `it **may** be truncated or still downloading` (extract.js zip error) | genuine uncertainty about the file; asserting either would be wrong. |

---

## Verification

1. **Gate** — all seven lines green: `extract.py`/`build.py` parse; `app.js`/`extract.js`/`sw.js`
   parse; `data.json` + `manifest.webmanifest` parse; `cparity.js` **0 FAIL**; `deadfns` exit 0
   (the two known K4 orphans only); `ids` exit 0 (`#firstRun` resolves); `eslint` exit 0.
2. **Em dashes** — 0 outside comments in `index.html` and `README.md`; the 5 in `app.js` and 4
   in `extract.js` are the documented key collisions and `extract.py` twins above.
3. **Browser walk** — served on 8023, driven at 1280 and 375 in both themes: header and settings
   menu, Character card with two classes (Bard 5 / Cleric 5), Choices card, Library (43 baked
   books, filtered-empty state, Actions, selection bar, address box, paste box, help), the
   entity picker, the class spell picker, the guided picker, the timeline, the print modal,
   Prepare daily, the spell table and the guided builder's first step. **No string overflows or
   truncates**: a scrollWidth-vs-clientWidth sweep over every button, label, note and option
   returned empty at both widths, except pre-existing book *titles* in `.libnm` at 375 (they
   ellipsize by design and none of them is a string this pass touched). Option widths were
   measured against their `<select>` too: the only over-wide options are subclass names (PSA),
   unchanged.
4. **Console** — no errors at any point in the walk.
5. **Storage** — snapshotted before, restored after: same two keys
   (`spellForge.builds.v1`, `spellForge.sources.v1`), same 1888-byte serialisation, one empty
   default build. `localhost:8023` is an origin this session created; its only contents were the
   default build the app writes on first load, so no saved work existed there to lose.
