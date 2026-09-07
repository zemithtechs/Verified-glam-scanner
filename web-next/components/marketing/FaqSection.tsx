"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import type { FaqItem } from "@/lib/tool-landing-types";

export function FaqSection({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section>
      <SectionTitle title="Frequently asked questions" />
      <div className="max-w-2xl mx-auto divide-y divide-(--color-border) rounded-2xl border border-(--color-border) bg-white">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.question}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-(--color-text)">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-(--color-text-muted) shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && <p className="px-5 pb-4 text-sm text-(--color-text-muted) leading-relaxed">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
