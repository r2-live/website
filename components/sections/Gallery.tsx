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
const MOBILE_GALLERY_MQ = "(max-width: 768px)";
const SLIDE_TRANSITION = { duration: 0.4, ease: [0.65, 0, 0.35, 1] as const };
const STRIP_SCROLL_MS = SLIDE_TRANSITION.duration * 1000;

const activeStripScrolls = new WeakMap<HTMLDivElement, number>();

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

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

function readSectionPaddingX() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--section-padding-x")
    .trim();
  if (raw.endsWith("rem")) {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    return parseFloat(raw) * rootFontSize;
  }
  if (raw.endsWith("px")) {
    return parseFloat(raw);
  }
  return 24;
}

type StripLayout = {
  width: number;
  marginLeft: number;
  paddingLeft: number;
  paddingRight: number;
};

function getThumbnailStripLayout(
  stripRect: DOMRect,
  alignmentRect: DOMRect,
): StripLayout {
  const viewportWidth = document.documentElement.clientWidth;
  const sectionPadding = readSectionPaddingX();
  const isMobile = window.matchMedia(MOBILE_GALLERY_MQ).matches;

  if (isMobile) {
    return {
      width: viewportWidth,
      marginLeft: Math.round(-stripRect.left),
      paddingLeft: Math.round(Math.max(0, alignmentRect.left)),
      paddingRight: Math.round(
        Math.max(0, viewportWidth - alignmentRect.right),
      ),
    };
  }

  return {
    width: viewportWidth,
    marginLeft: Math.round(-stripRect.left),
    paddingLeft: sectionPadding,
    paddingRight: sectionPadding,
  };
}

function stripLayoutChanged(previous: StripLayout, next: StripLayout) {
  return (
    Math.round(previous.width) !== Math.round(next.width) ||
    Math.round(previous.marginLeft) !== Math.round(next.marginLeft) ||
    Math.round(previous.paddingLeft) !== Math.round(next.paddingLeft) ||
    Math.round(previous.paddingRight) !== Math.round(next.paddingRight)
  );
}

function applyStripLayout(
  outer: HTMLDivElement,
  container: HTMLDivElement,
  layout: StripLayout,
) {
  outer.style.width = `${layout.width}px`;
  outer.style.marginLeft = `${layout.marginLeft}px`;
  container.style.paddingLeft = `${layout.paddingLeft}px`;
  container.style.paddingRight = `${layout.paddingRight}px`;
}

function scrollStripTo(
  container: HTMLDivElement,
  scrollLeft: number,
  behavior: ScrollBehavior,
  onDone?: () => void,
) {
  const existing = activeStripScrolls.get(container);
  if (existing !== undefined) {
    cancelAnimationFrame(existing);
    activeStripScrolls.delete(container);
  }

  const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
  const target = Math.max(0, Math.min(scrollLeft, maxScrollLeft));

  if (behavior === "auto" || Math.abs(container.scrollLeft - target) < 1) {
    container.scrollLeft = target;
    onDone?.();
    return;
  }

  const start = container.scrollLeft;
  const delta = target - start;
  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / STRIP_SCROLL_MS);
    container.scrollLeft = start + delta * easeOutCubic(progress);

    if (progress < 1) {
      activeStripScrolls.set(container, requestAnimationFrame(step));
      return;
    }

    activeStripScrolls.delete(container);
    onDone?.();
  };

  activeStripScrolls.set(container, requestAnimationFrame(step));
}

