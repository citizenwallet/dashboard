import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Suspense } from 'react';
import TransferTable from './_table/transfers-table';
import { skeletonColumns, placeholderData } from './_table/columns';
import { DataTable } from '@/components/ui/data-table';
import { DatePickerWithPresets } from '@/components/custom/date-picker-with-presets';

export default async function TransactionsPage(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ query?: string; page?: string; from?: string; to?: string }>;
}) {
  const { alias } = await props.params;

  const { query: queryParam, page: pageParam, from: fromParam, to: toParam } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';
  const from = fromParam;
  const to = toParam;

  console.log('from', from, 'to', to);

  return (
    <Card className="w-full h-[calc(100vh-theme(spacing.32))]">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <CardTitle>Transfers</CardTitle>
          <CardDescription>Browse transfers of your community</CardDescription>
        </div>
        <DatePickerWithPresets />
      </CardHeader>
      <CardContent className="h-[calc(100%-theme(spacing.24))]">
        <Suspense
          key={query + page + from + to}
          fallback={
            <div className="h-full overflow-y-auto rounded-md border">
              <DataTable columns={skeletonColumns} data={placeholderData} />
            </div>
          }
        >
          <TransferTable query={query} page={parseInt(page)} alias={alias} from={from} to={to} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
