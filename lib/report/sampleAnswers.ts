import { questionBank } from "@/lib/assessment/questionBank";
import type { AssessmentAnswer } from "@/lib/assessment/types";

const openAnswer = (text: string, signals: string[]) =>
  JSON.stringify({
    text,
    signals
  });

const sampleAnswerValues: Record<string, string | string[]> = {
  SF01: "C",
  SF02: "A",
  SF03: "4",
  SF04: "C",
  SF05: "5",
  SF06: "A",
  SF07: "A",
  SF08: "4",
  SF09: "D",
  SF10: "2",
  SF11: ["stability", "life_quality", "family", "growth", "understood"],
  SFO01: openAnswer(
    "上个月我拒绝了一个临时加塞的聚会，留在家里把房间整理好、做饭、把第二天的计划写出来。那一刻我没有为了显得合群去勉强自己，而是很清楚地知道：我需要一个稳定的晚上，第二天才有力气继续工作和社交。",
    ["boundary_need", "self_regulation", "stable_space"]
  ),
  SFO02: openAnswer(
    "最近一次情绪波动是项目突然变动，我一开始会沉默、想自己消化。后来我先散步半小时，再把问题拆成三件能做的事，最后跟朋友简单说了我的压力。对我来说，先恢复秩序，再沟通，会比马上被追问更有效。",
    ["self_regulation", "planning_orientation", "problem_decomposition"]
  ),
  SFO03: openAnswer(
    "我希望身边的人理解，我需要空间不代表我不在乎。很多时候我只是要先把自己整理好，再回来认真沟通。如果对方能尊重这个节奏，我反而会更愿意靠近。",
    ["boundary_need", "stable_space", "clear_expression_need"]
  ),

  VR01: "A",
  VR02: "B",
  VR03: ["emotion", "wealth", "family"],
  VR04: "A",
  VR05: "B",
  VR06: "A",
  VR07: "5",
  VR08: "A",
  VR09: "5",
  VR10: "B",
  VR11: "A",
  VR12: "A",
  VRO01: openAnswer(
    "我觉得现阶段过得好，是生活有基本秩序，收入能覆盖安全垫，身边有少数稳定可靠的人，同时我还能继续学习和探索。不是每天都很兴奋，而是醒来知道自己在往一个更踏实的方向走。",
    ["stable_space", "money_security", "growth_support"]
  ),
  VRO02: openAnswer(
    "钱在亲密关系里首先意味着共同安全和责任，不是用来比较谁更厉害。两个人可以收入不同，但要愿意谈预算、风险、储蓄和消费边界。遇到变化时，钱应该成为缓冲垫，而不是互相指责的武器。",
    ["money_security", "shared_responsibility", "risk_buffer"]
  ),
  VRO03: openAnswer(
    "我希望未来伴侣对原生家庭有爱，但边界清楚。重要决定应该先回到两个人之间讨论，而不是被父母的意见牵着走。双方家庭可以互相尊重，但不能越过我们的共同规则。",
    ["family_boundary", "non_negotiable_boundary", "shared_responsibility"]
  ),
  VRO04: openAnswer(
    "如果未来三年我还在探索，我希望理想中的伴侣能理解这是阶段状态，而不是不靠谱。TA 可以和我一起复盘目标，也能在我焦虑时给稳定回应；如果我需要试错，TA 不急着否定，但会帮我看清现实成本。",
    ["odyssey_support", "growth_support", "stable_reassurance"]
  ),

  IM01: "A",
  IM02: "B",
  IM03: "3",
  IM04: "4",
  IM05: "B",
  IM06: ["heard", "companionship", "action"],
  IM07: ["care", "support", "future"],
  IM08: "B",
  IM09: "5",
  IM10: "D",
  IM11: "A",
  IM12: ["commitment", "company", "emotion", "spiritual", "space"],
  IM13: ["silent", "disappear", "no_apology"],
  IMO01: openAnswer(
    "让我特别有安全感的时刻，是对方很忙但会提前说明，并且晚上真的回来跟我同步。不是一直黏着，而是我知道关系没有被搁置。遇到问题时，TA 愿意一起面对，而不是让我独自猜。",
    ["relationship_security", "stable_reassurance", "clear_commitment"]
  ),
  IMO02: openAnswer(
    "我最需要保留的是独处和工作节奏。比如周末半天不安排社交，或者晚上有一段不被打扰的时间。我希望这块空间被尊重，同时我也会告诉对方我什么时候回来连接。",
    ["space_need", "boundary_need", "cool_down_before_repair"]
  ),
  IMO03: openAnswer(
    "如果冲突后对方长期失联、拒绝复盘，或者把我的感受说成小题大做，我会觉得关系可能不行了。我可以接受争吵，但不能接受问题被扔在那里，谁也不修。",
    ["conflict_boundary", "repair_need", "communication_breakdown"]
  ),
  IMO04: openAnswer(
    "我容易被稳定、认真、有生活能力的人吸引。TA 不一定很会说漂亮话，但要让人感觉答应的事情会做到，遇到现实问题也能坐下来谈。我会觉得这种人很可靠，也更适合长期。",
    ["partner_steadiness", "life_competence", "long_term_fit"]
  ),
  IMO05: openAnswer(
    "我在亲密关系里容易犯的错误，是不舒服时先自己忍或先退回去，等整理好了才说。这样看起来很冷静，但对方可能不知道我到底发生了什么。下一步我想练习更早、更清楚地表达需求。",
    ["self_awareness", "clear_expression_need", "cool_down_before_repair"]
  ),

  PR01: "A",
  PR02: ["emotion_stable", "money_responsible", "communicate"],
  PR03: "5",
  PR04: "D",
  PR05: "A",
  PR06: "A",
  PR07: "B",
  PR08: "D",
  PR09: "D",
  PR10: "A",
  PR11: ["hot_cold", "excellent_busy", "boundary_mess"],
  PR12: ["emotion", "communication", "values", "money", "personality"],
  PR13: "A",
  PR14: ["filter_partner", "communication", "reality_questions"],
  PRO01: openAnswer(
    "如果只能保留三个伴侣特质，我会选情绪稳定、愿意沟通、经济和生活上负责。原因是我想找的是能一起过日子、一起解决问题的人，而不是只在热恋期让我心动的人。",
    ["partner_core_traits", "partner_steadiness", "life_competence"]
  ),
  PRO02: openAnswer(
    "我可能会被特别优秀但忽冷忽热的人吸引，因为那种不确定会让人很想证明自己。但我知道长期看风险很高：时间不稳定、承诺模糊、边界不清，会把我拖进反复猜测里。",
    ["attraction_pattern", "risk_awareness", "unstable_attraction", "boundary_risk"]
  ),
  PRO03: openAnswer(
    "想象一起生活十年，我最害怕的是日常里没有回应，所有现实问题都靠我一个人扛。比如钱、家庭、城市、孩子这些事情都不谈清楚，最后变成疲惫和怨气。",
    ["long_term_fear", "life_quality", "emotional_climate", "family_or_life_risk"]
  ),
  PRO04: openAnswer(
    "不可协商的是尊重边界、愿意沟通、没有长期失联和冷暴力、重大现实议题不逃避。可以磨合的是城市、见面频率、消费比例和生活习惯，但前提是双方都愿意把话说清楚。",
    ["non_negotiable_boundary", "negotiable_space", "screening_questions"]
  ),
  PRO05: openAnswer(
    "我希望未来的 TA 陪我度过奥德赛时期的方式，是既给我稳定回应，也允许我阶段性探索。TA 不需要替我做决定，但可以和我一起复盘选择、提醒现实成本，并在我迷茫时不轻易否定我。",
    ["odyssey_support", "stable_reassurance", "partner_core_traits"]
  ),
  PRO06: openAnswer(
    "我现在最想改善的是更早表达需求，不要等自己完全消化完才开口。我也想练习把择偶条件分成不可协商、可磨合和加分项，避免在强吸引面前忽略长期风险。",
    ["growth_theme", "clear_expression_need", "self_care_practice", "reading_direction"]
  )
};

export const samplePersona = {
  name: "样例用户 A",
  profile: "26 岁，处在奥德赛探索期，正在稳定工作与继续探索之间寻找节奏。",
  path:
    "这套样例作答强调稳定回应、现实共建、清晰沟通和个人边界，用来演示一份完整报告如何从 68 道答案生成。"
};

export const sampleAnswers: AssessmentAnswer[] = questionBank.map((question) => {
  const value = sampleAnswerValues[question.id];

  if (value === undefined) {
    throw new Error(`Missing sample answer for ${question.id}`);
  }

  return {
    questionId: question.id,
    value
  };
});
