// The engine, tested headlessly (D158(j)). Gate line eight.
//
// `app.js` is one file on purpose (CLAUDE.md) and it wires ~130 DOM handlers at the top
// level, so loading it in node needs two things: a permissive DOM stub (below) and the boot
// guard inside app.js itself (`__SB_HEADLESS__`), which keeps the async boot — IndexedDB,
// localStorage, first paint — from running and from overwriting the state a fixture sets.
// The shim at the foot of app.js exports the engine and the few setters that stand it up.
//
// The bar this exists to hold: these are the rules the app gets WRONG silently. A slot table
// off by one level, an empty slot spliced out of an acquisition order, a per-book stamp lost
// in a digest rebuild — none of them throw, none of them show up in a screenshot, and every
// one of them has actually shipped. Fixture 1 is the pooling correction D158(b) ordered.
"use strict";
const path = require("path");

// ── a DOM that answers everything and remembers nothing ────────────────────
// Not a DOM implementation: just enough shape that top-level wiring (`$("#x").onclick=…`,
// `classList.toggle`, `[...node.childNodes]`) runs without throwing. Anything a fixture
// actually cares about is a pure function that never touches it.
const makeNode = () => {
  const store = {};
  const node = new Proxy(function () {}, {
    apply: () => makeNode(),
    get(_t, k) {
      if (k === "classList") return { add() {}, remove() {}, toggle: () => false, contains: () => false };
      if (k === "style" || k === "dataset") return {};
      if (k === "childNodes" || k === "children" || k === "options") return [];
      if (k === "textContent" || k === "innerHTML" || k === "value" || k === "className") return store[k] || "";
      if (k === "nodeType") return 1;
      if (k === Symbol.iterator) return function* () {};
      if (k === Symbol.toPrimitive || k === "toString") return () => "";
      if (k === "then") return undefined;                       // never look thenable
      if (k in store) return store[k];
      return makeNode();                                        // callable AND indexable
    },
    set(_t, k, v) { store[k] = v; return true; },
  });
  return node;
};
const doc = makeNode();
doc.querySelector = () => makeNode();
doc.querySelectorAll = () => [];
doc.createElement = () => makeNode();
doc.getElementById = () => null;                                 // "not there" is a real answer
doc.addEventListener = () => {};
doc.documentElement = makeNode();
doc.body = makeNode();

globalThis.__SB_HEADLESS__ = true;                               // the boot guard reads this
globalThis.document = doc;
globalThis.window = globalThis;
globalThis.navigator = { onLine: false, storage: null };
globalThis.localStorage = {
  _m: {},
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._m, k) ? this._m[k] : null; },
  setItem(k, v) { this._m[k] = String(v); },
  removeItem(k) { delete this._m[k]; },
};
globalThis.Option = function Option() { return makeNode(); };   // `new Option(text,value)`
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });
globalThis.addEventListener = () => {};                          // app.js binds window listeners bare
globalThis.removeEventListener = () => {};
globalThis.scrollTo = () => {};
globalThis.getComputedStyle = () => ({ getPropertyValue: () => "" });
class NoopObserver { observe() {} disconnect() {} unobserve() {} takeRecords() { return []; } }
globalThis.MutationObserver = NoopObserver;                      // the dialog observer (v1.5.13)
globalThis.IntersectionObserver = NoopObserver;
globalThis.ResizeObserver = NoopObserver;
globalThis.requestAnimationFrame = (f) => setTimeout(f, 0);
globalThis.__VERSION__ = "test";
globalThis.__PARSER__ = "testparser";

// extract.js first: app.js reads window.SB_extract
require(path.join(__dirname, "..", "src", "extract.js"));
const SB = require(path.join(__dirname, "..", "src", "app.js"));

// ── the runner ─────────────────────────────────────────────────────────────
let pass = 0, fail = 0;
const eq = (label, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { pass++; console.log(`ok   ${label}`); }
  else { fail++; console.log(`FAIL ${label}\n       got  ${g}\n       want ${w}`); }
};

