import { Suspense } from 'react';
import AdminsTable from './_table/admins-table';
import { DataTable } from '@/components/ui/data-table';
import { placeholderData, skeletonColumns } from './_table/columns';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await props.params;

  return (
    <Suspense key={alias} fallback={<Fallback />}>
      <AdminsTable alias={alias} />
    </Suspense>
  );
}

function Fallback() {
  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Admins</h1>
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
