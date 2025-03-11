import { CreditCard, Users } from 'lucide-react';
import {
  MetricCard,
  MetricCardSkeleton
} from '@/components/custom/metric-card';
import { Suspense } from 'react';

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
        {getMembersOverview()}
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
        {getTransactionsOverview()}
      </Suspense>
    </div>
  );
}

async function getMembersOverview() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <MetricCard
      icon={<Users className="h-full w-full text-slate-600" />}
      title="Members"
      value="1,234"
      change={{
        value: 11.0,
        trend: 'up'
      }}
    />
  );
}

async function getTransactionsOverview() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <MetricCard
      icon={<CreditCard className="h-full w-full text-slate-600" />}
      title="Transactions"
      value="5,678"
      change={{
        value: 22.0,
        trend: 'down'
      }}
    />
  );
}
