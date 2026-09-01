// C1 sweep — id cross-check.
// Every `$("#x")` / `document.getElementById("x")` in app.js versus every `id="x"`
// in index.html's static markup AND every `id="x"` app.js renders into a template
// string at runtime. Two directions of drift are worth catching:
//   (A) app.js reaches for an id that exists NOWHERE (a dangling lookup — $() would
//       return null/undefined and the next `.something` on it throws) — MISS
//   (B) an id is defined (static or templated) but app.js never looks it up by id —
//       ORPHAN. Not necessarily a bug (a container may be found by a child selector,
//       or the id may exist purely for CSS/anchor purposes), but worth a human glance.
// Plain node, no deps. Run: node scratchpad/sweeps/ids.js
"use strict";
const fs = require("fs");
const path = require("path");
const { classify, commentsStripped, lineIndex } = require("./_lib.js");

const ROOT = path.join(__dirname, "..", "..");
const APP_PATH = path.join(ROOT, "src", "app.js");
const HTML_PATH = path.join(ROOT, "src", "index.html");

const appSrc = fs.readFileSync(APP_PATH, "utf8");
const htmlSrc = fs.readFileSync(HTML_PATH, "utf8");

const mask = classify(appSrc);
const appVisible = commentsStripped(appSrc, mask); // code + string/template content, comments blanked
const appLine = lineIndex(appSrc);
const htmlLine = lineIndex(htmlSrc);

// ---- ids DEFINED ----
// static index.html markup: id="x" / id='x'
const defHtml = new Map(); // id -> [{line}]
{
  const re = /\bid\s*=\s*(["'])([^"']*)\1/g;
  let m;
  while ((m = re.exec(htmlSrc))) {
    const id = m[2];
    if (!id) continue;
    if (!defHtml.has(id)) defHtml.set(id, []);
    defHtml.get(id).push({ line: htmlLine(m.index) });
  }
}
// app.js-rendered templates: id="x" / id='x' inside string/template content (comments
// already blanked out by commentsStripped, so a stray "id=" in a comment can't match)
const defApp = new Map(); // id -> [{line}]
const defAppDynamic = []; // ids containing ${...} interpolation - can't resolve statically
{
  // `id="x"` in a rendered template is an HTML attribute; `const id="x"+expr` or
  // `el.id="x"+expr` is a JS assignment that only STARTS with the same two chars.
  // The reliable tell: a real attribute's closing quote is followed by more markup
  // (whitespace, another attribute, `>`) — a JS string-concat assignment's closing
  // quote is followed immediately by `+`. Filter those out rather than mis-report
  // three JS locals (`id`, `oid`, a DOM `.id=` prop set) as unreferenced markup ids.
  const re = /\bid\s*=\s*(["'])([^"']*)\1/g;
  let m;
  while ((m = re.exec(appVisible))) {
    const id = m[2];
    if (!id) continue;
    if (appVisible[re.lastIndex] === "+") continue; // JS concat, not a closed attribute
    if (id.includes("${")) { defAppDynamic.push({ id, line: appLine(m.index) }); continue; }
    if (!defApp.has(id)) defApp.set(id, []);
    defApp.get(id).push({ line: appLine(m.index) });
  }
}

// ---- ids REFERENCED from app.js ----
const refApp = new Map(); // id -> [{line, via}]
const refAppDynamic = [];
function addRef(id, line, via) {
  if (id.includes("${")) { refAppDynamic.push({ id, line, via }); return; }
  if (!refApp.has(id)) refApp.set(id, []);
  refApp.get(id).push({ line, via });
}
{
  // $("#id") / $('#id') / $(`#id`) — the app's own $ = document.querySelector
  const re = /\$\(\s*([`"'])#([A-Za-z0-9_-]*(?:\$\{[^}]*\})?[A-Za-z0-9_-]*)\1\s*\)/g;
  let m;
  while ((m = re.exec(appVisible))) addRef(m[2], appLine(m.index), "$(#..)");
}
{
  // document.getElementById("id") / getElementById('id') — literal-argument only;
  // a computed argument (e.g. "row-"+cardId(sp), btn.dataset.help) can't be resolved
  // here and is intentionally NOT matched (it would need real dataflow analysis).
  const re = /\bgetElementById\(\s*(["'`])([^"'`]*)\1\s*\)/g;
  let m;
  while ((m = re.exec(appVisible))) addRef(m[2], appLine(m.index), "getElementById");
}
{
  // querySelector("#id") / querySelectorAll("#id") as a literal id selector (not $())
  const re = /\bquerySelector(?:All)?\(\s*(["'`])#([A-Za-z0-9_-]+)\1\s*\)/g;
  let m;
  while ((m = re.exec(appVisible))) addRef(m[2], appLine(m.index), "querySelector(#..)");
}
{
  // ANY quoted `#id` string literal, wherever it appears — catches ids threaded through
  // a helper by NAME rather than looked up inline, e.g. `toggleMenu("#entMenuPop")`,
  // `closeMenu()` internals, `syncMenuAria(pop, btn)` callers, `aria-controls` values
  // built as strings, etc. Broader than the three call-shaped checks above on purpose:
  // the first pass (matching only literal $()/getElementById/querySelector calls) missed
  // every id that travels through one hop of a wrapper function, which is common here
  // (the menu system takes a selector STRING as its argument, not an element).
  const re = /([`"'])#([A-Za-z][A-Za-z0-9_-]*)\1/g;
  let m;
  while ((m = re.exec(appVisible))) addRef(m[2], appLine(m.index), "string literal");
}

const allDefined = new Set([...defHtml.keys(), ...defApp.keys()]);
const allReferenced = new Set(refApp.keys());

const misses = [...allReferenced].filter(id => !allDefined.has(id)).sort();
const orphansHtml = [...defHtml.keys()].filter(id => !allReferenced.has(id)).sort();
const orphansApp = [...defApp.keys()].filter(id => !allReferenced.has(id)).sort();

function fmtLines(arr, cap = 4) {
  const ls = arr.map(x => x.line);
  const shown = ls.slice(0, cap).join(", ");
  return ls.length > cap ? `${shown} (+${ls.length - cap} more)` : shown;
}

console.log(`=== ids: ${defHtml.size} static ids (index.html), ${defApp.size} templated ids (app.js), ${allReferenced.size} distinct ids looked up by id in app.js ===\n`);

console.log(`--- (A) referenced by app.js but defined NOWHERE (static or templated) [${misses.length}] ---`);
for (const id of misses) {
  const refs = refApp.get(id);
  console.log(`#${id}  referenced at ${fmtLines(refs)}  via ${[...new Set(refs.map(r=>r.via))].join("/")}`);
}
console.log();

console.log(`--- (B1) static index.html id never looked up by id in app.js [${orphansHtml.length}] ---`);
for (const id of orphansHtml) console.log(`#${id}  index.html:${fmtLines(defHtml.get(id))}`);
console.log();

console.log(`--- (B2) app.js-templated id never looked up by id in app.js [${orphansApp.length}] ---`);
for (const id of orphansApp) console.log(`#${id}  app.js:${fmtLines(defApp.get(id))}`);
console.log();

console.log(`--- dynamic (interpolated) ids seen, not part of the exact cross-check above ---`);
console.log(`defined with interpolation: ${defAppDynamic.length}, referenced with interpolation: ${refAppDynamic.length}`);
for (const d of defAppDynamic.slice(0, 20)) console.log(`  def app.js:${d.line}  id="${d.id}"`);
for (const r of refAppDynamic.slice(0, 20)) console.log(`  ref app.js:${r.line}  ${r.via}  "${r.id}"`);
