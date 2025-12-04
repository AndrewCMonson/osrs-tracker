'use client';

import Image from 'next/image';
import { PlayerSkills, SKILLS } from '@/types/skills';

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
import { getSkillIcon } from '@/lib/images';
import { cn } from '@/lib/utils';

interface SkillGridInGameProps {
  skills: PlayerSkills;
}

export function SkillGridInGame({ skills }: SkillGridInGameProps) {
  // Calculate total level (capped at 99 per skill)
  const totalLevel = SKILLS.reduce((sum, skill) => {
    const skillData = skills.skills[skill];
    return sum + Math.min(skillData.level, 99);
  }, 0);

  return (
    <div className="space-y-2">
      {/* 3x8 Grid of Skills */}
      <div className="grid grid-cols-3 gap-px bg-stone-700/30 p-px rounded border border-stone-700/50">
        {SKILLS.map((skill) => {
          const skillData = skills.skills[skill];
          const level = skillData.level;
          // In-game shows level / level (current / virtual, but we'll show current / current for simplicity)
          const displayLevel = level;

          return (
            <div
              key={skill}
              className="relative bg-stone-800/80 border border-stone-700/40 p-2 flex flex-col items-center justify-center hover:bg-stone-800 transition-colors group"
            >
              {/* Skill Icon */}
              <div className="w-8 h-8 flex items-center justify-center mb-1">
                <Image
                  src={getSkillIcon(skill)}
                  alt={SKILL_DISPLAY_NAMES[skill]}
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
              
              {/* Level Display (level / level format like in-game) */}
              <div className="text-xs font-bold text-amber-400 leading-tight">
                {displayLevel} / {displayLevel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Level Banner */}
      <div className="bg-stone-900/80 border border-stone-700/50 rounded px-4 py-2 text-center">
        <span className="text-sm font-semibold text-amber-400">
          Total level: <span className="text-stone-100">{totalLevel.toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
}

