'use client';

import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddAdminProps {
  alias: string;
}

export default function AddAdmin({ alias }: AddAdminProps) {
  return (
    <Link
      href={`/${alias}/admins/add`}
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'h-10 px-4 py-2',
        'gap-2'
      )}
    >
      <UserPlus className="h-4 w-4" />
      <span className="hidden sm:inline">Add Admin</span>
    </Link>
  );
}
