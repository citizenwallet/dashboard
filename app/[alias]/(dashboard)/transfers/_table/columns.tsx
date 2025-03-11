'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CommunityConfig } from '@citizenwallet/sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TransferWithMembersT } from '@/services/db/transfers';
import {
  formatAddress,
  formatDate,
  formatERC20TransactionValue
} from '@/lib/utils';
import { CommunityLogo } from '@/components/icons';

export const createColumns = (
  communityConfig: CommunityConfig
): ColumnDef<TransferWithMembersT>[] => [
  {
    header: 'Hash',
    accessorKey: 'hash',
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
      const { image, username, account } = row.original.from_member;

      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={image} alt={username} />
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">@{username}</span>
            <span className="text-xs font-mono">{formatAddress(account)}</span>
          </div>
        </div>
      );
    }
  },
  {
    header: 'To',
    accessorKey: 'to_member',
    cell: ({ row }) => {
      const { image, username, account } = row.original.to_member;

      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={image} alt={username} />
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">@{username}</span>
            <span className="text-xs font-mono">{formatAddress(account)}</span>
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
      const formattedValue = formatERC20TransactionValue(
        communityConfig,
        value
      );

      return (
        <div className="flex items-center gap-1 min-w-[100px]">
          <span className="font-medium">{formattedValue}</span>
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
  }
];
