import AddAdmin from '@/app/[alias]/(dashboard)/admins/_components/add-admin';
import { getUsersOfCommunityAction } from '@/app/[alias]/(dashboard)/admins/action';
import { getAuthUserRoleInCommunityAction } from '@/app/_actions/user-actions';
import UrlPagination from '@/components/custom/pagination-via-url';
import { Separator } from '@/components/ui/separator';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { AdminsClientTable } from './admins-client-table';

interface AdminsTableProps {
  alias: string;
}

export default async function AdminsTable({ alias }: AdminsTableProps) {
  const client = getServiceRoleClient();
  const { data: communityData, error: communityError } = await getCommunityByAlias(client, alias);

  if (communityError || !communityData) {
    throw new Error('Failed to get community by alias');
  }

  const config = communityData.json;
  const [usersResult, roleResult] = await Promise.allSettled([
    getUsersOfCommunityAction({
      alias
    }),
    getAuthUserRoleInCommunityAction({
      alias
    })
  ]);

  const data = usersResult.status === 'fulfilled' ? usersResult.value.data : [];

  const totalCount =
    usersResult.status === 'fulfilled' ? usersResult.value.count : 0;

  const communityRole =
    roleResult.status === 'fulfilled' ? roleResult.value : undefined;

  const totalPages = 1;

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Admins</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>

        {communityRole === 'owner' && (
          <div className="flex justify-end">
            <AddAdmin alias={alias} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <AdminsClientTable
            data={data ?? []}
            communityRole={communityRole}
            alias={alias}
          />
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
