/**
 * Shared helper functions for name change service
 */

import { db } from '@/lib/db';

/**
 * Check if PlayerNameChange model is available in Prisma client
 */
export function isNameChangeModelAvailable(): boolean {
  try {
    return !!db.playerNameChange;
  } catch (error) {
    return false;
  }
}

