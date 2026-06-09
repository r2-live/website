import { z } from "zod";

export const brandSlugSchema = z.enum(["r2-live", "katg"]);

export const memberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photo: z.string().optional(),
});

export const bandProfileSchema = z.object({
  slug: brandSlugSchema,
  displayName: z.string().min(1),
  shortName: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  heroImage: z.string().optional(),
  heroVideo: z.string().optional(),
  members: z.array(memberSchema).min(1),
});

export const galleryItemSchema = z.object({
  slug: z.string().min(1),
  band: brandSlugSchema,
  image: z.string().min(1),
  caption: z.string().default(""),
  order: z.number().int().default(0),
});

export const setlistTrackSchema = z.object({
  slug: z.string().min(1),
  band: brandSlugSchema,
  title: z.string().min(1),
  originalArtist: z.string().min(1),
  mediaType: z.enum(["mp3", "video", "youtube"]).optional(),
  mediaUrl: z.string().optional(),
  order: z.number().int().default(0),
});

export const eventItemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  venue: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  url: z.string().optional(),
});

export const contactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
});

export const legalPageSchema = z.object({
  title: z.string().min(1),
});

export const coverArtistsSchema = z.object({
  artists: z.array(z.string().min(1)).min(1),
});
