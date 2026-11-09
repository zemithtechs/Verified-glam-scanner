import Link from "next/link";
import { MarketingShell } from "./SiteChrome";
import { Container } from "./ui";
import type { LegalPageContent } from "@/lib/legal-content";

/** Turns the policy's internal references into links. */
function linkify(text: string) {
  return text.split(/(Privacy Policy|scanner\.verifiedglam\.com\/delete-account)/g).map((part, i) => {
    const href = part === "Privacy Policy" ? "/privacy" : part === "scanner.verifiedglam.com/delete-account" ? "/delete-account" : null;
    return href ? <Link key={i} href={href} className="font-semibold text-plum underline underline-offset-4">{part}</Link> : part;
  });
}

export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <MarketingShell>
      <section className="hero-glow border-b border-line">
        <Container className="max-w-3xl py-12 sm:py-16">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{content.h1}</h1>
          <p className="mt-3 text-muted">{content.metaLine}</p>
        </Container>
      </section>
      <Container className="max-w-3xl py-10 sm:py-14">
        <div className="space-y-5 text-[16px] leading-7 text-ink">
          {content.blocks.map((block, i) => {
            if (block.type === "heading") return <h2 key={i} className="pt-6 font-display text-2xl font-semibold text-plum">{block.text}</h2>;
            if (block.type === "paragraph") return <p key={i}>{block.lines.map((line, j) => <span key={j}>{linkify(line)}{j < block.lines.length - 1 && <br />}</span>)}</p>;
            if (block.type === "bullets") return <ul key={i} className="list-disc space-y-2 pl-6">{block.items.map((item) => <li key={item}>{linkify(item)}</li>)}</ul>;
            return <ol key={i} className="list-decimal space-y-2 pl-6">{block.items.map((item) => <li key={item}>{linkify(item)}</li>)}</ol>;
          })}
        </div>
      </Container>
    </MarketingShell>
  );
}
