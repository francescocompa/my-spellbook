// Flat config for the C1 audit (D157(e)), promoted to a gate at D158(k). Correctness-only,
// on purpose: the brief is no-undef, no-unused-vars, no-redeclare, eqeqeq — nothing
// stylistic (no indent/quotes/semicolons/etc rules), because this is a hand-formatted,
// ultra-dense single file and a style pass would drown three real rules in thousands of
// cosmetic diffs.
//
// eqeqeq runs `["error","always",{null:"ignore"}]` (D158(k), amending C1's "smart"). V-C's
// wave-2 verification read all 121 of "always"'s app.js findings (and 18 of extract.js's) by
// hand: every one is `x==null`/`x!=null`, the standard idiom for "null or undefined, either
// is fine here" — never a loose comparison of two other values. `{null:"ignore"}` expresses
// that measured idiom exactly; "smart" would have additionally permitted two forms (literal-
// to-literal, a `typeof` result) this codebase never actually uses, so it is looser than the
// evidence calls for. Either setting scores zero findings today — the codebase's own usage
// is already careful — but this is the tighter one to gate on.
//
// no-unused-vars carries `caughtErrorsIgnorePattern:"^[_e]$"` (D158(k)): ESLint 9 defaults
// `caughtErrors:"all"`, so an unread `catch(e)`/`catch(_)` parameter — ordinary, deliberate
// JS idiom, not a real dead local — accounted for 42 of app.js's 57 raw findings (V-C).
// Ignoring exactly `_`/`e` cuts the noise without hiding a differently-named unused catch
// param, which would still be worth a look.
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
      "no-unused-vars": ["error", { caughtErrorsIgnorePattern: "^[_e]$" }],
      "no-redeclare": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
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
      "no-unused-vars": ["error", { caughtErrorsIgnorePattern: "^[_e]$" }],
      "no-redeclare": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
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
      "no-unused-vars": ["error", { caughtErrorsIgnorePattern: "^[_e]$" }],
      "no-redeclare": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
    },
  },
];
