'use client';
import UrlPagination from '@/components/custom/pagination-via-url';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn, formatAddress } from '@/lib/utils';
import { MemberT } from '@/services/chain-db/members';
import { Config } from '@citizenwallet/sdk';
import {
  Check,
  ChevronsUpDown,
  Copy,
  Loader2,
  Plus,
  Trash
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { grantRoleAction, MinterMembers, revokeRoleAction } from './action';

export default function RolePage({
  members,
  minterMembers,
  count,
  config,
  hasAdminRole
}: {
  members: MemberT[];
  minterMembers: MinterMembers[];
  count: number;
  config: Config;
  hasAdminRole: boolean;
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsLoading(true);
    const res = await grantRoleAction({ config, account: memberAccount });

    if (res.success) {
      toast.success('Access granted successfully.');
    } else {
      toast.error('Failed to grant access.');
    }
    setIsLoading(false);
    setIsAddDialogOpen(false);
  };

  const handleGrantAccess = () => {
    if (!hasAdminRole) {
      toast.error('You do not have permission to revoke access.');
      return;
    }

    setIsDialogOpen(true);
  };

  const commandListRef = useRef<HTMLDivElement>(null);
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (commandListRef.current) {
      e.stopPropagation();
      commandListRef.current.scrollTop += e.deltaY;
    }
  }, []);

  return (
    <>
      {hasAdminRole && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex justify-start mb-4">
              <Button>
                <Plus size={16} />
                Grant Access
              </Button>
            </div>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grant Minting Access</DialogTitle>
              <DialogDescription>
                This will allow the member to both mint and burn from member
                accounts.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="memberAccount" className="text-sm font-medium">
                  Member Account
                </Label>
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
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                    side="top"
                    sideOffset={4}
                  >
                    <Command>
                      <CommandInput
                        placeholder="Search username..."
                        className="h-9"
                      />
                      <CommandList
                        ref={commandListRef}
                        className="max-h-[200px] overflow-y-auto"
                        onWheel={handleWheel}
                      >
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
                              <div className="flex items-center gap-2 min-w-[200px]">
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarImage
                                    src={member.image}
                                    alt={member.username}
                                  />
                                  <AvatarFallback>
                                    {member.username.slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">
                                    {`@${member.username}`}
                                  </span>
                                </div>
                              </div>

                              <Check
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  memberAccount === member.account.toString()
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
                Cancel
              </Button>
              <Button className="mb-2 md:mb-0" onClick={handleGrantAccess}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog for confirming access grant */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Grant Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to grant access to this member?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start gap-2">
            <Button
              onClick={() => {
                grantAccess();
                setIsDialogOpen(false);
              }}
              type="button"
            >
              Grant
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto rounded-md border">
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto rounded-md ">
              <DataTable
                columns={[
                  {
                    header: 'ID',
                    accessorKey: 'id',
                    cell: ({ row }) => (
                      <IDRow account={row.original.account_address} />
                    )
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
                      );
                    }
                  },
                  {
                    header: 'Name',
                    accessorKey: 'name',
                    cell: ({ row }) => (
                      <div className="w-[150px] truncate">
                        {row.original.a_member.name}
                      </div>
                    )
                  },
                  {
                    header: 'Created At',
                    accessorKey: 'created_at',
                    cell: ({ row }) => {
                      const createdAt = new Date(row.original.created_at);
                      return (
                        <div className="w-[150px]">
                          <span className="text-muted-foreground text-sm whitespace-nowrap">
                            {createdAt.toLocaleString()}
                          </span>
                        </div>
                      );
                    }
                  },

                  {
                    header: 'Actions',
                    cell: function RemoveCell({ row }) {
                      const [isDialogOpen, setIsDialogOpen] = useState(false);
                      const [isPending, setIsPending] = useState(false);

                      const handleOpenDialog = () => {
                        setIsDialogOpen(true);
                      };

                      const revokeAccess = async (account: string) => {
                        if (!hasAdminRole) {
                          toast.error(
                            'You do not have permission to revoke access.'
                          );
                          return;
                        }
                        setIsPending(true);
                        const res = await revokeRoleAction({
                          config,
                          account: account
                        });
                        if (res.success) {
                          toast.success('Access revoked successfully.');
                        } else {
                          toast.error('Failed to revoke access.');
                        }
                        setIsPending(false);
                        setIsDialogOpen(false);
                      };
                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              disabled={isPending}
                              onClick={handleOpenDialog}
                            >
                              <Trash size={16} />
                              Revoke Access
                            </Button>
                          </div>

                          <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                          >
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Revoke Access</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to revoke access to this
                                  member?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="sm:justify-start gap-2">
                                <Button
                                  disabled={isPending}
                                  onClick={() =>
                                    revokeAccess(row.original.account_address)
                                  }
                                  type="button"
                                  variant="destructive"
                                >
                                  {isPending ? 'Revoking...' : 'Revoke'}
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
                ]}
                data={minterMembers}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="sticky bottom-0 left-0 right-0 bg-background flex flex-col sm:flex-row justify-between items-center gap-2 pb-4">
        <p className="text-sm text-gray-500 whitespace-nowrap">
          Total: {count}
        </p>
        <UrlPagination totalPages={totalPages} />
      </div>
    </>
  );
}
