"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { BrandSlug, GalleryItem } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SWIPE_THRESHOLD = 48;
const THUMB_GAP_PX = 12;
const SLIDE_TRANSITION = { duration: 0.4, ease: [0.65, 0, 0.35, 1] as const };

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

function getSlideDirection(current: number, next: number, count: number) {
  if (next === current) return 0;
  const forward = (next - current + count) % count;
  const backward = (current - next + count) % count;
  return forward <= backward ? 1 : -1;
}

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

function GalleryThumbnailStrip({
  items,
  index,
  onSelect,
  accentTextClass,
  reducedMotion,
}: {
  items: GalleryItem[];
  index: number;
  onSelect: (itemIndex: number) => void;
  accentTextClass: string;
  reducedMotion: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [trackX, setTrackX] = useState(0);

  const [edgeInset, setEdgeInset] = useState(0);

  const updateTrackPosition = useCallback(() => {
    const container = containerRef.current;
    const thumb = thumbRefs.current[0];
    if (!container || !thumb) return;

    const containerWidth = container.clientWidth;
    const thumbWidth = thumb.offsetWidth;
    const inset = containerWidth / 2 - thumbWidth / 2;

    setEdgeInset(inset);
    setTrackX(-index * (thumbWidth + THUMB_GAP_PX));
  }, [index]);

  useLayoutEffect(() => {
    updateTrackPosition();
  }, [updateTrackPosition, items.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(updateTrackPosition);
    observer.observe(container);
    return () => observer.disconnect();
  }, [updateTrackPosition]);

  return (
    <div
      ref={containerRef}
      className="relative left-1/2 mt-6 w-screen -translate-x-1/2 overflow-hidden pb-1"
      role="tablist"
      aria-label="Galerie-Vorschau"
    >
      <motion.div
        ref={trackRef}
        className="flex w-max gap-3"
        style={{ paddingLeft: edgeInset, paddingRight: edgeInset }}
        animate={{ x: trackX }}
        transition={reducedMotion ? { duration: 0 } : SLIDE_TRANSITION}
      >
        {items.map((item, itemIndex) => {
          const isActive = itemIndex === index;
          return (
            <button
              key={item.slug}
              ref={(element) => {
                thumbRefs.current[itemIndex] = element;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={item.caption || `Bild ${itemIndex + 1}`}
              onClick={() => onSelect(itemIndex)}
              className={`retro-card relative h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-24 sm:w-32 ${
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
      </motion.div>
    </div>
  );
}

function GalleryCarouselSlide({
  item,
  bandName,
  direction,
  imageClassName,
  sizes,
  priority,
  reducedMotion,
}: {
  item: GalleryItem;
  bandName: string;
  direction: number;
  imageClassName: string;
  sizes: string;
  priority?: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={reducedMotion ? { duration: 0 } : SLIDE_TRANSITION}
      className="absolute inset-0"
    >
      <GalleryImage
        src={item.image}
        alt={item.caption || bandName}
        className={imageClassName}
        sizes={sizes}
        priority={priority}
      />
    </motion.div>
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
  const [direction, setDirection] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const accentClass = band === "katg" ? "bg-accent-katg" : "bg-accent-r2";
  const accentTextClass =
    band === "katg" ? "text-accent-katg" : "text-accent-r2";

  const itemCount = items.length;
  const activeItem = items[index];

  const goTo = useCallback(
    (nextIndex: number) => {
      if (itemCount === 0) return;
      const normalized = ((nextIndex % itemCount) + itemCount) % itemCount;
      if (normalized === index) return;
      setDirection(getSlideDirection(index, normalized, itemCount));
      setIndex(normalized);
    },
    [index, itemCount],
  );

  const goPrev = useCallback(() => {
    if (itemCount === 0) return;
    setDirection(-1);
    setIndex((current) => (current - 1 + itemCount) % itemCount);
  }, [itemCount]);

  const goNext = useCallback(() => {
    if (itemCount === 0) return;
    setDirection(1);
    setIndex((current) => (current + 1) % itemCount);
  }, [itemCount]);

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
                  className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden"
                  aria-label={`${activeItem.caption || "Galeriebild"} vergrößern`}
                >
                  <AnimatePresence initial={false} custom={direction} mode="sync">
                    <GalleryCarouselSlide
                      key={activeItem.slug}
                      item={activeItem}
                      bandName={bandName}
                      direction={direction}
                      imageClassName="retro-photo object-cover transition duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 56rem"
                      priority={index === 0}
                      reducedMotion={!!prefersReducedMotion}
                    />
                  </AnimatePresence>
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
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={activeItem.slug}
                    initial={{ opacity: 0, x: direction > 0 ? 12 : -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -12 : 12 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 0.25, ease: "easeOut" }
                    }
                    className="min-h-[3rem] flex-1 text-sm text-muted"
                  >
                    {activeItem.caption || "\u00A0"}
                  </motion.p>
                </AnimatePresence>
                <p
                  className={`shrink-0 text-xs font-medium uppercase tracking-wider ${accentTextClass}`}
                >
                  {index + 1} / {itemCount}
                </p>
              </div>
            </div>

          </div>
        </div>

        {itemCount > 1 ? (
          <GalleryThumbnailStrip
            items={items}
            index={index}
            onSelect={goTo}
            accentTextClass={accentTextClass}
            reducedMotion={!!prefersReducedMotion}
          />
        ) : null}
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
            <div className="relative aspect-[16/10] overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="sync">
                <GalleryCarouselSlide
                  key={activeItem.slug}
                  item={activeItem}
                  bandName={bandName}
                  direction={direction}
                  imageClassName="object-contain"
                  sizes="100vw"
                  reducedMotion={!!prefersReducedMotion}
                />
              </AnimatePresence>
            </div>

            {activeItem.caption ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeItem.slug}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { duration: 0.2, ease: "easeOut" }
                  }
                  className="px-4 pb-4 pt-2 text-center text-sm text-white/80"
                >
                  {activeItem.caption}
                </motion.p>
              </AnimatePresence>
            ) : null}

            {itemCount > 1 ? (
              <>
                <button
                  type="button"
                  className={`retro-btn absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full ${accentClass} px-3 py-2 text-xl leading-none text-white`}
                  onClick={goPrev}
                  aria-label="Vorheriges Bild"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={`retro-btn absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full ${accentClass} px-3 py-2 text-xl leading-none text-white`}
                  onClick={goNext}
                  aria-label="Nächstes Bild"
                >
                  ›
                </button>
              </>
            ) : null}

            <button
              type="button"
              className={`retro-btn absolute right-4 top-4 z-10 cursor-pointer rounded-md ${accentClass} px-3 py-1 text-sm text-white`}
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
