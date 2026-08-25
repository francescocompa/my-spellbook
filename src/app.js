"use strict";
const DATA = window.__DATA__;
const $ = s => document.querySelector(s);
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;};
const key=(n,s)=>n+"|"+s;
const ROMAN=["Cantrip","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];
const ABIL={int:"Intelligence",wis:"Wisdom",cha:"Charisma",str:"Strength",dex:"Dexterity",con:"Constitution"};
const ABIL_SHORT={int:"Int",wis:"Wis",cha:"Cha",str:"Str",dex:"Dex",con:"Con"};
const CORE="XPHB";

// indexes
const CLS_BY={}; DATA.classes.forEach(c=>CLS_BY[key(c.name,c.source)]=c);
const SUB_BY={}; DATA.subclasses.forEach(s=>SUB_BY[key(s.name,s.source)]=s);
const SUBS_OF={}; DATA.subclasses.forEach(s=>{const k=key(s.className,s.classSource);(SUBS_OF[k]=SUBS_OF[k]||[]).push(s);});
const FEAT_BY={}; DATA.feats.forEach(f=>FEAT_BY[key(f.name,f.source)]=f);
const RACE_BY={}; DATA.races.forEach(r=>RACE_BY[key(r.name,r.source)]=r);
const SPELL_BY={}; DATA.spells.forEach(s=>SPELL_BY[key(s.name,s.source)]=s);
const SPELL_BY_NAME={}; DATA.spells.forEach(s=>{(SPELL_BY_NAME[s.name.toLowerCase()]=SPELL_BY_NAME[s.name.toLowerCase()]||[]).push(s);});

// ── state + persistence ─────────────────────────────────────────────────
const LS="spellForge.v2";
const state={
  classes:[], speciesKey:"", feats:[], extraCantrips:0, extraSpells:0,
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
  extraCantrips:state.extraCantrips, extraSpells:state.extraSpells, nextRowId:state.nextRowId,
  enabledSources:[...state.enabledSources], chosen:state.chosen, choices:state.choices,
  filters:{...state.filters,levels:[...state.filters.levels],time:[...state.filters.time],comp:[...state.filters.comp],tags:[...state.filters.tags]},
})); }catch(e){} }
function load(){ try{ const s=JSON.parse(localStorage.getItem(LS)); if(!s)return;
  Object.assign(state,{classes:s.classes||[],speciesKey:s.speciesKey||"",feats:s.feats||[],
    extraCantrips:s.extraCantrips||0,extraSpells:s.extraSpells||0,chosen:s.chosen||{},choices:s.choices||{},nextRowId:s.nextRowId||1});
  if(s.enabledSources)state.enabledSources=new Set(s.enabledSources);
  if(s.filters)state.filters=Object.assign(state.filters,s.filters,{levels:new Set(s.filters.levels||[]),time:new Set(s.filters.time||[]),comp:new Set(s.filters.comp||[]),tags:new Set(s.filters.tags||[])});
  // migrate: ensure every class row has a stable id
  state.classes.forEach(r=>{if(r.id==null)r.id=state.nextRowId++;});
}catch(e){} }

