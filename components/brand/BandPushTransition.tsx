"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useBrand } from "@/components/brand/BrandProvider";
import {
  BAND_TRANSITION_EASE,
  BAND_TRANSITION_MS,
} from "@/lib/brand-transition";
import type { BrandSlug } from "@/lib/types";

export function BandPushTransition({
  r2Live,
  katg,
}: {
  r2Live: ReactNode;
  katg: ReactNode;
}) {
  const { activeBrand, isSweeping } = useBrand();
  const prefersReducedMotion = useReducedMotion();

  const duration = prefersReducedMotion ? 0 : BAND_TRANSITION_MS / 1000;

  return (
    <div
      className="relative overflow-x-clip"
      aria-live="polite"
      data-transitioning={isSweeping || undefined}
    >
      <motion.div
        className="flex w-[200%] will-change-transform [backface-visibility:hidden]"
        initial={false}
        animate={{ x: activeBrand === "katg" ? "-50%" : "0%" }}
        transition={{ duration, ease: BAND_TRANSITION_EASE }}
      >
        <BandPane
          brand="r2-live"
          isActive={activeBrand === "r2-live"}
          isSweeping={isSweeping}
          duration={duration}
        >
          {r2Live}
        </BandPane>
        <BandPane
          brand="katg"
          isActive={activeBrand === "katg"}
          isSweeping={isSweeping}
          duration={duration}
          className="-ml-px"
        >
          {katg}
        </BandPane>
      </motion.div>
    </div>
  );
}

function BandPane({
  brand,
  isActive,
  isSweeping,
  duration,
  className,
  children,
}: {
  brand: BrandSlug;
  isActive: boolean;
  isSweeping: boolean;
  duration: number;
  className?: string;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isOutgoing = isSweeping && !isActive;

  return (
    <motion.div
      className={`w-1/2 shrink-0 origin-center [backface-visibility:hidden] ${className ?? ""}`}
      aria-hidden={!isActive && !isSweeping}
      inert={!isActive && !isSweeping ? true : undefined}
      initial={false}
      animate={
        prefersReducedMotion
          ? { scale: 1, opacity: 1, filter: "brightness(1)" }
          : {
              scale: isOutgoing ? 0.975 : 1,
              opacity: isOutgoing ? 0.82 : 1,
              filter: isOutgoing ? "brightness(0.94)" : "brightness(1)",
            }
      }
      transition={{ duration, ease: BAND_TRANSITION_EASE }}
      data-brand-pane={brand}
    >
      {children}
    </motion.div>
  );
}
