'use client';

import { DataTable } from '@/components/ui/data-table';
import { AdminT, AdminCommunityAccessT } from '@/services/db/admin';
import { createColumns } from './columns';

interface AdminsClientTableProps {
  data: (AdminCommunityAccessT & { admin: AdminT })[];
}

export function AdminsClientTable({
  data,
}: AdminsClientTableProps) {
  const columns = createColumns();

  return <DataTable columns={columns} data={data} />;
}
