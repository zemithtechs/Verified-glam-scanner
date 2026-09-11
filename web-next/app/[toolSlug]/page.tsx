import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { isSignedIn } from "@/lib/is-signed-in";
import { toolForSlug } from "@/lib/tools";
import type { FeatureType, ToolDefinition } from "@/lib/tools";
import { landingContentForFeature } from "@/lib/tool-landing-content";
import type { ToolLandingContent } from "@/lib/tool-landing-types";
import { TOOL_SEO } from "@/lib/tool-seo";
import { SITE_URL } from "@/lib/site";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { MarketingAnalyzeUpload } from "@/components/marketing/MarketingAnalyzeUpload";
import { ToolDimensionExplorer } from "@/components/marketing/ToolDimensionExplorer";
import { FaqJsonLd, BreadcrumbJsonLd, SoftwareToolJsonLd } from "@/components/seo/JsonLd";

type VisualConfig = {
  score: string;
  scoreLabel: string;
  resultTitle: string;
  primaryMetric: string;
  secondaryMetric: string;
  dimensions: string[];
};

const FEATURE_VISUALS: Record<FeatureType, VisualConfig> = {
  FACE_BEAUTY_ANALYSIS: {
    score: "94",
    scoreLabel: "Beauty Score",
    resultTitle: "Exceptionally charming",
    primaryMetric: "Beauty",
    secondaryMetric: "Attractiveness",
    dimensions: ["Beauty", "Symmetry", "Eyes", "Lips", "Face shape", "Photo score"],
  },
  COLOR_ANALYSIS: {
    score: "Warm",
    scoreLabel: "Palette",
    resultTitle: "Soft warm palette",
    primaryMetric: "Undertone",
    secondaryMetric: "Contrast",
    dimensions: ["Palette", "Undertone", "Makeup", "Hair", "Wardrobe", "Jewelry"],
  },
  GLOW_UP_GUIDE: {
    score: "21",
    scoreLabel: "Day Plan",
    resultTitle: "Routine ready",
    primaryMetric: "Daily habits",
    secondaryMetric: "Progress",
    dimensions: ["Routine", "Skin", "Habits", "Milestones", "Glow up", "Tips"],
  },
  BEAUTY_TIPS: {
    score: "18",
    scoreLabel: "Tips",
    resultTitle: "Personalized ideas",
    primaryMetric: "Makeup",
    secondaryMetric: "Skincare",
    dimensions: ["Makeup", "Skincare", "Brows", "Lips", "Hair", "Photos"],
  },
  CELEBRITY_LOOKALIKE: {
    score: "89",
    scoreLabel: "Match",
    resultTitle: "Strong resemblance",
    primaryMetric: "Top match",
    secondaryMetric: "Shared traits",
    dimensions: ["Matches", "Eyes", "Jawline", "Smile", "Style", "Similarity"],
  },
  FACIAL_SYMMETRY: {
    score: "91",
    scoreLabel: "Symmetry",
    resultTitle: "Balanced face map",
    primaryMetric: "Left to right",
    secondaryMetric: "Face balance",
    dimensions: ["Symmetry", "Eyes", "Brows", "Nose", "Jawline", "Mouth"],
  },
  BEAUTY_SCORE_SHOWDOWN: {
    score: "Top 5",
    scoreLabel: "Rank",
    resultTitle: "Showdown ready",
    primaryMetric: "Winners",
    secondaryMetric: "Category score",
    dimensions: ["Scores", "Winners", "Eyes", "Smile", "Share", "Challenge"],
  },
  FACIAL_RESEMBLANCE: {
    score: "82%",
    scoreLabel: "Similarity",
    resultTitle: "Shared features found",
    primaryMetric: "Shared traits",
    secondaryMetric: "Differences",
    dimensions: ["Compare", "Similarity", "Eyes", "Nose", "Jawline", "Face shape"],
  },
  FACE_READING: {
    score: "90",
    scoreLabel: "Rating",
    resultTitle: "Very photogenic",
    primaryMetric: "Harmony",
    secondaryMetric: "Style notes",
    dimensions: ["Score", "Features", "Balance", "Style", "Confidence", "Tips"],
  },
  GOLDEN_RATIO: {
    score: "1.61",
    scoreLabel: "Phi",
    resultTitle: "Classical harmony",
    primaryMetric: "Facial thirds",
    secondaryMetric: "Phi ratio",
    dimensions: ["Ratio", "Thirds", "Fifths", "Harmony", "Angles", "Map"],
  },
};