const srcOn=src=>state.enabledSources.has(src);
const reprintOk=o=>state.filters.reprint==="all" || !o.reprinted;
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
    if(out)out.choices.push({id,type:"ability",options:ab.choose,value:val,giver:out._giver||tok});
    return val;}
  return sharedStat||null;
}
// walk a grants object (or an option), collecting fixed/freeCasts/expansions/choices into `out`
function resolveGrants(grants,level,tok,giver,out,sharedStat){
  if(!grants)return;
  out._giver=giver;
  const ability=resolveAbility(grants,tok,sharedStat,out);
  const spellOut=(rec,kind,recharge)=>{ if(!rec)return;
    if(kind==="prepared")out.fixed.push({rec,src:giver,recharge,ability});
    else out.freeCasts.push({name:rec.name,level:rec.level,recharge,src:giver,ability}); };
  (grants.fixed||[]).forEach(g=>{ if((g.atLevel||0)>level)return; spellOut(grantRec(g.spell.name),g.kind,g.recharge); });
  (grants.expansions||[]).forEach(e=>{ if((e.atLevel||0)<=level)out.expansions.push(e.filter); });
  (grants.picks||[]).forEach((p,j)=>{ if((p.atLevel||0)>level)return; const id=tok+":pk"+j;
    out.choices.push({id,count:p.count,filter:p.filter,kind:p.kind,recharge:p.recharge,giver,desc:p.desc,type:"pick"});
    (state.choices[id]||[]).forEach(k=>spellOut(SPELL_BY[k],p.kind,p.recharge)); });
  (grants.optionGroups||[]).forEach((og,i)=>{ const id=tok+":og"+i; const names=og.options.map(o=>o.name);
    const sel=state.choices[id]||names[0];
    out.choices.push({id,type:"option",options:names,value:sel,giver});
    const opt=og.options.find(o=>o.name===sel)||og.options[0];
    resolveGrants(opt,level,id,giver+" · "+sel,out,sharedStat); });
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
    resolveGrants(r.c.grants,r.level,"c"+r.idx,r.name,o,rAb);
    if(r.sub)resolveGrants(r.sub.grants,r.level,"s"+r.idx,r.sub.shortName,o,rAb);
    // Fighting Style that grants spells (Ranger→Druidic Warrior, Paladin→Blessed Warrior)
    const fsLvl=r.c.grantsFightingStyle;
    if(fsLvl&&r.level>=fsLvl){
      const fsFeats=DATA.feats.filter(f=>f.fsClass===r.c.name&&visible(f)&&grantsAny(f.grants));
      if(fsFeats.length){const id="c"+r.idx+":fs";
        const opts=[{name:"— none —",fixed:[],picks:[],expansions:[]}].concat(fsFeats.map(f=>({name:f.name,...f.grants})));
        const sel=state.choices[id]||"— none —";
        o.choices.push({id,type:"option",options:opts.map(x=>x.name),value:sel,giver:r.name+" · Fighting Style"});
        const opt=opts.find(x=>x.name===sel); if(opt&&opt.name!=="— none —")resolveGrants(opt,r.level,id,r.name+" · "+opt.name,o,rAb);
      }
    }
    // extra-cantrip order features (Cleric Thaumaturge / Druid Magician)
    (r.c.bonusChoices||[]).forEach((bc,i)=>{ if(r.level<(bc.atLevel||1))return; const id="c"+r.idx+":bc"+i;
      o.choices.push({id,type:"pick",count:bc.count,filter:bc.filter,kind:"known",recharge:"cantrip",giver:bc.label,desc:"choose a cantrip",optional:bc.optional});
      (state.choices[id]||[]).forEach(k=>{const rec=SPELL_BY[k];if(rec)o.freeCasts.push({name:rec.name,level:rec.level,recharge:"always known",src:bc.label});});
    });
    recExp[r.idx]=o.expansions;
    gout.fixed.push(...o.fixed);gout.freeCasts.push(...o.freeCasts);gout.choices.push(...o.choices);
  });
  state.feats.forEach(fk=>{const f=FEAT_BY[fk];if(f)resolveGrants(f.grants,charLevel,"f"+fk,f.name,gout,sharedStat);});
  if(state.speciesKey){const sp=RACE_BY[state.speciesKey];if(sp)resolveGrants(sp.grants,charLevel,"r",sp.name,gout,sharedStat);}

  // eligible pool = each caster's own list + its active expansions
  const pool=new Map(); // spellKey -> {sp,takers:[{idx,name,cantrip}],grants:[],srcs:Set}
  const want=sp=>{const k=key(sp.name,sp.source);let e=pool.get(k);if(!e){e={sp,takers:[],grants:[],srcs:new Set()};pool.set(k,e);}return e;};
  casters.forEach(r=>{
    const access=[{cls:r.listClass[0].toLowerCase(),levels:null}];
    (recExp[r.idx]||[]).forEach(f=>{const lv=f.level!=null?new Set(String(f.level).split(";").map(Number)):null;
      (f.class?f.class.split(";"):[]).forEach(cn=>access.push({cls:cn.trim().toLowerCase(),levels:lv}));});
    DATA.spells.forEach(sp=>{ if(!visible(sp))return; if(sp.level>r.maxLvl)return;
      for(const a of access){ if(a.levels&&!a.levels.has(sp.level))continue;
        if(sp.cls.some(([cn,cs])=>cn.toLowerCase()===a.cls&&srcOn(cs))){ want(sp).takers.push({idx:r.idx,name:r.name,cantrip:sp.level===0}); break; } }
    });
  });
  // fixed grants become always-prepared/free picks in the pool
  const freeCasts=gout.freeCasts;
  gout.fixed.forEach(g=>{const e=want(g.rec);e.srcs.add(g.src);if(!e.grants.some(x=>x.src===g.src))e.grants.push({src:g.src,recharge:g.recharge,ability:g.ability});});
  freeCasts.forEach(fc=>{const rec=grantRec(fc.name);if(rec){want(rec).srcs.add(fc.src);}});
  const choices=gout.choices;

  // caps per record + cart validation
  const caps={}; casters.forEach(r=>caps[r.idx]=capsFor(r));
  const cart={};
  casters.forEach(r=>{ const ch=state.chosen[r.idx]||{cantrips:[],spells:[]};
    const cp=caps[r.idx];
    const spItems=(ch.spells||[]).map(k=>SPELL_BY[k]).filter(Boolean);
    const overLevels={};
    if(cp&&cp.static){ for(let L=1;L<=cp.maxL;L++){ const cnt=spItems.filter(s=>s.level>=L).length; if(cnt>(cp.cap[L]||0))overLevels[L]=true; } }
    cart[r.idx]={cantrips:ch.cantrips||[],spells:ch.spells||[],caps:cp,
      cantOver:(ch.cantrips||[]).length>r.cantrips, spellOver:(ch.spells||[]).length>r.prepared, overLevels};
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
function render(){ R=compute(); renderChoices(); renderSlots(); renderCart(); renderSpells();
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
    if(c.type==="option"||c.type==="ability"){
      const isAb=c.type==="ability";
      const cg=el("div","cg"); cg.innerHTML=`<b>${c.giver}</b>${isAb?"casting ability":"choose one"}`; row.append(cg);
      const sel=el("select"); c.options.forEach(o=>sel.append(new Option(isAb?ABIL[o]||o:o,o)));
      sel.value=c.value; sel.onchange=()=>{state.choices[c.id]=sel.value; render();}; row.append(sel);
    } else { // pick
      const have=(state.choices[c.id]||[]).length;
      const cg=el("div","cg"); cg.innerHTML=`<b>${c.giver}</b>${c.desc||"choose"} <span class="need">${have}/${c.count}</span>`; row.append(cg);
      const picks=el("div","picks");
      (state.choices[c.id]||[]).forEach(k=>{const sp=SPELL_BY[k];if(!sp)return;
        const chip=el("span","cartchip");chip.append(el("span","lv",sp.level===0?"C":String(sp.level)));chip.append(el("span",null,sp.name));
        const x=el("button",null,"×");x.onclick=()=>{state.choices[c.id]=(state.choices[c.id]||[]).filter(v=>v!==k);render();};chip.append(x);picks.append(chip);});
      const btn=el("button","pickbtn"+(have>=c.count?" done":" needclr"), have>=c.count?"edit":`choose ${c.count-have}`);
      btn.onclick=()=>openPick(c); picks.append(btn); row.append(picks);
    }
    body.append(row);
  });
}

