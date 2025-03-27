import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AppSidebar } from './_components/app-sidebar';
import { fetchCommunitiesAction } from '@/app/(home)/_actions/community-actions';
import { redirect } from 'next/navigation';
import { getAuthUserAction as getAuthUserInChainAction } from '@/app/[alias]/(dashboard)/_actions/admin-actions';
import { getAuthUserAction as getAuthUserInAppAction } from '@/app/(home)/_actions/user-actions';
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

  const userInChain = await getAuthUserInChainAction({
    chainId: chainId
  });

  const userInApp = await getAuthUserInAppAction();

  if (!userInChain || !userInApp) {
    redirect('/login');
  }

  const { role: userRoleInApp } = userInApp;
  const accessList =
    userInChain?.admin_community_access.map((access) => access.alias) ?? [];

  if (userRoleInApp === 'user' && !accessList.includes(alias)) {
    const alias = accessList[0];
    document.cookie = `lastViewedAlias=${alias}; path=/; max-age=31536000`;
    redirect(`/${alias}`);
  }

  const { communities } = await fetchCommunitiesAction({});

  return (
    <SidebarProvider>
      <AppSidebar
        admin={userInApp}
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
