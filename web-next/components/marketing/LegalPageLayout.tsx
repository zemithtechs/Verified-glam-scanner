import Link from "next/link";
import { MarketingLayout } from "./MarketingLayout";
import type { LegalPageContent } from "@/lib/legal-content";

function linkifyPrivacy(text: string) {
  const parts = text.split(/(Privacy Policy|scanner\.verifiedglam\.com\/delete-account)/g);
  return parts.map((part, i) => {
    const href = part === "Privacy Policy" ? "/privacy" : part === "scanner.verifiedglam.com/delete-account" ? "/delete-account" : null;
    return href ? (
      <Link key={i} href={href} className="text-(--color-burgundy) font-semibold">
        {part}
      </Link>
    ) : (
      part
    );
  });
}

export function LegalPageLayout({ content }: { content: LegalPageContent }) {
  return (
    <MarketingLayout>
      <div className="max-w-3xl mx-auto py-14 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-(--color-burgundy-dark)">{content.h1}</h1>
        <p className="mt-2 text-(--color-text-muted)">{content.metaLine}</p>

        <div className="mt-8 space-y-5 text-(--color-text) leading-relaxed">
          {content.blocks.map((block, i) => {
            if (block.type === "heading") {
              return (
                <h2 key={i} className="text-xl font-bold text-(--color-burgundy-dark) pt-4">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "paragraph") {
              return (
                <p key={i}>
                  {block.lines.map((line, j) => (
                    <span key={j}>
                      {linkifyPrivacy(line)}
                      {j < block.lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              );
            }
            if (block.type === "bullets") {
              return (
                <ul key={i} className="list-disc pl-5 space-y-1.5">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <ol key={i} className="list-decimal pl-5 space-y-1.5">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          })}
        </div>
      </div>
    </MarketingLayout>
  );
}
