import { SITE_URL, SITE_NAME } from "@/lib/site";

/**
 * JSON-LD structured data — this is what AI Overviews, ChatGPT, Perplexity,
 * and other LLM-backed search tools actually parse to understand and cite
 * a page (on top of the plain readable text), not just classic Google
 * search. Rendered as inline <script> tags, one schema type per component
 * so pages compose only what applies to them.
 */
function JsonLdScript({ data }: { data: object }) {
  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "Verified Glam",
            url: "https://verifiedglam.com",
            logo: `${SITE_URL}/images/logo.png`,
            email: "support@verifiedglam.com",
            sameAs: ["https://play.google.com/store/apps/details?id=com.verifiedglam.beauty_scanner"],
          },
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            name: SITE_NAME,
            url: SITE_URL,
            publisher: { "@id": `${SITE_URL}/#organization` },
            potentialAction: {
              "@type": "SearchAction",
              target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/tools?q={search_term_string}` },
              "query-input": "required name=search_term_string",
            },
          },
        ],
      }}
    />
  );
}

export function SoftwareApplicationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Android, Web",
        url: SITE_URL,
        description:
          "AI-powered beauty analysis from a selfie: face beauty scoring, facial symmetry, seasonal color palette, celebrity look-alike, and more.",
        offers: [
          { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
          { "@type": "Offer", name: "Yearly Plan", price: "39.99", priceCurrency: "USD" },
          { "@type": "Offer", name: "Pro Plan (weekly)", price: "3.99", priceCurrency: "USD" },
        ],
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "127" },
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${SITE_URL}${item.path}`,
        })),
      }}
    />
  );
}

export function SoftwareToolJsonLd({
  name,
  description,
  path,
  isPro,
}: {
  name: string;
  description: string;
  path: string;
  isPro: boolean;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: `${name} — ${SITE_NAME}`,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        url: `${SITE_URL}${path}`,
        description,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        offers: { "@type": "Offer", price: isPro ? "3.99" : "0", priceCurrency: "USD" },
      }}
    />
  );
}
