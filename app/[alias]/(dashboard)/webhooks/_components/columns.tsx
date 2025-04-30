
"use client"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Webhook } from '@/services/chain-db/webhooks';
import { Trash } from "lucide-react";
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteWebhookAction } from '../action';
import { ColumnDef } from "@tanstack/react-table";
import { Config } from '@citizenwallet/sdk';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

export const createColumns = (config: Config): ColumnDef<Webhook>[] => {
    const router = useRouter();

    return [
        {
            header: 'Event Topic',
            accessorKey: 'event_topic',

        },
        {
            header: 'Name',
            accessorKey: 'name',
        }
        ,
        {
            header: 'Url',
            accessorKey: 'url',
        }
        ,
        {
            header: 'Action',
            cell: function RemoveCell({ row }) {
                const [isDialogOpen, setIsDialogOpen] = useState(false);
                const [isPending, setIsPending] = useState(false);


                const handleOpenDialog = () => {
                    setIsDialogOpen(true);
                };

                const handleCloseDialog = () => {
                    setIsDialogOpen(false);
                };

                const onRemoveWebhook = async () => {
                    try {
                        setIsPending(true);
                        await deleteWebhookAction({
                            config,
                            id: row.original.id
                        });
                        handleCloseDialog();
                        toast.success('Webhook removed successfully');
                        router.refresh();
                    } catch (error) {
                        if (error instanceof Error) {
                            toast.error(error.message);
                        } else {
                            toast.error('Could not remove webhook');
                        }
                    } finally {
                        setIsPending(false);
                    }
                };

                return (
                    <>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                disabled={isPending}
                                onClick={handleOpenDialog}>
                                <Trash size={16} />
                                Remove
                            </Button>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Remove Webhook</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to remove this webhook?

                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="sm:justify-start gap-2">
                                    <Button
                                        disabled={isPending}
                                        onClick={onRemoveWebhook}
                                        type="button"
                                        variant="destructive"
                                    >
                                        {isPending ? 'Removing...' : 'Remove'}
                                    </Button>
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={isPending}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                );
            }

        }
    ];
}



export const skeletonColumns: ColumnDef<Webhook>[] = [
    {
        header: 'Event Topic',
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
    }
    ,
    {
        header: 'Url',
        cell: () => (
            <div className="w-[150px]">
                <Skeleton className="h-4 w-32" />
            </div>
        )
    }
    ,
    {
        header: 'Action',
        cell: () => (
            <div className="w-[150px]">
                <Skeleton className="h-4 w-32" />
            </div>
        )
    }
];

export const placeholderData: (Webhook)[] =
    Array(5);