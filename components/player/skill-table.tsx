'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { PlayerSkills, SKILLS, SkillName, formatXp, formatXpShort, getProgressTo99 } from '@/types/skills';
import { getSkillIcon } from '@/lib/images';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimePeriodSelector, TimePeriod } from './time-period-selector';

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

type SortField = 'skill' | 'level' | 'xp' | 'rank' | 'progress' | 'xpGained';
type SortDirection = 'asc' | 'desc';

interface SkillTableProps {
  skills: PlayerSkills;
  username: string;
}

interface SkillHistoryData {
  skill: SkillName;
  dataPoints: {
    date: string;
    level: number;
    xp: number;
    rank: number;
  }[];
}

export function SkillTable({ skills, username }: SkillTableProps) {
  const [sortField, setSortField] = useState<SortField>('skill');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
  const [skillsHistory, setSkillsHistory] = useState<SkillHistoryData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch history data when time period changes
  useEffect(() => {
    async function fetchHistory() {
      // Only fetch if we have valid custom dates or it's not custom
      if (timePeriod !== 'custom' || (customStartDate && customEndDate)) {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            period: timePeriod,
          });
          if (timePeriod === 'custom' && customStartDate && customEndDate) {
            params.append('start', customStartDate.toISOString());
            params.append('end', customEndDate.toISOString());
          }
          
          const response = await fetch(`/api/players/${encodeURIComponent(username)}/history?${params}`);
          const data = await response.json();
          
          if (data.success) {
            setSkillsHistory(data.data.skills || []);
          }
        } catch (error) {
          console.error('Failed to fetch history:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchHistory();
  }, [username, timePeriod, customStartDate, customEndDate]);

  // Calculate XP gained for a skill
  const getXpGained = (skill: SkillName): number => {
    const history = skillsHistory.find((h) => h.skill === skill);
    if (!history || history.dataPoints.length < 2) return 0;
    
    const first = history.dataPoints[0];
    const last = history.dataPoints[history.dataPoints.length - 1];
    return last.xp - first.xp;
  };

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
      case 'xpGained':
        comparison = getXpGained(a) - getXpGained(b);
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
    <div className="space-y-4">
      {/* Time Period Selector */}
      <TimePeriodSelector
        value={timePeriod}
        onChange={setTimePeriod}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onCustomDateChange={(start, end) => {
          setCustomStartDate(start);
          setCustomEndDate(end);
        }}
      />

      <div className="rounded-lg border border-stone-800 overflow-hidden">
        {/* Header */}
        <div className={cn(
          "grid gap-2 px-4 py-3 bg-stone-900/80 border-b border-stone-800",
          timePeriod !== 'all' ? "grid-cols-12" : "grid-cols-12"
        )}>
          <div className={cn(timePeriod !== 'all' ? "col-span-2" : "col-span-4")}>
            <HeaderButton field="skill">Skill</HeaderButton>
          </div>
          <div className={cn(timePeriod !== 'all' ? "col-span-2" : "col-span-2", "flex justify-end")}>
            <HeaderButton field="xp" className="justify-end">Exp.</HeaderButton>
          </div>
          {timePeriod !== 'all' && (
            <div className="col-span-2 flex justify-end">
              <HeaderButton field="xpGained" className="justify-end">Exp. Gained</HeaderButton>
            </div>
          )}
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
      <div className={cn(
        "grid gap-2 px-4 py-2.5 bg-stone-800/50 border-b border-stone-800",
        "grid-cols-12"
      )}>
        <div className={cn(timePeriod !== 'all' ? "col-span-2" : "col-span-4", "flex items-center gap-2")}>
          <div className="w-5 h-5 rounded bg-amber-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">Σ</span>
          </div>
          <span className="text-sm font-medium text-amber-500">Overall</span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-sm font-medium text-emerald-400">
            {formatXp(totalXp)}
          </span>
        </div>
        {timePeriod !== 'all' && (
          <div className="col-span-2 text-right">
            <span className="text-sm font-medium text-emerald-300">
              {(() => {
                const totalGained = SKILLS.reduce((sum, skill) => sum + getXpGained(skill), 0);
                return totalGained > 0 ? `+${formatXp(totalGained)}` : formatXp(totalGained);
              })()}
            </span>
          </div>
        )}
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
              className={cn(
                "grid gap-2 px-4 py-2 hover:bg-stone-800/30 transition-colors",
                "grid-cols-12"
              )}
            >
              <div className={cn(timePeriod !== 'all' ? "col-span-2" : "col-span-4", "flex items-center gap-2")}>
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
                  {formatXp(data.xp)}
                </span>
              </div>
              {timePeriod !== 'all' && (
                <div className="col-span-2 text-right">
                  <span className="text-sm text-emerald-300">
                    {(() => {
                      const gained = getXpGained(skill);
                      return gained > 0 ? `+${formatXp(gained)}` : formatXp(gained);
                    })()}
                  </span>
                </div>
              )}
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
    </div>
  );
}

