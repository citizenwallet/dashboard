'use client';
import { Skeleton } from "@/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";

export const skeletonColumns: ColumnDef<any>[] = [
    {
        header: 'ID',
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
        header: 'Member',
        cell: () => (
            <div className="w-[150px]">
                <Skeleton className="h-4 w-24" />
            </div>
        )
    },
    {
        header: 'Name',
        cell: () => (
            <div className="min-w-[200px] max-w-[400px] px-4">
                <Skeleton className="h-8 w-full" />
            </div>
        )
    },
    {
        header: 'Created at',
        cell: () => (
            <div className="min-w-[150px]">
                <Skeleton className="h-4 w-32" />
            </div>
        )
    },
    {
        header: 'Actions',
        cell: () => (
            <div className="min-w-[150px]">
                <Skeleton className="h-4 w-32" />
            </div>
        )
    }
];

export const placeholderData: any[] = Array(5);

