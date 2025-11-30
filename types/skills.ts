/**
 * OSRS Skill definitions and types
 */

export const SKILLS = [
  'attack',
  'defence',
  'strength',
  'hitpoints',
  'ranged',
  'prayer',
  'magic',
  'cooking',
  'woodcutting',
  'fletching',
  'fishing',
  'firemaking',
  'crafting',
  'smithing',
  'mining',
  'herblore',
  'agility',
  'thieving',
  'slayer',
  'farming',
  'runecraft',
  'hunter',
  'construction',
  'sailing',
] as const;

export type SkillName = (typeof SKILLS)[number];

export interface SkillData {
  name: SkillName;
  rank: number;
  level: number;
  xp: number;
}

export interface PlayerSkills {
  overall: {
    rank: number;
    level: number; // Total level
    xp: number;
  };
  skills: Record<SkillName, SkillData>;
}

// XP table for levels 1-99
export const XP_TABLE: number[] = [
  0, 0, 83, 174, 276, 388, 512, 650, 801, 969, 1154, 1358, 1584, 1833, 2107,
  2411, 2746, 3115, 3523, 3973, 4470, 5018, 5624, 6291, 7028, 7842, 8740, 9730,
  10824, 12031, 13363, 14833, 16456, 18247, 20224, 22406, 24815, 27473, 30408,
  33648, 37224, 41171, 45529, 50339, 55649, 61512, 67983, 75127, 83014, 91721,
  101333, 111945, 123660, 136594, 150872, 166636, 184040, 203254, 224466, 247886,
  273742, 302288, 333804, 368599, 407015, 449428, 496254, 547953, 605032, 668051,
  737627, 814445, 899257, 992895, 1096278, 1210421, 1336443, 1475581, 1629200,
  1798808, 1986068, 2192818, 2421087, 2673114, 2951373, 3258594, 3597792,
  3972294, 4385776, 4842295, 5346332, 5902831, 6517253, 7195629, 7944614,
  8771558, 9684577, 10692629, 11805606, 13034431,
];

export const MAX_XP = 200_000_000;
export const MAX_LEVEL = 99;

/**
 * Get the level for a given XP amount
 */
export function getLevelForXp(xp: number): number {
  for (let level = 98; level >= 1; level--) {
    if (xp >= XP_TABLE[level + 1]) {
      return level + 1;
    }
  }
  return 1;
}

/**
 * Get XP required for a specific level
 */
export function getXpForLevel(level: number): number {
  if (level < 1) return 0;
  if (level > 99) return XP_TABLE[99];
  return XP_TABLE[level];
}

/**
 * Calculate percentage progress to next level (or 99 if at 99)
 */
export function getProgressToNextLevel(xp: number): number {
  const currentLevel = getLevelForXp(xp);
  if (currentLevel >= 99) {
    // Progress to 200m XP
    return Math.min((xp / MAX_XP) * 100, 100);
  }

  const currentLevelXp = XP_TABLE[currentLevel];
  const nextLevelXp = XP_TABLE[currentLevel + 1];
  const xpIntoLevel = xp - currentLevelXp;
  const xpForLevel = nextLevelXp - currentLevelXp;

  return (xpIntoLevel / xpForLevel) * 100;
}

/**
 * Calculate percentage progress to level 99
 */
export function getProgressTo99(xp: number): number {
  const xpFor99 = XP_TABLE[99];
  return Math.min((xp / xpFor99) * 100, 100);
}

/**
 * Get XP remaining to level 99
 */
export function getXpTo99(xp: number): number {
  const xpFor99 = XP_TABLE[99];
  return Math.max(0, xpFor99 - xp);
}

/**
 * Format XP number with commas
 */
export function formatXp(xp: number): string {
  return xp.toLocaleString();
}

/**
 * Format XP in shorthand (e.g., 13.0M, 500K)
 */
export function formatXpShort(xp: number): string {
  if (xp >= 1_000_000) {
    return `${(xp / 1_000_000).toFixed(1)}M`;
  }
  if (xp >= 1_000) {
    return `${(xp / 1_000).toFixed(0)}K`;
  }
  return xp.toString();
}

