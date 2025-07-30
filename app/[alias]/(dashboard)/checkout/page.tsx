import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import {
  CommunityConfig,
  Config,
  getAccountBalance,
  getTwoFAAddress
} from '@citizenwallet/sdk';
import { formatUnits } from 'ethers';
import { Suspense } from 'react';
import { CheckoutFlow } from './checkout-flow';
import { CheckoutFlowTestnet } from './checkout-flow-testnet';
import {
  chains,
  getSessionFactoryAddressOfChain,
  getSessionProviderAddressOfChain,
  getRpcUrlOfChain,
  mainnetChains,
  testnetChains
} from '@/lib/chain';

interface CheckoutPageProps {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{
    option: 'byoc' | 'create';
    address: string;
  }>;
}

export default async function CheckoutPage(props: CheckoutPageProps) {
  const { alias } = await props.params;

  const { option, address } = await props.searchParams;

  const client = getServiceRoleClient();
  const { data, error } = await getCommunityByAlias(client, alias);

  if (error || !data) {
    throw new Error('Failed to get community by alias');
  }

  const config = data.json;

  const { data: ctzn_data, error: ctzn_error } = await getCommunityByAlias(
    client,
    'ctzn'
  );

  if (ctzn_error || !ctzn_data) {
    throw new Error('Failed to get CTZN community by alias');
  }

  const CTZN_config = ctzn_data.json;

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Activate your token</h1>
          <p className="text-sm text-muted-foreground">
            In order to get started, we need to set up a few things on{' '}
            {chains.find((chain) => Number(chain.id) === data.chain_id)?.name}.
            This process is powered by CTZN tokens.
          </p>
        </div>
      </div>

      {option !== 'byoc' && option !== 'create' ? (
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Invalid option</p>
        </div>
      ) : (
        <Suspense fallback={<CheckoutSkeleton />}>
          <CheckoutLoader
            option={option}
            config={config}
            address={address}
            ctzn_config={CTZN_config}
          />
        </Suspense>
      )}
    </div>
  );
}

async function CheckoutLoader({
  option,
  config,
  address,
  ctzn_config
}: {
  option: 'byoc' | 'create';
  config: Config;
  address: string;
  ctzn_config: Config;
}) {
  const session = await auth();
  if (!session) {
    throw new Error('You are not logged in');
  }

  const { email } = session.user;
  if (!email) {
    throw new Error('You are not logged in');
  }

 const ctzn_communityConfig = new CommunityConfig(ctzn_config);
 const myCommunityConfig = new CommunityConfig(config);
 const myCommunityChainId = myCommunityConfig.primaryToken.chain_id;

 const [ctznAccountAddress, myCommunityAccountAddress] = await Promise.all([
   getTwoFAAddress({
     community: ctzn_communityConfig,
     source: email,
     type: 'email'
   }),
   getTwoFAAddress({
     community: myCommunityConfig,
     source: email,
     type: 'email',
     options: {
       sessionFactoryAddress: getSessionFactoryAddressOfChain(
         myCommunityChainId.toString()
       ),
       sessionProviderAddress: getSessionProviderAddressOfChain(
         myCommunityChainId.toString()
       ),
       rpcUrl: getRpcUrlOfChain(myCommunityChainId.toString())
     }
   })
 ]);

 // Check addresses in one block
 if (!ctznAccountAddress || !myCommunityAccountAddress) {
   throw new Error(
     !ctznAccountAddress
       ? `Cannot get account address for ${ctzn_communityConfig.community.name}`
       : `Cannot get account address for ${myCommunityConfig.community.name}`
   );
 }


  const balance = await getAccountBalance(
    ctzn_communityConfig,
    ctznAccountAddress
  );
  const balanceFormatted = balance
    ? Number(formatUnits(balance, ctzn_communityConfig.getToken().decimals))
    : 0;

  if (
    testnetChains.find(
      (chain) => Number(chain.id) === Number(myCommunityChainId)
    )
  ) {
    return (
      <CheckoutFlowTestnet
        option={option}
        config={config}
        byocTokenAddress={address}
        myCommunityAccountAddress={myCommunityAccountAddress}
      />
    );
  }

  if (
    mainnetChains.find(
      (chain) => Number(chain.id) === Number(myCommunityChainId)
    )
  ) {
    return (
      <CheckoutFlow
        option={option}
        config={config}
        byocTokenAddress={address}
        ctzn_config={ctzn_config}
        ctznAccountAddress={ctznAccountAddress}
        myCommunityAccountAddress={myCommunityAccountAddress}
        initialCtznBalance={balanceFormatted}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">
          Unsupported Chain ID: {myCommunityChainId}
        </p>
      </div>
    </>
  );
}

function CheckoutSkeleton() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}
