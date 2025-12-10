'use client';

import { Logo } from '@/components/layout/logo';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { normalizeUsername } from '@/lib/utils';
import { Loader2, LogIn, LogOut, Menu, Moon, Search, Sun, User, X } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

export function Header() {
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    setUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

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
          <Logo showText size="lg" />

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
            {status === 'authenticated' && session?.user ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                </Button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-stone-900 border border-stone-800 shadow-lg z-50">
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 rounded"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 rounded flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
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
              {status === 'authenticated' && session?.user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex-1 px-3 py-2 text-sm text-center text-stone-300 hover:bg-stone-800 rounded border border-stone-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex-1 px-3 py-2 text-sm text-center text-stone-300 hover:bg-stone-800 rounded border border-stone-700 flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

