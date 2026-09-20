import { CustomerNav } from "@/components/customer-nav";
import { Footer } from "@/components/footer";
import { Badge, Card } from "@/components/ui/badge";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { BOOKING_STATUS_COLORS, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { CancelBookingButton } from "@/components/cancel-booking-button";
import { ReviewForm } from "@/components/review-form";

export default async function BookingsPage() {
  const session = await requireAuth(["CUSTOMER", "ADMIN"]);

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    include: {
      salon: { select: { id: true, name: true, slug: true, coverImage: true } },
      service: { select: { name: true, duration: true } },
      staff: { select: { name: true } },
      review: { select: { id: true } },
    },
    orderBy: { date: "desc" },
  });

  const upcoming = bookings.filter((b) =>
    ["PENDING", "CONFIRMED"].includes(b.status)
  );
  const past = bookings.filter((b) =>
    ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(b.status)
  );

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <CustomerNav />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-medium text-brand-600">Your appointments</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-slate-900">My Bookings</h1>
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Upcoming</h2>
          {upcoming.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No upcoming bookings.{" "}
              <Link href="/" className="text-teal-600 hover:underline">
                Discover salons
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcoming.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={
                          booking.salon.coverImage ||
                          "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200"
                        }
                        alt={booking.salon.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/salons/${booking.salon.slug}`}
                            className="font-semibold text-gray-900 hover:text-teal-600"
                          >
                            {booking.salon.name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            {booking.service.name}
                          </p>
                        </div>
                        <Badge className={BOOKING_STATUS_COLORS[booking.status]}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {format(booking.date, "EEE, MMM d, yyyy")} ·{" "}
                        {booking.startTime}
                        {booking.staff && ` · ${booking.staff.name}`}
                      </p>
                      <p className="mt-1 font-medium text-teal-700">
                        {formatPrice(booking.totalPrice)}
                      </p>
                      {["PENDING", "CONFIRMED"].includes(booking.status) && (
                        <CancelBookingButton bookingId={booking.id} />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Past</h2>
            <div className="space-y-4">
              {past.map((booking) => (
                <Card key={booking.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.salon.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.service.name} ·{" "}
                        {format(booking.date, "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge className={BOOKING_STATUS_COLORS[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                  {booking.status === "COMPLETED" && !booking.review && (
                    <ReviewForm
                      salonId={booking.salon.id}
                      bookingId={booking.id}
                      salonName={booking.salon.name}
                    />
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
