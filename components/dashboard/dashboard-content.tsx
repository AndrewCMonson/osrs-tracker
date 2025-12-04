'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatXp, formatXpShort, SKILLS, SkillName } from '@/types/skills';
import { ACCOUNT_TYPE_DISPLAY, AccountType } from '@/types/player';
import { getAccountTypeIcon } from '@/lib/images';
import { formatRelativeTime } from '@/lib/utils';
import { Swords, TrendingUp, Users, Zap, Shield } from 'lucide-react';
import { getSkillIcon } from '@/lib/images';

interface Account {
  id: string;
  username: string;
  displayName: string;
  accountType: AccountType;
  totalLevel: number;
  totalXp: number;
  combatLevel: number;
  lastUpdated: string; // ISO string from API
}

interface DashboardData {
  accounts: Account[];
  totals: {
    totalXp: number;
    totalLevels: number;
    accountCount: number;
    skillXp: Record<string, number>;
  };
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const result = await response.json();
        if (result.success) {
          setData(result);
        } else {
          setError(result.error || 'Failed to load dashboard');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.accounts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Users className="h-12 w-12 text-stone-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-stone-200 mb-2">
            No Claimed Accounts
          </h3>
          <p className="text-stone-400 mb-4">
            You haven&apos;t claimed any OSRS accounts yet.
          </p>
          <Link
            href="/player"
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            Browse players to claim your account →
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Sort skills by total XP (descending)
  const sortedSkills = SKILLS.map(skill => ({
    name: skill,
    xp: data.totals.skillXp[skill] || 0,
  })).sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-600/10">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-stone-400">Total XP</p>
                <p className="text-2xl font-bold text-stone-100">
                  {formatXpShort(data.totals.totalXp)}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              {formatXp(data.totals.totalXp)} XP across all accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-600/10">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-stone-400">Total Levels</p>
                <p className="text-2xl font-bold text-stone-100">
                  {data.totals.totalLevels.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Combined level across all accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-600/10">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-stone-400">Accounts</p>
                <p className="text-2xl font-bold text-stone-100">
                  {data.totals.accountCount}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Claimed accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-600/10">
                <Swords className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-stone-400">Avg Combat</p>
                <p className="text-2xl font-bold text-stone-100">
                  {Math.round(
                    data.accounts.reduce((sum, acc) => sum + acc.combatLevel, 0) /
                    data.accounts.length
                  )}
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Average combat level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.accounts.map((account) => {
              const accountIcon = getAccountTypeIcon(account.accountType);
              return (
                <Link
                  key={account.id}
                  href={`/player/${encodeURIComponent(account.username)}`}
                  className="block p-4 rounded-lg bg-stone-900/50 border border-stone-800 hover:border-amber-600/30 hover:bg-stone-900 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">
                          {account.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-stone-100">
                            {account.displayName}
                          </h3>
                          {accountIcon && (
                            <Image
                              src={accountIcon}
                              alt={ACCOUNT_TYPE_DISPLAY[account.accountType]}
                              width={16}
                              height={16}
                              className="inline-block"
                              unoptimized
                            />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {ACCOUNT_TYPE_DISPLAY[account.accountType]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-stone-400">
                          <span className="flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            Level {account.totalLevel.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {formatXpShort(account.totalXp)} XP
                          </span>
                          <span className="flex items-center gap-1">
                            <Swords className="h-4 w-4" />
                            Combat {account.combatLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-stone-500">
                        Updated {formatRelativeTime(new Date(account.lastUpdated))}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Skill XP Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Total XP by Skill</CardTitle>
          <p className="text-sm text-stone-400 mt-1">
            Combined XP across all your accounts
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {sortedSkills.map(({ name, xp }) => {
              const skillIcon = getSkillIcon(name);
              return (
                <div
                  key={name}
                  className="p-3 rounded-lg bg-stone-900/50 border border-stone-800 hover:border-amber-600/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Image
                      src={skillIcon}
                      alt={name}
                      width={20}
                      height={20}
                      unoptimized
                    />
                    <span className="text-xs font-medium text-stone-300 capitalize">
                      {name}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-amber-500">
                    {formatXpShort(xp)}
                  </p>
                  <p className="text-xs text-stone-500">
                    {formatXp(xp)} XP
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

