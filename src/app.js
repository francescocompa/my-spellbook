"use strict";
const $ = s => document.querySelector(s);
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;};
const key=(n,s)=>n+"|"+s;
const ROMAN=["Cantrip","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];
// "0;1;2" -> "0-2", "1;3" -> "1, 3": collapse a level list into ranges
function fmtLevelList(str){const nums=String(str).split(/[;,]/).map(s=>s.trim()).filter(Boolean).map(Number).filter(n=>!isNaN(n)).sort((a,b)=>a-b);
  if(nums.length<2)return String(str);
  const out=[];let i=0;while(i<nums.length){let j=i;while(j+1<nums.length&&nums[j+1]===nums[j]+1)j++;out.push(i===j?`${nums[i]}`:`${nums[i]}-${nums[j]}`);i=j+1;}return out.join(", ");}
// tidy a human descriptor that embeds a semicolon level list ("level 0;1;2, …" -> "level 0-2, …")
const fmtDesc=s=>String(s||"").replace(/\blevel\s+(\d+(?:[;,]\d+)+)/gi,(m,g)=>"level "+fmtLevelList(g));
const ABIL={int:"Intelligence",wis:"Wisdom",cha:"Charisma",str:"Strength",dex:"Dexterity",con:"Constitution"};
const ABIL_SHORT={int:"Int",wis:"Wis",cha:"Cha",str:"Str",dex:"Dex",con:"Con"};
const CORE="XPHB";

// ── content assembly: baked bundle (window.__DATA__) ⊕ imported 5etools ⊕ custom homebrew ──
// Slot tables are rules (not content) so they live here — the no-data build still needs them.
const FULL_MC=[[2,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0],[4,2,0,0,0,0,0,0,0],[4,3,0,0,0,0,0,0,0],
  [4,3,2,0,0,0,0,0,0],[4,3,3,0,0,0,0,0,0],[4,3,3,1,0,0,0,0,0],[4,3,3,2,0,0,0,0,0],
  [4,3,3,3,1,0,0,0,0],[4,3,3,3,2,0,0,0,0],[4,3,3,3,2,1,0,0,0],[4,3,3,3,2,1,0,0,0],
  [4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,0,0],[4,3,3,3,2,1,1,1,0],[4,3,3,3,2,1,1,1,0],
  [4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]];
const PACT=[[1,1],[2,1],[2,2],[2,2],[2,3],[2,3],[2,4],[2,4],[2,5],[2,5],
  [3,5],[3,5],[3,5],[3,5],[3,5],[3,5],[4,5],[4,5],[4,5],[4,5]];
const HB_SRC="HB";   // homebrew source code
const LS_CUSTOM="spellForge.custom.v1", LS_IMPORT="spellForge.import.v1";
const BAKED = (typeof window!=="undefined" && window.__DATA__) || null;
const emptyDigest=()=>({meta:{},sources:{},spells:[],classes:[],subclasses:[],feats:[],races:[],fullMc:FULL_MC,pact:PACT});
function loadJSON(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}}
let DATA, IMPORTED=null, CUSTOM=null;
// mutable indexes — rebuilt after every content change
let CLS_BY={},SUB_BY={},SUBS_OF={},FEAT_BY={},RACE_BY={},SPELL_BY={},SPELL_BY_NAME={};
// edition de-duplication: when the same element (by identity) exists under several
// sources (2014 PHB + 2024 XPHB, TCE + …), keep only the newest and shadow the rest,
// so the pickers never list the same class/subclass/feat/species/spell twice.
// 5etools' `reprintedAs` flag catches base classes but is patchy on subclasses, so we
// collapse by name too. Homebrew (HB) is never shadowed and never shadows official.
let SHADOWED=new WeakSet();
const EDITION_RANK={XPHB:100,XDMG:99,XMM:98,PHB:50,DMG:49,MM:48};
const srcRank=s=>EDITION_RANK[s]!=null?EDITION_RANK[s]:10;
// higher = preferred winner: real (non-reprint) always beats a reprint, then newest edition
const dedupeScore=o=>(o.reprinted?0:1000)+srcRank(o.source);
function collapseEditions(list,idOf){
  const best={};
  list.forEach(o=>{ if(o.source===HB_SRC)return; const id=idOf(o);
    if(!best[id]||dedupeScore(o)>dedupeScore(best[id]))best[id]=o; });
  list.forEach(o=>{ if(o.source===HB_SRC)return; if(best[idOf(o)]!==o)SHADOWED.add(o); });
}
function buildIndexes(){
  SHADOWED=new WeakSet();
  collapseEditions(DATA.classes, c=>c.name.toLowerCase());
  collapseEditions(DATA.subclasses, s=>(s.className+"|"+(s.shortName||s.name)).toLowerCase());
  collapseEditions(DATA.feats, f=>f.name.toLowerCase());
  collapseEditions(DATA.races, r=>r.name.toLowerCase());
  collapseEditions(DATA.spells, s=>s.name.toLowerCase());
  CLS_BY={}; DATA.classes.forEach(c=>CLS_BY[key(c.name,c.source)]=c);
  SUB_BY={}; DATA.subclasses.forEach(s=>SUB_BY[key(s.name,s.source)]=s);
  SUBS_OF={}; DATA.subclasses.forEach(s=>{const k=key(s.className,s.classSource);(SUBS_OF[k]=SUBS_OF[k]||[]).push(s);});
  FEAT_BY={}; DATA.feats.forEach(f=>FEAT_BY[key(f.name,f.source)]=f);
  RACE_BY={}; DATA.races.forEach(r=>RACE_BY[key(r.name,r.source)]=r);
  SPELL_BY={}; DATA.spells.forEach(s=>SPELL_BY[key(s.name,s.source)]=s);
  SPELL_BY_NAME={}; DATA.spells.forEach(s=>{(SPELL_BY_NAME[s.name.toLowerCase()]=SPELL_BY_NAME[s.name.toLowerCase()]||[]).push(s);});
}
// assemble DATA from the three layers and rebuild indexes; call whenever content changes
function assembleData(){
  IMPORTED=loadJSON(LS_IMPORT); CUSTOM=loadJSON(LS_CUSTOM);
  const base=IMPORTED||BAKED||emptyDigest();
  DATA={meta:base.meta||{},sources:Object.assign({},base.sources),
    spells:(base.spells||[]).slice(),classes:base.classes||[],subclasses:base.subclasses||[],
    feats:base.feats||[],races:base.races||[],
    fullMc:base.fullMc||FULL_MC,pact:base.pact||PACT};
  const csp=(CUSTOM&&CUSTOM.spells)||[];
  if(csp.length){ DATA.spells=DATA.spells.concat(csp);
    DATA.sources[HB_SRC]=Object.assign({name:"Homebrew",group:"other"},DATA.sources[HB_SRC],
      {counts:{spells:csp.length,classes:0,subclasses:0,feats:0,species:0}}); }
  buildIndexes();
}
const hasContent=()=>DATA.spells.length>0||DATA.classes.length>0;
assembleData();

// ── state + persistence ─────────────────────────────────────────────────
const LS="spellForge.v2";
const state={
  classes:[], speciesKey:"", feats:[],
  enabledSources:new Set(Object.keys(DATA.sources)),   // all on by default
  filters:{q:"",levels:new Set(),school:"",cls:"",time:new Set(),comp:new Set(),tags:new Set(),save:"",dmg:"",book:"",reprint:"dedupe",chosen:false},
  chosen:{},   // rowId -> {cantrips:[], spells:[]}
  choices:{},  // choiceId -> option name | [spellKey,…]
  nextRowId:1,
};
const FILTER_DEFAULT=()=>({q:"",levels:new Set(),school:"",cls:"",time:new Set(),comp:new Set(),tags:new Set(),save:"",dmg:"",book:"",reprint:"dedupe",chosen:false});
function activeFilterCount(){const f=state.filters;let n=0;
  n+=f.levels.size?1:0;["school","cls","save","dmg","book"].forEach(k=>{if(f[k])n++;});
  n+=f.time.size?1:0;n+=f.comp.size?1:0;n+=f.tags.size?1:0;if(f.reprint!=="dedupe")n++;return n;}
function save(){ try{ localStorage.setItem(LS, JSON.stringify({
  classes:state.classes, speciesKey:state.speciesKey, feats:state.feats,
  nextRowId:state.nextRowId,
  enabledSources:[...state.enabledSources], chosen:state.chosen, choices:state.choices,
  filters:{...state.filters,levels:[...state.filters.levels],time:[...state.filters.time],comp:[...state.filters.comp],tags:[...state.filters.tags]},
})); }catch(e){} }
function load(){ try{ const s=JSON.parse(localStorage.getItem(LS)); if(!s)return;
  Object.assign(state,{classes:s.classes||[],speciesKey:s.speciesKey||"",feats:s.feats||[],
    chosen:s.chosen||{},choices:s.choices||{},nextRowId:s.nextRowId||1});
  if(s.enabledSources)state.enabledSources=new Set(s.enabledSources);
  if(s.filters)state.filters=Object.assign(state.filters,s.filters,{levels:new Set(s.filters.levels||[]),time:new Set(s.filters.time||[]),comp:new Set(s.filters.comp||[]),tags:new Set(s.filters.tags||[])});
  // migrate: ensure every class row has a stable id
  state.classes.forEach(r=>{if(r.id==null)r.id=state.nextRowId++;});
}catch(e){} }

const bookName=src=>src?(DATA.sources[src]&&DATA.sources[src].name||src):"";
const srcOn=src=>state.enabledSources.has(src);
// "dedupe" (default) hides both flagged reprints and edition-shadowed duplicates;
// "all" reveals every edition/source (the escape hatch to reach 2014 content).
const reprintOk=o=>state.filters.reprint==="all" || (!o.reprinted && !SHADOWED.has(o));
const visible=o=>srcOn(o.source)&&reprintOk(o);

// ── rules helpers ────────────────────────────────────────────────────────
function ecl(caster,l){return {full:l,artificer:Math.ceil(l/2),"1/2":Math.floor(l/2),"1/3":Math.floor(l/3)}[caster]||0;}
function maxLvlAt(caster,l){ if(caster==="pact")return DATA.pact[Math.min(l,20)-1][1];
  const e=ecl(caster,l); if(e<=0)return 0; const row=DATA.fullMc[Math.min(e,20)-1]||[];
  let m=0;row.forEach((n,i)=>{if(n>0)m=i+1;});return m; }

function resolveRow(row,idx){
  const c=CLS_BY[row.clsKey]; if(!c)return null;
  const sub=row.subKey?SUB_BY[row.subKey]:null;
  let caster=c.caster,ability=c.ability,prepArr=c.prepared,cantArr=c.cantrips,stat=c.static,listClass=[c.name,c.source],viaSub=null;
  if(!caster&&sub&&sub.caster){caster=sub.caster;ability=sub.ability;prepArr=sub.prepared;cantArr=sub.cantrips;stat=sub.static;listClass=sub.spellList||["Wizard","XPHB"];viaSub=sub;}
  const base={idx:row.id,row,c,sub,name:c.name,level:row.level};
  if(!caster)return {...base,caster:null,nonCaster:true};
  const lvl=row.level, isPact=caster==="pact";
  const maxLvl=maxLvlAt(caster,lvl);
  const prepared=prepArr?(prepArr[lvl-1]||0):0;
  const cantrips=cantArr?(cantArr[lvl-1]||0):0;
  // Wizard-style spellbook: cumulative known pool, separate from daily prepared
  const spellbook=c.spellbook?c.spellbook.slice(0,lvl).reduce((a,b)=>a+(b||0),0):null;
  let ownSlots=null,pact=null;
  if(isPact){const p=DATA.pact[Math.min(lvl,20)-1];pact={num:p[0],lvl:p[1]};}
  else ownSlots=(c.slots&&c.slots[lvl-1])||DATA.fullMc[Math.min(ecl(caster,lvl),20)-1];
  return {...base,caster,ability,static:!!stat,isPact,pact,maxLvl,ownSlots,prepared,cantrips,spellbook,prepArr,listClass,viaSub};
}
function capsFor(rec){
  if(!rec.caster||!rec.prepArr)return null;
  const cl=rec.level,total=rec.prepared,maxL=rec.maxLvl,cap={},dist={};
  if(rec.static){
    for(let L=1;L<=maxL;L++){
      let first=cl; for(let k=1;k<=cl;k++){if(maxLvlAt(rec.caster,k)>=L){first=k;break;}}
      const prior=first>1?(rec.prepArr[first-2]||0):0;
      cap[L]=Math.min(total,(total-prior)+Math.min(cl-first+1,prior));
    }
    for(let L=maxL;L>=1;L--)dist[L]=(cap[L]!=null?cap[L]:total)-(cap[L+1]||0);
  } else { for(let L=1;L<=maxL;L++)cap[L]=total; for(let L=1;L<=maxL;L++)dist[L]=0; if(maxL)dist[maxL]=total; }
  return {cap,dist,total,maxL,static:rec.static};
}

