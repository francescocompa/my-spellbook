// C3 audit finding: every ingestion path that stages files for import must call
// `slimJson()` on each file — and `slimJson()` filters a bestiary file's monsters through
// `carriedMonster()`, which depends on `FORM_REFS` (the set of monster names/keys a FEATURE's
// prose names as a spell's form — Pact of the Chain's Imp, Strixhaven's Mascot). FORM_REFS is
// built incrementally as files stream in, so a batch must (a) call `resetFormRefs()` once at
// the start, so a PREVIOUS import's state can't leak in or mask a bug in this one, and
// (b) process files in `readOrder()` — feature files (optionalfeatures.json/feats.json)
// before any bestiary file — or a bestiary read first slims away the Imp/Mascot before the
// feature that names them has been scanned. `unzipJsonFiles` (extract.js), `webFetchAll` and
// `stageScanBooks` (app.js) all do both. `stageFiles()` — the "Upload .json files" / drag-drop
// path for individual (non-zip) files — does neither: it calls `slimJson()` per file inside
// independent `FileReader.onload` callbacks with no ordering and no `resetFormRefs()` call.
// See audits/C3-data-pipeline.md finding C3-01 for the full writeup and a browser repro.
//
// This script does not reproduce the bug (that needs the browser — FileReader, drag/drop).
// It statically proves the INVARIANT: any function whose body calls `slimJson(` must also
// call `resetFormRefs(` somewhere in that same body. It will FAIL today on `stageFiles`,
// which is expected until the finding is fixed — that failure is what makes this check worth
// having: run it after any change to the import-staging functions in src/app.js.
const fs=require("fs"),path=require("path");
const ROOT=path.join(__dirname,"..");
const src=fs.readFileSync(path.join(ROOT,"src/app.js"),"utf8");
const lines=src.split("\n");

// every top-level function in app.js that calls slimJson at all — found textually, not by
// a name list, so a NEW ingestion path added later is caught automatically.
const starts=[];
lines.forEach((l,i)=>{
  const m=/^(?:async )?function (\w+)\(/.exec(l);
  if(m)starts.push({name:m[1],line:i});
});
const bodyOf=idx=>{
  const from=starts[idx].line, to=(idx+1<starts.length)?starts[idx+1].line:lines.length;
  return lines.slice(from,to).join("\n");
};

let fail=0;
const checked=[];
starts.forEach((s,i)=>{
  const body=bodyOf(i);
  if(!/slimJson\(/.test(body))return;
  const hasReset=/resetFormRefs\(/.test(body);
  checked.push(s.name);
  const ok=hasReset;
  if(!ok)fail++;
  console.log(`${ok?"ok  ":"FAIL"} ${s.name} (line ${s.line+1}): calls slimJson() ${hasReset?"and resetFormRefs()":"WITHOUT resetFormRefs() in the same function"}`);
});
if(!checked.length){console.log("FAIL: no function in src/app.js calls slimJson() — the check itself is stale");fail++;}
console.log(fail?`\n${fail} function(s) stage files without resetting FORM_REFS first — see C3-01.`
  :"\nEvery slimJson() caller also resets FORM_REFS first.");
process.exit(fail?1:0);
