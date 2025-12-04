'use client';

import { getBossIcon } from '@/lib/images';
import { cn } from '@/lib/utils';
import {
	BOSS_DISPLAY_NAMES,
	BossData,
	BossName,
	KC_THRESHOLDS,
	formatKc,
} from '@/types/bosses';
import { Check, Circle, Trophy, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface BossModalProps {
	boss: BossName;
	data: BossData;
	isOpen: boolean;
	onClose: () => void;
}

export function BossModal({ boss, data, isOpen, onClose }: BossModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const displayName = BOSS_DISPLAY_NAMES[boss];

	// Close on escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	// Close on click outside
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	if (!isOpen) return null;

	const achievedCount = KC_THRESHOLDS.filter(t => data.killCount >= t).length;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
			onClick={handleBackdropClick}
		>
			<div
				ref={modalRef}
				className="relative w-full max-w-md bg-stone-900 border border-stone-700 rounded-xl shadow-2xl slide-in-from-bottom-2"
				role="dialog"
				aria-modal="true"
				aria-labelledby="boss-modal-title"
			>
				{/* Header */}
				<div className="flex items-center gap-4 p-5 border-b border-stone-800">
					<div className="w-14 h-14 flex-shrink-0 rounded-lg bg-stone-800 flex items-center justify-center overflow-hidden">
						<Image
							src={getBossIcon(boss)}
							alt={displayName}
							width={56}
							height={56}
							className="object-contain w-full h-full"
							unoptimized
						/>
					</div>
					<div className="flex-1 min-w-0">
						<h2
							id="boss-modal-title"
							className="text-lg font-bold text-stone-100 truncate"
						>
							{displayName}
						</h2>
						<div className="flex items-center gap-3 mt-1">
							<span className="text-2xl font-bold text-amber-500">
								{formatKc(data.killCount)} KC
							</span>
							{data.rank > 0 && (
								<span className="text-sm text-stone-500">
									Rank #{data.rank.toLocaleString()}
								</span>
							)}
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
						aria-label="Close modal"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Milestones */}
				<div className="p-5">
					<div className="flex items-center gap-2 mb-4">
						<Trophy className="h-5 w-5 text-amber-500" />
						<h3 className="text-sm font-semibold text-stone-300">
							Kill Count Milestones
						</h3>
						<span className="text-xs text-stone-500 ml-auto">
							{achievedCount} / {KC_THRESHOLDS.length}
						</span>
					</div>

					<div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
						{KC_THRESHOLDS.map(threshold => {
							const isAchieved = data.killCount >= threshold;
							const isNext =
								!isAchieved &&
								KC_THRESHOLDS.filter(t => data.killCount >= t).length ===
									KC_THRESHOLDS.indexOf(threshold);

							return (
								<div
									key={threshold}
									className={cn(
										'relative flex flex-col items-center justify-center p-3 rounded-lg border transition-all',
										isAchieved
											? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
											: isNext
											? 'bg-stone-800/50 border-stone-600 text-stone-300 ring-2 ring-amber-500/30'
											: 'bg-stone-800/30 border-stone-700/50 text-stone-500'
									)}
								>
									<div className="absolute -top-1.5 -right-1.5">
										{isAchieved ? (
											<div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
												<Check
													className="h-3 w-3 text-stone-900"
													strokeWidth={3}
												/>
											</div>
										) : (
											<div className="w-5 h-5 rounded-full bg-stone-700 flex items-center justify-center">
												<Circle
													className="h-3 w-3 text-stone-500"
													strokeWidth={2}
												/>
											</div>
										)}
									</div>
									<span
										className={cn(
											'text-sm font-bold',
											isAchieved
												? 'text-amber-500'
												: isNext
												? 'text-stone-200'
												: 'text-stone-500'
										)}
									>
										{threshold >= 1000 ? `${threshold / 1000}K` : threshold}
									</span>
									<span className="text-[10px] text-stone-500 mt-0.5">
										{isAchieved ? 'Achieved' : isNext ? 'Next' : 'Locked'}
									</span>
								</div>
							);
						})}
					</div>

					{/* Progress to next milestone */}
					{data.killCount < KC_THRESHOLDS[KC_THRESHOLDS.length - 1] && (
						<div className="mt-5 pt-4 border-t border-stone-800">
							{(() => {
								const nextMilestone = KC_THRESHOLDS.find(
									t => data.killCount < t
								);
								if (!nextMilestone) return null;
								const prevMilestone =
									KC_THRESHOLDS[KC_THRESHOLDS.indexOf(nextMilestone) - 1] || 0;
								const progress =
									((data.killCount - prevMilestone) /
										(nextMilestone - prevMilestone)) *
									100;
								const remaining = nextMilestone - data.killCount;

								return (
									<>
										<div className="flex justify-between text-xs text-stone-400 mb-2">
											<span>
												Progress to {nextMilestone.toLocaleString()} KC
											</span>
											<span>{Math.floor(progress)}%</span>
										</div>
										<div className="h-2 bg-stone-800 rounded-full overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all"
												style={{ width: `${progress}%` }}
											/>
										</div>
										<p className="text-xs text-stone-500 mt-2 text-center">
											{remaining.toLocaleString()} kills remaining
										</p>
									</>
								);
							})()}
						</div>
					)}

					{/* Max milestone reached */}
					{data.killCount >= KC_THRESHOLDS[KC_THRESHOLDS.length - 1] && (
						<div className="mt-5 pt-4 border-t border-stone-800 text-center">
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full">
								<Trophy className="h-4 w-4 text-amber-500" />
								<span className="text-sm font-medium text-amber-500">
									All milestones achieved!
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
