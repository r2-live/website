"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  computeHeroBannerHeight,
  computeHeroClipLayout,
  HERO_BASE_HEIGHT_VH,
  type HeroClipLayout,
} from "@/lib/hero-clip-layout";
import type { BandProfile, BrandSlug } from "@/lib/types";
import { isViewportZoomed } from "@/lib/viewport";

type HeroBannerMetrics = {
  height: number;
  layout: HeroClipLayout;
};

function resolveBannerMetrics(
  width: number,
  baseH: number,
): HeroBannerMetrics {
  const height = computeHeroBannerHeight(width, baseH);
  return {
    height,
    layout: computeHeroClipLayout(width, height),
  };
}

function HeroClipLayer({
  src,
  alt,
  layout,
}: {
  src: string;
  alt: string;
  layout: HeroClipLayout;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex justify-center overflow-hidden">
      <div
        className="hero-clip-viewport hero-clip-viewport--fade-full relative h-full overflow-hidden"
        style={{
          width: layout.useFullWidth ? "100%" : layout.viewportWidth,
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: layout.imageTop,
            width: layout.imageWidth,
            height: layout.imageHeight,
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            className="retro-photo object-cover"
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
}

function HeroImageLayers({
  src,
  alt,
  layout,
}: {
  src: string;
  alt: string;
  layout: HeroClipLayout;
}) {
  return (
    <div className="absolute inset-0">
      <div className="hero-blur-fill absolute inset-0" aria-hidden>
        <Image
          src={src}
          alt=""
          fill
          priority
          className="hero-blur-fill__image object-cover"
          style={{ objectPosition: "top" }}
          sizes="100vw"
        />
      </div>
      <HeroClipLayer src={src} alt={alt} layout={layout} />
    </div>
  );
}

export function HeroSection({
  band,
  profile,
}: {
  band: BrandSlug;
  profile: BandProfile;
}) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const landscapeHeightRef = useRef<number | null>(null);
  const [metrics, setMetrics] = useState<HeroBannerMetrics>(() =>
    resolveBannerMetrics(1280, 720),
  );
  const overlayClass =
    band === "katg" ? "retro-hero-overlay-katg" : "retro-hero-overlay-r2";

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const update = () => {
      if (isViewportZoomed()) return;

      const width = banner.clientWidth;
      const isLandscapePhone =
        window.matchMedia("(orientation: landscape)").matches &&
        window.innerHeight <= 500 &&
        window.innerWidth <= 1000;
      if (isLandscapePhone) {
        landscapeHeightRef.current ??= window.innerHeight;
      } else {
        landscapeHeightRef.current = null;
      }
      const baseH =
        landscapeHeightRef.current !== null
          ? landscapeHeightRef.current * 1.2
          : window.innerHeight * (HERO_BASE_HEIGHT_VH / 100);
      const nextMetrics = resolveBannerMetrics(width, baseH);
      setMetrics((current) => {
        const layoutUnchanged =
          current.layout.mode === nextMetrics.layout.mode &&
          current.layout.viewportWidth === nextMetrics.layout.viewportWidth &&
          current.layout.useFullWidth === nextMetrics.layout.useFullWidth &&
          current.layout.imageWidth === nextMetrics.layout.imageWidth &&
          current.layout.imageHeight === nextMetrics.layout.imageHeight &&
          current.layout.imageTop === nextMetrics.layout.imageTop;
        return current.height === nextMetrics.height && layoutUnchanged
          ? current
          : nextMetrics;
      });
    };

    update();
    const handleOrientationChange = () => {
      landscapeHeightRef.current = null;
      requestAnimationFrame(update);
    };
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div
        ref={bannerRef}
        className="relative bg-[#2a1f14]"
        style={{ height: metrics.height }}
      >
        {profile.heroImage ? (
          <HeroImageLayers
            src={profile.heroImage}
            alt={profile.displayName}
            layout={metrics.layout}
          />
        ) : null}
        <div className={`absolute inset-0 ${overlayClass}`} />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
          }}
        />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end section-padding-x pb-16 pt-28">
          <p className="font-display mb-3 text-sm uppercase tracking-[0.35em] text-accent-gold">
            ★ {profile.shortName} ★
          </p>
          <h1 className="hero-title font-display max-w-3xl text-5xl uppercase leading-[0.95] text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.35)] sm:text-7xl">
            {profile.tagline}
          </h1>
          {profile.heroVideo ? (
            <video
              className="retro-card mt-8 max-w-xl rounded-md"
              controls
              playsInline
              poster={profile.heroImage}
            >
              <source src={profile.heroVideo} />
            </video>
          ) : null}
        </div>
      </div>
    </div>
  );
}
