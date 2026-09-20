import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Card } from "@/components/ui/badge";
import { ReviewPhotos } from "@/components/review-photos";
import { parseJsonArray } from "@/lib/utils";
import { format } from "date-fns";
import { Star } from "lucide-react";

export default async function AdminReviewsPage() {
  await requireAuth(["ADMIN"]);

  const reviews = await prisma.review.findMany({
    include: {
      customer: { select: { name: true } },
      salon: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar active="/admin/reviews" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-500">Moderate customer reviews</p>

        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {review.customer.name} on {review.salon.name}
                  </p>
                  <div className="mt-1 flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {format(review.createdAt, "MMM d, yyyy")}
                </span>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
              )}
              <ReviewPhotos photos={parseJsonArray(review.photos)} />
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
