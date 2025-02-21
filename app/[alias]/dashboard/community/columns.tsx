'use client';

import { ColumnDef } from '@tanstack/react-table';

export interface ICommunity {
  alias: string;
  name: string;
  logo: string;
}

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export const columns: ColumnDef<ICommunity>[] = [
  {
    header: 'Alias',
    accessorKey: 'alias',
    cell: ({ row }) => {
      let username = row.original.alias;
      const profileUrl = `/${username}/dashboard/transactions`;

      return (
        <Link href={profileUrl} className="text-blue-500 hover:underline">
          {username}
        </Link>
      );
    },
  },
  {
    header: 'Name',
    accessorKey: 'name'
  },
  {
    header: 'Logo',
    accessorKey: 'logo',
    cell: ({ row }) => {
      const image = row.original.logo;
      const username = row.original.name;
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={image} alt={`avatar for ${username}`} />
          <AvatarFallback>{username}</AvatarFallback>
        </Avatar>
      );
    }
  },
];

export const skeletonColumns: ColumnDef<ICommunity>[] = [
  {
    header: 'Alias',
    accessorKey: 'alias',
    cell: () => (
      <div className="w-28 h-4 bg-gray-200 animate-pulse rounded-md" />
    )
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: () => (
      <div className="w-24 h-4 bg-gray-200 animate-pulse rounded-md" />
    )
  },
  {
    header: 'Logo',
    accessorKey: 'logo',
    cell: () => (
      <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
    )
  }

];