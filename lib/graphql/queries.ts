/**
 * GraphQL Query Definitions
 */

import { gql } from 'graphql-request';

/**
 * Get player data with skills and bosses
 */
export const GET_PLAYER = gql`
  query GetPlayer($username: String!) {
    player(username: $username) {
      id
      username
      displayName
      accountType
      combatLevel
      totalLevel
      totalXp
      lastUpdated
      claimedBy
      claimedAt
      skills {
        overall {
          level
          xp
          rank
        }
        skills {
          attack { level xp rank }
          defence { level xp rank }
          strength { level xp rank }
          hitpoints { level xp rank }
          ranged { level xp rank }
          prayer { level xp rank }
          magic { level xp rank }
          cooking { level xp rank }
          woodcutting { level xp rank }
          fletching { level xp rank }
          fishing { level xp rank }
          firemaking { level xp rank }
          crafting { level xp rank }
          smithing { level xp rank }
          mining { level xp rank }
          herblore { level xp rank }
          agility { level xp rank }
          thieving { level xp rank }
          slayer { level xp rank }
          farming { level xp rank }
          runecraft { level xp rank }
          hunter { level xp rank }
          construction { level xp rank }
          sailing { level xp rank }
        }
      }
      bosses {
        bossName
        killCount
        rank
      }
    }
  }
`;

/**
 * Get dashboard data for authenticated user
 */
export const GET_DASHBOARD = gql`
  query GetDashboard {
    dashboard {
      accounts {
        id
        username
        displayName
        accountType
        totalLevel
        totalXp
        combatLevel
        lastUpdated
      }
      totals {
        totalXp
        totalLevels
        accountCount
        skillXp
      }
    }
  }
`;

/**
 * Get player milestones
 */
export const GET_MILESTONES = gql`
  query GetMilestones($username: String!) {
    milestones(username: $username) {
      username
      stats {
        totalMilestones
        achieved
        inProgress
        completionPercentage
      }
      nearest99s {
        skill
        currentXp
        targetXp
        progress
      }
      achieved {
        id
        type
        name
        description
        status
        progress
        currentValue
        targetValue
        skill
        bossName
      }
      inProgress {
        id
        type
        name
        description
        status
        progress
        currentValue
        targetValue
        skill
        bossName
      }
    }
  }
`;

/**
 * Get player history for charts
 */
export const GET_HISTORY = gql`
  query GetHistory($username: String!, $period: String) {
    history(username: $username, period: $period) {
      skills {
        skill
        dataPoints {
          date
          level
          xp
          rank
        }
      }
      total {
        date
        totalXp
        totalLevel
      }
    }
  }
`;

/**
 * Refresh player data from OSRS API
 */
export const REFRESH_PLAYER = gql`
  mutation RefreshPlayer($username: String!) {
    refreshPlayer(username: $username) {
      success
      player {
        username
        displayName
        totalLevel
        totalXp
        combatLevel
        accountType
        lastUpdated
      }
      error
    }
  }
`;

/**
 * Claim a player account
 */
export const CLAIM_PLAYER = gql`
  mutation ClaimPlayer($username: String!, $token: String!) {
    claimPlayer(username: $username, token: $token) {
      success
      message
      error
    }
  }
`;

/**
 * Update player display name
 */
export const UPDATE_DISPLAY_NAME = gql`
  mutation UpdateDisplayName($username: String!, $displayName: String!) {
    updatePlayerDisplayName(username: $username, displayName: $displayName) {
      success
      player {
        username
        displayName
      }
      error
    }
  }
`;

/**
 * Get name change history for a player
 */
export const GET_NAME_CHANGE_HISTORY = gql`
  query GetNameChangeHistory($username: String!) {
    nameChangeHistory(username: $username) {
      id
      oldUsername
      newUsername
      createdAt
    }
  }
`;

/**
 * Create a snapshot for a player
 */
export const CREATE_SNAPSHOT = gql`
  mutation CreateSnapshot($username: String!) {
    createSnapshot(username: $username) {
      success
      snapshot {
        id
        createdAt
      }
      error
    }
  }
`;
