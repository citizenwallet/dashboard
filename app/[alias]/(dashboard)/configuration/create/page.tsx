import React from 'react'
import CreateForm from './create';

export default async function page(props: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await props.params;
    return (
        <>
            <CreateForm alias={alias} />
        </>
    )
}
