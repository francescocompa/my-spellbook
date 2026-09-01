// C3 audit finding: cparity.js diffs every content array (spells/classes/subclasses/feats/
// races/optfeats/monsters/conditions) whole-record, but never touches `digest.sources` (the
// book registry DATA.sources is built from — D33/D92/D113 all depend on it) and never checks
// that app.js's own hardcoded FULL_MC/PACT slot tables still match extract.py's copy (the
// digest extract.js emits carries neither field — see "the FULL_MC/PACT triplication" finding
// in audits/C3-data-pipeline.md). This script closes both gaps using the SAME real predicates
// cparity.js drives — it is not a second implementation, it is the same harness with a wider
// checklist. Run it the same way: `node scratchpad/cparity-sources.js [mirror-path]`.
const fs=require("fs"),path=require("path");
const MIRROR=process.argv[2]||"/Users/francescocompagnoni/Documents/D&D/5etool_mirror/5etools-v2.33.3/data";
const ROOT=path.join(__dirname,"..");
global.window={};
new Function(fs.readFileSync(path.join(ROOT,"src/extract.js"),"utf8"))();
const {buildDigest,slimJson,zipWanted,dropFoundryStubs,readOrder,resetFormRefs}=window.SB_extract;

const files=[];
const walk=(d,rel)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,e.name), r=rel?rel+"/"+e.name:e.name;
  if(e.isDirectory()){walk(p,r);continue;}
  if(!zipWanted(r))continue;
  let j; try{j=JSON.parse(fs.readFileSync(p,"utf8"));}catch(_){continue;}
  j=dropFoundryStubs(j);
  files.push({name:e.name,raw:j});
}};
walk(MIRROR,"");
resetFormRefs();
files.sort((a,b)=>readOrder(a.name)-readOrder(b.name));
files.forEach(f=>{f.json=slimJson(f.raw);delete f.raw;});
const {digest}=buildDigest(files);
const py=JSON.parse(fs.readFileSync(path.join(ROOT,"data/data.json"),"utf8"));

let fail=0;
const cmp=(label,a,b)=>{const ok=a===b;if(!ok)fail++;console.log(`${ok?"ok  ":"FAIL"} ${label}: js=${a} py=${b}`);};
const canon=v=>{ if(Array.isArray(v))return "["+v.map(x=>x===undefined?"null":canon(x)).join(",")+"]";
  if(v&&typeof v==="object")return "{"+Object.keys(v).filter(k=>v[k]!==undefined).sort()
    .map(k=>JSON.stringify(k)+":"+canon(v[k])).join(",")+"}";
  return JSON.stringify(v); };

// ── digest.sources: the book registry (D33/D92/D113), never diffed by cparity.js ──────────
// extract.js's digest carries NO parser/parsedAt/origin stamps (those are app.js-side, added
// at Apply — D138/D155(e)), so this compares only the fields BOTH extractors actually derive:
// name, group, counts.
cmp("sources: book count",Object.keys(digest.sources||{}).length,Object.keys(py.sources||{}).length);
{
  const strip=s=>({name:s.name,group:s.group,counts:s.counts});
  const jm={},pm={};
  Object.entries(digest.sources||{}).forEach(([k,v])=>{jm[k]=canon(strip(v));});
  Object.entries(py.sources||{}).forEach(([k,v])=>{pm[k]=canon(strip(v));});
  const shared=Object.keys(jm).filter(k=>k in pm);
  const diff=shared.filter(k=>jm[k]!==pm[k]);
  cmp(`sources: whole-record diff (of ${shared.length} shared)`,diff.length,0);
  if(diff.length)diff.slice(0,5).forEach(k=>console.log("     e.g.",k,"\n       js:",jm[k],"\n       py:",pm[k]));
  const jOnly=Object.keys(jm).filter(k=>!(k in pm)), pOnly=Object.keys(pm).filter(k=>!(k in jm));
  cmp("sources: records only one side has",jOnly.length+pOnly.length,0);
  if(jOnly.length)console.log("     js-only:",jOnly.join(", "));
  if(pOnly.length)console.log("     py-only:",pOnly.join(", "));
}

// ── FULL_MC / PACT: a THIRD copy lives in app.js (D93 comment: "Slot tables are rules, not
// content, so they live here"). extract.js's digest never carries them at all; app.js falls
// back to its own hardcoded constants whenever the active digest layer doesn't supply them
// (assembleData: `base.fullMc||FULL_MC`). If extract.py's copy and app.js's copy ever drift,
// nothing catches it — cparity.js never looks at app.js, and app.js's own constants never
// touch data.json. This pulls app.js's two consts out by source text and diffs them against
// extract.py's data.json output, which is the only other place these numbers are typed in.
{
  const appjs=fs.readFileSync(path.join(ROOT,"src/app.js"),"utf8");
  const grab=name=>{
    const m=appjs.match(new RegExp("const "+name+"=(\\[[\\s\\S]*?\\]);"));
    if(!m)return null;
    // eslint-disable-next-line no-eval
    return eval(m[1]);
  };
  const appFullMc=grab("FULL_MC"), appPact=grab("PACT");
  cmp("app.js FULL_MC found",!!appFullMc,true);
  cmp("app.js PACT found",!!appPact,true);
  if(appFullMc)cmp("FULL_MC: app.js vs extract.py data.json",JSON.stringify(appFullMc),JSON.stringify(py.fullMc));
  if(appPact)cmp("PACT: app.js vs extract.py data.json",JSON.stringify(appPact),JSON.stringify(py.pact));
}

process.exit(fail?1:0);
