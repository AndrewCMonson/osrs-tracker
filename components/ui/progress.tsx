'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showLabel = false, size = 'md', ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    };

    return (
      <div className={cn('relative w-full', className)} ref={ref} {...props}>
        <div
          className={cn(
            'overflow-hidden rounded-full bg-stone-800',
            sizeClasses[size]
          )}
        >
          <div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <span className="absolute right-0 -top-5 text-xs text-stone-400">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };


