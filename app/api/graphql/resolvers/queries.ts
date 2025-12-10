/**
 * GraphQL Query Resolvers
 */

import { normalizeUsername } from '@/lib/utils';
import { calculatePlayerMilestones, getNearest99s } from '@/services/milestone';
import { lookupPlayer } from '@/services/player';
import { getAllSkillsHistory, getTotalXpHistory } from '@/services/snapshot';
import { PlayerWithRelations } from '@/types/prisma';
import { Resolvers } from '../generated/types';

export const queries: Resolvers['Query'] = {
  player: async (
    _,
    { username },
    context
  ) => {
    const result = await lookupPlayer(username);

    if (!result.success || !result.player) {
      return null;
    }

    // Check if player is claimed
    try {
      const dbPlayer = await context.prisma.player.findUnique({
        where: { username: normalizeUsername(username) },
        select: { claimedById: true, updatedAt: true },
      });

      if (dbPlayer?.claimedById) {
        return {
          ...result.player,
          claimedBy: dbPlayer.claimedById,
          claimedAt: dbPlayer.updatedAt,
        };
      }
    } catch (error) {
      // If database lookup fails, continue without claimed status
      console.error('Failed to load claimedBy status:', error);
    }

    return result.player;
  },

  players: async (
    _,
    { claimed },
    context
  ) => {
    if (claimed === true) {
      // Return only claimed players for the authenticated user
      if (!context.userId) {
        return [];
      }

      const players: PlayerWithRelations[] = await context.prisma.player.findMany({
        where: {
          claimedById: context.userId,
        },
        include: {
          skills: true,
          bossKCs: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      // Convert database players to GraphQL format
      // Note: This manually constructs Player objects from DB data
      // The structure should match the GraphQL Player type
      return players.map((player) => ({
        id: player.id,
        username: player.username,
        displayName: player.displayName || player.username,
        accountType: player.accountType,
        totalLevel: player.totalLevel,
        totalXp: player.totalXp,
        combatLevel: player.combatLevel,
        skills: {
          overall: {
            level: player.totalLevel,
            xp: player.totalXp,
            rank: 0, // Not stored in DB
          },
          skills: player.skills.reduce((acc, skill) => {
            acc[skill.name] = {
              level: skill.level,
              xp: skill.xp,
              rank: skill.rank,
            };
            return acc;
          }, {} as Record<string, { level: number; xp: bigint; rank: number }>),
        },
        bosses: player.bossKCs.map((boss) => ({
          bossName: boss.bossName,
          killCount: boss.kc,
          rank: boss.rank,
        })),
        lastUpdated: player.updatedAt,
        claimedBy: player.claimedById || undefined,
        claimedAt: player.updatedAt,
      })) as any; // Type assertion needed due to manual construction from DB
    }

    // For unclaimed or all players, we'd need to fetch from OSRS API
    // This is expensive, so we'll return empty for now
    // In a real implementation, you might want to cache or limit this
    return [];
  },

  dashboard: async (
    _,
    __,
    context
  ) => {
    if (!context.userId) {
      throw new Error('Unauthorized');
    }

    const players: PlayerWithRelations[] = await context.prisma.player.findMany({
      where: {
        claimedById: context.userId,
      },
      include: {
        skills: true,
        bossKCs: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const totalXp = players.reduce((sum, player) => {
      return sum + Number(player.totalXp);
    }, 0);

    const totalLevels = players.reduce((sum, player) => {
      return sum + player.totalLevel;
    }, 0);

    const skillXpMap = new Map<string, bigint>();
    players.forEach((player) => {
      player.skills.forEach((skill) => {
        const currentXp = skillXpMap.get(skill.name) || BigInt(0);
        skillXpMap.set(skill.name, currentXp + skill.xp);
      });
    });

    const skillXp = Object.fromEntries(
      Array.from(skillXpMap.entries()).map(([name, xp]) => [name, xp])
    );

    return {
      accounts: players.map((player) => ({
        id: player.id,
        username: player.username,
        displayName: player.displayName || player.username,
        accountType: player.accountType,
        totalLevel: player.totalLevel,
        totalXp: player.totalXp,
        combatLevel: player.combatLevel,
        lastUpdated: player.updatedAt,
      })),
      totals: {
        totalXp: BigInt(totalXp),
        totalLevels,
        accountCount: players.length,
        skillXp,
      },
    };
  },

  milestones: async (
    _,
    { username },
    __
  ) => {
    const result = await lookupPlayer(username);

    if (!result.success || !result.player) {
      throw new Error(result.error || 'Player not found');
    }

    const player = result.player;
    const allMilestones = calculatePlayerMilestones(player);
    const nearest99s = getNearest99s(player, 5);

    const achieved = allMilestones.filter((m) => m.status === 'achieved');
    const inProgress = allMilestones
      .filter((m) => m.status === 'in_progress')
      .sort((a, b) => b.progress - a.progress);

    return {
      username: player.username,
      stats: {
        totalMilestones: allMilestones.length,
        achieved: achieved.length,
        inProgress: inProgress.length,
        completionPercentage: (achieved.length / allMilestones.length) * 100,
      },
      nearest99s: nearest99s.slice(0, 5),
      achieved: achieved.slice(0, 50),
      inProgress: inProgress.slice(0, 50),
    };
  },

  history: async (
    _,
    { username, period },
    __
  ) => {
    const periodValue = (period || 'all') as 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';

    const [skillsHistory, totalHistory] = await Promise.all([
      getAllSkillsHistory(username, periodValue),
      getTotalXpHistory(username, periodValue),
    ]);

    return {
      skills: skillsHistory.map((sh) => ({
        skill: sh.skill,
        dataPoints: sh.dataPoints.map((dp) => ({
          date: dp.date,
          level: dp.level,
          xp: BigInt(dp.xp),
          rank: dp.rank,
        })),
      })),
      total: totalHistory.map((th) => ({
        date: th.date,
        totalXp: BigInt(th.totalXp),
        totalLevel: th.totalLevel,
      })),
    };
  },
};

