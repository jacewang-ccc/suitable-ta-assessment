import { questionBank } from "@/lib/assessment/questionBank";
import { scoreAssessment } from "@/lib/assessment/scoring";
import type { AssessmentAnswer, AssessmentScoreResult } from "@/lib/assessment/types";
import { reportTemplates } from "@/lib/report/templates";

export interface GeneratedStageReport {
  layer: "selfFoundation" | "valuesScript" | "intimacyMechanism" | "partnerReality";
  order: number;
  title: string;
  reportTitle: string;
  coreQuestion: string;
  subtitle: string;
  score: number;
  answerCount: number;
  totalQuestions: number;
  isComplete: boolean;
  summary: string;
  highlights: string[];
  strengths: string[];
  watchOuts: string[];
  practices: string[];
  dimensions: Array<{
    label: string;
    value: number;
  }>;
  nextStep: string;
  archetype: {
    name: string;
    motto: string;
    role: string;
    prop: string;
    palette: "rose" | "teal" | "gold" | "mint";
    evidence: string[];
    secondaryName: string;
    confidence: "高" | "中" | "低";
  };
  sections: Array<{
    title: string;
    source: string;
    templateText: string;
    aiSignal?: string;
  }>;
  insufficiencies: string[];
  aiSupplement: string;
  actionCards: Array<{
    title: string;
    body: string;
  }>;
  readingCards: Array<{
    title: string;
    reason: string;
  }>;
}

export interface GeneratedReport {
  isUnlocked: boolean;
  score: AssessmentScoreResult;
  stageReports: GeneratedStageReport[];
  preview: {
    primaryType: string;
    secondaryType: string;
    oneLine: string;
    insights: string[];
    lockedSections: string[];
  };
  fullReport: null | {
    modules: Array<{
      title: string;
      items: string[];
    }>;
    selfPortrait: {
      personality: string[];
      relationshipPattern: string[];
      emotionalNeeds: string[];
    };
    values: {
      lifeView: string[];
      consumptionView: string[];
      familyView: string[];
      careerView: string[];
    };
    idealPartner: {
      coreTraits: string[];
      communicationStyle: string[];
      lifeRhythm: string[];
      realisticConditions: string[];
    };
    risks: {
      highRiskTypes: string[];
      blindSpots: string[];
      earlyWarningSignals: string[];
    };
    actionPlan: {
      nonNegotiables: string[];
      negotiables: string[];
      firstDateQuestions: string[];
      relationshipAdvice: string[];
      dailyPractices: string[];
      readingList: string[];
      selfCarePrompts: string[];
    };
    archetypeLineup: string[];
    crossStageInsights: string[];
  };
}

const stageDefinitions: Array<{
  layer: GeneratedStageReport["layer"];
  title: string;
  reportTitle: string;
  coreQuestion: string;
  subtitle: string;
  dimensions: Array<{
    key: keyof AssessmentScoreResult["dimensionScores"];
    label: string;
  }>;
}> = [
  {
    layer: "selfFoundation",
    title: "自我画像",
    reportTitle: "自我画像报告",
    coreQuestion: "我是谁？",
    subtitle: "看清你的性格底色、能量来源和关系中的基础需求。",
    dimensions: [
      { key: "expression", label: "表达自然度" },
      { key: "planning", label: "规划倾向" },
      { key: "emotionalStability", label: "情绪稳定度" }
    ]
  },
  {
    layer: "valuesScript",
    title: "价值罗盘",
    reportTitle: "价值罗盘报告",
    coreQuestion: "我的三观和生活选择是什么？",
    subtitle: "梳理你对自由、稳定、成长、家庭和金钱的真实排序。",
    dimensions: [
      { key: "stability", label: "稳定需求" },
      { key: "freedom", label: "自由需求" },
      { key: "growth", label: "成长驱动" }
    ]
  },
  {
    layer: "intimacyMechanism",
    title: "亲密模式",
    reportTitle: "亲密模式报告",
    coreQuestion: "我会怎样爱人，又希望怎样被爱？",
    subtitle: "识别你的安全感、边界、沟通方式和冲突修复模式。",
    dimensions: [
      { key: "securityNeed", label: "安全感需求" },
      { key: "autonomyNeed", label: "边界需求" },
      { key: "repairAbility", label: "修复能力" }
    ]
  },
  {
    layer: "partnerReality",
    title: "理想伴侣",
    reportTitle: "理想伴侣报告",
    coreQuestion: "我适合什么样的 TA？",
    subtitle: "把伴侣偏好拆成性格、三观、生活节奏和现实条件。",
    dimensions: [
      { key: "partnerSteadiness", label: "稳定伴侣偏好" },
      { key: "realityAlignment", label: "现实适配度" },
      { key: "commitmentNeed", label: "承诺需求" }
    ]
  }
];

type ArchetypeBase = Omit<GeneratedStageReport["archetype"], "evidence" | "secondaryName" | "confidence">;

type ArchetypeTrigger = {
  questionId: string;
  values: string[];
  signal: string;
  weight: number;
};

type ArchetypeAiTrigger = {
  questionId?: string;
  semanticSignals: string[];
  signal: string;
  weight: number;
};

type ArchetypeRule = {
  layer: GeneratedStageReport["layer"];
  archetype: ArchetypeBase;
  roleSignals: string[];
  structuredTriggers: ArchetypeTrigger[];
  aiTriggers: ArchetypeAiTrigger[];
  sectionTone: Record<string, string>;
  insufficiencies: string[];
  actionCards: GeneratedStageReport["actionCards"];
  readingCards: GeneratedStageReport["readingCards"];
};

type ArchetypeEvaluation = {
  rule: ArchetypeRule;
  score: number;
  evidence: string[];
};

const dimensionArchetypeFallbacks: Record<
  GeneratedStageReport["layer"],
  Partial<Record<keyof AssessmentScoreResult["dimensionScores"], string>>
> = {
  selfFoundation: {
    autonomyNeed: "灯塔守护者",
    stability: "灯塔守护者",
    familyBoundary: "灯塔守护者",
    exploration: "风帆冒险家",
    freedom: "风帆冒险家",
    growth: "星图规划师",
    realityAlignment: "星图规划师",
    expression: "云朵疗愈师",
    securityNeed: "云朵疗愈师",
    planning: "星图规划师",
    emotionalStability: "星图规划师",
    uncertaintyTolerance: "风帆冒险家",
    repairAbility: "星图规划师"
  },
  valuesScript: {
    freedom: "罗盘探路者",
    exploration: "罗盘探路者",
    uncertaintyTolerance: "罗盘探路者",
    stability: "港湾建造师",
    familyBoundary: "港湾建造师",
    autonomyNeed: "港湾建造师",
    emotionalStability: "港湾建造师",
    realityAlignment: "港湾建造师",
    partnerSteadiness: "港湾建造师",
    growth: "山顶攀登者",
    planning: "山顶攀登者",
    expression: "花园照料者",
    securityNeed: "花园照料者",
    repairAbility: "花园照料者",
    commitmentNeed: "港湾建造师"
  },
  intimacyMechanism: {
    securityNeed: "篝火守望者",
    commitmentNeed: "篝火守望者",
    partnerSteadiness: "篝火守望者",
    autonomyNeed: "海雾观察员",
    freedom: "海雾观察员",
    uncertaintyTolerance: "海雾观察员",
    repairAbility: "双桨修复师",
    expression: "双桨修复师",
    emotionalStability: "双桨修复师",
    planning: "双桨修复师",
    realityAlignment: "篝火守望者",
    familyBoundary: "双桨修复师",
    exploration: "星火追逐者",
    growth: "星火追逐者",
    stability: "篝火守望者"
  },
  partnerReality: {
    partnerSteadiness: "港口共建者",
    realityAlignment: "港口共建者",
    stability: "港口共建者",
    commitmentNeed: "港口共建者",
    growth: "星图同行者",
    expression: "星图同行者",
    exploration: "星图同行者",
    securityNeed: "暖炉陪伴者",
    emotionalStability: "暖炉陪伴者",
    familyBoundary: "风暴识别师",
    autonomyNeed: "风暴识别师",
    repairAbility: "风暴识别师",
    uncertaintyTolerance: "星图同行者",
    freedom: "风暴识别师",
    planning: "港口共建者"
  }
};

