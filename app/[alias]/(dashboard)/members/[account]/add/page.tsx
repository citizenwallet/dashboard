import { Skeleton } from '@/components/ui/skeleton';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import {
  CommunityConfig,
  Config,
  getTwoFAAddress,
  hasProfileAdminRole as CWHasProfileAdminRole
} from '@citizenwallet/sdk';
import { Suspense } from 'react';
import Profile from './profile';
import { auth } from '@/auth';

interface PageProps {
  params: Promise<{
    account: string;
    alias: string;
  }>;
}

export default async function page(props: PageProps) {
  const { account, alias } = await props.params;
  const client = getServiceRoleClient();
  const { data, error } = await getCommunityByAlias(client, alias);

  if (error || !data) {
    throw new Error('Failed to get community by alias');
  }

  const config = data.json;

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
  if (!session) {
    throw new Error('You are not logged in');
  }
  const { email } = session.user;
  if (!email) {
    throw new Error('You are not logged in');
  }

  const communityConfig = new CommunityConfig(config);

  const twoFAAddress = await getTwoFAAddress({
    community: communityConfig,
    source: email,
    type: 'email'
  });

  const hasProfileAdminRole = await CWHasProfileAdminRole(
    communityConfig,
    twoFAAddress ?? ''
  );

  return <Profile config={config} account={account} hasProfileAdminRole={hasProfileAdminRole} />;
}
