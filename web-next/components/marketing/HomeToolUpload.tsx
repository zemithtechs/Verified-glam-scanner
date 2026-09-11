"use client";

import { useState } from "react";
import Image from "next/image";
import { CloudUpload, Monitor } from "lucide-react";
import type { ToolDefinition } from "@/lib/tools";
import { GooglePlayBadge } from "./GooglePlayBadge";

export function HomeToolUpload({ tool, isSignedIn, dimensions }: { tool: ToolDefinition; isSignedIn: boolean; dimensions: string[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const selected = dimensions[0];
  function chooseFile(next?: File) {
    if (next && next.type.startsWith("image/")) { setFile(next); setError(null); }
    else if (next) setError("Choose a JPG, PNG, or WebP image.");
  }
  async function continueToWorkspace() {
    if (!file) { setError("Choose a clear photo first."); return; }
    setLoading(true);
    try {
      const dataUrl = await readFile(file);
      window.sessionStorage.setItem(`vg_pending_upload_${tool.slug}`, JSON.stringify({ name: file.name, type: file.type || "image/jpeg", dataUrl, savedAt: Date.now(), selectedDimension: selected }));
      const destination = `/app/${tool.slug}`;
      window.location.href = isSignedIn ? destination : `/register?redirect=${encodeURIComponent(destination)}`;
    } catch { setError("We could not prepare that image. Please try another photo."); setLoading(false); }
  }
  return <div className="mt-6"><label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files?.[0]); }} className="flex min-h-[224px] cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-(--color-rose) bg-white px-6 text-center transition-colors hover:border-(--color-burgundy) hover:bg-(--color-surface)"><span className="grid size-12 place-items-center rounded-xl bg-(--color-surface) text-(--color-burgundy)"><CloudUpload size={23} /></span><span className="mt-4 block text-base font-extrabold text-(--color-burgundy-dark)">{file ? file.name : "Drag and drop a photo here"}</span><span className="mt-1 block text-sm text-(--color-text-muted)">{file ? "Your image is ready to continue" : "or choose a clear selfie from your device"}</span><span className="mt-4 rounded-lg bg-(--color-burgundy) px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(82,13,28,0.18)]">Choose photo</span><span className="mt-3 text-xs font-semibold text-(--color-text-muted)">One credit per saved report or export.</span><input type="file" className="hidden" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(event) => chooseFile(event.target.files?.[0])} /></label>{error && <p role="alert" className="mt-2 text-xs font-semibold text-red-700">{error}</p>}<div className="mt-4 flex flex-col gap-4 rounded-[20px] bg-(--color-surface) p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center overflow-hidden rounded-xl bg-white shadow-sm"><Image src="/images/logo.png" alt="Verified Glam" width={40} height={40} className="size-10 object-contain" /></span><span><span className="block text-sm font-extrabold text-(--color-burgundy-dark)">Verified Glam Scanner</span><span className="mt-0.5 block text-xs leading-5 text-(--color-text-muted)">Continue on Android or use the web app.</span></span></div><div className="flex items-center gap-3"><GooglePlayBadge className="h-10" /><button type="button" onClick={continueToWorkspace} disabled={loading} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-(--color-border) bg-white px-3 text-sm font-extrabold text-(--color-burgundy-dark) shadow-sm transition-colors hover:bg-(--color-blush) disabled:opacity-60"><Monitor size={16} />{loading ? "Opening..." : "Use on web"}</button></div></div></div>;
}

function readFile(file: File): Promise<string> { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); }); }
