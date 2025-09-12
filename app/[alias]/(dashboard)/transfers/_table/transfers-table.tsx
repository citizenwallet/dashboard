import UrlPagination from '@/components/custom/pagination-via-url';
import { Separator } from '@/components/ui/separator';
import { getServiceRoleClient } from '@/services/chain-db';
import { getTransfersOfToken, PAGE_SIZE } from '@/services/chain-db/transfers';
import { Config } from '@citizenwallet/sdk';
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

  const { chain_id: chainId, address: tokenAddress } =
    config.community.primary_token;

  const supabase = getServiceRoleClient(chainId);

  const { data, error, count } = await getTransfersOfToken({
    client: supabase,
    token: tokenAddress,
    query,
    page,
    from,
    to
  });

  if (error) {
    console.error(error);
  }

  const totalPages = Math.ceil(Number(count) / PAGE_SIZE);

  return (
    <>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <TransferClientTable data={data || []} config={config} />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
        <p className="text-sm text-gray-500 whitespace-nowrap">
          Total: {Number(count).toLocaleString()}
        </p>
        <UrlPagination totalPages={totalPages} />
      </div>
    </>
  );
}
