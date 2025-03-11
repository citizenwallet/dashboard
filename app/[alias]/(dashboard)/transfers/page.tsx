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

export default async function TransactionsPage(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { alias } = await props.params;

  const { query: queryParam, page: pageParam } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';

  return (
    <Card className="w-full h-[calc(100vh-theme(spacing.32))]">
      <CardHeader>
        <CardTitle>Transfers</CardTitle>
        <CardDescription>Browse transfers of your community</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-theme(spacing.24))]">
        <Suspense
          key={query + page}
          fallback={
            <div className="h-full overflow-y-auto rounded-md border">
              <DataTable columns={skeletonColumns} data={placeholderData} />
            </div>
          }
        >
          <TransferTable query={query} page={parseInt(page)} alias={alias} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
