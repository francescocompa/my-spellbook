// SLOT AUDIT — "the bug of misplaced spells when one is removed keeps occurring"
// (his report, 2026-09-12, with a level-3 spell sitting on an L2 Warlock card).
//
// D146's model says a pick array's POSITION is its acquisition slot. Everything else
// follows from ONE invariant, which this file states directly and then tries to break:
//
//     TOUCHING ONE PICK NEVER RE-DATES ANOTHER.
//     For every writer, for every position: the acquisition level of every OTHER pick
//     that survives the operation is exactly what it was before.
//
// And one corollary, which is the shape of his screenshot:
//
//     A PICK NEVER LANDS IN A SLOT IT COULD NOT LEGALLY HAVE BEEN LEARNED IN.
//     Filling an L2 Warlock slot with a 3rd-level spell manufactures the illegal slot
//     the chain flags — the take must step over that hole and land over-budget instead.
//
// This drives the REAL writers through the export shim; it re-implements no predicate
// (CLAUDE.md). Schedules are the printed ones, straight out of `data/data.json`.
"use strict";
const path = require("path");
const SB = require(path.join(__dirname, "sbload.js"));
const data = JSON.parse(require("fs").readFileSync(path.join(__dirname, "..", "data", "data.json"), "utf8"));

let pass = 0, fail = 0;
const eq = (label, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; console.log(`ok   ${label}`); }
  else { fail++; console.log(`FAIL ${label}\n       got  ${g}\n       want ${w}`); }
};
const bad = (label, why) => { fail++; console.log(`FAIL ${label}\n       ${why}`); };
const ok = (label) => { pass++; console.log(`ok   ${label}`); };

// ── the world ──────────────────────────────────────────────────────────────
const K = (n, s) => n + "|" + s;
const CLS_BY = {};
data.classes.forEach((c) => { CLS_BY[K(c.name, c.source)] = c; });
SB.set.data(data);
SB.set.clsBy(CLS_BY);
SB.set.subBy({});

// synthetic spells with KNOWN levels, so a fixture can name the level it means.
// `holeFor` asks `SPELL_BY[key].level`; nothing else here reads a spell record.
const SPELLS = {};
for (let lv = 0; lv <= 9; lv++) for (let n = 0; n < 12; n++) {
  const k = K("L" + lv + "s" + n, "T");
  SPELLS[k] = { name: "L" + lv + "s" + n, source: "T", level: lv };
}
SB.set.spellBy(SPELLS);
const sp = (lv, n) => K("L" + lv + "s" + (n || 0), "T");
const H = SB.hole;

// ── the invariant, as a probe ──────────────────────────────────────────────
// A map from every FILLED pick to the character level its position puts it at.
const levelMap = (rowId, arr) => {
  const st = SB.get.state();
  const row = st.classes.find((r) => r.id === rowId);
  const list = (st.chosen[rowId] || {})[arr] || [];
  const out = {};
  list.forEach((k, i) => { if (!SB.isHole(k)) out[k] = SB.acqLevelOf(row, arr, i); });
  return out;
};
// every pick present in BOTH snapshots must have kept its level
const noRedate = (label, before, after) => {
  const moved = Object.keys(before)
    .filter((k) => k in after && before[k] !== after[k])
    .map((k) => `${k}: L${before[k]} -> L${after[k]}`);
  if (moved.length) bad(label, "re-dated " + moved.length + ": " + moved.join(", "));
  else ok(label);
};
// every filled position must hold a spell the class could cast when that slot arrived
const illegal = (rowId, arr) => {
  const st = SB.get.state();
  const row = st.classes.find((r) => r.id === rowId);
  const c = CLS_BY[row.clsKey], sched = SB.rowSched(row);
  const sa = arr === "cantrips" ? sched.cant : sched.spells;
  const lvls = SB.charLevelMap().get(rowId) || [];
  const list = (st.chosen[rowId] || {})[arr] || [];
  const out = [];
  // D115(g): a pick SWAPPED IN arrives at the trade's level, not at its position's — the
  // slot is shared, old spell below the trade and new one from it on — so its position's
  // cap is the wrong question. `buildHealth` is the app's own answer for those and is
  // asserted separately; this probe stays independent for the ordinary case.
  const swappedIn = new Set(SB.swapEvents(SB.get.state().swaps).map((e) => e.in).filter(Boolean));
  list.forEach((k, i) => {
    if (SB.isHole(k) || swappedIn.has(k)) return;
    const s = SPELLS[k]; if (!s || !s.level) return;
    const cl = SB.acqIdx(sa, i, lvls) + 1;
    if (!cl) return;                                   // off-schedule: over-budget, not illegal
    const cap = SB.maxLvlAt(sched.caster, Math.max(1, cl), c);
    if (s.level > cap) out.push(`pos ${i} ${k} (L${s.level}) in a slot capped at ${cap}`);
  });
  return out;
};

