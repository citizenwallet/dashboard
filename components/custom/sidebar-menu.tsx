'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // Ensure you have a `cn` utility
import { buttonVariants } from '@/components/ui/button';

interface SidebarMenuItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export function SidebarMenuItem({ href, label, icon }: SidebarMenuItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'w-full justify-start px-4 rounded-md transition-colors',
        isActive ? 'bg-muted' : 'hover:bg-muted'
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Link>
  );
}
