import Link from "next/link";
import { Coins, Crown } from "lucide-react";
import { requireProfile } from "@/lib/account";
import { planLabel } from "@/lib/plan-label";
import { PRICING } from "@/lib/pricing";
import { AccountActions } from "./AccountActions";

export const dynamic = "force-dynamic";

export default async function Account({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const profile = await requireProfile("/app/account");
  const { checkout } = await searchParams;
  const plan = planLabel(profile.subscription_plan, profile.is_pro);
  const bought = profile.purchased_credits ?? 0;
  const planCredits = profile.subscription_credits ?? Math.max(profile.credits_balance - bought, 0);
  const name = profile.display_name || profile.email.split("@")[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Credits & plan</h1>

      {checkout === "success" && (
        <div role="status" className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-900">
          <p className="font-semibold">Thank you! Your payment went through.</p>
          <p className="mt-0.5">Your plan or credits are added within a minute or two. If you do not see them yet, refresh this page.</p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-line bg-white p-6">
          <p className="flex items-center gap-2 font-bold"><Coins size={18} className="text-gold" />Your credits</p>
          <p className="mt-3 font-display text-5xl font-semibold">{profile.credits_balance}<span className="text-xl text-muted"> credits</span></p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex justify-between border-b border-line pb-2"><span>Plan and free credits</span><span className="font-semibold text-muted">{planCredits}</span></li>
            <li className="flex justify-between border-b border-line pb-2"><span>Bought credits (never expire)</span><span className="font-semibold text-muted">{bought}</span></li>
            <li className="flex justify-between"><span>Results you can make</span><span className="font-semibold text-muted">{Math.floor(profile.credits_balance / PRICING.creditsPerGeneration)}</span></li>
          </ul>
        </section>
        <section className="rounded-3xl bg-ink p-6 text-white">
          <p className="flex items-center gap-2 font-bold"><Crown size={18} className="text-gold" />Your plan: {plan}</p>
          <p className="mt-3 text-sm text-white/80">{profile.is_pro ? "Thank you for being Pro. Manage billing, change plan or cancel any time." : "You are on the free plan. Go Pro for no ads and more credits, or buy a credit pack once."}</p>
          <AccountActions isPro={profile.is_pro} />
        </section>
      </div>

      <section className="rounded-3xl border border-line bg-white p-6">
        <h2 className="font-bold">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Name</p><p className="mt-1 font-semibold">{name}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Email</p><p className="mt-1 font-semibold">{profile.email}</p></div>
        </div>
      </section>

      <section className="rounded-3xl border border-red-200 bg-red-50/60 p-6">
        <h2 className="font-bold text-red-800">Delete account & photos</h2>
        <p className="mt-1 text-sm text-red-900/80">Permanently removes your account, saved results and uploaded photos. Cancelling a subscription is separate.</p>
        <Link href="/delete-account" className="mt-4 inline-block rounded-full border border-red-300 bg-white px-5 py-2.5 text-sm font-bold text-red-800">Delete my account</Link>
      </section>
    </div>
  );
}
