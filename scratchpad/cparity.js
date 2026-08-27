// extract.js ↔ extract.py parity, driven through the REAL zip predicates.
// The earlier harness hand-rolled its own file filter and was STRICTER than
// zipWanted(), which is exactly how the spells/foundry.json bug hid for so long.
const fs=require("fs"),path=require("path");
const MIRROR=process.argv[2]||"/Users/francescocompagnoni/Documents/D&D/5etool_mirror/5etools-v2.33.3/data";
global.window={};
new Function(fs.readFileSync("src/extract.js","utf8"))();
const {buildDigest,slimJson,zipWanted,dropFoundryStubs}=window.SB_extract;
const files=[];
const walk=(d,rel)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,e.name), r=rel?rel+"/"+e.name:e.name;
  if(e.isDirectory()){walk(p,r);continue;}
  if(!zipWanted(r))continue;                      // the SAME predicate the importer uses
  let j; try{j=JSON.parse(fs.readFileSync(p,"utf8"));}catch(_){continue;}
  j=dropFoundryStubs(j);
  files.push({name:e.name,json:slimJson(j)});
}};
walk(MIRROR,"");
const {digest,report}=buildDigest(files);
const py=JSON.parse(fs.readFileSync("data/data.json","utf8"));
let fail=0;
const cmp=(label,a,b)=>{const ok=a===b;if(!ok)fail++;console.log(`${ok?"ok  ":"FAIL"} ${label}: js=${a} py=${b}`);};
cmp("spells",digest.spells.length,py.spells.length);
cmp("classes",digest.classes.length,py.classes.length);
cmp("monsters",Object.keys(digest.monsters||{}).length,Object.keys(py.monsters||{}).length);
// spot-check the record that broke: it must be whole, not a Foundry stub
const ff=digest.spells.find(s=>s.name==="Find Familiar"&&s.source==="XPHB");
const pf=py.spells.find(s=>s.name==="Find Familiar"&&s.source==="XPHB");
cmp("FindFamiliar|XPHB level",ff&&ff.level,pf&&pf.level);
cmp("FindFamiliar|XPHB creatures",ff&&(ff.creatures||[]).length,pf&&(pf.creatures||[]).length);
cmp("FindFamiliar|XPHB desc paras",ff&&(ff.desc||[]).length,pf&&(pf.desc||[]).length);
// no hollow spells anywhere
const hollow=digest.spells.filter(s=>s.level===0&&!s.school&&!(s.desc||[]).length);
cmp("hollow spell records",hollow.length,0);
const sidekicks=digest.classes.filter(c=>/ Sidekick$/.test(c.name)).length;
cmp("sidekick classes",sidekicks,0);
// ── batch 9: feat categories, category exclusivity, casting-rule mods ──────
cmp("feats",digest.feats.length,py.feats.length);
const catCount=d=>{const m={};(d.feats||[]).forEach(f=>{m[f.catName||"?"]=(m[f.catName||"?"]||0)+1;});return JSON.stringify(Object.keys(m).sort().map(k=>k+":"+m[k]));};
cmp("feat catName histogram",catCount(digest),catCount(py));
const exList=d=>(d.feats||[]).filter(f=>(f.prereqs||[]).some(b=>(b.exclusiveCat||[]).length))
  .map(f=>f.name+"|"+f.source+"|"+(f.prereqs.flatMap(b=>b.exclusiveCat||[]).join(","))).sort().join(";");
cmp("category-exclusive feats",exList(digest),exList(py));
const prqText=d=>(d.feats||[]).map(f=>f.name+"|"+f.source+"|"+(f.prereq||"")).sort().join(";");
cmp("feat prereq text",prqText(digest).length,prqText(py).length);
const modList=d=>[].concat(d.classes||[],d.subclasses||[]).filter(e=>e.castMods)
  .map(e=>(e.shortName||e.name)+"|"+e.source+"|"+e.castMods.map(m=>m.feature+"/"+m.drop+"/"+(m.when||"-")).join(","))
  .sort().join(";");
cmp("cast mods",modList(digest),modList(py));
const noteCount=d=>{let n=0;const walk=g=>{if(!g)return;["fixed","picks","expansions"].forEach(k=>(g[k]||[]).forEach(x=>{if(x.note)n++;}));
  (g.optionGroups||[]).forEach(og=>(og.options||[]).forEach(walk));};
  ["classes","subclasses","feats","races","optfeats"].forEach(a=>(d[a]||[]).forEach(e=>walk(e.grants)));return n;};
cmp("grant notes",noteCount(digest),noteCount(py));
// ── grants, record by record (the standing ⚑ in STATE's backlog) ───────────
const gkey={classes:e=>e.name+"|"+e.source,
  subclasses:e=>e.className+"|"+(e.shortName||e.name)+"|"+e.source,
  feats:e=>e.name+"|"+e.source, races:e=>e.name+"|"+e.source, optfeats:e=>e.name+"|"+e.source};
["classes","subclasses","feats","races","optfeats"].forEach(arr=>{
  const jm={},pm={};
  (digest[arr]||[]).forEach(e=>{jm[gkey[arr](e)]=JSON.stringify(e.grants||null);});
  (py[arr]||[]).forEach(e=>{pm[gkey[arr](e)]=JSON.stringify(e.grants||null);});
  const shared=Object.keys(jm).filter(k=>k in pm);
  const diff=shared.filter(k=>jm[k]!==pm[k]);
  cmp(`grants diff · ${arr} (of ${shared.length} shared)`,diff.length,0);
  if(diff.length)diff.slice(0,3).forEach(k=>console.log("     e.g.",k,"\n       js:",jm[k].slice(0,150),"\n       py:",pm[k].slice(0,150)));
  // the OTHER half of the old flag: records one side sees and the other doesn't
  const jOnly=Object.keys(jm).filter(k=>!(k in pm)), pOnly=Object.keys(pm).filter(k=>!(k in jm));
  cmp(`records only one side has · ${arr}`,jOnly.length+pOnly.length,0);
  if(jOnly.length)console.log("     js-only:",jOnly.slice(0,6).join(", "));
  if(pOnly.length)console.log("     py-only:",pOnly.slice(0,6).join(", "));
});
console.log("report:",JSON.stringify(report).slice(0,160));
process.exit(fail?1:0);
