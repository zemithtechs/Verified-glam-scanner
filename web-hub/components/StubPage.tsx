import { MarketingShell } from "./SiteChrome";
import { Container } from "./ui";

/** Placeholder for pages that already exist on the live site and will be ported as-is (privacy, terms, etc.). */
export function StubPage({ title, note }: { title: string; note: string }) {
  return (
    <MarketingShell>
      <Container className="max-w-3xl py-20">
        <h1 className="font-display text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 rounded-2xl border border-dashed border-berry/40 bg-white p-5 text-muted">{note}</p>
      </Container>
    </MarketingShell>
  );
}
