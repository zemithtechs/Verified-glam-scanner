import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { ABOUT_CONTENT } from "@/lib/legal-content";

export const metadata: Metadata = { title: ABOUT_CONTENT.pageTitle, description: ABOUT_CONTENT.metaDescription };

export default function AboutPage() {
  return <LegalPageLayout content={ABOUT_CONTENT} />;
}
