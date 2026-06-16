import type {
  AssessmentLayer,
  AssessmentQuestion,
  DimensionKey,
  QuestionOption,
  QuestionType,
  ScoringEffect
} from "./types";

const option = (value: string, label: string, effect: ScoringEffect): QuestionOption => ({
  value,
  label,
  effect
});

const q = (
  id: string,
  layer: AssessmentLayer,
  dimension: DimensionKey,
  type: Exclude<QuestionType, "openText">,
  title: string,
  options: QuestionOption[],
  scoring: DimensionKey[]
): AssessmentQuestion => ({
  id,
  layer,
  dimension,
  type,
  title,
  required: true,
  options,
  scoring
});

const open = (
  id: string,
  layer: AssessmentLayer,
  dimension: DimensionKey,
  title: string
): AssessmentQuestion => ({
  id,
  layer,
  dimension,
  type: "openText",
  title,
  required: true,
  options: [],
  scoring: []
});

const scale = (
  id: string,
  layer: AssessmentLayer,
  dimension: DimensionKey,
  title: string,
  low: ScoringEffect,
  high: ScoringEffect,
  labels = ["1 很不像我", "2 不太像", "3 看情况", "4 比较像", "5 很像我"],
  mid: ScoringEffect = { uncertaintyTolerance: 3 }
) =>
  q(
    id,
    layer,
    dimension,
    "scale",
    title,
    [
      option("1", labels[0], low),
      option("2", labels[1], low),
      option("3", labels[2], mid),
      option("4", labels[3], high),
      option("5", labels[4], high)
    ],
    [dimension]
  );

