"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
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

function getThumbnailMetrics({
  containerWidth,
  thumbWidth,
  itemCount,
  activeIndex,
  edgeInsetLeft,
  edgeInsetRight,
}: {
  containerWidth: number;
  thumbWidth: number;
  itemCount: number;
  activeIndex: number;
  edgeInsetLeft: number;
  edgeInsetRight: number;
}) {
  const totalWidth =
    itemCount * thumbWidth + Math.max(0, itemCount - 1) * THUMB_GAP_PX;
  const availableWidth = containerWidth - edgeInsetLeft - edgeInsetRight;
  const minX = containerWidth - totalWidth - edgeInsetRight;
  const maxX = edgeInsetLeft;

  if (totalWidth <= availableWidth) {
    return {
      totalWidth,
      trackX: edgeInsetLeft + (availableWidth - totalWidth) / 2,
      minX,
      maxX,
    };
  }

  const activeCenter =
    activeIndex * (thumbWidth + THUMB_GAP_PX) + thumbWidth / 2;
  const idealX = containerWidth / 2 - activeCenter;

  return {
    totalWidth,
    trackX: Math.max(minX, Math.min(maxX, idealX)),
    minX,
    maxX,
  };
}

function clampTrackX(value: number, minX: number, maxX: number) {
  return Math.max(minX, Math.min(maxX, value));
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
  alignmentRef,
}: {
  items: GalleryItem[];
  index: number;
  onSelect: (itemIndex: number) => void;
  accentTextClass: string;
  reducedMotion: boolean;
  alignmentRef: RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollBoundsRef = useRef({ minX: 0, maxX: 0 });
  const dragStateRef = useRef({
    startX: 0,
    startTrackX: 0,
    didDrag: false,
    pointerId: -1,
  });
  const [trackX, setTrackX] = useState(0);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const updateTrackPosition = useCallback(() => {
    const container = containerRef.current;
    const alignment = alignmentRef.current;
    const thumb = thumbRefs.current[0];
    if (!container || !alignment || !thumb) return;

    const containerRect = container.getBoundingClientRect();
    const alignmentRect = alignment.getBoundingClientRect();
    const metrics = getThumbnailMetrics({
      containerWidth: containerRect.width,
      thumbWidth: thumb.offsetWidth,
      itemCount: items.length,
      activeIndex: index,
      edgeInsetLeft: alignmentRect.left - containerRect.left,
      edgeInsetRight: containerRect.right - alignmentRect.right,
    });

    scrollBoundsRef.current = {
      minX: metrics.minX,
      maxX: metrics.maxX,
    };

    if (!isManualScroll) {
      setTrackX(metrics.trackX);
    }
  }, [alignmentRef, index, isManualScroll, items.length]);

  useLayoutEffect(() => {
    setIsManualScroll(false);
  }, [index]);

  useLayoutEffect(() => {
    updateTrackPosition();
  }, [updateTrackPosition, items.length, isManualScroll]);

  useEffect(() => {
    const container = containerRef.current;
    const alignment = alignmentRef.current;
    if (!container) return;

    const observer = new ResizeObserver(updateTrackPosition);
    observer.observe(container);
    if (alignment) observer.observe(alignment);

    window.addEventListener("resize", updateTrackPosition);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTrackPosition);
    };
  }, [alignmentRef, updateTrackPosition]);

  const handleStripPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    dragStateRef.current = {
      startX: event.clientX,
      startTrackX: trackX,
      didDrag: false,
      pointerId: event.pointerId,
    };
  };

  const handleStripPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== dragStateRef.current.pointerId) return;

    const delta = event.clientX - dragStateRef.current.startX;
    if (Math.abs(delta) < 4) return;

    if (!dragStateRef.current.didDrag) {
      dragStateRef.current.didDrag = true;
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
    setIsManualScroll(true);
    setTrackX(
      clampTrackX(
        dragStateRef.current.startTrackX + delta,
        scrollBoundsRef.current.minX,
        scrollBoundsRef.current.maxX,
      ),
    );
  };

  const handleStripPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== dragStateRef.current.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);
    dragStateRef.current.pointerId = -1;

    if (dragStateRef.current.didDrag) {
      window.setTimeout(() => {
        dragStateRef.current.didDrag = false;
      }, 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative left-1/2 mt-6 w-screen -translate-x-1/2 overflow-hidden pb-1"
      role="tablist"
      aria-label="Galerie-Vorschau"
    >
      <motion.div
        ref={trackRef}
        className={`flex w-max gap-3 ${isDragging ? "cursor-grabbing" : ""}`}
        animate={{ x: trackX }}
        transition={
          isDragging || reducedMotion ? { duration: 0 } : SLIDE_TRANSITION
        }
        onPointerDown={handleStripPointerDown}
        onPointerMove={handleStripPointerMove}
        onPointerUp={handleStripPointerUp}
        onPointerCancel={handleStripPointerUp}
      >
        {items.map((item, itemIndex) => {
          const isActive = itemIndex === index;
          return (
            <button
              key={item.slug}
              data-gallery-thumb=""
              ref={(element) => {
                thumbRefs.current[itemIndex] = element;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={item.caption || `Bild ${itemIndex + 1}`}
              onClick={() => {
                if (dragStateRef.current.didDrag) return;
                onSelect(itemIndex);
              }}
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const suppressImageClickRef = useRef(false);
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
    suppressImageClickRef.current = true;
    if (delta < 0) goNext();
    else goPrev();
  };

  const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (itemCount <= 1) return;
    if (window.matchMedia("(min-width: 640px)").matches) return;
    if (suppressImageClickRef.current) {
      suppressImageClickRef.current = false;
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    if (clickX < rect.width / 2) goPrev();
    else goNext();
  };

  const navBadgeClass = `retro-btn inline-flex items-center justify-center rounded-full px-3 py-2 text-lg leading-none text-white shadow-md transition duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg group-active:scale-95 ${accentClass}`;

  if (itemCount === 0) return null;

  return (
    <>
      <div className="retro-section-band px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={bandName} title="Galerie" />

          <div className="mx-auto max-w-4xl">
            <div
              ref={carouselRef}
              className="retro-card overflow-hidden rounded-md"
            >
              <div
                className="relative touch-pan-y"
                onTouchStart={(event) =>
                  handleTouchStart(event.changedTouches[0]?.clientX ?? 0)
                }
                onTouchEnd={(event) =>
                  handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)
                }
              >
                <div
                  className="relative aspect-[16/10] w-full overflow-hidden [@media(pointer:fine)]:cursor-pointer sm:[@media(pointer:fine)]:cursor-default"
                  onClick={handleImageClick}
                  role="presentation"
                >
                  <AnimatePresence initial={false} custom={direction} mode="sync">
                    <GalleryCarouselSlide
                      key={activeItem.slug}
                      item={activeItem}
                      bandName={bandName}
                      direction={direction}
                      imageClassName="retro-photo object-cover"
                      sizes="(max-width: 768px) 100vw, 56rem"
                      priority={index === 0}
                      reducedMotion={!!prefersReducedMotion}
                    />
                  </AnimatePresence>

                  {itemCount > 1 ? (
                    <>
                      <button
                        type="button"
                        aria-label="Vorheriges Bild"
                        className="group absolute inset-y-0 left-0 z-[5] hidden w-1/2 sm:flex sm:items-center sm:justify-start sm:pl-3"
                        onClick={(event) => {
                          event.stopPropagation();
                          goPrev();
                        }}
                      >
                        <span className={navBadgeClass} aria-hidden>
                          ‹
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label="Nächstes Bild"
                        className="group absolute inset-y-0 right-0 z-[5] hidden w-1/2 sm:flex sm:items-center sm:justify-end sm:pr-3"
                        onClick={(event) => {
                          event.stopPropagation();
                          goNext();
                        }}
                      >
                        <span className={navBadgeClass} aria-hidden>
                          ›
                        </span>
                      </button>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="px-4 py-3">
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
                    className="min-h-[3rem] text-sm text-muted"
                  >
                    {activeItem.caption || "\u00A0"}
                  </motion.p>
                </AnimatePresence>
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
            alignmentRef={carouselRef}
          />
        ) : null}
      </div>

    </>
  );
}
