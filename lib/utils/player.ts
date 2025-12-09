import { SKILLS } from '@/types/skills';

/**
 * Calculate actual total level from individual skills (capped at 99 each)
 */
export function calculateTotalLevel(
  skills: Record<string, { level: number }>
): number {
  return SKILLS.reduce((total, skill) => {
    const level = skills[skill]?.level ?? 1;
    return total + Math.min(level, 99); // Cap at 99 for total level calculation
  }, 0);
}

