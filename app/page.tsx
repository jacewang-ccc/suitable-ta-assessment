import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  HeartHandshake,
  LockKeyhole,
  Map,
  ShieldCheck,
  Sparkles,
  UserRound
} from "lucide-react";
import { HomeHeroActions, HomeNavAssessmentAction } from "./HomeHeroActions";

const dimensions = [
  {
    title: "自我画像",
    subtitle: "探索你的内在驱动力与性格底色",
    icon: ClipboardList,
    tone: "coral",
    items: ["核心性格与行动偏好", "内在驱动力与能量来源", "优势劣势与成长方向"]
  },
  {
    title: "价值罗盘",
    subtitle: "你的价值观与人生信念体系",
    icon: Compass,
    tone: "teal",
    items: ["价值观排序与冲突点", "人生目标与优先级", "原生家庭与信念脚本"]
  },
  {
    title: "亲密模式",
    subtitle: "看见你在关系中的模式与需求",
    icon: HeartHandshake,
    tone: "gold",
    items: ["依恋风格与亲密模式", "沟通方式与冲突处理", "情感需求与边界感"]
  },
  {
    title: "理想伴侣",
    subtitle: "生成适合你的 TA 特征与相处建议",
    icon: UserRound,
    tone: "mint",
    items: ["核心特征与价值观匹配", "相处模式与互补点", "关系发展建议与避坑指南"]
  }
];

const dimensionIntroCards = [
  {
    title: "产品定位",
    text: "给 20 多岁奥德赛时期的年轻人，做一份关于自我、三观和亲密关系的探索报告。",
    icon: Sparkles
  },
  {
    title: "回答什么",
    text: "我是谁？我真正看重什么？我会怎样爱人？什么样的 TA 更适合长期生活？",
    icon: Map
  },
  {
    title: "不同在哪",
    text: "不是只给标签，而是把选择题、开放题和 AI 语义分析合成阶段报告与行动建议。",
    icon: FileText
  }
];

const dimensionProofs = ["68 道标准题", "18 道开放题", "4 份阶段报告", "1 份最终综合报告"];

const reportScores = [
  ["自我画像信号", 88],
  ["价值罗盘信号", 82],
  ["亲密模式信号", 84],
  ["理想伴侣信号", 90]
];

const heroReportRoles = [
  { name: "灯塔守护者", report: "自我画像", image: "/role-stickers/01-lighthouse-keeper.png" },
  { name: "罗盘探路者", report: "价值罗盘", image: "/role-stickers/05-compass-seeker.png" },
  { name: "篝火守望者", report: "亲密模式", image: "/role-stickers/09-campfire-guardian.png" },
  { name: "港口共建者", report: "理想伴侣", image: "/role-stickers/13-port-co-builder-single.png" }
];

const sampleModules = [
  {
    title: "自我画像报告",
    tag: "阶段 01",
    text: "灯塔守护者：性格能量、情绪复原、行动方式和自我需求。",
    icon: ClipboardList,
    locked: false
  },
  {
    title: "价值罗盘报告",
    tag: "阶段 02",
    text: "罗盘探路者：人生观、价值观、世界观、消费观和家庭观。",
    icon: Compass,
    locked: false
  },
  {
    title: "亲密模式报告",
    tag: "阶段 03",
    text: "篝火守望者：安全感、亲密距离、表达爱和冲突修复。",
    icon: HeartHandshake,
    locked: false
  },
  {
    title: "理想伴侣报告",
    tag: "阶段 04",
    text: "港口共建者：伴侣核心特质、现实条件和高风险吸引。",
    icon: UserRound,
    locked: false
  },
  {
    title: "最终综合报告",
    tag: "完整解锁",
    text: "合成四个角色，输出适合 TA、成长提醒、书单和行动建议。",
    icon: FileText,
    locked: true
  }
];

