import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";
import { getSiteContent } from "@/lib/content";
import type { BrandSlug } from "@/lib/types";

function brandFromSearchParam(value: string | undefined): BrandSlug {
  return value === "katg" ? "katg" : "r2-live";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ band?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const content = getSiteContent();
  const band =
    params.band === "katg"
      ? content.bands.katg
      : content.bands["r2-live"];

  return {
    title: band.displayName,
    description: band.description,
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ band?: string }>;
}) {
  const params = await searchParams;
  const content = getSiteContent();
  const initialBrand = brandFromSearchParam(params.band);

  return <HomePageClient content={content} initialBrand={initialBrand} />;
}
