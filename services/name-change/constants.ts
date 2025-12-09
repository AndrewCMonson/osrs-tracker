/**
 * Constants for name change validation
 * XP rates and KC rates for validating realistic progression
 */

/**
 * XP rates in XP/hour for efficient methods
 */
export const XP_RATES: Record<string, number> = {
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

/**
 * Get maximum reasonable XP per day for a skill
 * Based on efficient methods and realistic playtime (8-12 hours/day max)
 */
export function getMaxXpPerDay(skillName: string): number {
  const xpPerHour = XP_RATES[skillName] || 100000; // Default 100k/hour
  // Assume max 12 hours/day of efficient play (very generous)
  // Add 20% buffer for variation
  return Math.floor(xpPerHour * 12 * 1.2);
}

/**
 * Boss KC rates per hour
 */
export const KC_RATES: Record<string, number> = {
  // Fast bosses
  'zulrah': 20,
  'vorkath': 25,
  'cerberus': 30,
  'thermonuclear smoke devil': 40,
  // Medium bosses
  'general graardor': 50,
  'commander zilyana': 50,
  "kree'arra": 40,
  "k'ril tsutsaroth": 50,
  // Default
  'default': 100,
};

/**
 * Get maximum reasonable boss KC per day
 */
export function getMaxKcPerDay(bossName: string): number {
  // Most bosses can be killed 50-200 times per hour depending on the boss
  // Assume max 12 hours/day, very generous
  const hourlyKc = KC_RATES[bossName.toLowerCase()] || KC_RATES['default'];
  return hourlyKc * 12; // 12 hours/day max
}

