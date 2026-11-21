// Phase 9: training page fixes (user 11-21 reports)
// 1. w2tok regex broken: [\s\S] was double-escaped -> [\\s\\S]; words with
//    trailing punctuation failed to match, so many words were not clickable
//    at all (root cause of "click word -> nothing happens").
// 2. addTrainWord must refresh the sidebar and cache a translation so the
//    sidebar shows meaning (translations-train was never written).
// 3. Port phrase/fragment selection from reading page: re-click marked word
//    = start selection; consecutive = phrase; non-consecutive = fragment.
// 4. Quiz options need visible picked state (CSS .opt.picked missing) and
//    clearer selected styling without relying on re-render only.
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const path = dir + '/training.html';
let s = fs.readFileSync(path, 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.replace(oldStr, newStr);
  console.log('ok:', label);
  fs.writeFileSync(path, s); // persist immediately (glm disconnect protection)
}

// 1. fix double-escaped regex class in w2tok
rep('[\\\\s\\\\S]', '[\\s\\S]', 'w2tok regex fix');

// 2. addTrainWord: refresh sidebar + store translation (base-form lookup via
//    simple plural/possessive strip; inline fetch chain same as reading page)
rep(
`function addTrainWord(k,el){const marks=store.get(TVKEY);
  if(marks[k]){ // 再点=从生词本删除（用户 11-18：可撤销）
    delete marks[k];store.set(TVKEY,marks);
    if(el){el.style.background='';el.classList.remove('tadded')}
    toast('「'+k+'」已从生词本移除');return}
  marks[k]={n:1,day:studyDay(),art:-1,due:studyDay(),ease:1,lapses:0};
  store.set(TVKEY,marks);
  if(el){el.style.background='#ffe08a';el.classList.add('tadded')}
  toast('「'+k+'」已加入生词本（翻译在复习页按日可见；再点一下可移除')}`,
`function addTrainWord(k,el){const marks=store.get(TVKEY);
  if(marks[k]){ // 再点=从生词本删除（用户 11-18：可撤销）
    delete marks[k];store.set(TVKEY,marks);
    if(el){el.style.background='';el.classList.remove('tadded')}
    renderVocabSide();toast('「'+k+'」已从生词本移除');return}
  marks[k]={n:1,day:studyDay(),art:-1,due:studyDay(),ease:1,lapses:0};
  store.set(TVKEY,marks);
  if(el){el.style.background='#ffe08a';el.classList.add('tadded')}
  renderVocabSide();
  toast('「'+k+'」已加入生词本（再点一下可移除）');
  trainTranslate(k)}`,

'addTrainWord: sidebar refresh + translation');

