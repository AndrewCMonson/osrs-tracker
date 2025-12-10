/**
 * GraphQL Subscription Resolvers
 */

import { normalizeUsername } from '@/lib/utils';
import { lookupPlayer } from '@/services/player';
import type { GraphQLContext } from '../context';
import type { SubscriptionPlayerUpdatedArgs, SubscriptionSnapshotCreatedArgs } from '../generated/types';

// Simple in-memory pubsub for subscriptions
// In production, you'd want to use Redis or another pub/sub system
const subscribers = new Map<string, Set<(data: any) => void>>();

export function publish(event: string, data: any) {
  const handlers = subscribers.get(event);
  if (handlers) {
    handlers.forEach((handler) => handler(data));
  }
}

export const subscriptions = {
  playerUpdated: {
    subscribe: async function* (
      _: unknown,
      { username }: SubscriptionPlayerUpdatedArgs,
      __: GraphQLContext
    ) {
      const normalizedUsername = normalizeUsername(username);
      const eventKey = `player:${normalizedUsername}`;

      // Create a queue for this subscription
      const queue: any[] = [];
      let resolveNext: ((value: any) => void) | null = null;

      const handler = (data: any) => {
        if (resolveNext) {
          resolveNext({ playerUpdated: data });
          resolveNext = null;
        } else {
          queue.push(data);
        }
      };

      // Add to subscribers
      if (!subscribers.has(eventKey)) {
        subscribers.set(eventKey, new Set());
      }
      subscribers.get(eventKey)!.add(handler);

      try {
        // Send initial player data
        const result = await lookupPlayer(username);
        if (result.success && result.player) {
          yield { playerUpdated: result.player };
        }

        // Keep yielding updates
        while (true) {
          if (queue.length > 0) {
            const data = queue.shift()!;
            yield { playerUpdated: data };
          } else {
            // Wait for next update
            yield new Promise((resolve) => {
              resolveNext = resolve;
            });
          }
        }
      } finally {
        // Clean up
        subscribers.get(eventKey)?.delete(handler);
        if (subscribers.get(eventKey)?.size === 0) {
          subscribers.delete(eventKey);
        }
      }
    },
  },

  snapshotCreated: {
    subscribe: async function* (
      _: unknown,
      { username }: SubscriptionSnapshotCreatedArgs,
      context: GraphQLContext
    ) {
      const normalizedUsername = normalizeUsername(username);
      const eventKey = `snapshot:${normalizedUsername}`;

      const queue: any[] = [];
      let resolveNext: ((value: any) => void) | null = null;

      const handler = (data: any) => {
        if (resolveNext) {
          resolveNext({ snapshotCreated: data });
          resolveNext = null;
        } else {
          queue.push(data);
        }
      };

      if (!subscribers.has(eventKey)) {
        subscribers.set(eventKey, new Set());
      }
      subscribers.get(eventKey)!.add(handler);

      try {
        // Get initial snapshots
        const player = await context.prisma.player.findUnique({
          where: { username: normalizedUsername },
        });

        if (player) {
          const snapshots = await context.prisma.playerSnapshot.findMany({
            where: { playerId: player.id },
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              skills: true,
              bosses: true,
            },
          });

          if (snapshots.length > 0) {
            const snapshot = snapshots[0];
            yield {
              snapshotCreated: {
                id: snapshot.id,
                playerId: snapshot.playerId,
                totalLevel: snapshot.totalLevel,
                totalXp: snapshot.totalXp,
                combatLevel: snapshot.combatLevel,
                createdAt: snapshot.createdAt,
                skills: snapshot.skills.map((s: { name: string; level: number; xp: bigint; rank: number }) => ({
                  name: s.name,
                  level: s.level,
                  xp: s.xp,
                  rank: s.rank,
                })),
                bosses: snapshot.bosses.map((b: { bossName: string; kc: number; rank: number }) => ({
                  bossName: b.bossName,
                  kc: b.kc,
                  rank: b.rank,
                })),
              },
            };
          }
        }

        while (true) {
          if (queue.length > 0) {
            const data = queue.shift()!;
            yield { snapshotCreated: data };
          } else {
            yield new Promise((resolve) => {
              resolveNext = resolve;
            });
          }
        }
      } finally {
        subscribers.get(eventKey)?.delete(handler);
        if (subscribers.get(eventKey)?.size === 0) {
          subscribers.delete(eventKey);
        }
      }
    },
  },
};

