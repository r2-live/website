"use client";

import { useRef } from "react";
import { BrandProvider, useBrand } from "@/components/brand/BrandProvider";
import { SweepTransition } from "@/components/brand/SweepTransition";
import { BrandNav } from "@/components/nav/BrandNav";
import { BandZone } from "@/components/sections/BandZone";
import { CoverArtistsSection } from "@/components/sections/CoverArtists";
import { ContactSection } from "@/components/sections/Contact";
import { EventsSection } from "@/components/sections/Events";
import { SiteFooter } from "@/components/sections/Footer";
import { VenuesSection } from "@/components/sections/Venues";
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
      <SweepTransition />
      <main>
        <BandZone content={content} />

        <section ref={sharedZoneRef}>
          <CoverArtistsSection artists={content.coverArtists} />
          <EventsSection events={content.events} />
          <VenuesSection venues={content.venues} />
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
