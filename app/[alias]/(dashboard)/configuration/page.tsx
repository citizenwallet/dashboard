import React, { Suspense } from 'react'
import ConfigurationPage from './configuration';
import Fallback from './_components/fallback';

export default async function page(props: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await props.params;
    return (
        <>
            <Suspense
                key={alias}
                fallback={<Fallback />}
            >
                <ConfigurationPage alias={alias} />
            </Suspense>
        </>
    )
}

