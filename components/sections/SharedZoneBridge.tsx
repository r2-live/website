"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export function SharedZoneBridge() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -20% 0px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div ref={ref} className="shared-zone-bridge px-6 pb-12 pt-14 sm:pt-16">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <img
            src="/media/r2-live/logo.svg"
            alt="R2-Live"
            className="h-9 w-auto object-contain sm:h-11"
          />

          <span
            className="font-display text-2xl leading-none text-accent-gold sm:text-3xl"
            aria-hidden
          >
            ♪
          </span>

          <span className="font-display text-base uppercase tracking-wide text-accent-katg sm:text-lg">
            Kurt &amp; The Gang
          </span>
        </div>

        <p className="font-display mt-8 text-3xl uppercase leading-none text-foreground sm:text-4xl">
          Ein Repertoire
        </p>
        <p className="font-display mt-2 text-lg uppercase tracking-[0.12em] text-accent-gold sm:text-xl">
          Gleiche Musik · Zwei Formate
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
          R2-Live als Duo und Kurt &amp; The Gang in voller Besetzung — dieselben
          Austropop-Klassiker, dieselbe Leidenschaft. Hier geht es um das, was
          beide verbindet.
        </p>
      </motion.div>
    </div>
  );
}