const openQuestionSemanticFallbacks: Record<string, string[]> = {
  SFO01: ["self_identity", "boundary_need", "authentic_self"],
  SFO02: ["emotional_trigger", "self_regulation", "recovery_pattern"],
  SFO03: ["being_understood", "boundary_need", "clear_expression_need"],
  VRO01: ["life_quality", "value_priority", "daily_companionship"],
  VRO02: ["money_security", "shared_responsibility", "risk_buffer"],
  VRO03: ["family_boundary", "non_negotiable_boundary", "relationship_boundary"],
  VRO04: [
    "odyssey_support",
    "growth_or_freedom_support",
    "freedom_exploration",
    "uncertainty_acceptance",
    "growth_support",
    "action_support",
    "goal_orientation"
  ],
  IMO01: ["stable_reassurance", "relationship_security", "clear_commitment"],
  IMO02: ["space_need", "boundary_need", "withdrawal_protection"],
  IMO03: ["conflict_boundary", "repair_need", "communication_breakdown", "non_negotiable_boundary", "relationship_exit_trigger"],
  IMO04: ["attraction_pattern", "risk_awareness", "tension_attraction", "uncertain_attraction", "unstable_attraction", "boundary_risk"],
  IMO05: [
    "self_awareness",
    "repair_growth",
    "space_need",
    "withdrawal_protection",
    "cool_down_before_repair",
    "clear_expression_need"
  ],
  PRO01: [
    "partner_core_traits",
    "long_term_fit",
    "partner_steadiness",
    "life_competence",
    "growth_partner",
    "spiritual_alignment",
    "warm_companionship",
    "emotional_stability",
    "daily_companionship"
  ],
  PRO02: ["attraction_pattern", "risk_awareness", "unstable_attraction", "boundary_risk"],
  PRO03: ["long_term_fear", "life_quality", "emotional_climate", "daily_companionship", "self_loss_risk", "family_or_life_risk"],
  PRO04: ["non_negotiable_boundary", "negotiable_space", "screening_questions"],
  PRO05: ["odyssey_support", "growth_support", "stable_reassurance", "partner_core_traits"],
  PRO06: ["growth_theme", "clear_expression_need", "self_care_practice", "reading_direction"]
};

