import { Suspense } from 'react';
import TransferTable from './_table/transfers-table';
import { skeletonColumns, placeholderData } from './_table/columns';
import { DataTable } from '@/components/ui/data-table';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{
    query?: string;
    page?: string;
    from?: string; // date
    to?: string; // date
  }>;
}) {
  const { alias } = await props.params;

  const {
    query: queryParam,
    page: pageParam,
    from: fromParam,
    to: toParam
  } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';
  const from = fromParam;
  const to = toParam;

  return (
    <Suspense key={alias + query + page + from + to} fallback={<Fallback />}>
      <TransferTable
        query={query}
        page={parseInt(page)}
        alias={alias}
        from={from}
        to={to}
      />
    </Suspense>
  );
}

function Fallback() {
  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Transfers</h1>
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