// ── grants / choices resolution ───────────────────────────────────────────
const SCHOOL_ABBR={A:"Abjuration",C:"Conjuration",D:"Divination",E:"Enchantment",V:"Evocation",I:"Illusion",N:"Necromancy",T:"Transmutation",P:"Psionic"};
function grantRec(name){const a=SPELL_BY_NAME[name.toLowerCase()]||[];return a.find(visible)||a[0];}
function grantsAny(g){return g&&((g.fixed||[]).length||(g.picks||[]).length||(g.expansions||[]).length||(g.optionGroups||[]).length);}
// spells matching a pick/expansion filter {level:'1;2',class:'Cleric;Druid',school:'E;D'}
function filterSpells(f){
  const levels=f.level!=null?new Set(String(f.level).split(";").map(Number)):null;
  const classes=f.class?f.class.split(";").map(s=>s.trim().toLowerCase()):null;
  const schools=f.school?f.school.split(";").map(s=>SCHOOL_ABBR[s.trim().toUpperCase()]||s):null;
  return DATA.spells.filter(sp=>{ if(!visible(sp))return false;
    if(levels&&!levels.has(sp.level))return false;
    if(classes&&!sp.cls.some(([cn,cs])=>classes.includes(cn.toLowerCase())&&srcOn(cs)))return false;
    if(schools&&!schools.includes(sp.school))return false;
    return true; });
}
// resolve a grant source's casting ability (default to the character's shared
// class stat; surface an ability choice when the source lets you pick).
function resolveAbility(grants,tok,sharedStat,out){
  const ab=grants&&grants.ability;
  if(!ab)return sharedStat||null;
  if(ab.fixed)return ab.fixed;
  if(ab.inherit)return sharedStat||null;
  if(ab.choose){const id=tok+":ab";
    const val=state.choices[id]||(sharedStat&&ab.choose.includes(sharedStat)?sharedStat:ab.choose[0]);
    if(out)out.choices.push({id,type:"ability",options:ab.choose,value:val,giver:out._giver||tok,giverSrc:out._giverSrc});
    return val;}
  return sharedStat||null;
}
// walk a grants object (or an option), collecting fixed/freeCasts/expansions/choices into `out`
function resolveGrants(grants,level,tok,giver,out,sharedStat,giverSrc){
  if(!grants)return;
  out._giver=giver; out._giverSrc=giverSrc;
  const ability=resolveAbility(grants,tok,sharedStat,out);
  // `label` (the granting feature's name, when known) is preferred over the generic giver
  const spellOut=(rec,kind,recharge,label)=>{ if(!rec)return; const src=label||giver;
    if(kind==="prepared")out.fixed.push({rec,src,recharge,ability});
    else out.freeCasts.push({name:rec.name,level:rec.level,recharge,src,ability,swappable:kind==="known"}); };
  (grants.fixed||[]).forEach(g=>{ if((g.atLevel||0)>level)return; spellOut(grantRec(g.spell.name),g.kind,g.recharge,g.feature); });
  (grants.expansions||[]).forEach(e=>{ if((e.atLevel||0)<=level)out.expansions.push(Object.assign({},e.filter,{_atLevel:e.atLevel||0})); });
  (grants.picks||[]).forEach((p,j)=>{ if((p.atLevel||0)>level)return; const id=tok+":pk"+j;
    out.choices.push({id,count:p.count,filter:p.filter,kind:p.kind,recharge:p.recharge,giver:p.feature||giver,giverSrc,desc:p.desc,type:"pick"});
    (state.choices[id]||[]).forEach(k=>spellOut(SPELL_BY[k],p.kind,p.recharge,p.feature)); });
  (grants.optionGroups||[]).forEach((og,i)=>{ const id=tok+":og"+i; const names=og.options.map(o=>o.name);
    const sel=state.choices[id]||names[0];
    out.choices.push({id,type:"option",options:names,value:sel,giver,giverSrc});
    const opt=og.options.find(o=>o.name===sel)||og.options[0];
    resolveGrants(opt,level,id,giver+" · "+sel,out,sharedStat,giverSrc); });
}

// ── compute ──────────────────────────────────────────────────────────────
function compute(){
  const records=state.classes.map(resolveRow).filter(Boolean);
  const casters=records.filter(r=>r.caster);
  const charLevel=state.classes.reduce((a,r)=>a+r.level,0);
  // multiclass slots
  const nonPact=casters.filter(r=>!r.isPact);
  let mcSlots=null,mcLevel=0;
  if(nonPact.length===1){mcSlots=nonPact[0].ownSlots;mcLevel=ecl(nonPact[0].caster,nonPact[0].level);}
  else if(nonPact.length>1){let full=0,half=0,third=0;
    nonPact.forEach(r=>{if(r.caster==="full")full+=r.level;else if(r.caster==="artificer"||r.caster==="1/2")half+=r.level;else if(r.caster==="1/3")third+=r.level;});
    mcLevel=full+Math.floor(half/2)+Math.floor(third/3); if(mcLevel>0)mcSlots=DATA.fullMc[Math.min(mcLevel,20)-1];}
  const pactRec=records.find(r=>r.isPact);

  // shared casting stat: default for feats/species that let you choose
  const classAbils=[...new Set(casters.map(r=>r.ability).filter(Boolean))];
  const sharedStat=classAbils.length===1?classAbils[0]:null;
  // resolve every source's grants + choices
  const gout={fixed:[],freeCasts:[],expansions:[],choices:[]};
  const recExp={};   // rowId -> [expansion filters] (Magical-Secrets style)
  records.forEach(r=>{
    const o={fixed:[],freeCasts:[],expansions:[],choices:[]};
    const rAb=r.ability||sharedStat;   // a class's own grants use that class's stat
    resolveGrants(r.c.grants,r.level,"c"+r.idx,r.name,o,rAb,r.c.source);
    if(r.sub)resolveGrants(r.sub.grants,r.level,"s"+r.idx,r.sub.name,o,rAb,r.sub.source);
    // Fighting Style that grants spells (Ranger→Druidic Warrior, Paladin→Blessed Warrior)
    const fsLvl=r.c.grantsFightingStyle;
    if(fsLvl&&r.level>=fsLvl){
      const fsFeats=DATA.feats.filter(f=>f.fsClass===r.c.name&&visible(f)&&grantsAny(f.grants));
      if(fsFeats.length){const id="c"+r.idx+":fs";
        const opts=[{name:"— none —",fixed:[],picks:[],expansions:[]}].concat(fsFeats.map(f=>({name:f.name,...f.grants})));
        const sel=state.choices[id]||"— none —";
        o.choices.push({id,type:"option",options:opts.map(x=>x.name),value:sel,giver:r.name+" · Fighting Style",giverSrc:r.c.source});
        const opt=opts.find(x=>x.name===sel); if(opt&&opt.name!=="— none —")resolveGrants(opt,r.level,id,r.name+" · "+opt.name,o,rAb,r.c.source);
      }
    }
    // order features (Cleric Divine Order, Druid Primal Order): pick the order
    // FIRST — only the caster-flavoured order grants an extra cantrip.
    (r.c.bonusChoices||[]).forEach((bc,i)=>{ if(r.level<(bc.atLevel||1))return;
      const feat=String(bc.label).split(" — ")[0];
      const cantripOrder=(String(bc.label).split(" — ")[1]||"").split(" (")[0].trim()||"Extra cantrip";
      const otherOrder=({"Divine Order":"Protector","Primal Order":"Warden"})[feat]||"Other benefit";
      const oid="c"+r.idx+":bo"+i, id="c"+r.idx+":bc"+i;
      const sel=state.choices[oid]||((state.choices[id]||[]).length?cantripOrder:otherOrder);
      o.choices.push({id:oid,type:"option",options:[otherOrder,cantripOrder],value:sel,giver:feat,giverSrc:r.c.source});
      if(sel===cantripOrder){
        o.choices.push({id,type:"pick",count:bc.count,filter:bc.filter,kind:"known",recharge:"cantrip",giver:feat+" · "+cantripOrder,giverSrc:r.c.source,desc:"choose a cantrip",optional:bc.optional});
        (state.choices[id]||[]).forEach(k=>{const rec=SPELL_BY[k];if(rec)o.freeCasts.push({name:rec.name,level:rec.level,recharge:"always known",src:feat+" · "+cantripOrder,ability:rAb});});
      }
    });
    recExp[r.idx]=o.expansions;
    o.fixed.forEach(g=>g.srcIdx=r.idx);   // tag class-owned always-prepared grants with the row
    gout.fixed.push(...o.fixed);gout.freeCasts.push(...o.freeCasts);gout.choices.push(...o.choices);
  });
  state.feats.forEach(fk=>{const f=FEAT_BY[fk];if(f)resolveGrants(f.grants,charLevel,"f"+fk,f.name,gout,sharedStat,f.source);});
  if(state.speciesKey){const sp=RACE_BY[state.speciesKey];if(sp)resolveGrants(sp.grants,charLevel,"r",sp.name,gout,sharedStat,sp.source);}

  // eligible pool = each caster's own list + its active expansions
  const pool=new Map(); // spellKey -> {sp,takers:[{idx,name,cantrip}],grants:[],srcs:Set}
  const want=sp=>{const k=key(sp.name,sp.source);let e=pool.get(k);if(!e){e={sp,takers:[],grants:[],srcs:new Set(),always:new Set()};pool.set(k,e);}return e;};
  casters.forEach(r=>{
    const ownCls=r.listClass[0].toLowerCase();
    const access=[{cls:ownCls,levels:null,off:false}];
    (recExp[r.idx]||[]).forEach(f=>{const lv=f.level!=null?new Set(String(f.level).split(";").map(Number)):null;
      (f.class?f.class.split(";"):[]).forEach(cn=>{const c=cn.trim().toLowerCase();access.push({cls:c,levels:lv,off:c!==ownCls});});});
    DATA.spells.forEach(sp=>{ if(!visible(sp))return; if(sp.level>r.maxLvl)return;
      for(const a of access){ if(a.levels&&!a.levels.has(sp.level))continue;
        if(sp.cls.some(([cn,cs])=>cn.toLowerCase()===a.cls&&srcOn(cs))){ const e=want(sp); e.takers.push({idx:r.idx,name:r.name,cantrip:sp.level===0}); if(a.off)e.srcs.add("Magical Secrets"); break; } }
    });
  });
  // fixed grants become always-prepared/free picks in the pool
  const freeCasts=gout.freeCasts;
  gout.fixed.forEach(g=>{const e=want(g.rec);e.srcs.add(g.src);if(!e.grants.some(x=>x.src===g.src))e.grants.push({src:g.src,recharge:g.recharge,ability:g.ability});
    if(g.srcIdx!=null)e.always.add(g.srcIdx);});   // its own class can't re-prepare an always-prepared spell
  freeCasts.forEach(fc=>{const rec=grantRec(fc.name);if(rec){want(rec).srcs.add(fc.src);}});
  const choices=gout.choices;

  // caps per record + cart validation
  const caps={}; casters.forEach(r=>caps[r.idx]=capsFor(r));
  const cart={};
  casters.forEach(r=>{ const ch=state.chosen[r.idx]||{cantrips:[],spells:[]};
    const cp=caps[r.idx];
    const spItems=(ch.spells||[]).map(k=>SPELL_BY[k]).filter(Boolean);
    // Wizard-style spellbook. Unlike a daily caster, the book grows a FIXED amount per
    // level, each addition no higher than the current top slot — so the count at each
    // spell level is capped (progressive, and NOT retrainable). capsFor-style ceiling
    // built from the book-growth array (no swap term). Beyond that free allowance the
    // wizard may still COPY spells into the book (its unique option) — those exceed the
    // per-level cap and are shown separately, not flagged as an error.
    let known=null;
    if(r.spellbook!=null && r.c.spellbook){
      const add=r.c.spellbook, cum=[]; let t=0;
      for(let k=0;k<r.level;k++){t+=add[k]||0;cum.push(t);}
      const bookTotal=cum[r.level-1]||0, bcap={};
      for(let L=1;L<=r.maxLvl;L++){ let first=r.level;
        for(let k=1;k<=r.level;k++){if(maxLvlAt(r.caster,k)>=L){first=k;break;}}
        const before=first>1?(cum[first-2]||0):0; bcap[L]=Math.max(0,bookTotal-before); }
      known={total:bookTotal,maxL:r.maxLvl,cap:bcap,book:true,prepares:r.prepared};
    }
    // Per-spell-level ceilings. A known/level-swap caster (static) learns spells on
    // level-up capped at its top slot, so the count it can hold at a given level is
    // bounded — capsFor() gives the cumulative ceiling cap[L] = max spells at level ≥ L.
    // Flag a level "over" when the running ≥L total exceeds it. Daily preparers are free
    // (flat total). Wizard books never error on the per-level cap — exceeding it is the
    // legal "copy into spellbook" case (shown as copied, not over); only spells above the
    // top castable level are illegal.
    const overLevels={};
    if(known&&known.book){
      if(spItems.some(sp=>sp.level>known.maxL))overLevels[known.maxL+1]=true;
    } else if(cp){ let ge=0;
      for(let L=cp.maxL;L>=1;L--){ ge+=spItems.filter(sp=>sp.level===L).length;
        const capL=cp.cap[L]!=null?cp.cap[L]:cp.total;
        if(ge>capL)overLevels[L]=true; }
      if(spItems.some(sp=>sp.level>cp.maxL))overLevels[cp.maxL+1]=true;
    }
    // Magical-Secrets style expansion: spells drawn from OTHER lists are capped
    // at (prepared gained since the feature) + (retrains since the feature).
    // Only genuine other-list expansions count — a subclass whose expansion is
    // its own list (e.g. Eldritch Knight → Wizard) is NOT Magical Secrets.
    const ownCls=r.listClass[0].toLowerCase();
    const offExps=(recExp[r.idx]||[]).filter(f=>String(f.class||"").split(";").some(cn=>{const c=cn.trim().toLowerCase();return c&&c!==ownCls;}));
    let ms=null;
    if(offExps.length && r.prepArr){
      const offCount=spItems.filter(sp=>!sp.cls.some(([cn,cs])=>cn.toLowerCase()===ownCls&&srcOn(cs))).length;
      const onset=Math.max(1,Math.min(...offExps.map(f=>f._atLevel||1)));
      const before=onset>=2?(r.prepArr[onset-2]||0):0;
      const newSince=Math.max(0,(r.prepArr[r.level-1]||0)-before);
      const retrains=Math.max(0,r.level-onset+1);
      const cap=Math.min(r.prepared,newSince+retrains);
      ms={offCount,cap,onset,over:offCount>cap};
    }
    const spellCap=known?known.total:r.prepared;
    cart[r.idx]={cantrips:ch.cantrips||[],spells:ch.spells||[],caps:cp,ms,known,
      cantOver:(ch.cantrips||[]).length>r.cantrips, spellOver:(ch.spells||[]).length>spellCap, overLevels};
  });

  return {records,casters,charLevel,mcSlots,mcLevel,pactRec,pool,freeCasts,caps,cart,choices,sharedStat};
}

// ── toggling picks ───────────────────────────────────────────────────────
function toggle(idx,spellKey,cantrip){
  const ch=state.chosen[idx]=state.chosen[idx]||{cantrips:[],spells:[]};
  const arr=cantrip?"cantrips":"spells";
  const i=ch[arr].indexOf(spellKey);
  if(i>=0)ch[arr].splice(i,1); else ch[arr].push(spellKey);
  save(); render();
}
function removeChosen(idx,spellKey){ const ch=state.chosen[idx];if(!ch)return;
  ["cantrips","spells"].forEach(a=>{const i=ch[a].indexOf(spellKey);if(i>=0)ch[a].splice(i,1);});save();render(); }

