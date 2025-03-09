'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Config } from '@citizenwallet/sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export const columns: ColumnDef<Config>[] = [
  {
    header: 'Logo',
    accessorKey: 'community.logo',
    cell: ({ row }) => {
      const logo = row.original.community.logo;
      const name = row.original.community.name;
      return (
        <div className="min-w-[50px]">
          <Avatar className="h-10 w-10">
            <AvatarImage src={logo} alt={`logo for ${name}`} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </div>
      );
    }
  },
  {
    header: 'Name',
    accessorKey: 'community.name',
    cell: ({ row }) => {
      const name = row.original.community.name;
      return <div className="min-w-[200px]">{name}</div>;
    }
  },
  {
    header: 'Description',
    accessorKey: 'community.description',
    cell: ({ row }) => {
      const description = row.original.community.description;
      return <div className="min-w-[300px] max-w-[500px]">{description}</div>;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/alias/${row.original.community.alias}`}
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md border border-blue-200 transition-colors"
          >
            View
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      );
    }
  }
];

export const skeletonColumns: ColumnDef<Config>[] = [
  {
    header: 'Logo',
    accessorKey: 'communitylogo',
    cell: () => <Skeleton className="h-10 w-10 rounded-full" />
  },
  {
    header: 'Name',
    accessorKey: 'community.name',
    cell: () => <Skeleton className="h-4 w-full" />
  },
  {
    header: 'Description',
    accessorKey: 'community.description',
    cell: () => <Skeleton className="h-4 w-full" />
  }
];

export const placeholderData: Config[] = Array(5);

