"use client";

import { Search } from "lucide-react";

interface HomeSearchFormProps {
  q?: string;
  lat: number;
  lng: number;
}

export function HomeSearchForm({ q, lat, lng }: HomeSearchFormProps) {
  return (
    <form className="animate-fade-up delay-300 mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
      <input type="hidden" name="lat" value={lat.toFixed(6)} />
      <input type="hidden" name="lng" value={lng.toFixed(6)} />
      <div className="relative flex-1">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search salons, services, areas..."
          className="w-full rounded-2xl border-0 bg-white py-4 pl-14 pr-5 text-slate-900 shadow-2xl shadow-black/20 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-white/30"
        />
      </div>
      <button
        type="submit"
        className="rounded-2xl bg-gradient-to-r from-accent-500 to-accent-400 px-8 py-4 font-display font-bold text-white shadow-xl shadow-accent-500/30 transition hover:shadow-2xl hover:brightness-110 active:scale-[0.98]"
      >
        Search
      </button>
    </form>
  );
}
