'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Paymaster } from '@/services/chain-db/paymaster';
import { ColumnDef } from '@tanstack/react-table';

export const placeholderData: (Paymaster)[] = Array(5);

export const skeletonColumns: ColumnDef<Paymaster>[] = [
    {
        header: 'Whitelisted Address',
        cell: () => (
            <div className="flex items-center gap-2 w-[250px]">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        )
    },
    {
        header: 'Name',
        cell: () => (
            <div className="w-[150px]">
                <Skeleton className="h-4 w-32" />
            </div>
        )
    },
    {
        header: 'Published',
        cell: () => (
            <div className="w-[150px]">
                <Skeleton className="h-4 w-32" />
            </div>
        )
    },
    {
        header: 'Action',
        cell: () => (
            <div className="w-[150px]">
                <Skeleton className="h-4 w-32" />
            </div>
        )
    }
];
