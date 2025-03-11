import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Suspense } from 'react';
import TransferTable from './_table/transfers-table';

export default async function TransactionsPage(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { alias } = await props.params;

  const { query: queryParam, page: pageParam } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle>Transfers</CardTitle>
        <CardDescription>Browse transfers of your community</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <Suspense
          key={query + page}
          fallback={
            <div className="h-full overflow-y-auto rounded-md border">
              Loading...
            </div>
          }
        >
          <TransferTable query={query} page={parseInt(page)} alias={alias} />
        </Suspense>
      </CardContent>
    </Card>
  );
}


