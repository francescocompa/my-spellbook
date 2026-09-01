# Strings inventory — My Spellbook

Every user-visible string in `src/index.html`, `src/app.js`, `src/styles.css` and the
UI-surfacing part of `src/extract.js`, grouped by surface. Line numbers verified with `grep -n`.

Excluded: console output, code comments, CSS class names, data keys, 5etools content data.

Tell vocabulary (closed list): `em dash`, `seamlessly`, `simply`, `just`, `triplet`,
`Note: throat-clearing`, `exclamation mark`, `Title Case in label`, `hedge`,
`states the obvious`, `ellipsis placeholder`, `emoji`.

---

## Header and toolbar

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:6 | `My Spellbook` | — | document title, browser tab |
| index.html:32 | `My Spellbook` | — | h1, top left |
| index.html:23 | `Back to the guided builder` | — | aria-label on the set-aside guide bar |
| index.html:25 | `Back to the guide` | — | button text in the set-aside guide bar |
| index.html:27 | `End the guided walk` | — | aria-label |
| index.html:27 | `Exit builder` | — | button label in the set-aside bar |
| index.html:41 | `Guided builder: walk the build level by level` | — | title on the compass icon button |
| index.html:41 | `Guided builder` | — | aria-label on the compass icon button |
| index.html:42 | `Build` | — | tab label |
| index.html:42 | `Spell table` | — | tab label, wide |
| index.html:42 | `Table` | — | tab label, narrow |
| index.html:44 | `Settings` | — | title on the ⋯ button |
| index.html:44 | `Settings` | — | aria-label on the ⋯ button |
| app.js:3956 | `${describeBuild(b.state)} · ${n} build${n===1?"":"s"} saved` | — | title on the build switcher button |
| app.js:3951 | `New build` | — | build switcher label with no character name |

## Settings menu

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:50 | `Builds…` | ellipsis placeholder | menu row |
| index.html:51 | `Guided builder…` | ellipsis placeholder | menu row |
| index.html:52 | `Random character` | — | menu row |
| index.html:53 | `Print / save as PDF…` | ellipsis placeholder | menu row |
| index.html:55 | `Content` | — | group header inside the menu |
| index.html:56 | `Library…` | ellipsis placeholder | menu row |
| index.html:57 | `Refresh imported data` | — | menu row |
| index.html:58 | `Custom spell…` | ellipsis placeholder | menu row |
| index.html:59 | `My homebrew…` | ellipsis placeholder | menu row |
| index.html:61 | `Toggle theme` | — | menu row |
| index.html:63 | `Reset build` | — | destructive menu row |
| app.js:5740 | `Refreshing…` | ellipsis placeholder | the Refresh row while busy |
| app.js:5740 | `Refresh imported data` | — | the Refresh row at rest |

## Build/version bar

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:455 | `Builds` | — | manager modal title |
| index.html:460 | `filter by name…` | ellipsis placeholder | search placeholder in the manager |
| index.html:461 | `Export all…` | ellipsis placeholder | manager toolbar |
| index.html:462 | `Import…` | ellipsis placeholder | manager toolbar |
| index.html:463 | `New build` | — | manager toolbar, primary |
| index.html:467 | `Drop a .spellbook.json build or a .spellbook-backup.json from another device here, browse…, or paste it below. Importing adds — it never replaces or removes anything you already have.` | em dash, ellipsis placeholder | the build-import drop note |
| index.html:467 | `browse…` | ellipsis placeholder | inline link inside that note |
| index.html:468 | `paste an exported build here…` | ellipsis placeholder | textarea placeholder |
| index.html:472 | `Cancel` | — | build-import footer |
| index.html:473 | `Add build` | — | build-import footer, primary |
| index.html:481 | `New build` | — | new-build modal title |
| index.html:482 | `Both can be renamed later in the manager.` | — | new-build modal subtitle |
| index.html:486 | `Character name` | — | field label |
| index.html:487 | `follows the classes you pick…` | ellipsis placeholder | placeholder |
| index.html:490 | `Version name` | — | field label |
| index.html:491 | `v1` | — | placeholder |
| index.html:497 | `Create & start guided` | — | secondary action |
| index.html:498 | `Create build` | — | primary action |
| app.js:446 | `Empty build` | — | summary of a build with no classes |
| app.js:456 | `New character` | — | derived character label with no classes |
| app.js:459 | `v1` | — | default version name |
| app.js:3740 | `just now` | just | relative time on a build row |
| app.js:3740 | `${m} min ago` | — | relative time |
| app.js:3741 | `${h} h ago` | — | relative time |
| app.js:3742 | `yesterday` | — | relative time |
| app.js:3742 | `${d} days ago` | — | relative time |
| app.js:3904 | `${rows.length} version` / `versions` | — | count beside a character name |
| app.js:3913 | `current` | — | chip on the active build row |
| app.js:3924 | `Export` | — | row action aria-label and tip title |
| app.js:3925 | `Downloads this build as a file you can keep, or move to another machine.` | — | tip body |
| app.js:3926 | `Duplicate` | — | row action |
| app.js:3927 | `Copies it as a new version of this character.` | — | tip body |
| app.js:3930 | `Delete` | — | row action aria-label |
| app.js:3930 | `Delete this version` | — | title on the delete button |
| app.js:3937 | `${total} build${…} across ${chars.length} character${…}` | — | manager subtitle |
| app.js:3938 | ` · ${shown} shown` | — | manager subtitle, when filtering |
| app.js:3938 | ` · click one to switch` | states the obvious | manager subtitle tail |
| app.js:3939 | `Nothing matches that filter.` | — | manager empty state |
| app.js:3997 | `1 version` / `${nver} versions` | — | switcher popover group count |
| app.js:4009 | `current` | — | chip in the switcher popover |
| app.js:4017 | `Actions for this version` | — | aria-label on the row ⋯ |
| app.js:4018 | `Export, duplicate or delete this version` | triplet | title on the row ⋯ |
| app.js:4023 | `Export` | — | switcher row menu |
| app.js:4024 | `Duplicate` | — | switcher row menu |
| app.js:4025 | `Delete` | — | switcher row menu |
| app.js:4036 | `New build` | — | switcher footer, primary |
| app.js:4038 | `Manage builds…` | ellipsis placeholder | switcher footer |
| app.js:3815 | `L${lv} variant` | — | auto name for a forked version |
| app.js:4139 | `Imported` | — | fallback character name on import |

## Class and level section

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:95 | `Character` | — | card heading |
| index.html:98 | `Classes & levels` | — | fieldset label |
| index.html:100 | `+ add a class…` | ellipsis placeholder | the add-class select prompt |
| index.html:135 | `Slots & casts` | — | card heading |
| index.html:138 | `Spell slots` | — | field label above the slot row |
| app.js:8784 | `Class` | — | class row label |
| app.js:8792 | `Subclass` | — | class row label |
| app.js:8800 | `— locked —` | em dash | subclass select before the subclass level |
| app.js:8800 | `— none —` | em dash | subclass select with nothing chosen |
| app.js:8804 | ` ✦` | emoji | marks a casting subclass in the select |
| app.js:8809 | `Lvl` | — | level stepper label |
| app.js:8810 | `−` / `+` | — | stepper buttons |
| app.js:8815 | `Remove class` | — | title on the row × |
| app.js:8816 | `subclass — pick one` | em dash | alert under a row owing a subclass |
| app.js:8773 | ` ·` | — | suffix marking a non-casting class in the select |
| app.js:8773 | ` (${c.source})` | — | book suffix when two printings share a name |
| app.js:8826 | `+ add a class…` | ellipsis placeholder | rebuilt add-class prompt |
| app.js:8826 | `every class is already in this build` | — | add-class prompt when nothing is left |
| app.js:88 | `Unlocks at level ${level}` | — | lock-chip tip title |
| app.js:88 | `${what} becomes available once the class reaches level ${level}.` | — | lock-chip tip body |
| app.js:8793 | `The subclass` | — | the subject passed to the subclass lock chip |
| app.js:6488 | `${m.feature} — no ${letters}` | em dash | casting-modification chip under a class row |
| app.js:6487 | `Verbal` / `Somatic` / `Material` | — | component names in that chip |
| app.js:6490 | `Removes` | — | casting-mod tip row label |
| app.js:6492 | `Only` | — | casting-mod tip row label, conditional mods |
| app.js:6493 | `Except` | — | casting-mod tip row label |
| app.js:6493 | `a Material component with a cost, or one the spell consumes` | — | casting-mod tip row value |
| app.js:6077 | `Your casting` | — | label on the table view's casting-mod strip |
| app.js:7378 | `Top spell` | — | stat tile |
| app.js:7379 | `Prepared` | — | stat tile |
| app.js:7380 | `Cantrips` | — | stat tile |
| app.js:7381 | `Eligible` | — | stat tile |
| app.js:7381 | `spells` | — | stat tile sub-unit |
| app.js:7384 | `Pact ${ROMAN[p.lvl]}` | — | pact slot tile |
| app.js:7385 | `Pact Magic: ${p.num} slots @ level ${p.lvl}, short-rest recharge — separate from the above.` | em dash | note under the slot row |
| app.js:7386 | `No slots — add a spellcasting class.` | em dash | slot row empty state |
| app.js:7388 | `Free / innate casts` | — | field label |
| app.js:7392 | ` fixed` | — | marks a source-fixed cast level |
| app.js:7399 | `DC ${own.dc}` / `atk ${own.atk}` | — | a source's own numbers on a free-cast row |

## Species

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:103 | `Species / lineage` | — | field label |
| index.html:104 | `— none —` | em dash | species button before anything is picked |
| app.js:8837 | `Species / lineage` | — | rebuilt field label |
| app.js:8839 | `— none —` | em dash | rebuilt species button label |
| app.js:8841 | `${r.name} · ${r.source} is off` | — | species button when its book is disabled |
| app.js:3590 | `Choose a species / lineage` | — | picker title |
| app.js:3727 | `1 lineage` / `${n} lineages` | — | count on a species group header |
| app.js:8334 | `${it.base} lineage` | — | subtitle in the species detail modal |
| app.js:8334 | `Species` | — | subtitle for a species with no lineage |
| app.js:4678 | `Replaces ${cur.name} — you can only have one species.` | em dash | prerequisite quick-fix popover note |

## Feats and optional features

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:107 | `Feats` | — | fieldset label |
| index.html:109 | `origin feat…` | ellipsis placeholder | origin slot button |
| index.html:110 | `general feat…` | ellipsis placeholder | general slot button |
| index.html:111 | `epic boon…` | ellipsis placeholder | epic slot button |
| app.js:3289 | `origin feat` / `general feat` / `epic boon` | — | the type line under a choice group |
| app.js:3293 | `feat` | — | fallback type line |
| app.js:3294 | `fighting style` | — | type line for a fighting-style feat |
| app.js:8850 | `Origin` / `General` / `Dragonmark` / `Dark Gift` / `Epic Boon` | Title Case in label | feat category names |
| app.js:8851 | `Fighting Style` / `Fighting Style (Paladin)` / `Fighting Style (Ranger)` | Title Case in label | feat category names |
| app.js:8852 | `Fighting Style (Bard)` / `Fighting Style (Monk)` | Title Case in label | feat category names |
| app.js:3589 | `Choose ${slot name}` | — | optional-feature picker title |
| app.js:3591 | `Choose an origin feat` | — | picker title |
| app.js:3591 | `Choose an epic boon` | — | picker title |
| app.js:3591 | `Choose a general feat` | — | picker title |
| app.js:4701 | `${ENT.slot.name}` | — | budget pill label in the optional-feature picker |
| app.js:4704 | `origin` | — | budget pill label |
| app.js:4705 | `general` | — | budget pill label |
| app.js:4706 | `epic boon` | — | budget pill label |
| app.js:4713 | `One too many ${label}` | — | budget pill title, over |
| app.js:4714 | `Your level grants no ${label} yet` | — | budget pill title, none |
| app.js:4715 | `You still owe ${cap-have} ${label} at this level` | — | budget pill title, owed |
| app.js:4715 | `${label} filled` | — | budget pill title, done |
| app.js:9044 | `More than your level grants` | — | slot-count tip title |
| app.js:9044 | `You have taken ${have} where your level grants ${cap}. Nothing is removed — check with your DM.` | em dash | slot-count tip body |
| app.js:9045 | `None at this level` | — | slot-count tip title |
| app.js:9045 | `Your level grants none of these yet. You can still take one — it will read as more than your level grants.` | em dash | slot-count tip body |
| app.js:9046 | `Slots filled` | — | slot-count tip title |
| app.js:9046 | `All ${cap} taken.` | — | slot-count tip body |
| app.js:9047 | `Still to choose` | — | slot-count tip title |
| app.js:9047 | `${cap-have} of ${cap} left to choose.` | — | slot-count tip body |
| app.js:9107 | `${x.n} from ${x.name}` / `1 from ${x.name}` | — | names a granted feat slot in the tip |
| app.js:9111 | `Every feat your classes grant, boons included.` | — | note appended to the general slot tip |
| app.js:9113 | `One feat slot arrives` / `${b.epic} feat slots arrive` | — | epic slot tip |
| app.js:9113 | ` at character level 19 or later, so a boon is taken WITH one of your feat slots, not on top of them.` | — | epic slot tip tail |
| app.js:9151 | `${slot name}…` | ellipsis placeholder | the add button inside an optional-feature slot |
| app.js:9166 | `Prerequisite not met` | — | tip title on an optional-feature chip |
| app.js:9166 | `${o.name} needs ${pr.why}. Kept in the build — nothing is removed.` | em dash | tip body |
| app.js:9182 | `Prerequisite not met` | — | tip title on a feat chip |
| app.js:9182 | `${f.name} needs ${pr.why}. Kept in the build — nothing is removed.` | em dash | tip body |
| app.js:9168 | `#${ord}` | — | ordinal on a repeated optional feature |
| app.js:9185 | `#${ord}` | — | ordinal on a repeated feat |
| app.js:8320 | `Eldritch Invocation` / `Battle Master Maneuver` / `Maneuver` | Title Case in label | optional-feature type names |
| app.js:8321 | `Metamagic` / `Elemental Discipline` / `Artificer Infusion` / `Arcane Shot` | Title Case in label | optional-feature type names |
| app.js:8322 | `Pact Boon` / `Rune` / `House Renown` / `Fighting Style` | Title Case in label | optional-feature type names |
| app.js:8329 | `Optional feature` | — | fallback type name |
| app.js:3671 | `Requires` | — | label before the prerequisite chips in a picker row |
| app.js:3680 | `Click to take it` | — | title on an unmet prerequisite chip |
| app.js:4676 | `Take this ${noun}` | — | prerequisite quick-fix popover title |
| app.js:4676 | `Nothing matching in your books` | — | quick-fix popover, nothing to offer |
| app.js:4674 | `species` / `option` / `feat` | — | the noun in that title |
| app.js:4684 | `Switch to it` / `Select` | — | quick-fix popover button |
| app.js:8965 | `level ${b.level}` | — | prerequisite part |
| app.js:8974 | `Pact of the ${b.pact}` | — | prerequisite part |
| app.js:8979 | `spellcasting` | — | prerequisite part |
| app.js:9003 | `no other ${label} feat` | — | prerequisite part |
| app.js:9004 | `you already have ${clash}` | — | title on that part when it fails |
| app.js:9007 | `other requirements` | — | prerequisite part the app cannot check |
| app.js:3707 | `Take ${it.name} again — you can gain it more than once` | em dash | second take button on a repeatable entry |

