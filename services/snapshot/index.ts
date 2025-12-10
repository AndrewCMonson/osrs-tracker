/**
 * Snapshot service - handles saving and retrieving player progress snapshots
 * 
 * NOTE: Requires PostgreSQL database setup. See TODOs:
 * - Set up PostgreSQL database and configure DATABASE_URL in .env
 * - Run Prisma migration: npx prisma migrate dev --name add_snapshots
 */

import { db } from '@/lib/db';
import { Player } from '@/types/player';
import { SKILLS, SkillName } from '@/types/skills';
import { BOSSES, BossName } from '@/types/bosses';
import { PlayerSnapshotWhereInput } from '@/types/prisma';

/**
 * Check if database is available
 */
function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

export interface SnapshotData {
  id: string;
  playerId: string;
  totalLevel: number;
  totalXp: bigint;
  combatLevel: number;
  createdAt: Date;
  skills: {
    name: string;
    level: number;
    xp: bigint;
    rank: number;
  }[];
  bosses: {
    bossName: string;
    kc: number;
    rank: number;
  }[];
}

export interface SkillHistory {
  skill: SkillName;
  dataPoints: {
    date: Date;
    level: number;
    xp: number;
    rank: number;
  }[];
}

/**
 * Save a player snapshot to the database
 * @param player - The player data to save
 * @param force - If true, bypass the 1-hour cooldown (for manual saves)
 */
export async function savePlayerSnapshot(player: Player, force: boolean = false): Promise<void> {
  if (!isDatabaseAvailable()) {
    // Database not set up yet - silently skip snapshot saving
    return;
  }

  try {
    // Check for name changes - find the original player ID
    const { getPlayerIdByUsername } = await import('../name-change');
    const playerId = await getPlayerIdByUsername(player.username.toLowerCase());
    
    let dbPlayer;
    if (playerId) {
      // Player exists (possibly with name changes), update it
      dbPlayer = await db.player.update({
        where: { id: playerId },
        data: {
          displayName: player.displayName,
          accountType: player.accountType,
          totalLevel: player.totalLevel,
          totalXp: BigInt(player.totalXp),
          combatLevel: player.combatLevel,
          updatedAt: new Date(),
        },
      });
    } else {
      // New player, create it
      dbPlayer = await db.player.create({
        data: {
          username: player.username.toLowerCase(),
          displayName: player.displayName,
          accountType: player.accountType,
          totalLevel: player.totalLevel,
          totalXp: BigInt(player.totalXp),
          combatLevel: player.combatLevel,
        },
      });
    }

    // Check if we should create a new snapshot (limit to one per hour, unless forced)
    if (!force) {
      const lastSnapshot = await db.playerSnapshot.findFirst({
        where: { playerId: dbPlayer.id },
        orderBy: { createdAt: 'desc' },
      });

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (lastSnapshot && lastSnapshot.createdAt > oneHourAgo) {
        // Don't create a new snapshot, just update the existing data
        return;
      }
    }

    // Create the snapshot with all related data in a transaction
    await db.$transaction(async (tx) => {
      const snapshot = await tx.playerSnapshot.create({
        data: {
          playerId: dbPlayer.id,
          totalLevel: player.totalLevel,
          totalXp: BigInt(player.totalXp),
          combatLevel: player.combatLevel,
        },
      });

      // Create skill snapshots
      await tx.skillSnapshot.createMany({
        data: SKILLS.map((skill) => ({
          snapshotId: snapshot.id,
          name: skill,
          level: player.skills.skills[skill]?.level ?? 1,
          xp: BigInt(player.skills.skills[skill]?.xp ?? 0),
          rank: player.skills.skills[skill]?.rank ?? 0,
        })),
        skipDuplicates: true,
      });

      // Create boss snapshots (only for bosses with kills)
      const bossSnapshots = BOSSES.filter((boss) => player.bosses[boss]?.killCount > 0).map((boss) => ({
        snapshotId: snapshot.id,
        bossName: boss,
        kc: player.bosses[boss]?.killCount ?? 0,
        rank: player.bosses[boss]?.rank ?? 0,
      }));

      if (bossSnapshots.length > 0) {
        await tx.bossSnapshot.createMany({
          data: bossSnapshots,
          skipDuplicates: true,
        });
      }
    });

    // Update the player's current skills and boss KCs
    for (const skill of SKILLS) {
      const skillData = player.skills.skills[skill];
      if (skillData) {
        await db.skill.upsert({
          where: {
            playerId_name: {
              playerId: dbPlayer.id,
              name: skill,
            },
          },
          create: {
            playerId: dbPlayer.id,
            name: skill,
            level: skillData.level,
            xp: BigInt(skillData.xp),
            rank: skillData.rank,
          },
          update: {
            level: skillData.level,
            xp: BigInt(skillData.xp),
            rank: skillData.rank,
          },
        });
      }
    }

    for (const boss of BOSSES) {
      const bossData = player.bosses[boss];
      if (bossData && bossData.killCount > 0) {
        await db.bossKC.upsert({
          where: {
            playerId_bossName: {
              playerId: dbPlayer.id,
              bossName: boss,
            },
          },
          create: {
            playerId: dbPlayer.id,
            bossName: boss,
            kc: bossData.killCount,
            rank: bossData.rank,
          },
          update: {
            kc: bossData.killCount,
            rank: bossData.rank,
          },
        });
      }
    }
  } catch (error) {
    console.error('Failed to save player snapshot:', error);
    // Don't throw - snapshot saving is non-critical
  }
}

