// The node harness both scratch runners boot from: a permissive DOM stub, the headless
// guard, and the module itself. Extracted from `engine.test.js` when `slotaudit.js` needed
// the same world — one copy, because a harness that rolls its own is how the foundry.json
// corruption hid for two sessions (CLAUDE.md).
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
module.exports = SB;
