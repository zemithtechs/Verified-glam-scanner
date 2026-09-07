"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { proxyApi } from "@/lib/client-api";
import type { Profile } from "@/lib/types";

/**
 * Handles landing back on the app after a Polar checkout — mirrors
 * lib/web/vg_web_checkout_return.dart's vgWebHandleCheckoutReturn(), which
 * the Flutter app calls from every /app/* page's initState for the same
 * reason: Polar's successUrl points at a fixed path (currently
 * /app/face-beauty-analysis), not necessarily the page the user started
 * checkout from, and Pro status can take a few seconds to activate after
 * the webhook fires.
 */
export function CheckoutReturnBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "polling" | "success" | "pending">("idle");
  const started = useRef(false);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout !== "success" || started.current) return;
    started.current = true;
    setStatus("polling");

    let attempts = 0;
    const maxAttempts = 15;
    const poll = async () => {
      attempts++;
      try {
        const profile = await proxyApi.get<Profile>("/profiles/me");
        if (profile.is_pro) {
          setStatus("success");
          router.replace(pathname);
          router.refresh();
          return;
        }
      } catch {
        // ignore and keep polling
      }
      if (attempts >= maxAttempts) {
        setStatus("pending");
        router.replace(pathname);
        return;
      }
      setTimeout(poll, 2000);
    };
    poll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "idle") return null;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
        status === "success"
          ? "bg-green-50 text-green-700 border-b border-green-200"
          : status === "pending"
            ? "bg-amber-50 text-amber-800 border-b border-amber-200"
            : "bg-(--color-surface) text-(--color-text-muted) border-b border-(--color-border)"
      }`}
    >
      {status === "polling" && (
        <>
          <Loader2 className="animate-spin" size={16} />
          Confirming your subscription…
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 size={16} />
          You&apos;re now Pro! All features are unlocked.
        </>
      )}
      {status === "pending" && (
        <>
          Your payment is still processing — Pro features will unlock automatically once it clears.
        </>
      )}
      {status !== "polling" && (
        <button onClick={() => setStatus("idle")} className="ml-auto">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
