'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAddress } from '@/lib/utils';
import { MemberT } from '@/services/chain-db/members';
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { ColumnDef } from '@tanstack/react-table';
import { ethers } from 'ethers';
import { Check, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import ActionColumn from './action-column';
import HasRoleColumn from './has-role-column';

const IDRow = ({ account }: { account: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="w-[120px] truncate">
      <div
        className="flex items-center gap-1 cursor-pointer hover:bg-muted rounded-md p-1"
        onClick={copyToClipboard}
      >
        <span className="text-xs font-mono truncate">
          {formatAddress(account)}
        </span>
        {isCopied ? (
          <Check className="ml-1 h-3 w-3" />
        ) : (
          <Copy className="ml-1 h-3 w-3" />
        )}
      </div>
    </div>
  );
};

export const createColumns = (
  communityConfig: CommunityConfig,
  config: Config,
  hasProfileAdminRole: boolean
): ColumnDef<MemberT>[] => {
  // Create base columns that are always included
  const baseColumns: ColumnDef<MemberT>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: ({ row }) => <IDRow account={row.original.account} />
    },
    {
      header: 'Member',
      cell: ({ row }) => {
        const { image, username, name, account } = row.original;

        const isAnonymous = username?.includes('anonymous');
        const isZeroAddress = ethers.ZeroAddress === account;

        const colour = communityConfig.community.theme?.primary || '#6B5CA4';

        const style = {
          backgroundColor: `${colour}1A`, // 10% opacity
          borderColor: `${colour}33`, // 20% opacity
          color: colour
        };

        return (
          <Link
            href={`members/${account}/edit`}
            style={style}
            className={`block hover:bg-opacity-10 rounded-lg transition-colors`}
          >
            <div className="flex items-center gap-2 w-[250px] p-2">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={image} alt={username} />
                <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate">
                  {isAnonymous
                    ? isZeroAddress
                      ? communityConfig.community.name
                      : `@${username}`
                    : `@${username}`}
                </span>
                <span className="text-xs font-mono truncate">
                  {isAnonymous
                    ? isZeroAddress
                      ? communityConfig.community.name
                      : formatAddress(account)
                    : name}
                </span>
              </div>
            </div>
          </Link>
        );
      }
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="w-[150px] truncate">{row.original.name}</div>
      )
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) => (
        <div className="min-w-[200px] max-w-[400px] px-4">
          <p className="line-clamp-2 text-sm">{row.original.description}</p>
        </div>
      )
    },
    {
      header: 'Has mint role access?',
      cell: ({ row }) => (
        <HasRoleColumn row={row} communityConfig={communityConfig} />
      )
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
    },
    {
      header: 'Updated at',
      accessorKey: 'updated_at',
      cell: ({ row }) => {
        const updatedAt = new Date(row.original.updated_at);

        return (
          <div className="w-[150px]">
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              {updatedAt.toLocaleString()}
            </span>
          </div>
        );
      }
    }
  ];

  // Only add the Actions column if hasProfileAdminRole is truthy
  if (hasProfileAdminRole) {
    baseColumns.push({
      header: 'Actions',
      cell: ({ row }) => (
        <ActionColumn
          row={row}
          config={config}
          hasProfileAdminRole={hasProfileAdminRole}
        />
      )
    });
  }

  return baseColumns;
};

export const skeletonColumns: ColumnDef<MemberT>[] = [
  {
    header: 'Member',
    cell: () => (
      <div className="flex items-center gap-2 w-[250px]">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    )
  },
  {
    header: 'Name',
    cell: () => (
      <div className="w-[150px]">
        <Skeleton className="h-4 w-24" />
      </div>
    )
  },
  {
    header: 'Description',
    cell: () => (
      <div className="min-w-[200px] max-w-[400px] px-4">
        <Skeleton className="h-8 w-full" />
      </div>
    )
  },
  {
    header: 'Has mint role access?',
    cell: () => (
      <div className="min-w-[150px]">
        <Skeleton className="h-4 w-16" />
      </div>
    )
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
  },
  {
    header: 'Actions',
    cell: () => (
      <div className="min-w-[150px]">
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }
];

export const placeholderData: MemberT[] = Array(5);
