export type HeroClipMode =
  | "sixteen-nine"
  | "reveal-bottom"
  | "crop-sides"
  | "square-scale";

export type HeroClipLayout = {
  mode: HeroClipMode;
  /** Viewport width in px; full width when `useFullWidth` is true. */
  viewportWidth: number;
  useFullWidth: boolean;
  /** Rendered 4:3 image box (never distorted). */
  imageWidth: number;
  imageHeight: number;
  imageTop: number;
};

const RATIO_4_3 = 4 / 3;
const RATIO_16_9 = 16 / 9;

export const HERO_BASE_HEIGHT_VH = 72;

/** Below 1:1 the banner height tracks width so the square image fills with no gaps. */
export function computeHeroBannerHeight(
  containerW: number,
  baseH: number,
): number {
  return containerW <= baseH ? containerW : baseH;
}

/**
 * Hero clip model (fixed container height H, width W):
 *
 * W ≥ H·16/9 → 16:9 viewport centered, top-anchored 4:3 image (bottom clipped)
 * H·4/3 ≤ W < H·16/9 → full-width viewport, image width W reveals bottom until 4:3
 * H < W < H·4/3 → full height image, horizontal center crop toward 1:1
 * W ≤ H → 1:1 center crop scaled to viewport width
 */
export function computeHeroClipLayout(
  containerW: number,
  containerH: number,
): HeroClipLayout {
  const width16_9 = containerH * RATIO_16_9;
  const width4_3 = containerH * RATIO_4_3;

  if (containerW >= width16_9) {
    return {
      mode: "sixteen-nine",
      useFullWidth: false,
      viewportWidth: width16_9,
      imageWidth: width16_9,
      imageHeight: width16_9 * (3 / 4),
      imageTop: 0,
    };
  }

  if (containerW >= width4_3) {
    return {
      mode: "reveal-bottom",
      useFullWidth: true,
      viewportWidth: containerW,
      imageWidth: containerW,
      imageHeight: containerW * (3 / 4),
      imageTop: 0,
    };
  }

  if (containerW > containerH) {
    return {
      mode: "crop-sides",
      useFullWidth: true,
      viewportWidth: containerW,
      imageWidth: width4_3,
      imageHeight: containerH,
      imageTop: 0,
    };
  }

  return {
    mode: "square-scale",
    useFullWidth: true,
    viewportWidth: containerW,
    imageWidth: containerW * RATIO_4_3,
    imageHeight: containerW,
    imageTop: (containerH - containerW) / 2,
  };
}