const roleAtlas = [
  {
    stage: "自我画像",
    report: "自我画像报告",
    roles: [
      {
        name: "灯塔守护者",
        tone: "rose",
        cue: "稳住边界",
        detail: "先照见自己，再决定如何靠近别人。",
        image: "/role-stickers/01-lighthouse-keeper.png"
      },
      {
        name: "风帆冒险家",
        tone: "teal",
        cue: "先去试试",
        detail: "需要体验和可能性来恢复生命力。",
        image: "/role-stickers/02-sail-adventurer.png"
      },
      {
        name: "云朵疗愈师",
        tone: "gold",
        cue: "温柔复原",
        detail: "需要被听见、被接住、被温柔解释。",
        image: "/role-stickers/03-cloud-healer.png"
      },
      {
        name: "星图规划师",
        tone: "mint",
        cue: "拆成下一步",
        detail: "擅长拆解问题和规划下一步。",
        image: "/role-stickers/04-star-map-planner.png"
      }
    ]
  },
  {
    stage: "价值罗盘",
    report: "价值罗盘报告",
    roles: [
      {
        name: "罗盘探路者",
        tone: "teal",
        cue: "寻找答案",
        detail: "想找到真正属于自己的路径。",
        image: "/role-stickers/05-compass-seeker.png"
      },
      {
        name: "港湾建造师",
        tone: "rose",
        cue: "把生活托住",
        detail: "希望关系和生活都有可停靠的地方。",
        image: "/role-stickers/06-harbor-builder.png"
      },
      {
        name: "山顶攀登者",
        tone: "gold",
        cue: "向上生长",
        detail: "需要关系支持人生上升。",
        image: "/role-stickers/07-summit-climber.png"
      },
      {
        name: "花园照料者",
        tone: "mint",
        cue: "经营关系",
        detail: "重视真实、连接和生活的滋养感。",
        image: "/role-stickers/08-garden-caretaker.png"
      }
    ]
  },
  {
    stage: "亲密模式",
    report: "亲密模式报告",
    roles: [
      {
        name: "篝火守望者",
        tone: "gold",
        cue: "需要回应",
        detail: "需要稳定回应和明确选择。",
        image: "/role-stickers/09-campfire-guardian.png"
      },
      {
        name: "海雾观察员",
        tone: "mint",
        cue: "保留空间",
        detail: "需要慢慢确认距离和边界。",
        image: "/role-stickers/10-mist-observer.png"
      },
      {
        name: "双桨修复师",
        tone: "teal",
        cue: "一起修复",
        detail: "相信关系可以被共同修回来。",
        image: "/role-stickers/11-double-paddle-repairer.png"
      },
      {
        name: "星火追逐者",
        tone: "rose",
        cue: "被张力吸引",
        detail: "容易被火花、深聊和强烈感吸引。",
        image: "/role-stickers/12-spark-chaser.png"
      }
    ]
  },
  {
    stage: "理想伴侣",
    report: "理想伴侣报告",
    roles: [
      {
        name: "港口共建者",
        tone: "mint",
        cue: "现实共建",
        detail: "适合一起规划现实生活的人。",
        image: "/role-stickers/13-port-co-builder-single.png"
      },
      {
        name: "星图同行者",
        tone: "teal",
        cue: "并肩成长",
        detail: "适合能共同成长和深度交流的人。",
        image: "/role-stickers/14-starmap-companion.png"
      },
      {
        name: "暖炉陪伴者",
        tone: "gold",
        cue: "日常温暖",
        detail: "适合温暖、稳定、能过日子的人。",
        image: "/role-stickers/15-hearth-companion.png"
      },
      {
        name: "风暴识别师",
        tone: "rose",
        cue: "识别风险",
        detail: "擅长识别长期关系中的风险。",
        image: "/role-stickers/16-storm-spotter-clean.png"
      }
    ]
  }
];

const featuredRoleNames = new Set(["灯塔守护者", "罗盘探路者", "篝火守望者", "港口共建者"]);

