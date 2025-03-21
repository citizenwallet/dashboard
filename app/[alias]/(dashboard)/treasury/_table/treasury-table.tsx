import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { getAuthUserRoleInCommunityAction } from '@/app/_actions/admin-actions';
import { getTreasuryTransfersOfTokenAction } from '../actions';
import UrlPagination from '@/components/custom/pagination-via-url';
import { TransferClientTable } from './treasury-client-table';
import { Separator } from '@/components/ui/separator';
import MintToken from '../_components/mint-token';
import BurnToken from '../_components/burn-token';
import {
  MINTER_ROLE,
  hasRole as CWCheckRoleAccess,
  CommunityConfig
} from '@citizenwallet/sdk';
import { JsonRpcProvider } from 'ethers';
import { PAGE_SIZE } from '@/services/db/transfers';

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
  const { community: config } = await fetchCommunityByAliasAction(alias);
  const communityConfig = new CommunityConfig(config);

  const primaryRpcUrl = communityConfig.primaryRPCUrl;
  const { chain_id: chainId, address: tokenAddress } =
    config.community.primary_token;
  const theme = config.community.theme?.primary;

  const [authRole, hasMinterRole, treasuryData] = await Promise.all([
    getAuthUserRoleInCommunityAction({
      alias,
      chainId
    }),
    CWCheckRoleAccess(
      tokenAddress,
      MINTER_ROLE,
      process.env[`SERVER_${chainId}_ACCOUNT_ADDRESS`] ?? '',
      new JsonRpcProvider(primaryRpcUrl)
    ),
    getTreasuryTransfersOfTokenAction({
      config,
      query,
      page,
      from,
      to
    })
  ]);

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
          Total: {totalCount}
        </p>
        <UrlPagination totalPages={totalPages} />
      </div>
    </div>
  );
}
