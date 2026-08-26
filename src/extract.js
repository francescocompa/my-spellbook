"use strict";
// ── extract.js — in-browser port of extract.py ──────────────────────────────
// Turns raw 5etools JSON files into the same digest shape data.json carries, so
// the app can load/refresh content at runtime instead of only from the bundle.
// Exposes window.SB_extract.buildDigest(files) where files = [{name, json}].
(function(){
const SCHOOL={A:"Abjuration",C:"Conjuration",D:"Divination",E:"Enchantment",
  V:"Evocation",I:"Illusion",N:"Necromancy",T:"Transmutation",P:"Psionic"};
const SLOT_LEVEL_KEY={s6:11,s7:13,s8:15,s9:17};
const RECHARGE={will:"at will",daily:"per long rest",rest:"per short rest",resource:"per resource"};

function richStrip(s){ if(typeof s!=="string")return s;
  const repl=m=>{const body=m.slice(2,-1);const sp=body.indexOf(" ");
    const rest=sp>=0?body.slice(sp+1):"";const segs=rest.split("|");
    return (segs[0]&&segs[0].trim())?segs[0].trim():rest;};
  let prev=null,out=s;
  while(prev!==out){prev=out;out=out.replace(/\{@[^{}]+\}/g,repl);}
  return out; }
function titleCase(s){return s.replace(/\b\w/g,c=>c.toUpperCase());}

function castTime(sp){const t=(sp.time&&sp.time[0])||{};const n=t.number==null?1:t.number,u=t.unit||"action";
  if(u==="action")return["action","action"];if(u==="bonus")return["bonus action","bonus"];
  if(u==="reaction")return["reaction","reaction"];
  return [`${n} ${u}`+(n!==1?"s":""),"long"];}
function rangeStr(sp){const r=sp.range||{};const typ=r.type,dist=r.distance||{};
  if(typ==="point"){const dt=dist.type;
    if(dt==="self")return["Self","self"];if(dt==="touch")return["Touch","touch"];
    if(dt==="feet"||dt==="miles")return[`${dist.amount||""} ${dt}`,"ranged"];
    if(dt==="sight")return["Sight","ranged"];if(dt==="unlimited")return["Unlimited","ranged"];
    return[dt||"—","ranged"];}
  // 2024 renamed the self-centred shapes; "emanation" is the common one
  if(["radius","sphere","cone","line","cube","hemisphere","cylinder","emanation"].includes(typ))
    return[`Self (${dist.amount||""} ft ${typ})`,"self"];
  if(typ==="special")return["Special","special"];
  if(typ==="sight")return["Sight","ranged"];
  if(typ==="unlimited")return["Unlimited","ranged"];
  return[typ||"—","ranged"];}
function components(sp){const c=sp.components||{};const m=c.m;
  const mat=(m&&typeof m==="object")?m.text:(typeof m==="string"?m:null);
  // cost is in copper pieces; consume is true / "optional" when the spell eats the material
  const md=(m&&typeof m==="object")?m:{};
  return {v:!!c.v,s:!!c.s,m:!!m,mat:mat?richStrip(mat):null,cost:md.cost||null,consume:md.consume||false};}
function durationText(sp){const d=(sp.duration&&sp.duration[0])||{};const t=d.type;
  if(t==="instant")return"Instantaneous";
  if(t==="permanent")return"Until dispelled"+(((d.ends||[]).includes("trigger"))?"/triggered":"");
  if(t==="special")return"Special";
  if(t==="timed"){const dd=d.duration||{};return `${dd.amount||""} ${dd.type||""}`+((dd.amount||0)!==1?"s":"");}
  return"—";}
// `strip` swaps the tag-stripper: stat blocks need sbText, which expands the tags
// that carry their meaning in the tag NAME ({@h}, {@atkr}, {@actSave}).
function flattenEntries(entries,strip){const out=[];strip=strip||richStrip;
  (entries||[]).forEach(e=>{
    if(typeof e==="string")out.push(strip(e));
    else if(e&&typeof e==="object"){
      if(e.name)out.push(strip(e.name)+".");
      flattenEntries(e.entries,strip).forEach(x=>out.push(x));
      (e.items||[]).forEach(it=>{
        if(typeof it==="string")out.push("• "+strip(it));
        else if(it&&typeof it==="object")out.push("• "+strip(it.name||"")+" "+flattenEntries(it.entries||(it.entry?[it.entry]:[]),strip).join(" "));});
    }});
  return out.filter(Boolean);}
const uniqSort=a=>[...new Set(a||[])].sort();
const spellKey=(n,s)=>`${String(n).toLowerCase()}|${String(s).toLowerCase()}`;
const reprinted=o=>!!(o&&o.reprintedAs);

// additionalSpells parsing ---------------------------------------------------
function parseChoose(choose){
  if(choose&&typeof choose==="object")choose=choose.choose!=null?choose.choose:choose;
  if(typeof choose!=="string")return{choice:true,desc:"a spell",filter:{}};
  const filt={};choose.split("|").forEach(part=>{const i=part.indexOf("=");if(i>=0)filt[part.slice(0,i).trim()]=part.slice(i+1).trim();});
  const schools="school"in filt?filt.school.split(/[;,]/).map(x=>SCHOOL[x.trim().toUpperCase()]||x).join("/"):"";
  const classes="class"in filt?filt.class.split(/[;,]/).map(x=>x.trim()).join("/"):"";
  if(filt.level==="0"){            // a cantrip pick reads as English, not as a filter
    const qual=[schools,classes].filter(Boolean).join(" ");
    return{choice:true,filter:filt,desc:"a "+(qual?qual+" ":"")+"cantrip"};}
  const bits=[];
  if("level"in filt)bits.push("level "+filt.level);
  if(schools)bits.push(schools);
  if(classes)bits.push(classes+" list");
  return{choice:true,desc:bits.length?"choose "+bits.join(", "):"a spell",filter:filt};}
function spellRef(s){
  if(s&&typeof s==="object")return "choose"in s?parseChoose(s.choose):parseChoose(s);
  s=String(s).split("#")[0];const name=s.split("|")[0];
  const src=s.indexOf("|")>=0?s.split("|")[1].toUpperCase():"";
  return{choice:false,name:(name===name.toLowerCase()?titleCase(name):name),source:src};}
function chooseFilter(choose){let count=1;
  if(choose&&typeof choose==="object"){count=choose.count||1;choose=choose.choose||"";}
  const filt={};if(typeof choose==="string")choose.split("|").forEach(part=>{const i=part.indexOf("=");if(i>=0)filt[part.slice(0,i).trim()]=part.slice(i+1).trim();});
  return[filt,count];}
// ── feature-name resolution (mirror of extract.py) ─────────────────────────
// additionalSpells blocks rarely carry a name; the granting feature is detailed in
// subclass/class feature entries. Index those and match each grant back to its feature.
function walkText(e,out){ if(typeof e==="string")out.push(e);
  else if(Array.isArray(e))e.forEach(x=>walkText(x,out));
  else if(e&&typeof e==="object")["entries","entry","items","rows","row"].forEach(k=>walkText(e[k],out)); }
function chooseKv(s){ if(s&&typeof s==="object")s=s.choose!=null?s.choose:"";
  const kv=[]; String(s).split("|").forEach(p=>{const i=p.indexOf("=");if(i>=0)kv.push([p.slice(0,i).trim(),p.slice(i+1).trim()]);});
  return kv.sort((a,b)=>a[0]<b[0]?-1:1).map(x=>x[0]+"="+x[1]).join("|"); }
// D79 — a feature often changes HOW you cast the spell it grants ("without expending a
// spell slot", "you automatically succeed on the save"). 5etools carries none of that
// structurally, so the sentences that say it become a note on the grant. Deliberately
// NARROW: "you always have these prepared" is what "Always prepared" already means here.
// **Keep identical to extract.py's MOD_RE.**
const MOD_RE=/without expending|no spell slot|automatically succeed|can'?t do so|can'?t (?:cast|use) it (?:this way|in this way)|once you cast|twice without|as part of the same/i;
function modNote(txt){
  const keep=String(txt||"").split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(x=>x&&MOD_RE.test(x));
  return keep.length?richStrip(keep.join(" ")):null;}
function featRecord(f){ const buf=[]; walkText(f.entries,buf); const txt=buf.join(" "),low=txt.toLowerCase();
  const spells=new Set(); let m; const rs=/\{@spell ([^}]+)\}/g; while((m=rs.exec(txt)))spells.add(m[1].split("|")[0].trim().toLowerCase());
  const filters=new Set(); const rf=/\{@filter [^|}]*\|([^}]+)\}/g;
  while((m=rf.exec(txt))){const kv=[];m[1].split("|").forEach(p=>{const i=p.indexOf("=");if(i>=0)kv.push([p.slice(0,i).trim(),p.slice(i+1).trim()]);});
    if(kv.length)filters.add(kv.sort((a,b)=>a[0]<b[0]?-1:1).map(x=>x[0]+"="+x[1]).join("|"));}
  const grants=(low.indexOf("spellbook")>=0&&low.indexOf("add")>=0)||low.indexOf("always have")>=0||low.indexOf("have the following")>=0||filters.size>0||spells.size>0||String(f.name||"").toLowerCase().indexOf("spell")>=0;
  return {name:f.name,level:f.level,spells,filters,grants:!!grants,note:modNote(txt)}; }
