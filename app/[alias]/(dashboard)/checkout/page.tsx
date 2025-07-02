import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { Config } from '@citizenwallet/sdk';
import { Suspense } from 'react';
import { CheckoutFlow } from './checkout-flow';

interface CheckoutPageProps {
    params: Promise<{ alias: string }>;
    searchParams: Promise<{
        option: 'byoc' | 'create';
        address: string;
    }>;
}

export default async function CheckoutPage(props: CheckoutPageProps) {
    const { alias } = await props.params;

    const { option, address } = await props.searchParams;

    const client = getServiceRoleClient();
    const { data, error } = await getCommunityByAlias(client, alias);

    if (error || !data) {
        throw new Error('Failed to get community by alias');
    }

    const config = data.json;


    const chains = [
        { id: '100', name: 'Gnosis' },
        { id: '42220', name: 'Celo' },
        { id: '42161', name: 'Arbitrum' },
        { id: '137', name: 'Polygon' }
    ];

    return (
        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Activate your token</h1>
                    <p className="text-sm text-muted-foreground">
                        In order to get started, we need to set up a few things on {chains.find(chain => Number(chain.id) === data.chain_id)?.name}. This process is powered by CTZN tokens.
                    </p>
                </div>
            </div>

            {
                option !== 'byoc' && option !== 'create' ? (
                    <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">
                            Invalid option
                        </p>
                    </div>
                ) : (
                    <Suspense fallback={<CheckoutSkeleton />}>
                        <CheckoutLoader option={option} config={config} address={address} />
                    </Suspense>
                )
            }

        </div>
    );
}

async function CheckoutLoader({
    option, config, address
}: {
    option: 'byoc' | 'create',
    config: Config,
    address: string
}) {


    return <CheckoutFlow option={option} config={config} address={address} />;
}

function CheckoutSkeleton() {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    <Skeleton className="h-6 w-48" />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                </div>
            </CardContent>
        </Card>
    );
}
