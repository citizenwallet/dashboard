import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunities } from '@/services/top-db/community';
import { Config } from '@citizenwallet/sdk';
import { columns } from './columns';
import CreateCommunityModal from '../_components/create-community-modal';

interface CommunitiesTableProps {
  query: string;
  page: number;
}

export async function CommunitiesTable({ query, page }: CommunitiesTableProps) {
  let communities: Config[] = [];
  let total: number = 0;

  try {

    const client = getServiceRoleClient();

    const { data: datas, count } = await getCommunities(client, query, page);

    if (!datas || datas.length < 1) {

      communities = [];
      total = 0;
    } else {
      communities = datas?.map((data) => data?.json);
      total = count ?? 0;
    }

  } catch (error) {
    console.error(error);
  }

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Communities</h1>
          <p className="text-sm text-gray-500">Browse communities</p>
        </div>
        <CreateCommunityModal />
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
