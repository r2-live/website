import type { BrandSlug, SetlistTrack } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

function getYoutubeEmbed(url: string) {
  try {
    const parsed = new URL(url);
    const id =
      parsed.searchParams.get("v") ||
      parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export function SetlistSection({
  band,
  bandName,
  tracks,
}: {
  band: BrandSlug;
  bandName: string;
  tracks: SetlistTrack[];
}) {
  return (
    <div className="retro-section-band px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow={bandName}
          title="Repertoire"
          description="Ein Auszug aus unserem Set — weitere Titel auf Anfrage."
        />
        <div className="space-y-4">
          {tracks.map((track) => {
            const embed =
              track.mediaType === "youtube" && track.mediaUrl
                ? getYoutubeEmbed(track.mediaUrl)
                : null;

            return (
              <article
                key={track.slug}
                className="retro-card rounded-sm p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wide">
                      {track.title}
                    </h3>
                    <p className="text-sm text-muted">{track.originalArtist}</p>
                  </div>
                  {track.mediaType === "mp3" && track.mediaUrl ? (
                    <audio controls className="w-full max-w-sm">
                      <source src={track.mediaUrl} type="audio/mpeg" />
                    </audio>
                  ) : null}
                  {track.mediaType === "video" && track.mediaUrl ? (
                    <video controls className="retro-card w-full max-w-sm rounded-sm">
                      <source src={track.mediaUrl} />
                    </video>
                  ) : null}
                </div>
                {embed ? (
                  <div className="retro-card mt-4 overflow-hidden rounded-sm">
                    <iframe
                      title={`${track.title} Sample`}
                      src={embed}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
