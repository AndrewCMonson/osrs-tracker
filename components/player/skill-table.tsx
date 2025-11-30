'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PlayerSkills, SKILLS, SkillName, formatXp, formatXpShort, getProgressTo99 } from '@/types/skills';
import { getSkillIcon } from '@/lib/images';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

type SortField = 'skill' | 'level' | 'xp' | 'rank' | 'progress';
type SortDirection = 'asc' | 'desc';

interface SkillTableProps {
  skills: PlayerSkills;
}

export function SkillTable({ skills }: SkillTableProps) {
  const [sortField, setSortField] = useState<SortField>('skill');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'skill' ? 'asc' : 'desc');
    }
  };

  const sortedSkills = [...SKILLS].sort((a, b) => {
    const aData = skills.skills[a];
    const bData = skills.skills[b];
    let comparison = 0;

    switch (sortField) {
      case 'skill':
        // Use the original OSRS skill order (index in SKILLS array)
        comparison = SKILLS.indexOf(a) - SKILLS.indexOf(b);
        break;
      case 'level':
        comparison = aData.level - bData.level;
        break;
      case 'xp':
        comparison = aData.xp - bData.xp;
        break;
      case 'rank':
        // Lower rank is better, handle unranked (0) as worst
        const aRank = aData.rank || 999999999;
        const bRank = bData.rank || 999999999;
        comparison = aRank - bRank;
        break;
      case 'progress':
        comparison = getProgressTo99(aData.xp) - getProgressTo99(bData.xp);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="h-3 w-3 text-stone-600" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3 w-3 text-amber-500" />
    ) : (
      <ChevronDown className="h-3 w-3 text-amber-500" />
    );
  };

  const HeaderButton = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={cn(
        'flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors',
        sortField === field && 'text-amber-500',
        className
      )}
    >
      {children}
      <SortIcon field={field} />
    </button>
  );

  // Calculate totals
  const totalXp = skills.overall.xp;
  const totalLevel = SKILLS.reduce((sum, skill) => sum + Math.min(skills.skills[skill].level, 99), 0);

  return (
    <div className="rounded-lg border border-stone-800 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-stone-900/80 border-b border-stone-800">
        <div className="col-span-4">
          <HeaderButton field="skill">Skill</HeaderButton>
        </div>
        <div className="col-span-2 flex justify-end">
          <HeaderButton field="xp" className="justify-end">Exp.</HeaderButton>
        </div>
        <div className="col-span-2 flex justify-end">
          <HeaderButton field="level" className="justify-end">Level</HeaderButton>
        </div>
        <div className="col-span-2 flex justify-end">
          <HeaderButton field="rank" className="justify-end">Rank</HeaderButton>
        </div>
        <div className="col-span-2 flex justify-end">
          <HeaderButton field="progress" className="justify-end">Progress</HeaderButton>
        </div>
      </div>

      {/* Overall row */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-stone-800/50 border-b border-stone-800">
        <div className="col-span-4 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-amber-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">Σ</span>
          </div>
          <span className="text-sm font-medium text-amber-500">Overall</span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-sm font-medium text-emerald-400">
            {formatXpShort(totalXp)}
          </span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-sm font-medium text-stone-200">
            {totalLevel.toLocaleString()}
          </span>
        </div>
        <div className="col-span-2 text-right">
          <span className={cn(
            'text-sm',
            skills.overall.rank > 0 ? 'text-stone-400' : 'text-stone-600'
          )}>
            {skills.overall.rank > 0 ? `#${skills.overall.rank.toLocaleString()}` : '--'}
          </span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-sm text-amber-500">
            {((totalLevel / 2376) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Skills rows */}
      <div className="divide-y divide-stone-800/50">
        {sortedSkills.map((skill) => {
          const data = skills.skills[skill];
          const progress = getProgressTo99(data.xp);
          const isMaxed = data.level >= 99;

          return (
            <div
              key={skill}
              className="grid grid-cols-12 gap-2 px-4 py-2 hover:bg-stone-800/30 transition-colors"
            >
              <div className="col-span-4 flex items-center gap-2">
                <Image
                  src={getSkillIcon(skill)}
                  alt={SKILL_DISPLAY_NAMES[skill]}
                  width={20}
                  height={20}
                  unoptimized
                />
                <span className="text-sm text-stone-300">
                  {SKILL_DISPLAY_NAMES[skill]}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm text-emerald-400">
                  {formatXpShort(data.xp)}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className={cn(
                  'text-sm font-medium',
                  isMaxed ? 'text-amber-500' : 'text-stone-200'
                )}>
                  {data.level}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className={cn(
                  'text-sm',
                  data.rank > 0 ? 'text-stone-400' : 'text-stone-600'
                )}>
                  {data.rank > 0 ? `#${data.rank.toLocaleString()}` : '--'}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        isMaxed ? 'bg-amber-500' : 'bg-emerald-500'
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className={cn(
                    'text-xs w-10 text-right',
                    isMaxed ? 'text-amber-500' : 'text-stone-400'
                  )}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