// ── spell-pick modal ───────────────────────────────────────────────────────
let PICK=null;
function openPick(choice){ PICK=choice; $("#pickSearch").value="";
  $("#pickTitle").textContent="Choose "+choice.count+(choice.count>1?" spells":" spell");
  $("#pickSub").textContent=choice.giver+" · "+(choice.desc||"");
  $("#pickModal").classList.remove("hidden"); renderPickList(); }
function renderPickList(){
  const list=$("#pickList"); list.innerHTML="";
  const q=$("#pickSearch").value.toLowerCase();
  let items=filterSpells(PICK.filter).filter(sp=>!q||sp.name.toLowerCase().includes(q));
  items.sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
  const cur=state.choices[PICK.id]||[];
  items.slice(0,300).forEach(sp=>{const k=key(sp.name,sp.source);const on=cur.includes(k);
    const d=el("div","sp"+(on?" chosen":""));
    const nm=el("div","nm",sp.name); attachSpell(nm,sp); d.append(nm);
    const meta=el("div","meta");[sp.school,sp.time,sp.range,sp.source!==CORE?sp.book:""].filter(Boolean).forEach(x=>meta.append(el("span",null,x)));d.append(meta);
    const take=el("div","take");const b=el("button","tk"+(on?" on":""),on?"✓ picked":"+ pick");
    b.onclick=()=>{let a=state.choices[PICK.id]||[];
      if(a.includes(k))a=a.filter(v=>v!==k); else if(a.length<PICK.count)a=[...a,k]; else return;
      state.choices[PICK.id]=a; renderPickList(); render();};
    take.append(b);d.append(take);list.append(d);});
  if(!items.length)list.append(el("div","empty","No matching spells for this choice."));
}

