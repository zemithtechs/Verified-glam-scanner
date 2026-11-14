import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "./LoginForm";
import { safeNext } from "@/lib/account";
import { privateMetadata } from "@/lib/seo-meta";

export const metadata: Metadata = privateMetadata("Log in to your account", "Log in to your AI Beauty Styling account to see your credits, saved results and plan.");

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams;
  const next = safeNext(redirect);
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to see your credits and saved results."
      footer={<>New here? <Link href={`/register?redirect=${encodeURIComponent(next)}`} className="font-semibold text-plum underline underline-offset-4">Create a free account</Link></>}
    >
      <LoginForm next={next} />
    </AuthCard>
  );
}
