'use client';

import Link from 'next/link';
import { Hammer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MintTokenProps {
  alias: string;
  theme?: string;
}

export default function MintToken({
  alias,
  theme = '#6B5CA4'
}: MintTokenProps) {
  return (
    <Link
      href={`/${alias}/token/mint`}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        `border border-[${theme}]/20 bg-[${theme}]/10 text-[${theme}] hover:bg-[${theme}]/20 dark:border-[${theme}]/40 dark:bg-[${theme}]/20 dark:text-[${theme}]/90 dark:hover:bg-[${theme}]/30`,
        'h-10 px-4 py-2',
        'gap-2'
      )}
    >
      <Hammer className="h-4 w-4" />
      <span className="hidden sm:inline">Mint</span>
    </Link>
  );
}