// ── render ───────────────────────────────────────────────────────────────
let R=null, curTab="build";
function render(){ maybeOnboard(); R=compute(); renderChoices(); renderSlots(); renderCart(); renderSpells(); renderFeatBudget();
  if(curTab==="table")renderTable(); save(); }

// ── choices panel ──────────────────────────────────────────────────────────
function renderChoices(){
  const card=$("#choicesCard"), body=$("#choicesBody"); body.innerHTML="";
  const ch=R.choices;
  card.classList.toggle("hidden",!ch.length);
  const pending=ch.filter(c=>c.type==="pick"&&!c.optional&&(state.choices[c.id]||[]).length<c.count).length;
  $("#choicesChip").textContent = ch.length? (pending?`${pending} pending`:"all set"):"";
  ch.forEach(c=>{
    const row=el("div","choicerow");
    const srcTag=c.giverSrc?`<span class="csrc" title="${esc(bookName(c.giverSrc))}">${esc(c.giverSrc)}</span>`:"";
    if(c.type==="option"||c.type==="ability"){
      const isAb=c.type==="ability";
      const cg=el("div","cg"); cg.innerHTML=`<b>${esc(c.giver)}</b>${srcTag}<span class="cwhat">${isAb?"casting ability":"choose one"}</span>`; row.append(cg);
      const sel=el("select"); c.options.forEach(o=>sel.append(new Option(isAb?ABIL[o]||o:o,o)));
      sel.value=c.value; sel.onchange=()=>{state.choices[c.id]=sel.value; render();}; row.append(sel);
    } else { // pick
      const have=(state.choices[c.id]||[]).length;
      const cg=el("div","cg"); cg.innerHTML=`<b>${esc(c.giver)}</b>${srcTag}<span class="cwhat">${esc(fmtDesc(c.desc)||"choose")} <span class="need">${have}/${c.count}</span></span>`; row.append(cg);
      const picks=el("div","picks");
      (state.choices[c.id]||[]).forEach(k=>{const sp=SPELL_BY[k];if(!sp)return;
        const chip=el("span","cartchip");chip.append(el("span","lv",sp.level===0?"C":String(sp.level)));const nm=el("span",null,sp.name);attachSpell(nm,sp);chip.append(nm);
        const x=el("button",null,"×");x.onclick=()=>{state.choices[c.id]=(state.choices[c.id]||[]).filter(v=>v!==k);render();};chip.append(x);picks.append(chip);});
      const btn=el("button","pickbtn"+(have>=c.count?" done":" needclr"), have>=c.count?"edit":`choose ${c.count-have}`);
      btn.onclick=()=>openPick(c); picks.append(btn); row.append(picks);
    }
    body.append(row);
  });
}

// ── spell-pick modal ───────────────────────────────────────────────────────
let PICK=null;
function openPick(choice){ PICK={...choice,levelSet:new Set()}; $("#pickSearch").value="";
  $("#pickTitle").textContent="Choose "+choice.count+(choice.count>1?" spells":" spell");
  $("#pickSub").textContent=choice.giver+(choice.desc?" · "+fmtDesc(choice.desc):"");
  $("#pickModal").classList.remove("hidden"); renderPickList(); }
// prepare-by-level: click a level tile → prepare from that class's eligible spells (levels 1..maxLevel)
function openLevelPick(idx,maxLevel){ const rec=R.casters.find(r=>r.idx===idx); if(!rec)return;
  PICK={classIdx:idx,maxLevel,levelSet:new Set()}; $("#pickSearch").value="";
  $("#pickTitle").textContent=classLabel(rec)+" — prepare spells";
  $("#pickSub").textContent=`level 1–${ROMAN[maxLevel]} · click to prepare or unprepare`;
  $("#pickModal").classList.remove("hidden"); renderPickList(); }
function renderPickList(){
  const list=$("#pickList"); list.innerHTML="";
  const q=$("#pickSearch").value.toLowerCase(), isClass=PICK.classIdx!=null;
  let base = isClass
    ? [...R.pool.values()].filter(e=>e.takers.some(t=>t.idx===PICK.classIdx)&&!(e.always&&e.always.has(PICK.classIdx))&&e.sp.level>=1&&e.sp.level<=PICK.maxLevel).map(e=>e.sp)
    : filterSpells(PICK.filter);
  // quick level filters (present levels only)
  const presentLevels=[...new Set(base.map(s=>s.level))].sort((a,b)=>a-b);
  const lvBox=$("#pickLevels");
  if(lvBox)buildToggleRow(lvBox,presentLevels.map(l=>[String(l),l===0?"C":String(l)]),PICK.levelSet,true,renderPickList);
  const plb=$("#pickLevelBtn");if(plb)plb.innerHTML="Levels"+(PICK.levelSet.size?` <span class="badge">${PICK.levelSet.size}</span>`:"");
  let items=base.filter(sp=>(!q||sp.name.toLowerCase().includes(q))&&(!PICK.levelSet.size||PICK.levelSet.has(sp.level)));
  items.sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
  const cur = isClass ? new Set((state.chosen[PICK.classIdx]||{}).spells||[]) : new Set(state.choices[PICK.id]||[]);
  items.slice(0,300).forEach(sp=>{const k=key(sp.name,sp.source);const on=cur.has(k);
    const d=el("div","sp"+(on?" chosen":""));
    const nm=el("div","nm",sp.name); attachSpell(nm,sp); d.append(nm);
    const meta=el("div","meta");[ROMAN[sp.level],sp.school,sp.time,sp.range,sp.source!==CORE?sp.book:""].filter(Boolean).forEach(x=>meta.append(el("span",null,x)));d.append(meta);
    const take=el("div","take");const b=el("button","tk"+(on?" on":""),on?(isClass?"✓ prepared":"✓ picked"):(isClass?"+ prepare":"+ pick"));
    b.onclick=()=>{ if(isClass){ toggle(PICK.classIdx,k,false); renderPickList(); return; }
      let a=state.choices[PICK.id]||[];
      if(a.includes(k))a=a.filter(v=>v!==k); else if(a.length<PICK.count)a=[...a,k]; else return;
      state.choices[PICK.id]=a; renderPickList(); render();};
    take.append(b);d.append(take);list.append(d);});
  if(!items.length)list.append(el("div","empty",isClass?"No eligible spells at this level yet.":"No matching spells for this choice."));
}

// ── prepare-daily modal: one step per source that re-prepares each long rest ──
let PREP=null;
const prepCasters=()=>R.casters.filter(r=>!r.static);   // static (level-swap) lists don't re-prepare
function openPrepDaily(){ const list=prepCasters(); if(!list.length)return;
  PREP={idxs:list.map(r=>r.idx),step:0,search:"",levelSet:new Set()};
  $("#prepModal").classList.remove("hidden"); renderPrepStep(); }
const prepRec=()=>R.casters.find(r=>r.idx===PREP.idxs[PREP.step]);
function renderPrepStep(){
  const rec=prepRec(); if(!rec){ $("#prepModal").classList.add("hidden"); return; }
  $("#prepSearch").value=PREP.search||""; PREP.levelSet=new Set();
  $("#prepTitle").textContent=classLabel(rec)+" — prepare spells";
  const steps=$("#prepSteps"); steps.innerHTML="";
  PREP.idxs.forEach((idx,i)=>{const r=R.casters.find(x=>x.idx===idx); if(!r)return;
    const b=el("button","prepstep"+(i===PREP.step?" on":""),classLabel(r));
    b.onclick=()=>{PREP.step=i;PREP.search="";renderPrepStep();};steps.append(b);});
  $("#prepPrev").style.visibility=PREP.step>0?"":"hidden";
  const last=PREP.step>=PREP.idxs.length-1;
  $("#prepNext").style.display=last?"none":"";
  $("#prepDone").style.display=last?"":"none";
  renderPrepList();
}
function renderPrepList(){
  const rec=prepRec(); if(!rec)return; const list=$("#prepList"); list.innerHTML="";
  const q=(PREP.search||"").toLowerCase(), cart=R.cart[rec.idx];
  const cap=cart.known?cart.known.total:rec.prepared;
  const cur=new Set((state.chosen[rec.idx]||{}).spells||[]);
  const have=[...cur].map(k=>SPELL_BY[k]).filter(s=>s&&s.level>=1).length, over=have>cap;
  $("#prepCount").innerHTML=`<b class="${over?"over":""}">${have} / ${cap}</b> <small>${cart.known?"in spellbook":"prepared"}</small>`;
  let base=[...R.pool.values()].filter(e=>e.takers.some(t=>t.idx===rec.idx)&&!(e.always&&e.always.has(rec.idx))&&e.sp.level>=1&&e.sp.level<=rec.maxLvl).map(e=>e.sp);
  const presentLevels=[...new Set(base.map(s=>s.level))].sort((a,b)=>a-b);
  buildToggleRow($("#prepLevels"),presentLevels.map(l=>[String(l),String(l)]),PREP.levelSet,true,renderPrepList);
  const plb=$("#prepLevelBtn");if(plb)plb.innerHTML="Levels"+(PREP.levelSet.size?` <span class="badge">${PREP.levelSet.size}</span>`:"");
  let items=base.filter(sp=>(!q||sp.name.toLowerCase().includes(q))&&(!PREP.levelSet.size||PREP.levelSet.has(sp.level)));
  items.sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
  items.slice(0,400).forEach(sp=>{const k=key(sp.name,sp.source);const on=cur.has(k);
    const d=el("div","sp"+(on?" chosen":""));
    const nm=el("div","nm",sp.name);attachSpell(nm,sp);d.append(nm);
    const meta=el("div","meta");[ROMAN[sp.level],shortSchool(sp.school),shortTime(sp.time),shortRange(sp.range)].filter(Boolean).forEach(x=>meta.append(el("span",null,x)));d.append(meta);
    const take=el("div","take");const b=el("button","tk"+(on?" on":"")+(on&&over?" over":""),on?"✓ prepared":"+ prepare");
    b.onclick=()=>{toggle(rec.idx,k,false);renderPrepList();};take.append(b);d.append(take);list.append(d);});
  if(!items.length)list.append(el("div","empty","No eligible spells at this level yet."));
}

// ── custom spell authoring (stepped) → stored as a Homebrew source ──────────
function saveCustom(){try{localStorage.setItem(LS_CUSTOM,JSON.stringify(CUSTOM||{spells:[]}));}catch(e){}}
const SCHOOLS=["Abjuration","Conjuration","Divination","Enchantment","Evocation","Illusion","Necromancy","Transmutation"];
const CT_OPTS=[["action","Action","action"],["bonus action","Bonus action","bonus"],["reaction","Reaction","reaction"],["1 minute","1 minute","long"],["10 minutes","10 minutes","long"],["1 hour","1 hour","long"],["8 hours","8 hours","long"],["24 hours","24 hours","long"]];
const DUR_OPTS=["Instantaneous","1 round","1 minute","10 minutes","1 hour","8 hours","24 hours","7 days","Until dispelled","Special"];
const SAVE_OPTS=[["","— none —"],["strength","Strength"],["dexterity","Dexterity"],["constitution","Constitution"],["intelligence","Intelligence"],["wisdom","Wisdom"],["charisma","Charisma"]];
const LVL_OPTS=[["0","Cantrip"],["1","1st"],["2","2nd"],["3","3rd"],["4","4th"],["5","5th"],["6","6th"],["7","7th"],["8","8th"],["9","9th"]];
const CSTEP_NAMES=["Identity","Mechanics","Lists & text"];
let CFORM=null,CSTEP=0;
function casterClassList(){const seen={};DATA.classes.forEach(c=>{if(!visible(c))return;
  const casterish=c.caster||(SUBS_OF[key(c.name,c.source)]||[]).some(s=>s.caster);
  if(casterish&&!seen[c.name])seen[c.name]=key(c.name,c.source);});
  return Object.keys(seen).sort().map(n=>({name:n,k:seen[n]}));}
function customBlank(){return {name:"",level:0,school:"Evocation",ritual:false,time:"action",range:"",duration:"Instantaneous",
  conc:false,v:true,s:false,m:false,mat:"",save:"",atk:false,dmg:"",classes:[],desc:"",higher:""};}
function openCustom(prefill,editing){
  CFORM=Object.assign(customBlank(),prefill||{});
  CSTEP=0; $("#customTitle").textContent=editing?"Edit custom spell":"New custom spell";
  $("#customModal").classList.remove("hidden"); renderCustomStep();}
