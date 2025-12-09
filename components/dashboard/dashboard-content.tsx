'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { DashboardAccountsList } from './dashboard-accounts-list';
import { DashboardEmpty } from './dashboard-empty';
import { DashboardError } from './dashboard-error';
import { DashboardSkeleton } from './dashboard-skeleton';
import { DashboardSkillBreakdown } from './dashboard-skill-breakdown';
import { DashboardStats } from './dashboard-stats';

export function DashboardContent() {
	const { data, loading, error } = useDashboardData();

	if (loading) {
		return <DashboardSkeleton />;
	}

	if (error) {
		return <DashboardError error={error} />;
	}

	if (!data || data.accounts.length === 0) {
		return <DashboardEmpty />;
	}

	const avgCombat = Math.round(
		data.accounts.reduce((sum, acc) => sum + acc.combatLevel, 0) /
			data.accounts.length
	);

	return (
		<div className="space-y-6">
			<DashboardStats totals={data.totals} avgCombat={avgCombat} />
			<DashboardAccountsList accounts={data.accounts} />
			<DashboardSkillBreakdown skillXp={data.totals.skillXp} />
		</div>
	);
}
