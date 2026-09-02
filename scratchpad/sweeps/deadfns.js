// Sweep 1: functions defined in src/app.js and src/extract.js with zero
// references outside their own definition line, across app.js + extract.js +
// index.html (inline onclick="name(...)" counts). Functions referenced only
// from inside a string/template literal are reported separately as possibly
// dynamic wiring, not dead.
"use strict";
const fs = require("fs");
const L = require("./_lib.js");

const FILES = ["src/app.js", "src/extract.js"];
const sources = {};
const masks = {};
const codeTexts = {};
const stringTexts = {};
const lineOf = {};
for (const f of FILES) {
  const src = L.read(f);
  sources[f] = src;
  masks[f] = L.classify(src);
  codeTexts[f] = L.codeOnly(src, masks[f]);
  stringTexts[f] = L.stringsOnly(src, masks[f]);
  lineOf[f] = L.lineIndex(src);
}
const htmlSrc = L.read("src/index.html");
// index.html isn't JS - just search the raw text (attributes, inline scripts)
// for identifier occurrences; good enough for wiring detection.

// ---- collect function definitions ----
// pattern A: function name(   [[optionally preceded by "async "]]
// pattern B: const/let name = (...) => / name => ...   [optionally async]
// pattern C: const/let name = function
const defs = []; // {name, file, line, kind}

for (const f of FILES) {
  const code = codeTexts[f];
  const src = sources[f];
  const li = lineOf[f];

  const reFuncDecl = /\bfunction\s+([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*\(/g;
  let m;
  while ((m = reFuncDecl.exec(code))) {
    defs.push({ name: m[1], file: f, line: li(m.index), idx: m.index, kind: "function" });
  }

  const reConstFunc = /\b(?:const|let)\s+([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?function\b/g;
  while ((m = reConstFunc.exec(code))) {
    defs.push({ name: m[1], file: f, line: li(m.index), idx: m.index, kind: "const-function" });
  }

  // arrow: const/let name = <async?> ( ... ) => | const/let name = <async?> ident =>
  // scan manually to tolerate multiline parameter lists
  const reArrowStart = /\b(?:const|let)\s+([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*=\s*(async\s+)?/g;
  while ((m = reArrowStart.exec(code))) {
    let after = reArrowStart.lastIndex;
    // skip whitespace
    while (after < code.length && /\s/.test(code[after])) after++;
    let isArrow = false;
    if (code[after] === "(") {
      // find matching close paren (only counting code chars, mask already blanks strings)
      let depth = 0, j = after;
      for (; j < code.length; j++) {
        if (code[j] === "(") depth++;
        else if (code[j] === ")") { depth--; if (depth === 0) { j++; break; } }
        if (j - after > 4000) break; // safety
      }
      let k = j;
      while (k < code.length && /\s/.test(code[k])) k++;
      if (code[k] === "=" && code[k + 1] === ">") isArrow = true;
    } else if (/[A-Za-z_$]/.test(code[after])) {
      let j = after;
      while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j++;
      let k = j;
      while (k < code.length && /\s/.test(code[k])) k++;
      if (code[k] === "=" && code[k + 1] === ">") isArrow = true;
    }
    if (isArrow) {
      defs.push({ name: m[1], file: f, line: li(m.index), idx: m.index, kind: "arrow" });
    }
  }
}

// dedupe by file+name+line (some patterns could double match, e.g. const-function
// also isn't matched by arrow since it lacks =>) - but same name could legitimately
// be defined twice (reassignment/shadow) - keep separate entries, but dedupe exact idx.
const seen = new Set();
const uniqueDefs = [];
for (const d of defs) {
  const key = d.file + "|" + d.idx;
  if (seen.has(key)) continue;
  seen.add(key);
  uniqueDefs.push(d);
}
uniqueDefs.sort((a, b) => a.file.localeCompare(b.file) || a.idx - b.idx);

// ---- reference counting ----
function countInFileCode(file, name, excludeLine) {
  const li = lineOf[file];
  const code = codeTexts[file];
  const positions = L.countIdent(code, name);
  let n = 0;
  for (const p of positions) {
    if (file === excludeLine.file && li(p) === excludeLine.line) continue;
    n++;
  }
  return n;
}
function countInFileString(file, name) {
  return L.countIdent(stringTexts[file], name).length;
}
function countInHtml(name) {
  // whole-file text search (html isn't tokenized) - good enough for onclick="name(...)"
  const re = new RegExp("(?<![A-Za-z0-9_$])" + L.escapeRe(name) + "(?![A-Za-z0-9_$])", "g");
  const matches = htmlSrc.match(re);
  return matches ? matches.length : 0;
}

const results = [];
for (const d of uniqueDefs) {
  let codeRefs = 0;
  for (const f of FILES) codeRefs += countInFileCode(f, d.name, d);
  const htmlRefs = countInHtml(d.name);
  let strRefs = 0;
  for (const f of FILES) strRefs += countInFileString(f, d.name);
  results.push({ ...d, codeRefs, htmlRefs, strRefs, totalRefs: codeRefs + htmlRefs });
}

const dead = results.filter((r) => r.totalRefs === 0);
const stringOnly = results.filter((r) => r.totalRefs === 0 === false && false); // placeholder, recompute below
const dynamicOnly = results.filter((r) => r.totalRefs === 0 && r.strRefs > 0);
// Note: dynamicOnly is a SUBSET already counted in `dead` (totalRefs excludes string refs
// by design - string refs never count as real references). Re-split: dead functions with
// strRefs>0 are the "referenced only from a string" bucket; dead with strRefs===0 are truly zero.
const trulyDead = dead.filter((r) => r.strRefs === 0);
const stringWired = dead.filter((r) => r.strRefs > 0);

console.log(`=== deadfns: ${uniqueDefs.length} function definitions scanned (app.js + extract.js) ===\n`);

console.log(`--- zero references anywhere (code, inline HTML, or string) [${trulyDead.length}] ---`);
for (const r of trulyDead) {
  console.log(`${r.file}:${r.line}  ${r.name}  (${r.kind})`);
}

console.log(`\n--- zero CODE/HTML references, but referenced from inside a string/template literal (possibly dynamic wiring) [${stringWired.length}] ---`);
for (const r of stringWired) {
  console.log(`${r.file}:${r.line}  ${r.name}  (${r.kind})  strRefs=${r.strRefs}`);
}

console.log(`\nTOTAL dead (zero refs): ${trulyDead.length}`);
console.log(`TOTAL string-only wired: ${stringWired.length}`);

// D158(k): gate on this sweep. It carried an allowlist for `folderForget`/`clearImport`,
// the two orphans K1/K2 left behind and K4 was queued to delete; K4 deleted them, so the
// allowlist is spent and the bar is simply ZERO. Any dead function is a regression.
if (trulyDead.length) {
  console.log(`\nFAIL: ${trulyDead.length} dead function(s) — ${trulyDead.map((r) => r.name).join(", ")}`);
}
process.exit(trulyDead.length ? 1 : 0);
