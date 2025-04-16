"use client"
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import UrlPagination from '@/components/custom/pagination-via-url';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import { MemberT } from "@/services/chain-db/members";
import { cn } from "@/lib/utils";

export default function RolePage({ members }: { members: MemberT[] }) {

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [isAddLoading, setIsAddLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [memberAccount, setMemberAccount] = useState('');

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

                        <div className="grid gap-2">
                            <label htmlFor="role" className="text-sm font-medium">
                                Role
                            </label>
                            <Input
                                className="text-base"
                                id="role"
                                value={newRole}
                                placeholder="new role description"
                            />
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
                            disabled={isAddLoading}
                        >
                            Add
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
                                    header: 'Role',
                                    accessorKey: 'role'
                                },
                                {
                                    header: 'Description',
                                    accessorKey: 'description'
                                }
                            ]} data={[]} />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
                        <p className="text-sm text-gray-500 whitespace-nowrap">
                            Total: 100
                        </p>
                        <UrlPagination totalPages={10} />
                    </div>
                </div>
            </div>
        </>
    )
}
