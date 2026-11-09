import { MarketingShell } from "./SiteChrome";

export const inputClass = "h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-plum";
export const primaryBtn = "inline-flex h-12 w-full items-center justify-center rounded-xl bg-plum px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ink disabled:opacity-60";

/** Centered card used by the sign-in, sign-up and password pages. */
export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <MarketingShell>
      <section className="hero-glow border-b border-line">
        <div className="mx-auto w-full max-w-[460px] px-4 py-12 sm:py-16">
          <h1 className="text-center font-display text-4xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-3 text-center text-[16px] leading-6 text-muted">{subtitle}</p>}
          <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-[0_16px_40px_rgba(109,26,70,0.08)] sm:p-8">{children}</div>
          {footer && <div className="mt-6 text-center text-[15px] text-muted">{footer}</div>}
        </div>
      </section>
    </MarketingShell>
  );
}

export function FormMessage({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  return kind === "error"
    ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{children}</div>
    : <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{children}</div>;
}
