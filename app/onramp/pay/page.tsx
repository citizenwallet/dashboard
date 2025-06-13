import { Suspense } from 'react';
import TransakWidget from './TransakWidget';
import { Skeleton } from '@/components/ui/skeleton';
import { TransakConfig, Transak } from '@transak/transak-sdk';
import { getTokenPriceAction, wpolUsdcPriceAction } from '../action';
import { ethers } from 'ethers';
// Import the ABI
import onRampSwapperABI from '../_abi/onRampSwapper.json';

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
      <Suspense fallback={<Skeleton className="h-[125px] w-full rounded-xl" />}>
        <AsyncPage account={account} amount={amount} />
      </Suspense>
    </>
  );
}

async function AsyncPage({
  account,
  amount
}: {
  account: string;
  amount: number;
}) {
  const price = await getTokenPriceAction(amount); //usdc
  const wpolUsdc_Price = Number((await wpolUsdcPriceAction()).toFixed(3)); //wpol
  const wpol_amount = price / wpolUsdc_Price;

  // Generate calldata for onRampAndSwap function
  const calldata = generateCalldata(account);

  const transakConfig: TransakConfig = {
    apiKey: process.env.TRANSAK_API_KEY || '',
    environment: Transak.ENVIRONMENTS.PRODUCTION,
    walletAddress: account,
    fiatCurrency: 'USD',
    fiatAmount: amount,
    network: 'polygon',
    colorMode: 'LIGHT',
    backgroundColors: '#ffffff',
    hideMenu: true,
    // Transak One
    isTransakOne: true,
    smartContractAddress: '0xF6433dee15c1F54A431D186339d9610D3389E152',
    estimatedGasLimit: 300_000,

    sourceTokenData: [
      {
        sourceTokenCode: 'POL',
        sourceTokenAmount: Number(wpol_amount.toFixed(3))
      }
    ],
    cryptoCurrencyData: [
      {
        cryptoCurrencyCode: 'CTZN',
        cryptoCurrencyName: 'Citizen Wallet',
        cryptoCurrencyImageURL:
          'https://assets.citizenwallet.xyz/wallet-config/_images/ctzn.svg'
      }
    ],
    calldata: calldata
  };

  return <TransakWidget transakConfig={transakConfig} />;
}

function generateCalldata(recipient: string): string {
  const iface = new ethers.Interface(onRampSwapperABI);
  const calldata = iface.encodeFunctionData('onRampAndSwap', [recipient, 0]);

  return calldata;
}
