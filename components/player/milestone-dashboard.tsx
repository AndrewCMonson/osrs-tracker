'use client';

import { Milestone, MilestoneCategory, getMilestoneCategory } from '@/types/milestones';
import { groupMilestones, MilestoneGroup } from './grouped-milestone';
import { MilestoneProgressView } from './milestone-progress-view';
import { getSkillIcon, getBossIcon } from '@/lib/images';
import { BOSS_DISPLAY_NAMES } from '@/types/bosses';
import { Skill99Milestone, BossKcMilestone, BaseLevelMilestone, TotalLevelMilestone } from '@/types/milestones';
import { Trophy, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import Image from 'next/image';

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

interface MilestoneDashboardProps {
  milestones: Milestone[];
  achievementDates?: Map<string, Date | null>;
}

export function MilestoneDashboard({ milestones, achievementDates }: MilestoneDashboardProps) {
  // Calculate summary counts
  const skillAchievements = milestones.filter(
    (m) => m.status === 'achieved' && (m.type === 'skill_99' || m.type === 'max_cape')
  ).length;
  const bossAchievements = milestones.filter(
    (m) => m.status === 'achieved' && m.type === 'boss_kc'
  ).length;
  const levelAchievements = milestones.filter(
    (m) => m.status === 'achieved' && (m.type === 'base_level' || m.type === 'total_level' || m.type === 'combat_level')
  ).length;

  // Get recent achievements (achieved, sorted by date)
  const recentAchievements = milestones
    .filter((m) => m.status === 'achieved')
    .sort((a, b) => {
      const aDate = achievementDates?.get(a.id);
      const bDate = achievementDates?.get(b.id);
      if (aDate && bDate) {
        return bDate.getTime() - aDate.getTime();
      }
      return 0;
    })
    .slice(0, 5);

  // Get nearest achievements (in progress, sorted by progress)
  const nearestAchievements = milestones
    .filter((m) => m.status === 'in_progress')
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  // Group milestones for progress view
  const grouped = groupMilestones(milestones);
  const skillGroups = grouped.filter((g) => g.type === 'skill_99');
  const bossGroups = grouped.filter((g) => g.type === 'boss_kc');
  const baseLevelGroup = grouped.find((g) => g.type === 'base_level');
  const totalLevelGroup = grouped.find((g) => g.type === 'total_level');

  const getMilestoneIcon = (milestone: Milestone): string | undefined => {
    if (milestone.type === 'skill_99') {
      return getSkillIcon((milestone as Skill99Milestone).skill);
    } else if (milestone.type === 'boss_kc') {
      return getBossIcon((milestone as BossKcMilestone).boss);
    }
    return undefined;
  };

  const getMilestoneName = (milestone: Milestone): string => {
    if (milestone.type === 'skill_99') {
      return `99 ${SKILL_DISPLAY_NAMES_MAP[(milestone as Skill99Milestone).skill]}`;
    } else if (milestone.type === 'boss_kc') {
      const bossMilestone = milestone as BossKcMilestone;
      return `${BOSS_DISPLAY_NAMES[bossMilestone.boss]} ${bossMilestone.targetKc} KC`;
    } else if (milestone.type === 'base_level') {
      return `Base ${(milestone as BaseLevelMilestone).targetLevel} Stats`;
    } else if (milestone.type === 'total_level') {
      return `${(milestone as TotalLevelMilestone).targetLevel.toLocaleString()} Total`;
    }
    return milestone.name;
  };

  const getRemainingValue = (milestone: Milestone): string => {
    if (milestone.type === 'skill_99') {
      const skillMilestone = milestone as Skill99Milestone;
      const remaining = skillMilestone.targetXp - skillMilestone.currentXp;
      return remaining > 0 ? `${(remaining / 1000).toFixed(0)}k left` : '';
    } else if (milestone.type === 'boss_kc') {
      const bossMilestone = milestone as BossKcMilestone;
      const remaining = bossMilestone.targetKc - bossMilestone.currentKc;
      return remaining > 0 ? `${remaining} left` : '';
    } else if (milestone.type === 'base_level') {
      const baseMilestone = milestone as BaseLevelMilestone;
      const remaining = baseMilestone.targetLevel - baseMilestone.lowestSkillLevel;
      return remaining > 0 ? `${remaining} levels left` : '';
    } else if (milestone.type === 'total_level') {
      const totalMilestone = milestone as TotalLevelMilestone;
      const remaining = totalMilestone.targetLevel - totalMilestone.currentLevel;
      return remaining > 0 ? `${remaining} levels left` : '';
    }
    return '';
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-stone-800/50 border border-stone-700/50">
          <div className="text-xs text-stone-500 mb-1">Skill achievements</div>
          <div className="text-lg font-semibold text-stone-200">{skillAchievements}</div>
        </div>
        <div className="p-3 rounded-lg bg-stone-800/50 border border-stone-700/50">
          <div className="text-xs text-stone-500 mb-1">Boss achievements</div>
          <div className="text-lg font-semibold text-stone-200">{bossAchievements}</div>
        </div>
        <div className="p-3 rounded-lg bg-stone-800/50 border border-stone-700/50">
          <div className="text-xs text-stone-500 mb-1">Level achievements</div>
          <div className="text-lg font-semibold text-stone-200">{levelAchievements}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Recent & Nearest */}
        <div className="lg:col-span-1 space-y-4">
          {/* Recent Achievements */}
          <div className="p-4 rounded-lg bg-stone-800/50 border border-stone-700/50">
            <h3 className="text-sm font-semibold text-stone-200 mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-emerald-500" />
              Recent achievements
            </h3>
            <div className="space-y-2">
              {recentAchievements.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-4">No achievements yet</p>
              ) : (
                recentAchievements.map((milestone) => {
                  const icon = getMilestoneIcon(milestone);
                  const date = achievementDates?.get(milestone.id);
                  return (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-2 p-2 rounded bg-stone-900/50 border border-stone-700/30"
                    >
                      {icon && (
                        <Image
                          src={icon}
                          alt=""
                          width={20}
                          height={20}
                          className="flex-shrink-0"
                          unoptimized
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-stone-300 truncate">
                          {getMilestoneName(milestone)}
                        </div>
                        {date && (
                          <div className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Nearest Achievements */}
          <div className="p-4 rounded-lg bg-stone-800/50 border border-stone-700/50">
            <h3 className="text-sm font-semibold text-stone-200 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Nearest achievements
            </h3>
            <div className="space-y-2">
              {nearestAchievements.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-4">All milestones achieved!</p>
              ) : (
                nearestAchievements.map((milestone) => {
                  const icon = getMilestoneIcon(milestone);
                  const remaining = getRemainingValue(milestone);
                  return (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-2 p-2 rounded bg-stone-900/50 border border-stone-700/30"
                    >
                      {icon && (
                        <Image
                          src={icon}
                          alt=""
                          width={20}
                          height={20}
                          className="flex-shrink-0"
                          unoptimized
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-stone-300 truncate">
                          {getMilestoneName(milestone)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-stone-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-stone-500">{remaining}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Achievement Progress */}
        <div className="lg:col-span-2 p-4 rounded-lg bg-stone-800/50 border border-stone-700/50">
          <h3 className="text-sm font-semibold text-stone-200 mb-4">Achievement progress</h3>
          <div className="space-y-1">
            {/* Overall */}
            {totalLevelGroup && (
              <MilestoneProgressView
                milestones={totalLevelGroup.milestones}
                currentValue={totalLevelGroup.currentValue}
                name="Overall"
                type="total"
              />
            )}

            {/* Base Stats */}
            {baseLevelGroup && (
              <MilestoneProgressView
                milestones={baseLevelGroup.milestones}
                currentValue={baseLevelGroup.currentValue}
                name="Base Stats"
                type="base"
              />
            )}

            {/* Skills */}
            {skillGroups.slice(0, 10).map((group) => (
              <MilestoneProgressView
                key={group.id}
                milestones={group.milestones}
                currentValue={group.currentValue}
                name={group.name}
                icon={group.icon}
                type="skill"
              />
            ))}

            {/* Bosses */}
            {bossGroups.slice(0, 10).map((group) => (
              <MilestoneProgressView
                key={group.id}
                milestones={group.milestones}
                currentValue={group.currentValue}
                name={group.name}
                icon={group.icon}
                type="boss"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

