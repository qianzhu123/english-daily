// Phase 4: training page overhaul (backtick-safe: old/new strings built without template literals)
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/training.html', 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.replace(oldStr, newStr);
  console.log('ok:', label);
}
const BT = '`';

// 4a. meta: delete 导出作答 button
rep('阅读是输入，这里是输出，允许烂，不允许抄 · <button onclick="exportAnswers()" style="padding:2px 8px;font-size:.78rem">📤 导出作答</button></div>',
  '阅读是输入，这里是输出，允许烂，不允许抄</div>',
  'meta export button');

// 4b. add 看往期 button + calendar container + sidebar div in body
rep('<div class="nav" id="nav"></div>\n<div id="content"></div>',
  '<div class="nav" id="nav"></div>\n<div style="margin:6px 0"><button onclick="toggleTrainCal()" id="oldBtn" style="padding:2px 8px;font-size:.78rem">📅 看往期</button></div>\n<div id="traincal" style="display:none"></div>\n<div id="content"></div>\n<div class="vocabside" id="vocabside"><h3>生词本</h3><ul id="vocaside-list"></ul></div>',
  'body additions');

// 4c. quiz: select-then-submit. Locate the old block by markers instead of full-text match.
const q0 = s.indexOf('function quizHtml(day,qn,qz,saved){');
const q1 = s.indexOf('// 导出作答：只导出**当前选中日期**的作答', q0);
if (q0 > 0 && q1 > q0) {
  // block spans quizHtml + answerQuiz; also kwHtml sits before quizHtml — remove it too
  const k0 = s.indexOf('// 关键词注释块：当日关键词/易错词翻译');
  const newBlock = [
    'function quizHtml(day,qn,qz,saved){',
    '  const key=day+\'#q\'+qn;',
    '  const done=saved[key];',
    '  // 提交制（用户 11-20）：点选项只选中，点「提交」才判分',
    '  const picked=quizPick[key];',
    '  const opts=qz.opts.map((o,i)=>{',
    '    let cls=\'opt\';',
    '    if(done){ // 已提交：锁定，标出对错',
    '      if(i===qz.ans)cls+=\' good\';',
    '      else if(i===done.pick)cls+=\' badv\'}',
    '    else if(picked===i)cls+=\' picked\';',
    '    return ' + JSON.stringify('<button class="${cls}" ${done?\'disabled\':\'\'} onclick="pickOpt(\'${day}\',${qn},${i})">${\'ABCD\'[i]}. ${esc(o)}</button>').replace(/"/g, "'").replace(/^'/, BT).replace(/'$/, BT) + '}).join(\'\');',
    '  const submit=!done?' + BT + '<button class="reveal" style="margin:8px 0" ${picked===undefined?\'disabled\':\'\'} onclick="answerQuiz(\'${day}\',${qn})">提交</button>' + BT + ':\'\';',
    '  const res=done?' + BT + '<div class="qdone ${done.ok?\'ok\':\'no\'}">${done.ok?\'✓ 答对了\':\'✗ 答错了——正确答案：\'+\'ABCD\'[qz.ans]}</div>' + BT + ':\'\';',
    '  return ' + BT + '<div style="margin-top:14px"><div style="font-size:.72rem;color:var(--dim)">${esc(qz.type)}</div>',
    '  <div class="passage">${qz.passage.split(/\\s+/).map(w2tok).join(\' \')} <span style="color:var(--dim);font-size:.7rem">（点生词加入复习）</span></div>',
    '  <p style="font-weight:700;margin:6px 0">${esc(qz.q)}</p>${opts}${submit}${res}',
    '  <div class="qwhy ${done?\'show\':\'\'}" id="why-${qn}">💡 ${esc(qz.why)}</div></div>' + BT + '}',
    'const quizPick={}; // 未提交的临时选择 {day#qn: idx}',
    'function pickOpt(day,qn,i){quizPick[day+\'#q\'+qn]=i;render()}',
    'function answerQuiz(day,qn){',
    '  const picked=quizPick[day+\'#q\'+qn];',
    '  if(picked===undefined){toast(\'先选一个选项再提交\');return}',
    '  const d=TRAIN.find(x=>x.day===day);const qz=d.quiz[qn];',
    '  const ok=picked===qz.ans;',
    '  const saved=store.get(\'traintry\');',
    '  saved[day+\'#q\'+qn]={pick:picked,ok:ok};store.set(\'traintry\',saved);',
    '  delete quizPick[day+\'#q\'+qn];',
    '  render();',
    '  const why=document.getElementById(\'why-\'+qn);if(why)why.classList.add(\'show\')}'
  ].join('\n');
  if (k0 > 0 && k0 < q0) {
    s = s.slice(0, k0) + newBlock + s.slice(q1);
    console.log('ok: kwHtml+quiz block replaced');
  } else {
    s = s.slice(0, q0) + newBlock + s.slice(q1);
    console.log('ok: quiz block replaced');
  }
} else fails.push('quiz block bounds');

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
fs.writeFileSync(dir + '/training.html', s);
console.log('phase4a written');
