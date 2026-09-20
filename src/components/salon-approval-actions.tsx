"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SalonApprovalActions({
  salonId,
  status,
}: {
  salonId: string;
  status: string;
}) {
  const router = useRouter();

  async function updateStatus(newStatus: string) {
    await fetch(`/api/admin/salons/${salonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {status === "PENDING" && (
        <>
          <Button size="sm" onClick={() => updateStatus("APPROVED")}>
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => updateStatus("REJECTED")}
          >
            Reject
          </Button>
        </>
      )}
      {status === "APPROVED" && (
        <Button size="sm" variant="outline" onClick={() => updateStatus("SUSPENDED")}>
          Suspend
        </Button>
      )}
      {status === "SUSPENDED" && (
        <Button size="sm" onClick={() => updateStatus("APPROVED")}>
          Reactivate
        </Button>
      )}
    </div>
  );
}