// ── the world a casting fixture needs ──────────────────────────────────────
// The real multiclass table and the real pact table, straight out of the digest, so a
// fixture asserts against the printed rows and not against a table written to match the code.
const data = JSON.parse(require("fs").readFileSync(path.join(__dirname, "..", "data", "data.json"), "utf8"));
SB.set.data({ fullMc: data.fullMc, pact: data.pact, sources: {} });

// classes are identified by key; only `caster` and the own slot table matter here
const CLS = {
  "Wizard|XPHB": { name: "Wizard", caster: "full" },
  "Sorcerer|XPHB": { name: "Sorcerer", caster: "full" },
  "Paladin|XPHB": { name: "Paladin", caster: "1/2" },
  "Ranger|XPHB": { name: "Ranger", caster: "1/2" },
  "Artificer|TCE": { name: "Artificer", caster: "artificer" },
  "Warlock|XPHB": { name: "Warlock", caster: "pact" },
  "Fighter|XPHB": { name: "Fighter", caster: null },
};
SB.set.clsBy(CLS);
SB.set.subBy({});

// planSlots reads `state.classes` and a level map keyed by row id
const rows = (...spec) => {
  SB.set.state({ classes: spec.map(([clsKey, level], i) => ({ id: "r" + i, clsKey, level, subKey: null })) });
  return new Map(spec.map(([, level], i) => ["r" + i, level]));
};
const casterLevel = (slots) => {
  if (!slots) return 0;
  const i = data.fullMc.findIndex((row) => JSON.stringify(row) === JSON.stringify(slots));
  return i < 0 ? -1 : i + 1;
};

// ── 1 · pooled slots: a half-caster rounds UP, per class (D158(b)) ─────────
// The bug this fixture exists for: both half-casters went into ONE bucket that was floored
// once, so every odd split lost a caster level. The XPHB multiclass table says "half your
// levels (rounded up) in the Paladin and Ranger classes"; TCE says the same of the Artificer.
{
  eq("1a · Artificer 5 + Wizard 5 pools to caster level 8",
    casterLevel(SB.planSlots(rows(["Artificer|TCE", 5], ["Wizard|XPHB", 5])).slots), 8);
  eq("1b · Paladin 1 + Sorcerer 4 pools to caster level 5",
    casterLevel(SB.planSlots(rows(["Paladin|XPHB", 1], ["Sorcerer|XPHB", 4])).slots), 5);
  eq("1c · two odd half-casters each round up (Paladin 3 + Ranger 3 = 4, not 3)",
    casterLevel(SB.planSlots(rows(["Paladin|XPHB", 3], ["Ranger|XPHB", 3])).slots), 4);
  eq("1d · even levels are unchanged by the fix (Paladin 4 + Wizard 4 = 6)",
    casterLevel(SB.planSlots(rows(["Paladin|XPHB", 4], ["Wizard|XPHB", 4])).slots), 6);
}

// ── 2 · one caster is NOT pooled ───────────────────────────────────────────
// A single class reads its own table (or its own clock), never the multiclass one. Paladin 5
// alone is caster level 3 on its own clock — the same ⌈l/2⌉ the pooled sum now uses per class,
// which is exactly why the two used to be confused.
{
  const one = SB.planSlots(rows(["Paladin|XPHB", 5]));
  eq("2a · Paladin 5 alone sits on its own clock (caster level 3)", casterLevel(one.slots), 3);
  eq("2b · a non-caster contributes nothing at all",
    SB.planSlots(rows(["Fighter|XPHB", 6])).slots, null);
}

// ── 3 · the OWN clock rounds up, and a third-caster starts at 3 (D68) ──────
{
  eq("3a · half-caster own clock rounds up", [1, 2, 3, 4, 5].map((l) => SB.eclOwn("1/2", l)), [1, 1, 2, 2, 3]);
  eq("3b · artificer shares the half-caster clock", [1, 5, 9].map((l) => SB.eclOwn("artificer", l)), [1, 3, 5]);
  eq("3c · third-caster is 0 before level 3, then rounds up",
    [1, 2, 3, 7, 13, 19].map((l) => SB.eclOwn("1/3", l)), [0, 0, 1, 3, 5, 7]);
  eq("3d · a full caster's own clock is its level", SB.eclOwn("full", 11), 11);
}

