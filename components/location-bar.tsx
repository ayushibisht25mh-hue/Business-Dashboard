"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { buildHomeQuery } from "@/lib/location";

interface LocationBarProps {
  lat: number;
  lng: number;
  fromDevice: boolean;
  q?: string;
  sort?: string;
}

export function LocationBar({ lat, lng, fromDevice, q, sort }: LocationBarProps) {
  const [label, setLabel] = useState(fromDevice ? "Your location" : "New Delhi");
  const [loading, setLoading] = useState(fromDevice);

  useEffect(() => {
    if (!fromDevice) {
      setLabel("New Delhi");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "PreppySalonApp/1.0",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.suburb ||
          data.address?.state_district ||
          data.address?.state ||
          "Your location";
        setLabel(city);
      })
      .catch(() => {
        if (!cancelled) setLabel("Near you");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, fromDevice]);

  const baseParams = {
    lat: lat.toFixed(6),
    lng: lng.toFixed(6),
    q,
    sort,
  };

  return (
    <section className="sticky top-[4.25rem] z-40 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl bg-brand-50 px-3 py-1.5">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
          ) : fromDevice ? (
            <Navigation className="h-4 w-4 text-brand-600" />
          ) : (
            <MapPin className="h-4 w-4 text-brand-600" />
          )}
          <span className="text-sm font-semibold text-brand-800">
            {loading ? "Detecting location..." : label}
          </span>
        </div>
        <div className="h-5 w-px bg-slate-200" />
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Nearest", value: "distance" },
            { label: "Top Rated", value: "rating" },
            { label: "Most Reviewed", value: "reviews" },
          ].map((filter) => (
            <Link
              key={filter.value}
              href={buildHomeQuery({ ...baseParams, sort: filter.value, q })}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                (sort || "distance") === filter.value
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
