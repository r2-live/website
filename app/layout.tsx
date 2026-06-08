import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={
          {
            "--font-display": "Georgia, 'Times New Roman', serif",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