function resolveFeatureRec(feats,at,s){ if(!feats||!feats.length)return null;
  const gf=feats.filter(f=>f.grants); if(!gf.length)return null;
  const same=gf.filter(f=>f.level===at);
  if(s&&typeof s==="object"&&"choose"in s){ const kv=chooseKv(s.choose);
    for(const f of same.concat(gf)) if(f.filters.has(kv))return f;
    if(same.length===1)return same[0];
  } else { const sn=typeof s==="string"?s.split("#")[0].split("|")[0].trim().toLowerCase():"";
    for(const f of same.concat(gf)) if(sn&&f.spells.has(sn))return f;
    if(same.length===1)return same[0]; }
  if(gf.length===1)return gf[0]; return null; }
function resolveFeature(feats,at,s){const r=resolveFeatureRec(feats,at,s);return r?r.name:null;}
function addSpellEntry(bucket,kind,at,recharge,s,feature,feats){
  const ref=spellRef(s); let note=null;
  if(feats!=null){const fr=resolveFeatureRec(feats,at,s);
    if(fr){ if(feature==null)feature=fr.name; note=fr.note; }}
  if(ref.choice){const fc=chooseFilter(s);
    const e={kind,atLevel:at,recharge,count:fc[1],filter:fc[0],desc:ref.desc,feature};
    if(note)e.note=note; bucket.picks.push(e);}
  else {const e={kind,atLevel:at,recharge,spell:ref,feature}; if(note)e.note=note; bucket.fixed.push(e);}}
// ---- prose-only grants (D79) ---------------------------------------------
// Features that grant spells in PROSE with no `additionalSpells` to parse. Hand-authored
// to the shape parseGrants() emits. **Keep identical to extract.py's PROSE_GRANTS.**
const _arcanum=(level,sl)=>({kind:"known",atLevel:level,recharge:"per long rest",count:1,
  filter:{level:String(sl),class:"Warlock"},desc:`a level ${sl} Warlock spell`,
  feature:`Mystic Arcanum (level ${sl})`,
  note:"You can cast it once without expending a spell slot, and must finish a Long Rest "
      +"before casting it that way again. Whenever you gain a Warlock level you can replace "
      +"it with another Warlock spell of the same level."});
const _savant=(school,name)=>({kind:"prepared",atLevel:3,recharge:null,count:2,
  filter:{class:"Wizard",school},desc:`two ${name} spells for your spellbook`,
  feature:`${name} Savant`,
  note:"Added to your spellbook for free when you take the subclass — they don't count "
      +"against the book's normal growth."});
const PROSE_GRANTS={
  "class|Warlock|XPHB":{picks:[_arcanum(11,6),_arcanum(13,7),_arcanum(15,8),_arcanum(17,9)]},
  "class|Cleric|XPHB":{fixed:[{kind:"innate",atLevel:20,recharge:"per long rest",
    spell:{name:"Wish",source:"XPHB"},feature:"Greater Divine Intervention",
    note:"Once you use this feature you can't do so again until you finish 2d4 Long Rests."}]},
  "subclass|Abjurer|XPHB":{picks:[_savant("A","Abjuration")]},
  "subclass|Diviner|XPHB":{picks:[_savant("D","Divination")]},
  "subclass|Evoker|XPHB":{picks:[_savant("V","Evocation")]},
  "subclass|Illusionist|XPHB":{picks:[_savant("I","Illusion")]},
  "subclass|Knowledge|XPHB":{picks:[{kind:"prepared",atLevel:3,recharge:null,count:1,
    filter:{class:"Cleric",school:"D"},desc:"one Divination spell",feature:"Mind Magic",
    note:"Always prepared, and it doesn't count against the number of spells you can prepare."}]},
};
function mergeProseGrants(rec,kind,ident){
  const extra=PROSE_GRANTS[kind+"|"+ident+"|"+(rec.source||"")]; if(!extra)return;
  if(!rec.grants)rec.grants={fixed:[],picks:[],expansions:[],optionGroups:[],ability:null};
  Object.keys(extra).forEach(k=>{rec.grants[k]=(rec.grants[k]||[]).concat(extra[k].map(x=>Object.assign({},x)));});}
