'use client';

import Link from 'next/link';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BurnTokenProps {
  alias: string;
}

export default function BurnToken({ alias }: BurnTokenProps) {
  return (
    <Link
      href={`/${alias}/token/burn`}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-500 dark:hover:bg-red-950/50',
        'h-10 px-4 py-2',
        'gap-2'
      )}
    >
      <Flame className="h-4 w-4" />
      <span className="hidden sm:inline">Burn</span>
    </Link>
  );
}
