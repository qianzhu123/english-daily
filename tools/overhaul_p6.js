// Phase 6: review page — regroup by article (words→phrases→fragments→grammar→full article with original marks)
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/review/index.html', 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.replace(oldStr, newStr);
  console.log('ok:', label);
}

// 6a. dayDB re-keyed by article publish date
rep(`function dayDB(){ // 词+语法按日期归并 {day:{words:[],grams:[]}}
  const db={};
  Object.keys(marks).forEach(k=>{const d=(marks[k]&&marks[k].day)||studyDay();
    (db[d]=db[d]||{words:[],grams:[]}).words.push(k)});
  const g=gramDB();
  Object.keys(g).forEach(gid=>{const d=(g[gid]&&g[gid].date)||studyDay();
    (db[d]=db[d]||{words:[],grams:[]}).grams.push(gid)});
  return db}`,
`function artDate(ai){const a=ART[ai];return a&&a.date?a.date:null}
function dayDB(){ // 按文章发布日期归并（用户 11-20：复习时间=文章发布日，不是操作当天）
  const db={};
  Object.keys(marks).forEach(k=>{const ai=wordHomeIdx(k);
    const d=artDate(ai)||ART[ai]&&ART[ai].date||null;
    const dd=d||(marks[k]&&marks[k].day)||studyDay();
    (db[dd]=db[dd]||{words:[],grams:[],frags:[],byArt:{}}).words.push(k);
    const key=ART[ai]?ai:'loose';
    (db[dd].byArt[key]=db[dd].byArt[key]||[]).push(k)});
  const g=gramDB();
  Object.keys(g).forEach(gid=>{const t=g[gid].title||'';
    const ai=ART.findIndex(a=>a.title===t);
    const dd=(ai>=0&&ART[ai].date)||g[gid].date||studyDay();
    (db[dd]=db[dd]||{words:[],grams:[],frags:[],byArt:{}}).grams.push(gid)});
  Object.keys(ukDB()).forEach(aiS=>{const ai=Number(aiS);if(!ART[ai])return;
    const dd=artDate(ai)||studyDay();
    ukDB()[aiS].forEach(x=>{(db[dd]=db[dd]||{words:[],grams:[],frags:[],byArt:{}}).frags.push({ai:ai,j:x.j,sent:x.sent})})});
  return db}`,
  'dayDB rekey');

