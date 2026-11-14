import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { CATEGORIES, TOOLS, isAvailable } from "@/lib/catalog";
import { CONTENT_UPDATED, SITE_INDEXABLE } from "@/lib/seo";
import { absoluteUrl } from "@/lib/seo-meta";
import { getToolImages } from "@/lib/tool-images";
import { getToolPageContent } from "@/lib/tool-page-content";

type Entry = MetadataRoute.Sitemap[number];

/** Every public URL, only when SITE_INDEXABLE is true. Private paths (/app, /admin, auth, /api) are never listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_INDEXABLE) return [];
  const entry = (path: string, priority: number, changeFrequency: Entry["changeFrequency"], lastModified = CONTENT_UPDATED, images?: string[]): Entry => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    ...(images?.length ? { images: images.map(absoluteUrl) } : {}),
  });
  return [
    entry("/", 1, "weekly"),
    entry("/tools", 0.9, "weekly"),
    ...CATEGORIES.map((category) => entry(`/category/${category.id}`, 0.8, "weekly")),
    ...TOOLS.filter(isAvailable).map((tool) => entry(`/${tool.slug}`, 0.8, "monthly", CONTENT_UPDATED, getToolImages(tool, getToolPageContent(tool)).galleryImages)),
    entry("/blog", 0.6, "weekly"),
    ...BLOG_POSTS.map((post) => entry(`/blog/${post.slug}`, 0.6, "monthly", post.updated, [`/img/results/${post.toolSlugs[0]}.png`])),
    entry("/pricing", 0.5, "monthly"),
    entry("/about", 0.4, "yearly"),
    entry("/contact", 0.3, "yearly"),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
    entry("/delete-account", 0.2, "yearly"),
  ];
}
