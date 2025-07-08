'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { MemberT } from '@/services/chain-db/members';
import {
    CommunityConfig,
    hasRole as CWCheckRoleAccess,
    MINTER_ROLE
} from '@citizenwallet/sdk';
import { Row } from '@tanstack/react-table';
import { JsonRpcProvider } from 'ethers';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HasRoleColumn({
    row,
    communityConfig
}: {
    row: Row<MemberT>,
    communityConfig: CommunityConfig,

}) {

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

