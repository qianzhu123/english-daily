// Phase 2: reading page logic overhaul (markDone, pubbar, phrase rework, full-trans sync marks, renderTask removal)
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/index.html', 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.split(oldStr).join(newStr);
  console.log('ok:', label);
}

// 2a. markDone: mark only; when ALL current-batch articles are marked → show global 更新文章 button in #pubbar; auto-sync silently
rep(`function markDone(title){const db=doneDB();
  db[title]={count:(db[title]&&db[title].count||0)+1,date:studyDay()};
  store.set('doneread',db);toastMsg('✓ 第 '+db[title].count+' 遍读完，收进往期（看往期可随时回看）');
  render()}`,
`function batchDoneState(){ // 当前批次（未归档）文章是否全部已标读完
  const act=A.filter(a=>!a.draft&&!a.archived);
  if(!act.length)return false;
  return act.every(a=>isDone(a.title))}
function renderPubbar(){ // 全部标记后出现全局「更新文章」；一键发布下一批（草稿→正式+旧批次归档）
  const bar=document.getElementById('pubbar');if(!bar)return;
  if(batchDoneState()&&!showOld){
    bar.innerHTML='<div style="text-align:center;margin:14px 0"><button onclick="publishNext()" id="pubBtn" style="padding:8px 22px;font-size:.95rem;background:var(--accent);color:#fff;border:none;border-radius:8px;cursor:pointer">🔄 更新文章（本批已读完）</button></div>'
  } else bar.innerHTML=''}
function markDone(title){const db=doneDB();
  db[title]={count:(db[title]&&db[title].count||0)+1,date:studyDay()};
  store.set('doneread',db);toastMsg('✓ 已标记读完');
  syncNow().catch(()=>{}); // 读完全批自动同步，无需手动（用户 11-20）
  render()}`,
  'markDone+pubbar');

// 2b. render(): call renderPubbar at end
rep(`  renderVocab();restoreMarks();positionPanels();`,
  `  renderVocab();restoreMarks();positionPanels();renderPubbar();`,
  'render pubbar');

// 2c. delete 今日任务 renderTask block entirely (no call, no function)
rep(`  renderTask(list); // 任务卡：常驻顶部，会话断了也能看到当前任务（用户 10-31 需求）
`, ``, 'renderTask call');

// 2d. remove renderTask function + TASKS constant (keep others)
const i0 = s.indexOf('const TASKS={');
if (i0 > 0) {
  const i1 = s.indexOf('function renderTask', i0);
  const i2 = s.indexOf('function renderVocab()', i1);
  if (i1 > 0 && i2 > i1) {
    s = s.slice(0, i0) + s.slice(i2);
    console.log('ok: TASKS+renderTask removed');
  } else fails.push('TASKS block bounds');
} else fails.push('TASKS not found');

// 2e. phrase rework: click word → select; consecutive = phrase; non-consecutive = sentence fragment (not period-bounded).
// Replace the click-handler phrase branch and confirmPhrase/togglePhraseMode.
rep(`    if(selState){ // 词组模式
      if(selState.key==='__start__'){ // 模式刚开启，点第一个词
        selState={key:k,words:[k],wEl:w};w.classList.add('sel');speak(k,0.9);return}
      if(k===selState.key){confirmPhrase();return}
      const prev=selState.words[selState.words.length-1];
      // 取下一个元素节点（跳过词与词之间的空格文本节点——词组连不上的根因）
      let nx=selState.wEl.nextSibling;while(nx&&nx.nodeType!==1)nx=nx.nextSibling;
      const nextClean=nx?cleanWord(nx.dataset.w||''):null;
      if(nextClean===k){selState.words.push(k);selState.wEl=nx;w.classList.add('sel');speak(k,0.95);return}
      document.querySelectorAll('w.sel').forEach(x=>x.classList.remove('sel'));
      if(k===prev){selState=null;return}
      selState={key:k,words:[k],wEl:w};w.classList.add('sel');speak(k,0.9);return}`,
`    if(selState){ // 选词模式（用户 11-20：无需按钮——点第二个词时判断连续/不连续）
      if(k===selState.key&&selState.words.length>=2){confirmPhrase();return}
      if(selState.words.includes(k)&&selState.words.length===1){ // 再点同一个词=取消
        w.classList.remove('sel');selState=null;return}
      // 连续判定：新点的词紧跟已选串末尾（DOM 顺序）
      let nx=selState.wEl;let cont=false;
      // 已选串末词 → 向后找下一个词元素
      let nn=selState.wEl;for(;;){let t2=nn.nextSibling;while(t2&&t2.nodeType!==1)t2=t2.nextSibling;
        if(!t2){ // 跨句子：本句结束，看下一句的首词
          const sp=nn.closest('.sent');const nxt=sp&&sp.nextElementSibling;
          nn=nxt?nxt.querySelector('w'):null;if(!nn)break;continue}
        nn=t2;break}
      if(nn&&cleanWord(nn.dataset.w||'')===k)cont=true;
      if(cont){selState.words.push(k);selState.wEl=nn;w.classList.add('sel');speak(k,0.95);return}
      // 不连续 → 作为句子片段收进（首词→末词的跨句片段也允许）
      confirmPhraseAsFragment(w,k);return}`,
  'phrase click branch');

