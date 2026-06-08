import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";
import { getSiteContent } from "@/lib/content";

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

export default function HomePage() {
  const content = getSiteContent();

  return <HomePageClient content={content} />;
}