const stageArchetypeRules: Record<GeneratedStageReport["layer"], ArchetypeRule[]> = {
  selfFoundation: [
    {
      layer: "selfFoundation",
      archetype: {
        name: "灯塔守护者",
        motto: "先把自己的灯点亮，再决定要驶向哪里。",
        role: "自我画像角色",
        prop: "小灯塔",
        palette: "rose"
      },
      roleSignals: ["稳定", "内收", "边界", "先确认安全再行动"],
      structuredTriggers: [],
      aiTriggers: [
        { semanticSignals: ["boundary_need", "self_regulation", "stable_space"], signal: "AI 语义分析显示边界和自我整理需求", weight: 4 }
      ],
      sectionTone: {
        性格能量: "你的主线更像先回到自己的秩序里，再决定如何和外界连接。",
        情绪复原: "你不一定需要很多人围着你，反而需要被允许先安静恢复。",
        行动方式: "你会先确认安全边界，再推进下一步。",
        自我需求: "你真正需要的是被尊重空间，而不是被误解为冷淡。"
      },
      insufficiencies: [
        "容易把安全感建在可控感上，真正需要帮助时也先自己扛。",
        "如果一直等自己整理好才表达，亲近的人可能错过支持你的时机。"
      ],
      actionCards: [
        { title: "边界说明", body: "把“我想自己待会儿”说清楚：需要多久、对方能做什么、你何时回来。" },
        { title: "灯塔记录", body: "记录 3 个让你恢复秩序的场景，找出你真正需要的稳定来源。" }
      ],
      readingCards: [
        { title: "《Self-Compassion》", reason: "适合理解自我关怀、内在批评和低落时怎样温柔地对待自己。" },
        { title: "边界练习工作簿", reason: "帮助你把空间需求说成具体、可协商、不会伤人的表达。" }
      ]
    },
    {
      layer: "selfFoundation",
      archetype: {
        name: "风帆冒险家",
        motto: "风一来，我就想知道远处有什么。",
        role: "自我画像角色",
        prop: "小风帆",
        palette: "gold"
      },
      roleSignals: ["探索", "刺激", "新鲜", "自由流动"],
      structuredTriggers: [],
      aiTriggers: [
        { semanticSignals: ["freedom_exploration", "novelty_drive", "possibility_seeking"], signal: "AI 语义分析显示探索和自由信号", weight: 5 }
      ],
      sectionTone: {
        性格能量: "你的能量常来自变化、连接和新的可能性。",
        情绪复原: "转场、体验和换环境可能比原地分析更能帮你恢复。",
        行动方式: "你更适合小步试探，而不是一开始就把所有路线固定死。",
        自我需求: "你需要被允许探索，不被过早定义。"
      },
      insufficiencies: [
        "容易低估恢复和稳定成本，关系里可能把承诺误读成限制。",
        "如果一直追新鲜，真正该面对的问题可能被不断推迟。"
      ],
      actionCards: [
        { title: "探索校验", body: "每次想换方向前写一句：我是在探索，还是在逃避一个要面对的问题？" },
        { title: "恢复预算", body: "给每次新尝试预留恢复时间，别让热情透支身体和情绪。" }
      ],
      readingCards: [
        { title: "《Designing Your Life》", reason: "适合把探索欲转成可执行的人生原型实验。" },
        { title: "行动实验记录", reason: "帮助你记录试错后的真实感受，而不是只记刺激感。" }
      ]
    },
    {
      layer: "selfFoundation",
      archetype: {
        name: "云朵疗愈师",
        motto: "我会把情绪收进云朵瓶，再慢慢说给你听。",
        role: "自我画像角色",
        prop: "云朵瓶",
        palette: "mint"
      },
      roleSignals: ["情绪敏感", "需要理解", "共情", "被接住"],
      structuredTriggers: [],
      aiTriggers: [
        { semanticSignals: ["emotional_validation", "being_understood", "high_emotional_sensitivity"], signal: "AI 语义分析显示强情绪和被理解需求", weight: 5 }
      ],
      sectionTone: {
        性格能量: "你的能量和关系回应联系较深，被理解会明显影响状态。",
        情绪复原: "情绪不是问题本身，关键是能不能被安全地表达出来。",
        行动方式: "情绪状态会影响你的决策速度，需要先被安放。",
        自我需求: "你需要的是先被听见，而不是立刻被教育或修正。"
      },
      insufficiencies: [
        "容易等别人主动读懂自己，或者在没被理解时迅速收回表达。",
        "如果把所有情绪都留到爆发时才说，关系会很难接住真实的你。"
      ],
      actionCards: [
        { title: "需求翻译", body: "把“你不懂我”改成“我现在需要你先听我讲完，不急着给建议”。" },
        { title: "情绪命名", body: "每天用 3 个词记录情绪：发生了什么、我感到什么、我需要什么。" }
      ],
      readingCards: [
        { title: "情绪记录工作簿", reason: "帮助你把抽象感受转成可观察的日常信号。" },
        { title: "《非暴力沟通》", reason: "适合练习把情绪和责备翻译成清晰请求。" }
      ]
    },
    {
      layer: "selfFoundation",
      archetype: {
        name: "星图规划师",
        motto: "我先看清星图，再决定下一步怎么走。",
        role: "自我画像角色",
        prop: "星图板",
        palette: "teal"
      },
      roleSignals: ["计划", "理性", "长期", "拆解问题"],
      structuredTriggers: [],
      aiTriggers: [
        { semanticSignals: ["planning_orientation", "problem_decomposition", "long_term_logic"], signal: "AI 语义分析显示计划和拆解信号", weight: 5 }
      ],
      sectionTone: {
        性格能量: "你常通过秩序、任务完成和可预期路径获得安全感。",
        情绪复原: "分析和行动能帮你恢复，但也要给情绪留位置。",
        行动方式: "你擅长拆解下一步，适合把复杂问题变成路线图。",
        自我需求: "你需要明确方案、稳定反馈和可执行的支持。"
      },
      insufficiencies: [
        "容易过度分析而延迟行动，也可能把情绪问题处理成方案问题。",
        "如果只追求正确方案，亲密关系里的感受会被压到很后面。"
      ],
      actionCards: [
        { title: "感受先行", body: "练习在分析方案前，先写一句：我现在真实的感受是……" },
        { title: "最小行动", body: "把一个大决定拆成 24 小时内能做的一步，而不是等全部想清楚。" }
      ],
      readingCards: [
        { title: "《Designing Your Life》", reason: "适合把长期问题拆成低成本实验。" },
        { title: "情绪记录工作簿", reason: "帮助你在理性分析之外保留感受线索。" }
      ]
    }
  ],
  valuesScript: [
    {
      layer: "valuesScript",
      archetype: {
        name: "罗盘探路者",
        motto: "我不急着抵达，我要知道自己为什么出发。",
        role: "价值罗盘角色",
        prop: "黄铜罗盘",
        palette: "gold"
      },
      roleSignals: ["自由", "探索", "可能性", "自我路径"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "VRO04", semanticSignals: ["freedom_exploration", "odyssey_support", "uncertainty_acceptance"], signal: "AI 语义分析显示奥德赛支持需求偏自由探索", weight: 5 }
      ],
      sectionTone: {
        人生观: "你更像在找自己的路径，而不是急着进入标准答案。",
        价值观: "自由和可能性会显著影响你对关系和生活的判断。",
        世界观: "你能承认不确定，也希望伴侣不要把探索视为不靠谱。",
        消费观与家庭观: "现实议题可以谈，但不能把你过早固定成单一路径。",
        现实选择观: "当稳定和自由冲突时，你需要先确认这份稳定是否值得。"
      },
      insufficiencies: ["容易在自由和承诺之间摇摆，关系认真后会担心失去可能性。"],
      actionCards: [
        { title: "自由拆解", body: "列出自由对你意味着什么：空间、选择权、城市、职业还是关系节奏。" },
        { title: "承诺翻译", body: "写下哪些承诺会让你安心，哪些承诺会让你感到被困住。" }
      ],
      readingCards: [
        { title: "《Designing Your Life》", reason: "适合梳理奥德赛时期的价值排序、人生原型和现实取舍。" },
        { title: "价值排序练习", reason: "帮助你把自由、稳定、成长和关系放进同一张图里比较。" }
      ]
    },
    {
      layer: "valuesScript",
      archetype: {
        name: "港湾建造师",
        motto: "我想把生活修成一个能停靠的地方。",
        role: "价值罗盘角色",
        prop: "小锤子",
        palette: "rose"
      },
      roleSignals: ["稳定", "责任", "家庭", "生活托底"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "VRO02", semanticSignals: ["money_security", "shared_responsibility", "risk_buffer"], signal: "AI 语义分析显示钱被理解为共同安全和责任", weight: 5 }
      ],
      sectionTone: {
        人生观: "你需要生活有托底感，关系也要能承接现实。",
        价值观: "责任、稳定和可预期会影响你的长期选择。",
        世界观: "你相信规则、善意和共同承担能保护关系。",
        消费观与家庭观: "钱和家庭不是小事，而是长期关系能否稳住的底盘。",
        现实选择观: "你会倾向先把生活托住，再谈更大的自由。"
      },
      insufficiencies: ["容易把稳定等同于全部安全，忽略关系里的松弛、欲望和变化。"],
      actionCards: [
        { title: "稳定清单", body: "提前写下你要的稳定是收入、承诺、情绪回应、家庭边界中的哪几项。" },
        { title: "金钱对话", body: "设计一个不冒犯的谈钱问题，关系认真前就拿出来讨论。" }
      ],
      readingCards: [
        { title: "《Eight Dates》", reason: "适合把金钱、家庭、梦想和长期关系议题变成可讨论的问题。" },
        { title: "金钱关系清单", reason: "帮助你把钱从敏感话题变成共同规则。" }
      ]
    },
    {
      layer: "valuesScript",
      archetype: {
        name: "山顶攀登者",
        motto: "我背包里永远装着下一座山。",
        role: "价值罗盘角色",
        prop: "登山杖",
        palette: "teal"
      },
      roleSignals: ["成长", "事业", "目标", "上升"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "VRO04", semanticSignals: ["growth_support", "action_support", "goal_orientation"], signal: "AI 语义分析显示奥德赛支持需求偏成长推进", weight: 5 }
      ],
      sectionTone: {
        人生观: "你会自然把人生看成持续进阶和选择权扩大的过程。",
        价值观: "成长和能力感在你心里很靠前。",
        世界观: "你更相信选择、努力和环境会一起改变处境。",
        消费观与家庭观: "资源更像支持成长的工具，而不只是安全垫。",
        现实选择观: "当事业窗口出现时，你会倾向认真评估甚至优先抓住。"
      },
      insufficiencies: ["容易忽略情绪和关系节奏，把成长速度当成关系质量。"],
      actionCards: [
        { title: "非效率问题", body: "写下一个关系里不能被效率化处理的问题，例如安慰、陪伴或冲突修复。" },
        { title: "成长定义", body: "把“上进”拆成 3 个可观察行为：行动力、复盘能力、责任感。" }
      ],
      readingCards: [
        { title: "《Designing Your Life》", reason: "适合把成长目标和现实原型结合起来。" },
        { title: "长期主义主题内容", reason: "帮助你区分真正成长和单纯焦虑驱动。" }
      ]
    },
    {
      layer: "valuesScript",
      archetype: {
        name: "花园照料者",
        motto: "我想把日子照料得有爱、有风、有花香。",
        role: "价值罗盘角色",
        prop: "小水壶",
        palette: "mint"
      },
      roleSignals: ["关系", "体验", "生活质量", "真实表达"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "PRO03", semanticSignals: ["life_quality", "emotional_climate", "daily_companionship"], signal: "AI 语义分析显示十年生活想象里重视日常质量", weight: 5 }
      ],
      sectionTone: {
        人生观: "你在意的不是抽象成功，而是生活是否真的滋养自己。",
        价值观: "连接、真实和体验会影响你如何选择关系。",
        世界观: "你相信关系里的情绪理解和日常照料很重要。",
        消费观与家庭观: "资源要服务生活质量，而不是只服务数字安全。",
        现实选择观: "长期牺牲生活质量会让你很难维持关系热度。"
      },
      insufficiencies: ["容易为了和谐牺牲个人边界，或把舒服误当成长期适配。"],
      actionCards: [
        { title: "花园边界", body: "写下你愿意照顾关系的地方，以及绝不能为了关系放弃的地方。" },
        { title: "生活质量清单", body: "列出 5 个你希望未来关系保留的日常细节。" }
      ],
      readingCards: [
        { title: "《Eight Dates》", reason: "适合把梦想、家庭和生活方式变成具体对话。" },
        { title: "自我照顾练习", reason: "帮助你在照顾关系时也不丢掉自己。" }
      ]
    }
  ],
  intimacyMechanism: [
    {
      layer: "intimacyMechanism",
      archetype: {
        name: "篝火守望者",
        motto: "靠近不是占有，而是一起把火守住。",
        role: "亲密模式角色",
        prop: "小篝火",
        palette: "teal"
      },
      roleSignals: ["安全感", "陪伴", "明确承诺", "稳定行动"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "IMO01", semanticSignals: ["relationship_security", "stable_reassurance", "clear_commitment"], signal: "AI 语义分析显示安全感来自稳定回应和共同面对", weight: 5 }
      ],
      sectionTone: {
        安全感机制: "你确认关系的方式偏明确、稳定和可预期。",
        亲密距离: "你可以给空间，但前提是关系本身是被确认的。",
        表达爱与接收爱: "稳定陪伴和被认真回应会明显增强你的信任。",
        冲突修复: "冲突后你最需要确认火还在，而不是被晾在不确定里。",
        吸引与承诺: "你更适合安全感和承诺感足够清楚的人。"
      },
      insufficiencies: ["容易被模糊关系消耗，把对方的冷淡快速理解成关系变化。"],
      actionCards: [
        { title: "安心动作", body: "列出 3 个真正能让你安心的具体动作，避免只要求“多在乎我”。" },
        { title: "确认脚本", body: "把“你到底什么意思”改成“我需要确认我们现在是不是认真推进”。" }
      ],
      readingCards: [
        { title: "《Hold Me Tight》", reason: "帮助你理解安全感、回应和亲密连接。" },
        { title: "依恋与亲密关系内容", reason: "适合继续区分安全感需求和控制需求。" }
      ]
    },
    {
      layer: "intimacyMechanism",
      archetype: {
        name: "海雾观察员",
        motto: "我会先站在雾边，看清距离再靠近。",
        role: "亲密模式角色",
        prop: "望远镜",
        palette: "mint"
      },
      roleSignals: ["观察", "抽离", "空间", "慢慢确认"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "IMO05", semanticSignals: ["space_need", "withdrawal_protection", "cool_down_before_repair"], signal: "AI 语义分析显示抽离或空间需求", weight: 4 }
      ],
      sectionTone: {
        安全感机制: "你会先观察关系是否安全，再决定靠近的速度。",
        亲密距离: "空间不是不爱，而是你维持自我的必要条件。",
        表达爱与接收爱: "你表达喜欢时也会保留边界，希望对方理解这种节奏。",
        冲突修复: "你需要冷静窗口，但也要告诉对方你会回来处理。",
        吸引与承诺: "你容易被有边界、不黏腻的人吸引。"
      },
      insufficiencies: ["容易让对方不知道怎么靠近，也容易把保护自己变成不表达。"],
      actionCards: [
        { title: "靠近说明书", body: "给伴侣一份说明：什么时候别追问，什么时候可以主动靠近。" },
        { title: "暂停约定", body: "冲突中如果需要冷静，说明多久后回来谈，别只消失。" }
      ],
      readingCards: [
        { title: "边界练习工作簿", reason: "帮助你把空间需求变成关系可理解的规则。" },
        { title: "《非暴力沟通》", reason: "适合练习冷静后如何重新表达。" }
      ]
    },
    {
      layer: "intimacyMechanism",
      archetype: {
        name: "双桨修复师",
        motto: "两个人一起划，关系才回得来。",
        role: "亲密模式角色",
        prop: "双桨",
        palette: "gold"
      },
      roleSignals: ["沟通", "复盘", "解释", "共同修复"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "IMO03", semanticSignals: ["conflict_boundary", "repair_need", "communication_breakdown"], signal: "AI 语义分析显示冲突底线与沟通修复有关", weight: 5 },
        { questionId: "IMO05", semanticSignals: ["self_awareness", "repair_growth", "clear_expression_need"], signal: "AI 语义分析显示自我觉察指向沟通修复", weight: 4 }
      ],
      sectionTone: {
        安全感机制: "你会从能不能沟通里判断关系是否安全。",
        亲密距离: "亲密距离对你来说可以协商，关键是双方愿不愿意说清楚。",
        表达爱与接收爱: "你常用支持、建议或主动分享表达喜欢。",
        冲突修复: "你有修复意愿，但要避免一个人划两支桨。",
        吸引与承诺: "能对话、能复盘的人会让你更愿意投入。"
      },
      insufficiencies: ["容易承担过多修复责任，或者把所有关系问题都变成沟通任务。"],
      actionCards: [
        { title: "最小修复", body: "下一次冲突后只提出一个最小修复请求，不一次性清算全部问题。" },
        { title: "双人责任", body: "写下这件事里你能做什么、对方也必须做什么。" }
      ],
      readingCards: [
        { title: "《非暴力沟通》", reason: "适合练习把情绪和责备翻译成清晰请求。" },
        { title: "冲突修复主题内容", reason: "帮助你区分沟通、解释、复盘和过度负责。" }
      ]
    },
    {
      layer: "intimacyMechanism",
      archetype: {
        name: "星火追逐者",
        motto: "我会被夜里突然亮起的火花吸引。",
        role: "亲密模式角色",
        prop: "星火网",
        palette: "rose"
      },
      roleSignals: ["吸引", "新鲜", "张力", "精神火花"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "PRO02", semanticSignals: ["attraction_pattern", "tension_attraction", "uncertain_attraction"], signal: "AI 语义分析显示高吸引对象带有张力或不确定性", weight: 6 }
      ],
      sectionTone: {
        安全感机制: "你的安全感可能会和强吸引发生拉扯。",
        亲密距离: "你容易被有距离感的人吸引，但长期仍需要可确认的连接。",
        表达爱与接收爱: "强烈体验和精神火花会放大你的投入感。",
        冲突修复: "高张力关系里，修复不能只靠情绪浓度。",
        吸引与承诺: "你需要把吸引力和长期适配分开校验。"
      },
      insufficiencies: ["容易把不确定当作吸引力，或者把高张力关系理解成命中注定。"],
      actionCards: [
        { title: "吸引校验", body: "对一个强吸引对象做长期生活校验：稳定、沟通、边界、现实责任各举一个证据。" },
        { title: "张力降噪", body: "写下 TA 吸引你的地方，再写下这些特质是否能支持十年生活。" }
      ],
      readingCards: [
        { title: "关系风险识别清单", reason: "帮助你区分强吸引、高张力和真实适配。" },
        { title: "《Hold Me Tight》", reason: "适合理解吸引背后的安全感需求。" }
      ]
    }
  ],
  partnerReality: [
    {
      layer: "partnerReality",
      archetype: {
        name: "港口共建者",
        motto: "适合的人，不只让你心动，也能一起修生活。",
        role: "理想伴侣角色",
        prop: "蓝图卷轴",
        palette: "mint"
      },
      roleSignals: ["稳定规划", "经济责任", "现实共建", "长期生活"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "PRO01", semanticSignals: ["partner_core_traits", "partner_steadiness", "life_competence"], signal: "AI 语义分析显示伴侣核心特质偏稳定负责和生活能力", weight: 5 }
      ],
      sectionTone: {
        伴侣核心特质: "你更适合能一起修生活的人，而不只是提供短期心动。",
        现实匹配条件: "经济责任、城市选择和生活能力是你判断长期适配的重要部分。",
        风险识别: "不负责、不沟通和长期模糊会明显消耗你。",
        行动建议输入: "你的行动建议应优先转成现实议题提问清单。"
      },
      insufficiencies: ["容易忽略浪漫和松弛感，把适合生活误以为一定心动。"],
      actionCards: [
        { title: "现实提问", body: "下次约会问一个现实题：如果未来一年很忙，你会怎样给关系留时间？" },
        { title: "共建清单", body: "列出你希望两个人一起承担的 5 件生活事务。" }
      ],
      readingCards: [
        { title: "《Eight Dates》", reason: "适合提前讨论城市、金钱、家庭、婚育和工作节奏。" },
        { title: "长期关系现实议题清单", reason: "帮助你把生活适配提前谈清楚。" }
      ]
    },
    {
      layer: "partnerReality",
      archetype: {
        name: "星图同行者",
        motto: "我想和 TA 共用一张星图，互相照亮下一站。",
        role: "理想伴侣角色",
        prop: "双人星图",
        palette: "teal"
      },
      roleSignals: ["成长目标", "精神同频", "互相推动", "长期进阶"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "PRO01", semanticSignals: ["growth_partner", "spiritual_alignment", "goal_orientation"], signal: "AI 语义分析显示核心伴侣特质指向成长和同频", weight: 5 },
        { questionId: "VRO04", semanticSignals: ["growth_support", "action_support", "odyssey_support"], signal: "AI 语义分析显示奥德赛支持需求偏共同成长", weight: 4 }
      ],
      sectionTone: {
        伴侣核心特质: "你会被能深聊、能互相推动的人吸引。",
        现实匹配条件: "现实条件不是不重要，但你会特别看重机会质量和成长路径。",
        风险识别: "停滞、价值观错位和没有行动力会让你失望。",
        行动建议输入: "建议把“上进”拆成可观察行为，而不是停在感觉上。"
      },
      insufficiencies: ["容易把成长速度当成爱，忽略对方是否能稳定回应日常。"],
      actionCards: [
        { title: "上进拆解", body: "把“上进”拆成 3 个可观察行为：行动力、复盘能力、责任感。" },
        { title: "同频校验", body: "问 TA 最近一次主动改变自己的事，而不是只听愿景。" }
      ],
      readingCards: [
        { title: "《Designing Your Life》", reason: "适合把个人探索和伴侣支持转成原型实验。" },
        { title: "共同成长对话清单", reason: "帮助你判断对方是嘴上成长还是行动成长。" }
      ]
    },
    {
      layer: "partnerReality",
      archetype: {
        name: "暖炉陪伴者",
        motto: "我想要一间有温度的屋子，也想有人认真听我说话。",
        role: "理想伴侣角色",
        prop: "小暖炉",
        palette: "rose"
      },
      roleSignals: ["陪伴", "情绪稳定", "日常温度", "温柔沟通"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "PRO01", semanticSignals: ["warm_companionship", "emotional_stability", "daily_companionship"], signal: "AI 语义分析显示伴侣核心特质偏陪伴和情绪稳定", weight: 5 },
        { questionId: "PRO03", semanticSignals: ["emotional_climate", "life_quality", "daily_companionship"], signal: "AI 语义分析显示十年恐惧指向日常情绪质量", weight: 4 }
      ],
      sectionTone: {
        伴侣核心特质: "你真正需要的是有温度、能回应、能稳定相处的人。",
        现实匹配条件: "现实条件要服务日常质量，而不是只看外在条件。",
        风险识别: "冷漠、没有情绪回应和长期忽视会让你慢慢耗尽。",
        行动建议输入: "建议把陪伴需求具体到频率、场景和压力时的做法。"
      },
      insufficiencies: ["容易回避现实冲突，或者把温暖陪伴误当成问题已经解决。"],
      actionCards: [
        { title: "陪伴频率", body: "写下你需要的陪伴频率：每天、每周、遇到压力时分别是什么。" },
        { title: "温暖不逃避", body: "列出一个必须谈的现实议题，避免只靠舒服感维持关系。" }
      ],
      readingCards: [
        { title: "《Eight Dates》", reason: "适合把温暖关系里的现实议题谈出来。" },
        { title: "情绪沟通练习", reason: "帮助你把陪伴需求说得更具体。" }
      ]
    },
    {
      layer: "partnerReality",
      archetype: {
        name: "风暴识别师",
        motto: "我会先看见远处的风暴，再决定要不要启航。",
        role: "理想伴侣角色",
        prop: "风暴旗",
        palette: "gold"
      },
      roleSignals: ["风险识别", "底线", "边界", "不可协商"],
      structuredTriggers: [],
      aiTriggers: [
        { questionId: "PRO02", semanticSignals: ["risk_awareness", "unstable_attraction", "boundary_risk"], signal: "AI 语义分析显示高吸引对象带有长期风险", weight: 6 },
        { questionId: "IMO03", semanticSignals: ["conflict_boundary", "non_negotiable_boundary", "relationship_exit_trigger"], signal: "AI 语义分析显示冲突底线清楚", weight: 4 },
        { questionId: "PRO03", semanticSignals: ["long_term_fear", "self_loss_risk", "family_or_life_risk"], signal: "AI 语义分析显示十年恐惧里出现长期风险预警", weight: 4 }
      ],
      sectionTone: {
        伴侣核心特质: "你很需要对方尊重边界、处理风险、愿意沟通。",
        现实匹配条件: "现实条件首先要排除长期高风险，而不是只看加分项。",
        风险识别: "这是你的主模块：你对不可协商项和风险吸引很敏感。",
        行动建议输入: "建议把底线拆成行为证据，避免只靠感觉判断。"
      },
      insufficiencies: ["容易过早防御，错过可协商空间；也可能把风险识别当成关系里的主要安全感来源。"],
      actionCards: [
        { title: "底线分层", body: "把不可协商项拆成行为证据：出现一次就离开，还是反复出现才离开。" },
        { title: "风险复核", body: "对一个强吸引对象写下 3 个长期风险和 3 个真实优点。" }
      ],
      readingCards: [
        { title: "关系底线清单", reason: "帮助你区分强吸引、适合长期和可协商空间。" },
        { title: "自我保护练习", reason: "帮助你把风险识别变成清晰边界，而不是持续防御。" }
      ]
    }
  ]
};

