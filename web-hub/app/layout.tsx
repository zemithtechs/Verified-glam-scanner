import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/catalog";
import { publicRobots } from "@/lib/seo";
import { OG_LOCALE } from "@/lib/seo-meta";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Free AI Beauty Tools`, template: `%s | ${SITE.name}` },
  description: "AI beauty tools for your photo: face analysis, skin analysis, hairstyle changer, makeup try-on and virtual clothes try-on. Try free with a selfie.",
  openGraph: { siteName: SITE.name, locale: OG_LOCALE, type: "website" },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/img/favicon.png" },
  // Every public page derives robots from the single SITE_INDEXABLE switch (lib/seo.ts).
  robots: publicRobots(),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
