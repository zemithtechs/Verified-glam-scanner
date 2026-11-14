import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import { MarketingShell } from "@/components/SiteChrome";
import { Container, SectionHead } from "@/components/ui";
import { COUNTS } from "@/lib/catalog";
import { GOOGLE_PLAY_URL, SUPPORT_EMAIL } from "@/lib/site-info";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = buildMetadata({
  title: "About AI Beauty Styling",
  description: "AI Beauty Styling turns a single photo into beauty, style and photo insights. Learn how our tools work, how we handle your photos and who is behind them.",
  path: "/about",
});

const PRINCIPLES = [
  ["Your photo stays central", "Reports keep your image and the visual context together, so a result is easier to understand than a number on its own."],
  ["Curiosity, not judgment", "Our tools are designed for styling ideas and entertainment. They are not medical advice or a definition of anyone's worth."],
  ["Privacy is part of the product", "Photos are processed through your account and can be deleted at any time. Read our Privacy Policy for the full details."],
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <JsonLd data={organizationSchema()} />
      <section className="hero-glow border-b border-line">
        <Container className="max-w-4xl py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-berry">About us</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Beauty insight should feel personal, clear and kind.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">AI Beauty Styling is a collection of {COUNTS.available} AI beauty tools for people who want to explore a look with more context. One clear photo can become a practical starting point for hair, makeup, colors, skin and style, before you make a change.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/tools" className="inline-flex h-12 items-center gap-2 rounded-xl bg-plum px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ink">Explore the tools<ArrowRight size={16} /></Link>
            <Link href="/privacy" className="inline-flex h-12 items-center rounded-xl border border-plum/25 bg-white px-6 text-[15px] font-semibold text-plum hover:bg-blush">How we handle photos</Link>
          </div>
        </Container>
      </section>

      <Container className="mt-16">
        <SectionHead eyebrow="Our approach" title="Designed for better choices, not impossible standards." />
        <div className="grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map(([title, text], i) => (
            <article key={title} className="rounded-2xl border border-line bg-white p-6">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blush text-sm font-semibold text-plum">0{i + 1}</span>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2.5 text-[15px] leading-6 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </Container>

      <Container className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl bg-ink p-7 text-white sm:p-9">
          <Lock size={26} aria-hidden="true" className="text-rose" />
          <h2 className="mt-5 font-display text-3xl font-semibold">How a result is made</h2>
          <ol className="mt-6 space-y-4 text-[15px] leading-6 text-white/80">
            <li className="flex gap-3"><span className="font-semibold text-white">01</span>Choose a tool and upload a clear, front-facing photo, or try a sample.</li>
            <li className="flex gap-3"><span className="font-semibold text-white">02</span>The photo is processed securely to prepare the result you asked for.</li>
            <li className="flex gap-3"><span className="font-semibold text-white">03</span>Review your result, use what helps and leave behind what does not.</li>
          </ol>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-berry">What we offer</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Focused tools for the moments you are already thinking about.</h2>
          <ul className="mt-6 space-y-3.5">
            {["Face, symmetry and skin reports", "Seasonal color and everyday style direction", "Hair, makeup and outfit try-on previews", "Photo restoration and creative effects", "A free tier, with Pro for more credits and no ads"].map((t) => (
              <li key={t} className="flex gap-3 text-[15px] leading-6 text-muted"><Check size={19} className="mt-0.5 shrink-0 text-berry" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="mt-16 max-w-4xl">
        <div className="rounded-3xl border border-line bg-white p-7 sm:p-9">
          <h2 className="font-display text-2xl font-semibold">Entertainment and self-discovery</h2>
          <p className="mt-3 leading-7 text-muted">Results are generated automatically and may not always be accurate. They are not medical, dermatological or professional advice, and features like celebrity look-alikes are for fun and never verify identity. AI Beauty Styling is for adults aged 18 and older.</p>
          <h2 className="mt-8 font-display text-2xl font-semibold">Who we are</h2>
          <p className="mt-3 leading-7 text-muted">AI Beauty Styling is the new home of the Verified Glam - Beauty Scanner web experience, operated by Verified Glam. The Android app is available on <a href={GOOGLE_PLAY_URL} rel="noopener noreferrer" className="font-semibold text-plum underline underline-offset-4">Google Play</a>.</p>
          <p className="mt-5 text-muted">Questions or partnership ideas? Email <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-plum underline underline-offset-4">{SUPPORT_EMAIL}</a> or visit our <Link href="/contact" className="font-semibold text-plum underline underline-offset-4">contact page</Link>.</p>
        </div>
      </Container>
    </MarketingShell>
  );
}
