import { Suspense } from 'react';
import MembersTable from './_table/members-table';
import { DataTable } from '@/components/ui/data-table';
import { placeholderData, skeletonColumns } from './_table/columns';
import UrlSearch from '@/components/custom/url-search';
import { fetchCommunityByAliasAction } from '@/app/[alias]/(dashboard)/_actions/community-actions';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const { alias } = await props.params;
  const { community: config } = await fetchCommunityByAliasAction(alias);

  const { query: queryParam, page: pageParam } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>
        <div className="flex justify-end">
          <UrlSearch />
        </div>
      </div>

      <Suspense key={alias + query + page} fallback={<Fallback />}>
        <MembersTable query={query} page={Number(page)} config={config} />
      </Suspense>
    </div>
  );
}

function Fallback() {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto rounded-md border">
        <DataTable columns={skeletonColumns} data={placeholderData} />
      </div>
    </div>
  );
}