const CADENCE_KEYS=new Set(Object.keys(RECHARGE));   // will/daily/rest/resource -> a cadence map, not a spell list
function emitCadence(b,at,cadmap,feature,feats){
  // Route a {cadence: payload} innate-cast map into innate grants. Shared by the
  // `innate` block and by prepared/known values written as a cadence map.
  Object.entries(cadmap).forEach(([cadence,payload])=>{const base=RECHARGE[cadence]||cadence;
    if(cadence==="will"||Array.isArray(payload)){(Array.isArray(payload)?payload:[payload]).forEach(s=>addSpellEntry(b,"innate",at,"at will",s,feature,feats));}
    else if(payload&&typeof payload==="object"){Object.entries(payload).forEach(([freq,arr])=>{const n=numOf(freq)||1;
      const label=n===1?base:`${n}× ${base}`;(Array.isArray(arr)?arr:[arr]).forEach(s=>addSpellEntry(b,"innate",at,label,s,feature,feats));});}});}
const isCadence=v=>v&&typeof v==="object"&&!Array.isArray(v)&&Object.keys(v).length>0&&Object.keys(v).every(k=>CADENCE_KEYS.has(k));
// A prepared/known/expanded value has THREE shapes, like `innate` does: a bare list,
// a cadence map, or a class-requirement group map — {"_":[…]} means "no requirement".
// The group form fell through to spellRef() as a raw dict and silently discarded its
// `choose` filter (High Elf's Wizard cantrip among 25 such grants). Flatten groups.
const ungroup=v=>(v&&typeof v==="object"&&!Array.isArray(v)&&!isCadence(v))
  ? Object.values(v).reduce((a,inner)=>a.concat(Array.isArray(inner)?inner:[inner]),[]) : v;
function normAbility(a){ if(a==null)return null;
  if(typeof a==="string")return a==="inherit"?{inherit:true}:{fixed:a};
  if(a&&typeof a==="object"&&"choose"in a)return{choose:a.choose};
  return null;}
const numOf=x=>{const m=String(x).replace(/\D/g,"");return m?parseInt(m,10):0;};
// Sidekicks (Expert/Spellcaster/Warrior) are DM-run NPC templates, not player classes.
const EXCLUDE_CLASS=n=>/ Sidekick$/.test(n||"");
// optional features (invocations, metamagic, pact boons…) — D28. Extracted generically:
// how many you get comes from each class/subclass's optionalfeatureProgression, not code.
// Prerequisites, for feats AND optional features. Each entry in `prerequisite` is an
// alternative (OR), so we emit one record per alternative: a display string plus the
// parts the app can check. `soft` marks an alternative that also carries something we
// don't model (ability scores, proficiencies, backgrounds, campaigns).
const SOFT_KEYS=new Set(["ability","proficiency","background","campaign","other","otherSummary",
  "item","feature","exclusiveFeatCategory","featCategory"]);
const plainRef=x=>typeof x==="object"&&x?richStrip(x.displayEntry||x.entrySummary||x.entry||x.name||"")
  :richStrip(String(x).split("|")[0]);
function prereqBlocks(o){const out=[];
  (o.prerequisite||[]).forEach(p=>{
    const b={text:"",level:null,cls:null,feats:[],optfeats:[],races:[],spells:[],spellcasting:false,pact:null,checks:[],soft:false};
    const bits=[];const lv=p.level;
    if(lv&&typeof lv==="object"){b.cls=(lv.class||{}).name;b.level=lv.level;
      bits.push(b.cls?`${b.cls} level ${b.level}`:`level ${b.level}`);}
    else if(lv!=null){b.level=lv;bits.push("level "+lv);}
    (p.feat||[]).forEach(x=>{const n=plainRef(x);b.feats.push(n);bits.push(n);});
    (p.optionalfeature||[]).forEach(x=>{const n=plainRef(x);b.optfeats.push(n);bits.push(n);});
    (p.race||[]).forEach(x=>{const n=plainRef(x);b.races.push(n);bits.push(n);});
    (p.spell||[]).forEach(x=>{const n=plainRef(x);b.spells.push(n);bits.push(n);});
    if(p.pact){b.pact=p.pact;bits.push("Pact of the "+p.pact);}
    if(p.spellcasting||p.spellcasting2020||p.spellcastingFeature){b.spellcasting=true;bits.push("spellcasting");}
    // the parts we can't model go in `checks`, kept separate so the app can show a
    // per-part verdict (level met / not met) instead of one undifferentiated blob
    const soft=[];
    (p.ability||[]).forEach(ab=>Object.entries(ab).forEach(([k,v])=>soft.push(`${k.toUpperCase()} ${v}+`)));
    (p.proficiency||[]).forEach(pr=>Object.entries(pr).forEach(([k,v])=>soft.push(`${v} ${k} proficiency`)));
    (p.background||[]).forEach(x=>soft.push(plainRef(x)));
    (p.feature||[]).forEach(x=>soft.push(plainRef(x)));
    (p.item||[]).forEach(x=>soft.push(richStrip(x)));
    (p.campaign||[]).forEach(x=>soft.push(x+" campaign"));
    (p.exclusiveFeatCategory||[]).forEach(x=>soft.push(`no other ${x}-category feat`));
    if(p.other)soft.push(richStrip(p.other));
    const os=p.otherSummary; if(os&&typeof os==="object")soft.push(richStrip(os.entrySummary||os.entry||""));
    b.checks=soft.filter(Boolean);
    bits.push(...b.checks);
    b.soft=Object.keys(p).some(k=>SOFT_KEYS.has(k));
    b.text=bits.filter(Boolean).join(", ");
    if(b.text)out.push(b);});
  return out;}