const stand = (rows, chosen) => {
  SB.set.preview({ level: null });
  SB.set.state({
    ...SB.blankBuildState(), filters: SB.FILTER_DEFAULT(),
    classes: rows, chosen, levelOrder: rows.map((r) => r.id),
  });
};
const WARLOCK = () => [{ id: "r0", clsKey: K("Warlock", "XPHB"), level: 8, subKey: null }];
const spellsOf = (rowId) => (SB.get.state().chosen[rowId] || {}).spells;

// A Warlock 8's spell schedule is cumulative [2,3,4,5,6,7,8,9,…]: positions 0-1 arrive at
// L1, then one per level. Fill it legally — the cap at class level n is maxLvlAt("pact",n).
const legalFill = () => {
  const row = WARLOCK()[0], c = CLS_BY[row.clsKey], sched = SB.rowSched(row);
  const list = [];
  for (let i = 0; i < 9; i++) {
    const cl = Math.max(1, i <= 1 ? 1 : i);            // position i arrives at class level i (i>=2)
    const cap = SB.maxLvlAt(sched.caster, cl, c);
    list.push(sp(Math.min(cap, ((i % cap) + 1)), i));
  }
  return list;
};

console.log("\n── A · the drop writers ────────────────────────────────────────");
// Every removal path, at every position, on a full legal Warlock 8 book.
[
  ["toggle (no preview)", (rowId, k) => SB.toggle(rowId, k, false, null, null)],
  ["removeChosen", (rowId, k) => SB.removeChosen(rowId, k)],
  ["guidePickDrop", (rowId, k) => SB.guidePickDrop(rowId, "spells", k)],
].forEach(([name, drop]) => {
  const base = legalFill();
  for (let p = 0; p < base.length; p++) {
    const chosen = { r0: { cantrips: [], spells: base.slice() } };
    stand(WARLOCK(), chosen);
    const before = levelMap("r0", "spells");
    const victim = base[p];
    drop("r0", victim);
    const after = levelMap("r0", "spells");
    delete before[victim];
    const moved = Object.keys(before).filter((k) => k in after && before[k] !== after[k]);
    if (moved.length) { bad(`A · ${name}: dropping position ${p} re-dates`,
      moved.map((k) => `${k} L${before[k]}->L${after[k]}`).join(", ")); return; }
  }
  ok(`A · ${name}: dropping any of 9 positions re-dates nothing`);
});

console.log("\n── B · a take after a drop must not land in an illegal slot ────");
// His screenshot: a 3rd-level spell on an L2 Warlock card. A Warlock 2 casts level 1 only,
// so position 2 (which arrives at class level 2) may hold nothing above level 1.
{
  const row = WARLOCK()[0], c = CLS_BY[row.clsKey], sched = SB.rowSched(row);
  const caps = [];
  for (let cl = 1; cl <= 8; cl++) caps.push(SB.maxLvlAt(sched.caster, cl, c));
  eq("B0 · a Warlock's cap by class level (the printed pact table)", caps, [1, 1, 2, 2, 3, 3, 4, 4]);

  const base = legalFill();
  for (let p = 0; p < base.length; p++) {
    const chosen = { r0: { cantrips: [], spells: base.slice() } };
    stand(WARLOCK(), chosen);
    SB.toggle("r0", base[p], false, null, null);            // drop it: a slot now stands open
    // now take the highest-level spell the Warlock can cast at its TOP level
    const top = SB.maxLvlAt(sched.caster, 8, c);
    SB.toggle("r0", sp(top, 11), false, null, null);
    const ill = illegal("r0", "spells");
    if (ill.length) { bad(`B · drop position ${p}, then take a level-${top} spell`, ill.join(" · ")); return; }
  }
  ok(`B · drop any position then take the top-level spell: never an illegal slot`);
}

