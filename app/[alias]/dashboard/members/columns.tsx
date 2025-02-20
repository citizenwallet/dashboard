'use client';

import { ColumnDef } from '@tanstack/react-table';




export interface IMember {
  created_at: string;
  account: string;
  username: string;
  name: string;
  description: string;
  image: string;
  image_medium: string;
  image_small: string;
  token_id: string | null;
  updated_at: string;
}

import { ExternalLink } from 'lucide-react';
import { formatAddress } from '@/helpers/formatting';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export const columns: ColumnDef<IMember>[] = [

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
    header: 'Username',
    accessorKey: 'username',
    cell: ({ row }) => {
      let username = row.original.username;
      if (!username.startsWith("@")) {
        username = `@${username}`;
      }
      const profileUrl = `/profile/${username.replace("@", "")}`;

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
    header: "Creation Date",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      return <span>{formattedDate}</span>;
    },
  },
  {
    header: 'Updated At',
    accessorKey: 'updated_at',
    cell: ({ row }) => {
      const date = new Date(row.original.updated_at);
      const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      return <span>{formattedDate}</span>;
    }
  },
  {
    header: 'Description',
    accessorKey: 'description'
  },
  {
    header: 'Account Number',
    accessorKey: 'account'
  }
];

export const skeletonColumns: ColumnDef<IMember>[] = [
  {
    header: 'Image',
    accessorKey: 'image',
    cell: () => (
      <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-full" />
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
    header: 'Creation Date',
    accessorKey: 'creation_date',
    cell: () => (
      <div className="flex items-center gap-2">
        <div className="w-32 h-8 bg-gray-200 animate-pulse rounded-md" />
      </div>
    )
  },
  {
    header: 'Updated At',
    accessorKey: 'updated_at',
    cell: () => (
      <div className="w-24 h-4 bg-gray-200 animate-pulse rounded-md" />
    )
  },
  {
    header: 'Description',
    accessorKey: 'description',
    cell: () => (
      <div className="w-24 h-4 bg-gray-200 animate-pulse rounded-md" />
    )
  },
  {
    header: 'Account Number',
    accessorKey: 'account_number',
    cell: () => (
      <div className="w-24 h-4 bg-gray-200 animate-pulse rounded-md" />
    )
  }
];