function cerr(msg){$("#customErr").textContent=msg||"";}
function renderCustomStep(){
  cerr(""); const F=CFORM;
  const steps=$("#customSteps");steps.innerHTML="";
  CSTEP_NAMES.forEach((n,i)=>{const b=el("button","prepstep"+(i===CSTEP?" on":""),n);b.onclick=()=>{CSTEP=i;renderCustomStep();};steps.append(b);});
  $("#customPrev").style.visibility=CSTEP>0?"":"hidden";
  const last=CSTEP>=CSTEP_NAMES.length-1;
  $("#customNext").style.display=last?"none":""; $("#customDone").style.display=last?"":"none";
  const body=$("#customBody");body.innerHTML="";
  const field=(label,node,cls)=>{const d=el("div","cfield"+(cls?" "+cls:""));d.append(el("label","fld",label));d.append(node);return d;};
  const inp=(val,on,ph)=>{const i=el("input");i.value=val==null?"":val;if(ph)i.placeholder=ph;i.oninput=e=>on(e.target.value);return i;};
  const sel=(opts,val,on)=>{const s=el("select");opts.forEach(o=>{const[v,t]=Array.isArray(o)?o:[o,o];s.append(new Option(t,v));});s.value=val;s.onchange=e=>on(e.target.value);return s;};
  const chk=(label,val,on)=>{const l=el("label","cchk");const c=el("input");c.type="checkbox";c.checked=!!val;c.onchange=e=>on(e.target.checked);l.append(c);l.append(el("span",null,label));return l;};
  const g=el("div","cgrid");
  if(CSTEP===0){
    g.append(field("Name",inp(F.name,v=>F.name=v,"Ember Lash"),"c-2"));
    g.append(field("Level",sel(LVL_OPTS,String(F.level),v=>F.level=+v)));
    g.append(field("School",sel(SCHOOLS,F.school,v=>F.school=v),"c-2"));
    g.append(field("Duration",sel(DUR_OPTS,F.duration,v=>F.duration=v)));
    g.append(field("Casting time",sel(CT_OPTS.map(o=>[o[0],o[1]]),F.time,v=>F.time=v)));
    g.append(field("Range",inp(F.range,v=>F.range=v,"30 ft / Touch / Self")));
    const tg=el("div","ctoggles");tg.append(chk("Ritual",F.ritual,v=>F.ritual=v));tg.append(chk("Concentration",F.conc,v=>F.conc=v));
    g.append(field("Flags",tg,"c-full"));
  } else if(CSTEP===1){
    const comps=el("div","ctoggles");comps.append(chk("V",F.v,v=>F.v=v));comps.append(chk("S",F.s,v=>F.s=v));comps.append(chk("M",F.m,v=>F.m=v));
    g.append(field("Components",comps));
    g.append(field("Material (if M)",inp(F.mat,v=>F.mat=v,"a pinch of soot"),"c-2"));
    g.append(field("Required save",sel(SAVE_OPTS,F.save,v=>{F.save=v;if(v)F.atk=false;renderCustomStep();})));
    const atk=el("div","ctoggles");atk.append(chk("Spell attack roll",F.atk,v=>{F.atk=v;if(v)F.save="";renderCustomStep();}));
    g.append(field("Or attack",atk,"c-2"));
    g.append(field("Damage types",inp(F.dmg,v=>F.dmg=v,"fire, cold  (comma-separated)"),"c-full"));
  } else {
    const chips=el("div","cchips c-full");
    casterClassList().forEach(c=>{const on=F.classes.includes(c.k);
      const b=el("button","cchip"+(on?" on":""),c.name);
      b.onclick=()=>{F.classes=on?F.classes.filter(x=>x!==c.k):[...F.classes,c.k];renderCustomStep();};chips.append(b);});
    g.append(field("On which class lists",chips,"c-full"));
    const dsc=el("textarea","carea");dsc.value=F.desc;dsc.placeholder="What the spell does…";dsc.oninput=e=>F.desc=e.target.value;
    g.append(field("Description",dsc,"c-full"));
    const hi=el("textarea","carea");hi.value=F.higher;hi.placeholder="At higher levels…";hi.oninput=e=>F.higher=e.target.value;
    g.append(field("At higher levels",hi,"c-full"));
  }
  body.append(g);
  if(CSTEP===CSTEP_NAMES.length-1)body.append(customPreview());
}
function customSpellObj(){const f=CFORM;
  const timeCat=(CT_OPTS.find(o=>o[0]===f.time)||[])[2]||"long";
  const rng=(f.range||"").trim()||"Self";const rl=rng.toLowerCase();
  const rcat=/^self/.test(rl)?"self":/touch/.test(rl)?"touch":/special/.test(rl)?"special":"ranged";
  return {name:(f.name||"").trim(),source:HB_SRC,group:"other",book:"Homebrew",level:+f.level||0,
    school:f.school,time:f.time,tcat:timeCat,range:rng,rcat,
    comp:{v:!!f.v,s:!!f.s,m:!!f.m,mat:(f.mat||"").trim()||null},ritual:!!f.ritual,conc:!!f.conc,
    dmg:(f.dmg||"").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean),cond:[],
    save:f.save?[f.save]:[],atk:!!f.atk,durTxt:f.duration,
    desc:(f.desc||"").trim()?f.desc.trim().split(/\n\s*\n/):[],
    higher:(f.higher||"").trim()?f.higher.trim().split(/\n\s*\n/):[],
    reprinted:false,cls:f.classes.map(k=>{const p=k.split("|");return [p[0],p[1]];}),sub:[],feat:[],race:[]};}
function customPreview(){const sp=customSpellObj();const box=el("div","cpreview");
  box.append(el("div","cpv-h",sp.name||"Untitled spell"));
  box.append(el("div","cpv-sub",metaLine(sp)+(sp.cls.length?" · "+sp.cls.map(c=>c[0]).join(", "):"")));
  const line=el("div","cpv-meta");[sp.time,sp.range,sp.durTxt,compText(sp)].forEach(x=>line.append(el("span",null,x)));box.append(line);
  const dfn=defenceHTML(sp);if(dfn!=="—"){const d=el("div","cpv-def");d.innerHTML="Defence — "+dfn;box.append(d);}
  if(sp.desc.length){const p=el("div","cpv-desc");p.innerHTML=ccText(sp.desc[0].slice(0,220))+(sp.desc[0].length>220?"…":"");box.append(p);}
  return box;}
function compileCustom(){const sp=customSpellObj();
  if(!sp.name){cerr("Give the spell a name");CSTEP=0;renderCustomStep();return;}
  if(!sp.cls.length){cerr("Tag at least one class list");CSTEP=2;renderCustomStep();return;}
  CUSTOM=CUSTOM||{spells:[]};
  const i=CUSTOM.spells.findIndex(x=>x.name.toLowerCase()===sp.name.toLowerCase());
  if(i>=0)CUSTOM.spells[i]=sp;else CUSTOM.spells.push(sp);
  saveCustom();state.enabledSources.add(HB_SRC);
  assembleData();$("#customModal").classList.add("hidden");refreshAll();render();}
function customFromSpell(sp){return {name:sp.name,level:sp.level,school:sp.school,ritual:!!sp.ritual,
  time:sp.time,range:sp.range,duration:sp.durTxt,conc:!!sp.conc,
  v:!!sp.comp.v,s:!!sp.comp.s,m:!!sp.comp.m,mat:sp.comp.mat||"",
  save:(sp.save&&sp.save[0])||"",atk:!!sp.atk,dmg:(sp.dmg||[]).join(", "),
  classes:(sp.cls||[]).map(c=>c[0]+"|"+c[1]),desc:(sp.desc||[]).join("\n\n"),higher:(sp.higher||[]).join("\n\n")};}
function deleteCustom(sp){if(!CUSTOM)return;
  CUSTOM.spells=CUSTOM.spells.filter(x=>x.name.toLowerCase()!==sp.name.toLowerCase());saveCustom();
  const k=key(sp.name,sp.source);Object.values(state.chosen).forEach(c=>["cantrips","spells"].forEach(a=>{if(c[a])c[a]=c[a].filter(x=>x!==k);}));
  assembleData();refreshAll();render();}

// ── 5etools importer: parse raw files in-browser via SB_extract ─────────────
let IMPORT_STAGE=[];
function looksLookupFile(j){const ks=Object.keys(j||{});if(!ks.length)return false;const v=j[ks[0]];if(!v||typeof v!=="object")return false;const vv=v[Object.keys(v)[0]];return !!(vv&&typeof vv==="object"&&(vv.class||vv.subclass||vv.feat||vv.race));}
function countFile(j){const parts=[];[["spell","sp"],["class","cls"],["subclass","sub"],["feat","ft"],["race","spc"],["book","bk"]].forEach(([k,l])=>{if(Array.isArray(j[k])&&j[k].length)parts.push(j[k].length+" "+l);});
  if(!parts.length&&looksLookupFile(j))parts.push("lookup");return parts.join(" · ")||"?";}
function renderImportStage(){const box=$("#importStaged");if(!box)return;box.innerHTML="";
  IMPORT_STAGE.forEach((f,i)=>{const chip=el("span","stagechip"+(f.error?" bad":""));
    chip.append(el("span",null,f.name));
    chip.append(el("span","k",f.error?"invalid":countFile(f.json)));
    const x=el("button",null,"×");x.onclick=()=>{IMPORT_STAGE.splice(i,1);renderImportStage();};chip.append(x);box.append(chip);});
  const bb=$("#importBuild");if(bb)bb.disabled=!IMPORT_STAGE.some(f=>!f.error);}
async function stageZip(file){const rep=$("#importReport");
  try{rep.textContent="Reading "+file.name+"…";const buf=await file.arrayBuffer();
    const entries=await window.SB_extract.unzipJsonFiles(buf);
    if(!entries.length){rep.textContent="No recognised 5etools files in "+file.name+".";return;}
    entries.forEach(e=>IMPORT_STAGE.push(e));rep.textContent="";renderImportStage();}
  catch(e){rep.textContent="Couldn’t read "+file.name+": "+(e.message||e);}}
function stageFiles(fileList){[...fileList].forEach(file=>{
    if(/\.zip$/i.test(file.name)){stageZip(file);return;}
    const rd=new FileReader();
    rd.onload=()=>{try{IMPORT_STAGE.push({name:file.name,json:JSON.parse(rd.result)});}catch(e){IMPORT_STAGE.push({name:file.name,error:true});}renderImportStage();};
    rd.onerror=()=>{IMPORT_STAGE.push({name:file.name,error:true});renderImportStage();};
    rd.readAsText(file);});}
function importSummary(r){return `${r.spells} spells · ${r.classes} classes · ${r.subclasses} subclasses · ${r.feats} feats · ${r.species} species`+(r.lookup?"":" · ⚠ no spell-source lookup — spells won’t know their classes; add generated/gendata-spell-source-lookup.json");}
function openImport(welcome){closeMenu();const r=$("#importReport");if(r)r.textContent=IMPORTED?"Imported data is active. Building again replaces it.":"";
  const w=$("#importWelcome");if(w)w.classList.toggle("hidden",!welcome);
  const t=$("#importTitle");if(t)t.textContent=welcome?"Load your spell data":"Import 5etools data";
  renderImportStage();$("#importModal").classList.remove("hidden");}
function buildImport(){
  const files=IMPORT_STAGE.filter(f=>!f.error).map(f=>({name:f.name,json:f.json}));
  const rep=$("#importReport");
  if(!files.length){rep.textContent="Stage at least one valid file first.";return;}
  if(!window.SB_extract){rep.textContent="Importer failed to load.";return;}
  const res=window.SB_extract.buildDigest(files);const digest=res.digest,report=res.report;
  if(!digest.spells.length&&!digest.classes.length){rep.textContent="No spells or classes found in these files.";return;}
  try{localStorage.setItem(LS_IMPORT,JSON.stringify(digest));}catch(e){rep.textContent="Too large to store in this browser. Import fewer books at once.";return;}
  state.enabledSources=new Set(Object.keys(digest.sources));state.enabledSources.add(HB_SRC);
  assembleData();pruneState();
  IMPORT_STAGE=[];renderImportStage();refreshAll();render();
  rep.innerHTML=`<b style="color:var(--good)">Loaded.</b> ${importSummary(report)}. Close to see it.`;}
function clearImport(){try{localStorage.removeItem(LS_IMPORT);}catch(e){}assembleData();pruneState();refreshAll();render();}
// no-content build (public deploy): pop the import modal in welcome mode, once
let onboardShown=false;
function maybeOnboard(){
  if(hasContent()){onboardShown=false;return;}
  if(onboardShown)return; onboardShown=true;
  openImport(true);}

// ── table view ─────────────────────────────────────────────────────────────
const tableOpts={group:"level"};
// short recharge label. cantrips / always-known are effectively at-will.
function rechargeShort(recharge,isCantrip){
  const r=String(recharge||"").toLowerCase();
  if(isCantrip||/at will/.test(r))return "at will";
  const m=r.match(/(\d+)\s*\/\s*(long|short)/); // "2/long rest" style, if ever present
  if(m)return m[1]+"/"+(m[2][0].toUpperCase()==="L"?"LR":"SR");
  if(/long rest/.test(r))return "1/LR";
  if(/short rest/.test(r))return "1/SR";
  if(/always/.test(r))return "at will";
  return "—";
}
// compact table values: school / casting time / duration / range
const SCHOOL_SHORT={Abjuration:"Abj.",Conjuration:"Conj.",Divination:"Div.",Enchantment:"Ench.",Evocation:"Evoc.",Illusion:"Illus.",Necromancy:"Necro.",Transmutation:"Trans.",Psionic:"Psi."};
const shortSchool=s=>SCHOOL_SHORT[s]||s;
function shortDuration(d){ d=String(d||"");
  if(/^instant/i.test(d))return "Instant.";
  if(/^until dispelled\/trig/i.test(d))return "Dispel/trig";
  if(/^until dispelled/i.test(d))return "Until disp.";
  if(/^concentration/i.test(d))return d; // shouldn't reach; conc has own column
  if(/^special/i.test(d))return "Special";
  return d.replace(/\bminutes?\b/gi,"m").replace(/\bhours?\b/gi,"h").replace(/\brounds?\b/gi,"rd").replace(/\bdays?\b/gi,"d").replace(/\s+/g,""); }
function shortTime(t){ t=String(t||"");
  if(t==="action")return "A"; if(t==="bonus action")return "BA"; if(t==="reaction")return "RA";
  return shortDuration(t); }
const shortRange=r=>String(r||"").replace(/\bfeet\b/g,"ft").replace(/\bfoot\b/g,"ft");
// required-defence cell: save ability chip(s), else an attack-roll chip, else —
const SAVE_SHORT={strength:"str",dexterity:"dex",constitution:"con",intelligence:"int",wisdom:"wis",charisma:"cha"};
function defenceHTML(sp){
  const saves=(sp.save||[]).map(s=>SAVE_SHORT[s]||s).filter(Boolean);
  if(saves.length)return saves.map(ab=>`<span class="savechip ${ab}" title="${esc(ABIL[ab]||ab)} saving throw">${esc(ABIL_SHORT[ab]||ab)}</span>`).join(" ");
  if(sp.atk)return `<span class="savechip atk" title="Spell attack roll">Atk</span>`;
  return "—"; }
