/**
 * Name change mutation functions
 */

import { db, isDatabaseAvailable } from '@/lib/db';
import { normalizeUsername } from '@/lib/utils';
import { getPlayerIdByUsername } from './queries';
import { validateNameChange } from './validation';
import { isNameChangeModelAvailable } from './helpers';

/**
 * Submit a name change
 */
export async function submitNameChange(
  oldUsername: string,
  newUsername: string
): Promise<{
  success: boolean;
  error?: string;
  playerId?: string;
}> {
  if (!isDatabaseAvailable() || !isNameChangeModelAvailable()) {
    return {
      success: false,
      error: 'Database is not available or name change feature is not set up. Please run: npx prisma generate && npx prisma migrate dev',
    };
  }

  const normalizedOld = normalizeUsername(oldUsername);
  const normalizedNew = normalizeUsername(newUsername);

  // Validate inputs
  if (normalizedOld === normalizedNew) {
    return {
      success: false,
      error: 'Old and new usernames cannot be the same',
    };
  }

  try {
    // Find the player by old username (or follow name change chain)
    const playerId = await getPlayerIdByUsername(normalizedOld);

    if (!playerId) {
      return {
        success: false,
        error: 'Old username not found in our database',
      };
    }

    // Check if this exact name change already exists
    const existingChange = await db.playerNameChange.findFirst({
      where: {
        playerId,
        oldUsername: normalizedOld,
        newUsername: normalizedNew,
      },
    });

    if (existingChange) {
      return {
        success: false,
        error: 'This name change has already been recorded',
      };
    }

    // Validate the name change (checks old username no longer exists, new exists, stats match)
    const validation = await validateNameChange(normalizedOld, normalizedNew);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'Invalid name change',
      };
    }

    // Get the old player record
    const oldPlayer = await db.player.findUnique({
      where: { id: playerId },
      include: {
        snapshots: true,
        skills: true,
        bossKCs: true,
        milestones: true,
        nameChanges: true,
      },
    });

    if (!oldPlayer) {
      return {
        success: false,
        error: 'Old player record not found',
      };
    }

    // Check if new player already exists
    const newPlayer = await db.player.findUnique({
      where: { username: normalizedNew },
    });

    // Use a transaction to ensure data integrity
    const result = await db.$transaction(async (tx: typeof db) => {
      if (newPlayer && newPlayer.id !== oldPlayer.id) {
        // New player exists as a separate record - merge data
        // Move all snapshots to new player
        await tx.playerSnapshot.updateMany({
          where: { playerId: oldPlayer.id },
          data: { playerId: newPlayer.id },
        });

        // Move skills to new player (upsert to handle conflicts)
        for (const skill of oldPlayer.skills) {
          await tx.skill.upsert({
            where: {
              playerId_name: {
                playerId: newPlayer.id,
                name: skill.name,
              },
            },
            create: {
              playerId: newPlayer.id,
              name: skill.name,
              level: skill.level,
              xp: skill.xp,
              rank: skill.rank,
            },
            update: {
              level: skill.level,
              xp: skill.xp,
              rank: skill.rank,
            },
          });
        }

        // Move boss KCs to new player
        for (const bossKC of oldPlayer.bossKCs) {
          await tx.bossKC.upsert({
            where: {
              playerId_bossName: {
                playerId: newPlayer.id,
                bossName: bossKC.bossName,
              },
            },
            create: {
              playerId: newPlayer.id,
              bossName: bossKC.bossName,
              kc: bossKC.kc,
              rank: bossKC.rank,
            },
            update: {
              kc: bossKC.kc,
              rank: bossKC.rank,
            },
          });
        }

        // Move milestones to new player
        await tx.milestone.updateMany({
          where: { playerId: oldPlayer.id },
          data: { playerId: newPlayer.id },
        });

        // Update name changes to point to new player
        await tx.playerNameChange.updateMany({
          where: { playerId: oldPlayer.id },
          data: { playerId: newPlayer.id },
        });

        // Create the new name change record pointing to new player
        const nameChange = await tx.playerNameChange.create({
          data: {
            playerId: newPlayer.id,
            oldUsername: normalizedOld,
            newUsername: normalizedNew,
            validated: validation.verified || false,
          },
        });

        // Delete the old player record (cascades will clean up related records)
        await tx.player.delete({
          where: { id: oldPlayer.id },
        });

        return { playerId: newPlayer.id, nameChange };
      } else {
        // New player doesn't exist or is the same - update old player's username
        // Actually, we can't change username (unique constraint)
        // So we need to create a new player record and move everything

        // Create new player record with data from old player
        const createdPlayer = await tx.player.create({
          data: {
            username: normalizedNew,
            displayName: normalizedNew,
            accountType: oldPlayer.accountType,
            totalLevel: oldPlayer.totalLevel,
            totalXp: oldPlayer.totalXp,
            combatLevel: oldPlayer.combatLevel,
            claimedById: oldPlayer.claimedById,
          },
        });

        // Move all snapshots to new player
        await tx.playerSnapshot.updateMany({
          where: { playerId: oldPlayer.id },
          data: { playerId: createdPlayer.id },
        });

        // Move skills to new player
        await tx.skill.updateMany({
          where: { playerId: oldPlayer.id },
          data: { playerId: createdPlayer.id },
        });

        // Move boss KCs to new player
        await tx.bossKC.updateMany({
          where: { playerId: oldPlayer.id },
          data: { playerId: createdPlayer.id },
        });

        // Move milestones to new player
        await tx.milestone.updateMany({
          where: { playerId: oldPlayer.id },
          data: { playerId: createdPlayer.id },
        });

        // Update existing name changes to point to new player
        await tx.playerNameChange.updateMany({
          where: { playerId: oldPlayer.id },
          data: { playerId: createdPlayer.id },
        });

        // Create the new name change record
        const nameChange = await tx.playerNameChange.create({
          data: {
            playerId: createdPlayer.id,
            oldUsername: normalizedOld,
            newUsername: normalizedNew,
            validated: validation.verified || false,
          },
        });

        // Delete the old player record
        await tx.player.delete({
          where: { id: oldPlayer.id },
        });

        return { playerId: createdPlayer.id, nameChange };
      }
    });

    return {
      success: true,
      playerId: result.playerId,
    };
  } catch (error) {
    console.error('Error submitting name change:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `An error occurred while submitting the name change: ${errorMessage}`,
    };
  }
}

