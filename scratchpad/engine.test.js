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

console.log(`\n${pass} ok · ${fail} fail`);
process.exit(fail ? 1 : 0);
