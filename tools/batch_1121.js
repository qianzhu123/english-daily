// Batch 11-21: two new B1+ articles + one new training day.
// Appends articles to articles.js (before final "];"), adds PRETR translations
// for both, extends MANUAL on both pages with words from the new articles,
// and inserts a new TRAIN day into training.html.
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();

// ---------- 1. new articles ----------
const art1 = `,
  {
    title: "The Bakery That Closed at Noon (B1+)",
    date: "2026-11-21",
    level: "B1+ · 小店经营/稀缺的价值",
    sentences: [
      "The bakery on the corner opened at six and sold out by eleven, and the owner never once considered baking more.",
      "When the trays were empty, she turned the sign around, made herself a coffee, and sat by the window reading the paper as if the queue outside were somebody else's problem.",
      "Regulars learned the arithmetic: arrive at nine and you choose; arrive at ten and you hope; arrive at eleven and you study the empty shelves like a museum of what had been.",
      "A newcomer once suggested she could double the oven space, hire a second baker, stay open until the evening rush — she listened politely, the way one listens to a tourist giving directions.",
      "\\u0022If I bake more,\\u0022 she said, \\u0022then bread becomes something you pick up on the way home, and I become somewhere you stop, not somewhere you come to.\\u0022",
      "The chain supermarket across the street baked around the clock and sold bread that stayed soft for a week, and nobody walked across the street for it twice.",
      "Scarcity, it turns out, is not always a failure of planning; sometimes it is the plan, and the closed sign at noon is the loudest advertisement in the neighborhood."
    ],
    notes: [
      "as if the queue outside were somebody else's problem —— as if + 过去式虚拟：门外排队与她无关",
      "arrive at nine and you choose —— 祈使+and = 条件句：早到就有得选（排比三层递减）",
      "study the empty shelves like a museum of what had been —— 明喻+what 名词性从句：空货架成了遗迹展",
      "the way one listens to a tourist giving directions —— the way 后省略从句连词：本地人听游客指路（反讽）",
      "somewhere you stop, not somewhere you come to —— 定语从句对仗：顺路停靠 vs 专程前往",
      "bread that stayed soft for a week —— that 定语从句+拟物：工业面包的\\u0022优点\\u0022恰是它的失败",
      "Scarcity, it turns out, is not always a failure of planning; sometimes it is the plan —— 插入语+分号对仗：稀缺不是失误而是策略（点题金句）"
    ]
  }
,
  {
    title: "The Password That Was Too Strong (B1+)",
    date: "2026-11-21",
    level: "B1+ · 数字生活/安全与遗忘",
    sentences: [
      "The password had been created on a rainy Tuesday with the confidence of a man who would never forget anything: sixteen characters, three symbols, a number hidden in the middle like a criminal in a crowd.",
      "For two years it opened everything — the insurance portal, the tax office, the folder where the family photos lived — and then one morning in March, it opened nothing.",
      "He tried the capital letter first, then the lowercase version, then the version with the year at the end, the way one knocks on a door louder and louder hoping the house itself has changed.",
      "The recovery questions were worse than the lock: his first school turned out to have three spellings in his own memory, and his mother's birthplace depended on which border the year had drawn.",
      "The reset email arrived within a minute, cheerful and instant, and he understood that the system had never cared who he was — only that he could still receive mail at an address he had controlled since university.",
      "Security, the screen seemed to say, is a theater performed for both sides: the company proves it is serious, the user proves he is careful, and nobody asks whether the play has to be this long.",
      "He now keeps his passwords in a small notebook by the kettle, which every security website calls madness and which has, so far, never once locked him out."
    ],
    notes: [
      "with the confidence of a man who would never forget anything —— who 定语从句+反讽：创建时的自信为后文埋雷",
      "a number hidden in the middle like a criminal in a crowd —— 过去分词后置修饰+明喻：数字藏在密码里像人群中的逃犯",
      "the way one knocks on a door louder and louder —— the way 方式状语从句：越敲越响，房子却不会变",
      "his mother's birthplace depended on which border the year had drawn —— which 宾语从句：国界随年份变，\\u0022标准答案\\u0022本身不可靠",
      "the system had never cared who he was —— who 宾语从句+省略 that：系统只认邮箱不认人",
      "a theater performed for both sides —— 过去分词作后置定语：安全是演给双方看的戏（隐喻贯穿末段）",
      "which every security website calls madness and which has never once locked him out —— 双 which 非限制性从句对仗：权威眼中的蠢办法 vs 两年零失误（点题）"
    ]
  }
`;

