import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Suspense } from 'react';
import { skeletonColumns } from './_table/columns';
import {DataTable } from '@/components/ui/data-table';
import { CommunitiesTable } from './_table/communities-table';
import { placeholderData } from './_table/columns';

export default async function Page(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query: queryParam, page: pageParam } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';

  return (
    <Card className="w-full h-[calc(100vh-theme(spacing.32))]">
      <CardHeader>
        <CardTitle>Communities</CardTitle>
        <CardDescription>Browse communities of your chain</CardDescription>
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
          <CommunitiesTable
            query={query}
            page={parseInt(page)}
            chainId={42220}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
