import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { Suspense } from 'react';
import ByocFallback from '../_components/byoc-fallback';
import BYOCForm from './byoc';

export default async function page(props: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await props.params;
    const { community: config } = await fetchCommunityByAliasAction(alias);

    return (
        <Suspense
            key={alias + config}
            fallback={<ByocFallback />}
        >
            <BYOCForm config={config} />
        </Suspense>
    )
}
