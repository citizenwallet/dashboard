"use client"
import UrlPagination from '@/components/custom/pagination-via-url';
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useState } from 'react';

export default function Webhooks() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    return (
        <>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <div className="flex justify-start mb-4">
                        <Button >
                            <Plus size={16} />
                            Add Webhook
                        </Button>
                    </div>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Webhook</DialogTitle>
                        <DialogDescription>
                            Add a new webhook to your project.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">

                            <label htmlFor="eventId" className="text-sm font-medium">
                                Event Id
                            </label>
                            <Input id="eventId" placeholder="Webhook Event Id" />


                            <label htmlFor="name" className="text-sm font-medium mt-4">
                                Name
                            </label>
                            <Input id="name" placeholder="Webhook Name" />

                            <label htmlFor="url" className="text-sm font-medium mt-4">
                                URL
                            </label>
                            <Input id="url" placeholder="Webhook URL" />

                        </div>

                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddDialogOpen(false);
                            }}
                        >
                            cancel
                        </Button>
                        <Button
                            className="mb-2 md:mb-0"
                        >

                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto rounded-md border">
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-y-auto rounded-md ">
                            <DataTable columns={[
                                {
                                    header: 'ID',
                                    accessorKey: 'id',

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


                            ]} data={[]} />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                            Total: {1}
                        </p>
                        <UrlPagination totalPages={1} />
                    </div>
                </div>
            </div>
        </>
    )
}
