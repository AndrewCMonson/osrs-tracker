'use client';

import { Milestone } from '@/types/milestones';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Lock, CheckCircle2, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

interface MilestoneCardProps {
  milestone: Milestone;
  compact?: boolean;
  achievedAt?: Date | null;
}

export function MilestoneCard({ milestone, compact = false, achievedAt }: MilestoneCardProps) {
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

  const formatAchievementDate = (date: Date | null | undefined): string => {
    if (!date) return 'Unknown';
    return formatRelativeTime(date);
  };

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg transition-colors border',
          isAchieved 
            ? 'bg-emerald-900/20 border-emerald-700/30' 
            : isInProgress
            ? 'bg-amber-900/10 border-amber-700/20'
            : 'bg-stone-800/50 border-stone-700/50 hover:bg-stone-800'
        )}
      >
        <StatusIcon className={cn('h-5 w-5 flex-shrink-0', statusColors[milestone.status])} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-200 truncate">
            {milestone.name}
          </p>
          {!isAchieved && (
            <div className="mt-1.5">
              <Progress value={milestone.progress} size="sm" />
            </div>
          )}
          {isAchieved && achievedAt && (
            <div className="flex items-center gap-1 mt-1 text-xs text-stone-500">
              <Calendar className="h-3 w-3" />
              <span>{formatAchievementDate(achievedAt)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {isAchieved ? (
            <span className="text-xs font-medium text-emerald-400">✓</span>
          ) : (
            <span className="text-xs text-stone-500">{milestone.progress.toFixed(0)}%</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all relative overflow-hidden',
        isAchieved
          ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 border-emerald-700/40 shadow-lg shadow-emerald-900/10'
          : isInProgress
          ? 'bg-gradient-to-br from-amber-900/20 to-amber-800/5 border-amber-700/30 hover:border-amber-600/40'
          : 'bg-stone-800/50 border-stone-700/50 hover:bg-stone-800 hover:border-stone-600'
      )}
    >
      {/* Progress indicator bar */}
      {isInProgress && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-stone-700/50">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <StatusIcon className={cn('h-5 w-5 flex-shrink-0', statusColors[milestone.status])} />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-stone-200 truncate">
              {milestone.name}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">{milestone.description}</p>
          </div>
        </div>
        <Badge
          variant={
            isAchieved ? 'success' : isInProgress ? 'default' : 'secondary'
          }
          className="ml-2 flex-shrink-0"
        >
          {isAchieved
            ? 'Achieved'
            : isInProgress
            ? 'In Progress'
            : 'Locked'}
        </Badge>
      </div>

      {/* Achievement date */}
      {isAchieved && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-700/50">
          <Calendar className="h-4 w-4 text-stone-500" />
          <span className="text-xs text-stone-400">
            Achieved {formatAchievementDate(achievedAt)}
          </span>
        </div>
      )}

      {/* Progress visualization */}
      {!isAchieved && (
        <div className="space-y-2 mt-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-stone-500">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Progress</span>
            </div>
            <span className="font-medium text-stone-300">{milestone.progress.toFixed(1)}%</span>
          </div>
          <div className="relative h-2 bg-stone-700/50 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isInProgress
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : 'bg-stone-600'
              )}
              style={{ width: `${milestone.progress}%` }}
            />
          </div>
          {isInProgress && (
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <div className="flex-1 h-px bg-stone-700/50" />
              <span>Keep going!</span>
              <div className="flex-1 h-px bg-stone-700/50" />
            </div>
          )}
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
  achievementDates?: Map<string, Date | null>;
}

export function MilestoneList({
  milestones,
  title,
  emptyMessage = 'No milestones to display.',
  compact = false,
  limit,
  achievementDates,
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
              achievedAt={achievementDates?.get(milestone.id) || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}


