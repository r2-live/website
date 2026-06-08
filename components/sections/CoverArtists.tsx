import { SECTION_IDS } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CoverArtistsSection({ artists }: { artists: string[] }) {
  return (
    <section id={SECTION_IDS.covers} className="section-shell px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Gemeinsam"
          title="Künstler & Covers"
          description="Wir spielen die Hits, die Österreich liebt — von Klassikern bis zu modernen Lieblingen."
        />
        <div className="flex flex-wrap justify-center gap-3">
          {artists.map((artist) => (
            <span
              key={artist}
              className="retro-badge rounded-md px-4 py-2 text-sm text-foreground"
            >
              {artist}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
