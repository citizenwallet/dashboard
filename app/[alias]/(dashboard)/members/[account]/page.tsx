import { fetchCommunityByAliasAction } from "@/app/_actions/community-actions";
import Profile from "./profile";
import { getMemberByAccount } from "@/services/chain-db/members";
import { getServiceRoleClient } from '@/services/chain-db';

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Config } from '@citizenwallet/sdk';

interface PageProps {
    params: Promise<{
        account: string;
        alias: string;
    }>;
}

export default async function page(props: PageProps) {

    const { account, alias } = await props.params;
    const { community: config } = await fetchCommunityByAliasAction(alias);

    return (

        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Member Profile</h1>
                    <p className="text-sm text-muted-foreground">{config.community.name}</p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden mt-3">
                <div className="h-full overflow-y-auto rounded-md border-none">
                    <Suspense
                        fallback={<Skeleton className="h-[125px] w-full rounded-xl" />}
                    >
                        <AsyncPage config={config} account={account} />
                    </Suspense>
                </div>
            </div>
        </div>

    )
}


async function AsyncPage({ config, account }: { config: Config, account: string }) {

    const supabase = getServiceRoleClient(config.community.profile.chain_id);
    const member = await getMemberByAccount({ client: supabase, account });
    console.log(member.data)

    return (
        <Profile />
    );
}


