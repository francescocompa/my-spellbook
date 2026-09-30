# STATE — My Spellbook

> Resume doc. One current-state block, edited in place. Read this first, then the file that
> owns whatever you are about to touch:
>
> | File | Owns |
> |---|---|
> | `CLAUDE.md` | What this project is, its conventions, build/run, the verify gate, versioning |
> | `PLAN.md` | The queue — what is next, what is flagged for Francesco |
> | `DECISIONS.md` | **Read first.** Binding rules (D198, the control scale, is one), Phase N live (D176, D191, D192), D208, and today's D209–D213 |
> | `DECISIONS-SETTLED.md` | The other 157 entries, D7–D207 — a reference, not a read. `grep -n "D184" DECISIONS*.md` finds any id in one step |
> | `GOTCHAS.md` | Traps that have already cost a session |
> | `CHANGELOG.md` | Versions (the 1.6 line live; older rows archived), and the tag maps |
> | `ARCHIVE.md` | Bodies of consumed phases, decisions, changelog rows and closed flags |

## TL;DR (2026-10-01 · 0c74e79 · **v1.6.19, main and every tag pushed**)

- **State.** His six notes of 2026-10-01 all shipped, v1.6.17 → v1.6.19 (**D209–D213**):
  a Savant offers two picks and no pick offers what its siblings hold; a Custom background;
  a feat's +1 fills itself from a per-build focus; one rail selection frame; confirming a
  class steps the walk on; leveled "always known" grants cast with slots, not at will; and the
  SRD-name twins finally drop on Pages — **the in-browser importer never wrote a spell's
  `srd`**, and cparity skipped the field (D213). The docs were `/clean`ed the same session.
- **Next action: the export/import conversion to dndpaste formatting**, on **Fable**
  (`PLAN.md` → "Next up"). It needs the spec from him first — ask before writing code. The
  done-when is a byte-identical round trip; start from engine **fixture 24** (D208).
- **Manual for Francesco:**
  ① **Open Pages once** so the library re-reads itself (D213's fingerprint move); if "Arcanist's
  Magic Aura" still sits beside Nystul's, run **Update data** once.
  ② **Is this batch 1.7.0?** Everything went out as patches; D209–D213 ship two features
  (Custom background, feat auto-pick) — his call (D140).
  ③ The three ⚑ from 2026-09-12 in `PLAN.md`: a one-click drop for a spell the build knows it
  traded away · where a genuine over-budget pick is reported · the step counter counting
  optional trades.
  ④ **D203(d)**: where "switch to an older printing" lives, whether it rewrites the stored key,
  and what happens to a pick already made (PLAN ⚑).
  ⑤ **The papery light modes** (D200(f), PLAN ⚑) — how much colour, and where.
  ⑥ The **copy-veto pass** over `audits/copy-table.md` (~305 rows).
  ⑦ **Try Simplified vs Complete** on a real build; is Simplified the right default (D192(b))?
  ⑧ The guide's background step is **second, not first** (D191(f)) — say if it should move.
  ⑨ **Third-casters are pooled then floored** — Fighter 5 (EK) + Rogue 5 (AT) reads 3, the
  table gives 2; a rules call.
  ⑩ Should the class row widen on the **desktop sidebar** (D197's 74.5px per select at 1280)?
  ⑪ **L5.5's format** (copy the build as a level plan).
  ⑫ PWA install check on your phone (L5.6) · print from Chrome or Safari (D108) · XMM on for
  Find Familiar's 2024 forms (D81).
  ⑬ Worth one line to him, from D208: **any build exported and re-imported between v1.5.34 and
  v1.6.15 lost its scores in the copy** — the original is intact wherever it came from.

## Read before touching…

- **…a grant's picks, or anything that treats `need>1` as "several":** **D209** + its GOTCHAS
  entry — 5etools writes "choose two" as two one-spell picks; one owner's picks are one pool
  (`siblingHeld`, read at the FULL build).
- **…a field read off IMPORTED data:** **D213** + its GOTCHAS entry — grep `cparity.js` for a
  skip of that field, and check `src/extract.js` writes it.
- **…`serializeState` / `applyImportedState`:** **D208** — the importer REBUILDS, so a new field
  goes in it and in fixture 24 in the same commit (D210 and D211 each did).
- **…a digest ARRAY:** D191(f) — five independent lists of the same fact; three of five is silent.
- **…anything per-level:** D194 (`featsAt()`/`optFeatsAt()`, never raw `state.feats`) and
  **D207** — a traded slot has two occupants; the tell is a chip above its cap that is NOT red.
- **…a writer that can move a pick between slots:** **D206** — it goes into
  `scratchpad/slotaudit.js` before it ships.
- **…the score block or the origin bonus:** D176–D181, D191(b), D192, D211; the CSS is inside
  `.menupop`, where `.menupop button` restyles every button (GOTCHAS).
- **…a picker's row filter:** D201. **The import tray:** D202. **`collapseEditions` / a
  "missing record":** D203 — check `SHADOWED.has(rec)` first.
- **…the trade's surface:** D204. **Suppressing a control because a picker is open:** D205.
- **…any delegated handler:** D190 — walk UP from `e.target`. **Any control:** **D198**, the
  scale (34 / 28 / 22 / bare). **The header, the class row, an icon-only button:** D196, D197.
- **…`buildGaps`:** D195. **The guide's pick landing:** D184. **`state.choices`:** D189 (three
  shapes). **The level-up trade:** D188. **Picker hosting:** D185. **The extractors:** D91, D183.

⟳ Rename previous session → "Savant picks, SRD twins and guide notes" · session: local_3ff26a49-6757-4db0-96c3-4907963d2b9f

## What this is

Offline single-page D&D 2024 spell planner. Two builds from one source: `dist/index.html`
(self-contained, full data, local only) and `docs/index.html` (SRD 5.2 inlined, more imported
at runtime; the public Pages build). Content = bundle ⊕ imported 5etools (IndexedDB) ⊕ custom
homebrew (localStorage). Non-goals are in `CLAUDE.md` ("What this is not").

## Now

**Phase N** (D176, the creator ladder): N1 and N2 done; **N3** (proficiencies, HP, hit dice,
AC) needs its own decision entry first — /interview him on the rung. The ladder is a MODE
(D192). **L5.5** (copy the build as a level plan) is cheaper and needs only his format call.
`audits/` is outside the cold read on purpose; archive it once L5 has consumed it.
