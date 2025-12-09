/**
 * Normalize OSRS username (lowercase, replace spaces with underscores)
 */
export function normalizeUsername(username: string): string {
  return username.toLowerCase().replace(/\s+/g, '_').trim();
}

/**
 * Format OSRS username for display (replace underscores with spaces)
 */
export function formatUsername(username: string): string {
  return username.replace(/_/g, ' ');
}

