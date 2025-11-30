'use client';

import { Milestone } from '@/types/milestones';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MilestoneCardProps {
  milestone: Milestone;
  compact?: boolean;
}

export function MilestoneCard({ milestone, compact = false }: MilestoneCardProps) {
  const isAchieved = milestone.status === 'achieved';
  const isInProgress = milestone.status === 'in_progress';

  const StatusIcon = isAchieved
    ? CheckCircle2
    : isInProgress
    ? Target
    : Lock;

  const statusColors = {
    achieved: 'text-emerald-400',
    in_progress: 'text-amber-400',
    locked: 'text-stone-600',
  };

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg transition-colors',
          isAchieved ? 'bg-emerald-900/20' : 'bg-stone-800/50 hover:bg-stone-800'
        )}
      >
        <StatusIcon className={cn('h-5 w-5', statusColors[milestone.status])} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-200 truncate">
            {milestone.name}
          </p>
          {!isAchieved && (
            <Progress value={milestone.progress} size="sm" className="mt-1" />
          )}
        </div>
        <span className="text-xs text-stone-500">
          {isAchieved ? '✓' : `${milestone.progress.toFixed(0)}%`}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-colors',
        isAchieved
          ? 'bg-emerald-900/20 border-emerald-700/30'
          : 'bg-stone-800/50 border-stone-700/50 hover:bg-stone-800'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <StatusIcon className={cn('h-5 w-5', statusColors[milestone.status])} />
          <h3 className="text-sm font-semibold text-stone-200">
            {milestone.name}
          </h3>
        </div>
        <Badge
          variant={
            isAchieved ? 'success' : isInProgress ? 'default' : 'secondary'
          }
        >
          {isAchieved
            ? 'Achieved'
            : isInProgress
            ? 'In Progress'
            : 'Locked'}
        </Badge>
      </div>
      <p className="text-sm text-stone-400 mb-3">{milestone.description}</p>
      {!isAchieved && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-stone-500">
            <span>Progress</span>
            <span>{milestone.progress.toFixed(1)}%</span>
          </div>
          <Progress value={milestone.progress} size="md" />
        </div>
      )}
    </div>
  );
}

interface MilestoneListProps {
  milestones: Milestone[];
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
  limit?: number;
}

export function MilestoneList({
  milestones,
  title,
  emptyMessage = 'No milestones to display.',
  compact = false,
  limit,
}: MilestoneListProps) {
  const displayMilestones = limit ? milestones.slice(0, limit) : milestones;

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-stone-100 mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          {title}
        </h3>
      )}
      {displayMilestones.length === 0 ? (
        <p className="text-stone-500 text-center py-8">{emptyMessage}</p>
      ) : (
        <div className={cn('space-y-2', compact ? '' : 'grid grid-cols-1 md:grid-cols-2 gap-3')}>
          {displayMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              compact={compact}
            />
          ))}
        </div>
      )}
    </div>
  );
}


