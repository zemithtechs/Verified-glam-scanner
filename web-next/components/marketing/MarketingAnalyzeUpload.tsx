"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, UploadCloud } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools";

type PendingUpload = {
  name: string;
  type: string;
  dataUrl: string;
  savedAt: number;
};

const MAX_PREVIEW_BYTES = 8 * 1024 * 1024;

export function MarketingAnalyzeUpload({
  tool,
  isSignedIn,
  dimensions,
}: {
  tool: ToolDefinition;
  isSignedIn: boolean;
  dimensions: string[];
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState(dimensions[0]);

  function acceptFile(selected: File | undefined) {
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please upload a JPG or PNG image.");
      return;
    }

    if (selected.size > MAX_PREVIEW_BYTES) {
      setError("Please choose an image under 8 MB.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError(null);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    acceptFile(event.target.files?.[0]);
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    acceptFile(event.dataTransfer.files?.[0]);
  }

  async function handleStart() {
    if (!file) {
      setError("Upload a clear photo first, then start your analysis.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const pending: PendingUpload = {
        name: file.name,
        type: file.type || "image/jpeg",
        dataUrl,
        savedAt: Date.now(),
      };

      window.sessionStorage.setItem(`vg_pending_upload_${tool.slug}`, JSON.stringify(pending));
      const destination = `/app/${tool.slug}`;
      window.location.href = isSignedIn ? destination : `/register?redirect=${encodeURIComponent(destination)}`;
    } catch {
      setError("We could not prepare this image. Please try another photo.");
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[22px] border border-(--color-border) bg-white p-5 shadow-[0_16px_40px_rgba(82,13,28,0.08)]">
      <label
        className="group block cursor-pointer rounded-[16px] border border-dashed border-(--color-border) bg-(--color-surface) p-5 text-center transition hover:border-(--color-burgundy)"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="relative mx-auto flex min-h-[230px] items-center justify-center overflow-hidden rounded-[14px] bg-white">
          {previewUrl ? (
            <Image src={previewUrl} alt="Selected upload preview" fill className="object-cover" sizes="(min-width: 1024px) 420px, 100vw" unoptimized />
          ) : (
            <div className="px-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-(--color-blush) text-(--color-burgundy)">
                <UploadCloud size={28} />
              </div>
              <p className="mt-4 text-base font-extrabold text-(--color-burgundy-dark)">Upload or drag a photo</p>
              <p className="mt-1 text-sm text-(--color-text-muted)">JPG or PNG, clear front-facing image</p>
            </div>
          )}
        </div>
        <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleFileChange} />
      </label>

      <div className="mt-5">
        <p className="text-sm font-extrabold text-(--color-burgundy-dark)">Select an analysis dimension</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {dimensions.map((dimension) => (
            <button
              key={dimension}
              type="button"
              aria-pressed={selectedDimension === dimension}
              onClick={() => setSelectedDimension(dimension)}
              className={`rounded-[10px] border px-3 py-2 text-center text-xs font-bold transition-colors ${
                selectedDimension === dimension
                  ? "border-(--color-burgundy) bg-(--color-burgundy) text-white"
                  : "border-(--color-border) bg-white text-(--color-burgundy-dark) hover:bg-(--color-blush)"
              }`}
            >
              {dimension}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 rounded-[12px] bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <button
        type="button"
        onClick={handleStart}
        disabled={saving}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[12px] bg-(--color-burgundy) px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-(--color-burgundy-dark) disabled:opacity-60"
      >
        <Camera size={18} />
        {saving ? "Preparing photo..." : "Start Analysis"}
      </button>

      <p className="mt-3 text-center text-xs leading-relaxed text-(--color-text-muted)">
        You will sign in before the analysis runs. Your selected photo is only carried into the secure app workspace.
      </p>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
