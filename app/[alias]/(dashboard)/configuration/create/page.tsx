import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import { Suspense } from 'react';
import CreateFallback from '../_components/create-fallback';
import CreateForm from './create';

export default async function page(props: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await props.params;
    const { community: config } = await fetchCommunityByAliasAction(alias);

    return (
        <Suspense
            key={alias + config}
            fallback={<CreateFallback />}
        >
            <CreateForm config={config} />
        </Suspense>
    )
}
