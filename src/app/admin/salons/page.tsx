import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Card, Badge } from "@/components/ui/badge";
import { SALON_STATUS_COLORS } from "@/lib/utils";
import { SalonApprovalActions } from "@/components/salon-approval-actions";

export default async function AdminSalonsPage() {
  await requireAuth(["ADMIN"]);

  const salons = await prisma.salon.findMany({
    include: {
      owner: { select: { name: true, email: true } },
      _count: { select: { bookings: true, reviews: true, services: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar active="/admin/salons" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Salons</h1>
        <p className="text-gray-500">Approve and manage salon listings</p>

        <Card className="mt-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Salon</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Owner</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">City</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Services</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Bookings</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {salons.map((salon) => (
                  <tr key={salon.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {salon.name}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {salon.owner.name}
                      <br />
                      <span className="text-xs text-gray-400">
                        {salon.owner.email}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{salon.city}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {salon._count.services}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {salon._count.bookings}
                    </td>
                    <td className="px-5 py-4">
                      <Badge className={SALON_STATUS_COLORS[salon.status]}>
                        {salon.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <SalonApprovalActions
                        salonId={salon.id}
                        status={salon.status}
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
