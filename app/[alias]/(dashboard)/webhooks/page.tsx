import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import UrlSearch from '@/components/custom/url-search';
import { DataTable } from '@/components/ui/data-table';
import { Suspense } from 'react';
import Webhooks from './webhooks';
import { placeholderData, skeletonColumns } from '../admins/_table/columns';

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

            <Suspense key={alias + query + page} fallback={<Fallback />}>
                <Webhooks />
            </Suspense>
        </div>
    );
}

function Fallback() {
    return (
        <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto rounded-md border">
                <DataTable columns={skeletonColumns} data={placeholderData} />
            </div>
        </div>
    );
}
