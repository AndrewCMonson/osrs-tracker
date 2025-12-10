/**
 * GraphQL Context - provides authentication and database access
 */

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PrismaClient } from '@prisma/client';
import type { Session } from 'next-auth';

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  userId?: string;
}

/**
 * Create GraphQL context from request
 */
export async function createContext(): Promise<GraphQLContext> {
  const session: Session | null = await auth();

  // Ensure we have a real PrismaClient, not a mock
  // GraphQL requires a database connection to function properly
  if (!(prisma instanceof PrismaClient)) {
    throw new Error('Database not available. Please configure DATABASE_URL and run prisma generate.');
  }

  return {
    session,
    prisma,
    userId: session?.user?.id as string | undefined,
  };
}

