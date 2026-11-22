// Phase 12: rewrite TRAIN quiz content for days that derive from reading
// articles (11-21, 11-19, 11-14, 11-12, 11-10 measured >90% word-copy).
// All new passages are fully independent IELTS-style texts on topics that do
// not appear in the reading batch (user 11-23 hard rule).
// Strategy: for each day, replace d.quiz wholesale; keep daily/items as-is
// except 11-21 whose daily quotes ALSO came from the reading articles.
const fs = require('fs');
const dir = fs.readFileSync('D:/english_repo.txt', 'utf8').trim();
const path = dir + '/training.html';
let s = fs.readFileSync(path, 'utf8');

// locate day boundaries inside the TRAIN array by "day:'YYYY-MM-DD'" markers
function daySpan(day) {
  const start = s.indexOf("day:'" + day + "'");
  if (start < 0) return null;
  // day object ends at the next "\n  {\n" at same level or the array end; find
  // the next "day:'" marker or "];" and back up to the preceding "},"
  let next = s.indexOf("\nday:'", start);
  const arrEnd = s.indexOf('];', start);
  let end = next > 0 ? next : arrEnd;
  // trim back to the last "},\n" or "{" boundary before end
  const lastBrace = s.lastIndexOf('},', end);
  return { start, end: Math.min(lastBrace + 1, arrEnd) };
}

