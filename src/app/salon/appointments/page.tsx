import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SalonSidebar } from "@/components/salon-sidebar";
import { Card } from "@/components/ui/badge";
import { BookingActions, StatusBadge } from "@/components/booking-actions";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";

export default async function SalonAppointmentsPage() {
  const session = await requireAuth(["SALON_OWNER"]);

  const salon = await prisma.salon.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!salon) return null;

  const bookings = await prisma.booking.findMany({
    where: { salonId: salon.id },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      service: { select: { name: true, duration: true } },
      staff: { select: { name: true } },
    },
    orderBy: [{ date: "desc" }, { startTime: "asc" }],
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SalonSidebar active="/salon/appointments" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-500">Manage all booking requests</p>

        <Card className="mt-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Service
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Date & Time
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {booking.customer.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.customer.phone || booking.customer.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {booking.service.name}
                      {booking.staff && (
                        <span className="block text-xs text-gray-400">
                          with {booking.staff.name}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {format(booking.date, "MMM d, yyyy")}
                      <br />
                      {booking.startTime} – {booking.endTime}
                    </td>
                    <td className="px-5 py-4 font-medium text-teal-700">
                      {formatPrice(booking.totalPrice)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-5 py-4">
                      <BookingActions
                        bookingId={booking.id}
                        status={booking.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
