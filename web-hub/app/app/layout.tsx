import { DashShell } from "@/components/DashShell";
import { platformAnnouncement, requireProfile } from "@/lib/account";
import { planLabel } from "@/lib/plan-label";

export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };
// Reads the signed-in account on every request.
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile("/app");
  const announcement = await platformAnnouncement();
  const user = {
    name: profile.display_name || profile.email.split("@")[0],
    email: profile.email,
    credits: profile.credits_balance,
    max: Math.max(profile.credits_allocated + (profile.purchased_credits ?? 0), profile.credits_balance, 10),
    isPro: profile.is_pro,
    plan: planLabel(profile.subscription_plan, profile.is_pro),
  };
  return <DashShell user={user} announcement={announcement}>{children}</DashShell>;
}
