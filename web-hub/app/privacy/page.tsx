import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY_CONTENT } from "@/lib/legal-content";
import { buildMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = buildMetadata({ title: "Privacy Policy", description: PRIVACY_CONTENT.metaDescription, path: "/privacy" });

export default function PrivacyPage() {
  return <LegalPage content={PRIVACY_CONTENT} />;
}
