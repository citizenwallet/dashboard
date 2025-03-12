import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Suspense } from 'react';
import MembersTable from './_table/members-table';
import { DataTable } from '@/components/ui/data-table';
import { placeholderData, skeletonColumns } from './_table/columns';
import UrlSearch from '@/components/custom/url-search';

export default async function TransactionsPage(props: {
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
    <Card className="w-full h-[calc(100vh-theme(spacing.32))]">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <CardTitle>Members</CardTitle>
          <CardDescription>Browse members of your community</CardDescription>
        </div>
        <UrlSearch />
      </CardHeader>
      <CardContent className="h-[calc(100%-theme(spacing.24))]">
        <Suspense
          key={alias + query + page}
          fallback={
            <div className="h-full overflow-y-auto rounded-md border">
              <DataTable columns={skeletonColumns} data={placeholderData} />
            </div>
          }
        >
          <MembersTable query={query} page={Number(page)} alias={alias} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
