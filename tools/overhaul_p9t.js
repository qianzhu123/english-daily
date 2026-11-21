// Phase 9 vm test: word click -> vocab-train + sidebar; phrase/fragment selection; picked option CSS
const fs = require('fs');
const vm = require('vm');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const els = {};
function getEl(id) {
  if (!els[id]) els[id] = {
    id, innerHTML: '', textContent: '', style: {}, dataset: {}, value: '',
    className: '', _cls: new Set(),
    classList: {
      add(c) { this._set().add(c) }, remove(c) { this._set().delete(c) },
      contains(c) { return this._set().has(c) }, toggle(c) { this._set().has(c) ? this._set().delete(c) : this._set().add(c) },
      _set() { if (!el.__cls) el.__cls = new Set(); return el.__cls; }
    },
    appendChild() {}, querySelector() { return null; }, querySelectorAll() { return []; },
    addEventListener() {}, insertBefore() {}, parentNode: null, remove() {},
    nextSibling: null, parentElement: null
  };
  const el = els[id]; return el;
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
const script = [...fs.readFileSync(dir + '/training.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
try {
  vm.runInContext(script, vm.createContext(sb));
  console.log('VM LOAD OK');

  // 1. w2tok: word with punctuation becomes clickable <w>
  const tok = vm.runInContext(`w2tok('script, and')`, vm.createContext(sb));
  console.log('w2tok punctuation word clickable:', tok.includes('data-w="script"'), '|', tok.slice(0, 80));

  // 2. tClick new word -> vocab-train + sidebar refresh + translate attempted
  const w1 = vm.runInContext(`(function(){
    const el={dataset:{w:'flooded'},style:{},classList:{add(){},remove(){},contains(){return false}}};
    tClick('flooded',el);
    return JSON.stringify({marks:Object.keys(store.get('vocab-train')),side:document.getElementById('vocaside-list').innerHTML})})()`, vm.createContext(sb));
  console.log('tClick adds word:', w1.includes('flooded'));

  // 3. re-click marked word -> selection starts
  const sel = vm.runInContext(`(function(){
    let selCls=false;
    const el={dataset:{w:'flooded'},style:{},classList:{add(){selCls=true},remove(){},contains(){return false}}};
    tClick('flooded',el);
    const st=tsel?{key:tsel.key,words:tsel.words}:null;
    return JSON.stringify({st,toast:document.getElementById('toast').textContent})})()`, vm.createContext(sb));
  console.log('re-click starts selection:', sel.includes('"key":"flooded"'));

  // 4. phrase confirm: two consecutive words (simulate tsel with words list)
  vm.runInContext(`(function(){
    tsel={key:'flooded',words:['flooded','stretch'],wEl:{dataset:{w:'flooded'}},w1El:{dataset:{w:'flooded'}}};
    tConfirmPhrase();
    return JSON.stringify(Object.keys(store.get('vocab-train')))})()`, vm.createContext(sb));
  const ph = vm.runInContext(`store.get('vocab-train')['flooded stretch']?'yes':'no'`, vm.createContext(sb));
  console.log('phrase stored:', ph);

  // 5. picked option CSS: quizHtml renders picked class after pickOpt
  vm.runInContext(`pickOpt('2026-11-19',0,2);`, vm.createContext(sb));
  const html = vm.runInContext(`document.getElementById('content').innerHTML`, vm.createContext(sb));
  console.log('picked class rendered:', html.includes('picked'));

  // 6. CSS block present
  const page = fs.readFileSync(dir + '/training.html', 'utf8');
  console.log('CSS .opt.picked present:', page.includes('.opt.picked{'));
  console.log('CSS w.sel present:', page.includes('w.sel{'));
} catch (e) {
  console.log('VM ERR:', e.message);
  process.exit(1);
}
