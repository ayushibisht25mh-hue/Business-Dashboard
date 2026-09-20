import { CustomerNav } from "@/components/customer-nav";
import { Footer } from "@/components/footer";
import { SalonCard } from "@/components/salon-card";
import { LocationBar } from "@/components/location-bar";
import { HomeSearchForm } from "@/components/home-search-form";
import { LocationInitWrapper } from "@/components/location-init-wrapper";
import { prisma } from "@/lib/prisma";
import { getDistanceKm } from "@/lib/utils";
import {
  buildHomeQuery,
  NEARBY_RADIUS_KM,
  parseCoords,
} from "@/lib/location";
import {
  Sparkles,
  Scissors,
  Sparkle,
  Heart,
  Zap,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { label: "Hair", icon: Scissors, query: "hair" },
  { label: "Spa", icon: Sparkle, query: "spa" },
  { label: "Nails", icon: Heart, query: "nail" },
  { label: "Grooming", icon: Zap, query: "grooming" },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    city?: string;
    sort?: string;
    lat?: string;
    lng?: string;
  }>;
}) {
  const params = await searchParams;
  const { lat: userLat, lng: userLng, fromDevice } = parseCoords(
    params.lat,
    params.lng
  );

  const salons = await prisma.salon.findMany({
    where: {
      status: "APPROVED",
      ...(params.q
        ? {
            OR: [
              { name: { contains: params.q, mode: "insensitive" } },
              { city: { contains: params.q, mode: "insensitive" } },
              { address: { contains: params.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(params.city ? { city: { contains: params.city, mode: "insensitive" } } : {}),
    },
    include: {
      services: { select: { price: true } },
    },
    orderBy:
      params.sort === "rating"
        ? { rating: "desc" }
        : params.sort === "reviews"
          ? { reviewCount: "desc" }
          : { createdAt: "desc" },
  });

  let salonsWithDistance = salons
    .map((salon) => ({
      ...salon,
      distance: getDistanceKm(userLat, userLng, salon.latitude, salon.longitude),
    }))
    .sort((a, b) => {
      if (params.sort === "rating") return b.rating - a.rating;
      if (params.sort === "reviews") return b.reviewCount - a.reviewCount;
      return a.distance - b.distance;
    });

  const nearbyOnly = fromDevice
    ? salonsWithDistance.filter((s) => s.distance <= NEARBY_RADIUS_KM)
    : salonsWithDistance;

  const showingExpanded =
    fromDevice &&
    nearbyOnly.length === 0 &&
    salonsWithDistance.length > 0;

  if (nearbyOnly.length > 0) {
    salonsWithDistance = nearbyOnly;
  }

  const coordParams = {
    lat: userLat.toFixed(6),
    lng: userLng.toFixed(6),
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <LocationInitWrapper />
      <CustomerNav />

      {/* Hero */}
      <section className="relative overflow-hidden hero-mesh px-4 py-20 text-white sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-accent-400/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="animate-fade-up flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent-400" />
              Salons near your location
            </span>
          </div>

          <h1 className="animate-fade-up delay-100 mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Look good.
            <br />
            <span className="text-brand-200">Feel preppy.</span>
          </h1>

          <p className="animate-fade-up delay-200 mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            We use your location to find the best salons nearby. Book in 3 taps —
            service, time, confirm.
          </p>

          <HomeSearchForm q={params.q} lat={userLat} lng={userLng} />

          <div className="animate-fade-up delay-300 mt-12 grid grid-cols-3 gap-6 sm:max-w-lg">
            {[
              { value: `${salonsWithDistance.length}`, label: "Nearby" },
              { value: "3 taps", label: "To book" },
              { value: "4.8★", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-slate-200/80 bg-white px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto">
          <span className="shrink-0 text-sm font-semibold text-slate-500">
            Browse:
          </span>
          {CATEGORIES.map(({ label, icon: Icon, query }) => (
            <Link
              key={label}
              href={buildHomeQuery({ ...coordParams, q: query, sort: params.sort })}
              className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              <Icon className="h-4 w-4 text-brand-500" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      <LocationBar
        lat={userLat}
        lng={userLng}
        fromDevice={fromDevice}
        q={params.q}
        sort={params.sort}
      />

      {/* Salon grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {!fromDevice && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <MapPin className="h-4 w-4 shrink-0" />
            Allow location access in your browser to see salons closest to you.
          </div>
        )}

        {showingExpanded && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <MapPin className="h-4 w-4 shrink-0" />
            No salons within {NEARBY_RADIUS_KM} km — showing all available salons
            sorted by distance.
          </div>
        )}

        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              {salonsWithDistance.length} salon
              {salonsWithDistance.length !== 1 ? "s" : ""} near you
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {fromDevice
                ? `Sorted by ${params.sort === "rating" ? "rating" : params.sort === "reviews" ? "reviews" : "distance"}`
                : "Enable location for accurate nearby results"}
            </p>
          </div>
          <Link
            href="/register?role=salon"
            className="hidden rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 sm:inline-flex"
          >
            List your salon →
          </Link>
        </div>

        {salonsWithDistance.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
            <Scissors className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 font-medium text-slate-600">No salons found</p>
            <p className="mt-1 text-sm text-slate-400">
              Try a different search or check back later
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {salonsWithDistance.map((salon, i) => (
              <div
                key={salon.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
              >
                <SalonCard salon={salon} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-14 text-center text-white">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-600/20 to-transparent" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-400">
              For salon owners
            </p>
            <h3 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Grow your business with Preppy
            </h3>
            <p className="mx-auto mt-3 max-w-md text-slate-400">
              Get discovered by customers near your salon. Manage bookings and
              reviews in one place.
            </p>
            <Link
              href="/register?role=salon"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-400 px-8 py-4 font-display font-bold text-white shadow-xl shadow-brand-600/30 transition hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" />
              Register Your Salon — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
