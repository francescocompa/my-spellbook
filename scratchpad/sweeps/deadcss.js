// Sweep 2: dead CSS class/id selectors in src/styles.css - tokens with zero
// matches in src/index.html, src/app.js, src/extract.js. Flags tokens whose
// hyphen-prefix looks dynamically concatenated in app.js as "possibly dynamic"
// rather than dead. Also reports duplicate selectors with identical bodies.
"use strict";
const L = require("./_lib.js");

const css = L.read("src/styles.css");
const li = L.lineIndex(css);

// strip CSS comments /* ... */ first (CSS has no line comments, no strings
// worth preserving for selector text - url()/content strings don't carry
// class/id tokens we care about)
function stripCssComments(s) {
  let out = "";
  let i = 0;
  while (i < s.length) {
    if (s[i] === "/" && s[i + 1] === "*") {
      let j = i + 2;
      while (j < s.length && !(s[j] === "*" && s[j + 1] === "/")) j++;
      j += 2;
      for (let k = i; k < j && k < s.length; k++) out += (s[k] === "\n") ? "\n" : " ";
      i = j;
      continue;
    }
    out += s[i]; i++;
  }
  return out;
}
const cssNoComments = stripCssComments(css);

// recursive block parser: @media/@supports recurse into their body as more
// rules; @keyframes/@font-face/@page/@-webkit-keyframes are skipped (their
// "selectors" are percentages/keywords, not class/id selectors)
function parseBlocks(src, start, end) {
  const rules = [];
  let i = start;
  while (i < end) {
    while (i < end && /\s/.test(src[i])) i++;
    if (i >= end) break;
    if (src[i] === "}") { i++; continue; }
    let j = i;
    while (j < end && src[j] !== "{" && src[j] !== ";") j++;
    if (j < end && src[j] === ";") { i = j + 1; continue; } // @import "x"; etc
    if (j >= end) break;
    const header = src.slice(i, j).trim();
    let depth = 1, k = j + 1;
    while (k < end && depth > 0) {
      if (src[k] === "{") depth++;
      else if (src[k] === "}") depth--;
      k++;
    }
    const bodyStart = j + 1, bodyEnd = k - 1;
    if (/^@(media|supports)\b/i.test(header)) {
      rules.push(...parseBlocks(src, bodyStart, bodyEnd).map((r) => ({ ...r, media: header })));
    } else if (/^@(keyframes|-webkit-keyframes|-moz-keyframes|font-face|page)\b/i.test(header)) {
      // skip - no class/id selectors inside
    } else if (header.startsWith("@")) {
      // unknown at-rule with a body (e.g. @container) - be safe, recurse
      rules.push(...parseBlocks(src, bodyStart, bodyEnd).map((r) => ({ ...r, media: header })));
    } else {
      rules.push({
        selector: header,
        selStart: i,
        declStart: bodyStart,
        declEnd: bodyEnd,
        decl: src.slice(bodyStart, bodyEnd).replace(/\s+/g, " ").trim(),
        media: null,
      });
    }
    i = k;
  }
  return rules;
}

const rules = parseBlocks(cssNoComments, 0, cssNoComments.length);

// ---- extract class/id tokens per rule ----
const tokenDefs = new Map(); // token -> [{type,file:'styles.css',line,selector}]
function addToken(type, name, rule) {
  const key = type + ":" + name;
  if (!tokenDefs.has(key)) tokenDefs.set(key, { type, name, occurrences: [] });
  tokenDefs.get(key).occurrences.push({ line: li(rule.selStart), selector: rule.selector.replace(/\s+/g, " ").trim() });
}
for (const r of rules) {
  for (const part of r.selector.split(",")) {
    // strip pseudo-classes/elements' arguments won't confuse . or # extraction
    let cm, re;
    re = /\.(-?[A-Za-z_][A-Za-zA-Z0-9_-]*)/g;
    while ((cm = re.exec(part))) addToken("class", cm[1], r);
    re = /#(-?[A-Za-z_][A-Za-zA-Z0-9_-]*)/g;
    while ((cm = re.exec(part))) addToken("id", cm[1], r);
  }
}

// ---- search files for usage ----
function stripJsComments(src) {
  const mask = L.classify(src);
  // keep code AND string content (class="" lives inside template strings),
  // drop comments only
  let out = "";
  for (let i = 0; i < src.length; i++) out += mask[i] === "#" ? (src[i] === "\n" ? "\n" : " ") : src[i];
  return out;
}
function stripHtmlComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
}

const appJs = stripJsComments(L.read("src/app.js"));
const extractJs = stripJsComments(L.read("src/extract.js"));
const indexHtml = stripHtmlComments(L.read("src/index.html"));

function usageCount(token) {
  const re = new RegExp("(?<![A-Za-z0-9_-])" + L.escapeRe(token) + "(?![A-Za-z0-9_-])", "g");
  let n = 0;
  for (const text of [appJs, extractJs, indexHtml]) {
    const m = text.match(re);
    if (m) n += m.length;
  }
  return n;
}

