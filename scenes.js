// 场景池：每次随机抽一个场景开练。user 已学过的公式句会自然复现。
window.SCENES = [
  {
    id: "directions",
    name: "问路",
    brief: "你在陌生城市迷路了，想找一家药店（pharmacy）。我是路边路人。用上：Excuse me, could you tell me how to get to...? / go straight / turn left at... / opposite the bank",
    goals: ["礼貌搭话 Excuse me", "间接问句 Could you tell me how to get to...", "听懂方位指令并复述确认 So, straight then left at the lights?"],
    vocab: ["intersection", "traffic lights", "opposite", "block", "landmark"]
  },
  {
    id: "restaurant",
    name: "餐厅点餐+上错菜",
    brief: "你走进一家西餐厅点牛排（要 medium rare），我是服务员。上菜后我上错了——你可能要用到万能句。",
    goals: ["I'll have the steak, medium rare", "万能句 I ordered X, but you brought me Y. Could you bring me the right one?", "结账 Can I have the check, please?"],
    vocab: ["medium rare", "appetizer", "the check", "service"]
  },
  {
    id: "hotel",
    name: "酒店入住+房间问题",
    brief: "你深夜到酒店办入住（订过房），我是前台。办完后你发现房间空调坏了，要打电话给我投诉。",
    goals: ["I have a reservation under the name Li", "Could you send someone to fix the air conditioning?", "要求换房 Could I switch to another room?"],
    vocab: ["reservation", "check in", "front desk", "air conditioning"]
  },
  {
    id: "airport",
    name: "机场值机+航班延误",
    brief: "你在机场柜台办值机，我是地勤。你的航班显示屏上显示 DELAYED，你要问我详情和改签选项。",
    goals: ["Is the flight on time?", "What's the reason for the delay?", "改签 Could you rebook me on the next flight?"],
    vocab: ["boarding pass", "delayed", "gate", "rebook"]
  },
  {
    id: "shopping",
    name: "购物退换货",
    brief: "你在店里买的衬衫回家发现有瑕疵（a stain），拿回来退货，我是店员。",
    goals: ["I'd like to return this shirt — there's a stain on it", "Can I get a refund or exchange?", "出示凭证 Here's the receipt"],
    vocab: ["refund", "exchange", "receipt", "defect"]
  }
];
