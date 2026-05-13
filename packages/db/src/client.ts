import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create adapter outside the singleton check
function createPrismaClient() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Cloudflare Workers / Production: use Neon serverless driver
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL!
    });
    return new PrismaClient({ adapter, log: ["error"] });
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });

  return new PrismaClient({
    adapter,
    log: !isProduction ? ["warn", "error"] : ["error"],
  });
}

// Still use singleton pattern
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Clean up on hot reload
if (process.env.NODE_ENV === "development") {
  process.once("SIGTERM", async () => {
    await prisma.$disconnect();
  });
}
