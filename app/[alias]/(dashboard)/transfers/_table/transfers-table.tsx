import { Config, CommunityConfig } from '@citizenwallet/sdk';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { getTransfersOfTokenAction } from '../actions';
import UrlPagination from '@/components/custom/pagination-via-url';
import { TransferClientTable } from './transfers-client-table';

const ROWS_PER_PAGE = 10;

interface TransferTableProps {
  query: string;
  page: number;
  alias: string;
}

export default async function TransferTable({
  query,
  page,
  alias
}: TransferTableProps) {
  let config: Config | null = null;

  try {
    const result = await fetchCommunityByAliasAction(alias);
    config = result.community;
  } catch (error) {
    console.error(error);
  }

  if (!config) {
    return <div>Community not found</div>;
  }

  const communityConfig = new CommunityConfig(config);
  const primaryToken = communityConfig.primaryToken;

  const { data, count: totalCount } = await getTransfersOfTokenAction({
    chainId: primaryToken.chain_id,
    tokenAddress: primaryToken.address,
    query,
    page
  });

  const totalPages = Math.ceil(Number(totalCount) / ROWS_PER_PAGE);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <TransferClientTable data={data ?? []} config={config} />
        </div>
      </div>
      <div className="sticky bottom-0 left-0 right-0 bg-background py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-sm text-gray-500 whitespace-nowrap">
          Total: {totalCount}
        </p>
        <UrlPagination totalPages={totalPages} />
      </div>
    </div>
  );
}
