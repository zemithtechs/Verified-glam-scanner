import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { CATEGORIES, SITE, TOOLS, isAvailable } from "@/lib/catalog";
import { SITE_INDEXABLE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_INDEXABLE) return [];
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE.url}${path}`,
    changeFrequency: "monthly",
    priority,
  });
  return [
    entry("/", 1),
    entry("/tools", 0.9),
    entry("/blog", 0.6),
    ...CATEGORIES.map((category) => entry(`/category/${category.id}`, 0.8)),
    ...TOOLS.filter(isAvailable).map((tool) => entry(`/${tool.slug}`, 0.8)),
    ...BLOG_POSTS.map((post) => entry(`/blog/${post.slug}`, 0.6)),
    entry("/about", 0.3),
    entry("/contact", 0.3),
    entry("/pricing", 0.4),
  ];
}
