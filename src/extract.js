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
    const txt=(segs[0]&&segs[0].trim())?segs[0].trim():rest;
    // a display name may end in a [disambiguator] 5etools' own renderer drops
    const bare=txt.replace(/\s*\[[^\]]*\]$/,"").trim();
    return bare||txt;};
  let prev=null,out=s;
  while(prev!==out){prev=out;out=out.replace(/\{@[^{}]+\}/g,repl);}
  return out; }
function titleCase(s){return s.replace(/\b\w/g,c=>c.toUpperCase());}
// A record with no usable name can't be indexed (the app lowercases names at boot) — skip
// it rather than store a record that bricks buildIndexes() on every later load. Keep
// identical to extract.py's valid_name.
const validName=x=>typeof x.name==="string"&&!!x.name.trim();

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
// The FIRST `reprintedAs` entry, normalized to a plain uid string (D127), or null.
// 5etools writes the field in TWO shapes: a bare uid ("Aberrant|Sorcerer|XPHB|XPHB") and
// an object {uid, tag} whose tag may name a DIFFERENT entity type — a 2014 optional
// feature is reprinted as a 2024 FEAT, a Dragonmark subrace as a feat. The tag is
// deliberately dropped: the app resolves the uid against every same-shaped index and
// treats an unresolvable pointer as UNKNOWN, never as "excluded" (D31).
// **extract.py carries the same function — keep the two identical.**
function supersededBy(o){
  let ra=o&&o.reprintedAs; if(!ra)return null;
  if(!Array.isArray(ra))ra=[ra];
  for(const e of ra){
    if(typeof e==="string"&&e.trim())return e.trim();
    if(e&&typeof e==="object"&&typeof e.uid==="string"&&e.uid.trim())return e.uid.trim();
  }
  return null;
}

// ── `_copy` resolution (D127) ───────────────────────────────────────────────
// 5etools ships every classic (2014) subclass TWICE: once attached to its 2014 class, and
// once as a `_copy` record re-attached to the 2024 class. The copy carries nothing but the
// reference, so an extractor that never resolves it emits a HOLLOW twin — no grants, no
// caster progression, and `reprinted` false because its `reprintedAs` hides inside
// `_copy._preserve` as an INSTRUCTION rather than a value. 73 subclasses lost every spell
// grant they have to that twin.
//
// The rule, matching 5etools' own copy semantics for the shapes actually shipped:
//   • the parent must live in the SAME FILE (all 124 current subclass copies do);
//   • the merge is SHALLOW — the parent's fields first, the copy's own fields overriding;
//   • copy-meta fields (page, srd, reprintedAs, …) are printing-specific and are DROPPED
//     unless `_copy._preserve` names them — that is exactly how `reprintedAs` reaches the
//     twin, and why a naive {...parent,...child} would be wrong;
//   • a `_copy` carrying `_mod`/`_templates` is a merge LANGUAGE, not a copy. There are
//     none among subclasses today; the day 5etools adds one the record is emitted
//     UNRESOLVED and reported, rather than silently half-merged.
// Races are deliberately NOT run through this: 15 of their 16 `_copy` records carry `_mod`
// with entry-level replaceArr/appendArr ops and point at parents in other BOOKS — a
// different shape wearing the same field name.
// **extract.py carries the same logic — keep the two identical.**
const COPY_NEEDS_PRESERVE=new Set(["page","otherSources","additionalSources","reprintedAs",
  "srd","srd52","basicRules","basicRules2024","freeRules2024","hasFluff","hasFluffImages",
  "hasToken","isReprinted","_versions"]);
function resolveCopies(items,keyfn,label,onUnresolved){
  if(!items||!items.length)return items;
  const idx={};
  items.forEach(x=>{if(x&&typeof x==="object"&&!x._copy)idx[keyfn(x)]=x;});
  return items.map(x=>{
    const cp=(x&&typeof x==="object")?x._copy:null;
    if(!cp)return x;
    let why=null;
    if(cp._mod||cp._templates)why="_copy carries _mod";
    const parent=idx[keyfn(cp)];
    if(!why&&!parent)why="parent not in the same file";
    if(why){ if(onUnresolved)onUnresolved(`${label} ${x.name}|${x.source}`,why); return x; }
    const preserve=cp._preserve||{};
    const merged={};
    Object.keys(parent).forEach(k=>{if(!COPY_NEEDS_PRESERVE.has(k)||preserve[k])merged[k]=parent[k];});
    Object.keys(x).forEach(k=>{if(k!=="_copy")merged[k]=x[k];});
    return merged;
  });
}
// A NUL joiner, not "|" or a space: a book code or a subclass name can hold either,
// and a key collision here would merge the WRONG parent into a record.
const subCopyKey=s=>[s.className,s.classSource,s.shortName||s.name,s.source].join("\u0000");

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
// Deliberately NARROW: the first cut matched "you always have these prepared" and produced
// 470 notes of boilerplate. The component clauses (D85) are the second admitted family —
// a feature that strips V/S/M off a spell it GRANTS says so only in prose.
const MOD_RE=/without expending|no spell slot|automatically succeed|can'?t do so|can'?t (?:cast|use) it (?:this way|in this way)|once you cast|twice without|as part of the same|requires? no (?:verbal|somatic|material)|without (?:providing |using |needing )?(?:any |a )?(?:verbal|somatic|material)|without (?:spell )?components|don'?t need to provide/i;
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
  // `undefined` DISAPPEARS through JSON.stringify while Python writes `"feature": null`,
  // which is the whole of the 150-record "divergence" the parity harness used to report.
  if(feature===undefined)feature=null;
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
  // 5etools may have grown structured data for a hand-authored grant since the table was
  // written (it did, for the school Savants) — a feature already present in the record
  // must not be granted a second time. Keep identical to extract.py.
  Object.keys(extra).forEach(k=>{const cur=rec.grants[k]||[];
    const have=new Set(cur.filter(x=>x&&x.feature).map(x=>x.feature));
    rec.grants[k]=cur.concat(extra[k].filter(x=>x.feature==null||!have.has(x.feature)).map(x=>Object.assign({},x)));});}
