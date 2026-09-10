import type { Metadata } from "next";
import { AuthLayout } from "@/components/AuthLayout";
import { RegisterForm } from "./RegisterForm";
import { safeRedirectPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: true },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectPath = safeRedirectPath(redirect);

  return (
    <AuthLayout title="Create your account" subtitle="Join Verified Glam to run AI beauty analyses.">
      <RegisterForm redirectPath={redirectPath} />
    </AuthLayout>
  );
}
