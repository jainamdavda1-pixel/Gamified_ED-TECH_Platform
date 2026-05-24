import { PrismaClient } from "../../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Set up WebSocket support for Node.js environment
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || "";
  
  if (connectionString.includes("localhost") || connectionString.includes("127.0.0.1")) {
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    } as any);
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  } as any);
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;