"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2 } from "lucide-react";
import { creationsApi } from "@/lib/client-api";

export function CreationActions({ id, slug }: { id: string; slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function remove() {
    if (!window.confirm("Delete this result? This cannot be undone.")) return;
    setBusy(true);
    try { await creationsApi.remove(id); router.refresh(); } catch { setBusy(false); window.alert("Could not delete. Please try again."); }
  }
  return (
    <div className="grid grid-cols-2 border-t border-line text-sm font-semibold">
      <a href={`/api/proxy/creations/${id}/image`} download={`${slug}-result.png`} className="flex items-center justify-center gap-2 px-3 py-2.5 text-plum hover:bg-blush"><Download size={15} />Download</a>
      <button type="button" disabled={busy} onClick={remove} className="flex items-center justify-center gap-2 border-l border-line px-3 py-2.5 text-red-700 hover:bg-red-50 disabled:opacity-50"><Trash2 size={15} />Delete</button>
    </div>
  );
}
