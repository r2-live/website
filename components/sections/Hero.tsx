import Image from "next/image";
import type { BandProfile, BrandSlug } from "@/lib/types";

export function HeroSection({
  band,
  profile,
}: {
  band: BrandSlug;
  profile: BandProfile;
}) {
  const overlayClass =
    band === "katg" ? "retro-hero-overlay-katg" : "retro-hero-overlay-r2";

  return (
    <div className="relative overflow-hidden">
      <div className="relative min-h-[72vh]">
        {profile.heroImage ? (
          <Image
            src={profile.heroImage}
            alt={profile.displayName}
            fill
            priority
            className="retro-photo object-cover"
            sizes="100vw"
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
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28">
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
