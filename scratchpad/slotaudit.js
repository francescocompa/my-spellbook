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

console.log(`\n${pass} ok · ${fail} fail`);
process.exit(fail ? 1 : 0);
