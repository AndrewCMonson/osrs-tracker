/**
 * GraphQL Context - provides authentication and database access
 */

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

export interface GraphQLContext {
  session: Awaited<ReturnType<typeof auth>>;
  prisma: PrismaClient | ReturnType<typeof createMockDb>;
  userId?: string;
}

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
    updateMany: async () => ({}),
    findUniqueOrThrow: async () => null,
    findFirstOrThrow: async () => null,
  };

  // Create a proxy that returns mockModel for any property access
  return new Proxy({} as Record<string, unknown>, {
    get: () => mockModel,
  });
}

/**
 * Create GraphQL context from request
 */
export async function createContext(): Promise<GraphQLContext> {
  const session = await auth();

  return {
    session,
    prisma: prisma as PrismaClient,
    userId: session?.user?.id as string | undefined,
  };
}
