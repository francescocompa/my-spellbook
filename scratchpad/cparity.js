// extract.js ↔ extract.py parity, driven through the REAL zip predicates.
// The earlier harness hand-rolled its own file filter and was STRICTER than
// zipWanted(), which is exactly how the spells/foundry.json bug hid for so long.
const fs=require("fs"),path=require("path");
const MIRROR=process.argv[2]||"/Users/francescocompagnoni/Documents/D&D/5etool_mirror/5etools-src-2.29.0/data";
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
console.log("report:",JSON.stringify(report).slice(0,160));
process.exit(fail?1:0);
