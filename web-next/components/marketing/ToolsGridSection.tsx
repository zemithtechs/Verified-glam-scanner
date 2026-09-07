import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import { TOOLS } from "@/lib/tools";

export function ToolsGridSection({ title = "Explore all tools", excludeSlug }: { title?: string; excludeSlug?: string }) {
  const tools = TOOLS.filter((t) => t.slug !== excludeSlug);
  return (
    <Section tint>
      <SectionTitle title={title} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="relative rounded-2xl bg-white border border-(--color-border) overflow-hidden hover:border-(--color-burgundy) transition-colors"
          >
            <div className="relative aspect-[3/2]">
              <Image src={`/images/landings/${tool.slug}/showcase-1.jpg`} alt={tool.title} fill className="object-cover" />
              {tool.badge && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wide text-white bg-(--color-burgundy) rounded-full px-2 py-0.5">
                  {tool.badge}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="font-semibold text-(--color-text)">{tool.title}</p>
              <p className="mt-1 text-sm text-(--color-text-muted) leading-snug">{tool.gridDescription}</p>
              {tool.isPro && (
                <p className="mt-2 flex items-center gap-1 text-xs text-(--color-text-muted)">
                  <Lock size={11} /> Pro
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
