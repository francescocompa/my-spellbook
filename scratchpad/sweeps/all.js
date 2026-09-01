// Runs all five L0 sweeps in order and prints a one-line summary count for
// each. Always exits 0 - these are reports, not a pass/fail gate.
"use strict";
const { execFileSync } = require("child_process");

const SWEEPS = ["deadfns.js", "deadcss.js", "dupfns.js", "storagekeys.js", "handlers.js"];
const COUNT_PATTERNS = {
  "deadfns.js": [/^TOTAL dead \(zero refs\): (\d+)/m, /^TOTAL string-only wired: (\d+)/m],
  "deadcss.js": [/zero matches in index\.html.*\[(\d+)\]/, /possibly dynamic.*\[(\d+)\]/, /IDENTICAL declarations \[(\d+)\]/],
  "dupfns.js": [/exact duplicate bodies.*\[(\d+) groups\]/, /near-duplicate bodies.*\[(\d+) pairs\]/],
  "storagekeys.js": [/^=== storagekeys: (\d+) distinct storage keys\/stores found ===/],
  "handlers.js": [/\[(\d+) findings\]/g, /\[(\d+) occurrences\]/g],
};

console.log("=== L0 sweep summary ===\n");
for (const s of SWEEPS) {
  let out = "";
  try {
    out = execFileSync("node", [__dirname + "/" + s], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  } catch (e) {
    console.log(`${s}: ERROR running sweep - ${e.message}`);
    continue;
  }
  const nums = [];
  for (const pat of COUNT_PATTERNS[s]) {
    if (pat.global) {
      let m; const g = new RegExp(pat);
      while ((m = g.exec(out))) nums.push(m[1]);
    } else {
      const m = out.match(pat);
      if (m) nums.push(m[1]);
    }
  }
  console.log(`${s}: ${nums.join(" / ")}  (counts in file order; see audits/L0-sweeps.md for labels)`);
}
console.log("\nDone. Full output per sweep: node scratchpad/sweeps/<name>.js");
process.exit(0);
