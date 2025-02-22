import { columns, skeletonColumns, ICommunity } from './columns'
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
import { getCommunitiesData } from './action'
import { SearchInput } from '@/components/custom/url-search';
import CommunityLayout from './mainlayout';


const placeholderData: ICommunity[] = Array(5).fill({
  alias: '',
  name: '',
  logo: ''
});

export default async function CommunitiesPage(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const { alias } = await props.params;
  const { query = '', page = '1' } = await props.searchParams;

  const communities = await getCommunitiesData(Number(page), query);
  const total = communities.total;
  const communitiesData: ICommunity[] = communities.communities.map(({ community }) => ({
    alias: community.alias,
    name: community.name,
    logo: community.logo
  }));


  return (
    <CommunityLayout>


      <div className="grid gap-4">
        <div className="flex justify-end">
          <SearchInput />
        </div>

        <Card className="overflow-hidden h-full flex flex-col">
          <CardHeader>
            <CardTitle>Communities</CardTitle>
            <CardDescription>Browse the list of available communities.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="relative w-full h-full overflow-auto">
              <div className="min-w-[800px]">
                <Suspense
                  fallback={
                    <DataTable columns={skeletonColumns} data={placeholderData} />
                  }
                >
                  {getCommunities(communitiesData, total)}
                </Suspense>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CommunityLayout>

  );
}

async function getCommunities(community: ICommunity[], total: number) {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <ServerDataTable<ICommunity>
      columns={columns}
      rows={community}
      total={total}
      totalPages={Math.ceil(total / 10)}
    />
  );
}

