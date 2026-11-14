import { buildLlmsTxt } from "@/lib/llms";
import { SITE_INDEXABLE } from "@/lib/seo";

/** Hidden (404) until SITE_INDEXABLE is true, like the sitemap. */
export function GET() {
  if (!SITE_INDEXABLE) return new Response("Not found", { status: 404 });
  return new Response(buildLlmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
