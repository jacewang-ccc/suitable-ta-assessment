"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Home,
  HeartHandshake,
  LockKeyhole,
  RefreshCcw,
  Share2,
  Sparkles,
  Star,
  Target,
  UserRound
} from "lucide-react";
import { generateReport } from "@/lib/report/generator";
import { sampleAnswers } from "@/lib/report/sampleAnswers";
import type { AssessmentAnswer, AssessmentLayer } from "@/lib/assessment/types";

const storageKey = "suitable-ta-answers";
const unlockKey = "suitable-ta-unlocked";
const demoKey = "suitable-ta-demo-report";

const layerMeta: Array<{
  key: AssessmentLayer;
  title: string;
  subtitle: string;
  icon: typeof UserRound;
}> = [
  {
    key: "selfFoundation",
    title: "自我画像",
    subtitle: "底层驱动力与性格底色",
    icon: UserRound
  },
  {
    key: "valuesScript",
    title: "价值罗盘",
    subtitle: "三观排序与生活选择",
    icon: Target
  },
  {
    key: "intimacyMechanism",
    title: "亲密模式",
    subtitle: "安全感、边界与冲突修复",
    icon: HeartHandshake
  },
  {
    key: "partnerReality",
    title: "理想伴侣",
    subtitle: "适配画像与现实条件",
    icon: Star
  }
];

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

const RoleSticker = ({ name, className = "" }: { name: string; className?: string }) => (
  <img
    className={`report-role-sticker ${className}`}
    src={roleImageByName[name] ?? "/odyssey-map-mascot.png"}
    alt={`${name}角色贴纸`}
  />
);

const EmptyReport = () => (
  <main className="page-shell flow-page report-page">
    <div className="container empty-report">
      <div className="empty-report-card">
        <span className="report-kicker">报告还没生成</span>
        <h1>先完成一段奥德赛探索，再拿到你的关系自画像</h1>
        <p>问卷会先帮你看清自己，再生成适合你的 TA、关系风险和行动建议。</p>
        <Link className="primary-button" href="/assessment">
          开始测评
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  </main>
);

