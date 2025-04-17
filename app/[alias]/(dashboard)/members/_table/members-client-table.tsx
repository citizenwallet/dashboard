'use client';

import { DataTable } from '@/components/ui/data-table';
import { MemberT } from '@/services/chain-db/members';
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { createColumns } from './columns';
import { useRouter } from 'next/navigation';

interface MembersClientTableProps {
  data: MemberT[];
  config: Config;
}

export function MembersClientTable({ data, config }: MembersClientTableProps) {
  const router = useRouter();
  const communityConfig = new CommunityConfig(config);

  const columns = createColumns(communityConfig, config, router);

  return <DataTable columns={columns} data={data} />;
}
