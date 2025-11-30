'use client';

import { Progress } from '@/components/ui/progress';
import { getBossIcon } from '@/lib/images';
import {
	BOSS_DISPLAY_NAMES,
	BossData,
	BossName,
	formatKc,
	getAchievedKcMilestones,
	PlayerBosses,
} from '@/types/bosses';
import { Skull, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { BossModal } from './boss-modal';

interface BossListProps {
	bosses: Partial<PlayerBosses>;
	showEmpty?: boolean;
}

export function BossList({ bosses, showEmpty = false }: BossListProps) {
	const [selectedBoss, setSelectedBoss] = useState<{
		name: BossName;
		data: BossData;
	} | null>(null);

	// Get bosses with KC, sorted by KC
	const bossEntries = Object.entries(bosses)
		.filter(([_, data]) => data && data.killCount > 0)
		.sort((a, b) => (b[1]?.killCount ?? 0) - (a[1]?.killCount ?? 0));

	if (bossEntries.length === 0) {
		return (
			<div className="text-center py-12">
				<Skull className="h-12 w-12 mx-auto text-stone-600 mb-4" />
				<p className="text-stone-500">No boss kills recorded yet.</p>
				<p className="text-sm text-stone-600 mt-1">
					Kill counts are only tracked after appearing on the hiscores.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{bossEntries.map(([bossName, data]) => {
					if (!data) return null;
					const boss = bossName as BossName;
					const displayName = BOSS_DISPLAY_NAMES[boss];
					const milestones = getAchievedKcMilestones(data.killCount);
					const nextMilestone = [
						10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000,
					].find(m => data.killCount < m);
					const progress = nextMilestone
						? (data.killCount / nextMilestone) * 100
						: 100;

					return (
						<button
							key={bossName}
							onClick={() => setSelectedBoss({ name: boss, data })}
							className="p-4 rounded-lg bg-stone-800/50 hover:bg-stone-800 transition-colors text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
						>
							<div className="flex items-start gap-3 mb-2">
								<div className="w-10 h-10 flex-shrink-0 rounded bg-stone-900/50 flex items-center justify-center overflow-hidden">
									<Image
										src={getBossIcon(boss)}
										alt={displayName}
										width={40}
										height={40}
										className="object-contain w-full h-full"
										unoptimized
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="text-sm font-medium text-stone-200 truncate">
										{displayName}
									</h3>
									<p className="text-2xl font-bold text-amber-500">
										{formatKc(data.killCount)}
									</p>
								</div>
								{milestones.length > 0 && (
									<div className="flex items-center gap-1 flex-shrink-0">
										<Trophy className="h-4 w-4 text-amber-500" />
										<span className="text-xs text-stone-400">
											{milestones.length}
										</span>
									</div>
								)}
							</div>
							{nextMilestone && (
								<div className="space-y-1">
									<div className="flex justify-between text-xs text-stone-500">
										<span>Next: {nextMilestone.toLocaleString()} KC</span>
										<span>{Math.floor(progress)}%</span>
									</div>
									<Progress value={progress} size="sm" />
								</div>
							)}
							{data.rank > 0 && (
								<p className="text-xs text-stone-600 mt-2">
									Rank: #{data.rank.toLocaleString()}
								</p>
							)}
						</button>
					);
				})}
			</div>

			{/* Boss Details Modal */}
			{selectedBoss && (
				<BossModal
					boss={selectedBoss.name}
					data={selectedBoss.data}
					isOpen={!!selectedBoss}
					onClose={() => setSelectedBoss(null)}
				/>
			)}
		</>
	);
}
