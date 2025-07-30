import UrlSearch from '@/components/custom/url-button-search';
import { DataTable } from '@/components/ui/data-table';
import { getServiceRoleClient } from '@/services/top-db';
import { getCommunityByAlias } from '@/services/top-db/community';
import { Suspense } from 'react';
import AddMember from './_components/add-member';
import SwitcherButton from './_components/switcher-button';
import { placeholderData, skeletonColumns } from './_table/columns';
import MembersTable from './_table/members-table';
import {
  CommunityConfig,
  Config,
  getTwoFAAddress,
  hasProfileAdminRole as CWHasProfileAdminRole
} from '@citizenwallet/sdk';
import { auth } from '@/auth';

export default async function Page(props: {
  params: Promise<{ alias: string }>;
  searchParams: Promise<{
    query?: string;
    page?: string;
    showAll?: string;
  }>;
}) {
  const session = await auth();
  if (!session) {
    throw new Error('You are not logged in');
  }
  const { email } = session.user;
  if (!email) {
    throw new Error('You are not logged in');
  }

  const { alias } = await props.params;

  const client = getServiceRoleClient();
  const { data, error } = await getCommunityByAlias(client, alias);

  if (error || !data) {
    throw new Error('Failed to get community by alias');
  }

  const config = data.json;

  const {
    query: queryParam,
    page: pageParam,
    showAll: showAllParam
  } = await props.searchParams;
  const query = queryParam || '';
  const page = pageParam || '1';
  const showAllMembers = showAllParam || 'false';

  const communityConfig = new CommunityConfig(config);

  const twoFAAddress = await getTwoFAAddress({
    community: communityConfig,
    source: email,
    type: 'email'
  });

  const hasProfileAdminRole = await CWHasProfileAdminRole(
    communityConfig,
    twoFAAddress ?? ''
  );

  return (
    <div className="flex flex-1 w-full flex-col h-full">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-sm text-gray-500">{config.community.name}</p>
        </div>
        <div className="flex justify-end gap-2">
          <AddMember config={config} />
          <div className="flex flex-col">
            <UrlSearch config={config} />
            <div className="h-2" />
            <SwitcherButton />
          </div>
        </div>
      </div>

      <Suspense
        key={alias + query + page + showAllMembers}
        fallback={<Fallback />}
      >
        <MembersTable
          query={query}
          page={Number(page)}
          config={config}
          showAllMembers={showAllMembers === 'true'}
          hasProfileAdminRole={hasProfileAdminRole}
        />
      </Suspense>
    </div>
  );
}

function Fallback() {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto rounded-md border">
        <DataTable columns={skeletonColumns} data={placeholderData} />
      </div>
    </div>
  );
}
