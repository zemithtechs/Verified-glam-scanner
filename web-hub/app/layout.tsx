import type { Metadata } from "next";
import { Outfit, Fraunces } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/catalog";
import { SITE_INDEXABLE } from "@/lib/seo";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Free AI Beauty Tools`, template: `%s | ${SITE.name}` },
  description: "Free AI beauty tools: face analysis, skin analysis, hairstyle changer, makeup try-on, virtual clothes try-on and more. Upload a selfie and see results in seconds.",
  icons: { icon: "/img/favicon.png" },
  // Local previews stay private until indexing is explicitly enabled for launch.
  robots: { index: SITE_INDEXABLE, follow: SITE_INDEXABLE },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
