'use client';

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
import { MemberT } from '@/services/chain-db/members';
import {
    BundlerService,
    CommunityConfig,
    Config,
    hasRole as CWCheckRoleAccess,
    PROFILE_ADMIN_ROLE,
    waitForTxSuccess,
} from '@citizenwallet/sdk';
import { Row } from '@tanstack/react-table';
import { JsonRpcProvider, Wallet } from 'ethers';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'state/session/action';


export default function ActionColumn({ row, config }: { row: Row<MemberT>, config: Config }) {


    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [hasProfileAdminRole, setHasProfileAdminRole] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [, sessionActions] = useSession(config);

    const { account, username } = row.original;
    const isAnonymous = username?.includes('anonymous');
    const router = useRouter();

    useEffect(() => {
        const checkProfileAdminRole = async () => {
            try {
                setIsLoading(true);

                const community = new CommunityConfig(config);
                const signerAccountAddress = await sessionActions.getAccountAddress();

                const tokenAddress = community.primaryToken.address;
                const primaryRpcUrl = community.primaryRPCUrl;
                const rpc = new JsonRpcProvider(primaryRpcUrl);

                const hasRole = await CWCheckRoleAccess(
                    tokenAddress,
                    PROFILE_ADMIN_ROLE,
                    signerAccountAddress || '',
                    rpc
                );

                setHasProfileAdminRole(hasRole);

            } catch (error) {
                console.error('Error checking profile admin role:', error);

            } finally {
                setIsLoading(false);
            }
        };

        checkProfileAdminRole();
    }, [config, sessionActions]);

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const onRemoveMember = async () => {
        try {
            setIsPending(true);

            const community = new CommunityConfig(config);
            const bundler = new BundlerService(community);

            const privateKey = sessionActions.storage.getKey('session_private_key');

            if (!privateKey) {
                toast.error('Please login to remove a member');
                setIsPending(false);
                router.push(`/${config.community.alias}/login`);
                return;
            }
            const signerAccountAddress = await sessionActions.getAccountAddress();

            const signer = new Wallet(privateKey as string);

            const txHash = await bundler.burnProfile(
                signer,
                signerAccountAddress || '',
                account
            );

            await waitForTxSuccess(community, txHash);

            await new Promise(resolve => setTimeout(resolve, 250));

            toast.success('Member removed successfully');
            router.refresh();

            handleCloseDialog();
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


    if (isLoading) {
        return <Skeleton className="h-4 w-24" />;
    }

    return (
        <>
            {!isAnonymous && hasProfileAdminRole && (
                <>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            disabled={isPending}
                            onClick={handleOpenDialog}
                        >
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
                                    <Button type="button" variant="outline" disabled={isPending}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </>
    );
}