// ---- casting-rule modifications (D85) --------------------------------------
// A feature may change HOW you cast spells you ALREADY have — strip a component from a
// whole school, from a class's list, from four named spells. 5etools carries none of that
// structurally, and MOD_RE only ever reaches spells a feature GRANTS. Hand-authored, like
// PROSE_GRANTS, and **keep identical to extract.py's CAST_MODS.**
//   scope = {cls, schools, spells, giver, maxLevel, optTypes} — all optional, ANDed.
//           `giver` matches the label of whatever granted the spell; `optTypes` matches a spell
//           granted by one of your optional features of that type (Elemental Disciplines).
//   label = what the chip says. Default is "<feature> — no V / S / M"; a mod with an empty
//           `drop` (a free cast rather than a component change) must supply its own.
//   drop  = which of v/s/m the feature removes.
//   when  = null means it always applies (the app strikes the component through); a string
//           is a condition the app cannot verify, so it annotates instead of striking.
const CAST_MODS={
  "class|Psion|XUA2025Psion":[
    {feature:"Psionic Spellcasting",level:1,cls:null,label:null,
     scope:{cls: "Psion"},drop:"vm",exceptCostly:true,when:null,
     note:"When you cast a Psion spell, that spell doesn't require a Verbal or Material "
          +"component, even if the spell includes \"V\" or \"M\" in its Components entry, except "
          +"Material components that are consumed by the spell or have a cost specified."},
  ],
  "class|Druid|PHB":[
    {feature:"Archdruid",level:20,cls:null,label:null,
     scope:{cls: "Druid"},drop:"vsm",exceptCostly:true,when:null,
     note:"You can ignore the verbal and somatic components of your druid spells, as well as "
          +"any material components that lack a cost and aren't consumed by a spell."},
  ],
  "class|Cleric|XPHB":[
    {feature:"Divine Intervention",level:10,cls:null,label:"Divine Intervention \u2014 free, no Material",
     scope:{cls: "Cleric", maxLevel: 5},drop:"m",exceptCostly:false,when:"when you cast it with Divine Intervention",
     note:"You cast the spell without expending a spell slot or needing Material components. "
          +"Once you use this feature, you can't do so again until you finish a Long Rest."},
  ],
  "subclass|Great Old One|XPHB":[
    {feature:"Psychic Spells",level:3,cls:"Warlock",label:null,
     scope:{cls: "Warlock", schools: ["Enchantment", "Illusion"]},drop:"vs",exceptCostly:false,when:null,
     note:"When you cast a Warlock spell that is an Enchantment or Illusion, you can do so "
          +"without Verbal or Somatic components."},
  ],
  "subclass|Illusionist|XPHB":[
    {feature:"Improved Illusions",level:3,cls:"Wizard",label:null,
     scope:{schools: ["Illusion"]},drop:"v",exceptCostly:false,when:null,
     note:"You can cast Illusion spells without providing Verbal components."},
  ],
  "subclass|Undead|RHW":[
    {feature:"Superior Dread",level:14,cls:"Warlock",label:null,
     scope:{cls: "Warlock", schools: ["Conjuration", "Necromancy"]},drop:"vsm",exceptCostly:true,when:"while you are using your Form of Dread",
     note:"Whenever you cast a Warlock spell from the Conjuration or Necromancy school, you "
          +"cast it without any Verbal, Somatic, or Material components, except Material "
          +"components that are costly or consumed by the spell."},
  ],
  "subclass|Aberrant|XPHB":[
    {feature:"Psionic Sorcery",level:6,cls:"Sorcerer",label:null,
     scope:{giver: "Psionic Spells"},drop:"vsm",exceptCostly:true,when:"when you cast it by spending Sorcery Points instead of a slot",
     note:"If you cast the spell using Sorcery Points, it requires no Verbal or Somatic "
          +"components, and it requires no Material components unless they are consumed by the "
          +"spell or have a cost specified in it."},
  ],
  "subclass|Aberrant Mind|TCE":[
    {feature:"Psionic Sorcery",level:6,cls:"Sorcerer",label:null,
     scope:{giver: "Psionic Spells"},drop:"vsm",exceptCostly:true,when:"when you cast it by spending sorcery points instead of a slot",
     note:"If you cast the spell using sorcery points, it requires no verbal or somatic "
          +"components, and it requires no material components, unless they are consumed by the "
          +"spell."},
  ],
  "subclass|Shadow|PHB":[
    {feature:"Shadow Arts",level:3,cls:"Monk",label:null,
     scope:{cls: "Monk", spells: ["Darkness", "Darkvision", "Pass Without Trace", "Silence"]},drop:"m",exceptCostly:false,when:"when you cast it by spending 2 ki points",
     note:"You can spend 2 ki points to cast darkness, darkvision, pass without trace, or "
          +"silence, without providing material components."},
  ],
  "subclass|Shadow|XPHB":[
    {feature:"Shadow Arts: Darkness",level:3,cls:"Monk",label:null,
     scope:{cls: "Monk", spells: ["Darkness"]},drop:"vsm",exceptCostly:false,when:"when you cast it by expending 1 Focus Point",
     note:"You can expend 1 Focus Point to cast the Darkness spell without spell components."},
  ],
  "subclass|Four Elements|PHB":[
    {feature:"Disciple of the Elements",level:3,cls:"Monk",label:null,
     scope:{optTypes: ["ED"]},drop:"m",exceptCostly:false,when:null,
     note:"To cast one of your elemental discipline spells you use its casting time and other "
          +"rules, but you don't need to provide material components for it."},
  ],
  "subclass|Archfey|XPHB":[
    {feature:"Steps of the Fey",level:3,cls:"Warlock",label:"Steps of the Fey \u2014 Misty Step free",
     scope:{cls: "Warlock", spells: ["Misty Step"]},drop:"",exceptCostly:false,when:"a number of times equal to your Charisma modifier per Long Rest",
     note:"You can cast Misty Step without expending a spell slot a number of times equal to "
          +"your Charisma modifier (minimum of once), and you regain all expended uses when you "
          +"finish a Long Rest. You may also gain one of two extra benefits with each casting."},
    {feature:"Bewitching Magic",level:14,cls:"Warlock",label:"Bewitching Magic \u2014 Misty Step free",
     scope:{cls: "Warlock", spells: ["Misty Step"]},drop:"",exceptCostly:false,when:"as part of casting an Enchantment or Illusion spell with a slot",
     note:"When you cast an Enchantment or Illusion spell using an action and a spell slot, you "
          +"can cast Misty Step as part of the same action and without expending a spell slot."},
  ],
};
function attachCastMods(rec,kind,ident){
  const mods=CAST_MODS[kind+"|"+ident+"|"+(rec.source||"")]; if(!mods)return;
  // `cls` guards a shortName two classes could share ("Shadow" is a Monk here)
  const out=mods.filter(m=>!m.cls||m.cls===rec.className)
    .map(m=>{const o=Object.assign({},m);delete o.cls;return o;});
  if(out.length)rec.castMods=out;}
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
  "item","feature","featCategory"]);
