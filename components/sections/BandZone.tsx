"use client";

import { useBrand } from "@/components/brand/BrandProvider";
import { SyncedBandSection } from "@/components/brand/SyncedBandSection";
import { AboutSection } from "@/components/sections/About";
import { GallerySection } from "@/components/sections/Gallery";
import { HeroSection } from "@/components/sections/Hero";
import { MembersSection } from "@/components/sections/Members";
import { SetlistSection } from "@/components/sections/Setlist";
import { SECTION_IDS } from "@/lib/types";
import type { SiteContent } from "@/lib/types";

export function BandZone({ content }: { content: SiteContent }) {
  const { activeBrand } = useBrand();

  return (
    <>
      <SyncedBandSection
        sectionId={SECTION_IDS.hero}
        activeBrand={activeBrand}
        r2Live={
          <HeroSection band="r2-live" profile={content.bands["r2-live"]} />
        }
        katg={<HeroSection band="katg" profile={content.bands.katg} />}
      />
      <SyncedBandSection
        sectionId={SECTION_IDS.about}
        activeBrand={activeBrand}
        r2Live={
          <AboutSection band="r2-live" profile={content.bands["r2-live"]} />
        }
        katg={<AboutSection band="katg" profile={content.bands.katg} />}
      />
      <SyncedBandSection
        sectionId={SECTION_IDS.members}
        activeBrand={activeBrand}
        r2Live={
          <MembersSection band="r2-live" profile={content.bands["r2-live"]} />
        }
        katg={<MembersSection band="katg" profile={content.bands.katg} />}
      />
      <SyncedBandSection
        sectionId={SECTION_IDS.gallery}
        activeBrand={activeBrand}
        r2Live={
          <GallerySection
            band="r2-live"
            bandName={content.bands["r2-live"].shortName}
            items={content.galleries["r2-live"]}
          />
        }
        katg={
          <GallerySection
            band="katg"
            bandName={content.bands.katg.shortName}
            items={content.galleries.katg}
          />
        }
      />
      <SyncedBandSection
        sectionId={SECTION_IDS.setlist}
        activeBrand={activeBrand}
        r2Live={
          <SetlistSection
            band="r2-live"
            bandName={content.bands["r2-live"].shortName}
            tracks={content.setlists["r2-live"]}
          />
        }
        katg={
          <SetlistSection
            band="katg"
            bandName={content.bands.katg.shortName}
            tracks={content.setlists.katg}
          />
        }
      />
    </>
  );
}
