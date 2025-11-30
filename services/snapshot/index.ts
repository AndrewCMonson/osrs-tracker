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
 */
export async function savePlayerSnapshot(player: Player): Promise<void> {
  if (!isDatabaseAvailable()) {
    // Database not set up yet - silently skip snapshot saving
    return;
  }

  try {
    // First, ensure the player exists in the database
    const dbPlayer = await db.player.upsert({
      where: { username: player.username.toLowerCase() },
      create: {
        username: player.username.toLowerCase(),
        displayName: player.displayName,
        accountType: player.accountType,
        totalLevel: player.totalLevel,
        totalXp: BigInt(player.totalXp),
        combatLevel: player.combatLevel,
      },
      update: {
        displayName: player.displayName,
        accountType: player.accountType,
        totalLevel: player.totalLevel,
        totalXp: BigInt(player.totalXp),
        combatLevel: player.combatLevel,
        updatedAt: new Date(),
      },
    });

    // Check if we should create a new snapshot (limit to one per hour)
    const lastSnapshot = await db.playerSnapshot.findFirst({
      where: { playerId: dbPlayer.id },
      orderBy: { createdAt: 'desc' },
    });

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (lastSnapshot && lastSnapshot.createdAt > oneHourAgo) {
      // Don't create a new snapshot, just update the existing data
      return;
    }

    // Create the snapshot
    await db.playerSnapshot.create({
      data: {
        playerId: dbPlayer.id,
        totalLevel: player.totalLevel,
        totalXp: BigInt(player.totalXp),
        combatLevel: player.combatLevel,
        skills: {
          create: SKILLS.map((skill) => ({
            name: skill,
            level: player.skills.skills[skill]?.level ?? 1,
            xp: BigInt(player.skills.skills[skill]?.xp ?? 0),
            rank: player.skills.skills[skill]?.rank ?? 0,
          })),
        },
        bosses: {
          create: BOSSES.filter((boss) => player.bosses[boss]?.killCount > 0).map((boss) => ({
            bossName: boss,
            kc: player.bosses[boss]?.killCount ?? 0,
            rank: player.bosses[boss]?.rank ?? 0,
          })),
        },
      },
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
 * Get all skills history for charts
 */
export async function getAllSkillsHistory(username: string): Promise<SkillHistory[]> {
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
  username: string
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

    const snapshots = await db.playerSnapshot.findMany({
      where: { playerId: player.id },
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

