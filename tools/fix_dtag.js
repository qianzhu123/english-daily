const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/review/index.html', 'utf8');
const old = '  const dtag=e.day&&e.day!==studyDay()?`<span style="color:#bbb;font-size:.68rem">${e.day.slice(5)} </span>`:\'\';';
if (!s.includes(old)) { console.log('miss dtag'); process.exit(1); }
const neo = [
  '  const ai2=wordHomeIdx(k);const pub=(ART[ai2]&&ART[ai2].date)||e.day||\'\';',
  '  const dtag=pub?`<span style="color:#bbb;font-size:.68rem">${pub.slice(5)} </span>`:\'\';'
].join('\n');
s = s.replace(old, neo);
fs.writeFileSync(dir + '/review/index.html', s);
console.log('dtag now shows publish date');
