# Deploy Preppy to Vercel

Complete guide to host Preppy in production.

---

## Overview

| Service | Purpose | Cost |
|---------|---------|------|
| [Vercel](https://vercel.com) | Host Next.js app | Free tier |
| [Neon](https://neon.tech) | PostgreSQL database | Free tier |
| GitHub | Source code | Free |

---

## Step 1 — Create a Neon PostgreSQL database

1. Go to [neon.tech](https://neon.tech) and sign up
2. Click **New Project**
3. Name it `preppy` and choose a region close to your users
4. Copy the **connection string** (looks like):
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

---

## Step 2 — Push code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment with PostgreSQL"
git push origin main
```

Repo: `https://github.com/Anujnegi157/Salon-Project`

---

## Step 3 — Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import **Anujnegi157/Salon-Project**
3. Framework: **Next.js** (auto-detected)
4. Root directory: `./` (or `Salon-Project` if repo is nested)

---

## Step 4 — Add environment variables

In Vercel → **Settings → Environment Variables**, add:

| Variable | Value | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | Your Neon connection string (see below) | Production Preview Development |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` | Production Preview Development |
| `NEXTAUTH_URL` | `https://YOUR-APP.vercel.app` | Production only (after first deploy) |

### DATABASE_URL — copy exactly like this (no extra quotes):

```
postgresql://neondb_owner:YOUR_PASSWORD@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Important:**
- Paste the URL without wrapping it in `"` quotes in Vercel
- Must start with `postgresql://` — NOT `file:./dev.db` (SQLite won't work)
- Check all 3 environments (Production, Preview, Development) are ticked
- After adding variables, you must **Redeploy** (env vars don't apply to past builds)

---

## Step 5 — Deploy

Click **Deploy**. Vercel will:

1. `npm install`
2. `prisma generate`
3. `prisma migrate deploy` (creates tables)
4. `next build`

---

## Step 6 — Seed demo data (one time)

From your computer, with the **production** `DATABASE_URL`:

```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://..."
npm run db:seed
```

```bash
# Mac/Linux
DATABASE_URL="postgresql://..." npm run db:seed
```

### Demo logins after seed

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@preppy.com | Preppy123! |
| Customer | priya@example.com | Preppy123! |
| Salon | ananya@glamstudio.com | Preppy123! |

---

## Step 7 — Fix login (after first deploy)

1. Note your live URL: `https://preppy-xxx.vercel.app`
2. Vercel → Settings → Environment Variables
3. Set `NEXTAUTH_URL` = your full URL (no trailing slash)
4. Redeploy: Deployments → ⋮ → Redeploy

---

## Local development with PostgreSQL

Update your local `.env`:

```env
DATABASE_URL="postgresql://..."   # same Neon DB or a separate dev branch
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-local-secret"
```

Then:

```bash
npm install
npm run db:push    # or: npx prisma migrate deploy
npm run db:seed
npm run dev
```

---

## Troubleshooting

### `Environment variable not found: DATABASE_URL`
Add `DATABASE_URL` in Vercel environment variables and redeploy.

### Build fails: `URL must start with postgresql://` (P1012)

**Cause:** `DATABASE_URL` is missing, wrong, or still set to SQLite (`file:./dev.db`).

**Fix:**
1. Vercel → Settings → Environment Variables
2. Edit or add `DATABASE_URL` = your Neon URL starting with `postgresql://`
3. Enable for **Production, Preview, and Development**
4. Remove any `"` quotes around the value
5. Deployments → Redeploy

### Login redirects fail
Set `NEXTAUTH_URL` to your exact Vercel domain and redeploy.

### No salons showing
Run `npm run db:seed` against production `DATABASE_URL`.

---

## Custom domain (optional)

1. Vercel → Settings → Domains → Add domain
2. Update DNS records as shown
3. Set `NEXTAUTH_URL=https://yourdomain.com`
4. Redeploy
