import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalDatabase = globalThis as unknown as {
  cyclorivaPrisma?: PrismaClient;
};
export const prisma =
  globalDatabase.cyclorivaPrisma ??
  new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5000,
    }),
  });
if (process.env.NODE_ENV !== "production")
  globalDatabase.cyclorivaPrisma = prisma;
