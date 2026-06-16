export type ConflictStyle = "direct_talk" | "cool_down" | "avoid" | "explode" | "freeze";

export type AiConfidence = "low" | "medium" | "high";

export interface AiAnalysis {
  valueSignals: string[];
  emotionalNeeds: string[];
  relationshipFears: string[];
  conflictPattern: {
    style: ConflictStyle;
    evidence: string;
  };
  partnerExpectations: string[];
  nonNegotiableCandidates: string[];
  negotiableCandidates: string[];
  attractionRisks: string[];
  contradictions: Array<{
    signalA: string;
    signalB: string;
    interpretation: string;
  }>;
  quoteCandidates: string[];
  confidence: AiConfidence;
}

export const aiAnalysisPrompt = `你是一个亲密关系测评产品的分析助手。

任务：
根据用户的开放题回答，提取关系自我认知信号。你不是心理医生，不做诊断，不给绝对匹配结论。

请分析：
1. 用户反复出现的价值观信号；
2. 用户在关系里的情绪需求；
3. 用户对长期关系的恐惧；
4. 用户的冲突处理模式；
5. 用户对伴侣的显性和隐性期待；
6. 用户的候选不可妥协项；
7. 用户的候选可协商项；
8. 用户可能存在的吸引模式风险；
9. 用户表达里的矛盾。

要求：
- 只返回 JSON；
- 不要输出 Markdown；
- 不要使用心理诊断标签；
- 如果证据不足，confidence 用 low；
- 每个字段最多 5 条；
- quoteCandidates 每条不超过 30 个中文字。`;

const conflictStyles: ConflictStyle[] = ["direct_talk", "cool_down", "avoid", "explode", "freeze"];
const confidenceValues: AiConfidence[] = ["low", "medium", "high"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown) => Array.isArray(value) && value.every((item) => typeof item === "string");

const isConflictPattern = (value: unknown): value is AiAnalysis["conflictPattern"] =>
  isRecord(value) &&
  typeof value.evidence === "string" &&
  typeof value.style === "string" &&
  conflictStyles.includes(value.style as ConflictStyle);

const isContradictions = (value: unknown): value is AiAnalysis["contradictions"] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      isRecord(item) &&
      typeof item.signalA === "string" &&
      typeof item.signalB === "string" &&
      typeof item.interpretation === "string"
  );

export function validateAiAnalysis(value: unknown): { valid: boolean; data?: AiAnalysis; error?: string } {
  if (!isRecord(value)) {
    return { valid: false, error: "analysis must be an object" };
  }

  const requiredStringArrays = [
    "valueSignals",
    "emotionalNeeds",
    "relationshipFears",
    "partnerExpectations",
    "nonNegotiableCandidates",
    "negotiableCandidates",
    "attractionRisks",
    "quoteCandidates"
  ];

  for (const key of requiredStringArrays) {
    if (!isStringArray(value[key])) {
      return { valid: false, error: `${key} must be a string array` };
    }
  }

  if (!isConflictPattern(value.conflictPattern)) {
    return { valid: false, error: "conflictPattern is invalid" };
  }

  if (!isContradictions(value.contradictions)) {
    return { valid: false, error: "contradictions is invalid" };
  }

  if (typeof value.confidence !== "string" || !confidenceValues.includes(value.confidence as AiConfidence)) {
    return { valid: false, error: "confidence is invalid" };
  }

  return { valid: true, data: value as unknown as AiAnalysis };
}
