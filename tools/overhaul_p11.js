// Phase 11: training page fixes (user 11-23)
// A. Rewrite TRAIN days 11-21/19/14/12/10 with fully independent passages
//    (never derived from reading articles - measured 100% copy on 3 old days)
// B. pickOpt: update only the clicked question's buttons (no full re-render)
//    so the picked style stays visible instantly
// C. delVocabSide: also clear the yellow mark on the page
// D. fragments show in the training sidebar too (trainfrags)
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const path = dir + '/training.html';
let s = fs.readFileSync(path, 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.replace(oldStr, newStr);
  fs.writeFileSync(path, s);
  console.log('ok:', label);
}

// --- B. pickOpt without full re-render: toggle picked class on buttons ---
rep(
`const quizPick={}; // 未提交的临时选择 {day#qn: idx}
function pickOpt(day,qn,i){quizPick[day+'#q'+qn]=i;render()}`,
`const quizPick={}; // 未提交的临时选择 {day#qn: idx}
function pickOpt(day,qn,i){quizPick[day+'#q'+qn]=i;
  // 只更新本题按钮样式，不整页重渲染（用户 11-23：点击无反馈的根因是 render 重建丢状态）
  const card=event&&event.target?event.target.closest('div'):null;
  const btns=document.querySelectorAll('button.opt');
  btns.forEach(b=>b.classList.remove('picked'));
  if(event&&event.target)event.target.classList.add('picked');
  // 启用提交按钮
  const submitBtn=event&&event.target&&event.target.parentNode?event.target.parentNode.querySelector('button.reveal'):null;
  if(submitBtn)submitBtn.disabled=false}`,
'B: pickOpt instant feedback');

// --- C. delVocabSide clears page mark ---
rep(
`function delVocabSide(k){const marks=store.get(TVKEY);delete marks[k];store.set(TVKEY,marks);renderVocabSide();toast('「'+k+'」已移除')}`,
`function delVocabSide(k){const marks=store.get(TVKEY);delete marks[k];store.set(TVKEY,marks);
  // 同步清掉页面上的黄底标记（用户 11-23：删了侧栏词文章里还亮着）
  document.querySelectorAll('w[data-w]').forEach(w=>{if(w.dataset.w===k){w.style.background='';w.classList.remove('tadded')}});
  renderVocabSide();markTrainWords();toast('「'+k+'」已移除')}`,
'C: delVocabSide clears marks');

// --- D. fragments into training sidebar ---
rep(
`  el.innerHTML=ks.slice(-40).reverse().map(k=>{const q=k.replace(/'/g,"\\'").replace(/"/g,'&quot;');
    return \`<li><span class="w" onclick="speak('\${q}',0.9)">\${escT(k)}</span><span class="del" onclick="delVocabSide('\${q}')" title="移除">×</span><span class="tr">\${tc[k]?escT(tc[k]):'<span style="color:var(--dim)">查译…</span>'}</span></li>\`).join('');`,
`  const day=curDay||TRAIN[0].day;
  const fdb=store.get('trainfrags');
  const fragHtml=(fdb[day]||[]).map((f,fi)=>'<li style="display:block"><span style="color:#c77b2f;font-size:.78rem">⭐ '+escT(f.sent.length>50?f.sent.slice(0,50)+'…':f.sent)+'</span><span class="del" onclick="delTrainFrag('+fi+')" title="移除">×</span></li>').join('');
  el.innerHTML=fragHtml+ks.slice(-40).reverse().map(k=>{const q=k.replace(/'/g,"\\'").replace(/"/g,'&quot;');
    return \`<li><span class="w" onclick="speak('\${q}',0.9)">\${escT(k)}</span><span class="del" onclick="delVocabSide('\${q}')" title="移除">×</span><span class="tr">\${tc[k]?escT(tc[k]):'<span style="color:var(--dim)">查译…</span>'}</span></li>\`).join('');`,
'D: frags in sidebar');

// delTrainFrag function
rep(
`function delVocabSide(k){`,
`function delTrainFrag(fi){const day=curDay||TRAIN[0].day;const fdb=store.get('trainfrags');
  (fdb[day]||[]).splice(fi,1);store.set('trainfrags',fdb);renderVocabSide();markTrainWords();toast('片段已移除')}
function delVocabSide(k){`,
'D: delTrainFrag');

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
console.log('phase11 part1 done');
