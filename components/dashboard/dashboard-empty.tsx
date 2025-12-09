'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function DashboardEmpty() {
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

