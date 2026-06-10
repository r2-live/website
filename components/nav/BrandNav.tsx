"use client";

import { motion } from "framer-motion";
import { useBrand } from "@/components/brand/BrandProvider";
import { BRAND_META } from "@/lib/brand-meta";
import type { BrandSlug } from "@/lib/types";

export function BrandNav() {
  const { activeBrand, setActiveBrand, brandNavVisible } = useBrand();

  return (
    <motion.nav
      aria-label="Band wechseln"
      initial={false}
      animate={{
        opacity: brandNavVisible ? 1 : 0,
        y: brandNavVisible ? 0 : -24,
        pointerEvents: brandNavVisible ? "auto" : "none",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed top-3 left-1/2 z-50 w-[min(94vw,720px)] -translate-x-1/2"
    >
      <div className="w-full overflow-hidden rounded-xl border-2 border-border bg-surface p-1.5 shadow-[4px_4px_0_var(--retro-shadow)] sm:tall:p-2">
        <div
          className="grid w-full grid-cols-[auto_1fr_auto] items-stretch gap-1.5 sm:tall:gap-2"
          role="tablist"
          aria-label="Band auswählen"
        >
          <div className="flex justify-start">
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
              className={`h-11 w-auto object-contain sm:tall:h-14 ${
              activeBrand === "r2-live" ? "brightness-0 invert" : ""
            }`}
            />
          </BrandButton>
          </div>

          <div
            className="flex w-full min-w-0 items-center justify-center rounded-md bg-surface px-2 sm:tall:px-3"
            aria-hidden
          >
            <span className="font-display hidden text-[0.65rem] uppercase tracking-[0.22em] text-accent-gold xs:block xs:text-xs sm:tall:text-sm sm:tall:tracking-[0.28em]">
              ★ Austropop ★
            </span>
            <span className="font-display text-sm text-accent-gold xs:hidden">
              ◆
            </span>
          </div>

          <div className="flex justify-end">
          <BrandButton
            brand="katg"
            activeBrand={activeBrand}
            onSelect={setActiveBrand}
            label="Kurt & The Gang"
          >
            <div className="text-right leading-tight">
              <span className="font-display block max-w-[9.5rem] text-sm uppercase tracking-wide sm:tall:max-w-none sm:tall:text-base md:tall:text-lg">
                Kurt &amp; The Gang
              </span>
            </div>
          </BrandButton>
          </div>
        </div>
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
  const meta = BRAND_META[brand];

  return (
    <button
      type="button"
      role="tab"
      aria-label={isActive ? `${label} (aktiv)` : `Zu ${label} wechseln`}
      aria-selected={isActive}
      onClick={() => onSelect(brand)}
      className={`flex shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border-2 p-2.5 transition sm:tall:p-3 ${meta.accentBorder} ${
        isActive
          ? `${meta.accentBg} text-white ${meta.accentShadow}`
          : `${meta.bandBg} ${meta.accentText} ${meta.inactiveShadow} can-hover:hover:-translate-y-px can-hover:hover:shadow-[3px_3px_0_rgba(42,31,20,0.2)]`
      }`}
    >
      {children}
    </button>
  );
}
