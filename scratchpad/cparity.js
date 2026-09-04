// extract.js ↔ extract.py parity, driven through the REAL zip predicates.
// The earlier harness hand-rolled its own file filter and was STRICTER than
// zipWanted(), which is exactly how the spells/foundry.json bug hid for so long.
const fs=require("fs"),path=require("path");
const MIRROR=process.argv[2]||"/Users/francescocompagnoni/Documents/D&D/5etool_mirror/5etools-v2.33.3/data";
global.window={};
new Function(fs.readFileSync("src/extract.js","utf8"))();
const {buildDigest,slimJson,zipWanted,dropFoundryStubs,readOrder,resetFormRefs}=window.SB_extract;
const files=[];
const walk=(d,rel)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){
  const p=path.join(d,e.name), r=rel?rel+"/"+e.name:e.name;
  if(e.isDirectory()){walk(p,r);continue;}
  if(!zipWanted(r))continue;                      // the SAME predicate the importer uses
  let j; try{j=JSON.parse(fs.readFileSync(p,"utf8"));}catch(_){continue;}
  j=dropFoundryStubs(j);
  files.push({name:e.name,raw:j});
}};
walk(MIRROR,"");
// same ordering the unzip path uses, from the same exported rule: a bestiary slimmed
// before the feature file that names Imp has already dropped it (see slimJson)
resetFormRefs();
files.sort((a,b)=>readOrder(a.name)-readOrder(b.name));
files.forEach(f=>{f.json=slimJson(f.raw);delete f.raw;});
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
// The stripped PROSE, byte-identical. A tag whose display text sits in a later pipe
// segment ({@scaledamage 8d8;4d8|5-9|1d8} → "1d8") is decided by a per-tag table that
// lives in BOTH extractors, and a table that drifts prints a different number in the
// two builds — a count compare would never see it.
const proseText=d=>(d.spells||[]).map(s=>s.name+"|"+s.source+"|"
  +(s.desc||[]).join(" ")+"|"+(s.higher||[]).join(" ")).sort().join("\n");
cmp("spell prose (byte-identical)",proseText(digest)===proseText(py),true);
const scaled=d=>(d.spells||[]).filter(s=>/\d+d\d+;/.test((s.higher||[]).join(" "))).length;
cmp("higher-level lines still carrying a base-damage list",scaled(digest)+scaled(py),0);
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
// byte-identical, not merely same length — a length compare passes a reworded prereq
cmp("feat prereq text (byte-identical)",prqText(digest)===prqText(py),true);
const modList=d=>[].concat(d.classes||[],d.subclasses||[]).filter(e=>e.castMods)
  .map(e=>(e.shortName||e.name)+"|"+e.source+"|"+e.castMods.map(m=>m.feature+"/"+m.drop+"/"+(m.when||"-")).join(","))
  .sort().join(";");
cmp("cast mods",modList(digest),modList(py));
const noteCount=d=>{let n=0;const walk=g=>{if(!g)return;["fixed","picks","expansions"].forEach(k=>(g[k]||[]).forEach(x=>{if(x.note)n++;}));
  (g.optionGroups||[]).forEach(og=>(og.options||[]).forEach(walk));};
  ["classes","subclasses","feats","races","optfeats"].forEach(a=>(d[a]||[]).forEach(e=>walk(e.grants)));return n;};