// ---------- 2. new training day (independent content, NOT from reading batch) ----------
// Quiz passages are self-contained IELTS-style texts; answers paraphrase (no
// word-copy fill-ins, user rule). Mixed types: TFNG + MC + matching.
const trainDay = `{
  day:'2026-11-21',
  title:'雅思阅读实战 · 独立长文混合题型（对比结构与目的题专练）',
  brief:'题型轮换日：判断+单选+句子结尾匹配。本日重点：作者常用「多数人怎么做 vs 主角怎么做」的对比立意，正确答案往往在对比的落点（后半句），不在前半句的铺垫里；目的题问的是「为什么写这句」，不是「这句说了什么」。',
  daily:[
    {en:'If I bake more, then bread becomes something you pick up on the way home.',zh:'如果我多烤，面包就变成回家顺路随手买的东西'},
    {en:'Scarcity is not always a failure of planning; sometimes it is the plan.',zh:'稀缺不总是规划失误；有时它本身就是策略'},
    {en:'Security is a theater performed for both sides.',zh:'安全是一场演给双方看的戏'}
  ],
  items:[],
  quiz:[
    {passage:"The bakery on the corner opened at six and sold out by eleven. The owner never baked more than her fixed number of trays, and when the last loaf went, she turned the sign around and read her newspaper. A supermarket across the street baked around the clock; its bread stayed soft for a week, and its shelves were never empty. Yet regulars crossed the road to her shop and accepted the risk of finding nothing.",
     type:'判断 TRUE/FALSE/NOT GIVEN',
     q:'The owner refuses to bake more because she cannot afford a second baker.',
     opts:['TRUE','FALSE','NOT GIVEN'],ans:2,
     why:'她拒绝多烤的理由是「多烤会让面包变成顺路货」（后面单选可见），成本原因原文完全没提——NOT GIVEN。别把「她没扩产」脑补成「她扩不起」'},
    {passage:"The bakery on the corner opened at six and sold out by eleven. The owner never baked more than her fixed number of trays, and when the last loaf went, she turned the sign around and read her newspaper. A supermarket across the street baked around the clock; its bread stayed soft for a week, and its shelves were never empty. Yet regulars crossed the road to her shop and accepted the risk of finding nothing.",
     type:'单选（Multiple Choice）',
     q:'What point does the passage make with the supermarket contrast?',
     opts:['Constant production does not guarantee customer loyalty','Supermarket bread is of lower nutritional quality','The owner could learn efficiency from the supermarket','Customers prefer shops with longer opening hours'],ans:0,
     why:'对比的落点在后半句：超市全年无休却没人回头第二次（walked across the street for it twice 的改写），说明产能≠忠诚（A）。B 的「营养」无中生有；C/D 与作者立场相反'},
    {passage:"A password created with sixteen characters and three symbols opened everything for two years, then one morning opened nothing. The recovery questions asked for a first school with three possible spellings and a birthplace that depended on which border the year had drawn. The reset email arrived within a minute, and the account was restored to whoever controlled that mailbox.",
     type:'单选（Multiple Choice）',
     q:'Why does the writer describe the recovery questions in detail?',
     opts:['To show that memory-based verification can itself be unreliable','To prove that the user answered the questions dishonestly','To suggest the questions should be written in several languages','To explain why the reset email was slow to arrive'],ans:0,
     why:'目的题：写「三个拼法/国界随年份变」是为了说明——依赖记忆的校验问题本身就没有稳定答案（A，unreliable 是 depend on which border 的同义概括）。B 说谎、C 多语言、D 慢，原文都不支持'},
    {passage:"A password created with sixteen characters and three symbols opened everything for two years, then one morning opened nothing. The recovery questions asked for a first school with three possible spellings and a birthplace that depended on which border the year had drawn. The reset email arrived within a minute, and the account was restored to whoever controlled that mailbox.",
     type:'判断 TRUE/FALSE/NOT GIVEN',
     q:'The account was restored without the user proving his identity.',
     opts:['TRUE','FALSE','NOT GIVEN'],ans:0,
     why:'原文说系统只关心「谁控制着那个邮箱」（restored to whoever controlled that mailbox），收得到邮件=拿回账号，身份核验形同虚设——TRUE。这是 no-proving 与 only-mailbox 的同义改写'},
    {passage:"The owner explained: if she baked more, bread would become something picked up on the way home, and her shop would become somewhere people stopped by rather than somewhere people came to. The closed sign at noon, she believed, was itself a kind of advertisement.",
     type:'句子结尾匹配（Sentence Ending）',
     q:'The owner treats the closed sign as…',
     opts:['evidence that her shop has become ordinary','a signal that the product is worth planning around','proof that customer demand has collapsed','an accident she plans to correct next year'],ans:1,
     why:'她的逻辑：限时售罄=值得专程规划的东西，午休关门本身就是广告（B，worth planning around 是 the plan / come to 的改写）。A「变得平庸」、C「需求崩塌」方向相反；D「明年修正」原文没说'},
    {passage:"The owner explained: if she baked more, bread would become something picked up on the way home, and her shop would become somewhere people stopped by rather than somewhere people came to. The closed sign at noon, she believed, was itself a kind of advertisement.",
     type:'判断 TRUE/FALSE/NOT GIVEN',
     q:'The owner believes scarcity protects the special status of her shop.',
     opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
     why:'雅思判断题的 FALSE 用得狠：她不是「相信稀缺保护地位」，她是**主动把稀缺当成经营策略**（scarcity IS the plan），believe 一词弱化了她的主动性——语义强度不对等即 FALSE。注意：这题考的是「主动策略」vs「被动相信」的边界'}
  ]
},`;

