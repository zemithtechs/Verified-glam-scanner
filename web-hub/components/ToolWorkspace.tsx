"use client";

import { useEffect, useRef, useState } from "react";
import { Download, LoaderCircle, WandSparkles } from "lucide-react";
import { UploadDemo, type WorkspaceState } from "./UploadDemo";
import { ResultGallery } from "./ResultGallery";
import type { Tool } from "@/lib/catalog";
import { titleCase } from "@/lib/title-case";

export function ToolWorkspace({ tool, title, lead, images, alts }: { tool: Tool; title: string; lead: string; images: string[]; alts?: string[] }) {
  const [state, setState] = useState<WorkspaceState>({ originals: [], busy: false, result: null, error: "", attempted: false });
  const preview = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.attempted && window.matchMedia("(max-width: 1023px)").matches) {
      preview.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [state.attempted]);

  return <section id="tool-workspace" aria-label={`${tool.name} workspace`} className="grid scroll-mt-20 gap-3 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
    <div className="rounded-lg border border-line bg-white p-5 sm:p-6 lg:p-5">
      <div className="mb-5 flex items-center gap-2.5 border-b border-line pb-4 text-sm font-semibold text-ink"><WandSparkles size={18} className="shrink-0 text-plum" aria-hidden="true" />{tool.name}</div>
      <UploadDemo toolSlug={tool.slug} toolName={tool.name} credits={tool.credits} exampleSrc={images[0]} onWorkspaceChange={setState} />
    </div>
    <div ref={preview} className="min-w-0 scroll-mt-20 rounded-lg border border-line bg-white px-4 py-7 sm:px-6 sm:py-8">
      <h1 className="mx-auto max-w-3xl text-center text-[32px] font-extrabold leading-[1.1] tracking-[-0.055em] text-ink sm:text-[44px]">{titleCase(title)}</h1>
      <p className="mx-auto mt-4 max-w-[680px] text-center text-sm leading-6 text-muted">{lead}</p>
      {!state.attempted ? <ResultGallery images={images} alts={alts} toolName={tool.name} /> : <section aria-label="Your generated result" aria-busy={state.busy} className="mt-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <h2 className="text-sm font-semibold text-ink">{titleCase("Your workspace")}</h2>
          <p role="status" className="text-xs font-medium text-plum">{state.busy ? "Processing your photo…" : state.result ? "Your result is ready" : "No result generated"}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <figure className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-line bg-[#f5f4f5]">
            <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-2 p-2 sm:min-h-80">{state.originals.map((src, index) => <img key={src} src={src} alt={`Original upload ${index + 1}`} className="max-h-80 w-full object-contain" />)}</div>
            <figcaption className="border-t border-line bg-white px-3 py-3 text-center text-xs font-medium text-muted">{state.originals.length > 1 ? "Original images" : "Original image"}</figcaption>
          </figure>
          <figure className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-line bg-[#f5f4f5]">
            <div className="flex min-h-64 flex-1 items-center justify-center p-2 sm:min-h-80">
              {state.result ? <a href={state.result} target="_blank" rel="noreferrer" aria-label="Open your generated result at full size" className="w-full"><img src={state.result} alt={`Your generated ${tool.name} result`} className="max-h-[480px] w-full object-contain" /></a> : <div className="max-w-xs p-5 text-center">{state.busy && <LoaderCircle size={28} className="mx-auto mb-4 animate-spin text-plum motion-reduce:animate-none" />}<p className="text-sm font-medium text-ink">{state.busy ? "Creating your result" : "Your result will appear here"}</p><p className="mt-2 text-xs leading-5 text-muted">{state.busy ? "This can take a few minutes. Keep this page open." : "Review the message below, then generate again using the upload panel."}</p></div>}
            </div>
            <figcaption className="border-t border-line bg-white px-3 py-3 text-center text-xs font-medium text-muted">Result image</figcaption>
          </figure>
        </div>
        {state.error && <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">{state.error}</p>}
        {state.result && <><a href={state.result} download={`${tool.slug}-result.png`} className="tool-primary-button mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-plum px-5 py-3 text-sm font-semibold text-white"><Download size={18} />Download result</a><p className="mt-3 text-center text-xs leading-5 text-muted">One complete PNG · AI-generated · Download before leaving this page.</p></>}
      </section>}
    </div>
  </section>;
}
