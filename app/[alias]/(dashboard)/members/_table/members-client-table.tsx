'use client';

import { DataTable } from '@/components/ui/data-table';
import { MemberT } from '@/services/chain-db/members';
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { useSession } from 'state/session/action';
import { createColumns } from './columns';

interface MembersClientTableProps {
  data: MemberT[];
  config: Config;
  roleInCommunity: string | null;
  signerAccountAddress: string | null;
}

export function MembersClientTable({ data, config, roleInCommunity, signerAccountAddress }: MembersClientTableProps) {
  const communityConfig = new CommunityConfig(config);
  const sessionActions = useSession(config);

  const columns = createColumns(communityConfig, config, roleInCommunity, signerAccountAddress);

  return <DataTable columns={columns} data={data} />;
}
