'use client';

import Image from 'next/image';
import { PlayerSkills, SKILLS, SkillName, formatXp, getProgressTo99 } from '@/types/skills';
import { Progress } from '@/components/ui/progress';
import { getSkillIcon } from '@/lib/images';

const SKILL_DISPLAY_NAMES: Record<SkillName, string> = {
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

interface SkillGridProps {
  skills: PlayerSkills;
  compact?: boolean;
}

export function SkillGrid({ skills, compact = false }: SkillGridProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
        {SKILLS.map((skill) => {
          const data = skills.skills[skill];
          return (
            <div
              key={skill}
              className="flex flex-col items-center p-2 rounded-lg bg-stone-800/50 hover:bg-stone-800 transition-colors group"
            >
              <Image
                src={getSkillIcon(skill)}
                alt={SKILL_DISPLAY_NAMES[skill]}
                width={24}
                height={24}
                className="mb-1"
                unoptimized
              />
              <span className="text-xs text-stone-500 group-hover:text-stone-400 transition-colors truncate w-full text-center">
                {SKILL_DISPLAY_NAMES[skill].slice(0, 3)}
              </span>
              <span className="text-sm font-bold text-stone-100">
                {data.level}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {SKILLS.map((skill) => {
        const data = skills.skills[skill];
        const progress = getProgressTo99(data.xp);

        return (
          <div
            key={skill}
            className="flex items-center gap-3 p-3 rounded-lg bg-stone-800/50 hover:bg-stone-800 transition-colors"
          >
            <div className="w-10 h-10 flex items-center justify-center relative">
              <Image
                src={getSkillIcon(skill)}
                alt={SKILL_DISPLAY_NAMES[skill]}
                width={32}
                height={32}
                unoptimized
              />
              <span className="absolute -bottom-1 -right-1 text-xs font-bold text-white bg-stone-900 rounded px-1 border border-stone-700">
                {data.level}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-stone-200">
                  {SKILL_DISPLAY_NAMES[skill]}
                </span>
                <span className="text-xs text-stone-500">
                  {formatXp(data.xp)} XP
                </span>
              </div>
              <Progress value={progress} size="sm" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

