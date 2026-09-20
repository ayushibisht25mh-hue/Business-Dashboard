import { CustomerNav } from "@/components/customer-nav";
import { Footer } from "@/components/footer";
import { SalonCard } from "@/components/salon-card";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getDistanceKm } from "@/lib/utils";

export default async function FavoritesPage() {
  const session = await requireAuth(["CUSTOMER"]);

  const favorites = await prisma.favorite.findMany({
    where: { customerId: session.user.id },
    include: {
      salon: {
        include: { services: { select: { price: true } } },
      },
    },
  });

  const userLat = 28.6139;
  const userLng = 77.209;

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <CustomerNav />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-sm font-medium text-brand-600">Your saved places</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-slate-900">Saved Salons</h1>
        </div>
        {favorites.length === 0 ? (
          <p className="mt-8 text-center text-gray-500">
            No saved salons yet. Heart a salon to save it here.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map(({ salon }) => (
              <SalonCard
                key={salon.id}
                salon={{
                  ...salon,
                  distance: getDistanceKm(
                    userLat,
                    userLng,
                    salon.latitude,
                    salon.longitude
                  ),
                }}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
