import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { toolBySlug } from "@/lib/catalog";

const ITEMS = [
  ["face-beauty-analysis", "Today"],
  ["celebrity-look-alike", "Yesterday"],
  ["facial-symmetry", "Nov 3"],
  ["attractiveness-test", "Nov 1"],
  ["beauty-routine-challenge", "Oct 28"],
  ["skin-analysis", "Oct 25"],
];

export default function Creations() {
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight">My creations</h1>
      <p className="mt-1 text-muted">Everything you’ve made, saved to your account. Delete any item at any time.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {ITEMS.map(([slug, when], i) => (
          <div key={i} className="group overflow-hidden rounded-2xl border border-line bg-white">
            <Link href={`/${slug}`} className="relative block aspect-video">
              <Image src={`/img/results/${slug}.png`} alt={`${toolBySlug(slug)!.name}: complete example result`} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw" className="object-contain" />
            </Link>
            <div className="p-3 text-center"><Link href={`/${slug}`} className="text-sm font-semibold">{toolBySlug(slug)!.name}</Link><p className="mt-1 text-xs text-muted">{when}</p></div>
            <a href={`/img/results/${slug}.png`} download={`${slug}-result.png`} className="flex items-center justify-center gap-2 border-t border-line px-3 py-2.5 text-sm font-semibold text-berry hover:bg-blush"><Download size={15} />Download image</a>
          </div>
        ))}
      </div>
    </div>
  );
}
