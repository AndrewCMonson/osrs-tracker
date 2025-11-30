'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { normalizeUsername } from '@/lib/utils';

interface SearchFormProps {
  size?: 'default' | 'lg';
  placeholder?: string;
  className?: string;
}

export function SearchForm({ 
  size = 'default', 
  placeholder = 'Enter username...',
  className 
}: SearchFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    const normalized = normalizeUsername(username);
    router.push(`/player/${encodeURIComponent(normalized)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className={`flex gap-2 ${size === 'lg' ? 'flex-col sm:flex-row' : ''}`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 ${size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`} />
          <Input
            type="text"
            placeholder={placeholder}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`${size === 'lg' ? 'h-14 pl-12 text-lg' : 'pl-10'}`}
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          size={size === 'lg' ? 'lg' : 'default'}
          disabled={isLoading || !username.trim()}
          className={size === 'lg' ? 'h-14 px-8' : ''}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Lookup
            </>
          )}
        </Button>
      </div>
    </form>
  );
}


