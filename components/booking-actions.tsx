"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BOOKING_STATUS_COLORS } from "@/lib/utils";

export function BookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const router = useRouter();

  async function updateStatus(newStatus: string) {
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  if (status === "CANCELLED" || status === "COMPLETED") return null;

  return (
    <div className="flex gap-2">
      {status === "PENDING" && (
        <>
          <Button size="sm" onClick={() => updateStatus("CONFIRMED")}>
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateStatus("CANCELLED")}
          >
            Reject
          </Button>
        </>
      )}
      {status === "CONFIRMED" && (
        <Button size="sm" onClick={() => updateStatus("COMPLETED")}>
          Mark Complete
        </Button>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={BOOKING_STATUS_COLORS[status] || "bg-gray-100 text-gray-800"}>
      {status}
    </Badge>
  );
}
