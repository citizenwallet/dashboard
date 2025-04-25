'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatAddress } from '@/lib/utils';
import { MemberT } from '@/services/chain-db/members';
import {
  CommunityConfig,
  Config,
  hasRole as CWCheckRoleAccess,
  MINTER_ROLE
} from '@citizenwallet/sdk';
import { ColumnDef } from '@tanstack/react-table';
import { ethers, JsonRpcProvider } from 'ethers';
import { Check, Copy, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { deleteProfileAction } from '../[account]/action';


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

export const createColumns = (
  communityConfig: CommunityConfig,
  config: Config,
): ColumnDef<MemberT>[] => [
    {
      header: 'ID',
      accessorKey: 'id',
      cell: ({ row }) => <IDRow account={row.original.account} />
    },
    {
      header: 'Member',
      cell: ({ row }) => {
        const { image, username, name, account } = row.original;

        const isAnonymous = username?.includes('anonymous');
        const isZeroAddress = ethers.ZeroAddress === account;

        return (
          <div className="flex items-center gap-2 w-[250px]">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={image} alt={username} />
              <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <Link href={`members/${account}`}>
                <span className="font-medium truncate">
                  {isAnonymous
                    ? isZeroAddress
                      ? communityConfig.community.name
                      : `@${username}`
                    : `@${username}`}
                </span>
              </Link>
              <span className="text-xs font-mono truncate">
                {isAnonymous
                  ? isZeroAddress
                    ? communityConfig.community.name
                    : formatAddress(account)
                  : name}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="w-[150px] truncate">{row.original.name}</div>
      )
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) => (
        <div className="min-w-[200px] max-w-[400px] px-4">
          <p className="line-clamp-2 text-sm">{row.original.description}</p>
        </div>
      )
    },
    {
      header: 'Has mint role access?',
      cell: function Cell({ row }) {
        const [hasMintRole, setHasMintRole] = useState<boolean | null>(null);
        const [isPending, setIsPending] = useState(true);
        const account = row.original.account;
        const tokenAddress = communityConfig.primaryToken.address;
        const primaryRpcUrl = communityConfig.primaryRPCUrl;

        useEffect(() => {
          const checkMintRole = async () => {
            try {
              setIsPending(true);
              const rpc = new JsonRpcProvider(primaryRpcUrl);

              const hasRole = await CWCheckRoleAccess(
                tokenAddress,
                MINTER_ROLE,
                account,
                rpc
              );
              setHasMintRole(hasRole);
            } catch (error) {
              console.error('Error checking mint role:', error);
              setHasMintRole(false);
            } finally {
              setIsPending(false);
            }
          };

          checkMintRole();
        }, [account, primaryRpcUrl, tokenAddress]);

        if (isPending) {
          return <Skeleton className="h-4 w-24" />;
        }

        return (
          <div className="inline-flex items-center w-[150px]">
            <span
              className={cn(
                'rounded-full font-medium flex items-center justify-center text-sm py-1 px-2.5',
                hasMintRole
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              {hasMintRole ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  Yes
                </>
              ) : (
                <>
                  <X className="mr-1 h-3 w-3" />
                  No
                </>
              )}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Created at',
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
      header: 'Updated at',
      accessorKey: 'updated_at',
      cell: ({ row }) => {
        const updatedAt = new Date(row.original.updated_at);

        return (
          <div className="w-[150px]">
            <span className="text-muted-foreground text-sm whitespace-nowrap">
              {updatedAt.toLocaleString()}
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

        const { image, account } = row.original;

        const handleOpenDialog = () => {
          setIsDialogOpen(true);
        };

        const handleCloseDialog = () => {
          setIsDialogOpen(false);
        };

        const onRemoveMember = async () => {
          try {
            setIsPending(true);
            await deleteProfileAction(
              image, config.community.alias, config, account
            );
            handleCloseDialog();
            toast.success('Member removed successfully');
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error.message);
            } else {
              toast.error('Could not remove member');
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
                  <DialogTitle>Remove Member</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove this member?

                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start gap-2">
                  <Button
                    disabled={isPending}
                    onClick={onRemoveMember}
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

export const skeletonColumns: ColumnDef<MemberT>[] = [
  {
    header: 'Member',
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
        <Skeleton className="h-4 w-24" />
      </div>
    )
  },
  {
    header: 'Description',
    cell: () => (
      <div className="min-w-[200px] max-w-[400px] px-4">
        <Skeleton className="h-8 w-full" />
      </div>
    )
  },
  {
    header: 'Has mint role access?',
    cell: () => (
      <div className="min-w-[150px]">
        <Skeleton className="h-4 w-16" />
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
    header: 'Updated at',
    cell: () => (
      <div className="min-w-[150px]">
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }
];

export const placeholderData: MemberT[] = Array(5);
