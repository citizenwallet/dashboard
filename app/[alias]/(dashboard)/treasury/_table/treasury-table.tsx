import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { getTreasuryTransfersOfTokenAction } from '../actions';
import UrlPagination from '@/components/custom/pagination-via-url';
import { TransferClientTable } from './treasury-client-table';
import { Separator } from '@/components/ui/separator';
import { DatePickerWithPresets } from '@/components/custom/date-picker-with-presets';

const ROWS_PER_PAGE = 10;

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
  const { chain_id: chainId, address: tokenAddress } =
    config.community.primary_token;
  
  const {address: profileAddress} = config.community.profile

  const { data, count: totalCount } = await getTreasuryTransfersOfTokenAction({
    chainId,
    tokenAddress,
    profileAddress,
    query,
    page,
    from,
    to
  });

  const totalPages = Math.ceil(Number(totalCount) / ROWS_PER_PAGE);

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Treasury</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>
        <div className="flex justify-end">
          {/* <DatePickerWithPresets /> */}
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
