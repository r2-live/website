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
      <div className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={bandName} title="Galerie" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group overflow-hidden rounded-3xl border border-border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.caption || bandName}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                {item.caption ? (
                  <p className="p-4 text-sm text-muted">{item.caption}</p>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6"
          onClick={() => setActiveIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-black"
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
              className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-sm text-white"
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
