'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CommunityConfig } from '@citizenwallet/sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TransferWithMembersT } from '@/services/chain-db/transfers';
import { formatAddress } from '@/lib/utils';
import { CommunityLogo } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';

export const createColumns = (
  communityConfig: CommunityConfig
): ColumnDef<TransferWithMembersT>[] => [
  {
    header: 'ID',
    accessorKey: 'id',
    cell: ({ row }) => {
      const hash = row.original.hash;
      const hashFormatted = formatAddress(hash);

      return <span className="text-xs font-mono">{hashFormatted}</span>;
    },
    size: 120 // Fixed width for hash
  },
  {
    header: 'From',
    accessorKey: 'from_member',
    cell: ({ row }) => {
      const { image, username, name, account } = row.original.from_member;

      const isAnonymous = username?.includes('anonymous');
      const isZeroAddress =
        account === '0x0000000000000000000000000000000000000000';

      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={image} alt={username} />
            <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {isZeroAddress
                ? `@${communityConfig.primaryToken.symbol}`
                : `@${username}`}
            </span>
            {isAnonymous ? (
              <span className="text-xs font-mono">
                {isZeroAddress
                  ? communityConfig.community.name
                  : formatAddress(account)}
              </span>
            ) : (
              <span className="text-xs font-mono">{name}</span>
            )}
          </div>
        </div>
      );
    }
  },
  {
    header: 'To',
    accessorKey: 'to_member',
    cell: ({ row }) => {
      const { image, username, name, account } = row.original.to_member;

      const isAnonymous = username?.includes('anonymous');
      const isZeroAddress =
        account === '0x0000000000000000000000000000000000000000';

      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={image} alt={username} />
            <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {isZeroAddress
                ? `@${communityConfig.primaryToken.symbol}`
                : `@${username}`}
            </span>
            {isAnonymous ? (
              <span className="text-xs font-mono">
                {isZeroAddress
                  ? communityConfig.community.name
                  : formatAddress(account)}
              </span>
            ) : (
              <span className="text-xs font-mono">{name}</span>
            )}
          </div>
        </div>
      );
    }
  },
  {
    header: 'Value',
    accessorKey: 'value',
    cell: ({ row }) => {
      const value = row.original.value;

      return (
        <div className="flex items-center gap-1 min-w-[100px]">
          <span className="font-medium">{value}</span>
          <CommunityLogo
            logoUrl={communityConfig.community.logo}
            tokenSymbol={communityConfig.primaryToken.symbol}
            size={6}
          />
        </div>
      );
    }
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: ({ row }) => {
      const description = row.original.description;

      return <div className="min-w-[200px] line-clamp-2">{description}</div>;
    }
  },
  {
    header: 'Date',
    accessorKey: 'created_at',
    cell: ({ row }) => {
      const createdAt = new Date(row.original.created_at);

      return (
        <span className="text-muted-foreground text-sm whitespace-nowrap min-w-[150px]">
          {createdAt.toLocaleString()}
        </span>
      );
    }
  }
];

export const skeletonColumns: ColumnDef<TransferWithMembersT>[] = [
  {
    header: 'Hash',
    accessorKey: 'hash',
    cell: () => <Skeleton className="h-4 w-20" />,
    size: 120
  },
  {
    header: 'From',
    accessorKey: 'from_member',
    cell: () => (
      <div className="flex items-center gap-2 min-w-[200px]">
        <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    )
  },
  {
    header: 'To',
    accessorKey: 'to_member',
    cell: () => (
      <div className="flex items-center gap-2 min-w-[200px]">
        <Skeleton className="h-6 w-6 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    )
  },
  {
    header: 'Value',
    accessorKey: 'value',
    cell: () => (
      <div className="flex items-center gap-1 min-w-[100px]">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    )
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: () => (
      <div className="min-w-[200px]">
        <Skeleton className="h-4 w-full" />
      </div>
    )
  },
  {
    header: 'Created at',
    accessorKey: 'created_at',
    cell: () => <Skeleton className="h-4 w-32" />
  }
];
export const placeholderData: TransferWithMembersT[] = Array(5);
