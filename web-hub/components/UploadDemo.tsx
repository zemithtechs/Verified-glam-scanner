"use client";
import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, LoaderCircle, RotateCcw, ShieldCheck, Wand2, X } from "lucide-react";
import { TOOLS } from "@/lib/catalog";
import { HANDOFF } from "@/lib/live-mode";
import { GENERATION_SPECS, samplePathsFor } from "@/lib/generation-specs";
type Selection = { file: File; url: string; sample?: string };
type Service = { available: boolean; token?: string; message: string };
export type WorkspaceState = { originals: string[]; busy: boolean; result: string | null; error: string; attempted: boolean };

function PhotoInput({ label, value, disabled, samples, onPick, onError }: { label: string; value?: Selection; disabled: boolean; samples: string[]; onPick: (file: File, sample?: string) => void; onError: (message: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState("");
  async function pickSample(src: string) {
    setLoading(src);
    try { const response = await fetch(src); if (!response.ok) throw new Error(); const blob = await response.blob(); onPick(new File([blob], src.split("/").pop()!, { type: "image/png" }), src); }
    catch { onError("This sample could not be loaded. Try another or upload a photo."); }
    finally { setLoading(""); }
  }
  return <div>
    <p className="mb-2 text-sm font-medium text-ink">{label}</p>
    <button type="button" disabled={disabled} aria-label={"Choose " + label.toLowerCase()} onClick={() => input.current?.click()}
      onDragOver={event => { event.preventDefault(); if (!disabled) setDrag(true); }} onDragLeave={() => setDrag(false)}
      onDrop={event => { event.preventDefault(); setDrag(false); if (!disabled && event.dataTransfer.files[0]) onPick(event.dataTransfer.files[0]); }}
      className={"relative grid min-h-40 w-full overflow-hidden rounded-lg border border-dashed text-center transition-colors disabled:cursor-wait " + (drag ? "border-plum bg-blush" : "border-plum/25 bg-cream/60 hover:border-plum hover:bg-blush/35")}>
      {value ? <img src={value.url} alt={"Selected " + label.toLowerCase()} className="h-48 w-full object-contain" /> : <span className="m-auto p-5"><ImagePlus size={28} strokeWidth={1.6} className="mx-auto text-plum" /><span className="mt-3 block text-sm font-semibold text-ink">Upload image</span><span className="mt-1 block text-xs text-muted">or drop a photo here</span></span>}
    </button>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={disabled} onChange={event => { const file = event.target.files?.[0]; if (file) onPick(file); event.target.value = ""; }} />
    {samples.length > 0 && <div className="mt-4"><p className="mb-2 text-xs font-medium text-muted">Try a sample</p><div className="flex gap-2">{samples.map((src, index) => <button key={src} type="button" disabled={disabled || Boolean(loading)} onClick={() => pickSample(src)} aria-label={"Use sample " + (index + 1) + " for " + label.toLowerCase()} aria-pressed={value?.sample === src} className={"relative h-[68px] w-[54px] overflow-hidden rounded-md border-2 transition hover:border-plum disabled:opacity-60 " + (value?.sample === src ? "border-plum ring-2 ring-plum/15 ring-offset-2" : "border-transparent")}><img src={src} alt="" className="h-full w-full object-cover" />{loading === src && <span className="absolute inset-0 grid place-items-center bg-white/70"><LoaderCircle className="animate-spin text-plum" size={18} /></span>}</button>)}</div></div>}
  </div>;
}
export function UploadDemo({ toolName, toolSlug, exampleSrc, onWorkspaceChange }: { toolName: string; toolSlug?: string; credits: number; compact?: boolean; exampleSrc?: string; onWorkspaceChange: (state: WorkspaceState) => void }) {
  const slug = toolSlug || TOOLS.find(tool => tool.name === toolName)?.slug || "";
  const spec = GENERATION_SPECS[slug];
  const [photos, setPhotos] = useState<Selection[]>([]);
  const [option, setOption] = useState(spec?.options?.[0] || "");
  const [consent, setConsent] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const urls = useRef(new Set<string>());
  useEffect(() => {
    onWorkspaceChange({ originals: photos.filter(Boolean).map(photo => photo.url), busy, result, error, attempted });
  }, [photos, busy, result, error, attempted, onWorkspaceChange]);
  useEffect(() => {
    const request = new AbortController();
    fetch("/api/generate", { signal: request.signal, cache: "no-store" }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setService(data); }).catch(error => { if (error.name !== "AbortError") setService({ available: false, message: error.message || "The local image service is unavailable." }); });
    const activeUrls = urls.current;
    return () => { request.abort(); controller.current?.abort(); activeUrls.forEach(url => URL.revokeObjectURL(url)); };
  }, []);
  function release(url?: string | null) { if (url) { URL.revokeObjectURL(url); urls.current.delete(url); } }
  function pick(index: number, file: File, sample?: string) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Choose a JPG, PNG or WebP image."); return; }
    if (!file.size || file.size > 10 * 1024 * 1024) { setError("Each image must be smaller than 10 MB."); return; }
    release(photos[index]?.url); release(result); setResult(null); setAttempted(false);
    const url = URL.createObjectURL(file); urls.current.add(url);
    setPhotos(previous => { const next = [...previous]; next[index] = { file, url, sample }; return next; }); setError("");
  }
  function reset() { photos.forEach(photo => release(photo?.url)); release(result); setPhotos([]); setResult(null); setError(""); setConsent(false); setAttempted(false); }
  async function generate() {
    if (!spec || !service?.token || !consent || busy) return;
    const abort = new AbortController(); controller.current = abort; setBusy(true); setAttempted(true); setError(""); release(result); setResult(null);
    try {
      const body = new FormData(); body.set("tool", slug); body.set("consent", "yes"); if (option) body.set("option", option);
      photos.forEach(photo => body.append("image", photo.file));
      const response = await fetch("/api/generate", { method: "POST", body, headers: { "x-local-generation": service.token }, signal: abort.signal });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || "Generation failed. Please try again."); }
      const blob = await response.blob(); if (!blob.type.startsWith("image/")) throw new Error("The service did not return an image.");
      const url = URL.createObjectURL(blob); urls.current.add(url); setResult(url);
    } catch (error) { setError(error instanceof Error && error.name === "AbortError" ? (HANDOFF ? "Stopped waiting. Your result may still finish in the background." : "Stopped waiting. A request already started with OpenAI may still finish and incur a charge.") : error instanceof Error ? error.message : "Generation failed. Please try again."); }
    finally { setBusy(false); controller.current = null; }
  }
  if (!spec || spec.unavailable) return <div className="rounded-lg border border-line bg-cream p-4 text-sm leading-6 text-muted">{spec?.unavailable || "This tool is not available for generation."}</div>;
  const samples = samplePathsFor(spec);
  const ready = Array.from({ length: spec.inputs }, (_, index) => Boolean(photos[index])).every(Boolean);
  return <div className="space-y-4">
    <PhotoInput label={spec.samples === "body" ? "Your photo" : spec.samples === "vintage" ? "Original photograph" : "Portrait image"} value={photos[0]} disabled={busy} samples={samples} onPick={(file, sample) => pick(0, file, sample)} onError={setError} />
    {spec.inputs === 2 && <PhotoInput label={spec.secondLabel || "Second portrait"} value={photos[1]} disabled={busy} samples={spec.secondLabel === "Garment photo" ? ["/img/samples/sample-garment.png"] : samples} onPick={(file, sample) => pick(1, file, sample)} onError={setError} />}
    <p className="text-xs text-muted">JPG, PNG or WebP files, up to 10 MB each.</p>
    {spec.options && <label className="block text-sm font-medium text-ink">Style<select value={option} disabled={busy} onChange={event => { setOption(event.target.value); release(result); setResult(null); setAttempted(false); setError(""); }} className="mt-2 min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm font-normal text-ink">{spec.options.map(value => <option key={value}>{value}</option>)}</select></label>}
    <label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5 text-muted"><input type="checkbox" checked={consent} disabled={busy} onChange={event => setConsent(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#6d1a46]" /><span>I have permission to use these photos. People shown are adults. I agree to send the selected images to OpenAI for processing.</span></label>
    <button type="button" disabled={!ready || !consent || !service?.available || busy} onClick={generate} className="tool-primary-button flex w-full items-center justify-center gap-2 rounded-md bg-plum px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45">{busy ? <LoaderCircle size={17} className="animate-spin" /> : <Wand2 size={17} />}{busy ? "Creating your image…" : "Generate my result"}</button>
    {busy && <div role="status" className="rounded-md bg-blush p-3 text-xs leading-5 text-muted">This can take a few minutes. Keep this page open.<button type="button" onClick={() => controller.current?.abort()} className="mt-2 flex min-h-9 items-center gap-1 font-semibold text-plum"><X size={14} />Stop waiting</button></div>}
    {error && !attempted && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-800">{error}</p>}
    {service && !service.available && <p role="status" className="rounded-md border border-line bg-cream p-3 text-xs leading-5 text-muted">{service.message}</p>}
    {!service && <p role="status" className="text-xs text-muted">{HANDOFF ? "Getting ready…" : "Checking local generation service…"}</p>}
    {photos.some(Boolean) && <button type="button" disabled={busy} onClick={reset} className="tool-text-link mx-auto flex min-h-10 items-center gap-2 text-xs font-medium text-muted"><RotateCcw size={14} />Clear and start again</button>}
    {exampleSrc && <a href={exampleSrc} download className="tool-text-link flex min-h-10 items-center justify-center gap-2 text-xs font-medium text-plum"><Download size={14} />Download a result example</a>}
    <p className="flex items-start gap-2 text-[11px] leading-5 text-muted"><ShieldCheck size={14} className="mt-0.5 shrink-0" /><span>{HANDOFF ? "Your photo is sent securely to our AI provider to create your result. Results are saved to My creations only when you are signed in, so download yours before leaving otherwise. See the Privacy Policy for how data is handled. A new account starts with 10 free credits, which covers 2 results at 5 credits each. Visitors without an account get a small free allowance each day." : "Local preview. Uses the configured OpenAI account and may incur API charges. This app does not save your uploads or results to disk. Download before leaving."}</span></p>
  </div>;
}
