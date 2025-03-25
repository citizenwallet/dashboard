import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Config } from '@citizenwallet/sdk';
import { fetchCommunitiesOfAction } from '@/app/_actions/community-actions';
import UrlPagination from '@/components/custom/pagination-via-url';
import { auth } from '@/auth';
import { getUserByEmailAction } from '@/app/(home)/_actions/user-actions';
import { Separator } from '@/components/ui/separator';

const ROWS_PER_PAGE = 10;

interface CommunitiesTableProps {
  query: string;
  page: number;
}

export async function CommunitiesTable({
  query
}: CommunitiesTableProps) {
  const session = await auth();

  const user = await getUserByEmailAction({
    email: session?.user?.email ?? ''
  });

  let communities: Config[] = [];
  let total: number = 0;
  try {
    const accessList = user?.users_community_access.map(
      (access) => access.alias
    );
    const result = await fetchCommunitiesOfAction({
      accessList: accessList ?? [],
      query: query
    });
    communities = result.communities;
    total = result.total;
  } catch (error) {
    console.error(error);
  }

  const totalPages = Math.ceil(total / ROWS_PER_PAGE);

  return (
    <div className="flex flex-1 w-full flex-col h-full bg-background">
      <h1 className="text-2xl font-bold">Communities</h1>
      <p className="text-sm text-gray-500">Browse communities</p>

      <div className="my-4" />

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <DataTable columns={columns} data={communities} />
        </div>
      </div>

      <Separator className="my-4" />

      <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
        <p className="text-sm text-gray-500 whitespace-nowrap">
          Total: {total}
        </p>
        <UrlPagination totalPages={totalPages} />
      </div>
    </div>
  );
}
