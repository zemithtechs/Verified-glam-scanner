import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Section, SectionTitle } from "@/components/marketing/Section";
import { ReviewsSection } from "@/components/marketing/ReviewsSection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { HeroMockup } from "@/components/marketing/HeroMockup";
import { GooglePlayBadge } from "@/components/marketing/GooglePlayBadge";

export const metadata: Metadata = {
  title: "Verified Glam Scanner — AI Beauty Insights from Your Selfie",
  description:
    "Verified Glam Scanner analyzes your selfie with AI for face beauty scores, symmetry, celebrity look-alikes, and personalized glow-up tips. Download on Google Play for Android.",
};

const HERO_BULLETS = [
  "11 scan types — from face beauty to color analysis",
  "Results on your photo with face overlays and clear scores",
  "Free tier with optional Pro for full features and no ads",
  "Your photos are processed securely on our servers — never on-device API keys",
];

const PRESS_LOGOS = [
  { name: "Allure", file: "allure.svg" },
  { name: "Vogue", file: "vogue.svg" },
  { name: "Byrdie", file: "byrdie.svg" },
  { name: "Cosmopolitan", file: "cosmopolitan.svg" },
  { name: "Harper's Bazaar", file: "harpers-bazaar.svg" },
];

const VALUE_CARDS = [
  { title: "Scan in seconds", description: "Upload a selfie and get results in moments, not minutes.", image: "value-scan.jpg" },
  { title: "See results on your photo", description: "Overlays and scores appear directly on your own portrait.", image: "value-results.jpg" },
  { title: "Build your glow-up routine", description: "Turn one scan into a daily plan that keeps you consistent.", image: "value-glowup.jpg" },
];

const STATS = [
  { value: "11+", label: "Beauty scan types" },
  { value: "AI", label: "Personalized results" },
  { value: "7", label: "Day glow-up plans" },
];

const FEATURE_ROWS = [
  {
    title: "Face Beauty Analysis",
    description:
      "Get an overall beauty score with detailed breakdowns across facial features. Your uploaded photo stays front and center with overlays that highlight what the AI detected.",
    cta: "Try it now",
    href: "/face-beauty-analysis",
    image: "face-beauty.jpg",
  },
  {
    title: "Facial Symmetry",
    description:
      "Understand balance and proportion with a dedicated symmetry scan. Pro users unlock the full symmetry report with visual guides on their selfie.",
    cta: "Check your symmetry",
    href: "/facial-symmetry",
    image: "facial-symmetry.jpg",
  },
  {
    title: "Celebrity Look-Alike",
    description:
      "See which celebrities share your facial traits — a fun, shareable result powered by AI face analysis. Entertainment only, not identity verification.",
    cta: "Find your match",
    href: "/celebrity-look-alike",
    image: "celebrity-match.jpg",
  },
  {
    title: "Attractiveness Test",
    description:
      "Explore attractiveness scoring with trait breakdowns and personality-style signals. Results include clear disclaimers — for fun and self-discovery, not medical judgment.",
    cta: "Take the test",
    href: "/attractiveness-test",
    image: "attractiveness.jpg",
  },
];

const REVIEWS = [
  {
    name: "Amara K.",
    text: "I love seeing my scores right on my own photo — it feels personal, not generic.",
    rating: 5,
    avatar: "avatar-1.jpg",
  },
  {
    name: "Priya S.",
    text: "The symmetry scan helped me understand my features in a kind, visual way. I use it before makeup routines.",
    rating: 5,
    avatar: "avatar-2.jpg",
  },
  {
    name: "Elena M.",
    text: "Celebrity look-alike is so fun to share with friends. Glow Up Guide keeps me consistent every week.",
    rating: 5,
    avatar: "avatar-3.jpg",
  },
];

const FAQ = [
  {
    question: "How does Verified Glam Scanner use my photos?",
    answer:
      "You upload a selfie for the scan you choose. Your photo is stored securely and sent to our servers for AI analysis. We do not embed OpenAI or other AI API keys in the app — processing happens server-side only. See our Privacy Policy for details.",
  },
  {
    question: "Is this medical or professional advice?",
    answer:
      "No. Verified Glam Scanner is for entertainment and beauty self-discovery. Face reading, attractiveness scores, and celebrity matches are not medical, dermatological, or psychological assessments. Always consult qualified professionals for health or skin concerns.",
  },
  {
    question: "What is free vs Pro?",
    answer:
      "Free users get basic scans with ads and limited history. Pro subscribers unlock all scan types, remove ads, and receive AI credits (Yearly $39.99/year with 200 credits, or Pro $3.99/week with 30 credits weekly). Subscriptions are billed securely through Polar.sh and sync to your account on web and Android.",
  },
  {
    question: "Is Verified Glam Scanner available on iPhone?",
    answer: "Verified Glam Scanner is currently available for Android on Google Play only. There is no App Store version at this time.",
  },
  {
    question: "How long is my data kept?",
    answer:
      "Scan photos and results are tied to your account while you use the app. You can delete scans from history in the app. Account deletion requests can be sent to support@verifiedglam.com. See our Privacy Policy for retention details.",
  },
  {
    question: "Who can use the app?",
    answer:
      "Verified Glam Scanner is for adults aged 18 and older. You must be at least 18 to create an account or purchase a Pro subscription. The service is not directed at minors.",
  },
];