const IMAGE_TYPES = [
  {
    title: "Portrait photos",
    description: "Use a centered, front-facing photo for the cleanest read on your features.",
  },
  {
    title: "Fresh selfies",
    description: "A recent selfie helps your result match how you look today.",
  },
  {
    title: "Natural lighting",
    description: "Soft daylight keeps color, shape, and facial landmarks easier to detect.",
  },
  {
    title: "Before and after",
    description: "Compare scans after a new hairstyle, makeup look, or routine change.",
  },
  {
    title: "Creator content",
    description: "Use the report to plan photo angles, styling ideas, and shareable beauty content.",
  },
  {
    title: "Style planning",
    description: "Turn your result into better choices for makeup, hair framing, and colors.",
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ toolSlug: string }>;
}): Promise<Metadata> {
  const { toolSlug } = await params;
  const tool = toolForSlug(toolSlug);
  if (!tool) return {};
  const seo = TOOL_SEO[tool.featureType];
  const image = `/images/landings/${tool.slug}/showcase-1.jpg`;
  return {
    title: seo.pageTitle,
    description: seo.metaDescription,
    alternates: { canonical: `${SITE_URL}/${tool.slug}` },
    openGraph: {
      title: seo.pageTitle,
      description: seo.metaDescription,
      url: `${SITE_URL}/${tool.slug}`,
      images: [{ url: image, width: 1536, height: 1024, alt: tool.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.pageTitle,
      description: seo.metaDescription,
      images: [image],
    },
  };
}

export default async function ToolLandingPage({ params }: { params: Promise<{ toolSlug: string }> }) {
  const { toolSlug } = await params;
  const tool = toolForSlug(toolSlug);
  if (!tool) notFound();

  const content = landingContentForFeature(tool.featureType);
  const seo = TOOL_SEO[tool.featureType];
  const visual = FEATURE_VISUALS[tool.featureType];
  const signedIn = await isSignedIn();

  return (
    <MarketingLayout>
      <SoftwareToolJsonLd name={tool.title} description={seo.metaDescription} path={`/${tool.slug}`} isPro={tool.isPro} />
      <FaqJsonLd items={content.faq} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: tool.title, path: `/${tool.slug}` },
        ]}
      />

      <HeroSection tool={tool} content={content} visual={visual} signedIn={signedIn} />
      <HowToSection tool={tool} content={content} />
      <IntroSection tool={tool} content={content} visual={visual} />
      <FeatureSections tool={tool} content={content} visual={visual} />
      <DimensionsSection tool={tool} content={content} visual={visual} />
      <MakeTheMostSection tool={tool} visual={visual} />
      <ImageTypesSection tool={tool} />
      <ExpectationsSection tool={tool} />
      <FaqSection content={content} />
      <FinalCta tool={tool} />
    </MarketingLayout>
  );
}

function ExpectationsSection({ tool }: { tool: ToolDefinition }) {
  return (
    <section className="bg-(--color-surface) px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-[1040px]">
        <SectionIntro
          title={`A better ${tool.title.toLowerCase()} experience starts with context`}
          subtitle="Clear expectations make the result easier to use well, whether you are exploring a new look or planning your next photo."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <article className="vg-reveal rounded-[18px] border border-(--color-border) bg-white p-6 shadow-[0_14px_34px_rgba(82,13,28,0.06)]">
            <h2 className="text-lg font-extrabold text-(--color-burgundy-dark)">Your photo is one moment, not your whole appearance</h2>
            <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
              Every result comes from one selected photo. Light, expression, camera distance, hair, makeup, and framing all affect what a camera shows. That is why a report can change when you choose a different image. Treat it as feedback on the picture in front of you, not a permanent label about how you look in real life.
            </p>
          </article>
          <article className="vg-reveal rounded-[18px] border border-(--color-border) bg-white p-6 shadow-[0_14px_34px_rgba(82,13,28,0.06)]">
            <h2 className="text-lg font-extrabold text-(--color-burgundy-dark)">Use the suggestions as creative options</h2>
            <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
              A suggestion can be a useful prompt for a lipstick shade, hairstyle, photo angle, or makeup placement, but it is never an instruction you have to follow. Keep the ideas that feel exciting and natural to you. Your own preferences, culture, budget, and comfort should always guide the final choice.
            </p>
          </article>
          <article className="vg-reveal rounded-[18px] border border-(--color-border) bg-white p-6 shadow-[0_14px_34px_rgba(82,13,28,0.06)]">
            <h2 className="text-lg font-extrabold text-(--color-burgundy-dark)">Choose simple input for a clearer result</h2>
            <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
              Start with a recent, clear image where your face is visible and comfortably lit. You do not need a studio portrait, expensive products, or an edited selfie. A straightforward image makes the result easier to understand and gives you a reliable baseline if you return later to explore another style or photo setup.
            </p>
          </article>
          <article className="vg-reveal rounded-[18px] border border-(--color-border) bg-white p-6 shadow-[0_14px_34px_rgba(82,13,28,0.06)]">
            <h2 className="text-lg font-extrabold text-(--color-burgundy-dark)">Know when a photo tool is not the right answer</h2>
            <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
              Verified Glam - Beauty Scanner provides cosmetic, styling, and entertainment guidance. It does not diagnose skin conditions, assess health, identify people, or replace a dermatologist, stylist, or other qualified professional. If you have a medical concern or a product reaction, seek professional advice rather than relying on an image analysis result.
            </p>
          </article>
        </div>
        <p className="mx-auto mt-7 max-w-3xl text-center text-sm leading-6 text-(--color-text-muted)">
          If you try a new look after your scan, return when you are ready and compare it with a similarly lit photo. That is a more useful way to learn from a report than chasing one number. Over time, you can build a small personal reference of the colors, angles, routines, and details that make you feel comfortable, prepared, and recognizably yourself.
          Your result should support a choice you already want to explore, never create pressure to become someone else.
        </p>
      </div>
    </section>
  );
}

