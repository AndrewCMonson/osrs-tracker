import Link from 'next/link';
import { Sword, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700">
                <Sword className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-stone-100">
                OSRS<span className="text-amber-500">Tracker</span>
              </span>
            </Link>
            <p className="text-sm text-stone-500 max-w-md">
              Track your Old School RuneScape progress, milestones, and achievements. 
              Claim your account and unlock detailed insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-stone-100 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/player" className="text-sm text-stone-500 hover:text-amber-400 transition-colors">
                  Player Lookup
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-stone-500 hover:text-amber-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-stone-500 hover:text-amber-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-stone-100 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://oldschool.runescape.wiki/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                >
                  OSRS Wiki
                </a>
              </li>
              <li>
                <a 
                  href="https://runelite.net/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                >
                  RuneLite
                </a>
              </li>
              <li>
                <a 
                  href="https://secure.runescape.com/m=hiscore_oldschool/overall" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
                >
                  Official Hiscores
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} OSRSTracker. Not affiliated with Jagex Ltd.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 hover:text-stone-400 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 hover:text-stone-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}