export default function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-10 items-center px-4 sm:px-6 py-12 sm:py-20 max-w-(--max-content) mx-auto">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-(--color-burgundy-dark) leading-tight">
            AI beauty insights from your selfie
          </h1>
          <p className="mt-4 text-lg text-(--color-text-muted) leading-relaxed max-w-lg">
            Pretty in every way. Upload a photo, get personalized scores, symmetry breakdowns, and glow-up tips powered
            by AI.
          </p>
          <ul className="mt-6 space-y-2.5">
            {HERO_BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-(--color-text)">
                <Check size={18} className="text-(--color-burgundy) shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <GooglePlayBadge />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full bg-(--color-burgundy) text-white font-semibold px-7 py-3.5 hover:opacity-90"
            >
              Log in on web
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-(--color-border) text-(--color-text) font-semibold px-7 py-3.5 hover:bg-(--color-surface)"
            >
              Create free account
            </Link>
          </div>
        </div>
        <HeroMockup />
      </div>

      {/* Featured on */}
      <Section tint>
        <p className="text-center text-sm font-semibold text-(--color-text-muted) uppercase tracking-wide mb-6">Featured on</p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
          {PRESS_LOGOS.map((press) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={press.name}
              src={`/images/press/${press.file}`}
              alt={press.name}
              className="opacity-60 grayscale h-6 w-auto"
            />
          ))}
        </div>
        <p className="text-center text-xs text-(--color-text-muted) mt-4">Illustrative placement — not affiliated endorsements.</p>
      </Section>

      {/* Value cards */}
      <Section>
        <SectionTitle
          title="Ready to discover your glow?"
          subtitle="Verified Glam Scanner turns a quick selfie into actionable beauty insights — scores you can understand, tips you can use, and results you can save."
        />
        <div className="grid sm:grid-cols-3 gap-5">
          {VALUE_CARDS.map((card) => (
            <div key={card.title} className="rounded-2xl bg-white border border-(--color-border) overflow-hidden text-center">
              <div className="relative aspect-[3/2]">
                <Image src={`/images/lifestyle/${card.image}`} alt={card.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="font-bold text-(--color-text)">{card.title}</p>
                <p className="mt-2 text-sm text-(--color-text-muted)">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-(--color-burgundy)">{stat.value}</p>
              <p className="text-sm text-(--color-text-muted) mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Feature rows */}
      <Section tint>
        <SectionTitle
          title="Everything you need to shine"
          subtitle="From core beauty scores to fun celebrity matches — explore what Verified Glam Scanner can do with one selfie."
        />
        <div className="space-y-10">
          {FEATURE_ROWS.map((row, i) => (
            <div key={row.title} className={`grid md:grid-cols-2 gap-6 items-center ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative rounded-2xl aspect-[3/2] overflow-hidden shadow-[0_16px_32px_rgba(135,43,63,0.1)]">
                <Image src={`/images/features/${row.image}`} alt={row.title} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xl font-bold text-(--color-burgundy-dark)">{row.title}</p>
                <p className="mt-2 text-(--color-text-muted) leading-relaxed">{row.description}</p>
                <Link href={row.href} className="mt-4 inline-block rounded-full bg-(--color-burgundy) text-white font-semibold px-6 py-2.5 hover:opacity-90">
                  {row.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <ReviewsSection items={REVIEWS} />
      <FaqSection items={FAQ} />

      {/* Final CTA */}
      <div className="py-16 px-4 sm:px-6 text-center text-white" style={{ background: "#520D1C" }}>
        <h2 className="text-2xl sm:text-3xl font-extrabold">Download Verified Glam Scanner</h2>
        <p className="mt-3 text-white/80 max-w-xl mx-auto">
          Get AI beauty insights on Android — or log in on the web to upload a photo and sync your scan history.
        </p>
        <div className="mt-7 flex flex-wrap justify-center items-center gap-4">
          <GooglePlayBadge />
          <Link href="/register" className="rounded-full border border-white/50 font-semibold px-7 py-3.5">
            Create free account
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/60">Package: com.verifiedglam.beauty_scanner &middot; Questions? support@verifiedglam.com</p>
      </div>
    </MarketingLayout>
  );
}