function HeroSection({
  tool,
  content,
  visual,
  signedIn,
}: {
  tool: ToolDefinition;
  content: ToolLandingContent;
  visual: VisualConfig;
  signedIn: boolean;
}) {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[1120px]">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-[-0.035em] text-(--color-burgundy-dark) sm:text-5xl lg:text-[58px]">
            {content.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-(--color-text-muted) sm:text-lg">{content.subheadline}</p>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-start">
          <ResultPreview tool={tool} visual={visual} />
          <MarketingAnalyzeUpload tool={tool} isSignedIn={signedIn} dimensions={visual.dimensions.slice(0, 6)} />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {content.whyChoose.slice(0, 3).map((item) => (
            <div key={item.title} className="rounded-[16px] border border-(--color-border) bg-(--color-surface) px-5 py-4">
              <p className="text-sm font-extrabold text-(--color-burgundy-dark)">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-(--color-text-muted)">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultPreview({ tool, visual }: { tool: ToolDefinition; visual: VisualConfig }) {
  return (
    <div className="vg-reveal rounded-[22px] border border-(--color-border) bg-white p-4 shadow-[0_18px_45px_rgba(82,13,28,0.08)]">
      <div className="relative overflow-hidden rounded-[16px] bg-(--color-surface) aspect-[1.05/1]">
        <Image src={`/images/landings/${tool.slug}/showcase-1.jpg`} alt={`${tool.title} preview`} fill priority className="object-cover" sizes="(min-width: 1024px) 540px, 100vw" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--color-burgundy-dark)/12 via-transparent to-transparent" />
        <div className="absolute bottom-5 right-5 w-[150px] rounded-[14px] bg-white p-4 shadow-[0_18px_35px_rgba(82,13,28,0.16)]">
          <p className="text-xs font-bold text-(--color-text-muted)">{visual.scoreLabel}</p>
          <p className="mt-1 text-[42px] font-extrabold leading-none tracking-[-0.05em] text-(--color-burgundy)">{visual.score}</p>
          <p className="mt-1 text-xs font-bold text-(--color-burgundy-dark)">{visual.resultTitle}</p>
          <MetricLine label={visual.primaryMetric} value="92%" />
        </div>
      </div>
    </div>
  );
}

function HowToSection({ tool, content }: { tool: ToolDefinition; content: ToolLandingContent }) {
  return (
    <section className="bg-white px-4 py-14 sm:px-6">
      <SectionIntro title={`How to use ${tool.title} online`} subtitle="Upload a photo, choose the scan, and continue in the secure app workspace before any analysis runs." />
      <div className="mx-auto grid max-w-[1040px] gap-5 md:grid-cols-3">
        {content.howTo.map((step, index) => (
          <div key={step.title} className="vg-reveal rounded-[18px] border border-(--color-border) bg-white p-4 shadow-[0_14px_34px_rgba(82,13,28,0.07)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-(--color-surface)">
              <Image src={`/images/landings/${tool.slug}/showcase-${index + 1}.jpg`} alt={step.title} fill className="object-cover" sizes="(min-width: 768px) 320px, 100vw" />
              <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-extrabold text-(--color-burgundy)">
                {index + 1}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-(--color-burgundy-dark)">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-(--color-text-muted)">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntroSection({ tool, content, visual }: { tool: ToolDefinition; content: ToolLandingContent; visual: VisualConfig }) {
  return (
    <section className="bg-(--color-surface) px-4 py-14 sm:px-6">
      <div className="mx-auto grid max-w-[1040px] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="vg-reveal">
          <h2 className="text-3xl font-extrabold tracking-[-0.035em] text-(--color-burgundy-dark) sm:text-4xl">
            Get to know your {tool.title.toLowerCase()} result
          </h2>
          <p className="mt-4 text-base leading-relaxed text-(--color-text-muted)">{content.showcase[0].description}</p>
          <ul className="mt-5 space-y-3">
            {content.whyChoose.map((item) => (
              <li key={item.title} className="flex gap-3 text-sm leading-relaxed text-(--color-text-muted)">
                <CheckCircle2 className="mt-0.5 shrink-0 text-(--color-burgundy)" size={18} />
                <span>
                  <strong className="text-(--color-burgundy-dark)">{item.title}:</strong> {item.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <ReportCard tool={tool} visual={visual} imageIndex={2} />
      </div>
    </section>
  );
}

function FeatureSections({ tool, content, visual }: { tool: ToolDefinition; content: ToolLandingContent; visual: VisualConfig }) {
  return (
    <section className="bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-[1040px] space-y-10">
        {content.showcase.slice(1, 4).map((item, index) => (
          <div key={item.title} className={`grid gap-8 lg:grid-cols-2 lg:items-center ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <ReportCard tool={tool} visual={visual} imageIndex={index + 2} compact />
            <div className="vg-reveal">
              <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark) sm:text-3xl">{item.title}</h2>
              <p className="mt-4 text-base leading-relaxed text-(--color-text-muted)">{item.description}</p>
              <ul className="mt-5 space-y-3 border-l border-(--color-border) pl-4">
                {content.guide[index + 1].points.map((point) => (
                  <li key={point.title} className="text-sm leading-relaxed text-(--color-text-muted)">
                    <strong className="text-(--color-burgundy-dark)">{point.title}:</strong> {point.description}
                  </li>
                ))}
              </ul>
              <Link href={tool.isPro ? "/pricing" : `/app/${tool.slug}`} className="mt-5 inline-flex items-center gap-2 rounded-[12px] bg-(--color-burgundy) px-5 py-3 text-sm font-extrabold text-white hover:bg-(--color-burgundy-dark)">
                Try this tool
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MakeTheMostSection({ tool, visual }: { tool: ToolDefinition; visual: VisualConfig }) {
  const [primary, secondary, ...otherDimensions] = visual.dimensions;
  return (
    <section className="bg-white px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-[1040px]">
        <SectionIntro
          title={`Make the most of your ${tool.title.toLowerCase()} report`}
          subtitle="Use the result as a practical reference for a choice you want to make, then return with a comparable photo when you want to test a new look."
        />
        <div className="grid gap-5 md:grid-cols-3">
          <article className="vg-reveal rounded-[18px] border border-(--color-border) bg-(--color-surface) p-6">
            <h2 className="text-lg font-extrabold text-(--color-burgundy-dark)">Read the details before the score</h2>
            <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
              The score is a quick summary. The more useful part is the breakdown around {primary.toLowerCase()}, {secondary.toLowerCase()}, and {otherDimensions.slice(0, 2).join(", ").toLowerCase()}. Those details show what the report noticed in this particular image and give you a clearer place to start.
            </p>
          </article>
          <article className="vg-reveal rounded-[18px] border border-(--color-border) bg-white p-6 shadow-[0_14px_34px_rgba(82,13,28,0.06)]">
            <h2 className="text-lg font-extrabold text-(--color-burgundy-dark)">Choose one idea to try</h2>
            <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
              A report becomes useful when it leads to one comfortable next step. You might test a new photo angle, a makeup placement, a color direction, or a hair-framing choice. Making one change at a time helps you see what you genuinely like, without turning your routine into a checklist.
            </p>
          </article>
          <article className="vg-reveal rounded-[18px] border border-(--color-border) bg-(--color-surface) p-6">
            <h2 className="text-lg font-extrabold text-(--color-burgundy-dark)">Return with a comparable photo</h2>
            <p className="mt-3 text-sm leading-6 text-(--color-text-muted)">
              If you scan again, use similar daylight, camera height, and distance. This makes it easier to understand whether a styling experiment changed the photo rather than simply changing the input conditions. Keep the results that support your confidence and leave behind anything that does not.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function DimensionsSection({ tool, content, visual }: { tool: ToolDefinition; content: ToolLandingContent; visual: VisualConfig }) {
  return (
    <section className="bg-white px-4 py-14 sm:px-6">
      <SectionIntro title={`${tool.title} dimensions`} subtitle="Select a dimension to see what that part of the report is designed to explain." />
      <div className="mx-auto max-w-[1040px]">
        <ToolDimensionExplorer tool={tool} dimensions={visual.dimensions} score={visual.score} scoreLabel={visual.scoreLabel} description={content.showcase[1].description} />
      </div>
    </section>
  );
}

function ImageTypesSection({ tool }: { tool: ToolDefinition }) {
  return (
    <section className="bg-(--color-surface) px-4 py-14 sm:px-6">
      <SectionIntro title={`Use ${tool.title} for different photo goals`} subtitle="A better scan starts with the right image. These common use cases help users choose what to upload." />
      <div className="mx-auto grid max-w-[1040px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {IMAGE_TYPES.map((item, index) => (
          <div key={item.title} className="vg-reveal rounded-[18px] border border-(--color-border) bg-white p-4 shadow-[0_14px_34px_rgba(82,13,28,0.07)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-(--color-surface)">
              <Image src={`/images/landings/${tool.slug}/showcase-${(index % 4) + 1}.jpg`} alt={item.title} fill className="object-cover" sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw" />
            </div>
            <h2 className="mt-4 text-lg font-extrabold text-(--color-burgundy-dark)">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-(--color-text-muted)">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ content }: { content: ToolLandingContent }) {
  return (
    <section className="bg-white px-4 py-14 sm:px-6">
      <SectionIntro title="Frequently asked questions" subtitle="Quick answers before you upload your photo." />
      <div className="mx-auto max-w-[900px] divide-y divide-(--color-border) border-y border-(--color-border)">
        {content.faq.map((item) => (
          <details key={item.question} className="group py-5">
            <summary className="cursor-pointer list-none text-base font-extrabold text-(--color-burgundy-dark)">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-xl text-(--color-burgundy) transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-(--color-text-muted)">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta({ tool }: { tool: ToolDefinition }) {
  return (
    <section className="bg-white px-4 pb-16 sm:px-6">
      <div className="mx-auto max-w-[1040px] rounded-[22px] bg-(--color-burgundy-dark) px-6 py-10 text-center text-white sm:px-10">
        <h2 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Discover your result with Verified Glam</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
          Upload a clear photo, sign in, and continue to your secure analysis workspace.
        </p>
        <Link href={`/app/${tool.slug}`} className="mt-6 inline-flex items-center gap-2 rounded-[12px] bg-white px-6 py-3 text-sm font-extrabold text-(--color-burgundy-dark) hover:bg-(--color-blush)">
          Start your scan
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function ReportCard({ tool, visual, imageIndex, compact = false }: { tool: ToolDefinition; visual: VisualConfig; imageIndex: number; compact?: boolean }) {
  return (
    <div className={`vg-reveal rounded-[20px] border border-(--color-border) bg-white p-4 shadow-[0_16px_38px_rgba(82,13,28,0.08)] ${compact ? "" : "lg:max-w-[420px] lg:justify-self-center"}`}>
      <div className="relative overflow-hidden rounded-[16px] bg-(--color-surface) aspect-[4/3]">
        <Image src={`/images/landings/${tool.slug}/showcase-${imageIndex}.jpg`} alt={`${tool.title} report sample`} fill className="object-cover" sizes="(min-width: 1024px) 460px, 100vw" />
      </div>
      <div className="mt-4 rounded-[14px] bg-(--color-surface) p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-(--color-text-muted)">{visual.scoreLabel}</p>
            <p className="mt-1 text-4xl font-extrabold leading-none tracking-[-0.05em] text-(--color-burgundy)">{visual.score}</p>
            <p className="mt-1 text-sm font-bold text-(--color-burgundy-dark)">{visual.resultTitle}</p>
          </div>
          <ShieldCheck className="text-(--color-burgundy)" size={24} />
        </div>
        <MetricLine label={visual.primaryMetric} value="92%" />
        <MetricLine label={visual.secondaryMetric} value="88%" />
      </div>
    </div>
  );
}

function SectionIntro({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto mb-9 max-w-3xl text-center">
      <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark) sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-(--color-text-muted) sm:text-base">{subtitle}</p>
    </div>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs font-bold text-(--color-text-muted)">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-(--color-burgundy)" style={{ width: value }} />
      </div>
    </div>
  );
}
