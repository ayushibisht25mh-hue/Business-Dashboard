import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.service.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.salon.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("Preppy123!", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@preppy.com",
      password,
      role: "ADMIN",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 98765 43210",
      password,
      role: "CUSTOMER",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Rahul Mehta",
      email: "rahul@example.com",
      phone: "+91 98765 43211",
      password,
      role: "CUSTOMER",
    },
  });

  const owner1 = await prisma.user.create({
    data: {
      name: "Ananya Kapoor",
      email: "ananya@glamstudio.com",
      phone: "+91 98765 11111",
      password,
      role: "SALON_OWNER",
    },
  });

  const salon1 = await prisma.salon.create({
    data: {
      name: "Glam Studio",
      slug: "glam-studio",
      description:
        "Premium hair and beauty salon in the heart of Delhi. Expert stylists, luxury ambience, and personalized care.",
      address: "12 Connaught Place, Block A",
      city: "New Delhi",
      latitude: 28.6315,
      longitude: 77.2167,
      phone: "+91 98765 11111",
      email: "hello@glamstudio.com",
      coverImage:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1521590832787-7532a2715eac?w=600",
        "https://images.unsplash.com/photo-1633681926022-84c23e8cb124?w=600",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
      ]),
      openTime: "09:00",
      closeTime: "21:00",
      status: "APPROVED",
      rating: 4.8,
      reviewCount: 124,
      ownerId: owner1.id,
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: "Vikram Singh",
      email: "vikram@urbancut.com",
      phone: "+91 98765 22222",
      password,
      role: "SALON_OWNER",
    },
  });

  const salon2 = await prisma.salon.create({
    data: {
      name: "Urban Cut",
      slug: "urban-cut",
      description:
        "Modern unisex salon with trending styles and affordable pricing. Walk-ins welcome!",
      address: "45 Hauz Khas Village",
      city: "New Delhi",
      latitude: 28.5494,
      longitude: 77.2001,
      phone: "+91 98765 22222",
      coverImage:
        "https://images.unsplash.com/photo-1633681926022-84c23e8cb124?w=800",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600",
      ]),
      openTime: "10:00",
      closeTime: "20:00",
      status: "APPROVED",
      rating: 4.5,
      reviewCount: 89,
      ownerId: owner2.id,
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      name: "Meera Patel",
      email: "meera@blissbeauty.com",
      phone: "+91 98765 33333",
      password,
      role: "SALON_OWNER",
    },
  });

  await prisma.salon.create({
    data: {
      name: "Bliss Beauty Lounge",
      slug: "bliss-beauty-lounge",
      description: "Spa, nails, and beauty treatments in a serene setting.",
      address: "78 Saket District Centre",
      city: "New Delhi",
      latitude: 28.5244,
      longitude: 77.2066,
      phone: "+91 98765 33333",
      coverImage:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600",
      ]),
      status: "PENDING",
      ownerId: owner3.id,
    },
  });

  const services1 = await Promise.all([
    prisma.service.create({
      data: {
        name: "Haircut & Styling",
        description: "Wash, cut, and blow dry",
        price: 800,
        duration: 45,
        category: "Hair",
        salonId: salon1.id,
      },
    }),
    prisma.service.create({
      data: {
        name: "Hair Color",
        description: "Full head color with premium products",
        price: 3500,
        duration: 120,
        category: "Hair",
        salonId: salon1.id,
      },
    }),
    prisma.service.create({
      data: {
        name: "Keratin Treatment",
        description: "Smoothening keratin treatment",
        price: 5000,
        duration: 180,
        category: "Hair",
        salonId: salon1.id,
      },
    }),
    prisma.service.create({
      data: {
        name: "Facial",
        description: "Deep cleansing facial",
        price: 1500,
        duration: 60,
        category: "Skin",
        salonId: salon1.id,
      },
    }),
  ]);

  const services2 = await Promise.all([
    prisma.service.create({
      data: {
        name: "Men's Haircut",
        price: 400,
        duration: 30,
        category: "Hair",
        salonId: salon2.id,
      },
    }),
    prisma.service.create({
      data: {
        name: "Beard Trim",
        price: 200,
        duration: 20,
        category: "Grooming",
        salonId: salon2.id,
      },
    }),
    prisma.service.create({
      data: {
        name: "Hair Spa",
        price: 1200,
        duration: 60,
        category: "Hair",
        salonId: salon2.id,
      },
    }),
  ]);

  const staff1 = await Promise.all([
    prisma.staff.create({
      data: { name: "Riya", role: "Senior Stylist", salonId: salon1.id },
    }),
    prisma.staff.create({
      data: { name: "Karan", role: "Color Specialist", salonId: salon1.id },
    }),
  ]);

  const staff2 = await Promise.all([
    prisma.staff.create({
      data: { name: "Arjun", role: "Barber", salonId: salon2.id },
    }),
  ]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const booking1 = await prisma.booking.create({
    data: {
      date: tomorrow,
      startTime: "11:00",
      endTime: "11:45",
      status: "CONFIRMED",
      totalPrice: 800,
      customerId: customer1.id,
      salonId: salon1.id,
      serviceId: services1[0].id,
      staffId: staff1[0].id,
    },
  });

  await prisma.booking.create({
    data: {
      date: tomorrow,
      startTime: "14:00",
      endTime: "14:30",
      status: "PENDING",
      totalPrice: 400,
      customerId: customer2.id,
      salonId: salon2.id,
      serviceId: services2[0].id,
      staffId: staff2[0].id,
    },
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 2);
  yesterday.setHours(0, 0, 0, 0);

  const completedBooking = await prisma.booking.create({
    data: {
      date: yesterday,
      startTime: "16:00",
      endTime: "16:30",
      status: "COMPLETED",
      totalPrice: 400,
      customerId: customer1.id,
      salonId: salon2.id,
      serviceId: services2[0].id,
      staffId: staff2[0].id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Amazing experience! Riya understood exactly what I wanted.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
      ]),
      customerId: customer1.id,
      salonId: salon1.id,
      bookingId: booking1.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Great fade and super clean shop. Arjun knows his craft!",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1633681926022-84c23e8cb124?w=400",
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400",
      ]),
      customerId: customer2.id,
      salonId: salon2.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 4,
      comment: "Quick service and friendly staff. Will visit again.",
      photos: JSON.stringify([
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
      ]),
      customerId: customer1.id,
      salonId: salon2.id,
      bookingId: completedBooking.id,
    },
  });

  await prisma.booking.create({
    data: {
      date: yesterday,
      startTime: "12:00",
      endTime: "12:45",
      status: "COMPLETED",
      totalPrice: 800,
      customerId: customer2.id,
      salonId: salon1.id,
      serviceId: services1[0].id,
      staffId: staff1[0].id,
    },
  });

  await prisma.favorite.create({
    data: { customerId: customer1.id, salonId: salon1.id },
  });

  console.log("Seed completed!");
  console.log("Admin: admin@preppy.com / Preppy123!");
  console.log("Customer: priya@example.com / Preppy123!");
  console.log("Salon: ananya@glamstudio.com / Preppy123!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
