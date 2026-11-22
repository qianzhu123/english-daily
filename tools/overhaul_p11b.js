// Phase 11b: frags in sidebar (marker-based, avoids template escape issues)
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const path = dir + '/training.html';
let s = fs.readFileSync(path, 'utf8');
const BT = '\x60';
const oldLine = '  el.innerHTML=ks.slice(-40).reverse().map(k=>{const q=k.replace(/\'/g,"\\\'").replace(/"/g,\'&quot;\');';
const newLines = [
  '  const tday=curDay||TRAIN[0].day;',
  '  const fdb=store.get(\'trainfrags\');',
  '  const fragHtml=(fdb[tday]||[]).map((f,fi)=>\'<li style="display:block"><span style="color:#c77b2f;font-size:.78rem">\\u2b50 \'+escT(f.sent.length>50?f.sent.slice(0,50)+\\u2019…\\u2019:f.sent)+\'</span><span class="del" onclick="delTrainFrag(\'+fi+\')" title="移除">×</span></li>\').join(\'\');',
  oldLine
].join('\n');
if (!s.includes(oldLine)) { console.log('MISS anchor'); process.exit(1); }
s = s.replace(oldLine, newLines);
// patch the innerHTML assignment to prepend fragHtml
const oldAssign = '    return ' + BT + '<li><span class="w" onclick="speak(\'${q}\',0.9)">${escT(k)}</span><span class="del" onclick="delVocabSide(\'${q}\')" title="移除">×</span><span class="tr">${tc[k]?escT(tc[k]):\'<span style="color:var(--dim)">查译…</span>\'}</span></li>' + BT + ').join(\'\');';
const newAssign = '    return ' + BT + '<li><span class="w" onclick="speak(\'${q}\',0.9)">${escT(k)}</span><span class="del" onclick="delVocabSide(\'${q}\')" title="移除">×</span><span class="tr">${tc[k]?escT(tc[k]):\'<span style="color:var(--dim)">查译…</span>\'}</span></li>' + BT + ').join(\'\');';
// simpler: change the el.innerHTML= line to fragHtml+ concat
s = s.replace('  const tday=curDay||TRAIN[0].day;\n  const fdb=store.get(\'trainfrags\');\n  const fragHtml=(fdb[tday]||[]).map((f,fi)=>\'<li style="display:block"><span style="color:#c77b2f;font-size:.78rem">\u2b50 \'+escT(f.sent.length>50?f.sent.slice(0,50)+\u2019…\u2019:f.sent)+\'</span><span class="del" onclick="delTrainFrag(\'+fi+\')" title="移除">×</span></li>\').join(\'\');\n  el.innerHTML=ks.slice',
'  const tday=curDay||TRAIN[0].day;\n  const fdb=store.get(\'trainfrags\');\n  const fragHtml=(fdb[tday]||[]).map((f,fi)=>\'<li style="display:block"><span style="color:#c77b2f;font-size:.78rem">\\u2b50 \'+escT(f.sent.length>50?f.sent.slice(0,50)+\\u2019\\u2026\\u2019:f.sent)+\'</span><span class="del" onclick="delTrainFrag(\'+fi+\')" title="移除">×</span></li>\').join(\'\');\n  el.innerHTML=fragHtml+ks.slice');
fs.writeFileSync(path, s);
console.log('ok: fragHtml prepended');
const m = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)];
try { m.forEach(mm => new Function(mm[1])); console.log('SYNTAX OK'); }
catch (e) { console.log('SYNTAX ERR:', e.message); process.exit(1); }
