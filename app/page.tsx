import Link from 'next/link';
import { SearchForm } from '@/components/player/search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sword,
  Trophy,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description:
      'Monitor your skill levels, XP gains, and overall progression over time.',
  },
  {
    icon: Trophy,
    title: 'Milestones',
    description:
      'Celebrate achievements like 99s, base levels, and boss KC thresholds.',
  },
  {
    icon: Target,
    title: 'Set Goals',
    description:
      'See how close you are to your next milestone and plan your grind.',
  },
  {
    icon: Shield,
    title: 'Claim & Verify',
    description:
      'Securely link your OSRS account to unlock personalized features.',
  },
];

const stats = [
  { label: 'Players Tracked', value: '10,000+' },
  { label: 'Stats Updated', value: '1M+' },
  { label: 'Milestones Achieved', value: '50K+' },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-radial-gradient" />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/10 border border-amber-600/20 text-amber-500 text-sm mb-8">
              <Zap className="h-4 w-4" />
              <span>Free & Open Source OSRS Tracking</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Track Your{' '}
              <span className="text-gradient">OSRS Journey</span>
            </h1>

            <p className="text-lg md:text-xl text-stone-400 mb-10 max-w-2xl mx-auto">
              Monitor your Old School RuneScape progress, celebrate milestones,
              and see how close you are to your next achievement. All in one
              beautiful dashboard.
            </p>

            {/* Search Form */}
            <div className="max-w-xl mx-auto mb-8">
              <SearchForm
                size="lg"
                placeholder="Enter your OSRS username..."
              />
            </div>

            <p className="text-sm text-stone-500">
              Try searching for{' '}
              <Link
                href="/player/zezima"
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                Zezima
              </Link>
              ,{' '}
              <Link
                href="/player/woox"
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                Woox
              </Link>
              , or any OSRS username
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 border-y border-stone-800 bg-stone-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-500">
                  {stat.value}
                </p>
                <p className="text-sm text-stone-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Track Your Progress
            </h2>
            <p className="text-stone-400 max-w-2xl mx-auto">
              Whether you&apos;re a casual player or grinding for max cape, we&apos;ve got
              the tools to help you track your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:border-amber-600/30 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-amber-600/10 flex items-center justify-center mb-4 group-hover:bg-amber-600/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-stone-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="relative p-8 md:p-12 lg:p-16">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl" />

              <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Ready to Track Your Progress?
                  </h2>
                  <p className="text-stone-400 max-w-lg">
                    Create an account to claim your OSRS character, unlock
                    personalized insights, and track your progress over time.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Get Started Free
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/player">Browse Players</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
