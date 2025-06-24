import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { AppSidebar } from './_components/app-sidebar';
import { fetchCommunitiesAction } from '@/app/_actions/community-actions';
import { redirect } from 'next/navigation';
import { getAuthUserAction } from '@/app/_actions/user-actions';
import { getCommunity } from '@/services/cw';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ alias: string }>;
}) {
  const { alias } = await params;
  let hasAccess = false;


  const { community } = await getCommunity(alias);
  const community_chain_id = community.community.primary_token.chain_id;

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


  const { communities } = await fetchCommunitiesAction({ alias });

  return (
    <SidebarProvider>
      <AppSidebar user={user} communities={communities} config={community} hasAccess={hasAccess} />
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
