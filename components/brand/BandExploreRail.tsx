"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useBrand } from "@/components/brand/BrandProvider";
import type { BrandSlug } from "@/lib/types";

type ExploreConfig = {
  target: BrandSlug;
  side: "left" | "right";
  edgeClass: string;
  accentClass: string;
  accentMutedClass: string;
  label: string;
  tagline: string;
  arrow: string;
};

const EXPLORE: Record<BrandSlug, ExploreConfig> = {
  "r2-live": {
    target: "katg",
    side: "right",
    edgeClass: "explore-rail-edge--katg",
    accentClass: "bg-accent-katg",
    accentMutedClass: "text-accent-katg",
    label: "KURT & THE GANG",
    tagline: "Volle Band",
    arrow: "→",
  },
  katg: {
    target: "r2-live",
    side: "left",
    edgeClass: "explore-rail-edge--r2",
    accentClass: "bg-accent-r2",
    accentMutedClass: "text-accent-r2",
    label: "R2-LIVE",
    tagline: "Duo",
    arrow: "←",
  },
};

export function BandExploreRail() {
  const { activeBrand, setActiveBrand, navVisible } = useBrand();
  const prefersReducedMotion = useReducedMotion();
  const config = EXPLORE[activeBrand];
  const isRight = config.side === "right";

  return (
    <AnimatePresence mode="wait">
      {navVisible ? (
        <motion.aside
          key={activeBrand}
          aria-label={
            activeBrand === "r2-live"
              ? "Zu KURT & THE GANG wechseln"
              : "Zu R2-Live wechseln"
          }
          initial={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 0, x: isRight ? 28 : -28 }
          }
          animate={{ opacity: 1, x: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, x: isRight ? 28 : -28 }
          }
          transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
          className={`explore-rail pointer-events-none fixed inset-y-0 w-0 ${
            isRight ? "right-0" : "left-0"
          }`}
        >
          <div
            className={`explore-rail-edge ${config.edgeClass} pointer-events-none absolute ${
              isRight ? "right-0" : "left-0"
            }`}
            aria-hidden
          />

          <motion.button
            type="button"
            onClick={() => setActiveBrand(config.target)}
            className={`explore-rail-tab pointer-events-auto absolute top-1/2 z-10 flex -translate-y-1/2 flex-col items-center border-2 border-foreground/15 bg-surface shadow-[4px_4px_0_rgba(42,31,20,0.35)] ${
              isRight
                ? "right-0 origin-right rounded-l-sm border-r-0 pr-1 pl-2"
                : "left-0 origin-left rounded-r-sm border-l-0 pr-2 pl-1"
            }`}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          >
            <span
              className={`font-display mt-2 text-[0.55rem] uppercase tracking-[0.28em] ${config.accentMutedClass}`}
            >
              {config.tagline}
            </span>

            <span className="explore-rail-label my-2 flex h-24 w-8 items-center justify-center overflow-hidden sm:h-28 sm:w-9">
              <span
                className={`font-display inline-block whitespace-nowrap text-sm uppercase tracking-[0.18em] sm:text-base ${config.accentMutedClass} ${
                  isRight ? "-rotate-90" : "rotate-90"
                }`}
              >
                {config.label}
              </span>
            </span>

            <motion.span
              className={`font-display mb-2 text-xl leading-none ${config.accentMutedClass}`}
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { x: isRight ? [0, 4, 0] : [0, -4, 0] }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
            >
              {config.arrow}
            </motion.span>

            <span
              className={`mb-2 h-1 w-8 ${config.accentClass} sm:w-10`}
              aria-hidden
            />
          </motion.button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
