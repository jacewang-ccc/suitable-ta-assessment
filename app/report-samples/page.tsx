import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  Compass,
  HeartHandshake,
  Home,
  Sparkles,
  Star,
  UserRound
} from "lucide-react";
import { generateReport } from "@/lib/report/generator";
import { sampleAnswers, samplePersona } from "@/lib/report/sampleAnswers";

const roleImageByName: Record<string, string> = {
  灯塔守护者: "/role-stickers/01-lighthouse-keeper.png",
  风帆冒险家: "/role-stickers/02-sail-adventurer.png",
  云朵疗愈师: "/role-stickers/03-cloud-healer.png",
  星图规划师: "/role-stickers/04-star-map-planner.png",
  罗盘探路者: "/role-stickers/05-compass-seeker.png",
  港湾建造师: "/role-stickers/06-harbor-builder.png",
  山顶攀登者: "/role-stickers/07-summit-climber.png",
  花园照料者: "/role-stickers/08-garden-caretaker.png",
  篝火守望者: "/role-stickers/09-campfire-guardian.png",
  海雾观察员: "/role-stickers/10-mist-observer.png",
  双桨修复师: "/role-stickers/11-double-paddle-repairer.png",
  星火追逐者: "/role-stickers/12-spark-chaser.png",
  港口共建者: "/role-stickers/13-port-co-builder-single.png",
  星图同行者: "/role-stickers/14-starmap-companion.png",
  暖炉陪伴者: "/role-stickers/15-hearth-companion.png",
  风暴识别师: "/role-stickers/16-storm-spotter-clean.png"
};

const stageIcons = [UserRound, Compass, HeartHandshake, Star];