## Custom sources

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:120 | `Spell sources` | — | fieldset label |
| index.html:120 | `items, boons…` | ellipsis placeholder | field note beside it |
| index.html:121 | `custom source…` | ellipsis placeholder | the add button |
| index.html:537 | `Custom spell source` | — | editor modal title |
| index.html:538 | `A thing this character owns that grants spells — a magic item, a boon, a blessing.` | em dash, triplet | editor subtitle |
| index.html:547 | `Name` | — | field label |
| index.html:548 | `Staff of Fire` | — | name placeholder |
| index.html:549 | `magic item, boon, blessing… (optional)` | ellipsis placeholder, triplet | kind placeholder |
| index.html:555 | `Change` | — | discloses the casting rules |
| index.html:558 | `Casting` | — | select label |
| index.html:563 | `Charge pool` | — | field label |
| index.html:563 | `blank = no pool` | — | field note |
| index.html:565 | `none` | — | pool size placeholder |
| index.html:566 | `charges · regains` | — | inline label between pool and recharge |
| index.html:567 | `1d6+4 at dawn` | — | recharge placeholder |
| index.html:573 | `Spells` | — | field label |
| index.html:576 | `add a spell by name…` | ellipsis placeholder | search placeholder |
| index.html:579 | `Grant a choice from a filtered list` | — | title on the choice button |
| index.html:579 | `or a choice…` | ellipsis placeholder | the choice button |
| index.html:586 | `Spellcasting stat` | — | disclosure label |
| index.html:591 | `Save DC` | — | field label |
| index.html:591 | `15` | — | DC placeholder |
| index.html:592 | `Attack` | — | field label |
| index.html:592 | `+7` | — | attack placeholder |
| index.html:593 | `Casting ability` | — | field label |
| index.html:600 | `Delete source` | — | destructive footer button |
| index.html:603 | `Save` | — | primary footer button |
| app.js:2814 | `per long rest` / `/LR` | — | use cadence, long and short forms |
| app.js:2814 | `per short rest` / `/SR` | — | use cadence |
| app.js:2815 | `per dawn` / `/dawn` | — | use cadence |
| app.js:2819 | `in total` / `total` | — | use cadence |
| app.js:2820 | `at will` | — | use cadence |
| app.js:2822 | `cast without preparing` | — | source mode |
| app.js:2822 | `always prepared` | — | source mode |
| app.js:2823 | `added to my spell list` | — | source mode |
| app.js:2824 | `at will` | — | cadence phrase |
| app.js:2826 | `once only` | — | cadence phrase |
| app.js:2826 | `${n} times total` | — | cadence phrase |
| app.js:2828 | `${n}× ${u}` | — | cadence phrase |
| app.js:2844 | `always prepared` | — | recharge text |
| app.js:2845 | `${n} charges` | — | recharge text for a pooled spell |
| app.js:2859 | `chosen once — can't be changed` | em dash | re-choice cadence |
| app.js:2859 | `re-chosen on a long rest` | — | re-choice cadence |
| app.js:2860 | `re-chosen on a short rest` / `re-chosen at dawn` | — | re-choice cadence |
| app.js:2861 | `re-chosen when you gain a level` | — | re-choice cadence |
| app.js:2882 | `choose ${n} ` / `choose a ` | — | choice phrase, summary voice |
| app.js:2883 | `cantrip` / `${lv}-level` | — | choice phrase |
| app.js:2885 | ` from the ${cl} list` | — | choice phrase |
| app.js:2887 | ` (chosen once)` | — | choice phrase |
| app.js:2894 | `level ${lv}` | — | choice row descriptor |
| app.js:2896 | `${cl} list` | — | choice row descriptor |
| app.js:2904 | `choose ${n} spells` / `choose a spell` | — | choice row descriptor |
| app.js:2904 | ` — any spell` | em dash | choice row descriptor with no filter |
| app.js:2933 | `always prepared` | — | source power line |
| app.js:2934 | `added to your spell list` | — | source power line |
| app.js:2936 | `per-spell uses` | — | source power line |
| app.js:2937 | `${cs.pool} charges · regains ${cs.recharge}` | — | source power line |
| app.js:2938 | `${own} spell on its own uses` / `spells on their own uses` | — | source power line |
| app.js:4222 | `Kind` / `Uses` | — | chip tip rows |
| app.js:4223 | `Save DC` / `Attack` | — | chip tip rows |
| app.js:4235 | `Edit spell source` | — | editor title when editing |
| app.js:4235 | `Custom spell source` | — | editor title when new |
| app.js:4245 | `mine` | — | casting-ability select, inherit option |
| app.js:4286 | `a pool of ${CSRC.pool} charges` | — | rule line clause |
| app.js:4287 | `, regains ${CSRC.recharge}` | — | rule line clause |
| app.js:4290 | `${onPool} spells spend charges, but there is no pool` | — | rule line contradiction warning |
| app.js:4291 | `${onOwn} spell on its own uses` / `spells on their own uses` | — | rule line clause |
| app.js:4292 | `each spell on its own uses` | — | rule line fallback |
| app.js:4292 | `no charge pool` | — | rule line fallback |
| app.js:4299 | `Done` / `Change` | — | the rule-line disclosure button |
| app.js:4309 | `set — ${bits}` | em dash | spellcasting-stat disclosure label |
| app.js:4309 | `uses mine` | — | spellcasting-stat disclosure label when blank |
| app.js:4320 | `This source` | — | summary fallback name |
| app.js:4325 | `Add a spell and ${name} will describe itself here.` | — | summary placeholder |
| app.js:4327 | `${a}, ${b} and ${n} more` | — | summary spell list |
| app.js:4329 | `have ${list} always prepared` | — | summary clause |
| app.js:4330 | `add ${list} to your spell list — you prepare them normally` | em dash | summary clause |
| app.js:4348 | ` charges` | — | summary clause |
| app.js:4350 | `cast ${what} spending from ` | — | summary clause |
| app.js:4351 | `a pool with no charges set` | — | summary warning |
| app.js:4353 | ` (regains ${cs.recharge})` | — | summary clause |
| app.js:4357 | `${own.length} more on their own uses` | — | summary clause |
| app.js:4361 | ` and cast it ${recharge}` | — | summary clause for a choice entry |
| app.js:4364 | ` — all without preparing` | em dash | summary tail, two or more clauses |
| app.js:4365 | ` without preparing` | — | summary tail, one clause |
| app.js:4367 | `saves are DC ${dc}` | — | summary numbers clause |
| app.js:4368 | `attacks ${atk}` | — | summary numbers clause |
| app.js:4369 | `it casts with ${ability}` | — | summary numbers clause |
| app.js:4391 | `No spells yet — search below to add one.` | em dash | spell-row empty state |
| app.js:4408 | `Charges this spell costs` | — | title on the per-spell cost field |
| app.js:4410 | `costs` | — | inline label before the cost field |
| app.js:4432 | `at ${ROMAN[e.level]}` | — | folded tag for a fixed cast level |
| app.js:4435 | `Per-spell options` | — | aria-label on the row caret |
| app.js:4451 | `from the charge pool` | — | per-spell payment select |
| app.js:4452 | `its own uses` | — | per-spell payment select |
| app.js:4463 | `as written` | — | cast-level select |
| app.js:4464 | `cast at ${ROMAN[L]}` | — | cast-level select |
| app.js:4471 | `note — e.g. deals cold damage instead` | em dash | per-spell note placeholder |
| app.js:4502 | `Take` | — | choice filter row label |
| app.js:4506 | `spell(s) — nothing ticked below means ANY` | em dash | choice filter row note |
| app.js:4509 | `Change` | — | choice filter row label for the re-choice cadence |
| app.js:4515 | `Level` | — | choice filter chip row label |
| app.js:4515 | `cantrip` | — | level 0 chip |
| app.js:4517 | `Class` | — | choice filter chip row label |
| app.js:4518 | `School` | — | choice filter chip row label |
| app.js:4536 | `cantrip` / `level ${sp.level}` | — | search-hit sub-line |
| app.js:4556 | `Give it a name.` | — | save validation error |
| app.js:4557 | `Add at least one spell.` | — | save validation error |
| app.js:9696 | `Delete source` | — | armed-confirm label |

## Choices

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:129 | `Choices to make` | — | card heading |
| app.js:3306 | `${pending} pending` | — | card count chip |
| app.js:3306 | `all set` | — | card count chip when nothing is owed |
| app.js:3323 | `1 choice` / `${n} choices` | — | count on a choice group header |
| app.js:3321 | `#${rep}` | — | ordinal on a repeated giver |
| app.js:3358 | `Casting ability` | — | left-hand label of an ability choice |
| app.js:3358 | `Choose one` | — | left-hand label of an option choice |
| app.js:3387 | `${ask}` capitalised | — | left-hand label of a pick choice |
| app.js:3387 | `choose` | — | fallback when no ask can be composed |
| app.js:3388 | `${have}/${c.count}` | — | counter beside the ask |
| app.js:3407 | `Change the designation` | — | title on the edit button, designations |
| app.js:3407 | `Edit these picks` | — | title on the edit button, picks |
| app.js:3409 | `Designate` | — | button label, designation still owed |
| app.js:3409 | `Choose ${c.count-have}` | — | button label, picks still owed |
| app.js:2962 | `— none —` | em dash | the no-fighting-style option |
| app.js:2972 | `Extra cantrip` | — | fallback order-choice option name |
| app.js:2973 | `Protector` / `Warden` | — | the non-caster order option |
| app.js:2973 | `Other benefit` | — | fallback for an unknown order feature |
| app.js:2979 | `choose a cantrip` | — | desc on the order cantrip pick |
| app.js:2980 | `always known` | — | recharge label on that granted cantrip |
| app.js:1570 | `Casting ability` | — | chain label for an ability choice |
| app.js:1571 | `Option` | — | chain label fallback for an option group |
| app.js:1572 | `choose ${n} spells` / `choose a spell` | — | chain label fallback for a pick |
| app.js:1559 | `cantrips` / `cantrip` / `spells` / `spell` | — | noun inside a composed pick ask |
| app.js:1562 | `level-${n} ` | — | composed pick ask, single level |
| app.js:1565 | ` up to level ${n}` | — | composed pick ask, range from cantrips |
| app.js:1566 | ` at level ${a}–${b}` | — | composed pick ask, level range |
| app.js:1560 | `ritual` | — | composed pick ask qualifier |
| app.js:8556 | `Your choices` | — | block title inside a detail modal |
| app.js:714 | `class` / `subclass` / `feat` / `optional feature` / `species` / `custom source` | — | owner kind labels used by the choices panel |
| app.js:94 | `Intelligence` / `Wisdom` / `Charisma` / `Strength` / `Dexterity` / `Constitution` | — | ability names in selects and tips |
| app.js:95 | `Int` / `Wis` / `Cha` / `Str` / `Dex` / `Con` | — | ability chips |
| app.js:672 | `Abjuration` … `Psionic` | — | school names |

## Spell list and filters

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:153 | `Eligible spells` | — | card heading |
| index.html:156 | `filter by name…` | ellipsis placeholder | search placeholder |
| index.html:157 | `Filters` | — | title on the funnel button |
| index.html:157 | `Filters` | — | aria-label on the funnel button |
| index.html:158 | `picked` | — | the picked-only toggle |
| index.html:161 | `Level` | — | filter panel label |
| index.html:162 | `School` | — | filter panel label |
| index.html:162 | `all schools` | — | school select, no filter |
| index.html:163 | `Class / list` | — | filter panel label |
| index.html:163 | `all classes` | — | class select placeholder in markup |
| index.html:164 | `Source book` | — | filter panel label |
| index.html:165 | `Books` | — | the books panel toggle |
| index.html:166 | `Casting time` | — | filter panel label |
| index.html:167 | `Components` | — | filter panel label |
| index.html:168 | `Tags` | — | filter panel label |
| index.html:169 | `Saving throw` | — | filter panel label |
| index.html:169 | `any save` | — | save select, no filter |
| index.html:170 | `Damage type` | — | filter panel label |
| index.html:170 | `any damage` | — | damage select, no filter |
| index.html:171 | `Editions` | — | filter panel label |
| index.html:172 | `Hide reprinted (newest only)` | — | editions option |
| index.html:173 | `Show all versions` | — | editions option |
| index.html:176 | `Enable all` | — | books quick action |
| index.html:177 | `Disable all` | — | books quick action |
| index.html:178 | `2024 core only` | — | books quick action |
| index.html:179 | `Reset to my sources` | — | books quick action |
| index.html:183 | `Clear filters` | — | filter panel footer |
| index.html:190 | `Clear all filters` | — | title on the active-filter clear |
| index.html:190 | `Clear all filters` | — | aria-label on the active-filter clear |
| app.js:341 | `Action` / `Bonus action` / `Reaction` / `Longer casting` | — | active-filter chip names for casting time |
| app.js:342 | `Verbal` / `Somatic` / `Material` | — | active-filter chip names for components |
| app.js:343 | `Ritual` / `Concentration` / `Attack roll` / `Upcasts` | — | active-filter chip names for tags |
| app.js:344 | `Consumes material` | — | active-filter chip name |
| app.js:348 | `Cantrips` | — | active-filter chip, level 0 only |
| app.js:348 | `${ROMAN[l]} level` | — | active-filter chip, one level |
| app.js:349 | `Levels ${list}` | — | active-filter chip, several levels |
| app.js:351 | `Every spell` | — | active-filter chip for the ignore-eligibility option |
| app.js:352 | `${save} save` | — | active-filter chip |
| app.js:353 | `${dmg} damage` | — | active-filter chip |
| app.js:356 | `All editions` | — | active-filter chip |
| app.js:358 | `Books (${n})` | — | active-filter chip |
| app.js:7547 | `Cantrip` | — | level filter chip, level 0 |
| app.js:7548 | `all schools` | — | rebuilt school select prompt |
| app.js:7550 | `every spell (ignore eligibility)` | — | class/list select option |
| app.js:7550 | `any source` | — | class/list select prompt |
| app.js:7551 | `any save` | — | rebuilt save select prompt |
| app.js:7552 | `any damage` | — | rebuilt damage select prompt |
| app.js:7554 | `Action` / `Bonus` / `Reaction` / `Longer` | — | casting-time filter chips |
| app.js:7555 | `V` / `S` / `M` | — | component filter chips |
| app.js:7556 | `Ritual` / `Concentr.` / `Atk roll` / `Upcasts` / `Consumes mat.` | — | tag filter chips |
| app.js:7608 | `${n} spells` / `${n} spell` | — | the card count chip |
| app.js:7611 | ` · ${extra.length} dimmed` | — | count chip tail |
| app.js:7613 | `${extra.length} dimmed` | — | count chip when nothing is eligible |
| app.js:7600 | `not on your lists` | — | dim reason tag on a spell row |
| app.js:7602 | `filtered out` | — | dim reason tag on a spell row |
| app.js:8708 | `Matches your search but not your other filters.` | — | title on the `filtered out` tag |
| app.js:8709 | `No class, subclass, species or feat in your build grants this spell.` | — | title on the `not on your lists` tag |
| app.js:8698 | `R` | — | ritual badge on a spell row |
| app.js:8703 | `conc.` | — | meta chip on a spell row |
| app.js:8726 | `${t.name} ` + `${sel}/${cap}` | — | per-class take button |
| app.js:8727 | `Prepared — click to remove. ` | em dash | title on a taken button |
| app.js:8727 | `Not prepared — click to add. ` | em dash | title on an untaken button |
| app.js:8727 | `${t.name}: ${sel} of ${cap} cantrips` / `in spellbook` / `prepared` | — | title tail |
| app.js:8727 | ` (over your forecast)` | — | title tail when over budget |
| app.js:8731 | `Always prepared` | — | tip title on a granted spell row |
| app.js:8731 | `Free from ${g.src} — it doesn't count against your prepared list.` | em dash | tip body |
| app.js:1427 | `Cantrips` / `${ROMAN[l]} level` | — | level group header |
| app.js:1432 | `Show ` / `Hide ` + `cantrips` / `${ROMAN[l]}-level spells` | — | title on the level fold button |
| app.js:7630 | `${n} known` / `${n} picked` | — | level group toolbar count |
| app.js:7632 | `Unpick all cantrips` / `Unpick all ${ROMAN[l]}-level picks` | — | level group clear button title and aria-label |
| app.js:9247 | `all` / `some` / `none` | — | the group tick label in a book checklist |
| app.js:9253 | `${n}sp` | — | spell count beside a book in a checklist |
| app.js:9212 | `2024 core` / `2014 core` / `Supplements` | — | book group headings |
| app.js:9213 | `Settings & adventures` / `Homebrew & UA` / `Other` | — | book group headings |

