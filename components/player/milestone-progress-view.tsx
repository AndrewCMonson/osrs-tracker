'use client';

import { Milestone, Skill99Milestone, BossKcMilestone, BaseLevelMilestone, TotalLevelMilestone } from '@/types/milestones';
import { getSkillIcon, getBossIcon } from '@/lib/images';
import { BOSS_DISPLAY_NAMES } from '@/types/bosses';
import { MilestoneProgressBar } from './milestone-progress-bar';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MilestoneProgressViewProps {
  milestones: Milestone[];
  currentValue: number;
  name: string;
  icon?: string;
  type: 'skill' | 'boss' | 'base' | 'total';
}

const SKILL_DISPLAY_NAMES_MAP: Record<string, string> = {
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

export function MilestoneProgressView({ milestones, currentValue, name, icon, type }: MilestoneProgressViewProps) {
  const sortedMilestones = [...milestones].sort((a, b) => {
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

  const formatValue = (value: number): string => {
    return value.toLocaleString();
  };

  const maxValue = sortedMilestones.length > 0 
    ? Math.max(...sortedMilestones.map(getMilestoneValue))
    : currentValue || 1;
  const nextMilestone = sortedMilestones.find((m) => m.status === 'in_progress');

  return (
    <div className="flex items-center gap-3 py-2 border-b border-stone-700/30 last:border-0">
      {/* Icon */}
      {icon && (
        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
          <Image
            src={icon}
            alt={name}
            width={24}
            height={24}
            className="object-contain w-full h-full"
            style={{ maxWidth: '24px', maxHeight: '24px' }}
            unoptimized
          />
        </div>
      )}

      {/* Name */}
      <div className="w-24 flex-shrink-0">
        <span className="text-xs text-stone-300">{name}</span>
      </div>

      {/* Current Value */}
      <div className="w-16 flex-shrink-0 text-right">
        <span className="text-xs text-stone-400">{formatValue(currentValue)}</span>
      </div>

      {/* Progress Bar */}
      <div className="flex-1 min-w-0">
        <MilestoneProgressBar
          milestones={sortedMilestones}
          currentValue={currentValue}
          maxValue={maxValue}
          getMilestoneValue={getMilestoneValue}
          formatValue={formatValue}
        />
      </div>

      {/* Milestone Targets */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {sortedMilestones.map((milestone) => {
          const milestoneValue = getMilestoneValue(milestone);
          const isAchieved = milestone.status === 'achieved';
          const isNext = milestone.id === nextMilestone?.id;

          return (
            <div
              key={milestone.id}
              className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-medium transition-all',
                isAchieved
                  ? 'bg-emerald-500 text-stone-900'
                  : isNext
                  ? 'bg-amber-500 text-stone-900'
                  : 'bg-stone-700 text-stone-500'
              )}
            >
              {formatValue(milestoneValue)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