const finalReportTypes = [
  {
    name: "稳定共建型",
    cue: "清晰、负责、能一起处理现实",
    detail: "适合稳定、清晰、有现实责任感的关系，重点是把钱、家庭、时间线和冲突处理提前说清楚。",
    tone: "teal",
    roles: [
      "/role-stickers/01-lighthouse-keeper.png",
      "/role-stickers/06-harbor-builder.png",
      "/role-stickers/09-campfire-guardian.png",
      "/role-stickers/13-port-co-builder-single.png"
    ]
  },
  {
    name: "探索成长型",
    cue: "新鲜、同频、一起往前走",
    detail: "需要关系里有新鲜感、精神刺激和共同成长，同时要区分火花、责任和长期生活适配。",
    tone: "rose",
    roles: [
      "/role-stickers/02-sail-adventurer.png",
      "/role-stickers/05-compass-seeker.png",
      "/role-stickers/12-spark-chaser.png",
      "/role-stickers/14-starmap-companion.png"
    ]
  },
  {
    name: "温柔修复型",
    cue: "被理解、会沟通、能修回来",
    detail: "适合温暖、稳定、愿意沟通的人。你需要被回应，也需要把情绪需求翻译成具体动作。",
    tone: "gold",
    roles: [
      "/role-stickers/03-cloud-healer.png",
      "/role-stickers/08-garden-caretaker.png",
      "/role-stickers/11-double-paddle-repairer.png",
      "/role-stickers/15-hearth-companion.png"
    ]
  },
  {
    name: "边界识别型",
    cue: "边界、稳定、先识别风险",
    detail: "你很在意空间、稳定和风险控制。报告会帮助你区分健康谨慎和过早防御。",
    tone: "mint",
    roles: [
      "/role-stickers/01-lighthouse-keeper.png",
      "/role-stickers/06-harbor-builder.png",
      "/role-stickers/10-mist-observer.png",
      "/role-stickers/16-storm-spotter-clean.png"
    ]
  },
  {
    name: "目标同行型",
    cue: "目标、复盘、共同成长",
    detail: "重视成长、目标和复盘，适合能一起规划、一起修正的人，但成长速度不能替代情绪回应。",
    tone: "teal",
    roles: [
      "/role-stickers/04-star-map-planner.png",
      "/role-stickers/07-summit-climber.png",
      "/role-stickers/11-double-paddle-repairer.png",
      "/role-stickers/14-starmap-companion.png"
    ]
  }
];

