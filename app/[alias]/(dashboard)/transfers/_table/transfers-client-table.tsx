'use client';

import { DataTable } from '@/components/ui/data-table';
import { Config, CommunityConfig } from '@citizenwallet/sdk';
import { TransferWithMembersT } from '@/services/db/transfers';
import { createColumns } from './columns';

interface TransferClientTableProps {
  data: TransferWithMembersT[];
  config: Config;
}

export function TransferClientTable({
  data,
  config
}: TransferClientTableProps) {
  const communityConfig = new CommunityConfig(config);

  const columns = createColumns(communityConfig);

  return <DataTable columns={columns} data={data} />;
}
