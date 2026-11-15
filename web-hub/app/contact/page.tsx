import type { Metadata } from "next";
import { Mail, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { MarketingShell } from "@/components/SiteChrome";
import { Container } from "@/components/ui";
import { SUPPORT_EMAIL } from "@/lib/site-info";
import { buildMetadata } from "@/lib/seo-meta";
import { titleCase } from "@/lib/title-case";

export const metadata: Metadata = buildMetadata({
  title: "Contact AI Beauty Styling",
  description: "Get in touch with AI Beauty Styling for support, feedback, privacy requests or partnership questions. Write to support@verifiedglam.com.",
  path: "/contact",
});

const TOPICS = [
  { icon: Mail, title: "Ask us about a tool, a result or your subscription.", text: "Write to us about a tool, a result, your account or your subscription. Tell us which tool you used and what you saw, and attach a screenshot if you can. That helps us find the cause and give you a useful answer the first time.", subject: "Support request", cta: "Ask for support" },
  { icon: ShieldCheck, title: "Ask how we handle your photos and your data.", text: "Ask how your photos and data are handled, or make a data request. Tell us which account the request is about and what you would like us to do. We read every privacy message, and the Privacy Policy explains the basics before you write.", subject: "Privacy request", cta: "Ask a privacy question" },
  { icon: Trash2, title: "You can delete your own account at any time.", text: "You can delete your account and the photos saved to it yourself, without writing to us. Open the delete account page, follow the steps and confirm. Once you confirm, your saved results go with the account, so download anything you want to keep first.", subject: "", href: "/delete-account" },
];

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="hero-glow border-b border-line">
        <Container className="max-w-3xl py-12 sm:py-16">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{titleCase("Email us and we will help you with your question.")}</h1>
          <p className="mt-3 text-lg text-muted">Email us about a tool, a result, your subscription or a privacy request. A few details in your message help us answer faster.</p>
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
              <h2 className="mt-3 text-[16px] font-semibold">{titleCase(t.title)}</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted">{t.text}</p>
              {t.href ? <Link href={t.href} className="mt-3 inline-block text-sm font-semibold text-plum underline underline-offset-4">Delete account</Link> : <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t.subject)}`} className="mt-3 inline-block text-sm font-semibold text-plum underline underline-offset-4">{t.cta}</a>}
            </div>
          ))}
        </div>
      </Container>
    </MarketingShell>
  );
}
