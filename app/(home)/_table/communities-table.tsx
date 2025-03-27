import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Config } from '@citizenwallet/sdk';
import { fetchCommunitiesAction } from '@/app/_actions/community-actions';
import { Separator } from '@/components/ui/separator';

interface CommunitiesTableProps {
  query: string;
  page: number;
}

export async function CommunitiesTable({ query }: CommunitiesTableProps) {
  let communities: Config[] = [];
  let total: number = 0;

  try {
    const result = await fetchCommunitiesAction({
      query: query
    });

    communities = result.communities;
    total = result.total;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Communities</h1>
          <p className="text-sm text-gray-500">Browse communities</p>
        </div>
      </div>

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
      </div>
    </div>
  );
}
