/**
 * GraphQL Schema Definition
 */

import { createSchema } from 'graphql-yoga';
import { GraphQLContext } from './context';
import { mutations } from './resolvers/mutations';
import { queries } from './resolvers/queries';
import { subscriptions } from './resolvers/subscriptions';
import { typeResolvers } from './resolvers/types';

export const schema = createSchema<GraphQLContext>({
  typeDefs: /* GraphQL */ `
    scalar DateTime
    scalar BigInt

    type Query {
      player(username: String!): Player
      players(claimed: Boolean): [Player!]!
      dashboard: Dashboard
      milestones(username: String!): MilestonesResponse
      history(username: String!, period: String): HistoryResponse
    }

    type Mutation {
      refreshPlayer(username: String!): PlayerResponse
      claimPlayer(username: String!, token: String!): ClaimPlayerResponse
      updatePlayerDisplayName(username: String!, displayName: String!): PlayerResponse
    }

    type Subscription {
      playerUpdated(username: String!): Player
      snapshotCreated(username: String!): Snapshot
    }

    type Player {
      id: String!
      username: String!
      displayName: String
      accountType: String!
      totalLevel: Int!
      totalXp: BigInt!
      combatLevel: Int!
      skills: PlayerSkills!
      bosses: [BossKC!]!
      lastUpdated: DateTime
      claimedBy: String
      claimedAt: DateTime
    }

    type PlayerSkills {
      overall: SkillData!
      skills: SkillMap!
    }

    type SkillData {
      level: Int!
      xp: BigInt!
      rank: Int!
    }

    type SkillMap {
      attack: SkillData
      strength: SkillData
      defence: SkillData
      hitpoints: SkillData
      ranged: SkillData
      prayer: SkillData
      magic: SkillData
      cooking: SkillData
      woodcutting: SkillData
      fletching: SkillData
      fishing: SkillData
      firemaking: SkillData
      crafting: SkillData
      smithing: SkillData
      mining: SkillData
      herblore: SkillData
      agility: SkillData
      thieving: SkillData
      slayer: SkillData
      farming: SkillData
      runecraft: SkillData
      hunter: SkillData
      construction: SkillData
      sailing: SkillData
    }

    type BossKC {
      bossName: String!
      killCount: Int!
      rank: Int!
    }

    type Dashboard {
      accounts: [PlayerAccount!]!
      totals: DashboardTotals!
    }

    type PlayerAccount {
      id: String!
      username: String!
      displayName: String!
      accountType: String!
      totalLevel: Int!
      totalXp: BigInt!
      combatLevel: Int!
      lastUpdated: DateTime
    }

    type DashboardTotals {
      totalXp: BigInt!
      totalLevels: Int!
      accountCount: Int!
      skillXp: SkillXpMap!
    }

    type SkillXpMap {
      attack: BigInt
      strength: BigInt
      defence: BigInt
      hitpoints: BigInt
      ranged: BigInt
      prayer: BigInt
      magic: BigInt
      cooking: BigInt
      woodcutting: BigInt
      fletching: BigInt
      fishing: BigInt
      firemaking: BigInt
      crafting: BigInt
      smithing: BigInt
      mining: BigInt
      herblore: BigInt
      agility: BigInt
      thieving: BigInt
      slayer: BigInt
      farming: BigInt
      runecraft: BigInt
      hunter: BigInt
      construction: BigInt
      sailing: BigInt
    }

    type MilestonesResponse {
      username: String!
      stats: MilestoneStats!
      nearest99s: [Milestone!]!
      achieved: [Milestone!]!
      inProgress: [Milestone!]!
    }

    type MilestoneStats {
      totalMilestones: Int!
      achieved: Int!
      inProgress: Int!
      completionPercentage: Float!
    }

    type Milestone {
      id: String!
      type: String!
      name: String!
      description: String!
      status: String!
      progress: Float!
      achievedAt: DateTime
      skill: String
      currentXp: BigInt
      targetXp: BigInt
      targetLevel: Int
      lowestSkill: String
      lowestSkillLevel: Int
      currentLevel: Int
      boss: String
      currentKc: Int
      targetKc: Int
      skillsAt99: Int
      totalSkills: Int
    }

    type HistoryResponse {
      skills: [SkillHistory!]!
      total: [TotalHistoryPoint!]!
    }

    type SkillHistory {
      skill: String!
      dataPoints: [HistoryDataPoint!]!
    }

    type HistoryDataPoint {
      date: DateTime!
      level: Int!
      xp: BigInt!
      rank: Int!
    }

    type TotalHistoryPoint {
      date: DateTime!
      totalXp: BigInt!
      totalLevel: Int!
    }

    type PlayerResponse {
      success: Boolean!
      player: Player
      error: String
    }

    type ClaimPlayerResponse {
      success: Boolean!
      message: String
      error: String
    }

    type Snapshot {
      id: String!
      playerId: String!
      totalLevel: Int!
      totalXp: BigInt!
      combatLevel: Int!
      createdAt: DateTime!
      skills: [SkillSnapshot!]!
      bosses: [BossSnapshot!]!
    }

    type SkillSnapshot {
      name: String!
      level: Int!
      xp: BigInt!
      rank: Int!
    }

    type BossSnapshot {
      bossName: String!
      kc: Int!
      rank: Int!
    }
  `,
  resolvers: {
    Query: queries,
    Mutation: mutations,
    Subscription: subscriptions,
    ...typeResolvers,
  },
});
