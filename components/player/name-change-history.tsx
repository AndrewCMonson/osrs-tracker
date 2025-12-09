'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, ArrowRight } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface NameChange {
  id: string;
  oldUsername: string;
  newUsername: string;
  createdAt: string;
}

interface NameChangeHistoryProps {
  username: string;
}

export function NameChangeHistory({ username }: NameChangeHistoryProps) {
  const [nameChanges, setNameChanges] = useState<NameChange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNameChanges = async () => {
      try {
        const response = await fetch(
          `/api/players/${encodeURIComponent(username)}/name-change/history`
        );
        if (response.ok) {
          const data = await response.json();
          setNameChanges(data.nameChanges || []);
        }
      } catch (error) {
        console.error('Error fetching name change history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNameChanges();
  }, [username]);

  if (loading) {
    return null;
  }

  if (nameChanges.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-amber-500" />
          Name Change History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {nameChanges.map((change) => (
            <div
              key={change.id}
              className="flex items-center justify-between p-3 rounded-lg bg-stone-800/50 border border-stone-700"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-stone-300 font-medium truncate">
                  {change.oldUsername}
                </span>
                <ArrowRight className="h-4 w-4 text-stone-500 flex-shrink-0" />
                <span className="text-amber-400 font-medium truncate">
                  {change.newUsername}
                </span>
              </div>
              <span className="text-xs text-stone-500 flex-shrink-0 ml-3">
                {formatRelativeTime(new Date(change.createdAt))}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}







