import { Suspense } from "react";
import TransakWidget from "./TransakWidget";
import { Skeleton } from "@/components/ui/skeleton";
import { TransakConfig, Transak } from '@transak/transak-sdk';
import { getTokenPriceAction } from "../action";

interface Props {
    params: Promise<{ alias: string }>;
    searchParams: Promise<{
        account: string;
        amount: number;
    }>;
}

export default async function page(props: Props) {

    const { account, amount } = await props.searchParams;

    return (
        <>

            <Suspense
                fallback={<Skeleton className="h-[125px] w-full rounded-xl" />}
            >
                <AsyncPage account={account} amount={amount} />
            </Suspense>

        </>
    )
}

async function AsyncPage({ account, amount }: { account: string, amount: number }) {


    const price = await getTokenPriceAction(amount);

    const transakConfig: TransakConfig = {
        apiKey: process.env.TRANSAK_API_KEY || '',
        environment: Transak.ENVIRONMENTS.STAGING,
        walletAddress: account,
        fiatCurrency: 'USD',
        fiatAmount: price,
        network: 'polygon',
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

