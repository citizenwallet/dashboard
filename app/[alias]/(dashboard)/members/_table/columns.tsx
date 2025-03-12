'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatAddress, formatDate } from '@/lib/utils';
import { MemberT } from '@/services/db/members';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';

export const columns: ColumnDef<MemberT>[] = [
  {
    header: 'Member',
    cell: ({ row }) => {
      const { image, username, account, name } = row.original;

      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={image} alt={username} />
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">@{username}</span>
            <span className="text-xs font-mono">{formatAddress(account)}</span>
          </div>
        </div>
      );
    }
  },
  {
    header: 'Name',
    accessorKey: 'name',
    size: 120
  },
  {
    header: 'Description',
    accessorKey: 'description',
    size: 120
  },
  {
    header: 'Created at',
    accessorKey: 'created_at',
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      const createdAtFormatted = formatDate(createdAt);

      return (
        <span className="text-muted-foreground text-sm whitespace-nowrap min-w-[150px]">
          {createdAtFormatted}
        </span>
      );
    }
  },
  {
    header: 'Updated at',
    accessorKey: 'updated_at',
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at;
      const updatedAtFormatted = formatDate(updatedAt);

      return (
        <span className="text-muted-foreground text-sm whitespace-nowrap min-w-[150px]">
          {updatedAtFormatted}
        </span>
      );
    }
  }
];

export const skeletonColumns: ColumnDef<any>[] = [
  {
    header: 'Member',
    cell: () => {
      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" /> {/* username */}
            <Skeleton className="h-3 w-32" /> {/* address */}
          </div>
        </div>
      );
    }
  },
  {
    header: 'Name',
    cell: () => <Skeleton className="h-4 w-24" />
  },
  {
    header: 'Description',
    cell: () => <Skeleton className="h-4 w-40" />
  },
  {
    header: 'Created at',
    cell: () => (
      <div className="min-w-[150px]">
        <Skeleton className="h-4 w-32" />
      </div>
    )
  },
  {
    header: 'Updated at',
    cell: () => (
      <div className="min-w-[150px]">
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }
];

export const placeholderData: MemberT[] = Array(5);
