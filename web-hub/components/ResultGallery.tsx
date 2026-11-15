"use client";

import Image from "next/image";
import { useState } from "react";
import { imageUrl } from "@/lib/image-base";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ResultGallery({ images, alts, toolName }: { images: string[]; alts?: string[]; toolName: string }) {
  const uniqueImages = [...new Set(images)];
  const [active, setActive] = useState(0);
  const current = active % Math.max(uniqueImages.length, 1);
  const next = (direction: number) => setActive((index) => (index + direction + uniqueImages.length) % uniqueImages.length);
  if (uniqueImages.length === 0) return null;
  return <div className="mx-auto mt-6 max-w-[1030px]" role="region" aria-label={`${toolName} result examples`} aria-roledescription="carousel" onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); next(event.key === "ArrowLeft" ? -1 : 1); } }}>
    <div className="relative">
      <a href={imageUrl(uniqueImages[current])} download className="relative block aspect-video overflow-hidden rounded-lg border border-line bg-[#faf9f8]" aria-label={`Download example ${current + 1}`}><Image key={uniqueImages[current]} src={uniqueImages[current]} alt={alts?.[images.indexOf(uniqueImages[current])] ?? `${toolName} example result`} fill sizes="(min-width: 1440px) 1000px, (min-width: 1024px) 65vw, 95vw" className="tool-gallery-image object-contain" preload={current === 0} /></a>
      {uniqueImages.length > 1 && <><button type="button" onClick={() => next(-1)} aria-label="Previous example" className="tool-gallery-arrow absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/95 text-plum shadow-sm sm:left-3"><ChevronLeft size={20} /></button><button type="button" onClick={() => next(1)} aria-label="Next example" className="tool-gallery-arrow absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white/95 text-plum shadow-sm sm:right-3"><ChevronRight size={20} /></button></>}
    </div>
    {uniqueImages.length > 1 && <div className="mt-4 flex items-center justify-center gap-2.5">{uniqueImages.map((src, index) => <button key={src} type="button" aria-label={`Show example ${index + 1}`} aria-pressed={current === index} onClick={() => setActive(index)} className={`relative h-12 w-[76px] overflow-hidden rounded-md border-2 transition-colors sm:h-14 sm:w-[90px] ${current === index ? "border-plum ring-2 ring-plum/10 ring-offset-2" : "border-transparent opacity-65 hover:border-plum/30 hover:opacity-100"}`}><Image src={src} alt="" fill sizes="90px" className="object-contain" /></button>)}</div>}
  </div>;
}
