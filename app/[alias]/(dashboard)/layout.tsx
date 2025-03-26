import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AppSidebar } from './_components/app-sidebar';
import { fetchCommunitiesOfChainAction } from '@/app/[alias]/(dashboard)/_actions/community-actions';
import { redirect } from 'next/navigation';
import { getAdminAction } from '@/app/[alias]/(dashboard)/_actions/admin-actions';
import { fetchCommunityByAliasAction } from '@/app/[alias]/(dashboard)/_actions/community-actions';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ alias: string }>;
}) {

  const { alias } = await params;
  const { community: config } = await fetchCommunityByAliasAction(alias);
  const { chain_id: chainId } = config.community.primary_token;

  const admin = await getAdminAction({
    chainId: chainId
  });

  if (!admin) {
    redirect('/login');
  }

  const accessList =
    admin?.admin_community_access.map((access) => access.alias) ?? [];

  if (!accessList.includes(alias)) {
    redirect('/');
  }

  const { communities } = await fetchCommunitiesOfChainAction({
    chainId: chainId,
    accessList: accessList
  });

  return (
    <SidebarProvider>
      <AppSidebar
        admin={admin}
        communities={communities}
        selectedAlias={alias}
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
