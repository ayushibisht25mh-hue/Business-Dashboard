import { notFound } from "next/navigation";
import Image from "next/image";
import { CustomerNav } from "@/components/customer-nav";
import { Footer } from "@/components/footer";
import { BookingForm } from "@/components/booking-form";
import { FavoriteButton } from "@/components/favorite-button";
import { StarRating } from "@/components/ui/badge";
import { ReviewPhotos } from "@/components/review-photos";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseJsonArray, generateTimeSlots, formatPrice } from "@/lib/utils";
import { MapPin, Clock, Phone, Star } from "lucide-react";
import { format } from "date-fns";

export default async function SalonProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSession();

  const salon = await prisma.salon.findUnique({
    where: { slug },
    include: {
      services: { orderBy: { price: "asc" } },
      staff: true,
      reviews: {
        include: { customer: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!salon || salon.status !== "APPROVED") notFound();

  const favorite = session?.user
    ? await prisma.favorite.findUnique({
        where: {
          customerId_salonId: {
            customerId: session.user.id,
            salonId: salon.id,
          },
        },
      })
    : null;

  const images = parseJsonArray(salon.images);
  const timeSlots = generateTimeSlots(salon.openTime, salon.closeTime, 30);

  const reviewStats = await prisma.review.aggregate({
    where: { salonId: salon.id },
    _avg: { rating: true },
    _count: true,
  });

  const averageRating = reviewStats._avg.rating ?? salon.rating;
  const totalReviews = reviewStats._count || salon.reviewCount;

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <CustomerNav />

      {/* Cover */}
      <div className="relative h-72 sm:h-96">
        <Image
          src={
            salon.coverImage ||
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200"
          }
          alt={salon.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <FavoriteButton
            salonId={salon.id}
            initialFavorited={!!favorite}
            isLoggedIn={!!session?.user}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
                  {salon.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <StarRating
                    rating={averageRating}
                    light
                    showAverageLabel
                  />
                  <span className="text-sm font-medium text-white/90">
                    {totalReviews}{" "}
                    {totalReviews === 1 ? "review" : "reviews"}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Open now
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* Quick info cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: MapPin, label: "Location", value: `${salon.city}` },
                { icon: Clock, label: "Hours", value: `${salon.openTime} – ${salon.closeTime}` },
                { icon: Phone, label: "Contact", value: salon.phone },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                    <Icon className="h-4 w-4 text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-slate-900">About</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{salon.description}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-brand-500" />
                {salon.address}, {salon.city}
              </p>
            </div>

            {/* Photos */}
            {images.length > 0 && (
              <div>
                <h2 className="mb-4 font-display text-lg font-bold text-slate-900">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={img}
                        alt={`${salon.name} photo ${i + 1}`}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            <div>
              <h2 className="mb-4 font-display text-lg font-bold text-slate-900">
                Services & Pricing
              </h2>
              <div className="space-y-2">
                {salon.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:border-brand-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xs font-bold text-brand-700">
                        {service.duration}m
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{service.name}</p>
                        <p className="text-xs text-slate-400">{service.category}</p>
                      </div>
                    </div>
                    <span className="font-display text-lg font-bold text-brand-700">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                Customer Reviews
                <span className="text-base font-normal text-slate-400">
                  ({totalReviews} · {averageRating.toFixed(1)} avg)
                </span>
              </h2>
              {salon.reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-12 text-center text-slate-400">
                  No reviews yet. Be the first!
                </div>
              ) : (
                <div className="space-y-4">
                  {salon.reviews.map((review) => {
                    const reviewPhotos = parseJsonArray(review.photos);

                    return (
                    <div
                      key={review.id}
                      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white">
                            {review.customer.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {review.customer.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {format(review.createdAt, "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                          {review.comment}
                        </p>
                      )}
                      <ReviewPhotos photos={reviewPhotos} />
                      {review.response && (
                        <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm">
                          <p className="font-semibold text-brand-800">Salon response</p>
                          <p className="mt-1 text-brand-700">{review.response}</p>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sticky booking sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BookingForm
              salonId={salon.id}
              services={salon.services}
              staff={salon.staff}
              timeSlots={timeSlots}
              isLoggedIn={!!session?.user}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
