import { columns, skeletonColumns, IMember } from './columns';
import ServerDataTable from '@/components/custom/data-table/server-data-table';
import { DataTable } from '@/components/ui/data-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Suspense } from 'react';
import { getMembersData } from './action';


const placeholderData: IMember[] = Array(5).fill({
  created_at: '',
  account: '',
  username: '',
  name: '',
  description: '',
  image: '',
  image_medium: '',
  image_small: '',
  token_id:'',
  updated_at: '',
});

export default async function MembersPage(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const { alias } = await props.params;
  const { query = '', page = '1' } = await props.searchParams;

  const res = await getMembersData(Number(page),query);
  const member: IMember[] = res.data;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>Members of the community.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="relative w-full h-full overflow-auto">
          <div className="min-w-[800px]">
            <Suspense
              fallback={
                <DataTable columns={skeletonColumns} data={placeholderData} />
              }
            >
              {getMembers(member,res.total)}
            </Suspense>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function getMembers(member:IMember[],total:number) {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <ServerDataTable<IMember>
      columns={columns}
      rows={member}
      total={total}
      totalPages={Math.ceil(total/10)}
    />
  );
}