// 3. insert trainTranslate + selection-state machinery before renderVocabSide
rep(
`// 渲染后把已在生词本的训练词着色（刷新/重渲染后保持黄底）
function markTrainWords(){`,
`// 训练页翻译：MANUAL 训练词不维护，直接走在线链路（gtx→move→MyMemory），结果写 translations-train
// 查原型：去复数 s / 去所有格 's（用户 11-20：生词本翻译始终查原型）
const TR_TKEY='translations-train';
function trBase(k){if(/'s$|’s$/.test(k))return k.replace(/['’]s$/,'');if(/[^s]s$/.test(k))return k.slice(0,-1);return k}
async function trainTranslate(k){
  const tc=store.get(TR_TKEY);if(tc[k])return tc[k];
  const qk=trBase(k);let t='';
  try{const r=await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&dj=1&q='+encodeURIComponent(qk));
    if(r.ok){const j=await r.json();
      if(j&&j.sentences)t=j.sentences.map(x=>x.trans||'').join('')}}catch(e){}
  if(!t){try{const r=await fetch('https://translate.googleapis.com/translate_a/one?client=one&sl=en&tl=zh-CN&dt=t&q='+encodeURIComponent(qk));
    if(r.ok){const j=await r.json();
      if(j&&j.sentences)t=j.sentences.map(x=>x.trans||'').join('')}}catch(e){}}
  if(!t){try{const r=await fetch('https://api.mymemory.translated.net/get?q='+encodeURIComponent(qk)+'&langpair=en|zh-CN');
    const j=await r.json();t=(j&&j.responseData&&j.responseData.translatedText)||'';
    if(t&&(t.toLowerCase()===qk.toLowerCase()||/MYMEMORY WARNING|QUERY LENGTH/i.test(t)))t=''}catch(e){}}
  if(t){const c=store.get(TR_TKEY);c[k]=t;store.set(TR_TKEY,c);renderVocabSide()}}
// 词组/句子片段选词（用户 11-21：与阅读页同流程）——已标词再点=开始选词，
// 连续词=词组，不连续词=句子片段（首词→末词，可跨句）。
// 训练页没有按句包裹（无 .sent），按 DOM 顺序收集词元素即可。
let tsel=null; // {key, words:[], wEl, w1El}
function tselClear(){tsel=null;document.querySelectorAll('w.sel').forEach(x=>x.classList.remove('sel'))}
function tselAdd(k,el){
  if(!tsel){tsel={key:k,words:[k],wEl:el,w1El:el};el.classList.add('sel');
    toast('选词中：点相邻词=词组，点不相邻词=句子片段，再点本词=取消');return}
  // 再点本词：两个词=收词组；只有一个词=取消
  if(k===tsel.key){
    if(tsel.words.length===1){tselClear();toast('已取消选词');return}
    tConfirmPhrase();return}
  // 连续判定：新点的词紧跟已选串末尾（DOM 顺序）
  let nn=tsel.wEl,cont=false;
  for(;;){let t2=nn.nextSibling;while(t2&&t2.nodeType!==1)t2=t2.nextSibling;
    if(!t2){ // 穿过父容器找下一个词元素（训练页 passage 无 .sent 包裹）
      const par=nn.parentElement;let up=par;
      while(up&&!up.nextSibling)up=up.parentElement;
      nn=up?(up.nextSibling?null:null):null;break}
    nn=t2;break}
  // 简化：直接对比两词在 document 里的位置——nextElementSibling 链不可靠时用整体顺序
  if(!cont){
    const all=[...document.querySelectorAll('#content w[data-w], .vocabside w[data-w]')];
    const i1=all.indexOf(tsel.wEl),i2=all.indexOf(el);
    if(i2===i1+1)cont=true}
  if(cont){tsel.words.push(k);tsel.wEl=el;el.classList.add('sel');speak(k,0.95);return}
  // 不连续 → 句子片段：收集首词→末词之间所有词（DOM 顺序）
  tConfirmFragment(el,k)}
function tConfirmPhrase(){
  const phrase=tsel.words.join(' ');tselClear();
  const marks=store.get(TVKEY);
  if(phrase&&!marks[phrase]){
    marks[phrase]={n:1,day:studyDay(),art:-1,due:studyDay(),ease:1,lapses:0,phrase:true};
    store.set(TVKEY,marks);speak(phrase,0.9);
    toast('词组已收进：'+phrase);
    trainTranslate(phrase)}}
function tConfirmFragment(elEnd,kEnd){
  const all=[...document.querySelectorAll('#content w[data-w], .vocabside w[data-w]')];
  const i1=all.indexOf(tsel.w1El),i2=all.indexOf(elEnd);
  const w1=tsel.w1El,w2=elEnd;tselClear();
  if(i2<i1){toast('请按阅读顺序选词');return}
  const frag=all.slice(i1,i2+1).map(x=>x.textContent).join(' ');
  const fdb=store.get('trainfrags');
  const day=curDay||TRAIN[0].day;
  const hit=fdb[day]&&fdb[day].find(x=>x.sent===frag);
  if(hit){fdb[day]=fdb[day].filter(x=>x.sent!==frag);toast('已取消该片段')}
  else{fdb[day]=fdb[day]||[];fdb[day].push({sent:frag,day:studyDay()});toast('⭐ 已画句子片段（首词到末词），复习页可看')}
  store.set('trainfrags',fdb)}

// 渲染后把已在生词本的训练词着色（刷新/重渲染后保持黄底）
function markTrainWords(){`,

'trainTranslate + selection machinery');

