import { questionBank } from "./questionBank";
import type {
  AssessmentAnswer,
  AssessmentLayer,
  AssessmentScoreResult,
  DimensionKey,
  DimensionScores,
  ResultType
} from "./types";

const dimensionKeys: DimensionKey[] = [
  "exploration",
  "planning",
  "expression",
  "emotionalStability",
  "uncertaintyTolerance",
  "freedom",
  "stability",
  "growth",
  "familyBoundary",
  "securityNeed",
  "autonomyNeed",
  "repairAbility",
  "commitmentNeed",
  "partnerSteadiness",
  "realityAlignment"
];

const layerDimensions: Record<AssessmentLayer, DimensionKey[]> = {
  selfFoundation: ["exploration", "planning", "expression", "emotionalStability", "uncertaintyTolerance"],
  valuesScript: ["freedom", "stability", "growth", "familyBoundary"],
  intimacyMechanism: ["securityNeed", "autonomyNeed", "repairAbility", "commitmentNeed"],
  partnerReality: ["partnerSteadiness", "realityAlignment", "familyBoundary", "commitmentNeed"]
};

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const selectedValues = (value: AssessmentAnswer["value"]) => (Array.isArray(value) ? value : [value]);

export function scoreAssessment(answers: AssessmentAnswer[]): AssessmentScoreResult {
  const rawScores = Object.fromEntries(dimensionKeys.map((key) => [key, 50])) as DimensionScores;

  for (const answer of answers) {
    const question = questionBank.find((item) => item.id === answer.questionId);
    if (!question || question.type === "openText") continue;

    const values = selectedValues(answer.value);

    for (const [index, value] of values.entries()) {
      const option = question.options.find((item) => item.value === value);
      if (!option) continue;
      const weight =
        question.type === "ranking"
          ? Math.max(0.45, 1 - index * 0.15)
          : 1;

      for (const [dimension, effect] of Object.entries(option.effect) as [DimensionKey, number][]) {
        rawScores[dimension] += effect * weight;
      }
    }
  }

  const dimensionScores = Object.fromEntries(
    dimensionKeys.map((key) => [key, clamp(rawScores[key])])
  ) as DimensionScores;

  const layerScores = Object.fromEntries(
    Object.entries(layerDimensions).map(([layer, dimensions]) => {
      const average = dimensions.reduce((sum, key) => sum + dimensionScores[key], 0) / dimensions.length;
      return [layer, clamp(average)];
    })
  ) as AssessmentScoreResult["layerScores"];

  const typeScores: Record<ResultType, number> = {
    稳定共建型:
      dimensionScores.stability + dimensionScores.commitmentNeed + dimensionScores.partnerSteadiness,
    精神同频型: dimensionScores.expression + dimensionScores.repairAbility + dimensionScores.growth,
    独立边界型: dimensionScores.autonomyNeed + dimensionScores.familyBoundary + dimensionScores.freedom,
    高安全感需求型: dimensionScores.securityNeed * 1.5 + dimensionScores.commitmentNeed,
    成长伙伴型: dimensionScores.growth + dimensionScores.planning + dimensionScores.realityAlignment,
    自由探索型: dimensionScores.exploration + dimensionScores.freedom + dimensionScores.uncertaintyTolerance
  };

  const rankedTypes = (Object.entries(typeScores) as [ResultType, number][])
    .sort((left, right) => right[1] - left[1])
    .map(([type]) => type);

  return {
    primaryType: rankedTypes[0],
    secondaryType: rankedTypes[1],
    dimensionScores,
    layerScores
  };
}
