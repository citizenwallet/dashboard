'use client';

import { DataTable } from '@/components/ui/data-table';
import { Config, CommunityConfig } from '@citizenwallet/sdk';
import { MemberT } from '@/services/chain-db/members';
import { createColumns } from './columns';

interface MembersClientTableProps {
  data: MemberT[];
  config: Config;
}

export function MembersClientTable({ data, config }: MembersClientTableProps) {
  const communityConfig = new CommunityConfig(config);

  const columns = createColumns(communityConfig);

  return <DataTable columns={columns} data={data} />;
}
