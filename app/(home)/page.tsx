import { Suspense } from 'react';
import { skeletonColumns } from './_table/columns';
import { DataTable } from '@/components/ui/data-table';
import { CommunitiesTable } from './_table/communities-table';
import { placeholderData } from './_table/columns';

export default async function Page(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query: queryParam, page: pageParam } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';

  return (
    <Suspense key={query + page} fallback={<Fallback />}>
      <CommunitiesTable query={query} page={parseInt(page)} chainId={42220} />
    </Suspense>
  );
}

function Fallback() {
  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Communities</h1>
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