// 5etools' own category codes. Anything NOT here is a category a book invented — UA's
// "Wild Talent", a brew's own — and it is carried through under its own name rather than
// being folded into "general", which is what silently misfiled Wild Talents.
const FEAT_CAT_FULL={O:"Origin",G:"General",D:"Dragonmark",DG:"Dark Gift",EB:"Epic Boon",
  FS:"Fighting Style","FS:P":"Fighting Style (Paladin)","FS:R":"Fighting Style (Ranger)",
  "FS:B":"Fighting Style (Bard)","FS:M":"Fighting Style (Monk)"};
// the known code, then a file's own `_meta.featCategories`, then the raw value
// (UA writes the full name straight into `category`)
function featCatName(cat,declared){ if(!cat)return FEAT_CAT_FULL.G;
  return FEAT_CAT_FULL[cat]||(declared||{})[cat]||cat; }
// "Can't Have Another Wild Talent Feat" — the exclusivity a category carries in prose,
// which 5etools models as `exclusiveFeatCategory` only sometimes.
const EXCL_RE=/^(?:no other|can'?t have another)\s+(.+?)(?:\s+feat)?$/i;
function isSelfExclusive(text,ownName){
  const m=EXCL_RE.exec(String(text||"").trim().replace(/\.$/,""));
  return !!(m&&ownName&&m[1].trim().toLowerCase()===String(ownName).trim().toLowerCase()); }
const plainRef=x=>typeof x==="object"&&x?richStrip(x.displayEntry||x.entrySummary||x.entry||x.name||"")
  :richStrip(String(x).split("|")[0]);
function prereqBlocks(o,ownCat,declared){const out=[];
  const ownName=ownCat?featCatName(ownCat,declared):null;
  (o.prerequisite||[]).forEach(p=>{
    const b={text:"",level:null,cls:null,feats:[],optfeats:[],races:[],spells:[],spellcasting:false,pact:null,checks:[],soft:false,exclusiveCat:[]};
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
    // "only one feat of this category" IS checkable — the build's own feats say so.
    // It used to land in `checks`, where D31 can only ever call it "maybe".
    const exclBits=[];
    (p.exclusiveFeatCategory||[]).forEach(x=>{b.exclusiveCat.push(x);
      exclBits.push(`no other ${featCatName(x,declared)} feat`);});
    if(p.other)soft.push(richStrip(p.other));
    const os=p.otherSummary; let osExcl=false;
    if(os&&typeof os==="object"){const t=richStrip(os.entrySummary||os.entry||"");
      // a category whose exclusivity is stated only in prose (UA's Wild Talents)
      if(ownCat&&isSelfExclusive(t,ownName)){
        if(b.exclusiveCat.indexOf(ownCat)<0)b.exclusiveCat.push(ownCat);
        exclBits.push(t); osExcl=true;}
      else if(t)soft.push(t);}
    b.checks=soft.filter(Boolean);
    bits.push(...b.checks,...exclBits);
    b.soft=Object.keys(p).some(k=>SOFT_KEYS.has(k)&&!(k==="otherSummary"&&osExcl));
    b.text=bits.filter(Boolean).join(", ");
    if(b.text)out.push(b);});
  return out;}
const prereqText=(o,ownCat,declared)=>prereqBlocks(o,ownCat,declared).map(b=>b.text).join(" or ")||null;
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
      else if(s&&typeof s==="object"&&"all"in s){const fc=chooseFilter({choose:s.all});b.expansions.push({atLevel:at,filter:fc[0],feature:ft||resolveFeature(feats,at,{choose:s.all})||null});}
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
  // every free-text field goes through sbText — senses/languages/notes carry
  // rich tags too ({@variantrule Darkness|XPHB} in the Imp's darkvision)
  return {name:m.name,source:m.source||"",page:m.page,
    kind:[size,sbType(m.type)].filter(Boolean).join(" "),align:sbAlign(m.alignment),
    ac:sbText(sbAc(m.ac)),
    hp:sbText(String(hp.special||(hp.average?hp.average+" ("+(hp.formula||"")+")":""))),
    speed:sbText(sbSpeed(m.speed)),abilities:ab,saves:saves,skills:skills,
    vulnerable:sbText(sbDTypes(m.vulnerable,"vulnerable").join(", ")),
    resist:sbText(sbDTypes(m.resist,"resist").join(", ")),
    immune:sbText(sbDTypes(m.immune,"immune").join(", ")),
    condImmune:sbText(sbDTypes(m.conditionImmune,"conditionImmune").join(", ")),
    senses:sbText(senses.join(", ")),languages:sbText((m.languages||[]).join(", ")),
    pb:sbText(m.pbNote||(m.pb?"+"+m.pb:"")),
    cr:(m.cr&&typeof m.cr==="object")?String(m.cr.cr||""):String(m.cr==null?"":m.cr),
    srd:!!m.srd52,
    sections:sec.filter(x=>x[1]&&x[1].length).map(([label,arr])=>({label,items:sbEntries(arr)}))};}
