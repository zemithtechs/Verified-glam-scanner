import { Suspense } from "react";
import { getCurrentProfile } from "@/lib/get-current-profile";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { CheckoutReturnBanner } from "@/components/CheckoutReturnBanner";
import { DashboardOfferBar } from "@/components/DashboardOfferBar";
import { getSessionToken } from "@/lib/session";
import { apiClient, ApiError } from "@/lib/api-client";

const DEFAULT_PLATFORM_CONFIG = {
  announcement: { enabled: false, text: "", type: "info" },
};

async function getPlatformConfig(token: string | null) {
  try {
    return await apiClient.get<{ announcement: { enabled: boolean; text: string; type: string } }>(
      "/api/profiles/platform-config",
      token,
    );
  } catch (error) {
    // The web UI and Worker are deployed separately. Keep authentication and
    // the dashboard usable while an older Worker does not have this optional
    // configuration endpoint yet.
    if (error instanceof ApiError && error.status === 404) return DEFAULT_PLATFORM_CONFIG;
    throw error;
  }
}

/**
 * The authoritative auth check. proxy.ts already blocks requests with no
 * session cookie at all (fast path, before rendering starts) — this layout
 * goes further and actually validates the token against worker-api by
 * fetching the profile. An invalid/expired token clears the cookie and
 * redirects here, server-side, before any dashboard HTML is produced. That
 * ordering — decide, then render — is what the old Flutter-web app could
 * not guarantee (its equivalent check ran client-side, after the page had
 * already started rendering), and is the actual fix for the redirect-loop
 * bug that motivated this rewrite.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  const config = await getPlatformConfig(await getSessionToken());

  return (
    <div className="flex min-h-screen bg-[#fbf7f7]">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardOfferBar profile={profile} />
        <TopBar profile={profile} />
        {config.announcement.enabled && config.announcement.text && (
          <div className={`border-b px-4 py-2.5 text-center text-sm font-semibold ${
            config.announcement.type === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-900"
              : config.announcement.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-(--color-border) bg-(--color-blush) text-(--color-burgundy-dark)"
          }`}>
            {config.announcement.text}
          </div>
        )}
        <Suspense fallback={null}>
          <CheckoutReturnBanner />
        </Suspense>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
