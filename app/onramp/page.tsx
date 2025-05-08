
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import Onramp from './onramp';
import { getCommunity } from '@/services/cw';

const PRESET_AMOUNTS = [10, 20, 50, 100];
const ALIAS = 'wallet.pay.brussels';

export default function page() {
    return (
        <div className="w-full max-w-md mx-auto px-4 mt-4">

            <Suspense fallback={<Fallback />}>
                <PageLoader />
            </Suspense>
        </div>
    )
}

async function PageLoader() {
    const { community } = await getCommunity(ALIAS);
    const image = community.community.logo;
    return (
        <Onramp image={image} />
    );
}

function Fallback() {
    return (
        <form className="space-y-6">
            <h2 className="text-2xl font-bold">Top Up Account</h2>

            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
            </div>

            <div className="space-y-4">
                <Label>Select Amount</Label>
                <div className="grid grid-cols-2 gap-4">
                    {PRESET_AMOUNTS.map((index) => (
                        <Skeleton className="h-4 w-full" key={index} />

                    ))}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="customAmount">Custom Amount</Label>
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        </form >
    );
}
