'use client';

import { Milestone } from '@/types/milestones';
import { GroupedMilestone, groupMilestones } from './grouped-milestone';

interface GroupedMilestonesListProps {
  milestones: Milestone[];
  achievementDates?: Map<string, Date | null>;
  emptyMessage?: string;
}

export function GroupedMilestonesList({
  milestones,
  achievementDates,
  emptyMessage = 'No milestones to display.',
}: GroupedMilestonesListProps) {
  const grouped = groupMilestones(milestones);

  if (grouped.length === 0) {
    return <p className="text-stone-500 text-center py-4">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {grouped.map((group) => (
        <GroupedMilestone
          key={group.id}
          group={group}
          achievementDates={achievementDates}
        />
      ))}
    </div>
  );
}








