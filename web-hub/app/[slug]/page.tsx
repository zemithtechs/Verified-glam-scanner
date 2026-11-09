import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/ToolPageShell";
import { ToolLandingPage } from "@/components/ToolLandingPage";
import { getToolPageContent } from "@/lib/tool-page-content";
import { TOOLS, categoryById, toolBySlug, toolsInCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tool = toolBySlug((await params).slug);
  if (!tool) return {};

  const content = getToolPageContent(tool);
  return {
    title: { absolute: content.metaTitle ?? `${tool.name} Online — Photo Results & Style Previews` },
    description: content.metaDescription ?? `Try ${tool.name} with your own photo or a sample. Explore visual examples, choose your result, and download one complete image.`,
    robots: tool.status === "later" ? { index: false, follow: true } : undefined,
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const tool = toolBySlug((await params).slug);
  if (!tool) notFound();

  const category = categoryById(tool.category);
  const related = [...toolsInCategory(tool.category), ...TOOLS.filter(item => item.popular && item.category !== tool.category)]
    .filter((item) => item.slug !== tool.slug && item.status !== "later")
    .slice(0, 6);

  return (
    <ToolPageShell category={tool.category}>
      <ToolLandingPage tool={tool} category={category} related={related} />
    </ToolPageShell>
  );
}