function srcTidy(giver){ // "Land · Polar Land" → "Land (Polar)", "Magic Initiate · Wizard Spells" → "Magic Initiate (Wizard)"
  const p=String(giver).split(" · ");
  if(p.length<2)return giver;
  const opt=p.slice(1).join(" · ").replace(/ (Spells|Land)$/,"");
  return `${p[0]} (${opt})`;
}
function classLabel(r){return r.name+(r.viaSub?" ("+r.viaSub.shortName+")":"");}
function renderTable(){
  const rows=[]; const seenSrc=new Set();
  const push=o=>{const kk=key(o.sp.name,o.sp.source)+"|"+o.src; if(seenSrc.has(kk))return; seenSrc.add(kk); rows.push(o);};
  R.casters.forEach(r=>{const cart=R.cart[r.idx];
    const picked=new Set([...(cart.cantrips||[]),...(cart.spells||[])]);
    [...picked].forEach(k=>{const sp=SPELL_BY[k];if(sp)push({sp,src:classLabel(r),type:"prep",ability:r.ability,recharge:null,sel:true,idx:r.idx,rkey:k,cantrip:sp.level===0});});
  });
  // always-prepared (free) grants
  [...R.pool.values()].filter(e=>e.grants.length).forEach(e=>{const g=e.grants[0];
    push({sp:e.sp,src:srcTidy(g.src),type:"free",ability:g.ability,recharge:null,sel:true});});
  // innate / free casts
  R.freeCasts.forEach(fc=>{if(fc.choice)return;const sp=grantRec(fc.name);if(sp)
    push({sp,src:srcTidy(fc.src),type:fc.swappable?"swap":"cast",ability:fc.ability,recharge:fc.recharge,sel:true});});

  const tbl=$("#spellTable");tbl.innerHTML="";
  $("#tableChip").textContent=rows.length?rows.length+" spells":"";
  $("#tableEmpty").textContent=rows.length?"":"Nothing selected yet — pick spells in the Build tab (or use Prepare daily); subclass/feat/species grants appear here too.";
  const prepBtn=$("#prepDailyBtn");if(prepBtn)prepBtn.style.display=R.casters.some(r=>!r.static)?"":"none";
  if(!rows.length)return;

  // a spell is "also with your spell slots" if it's an eligible pool spell for a caster
  const slotCastable=sp=>{const e=R.pool.get(key(sp.name,sp.source));return !!(e&&e.takers.length);};

  const g=tableOpts.group;                 // outer grouping; level is always the inner group
  const outer=g==="ability"||g==="source";
  const outerKey=r=> g==="ability"?(r.ability||"zzz"):String(r.src);
  const outerLabel=r=> g==="ability"?(ABIL[r.ability]||"Other casting"):r.src;
  rows.sort((a,b)=> (outer?String(outerKey(a)).localeCompare(String(outerKey(b))):0) || a.sp.level-b.sp.level || a.sp.name.localeCompare(b.sp.name));

  const showAbility=g!=="ability"&&g!=="source", showSource=g!=="source";
  const cols=[""].concat(["Spell","School","Time","Range","Duration","Conc","Save"],showAbility?["Ability"]:[],["Casts"],showSource?["Source"]:[]);
  const thead=el("tr");cols.forEach(h=>thead.append(el("th",null,h)));tbl.append(thead);
  thead.firstChild.title="Preparation status — hover a marker for details";
  const span=cols.length;

  let lastOuter=null,lastLevel=null;
  rows.forEach(row=>{const {sp,type,recharge,sel}=row; const src=row.src;
    if(outer){const ok=outerKey(row); if(ok!==lastOuter){lastOuter=ok;lastLevel=null;
      const gr=el("tr","grouphdr outer");const td=el("td");td.colSpan=span;
      if(g==="ability"){td.innerHTML=`<span class="abname ${row.ability||""}">${esc(outerLabel(row))}</span>`;}
      else{td.append(el("span",null,outerLabel(row)));
        const abils=[...new Set(rows.filter(x=>outerKey(x)===ok).map(x=>x.ability).filter(Boolean))];
        if(abils.length){const w=el("span","hdr-abils");w.innerHTML=abils.map(abChip).join("");td.append(w);}}
      gr.append(td);tbl.append(gr);}}
    if(sp.level!==lastLevel){lastLevel=sp.level;
      const gr=el("tr","grouphdr lvl");const td=el("td");td.colSpan=span;
      td.append(el("span",null,sp.level===0?"Cantrips":ROMAN[sp.level]+" level"));
      if(sp.level===0){td.append(el("span","lvltally muted","cantrips aren’t prepared daily"));}
      gr.append(td);tbl.append(gr);}
    const tr=el("tr",sel?"":"unsel");
    // status indicator (read-only): ✓ always-prepared · ● prepared today · ✦ innate
    const ind=el("td","pickcell");
    if(type==="free"){ind.textContent="✓";ind.classList.add("always");ind.title="Always prepared — a free grant that doesn’t count against your prepared list.";}
    else if(type==="swap"){ind.textContent="●";ind.classList.add("on");ind.title="Prepared — swappable on a long rest (change it in Choices).";}
    else if(type==="cast"){ind.textContent="✦";ind.classList.add("innate");ind.title="Innate / free cast — cast without preparing it.";}
    else if(sp.level===0){ind.textContent="●";ind.classList.add("on");ind.title="Cantrip — always known, not re-prepared daily.";}
    else{ind.textContent="●";ind.classList.add("on");ind.title="Prepared today — change it with Prepare daily.";}
    tr.append(ind);
    const nmtd=el("td","nm");nmtd.textContent=sp.name;attachSpell(nmtd,sp);
    if(sp.ritual)nmtd.append(Object.assign(el("span"),{textContent:" R",style:"color:var(--gold);font-size:10px;font-weight:700"}));tr.append(nmtd);
    tr.append(el("td",null,shortSchool(sp.school)));tr.append(el("td",null,shortTime(sp.time)));tr.append(el("td",null,shortRange(sp.range)));
    tr.append(el("td",null,shortDuration(sp.durTxt)));
    tr.append(Object.assign(el("td",sp.conc?"concmark":""),{textContent:sp.conc?"✓":"—"}));
    const svtd=el("td","savecell");svtd.innerHTML=defenceHTML(sp);tr.append(svtd);
    if(showAbility){const abtd=el("td");abtd.innerHTML=row.ability?abChip(row.ability):"—";tr.append(abtd);}
    // casts: innate recharge, with * when also castable via your slots
    const castTd=el("td");const lab=recharge?rechargeShort(recharge,sp.level===0):"—";
    if(recharge&&lab!=="at will"&&lab!=="—"&&slotCastable(sp)){
      castTd.textContent=lab;const ast=el("sup","ast","*");ast.title="Also castable with your spell slots";castTd.append(ast);
      castTd.classList.add("hasast");castTd.onclick=()=>{castTd.firstChild.textContent=lab+" (also with your spell slots)";castTd.classList.remove("hasast");};
    } else castTd.textContent=lab;
    tr.append(castTd);
    if(showSource){const st=el("td");st.append(el("span","srcbadge"+(type==="free"?" free":type==="cast"?" cast":""),src));tr.append(st);}
    tbl.append(tr);
  });
}
function switchTab(t){curTab=t;$("#tabBuild").classList.toggle("on",t==="build");$("#tabTable").classList.toggle("on",t==="table");
  $("#buildView").classList.toggle("hidden",t!=="build");$("#tableView").classList.toggle("hidden",t!=="table");
  if(t==="table")renderTable();}

function renderSlots(){
  $("#clvlChip").textContent=R.charLevel?("level "+R.charLevel):"";
  const g=$("#statGrid");g.innerHTML="";
  const maxAny=Math.max(0,...R.casters.map(r=>r.maxLvl));
  const tPrep=R.casters.reduce((a,r)=>a+r.prepared,0);
  const tCant=R.casters.reduce((a,r)=>a+r.cantrips,0);
  const mk=(k,v,s)=>{const d=el("div","stat");d.append(el("div","k",k));const vv=el("div","v");vv.innerHTML=v+(s?` <small>${s}</small>`:"");d.append(vv);return d;};
  g.append(mk("Top spell",maxAny?ROMAN[maxAny]:"—",""));
  g.append(mk("Prepared",tPrep||"—",""));
  g.append(mk("Cantrips",tCant||"—",""));
  g.append(mk("Eligible",R.pool.size||"—","spells"));
  const sr=$("#slotRow");sr.innerHTML="";
  if(R.mcSlots)R.mcSlots.forEach((n,i)=>{if(n>0){const d=el("div","slot");d.append(el("div","lv",ROMAN[i+1]));d.append(el("div","n",String(n)));sr.append(d);}});
  if(R.pactRec){const p=R.pactRec.pact;const d=el("div","slot pact");d.append(el("div","lv","Pact "+ROMAN[p.lvl]));d.append(el("div","n",String(p.num)));sr.append(d);
    const t=el("div","note");t.style.flexBasis="100%";t.textContent=`Pact Magic: ${p.num} slot${p.num>1?"s":""} @ level ${p.lvl}, short-rest recharge — separate from the above.`;sr.append(t);}
  if(!R.mcSlots&&!R.pactRec)sr.append(el("div","note","No slots — add a spellcasting class."));
  const cw=$("#castsWrap");cw.innerHTML="";
  if(R.freeCasts.length){cw.append(el("label","fld","Free / innate casts"));const box=el("div","casts");
    R.freeCasts.forEach(c=>{const row=el("div","ct");const n=el("span");
      n.innerHTML=c.choice?c.desc:(c.name+(c.level!=null?` <span style="color:var(--muted)">(${ROMAN[c.level]})</span>`:""));
      const lab=rechargeShort(c.recharge,c.level===0),atWill=lab==="at will";
      row.append(n);row.append(el("span","rc"+(atWill?" will":""),lab));row.append(el("span","src",c.src));box.append(row);});
    cw.append(box);}
}

function renderCart(){
  const body=$("#cartBody");body.innerHTML="";
  const nPick=Object.values(state.chosen).reduce((a,c)=>a+(c.cantrips?.length||0)+(c.spells?.length||0),0);
  $("#cartChip").textContent=nPick?nPick+" picked":"";
  if(!R.casters.length){body.append(el("div","empty","No spellcasting class yet. Add one on the left, then pick spells from the list below."));return;}
  R.casters.forEach(r=>{
    const c=R.cart[r.idx],cp=c.caps; const over=c.cantOver||c.spellOver||Object.keys(c.overLevels).length||(c.ms&&c.ms.over);
    const b=el("div","budget"+(over?" over":""));
    const kn=c.known;
    const kindLabel=kn?"spellbook":r.static?"level-swap":"daily";
    const kindTip=kn
      ? `Wizard spellbook: it grows a fixed amount each level, and every spell added must be no higher than your current top slot (${ROMAN[r.maxLvl]}) — so the count at each level is capped and can't be retrained. The tiles show that free allowance. You then prepare ${kn.prepares} of them each long rest (the slots table). Separately, you can copy found spells into the book beyond the allowance — those show as “copied”.`
      : r.static
      ? `Level-swap caster: a fixed known list of ${r.prepared}, learned as you level up and capped at your top slot each time (plus one swap per level). So the count you can hold at each level is limited — the tiles show it, highest levels capped tightest.`
      : `Daily caster: re-prepare any ${r.prepared} eligible spells each long rest, any mix of levels up to ${ROMAN[r.maxLvl]}. Cantrips are fixed and not re-prepared daily.`;
    const bh=el("div","bh");const nm=el("div","nm");nm.innerHTML=r.name+(r.viaSub?` <small>· ${r.viaSub.shortName}</small>`:"")+` <small>· L${r.level}</small>`;bh.append(nm);
    const kchip=el("span","kind"+(kn?" wiz":r.static?"":" daily"),kindLabel);kchip.title=kindTip;bh.append(kchip);
    b.append(bh);
    b.append(meter("Cantrips",c.cantrips.length,r.cantrips));
    const wiz=kn&&kn.book;
    if(wiz){
      // copies = spells past the free allowance = the tightest exceeded cumulative cap
      let copied=0,cumg=0;
      for(let L=kn.maxL;L>=1;L--){cumg+=c.spells.filter(k=>{const s=SPELL_BY[k];return s&&s.level===L;}).length;
        copied=Math.max(copied,cumg-(kn.cap[L]!=null?kn.cap[L]:kn.total));}
      copied=Math.max(0,copied);
      const free=c.spells.length-copied;
      b.append(meter("Spellbook",Math.min(free,kn.total),kn.total));
      const sn=el("div","note");sn.style.margin="2px 0 0";
      sn.innerHTML=`Fixed growth, no retraining. Prepare <b style="color:var(--ink)">${kn.prepares}</b> of these each long rest.`
        +(copied?` <b style="color:var(--accent)">+${copied} copied in</b>.`:"");
      b.append(sn);
    } else {
      b.append(meter(kn?"Known":"Prepared",c.spells.length,kn?kn.total:r.prepared));
    }
    if(c.ms){b.append(meter("Off-list",c.ms.offCount,c.ms.cap));
      const sn=el("div","note");sn.style.margin="2px 0 0";
      sn.innerHTML=`Magical Secrets: up to <b style="color:var(--ink)">${c.ms.cap}</b> of your prepared spells may come from other lists (from L${c.ms.onset} on: new picks + retrains).`;b.append(sn);}
    // Per-level tiles. Denominator = how many you can hold at that level right now:
    // (picked here) + (room still addable). Daily preparers have a flat cap (free spread).
    // Known/level-swap and wizard books have a progressive cap[L] = max at level ≥ L
    // (L8 Bard caps IV at 4, III at 9, II/I at 12) — room = min over j≤L of cap[j] − held ≥ j.
    // A wizard may exceed a level's cap by COPYING spells in: shown as "copied", not an error.
    const totalCap = kn ? kn.total : r.prepared;
    if(r.maxLvl>=1 && totalCap>0){const dist=el("div","dist");
      const lvlOf=k=>{const s=SPELL_BY[k];return s?s.level:-1;};
      const capAt=j=>wiz?(kn.cap[j]!=null?kn.cap[j]:kn.total):(kn?kn.total:(cp&&cp.cap[j]!=null?cp.cap[j]:totalCap));
      const geAt=j=>c.spells.filter(k=>lvlOf(k)>=j).length;
      for(let L=r.maxLvl;L>=1;L--){
        const atL=c.spells.filter(k=>lvlOf(k)===L).length;
        let room=Infinity; for(let j=1;j<=L;j++)room=Math.min(room,capAt(j)-geAt(j));
        // room may be negative when this level is over the cap — show the exceeded cap.
        const ceil=Math.max(0,atL+room);
        const overFree=atL>ceil;
        const copied=overFree&&wiz;                 // wizard: extra = copied into the book (legal)
        const isErr=!!c.overLevels[L]||(overFree&&!copied);
        const cell=el("div","dcell"+(L===r.maxLvl?" top":"")+(isErr?" over":copied?" copied":""));
        cell.style.cursor="pointer";
        cell.title=`${ROMAN[L]}-level ${wiz?"in your spellbook":r.static?"in your known spells":"prepared"} — ${atL} of up to ${ceil} at this level`
          +(copied?` (+${atL-ceil} copied in beyond the free allowance)`:r.static&&!kn?` (fills up gradually as you level)`:"")+`. Tap to edit.`;
        cell.onclick=()=>openLevelPick(r.idx,L);
        cell.innerHTML=`<b>${atL}<span class="dcap">/${ceil}</span></b><small>${ROMAN[L]}${L===r.maxLvl?" · max":""}</small>`;dist.append(cell);}
      b.append(dist);
      if(wiz){const cpbtn=el("button","btn");cpbtn.textContent="＋ Copy a spell into your book";
        cpbtn.style.cssText="margin-top:8px;font-size:12px";
        cpbtn.title="Wizards can copy spells found in play into the book, beyond the free per-level allowance (any Wizard spell up to your top slot level).";
        cpbtn.onclick=()=>openLevelPick(r.idx,r.maxLvl);b.append(cpbtn);}
    }
    // chosen chips
    const picks=[...c.cantrips.map(k=>({k,cantrip:true})),...c.spells.map(k=>({k,cantrip:false}))];
    if(picks.length){const cc=el("div","cartchips");
      picks.map(p=>({...p,sp:SPELL_BY[p.k]})).filter(p=>p.sp).sort((a,b)=>a.sp.level-b.sp.level||a.sp.name.localeCompare(b.sp.name))
        .forEach(p=>{const chip=el("span","cartchip");chip.append(el("span","lv",p.sp.level===0?"C":ROMAN[p.sp.level].replace(/\D/g,"")));
          const nm=el("span",null,p.sp.name);attachSpell(nm,p.sp);chip.append(nm);const x=el("button",null,"×");x.onclick=()=>removeChosen(r.idx,p.k);chip.append(x);cc.append(chip);});
      b.append(cc);}
    // granted (free) for this class
    body.append(b);
  });
  // granted free spells summary (from subclass/feat/species prepared grants)
  const granted=[...R.pool.values()].filter(e=>e.grants.length);
  if(granted.length){const g=el("div","budget");const gbh=el("div","bh");gbh.append(el("span","kind daily","always prepared · free"));g.append(gbh);
    const cc=el("div","cartchips");granted.sort((a,b)=>a.sp.level-b.sp.level||a.sp.name.localeCompare(b.sp.name)).forEach(e=>{
      const chip=el("span","cartchip gr");chip.append(el("span","lv",e.sp.level===0?"C":ROMAN[e.sp.level].replace(/\D/g,"")));
      const nm=el("span",null,e.sp.name);attachSpell(nm,e.sp);chip.append(nm);cc.append(chip);});
    g.append(cc);body.append(g);}
}
function meter(lbl,used,cap){
  const m=el("div","meter");m.append(el("div","lbl",lbl));
  const bar=el("div","bar");const span=el("span",used>cap?"over":used===cap&&cap>0?"ok":"");span.style.width=Math.min(100,cap?used/cap*100:0)+"%";bar.append(span);m.append(bar);
  m.append(el("div","val"+(used>cap?" over":""),`${used} / ${cap}`));return m;
}