// keep only the monsters a spell actually prints — a full bestiary file is ~MBs and
// none of the rest is used, so it must never reach IMPORT_STAGE or localStorage
const monType=m=>{const t=m&&m.type;return((t&&typeof t==="object")?t.type:t)||"";};
const monCr=m=>{const c=m&&m.cr;const v=(c&&typeof c==="object")?c.cr:c;return v==null?"":String(v);};
// D78 — the predicate that decides what leaves a bestiary. MUST stay identical to
const monKey=(name,src)=>String(name).trim()+"|"+String(src||"").trim().toUpperCase();

// extract.py's carried_monster(): summon blocks, plus CR 0 non-swarm beasts (which is
// exactly Find Familiar's set in both editions) — plus every form a FEATURE adds to a
// familiar spell. Pact of the Chain's Imp is a CR 1 fiend, so it survives none of the
// tests above on its own, and the refs live in feature prose. `slimJson` throws away
// what this predicate rejects at READ time, so the feature files have to be scanned
// before any bestiary file is slimmed — `scanFormRefs` below, called by the importer.
// **Keep identical to extract.py's carried_monster / _scan_form_refs.**
const FORM_REFS={names:new Set(),keys:new Set()};
const FORM_CRE_RE=/\{@creature ([^}|]+)(?:\|([^}|]*))?[^}]*\}/g;
const FORM_WORD_RE=/\bforms?\b/i;
function resetFormRefs(){FORM_REFS.names.clear();FORM_REFS.keys.clear();}
// accumulates: files arrive one at a time during an unzip, and each may name more forms
function scanFormRefs(files){
  const walk=(e,out)=>{ if(typeof e==="string")out.push(e);
    else if(Array.isArray(e))e.forEach(x=>walk(x,out));
    else if(e&&typeof e==="object")["entries","entry","items","rows","row"].forEach(k=>walk(e[k],out));};
  (files||[]).forEach(f=>{const j=f&&f.json; if(!j)return;
    [].concat(j.optionalfeature||[],j.feat||[]).forEach(rec=>{
      const buf=[];walk(rec.entries,buf);
      buf.join(" ").split(/(?<=[.!?])\s+/).forEach(sent=>{
        if(!FORM_WORD_RE.test(sent))return;
        let m; FORM_CRE_RE.lastIndex=0;
        while((m=FORM_CRE_RE.exec(sent))){ FORM_REFS.names.add(String(m[1]).trim().toLowerCase());
          if(m[2])FORM_REFS.keys.add(monKey(m[1],m[2])); }});});});
}
function carriedMonster(m){ if(!m)return false; if(m.summonedBySpell)return true;
  if(FORM_REFS.names.has(String(m.name||"").trim().toLowerCase()))return true;
  if(FORM_REFS.keys.has(monKey(m.name||"",m.source||"")))return true;
  return monType(m)==="beast"&&monCr(m)==="0"&&!/swarm/i.test(m.name||"");}
// A file's own feature refs are learned BEFORE its monsters are filtered, so no caller can
// get this wrong by forgetting a step. Ordering still matters ACROSS files — a bestiary
// slimmed before the feature file that names Imp has already dropped it — which is what
// `readOrder` is for, and why the unzip path and the parity harness both sort by it.
function slimJson(j){ if(!j)return j;
  if(j.optionalfeature||j.feat)scanFormRefs([{json:j}]);
  if(Array.isArray(j.monster)){const keep=j.monster.filter(carriedMonster);
    if(keep.length!==j.monster.length){j=Object.assign({},j);j.monster=keep;}}
  return j;}
// feature files first: see slimJson. Exported so nothing re-implements it — a harness that
// rolls its own file rules is exactly how the foundry.json bug hid for two sessions.
const readOrder=n=>/^(optionalfeatures|feats)/i.test(String(n||"").split("/").pop())?0:1;
const CREATURE_RE=/\{@creature ([^}|]+)(?:\|([^}|]*))?[^}]*\}/g;
const SPELL_REF_RE=/\{@spell ([^}|]+)(?:\|([^}|]*))?[^}]*\}/;
const FIXED_FORM_RE=/must be|is always|always takes the form/i;
const BFILTER_RE=/\{@filter [^|}]*\|bestiary\|([^}]*)\}/g;

