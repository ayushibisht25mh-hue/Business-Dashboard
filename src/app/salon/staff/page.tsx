import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SalonSidebar } from "@/components/salon-sidebar";
import { StaffManager } from "@/components/staff-manager";

export default async function SalonStaffPage() {
  const session = await requireAuth(["SALON_OWNER"]);

  const salon = await prisma.salon.findUnique({
    where: { ownerId: session.user.id },
    include: { staff: { orderBy: { name: "asc" } } },
  });
  if (!salon) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SalonSidebar active="/salon/staff" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
        <p className="text-gray-500">Manage your team members</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-semibold text-gray-900">Team</h2>
            {salon.staff.length === 0 ? (
              <p className="text-gray-500">No staff added yet.</p>
            ) : (
              <div className="space-y-2">
                {salon.staff.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                      {member.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <StaffManager />
        </div>
      </main>
    </div>
  );
}
