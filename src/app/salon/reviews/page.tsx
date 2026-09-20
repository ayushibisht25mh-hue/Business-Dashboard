import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SalonSidebar } from "@/components/salon-sidebar";
import { Card } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/badge";
import { ReviewPhotos } from "@/components/review-photos";
import { parseJsonArray } from "@/lib/utils";
import { format } from "date-fns";
import { Star } from "lucide-react";

export default async function SalonReviewsPage() {
  const session = await requireAuth(["SALON_OWNER"]);

  const salon = await prisma.salon.findUnique({
    where: { ownerId: session.user.id },
    include: {
      reviews: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!salon) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SalonSidebar active="/salon/reviews" />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
            <p className="text-gray-500">See what customers are saying</p>
          </div>
          <StarRating rating={salon.rating} />
        </div>

        <div className="mt-8 space-y-4">
          {salon.reviews.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No reviews yet.
            </Card>
          ) : (
            salon.reviews.map((review) => (
              <Card key={review.id} className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">
                    {review.customer.name}
                  </p>
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                )}
                <ReviewPhotos photos={parseJsonArray(review.photos)} />
                <p className="mt-1 text-xs text-gray-400">
                  {format(review.createdAt, "MMM d, yyyy")}
                </p>
                {review.response && (
                  <div className="mt-3 rounded-lg bg-teal-50 p-3 text-sm">
                    <p className="font-medium text-teal-800">Your response:</p>
                    <p className="text-teal-700">{review.response}</p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
