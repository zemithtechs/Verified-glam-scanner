import { DashShell } from "@/components/DashShell";

export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DashShell>{children}</DashShell>;
}