// 4. w2tok click handler routes through selection flow: first click adds word,
//    re-click on an already-marked word starts/extends selection
// (backtick built via \x60 to avoid template interpolation)
const BT = '\x60';
const oldW2 = '  return esc(m[1])+' + BT + '<w data-w="${esc(w)}" style="cursor:pointer" onclick="addTrainWord(\'${esc(w).replace(/\'/g,"\\\\\'")}\',this)">${esc(m[2])}</w>' + BT + '+esc(m[3])}';
const newW2 = '  return esc(m[1])+' + BT + '<w data-w="${esc(w)}" style="cursor:pointer" onclick="tClick(\'${esc(w).replace(/\'/g,"\\\\\'")}\',this)">${esc(m[2])}</w>' + BT + '+esc(m[3])}';
rep(oldW2, newW2, 'w2tok click -> tClick');

// 5. tClick dispatcher (add after markTrainWords)
rep(
`// 渲染后把已在生词本的训练词着色（刷新/重渲染后保持黄底）
function markTrainWords(){`,
`function tClick(k,el){ // 训练页点词统一入口（用户 11-21：单词/词组/片段同流程）
  const marks=store.get(TVKEY);
  if(tsel){tselAdd(k,el);return} // 选词进行中
  if(marks[k]){tselAdd(k,el);return} // 已在生词本的词再点=开始选词
  addTrainWord(k,el)}
// 渲染后把已在生词本的训练词着色（刷新/重渲染后保持黄底）
function markTrainWords(){`,

'tClick dispatcher');

// 6. CSS: picked option + word selection highlight + tadded word
rep(
`.opt.good{background:#eef6f0;border-color:var(--accent);font-weight:700}
.opt.badv{background:#fdf0f0;border-color:var(--bad)}`,
`.opt.good{background:#eef6f0;border-color:var(--accent);font-weight:700}
.opt.badv{background:#fdf0f0;border-color:var(--bad)}
.opt.picked{background:#eef3fb;border-color:#4a7bd0;border-width:2px;font-weight:700;box-shadow:0 0 0 2px rgba(74,123,208,.25)}
#content w{cursor:pointer;border-radius:3px}
#content w.sel{background:#4a7bd0;color:#fff;font-weight:700}
#content w.tadded{background:#ffe08a}
#content w.fraged{background:#ffd9a0;border-bottom:2px solid #e8963c}`,

'CSS picked/sel/tadded');

// 7. markTrainWords: also restore .sel selection and fragment highlight after re-render
rep(
`  document.querySelectorAll('w[data-w]').forEach(w=>{
    if(marks[w.dataset.w]){w.style.background='#ffe08a';w.classList.add('tadded')}
    else{w.style.background='';w.classList.remove('tadded')}})}`,
`  document.querySelectorAll('#content w[data-w], .vocabside w[data-w]').forEach(w=>{
    if(marks[w.dataset.w]){w.style.background='#ffe08a';w.classList.add('tadded')}
    else{w.style.background='';w.classList.remove('tadded')}})
  // 句子片段高亮（trainfrags 记录首末词，按 DOM 顺序标 fraged）
  const fdb=store.get('trainfrags');
  const day=curDay||TRAIN[0].day;
  (fdb[day]||[]).forEach(fr=>{
    const frw=fr.sent.split(/\\s+/).map(x=>x.toLowerCase().replace(/[^a-z0-9à-ɏ'’-]/g,''));
    const aws=[...document.querySelectorAll('#content w[data-w]')];
    for(let i=0;i<=aws.length-frw.length;i++){
      let m=true;
      for(let j=0;j<frw.length;j++){if((aws[i+j].dataset.w||'')!==frw[j]){m=false;break}}
      if(m){for(let j=0;j<frw.length;j++)aws[i+j].classList.add('fraged');i+=frw.length-1}}})}`,

'markTrainWords: fragment restore');

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
console.log('phase9 written');
