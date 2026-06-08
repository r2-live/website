import Image from "next/image";
import type { VenueItem } from "@/lib/types";
import { SECTION_IDS } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function VenuesSection({ venues }: { venues: VenueItem[] }) {
  return (
    <section id={SECTION_IDS.venues} className="section-shell px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Gemeinsam"
          title="Spielorte"
          description="Ein Auszug der Bühnen und Locations, auf denen wir bereits gespielt haben."
        />
        <div className="retro-card-grid">
          {venues.map((venue) => {
            const card = (
              <article className="retro-card w-full overflow-hidden rounded-sm transition">
                <div className="relative aspect-[2/1] bg-[#e8dcc4]">
                  {venue.image ? (
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="retro-photo object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted">
                      {venue.name}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl uppercase tracking-wide">
                    {venue.name}
                  </h3>
                </div>
              </article>
            );

            return venue.url ? (
              <a key={venue.slug} href={venue.url} target="_blank" rel="noreferrer">
                {card}
              </a>
            ) : (
              <div key={venue.slug}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
