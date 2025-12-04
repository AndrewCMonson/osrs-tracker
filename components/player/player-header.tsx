'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Player, ACCOUNT_TYPE_DISPLAY } from '@/types/player';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime, formatUsername } from '@/lib/utils';
import { getAccountTypeIcon } from '@/lib/images';
import { RefreshCw, Shield, UserCheck, Swords, Save } from 'lucide-react';
import { NameChangeForm } from './name-change-form';
import { VerificationModal } from './verification-modal';

interface PlayerHeaderProps {
  player: Player;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function PlayerHeader({ player, onRefresh, isRefreshing }: PlayerHeaderProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSavingSnapshot, setIsSavingSnapshot] = useState(false);
  const [snapshotMessage, setSnapshotMessage] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isStartingVerification, setIsStartingVerification] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    verificationId: string;
    token: string;
    expiresAt: Date;
  } | null>(null);

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

  const handleClaimAccount = async () => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/player/${encodeURIComponent(player.username)}`)}`);
      return;
    }

    if (status === 'loading') {
      return; // Still checking authentication
    }

    setIsStartingVerification(true);
    try {
      const response = await fetch('/api/verify/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: player.username,
        }),
      });

      const data = await response.json();

      if (data.success && data.verification) {
        setVerificationData({
          verificationId: data.verification.id,
          token: data.verification.token,
          expiresAt: new Date(data.verification.expiresAt),
        });
        setIsVerificationModalOpen(true);
      } else {
        setSnapshotMessage(data.error || 'Failed to start verification');
        setTimeout(() => setSnapshotMessage(null), 5000);
      }
    } catch (error) {
      console.error('Error starting verification:', error);
      setSnapshotMessage('Failed to start verification. Please try again.');
      setTimeout(() => setSnapshotMessage(null), 5000);
    } finally {
      setIsStartingVerification(false);
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
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveSnapshot}
            disabled={isSavingSnapshot}
          >
            <Save
              className={`h-4 w-4 mr-2 ${isSavingSnapshot ? 'animate-spin' : ''}`}
            />
            Update
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
          <NameChangeForm username={player.username} />
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
          <Button 
            size="sm"
            onClick={handleClaimAccount}
            disabled={isStartingVerification || status === 'loading'}
          >
            {isStartingVerification ? 'Starting...' : 'Claim Account'}
          </Button>
        )}
      </div>

      {/* Verification Modal */}
      {verificationData && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => {
            setIsVerificationModalOpen(false);
            setVerificationData(null);
          }}
          username={player.displayName || player.username}
          verificationId={verificationData.verificationId}
          token={verificationData.token}
          expiresAt={verificationData.expiresAt}
        />
      )}
    </div>
  );
}

