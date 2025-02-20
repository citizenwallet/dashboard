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
import { getCommunity_supabaseclient, getCommunity, getCommunitychainid, getTransactions } from './actions';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';



export default async function ProductsPage(props: { //http://localhost:3000/bread/dashboard?page=1
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ page: string }>;
}) {

  const { alias } = await props.params;
  const { page } = await props.searchParams;
  console.log(alias)

  // const respon = await getCommunity(alias)
  // console.log(respon)

  // const chainid = await getCommunitychainid(alias);
  // console.log(chainid)

  // const supabaseUrl = await getCommunity_supabaseclient(alias);
  // console.log(supabaseUrl)

  const transactions = await getTransactions(alias);
  console.log(transactions)

  return (
    <div>
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Transactions List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">0x1234...5678</TableCell>
                <TableCell>0xabcd...efgh</TableCell>
                <TableCell>Transfer</TableCell>
                <TableCell className="text-right">100 DEMO</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">0xabcd...efgh</TableCell>
                <TableCell>0x9876...4321</TableCell>
                <TableCell>Transfer</TableCell>
                <TableCell className="text-right">50 DEMO</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">0x8765...4321</TableCell>
                <TableCell>0x1234...5678</TableCell>
                <TableCell>Transfer</TableCell>
                <TableCell className="text-right">75 DEMO</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-7">
            <PaginationWithLinks page={Number(page)} pageSize={10} totalCount={50} />
          </div>
        </CardContent>
      </Card>


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
