/**
 * Reusable Prisma types for the application
 */

import { Prisma } from '@prisma/client';

/**
 * Player with skills and bossKCs relations
 */
export type PlayerWithRelations = Prisma.PlayerGetPayload<{
  include: {
    skills: true;
    bossKCs: true;
  };
}>;

/**
 * Where clause type for PlayerSnapshot queries
 */
export type PlayerSnapshotWhereInput = Prisma.PlayerSnapshotWhereInput;

/**
 * PlayerNameChange model type
 */
export type PlayerNameChange = Prisma.PlayerNameChangeGetPayload<Record<string, never>>;

