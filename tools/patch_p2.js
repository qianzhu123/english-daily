const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const p = dir + '/tools/overhaul_p2.js';
let t = fs.readFileSync(p, 'utf8');
// neutralize the failing vpanel rep (target already applied) — replace from that rep call to its close
const start = t.indexOf("rep(`复习</button>");
const end = t.indexOf("'vpanel phrase button');", start);
if (start > 0 && end > start) {
  t = t.slice(0, start) + 'console.log("skip: vpanel phrase button already removed");' + t.slice(end + "'vpanel phrase button');".length);
  fs.writeFileSync(p, t);
  console.log('patched p2');
} else console.log('pattern not found', start, end);
