// Phase 10 vm test: reading page — pmode phrase/frag flow, translation sync, vocab panel
const fs = require('fs');
const vm = require('vm');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const els = {};
function getEl(id) {
  if (!els[id]) els[id] = {
    id, innerHTML: '', textContent: '', style: {}, dataset: {}, value: '',
    className: '',
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    appendChild() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    addEventListener() {}, insertBefore() {}, parentNode: null, remove() {},
    after() {}, nextElementSibling: null, closest() { return null; }
  };
  return els[id];
}
const store = (function () { const d = {}; return { getItem(k) { return d[k] || null }, setItem(k, v) { d[k] = v }, removeItem(k) { delete d[k] } }; })();
const sb = {
  console, localStorage: store,
  fetch: async () => ({ ok: false, status: 0, json: async () => ({}) }),
  document: {
    getElementById: getEl,
    createElement: (t) => getEl('el_' + t + '_' + Math.random()),
    createTextNode: (x) => ({ nodeType: 3, textContent: x }),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {}, hidden: false, body: getEl('body')
  },
  window: {}, SpeechSynthesisUtterance: function () {}, speechSynthesis: { speak() {}, cancel() {}, getVoices() { return []; } },
  navigator: {}, location: { href: '', pathname: '/english-daily/', search: '' },
  history: { pushState() {} }, requestAnimationFrame: (f) => f(), Math, Date, JSON, RegExp, Number, String,
  Object, Array, Promise, parseInt, parseFloat, encodeURIComponent, decodeURIComponent, btoa, atob,
  setTimeout: (f) => f(), clearTimeout, Set, Map
};
sb.window = sb; sb.globalThis = sb; sb.addEventListener = () => {};
vm.runInContext(fs.readFileSync(dir + '/articles.js', 'utf8'), vm.createContext(sb));
const script = [...fs.readFileSync(dir + '/index.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
try {
  vm.runInContext(script, vm.createContext(sb));
  console.log('VM LOAD OK');

  // 1. no more selState / auto-fragment; pmode functions exist
  console.log('pmode exists:', vm.runInContext(`typeof pmode==='object'||pmode===null`, vm.createContext(sb)));
  console.log('phraseBtn exists:', vm.runInContext(`typeof phraseBtn`, vm.createContext(sb)) === 'function');

  // 2. phrase flow: phraseBtn -> two consecutive words -> phraseBtn confirm
  const w1 = { dataset: { w: 'opened', a: '40' }, classList: { add(c) { w1._c = (w1._c || new Set()); w1._c.add(c); }, remove() {}, contains() { return false; } } };
  const w2 = { dataset: { w: 'at', a: '40' }, classList: { add(c) { w2._c = (w2._c || new Set()); w2._c.add(c); }, remove() {}, contains() { return false; } } };
  vm.runInContext(`phraseBtn(40)`, vm.createContext(sb));
  vm.runInContext(`pmClick(${JSON.stringify(w1)},'opened')`, vm.createContext(sb));
  vm.runInContext(`pmClick(${JSON.stringify(w2)},'at')`, vm.createContext(sb));
  // confirm: simulate all words list — pmode.wEl is w2; the all-scan inside confirmPhrase uses marks join
  vm.runInContext(`phraseBtn(40)`, vm.createContext(sb)); // 2 words -> confirmPhrase
  const v = vm.runInContext(`store.get('vocab')`, vm.createContext(sb));
  console.log('phrase stored (opened at):', !!v['opened at']);

  // 3. non-consecutive in phrase mode -> rejected (no fragment auto-created)
  vm.runInContext(`phraseBtn(40);pmClick({dataset:{w:'bread',a:'40'},classList:{add(){},remove(){},contains(){return false}}},'bread')`, vm.createContext(sb));
  const toast1 = vm.runInContext(`document.getElementById('toast').textContent`, vm.createContext(sb));
  vm.runInContext(`pmClick({dataset:{w:'queue',a:'40'},classList:{add(){},remove(){},contains(){return false}}},'queue')`, vm.createContext(sb));
  const toast2 = vm.runInContext(`document.getElementById('toast').textContent`, vm.createContext(sb));
  console.log('non-consecutive rejected:', toast2.includes('不连续') || toast2.includes('句子'));

  // 4. vpanel header has 词组/句子 buttons, no 复习 button
  const page = fs.readFileSync(dir + '/index.html', 'utf8');
  console.log('header buttons present:', page.includes('phraseBtn(') && page.includes('fragBtn('));
  console.log('复习 button removed from vpanel:', !page.includes("onclick=\"location.href='review.html'\""));

  // 5. translation block: w2tokArt produces clickable <w> without onclick
  const tok = vm.runInContext(`w2tokArt('insurance,')`, vm.createContext(sb));
  console.log('w2tokArt clickable w:', tok.includes('data-w="insurance"') && !tok.includes('onclick'));

  // 6. fragments render in vocab panel rows
  vm.runInContext(`(function(){const db=ukDB();db[40]=db[40]||[];db[40].push({j:-1,sent:'The bakery on the corner opened',day:'2026-11-23'});store.set('userkeys',db)})()`, vm.createContext(sb));
  vm.runInContext(`renderVocab()`, vm.createContext(sb));
  // panel is per-article; check any vpanel ul has fragment row
  const panelHtml = Object.keys(els).filter(k => k.startsWith('vpanel-')).length;
  console.log('vpanels created:', panelHtml);
  const fragShown = Object.keys(els).some(k => k.startsWith('vpanel-') && els[k].innerHTML.includes('⭐'));
  console.log('fragment shown in panel:', fragShown);
} catch (e) {
  console.log('VM ERR:', e.message);
  process.exit(1);
}
