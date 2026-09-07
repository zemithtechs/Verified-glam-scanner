import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { PRIVACY_CONTENT } from "@/lib/legal-content";

export const metadata: Metadata = { title: PRIVACY_CONTENT.pageTitle, description: PRIVACY_CONTENT.metaDescription };

export default function PrivacyPage() {
  return <LegalPageLayout content={PRIVACY_CONTENT} />;
}