// ── 4 · top castable level on the own clock (the AT/EK rows) ───────────────
// The printed third-caster progression: 2nd at 7, 3rd at 13, 4th at 19. Flooring the own
// clock read "1st at 7" — one tier low at every odd gain level.
{
  eq("4a · third-caster reaches 2nd/3rd/4th at 7/13/19",
    [7, 13, 19].map((l) => SB.maxLvlAt("1/3", l)), [2, 3, 4]);
  eq("4b · half-caster has 2nd-level spells at class level 5", SB.maxLvlAt("1/2", 5), 2);
  eq("4c · a class's own slot table wins over the derived clock",
    SB.maxLvlAt("1/2", 2, { slots: [[2, 0, 0, 0, 0, 0, 0, 0, 0], [2, 0, 0, 0, 0, 0, 0, 0, 0]] }), 1);
}

// ── 5 · pact slots are a second pool, never merged ─────────────────────────
// D68: a Warlock's slots come off their own table and do not enter the multiclass sum. A
// Warlock 3 / Wizard 3 has BOTH — 2 pact slots at 2nd level, and caster level 3's own row.
{
  const mix = SB.planSlots(rows(["Warlock|XPHB", 3], ["Wizard|XPHB", 3]));
  eq("5a · the pact pool is reported separately", mix.pact, { num: data.pact[2][0], lvl: data.pact[2][1] });
  eq("5b · the warlock's levels stay out of the pooled sum", casterLevel(mix.slots), 3);
}

// ── 6 · version comparison (the update check and the legacy stale test) ────
{
  eq("6a · 1.5.9 is older than 1.5.10 (numeric, not lexical)", SB.verLt("1.5.9", "1.5.10"), true);
  eq("6b · equal versions are not older", SB.verLt("1.5.16", "1.5.16"), false);
  eq("6c · a missing part counts as 0", [SB.verLt("1.5", "1.5.1"), SB.verLt("1.5.0", "1.5")], [true, false]);
  eq("6d · a newer version is not older", SB.verLt("2.0.0", "1.9.9"), false);
}

// ── 7 · an empty slot is content-shaped but is never content (D146) ────────
// A dropped pick leaves a HOLE in the acquisition order so everything below it keeps the
// level it arrived at. Two rules hold it up: a hole is never pruned as a missing book, and a
// TRAILING hole is not a slot.
{
  const H = SB.hole;                                  // "∅|" + a tag, per app.js
  const arr = ["Alert|XPHB", H("cantrip"), "Lucky|XPHB"];
  eq("7a · isHole tells a hole from a key", arr.map(SB.isHole), [false, true, false]);
  eq("7b · a hole is not mistaken for a book-keyed entry",
    SB.baseKey(H("cantrip")).indexOf("|") , 1);
  eq("7c · noHoles drops holes without reordering what is left",
    SB.noHoles(arr), ["Alert|XPHB", "Lucky|XPHB"]);
  eq("7d · trimHoles removes TRAILING holes only — a middle hole is a SLOT (D146)",
    SB.trimHoles(["Alert|XPHB", H("a"), "Lucky|XPHB", H("b"), H("c")]),
    ["Alert|XPHB", H("a"), "Lucky|XPHB"]);
  eq("7e · a repeated feat's nth copy has its own identity, and baseKey undoes it",
    [SB.nextCopy(["Alert|XPHB"], "Alert|XPHB"), SB.baseKey("Alert|XPHB##2"), SB.sameEnt("Alert|XPHB", "Alert|XPHB##3")],
    ["Alert|XPHB##2", "Alert|XPHB", true]);
}

// ── 8 · a digest rebuild must carry every per-book stamp (D138 · D159(b)) ──
// This hole has opened three times. `filterDigest` rebuilds `sources` from the entries it
// keeps, so any per-book field it forgets is silently lost — and a book that loses its
// `parserHash` falls back to comparing VERSIONS, which are equal inside one release, so it
// reads as current when it is stale.
{
  const d = SB.emptyDigest();
  d.spells = [{ name: "A", source: "AAA" }, { name: "B", source: "BBB" }];
  d.sources = {
    AAA: { name: "Book A", group: "brew", parser: "1.4.0", parserHash: "old", parsedAt: "t0", origin: "file" },
    BBB: { name: "Book B", group: "brew", parser: "1.5.0", parserHash: "new", parsedAt: "t1", origin: "web" },
  };
  const out = SB.filterDigest(d, new Set(["AAA"]));
  eq("8a · the unkept book and its entries are gone", [Object.keys(out.sources), out.spells.length], [["AAA"], 1]);
  eq("8b · parser, parserHash, parsedAt and origin all survive the rebuild",
    [out.sources.AAA.parser, out.sources.AAA.parserHash, out.sources.AAA.parsedAt, out.sources.AAA.origin],
    ["1.4.0", "old", "t0", "file"]);
  eq("8c · counts are recomputed, not carried", out.sources.AAA.counts.spells, 1);
}

