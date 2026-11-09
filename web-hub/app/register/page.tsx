import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { RegisterForm } from "./RegisterForm";
import { safeNext } from "@/lib/account";

export const metadata: Metadata = { title: "Create your free account", robots: { index: false, follow: false } };

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
