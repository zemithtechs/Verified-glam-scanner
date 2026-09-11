"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Check, ImageIcon, Loader2, Lock, Sparkles, UploadCloud, UsersRound, X } from "lucide-react";
import { proxyApi, ClientApiError } from "@/lib/client-api";
import type { ToolDefinition } from "@/lib/tools";
import type { Profile } from "@/lib/types";
import { UpgradeModal } from "@/components/UpgradeModal";
import { ResultView } from "@/components/results/ResultView";
import { ReportActions } from "@/components/results/shared/ReportActions";
import { summarizeForShare } from "@/components/results/shared/summarize";
import { ScanningOverlay } from "@/components/results/shared/ScanningOverlay";

type AnalyzeResponse = { payload: Record<string, unknown>; version: string; creditsRemaining?: number };

export function ToolWorkspace({ tool, profile }: { tool: ToolDefinition; profile?: Profile }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsPro, setNeedsPro] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const isComparison = tool.slug === "face-comparison";

  useEffect(() => {
    const key = `vg_pending_upload_${tool.slug}`;
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return;
    try {
      const pending = JSON.parse(raw) as { name?: string; type?: string; dataUrl?: string; savedAt?: number };
      const isFresh = typeof pending.savedAt === "number" && Date.now() - pending.savedAt < 60 * 60 * 1000;
      if (!pending.dataUrl || !isFresh) { window.sessionStorage.removeItem(key); return; }
      const timer = window.setTimeout(() => {
        const restored = fileFromDataUrl(pending.dataUrl!, pending.name || "verified-glam-upload.jpg", pending.type || "image/jpeg");
        setFile(restored);
        setPreviewUrl(URL.createObjectURL(restored));
        setResult(null);
        setError(null);
      }, 0);
      window.sessionStorage.removeItem(key);
      return () => window.clearTimeout(timer);
    } catch { window.sessionStorage.removeItem(key); }
  }, [tool.slug]);

  function selectFile(selected?: File) {
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) { selectFile(event.target.files?.[0]); }

  function handleRetake() {
    setResult(null);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  }

  async function handleAnalyze() {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    setNeedsPro(false);
    try {
      const scanId = crypto.randomUUID();
      await proxyApi.put(`/scans/${scanId}`, { featureType: tool.featureType, featureTitle: tool.title });
      const bytes = await file.arrayBuffer();
      const { storagePath } = await proxyApi.postBinary<{ storagePath: string }>(`/scans/${scanId}/photo`, bytes, file.type || "image/jpeg");
      let analyzeResult: AnalyzeResponse;
      try {
        analyzeResult = await proxyApi.post<AnalyzeResponse>("/analyze", { featureType: tool.featureType, storagePath });
      } catch (caught) {
        if (!(caught instanceof ClientApiError) || caught.errorCode !== "REWARD_REQUIRED") throw caught;
        const { rewardToken } = await proxyApi.post<{ rewardToken: string }>("/ads/reward", { featureType: tool.featureType });
        analyzeResult = await proxyApi.post<AnalyzeResponse>("/analyze", { featureType: tool.featureType, storagePath, rewardToken });
      }
      setResult(analyzeResult);
      // The credits badge in TopBar/Sidebar comes from a profile fetched once
      // by the persistent /app layout — it won't reflect this deduction until
      // the layout's server component re-runs, which router.refresh() forces.
      router.refresh();
    } catch (caught) {
      if (caught instanceof ClientApiError && caught.errorCode === "NOT_SUBSCRIBED") setNeedsPro(true);
      else setError(caught instanceof ClientApiError ? caught.message : "Something went wrong. Please try again.");
    } finally { setAnalyzing(false); }
  }

  return (
    <div className="mx-auto max-w-[1240px] p-4 sm:p-6 lg:p-9">
      <div className="flex flex-col gap-5 border-b border-(--color-border) pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--color-burgundy)">Analysis workspace</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-(--color-burgundy-dark) sm:text-4xl">{tool.title}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-(--color-text-muted)">{isComparison ? "Use one well-lit photo that includes two visible faces. Review the examples before you start." : "Add one clear, front-facing portrait, review the photo guidance, and start your private analysis when you are ready."}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-(--color-border) bg-white px-4 py-2 text-sm font-bold text-(--color-burgundy-dark) shadow-sm"><Sparkles size={16} className="text-(--color-burgundy)" />1 analysis uses 5 credits</div>
      </div>

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[24px] border border-(--color-border) bg-white p-5 shadow-[0_16px_38px_rgba(82,13,28,0.07)] sm:p-7">
          <div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark)">Choose your photo</h2><p className="mt-1 text-sm text-(--color-text-muted)">JPG or PNG, up to 8 MB</p></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-blush) text-(--color-burgundy)"><ImageIcon size={20} /></span></div>
          <label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files?.[0]); }} className="group mt-6 flex min-h-[330px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[18px] border-2 border-dashed border-(--color-border) bg-(--color-surface) p-6 text-center transition-colors hover:border-(--color-burgundy) hover:bg-(--color-blush)/50">
            {previewUrl ? (
              <div className="relative inline-block">
                {/* Blob URLs from the user device cannot be optimized by next/image. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Selected preview" className="max-h-[285px] rounded-[14px] object-contain shadow-[0_12px_30px_rgba(82,13,28,0.12)]" />
                {analyzing && <ScanningOverlay />}
              </div>
            ) : <><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-(--color-burgundy) shadow-sm">{isComparison ? <UsersRound size={27} /> : <UploadCloud size={29} />}</span><span className="mt-1 font-extrabold text-(--color-burgundy-dark)">{isComparison ? "Upload a two-person photo" : "Upload one clear portrait"}</span><span className="max-w-xs text-sm leading-relaxed text-(--color-text-muted)">{isComparison ? "Drag a photo with two visible faces here, or click to browse." : "Click to browse, or drop a front-facing photo here."}</span></>}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          {needsPro && <div className="mt-5 flex items-center gap-3 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><Lock size={18} className="shrink-0" /><span className="flex-1">This tool is part of Verified Glam Pro.</span><button onClick={() => setUpgradeOpen(true)} className="font-semibold underline">Upgrade</button></div>}
          {error && !needsPro && <div className="mt-5 rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button onClick={handleAnalyze} disabled={!file || analyzing} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[13px] bg-(--color-burgundy) px-8 py-3.5 font-extrabold text-white transition-all hover:bg-(--color-burgundy-dark) disabled:cursor-not-allowed disabled:opacity-50">{analyzing && <Loader2 className="animate-spin" size={18} />}{analyzing ? "Analyzing..." : "Start analysis"}{!analyzing && <ArrowRight size={17} />}</button>
        </section>

        <aside className="space-y-6">
          <PhotoGuidelines comparison={isComparison} />
        </aside>
      </div>

      {result && <section className="mt-8 rounded-[24px] border border-(--color-border) bg-white p-5 shadow-[0_16px_38px_rgba(82,13,28,0.07)] sm:p-7"><div className="flex flex-col gap-3 border-b border-(--color-border) pb-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.13em] text-(--color-burgundy)">Your report is ready</p><h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-(--color-burgundy-dark)">{tool.title} results</h2></div><span className="rounded-full bg-(--color-surface) px-3 py-1.5 text-xs font-bold text-(--color-burgundy-dark)">Analysis complete</span></div><div className="mt-5"><ReportActions toolTitle={tool.title} summaryLines={summarizeForShare(result.payload)} onRetake={handleRetake} /></div><div className="vg-print-area mt-6"><p className="mb-4 hidden text-xs text-(--color-text-muted) print:block">Verified Glam Scanner — {tool.title} report — {new Date().toLocaleDateString()}</p><ResultView featureType={tool.featureType} payload={result.payload} photoUrl={previewUrl} /></div>{typeof result.creditsRemaining === "number" && <p className="mt-4 text-sm text-(--color-text-muted)">Credits remaining: {result.creditsRemaining}</p>}</section>}
      {profile && <UpgradeModal profile={profile} open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />}
    </div>
  );
}

const DO_DONT_COPY = {
  solo: {
    heading: "One person, clear and front-facing",
    image: "/images/guidelines/good-bad-examples.jpg",
    dos: ["Face the camera directly", "Use even, natural lighting", "Keep hair away from your face"],
    avoid: ["Filters or heavy editing", "Sunglasses or masks", "Shadows covering your features"],
  },
  comparison: {
    heading: "Two people, clear and close together",
    image: "/images/guidelines/face-comparison-good-bad.jpg",
    dos: ["One picture with two people together", "Both faces close together, sharp and clearly visible", "Bright, even light on both faces"],
    avoid: ["Solo photos, or a picture with one person", "Dark photos or heavy shadows", "Face masks, blur, or anything covering the face"],
  },
};

function PhotoGuidelines({ comparison }: { comparison: boolean }) {
  const copy = comparison ? DO_DONT_COPY.comparison : DO_DONT_COPY.solo;
  return (
    <section className="rounded-[24px] border border-(--color-border) bg-white p-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.13em] text-(--color-burgundy)">Photo guide</p>
      <h3 className="mt-1 text-base font-extrabold text-(--color-burgundy-dark)">{copy.heading}</h3>

      <div className="mt-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-emerald-700">Do</p>
        <ul className="mt-2 space-y-2">
          {copy.dos.map((item) => <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-(--color-text)"><Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />{item}</li>)}
        </ul>
      </div>

      <div className="mt-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-red-700">Avoid</p>
        <ul className="mt-2 space-y-2">
          {copy.avoid.map((item) => <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-(--color-text)"><X size={16} className="mt-0.5 shrink-0 text-red-600" />{item}</li>)}
        </ul>
      </div>

      <div className="relative mt-4 aspect-[1024/760] w-full overflow-hidden rounded-xl bg-(--color-surface)">
        <Image src={copy.image} alt={comparison ? "Good and bad example photos for face comparison" : "Good and bad example portrait photos"} fill className="object-cover" sizes="(min-width: 1280px) 360px, 90vw" />
      </div>
    </section>
  );
}

function fileFromDataUrl(dataUrl: string, name: string, type: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] || type;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], name, { type: mime });
}
