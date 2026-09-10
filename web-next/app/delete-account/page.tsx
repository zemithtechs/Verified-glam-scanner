import type { Metadata } from "next";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { isSignedIn } from "@/lib/is-signed-in";
import { SITE_URL } from "@/lib/site";
import { DeleteAccountPanel } from "./DeleteAccountPanel";

export const metadata: Metadata = {
  title: "Delete your account",
  description: "Delete your Verified Glam account and associated personal data.",
  alternates: { canonical: `${SITE_URL}/delete-account` },
};

export default async function DeleteAccountPage() {
  const signedIn = await isSignedIn();
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-extrabold text-(--color-burgundy-dark) sm:text-4xl">Delete your Verified Glam account</h1>
        <p className="mt-4 leading-relaxed text-(--color-text-muted)">
          You can delete your account here or in the Android app under Profile → Account → Delete account. Deletion is permanent and includes your account credentials, profile, stored selfies, analysis history, challenges, and related personal data.
        </p>
        <p className="mt-3 leading-relaxed text-(--color-text-muted)">
          Billing records that must be retained for legal or fraud-prevention reasons may be kept only for the required period. Account deletion is separate from subscription cancellation.
        </p>
        <div className="mt-8">
          <DeleteAccountPanel isSignedIn={signedIn} />
        </div>
      </div>
    </MarketingLayout>
  );
}
