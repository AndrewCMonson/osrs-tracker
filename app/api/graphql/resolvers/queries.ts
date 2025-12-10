/**
 * GraphQL Query Resolvers
 */

import { db } from '@/lib/db';
import { normalizeUsername } from '@/lib/utils';
import { calculatePlayerMilestones, getNearest99s } from '@/services/milestone';
import { getNameChangeHistory, getPlayerIdByUsername } from '@/services/name-change';
import { lookupPlayer } from '@/services/player';
import { getAllSkillsHistory, getTotalXpHistory } from '@/services/snapshot';
import { Resolvers } from '../generated/types';

export const queries: Resolvers['Query'] = {
  player: async (_, { username }) => {
    const result = await lookupPlayer(username);

    if (!result.success || !result.player) {
      return null;
    }

    // Check if player is claimed
    try {
      const dbPlayer = await db.player.findUnique({
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

  players: async (_, { claimed }, { userId }) => {
    if (claimed === true) {
      // Return only claimed players for the authenticated user
      if (!userId) {
        return [];
      }

      const players = await db.player.findMany({
        where: {
          claimedById: userId,
        },
        include: {
          skills: true,
          bossKCs: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      // Return Prisma players directly - field resolvers will handle transformation
      return players;
    }

    // For unclaimed or all players, we'd need to fetch from OSRS API
    // This is expensive, so we'll return empty for now
    // In a real implementation, you might want to cache or limit this
    return [];
  },

  dashboard: async (_, __, { userId }) => {
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const players = await db.player.findMany({
      where: {
        claimedById: userId,
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

  milestones: async (_, { username }) => {
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

  history: async (_, { username, period }) => {
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

  nameChangeHistory: async (_, { username }) => {
    const playerId = await getPlayerIdByUsername(normalizeUsername(username));

    if (!playerId) {
      return [];
    }

    const nameChanges = await getNameChangeHistory(playerId);

    return nameChanges.map((nc) => ({
      id: nc.id,
      oldUsername: nc.oldUsername,
      newUsername: nc.newUsername,
      createdAt: nc.createdAt,
    }));
  },
};

