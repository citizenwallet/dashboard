import { Suspense } from "react";
import RolePage from "./RolePage";
import { fetchCommunityByAliasAction } from "@/app/_actions/community-actions";
import { Config } from "@citizenwallet/sdk";
import { getAllMembers, MemberT } from "@/services/chain-db/members";
import { getServiceRoleClient } from '@/services/chain-db';

interface RolePageProps {
    params: Promise<{ alias: string }>;
}

export default async function page(props: RolePageProps) {
    const { alias } = await props.params;
    const { community: config } = await fetchCommunityByAliasAction(alias);
    return (
        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Roles</h1>
                    <p className="text-sm text-gray-500">{config.community.name}</p>

                </div>
            </div>


            <Suspense fallback={<div>Loading...</div>}>
                <PageLoader {...config} />
            </Suspense>

        </div>
    )
}

async function PageLoader(config: Config) {

    const supabase = getServiceRoleClient(config.community.profile.chain_id);
    const members = await getAllMembers({
        client: supabase,
        profileContract: config.community.profile.address
    });

    return (

        <>
            <RolePage members={members.data as MemberT[]} />
        </>
    )
}