// 6b. rewrite dayHtml: per-article grouping, order 单词→词组→片段→语法→完整文章（带原始标记）
const d0 = s.indexOf('function dayHtml(db)');
const d1 = s.indexOf('function wireDay()');
if (d0 > 0 && d1 > d0) {
  const newDayHtml = [
    'function dayHtml(db){ // 单日:按文章分组——单词→词组→句子片段→语法→完整文章（含原始标记）',
    '  const d=view.day;const e=db[d]||{words:[],grams:[],frags:[],byArt:{}};',
    '  const g=gramDB();',
    '  // 当日文章（按发布日期归属，用户 11-20）',
    '  const artIdxs=new Set();',
    '  const done=doneDB();',
    '  Object.keys(done).forEach(t=>{if(done[t]&&done[t].date===d){const i2=ART.findIndex(a=>a.title===t);if(i2>=0)artIdxs.add(i2)}});',
    '  e.grams.forEach(gid=>{const t=(g[gid].title||\'\');const i2=ART.findIndex(a=>a.title===t);if(i2>=0)artIdxs.add(i2)});',
    '  (e.frags||[]).forEach(x=>artIdxs.add(x.ai));',
    '  Object.keys(e.byArt||{}).forEach(k=>{if(k!==\'loose\')artIdxs.add(Number(k))});',
    '  const arts=[...artIdxs].map(i2=>Number(i2)).filter(i2=>ART[i2]).sort((a,b)=>(ART[a].date||\'\')<(ART[b].date||\'\')?-1:1);',
    '  let html=`<div class="dayhead"><a class="backcal" href="#" onclick="backCal();return false">← 日历</a><b>${d}</b><span class="tag">${e.words.length} 词 · ${(e.frags||[]).length} 片段 · ${e.grams.length} 语法</span></div>`;',
    '  // 词组与单词分列：词组=key 含空格（用户 11-20 展示顺序：第一篇单词→词组→句子→语法→全文，再下一篇）',
    '  if(arts.length===0&&(e.words.length)){',
    '    const loose=(e.byArt.loose||[]);',
    '    if(loose.length)html+=`<div class="dayh">其他 <span class="tag">${loose.length} 词</span></div><div class="wl">${loose.sort((a,b)=>((marks[a]&&marks[a].seq)||0)-((marks[b]&&marks[b].seq)||0)).map(k=>rowHtml(k)).join(\'\')}</div>`}',
    '  for(const ai of arts){',
    '    const a=ART[ai];',
    '    const ks=(e.byArt[ai]||[]).slice().sort((x,y)=>((marks[x]&&marks[x].seq)||0)-((marks[y]&&marks[y].seq)||0));',
    '    const words=ks.filter(k=>!k.includes(\' \'));',
    '    const phrases=ks.filter(k=>k.includes(\' \'));',
    '    const frags=(e.frags||[]).filter(x=>x.ai===ai);',
    '    const grams=e.grams.filter(gid=>g[gid].title===a.title);',
    '    html+=`<div class="dayh">${esc(a.title)} <span class="tag">${esc(a.date)} · ${esc(a.level||\'\')}</span></div>`;',
    '    if(words.length)html+=`<div class="wl">${words.map(k=>rowHtml(k)).join(\'\')}</div>`;',
    '    if(phrases.length)html+=`<div class="dayh" style="font-size:.85rem">词组 <span class="tag">${phrases.length}</span></div><div class="wl">${phrases.map(k=>rowHtml(k)).join(\'\')}</div>`;',
    '    if(frags.length){',
    '      html+=`<div class="dayh" style="font-size:.85rem">✏️ 重点片段 <span class="tag">${frags.length}</span></div>`+',
    '        frags.map((x,xi)=>{const gi=\'uktr-\'+x.ai+\'-\'+xi;',
    '          return `<div class="gcard"><span class="rm" data-ukai="${x.ai}" data-uksent="${esc(x.sent)}" style="float:right;cursor:pointer;color:var(--bad,#c0392b);font-size:1.05rem" title="删除该片段">×</span><b>${esc(x.sent)}</b><div class="src" id="${gi}"> —— 翻译中…</div></div>`}).join(\'\');',
    '      frags.forEach((x,xi)=>{const id=\'uktr-\'+x.ai+\'-\'+xi;',
    '        setTimeout(()=>{const sp=document.getElementById(id);if(!sp)return;',
    '          translateFrag(x.sent).then(tr=>{if(tr)sp.textContent=\'—— \'+tr;else sp.textContent=\'\'}).catch(()=>sp.textContent=\'\')},0)}',
    '    if(grams.length){',
    '      html+=`<div class="dayh" style="font-size:.85rem">⭐ 语法点 <span class="tag">${grams.length}</span></div>`+',
    '        grams.map(gid=>`<div class="gcard"><span class="rm" data-gid="${esc(gid)}" style="float:right;cursor:pointer;color:var(--bad)" title="取消收藏">×</span>${esc(g[gid].text||gid)}</div>`).join(\'\')}',
    '    // 完整文章：重现阅读页的原始标记（生词高亮 + 片段高亮）',
    '    const markWords=new Set(words.concat(phrases));',
    '    const fragByJ={};frags.forEach(x=>{(fragByJ[x.j]=fragByJ[x.j]||[]).push(x)});',
    '    html+=`<div class="dayh" style="font-size:.85rem">📄 完整文章 <span class="tag">含你的原始标记</span></div><div class="artfull">`;',
    '    html+=a.sentences.map((sent,j)=>{',
    '      let marked=sent.split(/\\s+/).map(tok=>{',
    '        const m2=tok.match(/^([^A-Za-z0-9À-ɏ]*)([A-Za-z0-9À-ɏ\'’-]+)([\\s\\S]*)$/);',
    '        if(!m2)return esc(tok);',
    '        const cw=m2[2].toLowerCase();',
    '        const cls=markWords.has(cw)?\' on\':\'\';',
    '        return esc(m2[1])+\'<w class="\'+cls.trim()+\'">\'+esc(m2[2])+\'</w>\'+esc(m2[3])}).join(\' \');',
    '      (fragByJ[j]||[]).forEach(x=>{',
    '        const toks=sent.split(/\\s+/);const joined=toks.join(\' \');',
    '        const start=joined.indexOf(x.sent);if(start<0)return;',
    '        const before=joined.slice(0,start);',
    '        const n0=before.trim()?before.trim().split(/\\s+/).length:0;',
    '        const n1=n0+x.sent.split(/\\s+/).length;',
    '        // 片段高亮：在 marked 字符串上按词序包 fragon（重新分词一遍）',
    '        let wi2=0;',
    '        marked=marked.replace(/<w class="( on)?">([\\s\\S]*?)<\\/w>/g,(mm,cls2,txt)=>{',
    '          const inFrag=wi2>=n0&&wi2<n1;wi2++;',
    '          return \'<w class="\'+(inFrag?\'fragon\':(cls2||\'\').trim())+\'">\'+txt+\'</w>\'})});',
    '      return \'<p style="margin:4px 0">\'+marked+\'</p>\'}).join(\'\');',
    '    html+=`</div>`;',
    '  }',
    '  if(!e.words.length&&!e.grams.length&&!(e.frags||[]).length)html+=\'<div class="empty">这一天没有学习记录。</div>\';',
    '  return html}'
  ].join('\n');
  s = s.slice(0, d0) + newDayHtml + s.slice(d1);
  console.log('ok: dayHtml rewritten');
} else fails.push('dayHtml bounds');

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
fs.writeFileSync(dir + '/review/index.html', s);
console.log('phase6 written');
