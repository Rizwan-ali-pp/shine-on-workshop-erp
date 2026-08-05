import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { DEFAULT_SERVICES } from "./seed/default-services";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding default services...");

  for (const service of DEFAULT_SERVICES) {
    const existing = await prisma.service.findFirst({
      where: {
        name: service.name,
      },
    });

    if (!existing) {
      await prisma.service.create({
        data: service,
      });
    }
  }

  console.log("✅ Default services seeded successfully.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });