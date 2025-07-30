import { getMembersAction } from '@/app/[alias]/(dashboard)/members/action';
import { getTransfersOfTokenAction } from '@/app/[alias]/(dashboard)/transfers/actions';
import { getAuthUserAction } from '@/app/_actions/user-actions';
import {
  MetricCard,
  MetricCardSkeleton
} from '@/components/custom/metric-card';
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

  const { data, error } = await getCommunityByAlias(client, alias);

  if (error || !data) {
    throw new Error('Failed to get community by alias');
  }

  const { count } = await getMembersAction({
    config: data.json,
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
  const { data, error } = await getCommunityByAlias(client, alias);

  if (error || !data) {
    throw new Error('Failed to get community by alias');
  }

  const { count } = await getTransfersOfTokenAction({
    config: data.json,
    query: '',
    page: 1
  });

  return (
    <MetricCard
      icon={<CreditCard className="h-full w-full text-slate-600" />}
      title="Transactions"
      value={count || 0}
    />
  );
}
