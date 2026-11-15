import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/ToolPageShell";
import { ToolLandingPage } from "@/components/ToolLandingPage";
import { getToolPageContent } from "@/lib/tool-page-content";
import { TOOLS, categoryById, isBrowsableTool, toolBySlug, toolsInCategory } from "@/lib/catalog";
import { GENERATION_SPECS } from "@/lib/generation-specs";
import { resultAlt } from "@/lib/image-alt";
import { buildMetadata, resultShareImage } from "@/lib/seo-meta";

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tool = toolBySlug((await params).slug);
  if (!tool) return {};

  const content = getToolPageContent(tool);
  return buildMetadata({
    title: content.metaTitle ?? `${tool.name} Online: Photo Results and Style Previews`,
    description: content.metaDescription ?? `Try ${tool.name} with your own photo or a sample. Explore visual examples, choose your result, and download one complete image.`,
    path: `/${tool.slug}`,
    exactTitle: true,
    image: resultShareImage(tool.slug, resultAlt(tool)),
    // Pages that are not a runnable tool (coming soon, or an explainer such as celebrity matching) stay out of the index.
    noindex: tool.status === "later" || Boolean(GENERATION_SPECS[tool.slug]?.unavailable),
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const tool = toolBySlug((await params).slug);
  if (!tool) notFound();

  const category = categoryById(tool.category);
  // Neighbours in the category, starting after this tool and wrapping around, so every tool in a long
  // category gets internal links from several siblings (not only the first six tools of the list).
  const siblings = toolsInCategory(tool.category);
  const at = siblings.findIndex((item) => item.slug === tool.slug);
  const rotated = [...siblings.slice(at + 1), ...siblings.slice(0, at)];
  // After the siblings, suggest tools from groups people naturally move to next, rotated per tool so pages differ.
  const NEXT_GROUPS: Record<string, string[]> = {
    "face-analysis": ["glow-up", "skin-retouch", "hair-beard"],
    "glow-up": ["makeup-tryon", "fashion-style", "face-analysis"],
    "skin-retouch": ["makeup-tryon", "face-analysis", "hair-beard"],
    "hair-beard": ["face-analysis", "makeup-tryon", "fashion-style"],
    "makeup-tryon": ["skin-retouch", "glow-up", "hair-beard"],
    "fashion-style": ["glow-up", "makeup-tryon", "hair-beard"],
    "fun-effects": ["photo-tools", "skin-retouch", "face-analysis"],
    "photo-tools": ["skin-retouch", "fun-effects", "face-analysis"],
  };
  const neighbours = (NEXT_GROUPS[tool.category] ?? []).flatMap((id) => toolsInCategory(id as typeof tool.category).sort((a, b) => Number(Boolean(b.popular)) - Number(Boolean(a.popular))));
  const shift = neighbours.length ? (at * 2) % neighbours.length : 0;
  const further = [...neighbours.slice(shift), ...neighbours.slice(0, shift)];
  const related = [...rotated, ...further]
    .filter((item) => item.slug !== tool.slug && item.status !== "later" && isBrowsableTool(item))
    .slice(0, 6);

  return (
    <ToolPageShell category={tool.category}>
      <ToolLandingPage tool={tool} category={category} related={related} />
    </ToolPageShell>
  );
}
