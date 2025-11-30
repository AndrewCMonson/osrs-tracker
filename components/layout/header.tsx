'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sword, LogIn, Menu, X, Search, Loader2, Sun, Moon } from 'lucide-react';
import { normalizeUsername } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/theme-provider';
import { useState, FormEvent } from 'react';

export function Header() {
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const normalized = normalizeUsername(searchQuery);
    router.push(`/player/${encodeURIComponent(normalized)}`);
    setSearchQuery('');
    setMobileMenuOpen(false);
    // Reset loading state after navigation starts
    setTimeout(() => setIsSearching(false), 500);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-800 bg-stone-950/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-shadow">
              <Sword className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-stone-100 hidden lg:block">
              OSRS<span className="text-amber-500">Tracker</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
              <Input
                type="text"
                placeholder="Search player..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-9 bg-stone-900/50 border-stone-700 focus:border-amber-500"
                disabled={isSearching}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 animate-spin" />
              )}
            </div>
          </form>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-9 w-9 p-0"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-stone-400 hover:text-stone-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-800">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                <Input
                  type="text"
                  placeholder="Search player..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-stone-900/50 border-stone-700"
                  disabled={isSearching}
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 animate-spin" />
                )}
              </div>
            </form>

            <div className="flex items-center gap-2 px-4">
              {mounted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-9 w-9 p-0 flex-shrink-0"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

