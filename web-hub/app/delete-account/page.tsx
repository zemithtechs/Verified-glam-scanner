import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/SiteChrome";
import { Container } from "@/components/ui";
import { currentProfile } from "@/lib/account";
import { SUPPORT_EMAIL } from "@/lib/site-info";
import { DeleteAccountPanel } from "./DeleteAccountPanel";

export const metadata: Metadata = {
  title: "Delete your account",
  description: "Delete your AI Beauty Styling or Verified Glam account and the personal data linked to it.",
  alternates: { canonical: "/delete-account" },
};
// Shows the deletion form only to a signed-in visitor.
export const dynamic = "force-dynamic";

export default async function DeleteAccountPage() {
  const profile = await currentProfile().catch(() => null);
  return (
    <MarketingShell>
      <section className="hero-glow border-b border-line">
        <Container className="max-w-3xl py-12 sm:py-16">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Delete your account</h1>
          <p className="mt-3 text-lg text-muted">You can permanently delete your account at any time, here or in the Android app.</p>
        </Container>
      </section>
      <Container className="max-w-3xl space-y-6 py-10 text-[16px] leading-7 sm:py-14">
        <p>Deletion is permanent. It removes your account credentials, profile, stored photos, saved results, analysis history, challenges and credits. Billing records that must be kept for legal or fraud-prevention reasons may be retained only for the period the law requires. Deleting your account is separate from cancelling a subscription, so cancel any plan from your account page first if you have one.</p>

        <div className="rounded-3xl border border-line bg-white p-6 sm:p-7">
          <h2 className="font-display text-2xl font-semibold text-plum">Delete online</h2>
          <DeleteAccountPanel signedIn={Boolean(profile)} email={profile?.email ?? null} />
        </div>

        <div className="rounded-3xl border border-line bg-white p-6 sm:p-7">
          <h2 className="font-display text-2xl font-semibold text-plum">Delete in the Android app</h2>
          <p className="mt-2 text-muted">Open the app, then go to Profile, then Account, then Delete account.</p>
        </div>

        <div className="rounded-3xl border border-line bg-white p-6 sm:p-7">
          <h2 className="font-display text-2xl font-semibold text-plum">Can&apos;t sign in?</h2>
          <p className="mt-2 text-muted">Email <a href={`mailto:${SUPPORT_EMAIL}?subject=Account%20deletion%20request`} className="font-semibold text-plum underline underline-offset-4">{SUPPORT_EMAIL}</a> from the address you registered with and we will delete the account for you.</p>
        </div>

        <p className="text-sm text-muted">Read how we handle your data in our <Link href="/privacy" className="font-semibold text-plum underline underline-offset-4">Privacy Policy</Link>.</p>
      </Container>
    </MarketingShell>
  );
}
