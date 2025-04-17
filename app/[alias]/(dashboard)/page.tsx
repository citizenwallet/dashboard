import { CreditCard, Users } from 'lucide-react';
import {
  MetricCard,
  MetricCardSkeleton
} from '@/components/custom/metric-card';
import { Suspense } from 'react';
import { getMembersAction } from '@/app/[alias]/(dashboard)/members/action';
import { getTransfersOfTokenAction } from '@/app/[alias]/(dashboard)/transfers/actions';
import { fetchCommunityByAliasAction } from '@/app/_actions/community-actions';

export default async function Page(props: {
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
        {getMembersOverview({ alias })}
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
        {getTransactionsOverview({ alias })}
      </Suspense>
    </div>
  );
}

async function getMembersOverview({ alias }: { alias: string }) {
  const { community: config } = await fetchCommunityByAliasAction(alias);

  const { count } = await getMembersAction({
    config,
    query: '',
    page: 1,
    showAllMembers: true
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

async function getTransactionsOverview({ alias }: { alias: string }) {
  const { community: config } = await fetchCommunityByAliasAction(alias);

  const { count } = await getTransfersOfTokenAction({
    config,
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