## Pickers (spell picker, entity picker, forms chooser)

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:232 | `Choose spells` | — | spell picker title in markup |
| index.html:232 | `Close` | — | aria-label on the × |
| index.html:236 | `filter by name…` | ellipsis placeholder | spell picker search |
| index.html:238 | `Filter by level` | — | title and aria-label on the funnel |
| index.html:239 | `Filter by level` | — | label inside the level popover |
| index.html:241 | `Show only the spells already picked here` | — | title on the picked toggle |
| index.html:241 | `Picked` | — | the picked toggle |
| index.html:242 | `Clear all selections in this picker` | — | title on Clear |
| index.html:242 | `Clear` | — | button |
| index.html:250 | `Choose` | — | entity picker title in markup |
| index.html:256 | `filter by name…` | ellipsis placeholder | entity picker search |
| index.html:258 | `Filters` | — | title and aria-label on the funnel |
| index.html:260 | `Feat category` | — | filter popover heading |
| index.html:263 | `Only ones that grant spells` | — | filter checkbox |
| index.html:264 | `Hide ones I can't take` | — | filter checkbox |
| index.html:266 | `Books` | — | filter popover heading |
| index.html:268 | `All` | — | books quick action |
| index.html:269 | `None` | — | books quick action |
| index.html:270 | `2024 core` | — | books quick action |
| index.html:271 | `My sources` | — | books quick action |
| index.html:713 | `Forms` | — | forms chooser title in markup |
| index.html:720 | `filter by name…` | ellipsis placeholder | forms chooser search |
| index.html:722 | `Filters` | — | title and aria-label on the funnel |
| index.html:724 | `Source book` | — | forms filter heading |
| index.html:727 | `Only the ones I've marked` | — | forms filter checkbox |
| app.js:3448 | `Designate a spell` | — | picker title for a designation |
| app.js:3449 | `Choose ${n} spells` / `Choose 1 spell` | — | picker title for a pick |
| app.js:3451 | `${giver} · ${ask}` | — | picker subtitle |
| app.js:3464 | `${class} — Magical Secrets` | em dash | off-list picker title |
| app.js:3466 | `spells from other lists · ${used} of ${cap} used` | — | off-list picker subtitle |
| app.js:3475 | `${class} — ${title}` | em dash | by-level picker title |
| app.js:3476 | `Level 1–${ROMAN[maxLevel]} · ${sub}` | — | by-level picker subtitle |
| app.js:3480 | `Spellbook` | — | by-level picker title for a wizard |
| app.js:3480 | `click to add or remove from your book` | states the obvious | subtitle for a wizard |
| app.js:3480 | `In your book` | — | picked-toggle label for a wizard |
| app.js:3481 | `In your book — click to remove` | em dash, states the obvious | take button title, held |
| app.js:3481 | `Add it to your spellbook` | — | take button title, not held |
| app.js:3482 | `Known spells` | — | by-level picker title for a level-swap caster |
| app.js:3482 | `click to learn or drop` | states the obvious | subtitle |
| app.js:3482 | `Known` | — | picked-toggle label |
| app.js:3483 | `Known — click to drop` | em dash, states the obvious | take button title, held |
| app.js:3483 | `Learn it` | — | take button title |
| app.js:3484 | `Prepare spells` | — | by-level picker title for a daily caster |
| app.js:3484 | `click to prepare or unprepare` | states the obvious | subtitle |
| app.js:3484 | `Prepared` | — | picked-toggle label |
| app.js:3485 | `Prepared — click to unprepare` | em dash, states the obvious | take button title, held |
| app.js:3485 | `Prepare it` | — | take button title |
| app.js:3500 | `Levels` | — | the level filter button |
| app.js:3504 | `Picked` | — | picked toggle for a granted choice |
| app.js:3516 | `Picked — click to remove` | em dash, states the obvious | take button title in a granted choice |
| app.js:3517 | `Pick it` | — | take button title |
| app.js:3538 | `Nothing picked here yet.` | — | picker empty state |
| app.js:3539 | `${why} There is nothing to offer here.` | — | picker empty state, no class list |
| app.js:3540 | `No eligible spells at this level yet.` | — | picker empty state |
| app.js:3540 | `No matching spells for this choice.` | — | picker empty state |
| app.js:3561 | `Expanded spell list` | — | grant preview line in a picker row |
| app.js:3607 | `${on}/${n}` | — | the books count badge |
| app.js:3626 | `options` / `species` / `feats` | — | the noun in the picker subtitle |
| app.js:3627 | `${items.length} ${noun} · [spark] grants spells` | emoji | picker subtitle, with the spark icon inline |
| app.js:3628 | ` · ${blocked.length} need something you don't have` | — | picker subtitle tail |
| app.js:3636 | `Nothing matches those filters.` | — | entity picker empty state |
| app.js:3689 | `Selected — click to remove` | em dash, states the obvious | take button label, held |
| app.js:3689 | `Select` | — | take button label |
| app.js:3691 | ` · you don't meet its prerequisites, you can still take it` | — | take button title tail |
| app.js:3695 | `Enabled ${bookName} in your sources` | — | note appended to the picker subtitle |
| app.js:7935 | `Summon forms` | — | field label on the character card |
| app.js:7941 | `choose a ${sp.name} form…` | ellipsis placeholder | the summon-forms button |
| app.js:7943 | `Choose which ${sp.name} forms this character uses` | — | title on that button |
| app.js:7951 | `Dismiss` | — | aria-label on the offer × |
| app.js:7952 | `Dismiss — you can still mark forms in the spell's own details` | em dash | title on the offer × |
| app.js:7956 | `${givers} adds ${n} forms. Only marked forms print.` | — | note under an unanswered offer |
| app.js:8021 | `${sp.name} forms` | — | forms chooser title |
| app.js:8022 | `${givers} adds ${n} of these. ` | — | forms chooser subtitle head |
| app.js:8024 | `Only marked forms print, and a marked form leads the carousel.` | — | forms chooser subtitle tail |
| app.js:8030 | `${n} form` / `${n} forms` | — | count on the granted group |
| app.js:8040 | `Other familiars` | — | fold header for the spell's own set |
| app.js:7997 | `Marked — click to unmark` | em dash, states the obvious | forms row button |
| app.js:7997 | `Mark this form` | — | forms row button |
| app.js:7998 | ` · only marked forms print` | — | title tail |
| app.js:8049 | `Nothing matches those filters.` | — | forms chooser empty state |
| app.js:8050 | `This spell carries no stat blocks.` | — | forms chooser empty state |
| app.js:7992 | `CR ${c.cr}` | — | forms row meta |

## Spell modal / stat blocks

| location | current string | AI tells | note |
|---|---|---|---|
| app.js:7710 | ` (ritual)` | — | subtitle suffix |
| app.js:7711 | `${school} cantrip` / `${ROMAN}-level ${school}` | — | modal and tip subtitle |
| app.js:7720 | `Page` / `Code` | — | book chip popover rows |
| app.js:7724 | `Time` / `Range` | — | hover tip rows |
| app.js:7725 | `Duration` / `Concentration, ` | — | hover tip row |
| app.js:7726 | `click for full details` | states the obvious | hover tip footer |
| app.js:8152 | `Casting time` / `Range` / `Components` / `Duration` | — | modal grid labels |
| app.js:8153 | `Concentration, up to ` | — | duration prefix |
| app.js:7700 | `—` | em dash | components fallback when the spell has none |
| app.js:7805 | `Access` | — | section label |
| app.js:7796 | `Classes` / `Subclasses` / `Species` / `Feats` | — | access category labels |
| app.js:7807 | `Show by category` | — | title and aria-label on the access toggle |
| app.js:8110 | `Which books these forms come from` | — | title on the stat-block book button |
| app.js:8110 | `Filter by book` | — | aria-label on it |
| app.js:8113 | `Mark this form` | — | aria-label on the star |
| app.js:8118 | `Previous creature` / `Next creature` | — | carousel aria-labels |
| app.js:8119 | `1 / ${all.length}` | — | carousel position |
| app.js:8128 | `stat block` | — | the sub-line under a creature name |
| app.js:8130 | `Expand stat block` | — | aria-label on the caret |
| app.js:8157 | `Close` | — | title and aria-label on the × |
| app.js:8178 | `Metamagic` | — | section label |
| app.js:8182 | `This spell ${why}. Advisory — the option's full text has the final word.` | em dash | metamagic chip tip |
| app.js:6277 | `forces a saving throw, so chosen creatures can be spared` | — | Careful Spell reason |
| app.js:6279 | `has a range to double (touch becomes 30 feet)` | — | Distant Spell reason |
| app.js:6281 | `rolls damage, so dice can be rerolled` | — | Empowered Spell reason |
| app.js:6283 | `lasts a minute or longer, so the duration can double` | — | Extended Spell reason |
| app.js:6285 | `forces a saving throw, and one save can be made with disadvantage` | — | Heightened Spell reason |
| app.js:6287 | `takes an action to cast, which can become a bonus action` | — | Quickened Spell reason |
| app.js:6291 | `makes an attack roll, and a miss can be rerolled` | — | Seeking Spell reason |
| app.js:6295 | `deals a damage type Transmuted Spell can change` | — | Transmuted Spell reason |
| app.js:6298 | `can target one additional creature from a higher slot — Twinned adds one without spending it` | em dash | Twinned Spell reason |
| app.js:6277 | `careful` / `distant` / `empower` / `extend` / `heighten` / `quicken` / `seek` / `transmute` / `twin` | — | metamagic chip tags |
| app.js:8092 | `AC` / `HP` / `Speed` | — | stat block rows |
| app.js:8077 | `Mod` / `Save` | — | ability table headers |
| app.js:8094 | `Skills` | — | stat block row |
| app.js:8095 | `Vulnerabilities` / `Resistances` | — | stat block rows |
| app.js:8096 | `Immunities` | — | stat block row |
| app.js:8097 | `Senses` / `Languages` | — | stat block rows |
| app.js:8098 | `CR` / `Prof. Bonus` | — | stat block rows |
| app.js:8283 | `CR ${c.cr}` | — | creature tip sub-line |
| app.js:8287 | `click for the full stat block` | states the obvious | creature tip footer |
| app.js:8293 | `Added to this spell by ${c._from}` | — | creature modal subtitle |
| app.js:8293 | `Stat block` | — | creature modal subtitle |
| app.js:8239 | `Marked — this form prints and comes first` | em dash | title on the carousel star |
| app.js:8239 | `Mark this form: only marked forms print` | — | title on the carousel star |
| app.js:8267 | `${off.length} of these books are off in your sources — tick one to include its forms here.` | em dash | note in the stat-block book panel |
| app.js:8272 | `${n} form` / `${n} forms` | — | count beside a book in that panel |
| app.js:8195 | `Homebrew` | — | tag on a homebrew spell modal |
| app.js:8196 | `Edit` | — | homebrew action in the modal |
| app.js:8197 | `Delete` | — | homebrew action in the modal |
| app.js:8615 | `Status` / `Condition` | — | condition tip sub-line |

## Entity detail modal (feat, class, subclass, species, optional feature)

| location | current string | AI tells | note |
|---|---|---|---|
| app.js:8332 | `${category} feat` | — | modal subtitle for a feat |
| app.js:8335 | `Class` | — | modal subtitle for a class |
| app.js:8336 | `${it.className} subclass` | — | modal subtitle for a subclass |
| app.js:8356 | `${n} features, level ${a} to ${b}: ` | — | tip body for a class with no prose |
| app.js:8362 | `Requires` | — | tip row label |
| app.js:8365 | `click for full details` | states the obvious | tip footer |
| app.js:8399 | `Primary ability` | — | core-traits row |
| app.js:8400 | `Hit point die` / ` per level` | — | core-traits row |
| app.js:8401 | `Saving throws` | — | core-traits row |
| app.js:8402 | `Skills` | — | core-traits row |
| app.js:8403 | `Weapons` | — | core-traits row |
| app.js:8404 | `Armor` | — | core-traits row |
| app.js:8405 | `Tools` | — | core-traits row |
| app.js:8406 | `Spellcasting ability` | — | core-traits row |
| app.js:8407 | `Starting equipment` | — | core-traits row |
| app.js:8409 | `Core traits` | — | block title |
| app.js:8394 | `Choose ${c.count}: ` | — | proficiency choice phrasing |
| app.js:8437 | `Level` / `PB` / `Features` | — | progression table headers |
| app.js:8449 | `Progression` | — | block title |
| app.js:8473 | `Level ${L}` | — | feature group header |
| app.js:8474 | `${n} feature` / `${n} features` | — | feature group count |
| app.js:8482 | `No text for this feature in the imported data.` | — | empty feature body |
| app.js:8484 | `Features` | — | block title |
| app.js:8485 | `Collapse all` | — | block tool |
| app.js:8600 | `Expand all` | — | the same tool, flipped |
| app.js:8491 | `Category` | — | at-a-glance row |
| app.js:8492 | `Type` | — | at-a-glance row |
| app.js:8493 | `Species` | — | at-a-glance row |
| app.js:8494 | `Class` | — | at-a-glance row |
| app.js:8495 | `Full name` | — | at-a-glance row |
| app.js:8496 | `Requires` | — | at-a-glance row |
| app.js:8497 | `Ability score` | — | at-a-glance row |
| app.js:8498 | `Spellcasting ability` | — | at-a-glance row |
| app.js:8499 | `Repeatable` / `You can take this more than once` | — | at-a-glance row |
| app.js:8500 | `Also grants` / `a feat slot` | — | at-a-glance row |
| app.js:8505 | `At a glance` | — | block title |
| app.js:8507 | `Benefits` / `What it does` / `Traits` / `About` | — | prose block titles per kind |
| app.js:8381 | `${amt} to one of ` | — | ability-gain phrasing |
| app.js:8524 | `Expanded spell list` | — | grants block row |
| app.js:8532 | `Level ${L}` / `Always` | — | grants block row label |
| app.js:8534 | `Choose` | — | grants block row label for an option group |
| app.js:8535 | `Spells it gives you` | — | block title |
| app.js:8540 | `The books' own text for this isn't in the imported data. What it grants and where it is printed are below.` | — | empty-record notice |
| app.js:8669 | `${name} — read what it gives` | em dash | aria-label on the field info button |
| app.js:8683 | `Feature` | — | feature modal subtitle fallback |
| app.js:8683 | ` · level ${f.level}` | — | feature modal subtitle |
| app.js:7079 | `No text for this feature in the imported data.` | — | tip body on a timeline gains link |