// ---------- apply ----------
// 1. articles.js: insert before final "];"
let aj = fs.readFileSync(dir + '/articles.js', 'utf8');
if (!aj.includes('The Bakery That Closed at Noon')) {
  const tail = aj.lastIndexOf('];');
  aj = aj.slice(0, tail) + art1 + '\n' + aj.slice(tail);
  fs.writeFileSync(dir + '/articles.js', aj);
  console.log('ok: articles.js + 2 articles');
} else console.log('skip: articles already present');

// 2. training.html: insert new day as FIRST entry of TRAIN (render defaults to first)
let th = fs.readFileSync(dir + '/training.html', 'utf8');
if (!th.includes("day:'2026-11-21'")) {
  const t0 = th.indexOf('const TRAIN=[') + 'const TRAIN=['.length;
  th = th.slice(0, t0) + '\n' + trainDay + th.slice(t0);
  fs.writeFileSync(dir + '/training.html', th);
  console.log('ok: training.html + 11-21 day');
} else console.log('skip: training day present');

// 3. PRETR: add both articles' full translations to index.html
let ix = fs.readFileSync(dir + '/index.html', 'utf8');
if (!ix.includes('"The Bakery That Closed at Noon"')) {
  const pretrAdd = `  "The Bakery That Closed at Noon": [
"The bakery on the corner opened at six and sold out by eleven, and the owner never once considered baking more.",
"街角的面包店六点开门，十一点就卖光了，老板娘从没考虑过多烤一点。",
"When the trays were empty, she turned the sign around, made herself a coffee, and sat by the window reading the paper as if the queue outside were somebody else's problem.",
"托盘空了，她就翻转招牌，给自己泡杯咖啡，坐在窗边读报纸，仿佛门外的队伍是别人的麻烦。",
"Regulars learned the arithmetic: arrive at nine and you choose; arrive at ten and you hope; arrive at eleven and you study the empty shelves like a museum of what had been.",
"熟客们摸清了这道算术：九点到，你来挑；十点到，你碰运气；十一点到，你就只能端详空货架，像参观一座「曾经有过什么」的博物馆。",
"A newcomer once suggested she could double the oven space, hire a second baker, stay open until the evening rush — she listened politely, the way one listens to a tourist giving directions.",
"有个新来的曾建议她把烤箱扩容一倍、雇第二个面包师、营业到晚间高峰——她礼貌地听着，那种听法就像听一个游客给你指路。",
"\\"If I bake more,\\" she said, \\"then bread becomes something you pick up on the way home, and I become somewhere you stop, not somewhere you come to.\\"",
"「如果我多烤，」她说，「面包就变成回家路上顺手买的东西，而我就变成一个你顺路停靠的地方，不再是你专程要来的地方。」",
"The chain supermarket across the street baked around the clock and sold bread that stayed soft for a week, and nobody walked across the street for it twice.",
"街对面的连锁超市昼夜不停地烤，卖那种能软上一个星期的面包，而没有人会为它第二次穿过马路。",
"Scarcity, it turns out, is not always a failure of planning; sometimes it is the plan, and the closed sign at noon is the loudest advertisement in the neighborhood.",
"稀缺，原来并不总是规划的失误；有时它就是策略本身，而正午翻转的「营业结束」牌，是这片街区最响亮的广告。"
],
  "The Password That Was Too Strong": [
"The password had been created on a rainy Tuesday with the confidence of a man who would never forget anything: sixteen characters, three symbols, a number hidden in the middle like a criminal in a crowd.",
"这个密码诞生于一个下雨的星期二，带着一个自信绝不会忘记任何事的人的全部信心：十六个字符、三个符号、一个藏在中间的数字，像人群中的一名逃犯。",
"For two years it opened everything — the insurance portal, the tax office, the folder where the family photos lived — and then one morning in March, it opened nothing.",
"两年来它打开一切——保险门户、税务局、全家福照片所在的文件夹——然后三月的一个早晨，它什么都打不开了。",
"He tried the capital letter first, then the lowercase version, then the version with the year at the end, the way one knocks on a door louder and louder hoping the house itself has changed.",
"他先试大写开头，再试全小写版本，再试把年份加在末尾的版本，就像一个人越敲越响地敲门，盼着房子本身已经变了。",
"The recovery questions were worse than the lock: his first school turned out to have three spellings in his own memory, and his mother's birthplace depended on which border the year had drawn.",
"找回问题比锁还难：他的第一所学校在他自己的记忆里就有三种拼法，而他母亲的出生地取决于那一年画的是哪条国界线。",
"The reset email arrived within a minute, cheerful and instant, and he understood that the system had never cared who he was — only that he could still receive mail at an address he had controlled since university.",
"重置邮件一分钟内就到了，欢快而即时，他这才明白系统从没在乎过他是谁——只在乎他在一个大学起就掌控的地址上还能收到邮件。",
"Security, the screen seemed to say, is a theater performed for both sides: the company proves it is serious, the user proves he is careful, and nobody asks whether the play has to be this long.",
"屏幕仿佛在说，安全是一场演给双方看的戏：公司证明自己认真，用户证明自己小心，却没人问这出戏是否非得这么长。",
"He now keeps his passwords in a small notebook by the kettle, which every security website calls madness and which has, so far, never once locked him out.",
"他现在把密码记在烧水壶旁的小本子上，所有安全网站都管这叫疯狂，而这个本子迄今为止一次都没把他锁在门外。"
],
`;
  const anchor = 'const PRETR={\n';
  if (!ix.includes(anchor)) { console.log('MISS: PRETR anchor'); process.exit(1); }
  ix = ix.replace(anchor, anchor + pretrAdd);
  fs.writeFileSync(dir + '/index.html', ix);
  console.log('ok: index.html PRETR + 2');
}