// ---------- new quiz content, fully independent topics ----------
const QUIZ_1121 = [
 {passage:"Municipal allotments — small plots of land rented to residents for growing vegetables — were introduced in many European cities during wartime shortages. A century later, waiting lists in some districts exceed ten years. The gardeners are retired teachers, nurses, and bus drivers rather than farmers, and most say they come for the company as much as the harvest. One association has begun assigning each newcomer a mentor for the first season.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'The allotments were created because the cities wanted to profit from renting land.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'原文说自留地是「战时短缺时期」推出的——目的是粮食供应，不是赚钱（FALSE）。租金是否盈利原文只字未提，但「因短缺而设」与「为盈利而设」矛盾'},
 {passage:"Municipal allotments — small plots of land rented to residents for growing vegetables — were introduced in many European cities during wartime shortages. A century later, waiting lists in some districts exceed ten years. The gardeners are retired teachers, nurses, and bus drivers rather than farmers, and most say they come for the company as much as the harvest. One association has begun assigning each newcomer a mentor for the first season.",
  type:'单选（Multiple Choice）',
  q:'What does the passage suggest about the gardeners\' motives?',
  opts:['Social contact matters to them as much as produce','They hope the plots will raise the value of their homes','Most of them previously worked in agriculture','They joined mainly to avoid paying for vegetables'],ans:0,
  why:'原文明说「为陪伴而来不亚于为收成而来」（the company as much as the harvest 的同义改写=A）。B 房价、C 农业背景（原文恰说是退休教师/护士/司机）、D 省菜钱均无据'},
 {passage:"Sleep researchers distinguish between sleep quantity and sleep regularity — going to bed and waking at consistent times. A large study found regularity predicted long-term health outcomes better than total hours slept. The authors caution that their participants were all shift workers, so the finding may not transfer to people with conventional schedules.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'The study included participants with a range of work schedules.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'作者自己警告「参与者全是轮班工人」（all shift workers）——不是多种作息都有（FALSE）。题目考的是 not transfer 提示的样本局限'},
 {passage:"Sleep researchers distinguish between sleep quantity and sleep regularity — going to bed and waking at consistent times. A large study found regularity predicted long-term health outcomes better than total hours slept. The authors caution that their participants were all shift workers, so the finding may not transfer to people with conventional schedules.",
  type:'单选（Multiple Choice）',
  q:'Why do the authors mention the participants\' occupation?',
  opts:['To limit the strength of their own conclusion','To explain why shift work damages health','To recommend that everyone adopt fixed bedtimes','To criticise earlier studies on sleep duration'],ans:0,
  why:'作者提职业是为了自我设限：样本特殊，结论未必适用于普通作息（limit the strength 的改写）。B 因果、D 批前人、C 建议均非目的'},
 {passage:"The museum\'s audio guide was recorded by a single narrator whose voice visitors either adored or could not tolerate. Attendance figures showed no difference between the two groups\' visiting patterns, and the gift shop sold the narrator\'s memoir alongside the standard souvenirs.",
  type:'单选（Multiple Choice）',
  q:'What can be inferred from the attendance figures?',
  opts:['Reactions to the narrator did not affect how people visited','Visitors who disliked the voice stayed away entirely','The narrator\'s memoir outsold the souvenirs','Liking the voice made visits longer'],ans:0,
  why:'「两组参观模式没有差异」= 好恶不影响参观行为（A）。B 相反；C 只说有卖没说卖得更好；D 时长原文没提'},
 {passage:"The museum\'s audio guide was recorded by a single narrator whose voice visitors either adored or could not tolerate. Attendance figures showed no difference between the two groups\' visiting patterns, and the gift shop sold the narrator\'s memoir alongside the standard souvenirs.",
  type:'句子结尾匹配（Sentence Ending）',
  q:'The narrator\'s voice divided visitors…',
  opts:['but changed nothing about their behaviour','and the museum replaced it within a year','so the memoir was withdrawn from sale','although most visitors never noticed it'],ans:0,
  why:'好恶分明但参观模式无差=声音分裂了评价却没改变行为（A）。B/C/D 原文都没有'}
];

const QUIZ_1119 = [
 {passage:"Lighthouses were funded for decades by shipping levies collected at ports rather than by governments. Economists later used them as a textbook example of a public good, though historians point out that the early systems were often run privately and that enforcement of payment was surprisingly effective.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'Governments paid for the earliest lighthouses.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'原文说资金来自「港口征收的航运税而非政府」（levies... rather than by governments）——FALSE'},
 {passage:"Lighthouses were funded for decades by shipping levies collected at ports rather than by governments. Economists later used them as a textbook example of a public good, though historians point out that the early systems were often run privately and that enforcement of payment was surprisingly effective.",
  type:'单选（Multiple Choice）',
  q:'What tension does the passage describe?',
  opts:['An economic theory conflicts with the historical record','Historians refuse to study public goods','Shipping companies supported government control','Levies were impossible to collect at ports'],ans:0,
  why:'经济学家拿灯塔当「公共品」教科书案例，史学家指出早期实为私营且收费有效——理论与史料的张力（A）。B/C/D 无中生有'},
 {passage:"In elite chess, players below the top ten are said to play for second place. A statistician tested this by comparing game outcomes before and after a famous champion\'s retirement and found no measurable difference in how the remaining players scored against each other.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'The statistician\'s finding supported the popular claim.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'流行说法是「前十以外只能争第二」，而统计结果是「棋手间胜负没有可测差异」——发现不支持说法（FALSE）'},
 {passage:"In elite chess, players below the top ten are said to play for second place. A statistician tested this by comparing game outcomes before and after a famous champion\'s retirement and found no measurable difference in how the remaining players scored against each other.",
  type:'单选（Multiple Choice）',
  q:'The statistician\'s method relied on…',
  opts:['comparing results across two periods','interviewing the retired champion','replaying games with computers','surveying players\' confidence levels'],ans:0,
  why:'方法=对比退役前后两个时期的比赛结果（A）。B/C/D 都是没出现的方法'},
 {passage:"City cycling maps traditionally mark streets by traffic speed alone. A new project overlays surface quality, collected by phones mounted on handlebars whose sensors log vibration. Streets with smooth pavement but heavy buses now appear twice: once in each ranking.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'The new map ranks streets by two separate criteria.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:0,
  why:'「同一条街在两个排名里各出现一次」（twice: once in each ranking）= 两套标准并行（TRUE）'},
 {passage:"City cycling maps traditionally mark streets by traffic speed alone. A new project overlays surface quality, collected by phones mounted on handlebars whose sensors log vibration. Streets with smooth pavement but heavy buses now appear twice: once in each ranking.",
  type:'单选（Multiple Choice）',
  q:'The vibration data is collected by…',
  opts:['devices attached to bicycles','sensors installed under the road','municipal survey vehicles','cyclists\' wristwatches'],ans:0,
  why:'手机装在车把上记录震动（handlebars 的改写=A）。B 埋路面、C 市政车、D 手表均无'}
];

const QUIZ_1114 = [
 {passage:"Rooftop beehives have appeared on hotels, offices, and restaurants in many cities. Critics argue they mainly improve the image of the buildings\' owners, because urban honey output is small and wild pollinators — bees, hoverflies, moths — benefit little from extra competition. Supporters answer that the hives pay for themselves in publicity alone.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'Urban rooftop hives produce a large share of the honey sold in these cities.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'批评者说「城市蜂蜜产量很小」（output is small）——与「占大头」矛盾（FALSE）'},
 {passage:"Rooftop beehives have appeared on hotels, offices, and restaurants in many cities. Critics argue they mainly improve the image of the buildings\' owners, because urban honey output is small and wild pollinators — bees, hoverflies, moths — benefit little from extra competition. Supporters answer that the hives pay for themselves in publicity alone.",
  type:'单选（Multiple Choice）',
  q:'What is the critics\' main objection?',
  opts:['The hives serve branding more than ecology','The honey is unsafe to eat','Hives cost more than they return','Hotel guests complain about stings'],ans:0,
  why:'批评者认为蜂箱主要是给业主形象加分、对野生传粉者没帮助=服务品牌而非生态（A）。B 安全、C 经济账（那是支持者的说法反用）、D 客诉均无'},
 {passage:"A railway preserved its steam services by charging heritage fares: tickets priced far above normal routes, sold months ahead, with passengers often dressed in period costume. The company says without this pricing the locomotives would have been scrapped decades ago.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'Heritage tickets cost more than ordinary rail tickets.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:0,
  why:'「票价远高于正常线路」（priced far above normal routes）= TRUE'},
 {passage:"A railway preserved its steam services by charging heritage fares: tickets priced far above normal routes, sold months ahead, with passengers often dressed in period costume. The company says without this pricing the locomotives would have been scrapped decades ago.",
  type:'单选（Multiple Choice）',
  q:'According to the company, the heritage fares exist in order to…',
  opts:['keep the old trains running','cover the cost of costumes','discourage casual travellers','match government price rules'],ans:0,
  why:'公司自述：没有这种定价机车几十年前就报废了=目的是让老火车活下去（A）。B/D 无据；C 涨价或许劝退人但非所述目的'},
 {passage:"Bilingual street signs in one region were first installed for practical reasons: postal workers and emergency crews made fewer errors with duplicate labels. Only later did the signs become a symbol in political debates, and several councils report that replacing damaged signs now takes longer because of the extra approval steps.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'Political disputes made the maintenance of signs slower.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:0,
  why:'「更换受损标志牌因额外审批步骤变慢」（takes longer because of the extra approval steps）= TRUE'},
 {passage:"Bilingual street signs in one region were first installed for practical reasons: postal workers and emergency crews made fewer errors with duplicate labels. Only later did the signs become a symbol in political debates, and several councils report that replacing damaged signs now takes longer because of the extra approval steps.",
  type:'单选（Multiple Choice）',
  q:'The original purpose of the dual labels was to…',
  opts:['reduce mistakes by services','attract political attention','promote the local language','comply with a new law'],ans:0,
  why:'「邮政和急救人员出错更少」（fewer errors 的改写=A）。B 是后来的效果、C/D 无据'}
];

const QUIZ_1112 = [
 {passage:"Supermarkets in one country have begun selling \"imperfect\" produce at a discount: bent carrots, two-legged carrots being the classic example. Farm groups report that acceptance of the scheme varies by crop, with consumers accepting odd-shaped carrots far more readily than bruised apples.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'Consumers accept irregular apples as willingly as irregular carrots.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'「歪胡萝卜比碰伤苹果更容易被接受」（far more readily）——两者接受度不等（FALSE）'},
 {passage:"Supermarkets in one country have begun selling \"imperfect\" produce at a discount: bent carrots, two-legged carrots being the classic example. Farm groups report that acceptance of the scheme varies by crop, with consumers accepting odd-shaped carrots far more readily than bruised apples.",
  type:'单选（Multiple Choice）',
  q:'The passage suggests the scheme\'s success depends on…',
  opts:['which vegetable or fruit is involved','how large the discount is','the time of day the produce is displayed','the reputation of the supermarket'],ans:0,
  why:'「接受度因作物而异」（varies by crop 的改写=A）。折扣幅度/时段/商誉原文都没说'},
 {passage:"Old harbour cranes left standing after the docks closed have become a problem of affection rather than engineering: the steel is sound, but every proposal to reuse them — viewing platforms, climbing walls, a restaurant in the operator\'s cabin — has failed on safety certification written for modern structures.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'The cranes cannot be reused because their steel has corroded.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'「钢材完好」（the steel is sound）——问题出在安全认证按现代标准写，不是腐蚀（FALSE）'},
 {passage:"Old harbour cranes left standing after the docks closed have become a problem of affection rather than engineering: the steel is sound, but every proposal to reuse them — viewing platforms, climbing walls, a restaurant in the operator\'s cabin — has failed on safety certification written for modern structures.",
  type:'单选（Multiple Choice）',
  q:'The reuse proposals fail because of…',
  opts:['regulations designed for newer buildings','public opposition to change','the cost of repairing the steel','a shortage of interested operators'],ans:0,
  why:'「为现代结构写的安全认证」（certification written for modern structures 的改写=A）。B/C/D 无据'},
 {passage:"A tide gauge on a northern pier has recorded sea level since 1887. The logbooks survive, but the early entries were kept by the harbourmaster in shorthand that only two living researchers can read, and one of them is retiring this spring.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'All of the gauge\'s early records have been transcribed.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'早期记录是只有两位研究者能读的速记（only two living researchers can read）——谈不上全部转写完成（FALSE）'},
 {passage:"A tide gauge on a northern pier has recorded sea level since 1887. The logbooks survive, but the early entries were kept by the harbourmaster in shorthand that only two living researchers can read, and one of them is retiring this spring.",
  type:'句子结尾匹配（Sentence Ending）',
  q:'The logbooks are at risk because…',
  opts:['so few people can decipher them','the pier is scheduled for demolition','the paper has been damaged by seawater','the harbourmaster destroyed the key'],ans:0,
  why:'速记只有两人能读、其中一位即将退休=能解读的人太少（A）。B 拆码头、C 海水损毁、D 销毁密钥均无'}
];

const QUIZ_1110 = [
 {passage:"Night trains returned to several European routes after decades away. Operators found the constraint was not demand but rolling stock: sleeper carriages cannot be built quickly, and refurbished ones from closed lines sell within weeks of being listed.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'Demand for night trains was the main obstacle to their return.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'原文说「制约不是需求而是车厢」（not demand but rolling stock）——与题目矛盾（FALSE）'},
 {passage:"Night trains returned to several European routes after decades away. Operators found the constraint was not demand but rolling stock: sleeper carriages cannot be built quickly, and refurbished ones from closed lines sell within weeks of being listed.",
  type:'单选（Multiple Choice）',
  q:'What limits the expansion of night trains?',
  opts:['A shortage of usable carriages','Slow ticket sales','Government route bans','Competition from airlines'],ans:0,
  why:'卧铺车厢造得慢、翻新的一上架几周就卖光=可用车厢短缺（A）。B 需求没问题；C/D 无'},
 {passage:"The tradition of throwing worn-out shoes onto overhead wires has no agreed origin. Folklore links it to military initiations; police in some cities read it as gang territory marks; one anthropologist spent two years mapping shoe pairs and concluded that most clusters simply sit where the local shop sells the cheapest laces.",
  type:'单选（Multiple Choice）',
  q:'The anthropologist\'s conclusion differs from the other explanations because it points to…',
  opts:['ordinary shopping behaviour','military rituals','territorial signalling','a shoe-recycling scheme'],ans:0,
  why:'人类学家的解释=「鞋挂最多的地方恰好是卖便宜鞋带的店」=普通消费行为（A），与帮派/军队的符号解释都不同'},
 {passage:"The tradition of throwing worn-out shoes onto overhead wires has no agreed origin. Folklore links it to military initiations; police in some cities read it as gang territory marks; one anthropologist spent two years mapping shoe pairs and concluded that most clusters simply sit where the local shop sells the cheapest laces.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'Police and folklorists agree on why shoes are thrown onto wires.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'民俗说军队仪式、警察读成帮派标记——两者解释不同（FALSE）'},
 {passage:"A bridge library in the Netherlands lends books from a converted lock keeper\'s cottage. Readers pay no fee but must write one sentence in the margin log about any book they return. The founder says the marginalia are the real collection: some visitors come to read the notes rather than the novels.",
  type:'判断 TRUE/FALSE/NOT GIVEN',
  q:'Borrowers must pay a small fee to use the bridge library.',
  opts:['TRUE','FALSE','NOT GIVEN'],ans:1,
  why:'「读者不付费」（pay no fee），代价是还书时写一句边注——FALSE'},
 {passage:"A bridge library in the Netherlands lends books from a converted lock keeper\'s cottage. Readers pay no fee but must write one sentence in the margin log about any book they return. The founder says the marginalia are the real collection: some visitors come to read the notes rather than the novels.",
  type:'单选（Multiple Choice）',
  q:'Some visitors come to the library mainly to…',
  opts:['read other readers\' notes','borrow the founder\'s favourite novels','see the converted cottage','attend reading evenings'],ans:0,
  why:'「有人来读批注而不是小说」（read the notes rather than the novels 的改写=A）'}
];

// 11-21 daily quotes also came from reading articles -> replace
const DAILY_1121 = [
    {en:'The gardeners come for the company as much as the harvest.',zh:'园艺者来这儿是为陪伴，不亚于为收成'},
    {en:'Regularity predicted health outcomes better than total hours slept.',zh:'作息规律比总睡眠时长更能预测健康'},
    {en:'The finding may not transfer to people with conventional schedules.',zh:'该结论未必适用于作息正常的人'}
  ];

function replaceDay(day, quizArr, daily) {
  const start = s.indexOf("day:'" + day + "'");
  if (start < 0) { console.log('MISS day', day); return; }
  // find the quiz:[ ... ] block within this day object (up to next day marker)
  let qStart = s.indexOf('quiz:[', start);
  const nextDay = s.indexOf("day:'", start + 10);
  const arrEnd = s.indexOf('];', start);
  let qEnd = s.indexOf(']', qStart);
  if (nextDay > 0 && nextDay < qEnd) { console.log('quiz bounds cross day for', day); return; }
  const quizSrc = 'quiz:' + JSON.stringify(quizArr, null, 1).replace(/\n/g, '\n   ');
  s = s.slice(0, qStart) + quizSrc + s.slice(qEnd + 1);
  fs.writeFileSync(path, s);
  console.log('ok: quiz replaced', day);
  if (daily) {
    const dStart = s.indexOf('daily:[', s.indexOf("day:'" + day + "'"));
    const dEnd = s.indexOf(']', dStart);
    const dailySrc = 'daily:' + JSON.stringify(daily, null, 1);
    s = s.slice(0, dStart) + dailySrc + s.slice(dEnd + 1);
    fs.writeFileSync(path, s);
    console.log('ok: daily replaced', day);
  }
}

replaceDay('2026-11-21', QUIZ_1121, DAILY_1121);
replaceDay('2026-11-19', QUIZ_1119);
replaceDay('2026-11-14', QUIZ_1114);
replaceDay('2026-11-12', QUIZ_1112);
replaceDay('2026-11-10', QUIZ_1110);

// syntax check
const m = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)];
try { m.forEach(mm => new Function(mm[1])); console.log('SYNTAX OK'); }
catch (e) { console.log('SYNTAX ERR:', e.message); process.exit(1); }
console.log('phase12 done');