function GalleryImage({
  src,
  alt,
  className,
  sizes,
  priority,
  draggable = true,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  draggable?: boolean;
}) {
  const imageClassName = className ?? "object-cover";

  if (src.endsWith(".svg")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        draggable={draggable}
        className={`absolute inset-0 h-full w-full ${imageClassName} ${
          draggable ? "" : "pointer-events-none select-none"
        }`}
        loading="lazy"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      draggable={draggable}
      className={`${imageClassName}${draggable ? "" : " pointer-events-none select-none"}`}
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
  alignmentRef: RefObject<HTMLDivElement | null>;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const ignoreScrollRef = useRef(false);
  const isManualScrollRef = useRef(false);
  const hasCenteredRef = useRef(false);
  const stripLayoutRef = useRef<StripLayout>({
    width: 0,
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  const [isManualScroll, setIsManualScroll] = useState(false);

  isManualScrollRef.current = isManualScroll;

  const centerActiveThumb = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current;
      const thumb = thumbRefs.current[index];
      if (!container || !thumb) return;

      const containerRect = container.getBoundingClientRect();
      const thumbRect = thumb.getBoundingClientRect();
      const scrollLeft =
        container.scrollLeft +
        (thumbRect.left - containerRect.left) -
        (containerRect.width - thumbRect.width) / 2;

      ignoreScrollRef.current = true;
      scrollStripTo(
        container,
        scrollLeft,
        reducedMotion ? "auto" : behavior,
        () => {
          ignoreScrollRef.current = false;
        },
      );
    },
    [index, reducedMotion],
  );

  const updateStripLayout = useCallback(() => {
    const outer = outerRef.current;
    const container = containerRef.current;
    const alignment = alignmentRef.current;
    const thumb = thumbRefs.current[0];
    if (!outer || !container || !alignment || !thumb) return;

    const stripRect = outer.getBoundingClientRect();
    const alignmentRect = alignment.getBoundingClientRect();
    const nextStripLayout = getThumbnailStripLayout(stripRect, alignmentRect);

    if (stripLayoutChanged(stripLayoutRef.current, nextStripLayout)) {
      stripLayoutRef.current = nextStripLayout;
      applyStripLayout(outer, container, nextStripLayout);
    }
  }, [alignmentRef]);

  useLayoutEffect(() => {
    setIsManualScroll(false);
    isManualScrollRef.current = false;
    centerActiveThumb(
      !hasCenteredRef.current || reducedMotion ? "auto" : "smooth",
    );
    hasCenteredRef.current = true;
  }, [index, centerActiveThumb, reducedMotion]);

  useLayoutEffect(() => {
    updateStripLayout();
  }, [updateStripLayout, items.length]);

  useEffect(() => {
    const alignment = alignmentRef.current;
    if (!alignment) return;

    const mobileQuery = window.matchMedia(MOBILE_GALLERY_MQ);
    const observer = new ResizeObserver(updateStripLayout);
    observer.observe(alignment);

    const handleLayoutChange = () => {
      updateStripLayout();
      if (!isManualScrollRef.current) {
        centerActiveThumb("auto");
      }
    };
    window.addEventListener("resize", handleLayoutChange);
    mobileQuery.addEventListener("change", handleLayoutChange);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleLayoutChange);
      mobileQuery.removeEventListener("change", handleLayoutChange);
    };
  }, [alignmentRef, centerActiveThumb, updateStripLayout]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (ignoreScrollRef.current) return;
      setIsManualScroll(true);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={outerRef} className="relative mt-6 shrink-0">
      <div
        ref={containerRef}
        className="gallery-thumbnail-strip overflow-x-auto overflow-y-hidden overscroll-x-auto pb-1"
        role="tablist"
        aria-label="Galerie-Vorschau"
      >
        <div className="flex w-max gap-3">
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
                onClick={() => onSelect(itemIndex)}
                className={`retro-card relative h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 transition-[border-color,box-shadow,opacity] sm:h-24 sm:w-32 ${
                  isActive
                    ? `border-current ${accentTextClass}`
                    : "border-transparent opacity-70 can-hover:hover:opacity-100"
                }`}
              >
                <GalleryImage
                  src={item.image}
                  alt=""
                  className="object-cover"
                  sizes="6rem"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      </div>
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
  const galleryCardRef = useRef<HTMLDivElement>(null);
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

  const navBadgeClass = `retro-btn inline-flex items-center justify-center rounded-full px-3 py-2 text-lg leading-none text-white shadow-md transition duration-200 ease-out can-hover:group-hover:scale-110 can-hover:group-hover:shadow-lg group-active:scale-95 ${accentClass}`;

  if (itemCount === 0) return null;

  return (
    <>
      <div className="retro-section-band">
        <div
          className={
            itemCount > 1
              ? "section-padding-x pt-[var(--section-padding-y)]"
              : "section-padding"
          }
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow={bandName} title="Galerie" />

            <div className="mx-auto max-w-4xl">
              <div
                ref={galleryCardRef}
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
        </div>

        {itemCount > 1 ? (
          <div className="pb-[var(--section-padding-y)]">
            <GalleryThumbnailStrip
              items={items}
              index={index}
              onSelect={goTo}
              accentTextClass={accentTextClass}
              reducedMotion={!!prefersReducedMotion}
              alignmentRef={galleryCardRef}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
