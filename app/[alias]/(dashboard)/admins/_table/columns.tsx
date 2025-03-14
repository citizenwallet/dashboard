'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminT } from '@/services/db/admin';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';

export const createColumns = (): ColumnDef<AdminT>[] => [
  {
    header: 'Member',
    cell: ({ row }) => {
      const { avatar, name, email } = row.original;

      return (
        <div className="flex items-center gap-2 w-[250px]">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={avatar ?? ''} alt={name ?? ''} />
            <AvatarFallback>{name?.slice(0, 2) ?? ''}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-medium truncate">{name}</span>
            <span className="text-xs font-mono truncate">{email}</span>
          </div>
        </div>
      );
    }
  },
  {
    header: 'Created at',
    accessorKey: 'created_at',
    cell: ({ row }) => {
      const createdAt = new Date(row.original.created_at);

      return (
        <div className="w-[150px]">
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            {createdAt.toLocaleString()}
          </span>
        </div>
      );
    }
  }
];

export const skeletonColumns: ColumnDef<AdminT>[] = [
  {
    header: 'Member',
    cell: () => (
      <div className="flex items-center gap-2 w-[250px]">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-24" /> {/* name */}
          <Skeleton className="h-3 w-32" /> {/* email */}
        </div>
      </div>
    )
  },
  {
    header: 'Created at',
    cell: () => (
      <div className="w-[150px]">
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }
];

export const placeholderData: AdminT[] = Array(5);
