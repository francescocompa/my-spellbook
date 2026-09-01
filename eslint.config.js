// Flat config for the C1 audit (D157(e)). Correctness-only, on purpose: the brief is
// no-undef, no-unused-vars, no-redeclare, eqeqeq — nothing stylistic (no indent/quotes/
// semicolons/etc rules), because this is a hand-formatted, ultra-dense single file and a
// style pass would drown three real rules in thousands of cosmetic diffs.
//
// eqeqeq runs in "smart" mode, not "always": measured on this codebase, "always" produces
// 121 warnings in app.js and 18 in extract.js, and reading a sample shows the overwhelming
// majority (116/121 in app.js) are `==null`/`!=null` — the standard idiom for "null or
// undefined, either is fine here", not a bug. Switching to "smart" (which also allows
// comparing two literals or a `typeof` result) drops app.js to ZERO eqeqeq findings and
// extract.js to zero as well — the codebase's loose-equality usage is already careful and
// idiomatic throughout; "always" would have been 100% noise on this file.
//
// `src/app.js`, `src/extract.js` and `docs/sw.js` are plain (non-module) <script>s that
// share ONE global scope at runtime (index.html loads data.js → extract.js → app.js in
// that order; sw.js runs standalone as the service worker). Each file below gets
// `sourceType:"script"` (not "module" — there is no import/export anywhere) and its own
// `globals` entry naming exactly what it expects from ITS OWN neighbours in that load
// order — nothing more. Browser globals come from the `globals` npm package (`globals.browser`,
// `globals.serviceworker` for sw.js); it is a devDependency, not part of the app's own
// runtime.
"use strict";
const globals = require("globals");

// Every top-level `const`/`let`/`function` app.js declares is already in scope for ITSELF
// (ESLint's own scope analysis covers same-file declarations) — the only globals worth
// listing here are names DEFINED IN A DIFFERENT FILE that app.js reads bare (not through
// `window.foo`, which is plain property access and needs no global declaration at all).
// That is exactly one name: `SB_extract`, which extract.js attaches to `window` and app.js
// calls bare. `window.__DATA__` / `window.__VERSION__` / `window.__PUBLIC__` (data.js,
// build.py) and `window.__CACHE__`-style sw.js constants are all read through `window.`,
// so they need nothing listed.
const appGlobals = { SB_extract: "readonly" };

// extract.js is the in-browser importer AND, via `new Function(src)()` in
// scratchpad/cparity.js, a Node-loaded parity harness target — but the SOURCE ITSELF makes
// no Node-specific assumption (no `require`/`module`/`process`); it only expects the
// ordinary browser globals plus JSZip, loaded by index.html from a CDN script tag ahead of
// it (not committed to this repo, hence not resolvable by npm — it is a real external
// global, not a typo).
const extractGlobals = { JSZip: "readonly" };

module.exports = [
  {
    files: ["src/app.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ...appGlobals },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-redeclare": "error",
      eqeqeq: ["warn", "smart"],
    },
  },
  {
    files: ["src/extract.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ...extractGlobals },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-redeclare": "error",
      eqeqeq: ["warn", "smart"],
    },
  },
  {
    files: ["docs/sw.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: globals.serviceworker,
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-redeclare": "error",
      eqeqeq: ["warn", "smart"],
    },
  },
];