const stageSectionTemplates: Record<GeneratedStageReport["layer"], GeneratedStageReport["sections"]> = {
  selfFoundation: [
    {
      title: "性格能量",
      source: "SF01, SF02",
      templateText: "这一部分会看你是靠独处、连接、混合节奏还是新鲜刺激恢复能量。"
    },
    {
      title: "情绪复原",
      source: "SF03, SF04, SFO02",
      templateText: "这一部分会看压力来临时，你更常用解决、表达、回撤还是外溢来应对。"
    },
    {
      title: "行动方式",
      source: "SF05, SF06, SF07, SF11",
      templateText: "这一部分会看你做决定时更依赖计划、直觉、他人反馈还是小步试探。"
    },
    {
      title: "自我需求",
      source: "SF08, SF09, SF10, SFO03",
      templateText: "这一部分会看你最需要被怎样理解，以及低落时需要什么样的支持。"
    }
  ],
  valuesScript: [
    {
      title: "人生观",
      source: "VR01, VR02, VRO01",
      templateText: "这一部分会看你现阶段如何定义过得好，以及奥德赛时期最想守住什么。"
    },
    {
      title: "价值观",
      source: "VR03, VR12",
      templateText: "这一部分会看自由、稳定、成长、关系和真实表达在你心里的优先级。"
    },
    {
      title: "世界观",
      source: "VR04, VR05",
      templateText: "这一部分会看你更相信努力、环境、运气弹性，还是适合自己最重要。"
    },
    {
      title: "消费观与家庭观",
      source: "VR06, VR07, VR08, VR09, VRO02, VRO03",
      templateText: "这一部分会看钱、家庭边界和现实议题如何影响你对长期关系的判断。"
    },
    {
      title: "现实选择观",
      source: "VR10, VR11, VRO04",
      templateText: "这一部分会看事业、生活质量、稳定和自由发生冲突时，你会如何取舍。"
    }
  ],
  intimacyMechanism: [
    {
      title: "安全感机制",
      source: "IM01, IM02, IM03, IMO01",
      templateText: "这一部分会看什么样的回应、承诺和行动会让你确认关系是安全的。"
    },
    {
      title: "亲密距离",
      source: "IM04, IM05, IMO02",
      templateText: "这一部分会看你需要多近的连接，也需要保留多少自己的空间。"
    },
    {
      title: "表达爱与接收爱",
      source: "IM06, IM07",
      templateText: "这一部分会对比你希望怎样被爱，以及你通常怎样表达喜欢。"
    },
    {
      title: "冲突修复",
      source: "IM08, IM09, IM10, IM13, IMO03, IMO05",
      templateText: "这一部分会看你在冲突里如何启动、关闭、解释、防御和修复。"
    },
    {
      title: "吸引与承诺",
      source: "IM11, IM12, IMO04",
      templateText: "这一部分会看你被安全、刺激、精神同频还是共同成长吸引。"
    }
  ],
  partnerReality: [
    {
      title: "伴侣核心特质",
      source: "PR01, PR02, PR03, PRO01",
      templateText: "这一部分会看你真正想保留的伴侣特质，以及这些特质背后的需求。"
    },
    {
      title: "现实匹配条件",
      source: "PR04, PR05, PR06, PR07, PR08, PR09, PR13, PRO03",
      templateText: "这一部分会看城市、经济、外形、婚育、职业和家庭介入这些现实条件。"
    },
    {
      title: "风险识别",
      source: "PR10, PR11, PRO02, PRO04",
      templateText: "这一部分会看你容易被什么吸引，以及哪些状态不适合长期生活。"
    },
    {
      title: "行动建议输入",
      source: "PR14, PRO05, PRO06",
      templateText: "这一部分会把你的奥德赛支持需求转成具体行动、书单和练习。"
    }
  ]
};