// dynamic-prefix heuristic: does app.js concatenate a prefix of this token?
const appJsRaw = L.read("src/app.js"); // raw, dynamic concatenation can appear near comments too but check code mainly
function prefixesOf(token) {
  const parts = token.split("-");
  const prefixes = [];
  for (let i = 1; i < parts.length; i++) prefixes.push(parts.slice(0, i).join("-"));
  return prefixes;
}
function dynamicPrefixHit(token) {
  for (const p of prefixesOf(token)) {
    const reQuotePlus = new RegExp("['\"]" + L.escapeRe(p) + "-?['\"]\\s*\\+");
    const reTemplate = new RegExp("`[^`]*" + L.escapeRe(p) + "-?\\$\\{");
    const rePlusQuote = new RegExp("\\+\\s*['\"]" + L.escapeRe(p) + "-?['\"]");
    if (reQuotePlus.test(appJsRaw) || reTemplate.test(appJsRaw) || rePlusQuote.test(appJsRaw)) return p;
  }
  return null;
}

// D158(k): nine tokens the automatic dynamic-prefix heuristic above cannot see, verified
// LIVE by V-C (audits/V-C-code.md §2) — proved in the browser, not just by reading:
//   - `.runc0`-`.runc3` (styles.css:1302-1305): app.js:6936 builds " runc"+runColor.get(id),
//     a PREFIX-PLUS-EXPRESSION the heuristic's quote/template patterns don't match (no
//     trailing hyphen before the `+`, and the prefix itself is what's concatenated).
//   - `.c1`/`.c3` (styles.css:1325/1327): app.js:6945 builds "rdot c"+runColor.get(id) —
//     same shape, one character prefix.
//   - `.libo-web`/`.libo-file`/`.libo-baked` (styles.css:2466-2468): app.js:9312 builds
//     "libchip libo-"+o where o is "web"|"file"|"baked" (bookOrigin()) — the dynamic part
//     sits INSIDE a longer class-attribute literal ("libchip libo-"), not at a bare quote
//     boundary, which the heuristic's `['"]prefix-?['"]\s*\+` pattern also misses.
// These are the newest per-book origin chips (D154(d)/D155, shipped in v1.5.7) and the
// guide/timeline run-colour dots (D130(a)/D132) — removing their selectors would strip
// live UI. Allowlisted here rather than widening the general heuristic (V-C: that would
// need brace matching and arrow-function definitions to do properly) so the 21 tokens that
// really are dead stay the ones this sweep reports.
const DYNAMIC_ALLOWLIST = new Set([
  "runc0", "runc1", "runc2", "runc3", "c1", "c3", "libo-web", "libo-file", "libo-baked",
]);

const allTokens = [...tokenDefs.values()];
const dead = [];
const possiblyDynamic = [];
for (const t of allTokens) {
  const uses = usageCount(t.name);
  if (uses === 0) {
    const dyn = dynamicPrefixHit(t.name);
    if (dyn) possiblyDynamic.push({ ...t, dynPrefix: dyn });
    else if (DYNAMIC_ALLOWLIST.has(t.name)) possiblyDynamic.push({ ...t, dynPrefix: "(allowlisted, D158k)" });
    else dead.push(t);
  }
}
dead.sort((a, b) => a.occurrences[0].line - b.occurrences[0].line);
possiblyDynamic.sort((a, b) => a.occurrences[0].line - b.occurrences[0].line);

console.log(`=== deadcss: ${allTokens.length} distinct class/id tokens found across ${rules.length} rules ===\n`);
console.log(`--- zero matches in index.html / app.js / extract.js [${dead.length}] ---`);
for (const t of dead) {
  const first = t.occurrences[0];
  const mark = t.type === "id" ? "#" : ".";
  console.log(`styles.css:${first.line}  ${mark}${t.name}  selector="${first.selector}"${t.occurrences.length > 1 ? "  (+" + (t.occurrences.length - 1) + " more rules)" : ""}`);
}

console.log(`\n--- zero direct matches, but a hyphen-prefix looks dynamically concatenated in app.js (possibly dynamic, not dead) [${possiblyDynamic.length}] ---`);
for (const t of possiblyDynamic) {
  const first = t.occurrences[0];
  console.log(`styles.css:${first.line}  ${t.type}=${t.name}  dynamic-prefix="${t.dynPrefix}"  selector="${first.selector}"`);
}

// ---- duplicate selectors with identical declarations ----
const bySelector = new Map();
for (const r of rules) {
  const key = r.selector.replace(/\s+/g, " ").trim();
  if (!bySelector.has(key)) bySelector.set(key, []);
  bySelector.get(key).push(r);
}
const dupGroups = [];
for (const [sel, list] of bySelector) {
  if (list.length < 2) continue;
  // group by identical normalized declaration text
  const byDecl = new Map();
  for (const r of list) {
    if (!byDecl.has(r.decl)) byDecl.set(r.decl, []);
    byDecl.get(r.decl).push(r);
  }
  for (const [decl, occ] of byDecl) {
    if (occ.length > 1) dupGroups.push({ selector: sel, decl, occ });
  }
}
console.log(`\n--- duplicate selectors declared more than once with IDENTICAL declarations [${dupGroups.length}] ---`);
for (const g of dupGroups) {
  const lines = g.occ.map((r) => li(r.selStart) + (r.media ? ` (in ${r.media})` : "")).join(", ");
  console.log(`"${g.selector}"  at lines: ${lines}`);
  console.log(`  decl: ${g.decl.slice(0, 140)}${g.decl.length > 140 ? "..." : ""}`);
}
