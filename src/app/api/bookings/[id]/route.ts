import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { salon: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isCustomer = booking.customerId === session.user.id;
  const isSalonOwner =
    session.user.role === "SALON_OWNER" &&
    booking.salon.ownerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isCustomer && !isSalonOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
