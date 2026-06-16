export type AssessmentLayer =
  | "selfFoundation"
  | "valuesScript"
  | "intimacyMechanism"
  | "partnerReality";

export type QuestionType = "singleChoice" | "multipleChoice" | "scale" | "ranking" | "openText";

export type DimensionKey =
  | "exploration"
  | "planning"
  | "expression"
  | "emotionalStability"
  | "uncertaintyTolerance"
  | "freedom"
  | "stability"
  | "growth"
  | "familyBoundary"
  | "securityNeed"
  | "autonomyNeed"
  | "repairAbility"
  | "commitmentNeed"
  | "partnerSteadiness"
  | "realityAlignment";

export type ResultType =
  | "稳定共建型"
  | "精神同频型"
  | "独立边界型"
  | "高安全感需求型"
  | "成长伙伴型"
  | "自由探索型";

export type ScoringEffect = Partial<Record<DimensionKey, number>>;

export interface QuestionOption {
  value: string;
  label: string;
  effect: ScoringEffect;
}

export interface AssessmentQuestion {
  id: string;
  layer: AssessmentLayer;
  dimension: DimensionKey;
  type: QuestionType;
  title: string;
  required: boolean;
  options: QuestionOption[];
  scoring: DimensionKey[];
}

export interface AssessmentAnswer {
  questionId: string;
  value: string | string[];
}

export type DimensionScores = Record<DimensionKey, number>;

export type LayerScores = Record<AssessmentLayer, number>;

export interface AssessmentScoreResult {
  primaryType: ResultType;
  secondaryType: ResultType;
  dimensionScores: DimensionScores;
  layerScores: LayerScores;
}
