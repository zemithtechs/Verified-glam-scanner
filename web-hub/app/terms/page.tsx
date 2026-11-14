import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TERMS_CONTENT } from "@/lib/legal-content";
import { buildMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = buildMetadata({ title: "Terms of Use", description: TERMS_CONTENT.metaDescription, path: "/terms" });

export default function TermsPage() {
  return <LegalPage content={TERMS_CONTENT} />;
}
