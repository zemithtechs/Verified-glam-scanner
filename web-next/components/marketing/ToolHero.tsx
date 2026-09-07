import Link from "next/link";
import Image from "next/image";
import type { ToolDefinition } from "@/lib/tools";

export function ToolHero({ tool, headline, subheadline }: { tool: ToolDefinition; headline: string; subheadline: string }) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center py-10 sm:py-16 px-4 sm:px-6 max-w-(--max-content) mx-auto">
      <div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-(--color-burgundy-dark) leading-tight">{headline}</h1>
        <p className="mt-4 text-lg text-(--color-text-muted) leading-relaxed max-w-xl">{subheadline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={tool.isPro ? "/pricing" : "/register"}
            className="rounded-full bg-(--color-burgundy) text-white font-semibold px-7 py-3.5 hover:opacity-90"
          >
            {tool.isPro ? "Unlock with Pro" : "Try it free"}
          </Link>
          <Link
            href="/tools"
            className="rounded-full border border-(--color-border) text-(--color-text) font-semibold px-7 py-3.5 hover:bg-(--color-surface)"
          >
            See all tools
          </Link>
        </div>
      </div>
      <div className="relative rounded-[20px] aspect-[3/2] overflow-hidden shadow-[0_16px_32px_rgba(135,43,63,0.12)]">
        <Image src={`/images/landings/${tool.slug}/showcase-1.jpg`} alt={headline} fill className="object-cover" priority />
      </div>
    </div>
  );
}
