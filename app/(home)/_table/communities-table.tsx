import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { Config } from '@citizenwallet/sdk';
import { fetchCommunitiesOfChainAction } from '@/app/(home)/actions';
import UrlPagination from '@/components/custom/pagination-via-url';

const ROWS_PER_PAGE = 10;

interface CommunitiesTableProps {
  query: string;
  page: number;
  chainId: number;
}

export async function CommunitiesTable({
  query,
  page,
  chainId
}: CommunitiesTableProps) {
  let communities: Config[] = [];
  let total: number = 0;
  try {
    const result = await fetchCommunitiesOfChainAction(chainId, query);
    communities = result.communities;
    total = result.total;
  } catch (error) {
    console.error(error);
  }

  const totalPages = Math.ceil(total / ROWS_PER_PAGE);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <DataTable columns={columns} data={communities} />
        </div>
      </div>
      <div className="sticky bottom-0 left-0 right-0 bg-background py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-sm text-gray-500 whitespace-nowrap">
          Total: {total}
        </p>
        <UrlPagination totalPages={totalPages} />
      </div>
    </div>
  );
}
