'use client'

import UrlPagination from '@/components/custom/pagination-via-url';
import { Badge } from "@/components/ui/badge";
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
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Paymaster } from "@/services/chain-db/paymaster";
import { Row } from "@tanstack/react-table";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from 'react';

export default function PaymasterTable() {


    const [paymasterdata, setPaymasterdata] = useState<Paymaster[]>([{
        contract: "0x1234567890123456789012345678901234567890",
        paymaster: "0x1234567890123456789012345678901234567890",
        alias: "Paymaster",
        name: "Paymaster",
        published: "0x1234567890123456789012345678901234567890efwefwef"
    }]);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<
        'contract' | 'name' | 'published' | null
    >(null);

    const [editingContract, setEditingContract] = useState<string>('');
    const [editingName, setEditingName] = useState<string>('');

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);


    //for contract editing
    const handleContractClick = (paymaster: Paymaster) => {
        setEditingItemId(paymaster.contract);
        setEditingField('contract');
        setEditingContract(paymaster.contract || '');
    };
    const handleContractKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        paymaster: Paymaster
    ) => {
        if (e.key === 'Enter') {
            handleContractSave(paymaster);
        } else if (e.key === 'Escape') {
            setEditingItemId(null);
            setEditingField(null);
        }
    };
    const handleContractSave = async (paymaster: Paymaster) => {
        if (editingContract === paymaster.contract) {
            setEditingItemId(null);
            setEditingField(null);
            return;
        }

        try {

            const updatedPaymaster = paymasterdata.map((p: Paymaster) =>
                p.contract === paymaster.contract ? { ...p, contract: editingContract } : p
            );
            setPaymasterdata(updatedPaymaster);

        } catch (error) {
            console.error(`Failed to update place name:`, error);
        }
        // Save logic would go here
    };
    const handleContractChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingContract(e.target.value);
    };


    //for name editing
    const handleNameClick = (paymaster: Paymaster) => {
        setEditingItemId(paymaster.contract);
        setEditingField('name');
        setEditingName(paymaster.name || '');
    };
    const handleNameKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        paymaster: Paymaster
    ) => {
        if (e.key === 'Enter') {
            handleContractSave(paymaster);
        } else if (e.key === 'Escape') {
            setEditingItemId(null);
            setEditingField(null);
        }
    };
    const handleNameSave = async (paymaster: Paymaster) => {
        if (editingName === paymaster.name) {
            setEditingItemId(null);
            setEditingField(null);
            return;
        }

        try {

            const updatedPaymaster = paymasterdata.map((p: Paymaster) =>
                p.contract === paymaster.contract ? { ...p, contract: editingContract } : p
            );
            setPaymasterdata(updatedPaymaster);

        } catch (error) {
            console.error(`Failed to update place name:`, error);
        }
        // Save logic would go here
    };
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingName(e.target.value);
    };

    const handleDelete = (contract: string) => {
        setLoadingId(contract);
    }

    return (
        <>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <div className="flex justify-end mb-4">
                        <Button>
                            <Plus size={16} />
                            Add Whitelisted Address
                        </Button>
                    </div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add new whitelisted address</DialogTitle>
                        <DialogDescription>Add a new whitelisted address</DialogDescription>
                    </DialogHeader>
                    <Label htmlFor="whitelistedAddress" className="text-sm font-medium">
                        Enter whitelisted address
                    </Label>

                    <Input
                        name="whitelistedAddress"
                        type="search"
                        placeholder="Enter whitelisted address"
                    />


                    <Label htmlFor="name" className="text-sm font-medium mt-4">
                        Enter Name
                    </Label>

                    <Input
                        name="name"
                        type="search"
                        placeholder="Enter name"
                    />

                    <DialogFooter>

                        <Button className="mb-2 md:mb-0">
                            <Plus size={16} />
                            Add
                        </Button>

                        <Button variant="outline" >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto rounded-md border">
                    <DataTable columns={[
                        {
                            header: "Whitelisted Address",
                            accessorKey: "contract",
                            cell: ({ row }: { row: Row<any> }) => {
                                return (
                                    <div className="p-2">
                                        {editingItemId === row.original.contract && editingField === 'contract' ? (
                                            <input
                                                type="text"
                                                value={editingContract}
                                                onChange={handleContractChange}
                                                onKeyDown={(e) => handleContractKeyDown(e, row.original)}
                                                onBlur={() => handleContractSave(row.original)}
                                                autoFocus
                                                data-item-id={row.original.id}
                                                className="w-full rounded border border-gray-300 p-1"
                                                placeholder="Enter contract"
                                            />
                                        ) : (
                                            <div
                                                onClick={() => handleContractClick(row.original)}
                                                className="cursor-pointer rounded p-1 hover:bg-gray-100"
                                            >
                                                {row.original.contract}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        },
                        {
                            header: "Name",
                            accessorKey: "name",
                            cell: ({ row }: { row: Row<any> }) => {
                                return (
                                    <div className="p-2">
                                        {editingItemId === row.original.contract && editingField === 'name' ? (
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={handleNameChange}
                                                onKeyDown={(e) => handleNameKeyDown(e, row.original)}
                                                onBlur={() => handleNameSave(row.original)}
                                                autoFocus
                                                data-item-id={row.original.id}
                                                className="w-full rounded border border-gray-300 p-1"
                                                placeholder="Enter name"
                                            />
                                        ) : (
                                            <div
                                                onClick={() => handleNameClick(row.original)}
                                                className="cursor-pointer rounded p-1 hover:bg-gray-100"
                                            >
                                                {row.original.name}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        },
                        {
                            header: "Published",
                            accessorKey: "published",
                            cell: ({ row }: { row: Row<any> }) => {
                                return (
                                    <div className="p-2">
                                        {row.original.published ?
                                            <>
                                                <Badge variant="default" className="bg-green-500">
                                                    Yes
                                                </Badge>
                                            </> :
                                            <>
                                                <Badge variant="default" className="bg-red-500">
                                                    No
                                                </Badge>
                                            </>
                                        }
                                    </div>
                                )
                            }
                        },
                        {
                            header: "Actions",
                            cell: ({ row }) => {
                                return (
                                    <Button
                                        variant="outline" size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() => handleDelete(row.original.contract)}>
                                        {loadingId === row.original.contract ?
                                            <Loader2 className="w-4 h-4 animate-spin" /> :
                                            <Trash2 className="w-4 h-4" />
                                        }

                                    </Button>
                                )
                            }
                        }

                    ]} data={paymasterdata} />
                </div>
            </div>

            <Separator className="my-4" />

            <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
                <p className="text-sm text-gray-500 whitespace-nowrap">
                    Total: 11
                </p>
                <UrlPagination totalPages={11} />
            </div>
        </>
    )
}