// ── table view ─────────────────────────────────────────────────────────────
const tableOpts={group:"level",showAll:false};
const RECHARGE_SHORT={"per long rest":"1/LR","per short rest":"1/SR","at will":"at will","always known":"—","prepared (free)":"—","cantrip":"—","expanded list":"—"};
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
    if(!r.static&&tableOpts.showAll){
      [...R.pool.values()].forEach(e=>{ if(e.takers.some(t=>t.idx===r.idx))
        push({sp:e.sp,src:classLabel(r),type:"prep",ability:r.ability,recharge:null,
              sel:picked.has(key(e.sp.name,e.sp.source)),idx:r.idx,rkey:key(e.sp.name,e.sp.source),cantrip:e.sp.level===0}); });
    } else {
      [...picked].forEach(k=>{const sp=SPELL_BY[k];if(sp)push({sp,src:classLabel(r),type:"prep",ability:r.ability,recharge:null,sel:true});});
    }
  });
  [...R.pool.values()].filter(e=>e.grants.length).forEach(e=>{const g=e.grants[0];
    push({sp:e.sp,src:srcTidy(g.src),type:"free",ability:g.ability,recharge:null,sel:true});});
  R.freeCasts.forEach(fc=>{if(fc.choice)return;const sp=grantRec(fc.name);if(sp)
    push({sp,src:srcTidy(fc.src),type:"cast",ability:fc.ability,recharge:fc.recharge,sel:true});});

  const tbl=$("#spellTable");tbl.innerHTML="";
  const nSel=rows.filter(r=>r.sel).length;
  $("#tableChip").textContent=rows.length?nSel+(tableOpts.showAll?` / ${rows.length}`:"")+" spells":"";
  $("#tableEmpty").textContent=rows.length?"":"Nothing selected yet — pick spells in the Build tab; subclass/feat/species grants appear here too.";
  $("#tShowWrap").style.display=R.casters.some(r=>!r.static)?"":"none";
  if(!rows.length)return;

  // grouping key + label
  const g=tableOpts.group;
  const groupKey=r=> g==="level"?r.sp.level : g==="ability"?(r.ability||"zzz") : r.src;
  const groupLabel=r=> g==="level"?(r.sp.level===0?"Cantrips":ROMAN[r.sp.level]+" level") : g==="ability"?(ABIL[r.ability]||"Other") : r.src;
  const groupSort=(a,b)=> g==="level"? a.sp.level-b.sp.level : String(groupKey(a)).localeCompare(String(groupKey(b)));
  rows.sort((a,b)=> groupSort(a,b) || a.sp.level-b.sp.level || a.sp.name.localeCompare(b.sp.name));

  const hasPick=tableOpts.showAll&&R.casters.some(r=>!r.static);
  const cols=(hasPick?[""]:[]).concat(["Spell","School","Time","Range","Duration","Conc","Casts","Source"]);
  const thead=el("tr");cols.forEach(h=>thead.append(el("th",null,h)));tbl.append(thead);
  const span=cols.length;
  let last=null;
  rows.forEach(row=>{const {sp,src,type,recharge,sel}=row;
    const gk=groupKey(row);
    if(gk!==last){last=gk;const gr=el("tr","grouphdr");const td=el("td");td.colSpan=span;td.textContent=groupLabel(row);gr.append(td);tbl.append(gr);}
    const tr=el("tr",sel?"":"unsel");
    if(hasPick){const pc=el("td","pickcell"+(sel?" on":""),sel?"✓":"○");
      if(row.idx!=null){pc.style.cursor="pointer";pc.onclick=()=>toggle(row.idx,row.rkey,row.cantrip);}tr.append(pc);}
    const nmtd=el("td","nm");nmtd.textContent=sp.name;attachSpell(nmtd,sp);
    if(sp.ritual)nmtd.append(Object.assign(el("span"),{textContent:" R",style:"color:var(--gold);font-size:10px;font-weight:700"}));tr.append(nmtd);
    tr.append(el("td",null,sp.school));tr.append(el("td",null,sp.time));tr.append(el("td",null,sp.range));
    tr.append(el("td",null,sp.durTxt));
    tr.append(Object.assign(el("td",sp.conc?"concmark":""),{textContent:sp.conc?"✓":"—"}));
    tr.append(el("td",null,recharge?(RECHARGE_SHORT[recharge]||recharge):"—"));
    const st=el("td");st.append(el("span","srcbadge"+(type==="free"?" free":type==="cast"?" cast":""),src));tr.append(st);
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
  const tPrep=R.casters.reduce((a,r)=>a+r.prepared,0)+(+state.extraSpells||0);
  const tCant=R.casters.reduce((a,r)=>a+r.cantrips,0)+(+state.extraCantrips||0);
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
      row.append(n);row.append(el("span","rc"+(/at will|always/.test(c.recharge)?" will":""),c.recharge));row.append(el("span","src",c.src));box.append(row);});
    cw.append(box);}
}

