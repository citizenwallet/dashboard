import UrlPagination from '@/components/custom/pagination-via-url';
import { getAdminsOfCommunityAction } from '../action';
import { AdminsClientTable } from './admins-client-table';

const ROWS_PER_PAGE = 10;

interface AdminsTableProps {
  alias: string;
}

export default async function AdminsTable({ alias }: AdminsTableProps) {

  const { data, count: totalCount } = await getAdminsOfCommunityAction({
    chainId: 42220,
    alias: alias
  });

  const totalPages = Math.ceil(Number(totalCount) / ROWS_PER_PAGE);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <AdminsClientTable data={data ?? []} />
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
