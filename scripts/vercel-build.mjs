import { execSync } from "child_process";

const url = process.env.DATABASE_URL?.trim();

if (!url) {
  console.error(`
❌ DATABASE_URL is not set on Vercel.

Fix:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add DATABASE_URL with your Neon connection string:
   postgresql://user:pass@host/neondb?sslmode=require
3. Enable for: Production, Preview, Development
4. Do NOT wrap the value in extra quotes
5. Redeploy
`);
  process.exit(1);
}

if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
  console.error(`
❌ DATABASE_URL must start with postgresql:// or postgres://

Current value starts with: "${url.slice(0, 30)}..."

Common mistakes:
- Using SQLite URL (file:./dev.db) — use your Neon PostgreSQL URL instead
- Extra quotes around the URL in Vercel (paste without quotes)
- Wrong variable name (must be exactly DATABASE_URL)
`);
  process.exit(1);
}

console.log("✓ DATABASE_URL looks valid");

execSync("npx prisma generate", { stdio: "inherit" });
execSync("npx prisma migrate deploy", { stdio: "inherit" });
execSync("npx next build", { stdio: "inherit" });