export default function ReportClient() {
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied">("idle");

  useEffect(() => {
    const storedAnswers = window.localStorage.getItem(storageKey);
    const storedUnlock = window.localStorage.getItem(unlockKey);
    const isDemoReport = window.localStorage.getItem(demoKey) === "true";

    if (isDemoReport) {
      setAnswers(sampleAnswers);
    } else if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers) as AssessmentAnswer[]);
    }

    setIsUnlocked(isDemoReport || storedUnlock === "true");
  }, []);

  const report = useMemo(() => generateReport(answers, isUnlocked), [answers, isUnlocked]);

  const unlockReport = () => {
    window.localStorage.setItem(unlockKey, "true");
    setIsUnlocked(true);
  };

  const openCompleteReport = () => {
    unlockReport();
    window.setTimeout(() => {
      document.getElementById("complete-report")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const shareReport = async () => {
    const shareData = {
      title: "我的奥德赛关系报告",
      text: `我的四阶段角色组合：${roleLine}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("shared");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("copied");
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("copied");
    }

    window.setTimeout(() => setShareStatus("idle"), 1800);
  };

  if (answers.length === 0) {
    return <EmptyReport />;
  }

  const topInsights = report.preview.insights.slice(0, 3);
  const fullReport = report.fullReport;
  const roleLine = report.stageReports.map((stage) => stage.archetype.name).join(" + ");

  return (
    <main className="page-shell flow-page report-page">
      <div className="container">
        <header className="report-hero">
          <div className="report-hero-copy">
            <Link className="report-back-link" href="/">
              适合我的 TA
            </Link>
            <span className="report-kicker">奥德赛关系报告</span>
            <h1>奥德赛关系说明书</h1>
            <p>{report.preview.oneLine}</p>
            <div className="report-hero-role-grid" aria-label="四阶段角色组合">
              {report.stageReports.map((stage) => (
                <a href={`#stage-${stage.layer}`} key={stage.layer}>
                  <RoleSticker name={stage.archetype.name} />
                  <strong>{stage.archetype.name}</strong>
                  <span>{stage.title}</span>
                </a>
              ))}
            </div>
            <div className="report-hero-actions">
              <Link className="secondary-button" href="/assessment">
                <RefreshCcw size={17} />
                重新测一次
              </Link>
              <button className="primary-button" onClick={openCompleteReport} type="button">
                查看完整报告
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <aside className="report-score-card role-passport-card">
            <span>四阶段角色护照</span>
            {report.stageReports.map((stage) => (
              <a href={`#stage-${stage.layer}`} key={stage.layer}>
                <RoleSticker name={stage.archetype.name} />
                <section>
                  <strong>{stage.archetype.name}</strong>
                  <small>{stage.reportTitle}</small>
                </section>
              </a>
            ))}
          </aside>
        </header>

        <section className="report-preview-grid" aria-label="基础洞察">
          {topInsights.map((insight, index) => (
            <article key={insight} className="report-insight-card">
              <span>洞察 {String(index + 1).padStart(2, "0")}</span>
              <p>{insight}</p>
            </article>
          ))}
        </section>

        <div className="report-layout report-layout-single">
          <div className="report-main">
            <section className="stage-sample-section report-stage-sample-live" aria-label="四份阶段报告">
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
                {report.stageReports.map((stage) => {
                  const meta = layerMeta.find((item) => item.key === stage.layer) ?? layerMeta[0];
                  const Icon = meta.icon;
                  const actionCard = stage.actionCards[0];
                  const readingCard = stage.readingCards[0];

                  return (
                    <article
                      className="report-sample-card-v2 real-report-card"
                      id={`stage-${stage.layer}`}
                      key={stage.layer}
                    >
                      <header>
                        <img src={roleImageByName[stage.archetype.name]} alt={`${stage.archetype.name}角色贴纸`} />
                        <div>
                          <span>阶段 {String(stage.order).padStart(2, "0")}</span>
                          <h3>{stage.reportTitle}</h3>
                          <strong>{stage.archetype.name}</strong>
                        </div>
                        <Icon size={20} />
                      </header>
                      <section className="sample-question-block">
                        <span>这份报告回答</span>
                        <p>{stage.coreQuestion}</p>
                      </section>
                      <p className="sample-summary">{stage.summary}</p>
                      <div className="stage-generated-section real-stage-section">
                        {stage.sections.slice(0, 4).map((section) => (
                          <section key={section.title}>
                            <strong>{section.title}</strong>
                            <p>{section.templateText}</p>
                          </section>
                        ))}
                      </div>
                      <div className="sample-report-note">
                        <Sparkles size={16} />
                        <section>
                          <strong>AI 个性化补充</strong>
                          <p>{stage.aiSupplement}</p>
                        </section>
                      </div>
                      <div className="sample-report-note action">
                        <BookOpen size={16} />
                        <section>
                          <strong>行动卡</strong>
                          <p>{actionCard ? `${actionCard.title}：${actionCard.body}` : stage.nextStep}</p>
                        </section>
                      </div>
                      <div className="sample-report-note reading">
                        <BookOpen size={16} />
                        <section>
                          <strong>阅读与练习</strong>
                          <p>
                            {readingCard
                              ? `${readingCard.title}：${readingCard.reason}`
                              : "把这一阶段的提醒写成一个可执行的小练习。"}
                          </p>
                        </section>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {!report.isUnlocked ? (
              <section className="locked-report-card merged-unlock-card">
                <div className="report-type-banner report-type-banner-final report-type-banner-compact">
                  <span>报告类型 02</span>
                  <strong>完整最终报告：4 份阶段报告合成后的最终成品</strong>
                  <p>解锁后会把四阶段信号合并成一份关系说明书，集中回答“我是谁、适合谁、哪里要谨慎、下一步怎么做”。</p>
                </div>
                <div className="report-section-heading">
                  <span className="report-kicker">完整报告预览</span>
                  <h2>解锁后，展开完整关系说明书</h2>
                  <p>
                    四张阶段角色卡会被合成一份完整报告：它会把“我是谁、适合谁、哪里要谨慎、下一步怎么做”放在同一张关系地图里。
                  </p>
                </div>
                <div className="locked-final-report-cover" id="complete-report">
                  <div className="locked-final-cover-head">
                    <span>最终综合报告</span>
                    <strong>完整关系说明书</strong>
                    <small>把四张阶段角色卡合成为一份可行动的关系地图</small>
                  </div>
                  <div className="locked-final-role-strip" aria-hidden="true">
                    {report.stageReports.map((stage) => (
                      <div key={stage.layer}>
                        <RoleSticker name={stage.archetype.name} />
                        <span>{stage.archetype.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="locked-final-content-grid">
                    {report.preview.lockedSections.map((section, index) => (
                      <article key={section}>
                        <LockKeyhole size={16} />
                        <strong>{String(index + 1).padStart(2, "0")}</strong>
                        <span>{section}</span>
                      </article>
                    ))}
                  </div>
                  <div className="locked-final-answer">
                    <div>
                      <strong>完整报告会回答</strong>
                      <span>我是谁、适合谁、哪里需要谨慎、下一步怎么行动。</span>
                    </div>
                    <button className="primary-button" onClick={unlockReport} type="button">
                      解锁完整报告
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </section>
            ) : (
              fullReport && (
                <section className="final-report-sample final-report-book report-final-book-live" id="complete-report">
                  <div className="report-type-banner report-type-banner-final report-type-banner-compact">
                    <span>报告类型 02</span>
                    <strong>完整最终报告：4 份阶段报告合成后的最终成品</strong>
                    <p>这里不是新的单项测评，而是把四张阶段角色卡合并后得到的完整关系说明书。</p>
                  </div>

                  <div className="final-book-cover">
                    <div>
                      <span>完整最终报告</span>
                      <h2>{report.preview.primaryType}关系说明书</h2>
                      <p>{report.preview.oneLine}</p>
                    </div>
                    <aside>
                      <strong>这份完整报告会综合判断</strong>
                      <p>“{fullReport.crossStageInsights[0] ?? report.preview.oneLine}”</p>
                    </aside>
                  </div>

                  <div className="final-book-role-row" aria-label="四阶段角色组合">
                    {report.stageReports.map((stage, index) => (
                      <article key={stage.layer}>
                        <em>{String(index + 1).padStart(2, "0")}</em>
                        <RoleSticker name={stage.archetype.name} />
                        <strong>{stage.archetype.name}</strong>
                        <span>{stage.title}</span>
                      </article>
                    ))}
                  </div>

                  <div className="final-book-summary">
                    <span>综合结论</span>
                    <p>{fullReport.crossStageInsights.join(" ")}</p>
                  </div>

                  <div className="final-book-chapters">
                    {fullReport.modules.map((module) => (
                      <article key={module.title}>
                        <div>
                          <span>完整报告模块</span>
                          <h3>{module.title}</h3>
                        </div>
                        <p>{module.items[0]}</p>
                        <ul>
                          {module.items.slice(1).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                    <article>
                      <div>
                        <span>AI 行动建议</span>
                        <h3>下一步怎么做</h3>
                      </div>
                      <p>{fullReport.actionPlan.relationshipAdvice[0]}</p>
                      <ul>
                        {[
                          ...fullReport.actionPlan.dailyPractices,
                          ...fullReport.actionPlan.firstDateQuestions.slice(0, 2),
                          ...fullReport.actionPlan.readingList.slice(0, 2)
                        ].map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>
                  </div>
                </section>
              )
            )}
          </div>

          <section className="report-finish-bar">
            <div>
              <span className="report-kicker">报告已生成</span>
              <strong>你可以回到首页，也可以把这份结果分享给朋友一起讨论。</strong>
            </div>
            <div>
              <Link className="secondary-button" href="/">
                <Home size={17} />
                返回主页
              </Link>
              <button className="primary-button" onClick={shareReport} type="button">
                <Share2 size={17} />
                {shareStatus === "copied" ? "已复制链接" : shareStatus === "shared" ? "已打开分享" : "分享报告"}
              </button>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
