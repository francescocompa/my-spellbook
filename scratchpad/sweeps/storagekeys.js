// Sweep 4: every localStorage/sessionStorage key and IndexedDB store/key
// literal used across src/app.js and src/extract.js - where each is read,
// written, removed, and (for a versioned key) whether a migration from the
// previous version exists.
"use strict";
const L = require("./_lib.js");

const FILES = ["src/app.js", "src/extract.js"];
const fileData = {};
for (const f of FILES) {
  const src = L.read(f);
  const mask = L.classify(src);
  // comments stripped, but strings/quotes kept INTACT - every scan below needs
  // to see the actual quote characters of a string literal argument
  fileData[f] = { src, mask, code: L.commentsStripped(src, mask), li: L.lineIndex(src) };
}

// ---- 1. resolve named const/let string literals (storage-key-shaped) ----
// name -> {value, file, line}. Handles comma-separated multi-declarations
// (`const A="x", B=1, C="y";`) by walking each declarator by hand - a
// non-string declarator (a number, an expression) must not derail the scan
// of the ones that follow it in the same statement.
const constLits = {};
function skipWs(code, i) { while (i < code.length && /\s/.test(code[i])) i++; return i; }
for (const f of FILES) {
  const { code, li } = fileData[f];
  const reStart = /\b(?:const|let)\s+/g;
  let sm;
  while ((sm = reStart.exec(code))) {
    let pos = reStart.lastIndex;
    while (true) {
      pos = skipWs(code, pos);
      const idM = /^[A-Za-z_$][A-Za-zA-Z0-9_$]*/.exec(code.slice(pos));
      if (!idM) break;
      const name = idM[0];
      const nameLine = li(pos);
      pos += idM[0].length;
      pos = skipWs(code, pos);
      if (code[pos] !== "=") break; // destructuring or bare decl - stop, not a simple list
      pos++;
      pos = skipWs(code, pos);
      let value = null;
      if (code[pos] === '"' || code[pos] === "'") {
        const q = code[pos];
        let j = pos + 1;
        while (j < code.length && code[j] !== q) { if (code[j] === "\\") j++; j++; }
        value = code.slice(pos + 1, j);
        pos = j + 1;
      } else {
        // non-string value (number, identifier, expr) - skip to next top-level , or ;
        let depth = 0, j = pos;
        while (j < code.length) {
          const c = code[j];
          if ("([{".includes(c)) depth++;
          else if (")]}".includes(c)) depth--;
          else if (depth === 0 && (c === "," || c === ";")) break;
          j++;
        }
        pos = j;
      }
      if (value !== null && !constLits[name]) constLits[name] = { value, file: f, line: nameLine };
      pos = skipWs(code, pos);
      if (code[pos] === ",") { pos++; continue; }
      break; // ';' or anything else ends the declaration list
    }
  }
}

