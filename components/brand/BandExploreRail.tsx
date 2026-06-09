"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useBrand } from "@/components/brand/BrandProvider";
import { BRAND_META } from "@/lib/brand-meta";
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
    label: "Kurt & The Gang",
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
  const targetMeta = BRAND_META[config.target];
  const isRight = config.side === "right";

  return (
    <AnimatePresence mode="wait">
      {navVisible ? (
        <motion.aside
          key={activeBrand}
          aria-label={
            activeBrand === "r2-live"
              ? "Zu Kurt & The Gang wechseln"
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
          className={`explore-rail pointer-events-none fixed top-0 w-0 ${
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
            aria-label={
              activeBrand === "r2-live"
                ? "Zu Kurt & The Gang wechseln"
                : "Zu R2-Live wechseln"
            }
            className={`explore-rail-tab pointer-events-auto absolute top-auto z-10 flex max-lg:translate-none flex-col items-center border-2 max-lg:bottom-6 sm:tall:max-lg:bottom-8 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 ${targetMeta.accentBorder} ${targetMeta.bandBg} ${targetMeta.inactiveShadow} hover:shadow-[3px_3px_0_rgba(42,31,20,0.2)] ${
              isRight
                ? "right-0 origin-right rounded-l-md rounded-r-none border-r-0 py-2.5 pl-1.5 pr-1 sm:tall:py-1 sm:tall:pl-3 sm:tall:pr-2"
                : "left-0 origin-left rounded-r-md rounded-l-none border-l-0 py-2.5 pr-1.5 pl-1 sm:tall:py-1 sm:tall:pr-3 sm:tall:pl-2"
            }`}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          >
            <span
              className={`font-display flex h-16 w-7 items-center justify-center sm:tall:hidden ${config.accentMutedClass}`}
            >
              <span
                className={`inline-block whitespace-nowrap text-[0.7rem] uppercase tracking-[0.09em] ${
                  isRight ? "-rotate-90" : "rotate-90"
                }`}
              >
                {config.tagline}
              </span>
            </span>
            <span
              className={`font-display mt-1 hidden text-xs uppercase tracking-[0.22em] sm:tall:block sm:tall:text-sm ${config.accentMutedClass}`}
            >
              {config.tagline}
            </span>

            <span className="explore-rail-label my-0.5 hidden h-[12.5rem] w-11 items-center justify-center overflow-visible sm:tall:flex sm:tall:h-[14.5rem] sm:tall:w-12">
              <span
                className={`font-display inline-block whitespace-nowrap text-xl uppercase tracking-[0.1em] sm:tall:text-2xl ${config.accentMutedClass} ${
                  isRight ? "-rotate-90" : "rotate-90"
                }`}
              >
                {config.label}
              </span>
            </span>

            <motion.span
              className={`font-display text-[1.625rem] leading-none sm:tall:mb-1 sm:tall:text-4xl ${config.accentMutedClass}`}
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
              className={`mt-1.5 h-1 w-6 sm:tall:mb-1 sm:tall:mt-0 sm:tall:w-11 ${config.accentClass}`}
              aria-hidden
            />
          </motion.button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
