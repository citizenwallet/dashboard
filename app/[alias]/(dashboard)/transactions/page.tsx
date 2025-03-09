import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { getTransactions } from '../actions';

export default async function TransactionsPage(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ q: string; offset: string; page: number }>;
}) {
  const { alias } = await props.params;
  const page = (await props.searchParams)?.page
    ? (await props.searchParams).page
    : 1;

  const transactions = await getTransactions(alias, page);

  return (
    <div>
      {/* <h1>Transactions for {alias}</h1> */}

      <Card>
        <CardHeader>
          <CardTitle>Transactions for {alias}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>value</TableHead>
                <TableHead className="text-right">created_at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.array.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {transaction.data?.from}
                  </TableCell>
                  <TableCell>{transaction.data?.to}</TableCell>
                  <TableCell>{transaction.data?.value}</TableCell>
                  <TableCell className="text-right">
                    {' '}
                    {new Date(transaction.created_at).toLocaleDateString(
                      'en-US'
                    )}{' '}
                    {new Date(transaction.created_at).toLocaleTimeString(
                      'en-US'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-7">
            <PaginationWithLinks page={page} pageSize={10} totalCount={100} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
