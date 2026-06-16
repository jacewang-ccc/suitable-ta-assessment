import { describe, expect, it } from "vitest";
import { auditArchetypeOptionCoverage, auditArchetypeOptionUniqueness, generateReport } from "@/lib/report/generator";
import type { AssessmentAnswer } from "@/lib/assessment/types";

describe("generateReport", () => {
  it("creates a preview and keeps the full report locked by default", () => {
    const answers: AssessmentAnswer[] = [
      { questionId: "IM02", value: "A" },
      { questionId: "IM01", value: "A" },
      { questionId: "IMO01", value: "我希望对方遇到问题能直接说清楚，不要冷处理。" }
    ];

    const report = generateReport(answers, false);

    expect(report.isUnlocked).toBe(false);
    expect(report.preview.insights.length).toBeGreaterThanOrEqual(2);
    expect(report.stageReports).toHaveLength(4);
    expect(report.stageReports.map((stage) => stage.reportTitle)).toEqual([
      "自我画像报告",
      "价值罗盘报告",
      "亲密模式报告",
      "理想伴侣报告"
    ]);
    expect(report.stageReports[0].strengths.length).toBeGreaterThan(0);
    expect(report.stageReports[0].watchOuts.length).toBeGreaterThan(0);
    expect(report.stageReports[0].practices.length).toBeGreaterThan(0);
    expect(report.fullReport).toBeNull();
  });

  it("includes complete partner guidance after unlock", () => {
    const report = generateReport(
      [
        { questionId: "VR01", value: "A" },
        { questionId: "PR01", value: "A" }
      ],
      true
    );

    expect(report.isUnlocked).toBe(true);
    expect(report.fullReport?.idealPartner.coreTraits.length).toBeGreaterThan(0);
    expect(report.fullReport?.actionPlan.nonNegotiables.length).toBeGreaterThan(0);
    expect(report.fullReport?.modules.map((module) => module.title)).toEqual([
      "关系自画像",
      "我是谁",
      "我的三观",
      "我的亲密关系机制",
      "适合我的 TA",
      "高风险关系类型",
      "行动建议"
    ]);
  });

  it("tracks completion state for each stage report", () => {
    const report = generateReport(
      [
        { questionId: "SF01", value: "A" },
        { questionId: "SF02", value: "A" },
        { questionId: "VR01", value: "A" }
      ],
      false
    );

    const selfReport = report.stageReports.find((stage) => stage.layer === "selfFoundation");
    const valuesReport = report.stageReports.find((stage) => stage.layer === "valuesScript");

    expect(selfReport?.answerCount).toBe(2);
    expect(selfReport?.isComplete).toBe(false);
    expect(valuesReport?.answerCount).toBe(1);
    expect(valuesReport?.summary).toContain("生成中");
  });

  it("derives different stage archetypes from answer signals", () => {
    const explorerReport = generateReport(
      [
        { questionId: "VR01", value: "B" },
        { questionId: "VR11", value: "B" },
        { questionId: "VR12", value: "B" },
        { questionId: "VRO04", value: "我希望伴侣支持我探索，不要太早把我固定住。" }
      ],
      false
    );
    const harborReport = generateReport(
      [
        { questionId: "VR06", value: "A" },
        { questionId: "VR07", value: "5" },
        { questionId: "VR11", value: "A" },
        { questionId: "VRO02", value: "钱代表两个人共同面对风险的安全感和责任。" }
      ],
      false
    );

    const explorerValues = explorerReport.stageReports.find((stage) => stage.layer === "valuesScript");
    const harborValues = harborReport.stageReports.find((stage) => stage.layer === "valuesScript");

    expect(explorerValues?.archetype.name).toBe("罗盘探路者");
    expect(harborValues?.archetype.name).toBe("港湾建造师");
    expect(explorerValues?.archetype.evidence.length).toBeGreaterThan(0);
    expect(harborValues?.archetype.evidence.join(" ")).toContain("安全");
  });

  it("uses risk and attraction answers to derive the partner archetype", () => {
    const report = generateReport(
      [
        { questionId: "PR13", value: "C" },
        { questionId: "PR10", value: "B" },
        { questionId: "PR11", value: ["hot_cold", "boundary_mess"] },
        { questionId: "PRO02", value: "我容易被有距离感的人吸引，但知道忽冷忽热和边界混乱不适合长期。" }
      ],
      false
    );

    const partnerReport = report.stageReports.find((stage) => stage.layer === "partnerReality");

    expect(partnerReport?.archetype.name).toBe("风暴识别师");
    expect(partnerReport?.insufficiencies[0]).toContain("过早防御");
    expect(partnerReport?.sections.find((section) => section.title === "风险识别")?.templateText).toContain(
      "主模块"
    );
  });

  it("keeps every structured option mapped to an archetype rule or fallback", () => {
    expect(auditArchetypeOptionCoverage()).toEqual([]);
  });

  it("keeps every structured option mapped to one primary archetype rule at most", () => {
    expect(auditArchetypeOptionUniqueness()).toEqual([]);
  });

  it("keeps neutral structured answers classifiable", () => {
    const report = generateReport([{ questionId: "SF03", value: "3" }], false);
    const selfReport = report.stageReports.find((stage) => stage.layer === "selfFoundation");

    expect(selfReport?.archetype.name).toBe("云朵疗愈师");
    expect(selfReport?.archetype.evidence.length).toBeGreaterThan(0);
  });

  it("uses semantic fallback for open answers instead of literal text matching", () => {
    const report = generateReport([{ questionId: "VRO02", value: "这是一段没有预设触发词的回答。" }], false);
    const valuesReport = report.stageReports.find((stage) => stage.layer === "valuesScript");

    expect(valuesReport?.archetype.name).toBe("港湾建造师");
    expect(valuesReport?.archetype.evidence.join(" ")).toContain("AI 语义分析");
  });
});
