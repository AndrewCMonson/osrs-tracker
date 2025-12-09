/**
 * Name change query functions
 */

import { db, isDatabaseAvailable } from '@/lib/db';
import { normalizeUsername } from '@/lib/utils';
import { isNameChangeModelAvailable } from './helpers';

/**
 * Find the current username for a player, following the chain of name changes
 */
export async function getCurrentUsername(username: string): Promise<string | null> {
  if (!isDatabaseAvailable() || !isNameChangeModelAvailable()) {
    return null;
  }

  const normalized = normalizeUsername(username);

  try {
    // First, check if this username exists as a current player
    const player = await db.player.findUnique({
      where: { username: normalized },
    });

    if (player) {
      // Get the most recent name change for this player
      const latestNameChange = await db.playerNameChange.findFirst({
        where: { playerId: player.id },
        orderBy: { createdAt: 'desc' },
      });

      // If there's a name change, return the new username, otherwise return the original
      return latestNameChange ? latestNameChange.newUsername : normalized;
    }

    // Check if this username is in the name change history (as an old username)
    const nameChange = await db.playerNameChange.findFirst({
      where: { oldUsername: normalized },
      orderBy: { createdAt: 'desc' },
      include: { player: true },
    });

    if (nameChange) {
      // Follow the chain to find the current username
      return await getCurrentUsername(nameChange.newUsername);
    }

    return null;
  } catch (error) {
    console.error('Error finding current username:', error);
    return null;
  }
}

/**
 * Find the player ID for a username, following name changes
 */
export async function getPlayerIdByUsername(username: string): Promise<string | null> {
  if (!isDatabaseAvailable() || !isNameChangeModelAvailable()) {
    return null;
  }

  const normalized = normalizeUsername(username);

  try {
    // First, check if this username exists as a current player
    const player = await db.player.findUnique({
      where: { username: normalized },
    });

    if (player) {
      return player.id;
    }

    // Check if this username is in the name change history
    const nameChange = await db.playerNameChange.findFirst({
      where: { oldUsername: normalized },
      orderBy: { createdAt: 'desc' },
      include: { player: true },
    });

    if (nameChange) {
      return nameChange.playerId;
    }

    return null;
  } catch (error) {
    console.error('Error finding player ID:', error);
    return null;
  }
}

/**
 * Get all name changes for a player
 */
export async function getNameChangeHistory(playerId: string) {
  if (!isDatabaseAvailable() || !isNameChangeModelAvailable()) {
    return [];
  }

  try {
    return await db.playerNameChange.findMany({
      where: { playerId },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching name change history:', error);
    return [];
  }
}

