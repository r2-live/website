"use client";

import type { ReactNode } from "react";
import type { BrandSlug } from "@/lib/types";

function BandLayer({
  brand,
  activeBrand,
  layerId,
  children,
}: {
  brand: BrandSlug;
  activeBrand: BrandSlug;
  layerId: string;
  children: ReactNode;
}) {
  const isActive = activeBrand === brand;

  return (
    <div
      id={layerId}
      className={`[grid-area:stack] ${
        isActive
          ? "visible relative z-10"
          : "invisible pointer-events-none"
      }`}
      aria-hidden={!isActive}
    >
      {children}
    </div>
  );
}

export function SyncedBandSection({
  sectionId,
  activeBrand,
  r2Live,
  katg,
}: {
  sectionId: string;
  activeBrand: BrandSlug;
  r2Live: ReactNode;
  katg: ReactNode;
}) {
  return (
    <section
      id={`band-${sectionId}`}
      className="section-shell grid [grid-template-areas:'stack']"
    >
      <BandLayer
        brand="r2-live"
        activeBrand={activeBrand}
        layerId={`r2-live-${sectionId}`}
      >
        {r2Live}
      </BandLayer>
      <BandLayer
        brand="katg"
        activeBrand={activeBrand}
        layerId={`katg-${sectionId}`}
      >
        {katg}
      </BandLayer>
    </section>
  );
}
