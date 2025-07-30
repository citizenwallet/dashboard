import { Skeleton } from '@/components/ui/skeleton';
import { getServiceRoleClient } from '@/services/chain-db';
import { getEventByContractAndTopic, getEventsByChainId } from '@/services/chain-db/event';
import { getWebhookById } from '@/services/chain-db/webhooks';
import { getServiceRoleClient as getServiceRoleClientTopDb } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { Config } from '@citizenwallet/sdk';
import { Suspense } from 'react';
import { WebhookForm } from './edit-page';


export default async function Page(props: {
    params: Promise<{ alias: string, id: string }>;
}) {
    const { alias, id } = await props.params;
    const client = getServiceRoleClientTopDb();
    const { data, error } = await getCommunityByAlias(client, alias);

    if (error || !data) {
        throw new Error('Failed to get community by alias');
    }

    const config = data.json;

    return (
        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Webhooks</h1>
                    <p className="text-sm text-gray-500">{config.community.name}</p>
                </div>

            </div>

            <Suspense fallback={<Fallback />}>
                <PageLoader config={config} id={id} />
            </Suspense>
        </div>
    );
}



async function PageLoader({
    config,
    id
}: {
    config: Config,
    id: string
}) {

    const { chain_id: chainId } = config.community.profile;

    const supabase = getServiceRoleClient(chainId);

    const { data, error } = await getWebhookById({
        client: supabase,
        id: id
    });

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>Webhook not found</div>;
    }

    const { data: events } = await getEventsByChainId({
        client: supabase,
        chainId: chainId.toString(),
        alias: config.community.alias
    });


    const { data: event } = await getEventByContractAndTopic({
        client: supabase,
        chainId: chainId.toString(),
        contract: data.event_contract,
        topic: data.event_topic || null,
        alias: config.community.alias
    });


    return (
        <WebhookForm
            webhook={data}
            config={config}
            events={events || []}
            selectedEvent={event || null}
        />
    )
}


function Fallback() {
    return (
        <>
            <div className="space-y-6">
                <div className="space-y-6">
                    <div>
                        <div className="mb-2 font-medium">Name</div>
                        <Skeleton className="h-10 w-full" />
                        <div className="mt-1 text-sm text-gray-500">A descriptive name for your webhook.</div>
                    </div>

                    <div>
                        <div className="mb-2 font-medium">Event Topic</div>
                        <Skeleton className="h-10 w-full" />
                        <div className="mt-1 text-sm text-gray-500">The event that will trigger this webhook.</div>
                    </div>

                    <div>
                        <div className="mb-2 font-medium">URL</div>
                        <Skeleton className="h-10 w-full" />
                        <div className="mt-1 text-sm text-gray-500">The URL that will receive the webhook payload.</div>
                    </div>

                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-10 w-24" />
                        </div>
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        </>
    );
}

