import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { Suspense } from 'react'
import ProfilePage from './profile';
import Fallback from './_components/fallback';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';

export default async function page(props: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await props.params;

    return (
        <>
            <div className="w-full h-screen overflow-hidden">
                <Card className="w-full h-full border-none flex flex-col">
                    <CardHeader className="flex-shrink-0 px-6 py-4">
                        <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
                        <CardDescription>
                            Configure your profile information and branding settings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto px-6 pb-8">
                        <Suspense
                            fallback={<Fallback />}
                        >
                            {asyncForm({ alias })}
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}


async function asyncForm({ alias }: { alias: string }) {
    const { community: config } = await fetchCommunityByAliasAction(alias);
    return (
        <ProfilePage alias={config.community.alias} />
    );
}