function renderCart(){
  const body=$("#cartBody");body.innerHTML="";
  const nPick=Object.values(state.chosen).reduce((a,c)=>a+(c.cantrips?.length||0)+(c.spells?.length||0),0);
  $("#cartChip").textContent=nPick?nPick+" picked":"";
  if(!R.casters.length){body.append(el("div","empty","No spellcasting class yet. Add one on the left, then pick spells from the list below."));return;}
  R.casters.forEach(r=>{
    const c=R.cart[r.idx],cp=c.caps; const over=c.cantOver||c.spellOver||Object.keys(c.overLevels).length;
    const b=el("div","budget"+(over?" over":""));
    const bh=el("div","bh");const nm=el("div","nm");nm.innerHTML=r.name+(r.viaSub?` <small>· ${r.viaSub.shortName}</small>`:"")+` <small>· L${r.level}</small>`;bh.append(nm);
    bh.append(el("span","kind"+(r.static?"":" daily"),r.static?"level-swap":"daily"));
    b.append(bh);
    b.append(meter("Cantrips",c.cantrips.length,r.cantrips));
    b.append(meter("Prepared",c.spells.length,r.prepared));
    if(r.spellbook!=null){const sb=el("div","note");sb.style.margin="2px 0 0";
      sb.innerHTML=`Spellbook: <b style="color:var(--ink)">${r.spellbook}</b> spells known free (you prepare ${r.prepared} of them daily; any Wizard spell up to ${ROMAN[r.maxLvl]} can be added).`;b.append(sb);}
    // distribution (static) or simple (daily)
    if(cp){const dist=el("div","dist");
      for(let L=cp.maxL;L>=1;L--){ const capL=cp.static?(cp.cap[L]-(cp.cap[L+1]||0)):r.prepared;
        const chosenExact=c.spells.map(k=>SPELL_BY[k]).filter(s=>s&&s.level===L).length;
        if(cp.static && capL<=0 && chosenExact<=0) continue;
        const cell=el("div","dcell"+(c.overLevels[L]?" over":""));
        cell.innerHTML=`<b>${chosenExact}${cp.static?`/${capL}`:""}</b><small>${ROMAN[L]}</small>`;dist.append(cell);}
      if(cp.static)dist.append(Object.assign(el("div","note"),{textContent:"best-case max per level (level-swap caster)",style:"flex-basis:100%;margin-top:2px"}));
      b.append(dist);}
    // chosen chips
    const picks=[...c.cantrips.map(k=>({k,cantrip:true})),...c.spells.map(k=>({k,cantrip:false}))];
    if(picks.length){const cc=el("div","cartchips");
      picks.map(p=>({...p,sp:SPELL_BY[p.k]})).filter(p=>p.sp).sort((a,b)=>a.sp.level-b.sp.level||a.sp.name.localeCompare(b.sp.name))
        .forEach(p=>{const chip=el("span","cartchip");chip.append(el("span","lv",p.sp.level===0?"C":ROMAN[p.sp.level].replace(/\D/g,"")));
          chip.append(el("span",null,p.sp.name));const x=el("button",null,"×");x.onclick=()=>removeChosen(r.idx,p.k);chip.append(x);cc.append(chip);});
      b.append(cc);}
    // granted (free) for this class
    body.append(b);
  });
  // granted free spells summary (from subclass/feat/species prepared grants)
  const granted=[...R.pool.values()].filter(e=>e.grants.length);
  if(granted.length){const g=el("div","budget");const gbh=el("div","bh");gbh.append(el("span","kind daily","always prepared · free"));g.append(gbh);
    const cc=el("div","cartchips");granted.sort((a,b)=>a.sp.level-b.sp.level||a.sp.name.localeCompare(b.sp.name)).forEach(e=>{
      const chip=el("span","cartchip gr");chip.append(el("span","lv",e.sp.level===0?"C":ROMAN[e.sp.level].replace(/\D/g,"")));
      chip.append(el("span",null,e.sp.name));chip.append(el("span",{},""));cc.append(chip);});
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
    const h=el("h3");h.append(el("span",null,l===0?"Cantrips":ROMAN[l]+" level"));h.append(el("span","n",byLvl[l].length+""));g.append(h);
    byLvl[l].forEach(i=>g.append(mkSpell(i,chosenKeys)));list.append(g);}
}
function mkEmpty(){const e=el("div","empty");
  if(!R.casters.length)e.innerHTML="<b>Add a spellcasting class</b><br>Then its spells appear here to browse and pick.";
  else e.innerHTML="<b>Nothing matches</b><br>Loosen the filters.";return e;}
