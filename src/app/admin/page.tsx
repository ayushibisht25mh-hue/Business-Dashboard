import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Card, StatCard } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Store, Users, Calendar, DollarSign, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await requireAuth(["ADMIN"]);

  const [
    salonCount,
    approvedSalons,
    pendingSalons,
    customerCount,
    bookingCount,
    completedBookings,
    reviewCount,
    recentBookings,
  ] = await Promise.all([
    prisma.salon.count(),
    prisma.salon.count({ where: { status: "APPROVED" } }),
    prisma.salon.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.booking.count(),
    prisma.booking.findMany({
      where: { status: "COMPLETED" },
      select: { totalPrice: true },
    }),
    prisma.review.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true } },
        salon: { select: { name: true } },
        service: { select: { name: true } },
      },
    }),
  ]);

  const gmv = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar active="/admin" />
      <main className="flex-1 p-6 sm:p-8">
        <div>
          <p className="text-sm font-medium text-brand-600">Platform Overview</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Total Salons" value={salonCount} icon={Store} color="bg-brand-50 text-brand-600" sub={pendingSalons > 0 ? `${pendingSalons} pending approval` : undefined} />
          <StatCard label="Active Salons" value={approvedSalons} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" />
          <StatCard label="Customers" value={customerCount} icon={Users} color="bg-blue-50 text-blue-600" />
          <StatCard label="Total Bookings" value={bookingCount} icon={Calendar} color="bg-amber-50 text-amber-600" />
          <StatCard label="GMV (Completed)" value={formatPrice(gmv)} icon={DollarSign} color="bg-purple-50 text-purple-600" />
          <StatCard label="Reviews" value={reviewCount} icon={Star} color="bg-pink-50 text-pink-600" />
        </div>

        <Card className="mt-8 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 className="font-display font-semibold text-slate-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50">
                <div>
                  <p className="font-semibold text-slate-900">
                    {booking.customer.name}
                    <span className="mx-2 text-slate-300">→</span>
                    {booking.salon.name}
                  </p>
                  <p className="text-sm text-slate-500">{booking.service.name}</p>
                </div>
                <span className="font-semibold text-brand-700">
                  {formatPrice(booking.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {pendingSalons > 0 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div>
              <p className="font-semibold text-amber-900">
                {pendingSalons} salon{pendingSalons > 1 ? "s" : ""} awaiting approval
              </p>
              <p className="mt-0.5 text-sm text-amber-700">Review and approve new listings</p>
            </div>
            <Link
              href="/admin/salons"
              className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Review →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
