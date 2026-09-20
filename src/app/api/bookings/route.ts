import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { addMinutesToTime } from "@/lib/utils";
import { z } from "zod";

const bookingSchema = z.object({
  salonId: z.string(),
  serviceId: z.string(),
  staffId: z.string().optional(),
  date: z.string(),
  startTime: z.string(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = bookingSchema.parse(body);

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const bookingDate = new Date(data.date);
    bookingDate.setHours(0, 0, 0, 0);

    const endTime = addMinutesToTime(data.startTime, service.duration);

    const conflict = await prisma.booking.findFirst({
      where: {
        salonId: data.salonId,
        date: bookingDate,
        startTime: data.startTime,
        status: { in: ["PENDING", "CONFIRMED"] },
        ...(data.staffId ? { staffId: data.staffId } : {}),
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "This time slot is no longer available" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        date: bookingDate,
        startTime: data.startTime,
        endTime,
        totalPrice: service.price,
        notes: data.notes,
        customerId: session.user.id,
        salonId: data.salonId,
        serviceId: data.serviceId,
        staffId: data.staffId || null,
        status: "PENDING",
      },
      include: {
        salon: { select: { name: true } },
        service: { select: { name: true } },
      },
    });

    return NextResponse.json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    include: {
      salon: { select: { name: true, slug: true, coverImage: true } },
      service: { select: { name: true, duration: true } },
      staff: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(bookings);
}
