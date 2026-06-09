import Image from "next/image";
import type { BandProfile, BrandSlug } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function MembersSection({
  band,
  profile,
}: {
  band: BrandSlug;
  profile: BandProfile;
}) {
  return (
    <div className="retro-section-band section-padding">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={profile.shortName} title="Die Band" />
        <div
          className={`members-grid members-grid--${band}`}
          data-sync-section="members"
        >
          {profile.members.map((member) => (
            <article
              key={member.name}
              className="retro-card w-full overflow-hidden rounded-md"
            >
              <div className="relative aspect-square bg-stone-100">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="retro-photo object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                ) : null}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-display text-base uppercase tracking-wide sm:text-lg">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs text-muted sm:text-sm">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
