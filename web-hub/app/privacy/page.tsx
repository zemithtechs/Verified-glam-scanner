import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY_CONTENT } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: PRIVACY_CONTENT.metaDescription,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage content={PRIVACY_CONTENT} />;
}
