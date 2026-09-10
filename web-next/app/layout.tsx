import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, GOOGLE_SITE_VERIFICATION } from "@/lib/site";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const DESCRIPTION =
  "Verified Glam Scanner analyzes your selfie with AI for face beauty scores, symmetry, celebrity look-alikes, and personalized glow-up tips. Free to try, Pro plans available.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — AI Beauty Insights from Your Selfie`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: `${SITE_NAME} — AI Beauty Insights from Your Selfie`,
    description: DESCRIPTION,
    images: [{ url: "/images/features/face-beauty.jpg", width: 1536, height: 1024, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — AI Beauty Insights from Your Selfie`,
    description: DESCRIPTION,
    images: ["/images/features/face-beauty.jpg"],
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <OrganizationJsonLd />
        {children}
      </body>
    </html>
  );
}
