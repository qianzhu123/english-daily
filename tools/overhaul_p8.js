// Fix training page: remove reading-article full-text block (user 11-21: training
// content must never come from reading articles); instead each distinct quiz
// passage is shown ONCE as the 题组原文, with its questions attached beneath it.
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/training.html', 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.replace(oldStr, newStr);
  console.log('ok:', label);
}

// 1. remove the reading-article full-text block entirely (locate by markers, not template match)
const a0 = s.indexOf('  // 完整文章（用户 11-20）：训练日出处文章全文先展示，再做题——不给「只看答案句」降难度');
const a1 = s.indexOf('  // 雅思练一练（选择/判断，提交制；作答状态记 traintry，刷新不重置）');
const a2 = s.indexOf("  (d.quiz&&d.quiz.length?`<div class=\"card\"><h2>📝 雅思练一练 <span class=\"tag\">选选项 → 提交判分</span></h2>`+", a1);
const a3 = s.indexOf("'</div>':'')+", a2);
if (a0 > 0 && a1 > a0 && a2 > a1 && a3 > a2) {
  const replaced = [
    '  // 雅思练一练（提交制；作答状态记 traintry，刷新不重置）。训练文章与阅读批次完全无关（用户 11-21）：',
    '  // 同一原文只展示一次，题目挂在原文下——不是每题重复贴段落，更不是展示阅读文章',
    "  (d.quiz&&d.quiz.length?buildQuizGroups(d,saved):'')+"
  ].join('\n');
  s = s.slice(0, a0) + replaced + s.slice(a3 + "'</div>':'')+".length);
  console.log('ok: article block removed, quiz grouped');
} else { console.log('MISS: article block bounds', a0, a1, a2, a3); process.exit(1); }

// 2. add buildQuizGroups + per-group rendering next to quizHtml
rep('function quizHtml(day,qn,qz,saved){', [
  '// 题组：按原文聚合（同一 passage 的题共享一段原文，只贴一次）',
  'function buildQuizGroups(d,saved){',
  '  const groups=[];',
  '  d.quiz.forEach((qz,qn)=>{',
  '    const last=groups[groups.length-1];',
  '    if(last&&last.passage===qz.passage)last.items.push(qn);',
  '    else groups.push({passage:qz.passage,items:[qn]})});',
  '  return \'<div class="card"><h2>📝 雅思练一练 <span class="tag">选选项 → 提交判分</span></h2>\'+',
  "    groups.map((g,gi)=>'<div style=\"margin-top:14px;padding-top:10px;border-top:1px dashed #ddd\">'+",
  "      '<div class=\"passage\">'+g.passage.split(/\\s+/).map(w2tok).join(' ')+' <span style=\"color:var(--dim);font-size:.7rem\">（点生词加入复习）</span></div>'+",
  "      g.items.map(qn=>quizHtml(d.day,qn,d.quiz[qn],saved,true)).join('')+'</div>').join('')+'</div>'}",
  'function quizHtml(day,qn,qz,saved,noPassage){'
].join('\n'), 'quizHtml: add passage-grouped builder + noPassage flag');

// 3. quizHtml body: hide per-question passage when grouped (locate by markers)
const BT = '`';
const p0 = s.indexOf('  return ' + BT + '<div style="margin-top:14px"><div style="font-size:.72rem;color:var(--dim)">${esc(qz.type)}</div>');
const p1 = s.indexOf('<p style="font-weight:700;margin:6px 0">${esc(qz.q)}</p>${opts}${submit}${res}', p0);
if (p0 > 0 && p1 > p0) {
  const passageLine = s.indexOf('<div class="passage">', p0);
  const passageEnd = s.indexOf('</span></div>', passageLine) + '</span></div>'.length;
  const between = s.slice(passageLine, passageEnd);
  s = s.slice(0, passageLine) + "${noPassage?'':`" + between + "`}" + s.slice(passageEnd);
  console.log('ok: quizHtml body conditional passage');
} else { console.log('MISS: quizHtml passage bounds', p0, p1); process.exit(1); }

// 4. articles.js no longer needed on training page (nothing else uses it)
rep('<script src="articles.js?v=1121a"></script>\n', '', 'drop articles.js include');

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
fs.writeFileSync(dir + '/training.html', s);
console.log('phase8 written');