const realStageReports = [
  {
    layer: "selfFoundation",
    title: "自我画像报告",
    role: "灯塔守护者",
    question: "我以什么状态进入关系？",
    summary:
      "你的关系起点不是“赶紧找到一个人”，而是先确认自己有没有稳定下来。你会被亲密关系吸引，但真正决定你能不能靠近的，是对方是否尊重你的节奏、空间和边界。",
    findings: [
      {
        title: "性格能量",
        body:
          "你不是完全外向或完全内向，而是“先回到自己，再选择连接”的混合型。高强度工作后，你会更需要整理房间、睡觉、独处或把计划写清楚；如果这段恢复时间被打断，你会明显变得迟钝、烦躁，甚至不想解释。"
      },
      {
        title: "情绪复原",
        body:
          "你有恢复能力，但恢复入口偏“秩序感”。项目变化、临时安排、别人突然追问，都会让你先进入沉默模式。对你有效的支持不是立刻开导，而是给你一点缓冲，再陪你把问题拆成能做的几步。"
      },
      {
        title: "行动方式",
        body:
          "你做决定时会先看事实、长期影响和安全边界。你不是不敢冒险，而是不喜欢在信息混乱、关系不清楚的时候被推着走。关系里如果对方一直模糊，你会逐渐退回观察位。"
      },
      {
        title: "自我需求",
        body:
          "你最需要被理解的是：空间不是冷淡，慢一点不是拒绝。你希望别人知道你会回来沟通，只是需要先把自己整理好。一个成熟的伴侣要能接住这个节奏，而不是把它解读成不爱。"
      }
    ],
    ai:
      "AI 综合开放题判断：你反复提到“整理好再沟通”“需要空间但会回来”“稳定的晚上”，说明你的安全感不是来自被频繁关注，而是来自边界被尊重后的自主靠近。",
    action:
      "写一段可以直接发给未来伴侣的话：我压力大时会先安静一会儿，这不是不想理你。我需要大概 2-3 小时恢复，之后我会回来把事情说清楚。你可以做的是别连续追问，但可以给我一句“我在，等你回来”。",
    reading: "推荐阅读：《Self-Compassion》；练习：连续 7 天记录“我什么时候最像我自己”。"
  },
  {
    layer: "valuesScript",
    title: "价值罗盘报告",
    role: "港湾建造师",
    question: "我的三观和生活选择是什么？",
    summary:
      "你的价值排序不是单纯求稳，而是希望在奥德赛时期先把生活修出一个可停靠的地方。稳定、钱、家庭边界和长期责任，对你来说不是功利，而是关系能不能走远的基础设施。",
    findings: [
      {
        title: "人生观",
        body:
          "你对“过得好”的定义很现实：生活有基本秩序，有稳定收入或安全垫，有少数可靠的人，同时还保留继续学习和探索的空间。你不追求每天热烈，但很在意自己是不是往更踏实的方向走。"
      },
      {
        title: "价值观",
        body:
          "你会把稳定、生活质量、家庭安心和成长放在很靠前的位置。你不是不想自由，而是希望自由建立在不失控的生活底座上。关系里最打动你的不是浪漫宣言，而是对方持续履行承诺。"
      },
      {
        title: "世界观",
        body:
          "你相信长期关系需要规则、善意和共同承担。你不太能接受“爱就应该自然懂”的说法，更倾向于把钱、家庭、城市、工作节奏提前谈清楚。你相信清楚不是破坏浪漫，而是在保护关系。"
      },
      {
        title: "消费观与家庭观",
        body:
          "钱对你意味着共同安全，而不是面子。你希望双方能谈预算、储蓄、风险和消费边界。对双方家庭，你的理想状态是尊重但不越界：重要决定先回到两个人之间，而不是被父母意见推着走。"
      }
    ],
    ai:
      "AI 综合开放题判断：你把“钱”描述为缓冲垫，把“家庭”描述为需要共同规则，说明你在关系中非常看重现实可持续性。你的三观核心不是保守，而是希望选择有后果感、关系有托底。 ",
    action:
      "做一张“稳定清单”：分别写下你对收入、储蓄、承诺、情绪回应、家庭边界的最低期待。下一次进入认真关系前，至少挑 2 项和对方聊清楚。",
    reading: "推荐阅读：《Eight Dates》金钱与家庭章节；练习：写下你最害怕谈、但必须谈的 3 个现实议题。"
  },
  {
    layer: "intimacyMechanism",
    title: "亲密模式报告",
    role: "篝火守望者",
    question: "我会怎样爱人，又希望怎样被爱？",
    summary:
      "你需要的亲密不是全天候黏在一起，而是关系本身被确认。你可以给彼此空间，也能接受对方忙，但你需要知道这段关系没有被搁置、没有被模糊处理。",
    findings: [
      {
        title: "安全感机制",
        body:
          "让你安心的不是秒回，而是稳定可预期。比如对方很忙但会提前说，晚上真的回来同步；冲突后不失联，愿意一起复盘。这些具体行为会让你感觉“火还在”。"
      },
      {
        title: "亲密距离",
        body:
          "你既需要陪伴，也需要独处。你理想中的联系频率是稳定但不黏：日常有回应，压力大时能说明情况，各自有空间但不是各自消失。你讨厌的是没有解释的冷淡。"
      },
      {
        title: "表达爱与接收爱",
        body:
          "你表达喜欢的方式偏实际：照顾对方、给建议和支持、为未来做计划。你接收爱的方式也偏具体：被认真听见、稳定陪伴、实际行动。空泛的“我爱你”不如一次真正兑现。"
      },
      {
        title: "冲突修复",
        body:
          "你愿意修复，但不想一个人修。你可以冷静后再谈，也愿意复盘，但如果对方长期失联、拒绝道歉、把你的感受说成小题大做，你会快速判断这段关系不安全。"
      }
    ],
    ai:
      "AI 综合开放题判断：你描述安全感时没有强调“对方一直陪着”，而是强调提前说明、回来同步、共同面对。这说明你的核心需求是稳定承诺和可修复性，不是控制对方。",
    action:
      "建立一份“安心动作清单”：1. 忙时提前说大概什么时候回来；2. 冲突后 24 小时内至少约一个复盘时间；3. 如果需要空间，明确告诉对方多久后继续聊。",
    reading: "推荐阅读：《Hold Me Tight》；练习：把“你是不是不在乎我”改写成一个具体请求。"
  },
  {
    layer: "partnerReality",
    title: "理想伴侣报告",
    role: "港口共建者",
    question: "我适合什么样的 TA？",
    summary:
      "你适合的 TA 不是最刺激、最会撩、最让你反复猜的人，而是稳定负责、表达清楚、能一起处理现实生活的人。你需要的是心动之后还能共建，而不是只在热恋期成立。",
    findings: [
      {
        title: "伴侣核心特质",
        body:
          "你最该优先看的三个特质是：情绪稳定、愿意沟通、生活上负责。对方不一定要条件夸张，但要能兑现承诺、处理分歧、面对钱和家庭这些现实问题。"
      },
      {
        title: "现实匹配条件",
        body:
          "经济条件对你不是炫耀项，而是责任感测试。你可以接受收入差异，但不能接受没有规划、消费观混乱或重大现实议题回避。城市、婚育、忙碌期怎么留时间，也需要尽早谈。"
      },
      {
        title: "风险识别",
        body:
          "你容易被特别优秀但忽冷忽热的人吸引，因为不确定会激起证明欲。但长期看，这类人可能触发你的猜测、焦虑和自我消耗。强吸引不等于长期适配。"
      },
      {
        title: "行动建议输入",
        body:
          "你的约会观察重点不该只放在感觉，而要看对方的行为证据：是否准时回应、是否能谈现实、是否尊重边界、是否在冲突后愿意修复。"
      }
    ],
    ai:
      "AI 综合开放题判断：你对伴侣的描述集中在“情绪稳定、沟通、经济和生活负责”，并主动识别忽冷忽热的吸引风险。说明你已经知道自己容易被什么吸引，也知道真正适合长期的标准在哪里。",
    action:
      "下次约会问三个问题：1. 你忙的时候会怎么给关系留时间？2. 你怎么看两个人谈钱？3. 如果我们吵架了，你通常希望怎么修复？观察对方是否给出具体行为，而不是漂亮态度。",
    reading: "推荐阅读：《Eight Dates》；练习：把择偶条件分成不可协商、可磨合、只是加分三层。"
  }
];