function buildDigest(files){
  scanFormRefs(files);            // additive: a folder scan never went through unzipJsonFiles
  const books={};
  const spells={}; const classes=[]; const subclasses=[]; const feats=[]; const races=[]; const optfeats=[];
  let lookup=null,lookupNamed=false;
  const report={spells:0,classes:0,subclasses:0,feats:0,species:0,books:0,lookup:false,files:0,errors:[]};

  // pass 1: books first (names/groups), stash the lookup, and index granting features
  const subfeatIdx={}, clsfeatIdx={};   // keyed like extract.py's SUB/CLSFEAT_INDEX
  const brewSrc=new Set();              // sources a brew declared as its own — book[] may not rename these
  files.forEach(f=>{const j=f.json;if(!j||typeof j!=="object")return;
    // `_meta.sources` ({json: code, full: name}) is a brew's OWN identity and it goes FIRST,
    // because a collection brew may also carry `book` entries that reuse its source code for
    // sub-products. "D&D Beyond Drops" ships four, all map bundles; book[] used to overwrite
    // and the LAST one won, so eight spells filed themselves under a book called
    // "D&D Beyond Drops—Sewer Maps" in group "other" — off the "Homebrew & UA" shelf entirely
    // and effectively unfindable. A brew's own name wins, and its group stays "brew".
    const metaSrc=j._meta&&Array.isArray(j._meta.sources)?j._meta.sources:[];
    metaSrc.forEach(m=>{if(m&&m.json){books[m.json]={name:m.full||m.abbreviation||m.json,group:"brew"};brewSrc.add(m.json);}});
    if(Array.isArray(j.book)){j.book.forEach(b=>{if(b.source&&!brewSrc.has(b.source))books[b.source]={name:b.name||b.source,group:b.group||"other"};});report.books+=j.book.length;}
    // TWO files in a 5etools export are lookup-SHAPED: generated/gendata-spell-source-lookup.json
    // (keys folded to lowercase — the one extract.py reads) and spells/sources.json (keys in
    // ORIGINAL case). Whichever arrived last used to win, and when that was sources.json every
    // key missed the lowercase spell map: a zip import produced 936 spells that NO CLASS COULD
    // CAST, silently. The named file is authoritative and a shape match may never displace it.
    if(/spell-source-lookup/i.test(f.name)){lookup=j;lookupNamed=true;report.lookup=true;}
    else if(!lookupNamed&&!j.spell&&!j.class&&!j.subclass&&!j.feat&&!j.race&&!j.optionalfeature&&!j.book&&looksLikeLookup(j)){lookup=j;report.lookup=true;}
    (j.subclassFeature||[]).forEach(x=>{const k=x.className+"|"+x.subclassShortName+"|"+x.subclassSource;(subfeatIdx[k]=subfeatIdx[k]||[]).push(featRecord(x));});
    (j.classFeature||[]).forEach(x=>{const k=x.className+"|"+x.classSource;(clsfeatIdx[k]=clsfeatIdx[k]||[]).push(featRecord(x));});
  });
  const bname=src=>(books[src]&&books[src].name)||src;
  const bgroup=src=>(books[src]&&books[src].group)||"other";

  files.forEach(f=>{const j=f.json;if(!j||typeof j!=="object")return;report.files++;
    try{
      (j.spell||[]).forEach(sp=>{if(!validName(sp)){report.errors.push(f.name+": unnamed spell skipped");return;}
        const src=sp.source||"";const k=spellKey(sp.name,src);
        const dur=(sp.duration&&sp.duration[0])||{};const ct=castTime(sp),rs=rangeStr(sp);
        spells[k]={name:sp.name,source:src,group:bgroup(src),book:bname(src),level:sp.level||0,
          school:SCHOOL[sp.school]||sp.school||"",time:ct[0],tcat:ct[1],range:rs[0],rcat:rs[1],
          comp:components(sp),ritual:!!((sp.meta||{}).ritual),conc:!!dur.concentration,
          dmg:uniqSort(sp.damageInflict),cond:uniqSort(sp.conditionInflict),save:uniqSort(sp.savingThrow),
          atk:!!sp.spellAttack,durTxt:durationText(sp),desc:flattenEntries(sp.entries),
          higher:flattenEntries(sp.entriesHigherLevel),reprinted:reprinted(sp),supersededBy:supersededBy(sp),page:sp.page??null,cls:[],sub:[],feat:[],race:[],
          // raw entries, popped once creature sets are resolved — richStrip eats the
          // {@creature}/{@filter} tags on the way into `desc` (mirrors extract.py)
          _raw:JSON.stringify([sp.entries,sp.entriesHigherLevel])};});
      (j.class||[]).forEach(c=>{if(!validName(c)){report.errors.push(f.name+": unnamed class skipped");return;}
        if(EXCLUDE_CLASS(c.name))return;   // sidekicks aren't player classes
        const cp=c.casterProgression,prepared=c.preparedSpellsProgression,known=c.spellsKnownProgression;
        const change=c.preparedSpellsChange;const isStatic=(change==="level")||(!!known&&!prepared);
        const rec={name:c.name,source:c.source||"",group:bgroup(c.source||""),book:bname(c.source||""),reprinted:reprinted(c),supersededBy:supersededBy(c),page:c.page??null,
          // explicit nulls, never absent keys — extract.py writes None for these and the
          // whole-record parity diff reads absent ≠ null as drift
          caster:cp??null,ability:c.spellcastingAbility??null,static:!!(isStatic&&cp),
          countType:prepared?"fixed":known?"known":(cp?"formula":null),
          subclassLevel:subclassLevel(c)??null,cantrips:c.cantripProgression??null,prepared:(prepared||known)??null,
          spellbook:c.spellsKnownProgressionFixed??null,slots:slotTable(c.classTableGroups)??null,
          grants:parseGrants(c.additionalSpells,clsfeatIdx[c.name+"|"+(c.source||"")]),grantsFightingStyle:null,bonusChoices:[],
          optFeatures:optProgression(c),
          features:featureList(clsfeatIdx[c.name+"|"+(c.source||"")])};
        const okey=c.name+"|"+(c.source||"");
        if(ORDER_CANTRIP[okey])rec.bonusChoices.push(ORDER_CANTRIP[okey]);
        if(FS_CLASS_LEVEL[c.name]&&c.source==="XPHB")rec.grantsFightingStyle=FS_CLASS_LEVEL[c.name];
        mergeProseGrants(rec,"class",rec.name); attachCastMods(rec,"class",rec.name); classes.push(rec);});
      // D127: resolve the same-file `_copy` twins BEFORE reading anything off a subclass —
      // 124 of them are otherwise hollow shells that overwrite the real record downstream.
      resolveCopies(j.subclass||[],subCopyKey,"subclass",
        (lbl,why)=>report.errors.push(f.name+": "+lbl+" left unresolved — "+why+" (D127)")
      ).forEach(sc=>{if(!validName(sc)){report.errors.push(f.name+": unnamed subclass skipped");return;}
        if(EXCLUDE_CLASS(sc.className||""))return;
        const rec={name:sc.name||"",shortName:sc.shortName||sc.name||"",source:sc.source||"",
        group:bgroup(sc.source||""),book:bname(sc.source||""),reprinted:reprinted(sc),supersededBy:supersededBy(sc),page:sc.page??null,
        className:sc.className||"",classSource:sc.classSource||"",
        grants:parseGrants(sc.additionalSpells,subfeatIdx[(sc.className||"")+"|"+(sc.shortName||sc.name||"")+"|"+(sc.source||"")]),
        optFeatures:optProgression(sc),
        features:featureList(subfeatIdx[(sc.className||"")+"|"+(sc.shortName||sc.name||"")+"|"+(sc.source||"")],
                             sc.shortName||"")};
        if(sc.casterProgression){rec.caster=sc.casterProgression;rec.ability=sc.spellcastingAbility;
          rec.cantrips=sc.cantripProgression;rec.prepared=sc.preparedSpellsProgression||sc.spellsKnownProgression;
          rec.static=(sc.preparedSpellsChange==="level");
          rec.spellList=null;}      // derived once every subclass is read, below (D130)
        const _sid=sc.shortName||sc.name||"";
        mergeProseGrants(rec,"subclass",_sid); attachCastMods(rec,"subclass",_sid); subclasses.push(rec);});
      const featCats=(j._meta&&j._meta.featCategories)||null;   // a brew may name its own
      (j.feat||[]).forEach(ft=>{if(!validName(ft)){report.errors.push(f.name+": unnamed feat skipped");return;}
        const cat=ft.category||"G";const hasSpells="additionalSpells"in ft;
        feats.push({name:ft.name,source:ft.source||"",group:bgroup(ft.source||""),book:bname(ft.source||""),reprinted:reprinted(ft),supersededBy:supersededBy(ft),page:ft.page??null,
          category:cat,fsClass:({"FS:R":"Ranger","FS:P":"Paladin","FS":"Fighter"})[cat]||null,hasSpells,
          catName:featCatName(cat,featCats),      // what the picker calls this category
          optFeatures:optProgression(ft),prereq:prereqText(ft,cat,featCats),prereqs:prereqBlocks(ft,cat,featCats),
          grants:hasSpells?parseGrants(ft.additionalSpells):{fixed:[],picks:[],expansions:[],optionGroups:[],ability:null},
          _raw:ft});});
      (j.optionalfeature||[]).forEach(o=>{if(!validName(o)){report.errors.push(f.name+": unnamed optional feature skipped");return;}
        const hasSpells="additionalSpells"in o;
        optfeats.push({name:o.name,source:o.source||"",group:bgroup(o.source||""),book:bname(o.source||""),
          reprinted:reprinted(o),supersededBy:supersededBy(o),page:o.page??null,types:o.featureType||[],prereq:prereqText(o),prereqs:prereqBlocks(o),hasSpells,
          grants:hasSpells?parseGrants(o.additionalSpells):{fixed:[],picks:[],expansions:[],optionGroups:[],ability:null},
          _raw:o});});
      // `base` is the parent species a lineage hangs off — the picker groups on it (D46).
      // D127: a species that SPLITS into lineages emits several records and the reprint
      // stamp belongs to every one of them. The old code stamped races[races.length-1]
      // after the call (so a split species flagged only its last lineage) and the subrace
      // loop never stamped at all — which is why the Gith and Half-Elf twins read as
      // originals and showed up twice in the picker.
      const emitSpecies=(name,source,blocks,page,base,lineage,reprint,superseded)=>{ page=page??null;
        if(typeof name!=="string"||!name.trim()){report.errors.push(f.name+": unnamed species skipped");return;}
        const start=races.length;
        const named=(blocks||[]).filter(b=>b.name);
        if(named.length>1)named.forEach(b=>races.push({name:`${name} — ${b.name}`,source,group:bgroup(source),book:bname(source),page,base:name,lineage:b.name,grants:parseGrants([b])}));
        else races.push({name,source,group:bgroup(source),book:bname(source),page,base:base||name,lineage:base?(lineage||name):"",grants:parseGrants(blocks)});
        for(let i=start;i<races.length;i++){races[i].reprinted=!!reprint;races[i].supersededBy=superseded??null;}};
      (j.race||[]).forEach(rc=>{emitSpecies(rc.name,rc.source||"",rc.additionalSpells,rc.page,undefined,undefined,
        reprinted(rc),supersededBy(rc));});
      (Array.isArray(j.subrace)?j.subrace:[]).forEach(rc=>{const base=rc.raceName||"",nm=rc.name||"";
        if(!rc.additionalSpells)return;emitSpecies(nm?`${base} (${nm})`:base,rc.source||"",rc.additionalSpells,rc.page,base||null,nm||null,
          reprinted(rc),supersededBy(rc));});
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
    // fold on use — the spell map is keyed lowercase, and a lookup-shaped file is not
    // guaranteed to be (spells/sources.json is not)
    Object.entries(byname).forEach(([nameL,acc])=>{const sp=spells[spellKey(nameL,srcL)];if(!sp||!acc||typeof acc!=="object")return;
      Object.entries(acc.class||{}).forEach(([csrc,cmap])=>{Object.keys(cmap||{}).forEach(cls=>sp.cls.push([cls,csrc]));});
      Object.entries(acc.subclass||{}).forEach(([ssrc,clsmap])=>{Object.entries(clsmap||{}).forEach(([cls,bysrc])=>{
        Object.entries(bysrc||{}).forEach(([scsrc,submap])=>{Object.entries(submap||{}).forEach(([sub,meta])=>{
          const nm=(meta&&typeof meta==="object"&&meta.name)?meta.name:sub;sp.sub.push([cls,nm,scsrc]);});});});});
      Object.entries(acc.feat||{}).forEach(([fsrc,fmap])=>{Object.keys(fmap||{}).forEach(ft=>sp.feat.push([ft,fsrc]));});
      Object.entries(acc.race||{}).forEach(([rsrc,rmap])=>{Object.keys(rmap||{}).forEach(rc=>sp.race.push([rc,rsrc]));});
    });});}

  report.spells=Object.keys(spells).length;report.classes=classes.length;report.subclasses=subclasses.length;
  report.feats=feats.length;report.species=races.length;
  // The lookup file is how CORE spells learn who can cast them; a brew carries that access
  // INLINE instead (D58). Warning off `lookup` alone therefore told every homebrew importer
  // to go add a file they don't need. Count the spells that actually ended up unreachable.
  report.noAccess=Object.keys(spells).reduce((n,k)=>{const s=spells[k];
    return n+((s.cls&&s.cls.length)||(s.sub&&s.sub.length)||(s.feat&&s.feat.length)||(s.race&&s.race.length)?0:1);},0);

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
      // a name-only ref can resolve to several sources; sort so the emission order is
      // canonical rather than an accident of file-read order (parity with extract.py)
      const cands=mm[2]?[monKey(mm[1],mm[2])]:(monByName[String(mm[1]).trim().toLowerCase()]||[]).slice().sort();
      cands.forEach(k=>{if(monPool[k]&&!seen[k]){seen[k]=1;keys.push(k);}});}
    if(sp.source==="XPHB"){ let fm; BFILTER_RE.lastIndex=0;
      while((fm=BFILTER_RE.exec(txt)))filterMatches(fm[1]).forEach(k=>{if(!seen[k]){seen[k]=1;keys.push(k);}});}
    const own=sp.statblock?monKey(sp.statblock.name,sp.statblock.source||""):null;
    const out=keys.filter(k=>k!==own);
    if(out.length)sp.creatures=out;
    delete sp._raw;});
  // forms a FEATURE adds to a spell — the mirror of extract.py's `_form_grants`. Narrow by
  // construction: the sentence has to name FORMS and carry {@creature} refs, and the record
  // has to reference a spell somewhere. **Keep identical to extract.py's _form_grants.**
  const formGrants=rec=>{
    const buf=[];walkText(rec.entries,buf);const txt=buf.join(" ");
    const sm=SPELL_REF_RE.exec(txt); if(!sm)return [];
    const spellKey=monKey(sm[1],sm[2]||(String(rec.source||"").startsWith("X")?"XPHB":"PHB"));
    const out=[];
    txt.split(/(?<=[.!?])\s+/).forEach(sent=>{
      if(!FORM_WORD_RE.test(sent))return;
      const keys=[],seen={};let m;CREATURE_RE.lastIndex=0;
      while((m=CREATURE_RE.exec(sent))){
        // a ref with no source resolves to every book that prints that creature, and the
        // two extractors read the bestiary in different orders — so the CANDIDATES are
        // sorted while the written order of the names is kept
        const cands=m[2]?[monKey(m[1],m[2])]:(monByName[String(m[1]).trim().toLowerCase()]||[]).slice().sort();
        cands.forEach(k=>{if(monPool[k]&&!seen[k]){seen[k]=1;keys.push(k);}});}
      if(keys.length)out.push({spell:spellKey,creatures:keys,
        mode:FIXED_FORM_RE.test(sent)?"only":"add"});});
    return out;};
  const referenced={};Object.values(spells).forEach(sp=>(sp.creatures||[]).forEach(k=>{referenced[k]=1;}));
  [].concat(optfeats,feats).forEach(rec=>{const fg=formGrants(rec._raw||rec);
    if(fg.length){rec.forms=fg;fg.forEach(g=>g.creatures.forEach(k=>{referenced[k]=1;}));}
    delete rec._raw;});
  const monsters={};Object.keys(referenced).sort().forEach(k=>{monsters[k]=statblock(monPool[k]);});

  // ---- which class list a subclass-provided spellcasting draws from (D130) ----
  // A subclass carrying its own `casterProgression` IS the whole of that character's
  // spellcasting — its class has no list of its own, so the subclass has to name one.
  // 5etools says which, structurally, in the subclass's own `additionalSpells`: one
  // `expanded` block per spell-level tier whose filter names the class
  // ("level=0|class=Wizard", "level=1|class=Wizard", …). Those are already parsed into
  // `grants.expansions`, so the rule reads the parse BOTH extractors share rather than
  // the raw JSON — a casting subclass added to the mirror later derives its own list.
  // Exactly ONE class name may come out; zero or several means the data does not say, so
  // we emit null and NAME the record in the import report rather than guessing (D31, the
  // same tripwire shape D127's `_mod` check has). **Keep identical to extract.py's
  // `sub_list_class` / `spell_list_for`.**
  const subListClass=rec=>{const names=new Set();
    ((rec.grants||{}).expansions||[]).forEach(e=>
      String(((e.filter||{}).class)||"").split(";").forEach(cn=>{cn=cn.trim();if(cn)names.add(cn);}));
    return names.size===1?[...names][0]:null;};
  const spellListFor=(rec,printings)=>{
    const name=subListClass(rec); if(!name)return null;
    const bySrc=printings[name.toLowerCase()]; if(!bySrc)return [name,null];
    for(const want of [rec.classSource,rec.source])if(want&&bySrc[want])return [bySrc[want],want];
    const first=Object.keys(bySrc).sort()[0];
    return [bySrc[first],first];};
  const printings={};
  classes.forEach(c=>{const k=String(c.name).toLowerCase();
    (printings[k]=printings[k]||{})[c.source]=c.name;});
  subclasses.forEach(s=>{ if(!("spellList" in s))return;   // only subclasses that cast
    s.spellList=spellListFor(s,printings);
    if(!s.spellList)report.errors.push(
      s.className+"|"+(s.classSource||"")+" :: "+(s.shortName||s.name)+"|"+s.source
      +" casts on its own progression but its data names no class list — spellList=null (D130)");});

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
  // "foundry-" missed `spells/foundry.json`, `class/foundry.json` and
  // `bestiary/foundry.json` — three files of Foundry STUBS that then overwrote the real
  // records by name|source (hollow spells, 12 phantom classes, 19 phantom subclasses).
  // extract.py never sees them: it globs `spells-*.json` / `class-*.json` explicitly.
  if(base.startsWith("fluff-")||base.startsWith("foundry"))return false;
  if(/(^|\/)(generated|roll20|foundry|makebrew|partnered)\//.test(p))return false;
  if(/(^|\/)(adventure|book)\//.test(p))return false;   // long-form prose
  return true;}
const isFoundryStub=o=>!!(o&&o.migrationVersion!==undefined);
function dropFoundryStubs(j){
  if(!j||typeof j!=="object")return j;
  let hit=false; const out={};
  for(const k of Object.keys(j)){
    const v=j[k];
    if(Array.isArray(v)&&v.some(isFoundryStub)){hit=true;out[k]=v.filter(x=>!isFoundryStub(x));}
    else out[k]=v;}
  return hit?out:j;}
function usefulJson(j){return !!(j&&typeof j==="object"&&((Array.isArray(j.monster)&&j.monster.some(carriedMonster))||Array.isArray(j.spell)||Array.isArray(j.class)||Array.isArray(j.subclass)||Array.isArray(j.feat)||Array.isArray(j.race)||Array.isArray(j.subrace)||Array.isArray(j.optionalfeature)||Array.isArray(j.book)||looksLikeLookup(j)));}
async function unzipJsonFiles(buf,onFile){
  if(typeof DecompressionStream==="undefined")throw new Error("This browser can’t unzip files. Upload the .json files individually instead.");
  const dv=new DataView(buf),bytes=new Uint8Array(buf),n=buf.byteLength,td=new TextDecoder();
  let eocd=-1;for(let i=n-22;i>=0&&i>=n-22-0xffff;i--){if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}}
  if(eocd<0)throw new Error("That doesn’t look like a .zip file.");
  const count=dv.getUint16(eocd+10,true),cdOff=dv.getUint32(eocd+16,true);
  // ZIP64. An archive past 4 GB or past 65,535 entries keeps its real count and
  // directory offset in a separate record and leaves SENTINELS in these two fields.
  // Walking to a sentinel offset lands in the middle of the file and the entry-signature
  // check then reports "that doesn't look like a .zip file" — which is a lie. The archive
  // is well-formed; this reader simply can't address it, and neither can a browser tab
  // hold something that size. Say that instead.
  if(count===0xffff||cdOff===0xffffffff)
    throw new Error("this is a ZIP64 archive (over 4 GB, or more than 65,535 files). A complete 5etools "
      +"data export is about 25 MB — if this is a whole-repository download, unzip it and stage just the "
      +".json files you want.");
  if(cdOff+4>n)throw new Error("this zip's directory points past the end of the file — it may be truncated "
      +"or still downloading.");
  const entries=[];let p=cdOff;
  for(let i=0;i<count;i++){ if(dv.getUint32(p,true)!==0x02014b50)break;
    const method=dv.getUint16(p+10,true),compSize=dv.getUint32(p+20,true);
    const nameLen=dv.getUint16(p+28,true),extraLen=dv.getUint16(p+30,true),commLen=dv.getUint16(p+32,true);
    const lho=dv.getUint32(p+42,true),name=td.decode(bytes.subarray(p+46,p+46+nameLen));
    entries.push({name,method,compSize,lho}); p+=46+nameLen+extraLen+commLen; }
  // `slimJson` throws away everything `carriedMonster` rejects the moment a bestiary file
  // is read, so the FEATURE files have to be unpacked first — that is where the forms a
  // feature adds to a familiar spell are named (Pact of the Chain's Imp is a CR 1 fiend
  // and survives no other test). Ordering the queue costs nothing; a second pass over the
  // archive would cost another full inflate.
  const featureFirst=n=>/^(optionalfeatures|feats)/i.test(String(n).split("/").pop())?0:1;
  resetFormRefs();
  const wanted=entries.filter(e=>zipWanted(e.name))
    .sort((a,b)=>readOrder(a.name)-readOrder(b.name)),out=[];
  for(let i=0;i<wanted.length;i++){const e=wanted[i];
    const lnameLen=dv.getUint16(e.lho+26,true),lextraLen=dv.getUint16(e.lho+28,true);
    const start=e.lho+30+lnameLen+lextraLen,comp=bytes.subarray(start,start+e.compSize);
    let raw; if(e.method===0)raw=comp; else if(e.method===8)raw=await inflateRaw(comp); else continue;
    let json=null;try{json=JSON.parse(td.decode(raw));}catch(_){json=null;}
    if(onFile)onFile(e.name,i+1,wanted.length);
    json=dropFoundryStubs(json);
    if(json&&usefulJson(json))out.push({name:e.name.split("/").pop(),json:slimJson(json)}); }
  return out;}

window.SB_extract={buildDigest,unzipJsonFiles,slimJson,zipWanted,dropFoundryStubs,readOrder,resetFormRefs,usefulJson};
})();
