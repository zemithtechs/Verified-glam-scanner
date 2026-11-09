import type { MetadataRoute } from "next";
import { SITE } from "@/lib/catalog";
import { SITE_INDEXABLE } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/app", "/admin", "/login", "/register", "/api/", "/icon-sheet"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
