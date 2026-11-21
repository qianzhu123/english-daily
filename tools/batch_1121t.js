// Batch 11-21 vm test: new articles visible, new training day first, PRETR works
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
function makeSb(pathname) {
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
    navigator: {}, location: { href: '', pathname, search: '' },
    history: { pushState() {} }, requestAnimationFrame: (f) => f(), Math, Date, JSON, RegExp, Number, String,
    Object, Array, Promise, parseInt, parseFloat, encodeURIComponent, decodeURIComponent, btoa, atob,
    setTimeout: (f) => f(), clearTimeout, Set, Map
  };
  sb.window = sb; sb.globalThis = sb; sb.addEventListener = () => {};
  return sb;
}

// 1. articles.js loads and last two articles are the 11-21 ones
const sb1 = makeSb('/english-daily/');
vm.runInContext(fs.readFileSync(dir + '/articles.js', 'utf8'), vm.createContext(sb1));
const last = vm.runInContext(`JSON.stringify(ARTICLES.slice(-2).map(a=>({t:a.title,d:a.date,draft:!!a.draft,arch:!!a.archived})))`, vm.createContext(sb1));
console.log('last two articles:', last);

// 2. reading page: render shows new articles, PRETR key matches
const script1 = [...fs.readFileSync(dir + '/index.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
vm.runInContext(script1, vm.createContext(sb1));
console.log('reading PRETR has bakery:', vm.runInContext(`Object.keys(PRETR).some(k=>k.includes('Bakery'))`, vm.createContext(sb1)));
console.log('reading MANUAL bakery:', vm.runInContext(`MANUAL['bakery']||'MISSING'`, vm.createContext(sb1)));
const content1 = vm.runInContext(`document.getElementById('app').innerHTML`, vm.createContext(sb1));
console.log('reading page shows 11-21 articles:', content1.includes('Bakery That Closed') && content1.includes('Password That Was Too Strong'));

// 3. training page: first TRAIN day is 11-21, quiz renders with its own passages
const sb2 = makeSb('/english-daily/');
vm.runInContext(fs.readFileSync(dir + '/articles.js', 'utf8'), vm.createContext(sb2));
const script2 = [...fs.readFileSync(dir + '/training.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
vm.runInContext(script2, vm.createContext(sb2));
console.log('TRAIN[0] day:', vm.runInContext(`TRAIN[0].day`, vm.createContext(sb2)));
console.log('TRAIN[0] quiz count:', vm.runInContext(`TRAIN[0].quiz.length`, vm.createContext(sb2)));
vm.runInContext(`render();`, vm.createContext(sb2));
const html2 = vm.runInContext(`document.getElementById('content').innerHTML`, vm.createContext(sb2));
console.log('training shows 11-21:', html2.includes('2026-11-21'));
console.log('training shows对比结构 brief:', html2.includes('对比'));
// distinct passages in 11-21 quiz = 3
const pg = (html2.match(/class="passage"/g) || []).length;
console.log('passage blocks:', pg, '(expect >=3 for 4 groups)');
// submit flow on new day
vm.runInContext(`pickOpt('2026-11-21',0,2); answerQuiz('2026-11-21',0);`, vm.createContext(sb2));
console.log('new day quiz answer saved:', JSON.stringify(vm.runInContext(`store.get('traintry')['2026-11-21#q0']`, vm.createContext(sb2))));

// 4. review page: MANUAL has bakery
const sb3 = makeSb('/english-daily/review/');
vm.runInContext(fs.readFileSync(dir + '/articles.js', 'utf8'), vm.createContext(sb3));
const script3 = [...fs.readFileSync(dir + '/review/index.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).pop();
vm.runInContext(script3, vm.createContext(sb3));
console.log('review MANUAL bakery:', vm.runInContext(`MANUAL['bakery']||'MISSING'`, vm.createContext(sb3)));
console.log('review MANUAL scarcity:', vm.runInContext(`MANUAL['scarcity']||'MISSING'`, vm.createContext(sb3)));
