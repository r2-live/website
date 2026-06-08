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
    <div className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={profile.shortName} title="Die Band" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {profile.members.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-3xl border border-border bg-white/70 shadow-sm"
            >
              <div className="relative aspect-square bg-stone-100">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                ) : null}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm text-muted">{member.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
