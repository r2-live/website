"use client";

import { useEffect } from "react";
import { useBrand } from "@/components/brand/BrandProvider";
import {
  BAND_SECTIONS,
  SHARED_SECTIONS,
  type BrandSlug,
} from "@/lib/types";
import { isViewportZoomed } from "@/lib/viewport";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function isBannerQuarterHidden(brand: BrandSlug) {
  const hero = document.getElementById(`${brand}-hero`);
  if (!hero) return window.scrollY > 48;

  const { top, height } = hero.getBoundingClientRect();
  if (height <= 0) return false;

  const heroTop = window.scrollY + top;
  return window.scrollY >= heroTop + height / 4;
}

export function useSectionSpy(sharedZoneRef: React.RefObject<HTMLElement | null>) {
  const { activeBrand, setNavVisible, setBrandNavVisible } = useBrand();

  useEffect(() => {
    const target = sharedZoneRef.current;
    if (!target) return;

    let sharedZoneInView = false;
    let updateFrame = 0;

    const updateNav = () => {
      if (isViewportZoomed()) return;

      const bannerQuarterHidden = isBannerQuarterHidden(activeBrand);
      setNavVisible(!sharedZoneInView);
      setBrandNavVisible(!sharedZoneInView && bannerQuarterHidden);
    };

    const scheduleNavUpdate = () => {
      cancelAnimationFrame(updateFrame);
      updateFrame = requestAnimationFrame(updateNav);
    };

    const sharedObserver = new IntersectionObserver(
      ([entry]) => {
        sharedZoneInView = entry.isIntersecting;
        updateNav();
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0.01 },
    );

    sharedObserver.observe(target);
    updateNav();

    const onScrollOrResize = () => scheduleNavUpdate();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      cancelAnimationFrame(updateFrame);
      sharedObserver.disconnect();
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [activeBrand, setNavVisible, setBrandNavVisible, sharedZoneRef]);
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
