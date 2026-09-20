import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Card, Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function AdminUsersPage() {
  await requireAuth(["ADMIN"]);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { salon: { select: { name: true } } },
  });

  const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-800",
    SALON_OWNER: "bg-teal-100 text-teal-800",
    CUSTOMER: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar active="/admin/users" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500">{users.length} registered users</p>

        <Card className="mt-8 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Role</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Salon</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-5 py-4 text-gray-600">{user.email}</td>
                  <td className="px-5 py-4">
                    <Badge className={roleColors[user.role]}>{user.role}</Badge>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {user.salon?.name || "—"}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {format(user.createdAt, "MMM d, yyyy")}
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
