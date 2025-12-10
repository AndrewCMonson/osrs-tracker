/**
 * Database client - Prisma
 *
 * NOTE: If DATABASE_URL is not set or Prisma client is not generated,
 * this will use a mock client. The app will work without a database,
 * but progress tracking features will be disabled.
 */

import { PrismaClient } from '@prisma/client';

/**
 * Create a mock database client that returns empty results
 */
function createMockDb(): PrismaClient {
  const mockModel = {
    findMany: async () => [],
    findFirst: async () => null,
    findUnique: async () => null,
    create: async () => ({}),
    upsert: async () => ({}),
    update: async () => ({}),
    delete: async () => ({}),
    findUniqueOrThrow: async () => null,
    findFirstOrThrow: async () => null,
  };

  // Create a proxy that returns mockModel for any property access
  return new Proxy({} as PrismaClient, {
    get: () => mockModel,
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;
let db: PrismaClient;

// Check if DATABASE_URL is set and Prisma client is available
if (process.env.DATABASE_URL) {
  try {
    prisma =
      globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma;
    }

    db = prisma;
  } catch {
    // Prisma client not generated yet - use mock
    console.warn('Prisma client not generated. Run: npx prisma generate');
    prisma = createMockDb();
    db = prisma;
  }
} else {
  // No DATABASE_URL - use mock client
  prisma = createMockDb();
  db = prisma;
}

export { db, prisma };
export default prisma;

