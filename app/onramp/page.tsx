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
        fiatCurrency: 'USD',
        fiatAmount: 10,
        network: 'polygon-amoy',
        colorMode: 'LIGHT',
        backgroundColors: "#ffffff",
        hideMenu: true,
        // Transak One
        isTransakOne: true,
        smartContractAddress: '0x6b3a1f4277391526413F583c23D5B9EF4d2fE986',
        estimatedGasLimit: 200000,
        sourceTokenData: [
            {
                sourceTokenCode: "POL",
                sourceTokenAmount: 10,
            },
        ],
    }

    return (
        <TransakWidget transakConfig={transakConfig} />
    );
}

