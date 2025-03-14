import { CreditCard, Users } from 'lucide-react';
import {
  MetricCard,
  MetricCardSkeleton
} from '@/components/custom/metric-card';
import { Suspense } from 'react';
import { getMembersAction } from '@/app/[alias]/(dashboard)/members/action';
import { getTransfersOfTokenAction } from '@/app/[alias]/(dashboard)/transfers/actions';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';
import {CommunityConfig} from '@citizenwallet/sdk'

export default async function ProductsPage(props: {
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await props.params;

  return (
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
        {getMembersOverview({alias})}
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
        {getTransactionsOverview({alias})}
      </Suspense>
    </div>
  );
}


async function getMembersOverview({alias}: {alias: string}) {
  const config = await fetchCommunityByAliasAction(alias);

  if (!config) {
    return null;
  }

  const communityConfig = new CommunityConfig(config.community)

  const primaryToken = communityConfig.primaryToken;

  const { data, count } = await getMembersAction({
    chainId: primaryToken.chain_id,
    profile_contract: communityConfig.community.profile.address,
    query: '',
    page: 1
  });

  return (
    <MetricCard
      icon={<Users className="h-full w-full text-slate-600" />}
      title="Members"
      value={count || 0}
      // change={{
      //   value: 11.0, 
      //   trend: 'up'
      // }}
    />
  );
}

async function getTransactionsOverview({alias}: {alias: string}) {
  const config = await fetchCommunityByAliasAction(alias);

  if (!config) {
    return null;
  }

   const communityConfig = new CommunityConfig(config.community);

   const primaryToken = communityConfig.primaryToken;

   const { data, count } = await getTransfersOfTokenAction({
     chainId: primaryToken.chain_id,
     tokenAddress: primaryToken.address,
     query: '',
     page: 1
   });

  return (
    <MetricCard
      icon={<CreditCard className="h-full w-full text-slate-600" />}
      title="Transactions"
      value={count || 0}
      // change={{
      //   value: 22.0,
      //   trend: 'down'
      // }}
    />
  );
}
