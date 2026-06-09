"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { BrandSlug, SetlistTrack } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollChaining } from "@/hooks/useScrollChaining";

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

function getTrackPreview(track: SetlistTrack) {
  if (!track.mediaUrl) return null;

  if (track.mediaType === "youtube") {
    const embed = getYoutubeEmbed(track.mediaUrl);
    return embed ? { type: "youtube" as const, embed } : null;
  }

  if (track.mediaType === "mp3") {
    return { type: "mp3" as const, url: track.mediaUrl };
  }

  if (track.mediaType === "video") {
    return { type: "video" as const, url: track.mediaUrl };
  }

  return null;
}

function getDefaultTrackSlug(tracks: SetlistTrack[]) {
  const withPreview = tracks.find((track) => getTrackPreview(track));
  return (withPreview ?? tracks[0])?.slug ?? null;
}

function TrackPreview({ track }: { track: SetlistTrack }) {
  const preview = getTrackPreview(track);

  if (preview?.type === "youtube") {
    return (
      <iframe
        title={`${track.title} Sample`}
        src={preview.embed}
        className="h-full w-full max-w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (preview?.type === "mp3") {
    return (
      <div className="flex h-full w-full items-center justify-center p-5">
        <audio controls className="w-full max-w-md">
          <source src={preview.url} type="audio/mpeg" />
        </audio>
      </div>
    );
  }

  if (preview?.type === "video") {
    return (
      <video controls className="h-full w-full object-contain">
        <source src={preview.url} />
      </video>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-5">
      <div className="flex h-full w-full items-center justify-center rounded-sm border border-dashed border-[var(--brand-border)] px-6 text-center text-sm text-muted">
        Für diesen Titel ist keine Hörprobe hinterlegt.
      </div>
    </div>
  );
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
  const defaultSlug = useMemo(() => getDefaultTrackSlug(tracks), [tracks]);
  const [selectedSlug, setSelectedSlug] = useState(defaultSlug);
  const previewRef = useRef<HTMLDivElement>(null);
  const tracksRef = useRef<HTMLUListElement>(null);
  const [listHeight, setListHeight] = useState<number | null>(null);

  useScrollChaining(tracksRef);

  const selectedTrack =
    tracks.find((track) => track.slug === selectedSlug) ?? tracks[0] ?? null;

  const hasAnyPreview = tracks.some((track) => getTrackPreview(track));

  useLayoutEffect(() => {
    if (!hasAnyPreview) return;

    const preview = previewRef.current;
    if (!preview) return;

    const syncHeight = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setListHeight(preview.offsetHeight);
      } else {
        setListHeight(null);
      }
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(preview);
    window.addEventListener("resize", syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeight);
    };
  }, [hasAnyPreview, selectedTrack?.slug]);

  return (
    <div className="retro-section-band section-padding min-w-0 max-w-full overflow-x-clip">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <SectionHeading eyebrow={bandName} title="Hörproben" />
        <div
          className={
            hasAnyPreview
              ? "grid min-w-0 gap-6 sm:gap-7 lg:grid-cols-[0.9fr_1.35fr] lg:items-start lg:gap-8"
              : "max-w-2xl"
          }
        >
          <div
            className="setlist-panel retro-card flex min-h-0 min-w-0 flex-col rounded-md max-lg:overflow-visible lg:overflow-hidden"
            style={listHeight ? { height: listHeight } : undefined}
          >
            <ul
              ref={tracksRef}
              className="setlist-panel__tracks min-h-0 flex-1 max-lg:overflow-visible lg:overflow-y-auto lg:overscroll-y-none"
            >
              {tracks.map((track, index) => {
                const isSelected = track.slug === selectedTrack?.slug;
                const hasPreview = Boolean(getTrackPreview(track));

                return (
                  <li
                    key={track.slug}
                    className="border-b border-[var(--brand-border)] last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedSlug(track.slug)}
                      aria-current={isSelected ? "true" : undefined}
                      className={`group flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors sm:gap-3 sm:py-3 md:gap-3.5 md:px-4 md:py-3.5 lg:gap-4 lg:py-4 ${
                        isSelected
                          ? "border-l-4 border-l-[var(--brand-accent)] bg-[var(--brand-tint)]"
                          : "border-l-4 border-l-transparent can-hover:hover:bg-[var(--brand-tint-section)]"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border font-display text-xs tabular-nums transition-colors sm:h-9 sm:w-9 lg:h-10 lg:w-10 ${
                          isSelected
                            ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-white"
                            : "border-[var(--brand-border)] bg-surface text-muted can-hover:group-hover:border-[var(--brand-accent)] can-hover:group-hover:text-[var(--brand-accent)]"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate font-display text-base uppercase leading-tight tracking-wide sm:text-lg lg:text-xl ${
                            isSelected ? "text-foreground" : "text-foreground/90"
                          }`}
                        >
                          {track.title}
                        </span>
                        <span className="mt-px block truncate text-xs leading-snug text-muted sm:mt-0.5 sm:text-sm lg:text-base">
                          {track.originalArtist}
                        </span>
                      </span>
                      {hasPreview ? (
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[0.65rem] transition-colors sm:h-9 sm:w-9 sm:text-xs lg:h-10 lg:w-10 ${
                            isSelected
                              ? "border-[var(--brand-accent)] bg-[var(--brand-accent)] text-white"
                              : "border-[var(--brand-border)] bg-surface text-muted can-hover:group-hover:border-[var(--brand-accent)] can-hover:group-hover:text-[var(--brand-accent)]"
                          }`}
                          aria-hidden
                        >
                          ▶
                        </span>
                      ) : (
                        <span className="h-8 w-8 shrink-0 sm:h-9 sm:w-9 lg:h-10 lg:w-10" aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {hasAnyPreview && selectedTrack ? (
            <div
              ref={previewRef}
              className="retro-card aspect-video w-full min-w-0 max-w-full overflow-hidden rounded-md lg:sticky lg:top-24"
            >
              <TrackPreview track={selectedTrack} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
