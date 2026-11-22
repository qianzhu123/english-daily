// Phase 12 vm test: training page full check
const fs = require('fs');
const vm = require('vm');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const els = {};
function getEl(id) {
  if (!els[id]) els[id] = {
    id, innerHTML: '', textContent: '', style: {}, dataset: {}, value: '',
    classList: { add() {}, remove() {}, contains() { return false; } },
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
    querySelector: () => null, querySelectorAll: () => [],
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
const script = [...fs.readFileSync(dir + '/training.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
try {
  vm.runInContext(script, vm.createContext(sb));
  console.log('VM LOAD OK');
  vm.runInContext('render();', vm.createContext(sb));
  const html = vm.runInContext('document.getElementById("content").innerHTML', vm.createContext(sb));
  console.log('11-21 renders:', html.includes('2026-11-21'));
  console.log('new quiz content (allotments):', html.includes('Municipal allotments'));
  console.log('no bakery passage:', !html.includes('The bakery on the corner'));
  // answer flow still works
  vm.runInContext("pickOpt('2026-11-21',0,1); answerQuiz('2026-11-21',0);", vm.createContext(sb));
  console.log('quiz saved:', JSON.stringify(vm.runInContext("store.get('traintry')['2026-11-21#q0']", vm.createContext(sb))));
  // delTrainFrag defined
  console.log('delTrainFrag fn:', vm.runInContext('typeof delTrainFrag', vm.createContext(sb)));
  // fragments in sidebar: seed + renderVocabSide
  vm.runInContext("(function(){store.set('trainfrags',{'2026-11-21':[{sent:'Municipal allotments were introduced',day:'2026-11-23'}]});renderVocabSide()})()", vm.createContext(sb));
  const side = vm.runInContext('document.getElementById("vocaside-list").innerHTML', vm.createContext(sb));
  console.log('fragment in sidebar:', side.includes('⭐') && side.includes('Municipal allotments'));
  // delVocabSide clears marks
  vm.runInContext("(function(){store.set('vocab-train',{cat:{n:1}});renderVocabSide()})()", vm.createContext(sb));
  vm.runInContext("delVocabSide('cat')", vm.createContext(sb));
  console.log('delVocabSide removes:', !vm.runInContext("store.get('vocab-train')['cat']", vm.createContext(sb)));
} catch (e) {
  console.log('VM ERR:', e.message);
  process.exit(1);
}
