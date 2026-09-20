import Link from "next/link";
import { Logo } from "./logo";
import { Scissors, Instagram, Mail } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Logo size="md" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              India&apos;s premium salon discovery platform. Book top-rated salons
              in 3 taps — service, time, confirm.
            </p>
            <div className="mt-5 flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: XIcon, label: "X" },
                { Icon: Mail, label: "Email" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-brand-50 hover:text-brand-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-slate-900">
              For Customers
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              <li><Link href="/" className="transition hover:text-brand-600">Discover Salons</Link></li>
              <li><Link href="/bookings" className="transition hover:text-brand-600">My Bookings</Link></li>
              <li><Link href="/favorites" className="transition hover:text-brand-600">Saved Salons</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-slate-900">
              For Salons
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-500">
              <li><Link href="/register?role=salon" className="transition hover:text-brand-600">List Your Salon</Link></li>
              <li><Link href="/salon/dashboard" className="transition hover:text-brand-600">Salon Dashboard</Link></li>
              <li><Link href="/login" className="transition hover:text-brand-600">Partner Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Preppy. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Scissors className="h-3 w-3" />
            Look good. Feel preppy.
          </div>
        </div>
      </div>
    </footer>
  );
}
