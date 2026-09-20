"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();

  async function cancel() {
    if (!confirm("Cancel this booking?")) return;
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mt-2 text-red-600 hover:bg-red-50"
      onClick={cancel}
    >
      Cancel booking
    </Button>
  );
}
