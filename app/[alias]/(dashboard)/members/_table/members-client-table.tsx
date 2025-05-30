'use client';

import { DataTable } from '@/components/ui/data-table';
import { MemberT } from '@/services/chain-db/members';
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { createColumns } from './columns';

interface MembersClientTableProps {
  data: MemberT[];
  config: Config;
}

export function MembersClientTable({ data, config }: MembersClientTableProps) {
  const communityConfig = new CommunityConfig(config);

  const columns = createColumns(communityConfig, config);

  return <DataTable columns={columns} data={data} />;
}
