import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app/", "/admin/", "/forgot-password", "/onboarding", "/dashboard", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
