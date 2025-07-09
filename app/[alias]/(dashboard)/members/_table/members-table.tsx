import UrlPagination from '@/components/custom/pagination-via-url';
import { Separator } from '@/components/ui/separator';
import { PAGE_SIZE } from '@/services/chain-db/members';
import { Config } from '@citizenwallet/sdk';
import { getMembersAction } from '../action';
import { MembersClientTable } from './members-client-table';

interface MembersTableProps {
  query: string;
  page: number;
  config: Config;
  showAllMembers: boolean;
  hasProfileAdminRole: boolean;
}

export default async function MembersTable({
  query,
  page,
  config,
  showAllMembers,
  hasProfileAdminRole
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
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <MembersClientTable data={data ?? []} config={config} hasProfileAdminRole={hasProfileAdminRole} />
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
