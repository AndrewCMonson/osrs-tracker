/**
 * GraphQL Mutation Resolvers
 */

import { db } from '@/lib/db';
import { normalizeUsername } from '@/lib/utils';
import { lookupPlayer } from '@/services/player';
import { savePlayerSnapshot } from '@/services/snapshot';
import { Resolvers } from '../generated/types';

export const mutations: Resolvers['Mutation'] = {
  refreshPlayer: async (_, { username }) => {
    const result = await lookupPlayer(username);

    if (!result.success || !result.player) {
      return {
        success: false,
        player: null,
        error: result.error || 'Failed to refresh player data',
      };
    }

    return {
      success: true,
      player: result.player,
      error: null,
    };
  },

  claimPlayer: async (_, { username, token }, { userId }) => {
    if (!userId) {
      return {
        success: false,
        message: null,
        error: 'Unauthorized',
      };
    }

    try {
      // Verify the token
      const verification = await db.claimVerification.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!verification) {
        return {
          success: false,
          message: null,
          error: 'Invalid verification token',
        };
      }

      if (verification.status !== 'verified') {
        return {
          success: false,
          message: null,
          error: 'Verification token not verified',
        };
      }

      if (verification.userId !== userId) {
        return {
          success: false,
          message: null,
          error: 'Verification token does not belong to this user',
        };
      }

      const normalizedUsername = normalizeUsername(username);

      // Check if player exists, create if not
      let player = await db.player.findUnique({
        where: { username: normalizedUsername },
      });

      if (!player) {
        // Player doesn't exist in DB yet, fetch from OSRS API first
        const lookupResult = await lookupPlayer(username);
        if (!lookupResult.success || !lookupResult.player) {
          return {
            success: false,
            message: null,
            error: 'Player not found',
          };
        }

        // Create player in database
        player = await db.player.create({
          data: {
            username: normalizedUsername,
            displayName: lookupResult.player.displayName,
            accountType: lookupResult.player.accountType,
            totalLevel: lookupResult.player.totalLevel,
            totalXp: BigInt(lookupResult.player.totalXp),
            combatLevel: lookupResult.player.combatLevel,
            claimedById: userId,
          },
        });
      } else {
        // Update existing player
        player = await db.player.update({
          where: { id: player.id },
          data: {
            claimedById: userId,
            updatedAt: new Date(),
          },
        });
      }

      // Mark verification as used (optional - you might want to keep it for history)
      await db.claimVerification.update({
        where: { id: verification.id },
        data: { status: 'verified' },
      });

      return {
        success: true,
        message: `Successfully claimed player ${username}`,
        error: null,
      };
    } catch (error) {
      console.error('Error claiming player:', error);
      return {
        success: false,
        message: null,
        error: error instanceof Error ? error.message : 'Failed to claim player',
      };
    }
  },

  updatePlayerDisplayName: async (_, { username, displayName }, { userId }) => {
    if (!userId) {
      return {
        success: false,
        player: null,
        error: 'Unauthorized',
      };
    }

    try {
      const normalizedUsername = normalizeUsername(username);

      const player = await db.player.findUnique({
        where: { username: normalizedUsername },
      });

      if (!player) {
        return {
          success: false,
          player: null,
          error: 'Player not found',
        };
      }

      if (player.claimedById !== userId) {
        return {
          success: false,
          player: null,
          error: 'You do not own this player',
        };
      }

      const updatedPlayer = await db.player.update({
        where: { id: player.id },
        data: { displayName },
      });

      // Fetch full player data
      const result = await lookupPlayer(username);
      if (result.success && result.player) {
        return {
          success: true,
          player: {
            ...result.player,
            displayName,
            claimedBy: userId,
          },
          error: null,
        };
      }

      return {
        success: false,
        player: null,
        error: 'Failed to fetch updated player data',
      };
    } catch (error) {
      console.error('Error updating player display name:', error);
      return {
        success: false,
        player: null,
        error: error instanceof Error ? error.message : 'Failed to update display name',
      };
    }
  },

  createSnapshot: async (_, { username }) => {
    try {
      // Fetch fresh player data from OSRS API
      const result = await lookupPlayer(username);

      if (!result.success || !result.player) {
        return {
          success: false,
          snapshot: null,
          error: result.error || 'Failed to fetch player data',
        };
      }

      // Save the snapshot
      await savePlayerSnapshot(result.player, true);

      // Get the latest snapshot from the database
      const normalizedUsername = normalizeUsername(username);
      const dbPlayer = await db.player.findUnique({
        where: { username: normalizedUsername },
        select: { id: true },
      });

      if (!dbPlayer) {
        return {
          success: true,
          snapshot: null,
          error: null,
        };
      }

      const snapshot = await db.playerSnapshot.findFirst({
        where: { playerId: dbPlayer.id },
        orderBy: { createdAt: 'desc' },
        include: {
          skills: true,
          bosses: true,
        },
      });

      return {
        success: true,
        snapshot: snapshot
          ? {
            id: snapshot.id,
            playerId: snapshot.playerId,
            totalLevel: snapshot.totalLevel,
            totalXp: snapshot.totalXp,
            combatLevel: snapshot.combatLevel,
            createdAt: snapshot.createdAt,
            skills: snapshot.skills.map((s) => ({
              name: s.name,
              level: s.level,
              xp: s.xp,
              rank: s.rank,
            })),
            bosses: snapshot.bosses.map((b) => ({
              bossName: b.bossName,
              kc: b.kc,
              rank: b.rank,
            })),
          }
          : null,
        error: null,
      };
    } catch (error) {
      console.error('Error creating snapshot:', error);
      return {
        success: false,
        snapshot: null,
        error: error instanceof Error ? error.message : 'Failed to create snapshot',
      };
    }
  },
};

