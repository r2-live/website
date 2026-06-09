"use client";

import { useRef } from "react";
import { BandExploreRail } from "@/components/brand/BandExploreRail";
import { BrandProvider, useBrand } from "@/components/brand/BrandProvider";
import { SweepTransition } from "@/components/brand/SweepTransition";
import { BrandNav } from "@/components/nav/BrandNav";
import { SharedZoneBridge } from "@/components/sections/SharedZoneBridge";
import { BandZone } from "@/components/sections/BandZone";
import { CoverArtistsSection } from "@/components/sections/CoverArtists";
import { ContactSection } from "@/components/sections/Contact";
import { EventsSection } from "@/components/sections/Events";
import { SiteFooter } from "@/components/sections/Footer";
import { SectionSeparator } from "@/components/ui/SectionSeparator";
import {
  useKeyboardNavigation,
  useSectionSpy,
} from "@/hooks/useSectionSpy";
import type { SiteContent } from "@/lib/types";

function HomePageContent({ content }: { content: SiteContent }) {
  const sharedZoneRef = useRef<HTMLElement>(null);
  const { activeBrand, setActiveBrand, navVisible } = useBrand();

  useSectionSpy(sharedZoneRef);
  useKeyboardNavigation(activeBrand, setActiveBrand, navVisible);

  return (
    <>
      <BrandNav />
      <BandExploreRail />
      <SweepTransition />
      <main className="w-full max-w-full overflow-x-clip">
        <BandZone content={content} />

        <section ref={sharedZoneRef} id="gemeinsam" className="retro-section-shared">
          <div className="shared-zone-intro retro-divider--lead">
            <div className="retro-divider section-padding-x py-5 sm:py-6">
              Gemeinsam on stage
            </div>
            <SharedZoneBridge />
          </div>
          <CoverArtistsSection artists={content.coverArtists} />
          <SectionSeparator />
          <EventsSection events={content.events} />
          <SectionSeparator />
          <ContactSection contact={content.contact} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function HomePageClient({ content }: { content: SiteContent }) {
  return (
    <BrandProvider>
      <HomePageContent content={content} />
    </BrandProvider>
  );
}
