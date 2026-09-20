import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SalonSidebar } from "@/components/salon-sidebar";
import { Card, Badge } from "@/components/ui/badge";
import { SALON_STATUS_COLORS } from "@/lib/utils";

export default async function SalonSettingsPage() {
  const session = await requireAuth(["SALON_OWNER"]);

  const salon = await prisma.salon.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!salon) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SalonSidebar active="/salon/settings" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Salon profile information</p>

        <Card className="mt-8 max-w-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{salon.name}</h2>
            <Badge className={SALON_STATUS_COLORS[salon.status]}>
              {salon.status}
            </Badge>
          </div>
          <dl className="space-y-4 text-sm">
            {[
              ["Description", salon.description],
              ["Address", `${salon.address}, ${salon.city}`],
              ["Phone", salon.phone],
              ["Email", salon.email || "—"],
              ["Hours", `${salon.openTime} – ${salon.closeTime}`],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dt className="font-medium text-gray-500">{label}</dt>
                <dd className="mt-0.5 text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>
          {salon.status === "PENDING" && (
            <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Your salon is pending admin approval. Once approved, customers will
              be able to discover and book your salon.
            </p>
          )}
        </Card>
      </main>
    </div>
  );
}
