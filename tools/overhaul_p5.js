// Phase 5: training page — separate vocab store, calendar, full articles, date display
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/training.html', 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.replace(oldStr, newStr);
  console.log('ok:', label);
}

// 5a. separate vocab store: training writes 'vocab-train' (user 11-20: 阅读和训练生词本分开)
rep("function addTrainWord(k,el){const marks=store.get('vocab');",
  "const TVKEY='vocab-train'; // 训练生词独立库（用户 11-20：与阅读生词本分开）\nfunction addTrainWord(k,el){const marks=store.get(TVKEY);",
  'addTrainWord store');

rep("    delete marks[k];store.set('vocab',marks);\n    if(el){el.style.background='';el.classList.remove('tadded')}",
  "    delete marks[k];store.set(TVKEY,marks);\n    if(el){el.style.background='';el.classList.remove('tadded')}",
  'addTrainWord delete');

rep("  marks[k]={n:1,day:studyDay(),art:-1,due:studyDay(),ease:1,lapses:0};\n  store.set('vocab',marks);",
  "  marks[k]={n:1,day:studyDay(),art:-1,due:studyDay(),ease:1,lapses:0};\n  store.set(TVKEY,marks);",
  'addTrainWord save');

rep("function markTrainWords(){\n  const marks=store.get('vocab');",
  "function markTrainWords(){\n  const marks=store.get(TVKEY);",
  'markTrainWords store');

// 5b. sidebar reads training vocab + translations cache; fix missing 查译… fallback → use MANUAL? training.html has no MANUAL; show in-article translation via TRAIN_KEYWORDS? deleted. Keep 查译… only if no cache; but user forbade 暂无释义 on reading. For training sidebar: show cached translation else blank line '—'.
rep("function renderVocabSide(){ // 与阅读页同一个 vocab 库 + translations 缓存\n  const el=document.getElementById('vocaside-list');if(!el)return;\n  const marks=store.get('vocab');const ks=Object.keys(marks);\n  const tc=store.get('translations');",
  "function renderVocabSide(){ // 训练页独立生词库 vocab-train（与阅读分开）\n  const el=document.getElementById('vocaside-list');if(!el)return;\n  const marks=store.get(TVKEY);const ks=Object.keys(marks);\n  const tc=store.get('translations-train');",
  'sidebar store');

rep("function delVocabSide(k){const marks=store.get('vocab');delete marks[k];store.set('vocab',marks);renderVocabSide();toast('「'+k+'」已移除')}",
  "function delVocabSide(k){const marks=store.get(TVKEY);delete marks[k];store.set(TVKEY,marks);renderVocabSide();toast('「'+k+'」已移除')}",
  'delVocabSide store');

// 5c. calendar: toggleTrainCal + render — training-only dates (TRAIN days), click → pick
rep("function pick(day){curDay=day;render()}",
  `function pick(day){curDay=day;render()}
// 看往期（用户 11-20）：仅训练日历——点日期看当天训练，不含任何其他内容
let calOpen=false;
function toggleTrainCal(){calOpen=!calOpen;renderCal()}
function renderCal(){
  const el=document.getElementById('traincal');if(!el)return;
  el.style.display=calOpen?'':'none';
  if(!calOpen){el.innerHTML='';return}
  const days=TRAIN.map(d=>d.day);
  const ym0=days[0].slice(0,7);
  const [y,mth]=ym0.split('-').map(Number);
  const first=new Date(y,mth-1,1);
  const startDow=first.getDay();
  const daysIn=new Date(y,mth,0).getDate();
  const byDay={};days.forEach(d=>byDay[d]=true);
  let cells='';
  for(let i=0;i<startDow;i++)cells+='<div class="calcell dim"></div>';
  for(let d=1;d<=daysIn;d++){
    const ds=y+'-'+String(mth).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    cells+='<button class="calcell'+(byDay[ds]?' has':' dim')+'" '+(byDay[ds]?'onclick="pick(\\''+ds+'\\');calOpen=false;renderCal()"':'disabled')+'>'+d+'</button>'}
  el.innerHTML='<div class="cal"><div class="calhead"><b>'+y+' 年 '+mth+' 月 · 训练记录</b></div><div class="calgrid"><div class="caldow">日</div><div class="caldow">一</div><div class="caldow">二</div><div class="caldow">三</div><div class="caldow">四</div><div class="caldow">五</div><div class="caldow">六</div>'+cells+'</div></div>'}`,
  'calendar');

// 5d. full articles: for days whose articles share the date, show 完整文章 above quizzes (user 11-20: 不展示整篇=降低难度)
rep("  // 雅思练一练（选择/判断，即时反馈；作答状态记 quizdone，刷新不重置）\n  (d.quiz&&d.quiz.length?`<div class=\"card\"><h2>📝 雅思练一练 <span class=\"tag\">点选项即时判分</span></h2>`+",
  "  // 完整文章（用户 11-20）：训练日出处文章全文先展示，再做题——不给「只看答案句」降难度\n  (function(){const arts=(window.ARTICLES||[]).filter(a=>a.date===d.day&&!a.draft);\n    if(!arts.length)return '';\n    return arts.map(a=>'<div class=\"card\"><h2>📖 原文全文 · '+esc(a.title)+'<span class=\"tag\">'+esc(a.date)+'</span></h2><div>'+a.sentences.map(x=>'<p style=\"margin:4px 0\">'+esc(x)+'</p>').join('')+'</div></div>').join('')})()+"+
  "  // 雅思练一练（选择/判断，提交制；作答状态记 traintry，刷新不重置）\n  (d.quiz&&d.quiz.length?`<div class=\"card\"><h2>📝 雅思练一练 <span class=\"tag\">选选项 → 提交判分</span></h2>`+",
  'full articles + quiz tag');

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
fs.writeFileSync(dir + '/training.html', s);
console.log('phase5 written');
