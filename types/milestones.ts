/**
 * OSRS Milestone definitions and types
 */

import { BossName } from './bosses';
import { SkillName } from './skills';

export type MilestoneType =
  | 'skill_99'
  | 'skill_max'
  | 'base_level'
  | 'total_level'
  | 'boss_kc'
  | 'quest_cape'
  | 'achievement_diary'
  | 'combat_level'
  | 'max_cape';

export type MilestoneStatus = 'achieved' | 'in_progress' | 'locked';

export interface BaseMilestone {
  id: string;
  type: MilestoneType;
  name: string;
  description: string;
  status: MilestoneStatus;
  progress: number; // 0-100
  achievedAt?: Date;
}

export interface Skill99Milestone extends BaseMilestone {
  type: 'skill_99';
  skill: SkillName;
  currentXp: number;
  targetXp: number;
}

export interface BaseLevelMilestone extends BaseMilestone {
  type: 'base_level';
  targetLevel: number;
  lowestSkill: SkillName;
  lowestSkillLevel: number;
}

export interface TotalLevelMilestone extends BaseMilestone {
  type: 'total_level';
  currentLevel: number;
  targetLevel: number;
}

export interface BossKcMilestone extends BaseMilestone {
  type: 'boss_kc';
  boss: BossName;
  currentKc: number;
  targetKc: number;
}

export interface CombatLevelMilestone extends BaseMilestone {
  type: 'combat_level';
  currentLevel: number;
  targetLevel: number;
}

export interface MaxCapeMilestone extends BaseMilestone {
  type: 'max_cape';
  skillsAt99: number;
  totalSkills: number;
}

export type Milestone =
  | Skill99Milestone
  | BaseLevelMilestone
  | TotalLevelMilestone
  | BossKcMilestone
  | CombatLevelMilestone
  | MaxCapeMilestone;

// Common milestone thresholds
export const BASE_LEVEL_THRESHOLDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 99] as const;
export const TOTAL_LEVEL_THRESHOLDS = [
  250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2100, 2200, 2277, 2376,
] as const;
export const COMBAT_LEVEL_THRESHOLDS = [50, 70, 90, 100, 110, 120, 126] as const;

/**
 * Calculate combat level from stats
 */
export function calculateCombatLevel(stats: {
  attack: number;
  strength: number;
  defence: number;
  hitpoints: number;
  prayer: number;
  ranged: number;
  magic: number;
}): number {
  const base = 0.25 * (stats.defence + stats.hitpoints + Math.floor(stats.prayer / 2));
  const melee = 0.325 * (stats.attack + stats.strength);
  const range = 0.325 * (Math.floor(stats.ranged / 2) + stats.ranged);
  const mage = 0.325 * (Math.floor(stats.magic / 2) + stats.magic);

  return Math.floor(base + Math.max(melee, range, mage));
}

/**
 * Generate a unique milestone ID
 */
export function generateMilestoneId(type: MilestoneType, ...args: (string | number)[]): string {
  return `${type}_${args.join('_')}`;
}

