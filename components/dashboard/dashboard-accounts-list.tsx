'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatXpShort } from '@/types/skills';
import { ACCOUNT_TYPE_DISPLAY, AccountType } from '@/types/player';
import { getAccountTypeIcon } from '@/lib/images';
import { formatRelativeTime } from '@/lib/utils';
import { Shield, TrendingUp, Swords } from 'lucide-react';

interface Account {
  id: string;
  username: string;
  displayName: string;
  accountType: AccountType;
  totalLevel: number;
  totalXp: number;
  combatLevel: number;
  lastUpdated: string;
}

interface DashboardAccountsListProps {
  accounts: Account[];
}

export function DashboardAccountsList({ accounts }: DashboardAccountsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => {
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
  );
}

