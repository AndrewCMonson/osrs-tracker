/**
 * Database client - Prisma
 * 
 * NOTE: If DATABASE_URL is not set or Prisma client is not generated,
 * this will use a mock client. The app will work without a database,
 * but progress tracking features will be disabled.
 */

/**
 * Create a mock database client that returns empty results
 */
function createMockDb() {
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
  return new Proxy({} as any, {
    get: () => mockModel,
  });
}

let prisma: any;
let db: any;

try {
  // Try to import PrismaClient
  const { PrismaClient } = require('@prisma/client');
  
  const globalForPrisma = globalThis as unknown as {
    prisma: any;
  };

  prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }

  db = prisma;
} catch (error) {
  // Prisma client not available (not generated or no DATABASE_URL)
  // Use mock client that returns empty results
  prisma = createMockDb();
  db = prisma;
}

export { prisma, db };
export default prisma;