function renderSpells(){
  const F=state.filters;
  let items=[...R.pool.values()];
  // level filter chips (present levels only)
  const presentLevels=[...new Set(items.map(i=>i.sp.level))].sort((a,b)=>a-b);
  buildToggleRow($("#fLevel"),presentLevels.map(l=>[String(l),l===0?"Cantrip":ROMAN[l]]),F.levels,true);
  syncOpt($("#fSchool"),[...new Set(items.map(i=>i.sp.school).filter(Boolean))].sort().map(s=>[s,s]),F.school,"all schools");
  const accessNames=[...new Set([].concat(...items.map(i=>i.takers.map(t=>t.name).concat([...i.srcs]))))].sort();
  syncOpt($("#fClass"),accessNames.map(s=>[s,s]),F.cls,"any source");
  syncOpt($("#fSave"),[...new Set([].concat(...items.map(i=>i.sp.save)))].sort().map(s=>[s,cap1(s)]),F.save,"any save");
  syncOpt($("#fDmg"),[...new Set([].concat(...items.map(i=>i.sp.dmg)))].sort().map(s=>[s,cap1(s)]),F.dmg,"any damage");
  syncOpt($("#fBook"),[...new Set(items.map(i=>i.sp.source))].sort().map(s=>[s,DATA.sources[s]?.name||s]),F.book,"any book");
  buildToggleRow($("#fTime"),[["action","Action"],["bonus","Bonus"],["reaction","Reaction"],["long","Longer"]],F.time);
  buildToggleRow($("#fComp"),[["v","V"],["s","S"],["m","M"]],F.comp);
  buildToggleRow($("#fTags"),[["ritual","Ritual"],["conc","Concentr."],["atk","Atk roll"]],F.tags);
  $("#fChosen").classList.toggle("on",F.chosen);
  const afc=activeFilterCount();$("#filterBtn").innerHTML="Filters"+(afc?` <span class="badge">${afc}</span>`:"");

  const chosenKeys=new Set(); Object.values(state.chosen).forEach(c=>{(c.cantrips||[]).forEach(k=>chosenKeys.add(k));(c.spells||[]).forEach(k=>chosenKeys.add(k));});
  items=items.filter(i=>{const sp=i.sp;
    if(F.q&&!sp.name.toLowerCase().includes(F.q.toLowerCase()))return false;
    if(F.levels.size&&!F.levels.has(sp.level))return false;
    if(F.school&&sp.school!==F.school)return false;
    if(F.cls&&!i.takers.some(t=>t.name===F.cls)&&!i.srcs.has(F.cls))return false;
    if(F.save&&!sp.save.includes(F.save))return false;
    if(F.dmg&&!sp.dmg.includes(F.dmg))return false;
    if(F.book&&sp.source!==F.book)return false;
    if(F.time.size&&!F.time.has(sp.tcat))return false;
    if(F.comp.size&&![...F.comp].every(c=>sp.comp[c]))return false;
    if(F.tags.has("ritual")&&!sp.ritual)return false;
    if(F.tags.has("conc")&&!sp.conc)return false;
    if(F.tags.has("atk")&&!sp.atk)return false;
    if(F.chosen&&!chosenKeys.has(key(sp.name,sp.source)))return false;
    return true;
  });
  items.sort((a,b)=>a.sp.level-b.sp.level||a.sp.name.localeCompare(b.sp.name));
  $("#spCount").textContent=items.length?items.length+" spells":"";
  const byLvl={};items.forEach(i=>{(byLvl[i.sp.level]=byLvl[i.sp.level]||[]).push(i);});
  const list=$("#spellList");list.innerHTML="";
  if(!items.length){list.append(mkEmpty());return;}
  for(let l=0;l<=9;l++){if(!byLvl[l])continue;const g=el("div","lvlgroup");g.id="lg"+l;
    const h=el("h3");h.append(el("span",null,l===0?"Cantrips":ROMAN[l]+" level"));h.append(el("span","n",byLvl[l].length+""));
    h.append(lvlTools(l));g.append(h);
    byLvl[l].forEach(i=>g.append(mkSpell(i,chosenKeys)));list.append(g);}
}
// hover toolbar for a spell-level group: tracks picks at that level + quick clear
function pickedAtLevel(l){return R.casters.reduce((a,rec)=>{const ch=state.chosen[rec.idx]||{};const arr=l===0?ch.cantrips:ch.spells;return a+((arr||[]).map(k=>SPELL_BY[k]).filter(s=>s&&s.level===l).length);},0);}
function clearLevel(l){R.casters.forEach(rec=>{const ch=state.chosen[rec.idx];if(!ch)return;["cantrips","spells"].forEach(a=>{ch[a]=(ch[a]||[]).filter(k=>{const s=SPELL_BY[k];return !(s&&s.level===l);});});});save();render();}
function lvlTools(l){const t=el("div","lvltools");const n=pickedAtLevel(l);
  t.append(el("span","lvltools-n",n+(l===0?" known":" picked")));
  const clr=el("button","lvltools-btn",l===0?"clear cantrips":"clear");clr.title="Unpick all "+(l===0?"cantrips":ROMAN[l]+"-level picks");
  clr.disabled=!n;clr.onclick=e=>{e.stopPropagation();clearLevel(l);};t.append(clr);return t;}
function mkEmpty(){const e=el("div","empty");
  if(!R.casters.length){e.innerHTML="<b>Add a spellcasting class</b><br>Then its spells appear here to browse and pick.";return e;}
  const q=(state.filters.q||"").trim();
  e.innerHTML="<b>Nothing matches</b><br>Loosen the filters — or make it yourself.";
  const b=el("button","btn on");b.style.marginTop="12px";
  b.textContent=q?`＋ Create “${q}” as a custom spell`:"＋ Create a custom spell";
  b.onclick=()=>openCustom(q?{name:q}:null);
  e.append(b);return e;}
// ── spell detail: hover tooltip + click modal ──────────────────────────────
const SPTIP=el("div","sptip");document.body.appendChild(SPTIP);
const SPMODAL=el("div","spmodal hidden");document.body.appendChild(SPMODAL);
SPMODAL.onclick=e=>{if(e.target===SPMODAL||e.target.classList.contains("x"))SPMODAL.classList.add("hidden");};
document.addEventListener("keydown",e=>{if(e.key==="Escape")SPMODAL.classList.add("hidden");});
function esc(s){return (s||"").replace(/[&<>]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]));}
// ── spell text highlighting (monster-forge cc-* convention, read-only) ──────
const CC_DMG=["acid","bludgeoning","cold","fire","force","lightning","necrotic","piercing","poison","psychic","radiant","slashing","thunder"];
const CC_CONDS=["blinded","charmed","deafened","frightened","grappled","incapacitated","invisible","paralyzed","petrified","poisoned","prone","restrained","stunned","unconscious","exhaustion"];
function ccText(str){
  if(!str)return "";
  const TY=CC_DMG.join("|");
  const cats=[
    {re:new RegExp("\\b\\d+d\\d+(?:\\s*[+\\-−]\\s*\\d+)?\\b","gi"),cls:"cc-dice"},
    {re:/\bDC\s*\d+\b/gi,cls:"cc-dc"},
    {re:new RegExp("\\b(?:Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\\s+saving throw\\b","gi"),cls:"cc-save"},
    {re:new RegExp("\\b("+TY+")\\b(?=(?:[ ,;/]+(?:or|and|"+TY+"))*[ ,;/]+damage\\b)","gi"),cls:"cc-dmg"},
    {re:new RegExp("\\b("+CC_CONDS.join("|")+")\\b","gi"),cls:"cc-cond"},
    {re:/\b\d+(?:\/\d+)?[- ]?(?:ft\.?|feet|foot)\b/gi,cls:"cc-range"},
    {re:/\b\d+-foot(?:[ -](?:cone|cube|line|sphere|radius|emanation|cylinder))?\b/gi,cls:"cc-range"},
  ];
  const hits=[];
  cats.forEach(cat=>{cat.re.lastIndex=0;let m;while((m=cat.re.exec(str))){hits.push({s:m.index,e:m.index+m[0].length,cls:cat.cls,txt:m[0]});if(m.index===cat.re.lastIndex)cat.re.lastIndex++;}});
  hits.sort((a,b)=>a.s-b.s||b.e-a.e);
  let out="",pos=0;
  hits.forEach(h=>{if(h.s<pos)return; out+=esc(str.slice(pos,h.s)); out+=`<span class="${h.cls}">${esc(h.txt)}</span>`; pos=h.e;});
  out+=esc(str.slice(pos)); return out;
}
// coloured casting-ability chip (monster-forge palette)
function abChip(ab){return `<span class="abchip ${ab||""}">${ABIL_SHORT[ab]||ab||"—"}</span>`;}
function compText(sp){const c=sp.comp||{};const p=[];if(c.v)p.push("V");if(c.s)p.push("S");if(c.m)p.push("M"+(c.mat?` (${c.mat})`:""));return p.join(", ")||"—";}
function metaLine(sp){return `${sp.level===0?"Cantrip":ROMAN[sp.level]+"-level"} ${sp.school}${sp.ritual?" (ritual)":""}`;}
function tipHTML(sp){return `<h4>${sp.name}</h4><div class="sub">${metaLine(sp)}</div>`
  +`<div class="line"><b>Time</b> ${sp.time}</div><div class="line"><b>Range</b> ${sp.range}</div>`
  +`<div class="line"><b>Duration</b> ${sp.conc?"Concentration, ":""}${sp.durTxt}</div>`
  +((sp.desc||[]).length?`<p>${ccText(sp.desc[0].slice(0,240))}${sp.desc[0].length>240?"…":""}</p>`:"")+`<p style="color:var(--muted);font-size:11px">click for full details</p>`;}
function posTip(ev){const pad=14,w=SPTIP.offsetWidth,h=SPTIP.offsetHeight;let x=ev.clientX+pad,y=ev.clientY+pad;
  if(x+w>innerWidth-8)x=ev.clientX-w-pad; if(y+h>innerHeight-8)y=innerHeight-h-8; SPTIP.style.left=Math.max(8,x)+"px";SPTIP.style.top=Math.max(8,y)+"px";}
