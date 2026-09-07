"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UploadCloud, Loader2, Lock } from "lucide-react";
import { proxyApi, ClientApiError } from "@/lib/client-api";
import { resolvePrimaryIssue, resolveTemplate, introForIssue, challengeDisclaimer } from "@/lib/challenge-templates";
import type { ToolDefinition } from "@/lib/tools";

type AnalyzeResponse = { payload: Record<string, unknown>; version: string };

/**
 * Starts a NEW Beauty Routine Challenge. Unlike the other tools, this
 * doesn't show its own analysis results — the GLOW_UP_GUIDE scan is only
 * used to detect the user's primary skin concern, which picks a template
 * from the static challenge catalog (see lib/challenge-templates.ts — the
 * plan is not AI-generated). Once created, the user lands on the tracked
 * challenge overview.
 */
export function ChallengeStart({ tool }: { tool: ToolDefinition }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsPro, setNeedsPro] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError(null);
    setNeedsPro(false);
  }

  async function handleStart() {
    if (!file) return;
    setWorking(true);
    setError(null);
    setNeedsPro(false);
    try {
      const scanId = crypto.randomUUID();
      await proxyApi.put(`/scans/${scanId}`, { featureType: tool.featureType, featureTitle: tool.title });

      const bytes = await file.arrayBuffer();
      const { storagePath } = await proxyApi.postBinary<{ storagePath: string }>(
        `/scans/${scanId}/photo`,
        bytes,
        file.type || "image/jpeg",
      );

      const { payload } = await proxyApi.post<AnalyzeResponse>("/analyze", {
        featureType: tool.featureType,
        storagePath,
      });

      const issue = resolvePrimaryIssue(payload);
      const template = resolveTemplate(issue.code, issue.label, issue.severity);

      await proxyApi.post("/challenges", {
        sourceScanId: scanId,
        issueTag: template.issueLabel,
        severity: issue.severity,
        durationDays: template.durationDays,
        title: template.challengeName,
        introMessage: introForIssue(template.issueLabel, template.durationDays),
        disclaimer: challengeDisclaimer,
        notificationPrefTime: "18:00",
        days: template.days,
      });

      router.push("/app/profile/challenge");
      router.refresh();
    } catch (err) {
      if (err instanceof ClientApiError && err.errorCode === "NOT_SUBSCRIBED") {
        setNeedsPro(true);
      } else {
        setError(err instanceof ClientApiError ? err.message : "Something went wrong. Please try again.");
      }
    } finally {
      setWorking(false);
    }
  }

  return (
    <div className="max-w-(--max-content) mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-(--color-burgundy-dark)">{tool.title}</h1>
      <p className="mt-2 text-(--color-text-muted)">
        Upload a skin photo — we&apos;ll build a personalized day-by-day plan based on what we see.
      </p>

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
              <li>No makeup or filters, if possible</li>
              <li>Your plan adapts to what the scan finds — acne, dryness, texture, and more</li>
            </ul>
          </div>
        </div>

        {needsPro && (
          <div className="mt-5 flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
            <Lock size={18} className="shrink-0" />
            <span className="flex-1">The Beauty Routine Challenge is part of Verified Glam Pro.</span>
            <Link href="/pricing" className="font-semibold underline shrink-0">
              Upgrade
            </Link>
          </div>
        )}
        {error && !needsPro && (
          <div className="mt-5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{error}</div>
        )}

        <button
          onClick={handleStart}
          disabled={!file || working}
          className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-(--color-burgundy) text-white font-semibold px-8 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {working && <Loader2 className="animate-spin" size={18} />}
          {working ? "Building your plan…" : "Start my challenge"}
        </button>
      </div>
    </div>
  );
}