// ── spell detail: hover tooltip + click modal ──────────────────────────────
const SPTIP=el("div","sptip");document.body.appendChild(SPTIP);
const SPMODAL=el("div","spmodal hidden");document.body.appendChild(SPMODAL);
SPMODAL.onclick=e=>{if(e.target===SPMODAL||e.target.classList.contains("x"))SPMODAL.classList.add("hidden");};
document.addEventListener("keydown",e=>{if(e.key==="Escape")SPMODAL.classList.add("hidden");});
function esc(s){return (s||"").replace(/[&<>]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]));}
function compText(sp){const c=sp.comp||{};const p=[];if(c.v)p.push("V");if(c.s)p.push("S");if(c.m)p.push("M"+(c.mat?` (${c.mat})`:""));return p.join(", ")||"—";}
function metaLine(sp){return `${sp.level===0?"Cantrip":ROMAN[sp.level]+"-level"} ${sp.school}${sp.ritual?" (ritual)":""}`;}
function tipHTML(sp){return `<h4>${sp.name}</h4><div class="sub">${metaLine(sp)}</div>`
  +`<div class="line"><b>Time</b> ${sp.time}</div><div class="line"><b>Range</b> ${sp.range}</div>`
  +`<div class="line"><b>Duration</b> ${sp.conc?"Concentration, ":""}${sp.durTxt}</div>`
  +((sp.desc||[]).length?`<p>${esc(sp.desc[0].slice(0,240))}${sp.desc[0].length>240?"…":""}</p>`:"")+`<p style="color:var(--muted);font-size:11px">click for full details</p>`;}
function posTip(ev){const pad=14,w=SPTIP.offsetWidth,h=SPTIP.offsetHeight;let x=ev.clientX+pad,y=ev.clientY+pad;
  if(x+w>innerWidth-8)x=ev.clientX-w-pad; if(y+h>innerHeight-8)y=innerHeight-h-8; SPTIP.style.left=Math.max(8,x)+"px";SPTIP.style.top=Math.max(8,y)+"px";}
function showTip(sp,ev){SPTIP.innerHTML=tipHTML(sp);SPTIP.classList.add("show");posTip(ev);}
function hideTip(){SPTIP.classList.remove("show");}
function modalHTML(sp){
  const grid=[["Level",sp.level===0?"Cantrip":ROMAN[sp.level]],["School",sp.school],["Casting time",sp.time],
    ["Range",sp.range],["Components",compText(sp)],["Duration",(sp.conc?"Concentration, up to ":"")+sp.durTxt]];
  return `<div class="box"><button class="x">×</button><div class="mh"><h3>${sp.name}</h3>`
    +`<div class="sub">${metaLine(sp)}${sp.source!==CORE?" · "+sp.book:""}</div></div><div class="mb">`
    +`<div class="grid">${grid.map(([k,v])=>`<b>${k}</b><span>${v}</span>`).join("")}</div>`
    +(sp.desc||[]).map(p=>`<p>${esc(p)}</p>`).join("")
    +((sp.higher||[]).length?`<div class="hl">${sp.higher.map(p=>`<p>${esc(p)}</p>`).join("")}</div>`:"")+`</div></div>`;}