const prereqText=o=>prereqBlocks(o).map(b=>b.text).join(" or ")||null;
function optProgression(c){const out=[];
  (c.optionalfeatureProgression||[]).forEach(p=>{const prog=p.progression;const counts=new Array(20).fill(0);
    if(Array.isArray(prog)){for(let i=0;i<20;i++)counts[i]=+(prog[i]||0);}
    else if(prog&&typeof prog==="object"){Object.entries(prog).forEach(([k,v])=>{const lv=numOf(k)||1;
      for(let i=lv-1;i<20;i++)counts[i]=Math.max(counts[i],+(v||0));});}
    if(counts.some(Boolean))out.push({name:p.name||"Optional features",types:p.featureType||[],counts});});
  return out;}
const asArr=x=>Array.isArray(x)?x:(x==null?[]:[x]);   // 5etools sometimes uses a bare value, not a list
// what a class/subclass gives at each level, by NAME — mirrors extract.py's
// feature_list (D63). ASI/boon and "<Class> Subclass" placeholders are dropped.
const FEAT_SKIP=/^(ability score improvement|epic boon|subclass feature|.+ subclass|.+ subclass feature)$/i;
function featureList(recs,dropPrefix){
  const out=[],seen=new Set();
  (recs||[]).forEach(f=>{let nm=f&&f.name;const lv=f&&f.level;
    if(!nm||!lv)return;
    if(FEAT_SKIP.test(String(nm).trim()))return;
    if(dropPrefix&&String(nm).trim().toLowerCase()===String(dropPrefix).trim().toLowerCase())return;
    if(dropPrefix&&nm.toLowerCase().startsWith(dropPrefix.toLowerCase()+" "))
      nm=nm.slice(dropPrefix.length).replace(/^[\s:\-—]+/,"");
    const k=lv+"|"+nm.toLowerCase(); if(seen.has(k))return;
    seen.add(k); out.push({level:lv,name:nm});});
  return out.sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));}
function parseBlock(block,feats){const ft=block.name;
  const b={fixed:[],picks:[],expansions:[],ability:normAbility(block.ability)};
  Object.entries(block.prepared||{}).forEach(([lvl,arr])=>{const at=numOf(lvl);
    if(isCadence(arr)){emitCadence(b,at,arr,ft,feats);return;}   // free casting on a cadence (feats)
    asArr(ungroup(arr)).forEach(s=>{ if(isCadence(s))emitCadence(b,at,s,ft,feats);
      else addSpellEntry(b,"prepared",at,"prepared (free)",s,ft,feats);});});
  Object.entries(block.expanded||{}).forEach(([lvl,arr])=>{const at=SLOT_LEVEL_KEY[String(lvl)]!=null?SLOT_LEVEL_KEY[String(lvl)]:numOf(lvl);
    if(isCadence(arr)){emitCadence(b,at,arr,ft,feats);return;}
    asArr(ungroup(arr)).forEach(s=>{ if(isCadence(s))emitCadence(b,at,s,ft,feats);
      else if(s&&typeof s==="object"&&"all"in s){const fc=chooseFilter({choose:s.all});b.expansions.push({atLevel:at,filter:fc[0],feature:ft||resolveFeature(feats,at,{choose:s.all})});}
      else addSpellEntry(b,"prepared",at,"expanded list",s,ft,feats);});});
  Object.entries(block.known||{}).forEach(([lvl,arr])=>{const at=numOf(lvl);
    if(isCadence(arr)){emitCadence(b,at,arr,ft,feats);return;}
    asArr(ungroup(arr)).forEach(s=>{ if(isCadence(s))emitCadence(b,at,s,ft,feats);
      else addSpellEntry(b,"known",at,"always known",s,ft,feats);});});
  Object.entries(block.innate||{}).forEach(([lvlkey,cadmap])=>{const at=(String(lvlkey)==="_"||String(lvlkey)==="")?0:numOf(lvlkey);
    // a bare list (or string) under the level key is the at-will shorthand
    if(Array.isArray(cadmap)||typeof cadmap==="string"){
      asArr(cadmap).forEach(s=>addSpellEntry(b,"innate",at,"at will",s,ft,feats));return;}
    if(!cadmap||typeof cadmap!=="object")return;
    emitCadence(b,at,cadmap,ft,feats);});
  return b;}
function parseGrants(add,feats){
  const out={fixed:[],picks:[],expansions:[],optionGroups:[],ability:null};
  add=Array.isArray(add)?add:(add?[add]:[]);
  const named=add.filter(b=>b&&b.name);
  let rest;
  if(named.length>1){out.optionGroups.push({options:named.map(b=>Object.assign({name:b.name},parseBlock(b,feats)))});
    rest=(add||[]).filter(b=>!b.name);}
  else rest=add||[];
  rest.forEach(blk=>{const pb=parseBlock(blk,feats);
    out.fixed.push(...pb.fixed);out.picks.push(...pb.picks);out.expansions.push(...pb.expansions);
    if(pb.ability&&!out.ability)out.ability=pb.ability;});
  return out;}

function slotTable(groups){for(const g of groups||[]){if(((g.title||"").indexOf("Spell Slots per Spell Level"))>=0)return g.rowsSpellProgression||g.rows;}return null;}
function subclassLevel(c){for(const cf of c.classFeatures||[]){const s=typeof cf==="string"?cf:(cf.classFeature||"");
  if(s.indexOf("Subclass")>=0&&s.indexOf("Feature")<0){const n=parseInt(s.split("|").pop(),10);if(!isNaN(n))return n;}}return 3;}

const ORDER_CANTRIP={
  "Cleric|XPHB":{count:1,filter:{level:"0",class:"Cleric"},label:"Divine Order — Thaumaturge (extra cantrip)",atLevel:1,optional:true},
  "Druid|XPHB":{count:1,filter:{level:"0",class:"Druid"},label:"Primal Order — Magician (extra cantrip)",atLevel:1,optional:true}};
const FS_CLASS_LEVEL={Fighter:1,Ranger:2,Paladin:2};

