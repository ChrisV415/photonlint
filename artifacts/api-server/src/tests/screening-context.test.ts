import { describe, expect, it } from "vitest";
import { buildScreeningContext, screeningContextFromLayoutData } from "../lib/screening.js";

describe("screening context", () => {
  it("never represents public reference thresholds as official foundry sign-off", () => {
    const context = buildScreeningContext(false);
    expect(context.officialFoundrySignoff).toBe(false);
    expect(context.ruleSource).toBe("public-reference-estimate");
    expect(context.disclaimer).toMatch(/not official foundry DRC/i);
  });

  it("labels engineering overrides as unverified rather than official PDK rules", () => {
    const context = buildScreeningContext(true);
    expect(context.ruleSource).toBe("engineering-override");
    expect(context.ruleSourceLabel).toMatch(/not independently verified/i);
  });

  it("uses the conservative public-reference label for historic results without provenance", () => {
    expect(screeningContextFromLayoutData(null).officialFoundrySignoff).toBe(false);
  });
});