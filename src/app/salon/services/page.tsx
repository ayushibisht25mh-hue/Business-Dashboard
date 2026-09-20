import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SalonSidebar } from "@/components/salon-sidebar";
import { ServiceManager } from "@/components/service-manager";
import { formatPrice } from "@/lib/utils";

export default async function SalonServicesPage() {
  const session = await requireAuth(["SALON_OWNER"]);

  const salon = await prisma.salon.findUnique({
    where: { ownerId: session.user.id },
    include: { services: { orderBy: { name: "asc" } } },
  });
  if (!salon) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SalonSidebar active="/salon/services" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        <p className="text-gray-500">Manage your service menu and pricing</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-semibold text-gray-900">Current Services</h2>
            {salon.services.length === 0 ? (
              <p className="text-gray-500">No services added yet.</p>
            ) : (
              <div className="space-y-2">
                {salon.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500">
                        {service.duration} min · {service.category}
                      </p>
                    </div>
                    <span className="font-semibold text-teal-700">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ServiceManager />
        </div>
      </main>
    </div>
  );
}
