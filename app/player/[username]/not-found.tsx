import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SearchForm } from '@/components/player/search-form';
import { UserX, Search, Home } from 'lucide-react';

export default function PlayerNotFound() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-600/10 flex items-center justify-center mx-auto mb-6">
          <UserX className="h-10 w-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Player Not Found</h1>
        <p className="text-stone-400 mb-8">
          We couldn&apos;t find this player on the OSRS hiscores. They may not exist,
          have changed their name, or haven&apos;t logged in recently.
        </p>

        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-sm text-stone-500 mb-4">
              Try searching for a different username:
            </p>
            <SearchForm placeholder="Enter username..." />
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/player">
              <Search className="h-4 w-4 mr-2" />
              Player Lookup
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}





