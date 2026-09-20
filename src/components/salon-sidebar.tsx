import Link from "next/link";
import { getSession } from "@/lib/session";
import { Logo } from "./logo";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Star,
  Settings,
  ExternalLink,
} from "lucide-react";
import { SignOutButton } from "./sign-out-button";

const links = [
  { href: "/salon/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/salon/appointments", label: "Appointments", icon: Calendar },
  { href: "/salon/services", label: "Services", icon: Scissors },
  { href: "/salon/staff", label: "Staff", icon: Users },
  { href: "/salon/reviews", label: "Reviews", icon: Star },
  { href: "/salon/settings", label: "Settings", icon: Settings },
];

export async function SalonSidebar({ active }: { active: string }) {
  const session = await getSession();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <Logo size="sm" />
        <p className="mt-1 pl-1 text-xs font-medium text-brand-600">
          Salon Portal
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active === href
                ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-600/20"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white">
            {session?.user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {session?.user?.name}
            </p>
            <p className="truncate text-xs text-slate-400">
              {session?.user?.email}
            </p>
          </div>
          <SignOutButton />
        </div>
        <Link
          href="/"
          className="mt-2 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          <ExternalLink className="h-3 w-3" />
          View public site
        </Link>
      </div>
    </aside>
  );
}