// ── main: build a digest from a list of {name, json} files ──────────────────
// ── summon stat blocks ──────────────────────────────────────────────────────
// A few spells conjure a creature whose stat block the book prints beside them.
// 5etools flags those monsters with `summonedBySpell`, which names the spell
// directly — far more reliable than parsing {@creature} refs out of spell text.
const SIZE_NAME={T:"Tiny",S:"Small",M:"Medium",L:"Large",H:"Huge",G:"Gargantuan"};
const ALIGN_NAME={L:"Lawful",N:"Neutral",C:"Chaotic",G:"Good",E:"Evil",U:"Unaligned",A:"Any alignment",NX:"Neutral",NY:"Neutral"};
const ABILITY_FULL={str:"Strength",dex:"Dexterity",con:"Constitution",int:"Intelligence",wis:"Wisdom",cha:"Charisma"};
const ATK_WORD={m:"Melee",r:"Ranged",mw:"Melee Weapon",rw:"Ranged Weapon",ms:"Melee Spell",rs:"Ranged Spell"};
function atkLabel(body,suffix){
  const parts=String(body).split(",").map(x=>x.trim()).filter(Boolean).map(x=>ATK_WORD[x.toLowerCase()]||x);
  if(parts.length>1){
    const head=parts.map(p=>p.indexOf(" ")>=0?p.slice(0,p.lastIndexOf(" ")):p);
    const tail=parts[parts.length-1].indexOf(" ")>=0?parts[parts.length-1].split(" ").pop():"";
    return head.join(" or ")+((tail&&head.indexOf(tail)<0)?" "+tail:"")+suffix;}
  return (parts[0]||body)+suffix;}
const SB_TAGS=[
  [/\{@atkr ([^}]*)\}/g,(m,a)=>atkLabel(a," Attack Roll:")],
  [/\{@atk ([^}]*)\}/g,(m,a)=>atkLabel(a," Attack:")],
  [/\{@actSave (\w+)\}/g,(m,a)=>(ABILITY_FULL[a.toLowerCase()]||a)+" Saving Throw:"],
  [/\{@actSaveFail(?:\|[^}]*)?\}/g,()=>"Failure:"],
  [/\{@actSaveSuccess(?:\|[^}]*)?\}/g,()=>"Success:"],
  [/\{@actTrigger\}/g,()=>"Trigger:"],
  [/\{@actResponse(?:\s[^}]*)?\}/g,()=>"Response:"],
  [/\{@h\}/g,()=>"Hit: "],
  [/\{@hit ([+\-]?\d+)\}/g,(m,a)=>/^\d/.test(a)?"+"+a:a],
];
function sbText(s){ if(typeof s!=="string")return s;
  SB_TAGS.forEach(([rx,fn])=>{s=s.replace(rx,fn);});
  s=s.split("summonSpellLevel").join("the spell's level");   // they scale off the slot used
  return richStrip(s).replace(/\s{2,}/g," ").trim();}
function sbEntries(arr){ return (arr||[]).map(e=>{
    if(typeof e==="string")return{name:"",text:[sbText(e)]};
    if(!e||typeof e!=="object")return null;
    return{name:sbText(e.name||""),text:flattenEntries(e.entries,sbText).filter(Boolean)};})
  .filter(o=>o&&(o.name||o.text.length));}
function sbSpeed(sp){ if(!sp||typeof sp!=="object")return String(sp||"");
  const out=[];["walk","burrow","climb","fly","swim"].forEach(mode=>{const v=sp[mode];
    if(v==null)return; const n=(v&&typeof v==="object")?v.number:v, cond=(v&&typeof v==="object"&&v.condition)||"";
    const lbl=mode==="walk"?"":mode[0].toUpperCase()+mode.slice(1)+" ";
    out.push(lbl+n+" ft."+(cond?" "+cond:""));});
  return out.join(", ");}
function sbDTypes(arr,field){const out=[];(arr||[]).forEach(x=>{
    if(typeof x==="string")out.push(x);
    else if(x&&typeof x==="object"){const inner=sbDTypes(x[field]||[],field).join(", ");
      const note=x.note||""; out.push((inner?(inner+" "+note).trim():note));}});
  return out.filter(Boolean);}
function sbType(t){ if(typeof t==="string")return t;
  if(t&&typeof t==="object"){const inner=t.type;
    if(inner&&typeof inner==="object"&&inner.choose)return inner.choose.join(" or ");
    return inner!=null?sbType(inner):"";}
  return "";}
function sbAlign(arr){const out=[];(arr||[]).forEach(a=>{
    if(typeof a==="string")out.push(ALIGN_NAME[a]||a);
    else if(a&&typeof a==="object")(a.alignment||[]).forEach(x=>out.push(ALIGN_NAME[x]||x));});
  return out.join(" ");}
function sbAc(arr){const a=(arr||[])[0]; if(a==null)return "";
  return (a&&typeof a==="object")?String(a.special||a.ac||""):String(a);}
function statblock(m){
  const size=(m.size||[]).map(x=>SIZE_NAME[x]||x).join(" or ");
  const hp=m.hp||{};
  const senses=(m.senses||[]).slice(); if(m.passive!=null)senses.push("Passive Perception "+m.passive);
  const pick=o=>{const r={};Object.keys(o||{}).forEach(k=>{r[k]=o[k];});return r;};
  const ab={};["str","dex","con","int","wis","cha"].forEach(k=>{if(m[k]!=null)ab[k]=m[k];});
  const saves={};Object.keys(m.save||{}).forEach(k=>{saves[ABILITY_FULL[k]||k]=m.save[k];});
  const skills={};Object.keys(m.skill||{}).forEach(k=>{if(k!=="other")skills[k[0].toUpperCase()+k.slice(1)]=m.skill[k];});
  const sec=[["Traits",m.trait],["Actions",m.action],["Bonus Actions",m.bonus],
             ["Reactions",m.reaction],["Legendary Actions",m.legendary]];
  return {name:m.name,source:m.source||"",page:m.page,
    kind:[size,sbType(m.type)].filter(Boolean).join(" "),align:sbAlign(m.alignment),
    ac:sbAc(m.ac),
    hp:String(hp.special||(hp.average?hp.average+" ("+(hp.formula||"")+")":"")),
    speed:sbSpeed(m.speed),abilities:ab,saves:saves,skills:skills,
    vulnerable:sbDTypes(m.vulnerable,"vulnerable").join(", "),
    resist:sbDTypes(m.resist,"resist").join(", "),
    immune:sbDTypes(m.immune,"immune").join(", "),
    condImmune:sbDTypes(m.conditionImmune,"conditionImmune").join(", "),
    senses:senses.join(", "),languages:(m.languages||[]).join(", "),
    pb:m.pbNote||(m.pb?"+"+m.pb:""),
    cr:(m.cr&&typeof m.cr==="object")?String(m.cr.cr||""):String(m.cr==null?"":m.cr),
    srd:!!m.srd52,
    sections:sec.filter(x=>x[1]&&x[1].length).map(([label,arr])=>({label,items:sbEntries(arr)}))};}
