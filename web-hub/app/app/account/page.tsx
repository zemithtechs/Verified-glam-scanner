import Link from "next/link";
import { Check, Coins, Crown, Trash2 } from "lucide-react";
import { MOCK_USER } from "@/lib/mock-user";

const USAGE = [["Face Beauty Analysis", 3], ["Celebrity Look Alike", 2], ["Facial Symmetry", 1], ["Attractiveness Test", 1]] as const;

export default function Account() {
  const u = MOCK_USER;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Credits & plan</h1>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-line bg-white p-6">
          <p className="flex items-center gap-2 font-bold"><Coins size={18} className="text-gold" />Credits this month</p>
          <p className="mt-3 font-display text-5xl font-semibold">{u.credits}<span className="text-xl text-muted"> left of {u.creditsMax}</span></p>
          <ul className="mt-5 space-y-2 text-sm">
            {USAGE.map(([n, c]) => <li key={n} className="flex justify-between border-b border-line pb-2"><span>{n}</span><span className="font-semibold text-muted">{c} used</span></li>)}
          </ul>
        </section>
        <section className="rounded-3xl bg-ink p-6 text-white">
          <p className="flex items-center gap-2 font-bold"><Crown size={18} className="text-gold" />Upgrade to Pro</p>
          <ul className="mt-4 space-y-2.5 text-sm text-white/85">
            {["No ads", "Large monthly credits", "All premium tools", "HD downloads"].map((f) => <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 text-rose" />{f}</li>)}
          </ul>
          <Link href="/pricing" className="mt-6 inline-block rounded-full bg-gradient-to-r from-gold to-rose px-6 py-3 text-sm font-bold text-ink">See plans</Link>
        </section>
      </div>

      <section className="rounded-3xl border border-line bg-white p-6">
        <h2 className="font-bold">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Name</p><p className="mt-1 font-semibold">{u.name}</p></div>
          <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Email</p><p className="mt-1 font-semibold">{u.email}</p></div>
        </div>
      </section>

      <section className="rounded-3xl border border-red-200 bg-red-50/60 p-6">
        <h2 className="flex items-center gap-2 font-bold text-red-800"><Trash2 size={17} />Delete account & photos</h2>
        <p className="mt-1 text-sm text-red-900/80">Permanently removes your account, results and uploaded photos.</p>
        <Link href="/delete-account" className="mt-4 inline-block rounded-full border border-red-300 bg-white px-5 py-2.5 text-sm font-bold text-red-800">Delete my account</Link>
      </section>
    </div>
  );
}
