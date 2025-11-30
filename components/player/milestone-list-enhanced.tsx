'use client';

import { useState, useMemo } from 'react';
import { Milestone, MilestoneCategory, getMilestoneCategory, CATEGORY_DISPLAY_NAMES } from '@/types/milestones';
import { MilestoneCard } from './milestone-card';
import { GroupedMilestone, groupMilestones, MilestoneGroup } from './grouped-milestone';
import { Trophy, Filter, Grid3x3, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface MilestoneListEnhancedProps {
  milestones: Milestone[];
  title?: string;
  emptyMessage?: string;
  compact?: boolean;
  limit?: number;
  achievementDates?: Map<string, Date | null>;
  showCategoryFilter?: boolean;
  useGroupedView?: boolean;
}

export function MilestoneListEnhanced({
  milestones,
  title,
  emptyMessage = 'No milestones to display.',
  compact = false,
  limit,
  achievementDates,
  showCategoryFilter = true,
  useGroupedView = true,
}: MilestoneListEnhancedProps) {
  const [selectedCategory, setSelectedCategory] = useState<MilestoneCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');

  // Get all available categories
  const availableCategories = useMemo(() => {
    const categories = new Set<MilestoneCategory>();
    milestones.forEach((m) => {
      categories.add(getMilestoneCategory(m));
    });
    return Array.from(categories).sort();
  }, [milestones]);

  // Filter milestones by category
  const filteredMilestones = useMemo(() => {
    let filtered = milestones;

    if (selectedCategory !== 'all') {
      filtered = milestones.filter((m) => getMilestoneCategory(m) === selectedCategory);
    }

    // Sort: achieved first (by date if available), then in progress (by progress desc), then locked
    filtered = [...filtered].sort((a, b) => {
      if (a.status === 'achieved' && b.status !== 'achieved') return -1;
      if (a.status !== 'achieved' && b.status === 'achieved') return 1;
      
      if (a.status === 'achieved' && b.status === 'achieved') {
        const aDate = achievementDates?.get(a.id);
        const bDate = achievementDates?.get(b.id);
        if (aDate && bDate) {
          return bDate.getTime() - aDate.getTime(); // Most recent first
        }
        if (aDate) return -1;
        if (bDate) return 1;
        return 0;
      }

      if (a.status === 'in_progress' && b.status === 'in_progress') {
        return b.progress - a.progress; // Higher progress first
      }

      return 0;
    });

    return limit ? filtered.slice(0, limit) : filtered;
  }, [milestones, selectedCategory, achievementDates, limit]);

  // Group milestones for grouped view
  const groupedMilestones = useMemo(() => {
    if (!useGroupedView || viewMode !== 'grouped') return [];
    return groupMilestones(filteredMilestones);
  }, [filteredMilestones, useGroupedView, viewMode]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: milestones.length };
    milestones.forEach((m) => {
      const category = getMilestoneCategory(m);
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [milestones]);

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-stone-100 mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          {title}
        </h3>
      )}

      {/* Controls */}
      <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
        {/* Category Filter */}
        {showCategoryFilter && availableCategories.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-stone-500" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-colors border',
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-stone-900 border-amber-500 font-medium'
                  : 'bg-stone-800 text-stone-400 border-stone-700 hover:bg-stone-700 hover:text-stone-300'
              )}
            >
              All
              <Badge variant="secondary" className="ml-2 text-xs">
                {categoryCounts.all}
              </Badge>
            </button>
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-lg transition-colors border',
                  selectedCategory === category
                    ? 'bg-amber-600 text-stone-900 border-amber-500 font-medium'
                    : 'bg-stone-800 text-stone-400 border-stone-700 hover:bg-stone-700 hover:text-stone-300'
                )}
              >
                {CATEGORY_DISPLAY_NAMES[category]}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {categoryCounts[category]}
                </Badge>
              </button>
            ))}
          </div>
        )}

        {/* View Mode Toggle */}
        {useGroupedView && (
          <div className="flex items-center gap-1 bg-stone-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grouped')}
              className={cn(
                'px-2 py-1 rounded text-xs transition-colors',
                viewMode === 'grouped'
                  ? 'bg-amber-600 text-stone-900'
                  : 'text-stone-400 hover:text-stone-200'
              )}
              title="Grouped View"
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-2 py-1 rounded text-xs transition-colors',
                viewMode === 'list'
                  ? 'bg-amber-600 text-stone-900'
                  : 'text-stone-400 hover:text-stone-200'
              )}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Milestones Display */}
      {useGroupedView && viewMode === 'grouped' ? (
        // Grouped View
        groupedMilestones.length === 0 ? (
          <p className="text-stone-500 text-center py-8">{emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedMilestones.map((group) => (
              <GroupedMilestone
                key={group.id}
                group={group}
                achievementDates={achievementDates}
              />
            ))}
          </div>
        )
      ) : (
        // List View
        filteredMilestones.length === 0 ? (
          <p className="text-stone-500 text-center py-8">{emptyMessage}</p>
        ) : (
          <div className={cn('space-y-2', compact ? '' : 'grid grid-cols-1 md:grid-cols-2 gap-3')}>
            {filteredMilestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                compact={compact}
                achievedAt={achievementDates?.get(milestone.id) || undefined}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

