// Phase 12b: pickOpt explicit event param
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const path = dir + '/training.html';
let s = fs.readFileSync(path, 'utf8');
const a0 = s.indexOf("function pickOpt(day,qn,i){quizPick");
const a1 = s.indexOf("if(submitBtn)submitBtn.disabled=false}", a0);
if (a0 < 0 || a1 < 0) { console.log('MISS bounds'); process.exit(1); }
const end = a1 + "if(submitBtn)submitBtn.disabled=false}".length;
const neu = [
"function pickOpt(day,qn,i,ev){quizPick[day+'#q'+qn]=i;",
"  // 只更新本题按钮样式，不整页重渲染（用户 11-23：点击无反馈的根因是 render 重建丢状态）",
"  if(!ev)return;",
"  const card=ev.target.closest('div');",
"  (card||document).querySelectorAll('button.opt').forEach(b=>b.classList.remove('picked'));",
"  ev.target.classList.add('picked');",
"  const submitBtn=card?card.querySelector('button.reveal'):null;",
"  if(submitBtn)submitBtn.disabled=false}"
].join('\n');
s = s.slice(0, a0) + neu + s.slice(end);
// update onclick call sites to pass event
s = s.replace(/pickOpt\('(\d{4}-\d\d-\d\d)',(\d+),(\d+)\)/g, "pickOpt('$1',$2,$3,event)");
fs.writeFileSync(path, s);
console.log('ok: pickOpt event param');
// syntax
const m = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)];
try { m.forEach(mm => new Function(mm[1])); console.log('SYNTAX OK'); }
catch (e) { console.log('SYNTAX ERR:', e.message); process.exit(1); }