const realFinalReport = {
  title: "稳定共建型关系说明书",
  summary:
    "这位样例用户不是没有探索欲，而是更需要在探索期拥有稳定底座。TA 适合清晰、负责、能共同处理现实议题的伴侣；不适合长期模糊、忽冷忽热、回避承诺和现实协商的人。",
  modules: [
    {
      title: "我是谁",
      items: [
        "你是一个需要先恢复秩序、再进入亲密的人。",
        "你能表达，也愿意修复，但不喜欢被迫在混乱中立刻回应。",
        "你真正需要的不是被过度关注，而是边界被尊重后的稳定连接。"
      ]
    },
    {
      title: "我的三观",
      items: [
        "你把稳定、生活质量、家庭边界和成长放在很高的位置。",
        "你认为钱是共同安全和风险缓冲，不是比较谁更强的工具。",
        "你相信长期关系需要规则、善意和共同承担。"
      ]
    },
    {
      title: "我的亲密关系机制",
      items: [
        "你需要明确关系和稳定回应，模糊状态会快速消耗你。",
        "你可以接受空间，但不能接受没有解释的消失。",
        "冲突后是否愿意复盘，是你判断关系安全的重要标准。"
      ]
    },
    {
      title: "适合我的 TA",
      items: [
        "情绪稳定、表达清楚、经济和生活上负责。",
        "能尊重你的独处，也能在关键时刻给出明确回应。",
        "愿意一起谈钱、家庭、城市、工作节奏等现实议题。"
      ]
    },
    {
      title: "高风险类型",
      items: [
        "忽冷忽热、让你反复猜的人。",
        "特别优秀但长期没时间、没承诺的人。",
        "家庭边界混乱，却要求你不断适应的人。",
        "冲突后失联、拒绝复盘、把问题都推给你的人。"
      ]
    },
    {
      title: "AI 行动建议",
      items: [
        "把“我想要稳定”拆成 5 个可观察动作：提前说明、准时回应、冲突复盘、谈钱、尊重边界。",
        "约会前三次不要只看心动，至少问一次现实议题。",
        "遇到强吸引对象时，写下 TA 的 3 个长期证据和 3 个长期风险。",
        "每周记录一次：这段关系让我更像自己，还是更常开始猜测？"
      ]
    }
  ]
};

