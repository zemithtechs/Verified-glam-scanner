import type { Tool } from "@/lib/catalog";
import type { ToolPageContent } from "@/lib/tool-page-content";

/** Tools that ship fewer than three feature images (see ToolLandingPage). */
const FEATURE_COUNT_OVERRIDES: Record<string, number> = { "old-photo-restoration": 0, "cartoon-yourself": 1 };

/** Feature images that exist for a tool, and the gallery set (result image first, no duplicates). */
export function getToolImages(tool: Tool, content: Pick<ToolPageContent, "visuals">) {
  const featureCount = FEATURE_COUNT_OVERRIDES[tool.slug] ?? 3;
  const featureImages = tool.slug === "face-beauty-analysis" ? content.visuals : Array.from({ length: featureCount }, (_, index) => `/img/results/${tool.slug}-feature-${index + 1}.png`);
  const galleryImages = [...new Set([content.visuals[0], ...featureImages])];
  return { featureImages, galleryImages };
}
