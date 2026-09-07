import { AuthLayout } from "@/components/AuthLayout";
import { LoginForm } from "./LoginForm";
import { safeRedirectPath } from "@/lib/safe-redirect";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectPath = safeRedirectPath(redirect);

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to run analyses, save scans, and sync across devices.">
      <LoginForm redirectPath={redirectPath} />
    </AuthLayout>
  );
}
