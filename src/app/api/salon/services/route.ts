import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  duration: z.number().positive(),
  category: z.string().default("General"),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "SALON_OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const salon = await prisma.salon.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!salon) {
    return NextResponse.json({ error: "Salon not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const data = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: { ...data, salonId: salon.id },
    });

    return NextResponse.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "SALON_OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const salon = await prisma.salon.findUnique({
    where: { ownerId: session.user.id },
  });
  if (!salon) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.service.deleteMany({ where: { id, salonId: salon.id } });
  return NextResponse.json({ success: true });
}