// keep only the monsters a spell actually prints — a full bestiary file is ~MBs and
// none of the rest is used, so it must never reach IMPORT_STAGE or localStorage
const monType=m=>{const t=m&&m.type;return((t&&typeof t==="object")?t.type:t)||"";};
const monCr=m=>{const c=m&&m.cr;const v=(c&&typeof c==="object")?c.cr:c;return v==null?"":String(v);};
// D78 — the predicate that decides what leaves a bestiary. MUST stay identical to
// extract.py's carried_monster(): summon blocks, plus CR 0 non-swarm beasts (which is
// exactly Find Familiar's set in both editions).
function carriedMonster(m){ if(!m)return false; if(m.summonedBySpell)return true;
  return monType(m)==="beast"&&monCr(m)==="0"&&!/swarm/i.test(m.name||"");}
function slimJson(j){ if(j&&Array.isArray(j.monster)){const keep=j.monster.filter(carriedMonster);
    if(keep.length!==j.monster.length){j=Object.assign({},j);j.monster=keep;}}
  return j;}
const CREATURE_RE=/\{@creature ([^}|]+)(?:\|([^}|]*))?[^}]*\}/g;
const BFILTER_RE=/\{@filter [^|}]*\|bestiary\|([^}]*)\}/g;
const monKey=(name,src)=>String(name).trim()+"|"+String(src||"").trim().toUpperCase();

