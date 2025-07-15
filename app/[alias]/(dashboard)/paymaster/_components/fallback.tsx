"use client";
import { Skeleton } from '@/components/ui/skeleton';
import { Paymaster } from '@/services/chain-db/paymaster';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from "@/components/ui/data-table";

export const placeholderData: (Paymaster)[] = Array(5);

export const skeletonColumns: ColumnDef<Paymaster>[] = [

];

export default function PaymasterFallback() {
    return (
        <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto rounded-md border">
                <DataTable columns={skeletonColumns} data={placeholderData} />
            </div>
        </div>
    );
}