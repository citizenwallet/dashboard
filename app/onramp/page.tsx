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

    const { account } = await props.searchParams;

    return (
        <>

            <Suspense
                fallback={<Skeleton className="h-[125px] w-full rounded-xl" />}
            >
                <AsyncPage account={account} />
            </Suspense>

        </>
    )
}

async function AsyncPage({ account }: { account: string }) {

    const transakConfig: TransakConfig = {
        apiKey: process.env.TRANSAK_API_KEY || '',
        environment: Transak.ENVIRONMENTS.STAGING,
        walletAddress: account,
        defaultCryptoCurrency: 'POL',
        network: 'polygon',
        colorMode: 'LIGHT',
        backgroundColors: "#ffffff",
        hideMenu: true
    }

    return (
        <TransakWidget transakConfig={transakConfig} />
    );
}

