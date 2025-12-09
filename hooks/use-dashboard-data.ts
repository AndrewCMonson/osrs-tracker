'use client';

import { useState, useEffect } from 'react';
import { AccountType } from '@/types/player';

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

interface DashboardData {
  accounts: Account[];
  totals: {
    totalXp: number;
    totalLevels: number;
    accountCount: number;
    skillXp: Record<string, number>;
  };
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const result = await response.json();
        if (result.success) {
          // Type assertion needed because API returns accountType as string
          setData(result as DashboardData);
        } else {
          setError(result.error || 'Failed to load dashboard');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