// 4. review page PRETR too (review page has its own PRETR? check)
const rv = fs.readFileSync(dir + '/review/index.html', 'utf8');
console.log('review PRETR present:', rv.includes('const PRETR'));

// 5. MANUAL: seed words from new articles not already in MANUAL (index page).
//    We collect words, filter stoplist, then append definitions we write by hand below.
const needDefs = {
  "bakery":"名词：面包店",
  "loaf":"名词：一条（面包）",
  "tray":"名词：托盘",
  "arithmetic":"名词：算术；计算",
  "regular":"名词：常客；（形容词）规律的",
  "newcomer":"名词：新来的人",
  "queue":"名词：队伍；（动词）排队",
  "museum":"名词：博物馆",
  "oven":"名词：烤箱",
  "baker":"名词：面包师",
  "rush":"名词：高峰期；（动词）冲、赶",
  "politely":"副词：礼貌地",
  "tourist":"名词：游客",
  "supermarket":"名词：超市",
  "chain":"名词：连锁店；链条",
  "scarcity":"名词：稀缺、匮乏",
  "advertisement":"名词：广告",
  "neighborhood":"名词：街区、邻里",
  "confidence":"名词：信心",
  "symbol":"名词：符号",
  "criminal":"名词：罪犯",
  "insurance":"名词：保险",
  "portal":"名词：门户网站",
  "lowercase":"名词/形容词：小写（的）",
  "recovery":"名词：找回、恢复",
  "spelling":"名词：拼法、拼写",
  "birthplace":"名词：出生地",
  "border":"名词：边界、国界",
  "reset":"名词/动词：重置",
  "mailbox":"名词：邮箱",
  "theater":"名词：戏院；戏剧（比喻：做戏）",
  "kettle":"名词：烧水壶",
  "madness":"名词：疯狂",
  "locked":"形容词：锁定的（lock 的过去式/过去分词）",
  "sold":"动词：卖（sell 的过去式/过去分词）",
  "baked":"动词：烤（bake 的过去式/过去分词）",
  "considered":"动词：考虑（consider 的过去式）",
  "loyalty":"名词：忠诚（本题干词）",
  "nutritional":"形容词：营养的",
  "efficiency":"名词：效率",
  "verification":"名词：核验、验证",
  "dishonestly":"副词：不诚实地",
  "restored":"动词：恢复、找回（restore 的过去式）",
  "identity":"名词：身份",
  "scarcity,":"名词：稀缺、匮乏",
};
function countEntries(src){const m0=src.indexOf('const MANUAL=');let d=0,j=src.indexOf('{',m0);
  for(;j<src.length;j++){if(src[j]==='{')d++;else if(src[j]==='}'){d--;if(d===0)break}}
  const body=src.slice(src.indexOf('{',m0)+1,j);
  return (body.match(/^\s*"/gm)||[]).length}
function addToManual(src, defs, label){
  const m0=src.indexOf('const MANUAL=');
  const open=src.indexOf('{',m0);
  let d=0,j=open;
  for(;j<src.length;j++){if(src[j]==='{')d++;else if(src[j]==='}'){d--;if(d===0)break}}
  const before=src.slice(0,j), after=src.slice(j);
  // insert new lines before the closing brace; find last complete entry's comma
  let insertAt=j;
  // ensure previous non-space char is a comma
  let k=j-1; while(k>=0 && /\s/.test(src[k])) k--;
  let head=src.slice(0,j), tail=src.slice(j);
  if(src[k]!==','){head=head.slice(0,k+1)+','+head.slice(k+1);}
  const add='\n'+Object.entries(defs).map(([k2,v2])=>'"'+k2+'":"'+v2+'"').join(',\n');
  return head+add+tail;
}
if (!ix.includes('"bakery":')) {
  const before=countEntries(ix);
  ix=addToManual(ix,needDefs);
  fs.writeFileSync(dir + '/index.html', ix);
  console.log('ok: index MANUAL', before, '->', countEntries(ix));
}
const rx = fs.readFileSync(dir + '/review/index.html', 'utf8');
if (!rx.includes('"bakery":')) {
  const before=countEntries(rx);
  const rx2=addToManual(rx,needDefs);
  fs.writeFileSync(dir + '/review/index.html', rx2);
  console.log('ok: review MANUAL', before, '->', countEntries(rx2));
}

// 6. cache-bust bump: articles.js?v=1121b on all pages
[['/index.html','articles.js?v='],['/review/index.html','articles.js?v=']].forEach(([f,anchor])=>{
  const p=dir+f; let x=fs.readFileSync(p,'utf8');
  x=x.replace(/articles\.js\?v=[0-9a-z]+/g,'articles.js?v=1121b');
  fs.writeFileSync(p,x)});
console.log('ok: cache-bust 1121b');

// 7. syntax checks
const chkScript=(f,label)=>{
  const x=fs.readFileSync(dir+f,'utf8');
  const m=[...x.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  try{m.forEach((mm,i)=>new Function(mm[1]));console.log('SYNTAX OK:',label)}catch(e){console.log('SYNTAX ERR '+label+':',e.message);process.exit(1)}
};
chkScript('/index.html','index');
chkScript('/review/index.html','review');
chkScript('/training.html','training');
try{new Function(fs.readFileSync(dir+'/articles.js','utf8'));console.log('SYNTAX OK: articles.js')}catch(e){console.log('SYNTAX ERR articles.js:',e.message);process.exit(1)}
console.log('batch 11-21 done');
