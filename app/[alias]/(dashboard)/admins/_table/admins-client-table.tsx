'use client';

import { DataTable } from '@/components/ui/data-table';
import {
  UserT,
  UserCommunityAccessT,
  CommunityAccessRoleT
} from '@/services/top-db/users';

import { createColumns } from './columns';
import { useOptimistic, useTransition } from 'react';
import { removeUserFromCommunityAction } from '@/app/[alias]/(dashboard)/admins/action';

interface AdminsClientTableProps {
  data: (UserCommunityAccessT & { user: UserT })[];
  communityRole?: CommunityAccessRoleT;
  alias: string;
}

export function AdminsClientTable({
  data,
  alias,
  communityRole
}: AdminsClientTableProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticAdmins, addOptimisticRemoval] = useOptimistic(
    data,
    (state, adminIdToRemove: number) =>
      state.filter((admin) => admin.user_id !== adminIdToRemove)
  );

  const handleRemoveAdmin = async (args: {
    userId: number;
  }) => {
    const { userId } = args;

    startTransition(async () => {
      // Optimistically remove the admin from the UI
      addOptimisticRemoval(userId);

      try {
        await removeUserFromCommunityAction({
          userIdToRemove: userId,
          alias: alias
        });
      } catch (error) {
        // If the removal fails, the state will automatically revert
        console.error('Failed to remove admin:', error);
      }
    });
  };

  const columns = createColumns({
    communityRole: communityRole,
    alias: alias,
    onRemoveAdmin: handleRemoveAdmin,
    isPending: isPending
  });

  return <DataTable columns={columns} data={optimisticAdmins} />;
}
