export type RuleSource = "public-reference-estimate" | "engineering-override";

export interface ScreeningContext {
  outcome: "preliminary-geometry-screen";
  ruleSource: RuleSource;
  ruleSourceLabel: string;
  officialFoundrySignoff: false;
  disclaimer: string;
  bendMethod: string;
}

const DISCLAIMER =
  "This is a preliminary geometry screen, not official foundry DRC, PDK validation, or tape-out sign-off.";

const BEND_METHOD =
  "Bend findings use a local circumradius estimate from consecutive polygon vertices; they do not reconstruct the original waveguide centerline or curve.";

export function buildScreeningContext(hasEngineeringOverride: boolean): ScreeningContext {
  return {
    outcome: "preliminary-geometry-screen",
    ruleSource: hasEngineeringOverride ? "engineering-override" : "public-reference-estimate",
    ruleSourceLabel: hasEngineeringOverride
      ? "Engineering override — not independently verified against an official foundry deck"
      : "Public reference estimate — not an NDA-gated official foundry PDK",
    officialFoundrySignoff: false,
    disclaimer: DISCLAIMER,
    bendMethod: BEND_METHOD,
  };
}

export function screeningContextFromLayoutData(layoutData: unknown): ScreeningContext {
  if (layoutData && typeof layoutData === "object") {
    const candidate = (layoutData as Record<string, unknown>)["screening"];
    if (
      candidate &&
      typeof candidate === "object" &&
      (candidate as Record<string, unknown>)["officialFoundrySignoff"] === false
    ) {
      return candidate as ScreeningContext;
    }
  }
  // Historic runs predate persisted provenance. Use the conservative default.
  return buildScreeningContext(false);
}