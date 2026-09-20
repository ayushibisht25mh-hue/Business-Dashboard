import Link from "next/link";
import { getSession } from "@/lib/session";
import { Logo } from "./logo";
import { Heart, Calendar, Sparkles } from "lucide-react";
import { SignOutButton } from "./sign-out-button";

export async function CustomerNav() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/60">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo size="md" />

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
          >
            Discover
          </Link>
          {session?.user && (
            <>
              <Link
                href="/bookings"
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
              >
                <Calendar className="h-4 w-4" />
                Bookings
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
              >
                <Heart className="h-4 w-4" />
                Favorites
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <div className="flex items-center gap-2">
              {session.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="hidden rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 sm:inline-flex"
                >
                  Admin
                </Link>
              )}
              {session.user.role === "SALON_OWNER" && (
                <Link
                  href="/salon/dashboard"
                  className="hidden rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700 sm:inline-flex"
                >
                  Dashboard
                </Link>
              )}
              <div className="hidden items-center gap-2 rounded-full bg-slate-100 py-1 pl-1 pr-3 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[120px] truncate text-sm font-medium text-slate-700">
                  {session.user.name}
                </span>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition hover:shadow-lg hover:shadow-brand-600/30"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
