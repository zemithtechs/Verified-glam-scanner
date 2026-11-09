"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { proxyApi } from "@/lib/client-api";

type Item = { id: string; name: string; enabled: boolean; source?: string; destination?: string };

export function ToggleList({ initialItems, endpoint }: { initialItems: Item[]; endpoint: string }) {
  const [items, setItems] = useState(initialItems);
  const [saving, setSaving] = useState<string | null>(null);
  const toggle = async (item: Item) => {
    setSaving(item.id);
    try {
      await proxyApi.put(`${endpoint}/${encodeURIComponent(item.id)}`, { enabled: !item.enabled });
      setItems((current) => current.map((row) => row.id === item.id ? { ...row, enabled: !row.enabled } : row));
    } finally { setSaving(null); }
  };
  return <div className="overflow-hidden rounded-2xl border border-(--color-border) bg-white divide-y divide-(--color-border)">
    {items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 p-4 sm:px-5">
      <div><p className="font-bold text-(--color-text)">{item.name}</p>
        {item.source && <p className="mt-1 flex items-center gap-2 text-xs text-(--color-text-muted)"><span>{item.source.replaceAll("_", " ")}</span><ArrowRight size={12}/><span>{item.destination?.replaceAll("_", " ")}</span></p>}
      </div>
      <button type="button" onClick={() => toggle(item)} disabled={saving === item.id} aria-label={`${item.enabled ? "Disable" : "Enable"} ${item.name}`} className={`relative h-7 w-12 rounded-full transition ${item.enabled ? "bg-(--color-burgundy)" : "bg-gray-300"}`}>
        {saving === item.id ? <Loader2 size={14} className="absolute left-4 top-1.5 animate-spin text-white"/> : <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${item.enabled ? "left-6" : "left-1"}`}/>} 
      </button>
    </div>)}
  </div>;
}
