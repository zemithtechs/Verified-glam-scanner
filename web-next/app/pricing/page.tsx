import { getSessionToken } from "@/lib/session";
import { apiClient } from "@/lib/api-client";
import type { Profile } from "@/lib/types";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PricingView } from "./PricingView";

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
      <PricingView isSignedIn={Boolean(token)} isPro={isPro} />
    </MarketingLayout>
  );
}
