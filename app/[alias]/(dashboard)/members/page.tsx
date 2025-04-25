import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { DataTable } from '@/components/ui/data-table';
import { Suspense } from 'react';
import { placeholderData, skeletonColumns } from './_table/columns';
import MembersTable from './_table/members-table';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{
    query?: string;
    page?: string;
    showMembers?: string;
  }>;
}) {
  const { alias } = await props.params;
  const { community: config } = await fetchCommunityByAliasAction(alias);

  const { query: queryParam, page: pageParam, showMembers: showMembersParam } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';
  const showAllMembers = showMembersParam || 'false';

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <Suspense key={alias + query + page + showAllMembers} fallback={<Fallback />}>
        <MembersTable query={query} page={Number(page)} config={config} showAllMembers={showAllMembers === 'true'} />
      </Suspense>
    </div>
  );
}

function Fallback() {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Members</h1>
        </div>
      </div>
      <div className="h-full overflow-y-auto rounded-md border">
        <DataTable columns={skeletonColumns} data={placeholderData} />
      </div>
    </div>
  );
}
