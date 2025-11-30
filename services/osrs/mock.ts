/**
 * Mock OSRS data for development and testing
 */

import { Player, AccountType } from '@/types/player';
import { PlayerSkills, SkillName, SKILLS } from '@/types/skills';
import { BossData, BossName, BOSSES } from '@/types/bosses';
import { calculateCombatLevel } from '@/types/milestones';

/**
 * Generate random skill data
 */
function generateRandomSkills(bias: 'low' | 'mid' | 'high' | 'maxed' = 'mid'): PlayerSkills {
  const levelRanges = {
    low: { min: 1, max: 50 },
    mid: { min: 40, max: 85 },
    high: { min: 70, max: 99 },
    maxed: { min: 99, max: 99 },
  };

  const range = levelRanges[bias];
  const skills = {} as Record<SkillName, { name: SkillName; rank: number; level: number; xp: number }>;
  
  let totalLevel = 0;
  let totalXp = 0;

  for (const skill of SKILLS) {
    const level = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    // Approximate XP calculation
    const xp = Math.floor(Math.pow(level, 3) * 10 + Math.random() * 10000);
    const rank = Math.floor(Math.random() * 500000) + 1;

    skills[skill] = {
      name: skill,
      rank,
      level,
      xp,
    };

    totalLevel += level;
    totalXp += xp;
  }

  return {
    overall: {
      rank: Math.floor(Math.random() * 2000000) + 1,
      level: totalLevel,
      xp: totalXp,
    },
    skills,
  };
}

/**
 * Generate random boss data
 */
function generateRandomBosses(activity: 'none' | 'casual' | 'active' | 'sweaty' = 'casual'): Partial<Record<BossName, BossData>> {
  const bosses: Partial<Record<BossName, BossData>> = {};
  
  const activitySettings = {
    none: { chance: 0, maxKc: 0 },
    casual: { chance: 0.3, maxKc: 100 },
    active: { chance: 0.5, maxKc: 500 },
    sweaty: { chance: 0.8, maxKc: 5000 },
  };

  const settings = activitySettings[activity];

  for (const boss of BOSSES) {
    if (Math.random() < settings.chance) {
      const kc = Math.floor(Math.random() * settings.maxKc) + 1;
      bosses[boss] = {
        name: boss,
        rank: Math.floor(Math.random() * 100000) + 1,
        killCount: kc,
      };
    }
  }

  return bosses;
}

/**
 * Mock player data
 */
export const MOCK_PLAYERS: Record<string, Player> = {
  zezima: {
    id: 'mock-zezima',
    username: 'zezima',
    displayName: 'Zezima',
    accountType: 'normal',
    combatLevel: 126,
    totalLevel: 2277,
    totalXp: 4600000000,
    skills: generateRandomSkills('maxed'),
    bosses: generateRandomBosses('sweaty'),
    lastUpdated: new Date(),
  },
  lynx_titan: {
    id: 'mock-lynx-titan',
    username: 'lynx_titan',
    displayName: 'Lynx Titan',
    accountType: 'normal',
    combatLevel: 126,
    totalLevel: 2277,
    totalXp: 4600000000,
    skills: generateRandomSkills('maxed'),
    bosses: generateRandomBosses('active'),
    lastUpdated: new Date(),
  },
  woox: {
    id: 'mock-woox',
    username: 'woox',
    displayName: 'Woox',
    accountType: 'normal',
    combatLevel: 126,
    totalLevel: 2200,
    totalXp: 3500000000,
    skills: generateRandomSkills('high'),
    bosses: generateRandomBosses('sweaty'),
    lastUpdated: new Date(),
  },
  settled: {
    id: 'mock-settled',
    username: 'settled',
    displayName: 'Settled',
    accountType: 'ultimate_ironman',
    combatLevel: 115,
    totalLevel: 1850,
    totalXp: 150000000,
    skills: generateRandomSkills('mid'),
    bosses: generateRandomBosses('casual'),
    lastUpdated: new Date(),
  },
};

/**
 * Get mock player by username
 */
export function getMockPlayer(username: string): Player | null {
  const normalized = username.toLowerCase().replace(/\s+/g, '_');
  
  if (MOCK_PLAYERS[normalized]) {
    return MOCK_PLAYERS[normalized];
  }

  // Generate a random player for any unknown username
  const skills = generateRandomSkills('mid');
  const combatLevel = calculateCombatLevel({
    attack: skills.skills.attack.level,
    strength: skills.skills.strength.level,
    defence: skills.skills.defence.level,
    hitpoints: skills.skills.hitpoints.level,
    prayer: skills.skills.prayer.level,
    ranged: skills.skills.ranged.level,
    magic: skills.skills.magic.level,
  });

  return {
    id: `mock-${normalized}`,
    username: normalized,
    displayName: username,
    accountType: 'normal',
    combatLevel,
    totalLevel: skills.overall.level,
    totalXp: skills.overall.xp,
    skills,
    bosses: generateRandomBosses('casual'),
    lastUpdated: new Date(),
  };
}

/**
 * Check if we should use mock data
 * Only uses mock when explicitly enabled via USE_MOCK_DATA=true
 */
export function shouldUseMock(): boolean {
  return process.env.USE_MOCK_DATA === 'true';
}

