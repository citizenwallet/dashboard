'use client';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { AdminT } from '@/services/db/admin';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchCommunitiesOfChainAction } from '@/app/_actions/community-actions';
import { Config } from '@citizenwallet/sdk';

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
    header: 'Access list',
    cell: ({ row }) => {
      const { community_access_list } = row.original;
      const [isPending, setIsPending] = useState(true);
      const [communities, setCommunities] = useState<Config[]>([]);

      useEffect(() => {
        const checkMintRole = async () => {
          try {
            setIsPending(true);
            const result = await fetchCommunitiesOfChainAction({
              chainId: 42220,
              accessList: community_access_list
            });
            setCommunities(result.communities);
          } catch (error) {
            console.error('Error getting communities:', error);
          } finally {
            setIsPending(false);
          }
        };

        checkMintRole();
      }, [community_access_list]);

      return (
        <div className="grid grid-cols-3 gap-4 w-[200px]">
          {communities.map((community) => {

            const {alias, name, logo} = community.community

            
            return (
              <div className="col-span-1" key={alias}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={logo} alt={`logo for ${name}`} />
                  <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </div>
            );
          })}
        </div>
      );
    }
  },
  {
    header: 'Created at',
    accessorKey: 'created_at',
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      const createdAtFormatted = formatDate(createdAt);

      return (
        <div className="w-[150px]">
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            {createdAtFormatted}
          </span>
        </div>
      );
    }
  },
];

export const skeletonColumns: ColumnDef<AdminT>[] = [
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

export const placeholderData: AdminT[] = Array(5);
