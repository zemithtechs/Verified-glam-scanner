import type { Metadata } from "next";
import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { Profile } from "@/lib/types";
import { SITE_URL } from "@/lib/site";
import { PRICING_COPY } from "@/lib/pricing-copy";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { FaqJsonLd } from "@/components/seo/JsonLd";
import { PricingView } from "./PricingView";

const TITLE = "Verified Glam - Beauty Scanner Pricing — Credits & Plans";
const DESCRIPTION =
  "Verified Glam - Beauty Scanner Pro: Yearly $39.99/year (200 AI credits) or Pro $3.99/week (30 credits weekly). 5 credits per AI generation. Ad-free.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/pricing` },
};

export default async function PricingPage() {
  const token = await getSessionToken();
  let isPro = false;
  if (token) {
    try {
      const profile = await apiClient.get<Profile>("/api/profiles/me", token);
      isPro = profile.is_pro;
    } catch {
      // Invalid/expired token here just means "treat as signed out" — this
      // page isn't behind proxy.ts's auth gate (it's public), so there's no
      // cookie-clearing responsibility here the way there is in app/app/*.
    }
  }

  return (
    <MarketingLayout>
      <FaqJsonLd items={PRICING_COPY.faq} />
      <PricingView isSignedIn={Boolean(token)} isPro={isPro} />
    </MarketingLayout>
  );
}
