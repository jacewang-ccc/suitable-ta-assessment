import { describe, expect, it } from "vitest";
import { questionBank } from "@/lib/assessment/questionBank";

describe("questionBank", () => {
  it("covers the four-layer relationship assessment model", () => {
    const layers = new Set(questionBank.map((question) => question.layer));

    expect(layers).toEqual(
      new Set([
        "selfFoundation",
        "valuesScript",
        "intimacyMechanism",
        "partnerReality"
      ])
    );
  });

  it("contains the 68-question standard assessment", () => {
    const structured = questionBank.filter((question) => question.type !== "openText");
    const openEnded = questionBank.filter((question) => question.type === "openText");

    expect(structured).toHaveLength(50);
    expect(openEnded).toHaveLength(18);
  });

  it("uses the formal 68-question id series from the final content design", () => {
    const ids = questionBank.map((question) => question.id);

    expect(ids.slice(0, 14)).toEqual([
      ...Array.from({ length: 11 }, (_, index) => `SF${String(index + 1).padStart(2, "0")}`),
      "SFO01",
      "SFO02",
      "SFO03"
    ]);
    expect(ids.slice(14, 30)).toEqual([
      ...Array.from({ length: 12 }, (_, index) => `VR${String(index + 1).padStart(2, "0")}`),
      "VRO01",
      "VRO02",
      "VRO03",
      "VRO04"
    ]);
    expect(ids.slice(30, 48)).toEqual([
      ...Array.from({ length: 13 }, (_, index) => `IM${String(index + 1).padStart(2, "0")}`),
      "IMO01",
      "IMO02",
      "IMO03",
      "IMO04",
      "IMO05"
    ]);
    expect(ids.slice(48)).toEqual([
      ...Array.from({ length: 14 }, (_, index) => `PR${String(index + 1).padStart(2, "0")}`),
      "PRO01",
      "PRO02",
      "PRO03",
      "PRO04",
      "PRO05",
      "PRO06"
    ]);
  });

  it("has scoring metadata for every structured question", () => {
    const structured = questionBank.filter((question) => question.type !== "openText");

    expect(structured.every((question) => question.scoring.length > 0)).toBe(true);
  });
});