## Timeline

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:611 | `Timeline` | — | aria-label on the modal |
| index.html:614 | `Timeline` | — | modal title |
| index.html:618 | `Close` | — | aria-label on the × |
| index.html:623 | `Guide me from here` | — | footer button in markup |
| app.js:6593 | `L${view} / ${total}` | — | the level chip |
| app.js:6597 | `The build at every level` | — | level chip tip title |
| app.js:6598 | `Viewing level ${view} of ${total}. ` | — | level chip tip body |
| app.js:6599 | `Open the timeline to jump to a level, reorder how the levels were taken, and move picks between them.` | triplet | level chip tip body |
| app.js:6600 | ` ${n} issues to check, at ${levels} — the timeline marks the rows.` | em dash | level chip tip tail |
| app.js:6608 | `${n} issue` / `${n} issues` | — | the sweep's own count |
| app.js:6617 | `Level ${n}: ${issueCount}` | — | health bar heading |
| app.js:6619 | `+${n} more at this level` | — | health bar tail |
| app.js:7030 | `Order matters in this build` | — | gold flag tip title |
| app.js:7032 | `. Drag the rows to change which class each level was taken in.` | — | gold flag tip tail |
| app.js:1207 | `a feat slot can land either side of level 19, and an Epic Boon rides on which` | — | order-matters reason |
| app.js:1209 | `when each class's levels land decides when its picks arrive and what they could be` | — | order-matters reason |
| app.js:7055 | `L${i}` | — | row level tag |
| app.js:7063 | `Level ${i}: ${issueCount}` | — | row warning tip title |
| app.js:7086 | `Not chosen yet` | — | tip title on an undecided gain |
| app.js:7087 | `Open the class row and pick a subclass.` | — | tip body |
| app.js:7089 | `Open the epic boon picker. Taking the ability score improvement instead means leaving this empty.` | — | tip body |
| app.js:7090 | `Open the feat picker. Taking the ability score improvement instead means leaving this empty.` | — | tip body |
| app.js:7091 | `Open the ${prog} picker — this level still has room.` | em dash | tip body |
| app.js:6637 | `Subclass — not chosen` | em dash | gains-line entry |
| app.js:6642 | `Feat / ASI` | — | gains-line entry |
| app.js:6643 | `Epic Boon` | Title Case in label | gains-line entry |
| app.js:6648 | `+${d} ${prog name}` | — | gains-line entry |
| app.js:7095 | `No new features` | — | gains line when a level grants nothing |
| app.js:7112 | `picks` | — | the count tile's unit |
| app.js:7113 | `Picks at this level` | — | count tile tip title |
| app.js:7114 | `${tot} slots open here, ${got} taken.` | — | count tile tip body |
| app.js:7115 | ` One is the retrained pick.` / ` ${n} are the retrained pick.` | — | count tile tip body |
| app.js:7116 | ` The schedule wants ${want} — this level is over or under by ${n}.` | em dash | count tile tip body |
| app.js:7120 | `spell` | — | casting tile unit |
| app.js:7121 | `Max spell level — raised here` | em dash | casting tile tip title |
| app.js:7122 | `The highest level this class can cast, set by its OWN level.` | — | casting tile tip body |
| app.js:7125 | `pact` | — | pact tile unit |
| app.js:7126 | `Pact Magic slots — changed here` | em dash | pact tile tip title |
| app.js:7127 | `${n} slots, all level ${lvl}, back on a short rest. ` | — | pact tile tip body |
| app.js:7128 | `Pact Magic is its own clock beside regular spell slots.` | — | pact tile tip body |
| app.js:7132 | `Top slot level agrees with it here. They are two different clocks — the row notes them separately when multiclassing pulls them apart.` | em dash | casting tile tip body |
| app.js:7136 | `The highest level this class can prepare, set by its OWN level. Multiclassing never raises it.` | — | casting tile tip body |
| app.js:7137 | `slot` | — | slot tile unit |
| app.js:7138 | `Top slot level — raised here` | em dash | slot tile tip title |
| app.js:7139 | `The highest slot you have, from your COMBINED caster level. Higher slots let you upcast; they don't widen the list.` | — | slot tile tip body |
| app.js:7154 | `+ cantrip` / `+ spell` | — | ghost chip for an open slot |
| app.js:7157 | `Replacement not chosen` | — | ghost chip tip title |
| app.js:7158 | `The trade armed at L${i} is waiting for a ${gk}. Take one for this class and it is recorded.` | — | ghost chip tip body |
| app.js:7159 | `An open ${gk} slot` | — | ghost chip tip title |
| app.js:7160 | `The schedule opens this pick at L${i} and nothing fills it yet. Open the build here to fill it.` | — | ghost chip tip body |
| app.js:7169 | `Learned at L${i} in place of ${outName}. The pill on this row is the trade itself.` | — | swapped-in chip tip |
| app.js:7190 | `Retrained at L${atLv}` | — | chip level tip title |
| app.js:7191 | `Click to move the trade to another level-up of this class.` | — | chip level tip body |
| app.js:7195 | `Move the trade to` | — | inline retrain row label |
| app.js:7201 | `No other level-up of this class is free.` | — | inline retrain row, nothing to offer |
| app.js:7203 | `Armed at L${atLv}` | — | chip level tip title |
| app.js:7204 | `The trade records once you take the replacement.` | — | chip level tip body |
| app.js:7211 | `Armed — traded at L${n} for the next ${kn} you take. Click to cancel.` | em dash | pick chip tip body |
| app.js:7212 | `Traded for ${forName} at L${at}. Click that level to move the trade; the pill's × clears it.` | — | pick chip tip body |
| app.js:7214 | `L${view} already carries a ${kn} trade — clear its pill first.` | em dash | pick chip tip body |
| app.js:7215 | `Learned at L${pk.lv}. A trade happens at a later level-up — jump to one first.` | em dash | pick chip tip body |
| app.js:7216 | `L${view} isn't a level-up of this class — jump to one of its levels to trade there.` | em dash | pick chip tip body |
| app.js:7217 | `Click to trade this away at L${view}: it stays known below, and the next ${kn} you take for this class replaces it from L${view} on.` | — | pick chip tip body |
| app.js:7225 | ` — trade away here` | em dash | pick chip tip title suffix |
| app.js:6804 | `${cn} replaces a cantrip after a long rest, not on level-up — do it in Prepare daily.` | em dash | refusal reason on a cantrip chip |
| app.js:6805 | `${cn} has no cantrip swap on level-up.` | — | refusal reason |
| app.js:6807 | `A spellbook only grows — copying in is the wizard's move; its prepared list changes on a long rest instead.` | em dash | refusal reason on a spell chip |
| app.js:6808 | `${cn} re-prepares its spells on a long rest, not on level-up — nothing is traded away here.` | em dash | refusal reason |
| app.js:6802 | `This class` | — | fallback class name in those reasons |
| app.js:7242 | `− ${out}` | — | the trade pill, outgoing |
| app.js:7243 | `+ ${in}` | — | the trade pill, incoming |
| app.js:7250 | `Cantrip trade` / `Spell trade` | — | pill tip title |
| app.js:7251 | `Replaced on a long rest, standing here: ` | — | pill tip body |
| app.js:7251 | `Taken at this level: ` | — | pill tip body |
| app.js:7253 | `That class replaces one cantrip per long rest — the level only records where it happened.` | em dash | pill tip body |
| app.js:7254 | `A level-up carries one spell trade and one cantrip trade, where the class's rules grant them.` | — | pill tip body |
| app.js:7255 | ` × clears it.` | — | pill tip tail |
| app.js:6949 | `${class} · L${from}–L${to}` | — | run divider label |
| app.js:7296 | `Fork a variant` | — | timeline footer |
| app.js:7298 | `Jump to a lower level first — the fork branches there` | em dash | title on a disabled Fork |
| app.js:7300 | `Guide from here` | — | timeline footer |
| app.js:7313 | `Levels listed lowest first — flip the order` | em dash | aria-label on the order arrow |
| app.js:7313 | `Levels listed highest first — flip the order` | em dash | aria-label on the order arrow |
| app.js:7316 | `Reading up, from L1` | — | order arrow tip title |
| app.js:7316 | `Reading down, from L${total}` | — | order arrow tip title |
| app.js:7317 | `The column starts at L1 and the levels climb as you read. ` | — | order arrow tip body |
| app.js:7318 | `The column starts at the build's top level. ` | — | order arrow tip body |
| app.js:7319 | `Click to flip the order.` | — | order arrow tip tail |
| app.js:7321 | `from L${n}` | — | note beside the order arrow |
| app.js:7338 | `L${total+1}` | — | the add-level ghost row |
| app.js:7350 | `Take the next ${class} level` | — | tip title on the add button |
| app.js:7351 | `Adds character level ${n} as ${class} ${cl}.` | — | tip body |
| app.js:7356 | `another class…` | ellipsis placeholder | the add-level class select |
| app.js:7362 | `${c.name} · 20` | — | a class already at level 20, disabled |
| app.js:6757 | `Trading ${label} away at L${level}` | — | armed-swap bar heading |
| app.js:6758 | `Take a ${kw} for ${class} and the trade is recorded. Nothing below L${level} changes.` | — | armed-swap bar body |
| app.js:6762 | `Choose replacement…` | ellipsis placeholder | armed-swap bar action |

## Character view (budget, cart, gap and health bars, jump bar)

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:147 | `Prepared budget & picks` | — | card heading |
| index.html:225 | `Jump to section` | — | aria-label on the mobile jump bar |
| app.js:6540 | `Character` / `Choices` / `Slots` | — | jump bar labels |
| app.js:6541 | `Budget` / `Spells` | — | jump bar labels |
| app.js:7407 | `${n} picked` | — | the budget card's count chip |
| app.js:7408 | `No spellcasting class yet. Add one on the left, then pick spells from the list below.` | — | budget card empty state |
| app.js:7413 | `spellbook` / `level-swap` / `daily` | — | the caster-kind chip |
| app.js:7415 | `Wizard spellbook: it grows a fixed amount each level, and every spell added must be no higher than your current top slot (${ROMAN}) — so the count at each level is capped and can't be retrained. The tiles show that free allowance. You then prepare ${n} of them each long rest (the slots table). Separately, you can copy found spells into the book beyond the allowance — those show as "copied".` | em dash | title on the kind chip |
| app.js:7417 | `Level-swap caster: a fixed known list of ${n}, learned as you level up and capped at your top slot each time (plus one swap per level). So the count you can hold at each level is limited — the tiles show it, highest levels capped tightest.` | em dash | title on the kind chip |
| app.js:7418 | `Daily caster: re-prepare any ${n} eligible spells each long rest, any mix of levels up to ${ROMAN}. Cantrips are fixed and not re-prepared daily.` | — | title on the kind chip |
| app.js:653 | `No spell list.` | — | red lead on the budget card |
| app.js:647 | `${who} casts on its own progression, but your books don't name the class list it draws from.` | — | the reason after it |
| app.js:654 | `Only what its own features name can be offered. Re-import your books; if it still reads this, the subclass needs its list added.` | — | the remedy after it |
| app.js:7425 | `Cantrips` | — | meter label |
| app.js:7434 | `Spellbook` | — | meter label |
| app.js:7437 | `Prepared` | — | meter label |
| app.js:7439 | `Fixed growth, no retraining.` | — | note under the wizard meters |
| app.js:7440 | ` +${copied} copied in.` | — | note tail |
| app.js:7441 | ` Use Prepare daily to pick ${n} from the book.` | — | note tail |
| app.js:7444 | `Known` / `Prepared` | — | meter label for other casters |
| app.js:7446 | `Off-list` | — | Magical Secrets meter label |
| app.js:7447 | `Add an off-list spell` | — | button under that meter |
| app.js:7449 | `Magical Secrets: pick from the lists this feature opens up, at any level you can cast.` | — | title on that button |
| app.js:7454 | `Up to ${cap} of your prepared spells may come from other lists, from L${onset} on.` | hedge | note under that meter |
| app.js:7455 | ` ${weighs} of your top-level picks are already spent on the low-level ones you hold.` | — | note tail |
| app.js:7458 | `Magical Secrets` / `Cap` / `From` / `level ${onset}` | — | meter tip rows |
| app.js:7459 | `An off-list spell can only have been taken from L${onset} on, so every one you hold BELOW that has already spent an acquisition event that would otherwise have reached your top spell levels. The per-level tiles above are narrowed to match.` | — | meter tip body |
| app.js:7487 | `${ROMAN}-level in your spellbook / in your known spells / prepared — ${atL} of up to ${ceil} at this level` | em dash | title on a per-level tile |
| app.js:7488 | ` (+${n} copied in beyond the free allowance)` | — | tile title tail |
| app.js:7489 | ` — you are over your spellbook/known/prepared total, so there is no room left at any level until you drop some` | em dash | tile title tail |
| app.js:7492 | ` — no room here while you are over your known/prepared total` | em dash | tile title tail |
| app.js:7493 | ` (fills up gradually as you level)` | — | tile title tail |
| app.js:7493 | `. Tap to edit.` | states the obvious | tile title tail |
| app.js:7495 | ` · max` | — | label on the top-level tile |
| app.js:7497 | `Copy a spell into your book` | — | wizard-only button |
| app.js:7499 | `Wizards can copy spells found in play into the book, beyond the free per-level allowance (any Wizard spell up to your top slot level).` | — | title on that button |
| app.js:7510 | `${book} is turned off in Sources — the pick is kept, not removed. The banner above can turn the book back on.` | em dash | title on a gapped pick chip |
| app.js:7519 | `Always prepared` | — | heading of the granted block |
| app.js:7520 | `Granted — they don't use your prepared slots` | em dash | sub-line of that block |
| app.js:7539 | `${used} / ${cap}` | — | the meter's value |
| app.js:4608 | `${n} picks need ` | — | gap bar lead |
| app.js:4609 | `books you don't have loaded or turned on` | — | gap bar lead tail |
| app.js:4610 | `a book that isn't loaded — re-import it` | em dash | gap bar lead tail |
| app.js:4610 | `a book you have turned off` | — | gap bar lead tail |
| app.js:4614 | `Turn them on` | — | gap bar action |
| app.js:4617 | `Kept, not removed` | — | gap bar tip title |
| app.js:4618 | `${name} (${kind}, ${source})` | — | gap bar tip body, one per pick |
| app.js:4619 | ` · +${n} more` | — | gap bar tip tail |

