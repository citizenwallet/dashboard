'use client';

import * as React from 'react';
import { endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { DateRange } from 'react-day-picker';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export const DATE_PRESETS = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7days: 'Last 7 days',
  thisMonth: 'This month',
  lastMonth: 'Last month',
  custom: 'Custom range',
  all: 'All time'
} as const;

type Preset = keyof typeof DATE_PRESETS;

const getPresetDates = (preset: Preset): DateRange | undefined => {
  const today = new Date();

  const presetMap: Record<Preset, DateRange | undefined> = {
    today: { from: today, to: today },
    yesterday: { from: subDays(today, 1), to: subDays(today, 1) },
    last7days: { from: subDays(today, 6), to: today },
    thisMonth: { from: startOfMonth(today), to: today },
    lastMonth: {
      from: startOfMonth(subMonths(today, 1)),
      to: endOfMonth(subMonths(today, 1))
    },
    custom: undefined,
    all: undefined
  };

  return presetMap[preset];
};

const formatDateRange = (date: DateRange | undefined) => {
  if (!date?.from) return <span>Pick a date</span>;
  if (!date.to || date.from === date.to)
    return <span>{format(date.from, 'dd/MM/yyyy')}</span>;
  return (
    <span>
      {format(date.from, 'dd/MM/yyyy')} - {format(date.to, 'dd/MM/yyyy')}
    </span>
  );
};

export function DatePickerWithPresets() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: searchParams.get('from')
      ? new Date(searchParams.get('from') || '')
      : undefined,
    to: searchParams.get('to')
      ? new Date(searchParams.get('to') || '')
      : undefined
  });
  const [preset, setPreset] = React.useState<Preset>('all');
  const [isCustomRange, setIsCustomRange] = React.useState(false);

  const updateURLParams = (date: DateRange | undefined, newPreset: Preset) => {
    const params = new URLSearchParams(searchParams);

    if (date?.from) params.set('from', date.from.toISOString().split('T')[0]);
    if (date?.to) params.set('to', date.to.toISOString().split('T')[0]);
    if (newPreset === 'all') {
      params.delete('from');
      params.delete('to');
    }

    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePresetChange = (value: string) => {
    const newPreset = value as Preset;
    setPreset(newPreset);
    setIsCustomRange(newPreset === 'custom');

    const newDate = getPresetDates(newPreset);
    if (newPreset !== 'custom') setDate(newDate);
    updateURLParams(newPreset === 'custom' ? date : newDate, newPreset);
  };

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    updateURLParams(newDate, preset);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[300px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-auto flex-col space-y-2 p-2"
      >
        <Select onValueChange={handlePresetChange} value={preset}>
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent position="popper">
            {Object.entries(DATE_PRESETS).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isCustomRange && (
          <div className="rounded-md border">
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
