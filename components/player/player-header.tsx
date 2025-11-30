'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Player, ACCOUNT_TYPE_DISPLAY } from '@/types/player';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime, formatUsername } from '@/lib/utils';
import { getAccountTypeIcon } from '@/lib/images';
import { RefreshCw, Shield, UserCheck, Swords, Save } from 'lucide-react';

interface PlayerHeaderProps {
  player: Player;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function PlayerHeader({ player, onRefresh, isRefreshing }: PlayerHeaderProps) {
  const router = useRouter();
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);
  const [snapshotMessage, setSnapshotMessage] = useState<string | null>(null);

  const accountTypeBadgeVariant = (): 'default' | 'ironman' | 'hardcore' | 'ultimate' => {
    if (player.accountType.includes('hardcore')) return 'hardcore';
    if (player.accountType.includes('ultimate')) return 'ultimate';
    if (player.accountType.includes('ironman')) return 'ironman';
    return 'default';
  };

  const accountIcon = getAccountTypeIcon(player.accountType);

  const handleSaveSnapshot = async () => {
    setIsSavingSnapshot(true);
    setSnapshotMessage(null);

    try {
      const response = await fetch(`/api/players/${encodeURIComponent(player.username)}/snapshot`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSnapshotMessage('Snapshot saved successfully!');
        // Refresh the page to show updated data
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setSnapshotMessage(data.error || 'Failed to save snapshot');
      }
    } catch (error) {
      console.error('Error saving snapshot:', error);
      setSnapshotMessage('Failed to save snapshot');
    } finally {
      setIsSavingSnapshot(false);
      // Clear message after 3 seconds
      setTimeout(() => setSnapshotMessage(null), 3000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-gradient-to-br from-stone-900 to-stone-900/50 border border-stone-800">
      <div className="flex items-center gap-4">
        {/* Avatar placeholder */}
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/30">
          <span className="text-2xl font-bold text-white">
            {player.displayName.charAt(0).toUpperCase()}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-stone-100">
              {formatUsername(player.displayName)}
            </h1>
            {accountIcon && (
              <Image
                src={accountIcon}
                alt={ACCOUNT_TYPE_DISPLAY[player.accountType]}
                width={16}
                height={16}
                className="inline-block"
                unoptimized
              />
            )}
            {player.claimedBy && (
              <Badge variant="success" className="gap-1">
                <UserCheck className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <Badge variant={accountTypeBadgeVariant()} className="gap-1">
              {accountIcon && (
                <Image
                  src={accountIcon}
                  alt=""
                  width={12}
                  height={12}
                  className="inline-block"
                  unoptimized
                />
              )}
              {ACCOUNT_TYPE_DISPLAY[player.accountType]}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-stone-400">
              <Swords className="h-4 w-4" />
              Combat {player.combatLevel}
            </span>
            <span className="flex items-center gap-1 text-sm text-stone-400">
              <Shield className="h-4 w-4" />
              Total {player.totalLevel.toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-stone-500 mt-2">
            Last updated {formatRelativeTime(player.lastUpdated)}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSnapshot}
            disabled={isSavingSnapshot}
          >
            <Save
              className={`h-4 w-4 mr-2 ${isSavingSnapshot ? 'animate-spin' : ''}`}
            />
            Save Snapshot
          </Button>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          )}
        </div>
        {snapshotMessage && (
          <p className={`text-xs ${
            snapshotMessage.includes('successfully') 
              ? 'text-emerald-500' 
              : 'text-red-500'
          }`}>
            {snapshotMessage}
          </p>
        )}
        {!player.claimedBy && (
          <Button size="sm">
            Claim Account
          </Button>
        )}
      </div>
    </div>
  );
}

