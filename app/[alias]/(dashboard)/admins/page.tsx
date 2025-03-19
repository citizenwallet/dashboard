import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Suspense } from 'react';
import AdminsTable from './_table/admins-table';
import { DataTable } from '@/components/ui/data-table';
import { placeholderData, skeletonColumns } from './_table/columns';
import AddAdmin from './_components/add-admin';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await props.params;

  return (
    <Card className="w-full h-[calc(100vh-theme(spacing.32))]">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <CardTitle>Admins</CardTitle>
          <CardDescription>Admins of your community</CardDescription>
        </div>
        <AddAdmin alias={alias} />
      </CardHeader>
      <CardContent className="h-[calc(100%-theme(spacing.24))]">
        <Suspense
          key={alias}
          fallback={
            <div className="h-full overflow-y-auto rounded-md border">
              <DataTable columns={skeletonColumns} data={placeholderData} />
            </div>
          }
        >
          <AdminsTable alias={alias} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
