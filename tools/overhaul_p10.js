// Phase 10: reading page rework (user 11-23)
// A. vpanel header: drop the 复习 button; add 词组 / 句子 mode buttons
// B. click flow rewrite: plain click = toggle word in/out of vocab (adjacent
//    words always addable); phrase/fragment ONLY via buttons - no more
//    auto-fragmenting when consecutive check fails (the "drew a sentence by
//    accident" bug)
// C. fragments show in the vocab panel (not review only)
// D. full-translation block: English lines re-tokenized, marks synced, words
//    clickable into vocab
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const path = dir + '/index.html';
let s = fs.readFileSync(path, 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(path, s); // persist immediately
  console.log('ok:', label);
}

// --- A. vpanel header: remove 复习, add mode buttons ---
rep(
`<button onclick="location.href='review.html'" style="padding:1px 6px;font-size:.7rem">复习</button></h4>`,
`<button onclick="phraseBtn(${i},this)" style="padding:1px 6px;font-size:.7rem">词组</button><button onclick="fragBtn(${i},this)" style="padding:1px 6px;font-size:.7rem">句子</button></h4>`,
'A: vpanel header buttons');

// --- B. rewrite click flow ---
const oldFlow =
`    const k=cleanWord(w.dataset.w);
    if(selState){ // 选词模式（用户 11-20：无需按钮——点第二个词时判断连续/不连续）
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
      confirmPhraseAsFragment(w,k);return}
    if(selState&&selState.wEl&&cleanWord(selState.wEl.dataset.w||'')===k){confirmPhraseAsFragment(w,k);return} // 选中串的末词再点=以句子片段收进
    if(marks[k]){ // 已在生词本的词再点=开始/继续选词组（用户 11-20：无需按钮）
      if(!selState){selState={key:k,words:[k],wEl:w,w1El:w};w.classList.add('sel');toastMsg('选词中：点相邻词=词组，点不相邻词=句子片段，再点本词=取消');return}
      return}
    else{const loc=w.dataset.i; // 词的精确位置（句号-句内词序）：只亮你点的那一个，不全文连亮
      addWord(k,w.closest('.sent')?w.closest('.sent').textContent:null,Number(w.dataset.a),loc);w.classList.add('on')}
    store.set('vocab',marks);renderVocab();
  });`;
const newFlow =
`    const k=cleanWord(w.dataset.w);
    if(pmode){pmClick(w,k);return} // 词组/句子模式进行中（用户 11-23：按钮驱动）
    // 无模式：点词=收进生词本，再点=撤销（相邻词随便加，不会被劫持成选词）
    const loc=w.dataset.i;
    if(marks[k]){delete marks[k];w.classList.remove('on');
      const ph=Object.keys(marks).find(pk=>pk.includes(' ')&&pk.split(' ').includes(k));
      if(ph)document.querySelectorAll('w').forEach(x=>{if(cleanWord(x.dataset.w)===k&&!Object.keys(marks).some(pk=>pk.includes(' ')&&pk.split(' ').includes(cleanWord(x.dataset.w))))x.classList.remove('inphrase')})}
    else{addWord(k,w.closest('.sent')?w.closest('.sent').textContent:null,Number(w.dataset.a),loc);w.classList.add('on')}
    store.set('vocab',marks);renderVocab();
  });`;
rep(oldFlow, newFlow, 'B: click flow rewrite');

