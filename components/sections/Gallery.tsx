"use client";

import Image from "next/image";
import { useState } from "react";
import type { BrandSlug, GalleryItem } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GallerySection({
  band,
  bandName,
  items,
}: {
  band: BrandSlug;
  bandName: string;
  items: GalleryItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      <div className="retro-section-band px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={bandName} title="Galerie" />
          <div className="retro-card-grid">
            {items.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="retro-card group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-md text-left"
              >
                <div className="relative min-h-[11rem] flex-1 sm:min-h-[12rem]">
                  <Image
                    src={item.image}
                    alt={item.caption || bandName}
                    fill
                    className="retro-photo object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="min-h-[4.5rem] shrink-0 p-4 text-sm text-muted">
                  {item.caption || "\u00A0"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[60] flex cursor-pointer items-center justify-center bg-black/80 p-6"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="retro-card relative max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-md bg-surface-dark"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={activeItem.image}
                alt={activeItem.caption || bandName}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            {activeItem.caption ? (
              <p className="p-4 text-center text-sm text-white/80">
                {activeItem.caption}
              </p>
            ) : null}
            <button
              type="button"
              className="retro-btn absolute right-4 top-4 cursor-pointer rounded-md bg-accent-katg px-3 py-1 text-sm text-white"
              onClick={() => setActiveIndex(null)}
            >
              Schließen
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
