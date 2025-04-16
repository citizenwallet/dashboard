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
import { Check, ChevronsUpDown, Copy, Plus, Trash } from "lucide-react";
import { useState } from "react";



export default function RolePage({
    members,
    minterMembers,
    count
}: {

    members: MemberT[],
    minterMembers: any[],
    count: number
}) {

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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

    return (
        <>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <div className="flex justify-start mb-4">
                        <Button >
                            <Plus size={16} />
                            Add Role
                        </Button>
                    </div>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Role</DialogTitle>
                        <DialogDescription>
                            Add a new role
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
                                                            setMemberAccount(member.id.toString());
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
                            onClick={() => setIsAddDialogOpen(false)}
                        >
                            cancel
                        </Button>
                        <Button
                            className="mb-2 md:mb-0"
                        >
                            <Plus size={16} />
                            Add Minter
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
                                                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                                    <Trash size={16} />
                                                    Remove
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
