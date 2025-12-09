'use client';

import { Card, CardContent } from '@/components/ui/card';
import { formatXp, formatXpShort } from '@/types/skills';
import { TrendingUp, Shield, Users, Swords } from 'lucide-react';

interface DashboardStatsProps {
  totals: {
    totalXp: number;
    totalLevels: number;
    accountCount: number;
  };
  avgCombat: number;
}

export function DashboardStats({ totals, avgCombat }: DashboardStatsProps) {
  return (
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
                {formatXpShort(totals.totalXp)}
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            {formatXp(totals.totalXp)} XP across all accounts
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
                {totals.totalLevels.toLocaleString()}
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
                {totals.accountCount}
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
                {avgCombat}
              </p>
            </div>
          </div>
          <p className="text-xs text-stone-500 mt-2">
            Average combat level
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

