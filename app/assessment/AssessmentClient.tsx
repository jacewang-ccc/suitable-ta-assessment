"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  CakeSlice,
  Check,
  Circle,
  Footprints,
  Home,
  Lock,
  MapPinned,
  Mic,
  Sparkles,
  Waves
} from "lucide-react";
import { questionBank } from "@/lib/assessment/questionBank";
import { generateReport } from "@/lib/report/generator";
import { sampleAnswers } from "@/lib/report/sampleAnswers";
import type { AssessmentAnswer } from "@/lib/assessment/types";

const storageKey = "suitable-ta-answers";
const unlockKey = "suitable-ta-unlocked";
const draftKey = "suitable-ta-draft";
const demoKey = "suitable-ta-demo-report";

const mapStages = [
  {
    title: "自我画像",
    subtitle: "性格与能量",
    activity: "bike",
    activityLabel: "骑车出发",
    checkpoint: "阶段小结 01",
    summary: "你的性格底色、能量来源和行动偏好",
    stopAt: 14
  },
  {
    title: "价值罗盘",
    subtitle: "三观与选择",
    activity: "run",
    activityLabel: "草地赛跑",
    checkpoint: "阶段小结 02",
    summary: "人生选择、价值排序和消费观轮廓",
    stopAt: 30
  },
  {
    title: "亲密模式",
    subtitle: "相处与边界",
    activity: "swim",
    activityLabel: "穿过湖面",
    checkpoint: "阶段小结 03",
    summary: "依恋方式、沟通习惯和冲突处理方式",
    stopAt: 48
  },
  {
    title: "理想伴侣",
    subtitle: "偏好与画像",
    activity: "treat",
    activityLabel: "甜点补给",
    checkpoint: "阶段小结 04",
    summary: "适合你的伴侣画像与关系风险提示",
    stopAt: 68
  }
];

const stageIcons = [Bike, Footprints, Waves, CakeSlice];

const stagePositions = [
  { x: 16, y: 68 },
  { x: 42, y: 28 },
  { x: 70, y: 62 },
  { x: 88, y: 24 }
];

interface DraftPayload {
  index: number;
  answers: Record<string, string | string[]>;
}

const toAnswerPayload = (answers: Record<string, string | string[]>): AssessmentAnswer[] =>
  Object.entries(answers).map(([questionId, answerValue]) => ({
    questionId,
    value: answerValue
  }));

const maxSelectable = (title: string, fallback: number) => {
  const match = title.match(/(?:前|保留|选)\s*(\d+)/);
  return match ? Number(match[1]) : fallback;
};

const readableOpenAnswer = (answerValue: string | string[] | undefined) => {
  if (typeof answerValue !== "string") return "";

  try {
    const parsed = JSON.parse(answerValue) as { text?: unknown };
    if (typeof parsed.text === "string") return parsed.text;
  } catch {
    return answerValue;
  }

  return answerValue;
};

const createDemoAnswers = (): Record<string, string | string[]> =>
  sampleAnswers.reduce<Record<string, string | string[]>>((draft, item) => {
    draft[item.questionId] = item.value;
    return draft;
  }, {});

