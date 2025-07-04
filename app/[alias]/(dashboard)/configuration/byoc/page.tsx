import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { Suspense } from 'react';
import ByocFallback from '../_components/byoc-fallback';
import BYOCForm from './byoc';

export default async function page(props: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await props.params;

    const client = getServiceRoleClient();
    const { data, error } = await getCommunityByAlias(client, alias);

    if (error || !data) {
        throw new Error('Failed to get community by alias');
    }

    const config = data.json;


    return (
        <Suspense
            key={alias + config}
            fallback={<ByocFallback />}
        >
            <BYOCForm config={config} />
        </Suspense>
    )
}
