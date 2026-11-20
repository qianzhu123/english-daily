const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/training.html', 'utf8');
const bad = "return `<button class=\\'${cls}\\' ${done?'disabled':''} onclick=\\'pickOpt('${day}',${qn},${i})\\'>${'ABCD'[i]}. ${esc(o)}</button>`}).join('');";
const good = "return `<button class=\"${cls}\" ${done?'disabled':''} onclick=\"pickOpt('${day}',${qn},${i})\">${'ABCD'[i]}. ${esc(o)}</button>`}).join('');";
if (!s.includes(bad)) { console.log('MISS bad attr line'); process.exit(1); }
s = s.replace(bad, good);
fs.writeFileSync(dir + '/training.html', s);
console.log('attr quotes fixed');
