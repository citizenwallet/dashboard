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
import { CommunityConfig, Config } from '@citizenwallet/sdk';
import { Row } from "@tanstack/react-table";
import { isAddress } from 'ethers';
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { ContractRow } from './_components/ContractRow';
import {
    checkPaymasterWhitelistAddressExistsAction,
    refreshPaymasterWhitelistAction,
    updatePaymasterNameAction
} from './action';

const PAGE_SIZE = 25;

export default function PaymasterTable(
    {
        initialData,
        config
    }: {
        initialData: Paymaster[],
        config: Config
    }
) {
    const router = useRouter();
    const [paymasterdata, setPaymasterdata] = useState<Paymaster[]>(initialData);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingField, setEditingField] = useState<'name' | null>(null);

    const [editingName, setEditingName] = useState<string>('');

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);

    const [newWhitelistedAddress, setNewWhitelistedAddress] = useState<string>('');
    const [isValidAddress, setIsValidAddress] = useState<boolean>(true);
    const [newName, setNewName] = useState<string>('');
    const [uploading, setUploading] = useState(false);


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
            handleNameSave(paymaster);
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
            setLoadingId(paymaster.contract);
            await updatePaymasterNameAction({
                config: config,
                paymaster: paymaster.contract,
                name: editingName
            });

            setPaymasterdata(paymasterdata.map((p: Paymaster) =>
                p.contract === paymaster.contract ? { ...p, name: editingName } : p
            ));

            setEditingItemId(null);
            setEditingField(null);

            toast.success('Paymaster whitelist name updated');

        } catch (error) {
            console.error(`Failed to update place name:`, error);
            toast.error('Failed to update paymaster whitelist name');
        } finally {
            setLoadingId(null);
        }

    };
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditingName(e.target.value);
    };

    const handleDelete = async (contract: string) => {
        setPaymasterdata(paymasterdata.filter((p: Paymaster) => p.contract !== contract));
        checkIfChanges();
    }

    const checkIfChanges = () => {
        const hasExistingChanges = paymasterdata == initialData;
        setIsRefresh(hasExistingChanges);
    }

    //for checking if whitelisted address is already in the database
    const [debouncedNewWhitelistedAddress] = useDebounce(newWhitelistedAddress, 1000);
    useEffect(() => {
        const validateAddress = async () => {
            if (debouncedNewWhitelistedAddress) {
                const isValid = isAddress(debouncedNewWhitelistedAddress);
                if (isValid) {
                    setIsValidAddress(true);
                    const exists = await checkPaymasterWhitelistAddressExistsAction({
                        config: config,
                        address: debouncedNewWhitelistedAddress
                    });
                    if (exists.data && exists.data.length > 0) {
                        setIsValidAddress(false);
                        toast.error('Whitelisted address already exists');
                    } else {
                        setIsValidAddress(true);
                    }
                } else {
                    setIsValidAddress(false);
                    toast.error('Invalid whitelisted address');
                }
            }
        };
        validateAddress();
    }, [debouncedNewWhitelistedAddress, config]);


    const handleAdd = () => {

        const community = new CommunityConfig(config);
        const paymaster = community.primaryAccountConfig.paymaster_address;

        setPaymasterdata([...paymasterdata, {
            contract: debouncedNewWhitelistedAddress,
            name: newName,
            required: false,
            paymaster: paymaster,
            alias: config.community.alias
        }]);
        setIsAddDialogOpen(false);
        setIsRefresh(true);
    }

    const handleRefresh = async () => {
        try {
            setUploading(true);
            const result = await refreshPaymasterWhitelistAction({
                config: config,
                data: paymasterdata
            });
            if (result.success) {
                toast.success('Whitelist uploaded');
                router.refresh();
            } else {
                toast.error('Failed to upload whitelist');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload whitelist');
        } finally {
            setUploading(false);
        }

    }


    return (
        <>
            <div className="flex justify-between mb-4 items-center gap-2">

                {isRefresh ? (
                    <div className="flex justify-start">
                        <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600" onClick={handleRefresh} disabled={uploading}>
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={16} />}
                            Upload whitelist
                        </Button>
                    </div>
                ) : (
                    <div className="flex justify-start"></div>
                )}

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
                            onChange={(e) => setNewWhitelistedAddress(e.target.value)}
                            className={`${isValidAddress ? '' : 'border-red-500'}`}
                        />


                        <Label htmlFor="name" className="text-sm font-medium mt-4">
                            Enter Name
                        </Label>

                        <Input
                            name="name"
                            type="search"
                            placeholder="Enter name"
                            onChange={(e) => setNewName(e.target.value)}
                        />

                        <DialogFooter>

                            <Button className="mb-2 md:mb-0"
                                disabled={!isValidAddress}
                                onClick={handleAdd}>
                                <Plus size={16} />
                                Add
                            </Button>

                            <Button variant="outline" >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


            </div >



            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto rounded-md border">
                    <DataTable columns={[
                        {
                            header: "Whitelisted Address",
                            accessorKey: "contract",
                            cell: ({ row }: { row: Row<Paymaster> }) => {
                                return (
                                    <ContractRow account={row.original.contract} />
                                )
                            }
                        },
                        {
                            header: "Name",
                            accessorKey: "name",
                            cell: ({ row }: { row: Row<Paymaster> }) => {
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
                                                data-item-id={row.original.contract}
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
                            cell: ({ row }: { row: Row<Paymaster> }) => {
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
                                    <>
                                        {
                                            !row.original.required &&
                                            <Button
                                                variant="outline" size="sm"
                                                className="flex items-center gap-2"
                                                onClick={() => handleDelete(row.original.contract)}>
                                                {loadingId === row.original.contract ?
                                                    <Loader2 className="w-4 h-4 animate-spin" /> :
                                                    <Trash2 className="w-4 h-4" />
                                                }

                                            </Button>
                                        }
                                    </>
                                )
                            }
                        }

                    ]} data={paymasterdata} />
                </div>
            </div>

            <Separator className="my-4" />

            <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
                <p className="text-sm text-gray-500 whitespace-nowrap">
                    Total: {paymasterdata.length}
                </p>
                <UrlPagination totalPages={Math.ceil(paymasterdata.length / PAGE_SIZE)} />
            </div>
        </>
    )
}



