import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demnächst | R2-Live / KURT & THE GANG",
  description:
    "R2-Live und KURT & THE GANG — Austropop live on stage. Unsere Website ist bald online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
