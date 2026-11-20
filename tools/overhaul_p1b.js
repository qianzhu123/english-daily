// Fix reading-page HTML that phase1 failed to persist: header, article meta, vpanel, pubbar div
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/index.html', 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.replace(oldStr, newStr);
  console.log('ok:', label);
}

// header (current live text)
rep(`<div class="meta">点词标记 → 收进该文章的生词本（右侧跟随浮动）· 单击即入本 · 点词条朗读 · × 删除 · <button onclick="location.href='review/'" id="reviewBtn" style="padding:2px 8px;font-size:.78rem">复习</button> <button onclick="togglePhraseMode()" id="phraseBtn" style="padding:2px 8px;font-size:.78rem">+ 词组</button> <button onclick="syncNow()" id="syncBtn" style="padding:2px 8px;font-size:.78rem">同步</button> <button onclick="exportVocab()" style="padding:2px 8px;font-size:.78rem">导出</button> <button onclick="drawScene()" id="sceneBtn" style="padding:2px 8px;font-size:.78rem">🎲 场景</button> <button onclick="publishNext()" id="pubBtn" style="padding:2px 8px;font-size:.78rem">🔄 更新下一批</button> <button onclick="location.href='training.html'" style="padding:2px 8px;font-size:.78rem">🎯 训练</button> <button onclick="toggleOld()" id="oldBtn" style="padding:2px 8px;font-size:.78rem">看往期</button> <button onclick="showToken()" style="padding:2px 8px;font-size:.78rem">🔑</button></div><div id="app"></div>`,
  `<div class="meta">点词标记 → 收进该文章的生词本 · 再点已选词可撤销 · 连续选中多个词 = 词组，不连续 = 句子片段 · <button onclick="location.href='review/'" id="reviewBtn" style="padding:2px 8px;font-size:.78rem">复习</button> <button onclick="location.href='training.html'" style="padding:2px 8px;font-size:.78rem">🎯 训练</button> <button onclick="toggleOld()" id="oldBtn" style="padding:2px 8px;font-size:.78rem;display:none">看往期</button></div><div id="pubbar"></div><div id="app"></div>`,
  'header');

// article meta key buttons
rep('<button onclick="toggleKeyMode(${i},this)" style="padding:1px 8px;font-size:.72rem">✏️ 画重点句</button><button onclick="showKeyChips(${i},this)" style="padding:1px 8px;font-size:.72rem">⭐ 重点片段</button></div>',
  '</div>',
  'article meta');

// vpanel phrase button
rep('<button onclick="togglePhraseMode(${i})" style="padding:1px 6px;font-size:.7rem">+ 词组</button></h4>',
  '</h4>',
  'vpanel phrase button');

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
fs.writeFileSync(dir + '/index.html', s);
console.log('html fixes written');
