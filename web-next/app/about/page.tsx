import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Verified Glam - Beauty Scanner",
  description: "Learn how Verified Glam - Beauty Scanner turns a selfie into optional beauty, style, and photo insights on web and Android.",
  alternates: { canonical: `${SITE_URL}/about` },
};

const PRINCIPLES = [
  ["Your photo stays central", "Reports keep your image and the visual context together, so a result is easier to understand than a number on its own."],
  ["Curiosity, not judgment", "Our tools are designed for styling ideas and entertainment. They are not medical advice or a definition of anyone's worth."],
  ["Privacy is part of the product", "Photos are processed through your authenticated account. You can review our Privacy Policy and account deletion options at any time."],
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      <section className="bg-white px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-(--color-surface) px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.13em] text-(--color-burgundy)"><Sparkles size={14} /> About Verified Glam</span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-(--color-burgundy-dark) sm:text-6xl">Beauty insight should feel personal, clear, and kind.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-(--color-text-muted)">Verified Glam - Beauty Scanner is a beauty and style discovery product for people who want to explore a look with more context. A clear selfie can become a practical starting point for photo direction, makeup, colors, grooming, and fun face-based tools.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link href="/tools" className="inline-flex items-center gap-2 rounded-[13px] bg-(--color-burgundy) px-5 py-3 font-extrabold text-white hover:bg-(--color-burgundy-dark)">Explore the tools <ArrowRight size={16} /></Link><Link href="/privacy" className="rounded-[13px] border border-(--color-border) px-5 py-3 font-extrabold text-(--color-burgundy-dark) hover:bg-(--color-surface)">Read our privacy approach</Link></div>
          </div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-(--color-surface) shadow-[0_24px_60px_rgba(82,13,28,0.14)]"><Image src="/images/lifestyle/value-results.jpg" alt="Verified Glam - Beauty Scanner beauty analysis preview" fill priority className="object-cover" sizes="(min-width: 1024px) 560px, 100vw" /><div className="absolute inset-x-5 bottom-5 rounded-[16px] bg-white/95 p-4 shadow-lg backdrop-blur"><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-(--color-burgundy)">Built around your image</p><p className="mt-1 font-extrabold text-(--color-burgundy-dark)">Clear visual context, then ideas you can choose to use.</p></div></div>
        </div>
      </section>

      <section className="bg-(--color-surface) px-4 py-16 sm:px-6"><div className="mx-auto max-w-[1120px]"><div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--color-burgundy)">Our approach</p><h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-(--color-burgundy-dark) sm:text-4xl">Designed for better choices, not impossible standards.</h2></div><div className="mt-9 grid gap-5 md:grid-cols-3">{PRINCIPLES.map(([title, description], index) => <article key={title} className="rounded-[20px] border border-(--color-border) bg-white p-6 shadow-[0_14px_34px_rgba(82,13,28,0.06)]"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-blush) text-sm font-extrabold text-(--color-burgundy)">0{index + 1}</span><h3 className="mt-5 text-xl font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark)">{title}</h3><p className="mt-3 text-sm leading-6 text-(--color-text-muted)">{description}</p></article>)}</div></div></section>

      <section className="bg-white px-4 py-16 sm:px-6"><div className="mx-auto grid max-w-[1120px] gap-10 lg:grid-cols-2 lg:items-center"><div className="rounded-[24px] bg-(--color-burgundy-dark) p-7 text-white sm:p-9"><LockKeyhole size={26} /><h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em]">How your scan works</h2><ol className="mt-6 space-y-4 text-sm leading-6 text-white/80"><li className="flex gap-3"><span className="font-extrabold text-white">01</span> Choose the tool and upload a clear, front-facing image.</li><li className="flex gap-3"><span className="font-extrabold text-white">02</span> We process the photo securely to prepare the requested result.</li><li className="flex gap-3"><span className="font-extrabold text-white">03</span> Review your report, use what helps, and leave behind what does not.</li></ol></div><div><p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--color-burgundy)">What we offer</p><h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-(--color-burgundy-dark)">Ten focused tools for the moments you are already thinking about.</h2><ul className="mt-6 space-y-4">{["Face beauty and symmetry reports", "Seasonal color and everyday style direction", "Celebrity look alike and face comparison for entertainment", "Glow up routines and practical beauty tips"].map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-(--color-text-muted)"><CheckCircle2 size={19} className="mt-0.5 shrink-0 text-(--color-burgundy)" />{item}</li>)}</ul><Link href="/pricing" className="mt-7 inline-flex items-center gap-2 font-extrabold text-(--color-burgundy)">See plans and credits <ArrowRight size={16} /></Link></div></div></section>
    </MarketingLayout>
  );
}
