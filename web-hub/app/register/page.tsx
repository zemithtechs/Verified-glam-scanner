import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { RegisterForm } from "./RegisterForm";
import { safeNext } from "@/lib/account";
import { privateMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = privateMetadata("Create your free account", "Sign up for a free AI Beauty Styling account and get 10 free credits to try the tools. No card needed. For adults aged 18 and over.");

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams;
  const next = safeNext(redirect);
  return (
    <AuthCard
      title="Create your free account"
      subtitle="Get 10 free credits to try the tools. No card needed."
      footer={<>Already have an account? <Link href={`/login?redirect=${encodeURIComponent(next)}`} className="font-semibold text-plum underline underline-offset-4">Log in</Link></>}
    >
      <RegisterForm next={next} />
    </AuthCard>
  );
}