// --- replace selState machinery with pmode ---
rep(
`function confirmPhrase(){
  const phrase=selState?selState.words.join(' '):'';
  const startW=selState?selState.wEl:null;`,
`let pmode=null; // {type:'phrase'|'frag', ai, words?, wEl, w1El, done}
function phraseBtn(ai,btn){ // 词组按钮：开始/确认/取消 三态
  if(pmode&&pmode.type==='phrase'&&pmode.ai===ai){
    if(pmode.words&&pmode.words.length>=2){confirmPhrase();return}
    pmodeClear();toast('已取消词组模式');return}
  pmodeClear();pmode={type:'phrase',ai:ai};toast('词组模式：依次点连续的词，点完再按「词组」确认')}
function fragBtn(ai,btn){ // 句子按钮：进入片段模式（点首词+末词）
  if(pmode&&pmode.type==='frag'&&pmode.ai===ai){pmodeClear();toast('已取消句子模式');return}
  pmodeClear();pmode={type:'frag',ai:ai};toast('句子模式：点片段第一个词，再点最后一个词')}
function pmodeClear(){pmode=null;document.querySelectorAll('w.sel').forEach(x=>x.classList.remove('sel'))}
function pmClick(w,k){
  if(pmode.type==='phrase'){
    if(!pmode.words){pmode.words=[k];pmode.wEl=w;pmode.w1El=w;w.classList.add('sel');
      toast('已选「'+k+'」，继续点相邻词；完成后点「词组」确认');return}
    const all=[...document.querySelectorAll('w[data-w]')];
    if(all.indexOf(w)===all.indexOf(pmode.wEl)+1){pmode.words.push(k);pmode.wEl=w;w.classList.add('sel');speak(k,0.95);return}
    toast('词组必须连续——不连续/跨句请用「句子」按钮画片段');return}
  // frag：首词 → 末词（允许跨句，自动按阅读顺序）
  if(!pmode.w1){pmode.w1=w;pmode.k1=k;w.classList.add('sel');
    toast('起点已选「'+k+'」，再点片段最后一个词');return}
  confirmFrag(w)}
function confirmFrag(w2){ // 收集首词→末词之间所有句子文本（DOM 顺序，可跨句）
  const w1=pmode.w1,ai=pmode.ai;pmodeClear();
  const sp1=w1.closest('.sent'),sp2=w2.closest('.sent');
  if(!sp1||!sp2){toast('请点文章里的词');return}
  // 同一文章块内按 DOM 顺序从 sp1 走到 sp2（不分先后，自动纠正方向）
  const boxA=w1.closest('.art-wrap')||sp1.parentNode;
  if((w2.closest('.art-wrap')||sp2.parentNode)!==boxA){toast('两个词不在同一篇文章里');return}
  let s1=sp1,s2=sp2;
  {let cur=sp1.parentNode.contains(sp2)?sp1:sp2; // 确定先后
   const order=(a,b)=>!!(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);
   if(order(sp1,sp2)){s1=sp1;s2=sp2}else{s1=sp2;s2=sp1}}
  const parts=[];let cur=s1;
  while(cur){parts.push(cur.textContent.trim());if(cur===s2)break;cur=cur.nextElementSibling}
  const frag=parts.join(' ').replace(/\\s+/g,' ');
  if(!frag||parts.length>12){toast('片段太长（最多跨 12 句）');return}
  const db=ukDB();db[ai]=db[ai]||[];
  const hit=db[ai].find(x=>x.sent===frag);
  if(hit){db[ai]=db[ai].filter(x=>x.sent!==frag);toast('已取消该片段')}
  else{db[ai].push({j:-1,sent:frag,day:studyDay()});toast('⭐ 句子已收进生词本面板')}
  store.set('userkeys',db);renderVocab()}
function confirmPhrase(){
  const phrase=pmode&&pmode.words?pmode.words.join(' '):'';
  const startW=pmode?pmode.wEl:null;
  pmodeClear();`,
'pmode machinery');

// fix rest of confirmPhrase (old selState=null line inside)
rep(
`  selState=null;document.querySelectorAll('w.sel').forEach(x=>x.classList.remove('sel'));
  if(phrase&&!marks[phrase]){`,
`  if(phrase&&!marks[phrase]){`,
'confirmPhrase body cleanup');

// confirmPhraseAsFragment: no longer reachable via click flow, delete by replacing with alias
const c0=s.indexOf('function confirmPhraseAsFragment(wEnd,k){');
const cEnd=s.indexOf('let toastTimer=null;',c0);
if(c0>0&&cEnd>c0){
  s=s.slice(0,c0)+s.slice(cEnd);
  fs.writeFileSync(path,s);
  console.log('ok: confirmPhraseAsFragment removed (fragment now via confirmFrag)');
}else{fails.push('confirmPhraseAsFragment removal')}

// selState declaration removal
rep(`let marks=store.get('vocab'),sentEls=[],sentTexts=[],selState=null;`,
    `let marks=store.get('vocab'),sentEls=[],sentTexts=[];`,
    'selState decl removed');

// --- C. renderVocab: show fragments in panel ---
rep(
`    ul.querySelectorAll('li[data-k]').forEach(li=>{`,
`    // 句子片段也进面板（用户 11-23：不只复习页可见）
    const frags=ukDB()[i]||[];
    const fragHtml=frags.map((f,fi)=>'<li style="display:block"><span style="color:#c77b2f;font-size:.78rem">⭐ '+esc(f.sent.length>60?f.sent.slice(0,60)+'…':f.sent)+'</span><span class="del" data-fdel="'+fi+'" title="删除片段">×</span></li>').join('');
    ul.querySelectorAll('li[data-k]').forEach(li=>{`,
'C: frag html prep');

rep(
`  positionPanels()}
function exportVocab(){`,
`  // 片段删除绑定（renderVocab 里 ul 已重建，需在 innerHTML 后追加）
  A.forEach((a,i)=>{
    const ul2=document.querySelector('#vpanel-'+i+' ul');if(!ul2)return;
    const frags=ukDB()[i]||[];
    ul2.querySelectorAll('li[data-fdel]').forEach(li=>{
      li.querySelector('.del').onclick=()=>{const db=ukDB();db[i].splice(Number(li.dataset.fdel),1);
        store.set('userkeys',db);renderVocab();toast('片段已删除')}});
    if(frags.length){const div2=document.createElement('li');div2.style.display='block';
      // fragments already appended above via fragHtml? (kept simple: rendered next run)
    }});
  positionPanels()}
function exportVocab(){`,
'C: frag delete binding (partial)');

// actually inject fragHtml into the ul html build
rep(
`      return \`<li data-k="\${esc(k)}"><span class="w">\${esc(k)}</span><span class="del" data-del="\${esc(k)}">×</span>\${tc`,
`      return \`<li data-k="\${esc(k)}"><span class="w">\${esc(k)}</span><span class="del" data-del="\${esc(k)}">×</span>\${tc`,
'noop anchor');

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
console.log('phase10 part1 done');
