/**
 * Milestone calculation service
 */

import { Player } from '@/types/player';
import { SKILLS, SkillName, XP_TABLE, getProgressTo99 } from '@/types/skills';
import { BOSSES, BossName, BOSS_DISPLAY_NAMES, KC_THRESHOLDS, getNextKcMilestone } from '@/types/bosses';
import {
  Milestone,
  Skill99Milestone,
  BaseLevelMilestone,
  TotalLevelMilestone,
  BossKcMilestone,
  CombatLevelMilestone,
  MaxCapeMilestone,
  BASE_LEVEL_THRESHOLDS,
  TOTAL_LEVEL_THRESHOLDS,
  COMBAT_LEVEL_THRESHOLDS,
  generateMilestoneId,
} from '@/types/milestones';

// Skill display names
const SKILL_DISPLAY_NAMES: Record<SkillName, string> = {
  attack: 'Attack',
  defence: 'Defence',
  strength: 'Strength',
  hitpoints: 'Hitpoints',
  ranged: 'Ranged',
  prayer: 'Prayer',
  magic: 'Magic',
  cooking: 'Cooking',
  woodcutting: 'Woodcutting',
  fletching: 'Fletching',
  fishing: 'Fishing',
  firemaking: 'Firemaking',
  crafting: 'Crafting',
  smithing: 'Smithing',
  mining: 'Mining',
  herblore: 'Herblore',
  agility: 'Agility',
  thieving: 'Thieving',
  slayer: 'Slayer',
  farming: 'Farming',
  runecraft: 'Runecraft',
  hunter: 'Hunter',
  construction: 'Construction',
  sailing: 'Sailing',
};

/**
 * Calculate all milestones for a player
 */
export function calculatePlayerMilestones(player: Player): Milestone[] {
  const milestones: Milestone[] = [];

  // Skill 99 milestones
  milestones.push(...calculate99Milestones(player));

  // Base level milestones
  milestones.push(...calculateBaseLevelMilestones(player));

  // Total level milestones
  milestones.push(...calculateTotalLevelMilestones(player));

  // Combat level milestones
  milestones.push(...calculateCombatLevelMilestones(player));

  // Boss KC milestones
  milestones.push(...calculateBossKcMilestones(player));

  // Max cape milestone
  milestones.push(calculateMaxCapeMilestone(player));

  return milestones;
}

/**
 * Calculate 99 skill milestones
 */
function calculate99Milestones(player: Player): Skill99Milestone[] {
  const milestones: Skill99Milestone[] = [];
  const xpFor99 = XP_TABLE[99];

  for (const skill of SKILLS) {
    const skillData = player.skills.skills[skill];
    const progress = getProgressTo99(skillData.xp);
    const isAchieved = skillData.level >= 99;

    milestones.push({
      id: generateMilestoneId('skill_99', skill),
      type: 'skill_99',
      name: `99 ${SKILL_DISPLAY_NAMES[skill]}`,
      description: `Achieve level 99 in ${SKILL_DISPLAY_NAMES[skill]}`,
      status: isAchieved ? 'achieved' : 'in_progress',
      progress,
      skill,
      currentXp: skillData.xp,
      targetXp: xpFor99,
    });
  }

  return milestones;
}

/**
 * Calculate base level milestones
 */
function calculateBaseLevelMilestones(player: Player): BaseLevelMilestone[] {
  const milestones: BaseLevelMilestone[] = [];

  // Find lowest skill
  let lowestSkill: SkillName = 'attack';
  let lowestLevel = 99;

  for (const skill of SKILLS) {
    const level = player.skills.skills[skill].level;
    if (level < lowestLevel) {
      lowestLevel = level;
      lowestSkill = skill;
    }
  }

  for (const threshold of BASE_LEVEL_THRESHOLDS) {
    const isAchieved = lowestLevel >= threshold;
    const progress = Math.min((lowestLevel / threshold) * 100, 100);

    milestones.push({
      id: generateMilestoneId('base_level', threshold),
      type: 'base_level',
      name: `Base ${threshold}`,
      description: `All skills at level ${threshold} or higher`,
      status: isAchieved ? 'achieved' : 'in_progress',
      progress,
      targetLevel: threshold,
      lowestSkill,
      lowestSkillLevel: lowestLevel,
    });
  }

  return milestones;
}