function buildDigest(files){
  const books={};
  const spells={}; const classes=[]; const subclasses=[]; const feats=[]; const races=[]; const optfeats=[];
  let lookup=null;
  const report={spells:0,classes:0,subclasses:0,feats:0,species:0,books:0,lookup:false,files:0,errors:[]};

  // pass 1: books first (names/groups), stash the lookup, and index granting features
  const subfeatIdx={}, clsfeatIdx={};   // keyed like extract.py's SUB/CLSFEAT_INDEX
  files.forEach(f=>{const j=f.json;if(!j||typeof j!=="object")return;
    if(Array.isArray(j.book)){j.book.forEach(b=>{if(b.source)books[b.source]={name:b.name||b.source,group:b.group||"other"};});report.books+=j.book.length;}
    // homebrew / UA files carry no book entry — their identity is _meta.sources
    // ({json: code, full: name}). Grouped under "brew" so the checklist shelves them.
    const metaSrc=j._meta&&Array.isArray(j._meta.sources)?j._meta.sources:[];
    metaSrc.forEach(m=>{if(m&&m.json&&!books[m.json])books[m.json]={name:m.full||m.abbreviation||m.json,group:"brew"};});
    if(/spell-source-lookup/i.test(f.name)||(!j.spell&&!j.class&&!j.subclass&&!j.feat&&!j.race&&!j.optionalfeature&&!j.book&&looksLikeLookup(j))){lookup=j;report.lookup=true;}
    (j.subclassFeature||[]).forEach(x=>{const k=x.className+"|"+x.subclassShortName+"|"+x.subclassSource;(subfeatIdx[k]=subfeatIdx[k]||[]).push(featRecord(x));});
    (j.classFeature||[]).forEach(x=>{const k=x.className+"|"+x.classSource;(clsfeatIdx[k]=clsfeatIdx[k]||[]).push(featRecord(x));});
  });
  const bname=src=>(books[src]&&books[src].name)||src;
  const bgroup=src=>(books[src]&&books[src].group)||"other";

  files.forEach(f=>{const j=f.json;if(!j||typeof j!=="object")return;report.files++;
    try{
      (j.spell||[]).forEach(sp=>{const src=sp.source||"";const k=spellKey(sp.name,src);
        const dur=(sp.duration&&sp.duration[0])||{};const ct=castTime(sp),rs=rangeStr(sp);
        spells[k]={name:sp.name,source:src,group:bgroup(src),book:bname(src),level:sp.level||0,
          school:SCHOOL[sp.school]||sp.school||"",time:ct[0],tcat:ct[1],range:rs[0],rcat:rs[1],
          comp:components(sp),ritual:!!((sp.meta||{}).ritual),conc:!!dur.concentration,
          dmg:uniqSort(sp.damageInflict),cond:uniqSort(sp.conditionInflict),save:uniqSort(sp.savingThrow),
          atk:!!sp.spellAttack,durTxt:durationText(sp),desc:flattenEntries(sp.entries),
          higher:flattenEntries(sp.entriesHigherLevel),reprinted:reprinted(sp),page:sp.page,cls:[],sub:[],feat:[],race:[],
          // raw entries, popped once creature sets are resolved — richStrip eats the
          // {@creature}/{@filter} tags on the way into `desc` (mirrors extract.py)
          _raw:JSON.stringify([sp.entries,sp.entriesHigherLevel])};});
      (j.class||[]).forEach(c=>{if(EXCLUDE_CLASS(c.name))return;   // sidekicks aren't player classes
        const cp=c.casterProgression,prepared=c.preparedSpellsProgression,known=c.spellsKnownProgression;
        const change=c.preparedSpellsChange;const isStatic=(change==="level")||(!!known&&!prepared);
        const rec={name:c.name,source:c.source||"",group:bgroup(c.source||""),book:bname(c.source||""),reprinted:reprinted(c),page:c.page,
          caster:cp,ability:c.spellcastingAbility,static:!!(isStatic&&cp),
          countType:prepared?"fixed":known?"known":(cp?"formula":null),
          subclassLevel:subclassLevel(c),cantrips:c.cantripProgression,prepared:prepared||known,
          spellbook:c.spellsKnownProgressionFixed,slots:slotTable(c.classTableGroups),
          grants:parseGrants(c.additionalSpells,clsfeatIdx[c.name+"|"+(c.source||"")]),grantsFightingStyle:null,bonusChoices:[],
          optFeatures:optProgression(c),
          features:featureList(clsfeatIdx[c.name+"|"+(c.source||"")])};
        const okey=c.name+"|"+(c.source||"");
        if(ORDER_CANTRIP[okey])rec.bonusChoices.push(ORDER_CANTRIP[okey]);
        if(FS_CLASS_LEVEL[c.name]&&c.source==="XPHB")rec.grantsFightingStyle=FS_CLASS_LEVEL[c.name];
        mergeProseGrants(rec,"class",rec.name); classes.push(rec);});
      (j.subclass||[]).forEach(sc=>{if(EXCLUDE_CLASS(sc.className||""))return;
        const rec={name:sc.name||"",shortName:sc.shortName||sc.name||"",source:sc.source||"",
        group:bgroup(sc.source||""),book:bname(sc.source||""),reprinted:reprinted(sc),page:sc.page,
        className:sc.className||"",classSource:sc.classSource||"",
        grants:parseGrants(sc.additionalSpells,subfeatIdx[(sc.className||"")+"|"+(sc.shortName||sc.name||"")+"|"+(sc.source||"")]),
        optFeatures:optProgression(sc),
        features:featureList(subfeatIdx[(sc.className||"")+"|"+(sc.shortName||sc.name||"")+"|"+(sc.source||"")],
                             sc.shortName||"")};
        if(sc.casterProgression){rec.caster=sc.casterProgression;rec.ability=sc.spellcastingAbility;
          rec.cantrips=sc.cantripProgression;rec.prepared=sc.preparedSpellsProgression||sc.spellsKnownProgression;
          rec.static=(sc.preparedSpellsChange==="level");rec.spellList=["Wizard","XPHB"];}
        mergeProseGrants(rec,"subclass",sc.shortName||sc.name||""); subclasses.push(rec);});
      (j.feat||[]).forEach(ft=>{const cat=ft.category||"G";const hasSpells="additionalSpells"in ft;
        feats.push({name:ft.name,source:ft.source||"",group:bgroup(ft.source||""),book:bname(ft.source||""),reprinted:reprinted(ft),page:ft.page,
          category:cat,fsClass:({"FS:R":"Ranger","FS:P":"Paladin","FS":"Fighter"})[cat]||null,hasSpells,
          optFeatures:optProgression(ft),prereq:prereqText(ft),prereqs:prereqBlocks(ft),
          grants:hasSpells?parseGrants(ft.additionalSpells):{fixed:[],picks:[],expansions:[],optionGroups:[],ability:null}});});
      (j.optionalfeature||[]).forEach(o=>{const hasSpells="additionalSpells"in o;
        optfeats.push({name:o.name,source:o.source||"",group:bgroup(o.source||""),book:bname(o.source||""),
          reprinted:reprinted(o),page:o.page,types:o.featureType||[],prereq:prereqText(o),prereqs:prereqBlocks(o),hasSpells,
          grants:hasSpells?parseGrants(o.additionalSpells):{fixed:[],picks:[],expansions:[],optionGroups:[],ability:null}});});
      // `base` is the parent species a lineage hangs off — the picker groups on it (D46)
      const emitSpecies=(name,source,blocks,page,base,lineage)=>{const named=(blocks||[]).filter(b=>b.name);
        if(named.length>1)named.forEach(b=>races.push({name:`${name} — ${b.name}`,source,group:bgroup(source),book:bname(source),reprinted:false,page,base:name,lineage:b.name,grants:parseGrants([b])}));
        else races.push({name,source,group:bgroup(source),book:bname(source),reprinted:false,page,base:base||name,lineage:base?(lineage||name):"",grants:parseGrants(blocks)});};
      (j.race||[]).forEach(rc=>{emitSpecies(rc.name,rc.source||"",rc.additionalSpells,rc.page);
        if(reprinted(rc)&&races.length)races[races.length-1].reprinted=true;});
      (Array.isArray(j.subrace)?j.subrace:[]).forEach(rc=>{const base=rc.raceName||"",nm=rc.name||"";
        if(!rc.additionalSpells)return;emitSpecies(nm?`${base} (${nm})`:base,rc.source||"",rc.additionalSpells,rc.page,base||null,nm||null);});
    }catch(e){report.errors.push(f.name+": "+e.message);}
  });

  // homebrew spells carry their access INLINE (classes.fromClassList /
  // classes.fromSubclass) — the generated lookup only covers site data
  files.forEach(f=>{const j=f.json;if(!j||!Array.isArray(j.spell))return;
    j.spell.forEach(raw=>{const sp=spells[spellKey(raw.name,raw.source||"")];
      const cl=raw.classes; if(!sp||!cl||typeof cl!=="object")return;
      (cl.fromClassList||[]).forEach(c=>{if(c&&c.name)sp.cls.push([c.name,c.source||""]);});
      (cl.fromClassListVariant||[]).forEach(c=>{if(c&&c.name)sp.cls.push([c.name,c.source||""]);});
      (cl.fromSubclass||[]).forEach(x=>{const c=x&&x.class,sub=x&&x.subclass;
        if(c&&c.name&&sub&&sub.name)sp.sub.push([c.name,sub.name,sub.source||""]);});});});

  // spell → class/subclass/feat/race access from the generated lookup
  if(lookup){Object.entries(lookup).forEach(([srcL,byname])=>{
    Object.entries(byname).forEach(([nameL,acc])=>{const sp=spells[`${nameL}|${srcL}`];if(!sp||!acc||typeof acc!=="object")return;
      Object.entries(acc.class||{}).forEach(([csrc,cmap])=>{Object.keys(cmap||{}).forEach(cls=>sp.cls.push([cls,csrc]));});
      Object.entries(acc.subclass||{}).forEach(([ssrc,clsmap])=>{Object.entries(clsmap||{}).forEach(([cls,bysrc])=>{
        Object.entries(bysrc||{}).forEach(([scsrc,submap])=>{Object.entries(submap||{}).forEach(([sub,meta])=>{
          const nm=(meta&&typeof meta==="object"&&meta.name)?meta.name:sub;sp.sub.push([cls,nm,scsrc]);});});});});
      Object.entries(acc.feat||{}).forEach(([fsrc,fmap])=>{Object.keys(fmap||{}).forEach(ft=>sp.feat.push([ft,fsrc]));});
      Object.entries(acc.race||{}).forEach(([rsrc,rmap])=>{Object.keys(rmap||{}).forEach(rc=>sp.race.push([rc,rsrc]));});
    });});}

  report.spells=Object.keys(spells).length;report.classes=classes.length;report.subclasses=subclasses.length;
  report.feats=feats.length;report.species=races.length;

  // source registry
  const cnt=(src,key,map)=>{(map[src]=map[src]||{spells:0,classes:0,subclasses:0,feats:0,species:0})[key]++;};
  const counter={};
  Object.values(spells).forEach(s=>cnt(s.source,"spells",counter));
  classes.forEach(c=>cnt(c.source,"classes",counter));
  subclasses.forEach(s=>cnt(s.source,"subclasses",counter));
  feats.forEach(f=>cnt(f.source,"feats",counter));
  races.forEach(r=>cnt(r.source,"species",counter));
  const sources={};Object.entries(counter).forEach(([src,c])=>{sources[src]={name:bname(src),group:bgroup(src),counts:c};});

  const monPool={},monByName={};
  files.forEach(f=>{const j=f.json;if(!j||!Array.isArray(j.monster))return;
    j.monster.forEach(m=>{ const ref=m&&m.summonedBySpell;
      if(ref){const parts=String(ref).split("|");
        const sp=spells[spellKey(parts[0],parts[1]||m.source||"")];
        if(sp)sp.statblock=statblock(m);}
      if(carriedMonster(m)){const k=monKey(m.name,m.source||"");monPool[k]=m;
        const ln=String(m.name).trim().toLowerCase();(monByName[ln]=monByName[ln]||[]).push(k);}});});
  // `{@filter …|bestiary|challenge rating=[&0]|type=beast|…}` — only the single-value CR
  // form is expanded; a RANGE would pull in hundreds of monsters (D78)
  const filterMatches=spec=>{const parts={};
    String(spec).split("|").forEach(ch=>{const i=ch.indexOf("=");if(i<0)return;
      parts[ch.slice(0,i).trim().toLowerCase()]=ch.slice(i+1).trim();});
    const wantType=(parts.type||"").toLowerCase();
    const m=/^\[&(\d+)\]$/.exec(parts["challenge rating"]||"");
    if(!wantType||!m)return [];
    return Object.keys(monPool).filter(k=>monType(monPool[k])===wantType&&monCr(monPool[k])===m[1]).sort();};
  Object.values(spells).forEach(sp=>{
    const txt=sp._raw||""; const keys=[],seen={};
    let mm; CREATURE_RE.lastIndex=0;
    while((mm=CREATURE_RE.exec(txt))){
      const cands=mm[2]?[monKey(mm[1],mm[2])]:(monByName[String(mm[1]).trim().toLowerCase()]||[]);
      cands.forEach(k=>{if(monPool[k]&&!seen[k]){seen[k]=1;keys.push(k);}});}
    if(sp.source==="XPHB"){ let fm; BFILTER_RE.lastIndex=0;
      while((fm=BFILTER_RE.exec(txt)))filterMatches(fm[1]).forEach(k=>{if(!seen[k]){seen[k]=1;keys.push(k);}});}
    const own=sp.statblock?monKey(sp.statblock.name,sp.statblock.source||""):null;
    const out=keys.filter(k=>k!==own);
    if(out.length)sp.creatures=out;
    delete sp._raw;});
  const referenced={};Object.values(spells).forEach(sp=>(sp.creatures||[]).forEach(k=>{referenced[k]=1;}));
  const monsters={};Object.keys(referenced).sort().forEach(k=>{monsters[k]=statblock(monPool[k]);});

  const digest={meta:{spellCount:Object.keys(spells).length,imported:true},sources,
    spells:Object.values(spells),classes,subclasses,feats,races,optfeats,monsters};
  return {digest,report};
}
function looksLikeLookup(j){const ks=Object.keys(j);if(!ks.length)return false;
  const v=j[ks[0]];if(!v||typeof v!=="object")return false;
  const vv=v[Object.keys(v)[0]];return !!(vv&&typeof vv==="object"&&(vv.class||vv.subclass||vv.feat||vv.race));}

