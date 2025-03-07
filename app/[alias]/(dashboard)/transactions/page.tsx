import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function TransactionsPage(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const { alias } = await props.params;

  return (
    <div>
      <h1>Transactions for {alias}</h1>
    </div>
  );
}
