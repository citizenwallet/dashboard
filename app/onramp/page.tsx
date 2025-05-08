
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import Onramp from './onramp';
import { getCommunity } from '@/services/cw';
import { CommunityConfig, getProfileFromAddress, ProfileWithTokenId } from '@citizenwallet/sdk';

const PRESET_AMOUNTS = [10, 20, 50, 100];
const ALIAS = 'wallet.pay.brussels';

interface OnrampProps {
    searchParams: Promise<{
        account?: string;
        sigAuthAccount?: string;
        sigAuthExpiry?: string;
        sigAuthSignature?: string;
        sigAuthRedirect?: string;
    }>;
}

export default async function page({ searchParams }: OnrampProps) {

    const {
        account,
        sigAuthAccount,
        sigAuthExpiry,
        sigAuthSignature,
        sigAuthRedirect,
    } = await searchParams;

    return (
        <div className="w-full max-w-md mx-auto px-4 mt-4">

            <Suspense fallback={<Fallback />}>
                <PageLoader
                    account={account}
                    sigAuthAccount={sigAuthAccount}
                    sigAuthExpiry={sigAuthExpiry}
                    sigAuthSignature={sigAuthSignature}
                    sigAuthRedirect={sigAuthRedirect}
                />
            </Suspense>
        </div>
    )
}

async function PageLoader(
    {
        account,
        sigAuthAccount,
        sigAuthExpiry,
        sigAuthSignature,
        sigAuthRedirect
    }: {
        account?: string;
        sigAuthAccount?: string;
        sigAuthExpiry?: string;
        sigAuthSignature?: string;
        sigAuthRedirect?: string;
    }
) {
    const { community } = await getCommunity(ALIAS);
    const image = community.community.logo;
    const communityConfig = new CommunityConfig(community);

    let connectedAccount: string | undefined;
    if (sigAuthAccount && sigAuthExpiry && sigAuthSignature && sigAuthRedirect) {
        try {
            if (new Date().getTime() > new Date(sigAuthExpiry).getTime()) {
                throw new Error("Signature expired");
            }
            connectedAccount = sigAuthAccount;
        } catch (e) {
            console.error("Failed to verify signature:", e);
        }
    }
    if (account) {
        connectedAccount = account;
    }

    let connectedProfile: ProfileWithTokenId | null = null;
    if (connectedAccount) {
        connectedProfile = await getProfileFromAddress(
            process.env.IPFS_DOMAIN!,
            communityConfig,
            connectedAccount
        );
    }

    return (
        <Onramp
            image={image}
            connectedAccount={connectedAccount}
            connectedProfile={connectedProfile}

        />
    );
}

function Fallback() {
    return (
        <form className="space-y-6">
            <h2 className="text-2xl font-bold">Top Up Account</h2>

            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-4">
                <Label>Select Amount</Label>
                <div className="grid grid-cols-2 gap-4">
                    {PRESET_AMOUNTS.map((index) => (
                        <Skeleton className="h-16 w-full" key={index} />

                    ))}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="customAmount">Custom Amount</Label>
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </form >
    );
}
