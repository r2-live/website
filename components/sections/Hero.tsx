import Image from "next/image";
import type { BandProfile, BrandSlug } from "@/lib/types";

export function HeroSection({
  band,
  profile,
}: {
  band: BrandSlug;
  profile: BandProfile;
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="relative min-h-[72vh]">
        {profile.heroImage ? (
          <Image
            src={profile.heroImage}
            alt={profile.displayName}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28">
          <p className="mb-3 text-sm uppercase tracking-[0.28em] text-white/70">
            {profile.shortName}
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {profile.tagline}
          </h1>
          {profile.heroVideo ? (
            <video
              className="mt-8 max-w-xl rounded-2xl border border-white/20 shadow-2xl"
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
