"use client";

import { useEffect, useState } from "react";
import { Download, Share2, Check, RotateCcw } from "lucide-react";

// "Download PDF" uses the browser's native print-to-PDF (see the .vg-printing
// rule in app/globals.css) rather than a canvas/jsPDF pipeline — it's the most
// reliable way to turn arbitrary DOM (photo + report) into a real PDF file
// without extra dependencies or cross-origin canvas issues.
export function ReportActions({ toolTitle, summaryLines, onRetake }: { toolTitle: string; summaryLines: string[]; onRetake?: () => void }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function handleDownload() {
    document.body.classList.add("vg-printing");
    const cleanup = () => {
      document.body.classList.remove("vg-printing");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.setTimeout(() => window.print(), 50);
  }

  async function handleShare() {
    const text = [`${toolTitle} — Verified Glam - Beauty Scanner`, ...summaryLines].join("\n");
    if (canShare) {
      try {
        await navigator.share({ title: toolTitle, text });
      } catch {
        // user cancelled the share sheet — no action needed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // clipboard unavailable — silently ignore, buttons remain usable
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {onRetake && (
        <button
          onClick={onRetake}
          className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-white px-4 py-2 text-sm font-bold text-(--color-burgundy-dark) transition-colors hover:bg-(--color-surface)"
        >
          <RotateCcw size={16} /> Retake
        </button>
      )}
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-white px-4 py-2 text-sm font-bold text-(--color-burgundy-dark) transition-colors hover:bg-(--color-surface)"
      >
        <Download size={16} /> Download as PDF
      </button>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-white px-4 py-2 text-sm font-bold text-(--color-burgundy-dark) transition-colors hover:bg-(--color-surface)"
      >
        {copied ? <Check size={16} /> : <Share2 size={16} />}
        {copied ? "Copied to clipboard" : canShare ? "Share" : "Copy summary to share"}
      </button>
    </div>
  );
}
