"use client";

import { BandPushTransition } from "@/components/brand/BandPushTransition";
import { AboutSection } from "@/components/sections/About";
import { GallerySection } from "@/components/sections/Gallery";
import { HeroSection } from "@/components/sections/Hero";
import { MembersSection } from "@/components/sections/Members";
import { SetlistSection } from "@/components/sections/Setlist";
import { SECTION_IDS, type BrandSlug, type SiteContent } from "@/lib/types";

export function BandZone({ content }: { content: SiteContent }) {
  return (
    <BandPushTransition
      r2Live={<BandStack band="r2-live" content={content} />}
      katg={<BandStack band="katg" content={content} />}
    />
  );
}

function BandStack({
  band,
  content,
}: {
  band: BrandSlug;
  content: SiteContent;
}) {
  const profile = content.bands[band];

  return (
    <>
      <section id={`${band}-${SECTION_IDS.hero}`} className="section-shell">
        <HeroSection band={band} profile={profile} />
      </section>
      <section id={`${band}-${SECTION_IDS.about}`} className="section-shell">
        <AboutSection band={band} profile={profile} />
      </section>
      <section id={`${band}-${SECTION_IDS.members}`} className="section-shell">
        <MembersSection band={band} profile={profile} />
      </section>
      <section id={`${band}-${SECTION_IDS.gallery}`} className="section-shell">
        <GallerySection
          band={band}
          bandName={profile.shortName}
          items={content.galleries[band]}
        />
      </section>
      <section id={`${band}-${SECTION_IDS.setlist}`} className="section-shell">
        <SetlistSection
          band={band}
          bandName={profile.shortName}
          tracks={content.setlists[band]}
        />
      </section>
    </>
  );
}
