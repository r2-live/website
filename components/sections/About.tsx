import type { BandProfile, BrandSlug } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutSection({
  profile,
}: {
  band: BrandSlug;
  profile: BandProfile;
}) {
  return (
    <div
      className="retro-section-band section-padding"
      data-sync-section="about"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={profile.shortName}
          title="Über uns"
          description={profile.description}
        />
      </div>
    </div>
  );
}
