/**
 * Database helper utilities
 */

export function isDatabaseAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

export function isModelAvailable<T>(
  model: T | undefined
): model is T {
  return model !== undefined;
}

