import { CreditCard, Users } from 'lucide-react';
import {
  MetricCard,
  MetricCardSkeleton
} from '@/components/custom/metric-card';
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getCommunity_supabaseclient,getCommunity,getCommunitychainid } from './actions';


export default async function ProductsPage(props: {
  params: Promise<{ alias: string }>;
}) {

  const { alias } = await props.params;
  console.log(alias)

  // const respon = await getCommunity(alias)
  // console.log(respon)

    // const chainid = await getCommunitychainid(alias);
    // console.log(chainid)

  const supabaseUrl = await getCommunity_supabaseclient(alias);
  console.log(supabaseUrl)

  return (
    <div className="grid grid-cols-4 gap-4">
      <Suspense
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
        fallback={
          <MetricCardSkeleton
            icon={<CreditCard className="h-full w-full text-slate-600" />}
            title="Transactions"
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
