import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Card } from "@/components/ui/badge";
import { StatusBadge } from "@/components/booking-actions";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

export default async function AdminBookingsPage() {
  await requireAuth(["ADMIN"]);

  const bookings = await prisma.booking.findMany({
    include: {
      customer: { select: { name: true } },
      salon: { select: { name: true } },
      service: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar active="/admin/bookings" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500">{bookings.length} total bookings</p>

        <Card className="mt-8 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Customer</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Salon</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Service</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Amount</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {booking.customer.name}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{booking.salon.name}</td>
                  <td className="px-5 py-4 text-gray-600">{booking.service.name}</td>
                  <td className="px-5 py-4 text-gray-600">
                    {format(booking.date, "MMM d")} {booking.startTime}
                  </td>
                  <td className="px-5 py-4 font-medium text-teal-700">
                    {formatPrice(booking.totalPrice)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </div>
  );
}
