import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { MarketingShell } from "@/components/SiteChrome";
import { Container, SectionHead } from "@/components/ui";
import { COUNTS } from "@/lib/catalog";
import { GOOGLE_PLAY_URL, SUPPORT_EMAIL } from "@/lib/site-info";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo-meta";
import { PRICING, generationsFor } from "@/lib/pricing";
import { titleCase } from "@/lib/title-case";

export const metadata: Metadata = buildMetadata({
  title: "About AI Beauty Styling",
  description: "AI Beauty Styling turns one photo into face reports, hair and makeup previews and outfit ideas. See how a result is made, how we handle photos and who runs it.",
  path: "/about",
});

const PRINCIPLES = [
  ["Your photo stays at the center of every result.", "Reports keep your image beside the notes about it, so you can check each point against your own face. That is easier to act on than a number alone. You see what the tool looked at, and you decide what is useful for your hair, makeup or wardrobe."],
  ["You get styling ideas to use, never verdicts about you.", "Our tools are made for styling ideas and entertainment. They are not medical advice, and they do not measure anyone's worth or tell you how to look. Keep the ideas you like, ignore the rest, and treat every score as one opinion about one photo."],
  ["You can delete your saved results at any time.", "Your upload is sent to our AI provider to make the result. If you are signed in, the finished result is saved to My creations, where you can delete it, or delete your whole account, at any time. The Privacy Policy explains how data is handled."],
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <JsonLd data={organizationSchema()} />
      <section className="hero-glow border-b border-line">
        <Container className="max-w-4xl py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-berry">About us</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{titleCase("We help you see a new look before you pay for it.")}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">AI Beauty Styling is a collection of {COUNTS.available} AI beauty tools. Upload one clear photo and preview a hairstyle, a lip shade, your season colors or an outfit before you spend money on the real thing. New accounts get {PRICING.starter.credits} free credits, enough for {generationsFor(PRICING.starter.credits)} results.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/tools" className="inline-flex h-12 items-center gap-2 rounded-xl bg-plum px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ink">Explore the tools<ArrowRight size={16} /></Link>
            <Link href="/privacy" className="inline-flex h-12 items-center rounded-xl border border-plum/25 bg-white px-6 text-[15px] font-semibold text-plum hover:bg-blush">How we handle photos</Link>
          </div>
        </Container>
      </section>

      <Container className="mt-16">
        <SectionHead eyebrow="Our approach" title={titleCase("Made to help you choose, not to judge you.")} />
        <div className="grid gap-5 md:grid-cols-3">
          {PRINCIPLES.map(([title, text], i) => (
            <article key={title} className="rounded-2xl border border-line bg-white p-6">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blush text-sm font-semibold text-plum">0{i + 1}</span>
              <h3 className="mt-5 text-xl font-semibold">{titleCase(title)}</h3>
              <p className="mt-2.5 text-[15px] leading-6 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </Container>

      <Container className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl bg-ink p-7 text-white sm:p-9">
          <Lock size={26} aria-hidden="true" className="text-rose" />
          <h2 className="mt-5 font-display text-3xl font-semibold">{titleCase("Your result takes three simple steps from upload to download.")}</h2>
          <ol className="mt-6 space-y-4 text-[15px] leading-6 text-white/80">
            <li className="flex gap-3"><span className="font-semibold text-white">01</span>Choose a tool and upload a clear, front-facing photo, or try a sample.</li>
            <li className="flex gap-3"><span className="font-semibold text-white">02</span>Your photo goes to our AI provider only when you press generate, and only to make your result.</li>
            <li className="flex gap-3"><span className="font-semibold text-white">03</span>Review your result, use what helps and leave behind what does not.</li>
          </ol>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-berry">What we offer</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">{titleCase("Pick the tool that fits the decision you are facing.")}</h2>
          <p className="mt-6 text-[15px] leading-7 text-muted">You can read face, symmetry and skin reports, find your seasonal colors and get everyday style direction. You can preview hair, makeup and outfits on your own photo, restore an old print or try a playful effect. A new account starts with {PRICING.starter.credits} free credits, and Pro gives you more credits when you need them.</p>
        </div>
      </Container>

      <Container className="mt-16 max-w-4xl">
        <div className="rounded-3xl border border-line bg-white p-7 sm:p-9">
          <h2 className="font-display text-2xl font-semibold">{titleCase("Results are for fun and styling ideas.")}</h2>
          <p className="mt-3 leading-7 text-muted">Results are generated automatically and may not always be accurate. They are not medical, dermatological or professional advice, and features like celebrity look-alikes are for fun and never verify identity. AI Beauty Styling is for adults aged 18 and older.</p>
          <h2 className="mt-8 font-display text-2xl font-semibold">{titleCase("Verified Glam runs AI Beauty Styling and answers your emails.")}</h2>
          <p className="mt-3 leading-7 text-muted">AI Beauty Styling is the new home of the Verified Glam - Beauty Scanner web experience, operated by Verified Glam. The Android app is available on <a href={GOOGLE_PLAY_URL} rel="noopener noreferrer" className="font-semibold text-plum underline underline-offset-4">Google Play</a>.</p>
          <p className="mt-5 text-muted">Questions or partnership ideas? Email <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-plum underline underline-offset-4">{SUPPORT_EMAIL}</a> or visit our <Link href="/contact" className="font-semibold text-plum underline underline-offset-4">contact page</Link>.</p>
        </div>
      </Container>
    </MarketingShell>
  );
}
