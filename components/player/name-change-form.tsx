'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserCog, Loader2, CheckCircle2, XCircle, X } from 'lucide-react';

interface NameChangeFormProps {
  username: string;
}

export function NameChangeForm({ username }: NameChangeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleValidate = async () => {
    if (!newUsername.trim()) {
      setValidationError('Please enter a username');
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const response = await fetch(
        `/api/players/${encodeURIComponent(username)}/name-change?newUsername=${encodeURIComponent(newUsername)}`
      );
      const data = await response.json();

      if (!data.valid) {
        setValidationError(data.error || 'Invalid name change');
      } else {
        setValidationError(null);
      }
    } catch (error) {
      console.error('Error validating name change:', error);
      setValidationError('Failed to validate name change');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      setSubmitError('Please enter a username');
      return;
    }

    if (validationError) {
      setSubmitError('Please fix validation errors first');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch(
        `/api/players/${encodeURIComponent(username)}/name-change`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newUsername }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        setNewUsername('');
        // Close dialog after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
          setSubmitSuccess(false);
          // Refresh the page to show updated data
          window.location.reload();
        }, 2000);
      } else {
        setSubmitError(data.error || 'Failed to submit name change');
      }
    } catch (error) {
      console.error('Error submitting name change:', error);
      setSubmitError('Failed to submit name change');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setNewUsername('');
    setValidationError(null);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <UserCog className="h-4 w-4 mr-2" />
        Report Name Change
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-0">
          <div
            ref={modalRef}
            className="relative w-full max-w-md bg-stone-900 border border-stone-700 rounded-xl shadow-2xl slide-in-from-bottom-2"
            role="dialog"
            aria-modal="true"
            aria-labelledby="name-change-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-stone-800">
              <h2 id="name-change-title" className="text-lg font-bold text-stone-100">
                Report Name Change
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <p className="text-sm text-stone-400 mb-4">
                If you've changed your in-game name, submit the change here to keep your stats
                tracked across name changes.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="oldUsername" className="text-sm font-medium text-stone-300">
                    Current Username
                  </label>
                  <Input
                    id="oldUsername"
                    value={username}
                    disabled
                    className="bg-stone-800"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="newUsername" className="text-sm font-medium text-stone-300">
                    New Username
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="newUsername"
                      value={newUsername}
                      onChange={(e) => {
                        setNewUsername(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="Enter your new username"
                      disabled={isSubmitting || submitSuccess}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleValidate}
                      disabled={isValidating || !newUsername.trim() || isSubmitting || submitSuccess}
                    >
                      {isValidating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Validate'
                      )}
                    </Button>
                  </div>
                  {validationError && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {validationError}
                    </p>
                  )}
                  {!validationError && newUsername.trim() && !isValidating && (
                    <p className="text-sm text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Username is valid
                    </p>
                  )}
                </div>
                {submitError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    {submitError}
                  </p>
                )}
                {submitSuccess && (
                  <p className="text-sm text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Name change submitted successfully! Redirecting...
                  </p>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !!validationError || !newUsername.trim() || submitSuccess}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Name Change'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

