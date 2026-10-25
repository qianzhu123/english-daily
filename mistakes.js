window.MISTAKES = [
  {
    date: "2026-10-22",
    scene: "点餐场景",
    items: [
      { wrong: "coke, please", right: "A Coke, please.", why: "可数名词单数不能裸奔，冠词洞第二次现身", kind: "冠词" },
      { wrong: "I want a beef", right: "I'll have the steak.", why: "点餐用 I'll have；beef 是物质不可数，菜品叫 steak", kind: "词性/搭配" },
      { wrong: "that medium rare", right: "medium rare（句尾直接修饰）", why: "熟度放句尾不需要 that", kind: "句式" },
      { wrong: "but you give me a fish", right: "but you brought me the salmon.", why: "过去的事用 brought；指名道姓说 the salmon", kind: "时态", resolved: true },
      { wrong: "Can I get the right?", right: "Could you bring me the right one?", why: "one 不能省", kind: "句式", resolved: true },
      { wrong: "Thanks for your server", right: "Thanks for the great service.", why: "server=人/服务器，service=服务（不可数）；10-26 回考仍拼成 servation，继续盯", kind: "词性/搭配" },
      { wrong: "Can I get a pay?", right: "Can I have the check, please?", why: "pay 是动词；账单=check（美）/bill（英）", kind: "词性/搭配", resolved: true }
    ]
  },
  {
    date: "2026-10-26",
    scene: "回考·点餐",
    items: [
      { wrong: "Could you brought me the right one?", right: "Could you bring me the right one?", why: "情态动词 can/could/will 后面永远接动词原形——brought 是过去式，跟在 could 后必错", kind: "句式" },
      { wrong: "servation", right: "service", why: "拼写错误；service 不可数，地道说法 Thanks for the great service", kind: "词性/搭配" }
    ]
  },
  {
    date: "2026-10-20",
    scene: "水平测试",
    items: [
      { wrong: "Exercise me", right: "Excuse me", why: "石化错误，出现两次，重点盯防", kind: "石化" },
      { wrong: "I was reserved", right: "I have a reservation under the name Li.", why: "别扭直译；地道说法一句顶三句", kind: "句式" },
      { wrong: "I order a beef noodles", right: "I ordered...", why: "过去的事用过去式——头号洞", kind: "时态" },
      { wrong: "you take me a chicken rice", right: "you brought me... / this isn't what I ordered", why: "take→bring 方向性动词", kind: "词性/搭配" },
      { wrong: "borrow you phone", right: "borrow your phone", why: "you/your 混淆", kind: "冠词" },
      { wrong: "take contact with", right: "get in touch with / call", why: "搭配错误", kind: "词性/搭配" },
      { wrong: "I feel bad", right: "I'm a bit panicked.", why: "表达慌张更精准的说法", kind: "句式" }
    ]
  }
];
