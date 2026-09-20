import { copyFileSync, existsSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

const ENV_CONTENT = `# Get a free PostgreSQL database at https://neon.tech
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="preppy-dev-secret-change-in-production"
`;

const envPath = resolve(process.cwd(), ".env");

if (!existsSync(envPath)) {
  if (existsSync(".env.example")) {
    copyFileSync(".env.example", ".env");
  } else {
    writeFileSync(envPath, ENV_CONTENT, { encoding: "utf8" });
  }
  console.log("✓ Created .env at:", envPath);
} else {
  console.log("✓ .env already exists at:", envPath);
}

console.log("\n→ Running migrations...");
execSync("npx prisma migrate deploy", { stdio: "inherit" });

console.log("\n→ Seeding demo data...");
execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });

console.log("\n✓ Setup complete! Run: npm run dev");
