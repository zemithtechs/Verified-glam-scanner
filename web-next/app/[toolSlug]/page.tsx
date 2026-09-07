import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { toolForSlug } from "@/lib/tools";
import { landingContentForFeature } from "@/lib/tool-landing-content";
import { TOOL_SEO } from "@/lib/tool-seo";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ToolHero } from "@/components/marketing/ToolHero";
import { WhyChooseSection } from "@/components/marketing/WhyChooseSection";
import { ShowcaseSection } from "@/components/marketing/ShowcaseSection";
import { HowToSection } from "@/components/marketing/HowToSection";
import { ToolsGridSection } from "@/components/marketing/ToolsGridSection";
import { ReviewsSection } from "@/components/marketing/ReviewsSection";
import { FaqSection } from "@/components/marketing/FaqSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ toolSlug: string }>;
}): Promise<Metadata> {
  const { toolSlug } = await params;
  const tool = toolForSlug(toolSlug);
  if (!tool) return {};
  const seo = TOOL_SEO[tool.featureType];
  return { title: seo.pageTitle, description: seo.metaDescription };
}

export default async function ToolLandingPage({ params }: { params: Promise<{ toolSlug: string }> }) {
  const { toolSlug } = await params;
  const tool = toolForSlug(toolSlug);
  if (!tool) notFound();

  const content = landingContentForFeature(tool.featureType);

  return (
    <MarketingLayout>
      <ToolHero tool={tool} headline={content.headline} subheadline={content.subheadline} />
      <WhyChooseSection title={`Why choose Verified Glam Scanner for ${tool.title}`} items={content.whyChoose} />
      <ShowcaseSection title="See it in action" items={content.showcase} slug={tool.slug} />
      <HowToSection title="How it works" steps={content.howTo} />
      <ToolsGridSection excludeSlug={tool.slug} />
      <ReviewsSection items={content.reviews} />
      <FaqSection items={content.faq} />
    </MarketingLayout>
  );
}