function resolveArg(argRaw) {
  const a = argRaw.trim();
  const strM = a.match(/^["'](.*)["']$/);
  if (strM) return strM[1];
  if (constLits[a]) return constLits[a].value;
  return null; // dynamic / unresolved
}

// key -> {reads:[{file,line}], writes:[...], removes:[...], kind:'localStorage'|'sessionStorage'|'idb'}
const table = new Map();
function record(key, kind, action, file, line) {
  const k = kind + "::" + key;
  if (!table.has(k)) table.set(k, { key, kind, reads: [], writes: [], removes: [] });
  const entry = table.get(k);
  if (action === "read") entry.reads.push({ file, line });
  else if (action === "write") entry.writes.push({ file, line });
  else if (action === "remove") entry.removes.push({ file, line });
}

// ---- 1b. one-hop wrapper detection: a function whose body forwards its own
// single parameter straight into localStorage.getItem/setItem/removeItem
// (e.g. `function loadJSON(k){...localStorage.getItem(k)...}`). A call site
// `loadJSON(LS_X)` elsewhere is then a read/write/remove of LS_X, but a
// direct-call regex would never see it - resolve one hop of indirection.
const wrappers = {}; // name -> {method, argIndex}
for (const f of FILES) {
  const { code } = fileData[f];
  const reFn = /\bfunction\s+([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*\(\s*([A-Za-z_$][A-Za-zA-Z0-9_$]*)\s*\)\s*\{/g;
  let fm;
  while ((fm = reFn.exec(code))) {
    const [name, param] = [fm[1], fm[2]];
    const bodyPreview = code.slice(fm.index, fm.index + 400);
    const re = new RegExp("\\b(?:localStorage|sessionStorage)\\.(getItem|setItem|removeItem)\\(\\s*" + param + "\\b");
    const wm = re.exec(bodyPreview);
    if (wm) wrappers[name] = { method: wm[1] };
  }
}
for (const f of FILES) {
  const { code, li } = fileData[f];
  for (const [wname, w] of Object.entries(wrappers)) {
    const reCall = new RegExp("\\b" + wname + "\\(\\s*([^,)]+)", "g");
    let m;
    while ((m = reCall.exec(code))) {
      const before = code.slice(Math.max(0, m.index - 10), m.index);
      if (/function\s+$/.test(before)) continue; // skip the wrapper's own `function NAME(` declaration
      const arg = m[1];
      const key = resolveArg(arg) || `<unresolved: ${arg.trim()}>`;
      const action = w.method === "getItem" ? "read" : w.method === "setItem" ? "write" : "remove";
      record(key, "localStorage(via " + wname + ")", action, f, li(m.index));
    }
  }
}

for (const f of FILES) {
  const { code, li } = fileData[f];

  // localStorage / sessionStorage .getItem/.setItem/.removeItem(arg, ...)
  const reStorage = /\b(localStorage|sessionStorage)\.(getItem|setItem|removeItem)\(\s*([^,)]+)/g;
  let m;
  while ((m = reStorage.exec(code))) {
    const kind = m[1];
    const method = m[2];
    const key = resolveArg(m[3]) || `<unresolved: ${m[3].trim()}>`;
    const action = method === "getItem" ? "read" : method === "setItem" ? "write" : "remove";
    record(key, kind, action, f, li(m.index));
  }

  // idbGet(store,key) / idbPut(store,key,val) / idbDel(store,key)
  const reIdb = /\bidb(Get|Put|Del)\(\s*([^,)]+)\s*,\s*([^,)]+)/g;
  while ((m = reIdb.exec(code))) {
    const op = m[1];
    const store = resolveArg(m[2]) || `<unresolved: ${m[2].trim()}>`;
    const key = resolveArg(m[3]) || `<unresolved: ${m[3].trim()}>`;
    const action = op === "Get" ? "read" : op === "Put" ? "write" : "remove";
    record(`${store}/${key}`, "idb", action, f, li(m.index));
  }

  // indexedDB.deleteDatabase("name") - track separately as a "remove" on the db itself
  const reDelDb = /indexedDB\.deleteDatabase\(\s*["']([^"']+)["']/g;
  while ((m = reDelDb.exec(code))) {
    record(m[1], "idb-database", "remove", f, li(m.index));
  }
}

// ---- 2. catch-all regex scan for any spellForge.*.vN literal not caught above ----
const CATCHALL_RE = /spellForge\.[A-Za-z.]+v\d+/g;
const catchallSeen = new Set([...table.values()].filter((e) => e.kind !== "idb").map((e) => e.key));
for (const f of FILES) {
  const { src, li } = fileData[f];
  let m;
  const re = new RegExp(CATCHALL_RE);
  while ((m = re.exec(src))) {
    if (!catchallSeen.has(m[0])) {
      // seen only via raw text scan, not via a getItem/setItem/removeItem call - note it
      if (!table.has("localStorage::" + m[0]) && !table.has("sessionStorage::" + m[0])) {
        record(m[0], "raw-literal", "read", f, li(m.index));
      }
    }
  }
}

// ---- 3. migration check for versioned keys ----
// group by base name (strip trailing .vN) across localStorage/sessionStorage kinds
function baseOf(key) {
  const m = key.match(/^(.*)\.v(\d+)$/);
  return m ? { base: m[1], ver: Number(m[2]) } : null;
}
const families = new Map();
for (const entry of table.values()) {
  if (entry.kind === "idb" || entry.kind === "idb-database") continue;
  const b = baseOf(entry.key);
  if (!b) continue;
  if (!families.has(b.base)) families.set(b.base, []);
  families.get(b.base).push({ ver: b.ver, entry });
}
function migrationNote(entry) {
  const b = baseOf(entry.key);
  if (!b || b.ver <= 1) return "v1 (no prior version to migrate from)";
  const prevKey = `${b.base}.v${b.ver - 1}`;
  const fam = families.get(b.base) || [];
  const hasPrev = fam.some((x) => x.ver === b.ver - 1);
  if (!hasPrev) return `no v${b.ver - 1} sibling found - can't confirm migration either way`;
  // does the writer's file mention the previous key's literal or const name nearby?
  let migrates = false;
  for (const f of FILES) {
    const { src } = fileData[f];
    if (src.includes(prevKey)) { migrates = true; break; }
  }
  return migrates ? `previous version ${prevKey} exists and is referenced somewhere - check by hand` : `previous version ${prevKey} exists but is NEVER referenced near this key - likely no migration`;
}

// ---- merge direct + one-hop-wrapper localStorage/sessionStorage entries for
// the same key into a single row - they are the same storage slot, and
// showing them split (e.g. "written here" / "read there, separately") hides
// that the key is actually both read and written.
const merged = new Map();
for (const entry of table.values()) {
  const baseKind = entry.kind.replace(/\(via [^)]+\)$/, "");
  const mk = baseKind + "::" + entry.key;
  if (!merged.has(mk)) merged.set(mk, { key: entry.key, kind: baseKind, reads: [], writes: [], removes: [] });
  const m = merged.get(mk);
  m.reads.push(...entry.reads);
  m.writes.push(...entry.writes);
  m.removes.push(...entry.removes);
}

// ---- print ----
const rows = [...merged.values()].sort((a, b) => a.kind.localeCompare(b.kind) || a.key.localeCompare(b.key));
console.log(`=== storagekeys: ${rows.length} distinct storage keys/stores found ===\n`);
const fmtLocs = (arr) => arr.length ? arr.map((x) => `${x.file}:${x.line}`).join(", ") : "-";
for (const r of rows) {
  console.log(`[${r.kind}] ${r.key}`);
  console.log(`  read:    ${fmtLocs(r.reads)}`);
  console.log(`  written: ${fmtLocs(r.writes)}`);
  console.log(`  removed: ${fmtLocs(r.removes)}`);
  if (r.kind === "localStorage" || r.kind === "sessionStorage") {
    console.log(`  version: ${migrationNote(r)}`);
  }
  if (!r.reads.length && (r.writes.length || r.removes.length)) console.log(`  ** write-only / remove-only, never read back **`);
  if (!r.writes.length && r.reads.length) console.log(`  ** read-only, never written by this code (external or legacy) **`);
  console.log("");
}
