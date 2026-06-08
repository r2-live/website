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
  const targetMeta = BRAND_META[config.target];
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
            style={{ y: "-50%" }}
            className={`explore-rail-tab pointer-events-auto absolute top-1/2 z-10 flex flex-col items-center border-2 ${targetMeta.accentBorder} ${targetMeta.bandBg} ${targetMeta.inactiveShadow} hover:shadow-[3px_3px_0_rgba(42,31,20,0.2)] ${
              isRight
                ? "right-0 origin-right rounded-l-md rounded-r-none border-r-0 py-0.5 pl-2 pr-1 sm:pl-2.5 sm:pr-1.5"
                : "left-0 origin-left rounded-r-md rounded-l-none border-l-0 py-0.5 pr-2 pl-1 sm:pr-2.5 sm:pl-1.5"
            }`}
            whileHover={
              prefersReducedMotion ? undefined : { scale: 1.04, y: "-50%" }
            }
            whileTap={
              prefersReducedMotion ? undefined : { scale: 0.98, y: "-50%" }
            }
          >
            <span
              className={`font-display mt-1 text-xs uppercase tracking-[0.22em] sm:text-sm ${config.accentMutedClass}`}
            >
              {config.tagline}
            </span>

            <span className="explore-rail-label my-0.5 flex h-[12.5rem] w-10 items-center justify-center overflow-visible sm:h-[14.5rem] sm:w-11">
              <span
                className={`font-display inline-block whitespace-nowrap text-xl uppercase tracking-[0.1em] sm:text-2xl ${config.accentMutedClass} ${
                  isRight ? "-rotate-90" : "rotate-90"
                }`}
              >
                {config.label}
              </span>
            </span>

            <motion.span
              className={`font-display mb-1 text-2xl leading-none sm:text-3xl ${config.accentMutedClass}`}
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
              className={`mb-1 h-1 w-8 ${config.accentClass} sm:w-10`}
              aria-hidden
            />
          </motion.button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
