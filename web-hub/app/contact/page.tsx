import type { Metadata } from "next";
import { Mail, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { MarketingShell } from "@/components/SiteChrome";
import { Container } from "@/components/ui";
import { SUPPORT_EMAIL } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with AI Beauty Styling for support, feedback, privacy requests or partnership questions.",
  alternates: { canonical: "/contact" },
};

const TOPICS = [
  { icon: Mail, title: "Support and feedback", text: "Questions about a tool, a result, your account or your subscription.", subject: "Support request" },
  { icon: ShieldCheck, title: "Privacy questions", text: "Ask how your photos and data are handled, or make a data request.", subject: "Privacy request" },
  { icon: Trash2, title: "Delete your account", text: "You can delete your account and photos yourself, any time.", subject: "", href: "/delete-account" },
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="hero-glow border-b border-line">
        <Container className="max-w-3xl py-12 sm:py-16">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">Contact us</h1>
          <p className="mt-3 text-lg text-muted">Questions, feedback or partnership ideas? Send us an email and include enough detail for us to help.</p>
        </Container>
      </section>
      <Container className="max-w-3xl py-10 sm:py-14">
        <div className="rounded-3xl border border-line bg-white p-7 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">Email</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="mt-2 inline-block font-display text-2xl font-semibold text-plum underline-offset-4 hover:underline sm:text-3xl">{SUPPORT_EMAIL}</a>
          <p className="mt-3 text-muted">For account help, please write from the email address you signed up with.</p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {TOPICS.map((t) => (
            <div key={t.title} className="rounded-2xl border border-line bg-white p-5">
              <span className="text-plum"><t.icon size={22} aria-hidden="true" /></span>
              <h2 className="mt-3 text-[16px] font-semibold">{t.title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted">{t.text}</p>
              {t.href ? <Link href={t.href} className="mt-3 inline-block text-sm font-semibold text-plum underline underline-offset-4">Delete account</Link> : <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t.subject)}`} className="mt-3 inline-block text-sm font-semibold text-plum underline underline-offset-4">Email us</a>}
            </div>
          ))}
        </div>
      </Container>
    </MarketingShell>
  );
}
