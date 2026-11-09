import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { ForgotForm } from "./ForgotForm";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we will send you a link to choose a new one."
      footer={<Link href="/login" className="font-semibold text-plum underline underline-offset-4">Back to log in</Link>}
    >
      <ForgotForm />
    </AuthCard>
  );
}