function openSpellModal(sp){hideTip();SPMODAL.innerHTML=modalHTML(sp);SPMODAL.classList.remove("hidden");}
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
    const ch=state.chosen[t.idx];const on=ch&&(t.cantrip?ch.cantrips:ch.spells).includes(k);
    const rec=R.casters.find(r=>r.idx===t.idx);const over=rec&&R.cart[t.idx]&&(t.cantrip?R.cart[t.idx].cantOver:(R.cart[t.idx].spellOver||R.cart[t.idx].overLevels[sp.level]));
    const btn=el("button","tk"+(on?" on":"")+(on&&over?" over":""),t.name+(on?" ✓":" +"));
    btn.title=(on?"Remove from ":"Add to ")+t.name;
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
function buildToggleRow(box,pairs,set,numeric){box.innerHTML="";pairs.forEach(([v,t])=>{const val=numeric?+v:v;
  const b=el("button","cbtn"+(set.has(val)?" on":""),t);
  b.onclick=()=>{set.has(val)?set.delete(val):set.add(val);save();render();};box.append(b);});}

// ── builder UI ───────────────────────────────────────────────────────────
function classOptions(){return DATA.classes.filter(visible).sort((a,b)=>a.name.localeCompare(b.name)||a.source.localeCompare(b.source))
  .map(c=>({v:key(c.name,c.source),t:c.name+(c.source!==CORE?` (${c.source})`:"")+(c.caster?"":" ·")}));}
function renderClassRows(){
  const wrap=$("#classRows");wrap.innerHTML="";
  state.classes.forEach((row,idx)=>{const c=CLS_BY[row.clsKey]||{name:"?"};
    const div=el("div","classrow");
    const cl=el("div");cl.append(el("label","fld","Class"));const cn=el("div","cn");
    cn.innerHTML=c.name+(c.source!==CORE?` <small>${c.source}</small>`:"")+(c.caster?"":" <small>(no spells)</small>");cl.append(cn);div.append(cl);
    const subLvl=c.subclassLevel||3, locked=row.level<subLvl;
    const sc=el("div");sc.append(el("label","fld",locked?`Subclass · L${subLvl}`:"Subclass"));const ss=el("select");ss.append(new Option(locked?`— unlocks at ${subLvl} —`:"— none —",""));
    (SUBS_OF[key(c.name,c.source)]||[]).filter(visible).sort((a,b)=>a.shortName.localeCompare(b.shortName))
      .forEach(s=>ss.append(new Option(s.shortName+(s.source!==CORE?` (${s.source})`:"")+(s.caster?" ✦":""),key(s.name,s.source))));
    ss.value=row.subKey||"";ss.disabled=locked;if(locked)ss.style.opacity=".55";
    ss.onchange=()=>{row.subKey=ss.value||null;save();render();};sc.append(ss);div.append(sc);
    if(locked&&row.subKey){row.subKey=null;}
    const lv=el("div");lv.append(el("label","fld","Lvl"));const li=el("input");li.type="number";li.min=1;li.max=20;li.value=row.level;
    li.onchange=()=>{row.level=Math.max(1,Math.min(20,+li.value||1));li.value=row.level;save();render();};lv.append(li);div.append(lv);
    const rm=el("button","rm","×");rm.onclick=()=>{delete state.chosen[row.id];state.classes.splice(idx,1);renderClassRows();render();};div.append(rm);
    wrap.append(div);
  });
}
const CLASS_DISPLAY_TO_KEY={};
function refreshAddClass(){const dl=$("#classList");dl.innerHTML="";Object.keys(CLASS_DISPLAY_TO_KEY).forEach(k=>delete CLASS_DISPLAY_TO_KEY[k]);
  classOptions().forEach(o=>{CLASS_DISPLAY_TO_KEY[o.t]=o.v;dl.append(new Option(o.t));});}
function refreshSpecies(){const s=$("#speciesSel");s.innerHTML="";s.append(new Option("— none —",""));
  DATA.races.filter(visible).sort((a,b)=>a.name.localeCompare(b.name)).forEach(r=>s.append(new Option(r.name+(r.source!==CORE?` (${r.source})`:"")+(r.grants.length?" ✦":""),key(r.name,r.source))));
  s.value=state.speciesKey&&[...s.options].some(o=>o.value===state.speciesKey)?state.speciesKey:"";state.speciesKey=s.value;}
