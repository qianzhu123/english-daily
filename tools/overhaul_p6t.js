// Phase 6 vm test: review page — regrouped day view, publish dates, marks in full article
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
  navigator: {}, location: { href: '', pathname: '/english-daily/review/', search: '' },
  history: { pushState() {} }, requestAnimationFrame: (f) => f(), Math, Date, JSON, RegExp, Number, String, Object, Array, Promise, parseInt, parseFloat, encodeURIComponent, decodeURIComponent, btoa, atob, setTimeout: (f) => f(), clearTimeout, Set, Map
};
sb.window = sb; sb.globalThis = sb; sb.addEventListener = () => {};
vm.runInContext(fs.readFileSync(dir + '/articles.js', 'utf8'), vm.createContext(sb));
const script = [...fs.readFileSync(dir + '/review/index.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
try {
  vm.runInContext(script, vm.createContext(sb));
  console.log('VM LOAD OK');
  // seed: word marked on 11-20 for article published 11-19; a phrase; a fragment; a grammar
  vm.runInContext(`(function(){
    const v={};
    v['meter']={n:1,day:'2026-11-20',art:(ART.findIndex(a=>a.title.includes('Meter'))),seq:1};
    v['flat fee']={n:1,day:'2026-11-20',art:(ART.findIndex(a=>a.title.includes('Meter'))),seq:2};
    store.set('vocab',v);
    const ai=ART.findIndex(a=>a.title.includes('Meter'));
    const db={};db[ai]=[{j:0,sent:ART[ai].sentences[0].split(/\\s+/).slice(0,5).join(' '),day:'2026-11-20'}];
    store.set('userkeys',db);
    const g={};g['The Meter That Ran Kindly (B1+)#0']={text:'test gram',date:'2026-11-20',title:'The Meter That Ran Kindly (B1+)'};
    store.set('grammar',g);
    const done={};done['The Meter That Ran Kindly (B1+)']={count:1,date:'2026-11-20'};
    store.set('doneread',done);
  })()`, vm.createContext(sb));
  vm.runInContext("marks=store.get('vocab')", vm.createContext(sb));
  const dbJson = vm.runInContext('JSON.stringify(dayDB())', vm.createContext(sb));
  const db = JSON.parse(dbJson);
  console.log('dayDB keys:', Object.keys(db).join(','));
  console.log('raw:', vm.runInContext('JSON.stringify({w:Object.entries(dayDB()).map(([k,v])=>({k,words:v.words,byArt:v.byArt}))})', vm.createContext(sb)));
  console.log('11-19 has words:', db['2026-11-19'] && db['2026-11-19'].words.join(','));
  console.log('11-19 has frags:', db['2026-11-19'] && db['2026-11-19'].frags.length);
  // render day view
  vm.runInContext("gotoDay('2026-11-19');", vm.createContext(sb));
  const html = vm.runInContext('document.getElementById("main").innerHTML', vm.createContext(sb));
  console.log('has article group head:', html.includes('The Meter That Ran Kindly'));
  console.log('has 词组 section:', html.includes('词组'));
  console.log('has 重点片段:', html.includes('重点片段'));
  console.log('has 语法点:', html.includes('语法点'));
  console.log('has 完整文章:', html.includes('完整文章'));
  console.log('article has on-highlight:', html.includes('class="on"'));
  console.log('article has fragon:', html.includes('fragon'));
} catch (e) {
  console.log('VM ERR:', e.message);
  process.exit(1);
}
