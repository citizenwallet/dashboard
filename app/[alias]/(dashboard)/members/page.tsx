import { Suspense } from 'react';
import MembersTable from './_table/members-table';
import { DataTable } from '@/components/ui/data-table';
import { placeholderData, skeletonColumns } from './_table/columns';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const { alias } = await props.params;

  const { query: queryParam, page: pageParam } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';

  return (
    <Suspense key={alias + query + page} fallback={<Fallback />}>
      <MembersTable query={query} page={Number(page)} alias={alias} />
    </Suspense>
  );
}

function Fallback() {
  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Members</h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <DataTable columns={skeletonColumns} data={placeholderData} />
        </div>
      </div>
    </div>
  );
}