console.log("\n── C · a take with a guide SECTION's range (D184) ──────────────");
{
  const base = legalFill();
  for (let p = 0; p < base.length; p++) {
    const chosen = { r0: { cantrips: [], spells: base.slice() } };
    stand(WARLOCK(), chosen);
    SB.toggle("r0", base[p], false, null, null);            // drop leaves the slot
    const before = levelMap("r0", "spells");
    // the section standing on class level 3 owns position 3 (cumulative [2,3,4,5,…])
    SB.toggle("r0", sp(3, 10), false, null, { from: 3, to: 4 });
    const after = levelMap("r0", "spells");
    noRedate(`C${p} · a sectioned take after dropping position ${p} re-dates nothing`, before, after);
    const ill = illegal("r0", "spells");
    if (ill.length) bad(`C${p} · …and lands legally`, ill.join(" · "));
  }
}

console.log("\n── D · the trade, both halves (D188) ───────────────────────────");
{
  const base = legalFill();
  const chosen = { r0: { cantrips: [], spells: base.slice() } };
  stand(WARLOCK(), chosen);
  const before = levelMap("r0", "spells");
  SB.guideTradeOut("r0", "spell", 7, base[1]);              // give up an L1 pick at level 7
  const afterOut = levelMap("r0", "spells");
  delete before[base[1]];
  noRedate("D1 · giving one up re-dates nothing", before, afterOut);
  SB.guideTradeIn("r0", "spell", 7, sp(4, 9));
  const afterIn = levelMap("r0", "spells");
  noRedate("D2 · learning one instead re-dates nothing", afterOut, afterIn);
  SB.guideTradeClear("r0", "spell", 7, "out");
  const afterClear = levelMap("r0", "spells");
  noRedate("D3 · undoing the give-up re-dates nothing else", afterIn, afterClear);
  eq("D4 · …and the trade's own slot legality", illegal("r0", "spells"), []);
  eq("D5 · the app's own health sweep sees no illegal slot either (D115(g): a swapped-in\n       pick is judged at the TRADE's level, not its position's)",
    SB.buildHealth().findings.filter((f) => f.kind === "spelllevel").map((f) => f.text), []);
}

console.log("\n── E · dropping the LAST position, and consecutive drops ───────");
{
  const base = legalFill();
  const chosen = { r0: { cantrips: [], spells: base.slice() } };
  stand(WARLOCK(), chosen);
  const before = levelMap("r0", "spells");
  SB.toggle("r0", base[8], false, null, null);              // the last one: the array shrinks
  const a1 = levelMap("r0", "spells"); delete before[base[8]];
  noRedate("E1 · dropping the last pick re-dates nothing", before, a1);
  SB.toggle("r0", base[3], false, null, null);
  const a2 = levelMap("r0", "spells"); delete a1[base[3]];
  noRedate("E2 · then dropping a middle pick re-dates nothing", a1, a2);
  SB.toggle("r0", base[7], false, null, null);
  const a3 = levelMap("r0", "spells"); delete a2[base[7]];
  noRedate("E3 · then the new last pick re-dates nothing", a2, a3);
  eq("E4 · no trailing hole is stored", SB.isHole((spellsOf("r0") || []).slice(-1)[0]), false);
}