export default function HomePage() {
  return (
    <main className="page-shell marketing-shell">
      <nav className="marketing-nav" aria-label="主导航">
        <Link className="logo-lockup" href="/">
          <span className="logo-mark">TA</span>
          <span>适合我的 TA</span>
        </Link>
        <div className="nav-center">
          <a className="active" href="#">
            首页
          </a>
          <a href="#dimensions">测评介绍</a>
          <Link href="/report-samples">报告样例</Link>
        </div>
        <div className="nav-right">
          <HomeNavAssessmentAction />
        </div>
      </nav>

      <section className="product-hero">
        <div className="hero-left">
          <h1>奥德赛时期，先看清自己，再找到适合的 TA</h1>
          <p>
            通过系统的自我探索，理解你的底层驱动力、价值观和亲密关系模式，为你生成专属的「理想伴侣画像」与关系成长建议。
          </p>
          <HomeHeroActions />
          <div className="trust-row" aria-label="产品保障">
            <div>
              <ShieldCheck size={28} />
              <strong>科学模型</strong>
              <span>心理学理论 + 结构化题库</span>
            </div>
            <div>
              <LockKeyhole size={28} />
              <strong>隐私安全</strong>
              <span>本地演示，后续支持加密存储</span>
            </div>
            <div>
              <CheckCircle2 size={28} />
              <strong>专业可靠</strong>
              <span>内容围绕关系决策设计</span>
            </div>
          </div>
        </div>

        <div className="hero-right" aria-label="测评界面和报告预览">
          <div className="assessment-mock">
            <div className="mock-topbar">
              <div>
                <span>测评进度</span>
                <strong>2 / 68</strong>
                <i />
              </div>
              <span>预计剩余 8 分钟</span>
              <button type="button">稍后继续</button>
            </div>
            <div className="mock-body">
              <aside className="mock-sidebar">
                {dimensions.map((dimension, index) => {
                  const Icon = dimension.icon;
                  return (
                    <div className={`mock-side-item ${index === 0 ? "selected" : ""}`} key={dimension.title}>
                      <Icon size={18} />
                      <div>
                        <strong>{dimension.title}</strong>
                        <span>{dimension.subtitle.slice(0, 12)}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="mock-unlock-note">
                  <LockKeyhole size={18} />
                  <div>
                    <strong>付费解锁完整报告</strong>
                    <span>解锁全部分析与建议</span>
                  </div>
                </div>
              </aside>

              <section className="mock-question">
                <h2>在做重要决定时，你更依赖于？</h2>
                <p>请选择最符合你的选项</p>
                {["A. 逻辑分析与客观事实", "B. 内心感受与直觉", "C. 他人建议与集体共识", "D. 价值观与长远意义"].map(
                  (label, index) => (
                    <div className={`mock-option ${index === 3 ? "active" : ""}`} key={label}>
                      <span />
                      {label}
                    </div>
                  )
                )}
                <div className="mock-question-actions">
                  <button type="button">上一题</button>
                  <button type="button">
                    下一题
                    <ArrowRight size={16} />
                  </button>
                </div>
              </section>

              <aside className="mock-report">
                <span className="mock-report-kicker">报告样例</span>
                <h3>四阶段角色护照</h3>
                <div className="mock-role-stack">
                  {heroReportRoles.map((role) => (
                    <div key={role.name}>
                      <img className="mock-role-sticker" src={role.image} alt={`${role.name}角色贴纸`} />
                      <section>
                        <strong>{role.name}</strong>
                        <span>{role.report}报告</span>
                      </section>
                    </div>
                  ))}
                </div>
                <div className="mock-report-preview">
                  <LockKeyhole size={20} />
                  <div>
                    <strong>完整关系说明书</strong>
                    <span>合成「我是谁、适合谁、怎么行动」</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="dimension-section" id="dimensions">
        <div className="section-kicker">
          <h2>四大测评维度，全面理解自己与关系</h2>
          <p>先看清自己，再判断适合谁。我们不只是做性格标签，而是把自我状态、三观排序、亲密机制和伴侣偏好串成一份能行动的关系说明书。</p>
          <span />
        </div>
        <div className="dimension-intro-panel" aria-label="产品定位与测评优势">
          <div className="dimension-intro-copy">
            {dimensionIntroCards.map((card) => {
              const Icon = card.icon;

              return (
                <article key={card.title}>
                  <Icon size={21} />
                  <div>
                    <strong>{card.title}</strong>
                    <p>{card.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="dimension-proof-strip" aria-label="测评结构">
            {dimensionProofs.map((proof) => (
              <span key={proof}>{proof}</span>
            ))}
          </div>
        </div>
        <div className="dimension-showcase">
          {dimensions.map((dimension, index) => {
            const Icon = dimension.icon;
            return (
              <article className={`showcase-card ${dimension.tone}`} key={dimension.title}>
                <div className="card-heading">
                  <div className="card-icon">
                    <Icon size={30} />
                  </div>
                  <div>
                    <h3>{dimension.title}</h3>
                    <p>{dimension.subtitle}</p>
                  </div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <ul>
                  {dimension.items.map((item) => (
                    <li key={item}>
                      <Check size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="unlock-strip">
          <div className="strip-icon">
            <LockKeyhole size={30} />
          </div>
          <div>
            <h3>付费解锁完整报告</h3>
            <p>解锁四阶段合成分析、适合你的 TA、高风险类型、约会提问清单和 AI 行动建议。</p>
          </div>
          <Link className="gold-button" href="/assessment">
            查看完整报告
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="sample-section" id="sample">
        <div className="sample-copy">
          <span>报告样例</span>
          <h2>完成 68 题，收集你的奥德赛角色图鉴</h2>
          <p>
            每一阶段先点亮一个角色，最后把四个角色合成一份最终关系类型。
          </p>
        </div>

        <div className="role-atlas-panel cute-atlas-panel" aria-label="16 种阶段角色图鉴">
          <div className="role-atlas-heading">
            <span>角色图鉴</span>
            <strong>四段探索，各点亮一个角色</strong>
          </div>
          <div className="role-sticker-sheet" aria-label="16 种奥德赛关系角色贴纸">
            {roleAtlas.map((stage, stageIndex) => (
              <section key={stage.stage} className="role-sticker-stage">
                <header>
                  <em>阶段 {String(stageIndex + 1).padStart(2, "0")}</em>
                  <strong>{stage.stage}</strong>
                  <span>{stage.report}</span>
                </header>
                <div>
                  {stage.roles.map((role) => (
                    <article
                      className={`role-sticker-card role-sticker-card-${role.tone} ${
                        featuredRoleNames.has(role.name) ? "is-featured" : ""
                      }`}
                      key={role.name}
                      tabIndex={0}
                    >
                      <img src={role.image} alt={`${role.name}角色贴纸`} />
                      <div>
                        <strong>{role.name}</strong>
                        <span>{role.cue}</span>
                      </div>
                      <p>{role.detail}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="final-type-atlas-panel" aria-label="最终综合报告类型图鉴">
          <div className="role-atlas-heading">
            <span>最终报告图鉴</span>
            <strong>四个阶段角色，合成一种关系说明书</strong>
          </div>
          <div className="final-type-grid">
            {finalReportTypes.map((type) => (
              <article className={`final-type-card final-type-card-${type.tone}`} key={type.name}>
                <div className="final-type-doll" aria-hidden="true">
                  {type.roles.map((image, index) => (
                    <img key={`${type.name}-${image}-${index}`} src={image} alt="" />
                  ))}
                </div>
                <div>
                  <strong>{type.name}</strong>
                  <span>{type.cue}</span>
                </div>
                <p>{type.detail}</p>
              </article>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}
