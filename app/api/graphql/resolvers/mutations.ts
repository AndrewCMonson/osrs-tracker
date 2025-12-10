/**
 * GraphQL Mutation Resolvers
 */

import { normalizeUsername } from '@/lib/utils';
import { lookupPlayer } from '@/services/player';
import { Resolvers } from '../generated/types';

export const mutations: Resolvers["Mutation"] = {
  refreshPlayer: async (
    _,
    { username },
    __
  ) => {
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

  claimPlayer: async (
    _,
    { username, token },
    context
  ) => {
    if (!context.userId) {
      return {
        success: false,
        message: null,
        error: 'Unauthorized',
      };
    }

    try {
      // Verify the token
      const verification = await context.prisma.claimVerification.findUnique({
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

      if (verification.userId !== context.userId) {
        return {
          success: false,
          message: null,
          error: 'Verification token does not belong to this user',
        };
      }

      const normalizedUsername = normalizeUsername(username);

      // Check if player exists, create if not
      let player = await context.prisma.player.findUnique({
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
        player = await context.prisma.player.create({
          data: {
            username: normalizedUsername,
            displayName: lookupResult.player.displayName,
            accountType: lookupResult.player.accountType,
            totalLevel: lookupResult.player.totalLevel,
            totalXp: BigInt(lookupResult.player.totalXp),
            combatLevel: lookupResult.player.combatLevel,
            claimedById: context.userId,
          },
        });
      } else {
        // Update existing player
        player = await context.prisma.player.update({
          where: { id: player.id },
          data: {
            claimedById: context.userId,
            updatedAt: new Date(),
          },
        });
      }

      // Mark verification as used (optional - you might want to keep it for history)
      await context.prisma.claimVerification.update({
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

  updatePlayerDisplayName: async (
    _,
    { username, displayName },
    context
  ) => {
    if (!context.userId) {
      return {
        success: false,
        player: null,
        error: 'Unauthorized',
      };
    }

    try {
      const normalizedUsername = normalizeUsername(username);

      const player = await context.prisma.player.findUnique({
        where: { username: normalizedUsername },
      });

      if (!player) {
        return {
          success: false,
          player: null,
          error: 'Player not found',
        };
      }

      if (player.claimedById !== context.userId) {
        return {
          success: false,
          player: null,
          error: 'You do not own this player',
        };
      }

      const updatedPlayer = await context.prisma.player.update({
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
            claimedBy: context.userId,
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
};

