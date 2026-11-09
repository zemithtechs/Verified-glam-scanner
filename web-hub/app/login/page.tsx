import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "./LoginForm";
import { safeNext } from "@/lib/account";

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: false } };

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