cmp("grant notes",noteCount(digest),noteCount(py));
// ── grants, record by record (the standing ⚑ in STATE's backlog) ───────────
// NOTE (D127): the subclass key MUST carry classSource. 5etools emits every classic
// subclass twice — once on its 2014 class, once as a `_copy` twin re-attached to the 2024
// class — and the two differ ONLY in classSource. Keyed without it, 124 of 322 records
// collided and were never diffed (the last one written won), which is how the hollow
// unresolved-`_copy` twins hid. Never narrow this key again.
const gkey={classes:e=>e.name+"|"+e.source,
  subclasses:e=>e.className+"|"+e.classSource+"|"+(e.shortName||e.name)+"|"+e.source,
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
// ── spell ACCESS, record by record ─────────────────────────────────────────
// This harness diffed grants but never who can CAST a spell, which is how a broken
// importer lookup hid: spells/sources.json (lookup-shaped, ORIGINAL case) overwrote the
// generated lookup (lowercase), so every zip import produced 936 spells no class could
// reach while every grant still diffed clean. Access is the other half of the digest.
{
  const skey=s=>String(s.name).toLowerCase()+"|"+String(s.source).toLowerCase();
  const acc=s=>JSON.stringify(["cls","sub","feat","race"].map(f=>(s[f]||[]).map(x=>x.map(String)).sort()));
  const jm={},pm={};
  (digest.spells||[]).forEach(s=>{jm[skey(s)]=acc(s);});
  (py.spells||[]).forEach(s=>{pm[skey(s)]=acc(s);});
  const shared=Object.keys(jm).filter(k=>k in pm);
  const diff=shared.filter(k=>jm[k]!==pm[k]);
  cmp(`spell access diff (of ${shared.length} shared)`,diff.length,0);
  if(diff.length)diff.slice(0,3).forEach(k=>console.log("     e.g.",k,"\n       js:",jm[k].slice(0,150),"\n       py:",pm[k].slice(0,150)));
  // the absolute guard: if the lookup is ever clobbered again this goes to ~0
  const withCls=(digest.spells||[]).filter(s=>s.cls&&s.cls.length).length;
  const pyCls=(py.spells||[]).filter(s=>s.cls&&s.cls.length).length;
  cmp("spells with class access",withCls,pyCls);
}
// forms a FEATURE adds to a spell: the newest hand-parsed field, and the one most likely
// to drift between the two extractors (each has its own walker and its own sentence split)
{
  const fm=d=>[].concat(d.optfeats||[],d.feats||[])
    .filter(x=>x.forms&&x.forms.length)
    .map(x=>x.name+"|"+x.source+"→"+JSON.stringify(x.forms)).sort().join(";");
  const jf=fm(digest), pf=fm(py);
  cmp("feature form grants",jf.length,pf.length);
  if(jf!==pf){fail++;console.log("FAIL form grants differ\n  js:",jf.slice(0,220),"\n  py:",pf.slice(0,220));}
  else console.log("ok   form-grant records:",jf?jf.split(";").length:0);
}
// ── whole-record diff — every array, every field (audit 2026-08-28) ────────
// The curated checks above catch the drift classes that have already bitten (grants,
// access, forms, prereqs); this one catches the NEXT one — monster text, spell scalars,
// casting fields — without naming it in advance. Canonical form: keys sorted,
// `undefined` ≡ absent (structured clone keeps it, JSON drops it — the app reads both
// the same), and extract.py's own `srd` output field (it powers the SRD subset; the
// importer has no use for it) skipped.
{
  const canon=v=>{ if(Array.isArray(v))return "["+v.map(x=>x===undefined?"null":canon(x)).join(",")+"]";
    if(v&&typeof v==="object")return "{"+Object.keys(v).filter(k=>k!=="srd"&&v[k]!==undefined).sort()
      .map(k=>JSON.stringify(k)+":"+canon(v[k])).join(",")+"}";
    return JSON.stringify(v); };
  const showDiff=(k,a,b)=>{let i=0;while(i<a.length&&a[i]===b[i])i++;
    console.log("     e.g.",k,"@"+i,"\n       js:",a.slice(Math.max(0,i-40),i+120),"\n       py:",b.slice(Math.max(0,i-40),i+120));};
  const rkey={spells:s=>String(s.name).toLowerCase()+"|"+String(s.source).toLowerCase(),
    classes:e=>e.name+"|"+e.source,
    subclasses:e=>e.className+"|"+e.classSource+"|"+(e.shortName||e.name)+"|"+e.source,  // D127: classSource, see gkey
    feats:e=>e.name+"|"+e.source,races:e=>e.name+"|"+e.source,optfeats:e=>e.name+"|"+e.source};
  Object.keys(rkey).forEach(arr=>{
    const jm={},pm={};
    (digest[arr]||[]).forEach(e=>{jm[rkey[arr](e)]=canon(e);});
    (py[arr]||[]).forEach(e=>{pm[rkey[arr](e)]=canon(e);});
    const shared=Object.keys(jm).filter(k=>k in pm);
    const diff=shared.filter(k=>jm[k]!==pm[k]);
    cmp(`whole-record diff · ${arr} (of ${shared.length})`,diff.length,0);
    if(diff.length)diff.slice(0,3).forEach(k=>showDiff(k,jm[k],pm[k]));
  });
  const jm={},pm={};
  Object.entries(digest.monsters||{}).forEach(([k,v])=>{jm[k]=canon(v);});
  Object.entries(py.monsters||{}).forEach(([k,v])=>{pm[k]=canon(v);});
  const shared=Object.keys(jm).filter(k=>k in pm);
  const diff=shared.filter(k=>jm[k]!==pm[k]);
  cmp(`whole-record diff · monsters (of ${shared.length})`,diff.length,0);
  if(diff.length)diff.slice(0,3).forEach(k=>showDiff(k,jm[k],pm[k]));
  // D148: `conditions` is a second top-level MAP, and a map with no check is exactly the
  // shape that let the lookup clobber and the foundry stubs hide (D82 · D91). Same
  // canonical whole-record diff, plus the census — an extractor that silently stopped
  // reading conditionsdiseases.json would otherwise still pass every other line here.
  const jc={},pc={};
  Object.entries(digest.conditions||{}).forEach(([k,v])=>{jc[k]=canon(v);});
  Object.entries(py.conditions||{}).forEach(([k,v])=>{pc[k]=canon(v);});
  cmp("conditions",Object.keys(jc).length,Object.keys(pc).length);
  const csh=Object.keys(jc).filter(k=>k in pc);
  const cdiff=csh.filter(k=>jc[k]!==pc[k]);
  cmp(`whole-record diff · conditions (of ${csh.length})`,cdiff.length,0);
  if(cdiff.length)cdiff.slice(0,3).forEach(k=>showDiff(k,jc[k],pc[k]));
  cmp("conditions only one side has",
      Object.keys(jc).filter(k=>!(k in pc)).length+Object.keys(pc).filter(k=>!(k in jc)).length,0);
}
// ── D127: `_copy` resolution + the reprint pointer ─────────────────────────
// 5etools re-attaches every classic subclass to its 2024 class as a `_copy` record. Left
// unresolved those twins are HOLLOW — no grants, no caster progression, no reprint flag —
// and they win the SUB_BY collision, which is how every 2014 subclass came to grant
// nothing. These four checks fail the moment a resolver regresses on either side.
{
  const gcount=g=>{ if(!g)return 0; let n=(g.fixed||[]).length+(g.picks||[]).length+(g.expansions||[]).length;
    (g.optionGroups||[]).forEach(og=>(og.options||[]).forEach(o=>{n+=gcount(o);}));return n; };
  const zero=d=>(d.subclasses||[]).filter(s=>gcount(s.grants)===0).length;
  cmp("subclasses with NO grants",zero(digest),zero(py));
  // every reprinted record must carry a pointer, on both sides — `reprintedAs` has TWO
  // shapes (a bare uid string and {uid,tag}) and missing one silently drops the pointer
  const ptr=d=>["spells","classes","subclasses","feats","races","optfeats"]
    .map(a=>a+":"+(d[a]||[]).filter(e=>e.reprinted).length+"/"+(d[a]||[]).filter(e=>e.supersededBy).length).join(" ");
  cmp("reprinted/supersededBy per array",ptr(digest),ptr(py));
  const noPtr=d=>["spells","classes","subclasses","feats","races","optfeats"]
    .reduce((n,a)=>n+(d[a]||[]).filter(e=>e.reprinted&&!e.supersededBy).length,0);
  cmp("reprinted records with no pointer",noPtr(digest)+noPtr(py),0);
  // the named case from the investigation: the twin on the 2024 chassis is whole
  const am=a=>a.find(s=>s.shortName==="Aberrant Mind"&&s.source==="TCE"&&s.classSource==="XPHB");
  const aj=am(digest.subclasses),ap=am(py.subclasses);
  cmp("AberrantMind|TCE on Sorcerer|XPHB grants",aj&&gcount(aj.grants),ap&&gcount(ap.grants));
  cmp("AberrantMind|TCE on Sorcerer|XPHB grants > 0",!!(aj&&gcount(aj.grants)>0),true);
  cmp("AberrantMind|TCE on Sorcerer|XPHB supersededBy",aj&&aj.supersededBy,ap&&ap.supersededBy);
  // the `_mod` tripwire: 0 today, and the importer must SAY SO rather than half-merge
  const mods=(report.errors||[]).filter(e=>/left unresolved/.test(e));
  cmp("unresolved _copy records (js)",mods.length,0);
  if(mods.length)mods.slice(0,5).forEach(m=>console.log("     ",m));
}
// ── D130: the spell list a subclass-provided spellcasting draws from ───────
// A subclass with its own `casterProgression` supplies the WHOLE of a character's
// spellcasting, so it has to name a class list. Both extractors derive it from the
// subclass's own `grants.expansions` filters instead of the old hardcoded
// ["Wizard","XPHB"]. Three checks:
//   • the per-record census matches between the two extractors (drift guard);
//   • the census matches a PINNED literal — a mirror update that adds a casting subclass,
//     renames one, or stops naming its list fails HERE rather than silently reaching a
//     Wizard default in the app;
//   • nothing derived to null, on either side (the tripwire's resting state).
{
  const census=d=>(d.subclasses||[]).filter(s=>"spellList"in s)
    .map(s=>s.className+"|"+(s.classSource||"")+"::"+(s.shortName||s.name)+"|"+s.source
          +"="+(s.spellList?s.spellList[0]+"|"+s.spellList[1]:"NULL"))
    .sort().join("; ");
  const jc=census(digest), pc=census(py);
  cmp("subclass spell lists (js vs py)",jc,pc);
  // 5etools v2.33.3: Eldritch Knight + Arcane Trickster, 2014 + 2024, 6 records after
  // `_copy` resolution, all Wizard. Update this literal ONLY with the census extract.py
  // prints, and only after checking the new record really does cast from that list.
  const PINNED=[
    "Fighter|PHB::Eldritch Knight|PHB=Wizard|PHB",
    "Fighter|XPHB::Eldritch Knight|PHB=Wizard|XPHB",
    "Fighter|XPHB::Eldritch Knight|XPHB=Wizard|XPHB",
    "Rogue|PHB::Arcane Trickster|PHB=Wizard|PHB",
    "Rogue|XPHB::Arcane Trickster|PHB=Wizard|XPHB",
    "Rogue|XPHB::Arcane Trickster|XPHB=Wizard|XPHB",
  ].join("; ");
  cmp("subclass spell lists (pinned census)",jc,PINNED);
  if(jc!==PINNED)console.log("     mirror coverage changed — extract.py prints the new census");
  const nulls=d=>(d.subclasses||[]).filter(s=>"spellList"in s&&!s.spellList).length;
  cmp("subclasses that cast but derive NO list",nulls(digest)+nulls(py),0);
  const noList=(report.errors||[]).filter(e=>/names no class list/.test(e));
  cmp("D130 unresolved-list reports (js)",noList.length,0);
  if(noList.length)noList.slice(0,5).forEach(m=>console.log("     ",m));
  // every caster subclass must HAVE the field: the field's absence is what used to make a
  // row silently read as a non-caster, and the app now branches on it
  const casters=d=>(d.subclasses||[]).filter(s=>s.caster).length;
  const fielded=d=>(d.subclasses||[]).filter(s=>"spellList"in s).length;
  cmp("caster subclasses carry a spellList field",casters(digest)+"/"+fielded(digest),
      casters(py)+"/"+fielded(py));
  cmp("caster subclasses (pinned count)",casters(digest),6);
}
// ── digest.sources: the book registry (D33/D92/D113), folded in from cparity-sources.js
// (D158(k)) — never diffed above. extract.js's digest carries NO parser/parsedAt/origin
// stamps (those are app.js-side, added at Apply — D138/D155(e)), so this compares only the
// fields BOTH extractors actually derive: name, group, counts.
{
  const canon=v=>{ if(Array.isArray(v))return "["+v.map(x=>x===undefined?"null":canon(x)).join(",")+"]";
    if(v&&typeof v==="object")return "{"+Object.keys(v).filter(k=>v[k]!==undefined).sort()
      .map(k=>JSON.stringify(k)+":"+canon(v[k])).join(",")+"}";
    return JSON.stringify(v); };
  cmp("sources: book count",Object.keys(digest.sources||{}).length,Object.keys(py.sources||{}).length);
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
  const appjs=fs.readFileSync("src/app.js","utf8");
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
console.log("report:",JSON.stringify(report).slice(0,160));
process.exit(fail?1:0);
