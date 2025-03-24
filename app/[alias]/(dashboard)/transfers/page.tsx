import { Suspense } from 'react';
import TransferTable from './_table/transfers-table';
import { skeletonColumns, placeholderData } from './_table/columns';
import { DataTable } from '@/components/ui/data-table';
import { DatePickerWithPresets } from '@/components/custom/date-picker-with-presets';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{
    query?: string;
    page?: string;
    datePreset?: string;
    from?: string; // date
    to?: string; // date
  }>;
}) {
  const { alias } = await props.params;
  const { community: config } = await fetchCommunityByAliasAction(alias);

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
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Transfers</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>
        <div className="flex justify-end">
          <DatePickerWithPresets />
        </div>
      </div>

      <Suspense
        key={alias + query + page + from + to}
        fallback={<Fallback />}
      >
        <TransferTable
          query={query}
          page={parseInt(page)}
          alias={alias}
          from={from}
          to={to}
          config={config}
        />
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