// ── 9 · merging digests is keyed, and order survives (D86) ─────────────────
{
  const base = SB.emptyDigest(); base.spells = [{ name: "A", source: "X" }, { name: "B", source: "X" }];
  base.sources = { X: { name: "X" } };
  const add = SB.emptyDigest(); add.spells = [{ name: "B", source: "X", fixed: true }, { name: "C", source: "Y" }];
  add.sources = { Y: { name: "Y" } };
  const m = SB.mergeDigests(base, add);
  eq("9a · a re-read entry REPLACES its twin by key, in place",
    m.spells.map((s) => s.name + (s.fixed ? "*" : "")), ["A", "B*", "C"]);
  eq("9b · both source registries are present", Object.keys(m.sources).sort(), ["X", "Y"]);
  eq("9c · digestSize counts entries, not books", SB.digestSize(m), 3);
  // D158(d): this is the shape assembleData now uses for the FIRST import — bundle as base,
  // import on top. Nothing the bundle carries may disappear, and the import must still win
  // on its own records.
  const baked = SB.emptyDigest();
  baked.spells = [{ name: "Fireball", source: "XPHB" }, { name: "Shield", source: "XPHB" }];
  baked.sources = { XPHB: { name: "Player's Handbook (2024)" } };
  const brewOnTop = SB.emptyDigest();
  brewOnTop.spells = [{ name: "Shield", source: "XPHB", reparsed: true }, { name: "Stash Bolt", source: "HB1" }];
  brewOnTop.sources = { XPHB: { name: "Player's Handbook (2024)" }, HB1: { name: "A Brew" } };
  const assembled = SB.mergeDigests(baked, brewOnTop);
  eq("9d · a first import ADDS to the bundle, it does not replace it",
    [assembled.spells.map((s) => s.name), Object.keys(assembled.sources).sort()],
    [["Fireball", "Shield", "Stash Bolt"], ["HB1", "XPHB"]]);
  eq("9e · the imported copy of a bundled record wins",
    assembled.spells.find((s) => s.name === "Shield").reparsed, true);
}

// ── 10 · what gets stashed is decided by the file itself (D159(a)) ─────────
// The core/homebrew line, and the reason the stash needs no hand-authored list: a 5etools
// repo file declares no `_meta.sources` (the repo keeps those in sources.json); a brew always
// declares its own.
{
  const brew = { _meta: { sources: [{ json: "HB1" }, { json: "HB2" }] }, spell: [] };
  const core = { spell: [] };
  eq("10a · a brew declares the codes it brings", window.SB_extract.brewSources(brew), ["HB1", "HB2"]);
  eq("10b · a core 5etools file declares nothing, so it is not stashed",
    window.SB_extract.brewSources(core), []);
  eq("10c · a malformed _meta is not a crash and not a brew",
    [window.SB_extract.brewSources({ _meta: { sources: "nope" } }), window.SB_extract.brewSources(null)], [[], []]);
}