function showTip(sp,ev){SPTIP.innerHTML=tipHTML(sp);SPTIP.classList.add("show");posTip(ev);}
function hideTip(){SPTIP.classList.remove("show");}
// a description paragraph that is really a sub-heading (the extractor emits a named
// entry's name as its own short "Title." line) — render it distinctly, not as body.
const _TITLE_RE=/^[A-Z][A-Za-z0-9'’/\- ]{0,48}\.$/;
const isDescTitle=p=>_TITLE_RE.test(p)&&p.split(/\s+/).length<=5;
const descP=p=>isDescTitle(p)?`<p class="spttl">${esc(p.replace(/\.\s*$/,""))}</p>`:`<p>${ccText(p)}</p>`;
// who grants access to this spell. Collapsed by default: a single scrollable row of all
// sources inline with the label, an expander at the end reveals the per-category line-up.
// Edition duplicates collapsed (prefer newest source via srcRank).
function accessHTML(sp){
  const ded=(arr,keyf,labf,srcf)=>{const best={};(arr||[]).forEach(x=>{const k=keyf(x).toLowerCase();if(!best[k]||srcRank(srcf(x))>srcRank(srcf(best[k])))best[k]=x;});
    return Object.values(best).map(x=>({t:labf(x),src:srcf(x)})).sort((a,b)=>a.t.localeCompare(b.t));};
  const chip=(x,k)=>`<span class="achip ${k}"${x.src&&x.src!==CORE?` title="${esc(bookName(x.src))}"`:""}>${esc(x.t)}</span>`;
  const cats=[
    ["Classes",   ded(sp.cls,  x=>x[0],          x=>x[0],               x=>x[1]), "cls"],
    ["Subclasses",ded(sp.sub,  x=>x[0]+"|"+x[1], x=>`${x[1]} · ${x[0]}`, x=>x[2]), "sub"],
    ["Species",   ded(sp.race, x=>x[0],          x=>x[0],               x=>x[1]), "race"],
    ["Feats",     ded(sp.feat, x=>x[0],          x=>x[0],               x=>x[1]), "feat"],
  ].filter(c=>c[1].length);
  if(!cats.length)return "";
  const merged=[].concat(...cats.map(([,items,k])=>items.map(x=>chip(x,k)))).join("");
  const rows=cats.map(([label,items,k])=>`<div class="acat"><span class="acl">${label}</span><div class="achips">${items.map(x=>chip(x,k)).join("")}</div></div>`).join("");
  return `<div class="access" data-exp="0">`
    +`<div class="acc-row"><span class="accessh">Access</span>`
    +`<div class="achips acc-merged">${merged}</div>`
    +`<button class="acc-toggle" type="button" title="Show by category" aria-label="Show by category">⌄</button></div>`
    +`<div class="acc-cats">${rows}</div></div>`;}
function modalHTML(sp){
  const grid=[["Level",sp.level===0?"Cantrip":ROMAN[sp.level]],["School",sp.school],["Casting time",sp.time],
    ["Range",sp.range],["Components",compText(sp)],["Duration",(sp.conc?"Concentration, up to ":"")+sp.durTxt]];
  return `<div class="box"><button class="x">×</button><div class="mh"><h3>${sp.name}</h3>`
    +`<div class="sub">${metaLine(sp)}${sp.source!==CORE?" · "+sp.book:""}</div></div><div class="mb">`
    +`<div class="grid">${grid.map(([k,v])=>`<b>${k}</b><span>${v}</span>`).join("")}</div>`
    +(sp.desc||[]).map(descP).join("")
    +((sp.higher||[]).length?`<div class="hl">${sp.higher.map(descP).join("")}</div>`:"")
    +accessHTML(sp)+`</div></div>`;}
function openSpellModal(sp){hideTip();SPMODAL.innerHTML=modalHTML(sp);
  const at=SPMODAL.querySelector(".acc-toggle");
  if(at)at.onclick=()=>{const a=at.closest(".access");a.dataset.exp=a.dataset.exp==="1"?"0":"1";};
  if(sp.source===HB_SRC){const mb=SPMODAL.querySelector(".mb");if(mb){const row=el("div","hbtools");
    row.append(el("span","hbtag","Homebrew"));const sp2=el("span");sp2.style.flex="1";row.append(sp2);
    const e=el("button","btn","Edit");e.onclick=()=>{SPMODAL.classList.add("hidden");openCustom(customFromSpell(sp),true);};
    const d=el("button","btn danger","Delete");d.onclick=()=>{if(confirm("Delete custom spell “"+sp.name+"”?")){deleteCustom(sp);SPMODAL.classList.add("hidden");}};
    row.append(e,d);mb.append(row);}}
  SPMODAL.classList.remove("hidden");}
function attachSpell(elm,sp){elm.classList.add("nmlink");
  elm.addEventListener("mouseenter",e=>showTip(sp,e));elm.addEventListener("mousemove",posTip);
  elm.addEventListener("mouseleave",hideTip);
  elm.addEventListener("click",e=>{e.stopPropagation();openSpellModal(sp);});}

function mkSpell(i,chosenKeys){
  const sp=i.sp,k=key(sp.name,sp.source);const isChosen=chosenKeys.has(k);
  const d=el("div","sp"+(isChosen?" chosen":""));
  const nm=el("div","nm");nm.textContent=sp.name;
  if(sp.ritual)nm.append(Object.assign(el("span","badge"),{textContent:"R"}));
  attachSpell(nm,sp);
  d.append(nm);
  const meta=el("div","meta");
  [sp.school,sp.time,sp.range,sp.conc?"conc.":"",sp.source!==CORE?sp.book:""].filter(Boolean).forEach(x=>meta.append(el("span",null,x)));
  d.append(meta);
  const take=el("div","take");
  // per-class take buttons
  const seen=new Set();
  i.takers.forEach(t=>{ if(seen.has(t.idx))return; seen.add(t.idx);
    if(i.always&&i.always.has(t.idx))return;   // always-prepared by this class's own subclass/feature
    const ch=state.chosen[t.idx];const on=ch&&(t.cantrip?ch.cantrips:ch.spells).includes(k);
    const rec=R.casters.find(r=>r.idx===t.idx);if(!rec)return;
    // running count for this source's bucket (cantrips vs prepared/known), alert if over its forecast
    const bucket=t.cantrip?"cantrips":"spells";
    const sel=((ch&&ch[bucket])||[]).length;
    const cart=R.cart[t.idx];
    const cap=t.cantrip?rec.cantrips:(cart&&cart.known?cart.known.total:rec.prepared);
    // a wizard copying spells past its free book size isn't "over" — copying is allowed
    const over=sel>cap && !(cart&&cart.known&&cart.known.book&&!t.cantrip);
    const btn=el("button","tk"+(on?" on":"")+(over?" over":""));
    btn.append(document.createTextNode(t.name+" "));btn.append(el("span","c",`${sel}/${cap}`));
    btn.title=(on?"Prepared — click to remove. ":"Not prepared — click to add. ")+`${t.name}: ${sel} of ${cap} ${t.cantrip?"cantrips":(cart&&cart.known?"in spellbook":"prepared")}`+(over?" (over your forecast)":"");
    btn.onclick=()=>toggle(t.idx,k,t.cantrip);take.append(btn);
  });
  i.grants.forEach(g=>{const b=el("span","tk gr",g.src+" ✦");b.title="Always prepared (free) from "+g.src;take.append(b);});
  d.append(take);return d;
}
function cap1(s){return s?s[0].toUpperCase()+s.slice(1):s;}
function syncOpt(sel,pairs,cur,allLabel){
  const want=[["",allLabel]].concat(pairs);
  const same=sel.options.length===want.length&&[...sel.options].every((o,i)=>o.value===want[i][0]);
  if(!same){sel.innerHTML="";want.forEach(([v,t])=>sel.append(new Option(t,v)));}
  sel.value=pairs.some(p=>p[0]===cur)?cur:"";
}
function buildToggleRow(box,pairs,set,numeric,cb){box.innerHTML="";pairs.forEach(([v,t])=>{const val=numeric?+v:v;
  const b=el("button","cbtn"+(set.has(val)?" on":""),t);
  b.onclick=()=>{set.has(val)?set.delete(val):set.add(val); if(cb)cb(); else {save();render();}};box.append(b);});}

// ── builder UI ───────────────────────────────────────────────────────────
function classOptions(){return DATA.classes.filter(visible).sort((a,b)=>a.name.localeCompare(b.name)||a.source.localeCompare(b.source))
  .map(c=>({v:key(c.name,c.source),t:c.name+(c.source!==CORE?` (${c.source})`:"")+(c.caster?"":" ·")}));}
function renderClassRows(){
  const wrap=$("#classRows");wrap.innerHTML="";
  state.classes.forEach((row,idx)=>{const c=CLS_BY[row.clsKey]||{name:"?"};
    const div=el("div","classrow");
    // class name is a select — change it to swap class (subclass resets, level stays)
    const cl=el("div");cl.append(el("label","fld","Class"));
    const cs=el("select");classOptions().forEach(o=>cs.append(new Option(o.t,o.v)));cs.value=row.clsKey;
    cs.onchange=()=>{if(cs.value===row.clsKey)return;row.clsKey=cs.value;row.subKey=null;delete state.chosen[row.id];save();renderClassRows();render();};
    cl.append(cs);div.append(cl);
    const subLvl=c.subclassLevel||3, locked=row.level<subLvl;
    const needsSub=!locked && !row.subKey && (SUBS_OF[key(c.name,c.source)]||[]).some(visible);
    const sc=el("div");sc.append(el("label","fld",locked?`Subclass · L${subLvl}`:"Subclass"));
    const ss=el("select",needsSub?"alert":"");ss.append(new Option(locked?`— unlocks at ${subLvl} —`:"— none —",""));
    (SUBS_OF[key(c.name,c.source)]||[]).filter(visible).sort((a,b)=>a.shortName.localeCompare(b.shortName))
      .forEach(s=>ss.append(new Option(s.shortName+(s.source!==CORE?` (${s.source})`:"")+(s.caster?" ✦":""),key(s.name,s.source))));
    ss.value=row.subKey||"";ss.disabled=locked;if(locked)ss.style.opacity=".55";
    ss.onchange=()=>{row.subKey=ss.value||null;save();renderClassRows();render();};sc.append(ss);
    div.append(sc);
    if(locked&&row.subKey){row.subKey=null;}
    const lv=el("div");lv.append(el("label","fld","Lvl"));
    const st=el("div","stepper");const dec=el("button",null,"−");const li=el("input");li.type="number";li.min=1;li.max=20;li.value=row.level;const inc=el("button",null,"+");
    const setLvl=v=>{row.level=Math.max(1,Math.min(20,v||1));li.value=row.level;save();renderClassRows();render();};
    dec.onclick=()=>setLvl(row.level-1);inc.onclick=()=>setLvl(row.level+1);li.onchange=()=>setLvl(+li.value);
    st.append(dec,li,inc);lv.append(st);div.append(lv);
    const rm=el("button","rm","×");rm.title="Remove class";rm.onclick=()=>{delete state.chosen[row.id];state.classes.splice(idx,1);renderClassRows();render();};div.append(rm);
    if(needsSub)div.append(el("div","subalert","subclass — pick one"));
    wrap.append(div);
  });
}
function refreshAddClass(){const s=$("#addClass");s.innerHTML="";s.append(new Option("+ add a class…",""));
  classOptions().forEach(o=>s.append(new Option(o.t,o.v)));s.value="";}
function refreshSpecies(){const s=$("#speciesSel");s.innerHTML="";s.append(new Option("— none —",""));
  DATA.races.filter(visible).sort((a,b)=>a.name.localeCompare(b.name)).forEach(r=>s.append(new Option(r.name+(r.source!==CORE?` (${r.source})`:"")+(r.grants.length?" ✦":""),key(r.name,r.source))));
  s.value=state.speciesKey&&[...s.options].some(o=>o.value===state.speciesKey)?state.speciesKey:"";state.speciesKey=s.value;}
// origin feats = from a background (Origin, Dragonmarks, Dark Gifts); general = ASI feats.
const ORIGIN_CATS=new Set(["O","D","DG"]);
const isOriginFeat=f=>ORIGIN_CATS.has(f.category);
const isFeatFS=f=>(f.category||"").startsWith("FS");
const isEpicBoon=f=>f.category==="EB";   // gated: only via the level-19 Epic Boon feature
const charLevel=()=>state.classes.reduce((a,r)=>a+(r.level||0),0);
function refreshAddFeat(){
  const origin=$("#addOrigin");origin.innerHTML="";origin.append(new Option("+ origin feat…",""));
  const gen=$("#addFeat");gen.innerHTML="";gen.append(new Option("+ general feat…",""));
  const epic=$("#addEpic");epic.innerHTML="";epic.append(new Option("+ epic boon…",""));
  DATA.feats.filter(f=>visible(f)&&!isFeatFS(f)).sort((a,b)=>a.name.localeCompare(b.name)).forEach(f=>{
    const lbl=f.name+(f.source!==CORE?` (${f.source})`:"")+(grantsAny(f.grants)?" ✦":"");
    (isEpicBoon(f)?epic:isOriginFeat(f)?origin:gen).append(new Option(lbl,key(f.name,f.source)));});
  // Epic Boons unlock at character level 19 (the level-19 feat feature)
  epic.classList.toggle("hidden",charLevel()<19);
}
// feat budget: general feats from ASI levels (+Fighter/Rogue extras), 1 origin feat + 1 for Humans.
// NOTE: data only carries spell-granting feats (extract.py filters the rest) — full feat lists need the mirror.
const ASI_EXTRA={Fighter:[6,14],Rogue:[10]};
function featBudget(){
  let general=0;
  state.classes.forEach(row=>{const c=CLS_BY[row.clsKey];if(!c)return;
    // general ASI feats: 4/8/12/16 (+ class extras). Level 19 is the Epic Boon slot, tracked separately.
    [4,8,12,16,...(ASI_EXTRA[c.name]||[])].forEach(l=>{if(row.level>=l)general++;});});
  const race=RACE_BY[state.speciesKey];const isHuman=/human/i.test((race&&race.name)||"");
  const origin=(state.classes.length?1:0)+(isHuman?1:0);
  const epic=charLevel()>=19?1:0;   // one Epic Boon at level 19
  const originPicked=state.feats.filter(fk=>{const f=FEAT_BY[fk];return f&&isOriginFeat(f);}).length;
  const epicPicked=state.feats.filter(fk=>{const f=FEAT_BY[fk];return f&&isEpicBoon(f);}).length;
  const generalPicked=state.feats.filter(fk=>{const f=FEAT_BY[fk];return f&&!isOriginFeat(f)&&!isEpicBoon(f)&&!isFeatFS(f);}).length;
  return {general,origin,epic,originPicked,generalPicked,epicPicked,isHuman};
}
function renderFeatBudget(){const b=featBudget();const n=$("#featBudget");if(!n)return;
  const need=b.originPicked<b.origin||b.generalPicked<b.general||b.epicPicked<b.epic;
  n.className="budgetnote"+(need?" alert":"");
  n.textContent=`origin ${b.originPicked}/${b.origin} · general ${b.generalPicked}/${b.general}`+(b.epic?` · epic ${b.epicPicked}/${b.epic}`:"");
  n.title=need?"You still owe a feat at your level":"Feat slots filled";}
function renderFeatChips(){const box=$("#featChips");box.innerHTML="";state.feats.forEach((fk,i)=>{const f=FEAT_BY[fk];if(!f)return;
  const c=el("span","chip"+(isEpicBoon(f)?" epic":isOriginFeat(f)?" origin":"")+(grantsAny(f.grants)?" hasspell":""));
  if(grantsAny(f.grants))c.append(Object.assign(el("span","fmark"),{textContent:"✦"}));
  c.append(el("span",null,f.name));const b=el("button",null,"×");b.onclick=()=>{state.feats.splice(i,1);renderFeatChips();render();};c.append(b);box.append(c);});
  renderFeatBudget();}

// ── sources modal ────────────────────────────────────────────────────────
const GROUP_ORDER=["core","supplement","setting","other"];
const GROUP_NAME={core:"Core",supplement:"Supplements",setting:"Settings & adventures",other:"Other"};
function renderSrcModal(){
  const wrap=$("#srcList");wrap.innerHTML="";
  const byGroup={};Object.entries(DATA.sources).forEach(([code,s])=>{(byGroup[s.group||"other"]=byGroup[s.group||"other"]||[]).push([code,s]);});
  const groups=Object.keys(byGroup).sort((a,b)=>{const ia=GROUP_ORDER.indexOf(a),ib=GROUP_ORDER.indexOf(b);return (ia<0?9:ia)-(ib<0?9:ib);});
  groups.forEach(g=>{const gd=el("div","srcgroup");
    const codes=byGroup[g].map(x=>x[0]);
    const allOn=codes.every(srcOn), someOn=codes.some(srcOn);
    const h4=el("h4",null,GROUP_NAME[g]||g);
    const allLab=el("label","all");const allCb=el("input");allCb.type="checkbox";allCb.checked=allOn;allCb.indeterminate=someOn&&!allOn;
    allCb.onchange=()=>{if(allCb.checked)codes.forEach(c=>state.enabledSources.add(c));else codes.forEach(c=>state.enabledSources.delete(c));afterSourceChange();};
    allLab.append(el("span",null,allOn?"all":someOn?"some":"none"));allLab.append(allCb);h4.append(allLab);gd.append(h4);
    const list=el("div","srclist");
    byGroup[g].sort((a,b)=>(b[1].counts.spells)-(a[1].counts.spells)).forEach(([code,s])=>{
      const lab=el("label");const cb=el("input");cb.type="checkbox";cb.checked=srcOn(code);
      cb.onchange=()=>{cb.checked?state.enabledSources.add(code):state.enabledSources.delete(code);afterSourceChange();};
      lab.append(cb);lab.append(el("span",null,s.name));lab.append(el("small",null,`${s.counts.spells}sp`));list.append(lab);});
    gd.append(list);wrap.append(gd);});
  $("#srcSub").textContent=`${state.enabledSources.size} of ${Object.keys(DATA.sources).length} enabled`;
}
function afterSourceChange(){ // drop now-hidden picks/classes
  state.classes=state.classes.filter(r=>{const c=CLS_BY[r.clsKey];return c&&visible(c);});
  state.classes.forEach(r=>{const s=r.subKey&&SUB_BY[r.subKey];if(s&&!visible(s))r.subKey=null;});
  state.feats=state.feats.filter(fk=>{const f=FEAT_BY[fk];return f&&visible(f);});
  const sp=RACE_BY[state.speciesKey];if(sp&&!visible(sp))state.speciesKey="";
  refreshAll();renderSrcModal();render();
}
function refreshAll(){refreshAddClass();refreshSpecies();refreshAddFeat();renderClassRows();renderFeatChips();}

// ── events ───────────────────────────────────────────────────────────────
$("#addClass").onchange=e=>{const clsKey=e.target.value;
  if(clsKey){state.classes.push({clsKey,subKey:null,level:1,id:state.nextRowId++});e.target.value="";renderClassRows();render();}};
$("#speciesSel").onchange=e=>{state.speciesKey=e.target.value;render();};
$("#addFeat").onchange=e=>{if(e.target.value&&!state.feats.includes(e.target.value)){state.feats.push(e.target.value);e.target.value="";renderFeatChips();render();}};
$("#addOrigin").onchange=e=>{if(e.target.value&&!state.feats.includes(e.target.value)){state.feats.push(e.target.value);e.target.value="";renderFeatChips();render();}};
$("#addEpic").onchange=e=>{if(e.target.value&&!state.feats.includes(e.target.value)){state.feats.push(e.target.value);e.target.value="";renderFeatChips();render();}};
$("#fq").oninput=e=>{state.filters.q=e.target.value;render();};
$("#filterBtn").onclick=()=>{$("#filterPanel").classList.toggle("hidden");$("#filterBtn").classList.toggle("on");};
$("#clearFilters").onclick=()=>{const q=state.filters.q;state.filters=FILTER_DEFAULT();state.filters.q=q;$("#fReprint").value="dedupe";refreshAll();render();};
$("#fSchool").onchange=e=>{state.filters.school=e.target.value;render();};
$("#fClass").onchange=e=>{state.filters.cls=e.target.value;render();};
$("#fSave").onchange=e=>{state.filters.save=e.target.value;render();};
$("#fDmg").onchange=e=>{state.filters.dmg=e.target.value;render();};
$("#fBook").onchange=e=>{state.filters.book=e.target.value;render();};
$("#fReprint").onchange=e=>{state.filters.reprint=e.target.value;refreshAll();render();};
$("#fChosen").onclick=()=>{state.filters.chosen=!state.filters.chosen;render();};
$("#tabBuild").onclick=()=>switchTab("build");
$("#tabTable").onclick=()=>switchTab("table");
$("#tGroup").onchange=e=>{tableOpts.group=e.target.value;renderTable();};
$("#pickClear").onclick=()=>{ if(!PICK)return;
  if(PICK.classIdx!=null){const ch=state.chosen[PICK.classIdx];if(ch)ch.spells=(ch.spells||[]).filter(k=>{const s=SPELL_BY[k];return !(s&&s.level>=1&&s.level<=PICK.maxLevel);});}
  else state.choices[PICK.id]=[];
  save();renderPickList();render();};
$("#prepDailyBtn").onclick=openPrepDaily;
$("#prepClose").onclick=()=>$("#prepModal").classList.add("hidden");
$("#prepDone").onclick=()=>$("#prepModal").classList.add("hidden");
$("#prepModal").onclick=e=>{if(e.target.id==="prepModal")$("#prepModal").classList.add("hidden");};
$("#prepPrev").onclick=()=>{if(PREP&&PREP.step>0){PREP.step--;PREP.search="";renderPrepStep();}};
$("#prepNext").onclick=()=>{if(PREP&&PREP.step<PREP.idxs.length-1){PREP.step++;PREP.search="";renderPrepStep();}};
$("#prepSearch").oninput=e=>{if(PREP){PREP.search=e.target.value;renderPrepList();}};
$("#prepLevelBtn").onclick=e=>{e.stopPropagation();toggleMenu("#prepLevelPop");};
$("#pickClose").onclick=()=>$("#pickModal").classList.add("hidden");
$("#pickModal").onclick=e=>{if(e.target.id==="pickModal")$("#pickModal").classList.add("hidden");};
$("#pickSearch").oninput=renderPickList;
$("#customBtn").onclick=()=>{closeMenu();openCustom();};
$("#customClose").onclick=()=>$("#customModal").classList.add("hidden");
$("#customModal").onclick=e=>{if(e.target.id==="customModal")$("#customModal").classList.add("hidden");};
$("#customPrev").onclick=()=>{if(CSTEP>0){CSTEP--;renderCustomStep();}};
$("#customNext").onclick=()=>{if(CSTEP<CSTEP_NAMES.length-1){CSTEP++;renderCustomStep();}};
$("#customDone").onclick=compileCustom;
$("#importBtn").onclick=openImport;
$("#importClose").onclick=()=>$("#importModal").classList.add("hidden");
$("#importModal").onclick=e=>{if(e.target.id==="importModal")$("#importModal").classList.add("hidden");};
$("#importPick").onclick=e=>{e.stopPropagation();$("#importFiles").click();};
$("#importDrop").onclick=()=>$("#importFiles").click();
$("#importFiles").onchange=e=>{stageFiles(e.target.files);e.target.value="";};
{const drop=$("#importDrop");
 drop.ondragover=e=>{e.preventDefault();drop.classList.add("drag");};
 drop.ondragleave=()=>drop.classList.remove("drag");
 drop.ondrop=e=>{e.preventDefault();drop.classList.remove("drag");stageFiles(e.dataTransfer.files);};}
$("#importPasteAdd").onclick=()=>{const t=$("#importPaste").value.trim();if(!t)return;
  try{IMPORT_STAGE.push({name:"pasted "+(IMPORT_STAGE.length+1),json:JSON.parse(t)});$("#importPaste").value="";$("#importReport").textContent="";renderImportStage();}
  catch(e){$("#importReport").textContent="Pasted text isn’t valid JSON.";}};
$("#importClear").onclick=()=>{IMPORT_STAGE=[];renderImportStage();$("#importReport").textContent="";};
$("#importBuild").onclick=buildImport;
$("#sourcesBtn").onclick=()=>{closeMenu();renderSrcModal();$("#srcModal").classList.remove("hidden");};
$("#srcClose").onclick=()=>$("#srcModal").classList.add("hidden");
$("#srcModal").onclick=e=>{if(e.target.id==="srcModal")$("#srcModal").classList.add("hidden");};
$("#srcAll").onclick=()=>{state.enabledSources=new Set(Object.keys(DATA.sources));afterSourceChange();};
$("#srcNone").onclick=()=>{state.enabledSources=new Set();afterSourceChange();};
$("#src2024").onclick=()=>{state.enabledSources=new Set(["XPHB"]);afterSourceChange();};
$("#resetBtn").onclick=()=>{if(!confirm("Clear the whole build (classes, picks, filters)?"))return;
  state.classes=[];state.feats=[];state.speciesKey="";state.chosen={};state.choices={};state.nextRowId=1;
  state.filters=FILTER_DEFAULT();
  try{localStorage.removeItem(LS);}catch(e){}
  $("#fq").value="";$("#fReprint").value="dedupe";
  $("#filterPanel").classList.add("hidden");$("#filterBtn").classList.remove("on");
  refreshAll();render();};
$("#themeBtn").onclick=()=>{const r=document.documentElement,cur=r.getAttribute("data-theme");r.setAttribute("data-theme",cur==="dark"?"light":cur==="light"?"dark":(matchMedia("(prefers-color-scheme:dark)").matches?"light":"dark"));closeMenu();};
// overflow settings menu
function closeMenu(except){document.querySelectorAll(".menupop").forEach(p=>{if(p!==except)p.classList.add("hidden");});}
function toggleMenu(pop){const el2=$(pop);const open=el2.classList.contains("hidden");closeMenu(open?el2:null);el2.classList.toggle("hidden");}
$("#menuBtn").onclick=e=>{e.stopPropagation();toggleMenu("#menuPop");};
$("#tMenuBtn").onclick=e=>{e.stopPropagation();toggleMenu("#tMenuPop");};
$("#pickLevelBtn").onclick=e=>{e.stopPropagation();toggleMenu("#pickLevelPop");};
document.addEventListener("click",e=>{if(!e.target.closest(".menu"))closeMenu();});

// ── test helper: random sample build (local only) ──────────────────────────
function randomBuild(){
  const rnd=a=>a[Math.floor(Math.random()*a.length)];
  const casters=DATA.classes.filter(c=>visible(c)&&(c.caster||(SUBS_OF[key(c.name,c.source)]||[]).some(s=>visible(s)&&s.caster)));
  state.classes=[];state.feats=[];state.speciesKey="";state.chosen={};state.choices={};state.nextRowId=1;
  const n=1+Math.floor(Math.random()*2);
  for(let i=0;i<n;i++){const c=rnd(casters);const lvl=1+Math.floor(Math.random()*20);
    const row={clsKey:key(c.name,c.source),subKey:null,level:lvl,id:state.nextRowId++};
    const subs=(SUBS_OF[key(c.name,c.source)]||[]).filter(visible);
    if(subs.length&&lvl>=(c.subclassLevel||3)){const s=rnd(subs);row.subKey=key(s.name,s.source);}
    state.classes.push(row);}
  const races=DATA.races.filter(visible);if(races.length&&Math.random()<.7){const r=rnd(races);state.speciesKey=key(r.name,r.source);}
  const spellFeats=DATA.feats.filter(f=>visible(f)&&!(f.category||"").startsWith("FS")&&grantsAny(f.grants));
  if(spellFeats.length&&Math.random()<.6){const f=rnd(spellFeats);state.feats.push(key(f.name,f.source));}
  save();refreshAll();R=compute();
  // fill each caster's budget with random eligible spells
  R.casters.forEach(rec=>{const pool=[...R.pool.values()].filter(x=>x.takers.some(t=>t.idx===rec.idx));
    const cant=pool.filter(x=>x.sp.level===0),spl=pool.filter(x=>x.sp.level>0&&x.sp.level<=rec.maxLvl);
    const ch=state.chosen[rec.idx]={cantrips:[],spells:[]};
    for(let i=0;i<rec.cantrips&&cant.length;i++){const p=cant.splice(Math.floor(Math.random()*cant.length),1)[0];ch.cantrips.push(key(p.sp.name,p.sp.source));}
    for(let i=0;i<rec.prepared&&spl.length;i++){const p=spl.splice(Math.floor(Math.random()*spl.length),1)[0];ch.spells.push(key(p.sp.name,p.sp.source));}
  });
  save();refreshAll();render();
}
// the 🎲 random-build helper is a local testing tool — hide it on the public build
if(typeof window!=="undefined"&&window.__PUBLIC__){const tb=$("#testBtn");if(tb)tb.remove();}
else $("#testBtn").onclick=randomBuild;

// drop build references to content the current data set doesn't contain
// (e.g. after switching baked↔imported, or a homebrew spell was deleted)
function pruneState(){
  state.classes=(state.classes||[]).filter(r=>CLS_BY[r.clsKey]);
  state.classes.forEach(r=>{if(r.subKey&&!SUB_BY[r.subKey])r.subKey=null;});
  state.feats=(state.feats||[]).filter(fk=>FEAT_BY[fk]);
  if(state.speciesKey&&!RACE_BY[state.speciesKey])state.speciesKey="";
}
// ── boot ─────────────────────────────────────────────────────────────────
load();
// newly-available content sources default to on (homebrew, a fresh import)
if(CUSTOM&&CUSTOM.spells&&CUSTOM.spells.length)state.enabledSources.add(HB_SRC);
pruneState();
$("#fReprint").value=state.filters.reprint;
$("#fq").value=state.filters.q;
maybeOnboard();
refreshAll();render();
