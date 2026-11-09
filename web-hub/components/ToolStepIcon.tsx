import { ToolGlyph } from "./ProductIcons";

export function ToolStepIcon({ stage, slug }: { stage: number; slug: string }) {
  if (stage === 0) return <svg width="29" height="29" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="5" width="24" height="19" rx="2.5" /><path d="M8 18l5-5 4 4 3-3 4 4M10 9h.1M16 27v-7m-3 3 3-3 3 3" /></svg>;
  if (stage === 1) return <ToolGlyph slug={slug} size={29} />;
  return <svg width="29" height="29" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="3" width="22" height="19" rx="2.5" /><path d="M10 17l4-4 3 3 4-5 2 3m-7 7v8m-3-3 3 3 3-3" /></svg>;
}