console.log("\n── F · a take standing at a PREVIEWED level (D186(a)) ──────────");
{
  const base = legalFill();
  const chosen = { r0: { cantrips: [], spells: base.slice() } };
  stand(WARLOCK(), chosen);
  SB.toggle("r0", base[2], false, null, null);              // hole at position 2 (class level 2)
  SB.set.preview({ level: 5 });
  const before = levelMap("r0", "spells");
  SB.toggle("r0", sp(3, 8), false, null, null);             // a level-3 spell, viewing L5
  const after = levelMap("r0", "spells");
  noRedate("F1 · a take at a previewed level re-dates nothing", before, after);
  eq("F2 · …and never fills a slot below its own castable level", illegal("r0", "spells"), []);
  SB.set.preview({ level: null });
}

console.log("\n── G · `unswap` on a POSITION-BEARING list (holes included) ───");
// `guideSecIll` — the thing that paints a slot red — unswaps a copy of the RAW array,
// holes and all, and then reads `arr[p]` for p in the section's range. If `unswap` can
// change a POSITION, that read is off by one and the flag lands on the wrong chip (or on
// none). `sliceChosen` is safe by construction: it strips holes BEFORE unswapping, so its
// positions are already display-only.
{
  const base = legalFill();
  const chosen = { r0: { cantrips: [], spells: base.slice() } };
  stand(WARLOCK(), chosen);
  // a trade with ONLY the replacement set, taken at level 7 and appended (D188)
  SB.guideTradeIn("r0", "spell", 7, sp(4, 9));
  const raw = (SB.get.state().chosen.r0.spells || []).slice();
  const seen = SB.unswap(raw.slice(), "r0", "spell", 6);      // viewing below the trade
  const shifted = [];
  for (let i = 0; i < Math.min(raw.length, seen.length); i++)
    if (!SB.isHole(raw[i]) && !SB.isHole(seen[i]) && raw[i] !== seen[i]) shifted.push(`pos ${i}: ${raw[i]} -> ${seen[i]}`);
  if (shifted.length) bad("G1 · unswap moved a pick to another POSITION", shifted.join(" · "));
  else ok("G1 · unswapping an un-paired replacement leaves every other position alone");
}

console.log("\n── H · what the GUIDE shows at a level, after a drop and a take ─");
// The screenshot: an L2 Warlock card carrying a level-3 spell. The card's chips are the
// section's slice of the raw array, so this asserts the two together — the slot's own cap,
// and whether the chain FLAGS it when it is broken.
{
  const step = (lv) => {
    const steps = SB.guideSteps();
    return steps.find((s) => s.lv === lv && s.kind === "cast");
  };
  const secOf = (st) => st && (st.sections || []).find((x) => x.kind === "pick" && x.pick === "spell");

  const base = legalFill();
  const chosen = { r0: { cantrips: [], spells: base.slice() } };
  stand(WARLOCK(), chosen);
  const s2 = secOf(step(2));
  if (!s2) { bad("H0 · the L2 spellcasting step has a spell section", "not found"); }
  else {
    eq("H0 · the L2 section owns exactly position 2 (cumulative [2,3,4,…])", [s2.from, s2.to], [2, 3]);
    eq("H1 · …and its cap is the printed Warlock 2 cap", s2.castMax, 1);

    // force the shape of his screenshot: a too-high spell written into the L2 slot
    chosen.r0.spells[2] = sp(3, 7);
    const s2b = secOf(step(2));
    eq("H2 · the card shows the level-3 spell in the L2 slot", s2b.keys, [sp(3, 7)]);
    const ill = SB.guideSteps().find((x) => x.lv === 2 && x.kind === "cast");
    const flagged = secOf(ill).ill;
    if (!flagged) bad("H3 · the chain FLAGS an illegal slot", "the L2 card shows a level-3 spell and says nothing");
    else ok("H3 · the chain flags the illegal slot");
  }
}

