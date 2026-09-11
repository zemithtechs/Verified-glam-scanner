"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, Pencil, X } from "lucide-react";
import { proxyApi, ClientApiError } from "@/lib/client-api";
import type { Profile } from "@/lib/types";
import { Avatar } from "./Avatar";

export function ProfileHeaderCard({ profile }: { profile: Profile }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [nameDraft, setNameDraft] = useState(profile.display_name ?? "");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file again later
    if (!file) return;
    setAvatarError(null);
    setUploading(true);
    try {
      const bytes = await file.arrayBuffer();
      const { avatarUrl: newUrl } = await proxyApi.postBinary<{ avatarUrl: string }>("/profiles/me/avatar", bytes, file.type || "image/jpeg");
      setAvatarUrl(newUrl);
      router.refresh(); // picked up by the layout-level nav/sidebar avatar too
    } catch (caught) {
      setAvatarError(caught instanceof ClientApiError ? caught.message : "Couldn't upload that photo. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveName() {
    const trimmed = nameDraft.trim();
    if (!trimmed) {
      setNameError("Nickname is required.");
      return;
    }
    setSavingName(true);
    setNameError(null);
    try {
      await proxyApi.put<{ ok: true; displayName: string }>("/profiles/me", { displayName: trimmed });
      setDisplayName(trimmed);
      setEditingName(false);
      router.refresh();
    } catch (caught) {
      setNameError(caught instanceof ClientApiError ? caught.message : "Couldn't save that nickname. Please try again.");
    } finally {
      setSavingName(false);
    }
  }

  return (
    <div className="flex items-center gap-5 rounded-[20px] border border-(--color-border) bg-white p-6">
      <div className="relative shrink-0">
        <Avatar src={avatarUrl} name={displayName ?? profile.email} size={72} />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-(--color-burgundy) text-white shadow-sm disabled:opacity-60"
          aria-label="Change profile picture"
        >
          <Camera size={13} />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      <div className="min-w-0 flex-1">
        {editingName ? (
          <div className="flex items-center gap-2">
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              maxLength={40}
              autoFocus
              className="min-w-0 flex-1 rounded-lg border border-(--color-border) px-3 py-1.5 text-lg font-extrabold text-(--color-burgundy-dark) outline-none focus:border-(--color-burgundy)"
            />
            <button onClick={handleSaveName} disabled={savingName} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--color-burgundy) text-white disabled:opacity-60" aria-label="Save nickname">
              <Check size={16} />
            </button>
            <button
              onClick={() => { setEditingName(false); setNameDraft(displayName ?? ""); setNameError(null); }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-(--color-border) text-(--color-text-muted)"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="truncate text-2xl font-extrabold text-(--color-burgundy-dark)">{displayName || "Add a nickname"}</h1>
            <button onClick={() => setEditingName(true)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-(--color-text-muted) hover:bg-(--color-surface)" aria-label="Edit nickname">
              <Pencil size={14} />
            </button>
          </div>
        )}
        <p className="mt-1 text-(--color-text-muted)">{profile.email}</p>
        {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
        {avatarError && <p className="mt-1 text-sm text-red-600">{avatarError}</p>}
      </div>
    </div>
  );
}
