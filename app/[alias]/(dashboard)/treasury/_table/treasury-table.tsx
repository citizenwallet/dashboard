import { getAuthUserRoleInCommunityAction } from '@/app/_actions/user-actions';
import UrlPagination from '@/components/custom/pagination-via-url';
import { Separator } from '@/components/ui/separator';
import { PAGE_SIZE } from '@/services/chain-db/transfers';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import {
  hasRole as CWCheckRoleAccess,
  CommunityConfig,
  MINTER_ROLE
} from '@citizenwallet/sdk';
import { JsonRpcProvider } from 'ethers';
import BurnToken from '../_components/burn-token';
import MintToken from '../_components/mint-token';
import { getTreasuryTransfersOfTokenAction } from '../actions';
import { TransferClientTable } from './treasury-client-table';

interface TreasuryTableProps {
  query: string;
  page: number;
  alias: string;
  from?: string;
  to?: string;
}

export default async function TreasuryTable({
  query,
  page,
  alias,
  from,
  to
}: TreasuryTableProps) {

  const client = getServiceRoleClient();
  const { data: communityData, error: communityError } = await getCommunityByAlias(client, alias);

  if (communityError || !communityData) {
    throw new Error('Failed to get community by alias');
  }

  const config = communityData.json;


  const communityConfig = new CommunityConfig(config);

  const primaryRpcUrl = communityConfig.primaryRPCUrl;
  const { address: tokenAddress } = config.community.primary_token;
  const theme = config.community.theme?.primary;

  const authRole = await getAuthUserRoleInCommunityAction({
    alias
  });

  const hasMinterRole = await CWCheckRoleAccess(
    tokenAddress,
    MINTER_ROLE,
    process.env.SERVER_ACCOUNT_ADDRESS ?? '',
    new JsonRpcProvider(primaryRpcUrl)
  );

  const treasuryData = await getTreasuryTransfersOfTokenAction({
    config,
    query,
    page,
    from,
    to
  });

  const { data, count: totalCount } = treasuryData;

  const totalPages = Math.ceil(Number(totalCount) / PAGE_SIZE);

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Treasury</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>
        <div className="flex justify-end gap-2">
          {authRole === 'owner' && hasMinterRole && (
            <MintToken alias={alias} theme={theme} />
          )}

          {authRole === 'owner' && hasMinterRole && <BurnToken alias={alias} />}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <TransferClientTable data={data ?? []} config={config} />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
        <p className="text-sm text-gray-500 whitespace-nowrap">
          Total: {Number(totalCount).toLocaleString()}
        </p>
        <UrlPagination totalPages={totalPages} />
      </div>
    </div>
  );
}
