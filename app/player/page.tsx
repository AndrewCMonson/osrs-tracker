import { SearchForm } from '@/components/player/search-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

const popularPlayers = [
  { username: 'Zezima', totalLevel: 2277, accountType: 'Normal' },
  { username: 'Lynx Titan', totalLevel: 2277, accountType: 'Normal' },
  { username: 'Woox', totalLevel: 2200, accountType: 'Normal' },
  { username: 'Settled', totalLevel: 1850, accountType: 'Ultimate Ironman' },
];

export default function PlayerLookupPage() {
  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="container mx-auto px-4 py-12 relative">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/30">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Player Lookup
            </h1>
            <p className="text-stone-400 max-w-lg mx-auto">
              Search for any Old School RuneScape player to view their stats,
              boss kill counts, and achievements.
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-12">
            <CardContent className="p-6">
              <SearchForm
                size="lg"
                placeholder="Enter username to lookup..."
              />
            </CardContent>
          </Card>

          {/* Popular Players */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              Popular Players
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularPlayers.map((player) => (
                <Link
                  key={player.username}
                  href={`/player/${encodeURIComponent(player.username.toLowerCase().replace(/\s+/g, '_'))}`}
                >
                  <Card className="hover:border-amber-600/30 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">
                          {player.username.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-stone-100">
                          {player.username}
                        </p>
                        <p className="text-sm text-stone-500">
                          {player.accountType} · {player.totalLevel.toLocaleString()} Total
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





