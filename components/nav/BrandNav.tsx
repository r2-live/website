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
      className="fixed top-4 left-1/2 z-50 w-[min(92vw,720px)] -translate-x-1/2"
    >
      <div className="flex items-center justify-between gap-3 rounded-full border border-border bg-surface px-3 py-2 shadow-[0_20px_60px_rgba(28,25,23,0.12)] backdrop-blur-xl">
        <BrandButton
          brand="r2-live"
          activeBrand={activeBrand}
          onSelect={setActiveBrand}
          label="R2-Live"
        >
          <img
            src="/media/r2-live/logo.svg"
            alt="R2-Live"
            width={120}
            height={48}
            className={`h-10 w-auto object-contain ${
              activeBrand === "r2-live" ? "brightness-0 invert" : ""
            }`}
          />
        </BrandButton>

        <span className="hidden text-xs uppercase tracking-[0.24em] text-muted sm:block">
          Austropop
        </span>

        <BrandButton
          brand="katg"
          activeBrand={activeBrand}
          onSelect={setActiveBrand}
          label="KURT & THE GANG"
        >
          <div className="text-right leading-tight">
            <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
              KATG
            </span>
            <span className="block text-sm font-semibold sm:text-base">
              KURT & THE GANG
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
      className={`rounded-full px-3 py-2 transition-colors ${
        isActive
          ? brand === "r2-live"
            ? "bg-accent-r2 text-white"
            : "bg-accent-katg text-white"
          : "text-foreground hover:bg-black/5"
      }`}
    >
      {children}
    </button>
  );
}
