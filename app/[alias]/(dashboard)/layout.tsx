import { getAuthUserAction } from '@/app/_actions/user-actions';
import { auth } from '@/auth';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { getServiceRoleClient } from '@/services/top-db';
import {
  getCommunities,
  getCommunityByAlias
} from '@/services/top-db/community';
import { CommunityConfig, getAccountBalance } from '@citizenwallet/sdk';
import { formatUnits } from 'ethers';
import { redirect } from 'next/navigation';
import { AppSidebar } from './_components/app-sidebar';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await params;
  let hasAccess = false;

  const client = getServiceRoleClient();

  const { data: communityRow, error } = await getCommunityByAlias(
    client,
    alias
  );

  if (error || !communityRow) {
    redirect('/');
  }


  const community_chain_id = communityRow.chain_id;

  const response = await getAuthUserAction({ chain_id: community_chain_id });

  if (!response || !response.data) {
    redirect(`/${alias}/login`);
  }
  const { data: user } = response;

  const { role } = user;
  const accessList = user?.users_community_access.map((access) => access) ?? [];

  if (role === 'user' && accessList.length < 1) {
    redirect('/');
  }

  if (role === 'user' && accessList.length > 0) {
    const chain_id = accessList[0].chain_id;

    if (chain_id == community_chain_id && accessList[0].alias == alias) {
      hasAccess = true;
    }
  }

  if (role === 'admin') {
    hasAccess = true;
  }

  const { data: communities, error: communitiesError } = await getCommunities(client);
  if (communitiesError || !communities) {
    redirect('/');
  }


  const session = await auth();
  const { data: ctzn_data, error: ctzn_error } = await getCommunityByAlias(client, 'ctzn');

  if (ctzn_error || !ctzn_data) {
    throw new Error('Failed to get CTZN community by alias');
  }

  const ctzn_config = ctzn_data.json;
  const ctzn_communityConfig = new CommunityConfig(ctzn_config);
  const balance = await getAccountBalance(
    ctzn_communityConfig,
    session?.user?.address ?? ''
  );

  return (
    <SidebarProvider>
      <AppSidebar
        user={user}
        communities={communities.map((community) => community.json)}
        config={communityRow.json}
        active={communityRow.active}
        hasAccess={hasAccess}
        userAccountBalance={balance ? Number(formatUnits(balance, ctzn_communityConfig.getToken().decimals)) : 0}
        userAddress={session?.user?.address ?? ''}
      />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <main className="flex flex-col items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