## Source reconciliation prompt

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:440 | `This build expects other books` | — | modal title |
| index.html:448 | `Keep my books` | — | decline |
| index.html:450 | `Turn them on` | — | accept |
| app.js:4627 | `"${character} · ${version}" holds ${n} picks from ${m} books you have turned off.` | — | modal subtitle |
| app.js:4634 | `${k} picks` | — | count beside each book |
| app.js:4637 | `Nothing is removed either way — keep your books and those picks stay in the build, flagged.` | em dash | modal note |
| app.js:4639 | ` It was also built with ${idle} other books nothing depends on; those are left alone.` | — | modal note tail |

## Guided builder

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:632 | `Guided builder` | — | aria-label on the page |
| index.html:638 | `Switch to the character view` | — | aria-label |
| index.html:638 | `Character view` | — | button label |
| index.html:639 | `Exit the guide` | — | aria-label on the × |
| index.html:645 | `The decision chain` | — | aria-label on the chain column |
| index.html:85 | `Start guided` | — | empty-build card heading |
| index.html:87 | `A level-by-level walk through every decision this build carries — class, species, feats, spells and the choices they open. Nothing is forced: skip anything, jump anywhere, leave whenever.` | em dash, triplet | empty-build card body |
| index.html:88 | `Start guided` | — | empty-build card action |
| index.html:657 | `Choose spells` | — | aria-label on the guide pick modal |
| index.html:659 | `Choose a spell` | — | guide pick modal title in markup |
| index.html:659 | `How this picker works` | — | aria-label on the `?` |
| index.html:659 | `Close` | — | aria-label on the × |
| index.html:664 | `Pick the slot you want to fill, then click one of this build's own spells: it moves to that slot and whatever sat there shifts one later. Nothing is ever removed.` | — | the `?` body, place mode |
| index.html:667 | `Clicking a spell records the trade. The one you replace keeps its place in the acquisition order, so every earlier level still reads the same.` | — | the `?` body, trade mode |
| index.html:672 | `filter by name…` | ellipsis placeholder | guide pick modal search |
| index.html:678 | `Done` | — | guide pick modal footer in markup |
| app.js:1777 | `New build` | — | guide header, unnamed build |
| app.js:1782 | `L${view} / ${total}` | — | guide header level |
| app.js:1782 | `no levels yet` | — | guide header level, empty build |
| app.js:1784 | `${done} / ${need} decided` | — | guide header progress |
| app.js:1789 | `Decision` / `Chain` | — | the phone pane toggle |
| app.js:1766 | `Step ${i} of ${n}` | — | the set-aside bar |
| app.js:1767 | `Nothing open · ${n} steps` | — | the set-aside bar |
| app.js:1767 | `Nothing to decide yet` | — | the set-aside bar |
| app.js:1863 | `Walking down from L${at}. Click to switch the direction` | — | aria-label on the walk arrow |
| app.js:1863 | `Walking up from L${at}. Click to switch the direction` | — | aria-label on the walk arrow |
| app.js:1869 | `Walking down, from L${at}` / `Walking up, from L1` | — | walk arrow tip title |
| app.js:1870 | `Only this build's own picks are offered, and a click places one into the slot you selected. ` | — | walk arrow tip body |
| app.js:1871 | `A pick you take fills the next open slot. ` | — | walk arrow tip body |
| app.js:1872 | `The rail reads the same way, starting level on top. Click to turn the walk around.` | — | walk arrow tip tail |
| app.js:1874 | `from L${at}` | — | note beside the walk arrow |
| app.js:1907 | `A spell here is above what the class could cast when its slot arrived.` | — | chain severity reason |
| app.js:1909 | `Steps were skipped here and are still open.` | — | chain severity reason |
| app.js:1910 | `Steps here are still open.` | — | chain severity reason |
| app.js:1911 | `Everything here is answered.` | — | chain severity reason |
| app.js:1972 | `Level ${lv}` / `Level ${lv}: ${issueCount}` | — | chain row severity tip title |
| app.js:1921 | `${have} of ${need} chosen` | — | chain row value, partly filled |
| app.js:1923 | `skipped, still open` | — | chain row value |
| app.js:1923 | `to decide` | — | chain row value |
| app.js:1961 | `next level` | — | the growth card's own title |
| app.js:2037 | `${have} of ${need} chosen` | — | step header counter |
| app.js:2040 | `${n} of ${m} answered` | — | step header counter |
| app.js:2050 | `nothing open` | — | the no-current-step card label |
| app.js:2051 | `Every decision is answered.` | — | the no-current-step card body |
| app.js:2052 | `No step is current. Click one in the chain to pick the walk up.` | — | the no-current-step card body |
| app.js:2058 | `Go to the first open step` | — | action on that card |
| app.js:2060 | `Exit builder` | — | action on that card |
| app.js:2079 | `L${lv}` | — | the card's context line |
| app.js:2080 | `optional` | — | the card's context line |
| app.js:2084 | `Nothing to answer here. Skip or Next moves the walk along.` | — | card with no sections |
| app.js:2093 | `← Back` | — | walk footer |
| app.js:2112 | `Skip` | — | walk footer |
| app.js:2119 | `Exit builder` | — | walk footer at a terminal state |
| app.js:2122 | `Go to the first open step` / `Exit builder` / `Next →` | — | the primary walk button |
| app.js:2140 | `Next locks ${what}.` | — | note under the footer |
| app.js:2147 | `${n} still open` / `${n} skipped` | — | end-of-walk summary |
| app.js:2149 | `That is the end of the walk, and nothing is open ahead of it. ${left} behind you: the button takes you to the first, or click any step in the chain.` | — | end-of-walk message |
| app.js:2152 | `That is the end of the walk, and every decision this build carries is answered.` | — | end-of-walk message |
| app.js:2153 | `That is the end of the walk. This step is the last one still open, and its answer is on the card above.` | — | end-of-walk message |
| app.js:1348 | `Species` | — | step label |
| app.js:1361 | `Origin feat` | — | step label and sub-line |
| app.js:1370 | `Class` | — | step label |
| app.js:1377 | `${c.name} subclass` | — | step label |
| app.js:1388 | `Cantrips` / `Cantrip` | — | pick section label |
| app.js:1392 | `Spellbook spells` / `Spellbook spell` / `Spells` / `Spell` | — | pick section label |
| app.js:1401 | `Swap a spell` | — | swap section label |
| app.js:1402 | `Swap a cantrip` | — | swap section label |
| app.js:1406 | `− ${out} + ${in}` | — | swap section value |
| app.js:1410 | `Spellcasting` | — | multi-section step label |
| app.js:1420 | `Feat / ASI / Epic Boon` / `Feat / ASI` | Title Case in label | feat step label |
| app.js:1459 | `Choices` | — | fallback step label for an ownerless choice |
| app.js:1466 | `Next level` / `Class` | — | the growth step's label |
| app.js:1479 | `Choose one` | — | relabelled option-group section |
| app.js:2202 | `change the subclass…` / `choose a subclass…` | ellipsis placeholder | the guide's subclass select prompt |
| app.js:2207 | ` ✓` | emoji | marks the subclass already in the build |
| app.js:2269 | `C` / `–` | — | the level tag on an empty slot chip |
| app.js:2270 | `Empty slot` | — | the empty-slot chip |
| app.js:2272 | `An empty slot` | — | empty-slot tip title |
| app.js:2272 | `This level's slot, still open. Fill it here — everything you learned later keeps the level you learned it at.` | em dash | empty-slot tip body |
| app.js:2284 | `Drop ${name}` / `Drop this pick` | — | chip × tip title |
| app.js:2285 | `Takes it back out and leaves the slot standing here, still yours to fill. Nothing else moves.` | — | chip × tip body |
| app.js:2297 | `Place picks here…` | ellipsis placeholder | pick section action, down walk |
| app.js:2298 | `Change…` | ellipsis placeholder | pick section action, answered |
| app.js:2298 | `Choose ${noun}…` | ellipsis placeholder | pick section action |
| app.js:2249 | `cantrips` / `a cantrip` / `spells` / `a spell` | — | the noun in that action |
| app.js:2307 | `A spell here is above what the class could cast when this slot arrived, and the chain marks it. Placing the pick that really was learned here is what clears it.` | — | illegal-slot hint |
| app.js:2314 | `Change the species…` / `Choose a species…` | ellipsis placeholder | species section action |
| app.js:2321 | `Change the feat…` / `Choose a feat…` | ellipsis placeholder | feat section action |
| app.js:2334 | `No subclass for this class is available in the books you have on.` | — | subclass section hint |
| app.js:2339 | `Change it…` / `Choose ${label}…` | ellipsis placeholder | optional-feature section action |
| app.js:2342 | `This slot's progression has no chooser of its own. Its options are on the character view, under Optional features.` | — | optional-feature section hint |
| app.js:2359 | `Continue ${class} → ${n}` | — | class section primary action |
| app.js:2384 | `another class…` / `choose a class` | ellipsis placeholder | class section select prompt |
| app.js:2399 | `—` | em dash | swap section value fallback |
| app.js:2402 | `Undo the trade` | — | tip title and link label |
| app.js:2403 | `Clears this level's ${kind} trade. The replacement stays where it is and nothing is deleted. It is the same thing clearing the pill in the timeline does.` | — | undo tip body |
| app.js:2424 | `No ${kind} was learned before this level, so there is nothing to trade away yet.` | — | swap section hint |
| app.js:2432 | `${class} trades into level 1` / `level 1–${cm} here.` | — | swap section hint |
| app.js:2441 | `Trade ${name} away` | — | swap chip tip title |
| app.js:2442 | `Opens the replacement list for ${class} at L${lv}. Nothing is written until you pick one, and the trade keeps this pick's place in the acquisition order.` | — | swap chip tip body |
| app.js:2459 | `Optional` | — | section counter for an optional section |
| app.js:2458 | `${have} of ${need}` | — | section counter |
| app.js:2485 | `spellbook spells` / `a spellbook spell` | — | the noun for a spellbook section |
| app.js:2621 | `Close` | — | guide pick modal footer, trade mode |
| app.js:2626 | `Choose ${owed} more` | — | guide pick modal footer, owed |
| app.js:2627 | `Done, next section` / `Done, next step` | — | guide pick modal footer, met |
| app.js:2648 | `this class` | — | fallback class name in the trade header |
| app.js:2649 | ` · up to level ${castMax}` | — | trade subtitle tail |
| app.js:2650 | `Replace ${outName}` | — | trade modal title |
| app.js:2652 | `a ${kw} for ${cname} · L${lv}` | — | trade modal subtitle |
| app.js:2661 | `${n} spell` / `${n} spells` | — | modal count |
| app.js:2672 | `Choose ${noun}` | — | modal title fallback |
| app.js:2684 | `A pick taken here fills the still-open L${lv} slot first. That is where it lands.` | — | landing-slot hint |
| app.js:2685 | `Every slot of this kind is filled. Click one you hold to drop it first.` | — | landing-slot hint |
| app.js:2693 | `${n} pick is` / `${n} picks are` + ` above this slot's cap, so they fit a later slot.` | — | place-mode hint |
| app.js:2717 | `slot ${n}` | — | slot chip label |
| app.js:2718 | `empty` | — | slot chip value |
| app.js:2729 | `No eligible spell matches that name.` | — | guide pick empty state |
| app.js:2730 | `${why} There is nothing to offer here.` | — | guide pick empty state |
| app.js:2731 | `This class holds no pick that could sit in these slots.` | — | guide pick empty state |
| app.js:2732 | `Nothing legal is left to take here. Widen your books in Sources, or skip the step.` | — | guide pick empty state |
| app.js:2755 | `Trade it in` | — | take button label, trade mode |
| app.js:2756 | `Already in this slot` / `Place it in the selected slot` | — | take button label, place mode |
| app.js:2757 | `Picked — click to drop it` | em dash, states the obvious | take button label |
| app.js:2758 | `This group is full — drop one of its picks first` | em dash | take button label |
| app.js:2758 | `Take it` | — | take button label |

