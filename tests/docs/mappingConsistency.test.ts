import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { questionBank } from "@/lib/assessment/questionBank";

const questionDoc = readFileSync("docs/标准版问卷题库设计-二十轮终版.md", "utf8");
const mappingDoc = readFileSync("docs/问卷答案到报告结构映射表.md", "utf8");
const reportSystemDoc = readFileSync("docs/报告生成系统设计.md", "utf8");
const reportTemplateDoc = readFileSync("docs/阶段报告样例模板.md", "utf8");

const questionIds = [...questionDoc.matchAll(/\| ((?:SF|SFO|VR|VRO|IM|IMO|PR|PRO)\d{2}) \|/g)].map(
  (match) => match[1]
);

const stageRoles = {
  自我画像: ["灯塔守护者", "风帆冒险家", "云朵疗愈师", "星图规划师"],
  价值罗盘: ["罗盘探路者", "港湾建造师", "山顶攀登者", "花园照料者"],
  亲密模式: ["篝火守望者", "海雾观察员", "双桨修复师", "星火追逐者"],
  理想伴侣: ["港口共建者", "星图同行者", "暖炉陪伴者", "风暴识别师"]
} as const;

const allRoles = Object.values(stageRoles).flat();

const allowedStageLandingPoints = [
  "性格能量",
  "情绪复原",
  "行动方式",
  "自我需求",
  "人生观",
  "价值观",
  "世界观",
  "消费观",
  "家庭观",
  "现实选择观",
  "安全感机制",
  "亲密距离",
  "表达爱与接收爱",
  "冲突修复",
  "风险",
  "吸引与承诺",
  "伴侣核心特质",
  "现实匹配条件",
  "风险识别",
  "行动建议输入"
];

const allowedFinalLandingPoints = [
  "关系自画像",
  "三观地图",
  "适合的 TA",
  "不可妥协项",
  "可协商项",
  "高风险类型",
  "约会提问清单",
  "AI 成长建议"
];

const stageSections: Array<{
  key: keyof typeof stageRoles;
  pattern: RegExp;
}> = [
  { key: "自我画像", pattern: /## 4\. 自我画像[\s\S]*?## 5\./ },
  { key: "价值罗盘", pattern: /## 6\. 价值罗盘[\s\S]*?## 7\./ },
  { key: "亲密模式", pattern: /## 8\. 亲密模式[\s\S]*?## 9\./ },
  { key: "理想伴侣", pattern: /## 10\. 理想伴侣[\s\S]*?## 11\./ }
];

const getMappingCell = (questionId: string) => {
  const row = mappingDoc
    .split("\n")
    .find((line) => line.startsWith(`| ${questionId} |`));

  return row?.split("|")[3]?.trim() ?? "";
};

const getMappingRows = () =>
  mappingDoc
    .split("\n")
    .filter((line) => /^\| (?:SF|SFO|VR|VRO|IM|IMO|PR|PRO)\d{2} \|/.test(line))
    .map((line) => line.split("|").map((cell) => cell.trim()));

const splitLandingPoints = (cell: string) =>
  cell
    .split(/[、/]/)
    .map((value) => value.trim())
    .filter(Boolean);

describe("question-to-report mapping docs", () => {
  it("maps every final questionnaire id exactly into the mapping document", () => {
    const missing = questionIds.filter((id) => !new RegExp(`\\b${id}\\b`).test(mappingDoc));

    expect(questionIds).toHaveLength(68);
    expect(new Set(questionIds).size).toBe(68);
    expect(missing).toEqual([]);
  });

  it("keeps stage role mappings inside their own stage", () => {
    const crossStageRoles = stageSections.flatMap(({ key, pattern }) => {
      const section = mappingDoc.match(pattern)?.[0] ?? "";
      const allowedRoles = stageRoles[key];

      return allRoles
        .filter((role) => !(allowedRoles as readonly string[]).includes(role))
        .filter((role) => section.includes(role))
        .map((role) => `${key}:${role}`);
    });

    expect(crossStageRoles).toEqual([]);
  });

  it("covers every structured answer possibility in the mapping table", () => {
    const missingAnswerMappings = questionBank.flatMap((question) => {
      if (question.type === "openText") return [];

      const mappingCell = getMappingCell(question.id);

      if (!mappingCell) return [`${question.id}:missing row`];

      if (question.type === "scale") {
        return ["1-2", "3", "4-5"]
          .filter((bucket) => !mappingCell.includes(bucket))
          .map((bucket) => `${question.id}:${bucket}`);
      }

      if (question.type === "singleChoice") {
        return question.options
          .map((option) => option.value)
          .filter((value) => !new RegExp(`(?:^|[；\\s])${value}\\s`).test(mappingCell))
          .map((value) => `${question.id}:${value}`);
      }

      return question.options
        .map((option) => option.label)
        .filter((label) => !mappingCell.includes(label))
        .map((label) => `${question.id}:${label}`);
    });

    expect(missingAnswerMappings).toEqual([]);
  });

  it("keeps the same 16 stage roles across report docs", () => {
    const missingRoles = allRoles.flatMap((role) => {
      const missingIn: string[] = [];

      if (!reportSystemDoc.includes(role)) missingIn.push("报告生成系统设计");
      if (!reportTemplateDoc.includes(role)) missingIn.push("阶段报告样例模板");
      if (!mappingDoc.includes(role)) missingIn.push("问卷答案到报告结构映射表");
      if (!questionDoc.includes(role)) missingIn.push("标准版问卷题库设计");

      return missingIn.map((doc) => `${doc}:${role}`);
    });

    expect(missingRoles).toEqual([]);
  });

  it("uses only report-system landing points in the mapping table", () => {
    const invalidLandingPoints = getMappingRows().flatMap((cells) => {
      const questionId = cells[1];
      const isOpenEnded = /^[A-Z]+O\d{2}$/.test(questionId);
      const stageLanding = isOpenEnded ? cells[3] ?? "" : cells[4] ?? "";
      const finalLanding = isOpenEnded ? cells[4] ?? "" : cells[5] ?? "";

      const invalidStageLanding = splitLandingPoints(stageLanding)
        .filter((point) => !allowedStageLandingPoints.includes(point))
        .map((point) => `${questionId}:stage:${point}`);

      const invalidFinalLanding = splitLandingPoints(finalLanding)
        .filter((point) => !allowedFinalLandingPoints.includes(point))
        .map((point) => `${questionId}:final:${point}`);

      return [...invalidStageLanding, ...invalidFinalLanding];
    });

    expect(invalidLandingPoints).toEqual([]);
  });

  it("anchors the three core product questions across questionnaire and report docs", () => {
    const coreQuestions = [
      "我是谁",
      "我的三观和亲密模式是什么",
      "我适合什么样的 TA，以及下一步怎么行动"
    ];

    const missingCoreQuestions = coreQuestions.flatMap((question) => {
      const missingIn: string[] = [];

      if (!questionDoc.includes(question)) missingIn.push("标准版问卷题库设计");
      if (!reportSystemDoc.includes(question)) missingIn.push("报告生成系统设计");

      return missingIn.map((doc) => `${doc}:${question}`);
    });

    expect(missingCoreQuestions).toEqual([]);
  });
});
