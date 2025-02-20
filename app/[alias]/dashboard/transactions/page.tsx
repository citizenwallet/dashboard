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
  TableRow,
} from "@/components/ui/table";
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { getTransactions } from '../actions';


export default async function TransactionsPage(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ q: string; offset: string,page:number }>;
}) {
  const { alias } = await props.params;
  const { page } = await props.searchParams;

  const transactions = await getTransactions(alias,page);
  console.log(transactions)

  return (
    <div>
      {/* <h1>Transactions for {alias}</h1> */}

      <Card >
        <CardHeader>
          <CardTitle>Transactions for {alias}</CardTitle>
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
            <PaginationWithLinks page={page} pageSize={10} totalCount={100} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
