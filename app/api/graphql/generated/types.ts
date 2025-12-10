import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { PlayerModel, BossKcModel } from '@/types/prisma';
import { Milestone as MilestoneModel } from '@/types/milestones';
import { PlayerSnapshot as SnapshotModel, SkillSnapshot as SkillSnapshotModel, BossSnapshot as BossSnapshotModel } from '@prisma/client';
import { GraphQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

export type BossKc = {
  __typename?: 'BossKC';
  bossName: Scalars['String']['output'];
  killCount: Scalars['Int']['output'];
  rank: Scalars['Int']['output'];
};

export type BossSnapshot = {
  __typename?: 'BossSnapshot';
  bossName: Scalars['String']['output'];
  kc: Scalars['Int']['output'];
  rank: Scalars['Int']['output'];
};

export type ClaimPlayerResponse = {
  __typename?: 'ClaimPlayerResponse';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Dashboard = {
  __typename?: 'Dashboard';
  accounts: Array<PlayerAccount>;
  totals: DashboardTotals;
};

export type DashboardTotals = {
  __typename?: 'DashboardTotals';
  accountCount: Scalars['Int']['output'];
  skillXp: SkillXpMap;
  totalLevels: Scalars['Int']['output'];
  totalXp: Scalars['BigInt']['output'];
};

export type HistoryDataPoint = {
  __typename?: 'HistoryDataPoint';
  date: Scalars['DateTime']['output'];
  level: Scalars['Int']['output'];
  rank: Scalars['Int']['output'];
  xp: Scalars['BigInt']['output'];
};

export type HistoryResponse = {
  __typename?: 'HistoryResponse';
  skills: Array<SkillHistory>;
  total: Array<TotalHistoryPoint>;
};

export type Milestone = {
  __typename?: 'Milestone';
  achievedAt?: Maybe<Scalars['DateTime']['output']>;
  boss?: Maybe<Scalars['String']['output']>;
  currentKc?: Maybe<Scalars['Int']['output']>;
  currentLevel?: Maybe<Scalars['Int']['output']>;
  currentXp?: Maybe<Scalars['BigInt']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lowestSkill?: Maybe<Scalars['String']['output']>;
  lowestSkillLevel?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  progress: Scalars['Float']['output'];
  skill?: Maybe<Scalars['String']['output']>;
  skillsAt99?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  targetKc?: Maybe<Scalars['Int']['output']>;
  targetLevel?: Maybe<Scalars['Int']['output']>;
  targetXp?: Maybe<Scalars['BigInt']['output']>;
  totalSkills?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
};

export type MilestoneStats = {
  __typename?: 'MilestoneStats';
  achieved: Scalars['Int']['output'];
  completionPercentage: Scalars['Float']['output'];
  inProgress: Scalars['Int']['output'];
  totalMilestones: Scalars['Int']['output'];
};

export type MilestonesResponse = {
  __typename?: 'MilestonesResponse';
  achieved: Array<Milestone>;
  inProgress: Array<Milestone>;
  nearest99s: Array<Milestone>;
  stats: MilestoneStats;
  username: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  claimPlayer?: Maybe<ClaimPlayerResponse>;
  refreshPlayer?: Maybe<PlayerResponse>;
  updatePlayerDisplayName?: Maybe<PlayerResponse>;
};


export type MutationClaimPlayerArgs = {
  token: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRefreshPlayerArgs = {
  username: Scalars['String']['input'];
};


export type MutationUpdatePlayerDisplayNameArgs = {
  displayName: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Player = {
  __typename?: 'Player';
  accountType: Scalars['String']['output'];
  bosses: Array<BossKc>;
  claimedAt?: Maybe<Scalars['DateTime']['output']>;
  claimedBy?: Maybe<Scalars['String']['output']>;
  combatLevel: Scalars['Int']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastUpdated?: Maybe<Scalars['DateTime']['output']>;
  skills: PlayerSkills;
  totalLevel: Scalars['Int']['output'];
  totalXp: Scalars['BigInt']['output'];
  username: Scalars['String']['output'];
};

export type PlayerAccount = {
  __typename?: 'PlayerAccount';
  accountType: Scalars['String']['output'];
  combatLevel: Scalars['Int']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastUpdated?: Maybe<Scalars['DateTime']['output']>;
  totalLevel: Scalars['Int']['output'];
  totalXp: Scalars['BigInt']['output'];
  username: Scalars['String']['output'];
};

export type PlayerResponse = {
  __typename?: 'PlayerResponse';
  error?: Maybe<Scalars['String']['output']>;
  player?: Maybe<Player>;
  success: Scalars['Boolean']['output'];
};

export type PlayerSkills = {
  __typename?: 'PlayerSkills';
  overall: SkillData;
  skills: SkillMap;
};

export type Query = {
  __typename?: 'Query';
  dashboard?: Maybe<Dashboard>;
  history?: Maybe<HistoryResponse>;
  milestones?: Maybe<MilestonesResponse>;
  player?: Maybe<Player>;
  players: Array<Player>;
};


export type QueryHistoryArgs = {
  period?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};


export type QueryMilestonesArgs = {
  username: Scalars['String']['input'];
};


export type QueryPlayerArgs = {
  username: Scalars['String']['input'];
};


export type QueryPlayersArgs = {
  claimed?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SkillData = {
  __typename?: 'SkillData';
  level: Scalars['Int']['output'];
  rank: Scalars['Int']['output'];
  xp: Scalars['BigInt']['output'];
};

export type SkillHistory = {
  __typename?: 'SkillHistory';
  dataPoints: Array<HistoryDataPoint>;
  skill: Scalars['String']['output'];
};

export type SkillMap = {
  __typename?: 'SkillMap';
  agility?: Maybe<SkillData>;
  attack?: Maybe<SkillData>;
  construction?: Maybe<SkillData>;
  cooking?: Maybe<SkillData>;
  crafting?: Maybe<SkillData>;
  defence?: Maybe<SkillData>;
  farming?: Maybe<SkillData>;
  firemaking?: Maybe<SkillData>;
  fishing?: Maybe<SkillData>;
  fletching?: Maybe<SkillData>;
  herblore?: Maybe<SkillData>;
  hitpoints?: Maybe<SkillData>;
  hunter?: Maybe<SkillData>;
  magic?: Maybe<SkillData>;
  mining?: Maybe<SkillData>;
  prayer?: Maybe<SkillData>;
  ranged?: Maybe<SkillData>;
  runecraft?: Maybe<SkillData>;
  sailing?: Maybe<SkillData>;
  slayer?: Maybe<SkillData>;
  smithing?: Maybe<SkillData>;
  strength?: Maybe<SkillData>;
  thieving?: Maybe<SkillData>;
  woodcutting?: Maybe<SkillData>;
};

export type SkillSnapshot = {
  __typename?: 'SkillSnapshot';
  level: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  rank: Scalars['Int']['output'];
  xp: Scalars['BigInt']['output'];
};

export type SkillXpMap = {
  __typename?: 'SkillXpMap';
  agility?: Maybe<Scalars['BigInt']['output']>;
  attack?: Maybe<Scalars['BigInt']['output']>;
  construction?: Maybe<Scalars['BigInt']['output']>;
  cooking?: Maybe<Scalars['BigInt']['output']>;
  crafting?: Maybe<Scalars['BigInt']['output']>;
  defence?: Maybe<Scalars['BigInt']['output']>;
  farming?: Maybe<Scalars['BigInt']['output']>;
  firemaking?: Maybe<Scalars['BigInt']['output']>;
  fishing?: Maybe<Scalars['BigInt']['output']>;
  fletching?: Maybe<Scalars['BigInt']['output']>;
  herblore?: Maybe<Scalars['BigInt']['output']>;
  hitpoints?: Maybe<Scalars['BigInt']['output']>;
  hunter?: Maybe<Scalars['BigInt']['output']>;
  magic?: Maybe<Scalars['BigInt']['output']>;
  mining?: Maybe<Scalars['BigInt']['output']>;
  prayer?: Maybe<Scalars['BigInt']['output']>;
  ranged?: Maybe<Scalars['BigInt']['output']>;
  runecraft?: Maybe<Scalars['BigInt']['output']>;
  sailing?: Maybe<Scalars['BigInt']['output']>;
  slayer?: Maybe<Scalars['BigInt']['output']>;
  smithing?: Maybe<Scalars['BigInt']['output']>;
  strength?: Maybe<Scalars['BigInt']['output']>;
  thieving?: Maybe<Scalars['BigInt']['output']>;
  woodcutting?: Maybe<Scalars['BigInt']['output']>;
};

export type Snapshot = {
  __typename?: 'Snapshot';
  bosses: Array<BossSnapshot>;
  combatLevel: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  playerId: Scalars['String']['output'];
  skills: Array<SkillSnapshot>;
  totalLevel: Scalars['Int']['output'];
  totalXp: Scalars['BigInt']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  playerUpdated?: Maybe<Player>;
  snapshotCreated?: Maybe<Snapshot>;
};


export type SubscriptionPlayerUpdatedArgs = {
  username: Scalars['String']['input'];
};


export type SubscriptionSnapshotCreatedArgs = {
  username: Scalars['String']['input'];
};

export type TotalHistoryPoint = {
  __typename?: 'TotalHistoryPoint';
  date: Scalars['DateTime']['output'];
  totalLevel: Scalars['Int']['output'];
  totalXp: Scalars['BigInt']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BossKC: ResolverTypeWrapper<BossKcModel>;
  BossSnapshot: ResolverTypeWrapper<BossSnapshotModel>;
  ClaimPlayerResponse: ResolverTypeWrapper<ClaimPlayerResponse>;
  Dashboard: ResolverTypeWrapper<Dashboard>;
  DashboardTotals: ResolverTypeWrapper<DashboardTotals>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  HistoryDataPoint: ResolverTypeWrapper<HistoryDataPoint>;
  HistoryResponse: ResolverTypeWrapper<HistoryResponse>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Milestone: ResolverTypeWrapper<MilestoneModel>;
  MilestoneStats: ResolverTypeWrapper<MilestoneStats>;
  MilestonesResponse: ResolverTypeWrapper<Omit<MilestonesResponse, 'achieved' | 'inProgress' | 'nearest99s'> & { achieved: Array<ResolversTypes['Milestone']>, inProgress: Array<ResolversTypes['Milestone']>, nearest99s: Array<ResolversTypes['Milestone']> }>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Player: ResolverTypeWrapper<PlayerModel>;
  PlayerAccount: ResolverTypeWrapper<PlayerAccount>;
  PlayerResponse: ResolverTypeWrapper<Omit<PlayerResponse, 'player'> & { player?: Maybe<ResolversTypes['Player']> }>;
  PlayerSkills: ResolverTypeWrapper<PlayerSkills>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  SkillData: ResolverTypeWrapper<SkillData>;
  SkillHistory: ResolverTypeWrapper<SkillHistory>;
  SkillMap: ResolverTypeWrapper<SkillMap>;
  SkillSnapshot: ResolverTypeWrapper<SkillSnapshotModel>;
  SkillXpMap: ResolverTypeWrapper<SkillXpMap>;
  Snapshot: ResolverTypeWrapper<SnapshotModel>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  TotalHistoryPoint: ResolverTypeWrapper<TotalHistoryPoint>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  BigInt: Scalars['BigInt']['output'];
  Boolean: Scalars['Boolean']['output'];
  BossKC: BossKcModel;
  BossSnapshot: BossSnapshotModel;
  ClaimPlayerResponse: ClaimPlayerResponse;
  Dashboard: Dashboard;
  DashboardTotals: DashboardTotals;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  HistoryDataPoint: HistoryDataPoint;
  HistoryResponse: HistoryResponse;
  Int: Scalars['Int']['output'];
  Milestone: MilestoneModel;
  MilestoneStats: MilestoneStats;
  MilestonesResponse: Omit<MilestonesResponse, 'achieved' | 'inProgress' | 'nearest99s'> & { achieved: Array<ResolversParentTypes['Milestone']>, inProgress: Array<ResolversParentTypes['Milestone']>, nearest99s: Array<ResolversParentTypes['Milestone']> };
  Mutation: Record<PropertyKey, never>;
  Player: PlayerModel;
  PlayerAccount: PlayerAccount;
  PlayerResponse: Omit<PlayerResponse, 'player'> & { player?: Maybe<ResolversParentTypes['Player']> };
  PlayerSkills: PlayerSkills;
  Query: Record<PropertyKey, never>;
  SkillData: SkillData;
  SkillHistory: SkillHistory;
  SkillMap: SkillMap;
  SkillSnapshot: SkillSnapshotModel;
  SkillXpMap: SkillXpMap;
  Snapshot: SnapshotModel;
  String: Scalars['String']['output'];
  Subscription: Record<PropertyKey, never>;
  TotalHistoryPoint: TotalHistoryPoint;
}>;

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type BossKcResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BossKC'] = ResolversParentTypes['BossKC']> = ResolversObject<{
  bossName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  killCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type BossSnapshotResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BossSnapshot'] = ResolversParentTypes['BossSnapshot']> = ResolversObject<{
  bossName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  kc?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ClaimPlayerResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClaimPlayerResponse'] = ResolversParentTypes['ClaimPlayerResponse']> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type DashboardResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Dashboard'] = ResolversParentTypes['Dashboard']> = ResolversObject<{
  accounts?: Resolver<Array<ResolversTypes['PlayerAccount']>, ParentType, ContextType>;
  totals?: Resolver<ResolversTypes['DashboardTotals'], ParentType, ContextType>;
}>;

export type DashboardTotalsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DashboardTotals'] = ResolversParentTypes['DashboardTotals']> = ResolversObject<{
  accountCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  skillXp?: Resolver<ResolversTypes['SkillXpMap'], ParentType, ContextType>;
  totalLevels?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalXp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type HistoryDataPointResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['HistoryDataPoint'] = ResolversParentTypes['HistoryDataPoint']> = ResolversObject<{
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  xp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
}>;

export type HistoryResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['HistoryResponse'] = ResolversParentTypes['HistoryResponse']> = ResolversObject<{
  skills?: Resolver<Array<ResolversTypes['SkillHistory']>, ParentType, ContextType>;
  total?: Resolver<Array<ResolversTypes['TotalHistoryPoint']>, ParentType, ContextType>;
}>;

export type MilestoneResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Milestone'] = ResolversParentTypes['Milestone']> = ResolversObject<{
  achievedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  boss?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  currentKc?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  currentLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  currentXp?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lowestSkill?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lowestSkillLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  skill?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  skillsAt99?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  targetKc?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  targetLevel?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  targetXp?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  totalSkills?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MilestoneStatsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MilestoneStats'] = ResolversParentTypes['MilestoneStats']> = ResolversObject<{
  achieved?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  completionPercentage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  inProgress?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalMilestones?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type MilestonesResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['MilestonesResponse'] = ResolversParentTypes['MilestonesResponse']> = ResolversObject<{
  achieved?: Resolver<Array<ResolversTypes['Milestone']>, ParentType, ContextType>;
  inProgress?: Resolver<Array<ResolversTypes['Milestone']>, ParentType, ContextType>;
  nearest99s?: Resolver<Array<ResolversTypes['Milestone']>, ParentType, ContextType>;
  stats?: Resolver<ResolversTypes['MilestoneStats'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  claimPlayer?: Resolver<Maybe<ResolversTypes['ClaimPlayerResponse']>, ParentType, ContextType, RequireFields<MutationClaimPlayerArgs, 'token' | 'username'>>;
  refreshPlayer?: Resolver<Maybe<ResolversTypes['PlayerResponse']>, ParentType, ContextType, RequireFields<MutationRefreshPlayerArgs, 'username'>>;
  updatePlayerDisplayName?: Resolver<Maybe<ResolversTypes['PlayerResponse']>, ParentType, ContextType, RequireFields<MutationUpdatePlayerDisplayNameArgs, 'displayName' | 'username'>>;
}>;

export type PlayerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = ResolversObject<{
  accountType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bosses?: Resolver<Array<ResolversTypes['BossKC']>, ParentType, ContextType>;
  claimedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  claimedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  combatLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastUpdated?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  skills?: Resolver<ResolversTypes['PlayerSkills'], ParentType, ContextType>;
  totalLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalXp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type PlayerAccountResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PlayerAccount'] = ResolversParentTypes['PlayerAccount']> = ResolversObject<{
  accountType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  combatLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastUpdated?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  totalLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalXp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type PlayerResponseResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PlayerResponse'] = ResolversParentTypes['PlayerResponse']> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  player?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type PlayerSkillsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PlayerSkills'] = ResolversParentTypes['PlayerSkills']> = ResolversObject<{
  overall?: Resolver<ResolversTypes['SkillData'], ParentType, ContextType>;
  skills?: Resolver<ResolversTypes['SkillMap'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  dashboard?: Resolver<Maybe<ResolversTypes['Dashboard']>, ParentType, ContextType>;
  history?: Resolver<Maybe<ResolversTypes['HistoryResponse']>, ParentType, ContextType, RequireFields<QueryHistoryArgs, 'username'>>;
  milestones?: Resolver<Maybe<ResolversTypes['MilestonesResponse']>, ParentType, ContextType, RequireFields<QueryMilestonesArgs, 'username'>>;
  player?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType, RequireFields<QueryPlayerArgs, 'username'>>;
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType, Partial<QueryPlayersArgs>>;
}>;

export type SkillDataResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkillData'] = ResolversParentTypes['SkillData']> = ResolversObject<{
  level?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  xp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
}>;

export type SkillHistoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkillHistory'] = ResolversParentTypes['SkillHistory']> = ResolversObject<{
  dataPoints?: Resolver<Array<ResolversTypes['HistoryDataPoint']>, ParentType, ContextType>;
  skill?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type SkillMapResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkillMap'] = ResolversParentTypes['SkillMap']> = ResolversObject<{
  agility?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  attack?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  construction?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  cooking?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  crafting?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  defence?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  farming?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  firemaking?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  fishing?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  fletching?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  herblore?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  hitpoints?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  hunter?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  magic?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  mining?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  prayer?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  ranged?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  runecraft?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  sailing?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  slayer?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  smithing?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  strength?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  thieving?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
  woodcutting?: Resolver<Maybe<ResolversTypes['SkillData']>, ParentType, ContextType>;
}>;

export type SkillSnapshotResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkillSnapshot'] = ResolversParentTypes['SkillSnapshot']> = ResolversObject<{
  level?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rank?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  xp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
}>;

export type SkillXpMapResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['SkillXpMap'] = ResolversParentTypes['SkillXpMap']> = ResolversObject<{
  agility?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  attack?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  construction?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  cooking?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  crafting?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  defence?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  farming?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  firemaking?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  fishing?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  fletching?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  herblore?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  hitpoints?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  hunter?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  magic?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  mining?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  prayer?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  ranged?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  runecraft?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  sailing?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  slayer?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  smithing?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  strength?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  thieving?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  woodcutting?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
}>;

export type SnapshotResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Snapshot'] = ResolversParentTypes['Snapshot']> = ResolversObject<{
  bosses?: Resolver<Array<ResolversTypes['BossSnapshot']>, ParentType, ContextType>;
  combatLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  playerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  skills?: Resolver<Array<ResolversTypes['SkillSnapshot']>, ParentType, ContextType>;
  totalLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalXp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  playerUpdated?: SubscriptionResolver<Maybe<ResolversTypes['Player']>, "playerUpdated", ParentType, ContextType, RequireFields<SubscriptionPlayerUpdatedArgs, 'username'>>;
  snapshotCreated?: SubscriptionResolver<Maybe<ResolversTypes['Snapshot']>, "snapshotCreated", ParentType, ContextType, RequireFields<SubscriptionSnapshotCreatedArgs, 'username'>>;
}>;

export type TotalHistoryPointResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TotalHistoryPoint'] = ResolversParentTypes['TotalHistoryPoint']> = ResolversObject<{
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  totalLevel?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalXp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  BigInt?: GraphQLScalarType;
  BossKC?: BossKcResolvers<ContextType>;
  BossSnapshot?: BossSnapshotResolvers<ContextType>;
  ClaimPlayerResponse?: ClaimPlayerResponseResolvers<ContextType>;
  Dashboard?: DashboardResolvers<ContextType>;
  DashboardTotals?: DashboardTotalsResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  HistoryDataPoint?: HistoryDataPointResolvers<ContextType>;
  HistoryResponse?: HistoryResponseResolvers<ContextType>;
  Milestone?: MilestoneResolvers<ContextType>;
  MilestoneStats?: MilestoneStatsResolvers<ContextType>;
  MilestonesResponse?: MilestonesResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  PlayerAccount?: PlayerAccountResolvers<ContextType>;
  PlayerResponse?: PlayerResponseResolvers<ContextType>;
  PlayerSkills?: PlayerSkillsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SkillData?: SkillDataResolvers<ContextType>;
  SkillHistory?: SkillHistoryResolvers<ContextType>;
  SkillMap?: SkillMapResolvers<ContextType>;
  SkillSnapshot?: SkillSnapshotResolvers<ContextType>;
  SkillXpMap?: SkillXpMapResolvers<ContextType>;
  Snapshot?: SnapshotResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TotalHistoryPoint?: TotalHistoryPointResolvers<ContextType>;
}>;

