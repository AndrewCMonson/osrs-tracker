'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatXp, formatXpShort, SKILLS, SkillName } from '@/types/skills';
import { getSkillIcon } from '@/lib/images';

interface DashboardSkillBreakdownProps {
  skillXp: Record<string, number>;
}

export function DashboardSkillBreakdown({ skillXp }: DashboardSkillBreakdownProps) {
  // Sort skills by total XP (descending)
  const sortedSkills = SKILLS.map(skill => ({
    name: skill,
    xp: skillXp[skill] || 0,
  })).sort((a, b) => b.xp - a.xp);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total XP by Skill</CardTitle>
        <p className="text-sm text-stone-400 mt-1">
          Combined XP across all your accounts
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {sortedSkills.map(({ name, xp }) => {
            const skillIcon = getSkillIcon(name);
            return (
              <div
                key={name}
                className="p-3 rounded-lg bg-stone-900/50 border border-stone-800 hover:border-amber-600/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={skillIcon}
                    alt={name}
                    width={20}
                    height={20}
                    unoptimized
                  />
                  <span className="text-xs font-medium text-stone-300 capitalize">
                    {name}
                  </span>
                </div>
                <p className="text-sm font-semibold text-amber-500">
                  {formatXpShort(xp)}
                </p>
                <p className="text-xs text-stone-500">
                  {formatXp(xp)} XP
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

