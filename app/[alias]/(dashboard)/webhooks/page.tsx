import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { DataTable } from '@/components/ui/data-table';
import { getServiceRoleClient } from '@/services/chain-db';
import { getWebhooks, getWebhookSecret } from '@/services/chain-db/webhooks';
import { Config } from '@citizenwallet/sdk';
import { Suspense } from 'react';
import Webhooks from './webhooks';
import { placeholderData, skeletonColumns } from './_components/columns';
import { Button } from '@/components/ui/button';
import { Copy, Plus } from 'lucide-react';
import { getEvents } from '@/services/chain-db/event';

export default async function Page(props: {
    params: Promise<{ alias: string }>;
    searchParams: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const { alias } = await props.params;
    const { community: config } = await fetchCommunityByAliasAction(alias);

    const { query: queryParam, page: pageParam } = await props.searchParams;
    const query = queryParam || '';
    const page = pageParam || '1';

    return (
        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Webhooks</h1>
                    <p className="text-sm text-gray-500">{config.community.name}</p>
                </div>

            </div>

            <Suspense fallback={<Fallback />}>
                <PageLoader config={config} page={page} query={query} />
            </Suspense>
        </div>
    );
}

async function PageLoader({
    config,
    page,
    query
}: {
    config: Config,
    page?: string;
    query?: string;
}) {

    const { chain_id: chainId } = config.community.profile;

    const supabase = getServiceRoleClient(chainId);

    const { data, count } = await getWebhooks({
        client: supabase,
        query: query || '',
        page: parseInt(page || '1')
    });


    const { data: secretData } = await getWebhookSecret({
        client: supabase,
        alias: config.community.alias
    });


    const { data: events } = await getEvents({
        client: supabase,
        chainId: chainId.toString(),
        alias: config.community.alias
    });

    return (
        <Webhooks
            data={data || []}
            count={count || 0}
            config={config}
            secret={secretData?.secret || ''}
            events={events || []}
        />
    )
}

function Fallback() {
    return (
        <>
            <div className="flex justify-start mb-4">
                <Button >
                    <Plus size={16} />
                    Add Webhook
                </Button>
            </div>

            <div className="flex items-center gap-2 my-2 p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer select-none w-fit">
                <span className="text-sm font-medium text-gray-700">
                    Copy Webhook Secret
                </span>
                <Copy className="ml-1 h-4 w-4 text-gray-500 hover:text-gray-700" />
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto rounded-md border">
                    <DataTable columns={skeletonColumns} data={placeholderData} />
                </div>
            </div>
        </>
    );
}
