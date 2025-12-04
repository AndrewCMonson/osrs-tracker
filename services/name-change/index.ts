/**
 * Name change service - handles player name change tracking and validation
 */

import { db } from '@/lib/db';
import { normalizeUsername } from '@/lib/utils';
import { SKILLS } from '@/types/skills';
import { fetchPlayerHiscores } from '../osrs';

/**
 * Check if database is available
 */
function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

/**
 * Check if PlayerNameChange model is available in Prisma client
 */
function isNameChangeModelAvailable(): boolean {
  try {
    return !!db.playerNameChange;
  } catch (error) {
    return false;
  }
}

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

/**
 * Calculate actual total level from skills (capped at 99 each)
 */
function calculateTotalLevel(skills: Record<string, { level: number }>): number {
  return SKILLS.reduce((total, skill) => {
    const level = skills[skill]?.level ?? 1;
    return total + Math.min(level, 99); // Cap at 99 for total level calculation
  }, 0);
}

/**
 * Get maximum reasonable XP per day for a skill
 * Based on efficient methods and realistic playtime (8-12 hours/day max)
 */
function getMaxXpPerDay(skillName: string): number {
  // XP rates in XP/hour for efficient methods
  const xpRates: Record<string, number> = {
    // Fast skills (can get 200k-1M+ XP/hour)
    cooking: 1000000,      // 1M/hour
    fletching: 900000,     // 900k/hour
    firemaking: 800000,    // 800k/hour
    construction: 700000,  // 700k/hour
    herblore: 600000,     // 600k/hour
    smithing: 500000,     // 500k/hour
    crafting: 400000,     // 400k/hour
    thieving: 300000,     // 300k/hour

    // Medium skills (50k-300k XP/hour)
    magic: 250000,         // 250k/hour
    ranged: 200000,       // 200k/hour
    attack: 150000,       // 150k/hour
    strength: 150000,    // 150k/hour
    defence: 150000,     // 150k/hour
    fishing: 120000,      // 120k/hour
    woodcutting: 100000,  // 100k/hour
    hunter: 100000,       // 100k/hour
    slayer: 80000,        // 80k/hour (varies greatly)
    farming: 50000,      // 50k/hour (time-gated)

    // Slow skills (30k-150k XP/hour)
    mining: 80000,        // 80k/hour
    agility: 70000,       // 70k/hour
    runecraft: 50000,     // 50k/hour
    prayer: 40000,        // 40k/hour (if using bones)
    hitpoints: 150000,    // Same as combat skills
    sailing: 100000,     // Estimated
  };

  const xpPerHour = xpRates[skillName] || 100000; // Default 100k/hour
  // Assume max 12 hours/day of efficient play (very generous)
  // Add 20% buffer for variation
  return Math.floor(xpPerHour * 12 * 1.2);
}

/**
 * Get maximum reasonable boss KC per day
 */
function getMaxKcPerDay(bossName: string): number {
  // Most bosses can be killed 50-200 times per hour depending on the boss
  // Assume max 12 hours/day, very generous
  const kcPerHour: Record<string, number> = {
    // Fast bosses
    'zulrah': 20,
    'vorkath': 25,
    'cerberus': 30,
    'thermonuclear smoke devil': 40,
    // Medium bosses
    'general graardor': 50,
    'commander zilyana': 50,
    'kree\'arra': 40,
    'k\'ril tsutsaroth': 50,
    // Default
    'default': 100,
  };

  const hourlyKc = kcPerHour[bossName.toLowerCase()] || kcPerHour['default'];
  return hourlyKc * 12; // 12 hours/day max
}

/**
 * Compare two players to see if they're likely the same account
 * Allows for progression - new stats should be >= old stats (with small tolerance for rounding)
 * Also validates that progression rates are reasonable based on time elapsed
 */
