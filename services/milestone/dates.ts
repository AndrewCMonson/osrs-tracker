/**
 * Service to determine milestone achievement dates from snapshots
 */

import { db } from '@/lib/db';
import { 
  Milestone, 
  MilestoneType,
  Skill99Milestone,
  BaseLevelMilestone,
  TotalLevelMilestone,
  CombatLevelMilestone,
  BossKcMilestone
} from '@/types/milestones';
import { SkillName } from '@/types/skills';
import { BossName } from '@/types/bosses';

/**
 * Get achievement date for a milestone by analyzing snapshots
 */
export async function getMilestoneAchievementDate(
  playerId: string,
  milestone: Milestone
): Promise<Date | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const snapshots = await db.playerSnapshot.findMany({
      where: { playerId },
      orderBy: { createdAt: 'asc' },
      include: {
        skills: true,
        bosses: true,
      },
    });

    if (snapshots.length === 0) {
      return null;
    }

    // Find the first snapshot where the milestone was achieved
    for (const snapshot of snapshots) {
      let isAchieved = false;

      switch (milestone.type) {
        case 'skill_99': {
          const skillMilestone = milestone as Skill99Milestone;
          const skillData = snapshot.skills.find((s) => s.name === skillMilestone.skill);
          isAchieved = skillData !== undefined && skillData.level >= 99;
          break;
        }
        case 'base_level': {
          const baseMilestone = milestone as BaseLevelMilestone;
          const allSkills = snapshot.skills;
          const lowestLevel = Math.min(...allSkills.map((s) => s.level));
          isAchieved = lowestLevel >= baseMilestone.targetLevel;
          break;
        }
        case 'total_level': {
          const totalMilestone = milestone as TotalLevelMilestone;
          isAchieved = snapshot.totalLevel >= totalMilestone.targetLevel;
          break;
        }
        case 'combat_level': {
          const combatMilestone = milestone as CombatLevelMilestone;
          isAchieved = snapshot.combatLevel >= combatMilestone.targetLevel;
          break;
        }
        case 'boss_kc': {
          const bossMilestone = milestone as BossKcMilestone;
          const bossData = snapshot.bosses.find((b) => b.bossName === bossMilestone.boss);
          isAchieved = bossData !== undefined && bossData.kc >= bossMilestone.targetKc;
          break;
        }
        case 'max_cape': {
          const allSkills = snapshot.skills;
          const skillsAt99 = allSkills.filter((s) => s.level >= 99).length;
          isAchieved = skillsAt99 === 24; // All 24 skills at 99
          break;
        }
      }

      if (isAchieved) {
        return snapshot.createdAt;
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to get milestone achievement date:', error);
    return null;
  }
}

/**
 * Get achievement dates for multiple milestones
 */
export async function getMilestoneAchievementDates(
  playerId: string,
  milestones: Milestone[]
): Promise<Map<string, Date | null>> {
  const dates = new Map<string, Date | null>();

  // Only check achieved milestones
  const achievedMilestones = milestones.filter((m) => m.status === 'achieved');

  for (const milestone of achievedMilestones) {
    const date = await getMilestoneAchievementDate(playerId, milestone);
    dates.set(milestone.id, date);
  }

  return dates;
}




