import {
  getAuthUserRoleInAppAction,
  getAuthUserRoleInCommunityAction
} from '@/app/_actions/user-actions';
import { Skeleton } from '@/components/ui/skeleton';
import { getServiceRoleClient } from '@/services/chain-db';
import { getMemberByAccount } from '@/services/chain-db/members';
import { getCommunity } from '@/services/cw';
import { Config } from '@citizenwallet/sdk';
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
            <AsyncPage config={config} account={account} alias={alias} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function AsyncPage({
  config,
  account,
  alias
}: {
  config: Config;
  account: string;
  alias: string;
}) {
  const supabase = getServiceRoleClient(config.community.profile.chain_id);
  const profileContract = config.community.profile.address;
  const { data } = await getMemberByAccount({
    client: supabase,
    account,
    profileContract
  });
  if (!data) {
    return <div>Member not found</div>;
  }

  //check admin role
  const roleInApp = await getAuthUserRoleInAppAction();
  const roleResult = await getAuthUserRoleInCommunityAction({ alias });
  let hasAdminRole = false;

  if (roleInApp == 'admin' || roleResult == 'owner') {
    hasAdminRole = true;
  }
  return (
    <Profile memberData={data} hasAdminRole={hasAdminRole} config={config} />
  );
}
