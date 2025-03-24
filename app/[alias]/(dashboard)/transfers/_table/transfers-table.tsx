import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { getTransfersOfTokenAction } from '../actions';
import UrlPagination from '@/components/custom/pagination-via-url';
import { TransferClientTable } from './transfers-client-table';
import { Separator } from '@/components/ui/separator';
import { DatePickerWithPresets } from '@/components/custom/date-picker-with-presets';
import { PAGE_SIZE } from '@/services/db/transfers';

interface TransferTableProps {
  query: string;
  page: number;
  alias: string;
  from?: string;
  to?: string;
}

export default async function TransferTable({
  query,
  page,
  alias,
  from,
  to
}: TransferTableProps) {
  const { community: config } = await fetchCommunityByAliasAction(alias);

  const { data, count: totalCount } = await getTransfersOfTokenAction({
    config,
    query,
    page,
    from,
    to
  });

  const totalPages = Math.ceil(Number(totalCount) / PAGE_SIZE);

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Transfers</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>
        <div className="flex justify-end">
          <DatePickerWithPresets />
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
