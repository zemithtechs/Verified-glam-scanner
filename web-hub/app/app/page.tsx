import Link from "next/link";
import { ArrowRight, Clock, Crown, Flame, Sparkles } from "lucide-react";
import { CategoryBadge, ToolCard } from "@/components/ui";
import { CATEGORIES, TOOLS, toolBySlug } from "@/lib/catalog";
import { myCreations, requireProfile } from "@/lib/account";
import { planLabel } from "@/lib/plan-label";
import { PRICING } from "@/lib/pricing";

export const dynamic = "force-dynamic";

const when = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default async function DashHome() {
  const profile = await requireProfile("/app");
  const creations = (await myCreations()).slice(0, 4);
  const name = profile.display_name || profile.email.split("@")[0];
  const max = Math.max(profile.credits_allocated + (profile.purchased_credits ?? 0), profile.credits_balance, 10);
  const recommended = TOOLS.filter((t) => t.popular && !creations.some((c) => c.tool_slug === t.slug)).slice(0, 4);
  const trending = TOOLS.filter((t) => t.badge).slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-plum via-berry to-rose p-7 text-white sm:p-9">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-semibold text-white/80">Welcome back</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">Hi {name}, ready to glow?</h1>
          <p className="mt-2 max-w-md text-white/85">{creations.length ? "Pick up where you left off or try something new today." : "Make your first result. Every new account starts with free credits."}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/face-beauty-analysis" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-plum"><Sparkles size={15} />New scan</Link>
            <Link href="/tools" className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-2.5 text-sm font-bold">Browse all tools</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-white p-6">
          <div className="flex items-center justify-between"><p className="font-bold">Credits</p><span className="rounded-full bg-blush px-2.5 py-1 text-xs font-bold text-plum">{planLabel(profile.subscription_plan, profile.is_pro)}</span></div>
          <p className="mt-3 font-display text-5xl font-semibold">{profile.credits_balance}<span className="text-xl text-muted"> credits</span></p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-blush"><div className="h-full rounded-full bg-gradient-to-r from-plum to-rose" style={{ width: `${Math.min(100, (profile.credits_balance / max) * 100)}%` }} /></div>
          <p className="mt-3 text-sm text-muted">About {Math.floor(profile.credits_balance / PRICING.creditsPerGeneration)} results left ({PRICING.creditsPerGeneration} credits each).</p>
          <Link href={profile.is_pro ? "/app/account" : "/pricing"} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-berry hover:underline"><Crown size={15} />{profile.is_pro ? "Manage plan" : "Upgrade or buy credits"} <ArrowRight size={14} /></Link>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Clock size={18} className="text-berry" />Recent creations</h2>
          {creations.length > 0 && <Link href="/app/creations" className="text-sm font-bold text-berry hover:underline">View all</Link>}
        </div>
        {creations.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {creations.map((c) => (
              <Link key={c.id} href="/app/creations" className="group overflow-hidden rounded-2xl border border-line bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/proxy/creations/${c.id}/image`} alt={`${c.tool_name} result`} loading="lazy" className="aspect-video w-full bg-[#faf9f8] object-contain" />
                <div className="p-3 text-center"><p className="text-sm font-semibold">{toolBySlug(c.tool_slug)?.name ?? c.tool_name}</p><p className="mt-1 text-xs text-muted">{when(c.created_at)}</p></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center"><p className="font-semibold">No saved results yet</p><p className="mt-1 text-sm text-muted">Results you make while logged in are saved here automatically.</p><Link href="/tools" className="mt-4 inline-block rounded-full bg-plum px-5 py-2.5 text-sm font-bold text-white">Try a tool</Link></div>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><Sparkles size={18} className="text-berry" />Recommended for you</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{recommended.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Flame size={18} className="text-berry" />Trending</h2>
          <ol className="space-y-3">
            {trending.map((t, i) => (
              <li key={t.slug}><Link href={`/${t.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-blush/60"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blush font-bold text-plum">{i + 1}</span><span className="flex-1 truncate text-sm font-semibold">{t.name}</span><ArrowRight size={15} className="text-muted" /></Link></li>
            ))}
          </ol>
        </section>
        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Browse by category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/category/${c.id}`} className="flex flex-col items-center gap-2 rounded-2xl border border-line p-3 text-center hover:bg-blush/60"><CategoryBadge category={c} size={42} /><span className="text-xs font-bold leading-tight">{c.name}</span></Link>
            ))}
          </div>
        </section>
      </div>

      {!profile.is_pro && (
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center">
          <div><p className="font-display text-2xl font-semibold">More credits, no ads</p><p className="mt-1 text-sm text-white/65">Go Pro, or buy a credit pack once with pay as you go.</p></div>
          <Link href="/pricing" className="rounded-full bg-gradient-to-r from-gold to-rose px-6 py-3 text-sm font-bold text-ink">See plans</Link>
        </div>
      )}
    </div>
  );
}
