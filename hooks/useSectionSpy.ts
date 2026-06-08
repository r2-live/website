"use client";

import { useEffect } from "react";
import { useBrand } from "@/components/brand/BrandProvider";
import {
  BAND_SECTIONS,
  SHARED_SECTIONS,
  type BrandSlug,
} from "@/lib/types";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function useSectionSpy(sharedZoneRef: React.RefObject<HTMLElement | null>) {
  const { setNavVisible } = useBrand();

  useEffect(() => {
    const target = sharedZoneRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNavVisible(!entry.isIntersecting);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0.01 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [setNavVisible, sharedZoneRef]);
}

export function useKeyboardNavigation(
  activeBrand: BrandSlug,
  setActiveBrand: (brand: BrandSlug) => void,
  navVisible: boolean,
) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      if (navVisible && key === "r") {
        setActiveBrand("r2-live");
        return;
      }

      if (navVisible && key === "g") {
        setActiveBrand("katg");
        return;
      }

      const bandSection = BAND_SECTIONS.find((section) => section.key === key);
      if (bandSection) {
        scrollToSection(`${activeBrand}-${bandSection.id}`);
        return;
      }

      const sharedSection = SHARED_SECTIONS.find((section) => section.key === key);
      if (sharedSection) {
        scrollToSection(sharedSection.id);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeBrand, navVisible, setActiveBrand]);
}
