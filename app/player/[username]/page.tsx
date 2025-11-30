import { notFound } from 'next/navigation';
import { getPlayerProfile } from '@/services/player';
import { PlayerHeader } from '@/components/player/player-header';
import { SkillGrid } from '@/components/player/skill-grid';
import { SkillTable } from '@/components/player/skill-table';
import { SkillChart } from '@/components/player/skill-chart';
import { BossList } from '@/components/player/boss-list';
import { MilestoneList } from '@/components/player/milestone-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatXpShort } from '@/types/skills';
import {
  BarChart3,
  Skull,
  Trophy,
  TrendingUp,
  Target,
  LineChart,
} from 'lucide-react';

interface PlayerPageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: PlayerPageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username).replace(/_/g, ' ');
  
  return {
    title: `${decodedUsername} - OSRS Tracker`,
    description: `View ${decodedUsername}'s Old School RuneScape stats, boss kills, and achievements.`,
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const profile = await getPlayerProfile(decodedUsername);

  if (!profile) {
    notFound();
  }

  // Get nearest 99s
  const nearest99s = profile.milestones
    .filter((m) => m.type === 'skill_99' && m.status === 'in_progress')
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  // Get recent achievements
  const recentAchievements = profile.milestones
    .filter((m) => m.status === 'achieved')
    .slice(0, 5);

  // Stats summary
  const statsCards = [
    {
      label: 'Total Level',
      value: profile.totalLevel.toLocaleString(),
      subtext: `Rank #${profile.skills.overall.rank.toLocaleString() || 'N/A'}`,
      icon: BarChart3,
    },
    {
      label: 'Total XP',
      value: formatXpShort(profile.totalXp),
      subtext: `${profile.totalXp.toLocaleString()} XP`,
      icon: TrendingUp,
    },
    {
      label: 'Combat Level',
      value: profile.combatLevel.toString(),
      subtext: profile.combatLevel === 126 ? 'Maxed!' : `${126 - profile.combatLevel} to max`,
      icon: Target,
    },
    {
      label: '99s Achieved',
      value: Object.values(profile.skills.skills).filter((s) => s.level >= 99).length.toString(),
      subtext: `of 24 skills`,
      icon: Trophy,
    },
  ];

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="container mx-auto px-4 py-8 relative">
        {/* Player Header */}
        <PlayerHeader player={profile} />

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {statsCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-stone-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-stone-100 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-stone-600 mt-1">{stat.subtext}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="bosses">Bosses</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-500" />
                    Skills Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillGrid skills={profile.skills} compact />
                </CardContent>
              </Card>

              {/* Nearest 99s */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-amber-500" />
                    Nearest 99s
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {nearest99s.length > 0 ? (
                    <MilestoneList
                      milestones={nearest99s}
                      compact
                      emptyMessage="All skills are already 99!"
                    />
                  ) : (
                    <p className="text-stone-500 text-center py-4">
                      All skills are already 99! 🎉
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MilestoneList
                    milestones={recentAchievements}
                    compact
                    emptyMessage="No achievements yet. Keep grinding!"
                  />
                </CardContent>
              </Card>

              {/* Top Bosses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Skull className="h-5 w-5 text-amber-500" />
                    Top Bosses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BossList
                    bosses={Object.fromEntries(
                      Object.entries(profile.bosses)
                        .sort((a, b) => (b[1]?.killCount ?? 0) - (a[1]?.killCount ?? 0))
                        .slice(0, 6)
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="space-y-6">
              {/* Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-amber-500" />
                    Progress Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillChart username={profile.username} />
                </CardContent>
              </Card>

              {/* Skills Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-amber-500" />
                    All Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SkillTable skills={profile.skills} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bosses Tab */}
          <TabsContent value="bosses">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Skull className="h-5 w-5 text-amber-500" />
                  Boss Kill Counts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BossList bosses={profile.bosses} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <div className="space-y-6">
              {/* Achieved */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-emerald-500" />
                    Achieved Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MilestoneList
                    milestones={profile.milestones.filter(
                      (m) => m.status === 'achieved'
                    )}
                    emptyMessage="No milestones achieved yet."
                  />
                </CardContent>
              </Card>

              {/* In Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-amber-500" />
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MilestoneList
                    milestones={profile.milestones
                      .filter((m) => m.status === 'in_progress')
                      .sort((a, b) => b.progress - a.progress)
                      .slice(0, 20)}
                    emptyMessage="All milestones achieved!"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

