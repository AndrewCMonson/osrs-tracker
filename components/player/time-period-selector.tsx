'use client';

import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type TimePeriod = 'day' | 'week' | 'month' | 'year' | 'all' | 'custom';

export interface TimePeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
  customStartDate?: Date;
  customEndDate?: Date;
  onCustomDateChange?: (start: Date | undefined, end: Date | undefined) => void;
}

export function TimePeriodSelector({
  value,
  onChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
}: TimePeriodSelectorProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
    { value: 'all', label: 'All Time' },
    { value: 'custom', label: 'Custom' },
  ];

  const handlePeriodChange = (period: TimePeriod) => {
    onChange(period);
    if (period === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate && customStartDate <= customEndDate) {
      setShowCustomPicker(false);
    }
  };

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateFromInput = (value: string): Date | undefined => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        {periods.map((period) => (
          <Button
            key={period.value}
            variant={value === period.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePeriodChange(period.value)}
            className={cn(
              'text-xs',
              value === period.value && 'bg-amber-600 hover:bg-amber-500'
            )}
          >
            {period.label}
          </Button>
        ))}
      </div>

      {value === 'custom' && showCustomPicker && (
        <div className="flex items-center gap-2 p-3 bg-stone-800/50 rounded-lg border border-stone-700">
          <Calendar className="h-4 w-4 text-stone-400" />
          <div className="flex items-center gap-2 flex-1">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-stone-400">Start Date</label>
              <input
                type="date"
                value={formatDateForInput(customStartDate)}
                onChange={(e) => {
                  const date = parseDateFromInput(e.target.value);
                  onCustomDateChange?.(date, customEndDate);
                }}
                max={formatDateForInput(customEndDate || new Date())}
                className="px-2 py-1 text-sm bg-stone-900 border border-stone-700 rounded text-stone-200"
              />
            </div>
            <span className="text-stone-500 mt-5">to</span>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-stone-400">End Date</label>
              <input
                type="date"
                value={formatDateForInput(customEndDate)}
                onChange={(e) => {
                  const date = parseDateFromInput(e.target.value);
                  onCustomDateChange?.(customStartDate, date);
                }}
                min={formatDateForInput(customStartDate)}
                max={formatDateForInput(new Date())}
                className="px-2 py-1 text-sm bg-stone-900 border border-stone-700 rounded text-stone-200"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCustomDateSubmit}
              disabled={!customStartDate || !customEndDate || customStartDate > customEndDate}
              className="ml-2"
            >
              Apply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowCustomPicker(false);
                onCustomDateChange?.(undefined, undefined);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {value === 'custom' && !showCustomPicker && customStartDate && customEndDate && (
        <div className="text-xs text-stone-400">
          {customStartDate.toLocaleDateString()} - {customEndDate.toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