const stageInsufficiencies: Record<GeneratedStageReport["layer"], string[]> = {
  selfFoundation: [
    "如果习惯先自己消化，亲近的人可能不知道你真正需要什么。",
    "如果太依赖外界评价，你的自我状态容易被关系里的小波动牵着走。"
  ],
  valuesScript: [
    "如果自由、稳定和成长都想同时最大化，真实关系里会很难取舍。",
    "钱、家庭和城市这类现实议题如果太晚谈，容易在认真后才爆发。"
  ],
  intimacyMechanism: [
    "如果把不确定性误认为吸引力，容易被高张力关系反复消耗。",
    "冲突里如果只等待对方理解，修复会变慢，也更容易误会升级。"
  ],
  partnerReality: [
    "如果只看强吸引，很容易忽略对方是否真的能一起生活。",
    "不可协商项太多会让关系难开始，太少又会让你长期委屈。"
  ]
};

const stageActionCards: Record<GeneratedStageReport["layer"], GeneratedStageReport["actionCards"]> = {
  selfFoundation: [
    { title: "能量记录", body: "连续 3 天记录让你恢复能量和消耗能量的场景。" },
    { title: "需求翻译", body: "把一句“我不舒服”改写成一个具体请求。" }
  ],
  valuesScript: [
    { title: "五项排序", body: "把自由、稳定、成长、家庭、金钱按当前重要性排序。" },
    { title: "现实议题预演", body: "选一个最不想谈的问题，写出你希望如何被讨论。" }
  ],
  intimacyMechanism: [
    { title: "冲突复盘", body: "回忆一次冲突，写下当时真正想要的是解释、空间还是承诺。" },
    { title: "表达练习", body: "把“你怎么不懂我”改成“我希望你现在能……”" }
  ],
  partnerReality: [
    { title: "底线清单", body: "列出 3 个不可协商项和 3 个可以磨合项。" },
    { title: "吸引校验", body: "写下一个强烈吸引你的人，再写 TA 是否适合长期生活的证据。" }
  ]
};

