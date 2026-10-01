"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Wrench,
  GitBranch,
  BarChart3,
  Wallet,
  ScrollText,
  Settings,
  ArrowLeft,
} from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ size?: number }> };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  { title: "Dashboard", items: [{ label: "Overview", href: "/admin", icon: LayoutDashboard }] },
  {
    title: "User Management",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    ],
  },
  {
    title: "Communication",
    items: [{ label: "Notifications", href: "/admin/notifications", icon: Bell }],
  },
  {
    title: "Tool Management",
    items: [
      { label: "Tools Registry", href: "/admin/tools", icon: Wrench },
      { label: "Workflows", href: "/admin/workflows", icon: GitBranch },
    ],
  },
  {
    title: "Global Analytics",
    items: [
      { label: "Platform Usage", href: "/admin/usage", icon: BarChart3 },
      { label: "Revenue & Payouts", href: "/admin/revenue", icon: Wallet },
    ],
  },
  {
    title: "System Administration",
    items: [
      { label: "System Logs", href: "/admin/logs", icon: ScrollText },
      { label: "Admin Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-[#171126] text-white/80 flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center overflow-hidden rounded-xl bg-white shadow-sm"><Image src="/images/logo.png" alt="Verified Glam" width={40} height={40} className="size-10 object-contain" /></span>
          <span><span className="block font-extrabold text-white">Verified Glam</span><span className="block text-[11px] uppercase tracking-wide text-white/50">Admin</span></span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV.map((group) => (
          <div key={group.title}>
            <p className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-wide text-white/40">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-(--color-burgundy) text-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        <p className="px-2 text-xs text-white/40 truncate">{email}</p>
        <Link href="/app/face-beauty-analysis" className="flex items-center gap-2 px-2.5 py-2 text-sm font-medium text-white/70 hover:text-white">
          <ArrowLeft size={16} />
          Exit to app
        </Link>
      </div>
    </aside>
  );
}
