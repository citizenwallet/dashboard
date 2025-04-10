import { Suspense } from "react";
import TransakWidget from "./TransakWidget";
import { Skeleton } from "@/components/ui/skeleton";
import { TransakConfig, Transak } from '@transak/transak-sdk';

interface Props {
    params: Promise<{ alias: string }>;
    searchParams: Promise<{
        account: string;
    }>;
}

export default async function page(props: Props) {
    // 0x14808C00d0b434a4035ecC8B129462Cd63B6215A
    const { alias } = await props.params;
    const { account } = await props.searchParams;


    return (
        <div className="flex flex-1 w-full flex-col h-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Onramp</h1>
                    {/* <p className="text-sm text-gray-500">{config.community.name}</p> */}
                </div>

            </div>

            <div className="flex-1 overflow-hidden mt-3">
                <div className="h-full overflow-y-auto rounded-md border-none">
                    <Suspense
                        fallback={<Skeleton className="h-[125px] w-full rounded-xl" />}
                    >
                        <AsyncPage />
                    </Suspense>
                </div>
            </div>

        </div>
    )
}

async function AsyncPage() {

    const transakConfig: TransakConfig = {
        apiKey: process.env.TRANSAK_API_KEY || '',
        environment: Transak.ENVIRONMENTS.STAGING,
        tokenId: 0x0D9B0790E97e3426C161580dF4Ee853E4A7C4607,
        walletAddress: '',
        fiatCurrency: 'USD',
        network: 'polygon',
        colorMode: 'LIGHT',
        backgroundColors: "#ffffff",
        hideMenu: true
    }

    return (
        <TransakWidget transakConfig={transakConfig} />
    );
}

