import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Crown, Flame, Sparkles } from "lucide-react";
import { AdSlot, CategoryBadge, ToolCard } from "@/components/ui";
import { CATEGORIES, TOOLS, toolBySlug } from "@/lib/catalog";
import { MOCK_USER } from "@/lib/mock-user";

const RECENT = [
  { slug: "face-beauty-analysis", when: "2 hours ago" },
  { slug: "celebrity-look-alike", when: "Yesterday" },
  { slug: "facial-symmetry", when: "3 days ago" },
  { slug: "attractiveness-test", when: "Last week" },
];

export default function DashHome() {
  const u = MOCK_USER;
  const recommended = TOOLS.filter((t) => t.popular && t.status !== "later" && !RECENT.some((r) => r.slug === t.slug)).slice(0, 4);
  const trending = TOOLS.filter((t) => t.badge && t.status !== "later").slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Greeting + quick stats */}
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-plum via-berry to-rose p-7 text-white sm:p-9">
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <p className="text-sm font-semibold text-white/80">Welcome back</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">Hi {u.name}, ready to glow?</h1>
          <p className="mt-2 max-w-md text-white/85">Pick up where you left off or try something new today.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/face-beauty-analysis" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-plum"><Sparkles size={15} />New scan</Link>
            <Link href="/tools" className="inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-2.5 text-sm font-bold">Browse all tools</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-line bg-white p-6">
          <div className="flex items-center justify-between"><p className="font-bold">Credits</p><span className="rounded-full bg-blush px-2.5 py-1 text-xs font-bold text-plum">{u.plan} plan</span></div>
          <p className="mt-3 font-display text-5xl font-semibold">{u.credits}<span className="text-xl text-muted"> / {u.creditsMax}</span></p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-blush"><div className="h-full rounded-full bg-gradient-to-r from-plum to-rose" style={{ width: `${(u.credits / u.creditsMax) * 100}%` }} /></div>
          <p className="mt-3 text-sm text-muted">Resets {u.renews}. Pro gives a much larger allowance.</p>
          <Link href="/app/account" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-berry hover:underline"><Crown size={15} />Upgrade <ArrowRight size={14} /></Link>
        </div>
      </div>

      {/* Ad (free plan only) */}
      <AdSlot label="Dashboard banner (free plan only)" />

      {/* Recent */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Clock size={18} className="text-berry" />Recent creations</h2>
          <Link href="/app/creations" className="text-sm font-bold text-berry hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {RECENT.map((r) => {
            const t = toolBySlug(r.slug)!;
            return (
              <Link key={r.slug} href={`/${r.slug}`} className="group overflow-hidden rounded-2xl border border-line bg-white">
                <div className="relative aspect-video"><Image src={`/img/results/${r.slug}.png`} alt={`${t.name}: complete example result`} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-contain" /></div>
                <div className="p-3 text-center"><p className="text-sm font-semibold">{t.name}</p><p className="mt-1 text-xs text-muted">{r.when}</p></div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recommended */}
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><Sparkles size={18} className="text-berry" />Recommended for you</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{recommended.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>

      {/* Trending + categories */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Flame size={18} className="text-berry" />Trending</h2>
          <ol className="space-y-3">
            {trending.map((t, i) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-blush/60">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-blush font-bold text-plum">{i + 1}</span>
                  <span className="flex-1 truncate text-sm font-semibold">{t.name}</span>
                  <ArrowRight size={15} className="text-muted" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-3xl border border-line bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">Browse by category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link key={c.id} href={`/category/${c.id}`} className="flex flex-col items-center gap-2 rounded-2xl border border-line p-3 text-center hover:bg-blush/60">
                <CategoryBadge category={c} size={42} />
                <span className="text-xs font-bold leading-tight">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Upgrade bar */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center">
        <div><p className="font-display text-2xl font-semibold">Unlock Hairstyle Changer & Virtual Try-On</p><p className="mt-1 text-sm text-white/65">Pro removes ads and includes every premium tool.</p></div>
        <Link href="/pricing" className="rounded-full bg-gradient-to-r from-gold to-rose px-6 py-3 text-sm font-bold text-ink">See Pro plans</Link>
      </div>
    </div>
  );
}