const stageReadingCards: Record<GeneratedStageReport["layer"], GeneratedStageReport["readingCards"]> = {
  selfFoundation: [
    { title: "《Self-Compassion》", reason: "适合理解自我关怀、内在批评和低落时怎样温柔地对待自己。" },
    { title: "情绪记录工作簿", reason: "帮助你把抽象感受转成可观察的日常信号。" }
  ],
  valuesScript: [
    { title: "《Designing Your Life》", reason: "适合梳理奥德赛时期的价值排序、人生原型和现实取舍。" },
    { title: "《Eight Dates》", reason: "适合把金钱、家庭、梦想和长期关系议题变成可讨论的问题。" }
  ],
  intimacyMechanism: [
    { title: "《非暴力沟通》", reason: "适合练习把情绪和责备翻译成清晰请求。" },
    { title: "《Hold Me Tight》", reason: "帮助你理解安全感、距离和冲突修复。" }
  ],
  partnerReality: [
    { title: "《Eight Dates》", reason: "适合提前讨论城市、金钱、家庭、婚育和工作节奏。" },
    { title: "关系底线清单", reason: "帮助你区分强吸引、适合长期和可协商空间。" }
  ]
};

const openTextSignals = (answers: AssessmentAnswer[]) =>
  answers
    .filter((answer) => questionBank.find((question) => question.id === answer.questionId)?.type === "openText")
    .map((answer) => String(answer.value))
    .filter(Boolean);

const answerForQuestion = (answers: AssessmentAnswer[], questionId: string) =>
  answers.find((answer) => answer.questionId === questionId);

const answerMatches = (answers: AssessmentAnswer[], trigger: ArchetypeTrigger) => {
  const answer = answerForQuestion(answers, trigger.questionId);

  if (!answer) {
    return false;
  }

  const values = Array.isArray(answer.value) ? answer.value : [answer.value];

  return values.some((value) => trigger.values.includes(String(value)));
};

const parseSemanticSignalsFromAnswer = (value: AssessmentAnswer["value"]) => {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  const rawValue = String(value).trim();

  if (!rawValue.startsWith("{") && !rawValue.startsWith("[")) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as { signals?: unknown } | unknown[];

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }

    if (Array.isArray(parsed.signals)) {
      return parsed.signals.map(String);
    }
  } catch {
    return [];
  }

  return [];
};

const semanticSignalsForOpenAnswer = (answer: AssessmentAnswer) => {
  const explicitSignals = parseSemanticSignalsFromAnswer(answer.value);
  const fallbackSignals = openQuestionSemanticFallbacks[answer.questionId] ?? [];

  return [...new Set([...explicitSignals, ...fallbackSignals])];
};

const aiTriggerMatches = (answers: AssessmentAnswer[], trigger: ArchetypeAiTrigger) => {
  const openAnswers = answers.filter((answer) => {
    const question = questionBank.find((item) => item.id === answer.questionId);

    return question?.type === "openText" && (!trigger.questionId || answer.questionId === trigger.questionId);
  });
  const semanticSignals = new Set(openAnswers.flatMap(semanticSignalsForOpenAnswer));

  if (semanticSignals.size === 0) {
    return false;
  }

  return trigger.semanticSignals.some((signal) => semanticSignals.has(signal));
};

const explicitStructuredValuesByQuestion = (rules: ArchetypeRule[]) => {
  const covered = new Map<string, Set<string>>();

  rules.forEach((rule) => {
    rule.structuredTriggers.forEach((trigger) => {
      const values = covered.get(trigger.questionId) ?? new Set<string>();

      trigger.values.forEach((value) => values.add(value));
      covered.set(trigger.questionId, values);
    });
  });

  return covered;
};

const strongestDimensionForOption = (effect: Record<string, number | undefined>) =>
  Object.entries(effect)
    .filter(([, value]) => typeof value === "number")
    .sort((left, right) => Math.abs(right[1] ?? 0) - Math.abs(left[1] ?? 0))[0]?.[0] as
    | keyof AssessmentScoreResult["dimensionScores"]
    | undefined;

const fallbackStructuredEvidenceForRule = (
  answers: AssessmentAnswer[],
  rule: ArchetypeRule,
  coveredValues: Map<string, Set<string>>
) => {
  const evidence: string[] = [];
  let fallbackScore = 0;

  answers.forEach((answer) => {
    const question = questionBank.find((item) => item.id === answer.questionId);

    if (!question || question.type === "openText" || question.layer !== rule.layer) {
      return;
    }

    const answerValues = Array.isArray(answer.value) ? answer.value.map(String) : [String(answer.value)];

    answerValues.forEach((answerValue) => {
      if (coveredValues.get(question.id)?.has(answerValue)) {
        return;
      }

      const option = question.options.find((item) => item.value === answerValue);
      const strongestDimension = option ? strongestDimensionForOption(option.effect) : undefined;
      const fallbackArchetype = strongestDimension
        ? dimensionArchetypeFallbacks[rule.layer][strongestDimension]
        : undefined;

      if (fallbackArchetype === rule.archetype.name) {
        fallbackScore += 1;
        evidence.push(`兜底归类：${question.id}「${option?.label ?? answerValue}」体现${strongestDimension}`);
      }
    });
  });

  return { fallbackScore, evidence };
};

export const auditArchetypeOptionCoverage = () => {
  const missing: Array<{
    questionId: string;
    optionValue: string;
    optionLabel: string;
    reason: string;
  }> = [];

  stageDefinitions.forEach((stage) => {
    const rules = stageArchetypeRules[stage.layer];
    const coveredValues = explicitStructuredValuesByQuestion(rules);

    questionBank
      .filter((question) => question.layer === stage.layer && question.type !== "openText")
      .forEach((question) => {
        question.options.forEach((option) => {
          if (coveredValues.get(question.id)?.has(option.value)) {
            return;
          }

          const strongestDimension = strongestDimensionForOption(option.effect);
          const fallbackArchetype = strongestDimension
            ? dimensionArchetypeFallbacks[stage.layer][strongestDimension]
            : undefined;

          if (!fallbackArchetype) {
            missing.push({
              questionId: question.id,
              optionValue: option.value,
              optionLabel: option.label,
              reason: strongestDimension
                ? `缺少 ${stage.layer}.${strongestDimension} 的兜底角色`
                : "该选项没有显式规则，也没有可兜底的维度信号"
            });
          }
        });
      });
  });

  return missing;
};