const finalReportDossier = {
  quote: "我不是不想靠近别人，我只是需要先确认这段关系是稳定、清楚、可以一起处理现实问题的。",
  oneSentence:
    "你更适合一种稳定共建型关系：彼此有吸引，也愿意把钱、家庭、时间、冲突和未来计划说清楚。",
  chapters: [
    {
      title: "01 关系自画像封面",
      subtitle: "四阶段角色合成",
      body:
        "你的四个阶段角色分别是：灯塔守护者、港湾建造师、篝火守望者、港口共建者。它们共同指向一个很清楚的模式：你不是没有探索欲，而是需要在探索时期拥有稳定底座。你会认真看待关系，也会把长期生活里的现实议题纳入判断。",
      points: ["主导关系关键词：稳定、边界、责任、清晰沟通", "关系里的核心愿望：既能靠近，也能保留自己的节奏", "最需要被看见的一句话：空间不是冷淡，慢一点不是拒绝"]
    },
    {
      title: "02 我是谁",
      subtitle: "自我画像综合",
      body:
        "你进入关系前，会先确认自己是否处在一个能回应、能表达、能稳定生活的状态。高强度工作或学习后，你最自然的恢复方式不是继续社交，而是独处、睡觉、整理空间、把事情重新排顺。你愿意亲近别人，但不喜欢在混乱里被逼着立刻回应。",
      points: ["你有责任感，但不适合被催促式亲密", "你需要可以解释自己的空间，而不是被贴上冷淡标签", "当对方尊重你的节奏，你反而更愿意稳定靠近"]
    },
    {
      title: "03 我的三观地图",
      subtitle: "价值排序和现实取舍",
      body:
        "你对生活的想象并不空泛。对你来说，过得好意味着收入和生活有基本秩序，有几个能说真话的人，有边界清楚的家庭关系，也有继续成长的空间。你把钱看作安全垫，而不是炫耀；把承诺看作行动，而不是口头热情。",
      points: ["人生观：稳定底座上继续探索", "价值观：承诺、责任和长期一致性比短期浪漫更重要", "消费观：愿意为生活质量付费，但不喜欢无规划的风险"]
    },
    {
      title: "04 我的亲密机制",
      subtitle: "安全感、距离、表达和修复",
      body:
        "你需要的安全感不是全天候黏在一起，而是关系状态可预期。对方忙可以，但要提前说明；冲突可以有，但不能失联；需要空间可以，但要说清楚什么时候回来。你表达爱偏实际，会照顾、规划、支持，也希望对方用具体行动回应你。",
      points: ["安全感来源：明确关系、稳定回应、冲突后愿意复盘", "亲密距离：可以独处，但不能接受无解释消失", "修复方式：先冷静，再约定时间把问题讲清楚"]
    },
    {
      title: "05 适合我的 TA",
      subtitle: "伴侣画像和关系条件",
      body:
        "你适合的 TA 不一定是最会制造心动的人，而是情绪稳定、表达清楚、能把现实问题放到桌面上谈的人。TA 可以有自己的事业和节奏，但需要在关键时刻给出明确回应。你们之间最好能谈钱、家庭、城市、工作强度和关系时间线，而不是只靠感觉往前走。",
      points: ["核心特质：稳定负责、愿意沟通、生活上有规划", "相处节奏：日常稳定联系，忙碌时提前说明", "现实条件：金钱观、家庭边界和城市选择需要能协商"]
    },
    {
      title: "06 不可协商项",
      subtitle: "进入关系前要提前说清楚",
      body:
        "以下不是要求别人完美，而是你长期关系里的安全底线。如果一段关系长期踩中这些点，你会持续消耗，最后要么退回观察位，要么在关系里变得越来越不像自己。",
      points: ["不能长期忽冷忽热、让你靠猜测确认关系", "不能用失联、冷处理或回避来处理冲突", "不能让双方家庭越过你们两个人的共同边界", "不能在钱、城市、婚育等现实议题上长期含糊"]
    },
    {
      title: "07 可协商项",
      subtitle: "可以磨合，但需要有规则",
      body:
        "你并不是只能接受一个和自己完全一样的人。收入差异、城市节奏、联系频率、独处时间都可以协商，前提是双方愿意把规则说清楚，并且愿意在关系里复盘和调整。",
      points: ["收入差异可以协商，但消费观和责任感要一致", "联系频率可以磨合，但不能长期没有解释", "独处时间可以保留，但需要告诉对方你会回来", "家庭参与程度可以讨论，但重大决定先回到两个人之间"]
    },
    {
      title: "08 高风险类型",
      subtitle: "容易吸引你，但不一定适合长期",
      body:
        "你可能会被非常优秀、节奏强、带有一点不确定感的人吸引。因为他们会激起你的证明欲和好奇心。但对你来说，强吸引不等于长期适配。如果对方只给火花不给稳定，只给期待不给行动，这段关系会很快消耗你的安全感。",
      points: ["忽冷忽热型：让你反复猜测自己是否重要", "高光但缺席型：很优秀，但长期没有时间和承诺", "边界混乱型：家庭、前任或工作不断侵入关系", "拒绝复盘型：冲突后不沟通，只让你自己消化"]
    },
    {
      title: "09 约会提问清单",
      subtitle: "把筛选变成具体问题",
      body:
        "你不需要一上来审问对方，但需要在认真发展前，把关键现实议题慢慢放进对话里。真正适合你的人，不会因为你想谈清楚而觉得你破坏浪漫。",
      points: [
        "你忙的时候，通常会怎么给关系留时间？",
        "如果我们吵架了，你更习惯马上聊，还是先冷静再复盘？",
        "你怎么看两个人谈钱、储蓄和共同开支？",
        "你希望双方家庭在关系里参与到什么程度？",
        "如果未来三年我们都还在探索，你希望彼此怎么支持？"
      ]
    },
    {
      title: "10 AI 成长建议",
      subtitle: "行动练习、书单和下一步",
      body:
        "你的下一步不是立刻去找一个完全符合条件的人，而是把“我想要稳定”翻译成可观察、可沟通、可验证的行为。这样你在心动时不会只看感觉，也不会因为害怕受伤而过早关闭关系。",
      points: [
        "7 天练习：每天记录一个“我什么时候最像自己”的场景",
        "沟通练习：把“你是不是不在乎我”改写成“我需要你忙完后告诉我什么时候继续聊”",
        "约会练习：前三次见面至少观察一次对方如何处理计划变化",
        "阅读方向：《Hold Me Tight》《Eight Dates》《非暴力沟通》",
        "复盘问题：这段关系让我更稳定、更像自己，还是更常开始猜测？"
      ]
    }
  ]
};

