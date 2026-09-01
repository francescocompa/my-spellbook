// Sweep 5: GOTCHAS.md wiring pitfalls, checked mechanically.
//   (a) .onclick= assigned twice to the same target expression in one function scope
//   (b) attachTip(x) called on x BEFORE x.onclick= in the same function scope
//   (c) confirm()/alert()/prompt() calls (banned, D53)
//   (d) <button> nested inside <button> in a template literal (parser hoists it)
//   (e) behavior:"smooth" without an apparent fallback nearby
//   (f) non-ASCII glyph chars via textContent/innerText or inside a <button> template
//   (g) addEventListener(document|window) inside a render*/refresh* function (leak candidate)
"use strict";
const L = require("./_lib.js");

const FILES = ["src/app.js", "src/extract.js"];
const fileData = {};
for (const f of FILES) {
  const src = L.read(f);
  const mask = L.classify(src);
  fileData[f] = {
    src, mask,
    code: L.codeOnly(src, mask),           // pure code, strings/comments blanked
    withStrings: L.commentsStripped(src, mask), // code+strings, comments blanked (quotes intact)
    li: L.lineIndex(src),
  };
}

// ---------------------------------------------------------------------
// shared scope tree: every function-body brace (named or anonymous, decl
// or arrow) becomes a frame; a plain block/object/control-flow brace does
// NOT start a new frame. Used by (a), (b) and (g) so "same function" means
// the same lexical closure, not just textual proximity.
// ---------------------------------------------------------------------
function isFunctionBodyBrace(code, braceIdx) {
  let i = braceIdx - 1;
  while (i >= 0 && /\s/.test(code[i])) i--;
  if (i < 0) return false;
  if (code[i] === ">" && code[i - 1] === "=") return true; // arrow `=>{`
  if (code[i] === ")") {
    let depth = 0, j = i;
    for (; j >= 0; j--) {
      if (code[j] === ")") depth++;
      else if (code[j] === "(") { depth--; if (depth === 0) break; }
    }
    if (j < 0) return false;
    let k = j - 1;
    while (k >= 0 && /\s/.test(code[k])) k--;
    if (k >= 0 && /[A-Za-z0-9_$]/.test(code[k])) {
      while (k >= 0 && /[A-Za-z0-9_$]/.test(code[k])) k--;
      while (k >= 0 && /\s/.test(code[k])) k--;
    }
    if (k >= 6 && code.slice(k - 7, k + 1) === "function") {
      const before = code[k - 8];
      if (!before || !/[A-Za-z0-9_$]/.test(before)) return true;
    }
    return false;
  }
  return false;
}
function buildScopeTree(code) {
  const frames = [];
  const root = { id: 0, parentId: null, isFunction: true, start: 0, end: code.length, name: null };
  frames.push(root);
  const stack = [root];
  let nextId = 1;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === "{") {
      if (isFunctionBodyBrace(code, i)) {
        const frame = { id: nextId++, parentId: stack[stack.length - 1].id, isFunction: true, start: i, end: -1, name: null };
        frames.push(frame);
        stack.push(frame);
      } else {
        stack.push({ id: -1, isFunction: false });
      }
    } else if (code[i] === "}") {
      const top = stack.pop();
      if (top && top.isFunction && top.end === -1) top.end = i;
    }
  }
  return frames;
}
function attachNames(frames, code) {
  // named function decl: function NAME(
  let m;
  const reFunc = /\bfunction\s+([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*\(/g;
  while ((m = reFunc.exec(code))) {
    const po = code.indexOf("(", m.index);
    let depth = 0, j = po;
    for (; j < code.length; j++) { if (code[j] === "(") depth++; else if (code[j] === ")") { depth--; if (depth === 0) { j++; break; } } }
    let k = j; while (k < code.length && /\s/.test(code[k])) k++;
    if (code[k] === "{") { const fr = frames.find((f) => f.start === k); if (fr) fr.name = m[1]; }
  }
  // named const/let arrow or function-expr: const NAME = (...)=> { | const NAME = function
  const reAssign = /\b(?:const|let)\s+([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?/g;
  while ((m = reAssign.exec(code))) {
    let after = reAssign.lastIndex;
    while (after < code.length && /\s/.test(code[after])) after++;
    if (code.slice(after, after + 8) === "function") {
      const po = code.indexOf("(", after);
      if (po < 0) continue;
      let depth = 0, j = po;
      for (; j < code.length; j++) { if (code[j] === "(") depth++; else if (code[j] === ")") { depth--; if (depth === 0) { j++; break; } } }
      let k = j; while (k < code.length && /\s/.test(code[k])) k++;
      if (code[k] === "{") { const fr = frames.find((f) => f.start === k); if (fr) fr.name = m[1]; }
      continue;
    }
    let arrowIdx = -1;
    if (code[after] === "(") {
      let depth = 0, j = after;
      for (; j < code.length; j++) { if (code[j] === "(") depth++; else if (code[j] === ")") { depth--; if (depth === 0) { j++; break; } } }
      let k = j; while (k < code.length && /\s/.test(code[k])) k++;
      if (code[k] === "=" && code[k + 1] === ">") arrowIdx = k;
    } else if (/[A-Za-z_$]/.test(code[after])) {
      let j = after; while (j < code.length && /[A-Za-z0-9_$]/.test(code[j])) j++;
      let k = j; while (k < code.length && /\s/.test(code[k])) k++;
      if (code[k] === "=" && code[k + 1] === ">") arrowIdx = k;
    }
    if (arrowIdx < 0) continue;
    let k = arrowIdx + 2; while (k < code.length && /\s/.test(code[k])) k++;
    if (code[k] === "{") { const fr = frames.find((f) => f.start === k); if (fr) fr.name = m[1]; }
  }
}
// finds the nearest `const NAME=` / `let NAME=` declaration site strictly
// before `beforeIdx`, no earlier than `floor` - used to tell apart two
// DIFFERENT bindings that happen to share a name (e.g. a `const btn=...` in
// each branch of a sibling if/else chain) from a genuine re-assignment of
// the SAME binding. Two onclick sites only describe the same element if they
// trace back to the same declaration site (or neither has one, e.g. a param).
function nearestDeclSite(code, floor, targetName, beforeIdx) {
  const re = new RegExp("\\b(?:const|let|var)\\s+" + targetName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g");
  let last = null, m;
  re.lastIndex = floor;
  while ((m = re.exec(code)) && m.index < beforeIdx) { last = m.index; re.lastIndex = m.index + 1; }
  return last; // null if never (re)declared in range - e.g. it's a function parameter
}
function innermostFrame(frames, idx) {
  let best = null;
  for (const fr of frames) {
    if (fr.start <= idx && idx <= fr.end) {
      if (!best || (fr.end - fr.start) < (best.end - best.start)) best = fr;
    }
  }
  return best;
}
function nearestNamedAncestor(frames, frame) {
  let f = frame;
  while (f) {
    if (f.name) return f;
    f = f.parentId == null ? null : frames.find((x) => x.id === f.parentId);
  }
  return null;
}

const scopes = {};
for (const f of FILES) {
  const { code } = fileData[f];
  const frames = buildScopeTree(code);
  attachNames(frames, code);
  scopes[f] = frames;
}

console.log("=== handlers: GOTCHAS wiring pitfalls ===\n");

// ---------------------------------------------------------------------
// (a) .onclick= assigned twice to the same target in the same function scope
// ---------------------------------------------------------------------
let aCount = 0;
console.log("--- (a) .onclick assigned twice to the same target in the same function scope ---");
for (const f of FILES) {
  const { code, li } = fileData[f];
  const frames = scopes[f];
  const re = /([A-Za-z_$][A-Za-zA-Z0-9_$]*(?:\.[A-Za-z_$][A-Za-zA-Z0-9_$]*|\[[^\[\]]{1,40}\])*)\.onclick\s*=(?!=)/g;
  const byFrameTarget = new Map();
  let m;
  while ((m = re.exec(code))) {
    const frame = innermostFrame(frames, m.index);
    const baseName = m[1].match(/^[A-Za-z_$][A-Za-zA-Z0-9_$]*/)[0];
    const declSite = nearestDeclSite(code, frame.start, baseName, m.index);
    // group by (frame, target text, declaration site) - two `const btn=` in
    // sibling if-branches share a name but not a decl site, so they are
    // different bindings and must not be flagged together
    const key = frame.id + "|" + m[1] + "|" + declSite;
    if (!byFrameTarget.has(key)) byFrameTarget.set(key, []);
    byFrameTarget.get(key).push({ line: li(m.index), target: m[1], frame });
  }
  for (const [key, list] of byFrameTarget) {
    if (list.length > 1) {
      aCount++;
      console.log(`${f}  target="${list[0].target}"  lines: ${list.map((x) => x.line).join(", ")}  (frame ${list[0].frame.name || "anonymous#" + list[0].frame.id})`);
    }
  }
}
console.log(`[${aCount} findings]\n`);

// ---------------------------------------------------------------------
// (b) attachTip(x) called on x BEFORE x.onclick= in the same function scope
// ---------------------------------------------------------------------
let bCount = 0;
console.log("--- (b) attachTip(x) called before x.onclick= in the same function scope ---");
for (const f of FILES) {
  const { code, li } = fileData[f];
  const frames = scopes[f];
  const reTip = /\battachTip\(\s*([A-Za-z_$][A-Za-zA-Z0-9_$]*)/g;
  const reClick = /([A-Za-z_$][A-Za-zA-Z0-9_$]*)\.onclick\s*=(?!=)/g;
  const tips = [];
  let m;
  while ((m = reTip.exec(code))) tips.push({ idx: m.index, target: m[1], line: li(m.index) });
  const clicks = [];
  while ((m = reClick.exec(code))) clicks.push({ idx: m.index, target: m[1], line: li(m.index) });
  for (const t of tips) {
    const tf = innermostFrame(frames, t.idx);
    const tDecl = nearestDeclSite(code, tf.start, t.target, t.idx);
    const laterClick = clicks.find((c) => {
      if (c.target !== t.target || c.idx <= t.idx) return false;
      const cf = innermostFrame(frames, c.idx);
      if (cf.id !== tf.id) return false;
      const cDecl = nearestDeclSite(code, cf.start, c.target, c.idx);
      return cDecl === tDecl; // same binding, not just same name
    });
    if (laterClick) {
      bCount++;
      console.log(`${f}:${t.line}  attachTip(${t.target})  before  .onclick= at ${f}:${laterClick.line}  (frame ${tf.name || "anonymous#" + tf.id})`);
    }
  }
}
console.log(`[${bCount} findings]\n`);

// ---------------------------------------------------------------------
// (c) confirm()/alert()/prompt()
// ---------------------------------------------------------------------
let cCount = 0;
console.log("--- (c) native confirm()/alert()/prompt() calls (banned, D53) ---");
for (const f of FILES) {
  const { code, li } = fileData[f];
  const re = /\b(confirm|alert|prompt)\s*\(/g;
  let m;
  while ((m = re.exec(code))) {
    cCount++;
    console.log(`${f}:${li(m.index)}  ${m[1]}(...)`);
  }
}
console.log(`[${cCount} findings]\n`);

// ---------------------------------------------------------------------
// (d) <button> nested inside <button> within a template literal
// ---------------------------------------------------------------------
let dCount = 0;
console.log("--- (d) <button nested inside <button in a template literal ---");
for (const f of FILES) {
  const { src, mask, li } = fileData[f];
  // pair up top-level backtick delimiters (best-effort: treats every backtick
  // as a toggle, which is correct except for an escaped \` inside a literal -
  // rare enough in this codebase to accept as a known limitation)
  const ticks = [];
  for (let i = 0; i < src.length; i++) if (mask[i] === "s" && src[i] === "`") ticks.push(i);
  let depth = 0, openIdx = -1;
  const spans = [];
  for (const idx of ticks) {
    if (depth === 0) { openIdx = idx; depth = 1; }
    else { depth = 0; spans.push([openIdx, idx]); }
  }
  for (const [start, end] of spans) {
    const text = src.slice(start, end + 1);
    const reOpen = /<button\b/gi, reClose = /<\/button/gi;
    const events = [];
    let m;
    while ((m = reOpen.exec(text))) events.push({ idx: m.index, open: true });
    while ((m = reClose.exec(text))) events.push({ idx: m.index, open: false });
    events.sort((x, y) => x.idx - y.idx);
    let bd = 0;
    for (const e of events) {
      if (e.open) { bd++; if (bd === 2) { dCount++; console.log(`${f}:${li(start + e.idx)}  nested <button inside <button (template starting ${f}:${li(start)})`); } }
      else bd = Math.max(0, bd - 1);
    }
  }
}
console.log(`[${dCount} findings]\n`);

// ---------------------------------------------------------------------
// (e) behavior:"smooth" without an apparent fallback nearby
// ---------------------------------------------------------------------
let eCount = 0;
console.log('--- (e) behavior:"smooth" without an apparent fallback (setTimeout) nearby ---');
for (const f of FILES) {
  const { withStrings, li } = fileData[f];
  const re = /behavior\s*:\s*["']smooth["']/g;
  let m;
  while ((m = re.exec(withStrings))) {
    const windowText = withStrings.slice(Math.max(0, m.index - 300), m.index + 300);
    const hasFallback = /setTimeout/.test(windowText);
    eCount++;
    console.log(`${f}:${li(m.index)}  behavior:"smooth"  fallback nearby: ${hasFallback ? "yes (setTimeout found within 300 chars)" : "NO"}`);
  }
}
console.log(`[${eCount} occurrences]\n`);

// ---------------------------------------------------------------------
// (f) non-ASCII glyph chars via textContent/innerText, or inside a <button> template
// ---------------------------------------------------------------------
let fCount = 0;
console.log("--- (f) non-ASCII glyph char via textContent/innerText, or literal inside a <button> template ---");
// exclude common typographic punctuation that is prose, not an icon glyph
const TYPO_EXCLUDE = new Set(["–", "—", "‘", "’", "“", "”", "…", "°", "×", "÷", "→", "’"]);
function glyphsIn(text) {
  const found = [];
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp > 0x7f && !TYPO_EXCLUDE.has(ch)) found.push(ch);
  }
  return found;
}
for (const f of FILES) {
  const { src, mask, li, withStrings } = fileData[f];
  // textContent/innerText assignments - inspect the RHS string/template segment
  const re = /\.(textContent|innerText)\s*=\s*/g;
  let m;
  while ((m = re.exec(withStrings))) {
    let i = re.lastIndex;
    // find extent of the RHS literal (string or template) using mask
    if (src[i] === '"' || src[i] === "'" || src[i] === "`") {
      const q = src[i];
      let j = i + 1;
      while (j < src.length && !(src[j] === q && src[j - 1] !== "\\")) j++;
      const lit = src.slice(i, j + 1);
      const glyphs = glyphsIn(lit);
      if (glyphs.length) { fCount++; console.log(`${f}:${li(m.index)}  .${m[1]}=  glyphs: ${[...new Set(glyphs)].join(" ")}`); }
    }
  }
  // template literals containing <button ... </button> - scan their literal text
  const ticks = [];
  for (let i = 0; i < src.length; i++) if (mask[i] === "s" && src[i] === "`") ticks.push(i);
  let depth = 0, openIdx = -1;
  const spans = [];
  for (const idx of ticks) { if (depth === 0) { openIdx = idx; depth = 1; } else { depth = 0; spans.push([openIdx, idx]); } }
  for (const [start, end] of spans) {
    const text = src.slice(start, end + 1);
    if (!/<button\b/i.test(text)) continue;
    // only inspect the STRING portions of this template (exclude ${...} code)
    const spanMask = mask.slice(start, end + 1);
    let strOnly = "";
    for (let i = 0; i < text.length; i++) strOnly += spanMask[i] === "s" ? text[i] : " ";
    // restrict to inside <button ...>...</button> segments
    const btnRe = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
    let bm;
    while ((bm = btnRe.exec(strOnly))) {
      const glyphs = glyphsIn(bm[1]);
      if (glyphs.length) { fCount++; console.log(`${f}:${li(start + bm.index)}  <button> literal text  glyphs: ${[...new Set(glyphs)].join(" ")}`); }
    }
  }
}
console.log(`[${fCount} findings]\n`);

// ---------------------------------------------------------------------
// (g) addEventListener(document|window, ...) inside a render*/refresh* function
// ---------------------------------------------------------------------
let gCount = 0;
console.log("--- (g) addEventListener on document/window inside a render*/refresh* function (leak candidate) ---");
for (const f of FILES) {
  const { code, li } = fileData[f];
  const frames = scopes[f];
  const re = /\b(document|window)\.addEventListener\(/g;
  let m;
  while ((m = re.exec(code))) {
    const frame = innermostFrame(frames, m.index);
    const named = nearestNamedAncestor(frames, frame);
    if (named && /^(render|refresh)/i.test(named.name)) {
      gCount++;
      console.log(`${f}:${li(m.index)}  ${m[1]}.addEventListener(...)  inside ${named.name}()`);
    }
  }
}
console.log(`[${gCount} findings]\n`);