export const auditArchetypeOptionUniqueness = () => {
  const duplicated: Array<{
    questionId: string;
    optionValue: string;
    archetypes: string[];
  }> = [];

  stageDefinitions.forEach((stage) => {
    const destinations = new Map<string, Set<string>>();

    stageArchetypeRules[stage.layer].forEach((rule) => {
      rule.structuredTriggers.forEach((trigger) => {
        trigger.values.forEach((value) => {
          const key = `${trigger.questionId}:${value}`;
          const archetypes = destinations.get(key) ?? new Set<string>();

          archetypes.add(rule.archetype.name);
          destinations.set(key, archetypes);
        });
      });
    });

    destinations.forEach((archetypes, key) => {
      if (archetypes.size <= 1) {
        return;
      }

      const [questionId, optionValue] = key.split(":");

      duplicated.push({
        questionId,
        optionValue,
        archetypes: [...archetypes]
      });
    });
  });

  return duplicated;
};

const evaluateArchetypeRule = (answers: AssessmentAnswer[], rule: ArchetypeRule): ArchetypeEvaluation => {
  const evidence: string[] = [];
  let ruleScore = 0;
  const coveredValues = explicitStructuredValuesByQuestion(stageArchetypeRules[rule.layer]);

  rule.structuredTriggers.forEach((trigger) => {
    if (answerMatches(answers, trigger)) {
      ruleScore += trigger.weight;
      evidence.push(trigger.signal);
    }
  });

  const fallback = fallbackStructuredEvidenceForRule(answers, rule, coveredValues);

  ruleScore += fallback.fallbackScore;
  evidence.push(...fallback.evidence);

  rule.aiTriggers.forEach((trigger) => {
    if (aiTriggerMatches(answers, trigger)) {
      ruleScore += trigger.weight;
      evidence.push(trigger.signal);
    }
  });

  return {
    rule,
    score: ruleScore,
    evidence
  };
};

const deriveStageArchetype = (answers: AssessmentAnswer[], layer: GeneratedStageReport["layer"]) => {
  const evaluations = stageArchetypeRules[layer]
    .map((rule) => evaluateArchetypeRule(answers, rule))
    .sort((left, right) => right.score - left.score);
  const primary = evaluations[0];
  const secondary = evaluations[1];
  const gap = primary.score - (secondary?.score ?? 0);
  const confidence: GeneratedStageReport["archetype"]["confidence"] =
    primary.score >= 12 && gap >= 4 ? "高" : primary.score >= 6 ? "中" : "低";

  return {
    ...primary,
    archetype: {
      ...primary.rule.archetype,
      evidence: primary.evidence.length > 0 ? primary.evidence.slice(0, 3) : primary.rule.roleSignals.slice(0, 3),
      secondaryName: secondary?.rule.archetype.name ?? primary.rule.archetype.name,
      confidence
    },
    secondary
  };
};

const deriveOpenTextInsights = (answers: AssessmentAnswer[]) => {
  const joined = openTextSignals(answers).join(" ");
  const insights = [
    joined.includes("沟通") ? "你把清晰沟通视为关系安全感的重要来源。" : "",
    joined.includes("稳定") || joined.includes("回应") ? "稳定回应会明显增强你对关系的信任。" : "",
    joined.includes("边界") || joined.includes("空间") ? "你需要亲密关系里保留可被尊重的个人边界。" : "",
    joined.includes("成长") ? "你希望关系能支持双方共同成长，而不是停在原地。" : "",
    joined.includes("承诺") ? "明确承诺和可预期行动，会帮助你确认关系是否值得投入。" : ""
  ].filter(Boolean);

  return insights.length > 0 ? insights.slice(0, 3) : [];
};

const answersByLayer = (answers: AssessmentAnswer[], layer: GeneratedStageReport["layer"]) => {
  const ids = new Set(questionBank.filter((question) => question.layer === layer).map((question) => question.id));
  return answers.filter((answer) => ids.has(answer.questionId));
};

