// Drive the IN-BROWSER importer (src/extract.js) over the real mirror, exactly as an
// import does, and assert on the records Francesco says are still wrong.
const fs=require("fs"),path=require("path");
const MIRROR="/Users/francescocompagnoni/Documents/D&D/5etool_mirror/5etools-v2.33.3/data";
global.window={};
new Function(fs.readFileSync("src/extract.js","utf8"))();
const {buildDigest,slimJson,zipWanted,dropFoundryStubs,readOrder,resetFormRefs}=window.SB_extract;
const files=[];
const walk=(d,rel)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,e.name), r=rel?rel+"/"+e.name:e.name;
  if(e.isDirectory()){walk(p,r);continue;}
  if(!zipWanted(r))continue;
  let j; try{j=JSON.parse(fs.readFileSync(p,"utf8"));}catch(_){continue;}
  files.push({name:e.name,raw:dropFoundryStubs(j)});
}};
walk(MIRROR,"");
resetFormRefs();
files.sort((a,b)=>readOrder(a.name)-readOrder(b.name));
files.forEach(f=>{f.json=slimJson(f.raw);delete f.raw;});
const {digest}=buildDigest(files);
const goo=digest.subclasses.find(s=>s.shortName==="Great Old One"&&s.source==="XPHB"&&s.classSource==="XPHB");
const hex=goo&&goo.grants.fixed.find(g=>g.spell&&g.spell.name==="Hex");
const lof=digest.optfeats.find(o=>o.name==="Lessons of the First Ones");
const ago=digest.optfeats.find(o=>o.name==="Agonizing Blast"&&o.source==="XPHB");
const ss=digest.spells.filter(s=>s.name==="Synaptic Static");
const ows=digest.optfeats.find(o=>o.name==="One with Shadows"&&o.source==="XPHB");
console.log("Hex grant (GOO):", JSON.stringify(hex));
console.log("Lessons featSlots:", JSON.stringify(lof&&lof.featSlots));
console.log("Agonizing repeatable/marks:", ago&&ago.repeatable, (ago&&ago.grants.marks||[]).length);
console.log("Synaptic Static save:", ss.map(s=>s.source+"="+(s.save||[]).join(",")).join(" | "));
console.log("One with Shadows note:", ows&&ows.grants.fixed[0]&&(ows.grants.fixed[0].note||"").slice(0,60));
