import { DataTable } from '@/components/ui/data-table';
import  Pagination  from '@/components/custom/pagination-via-url';
import { ColumnDef } from '@tanstack/react-table';

export default async function Table<T>({
  rows = [],
  columns = [],
  total = 0,
  totalPages = 0
}: {
  rows: T[];
  columns: ColumnDef<T>[];
  total: number;
  totalPages: number;
}) {

  return (
    <div>
      <DataTable columns={columns} data={rows} />
      <div className="w-full flex justify-center items-center">
        <p className="flex flex-row gap-2 whitespace-nowrap">
         Total: {total}
        </p>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