export default function AssessmentClient() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isListening, setIsListening] = useState(false);
  const question = questionBank[index];
  const progress = useMemo(() => ((index + 1) / questionBank.length) * 100, [index]);
  const value = answers[question.id];
  const answeredCount = Object.keys(answers).length;
  const reportSnapshot = useMemo(() => generateReport(toAnswerPayload(answers), false), [answers]);
  const currentStageIndex = mapStages.findIndex((stage) => index + 1 <= stage.stopAt);
  const activeStageIndex = Math.max(currentStageIndex, 0);
  const activeStage = mapStages[activeStageIndex];
  const activeStageStart = activeStageIndex === 0 ? 1 : mapStages[activeStageIndex - 1].stopAt + 1;
  const completedStageReports = reportSnapshot.stageReports.filter((stage) => stage.isComplete);

  useEffect(() => {
    const storedDraft = window.localStorage.getItem(draftKey);
    if (!storedDraft) return;

    try {
      const draft = JSON.parse(storedDraft) as DraftPayload;
      setAnswers(draft.answers ?? {});
      setIndex(Math.min(Math.max(draft.index ?? 0, 0), questionBank.length - 1));
    } catch {
      window.localStorage.removeItem(draftKey);
    }
  }, []);

  const setAnswer = (questionId: string, nextValue: string | string[]) => {
    window.localStorage.removeItem(demoKey);
    setAnswers((current) => ({ ...current, [questionId]: nextValue }));
  };

  const selectedValues = Array.isArray(value) ? value : [];
  const rankingLimit = question.type === "ranking" ? maxSelectable(question.title, 5) : 0;
  const multipleLimit = question.type === "multipleChoice" ? maxSelectable(question.title, 3) : 0;
  const hasAnswer =
    question.type === "ranking"
      ? Array.isArray(value) && value.length >= rankingLimit
      : Array.isArray(value)
        ? value.length > 0
        : Boolean(value && String(value).trim().length > 0);
  const canContinue = !question.required || hasAnswer;

  const toggleMultiple = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(optionValue)) {
      setAnswer(
        question.id,
        currentValues.filter((item) => item !== optionValue)
      );
      return;
    }

    if (currentValues.length >= multipleLimit) return;
    setAnswer(question.id, [...currentValues, optionValue]);
  };

  const toggleRanking = (optionValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(optionValue)) {
      setAnswer(
        question.id,
        currentValues.filter((item) => item !== optionValue)
      );
      return;
    }

    if (currentValues.length >= rankingLimit) return;
    setAnswer(question.id, [...currentValues, optionValue]);
  };

  const handleSubmit = () => {
    const payload = toAnswerPayload(answers);
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    window.localStorage.setItem(unlockKey, window.localStorage.getItem(demoKey) === "true" ? "true" : "false");
    window.localStorage.removeItem(draftKey);
    router.push("/report");
  };

  const saveAndReturn = () => {
    const draft: DraftPayload = {
      index,
      answers
    };
    window.localStorage.setItem(draftKey, JSON.stringify(draft));
    window.localStorage.setItem(storageKey, JSON.stringify(toAnswerPayload(answers)));
    router.push("/");
  };

  const fillDemoAnswers = () => {
    const demoAnswers = createDemoAnswers();
    setAnswers(demoAnswers);
    setIndex(questionBank.length - 1);
    window.localStorage.setItem(
      draftKey,
      JSON.stringify({
        index: questionBank.length - 1,
        answers: demoAnswers
      })
    );
    window.localStorage.setItem(storageKey, JSON.stringify(toAnswerPayload(demoAnswers)));
    window.localStorage.setItem(unlockKey, "true");
    window.localStorage.setItem(demoKey, "true");
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    window.setTimeout(() => {
      const current = typeof value === "string" ? value : "";
      setAnswer(
        question.id,
        `${current}${current ? "\n" : ""}我希望对方遇到问题时可以直接沟通，不要用冷处理让我猜。`
      );
      setIsListening(false);
    }, 600);
  };

  return (
    <main className="page-shell assessment-page">
      <div className="assessment-layout">
        <header className="assessment-header">
          <div>
            <Link className="assessment-brand" href="/">
              适合我的 TA
            </Link>
            <h1>奥德赛探索测评</h1>
            <p className="assessment-subtitle">
              共 4 段 68 题，当前是第 {activeStageIndex + 1} 段「{activeStage?.title}」
            </p>
          </div>
        </header>

        <div className="assessment-progress-card">
          <div className="progress-meta">
            <span>测评进度</span>
            <strong>
              {index + 1} / {questionBank.length}
            </strong>
            <small>
              第 {activeStageIndex + 1}/4 段 · {activeStage?.title}（第 {activeStageStart}-{activeStage?.stopAt} 题）
            </small>
            <em>已回答 {answeredCount} 题</em>
          </div>
          <div className="progress-track" aria-label="测评进度">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>

        <section className="question-card">
          <div className="question-meta">
            <span>{activeStage?.title}</span>
            <strong>第 {index + 1} 题</strong>
          </div>
          <h2>{question.title}</h2>

          {question.type === "openText" ? (
            <>
              <textarea
                className="answer-textarea"
                value={readableOpenAnswer(value)}
                onChange={(event) => setAnswer(question.id, event.target.value)}
                placeholder="可以打字，也可以用下方按钮模拟语音转文字。"
              />
              <button className="voice-button" onClick={simulateVoiceInput} type="button">
                <Mic size={18} />
                {isListening ? "正在转文字..." : "语音输入"}
              </button>
            </>
          ) : question.type === "ranking" ? (
            <>
              <div className="ranking-helper">
                <strong>按顺序点选 {rankingLimit} 项</strong>
                <span>
                  已选 {selectedValues.length}/{rankingLimit}，再次点击可取消
                </span>
              </div>
              <div className="option-list ranking-list">
                {question.options.map((option) => {
                  const rank = selectedValues.indexOf(option.value) + 1;

                  return (
                    <button
                      className={`option-button ranking-option ${rank ? "selected" : ""}`}
                      key={option.value}
                      onClick={() => toggleRanking(option.value)}
                      type="button"
                    >
                      <span className="rank-badge">{rank || <Circle size={12} />}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : question.type === "multipleChoice" ? (
            <>
              <div className="ranking-helper">
                <strong>最多选 {multipleLimit} 项</strong>
                <span>
                  已选 {selectedValues.length}/{multipleLimit}
                </span>
              </div>
              <div className="option-list multi-list">
                {question.options.map((option) => {
                  const selected = selectedValues.includes(option.value);

                  return (
                    <button
                      className={`option-button multi-option ${selected ? "selected" : ""}`}
                      key={option.value}
                      onClick={() => toggleMultiple(option.value)}
                      type="button"
                    >
                      <span className="rank-badge">{selected ? <Check size={14} /> : <Circle size={12} />}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="option-list">
              {question.options.map((option) => (
                <button
                  className={`option-button ${value === option.value ? "selected" : ""}`}
                  key={option.value}
                  onClick={() => setAnswer(question.id, option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div className="question-actions">
            <div className="question-nav-group">
              <button className="demo-fill-button" onClick={fillDemoAnswers} type="button">
                <Sparkles size={17} />
                演示填完
              </button>
              <button className="save-inline-button" onClick={saveAndReturn} type="button">
                <Home size={18} />
                保存返回
              </button>
              <button
                className="nav-step-button previous"
                disabled={index === 0}
                onClick={() => setIndex((current) => Math.max(0, current - 1))}
                type="button"
              >
                <ArrowLeft size={18} />
                上一题
              </button>
              {index === questionBank.length - 1 ? (
                <button className="nav-step-button next finish" disabled={!canContinue} onClick={handleSubmit} type="button">
                  生成报告
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  className="nav-step-button next"
                  disabled={!canContinue}
                  onClick={() => setIndex((current) => current + 1)}
                  type="button"
                >
                  下一题
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="game-map-panel" aria-label="奥德赛游戏地图">
            <div className="game-map-header">
              <div>
                <span>
                  <MapPinned size={15} />
                  奥德赛攻略地图
                </span>
                <strong>4 段探索对应 4 份阶段报告，全部完成后生成最终报告</strong>
              </div>
              <em>{completedStageReports.length}/4</em>
            </div>

            <div className="game-map-board">
              <svg className="game-map-route" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
                <path className="game-map-route-shadow" d="M 16 68 C 24 48, 32 35, 42 28 S 62 42, 70 62 S 82 38, 88 24" />
                <path className="game-map-route-line" d="M 16 68 C 24 48, 32 35, 42 28 S 62 42, 70 62 S 82 38, 88 24" />
              </svg>
              <div className="game-map-cloud cloud-left" aria-hidden="true" />
              <div className="game-map-cloud cloud-right" aria-hidden="true" />
              <div className="game-map-lake" aria-hidden="true" />
              <div className={`game-avatar avatar-at-${activeStageIndex}`} aria-hidden="true">
                <img src="/odyssey-map-mascot.png" alt="" />
                <span className="avatar-bubble">滴溜</span>
              </div>

              {mapStages.map((stage, stageIndex) => {
                const completed = index + 1 > stage.stopAt;
                const active = stageIndex === activeStageIndex;
                const StageIcon = stageIcons[stageIndex];
                const position = stagePositions[stageIndex];

                return (
                  <div
                    className={`game-map-stop stop-${stageIndex} ${completed ? "completed" : ""} ${active ? "active" : ""} ${!completed && !active ? "locked" : ""}`}
                    key={stage.title}
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  >
                    <div className="game-map-node">
                      {completed ? <Check size={21} /> : active ? <StageIcon size={23} /> : <Lock size={18} />}
                    </div>
                    <div className="game-map-label">
                      <span>{stage.activityLabel}</span>
                      <strong>{stage.title}</strong>
                      <em>{completed ? "奖励已点亮" : active ? "进行中" : "待开启"}</em>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
