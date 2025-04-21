import UrlPagination from '@/components/custom/pagination-via-url';
import UrlSearch from '@/components/custom/url-button-search';
import { Separator } from '@/components/ui/separator';
import { PAGE_SIZE } from '@/services/chain-db/members';
import { Config } from '@citizenwallet/sdk';
import { getMembersAction } from '../action';
import { MembersClientTable } from './members-client-table';
import SwitcherButton from './switcher-button';


interface MembersTableProps {
  query: string;
  page: number;
  config: Config;
  showAllMembers: boolean;
}

export default async function MembersTable({
  query,
  page,
  config,
  showAllMembers
}: MembersTableProps) {

  const { data, count: totalCount } = await getMembersAction({
    config,
    query,
    page,
    showAllMembers
  });

  const totalPages = Math.ceil(Number(totalCount) / PAGE_SIZE);

  return (
    <>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>
      </div>

      <div className="flex">

        <SwitcherButton config={config} />

        <UrlSearch config={config} />
      </div>


      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <MembersClientTable data={data ?? []} config={config} />
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
