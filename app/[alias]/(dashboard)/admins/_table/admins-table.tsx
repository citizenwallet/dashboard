import UrlPagination from '@/components/custom/pagination-via-url';
import { getUsersOfCommunityAction } from '@/app/[alias]/(dashboard)/admins/action';
import { AdminsClientTable } from './admins-client-table';
import { getAuthUserRoleInCommunityAction } from '@/app/_actions/user-actions';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { Separator } from '@/components/ui/separator';
import AddAdmin from '@/app/[alias]/(dashboard)/admins/_components/add-admin';

interface AdminsTableProps {
  alias: string;
}

export default async function AdminsTable({ alias }: AdminsTableProps) {
  const { community: config } = await fetchCommunityByAliasAction(alias);

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