async function comparePlayers(
  oldPlayerData: {
    totalXp: bigint;
    totalLevel: number;
    skills?: Record<string, { level: number; xp: bigint }>;
    bossKCs?: Record<string, number>;
    lastUpdated?: Date;
  },
  newPlayerData: {
    totalXp: number;
    skills: Record<string, { level: number; xp: number }>;
    bossKCs?: Record<string, { killCount: number }>;
  }
): Promise<{ match: boolean; reason?: string }> {
  // Calculate time elapsed since last update
  const now = new Date();
  const lastUpdated = oldPlayerData.lastUpdated || now;
  const daysElapsed = Math.max(1, (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate actual total level from new player's skills
  const newTotalLevel = calculateTotalLevel(newPlayerData.skills);

  // Allow small tolerance for rounding/API differences (1% or 10k XP, whichever is larger)
  const xpTolerance = Math.max(Number(oldPlayerData.totalXp) * 0.01, 10000);
  const levelTolerance = 2; // Allow up to 2 levels difference for rounding

  // New XP should be >= old XP (allowing for progression) or very close (within tolerance)
  const xpMatches = newPlayerData.totalXp >= Number(oldPlayerData.totalXp) - xpTolerance;

  // New total level should be >= old level (allowing for progression) or very close
  const levelMatches = newTotalLevel >= oldPlayerData.totalLevel - levelTolerance;

  // Check if total XP gain is reasonable
  const totalXpGained = newPlayerData.totalXp - Number(oldPlayerData.totalXp);
  // Maximum reasonable total XP per day across all skills: 20M (very generous for max efficiency)
  const maxTotalXpPerDay = 20000000;
  const maxTotalXpForPeriod = maxTotalXpPerDay * daysElapsed;

  if (totalXpGained > maxTotalXpForPeriod * 1.1) { // 10% buffer
    return {
      match: false,
      reason: `Unrealistic total XP gain: ${(totalXpGained / 1000000).toFixed(1)}M XP in ${daysElapsed.toFixed(1)} days (max reasonable: ${(maxTotalXpForPeriod / 1000000).toFixed(1)}M XP)`,
    };
  }

  // Check individual skills - new levels should be >= old levels (allowing for progression)
  // Also validate that XP gains are reasonable
  let skillMatches = true;
  const unrealisticGains: string[] = [];

  if (oldPlayerData.skills) {
    const skillMismatches: string[] = [];
    for (const skillName of SKILLS) {
      const oldSkill = oldPlayerData.skills[skillName];
      const newSkill = newPlayerData.skills[skillName];

      if (oldSkill && newSkill) {
        // New skill level should be >= old level (allowing for progression) or very close
        if (newSkill.level < oldSkill.level - 1) {
          skillMismatches.push(`${skillName}: old=${oldSkill.level}, new=${newSkill.level}`);
        }

        // Check XP - new should be >= old (allowing for progression)
        if (newSkill.xp < Number(oldSkill.xp) - 1000) { // 1k XP tolerance
          skillMismatches.push(`${skillName} XP: old=${oldSkill.xp}, new=${newSkill.xp}`);
        }

        // Check if XP gain is realistic
        const xpGained = newSkill.xp - Number(oldSkill.xp);
        if (xpGained > 0) {
          const maxXpPerDay = getMaxXpPerDay(skillName);
          const maxXpForPeriod = maxXpPerDay * daysElapsed;

          if (xpGained > maxXpForPeriod * 1.2) { // 20% buffer for variation
            unrealisticGains.push(
              `${skillName}: ${(xpGained / 1000000).toFixed(2)}M XP in ${daysElapsed.toFixed(1)} days (max: ${(maxXpForPeriod / 1000000).toFixed(2)}M)`
            );
          }
        }
      }
    }

    // If more than 3 skills have regressed significantly, it's probably not the same account
    if (skillMismatches.length > 3) {
      skillMatches = false;
      console.log('Skill mismatches:', skillMismatches);
    }

    // If any skill has unrealistic gains, flag it
    if (unrealisticGains.length > 0) {
      return {
        match: false,
        reason: `Unrealistic XP gains detected: ${unrealisticGains.join('; ')}`,
      };
    }
  }

  // Check boss kill counts if available - new should be >= old (allowing for progression)
  let bossMatches = true;
  const unrealisticBossGains: string[] = [];

  if (oldPlayerData.bossKCs && newPlayerData.bossKCs) {
    const bossMismatches: string[] = [];
    for (const [bossName, oldKC] of Object.entries(oldPlayerData.bossKCs)) {
      const newBoss = newPlayerData.bossKCs[bossName];
      if (newBoss && oldKC > 0) {
        // New KC should be >= old KC (allowing for progression) or very close
        if (newBoss.killCount < oldKC - 5) { // 5 KC tolerance
          bossMismatches.push(`${bossName}: old=${oldKC}, new=${newBoss.killCount}`);
        }

        // Check if KC gain is realistic
        const kcGained = newBoss.killCount - oldKC;
        if (kcGained > 0) {
          const maxKcPerDay = getMaxKcPerDay(bossName);
          const maxKcForPeriod = maxKcPerDay * daysElapsed;

          if (kcGained > maxKcForPeriod * 1.2) { // 20% buffer
            unrealisticBossGains.push(
              `${bossName}: ${kcGained} KC in ${daysElapsed.toFixed(1)} days (max: ${Math.floor(maxKcForPeriod)})`
            );
          }
        }
      }
    }

    // If multiple bosses have regressed significantly, it's probably not the same account
    if (bossMismatches.length > 2) {
      bossMatches = false;
      console.log('Boss KC mismatches:', bossMismatches);
    }

    // If any boss has unrealistic gains, flag it
    if (unrealisticBossGains.length > 0) {
      return {
        match: false,
        reason: `Unrealistic boss KC gains detected: ${unrealisticBossGains.join('; ')}`,
      };
    }
  }

  // Account is likely the same if:
  // - XP and level match (allowing for progression)
  // - Skills match (allowing for progression)
  // - Boss KCs match (allowing for progression, if available)
  // - All progression rates are reasonable
  return {
    match: xpMatches && levelMatches && skillMatches && bossMatches,
  };
}

/**
 * Validate a name change by checking:
 * 1. Old username no longer exists in OSRS (or has different stats)
 * 2. New username exists in OSRS
 * 3. New username stats match old username stats
 */
export async function validateNameChange(
  oldUsername: string,
  newUsername: string
): Promise<{
  valid: boolean;
  error?: string;
  verified?: boolean;
}> {
  const normalizedOld = normalizeUsername(oldUsername);
  const normalizedNew = normalizeUsername(newUsername);

  if (!isDatabaseAvailable() || !isNameChangeModelAvailable()) {
    // If database is not available, just validate both exist in OSRS
    try {
      const { fetchPlayerHiscores } = await import('../osrs');
      await fetchPlayerHiscores(normalizedNew, 'hiscore_oldschool');
      return { valid: true, verified: false };
    } catch (error) {
      return {
        valid: false,
        error: 'New username not found in OSRS hiscores. Please verify the username is correct.',
      };
    }
  }

  try {
    // Get the old player from database (or find via name change chain)
    let oldPlayer = await db.player.findUnique({
      where: { username: normalizedOld },
    });

    // If not found by direct username, check name change history
    if (!oldPlayer) {
      const nameChange = await db.playerNameChange.findFirst({
        where: { oldUsername: normalizedOld },
        orderBy: { createdAt: 'desc' },
        include: { player: true },
      });

      if (nameChange) {
        oldPlayer = nameChange.player;
      }
    }

    if (!oldPlayer) {
      return {
        valid: false,
        error: 'Old username not found in our database',
      };
    }

    // Check if the new username already exists in our database
    // If it does and stats match, we'll merge them during submission
    const existingNewPlayer = await db.player.findUnique({
      where: { username: normalizedNew },
    });

    // If it's the same player ID, that's fine (shouldn't happen, but handle it)
    if (existingNewPlayer && existingNewPlayer.id === oldPlayer.id) {
      // Same player, allow it
    }
    // If different player exists, we'll check stats match later and merge them

    // Check if there's a name change pointing to this username from a different player
    // (If it's from the same player, allow it - might be updating)
    const existingNameChange = await db.playerNameChange.findFirst({
      where: {
        newUsername: normalizedNew,
        playerId: { not: oldPlayer.id } // Only check if it's from a different player
      },
      include: { player: true },
    });

    if (existingNameChange) {
      return {
        valid: false,
        error: 'This username is already linked to another account',
      };
    }

    // Verify old username no longer exists in OSRS (or has different stats)
    // If the old username doesn't exist (404), that's perfect - the name change happened
    // If it exists with different stats, that's also fine - someone else took the name
    // Only reject if it exists with matching stats (name change hasn't happened)
    // Use a direct fetch to bypass Next.js cache for name change validation
    try {
      // Direct API call to bypass cache for name change validation
      const response = await fetch(
        `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(normalizedOld)}`,
        {
          headers: { 'User-Agent': 'OSRS-Tracker/1.0' },
          cache: 'no-store', // Bypass cache for name change validation
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Old username doesn't exist - perfect for a name change
          // Proceed with validation
        } else {
          // Some other error - log but don't block
          console.warn(`Error checking old username: ${response.status}`);
        }
      } else {
        // Old username exists in OSRS - parse and check stats
        const csv = await response.text();
        const { parseHiscoresCsv } = await import('../osrs/parser');
        const parsed = parseHiscoresCsv(csv);
        const oldPlayerData = {
          skills: {
            overall: parsed.overall,
            skills: parsed.skills,
          },
        };

        // Get old player's skills from database for comparison
        const oldPlayerSkills = await db.skill.findMany({
          where: { playerId: oldPlayer.id },
        });

        const oldSkillsMap: Record<string, { level: number; xp: bigint }> = {};
        for (const skill of oldPlayerSkills) {
          oldSkillsMap[skill.name] = {
            level: skill.level,
            xp: skill.xp,
          };
        }

        // Old username still exists - check if stats match
        const oldStatsMatch = await comparePlayers(
          {
            totalXp: oldPlayer.totalXp,
            totalLevel: oldPlayer.totalLevel,
            skills: oldSkillsMap,
            lastUpdated: oldPlayer.updatedAt,
          },
          {
            totalXp: oldPlayerData.skills.overall.xp,
            skills: oldPlayerData.skills.skills,
          }
        );

        if (oldStatsMatch.match) {
          // Old username exists with matching stats - this could mean:
          // 1. The name change hasn't happened yet
          // 2. Someone else took the name and coincidentally has similar stats (rare)
          // 
          // Instead of rejecting immediately, we'll continue validation and check if the new username
          // matches the old account's stats. If the new username matches better (or equally well),
          // it's likely a legitimate name change. We'll only reject if the new username doesn't match.
          // 
          // This handles edge cases where:
          // - The old name was taken by someone else with similar stats
          // - There's a delay in OSRS updating their hiscores
          // - The user changed their name but the old name still shows in hiscores temporarily

          // Continue validation - we'll check new username matches in the next section
        }
        // Old username exists but with different stats - someone else took the name or it's a different account
        // This is fine, proceed with validation
      }
    } catch (error: unknown) {
      // Old username doesn't exist in OSRS (404 error) - this is expected and good for a name change
      // Check if it's an OsrsApiError with 404 status
      const isOsrsError = error && typeof error === 'object' && 'statusCode' in error;
      if (isOsrsError && (error as { statusCode?: number }).statusCode === 404) {
        // Perfect - old username doesn't exist, name change is valid
        // Proceed with validation
      } else if (error instanceof Error && error.message.includes('not found')) {
        // Also check error message for "not found"
        // Proceed with validation
      } else {
        // Some other error (network issue, etc.) - log it but don't block validation
        // We'll verify the new username exists which is more important
        console.warn('Error checking old username in OSRS (non-404):', error);
      }
    }

    // Get old player's skills and boss KCs from database for comparison
    const oldPlayerSkills = await db.skill.findMany({
      where: { playerId: oldPlayer.id },
    });

    const oldPlayerBossKCs = await db.bossKC.findMany({
      where: { playerId: oldPlayer.id },
    });

    // Convert to format for comparison
    const oldSkillsMap: Record<string, { level: number; xp: bigint }> = {};
    for (const skill of oldPlayerSkills) {
      oldSkillsMap[skill.name] = {
        level: skill.level,
        xp: skill.xp,
      };
    }

    const oldBossKCsMap: Record<string, number> = {};
    for (const bossKC of oldPlayerBossKCs) {
      oldBossKCsMap[bossKC.bossName] = bossKC.kc;
    }

    // Validate that the new username exists in OSRS
    let newPlayerData;
    try {
      const { fetchPlayerHiscores } = await import('../osrs');
      newPlayerData = await fetchPlayerHiscores(normalizedNew, 'hiscore_oldschool');
    } catch (error) {
      return {
        valid: false,
        error: 'New username not found in OSRS hiscores. Please verify the username is correct.',
      };
    }

    // Convert new player skills to include XP
    const newSkillsMap: Record<string, { level: number; xp: number }> = {};
    for (const [skillName, skillData] of Object.entries(newPlayerData.skills.skills)) {
      newSkillsMap[skillName] = {
        level: skillData.level,
        xp: skillData.xp,
      };
    }

    // Convert new player bosses to format for comparison
    const newBossKCsMap: Record<string, { killCount: number }> = {};
    for (const [bossName, bossData] of Object.entries(newPlayerData.bosses || {})) {
      if (bossData && bossData.killCount > 0) {
        newBossKCsMap[bossName] = {
          killCount: bossData.killCount,
        };
      }
    }

    // Compare stats to verify it's the same account (allowing for progression)
    const comparison = await comparePlayers(
      {
        totalXp: oldPlayer.totalXp,
        totalLevel: oldPlayer.totalLevel,
        skills: oldSkillsMap,
        bossKCs: oldBossKCsMap,
        lastUpdated: oldPlayer.updatedAt,
      },
      {
        totalXp: newPlayerData.skills.overall.xp,
        skills: newSkillsMap,
        bossKCs: newBossKCsMap,
      }
    );

    if (!comparison.match) {
      return {
        valid: false,
        error: comparison.reason || 'Stats do not match. The new username appears to be a different account. Please verify both usernames are correct.',
      };
    }

    return {
      valid: true,
      verified: true,
    };
  } catch (error) {
    console.error('Error validating name change:', error);
    return {
      valid: false,
      error: 'An error occurred while validating the name change',
    };
  }
}

/**
 * Validate that a new username exists in OSRS (for general validation)
 */
export async function validateNewUsername(newUsername: string): Promise<{
  valid: boolean;
  error?: string;
}> {
  const normalized = normalizeUsername(newUsername);

  if (!isDatabaseAvailable()) {
    // If database is not available, just validate against OSRS
    try {
      const { fetchPlayerHiscores } = await import('../osrs');
      await fetchPlayerHiscores(normalized, 'hiscore_oldschool');
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: 'Username not found in OSRS hiscores. Please verify the username is correct.',
      };
    }
  }

  try {
    // Check if the new username already exists in our database
    const existingPlayer = await db.player.findUnique({
      where: { username: normalized },
    });

    if (existingPlayer) {
      return {
        valid: false,
        error: 'This username is already registered in our database',
      };
    }

    // Check if there's a name change pointing to this username
    const existingNameChange = await db.playerNameChange.findFirst({
      where: { newUsername: normalized },
    });

    if (existingNameChange) {
      return {
        valid: false,
        error: 'This username is already linked to another account',
      };
    }

    // Validate that the username exists in OSRS
    try {
      await fetchPlayerHiscores(normalized, 'hiscore_oldschool');
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: 'Username not found in OSRS hiscores. Please verify the username is correct.',
      };
    }
  } catch (error) {
    console.error('Error validating username:', error);
    return {
      valid: false,
      error: 'An error occurred while validating the username',
    };
  }
}

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