// ── 5etools .zip reader (native DecompressionStream, no dependency) ──────────
// Ported from monster-forge. Returns [{name, json}] for the files buildDigest can use.
async function inflateRaw(bytes){
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());}
function zipWanted(path){
  if(!/\.json$/i.test(path))return false;
  const p=path.toLowerCase(),base=p.split("/").pop();
  if(/spell-source-lookup/.test(base))return true;   // the class-access lookup we need (lives under generated/)
  if(base.startsWith("fluff-")||base.startsWith("foundry-"))return false;
  if(/(^|\/)(generated|roll20|foundry|makebrew|partnered)\//.test(p))return false;
  if(/(^|\/)(adventure|book)\//.test(p))return false;   // long-form prose
  return true;}
function usefulJson(j){return !!(j&&typeof j==="object"&&((Array.isArray(j.monster)&&j.monster.some(carriedMonster))||Array.isArray(j.spell)||Array.isArray(j.class)||Array.isArray(j.subclass)||Array.isArray(j.feat)||Array.isArray(j.race)||Array.isArray(j.subrace)||Array.isArray(j.optionalfeature)||Array.isArray(j.book)||looksLikeLookup(j)));}
async function unzipJsonFiles(buf,onFile){
  if(typeof DecompressionStream==="undefined")throw new Error("This browser can’t unzip files. Upload the .json files individually instead.");
  const dv=new DataView(buf),bytes=new Uint8Array(buf),n=buf.byteLength,td=new TextDecoder();
  let eocd=-1;for(let i=n-22;i>=0&&i>=n-22-0xffff;i--){if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}}
  if(eocd<0)throw new Error("That doesn’t look like a .zip file.");
  const count=dv.getUint16(eocd+10,true),cdOff=dv.getUint32(eocd+16,true);
  const entries=[];let p=cdOff;
  for(let i=0;i<count;i++){ if(dv.getUint32(p,true)!==0x02014b50)break;
    const method=dv.getUint16(p+10,true),compSize=dv.getUint32(p+20,true);
    const nameLen=dv.getUint16(p+28,true),extraLen=dv.getUint16(p+30,true),commLen=dv.getUint16(p+32,true);
    const lho=dv.getUint32(p+42,true),name=td.decode(bytes.subarray(p+46,p+46+nameLen));
    entries.push({name,method,compSize,lho}); p+=46+nameLen+extraLen+commLen; }
  const wanted=entries.filter(e=>zipWanted(e.name)),out=[];
  for(let i=0;i<wanted.length;i++){const e=wanted[i];
    const lnameLen=dv.getUint16(e.lho+26,true),lextraLen=dv.getUint16(e.lho+28,true);
    const start=e.lho+30+lnameLen+lextraLen,comp=bytes.subarray(start,start+e.compSize);
    let raw; if(e.method===0)raw=comp; else if(e.method===8)raw=await inflateRaw(comp); else continue;
    let json=null;try{json=JSON.parse(td.decode(raw));}catch(_){json=null;}
    if(onFile)onFile(e.name,i+1,wanted.length);
    if(json&&usefulJson(json))out.push({name:e.name.split("/").pop(),json:slimJson(json)}); }
  return out;}

window.SB_extract={buildDigest,unzipJsonFiles,slimJson};
})();
