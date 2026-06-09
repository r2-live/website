"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BrandSlug, GalleryItem } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SWIPE_THRESHOLD = 48;

function GalleryImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const imageClassName = className ?? "object-cover";

  if (src.endsWith(".svg")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${imageClassName}`}
        loading="lazy"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={imageClassName}
      sizes={sizes}
      priority={priority}
    />
  );
}

export function GallerySection({
  band,
  bandName,
  items,
}: {
  band: BrandSlug;
  bandName: string;
  items: GalleryItem[];
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const accentClass = band === "katg" ? "bg-accent-katg" : "bg-accent-r2";
  const accentTextClass =
    band === "katg" ? "text-accent-katg" : "text-accent-r2";

  const itemCount = items.length;
  const activeItem = items[index];

  const goTo = useCallback(
    (nextIndex: number) => {
      if (itemCount === 0) return;
      setIndex(((nextIndex % itemCount) + itemCount) % itemCount);
    },
    [itemCount],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "Escape") setLightboxOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, goPrev, goNext]);

  if (itemCount === 0) return null;

  return (
    <>
      <div className="retro-section-band px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={bandName} title="Galerie" />

          <div className="mx-auto max-w-4xl">
            <div className="retro-card overflow-hidden rounded-md">
              <div
                className="relative touch-pan-y"
                onTouchStart={(event) =>
                  handleTouchStart(event.changedTouches[0]?.clientX ?? 0)
                }
                onTouchEnd={(event) =>
                  handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)
                }
              >
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="group relative block aspect-[16/10] w-full cursor-pointer"
                  aria-label={`${activeItem.caption || "Galeriebild"} vergrößern`}
                >
                  <GalleryImage
                    src={activeItem.image}
                    alt={activeItem.caption || bandName}
                    className="retro-photo object-cover transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 56rem"
                    priority={index === 0}
                  />
                </button>

                {itemCount > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className={`retro-btn absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full ${accentClass} px-3 py-2 text-lg leading-none text-white shadow-md`}
                      aria-label="Vorheriges Bild"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className={`retro-btn absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full ${accentClass} px-3 py-2 text-lg leading-none text-white shadow-md`}
                      aria-label="Nächstes Bild"
                    >
                      ›
                    </button>
                  </>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <p className="min-h-[3rem] flex-1 text-sm text-muted">
                  {activeItem.caption || "\u00A0"}
                </p>
                <p className={`shrink-0 text-xs font-medium uppercase tracking-wider ${accentTextClass}`}>
                  {index + 1} / {itemCount}
                </p>
              </div>
            </div>

            {itemCount > 1 ? (
              <div
                className="mt-4 flex gap-2 overflow-x-auto pb-1"
                role="tablist"
                aria-label="Galerie-Vorschau"
              >
                {items.map((item, itemIndex) => {
                  const isActive = itemIndex === index;
                  return (
                    <button
                      key={item.slug}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={item.caption || `Bild ${itemIndex + 1}`}
                      onClick={() => goTo(itemIndex)}
                      className={`retro-card relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition ${
                        isActive
                          ? `border-current ${accentTextClass}`
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <GalleryImage
                        src={item.image}
                        alt=""
                        className="object-cover"
                        sizes="6rem"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[60] flex cursor-pointer items-center justify-center bg-black/80 p-4 sm:p-6"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Galerie-Lightbox"
        >
          <div
            className="retro-card relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-md bg-surface-dark"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) =>
              handleTouchStart(event.changedTouches[0]?.clientX ?? 0)
            }
            onTouchEnd={(event) =>
              handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)
            }
          >
            <div className="relative aspect-[16/10]">
              <GalleryImage
                src={activeItem.image}
                alt={activeItem.caption || bandName}
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {activeItem.caption ? (
              <p className="px-4 pb-4 pt-2 text-center text-sm text-white/80">
                {activeItem.caption}
              </p>
            ) : null}

            {itemCount > 1 ? (
              <>
                <button
                  type="button"
                  className={`retro-btn absolute left-3 top-1/2 -translate-y-1/2 rounded-full ${accentClass} px-3 py-2 text-xl leading-none text-white`}
                  onClick={goPrev}
                  aria-label="Vorheriges Bild"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={`retro-btn absolute right-3 top-1/2 -translate-y-1/2 rounded-full ${accentClass} px-3 py-2 text-xl leading-none text-white`}
                  onClick={goNext}
                  aria-label="Nächstes Bild"
                >
                  ›
                </button>
              </>
            ) : null}

            <button
              type="button"
              className={`retro-btn absolute right-4 top-4 cursor-pointer rounded-md ${accentClass} px-3 py-1 text-sm text-white`}
              onClick={() => setLightboxOpen(false)}
            >
              Schließen
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