/**
 * Get player snapshots for the history chart
 */
export async function getPlayerSnapshots(
  username: string,
  limit: number = 100
): Promise<SnapshotData[]> {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    const player = await db.player.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!player) {
      return [];
    }

    const snapshots = await db.playerSnapshot.findMany({
      where: { playerId: player.id },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        skills: true,
        bosses: true,
      },
    });

    return snapshots;
  } catch (error) {
    console.error('Failed to get player snapshots:', error);
    return [];
  }
}

/**
 * Get skill history for a specific skill
 */
export async function getSkillHistory(
  username: string,
  skill: SkillName
): Promise<SkillHistory | null> {
  if (!isDatabaseAvailable()) {
    return null;
  }

  try {
    const player = await db.player.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!player) {
      return null;
    }

    const snapshots = await db.playerSnapshot.findMany({
      where: { playerId: player.id },
      orderBy: { createdAt: 'asc' },
      include: {
        skills: {
          where: { name: skill },
        },
      },
    });

    const dataPoints = snapshots
      .filter((s) => s.skills.length > 0)
      .map((snapshot) => ({
        date: snapshot.createdAt,
        level: snapshot.skills[0].level,
        xp: Number(snapshot.skills[0].xp),
        rank: snapshot.skills[0].rank,
      }));

    return {
      skill,
      dataPoints,
    };
  } catch (error) {
    console.error('Failed to get skill history:', error);
    return null;
  }
}

/**
 * Get date range for time period
 */
function getDateRange(period: 'day' | 'week' | 'month' | 'year' | 'all' | 'custom', customStart?: Date, customEnd?: Date): { start: Date | undefined; end: Date | undefined } {
  const now = new Date();
  let start: Date | undefined;
  let end: Date | undefined = now;

  if (period === 'custom' && customStart && customEnd) {
    start = customStart;
    end = customEnd;
  } else if (period === 'day') {
    start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else if (period === 'week') {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === 'month') {
    start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (period === 'year') {
    start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }
  // 'all' doesn't set start, so it gets all data

  return { start, end };
}

/**
 * Get all skills history for charts
 */
export async function getAllSkillsHistory(
  username: string,
  period: 'day' | 'week' | 'month' | 'year' | 'all' | 'custom' = 'all',
  customStart?: Date,
  customEnd?: Date
): Promise<SkillHistory[]> {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    const player = await db.player.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!player) {
      return [];
    }

    const { start, end } = getDateRange(period, customStart, customEnd);
    const whereClause: PlayerSnapshotWhereInput = { playerId: player.id };
    
    if (start || end) {
      whereClause.createdAt = {};
      if (start) {
        whereClause.createdAt.gte = start;
      }
      if (end) {
        whereClause.createdAt.lte = end;
      }
    }

    const snapshots = await db.playerSnapshot.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
      include: {
        skills: true,
      },
    });

    // Group by skill
    const skillHistories: SkillHistory[] = SKILLS.map((skill) => ({
      skill,
      dataPoints: snapshots
        .map((snapshot) => {
          const skillData = snapshot.skills.find((s) => s.name === skill);
          if (!skillData) return null;
          return {
            date: snapshot.createdAt,
            level: skillData.level,
            xp: Number(skillData.xp),
            rank: skillData.rank,
          };
        })
        .filter((dp): dp is NonNullable<typeof dp> => dp !== null),
    }));

    return skillHistories;
  } catch (error) {
    console.error('Failed to get all skills history:', error);
    return [];
  }
}

/**
 * Get total XP history
 */
export async function getTotalXpHistory(
  username: string,
  period: 'day' | 'week' | 'month' | 'year' | 'all' | 'custom' = 'all',
  customStart?: Date,
  customEnd?: Date
): Promise<{ date: Date; totalXp: number; totalLevel: number }[]> {
  if (!isDatabaseAvailable()) {
    return [];
  }

  try {
    const player = await db.player.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!player) {
      return [];
    }

    const { start, end } = getDateRange(period, customStart, customEnd);
    const whereClause: PlayerSnapshotWhereInput = { playerId: player.id };
    
    if (start || end) {
      whereClause.createdAt = {};
      if (start) {
        whereClause.createdAt.gte = start;
      }
      if (end) {
        whereClause.createdAt.lte = end;
      }
    }

    const snapshots = await db.playerSnapshot.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
      select: {
        createdAt: true,
        totalXp: true,
        totalLevel: true,
      },
    });

    return snapshots.map((s) => ({
      date: s.createdAt,
      totalXp: Number(s.totalXp),
      totalLevel: s.totalLevel,
    }));
  } catch (error) {
    console.error('Failed to get total XP history:', error);
    return [];
  }
}

