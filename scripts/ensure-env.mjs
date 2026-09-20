import { copyFileSync, existsSync, writeFileSync } from "fs";
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
  console.log("  → Add your Neon PostgreSQL DATABASE_URL before running db commands");
} else {
  console.log("✓ .env found at:", envPath);
}
