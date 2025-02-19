import { columns, AProfile, skeletonColumns } from './columns';
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

/**
 * Columns:
 * 1. account
 * 2. username
 * 3. name
 * 4. image
 * 5. created_at
 * 6. updated_at
*/

export const sampleProfiles: AProfile[] = [
  {
    account: '0x0000000000000000000000000000000000000000',
    username: '@anonymous',
    name: 'Anonymous',
    image:
      'https://ipfs.internal.citizenwallet.xyz/QmeuAaXrJBHygzAEHnvw5AKUHfBasuavsX9fU69rdv4mhh',
    created_at: '2024-10-27 11:48:44.505068+00',
    updated_at: '2024-10-27 11:48:44.505068'
  },
  {
    account: '0x11915308B4493D3Ecc3E729d1f13b46dC90Ba821',
    username: 'a3wi',
    name: 'Adrien Willems',
    image:
      'https://ipfs.internal.citizenwallet.xyz/QmZGDdmDzRtBuMB1NSKvthtqmCH5DXubSzpZ5VVLg11ZUX',
    created_at: '2024-10-27 12:04:12.503972+00',
    updated_at: '2024-10-27 12:04:12.503972'
  },
  {
    account: '0x230c1737aB6A813cCBDd4140E97DfD509AB46647',
    username: 'fridge-pos',
    name: 'Common Fridge',
    image:
      'https://ipfs.internal.citizenwallet.xyz/QmSLcLgBYXSTwhbnrFVtGKpco3FUS4Z7Wf9wwRrS2ah4zQ',
    created_at: '2024-10-27 11:48:42.760372+00',
    updated_at: '2024-10-27 11:48:42.760372'
  }
];

const placeholderData: AProfile[] = Array(5).fill({
  account: '',
  username: '',
  name: '',
  image: '',
  created_at: '',
  updated_at: ''
});

export default async function MembersPage(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const { alias } = await props.params;
  const { query, page } = await props.searchParams;

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
              {getMembers()}
            </Suspense>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function getMembers() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <ServerDataTable<AProfile>
      columns={columns}
      rows={sampleProfiles}
      total={sampleProfiles.length}
      totalPages={1}
    />
  );
}
