"use client";

import { motion } from "framer-motion";
import { useBrand } from "@/components/brand/BrandProvider";
import type { BrandSlug } from "@/lib/types";

export function BrandNav() {
  const { activeBrand, setActiveBrand, navVisible } = useBrand();

  return (
    <motion.nav
      aria-label="Band wechseln"
      initial={false}
      animate={{
        opacity: navVisible ? 1 : 0,
        y: navVisible ? 0 : -24,
        pointerEvents: navVisible ? "auto" : "none",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed top-4 left-1/2 z-50 w-[min(94vw,740px)] -translate-x-1/2"
    >
      <div className="retro-card flex items-center justify-between gap-2 rounded-sm px-3 py-2.5 sm:gap-4 sm:px-4 sm:py-3">
        <BrandButton
          brand="r2-live"
          activeBrand={activeBrand}
          onSelect={setActiveBrand}
          label="R2-Live"
        >
          <img
            src="/media/r2-live/logo.svg"
            alt="R2-Live"
            width={140}
            height={56}
            className={`h-11 w-auto object-contain sm:h-14 ${
              activeBrand === "r2-live" ? "brightness-0 invert" : ""
            }`}
          />
        </BrandButton>

        <span className="font-display hidden text-[0.65rem] uppercase tracking-[0.35em] text-accent-gold sm:block">
          ★ Austropop ★
        </span>

        <BrandButton
          brand="katg"
          activeBrand={activeBrand}
          onSelect={setActiveBrand}
          label="KURT & THE GANG"
        >
          <div className="text-right leading-tight">
            <span className="font-display block text-xs uppercase tracking-[0.2em] opacity-80">
              KATG
            </span>
            <span className="font-display block text-base uppercase tracking-wide sm:text-lg">
              Kurt & The Gang
            </span>
          </div>
        </BrandButton>
      </div>
    </motion.nav>
  );
}

function BrandButton({
  brand,
  activeBrand,
  onSelect,
  label,
  children,
}: {
  brand: BrandSlug;
  activeBrand: BrandSlug;
  onSelect: (brand: BrandSlug) => void;
  label: string;
  children: React.ReactNode;
}) {
  const isActive = activeBrand === brand;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      onClick={() => onSelect(brand)}
      className={`cursor-pointer rounded-sm px-2 py-2 transition sm:px-3 ${
        isActive
          ? brand === "r2-live"
            ? "bg-accent-r2 text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.15)]"
            : "bg-accent-katg text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.15)]"
          : "text-foreground hover:bg-black/5"
      }`}
    >
      {children}
    </button>
  );
}
