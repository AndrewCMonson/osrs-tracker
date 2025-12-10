/**
 * Reusable Prisma types for the application
 */

import { Prisma } from '@prisma/client';
import { Player as OsrsPlayer } from './player';

/**
 * Player with skills and bossKCs relations (from Prisma)
 */
export type PlayerWithRelations = Prisma.PlayerGetPayload<{
  include: {
    skills: true;
    bossKCs: true;
  };
}>;

/**
 * Union type for GraphQL Player resolvers
 * - PlayerWithRelations: from Prisma queries (claimed players)
 * - OsrsPlayer: from OSRS API lookups
 */
export type PlayerModel = PlayerWithRelations | OsrsPlayer;

/**
 * Union type for GraphQL BossKC resolvers
 * - Prisma BossKC (has 'kc' field)
 * - Plain object (has 'killCount' field from OSRS API transformation)
 */
export type BossKcModel =
  | Prisma.BossKCGetPayload<Record<string, never>>
  | { bossName: string; killCount: number; rank: number };

/**
 * Where clause type for PlayerSnapshot queries
 */
export type PlayerSnapshotWhereInput = Prisma.PlayerSnapshotWhereInput;

/**
 * PlayerNameChange model type
 */
export type PlayerNameChange = Prisma.PlayerNameChangeGetPayload<Record<string, never>>;

