"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadCloud, Loader2, Lock } from "lucide-react";
import { proxyApi, ClientApiError } from "@/lib/client-api";
import type { ToolDefinition } from "@/lib/tools";

type AnalyzeResponse = {
  payload: Record<string, unknown>;
  version: string;
  creditsRemaining?: number;
};

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsPro, setNeedsPro] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setError(null);
  }

  async function handleAnalyze() {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    setNeedsPro(false);
    try {
      const scanId = crypto.randomUUID();

      await proxyApi.put(`/scans/${scanId}`, {
        featureType: tool.featureType,
        featureTitle: tool.title,
      });

      const bytes = await file.arrayBuffer();
      const { storagePath } = await proxyApi.postBinary<{ storagePath: string }>(
        `/scans/${scanId}/photo`,
        bytes,
        file.type || "image/jpeg",
      );

      let analyzeResult: AnalyzeResponse;
      try {
        analyzeResult = await proxyApi.post<AnalyzeResponse>("/analyze", {
          featureType: tool.featureType,
          storagePath,
        });
      } catch (err) {
        if (err instanceof ClientApiError && err.errorCode === "REWARD_REQUIRED") {
          // No web ad SDK yet (mobile uses AdMob rewarded interstitials) —
          // mint the reward token directly for now so the free-tier flow
          // still works end-to-end; swap in a real web ad unit later.
          const { rewardToken } = await proxyApi.post<{ rewardToken: string }>("/ads/reward", {
            featureType: tool.featureType,
          });
          analyzeResult = await proxyApi.post<AnalyzeResponse>("/analyze", {
            featureType: tool.featureType,
            storagePath,
            rewardToken,
          });
        } else {
          throw err;
        }
      }

      setResult(analyzeResult);
    } catch (err) {
      if (err instanceof ClientApiError && err.errorCode === "NOT_SUBSCRIBED") {
        setNeedsPro(true);
      } else {
        setError(err instanceof ClientApiError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="max-w-(--max-content) mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-burgundy-dark)">{tool.title}</h1>
      <p className="mt-2 text-(--color-text-muted)">Upload a clear, front-facing selfie to get started.</p>

      <div className="mt-6 bg-white rounded-[20px] border border-(--color-border) p-5 sm:p-7 shadow-[0_12px_24px_rgba(135,43,63,0.06)]">
        <div className="grid md:grid-cols-2 gap-6">
          <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-(--color-border) bg-(--color-surface) p-8 cursor-pointer min-h-64 text-center">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Selected preview" className="max-h-56 rounded-xl object-contain" />
            ) : (
              <>
                <UploadCloud className="text-(--color-burgundy)" size={36} />
                <span className="font-medium text-(--color-text)">Click to upload a photo</span>
                <span className="text-sm text-(--color-text-muted)">JPG or PNG, front-facing, good lighting</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          <div className="text-sm text-(--color-text-muted) space-y-2">
            <p className="font-semibold text-(--color-text)">For best results:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{tool.photoGuidance}</li>
              <li>Remove hats or heavy filters</li>
              <li>Use a recent, unedited photo</li>
            </ul>
          </div>
        </div>

        {needsPro && (
          <div className="mt-5 flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
            <Lock size={18} className="shrink-0" />
            <span className="flex-1">This tool is part of Verified Glam Pro.</span>
            <Link href="/pricing" className="font-semibold underline shrink-0">
              Upgrade
            </Link>
          </div>
        )}
        {error && !needsPro && (
          <div className="mt-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || analyzing}
          className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-(--color-burgundy) text-white font-semibold px-8 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {analyzing && <Loader2 className="animate-spin" size={18} />}
          {analyzing ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-white rounded-[20px] border border-(--color-border) p-5 sm:p-7">
          <h2 className="text-lg font-bold text-(--color-burgundy-dark) mb-3">Results</h2>
          <pre className="text-sm bg-(--color-surface) rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result.payload, null, 2)}
          </pre>
          {typeof result.creditsRemaining === "number" && (
            <p className="mt-3 text-sm text-(--color-text-muted)">
              Credits remaining: {result.creditsRemaining}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