// ── 11 · ability scores slice like picks, and a blank derives nothing (D176) ─
// The rules that would break silently: an ASI counted at a level before its slot; a blank
// base score turned into a number; the ASI's either/or misread (+2/+2 or +1 alone).
{
  const FEATS = {
    "Ability Score Improvement|XPHB": { name: "Ability Score Improvement", source: "XPHB", category: "G",
      ability: [{ abils: ["str", "dex", "con", "int", "wis", "cha"], amount: 2, choose: true, hidden: true },
                { abils: ["str", "dex", "con", "int", "wis", "cha"], amount: 1, choose: true, count: 2, hidden: true }] },
    "Resilient|XPHB": { name: "Resilient", source: "XPHB", category: "G",
      ability: [{ abils: ["str", "dex", "con", "int", "wis", "cha"], amount: 1, choose: true }] },
    "Actor|XPHB": { name: "Actor", source: "XPHB", category: "G",
      ability: [{ abils: ["cha"], amount: 1, choose: false }] },
  };
  SB.set.featBy(FEATS);
  const base = { classes: [{ id: "r0", clsKey: "Wizard|XPHB", level: 8, subKey: null }], levelOrder: ["r0","r0","r0","r0","r0","r0","r0","r0"],
    feats: [], optFeats: [], speciesKey: "", customSources: [], chosen: {}, featSlots: {}, choices: {}, abilities: {}, originBonus: {} };
  SB.set.state({ ...base });
  SB.set.preview({ level: null });
  eq("11a · a blank base is null, never 10", SB.abilityScores([]), { str: null, dex: null, con: null, int: null, wis: null, cha: null });
  SB.set.state({ ...base, abilities: { cha: 15, con: 14 }, originBonus: { cha: 2, con: 1 },
    feats: ["Actor|XPHB"], featSlots: { "Actor|XPHB": "general" } });
  eq("11b · base + origin + a fixed feat bump", SB.abilityScores(["Actor|XPHB"]).cha, 18);
  eq("11c · a score no feat touches keeps its base and bonus", SB.abilityScores(["Actor|XPHB"]).con, 15);
  SB.set.state({ ...base, abilities: { cha: 15, dex: 12 },
    feats: ["Ability Score Improvement|XPHB"], featSlots: { "Ability Score Improvement|XPHB": "general" },
    choices: { "fAbility Score Improvement|XPHB:asi": ["cha"] } });
  eq("11d · the ASI with ONE score picked reads +2", SB.abilityScores(["Ability Score Improvement|XPHB"]).cha, 17);
  SB.set.state({ ...base, abilities: { cha: 15, dex: 12 },
    feats: ["Ability Score Improvement|XPHB"], featSlots: { "Ability Score Improvement|XPHB": "general" },
    choices: { "fAbility Score Improvement|XPHB:asi": ["cha", "dex"] } });
  const two = SB.abilityScores(["Ability Score Improvement|XPHB"]);
  eq("11e · the ASI with TWO scores picked reads +1 each", [two.cha, two.dex], [16, 13]);
  // the slice: a Wizard's first general slot is character level 4, so the ASI is not in
  // effect at 3 and is at 4 — the same `featsAt()` the grants use
  SB.set.preview({ level: 3 });
  eq("11f · at level 3 the level-4 ASI is not yet in effect", SB.abilityScores(SB.featsAt()).cha, 15);
  SB.set.preview({ level: 4 });
  eq("11g · at level 4 it is", SB.abilityScores(SB.featsAt()).cha, 16);
  SB.set.preview({ level: null });
  eq("11h · Resilient's +1 waits for its answer (unanswered raises nothing)",
    SB.abilityScores(["Resilient|XPHB"]).cha, 15);
  const asked = []; SB.featScoreGains("Resilient|XPHB", FEATS["Resilient|XPHB"], asked);
  eq("11i · …and asks for it as a score choice", [asked.length, asked[0].type, asked[0].count], [1, "score", 1]);
  eq("11j · proficiency bonus by character level", [1, 4, 5, 8, 9, 12, 13, 16, 17, 20].map(SB.profBonus), [2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);
  eq("11k · DC and attack from a score and PB (Cha 16, PB +3)", SB.castNums("cha", { cha: 16 }, 3), { dc: 14, atk: 6, mod: 3 });
  eq("11l · a blank casting score makes no numbers", SB.castNums("int", { int: null }, 3), null);
  // D177(b): a named bonus ADDS when signed and SETS when bare, and a set never lowers
  SB.set.state({ ...base, abilities: { int: 15, con: 20 },
    scoreBonus: [{ name: "Manual", ab: "int", add: 1 }, { name: "Curse", ab: "int", add: -2 },
                 { name: "Headband", ab: "con", set: 19 }, { name: "Belt", ab: "str", set: 21 }] });
  const cb = SB.abilityScores([]);
  eq("11m · signed bonuses add (15 +1 −2 = 14)", cb.int, 14);
  eq("11n · a set never lowers a higher score (Con 20 stays 20 under a 19)", cb.con, 20);
  eq("11o · a set stands on a blank base (a Belt of Giant Strength on nothing = 21)", cb.str, 21);
  // D177(c): main = union of primaries; saves = the first class only
  SB.set.clsBy({ ...CLS,
    "Wizard|XPHB": { name: "Wizard", caster: "full", ability: "int", traits: { primary: ["int"], saves: ["int", "wis"] } },
    "Paladin|XPHB": { name: "Paladin", caster: "1/2", ability: "cha", traits: { primary: ["str", "cha"], saves: ["wis", "cha"] } } });
  SB.set.state({ ...base, classes: [{ id: "r0", clsKey: "Wizard|XPHB", level: 4, subKey: null }, { id: "r1", clsKey: "Paladin|XPHB", level: 1, subKey: null }],
    levelOrder: ["r0", "r0", "r0", "r0", "r1"] });
  eq("11p · main abilities are the union of every class's primaries", [...SB.mainAbilities()].sort(), ["cha", "int", "str"]);
  eq("11q · saves come from the FIRST class in the plan", [[...SB.saveProfs().abils], SB.saveProfs().cls], [["int", "wis"], "Wizard"]);
  eq("11r · the fill order is casting stats, then primaries, then Con, then the rest",
    SB.fillOrder(), ["int", "cha", "str", "con", "dex", "wis"]);
  SB.fillScores([15, 14, 13, 12, 10, 8]);
  eq("11s · the standard array lands best-first on that order", SB.abilityScores([]), { str: 13, dex: 10, con: 12, int: 15, wis: 8, cha: 14 });
  SB.set.state({ ...base, abilities: { str: 8, dex: 15, con: 14, int: 15, wis: 8, cha: 8 } });
  eq("11t · point buy costs 25 for 15/15/14 and three 8s", SB.pointsSpent(), 25);
  SB.set.clsBy(CLS);
}

// ── 12 · the origin budget, the roll formula, and Optimize (D178) ──────────
{
  const opts = (a) => SB.originOptions(a).filter((o) => o[2]).map((o) => o[1]);
  const base = { classes: [], levelOrder: [], feats: [], optFeats: [], speciesKey: "", customSources: [], chosen: {}, featSlots: {}, choices: {}, abilities: {}, originBonus: {}, scoreBonus: [] };
  SB.set.state({ ...base, originBonus: {} });
  eq("12a · nothing assigned: every pill offered", opts("str"), ["+2", "+1", "none"]);
  SB.set.state({ ...base, originBonus: { int: 2 } });
  eq("12b · a +2 elsewhere removes +2 here", opts("str"), ["+1", "none"]);
  eq("12c · …but the ability holding it keeps it, to undo", opts("int"), ["+2", "+1", "none"]);
  SB.set.state({ ...base, originBonus: { int: 1, wis: 1 } });
  eq("12d · two +1s elsewhere remove +2", opts("str"), ["+1", "none"]);
  SB.set.state({ ...base, originBonus: { int: 2, wis: 1 } });
  eq("12e · +2 and +1 elsewhere remove +1 too", opts("str"), ["none"]);
  SB.set.state({ ...base, originBonus: { int: 1, wis: 1, cha: 1 } });
  eq("12f · three +1s elsewhere remove +1 too", opts("str"), ["none"]);
  eq("12g · the formula parses the established notation",
    ["4d6dl1", "4d6kh3", "3d6", "2d6+6", "4D6 KH3", "d20"].map((f) => !!SB.parseFormula(f)), [true, true, true, true, true, true]);
  eq("12h · …and rejects what isn't one", ["4d6dl5", "abc", "", "4d", "0d6"].map((f) => !!SB.parseFormula(f)), [false, false, false, false, false]);
  eq("12i · the range follows keep/drop and the modifier",
    [SB.formulaRange("4d6dl1"), SB.formulaRange("2d6+6"), SB.formulaRange("3d6")], [{ min: 3, max: 18 }, { min: 8, max: 18 }, { min: 3, max: 18 }]);
  const rolls = Array.from({ length: 200 }, () => SB.rollFormula("4d6dl1"));
  eq("12j · 200 rolls of 4d6dl1 all land in 3..18", rolls.every((v) => v >= 3 && v <= 18), true);
  SB.set.clsBy({ ...CLS, "Wizard|XPHB": { name: "Wizard", caster: "full", ability: "int", traits: { primary: ["int"], saves: ["int", "wis"] } } });
  SB.set.state({ ...base, classes: [{ id: "r0", clsKey: "Wizard|XPHB", level: 1, subKey: null }], levelOrder: ["r0"],
    abilities: { str: 15, dex: 8, con: 10, int: 12, wis: 13, cha: 14 }, scoreOptimize: true });
  SB.optimizeScores();
  eq("12k · Optimize re-sorts six typed values onto the class order (Wizard: Int, Con, then Dex Wis Cha Str)",
    SB.abilityScores([]), { str: 8, dex: 13, con: 14, int: 15, wis: 12, cha: 10 });
  SB.set.clsBy(CLS);
}

// ── 13 · a take answers the card you are standing on (D184) ────────────────
// The silent failure this exists for: D125 read the ROW's first open slot as the landing for
// every section of that row. Drop one 1st-level spell and a level 5 card re-capped itself at
// 1 — 112 spells became 30, every 2nd- and 3rd-level one gone with nothing saying why — and
// the walk was dragged back to the level that owned the hole, which is what made Skip loop.
// Nothing threw and nothing looked broken; the list was simply short. `secOpenSlot` is the
// one owner of the rule now: `guideLandingSec`, the picker's cap and `toggle`'s write all
// read it, so they cannot drift apart again. Re-point any of them at `firstOpen` and 13d/13e
// go red.
{
  const H = SB.hole;
  const sec = (from, to) => ({ from, to });
  const nine = ["a|X", "b|X", "c|X", "d|X", "e|X", "f|X", "g|X", "h|X", "i|X"];

  eq("13a · a section's own open slot is a hole INSIDE its range",
    SB.secOpenSlot(sec(7, 9), ["a|X", "b|X", "c|X", "d|X", "e|X", "f|X", "g|X", H(""), "i|X"]), 7);
  eq("13b · a position past what the array holds is open too (the levels below were skipped)",
    SB.secOpenSlot(sec(4, 6), ["a|X", "b|X", "c|X", "d|X"]), 4);
  eq("13c · -1 when every slot it owns is filled — an EARLIER hole is not this section's slot",
    SB.secOpenSlot(sec(7, 9), [H(""), "b|X", "c|X", "d|X", "e|X", "f|X", "g|X", "h|X", "i|X"]), -1);
  eq("13d · …and that is exactly where `firstOpen` disagrees, which is the whole bug",
    SB.firstOpen([H(""), "b|X", "c|X", "d|X", "e|X", "f|X", "g|X", "h|X", "i|X"]), 0);

  // the writer: a take carrying a section's range lands IN that range, with an earlier
  // level's empty slot left standing open as that level's own question
  // `toggle` re-renders, and a render wants real content under it — stand the whole digest
  // up for this fixture and put the casting-only world back at the end.
  SB.set.data(data);
  const row = { id: "r0", clsKey: "Sorcerer|XPHB", level: 5, subKey: null };
  const chosen = { r0: { cantrips: [], spells: [H(""), ...nine.slice(1, 7), H(""), "i|X"] } };
  SB.set.preview({ level: null });
  const stand = (chosenMap) => SB.set.state({ ...SB.blankBuildState(), filters: SB.FILTER_DEFAULT(),
    classes: [row], chosen: chosenMap, levelOrder: ["r0"] });
  stand(chosen);
  SB.toggle("r0", "NEW|X", false, null, { from: 7, to: 9 });
  eq("13e · the take fills the SECTION's slot 7, and the level 1 hole stays open",
    chosen.r0.spells, [H(""), "b|X", "c|X", "d|X", "e|X", "f|X", "g|X", "NEW|X", "i|X"]);

  // levels skipped entirely: their slots do not exist yet, and the take must not fall into
  // slot 0 — that is the illegal-slot hazard D125 was raised about, solved at the source
  const skipped = { r0: { cantrips: [], spells: [] } };
  stand(skipped);
  SB.toggle("r0", "L2|X", false, null, { from: 4, to: 6 });
  eq("13f · skipped levels leave EMPTY SLOTS behind and the take lands at the section's first",
    skipped.r0.spells, [H(""), H(""), H(""), H(""), "L2|X"]);
  SB.set.data({ fullMc: data.fullMc, pact: data.pact, sources: {} });
}

// ── 14 · a guide step owns ONE slot, so a full slot CHANGES (D185) ─────────
// His report: *"there is no way to change a selected feat in the guided builder"*. The
// obvious gesture — click the feat you want instead — ran `takeFeat`, which fills a hole or
// appends and never consults the budget, so an origin step read `origin 2/1` while its card
// still named the first feat. Inside the guide the picker now carries `owns`, the entry
// answering THIS step; once the slot budget is full a take drops that one first, and the new
// entry lands in the hole it leaves so it keeps the level the slot arrives at. Two things
// must stay true or the fix trades one silent bug for another: an IN-BUDGET add must not
// re-point ownership (a second metamagic at Sorcerer 2 belongs to the second step), and
// `owns` null — every other surface — must leave the old add-and-flag behaviour alone.
{
  const OPTS = {
    "Careful Spell|XPHB": { name: "Careful Spell", source: "XPHB", types: ["MM"] },
    "Distant Spell|XPHB": { name: "Distant Spell", source: "XPHB", types: ["MM"] },
    "Empowered Spell|XPHB": { name: "Empowered Spell", source: "XPHB", types: ["MM"] },
  };
  SB.set.optBy(OPTS);
  const slot = { name: "Metamagic", types: ["MM"], cap: 2 };
  const stand = (optFeats, owns) => {
    SB.set.state({ ...SB.blankBuildState(), filters: SB.FILTER_DEFAULT(), optFeats });
    SB.set.ent({ kind: "opt", slot, owns });
  };
  const take = (k) => { const swapped = SB.entOwnsSwap(); SB.takeOpt(k); return swapped; };

  stand(["Careful Spell|XPHB"], { key: "Careful Spell|XPHB" });
  eq("14a · under the cap a take is an ADD, not a change", SB.entSlotSpend(), { have: 1, cap: 2 });
  eq("14b · …so nothing is dropped and both are held",
    [take("Distant Spell|XPHB"), SB.get.state().optFeats],
    [false, ["Careful Spell|XPHB", "Distant Spell|XPHB"]]);

  stand(["Careful Spell|XPHB", "Distant Spell|XPHB"], { key: "Careful Spell|XPHB" });
  eq("14c · at the cap the step's OWN entry goes and the sibling's is untouched",
    [take("Empowered Spell|XPHB"), SB.noHoles(SB.get.state().optFeats)],
    [true, ["Distant Spell|XPHB", "Empowered Spell|XPHB"]]);

  // The drop leaves the SLOT (D146) — that is what holds the sibling at its own position and
  // so at its own level. Which INDEX the replacement then lands in is `optHoleFor`'s job and
  // fixture 7's subject; it needs a class to map a hole's tag to a progression, which this
  // fixture deliberately does not stand up.
  stand(["Careful Spell|XPHB", "Distant Spell|XPHB"], { key: "Careful Spell|XPHB" });
  SB.entOwnsSwap();
  eq("14d · the drop leaves the slot standing rather than sliding the sibling up a level",
    [SB.get.state().optFeats.map(SB.isHole), SB.get.state().optFeats[1]],
    [[true, false], "Distant Spell|XPHB"]);

  stand(["Careful Spell|XPHB", "Distant Spell|XPHB"], null);
  eq("14e · with no step asking — every surface outside the guide — nothing is ever dropped",
    [take("Empowered Spell|XPHB"), SB.get.state().optFeats],
    [false, ["Careful Spell|XPHB", "Distant Spell|XPHB", "Empowered Spell|XPHB"]]);
  SB.set.ent(null);
}

console.log(`\n${pass} ok · ${fail} fail`);
process.exit(fail ? 1 : 0);
