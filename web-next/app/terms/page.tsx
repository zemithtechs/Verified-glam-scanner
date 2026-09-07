import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { TERMS_CONTENT } from "@/lib/legal-content";

export const metadata: Metadata = { title: TERMS_CONTENT.pageTitle, description: TERMS_CONTENT.metaDescription };

export default function TermsPage() {
  return <LegalPageLayout content={TERMS_CONTENT} />;
}
