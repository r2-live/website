import type { Metadata } from "next";
import { Bebas_Neue, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "R2-Live / KURT & THE GANG",
    template: "%s | R2-Live / KATG",
  },
  description:
    "Austropop live on stage — R2-Live als Duo und KURT & THE GANG in voller Besetzung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${bebasNeue.variable} ${sourceSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
