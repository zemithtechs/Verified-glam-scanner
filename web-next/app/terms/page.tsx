import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { TERMS_CONTENT } from "@/lib/legal-content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: TERMS_CONTENT.pageTitle,
  description: TERMS_CONTENT.metaDescription,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return <LegalPageLayout content={TERMS_CONTENT} />;
}
