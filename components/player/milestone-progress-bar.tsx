'use client';

import { Milestone } from '@/types/milestones';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface MilestoneProgressBarProps {
  milestones: Milestone[];
  currentValue: number;
  maxValue: number;
  getMilestoneValue: (milestone: Milestone) => number;
  formatValue: (value: number) => string;
}

export function MilestoneProgressBar({
  milestones,
  currentValue,
  maxValue,
  getMilestoneValue,
  formatValue,
}: MilestoneProgressBarProps) {
  const sortedMilestones = [...milestones].sort((a, b) => getMilestoneValue(a) - getMilestoneValue(b));
  const nextMilestone = sortedMilestones.find((m) => m.status === 'in_progress');
  const progress = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;

  return (
    <div className="relative">
      {/* Progress bar background */}
      <div className="h-2 bg-stone-700/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Milestone markers */}
      <div className="relative -mt-2 h-2">
        {sortedMilestones.map((milestone) => {
          const milestoneValue = getMilestoneValue(milestone);
          const position = (milestoneValue / maxValue) * 100;
          const isAchieved = milestone.status === 'achieved';
          const isNext = milestone.id === nextMilestone?.id;

          return (
            <div
              key={milestone.id}
              className="absolute transform -translate-x-1/2"
              style={{ left: `${Math.min(position, 100)}%` }}
            >
              <div
                className={cn(
                  'w-3 h-3 rounded-full border transition-all',
                  isAchieved
                    ? 'bg-emerald-500 border-emerald-400'
                    : isNext
                    ? 'bg-amber-500 border-amber-400 ring-1 ring-amber-500/50'
                    : 'bg-stone-700 border-stone-600'
                )}
              >
                {isAchieved && (
                  <CheckCircle2 className="h-1.5 w-1.5 text-stone-900 absolute inset-0.5" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

