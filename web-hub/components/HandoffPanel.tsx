import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { Tool } from "@/lib/catalog";
import { RUNNABLE_IN_APP, appSignUpUrl, appToolUrl } from "@/lib/live-mode";

/** Replaces the in-page generator on the deployed site: sends people to the app that already processes photos. */
export function HandoffPanel({ tool }: { tool: Tool }) {
  const runnable = RUNNABLE_IN_APP.has(tool.slug);
  return (
    <div className="space-y-4">
      {runnable ? (
        <>
          <div className="rounded-lg border border-line bg-cream p-4">
            <p className="text-[15px] font-semibold text-ink">Run {tool.name} in the app</p>
            <p className="mt-1.5 text-sm leading-6 text-muted">Upload your photo, get your result and download it. A free account is all you need to start.</p>
          </div>
          <a href={appToolUrl(tool.slug)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-plum px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink">Open {tool.name}<ArrowRight size={16} aria-hidden="true" /></a>
          <a href={appSignUpUrl} className="flex min-h-10 items-center justify-center text-sm font-semibold text-plum underline underline-offset-4">Create a free account</a>
        </>
      ) : (
        <>
          <div className="rounded-lg border border-line bg-cream p-4">
            <p className="text-[15px] font-semibold text-ink">{tool.name} opens soon</p>
            <p className="mt-1.5 text-sm leading-6 text-muted">This tool is not ready to run yet. Explore the examples on this page, or try one of the tools that is available now.</p>
          </div>
          <Link href="/tools" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-plum px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink">Browse available tools<ArrowRight size={16} aria-hidden="true" /></Link>
        </>
      )}
      <p className="flex items-start gap-2 text-[11px] leading-5 text-muted"><ShieldCheck size={14} className="mt-0.5 shrink-0" aria-hidden="true" /><span>For adults 18 and older. Only use photos you own or have permission to use. Results are for entertainment and self-discovery.</span></p>
    </div>
  );
}
