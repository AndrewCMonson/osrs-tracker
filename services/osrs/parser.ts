/**
 * Parser for OSRS Hiscores CSV data
 * The hiscores API returns CSV data in a specific order
 */

import { SKILLS, PlayerSkills, SkillData, SkillName } from '@/types/skills';
import { BOSSES, BossData, BossName, PlayerBosses } from '@/types/bosses';

// Order of skills in hiscores response
const SKILL_ORDER: SkillName[] = [
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
];

// Activities that come after skills (we'll skip these for now)
// Includes: League Points, Deadman Points, Bounty Hunter (4 variants),
// Clue Scrolls (7 tiers), LMS, PvP Arena, Soul Wars, Rifts, Colosseum Glory, etc.
const ACTIVITIES_COUNT = 20;

// Order of bosses in hiscores response
const BOSS_ORDER: BossName[] = [...BOSSES];

interface ParsedHiscores {
  overall: {
    rank: number;
    level: number;
    xp: number;
  };
  skills: Record<SkillName, SkillData>;
  bosses: Partial<Record<BossName, BossData>>;
}

/**
 * Parse the CSV response from OSRS Hiscores
 * Format per line: rank,level,xp (for skills) or rank,score (for activities/bosses)
 */
export function parseHiscoresCsv(csv: string): ParsedHiscores {
  const lines = csv.trim().split('\n');
  
  // First line is overall stats
  const [overallRank, overallLevel, overallXp] = lines[0].split(',').map(Number);
  
  const overall = {
    rank: overallRank === -1 ? 0 : overallRank,
    level: overallLevel === -1 ? 0 : overallLevel,
    xp: overallXp === -1 ? 0 : overallXp,
  };

  // Parse skills (lines 1-23)
  const skills = {} as Record<SkillName, SkillData>;
  for (let i = 0; i < SKILL_ORDER.length; i++) {
    const line = lines[i + 1];
    if (!line) continue;
    
    const [rank, level, xp] = line.split(',').map(Number);
    const skillName = SKILL_ORDER[i];
    
    skills[skillName] = {
      name: skillName,
      rank: rank === -1 ? 0 : rank,
      level: level === -1 ? 1 : level,
      xp: xp === -1 ? 0 : xp,
    };
  }

  // Skip activities, parse bosses
  const bossStartIndex = 1 + SKILL_ORDER.length + ACTIVITIES_COUNT;
  const bosses: Partial<Record<BossName, BossData>> = {};
  
  for (let i = 0; i < BOSS_ORDER.length; i++) {
    const lineIndex = bossStartIndex + i;
    if (lineIndex >= lines.length) break;
    
    const line = lines[lineIndex];
    if (!line) continue;
    
    const [rank, kills] = line.split(',').map(Number);
    const bossName = BOSS_ORDER[i];
    
    // Only include if they have KC
    if (kills > 0) {
      bosses[bossName] = {
        name: bossName,
        rank: rank === -1 ? 0 : rank,
        killCount: kills,
      };
    }
  }

  return { overall, skills, bosses };
}

/**
 * Convert parsed hiscores to PlayerSkills format
 */
export function toPlayerSkills(parsed: ParsedHiscores): PlayerSkills {
  return {
    overall: parsed.overall,
    skills: parsed.skills,
  };
}

