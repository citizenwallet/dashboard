import { DataTable } from '@/components/ui/data-table';
import { getServiceRoleClient } from '@/services/chain-db';
import { getPaymasterByAlias } from "@/services/chain-db/paymaster";
import { getCommunity } from "@/services/cw";
import { Suspense } from "react";
import { placeholderData, skeletonColumns } from "./_components/fallback";
import PaymasterTable from "./paymaster-table";
import { Config } from '@citizenwallet/sdk';

export default async function page(props: {
    params: Promise<{ alias: string }>;
    searchParams: Promise<{
        page?: string;
    }>;
}) {
    const { alias } = await props.params;
    const { community: config } = await getCommunity(alias);
    const { page: pageParam } = await props.searchParams;
    const page = pageParam || '1';

    return (
        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Paymaster</h1>
                    <p className="text-sm text-gray-500"> update whitelist on paymaster contract </p>
                </div>
            </div>
            <Suspense fallback={<Fallback />} >
                <PageLoader config={config} page={page} />
            </Suspense>
        </div>
    )
}


async function PageLoader({
    config,
    page
}: {
    config: Config,
    page: string;
}) {

    const { chain_id: chainId } = config.community.profile;

    const supabase = getServiceRoleClient(chainId);

    const { data: paymasterData } = await getPaymasterByAlias({
        client: supabase,
        alias: config.community.alias,
        page: parseInt(page)
    });


    return (
        <PaymasterTable
            initialData={paymasterData || []}
            config={config}
        />
    )
}



function Fallback() {
    return (
        <>
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto rounded-md border">
                    <DataTable columns={skeletonColumns} data={placeholderData} />
                </div>
            </div>
        </>
    );
}
