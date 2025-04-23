"use client"
import UrlPagination from '@/components/custom/pagination-via-url';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from "@/components/ui/separator";
import { cn, formatAddress } from "@/lib/utils";
import { MemberT } from "@/services/chain-db/members";
import { Check, ChevronsUpDown, Copy, Loader2, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from 'sonner';
import { grantRoleAction } from './action';
import { Config } from '@citizenwallet/sdk';



export default function RolePage({
    members,
    minterMembers,
    count,
    config
}: {

    members: MemberT[],
    minterMembers: any[],
    count: number,
    config: Config
}) {

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [memberAccount, setMemberAccount] = useState('');

    const totalPages = Math.ceil(Number(count) / 25);

    const IDRow = ({ account }: { account: string }) => {
        const [isCopied, setIsCopied] = useState(false);

        const copyToClipboard = () => {
            navigator.clipboard.writeText(account);
            setIsCopied(true);

            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        };

        return (
            <div className="w-[120px] truncate">
                <div
                    className="flex items-center gap-1 cursor-pointer hover:bg-muted rounded-md p-1"
                    onClick={copyToClipboard}
                >
                    <span className="text-xs font-mono truncate">
                        {formatAddress(account)}
                    </span>
                    {isCopied ? (
                        <Check className="ml-1 h-3 w-3" />
                    ) : (
                        <Copy className="ml-1 h-3 w-3" />
                    )}
                </div>
            </div>
        );
    };

    const grantAccess = async () => {
        await grantRoleAction({ config, account: memberAccount });
    }
    const handleGrantAccess = () => {
        toast.custom((t) => (
            <div>
                <h3>Are you sure you want to grant access to this member?</h3>
                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        className="ml-4 bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                            toast.dismiss(t);
                            setIsAddDialogOpen(false);
                            setMemberAccount('');
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={grantAccess}>
                        Confirm
                    </Button>
                </div>
            </div>
        ));
    }


    const handleRevokeAccess = (id: string) => {
        setIsLoading(false);

        toast.custom((t) => (
            <div>
                <h3>Are you sure you want to revoke access to this member?</h3>
                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        className="ml-4 bg-red-600 text-white hover:bg-red-700"
                        onClick={() => {
                            toast.dismiss(t);
                            setIsLoading(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        console.log(id);
                    }}>
                        Confirm
                    </Button>
                </div>
            </div>
        ));
    }

    return (
        <>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <div className="flex justify-start mb-4">
                        <Button >
                            <Plus size={16} />
                            Grant Access
                        </Button>
                    </div>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grant Minting Access</DialogTitle>
                        <DialogDescription>
                            This will allow the member to both mint and burn from member accounts.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="memberAccount" className="text-sm font-medium">
                                Member Account
                            </label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full overflow-hidden justify-between"
                                        id="place"
                                    >
                                        {memberAccount || 'Select a member'}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder=" Search username..."
                                            className="h-9"
                                        />
                                        <CommandList>
                                            <CommandEmpty>No Member found.</CommandEmpty>
                                            <CommandGroup>
                                                {members?.map((member) => (
                                                    <CommandItem
                                                        key={member.id}
                                                        value={member.username.toLowerCase()}
                                                        onSelect={() => {
                                                            setMemberAccount(member.account);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        {member.username}
                                                        <Check
                                                            className={cn(
                                                                'ml-auto h-4 w-4',
                                                                memberAccount === member.id.toString()
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0'
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAddDialogOpen(false);
                                setMemberAccount('');
                            }}
                        >
                            cancel
                        </Button>
                        <Button
                            className="mb-2 md:mb-0"
                            onClick={handleGrantAccess}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                                    cell: ({ row }) => <IDRow account={row.original.account_address} />
                                },

                                {
                                    header: 'Member',
                                    cell: ({ row }) => {
                                        const { image, username, name } = row.original.a_member;

                                        return (
                                            <div className="flex items-center gap-2 w-[250px]">
                                                <Avatar className="h-10 w-10 flex-shrink-0">
                                                    <AvatarImage src={image} alt={username} />
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium">@{username}</p>
                                                    <p className="text-sm text-gray-500">{name}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                },
                                {
                                    header: 'Name',
                                    accessorKey: 'name',
                                    cell: ({ row }) => (
                                        <div className="w-[150px] truncate">{row.original.a_member.name}</div>
                                    )
                                },
                                {
                                    header: 'Created At',
                                    accessorKey: 'created_at',
                                    cell: ({ row }) => {
                                        const createdAt = new Date(row.original.created_at);
                                        return (
                                            <div className="w-[150px]">
                                                <span className="text-muted-foreground text-sm whitespace-nowrap">{createdAt.toLocaleString()}</span>
                                            </div>
                                        )
                                    }
                                },
                                {
                                    header: 'Actions',
                                    cell: ({ row }) => {
                                        return (
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline"
                                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                    onClick={() => handleRevokeAccess(row.original.id)}
                                                >
                                                    <Trash size={16} />
                                                    Revoke Access
                                                </Button>
                                            </div>
                                        )
                                    }
                                }
                            ]} data={minterMembers} />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                            Total: {count}
                        </p>
                        <UrlPagination totalPages={totalPages} />
                    </div>
                </div>
            </div>
        </>
    )
}
