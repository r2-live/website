export type BrandSlug = "r2-live" | "katg";

export interface BandMember {
  name: string;
  role: string;
  photo?: string;
}

export interface BandProfile {
  slug: BrandSlug;
  displayName: string;
  shortName: string;
  tagline: string;
  description: string;
  heroImage?: string;
  heroVideo?: string;
  members: BandMember[];
}

export interface GalleryItem {
  slug: string;
  band: BrandSlug;
  image: string;
  caption: string;
  order: number;
}

export interface SetlistTrack {
  slug: string;
  band: BrandSlug;
  title: string;
  originalArtist: string;
  mediaType?: "mp3" | "video" | "youtube";
  mediaUrl?: string;
  order: number;
}

export interface EventItem {
  slug: string;
  name: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  url?: string;
}

export interface VenueItem {
  slug: string;
  name: string;
  image?: string;
  url?: string;
  order: number;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface LegalPage {
  title: string;
  body: string;
}

export interface SiteContent {
  bands: Record<BrandSlug, BandProfile>;
  galleries: Record<BrandSlug, GalleryItem[]>;
  setlists: Record<BrandSlug, SetlistTrack[]>;
  coverArtists: string[];
  events: EventItem[];
  venues: VenueItem[];
  contact: ContactInfo;
  legal: {
    impressum: LegalPage;
    datenschutz: LegalPage;
  };
}

export const BRAND_SLUGS: BrandSlug[] = ["r2-live", "katg"];

export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  members: "members",
  gallery: "gallery",
  setlist: "setlist",
  covers: "covers",
  events: "events",
  venues: "venues",
  contact: "contact",
} as const;

export const BAND_SECTIONS = [
  { id: SECTION_IDS.hero, label: "Hero", key: "1" },
  { id: SECTION_IDS.about, label: "Über uns", key: "2" },
  { id: SECTION_IDS.members, label: "Band", key: "3" },
  { id: SECTION_IDS.gallery, label: "Galerie", key: "4" },
  { id: SECTION_IDS.setlist, label: "Repertoire", key: "5" },
] as const;

export const SHARED_SECTIONS = [
  { id: SECTION_IDS.covers, label: "Künstler", key: "6" },
  { id: SECTION_IDS.events, label: "Termine", key: "7" },
  { id: SECTION_IDS.venues, label: "Spielorte", key: "8" },
  { id: SECTION_IDS.contact, label: "Kontakt", key: "9" },
] as const;
