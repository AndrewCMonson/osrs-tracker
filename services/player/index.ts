/**
 * Player service - handles player lookups and data management
 */

import { Player, PlayerProfile, AccountType } from '@/types/player';
import { calculateCombatLevel } from '@/types/milestones';
import { SKILLS } from '@/types/skills';
import { fetchPlayerHiscores, getMockPlayer, shouldUseMock, OsrsPlayerData } from '../osrs';
import { calculatePlayerMilestones } from '../milestone';
import { normalizeUsername } from '@/lib/utils';
import { savePlayerSnapshot } from '../snapshot';
import { getCurrentUsername } from '../name-change';

/**
 * Calculate actual total level from individual skills (capped at 99 each)
 */
function calculateTotalLevel(skills: Record<string, { level: number }>): number {
  return SKILLS.reduce((total, skill) => {
    const level = skills[skill]?.level ?? 1;
    return total + Math.min(level, 99); // Cap at 99 for total level calculation
  }, 0);
}

export interface PlayerLookupResult {
  success: boolean;
  player?: Player;
  error?: string;
}

/**
 * Look up a player by username with parallel API calls for speed
 */
export async function lookupPlayer(username: string): Promise<PlayerLookupResult> {
  const normalized = normalizeUsername(username);

  // Check for name changes - if this is an old username, get the current one
  let lookupUsername = normalized;
  try {
    const currentUsername = await getCurrentUsername(normalized);
    if (currentUsername && currentUsername !== normalized) {
      lookupUsername = currentUsername;
    }
  } catch (error) {
    // If name change lookup fails, continue with original username
    console.error('Error checking name changes:', error);
  }

  // Use mock data if enabled
  if (shouldUseMock()) {
    const mockPlayer = getMockPlayer(lookupUsername);
    if (mockPlayer) {
      return { success: true, player: mockPlayer };
    }
  }

  try {
    // Run all API calls in parallel for speed
    const [mainResult, hardcoreResult, ultimateResult, ironmanResult] = await Promise.allSettled([
      fetchPlayerHiscores(lookupUsername, 'hiscore_oldschool'),
      fetchPlayerHiscores(lookupUsername, 'hiscore_oldschool_hardcore_ironman'),
      fetchPlayerHiscores(lookupUsername, 'hiscore_oldschool_ultimate'),
      fetchPlayerHiscores(lookupUsername, 'hiscore_oldschool_ironman'),
    ]);

    // Main hiscores must succeed
    if (mainResult.status !== 'fulfilled') {
      throw mainResult.reason;
    }

    // Determine account type and use the appropriate hiscores data
    // Check in order of restrictiveness - use ironman-specific ranks when applicable
    let accountType: AccountType = 'normal';
    let data: OsrsPlayerData = mainResult.value;

    if (hardcoreResult.status === 'fulfilled') {
      accountType = 'hardcore_ironman';
      data = hardcoreResult.value; // Use HCIM hiscores for ranks
    } else if (ultimateResult.status === 'fulfilled') {
      accountType = 'ultimate_ironman';
      data = ultimateResult.value; // Use UIM hiscores for ranks
    } else if (ironmanResult.status === 'fulfilled') {
      accountType = 'ironman';
      data = ironmanResult.value; // Use ironman hiscores for ranks
    }

    // Calculate combat level
    const combatLevel = calculateCombatLevel({
      attack: data.skills.skills.attack.level,
      strength: data.skills.skills.strength.level,
      defence: data.skills.skills.defence.level,
      hitpoints: data.skills.skills.hitpoints.level,
      prayer: data.skills.skills.prayer.level,
      ranged: data.skills.skills.ranged.level,
      magic: data.skills.skills.magic.level,
    });

    // Calculate actual total level (not virtual level from hiscores)
    const totalLevel = calculateTotalLevel(data.skills.skills);

    const player: Player = {
      id: `osrs-${lookupUsername}`,
      username: lookupUsername,
      displayName: lookupUsername, // Use the current username for display
      accountType,
      combatLevel,
      totalLevel,
      totalXp: data.skills.overall.xp,
      skills: data.skills,
      bosses: data.bosses,
      lastUpdated: new Date(),
    };

    // Save snapshot in background (non-blocking)
    savePlayerSnapshot(player).catch((err) => {
      console.error('Failed to save snapshot:', err);
    });

    return { success: true, player };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Get full player profile with milestones
 */
export async function getPlayerProfile(username: string): Promise<PlayerProfile | null> {
  const result = await lookupPlayer(username);
  
  if (!result.success || !result.player) {
    return null;
  }

  const player = result.player;
  
  // Load claimedBy status from database if available
  let claimedBy: string | undefined;
  let claimedAt: Date | undefined;
  try {
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/db');
      const dbPlayer = await prisma.player.findUnique({
        where: { username: normalizeUsername(username) },
        select: { claimedById: true, updatedAt: true },
      });
      if (dbPlayer?.claimedById) {
        claimedBy = dbPlayer.claimedById;
        claimedAt = dbPlayer.updatedAt; // Use updatedAt as claimedAt for now
      }
    }
  } catch (error) {
    // If database lookup fails, continue without claimed status
    console.error('Failed to load claimedBy status:', error);
  }

  const milestones = calculatePlayerMilestones(player);

  // Get recent achievements (achieved milestones)
  const recentAchievements = milestones
    .filter((m) => m.status === 'achieved')
    .slice(0, 10);

  // Get nearest goals (in-progress milestones sorted by progress)
  const nearestGoals = milestones
    .filter((m) => m.status === 'in_progress')
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  return {
    ...player,
    claimedBy,
    claimedAt,
    milestones,
    recentAchievements,
    nearestGoals,
  };
}

/**
 * Refresh player data from hiscores
 */
export async function refreshPlayerData(player: Player): Promise<Player> {
  const result = await lookupPlayer(player.displayName);
  
  if (!result.success || !result.player) {
    return player;
  }

  return {
    ...result.player,
    id: player.id,
    claimedBy: player.claimedBy,
    claimedAt: player.claimedAt,
  };
}

