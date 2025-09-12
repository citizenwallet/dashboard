'use client';

import { DataTable } from '@/components/ui/data-table';
import { TransferWithMembersResponseT } from '@/services/chain-db/transfers';
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { createColumns } from './columns';

interface TransferClientTableProps {
  data: TransferWithMembersResponseT[];
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
