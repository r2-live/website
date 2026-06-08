"use client";

import { motion } from "framer-motion";
import { useBrand } from "./BrandProvider";

export function SweepTransition() {
  const { isSweeping, activeBrand } = useBrand();
  const toKatg = activeBrand === "katg";

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
      initial={false}
      animate={
        isSweeping
          ? {
              opacity: [0, 1, 1, 0],
            }
          : { opacity: 0 }
      }
      transition={{ duration: 0.65, ease: "easeInOut" }}
    >
      <motion.div
        className={`absolute inset-y-0 w-full ${
          toKatg ? "right-0 origin-right" : "left-0 origin-left"
        }`}
        initial={false}
        animate={
          isSweeping
            ? {
                scaleX: [0, 1, 1, 1],
                x: toKatg
                  ? ["0%", "0%", "0%", "-100%"]
                  : ["0%", "0%", "0%", "100%"],
              }
            : { scaleX: 0, x: "0%" }
        }
        transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
        style={{
          background: toKatg
            ? "linear-gradient(270deg, rgba(194,65,12,0.95), rgba(251,146,60,0.35))"
            : "linear-gradient(90deg, rgba(51,65,85,0.95), rgba(148,163,184,0.35))",
        }}
      />
    </motion.div>
  );
}