function refreshAddFeat(){const s=$("#addFeat");s.innerHTML="";s.append(new Option("+ add a feat…",""));
  // exclude Fighting-Style feats (FS*) — those are class-feature choices, not free feats
  DATA.feats.filter(f=>visible(f)&&!(f.category||"").startsWith("FS")).sort((a,b)=>a.name.localeCompare(b.name))
    .forEach(f=>s.append(new Option(f.name+(f.source!==CORE?` (${f.source})`:""),key(f.name,f.source))));}
function renderFeatChips(){const box=$("#featChips");box.innerHTML="";state.feats.forEach((fk,i)=>{const f=FEAT_BY[fk];if(!f)return;
  const c=el("span","chip");c.append(el("span",null,f.name));const b=el("button",null,"×");b.onclick=()=>{state.feats.splice(i,1);renderFeatChips();render();};c.append(b);box.append(c);});}

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
function tryAddClass(){const v=$("#addClass").value.trim();const clsKey=CLASS_DISPLAY_TO_KEY[v];
  if(clsKey){state.classes.push({clsKey,subKey:null,level:1,id:state.nextRowId++});$("#addClass").value="";renderClassRows();render();}}
$("#addClass").onchange=tryAddClass;
$("#addClass").oninput=e=>{if(CLASS_DISPLAY_TO_KEY[e.target.value.trim()])tryAddClass();};
$("#speciesSel").onchange=e=>{state.speciesKey=e.target.value;render();};
$("#addFeat").onchange=e=>{if(e.target.value&&!state.feats.includes(e.target.value)){state.feats.push(e.target.value);e.target.value="";renderFeatChips();render();}};
$("#extraCantrips").oninput=e=>{state.extraCantrips=+e.target.value||0;render();};
$("#extraSpells").oninput=e=>{state.extraSpells=+e.target.value||0;render();};
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
$("#tShowAll").onchange=e=>{tableOpts.showAll=e.target.checked;renderTable();};
$("#pickClose").onclick=()=>$("#pickModal").classList.add("hidden");
$("#pickModal").onclick=e=>{if(e.target.id==="pickModal")$("#pickModal").classList.add("hidden");};
$("#pickSearch").oninput=renderPickList;
$("#sourcesBtn").onclick=()=>{closeMenu();renderSrcModal();$("#srcModal").classList.remove("hidden");};
$("#srcClose").onclick=()=>$("#srcModal").classList.add("hidden");
$("#srcModal").onclick=e=>{if(e.target.id==="srcModal")$("#srcModal").classList.add("hidden");};
$("#srcAll").onclick=()=>{state.enabledSources=new Set(Object.keys(DATA.sources));afterSourceChange();};
$("#srcNone").onclick=()=>{state.enabledSources=new Set();afterSourceChange();};
$("#src2024").onclick=()=>{state.enabledSources=new Set(["XPHB"]);afterSourceChange();};
$("#resetBtn").onclick=()=>{if(!confirm("Clear the whole build (classes, picks, filters)?"))return;
  state.classes=[];state.feats=[];state.speciesKey="";state.extraCantrips=0;state.extraSpells=0;state.chosen={};state.choices={};state.nextRowId=1;
  state.filters=FILTER_DEFAULT();
  try{localStorage.removeItem(LS);}catch(e){}
  $("#extraCantrips").value=0;$("#extraSpells").value=0;$("#fq").value="";$("#fReprint").value="dedupe";
  $("#filterPanel").classList.add("hidden");$("#filterBtn").classList.remove("on");
  refreshAll();render();};
$("#themeBtn").onclick=()=>{const r=document.documentElement,cur=r.getAttribute("data-theme");r.setAttribute("data-theme",cur==="dark"?"light":cur==="light"?"dark":(matchMedia("(prefers-color-scheme:dark)").matches?"light":"dark"));closeMenu();};
// overflow settings menu
function closeMenu(){$("#menuPop").classList.add("hidden");}
$("#menuBtn").onclick=e=>{e.stopPropagation();$("#menuPop").classList.toggle("hidden");};
document.addEventListener("click",e=>{if(!e.target.closest(".menu"))closeMenu();});

// ── boot ─────────────────────────────────────────────────────────────────
load();
$("#fReprint").value=state.filters.reprint;
$("#fq").value=state.filters.q;
$("#extraCantrips").value=state.extraCantrips;$("#extraSpells").value=state.extraSpells;
refreshAll();render();
