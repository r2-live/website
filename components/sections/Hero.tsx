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

type HeroBannerMetrics = {
  height: number;
  layout: HeroClipLayout;
};

function resolveBannerMetrics(width: number): HeroBannerMetrics {
  const baseH =
    typeof window !== "undefined"
      ? window.innerHeight * (HERO_BASE_HEIGHT_VH / 100)
      : 720;
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
  const [metrics, setMetrics] = useState<HeroBannerMetrics>(() =>
    resolveBannerMetrics(1280),
  );
  const overlayClass =
    band === "katg" ? "retro-hero-overlay-katg" : "retro-hero-overlay-r2";

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const update = () => {
      const width = banner.getBoundingClientRect().width;
      setMetrics(resolveBannerMetrics(width));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(banner);
    window.addEventListener("resize", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
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
          <h1 className="font-display max-w-3xl text-5xl uppercase leading-[0.95] text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.35)] sm:text-7xl">
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
