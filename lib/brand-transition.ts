export const BAND_TRANSITION_MS = 520;

export const BAND_TRANSITION_EASE = [0.65, 0, 0.35, 1] as const;

export type BrandTransitionDirection = "left" | "right";

export function getTransitionDirection(
  brand: "r2-live" | "katg",
): BrandTransitionDirection {
  return brand === "katg" ? "left" : "right";
}
