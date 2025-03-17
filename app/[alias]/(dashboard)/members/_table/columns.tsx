'use client';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, formatAddress, formatDate } from '@/lib/utils';
import { MemberT } from '@/services/db/members';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MINTER_ROLE,
  hasRole as CWCheckRoleAccess,
  CommunityConfig
} from '@citizenwallet/sdk';
import { JsonRpcProvider } from 'ethers';
import { X } from 'lucide-react';
import { Check } from 'lucide-react';

export const createColumns = (
  communityConfig: CommunityConfig
): ColumnDef<MemberT>[] => [
  {
    header: 'Member',
    cell: ({ row }) => {
      const { image, username, name, account } = row.original;

      const isAnonymous = username?.includes('anonymous');
      const isZeroAddress =
        account === '0x0000000000000000000000000000000000000000';

      return (
        <div className="flex items-center gap-2 w-[250px]">
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
    cell: ({ row }) => {
      const [hasMintRole, setHasMintRole] = useState<boolean | null>(null);
      const [isPending, setIsPending] = useState(true);
      const account = row.original.account;
      const tokenAddress = communityConfig.primaryToken.address;
      const primaryRpcUrl = communityConfig.primaryRPCUrl;
      const rpc = new JsonRpcProvider(primaryRpcUrl);

      useEffect(() => {
        const checkMintRole = async () => {
          try {
            setIsPending(true);
            const hasRole = await CWCheckRoleAccess(
              tokenAddress,
              MINTER_ROLE,
              account,
              rpc
            );
            setHasMintRole(hasRole);
          } catch (error) {
            console.error('Error checking mint role:', error);
            setHasMintRole(false);
          } finally {
            setIsPending(false);
          }
        };

        checkMintRole();
      }, [account, communityConfig]);

      if (isPending) {
        return <Skeleton className="h-4 w-24" />;
      }

      return (
        <div className="inline-flex items-center w-[150px]">
          <span
            className={cn(
              'rounded-full font-medium flex items-center justify-center text-sm py-1 px-2.5',
              hasMintRole
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            )}
          >
            {hasMintRole ? (
              <>
                <Check className="mr-1 h-3 w-3" />
                Yes
              </>
            ) : (
              <>
                <X className="mr-1 h-3 w-3" />
                No
              </>
            )}
          </span>
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
  }
];

export const placeholderData: MemberT[] = Array(5);
