# Preppy — Salon Booking Marketplace

A two-sided salon marketplace built with **Next.js 15**, connecting customers with salons.

## Tech Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS 4
- **Prisma** + **PostgreSQL** (Neon)
- **NextAuth.js** — customer, salon owner, admin roles
- **Vercel** — production hosting

## Local Development

```bash
npm install
cp .env.example .env          # add your Neon DATABASE_URL
npm run setup                 # migrate + seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@preppy.com | Preppy123! |
| Customer | priya@example.com | Preppy123! |
| Salon | ananya@glamstudio.com | Preppy123! |

## Deploy to Vercel

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide.

Quick summary:
1. Create free DB at [neon.tech](https://neon.tech)
2. Push to GitHub
3. Import on [vercel.com](https://vercel.com)
4. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
5. Deploy → seed production DB

## Project Structure

```
src/app/          # Pages (customer, salon, admin)
src/components/   # UI components
src/lib/          # Auth, prisma, utils
prisma/           # Schema + migrations
```

## License

MIT
