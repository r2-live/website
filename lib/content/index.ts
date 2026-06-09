import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  bandProfileSchema,
  contactInfoSchema,
  coverArtistsSchema,
  eventItemSchema,
  galleryItemSchema,
  legalPageSchema,
  setlistTrackSchema,
} from "./schemas";
import type {
  BandProfile,
  BrandSlug,
  ContactInfo,
  EventItem,
  GalleryItem,
  LegalPage,
  SetlistTrack,
  SiteContent,
} from "@/lib/types";
import { BRAND_SLUGS } from "@/lib/types";

const contentDir = path.join(process.cwd(), "content");

function readMarkdownFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(dir, file));
}

export function getBand(slug: BrandSlug): BandProfile {
  const filePath = path.join(contentDir, "bands", `${slug}.md`);
  const { data } = readMarkdownFile(filePath);
  return bandProfileSchema.parse(data);
}

export function getGallery(slug: BrandSlug): GalleryItem[] {
  const dir = path.join(contentDir, "gallery", slug);
  return listMarkdownFiles(dir)
    .map((filePath) => {
      const { data } = readMarkdownFile(filePath);
      return galleryItemSchema.parse({
        ...data,
        slug: path.basename(filePath, ".md"),
        band: slug,
      });
    })
    .sort((a, b) => a.order - b.order);
}

export function getSetlist(slug: BrandSlug): SetlistTrack[] {
  const dir = path.join(contentDir, "setlist", slug);
  return listMarkdownFiles(dir)
    .map((filePath) => {
      const { data } = readMarkdownFile(filePath);
      return setlistTrackSchema.parse({
        ...data,
        slug: path.basename(filePath, ".md"),
        band: slug,
      });
    })
    .sort((a, b) => a.order - b.order);
}

export function getCoverArtists(): string[] {
  const filePath = path.join(contentDir, "shared", "cover-artists.md");
  const { data } = readMarkdownFile(filePath);
  return coverArtistsSchema.parse(data).artists;
}

export function getEvents(): EventItem[] {
  const dir = path.join(contentDir, "shared", "events");
  const now = new Date();

  return listMarkdownFiles(dir)
    .map((filePath) => {
      const { data } = readMarkdownFile(filePath);
      return eventItemSchema.parse({
        ...data,
        slug: path.basename(filePath, ".md"),
      });
    })
    .filter((event) => {
      const eventDate = new Date(`${event.date}T${event.time || "00:00"}`);
      return !Number.isNaN(eventDate.getTime()) && eventDate >= now;
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time}`).getTime() -
        new Date(`${b.date}T${b.time}`).getTime(),
    );
}

export function getContact(): ContactInfo {
  const filePath = path.join(contentDir, "shared", "contact.md");
  const { data } = readMarkdownFile(filePath);
  return contactInfoSchema.parse(data);
}

export function getLegal(slug: "impressum" | "datenschutz"): LegalPage {
  const filePath = path.join(contentDir, "shared", "legal", `${slug}.md`);
  const { data, content } = readMarkdownFile(filePath);
  const parsed = legalPageSchema.parse(data);
  return {
    title: parsed.title,
    body: content.trim(),
  };
}

export function getSiteContent(): SiteContent {
  const bands = BRAND_SLUGS.reduce(
    (acc, slug) => {
      acc[slug] = getBand(slug);
      return acc;
    },
    {} as Record<BrandSlug, BandProfile>,
  );

  const galleries = BRAND_SLUGS.reduce(
    (acc, slug) => {
      acc[slug] = getGallery(slug);
      return acc;
    },
    {} as Record<BrandSlug, GalleryItem[]>,
  );

  const setlists = BRAND_SLUGS.reduce(
    (acc, slug) => {
      acc[slug] = getSetlist(slug);
      return acc;
    },
    {} as Record<BrandSlug, SetlistTrack[]>,
  );

  return {
    bands,
    galleries,
    setlists,
    coverArtists: getCoverArtists(),
    events: getEvents(),
    contact: getContact(),
    legal: {
      impressum: getLegal("impressum"),
      datenschutz: getLegal("datenschutz"),
    },
  };
}