## Library — status strip, rows, selection bar, Actions, Add files

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:301 | `Library` | — | modal title |
| index.html:301 | `About the library` | — | aria-label on the `?` |
| index.html:301 | `Close` | — | aria-label on the × |
| index.html:304 | `This is every book the planner knows about. The switch on a row says whether the planner uses that book — turning one off costs nothing and deletes nothing. The checkbox selects rows so you can act on several at once; selecting anything raises a bar with Remove in it. Removing is the only thing here that deletes.` | em dash | the `?` body |
| index.html:308 | `Update data pulls the current 5etools release straight from the public repository — no download step. The app checks for a newer release when it opens. If the repository ever moves, its address is editable under Actions → 5etools address….` | em dash, ellipsis placeholder | the `?` body |
| index.html:311 | `Or load a 5etools data export yourself from ＋ Add files: the .zip, the unzipped folder, individual JSON files, or pasted JSON. Everything is parsed and stored in this browser — nothing is uploaded.` | em dash | the `?` body |
| index.html:314 | `Homebrew & Unearthed Arcana work too.` | — | the `?` body |
| index.html:315 | `Download any brew as JSON from the 5etools homebrew repository (D&D Beyond drops live there), or UA from the prerelease repository — around 60 KB each. A cloned repository also scans fine as a folder: it is filed by category (spell/, class/, collection/…), so one brew's content scatters across folders, and the list below is how you find it.` | em dash, ellipsis placeholder | the `?` body |
| index.html:321 | `Not the repository's "Download ZIP" — that is every brew plus artwork, gigabytes no browser tab can open.` | em dash | the `?` body |
| index.html:324 | `This planner ships without spell data. Load a 5etools data export to fill it with spells, classes, subclasses, feats and species. Everything is parsed and stored in your browser — nothing is uploaded.` | em dash | the welcome line |
| index.html:333 | `Pending import` | — | tray heading |
| index.html:333 | `nothing is stored yet` | — | tray sub-line |
| index.html:334 | `About this list` | — | aria-label on the tray `?` |
| index.html:336 | `These are the files you just added and the books they hold. A tick means add this book to my data. A book you already have is re-read rather than duplicated — only identical entries are replaced — and it is listed above the ticks rather than among them, because declining is not what the tick is for: removing a book you have is the list's own selection bar, never this tray.` | em dash, just | the tray `?` body |
| index.html:341 | `Nothing is written until you press Add. Your builds are never touched.` | — | the tray `?` body |
| index.html:344 | `Nothing imported yet — adding these puts the app's built-in books behind them.` | em dash | tray note |
| index.html:353 | `Discard` | — | tray footer |
| index.html:354 | `Add books` | — | tray footer, primary |
| index.html:364 | `Update data` | — | the status strip's fetch button |
| index.html:367 | `GitHub repository` | — | field label for the 5etools address |
| index.html:368 | `5etools-mirror-3/5etools-src` | — | placeholder |
| index.html:370 | `The 5etools mirror moves every year or two — if fetching stops working, put the new owner/repository here. Empty means the default above.` | em dash | note under that field |
| index.html:377 | `search books…` | ellipsis placeholder | the library search |
| index.html:378 | `Actions` | — | the Actions menu button |
| index.html:380 | `Enable all` | — | Actions row |
| index.html:381 | `Disable all` | — | Actions row |
| index.html:383 | `Select all` | — | Actions row |
| index.html:384 | `Select shown` | — | Actions row |
| index.html:386 | `5etools address…` | ellipsis placeholder | Actions row |
| index.html:392 | `Clear` | — | selection bar |
| index.html:395 | `enabled` | — | selection bar switch label |
| index.html:396 | `Remove` | — | selection bar, destructive |
| index.html:406 | `paste 5etools JSON here…` | ellipsis placeholder | paste textarea |
| index.html:409 | `Add pasted JSON` | — | paste action |
| index.html:414 | `Close` | — | library footer |
| index.html:416 | `Add files` | — | library footer, primary |
| index.html:418 | `Upload .zip` | — | Add files popover |
| index.html:419 | `Upload .json files` | — | Add files popover |
| index.html:420 | `Choose a folder…` | ellipsis placeholder | Add files popover |
| index.html:421 | `Paste JSON…` | ellipsis placeholder | Add files popover |
| app.js:5952 | `${n} book` / `${n} books` | — | status strip clause |
| app.js:5954 | `5etools v${latest} is out — you have v${have}` | em dash | status strip clause |
| app.js:5955 | `5etools v${version}` | — | status strip clause |
| app.js:5956 | `imported by hand` | — | status strip clause |
| app.js:5956 | `built-in books only` | — | status strip clause |
| app.js:5957 | `from ${repo}` | — | status strip clause |
| app.js:5961 | `${n} read by an older parser` | — | status strip clause |
| app.js:5962 | `parser v${parser}` | — | status strip clause |
| app.js:5971 | `≈ ${mb} MB in this browser` | — | status strip clause |
| app.js:9291 | `web` / `file` / `built-in` | — | the origin chip on a book row |
| app.js:9299 | `no content` | — | book row kinds line |
| app.js:9296 | `${n} spell` / `spells` / `class` / `classes` | — | book row kinds line |
| app.js:9297 | `subclass` / `subclasses` / `feat` / `feats` | — | book row kinds line |
| app.js:9298 | `species` | — | book row kinds line |
| app.js:9305 | `Select ${name}` | — | aria-label on the row checkbox |
| app.js:9320 | `${name} enabled` | — | aria-label on the row switch |
| app.js:9337 | `No book matches that.` | — | library empty state |
| app.js:9337 | `No books yet — add some below.` | em dash | library empty state |
| app.js:9361 | `${n} selected` | — | selection bar count |
| app.js:9366 | `Disable the selected books` / `Enable the selected books` | — | title on the bar switch |
| app.js:9371 | `Remove` / `Remove ${n}` | — | the bar's Remove label |
| app.js:9399 | `Removed ${n} books. Builds and homebrew are untouched; picks from removed books are kept and flagged.` | — | the removal receipt |
| app.js:9587 | `Choose another folder…` / `Choose a folder…` | ellipsis placeholder | the folder button |

## Import notices and errors

| location | current string | AI tells | note |
|---|---|---|---|
| app.js:5398 | `${n} in folder` | — | tray row count for a scanned-only book |
| app.js:5400 | `${n} spell` / `spells` etc. | — | tray row counts |
| app.js:5404 | `no content` | — | tray row counts |
| app.js:5419 | `Couldn't re-read this book earlier — the linked folder doesn't hold it` | em dash | tray miss note |
| app.js:5420 | `Couldn't re-read these books earlier — the linked folder doesn't hold them` | em dash | tray miss note |
| app.js:5422 | `. Adding its file here fixes that.` / `their files` | — | tray miss note tail |
| app.js:5426 | `${n} books you already have will be re-read with parser v${v} — only identical entries are replaced.` | em dash | tray re-read note |
| app.js:5433 | `No book here that you don't already have.` | — | tray empty state |
| app.js:5435 | `Nothing in these files the planner can use.` | — | tray empty state |
| app.js:5436 | `No book matches that.` | — | tray filter empty state |
| app.js:5450 | `filter books…` | ellipsis placeholder | tray filter placeholder |
| app.js:5456 | `All shown` / `All` | — | tray quick action |
| app.js:5457 | `None shown` / `None` | — | tray quick action |
| app.js:5470 | `${add} of ${n} books new ticked` | — | tray footer status |
| app.js:5471 | `nothing new here` | — | tray footer status |
| app.js:5474 | `Add ${n} books` | — | tray commit label |
| app.js:5475 | `Re-read ${n} books` / `Add books` | — | tray commit label |
| app.js:5089 | `sp` / `cls` / `sub` / `ft` / `spc` / `opt` / `bk` | — | per-file kind abbreviations on a staged chip |
| app.js:5090 | `lookup` / `?` | — | staged chip kind |
| app.js:5100 | `${n} file` / `${n} files` | — | staged tray label |
| app.js:5100 | ` · ${bad} invalid` | — | staged tray label tail |
| app.js:5104 | `invalid` | — | staged chip for an unreadable file |
| app.js:5108 | `Show as one row` / `Show every staged file` | — | title and aria-label on the staged toggle |
| app.js:5126 | ` Unzip it yourself and stage just the .json files you want — imports add to what you already have, so a big collection can go in a few batches.` | em dash, just | oversize-zip advice |
| app.js:5130 | `${name} is ${size} — too large for a browser tab to open. A complete 5etools data export is about 25 MB zipped.` | em dash | oversize-zip error |
| app.js:5134 | `Reading ${name} (${size})…` | ellipsis placeholder | progress line |
| app.js:5137 | `the browser couldn't hold a ${size} file in memory. (It reports this as a permission error; it isn't one.)` | — | zip read error |
| app.js:5142 | `Unpacking ${name} — ${i}/${total}: ${entry}` | em dash | progress line |
| app.js:5143 | `No recognised 5etools files in ${name}.` | — | zip result |
| app.js:5145 | `Couldn't read ${name}: ${message}` | — | zip error |
| app.js:5156 | `${n} spells · ${n} classes · ${n} subclasses · ${n} feats · ${n} species` | — | the import summary |
| app.js:5161 | ` · ⚠ ${n} spells no class can reach` | emoji | import summary warning |
| app.js:5162 | ` — add generated/gendata-spell-source-lookup.json` | em dash | import summary warning tail |
| app.js:5165 | ` · ⚠ ${n} files failed: ${list}` | emoji | import summary warning |
| app.js:5184 | `${host} answered HTTP ${status}` | — | web fetch error |
| app.js:5188 | `couldn't resolve the latest release of ${repo}` | — | web fetch error |
| app.js:5198 | `the repository's file list came back truncated — try again later.` | em dash | web fetch error |
| app.js:5240 | `you're offline. Everything already imported keeps working.` | — | web fetch error |
| app.js:5242 | `Finding the latest 5etools release…` | ellipsis placeholder | web fetch progress |
| app.js:5244 | `Listing the files of v${ver}…` | ellipsis placeholder | web fetch progress |
| app.js:5246 | `no data files found in ${repo} — is the repository address right?` | em dash | web fetch error |
| app.js:5248 | `Fetching v${ver} — ${i}/${n}: ${file}` | em dash | web fetch progress |
| app.js:5249 | `nothing usable came back. Your data is unchanged.` | — | web fetch error |
| app.js:5253 | `Couldn't fetch from 5etools online: ${message}` | — | web fetch error |
| app.js:5273 | `5etools has newer data — v${latest} is out; you have v${have}.` | em dash | boot notice |
| app.js:5274 | `Fetch it now` | — | action on that notice |
| app.js:5561 | `Scanning ${i}/${n} — ${books} books so far…` | em dash, ellipsis placeholder | folder scan progress |
| app.js:5570 | `Importer failed to load.` | — | scan error |
| app.js:5571 | `No .json files in that folder.` | — | scan error |
| app.js:5575 | `Scanned ${label} — ${n} files, ${mb} MB, ${withC} books with content` | em dash | scan result |
| app.js:5577 | ` (${n} more declare nothing this app uses)` | — | scan result tail |
| app.js:5578 | `. Tick what you want below, then Apply.` | — | scan result tail |
| app.js:5580 | `Couldn't scan that folder: ${message}` | — | scan error |
| app.js:5598 | `Those files are no longer reachable — rescan the folder.` | em dash | stage error |
| app.js:5613 | `Reading ${i}/${n} files…` | ellipsis placeholder | stage progress |
| app.js:5628 | `Stage at least one valid file first.` | — | build-import error |
| app.js:5629 | `Importer failed to load.` | — | build-import error |
| app.js:5630 | `Reading…` | ellipsis placeholder | build-import progress |
| app.js:5634 | `No spells, classes, feats or species found in these files.` | — | build-import error |
| app.js:5640 | `Read ${n} files — ${summary}.` | em dash | build-import result |
| app.js:5668 | `That would leave no content at all — keep at least one book.` | em dash | apply guard |
| app.js:5687 | `Storing…` | ellipsis placeholder | apply progress |
| app.js:5707 | `Re-imported ${n} books with parser v${v}.` | — | apply result |
| app.js:5708 | `Added.` + ` ${n} books ·` | — | apply result |
| app.js:5710 | `${n} spells · ${n} classes · ${n} subclasses · ${n} feats · ${n} species.` | — | apply result |
| app.js:5711 | ` It is in the list below.` | — | apply result tail |
| app.js:9562 | `Pasted text isn't valid JSON.` | — | paste error |
| app.js:9592 | `Reading the folder…` | ellipsis placeholder | folder progress |
| app.js:9602 | `Couldn't open that folder: ${message}` | — | folder error |

## Refresh and app-level notices

| location | current string | AI tells | note |
|---|---|---|---|
| app.js:5781 | `Refreshing imported data…` | ellipsis placeholder | refresh stage |
| app.js:5785 | `Nothing imported yet — Refresh re-reads books you already imported. Drop your 5etools files here first.` | em dash | refresh ask, in the modal |
| app.js:5786 | `Nothing imported yet — import your files in the Library.` | em dash | refresh ask, in the notice bar |
| app.js:5795 | `Reading the folder…` | ellipsis placeholder | refresh stage |
| app.js:5797 | `Couldn't read the remembered folder: ${message}` | — | refresh failure |
| app.js:5801 | `That folder wasn't opened — permission is asked once per session. Choose it again above, or drop the .zip and Apply.` | em dash | refresh ask, in the modal |
| app.js:5802 | `Refresh needs your 5etools files — choose the folder above (it will be remembered), or drop the .zip and Apply.` | em dash | refresh ask, in the modal |
| app.js:5803 | `Refresh needs the folder — permission wasn't granted. Choose it in the Library.` | em dash | refresh ask, in the notice bar |
| app.js:5804 | `Refresh needs the folder — choose it in the Library.` | em dash | refresh ask, in the notice bar |
| app.js:5809 | `The scanned folder holds none of your imported books — choose the folder that has them, or drop the files.` | em dash | refresh ask, in the modal |
| app.js:5810 | `Refresh found none of your books in that folder — choose another in the Library.` | em dash | refresh ask, in the notice bar |
| app.js:5812 | `Reading ${n} books…` | ellipsis placeholder | refresh stage |
| app.js:5820 | `Couldn't read those books from the folder.` | — | refresh failure |
| app.js:5820 | ` Your imported data is unchanged.` | — | refresh failure tail |
| app.js:5821 | `Re-reading with the current parser…` | ellipsis placeholder | refresh stage |
| app.js:5825 | `Nothing usable came back from those files. Your imported data is unchanged.` | — | refresh failure |
| app.js:5827 | `Storing…` | ellipsis placeholder | refresh stage |
| app.js:5838 | `Re-imported ${n} books with parser v${v}.` | — | refresh success |
| app.js:5841 | `, +${n} more` | — | the missed-books list tail |
| app.js:5843 | ` ${n} books (${names}) weren't in that folder and kept their stored data.` | — | refresh caveat |
| app.js:5845 | ` Re-add them below — drop the files, or choose the folder that has them.` | em dash | refresh caveat tail |
| app.js:5851 | ` Re-add them in the Library to bring them current.` | — | refresh caveat tail, notice bar |
| app.js:5852 | `Open Library` | Title Case in label | action on that notice |
| app.js:5771 | `${n} book` / `${n} books` | — | the shared book counter |
| app.js:5907 | `Your imported books were` | — | stale-parser notice head |
| app.js:5908 | `${n} of your ${total} imported books (${names}` | — | stale-parser notice head |
| app.js:5909 | `, +${n} more) were` | — | stale-parser notice head |
| app.js:5911 | ` The last refresh couldn't re-read it — the folder doesn't hold it. Re-add the file in the Library.` | em dash | stale-parser notice tail |
| app.js:5911 | ` The last refresh couldn't re-read them — the folder doesn't hold them. Re-add the files in the Library.` | em dash | stale-parser notice tail |
| app.js:5912 | ` Refresh to re-read them — but ${n} books weren't in the folder last time and need re-adding in the Library.` | em dash | stale-parser notice tail |
| app.js:5913 | ` Refresh to re-read them and pick up the fixes since.` | — | stale-parser notice tail |
| app.js:5914 | `${which} read by parser v${made}` / `an older parser` | — | stale-parser notice body |
| app.js:5915 | ` — this is v${app}.` | em dash | stale-parser notice body |
| app.js:5920 | `Refresh now` | — | action on that notice |
| app.js:5921 | `Open Library` | Title Case in label | action on that notice |
| app.js:491 | `Changes aren't saving — browser storage is full or blocked. The app keeps running, but edits are lost on reload. (${message})` | em dash | storage failure notice |
| app.js:191 | `Not enough room to store this. It holds ${n} entries across ${m} books` | — | quota failure |
| app.js:192 | ` — the largest are ${list}` | em dash | quota failure |
| app.js:193 | `. This browser allows ${quota} for the whole site and ${usage} is already used` | — | quota failure |
| app.js:194 | `. Untick some books and apply again.` | — | quota failure tail |
| app.js:203 | `This browser can't store the import: its database is unavailable — a private window blocks it — and the fallback store is full.` | em dash | storage failure |
| app.js:204 | ` This holds ${n} entries across ${m} books` | — | storage failure |
| app.js:205 | `, the largest being ${list}` | — | storage failure |
| app.js:206 | `; the site is allowed ${quota} in total` | — | storage failure |
| app.js:152 | ` MB` / ` KB` | — | byte formatting |
| app.js:5125 | ` GB` / ` MB` | — | file-size formatting |
| app.js:10149 | `Imported data was unreadable, so the app started on its bundled data — your builds are untouched. Use ⋯ → Refresh imported data (or re-import) to restore the library. (${message})` | em dash | boot recovery notice |
| app.js:10057 | `A newer version of the app has downloaded. Reload to use it.` | — | service-worker notice |
| app.js:10058 | `Reload` | — | action on that notice |
| app.js:315 | `Homebrew` | — | the name of the homebrew source |
| extract.js:1163 | `This browser can't unzip files. Upload the .json files individually instead.` | — | zip reader error |
| extract.js:1166 | `That doesn't look like a .zip file.` | — | zip reader error |
| extract.js:1175 | `this is a ZIP64 archive (over 4 GB, or more than 65,535 files). A complete 5etools data export is about 25 MB — if this is a whole-repository download, unzip it and stage just the .json files you want.` | em dash, just | zip reader error |
| extract.js:1178 | `this zip's directory points past the end of the file — it may be truncated or still downloading.` | em dash, hedge | zip reader error |
| extract.js:881 | `${file}: unnamed spell skipped` | — | per-file parse error, shown in the import summary |
| extract.js:893 | `${file}: unnamed class skipped` | — | per-file parse error |
| extract.js:916 | `${file}: ${label} left unresolved — ${why} (D127)` | em dash | per-file parse error |
| extract.js:917 | `${file}: unnamed subclass skipped` | — | per-file parse error |
| extract.js:934 | `${file}: unnamed feat skipped` | — | per-file parse error |
| extract.js:948 | `${file}: unnamed optional feature skipped` | — | per-file parse error |
| extract.js:967 | `${file}: unnamed species skipped` | — | per-file parse error |
| extract.js:1123 | `${class} :: ${sub} casts on its own progression but its data names no class list — spellList=null (D130)` | em dash | per-file parse error |