/**
 * Calculate total level milestones
 */
function calculateTotalLevelMilestones(player: Player): TotalLevelMilestone[] {
  const milestones: TotalLevelMilestone[] = [];
  const currentTotal = player.totalLevel;

  for (const threshold of TOTAL_LEVEL_THRESHOLDS) {
    const isAchieved = currentTotal >= threshold;
    const progress = Math.min((currentTotal / threshold) * 100, 100);

    milestones.push({
      id: generateMilestoneId('total_level', threshold),
      type: 'total_level',
      name: `${threshold.toLocaleString()} Total`,
      description: `Reach ${threshold.toLocaleString()} total level`,
      status: isAchieved ? 'achieved' : 'in_progress',
      progress,
      currentLevel: currentTotal,
      targetLevel: threshold,
    });
  }

  return milestones;
}

/**
 * Calculate combat level milestones
 */
function calculateCombatLevelMilestones(player: Player): CombatLevelMilestone[] {
  const milestones: CombatLevelMilestone[] = [];
  const currentCombat = player.combatLevel;

  for (const threshold of COMBAT_LEVEL_THRESHOLDS) {
    const isAchieved = currentCombat >= threshold;
    const progress = Math.min((currentCombat / threshold) * 100, 100);

    milestones.push({
      id: generateMilestoneId('combat_level', threshold),
      type: 'combat_level',
      name: `Combat ${threshold}`,
      description: `Reach combat level ${threshold}`,
      status: isAchieved ? 'achieved' : 'in_progress',
      progress,
      currentLevel: currentCombat,
      targetLevel: threshold,
    });
  }

  return milestones;
}

/**
 * Calculate boss KC milestones
 */
function calculateBossKcMilestones(player: Player): BossKcMilestone[] {
  const milestones: BossKcMilestone[] = [];

  for (const boss of BOSSES) {
    const bossData = player.bosses[boss];
    const currentKc = bossData?.killCount ?? 0;

    // Only create milestones for bosses they've started
    if (currentKc === 0) continue;

    // Get achieved and next thresholds
    for (const threshold of KC_THRESHOLDS) {
      const isAchieved = currentKc >= threshold;
      const progress = Math.min((currentKc / threshold) * 100, 100);

      milestones.push({
        id: generateMilestoneId('boss_kc', boss, threshold),
        type: 'boss_kc',
        name: `${BOSS_DISPLAY_NAMES[boss]} ${threshold} KC`,
        description: `Defeat ${BOSS_DISPLAY_NAMES[boss]} ${threshold} times`,
        status: isAchieved ? 'achieved' : 'in_progress',
        progress,
        boss,
        currentKc,
        targetKc: threshold,
      });
    }
  }

  return milestones;
}

/**
 * Calculate max cape milestone
 */
function calculateMaxCapeMilestone(player: Player): MaxCapeMilestone {
  let skillsAt99 = 0;

  for (const skill of SKILLS) {
    if (player.skills.skills[skill].level >= 99) {
      skillsAt99++;
    }
  }

  const totalSkills = SKILLS.length;
  const progress = (skillsAt99 / totalSkills) * 100;
  const isAchieved = skillsAt99 === totalSkills;

  return {
    id: generateMilestoneId('max_cape'),
    type: 'max_cape',
    name: 'Max Cape',
    description: 'Achieve level 99 in all skills',
    status: isAchieved ? 'achieved' : 'in_progress',
    progress,
    skillsAt99,
    totalSkills,
  };
}

/**
 * Get nearest 99 milestones (skills closest to 99)
 */
export function getNearest99s(player: Player, count: number = 5): Skill99Milestone[] {
  const milestones = calculate99Milestones(player)
    .filter((m) => m.status === 'in_progress')
    .sort((a, b) => b.progress - a.progress);

  return milestones.slice(0, count);
}

/**
 * Get achieved milestones
 */
export function getAchievedMilestones(player: Player): Milestone[] {
  return calculatePlayerMilestones(player).filter((m) => m.status === 'achieved');
}

/**
 * Get in-progress milestones
 */
export function getInProgressMilestones(player: Player): Milestone[] {
  return calculatePlayerMilestones(player).filter((m) => m.status === 'in_progress');
}

