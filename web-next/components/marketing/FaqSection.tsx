"use client";

import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { Section } from "./Section";
import type { FaqItem } from "@/lib/tool-landing-types";

export function FaqSection({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section className="py-16 sm:py-20">
      <div className="grid gap-9 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div className="lg:sticky lg:top-8"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-(--color-burgundy)">Helpful details</p><h2 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-(--color-burgundy-dark) sm:text-4xl">Frequently asked questions</h2><p className="mt-4 max-w-md leading-7 text-(--color-text-muted)">Find clear answers about your photo, your results, and how access works before you begin a scan.</p><div className="mt-6 flex max-w-sm gap-3 rounded-[18px] bg-(--color-surface) p-4"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-(--color-burgundy) shadow-sm"><ShieldCheck size={19} /></span><p className="text-sm leading-6 text-(--color-text-muted)"><strong className="font-bold text-(--color-burgundy-dark)">Your privacy matters.</strong><br />You stay in control of your account and can request deletion at any time.</p></div></div>
        <div className="divide-y divide-(--color-border) overflow-hidden rounded-[22px] border border-(--color-border) bg-white shadow-[0_14px_32px_rgba(82,13,28,0.05)]">
          {items.map((item, i) => {
            const isOpen = open === i;
            return <div key={item.question} className={isOpen ? "bg-(--color-surface)/50" : ""}><button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"><span className="font-bold text-(--color-burgundy-dark)">{item.question}</span><span className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? "bg-(--color-burgundy) text-white" : "bg-(--color-surface) text-(--color-burgundy)"}`}><ChevronDown size={17} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} /></span></button>{isOpen && <p className="max-w-2xl px-5 pb-5 text-sm leading-7 text-(--color-text-muted) sm:px-6 sm:pb-6">{item.answer}</p>}</div>;
          })}
        </div>
      </div>
    </Section>
  );
}