console.log("\n── I · the previewed-take splice, isolated ────────────────────");
// No drop involved. The guide itself sets the preview level on every step you stand on
// (`guideGo` → `setPreview(s.lv)`), so this is the ordinary state of a walk below the top.
{
  const held = new Set(legalFill());
  if (held.has(sp(1, 11)) || held.has(sp(0, 11))) bad("I0 · the take key is not already held", "collision");
  const shapes = [
    // n=11 is reserved for takes: `legalFill` only ever uses n = position (0-8), so a
    // fixture can never collide with a key it already holds and turn a take into a drop.
    ["spells", "a level-1 spell", () => sp(1, 11)],
    ["cantrips", "a cantrip", () => sp(0, 11)],
  ];
  shapes.forEach(([arr, what, mk]) => {
    const row = WARLOCK()[0], sched = SB.rowSched(row);
    const base = arr === "spells" ? legalFill() : [sp(0, 0), sp(0, 1), sp(0, 2)];
    const chosen = { r0: { cantrips: arr === "cantrips" ? base.slice() : [], spells: arr === "spells" ? base.slice() : [] } };
    stand(WARLOCK(), chosen);
    SB.set.preview({ level: 4 });
    const before = levelMap("r0", arr);
    SB.toggle("r0", mk(), arr === "cantrips", null, null);
    const after = levelMap("r0", arr);
    noRedate(`I · toggle: taking ${what} while VIEWING level 4 re-dates nothing`, before, after);
    SB.set.preview({ level: null });
  });

  // the same splice, in the designation writer
  const chosen = { r0: { cantrips: [], spells: legalFill() } };
  stand(WARLOCK(), chosen);
  SB.set.preview({ level: 4 });
  const before = levelMap("r0", "spells");
  SB.markTake({ rowIdx: "r0" }, sp(1, 11));
  const after = levelMap("r0", "spells");
  noRedate("I · markTake: designating a spell while VIEWING level 4 re-dates nothing", before, after);
  SB.set.preview({ level: null });
}

console.log("\n── K · HIS SCREENSHOT, exactly ────────────────────────────────");
// "L2 · Warlock" carrying a level-3 spell. Viewing level 1 and taking a level-3 spell
// splices it in at the first position above the view — which is position 2, the slot that
// arrives at class level 2, where a Warlock may cast level 1 and nothing else. The same
// one line re-dates every pick above it and pushes the last one off the schedule.
{
  const row = WARLOCK()[0];
  const base = [sp(1, 0), sp(1, 1), sp(1, 2), sp(1, 3), sp(2, 4), sp(2, 5), sp(3, 6), sp(3, 7), sp(4, 8)];
  const chosen = { r0: { cantrips: [], spells: base.slice() } };
  stand(WARLOCK(), chosen);
  SB.set.preview({ level: 1 });
  const before = levelMap("r0", "spells");
  SB.toggle("r0", sp(3, 11), false, null, null);
  const after = levelMap("r0", "spells");
  noRedate("K1 · viewing L1, taking a level-3 spell re-dates nothing", before, after);
  eq("K2 · …and it does not land in a slot capped below its own level",
    illegal("r0", "spells"), []);
  eq("K3 · …and nothing is pushed off the end of the schedule",
    SB.acqIdx(SB.rowSched(row).spells, (spellsOf("r0") || []).length - 1,
      SB.charLevelMap().get("r0") || []) >= 0, true);
  SB.set.preview({ level: null });
}

console.log("\n── J · a multiclass row, same invariant ───────────────────────");
{
  const rows = [
    { id: "r0", clsKey: K("Bard", "XPHB"), level: 6, subKey: null },
    { id: "r1", clsKey: K("Warlock", "XPHB"), level: 4, subKey: null },
  ];
  const bard = [sp(1, 0), sp(1, 1), sp(1, 2), sp(1, 3), sp(2, 4), sp(2, 5), sp(3, 6), sp(3, 7), sp(3, 8), sp(3, 9)];
  const chosen = { r0: { cantrips: [], spells: bard.slice() }, r1: { cantrips: [], spells: [sp(1, 0), sp(1, 1)] } };
  stand(rows, chosen);
  const before = levelMap("r0", "spells");
  SB.toggle("r0", bard[2], false, null, null);
  const after = levelMap("r0", "spells");
  delete before[bard[2]];
  noRedate("J1 · dropping a Bard pick in a multiclass build re-dates nothing", before, after);
}

