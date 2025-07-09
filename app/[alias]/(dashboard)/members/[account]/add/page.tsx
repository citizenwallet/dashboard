import { auth } from '@/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { getCommunity } from '@/services/cw';
import {
  CommunityConfig,
  Config,
  hasRole as CWCheckRoleAccess,
  PROFILE_ADMIN_ROLE
} from '@citizenwallet/sdk';
import { JsonRpcProvider } from 'ethers';
import { Suspense } from 'react';
import Profile from './profile';

interface PageProps {
  params: Promise<{
    account: string;
    alias: string;
  }>;
}

export default async function page(props: PageProps) {
  const { account, alias } = await props.params;
  const { community: config } = await getCommunity(alias);

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Member Profile</h1>
          <p className="text-sm text-muted-foreground">
            {config.community.name}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden mt-3">
        <div className="h-full overflow-y-auto rounded-md border-none">
          <Suspense
            key={account + alias}
            fallback={<Skeleton className="h-[125px] w-full rounded-xl" />}
          >
            <AsyncPage config={config} account={account} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function AsyncPage({
  config,
  account
}: {
  config: Config;
  account: string;
}) {

  const session = await auth();
  const community = new CommunityConfig(config);
  const tokenAddress = community.primaryToken.address;
  const primaryRpcUrl = community.primaryRPCUrl;
  const rpc = new JsonRpcProvider(primaryRpcUrl);
  let hasRole = false;

  try {
    hasRole = await CWCheckRoleAccess(
      tokenAddress,
      PROFILE_ADMIN_ROLE,
      session?.user?.address || '',
      rpc
    );
  } catch (error) {
    console.error(error);
  }

  return <Profile config={config} account={account} hasProfileAdminRole={hasRole} />;
}
