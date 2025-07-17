import { getAuthUserAction } from '@/app/_actions/user-actions';
import {
  MetricCard,
  MetricCardSkeleton
} from '@/components/custom/metric-card';
import { getServiceRoleClient as getChainDbServiceRoleClient } from '@/services/chain-db';
import { getMembers } from '@/services/chain-db/members';
import { getTransfersOfToken } from '@/services/chain-db/transfers';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { SupabaseClient } from '@supabase/supabase-js';
import { CreditCard, Users } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await props.params;
  const client = getServiceRoleClient();
  const { data } = await getCommunityByAlias(client, alias);

  if (!data?.active) {
    redirect(`/${alias}/profile`);
  }

  const { data: communityData, error: communityError } = await getCommunityByAlias(client, alias);

  if (communityError || !communityData) {
    redirect('/');
  }

  const chain_id = communityData.chain_id;

  const response = await getAuthUserAction({ chain_id });

  if (!response || !response.data) {
    redirect(`/${alias}/login`);
  }

  const { data: user } = response;
  const accessList = user?.users_community_access.map((access) => access) ?? [];
  let hasAccess = false;

  if (user.role === 'user' && accessList.length > 0) {

    if (accessList[0].alias == alias) {
      hasAccess = true;
    }
  }

  if (user?.role === 'admin') {
    hasAccess = true;
  }

  return (

    <>
      {hasAccess ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Suspense
            key={`${alias}-members`}
            fallback={
              <MetricCardSkeleton
                icon={<Users className="h-full w-full text-slate-600" />}
                title="Members"
              />
            }
          >
            {getMembersOverview({ alias, client })}
          </Suspense>

          <Suspense
            key={`${alias}-transactions`}
            fallback={
              <MetricCardSkeleton
                icon={<CreditCard className="h-full w-full text-slate-600" />}
                title="Transfers"
              />
            }
          >
            {getTransactionsOverview({ alias, client })}
          </Suspense>
        </div >

      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-2xl font-bold">You are not an admin of this community</p>
        </div>
      )
      }

    </>
  );
}

async function getMembersOverview({ alias, client }: { alias: string, client: SupabaseClient }) {

  const { data: communityData, error: communityError } = await getCommunityByAlias(client, alias);

  if (communityError || !communityData) {
    throw new Error('Failed to get community by alias');
  }

  const { chain_id: chainId, address: profileContract } = communityData.json.community.profile;
  const supabase = getChainDbServiceRoleClient(chainId);


  const { count } = await getMembers({
    client: supabase,
    profileContract,
    query: '',
    page: 1,
    showAllMembers: true
  });

  return (
    <MetricCard
      icon={<Users className="h-full w-full text-slate-600" />}
      title="Members"
      value={count || 0}
    />
  );
}

async function getTransactionsOverview({ alias, client }: { alias: string, client: SupabaseClient }) {
  const { data: communityData, error: communityError } = await getCommunityByAlias(client, alias);

  if (communityError || !communityData) {
    throw new Error('Failed to get community by alias');
  }

  const { chain_id: chainId, address: tokenAddress } =
    communityData.json.community.primary_token;
  const supabase = getChainDbServiceRoleClient(chainId);


  const { count } = await getTransfersOfToken({
    client: supabase,
    token: tokenAddress,
    query: '',
    page: 1,
  })


  return (
    <MetricCard
      icon={<CreditCard className="h-full w-full text-slate-600" />}
      title="Transactions"
      value={count || 0}
    />
  );
}
