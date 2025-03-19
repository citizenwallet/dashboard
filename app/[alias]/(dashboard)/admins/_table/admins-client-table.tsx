'use client';

import { DataTable } from '@/components/ui/data-table';
import { AdminT, AdminCommunityAccessT, AdminRoleT } from '@/services/db/admin';
import { createColumns } from './columns';
import { useOptimistic, useTransition } from 'react';
import { removeAdminFromCommunityAction } from '@/app/[alias]/(dashboard)/admins/action';

interface AdminsClientTableProps {
  data: (AdminCommunityAccessT & { admin: AdminT })[];
  adminRole?: AdminRoleT;
  alias: string;
  chainId: number;
}

export function AdminsClientTable({
  data,
  alias,
  adminRole,
  chainId
}: AdminsClientTableProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticAdmins, addOptimisticRemoval] = useOptimistic(
    data,
    (state, adminIdToRemove: number) =>
      state.filter((admin) => admin.admin_id !== adminIdToRemove)
  );

  const handleRemoveAdmin = async (adminId: number) => {
    startTransition(async () => {
      // Optimistically remove the admin from the UI
      addOptimisticRemoval(adminId);

      try {
        await removeAdminFromCommunityAction({
          adminIdToRemove: adminId,
          alias: alias,
          chainId: chainId
        });
      } catch (error) {
        // If the removal fails, the state will automatically revert
        console.error('Failed to remove admin:', error);
      }
    });
  };

  const columns = createColumns({
    adminRole: adminRole,
    alias: alias,
    onRemoveAdmin: handleRemoveAdmin,
    isPending: isPending
  });

  return <DataTable columns={columns} data={optimisticAdmins} />;
}
