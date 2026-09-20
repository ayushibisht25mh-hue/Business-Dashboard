import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SalonSidebar } from "@/components/salon-sidebar";
import { Card, Badge, StatCard } from "@/components/ui/badge";
import { BOOKING_STATUS_COLORS, formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar, DollarSign, Star, Users } from "lucide-react";
import Link from "next/link";

export default async function SalonDashboardPage() {
  const session = await requireAuth(["SALON_OWNER"]);

  const salon = await prisma.salon.findUnique({
    where: { ownerId: session.user.id },
    include: {
      bookings: {
        include: {
          customer: { select: { name: true, phone: true } },
          service: { select: { name: true } },
        },
        orderBy: { date: "asc" },
        take: 10,
      },
      _count: { select: { bookings: true, reviews: true, services: true } },
    },
  });

  if (!salon) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>No salon found. Please contact support.</p>
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayBookings = salon.bookings.filter(
    (b) => b.date.toDateString() === today.toDateString()
  );
  const pendingCount = salon.bookings.filter((b) => b.status === "PENDING").length;
  const revenue = salon.bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      <SalonSidebar active="/salon/dashboard" />
      <main className="flex-1 p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-brand-600">Salon Dashboard</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-slate-900">
              {salon.name}
            </h1>
          </div>
          {salon.status === "PENDING" && (
            <Badge className="bg-amber-100 text-amber-800">
              Pending Approval
            </Badge>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Today's Appointments"
            value={todayBookings.length}
            icon={Calendar}
            color="bg-brand-50 text-brand-600"
          />
          <StatCard
            label="Pending Requests"
            value={pendingCount}
            icon={Users}
            color="bg-amber-50 text-amber-600"
            sub={pendingCount > 0 ? "Needs action" : undefined}
          />
          <StatCard
            label="Total Bookings"
            value={salon._count.bookings}
            icon={Calendar}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Revenue"
            value={formatPrice(revenue)}
            icon={DollarSign}
            color="bg-emerald-50 text-emerald-600"
          />
        </div>

        <Card className="mt-8 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="font-display font-semibold text-slate-900">
              Recent Appointments
            </h2>
            <Link
              href="/salon/appointments"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {salon.bookings.length === 0 ? (
              <p className="p-10 text-center text-slate-400">
                No appointments yet.
              </p>
            ) : (
              salon.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                      {booking.customer.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {booking.customer.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {booking.service.name} ·{" "}
                        {format(booking.date, "MMM d")} at {booking.startTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-brand-700">
                      {formatPrice(booking.totalPrice)}
                    </span>
                    <Badge className={BOOKING_STATUS_COLORS[booking.status]}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          <p className="text-sm font-medium text-brand-800">
            Your rating:{" "}
            <span className="font-bold">{salon.rating.toFixed(1)}</span> ·{" "}
            {salon.reviewCount} reviews
          </p>
        </div>
      </main>
    </div>
  );
}
