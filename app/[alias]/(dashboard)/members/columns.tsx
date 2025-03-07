'use client';

import { ColumnDef } from '@tanstack/react-table';
export interface AProfile {
  account: string;
  username: string;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
}
import { ExternalLink } from 'lucide-react';
import { formatAddress } from '@/helpers/formatting';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const columns: ColumnDef<AProfile>[] = [
  {
    header: 'Account',
    accessorKey: 'account',
    cell: ({ row }) => {
      const address = formatAddress(row.original.account);

      return (
        <div className="flex items-center gap-2">
          <Link
            href="#"
            target="_self"
            className="flex items-center gap-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
          >
            <span className="text-sm font-medium">{address}</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      );
    }
  },
  {
    header: 'Username',
    accessorKey: 'username'
  },
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'Image',
    accessorKey: 'image',
    cell: ({ row }) => {
      const image = row.original.image;
      const username = row.original.username;
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={image} alt={`avatar for ${username}`} />
          <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
      );
    }
  },
  {
    header: 'Created At',
    accessorKey: 'created_at'
  },
  {
    header: 'Updated At',
    accessorKey: 'updated_at'
  }
];





export const skeletonColumns: ColumnDef<AProfile>[] = [
  {
    header: 'Account',
    accessorKey: 'account',
    cell: () => (
      <div className="flex items-center gap-2">
        <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-md" />
      </div>
    )
  },
  {
    header: 'Username',
    accessorKey: 'username',
    cell: () => (
      <div className="w-24 h-4 bg-gray-200 animate-pulse rounded-md" />
    )
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: () => (
      <div className="w-28 h-4 bg-gray-200 animate-pulse rounded-md" />
    )
  },
  {
    header: 'Image',
    accessorKey: 'image',
    cell: () => (
      <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
    )
  },
  {
    header: 'Created At',
    accessorKey: 'created_at',
    cell: () => (
      <div className="w-24 h-4 bg-gray-200 animate-pulse rounded-md" />
    )
  },
  {
    header: 'Updated At',
    accessorKey: 'updated_at',
    cell: () => (
      <div className="w-24 h-4 bg-gray-200 animate-pulse rounded-md" />
    )
  }
];