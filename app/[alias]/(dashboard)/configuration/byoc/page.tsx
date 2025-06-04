import React from 'react'
import BYOCForm from './byoc';

export default async function page(props: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await props.params;
    return (
        <>
            <BYOCForm alias={alias} />
        </>
    )
}
