import Image from "next/image";
import type { Tool } from "@/lib/catalog";

/** A complete downloadable raster with all report elements baked into the file. */
export function ToolResultVisual({ tool, src, alt, priority = false, className = "" }: {
  tool: Tool; src: string; variant?: number; alt: string; priority?: boolean; className?: string;
}) {
  return <a href={src} download aria-label={`Download ${tool.name} example`} className={`relative block aspect-video bg-[#faf9f8] ${className}`}>
    <Image src={src} alt={alt} fill preload={priority} sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
  </a>;
}
