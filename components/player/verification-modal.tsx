'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Copy, CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  verificationId: string;
  token: string;
  expiresAt: Date | string;
}

export function VerificationModal({
  isOpen,
  onClose,
  username,
  verificationId,
  token,
  expiresAt,
}: VerificationModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'expired'>('pending');
  const [isPolling, setIsPolling] = useState(false);

  // Calculate time remaining
  useEffect(() => {
    if (!isOpen) return;

    const updateTimeRemaining = () => {
      const expires = new Date(expiresAt);
      const now = new Date();
      const diff = expires.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
        setVerificationStatus('expired');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [isOpen, expiresAt]);

  // Poll for verification status
  useEffect(() => {
    if (!isOpen || verificationStatus !== 'pending') return;

    let pollInterval: NodeJS.Timeout;

    const pollVerificationStatus = async () => {
      try {
        const response = await fetch(`/api/verify/status?verificationId=${verificationId}`);
        const data = await response.json();

        if (data.success && data.verification) {
          if (data.verification.status === 'verified') {
            setVerificationStatus('verified');
            setIsPolling(false);
            // Refresh the page after a short delay to show the verified badge
            setTimeout(() => {
              router.refresh();
              onClose();
            }, 1500);
          } else if (data.verification.status === 'expired' || data.verification.status === 'failed') {
            setVerificationStatus('expired');
            setIsPolling(false);
          }
        }
      } catch (error) {
        console.error('Error polling verification status:', error);
      }
    };

    // Start polling after 2 seconds (give plugin time to complete)
    const startPolling = setTimeout(() => {
      setIsPolling(true);
      pollInterval = setInterval(pollVerificationStatus, 3000); // Poll every 3 seconds
    }, 2000);

    return () => {
      clearTimeout(startPolling);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isOpen, verificationStatus, verificationId, router, onClose]);

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-stone-900 border border-stone-700 rounded-xl shadow-2xl slide-in-from-bottom-2"
        role="dialog"
        aria-modal="true"
        aria-labelledby="verification-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-800">
          <div>
            <h2
              id="verification-modal-title"
              className="text-xl font-bold text-stone-100"
            >
              Verify Account Ownership
            </h2>
            <p className="text-sm text-stone-400 mt-1">
              Verify ownership of <span className="text-amber-500 font-semibold">{username}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {verificationStatus === 'verified' ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-100 mb-2">Verification Successful!</h3>
              <p className="text-stone-400">
                Your account has been verified. You now have full access to tracking features.
              </p>
            </div>
          ) : verificationStatus === 'expired' ? (
            <div className="text-center py-8">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-100 mb-2">Verification Expired</h3>
              <p className="text-stone-400 mb-4">
                The verification token has expired. Please start a new verification process.
              </p>
              <Button onClick={onClose}>Close</Button>
            </div>
          ) : (
            <>
              {/* Instructions */}
              <div className="bg-stone-800/50 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-stone-200 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-stone-300">
                  <li>Install the &quot;OSRS Tracker&quot; plugin from the RuneLite Plugin Hub</li>
                  <li>Log into the game on your <span className="text-amber-500 font-semibold">{username}</span> account</li>
                  <li>Open the plugin panel and enter the verification token below</li>
                  <li>Click &quot;Verify Account&quot; in the plugin to complete verification</li>
                </ol>
              </div>

              {/* Token Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-300">
                  Verification Token
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-stone-800 border border-stone-700 rounded-lg px-4 py-3">
                    <code className="text-2xl font-mono font-bold text-amber-500 tracking-wider">
                      {token}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyToken}
                    className="h-11 w-11"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-emerald-500">Copied to clipboard!</p>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {isPolling ? (
                    <>
                      <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
                      <span className="text-stone-400">Waiting for verification...</span>
                    </>
                  ) : (
                    <span className="text-stone-500">Ready to verify</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-stone-500">
                  <Clock className="h-4 w-4" />
                  <span>Expires in: {timeRemaining}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {verificationStatus === 'pending' && (
          <div className="p-6 border-t border-stone-800 bg-stone-800/30 rounded-b-xl">
            <p className="text-xs text-stone-500 text-center">
              Don&apos;t have the plugin? Install it from the RuneLite Plugin Hub. This window will automatically close once verification is complete.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}





