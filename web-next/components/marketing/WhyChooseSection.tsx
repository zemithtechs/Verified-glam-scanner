import { Sparkles } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import type { WhyChooseItem } from "@/lib/tool-landing-types";

export function WhyChooseSection({ title, items }: { title: string; items: WhyChooseItem[] }) {
  return (
    <Section>
      <SectionTitle title={title} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-(--color-border) bg-white p-6">
            <div className="w-10 h-10 rounded-full bg-(--color-blush) flex items-center justify-center mb-4">
              <Sparkles className="text-(--color-burgundy)" size={20} />
            </div>
            <p className="font-bold text-(--color-text)">{item.title}</p>
            <p className="mt-2 text-sm text-(--color-text-muted) leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
