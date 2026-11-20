// Phase 3: full-page vm test of index.html after overhaul
const fs = require('fs');
const vm = require('vm');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();

const els = {};
function getEl(id) {
  if (!els[id]) els[id] = {
    id, innerHTML: '', textContent: '', style: {}, dataset: {}, classList: {
      add() {}, remove() {}, contains() { return false; }, toggle() {}
    },
    appendChild() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    addEventListener() {}, insertBefore() {}, parentNode: null, remove() {},
    getBoundingClientRect() { return { right: 0, top: 0, bottom: 0 }; }, offsetHeight: 100
  };
  return els[id];
}
const sb = {
  console, localStorage: (function(){const d={};return {getItem(k){return d[k]||null},setItem(k,v){d[k]=v},removeItem(k){delete d[k]}}})(),
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
sb.window = sb; sb.globalThis = sb;
sb.addEventListener = () => {};
let code = fs.readFileSync(dir + '/articles.js', 'utf8');
vm.runInContext(code, vm.createContext(sb));
const script = [...fs.readFileSync(dir + '/index.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
try {
  vm.runInContext(script, vm.createContext(sb));
  console.log('VM LOAD OK');
  vm.runInContext('render();renderPubbar();batchDoneState();', vm.createContext(sb));
  console.log('render+pubbar OK');
  const state = vm.runInContext("(function(){const act=A.filter(a=>!a.draft&&!a.archived);const db=store.get('doneread');act.forEach(a=>{db[a.title]={count:1,date:studyDay()}});store.set('doneread',db);return batchDoneState()})()", vm.createContext(sb));
  console.log('batchDoneState after marking all:', state);
  console.log(vm.runInContext("(function(){const act=A.filter(a=>!a.draft&&!a.archived);const db=store.get('doneread');return JSON.stringify({n:act.length,titles:act.map(a=>a.title),done:Object.keys(db)})})()", vm.createContext(sb)));
  vm.runInContext('renderPubbar();', vm.createContext(sb));
  const bar = vm.runInContext('document.getElementById("pubbar").innerHTML', vm.createContext(sb));
  console.log('pubbar has button:', bar.includes('更新文章'));
} catch (e) {
  console.log('VM ERR:', e.message);
  process.exit(1);
}
