import UrlPagination from '@/components/custom/pagination-via-url';
import { Separator } from '@/components/ui/separator';
import { PAGE_SIZE } from '@/services/chain-db/transfers';
import { Config } from '@citizenwallet/sdk';
import { getTransfersOfTokenAction } from '../actions';
import { TransferClientTable } from './transfers-client-table';

interface TransferTableProps {
  query: string;
  page: number;
  from?: string;
  to?: string;
  config: Config;
}

export default async function TransferTable({
  query,
  page,
  from,
  to,
  config
}: TransferTableProps) {


  const { data, count: totalCount } = await getTransfersOfTokenAction({
    config,
    query,
    page,
    from,
    to
  });

  const totalPages = Math.ceil(Number(totalCount) / PAGE_SIZE);

  return (
    <>
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
    </>
  );
}
