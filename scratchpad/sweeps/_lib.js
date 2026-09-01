// Shared helpers for the L0 dead-weight sweeps. Plain node, no deps.
// Tokenizer classifies each character of a JS source as one of:
//   'c' code, '#' comment, 's' string/template-literal-content, 'r' regex-literal
// Template interpolation `${...}` is classified as CODE (it executes), the
// literal text around it is classified as 's' (string), same as a plain string.
"use strict";
const fs = require("fs");

function read(path) { return fs.readFileSync(path, "utf8"); }

// index -> 1-based line number, via prefix line-start table
function lineIndex(src) {
  const starts = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === "\n") starts.push(i + 1);
  return (idx) => {
    // binary search
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= idx) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
}

const ID_CHAR = /[A-Za-z0-9_$]/;
const REGEX_PRECEDER = /[\s]*$/; // unused placeholder
// chars/keywords after which a leading '/' starts a regex, not division
const REGEX_PREV_PUNCT = new Set(["(", ",", "=", ":", "[", "!", "&", "|", "?", "{", ";", "+", "-", "*", "%", "^", "~", "<", ">", "\n"]);
const REGEX_PREV_KEYWORDS = new Set(["return", "typeof", "case", "in", "of", "new", "delete", "void", "throw", "instanceof", "yield", "do", "else"]);

function lastCodeToken(src, mask, uptoExclusive) {
  // scan backwards over code chars only, skipping whitespace, to find the
  // last significant token (punctuation char or identifier word)
  let i = uptoExclusive - 1;
  while (i >= 0 && (mask[i] !== "c" || /\s/.test(src[i]))) i--;
  if (i < 0) return "";
  if (ID_CHAR.test(src[i])) {
    let j = i;
    while (j >= 0 && mask[j] === "c" && ID_CHAR.test(src[j])) j--;
    return src.slice(j + 1, i + 1);
  }
  return src[i];
}

// Full tokenizer. Returns mask string same length as src.
function classify(src) {
  const n = src.length;
  const mask = new Array(n).fill("c");
  // ctxStack entries: {type:'tmpl'} or {type:'expr', depth:0}
  const ctx = [];
  let i = 0;
  while (i < n) {
    const top = ctx.length ? ctx[ctx.length - 1] : null;
    if (top && top.type === "tmpl") {
      // inside template literal string content
      const c = src[i];
      if (c === "\\") { mask[i] = "s"; if (i + 1 < n) mask[i + 1] = "s"; i += 2; continue; }
      if (c === "`") { mask[i] = "s"; ctx.pop(); i++; continue; }
      if (c === "$" && src[i + 1] === "{") { mask[i] = "s"; mask[i + 1] = "s"; ctx.push({ type: "expr", depth: 0 }); i += 2; continue; }
      mask[i] = "s"; i++; continue;
    }
    const c = src[i], c2 = src[i + 1];
    // comments
    if (c === "/" && c2 === "/") {
      let j = i;
      while (j < n && src[j] !== "\n") { mask[j] = "#"; j++; }
      i = j; continue;
    }
    if (c === "/" && c2 === "*") {
      let j = i;
      mask[j] = "#"; mask[j + 1] = "#"; j += 2;
      while (j < n && !(src[j] === "*" && src[j + 1] === "/")) { mask[j] = "#"; j++; }
      if (j < n) { mask[j] = "#"; mask[j + 1] = "#"; j += 2; }
      i = j; continue;
    }
    // strings
    if (c === '"' || c === "'") {
      const q = c;
      let j = i; mask[j] = "s"; j++;
      while (j < n && src[j] !== q) {
        if (src[j] === "\\") { mask[j] = "s"; j++; if (j < n) mask[j] = "s"; j++; continue; }
        if (src[j] === "\n") break; // unterminated - bail
        mask[j] = "s"; j++;
      }
      if (j < n && src[j] === q) { mask[j] = "s"; j++; }
      i = j; continue;
    }
    // template literal start
    if (c === "`") {
      mask[i] = "s"; ctx.push({ type: "tmpl" }); i++; continue;
    }
    // regex literal (heuristic)
    if (c === "/" && c2 !== "/" && c2 !== "*") {
      const prevTok = lastCodeToken(src, mask, i);
      const looksLikeRegexStart = prevTok === "" || REGEX_PREV_PUNCT.has(prevTok) || REGEX_PREV_KEYWORDS.has(prevTok);
      if (looksLikeRegexStart) {
        let j = i; mask[j] = "r"; j++;
        let inClass = false;
        let ok = false;
        while (j < n) {
          const cj = src[j];
          if (cj === "\\") { mask[j] = "r"; j++; if (j < n) { mask[j] = "r"; j++; } continue; }
          if (cj === "\n") break;
          if (cj === "[") inClass = true;
          if (cj === "]") inClass = false;
          if (cj === "/" && !inClass) { mask[j] = "r"; j++; ok = true; break; }
          mask[j] = "r"; j++;
        }
        if (ok) {
          // flags
          while (j < n && /[a-z]/i.test(src[j])) { mask[j] = "r"; j++; }
          i = j; continue;
        }
        // not actually a regex (unterminated) - fall through as code, re-mark '/' as code
        mask[i] = "c"; i++; continue;
      }
    }
    // brace tracking for ${...} expr depth
    if (top && top.type === "expr") {
      if (c === "{") { top.depth++; mask[i] = "c"; i++; continue; }
      if (c === "}") {
        if (top.depth > 0) { top.depth--; mask[i] = "c"; i++; continue; }
        mask[i] = "s"; ctx.pop(); i++; continue;
      }
    }
    mask[i] = "c"; i++;
  }
  return mask.join("");
}

function maskedTo(src, mask, keep) {
  let out = "";
  for (let i = 0; i < src.length; i++) {
    if (keep.has(mask[i])) out += src[i];
    else out += (src[i] === "\n") ? "\n" : " ";
  }
  return out;
}

function codeOnly(src, mask) { return maskedTo(src, mask, new Set(["c"])); }
function stringsOnly(src, mask) { return maskedTo(src, mask, new Set(["s"])); }
// code with comments stripped but strings/template literals left INTACT
// (quotes and all) - needed whenever a regex must match a string literal
// itself, e.g. `localStorage.getItem("x")` or `const K="spellForge.v1"`.
function commentsStripped(src, mask) { return maskedTo(src, mask, new Set(["c", "s"])); }

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function countIdent(text, name) {
  const re = new RegExp("(?<![A-Za-z0-9_$])" + escapeRe(name) + "(?![A-Za-z0-9_$])", "g");
  const matches = [];
  let m;
  while ((m = re.exec(text))) matches.push(m.index);
  return matches;
}

module.exports = { read, classify, codeOnly, stringsOnly, commentsStripped, countIdent, lineIndex, escapeRe };
