import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { CheckoutFlow } from './checkout-flow';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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

    return (
        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Activate your community</h1>
                    <p className="text-sm text-muted-foreground">
                        In order to get started, we need to publish some contracts. This process is powered by CTZN tokens.
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
                        <CheckoutLoader option={option} />
                    </Suspense>
                )
            }

        </div>
    );
}

async function CheckoutLoader({ option }: { option: 'byoc' | 'create' }) {
    return <CheckoutFlow option={option} />;
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
