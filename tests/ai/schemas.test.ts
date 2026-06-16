import { describe, expect, it } from "vitest";
import { aiAnalysisPrompt, validateAiAnalysis } from "@/lib/ai/schemas";

describe("AI analysis schema", () => {
  it("accepts the structured analysis shape from the design document", () => {
    const result = validateAiAnalysis({
      valueSignals: ["稳定", "成长"],
      emotionalNeeds: ["稳定回应"],
      relationshipFears: ["长期模糊"],
      conflictPattern: {
        style: "direct_talk",
        evidence: "希望直接沟通"
      },
      partnerExpectations: ["表达清楚"],
      nonNegotiableCandidates: ["拒绝冷处理"],
      negotiableCandidates: ["见面频率"],
      attractionRisks: ["容易被有距离感的人吸引"],
      contradictions: [
        {
          signalA: "需要承诺",
          signalB: "容易被不确定吸引",
          interpretation: "可能把不确定误认为吸引力"
        }
      ],
      quoteCandidates: ["不要让我猜"],
      confidence: "medium"
    });

    expect(result.valid).toBe(true);
  });

  it("keeps the prompt constrained away from diagnosis language", () => {
    expect(aiAnalysisPrompt).toContain("不做诊断");
    expect(aiAnalysisPrompt).toContain("只返回 JSON");
  });
});
