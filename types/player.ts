/**
 * Player/Account types
 */

import { PlayerBosses } from './bosses';
import { Milestone } from './milestones';
import { PlayerSkills } from './skills';

export interface Player {
  id: string;
  username: string;
  displayName: string;
  accountType: AccountType;
  combatLevel: number;
  totalLevel: number;
  totalXp: number;
  skills: PlayerSkills;
  bosses: Partial<PlayerBosses>;
  lastUpdated: Date;
  claimedBy?: string; // User ID if claimed
  claimedAt?: Date;
}

export type AccountType =
  | 'normal'
  | 'ironman'
  | 'hardcore_ironman'
  | 'ultimate_ironman'
  | 'group_ironman'
  | 'hardcore_group_ironman'
  | 'unranked_group_ironman'
  | 'skiller'
  | 'defence_pure';

export const ACCOUNT_TYPE_DISPLAY: Record<AccountType, string> = {
  normal: 'Normal',
  ironman: 'Ironman',
  hardcore_ironman: 'Hardcore Ironman',
  ultimate_ironman: 'Ultimate Ironman',
  group_ironman: 'Group Ironman',
  hardcore_group_ironman: 'Hardcore Group Ironman',
  unranked_group_ironman: 'Unranked Group Ironman',
  skiller: 'Skiller',
  defence_pure: 'Defence Pure',
};

export interface PlayerSummary {
  username: string;
  displayName: string;
  accountType: AccountType;
  combatLevel: number;
  totalLevel: number;
  totalXp: number;
  lastUpdated: Date;
  isClaimed: boolean;
}

export interface PlayerProfile extends Player {
  milestones: Milestone[];
  recentAchievements: Milestone[];
  nearestGoals: Milestone[];
}

export interface ClaimVerification {
  id: string;
  userId: string;
  username: string;
  token: string;
  status: 'pending' | 'verified' | 'expired' | 'failed';
  createdAt: Date;
  expiresAt: Date;
  verifiedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  claimedAccounts: string[]; // Player usernames
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface PlayerSearchResult {
  username: string;
  displayName: string;
  accountType: AccountType;
  totalLevel: number;
  isClaimed: boolean;
}

export interface PlayerLookupResponse {
  success: boolean;
  player?: Player;
  error?: string;
}

export interface VerificationStartResponse {
  success: boolean;
  verification?: {
    id: string;
    token: string;
    expiresAt: Date;
    instructions: string;
  };
  error?: string;
}

export interface VerificationCompleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}



