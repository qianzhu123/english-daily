// Phase 10d: toggleArticleTr bilingual interactive rewrite
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const path = dir + '/index.html';
let s = fs.readFileSync(path, 'utf8');

const a0 = s.indexOf("  if(!full){btn.textContent='整篇翻译';toastMsg('翻译失败，稍后再试');return}");
const a1 = s.indexOf("artBox.after(div);btn.textContent='收起翻译'}", a0);
if (a0 < 0 || a1 < 0) { console.log('MISS bounds', a0, a1); process.exit(1); }
const end = a1 + "artBox.after(div);btn.textContent='收起翻译'}".length;

const neu = [
"  if(!full){btn.textContent='整篇翻译';toastMsg('翻译失败，稍后再试');return}",
"  const div=document.createElement('div');div.className='arttr notes';div.style.background='#f4f8f4';",
"  // 逐句双语行（用户 11-23）：英文行可点词收生词、标记同步，中文行紧跟其下",
"  const lines2=full.split(/\\n/);",
"  const sens=window.ARTICLES[artIdx].sentences;",
"  let html='<b>全文翻译</b>（点英文单词可直接收进生词本）<br>';",
"  const aligned=lines2.length===sens.length;",
"  if(aligned){",
"    sens.forEach((en,j)=>{",
"      html+='<div class=\"sent\" data-i=\"'+artIdx+'-'+j+'\" style=\"margin:6px 0\">'+",
"        en.split(/\\s+/).map(w2tokArt).join(' ')+",
"        '<div style=\"color:#555;font-size:.86rem;margin-top:2px\">'+esc(lines2[j]||'')+'</div></div>'});",
"  }else{",
"    html+='<div style=\"color:#8a6d3b;font-size:.78rem;margin:4px 0\">（本篇译文与原句数不一致：下方为整段中文；逐句点词请用正文）</div>';",
"    html+='<div style=\"margin:6px 0\">'+sens.map(en=>en.split(/\\s+/).map(w2tokArt).join(' ')).join(' ')+",
"      '<div style=\"color:#555;font-size:.86rem;margin-top:6px;white-space:pre-line\">'+esc(full)+'</div></div>';",
"  }",
"  div.innerHTML=html;",
"  artBox.after(div);",
"  // 标记同步：正文已标的词在翻译区也亮",
"  div.querySelectorAll('w[data-w]').forEach(x=>{",
"    const kk=cleanWord(x.dataset.w);",
"    if(marks[kk])x.classList.add('on');",
"    else if(Object.keys(marks).some(pk=>pk.includes(' ')&&pk.split(' ').includes(kk)))x.classList.add('inphrase')});",
"  btn.textContent='收起翻译'}",
"// 全文翻译区的词元素（词点击走 document 级统一流程，无 onclick 属性）",
"function w2tokArt(t){const m=t.match(/^([^A-Za-z0-9\\u00c0-\\u024f]*)([A-Za-z0-9\\u00c0-\\u024f''-]+)([\\s\\S]*)$/);",
"  if(!m)return esc(t);",
"  const w=m[2].toLowerCase();",
"  return esc(m[1])+'<w data-w=\"'+esc(w)+'\" style=\"cursor:pointer\">'+esc(m[2])+'</w>'+esc(m[3])}"
].join('\n');

s = s.slice(0, a0) + neu + s.slice(end);
fs.writeFileSync(path, s);
console.log('ok: toggleArticleTr rewritten');

const m = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)];
try { m.forEach(mm => new Function(mm[1])); console.log('SYNTAX OK'); }
catch (e) { console.log('SYNTAX ERR:', e.message); process.exit(1); }