## Spell table view

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:199 | `Selected spells` | — | card heading |
| index.html:200 | `Prepare daily` | — | aria-label and label on the primary action |
| index.html:202 | `Table options` | — | title and aria-label on the ⋯ |
| index.html:204 | `Group by` | — | menu row label |
| index.html:205 | `Level only` / `Casting ability` / `Source` | — | grouping options |
| index.html:207 | `Columns` | — | menu section heading |
| index.html:207 | `Reset` | — | column reset button |
| app.js:5988 | `Spell` | — | column header |
| app.js:5990 | `Save` | — | column header |
| app.js:5991 | `School` | — | column header |
| app.js:5992 | `Time` | — | column header |
| app.js:5993 | `Range` | — | column header |
| app.js:5994 | `Comp.` | — | column header |
| app.js:5995 | `Duration` | — | column header |
| app.js:5996 | `Conc` | — | column header |
| app.js:5997 | `Casts` | — | column header |
| app.js:5998 | `Ability` | — | column header |
| app.js:5999 | `Source` | — | column header |
| app.js:6000 | `Book` | — | column header |
| app.js:6241 | `Prepared` | — | the marker column's name in the column menu |
| app.js:6165 | `${n} spell` / `${n} spells` | — | the table count chip |
| app.js:6166 | `Nothing selected yet — pick spells in the Build tab (or use Prepare daily); subclass/feat/species grants appear here too.` | em dash | table empty state |
| app.js:6198 | `Preparation status` | — | tip title on the marker column header |
| app.js:6198 | `Hover a marker for what it means.` | states the obvious | tip body |
| app.js:6182 | `Other casting` | — | group header when the ability is unknown |
| app.js:6212 | `DC ${list}` / `atk ${list}` | — | a source's numbers in a group header |
| app.js:6220 | `Cantrips` / `${ROMAN[l]} level` | — | level group header |
| app.js:6322 | `Always prepared` | — | marker tip title |
| app.js:6322 | `A free grant — it doesn't count against your prepared list.` | em dash | marker tip body |
| app.js:6323 | `Prepared` | — | marker tip title |
| app.js:6323 | `Swappable on a long rest — change it in Choices.` | em dash | marker tip body |
| app.js:6324 | `Innate / free cast` | — | marker tip title |
| app.js:6324 | `Cast without preparing it.` | — | marker tip body |
| app.js:6324 | ` Cadence: ${recharge}.` | — | marker tip body tail |
| app.js:6321 | ` It is also always prepared by another source.` | — | marker tip body tail |
| app.js:6325 | `Cantrip` | — | marker tip title |
| app.js:6325 | `Always known — not re-prepared daily.` | em dash | marker tip body |
| app.js:6327 | `In your spellbook, not prepared` | — | marker tip title |
| app.js:6327 | `A wizard knows every spell in its book but casts only the ones prepared after a long rest. Use Prepare daily.` | — | marker tip body |
| app.js:6329 | `Prepared today` | — | marker tip title |
| app.js:6329 | `Chosen from your spellbook this long rest — change it with Prepare daily.` | em dash | marker tip body |
| app.js:6330 | `Known` | — | marker tip title |
| app.js:6330 | `This class learns spells on level-up, not daily — you can swap one whenever you gain a level.` | em dash | marker tip body |
| app.js:6331 | `Prepared today` / `Change it with Prepare daily.` | — | marker tip |
| app.js:6341 | ` R` | — | ritual marker beside a spell name |
| app.js:6346 | `School` | — | abbreviated-cell tip label |
| app.js:6347 | `Casting time` | — | abbreviated-cell tip label |
| app.js:6348 | `Range` | — | abbreviated-cell tip label |
| app.js:6351 | `Duration` | — | abbreviated-cell tip label |
| app.js:6358 | `save DC and attack bonus` / `save DC` / `attack bonus` | — | the `what` in the ability-cell tip |
| app.js:6359 | `The source's own numbers` | — | ability-cell tip title |
| app.js:6360 | `This is cast by ${src} using its own ${what}, not your spellcasting.` | — | ability-cell tip body |
| app.js:6360 | `a source` | — | fallback subject in that tip |
| app.js:6373 | `*` / `Also castable with your spell slots` | — | asterisk on a Casts cell |
| app.js:6374 | ` (also with your spell slots)` | — | the expanded form after a click |
| app.js:6016 | `at will` | — | Casts cell value |
| app.js:6020 | `1/LR` / `1/SR` / `1/dawn` / `chg` | — | Casts cell values |
| app.js:6027 | `1 ever` / `${n} ever` | — | Casts cell values |
| app.js:6029 | `—` | em dash | Casts cell fallback |
| app.js:6032 | `Abj.` / `Conj.` / `Div.` / `Ench.` / `Evoc.` / `Illus.` / `Necro.` / `Trans.` / `Psi.` | — | abbreviated schools |
| app.js:6035 | `Instant.` | — | abbreviated duration |
| app.js:6036 | `Dispel/trig` | — | abbreviated duration |
| app.js:6037 | `Until disp.` | — | abbreviated duration |
| app.js:6039 | `Special` | — | abbreviated duration |
| app.js:6042 | `A` / `BA` / `RA` | — | abbreviated casting times |
| app.js:6049 | `${ability} saving throw` | — | title on a save chip |
| app.js:6050 | `Spell attack roll` / `Atk` | — | title and label of the attack chip |
| app.js:6522 | `Cost` | — | material popover row |
| app.js:6523 | `consumed` | — | material popover chip |
| app.js:6524 | `Material` | — | material popover row |
| app.js:6526 | `Material component` | — | material popover title |
| app.js:6404 | `a material component` | — | fallback material text |
| app.js:18 | `Cantrip` / `1st` / `2nd` / `3rd` … `9th` | — | spell-level names used everywhere |

## Prepare daily modal

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:683 | `Spell preparation` | — | modal title in markup |
| index.html:683 | `Close` | — | aria-label on the × |
| index.html:689 | `filter by name…` | ellipsis placeholder | search placeholder |
| index.html:691 | `Levels` | — | the level filter button |
| index.html:692 | `Filter by level` | — | label inside the level popover |
| index.html:694 | `Show only the spells already prepared` | — | title on the picked toggle |
| index.html:694 | `Picked` | — | the picked toggle |
| index.html:700 | `← Back` | — | footer |
| index.html:702 | `Next →` | — | footer |
| index.html:703 | `Done` | — | footer, primary |
| app.js:4729 | `Granted` | — | the granted tab label |
| app.js:4741 | `Spell preparation` | — | modal title |
| app.js:4744 | `Spells you chose from a grant rather than from a class list. Some sources — the 2024 species lineages among them — let you replace the choice after every long rest.` | em dash | granted tab subtitle |
| app.js:4750 | `Prepared from your spellbook — pick which of the book's spells are live. Change them after every long rest; the book itself only grows on level-up.` | em dash | wizard tab subtitle |
| app.js:4751 | `Prepared from the ${class} list — any mix of levels up to ${ROMAN}. Change them freely after every long rest.` | em dash | daily tab subtitle |
| app.js:4785 | `Cantrip swap` | — | the long-rest swap block heading |
| app.js:4786 | `One per long rest` | — | count beside it |
| app.js:4788 | `Recorded at L${lv} — below that level the cantrip you traded away is still yours.` | em dash | the block's type line |
| app.js:4791 | `No cantrip to trade yet.` | — | swap block empty state |
| app.js:4797 | `cantrip leaving…` | ellipsis placeholder | the outgoing select prompt |
| app.js:4799 | `its replacement…` | ellipsis placeholder | the incoming select prompt |
| app.js:4801 | `Swap` | — | the swap button |
| app.js:4807 | `L${lv} already records a cantrip swap for another class — clear its pill in the timeline, or move the view to another level.` | em dash | swap block note |
| app.js:4808 | `Pick the cantrip leaving and the one arriving — ${class} may replace one after each long rest.` | em dash, hedge | swap block note |
| app.js:4811 | `Pick both sides first.` | — | swap validation |
| app.js:4815 | `L${lv} already records ${out} → ${in}.` | — | swap refusal |
| app.js:4816 | ` Clear that pill in the timeline first, or make this trade from another level.` | — | swap refusal tail |
| app.js:4819 | `That cantrip isn't in the list any more.` | — | swap failure |
| app.js:4855 | `Granted` | — | fallback giver name on a granted group |
| app.js:4857 | `${cur.length}/${c.count}` | — | granted group counter |
| app.js:4858 | `choose a spell` | — | granted group ask fallback |
| app.js:4864 | `Nothing matches here.` | — | granted group empty state |
| app.js:4867 | `Chosen — click to drop it` | em dash, states the obvious | take button label |
| app.js:4867 | `Choose it` | — | take button label |
| app.js:4875 | `${held} / ${want}` + `chosen` | — | the footer counter, granted tab |
| app.js:4877 | `Picked` | — | the picked toggle, granted tab |
| app.js:4879 | `No granted spell choices in this build.` | — | granted tab empty state |
| app.js:4888 | `Levels` | — | the level filter button |
| app.js:4901 | `${have} / ${cap}` + `prepared` | — | the footer counter, class tab |
| app.js:4907 | `Picked` | — | the picked toggle, class tab |
| app.js:4912 | `Prepared — click to unprepare` | em dash, states the obvious | take button label |
| app.js:4912 | `Prepare it` | — | take button label |
| app.js:4916 | `Nothing prepared yet.` | — | class tab empty state |
| app.js:4917 | `Your spellbook is empty — copy spells into it first.` | em dash | class tab empty state |
| app.js:4918 | `No eligible spells at this level yet.` | — | class tab empty state |

## Custom spell editor and homebrew manager

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:283 | `New custom spell` | — | editor title in markup |
| index.html:283 | `Close` | — | aria-label on the × |
| index.html:288 | `← Back` | — | footer |
| index.html:291 | `Next →` | — | footer |
| index.html:292 | `Compile & add` | — | footer, primary |
| index.html:428 | `My homebrew` | — | manager title |
| index.html:428 | `Close` | — | aria-label on the × |
| index.html:431 | `filter by name…` | ellipsis placeholder | manager search |
| index.html:432 | `New spell` | — | manager primary action |
| app.js:4928 | `Identity` / `Mechanics` / `Lists & text` | triplet | the editor's three steps |
| app.js:4939 | `Edit custom spell` / `New custom spell` | — | editor title |
| app.js:4949 | `start from an existing spell…` | ellipsis placeholder | template search placeholder |
| app.js:4959 | `cantrip` / `level ${n}` | — | template hit sub-line |
| app.js:4962 | ` (copy)` | — | suffix on a templated spell name |
| app.js:4984 | `Name` / `Ember Lash` | — | field label and placeholder |
| app.js:4985 | `Level` | — | field label |
| app.js:4927 | `Cantrip` / `1st` … `9th` | — | level select options |
| app.js:4986 | `School` | — | field label |
| app.js:4923 | `Abjuration` … `Transmutation` | — | school select options |
| app.js:4987 | `Duration` | — | field label |
| app.js:4925 | `Instantaneous` / `1 round` / `1 minute` / `10 minutes` / `1 hour` / `8 hours` / `24 hours` / `7 days` / `Until dispelled` / `Special` | — | duration options |
| app.js:4988 | `Casting time` | — | field label |
| app.js:4924 | `Action` / `Bonus action` / `Reaction` / `1 minute` / `10 minutes` / `1 hour` / `8 hours` / `24 hours` | — | casting-time options |
| app.js:4989 | `Range` / `30 ft / Touch / Self` | — | field label and placeholder |
| app.js:4990 | `Ritual` / `Concentration` | — | flag checkboxes |
| app.js:4991 | `Flags` | — | field label |
| app.js:4993 | `V` / `S` / `M` | — | component checkboxes |
| app.js:4994 | `Components` | — | field label |
| app.js:4995 | `Material (if M)` / `a pinch of soot` | — | field label and placeholder |
| app.js:4996 | `Required save` | — | field label |
| app.js:4926 | `— none —` / `Strength` … `Charisma` | em dash | save select options |
| app.js:4997 | `Spell attack roll` | — | checkbox |
| app.js:4998 | `Or attack` | — | field label |
| app.js:4999 | `Damage types` / `fire, cold  (comma-separated)` | — | field label and placeholder |
| app.js:5005 | `On which class lists` | — | field label |
| app.js:5006 | `Description` / `What the spell does…` | ellipsis placeholder | field label and placeholder |
| app.js:5008 | `At higher levels` / `At higher levels…` | ellipsis placeholder | field label and placeholder |
| app.js:5018 | `Homebrew` | — | the book name stamped on a custom spell |
| app.js:5027 | `Untitled spell` | — | preview heading with no name |
| app.js:5030 | `Defence — ` | em dash | preview line label |
| app.js:5034 | `Give the spell a name` | — | compile validation |
| app.js:5035 | `Tag at least one class list` | — | compile validation |
| app.js:5060 | `${n} spell` / `${n} spells` | — | manager subtitle |
| app.js:5061 | ` · ${n} shown` | — | manager subtitle tail |
| app.js:5063 | `No homebrew spells yet — "New spell" writes one.` | em dash | manager empty state |
| app.js:5064 | `Nothing matches that.` | — | manager empty state |
| app.js:5070 | ` · no class list` | — | row sub-line when the spell has none |
| app.js:5074 | `Edit` | — | row action aria-label |
| app.js:5076 | `Edit` / `Opens it in the custom-spell editor.` | — | row action tip |
| app.js:5079 | `Delete` / `Delete this spell` | — | row action aria-label and title |

