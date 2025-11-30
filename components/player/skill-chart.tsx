'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SKILLS, SkillName, formatXpShort } from '@/types/skills';
import { getSkillIcon } from '@/lib/images';
import { cn } from '@/lib/utils';
import { TrendingUp, Calendar, Loader2 } from 'lucide-react';
import Image from 'next/image';

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

const SKILL_COLORS: Record<SkillName, string> = {
  attack: '#b91c1c',
  defence: '#3b82f6',
  strength: '#15803d',
  hitpoints: '#dc2626',
  ranged: '#16a34a',
  prayer: '#eab308',
  magic: '#6366f1',
  cooking: '#7c3aed',
  woodcutting: '#854d0e',
  fletching: '#0891b2',
  fishing: '#0ea5e9',
  firemaking: '#f97316',
  crafting: '#a16207',
  smithing: '#525252',
  mining: '#a3a3a3',
  herblore: '#22c55e',
  agility: '#1d4ed8',
  thieving: '#9333ea',
  slayer: '#171717',
  farming: '#65a30d',
  runecraft: '#eab308',
  hunter: '#b45309',
  construction: '#78716c',
  sailing: '#0284c7',
};

interface SkillHistoryData {
  skill: SkillName;
  dataPoints: {
    date: string;
    level: number;
    xp: number;
    rank: number;
  }[];
}

interface TotalHistoryData {
  date: string;
  totalXp: number;
  totalLevel: number;
}

interface SkillChartProps {
  username: string;
}

export function SkillChart({ username }: SkillChartProps) {
  const [skillsHistory, setSkillsHistory] = useState<SkillHistoryData[]>([]);
  const [totalHistory, setTotalHistory] = useState<TotalHistoryData[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<SkillName[]>(['attack', 'strength', 'defence']);
  const [chartType, setChartType] = useState<'xp' | 'level' | 'total'>('xp');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/players/${encodeURIComponent(username)}/history`);
        const data = await response.json();

        if (data.success) {
          setSkillsHistory(data.data.skills || []);
          setTotalHistory(data.data.total || []);
        } else {
          setError(data.error || 'Failed to load history');
        }
      } catch (err) {
        setError('Failed to load history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [username]);

  const toggleSkill = (skill: SkillName) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill].slice(-5) // Max 5 skills at a time
    );
  };

  // Format data for the chart
  const chartData = (() => {
    if (chartType === 'total') {
      return totalHistory.map((point) => ({
        date: new Date(point.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        fullDate: point.date,
        'Total XP': point.totalXp,
        'Total Level': point.totalLevel,
      }));
    }

    // Get all unique dates
    const allDates = new Set<string>();
    selectedSkills.forEach((skill) => {
      const history = skillsHistory.find((h) => h.skill === skill);
      history?.dataPoints.forEach((dp) => allDates.add(dp.date));
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // Build chart data
    return sortedDates.map((date) => {
      const point: Record<string, string | number> = {
        date: new Date(date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        fullDate: date,
      };

      selectedSkills.forEach((skill) => {
        const history = skillsHistory.find((h) => h.skill === skill);
        const dp = history?.dataPoints.find((p) => p.date === date);
        point[SKILL_DISPLAY_NAMES[skill]] = dp
          ? chartType === 'xp'
            ? dp.xp
            : dp.level
          : 0;
      });

      return point;
    });
  })();

  const hasData = chartData.length > 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart Type Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setChartType('xp')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-lg transition-colors',
            chartType === 'xp'
              ? 'bg-amber-500 text-stone-900 font-medium'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          )}
        >
          XP Progress
        </button>
        <button
          onClick={() => setChartType('level')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-lg transition-colors',
            chartType === 'level'
              ? 'bg-amber-500 text-stone-900 font-medium'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          )}
        >
          Level Progress
        </button>
        <button
          onClick={() => setChartType('total')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-lg transition-colors',
            chartType === 'total'
              ? 'bg-amber-500 text-stone-900 font-medium'
              : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
          )}
        >
          Total XP
        </button>
      </div>

      {/* Skill Selector (for non-total charts) */}
      {chartType !== 'total' && (
        <div className="flex flex-wrap gap-1.5">
          {SKILLS.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-all',
                selectedSkills.includes(skill)
                  ? 'bg-stone-700 text-stone-100 ring-1 ring-amber-500/50'
                  : 'bg-stone-800/50 text-stone-500 hover:bg-stone-800 hover:text-stone-300'
              )}
            >
              <Image
                src={getSkillIcon(skill)}
                alt={SKILL_DISPLAY_NAMES[skill]}
                width={14}
                height={14}
                unoptimized
              />
              <span className="hidden sm:inline">{SKILL_DISPLAY_NAMES[skill]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chart */}
      {hasData ? (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#44403c" />
              <XAxis
                dataKey="date"
                stroke="#78716c"
                tick={{ fill: '#a8a29e', fontSize: 12 }}
              />
              <YAxis
                stroke="#78716c"
                tick={{ fill: '#a8a29e', fontSize: 12 }}
                tickFormatter={(value) =>
                  chartType === 'level' ? value : formatXpShort(value)
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1c1917',
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fafaf9' }}
                formatter={(value: number) =>
                  chartType === 'level' ? value : formatXpShort(value)
                }
              />
              <Legend />
              {chartType === 'total' ? (
                <Line
                  type="monotone"
                  dataKey="Total XP"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ) : (
                selectedSkills.map((skill) => (
                  <Line
                    key={skill}
                    type="monotone"
                    dataKey={SKILL_DISPLAY_NAMES[skill]}
                    stroke={SKILL_COLORS[skill]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-stone-600" />
          </div>
          <h3 className="text-lg font-medium text-stone-300 mb-2">
            No Historical Data Yet
          </h3>
          <p className="text-sm text-stone-500 max-w-sm">
            Progress tracking starts when you look up this player. Check back later to see XP gains over time.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-stone-600">
            <Calendar className="h-4 w-4" />
            <span>Snapshots are taken hourly when the profile is viewed</span>
          </div>
        </div>
      )}
    </div>
  );
}