export function generateReport(answers: AssessmentAnswer[], isUnlocked: boolean): GeneratedReport {
  const score = scoreAssessment(answers);
  const template = reportTemplates[score.primaryType];
  const secondary = reportTemplates[score.secondaryType];
  const signals = deriveOpenTextInsights(answers);
  const emotionalNeeds = signals.length > 0 ? signals : template.insights;
  const selfPortrait = {
    personality: template.selfPortrait,
    relationshipPattern: [template.summary, secondary.summary],
    emotionalNeeds
  };
  const values = {
    lifeView: ["你需要一段能承接现阶段探索和长期方向的关系。"],
    consumptionView: ["金钱议题建议尽早谈清楚：安全垫、体验消费和共同账户边界。"],
    familyView: ["双方家庭的参与程度，需要在关系认真前形成共同规则。"],
    careerView: ["事业与生活的优先级，是你判断长期适配的重要变量。"]
  };
  const idealPartner = {
    coreTraits: template.idealPartner,
    communicationStyle: ["表达清楚", "遇到问题愿意修复", "不靠猜测处理关系"],
    lifeRhythm: ["与你的稳定/探索需求相匹配", "能尊重当下阶段的不确定"],
    realisticConditions: ["城市选择可讨论", "经济责任感清晰", "家庭边界可协商"]
  };
  const risks = {
    highRiskTypes: template.risks,
    blindSpots: ["容易把吸引力误认为长期适配", "容易低估现实节奏差异"],
    earlyWarningSignals: ["长期模糊关系", "冲突后拒绝沟通", "重要现实议题回避讨论"]
  };
  const actionPlan = {
    nonNegotiables: template.actions.slice(0, 2),
    negotiables: ["生活城市", "消费比例", "见面频率"],
    firstDateQuestions: [
      "你现在最想建立一种什么样的生活？",
      "你如何处理关系里的冲突？",
      "你对未来三年的城市、事业和家庭有什么想法？"
    ],
    relationshipAdvice: template.actions,
    dailyPractices: [
      "每周记录一次让你感觉被尊重或被消耗的关系瞬间。",
      "把择偶偏好拆成不可妥协、可协商、只是加分三层。",
      "遇到模糊信号时，先提出一个清晰问题，而不是反复猜测。"
    ],
    readingList: [
      "亲密关系沟通：非暴力沟通、依恋类型、冲突修复。",
      "自我认知：人生阶段、价值排序、边界感练习。",
      "现实协商：金钱观、家庭边界、长期生活规划。"
    ],
    selfCarePrompts: [
      "我在关系里最怕失去的是什么？",
      "什么样的日常相处会让我更像自己？",
      "我愿意为长期关系调整什么，又不愿牺牲什么？"
    ]
  };
  const stageReports: GeneratedStageReport[] = stageDefinitions.map((stage, index) => {
    const archetypeResult = deriveStageArchetype(answers, stage.layer);
    const layerAnswers = answersByLayer(answers, stage.layer);
    const totalQuestions = questionBank.filter((question) => question.layer === stage.layer).length;
    const isComplete = layerAnswers.length >= totalQuestions;
    const dimensionValues = stage.dimensions.map((dimension) => ({
      label: dimension.label,
      value: score.dimensionScores[dimension.key]
    }));
    const strongest = [...dimensionValues].sort((left, right) => right.value - left.value)[0];

    const stageHighlights: Record<GeneratedStageReport["layer"], string[]> = {
      selfFoundation: [
        `${archetypeResult.archetype.name}是这一阶段最能解释你的主导信号。`,
        template.selfPortrait[0],
        emotionalNeeds[0],
        strongest ? `${strongest.label}是这一阶段最突出的信号。` : "你的自我底色会影响后续关系选择。"
      ],
      valuesScript: [
        `${archetypeResult.archetype.name}是这一阶段最能解释你的价值排序。`,
        values.lifeView[0],
        values.consumptionView[0],
        values.familyView[0]
      ],
      intimacyMechanism: [
        `${archetypeResult.archetype.name}是这一阶段最能解释你的亲密模式。`,
        selfPortrait.relationshipPattern[0],
        idealPartner.communicationStyle[0],
        risks.earlyWarningSignals[1]
      ],
      partnerReality: [
        `${archetypeResult.archetype.name}是这一阶段最能解释你的伴侣偏好。`,
        idealPartner.coreTraits[0],
        idealPartner.lifeRhythm[0],
        risks.blindSpots[0]
      ]
    };

    const nextSteps: Record<GeneratedStageReport["layer"], string> = {
      selfFoundation: "下一步会继续看你的价值排序，判断什么样的生活选择真正适合你。",
      valuesScript: "下一步会进入亲密模式，识别你在关系里如何建立安全感和边界。",
      intimacyMechanism: "下一步会把你的关系机制翻译成更具体的理想伴侣画像。",
      partnerReality: "四段探索完成后，可以生成完整关系报告和付费解锁深度建议。"
    };
    const stageStrengths: Record<GeneratedStageReport["layer"], string[]> = {
      selfFoundation: [
        "你已经开始把抽象的性格感受拆成可观察的行为信号。",
        "你对自己如何恢复能量、如何做决定有了更清楚的轮廓。"
      ],
      valuesScript: [
        "你能把自由、稳定、成长、家庭这些大词落到具体生活选择里。",
        "你开始分辨什么是当下偏好，什么是长期生活里真正重要的排序。"
      ],
      intimacyMechanism: [
        "你对安全感、边界和沟通方式的需求正在变得更具体。",
        "你开始看见自己在冲突里是靠靠近、抽离、解释还是修复来应对。"
      ],
      partnerReality: [
        "你已经把理想伴侣从感觉层面推进到生活节奏和现实条件层面。",
        "你能更清楚地区分短期吸引和长期适配。"
      ]
    };
    const stageWatchOuts: Record<GeneratedStageReport["layer"], string[]> = {
      selfFoundation: [
        "不要急着把自己定型，阶段报告只是帮你看见当前更明显的模式。",
        "如果答案里同时出现稳定和探索需求，后续要继续看它们如何排序。"
      ],
      valuesScript: [
        "价值观不是口号，真正的冲突通常发生在金钱、城市、家庭参与和时间分配里。",
        "如果你把所有条件都设成不可妥协，最终会降低真实关系里的协商空间。"
      ],
      intimacyMechanism: [
        "安全感需求和控制需求容易混在一起，需要继续区分清楚。",
        "冲突中的第一反应不等于最终能力，重点看你是否愿意修复。"
      ],
      partnerReality: [
        "被吸引的人不一定适合长期生活，报告会继续拆解这两者的差异。",
        "现实条件不是功利，它是在保护长期关系的基本可持续性。"
      ]
    };
    const stagePractices: Record<GeneratedStageReport["layer"], string[]> = {
      selfFoundation: [
        "记录 3 个让你感觉有能量的日常场景。",
        "写下你最近一次重要选择背后的真实理由。"
      ],
      valuesScript: [
        "把自由、稳定、成长、家庭、金钱按当前重要性排序。",
        "选一个你最怕谈的现实议题，写出你理想中的边界。"
      ],
      intimacyMechanism: [
        "回忆一次冲突：你当时最需要的是解释、拥抱、空间还是承诺？",
        "把一句“你怎么不懂我”改写成一个清晰请求。"
      ],
      partnerReality: [
        "列出 3 个不可妥协项和 3 个可协商项。",
        "回想一个强烈吸引你的人，写下 TA 适合长期生活的证据。"
      ]
    };
    const stageAiSignals: Record<GeneratedStageReport["layer"], string> = {
      selfFoundation: signals[0] ?? "开放题会进一步补充你如何恢复能量、如何被理解，以及哪些场景最像真实的你。",
      valuesScript: signals[1] ?? "开放题会进一步补充你对钱、家庭、生活选择和奥德赛时期支持方式的真实表达。",
      intimacyMechanism: signals[2] ?? "开放题会进一步补充你在关系里如何获得安全感、如何处理冲突和边界。",
      partnerReality: signals[0] ?? "开放题会进一步补充你对理想伴侣、不可协商项和长期生活风险的真实判断。"
    };
    const sections = stageSectionTemplates[stage.layer].map((section, sectionIndex) => ({
      ...section,
      templateText: archetypeResult.rule.sectionTone[section.title]
        ? `${section.templateText} ${archetypeResult.rule.sectionTone[section.title]}`
        : section.templateText,
      aiSignal: sectionIndex === 0 ? stageAiSignals[stage.layer] : undefined
    }));

    return {
      layer: stage.layer,
      order: index + 1,
      title: stage.title,
      reportTitle: stage.reportTitle,
      coreQuestion: stage.coreQuestion,
      subtitle: stage.subtitle,
      score: score.layerScores[stage.layer],
      answerCount: layerAnswers.length,
      totalQuestions,
      isComplete,
      summary: isComplete
        ? `${stage.reportTitle}已生成：${stage.subtitle}`
        : `${stage.reportTitle}生成中：还差 ${Math.max(totalQuestions - layerAnswers.length, 0)} 题。`,
      highlights: stageHighlights[stage.layer].filter(Boolean).slice(0, 3),
      strengths: stageStrengths[stage.layer],
      watchOuts: stageWatchOuts[stage.layer],
      practices: stagePractices[stage.layer],
      dimensions: dimensionValues,
      nextStep: nextSteps[stage.layer],
      archetype: archetypeResult.archetype,
      sections,
      insufficiencies: archetypeResult.rule.insufficiencies,
      aiSupplement: stageAiSignals[stage.layer],
      actionCards: archetypeResult.rule.actionCards,
      readingCards: archetypeResult.rule.readingCards
    };
  });
  const modules = [
    {
      title: "关系自画像",
      items: [
        `主类型：${score.primaryType}`,
        `副倾向：${score.secondaryType}`,
        template.summary,
        ...template.insights.slice(0, 2)
      ]
    },
    {
      title: "我是谁",
      items: [...selfPortrait.personality, ...selfPortrait.emotionalNeeds.slice(0, 2)]
    },
    {
      title: "我的三观",
      items: [...values.lifeView, ...values.consumptionView, ...values.familyView, ...values.careerView]
    },
    {
      title: "我的亲密关系机制",
      items: [...selfPortrait.relationshipPattern, ...idealPartner.communicationStyle]
    },
    {
      title: "适合我的 TA",
      items: [...idealPartner.coreTraits, ...idealPartner.lifeRhythm, ...idealPartner.realisticConditions]
    },
    {
      title: "高风险关系类型",
      items: [...risks.highRiskTypes, ...risks.blindSpots, ...risks.earlyWarningSignals]
    },
    {
      title: "行动建议",
      items: [
        ...actionPlan.nonNegotiables,
        ...actionPlan.negotiables,
        ...actionPlan.firstDateQuestions,
        ...actionPlan.dailyPractices.slice(0, 2)
      ]
    }
  ];

  return {
    isUnlocked,
    score,
    stageReports,
    preview: {
      primaryType: score.primaryType,
      secondaryType: score.secondaryType,
      oneLine: template.summary,
      insights: template.insights.slice(0, 3),
      lockedSections: ["完整自我画像", "三观地图", "适合我的 TA", "高风险类型", "AI 行动建议"]
    },
    fullReport: isUnlocked
      ? {
          modules,
          selfPortrait,
          values,
          idealPartner,
          risks,
          actionPlan,
          archetypeLineup: stageReports.map((stage) => stage.archetype.name),
          crossStageInsights: [
            "你的关系选择会同时受到自我恢复方式、价值排序和安全感机制影响。",
            "适合你的 TA 不只是符合偏好，还要能承接你的现实议题和冲突修复方式。",
            "最终报告会把四个阶段的角色组合成一份可行动的关系说明书。"
          ]
        }
      : null
  };
}
