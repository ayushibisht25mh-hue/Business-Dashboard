import Link from "next/link";
import { getSession } from "@/lib/session";
import {
  LayoutDashboard,
  Store,
  Users,
  Calendar,
  Star,
  Shield,
  ExternalLink,
} from "lucide-react";
import { SignOutButton } from "./sign-out-button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/salons", label: "Salons", icon: Store },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export async function AdminSidebar({ active }: { active: string }) {
  const session = await getSession();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-slate-950 text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-600/30">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-bold">Preppy</p>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active === href
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold">
            {session?.user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{session?.user?.name}</p>
            <p className="truncate text-xs text-slate-500">{session?.user?.email}</p>
          </div>
          <SignOutButton />
        </div>
        <Link
          href="/"
          className="mt-2 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-brand-400 hover:text-brand-300"
        >
          <ExternalLink className="h-3 w-3" />
          View public site
        </Link>
      </div>
    </aside>
  );
}