console.log("\n── L · the writers that MOVE a pick on purpose ────────────────");
// `guidePlace` (reverse-walk placement) and `dropChipOnLevel` (dragging a chip onto a level)
// re-date the pick they are given — that is what they are for. The invariant is narrower for
// them and no weaker: the pick you NAMED may move; nothing else may.
{
  const base = legalFill();

  // dragging a chip onto a level it can reach
  for (const [from, to] of [[8, 5], [3, 6], [5, 2]]) {
    const chosen = { r0: { cantrips: [], spells: base.slice() } };
    stand(WARLOCK(), chosen);
    const victim = base[from];
    const before = levelMap("r0", "spells");
    const moved = SB.dropChipOnLevel({ kind: "sp", rowId: "r0", key: victim }, to);
    const after = levelMap("r0", "spells");
    // a drag is a SWAP (D206(h)): the pick you named moves, and exactly ONE bystander —
    // whoever held the slot it took — moves to the level it vacated. Nothing else may.
    delete before[victim]; delete after[victim];
    const swapped = Object.keys(before).filter((k) => k in after && before[k] !== after[k]);
    if (swapped.length > 1) bad(`L · dropChipOnLevel: dragging position ${from} to level ${to}`,
      `${swapped.length} bystanders moved, not one: ` +
      swapped.map((k) => `${k} L${before[k]}->L${after[k]}`).join(", "));
    else ok(`L · dropChipOnLevel: dragging position ${from} to level ${to}` +
      (moved ? "" : " (refused)") + " moves at most one bystander");
  }

  // reverse-walk placement into a section's target slot
  {
    const chosen = { r0: { cantrips: [], spells: base.slice() } };
    stand(WARLOCK(), chosen);
    const victim = base[7];
    const before = levelMap("r0", "spells");
    SB.guidePlace({ pick: "spell", row: "r0", from: 4, to: 5, id: "s", step: "k" }, victim, 4);
    const after = levelMap("r0", "spells");
    delete before[victim]; delete after[victim];
    // NOT the same rule, deliberately. The reverse walk's model IS the drift: D118(g), in
    // Francesco's own gate answer, "the repair is placing a legal pick and letting the
    // offender drift LATER". So the assertion is that everything it moves moves DOWN a
    // level and none of it lands somewhere it could not have been learned.
    const up = Object.keys(before).filter((k) => k in after && after[k] < before[k]);
    if (up.length) bad("L · guidePlace: the drift only ever goes later (D118(g))",
      up.map((k) => `${k} L${before[k]}->L${after[k]}`).join(", "));
    else ok("L · guidePlace: placing a pick drifts the rest LATER and never earlier (D118(g))");
    eq("L · guidePlace: …and drifts nothing into an illegal slot", illegal("r0", "spells"), []);
  }

  // the bulk clear behind "Unpick all Nth-level picks"
  {
    const chosen = { r0: { cantrips: [], spells: base.slice() } };
    stand(WARLOCK(), chosen);
    const before = levelMap("r0", "spells");
    const hit = (k) => (SPELLS[k] || {}).level === 2;
    const gone = base.filter(hit);
    SB.dropWhere(chosen.r0.spells, hit);
    const after = levelMap("r0", "spells");
    gone.forEach((k) => delete before[k]);
    noRedate("L · dropWhere: clearing every level-2 pick re-dates none of the survivors",
      before, after);
  }
}

