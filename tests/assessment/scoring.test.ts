import { describe, expect, it } from "vitest";
import { questionBank } from "@/lib/assessment/questionBank";
import { scoreAssessment } from "@/lib/assessment/scoring";
import type { AssessmentAnswer } from "@/lib/assessment/types";

const answerForOption = (questionId: string, optionValue: string): AssessmentAnswer => ({
  questionId,
  value: optionValue
});

describe("scoreAssessment", () => {
  it("returns normalized scores and a primary relationship type", () => {
    const answers = questionBank
      .filter((question) => question.type !== "openText")
      .map((question) => answerForOption(question.id, question.options[0].value));

    const result = scoreAssessment(answers);

    expect(result.primaryType).toBeTruthy();
    expect(result.secondaryType).toBeTruthy();
    expect(Object.values(result.dimensionScores).every((score) => score >= 0 && score <= 100)).toBe(true);
    expect(result.layerScores.selfFoundation).toBeGreaterThanOrEqual(0);
    expect(result.layerScores.valuesScript).toBeGreaterThanOrEqual(0);
  });

  it("scores a security-seeking profile as high security need", () => {
    const answers: AssessmentAnswer[] = [
      answerForOption("IM01", "A"),
      answerForOption("IM02", "A"),
      answerForOption("IM03", "5"),
      answerForOption("PR10", "A")
    ];

    const result = scoreAssessment(answers);

    expect(result.dimensionScores.securityNeed).toBeGreaterThan(65);
    expect(result.primaryType).toBe("高安全感需求型");
  });
});
