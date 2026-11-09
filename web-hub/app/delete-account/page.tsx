import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/SiteChrome";
import { Container } from "@/components/ui";
import { LEGACY_APP_URL, SUPPORT_EMAIL } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Delete your account",
  description: "Delete your AI Beauty Styling or Verified Glam account and the personal data linked to it.",
  alternates: { canonical: "/delete-account" },
};

export default function DeleteAccountPage() {
  return (
    <MarketingShell>
      <section className="hero-glow border-b border-line">
        <Container className="max-w-3xl py-12 sm:py-16">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Delete your account</h1>
          <p className="mt-3 text-lg text-muted">You can permanently delete your account at any time, on the web or in the Android app.</p>
        </Container>
      </section>
      <Container className="max-w-3xl space-y-6 py-10 sm:py-14 text-[16px] leading-7">
        <p>Deletion is permanent. It removes your account credentials, profile, stored photos, analysis history, challenges and saved results. Billing records that must be kept for legal or fraud-prevention reasons may be retained only for the period the law requires. Deleting your account is separate from cancelling a subscription.</p>

        <div className="rounded-3xl border border-line bg-white p-6 sm:p-7">
          <h2 className="font-display text-2xl font-semibold text-plum">Delete online</h2>
          <p className="mt-2 text-muted">Sign in to your account and confirm. Your account, photos and history are removed straight away.</p>
          <a href={`${LEGACY_APP_URL}/delete-account`} className="mt-5 inline-flex h-12 items-center rounded-xl bg-plum px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ink">Go to account deletion</a>
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
