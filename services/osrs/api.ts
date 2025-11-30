/**
 * OSRS Hiscores API client
 */

import { normalizeUsername } from '@/lib/utils';
import { BossData, BossName } from '@/types/bosses';
import { PlayerSkills } from '@/types/skills';
import { parseHiscoresCsv } from './parser';
import { HiscoresEndpoint } from './types';

export interface OsrsPlayerData {
  username: string;
  skills: PlayerSkills;
  bosses: Partial<Record<BossName, BossData>>;
}

export class OsrsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'OsrsApiError';
  }
}

/**
 * Fetch player data from OSRS Hiscores
 */
export async function fetchPlayerHiscores(
  username: string,
  endpoint: HiscoresEndpoint = 'hiscore_oldschool'
): Promise<OsrsPlayerData> {
  const normalizedUsername = normalizeUsername(username);
  const url = `https://secure.runescape.com/m=${endpoint}/index_lite.ws?player=${encodeURIComponent(normalizedUsername)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'OSRS-Tracker/1.0',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new OsrsApiError(`Player "${username}" not found`, 404);
      }
      throw new OsrsApiError(`Failed to fetch hiscores: ${response.status}`, response.status);
    }

    const csv = await response.text();
    const parsed = parseHiscoresCsv(csv);

    return {
      username: normalizedUsername,
      skills: {
        overall: parsed.overall,
        skills: parsed.skills,
      },
      bosses: parsed.bosses,
    };
  } catch (error) {
    if (error instanceof OsrsApiError) {
      throw error;
    }
    throw new OsrsApiError(`Failed to fetch player data: ${error}`);
  }
}

/**
 * Try to detect account type by checking different hiscores
 */
export async function detectAccountType(
  username: string
): Promise<'normal' | 'ironman' | 'hardcore_ironman' | 'ultimate_ironman'> {
  // Check in order of restrictiveness
  const checks: Array<{ type: 'hardcore_ironman' | 'ultimate_ironman' | 'ironman'; endpoint: HiscoresEndpoint }> = [
    { type: 'hardcore_ironman', endpoint: 'hiscore_oldschool_hardcore_ironman' },
    { type: 'ultimate_ironman', endpoint: 'hiscore_oldschool_ultimate' },
    { type: 'ironman', endpoint: 'hiscore_oldschool_ironman' },
  ];

  for (const check of checks) {
    try {
      await fetchPlayerHiscores(username, check.endpoint);
      return check.type;
    } catch {
      // Not found on this hiscore, try next
      continue;
    }
  }

  return 'normal';
}

/**
 * Get the appropriate hiscores endpoint for an account type
 */
export function getEndpointForAccountType(
  accountType: string
): HiscoresEndpoint {
  switch (accountType) {
    case 'ironman':
      return 'hiscore_oldschool_ironman';
    case 'hardcore_ironman':
      return 'hiscore_oldschool_hardcore_ironman';
    case 'ultimate_ironman':
      return 'hiscore_oldschool_ultimate';
    default:
      return 'hiscore_oldschool';
  }
}

