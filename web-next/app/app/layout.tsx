import { Suspense } from "react";
import { getCurrentProfile } from "@/lib/get-current-profile";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { CheckoutReturnBanner } from "@/components/CheckoutReturnBanner";

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

  return (
    <div className="flex min-h-screen bg-(--color-blush)">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar profile={profile} />
        <Suspense fallback={null}>
          <CheckoutReturnBanner />
        </Suspense>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
