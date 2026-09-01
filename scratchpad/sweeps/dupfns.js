// Sweep 3: exact and near-duplicate function bodies in app.js + extract.js.
// Only braced bodies (`function(){...}` / `name=(...)=>{...}`) are compared -
// concise arrow one-liners are too short for the >=8-line threshold anyway.
"use strict";
const L = require("./_lib.js");

const FILES = ["src/app.js", "src/extract.js"];
const fnDefs = [];
const fileInfo = {}; // file -> {src, mask} - looked up by d.file, never stored per-def during the shared loop

for (const f of FILES) {
  const src = L.read(f);
  const mask = L.classify(src);
  const code = L.codeOnly(src, mask);
  const li = L.lineIndex(src);

  function findBraceEnd(openIdx) {
    let depth = 0, i = openIdx;
    for (; i < code.length; i++) {
      if (code[i] === "{") depth++;
      else if (code[i] === "}") { depth--; if (depth === 0) return i; }
    }
    return -1;
  }
  function skipWs(i) { while (i < code.length && /\s/.test(code[i])) i++; return i; }
  function matchParen(openIdx) {
    let depth = 0, i = openIdx;
    for (; i < code.length; i++) {
      if (code[i] === "(") depth++;
      else if (code[i] === ")") { depth--; if (depth === 0) return i; }
    }
    return -1;
  }

  const reFuncDecl = /\bfunction\s+([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*\(/g;
  let m;
  while ((m = reFuncDecl.exec(code))) {
    const parenOpen = code.indexOf("(", m.index);
    const parenClose = matchParen(parenOpen);
    if (parenClose < 0) continue;
    const braceStart = skipWs(parenClose + 1);
    if (code[braceStart] !== "{") continue;
    const braceEnd = findBraceEnd(braceStart);
    if (braceEnd < 0) continue;
    fnDefs.push({ name: m[1], file: f, line: li(m.index), bodyStart: braceStart, bodyEnd: braceEnd + 1, kind: "function" });
  }

  const reConstFunc = /\b(?:const|let)\s+([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?function\b[^(]*\(/g;
  while ((m = reConstFunc.exec(code))) {
    const parenOpen = code.lastIndexOf("(", reConstFunc.lastIndex - 1) >= m.index ? code.indexOf("(", m.index) : -1;
    const po = code.indexOf("(", m.index);
    const pc = matchParen(po);
    if (pc < 0) continue;
    const braceStart = skipWs(pc + 1);
    if (code[braceStart] !== "{") continue;
    const braceEnd = findBraceEnd(braceStart);
    if (braceEnd < 0) continue;
    fnDefs.push({ name: m[1], file: f, line: li(m.index), bodyStart: braceStart, bodyEnd: braceEnd + 1, kind: "const-function" });
  }

  // braced arrows: const/let name = (...)=> {  OR  name => {
  const reArrowStart = /\b(?:const|let)\s+([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*=\s*(async\s+)?/g;
  while ((m = reArrowStart.exec(code))) {
    let after = reArrowStart.lastIndex;
    while (after < code.length && /\s/.test(code[after])) after++;
    let arrowIdx = -1;
    if (code[after] === "(") {
      const pc = matchParen(after);
      if (pc < 0) continue;
      let k = skipWs(pc + 1);
      if (code[k] === "=" && code[k + 1] === ">") arrowIdx = k;
    } else if (/[A-Za-z_$]/.test(code[after])) {
      let j = after;
      while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j++;
      let k = skipWs(j);
      if (code[k] === "=" && code[k + 1] === ">") arrowIdx = k;
    }
    if (arrowIdx < 0) continue;
    const braceStart = skipWs(arrowIdx + 2);
    if (code[braceStart] !== "{") continue; // concise body, skip
    const braceEnd = findBraceEnd(braceStart);
    if (braceEnd < 0) continue;
    fnDefs.push({ name: m[1], file: f, line: li(m.index), bodyStart: braceStart, bodyEnd: braceEnd + 1, kind: "arrow" });
  }

  fileInfo[f] = { src, mask };
}

// dedupe by file+bodyStart
const seen = new Set();
const defs = [];
for (const d of fnDefs) {
  const key = d.file + "|" + d.bodyStart;
  if (seen.has(key)) continue;
  seen.add(key);
  defs.push(d);
}

// build normalized text (comments stripped, whitespace collapsed) + line count + tokens
function normalize(d) {
  const { src, mask } = fileInfo[d.file];
  const raw = src.slice(d.bodyStart, d.bodyEnd);
  const m = mask.slice(d.bodyStart, d.bodyEnd);
  let noComments = "";
  for (let i = 0; i < raw.length; i++) noComments += m[i] === "#" ? " " : raw[i];
  const collapsed = noComments.replace(/\s+/g, " ").trim();
  return collapsed;
}
const TOKEN_RE = /[A-Za-z_$][A-Za-zA-Z0-9_$]*|\d+(?:\.\d+)?|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|=>|===|!==|==|!=|<=|>=|&&|\|\||\+\+|--|[^\s]/g;
function tokenize(text) { return text.match(TOKEN_RE) || []; }

for (const d of defs) {
  d.lineCount = fileInfo[d.file].src.slice(d.bodyStart, d.bodyEnd).split("\n").length;
  d.normText = normalize(d);
  d.tokens = tokenize(d.normText);
}

// ---- exact duplicates: group by normText, only bodies with real content ----
const MIN_LINES_EXACT = 3; // trivial 1-2 line identical bodies are noise (e.g. "{return null;}")
const byNorm = new Map();
for (const d of defs) {
  if (d.lineCount < MIN_LINES_EXACT) continue;
  if (!byNorm.has(d.normText)) byNorm.set(d.normText, []);
  byNorm.get(d.normText).push(d);
}
const exactGroups = [...byNorm.values()].filter((g) => g.length > 1);

console.log(`=== dupfns: ${defs.length} braced function bodies extracted (app.js + extract.js) ===\n`);
console.log(`--- exact duplicate bodies (>= ${MIN_LINES_EXACT} lines) [${exactGroups.length} groups] ---`);
for (const g of exactGroups) {
  console.log(g.map((d) => `${d.file}:${d.line} ${d.name}`).join("  ==  ") + `  (${g[0].lineCount} lines)`);
}

// ---- near-duplicates: Jaccard over token 3-grams >= 0.85, bodies >= 8 lines ----
const MIN_LINES_NEAR = 8;
function threeGrams(tokens) {
  const s = new Set();
  for (let i = 0; i + 3 <= tokens.length; i++) s.add(tokens[i] + "" + tokens[i + 1] + "" + tokens[i + 2]);
  return s;
}
const candidates = defs.filter((d) => d.lineCount >= MIN_LINES_NEAR);
for (const d of candidates) d.grams = threeGrams(d.tokens);

// bucket by rough line count to cut down comparisons (compare only within +/-40%)
candidates.sort((a, b) => a.lineCount - b.lineCount);
const nearPairs = [];
const exactNormSet = new Set(exactGroups.flatMap((g) => [g[0].normText])); // skip pairs already exact
for (let i = 0; i < candidates.length; i++) {
  for (let j = i + 1; j < candidates.length; j++) {
    const a = candidates[i], b = candidates[j];
    if (b.lineCount > a.lineCount * 1.4 + 4) break; // sorted ascending, can stop early once too big
    if (a.normText === b.normText) continue; // already reported as exact
    const inter = [...a.grams].filter((g) => b.grams.has(g)).length;
    const union = a.grams.size + b.grams.size - inter;
    if (union === 0) continue;
    const jac = inter / union;
    if (jac >= 0.85) nearPairs.push({ a, b, jac });
  }
}
nearPairs.sort((x, y) => y.jac - x.jac);
console.log(`\n--- near-duplicate bodies (Jaccard 3-gram >= 0.85, >= ${MIN_LINES_NEAR} lines) [${nearPairs.length} pairs] ---`);
for (const p of nearPairs) {
  console.log(`${p.a.file}:${p.a.line} ${p.a.name}  ~~  ${p.b.file}:${p.b.line} ${p.b.name}  jaccard=${p.jac.toFixed(3)}  lines=${p.a.lineCount}/${p.b.lineCount}`);
}
