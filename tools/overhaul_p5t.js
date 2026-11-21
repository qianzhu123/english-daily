// Phase 5 vm smoke test: training.html loads, renders, submit flow works
const fs = require('fs');
const vm = require('vm');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const els = {};
function getEl(id) {
  if (!els[id]) els[id] = {
    id, innerHTML: '', textContent: '', style: {}, dataset: {}, value: '',
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    appendChild() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    addEventListener() {}, insertBefore() {}, parentNode: null, remove() {}
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
  history: { pushState() {} }, requestAnimationFrame: (f) => f(), Math, Date, JSON, RegExp, Number, String, Object, Array, Promise, parseInt, parseFloat, encodeURIComponent, decodeURIComponent, btoa, atob, setTimeout, clearTimeout, Set, Map
};
sb.window = sb; sb.globalThis = sb; sb.addEventListener = () => {};
vm.runInContext(fs.readFileSync(dir + '/articles.js', 'utf8'), vm.createContext(sb));
const script = [...fs.readFileSync(dir + '/training.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
try {
  vm.runInContext(script, vm.createContext(sb));
  console.log('VM LOAD OK');
  vm.runInContext('render();', vm.createContext(sb));
  const html = vm.runInContext('document.getElementById("content").innerHTML', vm.createContext(sb));
  console.log('content has 提交:', html.includes('提交'));
  console.log('content has 原文全文:', html.includes('原文全文'));
  console.log('content has 关键词:', html.includes('关键词'));
  // submit flow
  vm.runInContext("pickOpt('2026-11-19',0,2);", vm.createContext(sb));
  vm.runInContext("answerQuiz('2026-11-19',0);", vm.createContext(sb));
  const saved = vm.runInContext("store.get('traintry')['2026-11-19#q0']", vm.createContext(sb));
  console.log('quiz saved:', JSON.stringify(saved));
  // calendar
  vm.runInContext('toggleTrainCal();renderCal();', vm.createContext(sb));
  const cal = vm.runInContext('document.getElementById("traincal").innerHTML', vm.createContext(sb));
  console.log('cal rendered:', cal.includes('训练记录'));
  // sidebar reads vocab-train
  vm.runInContext("localStorage.setItem('vocab-train', JSON.stringify({'flooded':{n:1}}))", vm.createContext(sb));
  vm.runInContext('renderVocabSide();', vm.createContext(sb));
  const side = vm.runInContext('document.getElementById("vocaside-list").innerHTML', vm.createContext(sb));
  console.log('sidebar shows flooded:', side.includes('flooded'));
  const pc=(html.match(/class=.passage./g)||[]).length;
  console.log('passage blocks rendered:', pc, '(expect 3 for 6 questions)');
  console.log('question count:', (html.match(/提交</g)||[]).length);
} catch (e) {
  console.log('VM ERR:', e.message);
  process.exit(1);
}