## Build export and import

| location | current string | AI tells | note |
|---|---|---|---|
| app.js:4090 | `Nothing to export yet — this browser holds no builds.` | em dash | export-all result |
| app.js:4097 | `Exported ${n} builds` | — | export-all result |
| app.js:4098 | ` and ${n} homebrew spells` | — | export-all result |
| app.js:4098 | ` to your downloads.` | — | export-all result tail |
| app.js:4104 | `That backup holds no builds.` | — | backup import error |
| app.js:4106 | `That backup was exported by a newer version of the app.` | — | backup import error |
| app.js:4111 | `None of the builds in that backup could be read.` | — | backup import error |
| app.js:4127 | `That isn't valid JSON.` | — | build import error |
| app.js:4128 | `That isn't a build file.` | — | build import error |
| app.js:4129 | `That file isn't a My Spellbook build.` | — | build import error |
| app.js:4132 | `That file has no build in it.` | — | build import error |
| app.js:4134 | `That build was exported by a newer version of the app.` | — | build import error |
| app.js:9628 | `Added ${n} builds` | — | backup import result |
| app.js:9629 | ` and ${n} homebrew spells` | — | backup import result |
| app.js:9630 | ` · ${n} couldn't be read and were skipped` | — | backup import result tail |
| app.js:9637 | `Added "${char} · ${ver}". It expects ${books}, which isn't loaded here — import that data to see those picks resolve.` | em dash | build import result |
| app.js:9638 | `Added "${char} · ${ver}". It expects ${books}, currently turned off.` | — | build import result |
| app.js:9639 | `Added "${char} · ${ver}".` | — | build import result |
| app.js:9641 | `Could not read that file.` | — | build import failure |
| app.js:9647 | `Paste a build, or drop a file here.` | — | build import validation |
| app.js:9651 | `Could not read that file.` | — | build import failure |

## Print sheet

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:503 | `Print / save as PDF` | — | settings modal title |
| index.html:503 | `Close` | — | aria-label on the × |
| index.html:504 | `The sheet is your spell table, under a line that says whose it is. These settings are remembered.` | — | settings modal subtitle |
| index.html:508 | `Colour` | — | field label |
| index.html:509 | `Light — on white` | em dash | colour option |
| index.html:510 | `Dark — as on screen` | em dash | colour option |
| index.html:511 | `Page` | — | field label |
| index.html:512 | `Portrait` | — | page option |
| index.html:513 | `Landscape — fits every column` | em dash | page option |
| index.html:516 | `Slot & use tracker` | — | print option |
| index.html:516 | `Boxes to tick: every spell slot, Pact Magic, each limited free cast, each item's charges.` | — | print option body |
| index.html:518 | `Spell cards` | — | print option |
| index.html:518 | `Full rules text for every spell on the sheet, as an appendix. The table's spell names link to them.` | — | print option body |
| index.html:520 | `All preparable spells, unticked` | — | print option |
| index.html:520 | `For classes that prepare from their whole list (Cleric, Druid, Paladin) — print everything you could prepare with an empty box, and prepare on paper.` | em dash, triplet | print option body |
| index.html:522 | `A page per spell level` | — | print option |
| index.html:522 | `Start each level group on a fresh page. Easier to flip through, more pages.` | — | print option body |
| index.html:524 | `Ruled notes page` | — | print option |
| index.html:524 | `A blank page at the end to write on.` | — | print option body |
| index.html:526 | `The file's name and its clickable spell links come from your browser's own PDF export. Chrome and Safari honour both; some in-app PDF writers ignore them and save the page under the app's name — open this page in a browser to print if that happens.` | em dash | settings modal foot note |
| index.html:532 | `Print…` | ellipsis placeholder | primary action |
| app.js:10018 | `${n} row on the sheet` / `${n} rows on the sheet` | — | the count note |
| app.js:10019 | `${n} spell card` / `${n} spell cards` | — | the count note |
| app.js:10020 | `a notes page` | — | the count note |
| app.js:10024 | ` Nothing to prepare — no class here prepares from a whole list.` | em dash | the count note tail |
| app.js:9788 | `My Spellbook` | — | fallback PDF document name |
| app.js:9794 | `My Spellbook` | — | fallback name on the printed head line |
| app.js:9798 | `Level ${lv}` | — | printed head line |
| app.js:9812 | `per long rest` / `per short rest` / `per dawn` | — | tracker use units |
| app.js:9820 | `total — never regained` | em dash | tracker use unit |
| app.js:9843 | `Casting` | — | tracker section heading |
| app.js:9845 | `Class` / `Prepared` / `Cantrips` / `Spell attack` / `Save DC` | — | tracker table headers |
| app.js:9866 | `Pact ${ROMAN}` | — | tracker slot column |
| app.js:9868 | `Spell slots` | — | tracker section heading |
| app.js:9879 | `Pact slots return on a short rest.` | — | tracker note |
| app.js:9887 | `charges` / `regains ${recharge}` | — | tracker use note |
| app.js:9893 | `Limited uses` | — | tracker section heading |
| app.js:9895 | `No slots or limited uses at this level.` | — | tracker empty state |
| app.js:9907 | `Always prepared — a free grant that costs you nothing` | em dash | legend row |
| app.js:9908 | `Innate — cast without preparing it` | em dash | legend row |
| app.js:9909 | `In your spellbook, not prepared today` | — | legend row |
| app.js:9911 | `Prepared or known` | — | legend row |
| app.js:9912 | `You could prepare this — tick what you take` | em dash | legend row |
| app.js:9913 | `Ritual — castable without a slot at 10 extra minutes` | em dash | legend row |
| app.js:9913 | `R` | — | the mark on that row |
| app.js:9914 | `In the Conc column: concentration` | — | legend row |
| app.js:9915 | `A spell attack roll` / `Atk` | — | legend row |
| app.js:9916 | `The save your target rolls` / `Dex` | — | legend row |
| app.js:9917 | `V S M` | — | legend mark |
| app.js:9917 | `Components. A struck letter is one your build removes; gold M costs money, red M is consumed.` | — | legend row |
| app.js:9918 | `The source's own numbers, not your spellcasting` / `DC 16` | — | legend row |
| app.js:9919 | `Also castable with your own spell slots` / `*` | — | legend row |
| app.js:9921 | `What the marks mean` | — | legend heading |
| app.js:9943 | `${n} forms — mark the ones you use in the spell's details to print them.` | em dash | card note when nothing is marked |
| app.js:9965 | `Spell details` | — | appendix heading |
| app.js:9970 | `Cantrips` / `${ROMAN[l]} level` | — | appendix level heading |
| app.js:9980 | `Notes` | — | notes page heading |
| app.js:9935 | `Casting time` / `Range` / `Components` / `Duration` | — | spell card grid labels |

## Footer

| location | current string | AI tells | note |
|---|---|---|---|
| index.html:227 | `Includes material from the System Reference Document 5.2, © Wizards of the Coast LLC, licensed under CC BY 4.0. My Spellbook is unofficial fan content, not affiliated with or endorsed by Wizards of the Coast. Any content you import stays in your browser. App icon: "Secret book" by Delapouite (game-icons.net), CC BY 3.0.` | — | the whole footer credit |
| index.html:227 | `CC BY 4.0` | — | link text |
| index.html:227 | `Delapouite` | — | link text |
| index.html:227 | `CC BY 3.0` | — | link text |
| app.js:10102 | `v${window.__VERSION__}` | — | version tag at the head of the footer |

## Empty states

| location | current string | AI tells | note |
|---|---|---|---|
| app.js:7636 | `Add a spellcasting class` | — | spell list empty state, heading |
| app.js:7636 | `Then its spells appear here to browse and pick.` | — | spell list empty state, body |
| app.js:7638 | `Nothing matches` | — | spell list empty state, heading |
| app.js:7638 | `Loosen the filters — or make it yourself.` | em dash | spell list empty state, body |
| app.js:7641 | `Create "${q}" as a custom spell` | — | spell list empty state, action |
| app.js:7641 | `Create a custom spell` | — | spell list empty state, action |
| app.js:3538 | `Nothing picked here yet.` | — | spell picker |
| app.js:3540 | `No eligible spells at this level yet.` | — | spell picker |
| app.js:3540 | `No matching spells for this choice.` | — | spell picker |
| app.js:3636 | `Nothing matches those filters.` | — | entity picker |
| app.js:2729 | `No eligible spell matches that name.` | — | guide pick modal |
| app.js:2731 | `This class holds no pick that could sit in these slots.` | — | guide pick modal |
| app.js:2732 | `Nothing legal is left to take here. Widen your books in Sources, or skip the step.` | — | guide pick modal |
| app.js:3939 | `Nothing matches that filter.` | — | build manager |
| app.js:4391 | `No spells yet — search below to add one.` | em dash | custom source editor |
| app.js:4791 | `No cantrip to trade yet.` | — | prepare daily |
| app.js:4864 | `Nothing matches here.` | — | prepare daily, granted group |
| app.js:4879 | `No granted spell choices in this build.` | — | prepare daily, granted tab |
| app.js:4916 | `Nothing prepared yet.` | — | prepare daily |
| app.js:4917 | `Your spellbook is empty — copy spells into it first.` | em dash | prepare daily |
| app.js:5063 | `No homebrew spells yet — "New spell" writes one.` | em dash | homebrew manager |
| app.js:5064 | `Nothing matches that.` | — | homebrew manager |
| app.js:5433 | `No book here that you don't already have.` | — | import tray |
| app.js:5435 | `Nothing in these files the planner can use.` | — | import tray |
| app.js:5436 | `No book matches that.` | — | import tray filter |
| app.js:6166 | `Nothing selected yet — pick spells in the Build tab (or use Prepare daily); subclass/feat/species grants appear here too.` | em dash | spell table |
| app.js:7095 | `No new features` | — | timeline row |
| app.js:7386 | `No slots — add a spellcasting class.` | em dash | slot row |
| app.js:7408 | `No spellcasting class yet. Add one on the left, then pick spells from the list below.` | — | budget card |
| app.js:8049 | `Nothing matches those filters.` | — | forms chooser |
| app.js:8050 | `This spell carries no stat blocks.` | — | forms chooser |
| app.js:9337 | `No book matches that.` | — | library |
| app.js:9337 | `No books yet — add some below.` | em dash | library |
| app.js:9895 | `No slots or limited uses at this level.` | — | print tracker |
| app.js:2050 | `nothing open` | — | guided builder, no current step |
| app.js:2084 | `Nothing to answer here. Skip or Next moves the walk along.` | — | guided builder card |
| app.js:8482 | `No text for this feature in the imported data.` | — | entity detail modal |
| app.js:8540 | `The books' own text for this isn't in the imported data. What it grants and where it is printed are below.` | — | entity detail modal |

## Confirm/arm labels

| location | current string | AI tells | note |
|---|---|---|---|
| app.js:3870 | `Confirm?` | — | every armed destructive button turns into this |
| app.js:3931 | (build row Delete) | — | armed via `armConfirm`, keeps its trash icon |
| app.js:4026 | (switcher row Delete) | — | armed via `armConfirm` |
| app.js:5080 | (homebrew row Delete) | — | armed via `armConfirm` |
| app.js:8197 | `Delete` | — | armed in the homebrew spell modal |
| app.js:9542 | `Remove` | — | the Library selection bar, armed |
| app.js:9564 | `Discard` | — | the import tray, armed |
| app.js:9696 | `Delete source` | — | the custom-source editor, armed |
| app.js:9717 | `Reset build` | — | the settings menu row, armed |

## Consistency sweep (build health)

| location | current string | AI tells | note |
|---|---|---|---|
| app.js:1233 | `${class} chooses a subclass at class level ${n}, and none is set.` | — | sweep finding |
| app.js:1238 | `${spell} is one cantrip more than ${class} ${level} grants.` | — | sweep finding |
| app.js:1248 | `${spell} is one spell more than ${class} ${level} learns.` | — | sweep finding |
| app.js:1255 | `${spell} is level ${n}, but ${class} ${cl} — which is where it arrives — casts at most level ${m}.` | em dash | sweep finding |
| app.js:1263 | `${feat} is an epic boon, and no feat slot in this build arrives at character level 19 or later.` | — | sweep finding |
| app.js:1265 | `${feat} is an origin feat, and this build has no origin slot left for it.` | — | sweep finding |
| app.js:1266 | `${feat} has no feat slot in this build to be taken with.` | — | sweep finding |
| app.js:1270 | `${opt} is one ${slot} more than this build grants.` | — | sweep finding |
| app.js:1271 | `${opt} has no feature in this build that grants it.` | — | sweep finding |

## Misc

| location | current string | AI tells | note |
|---|---|---|---|
| app.js:76 | `Remove` | — | aria-label on every small × button |
| index.html:36 | `⌄` | — | the caret glyph on the build switcher |
| index.html:416 | `⌄` | — | the caret glyph on Add files |
| index.html:104 | `⌄` | — | the caret glyph on the species button |
| app.js:5107 | `⌄` | — | the caret glyph on the staged-files toggle |
| app.js:7807 | `⌄` | — | the caret glyph on the Access toggle |
| app.js:8118 | `‹` / `›` | — | the stat-block carousel arrows |
| styles.css:2073 | ` · optional` | — | appended after an optional step's label in the guide chain |
| styles.css:1794 | ` · ` | — | separator between two source badges in the print table |
| styles.css:338 | `attr(data-t)` | — | the tab label is echoed from `data-t` to reserve its bold width |

---

## Totals per tell

| tell | count |
|---|---|
| em dash | 166 |
| ellipsis placeholder | 72 |
| states the obvious | 18 |
| Title Case in label | 10 |
| triplet | 7 |
| emoji | 5 |
| just | 4 |
| hedge | 3 |
| simply | 0 |
| seamlessly | 0 |
| Note: throat-clearing | 0 |
| exclamation mark | 0 |

## Totals

| measure | count |
|---|---|
| total strings inventoried | 1370 |
| strings with at least one tell | 263 |
| strings clean | 1107 |

Counted mechanically over every table row in this file. A string that serves two surfaces is
listed under both (the empty states, the confirm labels and the shared tooltips are the main
cross-listings), so the row count is higher than the count of distinct string literals.
