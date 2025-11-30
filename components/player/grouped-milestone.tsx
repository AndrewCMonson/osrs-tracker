'use client';

import { useState } from 'react';
import { Milestone, Skill99Milestone, BossKcMilestone, BaseLevelMilestone, TotalLevelMilestone } from '@/types/milestones';
import { BOSS_DISPLAY_NAMES } from '@/types/bosses';
// Skill display names
const SKILL_DISPLAY_NAMES: Record<string, string> = {
  attack: 'Attack',
  defence: 'Defence',
  strength: 'Strength',
  hitpoints: 'Hitpoints',
  ranged: 'Ranged',
  prayer: 'Prayer',
  magic: 'Magic',
  cooking: 'Cooking',
  woodcutting: 'Woodcutting',
  fletching: 'Fletching',
  fishing: 'Fishing',
  firemaking: 'Firemaking',
  crafting: 'Crafting',
  smithing: 'Smithing',
  mining: 'Mining',
  herblore: 'Herblore',
  agility: 'Agility',
  thieving: 'Thieving',
  slayer: 'Slayer',
  farming: 'Farming',
  runecraft: 'Runecraft',
  hunter: 'Hunter',
  construction: 'Construction',
  sailing: 'Sailing',
};
import { getSkillIcon, getBossIcon } from '@/lib/images';
import { cn } from '@/lib/utils';
import { Trophy, CheckCircle2, Target, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { formatRelativeTime } from '@/lib/utils';

interface GroupedMilestoneProps {
  group: MilestoneGroup;
  achievementDates?: Map<string, Date | null>;
}

export interface MilestoneGroup {
  id: string;
  type: 'skill_99' | 'boss_kc' | 'base_level' | 'total_level';
  name: string;
  icon?: string;
  currentValue: number;
  milestones: Milestone[];
  maxValue: number;
}

/**
 * Group milestones by skill or boss
 */
export function groupMilestones(milestones: Milestone[]): MilestoneGroup[] {
  const groups = new Map<string, MilestoneGroup>();

  for (const milestone of milestones) {
    let groupId: string;
    let groupName: string;
    let icon: string | undefined;
    let currentValue: number;
    let maxValue: number;

    if (milestone.type === 'skill_99') {
      const skillMilestone = milestone as Skill99Milestone;
      groupId = `skill_99_${skillMilestone.skill}`;
      groupName = SKILL_DISPLAY_NAMES[skillMilestone.skill];
      icon = getSkillIcon(skillMilestone.skill);
      currentValue = skillMilestone.currentXp;
      maxValue = skillMilestone.targetXp; // Will be updated to max below
    } else if (milestone.type === 'boss_kc') {
      const bossMilestone = milestone as BossKcMilestone;
      groupId = `boss_kc_${bossMilestone.boss}`;
      groupName = BOSS_DISPLAY_NAMES[bossMilestone.boss];
      icon = getBossIcon(bossMilestone.boss);
      currentValue = bossMilestone.currentKc;
      maxValue = bossMilestone.targetKc; // Will be updated to max below
    } else if (milestone.type === 'base_level') {
      groupId = 'base_level';
      groupName = 'Base Stats';
      icon = undefined;
      const baseMilestone = milestone as BaseLevelMilestone;
      currentValue = baseMilestone.lowestSkillLevel;
      maxValue = baseMilestone.targetLevel; // Will be updated to max below
    } else if (milestone.type === 'total_level') {
      groupId = 'total_level';
      groupName = 'Total Level';
      icon = undefined;
      const totalMilestone = milestone as TotalLevelMilestone;
      currentValue = totalMilestone.currentLevel;
      maxValue = totalMilestone.targetLevel; // Will be updated to max below
    } else {
      continue;
    }

    if (!groups.has(groupId)) {
      groups.set(groupId, {
        id: groupId,
        type: milestone.type as any,
        name: groupName,
        icon,
        currentValue,
        milestones: [],
        maxValue,
      });
    }

    const group = groups.get(groupId)!;
    group.milestones.push(milestone);
    
    // Update max value if this milestone has a higher target
    if (milestone.type === 'skill_99') {
      const skillMilestone = milestone as Skill99Milestone;
      group.maxValue = Math.max(group.maxValue, skillMilestone.targetXp);
    } else if (milestone.type === 'boss_kc') {
      const bossMilestone = milestone as BossKcMilestone;
      group.maxValue = Math.max(group.maxValue, bossMilestone.targetKc);
    } else if (milestone.type === 'base_level') {
      const baseMilestone = milestone as BaseLevelMilestone;
      group.maxValue = Math.max(group.maxValue, baseMilestone.targetLevel);
    } else if (milestone.type === 'total_level') {
      const totalMilestone = milestone as TotalLevelMilestone;
      group.maxValue = Math.max(group.maxValue, totalMilestone.targetLevel);
    }
  }

  // Sort groups: skills first, then others
  return Array.from(groups.values()).sort((a, b) => {
    // Skills first
    if (a.type === 'skill_99' && b.type !== 'skill_99') return -1;
    if (a.type !== 'skill_99' && b.type === 'skill_99') return 1;
    
    // Within skills, sort alphabetically by name
    if (a.type === 'skill_99' && b.type === 'skill_99') {
      return a.name.localeCompare(b.name);
    }
    
    // Then base/total levels
    if (a.type === 'base_level' && b.type !== 'base_level' && b.type !== 'total_level') return -1;
    if (a.type === 'total_level' && b.type !== 'base_level' && b.type !== 'total_level') return -1;
    if (a.type !== 'base_level' && a.type !== 'total_level' && (b.type === 'base_level' || b.type === 'total_level')) return 1;
    
    // Then bosses
    if (a.type === 'boss_kc' && b.type === 'boss_kc') {
      return a.name.localeCompare(b.name);
    }
    
    return 0;
  });
}

export function GroupedMilestone({ group, achievementDates }: GroupedMilestoneProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort milestones by target value
  const sortedMilestones = [...group.milestones].sort((a, b) => {
    if (a.type === 'skill_99') {
      return (a as Skill99Milestone).targetXp - (b as Skill99Milestone).targetXp;
    } else if (a.type === 'boss_kc') {
      return (a as BossKcMilestone).targetKc - (b as BossKcMilestone).targetKc;
    } else if (a.type === 'base_level') {
      return (a as BaseLevelMilestone).targetLevel - (b as BaseLevelMilestone).targetLevel;
    } else if (a.type === 'total_level') {
      return (a as TotalLevelMilestone).targetLevel - (b as TotalLevelMilestone).targetLevel;
    }
    return 0;
  });

  // Find next milestone
  const nextMilestone = sortedMilestones.find((m) => m.status === 'in_progress');
  const achievedCount = sortedMilestones.filter((m) => m.status === 'achieved').length;

  // Calculate overall progress
  const overallProgress = group.maxValue > 0 ? (group.currentValue / group.maxValue) * 100 : 0;

  // Format current value
  const formatValue = (value: number): string => {
    if (group.type === 'skill_99' || group.type === 'total_level') {
      return value.toLocaleString();
    }
    return value.toLocaleString();
  };

  // Get milestone target value for positioning
  const getMilestoneValue = (milestone: Milestone): number => {
    if (milestone.type === 'skill_99') {
      return (milestone as Skill99Milestone).targetXp;
    } else if (milestone.type === 'boss_kc') {
      return (milestone as BossKcMilestone).targetKc;
    } else if (milestone.type === 'base_level') {
      return (milestone as BaseLevelMilestone).targetLevel;
    } else if (milestone.type === 'total_level') {
      return (milestone as TotalLevelMilestone).targetLevel;
    }
    return 0;
  };

  return (
    <div className="p-4 rounded-lg border bg-stone-800/50 border-stone-700/50 hover:bg-stone-800 transition-colors">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {group.icon && (
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
            <Image
              src={group.icon}
              alt={group.name}
              width={32}
              height={32}
              className="object-contain w-full h-full"
              style={{ maxWidth: '32px', maxHeight: '32px' }}
              unoptimized
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-stone-200 truncate">
            {group.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-stone-400">
              Current: {formatValue(group.currentValue)}
            </span>
            <span className="text-xs text-stone-500">•</span>
            <span className="text-xs text-stone-400">
              {achievedCount} / {sortedMilestones.length} achieved
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar with Milestones */}
      <div className="relative mb-4">
        {/* Background bar */}
        <div className="h-8 bg-stone-700/50 rounded-full relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          />
          
          {/* Milestone markers with numbers inside circles */}
          {sortedMilestones.map((milestone) => {
            const milestoneValue = getMilestoneValue(milestone);
            const position = (milestoneValue / group.maxValue) * 100;
            const isAchieved = milestone.status === 'achieved';
            const isNext = milestone.id === nextMilestone?.id;
            
            // Format the value for display
            const formatMilestoneValue = (value: number): string => {
              // For skill 99 milestones, always show "99"
              if (milestone.type === 'skill_99') {
                return '99';
              }
              // For boss KC milestones, show the KC value
              if (milestone.type === 'boss_kc') {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
                }
                return value.toString();
              }
              // For base/total level milestones, show the level
              if (milestone.type === 'base_level' || milestone.type === 'total_level') {
                return value.toString();
              }
              // Default: abbreviate if needed
              if (value >= 1000) {
                return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
              }
              return value.toString();
            };

            // For circles at 0% and 100%, position them so they sit at the bar edges
            // Circle is 32px wide (16px radius)
            // For 100%: circle's right edge aligns with bar's right edge (use right-0, translate right by half width)
            // For 0%: circle's left edge aligns with bar's left edge (use left-0, translate left by half width)
            const isAtStart = position <= 0.1;
            const isAtEnd = position >= 99.9;

            return (
              <div
                key={milestone.id}
                className={cn(
                  "absolute transform -translate-y-1/2 top-1/2",
                  isAtStart ? "left-0 -translate-x-1/2" : isAtEnd ? "right-0 translate-x-1/2" : "-translate-x-1/2"
                )}
                style={isAtStart || isAtEnd ? {} : { left: `${position}%` }}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-semibold transition-all',
                    isAchieved
                      ? 'bg-amber-500 border-amber-400 text-stone-900'
                      : isNext
                      ? 'bg-stone-600 border-amber-500 text-amber-300 ring-2 ring-amber-500/50'
                      : 'bg-stone-700 border-stone-600 text-stone-400 hover:border-stone-500'
                  )}
                >
                  {formatMilestoneValue(milestoneValue)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone List Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 rounded text-xs bg-stone-800/30 border border-stone-700/20 hover:bg-stone-800/50 transition-colors"
      >
        <span className="text-stone-400">
          {sortedMilestones.length} milestone{sortedMilestones.length !== 1 ? 's' : ''}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-stone-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-stone-400" />
        )}
      </button>

      {/* Milestone List */}
      {isExpanded && (
        <div className="space-y-1.5 mt-2">
          {sortedMilestones.map((milestone) => {
            const isAchieved = milestone.status === 'achieved';
            const isNext = milestone.id === nextMilestone?.id;
            const achievedDate = achievementDates?.get(milestone.id);

            return (
              <div
                key={milestone.id}
                className={cn(
                  'flex items-center justify-between p-2 rounded text-xs transition-colors',
                  isAchieved
                    ? 'bg-emerald-900/20 border border-emerald-700/30'
                    : isNext
                    ? 'bg-amber-900/10 border border-amber-700/20'
                    : 'bg-stone-800/30 border border-stone-700/20'
                )}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isAchieved ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  ) : isNext ? (
                    <Target className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-stone-600 flex-shrink-0" />
                  )}
                  <span className={cn(
                    'truncate',
                    isAchieved ? 'text-emerald-300' : isNext ? 'text-amber-300' : 'text-stone-500'
                  )}>
                    {milestone.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAchieved && achievedDate && (
                    <div className="flex items-center gap-1 text-stone-500">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">{formatRelativeTime(achievedDate)}</span>
                    </div>
                  )}
                  {!isAchieved && (
                    <span className="text-stone-500 text-xs">
                      {milestone.progress.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

