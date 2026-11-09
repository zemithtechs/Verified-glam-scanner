import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TERMS_CONTENT } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: TERMS_CONTENT.metaDescription,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage content={TERMS_CONTENT} />;
}
