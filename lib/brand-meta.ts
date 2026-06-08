import type { BrandSlug } from "@/lib/types";

export const BRAND_META: Record<
  BrandSlug,
  {
    label: string;
    accentBorder: string;
    accentText: string;
    accentBg: string;
    bandBg: string;
    accentShadow: string;
    inactiveShadow: string;
  }
> = {
  "r2-live": {
    label: "R2-Live",
    accentBorder: "border-accent-r2",
    accentText: "text-accent-r2",
    accentBg: "bg-accent-r2",
    bandBg: "bg-[color-mix(in_srgb,var(--accent-r2)_10%,var(--surface))]",
    accentShadow: "shadow-[3px_3px_0_rgba(196,92,38,0.35)]",
    inactiveShadow: "shadow-[2px_2px_0_rgba(42,31,20,0.15)]",
  },
  katg: {
    label: "KURT & THE GANG",
    accentBorder: "border-accent-katg",
    accentText: "text-accent-katg",
    accentBg: "bg-accent-katg",
    bandBg: "bg-[color-mix(in_srgb,var(--accent-katg)_10%,var(--surface))]",
    accentShadow: "shadow-[3px_3px_0_rgba(26,83,92,0.35)]",
    inactiveShadow: "shadow-[2px_2px_0_rgba(42,31,20,0.15)]",
  },
};
