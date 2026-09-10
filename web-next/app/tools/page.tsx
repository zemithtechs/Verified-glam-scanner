import type { Metadata } from "next";
import Link from "next/link";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionTitle } from "@/components/marketing/Section";
import { ToolsGridSection } from "@/components/marketing/ToolsGridSection";
import { TOOLS } from "@/lib/tools";
import { SITE_URL } from "@/lib/site";

const TITLE = "AI Beauty Tools — Verified Glam Scanner";
const DESCRIPTION = "Browse AI beauty scan tools: face beauty analysis, symmetry, celebrity look-alike, seasonal color palette, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/tools` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/tools` },
};

export default function ToolsIndexPage() {
  const featured = TOOLS.filter((t) => t.featured);

  return (
    <MarketingLayout>
      <Section>
        <SectionTitle title="AI beauty tools" subtitle="Each scan has its own page — upload a photo and get results on the web." />
        <div className="flex flex-wrap justify-center gap-3">
          {featured.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="rounded-full border border-(--color-border) bg-white px-5 py-2.5 text-sm font-semibold text-(--color-text) hover:border-(--color-burgundy) hover:text-(--color-burgundy)"
            >
              {tool.title}
            </Link>
          ))}
        </div>
      </Section>

      <ToolsGridSection title="All AI beauty tools" />
    </MarketingLayout>
  );
}
