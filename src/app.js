"use strict";
const $ = s => document.querySelector(s);
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e;};
const key=(n,s)=>n+"|"+s;
// D135 · a REPEATABLE feat or invocation is held once per take. `state.feats` and
// `state.optFeats` are the acquisition order (E1 · D115(b,h)), so a second copy needs an
// identity of its own — otherwise its grants, its choices (`"f"+fk` is the whole token
// path) and its slot would all be the FIRST copy's. The nth copy carries a `##n` suffix;
// the first keeps the bare key, so nothing already stored moves and no migration is owed.
// Every LOOKUP into FEAT_BY / OPT_BY goes through `baseKey`; the arrays hold the suffixed
// form and stay unique, which is what keeps choice ids stable when a sibling is removed.
const baseKey=k=>{const i=String(k).indexOf("##");return i<0?String(k):String(k).slice(0,i);};
const sameEnt=(a,b)=>baseKey(a)===baseKey(b);
// the next free identity for one more copy — reuses a hole rather than climbing forever
const nextCopy=(arr,k)=>{let n=1;while(arr.indexOf(n===1?k:k+"##"+n)>=0)n++;
  return n===1?k:k+"##"+n;};
const copyCount=(arr,k)=>arr.filter(x=>baseKey(x)===k).length;
const ROMAN=["Cantrip","1st","2nd","3rd","4th","5th","6th","7th","8th","9th"];
// "0;1;2" -> "0-2", "1;3" -> "1, 3": collapse a level list into ranges
function fmtLevelList(str){const nums=String(str).split(/[;,]/).map(s=>s.trim()).filter(Boolean).map(Number).filter(n=>!isNaN(n)).sort((a,b)=>a-b);
  if(nums.length<2)return String(str);
  const out=[];let i=0;while(i<nums.length){let j=i;while(j+1<nums.length&&nums[j+1]===nums[j]+1)j++;out.push(i===j?`${nums[i]}`:`${nums[i]}-${nums[j]}`);i=j+1;}return out.join(", ");}
// tidy a human descriptor that embeds a semicolon level list ("level 0;1;2, …" -> "level 0-2, …")
const fmtDesc=s=>String(s||"").replace(/\blevel\s+(\d+(?:[;,]\d+)+)/gi,(m,g)=>"level "+fmtLevelList(g));
// ── icons ───────────────────────────────────────────────────────────────────
// Real SVG icons, never font glyphs (monster-forge convention: 16×16, stroke
// currentColor). Sized by CSS (`.ico svg` defaults to 14px; contexts override) so
// one path serves every size. Static HTML sites carry `data-ico`; boot fills them.
const _I=(inner,fill)=>`<svg viewBox="0 0 16 16" ${fill?'fill="currentColor"':'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"'} aria-hidden="true">${inner}</svg>`;
const ICONS={
  dice:_I('<rect x="2" y="2" width="12" height="12" rx="2.6"/><g fill="currentColor" stroke="none"><circle cx="5.5" cy="5.5" r="1.4"/><circle cx="10.5" cy="5.5" r="1.4"/><circle cx="5.5" cy="10.5" r="1.4"/><circle cx="10.5" cy="10.5" r="1.4"/></g>'),
  dots:_I('<circle cx="3.2" cy="8" r="1.4"/><circle cx="8" cy="8" r="1.4"/><circle cx="12.8" cy="8" r="1.4"/>',1),
  stack:_I('<rect x="2.2" y="2.7" width="11.6" height="10.6" rx="1.6"/><path d="M2.2 6.4h11.6M2.2 9.9h11.6"/>'),
  pencil:_I('<path d="M11.1 2.9a1.4 1.4 0 0 1 2 2L5.4 12.6 2.6 13.4l.8-2.8z"/>'),
  download:_I('<path d="M8 2.2v7.2M8 9.4 5.4 6.8M8 9.4l2.6-2.6M2.6 11.4v1a1.6 1.6 0 0 0 1.6 1.6h7.6a1.6 1.6 0 0 0 1.6-1.6v-1"/>'),
  gear:_I('<circle cx="8" cy="8" r="2.3"/><path d="M8 1.8v2M8 12.2v2M1.8 8h2M12.2 8h2M3.6 3.6l1.4 1.4M11 11l1.4 1.4M12.4 3.6 11 5M5 11l-1.4 1.4"/>'),
  theme:_I('<circle cx="8" cy="8" r="5.6"/><path d="M8 2.4a5.6 5.6 0 0 1 0 11.2z" fill="currentColor" stroke="none"/>'),
  reset:_I('<path d="M3.2 8a4.8 4.8 0 1 0 1.4-3.4"/><path d="M4.6 1.9v2.7H1.9"/>'),
  moon:_I('<path d="M9.4 2.4a5.9 5.9 0 1 0 4.2 8.9A6.6 6.6 0 0 1 9.4 2.4z"/>'),
  plus:_I('<path d="M8 3v10M3 8h10"/>'),
  x:_I('<path d="M4 4l8 8M12 4l-8 8"/>'),
  check:_I('<path d="M3 8.6 6.4 12 13 4.6"/>'),
  help:_I('<circle cx="8" cy="8" r="6.4"/><path d="M6.1 6.2a1.95 1.95 0 1 1 2.6 1.85c-.45.17-.7.55-.7 1.02v.4"/><circle cx="8" cy="11.6" r=".55" fill="currentColor" stroke="none"/>'),
  warn:_I('<path d="M8 2.4 14.6 13.4H1.4z"/><path d="M8 6.6v3"/><circle cx="8" cy="11.4" r=".2"/>'),
  spark:_I('<path d="M8 1.6 9.7 6.3 14.4 8 9.7 9.7 8 14.4 6.3 9.7 1.6 8 6.3 6.3z"/>',1),
  dot:_I('<circle cx="8" cy="8" r="3.4"/>',1),
  grip:_I('<circle cx="6" cy="4" r="1.3"/><circle cx="10" cy="4" r="1.3"/><circle cx="6" cy="8" r="1.3"/><circle cx="10" cy="8" r="1.3"/><circle cx="6" cy="12" r="1.3"/><circle cx="10" cy="12" r="1.3"/>',1),
  book:_I('<path d="M3 3.2h4.2A1.8 1.8 0 0 1 9 5v8a1.4 1.4 0 0 0-1.4-1.4H3z"/><path d="M13 3.2H8.8A1.8 1.8 0 0 0 7 5v8a1.4 1.4 0 0 1 1.4-1.4H13z"/>'),
  lock:_I('<rect x="3.4" y="7" width="9.2" height="6.6" rx="1.6"/><path d="M5.6 7V5.2a2.4 2.4 0 0 1 4.8 0V7"/>'),
  copy:_I('<rect x="5.6" y="5.6" width="8" height="8" rx="1.7"/><path d="M10.4 5.6V4.1A1.7 1.7 0 0 0 8.7 2.4H4.1A1.7 1.7 0 0 0 2.4 4.1v4.6a1.7 1.7 0 0 0 1.7 1.7h1.5"/>'),
  trash:_I('<path d="M2.7 4.3h10.6M6.4 4.3V3.2a1 1 0 0 1 1-1h1.2a1 1 0 0 1 1 1v1.1"/><path d="m4.3 4.3.6 8.1a1.2 1.2 0 0 0 1.2 1.1h3.8a1.2 1.2 0 0 0 1.2-1.1l.6-8.1"/>'),
  order:_I('<path d="M2.4 3.9h6.4M2.4 8h4.4M2.4 12.1h2.6"/><path d="M12.1 3.4v9.2M12.1 12.6 10.4 11M12.1 12.6 13.8 11"/>'),
  bookmark:_I('<path d="M4.1 2.7h7.8v10.6L8 10.5l-3.9 2.8z"/>'),
  star:_I('<path d="M8 2.2 9.85 6l4.15.6-3 2.95.71 4.15L8 11.74 4.29 13.7 5 9.55 2 6.6 6.15 6z"/>'),
  print:_I('<path d="M4.6 6.1V2.7h6.8v3.4"/><rect x="2.4" y="6.1" width="11.2" height="4.8" rx="1.4"/><path d="M4.6 9.3h6.8v4H4.6z"/>'),
  // a trade: two arrows passing each other. Marks a pick swapped away and the one that
  // replaced it — it replaced the ⇄ glyph the timeline used to type into a chip (D57).
  retrain:_I('<path d="M2.6 5.4h8.6M9.1 3.3l2.1 2.1-2.1 2.1"/><path d="M13.4 10.6H4.8m2.1-2.1-2.1 2.1 2.1 2.1"/>'),
  // a branch splitting off its trunk — forking a variant of the build at a level
  fork:_I('<circle cx="4.6" cy="3.3" r="1.7"/><circle cx="4.6" cy="12.7" r="1.7"/><circle cx="11.6" cy="3.3" r="1.7"/><path d="M4.6 5v6M11.6 5v1.2a2.6 2.6 0 0 1-2.6 2.6H7.2a2.6 2.6 0 0 0-2.6 2.6"/>'),
  // a compass needle — "guide me from here"
  compass:_I('<circle cx="8" cy="8" r="5.9"/><path d="m10.6 5.4-1.3 3.9-3.9 1.3 1.3-3.9z"/>'),
  // the character page itself — its two columns. The guide's "switch back" (D126(a)):
  // deliberately NOT the ⇄ trade icon, which in this app means a swap, not a view
  views:_I('<rect x="2.2" y="3.2" width="11.6" height="9.6" rx="1.8"/><path d="M6.4 3.2v9.6"/>'),
  // the two walks (D131(e)) — a SHAFT with the head at the end it travels to, not a bare
  // chevron: the rail is a column of levels and these say which way you move along it.
  // Never a typed ↑/↓: a glyph sits wherever its font puts it (the drawn-caret rule).
  walkup:_I('<path d="M8 13.6V3.2"/><path d="M4.5 6.7 8 3.1l3.5 3.6"/>'),
  walkdn:_I('<path d="M8 2.4v10.4"/><path d="M4.5 9.3 8 12.9l3.5-3.6"/>'),
};
// the small × remove button used inside chips and rows
function xBtn(cls,onClick){const b=el("button",(cls||"")+" ico xsm");b.innerHTML=ICONS.x;
  b.setAttribute("aria-label","Remove");
  // ALWAYS stop the click here: if the handler re-renders, the original event would
  // keep bubbling into a freshly-attached parent handler (that is how dismissing the
  // level preview immediately re-armed it)
  if(onClick)b.onclick=e=>{e.stopPropagation();onClick(e);};
  return b;}
// a span.ico holding one icon — the unit every dynamic call site appends
function icoEl(name,cls){const sp=el("span","ico"+(cls?" "+cls:""));sp.innerHTML=ICONS[name]||"";return sp;}
// "locked until level N", as an icon + level rather than prose that gets truncated (D60).
// Reuse this wherever something is gated on a level.
function lockChip(level,what){
  const c=el("span","lockchip"); c.append(icoEl("lock")); c.append(el("span",null,"L"+level));
  attachTip(c,tipBlock("Unlocks at level "+level,(what||"This")+" becomes available once the class reaches level "+level+"."));
  return c;}
// static markup declares `data-ico` and gets filled once at boot
function fillIcons(root){(root||document).querySelectorAll("[data-ico]").forEach(n=>{
  if(!n.querySelector("svg"))n.insertAdjacentHTML("afterbegin",ICONS[n.dataset.ico]||"");});}

const ABIL={int:"Intelligence",wis:"Wisdom",cha:"Charisma",str:"Strength",dex:"Dexterity",con:"Constitution"};
const ABIL_SHORT={int:"Int",wis:"Wis",cha:"Cha",str:"Str",dex:"Dex",con:"Con"};
const CORE="XPHB";
const CORE_2024=["XPHB","XDMG","XMM"];   // the 2024 core books, for the "2024 core only" shortcut

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
const emptyDigest=()=>({meta:{},sources:{},spells:[],classes:[],subclasses:[],feats:[],races:[],optfeats:[],fullMc:FULL_MC,pact:PACT});
function loadJSON(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}}

// ── imported content lives in IndexedDB (D93) ──────────────────────────────────
// The imported digest dominates localStorage: a full 5etools export is ~2.3 MB before a single
// brew, and the folder scan (D92) can pick far more than that — it would have been a way to
// choose books the app then couldn't store. localStorage's ceiling is 5 MB by convention but
// varies (Chromium measured here takes tens of MB before throwing), and either way it is the
// wrong order of magnitude. IndexedDB is quota-managed against free disk — 2.5 GB measured on
// this machine — keeps a structured value with no JSON round-trip (no multi-MB string held
// twice at save time), and can REPORT what it is using, which is what T7 asks for.
//
// ONE database, two stores: `kv` for content, `handles` for the D92 directory handle (which is a
// live object localStorage could never have held anyway).
const IDB_NAME="spellForge", IDB_V=1, KV="kv", HANDLES="handles", IMPORT_KEY="import";
let IMPORT_CACHE=null;      // the digest in memory; IndexedDB is only where it persists
let IDB_OK=true;            // false after a real failure — private windows can refuse outright
function idbOpen(){return new Promise((res,rej)=>{
  let r; try{r=indexedDB.open(IDB_NAME,IDB_V);}catch(e){return rej(e);}
  r.onupgradeneeded=()=>{const db=r.result;
    if(!db.objectStoreNames.contains(KV))db.createObjectStore(KV);
    if(!db.objectStoreNames.contains(HANDLES))db.createObjectStore(HANDLES);};
  r.onerror=()=>rej(r.error); r.onblocked=()=>rej(new Error("database is busy in another tab"));
  r.onsuccess=()=>res(r.result);});}
function idbTx(store,mode,fn){return idbOpen().then(db=>new Promise((res,rej)=>{
  const t=db.transaction(store,mode),q=fn(t.objectStore(store));
  t.oncomplete=()=>res(q?q.result:undefined);
  t.onerror=()=>rej(t.error); t.onabort=()=>rej(t.error||new Error("write aborted"));}));}
const idbGet=(store,k)=>idbTx(store,"readonly",s=>s.get(k));
const idbPut=(store,k,v)=>idbTx(store,"readwrite",s=>s.put(v,k));
const idbDel=(store,k)=>idbTx(store,"readwrite",s=>s.delete(k));

// How much room is there, and what is using it? A failed save that says "something went wrong"
// is the thing T7 exists to remove.
async function storageReport(){
  const out={usage:null,quota:null};
  try{ if(navigator.storage&&navigator.storage.estimate){
    const e=await navigator.storage.estimate(); out.usage=e.usage; out.quota=e.quota;} }catch(_){}
  return out;
}
const fmtBytes=b=>b==null?"?":b>=1048576?(b/1048576).toFixed(b>=10485760?0:1)+" MB":Math.max(1,Math.round(b/1024))+" KB";
// what the digest itself is made of, biggest book first — the honest answer to "what is using
// the space", which is not the same question as "how much is left"
function digestWeight(d){
  const per={};
  DIGEST_ARRAYS.forEach(a=>(d&&d[a]||[]).forEach(e=>{const s=e.source||"?";per[s]=(per[s]||0)+1;}));
  const rows=Object.entries(per).sort((a,b)=>b[1]-a[1]);
  const name=c=>((d.sources||{})[c]||{}).name||c;
  return {total:rows.reduce((n,r)=>n+r[1],0),
    top:rows.slice(0,3).map(([c,n])=>`${name(c)} (${n})`),books:rows.length};
}

// Read the digest, migrating a legacy localStorage blob across on first run. The migration only
// deletes the old key AFTER the IndexedDB write resolves — a half-done move that loses the
// import is far worse than one that briefly stores it twice.
async function importLoad(){
  if(IDB_OK){
    try{ const v=await idbGet(KV,IMPORT_KEY);
      if(v){IMPORT_CACHE=v; try{localStorage.removeItem(LS_IMPORT);}catch(_){} return "idb";} }
    catch(e){IDB_OK=false;}
  }
  const legacy=loadJSON(LS_IMPORT);
  if(!legacy){IMPORT_CACHE=null;return IDB_OK?"empty":"no-idb";}
  IMPORT_CACHE=legacy;
  if(IDB_OK){
    try{ await idbPut(KV,IMPORT_KEY,legacy); localStorage.removeItem(LS_IMPORT); return "migrated"; }
    catch(e){IDB_OK=false;}
  }
  return "localstorage";
}
// Returns null on success, or a sentence naming the real cause.
async function importSave(digest){
  if(IDB_OK){
    try{ await idbPut(KV,IMPORT_KEY,digest); IMPORT_CACHE=digest;
         try{localStorage.removeItem(LS_IMPORT);}catch(_){}
         return null; }
    catch(e){
      const st=await storageReport(), w=digestWeight(digest);
      if(e&&(e.name==="QuotaExceededError"||/quota/i.test(e.message||"")))
        return `Not enough room to store this. It holds ${w.total} entries across ${w.books} books`
          +(w.top.length?` — the largest are ${w.top.join(", ")}`:"")
          +(st.quota?`. This browser allows ${fmtBytes(st.quota)} for the whole site and ${fmtBytes(st.usage)} is already used`:"")
          +". Untick some books and apply again.";
      IDB_OK=false;   // not a quota problem — fall through and try localStorage
    }
  }
  try{ localStorage.setItem(LS_IMPORT,JSON.stringify(digest)); IMPORT_CACHE=digest; return null; }
  catch(e){
    // Don't quote a ceiling — the localStorage limit is 5 MB by convention but browsers vary
    // widely (this one takes tens of MB), and a wrong number is worse than no number.
    const w=digestWeight(digest), st=await storageReport();
    return `This browser can’t store the import: its database is unavailable — a private window `
      +`blocks it — and the fallback store is full. This holds ${w.total} entries across `
      +`${w.books} books`+(w.top.length?`, the largest being ${w.top.join(", ")}`:"")
      +(st.quota?`; the site is allowed ${fmtBytes(st.quota)} in total`:"")
      +". Untick some books and apply again.";
  }
}
// The folder handle briefly lived in its own database before the stores were unified (D93).
// Anyone who used the folder scan in that window has an orphan; drop it once, quietly.
function dropLegacyFolderDb(){try{indexedDB.deleteDatabase("spellForgeFolder");}catch(_){}}
async function importDrop(){
  IMPORT_CACHE=null;
  if(IDB_OK){try{await idbDel(KV,IMPORT_KEY);}catch(_){}}
  try{localStorage.removeItem(LS_IMPORT);}catch(_){}
}
let DATA, IMPORTED=null, CUSTOM=null;
// mutable indexes — rebuilt after every content change
let CLS_BY={},SUB_BY={},SUBS_OF={},FEAT_BY={},RACE_BY={},OPT_BY={},SPELL_BY={},SPELL_BY_NAME={};
// edition de-duplication: when the same element (by identity) exists under several
// sources (2014 PHB + 2024 XPHB, TCE + …), keep only the newest and shadow the rest,
// so the pickers never list the same class/subclass/feat/species/spell twice.
// 5etools' `reprintedAs` flag is carried as `reprinted` + `supersededBy` (D127); it read
// as "patchy on subclasses" only because the unresolved `_copy` twins arrived without it,
// so we collapse by name too and the two rules back each other up. Homebrew (HB) is never
// shadowed and never shadows official.
let SHADOWED=new WeakSet();
const EDITION_RANK={XPHB:100,XDMG:99,XMM:98,PHB:50,DMG:49,MM:48};
const srcRank=s=>EDITION_RANK[s]!=null?EDITION_RANK[s]:10;
// higher = preferred winner: real (non-reprint) always beats a reprint, then newest edition
const dedupeScore=o=>(o.reprinted?0:1000)+srcRank(o.source);
// A lineage can be RENAMED between editions ("Elf (High)" -> "Elf — High Elf"), so a
// name match misses it and the picker lists Drow and High Elf twice. Collapse species on
// base + lineage instead, with the base word stripped back off the lineage.
function raceDedupeId(r){
  const base=(r.base||r.name).toLowerCase();
  let lin=(r.lineage||"").toLowerCase().trim();
  if(lin){ const b=base.replace(/\s*\(.*\)$/,"").trim();
    if(b&&lin.endsWith(" "+b))lin=lin.slice(0,-(b.length+1)).trim(); }
  return base+"|"+lin;
}
// The collapse key for SPELLS, named once: `buildIndexes` folds printings on it, and the
// D109 forms match (activeFormGrants) asks the same question of a grant's own spell ref.
const spellDedupeId=s=>String(s.name).toLowerCase();
function collapseEditions(list,idOf){
  const best={};
  list.forEach(o=>{ if(o.source===HB_SRC)return; const id=idOf(o);
    if(!best[id]||dedupeScore(o)>dedupeScore(best[id]))best[id]=o; });
  list.forEach(o=>{ if(o.source===HB_SRC)return; if(best[idOf(o)]!==o)SHADOWED.add(o); });
}
function buildIndexes(){
  SHADOWED=new WeakSet();
  collapseEditions(DATA.classes, c=>c.name.toLowerCase());
  // D127: the identity carries classSource. 5etools re-attaches every classic subclass to
  // the 2024 class as a second record, so "Cleric|Life" names TWO different offerings —
  // Life on Cleric|PHB and Life on Cleric|XPHB. Collapsing them together shadowed 67
  // classic subclasses out of the 2024 pickers entirely. Scoped to the class, duplicate
  // PRINTINGS of the same subclass on the same class still collapse, which is the job.
  collapseEditions(DATA.subclasses, s=>(s.className+"|"+(s.classSource||"")+"|"+(s.shortName||s.name)).toLowerCase());
  collapseEditions(DATA.feats, f=>f.name.toLowerCase());
  collapseEditions(DATA.races, raceDedupeId);
  collapseEditions(DATA.spells, spellDedupeId);
  collapseEditions(DATA.optfeats, o=>o.name.toLowerCase());
  CLS_BY={}; DATA.classes.forEach(c=>CLS_BY[key(c.name,c.source)]=c);
  // SUB_BY is keyed name|source and 124 subclass records SHARE that key with their
  // 2024-chassis twin (D127) — whichever is indexed last wins, which is how every 2014
  // subclass came to resolve to a hollow zero-grant record. It survives only as an
  // EXISTENCE check (pruneState) and as the last-resort fallback in subOfRow(); anything
  // that needs the record a build row actually points at must go through subOfRow.
  SUB_BY={}; DATA.subclasses.forEach(s=>SUB_BY[key(s.name,s.source)]=s);
  SUBS_OF={}; DATA.subclasses.forEach(s=>{const k=key(s.className,s.classSource);(SUBS_OF[k]=SUBS_OF[k]||[]).push(s);});
  FEAT_BY={}; DATA.feats.forEach(f=>FEAT_BY[key(f.name,f.source)]=f);
  RACE_BY={}; DATA.races.forEach(r=>RACE_BY[key(r.name,r.source)]=r);
  OPT_BY={}; DATA.optfeats.forEach(o=>OPT_BY[key(o.name,o.source)]=o);
  SPELL_BY={}; DATA.spells.forEach(s=>SPELL_BY[key(s.name,s.source)]=s);
  SPELL_BY_NAME={}; DATA.spells.forEach(s=>{(SPELL_BY_NAME[s.name.toLowerCase()]=SPELL_BY_NAME[s.name.toLowerCase()]||[]).push(s);});
}
// The subclass a build ROW points at (D127). The stored `subKey` is still name|source and
// NOTHING migrates — but that key is ambiguous, so the row's own class scopes it: look
// inside SUBS_OF[row.clsKey] first, and only fall back to the flat index when the class
// itself isn't loaded (a lean import / a book turned off), where the ambiguous answer is
// still better than none — a pick is never dropped for content we can't see (D42/D56).
function subOfRow(row){
  if(!row||!row.subKey)return null;
  const list=SUBS_OF[row.clsKey]||[];
  for(const s of list){ if(key(s.name,s.source)===row.subKey)return s; }
  return SUB_BY[row.subKey]||null;
}
// assemble DATA from the three layers and rebuild indexes; call whenever content changes
function assembleData(){
  // IMPORT_CACHE is filled by importLoad() before boot (D93) — assembleData stays SYNCHRONOUS,
  // which is what lets every existing caller (a custom-spell edit, an apply, a source change)
  // keep working unchanged. Only the load and the save are async.
  IMPORTED=IMPORT_CACHE; CUSTOM=loadJSON(LS_CUSTOM);
  // An import that stored but holds nothing (a bad zip, a half-written blob) used to WIN over
  // the baked data and leave the app empty — which pops the welcome importer over a build that
  // was working a moment ago. Content beats presence: an empty import falls back to baked.
  const impOk=IMPORTED&&(((IMPORTED.spells||[]).length)||((IMPORTED.classes||[]).length));
  if(IMPORTED&&!impOk)IMPORTED=null;
  const base=IMPORTED||BAKED||emptyDigest();
  DATA={meta:base.meta||{},sources:Object.assign({},base.sources),
    spells:(base.spells||[]).slice(),classes:base.classes||[],subclasses:base.subclasses||[],
    feats:base.feats||[],races:base.races||[],optfeats:base.optfeats||[],
    // "Name|SRC" -> stat block (D78). The BAKED blocks are kept underneath an import so
    // an older import (built before creature sets existed) doesn't blank the summon blocks
    // the app already shipped with; the import's own map wins where they collide.
    monsters:Object.assign({},(BAKED&&BAKED.monsters)||{},base.monsters||{}),
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
const LS="spellForge.v2";                      // legacy single-build blob (kept for rollback)
// Sources are a GLOBAL preference, not part of a build (D33) — hoisted out of `state` so a
// build can never carry them by accident. Each build only records the list it was seen under.
let SRC=new Set(Object.keys(DATA.sources));    // all on by default
const state={
  classes:[], speciesKey:"", feats:[], optFeats:[], featSlots:{}, sbFav:{}, sbFavSkip:[],
  filters:{q:"",levels:new Set(),school:"",cls:"",time:new Set(),comp:new Set(),tags:new Set(),save:"",dmg:"",books:null,reprint:"dedupe",chosen:false},
  chosen:{},   // rowId -> {cantrips:[], spells:[]}
  choices:{},  // choiceId -> option name | [spellKey,…]
  nextRowId:1,
};
const FILTER_DEFAULT=()=>({q:"",levels:new Set(),school:"",cls:"",time:new Set(),comp:new Set(),tags:new Set(),save:"",dmg:"",books:null,reprint:"dedupe",chosen:false});
function activeFilterCount(){const f=state.filters;let n=0;
  n+=f.levels.size?1:0;["school","cls","save","dmg"].forEach(k=>{if(f[k])n++;});
  n+=f.time.size?1:0;n+=f.comp.size?1:0;n+=f.tags.size?1:0;if(f.reprint!=="dedupe")n++;
  // the book override counts only when it differs from the global source selection
  if(f.books&&(f.books.size!==SRC.size||[...SRC].some(c=>!f.books.has(c))))n++;
  return n;}
// ── builds: many characters, many versions each (v7 · D33–D35) ───────────
// ONE flat list keyed by id. `meta.character` is a grouping LABEL, not a container (D35):
// versions of one character simply share it, and the manager groups on render. `meta.sources`
// records the book list this build was last seen under (D33) so activating it can offer to
// switch rather than prune. Homebrew, imported data, the column layout and the source list
// itself all stay global — they're content and preferences, not character sheets.
const LS_BUILDS="spellForge.builds.v1", LS_SOURCES="spellForge.sources.v1";
let BUILDS={activeId:null,order:[],builds:{}};
let bidSeq=0;
const newBuildId=()=>"b"+Date.now().toString(36)+(bidSeq++).toString(36);
const activeBuild=()=>BUILDS.builds[BUILDS.activeId];

const blankBuildState=()=>({classes:[],speciesKey:"",feats:[],optFeats:[],featSlots:{},levelOrder:[],
  customSources:[],chosen:{},choices:{},sbFav:{},nextRowId:1,filters:null,
  currentLevel:null,swaps:{},sbFavSkip:[]});
// the live `state` <-> the plain object stored in a build.
// The ARRAYS ARE THE ACQUISITION ORDER (E1 · D115(b,h)): `feats`, `optFeats` and each
// row's `chosen[id].cantrips`/`.spells` list picks in the order they were acquired.
// Per-level truth is a slice of that order — nothing may sort a stored pick array
// (render-side sorts must copy first), and export/import must carry it verbatim.
// New fields stay at the END of this literal: `save()` diffs stringified forms, and the
// loadBuilds() migration appends in the same order so an untouched build still compares equal.
function serializeState(){ const f=state.filters; return {
  classes:state.classes, speciesKey:state.speciesKey, feats:state.feats, optFeats:state.optFeats,
  featSlots:state.featSlots||{},          // which slot each feat was spent from (D84)
  nextRowId:state.nextRowId, chosen:state.chosen, choices:state.choices,
  levelOrder:state.levelOrder||[], customSources:state.customSources||[],
  sbFav:state.sbFav||{},                  // which summon forms this character actually uses
  filters:{...f,levels:[...f.levels],time:[...f.time],comp:[...f.comp],tags:[...f.tags],
           books:f.books?[...f.books]:null},
  currentLevel:state.currentLevel==null?null:state.currentLevel,  // null = at top (D115(e))
  swaps:state.swaps||{},                  // charLevel -> {spell?,cantrip?} events (D115(g))
  sbFavSkip:state.sbFavSkip||[],          // form offers dismissed in this build (D131(g))
};}
function applyState(s){ s=s||blankBuildState();
  // the live state must never share sub-objects with the stored build (see save()) —
  // boot passes activeBuild().state itself, so detach before assigning references in
  s=JSON.parse(JSON.stringify(s));
  Object.assign(state,{classes:s.classes||[],speciesKey:s.speciesKey||"",feats:s.feats||[],
    optFeats:s.optFeats||[],featSlots:s.featSlots||{},chosen:s.chosen||{},choices:s.choices||{},
    nextRowId:s.nextRowId||1,levelOrder:s.levelOrder||[],customSources:s.customSources||[],
    sbFav:s.sbFav||{},
    sbFavSkip:Array.isArray(s.sbFavSkip)?s.sbFavSkip:[],
    currentLevel:typeof s.currentLevel==="number"?s.currentLevel:null,
    // swapsNorm heals as well as reads: a stored map from before swaps split by kind
    // arrives as one event per level and comes out in the two-slot shape
    swaps:swapsNorm(s.swaps)});
  // arr() guards a filters blob that stored a Set as "{}" (a pre-E1 importer fallback did) —
  // boot must heal such a build, not throw at `new Set({})` and die half-rendered
  const arr=x=>Array.isArray(x)?x:[];
  state.filters=s.filters
    ? Object.assign(FILTER_DEFAULT(),s.filters,{levels:new Set(arr(s.filters.levels)),
        time:new Set(arr(s.filters.time)),comp:new Set(arr(s.filters.comp)),tags:new Set(arr(s.filters.tags)),
        books:Array.isArray(s.filters.books)?new Set(s.filters.books):null})
    : FILTER_DEFAULT();
  // every class row needs a stable id (cart/choices are keyed by it, never by array index)
  state.classes.forEach(r=>{if(r.id==null)r.id=state.nextRowId++;});
  // a build opens at its saved current level (E5 · D115(e)); top is one row-click away.
  // PREVIEW stays module state — this only POINTS it; callers render right after.
  const tot=state.classes.reduce((a,r)=>a+(r.level||0),0);
  PREVIEW.level=(typeof state.currentLevel==="number"&&state.currentLevel>=1&&state.currentLevel<tot)
    ?state.currentLevel:null;
  document.body.classList.toggle("previewing",PREVIEW.level!=null);
  SWAPARM=null;   // an armed swap belongs to the build it was armed in
  closeGpick();   // …and so does an open pick step (G3): its row id means nothing here
}
// derived labels — a build never stores what can be computed from its own picks
// "Glory Paladin 5 / Abjurer Wizard 3" — each class carries ITS OWN subclass, so the
// summary is also what the manager's search matches (searching a class finds the build)
function describeBuild(st){
  const rows=(st&&st.classes)||[];
  if(!rows.length)return "Empty build";
  const parts=rows.map(r=>{const c=CLS_BY[r.clsKey],sub=subOfRow(r);
    return ((sub?(sub.shortName||sub.name)+" ":"")+(c?c.name:"?")+" "+(r.level||0));});
  return parts.join(" / ");
}
// the character label carries NO level — versions of one character can sit at different
// levels (D35), so the level belongs in the version summary, not the group heading
function characterFrom(st){
  const names=((st&&st.classes)||[]).map(r=>CLS_BY[r.clsKey]).filter(Boolean).map(c=>c.name);
  return names.length?[...new Set(names)].join(" / "):"New character";
}
function mkBuild(st,sources,name){
  const id=newBuildId(), now=Date.now(), s=st||blankBuildState();
  return {id,meta:{name:name||"v1",character:characterFrom(s),named:false,created:now,updated:now,
    summary:describeBuild(s),sources:[...(sources||SRC)]},state:s};
}
// ambient notice bar — the honest channel for failures that would otherwise be silent
// (storage full, unreadable import) and for work that runs with NO modal open (D129's refresh
// from the ⋯ menu). One bar, latest message wins, dismissable.
// `kind`: "" = a failure (the red default) · "busy" (spinner, neutral) · "ok" · "ask" (needs you).
// `fade` auto-dismisses after N ms, but only while this same message is still the one showing —
// a later notice bumps the sequence and inherits the bar instead of being swallowed by it.
let NOTICE_SEQ=0;
function appNotice(msg,kind,fade){
  let n=document.getElementById("appNotice");
  if(!n){n=el("div","appnotice");n.id="appNotice";
    n.append(el("span","anspin"));
    n.append(el("span","anicon"));
    n.append(el("span","antxt"));
    n.append(xBtn("anx",()=>n.remove()));
    document.body.append(n);}
  n.className="appnotice"+(kind?" "+kind:"");
  const slot=n.querySelector(".anicon"); slot.textContent="";
  const ico=kind==="ok"?"check":kind==="ask"?"warn":kind?"":"warn";
  if(ico)slot.append(icoEl(ico,"anico"));
  n.querySelector(".antxt").textContent=msg;
  const seq=String(++NOTICE_SEQ); n.dataset.seq=seq;
  if(fade)setTimeout(()=>{const cur=document.getElementById("appNotice");
    if(cur&&cur.dataset.seq===seq)cur.remove();},fade);
  return n;
}
// D34's contract is "every edit writes through" — a quota failure breaks it, so it must
// be said once, not swallowed per keystroke
let LS_WARNED=false;
function storageNotice(e){ if(LS_WARNED)return; LS_WARNED=true;
  appNotice("Changes aren't saving — browser storage is full or blocked. The app keeps running, but edits are lost on reload. ("+((e&&e.message)||e)+")"); }
function persistBuilds(){ try{localStorage.setItem(LS_BUILDS,JSON.stringify(BUILDS));}catch(e){storageNotice(e);} }
function saveSources(){ try{localStorage.setItem(LS_SOURCES,JSON.stringify([...SRC]));}catch(e){storageNotice(e);} }
// auto-save: every edit writes through to the active build (D34) — no dirty state to lose
function save(){ const b=activeBuild(); if(!b)return;
  // DETACHED copy, never the live sub-objects: serializeState() returns `state`'s own
  // arrays/maps by reference, and storing those into `b.state` makes the next in-place
  // edit mutate BOTH sides of the identical-write compare below — which then reads
  // "identical" and skips the write, so pure pick edits never reached localStorage.
  const s=JSON.parse(JSON.stringify(serializeState()));
  // an identical write is skipped so `meta.updated` means "last EDITED", not "last
  // rendered" — merely opening the app used to re-stamp the active build every boot
  if(JSON.stringify(s)===JSON.stringify(b.state)
     &&JSON.stringify([...SRC])===JSON.stringify(b.meta.sources))return;
  b.state=s;
  b.meta.updated=Date.now();
  b.meta.summary=describeBuild(b.state);
  // the label auto-follows the build until you name it yourself (T3 sets `named`)
  if(!b.meta.named)b.meta.character=characterFrom(b.state);
  b.meta.sources=[...SRC];          // what this build was last seen under (D33)
  persistBuilds();
}
// the legacy blob minus its sources — those become the global list instead
const legacyState=s=>({classes:s.classes||[],speciesKey:s.speciesKey||"",feats:s.feats||[],
  optFeats:s.optFeats||[],chosen:s.chosen||{},choices:s.choices||{},nextRowId:s.nextRowId||1,
  filters:s.filters||null});
// the global source list, seeded from the legacy blob the first time so nothing changes
// for an existing session
function loadSources(){
  const g=loadJSON(LS_SOURCES);
  if(g&&g.length){SRC=new Set(g);return;}
  const legacy=loadJSON(LS);
  SRC=legacy&&legacy.enabledSources?new Set(legacy.enabledSources):new Set(Object.keys(DATA.sources));
  saveSources();
}
// "loaded" | "migrated" | "fresh". The legacy key is left untouched as a one-release rollback.
function loadBuilds(){
  const stored=loadJSON(LS_BUILDS);
  if(stored&&stored.builds&&Object.keys(stored.builds).length){
    BUILDS=stored;
    BUILDS.order=(BUILDS.order||[]).filter(id=>BUILDS.builds[id]);
    Object.keys(BUILDS.builds).forEach(id=>{if(!BUILDS.order.includes(id))BUILDS.order.push(id);});
    if(!BUILDS.builds[BUILDS.activeId])BUILDS.activeId=BUILDS.order[0];
    // E1 migration: pre-D115 builds gain the level pointer and the swap map with neutral
    // defaults (order = array order, current level = top). Appended in serializeState's own
    // key order and WITHOUT touching meta.updated — this is not an edit (D116(d)).
    let migrated=false;
    Object.values(BUILDS.builds).forEach(b=>{const st=b&&b.state; if(!st)return;
      if(st.currentLevel===undefined){st.currentLevel=null;migrated=true;}
      if(st.swaps===undefined){st.swaps={};migrated=true;}
      // and a build stored while a level carried ONE event gains the per-kind shape,
      // its old `kind` deciding which slot it lands in — nothing is dropped
      else{const n=swapsNorm(st.swaps);
        if(JSON.stringify(n)!==JSON.stringify(st.swaps)){st.swaps=n;migrated=true;}}
      // D131(g): the dismissed form offers. LAST, because serializeState puts it last and
      // the identical-write skip compares stringified forms — key order and all.
      if(st.sbFavSkip===undefined){st.sbFavSkip=[];migrated=true;}});
    if(migrated)persistBuilds();
    return "loaded";
  }
  const legacy=loadJSON(LS);
  const b=mkBuild(legacy?legacyState(legacy):null, legacy&&legacy.enabledSources);
  BUILDS={activeId:b.id,order:[b.id],builds:{[b.id]:b}};
  persistBuilds();
  return legacy?"migrated":"fresh";
}

const bookName=src=>src?(DATA.sources[src]&&DATA.sources[src].name||src):"";
const srcOn=src=>SRC.has(src);
// The record a `supersededBy` uid names, or null (D127). Two uid shapes reach here: a
// subclass's "Short|Class|ClassSource|Source" and everything else's "Name|SRC". The
// extractor drops 5etools' `tag`, and a pointer may CROSS types (a 2014 optional feature
// is reprinted as a 2024 feat, a Dragonmark subrace as a feat), so every same-shaped index
// is asked rather than just the record's own kind.
function supersededRec(uid){
  if(!uid)return null;
  const parts=String(uid).split("|");
  if(parts.length>=4){
    const sn=lc(parts[0]),k=key(parts[1],parts[2]),src=parts[3];
    return (SUBS_OF[k]||[]).find(s=>lc(s.shortName||s.name)===sn&&s.source===src)||null;
  }
  const k=key(parts[0],parts[1]||"");
  return SPELL_BY[k]||CLS_BY[k]||FEAT_BY[k]||OPT_BY[k]||RACE_BY[k]||SUB_BY[k]||null;
}
// Is the thing that superseded `o` actually HERE? 5etools' `reprinted` flag on its own
// hid a record even when the book that reprinted it was never imported — so importing
// only 2014 books left their subclasses invisible with nothing standing in for them.
//   • no pointer at all → a pre-D127 digest: fall back to the flag alone, as before;
//   • pointer resolves → the successor's own book decides;
//   • pointer unresolvable but its BOOK is loaded → we can't tell, keep the old answer;
//   • pointer unresolvable and its book isn't loaded → the successor is not here.
// Unknown never reads as excluded (D31).
function supersededLive(o){
  const uid=o&&o.supersededBy; if(!uid)return true;
  const rec=supersededRec(uid); if(rec)return srcOn(rec.source);
  const parts=String(uid).split("|"), src=parts.length>=4?parts[3]:(parts[1]||"");
  if(!src)return true;
  const known=!!DATA.sources[src]||Object.keys(DATA.sources).some(c=>c.toUpperCase()===src.toUpperCase());
  return known?srcOn(src):false;
}
// "dedupe" (default) hides both flagged reprints and edition-shadowed duplicates;
// "all" reveals every edition/source (the escape hatch to reach 2014 content).
const reprintOk=o=>state.filters.reprint==="all" ||
  (!SHADOWED.has(o) && !(o.reprinted && supersededLive(o)));
const visible=o=>srcOn(o.source)&&reprintOk(o);

// ── rules helpers ────────────────────────────────────────────────────────
function ecl(caster,l){return {full:l,artificer:Math.ceil(l/2),"1/2":Math.floor(l/2),"1/3":Math.floor(l/3)}[caster]||0;}
function maxLvlAt(caster,l){ if(caster==="pact")return DATA.pact[Math.min(l,20)-1][1];
  const e=ecl(caster,l); if(e<=0)return 0; const row=DATA.fullMc[Math.min(e,20)-1]||[];
  let m=0;row.forEach((n,i)=>{if(n>0)m=i+1;});return m; }

function resolveRow(row,idx){
  const c=CLS_BY[row.clsKey]; if(!c)return null;
  const sub=subOfRow(row);
  let caster=c.caster,ability=c.ability,prepArr=c.prepared,cantArr=c.cantrips,stat=c.static,listClass=[c.name,c.source],viaSub=null;
  // A non-casting class whose SUBCLASS casts draws on a list the class doesn't have, so
  // the record has to name one. `spellList` is DERIVED by both extractors from the
  // subclass's own expansions (D130) — it used to be hardcoded here as well, and
  // `|| ["Wizard","XPHB"]` silently made every future casting subclass a Wizard. There is
  // no guess left: null means the data doesn't say, `listUnknown` carries that to the
  // surfaces, and they say it rather than showing an empty picker (D31).
  if(!caster&&sub&&sub.caster){caster=sub.caster;ability=sub.ability;prepArr=sub.prepared;cantArr=sub.cantrips;stat=sub.static;listClass=sub.spellList||null;viaSub=sub;}
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
  return {...base,caster,ability,static:!!stat,isPact,pact,maxLvl,ownSlots,prepared,cantrips,spellbook,prepArr,listClass,listUnknown:!listClass,viaSub};
}
// A record with `listUnknown` casts but has no list to cast FROM — the one honest answer
// when the data doesn't name one (D130). Every surface that would otherwise show an empty
// picker says this instead: an empty pool with a stated reason beats a silent one (D31).
function listUnknownWho(r){return (r.viaSub&&(r.viaSub.shortName||r.viaSub.name))||r.name;}
function listUnknownWhy(r){
  return `${listUnknownWho(r)} casts on its own progression, but your books don't name the class list it draws from.`;}
function listUnknownNote(r){
  const n=el("div","note"); n.style.margin="2px 0 4px";
  // the record may still reach spells its OWN features name (an expansion filter), so the
  // card says what is missing without claiming the list is empty — the picker, which knows
  // whether anything came through, is the one that says "nothing to offer"
  n.innerHTML=`<b style="color:var(--bad)">No spell list.</b> ${esc(listUnknownWhy(r))} `
    +`Only what its own features name can be offered. Re-import your books; if it still `
    +`reads this, the subclass needs its list added.`;
  return n;}
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
// spells matching a pick/expansion/mark filter {level:'1;2',class:'Cleric;Druid',school:'E;D',
// 'damage type':'fire;cold','spell attack':'m;r;o'}. 5etools' own keys, and their case is
// not stable across books, so they are lowered once here. An unknown key is IGNORED, not
// failed — a filter this app can't read must never empty a pool it should have filled.
function filterSpells(f){
  const F={}; Object.keys(f||{}).forEach(k=>{F[String(k).toLowerCase()]=f[k];});
  const levels=F.level!=null?new Set(String(F.level).split(";").map(Number)):null;
  const classes=F.class?String(F.class).split(";").map(s=>s.trim().toLowerCase()):null;
  const schools=F.school?String(F.school).split(";").map(s=>SCHOOL_ABBR[s.trim().toUpperCase()]||s):null;
  // D135's designations narrow on these two: "a Warlock cantrip that deals damage" and
  // "…that requires an attack roll". The record carries `dmg` (types) and `atk` (bool),
  // so the damage-type set is intersected and any attack code means "needs an attack roll".
  const dmgs=F["damage type"]?new Set(String(F["damage type"]).split(";").map(s=>s.trim().toLowerCase())):null;
  const atk=F["spell attack"]!=null&&String(F["spell attack"]).trim()!=="";
  return DATA.spells.filter(sp=>{ if(!visible(sp))return false;
    if(levels&&!levels.has(sp.level))return false;
    if(classes&&!sp.cls.some(([cn,cs])=>classes.includes(cn.toLowerCase())&&srcOn(cs)))return false;
    if(schools&&!schools.includes(sp.school))return false;
    if(dmgs&&!(sp.dmg||[]).some(d=>dmgs.has(String(d).toLowerCase())))return false;
    if(atk&&!sp.atk)return false;
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
    if(out)out.choices.push({id,type:"ability",options:ab.choose,value:val,giver:out._giver||tok,giverSrc:out._giverSrc,
      owner:ownerOf(tok,out._giver||tok,out._giverSrc)});
    return val;}
  return sharedStat||null;
}
// walk a grants object (or an option), collecting fixed/freeCasts/expansions/choices into `out`
// `owner` is the entity the choices belong to — the class row, feat, species… — carried
// unchanged through nested option groups so the choices panel can group by it (D30).
const OWNER_KIND={c:"class",s:"subclass",f:"feat",o:"optional feature",r:"species",x:"custom source"};
const ownerOf=(tok,name,src)=>({id:tok.split(":")[0],name,src,kind:OWNER_KIND[tok[0]]||""});
// Where a giver is PRINTED, for its book chip's popover (D51). A choice group knows only
// the owner's name, book and kind, so the record has to be found again — a subclass is
// named by its shortName in that label, which is why both are matched.
const OWNER_POOL={"class":()=>DATA.classes,"subclass":()=>DATA.subclasses,"feat":()=>DATA.feats,
  "optional feature":()=>DATA.optfeats,"species":()=>DATA.races};
function ownerPage(o){
  if(!o||!o.src)return null;
  const pool=(OWNER_POOL[o.kind]||(()=>[]))(), n=lc(o.name||"");
  const hit=(pool||[]).find(e=>e.source===o.src&&(lc(e.name)===n||lc(e.shortName||"")===n));
  return (hit&&hit.page)||null;
}
function resolveGrants(grants,level,tok,giver,out,sharedStat,giverSrc,owner){
  if(!grants)return;
  owner=owner||ownerOf(tok,giver,giverSrc);
  out._giver=giver; out._giverSrc=giverSrc;
  const ability=resolveAbility(grants,tok,sharedStat,out);
  // `label` (the granting feature's name, when known) is preferred over the generic giver
  const spellOut=(rec,kind,recharge,label,extra,note)=>{ if(!rec)return; const src=label||giver;
    const e=kind==="prepared"?{rec,src,recharge,ability,note}
      :{name:rec.name,level:rec.level,recharge,src,ability,swappable:kind==="known",note};
    if(extra)Object.assign(e,extra);      // custom sources: own DC/attack, fixed cast level
    (kind==="prepared"?out.fixed:out.freeCasts).push(e); };
  (grants.fixed||[]).forEach(g=>{ if((g.atLevel||0)>level)return; spellOut(grantRec(g.spell.name),g.kind,g.recharge,g.feature,g.extra,g.note); });
  (grants.expansions||[]).forEach(e=>{ if((e.atLevel||0)<=level)out.expansions.push(Object.assign({},e.filter,{_atLevel:e.atLevel||0})); });
  (grants.picks||[]).forEach((p,j)=>{ if((p.atLevel||0)>level)return; const id=tok+":pk"+j;
    // `atLevel` rides along (G2): the guided chain has to file a class- or subclass-owned
    // choice under the character level it actually opens at, not under the row's first
    out.choices.push({id,count:p.count,filter:p.filter,kind:p.kind,recharge:p.recharge,giver:p.feature||giver,giverSrc,desc:p.desc,type:"pick",owner,note:p.note,atLevel:p.atLevel||0});
    // `extra` (a custom source's own DC/attack, a fixed cast level) was hardcoded null here
    // while fixed grants passed theirs — so a spell you PICKED from a source silently lost the
    // source's numbers. Nothing in the data emitted a pick with `extra` before D96, so it never
    // showed; it would have the moment one did.
    (state.choices[id]||[]).forEach(k=>spellOut(SPELL_BY[k],p.kind,p.recharge,p.feature,p.extra||null,p.note)); });
  // D135 · a MARK is a designation, not a grant: "choose one of your known Warlock cantrips
  // that deals damage" names a spell you already have and changes what it does. It rides the
  // pick machinery (one choice, count 1, an array value) so every surface that already draws
  // a pick draws this — but it never calls `spellOut`, because nothing is being granted. What
  // it produces instead is a NOTE on the designated spell, through D79's own path.
  (grants.marks||[]).forEach((mk,j)=>{ const id=tok+":mk"+j;
    out.choices.push({id,count:1,filter:mk.filter,kind:"mark",mark:true,type:"pick",
      giver:mk.feature||giver,giverSrc,desc:mk.desc,note:mk.note,owner,atLevel:mk.atLevel||0});
    (state.choices[id]||[]).forEach(k=>{const sp=SPELL_BY[k];
      if(sp&&out.marks)out.marks.push({key:k,src:mk.feature||giver,note:mk.note});}); });
  (grants.optionGroups||[]).forEach((og,i)=>{ const id=tok+":og"+i; const names=og.options.map(o=>o.name);
    const sel=state.choices[id]||names[0];
    out.choices.push({id,type:"option",options:names,value:sel,giver,giverSrc,owner});
    const opt=og.options.find(o=>o.name===sel)||og.options[0];
    resolveGrants(opt,level,id,giver+" · "+sel,out,sharedStat,giverSrc,owner); });
}

// ── level preview (D54) ────────────────────────────────────────────────────
// Plan at full level, LOOK at any level below it. View-only: PREVIEW is never saved
// and releasing it touches nothing. What makes multiclass previewable is the LEVEL
// PLAN (`state.levelOrder`, saved): which class each character level was taken in.
const PREVIEW={level:null};
// normalized acquisition order — always valid: the stored order is filtered against
// the build's actual class levels, then topped up per class in row order. Any edit
// normalizes through here, so there is no invalid state to guard against.
function classLevelPlan(){
  const want=new Map(state.classes.map(r=>[r.id,r.level||0]));
  const taken=new Map(state.classes.map(r=>[r.id,0]));
  const out=[];
  (state.levelOrder||[]).forEach(id=>{
    if(want.has(id)&&taken.get(id)<want.get(id)){out.push(id);taken.set(id,taken.get(id)+1);}});
  state.classes.forEach(r=>{for(let i=taken.get(r.id);i<(r.level||0);i++)out.push(r.id);});
  return out;
}
function previewLevels(){ if(PREVIEW.level==null)return null;
  const m=new Map();
  classLevelPlan().slice(0,PREVIEW.level).forEach(id=>m.set(id,(m.get(id)||0)+1));
  return m;
}
// a class row's level as the current view sees it — every level consumer goes through this
function effLevel(row){const m=previewLevels();return m?(m.get(row.id)||0):(row.level||0);}
function setPreview(l){
  const total=state.classes.reduce((a,r)=>a+(r.level||0),0);
  PREVIEW.level=(l==null||l>=total)?null:Math.max(1,l);
  document.body.classList.toggle("previewing",PREVIEW.level!=null);
  refreshAll();render();
}

// ── current level & swap events (E1 · D115(e,g)) ───────────────────────────
// The SAVED counterpart of the preview: `state.currentLevel` is where the character
// actually stands, null = at top level. E5 wires the surface; these are the only writers.
function setCurrentLevel(l){
  const total=state.classes.reduce((a,r)=>a+(r.level||0),0);
  state.currentLevel=(l==null||l>=total)?null:Math.max(1,Math.round(l));
  save();
}
// ── what each class may trade, and when (app-side hand table) ──────────────
// The digest models no swap rule — 5etools carries `preparedSpellsChange` and nothing
// else — so this is a BUILD fact and never enters the extractors (D123(c)'s precedent).
// Verified 2026-08-29 against the XPHB class prose in the mirror; no XPHB feature in
// that data uses `_copy`/`_mod`, so every sentence below was read literally.
//   spell   — "Whenever you gain a <Class> level, you can replace one spell on your
//             list…": Bard, Sorcerer, Warlock, Eldritch Knight, Arcane Trickster ONLY.
//             Cleric, Druid, Paladin, Ranger and Wizard change their list on a LONG
//             REST instead, which is not a build event (D18/D115(c)).
//   cantrip — "levelup" ("Whenever you gain a <Class> level, you can replace one of
//             your cantrips…") · "lr" (Wizard: "Whenever you finish a Long Rest…" —
//             the one class off the level-up cadence) · false (no cantrips at all).
// The two cadences CROSS: Cleric and Druid trade no spell on level-up yet do trade a
// cantrip. A class's cantrip rule is never derivable from its spell rule.
// Keyed by the printed class name, and by SUBCLASS name for the third casters, whose
// Spellcasting feature is the subclass's own. The rules stated are the 2024 ones, so a
// 2014 reprint sharing a name inherits them and is offered a cantrip swap its own text
// doesn't grant — advisory either way (D31): this blocks nothing and removes nothing.
// Arcane Trickster's locked Mage Hand needs no clause: it is a fixed grant, never a
// pick, so it can never be the outgoing side.
const SWAP_RULES={
  Bard:{spell:true,cantrip:"levelup"},
  Sorcerer:{spell:true,cantrip:"levelup"},
  Warlock:{spell:true,cantrip:"levelup"},
  Cleric:{spell:false,cantrip:"levelup"},
  Druid:{spell:false,cantrip:"levelup"},
  Wizard:{spell:false,cantrip:"lr"},
  Paladin:{spell:false,cantrip:false},
  Ranger:{spell:false,cantrip:false},
  // no XPHB Artificer exists. EFA's (the 2024-rules one) re-prepares and replaces a
  // cantrip on a long rest, like the wizard; TCE's 2014 text swaps on level-up.
  Artificer:{spell:false,cantrip:"lr"},
  "Eldritch Knight":{spell:true,cantrip:"levelup"},
  "Arcane Trickster":{spell:true,cantrip:"levelup"},
};
// A row's rule. The subclass is asked first (a third caster's Spellcasting is its own),
// then the class. An unrecognised caster — homebrew — falls back to what the DIGEST can
// say: a level-swap list trades a spell, and any class with cantrips trades one on
// level-up. Unknown must never read as "no" (D31).
function swapRule(row){
  const c=row&&CLS_BY[row.clsKey], sub=row&&row.subKey?SUB_BY[row.subKey]:null;
  const hit=(sub&&SWAP_RULES[sub.name])||(c&&SWAP_RULES[c.name]);
  if(hit)return hit;
  const sched=rowSched(row||{});
  return {spell:!!(sched&&sched.spells&&!sched.book),
          cantrip:sched&&sched.cant?"levelup":false};
}

// A level-up may carry ONE swap OF EACH KIND (−out +in) where the class's rules grant
// one: one leveled spell and one cantrip, independently. The map is keyed by character
// level and THEN by kind, so one-per-kind-per-level holds by construction. Whether a
// swap is granted at a level is the E4 sweep's business — this only keeps the shape
// sound. Callers save: an event always rides an array edit that must go with it.
const SWAP_KINDS=["spell","cantrip"];
function recordSwap(lvl,kind,ev){
  lvl=Math.round(+lvl); kind=kind==="cantrip"?"cantrip":"spell";
  if(!(lvl>=1&&lvl<=20)||!ev||!state.classes.some(r=>r.id===ev.row))return false;
  if(!ev.out||!ev.in||ev.out===ev.in)return false;
  (state.swaps[lvl]=state.swaps[lvl]||{})[kind]={row:ev.row,out:String(ev.out),in:String(ev.in)};
  return true;
}
// clearing one kind leaves the other standing; a level with neither drops out entirely
function clearSwap(lvl,kind){ lvl=Math.round(+lvl);
  const m=(state.swaps||{})[lvl]; if(!m)return;
  if(kind){if(m[kind]===undefined)return; delete m[kind];}
  else SWAP_KINDS.forEach(k=>{delete m[k];});
  if(!SWAP_KINDS.some(k=>m[k]))delete state.swaps[lvl];
  save(); }
const swapAt=(lvl,kind)=>(((state.swaps||{})[lvl])||{})[kind]||null;
// re-date a recorded trade: the SAME event, at another level-up. Nothing is deleted —
// the outgoing pick keeps its position and its acquisition history, only the level the
// trade happened at moves. Refuses if the target already carries an event of that kind,
// and puts the event back where it was if the write is rejected.
function moveSwap(from,to,kind){
  from=Math.round(+from); to=Math.round(+to);
  const ev=swapAt(from,kind); if(!ev||from===to||swapAt(to,kind))return false;
  const copy={row:ev.row,out:ev.out,in:ev.in};
  clearSwap(from,kind);                       // saves
  if(recordSwap(to,kind,copy)){save();return true;}
  recordSwap(from,kind,copy); save(); return false;
}
// every event of a map, flattened to [{lvl,kind,row,out,in}] — the read path for every
// consumer, so none of them has to know the map is two levels deep
function swapEvents(m){ const out=[];
  Object.entries(m||state.swaps||{}).forEach(([k,v])=>SWAP_KINDS.forEach(kind=>{
    const e=v&&v[kind]; if(e)out.push({lvl:+k,kind,row:e.row,out:e.out,in:e.in});}));
  return out; }
// One level's events in the two-slot shape. A PRE-TWO-KIND blob is a single event
// (`{row,kind,out,in}`) — it is read into its own kind's slot, so an old build loses
// nothing wherever stored state enters (applyState, loadBuilds, an imported file).
function swapNorm(v){
  if(!v||typeof v!=="object")return null;
  const one=e=>(e&&typeof e==="object"&&e.row!==undefined&&e.out&&e.in&&e.out!==e.in)
    ?{row:e.row,out:String(e.out),in:String(e.in)}:null;
  if(v.out!==undefined&&v.in!==undefined){        // the single-event shape
    const e=one(v); return e?{[v.kind==="cantrip"?"cantrip":"spell"]:e}:null;}
  const out={};
  SWAP_KINDS.forEach(k=>{const e=one(v[k]); if(e)out[k]=e;});
  return SWAP_KINDS.some(k=>out[k])?out:null;
}
// the whole map, healed: out-of-range levels and malformed events are dropped, never
// guessed at. Key order is SWAP_KINDS' own, so two normalized maps compare equal —
// which is what keeps save()'s identical-write skip honest across the migration.
function swapsNorm(m){ const out={};
  Object.entries((m&&typeof m==="object")?m:{}).forEach(([k,v])=>{
    const lvl=Math.round(+k); if(!(lvl>=1&&lvl<=20))return;
    const n=swapNorm(v); if(n)out[lvl]=n;});
  return out; }
// a class row's swap events die with the row, exactly like its `chosen` lists do
function dropRowSwaps(id){
  Object.keys(state.swaps||{}).forEach(k=>{const m=state.swaps[k];
    SWAP_KINDS.forEach(kd=>{if(m[kd]&&m[kd].row===id)delete m[kd];});
    if(!SWAP_KINDS.some(kd=>m[kd]))delete state.swaps[k];});
}

// ── slice derivation (E2 · D115(b,c,h)) ────────────────────────────────────
// Order + schedule = acquisition level. Each position of a sticky pick array (cantrips
// for every caster; spells for KNOWN casters and the wizard BOOK) is acquired at the
// first class level whose cumulative schedule admits it, mapped to a CHARACTER level
// through the full level plan. Daily-prepared lists are not sticky (D18/D115(c)) and
// pass through whole. Everything here DERIVES views — nothing may mutate state.
function charLevelMap(){          // rowId -> [char level of class level 1, 2, …] (full plan)
  const out=new Map();
  classLevelPlan().forEach((id,i)=>{const a=out.get(id)||[];a.push(i+1);out.set(id,a);});
  return out;
}
function topCharLevel(){return state.classes.reduce((a,r)=>a+(r.level||0),0)||1;}
// a row's cumulative sticky schedules, indexed [classLevel-1]; spells:null = not sticky
function rowSched(row){
  const c=CLS_BY[row.clsKey]; if(!c)return null;
  const sub=subOfRow(row);
  let caster=c.caster,prepArr=c.prepared,cantArr=c.cantrips,stat=c.static;
  if(!caster&&sub&&sub.caster){caster=sub.caster;prepArr=sub.prepared;cantArr=sub.cantrips;stat=sub.static;}
  if(!caster)return null;
  let spells=null;
  if(c.spellbook){const a=[];let t=0;for(let k=0;k<20;k++){t+=c.spellbook[k]||0;a.push(t);}spells=a;}
  else if(stat)spells=prepArr||null;
  return {cant:cantArr||null,spells,caster,book:!!c.spellbook};
}
// the CLASS-level index (0-based) at which position i of a scheduled array arrives.
// -1 means the schedule never admits it: a wizard copy, or a pick past the budget.
function acqIdx(sched,i,lvls){
  if(!sched)return -1;
  for(let l=0;l<lvls.length;l++)if((sched[l]||0)>i)return l;
  return -1;
}
// the character level at which position i is acquired; an off-schedule position
// (wizard copies, over-budget picks) arrives at the row's top, same as reverse-mode
// leftovers will (D118(g)) — nothing is hidden below its slice
function acqAt(sched,i,lvls){
  const l=acqIdx(sched,i,lvls);
  if(l>=0)return lvls[l];
  return sched?(lvls[lvls.length-1]||topCharLevel()):topCharLevel();
}
// swap events above L are un-applied newest-first on a DISPLAY COPY, so chains resolve:
// X→Y at 5 and Y→Z at 9 shows X at L4, Y at L7, Z from L9 on (E1 shape, D115(g))
function unswap(list,rowId,kind,L){
  swapEvents().filter(e=>e.lvl>L&&e.row===rowId&&e.kind===kind)
    .sort((a,b)=>b.lvl-a.lvl)
    .forEach(e=>{const i=list.indexOf(e.in);if(i>=0)list[i]=e.out;});
  return list;
}
// the view of a row's chosen lists at the preview level; the RAW object when not
// previewing, so the un-previewed path keeps its live references and costs nothing
function sliceChosen(row){
  const ch=state.chosen[row.id]||{cantrips:[],spells:[]};
  const L=PREVIEW.level; if(L==null)return ch;
  const sched=rowSched(row)||{cant:null,spells:null};
  const lvls=charLevelMap().get(row.id)||[];
  const cut=(arr,sa,kind)=>unswap((arr||[]).filter((_,i)=>acqAt(sa,i,lvls)<=L),row.id,kind,L);
  const out={cantrips:cut(ch.cantrips,sched.cant,"cantrip"),
             spells:sched.spells?cut(ch.spells,sched.spells,"spell"):(ch.spells||[]).slice()};
  // a prepared subset can only draw on the book as it exists at L
  if(ch.prep){const book=new Set(out.spells);out.prep=(ch.prep||[]).filter(k=>book.has(k));}
  return out;
}
// where a pick made STANDING AT L inserts (D115(d)): after every position acquired by L.
// The schedule is cumulative, so acquisition level is monotone in position — the slice
// boundary is a single index, and "visible" is exactly "position < sliceInsertAt".
function sliceInsertAt(row,arr,L){
  const ch=state.chosen[row.id]; if(!ch||!ch[arr])return 0;
  const sched=rowSched(row)||{cant:null,spells:null};
  const sa=arr==="cantrips"?sched.cant:sched.spells;
  if(arr==="spells"&&!sa)return ch[arr].length;   // preparer list: daily, order is free
  const lvls=charLevelMap().get(row.id)||[];
  let n=0; ch[arr].forEach((_,i)=>{if(acqAt(sa,i,lvls)<=L)n++;});
  return n;
}
// feats: origin slots are character level 1; general/epic spends fill the build's slot
// ── feat slots a FEATURE hands you (D135) ──────────────────────────────────
// 5etools models these as `featProgression` and neither extractor read it, which is why
// Lessons of the First Ones ("you gain one Origin feat of your choice") granted nothing.
// Read from FEATS, OPTIONAL FEATURES and SPECIES only — a class's own ASI / Epic Boon /
// Fighting Style schedule is `featSlotLevels()`'s to derive from the level plan, and
// reading the class copy here would hand every class its boon a second time.
const FEAT_SLOT_OF_CAT={O:"origin",G:"general",EB:"epic",
  FS:"fs","FS:P":"fs","FS:R":"fs","FS:B":"fs","FS:M":"fs"};
function grantedFeatSlots(){
  const out={origin:0,general:0,epic:0,fs:0,from:[]};
  const lv=Math.max(1,Math.min(20,charLevel()));
  const add=rec=>{ if(!rec||!rec.featSlots)return;
    (rec.featSlots||[]).forEach(p=>{ const n=(p.counts||[])[lv-1]||0; if(!n)return;
      out[FEAT_SLOT_OF_CAT[(p.cats||[])[0]]||"origin"]+=n;
      out.from.push({name:rec.name,n,slot:FEAT_SLOT_OF_CAT[(p.cats||[])[0]]||"origin"});});};
  // `state.feats` RAW, not featsAt(): the sliced reader walks featAcqLevels(), which asks
  // for the origin cap this feeds — one hop and it would recur. Nothing in the data grants
  // a feat slot FROM a feat today; when something does, that walk needs breaking first.
  (state.feats||[]).forEach(fk=>add(FEAT_BY[baseKey(fk)]));
  optFeatsAt().forEach(ok=>add(OPT_BY[baseKey(ok)]));
  const sp=RACE_BY[state.speciesKey]; if(sp)add(sp);
  return out;
}
// The origin-feat cap, in ONE place. Three surfaces derived it independently — the budget
// card, featAcqLevels()'s attribution walk and the guided chain's step list — which is
// exactly the drift that lets them disagree about how many origin feats you owe.
function originSlots(){
  const race=RACE_BY[state.speciesKey];
  return (state.classes.length?1:0)
    +(/human/i.test((race&&race.name)||"")?1:0)
    +grantedFeatSlots().origin;
}
// levels in array order, earliest available slot first (best case, D18); anything past
// the budget arrives at top — E4 flags it, nothing hides it (D31)
// fk -> {lv, cat, over}. `over` means no slot in the build could pay for it — it still
// arrives (at top) and is flagged, never dropped (D31 · the flag-don't-prune rule).
function featAcqLevels(){
  const slots=featSlotLevels(true), used=new Array(slots.length).fill(false);
  const top=topCharLevel(), out=new Map();
  const originCap=originSlots();
  let origin=0;
  state.feats.forEach(fk=>{
    const cat=featSlotOf(fk)||"origin";
    if(cat==="origin"){out.set(fk,{lv:1,cat,over:++origin>originCap});return;}
    const min=cat==="epic"?19:1;
    let lv=null;
    for(let i=0;i<slots.length;i++)if(!used[i]&&slots[i]>=min){used[i]=true;lv=slots[i];break;}
    out.set(fk,{lv:lv==null?top:lv,cat,over:lv==null});
  });
  return out;
}
function featsAt(){ if(PREVIEW.level==null)return state.feats;
  const acq=featAcqLevels();
  return state.feats.filter(fk=>((acq.get(fk)||{}).lv||1)<=PREVIEW.level); }
// optional features ride their progression's own counts (D28): position within the
// progression → first class level with room, through the plan like every other schedule
function optAcqLevels(){
  const clm=charLevelMap(), top=topCharLevel(), out=new Map(), progs=[];
  state.classes.forEach(row=>[CLS_BY[row.clsKey],subOfRow(row)].forEach(src=>{
    if(src&&src.optFeatures)src.optFeatures.forEach(p=>
      progs.push({name:p.name,types:new Set(p.types),counts:p.counts||[],lvls:clm.get(row.id)||[],n:0}));}));
  state.optFeats.forEach(ok=>{const o=OPT_BY[baseKey(ok)];
    const p=o&&progs.find(x=>(o.types||[]).some(t=>x.types.has(t)));
    if(!p){out.set(ok,{lv:top,over:true,slot:null});return;}
    const i=p.n++; let lv=null;
    for(let l=0;l<p.lvls.length;l++)if((p.counts[l]||0)>i){lv=p.lvls[l];break;}
    out.set(ok,{lv:lv==null?top:lv,over:lv==null,slot:p.name});});
  return out;
}
function optFeatsAt(){ if(PREVIEW.level==null)return state.optFeats;
  const acq=optAcqLevels();
  return state.optFeats.filter(ok=>((acq.get(ok)||{}).lv||1)<=PREVIEW.level); }

// ── "order matters" (E7 · D115) ────────────────────────────────────────────
// A quiet word, not a warning: the level ORDER is load-bearing in this build — reasons,
// or null. Single-class builds have exactly one order, so they never hear it.
function orderMatters(){
  if(state.classes.length<2)return null;
  const total=topCharLevel(), reasons=[];
  // a feat slot whose character level can land either side of 19 depending on the
  // order — an Epic Boon rides on which side (D114)
  let straddle=false;
  state.classes.forEach(r=>{const c=CLS_BY[r.clsKey]; if(!c)return;
    ASI_LEVELS.concat(ASI_EXTRA[c.name]||[]).concat([19])
      .filter(cl=>cl<=(r.level||0))
      .forEach(cl=>{ if(cl<19 && total-((r.level||0)-cl)>=19)straddle=true; });});
  if(straddle)reasons.push("a feat slot can land either side of level 19, and an Epic Boon rides on which");
  if(state.classes.some(r=>rowSched(r)))
    reasons.push("when each class's levels land decides when its picks arrive and what they could be");
  return reasons.length?reasons:null;
}

// ── consistency sweep (E4 · D115(f)) ───────────────────────────────────────
// Every level slice is checked, ALWAYS build-wide: standing at 12 must still tell you
// that level 5 doesn't add up, which is the whole point of the badge. So nothing here
// reads PREVIEW. Soft throughout (D31) — findings are named and located, never fixed,
// never blocking, and nothing is ever removed from the build.
function buildHealth(){
  const out=[], top=topCharLevel(), clm=charLevelMap();
  const add=(level,kind,text)=>out.push({level:Math.max(1,Math.min(20,level||top)),kind,text});
  const spName=k=>{const sp=SPELL_BY[k];return sp?sp.name:String(k).split("|")[0];};
  // a swapped-IN pick was acquired at the swap, not at its position's schedule slot (D115(g))
  const swIn=new Map();
  swapEvents().forEach(e=>{
    const m=swIn.get(e.row)||new Map(); m.set(e.in,e.lvl); swIn.set(e.row,m);});

  state.classes.forEach(row=>{
    const c=CLS_BY[row.clsKey]; if(!c)return;
    const lvls=clm.get(row.id)||[], rowTop=lvls[lvls.length-1]||top;
    // a subclass that is due and not chosen is a real hole, and it has a level
    const subL=c.subclassLevel||3;
    if(!row.subKey&&(row.level||0)>=subL&&lvls[subL-1])
      add(lvls[subL-1],"subclass",`${c.name} chooses a subclass at class level ${subL}, and none is set.`);
    const sched=rowSched(row); if(!sched)return;      // non-caster: nothing sticky to check
    const ch=state.chosen[row.id]||{}, sw=swIn.get(row.id)||new Map();
    // cantrips are never "copied" — past the schedule is past the budget
    (ch.cantrips||[]).forEach((k,i)=>{ if(acqIdx(sched.cant,i,lvls)>=0)return;
      add(rowTop,"over",`${spName(k)} is one cantrip more than ${c.name} ${row.level} grants.`);});
    // a preparer's list is chosen fresh each day (D18/D115(c)) — not sticky, not swept here
    if(!sched.spells)return;
    (ch.spells||[]).forEach((k,i)=>{
      const sp=SPELL_BY[k]; if(!sp)return;
      const l=acqIdx(sched.spells,i,lvls);
      if(l<0){
        // the wizard's own legal move: copying into the spellbook beyond the free
        // allowance. Not an error, and never was (the level-budget gotcha).
        if(!sched.book)
          add(rowTop,"over",`${sp.name} is one spell more than ${c.name} ${row.level} learns.`);
        return;}
      // where it really arrived, and the class level it arrived at
      const at=sw.has(k)?sw.get(k):lvls[l];
      const cl=sw.has(k)?lvls.filter(x=>x<=at).length:l+1;
      const canCast=maxLvlAt(sched.caster,Math.max(1,cl));
      if(sp.level>canCast)
        add(at,"spelllevel",`${sp.name} is level ${sp.level}, but ${c.name} ${cl}`
          +` — which is where it arrives — casts at most level ${canCast||1}.`);
    });
  });

  const fa=featAcqLevels();
  state.feats.forEach(fk=>{const f=FEAT_BY[baseKey(fk)], a=fa.get(fk); if(!f||!a||!a.over)return;
    add(a.lv,"feat", a.cat==="epic"
      ? `${f.name} is an epic boon, and no feat slot in this build arrives at character level 19 or later.`
      : a.cat==="origin"
        ? `${f.name} is an origin feat, and this build has no origin slot left for it.`
        : `${f.name} has no feat slot in this build to be taken with.`);});
  const oa=optAcqLevels();
  state.optFeats.forEach(ok=>{const o=OPT_BY[baseKey(ok)], a=oa.get(ok); if(!o||!a||!a.over)return;
    add(a.lv,"opt", a.slot
      ? `${o.name} is one ${lc(a.slot)} more than this build grants.`
      : `${o.name} has no feature in this build that grants it.`);});

  out.sort((a,b)=>a.level-b.level);
  const levels=[...new Set(out.map(f=>f.level))];
  const byLevel=new Map(); levels.forEach(l=>byLevel.set(l,out.filter(f=>f.level===l)));
  return {findings:out,levels,byLevel};
}

// ── guided builder: step derivation (F1 · D118, regrouped by D130(c)) ──────
// ONE STEP PER FEATURE/SOURCE, each holding one SECTION per logical group. D130(c)
// partially reverses D118(c)'s one-step-per-decision — Francesco's own earlier call,
// reversed by using it: a class level's spellcasting is ONE step with a Cantrips section
// and a Spells section; Magic Initiate is ONE step holding its list, its ability, its
// cantrip group and its 1st-level spell group, each its own section because each is a
// different question. Slot-level addressing did not disappear: it moved INSIDE the pick
// modal, which is where the reverse/reconstruct walk (D118(f,g)) needs it.
// Everything else about the model stands. The list is still derived STATELESSLY from the
// build (D118(j)) and grouped by character level; DIRECTION is still only an iteration
// order over it (D118(f)), never a second engine. Statuses now live on BOTH levels:
//   · a SECTION is `done` when it is SATISFIED — a partly-filled group never reads done;
//   · a STEP is `done` when every REQUIRED section of it is. Optional sections (an option
//     group, the casting-ability question, a swap y/n) never block it — the same treatment
//     D121 gave the swap step, so a step whose only holes are optional is still answered.
//   · a step is `optional` only when NO section of it is required.
// The frontier is unchanged (D121): the highest level carrying a done NON-class step, so a
// hand-levelled build with no picks reads all-open rather than all-skipped, and a forward
// walk leaves open slots ahead of it and skipped ones behind — with no stored session bit.
// Preparer spell lists yield NO sections (daily, D18/D115(c)); a wizard's spell sections
// are the free 2-per-level allowance — copying more in is legal and not a slot.
//
// KEYS (`guideKey`) — identity that survives re-derivation:
//   step:    class~<lv> · subclass~<row> · species~1 · feat~<slotPos> · cast~<row>~<lv> ·
//            optfeat~<row>~<prog>~<lv>~<pos> · swap~<lv>~<kind> · choice~<ownerTok>~<lv>
//   section: <stepKey>#<sectionId>, where a PICK section's id names its kind and the array
//            POSITION RANGE it owns (`cantrip@0-2`) — stable under acquisition moves,
//            exactly as the old per-slot keys were — a choice section's id is its grants
//            path id (`choice@<cid>`, stable by design), and a step's own answer is `self`.
function gsec(o){ return Object.assign({kind:"self",optional:false,need:1,have:0,done:false,
  value:null,keys:null,label:""},o); }
// a class row's pick group for ONE character level: the array positions [from,to) that
// level opens, and what sits in them right now
function gpickSec(pick,row,from,to,arr,castMax,label){
  const need=to-from, have=Math.max(0,Math.min((arr||[]).length-from,need));
  const keys=(arr||[]).slice(from,Math.min(to,(arr||[]).length));
  return gsec({id:pick+"@"+from+"-"+to,kind:"pick",pick,row,from,to,castMax,label,need,have,
    done:have>=need,keys,
    value:keys.map(k=>(SPELL_BY[k]||{}).name||String(k).split("|")[0]).join(", ")||null});
}
// a choice the build carries (D126(g)), as a section of its GIVER's step
function gchoiceSec(c){
  const isPick=c.type==="pick", a=isPick?(state.choices[c.id]||[]):null;
  return gsec({id:"choice@"+c.id,kind:isPick?"cpick":"choice",choice:c,cid:c.id,
    label:guideChoiceLabel(c),giver:c.giver,
    // an option group and the casting-ability question always HOLD a value (the default
    // stands until you say otherwise), so leaving one is an answer, not a hole
    optional:!isPick||!!c.optional,
    need:isPick?c.count:1,have:isPick?a.length:(state.choices[c.id]!=null?1:0),
    done:isPick?a.length>=c.count:state.choices[c.id]!=null,keys:isPick?a.slice():null,
    // a defaulted option reports what the CONTROL is showing, not a blank: the select
    // really does read "Wisdom", and Next is what stores it (D130(g))
    value:guideChoiceValue(c)||(!isPick&&c.value!=null
      ?(c.type==="ability"?(ABIL[c.value]||String(c.value)):String(c.value)):null)});
}
function guideSteps(){
  const steps=[], plan=classLevelPlan(), top=plan.length;
  const clm=charLevelMap(), rowOf=new Map(state.classes.map(r=>[r.id,r]));
  const add=s=>{s.sections=s.sections||[];steps.push(s);return s;};
  // a choice merges into the step of the FEATURE that granted it, when the two land at the
  // same character level; `hostBy` is keyed by the grants owner token + that level
  const hostBy=new Map();
  // L1 group: species + the origin feat slot(s) — everything the app models (D118(d))
  const race=RACE_BY[state.speciesKey];
  hostBy.set("r@1",add({key:"species~1",lv:1,ord:2,kind:"species",
    label:"Species",multiLabel:race?race.name:"Species",
    sections:[gsec({id:"self",kind:"species",label:"Species",done:!!race,
      value:race?race.name:null})]}));
  const originCap=originSlots();
  // an unrecorded spend defaults to origin, exactly as featAcqLevels() reads it
  const originSpent=state.feats.filter(fk=>(featSlotOf(fk)||"origin")==="origin");
  for(let i=0;i<originCap;i++){const fk=originSpent[i], f=fk?FEAT_BY[baseKey(fk)]:null;
    const st=add({key:"feat~"+i,lv:1,ord:3,kind:"feat",slot:"origin",pos:i,sub:"Origin feat",
      label:"Origin feat",multiLabel:f?f.name:"Origin feat",
      sections:[gsec({id:"self",kind:"feat",label:"Origin feat",slot:"origin",pos:i,
        done:!!fk,value:f?f.name:null})]});
    if(fk)hostBy.set("f"+fk+"@1",st);}
  // one class step per character level — the wizard's "continue or multiclass" answer
  // (D118(e)); every level the plan holds is a decision already made
  const perClass=new Map();
  plan.forEach((id,i0)=>{const lv=i0+1, row=rowOf.get(id), c=row&&CLS_BY[row.clsKey];
    const cl=(perClass.get(id)||0)+1; perClass.set(id,cl);
    add({key:"class~"+lv,lv,ord:0,kind:"class",row:id,cl,label:"Class",
      sections:[gsec({id:"self",kind:"class",label:"Class",done:true,
        value:c?c.name+" "+cl:"?",continueOf:id})]});
    // subclass, where this class level makes it due
    if(c&&cl===(c.subclassLevel||3)){const sub=subOfRow(row);
      const nm=sub?(sub.shortName||sub.name):null;
      hostBy.set("s"+id+"@"+lv,add({key:"subclass~"+id,lv,ord:1,kind:"subclass",row:id,
        label:c.name+" subclass",multiLabel:nm||(c.name+" subclass"),
        sections:[gsec({id:"self",kind:"subclass",label:c.name+" subclass",row:id,
          done:!!row.subKey,value:nm})]}));}
    // the pick slots this class level opens (E2's schedules; dense arrays fill in order),
    // as ONE spellcasting step with a section per kind (D130(c))
    const sched=rowSched(row); if(!sched)return;
    const ch=state.chosen[id]||{cantrips:[],spells:[]};
    const cum=(a,n)=>a&&n>0?(a[n-1]||0):0;
    const secs=[];
    const cf=cum(sched.cant,cl-1), ct=cum(sched.cant,cl);
    if(ct>cf)secs.push(gpickSec("cantrip",id,cf,ct,ch.cantrips||[],0,
      ct-cf>1?"Cantrips":"Cantrip"));
    const sf=cum(sched.spells,cl-1), stp=cum(sched.spells,cl);
    if(sched.spells&&stp>sf)secs.push(gpickSec("spell",id,sf,stp,ch.spells||[],
      Math.max(1,maxLvlAt(sched.caster,cl)),
      sched.book?(stp-sf>1?"Spellbook spells":"Spellbook spell"):(stp-sf>1?"Spells":"Spell")));
    if(secs.length)add({key:"cast~"+id+"~"+lv,lv,ord:4,kind:"cast",row:id,cl,
      label:secs[0].label,multiLabel:"Spellcasting",sections:secs});
    // the level-up swap questions (D115(g)/D119(b)): the class taking this level may
    // trade one earlier LEVELED spell and one earlier CANTRIP, each only where its own
    // rules grant it (SWAP_RULES) — two independent decisions, answered or passed
    if(cl>=2){const rule=swapRule(row), ask=[];
      if(rule.spell&&sched.spells&&!sched.book&&(ch.spells||[]).length)ask.push(["spell",7,"Swap a spell"]);
      if(rule.cantrip==="levelup"&&sched.cant&&(ch.cantrips||[]).length)ask.push(["cantrip",8,"Swap a cantrip"]);
      ask.forEach(([swkind,ord,label])=>{const ev=swapAt(lv,swkind);
        add({key:"swap~"+lv+"~"+swkind,lv,ord,kind:"swap",swkind,row:id,label,
          sections:[gsec({id:"self",kind:"swap",label,swkind,row:id,optional:true,done:!!ev,
            value:ev?("− "+String(ev.out).split("|")[0]+" + "+String(ev.in).split("|")[0]):null})]});});}
  });
  // general/epic feat slots at the character levels the plan puts them (D114); spends
  // attribute in array order, earliest slot first — same walk featAcqLevels() does
  const slots=featSlotLevels(true), used=new Array(slots.length).fill(false);
  const spent=state.feats.filter(fk=>(featSlotOf(fk)||"origin")!=="origin");
  const slotOf=new Array(slots.length).fill(null);
  spent.forEach(fk=>{const min=featSlotOf(fk)==="epic"?19:1;
    for(let i=0;i<slots.length;i++)if(!used[i]&&slots[i]>=min){used[i]=true;slotOf[i]=fk;break;}});
  slots.forEach((lv,i)=>{const fk=slotOf[i], f=fk?FEAT_BY[baseKey(fk)]:null;
    const lab=lv>=19?"Feat / ASI / Epic Boon":"Feat / ASI";
    const st=add({key:"feat~"+(originCap+i),lv,ord:6,kind:"feat",slot:lv>=19?"epic":"general",
      pos:originCap+i,sub:lab,label:lab,multiLabel:f?f.name:lab,
      sections:[gsec({id:"self",kind:"feat",label:lab,slot:lv>=19?"epic":"general",
        pos:originCap+i,done:!!fk,value:f?f.name:null})]});
    if(fk)hostBy.set("f"+fk+"@"+lv,st);});
  // optional-feature slots ride their progression's counts (D28), like optAcqLevels()
  const oa=optAcqLevels(), byProg=new Map();
  state.optFeats.forEach(ok=>{const a=oa.get(ok); if(!a||a.over)return;
    const key2=a.slot+"|"+a.lv, l=byProg.get(key2)||[]; l.push(ok); byProg.set(key2,l);});
  state.classes.forEach(row=>[CLS_BY[row.clsKey],subOfRow(row)].forEach(src=>{
    if(!src||!src.optFeatures)return;
    const lvls=clm.get(row.id)||[];
    src.optFeatures.forEach(p=>{for(let cl=1;cl<=lvls.length;cl++){
      const d=(p.counts[cl-1]||0)-(cl>1?(p.counts[cl-2]||0):0);
      const got=byProg.get(p.name+"|"+lvls[cl-1])||[];
      for(let k=0;k<d;k++){const ok=got[k], o=ok?OPT_BY[baseKey(ok)]:null, lv=lvls[cl-1];
        // the progression and the class level ride along so the section can open the app's
        // OWN optional-feature picker for this slot (D126(g)) — the same descriptor
        // `openGainChooser` builds for the timeline's quick-choose, never a second picker
        const pool={kind:"optfeat",types:[...p.types||[]],prog:p,cl,giver:src.name,giverSrc:src.source};
        const st=add({key:"optfeat~"+row.id+"~"+p.name+"~"+lv+"~"+k,lv,ord:6,kind:"optfeat",
          row:row.id,pos:k,sub:p.name,label:p.name,multiLabel:o?o.name:p.name,pool,
          sections:[gsec({id:"self",kind:"optfeat",label:p.name,pool,done:!!ok,
            value:o?o.name:null})]});
        if(ok)hostBy.set("o"+ok+"@"+lv,st);}}});}));
  // D126(g) · D130(c): every choice the build carries is a SECTION of the step for the
  // feature that granted it — Magic Initiate's list, its ability, its cantrips and its
  // 1st-level spell all hang off the one Magic Initiate step, separate groups inside it.
  // A choice whose giver has no step at that level (a class feature's option group) keeps
  // a step of its own, grouped by owner so one feature is still one card.
  const featAcq=featAcqLevels(), optAcq=optAcqLevels(), grpOf=new Map();
  guideChoices().forEach(c=>{
    const at=guideChoiceAt(c,featAcq,optAcq,clm), lv=Math.max(1,at.lv);
    const tok=(c.owner&&c.owner.id)||String(c.id).split(":")[0];
    const sec=gchoiceSec(c), host=hostBy.get(tok+"@"+lv);
    if(host){host.sections.push(sec);return;}
    const gk="choice~"+tok+"~"+lv;
    let st=grpOf.get(gk);
    if(!st){const nm=(c.owner&&c.owner.name)||c.giver||"Choices";
      st=add({key:gk,lv,ord:at.ord,kind:"choice",row:at.row,giver:c.giver,label:nm,
        sub:c.giver&&c.giver!==nm?c.giver:null,sections:[]});
      grpOf.set(gk,st);}
    st.sections.push(sec);});
  // the growth affordance: the next class level is itself the next decision
  if(top<20)add({key:"class~"+(top+1),lv:top+1,ord:0,kind:"class",row:null,
    label:top?"Next level":"Class",
    sections:[gsec({id:"self",kind:"class",label:top?"Next level":"Class",done:false,
      value:null,continueOf:top?plan[top-1]:null})]});
  // sections read in one order everywhere: the step's own answer, then the questions that
  // arrive with a default showing, then the groups you have to pick into
  const band=x=>x.kind==="choice"?1:(x.kind==="pick"||x.kind==="cpick")?2:0;
  steps.forEach(s=>{
    s.sections.sort((a,b)=>band(a)-band(b));
    if(s.sections.length>1&&s.multiLabel)s.label=s.multiLabel;
    // an option group's label is its giver's last segment ("Pact Boon"), which says
    // nothing once the CARD is already named after that giver — Magic Initiate's list
    // question would read "Magic Initiate". Say what it is instead.
    s.sections.forEach(x=>{if(x.kind==="choice"&&x.choice&&x.choice.type==="option"
      &&(x.label===s.label||x.label===s.multiLabel))x.label="Choose one";});
    const req=s.sections.filter(x=>!x.optional);
    s.optional=!req.length;
    s.done=req.length?req.every(x=>x.done):s.sections.every(x=>x.done);});
  steps.sort((a,b)=>a.lv-b.lv||a.ord-b.ord||(a.pos||0)-(b.pos||0));
  const frontier=steps.reduce((m,s)=>s.done&&s.kind!=="class"?Math.max(m,s.lv):m,0);
  steps.forEach(s=>{
    s.status=s.done?"done":(s.lv<frontier?"skipped":"open");
    s.sections.forEach(x=>{x.lv=s.lv; x.step=s.key;
      x.status=x.done?"done":(s.lv<frontier?"skipped":"open");
      x.illAt=guideSecIll(x); x.ill=x.illAt.size>0;});});
  return steps;
}
// where a walk resumes (D118(j)): the first not-done step in the walk's own order —
// ascending for forward, descending for reverse (D118(f)). OPTIONAL steps (a swap y/n,
// a step whose only questions carry defaults) never capture it: passing on one is a
// legitimate answer the build can't store, so it would trap re-entry forever.
function guideResume(steps,desc){
  const list=desc?[...steps].reverse():steps;
  return list.find(s=>s.status!=="done"&&!s.optional)||null;
}
// ── the build's pending choices, as sections (D126(g)) ─────────────────────
// The Choices card and the guide read ONE list. `R.choices` already is the whole build's
// when nothing is previewed, so the common path costs nothing; under a preview the guide
// re-resolves at full level rather than let the chain shrink to the slice it happens to
// be looking at (a step that vanishes when you glance back is not a chain).
function guideChoices(){
  if(PREVIEW.level==null&&R&&R.choices)return R.choices;
  const records=state.classes.map(r=>resolveRow(r)).filter(Boolean);
  const casters=records.filter(r=>r.caster);
  const abils=[...new Set(casters.map(r=>r.ability).filter(Boolean))];
  return collectGrants(records,casters,state.classes.reduce((a,r)=>a+(r.level||0),0),
    state.feats,state.optFeats,abils.length===1?abils[0]:null).gout.choices;
}
// where a choice belongs in the chain: at the level its GIVER arrived. The owner token
// names the kind of giver (`ownerOf` splits it off the path id) and every kind already has
// an acquisition mapper — a feat's slot level, an optional feature's progression level, a
// class row's own plan. Nothing is stamped; this derives, like every other step (D118(j)).
function guideChoiceAt(c,featAcq,optAcq,clm){
  const oid=(c.owner&&c.owner.id)||String(c.id).split(":")[0], k=oid.slice(1);
  if(oid==="r")return {lv:1,ord:2.5,row:null};                       // species
  if(oid[0]==="f"){const a=featAcq.get(k)||{};
    return {lv:a.lv||1,ord:a.cat==="origin"?3.5:6.5,row:null};}
  if(oid[0]==="o"){const a=optAcq.get(k)||{}; return {lv:a.lv||1,ord:6.5,row:null};}
  if(oid[0]==="c"||oid[0]==="s"){
    const rid=Number(k), row=state.classes.find(r=>r.id===rid), lvls=clm.get(rid)||[];
    let cl=c.atLevel||0;
    // a subclass grant with no level of its own opens where the subclass itself does
    if(!cl&&oid[0]==="s"){const cc=row&&CLS_BY[row.clsKey]; cl=(cc&&cc.subclassLevel)||3;}
    cl=Math.max(1,Math.min(cl||1,lvls.length||1));
    return {lv:lvls[cl-1]||lvls[lvls.length-1]||1,ord:1.5,row:rid};}
  return {lv:1,ord:9,row:null};          // a custom source carries no level (D55)
}
// A pick choice's ask, composed from the FILTER the choice actually carries (G3) — the
// extractor's `desc` is a filter read aloud ("choose level 1, Cleric list") and reads as
// machinery. The parts are all we may say: the levels, the schools, the classes. Anything
// the parts can't express honestly — a level set with a hole in it, no filter at all —
// returns null and the raw desc stands. Nothing is invented to make a sentence.
function guidePickAsk(c){
  const f=c&&c.filter; if(!f)return null;
  // keys are 5etools' own and their case is not stable ("Components & Miscellaneous")
  const F={}; Object.keys(f).forEach(k=>{F[k.toLowerCase()]=f[k];});
  const nums=F.level!=null?String(F.level).split(";").map(Number).filter(n=>!isNaN(n)).sort((a,b)=>a-b):[];
  if(F.level!=null&&!nums.length)return null;
  // a set with a gap in it can't be said in a phrase — the raw desc keeps it honest
  if(nums.length>1&&nums[nums.length-1]-nums[0]!==nums.length-1)return null;
  const clss=F.class?String(F.class).split(";").map(s=>s.trim()).filter(Boolean)
    .map(s=>cap1(s)).join("/"):"";
  const schs=F.school?String(F.school).split(";").map(s=>SCHOOL_ABBR[s.trim().toUpperCase()]||s.trim())
    .filter(Boolean).join("/"):"";
  // 5etools filters on more than level/class/school. RITUAL is the one extra this may say
  // in a word, and it is the one that matters (Ritual Caster is the feat that produced
  // "choose level 1, Cleric list"). Anything else — a `spell attack` code set, say — would
  // be a guess at what the filter means, so the raw desc stands.
  const rit=String(F["components & miscellaneous"]||"").trim().toLowerCase()==="ritual";
  if(Object.keys(F).some(k=>k!=="level"&&k!=="class"&&k!=="school"
      &&!(k==="components & miscellaneous"&&rit)))return null;
  const cantripOnly=nums.length===1&&nums[0]===0;
  if(!clss&&!schs&&!nums.length&&!rit)return null;        // "a spell" — nothing to compose
  const n=c.count>1?c.count:1;
  const noun=cantripOnly?(n>1?"cantrips":"cantrip"):(n>1?"spells":"spell");
  const qual=[schs,clss,rit?"ritual":""].filter(Boolean).join(" ");
  let lead="";
  if(!cantripOnly&&nums.length===1)lead="level-"+nums[0]+" ";
  const head=n>1?n+" ":(/^[aeiou]/i.test(lead||qual||noun)?"an ":"a ");
  let tail="";
  if(!cantripOnly&&nums.length>1)tail=nums[0]===0?" up to level "+nums[nums.length-1]
    :" at level "+nums[0]+"–"+nums[nums.length-1];
  return head+lead+(qual?qual+" ":"")+noun+tail;
}
// the ask, short enough for a chain row; the giver is the card's sub-line, never repeated
const guideChoiceLabel=c=>c.type==="ability"?"Casting ability"
  :c.type==="option"?(String(c.giver||"Option").split(" · ").pop()||"Option")
  :cap1(guidePickAsk(c)||fmtDesc(c.desc)||("choose "+(c.count>1?c.count+" spells":"a spell")));
function guideChoiceValue(c){
  if(c.type!=="pick"){const v=state.choices[c.id];
    return v==null?null:(c.type==="ability"?(ABIL[v]||String(v)):String(v));}
  const a=state.choices[c.id]||[];
  return a.length?a.map(k=>(SPELL_BY[k]||{}).name||String(k).split("|")[0]).join(", "):null;
}
// ── the guided builder PAGE (G1 · D126(a,b,c) · D130) ──────────────────────
// The guide is its own full-size view: a header (which build, which level, how far along,
// the switch back to the character view, the exit), a CHAIN COLUMN — a lean variant of the
// timeline: level rows with per-class rails, run dividers, flags, and the SAME
// drag-to-reorder the timeline modal uses (D126(b)) — and the DECISION STAGE beside it.
// Phone widths show one of the two at a time, one tap apart (D126(c)).
// Since D130(a) the chain COLLAPSES: one line per level carrying the level, the class and
// ONE icon naming the worst thing in it; only the current level is open, and clicking any
// header opens that one instead. Which level is open is per-session module state — like
// every fold in this app, it is a view of the build and never part of it.
// The page is ephemeral UI over the stateless derivation above — nothing here is stored
// (D118(j)), which is exactly why "Character view" can leave and come back for free.
// `cur` is a STEP key so it survives every re-render. It moves ONLY on Next, Skip or a
// chain click (D126(e), superseding F2's auto-advance): answering a step turns its card
// green and lights Next, it does not jump you somewhere else mid-thought.
// `aside` is the CHARACTER DRAWER (H4 · D130(e)): "Character view" slides the page out
// instead of hiding it — the walk keeps its step, the character view underneath is the
// whole app, and a pinned bar over it (`#gBack`) names the step you left and can end the
// walk from there. It replaces G1's `away` + vanishing Guide tab, which read as an exit
// and lost the way back often enough that Francesco reported it as not working.
// `reverse`+`desc` are D118(f)'s second walk, the one the rail calls **Down** (D131(e)
// retired the old name and the word with it): the candidate pool narrows to the build's
// own picks and answering a slot PLACES a pick at that slot's array position — a
// stateless gesture (the position IS the answer), so leftovers drift to the top slice
// and take E4 flags exactly as D118(g) requires. `place` remembers which slot of a
// section the next placement fills; it is module state and resets with the walk.
let GUIDE={on:false,aside:false,desc:false,reverse:false,cur:null,pane:"stage",place:{}};
const guideKey=s=>(s&&s.key)||"";
const guideSecKey=sec=>sec.step+"#"+sec.id;
function openGuide(desc,reverse){ GUIDE.on=true; GUIDE.aside=false; GUIDE.pane="stage";
  GUIDE.desc=!!desc; GUIDE.reverse=!!reverse;
  GUIDE.cur=null; GUIDE.place={}; GC.open=null; closeGpick(); render(); }
function closeGuide(){ if(!GUIDE.on)return; GUIDE.on=false; GUIDE.aside=false;
  GUIDE.reverse=false; GUIDE.cur=null; GUIDE.place={}; GC.open=null; closeGpick(); render(); }
// the shared entry for an EXISTING build (F3 · D118(i)): EVERY entry goes straight into
// the walk, at the step D118(j)'s stateless resume computes — the "which walk?" screen a
// ready build used to hit is gone (an entry is not a decision). The DOWN walk is still
// one click away, from the chain column's own arrow, so D118(f)'s two walks both stand.
// A walk already in progress is RESUMED where it stood — the entries double as the way
// back from the character view.
// has this build answered anything the guide would ask about? Species, a feat, an optional
// feature or a pick — `guideCanWalkDown` reads it to decide whether the DOWN walk has
// anything to place, and D126(i)'s CTA reads it (with the class rows) to decide whether
// the build is empty at all.
function guideAnswered(){
  return !!(state.speciesKey||state.feats.length||state.optFeats.length
    ||Object.values(state.chosen||{}).some(ch=>((ch&&ch.cantrips||[]).length+(ch&&ch.spells||[]).length)>0));
}
const guideEmpty=()=>!state.classes.length&&!guideAnswered();
function guideEntry(){
  if(GUIDE.on){GUIDE.aside=false;render();return;}
  openGuide(false,false);
}
// which positions of a pick section hold a spell the class could not cast where the slot
// arrives — the chain marks them and the reverse walk resumes at the first one.
// A pick traded IN sits at the OUTGOING pick's position (E3 · D119(b)), so the raw array's
// occupant is not what this slot held when it arrived — a legal L3 trade into a 2nd-level
// spell would read red at the L1 slot that lent it its place. Un-apply the trades above
// this level first, exactly as `sliceChosen` does (the copy is deliberate: `unswap` writes
// into the list it is handed). Found by the G3 build the moment the guide could record a
// trade of its own; the E4 sweep always read it correctly, and a chain disagreeing with
// the sweep is the flag lying, not the sweep.
function guideSecIll(sec){
  const out=new Set();
  if(sec.kind!=="pick"||sec.pick!=="spell"||!sec.castMax||!sec.have)return out;
  const ch=state.chosen[sec.row]||{};
  const arr=unswap([...(ch.spells||[])],sec.row,"spell",sec.lv);
  for(let p=sec.from;p<Math.min(sec.to,arr.length);p++){
    const sp=SPELL_BY[arr[p]]; if(sp&&sp.level>sec.castMax)out.add(p);}
  return out;
}
// which slot of a section the next reverse placement fills. Module state, defaulting to
// the section's first position; the modal's slot chips move it and a placement advances it.
const guideTarget=sec=>{const t=GUIDE.place[guideSecKey(sec)];
  return t==null?sec.from:Math.max(sec.from,Math.min(t,sec.to-1));};
// reverse mode's answer (D118(f,g)): put the clicked pick AT the section's target slot —
// the previous occupant shifts one later and stays in the pool for a later slot; whatever
// is never placed ends up in the top slice, flagged, never deleted.
function guidePlace(sec,k,at){
  const arr=sec.pick==="cantrip"?"cantrips":"spells";
  const ch=state.chosen[sec.row]; if(!ch||!ch[arr])return;
  const i=ch[arr].indexOf(k); if(i<0)return;
  const pos=at==null?guideTarget(sec):at;
  if(pos>=ch[arr].length)return;      // no slot to place into — never a delete (D118(g))
  if(i!==pos){ch[arr].splice(i,1);ch[arr].splice(pos,0,k);}
  GUIDE.place[guideSecKey(sec)]=Math.min(pos+1,sec.to-1);
  save(); render();
}
// PLACEMENT IS A PROPERTY OF THE CALL SITE, NEVER OF THE WALK (G4 · F1/F2/F4).
// `guidePlace` has exactly one caller — `gpickCommit` in place mode, i.e. the guide's own
// pick modal opened on a pick section of a Down walk. `toggle` used to intercept on the
// AMBIENT `GUIDE.reverse` flag instead, so every other surface that shares the app's one
// take/drop writer was hijacked by a walk it knew nothing about: the prepare-daily modal's
// unprepare (`arr==="prep"`, which the intercept's arr→kind map read as "spell") silently
// REORDERED the wizard's spellbook — the order IS the level assignment, so that was data
// corruption with a dead control in front of it; the character view's ✓ reordered instead
// of toggling with the guide off-canvas and nothing on screen saying so; and the chip ✕,
// whose tip promises "takes it back out of this group", reordered instead of dropping.
// The rule now: the shared `toggle` behaves the same inside a walk as outside it.
// jump the walk to a step: point the view at its level (slice editing, D115(d)), remember
// it as current, and let the chain fall back to opening the CURRENT level (D130(a)).
function guideGo(s){
  GUIDE.cur=guideKey(s); GC.open=null;
  const top=topCharLevel();
  setPreview(s.lv>=top?null:s.lv);      // renders; the chain re-draws with cur set
}
function guideWalk(steps){ return GUIDE.desc?[...steps].reverse():steps; }
function guideStepAfter(steps,key,pred){
  const list=guideWalk(steps);
  const i=list.findIndex(x=>guideKey(x)===key);
  for(let k=i+1;k<list.length;k++)if(!pred||pred(list[k]))return list[k];
  return null;
}
// resolve cur BEFORE the page renders. It only ever RESOLVES — it picks a step when there
// is none, and it clamps a forward pick step to the slot the take will really fill (D125).
// It never advances off an answered step: since D126(e) the walk moves on Next, Skip or a
// chain click, and nothing else.
function guideSync(){
  if(!GUIDE.on)return;
  const steps=R.gsteps;
  let cur=GUIDE.cur&&steps.find(x=>x.key===GUIDE.cur)||null;
  if(!cur){
    // reverse re-entry: the first slot whose occupant is illegal where it sits — the
    // exact place reconstruction is needed — else the walk's first step (D118(j))
    if(GUIDE.reverse){const list=guideWalk(steps);
      cur=list.find(s=>s.sections.some(x=>x.ill))
        ||guideDownPlaceable(list)||list[0]||null;}
    else cur=guideResume(steps,GUIDE.desc);
    GUIDE.cur=cur?cur.key:null;
  }
  // a forward take always lands in the row's FIRST open slot — the pick arrays are dense
  // (D115(b,h)), so a section whose range starts past what the row holds cannot be
  // answered where it shows (the take would fall short and the cap would lie, D125). The
  // walk clamps to the STEP that owns the landing slot, so the rail highlights the step
  // the note describes; reverse placement is positional and needs no clamp.
  if(!GUIDE.reverse&&GUIDE.cur){
    const c=steps.find(x=>x.key===GUIDE.cur); let best=null;
    (c?c.sections:[]).forEach(sec=>{
      if(sec.kind!=="pick"||sec.done)return;
      const filled=(((state.chosen[sec.row]||{})[sec.pick==="cantrip"?"cantrips":"spells"])||[]).length;
      if(sec.from<=filled)return;
      const t=steps.find(x=>x.sections.some(y=>y.kind==="pick"&&y.pick===sec.pick
        &&y.row===sec.row&&y.from<=filled&&filled<y.to));
      if(t&&t!==c&&(!best||t.lv<best.lv))best=t;});
    if(best)GUIDE.cur=best.key;
  }
}
// the page: header, then chain + stage. `aside` keeps the walk alive while the character
// view is on screen — the page is still mounted and still holds this step, so the bar,
// the ⋯ entry and the timeline footer all come back to exactly where you left.
// A slid-away page is not redrawn: its contents are stale only for as long as nobody can
// read them, and they rebuild on the way back in (this runs on every render).
function renderGuide(){
  const v=$("#guideView"); if(!v)return;
  const aside=GUIDE.on&&GUIDE.aside;
  document.body.classList.toggle("guiding",GUIDE.on&&!aside);
  document.body.classList.toggle("gaside",aside);
  v.classList.toggle("hidden",!GUIDE.on);
  v.classList.toggle("gvaside",aside);
  v.inert=aside;                    // slid away is out of REACH, not just out of sight
  if(!GUIDE.on){renderGuideBack(null,null);return;}
  const steps=(R&&R.gsteps&&R.gsteps.length)?R.gsteps:guideSteps();
  const cur=(GUIDE.cur&&steps.find(x=>x.key===GUIDE.cur))||null;
  renderGuideBack(steps,cur);
  if(aside)return;
  renderGuideHead(steps);
  v.classList.toggle("gvchain",GUIDE.pane==="chain");
  renderGuideChain(steps,cur);
  renderGuideStage(steps,cur,new Map(state.classes.map(r=>[r.id,r])));
}
// the drawer's other half (H4 · D130(e)): the pinned bar the character view carries while
// a walk is set aside. It says which step the guide is holding — "Step 12 of 23 ·
// Cantrips" — because a walk you cannot see has to name itself to be worth returning to,
// and it carries the control that ENDS the walk from here, so leaving does not mean going
// back in first. The count is the WALK's own order (`guideWalk`, so a descending walk
// counts down the way it reads) and the label is the step's own, exactly as its card
// titles it. With no current step the bar says so rather than inventing a number.
function renderGuideBack(steps,cur){
  const bar=$("#gBack"); if(!bar)return;
  const on=GUIDE.on&&GUIDE.aside;
  bar.classList.toggle("hidden",!on);
  if(!on)return;
  const list=guideWalk(steps||[]);
  const i=list.findIndex(x=>guideKey(x)===GUIDE.cur);
  const where=i>=0?"Step "+(i+1)+" of "+list.length
    :list.length?"Nothing open · "+list.length+" steps":"Nothing to decide yet";
  $("#gbkStep").textContent=where+(i>=0&&cur&&cur.label?" · "+cur.label:"");
  $("#gbkBack").onclick=()=>{GUIDE.aside=false;render();};
  $("#gbkEnd").onclick=closeGuide;
}
// build · level · progress · the two ways out. The pane toggle is the phone's one tap
// between the decision and the chain (D126(c)); at desktop widths both are on screen
// and it is hidden by CSS, so it never becomes a second navigation model.
function renderGuideHead(steps){
  const b=activeBuild();
  $("#ghName").textContent=(b&&b.meta.character)||"New build";
  const ver=$("#ghVer"); ver.textContent=(b&&b.meta.name)||"";
  ver.classList.toggle("hidden",!ver.textContent);
  const total=state.classes.reduce((a,r)=>a+(r.level||0),0);
  const view=PREVIEW.level==null?total:PREVIEW.level;
  $("#ghLvl").textContent=total?`L${view} / ${total}`:"no levels yet";
  const need=steps.filter(x=>!x.optional), doneN=need.filter(x=>x.done).length;
  $("#ghProgN").textContent=doneN+" / "+need.length+" decided";
  $("#ghBar").style.width=(need.length?Math.round(doneN/need.length*100):0)+"%";
  const tg=$("#ghToggle"), chainOn=GUIDE.pane==="chain";
  tg.innerHTML="";
  const l=el("span","lbl-ico");
  l.append(icoEl(chainOn?"compass":"order"),document.createTextNode(chainOn?"Decision":"Chain"));
  tg.append(l);
  tg.onclick=()=>{GUIDE.pane=chainOn?"stage":"chain";renderGuide();};
  // the switch is not an exit and not a hide: the page SLIDES aside (D130(e)) and the
  // pinned bar over the character view says which step it is holding
  $("#ghSwap").onclick=()=>{GUIDE.aside=true;render();};
  $("#ghClose").onclick=closeGuide;
}
// WHICH WALK — D131(e). The header's "Reconstruct…" command menu is gone, and so is the
// word: the direction is a TWO-STATE toggle now, and the state pair behind it is
// unchanged, so both walks of D118(f,g) survive as the two states.
//   UP   — the forward walk from L1: a take fills the next open slot.
//          (GUIDE.reverse=false, GUIDE.desc=false)
//   DOWN — starts at the top level in PLACE mode: the pool narrows to the build's own
//          picks and a click places one into the selected slot; whatever is never placed
//          drifts to the top slice and takes E4 flags, never a delete (D118(g)).
//          (GUIDE.reverse=true, GUIDE.desc=true)
// The old menu's third state (reverse + ascending) had no place in a two-state control
// and is unreachable by design — the two remaining ones are the two walks D118(f) names.
const guideWalkDown=()=>GUIDE.reverse&&GUIDE.desc;
// DOWN narrows the candidate pool to the build's OWN picks and answers a step by PLACING
// one into a slot — so the only step it can answer is a pick section that holds picks.
// ONE predicate answers all three questions the walk asks (I5 · 3/4/5, one defect seen
// three times): whether the control has anything to offer, which step the walk opens on,
// and which level the rail's "from L{n}" names. It replaces `guideAnswered()`, which
// counted species, feats and optional features — none of which Down can place, so the
// control was offered on builds whose Down walk was empty — and it replaces the
// `guideWalk(steps)[0]` landing, which descending is the trailing "next level" GROWTH
// card, so Down opened on a levelling affordance instead of a placement.
function guideDownPlaceable(list){
  return (list||[]).find(s=>(s.sections||[]).some(sec=>{
    if(sec.kind!=="pick")return false;
    const arr=sec.pick==="cantrip"?"cantrips":"spells";
    // a slot that exists AND holds something to place: `guidePlace` refuses a position
    // past the array's end (D118(g) — never a delete), which is a step with no answer
    return sec.from<(((state.chosen[sec.row]||{})[arr])||[]).length;
  }))||null;
}
// an in-flight Down walk never hides its own control — the way back up is on it
const guideCanWalkDown=steps=>GUIDE.reverse
  ||!!guideDownPlaceable(steps||(R&&R.gsteps)||[]);
// flipping the direction RESUMES that walk's own step: `openGuide` re-resolves `cur` from
// scratch (and clears `place`, which is per-walk), which is what made the old menu safe
// to use mid-flight and keeps this one safe too. A no-op flip stays a no-op.
function guideSetWalk(down){
  down=!!down;
  if(down===guideWalkDown())return;
  if(down&&!guideCanWalkDown())return;
  openGuide(down,down);
}
// The control lives at the HEAD OF THE CHAIN COLUMN, not in the page header — it
// describes that column, and since D132 inverted both level columns (top level at the
// top, L1 at the bottom) it can be READ against it: the arrow now points the way the walk
// really travels on screen. **Up** starts at the bottom row and climbs; **Down** starts at
// the head and descends. That is what carries the meaning, so the button needs no label —
// one quiet ghost arrow beside the line naming the level the walk starts from, and a tip
// that says in one line what this direction does.
// The arrows are DRAWN (`walkup`/`walkdn` in ICONS), never typed: a ↑ glyph sits wherever
// its font puts it, which is why this app draws its carets (D57).
// Sticky, so scrolling the rail never takes the direction off screen. Hidden entirely
// where Down would be an empty walk — the same predicate, and the same choice, the old
// "Reconstruct…" command menu made.
function guideWalkStrip(total,steps){
  const down=guideWalkDown();
  // the level the walk really STARTS from — Down's first placeable step, which is the
  // one `guideSync` opens on, and Up's L1. It used to read `total` while the walk landed
  // on the growth card above it, so the note named a level the walk never opened on.
  const first=down?guideDownPlaceable(guideWalk(steps||[])):null;
  const at=down?(first?first.lv:Math.max(1,total)):1;
  const wrap=el("div","gwalk");
  const b=el("button","gwalkbtn");
  b.append(icoEl(down?"walkdn":"walkup"));
  b.setAttribute("aria-label","Walking "+(down?"down":"up")+" from L"+at
    +" — switch the direction");
  // THE CLICK GOES ON BEFORE attachTip. It preserves an existing handler now, but the
  // order is the rule (it once ate the preview's "order…" button outright), and a tip
  // that swallowed this click would leave the walk with no way to turn around.
  b.onclick=e=>{e.stopPropagation(); guideSetWalk(!down);};
  attachTip(b,tipBlock(down?"Walking down, from L"+at:"Walking up, from L1",
    down?"Only this build's own picks are offered, and a click places one into the slot you selected. Click to turn the walk around."
        :"A pick you take fills the next open slot. Click to turn the walk around."));
  wrap.append(b);
  wrap.append(el("span","gwalkat","from L"+at));
  return wrap;
}
// ── the chain column (D126(b) · D130(a)) ───────────────────────────────────
// "A lean variant of the timeline modal, with also the ability to change order." One card
// per character level, carrying the timeline's own language: the per-class coloured rail,
// run grouping (2px joins inside a run), the run divider label, the level's E4 flag.
// D130(a) collapses it: a closed level is ONE line — level, class, and a single icon for
// the worst thing in it (red illegal · gold open or skipped · green ok), using the same
// icons the rows themselves use. Only one level is open at a time; by default the current
// one, and clicking any header opens that one instead. An open level lists AGGREGATED
// rows — one per section, with its counter ("Cantrips 0 of 2") — never one row per slot.
// Clicking a row jumps the walk to its step (guideGo); dragging a level card reorders the
// plan through the SAME code path the timeline modal uses (wireRowDrag), so the two
// surfaces can never disagree. The column reads DESCENDING since D132 — top level at the
// head, L1 at the foot, the same way the timeline does — and that cost the drag nothing:
// `wireRowDrag` is handed PLAN INDICES, never screen positions, so the axis flip never
// reaches it. The walk's own direction does not move the column either; only D132 did.
let GC={drag:null,open:null};
// the worst thing in a level, as ONE icon (D130(a)) — the E4 sweep's findings included,
// so a collapsed row never carries two warnings that have to be told apart. Red is a
// PROBLEM (a slot whose spell can't sit there, or a finding the sweep made at this level,
// which is the red the timeline already gives it); gold is unfinished work; green is
// nothing outstanding. Optional sections never drive it — passing on a swap is an answer
// (D121) — and the trailing "next level" affordance is not a decision that can be open.
function guideSeverity(group,flags){
  let ill=false,skip=false,open=false;
  group.forEach(st=>{ if(st.kind==="class"&&st.row==null)return;
    st.sections.forEach(sec=>{
      if(sec.ill){ill=true;return;}
      if(sec.optional||sec.done)return;
      if(sec.status==="skipped")skip=true; else open=true;});});
  const why=[];
  if(ill)why.push("A spell here is above what the class could cast when its slot arrived.");
  if(flags&&flags.length)why.push(flags.map(f=>f.text).join(" "));
  if(skip)why.push("Steps were skipped here and are still open.");
  else if(open)why.push("Steps here are still open.");
  if(!why.length)why.push("Everything here is answered.");
  return [(ill||(flags&&flags.length)||skip)?"warn":open?"dot":"check",
          (ill||(flags&&flags.length))?"gcbad":(skip||open)?"gcgold":"gcgood",
          why.join(" ")];
}
// what a chain row says on its one line. A DONE section NAMES its answer, however many
// picks it holds — a finished group's names are the honest summary of it (D130(a,b), the
// same reading the card's chips give). An unfinished group counts instead ("1 of 2
// chosen"): a partial list of names reads as the whole of it. A single pick still open
// says what it is waiting for, or that it was skipped.
const guideSecText=sec=>(sec.done&&sec.value)?sec.value
  :sec.need>1?(sec.have+" of "+sec.need+" chosen")
  :(sec.value||(sec.status==="skipped"?"skipped — still open":"to decide"));
function renderGuideChain(steps,cur){
  const box=$("#gChain"); if(!box)return;
  const keep=box.scrollTop; box.innerHTML="";
  const plan=classLevelPlan(), total=plan.length;
  const rowOf=new Map(state.classes.map(r=>[r.id,r]));
  const health=(R&&R.health)||buildHealth();
  const multi=state.classes.length>1;
  const view=PREVIEW.level==null?total:PREVIEW.level;
  // the descending column's four pieces — runs keyed on their highest level, the divider,
  // `runjoin` reaching upward, the prepend — belong to `levelColumn`, shared with the
  // timeline modal so the two can never drift (D132)
  const col=levelColumn(plan,box,multi);
  const byLv=new Map();
  steps.forEach(s=>{const a=byLv.get(s.lv)||[];a.push(s);byLv.set(s.lv,a);});
  const curLv=cur?cur.lv:null;
  const perClass=new Map(); let curEl=null;
  // ASCENDING iteration, DESCENDING insertion (`box.prepend`) — `perClass` counts each
  // class's own level as it walks, so the walk cannot be reversed without every row
  // naming the wrong class level. The "next level" affordance is the highest key, so it
  // is prepended last and lands at the head of the column, where growth belongs.
  [...byLv.keys()].sort((a,b)=>a-b).forEach(lv=>{
    const group=byLv.get(lv);
    const id0=lv<=total?plan[lv-1]:null, row=id0!=null?rowOf.get(id0):null;
    const id=row?id0:null, c=row&&CLS_BY[row.clsKey];
    let cl=0; if(row){cl=(perClass.get(id)||0)+1; perClass.set(id,cl);}
    const open=GC.open==null?(lv===curLv):(GC.open===lv);
    const card=el("div","locard gclv"+(row?"":" gcnext")+(open?" gcopen":"")
      +(row&&lv===view?" here":"")+col.railCls(lv,id));
    card.dataset.lv=String(lv);
    if(multi&&row){card.append(icoEl("grip","logrip")); card.draggable=true;}
    const body=el("div","lobody");
    const head=el("div","lotop");
    head.append(el("span","lolv","L"+lv));
    head.append(el("b","locls",row?((c?c.name:"?")+" "+cl):"next level"));
    // ONE icon for the whole level (D130(a)) — the worst thing in it, in the row icons'
    // own vocabulary, with the E4 sweep's own findings folded in so the line never carries
    // two warnings. It is shown collapsed AND open, so opening a level never changes what
    // the line said about it. The growth affordance is not a level yet: nothing to say.
    const flags=health.byLevel.get(lv);
    if(row){const [sIco,sCls,sWhy]=guideSeverity(group,flags);
      const sev=el("span","gcsev "+sCls); sev.append(icoEl(sIco)); head.append(sev);
      attachTip(sev,tipBlock("Level "+lv+(flags?": "+issueCount(flags.length):""),sWhy));}
    else head.append(el("span","gcsev"));
    const car=el("span","lvlcar"+(open?" up":"")); head.append(car);
    body.append(head);
    if(open){
      const list=el("div","gcsteps");
      group.forEach(st=>st.sections.forEach(sec=>{
        const isCur=st.key===GUIDE.cur;
        const b=el("button","gcstep "+sec.status+(sec.optional?" optional":"")
          +(isCur?" cur":"")+(sec.ill?" gcill":""));
        const k=el("span","gck");
        k.append(el("span","gcl",sec.label));
        k.append(el("span","gcv",guideSecText(sec)));
        b.append(k);
        const stx=el("span","gcs");
        stx.append(icoEl(sec.ill?"warn":sec.done?"check":sec.status==="skipped"?"warn":"dot"));
        b.append(stx);
        // a nested action stops its click: the jump re-renders this very column, and a
        // bubbling event would land on the freshly-attached card handler
        b.onclick=e=>{e.stopPropagation(); GUIDE.pane="stage"; guideGo(st);};
        list.append(b);
        if(isCur&&!curEl)curEl=b;
      }));
      body.append(list);
    }
    card.append(body);
    // the level header opens THIS level and closes whichever was open (D130(a)); the
    // walk itself moves only from a row, so expanding is never an answer
    card.onclick=e=>{ if(e.target.closest(".gcstep"))return;
      e.stopPropagation(); GC.open=open?-1:lv; renderGuide(); };
    // the drag is wired with the level's PLAN INDEX, never its position in the column —
    // which is precisely why inverting the display leaves `wireRowDrag` untouched and the
    // two surfaces still produce the identical plan from the identical drop (G1)
    wireRowDrag(card,lv-1,plan,GC,box,{enabled:multi&&!!row});
    col.emit(lv,id,card);
  });
  // last prepend wins the top: the direction sits above every level, including the
  // growth affordance, because it governs the whole column
  if(guideCanWalkDown(steps))col.top(guideWalkStrip(total,steps));
  box.scrollTop=keep;
  // keep the current step in view without touching the page's own scroll
  if(curEl){const r=curEl.getBoundingClientRect(), br=box.getBoundingClientRect();
    if(r.top<br.top+4||r.bottom>br.bottom-4)box.scrollTop+=r.top-br.top-60;}
}
// ── the decision stage (G2 · D126(d,e,g) · D130(b,c)) ──────────────────────
// One card per STEP, holding one block per section. The card header names the feature and
// carries the counter; each section names its own group and carries its own. An ANSWERED
// step keeps its card and turns green (D126(e)) — the walk does not jump, so the card is
// what tells you the answer landed, and Next is the affordance that moves you on.
// D130(b): a pick section shows its answer ONCE, as chips, each carrying its own ✕ that
// drops that pick through the app's own write path. The counter lives in the header and
// turns green when full; the duplicate ✓ sentence is gone.
// Every card's control is the app's OWN control: the real pickers, the real choice row,
// the real optional-feature chooser. A second copy of any of them would be a second set of
// bugs (D126(g) is the report that this was missing, not that it was ugly).
function guideStepCount(st){
  if(st.sections.length===1){const s=st.sections[0];
    if(s.kind==="pick"||s.kind==="cpick")
      return {text:s.have+" of "+s.need+" chosen",full:s.done};
    return null;}
  const n=st.sections.filter(x=>x.done||(x.optional&&x.value!=null)).length;
  return {text:n+" of "+st.sections.length+" answered",full:n>=st.sections.length};
}
function renderGuideStage(steps,cur,rowOf){
  const st=$("#gStage"); if(!st)return; st.innerHTML="";
  const need=steps.filter(x=>!x.optional), doneN=need.filter(x=>x.done).length;
  // D131(c): the walk banner is gone. It named the walk (the direction control says that
  // now), then spent a line explaining jumping and skipping — reference prose, which
  // belongs behind the header's `?` (D88), not above every card on every visit.
  if(!cur){
    const card=el("div","gcard gdone");
    card.append(el("div","goptlab","nothing open"));
    card.append(el("div","gval",doneN>=need.length?"Every decision is answered."
      :"No step is current — click one in the chain to pick the walk up."));
    st.append(card);
    // this card used to carry no control at all, which is a terminal state with no way
    // out of it but the header's × — the same complaint the dead end-of-walk button drew
    const nav=el("div","gnav");
    const first=steps.find(x=>!x.optional&&x.status!=="done");
    if(first){const b=el("button","btn","Go to the first open step");
      b.onclick=()=>guideGo(first); nav.append(b);}
    const ex=el("button","btn"+(first?"":" on"),"Exit builder");
    ex.onclick=closeGuide; nav.append(ex);
    st.append(nav); return;
  }
  const rw=cur.row!=null?rowOf.get(cur.row):null, rc=rw&&CLS_BY[rw.clsKey];
  // answered AND sound is what earns the green: a step holding a pick that can't sit
  // where it does is settled, not right, and the chain is already saying so in red
  const ill=cur.sections.some(x=>x.ill);
  const card=el("div","gcard"+(cur.done&&!ill?" gdone":""));
  const hd=el("div","ghd");
  hd.append(el("b","ghdt",cur.label));
  const cnt=guideStepCount(cur);
  if(cnt)hd.append(el("span","gcnt"+(cnt.full?" full":""),cnt.text));
  card.append(hd);
  // the context line: which level, whose decision it is, and whether this one is optional.
  // "optional" STAYS — on a single-section step it is the only place that says so
  // (`guideSecWrap` only labels sections when there are two or more to tell apart), and
  // whether an unanswered step counts against you is status, not prose. Its old tail,
  // "— passing on it is an answer", was the explanation, and went with D131(c).
  card.append(el("p","ghsub",["L"+cur.lv, rc?rc.name:null, cur.sub||null,
      cur.optional?"optional":null].filter(Boolean).join(" · ")));
  let any=false;
  cur.sections.forEach(sec=>{const bl=guideSecBlock(cur,sec,rowOf);
    if(bl){card.append(bl);any=true;}});
  if(!any)card.append(el("div","grhint","Nothing to answer here — Skip or Next moves the walk along."));
  st.append(card);
  // Back · Skip · Next walk the chain; Next seeks the next open decision. Back is
  // HIDDEN where there is nowhere to go back to (D126(i)) — a dead control is worse
  // than an absent one. Back walks the FULL list, class steps included, so a level's
  // "which class" answer is always one press behind the picks it opened.
  const nav=el("div","gnav");
  const prev=(()=>{const list=guideWalk(steps);
    const i=list.findIndex(x=>x.key===GUIDE.cur);return i>0?list[i-1]:null;})();
  if(prev){const back=el("button","btn","← Back");
    back.onclick=()=>guideGo(prev); nav.append(back);}
  const nxAny=guideStepAfter(steps,GUIDE.cur,null);
  // reverse walks EVERY step (review is the point); forward seeks the next open decision.
  // Next only ever moves FORWARD in walk order (G3): it used to fall back to
  // `guideResume`, which WRAPPED to the first open decision anywhere, so the end of a walk
  // was indistinguishable from its middle and Next quietly sent you backwards.
  const nxOpen=GUIDE.reverse?nxAny
    :guideStepAfter(steps,GUIDE.cur,x=>x.status!=="done"&&!x.optional);
  // what Next would LOCK on this step before it moves (see `guidePending`)
  const pend=guidePending(cur);
  // THE END OF THE WALK IS A TERMINAL STATE, not a dead Next (D130(h)). Two ends exist and
  // they are NOT the same: nothing open ahead while decisions are still open BEHIND you
  // (you skipped or jumped past them) — the primary takes you to the first of them; and
  // nothing open anywhere — the primary leaves. Skip is gone from both: there is nothing
  // ahead to skip to, and a disabled control is worse than an absent one.
  const term=!nxOpen&&!pend;
  const behind=term?steps.find(x=>!x.optional&&x.status!=="done"&&x.key!==GUIDE.cur):null;
  if(nxAny&&!term){
    const skip=el("button","btn","Skip");
    // Skip is the honest pass: it moves on WITHOUT committing what the card is showing,
    // which is exactly what leaves the step open (and flagged) behind you
    skip.onclick=()=>guideGo(nxAny);
    nav.append(skip);
  }
  if(term&&behind){
    const ex=el("button","btn","Exit builder"); ex.onclick=closeGuide; nav.append(ex);
  }
  const next=el("button","btn on",
    term?(behind?"Go to the first open step":"Exit builder"):"Next →");
  next.onclick=term
    ? (behind?()=>guideGo(behind):()=>closeGuide())
    : ()=>{
        // Next COMMITS what this step is showing, then advances. The advance is
        // `guideAdvance`, the same call the modal's footer button makes (D131(b)) — one
        // function, two callers, so the two ways forward can never diverge. It reads the
        // FRESH `R.gsteps`, which is what a commit above it just re-derived: a class
        // level taken here opens slots that did not exist when this button was drawn.
        if(pend)pend.run();
        guideAdvance();
      };
  nav.append(next);
  st.append(nav);
  // What Next is about to WRITE is not prose — it warns about the action in front of you
  // (D88 keeps exactly that), and it names the specific value, which no other surface
  // does. Trimmed to that: the "Skip moves on without it" half was the rule, and the rule
  // is in the header's `?` now (D131(c)).
  if(pend)st.append(el("p","gend","Next locks "+pend.what+"."));
  if(term){
    // the step you are STANDING on is not "behind you" — counting it there would read as
    // one more thing to go back for than there is
    const rest=need.filter(x=>x.key!==GUIDE.cur);
    const openN=rest.filter(x=>x.status==="open").length;
    const skipN=rest.filter(x=>x.status==="skipped").length;
    const left=[openN?openN+" still open":null,skipN?skipN+" skipped":null].filter(Boolean).join(" and ");
    st.append(el("p","gend",left
      ? "That is the end of the walk — nothing open ahead of here. "+left
        +" behind you: the button takes you to the first, or click any step in the chain."
      : doneN>=need.length
      ? "That is the end of the walk, and every decision this build carries is answered."
      : "That is the end of the walk — this step is the last one still open, and its answer is on the card above."));
  }
}
// What Next would LOCK before it advances — Francesco, raw: *"If I click 'next' after a
// preselected option, it should lock that option as chosen. Only skipping it ignores it"*.
// Some sections arrive with an answer already SHOWING that the build does not hold: an
// option group or the casting-ability question renders a DEFAULT in its select
// (`resolveGrants`: `value` = the stored answer OR the first option), so it reads answered
// on screen while `state.choices` is empty and the chain calls it open. Next commits every
// one of them and moves on; Skip moves on without writing, which is what leaves them
// honestly open. NOTHING is invented where the control shows no value: the subclass menu,
// the species/feat buttons and the pick sections' modal openers all show a prompt, not a
// selection, and a SWAP is never fabricated — "no trade" is the legitimate answer D121
// protects, so passing on one has to stay a pass.
// The trailing "Next level" CLASS step has no such section by construction (D130(g),
// refined): its "Continue X → N" is an action that GROWS the build, not a selection
// already on screen waiting to be stored, so Next can never level you up by itself.
function guidePending(s){
  const secs=((s&&s.sections)||[]).filter(x=>x.kind==="choice"&&x.choice
    &&x.choice.value!=null&&state.choices[x.choice.id]==null);
  if(!secs.length)return null;
  const say=c=>'"'+(c.type==="ability"?(ABIL[c.value]||String(c.value)):String(c.value))+'"';
  return {what:secs.map(x=>say(x.choice)).join(" and "),
          run:()=>{secs.forEach(x=>{state.choices[x.choice.id]=x.choice.value;});render();}};
}
// every class level is one write: bump the row's level, then put that row at the END of
// the acquisition order. A class already in the build LEVELS UP its own row (one class,
// one row — W1); a new one opens a row. This is the only idiom the guide uses.
function guideTakeClass(ck){
  const plan=classLevelPlan();
  const have=state.classes.find(r=>r.clsKey===ck);
  if(have){have.level=Math.min(20,(have.level||0)+1);state.levelOrder=plan.concat([have.id]);}
  else{const nr={clsKey:ck,subKey:null,level:1,id:state.nextRowId++};state.classes.push(nr);
    state.levelOrder=plan.concat([nr.id]);}
  save();refreshAll();render();
}
// the subclass control, shared by the open section and the answered one. A COMMAND menu,
// not a bound field: it always shows its prompt and resets after a pick, so it can never
// silently select option 0 and rewrite the row (the trap `classOptions(keep)` exists for).
// The ✓ marks the one in the build — `<option>` is the one place a glyph is allowed (D57).
function guideSubSelect(rowId,rowOf){
  const row=rowOf.get(rowId), c=row&&CLS_BY[row.clsKey]; if(!c)return null;
  const subs=(SUBS_OF[row.clsKey]||[]).filter(visible);
  if(!subs.length)return null;
  const sel=el("select","gmenu");
  // the prompt needs an EXPLICIT empty value: an <option> with no value attribute takes
  // its TEXT as the value, so the reset below would match nothing (the control goes
  // blank) and re-selecting the prompt would hand the handler a sentence to act on —
  // the same trap the class step's "another class…" prompt below is written around
  const p=el("option",null,row.subKey?"change the subclass…":"choose a subclass…");
  p.value=""; sel.append(p);
  subs.forEach(sc=>{const k2=key(sc.name,sc.source);
    const o=el("option",null,(sc.shortName||sc.name)+(k2===row.subKey?" ✓":""));
    o.value=k2;sel.append(o);});
  sel.onchange=()=>{const v=sel.value; sel.value="";
    if(!v||v===row.subKey)return; row.subKey=v;save();refreshAll();render();};
  return sel;
}
// the app's OWN optional-feature picker for this progression's slot (D126(g)) — the same
// call the timeline's quick-choose makes, so there is one invocation picker, not two
function guideOptBtn(pool,label,cls){
  if(!pool||!pool.prog)return null;
  const b=el("button","btn"+(cls||""),label);
  b.onclick=()=>openGainChooser({kind:"opt",prog:pool.prog,giver:pool.giver,
    giverSrc:pool.giverSrc,cl:pool.cl});
  return b;
}
// dropping ONE pick from a chip's ✕ (D130(b)). Both paths are the app's existing writers —
// a class pick goes through `toggle` (the same call the modal's ✓ row makes) and a granted
// choice through the same `state.choices` filter the Choices card's chip uses. A drop is
// not a delete of history: the acquisition array simply loses that entry, exactly as it
// does anywhere else in the app, and nothing else moves.
function guideDrop(sec,k){
  if(sec.kind==="cpick"){
    state.choices[sec.cid]=(state.choices[sec.cid]||[]).filter(v=>v!==k); render(); return;}
  toggle(sec.row,k,sec.pick==="cantrip");
}
// What a section is asking for, in a word — one owner for both surfaces that name it
// (the card's button and the modal's fallback title). A class pick section says which
// kind it is; a GRANTED group's kind is only in its own filter, so the button read
// "Choose spells…" over Magic Initiate's cantrip group until this branched. Same reading
// `guidePickAsk` does: `filterSpells`' grammar joins values with ";", 5etools' key case
// is not stable, and an absent key is unconstrained (D96) — a group whose level list is
// 0 and nothing else is a cantrip group.
function secIsCantrip(sec){
  if(sec.kind!=="cpick")return sec.pick==="cantrip";
  const f=(sec.choice&&sec.choice.filter)||null; if(!f)return false;
  const F={}; Object.keys(f).forEach(k=>{F[k.toLowerCase()]=f[k];});
  if(F.level==null)return false;
  const nums=String(F.level).split(";").map(Number).filter(n=>!isNaN(n));
  return !!nums.length&&nums.every(n=>n===0);
}
const guideNoun=sec=>secIsCantrip(sec)?(sec.need>1?"cantrips":"a cantrip")
  :sec.need>1?"spells":"a spell";
// one SECTION of the current step's card: what it asks, what it holds, and the control
// that answers it. Returns null when the section has nothing to draw.
function guideSecBlock(step,sec,rowOf){
  const multi=step.sections.length>1;
  const b=el("div","gsecb");
  const val=t=>el("div","gval",t);
  const hint=t=>el("div","grhint",t);
  if(sec.kind==="pick"||sec.kind==="cpick"){
    // chips ARE the answer (D130(b)) — one representation, each with its own ✕
    const chips=el("div","gchips");
    (sec.keys||[]).forEach((k,j)=>{
      const sp=SPELL_BY[k], pos=sec.from!=null?sec.from+j:j;
      const bad=sec.illAt&&sec.illAt.has(pos);
      const chip=el("span","cartchip"+(bad?" gbad":""));
      chip.append(el("span","lv",sp?(sp.level===0?"C":String(sp.level)):"?"));
      const nm=el("span",null,sp?sp.name:String(k).split("|")[0]);
      if(sp)attachSpell(nm,sp);
      chip.append(nm);
      const x=xBtn(null,()=>guideDrop(sec,k));
      attachTip(x,tipBlock("Drop "+(sp?sp.name:"this pick"),
        "Takes it back out of this group. Nothing else moves, and it can be taken again."));
      chip.append(x); chips.append(chip);});
    // ONLY REAL PICKS ARE CHIPS (D131(d)). The "+N more" ghost took the shared
    // `.cartchip:hover` accent border and answered no click — a control that looks
    // interactive and does nothing is worse than the count it saved, and the counter in
    // the card header (and in `guideSecWrap`) already carries that number. An empty row
    // is not appended at all: `.gsecb` is a gapped column, so an empty flex child would
    // leave a hole where the chips used to be.
    if(chips.children.length)b.append(chips);
    const noun=guideNoun(sec);
    const btn=el("button","btn"+(sec.done?"":" on gbig"),
      GUIDE.reverse&&sec.kind==="pick"?"Place picks here…"
      :sec.done?"Change…":"Choose "+noun+"…");
    // each section opens its OWN picker, scoped to its own pool (D131(a))
    btn.onclick=()=>openGpickSec(step,sec);
    b.append(btn);
    // the ILLEGAL-slot line stays: it is an error about the pick in front of you, and it
    // is the only place that says which way out there is (D131(c) keeps error states).
    // What went with D131(c) are the two notes that described the PICKER rather than the
    // build — "only what <class> can legally take here is listed…" and "these belong to
    // the feature that granted them" — reference prose, now behind the header's `?`.
    if(sec.ill)b.append(hint("A spell here is above what the class could cast when this slot "
      +"arrived — the chain marks it. Placing the pick that really was learned here is what clears it."));
    return guideSecWrap(step,sec,b);
  }
  if(sec.kind==="choice"){ b.append(choiceRow(sec.choice)); return guideSecWrap(step,sec,b); }
  if(sec.kind==="species"){
    if(sec.done&&!multi)b.append(val(sec.value));
    const btn=el("button","btn"+(sec.done?"":" on gbig"),
      sec.done?"Change the species…":"Choose a species…");
    btn.onclick=()=>openEntityPicker("species"); b.append(btn);
    return guideSecWrap(step,sec,b);
  }
  if(sec.kind==="feat"){
    if(sec.done&&!multi)b.append(val(sec.value));
    const btn=el("button","btn"+(sec.done?"":" on gbig"),
      sec.done?"Change the feat…":"Choose a feat…");
    btn.onclick=()=>openEntityPicker("feat",
      sec.slot==="epic"?"epic":sec.slot==="origin"?"origin":"general");
    b.append(btn);
    // the ASI note is reference — how to express a choice this app deliberately does not
    // model — so it moved behind the header's `?` (D131(c) · D88)
    return guideSecWrap(step,sec,b);
  }
  if(sec.kind==="subclass"){
    if(sec.done&&!multi)b.append(val(sec.value));
    const sel=guideSubSelect(sec.row,rowOf);
    if(sel)b.append(sel);
    else if(!sec.done)b.append(hint("No subclass for this class is available in the books you have on."));
    return guideSecWrap(step,sec,b);
  }
  if(sec.kind==="optfeat"){
    if(sec.done&&!multi)b.append(val(sec.value));
    const btn=guideOptBtn(sec.pool,sec.done?"Change it…"
      :"Choose "+String(sec.label).replace(/s$/,"").toLowerCase()+"…",sec.done?"":" on gbig");
    if(btn)b.append(btn);
    else b.append(hint("This slot's progression has no chooser of its own — its options are on the character view, under Optional features."));
    return guideSecWrap(step,sec,b);
  }
  if(sec.kind==="class"){
    if(sec.done){
      // a class step never hosts a merged choice, so it is always single-section and the
      // value line always draws — which is the whole card: a level already taken is an
      // answer, and where to CHANGE one is reference (the header's `?`, D131(c))
      if(!multi)b.append(val(sec.value));
      return guideSecWrap(step,sec,b);
    }
    // D126(d): continue where you are, go back to the other class you were levelling, or
    // reach for the rest. Two prominent buttons and a compact menu — one select doing all
    // three jobs is what "3+ classes to be decided" was complaining about.
    const contId=sec.continueOf, cont=contId!=null?rowOf.get(contId):null;
    const big=(row2,primary)=>{const c2=CLS_BY[row2.clsKey]; if(!c2)return null;
      const btn=el("button","btn gbig"+(primary?" on":""),
        (primary?"Continue ":"")+c2.name+" → "+Math.min(20,(row2.level||0)+1));
      btn.onclick=()=>guideTakeClass(row2.clsKey); return btn;};
    const row=el("div","gbigrow"); const shown=new Set();
    if(cont){const x=big(cont,true); if(x){row.append(x);shown.add(cont.clsKey);}}
    // the OTHER class levelled most recently — the second half of D126(d)
    const plan0=classLevelPlan(); let otherId=null;
    for(let i=plan0.length-1;i>=0;i--)if(plan0[i]!==contId){otherId=plan0[i];break;}
    const other=otherId!=null?rowOf.get(otherId):null;
    if(other){const x=big(other,false); if(x){row.append(x);shown.add(other.clsKey);}}
    if(row.children.length)b.append(row);
    // the rest, as a compact menu. A <select>, deliberately, not a popover: the stage is
    // an overflow:auto scroller and would clip an absolutely-placed menu (the trap the
    // build switcher went position:fixed to escape), and this control has one action.
    // A class already in the build stays on offer — it levels up; one that would only
    // DUPLICATE a row under another printing does not (one class, one row).
    const taken=takenClasses();
    const rest=DATA.classes.filter(visible)
      .filter(c=>!shown.has(key(c.name,c.source)))
      .filter(c=>state.classes.some(r=>r.clsKey===key(c.name,c.source))
        ||!taken.has(c.name.toLowerCase()))
      .sort((a,b)=>a.name.localeCompare(b.name)||a.source.localeCompare(b.source));
    if(rest.length){
      const sel=el("select","gmenu");
      // explicit empty value on the prompt (see `guideSubSelect`): without it the prompt's
      // value is its own TEXT, and re-selecting it would open a class row named after it
      const p=el("option",null,shown.size?"another class…":"choose a class");
      p.value=""; sel.append(p);
      rest.forEach(c=>{const o=el("option",null,c.name+(c.source!==CORE?` (${c.source})`:""));
        o.value=key(c.name,c.source);sel.append(o);});
      sel.onchange=()=>{const ck=sel.value; sel.value=""; if(ck)guideTakeClass(ck);};
      b.append(sel);
    }
    return guideSecWrap(step,sec,b);
  }
  if(sec.kind==="swap"){
    const kind=sec.swkind==="cantrip"?"cantrip":"spell";
    if(sec.done){
      // a recorded trade (D126(h)): the value line reads "− out + in", so all this owes
      // you is the way back out. Undoing clears the EVENT and nothing else — the
      // replacement keeps its position, exactly as clearing the timeline's pill does.
      b.append(val(sec.value||"—"));
      const und=el("div","gtundo");
      const x=xBtn("gtx",()=>{clearSwap(sec.lv,sec.swkind);refreshAll();render();});
      attachTip(x,tipBlock("Undo the trade",
        "Clears this level's "+kind+" trade. The replacement stays where it is and nothing is "
        +"deleted — the same thing clearing the pill in the timeline does."));
      und.append(x,el("span","gtul","Undo the trade"));
      b.append(und);
      return guideSecWrap(step,sec,b);
    }
    // D126(h): a DIRECT trade. Tap the pick you are losing → the pick modal opens on its
    // legal replacements → the card comes back reading "− out + in". No arming, no second
    // phase. The write is still the timeline's (see `guideTrade`), so both surfaces record
    // the same event.
    const row=rowOf.get(sec.row), sched=row&&rowSched(row); if(!sched)return null;
    const c=row&&CLS_BY[row.clsKey];
    const ch=state.chosen[sec.row]||{};
    const name=k2=>{const sp=SPELL_BY[k2];return sp?sp.name:String(k2).split("|")[0];};
    const lvls=charLevelMap().get(sec.row)||[];
    const sa=kind==="cantrip"?sched.cant:sched.spells;
    const opts=[];
    ((kind==="cantrip"?ch.cantrips:ch.spells)||[]).forEach((k2,i)=>{
      if(acqAt(sa,i,lvls)<sec.lv)opts.push(unswap([k2],sec.row,kind,sec.lv-1)[0]);});
    if(!opts.length){b.append(hint(
      "No "+kind+" was learned before this level — there is nothing to trade away yet."));
      return guideSecWrap(step,sec,b);}
    const cm=guideSwapMax(row,sec.lv);
    // what is LEFT of the old paragraph is the only half that was state: the cap this
    // class may trade into at THIS level, which nothing else on the card says. The
    // instructions ("tap the one you are giving up… passing on it is the other honest
    // answer") went with D131(c) — the step is already titled "Swap a spell", every chip
    // carries its own hover tip, and "optional" is on the card's own context line.
    if(kind==="spell")b.append(hint((c?c.name:"This class")+" trades into "
      +(cm===1?"level 1":"level 1–"+cm)+" here."));
    const chips=el("div","gtchips");
    opts.forEach(k2=>{const sp=SPELL_BY[k2];
      const btn=el("button","gtchip");
      btn.append(el("span","lv",sp?(sp.level===0?"C":String(sp.level)):"?"));
      btn.append(el("span","gtn",name(k2)));
      btn.onclick=()=>openGpick({mode:"trade",kind,row:sec.row,lv:sec.lv,
        castMax:kind==="cantrip"?0:cm,out:k2,outName:name(k2)});
      attachTip(btn,tipBlock("Trade "+name(k2)+" away",
        "Opens the replacement list for "+(c?c.name:"this class")+" at L"+sec.lv+". Nothing is written "
        +"until you pick one, and the trade keeps this pick's place in the acquisition order."));
      chips.append(btn);});
    b.append(chips);
    return guideSecWrap(step,sec,b);
  }
  return null;
}
// a section's frame: its own label and counter, but only where there is more than one
// section to tell apart — a single-section step is already named by the card's header
function guideSecWrap(step,sec,body){
  if(step.sections.length<2)return body;
  const box=el("div","gsec");
  const h=el("div","gsech");
  h.append(el("span","gsecl",sec.label));
  if(sec.kind==="pick"||sec.kind==="cpick")
    h.append(el("span","gcnt"+(sec.done?" full":""),sec.have+" of "+sec.need));
  else if(sec.optional)h.append(el("span","gcnt","Optional"));
  box.append(h); box.append(body); return box;
}

// ── the guide's pick modal (G3 · D126(f) · D131(a,b)) ──────────────────────
// "Spells should be chosen from a modal, not the page … only eligible spells grouped by
// level, sorted highest to lowest." D131(a) scopes it to ONE SECTION per visit, superseding
// D130(d)'s take-the-whole-step: a Cantrips section and a Spells section of the same step
// are two pickers, each knowing only its own pool, so the modal has exactly one meaning
// every time it opens. D130(c)'s one-step-per-feature grouping is untouched — the step
// still holds its sections on the card, they just each own a picker. Taking one pick does
// not close the modal; the FOOTER BUTTON is the nudge that does (D131(b), `gpickFoot`), and
// it moves the walk on rather than only closing. Three modes, one list:
//   take  — the forward walk. The commit is the app's own `toggle` (or the same
//           `state.choices` write the Choices card makes for a granted group), so a pick
//           lands in the row's FIRST open slot and nothing here can lie about where: a
//           section whose slots start past what the row holds says so (D125).
//   place — the reconstruct walk (D118(f,g)). Only the build's own picks, and SLOT-LEVEL
//           placement lives here: the section shows its slots, one is the target, and a
//           click places at that position. Never deletes.
//   trade — the swap card's replacement (D126(h)). Commits through the timeline's own
//           arm-then-take write, so the app has exactly one swap-event shape, and closes:
//           a trade is one pick by definition.
// It is a plain `.modal`, which puts it ABOVE the guide page's layer — the guide is a
// page, and a page is what modals open over.
let GPICK=null;
const gpickNoun=sec=>sec.kind!=="cpick"&&!secIsCantrip(sec)&&/^Spellbook/.test(sec.label)
  ?(sec.need>1?"spellbook spells":"a spellbook spell"):guideNoun(sec);
// What a section may legally take, as spell records. This is the predicate the page
// pre-filter ran until G3 (D118(b)), moved here whole rather than written again: the
// section's row has to be a taker, the spell's level has to fit the cap, and reconstruct
// narrows the pool to the row's OWN picks. A granted group is filtered by the FILTER the
// choice carries — the same `filterSpells` call the Choices card's picker makes, which is
// what keeps a cantrip out of the 1st-level-spell group.
function guideEligible(sec,mode,cap){
  if(sec.kind==="cpick"){
    const mine=new Set(state.choices[sec.cid]||[]);
    return filterSpells((sec.choice&&sec.choice.filter)||{})
      .filter(sp=>mode!=="place"||mine.has(key(sp.name,sp.source)));
  }
  const arr=sec.pick==="cantrip"?"cantrips":"spells";
  const mine=new Set(((state.chosen[sec.row]||{})[arr])||[]);
  const c2=cap||9;
  return [...R.pool.values()].filter(i=>{
    const k=key(i.sp.name,i.sp.source);
    if(mode==="place"?!mine.has(k):!i.takers.some(t=>t.idx===sec.row))return false;
    return sec.pick==="cantrip"?i.sp.level===0:(i.sp.level>=1&&i.sp.level<=c2);
  }).map(i=>i.sp);
}
// where a forward take will really land (D125): the row's FIRST open slot of this kind,
// because the pick arrays are dense and a take resolves there whichever slot you clicked.
// `guideSync` clamps the CURRENT step to it, so from the open card these agree — it is the
// ANSWERED card's "Change…" that needs asking. null = the row's slots of this kind are all
// filled, and there is nowhere for a take to go.
function guideLandingSec(sec){
  if(GUIDE.reverse||sec.kind!=="pick")return sec;
  const arr=sec.pick==="cantrip"?"cantrips":"spells";
  const filled=(((state.chosen[sec.row]||{})[arr])||[]).length;
  if(sec.from<=filled&&filled<sec.to)return sec;
  let out=null;
  ((R&&R.gsteps)||[]).forEach(st=>st.sections.forEach(y=>{
    if(out||y.kind!=="pick"||y.row!==sec.row||y.pick!==sec.pick)return;
    if(y.from<=filled&&filled<y.to)out=y;}));
  return out;
}
// the top spell level a class may trade INTO at a level-up: its own class level there,
// read through its caster progression. Shared with the timeline's arm-then-take bar so
// the guide's card and the swapbar can never offer different caps.
function guideSwapMax(row,lv){
  const sched=row&&rowSched(row); if(!sched)return 1;
  const lvls=charLevelMap().get(row.id)||[];
  const clAt=lvls.filter(x=>x<=lv).length;
  return Math.max(1,maxLvlAt(sched.caster,Math.max(1,clAt)));
}
// open the modal for ONE SECTION of a chain step (D131(a), superseding D130(d)'s one visit
// per step): the modal knows only that section's pool, so a Cantrips section and a Spells
// section of the same step are two visits and never one list. D130(c)'s grouping is
// untouched — the step still holds both sections on its card, they just each own a picker.
// The trade card builds its own spec.
// TWO THINGS ARE DECIDED HERE, and both are the call site's job, not an ambient mode:
//  · WHICH MODE. Only a class pick section can be PLACED into: placement addresses an
//    array position of `state.chosen[row]`, and a granted choice (`cpick`) has no
//    acquisition order to reconstruct — it is a set. Reading the mode off `GUIDE.reverse`
//    alone opened a cpick picker in place mode, where the commit routed into a writer
//    written for pick arrays and did nothing at all (G4 · F4).
//  · WHERE THE VIEW STANDS. A forward take lands at `sliceInsertAt(row,arr,PREVIEW.level)`
//    — the previewed level's slice point — while the modal's cap, pool and hint all
//    describe `guideLandingSec`, the first slot of this kind still open. On an ANSWERED
//    section those two are different slots (the walk's own clamp only aligns OPEN ones),
//    so the modal claimed "fills the still-open L5 slot (cap 3)" while offering the L1
//    pool and inserting at the L1 slice point (G4-F3 / I5-2, a D118(b) gap). Standing the
//    view on the landing section's level makes all four agree — the pool is the class's
//    reach there, the cap is that section's, and `sliceInsertAt` resolves to that very
//    slot. Per SECTION, not per step: two sections of one step can land at two levels,
//    and moving the view for one of them would misplace the other's take.
function openGpickSec(step,sec){
  const place=GUIDE.reverse&&sec.kind==="pick";
  if(!place){
    const land=guideLandingSec(sec), top=topCharLevel();
    const at=land?land.lv:null;      // null = every slot of this kind is filled: stay put
    if(at!=null&&at!==(PREVIEW.level==null?top:PREVIEW.level))setPreview(at);
  }
  openGpick({mode:place?"place":"take",stepKey:step.key,secId:sec.id});
}
function openGpick(spec){
  // every opener starts unfolded: this modal serves a different question each time, and a
  // level folded shut in the last one would hide spells with nothing on screen saying why
  // (the same rule `openPick` follows, D94). The `?` disclosure resets with them.
  FOLDED.gpick.clear();
  gpickHelpShut();
  GPICK=spec;
  const s=$("#gpSearch"); if(s)s.value="";
  $("#gpickModal").classList.remove("hidden");
  renderGpick();
}
function closeGpick(){ if(!GPICK)return; GPICK=null;
  const m=$("#gpickModal"); if(m)m.classList.add("hidden"); }
// Re-derive the step and its sections EVERY render — not once at open. Dropping a pick
// from inside the modal moves the row's first open slot under your feet (that is what a
// drop is for), and a header still describing the slot it opened on would be exactly the
// lie D125 was raised about.
function gpickSync(){
  const g=GPICK; if(!g||g.mode==="trade")return;
  const st=((R&&R.gsteps)||[]).find(x=>x.key===g.stepKey)||null;
  g.step=st;
  // a pick section's id names its array POSITION RANGE and a choice section's is its grants
  // path id — both stable across re-derivation, which is what lets the modal hold one
  // section by id instead of an index that a re-derived step could renumber
  g.sec=st&&st.sections.find(x=>x.id===g.secId&&(x.kind==="pick"||x.kind==="cpick"))||null;
}
// the `?` (D88): the only prose left in this modal, and only where the gesture is not
// self-evident — placing into an addressed slot, and what a trade does to the order. A
// take needs none: the list is the question and the ✓ is the answer.
function gpickHelpShut(){
  const body=$("#gpHelp"), btn=$("#gpHelpBtn");
  if(body)body.classList.add("hidden");
  if(btn){btn.classList.remove("on");btn.setAttribute("aria-expanded","false");}
}
function gpickHelp(mode){
  const btn=$("#gpHelpBtn");
  ["Place","Trade"].forEach(m=>{const p=$("#gpHelp"+m);
    if(p)p.classList.toggle("hidden",mode!==m.toLowerCase());});
  const show=mode==="place"||mode==="trade";
  if(btn)btn.classList.toggle("hidden",!show);
  if(!show)gpickHelpShut();
}
// the footer button, which IS the proceed nudge (D131(b)). Three states, and the third one
// MOVES THE WALK — the whole point of the clause is that finishing a section should not
// need a second press on the stage behind the modal.
//   owed      — quiet, disabled, "Choose N more"
//   met       — accent, "Done — next step", closes and advances
//   met, but the step still has another section open — accent, "Done — next section":
//               the walk must not step over a question the card is still asking, so this
//               one lands you back on the card the other section lives on (D130(c))
// A trade closes on the pick it records, so its footer is a plain way out, never a nudge.
function gpickMore(){
  const g=GPICK;
  return !!(g&&g.step&&g.step.sections.some(x=>x!==g.sec&&!x.done&&!x.optional));
}
function gpickFoot(){
  const b=$("#gpDone"), g=GPICK; if(!b||!g)return;
  if(g.mode==="trade"){
    b.textContent="Close"; b.disabled=false; b.classList.remove("on"); return;}
  const sec=g.sec;
  const owed=g.mode==="take"&&sec?Math.max(0,sec.need-sec.have):0;
  b.disabled=owed>0;
  b.classList.toggle("on",!owed);
  b.textContent=owed?"Choose "+owed+" more"
    :"Done — "+(gpickMore()?"next section":"next step");
}
// the walk's advance, in the shape the stage's Next uses: forward seeks the next open
// decision, reverse walks every step (review is the point). Nothing new — `guideStepAfter`
// and `guideGo` are the same two primitives Next presses.
function guideAdvance(){
  const steps=(R&&R.gsteps)||[];
  const go=GUIDE.reverse?guideStepAfter(steps,GUIDE.cur,null)
    :guideStepAfter(steps,GUIDE.cur,x=>x.status!=="done"&&!x.optional);
  if(go)guideGo(go); else render();
}
function renderGpick(){
  if(!GPICK)return;
  gpickSync();
  const g=GPICK, list=$("#gpList"); if(!list)return;
  list.innerHTML="";
  const q=(($("#gpSearch")||{}).value||"").toLowerCase();
  let shown=0;
  gpickHelp(g.mode);
  if(g.mode==="trade"){
    const row=state.classes.find(r=>r.id===g.row), c=row&&CLS_BY[row.clsKey];
    const cname=c?c.name:"this class", kw=g.kind==="cantrip"?"cantrip":"spell";
    const capTxt=(g.kind==="cantrip"||!g.castMax)?"":" · up to level "+g.castMax;
    $("#gpTitle").textContent="Replace "+g.outName;
    // live status only — what a trade DOES to the order moved behind the `?` (D131(c))
    $("#gpSub").textContent="a "+kw+" for "+cname+" · L"+g.lv+capTxt;
    const mine=new Set((((state.chosen[g.row]||{})[g.kind==="cantrip"?"cantrips":"spells"])||[]));
    const items=[...R.pool.values()].filter(i=>{
      const k=key(i.sp.name,i.sp.source);
      if(!i.takers.some(t=>t.idx===g.row)||mine.has(k)||k===g.out)return false;
      return g.kind==="cantrip"?i.sp.level===0:(i.sp.level>=1&&i.sp.level<=(g.castMax||9));
    }).map(i=>i.sp).filter(sp=>!q||sp.name.toLowerCase().includes(q));
    shown=items.length;
    gpickSection(list,null,items,new Set(),"trade",null);
    $("#gpCount").textContent=shown+(shown===1?" spell":" spells");
    gpickFoot();
    return;
  }
  const st=g.step, sec=g.sec;
  if(!st||!sec){closeGpick();return;}
  const row=st.row!=null?state.classes.find(r=>r.id===st.row):null, c=row&&CLS_BY[row.clsKey];
  // the modal names the FEATURE it belongs to — the card it opened from ("Spellcasting",
  // "Magic Initiate") — and the section header below names the group and carries the count.
  // Neither line says the other's, which is the redundancy D130(b) was raised about;
  // `multiLabel` is what keeps a two-section cast step from titling itself "Cantrips".
  $("#gpTitle").textContent=st.multiLabel||st.label||"Choose "+gpickNoun(sec);
  // live status, nothing else (D131(c)): where in the build you are standing
  $("#gpSub").textContent=["L"+st.lv,c?c.name:null].filter(Boolean).join(" · ");
  // cap honesty (D125) survives the scoping: the pool and the note still describe the slot
  // a take really lands in, not the one whose section you clicked
  const land=g.mode==="take"?guideLandingSec(sec):sec;
  const cap=(land||sec).castMax;
  const h=el("div","gpsech");
  h.append(el("span","gpsecl",sec.label));
  h.append(el("span","gcnt"+(sec.done?" full":""),sec.have+" of "+sec.need));
  list.append(h);
  if(g.mode==="take"&&land!==sec)list.append(el("div","gphint",land
    ? "A pick taken here fills the still-open L"+land.lv+" slot first — that is where it lands."
    : "Every slot of this kind is filled. Click one you hold to drop it first."));
  if(g.mode==="place"&&sec.kind==="pick")list.append(gpickSlots(sec));
  // D134(a): in place mode the cap can hide some of the build's OWN picks — without one
  // quiet line the short list reads as the whole of it. The rule itself stands (D118(g)):
  // a too-high pick is never placeable here, it belongs in a later slot and drifts there.
  if(g.mode==="place"&&sec.kind==="pick"&&sec.pick!=="cantrip"&&cap){
    const over=(((state.chosen[sec.row]||{}).spells)||[])
      .map(k=>SPELL_BY[k]).filter(sp=>sp&&sp.level>cap).length;
    if(over)list.append(el("div","gphint",over+(over===1?" pick is":" picks are")
      +" above this slot's cap — they fit a later slot."));
  }
  const all=guideEligible(sec,g.mode,cap);
  const items=all.filter(sp=>!q||sp.name.toLowerCase().includes(q));
  shown=items.length;
  const held=g.mode==="place"
    ? new Set([((state.chosen[sec.row]||{})[sec.pick==="cantrip"?"cantrips":"spells"]||[])[guideTarget(sec)]].filter(Boolean))
    : sec.kind==="cpick" ? new Set(state.choices[sec.cid]||[])
    : new Set(((state.chosen[sec.row]||{})[sec.pick==="cantrip"?"cantrips":"spells"])||[]);
  gpickSection(list,sec,items,held,g.mode,q);
  $("#gpCount").textContent=shown+(shown===1?" spell":" spells");
  gpickFoot();
}
// the slots a reconstruct section owns, as the targets a placement lands in (D118(f,g)) —
// slot-level addressing, inside the modal where D130(c) put it
function gpickSlots(sec){
  const arr=sec.pick==="cantrip"?"cantrips":"spells";
  const cur=((state.chosen[sec.row]||{})[arr])||[];
  const box=el("div","gpslots");
  const t=guideTarget(sec);
  for(let p=sec.from;p<sec.to;p++){
    const k=cur[p], sp=k?SPELL_BY[k]:null;
    const b=el("button","gpslot"+(p===t?" on":"")+(sec.illAt&&sec.illAt.has(p)?" bad":""));
    b.append(el("span","n","slot "+(p-sec.from+1)));
    b.append(el("span","v",sp?sp.name:(k?String(k).split("|")[0]:"empty")));
    b.onclick=e=>{e.stopPropagation();GUIDE.place[guideSecKey(sec)]=p;renderGpick();};
    box.append(b);}
  return box;
}
// one section's list: eligible spells, grouped by castable level DESCENDING and
// collapsible (D126(f)); the fold key carries the section so the same level in two
// sections folds independently
function gpickSection(host,sec,items,held,mode,q){
  if(!items.length){
    const noList=sec&&sec.kind==="pick"&&(R.casters.find(r=>r.idx===sec.row)||{}).listUnknown;
    host.append(el("div","empty",q?"No eligible spell matches that name."
      :noList?listUnknownWhy(R.casters.find(r=>r.idx===sec.row))+" There is nothing to offer here."
      :mode==="place"?"This class holds no pick that could sit in these slots."
      :"Nothing legal is left to take here — widen your books in Sources, or skip the step."));
    return;}
  const byLvl={}; items.forEach(sp=>{(byLvl[sp.level]=byLvl[sp.level]||[]).push(sp);});
  // DESCENDING (D126(f)): the level you most want is the one you just unlocked
  const lvls=Object.keys(byLvl).map(Number).sort((a,b)=>b-a);
  const rows=l=>byLvl[l].sort((a,b)=>a.name.localeCompare(b.name))
    .map(sp=>gpickRow(sp,held,sec,mode));
  if(lvls.length<2)rows(lvls[0]).forEach(r=>host.append(r));
  else lvls.forEach(l=>{const grp=lvlGroup("gpick",l,byLvl[l].length,null,(sec?sec.id:"t")+"|"+l);
    rows(l).forEach(r=>grp.append(r)); host.append(grp);});
}
function gpickRow(sp,held,sec,mode){
  const k=key(sp.name,sp.source), on=held.has(k);
  const d=el("div","sp"+(on?" chosen":""));
  const nm=el("div","nm",sp.name); attachSpell(nm,sp); d.append(nm);
  const meta=el("div","meta");
  [ROMAN[sp.level],sp.school,cap1(sp.time),sp.range].filter(Boolean).forEach(x=>meta.append(el("span",null,x)));
  d.append(meta);
  const take=el("div","take"), b=el("button","tk ico-only"+(on?" on":""));
  b.append(icoEl(on?"check":"plus"));
  // a granted group has a hard count — a click past it does nothing, and a control that
  // silently does nothing has to say why
  const full=!on&&sec&&sec.kind==="cpick"&&sec.have>=sec.need;
  const lbl=mode==="trade"?"Trade it in"
    :mode==="place"?(on?"Already in this slot":"Place it in the selected slot")
    :on?"Picked — click to drop it"
    :full?"This group is full — drop one of its picks first":"Take it";
  if(full)b.classList.add("tkfull");
  b.title=lbl; b.setAttribute("aria-label",lbl);
  // a nested action stops its click: the commit re-renders this list, and a bubbling
  // event would land on the freshly-attached row
  b.onclick=e=>{e.stopPropagation(); gpickCommit(sec,k);};
  take.append(b); d.append(take); return d;
}
// the commit. Taking does NOT close the modal (D131(b) re-rejected auto-close: it takes the
// surface away mid-thought with nothing left to review) — the section may owe several picks
// and the footer counts them down; the footer button, ×, Escape and the backdrop close it.
// A TRADE is the exception: it is one pick by definition, and its card shows the result.
function gpickCommit(sec,k){
  const g=GPICK; if(!g)return;
  if(g.mode==="trade"){ guideTrade(g,k); closeGpick(); return; }
  if(!sec)return;
  if(g.mode==="place"){ guidePlace(sec,k); return; }   // saves + renders; position IS the answer
  if(sec.kind==="cpick"){
    let a=state.choices[sec.cid]||[];
    if(a.includes(k))a=a.filter(v=>v!==k);
    else if(a.length<sec.need)a=[...a,k];
    else return;                                   // the group is full — drop one first
    state.choices[sec.cid]=a;
    if(sec.choice&&sec.choice.mark&&a.includes(k))markTake(sec.choice,k);
    render(); return;}
  toggle(sec.row,k,sec.pick==="cantrip");          // the app's own take — it re-renders us
}
// D126(i): the empty-character entry. One card at the head of the character panel — the
// app's own card language, not a banner — offering the walk to a build that has nothing
// in it yet. It is gone the moment ANY answer lands, which is why it derives (`guideEmpty`)
// rather than carrying a dismissed bit: a build you emptied out gets the offer back.
function renderGuideCta(){
  const card=$("#guideCta"); if(!card)return;
  card.classList.toggle("hidden",!guideEmpty()||GUIDE.on);
}
// Record a trade through the timeline's OWN write (E3 · D119(b)): arm, then take.
// `toggle`'s intercept puts the replacement at the outgoing pick's POSITION — the
// acquisition history is preserved — and calls `recordSwap` for the event. One swap write
// path in the app, so the guide's card and the timeline's pill can never record different
// shapes, and neither one deletes anything.
function guideTrade(g,inKey){
  const arr=g.kind==="cantrip"?"cantrips":"spells";
  const cur=((state.chosen[g.row]||{})[arr])||[];
  if(inKey===g.out||!cur.includes(g.out)||cur.includes(inKey))return;
  if(swapAt(g.lv,g.kind))return;              // one event per kind per level (D128)
  SWAPARM={row:g.row,kind:g.kind,out:g.out,level:g.lv,label:g.outName};
  toggle(g.row,inKey,g.kind==="cantrip");     // records the swap, disarms, saves, renders
  if(SWAPARM){SWAPARM=null;render();}         // the intercept always fires here; belt and braces
}

// ── custom spell sources (D55) ─────────────────────────────────────────────
// A named thing the character OWNS that grants spells — a magic item, a boon, a
// blessing. Lives inside the build (it travels with export), and resolves through
// the same grants machinery as a species or feat: no new downstream paths.
// Two labels per unit: the SHORT one fits a fixed-width control on a crowded spell row
// ("/LR"), the long one reads as prose in the summary sentence ("per long rest").
const CSRC_UNITS=[["lr","per long rest","/LR"],["sr","per short rest","/SR"],
                  ["dawn","per dawn","/dawn"],
                  // D95 gap 2: uses that NEVER come back. 5etools calls this `limited`
                  // ("Once the spell has been cast three times, the bracelet can no longer
                  // cast it"); every other unit here recharges, so there was no way to say it.
                  ["total","in total","total"],
                  ["will","at will","at will"]];
const csrcUnitShort=u=>((CSRC_UNITS.find(x=>x[0]===u)||[])[2])||u;
const CSRC_MODES=[["innate","cast without preparing"],["always","always prepared"],
                  ["list","added to my spell list"]];
function csrcCadence(e){ if(e.unit==="will")return "at will";
  const n=Math.max(1,e.count||1);
  if(e.unit==="total")return n===1?"once only":`${n} times total`;
  const u=(CSRC_UNITS.find(x=>x[0]===e.unit)||[])[1]||e.unit;
  return n===1?u:`${n}× ${u}`;}
// D95 gap 1: how a spell is PAID FOR belongs to the spell, not the source.
// D65 made it a source-level either/or — a shared pool of charges OR per-spell uses — but real
// items mix them freely: Demonomicon of Iggwilv casts Tasha's Hideous Laughter at will AND
// spends an 8-charge pool; Crook of Rao has a 6-charge pool AND Gate once ever. 38 items in the
// 5etools corpus carry more than one budget. A source-level enum also starts LYING the moment
// one spell differs, which is the folded-state-disagrees-with-reality problem D94 removed.
// A source now simply HAS a charge pool or doesn't (`pool`), and each spell says how it pays.
// Legacy sources carry `uses` and no per-spell `pay`; they are read, never rewritten in place.
function csrcPay(cs,e){
  if(e&&(e.pay==="pool"||e.pay==="per"))return e.pay;
  if(cs.uses==="pool"||cs.uses==="per")return cs.uses;      // pre-D95 shape
  return cs.pool!=null&&cs.pool!==""?"pool":"per";
}
const csrcHasPool=cs=>cs.pool!=null&&cs.pool!=="";
function csrcRecharge(cs,e){
  if(cs.mode==="always")return "always prepared";
  if(csrcPay(cs,e)==="pool"){const n=Math.max(1,e.cost||1);return `${n} charge${n>1?"s":""}`;}
  return csrcCadence(e);
}
// D96: an entry is either a NAMED spell (`key`) or a CHOICE from a filtered list (`pick`).
// Silverquill Primer — "choose one 1st-level spell from the bard or cleric spell list… cast it
// once before your next long rest" — is the second kind, and 5etools models none of it
// (`attachedSpells: null`), so it can only ever be hand-authored. The grants tree already had
// `picks`, filterSpells already split `class`/`school`/`level` on ";", and the choices panel
// already renders them; a custom source simply never emitted any.
// D96b: WHEN you may re-choose is a different clock from how often you may CAST. Silverquill
// Primer happens to use a long rest for both, but they are independent — "choose at dawn, cast
// twice per long rest" is a legal item, and a choice you can never change is legal too. The
// app's own `swappable` is derived from grant kind and can't express any of this; a custom
// source can simply be told.
const CSRC_SWAP=[["","chosen once — can't be changed"],["lr","re-chosen on a long rest"],
                 ["sr","re-chosen on a short rest"],["dawn","re-chosen at dawn"],
                 ["level","re-chosen when you gain a level"]];
const csrcSwapText=v=>((CSRC_SWAP.find(x=>x[0]===(v||""))||[])[1])||"";
const csrcIsPick=e=>!!(e&&e.pick);
// rows are keyed by the spell key, but a pick has none — it carries its own id instead
const csrcRowId=e=>e.key||e.id||"";
function csrcPickFilter(e){
  const p=e.pick||{}, f={};
  if(p.level)f.level=p.level; if(p.class)f.class=p.class; if(p.school)f.school=p.school;
  return f;
}
// The row label is a terse spec ("choose a spell · level 1st · Bard or Cleric list"); the
// SUMMARY needs the same fact as English, because "cast choose a spell · level 1st …" is not a
// sentence. Two renderings of one thing, deliberately.
function csrcPickPhrase(e){
  const p=e.pick||{};
  const n=Math.max(1,p.take||1);
  const lv=String(p.level||"").split(";").filter(Boolean)
    .map(x=>+x===0?"cantrip":ROMAN[+x]).join(" or ");
  const cl=String(p.class||"").split(";").filter(Boolean).join(" or ");
  const sc=String(p.school||"").split(";").filter(Boolean)
    .map(s=>SCHOOL_ABBR[s]||s).join(" or ");
  let out=`choose ${n>1?n+" ":"a "}`;
  if(lv)out+=(lv==="cantrip"?"cantrip":lv+"-level")+" ";
  out+=(sc?sc+" ":"")+(n>1?"spells":"spell");
  if(cl)out+=` from the ${cl} list`;
  if(p.swap)out+=` (${csrcSwapText(p.swap)})`;
  else if(p.swap==="")out+=" (chosen once)";
  return out;
}
function csrcPickDesc(e){
  const p=e.pick||{}, bits=[];
  const lv=String(p.level||"").split(";").filter(Boolean)
    .map(n=>+n===0?"cantrip":ROMAN[+n]).join(" or ");
  if(lv)bits.push("level "+lv);
  const cl=String(p.class||"").split(";").filter(Boolean).join(" or ");
  if(cl)bits.push(cl+" list");
  const sc=String(p.school||"").split(";").filter(Boolean)
    .map(s=>SCHOOL_ABBR[s]||s).join(" or ");
  if(sc)bits.push(sc);
  const n=Math.max(1,p.take||1);
  // the swap clause rides the DESC, so it reaches the Choices panel — which is the one place
  // you are actually deciding, and therefore the one place "when can I change this?" matters
  const sw=csrcSwapText(p.swap);
  return `choose ${n>1?n+" spells":"a spell"}`+(bits.length?" · "+bits.join(" · "):" — any spell")
    +(p.swap==null?"":" · "+sw);
}
function customSourceGrants(cs){
  const extraOf=cs=>{const x={};
    if(cs.dc)x.dc=cs.dc; if(cs.atk)x.atk=cs.atk; return x;};
  const picks=(cs.spells||[]).filter(csrcIsPick).map(e=>{
    const x=extraOf(cs); if(e.level)x.castLv=+e.level; x.csrc=cs.name;
    return {kind:cs.mode==="always"?"prepared":"innate",atLevel:0,
            recharge:csrcRecharge(cs,e),count:Math.max(1,(e.pick||{}).take||1),
            filter:csrcPickFilter(e),desc:csrcPickDesc(e),
            feature:cs.name,note:e.note||null,extra:x};});
  const fixed=(cs.spells||[]).filter(e=>!csrcIsPick(e)).map(e=>{const sp=SPELL_BY[e.key]; if(!sp)return null;
    const extra={};
    if(cs.dc)extra.dc=cs.dc;
    if(cs.atk)extra.atk=cs.atk;
    if(e.level)extra.castLv=+e.level;
    extra.csrc=cs.name;
    // a per-spell note rides the grant like a feature's own modification note (D79), so it
    // reaches the spell modal and the table's source badge with no new path
    return {kind:cs.mode==="always"?"prepared":"innate",atLevel:0,
            recharge:csrcRecharge(cs,e),note:e.note||null,
            spell:{name:sp.name,source:sp.source},feature:cs.name,extra};}).filter(Boolean);
  return {fixed,picks,expansions:[],optionGroups:[],
          ability:cs.ability?{fixed:cs.ability}:null};
}
// a one-line description of how the source is powered, for its chip and the casts list.
// A source may now carry BOTH a pool and spells on their own uses (D95), so this names both.
function csrcPower(cs){
  if(cs.mode==="always")return "always prepared";
  if(cs.mode==="list")return "added to your spell list";
  const own=(cs.spells||[]).filter(e=>csrcPay(cs,e)==="per").length;
  if(!csrcHasPool(cs))return "per-spell uses";
  const pool=`${cs.pool} charges`+(cs.recharge?" · regains "+cs.recharge:"");
  return own?`${pool} · ${own} spell${own===1?" on its":"s on their"} own uses`:pool;
}

// ── compute ──────────────────────────────────────────────────────────────
// Every source's grants and choices, in one pass. Lifted out of `compute()` (G2) because
// the guided page needs the SAME resolver over the FULL build while the character view is
// previewing a slice — a chain that loses its choice rows when you glance at an earlier
// level is not a chain. Two callers, one walk: a second hand-rolled copy here is exactly
// the drift the extractors' "both or neither" rule exists to stop.
// `feats`/`optFeats` are passed in rather than read from `featsAt()`/`optFeatsAt()` — those
// read PREVIEW, and that is the one thing the two callers must disagree about.
function collectGrants(records,casters,charLevel,feats,optFeats,sharedStat){
  const gout={fixed:[],freeCasts:[],expansions:[],choices:[],marks:[]};
  const recExp={};   // rowId -> [expansion filters] (Magical-Secrets style)
  records.forEach(r=>{
    const o={fixed:[],freeCasts:[],expansions:[],choices:[],marks:[]};
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
      const bowner=ownerOf("c"+r.idx,r.name,r.c.source);
      o.choices.push({id:oid,type:"option",options:[otherOrder,cantripOrder],value:sel,giver:feat,giverSrc:r.c.source,owner:bowner,atLevel:bc.atLevel||1});
      if(sel===cantripOrder){
        o.choices.push({id,type:"pick",count:bc.count,filter:bc.filter,kind:"known",recharge:"cantrip",giver:feat+" · "+cantripOrder,giverSrc:r.c.source,desc:"choose a cantrip",optional:bc.optional,owner:bowner,atLevel:bc.atLevel||1});
        (state.choices[id]||[]).forEach(k=>{const rec=SPELL_BY[k];if(rec)o.freeCasts.push({name:rec.name,level:rec.level,recharge:"always known",src:feat+" · "+cantripOrder,ability:rAb});});
      }
    });
    recExp[r.idx]=o.expansions;
    // tag class-owned grants with the row they came from — a subclass's always-prepared
    // spells and a class feature's free casts belong to that class, not to a source of
    // their own, which is what lets the table fold Light Domain back into Cleric
    o.fixed.forEach(g=>g.srcIdx=r.idx);
    o.freeCasts.forEach(g=>{if(g.srcIdx==null)g.srcIdx=r.idx;});
    gout.fixed.push(...o.fixed);gout.freeCasts.push(...o.freeCasts);gout.choices.push(...o.choices);
    gout.marks.push(...o.marks);
  });
  // sliced (E2): a feat or optional feature the build only acquires above the view
  // level doesn't exist yet there — its grants, choices and forms come with it
  feats.forEach(fk=>{const f=FEAT_BY[baseKey(fk)];if(f)resolveGrants(f.grants,charLevel,"f"+fk,f.name,gout,sharedStat,f.source);});
  // An optional feature is resolved outside the caster loop (a feat can grant one too), so
  // its owner is found by which class's progression opened the slot it fills — that is what
  // makes a Warlock's invocation spells part of Warlock. Tag by range rather than resolving
  // into a private bucket: `resolveGrants` also fills expansions and choices, and rerouting
  // those would change more than grouping.
  const optOwner=o=>{let idx=null;
    casters.forEach(r=>[r.c,r.sub].filter(Boolean).forEach(sc=>
      (sc.optFeatures||[]).forEach(pr=>{ if(pr.types.some(t=>(o.types||[]).includes(t)))idx=r.idx; })));
    return idx;};
  optFeats.forEach(ok=>{const o=OPT_BY[baseKey(ok)];if(!o)return;
    const f0=gout.fixed.length,c0=gout.freeCasts.length,h0=gout.choices.length;
    resolveGrants(o.grants,charLevel,"o"+ok,o.name,gout,sharedStat,o.source);
    const own=optOwner(o); if(own==null)return;
    for(let i=f0;i<gout.fixed.length;i++)if(gout.fixed[i].srcIdx==null)gout.fixed[i].srcIdx=own;
    for(let i=c0;i<gout.freeCasts.length;i++)if(gout.freeCasts[i].srcIdx==null)gout.freeCasts[i].srcIdx=own;
    // a designation (D135) names a cantrip of the class whose progression opened this slot —
    // the same "which class does this invocation belong to" answer the grants above use. It
    // is what lets designating a cantrip you HAVEN'T got take it on that row (Francesco's
    // call: a shortcut to the pick, never a bonus cantrip beside it).
    for(let i=h0;i<gout.choices.length;i++)if(gout.choices[i].mark&&gout.choices[i].rowIdx==null)gout.choices[i].rowIdx=own;});
  if(state.speciesKey){const sp=RACE_BY[state.speciesKey];if(sp)resolveGrants(sp.grants,charLevel,"r",sp.name,gout,sharedStat,sp.source);}
  (state.customSources||[]).forEach(cs=>{
    if(cs.mode==="list")return;          // not a grant — it widens the eligible pool below
    resolveGrants(customSourceGrants(cs),charLevel,"x"+cs.id,cs.name,gout,sharedStat,null);});
  return {gout,recExp};
}
function compute(){
  const eff=previewLevels();
  // a class not yet taken at the preview level simply isn't there — its picks are
  // kept in state and come back the moment the preview releases
  const rows=eff?state.classes.map(r=>({...r,level:eff.get(r.id)||0})).filter(r=>r.level>0)
                :state.classes;
  const records=rows.map(resolveRow).filter(Boolean);
  const casters=records.filter(r=>r.caster);
  const charLevel=eff?PREVIEW.level:state.classes.reduce((a,r)=>a+r.level,0);
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
  // resolve every source's grants + choices, at the level the VIEW is standing on
  const {gout,recExp}=collectGrants(records,casters,charLevel,featsAt(),optFeatsAt(),sharedStat);

  // eligible pool = each caster's own list + its active expansions
  const pool=new Map(); // spellKey -> {sp,takers:[{idx,name,cantrip}],grants:[],srcs:Set}
  const want=sp=>{const k=key(sp.name,sp.source);let e=pool.get(k);if(!e){e={sp,takers:[],grants:[],srcs:new Set(),always:new Set()};pool.set(k,e);}return e;};
  casters.forEach(r=>{
    // no own list (D130: the data doesn't name one) → no own-list access, and nothing can
    // be "off" a list you haven't got: whatever the record's own expansions DO name is
    // the whole of its access, and the budget card says the list is unknown
    const ownCls=r.listClass?r.listClass[0].toLowerCase():null;
    const access=ownCls?[{cls:ownCls,levels:null,off:false}]:[];
    (recExp[r.idx]||[]).forEach(f=>{const lv=f.level!=null?new Set(String(f.level).split(";").map(Number)):null;
      (f.class?f.class.split(";"):[]).forEach(cn=>{const c=cn.trim().toLowerCase();access.push({cls:c,levels:lv,off:!!ownCls&&c!==ownCls});});});
    DATA.spells.forEach(sp=>{ if(!visible(sp))return; if(sp.level>r.maxLvl)return;
      for(const a of access){ if(a.levels&&!a.levels.has(sp.level))continue;
        if(sp.cls.some(([cn,cs])=>cn.toLowerCase()===a.cls&&srcOn(cs))){ const e=want(sp); e.takers.push({idx:r.idx,name:r.name,cantrip:sp.level===0}); if(a.off)e.srcs.add("Magical Secrets"); break; } }
    });
  });
  // "added to my spell list" (D65): eligible to prepare with any caster that can reach
  // its level — it costs a prepared slot like anything else on your list
  (state.customSources||[]).filter(cs=>cs.mode==="list").forEach(cs=>{
    (cs.spells||[]).forEach(e=>{const sp=SPELL_BY[e.key]; if(!sp||!visible(sp))return;
      const en=want(sp);
      casters.forEach(r=>{ if(sp.level>r.maxLvl)return;
        if(!en.takers.some(t=>t.idx===r.idx))
          en.takers.push({idx:r.idx,name:r.name,cantrip:sp.level===0});});
      en.srcs.add(cs.name);});});

  // fixed grants become always-prepared/free picks in the pool
  const freeCasts=gout.freeCasts;
  // the pool keeps a REDUCED copy of each grant — `srcIdx` has to come along or the table
  // cannot tell that Light Domain's always-prepared spells belong to Cleric (D104)
  gout.fixed.forEach(g=>{const e=want(g.rec);e.srcs.add(g.src);if(!e.grants.some(x=>x.src===g.src))e.grants.push({src:g.src,recharge:g.recharge,ability:g.ability,note:g.note,srcIdx:g.srcIdx});
    if(g.srcIdx!=null)e.always.add(g.srcIdx);});   // its own class can't re-prepare an always-prepared spell
  freeCasts.forEach(fc=>{const rec=grantRec(fc.name);if(rec){want(rec).srcs.add(fc.src);}});
  const choices=gout.choices;

  // caps per record + cart validation
  const caps={}; casters.forEach(r=>caps[r.idx]=capsFor(r));
  const cart={};
  casters.forEach(r=>{ const ch=sliceChosen(r.row);   // the view's lists (E2) — raw when not previewing
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
    } else if(cp){ /* filled in below — the ceiling may be narrowed by Magical Secrets */ }
    // Magical-Secrets style expansion: spells drawn from OTHER lists are capped
    // at (prepared gained since the feature) + (retrains since the feature).
    // Only genuine other-list expansions count — a subclass whose expansion is
    // its own list (e.g. Eldritch Knight → Wizard) is NOT Magical Secrets. With no own
    // list at all (D130) there is nothing to be off, so the analysis is skipped whole —
    // calling every expansion "off-list" would cap a record against a budget it hasn't got.
    const ownCls=r.listClass?r.listClass[0].toLowerCase():null;
    const offExps=!ownCls?[]:(recExp[r.idx]||[]).filter(f=>String(f.class||"").split(";").some(cn=>{const c=cn.trim().toLowerCase();return c&&c!==ownCls;}));
    let ms=null,capAdj=null;
    if(offExps.length && r.prepArr){
      const offItems=spItems.filter(sp=>!sp.cls.some(([cn,cs])=>cn.toLowerCase()===ownCls&&srcOn(cs)));
      const offCount=offItems.length;
      const onset=Math.max(1,Math.min(...offExps.map(f=>f._atLevel||1)));
      const before=onset>=2?(r.prepArr[onset-2]||0):0;
      const newSince=Math.max(0,(r.prepArr[r.level-1]||0)-before);
      const retrains=Math.max(0,r.level-onset+1);
      const cap=Math.min(r.prepared,newSince+retrains);
      // An off-list spell can only have been taken from `onset` on — that is the whole
      // point of the feature. So every off-list spell you hold BELOW level L has spent one
      // of the acquisition events at levels >= onset, and those are the same events that
      // buy you spells at level L. Best case they are the EARLIEST such events (the window
      // between onset and the level you first got L-level slots); anything past that window
      // comes out of the level-L capacity itself. Two consequences worth knowing:
      //   • one off-list 1st-level spell costs you one slot of "spells at level >= 2",
      //     because it can't have been learned before you had the feature;
      //   • it does NOT cost you 8th-level capacity unless your off-list picks outnumber
      //     the events between the feature and your first 8th-level slot — the tool reports
      //     the BEST case (D18), and best case is that you took it the level you could.
      let weighs=0;
      if(cp&&cp.static&&offCount){
        capAdj={};
        const priorAt=k=>k>=2?(r.prepArr[k-2]||0):0;
        for(let L=1;L<=cp.maxL;L++){
          let first=r.level; for(let k=1;k<=r.level;k++){if(maxLvlAt(r.caster,k)>=L){first=k;break;}}
          const early=Math.max(0,priorAt(first)-priorAt(onset))+Math.max(0,first-onset);
          const offBelow=offItems.filter(sp=>sp.level<L).length;
          const pen=Math.max(0,offBelow-early);
          if(pen>weighs)weighs=pen;
          capAdj[L]=Math.max(0,(cp.cap[L]!=null?cp.cap[L]:cp.total)-pen);
        }
      }
      ms={offCount,cap,onset,over:offCount>cap,weighs};
    }
    if(!(known&&known.book)&&cp){ let ge=0;
      for(let L=cp.maxL;L>=1;L--){ ge+=spItems.filter(sp=>sp.level===L).length;
        const capL=(capAdj&&capAdj[L]!=null)?capAdj[L]:(cp.cap[L]!=null?cp.cap[L]:cp.total);
        if(ge>capL)overLevels[L]=true; }
      if(spItems.some(sp=>sp.level>cp.maxL))overLevels[cp.maxL+1]=true;
    }
    const spellCap=known?known.total:r.prepared;
    cart[r.idx]={cantrips:ch.cantrips||[],spells:ch.spells||[],prep:ch.prep||[],caps:cp,ms,known,capAdj,
      cantOver:(ch.cantrips||[]).length>r.cantrips, spellOver:(ch.spells||[]).length>spellCap, overLevels};
  });

  return {records,casters,charLevel,mcSlots,mcLevel,pactRec,pool,freeCasts,caps,cart,choices,sharedStat,
          marks:gout.marks};
}

// ── toggling picks ───────────────────────────────────────────────────────
// `arr` is "cantrips" | "spells" | "prep". A wizard is the one caster where the last two
// differ: `spells` IS the spellbook (what it knows) and `prep` is the daily subset drawn
// from it (D62). For every other caster `prep` is unused — picking IS preparing.
function toggle(idx,spellKey,cantrip,which){
  const ch=state.chosen[idx]=state.chosen[idx]||{cantrips:[],spells:[]};
  const arr=which||(cantrip?"cantrips":"spells");
  ch[arr]=ch[arr]||[];
  const i=ch[arr].indexOf(spellKey);
  // an armed swap intercepts the next take for its row and kind (E3 · D115(g)): the
  // outgoing pick's POSITION keeps its acquisition history, the event records the trade
  if(SWAPARM&&SWAPARM.row===idx&&arr===(SWAPARM.kind==="cantrip"?"cantrips":"spells")
     &&i<0&&spellKey!==SWAPARM.out){
    const p=ch[arr].indexOf(SWAPARM.out);
    if(p>=0){
      ch[arr][p]=spellKey;
      recordSwap(SWAPARM.level,SWAPARM.kind,{row:idx,out:SWAPARM.out,in:spellKey});
      SWAPARM=null; save(); render(); return;
    }
    SWAPARM=null;   // the outgoing pick vanished meanwhile — disarm, fall through to a plain take
  }
  // NO WALK INTERCEPT HERE (G4 · F1/F2/F4). Reverse placement (D118(f,g)) is written by
  // `guidePlace`, called explicitly from the guide's own pick modal — see the note above
  // it. An ambient `GUIDE.reverse` test in this shared writer hijacked every other surface
  // that takes or drops a pick, the prepare-daily modal's `arr==="prep"` included.
  const L=PREVIEW.level;
  // standing at a previewed level, the order is load-bearing (E2 · D115(d)): an add
  // inserts at L's slice point (the earliest open schedule slot — best case, D18); a
  // click on a pick the build only acquires LATER pulls it back to that point instead
  // of silently deleting it from a list where it never showed
  if(L!=null&&arr!=="prep"){
    const row=state.classes.find(r=>r.id===idx);
    // a swapped-out display entry isn't in the array — editing it means editing the
    // swap event, which is E3's surface; refuse rather than corrupt the chain
    if(i<0&&swapEvents().some(e=>e.lvl>L&&e.row===idx
       &&e.kind===(arr==="cantrips"?"cantrip":"spell")&&e.out===spellKey))return;
    const at=row?sliceInsertAt(row,arr,L):ch[arr].length;
    if(i>=at){ ch[arr].splice(i,1); ch[arr].splice(at,0,spellKey); save(); render(); return; }
    if(i<0){ ch[arr].splice(at,0,spellKey); save(); render(); return; }
  } else if(i<0){ ch[arr].push(spellKey); save(); render(); return; }
  // i>=0 within the visible slice (or not previewing): a plain removal, at every level
  ch[arr].splice(i,1);
  // dropping a spell from the book must not leave it prepared
  if(arr==="spells"&&ch.prep){const j=ch.prep.indexOf(spellKey);if(j>=0)ch.prep.splice(j,1);}
  save(); render();
}
// D135 · designating a spell you HAVEN'T got is a SHORTCUT to taking it, never a bonus
// beside it (Francesco's call): it lands in the owning class's own list and spends one of
// that class's slots, exactly as picking it on the page would. Dropping the designation
// afterwards leaves the pick where it is — it is a real pick now, and this writer never
// deletes one. `rowIdx` is the class whose progression opened the feature's slot; a
// designation from a feat has none, so any row that can take the spell stands in.
function markTake(c,k){
  const sp=SPELL_BY[k]; if(!sp)return;
  const arr=sp.level===0?"cantrips":"spells";
  let idx=c&&c.rowIdx;
  if(idx==null||!state.classes.some(r=>r.id===idx)){
    const e=R&&R.pool&&R.pool.get(k), t=e&&e.takers&&e.takers[0];
    idx=t?t.idx:null;}
  if(idx==null)return;
  const ch=state.chosen[idx]=state.chosen[idx]||{cantrips:[],spells:[]};
  ch[arr]=ch[arr]||[];
  if(ch[arr].indexOf(k)>=0)return;               // already yours — the designation is all
  const row=state.classes.find(r=>r.id===idx);
  const at=(PREVIEW.level!=null&&row)?sliceInsertAt(row,arr,PREVIEW.level):ch[arr].length;
  ch[arr].splice(at,0,k);
}
function removeChosen(idx,spellKey){ const ch=state.chosen[idx];if(!ch)return;
  ["cantrips","spells","prep"].forEach(a=>{if(!ch[a])return;const i=ch[a].indexOf(spellKey);if(i>=0)ch[a].splice(i,1);});save();render(); }

// ── render ───────────────────────────────────────────────────────────────
let R=null, curTab="build";
function render(){ maybeOnboard(); renderGapBar(); CASTMODS=activeCastMods(); R=compute(); R.health=buildHealth();
  R.gsteps=GUIDE.on?guideSteps():[];     // the guided chain follows every change too (F2)
  guideSync();
  renderChoices(); renderSlots(); renderCart(); renderSpells(); renderFeatBudget(); renderJumpBar(); renderBuildSwitch(); renderSwapArm(); renderGuide(); renderGuideCta();
  // The optional-feature slots are a pure function of class levels, feats and PREVIEW — a
  // derived view like the ones above, not a control. It used to run only inside refreshAll(),
  // while the class row's own handlers (swap class, subclass, level stepper, remove) and
  // #addClass call renderClassRows()+render() instead — so the block kept the PREVIOUS
  // level's cap: stepping a Warlock 2 → 1 left it reading "0/3" where the truth was 0/1.
  // It belongs here rather than in those handlers because it holds no <select>, <input> or
  // disclosure to lose under the user's fingers — which is the whole reason the rest of
  // refreshAll() is kept OUT of the render pass.
  renderOptFeats();
  if(GPICK)renderGpick();                // the open pick modal follows every change (G3)
  if(TL.open)renderTimeline();           // the open timeline follows every change (E5)
  if(curTab==="table")renderTable(); save(); }

// ── choices panel ──────────────────────────────────────────────────────────
// What KIND of thing granted a run of choices, as a subtitle under its name rather than
// a tag competing with the book chip. A feat also names its own TYPE — "feat" alone
// doesn't say which of your slots it came out of.
const FEAT_TYPE={origin:"origin feat",general:"general feat",epic:"epic boon"};
function ownerCat(o){
  if(!o||o.kind!=="feat")return (o&&o.kind)||"";
  const f=FEAT_BY[key(o.name,o.src)];
  if(!f)return "feat";
  if(isFeatFS(f))return "fighting style";
  // a book's own category names itself better than the slot it happens to fill: "wild
  // talent" says more than "origin feat", which is the whole point of D67's type line
  const cat=featCatId(f);
  if(cat==="O"||cat==="EB"||GENERAL_CATS.has(cat))return FEAT_TYPE[featSlot(f)]||"feat";
  return lc(featCatLabel(f));
}
function renderChoices(){
  const card=$("#choicesCard"), body=$("#choicesBody"); body.innerHTML="";
  const ch=R.choices;
  card.classList.toggle("hidden",!ch.length);
  const pending=ch.filter(c=>c.type==="pick"&&!c.optional&&(state.choices[c.id]||[]).length<c.count).length;
  $("#choicesChip").textContent = ch.length? (pending?`${pending} pending`:"all set"):"";
  // group by the entity that granted them, in first-seen order (D30)
  const groups=[]; const byId=new Map();
  ch.forEach(c=>{const o=c.owner||{id:c.id,name:c.giver,src:c.giverSrc,kind:""};
    let g=byId.get(o.id); if(!g){g={owner:o,items:[]};byId.set(o.id,g);groups.push(g);}
    g.items.push(c);});
  // EVERY giver is a group, even a single-choice one (D43) — one choice used to be a
  // bare row and two a bordered box, so the same thing had two treatments.
  groups.forEach(g=>{
    const box=el("div","choicegroup");
    const h=el("div","cghead");
    h.append(el("b",null,g.owner.name));
    // a repeatable feat/invocation taken more than once is several groups with ONE name
    // (D135) — the copy's ordinal is what tells them apart, exactly as on its chip
    const rep=/##(\d+)$/.exec(String(g.owner.id||""));
    if(rep)h.append(el("span","chipn","#"+rep[1]));
    if(g.owner.src)h.append(bookChip(g.owner.src,ownerPage(g.owner)));
    h.append(el("span","cgn",g.items.length===1?"1 choice":`${g.items.length} choices`));
    const cat=ownerCat(g.owner);
    if(cat)h.append(el("div","cgcat",cat));   // inside the head, so it sits above its rule
    box.append(h);
    // the granting FEATURE, named once per run — it used to repeat on the first two
    // rows and then vanish, which read as though later rows came from nowhere
    let lastSub=null;
    g.items.forEach(c=>{
      const sub=(c.giver&&c.owner&&c.giver!==c.owner.name)
        ? c.giver.replace(g.owner.name+" · ","") : "";
      if(sub!==lastSub){ if(sub)box.append(el("div","cgsub",sub)); lastSub=sub; }
      box.append(choiceRow(c));
    });
    body.append(box);
  });
}
// one choice: what it asks for on the left, its control on the right, one line.
// The giver is the group's job (cghead) and the feature is cgsub's — never repeated here.
function choiceRow(c){
  const row=el("div","choicerow");
  if(c.type==="option"||c.type==="ability"){
    const isAb=c.type==="ability";
    const cg=el("div","cg");
    cg.append(el("span","cwhat",isAb?"Casting ability":"Choose one"));row.append(cg);
    const sel=el("select"); c.options.forEach(o=>sel.append(new Option(isAb?ABIL[o]||o:o,o)));
    sel.value=c.value; sel.onchange=()=>{state.choices[c.id]=sel.value; render();}; row.append(sel);
  } else { // pick
    const have=(state.choices[c.id]||[]).length;
    const cg=el("div","cg");
    const what=el("span","cwhat");what.append(document.createTextNode(cap1(guidePickAsk(c)||fmtDesc(c.desc)||"choose")+" "));
    what.append(el("span","need",`${have}/${c.count}`));cg.append(what);row.append(cg);
    const picks=el("div","picks");
    (state.choices[c.id]||[]).forEach(k=>{const sp=SPELL_BY[k];if(!sp)return;
      const chip=el("span","cartchip");chip.append(el("span","lv",sp.level===0?"C":String(sp.level)));
      const nm=el("span",null,sp.name);attachSpell(nm,sp);chip.append(nm);
      const x=xBtn(null,()=>{state.choices[c.id]=(state.choices[c.id]||[]).filter(v=>v!==k);render();});
      chip.append(x);picks.append(chip);});
    const btn=el("button","pickbtn"+(have>=c.count?" done":" needclr"),
      have>=c.count?(c.mark?"Change":"Edit"):(c.mark?"Designate":`Choose ${c.count-have}`));
    btn.onclick=()=>openPick(c); picks.append(btn); row.append(picks);
  }
  return row;
}

// ── folded level groups (both spell lists) ─────────────────────────────────
// Module state, per session: a fold is a view of a list, never part of a build, so it must
// never reach a stored blob. Folding hides the rows with a class rather than re-rendering —
// a rebuild would detach the click's own target (E5) and throw the scroll position away.
const FOLDED={spells:new Set(),pick:new Set(),gpick:new Set()};
// The header IS the control, and it keeps naming what it holds while closed (D94). Its own
// tools hang off it as SIBLINGS of the fold button: a button may not contain a button.
// `foldId` lets one scope hold several independent lists of the same level — the guide's
// multi-section pick modal shows "1st level" under two different groups (D130(d)), and
// folding one must not fold the other.
function lvlGroup(scope,l,n,tools,foldId){
  const set=FOLDED[scope], fid=foldId==null?l:foldId;
  const g=el("div","lvlgroup");
  const h=el("h3");
  const fold=el("button","lvlfold");fold.type="button";
  fold.append(el("span",null,l===0?"Cantrips":ROMAN[l]+" level"));
  fold.append(el("span","n",String(n)));
  const car=el("span","lvlcar");fold.append(car);
  const sync=off=>{g.classList.toggle("folded",off);car.classList.toggle("up",!off);
    fold.setAttribute("aria-expanded",String(!off));
    fold.title=(off?"Show ":"Hide ")+(l===0?"cantrips":ROMAN[l]+"-level spells");};
  sync(set.has(fid));
  fold.onclick=()=>{const off=!set.has(fid); off?set.add(fid):set.delete(fid); sync(off);};
  h.append(fold); if(tools)h.append(tools); g.append(h);
  return g;}

// ── spell-pick modal ───────────────────────────────────────────────────────
let PICK=null;
// every opener starts from an unfolded list: this picker serves a different choice each
// time, and a level folded in the last one would hide spells with nothing on screen to
// explain why (the same reason the custom-source disclosures reset on open, D94)
function openPick(choice){ FOLDED.pick.clear(); PICK={...choice,levelSet:new Set(),onlyPicked:false}; $("#pickSearch").value="";
  // a designation names a spell rather than granting one, so it never says "Choose 1 spell"
  $("#pickTitle").textContent=choice.mark?"Designate a spell"
    :"Choose "+choice.count+(choice.count>1?" spells":" spell");
  const ask=guidePickAsk(choice)||fmtDesc(choice.desc);
  $("#pickSub").textContent=choice.giver+(ask?" · "+cap1(ask):"");
  $("#pickModal").classList.remove("hidden"); renderPickList(); }
// Magical Secrets: the same one-click add the wizard's spellbook has, scoped to the lists
// the feature opens up rather than to a spell level (D80).
function openOffListPick(idx){
  const rec=R.casters.find(r=>r.idx===idx); if(!rec)return;
  FOLDED.pick.clear();
  PICK={classIdx:idx,maxLevel:rec.maxLvl,offList:true,levelSet:new Set(),onlyPicked:false};
  $("#pickSearch").value="";
  $("#pickTitle").textContent=classLabel(rec)+" — Magical Secrets";
  const c=R.cart[idx];
  $("#pickSub").textContent=`spells from other lists · ${(c.ms&&c.ms.offCount)||0} of ${(c.ms&&c.ms.cap)||0} used`;
  $("#pickModal").classList.remove("hidden"); renderPickList(); }
// prepare-by-level: click a level tile → prepare from that class's eligible spells (levels 1..maxLevel)
function openLevelPick(idx,maxLevel){ const rec=R.casters.find(r=>r.idx===idx); if(!rec)return;
  FOLDED.pick.clear();
  PICK={classIdx:idx,maxLevel,levelSet:new Set(),onlyPicked:false}; $("#pickSearch").value="";
  // the set being edited is the SPELLBOOK for a wizard and the KNOWN list for a level-swap
  // caster — calling either "prepare" contradicts the D20/D62 vocabulary the cards use
  const v=pickVerbs(idx,rec);
  $("#pickTitle").textContent=classLabel(rec)+" — "+v.title;
  $("#pickSub").textContent=`Level 1–${ROMAN[maxLevel]} · ${v.sub}`;
  $("#pickModal").classList.remove("hidden"); renderPickList(); }
// one vocabulary per caster kind, everywhere the by-level picker speaks (D20/D62)
function pickVerbs(idx,rec){ const c=R.cart[idx];
  return c&&c.known?{title:"Spellbook",sub:"click to add or remove from your book",n:"In your book",
      on:"In your book — click to remove",off:"Add it to your spellbook"}
    :(rec||{}).static?{title:"Known spells",sub:"click to learn or drop",n:"Known",
      on:"Known — click to drop",off:"Learn it"}
    :{title:"Prepare spells",sub:"click to prepare or unprepare",n:"Prepared",
      on:"Prepared — click to unprepare",off:"Prepare it"};}
function renderPickList(){
  const list=$("#pickList"); list.innerHTML="";
  const q=$("#pickSearch").value.toLowerCase(), isClass=PICK.classIdx!=null;
  let base = isClass
    ? [...R.pool.values()].filter(e=>e.takers.some(t=>t.idx===PICK.classIdx)&&!(e.always&&e.always.has(PICK.classIdx))&&e.sp.level>=1&&e.sp.level<=PICK.maxLevel).map(e=>e.sp)
    : filterSpells(PICK.filter);
  // Magical Secrets draws from the OTHER lists the feature opened, not the class's own
  if(PICK.offList){const rec=R.casters.find(r=>r.idx===PICK.classIdx);
    const own=rec&&rec.listClass?rec.listClass[0].toLowerCase():"";
    base=base.filter(sp=>!sp.cls.some(([cn,cs])=>cn.toLowerCase()===own&&srcOn(cs)));}
  // quick level filters (present levels only)
  const presentLevels=[...new Set(base.map(s=>s.level))].sort((a,b)=>a-b);
  const lvBox=$("#pickLevels");
  if(lvBox)buildToggleRow(lvBox,presentLevels.map(l=>[String(l),l===0?"C":String(l)]),PICK.levelSet,true,renderPickList);
  const plb=$("#pickLevelBtn");if(plb)plb.innerHTML="Levels"+(PICK.levelSet.size?` <span class="badge">${PICK.levelSet.size}</span>`:"");
  const cur = isClass ? new Set(((R&&R.cart[PICK.classIdx])||state.chosen[PICK.classIdx]||{}).spells||[]) : new Set(state.choices[PICK.id]||[]);
  const pv=isClass?pickVerbs(PICK.classIdx,R.casters.find(r=>r.idx===PICK.classIdx)):null;
  const po=$("#pickOnly");if(po){po.classList.toggle("on",!!PICK.onlyPicked);
    po.innerHTML=(isClass?pv.n:"Picked")+(cur.size?` <span class="badge">${cur.size}</span>`:"");}
  let items=base.filter(sp=>(!q||sp.name.toLowerCase().includes(q))&&(!PICK.levelSet.size||PICK.levelSet.has(sp.level))
    &&(!PICK.onlyPicked||cur.has(key(sp.name,sp.source))));
  items.sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
  const pickRow=sp=>{const k=key(sp.name,sp.source);const on=cur.has(k);
    const d=el("div","sp"+(on?" chosen":""));
    const nm=el("div","nm",sp.name); attachSpell(nm,sp); d.append(nm);
    // D39 reaches here too now: the printed book lives in the spell modal's title line, so
    // both spell lists behave the same and neither carries it on the row
    const meta=el("div","meta");[ROMAN[sp.level],sp.school,cap1(sp.time),sp.range].filter(Boolean).forEach(x=>meta.append(el("span",null,x)));d.append(meta);
    const take=el("div","take");const b=el("button","tk ico-only"+(on?" on":""));
    b.append(icoEl(on?"check":"plus"));
    const tlbl=on?(isClass?pv.on:"Picked — click to remove")
                 :(isClass?pv.off:"Pick it");
    b.title=tlbl; b.setAttribute("aria-label",tlbl);
    b.onclick=()=>{ if(isClass){ toggle(PICK.classIdx,k,false); renderPickList(); return; }
      let a=state.choices[PICK.id]||[];
      if(a.includes(k))a=a.filter(v=>v!==k); else if(a.length<PICK.count)a=[...a,k]; else return;
      state.choices[PICK.id]=a;
      if(PICK.mark&&a.includes(k))markTake(PICK,k);
      renderPickList(); render();};
    take.append(b);d.append(take);return d;};
  // levels are groups only when there is more than one to separate — the same rule the
  // level FILTER follows, and a lone header over the whole list names nothing
  const shown=items.slice(0,300), byLvl={};
  shown.forEach(sp=>{(byLvl[sp.level]=byLvl[sp.level]||[]).push(sp);});
  const lvls=Object.keys(byLvl).map(Number).sort((a,b)=>a-b);
  if(lvls.length<2)shown.forEach(sp=>list.append(pickRow(sp)));
  else lvls.forEach(l=>{const g=lvlGroup("pick",l,byLvl[l].length);
    byLvl[l].forEach(sp=>g.append(pickRow(sp)));list.append(g);});
  if(!items.length){
    // an empty picker must always say WHY (D31) — "no eligible spells" reads as "none
    // exist", which is the wrong answer when the record has no list to draw on (D130)
    const noList=isClass&&(R.casters.find(r=>r.idx===PICK.classIdx)||{}).listUnknown;
    list.append(el("div","empty",PICK.onlyPicked?"Nothing picked here yet."
      :noList?listUnknownWhy(R.casters.find(r=>r.idx===PICK.classIdx))+" There is nothing to offer here."
      :isClass?"No eligible spells at this level yet.":"No matching spells for this choice."));}
}

// ── species / feat picker modal (search + source filter + grant preview) ─────
let ENT=null;
// a compact preview of what a species/feat grants, for the picker rows
function grantPreview(grants){
  if(!grantsAny(grants))return "";
  const p=[];
  // a fixed entry with no source is an extract artifact (innate cadence key misparsed
  // as a spell name, e.g. "Daily"/"Rest") — skip it here.
  (grants.fixed||[]).forEach(g=>{const nm=g.spell&&g.spell.name;if(nm&&g.spell.source&&!p.includes(nm))p.push(nm);});
  // the same ask the guide and the Choices card compose (G3) — it already says the count,
  // so the raw "2× " prefix is only needed on the descs it can't compose
  (grants.picks||[]).forEach(pk=>p.push(cap1(guidePickAsk(pk)
    ||((pk.count>1?pk.count+"× ":"")+(fmtDesc(pk.desc)||"a spell")))));
  (grants.expansions||[]).forEach(()=>p.push("Expanded spell list"));
  (grants.optionGroups||[]).forEach(og=>p.push(og.options.map(o=>o.name).join(" / ")));
  return p.filter(Boolean).join(" · ");
}
// `srcSet` replaces the global source gate (the picker's local book override, D27);
// pass ALL_SRC to ignore source gating entirely and see the full universe of books.
const ALL_SRC={has:()=>true};
function entItems(srcSet){
  const vis=o=>(srcSet||{has:c=>srcOn(c)}).has(o.source)&&reprintOk(o);
  if(ENT.kind==="opt"){const want=new Set(ENT.slot.types);
    return DATA.optfeats.filter(o=>vis(o)&&o.types.some(t=>want.has(t)));}
  if(ENT.kind==="species")return DATA.races.filter(vis);
  return DATA.feats.filter(f=>vis(f)&&!isFeatFS(f)&&ENT.cats.has(featCatId(f)));
}
function openEntityPicker(kind,category){
  // the optional-feature slot is passed in place of a feat category
  const slot=kind==="opt"?category:null;
  // `books` is a LOCAL override seeded from the global selection (D27) — editing it here
  // never writes back to the global source list, and it resets every time the picker opens.
  // one shared picker for all three feat slots. `cats` holds CATEGORY ids and is preset to
  // every category the slot may legally draw on — for a general slot that includes the
  // origin-slot ones, because origin is a subset of general (D84). Narrowing is the
  // player's, and attribution follows the SLOT they opened, not the feat's category.
  const slots=SLOTS_FOR[kind==="feat"?(category||"general"):""]||[];
  const catList=kind==="feat"?featCatsFor(slots):[];
  const preset=new Set(catList.map(c=>c[0]));
  ENT={kind,category,slot,q:"",books:new Set(SRC),grantsOnly:false,hideNo:false,
       cats:new Set(preset),presetCats:preset,catList};
  $("#entTitle").textContent = kind==="opt"?`Choose ${slot.name.replace(/s$/,"").toLowerCase()}`
    : kind==="species"?"Choose a species / lineage"
    : category==="origin"?"Choose an origin feat" : category==="epic"?"Choose an epic boon" : "Choose a general feat";
  $("#entSearch").value=""; $("#entGrants").checked=false; $("#entHideNo").checked=false;
  $("#entMenuPop").classList.add("hidden");
  $("#entityModal").classList.remove("hidden"); renderEntityList();
}
// the books present in the picker's own content — the override list never offers a book
// that has nothing of this kind in it.
function entBookCodes(){return new Set(entItems(ALL_SRC).map(i=>i.source));}
function renderEntBooks(){
  const codes=entBookCodes();
  // the checklist IS the scroller, and it is rebuilt on every tick — hold its position or
  // ticking a book near the bottom throws you back to the top of the list
  const wrap=$("#entSrcList"), top=wrap.scrollTop;
  const n=renderSourceChecklist(wrap,ENT.books,()=>{renderEntityList();},codes);
  wrap.scrollTop=top;
  const on=[...ENT.books].filter(c=>codes.has(c)).length;
  $("#entBooksN").textContent=`${on}/${n}`;
}
function renderEntityList(){
  if(!ENT)return;
  const list=$("#entList"); list.innerHTML="";
  // feat kind: epic boon is always offered, just not preselected below level 19 (D31)
  $("#entCatHead").classList.toggle("hidden",ENT.kind!=="feat");
  $("#entCats").classList.toggle("hidden",ENT.kind!=="feat");
  if(ENT.kind==="feat")buildToggleRow($("#entCats"),ENT.catList||[],ENT.cats,false,()=>renderEntityList());
  renderEntBooks();
  renderEntBudget();
  const q=ENT.q.toLowerCase();
  let items=entItems(ENT.books)
    .filter(i=>(!q||i.name.toLowerCase().includes(q))&&(!ENT.grantsOnly||grantsAny(i.grants)));
  // eligible first, then the ones whose prerequisites you don't meet, dimmed at the bottom
  const rank=it=>{const p=prereqState(it);return p.state==="no"?1:0;};
  items.sort((a,b)=>rank(a)-rank(b)||a.name.localeCompare(b.name)||a.source.localeCompare(b.source));
  const blocked=items.filter(i=>rank(i)===1);
  if(ENT.hideNo)items=items.filter(i=>rank(i)===0);
  const noun=ENT.kind==="opt"?"options":ENT.kind==="species"?"species":"feats";
  $("#entSub").innerHTML=`${items.length} ${noun} · <span class="ico">${ICONS.spark}</span> grants spells`
    +(blocked.length&&!ENT.hideNo?` · ${blocked.length} need something you don’t have`:"")
    +(ENT.note?` · ${esc(ENT.note)}`:"");
  // the ⋯ button says THAT the list is narrowed, not by how much — a count on an icon
  // button pushes the icon off centre and names a number nothing acts on
  const nf=[ENT.grantsOnly,ENT.hideNo,!sameSet(ENT.books,SRC)].filter(Boolean).length
    +(ENT.kind==="feat"&&!sameSet(ENT.cats,ENT.presetCats)?1:0);
  $("#entMenuBtn").classList.toggle("on",!!nf);
  const curSel = ENT.kind==="species"?state.speciesKey:null;
  if(!items.length){list.append(el("div","empty","Nothing matches those filters."));return;}
  let sepDone=false;
  const shown=items.slice(0,400);
  const entRow=(it,label)=>{const k=key(it.name,it.source);
    const pr=prereqState(it);
    if(pr.state==="no"&&!sepDone){sepDone=true;
      // the row above still carries its own divider — two rules with a gap between them
      // read as a mistake. The separator IS the divider here.
      let prev=list.lastElementChild;
      if(prev&&prev.classList.contains("entgroup"))prev=prev.lastElementChild;
      if(prev&&prev.classList.contains("entrow"))prev.classList.add("nodiv");
      list.append(el("div","entsep"));}
    // D135: a repeatable feat/invocation is HELD PER TAKE, so "on" is "you have at least
    // one" and the count comes from the acquisition array, not from a boolean
    const held=ENT.kind==="opt"?state.optFeats:ENT.kind==="feat"?state.feats:null;
    const n=held?copyCount(held,k):0;
    const rep=!!(it.repeatable&&held);
    const on = ENT.kind==="species"?curSel===k:n>0;
    const row=el("div","entrow"+(on?" on":"")+(pr.state==="no"?" blocked":""));
    const main=el("div","entmain");
    const nm=el("div","entname");nm.append(document.createTextNode(label||it.name));
    if(n>1)nm.append(el("span","entcount","×"+n));
    if(it.source!==CORE)nm.append(bookChip(it.source,it.page));
    if(ENT.kind==="feat"&&(ENT.catList||[]).length>1)
      nm.append(Object.assign(el("span","entcat"),{textContent:featCatLabel(it)}));
    if(grantsAny(it.grants))nm.append(icoEl("spark","fmark"));
    if(pr.state==="no")nm.append(icoEl("warn","entwarn"));
    main.append(nm);
    // prerequisites are a different kind of fact from what an entry grants, so they get
    // their own row of per-part verdict chips instead of being merged into the grants line
    if(pr.state!=="ok"&&pr.parts.length){
      const rq=el("div","entreq");rq.title=it.prereq||"";
      rq.append(el("span","rql","Requires"));
      pr.parts.forEach(pt=>{
        const chip=el("span","rqp "+(pt.s==="ok"?"met":pt.s==="no"?"unmet":"unk"));
        if(pt.why)chip.title=pt.why;      // e.g. which feat is already occupying the category
        if(pt.s==="ok")chip.append(icoEl("check"));
        if(pt.s==="no")chip.append(icoEl("x"));
        chip.append(document.createTextNode(pt.t));
        // a crossed part that names something takeable is a one-click fix, not just a verdict
        if(pt.s==="no"&&pt.pick&&prqCandidates(pt.pick).length){
          chip.classList.add("act");chip.title="Click to take it";
          chip.onclick=e=>{e.stopPropagation();openPrqPop(chip,pt.pick);};}
        rq.append(chip);});
      main.append(rq);}
    const prev=grantPreview(it.grants);
    if(prev)main.append(Object.assign(el("div","entprev"),{textContent:prev,title:prev}));
    row.append(main);
    const btn=el("button","tk ico-only"+(on?" on":""));
    btn.append(icoEl(on?"check":"plus"));
    const blbl=on?"Selected — click to remove":"Select";
    btn.setAttribute("aria-label",blbl);
    btn.title=blbl+(pr.state==="no"?" · you don’t meet its prerequisites, you can still take it":"");
    btn.onclick=()=>{
      // a local override can reveal a book the global selection has off; committing a pick
      // from it enables that book globally, otherwise afterSourceChange would prune the pick
      if(!on&&!srcOn(it.source)){SRC.add(it.source);saveSources();ENT.note=`Enabled ${bookName(it.source)} in your sources`;}
      if(ENT.kind==="species"){state.speciesKey=on?"":k;}
      else if(ENT.kind==="opt"){ if(on)dropCopy(state.optFeats,k); else state.optFeats.push(k); }
      else{ if(on)dropFeatCopy(k);
            else{state.feats.push(k);setFeatSlot(k,ENT.category||featSlot(it));} }
      save();refreshAll();render();renderEntityList(); };
    row.append(btn);
    // "You can gain this invocation more than once" (D135). The take button keeps its own
    // meaning — held means click-to-remove, as everywhere else — and the extra copy gets a
    // button of its own, shown only where the rule actually applies.
    if(rep&&on){
      const more=el("button","tk ico-only more");more.append(icoEl("plus"));
      const ml=`Take ${it.name} again — you can gain it more than once`;
      more.setAttribute("aria-label",ml); more.title=ml;
      more.onclick=()=>{ const nk=nextCopy(held,k);
        if(ENT.kind==="opt")state.optFeats.push(nk);
        else{state.feats.push(nk);setFeatSlot(nk,ENT.category||featSlot(it));}
        save();refreshAll();render();renderEntityList(); };
      row.append(more);
    }
    return row;};
  if(ENT.kind!=="species"){shown.forEach(it=>list.append(entRow(it)));return;}
  // a species and its lineages are one thing to choose between, so they are one block —
  // the same grouping the choices card uses (D46). A species with no lineage stays flat.
  const groups=[],by=new Map();
  shown.forEach(it=>{const b=it.base||it.name;
    let g=by.get(b); if(!g){g={base:b,items:[]};by.set(b,g);groups.push(g);}
    g.items.push(it);});
  groups.forEach(g=>{
    if(g.items.length===1&&!g.items[0].lineage){list.append(entRow(g.items[0]));return;}
    const box=el("div","entgroup");
    const h=el("div","eghead");h.append(el("b",null,g.base));
    h.append(el("span","cgn",g.items.length===1?"1 lineage":`${g.items.length} lineages`));
    box.append(h);
    g.items.forEach(it=>box.append(entRow(it,it.lineage||it.name)));
    const prev=list.lastElementChild;      // its divider would sit on the box's own border
    if(prev&&prev.classList.contains("entrow"))prev.classList.add("nodiv");
    list.append(box);});
}
// ── build manager (v7 · T3) ────────────────────────────────────────────────
// ONE flat list, grouped on render by `meta.character` (D35). Switching is non-destructive:
// nothing is pruned on activation, so a build made under other books keeps its picks — the
// reconciliation prompt is T2. Duplicating IS "save as new version" (D34): one action.
const agoText=ts=>{ if(!ts)return "";
  const m=Math.floor((Date.now()-ts)/60000);
  if(m<1)return "just now"; if(m<60)return m+" min ago";
  const h=Math.floor(m/60); if(h<24)return h+" h ago";
  const d=Math.floor(h/24); if(d===1)return "yesterday"; if(d<30)return d+" days ago";
  return new Date(ts).toLocaleDateString(); };
const buildsOf=char=>BUILDS.order.map(id=>BUILDS.builds[id])
  .filter(b=>b&&b.meta.character===char);
// "v3" after v1/v2 — the next free slot, not just count+1 (deleting v2 must not collide)
function nextVersionName(char){
  const used=new Set(buildsOf(char).map(b=>b.meta.name));
  for(let n=1;n<200;n++){const c="v"+n;if(!used.has(c))return c;}
  return "v";
}
function activateBuild(id){
  BUILDS.activeId=id;
  applyState(BUILDS.builds[id].state);
  pruneState();                             // only drops refs to content that no longer EXISTS
  persistBuilds();
  $("#fq").value=state.filters.q; $("#fReprint").value=state.filters.reprint;
  refreshAll(); render(); renderBuildList();
}
function switchBuild(id){
  if(id===BUILDS.activeId||!BUILDS.builds[id])return;
  save();                                   // flush the outgoing build before leaving it
  const b=BUILDS.builds[id];
  // only the books its PICKS depend on are worth asking about — a book it merely had enabled
  // changes what you can browse, not what the build holds
  const missing=buildGaps(b.state).books;
  // ask once, then activate either way — declining keeps the build whole, just flagged (T2)
  if(missing.size)askSources(b,missing,turnOn=>{
    if(turnOn){missing.forEach(c=>SRC.add(c));saveSources();
      if(state.filters.books)missing.forEach(c=>state.filters.books.add(c));}
    activateBuild(id);});
  else activateBuild(id);
}
// The preview answers "what did this look like at L5"; this answers "let me BUILD an
// L5 loadout". It forks the current build at the previewed level split — a real version
// you can then pick freely in, with that level's budgets (D64). Deliberately NOT
// per-pick level stamping: a stamp cannot express retraining (a spell gained, dropped
// and regained), and planning at 20 first would leave every pick unstamped.
function savePreviewAsVersion(){
  const src=activeBuild(); if(!src||PREVIEW.level==null)return;
  const lv=PREVIEW.level, eff=previewLevels();
  const st=JSON.parse(JSON.stringify(src.state));
  st.classes=(st.classes||[]).map(r=>({...r,level:eff.get(r.id)||0})).filter(r=>r.level>0);
  st.levelOrder=(st.levelOrder||[]).filter(id=>st.classes.some(r=>r.id===id));
  // the fork's history ends at its own top (E6 · D115(i)). Swap events above the slice
  // are rewound INTO the arrays first — newest first, so chains resolve — because the
  // variant held the OUT spell at this level, and only then dropped…
  swapEvents(st.swaps).filter(e=>e.lvl>lv).sort((a,b)=>b.lvl-a.lvl)
    .forEach(e=>{const ch=st.chosen[e.row]; if(!ch)return;
      const arr=e.kind==="cantrip"?"cantrips":"spells";
      const i=(ch[arr]||[]).indexOf(e.in); if(i>=0)ch[arr][i]=e.out;});
  st.swaps=Object.fromEntries(Object.entries(st.swaps||{}).filter(([k])=>+k<=lv));
  if(st.currentLevel!=null&&st.currentLevel>=lv)st.currentLevel=null;
  // …then every sticky array is cut at the slice, so the variant holds exactly what
  // the source held at this level. The live maps are valid here: st is a copy of the
  // live build, same plan, same schedules. Preparer lists stay whole (daily, D18).
  const clm=charLevelMap(), fa=featAcqLevels(), oa=optAcqLevels();
  state.classes.forEach(row=>{const sched=rowSched(row), ch=st.chosen[row.id];
    if(!sched||!ch)return;
    const lvls=clm.get(row.id)||[];
    ch.cantrips=(ch.cantrips||[]).filter((_,i)=>acqAt(sched.cant,i,lvls)<=lv);
    if(sched.spells)ch.spells=(ch.spells||[]).filter((_,i)=>acqAt(sched.spells,i,lvls)<=lv);
    if(ch.prep){const book=new Set(ch.spells);ch.prep=ch.prep.filter(k=>book.has(k));}});
  Object.keys(st.chosen||{}).forEach(id=>{
    if(!st.classes.some(r=>String(r.id)===String(id)))delete st.chosen[id];});
  st.feats=(st.feats||[]).filter(fk=>((fa.get(fk)||{}).lv||1)<=lv);
  Object.keys(st.featSlots||{}).forEach(k=>{if(!st.feats.includes(k))delete st.featSlots[k];});
  st.optFeats=(st.optFeats||[]).filter(ok=>((oa.get(ok)||{}).lv||1)<=lv);
  // keep the lineage readable: named as a VARIANT branching here (D115(i)) — the old
  // "· LV5" copies stay what they are, ordinary variants under their old names
  const used=new Set(buildsOf(src.meta.character).map(b=>b.meta.name));
  const base=((src.meta.name||"").trim()?src.meta.name.trim()+" · ":"")+"L"+lv+" variant";
  let name=base; for(let n=2;used.has(name);n++)name=base+" ("+n+")";
  const b=mkBuild(st,src.meta.sources,name);
  b.meta.character=src.meta.character; b.meta.named=src.meta.named;
  BUILDS.builds[b.id]=b;
  BUILDS.order.splice(BUILDS.order.indexOf(src.id)+1,0,b.id);
  persistBuilds();
  setPreview(null);                    // the version IS that level — nothing left to preview
  switchBuild(b.id);
}
function duplicateBuild(id){
  const src=BUILDS.builds[id]; if(!src)return;
  const b=mkBuild(JSON.parse(JSON.stringify(src.state)),src.meta.sources,nextVersionName(src.meta.character));
  b.meta.character=src.meta.character; b.meta.named=src.meta.named;
  BUILDS.builds[b.id]=b;
  BUILDS.order.splice(BUILDS.order.indexOf(id)+1,0,b.id);
  persistBuilds(); switchBuild(b.id);
}
// creating a character starts in a small modal: name + version, both optional (D53).
// An empty character name keeps the auto-follow behaviour (D35's `named` stays false).
function newBuild(charName,verName){
  const b=mkBuild(null,null,verName||"v1");
  if(charName){b.meta.character=charName;b.meta.named=true;}
  BUILDS.builds[b.id]=b; BUILDS.order.push(b.id);
  persistBuilds(); switchBuild(b.id);
}
function openNewBuild(){
  closeMenu();
  $("#nbChar").value=""; $("#nbVer").value="";
  $("#newBuildModal").classList.remove("hidden");
  $("#nbChar").focus();
}
function deleteBuild(id){
  const b=BUILDS.builds[id]; if(!b)return;
  const at=BUILDS.order.indexOf(id);
  delete BUILDS.builds[id]; BUILDS.order.splice(at,1);
  if(!BUILDS.order.length){                 // never leave the app with no build at all
    const nb=mkBuild(null); BUILDS.builds[nb.id]=nb; BUILDS.order=[nb.id]; BUILDS.activeId=nb.id;
    applyState(nb.state); refreshAll(); render();
  } else if(BUILDS.activeId===id){
    BUILDS.activeId=null; switchBuild(BUILDS.order[Math.min(at,BUILDS.order.length-1)]);
  }
  persistBuilds(); renderBuildList();
}
// Native confirm() silently returns false in embedded webviews — the dialog never
// shows and the action looks dead. So destructive buttons arm instead: first click
// turns the button into the question, second click within 4s commits, anything else
// (mouse leaving, timeout) disarms. No native dialogs anywhere.
function armConfirm(btn,label,doIt){
  if(label&&!btn.childNodes.length)btn.textContent=label;
  const rest=btn.innerHTML;                    // menu rows carry an icon span — keep it
  let t=0;
  const disarm=()=>{clearTimeout(t);btn.classList.remove("armed");btn.innerHTML=rest;};
  btn.onclick=e=>{e.stopPropagation();
    if(!btn.classList.contains("armed")){
      btn.classList.add("armed");btn.textContent="Confirm?";
      clearTimeout(t);t=setTimeout(disarm,4000);return;}
    disarm();doIt();};
  btn.onmouseleave=disarm;
  return btn;
}
// a name field that looks like text until you touch it — no edit mode to enter or leave
function nameInput(cls,value,commit){
  const i=el("input",cls); i.value=value; i.spellcheck=false;
  i.onkeydown=e=>{ if(e.key==="Enter")i.blur();
    if(e.key==="Escape"){i.value=value;i.blur();} e.stopPropagation(); };
  i.onclick=e=>e.stopPropagation();
  i.onblur=()=>{const v=i.value.trim(); if(!v||v===value){i.value=value;return;} commit(v);};
  return i;
}
function renderBuildList(){
  const box=$("#buildList"); if(!box)return; box.innerHTML="";
  const q=($("#buildSearch").value||"").toLowerCase();
  const chars=[]; BUILDS.order.forEach(id=>{const b=BUILDS.builds[id];
    if(b&&!chars.includes(b.meta.character))chars.push(b.meta.character);});
  let shown=0;
  chars.forEach(char=>{
    // summary is re-derived here (not read from meta) so renames of the FORMAT reach
    // inactive builds too, and so the search always matches current class/subclass names
    const rows=buildsOf(char).map(b=>({b,sum:describeBuild(b.state)}))
      .filter(({b,sum})=>!q||char.toLowerCase().includes(q)
      ||b.meta.name.toLowerCase().includes(q)||sum.toLowerCase().includes(q));
    if(!rows.length)return;
    shown+=rows.length;
    const grp=el("div","bldgroup");
    const h=el("div","bldhead");
    h.append(nameInput("bldchar",char,v=>{
      buildsOf(char).forEach(b=>{b.meta.character=v;b.meta.named=true;});
      persistBuilds(); renderBuildList();}));
    h.append(Object.assign(el("span","bldn"),{textContent:rows.length+(rows.length>1?" versions":" version")}));
    grp.append(h);
    rows.forEach(({b,sum})=>{
      const on=b.id===BUILDS.activeId;
      const r=el("div","bldrow"+(on?" on":""));
      r.onclick=()=>switchBuild(b.id);
      const main=el("div","bldmain");
      const top=el("div","bldtop");
      top.append(nameInput("bldname",b.meta.name,v=>{b.meta.name=v;persistBuilds();renderBuildList();}));
      if(on)top.append(el("span","bldcur","current"));
      main.append(top);
      main.append(Object.assign(el("div","bldsum"),
        {textContent:sum+" · "+agoText(b.meta.updated)}));
      r.append(main);
      const acts=el("div","bldacts");
      // three word-buttons ran into the `current` chip on a phone — icons + popovers
      const act=(ico,label,tip,fn)=>{const btn=el("button","tk ico-only");btn.append(icoEl(ico));
        btn.setAttribute("aria-label",label);
        btn.onclick=e=>{e.stopPropagation();fn();};      // own handler BEFORE attachTip
        attachTip(btn,tipBlock(label,tip)); return btn;};
      const exp=act("download","Export",
        "Downloads this build as a file you can keep, or move to another machine.",()=>exportBuild(b.id));
      const dup=act("copy","Duplicate",
        "Copies it as a new version of this character.",()=>duplicateBuild(b.id));
      // the icon must be in place BEFORE armConfirm: it snapshots innerHTML to restore
      const delBtn=el("button","tk del ico-only"); delBtn.append(icoEl("trash"));
      delBtn.setAttribute("aria-label","Delete"); delBtn.title="Delete this version";
      const del=armConfirm(delBtn,null,()=>deleteBuild(b.id));
      acts.append(exp,dup,del); r.append(acts); grp.append(r);
    });
    box.append(grp);
  });
  const total=BUILDS.order.length;
  $("#buildSub").textContent=`${total} build${total===1?"":"s"} across ${chars.length} character${chars.length===1?"":"s"}`
    +(q?` · ${shown} shown`:"")+" · click one to switch";
  if(!shown)box.append(el("div","empty","Nothing matches that filter."));
  renderBuildSwitch();          // a rename here must show up in the header switcher
}
function openBuilds(){ closeMenu(); $("#buildSearch").value="";
  const ib=$("#bImportBox"); if(ib)ib.classList.add("hidden");
  $("#buildModal").classList.remove("hidden"); renderBuildList(); }

// ── build switcher (v7 · T4) ───────────────────────────────────────────────
// The active build is named on the main surface and switchable from there. The manager
// (T3) stays the place to rename, duplicate and delete — this is the short path.
function renderBuildSwitch(){
  const b=activeBuild(); if(!b||!$("#bswBtn"))return;
  $("#bswChar").textContent=b.meta.character||"New build";
  const ver=$("#bswVer"); ver.textContent=b.meta.name||"";
  // the version only earns space when there is more than one of this character
  ver.classList.toggle("hidden",buildsOf(b.meta.character).length<2);
  const n=BUILDS.order.length;
  $("#bswBtn").title=`${describeBuild(b.state)} · ${n} build${n===1?"":"s"} saved`;
}
// A build's meta changed (a rename). The header label and, if it is open, the manager
// both read that meta — but re-rendering the POPOVER from a field's own blur handler
// would destroy the node the next click is travelling to, so that is opt-in.
function afterBuildMeta(repop){
  persistBuilds(); renderBuildSwitch();
  if($("#buildModal")&&!$("#buildModal").classList.contains("hidden"))renderBuildList();
  if(repop&&$("#bswPop")&&!$("#bswPop").classList.contains("hidden"))renderBswPop();
}
// The row menu lives inside a popover that scrolls and therefore CLIPS (`overflow:auto`).
// `position:fixed` takes it out of that clip — its containing block is the viewport — so
// it is placed from the button's own rect and closed if the list scrolls under it.
function placeBswMenu(menu,btn){
  menu.classList.remove("hidden");
  menu.style.left=menu.style.top="0px";                 // measure unconstrained
  const m=menu.getBoundingClientRect(), b=btn.getBoundingClientRect(), pad=6;
  let top=b.bottom+4;
  if(top+m.height>innerHeight-pad)top=Math.max(pad,b.top-4-m.height);
  let left=b.right-m.width;
  left=Math.max(pad,Math.min(left,innerWidth-pad-m.width));
  menu.style.left=left+"px"; menu.style.top=top+"px";
}
function closeBswMenus(){document.querySelectorAll(".bswmenu").forEach(m=>m.classList.add("hidden"));}
function renderBswPop(){
  const pop=$("#bswPop"); pop.innerHTML="";
  // the list scrolls; the two actions below it are pinned, so "New build" is reachable
  // whether you have two builds or twenty
  const wrap=el("div","bswlist"); pop.append(wrap);
  const chars=[]; BUILDS.order.forEach(id=>{const b=BUILDS.builds[id];
    if(b&&!chars.includes(b.meta.character))chars.push(b.meta.character);});
  chars.forEach(char=>{
    // a character is a GROUP, not a divider: its name heads the block its versions sit in,
    // and the name is editable here exactly as in the manager — renaming it rewrites every
    // version under it (D35) and stops the auto-follow
    const grp=el("div","bsggroup"); wrap.append(grp);
    const gh=el("div","bswgrp");
    gh.append(nameInput("bswgrpn",char,v=>{
      buildsOf(char).forEach(b=>{b.meta.character=v;b.meta.named=true;});
      afterBuildMeta(true);}));
    const nver=buildsOf(char).length;
    gh.append(el("span","bsgn",nver===1?"1 version":nver+" versions"));
    grp.append(gh);
    const rows=el("div","bsgrows"); grp.append(rows);
    buildsOf(char).forEach(b=>{
      const on=b.id===BUILDS.activeId;
      // a row is no longer ONE button: it carries its own actions and its own name FIELD,
      // and a button may nest neither. The switch action is a focusable div instead.
      const r=el("div","bswrow"+(on?" on":""));
      const main=el("div","bswmain");
      main.tabIndex=0; main.setAttribute("role","button");
      const t=el("div","bswrowt");
      t.append(nameInput("bswn",b.meta.name,v=>{b.meta.name=v;afterBuildMeta(false);}));
      if(on)t.append(el("span","bswcur","current"));
      main.append(t);
      main.append(el("div","bsws",describeBuild(b.state)+" · "+agoText(b.meta.updated)));
      const go=()=>{closeMenu(); if(!on)switchBuild(b.id);};
      main.onclick=go;
      main.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}};
      r.append(main);
      const dots=el("button","bswdots ico");dots.append(icoEl("dots"));
      dots.setAttribute("aria-label","Actions for this version");
      dots.title="Export, duplicate or delete this version";
      const menu=el("div","bswmenu hidden");
      const mi=(ico,label,fn)=>{const x=el("button","bswmi");x.append(icoEl(ico,"mi"));
        x.append(document.createTextNode(label));
        x.onclick=e=>{e.stopPropagation();fn(x);};return x;};
      menu.append(mi("download","Export",()=>{exportBuild(b.id);closeMenu();}));
      menu.append(mi("copy","Duplicate",()=>{duplicateBuild(b.id);closeMenu();}));
      const del=mi("trash","Delete",()=>{});
      del.classList.add("danger"); armConfirm(del,null,()=>{deleteBuild(b.id);closeMenu();});
      menu.append(del);
      dots.onclick=e=>{e.stopPropagation();
        const wasOpen=!menu.classList.contains("hidden");
        closeBswMenus();
        if(!wasOpen)placeBswMenu(menu,dots);};
      r.append(dots,menu);
      rows.append(r);});});
  const foot=el("div","bswfoot"); pop.append(foot);
  // creating a character is the one ACTION here, not another place to navigate to
  const nb=el("button","bswact primary");nb.append(icoEl("plus","mi"));nb.append(document.createTextNode("New build"));
  nb.onclick=()=>openNewBuild();
  const man=el("button","bswact");man.append(icoEl("stack","mi"));man.append(document.createTextNode("Manage builds…"));
  man.onclick=()=>{closeMenu();openBuilds();};
  foot.append(nb,man);
}

// ── export / import a build (v7 · T5) ──────────────────────────────────────
// A build is otherwise one browser away from gone. The file is a plain JSON envelope
// carrying the build's own state plus `meta.sources` (D33), so the receiving machine can
// say which books it expects. A FILE, never a URL (D36). Import always ADDS — it can
// never overwrite a build you already have.
const BUILD_FILE_KIND="my-spellbook/build";
// E1's fields (currentLevel, swaps) are ADDITIVE: an older reader ignores them and loses
// nothing it understands, so the version gate stays at 1. Bump only for a reshaping change.
const BUILD_FILE_VERSION=1;
function buildExportObj(b){
  return {kind:BUILD_FILE_KIND,version:BUILD_FILE_VERSION,exported:Date.now(),
          app:"My Spellbook",meta:JSON.parse(JSON.stringify(b.meta)),
          state:JSON.parse(JSON.stringify(b.state))};
}
const safeFileName=s=>String(s||"build").replace(/[^\w.\- ]+/g,"").trim().replace(/\s+/g,"-")||"build";
function exportBuild(id){
  const b=BUILDS.builds[id]; if(!b)return;
  if(id===BUILDS.activeId)save();          // flush the live build before writing it out
  const txt=JSON.stringify(buildExportObj(BUILDS.builds[id]),null,1);
  const name=`${safeFileName(b.meta.character)}-${safeFileName(b.meta.name)}.spellbook.json`;
  const url=URL.createObjectURL(new Blob([txt],{type:"application/json"}));
  const a=el("a"); a.href=url; a.download=name; document.body.append(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),4000);
}
// what the file needs that this browser hasn't got loaded or turned on
function importGaps(st,srcs){
  const missing=new Set(), off=new Set();
  (srcs||[]).forEach(c=>{ if(!DATA.sources[c])missing.add(c); else if(!srcOn(c))off.add(c); });
  return {missing,off};
}
function parseBuildFile(txt){
  let j; try{ j=JSON.parse(txt); }catch(e){ throw new Error("That isn't valid JSON."); }
  if(!j||typeof j!=="object")throw new Error("That isn't a build file.");
  if(j.kind&&j.kind!==BUILD_FILE_KIND)throw new Error("That file isn't a My Spellbook build.");
  const st=j.state||j;                       // tolerate a bare state blob
  if(!st||typeof st!=="object"||!Array.isArray(st.classes))
    throw new Error("That file has no build in it.");
  if((j.version||1)>BUILD_FILE_VERSION)
    throw new Error("That build was exported by a newer version of the app.");
  return {meta:j.meta||{},state:st};
}
function importBuildText(txt){
  const {meta,state:st}=parseBuildFile(txt);
  const char=meta.character||characterFrom(st)||"Imported";
  const used=new Set(buildsOf(char).map(b=>b.meta.name));
  let nm=meta.name||"v1"; for(let n=2;used.has(nm);n++)nm=(meta.name||"v1")+" ("+n+")";
  // sources ride along as a RECORD of what it expected (D33) — never as an instruction
  const b=mkBuild(applyImportedState(st),meta.sources||[...SRC],nm);
  b.meta.character=char; b.meta.named=!!meta.named;
  b.meta.created=meta.created||Date.now(); b.meta.updated=Date.now();
  BUILDS.builds[b.id]=b; BUILDS.order.push(b.id);
  persistBuilds();
  return b;
}
// normalise a foreign state blob to this app's shape without trusting any of it
function applyImportedState(st){
  const out=blankBuildState();
  out.classes=(Array.isArray(st.classes)?st.classes:[]).map((r,i)=>({
    id:i+1, clsKey:String(r.clsKey||""), subKey:r.subKey?String(r.subKey):null,
    level:Math.max(1,Math.min(20,+r.level||1))})).filter(r=>r.clsKey);
  out.nextRowId=out.classes.length+1;
  const idMap=new Map((Array.isArray(st.classes)?st.classes:[]).map((r,i)=>[r.id,i+1]));
  out.speciesKey=String(st.speciesKey||"");
  out.feats=(Array.isArray(st.feats)?st.feats:[]).map(String);
  out.optFeats=(Array.isArray(st.optFeats)?st.optFeats:[]).map(String);
  // which slot each feat was spent from (D84) — keyed by name|source, so no renumbering.
  // Nothing from the file is trusted: only a known slot, only for a feat that is here.
  out.featSlots={};
  const held=new Set(out.feats);
  Object.entries((st.featSlots&&typeof st.featSlots==="object")?st.featSlots:{}).forEach(([k,v])=>{
    if(held.has(String(k))&&SLOTS_FOR[String(v)])out.featSlots[String(k)]=String(v);});
  out.levelOrder=(Array.isArray(st.levelOrder)?st.levelOrder:[]).map(x=>idMap.get(x)).filter(Boolean);
  out.customSources=Array.isArray(st.customSources)?JSON.parse(JSON.stringify(st.customSources)):[];
  // marked summon forms — keyed by spell, so no renumbering; strings only, nothing trusted
  out.sbFav={};
  Object.entries((st.sbFav&&typeof st.sbFav==="object")?st.sbFav:{}).forEach(([k,v])=>{
    const list=(Array.isArray(v)?v:[]).map(String).filter(Boolean);
    if(list.length)out.sbFav[String(k)]=list;});
  out.chosen={};
  Object.entries(st.chosen||{}).forEach(([k,v])=>{const nk=idMap.has(+k)?idMap.get(+k):k;
    out.chosen[nk]={cantrips:(v&&v.cantrips||[]).map(String),spells:(v&&v.spells||[]).map(String),
                    prep:(v&&v.prep||[]).map(String)};});
  out.choices={};
  Object.entries(st.choices||{}).forEach(([k,v])=>{
    // choice ids embed the class row id ("c3:pk0") — remap so picks survive the renumber
    const nk=String(k).replace(/^([cs])(\d+)/,(m,p,n)=>idMap.has(+n)?p+idMap.get(+n):m);
    out.choices[nk]=Array.isArray(v)?v.map(String):v;});
  // null, never FILTER_DEFAULT(): the default holds live Sets, which JSON.stringify to "{}"
  // and threw on the next boot's `new Set({})` — applyState builds the default from null
  out.filters=st.filters||null;
  // the level pointer (E1 · D115(e)): an integer below the build's top level, else null = top
  const top=out.classes.reduce((a,r)=>a+r.level,0);
  const cl=Math.round(+st.currentLevel);
  out.currentLevel=(cl>=1&&cl<top)?cl:null;
  // swap events (E1 · D115(g)): up to one LEVELED-SPELL and one CANTRIP event per
  // character level, rows remapped like every other ref; anything malformed is dropped,
  // never guessed at. swapNorm also reads a file written while a level carried a single
  // event, so an older export imports whole.
  out.swaps={};
  Object.entries((st.swaps&&typeof st.swaps==="object")?st.swaps:{}).forEach(([k,v])=>{
    const lvl=Math.round(+k); if(!(lvl>=1&&lvl<=20))return;
    const n=swapNorm(v); if(!n)return;
    const m={};
    SWAP_KINDS.forEach(kind=>{const e=n[kind]; if(!e)return;
      const row=idMap.get(+e.row); if(!row)return;
      m[kind]={row,out:e.out,in:e.in};});
    if(SWAP_KINDS.some(kind=>m[kind]))out.swaps[lvl]=m;});
  // dismissed form offers (D131(g)) — keyed by spell like sbFav, so no renumbering.
  // Strings only: a dismissal it can't read just brings the offer back, which is safe.
  out.sbFavSkip=[...new Set((Array.isArray(st.sbFavSkip)?st.sbFavSkip:[]).map(String).filter(Boolean))];
  return out;
}

// ── custom-source editor (D55) ─────────────────────────────────────────────
let CSRC=null;   // the draft being edited: {id,name,kind,mode,spells:[{key,count,unit}]}
function renderCustomSources(){
  const box=$("#csrcChips"); if(!box)return; box.innerHTML="";
  (state.customSources||[]).forEach(cs=>{
    const c=el("span","chip csrc");
    c.append(icoEl("spark","fmark"));
    c.append(el("span",null,cs.name));
    c.append(el("span","csn",String((cs.spells||[]).length)));
    c.onclick=()=>openCsrc(cs);
    attachTip(c,tipRows(cs.name,[["Kind",esc(cs.kind||"—")],["Uses",esc(csrcPower(cs))]]
      .concat(cs.dc?[["Save DC",esc(cs.dc)]]:[]).concat(cs.atk?[["Attack",esc(cs.atk)]]:[])));
    box.append(c);});
}
function openCsrc(existing){
  CSRC=existing?JSON.parse(JSON.stringify(existing))
               :{id:"cs"+Date.now().toString(36),name:"",kind:"",mode:"innate",
                 uses:"pool",pool:null,recharge:"",dc:"",atk:"",ability:"",spells:[]};
  // sources authored before the richer model carry no `uses` — normalise the draft so the
  // toggles and the rows below can never disagree about what this source is
  CSRC.mode=CSRC.mode||"innate";
  if(!CSRC.uses)
    CSRC.uses=(CSRC.spells||[]).some(e=>e.unit||e.count!=null)?"per":"pool";
  $("#csrcTitle").textContent=existing?"Edit spell source":"Custom spell source";
  $("#csrcDelete").classList.toggle("hidden",!existing);
  // both disclosures start CLOSED on every open — a source you edited with the numbers open
  // shouldn't reopen that way for the next one (D94)
  CSRC_OPEN={rules:false,nums:false}; CSRC_ROW_OPEN=new Set();
  $("#csrcName").value=CSRC.name;
  $("#csrcKind").value=CSRC.kind||"";
  $("#csrcPool").value=CSRC.pool==null?"":CSRC.pool;
  $("#csrcRecharge").value=CSRC.recharge||"";
  $("#csrcDC").value=CSRC.dc||""; $("#csrcAtk").value=CSRC.atk||"";
  const ab=$("#csrcAbility");ab.innerHTML="";ab.append(new Option("mine",""));
  Object.entries(ABIL).forEach(([v,t])=>ab.append(new Option(t,v)));
  ab.value=CSRC.ability||"";
  // selects, not chip rows (D94b) — two one-of questions side by side read as fields, and
  // five chips wrapping across two lines was most of what made this section feel heavy
  const md=$("#csrcMode");md.innerHTML="";
  CSRC_MODES.forEach(([v,t])=>md.append(new Option(t,v)));
  md.value=CSRC.mode; md.onchange=()=>{CSRC.mode=md.value;csrcSyncMode();};
  // D95: no source-level "Uses" select any more — payment is per spell, and the pool is just
  // a thing the source has. Normalise the draft ONCE on open so every row carries its own
  // `pay` and the legacy `uses` enum stops being consulted.
  (CSRC.spells||[]).forEach(e=>{ if(e.pay!=="pool"&&e.pay!=="per")e.pay=csrcPay(CSRC,e); });
  delete CSRC.uses;
  $("#csrcSearch").value=""; $("#csrcHits").innerHTML=""; $("#csrcErr").textContent="";
  csrcSyncMode();
  $("#csrcModal").classList.remove("hidden");
  if(!existing)$("#csrcName").focus();
}
// only "cast without preparing" spends uses at all, and only a pool needs a pool size
function csrcSyncMode(){
  // only "cast without preparing" spends anything, so the pool is meaningless otherwise
  $("#csrcUsesBlock").classList.toggle("hidden",CSRC.mode!=="innate");
  csrcSyncRule(); renderCsrcRows(); csrcSyncNums(); csrcSyncSummary();
}
// ── D94: the collapsed surface ─────────────────────────────────────────────
let CSRC_OPEN={rules:false,nums:false};   // which disclosures are open
let CSRC_ROW_OPEN=new Set();              // which spell rows show their rare per-spell bits
// The rule line says what the source IS, in the words the toggles use, so opening "Change"
// never contradicts what you just read.
// D95: a source can now be BOTH — a pool plus spells on their own uses — so the line names
// both rather than picking one. It is the only always-visible statement of what this is, so
// it must never describe a shape the spells below contradict.
function csrcRuleText(){
  const mode=(CSRC_MODES.find(m=>m[0]===CSRC.mode)||[])[1]||CSRC.mode;
  const head=`<b>${esc(cap1(mode))}</b>`;
  if(CSRC.mode!=="innate")return head;
  const spells=CSRC.spells||[];
  const onPool=spells.filter(e=>csrcPay(CSRC,e)==="pool").length;
  const onOwn=spells.length-onPool;
  const bits=[];
  if(csrcHasPool(CSRC))
    bits.push(`a pool of <b>${esc(String(CSRC.pool))}</b> charge${+CSRC.pool===1?"":"s"}`
      +(CSRC.recharge?`, regains <b>${esc(CSRC.recharge)}</b>`:""));
  else if(onPool)
    // a spell says it costs charges from a pool that doesn't exist — the one real contradiction
    bits.push(`<i class="rl-todo">${onPool} spell${onPool===1?"":"s"} spend${onPool===1?"s":""} charges, but there is no pool</i>`);
  if(onOwn)bits.push(`<b>${onOwn}</b> spell${onOwn===1?" on its":"s on their"} own uses`);
  if(!bits.length)bits.push(spells.length?`each spell on its own uses`:`<i>no charge pool</i>`);
  return head+" · "+bits.join(" · ");
}
function csrcSyncRule(){
  const t=$("#csrcRuleTxt"); if(t)t.innerHTML=csrcRuleText();
  const box=$("#csrcRules"),btn=$("#csrcRuleEdit");
  if(box)box.classList.toggle("hidden",!CSRC_OPEN.rules);
  if(btn){btn.textContent=CSRC_OPEN.rules?"Done":"Change";
    btn.classList.toggle("on",CSRC_OPEN.rules);
    btn.setAttribute("aria-expanded",String(CSRC_OPEN.rules));}
}
// The label carries the STATE — "set — DC 15, +7, Intelligence" — so a folded section can
// never hide something you changed. Blank stays blank and says "uses mine".
function csrcSyncNums(){
  const dc=$("#csrcDC").value.trim(),atk=$("#csrcAtk").value.trim(),ab=$("#csrcAbility").value;
  const bits=[]; if(dc)bits.push("DC "+dc); if(atk)bits.push(atk); if(ab)bits.push(ABIL[ab]||ab);
  const sub=$("#csrcNumsSub");
  if(sub)sub.textContent=bits.length?"set — "+bits.join(", "):"uses mine";
  const wrap=$("#csrcNumsWrap"); if(wrap)wrap.classList.toggle("hasval",!!bits.length);
  const box=$("#csrcNums"),btn=$("#csrcNumsBtn");
  if(box)box.classList.toggle("hidden",!CSRC_OPEN.nums);
  if(btn)btn.setAttribute("aria-expanded",String(CSRC_OPEN.nums));
}
// C's contribution: reflect the whole thing back as a sentence. The model is subtle enough
// to build something you didn't mean — a pool with no charges, a source with no spells — and
// nothing else in the modal ever says what you actually made.
function csrcSummary(){
  const typed=($("#csrcName").value||"").trim();
  const name=typed||"This source";
  const named=(CSRC.spells||[]).map(e=>csrcIsPick(e)?csrcPickDesc(e)
    :(SPELL_BY[e.key]?SPELL_BY[e.key].name:e.key.split("|")[0]));
  // mid-sentence, so the nameless fallback has to be lowercase — "and This source will…" is
  // the kind of thing a capitalised constant does to a sentence it was never written for
  if(!named.length)return `<i>Add a spell and ${typed?esc(typed):"this source"} will describe itself here.</i>`;
  const list=named.length<=3?named.map(esc).join(named.length===2?" or ":", ").replace(/, ([^,]*)$/," or $1")
    :`${esc(named[0])}, ${esc(named[1])} and ${named.length-2} more`;
  let how;
  if(CSRC.mode==="always")how=`have ${list} always prepared`;
  else if(CSRC.mode==="list")how=`add ${list} to your spell list — you prepare them normally`;
  else {
    // D95: one source can spend a pool AND carry spells on their own uses, so the sentence
    // has to be able to say both. Each spell is named with what IT costs while the list is
    // short enough to read — that is the half of a source you actually tune.
    const nm=e=>esc(csrcIsPick(e)?csrcPickDesc(e)
      :(SPELL_BY[e.key]?SPELL_BY[e.key].name:e.key.split("|")[0]));
    const join=a=>a.join(a.length===2?" and ":", ").replace(/, ([^,]*)$/," and $1");
    // D96: a choice gets its own clause — it is not something you "cast X" at
    const plain=(CSRC.spells||[]).filter(e=>!csrcIsPick(e));
    const picked=(CSRC.spells||[]).filter(csrcIsPick);
    const pooled=plain.filter(e=>csrcPay(CSRC,e)==="pool");
    const own=plain.filter(e=>csrcPay(CSRC,e)!=="pool");
    const clauses=[];
    if(pooled.length){
      const n=csrcHasPool(CSRC)?CSRC.pool:null;
      const what=pooled.length<=3
        ? join(pooled.map((e,ix)=>{const c=Math.max(1,e.cost||1);
            return `${nm(e)} (<b>${c}</b>${ix?"":` charge${c===1?"":"s"}`})`;}))
        : `${pooled.length} spells`;
      clauses.push(`cast ${what} spending from `
        +(n==null?`<b class="warnish">a pool with no charges set</b>`
                 :`<b>${esc(String(n))} charge${+n===1?"":"s"}</b>`)
        +(CSRC.recharge?` (regains ${esc(CSRC.recharge)})`:""));}
    if(own.length){
      const what=own.length<=3
        ? join(own.map(e=>`${nm(e)} <b>${esc(csrcCadence(e))}</b>`))
        : `${own.length} more on their own uses`;
      clauses.push((pooled.length?"":"cast ")+what);}
    if(picked.length)
      clauses.push(join(picked.map(e=>
        `${csrcPickPhrase(e)} and cast it <b>${esc(csrcRecharge(CSRC,e))}</b>`)));
    // "all" only earns its place when there are two budgets to gather up; with one clause it
    // reads as a tic bolted onto the end of a sentence that was already finished
    how=clauses.length>1 ? clauses.join(", and ")+" — all without preparing"
                         : (clauses[0]||`cast ${list}`)+" without preparing";}
  const dc=$("#csrcDC").value.trim(),atk=$("#csrcAtk").value.trim(),ab=$("#csrcAbility").value;
  const num=[]; if(dc)num.push(`saves are <b>DC ${esc(dc)}</b>`);
  if(atk)num.push(`attacks <b>${esc(atk)}</b>`);
  if(ab)num.push(`it casts with <b>${esc(ABIL[ab]||ab)}</b>`);
  return `<b>${esc(name)}</b> — ${how}.`+(num.length?" "+cap1(num.join(", "))+".":"");
}
function csrcSyncSummary(){const b=$("#csrcSummary"); if(!b)return;
  b.innerHTML=csrcSummary();
  // an empty source has nothing to reflect back, so the accent frame would be pointing at a
  // placeholder — it earns its colour only once there is something to describe
  b.classList.toggle("empty",!(CSRC.spells||[]).length);}
// a one-of chip row (the cbrow pattern, but single-select)
function buildToggleRowSingle(box,pairs,cur,cb){
  box.innerHTML="";
  pairs.forEach(([v,t])=>{const b=el("button","cbtn"+(v===cur?" on":""),t);
    b.onclick=()=>{[...box.children].forEach(x=>x.classList.remove("on"));b.classList.add("on");cb(v);};
    box.append(b);});
}
// D94: a row carries ONE control inline — the one this mode actually spends — and folds the
// rare per-spell bit (cast at a fixed level) behind its own caret. The old row showed the
// level dropdown on every spell, always, though almost nothing uses it.
function renderCsrcRows(){
  const box=$("#csrcRows"); box.innerHTML="";
  const spends=CSRC.mode==="innate";
  if(!CSRC.spells.length){
    box.append(el("div","csempty","No spells yet — search below to add one."));return;}
  CSRC.spells.forEach((e,i)=>{
    const isPick=csrcIsPick(e);
    const sp=isPick?null:SPELL_BY[e.key];
    const wrap=el("div","csrowwrap");
    const row=el("div","csrow");
    // a pick names a RULE, not a spell, so it reads as its own description rather than a title
    const nm=el("span","csnm"+(isPick?" cspick":""),
      isPick?cap1(csrcPickDesc(e)):(sp?sp.name:e.key.split("|")[0]));
    if(sp)attachSpell(nm,sp);
    row.append(nm);
    // D95: the inline control follows THIS spell's payment, not a source-wide mode. That also
    // means no folded-state tag is needed for it — which way a spell pays is always on screen.
    const pay=spends&&csrcPay(CSRC,e)==="pool";
    const per=spends&&!pay;
    if(pay){
      const c=el("input");c.type="number";c.min=1;c.max=99;c.value=e.cost||1;c.className="csn2";
      c.title="Charges this spell costs";
      c.oninput=()=>{e.cost=Math.max(1,+c.value||1);csrcSyncSummary();};
      row.append(el("span","cslbl","costs"));row.append(c);}
    if(per){
      const n=el("input");n.type="number";n.min=1;n.max=99;n.value=e.count||1;n.className="csn2";
      n.oninput=()=>{e.count=Math.max(1,+n.value||1);csrcSyncSummary();};
      // fixed width, short labels — "per long rest" in a row control pushed the caret around
      const u=el("select");u.className="csunit";
      CSRC_UNITS.forEach(([v,,short])=>u.append(new Option(short,v)));u.value=e.unit||"lr";
      // "at will" has no count to set: grey the number out rather than leave a live field
      // whose value means nothing
      // "at will" has no count; "total" very much does (3 casts, ever) so it stays live
      const syncWill=()=>{const w=u.value==="will";n.disabled=w;n.classList.toggle("off",w);};
      u.onchange=()=>{e.unit=u.value;syncWill();csrcSyncRule();csrcSyncSummary();};
      syncWill();
      row.append(n);row.append(u);}
    // Every row can hold a note, so every row gets the caret — a fixed cast level is extra.
    // A row with something set says so while folded, or the fold would hide it.
    // a pick has no spell key, so rows are identified by key-or-id (D96)
    const rid=csrcRowId(e);
    const canLevel=isPick||(sp&&sp.level>0);
    const minLv=isPick?1:(sp?sp.level:1);
    const open=CSRC_ROW_OPEN.has(rid);
    if(!open){
      if(e.level)row.append(el("span","cslvtag","at "+ROMAN[e.level]));
      if(e.note)row.append(icoEl("spark","csnotetag"));}
    const car=el("button","csrowcar");car.type="button";
    car.setAttribute("aria-label","Per-spell options");
    car.setAttribute("aria-expanded",String(open));
    car.classList.toggle("up",open);
    car.onclick=ev=>{ev.stopPropagation();
      if(open)CSRC_ROW_OPEN.delete(rid);else CSRC_ROW_OPEN.add(rid);
      renderCsrcRows();};
    row.append(car);
    row.append(xBtn(null,()=>{CSRC.spells.splice(i,1);CSRC_ROW_OPEN.delete(rid);
      renderCsrcRows();csrcSyncSummary();}));
    wrap.append(row);
    if(open){
      const sub=el("div","csrowsub");
      // D95: which budget this spell spends. Offered only when the source spends anything at
      // all — "always prepared" and "added to my spell list" have no uses to pay with.
      if(spends){
        const py=el("select");py.className="cspay";
        py.append(new Option("from the charge pool","pool"));
        py.append(new Option("its own uses","per"));
        py.value=csrcPay(CSRC,e);
        py.onchange=()=>{e.pay=py.value;
          // give the newly-relevant field a sane value rather than a silent 1/undefined
          if(e.pay==="pool"&&e.cost==null)e.cost=1;
          if(e.pay==="per"&&!e.unit){e.unit="lr";e.count=e.count||1;}
          renderCsrcRows();csrcSyncRule();csrcSyncSummary();};
        sub.append(py);}
      // No separate "Cast at" label — it wrapped, and a select that names its own options
      // ("as written", "cast at 5th") doesn't need one. Fixed width so the note gets the rest.
      if(canLevel){
        const lv=el("select");lv.className="cslv";lv.append(new Option("as written",""));
        for(let L=minLv;L<=9;L++)lv.append(new Option("cast at "+ROMAN[L],String(L)));
        lv.value=e.level?String(e.level):"";
        lv.onchange=()=>{e.level=lv.value?+lv.value:null;csrcSyncSummary();};
        sub.append(lv);}
      // A note rides the grant (D79's shape), so it lands in the spell modal and on the
      // table's source badge exactly like a feature's own modification note.
      const nt=el("input");nt.type="text";nt.className="csnote";
      nt.placeholder="note — e.g. deals cold damage instead";
      nt.value=e.note||""; nt.spellcheck=false;
      nt.oninput=()=>{e.note=nt.value.trim()||null;};
      sub.append(nt);
      wrap.append(sub);
      if(isPick)wrap.append(csrcFilterEditor(e));}
    box.append(wrap);});
}
// D96: the filter behind a choice row. Three wrapped chip rows — level, class, school — where
// NOTHING ticked means "any", which is the same grammar filterSpells already reads (";"-joined
// values, absent key = unconstrained). Empty-means-any is why these are chips and not selects:
// a select needs an explicit "any" option that then has to be kept in sync with reality.
function csrcChipRow(label,opts,cur,onSet){
  const wrap=el("div","csfrow");
  wrap.append(el("span","csflbl",label));
  const box=el("div","cbrow csfchips");
  const set=new Set(String(cur||"").split(";").filter(Boolean));
  opts.forEach(([v,t])=>{
    const b=el("button","cbtn tiny"+(set.has(v)?" on":""),t);b.type="button";
    b.onclick=()=>{ set.has(v)?set.delete(v):set.add(v);
      // preserve the option order rather than click order, so the description reads stably
      onSet(opts.filter(o=>set.has(o[0])).map(o=>o[0]).join(";")); };
    box.append(b);});
  wrap.append(box);
  return wrap;
}
function csrcFilterEditor(e){
  const box=el("div","csfilter");
  const p=e.pick;
  const redraw=()=>{renderCsrcRows();csrcSyncSummary();};
  const take=el("div","csfrow");
  take.append(el("span","csflbl","Take"));
  const n=el("input");n.type="number";n.min=1;n.max=9;n.value=Math.max(1,p.take||1);n.className="csn2";
  n.oninput=()=>{p.take=Math.max(1,+n.value||1);csrcSyncSummary();
    const t=box.parentNode&&box.parentNode.querySelector(".csnm"); if(t)t.textContent=cap1(csrcPickDesc(e));};
  take.append(n); take.append(el("span","csfnote","spell(s) — nothing ticked below means ANY"));
  box.append(take);
  const swrow=el("div","csfrow");
  swrow.append(el("span","csflbl","Change"));
  const sw=el("select");sw.className="csswap";
  CSRC_SWAP.forEach(([v,t])=>sw.append(new Option(t,v)));
  sw.value=p.swap==null?"lr":p.swap;
  sw.onchange=()=>{p.swap=sw.value;redraw();};
  swrow.append(sw); box.append(swrow);
  box.append(csrcChipRow("Level",ROMAN.map((r,i)=>[String(i),i===0?"cantrip":r]),p.level,
    v=>{p.level=v;redraw();}));
  box.append(csrcChipRow("Class",csrcClassOpts(),p.class,v=>{p.class=v;redraw();}));
  box.append(csrcChipRow("School",Object.entries(SCHOOL_ABBR).filter(([k])=>k!=="P")
    .map(([k,v])=>[k,v.slice(0,4)]),p.school,v=>{p.school=v;redraw();}));
  return box;
}
// the classes actually loaded, deduped by name — a filter offering a class you don't have
// would silently match nothing
function csrcClassOpts(){
  return [...new Set((DATA.classes||[]).map(c=>c.name))].sort().map(n=>[n,n]);
}
function renderCsrcHits(){
  const box=$("#csrcHits"); box.innerHTML="";
  const q=$("#csrcSearch").value.trim().toLowerCase();
  if(q.length<2)return;
  const have=new Set(CSRC.spells.map(e=>e.key));
  DATA.spells.filter(sp=>visible(sp)&&sp.name.toLowerCase().includes(q)&&!have.has(key(sp.name,sp.source)))
    .slice(0,10).forEach(sp=>{
      const r=el("button","cshit");
      r.append(el("span",null,sp.name));
      r.append(el("span","cshl",(sp.level===0?"cantrip":"level "+sp.level)+" · "+sp.school));
      if(sp.source!==CORE)r.append(bookChip(sp.source,sp.page));
      // a new spell defaults to whichever budget the source actually has (D95)
      r.onclick=()=>{CSRC.spells.push({key:key(sp.name,sp.source),count:1,cost:1,unit:"lr",
                                       pay:csrcHasPool(CSRC)?"pool":"per"});
        $("#csrcSearch").value="";box.innerHTML="";renderCsrcRows();csrcSyncSummary();};
      box.append(r);});
}
function saveCsrc(){
  CSRC.name=$("#csrcName").value.trim();
  CSRC.kind=$("#csrcKind").value.trim();
  CSRC.pool=$("#csrcPool").value?Math.max(0,+$("#csrcPool").value||0):null;
  CSRC.recharge=$("#csrcRecharge").value.trim();
  CSRC.dc=$("#csrcDC").value.trim();
  CSRC.atk=$("#csrcAtk").value.trim();
  CSRC.ability=$("#csrcAbility").value;
  // D95: persist the per-spell shape and retire the source-level enum, so a source saved
  // once never falls back through the legacy branch of csrcPay again
  (CSRC.spells||[]).forEach(e=>{ if(e.pay!=="pool"&&e.pay!=="per")e.pay=csrcPay(CSRC,e); });
  delete CSRC.uses;
  if(!CSRC.name){$("#csrcErr").textContent="Give it a name.";return;}
  if(!CSRC.spells.length){$("#csrcErr").textContent="Add at least one spell.";return;}
  const list=state.customSources=state.customSources||[];
  const at=list.findIndex(x=>x.id===CSRC.id);
  if(at>=0)list[at]=CSRC; else list.push(CSRC);
  $("#csrcModal").classList.add("hidden");
  save(); renderCustomSources(); render();
}

// ── source reconciliation on activation (v7 · T2) ──────────────────────────
// Sources are global (D33), so switching to a build authored under other books would show it
// under YOURS. Nothing is ever pruned for that reason: the build keeps every pick, the ones
// whose book is off are flagged, and you are asked once whether to turn those books on.
// `entOf` resolves a stored key back to its entity so we can name what is affected.
function buildGaps(st){
  st=st||serializeState();
  const out=[],books=new Set();
  const add=(kind,o,rawKey)=>{
    // an entity whose whole book isn't loaded (a lean import) is kept by pruneState
    // (D56) — surface it here from its stored key so the bar can name the book
    if(!o){ if(rawKey==null)return; const parts=String(rawKey).split("|");
      out.push({kind,name:parts[0],source:parts[1]||""}); books.add(parts[1]||""); return; }
    if(visible(o))return; out.push({kind,name:o.name,source:o.source});
    if(!srcOn(o.source))books.add(o.source);};
  (st.classes||[]).forEach(r=>{add("class",CLS_BY[r.clsKey],r.clsKey); if(r.subKey)add("subclass",subOfRow(r),r.subKey);});
  if(st.speciesKey)add("species",RACE_BY[st.speciesKey],st.speciesKey);
  (st.feats||[]).forEach(k=>add("feat",FEAT_BY[baseKey(k)],k));
  (st.optFeats||[]).forEach(k=>add("option",OPT_BY[baseKey(k)],k));
  const spells=new Set();
  Object.values(st.chosen||{}).forEach(c=>[...(c.cantrips||[]),...(c.spells||[])].forEach(k=>spells.add(k)));
  Object.values(st.choices||{}).forEach(v=>(Array.isArray(v)?v:[]).forEach(k=>spells.add(k)));
  spells.forEach(k=>add("spell",SPELL_BY[k],k));
  return {refs:out,books};
}
// books the build merely HAD enabled but whose absence breaks nothing — context, not a problem
const idleBooksFor=(b,needed)=>(b.meta.sources||[])
  .filter(c=>!srcOn(c)&&DATA.sources[c]&&!needed.has(c)).length;
function enableBooks(codes){ codes.forEach(c=>SRC.add(c)); saveSources();
  if(state.filters.books)codes.forEach(c=>state.filters.books.add(c));
  save(); refreshAll(); render(); }
// the standing flag: shown whenever the ACTIVE build holds picks from books that are off
function renderGapBar(){
  const bar=$("#gapBar"); if(!bar)return;
  const g=buildGaps();
  if(!g.books.size){bar.classList.add("hidden");bar.innerHTML="";return;}
  bar.innerHTML=""; bar.classList.remove("hidden");
  // two flavours of gap: a loaded book merely turned OFF (one click fixes it) and a
  // book that isn't in the loaded content at all (only a re-import can) — D56
  const off=[...g.books].filter(c=>DATA.sources[c]);
  const absent=[...g.books].filter(c=>!DATA.sources[c]);
  const n=g.refs.filter(r=>!srcOn(r.source)||!DATA.sources[r.source]).length;
  const txt=el("div","gaptxt");
  txt.append(el("b",null,`${n} pick${n===1?"":"s"} need${n===1?"s":""} `
    +(absent.length&&off.length?"books you don’t have loaded or turned on"
      :absent.length?"a book that isn’t loaded — re-import it":"a book you have turned off")));
  txt.append(el("span",null,[...g.books].map(bookName).join(", ")));
  bar.append(txt);
  if(off.length){
    const b=el("button","btn on","Turn them on");
    b.onclick=()=>enableBooks(off);
    bar.append(b);}
  attachTip(txt,tipBlock("Kept, not removed",
    g.refs.filter(r=>!srcOn(r.source)||!DATA.sources[r.source]).slice(0,10).map(r=>`${r.name} (${r.kind}, ${r.source})`).join(" · ")
      + (n>10?` · +${n-10} more`:"")));
}
// asked once, on activation
let SRCASK=null;
function askSources(b,missing,after){
  SRCASK={after};
  const g=buildGaps(b.state);
  const affected=g.refs.filter(r=>missing.has(r.source));
  $("#srcAskSub").textContent=`“${b.meta.character} · ${b.meta.name}” holds ${affected.length} pick`
    +`${affected.length===1?"":"s"} from ${missing.size} book${missing.size===1?"":"s"} you have turned off.`;
  const box=$("#srcAskBooks");box.innerHTML="";
  [...missing].sort((a,c)=>bookName(a).localeCompare(bookName(c))).forEach(c=>{
    const r=el("div","askbook");
    r.append(bookChip(c));r.append(Object.assign(el("span","askname"),{textContent:bookName(c)}));
    const k=affected.filter(x=>x.source===c).length;
    r.append(Object.assign(el("span","askn"),{textContent:`${k} pick${k===1?"":"s"}`}));
    box.append(r);});
  const idle=idleBooksFor(b,missing);
  $("#srcAskNote").textContent="Nothing is removed either way — keep your books and those picks "
    +"stay in the build, flagged."
    +(idle?` It was also built with ${idle} other book${idle===1?"":"s"} nothing depends on; those are left alone.`:"");
  $("#srcAskModal").classList.remove("hidden");
}
// ── prerequisite quick-fix (D41) ───────────────────────────────────────────
// A crossed prerequisite names something concrete — a feat, an optional feature, a species.
// Clicking it offers to take that thing right there: species SWAPS (it's single-valued),
// feats and optional features are added. Enforcement stays soft (D31) — this is a shortcut,
// never a gate: you can still select the blocked entry without satisfying anything.
const PRQPOP=el("div","prqpop hidden");document.body.appendChild(PRQPOP);
document.addEventListener("click",e=>{
  if(!e.target.closest(".prqpop")&&!e.target.closest(".rqp.act"))PRQPOP.classList.add("hidden");});
function prqCandidates(pick){
  const pool=pick.kind==="feat"?DATA.feats:pick.kind==="opt"?DATA.optfeats:DATA.races;
  const hit=[];
  pick.names.forEach(n=>pool.forEach(o=>{
    // species prereqs name a lineage ("Elf") that the entry may qualify ("Elf — Drow")
    const m=pick.kind==="species"?lc(o.name).includes(lc(n)):lc(o.name)===lc(n);
    if(m&&!hit.includes(o))hit.push(o);}));
  // prefer the edition you'd actually see; fall back to every printing if dedupe hides them all
  const vis=hit.filter(reprintOk);
  return vis.length?vis:hit;
}
function prqTake(o,kind){
  // committing from a book you have disabled enables it, or afterSourceChange prunes the pick
  if(!srcOn(o.source)){SRC.add(o.source);saveSources();}
  const k=key(o.name,o.source);
  if(kind==="species")state.speciesKey=k;
  else if(kind==="opt"){if(!state.optFeats.includes(k))state.optFeats.push(k);}
  else if(!state.feats.some(x=>sameEnt(x,k))){state.feats.push(k);setFeatSlot(k,featSlot(o));}
  save();refreshAll();render();
  PRQPOP.classList.add("hidden");
  if(ENT)renderEntityList();
}
function openPrqPop(anchorEl,pick){
  const cands=prqCandidates(pick);
  const noun=pick.kind==="species"?"species":pick.kind==="opt"?"option":"feat";
  PRQPOP.innerHTML="";
  PRQPOP.append(el("div","prqh",cands.length?`Take this ${noun}`:"Nothing matching in your books"));
  const cur=pick.kind==="species"&&RACE_BY[state.speciesKey];
  if(cur)PRQPOP.append(el("div","prqn",`Replaces ${cur.name} — you can only have one species.`));
  cands.slice(0,8).forEach(o=>{
    const row=el("div","prqrow");
    row.append(el("span","prqnm",o.name));
    if(o.source!==CORE)row.append(bookChip(o.source,o.page));
    const b=el("button","tk ico-only");b.append(icoEl("check"));
    const plbl=cur?"Switch to it":"Select";
    b.setAttribute("aria-label",plbl); b.title=plbl;
    b.onclick=e=>{e.stopPropagation();prqTake(o,pick.kind);};
    row.append(b);PRQPOP.append(row);});
  PRQPOP.classList.remove("hidden");
  const r=anchorEl.getBoundingClientRect(),w=PRQPOP.offsetWidth,h=PRQPOP.offsetHeight;
  PRQPOP.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+"px";
  PRQPOP.style.top=(r.bottom+6+h>innerHeight?Math.max(8,r.top-h-6):r.bottom+6)+"px";
}
const sameSet=(a,b)=>!!a&&!!b&&a.size===b.size&&[...a].every(x=>b.has(x));
// what the picker owes you at this level: the feat budget, or the slot's own count
function renderEntBudget(){
  const box=$("#entBudget");if(!box)return;
  if(ENT.kind==="species"){box.classList.add("hidden");return;}
  box.classList.remove("hidden");box.innerHTML="";
  if(ENT.kind==="opt"){
    const have=state.optFeats.filter(k=>{const o=OPT_BY[baseKey(k)];return o&&o.types.some(t=>ENT.slot.types.includes(t));}).length;
    box.append(budgetPill(ENT.slot.name.toLowerCase(),have,ENT.slot.cap,have<ENT.slot.cap));
    return;}
  const b=featBudget();
  box.append(budgetPill("origin",b.originPicked,b.origin,b.originPicked<b.origin));
  box.append(budgetPill("general",b.slotsUsed,b.general,b.slotsUsed<b.general));
  if(b.epic)box.append(budgetPill("epic boon",b.epicPicked,b.epic,b.epicPicked<b.epic));
}
function budgetPill(label,have,cap,owed){
  // the same four states as slotCount: a cap of 0 is "none at this level", not "filled"
  const st=have>cap?"over":!cap?"none":owed?"owed":"done";
  const p=el("span","bpill "+st);
  p.append(el("span","bl",label));p.append(el("span","bv",`${have}/${cap}`));
  p.title=st==="over"?`One too many ${label}`
    :st==="none"?`Your level grants no ${label} yet`
    :st==="owed"?`You still owe ${cap-have} ${label} at this level`:`${label} filled`;
  return p;
}

// ── prepare-daily modal: one step per source that re-prepares each long rest ──
let PREP=null;
const prepCasters=()=>R.casters.filter(r=>!r.static);   // static (level-swap) lists don't re-prepare
// A grant you CHOSE rather than were given: High Elf's Wizard cantrip and its kin. Several
// of them (the 2024 species lineages) are re-chosen on a long rest, which makes this part
// of preparing, not part of building — so they get their own tab here as well as living in
// the Choices card. (The data carries no "swappable" flag: see STATE's backlog.)
const grantedPicks=()=>(R&&R.choices||[]).filter(c=>c.type==="pick"&&c.kind==="known");
function prepSteps(){
  return prepCasters().map(r=>({type:"class",idx:r.idx,label:classLabel(r)}))
    .concat(grantedPicks().length?[{type:"granted",label:"Granted"}]:[]);
}
function openPrepDaily(){ const steps=prepSteps(); if(!steps.length)return;
  PREP={steps,step:0,search:"",levelSet:new Set(),onlyPicked:false};
  $("#prepModal").classList.remove("hidden"); renderPrepStep(); }
const prepStep=()=>PREP&&PREP.steps[PREP.step];
const prepRec=()=>{const st=prepStep();return st&&st.type==="class"?R.casters.find(r=>r.idx===st.idx):null;};
function renderPrepStep(){
  const st=prepStep(); if(!st){ $("#prepModal").classList.add("hidden"); return; }
  $("#prepSearch").value=PREP.search||""; PREP.levelSet=new Set();
  // one generic title; the TAB says which set you are in and the subtitle says what kind
  // of preparation it is and when you may change it — the two facts that differ per tab
  $("#prepTitle").textContent="Spell preparation";
  let sub="";
  if(st.type==="granted"){
    sub="Spells you chose from a grant rather than from a class list. Some sources — the 2024 "
      +"species lineages among them — let you replace the choice after every long rest.";
  } else {
    const rec=prepRec(); if(!rec){ $("#prepModal").classList.add("hidden"); return; }
    const bk=R.cart[rec.idx]&&R.cart[rec.idx].known&&R.cart[rec.idx].known.book;
    sub=bk
      ? `Prepared from your spellbook — pick which of the book's spells are live. Change them after every long rest; the book itself only grows on level-up.`
      : `Prepared from the ${classLabel(rec)} list — any mix of levels up to ${ROMAN[rec.maxLvl]}. Change them freely after every long rest.`;
  }
  const ps=$("#prepSub"); if(ps)ps.textContent=sub;
  const steps=$("#prepSteps"); steps.innerHTML="";
  PREP.steps.forEach((x,i)=>{
    const b=el("button","prepstep"+(i===PREP.step?" on":""),x.label);
    b.onclick=()=>{PREP.step=i;PREP.search="";renderPrepStep();};steps.append(b);});
  $("#prepPrev").style.visibility=PREP.step>0?"":"hidden";
  const last=PREP.step>=PREP.steps.length-1;
  $("#prepNext").style.display=last?"none":"";
  $("#prepDone").style.display=last?"":"none";
  renderPrepSwap();
  renderPrepList();
}
// ── a cantrip replaced on a LONG REST, not on a level-up ───────────────────
// The wizard's cadence (SWAP_RULES cantrip:"lr"), so it belongs beside preparing and
// not on the timeline's arm path. It still edits the acquisition array, so it must
// record a cantrip event or the timeline would show the new cantrip as if it had been
// learned where the old one was. The event lands at the level you are STANDING at
// (D115(e)'s current level, or the top): everything below keeps the cantrip you had.
// Trading the SAME slot again at that level collapses into the standing event —
// original out, newest in — rather than chaining, which the level surface refuses too.
// It lives outside #prepList because the filter re-renders that on every keystroke.
function renderPrepSwap(){
  const host=$("#prepSwap"); if(!host)return; host.innerHTML="";
  const st=prepStep(); if(!st||st.type!=="class")return;
  const rec=prepRec(); if(!rec)return;
  const row=state.classes.find(r=>r.id===rec.idx); if(!row)return;
  if(swapRule(row).cantrip!=="lr")return;
  const name=k=>{const sp=SPELL_BY[k];return sp?sp.name:String(k).split("|")[0];};
  const lv=PREVIEW.level==null?topCharLevel():PREVIEW.level;
  const known=sliceChosen(row).cantrips||[];
  const box=el("div","prepgrp");
  const h=el("div","cghead");
  h.append(el("b",null,"Cantrip swap"));
  h.append(el("span","cgn","One per long rest"));
  h.append(Object.assign(el("div","cgcat"),
    {textContent:`Recorded at L${lv} — below that level the cantrip you traded away is still yours.`}));
  box.append(h);
  host.append(box);
  if(!known.length){box.append(el("div","empty","No cantrip to trade yet."));return;}
  const standing=swapAt(lv,"cantrip"), held=new Set(known);
  const pool=[...R.pool.values()]
    .filter(e=>e.sp.level===0&&e.takers.some(t=>t.idx===rec.idx)&&!held.has(key(e.sp.name,e.sp.source)))
    .map(e=>e.sp).sort((a,b)=>a.name.localeCompare(b.name));
  const line=el("div","swaprow");
  const outSel=el("select"); outSel.append(el("option","","cantrip leaving…"));
  known.forEach(k=>{const o=el("option",null,name(k));o.value=k;outSel.append(o);});
  const inSel=el("select"); inSel.append(el("option","","its replacement…"));
  pool.forEach(sp=>{const o=el("option",null,sp.name);o.value=key(sp.name,sp.source);inSel.append(o);});
  const b=el("button","btn on","Swap");
  line.append(outSel,inSel,b);
  box.append(line);
  const note=el("div","swnote"); box.append(note);
  const say=t=>{note.textContent=t;};
  say(standing&&standing.row!==rec.idx
    ? `L${lv} already records a cantrip swap for another class — clear its pill in the timeline, or move the view to another level.`
    : `Pick the cantrip leaving and the one arriving — ${classLabel(rec)} may replace one after each long rest.`);
  b.onclick=()=>{
    const out=outSel.value, into=inSel.value;
    if(!out||!into){say("Pick both sides first.");return;}
    // one cantrip event per level: an unrelated second trade here would be a chain,
    // which every swap surface refuses — say why rather than overwrite in silence
    if(standing&&(standing.row!==rec.idx||standing.in!==out)){
      say(`L${lv} already records ${name(standing.out)} → ${name(standing.in)}.`
        +" Clear that pill in the timeline first, or make this trade from another level.");
      return;}
    const ch=state.chosen[rec.idx], p=ch?(ch.cantrips||[]).indexOf(out):-1;
    if(p<0){say("That cantrip isn't in the list any more.");return;}
    const from=standing?standing.out:out;
    ch.cantrips[p]=into;
    // traded back to where it started: the level records nothing at all
    if(from===into)clearSwap(lv,"cantrip");
    else recordSwap(lv,"cantrip",{row:rec.idx,out:from,in:into});
    save(); render(); renderPrepStep();
  };
}
// short of the target, exactly on it, or past it — the three states worth a colour
const cntState=(n,cap)=>n>cap?"over":(cap>0&&n===cap)?"ok":"under";
// one spell row, shared by both tabs — name, meta, and an icon-only take button
function prepRow(sp,on,label,onClick){
  const d=el("div","sp"+(on?" chosen":""));
  const nm=el("div","nm",sp.name);attachSpell(nm,sp);d.append(nm);
  const meta=el("div","meta");
  [ROMAN[sp.level],shortSchool(sp.school),shortTime(sp.time),shortRange(sp.range)]
    .filter(Boolean).forEach(x=>meta.append(el("span",null,x)));
  d.append(meta);
  const take=el("div","take");const b=el("button","tk ico-only"+(on?" on":""));
  b.append(icoEl(on?"check":"plus"));
  b.title=label; b.setAttribute("aria-label",label);
  b.onclick=onClick; take.append(b); d.append(take);
  return d;
}
// the Granted tab: every re-choosable grant, each with its own eligible pool
function renderGrantedList(){
  const list=$("#prepList"); list.innerHTML="";
  const q=(PREP.search||"").toLowerCase();
  const picks=grantedPicks();
  let shownTotal=0, held=0, want=0;
  picks.forEach(c=>{
    const cur=state.choices[c.id]||[];
    held+=cur.length; want+=c.count;
    const box=el("div","prepgrp");
    const h=el("div","cghead");
    h.append(el("b",null,c.giver||"Granted"));
    if(c.giverSrc)h.append(bookChip(c.giverSrc,ownerPage(c.owner)));
    h.append(el("span","cgn",`${cur.length}/${c.count}`));
    h.append(Object.assign(el("div","cgcat"),{textContent:cap1(guidePickAsk(c)||fmtDesc(c.desc)||"choose a spell")}));
    box.append(h);
    let pool=filterSpells(c.filter).filter(sp=>(!q||sp.name.toLowerCase().includes(q))
      &&(!PREP.levelSet.size||PREP.levelSet.has(sp.level))
      &&(!PREP.onlyPicked||cur.includes(key(sp.name,sp.source))));
    pool.sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
    if(!pool.length)box.append(el("div","empty","Nothing matches here."));
    pool.slice(0,300).forEach(sp=>{const k=key(sp.name,sp.source);const on=cur.includes(k);
      shownTotal++;
      box.append(prepRow(sp,on,on?"Chosen — click to drop it":"Choose it",()=>{
        let a=state.choices[c.id]||[];
        if(a.includes(k))a=a.filter(v=>v!==k);
        else if(a.length<c.count)a=[...a,k];
        else a=[...a.slice(1),k];        // a single-pick grant SWAPS rather than refusing
        state.choices[c.id]=a; render(); renderPrepStep();}));});
    list.append(box);
  });
  $("#prepCount").innerHTML=`<b class="${cntState(held,want)}">${held} / ${want}</b> <small>chosen</small>`;
  const qo=$("#prepOnly");if(qo){qo.classList.toggle("on",!!PREP.onlyPicked);
    qo.innerHTML=`Picked${held?` <span class="badge">${held}</span>`:""}`;}
  prepLevelFilter(picks.flatMap(c=>filterSpells(c.filter)).map(sp=>sp.level));
  if(!shownTotal&&!picks.length)list.append(el("div","empty","No granted spell choices in this build."));
}
// the level filter is only a filter when there IS more than one level to choose between
function prepLevelFilter(levels){
  const present=[...new Set(levels)].sort((a,b)=>a-b);
  const menu=$("#prepLevelBtn")&&$("#prepLevelBtn").closest(".menu");
  if(menu)menu.classList.toggle("hidden",present.length<2);
  if(present.length<2){PREP.levelSet=new Set();}
  buildToggleRow($("#prepLevels"),present.map(l=>[String(l),l===0?"C":String(l)]),PREP.levelSet,true,renderPrepList);
  const plb=$("#prepLevelBtn");if(plb)plb.innerHTML="Levels"+(PREP.levelSet.size?` <span class="badge">${PREP.levelSet.size}</span>`:"");
}
function renderPrepList(){
  if(prepStep()&&prepStep().type==="granted")return renderGrantedList();
  const rec=prepRec(); if(!rec)return; const list=$("#prepList"); list.innerHTML="";
  const q=(PREP.search||"").toLowerCase(), cart=R.cart[rec.idx];
  // A wizard prepares FROM its spellbook, so the pool is the book and the target set is
  // `prep` — every other caster prepares from its class list into `spells` (D62).
  const book=cart.known&&cart.known.book;
  const field=book?"prep":"spells";
  const cap=book?cart.known.prepares:rec.prepared;
  const cur=new Set((state.chosen[rec.idx]||{})[field]||[]);
  const have=[...cur].map(k=>SPELL_BY[k]).filter(s=>s&&s.level>=1).length, over=have>cap;
  $("#prepCount").innerHTML=`<b class="${cntState(have,cap)}">${have} / ${cap}</b> <small>prepared</small>`;
  let base=book
    ? ((state.chosen[rec.idx]||{}).spells||[]).map(k=>SPELL_BY[k]).filter(sp=>sp&&sp.level>=1)
    : [...R.pool.values()].filter(e=>e.takers.some(t=>t.idx===rec.idx)&&!(e.always&&e.always.has(rec.idx))&&e.sp.level>=1&&e.sp.level<=rec.maxLvl).map(e=>e.sp);
  prepLevelFilter(base.map(s=>s.level));
  const qo=$("#prepOnly");if(qo){qo.classList.toggle("on",!!PREP.onlyPicked);
    qo.innerHTML=`Picked${cur.size?` <span class="badge">${cur.size}</span>`:""}`;}
  let items=base.filter(sp=>(!q||sp.name.toLowerCase().includes(q))&&(!PREP.levelSet.size||PREP.levelSet.has(sp.level))
    &&(!PREP.onlyPicked||cur.has(key(sp.name,sp.source))));
  items.sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
  items.slice(0,400).forEach(sp=>{const k=key(sp.name,sp.source);const on=cur.has(k);
    const d=prepRow(sp,on,on?"Prepared — click to unprepare":"Prepare it",
      ()=>{toggle(rec.idx,k,false,field);renderPrepList();});
    if(on&&over)d.querySelector(".tk").classList.add("over");
    list.append(d);});
  if(!items.length)list.append(el("div","empty",PREP.onlyPicked?"Nothing prepared yet."
    :book?"Your spellbook is empty — copy spells into it first."
         :"No eligible spells at this level yet."));
}

// ── custom spell authoring (stepped) → stored as a Homebrew source ──────────
function saveCustom(){try{localStorage.setItem(LS_CUSTOM,JSON.stringify(CUSTOM||{spells:[]}));}catch(e){storageNotice(e);}}
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
    reprinted:false,supersededBy:null,cls:f.classes.map(k=>{const p=k.split("|");return [p[0],p[1]];}),sub:[],feat:[],race:[]};}
function customPreview(){const sp=customSpellObj();const box=el("div","cpreview");
  box.append(el("div","cpv-h",sp.name||"Untitled spell"));
  box.append(el("div","cpv-sub",metaLine(sp)+(sp.cls.length?" · "+sp.cls.map(c=>c[0]).join(", "):"")));
  const line=el("div","cpv-meta");[cap1(sp.time),sp.range,sp.durTxt,compText(sp)].forEach(x=>line.append(el("span",null,x)));box.append(line);
  const dfn=defenceHTML(sp);if(dfn!=="—"){const d=el("div","cpv-def");d.innerHTML="Defence — "+dfn;box.append(d);}
  if(sp.desc.length){const p=el("div","cpv-desc");p.innerHTML=ccText(sp.desc[0].slice(0,220))+(sp.desc[0].length>220?"…":"");box.append(p);}
  return box;}
function compileCustom(){const sp=customSpellObj();
  if(!sp.name){cerr("Give the spell a name");CSTEP=0;renderCustomStep();return;}
  if(!sp.cls.length){cerr("Tag at least one class list");CSTEP=2;renderCustomStep();return;}
  CUSTOM=CUSTOM||{spells:[]};
  const i=CUSTOM.spells.findIndex(x=>x.name.toLowerCase()===sp.name.toLowerCase());
  if(i>=0)CUSTOM.spells[i]=sp;else CUSTOM.spells.push(sp);
  saveCustom();SRC.add(HB_SRC);saveSources();
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

// ── homebrew manager ───────────────────────────────────────────────────────
// Custom spells were only reachable by finding them in the spell table and opening the
// modal — which needs a build that can already cast them. This lists every one.
function renderHbList(){
  const box=$("#hbList"); if(!box)return; box.innerHTML="";
  const all=((CUSTOM&&CUSTOM.spells)||[]).slice()
    .sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
  const q=($("#hbSearch").value||"").toLowerCase();
  const rows=all.filter(sp=>!q||sp.name.toLowerCase().includes(q));
  $("#hbSub").textContent=all.length
    ? `${all.length} spell${all.length===1?"":"s"}`+(q&&rows.length!==all.length?` · ${rows.length} shown`:"")
    : "";
  if(!all.length){box.append(el("div","empty","No homebrew spells yet — “New spell” writes one."));return;}
  if(!rows.length){box.append(el("div","empty","Nothing matches that."));return;}
  rows.forEach(sp=>{
    const r=el("div","hbrow");
    const main=el("div","hbmain");
    const nm=el("div","hbnm",sp.name); attachSpell(nm,sp); main.append(nm);
    main.append(Object.assign(el("div","hbsub"),
      {textContent:metaLine(sp)+((sp.cls||[]).length?" · "+sp.cls.map(c=>c[0]).join(", "):" · no class list")}));
    r.append(main);
    const acts=el("div","hbacts");
    const ed=el("button","tk ico-only"); ed.append(icoEl("pencil"));
    ed.setAttribute("aria-label","Edit"); ed.onclick=()=>{$("#hbModal").classList.add("hidden");
      openCustom(customFromSpell(sp),true);};
    attachTip(ed,tipBlock("Edit","Opens it in the custom-spell editor."));
    // the icon goes in BEFORE armConfirm, which snapshots innerHTML to restore (D66)
    const del=el("button","tk del ico-only"); del.append(icoEl("trash"));
    del.setAttribute("aria-label","Delete"); del.title="Delete this spell";
    armConfirm(del,null,()=>{deleteCustom(sp);renderHbList();});
    acts.append(ed,del); r.append(acts); box.append(r);});
}
function openHb(){closeMenu();$("#hbSearch").value="";
  $("#hbModal").classList.remove("hidden");renderHbList();}

// ── 5etools importer: parse raw files in-browser via SB_extract ─────────────
let IMPORT_STAGE=[];
function looksLookupFile(j){const ks=Object.keys(j||{});if(!ks.length)return false;const v=j[ks[0]];if(!v||typeof v!=="object")return false;const vv=v[Object.keys(v)[0]];return !!(vv&&typeof vv==="object"&&(vv.class||vv.subclass||vv.feat||vv.race));}
function countFile(j){const parts=[];[["spell","sp"],["class","cls"],["subclass","sub"],["feat","ft"],["race","spc"],["optionalfeature","opt"],["book","bk"]].forEach(([k,l])=>{if(Array.isArray(j[k])&&j[k].length)parts.push(j[k].length+" "+l);});
  if(!parts.length&&looksLookupFile(j))parts.push("lookup");return parts.join(" · ")||"?";}
let STAGE_EXP=false;
function renderImportStage(){const box=$("#importStaged");if(!box)return;box.innerHTML="";
  const n=IMPORT_STAGE.length;
  box.classList.toggle("hidden",!n);
  if(n){
    // a full data folder stages ~180 files; wrapped, that pushed everything below it off
    // the screen. One row that scrolls, expanded on demand — the Access section's pattern.
    box.dataset.exp=STAGE_EXP?"1":"0";
    const bad=IMPORT_STAGE.filter(f=>f.error).length;
    const lbl=el("span","stlabel",`${n} file${n===1?"":"s"}`+(bad?` · ${bad} invalid`:""));
    const chips=el("div","stchips");
    IMPORT_STAGE.forEach((f,i)=>{const chip=el("span","stagechip"+(f.error?" bad":""));
      chip.append(el("span","stnm",f.name));
      chip.append(el("span","k",f.error?"invalid":countFile(f.json)));
      const x=xBtn(null,()=>{IMPORT_STAGE.splice(i,1);renderImportStage();scheduleBuild();});chip.append(x);
      chips.append(chip);});
    const tog=el("button","acc-toggle st-toggle");tog.type="button";tog.textContent="⌄";
    tog.title=STAGE_EXP?"Show as one row":"Show every staged file";
    tog.setAttribute("aria-label",tog.title);
    tog.onclick=()=>{STAGE_EXP=!STAGE_EXP;renderImportStage();};
    box.append(lbl,chips,tog);
  }
  const cb=$("#importClear");if(cb)cb.classList.toggle("hidden",!n);}
// D112: files parse on arrival. Staging is bursty (a zip unpacks 180 files, FileReaders land
// out of order), so the parse runs once the burst settles rather than per file.
let BUILD_TIMER=null;
function scheduleBuild(){clearTimeout(BUILD_TIMER);
  BUILD_TIMER=setTimeout(()=>{BUILD_TIMER=null;buildImport(null,true);},300);}
function cancelBuild(){clearTimeout(BUILD_TIMER);BUILD_TIMER=null;}
// A whole-repository download is gigabytes; a complete 5etools `data` export zips to ~25 MB.
// Reading one means holding the ENTIRE archive in a single ArrayBuffer, so the oversized case
// fails inside the browser as a NotReadableError whose stock text blames "permission problems".
// It is not permissions — it is size. Refuse it up front, by name and by measured size.
const MAX_ZIP=512*1024*1024;
function fsize(b){return b>=1073741824?(b/1073741824).toFixed(1)+" GB":Math.round(b/1048576)+" MB";}
const ZIP_TOOBIG=" Unzip it yourself and stage just the .json files you want — imports <b>add</b> to what "
  +"you already have, so a big collection can go in a few batches.";
async function stageZip(file){const rep=$("#importReport");
  if(file.size>MAX_ZIP){
    rep.innerHTML="<b>"+esc(file.name)+" is "+fsize(file.size)+"</b> — too large for a browser tab to open. "
      +"A complete 5etools <code>data</code> export is about 25 MB zipped."+ZIP_TOOBIG;
    return;}
  try{
    rep.textContent="Reading "+file.name+" ("+fsize(file.size)+")…";
    let buf;
    try{buf=await file.arrayBuffer();}
    catch(_){throw new Error("the browser couldn’t hold a "+fsize(file.size)+" file in memory."
      +" (It reports this as a permission error; it isn’t one.)");}
    // unzipJsonFiles has always taken a progress callback — nothing ever passed one, so a long
    // unpack was indistinguishable from a hang.
    const entries=await window.SB_extract.unzipJsonFiles(buf,(name,i,total)=>{
      rep.textContent="Unpacking "+file.name+" — "+i+"/"+total+": "+name;});
    if(!entries.length){rep.textContent="No recognised 5etools files in "+file.name+".";return;}
    entries.forEach(e=>IMPORT_STAGE.push(e));rep.textContent="";renderImportStage();scheduleBuild();}
  catch(e){rep.innerHTML="Couldn’t read <b>"+esc(file.name)+"</b>: "+esc(e.message||String(e))
      +(file.size>64*1024*1024?ZIP_TOOBIG:"");}}
function stageFiles(fileList){[...fileList].forEach(file=>{
    if(/\.zip$/i.test(file.name)){stageZip(file);return;}
    const rd=new FileReader();
    rd.onload=()=>{try{const j=JSON.parse(rd.result);
      // a bestiary file is mostly monsters this app never uses — slim it before staging
      IMPORT_STAGE.push({name:file.name,json:(window.SB_extract&&window.SB_extract.slimJson)?window.SB_extract.slimJson(j):j});
    }catch(e){IMPORT_STAGE.push({name:file.name,error:true});}renderImportStage();scheduleBuild();};
    rd.onerror=()=>{IMPORT_STAGE.push({name:file.name,error:true});renderImportStage();scheduleBuild();};
    rd.readAsText(file);});}
function importSummary(r){return `${r.spells} spells · ${r.classes} classes · ${r.subclasses} subclasses · ${r.feats} feats · ${r.species} species`
  // Warn on the real symptom — spells no class can reach — not on a missing file. A brew
  // carries its own class access inline, so it needs no lookup and must not be told it does.
  // …and only advise the lookup file when one wasn't supplied. With it present the
  // remainder are spells nothing in the data can cast, which is not a mistake to correct.
  +(r.noAccess?` · ⚠ ${r.noAccess} spell${r.noAccess===1?"":"s"} no class can reach`
    +(r.lookup?"":" — add generated/gendata-spell-source-lookup.json"):"")
  // a file that threw mid-parse left part of a book behind — the exact half-import
  // failure the report exists to surface
  +((r.errors||[]).length?` · ⚠ ${r.errors.length} file${r.errors.length===1?"":"s"} failed: ${r.errors.join(" · ")}`:"");}

// ── additive imports and the book plan (D86) ───────────────────────────────
// An import used to REPLACE everything stored, so adding one brew meant re-staging every
// core file with it. It now MERGES: entities are keyed by name|source and a staged file
// wins only over its own exact record. What ends up stored is decided by ONE list — every
// book you already have plus every book the staged files hold — where a tick means "this
// is in my data". Unticking a book you have removes its content, which is the only way to
// get storage back. Nothing is written until Apply.
const DIGEST_ARRAYS=["spells","classes","subclasses","feats","races","optfeats"];
const ENT_KEY={
  spells:e=>lc(e.name)+"|"+lc(e.source),
  classes:e=>lc(e.name)+"|"+lc(e.source),
  // classSource is part of the identity (D127) — without it the 2024-chassis twin and its
  // 2014 original collide and a merge silently drops 124 of 322 subclass records.
  subclasses:e=>lc(e.className||"")+"|"+lc(e.classSource||"")+"|"+lc(e.shortName||e.name||"")+"|"+lc(e.source),
  feats:e=>lc(e.name)+"|"+lc(e.source),
  races:e=>lc(e.name)+"|"+lc(e.source),
  optfeats:e=>lc(e.name)+"|"+lc(e.source),
};
// A file that merely REFERENCES a book it doesn't declare emits the bare code as that
// book's name and "other" as its group. Letting that win turns "Test Book A" back into
// "TSTA" on the next import, so a real title never loses to a placeholder.
function mergeSources(base,add){
  const out={}; Object.keys(base||{}).forEach(c=>{out[c]=base[c];});
  Object.entries(add||{}).forEach(([c,v])=>{const was=out[c];
    const m=Object.assign({},was,v);
    if(was&&was.name&&was.name!==c&&(!v.name||v.name===c))m.name=was.name;
    if(was&&was.group&&was.group!=="other"&&(!v.group||v.group==="other"))m.group=was.group;
    out[c]=m;});
  return out;
}
function mergeDigests(base,add){
  base=base||emptyDigest(); add=add||emptyDigest();
  const out={meta:Object.assign({},base.meta,add.meta,{imported:true}),
    sources:mergeSources(base.sources,add.sources),
    monsters:Object.assign({},base.monsters||{},add.monsters||{}),
    fullMc:add.fullMc||base.fullMc||FULL_MC, pact:add.pact||base.pact||PACT};
  DIGEST_ARRAYS.forEach(a=>{const kf=ENT_KEY[a],at={},order=[];
    (base[a]||[]).forEach(e=>{const k=kf(e);if(!(k in at))order.push(k);at[k]=e;});
    (add[a]||[]).forEach(e=>{const k=kf(e);if(!(k in at))order.push(k);at[k]=e;});
    out[a]=order.map(k=>at[k]);});
  return out;
}
// keep only the books in `keep`, then RE-COUNT — a source registry that still claims the
// spells you just removed is worse than no registry
function filterDigest(d,keep){
  const out={meta:d.meta,sources:{},monsters:{},fullMc:d.fullMc,pact:d.pact};
  DIGEST_ARRAYS.forEach(a=>{out[a]=(d[a]||[]).filter(e=>keep.has(e.source));});
  // A stat block is NOT filtered by its own book: a bestiary source never reaches the
  // registry (it has no spells or classes to count), so keying on it would drop every
  // creature set. What keeps a monster is a surviving spell REFERENCING it — which also
  // collects the ones whose spell you just removed. D81 still holds: the carousel filters
  // a set for display, it never prunes one.
  const wanted=new Set();
  out.spells.forEach(sp=>(sp.creatures||[]).forEach(k=>wanted.add(k)));
  Object.keys(d.monsters||{}).forEach(k=>{if(wanted.has(k))out.monsters[k]=d.monsters[k];});
  const counter={};
  const cnt=(src,f)=>{(counter[src]=counter[src]||{spells:0,classes:0,subclasses:0,feats:0,species:0})[f]++;};
  out.spells.forEach(e=>cnt(e.source,"spells")); out.classes.forEach(e=>cnt(e.source,"classes"));
  out.subclasses.forEach(e=>cnt(e.source,"subclasses")); out.feats.forEach(e=>cnt(e.source,"feats"));
  out.races.forEach(e=>cnt(e.source,"species"));
  Object.keys(counter).forEach(src=>{const was=(d.sources||{})[src]||{};
    out.sources[src]={name:was.name||src,group:was.group||"other",counts:counter[src]};});
  return out;
}
const digestSize=d=>DIGEST_ARRAYS.reduce((n,a)=>n+((d[a]||[]).length),0);

let PLAN=null;   // {stored, incoming, merged, keep:Set, fresh:Set, report}
function planFromStage(incoming,report,only){
  PLAN_Q="";
  const stored=IMPORTED||emptyDigest();
  const merged=mergeDigests(stored,incoming||emptyDigest());
  const had=new Set(Object.keys(stored.sources||{}));
  const fresh=new Set(Object.keys((incoming&&incoming.sources)||{}).filter(c=>!had.has(c)));
  // Default: everything merged is kept (staging files is itself the choice of what to add).
  // `only` comes from the folder scan, where one file can carry books you did NOT tick — those
  // must not ride along. Books you already HAVE always stay ticked; dropping one is destructive
  // and is only ever done by hand in this panel.
  const keep=only&&only.length
    ? new Set([...had,...only.filter(c=>merged.sources&&merged.sources[c])])
    : new Set(Object.keys(merged.sources||{}));
  PLAN={stored,incoming:incoming||emptyDigest(),merged,report,fresh,keep};
}
// D112: ONE map behind the list — every book you have or staged (from PLAN) plus every book
// the scanned folder offers that you don't (state "available", rendered dim and unticked).
function libAvail(code){return !(PLAN&&(PLAN.merged.sources||{})[code])&&SCAN&&SCAN.books[code];}
function libMap(){
  const map={};
  Object.entries((PLAN&&PLAN.merged.sources)||{}).forEach(([c,s])=>{
    map[c]={name:s.name||c,group:s.group||"other",counts:s.counts||{}};});
  scanBooks().forEach(b=>{if(!map[b.code])
    map[b.code]={name:b.name,group:b.group||"other",counts:b.counts,avail:true};});
  return map;
}
function planCounts(code){
  if(libAvail(code))return scanTotal(SCAN.books[code])+" · in folder";
  const c=(PLAN.merged.sources[code]||{}).counts||{};
  const n=(c.spells||0)+(c.classes||0)+(c.subclasses||0)+(c.feats||0)+(c.species||0);
  return (PLAN.fresh.has(code)?"new · ":"")+n;   // entities, not just spells
}
let PLAN_Q="";
// which books the filter is showing — All / None act on THESE, so a search plus one click is
// how you keep or drop a whole family of books
function planShown(map){
  const all=Object.keys(map);
  const q=PLAN_Q.trim().toLowerCase(); if(!q)return all;
  return all.filter(c=>c.toLowerCase().includes(q)
    ||String(map[c].name||"").toLowerCase().includes(q));
}
function renderImportPlan(){
  const box=$("#importPlan"); if(!box)return;
  if(!PLAN)planFromStage(null,null);
  const map=libMap();
  if(!Object.keys(map).length){box.classList.add("hidden");renderImportPlanFoot();return;}
  box.classList.remove("hidden");
  const shown=planShown(map);
  const list=$("#importPlanList");
  if(shown.length)renderSourceChecklist(list,PLAN.keep,renderImportPlanFoot,new Set(shown),
                                        planCounts,map,{rowClass:c=>libAvail(c)?"avail":null});
  else {list.innerHTML="";list.append(el("div","empty","No book matches that."));}
  const q=$("#importPlanQuick"); q.innerHTML="";
  const f=el("input","planq"); f.type="search"; f.value=PLAN_Q;
  f.placeholder="filter books…"; f.spellcheck=false;
  f.oninput=e=>{PLAN_Q=e.target.value;renderImportPlan();
    const n=$("#importPlanQuick .planq"); if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length);}};
  q.append(f);
  const quick=(label,fn)=>{const b=el("button","btn",label);
    b.onclick=()=>{fn();renderImportPlan();};q.append(b);};
  quick(PLAN_Q?"All shown":"All",()=>shown.forEach(c=>PLAN.keep.add(c)));
  quick(PLAN_Q?"None shown":"None",()=>shown.forEach(c=>PLAN.keep.delete(c)));
  if(PLAN.fresh.size)quick("Only these files",()=>{PLAN.keep.clear();
    Object.keys(PLAN.incoming.sources||{}).forEach(c=>PLAN.keep.add(c));});
  renderImportPlanFoot();
}
function renderImportPlanFoot(){
  if(!PLAN)return;
  // the built-in bundle is not a layer you merge into — it is what shows when nothing is
  // imported. Say so, rather than letting a one-brew import look like it ate everything.
  const note=$("#importPlanNote");
  if(note){const bare=!IMPORTED&&BAKED&&(BAKED.spells||[]).length;
    note.classList.toggle("hidden",!bare);}
  const had=new Set(Object.keys(PLAN.stored.sources||{}));
  const added=[...PLAN.keep].filter(c=>!had.has(c)).length;
  const dropped=[...had].filter(c=>!PLAN.keep.has(c)).length;
  const bits=[`${PLAN.keep.size} book${PLAN.keep.size===1?"":"s"} kept`];
  if(added)bits.push(`+${added} new`);
  if(dropped)bits.push(`−${dropped} removed`);
  $("#importPlanSub").textContent=bits.join(" · ");
  const btn=$("#importApply");
  if(btn){btn.disabled=!PLAN.keep.size;
    btn.textContent=dropped?`Apply (${dropped} book${dropped===1?"":"s"} removed)`:"Apply";
    btn.classList.toggle("danger",!!dropped);}
}
// ── folder scan: index a local library BY BOOK (D92) ───────────────────────────
// A homebrew repository is filed by CATEGORY — spell/, class/, subclass/, collection/ — so one
// brew's content scatters across folders and a "collection" brew keeps its spells in collection/,
// which is why "D&D Beyond Drops" is unfindable by browsing. Point the app at the folder instead:
// it walks every .json ONCE, keeps only a book index (name, creator, counts, which files), and
// throws each parsed file away. Peak memory is the largest single file, not the library.
// Nothing is stored until books are ticked and imported.
let SCAN=null;                 // {books:{code:{…}}, entries, files, bytes, skipped, ms}
let FOLDER=null, SCAN_BUSY=false;

// A directory handle is a live object — localStorage can't hold one, IndexedDB can. It shares
// the one database with the imported content (D93); `handles` is its own store.
async function folderRemember(h){try{await idbPut(HANDLES,"dir",h);}catch(_){}}
async function folderRecall(){try{return (await idbGet(HANDLES,"dir"))||null;}catch(_){return null;}}
async function folderForget(){try{await idbDel(HANDLES,"dir");}catch(_){} FOLDER=null;}
// Permission does NOT survive a reload: a remembered handle must be re-granted, and the grant
// has to be asked for inside a user gesture. `ask` is false on the silent boot check.
async function folderUsable(h,ask){
  if(!h||typeof h.queryPermission!=="function")return false;
  try{ if(await h.queryPermission({mode:"read"})==="granted")return true;
       if(!ask)return false;
       return await h.requestPermission({mode:"read"})==="granted"; }catch(_){return false;}
}
const FSA=()=>typeof window.showDirectoryPicker==="function";

// Both walkers yield the SAME shape — {path, getFile} — so the scan has one code path, and
// both filter through the importer's own zipWanted() rather than a private copy of the rules.
async function folderEntries(handle){
  const out=[];
  const walk=async(dir,base)=>{
    for await(const [name,h] of dir.entries()){
      if(name==="_img"||name.charAt(0)===".")continue;
      const p=base?base+"/"+name:name;
      if(h.kind==="directory"){await walk(h,p);continue;}
      if(/\.json$/i.test(name))out.push({path:p,getFile:()=>h.getFile()});}};
  await walk(handle,"");
  return out;
}
function inputEntries(list){
  return [...list].filter(f=>/\.json$/i.test(f.name)&&!/(^|\/)_img\//.test(f.webkitRelativePath||""))
    .map(f=>({path:f.webkitRelativePath||f.name,getFile:async()=>f}));
}
function scanCreator(path){
  const base=(path.split("/").pop()||"").replace(/\.json$/i,"");
  const i=base.indexOf(";");
  return i>0?base.slice(0,i).trim():"";
}
const SCAN_FIELDS=[["spell","spells"],["class","classes"],["subclass","subclasses"],
  ["feat","feats"],["race","species"],["subrace","species"],["optionalfeature","optfeats"]];
function scanIndex(books,j,path){
  if(!j||typeof j!=="object")return;
  const creator=scanCreator(path);
  const declare=(code,name,group)=>{
    let b=books[code];
    if(!b)b=books[code]={code,name:name||code,group:group||"other",creator,
      counts:{spells:0,classes:0,subclasses:0,feats:0,species:0,optfeats:0},files:[]};
    // a real title always beats a bare code placeholder (same rule as mergeSources)
    if(name&&b.name===code)b.name=name;
    if(group==="brew")b.group="brew";
    else if(group&&group!=="other"&&(!b.group||b.group==="other"))b.group=group;
    if(!b.creator&&creator)b.creator=creator;
    return b;};
  ((j._meta&&j._meta.sources)||[]).forEach(m=>{if(m&&m.json)declare(m.json,m.full||m.abbreviation,"brew");});
  // no `!books[…]` guard: a spell file scanned before books.json leaves a bare-code
  // placeholder, and declare() is what backfills its real title and group
  if(Array.isArray(j.book))j.book.forEach(b=>{if(b&&b.source)declare(b.source,b.name,b.group);});
  SCAN_FIELDS.forEach(([key,field])=>{const arr=Array.isArray(j[key])?j[key]:[];
    arr.forEach(e=>{if(!e||!e.source)return;const b=declare(e.source);
      b.counts[field]++; if(b.files.indexOf(path)<0)b.files.push(path);});});
}
const scanTotal=b=>{const c=b.counts;return c.spells+c.classes+c.subclasses+c.feats+c.species+c.optfeats;};
async function runScan(entries){
  const books={}; let read=0,bytes=0,skipped=0,bad=0;
  const t0=performance.now(), prog=$("#folderProgress"), wanted=window.SB_extract.zipWanted;
  for(let i=0;i<entries.length;i++){
    const e=entries[i];
    if(!wanted(e.path)){skipped++;continue;}
    try{const f=await e.getFile(); bytes+=f.size||0;
      const j=JSON.parse(await f.text());
      scanIndex(books,window.SB_extract.dropFoundryStubs(j),e.path); read++;
    }catch(_){bad++;}
    // yield to the paint loop, or a 1,300-file scan freezes the tab it is reporting into
    if(i%15===0||i===entries.length-1){
      if(prog)prog.textContent=`Scanning ${i+1}/${entries.length} — ${Object.keys(books).length} books so far…`;
      await new Promise(r=>setTimeout(r,0));}
  }
  return {books,read,bytes,skipped,bad,ms:Math.round(performance.now()-t0)};
}
async function scanEntries(entries,label){
  if(SCAN_BUSY)return; SCAN_BUSY=true;
  const prog=$("#folderProgress");
  try{
    if(!window.SB_extract){prog.textContent="Importer failed to load.";return;}
    if(!entries.length){prog.textContent="No .json files in that folder.";return;}
    SCAN=await runScan(entries);
    SCAN.entries=entries;   // kept so Apply re-reads only the ticked books' files
    const n=Object.keys(SCAN.books).length, withC=scanBooks().length;
    prog.innerHTML=`Scanned <b>${esc(label||"folder")}</b> — ${SCAN.read} file${SCAN.read===1?"":"s"}, `
      +`${Math.round(SCAN.bytes/1048576)} MB, <b>${withC}</b> book${withC===1?"":"s"} with content`
      +(n>withC?` (${n-withC} more declare nothing this app uses)`:"")
      +`. Tick what you want below, then Apply.`;
    renderImportPlan();
  }catch(e){prog.textContent="Couldn’t scan that folder: "+(e.message||e);}
  finally{SCAN_BUSY=false;}
}
// a book with no spells/classes/feats/species/optional features is noise in a 1,000-row list
function scanBooks(){return SCAN?Object.values(SCAN.books).filter(b=>scanTotal(b)>0):[];}
// Re-read the files backing `codes` and stage them, exactly as a zip stages. A ticked book's
// files are not the whole import: three file classes register under NO book — the spell-source
// lookup (class access, D91), books.json (titles/groups) and bestiary files (stat blocks live
// with the SPELL that references them, D86) — and the zip path ships them all. Stage every
// scanned file no book claims, alongside the picks.
async function stageScanBooks(codes){
  const want=new Set(); codes.forEach(c=>{const b=SCAN.books[c];if(b)b.files.forEach(p=>want.add(p));});
  if(!want.size)return 0;
  const prog=$("#folderProgress");
  const claimed=new Set();
  Object.values(SCAN.books).forEach(b=>b.files.forEach(p=>claimed.add(p)));
  const wanted=window.SB_extract.zipWanted;
  const entries=(SCAN.entries||[]).filter(e=>want.has(e.path)||(wanted(e.path)&&!claimed.has(e.path)));
  if(!entries.length){prog.textContent="Those files are no longer reachable — rescan the folder.";return 0;}
  // same contract as the unzip path: feature files first, so the form refs a feature adds
  // to a familiar spell are registered before slimJson decides which monsters survive
  entries.sort((a,b)=>window.SB_extract.readOrder(a.path)-window.SB_extract.readOrder(b.path));
  window.SB_extract.resetFormRefs();
  let i=0,staged=0;
  for(const e of entries){
    i++;
    try{const f=await e.getFile();
      const j=window.SB_extract.dropFoundryStubs(JSON.parse(await f.text()));
      // same gate as the unzip path: parse, keep only what the digest can use, slim
      if(j&&window.SB_extract.usefulJson(j)){
        IMPORT_STAGE.push({name:e.path.split("/").pop(),json:window.SB_extract.slimJson(j)});staged++;}
    }catch(_){}
    if(i%5===0||i===entries.length){
      prog.textContent=`Reading ${i}/${entries.length} file${entries.length===1?"":"s"}…`;
      await new Promise(r=>setTimeout(r,0));}
  }
  prog.textContent="";
  renderImportStage();
  return staged;
}
// `auto` marks the parse-on-arrival path (D112): an empty stage quietly clears the incoming
// layer instead of scolding, and an untick you already made survives the re-parse.
function buildImport(only,auto){
  const files=IMPORT_STAGE.filter(f=>!f.error).map(f=>({name:f.name,json:f.json}));
  const rep=$("#importReport");
  const prevKeep=(auto&&PLAN)?new Set(PLAN.keep):null;
  if(!files.length){
    if(auto){planFromStage(null,null);renderImportPlan();rep.textContent="";return;}
    rep.textContent="Stage at least one valid file first.";return;}
  if(!window.SB_extract){rep.textContent="Importer failed to load.";return;}
  rep.textContent="Reading…";
  const res=window.SB_extract.buildDigest(files);const digest=res.digest,report=res.report;
  // was "no spells or classes" — which rejected a perfectly good feats-only or species-only brew
  // (D&D Beyond's Expanded Racial Feats is exactly that). Any entity the app models counts.
  if(!digestSize(digest)){rep.textContent="No spells, classes, feats or species found in these files.";return;}
  planFromStage(digest,report,only); renderImportPlan();
  if(prevKeep){ // a book you unticked stays unticked when another batch lands
    Object.keys(PLAN.merged.sources||{}).forEach(c=>{
      if(!prevKeep.has(c)&&!PLAN.fresh.has(c))PLAN.keep.delete(c);});
    renderImportPlan();}
  rep.innerHTML=`Read ${files.length} file${files.length===1?"":"s"} — ${importSummary(report)}.`
    +` <b>Nothing is stored yet:</b> tick the books below, then Apply.`;
}
// D112: one Apply reconciles everything — a ticked "available" book is read from the scanned
// folder first, then the whole keep-set is stored in one write.
async function applyImport(){
  const rep=$("#importReport"); if(!PLAN||REFRESH_BUSY)return;
  cancelBuild();
  const keepBefore=new Set(PLAN.keep);
  const need=[...keepBefore].filter(c=>!(PLAN.merged.sources||{})[c]&&SCAN&&SCAN.books[c]);
  if(need.length){
    if(SCAN_BUSY)return;
    SCAN_BUSY=true;
    try{await stageScanBooks(need);}finally{SCAN_BUSY=false;}
    buildImport(null,true);
    if(!PLAN)return;
    // the re-parse defaults the keep-set; what you had ticked (and unticked) is the truth
    PLAN.keep=new Set([...keepBefore].filter(c=>(PLAN.merged.sources||{})[c]));
  }
  await applyPlan(rep);
}
// Returns null on success or the failure sentence, the same null-or-a-sentence contract
// importSave uses — the refresh needs the outcome to report it somewhere other than `rep`.
async function applyPlan(rep,refreshed){
  const out=filterDigest(PLAN.merged,PLAN.keep);
  if(!digestSize(out)){const m="That would leave no content at all — keep at least one book.";
    rep.textContent=m;return m;}
  // D111: stamp what made this data, so Refresh can say whether the new parser ran
  out.meta=Object.assign({},out.meta,{importedAt:new Date().toISOString(),
    parser:window.__VERSION__||"dev"});
  const btn=$("#importApply"); if(btn)btn.disabled=true;
  rep.textContent="Storing…";
  const err=await importSave(out);
  if(btn)btn.disabled=false;
  // T7: name what is using the space, never "something went wrong"
  if(err){rep.textContent=err;return err;}
  // a book that is newly here is turned ON; one you removed leaves the selection with it
  const codes=new Set(Object.keys(out.sources));
  PLAN.fresh.forEach(c=>{if(codes.has(c))SRC.add(c);});
  [...SRC].forEach(c=>{if(c!==HB_SRC&&!codes.has(c)&&!(BAKED&&BAKED.sources&&BAKED.sources[c]))SRC.delete(c);});
  SRC.add(HB_SRC); saveSources();
  assembleData();pruneState();
  IMPORT_STAGE=[];renderImportStage();
  planFromStage(null,PLAN.report); renderImportPlan();
  refreshAll();render();renderLibFoot();
  $("#libTabSrc").classList.toggle("hidden",!hasContent());   // onboarding hid it; content is here now
  const nb=Object.keys(out.sources).length;
  const head=refreshed?`Re-imported ${nb} book${nb===1?"":"s"} with parser v${window.__VERSION__||"dev"}.`
    :`<b style="color:var(--good)">Applied.</b> ${nb} book${nb===1?"":"s"} ·`;
  rep.innerHTML=(refreshed?`<b style="color:var(--good)">${head}</b> `:head+" ")
    +`${out.spells.length} spells · ${out.classes.length} classes · ${out.subclasses.length} subclasses · `
    +`${out.feats.length} feats · ${out.races.length} species.`+(refreshed?"":" Close to see it.");
  return null;
}
// ── Refresh imported data (D111 · D129) ────────────────────────────────────────
// One click, then report: re-read the remembered folder with the CURRENT parser and re-import
// exactly the books already stored — no book-picking step, nothing new added. This is how a
// stored digest picks up a parser fix (D127's `_copy` healing is the latest), so "did it
// actually run" is the only question it has to answer.
//
// D129 splits the surfaces. From the ⋯ menu it runs with NO modal and reports into the notice
// bar; the modal opens only where a human is genuinely needed — nothing imported, no remembered
// folder, permission refused, or the folder holds none of your books. Those four are exactly
// the cases whose fix lives in the modal (folder chooser, drop zone). From the Library's Manage
// footer the same states render in place: the button goes busy, `#importReport` carries them.
//
// The gesture chain is load-bearing: folderRecall() then folderUsable(h,true) with NOTHING
// awaited in between, or the permission prompt loses this click's user activation
// (D111 + "a remembered directory handle is not a granted one").
let REFRESH_BUSY=false;   // the WHOLE refresh; SCAN_BUSY only covers a scan or a stage inside it
let RSTAGE="", RTICK=null, RMODAL=false, RSEEN="", RBAR=null, RQUIET=false;
// replace a button's label without touching the icon boot's fillIcons() put inside it
function btnText(b,txt){ if(!b)return;
  [...b.childNodes].forEach(n=>{if(n.nodeType===3)n.remove();});
  b.append(document.createTextNode(txt)); }
// both refresh buttons reflect the one busy flag: whichever started it, neither can start a second
function refreshButtons(){
  [$("#refreshBtn"),$("#importRefresh")].forEach(b=>{ if(!b)return;
    b.disabled=REFRESH_BUSY;
    b.classList.toggle("busy",REFRESH_BUSY);
    btnText(b,REFRESH_BUSY?"Refreshing…":"Refresh imported data"); });
}
// The stage line is ours; the live counters ("Scanning 240/1300…", "Reading 15/48 files…")
// belong to the pipeline, which writes them into #folderProgress. Read that rather than
// threading a callback through the scan and the stage — it costs nothing, and a line left over
// from an earlier scan can't leak in because RSEEN holds what was there when this one started.
function refreshPaint(){
  if(RMODAL||RQUIET)return;               // the modal shows the same thing in place
  // dismissing the progress bar means it stays dismissed; the outcome still gets to speak
  if(RBAR&&!document.getElementById("appNotice")){RQUIET=true;return;}
  const p=$("#folderProgress"); let d=p?(p.textContent||"").trim():"";
  if(d===RSEEN)d="";
  RBAR=appNotice(RSTAGE+(d?" — "+d:""),"busy");
}
function refreshStage(msg){ RSTAGE=msg;
  const rep=$("#importReport"); if(rep)rep.textContent=msg;
  refreshPaint(); }
function refreshStop(){ REFRESH_BUSY=false; RSTAGE="";
  if(RTICK){clearInterval(RTICK);RTICK=null;} refreshButtons(); }
// three terminal states. `done` fades — it is good news and shouldn't outstay it; `fail` and
// `ask` wait to be dismissed, because they name something still undone.
function refreshDone(msg){ refreshStop(); if(!RMODAL)appNotice(msg,"ok",9000); }
function refreshFail(msg){ refreshStop();
  const rep=$("#importReport"); if(rep)rep.textContent=msg;
  if(!RMODAL)appNotice(msg,""); }
// the modal is the surface that can actually fix this one — say why it opened, in both places
function refreshAsk(report,notice){ refreshStop();
  if(RMODAL)setLibTab("man"); else openImport(false,"man");   // openImport closes the ⋯ menu
  const rep=$("#importReport"); if(rep)rep.innerHTML=report;
  if(!RMODAL)appNotice(notice,"ask"); }
const nBooks=n=>n+" book"+(n===1?"":"s");

async function refreshImported(fromModal){
  if(REFRESH_BUSY||SCAN_BUSY)return;
  RMODAL=!!fromModal; REFRESH_BUSY=true; RBAR=null; RQUIET=false;
  RSEEN=(($("#folderProgress")||{}).textContent||"").trim();
  refreshButtons();
  if(!RMODAL)closeMenu();
  const rep=$("#importReport");
  const stored=Object.keys((IMPORTED&&IMPORTED.sources)||{});
  refreshStage("Refreshing imported data…");
  if(!RMODAL)RTICK=setInterval(refreshPaint,180);
  try{
    if(!stored.length)return refreshAsk(
      "Nothing imported yet — Refresh re-reads books you already imported. Drop your 5etools files here first.",
      "Nothing imported yet — import your files in the Library.");
    // openImport's handle recall is fire-and-forget, so on the first click of a session FOLDER
    // is still null and this would fall through to "choose the folder" — a button that only
    // opens the modal. Wait for the recall here; the permission prompt is still inside this
    // click's gesture, which is the whole reason folderUsable takes ask=true. Nothing may be
    // awaited between these two lines.
    if(!FOLDER&&FSA()){try{const h=await folderRecall(); if(h)FOLDER=h; folderButtons();}catch(_){}}
    const granted=FOLDER?await folderUsable(FOLDER,true):false;
    if(granted){
      refreshStage("Reading the folder…");
      try{await scanEntries(await folderEntries(FOLDER),FOLDER.name||"folder");}
      catch(e){return refreshFail("Couldn’t read the remembered folder: "+(e.message||e));}
    }
    // a scan from earlier in this session still counts — the webkitdirectory path has no handle
    if(!SCAN)return refreshAsk(
      FOLDER?"That folder wasn’t opened — permission is asked once per session. <b>Choose it again</b> above, or drop the .zip and Apply."
            :"Refresh needs your 5etools files — <b>choose the folder</b> above (it will be remembered), or drop the .zip and Apply.",
      FOLDER?"Refresh needs the folder — permission wasn’t granted. Choose it in the Library."
            :"Refresh needs the folder — choose it in the Library.");
    const kept=stored.filter(c=>SCAN.books[c]);
    if(!kept.length)return refreshAsk(
      "The scanned folder holds none of your imported books — <b>choose the folder</b> that has them.",
      "Refresh found none of your books in that folder — choose another in the Library.");
    IMPORT_STAGE=[]; cancelBuild();
    refreshStage("Reading "+nBooks(kept.length)+"…");
    SCAN_BUSY=true;
    let staged=0;
    try{staged=await stageScanBooks(kept);}finally{SCAN_BUSY=false;}
    // Nothing staged = nothing re-parsed, and going on would re-store the digest you already
    // had under a NEW parser stamp — a refresh that reports success and changed nothing. That
    // false report is the whole bug this batch is about; stop here instead.
    if(!staged){const why=((($("#folderProgress")||{}).textContent)||"").trim();
      return refreshFail((why||"Couldn’t read those books from the folder.")+" Your imported data is unchanged.");}
    refreshStage("Re-reading with the current parser…");
    buildImport(null,true);
    // buildImport bails on unusable files without touching PLAN — same false-success trap
    if(!PLAN||!Object.keys((PLAN.incoming&&PLAN.incoming.sources)||{}).length)
      return refreshFail("Nothing usable came back from those files. Your imported data is unchanged.");
    PLAN.keep=new Set(stored.filter(c=>(PLAN.merged.sources||{})[c]));
    refreshStage("Storing…");
    const err=await applyPlan(rep,true);
    if(err)return refreshFail(err);
    const n=Object.keys((IMPORTED&&IMPORTED.sources)||{}).length;
    const missed=stored.length-kept.length;
    // "Re-imported 12 books" must not cover books the folder didn't have: those kept their
    // stored data and were not re-parsed by anything.
    const caveat=missed?" "+nBooks(missed)+" weren’t in that folder and kept their stored data.":"";
    if(caveat&&rep)rep.innerHTML+="<br>"+esc(caveat.trim());
    refreshDone("Re-imported "+nBooks(n)+" with parser v"+(window.__VERSION__||"dev")+"."+caveat);
  }finally{ if(REFRESH_BUSY)refreshStop(); }
}
// ── the imported digest is older than the parser (D137) ────────────────────
// `assembleData` hands the IMPORTED digest to the app WHOLE — `IMPORTED||BAKED` — so every
// extractor fix is invisible until the books are re-read, even for records the bundle
// already carries. That has now cost four rounds of "this is still wrong" (D127's `_copy`
// twins, D135's designations and feat slots, D136's Hex and Synaptic Static): the app knew
// which parser made its data (D111 stamps it) and said nothing. It says it here.
// Version-aware and dismissible per version, so it names a real gap once and then stops.
const LS_PARSER_NAG="spellForge.parserNag.v1";
const verParts=v=>String(v||"").split(".").map(n=>parseInt(n,10)||0);
function verLt(a,b){const A=verParts(a),B=verParts(b);
  for(let i=0;i<Math.max(A.length,B.length,3);i++){const x=A[i]||0,y=B[i]||0;
    if(x!==y)return x<y;}
  return false;}
function staleParserNotice(){
  const app=window.__VERSION__; if(!app||!IMPORTED)return;
  const made=(IMPORTED.meta||{}).parser||null;
  // a digest from before D111 carries no stamp at all — that is as stale as it gets
  if(made&&!verLt(made,app))return;
  let seen=null; try{seen=localStorage.getItem(LS_PARSER_NAG);}catch(_){}
  if(seen===app)return;                       // already said for this version, and dismissed
  const n=appNotice(`Your imported books were read by ${made?"parser v"+made:"an older parser"}`
    +` — this is v${app}. Refresh to re-read them and pick up the fixes since.`,"ask");
  const act=el("button","anact","Refresh now");
  act.onclick=()=>{ try{localStorage.setItem(LS_PARSER_NAG,app);}catch(_){}
    n.remove(); refreshImported(false); };
  n.insertBefore(act,n.querySelector(".anx"));
  // the × means "not now", so it must not come back every boot on the same version
  const x=n.querySelector(".anx");
  if(x)x.addEventListener("click",()=>{try{localStorage.setItem(LS_PARSER_NAG,app);}catch(_){}});
}
let LIB_TAB="src";
function setLibTab(t){LIB_TAB=t;
  $("#libTabSrc").classList.toggle("on",t==="src");
  $("#libTabMan").classList.toggle("on",t==="man");
  $("#libSrcPane").classList.toggle("hidden",t!=="src");
  $("#libManPane").classList.toggle("hidden",t!=="man");
  if(t==="src")renderLibSources(); else renderLibFoot();
}
function openImport(welcome,tab){closeMenu();const r=$("#importReport");
  if(r)r.textContent=IMPORTED?"Adding files ADDS to what you have — only identical entries are replaced.":"";
  const w=$("#importWelcome");if(w)w.classList.toggle("hidden",!welcome);
  // no content yet → the Sources tab has nothing to toggle; open straight into Manage
  const bare=!hasContent();
  $("#libTabSrc").classList.toggle("hidden",bare);
  setLibTab(bare?"man":(tab||(welcome?"man":"src")));
  planFromStage(null,null); renderImportPlan();
  renderImportStage(); renderLibFoot();
  $("#importModal").classList.remove("hidden");
  // A remembered folder is recalled SILENTLY — `false` means never prompt for permission here,
  // because a permission request outside a user gesture is refused anyway. The Rescan button
  // asks for real when it is clicked.
  folderButtons();
  if(FSA()&&!FOLDER)folderRecall().then(async h=>{
    if(h&&await folderUsable(h,false)){FOLDER=h;folderButtons();}
    else if(h){FOLDER=h;folderButtons();          // known but not yet granted — Rescan will ask
      const p=$("#folderProgress"); if(p&&!p.textContent)p.textContent="Folder remembered — press “Rescan folder” to re-open it.";}
  });}
// the Manage footer: storage total (D112) and the last-import stamp (D111)
function renderLibFoot(){
  const st=$("#libStore"); if(!st)return;
  const meta=(IMPORTED&&IMPORTED.meta)||{};
  // nothing imported → nothing to remove; the danger row earns its place only when real
  const wipe=$("#importWipe"); if(wipe)wipe.classList.toggle("hidden",!IMPORTED);
  const stamp=$("#importRefresh");
  if(stamp){const when=meta.importedAt?new Date(meta.importedAt).toLocaleDateString():null;
    stamp.title=when?`Last import ${when} · parser v${meta.parser||"?"}`:"Nothing imported yet";}
  st.textContent="";
  if(navigator.storage&&navigator.storage.estimate)
    navigator.storage.estimate().then(e=>{ if(!e||!e.usage)return;
      const mb=e.usage/1048576;
      st.textContent=`imported data ≈ ${mb<1?"<1":Math.round(mb)} MB in this browser`;}).catch(()=>{});
}
async function clearImport(){await importDrop();assembleData();pruneState();refreshAll();render();}
// no-content build (public deploy): pop the import modal in welcome mode, once
let onboardShown=false;
function maybeOnboard(){
  if(hasContent()){onboardShown=false;return;}
  if(onboardShown)return; onboardShown=true;
  openImport(true);}

// ── table view ─────────────────────────────────────────────────────────────
// ── spell-table columns (D29) ──────────────────────────────────────────────
// The registry is the single source of truth: order, label, and how a cell renders.
// The player's order + hidden set is a GLOBAL preference (not part of a build), so it
// lives under its own localStorage key.
const LS_TABLE="spellForge.table.v1";
const TABLE_COLS={
  mark:  {label:"",          fixed:true},
  name:  {label:"Spell",     fixed:true},
  save:  {label:"Save"},
  school:{label:"School"},
  time:  {label:"Time"},
  range: {label:"Range"},
  comp:  {label:"Comp."},
  dur:   {label:"Duration"},
  conc:  {label:"Conc"},
  casts: {label:"Casts"},
  ability:{label:"Ability"},
  build: {label:"Source"},
  book:  {label:"Book"},   // the book the spell is printed in, vs `build` = who grants it
};
const COL_ORDER_DEFAULT=["mark","name","save","school","time","range","comp","dur","conc","casts","ability","build","book"];
const tableOpts={group:"level",order:[...COL_ORDER_DEFAULT],hidden:new Set()};
function loadTableOpts(){ try{const t=JSON.parse(localStorage.getItem(LS_TABLE)||"null");if(!t)return;
  if(t.group)tableOpts.group=t.group;
  if(Array.isArray(t.order)){ // keep only known keys, then append any column added since
    const seen=new Set(t.order.filter(k=>TABLE_COLS[k]));
    tableOpts.order=[...seen].concat(COL_ORDER_DEFAULT.filter(k=>!seen.has(k)));}
  if(Array.isArray(t.hidden))tableOpts.hidden=new Set(t.hidden.filter(k=>TABLE_COLS[k]&&!TABLE_COLS[k].fixed));
 }catch(e){} }
function saveTableOpts(){ try{localStorage.setItem(LS_TABLE,JSON.stringify(
  {group:tableOpts.group,order:tableOpts.order,hidden:[...tableOpts.hidden]}));}catch(e){storageNotice(e);} }
// short recharge label. cantrips / always-known are effectively at-will.
function rechargeShort(recharge,isCantrip){
  const r=String(recharge||"").toLowerCase();
  if(isCantrip||/at will/.test(r))return "at will";
  // "2/long rest", "3× per long rest" (grants + custom sources both emit the × form)
  const m=r.match(/(\d+)\s*(?:[×x\/]|per)?\s*(?:per\s+)?(long|short|dawn|charge)/);
  if(m){const u={l:"LR",s:"SR",d:"dawn",c:"chg"}[m[2][0]];return m[1]+"/"+u;}
  if(/long rest/.test(r))return "1/LR";
  if(/short rest/.test(r))return "1/SR";
  if(/dawn/.test(r))return "1/dawn";
  if(/charge/.test(r))return "chg";
  if(/always/.test(r))return "at will";
  // D95's `total` unit: uses that never come back. Without these the casts list showed a
  // bare "—" for Crook of Rao's Gate, which reads as "no limit" — the exact opposite.
  if(/once only/.test(r))return "1 ever";
  {const t=r.match(/(\d+)\s*times total/); if(t)return t[1]+" ever";}
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
// A source's own numbers, narrowed to what THIS spell actually rolls: the save DC only
// when the spell forces a save, the attack bonus only when it needs an attack roll, both
// only when it needs both. Without it a Staff of Frost quotes "DC 16 · +8" beside Ray of
// Frost — a DC nothing in that spell ever calls for. With no spell record to check
// against, both are stated: an unverifiable case must not read as "there is none" (D31).
function ownNumbers(sp,dc,atk){
  if(!sp)return {dc:dc||null,atk:atk||null};
  return {dc:(sp.save&&sp.save.length)?(dc||null):null, atk:sp.atk?(atk||null):null};
}
function srcTidy(giver){ // "Land · Polar Land" → "Land (Polar)", "Magic Initiate · Wizard Spells" → "Magic Initiate (Wizard)"
  const p=String(giver).split(" · ");
  if(p.length<2)return giver;
  const opt=p.slice(1).join(" · ").replace(/ (Spells|Land)$/,"");
  return `${p[0]} (${opt})`;
}
function classLabel(r){return r.name+(r.viaSub?" ("+r.viaSub.shortName+")":"");}
// The Table tab never shows the class rows, so a build that strips components had no way
// to say so there. Same chips, one place up (D85).
function renderTableCastMods(){
  const card=$("#spellTable")&&$("#spellTable").closest(".card"); if(!card)return;
  let box=card.querySelector(".tblcastmods");
  if(!CASTMODS.length){ if(box)box.remove(); return; }
  if(!box){box=el("div","tblcastmods");
    const body=card.querySelector(".body"); body.insertBefore(box,body.firstChild);}
  box.innerHTML="";
  box.append(el("span","tcmlbl","Your casting"));
  CASTMODS.forEach(m=>{
    const chip=el("span","cmchip"+(m.when?" iffy":""));
    chip.append(icoEl("spark","mi"));
    chip.append(document.createTextNode(castModLabel(m)));
    attachTip(chip,castModTip(m,String(m.drop||"").split("")));
    box.append(chip);});
}
// the rows the sheet holds. Split out of renderTable so the print dialog can say what a
// setting is about to cost without rendering anything.
function tableRows(){
  const rows=[]; const seenSrc=new Set();
  const push=o=>{const kk=key(o.sp.name,o.sp.source)+"|"+o.src; if(seenSrc.has(kk))return; seenSrc.add(kk); rows.push(o);};
  R.casters.forEach(r=>{const cart=R.cart[r.idx];
    const picked=new Set([...(cart.cantrips||[]),...(cart.spells||[])]);
    const book=cart.known&&cart.known.book, prepSet=new Set(cart.prep||[]);
    [...picked].forEach(k=>{const sp=SPELL_BY[k];if(sp)push({sp,src:classLabel(r),type:"prep",
      ability:r.ability,recharge:null,sel:true,idx:r.idx,rkey:k,cantrip:sp.level===0,
      levelSwap:r.static,
      // a wizard's book row is only "prepared" when today's subset holds it (D62)
      inBook:!!book&&sp.level>0, prepared:!book||sp.level===0||prepSet.has(k)});});
  });
  // Everything GRANTED is merged by SPELL (D136): a spell two sources both hand you is ONE
  // row naming both, not the same line twice. It used to fail in both directions — the
  // always-prepared branch read `e.grants[0]` and silently dropped every later giver, while
  // two innate grants produced a row each. A PICK stays its own row: that one is your
  // choice on a class row and the marker column is about that class.
  const grant=new Map();
  const giverOf=(k,mk,giver)=>{ let r=grant.get(k);
    if(!r){ r=mk(); r.givers=[]; r.kinds=new Set(); r.recharges=[]; grant.set(k,r); }
    if(!r.givers.some(x=>x.src===giver.src))r.givers.push(giver);
    r.kinds.add(giver.kind);
    return r; };
  const fill=(r,o)=>{ ["ability","dc","atk","castLv","ownIdx"].forEach(f=>{
    if(r[f]==null&&o[f]!=null)r[f]=o[f];}); };
  [...R.pool.values()].filter(e=>e.grants.length).forEach(e=>{
    const k=key(e.sp.name,e.sp.source);
    e.grants.forEach(g=>{
      const r=giverOf(k,()=>({sp:e.sp,sel:true}),{src:srcTidy(g.src),note:g.note,kind:"free"});
      fill(r,{ability:g.ability,ownIdx:g.srcIdx});});});
  R.freeCasts.forEach(fc=>{ if(fc.choice)return; const sp=grantRec(fc.name); if(!sp)return;
    const kind=fc.swappable?"swap":"cast";
    const r=giverOf(key(sp.name,sp.source),()=>({sp,sel:true}),
      {src:srcTidy(fc.src),note:fc.note,kind});
    if(fc.recharge&&r.recharges.indexOf(fc.recharge)<0)r.recharges.push(fc.recharge);
    fill(r,{ability:fc.ability,dc:fc.dc,atk:fc.atk,castLv:fc.castLv,ownIdx:fc.srcIdx});});
  // A free cast is the stronger fact, so it takes the marker and the cadence; a spell that
  // is ALSO always prepared says so in the marker's tip rather than in a second row.
  grant.forEach(r=>{
    r.type=r.kinds.has("cast")?"cast":r.kinds.has("swap")?"swap":"free";
    r.alsoPrepared=r.type!=="free"&&r.kinds.has("free");
    r.recharge=r.recharges.length?r.recharges[0]:null;
    r.src=r.givers.map(g=>g.src).join(" · ");
    r.note=(r.givers.find(g=>g.note)||{}).note||null;
    push(r);});
  if(PRINT_MODE&&PRINT.eligible)addPreparableRows(push,rows);
  return rows;
}
// Print-only: every spell a DAILY caster could prepare, with an empty box beside it, so
// the list can be prepared on paper. A level-swap caster has nothing to prepare, and a
// wizard's preparable list is its own spellbook — already on the sheet, already marked.
// Anything genuinely picked was pushed first, so `push`'s dedupe keeps its real marker.
function addPreparableRows(push,rows){
  const covered=new Set();
  (R.casters||[]).forEach(r=>{
    if(r.static)return;
    const cart=R.cart[r.idx]; if(cart&&cart.known&&cart.known.book)return;
    covered.add(r.idx);
    [...R.pool.values()].forEach(e=>{
      if(e.sp.level<1||e.sp.level>r.maxLvl)return;
      if(!e.takers.some(t=>t.idx===r.idx))return;
      push({sp:e.sp,src:classLabel(r),type:"prep",ability:r.ability,recharge:null,sel:true,
        idx:r.idx,rkey:key(e.sp.name,e.sp.source),cantrip:false,levelSwap:false,
        prepared:false,blank:true});});
  });
  // Printing the whole list means preparing on paper from scratch — so today's picks get
  // the same empty box as everything else. Marking them differently states a decision the
  // sheet exists to let you re-make. A cantrip is not prepared, and neither an
  // always-prepared grant nor an innate cast is yours to choose, so those keep their marks.
  rows.forEach(r=>{ if(r.type==="prep"&&covered.has(r.idx)&&r.sp.level>0)r.blank=true; });
}
function renderTable(){
  renderTableCastMods();
  TABLE_MM=activeMetamagic();
  const rows=tableRows();
  if(PRINT_MODE)PRINT_ROWS=rows;

  const tbl=$("#spellTable");tbl.innerHTML="";
  $("#tableChip").textContent=rows.length?rows.length+" spell"+(rows.length===1?"":"s"):"";
  $("#tableEmpty").textContent=rows.length?"":"Nothing selected yet — pick spells in the Build tab (or use Prepare daily); subclass/feat/species grants appear here too.";
  const prepBtn=$("#prepDailyBtn");if(prepBtn)prepBtn.style.display=prepSteps().length?"":"none";
  if(!rows.length)return;


  const g=tableOpts.group;                 // outer grouping; level is always the inner group
  const outer=g==="ability"||g==="source";
  // Grouping by source groups by WHERE IT CAME FROM, and a subclass, a class feature and
  // an invocation all came from the class — splitting Light Domain out of Cleric answers a
  // question nobody asked at the table. Only a genuinely separate source (a feat, an item,
  // your species) keeps its own group; a feat that ADDS to your list isn't one of those,
  // because those spells were picked as the class and already carry its row.
  const ownerIdx=r=> r.idx!=null?r.idx:(r.ownIdx!=null?r.ownIdx:null);
  const casterOf=i=>(R.casters||[]).find(c=>c.idx===i);
  const outerKey=r=>{ if(g==="ability")return r.ability||"zzz";
    const o=ownerIdx(r); return o!=null?"c"+o:"s"+r.src; };
  const outerLabel=r=>{ if(g==="ability")return ABIL[r.ability]||"Other casting";
    const o=ownerIdx(r), c=o!=null&&casterOf(o); return c?classLabel(c):r.src; };
  rows.sort((a,b)=> (outer?String(outerKey(a)).localeCompare(String(outerKey(b))):0) || a.sp.level-b.sp.level || a.sp.name.localeCompare(b.sp.name));

  // grouping already carries a fact, so its column is suppressed on top of the hidden set
  // Grouping by source used to suppress the Source column, because the header said the
  // same thing. Since D104 the header says the CLASS — so the column is the only place
  // left that names Light Domain rather than Cleric, and it stays.
  const suppressed=new Set(g==="ability"?["ability"]:g==="source"?["ability"]:[]);
  const cols=visibleCols(suppressed);
  // a real thead/tbody, not a bare header row: `display:table-header-group` is what
  // repeats the column names on every printed page, and a three-page spell list
  // without them is unreadable at the table.
  const hrow=el("tr");cols.forEach(k=>hrow.append(el("th",k==="name"?"nm":null,TABLE_COLS[k].label)));
  const thead=el("thead");thead.append(hrow);tbl.append(thead);
  const tbody=el("tbody");tbl.append(tbody);
  attachTip(hrow.firstChild,tipBlock("Preparation status","Hover a marker for what it means."));
  const span=cols.length;

  let lastOuter=null,lastLevel=null,groupN=0;
  rows.forEach(row=>{const {sp,type,recharge,sel}=row; const src=row.src;
    if(outer){const ok=outerKey(row); if(ok!==lastOuter){lastOuter=ok;lastLevel=null;
      const gr=el("tr","grouphdr outer");const td=el("td");td.colSpan=span;
      if(g==="ability"){td.innerHTML=`<span class="abname ${row.ability||""}">${esc(outerLabel(row))}</span>`;}
      else{td.append(el("span",null,outerLabel(row)));
        const grp=rows.filter(x=>outerKey(x)===ok);
        // an item casts on its OWN numbers (D100); grouped by source the suppressed
        // Ability column was the only table surface carrying them — the header says them
        if(ownerIdx(row)==null){
          const dc=[...new Set(grp.map(x=>x.dc).filter(Boolean))],atk=[...new Set(grp.map(x=>x.atk).filter(Boolean))];
          const num=[dc.length?"DC "+dc.join("/"):"",atk.length?"atk "+atk.join("/"):""].filter(Boolean).join(" · ");
          if(num)td.append(el("span","hdr-own",num));}
        const abils=[...new Set(grp.map(x=>x.ability).filter(Boolean))];
        if(abils.length){const w=el("span","hdr-abils");w.innerHTML=abils.map(abChip).join("");td.append(w);}}
      gr.append(td);tbody.append(gr);}}
    if(sp.level!==lastLevel){lastLevel=sp.level;
      const brk=PRINT_MODE&&PRINT.brk&&groupN++>0;
      const gr=el("tr","grouphdr lvl"+(brk?" pgbrk":""));const td=el("td");td.colSpan=span;
      td.append(el("span",null,sp.level===0?"Cantrips":ROMAN[sp.level]+" level"));
      gr.append(td);tbody.append(gr);}
    // in the book but not prepared today: real, castable-if-you-prepare-it, but not live
    const tr=el("tr",!sel?"unsel":(row.inBook&&!row.prepared)?"unprep":"");
    cols.forEach(k=>{const td=cellFor(k,row);
      if(td.textContent==="—")td.classList.add("nil");   // an empty slot reads quieter than a value
      tr.append(td);});
    tbody.append(tr);
  });
}
// column menu: a checkbox per column, drag a row to move it (D29). Fixed columns
// (the prepare marker and the spell name) can be neither hidden nor moved.
function renderColMenu(){
  const box=$("#tColList");if(!box)return;box.innerHTML="";
  let dragKey=null;
  tableOpts.order.forEach(k=>{const def=TABLE_COLS[k];if(!def)return;
    const row=el("div","colrow"+(def.fixed?" fixed":""));
    row.draggable=!def.fixed;
    const cb=el("input");cb.type="checkbox";cb.checked=!tableOpts.hidden.has(k);cb.disabled=!!def.fixed;
    cb.onchange=()=>{cb.checked?tableOpts.hidden.delete(k):tableOpts.hidden.add(k);saveTableOpts();renderTable();};
    row.append(cb);
    row.append(el("span","collbl",def.label||"Prepared"));
    if(!def.fixed)row.append(icoEl("grip","colgrip"));
    row.ondragstart=e=>{dragKey=k;e.dataTransfer.effectAllowed="move";row.classList.add("dragging");};
    row.ondragend=()=>{dragKey=null;box.querySelectorAll(".colrow").forEach(r=>r.classList.remove("dragging","dropinto"));};
    row.ondragover=e=>{if(!dragKey||dragKey===k||def.fixed)return;e.preventDefault();row.classList.add("dropinto");};
    row.ondragleave=()=>row.classList.remove("dropinto");
    row.ondrop=e=>{e.preventDefault();row.classList.remove("dropinto");
      if(!dragKey||dragKey===k||def.fixed)return;
      const o=tableOpts.order.filter(x=>x!==dragKey);
      o.splice(o.indexOf(k),0,dragKey);
      tableOpts.order=o;saveTableOpts();renderColMenu();renderTable();};
    box.append(row);});
}
// the visible columns, in the player's order, minus hidden and grouping-suppressed ones
function visibleCols(suppressed){
  return tableOpts.order.filter(k=>TABLE_COLS[k]&&!tableOpts.hidden.has(k)&&!(suppressed&&suppressed.has(k)));
}
// one cell. Every column renders here so the order in tableOpts is the only thing that
// decides layout — nothing is positional any more.
// a cell whose value was abbreviated to keep the column narrow — hovering restores it.
// Only attaches when the two actually differ, so unshortened cells stay inert.
function shortCell(short,full,label){
  const td=el("td",null,short||"—");
  if(full&&String(short)!==String(full)){td.classList.add("abbr");attachTip(td,tipBlock(label,String(full)));}
  return td;
}
// a spell is "also with your spell slots" if it's an eligible pool spell for a caster.
// Module scope on purpose: cellFor() below is top-level and calls it.
const slotCastable=sp=>{const e=R.pool.get(key(sp.name,sp.source));return !!(e&&e.takers.length);};
// ── metamagic applicability tags (D123) ────────────────────────────────────
// Which SELECTED metamagic options can touch a given spell, judged from digest fields
// alone — advisory (D31): a tag says the option's core condition holds, never that
// every clause of the prose was checked. Options that apply to nearly everything
// (Subtle Spell) are deliberately absent — a tag on every row says nothing. Predicates
// are hand-authored on the XPHB wording and keyed by NAME, so PHB reprints ride along.
const METAMAGIC_WHEN={
  "Careful Spell":{tag:"careful",test:sp=>(sp.save||[]).length>0,
    why:"forces a saving throw, so chosen creatures can be spared"},
  "Distant Spell":{tag:"distant",test:sp=>sp.rcat==="ranged"||sp.rcat==="touch",
    why:"has a range to double (touch becomes 30 feet)"},
  "Empowered Spell":{tag:"empower",test:sp=>(sp.dmg||[]).length>0,
    why:"rolls damage, so dice can be rerolled"},
  "Extended Spell":{tag:"extend",test:sp=>/minute|hour|day/i.test(sp.durTxt||""),
    why:"lasts a minute or longer, so the duration can double"},
  "Heightened Spell":{tag:"heighten",test:sp=>(sp.save||[]).length>0,
    why:"forces a saving throw, and one save can be made with disadvantage"},
  "Quickened Spell":{tag:"quicken",test:sp=>sp.tcat==="action",
    why:"takes an action to cast, which can become a bonus action"},
  // `atk` is a BOOLEAN on the record, not a list: `(sp.atk||[]).length>0` reads
  // `undefined>0`, so this chip could never appear on any spell
  "Seeking Spell":{tag:"seek",test:sp=>!!sp.atk,
    why:"makes an attack roll, and a miss can be rerolled"},
  "Transmuted Spell":{tag:"transmute",
    test:sp=>(sp.dmg||[]).some(d=>["acid","cold","fire","lightning","poison","thunder"].includes(d)),
    why:"deals a damage type Transmuted Spell can change"},
  "Twinned Spell":{tag:"twin",
    test:sp=>Array.isArray(sp.higher)&&/target one additional/i.test(sp.higher.join(" ")),
    why:"can target one additional creature from a higher slot — Twinned adds one without spending it"},
};
// the taken metamagic options with a predicate, and the class rows whose own
// progressions grant Metamagic — tags only make sense on that class's spells
let TABLE_MM=null;
function activeMetamagic(){
  const taken=state.optFeats.map(k=>OPT_BY[baseKey(k)])
    .filter(o=>o&&(o.types||[]).includes("MM")&&METAMAGIC_WHEN[o.name]);
  if(!taken.length)return null;
  const rows=new Set();
  state.classes.forEach(r=>[CLS_BY[r.clsKey],subOfRow(r)].forEach(src=>{
    if(src&&(src.optFeatures||[]).some(p=>(p.types||[]).includes("MM")))rows.add(r.id);}));
  return rows.size?{rows,opts:[...new Map(taken.map(o=>[o.name,o])).values()]}:null;
}
function cellFor(k,row){
  const {sp,type,recharge}=row, src=row.src;
  if(k==="mark"){
    // read-only status indicator: ✓ always-prepared · ● prepared today · ✦ innate
    const ind=el("td","pickcell");
    // print-only: a spell you COULD prepare, waiting for a pencil
    if(row.blank){ind.append(el("span","prepbox"));return ind;}
    // a merged row (D136) may hold both facts: the free cast takes the marker, and the
    // always-prepared half says so here rather than in a row of its own
    const alsoP=row.alsoPrepared?" It is also always prepared by another source.":"";
    if(type==="free"){ind.innerHTML=ICONS.check;ind.classList.add("always");attachTip(ind,tipBlock("Always prepared","A free grant — it doesn’t count against your prepared list."));}
    else if(type==="swap"){ind.innerHTML=ICONS.dot;ind.classList.add("on");attachTip(ind,tipBlock("Prepared","Swappable on a long rest — change it in Choices."+alsoP));}
    else if(type==="cast"){ind.innerHTML=ICONS.spark;ind.classList.add("innate");attachTip(ind,tipBlock("Innate / free cast","Cast without preparing it."+(recharge?" Cadence: "+recharge+".":"")+alsoP));}
    else if(sp.level===0){ind.innerHTML=ICONS.dot;ind.classList.add("on");attachTip(ind,tipBlock("Cantrip","Always known — not re-prepared daily."));}
    else if(row.inBook&&!row.prepared){ind.innerHTML=ICONS.book;ind.classList.add("inbook");
      attachTip(ind,tipBlock("In your spellbook, not prepared","A wizard knows every spell in its book but casts only the ones prepared after a long rest. Use Prepare daily."));}
    else if(row.inBook){ind.innerHTML=ICONS.dot;ind.classList.add("on");
      attachTip(ind,tipBlock("Prepared today","Chosen from your spellbook this long rest — change it with Prepare daily."));}
    else if(row.levelSwap){ind.innerHTML=ICONS.dot;ind.classList.add("on");attachTip(ind,tipBlock("Known","This class learns spells on level-up, not daily — you can swap one whenever you gain a level."));}
    else{ind.innerHTML=ICONS.dot;ind.classList.add("on");attachTip(ind,tipBlock("Prepared today","Change it with Prepare daily."));}
    return ind;}
  if(k==="name"){const td=el("td","nm");
    // with cards on, the name is a same-document link — which is what a PDF turns into
    // clickable internal navigation. The FIRST row for a spell carries the return anchor.
    if(PRINT_MODE&&PRINT.cards){
      const back="row-"+cardId(sp); if(!document.getElementById(back))td.id=back;
      const a=el("a",null,sp.name); a.href="#"+cardId(sp); td.append(a);
    } else td.textContent=sp.name;
    attachSpell(td,sp);
    if(sp.ritual)td.append(Object.assign(el("span"),{textContent:" R",style:"color:var(--gold);font-size:10px;font-weight:700"}));
    // D124: metamagic tags moved OUT of the table rows, into the spell details —
    // METAMAGIC_WHEN/activeMetamagic feed that surface now
    return td;}
  if(k==="save"){const td=el("td","savecell");td.innerHTML=defenceHTML(sp);return td;}
  if(k==="school")return shortCell(shortSchool(sp.school),sp.school,"School");
  if(k==="time")return shortCell(shortTime(sp.time),cap1(sp.time),"Casting time");
  if(k==="range")return shortCell(shortRange(sp.range),sp.range,"Range");
  if(k==="comp")return compCell(sp,row);
  if(k==="dur")return shortCell(shortDuration(sp.durTxt),
    (sp.conc?"Concentration, up to ":"")+sp.durTxt,"Duration");
  if(k==="conc"){const td=el("td",sp.conc?"concmark":"");
    if(sp.conc)td.innerHTML=ICONS.check; else td.textContent="—"; return td;}
  if(k==="ability"){const td=el("td");
    const own=ownNumbers(sp,row.dc,row.atk);
    if(own.dc||own.atk){
      td.innerHTML=`<span class="ownnum">${esc([own.dc?"DC "+own.dc:"",own.atk||""].filter(Boolean).join(" · "))}</span>`;
      const what=own.dc&&own.atk?"save DC and attack bonus":own.dc?"save DC":"attack bonus";
      attachTip(td,tipBlock("The source's own numbers",
        "This is cast by "+(row.src||"a source")+" using its own "+what+", not your spellcasting."));
      return td;}
    // a spell that rolls neither states the casting ability like any other row
    td.innerHTML=row.ability?abChip(row.ability):"—";return td;}
  if(k==="casts"){
    // innate recharge, with * when the spell is also castable via your own slots.
    // A merged row (D136) whose givers disagree names every cadence — one of them standing
    // for all would say a source gives you something it doesn't.
    const td=el("td");
    const many=(row.recharges||[]).length>1?row.recharges:null;
    const lab=many?many.map(x=>rechargeShort(x,sp.level===0)).join(" · ")
      :(recharge?rechargeShort(recharge,sp.level===0):"—");
    if(!many&&recharge&&lab!=="at will"&&lab!=="—"&&slotCastable(sp)){
      td.textContent=lab;const ast=el("sup","ast","*");ast.title="Also castable with your spell slots";td.append(ast);
      td.classList.add("hasast");td.onclick=()=>{td.firstChild.textContent=lab+" (also with your spell slots)";td.classList.remove("hasast");};
    } else td.textContent=lab;
    return td;}
  if(k==="build"){const td=el("td");
    // one badge per giver: a spell two sources grant is ONE row (D136), and each giver keeps
    // its own tint and its own note — a joined string would lose both
    const givers=(row.givers&&row.givers.length)?row.givers:[{src,note:row.note,kind:type}];
    givers.forEach(g=>{
      const b=el("span","srcbadge"+(g.kind==="free"?" free":g.kind==="cast"?" cast":""),g.src);
      if(g.note){b.classList.add("hasnote");attachTip(b,tipBlock(g.src,g.note));}
      td.append(b);});
    // a casting-rule change belongs on the source that caused it — the struck letter in
    // Comp. says WHAT changed, this says which feature did it (D85)
    const eff=compEffect(sp,modsForSpell(sp,row));
    if(eff.why.length){const m=el("span","cmmark"+(eff.gone.size?"":" iffy"));
      m.append(icoEl("spark"));
      attachTip(m,eff.why.map(x=>castModTip(x,String(x.drop||"").split(""))).join("<hr>"));
      td.append(m);}
    return td;}
  if(k==="book"){const td=el("td");td.append(bookChip(sp.source,sp.page));return td;}
  return el("td",null,"—");
}
// V S M as plain letters. The M carries the state: gold when the material has a price
// you keep, accent when the spell consumes it. What the material actually IS, and what it
// costs, lives in a popover on the M — the column stays narrow. gp is the readable unit
// (5etools stores cost in copper).
const gpOf=c=>{const gp=c/100;return (gp>=1?(Number.isInteger(gp)?gp:+gp.toFixed(2)):+gp.toFixed(2))+"gp";};
// the 5etools material text restates the price and the consuming — both of which now have
// their own field, so strip them out and leave the line saying only what the thing IS
function matText(c){
  let t=(c.mat||"a material component").replace(/\.\s*$/,"");
  if(c.consume)t=t.replace(/,?\s*(?:which|that)\s+(?:the\s+spell|it)\s+consumes\s*$/i,"");
  if(c.cost)t=t.replace(/^[\d,]+\s*(?:gp|sp|cp)\s+worth\s+of\s+/i,"")
               .replace(/\s+worth\s+(?:at\s+least\s+)?[\d,]+\+?\s*(?:gp|sp|cp)\b/i,"");
  t=t.replace(/[\s,]+$/,"");
  return t||(c.mat||"a material component");
}
// ── casting-rule modifications (D85) ───────────────────────────────────────
// A class or subclass may change HOW you cast spells you ALREADY have — strip a component
// from a whole school, from a class's list, from four named spells. The extractors carry
// that as `castMods` on the class/subclass record (5etools has no field for it); here we
// resolve which are live at the build's level and which of them reach a given spell.
// `when` is the honest half: a condition the app cannot verify ("by spending Sorcery
// Points") never strikes a component out — it marks it, and says why.
let CASTMODS=[];
// the names of the optional features you have taken of a given type — a cast mod scoped to
// "your Elemental Disciplines" has to know which ones you actually picked
function optNamesOfType(types){
  const want=new Set(types||[]);
  return state.optFeats.map(k=>OPT_BY[baseKey(k)]).filter(o=>o&&(o.types||[]).some(t=>want.has(t)))
    .map(o=>o.name);
}
function activeCastMods(){
  const out=[];
  state.classes.forEach(row=>{
    const lv=effLevel(row); if(!lv)return;
    const cls=CLS_BY[row.clsKey];
    const push=(ent,kind)=>{ if(!ent||!ent.castMods)return;
      ent.castMods.forEach(m=>{ if(lv<(m.level||1))return;
        out.push(Object.assign({},m,{
          giver:kind==="subclass"?(ent.shortName||ent.name):ent.name,
          kind, clsName:(cls&&cls.name)||"", rowId:row.id}));});};
    push(cls,"class"); push(subOfRow(row),"subclass");
  });
  return out;
}
// which live mods reach this spell. `row` is a spell-table row when there is one — it
// says WHICH class is casting, which no property of the spell can.
function modsForSpell(sp,row){
  if(!CASTMODS.length||!sp)return [];
  const label=row&&row.src?String(row.src):"";
  return CASTMODS.filter(m=>{const sc=m.scope||{};
    // "a Warlock spell" means one you cast THROUGH that class. A row labelled with the
    // class is one; so is a row whose giver is the very feature's own class or subclass —
    // a spell your Undead patron hands you is still a Warlock spell. Anything else is left
    // alone: under-marking is the safe error here, over-marking would strike a component
    // you actually need.
    if(sc.cls){
      let ok=false;
      // a class-cast row knows its own class outright — no string matching needed
      if(row&&row.idx!=null&&R&&R.casters){const rec=R.casters.find(r=>r.idx===row.idx);
        ok=!!rec&&rec.name===sc.cls;}
      // a GRANT row carries the class row it came from, so it matches exactly. The giver's
      // NAME is only a last resort, and only when nothing better is on the row — matching it
      // loosely is how a Shadow Sorcerer's Darkness could pick up the Shadow Monk's feature.
      else if(row&&row.ownIdx!=null&&R&&R.casters){const rec=R.casters.find(r=>r.idx===row.ownIdx);
        ok=!!rec&&rec.name===sc.cls;}
      else if(label)ok=label.indexOf(sc.cls)>=0||label.indexOf(m.giver)>=0;
      else ok=(sp.cls||[]).some(c=>c[0]===sc.cls);   // no row at all (the spell modal)
      if(!ok)return false;}
    if(sc.schools&&sc.schools.indexOf(sp.school)<0)return false;
    if(sc.spells&&!sc.spells.some(n=>lc(n)===lc(sp.name)))return false;
    if(sc.maxLevel!=null&&sp.level>sc.maxLevel)return false;
    // the label of whatever granted it — a subclass's own spell list
    if(sc.giver&&label.indexOf(sc.giver)<0)return false;
    // granted by one of YOUR optional features of that type (Elemental Disciplines)
    if(sc.optTypes&&!optNamesOfType(sc.optTypes).some(n=>label.indexOf(n)>=0))return false;
    return true;});
}
// what those mods do to THIS spell's components: `gone` is struck through, `iffy` is
// merely marked. A component the spell doesn't have, or a Material the feature exempts
// because it costs money or is consumed, is not touched at all.
function compEffect(sp,mods){
  const c=sp.comp||{}, gone=new Set(), iffy=new Set(), why=[];
  (mods||[]).forEach(m=>{ let hit=!String(m.drop||"").length;   // no `drop` = a free cast
    String(m.drop||"").split("").forEach(L=>{
      if(!c[L])return;
      if(L==="m"&&m.exceptCostly&&(c.cost||c.consume))return;
      hit=true; (m.when?iffy:gone).add(L);});
    if(hit)why.push(m);});
  gone.forEach(L=>iffy.delete(L));        // an unconditional drop outranks a conditional one
  return {gone,iffy,why};
}
const CMOD_LETTER={v:"Verbal",s:"Somatic",m:"Material"};
const castModLabel=m=>m.label||`${m.feature} — no ${String(m.drop||"").split("").map(L=>CMOD_LETTER[L]).join(" / ")}`;
function castModTip(m,letters){
  const eff=letters.filter(Boolean).length?[["Removes",esc(letters.map(L=>CMOD_LETTER[L]).join(", "))]]:[];
  return tipRows(m.giver+" · "+m.feature, eff
    .concat(m.when?[["Only",esc(m.when)]]:[])
    .concat(m.exceptCostly?[["Except",'a Material component with a cost, or one the spell consumes']]:[]))
    +`<p style="margin-top:6px">${ccText(m.note)}</p>`;
}
// one sentence per class row, under it, so adding a class TELLS you it changed your casting
function castModLine(rowId){
  const mine=CASTMODS.filter(m=>m.rowId===rowId);
  if(!mine.length)return null;
  const box=el("div","castmods");
  mine.forEach(m=>{
    const chip=el("span","cmchip"+(m.when?" iffy":""));
    chip.append(icoEl("spark","mi"));
    chip.append(document.createTextNode(castModLabel(m)));
    attachTip(chip,castModTip(m,String(m.drop||"").split("")));
    box.append(chip);});
  return box;
}
function compCell(sp,row){
  const c=sp.comp||{};const td=el("td","cmp");
  const eff=compEffect(sp,modsForSpell(sp,row));
  // a component your build removes is struck through, not deleted: the spell still prints it
  const modClass=L=>eff.gone.has(L)?" gone":eff.iffy.has(L)?" iffy":"";
  const modTip=(node,L)=>{const m=eff.why.find(x=>String(x.drop||"").indexOf(L)>=0);
    if(m&&(eff.gone.has(L)||eff.iffy.has(L)))attachTip(node,castModTip(m,[L]));};
  [["v","V"],["s","S"]].forEach(([k,t])=>{const n=el("span","l"+(c[k]?" on":"")+(c[k]?modClass(k):""),t);
    if(c[k])modTip(n,k); td.append(n);td.append(document.createTextNode(" "));});
  const m=el("span","l"+(c.m?" on":"")+(c.m?(c.consume?" eat":c.cost?" costly":"")+modClass("m"):""),"M");
  if(c.m){
    // three fields, in the order you scan them: what it costs, whether it survives, what it is
    const rows=[];
    if(c.cost||c.consume)rows.push(["Cost",(c.cost?esc(gpOf(c.cost)):"—")
      +(c.consume?` <span class="tchip eat">consumed</span>`:"")]);
    rows.push(["Material",esc(matText(c))]);
    const cm=eff.why.find(x=>String(x.drop||"").indexOf("m")>=0&&(eff.gone.has("m")||eff.iffy.has("m")));
    if(cm)attachTip(m,castModTip(cm,["m"])); else attachTip(m,tipRows("Material component",rows));
  }
  td.append(m);return td;
}
function switchTab(t){curTab=t;$("#tabBuild").classList.toggle("on",t==="build");$("#tabTable").classList.toggle("on",t==="table");
  $("#buildView").classList.toggle("hidden",t!=="build");$("#tableView").classList.toggle("hidden",t!=="table");
  if(t==="table")renderTable();
  renderJumpBar();}

// ── section jump bar (mobile) ──────────────────────────────────────────────
// The Build view is five stacked cards on a phone, so reaching your classes from the
// spell list was a very long scroll. One tap per section, and it tracks where you are
// (D48). Deliberately NOT a second row of tabs: the budget and the spell list are read
// together, so the page stays one continuous scroll.
const JUMP_SECTIONS=[["secChar","Character"],["choicesCard","Choices"],["secSlots","Slots"],
                     ["secPicks","Budget"],["secSpells","Spells"]];
function jumpTargets(){
  return JUMP_SECTIONS.map(([id,label])=>({id,label,node:$("#"+id)}))
    .filter(t=>t.node&&!t.node.classList.contains("hidden"));}
function renderJumpBar(){
  const bar=$("#jumpBar"); if(!bar)return;
  const targets=curTab==="build"?jumpTargets():[];
  bar.classList.toggle("hidden",targets.length<2);
  // clear the signature too, or coming back from the table tab finds a stale match
  if(targets.length<2){bar.innerHTML="";bar.dataset.sig="";return;}
  // rebuild only when the set of sections actually changed (choices card comes and goes)
  const sig=targets.map(t=>t.id).join(",");
  if(bar.dataset.sig!==sig){
    bar.dataset.sig=sig; bar.innerHTML="";
    targets.forEach(t=>{const b=el("button",null,t.label);b.dataset.for=t.id;
      b.onclick=()=>jumpTo(t.node);
      bar.append(b);});}
  syncJumpBar();}
// Some embedded webviews accept a smooth scroll and then never move — which would make
// the tap do nothing at all. Ask for smooth, and jump if nothing happened.
function jumpTo(node){
  const y=Math.max(0,scrollY+node.getBoundingClientRect().top-6), before=scrollY;
  if(Math.abs(y-before)<2)return;
  try{ scrollTo({top:y,behavior:"smooth"}); }catch(e){ scrollTo(0,y); return; }
  setTimeout(()=>{ if(Math.abs(scrollY-before)<2)scrollTo(0,y); },180);}
function syncJumpBar(){
  const bar=$("#jumpBar"); if(!bar||bar.classList.contains("hidden"))return;
  const targets=jumpTargets();
  // the section you are "in" is the last one whose top has passed the reading line
  let cur=targets[0]&&targets[0].id;
  targets.forEach(t=>{if(t.node.getBoundingClientRect().top<=96)cur=t.id;});
  bar.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.for===cur));}
let _jumpRaf=0;
addEventListener("scroll",()=>{ if(_jumpRaf)return;
  _jumpRaf=requestAnimationFrame(()=>{_jumpRaf=0;syncJumpBar();}); },{passive:true});
addEventListener("resize",()=>syncJumpBar(),{passive:true});

// ── level plan & the timeline popover (E5 · D115(j), supersedes D54's chip/D59's panel) ──
// The Character card's level chip reads "L7 / 20" (+ ⚠ when the E4 sweep found
// something) and opens the TIMELINE: a jumpable list of every character level — what
// class it was taken in, what it granted, which sticky picks the schedule says arrived
// there. Rows drag to reorder the level plan (this absorbed the old Level order panel);
// pick chips drag between rows to move acquisition; the footer forks and pins.
function renderLevelChip(){
  const chip=$("#clvlChip"); if(!chip)return;
  const total=state.classes.reduce((a,r)=>a+(r.level||0),0);
  detachTip(chip);                       // the node is reused; its old meaning is gone
  chip.innerHTML=""; chip.onclick=null;
  chip.classList.toggle("prevon",PREVIEW.level!=null);
  if(!total){chip.classList.remove("prevable");closeTimeline();return;}
  const view=PREVIEW.level==null?total:PREVIEW.level;
  chip.classList.add("prevable");
  chip.append(el("b","pvn",`L${view} / ${total}`));
  const h=(R&&R.health)||buildHealth();
  if(h.levels.length){const w=el("span","chipwarn");w.append(icoEl("warn"));chip.append(w);}
  chip.onclick=e=>{e.stopPropagation();hideTip();toggleTimeline();};
  attachTip(chip,tipBlock("The build at every level",
    (view<total?`Viewing level ${view} of ${total}. `:"")
    +"Open the timeline to jump to a level, reorder how the levels were taken, and move picks between them."
    +(h.levels.length?` ${issueCount(h.findings.length)} to check, at ${h.levels.map(l=>"L"+l).join(", ")} — the timeline marks the rows.`:"")));
}
// The build-health surfaces (E4 · D115(f), consolidated by E5). One sweep, two
// altitudes: the level CHIP carries the ⚠ (its tip names the offending levels, the
// timeline marks the rows — that is what makes a problem at 5 visible from 12) and
// the BAR names what is wrong at the level you are actually standing at. Both are
// advisory (D31): they say so, they locate it, they never change anything.
// "1 issue" / "3 issues" — the sweep's own count, said plainly wherever it is reported
const issueCount=n=>n+(n===1?" issue":" issues");
function renderHealth(){
  const bar=$("#healthBar");
  const h=(R&&R.health)||buildHealth();
  if(!bar)return;
  const here=PREVIEW.level!=null?(h.byLevel.get(PREVIEW.level)||[]):[];
  if(!here.length){bar.classList.add("hidden");bar.innerHTML="";return;}
  bar.innerHTML=""; bar.classList.remove("hidden");
  const txt=el("div","healthtxt");
  txt.append(el("b",null,`Level ${PREVIEW.level}: ${issueCount(here.length)}`));
  here.slice(0,4).forEach(f=>txt.append(el("div",null,f.text)));
  if(here.length>4)txt.append(el("div",null,`+${here.length-4} more at this level`));
  bar.append(txt);
}
// What a class level actually gives, NAMED: real class and subclass features (D63).
// Not derived counts: "Arcane Recovery" says more than "+1 prepared". Spellcasting is
// deliberately NOT here — see levelCasting.
// Each gain is `{t}` — or `{t,pick}` when the thing it names is still UNDECIDED, in
// which case `pick` says which of the app's OWN choosers opens it. Nothing here decides
// anything (D31): it only marks the hole and names the door.
function levelGains(row,cl,charLv,open){
  const c=CLS_BY[row.clsKey]; if(!c)return [];
  const sub=subOfRow(row);
  const g=[], push=(t,pick)=>g.push(pick?{t,pick}:{t});
  (c.features||[]).forEach(f=>{if(f.level===cl)push(f.name);});
  if(sub&&cl>=(c.subclassLevel||3))(sub.features||[]).forEach(f=>{if(f.level===cl)push(f.name);});
  if(c.subclassLevel===cl&&!sub)push("Subclass — not chosen",{kind:"subclass",row:row.id});
  // a feat slot at this CHARACTER level is open when no non-origin feat maps to it —
  // asked of featAcqLevels, the same mapper the chips and the sweep read (D114)
  const slotOpen=!open||!(open.featAt.get(charLv)>0);
  if([4,8,12,16].concat(ASI_EXTRA[c.name]||[]).includes(cl))
    push("Feat / ASI",slotOpen?{kind:"feat",slot:"general"}:null);
  if(cl===19)push("Epic Boon",slotOpen?{kind:"feat",slot:"epic"}:null);
  [c,sub].forEach(src=>{ if(!src||!src.optFeatures)return;
    src.optFeatures.forEach(p=>{const d=(p.counts[cl-1]||0)-(cl>1?(p.counts[cl-2]||0):0);
      if(d<=0)return;
      const filled=open?(open.optAt.get(p.name+"@"+charLv)||0):d;
      push(`+${d} ${p.name.toLowerCase()}`,
        filled<d?{kind:"opt",prog:p,giver:src.name,giverSrc:src.source,cl}:null);});});
  return g;
}
// which slots a level still has open, by the acquisition mappers themselves — one pass
// per render, so the gains line never runs a count of its own that could disagree.
function timelineOpen(){
  const featAt=new Map(), optAt=new Map();
  featAcqLevels().forEach(a=>{ if(a.cat==="origin")return;
    featAt.set(a.lv,(featAt.get(a.lv)||0)+1); });
  optAcqLevels().forEach(a=>{ if(!a.slot)return;
    const k=a.slot+"@"+a.lv; optAt.set(k,(optAt.get(k)||0)+1); });
  return {featAt,optAt};
}
// open the app's REAL chooser for an undecided gain — never a second picker surface.
// The timeline closes first: these are page controls and full modals of their own, and
// a modal over a modal is exactly the collision D126 was opened on.
function openGainChooser(pick){
  closeTimeline();
  if(pick.kind==="subclass"){
    const sel=document.querySelector('#classRows select[data-sub="'+pick.row+'"]');
    if(sel&&!sel.disabled){sel.focus();}          // focus scrolls the row into view itself
    else jumpTo($("#secChar"));
    return;}
  if(pick.kind==="feat"){openEntityPicker("feat",pick.slot);return;}
  if(pick.kind==="opt"){
    // the page's own slot descriptor where the current view has one; otherwise the same
    // shape built from the progression, so the picker filters on identical fields
    const sl=optSlots().find(s=>s.name===pick.prog.name)
      ||{name:pick.prog.name,types:pick.prog.types,cap:pick.prog.counts[Math.max(0,pick.cl-1)]||1,
         picked:[],giver:pick.giver,giverSrc:pick.giverSrc};
    openEntityPicker("opt",sl);}
}
// Spellcasting runs on TWO clocks, and a caster-caster multiclass pulls them apart:
//   • MAX SPELL LEVEL is set by that class's OWN level — multiclassing never raises it.
//   • SLOTS come from the COMBINED caster level, so a Wizard 3 / Cleric 3 casts 2nd-level
//     spells out of 3rd-level slots.
// The cards used to derive both from the class's own slot table, which put the slot gain
// on the wrong level for every multiclass. Both are shown, separately.
function planSlots(levels){
  let full=0,half=0,third=0,n=0,one=null,pact=null;
  state.classes.forEach(r=>{
    const lvl=levels.get(r.id)||0; if(!lvl)return;
    const c=CLS_BY[r.clsKey]; if(!c)return;
    const sub=subOfRow(r);
    const caster=c.caster||(sub&&sub.caster)||null; if(!caster)return;
    if(caster==="pact"){const p=DATA.pact[Math.min(lvl,20)-1];pact={num:p[0],lvl:p[1]};return;}
    n++; one={c,caster,lvl};
    if(caster==="full")full+=lvl;
    else if(caster==="artificer"||caster==="1/2")half+=lvl;
    else if(caster==="1/3")third+=lvl;
  });
  let slots=null;
  if(n===1)slots=(one.c.slots&&one.c.slots[one.lvl-1])||DATA.fullMc[Math.min(ecl(one.caster,one.lvl),20)-1]||null;
  else if(n>1){const mc=full+Math.floor(half/2)+Math.floor(third/3);
    if(mc>0)slots=DATA.fullMc[Math.min(mc,20)-1];}
  return {slots,pact};
}
const topSlot=a=>{let m=0;(a||[]).forEach((v,i)=>{if(v>0)m=i+1;});return m;};
// The state of both clocks AFTER this character level, and whether this level is the one
// that moved them. Rendered as two tiles rather than prose: the point of the column is that
// you can read either progression straight down it.
function levelCasting(row,cl,before,after){
  const c=CLS_BY[row.clsKey]; if(!c)return null;
  const sub=subOfRow(row);
  const caster=c.caster||(sub&&sub.caster)||null; if(!caster)return null;
  const spell=maxLvlAt(caster,cl), spellWas=cl>1?maxLvlAt(caster,cl-1):0;
  // Pact Magic is measured on its own terms (D123): count × slot level, never folded
  // into the regular-slot clock
  if(caster==="pact"){
    const p=after.pact||{num:0,lvl:0}, pw=before.pact||{num:0,lvl:0};
    return {spell,spellUp:spell>spellWas,slot:0,slotUp:false,
            pact:p,pactUp:p.num!==pw.num||p.lvl!==pw.lvl};
  }
  const slot=topSlot(after.slots), slotWas=topSlot(before.slots);
  return {spell,spellUp:spell>spellWas,slot,slotUp:slot>slotWas,pact:null,pactUp:false};
}
const lvTile=(kind,big,word,tip)=>{
  const t=el("div","lt lt-"+kind);
  t.append(el("b",null,big));
  t.append(el("small",null,word));
  attachTip(t,tip); return t;};
// ── the timeline popover (E5 · D115(j)) ────────────────────────────────────
// One row per character level, in plan order. A row: which class that level was taken
// in, what it granted (D63's named gains + the two casting clocks), the sticky picks
// the schedule says arrived there (E2), any recorded swap (D115(g)), and the E4 flags
// for that level. Zones tint lived history apart from the plan above the current-level
// pin. Clicking a row JUMPS the view; the popover stays open so levels can be walked.
// drag: {type:"row",i} | {type:"chip",kind,rowId,key}
// retrain: which chip's "move the trade" chooser is open — {id, cur, kind}, inline in
// the row rather than a floating menu (the chip row is a masked scroller and would clip
// one, and a document-level closer is exactly what D122 removed from this modal)
let TL={open:false,drag:null,retrain:null};
function toggleTimeline(){ TL.open?closeTimeline():openTimeline(); }
// a full modal since D122 — no chip anchoring, no scroll re-anchoring to maintain
function openTimeline(){ TL.open=true; renderTimeline();
  $("#tlModal").classList.remove("hidden"); }
function closeTimeline(){ if(!TL.open)return; TL.open=false; TL.retrain=null;
  const p=$("#tlModal"); if(p)p.classList.add("hidden"); }
// the armed half of a level-up swap (E3 · D115(g)): "− this pick at level k" waits for
// its replacement to be taken. Module state, cleared on record, cancel or build switch.
let SWAPARM=null;   // {row, kind:"spell"|"cantrip", out:<key>, level, label}
function renderSwapArm(){
  const bar=$("#swapBar"); if(!bar)return;
  if(!SWAPARM){bar.classList.add("hidden");bar.innerHTML="";return;}
  bar.innerHTML=""; bar.classList.remove("hidden");
  const row=state.classes.find(r=>r.id===SWAPARM.row), c=row&&CLS_BY[row.clsKey];
  const txt=el("div","swaptxt");
  const kw=SWAPARM.kind==="cantrip"?"cantrip":"spell";
  txt.append(el("b",null,`Trading ${SWAPARM.label} away at L${SWAPARM.level}`));
  txt.append(el("div",null,`Take a ${kw} for ${c?c.name:"the class"} and the trade is recorded. Nothing below L${SWAPARM.level} changes.`));
  bar.append(txt);
  if(SWAPARM.kind==="spell"){
    const b=el("button","btn");
    const bl=el("span","lbl-ico");bl.append(icoEl("retrain"),document.createTextNode("Choose replacement…"));
    b.append(bl);
    // the cap is `guideSwapMax`'s, shared with the guide's trade card (G3) so the two
    // replacement surfaces can never offer different levels for the same trade
    b.onclick=()=>{const rec=R.casters.find(r=>r.idx===SWAPARM.row); if(!rec)return;
      openLevelPick(SWAPARM.row,guideSwapMax(row,SWAPARM.level));};
    bar.append(b);}
  bar.append(xBtn("anx",()=>{SWAPARM=null;render();}));
}
// a pick key's printed name, for every timeline surface that shows one
const pickName=k=>{const sp=SPELL_BY[k];return sp?sp.name:String(k).split("|")[0];};
// where each draggable pick sits, by the same machinery the slices run on (E2).
// Also derives, per level: the OPEN schedule slots (ghost chips, D124), the incoming
// side of every recorded trade, and the wants/has pick counts the count tile states.
function timelinePicks(){
  const clm=charLevelMap(), by=new Map(), counts=new Map();
  const put=(lv,chip)=>{const a=by.get(lv)||[];a.push(chip);by.set(lv,a);};
  const cell=lv=>{const c=counts.get(lv)||{want:0,have:0,swWant:0,swHave:0};
    counts.set(lv,c); return c;};
  // schedule slots and TRADE slots are counted apart: a trade opens a pick slot of its
  // own at its level, and an ARMED one opens it before the replacement lands — which
  // must not read as the row being short of its schedule (that is the alert's job).
  const bump=(lv,want,have)=>{const c=cell(lv);c.want+=want;c.have+=have;};
  const bumpSwap=(lv,want,have)=>{const c=cell(lv);c.swWant+=want;c.swHave+=have;};
  state.classes.forEach(row=>{
    const sched=rowSched(row); if(!sched)return;
    const lvls=clm.get(row.id)||[], ch=state.chosen[row.id]||{};
    const name=pickName;
    // a position that later swapped shows what was LEARNED there — the pill at the swap
    // level tells the rest of the story
    const shown=(k,lv,kind)=>unswap([k],row.id,kind,lv)[0];
    // when the pick SHOWN here left the build. Asked of the shown key, not the stored
    // one: in a chain (X→Y at 5, Y→Z at 9) the position holds Z, but what stood here
    // was X and it was traded at 5 — keying on the stored key reported 9.
    const traded=(k,lv,kind)=>{const e=swapEvents()
      .filter(x=>x.lvl>lv&&x.row===row.id&&x.kind===kind&&x.out===k)
      .sort((a,b)=>a.lvl-b.lvl)[0];
      return e?{at:e.lvl,forName:name(e.in)}:null;};
    // what this class may trade on a level-up, and — when it may not — the reason the
    // chip's tip has to give, so a refusal is never mute (SWAP_RULES)
    const cn=(CLS_BY[row.clsKey]||{}).name||"This class", rule=swapRule(row);
    const noCt=rule.cantrip==="levelup"?null
      :rule.cantrip==="lr"?`${cn} replaces a cantrip after a long rest, not on level-up — do it in Prepare daily.`
      :`${cn} has no cantrip swap on level-up.`;
    const noSp=rule.spell?null
      :sched.book?"A spellbook only grows — copying in is the wizard's move; its prepared list changes on a long rest instead."
      :`${cn} re-prepares its spells on a long rest, not on level-up — nothing is traded away here.`;
    // HAVE is counted where each pick actually lands, not clamped to the slot count —
    // an off-schedule pick (past the budget) lands at the row's top level and has to
    // make that level read OVER, which is exactly where the sweep flags it too
    (ch.cantrips||[]).forEach((k,i)=>{const lv=acqAt(sched.cant,i,lvls);
      const sk=shown(k,lv,"cantrip");
      put(lv,{kind:"ct",rowId:row.id,key:k,shownKey:sk,label:name(sk),tag:"c",
        lv,lvls,swappable:!noCt,noswap:noCt,traded:traded(sk,lv,"cantrip")});
      bump(lv,0,1);});
    if(sched.spells)(ch.spells||[]).forEach((k,i)=>{const lv=acqAt(sched.spells,i,lvls);
      const sk=shown(k,lv,"spell");
      put(lv,{kind:"sp",rowId:row.id,key:k,shownKey:sk,label:name(sk),
        lv,lvls,swappable:!noSp,noswap:noSp,traded:traded(sk,lv,"spell")});
      // a wizard's copies past the free allowance are the wizard's LEGAL move, not an
      // overrun (the level-budget rule) — a book row counts only its scheduled slots
      if(!sched.book||acqIdx(sched.spells,i,lvls)>=0)bump(lv,0,1);});
    // WANT + the open slots, per class level, on the same cumulative schedules
    lvls.forEach((lv,cl0)=>{
      [["cantrips",sched.cant],["spells",sched.spells]].forEach(([arr,sa])=>{
        if(!sa)return;
        const from=cl0>0?(sa[cl0-1]||0):0, to=sa[cl0]||0;
        if(to<=from)return;
        const len=(ch[arr]||[]).length;
        bump(lv,to-from,0);
        for(let p=Math.max(from,len);p<to;p++)
          put(lv,{kind:"ghost",rowId:row.id,gkind:arr,lv});
      });});
  });
  // a trade's INCOMING pick belongs to the level the trade happened at: the outgoing
  // side keeps its chip (and its history) where it was learned, so without this the
  // replacement appears nowhere. Its own chip, in the trade colour, and its own slot in
  // the count — a ghost one while an armed trade is still waiting for its replacement.
  swapEvents().forEach(e=>{
    put(e.lvl,{kind:"swin",rowId:e.row,key:e.in,label:pickName(e.in),lv:e.lvl,evKind:e.kind,
               outName:pickName(e.out)});
    bumpSwap(e.lvl,1,1);});
  if(SWAPARM){
    put(SWAPARM.level,{kind:"swghost",rowId:SWAPARM.row,lv:SWAPARM.level,
                       gkind:SWAPARM.kind==="cantrip"?"cantrips":"spells",label:SWAPARM.label});
    bumpSwap(SWAPARM.level,1,0);}
  featAcqLevels().forEach((a,fk)=>{const f=FEAT_BY[baseKey(fk)]; if(!f)return;
    put(a.lv,{kind:"ft",key:fk,label:f.name,tag:"feat",fixed:a.cat==="origin"});});
  optAcqLevels().forEach((a,ok)=>{const o=OPT_BY[baseKey(ok)]; if(!o)return;
    put(a.lv,{kind:"of",key:ok,label:o.name,tag:"opt"});});
  return {by,counts};
}
// THE eligibility question, asked once and answered in one place: may this pick be
// traded away at character level T? Arming asks it, the chip's tip explains its clauses,
// and the retrain-level chooser filters on it — no second copy anywhere (D119(b)/D128).
function swapLevelOk(pk,T,kind){
  return !!(pk.swappable && T>pk.lv && pk.lvls.includes(T)
    && pk.lvls.filter(x=>x<=T).length>=2 && !swapAt(T,kind));
}
// the other level-ups a RECORDED trade could have happened at instead. Same predicate,
// plus the chain's own ceiling: a replacement cannot be traded away before it arrives.
function swapMoveTargets(pk,kind,cur){
  const ev=swapAt(cur,kind); if(!ev)return [];
  const next=swapEvents()
    .filter(x=>x.row===pk.rowId&&x.kind===kind&&x.out===ev.in&&x.lvl>cur)
    .reduce((m,x)=>Math.min(m,x.lvl),Infinity);
  return pk.lvls.filter(T=>T!==cur&&T<next&&swapLevelOk(pk,T,kind));
}
// move a dragged chip so its acquisition lands on `L`. Class picks: an array position
// maps to a level by INDEX alone, so the first index the schedule puts at L is the
// insertion point. Feats and options interleave categories, so those try each insertion
// and keep the one the mapper says lands at L — a handful of positions, always honest.
function dropChipOnLevel(chip,L){
  if(chip.kind==="sp"||chip.kind==="ct"){
    const row=state.classes.find(r=>r.id===chip.rowId); if(!row)return false;
    const sched=rowSched(row)||{}, sa=chip.kind==="ct"?sched.cant:sched.spells;
    const arr=chip.kind==="ct"?"cantrips":"spells", ch=state.chosen[row.id];
    if(!sa||!ch||!ch[arr])return false;
    const lvls=charLevelMap().get(row.id)||[];
    const i=ch[arr].indexOf(chip.key); if(i<0)return false;
    let j=-1; for(let k=0;k<ch[arr].length;k++)if(acqAt(sa,k,lvls)===L){j=k;break;}
    if(j<0)return false;
    ch[arr].splice(i,1); ch[arr].splice(j,0,chip.key);
    save(); return true;
  }
  const arrName=chip.kind==="ft"?"feats":"optFeats";
  const mapper=chip.kind==="ft"?()=>featAcqLevels():()=>optAcqLevels();
  const base=state[arrName]; const i=base.indexOf(chip.key); if(i<0)return false;
  const rest=base.slice(); rest.splice(i,1);
  for(let k=0;k<=rest.length;k++){
    const t=rest.slice(); t.splice(k,0,chip.key);
    state[arrName]=t;
    const lv=(mapper().get(chip.key)||{}).lv;
    if(lv===L){save(); return true;}
  }
  state[arrName]=base; return false;
}
// ── the descending level column, shared (D132) ─────────────────────────────
// Both level surfaces — the timeline modal and the guide's chain column — read HIGHEST
// LEVEL AT THE TOP, and both build that the same way: walk the plan ASCENDING (every
// per-level number is incremental and would be wrong backwards) and PREPEND each level's
// fragment. Four pieces come with that inversion and were carried in two near-identical
// copies until this: the run map keyed on a run's HIGHEST level (`to`, where the block
// starts on screen), the divider that opens a class block, `runjoin` reaching UPWARD to
// close the gap against the level above, and the prepend itself. They are one owner now —
// a change to the column is a change to both surfaces by construction, which is what the
// duplication could only promise by hand.
// What is NOT here is the card body: each surface builds its own and hands it over. And
// the row drag stays where it is (`wireRowDrag`, below) — it is handed PLAN INDICES, so
// the axis flip never reaches it, and that is why the same drag on either surface still
// produces the identical plan (G1's acceptance test).
function levelColumn(plan,box,multi){
  const runColor=new Map(); plan.forEach(id=>{if(!runColor.has(id))runColor.set(id,runColor.size%4);});
  const runs=[]; plan.forEach((id,j)=>{
    if(j===0||plan[j-1]!==id)runs.push({id,from:j+1,to:j+1});
    else runs[runs.length-1].to=j+1;});
  const runAt=new Map(runs.map(r=>[r.to,r]));
  return {
    // the class rail + join classes a level's card wears. `runjoin` asks about the level
    // ABOVE (lv+1 in plan terms, the card above it on screen)
    railCls:(lv,id)=>!multi||id==null?"":" runc"+runColor.get(id)
      +(lv<plan.length&&plan[lv]===id?" runjoin":""),
    // one level, inserted at the head of the column: its divider (when a class block
    // starts here) and its card go in TOGETHER, or prepending them one at a time would
    // put the card above its own divider
    emit(lv,id,card){
      const into=document.createDocumentFragment();
      if(multi&&id!=null&&runAt.has(lv)){const r=runAt.get(lv);
        const row=state.classes.find(x=>x.id===id), c=row&&CLS_BY[row.clsKey];
        const dv=el("div","tlrundiv");
        dv.append(el("span","rdot c"+runColor.get(id)));
        dv.append(document.createTextNode((c?c.name:"?")+" · "
          +(r.from===r.to?"L"+r.from:"L"+r.from+"–L"+r.to)));
        into.append(dv);}
      into.append(card); box.prepend(into);
    },
    // the growth end of the column, and anything that governs the whole of it: last
    // prepend wins the top
    top(node){box.prepend(node);}
  };
}
// ── the level-plan row drag, shared (D122(e) · D126(b)) ────────────────────
// Reordering WHICH class each character level was taken in. The timeline modal and the
// guide's chain column both wire it, so the two surfaces cannot drift apart: one set of
// rules, one write path. The rules: a drop whose resulting plan is IDENTICAL (any move
// inside a same-class run, including onto its own boundary) is NOT a drop target at all
// — no highlight, no pretend-move — and every commit goes through classLevelPlan() and
// an assignment to state.levelOrder, the only plan-write idiom there is.
// `st` is the caller's own drag state ({drag}); `box` is the list the cleanup sweeps;
// `opt.enabled` is "this card is a draggable row of the plan" — false on a single-class
// plan (nothing to reorder) and on the chain's trailing growth ghost, which is not a
// level yet. It gates the ROW half of the drag at BOTH ends: a card you cannot drag is
// not a drop target either. It used to gate `ondragstart` alone, so the chain's "next
// level" ghost still ACCEPTED a row drop and committed a plan the timeline (whose add
// row is wired for nothing) would never produce — the one crack in the equivalence G1
// was gated on (I5 · 1). The CHIP half is independent: a timeline chip can be dropped on
// a row of a single-class plan, so `opt.onChip` is what gates that branch, not `enabled`.
// `opt.onChip` is the timeline's own pick-chip drop, which the chain column has not got.
const planMoved=(plan,from,to)=>{const o=plan.slice(),[mv]=o.splice(from,1);
  o.splice(from<to?to-1:to,0,mv); return o;};
const planSame=(a,b)=>a.length===b.length&&a.every((x,k)=>x===b[k]);
function commitPlan(order){state.levelOrder=order; save(); refreshAll(); render();}
function wireRowDrag(card,i0,plan,st,box,opt){
  opt=opt||{};
  card.ondragstart=e=>{ if(st.drag&&st.drag.type==="chip")return;
    if(!opt.enabled){e.preventDefault();return;}
    st.drag={type:"row",i:i0}; e.dataTransfer.effectAllowed="move";
    try{e.dataTransfer.setData("text/plain",String(i0));}catch(_){}
    card.classList.add("dragging");};
  card.ondragend=()=>{st.drag=null;
    box.querySelectorAll(".locard").forEach(x=>x.classList.remove("dragging","dropinto"));};
  card.ondragover=e=>{ if(!st.drag)return;
    if(st.drag.type==="row"){
      if(!opt.enabled)return;      // not draggable, not droppable-on — the same rule
      if(st.drag.i===i0||planSame(planMoved(plan,st.drag.i,i0),plan))return;
    } else if(!opt.onChip)return;
    e.preventDefault(); e.dataTransfer.dropEffect="move"; card.classList.add("dropinto");};
  card.ondragleave=()=>card.classList.remove("dropinto");
  card.ondrop=e=>{ e.preventDefault(); card.classList.remove("dropinto");
    const d=st.drag; if(!d)return;
    if(d.type==="row"){ if(!opt.enabled||d.i===i0)return;
      const o=planMoved(plan,d.i,i0);
      if(planSame(o,plan))return;
      commitPlan(o); return;}
    if(opt.onChip)opt.onChip(d,card);};
}
function renderTimeline(){
  const box=$("#tlList"); if(!box)return;
  const keepScroll=box.scrollTop;
  box.innerHTML="";
  const plan=classLevelPlan(), total=plan.length;
  if(!total){closeTimeline();return;}
  const rowOf=new Map(state.classes.map(r=>[r.id,r]));
  const perClass=new Map();               // running class level, for the gains line
  const view=PREVIEW.level==null?total:PREVIEW.level;
  const cur=(typeof state.currentLevel==="number"&&state.currentLevel<total)?state.currentLevel:total;
  const {by:picks,counts:pickCounts}=timelinePicks(), health=(R&&R.health)||buildHealth();
  const openSlots=timelineOpen();         // which gains this build hasn't answered yet
  const multi=state.classes.length>1;
  // the quiet order-matters word (E7, folded into a gold flag by the title — D122):
  // named reasons live in its tip, only on builds where the order is load-bearing
  const om=$("#tlOrder"), reasons=orderMatters();
  if(om){ om.innerHTML=""; detachTip(om);
    if(!reasons)om.classList.add("hidden");
    else{ om.classList.remove("hidden"); om.append(icoEl("warn"));
      attachTip(om,tipBlock("Order matters in this build",
        reasons.map(r=>cap1(r)).join("; ")
        +". Drag the rows to change which class each level was taken in.")); } }
  // run aggregation (D122) and the descending column itself (D132) — the run map keyed
  // on each block's HIGHEST level, its divider label (D124), `runjoin` reaching upward
  // and the prepend — all belong to `levelColumn`, shared with the guide's chain so the
  // two surfaces cannot drift. The label ("Bard · L2–L5") reads the same either way.
  const col=levelColumn(plan,box,multi);
  // The LOOP still walks the plan ASCENDING and only the INSERTION is reversed
  // (`box.prepend` of a per-level fragment). Everything this loop computes is
  // incremental — the running class level, and `planSlots(perClass)` read once before
  // and once after each level — so walking it backwards would report the wrong class
  // level on every row and the wrong slot table on all of them. Order of computation and
  // order of display are two different things, and only the second one inverted.
  plan.forEach((id,i0)=>{
    const i=i0+1, row=rowOf.get(id); if(!row)return;
    const cl=(perClass.get(id)||0)+1;      // advanced below, between the two slot reads
    const c=CLS_BY[row.clsKey];
    const card=el("div","locard tlrow"+(i>cur?" zplan":"")+(i===cur?" zpin":"")+(i===view?" here":"")
      +col.railCls(i,id));
    card.dataset.lv=String(i);
    if(multi){const g=icoEl("grip","logrip");card.append(g);card.draggable=true;}
    const body=el("div","lobody");
    const top=el("div","lotop");
    top.append(el("span","lolv","L"+i));
    top.append(el("b","locls",(c?c.name:"?")+" "+cl));
    if(i===cur){const pin=el("span","tlpin");pin.append(icoEl("bookmark"));
      top.append(pin);
      attachTip(pin,tipBlock("Current level","Where the character stands now. The build opens here; levels above are the plan."));}
    const flags=health.byLevel.get(i);
    if(flags){const wI=el("span","tlwarn");wI.append(icoEl("warn"));
      top.append(wI);
      attachTip(wI,tipBlock(`Level ${i}: ${issueCount(flags.length)}`,
        flags.map(f=>f.text).join(" ")));}
    body.append(top);
    const gains=levelGains(row,cl,i,openSlots);
    // the slot table is read across the WHOLE plan up to here, never from this class alone
    const before=planSlots(perClass); perClass.set(id,cl);
    const after=planSlots(perClass);
    const cast=levelCasting(row,cl,before,after);
    if(gains.length){
      const gl=el("div","logains");
      gains.forEach((g,gi)=>{
        if(gi)gl.append(document.createTextNode(" · "));
        if(!g.pick){gl.append(document.createTextNode(g.t));return;}
        // an undecided gain is quietly clickable — a dashed underline, not a button —
        // and it opens the app's OWN chooser for that thing (never a copy of one)
        const a=el("span","gopen",g.t);
        a.onclick=e=>{e.stopPropagation();hideTip();openGainChooser(g.pick);};
        attachTip(a,tipBlock("Not chosen yet",
          g.pick.kind==="subclass"?"Open the class row and pick a subclass."
          :g.pick.kind==="feat"?(g.pick.slot==="epic"
              ?"Open the epic boon picker. Taking the ability score improvement instead means leaving this empty."
              :"Open the feat picker. Taking the ability score improvement instead means leaving this empty.")
          :`Open the ${lc(g.pick.prog.name)} picker — this level still has room.`));
        gl.append(a);});
      body.append(gl);
    }
    else body.append(Object.assign(el("div","logains dim"),{textContent:"No new features"}));
    card.append(body);
    // only the level that MOVED a clock states it (D122) — a quiet note, not a control;
    // every unchanged level stays clean and the column reads as "what rose where".
    // Where the two clocks agree the tile says "spell" in a NEUTRAL word (D123) —
    // "cast" named a merger the reader never asked about. Pact Magic gets its own
    // tile, measured as count × slot level (D123).
    {const tiles=el("div","lotiles");
      // the wants/has pick count (D124): stated wherever this level opens pick slots
      const cnt=pickCounts.get(i);
      if(cnt&&(cnt.want||cnt.swWant||cnt.have>cnt.want)){
        // a trade's slot counts too, and tints the tile the trade colour. The ALERT is
        // the schedule half alone: an armed trade is short of its replacement by design
        // and must not read as the level being under its schedule.
        const tot=cnt.want+cnt.swWant, got=cnt.have+cnt.swHave, off=cnt.have-cnt.want;
        const ct=el("div","lt lt-count"+(off?" tlalert":"")+(cnt.swWant?" tlswapc":""));
        ct.append(el("b",null,got+"/"+tot));
        ct.append(el("small",null,"picks"));
        attachTip(ct,tipBlock("Picks at this level",
          `${tot} slot${tot===1?"":"s"} open here, ${got} taken.`
          +(cnt.swWant?` ${cnt.swWant===1?"One is":cnt.swWant+" are"} the retrained pick.`:"")
          +(off?` The schedule wants ${cnt.want} — this level is ${off>0?"over":"under"} by ${Math.abs(off)}.`:"")));
        tiles.append(ct);}
      if(cast&&(cast.spellUp||cast.slotUp||cast.pactUp)){
      if(cast.pact){
        if(cast.spellUp)tiles.append(lvTile("spell",ROMAN[cast.spell],"spell",
          tipBlock("Max spell level — raised here",
            "The highest level this class can cast, set by its OWN level.")));
        // "2×2nd", not "2× 2nd": the tile is a square the size of every other one, and
        // the spaced form overshot it into the row beside it
        if(cast.pactUp)tiles.append(lvTile("pact",cast.pact.num+"×"+ROMAN[cast.pact.lvl],"pact",
          tipBlock("Pact Magic slots — changed here",
            `${cast.pact.num} slot${cast.pact.num===1?"":"s"}, all level ${cast.pact.lvl}, back on a short rest. `
            +"Pact Magic is its own clock beside regular spell slots.")));
      } else if(cast.spell===cast.slot){
        tiles.append(lvTile("cast",ROMAN[cast.spell],"spell",
          tipBlock("Max spell level — raised here",
            "Top slot level agrees with it here. They are two different clocks — the row notes them separately when multiclassing pulls them apart.")));
      } else {
        if(cast.spellUp)tiles.append(lvTile("spell",ROMAN[cast.spell],"spell",
          tipBlock("Max spell level — raised here",
            "The highest level this class can prepare, set by its OWN level. Multiclassing never raises it.")));
        if(cast.slotUp)tiles.append(lvTile("slot",ROMAN[cast.slot],"slot",
          tipBlock("Top slot level — raised here",
            "The highest slot you have, from your COMBINED caster level. Higher slots let you upcast; they don't widen the list.")));
      }}
      if(tiles.children.length)card.append(tiles);}   // right edge, after the body
    // sticky picks the schedule places here (E2); drag a chip to another row to move it
    const here=picks.get(i)||[];
    // a level may carry one leveled-spell swap AND one cantrip swap — one pill each
    const sw=(state.swaps||{})[i], swKinds=SWAP_KINDS.filter(k=>sw&&sw[k]);
    let retrainRow=null;               // the open "move the trade" chooser, if any
    if(here.length||swKinds.length){
      const chips=el("div","tlchips");
      here.forEach(pk=>{
        // an open schedule slot (D124): a labelled ghost that jumps the view to this
        // level — adding happens on the page, at the slice point E3 already maintains
        if(pk.kind==="ghost"||pk.kind==="swghost"){
          const gk=pk.gkind==="cantrips"?"cantrip":"spell", trade=pk.kind==="swghost";
          const g=el("span","tlchip ghost"+(trade?" swghost":""),"+ "+gk);
          g.onclick=e=>{e.stopPropagation();setPreview(i===total?null:i);jumpTo($("#secSpells"));};
          attachTip(g,trade
            ?tipBlock("Replacement not chosen",
              `The trade armed at L${i} is waiting for a ${gk}. Take one for this class and it is recorded.`)
            :tipBlock("An open "+gk+" slot",
              "The schedule opens this pick at L"+i+" and nothing fills it yet. Open the build here to fill it."));
          chips.append(g); return;}
        // the incoming half of a recorded trade: learned HERE, not where the position
        // it occupies was first filled — so it gets its own chip, in the trade colour
        if(pk.kind==="swin"){
          const w=el("span","tlchip swin");
          w.append(icoEl("retrain","sw"));
          w.append(document.createTextNode(pk.label));
          attachTip(w,tipBlock(pk.label,
            `Learned at L${i} in place of ${pk.outName}. The pill on this row is the trade itself.`));
          chips.append(w); return;}
        const armed=SWAPARM&&SWAPARM.out===pk.key&&SWAPARM.row===pk.rowId;
        const chipEl=el("span","tlchip"+(pk.fixed?" fixed":"")+(pk.traded?" traded":"")+(armed?" swaparmed":""));
        if(pk.tag)chipEl.append(el("span","k",pk.tag));
        chipEl.append(document.createTextNode(pk.label));
        // a retrained pick wears the mark AND the level it was retrained at; clicking
        // exactly the level re-dates the trade. An armed one wears the same pair, but
        // there is no event to move yet, so the level is a marker only.
        const atLv=pk.traded?pk.traded.at:armed?SWAPARM.level:null;
        if(atLv!=null){
          chipEl.append(icoEl("retrain","sw"));
          const lt=el("span","swlv","L"+atLv);
          if(pk.traded){
            const kn2=pk.kind==="ct"?"cantrip":"spell";
            const cid=pk.rowId+"|"+pk.kind+"|"+pk.key;
            const openHere=TL.retrain&&TL.retrain.id===cid;
            lt.classList.add("editable");
            lt.onclick=e=>{e.stopPropagation();hideTip();
              TL.retrain=openHere?null:{id:cid,cur:atLv,kind:kn2};
              renderTimeline();};
            attachTip(lt,tipBlock("Retrained at L"+atLv,
              "Click to move the trade to another level-up of this class."));
            if(openHere){
              const targets=swapMoveTargets(pk,kn2,atLv);
              retrainRow=el("div","tlretrain");
              retrainRow.append(el("span","rrl","Move the trade to"));
              targets.forEach(T=>{const b=el("button","btn tiny","L"+T);
                b.onclick=e=>{e.stopPropagation();
                  if(moveSwap(atLv,T,kn2)){TL.retrain=null;refreshAll();render();}};
                retrainRow.append(b);});
              if(!targets.length)retrainRow.append(el("span","rrn",
                "No other level-up of this class is free."));
              retrainRow.append(xBtn("rrx",()=>{TL.retrain=null;renderTimeline();}));}
          } else attachTip(lt,tipBlock("Armed at L"+atLv,
              "The trade records once you take the replacement."));
          chipEl.append(lt);}
        // click = arm a level-up swap where one is possible (E3 · D115(g)); the tip
        // always says what a click will or won't do, so the chip is never a dead control
        if(pk.kind==="sp"||pk.kind==="ct"){
          const kn=pk.kind==="ct"?"cantrip":"spell";
          const can=!armed&&!pk.traded&&swapLevelOk(pk,view,kn);
          const why=armed?`Armed — traded at L${SWAPARM.level} for the next ${kn} you take. Click to cancel.`
            :pk.traded?`Traded for ${pk.traded.forName} at L${pk.traded.at}. Click that level to move the trade; the pill's × clears it.`
            :!pk.swappable?pk.noswap
            :swapAt(view,kn)?`L${view} already carries a ${kn} trade — clear its pill first.`
            :!(view>pk.lv)?`Learned at L${pk.lv}. A trade happens at a later level-up — jump to one first.`
            :!pk.lvls.includes(view)||pk.lvls.filter(x=>x<=view).length<2?`L${view} isn't a level-up of this class — jump to one of its levels to trade there.`
            :`Click to trade this away at L${view}: it stays known below, and the next ${kn} you take for this class replaces it from L${view} on.`;
          chipEl.classList.toggle("canswap",can||armed);
          // the click goes on BEFORE attachTip (its standing rule); a chip with no
          // action keeps attachTip's tap-to-show, so the tip explains the refusal
          if(can||armed)chipEl.onclick=e=>{e.stopPropagation();
            if(armed){SWAPARM=null;render();return;}
            SWAPARM={row:pk.rowId,kind:kn,out:pk.key,level:view,label:pk.label};
            render();};
          attachTip(chipEl,tipBlock(pk.label+(can?" — trade away here":""),why));
        }
        if(!pk.fixed){
          chipEl.draggable=true;
          chipEl.ondragstart=e=>{e.stopPropagation();TL.drag={type:"chip",...pk};
            e.dataTransfer.effectAllowed="move";
            try{e.dataTransfer.setData("text/plain",pk.label);}catch(_){}
            chipEl.classList.add("dragging");};
          chipEl.ondragend=()=>{TL.drag=null;
            box.querySelectorAll(".tlchip").forEach(x=>x.classList.remove("dragging"));
            box.querySelectorAll(".locard").forEach(x=>x.classList.remove("dropinto"));};
        }
        chips.append(chipEl);});
      if(swKinds.length){
        swKinds.forEach(kind=>{const ev=sw[kind];
          const pill=el("span","tlswap");
          pill.append(icoEl("retrain","sw"));
          pill.append(el("span","out","− "+pickName(ev.out)));
          pill.append(el("span",null,"+ "+pickName(ev.in)));
          pill.append(xBtn("xsm",()=>{clearSwap(i,kind);TL.retrain=null;refreshAll();render();}));
          chips.append(pill);
          // a wizard's cantrip trade happens on a long rest, not on this level-up —
          // the level only records where it stood, so the tip must not claim otherwise
          const evRow=state.classes.find(r=>r.id===ev.row);
          const rest=kind==="cantrip"&&evRow&&swapRule(evRow).cantrip==="lr";
          attachTip(pill,tipBlock(kind==="cantrip"?"Cantrip trade":"Spell trade",
            (rest?"Replaced on a long rest, standing here: ":"Taken at this level: ")
            +pickName(ev.out)+" for "+pickName(ev.in)+". "
            +(rest?"That class replaces one cantrip per long rest — the level only records where it happened."
                  :"A level-up carries one spell trade and one cantrip trade, where the class's rules grant them.")
            +" × clears it."));});
      }
      card.append(chips);
    }
    if(retrainRow)card.append(retrainRow);
    // click = jump the view there; the popover stays open so levels can be walked.
    // stopPropagation, because the jump re-renders this very list — the bubbling click
    // would reach the outside-click closer with a DETACHED target that reads as
    // "outside" and shut the popover (the re-render-under-a-bubbling-event trap)
    card.onclick=e=>{ if(e.target.closest(".tlchip,.tlswap,.tlretrain,.gopen,.logrip,button"))return;
      e.stopPropagation(); setPreview(i===total?null:i); };
    // row drag (multiclass): reorder WHICH class each level is taken in — the old
    // Level order panel's whole job, absorbed here (D115(j) retires it). The rules and
    // the write path live in wireRowDrag, shared with the guide's chain column (D126(b));
    // the pick-chip drop is this surface's alone.
    wireRowDrag(card,i0,plan,TL,box,{enabled:multi,onChip:d=>{
      // a chip: land its acquisition on this level, or refuse visibly — a silent
      // no-op on a drop is a dead control (the DOM-handler rule)
      if(dropChipOnLevel(d,i)){refreshAll();render();}
      else{card.classList.add("refuse");setTimeout(()=>card.classList.remove("refuse"),380);}}});
    col.emit(i,id,card);});
  // the ghost row that ADDS a level. It sits at the TOP now (D132) — the growth end
  // of an inverted column is its head, and it is the row you reach for most. One tap
  // continues the class the plan ends on; the last other class sits beside it and the
  // rest live in a compact menu (D126(d)'s shape). Every path writes through
  // classLevelPlan() + an append to state.levelOrder — the same idiom the guide's class
  // step uses, and the only one. It is NOT a drop target, and the chain's growth ghost
  // is not one either since I5 — see `wireRowDrag`'s `opt.enabled`.
  if(total<20)col.top(tlAddRow(plan,rowOf,total));
  // footer: fork a variant · set the current level · start the guide (D115(i,e), D118(i))
  const fork=$("#tlFork"),pin=$("#tlPin"),guide=$("#tlGuide");
  const icoBtn=(b,ico,txt)=>{b.innerHTML="";const l=el("span","lbl-ico");
    l.append(icoEl(ico),document.createTextNode(txt));b.append(l);};
  icoBtn(fork,"fork","Fork a variant");
  fork.disabled=PREVIEW.level==null;
  fork.title=PREVIEW.level==null?"Jump to a lower level first — the fork branches there":"";
  fork.onclick=()=>{savePreviewAsVersion();closeTimeline();};
  const pinned=view===cur;
  icoBtn(pin,pinned?"check":"bookmark",pinned?"Current level":"Set current level");
  pin.disabled=pinned;
  pin.onclick=()=>{setCurrentLevel(view>=total?null:view);render();};
  if(guide)icoBtn(guide,"compass","Guide from here");
  box.scrollTop=keepScroll;
}
// take the next character level, by the ONE write path: normalize the plan, bump the
// class row, append the row to the order. Never touch state.levelOrder any other way.
function tlAddLevel(rowId,clsKey){
  const plan=classLevelPlan();
  const r=rowId!=null?state.classes.find(x=>x.id===rowId)
                     :state.classes.find(x=>x.clsKey===clsKey);
  if(r){ if((r.level||0)>=20)return;
    r.level=Math.min(20,(r.level||0)+1); state.levelOrder=plan.concat([r.id]); }
  else{ const nr={clsKey,subKey:null,level:1,id:state.nextRowId++};
    state.classes.push(nr); state.levelOrder=plan.concat([nr.id]); }
  save(); refreshAll(); render();
}
function tlAddRow(plan,rowOf,total){
  const add=el("div","locard tladd");
  add.append(el("span","lolv","L"+(total+1)));
  const acts=el("div","tladdacts");
  const lastId=plan[plan.length-1];
  let otherId=null;
  for(let k=plan.length-1;k>=0;k--)if(plan[k]!==lastId){otherId=plan[k];break;}
  const one=(id,primary)=>{
    const r=rowOf.get(id), c=r&&CLS_BY[r.clsKey]; if(!r||(r.level||0)>=20)return;
    const b=el("button","btn tiny"+(primary?" on":""));
    const l=el("span","lbl-ico");
    l.append(icoEl("plus"),document.createTextNode((c?c.name:"?")+" "+((r.level||0)+1)));
    b.append(l);
    b.onclick=e=>{e.stopPropagation();tlAddLevel(r.id,null);};
    attachTip(b,tipBlock("Take the next "+(c?c.name:"class")+" level",
      `Adds character level ${total+1} as ${c?c.name:"?"} ${(r.level||0)+1}.`));
    acts.append(b);};
  one(lastId,true);
  if(otherId!=null)one(otherId,false);
  const sel=el("select","tladdsel");
  sel.append(el("option","","another class…"));
  DATA.classes.filter(visible).forEach(c=>{const o=el("option",null,c.name);
    o.value=key(c.name,c.source);
    // a class already at 20 can take no further level — say so rather than accept the
    // choice and do nothing (a control that swallows a gesture is a dead one)
    const have=state.classes.find(x=>x.clsKey===o.value);
    if(have&&(have.level||0)>=20){o.disabled=true;o.textContent=c.name+" · 20";}
    sel.append(o);});
  sel.onclick=e=>e.stopPropagation();
  sel.onchange=()=>{const ck=sel.value; sel.value=""; if(ck)tlAddLevel(null,ck);};
  acts.append(sel);
  add.append(acts);
  return add;
}
// ── slots, cart and spell list render ──────────────────────────────────────
function renderSlots(){
  renderLevelChip(); renderHealth();
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
      // a custom source can fix the level it goes off at, and carry its own DC/attack (D65)
      const lv=c.castLv||c.level;
      n.innerHTML=c.choice?esc(c.desc):(esc(c.name)+(lv!=null?` <span style="color:var(--muted)">(${ROMAN[lv]}${c.castLv?" fixed":""})</span>`:""));
      const lab=rechargeShort(c.recharge,c.level===0),atWill=lab==="at will";
      row.append(n);
      // same narrowing as the table's Ability column — a CHOICE row names no single
      // spell, so there it describes the grant and both numbers stand
      const own=c.choice?{dc:c.dc||null,atk:c.atk||null}:ownNumbers(grantRec(c.name),c.dc,c.atk);
      if(own.dc||own.atk)row.append(Object.assign(el("span","ownnum"),
        {textContent:[own.dc?"DC "+own.dc:"",own.atk?"atk "+own.atk:""].filter(Boolean).join(" · ")}));
      row.append(el("span","rc"+(atWill?" will":""),lab));row.append(el("span","src",c.src));box.append(row);});
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
    const bh=el("div","bh");const nm=el("div","nm");nm.innerHTML=esc(r.name)+(r.viaSub?` <small>· ${esc(r.viaSub.shortName)}</small>`:"")+` <small>· L${r.level}</small>`;bh.append(nm);
    const kchip=el("span","kind"+(kn?" wiz":r.static?"":" daily"),kindLabel);kchip.title=kindTip;bh.append(kchip);
    b.append(bh);
    // D130 · D31: a subclass that supplies the casting must NAME the list it draws on. When
    // the data doesn't, say so here rather than letting the picker read as "no spells exist".
    if(r.listUnknown)b.append(listUnknownNote(r));
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
      // the book is what it KNOWS; prepared is the daily subset drawn from it (D62)
      const prepN=(c.prep||[]).length;
      b.append(meter("Prepared",prepN,kn.prepares));
      const sn=el("div","note");sn.style.margin="2px 0 0";
      sn.innerHTML=`Fixed growth, no retraining.`
        +(copied?` <b style="color:var(--accent)">+${copied} copied in</b>.`:"")
        +(prepN?"":` Use <b style="color:var(--ink)">Prepare daily</b> to pick ${kn.prepares} from the book.`);
      b.append(sn);
    } else {
      b.append(meter(kn?"Known":"Prepared",c.spells.length,kn?kn.total:r.prepared));
    }
    if(c.ms){const msMeter=meter("Off-list",c.ms.offCount,c.ms.cap); b.append(msMeter);
      const msb=el("button","btn lbl-ico");msb.append(icoEl("plus"),document.createTextNode("Add an off-list spell"));
      msb.style.cssText="margin-top:8px;font-size:12px";
      msb.title="Magical Secrets: pick from the lists this feature opens up, at any level you can cast.";
      msb.onclick=()=>openOffListPick(r.idx);b.append(msb);
      // the live half stays on the card; WHY the tiles narrowed is reference, and rides a
      // popover on the meter that states it (D88)
      const sn=el("div","note");sn.style.margin="2px 0 0";
      sn.innerHTML=`Up to <b style="color:var(--ink)">${c.ms.cap}</b> of your prepared spells may come from other lists, from L${c.ms.onset} on.`
        +(c.ms.weighs?` <b style="color:var(--accent)">${c.ms.weighs}</b> of your top-level picks are already spent on the low-level ones you hold.`:"");
      b.append(sn);
      if(c.ms.weighs){
        attachTip(msMeter,tipRows("Magical Secrets",[["Cap",String(c.ms.cap)],["From",`level ${c.ms.onset}`]])
          +`<p style="margin-top:6px">An off-list spell can only have been taken from L${c.ms.onset} on, so every one you hold BELOW that has already spent an acquisition event that would otherwise have reached your top spell levels. The per-level tiles above are narrowed to match.</p>`);}}
    // Per-level tiles. Denominator = how many you can hold at that level right now:
    // (picked here) + (room still addable). Daily preparers have a flat cap (free spread).
    // Known/level-swap and wizard books have a progressive cap[L] = max at level ≥ L
    // (L8 Bard caps IV at 4, III at 9, II/I at 12) — room = min over j≤L of cap[j] − held ≥ j.
    // A wizard may exceed a level's cap by COPYING spells in: shown as "copied", not an error.
    const totalCap = kn ? kn.total : r.prepared;
    if(r.maxLvl>=1 && totalCap>0){const dist=el("div","dist");
      const lvlOf=k=>{const s=SPELL_BY[k];return s?s.level:-1;};
      const capAt=j=>wiz?(kn.cap[j]!=null?kn.cap[j]:kn.total)
        :kn?kn.total
        :(c.capAdj&&c.capAdj[j]!=null)?c.capAdj[j]
        :(cp&&cp.cap[j]!=null?cp.cap[j]:totalCap);
      const geAt=j=>c.spells.filter(k=>lvlOf(k)>=j).length;
      for(let L=r.maxLvl;L>=1;L--){
        const atL=c.spells.filter(k=>lvlOf(k)===L).length;
        let room=Infinity; for(let j=1;j<=L;j++)room=Math.min(room,capAt(j)-geAt(j));
        // room goes NEGATIVE when you are over the cap — and being over the TOTAL drives it
        // negative at every level at once, which used to print "4 of up to 0". A tile may
        // never claim you hold more than its own maximum: the denominator floors at what is
        // actually held, and the .over state (plus the meter above) says what is wrong.
        const free=Math.max(0,atL+room);       // room left if you are not already over
        const ceil=Math.max(atL,free);
        const overFree=atL>free;
        const copied=overFree&&wiz;                 // wizard: extra = copied into the book (legal)
        const isErr=!!c.overLevels[L]||(overFree&&!copied);
        const cell=el("div","dcell"+(L===r.maxLvl?" top":"")+(isErr?" over":copied?" copied":""));
        cell.style.cursor="pointer";
        cell.title=`${ROMAN[L]}-level ${wiz?"in your spellbook":r.static?"in your known spells":"prepared"} — ${atL} of up to ${ceil} at this level`
          +(copied?` (+${atL-free} copied in beyond the free allowance)`
            :overFree?` — you are over your ${wiz?"spellbook":r.static?"known":"prepared"} total, so there is no room left at any level until you drop some`
            // an EMPTY tile zeroed by the shared over-total must not promise growth (D70's
            // reason-clause, not its maths): leveling can't fill it while the total is over
            :(room<0&&atL===0&&!wiz)?` — no room here while you are over your ${r.static?"known":"prepared"} total`
            :r.static&&!kn?` (fills up gradually as you level)`:"")+`. Tap to edit.`;
        cell.onclick=()=>openLevelPick(r.idx,L);
        cell.innerHTML=`<b>${atL}<span class="dcap">/${ceil}</span></b><small>${ROMAN[L]}${L===r.maxLvl?" · max":""}</small>`;dist.append(cell);}
      b.append(dist);
      if(wiz){const cpbtn=el("button","btn lbl-ico");cpbtn.append(icoEl("plus"),document.createTextNode("Copy a spell into your book"));
        cpbtn.style.cssText="margin-top:8px;font-size:12px";
        cpbtn.title="Wizards can copy spells found in play into the book, beyond the free per-level allowance (any Wizard spell up to your top slot level).";
        cpbtn.onclick=()=>openLevelPick(r.idx,r.maxLvl);b.append(cpbtn);}
    }
    // chosen chips
    const picks=[...c.cantrips.map(k=>({k,cantrip:true})),...c.spells.map(k=>({k,cantrip:false}))];
    if(picks.length){const cc=el("div","cartchips");
      picks.map(p=>({...p,sp:SPELL_BY[p.k]})).filter(p=>p.sp).sort((a,b)=>a.sp.level-b.sp.level||a.sp.name.localeCompare(b.sp.name))
        .forEach(p=>{const chip=el("span","cartchip");chip.append(el("span","lv",p.sp.level===0?"C":ROMAN[p.sp.level].replace(/\D/g,"")));
          // the pick itself carries the gap flag (D42's visible contract, at chip altitude):
          // its book is off, nothing is removed, the banner has the one-click fix
          if(!srcOn(p.sp.source)){chip.classList.add("gapped");
            chip.title=bookName(p.sp.source)+" is turned off in Sources — the pick is kept, not removed. The banner above can turn the book back on.";}
          const nm=el("span",null,p.sp.name);attachSpell(nm,p.sp);chip.append(nm);const x=xBtn(null,()=>removeChosen(r.idx,p.k));chip.append(x);cc.append(chip);});
      b.append(cc);}
    // granted (free) for this class
    body.append(b);
  });
  // granted free spells summary (from subclass/feat/species prepared grants)
  const granted=[...R.pool.values()].filter(e=>e.grants.length);
  if(granted.length){const g=el("div","budget");const gbh=el("div","bh");
    gbh.append(el("span","nm","Always prepared"));
    gbh.append(el("span","ml","Granted — they don’t use your prepared slots"));g.append(gbh);
    const cc=el("div","cartchips");granted.sort((a,b)=>a.sp.level-b.sp.level||a.sp.name.localeCompare(b.sp.name)).forEach(e=>{
      const chip=el("span","cartchip gr");chip.append(el("span","lv",e.sp.level===0?"C":ROMAN[e.sp.level].replace(/\D/g,"")));
      const nm=el("span",null,e.sp.name);attachSpell(nm,e.sp);chip.append(nm);cc.append(chip);});
    g.append(cc);body.append(g);}
}
// the spell filter's own book override (D27). Seeded from the global selection; unlike the
// entity pickers it can only NARROW — a book that isn't enabled has no eligible spells at all.
function renderFilterBooks(codes){
  const F=state.filters;
  if(!F.books)F.books=new Set(SRC);
  const n=renderSourceChecklist($("#fSrcList"),F.books,()=>renderSpells(),codes);
  const on=[...F.books].filter(c=>codes.has(c)).length;
  $("#fBooksN").textContent=`${on}/${n}`;
  $("#fBooksBtn").classList.toggle("on",on!==n);
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
  syncOpt($("#fClass"),[[ALL_SPELLS,"every spell (ignore eligibility)"]].concat(accessNames.map(s=>[s,s])),F.cls,"any source");
  syncOpt($("#fSave"),[...new Set([].concat(...items.map(i=>i.sp.save)))].sort().map(s=>[s,cap1(s)]),F.save,"any save");
  syncOpt($("#fDmg"),[...new Set([].concat(...items.map(i=>i.sp.dmg)))].sort().map(s=>[s,cap1(s)]),F.dmg,"any damage");
  renderFilterBooks(new Set(items.map(i=>i.sp.source)));
  buildToggleRow($("#fTime"),[["action","Action"],["bonus","Bonus"],["reaction","Reaction"],["long","Longer"]],F.time);
  buildToggleRow($("#fComp"),[["v","V"],["s","S"],["m","M"]],F.comp);
  buildToggleRow($("#fTags"),[["ritual","Ritual"],["conc","Concentr."],["atk","Atk roll"],["upcast","Upcasts"],["consume","Consumes mat."]],F.tags);
  $("#fChosen").classList.toggle("on",F.chosen);
  const afc=activeFilterCount();$("#filterBtn").innerHTML="Filters"+(afc?` <span class="badge">${afc}</span>`:"");

  // the sliced cart, not raw state (E2) — "chosen" at a previewed level means chosen BY it
  const chosenKeys=new Set(); R.casters.forEach(r=>{const c=R.cart[r.idx]||{};(c.cantrips||[]).forEach(k=>chosenKeys.add(k));(c.spells||[]).forEach(k=>chosenKeys.add(k));});
  const qmatch=sp=>!F.q||sp.name.toLowerCase().includes(F.q.toLowerCase());
  // everything a spell can be judged on by itself — the eligibility check is separate,
  // because the two escape hatches below need to relax one without relaxing the other
  const passesSp=sp=>{
    if(F.levels.size&&!F.levels.has(sp.level))return false;
    if(F.school&&sp.school!==F.school)return false;
    if(F.save&&!sp.save.includes(F.save))return false;
    if(F.dmg&&!sp.dmg.includes(F.dmg))return false;
    if(F.books&&!F.books.has(sp.source))return false;
    if(F.time.size&&!F.time.has(sp.tcat))return false;
    if(F.comp.size&&![...F.comp].every(c=>sp.comp[c]))return false;
    if(F.tags.has("ritual")&&!sp.ritual)return false;
    if(F.tags.has("conc")&&!sp.conc)return false;
    if(F.tags.has("atk")&&!sp.atk)return false;
    if(F.tags.has("upcast")&&!upcasts(sp))return false;
    if(F.tags.has("consume")&&!(sp.comp&&sp.comp.consume))return false;
    if(F.chosen&&!chosenKeys.has(key(sp.name,sp.source)))return false;
    return true;};
  const wantAll=F.cls===ALL_SPELLS;
  const byClass=i=>wantAll||!F.cls||i.takers.some(t=>t.name===F.cls)||i.srcs.has(F.cls);
  const poolKeys=new Set(items.map(i=>key(i.sp.name,i.sp.source)));
  // The guided PRE-FILTER lived here until G3 (F2 · D118(b)). D126(f) moved that job into
  // the guide's own modal, predicate and all (`guideEligible`), so this list is the
  // character view's list again in every mode — one surface, one meaning.
  const eligible=items.filter(i=>qmatch(i.sp)&&passesSp(i.sp)&&byClass(i));
  // Two ways a spell you can't take still shows up, always DIMMED and never pickable:
  // the explicit "every spell" option, and any search — a name you typed and can't find
  // is worse than one shown greyed with the reason (D40).
  const seen=new Set(eligible.map(i=>key(i.sp.name,i.sp.source)));
  const extra=[];
  const addExtra=(rec,why)=>{const k=key(rec.sp.name,rec.sp.source);
    if(seen.has(k))return; seen.add(k); extra.push({...rec,dim:true,why});};
  const stub=sp=>({sp,takers:[],srcs:new Set(),grants:[]});
  if(wantAll)DATA.spells.forEach(sp=>{
    if(visible(sp)&&qmatch(sp)&&passesSp(sp)&&!poolKeys.has(key(sp.name,sp.source)))
      addExtra(stub(sp),"not on your lists");});
  if(F.q){
    items.forEach(i=>{if(qmatch(i.sp))addExtra(i,"filtered out");});
    DATA.spells.forEach(sp=>{if(visible(sp)&&qmatch(sp)&&!poolKeys.has(key(sp.name,sp.source)))
      addExtra(stub(sp),"not on your lists");});
  }
  items=eligible.concat(extra);
  items.sort((a,b)=>a.sp.level-b.sp.level||(a.dim?1:0)-(b.dim?1:0)||a.sp.name.localeCompare(b.sp.name));
  const nsp=n=>`${n} spell${n===1?"":"s"}`;
  // dimmed rows are only worth counting when you asked for them ("every spell"). While
  // you are typing a name they are just near-misses, and naming them reads as an error.
  const dimNote=(extra.length&&!F.q)?` · ${extra.length} dimmed`:"";
  $("#spCount").textContent=eligible.length?nsp(eligible.length)+dimNote
    :(dimNote?`${extra.length} dimmed`:nsp(0));
  const byLvl={};items.forEach(i=>{(byLvl[i.sp.level]=byLvl[i.sp.level]||[]).push(i);});
  const list=$("#spellList");list.innerHTML="";
  if(!items.length){list.append(mkEmpty());return;}
  for(let l=0;l<=9;l++){if(!byLvl[l])continue;
    const g=lvlGroup("spells",l,byLvl[l].length,lvlTools(l));g.id="lg"+l;
    byLvl[l].forEach(i=>g.append(mkSpell(i,chosenKeys)));list.append(g);}
}
// hover toolbar for a spell-level group: tracks picks at that level + quick clear
function pickedAtLevel(l){return R.casters.reduce((a,rec)=>{const ch=R.cart[rec.idx]||{};const arr=l===0?ch.cantrips:ch.spells;return a+((arr||[]).map(k=>SPELL_BY[k]).filter(s=>s&&s.level===l).length);},0);}
function clearLevel(l){R.casters.forEach(rec=>{const ch=state.chosen[rec.idx];if(!ch)return;["cantrips","spells"].forEach(a=>{ch[a]=(ch[a]||[]).filter(k=>{const s=SPELL_BY[k];return !(s&&s.level===l);});});});save();render();}
function lvlTools(l){const t=el("div","lvltools");const n=pickedAtLevel(l);
  t.append(el("span","lvltools-n",n+(l===0?" known":" picked")));
  const clr=el("button","lvltools-btn ico-only");clr.append(icoEl("x"));
  const clbl="Unpick all "+(l===0?"cantrips":ROMAN[l]+"-level picks");
  clr.title=clbl;clr.setAttribute("aria-label",clbl);
  clr.disabled=!n;clr.onclick=e=>{e.stopPropagation();clearLevel(l);};t.append(clr);return t;}
function mkEmpty(){const e=el("div","empty");
  if(!R.casters.length){e.innerHTML="<b>Add a spellcasting class</b><br>Then its spells appear here to browse and pick.";return e;}
  const q=(state.filters.q||"").trim();
  e.innerHTML="<b>Nothing matches</b><br>Loosen the filters — or make it yourself.";
  const b=el("button","btn on");b.style.marginTop="12px";
  b.classList.add("lbl-ico");b.innerHTML="";
  b.append(icoEl("plus"),document.createTextNode(q?`Create “${q}” as a custom spell`:"Create a custom spell"));
  b.onclick=()=>openCustom(q?{name:q}:null);
  e.append(b);return e;}
// ── spell detail: hover tooltip + click modal ──────────────────────────────
const SPTIP=el("div","sptip");document.body.appendChild(SPTIP);
const SPMODAL=el("div","spmodal hidden");document.body.appendChild(SPMODAL);
SPMODAL.onclick=e=>{if(e.target===SPMODAL||e.target.classList.contains("x"))SPMODAL.classList.add("hidden");};
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;
  // the guide's pick modal is the topmost layer while it is open, so Escape belongs to
  // it alone — closing what sits UNDER a modal is the trap D120 logged against the
  // timeline, and there is no reason to repeat it here
  if(GPICK){closeGpick();return;}
  // the forms chooser is the topmost layer while it is open, for the same reason
  if(FAM){closeFam();return;}
  SPMODAL.classList.add("hidden");hideTip();closeBswMenus();closeTimeline();});
document.addEventListener("click",()=>hideTip(),true);   // a tap elsewhere dismisses a tapped tip
function esc(s){return (s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
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
// a spell "upcasts" when it has higher-level entries; cantrips scale with character
// level instead, so they never count.
const upcasts=sp=>sp.level>0&&(sp.higher||[]).length>0;
// sentinel for the class/list filter's "ignore eligibility" option
const ALL_SPELLS="__all";
function compText(sp){const c=sp.comp||{};const p=[];if(c.v)p.push("V");if(c.s)p.push("S");if(c.m)p.push("M"+(c.mat?` (${c.mat})`:""));return p.join(", ")||"—";}
// the same line, with the components your build removes struck through
function compModalHTML(sp,eff){
  const c=sp.comp||{}, out=[];
  const mark=(L,txt)=>{const k=eff&&eff.gone.has(L)?"cgone":eff&&eff.iffy.has(L)?"ciffy":"";
    return k?`<span class="${k}">${txt}</span>`:txt;};
  if(c.v)out.push(mark("v","V"));
  if(c.s)out.push(mark("s","S"));
  if(c.m)out.push(mark("m","M"+(c.mat?` (${esc(c.mat)})`:"")));
  return out.join(", ")||"—";}
function metaLine(sp){const r=sp.ritual?" (ritual)":"";
  return sp.level===0?`${esc(sp.school)} cantrip${r}`:`${ROMAN[sp.level]}-level ${esc(sp.school)}${r}`;}
// ONE source-book chip for the whole app (D39). Its popover names the book in full and
// says where the element is printed (D51). Not to be confused with `.srcbadge`, which
// says who GRANTS a spell in your build.
function bookChip(src,page){
  const c=Object.assign(el("span","bchip"),{textContent:src});
  attachTip(c,bookTip(src,page));
  return c;}
// full book name + where it is printed, for whatever element the chip sits on
const bookTip=(src,page)=>`<h4>${esc(bookName(src))}</h4>`
  +(page?`<div class="line"><b>Page</b><span>${esc(String(page))}</span></div>`:"")
  +`<div class="line"><b>Code</b><span>${esc(src)}</span></div>`;
function tipHTML(sp){return `<h4>${esc(sp.name)}</h4><div class="sub">${metaLine(sp)}</div>`
  +`<div class="line"><b>Time</b> ${esc(cap1(sp.time))}</div><div class="line"><b>Range</b> ${esc(sp.range)}</div>`
  +`<div class="line"><b>Duration</b> ${sp.conc?"Concentration, ":""}${esc(sp.durTxt)}</div>`
  +((sp.desc||[]).length?`<p>${ccText(sp.desc[0].slice(0,240))}${sp.desc[0].length>240?"…":""}</p>`:"")+`<p style="color:var(--muted);font-size:11px">click for full details</p>`;}
function posTip(ev){const pad=14,w=SPTIP.offsetWidth,h=SPTIP.offsetHeight;let x=ev.clientX+pad,y=ev.clientY+pad;
  if(x+w>innerWidth-8)x=ev.clientX-w-pad; if(y+h>innerHeight-8)y=innerHeight-h-8; SPTIP.style.left=Math.max(8,x)+"px";SPTIP.style.top=Math.max(8,y)+"px";}
function showTip(sp,ev){SPTIP.innerHTML=tipHTML(sp);SPTIP.classList.add("show");posTip(ev);}
function hideTip(){SPTIP.classList.remove("show");}
// generic styled hover popover for anything that isn't a spell (markers, chips…).
// Replaces a native `title`, which the OS renders slowly and unstyled.
function attachTip(node,html){
  const show=ev=>{SPTIP.innerHTML=html;SPTIP.classList.add("show");posTip(ev);};
  node.onmouseenter=show; node.onmousemove=posTip; node.onmouseleave=hideTip;
  // touch has no hover: tap to show, tap anywhere else (or Esc) to dismiss
  node.tabIndex=0; node.onfocus=ev=>show(ev.clientX!=null?ev:tipAnchor(node));
  node.onblur=hideTip;
  // An element that DOES something keeps doing it — tap-to-show is only for inert
  // marks and chips. Set the element's own onclick BEFORE calling this, or the tip
  // silently becomes the whole click (it disabled the preview's "order…" button).
  const own=node.onclick;
  node.onclick=own?(ev=>{hideTip();own.call(node,ev);})
                  :(ev=>{ev.stopPropagation();show(ev);});}
// re-rendered nodes are REUSED, so a stale tip would keep firing on a node whose
// meaning has changed — clear before re-attaching
function detachTip(node){
  node.onmouseenter=node.onmousemove=node.onmouseleave=null;
  node.onfocus=node.onblur=node.onclick=null; node.removeAttribute("tabindex");}
// a synthetic pointer at the node, for keyboard focus where there is no cursor
const tipAnchor=n=>{const r=n.getBoundingClientRect();return {clientX:r.left,clientY:r.bottom};};
const tipBlock=(title,body)=>`<h4>${esc(title)}</h4><p style="margin-top:5px">${esc(body)}</p>`;
// a labelled key/value popover — `rows` values are already-escaped HTML
const tipRows=(title,rows)=>`<h4 style="margin-bottom:6px">${esc(title)}</h4>`
  +rows.map(([k,v])=>`<div class="line"><b>${esc(k)}</b><span>${v}</span></div>`).join("");
// a description paragraph that is really a sub-heading (the extractor emits a named
// entry's name as its own short "Title." line) — render it distinctly, not as body.
const _TITLE_RE=/^[A-Z][A-Za-z0-9'’/\- ]{0,48}\.$/;
const isDescTitle=p=>_TITLE_RE.test(p)&&p.split(/\s+/).length<=5;
// 5etools writes a sub-heading as its own paragraph and a list item as a paragraph that
// happens to start with a bullet. Marking the second kind is what stops Thaumaturgy's six
// options printing as six loose sentences.
const descP=p=>isDescTitle(p)?`<p class="spttl">${esc(p.replace(/\.\s*$/,""))}</p>`
  :/^\s*[•\u2022]/.test(p)?`<p class="bul">${ccText(p)}</p>`:`<p>${ccText(p)}</p>`;
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
    +`<div class="acc-row"><span class="secttl">Access</span>`
    +`<div class="achips acc-merged">${merged}</div>`
    +`<button class="acc-toggle" type="button" title="Show by category" aria-label="Show by category">⌄</button></div>`
    +`<div class="acc-cats">${rows}</div></div>`;}
const abMod=v=>{const m=Math.floor((v-10)/2);return (m>=0?"+":"−")+Math.abs(m);};
const AB_ORDER=["str","dex","con","int","wis","cha"];
// a summon spell prints its creature's stat block beside it (D50) — collapsed by default
// Every stat block a spell can print: its own summon first, then the creature SET it
// names or filters for (D78). More than one and the section becomes a carousel with a
// source filter — Find Familiar alone reaches 65 forms across a dozen books.
// Flag, don't prune (D42): a form from a book you have switched off is still one of the
// spell's forms — it is filtered in the carousel's own book panel, not deleted here.
// `_ck` is the creature's stable identity: the spell's own printed block is "@self", any
// other form is its bestiary key. Favourites are stored against these.
function spellCreatures(sp){
  const out=sp.statblock?[{...sp.statblock,_ck:"@self"}]:[];
  (sp.creatures||[]).forEach(k=>{const m=(DATA.monsters||{})[k]; if(m)out.push({...m,_ck:k});});
  return out;}
// ── forms a FEATURE adds to a spell (D109) ─────────────────────────────────
// Pact of the Chain's Imp is not Find Familiar's form — it is YOURS, and only while you
// have the feature. The extractors emit `forms` on the feat / optional feature; the build
// decides which of them are live.
// A `forms` grant names ONE PRINTING of the spell ("find familiar|PHB"), but the record the
// build holds comes from `grantRec()`, which resolves by NAME and hands back the first
// VISIBLE printing — so the 2014 boon's grant lands on the 2024 Find Familiar, and the old
// exact `name|source` compare returned NOTHING: all eight granted forms disappeared into
// Find Familiar's own 65, with no `_from` badge and nothing on screen saying why. Two
// printings answer for each other, decided by the machinery that already collapses them:
// D127's reprint pointer in either direction, or D19's edition collapse key.
const sameSpellLine=(a,b)=>!!a&&!!b&&(a===b||spellDedupeId(a)===spellDedupeId(b)
  ||supersededRec(a.supersededBy)===b||supersededRec(b.supersededBy)===a);
// The printing a ref names, or null. `key()` is case-sensitive and the 2014 refs arrive
// lowercased ("find familiar|PHB"), so the name index is what can answer.
function refPrinting(ref){
  const p=String(ref||"").split("|"), nm=(p[0]||"").trim().toLowerCase(), src=(p[1]||"").trim();
  if(!nm||!src)return null;
  return (SPELL_BY_NAME[nm]||[]).find(s=>String(s.source).toUpperCase()===src.toUpperCase())||null;
}
function formRefMatches(sp,ref){
  if(!sp)return false;
  const named=refPrinting(ref);
  if(named)return sameSpellLine(named,sp);
  // a bookless ref, or a printing this library doesn't hold: the name is the collapse key,
  // and unknown must never read as excluded (D31)
  return String(ref||"").split("|")[0].trim().toLowerCase()===spellDedupeId(sp);
}
function activeFormGrants(sp){
  if(!sp)return [];
  const out=[];
  const take=(rec)=>((rec&&rec.forms)||[]).forEach(g=>{
    if(!formRefMatches(sp,g.spell))return;
    out.push({giver:rec.name,mode:g.mode||"add",creatures:g.creatures||[]});});
  featsAt().forEach(fk=>take(FEAT_BY[baseKey(fk)]));
  optFeatsAt().forEach(ok=>take(OPT_BY[baseKey(ok)]));
  return out;
}
// A 2014 ref carries no book, so it resolves to every book that prints that creature —
// but a familiar list should offer Imp once. Prefer a copy from a book you have on, then
// the newest edition of it.
function pickFormKey(keys){
  const on=keys.filter(k=>srcOn(k.split("|")[1]));
  return (on.length?on:keys).slice()
    .sort((a,b)=>srcRank(b.split("|")[1])-srcRank(a.split("|")[1]))[0];
}
function grantedCreatures(sp){
  const out=[],seen=new Set();
  activeFormGrants(sp).forEach(g=>{
    const byName=new Map();
    g.creatures.forEach(k=>{const n=k.split("|")[0].toLowerCase();
      if(!byName.has(n))byName.set(n,[]); byName.get(n).push(k);});
    byName.forEach(keys=>{const k=pickFormKey(keys), m=k&&(DATA.monsters||{})[k];
      if(m&&!seen.has(k)){seen.add(k);out.push({...m,_ck:k,_from:g.giver});}});});
  return out;
}
// what this BUILD may summon: the forms your features add, then the spell's own set. A
// grant marked `only` replaces the list rather than widening it.
function buildCreatures(sp){
  const granted=grantedCreatures(sp);
  if(!granted.length)return spellCreatures(sp);
  if(activeFormGrants(sp).some(g=>g.mode==="only"))return granted;
  const have=new Set(granted.map(c=>c._ck));
  return granted.concat(spellCreatures(sp).filter(c=>!have.has(c._ck)));
}
// Which forms this character actually uses. Find Familiar carries 65 of them and nobody
// prints 65 stat blocks; marking the two you take turns the appendix into a usable sheet.
// It lives in the BUILD — a chosen familiar belongs to a character and travels with an
// export, exactly like a custom source (D55).
const favKey=sp=>key(sp.name,sp.source);
const favsFor=sp=>((state.sbFav||{})[favKey(sp)])||[];
function toggleFav(sp,ck){
  if(!state.sbFav)state.sbFav={};
  const k=favKey(sp), cur=new Set(state.sbFav[k]||[]);
  cur.has(ck)?cur.delete(ck):cur.add(ck);
  if(cur.size)state.sbFav[k]=[...cur]; else delete state.sbFav[k];
  save();
  renderFormPins();      // marking a form answers the offer, so the offer goes
}
// ── the forms a feature opened up (D131(g)) ────────────────────────────────
// Taking Pact of the Chain adds eight forms to Find Familiar — and the star that records
// which one you took lives inside the spell's own modal, a surface there is no reason to
// open. So the character view carries the control, beside the feature that made it, and it
// opens a chooser of its own (`openFam`).
// It is OPTIONAL throughout: it marks nothing on its own (D31 — the app never states a
// choice the character hasn't made), and while nothing is marked the row is an OFFER the ×
// puts away for good in this build. Mark a form and the row becomes an ordinary field
// showing its value, because there is now something to show and to change.
function formPinOffers(){
  const skip=new Set(state.sbFavSkip||[]), by=new Map();
  const take=rec=>((rec&&rec.forms)||[]).forEach(g=>{
    const nm=String(g.spell||"").split("|")[0].trim(); if(!nm)return;
    // grantRec() is the resolution the GRANT itself takes, so a mark made from here is
    // stored against the printing this build holds — and prints from it
    const sp=grantRec(nm); if(!sp||!formRefMatches(sp,g.spell))return;
    const k=favKey(sp);
    // dismissed AND unanswered: the offer is gone. A build that HAS marked a form keeps
    // the field, whichever surface marked it — a value is not a nudge.
    if(skip.has(k)&&!favsFor(sp).length)return;
    if(buildCreatures(sp).length<2)return;        // one form is not a choice (D105)
    let o=by.get(k); if(!o){o={sp,key:k,givers:[]};by.set(k,o);}
    if(!o.givers.includes(rec.name))o.givers.push(rec.name);});
  featsAt().forEach(fk=>take(FEAT_BY[baseKey(fk)]));
  optFeatsAt().forEach(ok=>take(OPT_BY[baseKey(ok)]));
  return [...by.values()].map(o=>({...o,n:grantedCreatures(o.sp).length,
    marked:buildCreatures(o.sp).filter(c=>favsFor(o.sp).includes(c._ck))}));
}
function renderFormPins(){
  const box=$("#formPinBlock"); if(!box)return;
  const offers=formPinOffers();
  box.classList.toggle("hidden",!offers.length);
  box.innerHTML=""; if(!offers.length)return;
  box.append(el("label","fld","Summon forms"));
  offers.forEach(o=>{
    const row=el("div","fldrow");
    const btn=el("button","picksel"+(o.marked.length?"":" ph"));
    const bl=el("span","lbl-ico");
    bl.append(icoEl("star"),document.createTextNode(
      o.marked.length?o.marked.map(c=>c.name).join(", "):`choose a ${o.sp.name} form…`));
    btn.append(bl); btn.append(el("span","pk-caret","⌄"));
    btn.title=`Choose which ${o.sp.name} forms this character uses`;
    btn.onclick=()=>openFam(o.sp);
    row.append(btn);
    // the × answers an OFFER, so it is only there while there is nothing to show
    if(!o.marked.length){
      const x=xBtn(null,()=>{
        state.sbFavSkip=[...new Set([...(state.sbFavSkip||[]),o.key])];
        save(); renderFormPins();});
      x.setAttribute("aria-label","Dismiss");
      x.title="Dismiss — you can still mark forms in the spell's own details";
      row.append(x);}
    box.append(row);
    if(!o.marked.length)box.append(el("div","note",
      `${o.givers.join(" and ")} adds ${o.n} form${o.n===1?"":"s"}. Only marked forms print.`));
  });
}
// ── the summon-forms chooser (D131(g)) ─────────────────────────────────────
// One surface for "which forms does this character use", in two tiers. The forms a FEATURE
// added lead — they are the reason this modal exists — in the picker's own group box, above
// the spell's regular set, which is offered folded and a step quieter. Both write through
// `toggleFav`, the same call the carousel's star makes, so the marks, the carousel order
// (`orderedCreatures`) and the printed appendix (`printCreatures`) can never disagree.
let FAM=null;      // {sp, own:boolean} — `own` is the fold state of the second tier
function openFam(sp){
  if(!sp)return;
  // the spell's own set opens folded UNLESS a form from it is already marked — a fold that
  // hides a value you set is a trap (D94)
  const marked=new Set(favsFor(sp));
  const ownMarked=spellCreatures(sp).some(c=>marked.has(c._ck));
  FAM={sp,own:ownMarked};
  $("#famModal").classList.remove("hidden");
  renderFam();
}
function closeFam(){ FAM=null; $("#famModal").classList.add("hidden"); }
function famRow(sp,c,marked){
  const on=marked.has(c._ck);
  const row=el("div","entrow"+(on?" on":""));
  const main=el("div","entmain");
  const nm=el("div","entname");nm.append(document.createTextNode(c.name));
  if(c.source)nm.append(bookChip(c.source,c.page));
  main.append(nm);
  const meta=[c.kind,c.cr!=null&&c.cr!==""?"CR "+c.cr:""].filter(Boolean).join(" · ");
  if(meta)main.append(Object.assign(el("div","entprev"),{textContent:meta,title:meta}));
  row.append(main);
  const btn=el("button","tk ico-only"+(on?" on":""));
  btn.append(icoEl(on?"check":"plus"));
  const lbl=on?"Marked — click to unmark":"Mark this form";
  btn.setAttribute("aria-label",lbl); btn.title=lbl+" · only marked forms print";
  // the whole row is the target; the button stops its own click so one tap is one toggle
  const hit=e=>{e.stopPropagation(); toggleFav(sp,c._ck); renderFam();};
  btn.onclick=hit; row.onclick=hit;
  row.append(btn);
  return row;
}
function renderFam(){
  const list=$("#famList"); if(!list||!FAM)return;
  const sp=FAM.sp, all=buildCreatures(sp), marked=new Set(favsFor(sp));
  const granted=all.filter(c=>c._from), own=all.filter(c=>!c._from);
  const givers=[...new Set(granted.map(c=>c._from))];
  $("#famTitle").textContent=`${sp.name} forms`;
  $("#famSub").textContent=(givers.length
    ? `${givers.join(" and ")} adds ${granted.length} of these. `:"")
    +"Only marked forms print, and a marked form leads the carousel.";
  list.innerHTML="";
  if(granted.length){
    const g=el("div","entgroup");
    const h=el("div","eghead");
    h.append(el("b",null,givers.join(" and ")));
    h.append(el("span","cgn",`${granted.length} form${granted.length===1?"":"s"}`));
    g.append(h);
    granted.forEach(c=>g.append(famRow(sp,c,marked)));
    list.append(g);
  }
  if(own.length){
    // the fold header keeps naming what it holds while closed (D94)
    const box=el("div","lvlgroup famown"+(FAM.own?"":" folded"));
    const h=el("h3");
    const fold=el("button","lvlfold");fold.type="button";
    fold.append(el("span",null,`${sp.name}'s own forms`));
    fold.append(el("span","n",String(own.length)));
    const car=el("span","lvlcar");if(FAM.own)car.classList.add("up");fold.append(car);
    fold.setAttribute("aria-expanded",String(FAM.own));
    fold.onclick=e=>{e.stopPropagation();FAM.own=!FAM.own;renderFam();};
    h.append(fold);box.append(h);
    own.forEach(c=>box.append(famRow(sp,c,marked)));
    list.append(box);
  }
  if(!all.length)list.append(el("div","empty","This spell carries no stat blocks."));
}
// favourites first, then the forms a feature granted, then the rest — original order
// within each band. A form your build adds is the one you came here to look at.
function orderedCreatures(sp,list){
  const f=new Set(favsFor(sp));
  const rank=c=>f.has(c._ck)?0:c._from?1:2;
  return [...list].map((c,i)=>[c,i]).sort((a,b)=>rank(a[0])-rank(b[0])||a[1]-b[1]).map(x=>x[0]);
}
// what a printed card shows: the marked forms, or the only form when there is just one
function printCreatures(sp){
  const all=buildCreatures(sp); if(!all.length)return [];
  const f=new Set(favsFor(sp));
  const picked=all.filter(c=>f.has(c._ck));
  return picked.length?picked:(all.length===1?all:[]);
}
// the body of ONE stat block — the carousel repaints just this when you step
function sbBodyHTML(b){
  const line=(k,v)=>v?`<div class="sbr"><b>${k}</b><span>${ccText(v)}</span></div>`:"";
  const kv=o=>Object.entries(o||{}).map(([k,v])=>`${k} ${v}`).join(", ");
  // the monster-forge ability table: two ability columns, each score / mod / save. A save
  // the creature is proficient in is printed as given and bold; with no proficiency a save
  // IS the modifier, which is what a summon always has (none of the 24 carry save profs).
  const sv=k=>{const raw=(b.saves||{})[k];
    return raw?{t:String(raw).replace(/^\+?/,m=>m||"+"),prof:true}:{t:abMod(b.abilities[k]),prof:false};};
  const half=[["str","int"],["dex","wis"],["con","cha"]];
  const abils=AB_ORDER.some(k=>b.abilities[k]!=null)
    ?`<table class="sbab"><tr><td></td><td class="mh">Mod</td><td class="mh">Save</td>`
      +`<td></td><td class="mh">Mod</td><td class="mh">Save</td></tr>`
     +half.map(pair=>"<tr>"+pair.map(k=>{const v=b.abilities[k];
        if(v==null)return `<td class="sbal"></td><td class="sbn"></td><td class="sbn"></td>`;
        const s=sv(k);
        return `<td class="sbal"><span class="abchip ${k}">${ABIL_SHORT[k]}</span>`
          +`<span class="sbav">${v}</span></td>`
          +`<td class="sbn">${abMod(v)}</td>`
          +`<td class="sbn${s.prof?" prof":""}">${esc(s.t)}</td>`;}).join("")+"</tr>").join("")
     +`</table>`
    :"";
  const secs=(b.sections||[]).map(sec=>`<div class="sbsec"><h5>${esc(sec.label)}</h5>`
    +sec.items.map(it=>`<p>${it.name?`<b>${esc(it.name)}.</b> `:""}${it.text.map(ccText).join(" ")}</p>`).join("")
    +`</div>`).join("");
  return `<div class="sb-kind">${esc([b.kind,b.align].filter(Boolean).join(", "))}</div>`
    +line("AC",b.ac)+line("HP",b.hp)+line("Speed",b.speed)
    +(abils?`<div class="sbabs">${abils}</div>`:"")
    +line("Skills",kv(b.skills))
    +line("Vulnerabilities",b.vulnerable)+line("Resistances",b.resist)
    +line("Immunities",[b.immune,b.condImmune].filter(Boolean).join(", "))
    +line("Senses",b.senses)+line("Languages",b.languages)
    +line("CR",b.cr)+line("Prof. Bonus",b.pb)
    +secs;
}
function statblockHTML(sp){
  const all=orderedCreatures(sp,buildCreatures(sp)); if(!all.length)return "";
  const b=all[0];
  // only the FIRST frame is built as markup; stepping repaints the body in place, which
  // keeps the modal cheap when a spell reaches 65 forms
  const srcs=[...new Set(all.map(x=>x.source).filter(Boolean))].sort();
  // the book panel is opened from a ghost icon that sits just before the chevron, so the
  // head stays a title rather than a control strip
  const booksBtn=(all.length<2||srcs.length<2)?"":
    `<button class="sb-books ico" type="button" title="Which books these forms come from" aria-label="Filter by book">${ICONS.book}</button>`;
  // the star only earns its place where there is a choice to record
  const favBtn=all.length<2?"":
    `<button class="sb-fav ico" type="button" aria-pressed="false" aria-label="Mark this form">${ICONS.star}</button>`;
  const panel=(all.length<2||srcs.length<2)?"":
    `<div class="sb-bookpanel srcpanel hidden"><div class="sb-booknote"></div><div class="sb-booklist"></div></div>`;
  // controls sit BELOW the block: you read the creature, then step to the next one
  const nav=all.length<2?"":`<div class="sb-nav">`
    +`<button class="sb-prev" type="button" aria-label="Previous creature">‹</button>`
    +`<span class="sb-pos">1 / ${all.length}</span>`
    +`<button class="sb-next" type="button" aria-label="Next creature">›</button></div>`;
  // The head is a ROW, not a button: a <button> cannot contain another <button> — the
  // parser closes the outer one at the inner, which hoisted the book icon and the chevron
  // out of the header and dropped them onto their own line. Same trap as `.bswrow`.
  return `<div class="sblock" data-exp="0" data-i="0">`
    +`<div class="sb-head">`
      +`<button class="sb-toggle" type="button" aria-expanded="false">`
        +`<span class="secttl">${esc(b.name)}</span>`
        +`<span class="sb-who">stat block</span></button>`
      +favBtn+booksBtn
      +`<button class="sb-caretbtn" type="button" aria-label="Expand stat block">`
        +`<span class="sb-caret"></span></button></div>`
    +panel
    +`<div class="sb-body">${sbBodyHTML(b)}</div>`+nav+`</div>`;}
// What this BUILD changes about casting a granted spell — "without expending a spell
// slot", "you automatically succeed on the save" (D79). Empty for a spell you simply know.
function grantNotes(sp){
  if(!R)return [];
  const k=key(sp.name,sp.source), out=[], seen=new Set();
  const add=(src,note)=>{if(!note)return;const kk=src+"|"+note;if(seen.has(kk))return;seen.add(kk);out.push({src,note});};
  const e=R.pool&&R.pool.get(k); if(e)(e.grants||[]).forEach(g=>add(g.src,g.note));
  (R.freeCasts||[]).forEach(fc=>{if(fc.name===sp.name)add(fc.src,fc.note);});
  // a designation (D135) changes this spell without granting it — same channel, same block
  (R.marks||[]).forEach(m=>{if(m.key===k)add(m.src,m.note);});
  return out;}
function modalHTML(sp){
  // the subtitle already reads "3rd-level Evocation" / "Evocation cantrip", so Level and
  // School as their own rows were the top of the grid saying nothing twice (D49, widened
  // from cantrips to every spell)
  // the Components row marks what your own build removes (D85) — struck through when the
  // feature always applies, merely marked when it depends on something we can't check
  const eff=compEffect(sp,modsForSpell(sp,null));
  const grid=[["Casting time",esc(cap1(sp.time))],["Range",esc(sp.range)],["Components",compModalHTML(sp,eff)],
              ["Duration",(sp.conc?"Concentration, up to ":"")+esc(sp.durTxt)]];
  const bk=sp.source!==CORE?` <span class="bchip" data-book="${esc(sp.source)}"${sp.page?` data-page="${esc(String(sp.page))}"`:""}>${esc(sp.source)}</span>`:"";
  return `<div class="box"><button class="x ico" type="button" title="Close" aria-label="Close">${ICONS.x}</button>`
    +`<div class="mh"><h3>${esc(sp.name)}${bk}</h3>`
    +`<div class="sub">${metaLine(sp)}</div></div><div class="mb">`
    +`<div class="grid">${grid.map(([k,v])=>`<b>${k}</b><span>${v}</span>`).join("")}</div>`
    +(sp.desc||[]).map(descP).join("")
    +((sp.higher||[]).length?`<div class="hl">${sp.higher.map(descP).join("")}</div>`:"")
    +grantNotes(sp).map(n=>`<div class="gnote"><b>${esc(n.src)}</b><p>${ccText(n.note)}</p></div>`).join("")
    +eff.why.map(m=>`<div class="gnote cmod"><b>${esc(m.giver+" · "+m.feature)}</b>`
      +(m.when?`<span class="cmwhen">${esc(m.when)}</span>`:"")
      +`<p>${ccText(m.note)}</p></div>`).join("")
    +statblockHTML(sp)+accessHTML(sp)+metamagicHTML(sp)+`</div></div>`;}
// D124(c): the selected metamagic that can touch this spell — an Access-style row
// (label "Metamagic", one word, no wrap), present only when a class that owns
// Metamagic can actually take the spell and at least one option's condition holds
function metamagicHTML(sp){
  const mm=activeMetamagic(); if(!mm)return "";
  const e=R&&R.pool&&R.pool.get(key(sp.name,sp.source));
  if(!e||!e.takers.some(t=>mm.rows.has(t.idx)))return "";
  const hits=mm.opts.map(o=>({o,d:METAMAGIC_WHEN[o.name]})).filter(x=>x.d.test(sp));
  if(!hits.length)return "";
  const chips=hits.map(x=>`<span class="mmchip" data-mmn="${esc(x.o.name)}" data-mmw="${esc(x.d.why)}">${esc(x.d.tag)}</span>`).join("");
  return `<div class="acc-row mmrow"><span class="secttl">Metamagic</span><div class="achips">${chips}</div></div>`;
}
function openSpellModal(sp){hideTip();SPMODAL.innerHTML=modalHTML(sp);
  SPMODAL.querySelectorAll(".mmchip").forEach(c=>attachTip(c,
    tipBlock(c.dataset.mmn,"This spell "+c.dataset.mmw+". Advisory — the option's full text has the final word.")));
  const at=SPMODAL.querySelector(".acc-toggle");
  if(at)at.onclick=()=>{const a=at.closest(".access");a.dataset.exp=a.dataset.exp==="1"?"0":"1";};
  const sbt=SPMODAL.querySelector(".sb-toggle");
  if(sbt){const flip=()=>{const w=sbt.closest(".sblock");const open=w.dataset.exp!=="1";
      w.dataset.exp=open?"1":"0";sbt.setAttribute("aria-expanded",String(open));};
    sbt.onclick=flip;
    const cb=SPMODAL.querySelector(".sb-caretbtn"); if(cb)cb.onclick=e=>{e.stopPropagation();flip();};}
  wireCreatureNav(sp);
  // chips written as markup still get the popover treatment
  SPMODAL.querySelectorAll(".bchip[data-book]").forEach(c=>attachTip(c,bookTip(c.dataset.book,c.dataset.page)));
  if(sp.source===HB_SRC){const mb=SPMODAL.querySelector(".mb");if(mb){const row=el("div","hbtools");
    row.append(el("span","hbtag","Homebrew"));const sp2=el("span");sp2.style.flex="1";row.append(sp2);
    const e=el("button","btn","Edit");e.onclick=()=>{SPMODAL.classList.add("hidden");openCustom(customFromSpell(sp),true);};
    const d=armConfirm(el("button","btn danger"),"Delete",()=>{deleteCustom(sp);SPMODAL.classList.add("hidden");});
    row.append(e,d);mb.append(row);}}
  SPMODAL.classList.remove("hidden");}
// the carousel: step through a spell's creature set in place, filtered by book
function wireCreatureNav(sp){
  const wrap=SPMODAL.querySelector(".sblock"); if(!wrap)return;
  const nav=wrap.querySelector(".sb-nav"); if(!nav)return;
  const all=buildCreatures(sp);
  const panel=wrap.querySelector(".sb-bookpanel");
  const srcs=[...new Set(all.map(x=>x.source).filter(Boolean))].sort();
  // A creature's book is very often one the digest has no record of: `DATA.sources` is
  // built from spell and class content, and MM, XMM, XDMG, ToA, WDH and friends publish
  // monsters and nothing else. Filtering the checklist against it dropped 8 of Find
  // Familiar's 12 books from the list entirely — and, worse, `srcOn` reported those books
  // as OFF, so the carousel opened on 2 of 65 forms and only showed the rest once you
  // unticked everything and hit the fallback. The list is built from the FORMS instead.
  const sbMap={}; srcs.forEach(c=>{const s=DATA.sources[c];
    sbMap[c]={name:(s&&s.name)||c,group:(s&&s.group)||"other",counts:{spells:0}};});
  // A book the source list has never heard of cannot be "off in your sources" — it is
  // unknown, and unknown must never read as excluded (D31). Known books still follow it.
  const bookSel=panel?new Set(srcs.filter(c=>DATA.sources[c]?srcOn(c):true)):null;
  const shown=()=>{ if(!bookSel)return orderedCreatures(sp,all);
    const list=all.filter(x=>x._from||bookSel.has(x.source));
    return orderedCreatures(sp,list.length?list:all); };
  const favBtn=wrap.querySelector(".sb-fav");
  // The controls sit under the block, so a taller or shorter creature would shove them —
  // and the page — under the cursor. Pin the nav's viewport position across the repaint and
  // give the difference to the scroller, so every size change is absorbed above it.
  const scroller=SPMODAL.querySelector(".box");
  const paint=()=>{
    const list=shown(); if(!list.length)return;
    const before=nav.getBoundingClientRect().top;
    let i=Math.max(0,Math.min(+wrap.dataset.i||0,list.length-1)); wrap.dataset.i=String(i);
    const b=list[i];
    wrap.querySelector(".secttl").textContent=b.name;
    // say WHY a form is on the list when it is not the spell's own
    const who=wrap.querySelector(".sb-who");
    if(who){who.textContent=b._from?b._from:"stat block";who.classList.toggle("granted",!!b._from);}

    nav.querySelector(".sb-pos").textContent=`${i+1} / ${list.length}`;
    if(favBtn){const on=favsFor(sp).includes(b._ck);
      favBtn.classList.toggle("on",on); favBtn.setAttribute("aria-pressed",String(on));
      favBtn.title=on?"Marked — this form prints and comes first":"Mark this form: only marked forms print";}
    const body=wrap.querySelector(".sb-body"); if(body)body.innerHTML=sbBodyHTML(b);
    nav.querySelector(".sb-prev").disabled=list.length<2;
    nav.querySelector(".sb-next").disabled=list.length<2;
    if(scroller){const after=nav.getBoundingClientRect().top;
      if(after!==before)scroller.scrollTop+=after-before;}
  };
  const step=d=>{const list=shown(); if(!list.length)return;
    wrap.dataset.i=String(((+wrap.dataset.i||0)+d+list.length)%list.length); paint();};
  if(favBtn)favBtn.onclick=e=>{e.stopPropagation();
    const list=shown(); const b=list[Math.max(0,Math.min(+wrap.dataset.i||0,list.length-1))];
    if(!b)return;
    toggleFav(sp,b._ck);
    // marking re-sorts the carousel under the cursor, so follow the creature you marked
    const after=shown(); const j=after.findIndex(x=>x._ck===b._ck);
    if(j>=0)wrap.dataset.i=String(j);
    paint();};
  nav.querySelector(".sb-prev").onclick=e=>{e.stopPropagation();step(-1);};
  nav.querySelector(".sb-next").onclick=e=>{e.stopPropagation();step(1);};
  nav.onclick=e=>e.stopPropagation();
  const btn=wrap.querySelector(".sb-books");
  if(btn){btn.onclick=e=>{e.stopPropagation();panel.classList.toggle("hidden");
    if(wrap.dataset.exp!=="1"){wrap.dataset.exp="1";
      const t=wrap.querySelector(".sb-toggle");if(t)t.setAttribute("aria-expanded","true");}};}
  if(panel){panel.onclick=e=>e.stopPropagation();
    const list=panel.querySelector(".sb-booklist"), note=panel.querySelector(".sb-booknote");
    const off=srcs.filter(x=>!bookSel.has(x));
    note.textContent=off.length
      ? `${off.length} of these books ${off.length===1?"is":"are"} off in your sources — tick one to include its forms here.`
      : "";
    const forms=code=>all.filter(y=>y.source===code).length;
    // a bestiary book has no spell count to sort on, so sort by what IS being counted
    const draw=()=>renderSourceChecklist(list,bookSel,()=>{draw();wrap.dataset.i="0";paint();},
      new Set(srcs),code=>{const n=forms(code); return `${n} form${n===1?"":"s"}`;},
      sbMap,{sortRows:(a,b)=>forms(b[0])-forms(a[0])||a[1].name.localeCompare(b[1].name)});
    draw();}
  paint();
}
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
  // the printed book lives in the detail modal now — this row is for what you scan on (D39)
  [sp.school,cap1(sp.time),sp.range,sp.conc?"conc.":""].filter(Boolean).forEach(x=>meta.append(el("span",null,x)));
  d.append(meta);
  const take=el("div","take");
  if(i.dim){d.classList.add("dim");
    take.append(Object.assign(el("span","whytag"),{textContent:i.why,
      title:i.why==="filtered out"?"Matches your search but not your other filters."
        :"No class, subclass, species or feat in your build grants this spell."}));
    d.append(take);return d;}
  // per-class take buttons
  const seen=new Set();
  i.takers.forEach(t=>{ if(seen.has(t.idx))return; seen.add(t.idx);
    if(i.always&&i.always.has(t.idx))return;   // always-prepared by this class's own subclass/feature
    const ch=R.cart[t.idx]||state.chosen[t.idx];const on=ch&&((t.cantrip?ch.cantrips:ch.spells)||[]).includes(k);
    const rec=R.casters.find(r=>r.idx===t.idx);if(!rec)return;
    // running count for this source's bucket (cantrips vs prepared/known), alert if over its forecast
    const bucket=t.cantrip?"cantrips":"spells";
    const sel=((ch&&ch[bucket])||[]).length;
    const cart=R.cart[t.idx];
    const cap=t.cantrip?rec.cantrips:(cart&&cart.known?cart.known.total:rec.prepared);
    // a wizard copying spells past its free book size isn't "over" — copying is allowed
    const over=sel>cap && !(cart&&cart.known&&cart.known.book&&!t.cantrip);
    const btn=el("button","tk"+(on?" on":"")+(over?" over":""));
    if(on)btn.append(icoEl("check"));
    btn.append(document.createTextNode(t.name+" "));btn.append(el("span","c",`${sel}/${cap}`));
    btn.title=(on?"Prepared — click to remove. ":"Not prepared — click to add. ")+`${t.name}: ${sel} of ${cap} ${t.cantrip?"cantrips":(cart&&cart.known?"in spellbook":"prepared")}`+(over?" (over your forecast)":"");
    btn.onclick=()=>toggle(t.idx,k,t.cantrip);take.append(btn);
  });
  i.grants.forEach(g=>{const b=el("span","tk gr",g.src+" ");b.append(icoEl("spark"));
    attachTip(b,tipBlock("Always prepared","Free from "+g.src+" — it doesn’t count against your prepared list."));take.append(b);});
  d.append(take);return d;
}
// the one display capitaliser (H6): first letter up, the rest untouched — never applied to a
// stored value, only to what is about to be shown. Hoisted, so it serves the whole file.
function cap1(s){s=s==null?"":String(s);return s?s[0].toUpperCase()+s.slice(1):s;}
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
// One class, one row: multiclassing stacks LEVELS in a class you already have, it never
// gives you a second track of it. Identity is the lowercased NAME — the same id
// `collapseEditions` deduplicates classes by (D19) — so 2014 Bard and 2024 Bard are one
// class even with reprints shown. The name is read off the key, not `CLS_BY`, so a row
// whose book has gone away still occupies its class.
const clsIdOf=k=>String(k||"").split("|")[0].toLowerCase();
// `except` is a class key whose rows don't count — the row being edited must keep its own
function takenClasses(except){
  const t=new Set();
  state.classes.forEach(r=>{if(r.clsKey!==except)t.add(clsIdOf(r.clsKey));});
  return t;}
// `keep` is a class key that must stay selectable even if its book is off — otherwise the
// select silently falls back to its first option and rewrites the row (T2)
function classOptions(keep){
  const taken=takenClasses(keep);
  return DATA.classes.filter(c=>(visible(c)&&!taken.has(c.name.toLowerCase()))||key(c.name,c.source)===keep)
    .sort((a,b)=>a.name.localeCompare(b.name)||a.source.localeCompare(b.source))
    .map(c=>({v:key(c.name,c.source),t:c.name+(c.source!==CORE?` (${c.source})`:"")+(c.caster?"":" ·")}));}
function renderClassRows(){
  CASTMODS=activeCastMods();          // a class row names what it changed about your casting
  const wrap=$("#classRows");wrap.innerHTML="";
  state.classes.forEach((row,idx)=>{const c=CLS_BY[row.clsKey]||{name:"?"};
    const div=el("div","classrow");
    // class name is a select — change it to swap class (subclass resets, level stays)
    const cl=el("div");cl.append(el("label","fld","Class"));
    const cs=el("select");classOptions(row.clsKey).forEach(o=>cs.append(new Option(o.t,o.v)));cs.value=row.clsKey;
    if(c.source&&!visible(c))cs.classList.add("gapped");
    cs.onchange=()=>{if(cs.value===row.clsKey)return;row.clsKey=cs.value;row.subKey=null;delete state.chosen[row.id];dropRowSwaps(row.id);save();renderClassRows();render();};
    cl.append(cs);div.append(cl);
    const subLvl=c.subclassLevel||3, locked=row.level<subLvl;
    const needsSub=!locked && !row.subKey && (SUBS_OF[key(c.name,c.source)]||[]).some(visible);
    const sc=el("div");const sl=el("label","fld");
    sl.append(el("span","fldt","Subclass"));      // its own span so it can ellipsize
    if(locked)sl.append(lockChip(subLvl,"The subclass"));
    sc.append(sl);
    const ss=el("select",needsSub?"alert":"");ss.dataset.sub=String(row.id);
    // the timeline's "Subclass — not chosen" affordance focuses THIS select (never a
    // second chooser of its own), so the row has to be findable from outside
    ss.append(new Option(locked?"— locked —":"— none —",""));
    (SUBS_OF[key(c.name,c.source)]||[]).filter(x=>visible(x)||key(x.name,x.source)===row.subKey)
      .sort((a,b)=>a.shortName.localeCompare(b.shortName))
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
    const rm=xBtn("rm",()=>{delete state.chosen[row.id];dropRowSwaps(row.id);state.classes.splice(idx,1);renderClassRows();render();});
    rm.title="Remove class";div.append(rm);
    if(needsSub)div.append(el("div","subalert","subclass — pick one"));
    const cm=castModLine(row.id); if(cm)div.append(cm);
    wrap.append(div);
  });
  // what is addable is a function of the rows: adding, removing and swapping a class all
  // reach here, and none of those handlers calls refreshAll
  refreshAddClass();
}
function refreshAddClass(){const s=$("#addClass");s.innerHTML="";
  const opts=classOptions();
  s.append(new Option(opts.length?"+ add a class…":"every class is already in this build",""));
  opts.forEach(o=>s.append(new Option(o.t,o.v)));s.value="";
  s.disabled=!opts.length;}
function refreshSpecies(){const r=state.speciesKey?RACE_BY[state.speciesKey]:null;
  // a species whose book is off is KEPT and flagged (T2) — only a species that no longer
  // exists at all is dropped, and that is `pruneState`'s job, not this one
  if(state.speciesKey&&!r)state.speciesKey="";
  const lbl=$("#speciesBtnLbl");
  if(lbl){lbl.textContent=r?(r.name+(r.source!==CORE?` (${r.source})`:"")):"— none —";
    const btn=$("#speciesBtn");if(btn)btn.classList.toggle("gapped",!!(r&&!visible(r)));
    if(r&&!visible(r))lbl.textContent=r.name+" · "+r.source+" is off";}
  if(!ENT)return; if($("#entityModal")&&!$("#entityModal").classList.contains("hidden")&&ENT.kind==="species")renderEntityList();}
// ── feat categories and the slots they fill (D84) ─────────────────────────
// A feat's CATEGORY is a book's own label; the SLOT is what it can be spent from. Only
// 5etools' own codes are known — anything else is a category a book invented (UA's
// "Wild Talent", a brew's own) and folding it into "general" is what misfiled Wild
// Talents into the ASI picker. Unknown categories are origin-slot, which is where the
// books that invent them put them, and **origin is a SUBSET of general**: everything you
// may take at level 1 from a background is also legal where a class grants you a feat.
const FEAT_CAT_NAME={O:"Origin",G:"General",D:"Dragonmark",DG:"Dark Gift",EB:"Epic Boon",
  FS:"Fighting Style","FS:P":"Fighting Style (Paladin)","FS:R":"Fighting Style (Ranger)",
  "FS:B":"Fighting Style (Bard)","FS:M":"Fighting Style (Monk)"};
const GENERAL_CATS=new Set(["G",""]);
const isFeatFS=f=>(f.category||"").startsWith("FS");
const isEpicBoon=f=>f.category==="EB";   // gated: only via the level-19 Epic Boon feature
const featSlot=f=>isEpicBoon(f)?"epic":isFeatFS(f)?"fs"
  :GENERAL_CATS.has(f.category||"")?"general":"origin";
const isOriginFeat=f=>featSlot(f)==="origin";
const featCatId=f=>String((f&&f.category)||"G");
// `catName` comes from the digest (a brew's `_meta.featCategories`); an import made before
// D84 has none, so the known table and then the raw code stand in
const featCatLabel=f=>(f&&f.catName)||FEAT_CAT_NAME[featCatId(f)]||featCatId(f);
// which slots a picker opened for `category` may draw on — origin ⊆ general
const SLOTS_FOR={origin:["origin"],epic:["epic"],general:["general","origin"]};
// the category toggles a picker offers: every category present in those slots, with the
// picker's own kind first so the row reads as "this slot, plus what may substitute for it"
function featCatsFor(slots){
  const seen=new Map();
  (DATA.feats||[]).forEach(f=>{ if(slots.indexOf(featSlot(f))<0)return;
    const id=featCatId(f); if(!seen.has(id))seen.set(id,featCatLabel(f));});
  const rank=id=>id==="G"||id==="EB"?0:id==="O"?1:2;
  return [...seen.entries()].sort((a,b)=>rank(a[0])-rank(b[0])||a[1].localeCompare(b[1]));
}
// the slot a feat was actually SPENT from. Attribution follows the slot, not the category:
// with origin ⊆ general, an origin feat taken at an ASI must not read `origin 2/1`.
const featSlotOf=fk=>{const f=FEAT_BY[baseKey(fk)];if(!f)return null;
  const rec=(state.featSlots||{})[fk];
  // only trust a recorded slot the feat could actually occupy
  return (rec&&SLOTS_FOR[rec]&&SLOTS_FOR[rec].indexOf(featSlot(f))>=0)?rec:featSlot(f);};
function setFeatSlot(fk,slot){ if(!state.featSlots)state.featSlots={};
  if(slot)state.featSlots[fk]=slot; else delete state.featSlots[fk];}
// remove ONE copy — the last taken — of a repeatable entry, by its own identity (D135).
// The earlier copies keep their keys, so their choices and their slot stay theirs.
function dropCopy(arr,k){ for(let i=arr.length-1;i>=0;i--)if(baseKey(arr[i])===k){
    const gone=arr[i]; arr.splice(i,1); return gone;}
  return null;}
function dropFeatCopy(k){ for(let i=state.feats.length-1;i>=0;i--)if(baseKey(state.feats[i])===k){
    const fk=state.feats[i]; state.feats.splice(i,1); setFeatSlot(fk,null); return fk;}
  return null;}
// ── prerequisites (D31) ────────────────────────────────────────────────────
// 5etools stores `prerequisite` as a list of ALTERNATIVES, so one satisfied block is
// enough. We can check level, other feats, optional features, species, spellcasting and
// pact; ability scores, proficiencies and backgrounds we don't model, so a block carrying
// one of those can only ever be "maybe" — never a hard no. That asymmetry is deliberate:
// the app should never hide something the player is actually allowed to take.
const lc=x=>String(x||"").toLowerCase();
const classLevelOf=name=>state.classes.reduce((a,r)=>{const c=CLS_BY[r.clsKey];
  return a+(c&&lc(c.name)===lc(name)?effLevel(r):0);},0);
const hasCaster=()=>state.classes.some(r=>{const c=CLS_BY[r.clsKey];return c&&c.caster;});
const pickedFeatNames=()=>featsAt().map(k=>FEAT_BY[baseKey(k)]).filter(Boolean).map(f=>lc(f.name));
const pickedOptNames=()=>optFeatsAt().map(k=>OPT_BY[baseKey(k)]).filter(Boolean).map(o=>lc(o.name));
const pickedSpellNames=()=>{const out=new Set();
  state.classes.forEach(r=>{const c=sliceChosen(r);[...(c.cantrips||[]),...(c.spells||[])].forEach(k=>{
    const sp=SPELL_BY[k];if(sp)out.add(lc(sp.name));});});
  Object.values(state.choices).forEach(v=>(Array.isArray(v)?v:[]).forEach(k=>{
    const sp=SPELL_BY[k];if(sp)out.add(lc(sp.name));}));
  return out;};
// One alternative broken into its parts, each with its own verdict: "ok" met, "no" not
// met, "?" not checkable. Level, feats, optional features, species, spellcasting and pact
// are all verifiable, so they get a real pass/fail; `checks` (ability scores,
// proficiencies, backgrounds, campaigns) can only ever be "?" — never a hard no (D31).
function prereqParts(b,ent){
  const out=[];
  if(b.level!=null){const lv=b.cls?classLevelOf(b.cls):charLevel();
    out.push({t:(b.cls?b.cls+" ":"")+"level "+b.level,s:lv>=b.level?"ok":"no"});}
  // `pick` marks a part that names something concrete you could go and take — the picker
  // turns those into a one-click fix (D41)
  if(b.feats&&b.feats.length){const have=pickedFeatNames();
    out.push({t:b.feats.join(" or "),s:b.feats.some(n=>have.includes(lc(n)))?"ok":"no",
      pick:{kind:"feat",names:b.feats}});}
  if(b.optfeats&&b.optfeats.length){const have=pickedOptNames();
    out.push({t:b.optfeats.join(" or "),s:b.optfeats.some(n=>have.includes(lc(n)))?"ok":"no",
      pick:{kind:"opt",names:b.optfeats}});}
  if(b.pact){const n="Pact of the "+b.pact;
    out.push({t:n,s:pickedOptNames().includes(lc(n))?"ok":"no",pick:{kind:"opt",names:[n]}});}
  if(b.races&&b.races.length){const r=RACE_BY[state.speciesKey];
    out.push({t:b.races.join(" or "),s:r&&b.races.some(n=>lc(r.name).includes(lc(n)))?"ok":"no",
      pick:{kind:"species",names:b.races}});}
  if(b.spellcasting)out.push({t:"spellcasting",s:hasCaster()?"ok":"no"});
  if(b.spells&&b.spells.length){
    // a named spell we know can be checked against the build; a prose description can't —
    // UNLESS it came with its own filter (D135: "a Warlock Cantrip That Deals Damage" is a
    // `choose` string in the data, and the build can answer it exactly)
    const have=pickedSpellNames();
    const filts=b.spellFilters||[];
    const byFilter=new Set(filts.map(x=>lc(x.text)));
    const named=b.spells.filter(n=>!byFilter.has(lc(n)));
    const known=named.filter(n=>SPELL_BY_NAME[lc(n)]);
    const filtOk=filts.some(x=>filterSpells(x.filter).some(sp=>have.has(lc(sp.name))));
    const anyOk=filtOk||known.some(n=>have.has(lc(n)));
    out.push({t:b.spells.join(" or "),
      s:anyOk?"ok":(known.length<named.length?"?":"no")});}
  // "no other Dragonmark feat", "No other Wild Talent" (D84). The extractors used to file
  // this under `checks`, where D31 can only ever say "maybe" — but the build's own feats
  // answer it exactly. Self-exclusion doesn't count: holding it is not holding ANOTHER.
  (b.exclusiveCat||[]).forEach(catId=>{
    const label=(DATA.feats||[]).reduce((a,f)=>a||(featCatId(f)===catId?featCatLabel(f):null),null)
      ||FEAT_CAT_NAME[catId]||catId;
    const selfKey=ent?key(ent.name,ent.source):null;
    const clash=state.feats.filter(fk=>!(selfKey&&sameEnt(fk,selfKey))&&FEAT_BY[baseKey(fk)]
        &&featCatId(FEAT_BY[baseKey(fk)])===catId)
      .map(fk=>FEAT_BY[baseKey(fk)].name);
    out.push({t:"no other "+label+" feat",s:clash.length?"no":"ok",
      why:clash.length?("you already have "+clash.join(", ")):""});});
  (b.checks||[]).forEach(t=>out.push({t,s:"?"}));
  // a `soft` block whose unmodelled part produced no display text (e.g. featCategory)
  if(!(b.checks||[]).length&&!(b.exclusiveCat||[]).length&&b.soft)out.push({t:"other requirements",s:"?"});
  return out;
}
function prereqBlockState(b,ent){const ps=prereqParts(b,ent);
  if(ps.some(p=>p.s==="no"))return "no";
  return ps.some(p=>p.s==="?")?"maybe":"ok";}
// "ok" | "maybe" | "no", the full text, and the per-part verdicts of the best alternative
const _PRANK={ok:2,maybe:1,no:0};
function prereqState(ent){
  const bs=(ent&&ent.prereqs)||[];
  if(!bs.length)return {state:"ok",why:"",parts:[]};
  let best=bs[0],bestS="no",bestR=-1;
  for(const b of bs){const r=prereqBlockState(b,ent);
    if(_PRANK[r]>bestR){best=b;bestS=r;bestR=_PRANK[r];}
    if(r==="ok")break;}
  return {state:bestS,why:bs.map(b=>b.text).join(" or "),
          parts:bestS==="ok"?[]:prereqParts(best,ent)};
}
const charLevel=()=>PREVIEW.level!=null?PREVIEW.level
  :state.classes.reduce((a,r)=>a+(r.level||0),0);
function refreshAddFeat(){
  // D114: the row appears when a feat slot you actually HOLD arrived at character level 19+ —
  // being level 19 is not enough on its own (a Fighter 10 / Wizard 9 gains no slot at 19 or 20)
  const epic=$("#epicRow");if(epic)epic.classList.toggle("hidden",!featBudget().epic);
}
// a slot's count, in line with its field. FOUR states, and none of them is an error:
// `need` = still owed, `done` = filled, `over` = more taken than the level grants, and
// `none` = your level grants no such slot at all yet (a level-3 character owes zero
// general feats). `none` is dimmed and unavailable, never accented — a cap of 0 used to
// fall through to `need`, painting an urgent 0/0 for a slot that isn't due yet and
// promising "0 of 0 left to choose".
function slotCount(node,have,cap,note){
  if(!node)return;
  const st=have>cap?"over":!cap?"none":have>=cap?"done":"need";
  node.className="cnt "+st;
  node.textContent=`${have}/${cap}`;
  const TIP={
    over:["More than your level grants",`You have taken ${have} where your level grants ${cap}. Nothing is removed — check with your DM.`],
    none:["None at this level","Your level grants none of these yet. You can still take one — it will read as more than your level grants."],
    done:["Slots filled",`All ${cap} taken.`],
    need:["Still to choose",`${cap-have} of ${cap} left to choose.`]};
  attachTip(node,tipBlock(TIP[st][0],TIP[st][1]+(note?" "+note:"")));}
// feat budget: general feats from ASI levels (+Fighter/Rogue extras), 1 origin feat + 1 for Humans.
// NOTE: data only carries spell-granting feats (extract.py filters the rest) — full feat lists need the mirror.
const ASI_EXTRA={Fighter:[6,14],Rogue:[10]};
const ASI_LEVELS=[4,8,12,16];
// D114: a feat slot is gained at a CLASS level but arrives at a CHARACTER level, and an Epic
// Boon is a feat you may take with any slot once you are character level 19+ — never a bonus
// pick of its own. Walking the level plan is what tells the two apart: `charLevel()>=19` alone
// gave a boon to a build with no feat slot anywhere near 19, and capped at one a build whose
// ASIs land on both 19 and 20. Returns the character level each slot arrives at.
// `full` ignores the preview and walks the whole plan — the acquisition mapping (E2)
// needs every slot the build will ever have, not just those visible at the view level
function featSlotLevels(full){
  const plan=classLevelPlan();
  const lim=(full||PREVIEW.level==null)?plan.length:Math.min(PREVIEW.level,plan.length);
  const byRow=new Map(state.classes.map(r=>[r.id,r]));
  const at=new Map(); const out=[];
  for(let i=0;i<lim;i++){
    const row=byRow.get(plan[i]); if(!row)continue;
    const c=CLS_BY[row.clsKey]; if(!c)continue;
    const cl=(at.get(row.id)||0)+1; at.set(row.id,cl);
    // class level 19 is the Epic Boon feature — still a feat slot, and it may take any feat
    // ("an Epic Boon feat or another feat of your choice for which you qualify")
    if(ASI_LEVELS.includes(cl)||(ASI_EXTRA[c.name]||[]).includes(cl)||cl===19)out.push(i+1);
  }
  return out;
}
function featBudget(){
  const slots=featSlotLevels();
  // …plus anything a FEATURE hands you (D135). An epic-boon slot from a feature is still a
  // feat slot, so it counts in `general` too — `epic` is a sub-limit, never a pool beside it.
  const gs=grantedFeatSlots();
  const general=slots.length+gs.general+gs.epic;        // every feat slot your build grants
  const epic=slots.filter(l=>l>=19).length+gs.epic;     // …of those, the ones a boon may use
  const race=RACE_BY[state.speciesKey];const isHuman=/human/i.test((race&&race.name)||"");
  const origin=originSlots();
  // attribution follows the slot the feat was SPENT from (D84), not its category: origin
  // is a subset of general, so an origin feat taken at an ASI is a general feat spent.
  const held=featsAt();                                // sliced (E2): spent means spent by L
  const inSlot=want=>held.filter(fk=>featSlotOf(fk)===want).length;
  const originPicked=inSlot("origin"), epicPicked=inSlot("epic"), generalPicked=inSlot("general");
  // a boon SPENDS a feat slot, so the general row counts it too; `epic` is a sub-limit on how
  // many of those slots may be boons, not a pool beside them
  return {general,origin,epic,originPicked,generalPicked,epicPicked,isHuman,granted:gs,
          slotsUsed:generalPicked+epicPicked};
}
// a granted slot has to SAY where it came from, or the origin row silently reads 2/2 on a
// build whose background gave one (D135)
function grantedNote(gs,slot){
  const mine=(gs.from||[]).filter(x=>x.slot===slot);
  return mine.length?mine.map(x=>(x.n>1?x.n+" from ":"1 from ")+x.name).join(", ")+".":null;}
function renderFeatBudget(){const b=featBudget();
  slotCount($("#originCnt"),b.originPicked,b.origin,grantedNote(b.granted,"origin"));
  slotCount($("#generalCnt"),b.slotsUsed,b.general,
    b.epic?"Every feat your classes grant, boons included.":null);
  slotCount($("#epicCnt"),b.epicPicked,b.epic,
    `${b.epic===1?"One feat slot arrives":`${b.epic} feat slots arrive`} at character level 19 or later, `
    +`so a boon is taken WITH one of your feat slots, not on top of them.`);}
// ── optional features: invocations, metamagic, pact boons… (D28) ───────────
// Slots come from each class/subclass's optionalfeatureProgression, so a "slot" is
// {name, types, have} and nothing about a specific feature type is hardcoded here.
function optSlots(){
  const out=[];
  const add=(src,lv)=>{
      if(!src||!src.optFeatures)return;
      src.optFeatures.forEach(p=>{
        const cap=p.counts[Math.max(0,lv-1)]||0; if(!cap)return;
        const types=new Set(p.types);
        const picked=optFeatsAt().filter(k=>{const o=OPT_BY[baseKey(k)];return o&&o.types.some(t=>types.has(t));});
        out.push({name:p.name,types:p.types,cap,picked,giver:src.name,giverSrc:src.source});
      });};
  state.classes.forEach(row=>{const el0=effLevel(row); if(!el0)return;   // not yet taken in a preview
    const lv=Math.max(1,Math.min(20,el0));
    add(CLS_BY[row.clsKey],lv); add(subOfRow(row),lv);});
  // feats can grant them too (Eldritch Adept, Metamagic Adept, Martial Adept…)
  featsAt().forEach(fk=>add(FEAT_BY[baseKey(fk)],Math.max(1,charLevel())));
  // one class taken twice can't stack the same feature line twice
  // the same feature line from two sources merges into one slot with the caps summed
  const merged=new Map();
  out.forEach(sl=>{const k=sl.name+"|"+sl.types.join(",");const m=merged.get(k);
    if(!m)merged.set(k,sl);
    else if(m.giver===sl.giver&&m.giverSrc===sl.giverSrc)m.cap=Math.max(m.cap,sl.cap);
    else{m.cap+=sl.cap;m.giver+=" + "+sl.giver;}});
  return [...merged.values()];
}
function renderOptFeats(){
  const box=$("#optFeatBlock");if(!box)return;
  const slots=optSlots();
  box.classList.toggle("hidden",!slots.length);
  box.innerHTML="";if(!slots.length)return;
  slots.forEach(sl=>{
    box.append(el("label","fld",sl.name));
    const row=el("div","fldrow");
    const btn=el("button","picksel ph");const bl=el("span","lbl-ico");
    bl.append(icoEl("plus"),document.createTextNode(`${sl.name.replace(/s$/,"").toLowerCase()}…`));btn.append(bl);
    btn.append(el("span","pk-caret","⌄"));
    btn.onclick=()=>openEntityPicker("opt",sl);
    row.append(btn);
    const cnt=el("span");row.append(cnt);slotCount(cnt,sl.picked.length,sl.cap);
    box.append(row);
    const chips=el("div","chips");
    const seenOpt=new Map();
    sl.picked.forEach(k=>{const o=OPT_BY[baseKey(k)];if(!o)return;
      const pr=prereqState(o);
      // a repeatable invocation taken twice is TWO chips — each is its own take with its own
      // designation — so the copies past the first carry their ordinal (D135)
      const ord=(seenOpt.get(baseKey(k))||0)+1; seenOpt.set(baseKey(k),ord);
      const c=el("span","chip"+(grantsAny(o.grants)?" hasspell":"")+(pr.state==="no"?" unmet":""));
      if(pr.state==="no"){const w=icoEl("warn","warn");
        attachTip(w,tipBlock("Prerequisite not met",`${o.name} needs ${pr.why}. Kept in the build — nothing is removed.`));c.append(w);}
      c.append(el("span",null,o.name));
      if(ord>1)c.append(el("span","chipn","#"+ord));
      const b=xBtn(null,()=>{state.optFeats=state.optFeats.filter(x=>x!==k);save();refreshAll();render();});
      c.append(b);chips.append(c);});
    box.append(chips);
  });
}
const FCHIP_ORD=new Map();
function renderFeatChips(){const box=$("#featChips");box.innerHTML="";FCHIP_ORD.clear();
  state.feats.forEach((fk,i)=>{const f=FEAT_BY[baseKey(fk)];if(!f)return;
  const pr=prereqState(f);
  const ord=(FCHIP_ORD.get(baseKey(fk))||0)+1; FCHIP_ORD.set(baseKey(fk),ord);
  const sl=featSlotOf(fk);
  const c=el("span","chip"+(sl==="epic"?" epic":sl==="origin"?" origin":"")+(grantsAny(f.grants)?" hasspell":"")
    +(pr.state==="no"?" unmet":""));
  if(pr.state==="no"){const w=icoEl("warn","warn");attachTip(w,tipBlock("Prerequisite not met",`${f.name} needs ${pr.why}. Kept in the build — nothing is removed.`));c.append(w);}
  if(grantsAny(f.grants))c.append(icoEl("spark","fmark"));
  c.append(el("span",null,f.name));
  if(ord>1)c.append(el("span","chipn","#"+ord));   // a repeatable feat taken again (D135)
  const b=xBtn(null,()=>{state.feats.splice(i,1);setFeatSlot(fk,null);renderFeatChips();render();});
  c.append(b);box.append(c);});
  renderFeatBudget();}

// ── "?" notes (D88) ────────────────────────────────────────────────────────
// A block of reference prose sitting permanently above the controls costs the same space
// on the hundredth visit as the first. It moves behind a `?` in line with its header —
// a DISCLOSURE, not a hover popover, because these notes carry links and code the reader
// has to be able to reach. Markup lives in index.html so the prose stays greppable.
function wireHelpNotes(){
  document.querySelectorAll("[data-help]").forEach(btn=>{
    if(btn.dataset.wired)return; btn.dataset.wired="1";
    btn.append(icoEl("help"));
    const body=document.getElementById(btn.dataset.help);
    const set=on=>{ if(body)body.classList.toggle("hidden",!on);
      btn.classList.toggle("on",on); btn.setAttribute("aria-expanded",String(on));};
    set(false);
    btn.onclick=e=>{e.stopPropagation();set(body&&body.classList.contains("hidden"));};
  });
}

// ── sources modal ────────────────────────────────────────────────────────
// D113: edition-first display groups. The digest still stores 5etools' taxonomy (core /
// supplement / supplement-alt / setting / setting-alt / brew / other); the remap below is
// display-only, so already-imported digests regroup without a re-import.
const GROUP_ORDER=["core24","core14","supplement","setting","brew","other"];
const GROUP_NAME={core24:"2024 core",core14:"2014 core",supplement:"Supplements",
  setting:"Settings & adventures",brew:"Homebrew & UA",other:"Other"};
function srcGroupOf(code,s){
  const g=(s&&s.group)||"other";
  if(g==="core")return CORE_2024.includes(code)?"core24":"core14";
  if(g==="supplement-alt")return "supplement";
  if(g==="setting-alt")return "setting";
  // UA/prerelease books belong on the shelf whose NAME already promises them (D113);
  // before this remap the raw key rendered as an unlabeled "PRERELEASE" shelf after Other
  if(g==="prerelease")return "brew";
  return GROUP_NAME[g]?g:g;   // an unknown group keeps its own shelf rather than vanishing
}
// ── shared grouped source checklist (D27) ──────────────────────────────────
// One component for every place books are chosen: the global ⚙ Sources modal and each
// picker's local override. `sel` is a Set the caller owns; `onChange` runs after any
// mutation. `codes` limits the list to the sources actually present in that picker.
// `opts` lets a caller that is NOT the Sources list reuse this exact control (D83 — one book
// checklist everywhere) with its own group labels, group order and row order: the folder scan
// groups by creator or by what a book contains, and sorts by name rather than by spell count.
// Every existing caller passes no opts and behaves exactly as before.
function renderSourceChecklist(wrap,sel,onChange,codes,countOf,srcMap,opts){
  opts=opts||{};
  const gname=opts.groupName||GROUP_NAME;
  wrap.innerHTML="";
  const all=Object.entries(srcMap||DATA.sources).filter(([code])=>!codes||codes.has(code));
  // opts.rawGroups keeps a caller's own group strings; everyone else gets the D113 remap
  const gof=opts.rawGroups?((c,s)=>s.group||"other"):srcGroupOf;
  const byGroup={};all.forEach(([code,s])=>{const g=gof(code,s);(byGroup[g]=byGroup[g]||[]).push([code,s]);});
  const groups=Object.keys(byGroup).sort(opts.groupSort||((a,b)=>{const ia=GROUP_ORDER.indexOf(a),ib=GROUP_ORDER.indexOf(b);return (ia<0?9:ia)-(ib<0?9:ib);}));
  groups.forEach(g=>{const gd=el("div","srcgroup");
    const gcodes=byGroup[g].map(x=>x[0]);
    const allOn=gcodes.every(c=>sel.has(c)), someOn=gcodes.some(c=>sel.has(c));
    const h4=el("h4",null,gname[g]||g);
    const allLab=el("label","all");const allCb=el("input");allCb.type="checkbox";allCb.checked=allOn;allCb.indeterminate=someOn&&!allOn;
    allCb.onchange=()=>{gcodes.forEach(c=>allCb.checked?sel.add(c):sel.delete(c));onChange();};
    allLab.append(el("span",null,allOn?"all":someOn?"some":"none"));allLab.append(allCb);h4.append(allLab);gd.append(h4);
    const list=el("div","srclist");
    byGroup[g].sort(opts.sortRows||((a,b)=>(((b[1].counts||{}).spells)||0)-(((a[1].counts||{}).spells)||0))).forEach(([code,s])=>{
      const lab=el("label",opts.rowClass?opts.rowClass(code):null);const cb=el("input");cb.type="checkbox";cb.checked=sel.has(code);
      cb.onchange=()=>{cb.checked?sel.add(code):sel.delete(code);onChange();};
      lab.append(cb);lab.append(el("span",null,s.name));
      lab.append(el("small",null,countOf?countOf(code):`${s.counts.spells}sp`));list.append(lab);});
    gd.append(list);wrap.append(gd);});
  return all.length;
}
// the quick actions behind a checklist's Actions menu ("2024 core only" died with D113 —
// the 2024 core group header's own all-tick covers it)
function srcQuick(sel,onChange,codes){
  const has=c=>!codes||codes.has(c);
  const pool=Object.keys(DATA.sources).filter(has);
  return {all:()=>{pool.forEach(c=>sel.add(c));onChange();},
          none:()=>{pool.forEach(c=>sel.delete(c));onChange();},
          core:()=>{pool.forEach(c=>sel.delete(c));CORE_2024.filter(has).forEach(c=>sel.add(c));onChange();}};
}
// D113: the Library's Sources tab — the old Sources modal with a search field
let SRC_Q="";
function renderLibSources(){
  const total=Object.keys(DATA.sources).length;
  const q=SRC_Q.trim().toLowerCase();
  const codes=q?new Set(Object.keys(DATA.sources).filter(c=>c.toLowerCase().includes(q)
    ||String((DATA.sources[c]||{}).name||"").toLowerCase().includes(q))):null;
  const list=$("#srcList");
  const n=renderSourceChecklist(list,SRC,afterSourceChange,codes);
  if(!n){list.innerHTML="";list.append(el("div","empty","No book matches that."));}
  $("#srcSub").textContent=`${SRC.size} of ${total} enabled`;
}
function afterSourceChange(){
  // T2: turning a book OFF no longer strips what it gave you. Picks are kept and flagged by
  // `renderGapBar`, exactly as they are for a build authored elsewhere — one rule, not two.
  // Only refs to content that has ceased to exist are dropped, and that is `pruneState`.
  // a newly enabled book must not stay invisible behind a stale filter override
  if(state.filters.books)SRC.forEach(c=>state.filters.books.add(c));
  saveSources(); save();               // sources are global; the build records what it saw
  refreshAll();renderLibSources();render();
}
function refreshAll(){CASTMODS=activeCastMods();refreshSpecies();refreshAddFeat();renderClassRows();renderFeatChips();renderOptFeats();renderFormPins();renderCustomSources();}

// ── events ───────────────────────────────────────────────────────────────
$("#addClass").onchange=e=>{const clsKey=e.target.value;
  // the option list already drops what you have; this is the second lock, in case the
  // select is a render behind
  if(clsKey&&!takenClasses().has(clsIdOf(clsKey))){
    state.classes.push({clsKey,subKey:null,level:1,id:state.nextRowId++});renderClassRows();render();}
  e.target.value="";};
$("#speciesBtn").onclick=()=>openEntityPicker("species");
$("#originBtn").onclick=()=>openEntityPicker("feat","origin");
$("#generalBtn").onclick=()=>openEntityPicker("feat","general");
$("#epicBtn").onclick=()=>openEntityPicker("feat","epic");
$("#entClose").onclick=()=>$("#entityModal").classList.add("hidden");
$("#entityModal").onclick=e=>{if(e.target.id==="entityModal")$("#entityModal").classList.add("hidden");};
$("#entSearch").oninput=e=>{if(ENT){ENT.q=e.target.value;renderEntityList();}};
$("#fBooksBtn").onclick=()=>{const p=$("#fBooksPanel");const nowHidden=p.classList.toggle("hidden");
  $("#fBooksBtn").setAttribute("aria-expanded",String(!nowHidden));};
{const F=()=>state.filters.books,q=()=>srcQuick(F(),renderSpells);
 $("#fSrcAll").onclick=()=>q().all(); $("#fSrcNone").onclick=()=>q().none(); $("#fSrc2024").onclick=()=>q().core();
 $("#fSrcReset").onclick=()=>{state.filters.books=new Set(SRC);renderSpells();};}
$("#entMenuBtn").onclick=e=>{e.stopPropagation();toggleMenu("#entMenuPop");};
$("#entHideNo").onchange=e=>{if(ENT){ENT.hideNo=e.target.checked;renderEntityList();}};
{const q=()=>srcQuick(ENT.books,renderEntityList,entBookCodes());
 $("#entSrcAll").onclick=()=>q().all(); $("#entSrcNone").onclick=()=>q().none(); $("#entSrc2024").onclick=()=>q().core();
 $("#entSrcReset").onclick=()=>{ENT.books=new Set(SRC);renderEntityList();};}
$("#entGrants").onchange=e=>{if(ENT){ENT.grantsOnly=e.target.checked;renderEntityList();}};
$("#fq").oninput=e=>{state.filters.q=e.target.value;render();};
$("#filterBtn").onclick=()=>{$("#filterPanel").classList.toggle("hidden");$("#filterBtn").classList.toggle("on");};
$("#clearFilters").onclick=()=>{const q=state.filters.q;state.filters=FILTER_DEFAULT();state.filters.q=q;$("#fReprint").value="dedupe";refreshAll();render();};
$("#fSchool").onchange=e=>{state.filters.school=e.target.value;render();};
$("#fClass").onchange=e=>{state.filters.cls=e.target.value;render();};
$("#fSave").onchange=e=>{state.filters.save=e.target.value;render();};
$("#fDmg").onchange=e=>{state.filters.dmg=e.target.value;render();};
$("#fReprint").onchange=e=>{state.filters.reprint=e.target.value;refreshAll();render();};
$("#fChosen").onclick=()=>{state.filters.chosen=!state.filters.chosen;render();};
$("#pickOnly").onclick=()=>{PICK.onlyPicked=!PICK.onlyPicked;renderPickList();};
$("#prepOnly").onclick=()=>{PREP.onlyPicked=!PREP.onlyPicked;renderPrepList();};
$("#tabBuild").onclick=()=>switchTab("build");
$("#tabTable").onclick=()=>switchTab("table");
$("#tGroup").onchange=e=>{tableOpts.group=e.target.value;saveTableOpts();renderTable();};
$("#tColReset").onclick=e=>{e.preventDefault();tableOpts.order=[...COL_ORDER_DEFAULT];tableOpts.hidden=new Set();
  saveTableOpts();renderColMenu();renderTable();};
$("#pickClear").onclick=()=>{ if(!PICK)return;
  if(PICK.classIdx!=null){const ch=state.chosen[PICK.classIdx];if(ch)ch.spells=(ch.spells||[]).filter(k=>{const s=SPELL_BY[k];return !(s&&s.level>=1&&s.level<=PICK.maxLevel);});}
  else state.choices[PICK.id]=[];
  save();renderPickList();render();};
$("#prepDailyBtn").onclick=openPrepDaily;
$("#prepClose").onclick=()=>$("#prepModal").classList.add("hidden");
$("#prepDone").onclick=()=>$("#prepModal").classList.add("hidden");
$("#prepModal").onclick=e=>{if(e.target.id==="prepModal")$("#prepModal").classList.add("hidden");};
// the forms chooser (D131(g)). The backdrop closer is a strict identity test on the
// BACKDROP, not `closest()`: marking a form re-renders the list under the click, and a
// detached target can never equal the backdrop (the D122 shape from GOTCHAS).
$("#famClose").onclick=closeFam;
$("#famModal").onclick=e=>{if(e.target===$("#famModal"))closeFam();};
$("#prepPrev").onclick=()=>{if(PREP&&PREP.step>0){PREP.step--;PREP.search="";renderPrepStep();}};
$("#prepNext").onclick=()=>{if(PREP&&PREP.step<PREP.steps.length-1){PREP.step++;PREP.search="";renderPrepStep();}};
$("#prepSearch").oninput=e=>{if(PREP){PREP.search=e.target.value;renderPrepList();}};
$("#prepLevelBtn").onclick=e=>{e.stopPropagation();toggleMenu("#prepLevelPop");};
$("#pickClose").onclick=()=>$("#pickModal").classList.add("hidden");
$("#pickModal").onclick=e=>{if(e.target.id==="pickModal")$("#pickModal").classList.add("hidden");};
$("#pickSearch").oninput=renderPickList;
// the guide's pick modal (G3 · D126(f)). The backdrop closer is a STRICT equality on the
// backdrop node itself — a click that re-renders detaches its own target, and a
// `closest()` test would then read an inside click as outside (the E5 trap).
$("#gpClose").onclick=closeGpick;
// D131(b): picks still commit as they are taken, so this button never "saves" anything —
// what it does is CLOSE and then move the walk on, which is the press it exists to save
// you. It stays put when the step still has another section asking (`gpickMore`), because
// stepping over an open question is exactly what the label would be lying about; a trade
// closes on the pick it records, so there its only job is the way out.
$("#gpDone").onclick=()=>{
  const g=GPICK; if(!g)return;
  const go=g.mode!=="trade"&&!gpickMore();
  closeGpick();
  if(go)guideAdvance();
};
$("#gpickModal").onclick=e=>{if(e.target===$("#gpickModal"))closeGpick();};
$("#gpSearch").oninput=renderGpick;
$("#guideCtaBtn").onclick=()=>openGuide(false);
$("#customBtn").onclick=()=>{closeMenu();openCustom();};
$("#hbBtn").onclick=openHb;
$("#hbClose").onclick=()=>$("#hbModal").classList.add("hidden");
$("#hbModal").onclick=e=>{if(e.target.id==="hbModal")$("#hbModal").classList.add("hidden");};
$("#hbSearch").oninput=renderHbList;
$("#hbNew").onclick=()=>{$("#hbModal").classList.add("hidden");openCustom();};
$("#customClose").onclick=()=>$("#customModal").classList.add("hidden");
$("#customModal").onclick=e=>{if(e.target.id==="customModal")$("#customModal").classList.add("hidden");};
$("#customPrev").onclick=()=>{if(CSTEP>0){CSTEP--;renderCustomStep();}};
$("#customNext").onclick=()=>{if(CSTEP<CSTEP_NAMES.length-1){CSTEP++;renderCustomStep();}};
$("#customDone").onclick=compileCustom;
$("#libBtn").onclick=()=>openImport(false);
// the ⋯ menu runs it inline and reports into the notice bar; the Library's own button reports
// in place (D129) — one pipeline, two surfaces, told apart by this flag alone
$("#refreshBtn").onclick=()=>refreshImported(false);
$("#importRefresh").onclick=()=>refreshImported(true);
// the one "back to bundled" path (closes ARCHIVE's standing ⚑, and it is now also the
// manual recovery for a digest the boot guard set aside). armed, never a native confirm (D53)
armConfirm($("#importWipe"),null,async()=>{
  await clearImport();
  IMPORT_STAGE=[]; cancelBuild();
  planFromStage(null,null); renderImportPlan(); renderImportStage(); renderLibFoot();
  const rep=$("#importReport");
  if(rep)rep.textContent="Imported data removed — the app is back on its built-in books. Builds and homebrew are untouched; picks from removed books are kept and flagged.";
});
$("#libTabSrc").onclick=()=>setLibTab("src");
$("#libTabMan").onclick=()=>setLibTab("man");
$("#libSrcSearch").oninput=e=>{SRC_Q=e.target.value;renderLibSources();};
$("#srcActBtn").onclick=e=>{e.stopPropagation();toggleMenu("#srcActPop");};
{const q=()=>srcQuick(SRC,afterSourceChange);
 $("#srcAll").onclick=()=>{closeMenu();q().all();};
 $("#srcNone").onclick=()=>{closeMenu();q().none();};}
$("#pasteTog").onclick=()=>{const b=$("#pasteBox"),open=b.classList.toggle("hidden");
  $("#pasteTog").setAttribute("aria-expanded",String(!open));
  if(!open)$("#importPaste").focus();};
$("#importClose").onclick=()=>$("#importModal").classList.add("hidden");
$("#importModal").onclick=e=>{if(e.target.id==="importModal")$("#importModal").classList.add("hidden");};
$("#importPick").onclick=e=>{e.stopPropagation();$("#importFiles").click();};
$("#importFiles").onchange=e=>{stageFiles(e.target.files);e.target.value="";};
// D112: ONE drop zone. A .zip or JSON files stage; a dragged FOLDER scans — in Chrome it
// yields the same rememberable handle the picker gives (so Refresh works from a drop), and
// elsewhere webkitGetAsEntry walks it for this session.
{const drop=$("#importDrop");
 drop.ondragover=e=>{e.preventDefault();drop.classList.add("drag");};
 drop.ondragleave=()=>drop.classList.remove("drag");
 drop.ondrop=e=>{e.preventDefault();drop.classList.remove("drag");
   const items=[...((e.dataTransfer&&e.dataTransfer.items)||[])].filter(i=>i.kind==="file");
   if(items.length&&items[0].getAsFileSystemHandle){
     // handles must be requested synchronously, before the DataTransfer goes stale
     const hps=items.map(i=>i.getAsFileSystemHandle());
     (async()=>{
       const hs=(await Promise.all(hps)).filter(Boolean);
       const files=await Promise.all(hs.filter(h=>h.kind==="file").map(h=>h.getFile()));
       if(files.length)stageFiles(files);
       for(const d of hs.filter(h=>h.kind==="directory"))await scanHandle(d,true);
     })().catch(err=>{$("#importReport").textContent="Couldn’t read that drop: "+(err.message||err);});
     return;}
   if(items.length&&items[0].webkitGetAsEntry){
     const entries=items.map(i=>i.webkitGetAsEntry()).filter(Boolean);
     const dirs=entries.filter(en=>en&&en.isDirectory);
     if(dirs.length){
       (async()=>{
         const out=[];
         for(const d of dirs)await entryWalk(d,"",out);
         await scanEntries(out,dirs[0].name||"folder");
       })().catch(err=>{$("#importReport").textContent="Couldn’t read that folder: "+(err.message||err);});
       const loose=[...e.dataTransfer.files].filter((_,i)=>entries[i]&&!entries[i].isDirectory);
       if(loose.length)stageFiles(loose);
       return;}}
   stageFiles(e.dataTransfer.files);};}
// the webkitGetAsEntry walker: same {path,getFile} shape as folderEntries, same skips
async function entryWalk(entry,base,out){
  if(!entry||entry.name==="_img"||entry.name.charAt(0)===".")return;
  if(entry.isFile){
    if(/\.json$/i.test(entry.name))
      out.push({path:base+entry.name,getFile:()=>new Promise((res,rej)=>entry.file(res,rej))});
    return;}
  if(entry.isDirectory){
    const readAll=dir=>new Promise(res=>{const r=dir.createReader();const acc=[];
      const step=()=>r.readEntries(es=>{if(!es.length)return res(acc);acc.push(...es);step();});step();});
    const kids=await readAll(entry);
    for(const k of kids)await entryWalk(k,base+entry.name+"/",out);}
}
$("#importPasteAdd").onclick=()=>{const t=$("#importPaste").value.trim();if(!t)return;
  try{IMPORT_STAGE.push({name:"pasted "+(IMPORT_STAGE.length+1),json:JSON.parse(t)});$("#importPaste").value="";$("#importReport").textContent="";renderImportStage();scheduleBuild();}
  catch(e){$("#importReport").textContent="Pasted text isn’t valid JSON.";}};
$("#importClear").onclick=()=>{IMPORT_STAGE=[];cancelBuild();renderImportStage();
  planFromStage(null,null);renderImportPlan();$("#importReport").textContent="";};
$("#importApply").onclick=applyImport;

// ── folder scan wiring (D92) ───────────────────────────────────────────────────
// Two ways in. showDirectoryPicker gives a handle we can REMEMBER between sessions; where it
// doesn't exist (Safari, Firefox) a webkitdirectory input does the same scan for one session.
function folderButtons(){
  const remembered=!!FOLDER;
  const r=$("#folderRescan"), f=$("#folderForget");
  if(r)r.classList.toggle("hidden",!remembered);
  if(f)f.classList.toggle("hidden",!remembered);
  const p=$("#folderPick"); if(p)p.textContent=remembered?"choose another folder…":"choose folder…";
  const sub=$("#folderSub");
  if(sub)sub.textContent=remembered?(FOLDER.name||"remembered folder"):(FSA()?"":"one session at a time in this browser");
}
async function scanHandle(h,remember){
  if(remember)await folderRemember(h);
  FOLDER=h; folderButtons();
  $("#folderProgress").textContent="Reading the folder…";
  await scanEntries(await folderEntries(h),h.name||"folder");
}
$("#folderPick").onclick=async()=>{
  if(SCAN_BUSY||REFRESH_BUSY)return;   // a refresh owns the scan between its own busy windows
  if(!FSA()){$("#folderInput").click();return;}
  try{const h=await window.showDirectoryPicker({id:"spellbookLibrary",mode:"read"});
    await scanHandle(h,true);}
  catch(e){ if(e&&e.name==="AbortError")return;      // the user simply closed the picker
    $("#folderProgress").textContent="Couldn’t open that folder: "+(e.message||e);}
};
$("#folderRescan").onclick=async()=>{
  if(SCAN_BUSY||REFRESH_BUSY)return;
  const prog=$("#folderProgress");
  // A remembered handle is not a granted one — permission dies with the session, and asking
  // has to happen inside this click. If it's gone (moved, renamed, denied), say so and offer
  // the picker rather than failing silently.
  if(!FOLDER||!await folderUsable(FOLDER,true)){
    prog.innerHTML="That folder isn’t reachable any more — choose it again.";
    await folderForget(); folderButtons(); return;}
  try{await scanHandle(FOLDER,false);}
  catch(e){prog.textContent="Couldn’t read that folder: "+(e.message||e);
    await folderForget(); folderButtons();}
};
$("#folderForget").onclick=async()=>{if(REFRESH_BUSY)return; await folderForget();SCAN=null;
  $("#folderProgress").textContent="";renderImportPlan();folderButtons();};
$("#folderInput").onchange=e=>{const l=e.target.files;
  if(l&&l.length)scanEntries(inputEntries(l),l[0].webkitRelativePath?l[0].webkitRelativePath.split("/")[0]:"folder");
  e.target.value="";};
$("#srcAskKeep").onclick=()=>{$("#srcAskModal").classList.add("hidden");const f=SRCASK&&SRCASK.after;SRCASK=null;if(f)f(false);};
$("#srcAskSwitch").onclick=()=>{$("#srcAskModal").classList.add("hidden");const f=SRCASK&&SRCASK.after;SRCASK=null;if(f)f(true);};
$("#buildsBtn").onclick=openBuilds;
$("#buildClose").onclick=()=>$("#buildModal").classList.add("hidden");
$("#buildModal").onclick=e=>{if(e.target.id==="buildModal")$("#buildModal").classList.add("hidden");};
$("#buildSearch").oninput=renderBuildList;
$("#buildNew").onclick=()=>openNewBuild();
function showBuildImport(on){
  $("#bImportBox").classList.toggle("hidden",!on);
  if(on){$("#bImportPaste").value="";$("#bImportErr").textContent="";$("#bImportPaste").focus();}
}
function doBuildImport(txt){
  const err=$("#bImportErr");
  try{
    const b=importBuildText(txt);
    const g=importGaps(b.state,b.meta.sources);
    showBuildImport(false); renderBuildList();
    // never silently activate: the file may expect books this browser hasn't got
    const note=g.missing.size?`Added “${b.meta.character} · ${b.meta.name}”. It expects ${[...g.missing].join(", ")}, which isn't loaded here — import that data to see those picks resolve.`
      :g.off.size?`Added “${b.meta.character} · ${b.meta.name}”. It expects ${[...g.off].map(bookName).join(", ")}, currently turned off.`
      :`Added “${b.meta.character} · ${b.meta.name}”.`;
    $("#buildSub").textContent=note;
  }catch(e){ err.textContent=e.message||"Could not read that file."; }
}
$("#buildImport").onclick=()=>showBuildImport($("#bImportBox").classList.contains("hidden"));
$("#bImportCancel").onclick=()=>showBuildImport(false);
$("#bImportGo").onclick=()=>{const t=$("#bImportPaste").value.trim();
  if(!t){$("#bImportErr").textContent="Paste a build, or drop a file here.";return;} doBuildImport(t);};
$("#bImportPick").onclick=()=>$("#bImportFile").click();
$("#bImportFile").onchange=e=>{const f=e.target.files&&e.target.files[0]; if(!f)return;
  const rd=new FileReader(); rd.onload=()=>doBuildImport(String(rd.result));
  rd.onerror=()=>{$("#bImportErr").textContent="Could not read that file.";};
  rd.readAsText(f); e.target.value="";};
["dragenter","dragover"].forEach(ev=>$("#bImportBox").addEventListener(ev,e=>{
  e.preventDefault();$("#bImportBox").classList.add("over");}));
["dragleave","drop"].forEach(ev=>$("#bImportBox").addEventListener(ev,e=>{
  e.preventDefault();$("#bImportBox").classList.remove("over");}));
$("#bImportBox").addEventListener("drop",e=>{const f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];
  if(!f)return; const rd=new FileReader(); rd.onload=()=>doBuildImport(String(rd.result)); rd.readAsText(f);});
$("#nbClose").onclick=()=>$("#newBuildModal").classList.add("hidden");
// the timeline modal (E5, a modal since D122): explicit close, backdrop click, Escape
// (with the other dismissals). The strict `target===backdrop` check also keeps the
// detached-target trap harmless: a click whose handler re-rendered its own target
// bubbles up with a detached target, which can never equal the backdrop element.
$("#tlClose").onclick=()=>closeTimeline();
$("#tlModal").onclick=e=>{ if(e.target===$("#tlModal"))closeTimeline(); };
$("#csrcAdd").onclick=()=>openCsrc(null);
$("#csrcClose").onclick=()=>$("#csrcModal").classList.add("hidden");
$("#csrcSave").onclick=saveCsrc;
$("#csrcSearch").oninput=()=>renderCsrcHits();
["csrcPool","csrcRecharge","csrcDC","csrcAtk"].forEach(id=>{const n=$("#"+id);
  if(n)n.onkeydown=e=>{if(e.key==="Enter")$("#csrcSave").click();};});
// D94: the rule line and the summary must never lag the fields they describe — a folded
// section that reports stale state is worse than one left open.
$("#csrcRuleEdit").onclick=()=>{CSRC_OPEN.rules=!CSRC_OPEN.rules;csrcSyncRule();};
$("#csrcNumsBtn").onclick=()=>{CSRC_OPEN.nums=!CSRC_OPEN.nums;csrcSyncNums();};
["csrcPool","csrcRecharge"].forEach(id=>{const n=$("#"+id);
  if(n)n.addEventListener("input",()=>{
    CSRC.pool=$("#csrcPool").value?Math.max(0,+$("#csrcPool").value||0):null;
    CSRC.recharge=$("#csrcRecharge").value.trim();
    // clearing the pool size removes the pool, which changes what every row is paying with
    renderCsrcRows(); csrcSyncRule();csrcSyncSummary();});});
["csrcDC","csrcAtk"].forEach(id=>{const n=$("#"+id);
  if(n)n.addEventListener("input",()=>{csrcSyncNums();csrcSyncSummary();});});
$("#csrcAbility").addEventListener("change",()=>{csrcSyncNums();csrcSyncSummary();});
$("#csrcName").addEventListener("input",csrcSyncSummary);
// D96: a choice row starts unconstrained and OPEN — an empty filter matches every spell, so
// leaving it collapsed would hide the one thing you have to fill in.
$("#csrcAddPick").onclick=()=>{
  const id="pk"+Date.now().toString(36)+Math.floor(performance.now()%1000);
  // default to a long rest: it is what almost every "choose a spell" item uses, and the row
  // opens expanded so it is seen and changeable rather than silently assumed
  CSRC.spells.push({id,pick:{take:1,level:"",class:"",school:"",swap:"lr"},
                    pay:csrcHasPool(CSRC)?"pool":"per",cost:1,count:1,unit:"lr"});
  CSRC_ROW_OPEN.add(id);
  renderCsrcRows();csrcSyncRule();csrcSyncSummary();};
armConfirm($("#csrcDelete"),"Delete source",()=>{
  state.customSources=(state.customSources||[]).filter(x=>x.id!==CSRC.id);
  $("#csrcModal").classList.add("hidden");
  save(); renderCustomSources(); render();});
$("#nbCreate").onclick=()=>{
  $("#newBuildModal").classList.add("hidden");
  newBuild($("#nbChar").value.trim(),$("#nbVer").value.trim());
  $("#buildModal").classList.add("hidden");     // straight into the fresh build
};
// the three guided entries (F3 · D118(i)): beside start-empty · timeline footer · ⋯ alias
$("#nbGuided").onclick=()=>{
  $("#newBuildModal").classList.add("hidden");
  newBuild($("#nbChar").value.trim(),$("#nbVer").value.trim());
  $("#buildModal").classList.add("hidden");
  openGuide(false);                             // fresh build: forward, no ceremony
};
$("#guideBtn").onclick=()=>{closeMenu();guideEntry();};
$("#tlGuide").onclick=()=>{closeTimeline();guideEntry();};
$("#nbVer").onkeydown=e=>{if(e.key==="Enter")$("#nbCreate").click();};
$("#nbChar").onkeydown=e=>{if(e.key==="Enter")$("#nbVer").focus();};
armConfirm($("#resetBtn"),null,()=>{
  state.classes=[];state.feats=[];state.optFeats=[];state.speciesKey="";state.chosen={};state.choices={};state.nextRowId=1;
  state.filters=FILTER_DEFAULT();
  save();                              // auto-save: the cleared build IS the saved build (D34)
  $("#fq").value="";$("#fReprint").value="dedupe";
  $("#filterPanel").classList.add("hidden");$("#filterBtn").classList.remove("on");
  refreshAll();render();});
$("#themeBtn").onclick=()=>{const r=document.documentElement,cur=r.getAttribute("data-theme");r.setAttribute("data-theme",cur==="dark"?"light":cur==="light"?"dark":(matchMedia("(prefers-color-scheme:dark)").matches?"light":"dark"));closeMenu();};
// overflow settings menu
function closeMenu(except){document.querySelectorAll(".menupop").forEach(p=>{if(p!==except)p.classList.add("hidden");});
  closeBswMenus();}   // the row menus are fixed-position, so they outlive their popover unless told
// `closeMenu` hides EVERY popover, this one included, so reopening is a SET, not a toggle —
// toggling after it flipped an open menu straight back open, which is why the button that
// opened a menu could never close it.
function toggleMenu(pop){const el2=$(pop);const open=!el2.classList.contains("hidden");
  closeMenu(); if(!open)el2.classList.remove("hidden");}
$("#menuBtn").onclick=e=>{e.stopPropagation();toggleMenu("#menuPop");};
// a fixed-position row menu does not travel with the list under it — close it instead
$("#bswPop").addEventListener("scroll",closeBswMenus,true);   // capture: the scroller is .bswlist
$("#bswPop").addEventListener("click",e=>{if(!e.target.closest(".bswmenu")&&!e.target.closest(".bswdots"))closeBswMenus();});
$("#bswBtn").onclick=e=>{e.stopPropagation();renderBswPop();toggleMenu("#bswPop");
  $("#bswBtn").setAttribute("aria-expanded",String(!$("#bswPop").classList.contains("hidden")));};
$("#tMenuBtn").onclick=e=>{e.stopPropagation();toggleMenu("#tMenuPop");};
$("#pickLevelBtn").onclick=e=>{e.stopPropagation();toggleMenu("#pickLevelPop");};
// A handler that re-renders DETACHES the click's target, so a closer asking
// `e.target.closest(".menu")` afterwards finds nothing and an INSIDE click reads as outside
// (E5) — every filter control in a picker's ⋯ popover rebuilds its own row, which is how
// toggling a category shut the popover. `composedPath()` is fixed when the event is
// DISPATCHED, so it still names the ancestors the click travelled through, detached or not;
// a real outside click still closes, which `document.contains` alone would have given up.
document.addEventListener("click",e=>{
  const path=e.composedPath?e.composedPath():[e.target];
  if(!path.some(n=>n.classList&&n.classList.contains("menu")))closeMenu();});

// ── print / save as PDF ────────────────────────────────────────────────────
// Paper always gets the SPELL TABLE, whichever tab is on screen — that is the sheet you
// bring to a session, and the Build tab is a set of controls, not a document. What the
// build was is carried by the summary line instead, which is all a printed sheet needs
// to say whose it is. Everything below the summary is built fresh on `beforeprint` and
// torn down on `afterprint`, so the screen never carries 30 spell cards around.
const LS_PRINT="spellForge.print.v1";
const PRINT={theme:"light",orient:"portrait",tracker:true,cards:true,eligible:false,brk:false,notes:false};
let PRINT_MODE=false;          // renderTable reads this: it prints more than it shows
let TITLE_BEFORE=null;
function loadPrintOpts(){ try{const t=JSON.parse(localStorage.getItem(LS_PRINT)||"null");
  if(t&&typeof t==="object")Object.keys(PRINT).forEach(k=>{if(t[k]!=null)PRINT[k]=t[k];});}catch(e){}
  applyPrintOpts(); }
function savePrintOpts(){ try{localStorage.setItem(LS_PRINT,JSON.stringify(PRINT));}catch(e){storageNotice(e);}
  applyPrintOpts(); }
// The selector-scoped options ride on the document; `@page` is not selector-scoped at
// all, so page size gets its own style element. Both are inert until something prints.
function applyPrintOpts(){
  document.documentElement.dataset.print=PRINT.theme;
  document.body.classList.toggle("pr-break",!!PRINT.brk);
  let st=$("#prPageRule");
  if(!st){st=el("style");st.id="prPageRule";document.head.append(st);}
  st.textContent=`@media print{@page{size:${PRINT.orient==="landscape"?"landscape":"portrait"};margin:14mm}}`;
}

// The name the PDF is saved under: browsers take it from document.title at print time.
function printDocName(){
  const m=(activeBuild()||{}).meta||{};
  const n=[m.character,m.name].filter(x=>String(x||"").trim()).join(" — ");
  return (n||"My Spellbook").replace(/[\\/:*?"<>|]+/g," ").trim();
}
function printHeadLine(){
  const box=$("#printHead"); if(!box)return;
  box.innerHTML="";
  const meta=(activeBuild()||{}).meta||{};
  const ttl=el("div","phttl",meta.character||"My Spellbook");
  if(meta.name)ttl.append(el("span","phver",meta.name));
  box.append(ttl);
  const bits=[];
  const lv=charLevel(); if(lv)bits.push("Level "+lv);
  state.classes.forEach(r=>{const c=CLS_BY[r.clsKey];if(!c)return;
    const sub=subOfRow(r);
    bits.push(c.name+(sub?" ("+(sub.shortName||sub.name)+")":"")+" "+effLevel(r));});
  const race=RACE_BY[state.speciesKey]; if(race)bits.push(race.name);
  box.append(el("div","phsub",bits.join(" · ")));
  // printing at a scrubbed level is first-class now (E6 · D115(i)): the header names
  // the level (charLevel() above) and per-class levels are the slice's — the old
  // "not a saved version" disclaimer is gone because the sheet no longer lies without it
}

// ── the tracker: everything expendable, as boxes to tick ───────────────────
// The app already knows every one of these; on screen they are counts, and a count is
// the one thing you cannot mark off mid-session.
const USE_UNIT={LR:"per long rest",SR:"per short rest",dawn:"per dawn"};
const BOX_CAP=6;    // past this, boxes stop being tickable and become a written total
// `rechargeShort` has already normalised every cadence string both extractors emit, so
// the tracker reads ITS output rather than inventing a second parser. `chg` means paid
// from a shared pool, which gets a row of its own — boxes there would double-count.
function useBoxes(short){
  if(!short||short==="at will"||short==="—"||short==="chg")return null;
  let m=short.match(/^(\d+)\/(LR|SR|dawn)$/); if(m)return {n:+m[1],note:USE_UNIT[m[2]]};
  m=short.match(/^(\d+) ever$/); if(m)return {n:+m[1],note:"total — never regained"};
  return null;
}
function boxes(n){const bx=el("span","trbox");for(let i=0;i<n;i++)bx.append(el("span","tb"));return bx;}
// A 20-charge staff is 20 boxes nobody can tick apart at 3mm. Past the cap it becomes a
// line to write the remaining count on, which is how a character sheet has always done it.
function useRow(label,n,note){
  const row=el("div","trrow");
  row.append(el("span","trlbl",label));
  if(n<=BOX_CAP)row.append(boxes(n));
  else{const w=el("span","trfillw");w.append(el("span","trfill"));w.append(el("span","trof","/"+n));row.append(w);}
  if(note)row.append(el("span","trnote",note));
  return row;
}
function renderPrintTracker(){
  const box=$("#printTracker"); if(!box)return;
  box.innerHTML="";
  if(!PRINT.tracker)return;
  const sec=t=>{const h=el("div","trsec");h.append(el("span","trh",t));box.append(h);};

  // ── per class: what you prepare, and the two numbers only you can fill in ──
  const casters=(R.casters||[]).filter(r=>r.caster);
  if(casters.length){
    sec("Casting");
    const t=el("table","trtbl trcast");
    const hr=el("tr");["Class","Prepared","Cantrips","Spell attack","Save DC"]
      .forEach(h=>hr.append(el("th",null,h)));
    const hd=el("thead");hd.append(hr);t.append(hd);
    const tb=el("tbody");
    casters.forEach(r=>{
      const c=R.caps&&R.caps[r.idx];
      const tr=el("tr");
      tr.append(el("td","trcls",classLabel(r)+" "+effLevel(r.row)));
      tr.append(el("td",null,c?String(c.total):"—"));
      tr.append(el("td",null,r.cantrips?String(r.cantrips):"—"));
      // the app models neither ability scores nor proficiency, so these are honestly blank
      // rather than wrong — a ruled field is the truthful version of "we can't know"
      const blank=()=>{const td=el("td","trblank");td.append(el("span","trfill"));return td;};
      tr.append(blank(),blank());
      tb.append(tr);});
    t.append(tb);box.append(t);
  }

  // ── slots: one tidy row of columns, Pact included ─────────────────────────
  const cols=[];
  if(R.mcSlots)R.mcSlots.forEach((n,i)=>{if(n>0)cols.push([ROMAN[i+1],n,false]);});
  if(R.pactRec){const p=R.pactRec.pact;cols.push(["Pact "+ROMAN[p.lvl],p.num,true]);}
  if(cols.length){
    sec("Spell slots");
    // a table, not a flex row: nine levels plus Pact have to sit in ONE row of columns at
    // any width, and only a table guarantees that without shrinking the boxes
    const t=el("table","trtbl trslots");
    const hr=el("tr"),br=el("tr");
    cols.forEach(([lab,n,pact])=>{
      hr.append(el("th",pact?"pact":null,lab));
      const td=el("td",pact?"pact":null);td.append(boxes(n));br.append(td);});
    const hd=el("thead");hd.append(hr);t.append(hd);
    const tb=el("tbody");tb.append(br);t.append(tb);
    box.append(t);
    if(R.pactRec)box.append(el("div","trnote","Pact slots return on a short rest."));
  }

  // ── limited uses: item charges first (a shared pool is ONE row, not one per
  //    spell), then every innate cast with a countable cadence ───────────────
  const uses=[];
  (state.customSources||[]).forEach(cs=>{
    if(!csrcHasPool(cs)||!(+cs.pool>0))return;
    const note=["charges",cs.recharge?"regains "+cs.recharge:""].filter(Boolean).join(" · ");
    uses.push([cs.name,+cs.pool,note]);});
  (R.freeCasts||[]).forEach(fc=>{
    if(fc.choice)return;
    const u=useBoxes(rechargeShort(fc.recharge,fc.level===0)); if(!u)return;
    uses.push([fc.name+" · "+fc.src,u.n,u.note]);});
  if(uses.length){ sec("Limited uses");
    uses.forEach(([lab,n,note])=>box.append(useRow(lab,n,note))); }
  if(!box.children.length)box.append(el("div","trnone","No slots or limited uses at this level."));
}

// ── the legend ─────────────────────────────────────────────────────────────
// Only for symbols the sheet actually uses: a legend explaining a mark that never
// appears is the same noise as a column of dashes.
function renderPrintLegend(){
  const box=$("#printLegend"); if(!box)return;
  box.innerHTML="";
  const rows=PRINT_ROWS, has=f=>rows.some(f);
  const items=[];
  const ico=(n,cls)=>{const w=el("span","lgi"+(cls?" "+cls:""));w.innerHTML=ICONS[n];return w;};
  if(has(r=>r.type==="free"))items.push([ico("check","always"),"Always prepared — a free grant that costs you nothing"]);
  if(has(r=>r.type==="cast"))items.push([ico("spark","innate"),"Innate — cast without preparing it"]);
  if(has(r=>r.inBook&&!r.prepared))items.push([ico("book","inbook"),"In your spellbook, not prepared today"]);
  if(has(r=>!r.blank&&r.type!=="free"&&r.type!=="cast"&&!(r.inBook&&!r.prepared)))
    items.push([ico("dot","on"),"Prepared or known"]);
  if(has(r=>r.blank))items.push([el("span","prepbox"),"You could prepare this — tick what you take"]);
  if(has(r=>r.sp.ritual))items.push([el("span","lgt","R"),"Ritual — castable without a slot at 10 extra minutes"]);
  if(has(r=>r.sp.conc))items.push([ico("check"),"In the Conc column: concentration"]);
  if(has(r=>r.sp.atk))items.push([el("span","savechip atk","Atk"),"A spell attack roll"]);
  if(has(r=>(r.sp.save||[]).length))items.push([el("span","savechip dex","Dex"),"The save your target rolls"]);
  items.push([el("span","lgc","V S M"),"Components. A struck letter is one your build removes; gold M costs money, red M is consumed."]);
  if(has(r=>r.dc||r.atk))items.push([el("span","ownnum","DC 16"),"The source's own numbers, not your spellcasting"]);
  if($("#spellTable").querySelector("sup.ast"))items.push([el("span","lgt","*"),"Also castable with your own spell slots"]);
  if(!items.length)return;
  box.append(el("div","lgh","What the marks mean"));
  const grid=el("div","lggrid");
  items.forEach(([mark,text])=>{const r=el("div","lgrow");r.append(mark);r.append(el("span","lgx",text));grid.append(r);});
  box.append(grid);
}

// ── the spell-card appendix ────────────────────────────────────────────────
// A sheet you never have to look anything up from. The table's spell names link here
// and each card links back — same-document links, which is what a PDF turns into
// clickable internal navigation.
const cardId=sp=>"sp-"+key(sp.name,sp.source).toLowerCase().replace(/[^a-z0-9]+/g,"-");
let PRINT_ROWS=[];      // what renderTable last put on the sheet — the cards follow it
function printCardHTML(sp){
  const eff=compEffect(sp,modsForSpell(sp,null));
  const grid=[["Casting time",esc(cap1(sp.time))],["Range",esc(sp.range)],["Components",compModalHTML(sp,eff)],
              ["Duration",(sp.conc?"Concentration, up to ":"")+esc(sp.durTxt)]];
  const bk=sp.source+(sp.page?" p."+sp.page:"");
  // only the forms this character marked (or the single form a summon has) — Find Familiar
  // carries 65, and an appendix that prints all of them is not an appendix
  const cre=printCreatures(sp);
  const all=buildCreatures(sp);
  const sb=cre.map(b=>`<div class="pcsb"><div class="pcsbn">${esc(b.name)}</div>${sbBodyHTML(b)}</div>`).join("")
    ||(all.length>1?`<p class="pcnote">${all.length} forms — mark the ones you use in the spell's details to print them.</p>`:"");
  return `<div class="pcard" id="${esc(cardId(sp))}">`
    +`<h4><a href="#row-${esc(cardId(sp))}">${esc(sp.name)}</a><span class="pcbk">${esc(bk)}</span></h4>`
    +`<div class="pcsub">${metaLine(sp)}</div>`
    +`<div class="pcgrid">${grid.map(([k,v])=>`<b>${k}</b><span>${v}</span>`).join("")}</div>`
    +`<div class="pctext">`+(sp.desc||[]).map(descP).join("")
    +((sp.higher||[]).length?`<div class="hl">${sp.higher.map(descP).join("")}</div>`:"")+`</div>`
    +grantNotes(sp).map(n=>`<div class="gnote"><b>${esc(n.src)}</b><p>${ccText(n.note)}</p></div>`).join("")
    +eff.why.map(m=>`<div class="gnote cmod"><b>${esc(m.giver+" · "+m.feature)}</b>`
      +(m.when?`<span class="cmwhen">${esc(m.when)}</span>`:"")
      +`<p>${ccText(m.note)}</p></div>`).join("")
    +sb+`</div>`;
}
function renderPrintCards(){
  const box=$("#printCards"); if(!box)return;
  box.innerHTML="";
  if(!PRINT.cards||!PRINT_ROWS.length)return;
  const seen=new Set(), list=[];
  PRINT_ROWS.forEach(r=>{const k=key(r.sp.name,r.sp.source); if(seen.has(k))return; seen.add(k); list.push(r.sp);});
  list.sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name));
  // grouped by level like the table above it, and broken by page on the same setting —
  // an appendix ordered differently from the sheet it belongs to is a second index
  let html=`<h3 class="pcsec">Spell details</h3>`, lastL=null, n=0;
  list.forEach(sp=>{
    if(sp.level!==lastL){
      if(lastL!==null)html+=`</div>`;
      lastL=sp.level;
      html+=`<h5 class="pclv${PRINT.brk&&n++>0?" pgbrk":""}">${sp.level===0?"Cantrips":ROMAN[sp.level]+" level"}</h5><div class="pcards">`;
    }
    html+=printCardHTML(sp);});
  if(lastL!==null)html+=`</div>`;
  box.innerHTML=html;
}
function renderPrintNotes(){
  const box=$("#printNotes"); if(!box)return;
  box.innerHTML="";
  if(!PRINT.notes)return;
  box.innerHTML=`<h3 class="pcsec">Notes</h3><div class="prlines">`
    +Array.from({length:22},()=>`<span></span>`).join("")+`</div>`;
}

// ── the print run ──────────────────────────────────────────────────────────
// beforeprint/afterprint carry it, so Cmd+P and the menu item take the same path and
// the saved settings apply either way.
function printBuild(){
  PRINT_MODE=true;
  TITLE_BEFORE=document.title; document.title=printDocName();
  printHeadLine(); renderTable();
  renderPrintTracker(); renderPrintLegend(); renderPrintCards(); renderPrintNotes();
}
function printDone(){
  PRINT_MODE=false;
  if(TITLE_BEFORE!=null){document.title=TITLE_BEFORE;TITLE_BEFORE=null;}
  ["#printTracker","#printLegend","#printCards","#printNotes"].forEach(id=>{const n=$(id);if(n)n.innerHTML="";});
  PRINT_ROWS=[]; renderTable();
}
addEventListener("beforeprint",printBuild);
addEventListener("afterprint",printDone);

// ── the settings modal ─────────────────────────────────────────────────────
const PR_FIELDS={prTracker:"tracker",prCards:"cards",prEligible:"eligible",prBreak:"brk",prNotes:"notes"};
function openPrintModal(){
  $("#prTheme").value=PRINT.theme; $("#prOrient").value=PRINT.orient;
  Object.entries(PR_FIELDS).forEach(([id,k])=>{$("#"+id).checked=!!PRINT[k];});
  printCountNote();
  $("#printModal").classList.remove("hidden");
}
// what the settings are about to cost, before you spend the paper finding out — counted
// through the same PRINT_MODE path that builds the sheet, so "all preparable" reports the
// number it actually adds rather than a vague promise
function printCountNote(){
  const n=$("#prCount"); if(!n)return;
  const was=PRINT_MODE; PRINT_MODE=true;
  const rows=tableRows(); PRINT_MODE=was;
  const cards=new Set(rows.map(r=>key(r.sp.name,r.sp.source))).size;
  const bits=[rows.length+" row"+(rows.length===1?"":"s")+" on the sheet"];
  if(PRINT.cards)bits.push(cards+" spell card"+(cards===1?"":"s"));
  if(PRINT.notes)bits.push("a notes page");
  n.textContent=bits.join(" · ")+".";
  // ticking a setting that changes nothing reads as a broken setting unless it says why
  if(PRINT.eligible&&!rows.some(r=>r.blank))
    n.textContent+=" Nothing to prepare — no class here prepares from a whole list.";
}
$("#printBtn").onclick=()=>{closeMenu();openPrintModal();};
$("#prClose").onclick=()=>$("#printModal").classList.add("hidden");
$("#printModal").onclick=e=>{if(e.target.id==="printModal")$("#printModal").classList.add("hidden");};
$("#prTheme").onchange=e=>{PRINT.theme=e.target.value;savePrintOpts();};
$("#prOrient").onchange=e=>{PRINT.orient=e.target.value;savePrintOpts();};
Object.entries(PR_FIELDS).forEach(([id,k])=>{
  $("#"+id).onchange=e=>{PRINT[k]=e.target.checked;savePrintOpts();printCountNote();};});
$("#prGo").onclick=()=>{$("#printModal").classList.add("hidden");
  // the dialog has to be gone before the page is snapshotted, and a modal that is still
  // fading would print over the sheet
  setTimeout(()=>print(),60);};

// ── offline: the published build installs as an app ────────────────────────
// A service worker needs real files at a real origin. dist/ is opened over file:// (no
// worker possible) and serve.py sends no-store on purpose, so registering in either
// would only cache the thing being edited. Only the Pages build ships sw.js, and only
// it sets __PUBLIC__. Registration failing is not an error worth surfacing: the app is
// fully usable online, it just will not have installed itself.
if(typeof window!=="undefined"&&window.__PUBLIC__&&"serviceWorker" in navigator
   &&(location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1"))
  addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));

// ── test helper: random sample build (local only) ──────────────────────────
function randomBuild(){
  const rnd=a=>a[Math.floor(Math.random()*a.length)];
  const casters=DATA.classes.filter(c=>visible(c)&&(c.caster||(SUBS_OF[key(c.name,c.source)]||[]).some(s=>visible(s)&&s.caster)));
  state.classes=[];state.feats=[];state.optFeats=[];state.speciesKey="";state.chosen={};state.choices={};state.nextRowId=1;
  const n=1+Math.floor(Math.random()*2);
  for(let i=0;i<n;i++){
    // one class, one row — a sample build must be one the builder itself could produce
    const left=casters.filter(c=>!takenClasses().has(c.name.toLowerCase()));
    if(!left.length)break;
    // the 20-level budget is shared across rows — a legal character never exceeds it
    const room=20-state.classes.reduce((s,r)=>s+(r.level||0),0);
    if(room<1)break;
    const c=rnd(left);const lvl=1+Math.floor(Math.random()*room);
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
// which build you are looking at. build.py injects `__VERSION__` from the VERSION file
// into every deliverable, so the footer of a page always names the code that made it —
// including on a printed sheet, which is where "is this current?" actually gets asked.
{const v=$("#appVer");
 if(v)v.textContent=window.__VERSION__?"v"+window.__VERSION__:"";}
if(typeof window!=="undefined"&&window.__PUBLIC__){const tb=$("#testBtn");if(tb)tb.remove();}
else $("#testBtn").onclick=randomBuild;

// drop build references to content the current data set doesn't contain
// (e.g. after switching baked↔imported, or a homebrew spell was deleted)
// Prune ONLY what has truly ceased to exist: the entity's whole BOOK is still loaded
// but the entity is gone from it (a re-import shipped a revised file). A ref whose book
// is absent from the loaded content — say, core data replaced by a lone homebrew import —
// is a GAP, not garbage: it keeps its pick and the gap machinery flags it (D42 extended
// by D56 — before this, importing a brew on its own silently stripped whole builds).
function pruneState(){
  const bookLoaded=k=>{const src=String(k).split("|").pop();
    return !!DATA.sources[src]||Object.keys(DATA.sources).some(c=>c.toUpperCase()===src.toUpperCase());};
  state.classes=(state.classes||[]).filter(r=>CLS_BY[r.clsKey]||!bookLoaded(r.clsKey));
  // deliberately the FLAT index (D127): this asks "does any record with this key still
  // exist", not "which one does this row mean" — subOfRow() here would drop a stored
  // subKey the moment its class went missing, and nothing prunes on absence (D42/D56).
  state.classes.forEach(r=>{if(r.subKey&&!SUB_BY[r.subKey]&&bookLoaded(r.subKey))r.subKey=null;});
  state.feats=(state.feats||[]).filter(fk=>FEAT_BY[baseKey(fk)]||!bookLoaded(baseKey(fk)));
  state.optFeats=(state.optFeats||[]).filter(ok=>OPT_BY[baseKey(ok)]||!bookLoaded(baseKey(ok)));
  if(state.speciesKey&&!RACE_BY[state.speciesKey]&&bookLoaded(state.speciesKey))state.speciesKey="";
}
// ── boot ─────────────────────────────────────────────────────────────────
// Reading the imported digest is ASYNC now (D93), so boot waits for it before deciding
// anything. It matters that nothing below runs early: `maybeOnboard()` pops the welcome
// importer when the app has no content, and firing that over a library still loading is the
// same failure the "empty import must not beat baked data" gotcha describes.
let BOOT_MODE="fresh";
(async()=>{
  try{ await importLoad(); }catch(_){}
  dropLegacyFolderDb();
  // a stored digest that assembleData chokes on must not brick every boot from here on —
  // set it aside, start on baked, and say so. Refresh imported data re-parses and heals it.
  try{ assembleData(); }               // now with whatever IndexedDB held
  catch(e){ IMPORT_CACHE=null; assembleData();
    appNotice("Imported data was unreadable, so the app started on its bundled data — your builds are untouched. Use ⋯ → Refresh imported data (or re-import) to restore the library. ("+((e&&e.message)||e)+")"); }
  loadSources();
  BOOT_MODE=loadBuilds();              // "loaded" | "migrated" | "fresh"
  applyState(activeBuild().state);
  // newly-available content sources default to on (homebrew, a fresh import)
  if(CUSTOM&&CUSTOM.spells&&CUSTOM.spells.length&&!SRC.has(HB_SRC)){SRC.add(HB_SRC);saveSources();}
  pruneState();
  $("#fReprint").value=state.filters.reprint;
  $("#fq").value=state.filters.q;
  loadTableOpts(); $("#tGroup").value=tableOpts.group; renderColMenu();
  loadPrintOpts();
  maybeOnboard();
  fillIcons(); wireHelpNotes();
  refreshAll();render();
  staleParserNotice();
})();
