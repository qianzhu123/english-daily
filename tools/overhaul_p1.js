// Phase 1: reading page (index.html) UI overhaul
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
let s = fs.readFileSync(dir + '/index.html', 'utf8');
let fails = [];
function rep(oldStr, newStr, label) {
  if (!s.includes(oldStr)) { fails.push(label); return; }
  s = s.replace(oldStr, newStr);
  console.log('ok:', label);
}

// 1a. header: only 复习 + 训练; 看往期 hidden (kept for API); pubbar container for global 更新文章 button
rep(`<div class="meta">点词标记 → 收进该文章的生词本（右侧跟随浮动）· 单击即入本 · 点词条朗读 · × 删除 · <button onclick="location.href='review/'" id="reviewBtn" style="padding:2px 8px;font-size:.78rem">复习</button> <button onclick="togglePhraseMode()" id="phraseBtn" style="padding:2px 8px;font-size:.78rem">+ 词组</button> <button onclick="syncNow()" id="syncBtn" style="padding:2px 8px;font-size:.78rem">同步</button> <button onclick="exportVocab()" style="padding:2px 8px;font-size:.78rem">导出</button> <button onclick="drawScene()" id="sceneBtn" style="padding:2px 8px;font-size:.78rem">🎲 场景</button> <button onclick="publishNext()" id="pubBtn" style="padding:2px 8px;font-size:.78rem">🔄 更新下一批</button> <button onclick="location.href='training.html'" style="padding:2px 8px;font-size:.78rem">🎯 训练</button> <button onclick="toggleOld()" id="oldBtn" style="padding:2px 8px;font-size:.78rem">看往期</button> <button onclick="showToken()" style="padding:2px 8px;font-size:.78rem">🔑</button></div><div id="app"></div>`,
  `<div class="meta">点词标记 → 收进该文章的生词本 · 再点已选词可撤销 · 连续选中多个词 = 词组，不连续 = 句子片段 · <button onclick="location.href='review/'" id="reviewBtn" style="padding:2px 8px;font-size:.78rem">复习</button> <button onclick="location.href='training.html'" style="padding:2px 8px;font-size:.78rem">🎯 训练</button> <button onclick="toggleOld()" id="oldBtn" style="padding:2px 8px;font-size:.78rem;display:none">看往期</button></div><div id="pubbar"></div><div id="app"></div>`,
  'header');

// 1b. article meta: remove 画重点句/重点片段 buttons
rep(`读完了</button><button onclick="playArticle(${i},this)" style="padding:1px 8px;font-size:.72rem">▶ 整篇朗读</button><button onclick="toggleArticleTr(${i},this)" style="padding:1px 8px;font-size:.72rem">整篇翻译</button><button onclick="toggleKeyMode(${i},this)" style="padding:1px 8px;font-size:.72rem">✏️ 画重点句</button><button onclick="showKeyChips(${i},this)" style="padding:1px 8px;font-size:.72rem">⭐ 重点片段</button></div>`,
  `读完了</button><button onclick="playArticle(${i},this)" style="padding:1px 8px;font-size:.72rem">▶ 整篇朗读</button><button onclick="toggleArticleTr(${i},this)" style="padding:1px 8px;font-size:.72rem">整篇翻译</button></div>`,
  'article meta');

if (fails.length) { console.log('FAILED:', fails); process.exit(1); }
fs.writeFileSync(dir + '/index.html', s);
console.log('phase1 written');
