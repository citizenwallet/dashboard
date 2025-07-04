import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { Suspense } from 'react';
import Fallback from './_components/fallback';
import ProfilePage from './profile';

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
                            key={alias}
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
    const client = getServiceRoleClient();
    const { data, error } = await getCommunityByAlias(client, alias);

    if (error || !data) {
        throw new Error('Failed to get community by alias');
    }

    const config = data.json;
    return (
        <ProfilePage config={config} />
    );
}