// 2f. replace confirmPhrase with phrase+fragment dual logic
rep(`function confirmPhrase(){
  const phrase=selState?selState.words.join(' '):'';
  const startW=selState?selState.wEl:null;
  const artIdx=startW&&startW.dataset&&startW.dataset.a?Number(startW.dataset.a):wordHomeIdx(phrase);
  selState=null;document.querySelectorAll('w.sel').forEach(x=>x.classList.remove('sel'));
  const pb=document.getElementById('phraseBtn');if(pb)pb.textContent='+ 词组';
  if(phrase&&!marks[phrase]){const en=normEntry(1);en.day=studyDay();if(artIdx!=null)en.art=artIdx;
    en.seq=(Number(store.get('seq'))||0)+1;store.set('seq',en.seq);
    marks[phrase]=en;translate(phrase);speak(phrase,0.9);store.set('vocab',marks);renderVocab();restoreMarks()}
  else if(phrase){toastMsg('生词本已有：'+phrase)}}`,
`function confirmPhrase(){
  const phrase=selState?selState.words.join(' '):'';
  const startW=selState?selState.wEl:null;
  const artIdx=startW&&startW.dataset&&startW.dataset.a?Number(startW.dataset.a):wordHomeIdx(phrase);
  selState=null;document.querySelectorAll('w.sel').forEach(x=>x.classList.remove('sel'));
  if(phrase&&!marks[phrase]){const en=normEntry(1);en.day=studyDay();if(artIdx!=null)en.art=artIdx;
    en.seq=(Number(store.get('seq'))||0)+1;store.set('seq',en.seq);
    marks[phrase]=en;translate(phrase);speak(phrase,0.9);store.set('vocab',marks);renderVocab();restoreMarks();
    toastMsg('词组已收进：'+phrase)}
  else if(phrase){toastMsg('生词本已有：'+phrase)}}
// 不连续的多词选择 → 句子片段（不受句号限制，允许跨句）：首词→刚点的词
function confirmPhraseAsFragment(wEnd,k){
  const w1=selState.w1El,w2=wEnd;
  selState=null;document.querySelectorAll('w.sel').forEach(x=>x.classList.remove('sel'));
  if(!w1||!w2){return}
  const sp1=w1.closest('.sent'),sp2=w2.closest('.sent');
  if(!sp1||!sp2)return;
  const ai=Number(w1.dataset.a);
  const j1=Number(sp1.dataset.i.split('-')[1]),j2=Number(sp2.dataset.i.split('-')[1]);
  if(j2<j1){toastMsg('请按阅读顺序选词');return}
  // 收集首词→末词之间所有词（可能跨句）
  const parts=[];let cur=sp1;
  for(let j=j1;j<=j2;j++){
    const sp=[...document.querySelectorAll('.sent')].find(x=>{const [a,b]=x.dataset.i.split('-').map(Number);return a===ai&&b===j});
    if(sp)parts.push(sp.textContent.trim())}
  const frag=parts.join(' ');
  const db=ukDB();db[ai]=db[ai]||[];
  const hit=db[ai].find(x=>x.sent===frag);
  if(hit){db[ai]=db[ai].filter(x=>x.sent!==frag);toastMsg('已取消该片段')}
  else{db[ai].push({j:j1,sent:frag,day:studyDay()});toastMsg('⭐ 已画句子片段（首词到末词），复习页可看')}
  store.set('userkeys',db);render()}`,
  'confirmPhrase+fragment');

// 2g. selection start: single click on unselected word while not in selState should START selection only if user double-clicks?
// User rule: click word → select (existing add-word behavior); selection of 2+ words needs the word already in vocab clicked again.
// Keep simple: if word already marked (marks[k]) and clicked → instead of removing, start selection; second click on same word cancels.
rep(`    if(marks[k]){delete marks[k];w.classList.remove('on')}
    else{const loc=w.dataset.i; // 词的精确位置（句号-句内词序）：只亮你点的那一个，不全文连亮
      addWord(k,w.closest('.sent')?w.closest('.sent').textContent:null,Number(w.dataset.a),loc);w.classList.add('on')}
    store.set('vocab',marks);renderVocab();`,
`    if(selState&&selState.wEl&&cleanWord(selState.wEl.dataset.w||'')===k){confirmPhraseAsFragment(w,k);return} // 选中串的末词再点=以句子片段收进
    if(marks[k]){ // 已在生词本的词再点=开始/继续选词组（用户 11-20：无需按钮）
      if(!selState){selState={key:k,words:[k],wEl:w,w1El:w};w.classList.add('sel');toastMsg('选词中：点相邻词=词组，点不相邻词=句子片段，再点本词=取消');return}
      return}
    else{const loc=w.dataset.i; // 词的精确位置（句号-句内词序）：只亮你点的那一个，不全文连亮
      addWord(k,w.closest('.sent')?w.closest('.sent').textContent:null,Number(w.dataset.a),loc);w.classList.add('on')}
    store.set('vocab',marks);renderVocab();`,
  'click-to-select');

// 2h. remove togglePhraseMode function (no button anymore)
const t0 = s.indexOf('function togglePhraseMode(){');
if (t0 > 0) {
  const t1 = s.indexOf('function isMobilePanel()', t0);
  if (t1 > t0) { s = s.slice(0, t0) + s.slice(t1); console.log('ok: togglePhraseMode removed'); }
  else fails.push('togglePhraseMode bounds');
} else fails.push('togglePhraseMode not found');

// 2i. vpanel header: remove + 词组 button (selection needs no button now)
console.log("skip: vpanel phrase button already removed");

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
fs.writeFileSync(dir + '/index.html', s);
console.log('phase2 written');
