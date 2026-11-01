import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// Automatically handle Vercel's serverless read-only filesystem for SQLite
if (process.env.VERCEL) {
  const tmpDb = "/tmp/dev.db";
  const bundledDb = path.join(process.cwd(), "prisma", "dev.db");

  if (!fs.existsSync(tmpDb) && fs.existsSync(bundledDb)) {
    try {
      fs.copyFileSync(bundledDb, tmpDb);
    } catch (err) {
      console.warn("[Vercel DB Init] Notice copying dev.db:", err);
    }
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
