/**
 * Types for OSRS Hiscores API responses
 */

export interface HiscoresResponse {
  skills: HiscoresSkill[];
  activities: HiscoresActivity[];
  bosses: HiscoresBoss[];
}

export interface HiscoresSkill {
  id: number;
  name: string;
  rank: number;
  level: number;
  xp: number;
}

export interface HiscoresActivity {
  id: number;
  name: string;
  rank: number;
  score: number;
}

export interface HiscoresBoss {
  id: number;
  name: string;
  rank: number;
  kills: number;
}

export type HiscoresEndpoint =
  | 'hiscore_oldschool'
  | 'hiscore_oldschool_ironman'
  | 'hiscore_oldschool_hardcore_ironman'
  | 'hiscore_oldschool_ultimate'
  | 'hiscore_oldschool_deadman'
  | 'hiscore_oldschool_seasonal'
  | 'hiscore_oldschool_tournament'
  | 'hiscore_oldschool_fresh_start';

export const HISCORES_ENDPOINTS: Record<string, HiscoresEndpoint> = {
  normal: 'hiscore_oldschool',
  ironman: 'hiscore_oldschool_ironman',
  hardcore: 'hiscore_oldschool_hardcore_ironman',
  ultimate: 'hiscore_oldschool_ultimate',
};