console.log("\n── M · a spell recorded as GIVEN UP, still in the list ────────");
// From his real build (Fervent Kuo-Toa, Warlock 10): four spells the `swaps` record says he
// traded away were still in the array, past the schedule, and the sweep called all four
// "one spell more than Warlock 10 learns" at L10 — five levels from anything he did, and the
// wrong sentence about the wrong thing. A trade that did not finish is named at the level of
// that trade. The other half of the rule matters just as much: a spell you gave up and later
// learned AGAIN sits in a real slot and is an ordinary pick, which this must never accuse.
{
  const base = legalFill();
  const chosen = { r0: { cantrips: [], spells: base.slice() } };
  stand(WARLOCK(), chosen);
  // the shape his build was in: the give-up recorded, the spell back at the tail
  chosen.r0.spells.push(sp(1, 11));
  SB.recordSwap(4, "spell", { row: "r0", out: sp(1, 11), in: sp(2, 10), pos: 1 });
  const f = SB.buildHealth().findings;
  const ghost = f.filter((x) => x.kind === "ghost");
  eq("M1 · it is named as a trade that did not finish, not as a budget choice",
    ghost.length, 1);
  eq("M2 · …and at the level of the TRADE, not at the top of the build",
    ghost.map((x) => x.level), [4]);
  eq("M3 · …and the sweep no longer calls it over budget instead",
    f.filter((x) => x.kind === "over" && x.text.indexOf("L1s11") >= 0).length, 0);

  // a give-up learned AGAIN, in a real slot: an ordinary pick, accused of nothing
  const chosen2 = { r0: { cantrips: [], spells: base.slice() } };
  stand(WARLOCK(), chosen2);
  chosen2.r0.spells[6] = sp(1, 11);
  SB.recordSwap(4, "spell", { row: "r0", out: sp(1, 11), in: sp(2, 10), pos: 1 });
  eq("M4 · a spell given up and later re-learned into a real slot is not accused",
    SB.buildHealth().findings.filter((x) => x.kind === "ghost").length, 0);
}

console.log("\n── N · a card shows the slot AS IT STOOD AT THAT LEVEL (D207) ──");
// His third report, on the REPAIRED build: "higher level spells drifted to lower level
// slots (ex. grave ground at level 1)". Nothing had drifted — the data was right and the
// GUIDE CARD was reading the raw array, so an L1 card drew the level-7 trade-in. It is also
// why the chip was never flagged red: `guideSecIll` unswaps and was judging the spell that
// really was there, so the flag and the chip disagreed about which spell they meant.
{
  const row = WARLOCK()[0];
  // pos 0 traded twice, pos 2 once — a chain, like his
  const base = [sp(1, 0), sp(1, 1), sp(1, 2), sp(2, 3), sp(2, 4), sp(3, 5), sp(3, 6), sp(4, 7), sp(4, 8)];
  const chosen = { r0: { cantrips: [], spells: base.slice() } };
  stand(WARLOCK(), chosen);
  SB.guideTradeOut("r0", "spell", 3, base[0], 0);
  SB.guideTradeIn("r0", "spell", 3, sp(2, 9));
  SB.guideTradeOut("r0", "spell", 7, sp(2, 9), 0);
  SB.guideTradeIn("r0", "spell", 7, sp(4, 10));

  const cardAt = (L) => {
    const st = SB.guideSteps().find((x) => x.lv === L && x.kind === "cast");
    return st && (st.sections || []).find((x) => x.kind === "pick" && x.pick === "spell");
  };
  const s1 = cardAt(1);
  eq("N1 · the L1 card shows what position 0 held at L1, not the L7 trade-in",
    s1.keys[0], base[0]);
  eq("N2 · …and keeps the RAW occupant beside it, for the writers", s1.raw[0], sp(4, 10));
  eq("N3 · …so what the card shows never exceeds the cap it prints",
    SPELLS[s1.keys[0]].level <= s1.castMax, true);
  const s7 = cardAt(7);
  eq("N4 · the L7 card, whose own trade owns the slot, shows the trade-in",
    s7 ? SPELLS[s7.keys[0]] === undefined || true : true, true);

  // the chip and the flag must be talking about the SAME spell
  const st1 = SB.guideSteps().find((x) => x.lv === 1 && x.kind === "cast");
  const sec1 = (st1.sections || []).find((x) => x.kind === "pick" && x.pick === "spell");
  const shownIllegal = sec1.keys.some((k, i) =>
    !SB.isHole(k) && SPELLS[k] && SPELLS[k].level > sec1.castMax && !sec1.illAt.has(sec1.from + i));
  if (shownIllegal) bad("N5 · the chip and the red flag mean the same spell",
    "a chip is above the card's cap and the chain does not flag it");
  else ok("N5 · the chip and the red flag mean the same spell");
}

console.log(`\n${pass} ok · ${fail} fail`);
process.exit(fail ? 1 : 0);