export default function ReportSamplesPage() {
  const report = generateReport(sampleAnswers, true);
  const fullReport = report.fullReport;

  if (!fullReport) {
    throw new Error("Sample report should be generated with unlocked content.");
  }

  return (
    <main className="page-shell report-samples-page">
      <nav className="marketing-nav" aria-label="主导航">
        <Link className="logo-lockup" href="/">
          <span className="logo-mark">TA</span>
          <span>适合我的 TA</span>
        </Link>
        <div className="nav-center">
          <Link href="/">首页</Link>
          <Link href="/#dimensions">测评介绍</Link>
          <Link className="active" href="/report-samples">
            报告样例
          </Link>
        </div>
        <div className="nav-right">
          <Link className="primary-button nav-cta" href="/assessment">
            免费开始测评
          </Link>
        </div>
      </nav>

      <section className="report-samples-hero">
        <div>
          <span>真实样例报告</span>
          <h1>一套真实作答，会生成阶段报告和最终报告两种成品</h1>
          <p>{samplePersona.path} 这里分开看：阶段报告是过程奖励，最终报告是用户最后真正拿到手的完整关系说明书。</p>
        </div>
        <Link className="outline-button" href="/">
          <Home size={18} />
          返回首页
        </Link>
      </section>

      <nav className="report-sample-switcher" aria-label="报告样例切换">
        <a href="#stage-report-sample">阶段报告样例</a>
        <a href="#final-report-sample">最终报告样例</a>
      </nav>

      <section className="sample-persona-card" aria-label="样例作答路径">
        <span>{samplePersona.name}</span>
        <h2>{samplePersona.profile}</h2>
        <p>
          样例用户的作答倾向：重视稳定回应、现实共建、清晰沟通和个人边界；容易被优秀但忽冷忽热的人吸引，但长期更需要稳定负责、愿意沟通的伴侣。
        </p>
      </section>

      <section className="stage-sample-section" id="stage-report-sample" aria-label="四份阶段报告样例">
        <div className="report-type-banner report-type-banner-stage">
          <span>报告类型 01</span>
          <strong>阶段报告样例：一共 4 份，每完成一个阶段先拿到一份</strong>
          <p>它回答的是“我在这一阶段呈现出什么信号”，用于过程反馈和角色点亮；它不是最终综合结论。</p>
        </div>
        <div className="stage-sample-heading">
          <span>四份阶段报告样例</span>
          <h2>阶段报告：每完成一段，先点亮一张角色卡</h2>
          <p>阶段报告负责解释当前阶段的主导信号。它像过程奖励，不替代最终报告。</p>
        </div>

        <div className="stage-sample-grid">
          {realStageReports.map((stage, index) => {
            const Icon = stageIcons[index] ?? ClipboardList;

            return (
              <article className="report-sample-card-v2 real-report-card" key={stage.layer}>
                <header>
                  <img src={roleImageByName[stage.role]} alt={`${stage.role}角色贴纸`} />
                  <div>
                    <span>阶段 {String(index + 1).padStart(2, "0")}</span>
                    <h3>{stage.title}</h3>
                    <strong>{stage.role}</strong>
                  </div>
                  <Icon size={20} />
                </header>

                <section className="sample-question-block">
                  <span>这份报告回答</span>
                  <p>{stage.question}</p>
                </section>

                <p className="sample-summary">{stage.summary}</p>

                <div className="stage-generated-section real-stage-section">
                  {stage.findings.map((section) => (
                    <section key={section.title}>
                      <strong>{section.title}</strong>
                      <p>{section.body}</p>
                    </section>
                  ))}
                </div>

                <div className="sample-report-note">
                  <Sparkles size={16} />
                  <section>
                    <strong>AI 个性化补充</strong>
                    <p>{stage.ai}</p>
                  </section>
                </div>

                <div className="sample-report-note action">
                  <BookOpen size={16} />
                  <section>
                    <strong>行动卡</strong>
                    <p>{stage.action}</p>
                  </section>
                </div>
                <div className="sample-report-note reading">
                  <BookOpen size={16} />
                  <section>
                    <strong>阅读与练习</strong>
                    <p>{stage.reading}</p>
                  </section>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="final-report-sample final-report-book" id="final-report-sample" aria-label="完整最终报告样例">
        <div className="report-type-banner report-type-banner-final">
          <span>报告类型 02</span>
          <strong>完整最终报告样例：4 份阶段报告合成后的最终成品</strong>
          <p>它回答的是“我是谁、适合谁、哪里要谨慎、下一步怎么做”，这是用户完成全部 68 题后真正会打开的完整关系说明书。</p>
        </div>
        <div className="final-book-cover">
          <div>
            <span>完整最终报告样例</span>
            <h2>{realFinalReport.title}</h2>
            <p>{finalReportDossier.oneSentence}</p>
          </div>
          <aside>
            <strong>样例用户代表性表达</strong>
            <p>“{finalReportDossier.quote}”</p>
          </aside>
        </div>

        <div className="final-book-role-row" aria-label="四阶段角色组合">
          {report.stageReports.map((stage, index) => (
            <article key={stage.layer}>
              <em>{String(index + 1).padStart(2, "0")}</em>
              <img src={roleImageByName[stage.archetype.name]} alt={`${stage.archetype.name}角色贴纸`} />
              <strong>{stage.archetype.name}</strong>
              <span>{stage.title}</span>
            </article>
          ))}
        </div>

        <div className="final-book-summary">
          <span>综合结论</span>
          <p>{realFinalReport.summary}</p>
        </div>

        <div className="final-book-chapters">
          {finalReportDossier.chapters.map((chapter) => (
            <article key={chapter.title}>
              <div>
                <span>{chapter.subtitle}</span>
                <h3>{chapter.title}</h3>
              </div>
              <p>{chapter.body}</p>
              <ul>
                {chapter.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