export const questionBank: AssessmentQuestion[] = [
  q("SF01", "selfFoundation", "expression", "singleChoice", "一段高强度工作或学习后，你最自然的恢复方式是？", [
    option("A", "独处、睡觉、整理空间", { autonomyNeed: 8 }),
    option("B", "找人聊天或出门活动", { expression: 8 }),
    option("C", "先独处再找喜欢的人连接", { autonomyNeed: 5, expression: 4 }),
    option("D", "换个新鲜事情转移状态", { exploration: 8, freedom: 4 })
  ], ["autonomyNeed", "expression", "exploration"]),
  q("SF02", "selfFoundation", "expression", "singleChoice", "到一个新环境里，你通常怎么进入状态？", [
    option("A", "先观察，不急着融入", { autonomyNeed: 6, uncertaintyTolerance: 4 }),
    option("B", "主动认识人，快速建立连接", { expression: 9 }),
    option("C", "找一两个安全的人熟起来", { securityNeed: 6, expression: 3 }),
    option("D", "先完成事情，再慢慢社交", { planning: 7 })
  ], ["autonomyNeed", "expression", "securityNeed", "planning"]),
  scale("SF03", "selfFoundation", "emotionalStability", "情绪上来之后，我通常能在一天内回到比较稳定的状态。", { securityNeed: 5, emotionalStability: -5 }, { emotionalStability: 8 }, undefined, { securityNeed: 3 }),
  q("SF04", "selfFoundation", "emotionalStability", "singleChoice", "压力很大时，你最容易变成哪种状态？", [
    option("A", "立刻解决问题", { planning: 7, repairAbility: 4 }),
    option("B", "找人说出来", { expression: 7, securityNeed: 4 }),
    option("C", "消失一会儿自己缓", { autonomyNeed: 8 }),
    option("D", "对亲近的人没耐心", { securityNeed: 5, emotionalStability: -4 })
  ], ["planning", "expression", "autonomyNeed", "securityNeed"]),
  scale("SF05", "selfFoundation", "planning", "我喜欢对生活有计划，即使计划之后会调整。", { freedom: 5, exploration: 4 }, { planning: 9, stability: 4 }, ["1 很不像我", "2 不太像", "3 中间", "4 比较像", "5 很像我"]),
  q("SF06", "selfFoundation", "uncertaintyTolerance", "singleChoice", "当重要计划被临时打乱，你更可能怎么反应？", [
    option("A", "马上重排方案", { planning: 8 }),
    option("B", "先烦一下但能调整", { uncertaintyTolerance: 5 }),
    option("C", "明显受影响，需要安抚", { stability: 5, securityNeed: 5 }),
    option("D", "觉得也许会有新机会", { exploration: 8, freedom: 4 })
  ], ["planning", "uncertaintyTolerance", "stability", "exploration"]),
  q("SF07", "selfFoundation", "planning", "singleChoice", "做重要决定时，你最依赖什么？", [
    option("A", "事实、数据和长期影响", { planning: 8 }),
    option("B", "内心感受和直觉", { expression: 5, freedom: 5 }),
    option("C", "重要的人给我的反馈", { securityNeed: 5, expression: 4 }),
    option("D", "先试一点，再看反馈", { exploration: 6, uncertaintyTolerance: 5 })
  ], ["planning", "expression", "securityNeed", "exploration"]),
  scale("SF08", "selfFoundation", "expression", "我能比较自然地表达喜欢、不满和需求。", { expression: -5, securityNeed: 5 }, { expression: 8, repairAbility: 5 }),
  q("SF09", "selfFoundation", "securityNeed", "singleChoice", "低落时，你更希望亲近的人怎么陪你？", [
    option("A", "安静陪着，别追问", { securityNeed: 5, stability: 3 }),
    option("B", "听我说完，先别讲道理", { expression: 7, securityNeed: 5 }),
    option("C", "帮我分析解决办法", { planning: 7, repairAbility: 5 }),
    option("D", "给我空间，我自己缓", { autonomyNeed: 8 })
  ], ["securityNeed", "expression", "planning", "autonomyNeed"]),
  scale("SF10", "selfFoundation", "securityNeed", "别人的评价或态度变化，会比较明显影响我对自己的感觉。", { autonomyNeed: 5, emotionalStability: 4 }, { securityNeed: 8 }),
  q("SF11", "selfFoundation", "growth", "ranking", "选出你现在最想守住的 5 样东西，并按重要程度排序。", [
    option("freedom", "自由", { freedom: 8 }),
    option("stability", "稳定", { stability: 8 }),
    option("growth", "成长", { growth: 8 }),
    option("understood", "被理解", { securityNeed: 6, expression: 4 }),
    option("income", "收入上升", { growth: 5, realityAlignment: 5 }),
    option("life_quality", "生活质量", { stability: 4, freedom: 4 }),
    option("friends", "朋友关系", { expression: 6 }),
    option("family", "家庭安心", { familyBoundary: 5, stability: 4 }),
    option("exploration", "探索体验", { exploration: 8 })
  ], ["freedom", "stability", "growth", "securityNeed", "exploration"]),
  open("SFO01", "selfFoundation", "autonomyNeed", "讲一个最近你没有伪装、比较真实地做自己的时刻。"),
  open("SFO02", "selfFoundation", "emotionalStability", "最近一次你情绪明显波动，是因为什么？你后来怎么恢复的？"),
  open("SFO03", "selfFoundation", "securityNeed", "如果身边的人只能更理解你一件事，你希望是什么？"),

  q("VR01", "valuesScript", "growth", "singleChoice", "处在奥德赛时期的现在，你最想把人生往哪个方向推？", [
    option("A", "稳定上升", { growth: 8, stability: 5 }),
    option("B", "自由探索", { freedom: 9, exploration: 6 }),
    option("C", "建立亲密归属", { securityNeed: 7, commitmentNeed: 4 }),
    option("D", "先把自己养好", { emotionalStability: 6, stability: 3 })
  ], ["growth", "freedom", "securityNeed", "stability"]),
  q("VR02", "valuesScript", "growth", "singleChoice", "你更接近哪种「过得好」的定义？", [
    option("A", "持续成长，有更好的选择权", { growth: 9 }),
    option("B", "内心安稳，生活可控", { stability: 8 }),
    option("C", "有爱、有连接、有人同行", { securityNeed: 7, expression: 4 }),
    option("D", "体验丰富，不被单一路径困住", { freedom: 8, exploration: 6 })
  ], ["growth", "stability", "securityNeed", "freedom"]),
  q("VR03", "valuesScript", "growth", "ranking", "未来三年，你最想先顾好的 3 件事是什么？请排序。", [
    option("career", "事业成长", { growth: 8 }),
    option("emotion", "情绪稳定", { emotionalStability: 6, stability: 4 }),
    option("relationship", "亲密关系", { commitmentNeed: 6, securityNeed: 4 }),
    option("wealth", "财富积累", { realityAlignment: 7, stability: 4 }),
    option("city", "城市/生活方式探索", { freedom: 6, exploration: 5 }),
    option("family", "家庭安心", { familyBoundary: 6, stability: 4 }),
    option("health", "身体健康", { stability: 5 })
  ], ["growth", "stability", "commitmentNeed", "realityAlignment"]),
  q("VR04", "valuesScript", "uncertaintyTolerance", "singleChoice", "你更相信哪句话？", [
    option("A", "人主要靠长期努力改变处境", { growth: 7, planning: 5 }),
    option("B", "选择和环境比努力更重要", { planning: 4, realityAlignment: 5 }),
    option("C", "运气很重要，所以要保持弹性", { uncertaintyTolerance: 7 }),
    option("D", "人生没有标准答案，适合自己最重要", { freedom: 7, autonomyNeed: 4 })
  ], ["growth", "planning", "uncertaintyTolerance", "freedom"]),
  q("VR05", "valuesScript", "familyBoundary", "singleChoice", "你觉得长期关系能走下去，最底层靠什么？", [
    option("A", "信任和善意", { stability: 5, partnerSteadiness: 4 }),
    option("B", "规则和边界", { familyBoundary: 8, autonomyNeed: 4 }),
    option("C", "共同利益和目标", { growth: 6, realityAlignment: 5 }),
    option("D", "情绪连接和相互理解", { expression: 6, securityNeed: 5 })
  ], ["familyBoundary", "stability", "growth", "expression"]),
  q("VR06", "valuesScript", "stability", "singleChoice", "你的消费观更接近哪一种？", [
    option("A", "先存安全垫", { stability: 9, planning: 4 }),
    option("B", "该存也该体验", { stability: 4, exploration: 4 }),
    option("C", "花钱买体验和效率很值得", { freedom: 6, exploration: 5 }),
    option("D", "情绪不好时容易靠消费缓解", { securityNeed: 4, emotionalStability: -3 })
  ], ["stability", "planning", "freedom", "securityNeed"]),
  scale("VR07", "valuesScript", "realityAlignment", "进入长期关系后，我希望双方能比较早地谈钱。", { freedom: 4 }, { realityAlignment: 8, planning: 4 }),
  q("VR08", "valuesScript", "familyBoundary", "singleChoice", "你理想中的双方家庭关系是？", [
    option("A", "尊重但边界清楚", { familyBoundary: 9, autonomyNeed: 4 }),
    option("B", "亲近互助，经常来往", { stability: 6, commitmentNeed: 4 }),
    option("C", "具体看双方家庭", { uncertaintyTolerance: 5 }),
    option("D", "尽量少介入两个人的生活", { autonomyNeed: 7, familyBoundary: 4 })
  ], ["familyBoundary", "stability", "uncertaintyTolerance", "autonomyNeed"]),
  scale("VR09", "valuesScript", "familyBoundary", "亲密关系里，边界清楚比完全透明更重要。", { securityNeed: 5 }, { familyBoundary: 8, autonomyNeed: 4 }, ["1 很不同意", "2 不太同意", "3 看情况", "4 比较同意", "5 很同意"]),
  q("VR10", "valuesScript", "growth", "singleChoice", "事业上升和生活质量发生冲突时，你更倾向？", [
    option("A", "先抓上升窗口", { growth: 9, planning: 4 }),
    option("B", "尽量平衡", { stability: 5, uncertaintyTolerance: 3 }),
    option("C", "生活质量不能长期牺牲", { freedom: 7 }),
    option("D", "看这件事是否真的值得", { planning: 5, autonomyNeed: 4 })
  ], ["growth", "stability", "freedom", "planning"]),
  q("VR11", "valuesScript", "freedom", "singleChoice", "如果稳定和自由阶段性冲突，你会先选什么？", [
    option("A", "稳定，先把生活托住", { stability: 9 }),
    option("B", "自由，不想太早被固定", { freedom: 9, exploration: 4 }),
    option("C", "看当时的关系和机会质量", { uncertaintyTolerance: 5, repairAbility: 3 }),
    option("D", "我会需要很久才能确认", { securityNeed: 4, uncertaintyTolerance: 3 })
  ], ["stability", "freedom", "uncertaintyTolerance", "securityNeed"]),
  q("VR12", "valuesScript", "commitmentNeed", "singleChoice", "你更希望爱情在你人生里扮演什么角色？", [
    option("A", "让我更稳定", { stability: 7, commitmentNeed: 5 }),
    option("B", "让我更自由", { freedom: 8 }),
    option("C", "让我更有力量", { growth: 8 }),
    option("D", "让我更真实", { expression: 7 })
  ], ["stability", "freedom", "growth", "expression"]),
  open("VRO01", "valuesScript", "growth", "对现在的你来说，什么样的生活会让你觉得「这样挺好」？"),
  open("VRO02", "valuesScript", "stability", "你觉得钱在亲密关系里应该意味着什么？"),
  open("VRO03", "valuesScript", "familyBoundary", "你最希望未来伴侣怎样处理自己和原生家庭的关系？"),
  open("VRO04", "valuesScript", "uncertaintyTolerance", "如果未来三年你还在探索，理想中的伴侣可以怎样支持你？"),

  q("IM01", "intimacyMechanism", "securityNeed", "singleChoice", "关系里出现不确定时，你第一反应通常是？", [
    option("A", "想尽快问清楚", { securityNeed: 10, commitmentNeed: 5 }),
    option("B", "先观察一段时间", { uncertaintyTolerance: 6 }),
    option("C", "先抽离保护自己", { autonomyNeed: 9 }),
    option("D", "表面没事但心里反复想", { securityNeed: 8 })
  ], ["securityNeed", "commitmentNeed", "uncertaintyTolerance", "autonomyNeed"]),
  q("IM02", "intimacyMechanism", "commitmentNeed", "singleChoice", "什么最能让你相信一段关系是认真的？", [
    option("A", "明确身份和计划", { commitmentNeed: 10, securityNeed: 5 }),
    option("B", "日常稳定行动", { partnerSteadiness: 9, stability: 4 }),
    option("C", "深度交流和精神同频", { expression: 8, growth: 4 }),
    option("D", "对方愿意把我纳入生活", { commitmentNeed: 7, securityNeed: 4 })
  ], ["commitmentNeed", "securityNeed", "partnerSteadiness", "expression"]),
  scale("IM03", "intimacyMechanism", "securityNeed", "对方回复慢、态度冷一点，我容易开始猜测关系是不是变了。", { autonomyNeed: 4, emotionalStability: 4 }, { securityNeed: 9 }),
  scale("IM04", "intimacyMechanism", "autonomyNeed", "即使很爱一个人，我也需要保留明显的个人空间。", { securityNeed: 5 }, { autonomyNeed: 9, freedom: 4 }, ["1 很不像我", "2 不太像", "3 中间", "4 比较像", "5 很像我"]),
  q("IM05", "intimacyMechanism", "autonomyNeed", "singleChoice", "你理想中的联系频率更接近？", [
    option("A", "高频分享日常", { securityNeed: 8, commitmentNeed: 4 }),
    option("B", "稳定但不黏", { partnerSteadiness: 6, autonomyNeed: 3 }),
    option("C", "各忙各的，有事说", { autonomyNeed: 8 }),
    option("D", "热恋期高频，稳定后放松", { exploration: 4, uncertaintyTolerance: 4 })
  ], ["securityNeed", "partnerSteadiness", "autonomyNeed", "exploration"]),
  q("IM06", "intimacyMechanism", "securityNeed", "multipleChoice", "你最容易通过哪些方式感到被爱？最多选 3 项。", [
    option("heard", "被认真听见", { expression: 6, securityNeed: 5 }),
    option("companionship", "稳定陪伴", { securityNeed: 7, commitmentNeed: 4 }),
    option("action", "实际行动", { partnerSteadiness: 7 }),
    option("physical", "身体亲近", { expression: 4, exploration: 3 }),
    option("gift", "礼物惊喜", { expression: 4, exploration: 3 }),
    option("growth", "共同成长", { growth: 7 }),
    option("public", "公开承认关系", { commitmentNeed: 8 }),
    option("space", "尊重空间", { autonomyNeed: 8 })
  ], ["securityNeed", "expression", "partnerSteadiness", "growth", "autonomyNeed"]),
  q("IM07", "intimacyMechanism", "expression", "multipleChoice", "你通常怎样表达喜欢？最多选 3 项。", [
    option("share", "主动分享", { expression: 6 }),
    option("care", "照顾对方", { partnerSteadiness: 5, securityNeed: 4 }),
    option("surprise", "制造惊喜", { exploration: 5, expression: 4 }),
    option("support", "给建议和支持", { repairAbility: 6, planning: 4 }),
    option("company", "陪伴", { commitmentNeed: 5 }),
    option("physical", "身体接近", { expression: 4 }),
    option("future", "为未来做计划", { planning: 6, commitmentNeed: 5 }),
    option("freedom", "给对方自由", { autonomyNeed: 6 })
  ], ["expression", "repairAbility", "commitmentNeed", "autonomyNeed"]),
  q("IM08", "intimacyMechanism", "repairAbility", "singleChoice", "发生矛盾时，你更容易怎么开始？", [
    option("A", "立刻说清楚", { repairAbility: 9, expression: 4 }),
    option("B", "冷静后再谈", { repairAbility: 6, emotionalStability: 5 }),
    option("C", "先忍着，等对方发现", { securityNeed: 5, repairAbility: -3 }),
    option("D", "情绪上来会说重话", { expression: 4, emotionalStability: -5 })
  ], ["repairAbility", "expression", "emotionalStability", "securityNeed"]),
  scale("IM09", "intimacyMechanism", "repairAbility", "吵架之后，我愿意主动推动复盘和修复。", { autonomyNeed: 4, repairAbility: -4 }, { repairAbility: 9, commitmentNeed: 4 }),
  q("IM10", "intimacyMechanism", "repairAbility", "singleChoice", "如果对方说「你太敏感了」，你通常会？", [
    option("A", "继续解释自己的感受", { repairAbility: 6, expression: 5 }),
    option("B", "很受伤但不说了", { securityNeed: 5, autonomyNeed: 4 }),
    option("C", "反击或变冷", { autonomyNeed: 5, repairAbility: -4 }),
    option("D", "先暂停，之后再谈", { repairAbility: 6, emotionalStability: 4 })
  ], ["repairAbility", "expression", "securityNeed", "autonomyNeed"]),
  q("IM11", "intimacyMechanism", "commitmentNeed", "singleChoice", "你更容易被哪种关系氛围吸引？", [
    option("A", "明确、稳定、安心", { securityNeed: 8, commitmentNeed: 5 }),
    option("B", "有张力、有新鲜感", { exploration: 8 }),
    option("C", "能深聊、懂我", { expression: 8, securityNeed: 4 }),
    option("D", "一起成长、互相推着走", { growth: 8 })
  ], ["securityNeed", "exploration", "expression", "growth"]),
  q("IM12", "intimacyMechanism", "commitmentNeed", "ranking", "在关系里，哪些连接对你最重要？请排序前 5 项。", [
    option("company", "陪伴", { securityNeed: 6 }),
    option("attraction", "身体吸引", { exploration: 5 }),
    option("spiritual", "精神交流", { expression: 7 }),
    option("goal", "共同目标", { growth: 6 }),
    option("commitment", "稳定承诺", { commitmentNeed: 8 }),
    option("space", "自由空间", { autonomyNeed: 7 }),
    option("money", "经济合作", { realityAlignment: 6 }),
    option("emotion", "情绪价值", { securityNeed: 6, expression: 4 })
  ], ["securityNeed", "expression", "growth", "commitmentNeed", "autonomyNeed"]),
  q("IM13", "intimacyMechanism", "repairAbility", "multipleChoice", "你最不能接受哪几种冲突方式？最多选 3 项。", [
    option("silent", "冷暴力", { securityNeed: 8, commitmentNeed: 4 }),
    option("old_score", "翻旧账", { repairAbility: 5 }),
    option("humiliate", "吼叫羞辱", { securityNeed: 7 }),
    option("disappear", "失联", { securityNeed: 8 }),
    option("breakup_threat", "威胁分手", { commitmentNeed: 7 }),
    option("no_apology", "拒绝道歉", { repairAbility: 6 }),
    option("family_friend", "把朋友家人拉进来", { familyBoundary: 7 })
  ], ["securityNeed", "repairAbility", "commitmentNeed", "familyBoundary"]),
  open("IMO01", "intimacyMechanism", "securityNeed", "描述一个让你在关系里特别有安全感的时刻。"),
  open("IMO02", "intimacyMechanism", "autonomyNeed", "你在关系里最需要保留的一块个人空间是什么？"),
  open("IMO03", "intimacyMechanism", "repairAbility", "什么样的冲突会让你觉得「这段关系可能不行了」？"),
  open("IMO04", "intimacyMechanism", "commitmentNeed", "你曾经或想象中最容易被什么样的人吸引？为什么？"),
  open("IMO05", "intimacyMechanism", "repairAbility", "你觉得自己在亲密关系里最容易犯的错误是什么？"),

  q("PR01", "partnerReality", "partnerSteadiness", "singleChoice", "你更适合哪种生活节奏的伴侣？", [
    option("A", "稳定规划型", { partnerSteadiness: 9, stability: 4 }),
    option("B", "好奇探索型", { exploration: 6, freedom: 5 }),
    option("C", "深度交流型", { expression: 8 }),
    option("D", "温暖陪伴型", { securityNeed: 6, partnerSteadiness: 5 })
  ], ["partnerSteadiness", "stability", "exploration", "expression"]),
  q("PR02", "partnerReality", "partnerSteadiness", "multipleChoice", "如果只能保留 3 个伴侣特质，你会选什么？", [
    option("emotion_stable", "情绪稳定", { partnerSteadiness: 7, emotionalStability: 4 }),
    option("clear_expression", "表达清楚", { expression: 6 }),
    option("ambitious", "上进", { growth: 7 }),
    option("interesting", "有趣", { exploration: 5 }),
    option("money_responsible", "经济负责", { realityAlignment: 7, partnerSteadiness: 4 }),
    option("boundary", "尊重边界", { autonomyNeed: 6 }),
    option("family_boundary", "家庭边界清楚", { familyBoundary: 7 }),
    option("communicate", "愿意沟通", { repairAbility: 7 }),
    option("life_skill", "生活能力强", { partnerSteadiness: 7 })
  ], ["partnerSteadiness", "expression", "growth", "realityAlignment", "familyBoundary"]),
  scale("PR03", "partnerReality", "partnerSteadiness", "我希望伴侣和我有相近的价值观，比兴趣相同更重要。", { freedom: 4 }, { partnerSteadiness: 7, growth: 4 }, ["1 很不同意", "2 不太同意", "3 看情况", "4 比较同意", "5 很同意"]),
  q("PR04", "partnerReality", "realityAlignment", "singleChoice", "如果长期关系涉及换城市，你的态度是？", [
    option("A", "可以，只要目标一致", { realityAlignment: 7, commitmentNeed: 4 }),
    option("B", "不太愿意", { stability: 7 }),
    option("C", "看成长机会", { growth: 7, exploration: 4 }),
    option("D", "除非对方也有清晰牺牲", { realityAlignment: 6, commitmentNeed: 5 })
  ], ["realityAlignment", "commitmentNeed", "stability", "growth"]),
  q("PR05", "partnerReality", "realityAlignment", "singleChoice", "你对伴侣经济条件的真实态度更接近？", [
    option("A", "不必很高但要负责", { realityAlignment: 8, partnerSteadiness: 5 }),
    option("B", "希望有明显上升能力", { growth: 8 }),
    option("C", "至少不能拖累生活", { realityAlignment: 7, stability: 4 }),
    option("D", "不是核心，但消费观要合", { familyBoundary: 4, realityAlignment: 4 })
  ], ["realityAlignment", "partnerSteadiness", "growth", "stability"]),
  q("PR06", "partnerReality", "realityAlignment", "singleChoice", "外貌、身高、身材在你择偶里是什么位置？", [
    option("A", "有基础要求，不是第一权重", { realityAlignment: 5 }),
    option("B", "很重要，会影响吸引", { exploration: 6 }),
    option("C", "相处和三观更重要", { expression: 5, partnerSteadiness: 4 }),
    option("D", "我不确定真实权重", { uncertaintyTolerance: 4 })
  ], ["realityAlignment", "exploration", "expression", "uncertaintyTolerance"]),
  q("PR07", "partnerReality", "commitmentNeed", "singleChoice", "你对婚姻时间线的感受是？", [
    option("A", "需要清晰时间表", { commitmentNeed: 9, stability: 4 }),
    option("B", "顺其自然但认真", { partnerSteadiness: 6 }),
    option("C", "近几年不想太早绑定", { freedom: 8 }),
    option("D", "先看关系质量再谈", { repairAbility: 4, uncertaintyTolerance: 4 })
  ], ["commitmentNeed", "stability", "partnerSteadiness", "freedom"]),
  q("PR08", "partnerReality", "realityAlignment", "singleChoice", "你对未来是否要孩子的态度是？", [
    option("A", "倾向想要", { realityAlignment: 7, commitmentNeed: 5 }),
    option("B", "倾向不要", { autonomyNeed: 7, familyBoundary: 4 }),
    option("C", "不确定，需要共同探索", { uncertaintyTolerance: 6 }),
    option("D", "看现实条件和伴侣质量", { realityAlignment: 5, partnerSteadiness: 4 })
  ], ["realityAlignment", "commitmentNeed", "autonomyNeed", "uncertaintyTolerance"]),
  q("PR09", "partnerReality", "partnerSteadiness", "singleChoice", "对方工作很忙但前景好，你会怎么判断？", [
    option("A", "可以接受，但需要稳定沟通", { partnerSteadiness: 6, repairAbility: 4 }),
    option("B", "可以接受，事业上升很重要", { growth: 7 }),
    option("C", "很难接受，我需要陪伴", { securityNeed: 6, commitmentNeed: 4 }),
    option("D", "看 TA 是否愿意为关系留时间", { partnerSteadiness: 6, commitmentNeed: 4 })
  ], ["partnerSteadiness", "growth", "securityNeed", "commitmentNeed"]),
  q("PR10", "partnerReality", "commitmentNeed", "singleChoice", "你最不能接受的长期关系状态是？", [
    option("A", "没有承诺", { commitmentNeed: 9, securityNeed: 5 }),
    option("B", "没有空间", { autonomyNeed: 9, familyBoundary: 4 }),
    option("C", "没有成长", { growth: 9 }),
    option("D", "没有情绪回应", { securityNeed: 7, expression: 4 })
  ], ["commitmentNeed", "securityNeed", "autonomyNeed", "growth"]),
  q("PR11", "partnerReality", "exploration", "multipleChoice", "哪些人可能强烈吸引你，但长期风险较高？最多选 3 项。", [
    option("hot_cold", "忽冷忽热的人", { securityNeed: 7, exploration: 4 }),
    option("excellent_busy", "特别优秀但没时间的人", { growth: 6, securityNeed: 3 }),
    option("romantic_unstable", "很浪漫但不稳定的人", { exploration: 6, stability: -3 }),
    option("different_values", "和你三观差异大的人", { uncertaintyTolerance: 4, repairAbility: 3 }),
    option("rescue", "需要你拯救的人", { securityNeed: 5, repairAbility: -3 }),
    option("boundary_mess", "边界混乱的人", { familyBoundary: 6, autonomyNeed: 4 })
  ], ["exploration", "securityNeed", "growth", "familyBoundary"]),
  q("PR12", "partnerReality", "partnerSteadiness", "ranking", "选伴侣时，你心里真正的排序是什么？", [
    option("personality", "性格", { partnerSteadiness: 6 }),
    option("values", "三观", { growth: 5, partnerSteadiness: 4 }),
    option("appearance", "外貌吸引", { exploration: 5 }),
    option("money", "经济负责", { realityAlignment: 7 }),
    option("family", "家庭背景", { familyBoundary: 6 }),
    option("city", "城市一致", { realityAlignment: 6 }),
    option("emotion", "情绪稳定", { partnerSteadiness: 7 }),
    option("growth", "成长潜力", { growth: 7 }),
    option("communication", "沟通能力", { repairAbility: 7, expression: 4 })
  ], ["partnerSteadiness", "growth", "realityAlignment", "familyBoundary"]),
  q("PR13", "partnerReality", "familyBoundary", "singleChoice", "如果对方家庭强势介入关系，你会？", [
    option("A", "一起建立边界", { familyBoundary: 9, repairAbility: 4 }),
    option("B", "可以适应，但对方要站在两人关系这边", { securityNeed: 5, commitmentNeed: 4 }),
    option("C", "这是明显风险", { familyBoundary: 8, autonomyNeed: 5 }),
    option("D", "先看对方处理能力", { partnerSteadiness: 5, repairAbility: 4 })
  ], ["familyBoundary", "repairAbility", "securityNeed", "partnerSteadiness"]),
  q("PR14", "partnerReality", "repairAbility", "multipleChoice", "你最希望报告最后给你哪类建议？最多选 3 项。", [
    option("know_self", "如何更了解自己", { expression: 3 }),
    option("filter_partner", "如何筛选伴侣", { partnerSteadiness: 3 }),
    option("communication", "亲密关系沟通练习", { repairAbility: 4 }),
    option("reading", "书单/播客/课程", { growth: 3 }),
    option("date_checklist", "约会观察清单", { realityAlignment: 3 }),
    option("reality_questions", "现实议题提问清单", { realityAlignment: 4 }),
    option("self_love", "爱自己的日常练习", { emotionalStability: 3 })
  ], ["repairAbility", "partnerSteadiness", "growth", "realityAlignment"]),
  open("PRO01", "partnerReality", "partnerSteadiness", "如果只能保留三个伴侣特质，你最想保留什么？为什么？"),
  open("PRO02", "partnerReality", "exploration", "你容易被什么样的人吸引，即使你知道 TA 可能不适合长期生活？"),
  open("PRO03", "partnerReality", "realityAlignment", "想象和一个人一起生活十年，你最害怕什么？"),
  open("PRO04", "partnerReality", "familyBoundary", "在择偶里，你觉得什么是「不可协商」？什么是「可以磨合」？"),
  open("PRO05", "partnerReality", "partnerSteadiness", "你希望未来的 TA 怎样陪你度过奥德赛时期？"),
  open("PRO06", "partnerReality", "repairAbility", "你现在最想改善自己的哪一部分？")
];
