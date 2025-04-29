import { fetchCommunityByAliasAction } from "@/app/_actions/community-actions";
import { getAuthUserRoleInAppAction, getAuthUserRoleInCommunityAction } from "@/app/_actions/user-actions";
import { DataTable } from "@/components/ui/data-table";
import { getServiceRoleClient } from '@/services/chain-db';
import { getAllMembers, getMinterMembers, MemberT } from "@/services/chain-db/members";
import { Config } from "@citizenwallet/sdk";
import { Suspense } from "react";
import { placeholderData, skeletonColumns } from "./_table/columns";
import { MinterMembers } from "./action";
import RolePage from "./RolePage";


interface RolePageProps {
    params: Promise<{ alias: string }>;
    searchParams: Promise<{ page: string }>;
}

export default async function page(props: RolePageProps) {
    const { alias } = await props.params;
    const { page } = await props.searchParams;
    const { community: config } = await fetchCommunityByAliasAction(alias);
    return (
        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Roles</h1>
                    <p className="text-sm text-gray-500">{config.community.name}</p>

                </div>
            </div>


            <Suspense fallback={<Fallback />}>
                <PageLoader config={config} page={page} alias={alias} />
            </Suspense>

        </div>
    )
}

async function PageLoader({
    config,
    page,
    alias
}: {
    config: Config,
    page?: string;
    alias: string;
}) {

    const supabase = getServiceRoleClient(config.community.profile.chain_id);
    const members = await getAllMembers({
        client: supabase,
        profileContract: config.community.profile.address
    });


    const minterMembers = await getMinterMembers({
        client: supabase,
        contractAddress: config.community.primary_token.address,
        page: parseInt(page || '1')
    });


    //check admin role
    const roleInApp = await getAuthUserRoleInAppAction();
    const roleResult = await getAuthUserRoleInCommunityAction({ alias })
    let hasAdminRole = false;

    if (roleInApp == "admin" || roleResult == "owner") {
        hasAdminRole = true;
    }

    return (

        <RolePage
            members={members.data as MemberT[]}
            minterMembers={minterMembers.data as MinterMembers[]}
            count={minterMembers.count || 0}
            config={config}
            hasAdminRole={hasAdminRole}
        />
    )
}

function Fallback() {
    return (
        <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto rounded-md border">
                <DataTable columns={skeletonColumns} data={placeholderData} />
            </div>
        </div>
    );
}