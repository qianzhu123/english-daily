const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/index.html', 'utf8');
const oldB = '<button onclick="togglePhraseMode(${i})" style="padding:1px 6px;font-size:.7rem">+ 词组</button></h4>';
if (!s.includes(oldB)) { console.log('MISS vpanel phrase btn'); process.exit(1); }
s = s.split(oldB).join('</h4>');
fs.writeFileSync(dir + '/index.html', s);
console.log('vpanel phrase button removed');
