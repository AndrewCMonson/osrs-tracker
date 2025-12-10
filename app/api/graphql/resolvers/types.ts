/**
 * GraphQL Type & Field Resolvers
 * 
 * Contains:
 * - Scalar resolvers (DateTime, BigInt)
 * - Field resolvers for mapping Prisma/OSRS types to GraphQL types
 */

import { BossKcModel, PlayerModel, PlayerWithRelations } from '@/types/prisma';
import { SkillData, SkillMap } from '../generated/types';

/**
 * Type guard to check if parent is PlayerWithRelations (from Prisma)
 */
function isPrismaPlayer(parent: PlayerModel): parent is PlayerWithRelations {
  return 'skills' in parent && Array.isArray(parent.skills);
}

/**
 * Type guard to check if boss is from Prisma (has 'kc' field)
 */
function isPrismaBoss(parent: BossKcModel): parent is { id: string; playerId: string; bossName: string; kc: number; rank: number } {
  return 'kc' in parent;
}

/**
 * Scalar resolvers for custom types
 */
export const scalarResolvers = {
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
    parseLiteral: (ast: { kind: string; value: string }) => {
      if (ast.kind === 'StringValue') {
        return new Date(ast.value);
      }
      return null;
    },
  },

  BigInt: {
    serialize: (value: bigint | number) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return String(value);
    },
    parseValue: (value: string | number) => {
      if (typeof value === 'string') {
        return BigInt(value);
      }
      return BigInt(value);
    },
    parseLiteral: (ast: { kind: string; value: string }) => {
      if (ast.kind === 'IntValue' || ast.kind === 'StringValue') {
        return BigInt(ast.value);
      }
      return null;
    },
  },
};

/**
 * Player field resolvers - handle both Prisma and OSRS API player types
 */
export const playerResolvers = {
  skills: (parent: PlayerModel) => {
    // OSRS Player already has the correct structure
    if (!isPrismaPlayer(parent)) {
      return parent.skills;
    }

    // Transform Prisma Skill[] array to SkillMap object
    const skillsMap: Partial<Record<string, SkillData>> = {};
    parent.skills.forEach((skill) => {
      skillsMap[skill.name] = {
        level: skill.level,
        xp: skill.xp,
        rank: skill.rank,
      };
    });

    return {
      overall: {
        level: parent.totalLevel,
        xp: parent.totalXp,
        rank: 0,
      },
      skills: skillsMap as SkillMap,
    };
  },

  bosses: (parent: PlayerModel) => {
    // OSRS Player - transform bosses object to array
    if (!isPrismaPlayer(parent)) {
      if (!parent.bosses) return [];
      return Object.entries(parent.bosses)
        .filter(([, data]) => data && data.killCount > 0)
        .map(([bossName, data]) => ({
          bossName,
          killCount: data!.killCount,
          rank: data!.rank || 0,
        }));
    }

    // Prisma Player - return bossKCs array (BossKC.killCount resolver handles kc -> killCount)
    return parent.bossKCs;
  },

  lastUpdated: (parent: PlayerModel) => {
    if (!isPrismaPlayer(parent)) return parent.lastUpdated;
    return parent.updatedAt;
  },

  claimedBy: (parent: PlayerModel) => {
    if (!isPrismaPlayer(parent)) return parent.claimedBy || null;
    return parent.claimedById || null;
  },

  claimedAt: (parent: PlayerModel) => {
    if (!isPrismaPlayer(parent)) return parent.claimedAt || null;
    return parent.updatedAt;
  },
};

/**
 * BossKC field resolvers - transform Prisma BossKC.kc to GraphQL BossKC.killCount
 */
export const bossResolvers = {
  killCount: (parent: BossKcModel) => {
    // Prisma BossKC has 'kc', OSRS transformed has 'killCount'
    if (isPrismaBoss(parent)) return parent.kc;
    return parent.killCount;
  },
};
