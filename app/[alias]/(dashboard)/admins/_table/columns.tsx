'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  UserT,
  UserCommunityAccessT,
  CommunityAccessRoleT
} from '@/services/top-db/users';
import { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateColumnsProps {
  communityRole?: CommunityAccessRoleT;
  alias: string;
  onRemoveAdmin: (args: { userId: number }) => Promise<void>;
  isPending: boolean;
}

export const createColumns = (
  props: CreateColumnsProps
): ColumnDef<UserCommunityAccessT & { user: UserT }>[] => {
  const baseColumns: ColumnDef<UserCommunityAccessT & { user: UserT }>[] = [
    {
      header: 'Member',
      cell: ({ row }) => {
        const { user } = row.original;
        const { avatar, name, email } = user;
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
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <div className="inline-flex items-center w-[150px]">
            <span
              className={cn(
                'rounded-full font-medium flex items-center justify-center text-sm py-1 px-2.5 capitalize',
                {
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400':
                    role === 'owner',
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400':
                    role === 'member'
                }
              )}
            >
              {role}
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
    }
  ];

  const ownerColumns: ColumnDef<UserCommunityAccessT & { user: UserT }>[] = [
    {
      id: 'remove',
      cell: function RemoveCell({ row }) {
        const [isDialogOpen, setIsDialogOpen] = useState(false);

        const {
          user_id,
          user: { name }
        } = row.original;

        const handleOpenDialog = () => {
          setIsDialogOpen(true);
        };

        const handleCloseDialog = () => {
          setIsDialogOpen(false);
        };

        const onRemoveAdmin = async () => {
          try {
            await props.onRemoveAdmin({
              userId: user_id
            });
            handleCloseDialog();
            toast.success('Admin removed successfully');
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error('Could not remove admin');
            }
          }
        };

        return (
          <>
            <Button
              variant="destructive"
              disabled={props.isPending}
              size="icon"
              onClick={handleOpenDialog}
            >
              <Trash2 />
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Remove Admin</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove{' '}
                    <span className="font-bold">{name}</span> as an admin?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start gap-2">
                  <Button
                    disabled={props.isPending}
                    onClick={onRemoveAdmin}
                    type="button"
                    variant="destructive"
                  >
                    {props.isPending ? 'Removing...' : 'Remove'}
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={props.isPending}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );
      }
    }
  ];

  return props.communityRole === 'owner'
    ? [...baseColumns, ...ownerColumns]
    : baseColumns;
};

export const skeletonColumns: ColumnDef<
  UserCommunityAccessT & { admin: UserT }
>[] = [
  {
    header: 'Member',
    cell: () => (
      <div className="flex items-center gap-2 w-[250px]">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-24" /> {/* name */}
          <Skeleton className="h-3 w-32" /> {/* email */}
        </div>
      </div>
    )
  },
  {
    header: 'Created at',
    cell: () => (
      <div className="w-[150px]">
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }
];

export const placeholderData: (UserCommunityAccessT & { admin: UserT })[] =
  Array(5);
