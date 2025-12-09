/**
 * Legacy utils file - re-exports from organized modules
 * Maintains backward compatibility
 */

// Re-export all utilities from organized modules
export * from './utils/index';

// Explicit exports for commonly used functions to ensure they're available
export { cn, safeJsonParse } from './utils/common';
export { formatDate, formatRelativeTime } from './utils/formatting';
export { normalizeUsername, formatUsername } from './utils/validation';
export { calculateTotalLevel } from './utils/player';

/**
 * Generate a random verification token
 * TODO: Move to auth utilities or remove if unused
 */
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sleep for a specified number of milliseconds
 * TODO: Remove if unused or move to test utilities
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}









