import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface SalonCardProps {
  salon: {
    id: string;
    slug: string;
    name: string;
    coverImage: string | null;
    address: string;
    city: string;
    rating: number;
    reviewCount: number;
    services?: { price: number }[];
    distance?: number;
  };
}

export function SalonCard({ salon }: SalonCardProps) {
  const minPrice = salon.services?.length
    ? Math.min(...salon.services.map((s) => s.price))
    : null;

  return (
    <Link href={`/salons/${salon.slug}`} className="group block">
      <article className="card-lift overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={
              salon.coverImage ||
              "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600"
            }
            alt={salon.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Rating badge on image */}
          <div className="absolute left-3 top-3">
            <div className="flex items-center gap-1 rounded-xl bg-white/95 px-2.5 py-1.5 shadow-lg backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-800">
                {salon.rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">
                ({salon.reviewCount})
              </span>
            </div>
          </div>

          {salon.distance !== undefined && (
            <span className="absolute right-3 top-3 rounded-xl bg-brand-600/90 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
              {salon.distance.toFixed(1)} km
            </span>
          )}

          {/* Name overlay on image bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display text-lg font-bold text-white drop-shadow-sm">
              {salon.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-white/80">
              <MapPin className="h-3 w-3 shrink-0" />
              {salon.city}
            </p>
          </div>
        </div>

        <div className="p-4">
          <p className="line-clamp-1 text-sm text-slate-500">{salon.address}</p>

          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            {minPrice !== null ? (
              <div>
                <span className="text-xs text-slate-400">Starting from</span>
                <p className="font-display text-lg font-bold text-brand-700">
                  {formatPrice(minPrice)}
                </p>
              </div>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                Open now
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-sm font-semibold text-white shadow-md shadow-brand-600/20 transition group-hover:shadow-lg group-hover:shadow-brand-600/30">
              <Clock className="h-4 w-4" />
              Book Now
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
