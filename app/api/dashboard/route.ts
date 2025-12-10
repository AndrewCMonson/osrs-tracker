import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PlayerWithRelations } from '@/types/prisma';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get all claimed accounts for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all players claimed by this user
    const players: PlayerWithRelations[] = await (prisma as PrismaClient).player.findMany({
      where: {
        claimedById: session.user.id,
      },
      include: {
        skills: true,
        bossKCs: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Calculate aggregated XP across all accounts
    const totalXp = players.reduce((sum: number, player: PlayerWithRelations) => {
      return sum + Number(player.totalXp);
    }, 0);

    // Calculate total levels
    const totalLevels = players.reduce((sum: number, player: PlayerWithRelations) => {
      return sum + player.totalLevel;
    }, 0);

    // Get skill XP breakdown across all accounts
    const skillXpMap = new Map<string, bigint>();
    players.forEach((player: PlayerWithRelations) => {
      player.skills.forEach((skill: PlayerWithRelations['skills'][number]) => {
        const currentXp = skillXpMap.get(skill.name) || BigInt(0);
        skillXpMap.set(skill.name, currentXp + skill.xp);
      });
    });

    const skillXp = Object.fromEntries(
      Array.from(skillXpMap.entries()).map(([name, xp]) => [name, Number(xp)])
    );

    return NextResponse.json({
      success: true,
      accounts: players.map((player: PlayerWithRelations) => ({
        id: player.id,
        username: player.username,
        displayName: player.displayName || player.username,
        accountType: player.accountType,
        totalLevel: player.totalLevel,
        totalXp: Number(player.totalXp),
        combatLevel: player.combatLevel,
        lastUpdated: player.updatedAt.toISOString(),
      })),
      totals: {
        totalXp,
        totalLevels,
        accountCount: players.length,
        skillXp,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

