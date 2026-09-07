import Image from "next/image";
import { Section, SectionTitle } from "./Section";
import type { ShowcaseItem } from "@/lib/tool-landing-types";

export function ShowcaseSection({ title, items, slug }: { title: string; items: ShowcaseItem[]; slug: string }) {
  return (
    <Section tint>
      <SectionTitle title={title} />
      <div className="space-y-10">
        {items.map((item, i) => (
          <div key={item.title} className={`grid md:grid-cols-2 gap-6 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div className="relative rounded-2xl aspect-[3/2] overflow-hidden shadow-[0_20px_40px_rgba(135,43,63,0.12)]">
              <Image src={`/images/landings/${slug}/showcase-${i + 1}.jpg`} alt={item.title} fill className="object-cover" />
            </div>
            <div>
              <p className="text-xl font-bold text-(--color-burgundy-dark)">{item.title}</p>
              <p className="mt-2 text-(--color-text-muted) leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
