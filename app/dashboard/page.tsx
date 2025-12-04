import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { Swords, TrendingUp, Users, Zap } from 'lucide-react';

export const metadata = {
  title: 'Dashboard - OSRS Tracker',
  description: 'View all your claimed OSRS accounts and track your progress.',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-100 mb-2">Dashboard</h1>
        <p className="text-stone-400">
          Track your progress across all your claimed accounts
        </p>
      </div>

      <DashboardContent />
    </div>
  );
}

